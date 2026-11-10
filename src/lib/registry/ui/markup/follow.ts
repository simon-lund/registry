import { autoUpdate } from '@floating-ui/dom';

/** A box: its top left corner and its size, in px. */
export type MarkupBox = { x: number; y: number; width: number; height: number };

/**
 * Gives `onBox` the anchor's box in the coordinates of `el`'s containing block (where `left` and
 * `top` place it), now and again whenever the page scrolls, resizes or reflows (Floating UI's
 * autoUpdate). Returns the function that stops it.
 */
export function follow(anchor: Element, el: HTMLElement, onBox: (box: MarkupBox) => void) {
	return autoUpdate(anchor, el, () => {
		const r = anchor.getBoundingClientRect();
		const parent = el.offsetParent;
		// fixed (no offset parent): the viewport; no positioned ancestor: the document
		const o = !parent
			? { left: 0, top: 0 }
			: parent === document.body
				? { left: -scrollX, top: -scrollY }
				: parent.getBoundingClientRect();
		const dx = -o.left - (parent?.clientLeft ?? 0) + (parent && parent !== document.body ? parent.scrollLeft : 0);
		const dy = -o.top - (parent?.clientTop ?? 0) + (parent && parent !== document.body ? parent.scrollTop : 0);
		onBox({ x: r.left + dx, y: r.top + dy, width: r.width, height: r.height });
	});
}
