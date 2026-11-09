<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getActivityGraph } from './context.js';
	import { defaultLabel } from './format.js';
	import type { ActivityLabel } from './model.js';

	type Props = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
		/** Replaces the default Intl format (short month; narrow month in the month view; numeric year). */
		format?: (label: ActivityLabel) => string;
	};

	/**
	 * ActivityGraphColumnLabels: the band above the grid. Months over the weeks of the day and week
	 * views (each at the column holding its 1st; a cut first month only when it has room), the
	 * twelve months over the month view, the years over the year view. Formatted with the root's `locale`;
	 * decorative for assistive tech (each cell names its date). Place it inside ActivityGraphViewport, above the grid; the row labels make room for it.
	 */
	let { ref = $bindable(null), class: className, format, ...restProps }: Props = $props();

	const ctx = getActivityGraph('ActivityGraphColumnLabels');
</script>

<div
	bind:this={ref}
	data-slot="activity-graph-column-labels"
	aria-hidden="true"
	class={cn(
		'mb-1.5 grid h-(--ag-band) grid-cols-[repeat(var(--ag-cols),var(--ag-cell))] gap-x-(--ag-gap) text-xs whitespace-nowrap text-muted-foreground',
		className
	)}
	{...restProps}
>
	{#each ctx.model.columnLabels as label (label.index)}
		<span
			class={cn('min-w-0', ctx.model.granularity === 'month' || ctx.model.granularity === 'year' ? 'justify-self-center' : '')}
			style:grid-column="{label.index + 1} / span {Math.max(1, label.span)}"
		>
			{format ? format(label) : defaultLabel(label, ctx.model.granularity, ctx.locale)}
		</span>
	{/each}
</div>
