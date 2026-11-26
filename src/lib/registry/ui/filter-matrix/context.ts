/** One value of the first dimension: a row (the areas of your tasks). */
export interface FilterRow {
	id: string;
	label: string;
}

/** One value of the second dimension: a column (their statuses). */
export interface FilterColumn {
	id: string;
	label: string;
}

/**
 * What a cell, a total or the grand total holds, for `cellLabel` to put into words. Exactly one of:
 * - a cell: `row` and `column`;
 * - a row's total: `row` only;
 * - a column's total: `column` only;
 * - the grand total: neither.
 */
export interface FilterCellInfo {
	row?: FilterRow;
	column?: FilterColumn;
	/** How many things lie in it. */
	count: number;
}

/** The key of one cell: what `value` is a list of. */
export const cellKey = (row: string, column: string) => `${row}|${column}`;

/** Whether a thing in `row` and `column` falls inside the filter. Nothing picked means no filter: everything does. */
export function matches(value: readonly string[], row: string, column: string): boolean {
	return value.length === 0 || value.includes(cellKey(row, column));
}

/** How many things the filter lets through, from the cells' counts; with nothing picked, all of them. */
export function selectedCount(value: readonly string[], counts: Record<string, number>): number {
	const keys = value.length ? value : Object.keys(counts);
	return keys.reduce((n, k) => n + (counts[k] ?? 0), 0);
}
