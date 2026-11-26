import { getContext, setContext } from 'svelte';
import type { RatingSize } from './rating.svelte';

// What a RatingItem needs from its Rating: the size, and the chosen value, so it can tell a
// hover preview from the rating itself (bits-ui reports both as one state).
export type RatingContext = {
	readonly size: RatingSize;
	readonly value: number;
	readonly allowHalf: boolean;
};

const KEY = Symbol('rating');

export function setRatingContext(ctx: RatingContext) {
	setContext(KEY, ctx);
}

export function getRatingContext(): RatingContext {
	return getContext<RatingContext>(KEY);
}
