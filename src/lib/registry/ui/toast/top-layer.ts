import type { Attachment } from 'svelte/attachments';

// The Popover API puts an element in the top layer; without it the attachment does nothing.
const supported = typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype;

// What the top layer's UA popover styles would change; set while it stands there, removed after.
const FIXED_STYLE = {
	position: 'fixed',
	inset: 'auto',
	margin: '0',
	padding: '0',
	border: '0',
	background: 'transparent',
	color: 'inherit',
	overflow: 'visible'
};

/**
 * topLayerWhile: while `when()` is true, the element stands in the top layer (`popover="manual"`)
 * at the place it hangs now, relative to its parent: same left offset, same gap above it, width
 * following the parent's on resize. When `when()` turns false (or the element leaves) the popover
 * and every inline style it set are removed, and the element is back in its own layer.
 *
 * The Toaster attaches it with `() => modalLayers.open > 0`, so a toast raised from inside a modal
 * shows above the modal's veil. Kept in JS: CSS anchor positioning is not Baseline yet.
 *
 * @example
 * <section {@attach topLayerWhile(() => modalLayers.open > 0)}>…</section>
 */
export function topLayerWhile(when: () => boolean): Attachment<HTMLElement> {
	return (node) => {
		if (!supported || !when()) return;
		const anchor = node.parentElement;
		if (!anchor) return;
		// Where it hangs now, relative to its positioned parent; kept on resize.
		const r = node.getBoundingClientRect();
		const a = anchor.getBoundingClientRect();
		const left = r.left - a.left;
		const width = r.width;
		const gap = a.top - r.bottom;
		const place = () => {
			const box = anchor.getBoundingClientRect();
			node.style.left = `${box.left + left}px`;
			node.style.width = `${width + (box.width - a.width)}px`;
			node.style.bottom = `${document.documentElement.clientHeight - (box.top - gap)}px`;
		};
		Object.assign(node.style, FIXED_STYLE);
		place();
		node.popover = 'manual';
		node.showPopover();
		const observer = new ResizeObserver(place);
		observer.observe(anchor);
		window.addEventListener('resize', place);
		return () => {
			observer.disconnect();
			window.removeEventListener('resize', place);
			if (node.matches(':popover-open')) node.hidePopover();
			node.removeAttribute('popover');
			for (const key of [...Object.keys(FIXED_STYLE), 'left', 'width', 'bottom']) {
				node.style.removeProperty(key);
			}
		};
	};
}
