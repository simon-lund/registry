/*
 * The physics of a swipe, shared by SwipeDeckCard and the Toaster. Behaviour only: no
 * markup, no copy, no defaults. Every number a gesture is tuned by is passed in by its caller,
 * because the callers differ on purpose (a toast dismisses more easily than a card commits).
 * Pointer handling, axis locking, zones and layout stay in each component.
 */

/**
 * The numbers a swiped card is tuned by. SwipeDeck passes this object. A named preset, never a
 * default: pass it explicitly.
 */
export const CARD_SWIPE_GESTURE = {
	/** px before the axis locks */
	slop: 8,
	/** px an armed zone holds below its threshold */
	hysteresis: 6,
	/** px/ms: faster than this toward a side is a flick */
	flick: 0.5,
	/** px out before a flick counts */
	flickMin: 16,
	/** px a side without zones can be pulled, asymptotically */
	rubber: 32,
	/** ms: a finger that paused this long before lifting has no velocity */
	stale: 60,
	/** ms of samples the velocity is measured over */
	window: 100,
	/** The way home: stiffness 400, damping ratio 0.78 (one whisper of overshoot). */
	spring: { stiffness: 400, dampingRatio: 0.78 }
} as const;

/**
 * Rubber band: how far something pulled `d` px moves when it can give at most `max` px, closing
 * in on `max` asymptotically. Keeps the sign of `d`.
 *
 * @example
 * el.style.translate = `${rubber(dx, 32)}px 0`; // pulled 100px, moves about 24px
 */
export function rubber(d: number, max: number): number {
	const a = Math.abs(d);
	return Math.sign(d) * max * (1 - 1 / (a / max + 1));
}

/**
 * How long something `dist` px from its exit takes to leave at `speed` px/ms, on an ease-out:
 * ease-out leaves at 3 × its average speed, so this keeps the finger's speed, bounded to
 * `quick`–`base` ms. No speed (a key, a call): `base`.
 *
 * @example
 * tween(duration = exitDuration(Math.abs(to - x), Math.abs(v), quick, base))
 */
export function exitDuration(dist: number, speed: number, quick: number, base: number): number {
	return speed > 0 ? Math.min(base, Math.max(quick, (3 * dist) / speed)) : base;
}

/**
 * The finger's velocity at release, from the samples of its last `window` ms. One per gesture:
 * `push` every move, `velocity` on release.
 *
 * @example
 * const samples = new VelocityTracker(100);
 * samples.push(event.timeStamp, x);          // pointermove
 * const v = samples.velocity(event.timeStamp, 60).x; // pointerup, px/ms
 */
export class VelocityTracker {
	#window: number;
	#samples: { t: number; x: number; y: number }[] = [];

	/** `window`: ms of samples kept (at least two are always kept). */
	constructor(window: number) {
		this.#window = window;
	}

	/** One position at `t` (an event's `timeStamp`). */
	push(t: number, x: number, y = 0) {
		const s = this.#samples;
		s.push({ t, x, y });
		while (s.length > 2 && t - s[0].t > this.#window) s.shift();
	}

	/**
	 * px/ms on each axis at `at`; zero when there are fewer than two samples, or the last one is
	 * more than `stale` ms old (a finger that rested before lifting has no velocity).
	 */
	velocity(at: number, stale: number): { x: number; y: number } {
		const s = this.#samples;
		if (s.length < 2 || at - s[s.length - 1].t > stale) return { x: 0, y: 0 };
		const first = s[0];
		const last = s[s.length - 1];
		const dt = last.t - first.t;
		if (dt <= 0) return { x: 0, y: 0 };
		return { x: (last.x - first.x) / dt, y: (last.y - first.y) / dt };
	}
}

/** A spring's tuning. `timeScale` speeds time up (>1) or slows it down (<1). */
export type SwipeSpring = { stiffness: number; dampingRatio: number; timeScale: number };

/**
 * One rAF-driven motion at a time for one swiped thing: a new `tween` or `spring` (or `stop`)
 * ends the one before. A `done` callback may start the next motion.
 *
 * @example
 * const motion = new SwipeMotion();
 * motion.tween(duration, cubicOut, (e) => setX(from + (to - from) * e), finish);
 * motion.spring(() => [x], ([nx]) => setX(nx), [v], { stiffness: 400, dampingRatio: 0.78, timeScale }, home);
 */
export class SwipeMotion {
	#raf = 0;

