<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getActivityGraph } from './context.js';
	import { defaultLabel } from './format.js';
	import type { ActivityLabel } from './model.js';

	type Props = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
		/** Replaces the default Intl format (short weekday; numeric year). */
		format?: (label: ActivityLabel) => string;
	};

	/**
	 * ActivityGraphRowLabels: the labels beside the rows, outside the scroller so they stay put.
	 * Weekdays in the day view (every second row, as GitHub: Mon, Wed, Fri, Sun for a Monday start),
	 * years in the week and month views; nothing in the year view (one row). Aligned to the rows,
	 * dropped by the height of the column labels when those are present. Decorative for assistive
	 * tech. Place it first in the root, before the viewport.
	 */
	let { ref = $bindable(null), class: className, format, ...restProps }: Props = $props();

	const ctx = getActivityGraph('ActivityGraphRowLabels');
	const labels = $derived(ctx.model.rowLabels);
</script>

{#if labels.length}
	<div
		bind:this={ref}
		data-slot="activity-graph-row-labels"
		aria-hidden="true"
		class={cn(
			'col-start-1 grid auto-rows-(--ag-cell) gap-y-(--ag-gap) pe-2 text-xs whitespace-nowrap text-muted-foreground',
			'group-has-[[data-slot=activity-graph-column-labels]]/activity-graph:pt-[calc(var(--ag-band)+--spacing(1.5))]',
			className
		)}
		{...restProps}
	>
		{#key ctx.model.granularity}
			{#each labels as label (label.index)}
				<span
					class="flex items-center leading-none transition-opacity duration-(--dur-base) ease-(--ease-settle) starting:opacity-0"
				>
					{#if label.unit !== 'weekday' || label.index % 2 === 0}
						{format ? format(label) : defaultLabel(label, ctx.model.granularity, ctx.locale)}
					{/if}
				</span>
			{/each}
		{/key}
	</div>
{/if}
