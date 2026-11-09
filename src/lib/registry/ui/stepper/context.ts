import { getContext, hasContext, setContext } from 'svelte';

/*
 * Shared between the Stepper parts. Not exported from index.ts: the parts are the API.
 */

export type StepperOrientation = 'horizontal' | 'vertical';

/**
 * How a step's trigger may be used, mutually exclusive:
 * - linear: back to any earlier step; forward only to a step whose every predecessor is done;
 * - free:   any step that is not disabled.
 */
export type StepperNavigation = 'linear' | 'free';

/** The list's look: `default` (indicators with titles), `bars` / `dots` (the inline forms). */
export type StepperListVariant = 'default' | 'bars' | 'dots';

/**
 * A step's look, exactly one: `active` wins over `done` (a done step you went back to),
 * everything else is `pending`.
 */
export type StepperItemState = 'active' | 'done' | 'pending';

/** What the indicator shows, exactly one: loading > done > the number (or children). */
export type StepperGlyph = 'spinner' | 'check' | 'content';

export type StepperStep = {
	readonly done: boolean;
	readonly disabled: boolean;
	readonly titleId: string | undefined;
};

export type StepperRootContext = {
	readonly value: number;
	readonly orientation: StepperOrientation;
	readonly linear: boolean;
	/** The step a roving tab stop sits on (the last focused trigger), or null for the current one. */
	readonly focused: number | null;
	/** The furthest step reached so far (never below the current one). */
	readonly reached: number;
	register(value: number, step: StepperStep): () => void;
	reachable(value: number): boolean;
	/** The id of a step's title, once it has one. */
	titleId(value: number): string | undefined;
	go(value: number): void;
	previous(): void;
	next(): void;
	canPrevious(): boolean;
	canNext(): boolean;
	focus(value: number | null): void;
	/** A StepperContent registers its panel element; returns the unregister. */
	registerPanel(value: number, element: HTMLElement): () => void;
	/** The panel element of a step, once it has rendered. */
	panel(value: number): HTMLElement | undefined;
};

export type StepperListContext = { readonly variant: StepperListVariant };

export type StepperItemContext = {
	readonly value: number;
	readonly state: StepperItemState;
	readonly done: boolean;
	readonly loading: boolean;
	readonly disabled: boolean;
	readonly invalid: boolean;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly hasTitle: boolean;
	readonly hasDescription: boolean;
	setTitle(on: boolean): void;
	setDescription(on: boolean): void;
};

const ROOT = Symbol('registry.stepper');
const LIST = Symbol('registry.stepper-list');
const ITEM = Symbol('registry.stepper-item');

export function setStepperRoot(ctx: StepperRootContext) {
	setContext(ROOT, ctx);
}

export function getStepperRoot(part: string): StepperRootContext {
	if (!hasContext(ROOT)) throw new Error(`<${part}> must be used inside <Stepper>`);
	return getContext(ROOT);
}

export function setStepperList(ctx: StepperListContext) {
	setContext(LIST, ctx);
}

/** The list's variant; `default` outside a list. */
export function getStepperList(): StepperListContext {
	return hasContext(LIST) ? getContext(LIST) : { variant: 'default' };
}

export function setStepperItem(ctx: StepperItemContext) {
	setContext(ITEM, ctx);
}

export function getStepperItem(part: string): StepperItemContext {
	if (!hasContext(ITEM)) throw new Error(`<${part}> must be used inside <StepperItem>`);
	return getContext(ITEM);
}
