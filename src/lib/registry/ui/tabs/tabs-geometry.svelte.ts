import { tick } from 'svelte';
import { prefersReducedMotion } from 'svelte/motion';
import type { TabsRect } from './context.js';

type Options = {
	/** The scrolling track (TabsList's element). */
	list: () => HTMLElement | null;
	/** The moving key, whose clip-path transitions a jump finishes. */
	indicator: () => HTMLElement | null;
	/** The selected tab's value. */
	selected: () => string;
};

// The keys a selection by keyboard comes from: the key jumps instead of sliding.
const KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];

/*
 * TabsList's geometry: every trigger's box, measured in the track's unscaled scroll coordinates
 * (where the key, a child of the scrolling track, lives), and the track's size. It re-measures
 * on resize (the track and every trigger observed) and on webfont swaps, decides when the key
 * slides and when it jumps, and scrolls the selected segment into view. TabsList keeps markup
 * and CSS: it reads `rects` / `size` and calls `register`, `mount`, `select` and `destroy`.
 */
export class TabsGeometry {
	/** Measured trigger boxes by tab value; empty until the first measurement. */
	rects = $state<Record<string, TabsRect>>({});
	/** The key's sheet: the whole scrolled track (the visible width or the segments' extent). */
	size = $state({ w: 0, h: 0 });

	readonly #opts: Options;
	readonly #triggers = new Map<string, HTMLElement>();
	#observer: ResizeObserver | undefined;
	#selectFrame = 0;
	#measured = false;
	// Set for two frames after a selection: a re-measure caused by it (a segment that changes
	// width when selected) must keep animating rather than snap.
	#selecting = false;
	// The next selection came from an arrow key (or Home/End): the key jumps instead of sliding,
	// because the focus ring moves at once and a sliding key behind it read as an artefact.
	#keyMove = false;
	// The track's first layout shows its selected segment; later selections scroll to theirs.
	#revealed = false;

	constructor(opts: Options) {
		this.#opts = opts;
	}

	/** A real trigger's element, observed and measured; returns the deregistration. */
	register(value: string, el: HTMLElement): () => void {
		this.#triggers.set(value, el);
		this.#ensureObserver().observe(el);
		return () => {
			if (this.#triggers.get(value) === el) this.#triggers.delete(value);
			this.#observer?.unobserve(el);
			queueMicrotask(() => this.#measure(false));
		};
	}

	/** Watches the track (size, webfonts, where a selection comes from); returns the cleanup. */
	mount(list: HTMLElement): () => void {
		this.#ensureObserver().observe(list);
		// The webfont usually lands after first paint and changes every label's width.
		document.fonts?.ready.then(() => this.#measure(false));
		const onFonts = () => this.#measure(false);
		document.fonts?.addEventListener('loadingdone', onFonts);
		const onKey = (e: KeyboardEvent) => (this.#keyMove = KEYS.includes(e.key));
		const onPointer = () => (this.#keyMove = false);
		list.addEventListener('keydown', onKey, true);
		list.addEventListener('pointerdown', onPointer, true);
		return () => {
			this.#observer?.unobserve(list);
			document.fonts?.removeEventListener('loadingdone', onFonts);
			list.removeEventListener('keydown', onKey, true);
			list.removeEventListener('pointerdown', onPointer, true);
		};
	}

	/**
	 * The selection changed: scroll its segment into view (at once after a key step, smoothly
	 * otherwise), jump after a key step, and mark the next two frames so a resize it causes still
	 * slides. Reads no state, so calling it from an effect tracks nothing. Returns whether the
	 * selection came from a key step (the panels switch at once then, as the key jumps).
	 */
	select(): boolean {
		// Read now: the arrow-key flag is reset just below. A key step scrolls at once, as the key jumps.
		const byKey = this.#keyMove;
		const smooth = !byKey;
		if (this.#revealed) queueMicrotask(() => this.#reveal(smooth));
		if (this.#keyMove) {
			this.#keyMove = false;
			this.#jump();
		}
		this.#selecting = true;
		cancelAnimationFrame(this.#selectFrame);
		this.#selectFrame = requestAnimationFrame(() => {
			this.#selectFrame = requestAnimationFrame(() => (this.#selecting = false));
		});
		return byKey;
	}

	destroy() {
		this.#observer?.disconnect();
		// onDestroy also runs during SSR, where there is no cancelAnimationFrame (the page would 500).
		if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(this.#selectFrame);
	}

	#ensureObserver() {
		this.#observer ??= new ResizeObserver(() => this.#measure(this.#selecting));
		return this.#observer;
	}

	/**
	 * The key jumps instead of sliding (first paint, resize, font swap, a key step): once the new
	 * box is rendered, the clip-path transitions it started are finished on the spot.
	 */
	#jump() {
		void tick().then(() => {
			for (const a of this.#opts.indicator()?.getAnimations({ subtree: true }) ?? [])
				if (a instanceof CSSTransition && a.transitionProperty === 'clip-path') a.finish();
		});
	}

	/**
	 * Read every trigger's box in the list's unscaled scroll coordinates (where the indicator, a
	 * child of the scrolling track, lives), so a scroll never needs a re-measure.
	 */
	#measure(animate: boolean) {
		const list = this.#opts.list();
		// Hidden (display: none, a closed sheet): keep the last good boxes until it shows again.
		if (!list || !list.offsetWidth) return;
		const lr = list.getBoundingClientRect();
		// A scaled ancestor (a transform, a zoomed preview) scales every box alike; undo it.
		const scale = lr.width / list.offsetWidth || 1;
		// The key is placed inside the track's border (its padding box): measure from there.
		const bl = list.clientLeft;
		const bt = list.clientTop;
		const next: Record<string, TabsRect> = {};
		let extent = 0;
		for (const [value, el] of this.#triggers) {
			const r = el.getBoundingClientRect();
			const box = {
				x: (r.left - lr.left) / scale - bl + list.scrollLeft,
				y: (r.top - lr.top) / scale - bt,
				w: r.width / scale,
				h: r.height / scale
			};
			next[value] = box;
			extent = Math.max(extent, box.x + box.w);
		}
		// The indicator spans the whole scrolled track: the visible width, or the segments' extent.
		const contentW = extent + (parseFloat(getComputedStyle(list).paddingRight) || 0);
		// The very first placement never slides in from nowhere.
		if (!animate || !this.#measured) {
			this.#measured = true;
			this.#jump();
		}
		this.size = { w: Math.max(lr.width / scale - 2 * bl, contentW), h: lr.height / scale - 2 * bt };
		this.rects = next;
		if (!this.#revealed) {
			this.#revealed = true;
			queueMicrotask(() => this.#reveal(false));
		}
	}

	/** Scrolls the track (only the track, never the page) so the selected segment is in view. */
	#reveal(smooth: boolean) {
		const list = this.#opts.list();
		const el = this.#triggers.get(this.#opts.selected());
		if (!list || !el || list.scrollWidth <= list.clientWidth + 1) return;
		const clear = 16;
		const left = el.offsetLeft - clear;
		const right = el.offsetLeft + el.offsetWidth + clear - list.clientWidth;
		const target = left < list.scrollLeft ? left : right > list.scrollLeft ? right : null;
		if (target === null) return;
		list.scrollTo({ left: target, behavior: smooth && !prefersReducedMotion.current ? 'smooth' : 'auto' });
	}
}
