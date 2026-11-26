<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { cellKey, type FilterCellInfo, type FilterColumn, type FilterRow } from './context.js';

	/**
	 * FilterMatrix: two filters as one grid. Rows are one dimension (the areas of your tasks), columns
	 * the other, usually the shorter (their statuses). A cell shows how many things lie in it; the end
	 * of every row and column shows its total, and the corner the grand total. Nothing picked means no
	 * filter; otherwise the filter is the union of the cells picked (`matches` says whether a thing is
	 * inside it).
	 *
	 * Pointer: a click toggles a cell, so several can be picked; a total picks its whole line (or drops
	 * it, when all of it is picked); a double-click drops everything picked and picks only that cell
	 * (or that line, or, on the corner, everything).
	 *
	 * Keyboard: one tab stop; the arrow keys move over every cell and total, Home and End along the
	 * row, Space toggles, Enter picks only this one (the double-click's twin), Escape clears. A
	 * picked cell is copper, the value in hand; a total is copper when its whole line is picked.
	 *
	 * No copy inside: `cellLabel` says what a cell holds in your words ("Work, Open: 4 tasks").
	 *
	 * @example
	 * <FilterMatrix {rows} {columns} {counts} bind:value cellLabel={label} aria-label="Filter tasks" />
	 */
	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		rows: FilterRow[];
		columns: FilterColumn[];
		/** How many things lie in each cell, by `cellKey(row, column)`; a missing cell is 0. */
		counts: Record<string, number>;
		/** The cells picked, as `cellKey`s. Empty means no filter. */
		value?: string[];
		/** What a cell holds, in your words: for the screen reader and the tooltip. Required. */
		cellLabel: (info: FilterCellInfo) => string;
		onValueChange?: (value: string[]) => void;
	}

	let {
		rows,
		columns,
		counts,
		value = $bindable([]),
		cellLabel,
		onValueChange,
		class: className,
		...rest
	}: Props = $props();

	const count = (r: string, c: string) => counts[cellKey(r, c)] ?? 0;
	const rowTotal = (r: string) => columns.reduce((n, c) => n + count(r, c.id), 0);
	const colTotal = (c: string) => rows.reduce((n, r) => n + count(r.id, c), 0);
	const grand = $derived(rows.reduce((n, r) => n + rowTotal(r.id), 0));

	const picked = $derived(new Set(value));
	/** The cell keys a button stands for: one cell, a row, a column, or everything. */
	function keysOf(r: number, c: number): string[] {
		const rs = r === rows.length ? rows : [rows[r]];
		const cs = c === columns.length ? columns : [columns[c]];
		return rs.flatMap((row) => cs.map((col) => cellKey(row.id, col.id)));
	}
	function pressed(keys: string[]): boolean | 'mixed' {
		const n = keys.filter((k) => picked.has(k)).length;
		return n === 0 ? false : n === keys.length ? true : 'mixed';
	}

	function set(next: string[]) {
		value = next;
		onValueChange?.(next);
	}
	function toggle(keys: string[]) {
		if (keys.every((k) => picked.has(k))) set(value.filter((k) => !keys.includes(k)));
		else set([...value, ...keys.filter((k) => !picked.has(k))]);
	}

	// The one tab stop: where the grid was last entered, else its first cell.
	let at = $state<[number, number]>([0, 0]);
	let grid = $state<HTMLDivElement>();
	function focusAt(r: number, c: number) {
		at = [r, c];
		// keyboard moves are instant: focus follows straight away
		queueMicrotask(() => grid?.querySelector<HTMLElement>(`[data-pos="${r},${c}"]`)?.focus());
	}

	const MOVES: Record<string, [number, number]> = {
		ArrowUp: [-1, 0],
		ArrowDown: [1, 0],
		ArrowLeft: [0, -1],
		ArrowRight: [0, 1]
	};
	function onkeydown(e: KeyboardEvent, r: number, c: number) {
		if (e.key === 'Enter') {
			// Enter picks only this one; without this it would click, which toggles
			e.preventDefault();
			set(keysOf(r, c));
		} else if (e.key === 'Escape') {
			if (value.length) {
				e.preventDefault();
				set([]);
			}
		} else if (e.key === 'Home' || e.key === 'End') {
			e.preventDefault();
			focusAt(r, e.key === 'Home' ? 0 : columns.length);
		} else if (MOVES[e.key]) {
			e.preventDefault();
			const [dr, dc] = MOVES[e.key];
			const nr = r + dr;
			const nc = c + dc;
			if (nr >= 0 && nr <= rows.length && nc >= 0 && nc <= columns.length) focusAt(nr, nc);
		}
	}

	/** How many things lie in a button's cells: one cell, a row, a column, or all. */
	function countAt(r: number, c: number) {
		if (r < rows.length && c < columns.length) return count(rows[r].id, columns[c].id);
		if (c < columns.length) return colTotal(columns[c].id);
		if (r < rows.length) return rowTotal(rows[r].id);
		return grand;
	}

	// The look of every button: a cell, a line's total, or the corner.
	const button =
		'grid h-9 w-full min-w-11 pointer-coarse:h-11 cursor-pointer place-items-center rounded-md text-sm tabular-nums outline-none [touch-action:manipulation] select-none ' +
		'transition-[background-color,color] duration-(--dur-quick) ease-(--ease-settle) ' +
		'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-1';
