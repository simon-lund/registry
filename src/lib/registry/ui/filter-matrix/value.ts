/** One picked cell: the id of its row and the id of its column. A FilterMatrix's `value` is a list of these. */
export interface FilterMatrixValue {
	row: string;
	column: string;
}

/**
 * Whether a thing in `row` and `column` passes the filter. Nothing picked means no filter:
 * everything passes.
 *
 * @example
 * const shown = $derived(tasks.filter((t) => matches(value, t.area, t.status)));
 */
export function matches(value: readonly FilterMatrixValue[], row: string, column: string): boolean {
	return value.length === 0 || value.some((v) => v.row === row && v.column === column);
}
