/*
 * Moving focus on purpose, for overlays and anything that removes the control that has focus:
 * where focus goes when a layer closes or is left, so it never drops to <body>. No markup, no copy.
 */

const TAB_STOP =
	'a[href], area[href], button, input:not([type=hidden]), select, textarea, iframe, summary, [contenteditable]:not([contenteditable=false]), [tabindex]';

/** True when `el` can take focus right now: connected, shown, not disabled, not inside `inert`. */
export function canFocus(el: unknown): el is HTMLElement {
	if (!(el instanceof HTMLElement) || !el.isConnected) return false;
	if ((el as HTMLButtonElement).disabled) return false;
	if (el.closest('[inert]')) return false;
	if (typeof el.checkVisibility === 'function' && !el.checkVisibility({ visibilityProperty: true })) return false;
	return true;
}

/** The Tab stops inside `root`, in document order (tabindex ≥ 0, focusable now). */
export function tabStops(root: ParentNode | Element = document): HTMLElement[] {
	return Array.from(root.querySelectorAll<HTMLElement>(TAB_STOP)).filter(
		(el) => el.tabIndex >= 0 && canFocus(el)
	);
}

/**
 * The Tab stop that follows `from` in document order (`-1`: the one before it), outside `skip`
 * (a layer that is being left). Null at the end of the document.
 */
export function nextTabStop(from: Element, direction: 1 | -1 = 1, skip?: Element | null): HTMLElement | null {
	const stops = tabStops(from.ownerDocument).filter((el) => el !== from && !from.contains(el) && !skip?.contains(el));
	const after = (el: HTMLElement) => (from.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
	return direction === 1 ? (stops.find(after) ?? null) : (stops.filter((el) => !after(el)).at(-1) ?? null);
}

/** A place focus may go: an element, or a function that finds one when it is needed. */
export type FocusTarget = Element | null | undefined | (() => Element | null | undefined);

/** Focuses the first target that can take focus and returns it (null when none could). */
export function focusFirst(...targets: FocusTarget[]): HTMLElement | null {
	for (const target of targets) {
		const el = typeof target === 'function' ? target() : target;
		if (!canFocus(el)) continue;
		el.focus();
		if (document.activeElement === el) return el;
	}
	return null;
}

/**
 * True when focus is nowhere useful after `layer` closed: on <body>, gone from the document, inside
 * the closing layer (or another dialog on its way out), or inside something `inert`.
 */
export function focusLost(layer?: Element | null): boolean {
	const active = document.activeElement;
	if (!active || active === document.body || !active.isConnected) return true;
	if (layer?.contains(active)) return true;
	return active.closest('[inert], [role=dialog][data-state=closed], [role=alertdialog][data-state=closed]') !== null;
}

/**
 * For a layer's `onCloseAutoFocus`: once bits-ui has returned focus (to whatever had it when the
 * layer opened), checks that it landed somewhere useful; if not (the layer was opened by code
 * while focus was on <body>, or what had focus is gone), focuses the first of `targets` that can
 * take it, typically the layer's trigger.
 *
 * @example
 * onCloseAutoFocus={(e) => { if (!e.defaultPrevented) returnFocus(ref, () => findTrigger(ref)); }}
 */
export function returnFocus(layer: Element | null | undefined, ...targets: FocusTarget[]) {
	queueMicrotask(() => {
		if (focusLost(layer)) focusFirst(...targets);
	});
}

/** The control that opens `layer` (a bits-ui trigger points at its content with `aria-controls`). */
export function triggerOf(layer: Element | null | undefined): HTMLElement | null {
	if (!layer?.id) return null;
	return layer.ownerDocument.querySelector<HTMLElement>(`[aria-controls="${CSS.escape(layer.id)}"]`);
}
