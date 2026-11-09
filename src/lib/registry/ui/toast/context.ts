import { getContext, hasContext, setContext } from 'svelte';

/*
 * Shared between Toast and ToastProgress. Not exported from index.ts: the parts are the API.
 *
 * The Toast root owns the clock: one Web Animation with no keyframes, so it is a timer that
 * pauses, resumes and finishes on the document timeline. ToastProgress runs its own animation
 * (the draining line) and hands it to `follow`, which keeps it at the clock's time and play state.
 * One clock, so the line and the timeout can never drift apart.
 */
export type ToastClock = {
	/** Register an animation that mirrors the clock's time and pause state. Returns the unsubscribe. */
	follow(animation: Animation): () => void;
	/** The window in ms, or null for a toast without a clock. */
	readonly duration: number | null;
};

const KEY = Symbol('toast-clock');

export function setToastClock(clock: ToastClock) {
	return setContext(KEY, clock);
}

export function getToastClock(): ToastClock | null {
	return hasContext(KEY) ? getContext<ToastClock>(KEY) : null;
}
