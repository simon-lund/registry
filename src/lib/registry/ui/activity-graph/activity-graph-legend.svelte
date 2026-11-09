<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';

	/**
	 * ActivityGraphLegend: the line under the grid that reads the scale, right-aligned across the
	 * whole graph. Put the consumer's words around an ActivityGraphLegendScale.
	 *
	 * @example
	 * <ActivityGraphLegend>Less <ActivityGraphLegendScale /> More</ActivityGraphLegend>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> = $props();
</script>

<div
	bind:this={ref}
	data-slot="activity-graph-legend"
	class={cn('col-span-full flex items-center justify-end gap-2 text-xs text-muted-foreground', className)}
	{...restProps}
>
	{@render children?.()}
</div>
