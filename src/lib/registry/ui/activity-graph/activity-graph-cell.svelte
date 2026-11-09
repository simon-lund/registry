<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getActivityGraph } from './context.js';
	import { activityLevelVariants } from './levels.js';
	import type { ActivityCell } from './model.js';

	type Props = WithElementRef<Omit<HTMLAttributes<HTMLDivElement>, 'children'>, HTMLDivElement> & {
		/** The cell from the grid's `cell` snippet. */
		cell: ActivityCell;
		/** What the cell holds, in words ("3 times on Wed, Oct 7"): its only name for assistive tech. */
		'aria-label': string;
	};

	/**
	 * ActivityGraphCell: one rounded square (a gridcell), tinted by its level, a tonal step of ink
	 * (darker for more in light, lighter in dark). Exposes `data-level` (0–4) and `data-key`
	 * (`YYYY-MM-DD` of the unit's first day). With an ActivityGraphCaption in the graph, the selected
	 * cell has `aria-selected` and `data-selected` (a 2px copper ring). In forced colours the fill stays (the colour is the data) inside a 1px
	 * CanvasText ring; focus and selection ring in Highlight.
	 *
	 * Render it from ActivityGraphGrid's `cell` snippet; it takes the roving tab stop from the
	 * grid. To give it a tooltip, pass a TooltipTrigger's props through (`child` snippet): the cell
	 * spreads them and keeps its own tabindex, so the grid stays a single tab stop.
	 *
	 * @example
	 * <TooltipTrigger payload={cell}>
	 *   {#snippet child({ props })}<ActivityGraphCell {...props} {cell} aria-label={describe(cell)} />{/snippet}
	 * </TooltipTrigger>
	 */
	let { ref = $bindable(null), class: className, cell, ...restProps }: Props = $props();

	const ctx = getActivityGraph('ActivityGraphCell');
</script>

<!-- A trigger's props come first: its data-slot and tabindex must not replace the cell's. -->
<div
	bind:this={ref}
	{...restProps}
	role="gridcell"
	data-slot="activity-graph-cell"
	data-key={cell.key}
	data-level={cell.level}
	tabindex={ctx.activeKey === cell.key ? 0 : -1}
	aria-selected={ctx.selecting ? ctx.selectedKey === cell.key : undefined}
	data-selected={(ctx.selecting && ctx.selectedKey === cell.key) || undefined}
	class={cn(
		activityLevelVariants({ level: cell.level }),
		'rounded-(--ag-radius) outline-offset-1 hover:outline-1 hover:outline-muted-foreground data-selected:outline-2 data-selected:outline-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
		'forced-color-adjust-none forced-colors:outline-1 forced-colors:-outline-offset-1 forced-colors:outline-[CanvasText]',
		'forced-colors:data-selected:outline-2 forced-colors:data-selected:outline-offset-1 forced-colors:data-selected:outline-[Highlight] forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-1 forced-colors:focus-visible:outline-[Highlight]',
		className
	)}
></div>
