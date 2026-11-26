<script lang="ts">
	import type { HTMLTableAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { setFilterMatrix, type FilterMatrixTarget } from './context.js';
	import type { FilterMatrixValue } from './value.js';

	/**
	 * FilterMatrix: two filters as one grid, where two dropdowns would be. Rows are one dimension (the
	 * areas of your tasks), columns the other, usually the shorter (their statuses). It is a table you
	 * compose, as shadcn's Table: FilterMatrixHeader, -Body and -Footer hold FilterMatrixRows of
	 * FilterMatrixHead (a row's or a column's name), FilterMatrixCell (one cell, a toggle) and
	 * FilterMatrixTotal (a whole row, a whole column, or everything). What a cell shows is its
	 * children: the counts and the words are yours.
	 *
	 * `value` is the list of picked cells, each `{ row, column }`. Nothing picked means no filter;
	 * otherwise a thing passes when its cell is picked (`matches`). `rows` and `columns` are the ids
	 * in order: the totals, the arrow keys and the tab stop are worked out from them. A row or column
	 * that goes takes its picked cells with it, so nothing you cannot see ever filters.
	 *
	 * Pointer: a click toggles a cell, so several can be picked; a total toggles its whole line. The
	 * second click of a double-click picks only that one and drops the rest.
	 * Keyboard: one tab stop; the arrow keys move over every cell and total, Home and End along the
	 * row, Space toggles, Enter picks only this one, Escape clears.
	 * A picked cell is copper, the value in hand; a total is copper when its whole line is picked.
	 *
	 * @example
	 * <FilterMatrix rows={['work', 'home']} columns={['open', 'done']} bind:value aria-label="Filter tasks">
	 *   <FilterMatrixBody>
	 *     <FilterMatrixRow>
	 *       <FilterMatrixHead row="work">Work</FilterMatrixHead>
	 *       <FilterMatrixCell row="work" column="open">3</FilterMatrixCell>
	 *       <FilterMatrixCell row="work" column="done">1</FilterMatrixCell>
	 *     </FilterMatrixRow>
	 *   </FilterMatrixBody>
	 * </FilterMatrix>
	 */
	let {
		ref = $bindable(null),
		rows,
		columns,
		value = $bindable([]),
		onValueChange,
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLTableAttributes, HTMLTableElement> & {
		/** The ids of the rows, in order. */
		rows: string[];
		/** The ids of the columns, in order. */
		columns: string[];
		/** The picked cells. Empty means no filter. */
		value?: FilterMatrixValue[];
		onValueChange?: (value: FilterMatrixValue[]) => void;
	} = $props();

	const uid = $props.id();

	const same = (a: FilterMatrixValue, b: FilterMatrixValue) => a.row === b.row && a.column === b.column;
	const picked = (cell: FilterMatrixValue) => value.some((v) => same(v, cell));

	/** The cells a button stands for: one cell, a row, a column, or all. None for an id not in the grid. */
	function cellsOf({ row, column }: FilterMatrixTarget): FilterMatrixValue[] {
		const rs = row === undefined ? rows : rows.includes(row) ? [row] : [];
		const cs = column === undefined ? columns : columns.includes(column) ? [column] : [];
		return rs.flatMap((r) => cs.map((c) => ({ row: r, column: c })));
	}

	function set(next: FilterMatrixValue[]) {
		value = next;
		onValueChange?.(next);
	}
	function toggle(target: FilterMatrixTarget) {
		const cells = cellsOf(target);
		if (!cells.length) return;
		if (cells.every(picked)) set(value.filter((v) => !cells.some((c) => same(c, v))));
		else set([...value, ...cells.filter((c) => !picked(c))]);
	}
	function only(target: FilterMatrixTarget) {
		const cells = cellsOf(target);
		// already exactly these: nothing changes, so nothing is reported
		if (cells.length === value.length && cells.every(picked)) return;
		set(cells);
	}

	// A row or column that is gone takes its picked cells with it: what cannot be seen cannot filter.
	$effect(() => {
		const kept = value.filter((v) => rows.includes(v.row) && columns.includes(v.column));
		if (kept.length !== value.length) set(kept);
	});

	// The one tab stop: the button that last had focus, while it is still in the grid; else the first cell.
	let focused = $state<FilterMatrixTarget | null>(null);
	const inGrid = ({ row, column }: FilterMatrixTarget) =>
		(row === undefined || rows.includes(row)) && (column === undefined || columns.includes(column));
	const stop = $derived<FilterMatrixTarget>(focused && inGrid(focused) ? focused : { row: rows[0], column: columns[0] });

	// A total sits one past the end of its line, so the index of a missing id is the line's length.
	const indexIn = (ids: string[], id: string | undefined) => (id === undefined ? ids.length : ids.indexOf(id));
	const posOf = ({ row, column }: FilterMatrixTarget) => `${indexIn(rows, row)},${indexIn(columns, column)}`;

	/** Moves focus to the button at these indices, when there is one. Keyboard moves are instant. */
	function focusAt(r: number, c: number) {
		const el = ref?.querySelector<HTMLElement>(`[data-pos="${r},${c}"]`);
		el?.focus();
		return !!el;
	}

	const MOVES: Record<string, [number, number]> = {
		ArrowUp: [-1, 0],
		ArrowDown: [1, 0],
		ArrowLeft: [0, -1],
		ArrowRight: [0, 1]
	};
	function keydown(e: KeyboardEvent, target: FilterMatrixTarget) {
		const r = indexIn(rows, target.row);
		const c = indexIn(columns, target.column);
		if (e.key === 'Enter') {
			// Enter picks only this one; left alone it would click, which toggles
			e.preventDefault();
			only(target);
		} else if (e.key === 'Escape') {
			// only when there is something to clear, so a dialog round the grid still closes on Escape
			if (value.length) {
				e.preventDefault();
				set([]);
			}
		} else if (e.key === 'Home') {
			e.preventDefault();
			focusAt(r, 0);
		} else if (e.key === 'End') {
			e.preventDefault();
			// the row's total, or its last cell when the totals are left out
			if (!focusAt(r, columns.length)) focusAt(r, columns.length - 1);
		} else if (MOVES[e.key]) {
			e.preventDefault();
			const [dr, dc] = MOVES[e.key];
			// right to left, the columns run the other way: the arrows follow what is drawn
			const rtl = ref ? getComputedStyle(ref).direction === 'rtl' : false;
			focusAt(r + dr, c + (rtl ? -dc : dc));
		}
	}

	setFilterMatrix({
		stateOf(target) {
			const cells = cellsOf(target);
			const n = cells.filter(picked).length;
			return n === 0 ? 'inactive' : n === cells.length ? 'active' : 'partial';
		},
		isTabStop: (target) => target.row === stop.row && target.column === stop.column,
		posOf,
		idOf: (target) => `${uid}-${posOf(target).replace(',', '-')}`,
		headId(axis, id) {
			const i = (axis === 'row' ? rows : columns).indexOf(id);
			return i === -1 ? undefined : `${uid}-${axis}-${i}`;
		},
		press: (target, onlyThis) => (onlyThis ? only(target) : toggle(target)),
		keydown,
		focus: (target) => (focused = target)
	});
</script>

<!-- wider than its place: the table scrolls sideways in this box, the page does not -->
<div data-slot="filter-matrix-container" class="max-w-full overflow-x-auto">
	<table
		bind:this={ref}
		data-slot="filter-matrix"
		class={cn('w-full border-separate border-spacing-1 text-sm', className)}
		{...restProps}
	>
		{@render children?.()}
	</table>
</div>
