import { getContext, hasContext, setContext } from 'svelte';

/** How much of what a button stands for is picked: all of it, some of it (a total only), or none. */
export type FilterMatrixState = 'active' | 'partial' | 'inactive';

/**
 * What a button stands for, exactly one of:
 * - a cell: `row` and `column`
 * - a row's total: `row` only
 * - a column's total: `column` only
 * - the grand total: neither
 */
export interface FilterMatrixTarget {
	row?: string;
	column?: string;
}

// Shared between the FilterMatrix parts. Not exported from index.ts: the parts are the API.
export type FilterMatrixContext = {
	stateOf(target: FilterMatrixTarget): FilterMatrixState;
	/** Whether this button is the grid's one tab stop. */
	isTabStop(target: FilterMatrixTarget): boolean;
	/** Where the button sits, as "row,column" indices; a total sits one past the end of its line. */
	posOf(target: FilterMatrixTarget): string;
	/** The id a button gets unless the consumer gives one. */
	idOf(target: FilterMatrixTarget): string;
	/** The id of the header that names a row or a column, or undefined when it is not in the grid. */
	headId(axis: 'row' | 'column', id: string): string | undefined;
	/** A click: toggles what the button stands for, or with `only` picks it and drops the rest. */
	press(target: FilterMatrixTarget, only: boolean): void;
	keydown(event: KeyboardEvent, target: FilterMatrixTarget): void;
	/** The button took focus: it is the tab stop from now on. */
	focus(target: FilterMatrixTarget): void;
};

const KEY = Symbol('registry.filter-matrix');

export function setFilterMatrix(ctx: FilterMatrixContext) {
	setContext(KEY, ctx);
}

export function getFilterMatrix(part: string): FilterMatrixContext {
	if (!hasContext(KEY)) throw new Error(`<${part}> must be used inside <FilterMatrix>`);
	return getContext(KEY);
}
