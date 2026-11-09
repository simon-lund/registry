<script lang="ts" module>
	import type { SwipeDeckDirection } from './context.svelte.js';

	/** Where each direction commits, as a fraction of the card's width (0–1). */
	export type SwipeDeckThresholds = Partial<Record<SwipeDeckDirection, number>>;

	/** Where a card commits unless `thresholds` says otherwise: 22% of its width. */
	export const SWIPE_DECK_THRESHOLDS: Required<SwipeDeckThresholds> = {
		left: 0.22,
		right: 0.22,
		up: 0.22
	};
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { SvelteMap } from 'svelte/reactivity';
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import {
		CARD_SWIPE_GESTURE as G,
		ClickSwallow,
		SwipeMotion,
		VelocityTracker,
		exitDuration,
		rubber
	} from '#lib/registry/ui/swipe/index.js';
	import {
		getSwipeDeck,
		motionMs,
		setSwipeDeckCard,
		type SwipeDeckCardHandle,
		type SwipeDeckCardPhase,
		type SwipeDeckVia
	} from './context.svelte.js';

	/**
	 * SwipeDeckCard: one card of the deck, any content (give it `h-full`, so every card is as tall as
	 * the tallest, and its own surface, border and `rounded-lg`). `value` is its identity in `onSwipe`
	 * and `onUndo`; key the `#each` by it. Put a SwipeDeckLabel inside for each direction it can go.
	 *
	 * Only the top card is live; the ones behind are `inert`, sit lower and narrower, and wear a blank
	 * face, one step closer to the ground per card. Set `--swipe-deck-face` if your card's surface is
	 * not `--card`, and `--swipe-deck-radius` if it is not `rounded-lg`. Only the card under the
	 * pointer has a shadow. A click that ends a drag is swallowed, so a link or checkbox inside does
	 * not fire.
	 *
	 * @example
	 * <SwipeDeckCard value={article.id}>
	 *   <SwipeDeckLabel direction="right"><BookmarkIcon />Save</SwipeDeckLabel>
	 *   <div class="bg-card h-full rounded-lg border p-5">...</div>
	 * </SwipeDeckCard>
	 */
	let {
		ref = $bindable(null),
		class: className,
		value,
		thresholds,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
		/** The card's identity, unique in the deck. */
		value: string;
		/** Fractions of the card's width; default 0.22 for every direction. */
		thresholds?: SwipeDeckThresholds;
	} = $props();

	// The gesture's numbers (slop, hysteresis, flick, rubber band, spring) are the swipe item's
	// preset. These two are the deck's own.
	const TILT = 12; // degrees of rotation per card width dragged
	const BEYOND = 48; // px past its own edge a leaving card travels (fading out on the way)

	const deck = getSwipeDeck('SwipeDeckCard');

	let body: HTMLElement | null = $state(null);
	let phase = $state<SwipeDeckCardPhase>('idle');
	let direction = $state<SwipeDeckDirection | null>(null);
	let armed = $state<SwipeDeckDirection | null>(null);
	const labels = new SvelteMap<SwipeDeckDirection, HTMLElement>();

	// Not reactive: written every frame, read by the gesture only.
	let x = 0;
	let y = 0;
	let width = 0;
	let height = 0;
	let axis: 'x' | 'y' = 'x';
	let tiltSign = 1;
	const motion = new SwipeMotion();
	const clicks = new ClickSwallow();

	const handle: SwipeDeckCardHandle = {
		get el() {
			return ref;
		},
		directions: labels,
		fly: (d, via) => flyTo(d, via),
		comeBack: (d) => returnFrom(d)
	};
	// At init, so the first render already knows the order; `value` is the card's identity.
	// svelte-ignore state_referenced_locally
	const unregister = deck.register(value, handle);
	$effect(() => {
		if (ref) deck.sortByDocument();
	});

	setSwipeDeckCard({
		get direction() {
			return direction;
		},
		get armed() {
			return armed;
		},
		registerLabel(d, el) {
			labels.set(d, el);
			return () => {
				if (labels.get(d) === el) labels.delete(d);
			};
		}
	});

	const depth = $derived(deck.depthOf(value));
	const top = $derived(depth === 0);
	const live = $derived(top && phase !== 'leaving' && phase !== 'gone');

	// ── measuring ──
	function measure() {
		width = body?.offsetWidth ?? 0;
		height = body?.offsetHeight ?? 0;
	}
	function px(d: SwipeDeckDirection) {
		return { ...SWIPE_DECK_THRESHOLDS, ...thresholds }[d] * width;
	}
	/** How far the card is out toward `d`. */
	function along(d: SwipeDeckDirection) {
		return d === 'right' ? x : d === 'left' ? -x : -y;
	}

	// ── position ──
	function setPos(nx: number, ny: number) {
		x = nx;
		y = ny;
		if (body) {
			body.style.translate = x || y ? `${x}px ${y}px` : '';
			const deg = width ? TILT * Math.max(-1.5, Math.min(1.5, x / width)) * tiltSign : 0;
			body.style.rotate = Math.abs(deg) > 0.01 ? `${deg.toFixed(2)}deg` : '';
		}
		const next: SwipeDeckDirection | null =
			axis === 'y' ? (y < -0.5 ? 'up' : null) : x > 0.5 ? 'right' : x < -0.5 ? 'left' : null;
		if (next !== direction) direction = next;
		const progress =
			next && labels.has(next) && width ? Math.min(1, Math.max(0, along(next)) / Math.max(1, px(next))) : 0;
		ref?.style.setProperty('--swipe-progress', progress.toFixed(3));
		if (top && (phase === 'dragging' || phase === 'settling')) deck.setPull(progress, true);
	}
	const damp = (v: number) => rubber(v, G.rubber);
	/** The finger's offset → the card's: 1:1 toward a direction with a label, damped elsewhere. */
	function shape(rawX: number, rawY: number): [number, number] {
		if (axis === 'x') {
			const d = rawX > 0 ? 'right' : 'left';
			return [labels.has(d) ? rawX : damp(rawX), damp(rawY)];
		}
		return [damp(rawX), rawY < 0 && labels.has('up') ? rawY : damp(rawY)];
	}
	function armedAt(): SwipeDeckDirection | null {
		const reached = (d: SwipeDeckDirection) =>
			labels.has(d) && along(d) >= px(d) - (armed === d ? G.hysteresis : 0);
		if (axis === 'y') return y < 0 && reached('up') ? 'up' : null;
		if (x > 0 && reached('right')) return 'right';
		if (x < 0 && reached('left')) return 'left';
		return null;
	}
	function setArmed(next: SwipeDeckDirection | null) {
		if (next !== armed) armed = next;
	}
	function endPull() {
		if (top) deck.setPull(0, false);
	}

	// ── motion ──
	function stop() {
		motion.stop();
	}
	/** From here to (toX, toY), ease-out; `opacity(p)` fades the card along the way. */
	function tween(
		toX: number,
		toY: number,
		duration: number,
		opacity: ((p: number) => number) | null,
		done: () => void
	) {
		stop();
		const fromX = x;
		const fromY = y;
		if (duration <= 0) {
			setPos(toX, toY);
			if (opacity && body) body.style.opacity = String(opacity(1));
			done();
			return;
		}
		motion.tween(
			duration,
			cubicOut,
			(e, p) => {
				setPos(fromX + (toX - fromX) * e, fromY + (toY - fromY) * e);
				if (opacity && body) body.style.opacity = String(opacity(p));
			},
			done
		);
	}
	/**
	 * Home, on the preset's spring (stiffness 400, damping ratio 0.78: one whisper of overshoot),
	 * starting with the release velocity. Time runs at 220 / --dur-base, so a slower theme slows it.
	 */
	function settle(vx = 0, vy = 0) {
		stop();
		if (prefersReducedMotion.current || (x === 0 && y === 0)) {
			setPos(0, 0);
			phase = 'idle';
			endPull();
			return;
		}
		phase = 'settling';
		const timeScale = 220 / Math.max(1, motionMs(ref, '--dur-base', 220));
		motion.spring(
			() => [x, y],
			([nx, ny]) => setPos(nx, ny),
			[vx, vy],
			{ ...G.spring, timeScale },
			() => {
				setPos(0, 0);
				phase = 'idle';
				endPull();
			}
		);
	}
	/** Where a card leaving toward `d` ends up. */
	function exitFor(d: SwipeDeckDirection): [number, number] {
		if (d === 'up') return [x, -(height + BEYOND)];
		return [(d === 'right' ? 1 : -1) * (width + BEYOND), y];
	}
	/**
	 * Off its own edge, carrying the release velocity (quick to base, ease-out), fading over the
	 * second half so it never needs much room. Reduced motion: it fades where it is.
	 */
	function leave(d: SwipeDeckDirection, vx: number, vy: number) {
		stop();
		phase = 'leaving';
		const done = () => {
			phase = 'gone';
		};
		const base = motionMs(ref, '--dur-base', 220);
		if (prefersReducedMotion.current) {
			tween(x, y, base, (p) => 1 - p, done);
			return;
		}
		const quick = motionMs(ref, '--dur-quick', 140);
		let [toX, toY] = exitFor(d);
		const speed = Math.abs(d === 'up' ? vy : vx);
		const dist = d === 'up' ? Math.abs(toY - y) : Math.abs(toX - x);
		// Keeps the finger's speed (see exitDuration).
		const duration = exitDuration(dist, speed, quick, base);
		// The other axis keeps its own momentum, bounded.
		const limit = (v: number, m: number) => Math.max(-m, Math.min(m, v));
		if (d === 'up') toX += limit((vx * duration) / 3, width / 2);
		else toY += limit((vy * duration) / 3, height / 2);
		tween(toX, toY, duration, (p) => (p < 0.5 ? 1 : 1 - (p - 0.5) * 2), done);
	}
	function commitTo(d: SwipeDeckDirection, via: SwipeDeckVia, vx: number, vy: number) {
		setArmed(d);
		deck.setPull(0, false);
		if (!deck.commit(value, d, via)) {
			setArmed(null);
			settle(vx, vy);
			return;
		}
		leave(d, vx, vy);
	}
	function flyTo(d: SwipeDeckDirection, via: SwipeDeckVia) {
		if (!live || phase === 'dragging' || !labels.has(d)) return;
		measure();
		axis = d === 'up' ? 'y' : 'x';
		if (x === 0 && y === 0) tiltSign = 1;
		commitTo(d, via, 0, 0);
	}
	/** Undo: back from where it left (or from where it is, if still flying), the reverse motion. */
	function returnFrom(d: SwipeDeckDirection) {
		stop();
		release();
		measure();
		axis = d === 'up' ? 'y' : 'x';
		setArmed(null);
		const wasGone = phase === 'gone';
		phase = 'settling';
		if (prefersReducedMotion.current) {
			setPos(0, 0);
			deck.setPull(0, false);
			if (body) body.style.opacity = '0';
			tween(0, 0, motionMs(ref, '--dur-base', 220), (p) => p, finishReturn);
			return;
		}
		if (wasGone || (x === 0 && y === 0)) {
			const [ex, ey] = exitFor(d);
			setPos(ex, d === 'up' ? ey : 0);
		}
		const fromOpacity = Number(body?.style.opacity || 1);
		tween(0, 0, motionMs(ref, '--dur-calm', 320), (p) => Math.min(1, fromOpacity + p * 2), finishReturn);
	}
	function finishReturn() {
		if (body) body.style.opacity = '';
		phase = 'idle';
		endPull();
	}

	// ── pointer ──
	type Gesture = {
		id: number;
		downX: number;
		downY: number;
		originX: number;
		originY: number;
		axis: 'x' | 'y' | null;
		samples: VelocityTracker;
	};
	let gesture: Gesture | null = null;

	function handlePointerDown(event: PointerEvent) {
		// One pointer at a time; a second finger never takes over.
		if (!live || gesture || event.defaultPrevented) return;
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		stop(); // catch a settling card where it is
		clicks.disarm();
		if (x === 0 && y === 0 && body) {
			// Held below its middle, a card turns the other way.
			const r = body.getBoundingClientRect();
			tiltSign = event.clientY > r.top + r.height / 2 ? -1 : 1;
		}
		gesture = {
			id: event.pointerId,
			downX: event.clientX,
			downY: event.clientY,
			originX: x,
			originY: y,
			axis: null,
			samples: new VelocityTracker(G.window)
		};
		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerUp);
		window.addEventListener('pointercancel', handlePointerUp);
	}
	function release() {
		gesture = null;
		window.removeEventListener('pointermove', handlePointerMove);
		window.removeEventListener('pointerup', handlePointerUp);
		window.removeEventListener('pointercancel', handlePointerUp);
	}
	function handlePointerMove(event: PointerEvent) {
		const g = gesture;
		if (!g || event.pointerId !== g.id) return;
		const mx = event.clientX - g.downX;
		const my = event.clientY - g.downY;
		if (!g.axis) {
			if (Math.abs(mx) < G.slop && Math.abs(my) < G.slop) return;
			if (Math.abs(mx) <= Math.abs(my) && !labels.has('up')) {
				// Vertical, and the card cannot go up: the page scrolls (pan-y); a caught card goes home.
				release();
				if (x !== 0 || y !== 0) settle(0, 0);
				return;
			}
			g.axis = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
			axis = g.axis;
			measure();
			phase = 'dragging';
			try {
				body?.setPointerCapture(event.pointerId);
			} catch {
				/* the pointer may already be gone */
			}
		}
		const [nx, ny] = shape(g.originX + mx, g.originY + my);
		setPos(nx, ny);
		setArmed(armedAt());
		g.samples.push(event.timeStamp, nx, ny);
	}
	function handlePointerUp(event: PointerEvent) {
		const g = gesture;
		if (!g || event.pointerId !== g.id) return;
		release();
		if (!g.axis) {
			// A tap. A card caught mid-settle finishes going home.
			if (x !== 0 || y !== 0) settle(0, 0);
			return;
		}
		// The click that ends a drag must not reach what is inside the card.
		clicks.arm();
		if (event.type === 'pointercancel') {
			setArmed(null);
			settle(0, 0);
			return;
		}
		const { x: vx, y: vy } = g.samples.velocity(event.timeStamp, G.stale);
		const v = axis === 'x' ? vx : vy;
		const at = axis === 'x' ? x : y;
		let target = armed;
		let via: SwipeDeckVia = 'drag';
		if (Math.abs(v) > G.flick) {
			if (Math.sign(v) !== Math.sign(at)) target = null; // flicked back: cancel
			else if (!target && Math.abs(at) >= G.flickMin) {
				const d: SwipeDeckDirection | null = axis === 'x' ? (v > 0 ? 'right' : 'left') : v < 0 ? 'up' : null;
				if (d && labels.has(d)) {
					target = d;
					via = 'flick';
				}
			}
		}
		if (target) commitTo(target, via, vx, vy);
		else {
			setArmed(null);
			settle(vx, vy);
		}
	}
	function handleClickCapture(event: MouseEvent) {
		clicks.swallow(event);
	}

	// An effect's cleanup, not onDestroy: onDestroy also runs on the server, where there is no window.
	$effect(() => () => {
		stop();
		release();
		unregister();
	});