</script>

<!--
	wider than a phone: the grid scrolls sideways in its own box, the page doesn't. The row labels stay
	put at the left (sticky), drawn on --filter-ground (the surface behind the grid, default the page
	background): set that var when the grid sits on another surface.
-->
{#snippet btn(ri: number, ci: number)}
	{@const keys = keysOf(ri, ci)}
	{@const n = countAt(ri, ci)}
	{@const on = pressed(keys)}
	{@const isCell = ri < rows.length && ci < columns.length}
	{@const info = { row: rows[ri], column: columns[ci], count: n }}
	<button
		type="button"
		data-pos="{ri},{ci}"
		data-kind={isCell ? 'cell' : ri < rows.length ? 'row' : ci < columns.length ? 'column' : 'all'}
		tabindex={at[0] === ri && at[1] === ci ? 0 : -1}
		aria-pressed={on}
		aria-label={cellLabel(info)}
		title={cellLabel(info)}
		onclick={() => {
			at = [ri, ci];
			toggle(keys);
		}}
		ondblclick={() => set(keys)}
		onkeydown={(e) => onkeydown(e, ri, ci)}
		class={cn(
			button,
			isCell
				? cn('bg-foreground/6 hover:bg-foreground/12', n === 0 && 'text-muted-foreground', on === true && 'bg-primary text-primary-foreground hover:bg-primary')
				: cn('text-muted-foreground hover:bg-foreground/6', on === true && 'text-primary font-medium', on === 'mixed' && 'text-foreground')
		)}>{n}</button
	>
{/snippet}

<div data-slot="filter-matrix" bind:this={grid} class={cn('max-w-full overflow-x-auto', className)} {...rest}>
	<table class="w-full border-separate border-spacing-1 text-sm">
		<thead>
			<tr>
				<td class="sticky left-0 z-10 bg-(--filter-ground,var(--background))"></td>
				{#each columns as c (c.id)}
					<th scope="col" class="text-muted-foreground px-0.5 pb-1 text-center text-xs font-medium whitespace-nowrap">{c.label}</th>
				{/each}
				<td></td>
			</tr>
		</thead>
		<tbody>
			{#each rows as r, ri (r.id)}
				<tr>
					<th
						scope="row"
						class="sticky left-0 z-10 max-w-28 min-w-16 truncate bg-(--filter-ground,var(--background)) pr-2 text-left font-medium"
						title={r.label}>{r.label}</th
					>
					{#each columns as c, ci (c.id)}
						<td>{@render btn(ri, ci)}</td>
					{/each}
					<!-- the row's total, at its end: picks the whole row -->
					<td>{@render btn(ri, columns.length)}</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<td class="sticky left-0 z-10 bg-(--filter-ground,var(--background))"></td>
				<!-- each column's total, at its foot: picks the whole column -->
				{#each columns as c, ci (c.id)}
					<td>{@render btn(rows.length, ci)}</td>
				{/each}
				<!-- the corner: everything -->
				<td>{@render btn(rows.length, columns.length)}</td>
			</tr>
		</tfoot>
	</table>
</div>
