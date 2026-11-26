<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	/**
	 * The button of a cell or of a total: 36px high (44px where the pointer is coarse) and at least
	 * 44px wide. Its look follows `data-state`:
	 *   cell   a quiet tint of the text colour; `active` copper, the value in hand
	 *   total  no fill, muted; `partial` full ink, `active` copper
	 */
	export const filterMatrixCellVariants = tv({
		base: [
			'grid h-9 w-full min-w-11 cursor-pointer place-items-center rounded-md text-sm tabular-nums select-none pointer-coarse:h-11',
			'transition-[background-color,color] duration-(--dur-quick) ease-(--ease-settle)',
			'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
			// tapped in quick succession, so no double-tap zoom (whether a second tap counts as a
			// double-click is the browser's; a Clear button is the sure way by touch)
			'touch-manipulation'
		],
		variants: {
			variant: {
				cell: [
					'bg-foreground/6 hover:bg-foreground/12',
					'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:hover:bg-primary'
				],
				total: [
					'text-muted-foreground hover:bg-foreground/6',
					'data-[state=partial]:text-foreground data-[state=active]:font-medium data-[state=active]:text-primary'
				]
			}
		},
		defaultVariants: { variant: 'cell' }
	});

	export type FilterMatrixCellVariant = VariantProps<typeof filterMatrixCellVariants>['variant'];
</script>

<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getFilterMatrix } from './context.js';

	/**
	 * FilterMatrixCell: one cell, a toggle button in a `<td>`: the things in this `row` and this
	 * `column`. Its children are what it shows, usually how many there are. `data-state` is `active`
	 * when picked, else `inactive`, with `aria-pressed` to match. A click toggles it; the second
	 * click of a double-click, or Enter, picks only this one.
	 *
	 * It is named by its two FilterMatrixHeads and its own content ("Work Open 3"). Pass an
	 * `aria-label` to say it in your words.
	 *
	 * @example
	 * <FilterMatrixCell row="work" column="open">3</FilterMatrixCell>
	 * <FilterMatrixCell row="work" column="done" class="text-muted-foreground">0</FilterMatrixCell>
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
		/** The id of the row it is in. */
		row: string;
		/** The id of the column it is in. */
		column: string;
	} = $props();

	const ctx = getFilterMatrix('FilterMatrixCell');
	const target = $derived({ row, column });
	const id = $derived(restProps.id ?? ctx.idOf(target));
	// named by the row's head, the column's head and its own content, unless the consumer names it
	const labelledBy = $derived(
		restProps['aria-labelledby'] ??
			(restProps['aria-label']
				? undefined
				: [ctx.headId('row', row), ctx.headId('column', column), id].filter(Boolean).join(' '))
	);
</script>

<td>
	<button
		bind:this={ref}
		type="button"
		{...restProps}
		{id}
		data-slot="filter-matrix-cell"
		data-state={ctx.stateOf(target)}
		data-pos={ctx.posOf(target)}
		tabindex={ctx.isTabStop(target) ? 0 : -1}
		aria-pressed={ctx.stateOf(target) === 'active'}
		aria-labelledby={labelledBy}
		class={cn(filterMatrixCellVariants({ variant: 'cell' }), className)}
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