</script>

<div
	bind:this={ref}
	data-slot="swipe-deck-card"
	data-state={phase}
	data-depth={depth}
	data-top={top || undefined}
	data-direction={direction ?? undefined}
	data-armed={armed ?? undefined}
	data-beyond={depth > deck.peek || undefined}
	inert={!live}
	class={cn('card relative min-w-0', className)}
	style:--depth={Math.max(0, depth)}
	style:z-index={phase === 'leaving' || phase === 'gone' ? 60 : 50 - Math.max(0, depth)}
	{...restProps}
>
	<!-- The pointer path only; the deck's keys and SwipeDeckActions are the keyboard's. -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={body}
		data-slot="swipe-deck-card-body"
		class={cn(
			'relative h-full rounded-[var(--swipe-deck-radius,var(--radius))] transition-shadow duration-(--dur-quick) select-none [-webkit-touch-callout:none]',
			live && 'cursor-grab',
			phase === 'dragging' && 'cursor-grabbing shadow-lg'
		)}
		style:touch-action={labels.has('up') ? 'pan-up' : 'pan-y'}
		onpointerdown={handlePointerDown}
		onclickcapture={handleClickCapture}
	>
		{@render children?.()}
		<div class="face" aria-hidden="true"></div>
	</div>
</div>

<style>
	/*
	 * Its place in the stack: --d is how far behind the top it sits, 0 for the top card; the cards
	 * behind follow the top card's pull (--swipe-deck-pull, 0–1, set on the root while a gesture
	 * drives it, with the transitions off). Each step down: 9px lower, 5% narrower, scaled from the
	 * bottom edge so that edge shows under the card in front.
	 */
	.card {
		--d: clamp(0, calc(var(--depth) - var(--swipe-deck-pull, 0)), var(--swipe-deck-peek, 2));
		grid-area: 1 / 1;
		translate: 0 calc(var(--d) * var(--spacing, 4px) * 2.25);
		scale: calc(1 - var(--d) * 0.05);
		transform-origin: 50% 100%;
		transition:
			translate var(--dur-calm) var(--ease-settle),
			scale var(--dur-calm) var(--ease-settle),
			opacity var(--dur-base) var(--ease-settle);
	}
	/* Deeper than the peek: waiting, unseen, where it will appear. */
	.card[data-beyond] {
		opacity: 0;
	}
	.card[data-state='gone'] {
		visibility: hidden;
	}

	/*
	 * The blank face: over a card behind, full one step down and gone at the top; over the top card
	 * it rises with the drag (to 75% at the threshold), so the words fade back and the label reads.
	 */
	.face {
		position: absolute;
		inset: 0;
		z-index: 1;
		border-radius: inherit;
		/* One step back toward the page per card, so a stack of same-coloured cards reads as depth. */
		background: color-mix(
			in oklab,
			var(--swipe-deck-face, var(--card)),
			var(--background) calc(min(var(--d), 2) * 22%)
		);
		/* It covers the card's own border, and the stack is flat: this edge is what shows. */
		border: 1px solid var(--border);
		opacity: max(min(1, var(--d)), calc(var(--swipe-progress, 0) * 0.75));
		pointer-events: none;
		transition: opacity var(--dur-base) var(--ease-settle);
	}

	:global([data-pulling]) .card,
	:global([data-pulling]) .face {
		transition: none;
	}

	/* Reduced motion: the stack does not move; faces and cards still cross-fade. */
	@media (prefers-reduced-motion: reduce) {
		.card {
			transition: opacity var(--dur-base) var(--ease-settle);
		}
	}
</style>
