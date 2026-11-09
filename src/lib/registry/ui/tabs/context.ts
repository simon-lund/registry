import { getContext, hasContext, setContext } from 'svelte';
import type { ViewSide } from '#lib/registry/ui/view-change/index.js';

/*
 * Shared between the Tabs parts. Not exported from index.ts: the parts are the API.
 *
 * The list renders its triggers twice: once for real (bits-ui triggers, focus, keyboard)
 * and once as an inert, active-styled copy inside the moving key. A trigger finds out
 * which of the two it is through the COPY context.
 */

/** A trigger's box in the list's own (unscaled) coordinates. */
export type TabsRect = { x: number; y: number; w: number; h: number };

const ROOT = Symbol('tabs');
const LIST = Symbol('tabs-list');
const COPY = Symbol('tabs-copy');

/**
 * What the control means to assistive tech, mutually exclusive:
 * - `tabs`: a tablist whose segments switch panels or views (role tablist / tab);
 * - `radio`: a single choice with no panels, e.g. a setting (role radiogroup / radio,
 *   aria-checked). Same look, motion and keys (arrows move and select, Home/End, loop).
 */
export type TabsMode = 'tabs' | 'radio';

export type TabsRootContext = {
	readonly value: string;
	readonly mode: TabsMode;
	/** The side the selected panel comes in from; undefined on the first paint and after a key step. */
	readonly from: ViewSide | undefined;
	/** The list reports where the selection went (it knows the segments' boxes). */
	moved(from: ViewSide | undefined): void;
};

export type TabsListContext = {
	/** Measured trigger boxes by tab value; empty until the first measurement. */
	readonly rects: Record<string, TabsRect>;
	/** Called by a real trigger once it has an element; returns the deregistration. */
	register(value: string, el: HTMLElement): () => void;
};

export function setTabsRoot(ctx: TabsRootContext) {
	setContext(ROOT, ctx);
}

export function getTabsRoot(part: string): TabsRootContext {
	if (!hasContext(ROOT)) throw new Error(`<${part}> must be used inside <Tabs>`);
	return getContext(ROOT);
}

export function setTabsList(ctx: TabsListContext) {
	setContext(LIST, ctx);
}

export function getTabsList(part: string): TabsListContext {
	if (!hasContext(LIST)) throw new Error(`<${part}> must be used inside <TabsList>`);
	return getContext(LIST);
}

export function setTabsCopy() {
	setContext(COPY, true);
}

/** True inside the key's copy of the labels. */
export function isTabsCopy(): boolean {
	return hasContext(COPY);
}
