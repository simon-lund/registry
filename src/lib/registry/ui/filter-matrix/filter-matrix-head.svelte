<script lang="ts">
	import type { HTMLThAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getFilterMatrix } from './context.js';

	/**
	 * FilterMatrixHead: the name of a row (`row`) or of a column (`column`), a `<th>`. Give it the
	 * id of the line it names: every cell in that line is then named by it for assistive tech, so a
	 * cell needs no label of its own. A column's name is small and quiet above its cells; a row's
	 * name leads its row and wraps when it is long. Without children it is an empty corner, a plain
	 * `<td>`.
	 *
	 * In a table that scrolls sideways, keep the row names in sight with your own classes, on the
	 * surface the table sits on: `class="bg-card sticky left-0 z-10"`.
	 *
	 * @example
	 * <FilterMatrixHead column="open">Open</FilterMatrixHead>
	 * <FilterMatrixHead row="work">Work</FilterMatrixHead>
	 * <FilterMatrixHead />
	 */
	let {
		ref = $bindable(null),
		row,
		column,
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLThAttributes, HTMLTableCellElement> &
		// names a row, names a column, or is a corner
		({ row: string; column?: never } | { column: string; row?: never } | { row?: never; column?: never }) = $props();

	const ctx = getFilterMatrix('FilterMatrixHead');
	const id = $derived(
		restProps.id ?? (row !== undefined ? ctx.headId('row', row) : column !== undefined ? ctx.headId('column', column) : undefined)
	);
</script>

{#if children}
	<th
		bind:this={ref}
		{...restProps}
		{id}
		scope={row !== undefined ? 'row' : 'col'}
		data-slot="filter-matrix-head"
		class={cn(
			row !== undefined
				? 'max-w-32 min-w-16 pr-2 text-left leading-5 font-medium'
				: 'text-muted-foreground px-0.5 pb-1 text-center text-xs font-medium whitespace-nowrap',
			className
		)}
	>
		{@render children()}
	</th>
{:else}
	<!-- a corner: a header with nothing in it would name nothing -->
	<td bind:this={ref} {...restProps} data-slot="filter-matrix-head" class={cn(className)}></td>
{/if}
