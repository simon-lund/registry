import { untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';

export type InertOutsideOptions = {
	/**
	 * What stays usable behind the layer, as a selector: these elements (and the way up to them)
	 * are never made inert. Default `[data-slot=toaster]`: a toast raised while the layer is open
	 * can still be read and undone.
	 */
	keep?: string;
};

const KEEP = '[data-slot=toaster]';
const SKIP = 'script, style, link, template, noscript';

// How many open layers want each element inert: nested layers share elements and must only
// give back what they took. An element inert before any layer (the author's) is never touched.
const holds = new WeakMap<Element, number>();
const layers = $state({ open: 0 });
// Each held surface's release, in the order they opened, for releaseInert().
const releasers = new Map<Element, () => void>();

/**
 * How many modal layers are open right now (reactive): what a layer that has to stay reachable
 * above them (the Toaster) watches.
 */
export const modalLayers = {
	get open() {
		return layers.open;
	}
};

/**
 * True for a press on what stays usable behind a layer (the Toaster): pass it to the layer's
 * `onInteractOutside` so pressing Undo on a toast does not close the dialog.
 *
 * @example
 * onInteractOutside={(e) => pressOnKept(e) && e.preventDefault()}
 */
export function pressOnKept(event: Event, keep: string = KEEP): boolean {
	const target = event.target;
	return target instanceof Element && target.closest(keep) !== null;
}

function inertAround(node: Element, keep: string): () => void {
	const doc = node.ownerDocument;
	const body = doc.body;
	if (!body.contains(node)) return () => {};
	const kept = [node, ...Array.from(doc.querySelectorAll(keep)).filter((el) => !node.contains(el))];
	// The way from body down to every kept element: those stay, their siblings go inert.
	const path = new Set<Element>();
	for (const el of kept) {
		for (let at: Element | null = el; at && at !== body; at = at.parentElement) path.add(at);
	}
	const taken: Element[] = [];
	const walk = (parent: Element) => {
		for (const child of Array.from(parent.children)) {
			if (kept.includes(child) || child.matches(SKIP)) continue;
			if (path.has(child)) {
				walk(child);
				continue;
			}
			const n = holds.get(child);
			if (n === undefined) {
				if (child.hasAttribute('inert')) continue;
				child.setAttribute('inert', '');
			}
			holds.set(child, (n ?? 0) + 1);
			taken.push(child);
		}
	};
	walk(body);
	return () => {
		for (const el of taken) {
			const n = (holds.get(el) ?? 1) - 1;
			if (n > 0) holds.set(el, n);
			else {
				holds.delete(el);
				el.removeAttribute('inert');
			}
		}
	};
}

/**
 * inertOutside: while a modal layer is open, everything outside it is `inert`: not focusable,
 * not clickable, and gone for assistive tech that does not honour `aria-modal`. Put it on the
 * layer's surface (the element with `data-state`).
 *
 * - It walks from the surface up to `<body>` and makes every sibling on the way inert, so a
 *   surface rendered in place (`portalProps={{ disabled: true }}`) works as well as one in a
 *   portal. What `keep` matches (the Toaster) and the way up to it stay usable.
 * - Open is `data-state="open"` (or no `data-state`): the page comes back the moment the state
 *   leaves `open`, before the exit motion. bits-ui returns focus even earlier: call
 *   `releaseInert(surface)` from the layer's `onCloseAutoFocus`.
 * - Layers stack: a nested layer makes its parent inert and gives back only what it took.
 * - It counts the open layers in `modalLayers.open`.
 *
 * @example
 * <div role="dialog" aria-modal="true" data-state="open" {@attach inertOutside()}>…</div>
 */
export function inertOutside({ keep = KEEP }: InertOutsideOptions = {}): Attachment<HTMLElement> {
	return (node) => {
		let release: (() => void) | null = null;
		let state = '';
		const give = () => {
			if (!release) return;
			release();
			release = null;
			releasers.delete(node);
			untrack(() => layers.open--);
		};
		const sync = () => {
			const next = node.getAttribute('data-state') ?? 'open';
			if (next === state) return;
			state = next;
			if (next !== 'open') return give();
			if (release) return;
			release = inertAround(node, keep);
			releasers.set(node, give);
			untrack(() => layers.open++);
		};
		sync();
		const observer = new MutationObserver(sync);
		observer.observe(node, { attributes: true, attributeFilter: ['data-state'] });
		return () => {
			observer.disconnect();
			give();
		};
	};
}

/**
 * Gives the page back now, before the layer's state says it closed: call it from the layer's
 * `onCloseAutoFocus` (bits-ui moves focus back to the trigger before `data-state` changes, and an
 * inert trigger refuses focus). Layers opened after it are released too: they close with it.
 * Harmless when nothing is held.
 *
 * @example
 * onCloseAutoFocus={(e) => { releaseInert(ref); onCloseAutoFocus?.(e); }}
 */
export function releaseInert(node: Element | null | undefined) {
	if (!node || !releasers.has(node)) return;
	// Layers opened after this one sit on it and close with it (a child never outlives its parent).
	const order = [...releasers.keys()];
	for (const el of order.slice(order.indexOf(node)).reverse()) releasers.get(el)?.();
}
