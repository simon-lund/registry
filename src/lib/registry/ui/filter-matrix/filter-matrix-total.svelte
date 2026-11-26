<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getFilterMatrix } from './context.js';
	import { filterMatrixCellVariants } from './filter-matrix-cell.svelte';

	/**
	 * FilterMatrixTotal: the end of a line, a toggle button in a `<td>` for everything in it: a whole
	 * row (`row`), a whole column (`column`), or the whole grid (neither). Its children are what it
	 * shows, usually the line's sum. A click picks the whole line, or drops it when all of it is
	 * picked; the second click of a double-click, or Enter, picks only that line.
	 *
	 * `data-state` is `active` when the whole line is picked, `partial` when some of it is, else
	 * `inactive`; `aria-pressed` is true, "mixed" or false. A number alone says little, so its
	 * `aria-label` is required ("All of Work: 5 tasks").
	 *
	 * @example
	 * <FilterMatrixTotal row="work" aria-label="All of Work: 5 tasks">5</FilterMatrixTotal>
	 * <FilterMatrixTotal column="open" aria-label="All open: 6 tasks">6</FilterMatrixTotal>
	 * <FilterMatrixTotal aria-label="All 16 tasks">16</FilterMatrixTotal>
	 */
	let {
		ref = $bindable(null),
		row,
		column,
		class: className,
		children,
		onclick,
		onkeydown,
		onfocus,
		...restProps
	}: WithElementRef<Omit<HTMLButtonAttributes, 'type' | 'value'>, HTMLButtonElement> & {
		/** What the total stands for, in your words. */
		'aria-label': string;
	} & // a row, a column, or everything
		({ row: string; column?: never } | { column: string; row?: never } | { row?: never; column?: never }) = $props();

	const ctx = getFilterMatrix('FilterMatrixTotal');
	const target = $derived({ row, column });
	const state = $derived(ctx.stateOf(target));
</script>

<td>
	<button
		bind:this={ref}
		type="button"
		id={ctx.idOf(target)}
		{...restProps}
		data-slot="filter-matrix-total"
		data-state={state}
		data-pos={ctx.posOf(target)}
		tabindex={ctx.isTabStop(target) ? 0 : -1}
		aria-pressed={state === 'active' ? true : state === 'partial' ? 'mixed' : false}
		class={cn(filterMatrixCellVariants({ variant: 'total' }), className)}
		onclick={(e) => {
			onclick?.(e);
			if (!e.defaultPrevented) ctx.press(target, e.detail >= 2);
		}}
		onkeydown={(e) => {
			onkeydown?.(e);
			if (!e.defaultPrevented) ctx.keydown(e, target);
		}}
		onfocus={(e) => {
			onfocus?.(e);
			ctx.focus(target);
		}}
	>
		{@render children?.()}
	</button>
</td>