	/** A motion is running. */
	get running() {
		return this.#raf !== 0;
	}

	/** Ends the running motion where it is. */
	stop() {
		if (this.#raf) cancelAnimationFrame(this.#raf);
		this.#raf = 0;
	}

	/**
	 * Over `duration` ms: `frame(eased, p)` every frame (`p` linear 0–1, `eased` = `ease(p)`), then
	 * `done`. A `duration` of 0 or less calls `frame(ease(1), 1)` and `done` at once.
	 */
	tween(duration: number, ease: (p: number) => number, frame: (eased: number, p: number) => void, done?: () => void) {
		this.stop();
		if (duration <= 0) {
			frame(ease(1), 1);
			done?.();
			return;
		}
		// performance.now(), not the frame timestamp: that can predate this call.
		const start = performance.now();
		const step = () => {
			const p = Math.min(1, (performance.now() - start) / duration);
			frame(ease(p), p);
			if (p < 1) this.#raf = requestAnimationFrame(step);
			else {
				this.#raf = 0;
				done?.();
			}
		};
		this.#raf = requestAnimationFrame(step);
	}

	/**
	 * Home to 0 on every axis, on a damped spring that starts with velocity `v0` (px/ms per axis).
	 * `read` gives the current position each frame, `write` sets the next one. At rest (within
	 * 0.3px, slower than 6px/s) it stops and calls `done`, without writing: `done` puts it at 0.
	 * Integrated in 8 substeps per frame; a frame gap longer than 64ms counts as 64ms.
	 */
	spring(
		read: () => number[],
		write: (pos: number[]) => void,
		v0: number[],
		{ stiffness, dampingRatio, timeScale }: SwipeSpring,
		done: () => void
	) {
		this.stop();
		const K = stiffness;
		const C = 2 * Math.sqrt(K) * dampingRatio;
		const v = v0.map((u) => u * 1000); // px/s
		let last = performance.now();
		const step = () => {
			const now = performance.now();
			const dt = (Math.min(64, now - last) / 1000) * timeScale;
			last = now;
			const pos = read().slice();
			for (let i = 0; i < 8; i++) {
				for (let a = 0; a < pos.length; a++) {
					v[a] += (-K * pos[a] - C * v[a]) * (dt / 8);
					pos[a] += v[a] * (dt / 8);
				}
			}
			if (Math.hypot(...pos) < 0.3 && Math.hypot(...v) < 6) {
				this.#raf = 0;
				done();
				return;
			}
			write(pos);
			this.#raf = requestAnimationFrame(step);
		};
		this.#raf = requestAnimationFrame(step);
	}
}

/**
 * Swallows the click that ends a drag, so it never ticks, opens or follows what is under the
 * finger. `arm()` on a drag's pointerup; `swallow(event)` from the element's `onclickcapture`.
 * Armed only until the end of the task: a click that never comes (pointercancel, a drag that
 * ended off the element) cannot eat a later keyboard or assistive-tech click.
 *
 * @example
 * const clicks = new ClickSwallow();
 * // pointerup after a drag
 * clicks.arm();
 * // <div onclickcapture={(e) => { if (!clicks.swallow(e)) onclickcapture?.(e); }}>
 */
export class ClickSwallow {
	#armed = false;

	/** The next click (in this task) is swallowed. */
	arm() {
		this.#armed = true;
		setTimeout(() => (this.#armed = false), 0);
	}

	/** Not any more (a new press began). */
	disarm() {
		this.#armed = false;
	}

	/** Stops and cancels `event` when armed (and disarms); returns whether it did. */
	swallow(event: Event): boolean {
		if (!this.#armed) return false;
		this.#armed = false;
		event.preventDefault();
		event.stopPropagation();
		return true;
	}
}
