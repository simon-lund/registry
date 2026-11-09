import { getContext, hasContext, setContext, tick as nextTick, untrack } from 'svelte';
import { prefersReducedMotion } from 'svelte/motion';

/*
 * Shared between the ScrollMap parts: the ticks in order, which of them are in view (an
 * IntersectionObserver on the scroll target, so it follows the real scroll position), the
 * jump, and the roving focus. Not exported from index.ts: the parts are the API.
 */

type TickRecord = { value: () => string; button: HTMLButtonElement };

export class ScrollMapState {
	ticks = $state<TickRecord[]>([]);
	/** Values of the ticks whose sections intersect the target's view. */
	visible = $state<Set<string>>(new Set());
	/** The tick that holds the roving tab stop. */
	focusIndex = $state<number | null>(null);

	#props: () => { target: HTMLElement | null | undefined; scrollMargin: number; side: 'left' | 'right' };
	#io: IntersectionObserver | null = null;

	constructor(props: () => { target: HTMLElement | null | undefined; scrollMargin: number; side: 'left' | 'right' }) {
		this.#props = props;
	}

	get side() {
		return this.#props().side;
	}

	get firstVisible() {
		return this.ticks.findIndex((t) => this.visible.has(t.value()));
	}
	get lastVisible() {
		for (let i = this.ticks.length - 1; i >= 0; i--) if (this.visible.has(this.ticks[i].value())) return i;
		return -1;
	}
	/** Where the roving tab stop is: the focused tick, else the first one in view, else the first. */
	get tabIndex() {
		return this.focusIndex ?? Math.max(0, this.firstVisible);
	}

	/** Called from a tick's effect: untracked, so the effect never depends on the list it changes. */
	register(rec: TickRecord) {
		untrack(() => {
			this.ticks = [...this.ticks, rec].sort((a, b) =>
				a.button.compareDocumentPosition(b.button) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
			);
		});
		return () =>
			untrack(() => {
				this.ticks = this.ticks.filter((t) => t !== rec);
			});
	}

	/** The section a value points at: the element with that id, inside the target if it holds one. */
	section(value: string): HTMLElement | null {
		const target = this.#props().target;
		return target?.querySelector<HTMLElement>(`#${CSS.escape(value)}`) ?? document.getElementById(value);
	}

	/** Watches every tick's section inside the target. Re-run when the target or the ticks change. */
	observe() {
		this.#io?.disconnect();
		const target = this.#props().target;
		if (!target || typeof IntersectionObserver === 'undefined') return;
		const byEl = new Map<Element, string>();
		const seen = new Set<string>();
		this.#io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					const v = byEl.get(e.target);
					if (v === undefined) continue;
					if (e.isIntersecting) seen.add(v);
					else seen.delete(v);
				}
				this.visible = new Set(seen);
			},
			{ root: target, threshold: 0 }
		);
		for (const t of this.ticks) {
			const el = this.section(t.value());
			if (!el) continue;
			byEl.set(el, t.value());
			this.#io.observe(el);
		}
		return () => this.#io?.disconnect();
	}

	/** Scrolls the target so the section starts at its top (smooth; instant under reduced motion). */
	jump(value: string) {
		const target = this.#props().target;
		const el = this.section(value);
		if (!target || !el) return;
		const top =
			el.getBoundingClientRect().top - target.getBoundingClientRect().top + target.scrollTop - this.#props().scrollMargin;
		target.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion.current ? 'auto' : 'smooth' });
	}

	jumpBy(delta: -1 | 1) {
		const from = this.firstVisible < 0 ? 0 : this.firstVisible;
		const to = Math.min(this.ticks.length - 1, Math.max(0, from + delta));
		const t = this.ticks[to];
		if (t) this.jump(t.value());
	}

	async focusAt(index: number) {
		const i = Math.min(this.ticks.length - 1, Math.max(0, index));
		this.focusIndex = i;
		await nextTick();
		this.ticks[i]?.button.focus();
	}
}

const KEY = Symbol('registry.scroll-map');

export function setScrollMap(s: ScrollMapState) {
	return setContext(KEY, s);
}

export function getScrollMap(part: string): ScrollMapState {
	if (!hasContext(KEY)) throw new Error(`<${part}> must be used inside <ScrollMap>`);
	return getContext(KEY);
}
