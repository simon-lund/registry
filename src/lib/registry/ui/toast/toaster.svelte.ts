/*
 * The toast queue: plain state, no DOM. `toast()` from anywhere, one <Toaster> renders it.
 * Every word on a toast comes from the caller; the queue only holds them.
 */

import type { ToastVariant } from './toast.svelte';

/**
 * Why a toast left, mutually exclusive and exhaustive:
 * - `timeout`: its window ran out (the moment to commit what it offered to undo)
 * - `swipe`: swiped away by hand (also final)
 * - `action`: its action ran (Undo)
 * - `overflow`: a newer toast pushed it past the limit
 * - `dismiss`: the caller removed it with `dismiss()`
 */
export type ToastDismissReason = 'timeout' | 'swipe' | 'action' | 'overflow' | 'dismiss';

/** The one action a toast can offer, e.g. `{ label: 'Undo', onClick: restore }`. */
export type ToastActionOptions = { label: string; onClick: () => void };

export type ToastOptions = {
	/** The bold first word: what just happened (Archived, Moved to trash). Optional. */
	verb?: string;
	/** What it happened to (Q3 report). One line; it truncates. */
	title: string;
	/** One action. While there is one, the draining wash shows its window. */
	action?: ToastActionOptions;
	/**
	 * The action's ink and the wash, on the same surface: `default`, `notice` (the app speaking:
	 * offline) or `news` (a tip). Never a meaning; the words say what happened. Default: `default`.
	 */
	variant?: ToastVariant;
	/** Window in ms. Default: 5000. `null`: stays until dismissed. */
	duration?: number | null;
	/** Called once, whatever made it leave. Commit a deferred change on `timeout` / `swipe` / `overflow`. */
	onDismiss?: (reason: ToastDismissReason) => void;
};

export type ToastData = ToastOptions & { id: number };

/**
 * A toast queue. Most apps use the shared `toaster` (and its `toast()`); make your own with
 * `createToaster()` when a screen needs its own stack, and hand it to `<Toaster toaster={…}>`.
 */
export class ToastQueue {
	/** Oldest first, newest last: the newest is in front. Replaced, never mutated. */
	toasts = $state.raw<ToastData[]>([]);
	/** How many can be on screen; a newer toast past it pushes the oldest out (`overflow`). */
	readonly limit: number;
	#next = 1;

	constructor({ limit = 3 }: { limit?: number } = {}) {
		this.limit = Math.max(1, limit);
	}

	/**
	 * Show a toast. Returns its id, for `dismiss(id)`.
	 *
	 * @example
	 * toast({ verb: 'Archived', title: 'Q3 report', action: { label: 'Undo', onClick: restore } });
	 */
	toast = (options: ToastOptions): number => {
		const id = this.#next++;
		this.toasts = [...this.toasts, { ...options, id }];
		while (this.toasts.length > this.limit) this.dismiss(this.toasts[0].id, 'overflow');
		return id;
	};

	/** Remove one toast (or, without an id, all of them). Unknown ids are ignored. */
	dismiss = (id?: number, reason: ToastDismissReason = 'dismiss') => {
		const leaving = id === undefined ? this.toasts : this.toasts.filter((t) => t.id === id);
		if (!leaving.length) return;
		this.toasts = this.toasts.filter((t) => !leaving.includes(t));
		for (const t of leaving) t.onDismiss?.(reason);
	};

	/** Run a toast's action, then remove it with reason `action`. What its action button calls. */
	act = (id: number) => {
		const t = this.toasts.find((t) => t.id === id);
		if (!t) return;
		t.action?.onClick();
		this.dismiss(id, 'action');
	};
}

/** A queue of its own, e.g. one per screen. */
export function createToaster(options?: { limit?: number }) {
	return new ToastQueue(options);
}

/** The shared queue the default `<Toaster>` renders. */
export const toaster = createToaster();

/** Show a toast on the shared queue. Returns its id. */
export const toast = toaster.toast;
