import type { Attachment } from 'svelte/attachments';

// CloseWatcher is not in every lib.dom yet: the part used here.
type CloseWatcherLike = {
	onclose: ((event: Event) => void) | null;
	destroy(): void;
};
type CloseWatcherCtor = new () => CloseWatcherLike;

/**
 * watchClose: while a layer is open, the platform's close request closes it. On Android that is
 * the back button or gesture (instead of leaving the page underneath); elsewhere Escape, where
 * nothing else handled it (bits-ui's own layers cancel the Escape they act on, so the two never
 * both fire). Call it when the layer opens; call what it returns when the layer closes.
 *
 * - One watcher per open layer. Watchers are a stack: the last one opened closes first, so a
 *   nested layer goes before its parent, one back at a time.
 * - A layer opened from a tap or a key gets its own back. One opened without a gesture (on
 *   load, from a timer, after a fetch) joins the watcher before it, and one back then closes
 *   both together: the platform's rule against trapping the user with layers they never asked for.
 * - `onClose` runs at most once per watcher and may find the layer already closing: write it so
 *   that closing twice is harmless (`if (!open) return`).
 * - Feature-detected: where `CloseWatcher` is missing it does nothing and returns a no-op, so
 *   back behaves as it did.
 *
 * @example
 * $effect(() => {
 *   if (!open) return;
 *   return watchClose(() => {
 *     if (!open) return;
 *     open = false;
 *     onOpenChange?.(false);
 *   });
 * });
 */
export function watchClose(onClose: () => void): () => void {
	const Watcher = (globalThis as { CloseWatcher?: CloseWatcherCtor }).CloseWatcher;
	if (typeof Watcher !== 'function') return () => {};
	let watcher: CloseWatcherLike | null;
	try {
		watcher = new Watcher();
	} catch {
		// Not in a fully active document (a detached frame): nothing to watch.
		return () => {};
	}
	let done = false;
	watcher.onclose = () => {
		if (done) return;
		done = true;
		onClose();
	};
	return () => {
		done = true;
		watcher?.destroy();
		watcher = null;
	};
}

/**
 * closeWatcher: watchClose as an attachment, for a layer whose element exists exactly while it
 * is open (an element under `{#if open}`): the watcher lives as long as the element.
 *
 * @example
 * {#if open}
 *   <div role="dialog" {@attach closeWatcher(() => (open = false))}>…</div>
 * {/if}
 */
export function closeWatcher(onClose: () => void): Attachment<Element> {
	return () => watchClose(onClose);
}
