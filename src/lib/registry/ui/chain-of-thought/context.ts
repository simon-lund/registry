import { getContext, hasContext, setContext } from 'svelte';

/**
 * A step's state, mutually exclusive and exhaustive:
 *   done     finished (muted)
 *   active   under way (full colour, a copper glyph)
 *   pending  not started yet (muted, further back)
 */
export type ChainOfThoughtStepStatus = 'done' | 'active' | 'pending';

const STEP_KEY = Symbol('simon-lund.chain-of-thought-step');

export function setChainOfThoughtStep(ctx: { readonly status: ChainOfThoughtStepStatus }) {
	setContext(STEP_KEY, ctx);
}

export function getChainOfThoughtStep(): { readonly status: ChainOfThoughtStepStatus } | undefined {
	return hasContext(STEP_KEY) ? getContext(STEP_KEY) : undefined;
}
