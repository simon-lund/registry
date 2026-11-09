<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { ACTIVITY_LEVELS, activityLevelVariants } from './levels.js';

	/**
	 * ActivityGraphLegendScale: the five level swatches, nothing to the most, at the day view's
	 * cell size whatever the granularity. Decorative (`aria-hidden`): the cells carry their values
	 * in words. In forced colours the swatches keep their fills inside a 1px CanvasText ring.
	 */
	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, HTMLSpanElement> = $props();
</script>

<span
	bind:this={ref}
	data-slot="activity-graph-legend-scale"
	aria-hidden="true"
	class={cn('flex gap-[calc(var(--spacing)*0.75)]', className)}
	{...restProps}
>
	{#each ACTIVITY_LEVELS as level (level)}
		<span
			data-level={level}
			class={cn(
				activityLevelVariants({ level }),
				'size-3 rounded-[calc(var(--spacing)*0.75)]',
				'forced-color-adjust-none forced-colors:outline-1 forced-colors:-outline-offset-1 forced-colors:outline-[CanvasText]'
			)}
		></span>
	{/each}
</span>
