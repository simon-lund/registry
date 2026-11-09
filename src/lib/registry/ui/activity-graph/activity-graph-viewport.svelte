<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getActivityGraph } from './context.js';

	/**
	 * ActivityGraphViewport: the room the column labels and the grid share. When the graph is wider
	 * than its room (the day view on a phone) it scrolls sideways, and it opens at the newest edge
	 * (right) whenever the layout changes, never with a smooth scroll. The row labels stay outside
	 * it, so they stay put. A switch of granularity fades its content in (opacity only).
	 *
	 * @example
	 * <ActivityGraphViewport><ActivityGraphColumnLabels /><ActivityGraphGrid …>…</ActivityGraphGrid></ActivityGraphViewport>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> = $props();

	const ctx = getActivityGraph('ActivityGraphViewport');

	$effect(() => {
		void ctx.model;
		if (ref) ref.scrollLeft = ref.scrollWidth;
	});
</script>

<div
	bind:this={ref}
	data-slot="activity-graph-viewport"
	class={cn(
		// the padding gives the focus ring of an edge cell room inside the scroller; the negative
		// margin keeps the cells aligned with the row labels
		'col-start-2 -m-1 min-w-0 overflow-x-auto overscroll-x-contain p-1 [scrollbar-color:var(--muted-foreground)_transparent] [scrollbar-width:thin]',
		className
	)}
	{...restProps}
>
	{#key ctx.model.granularity}
		<div class="flex w-max flex-col transition-opacity duration-(--dur-base) ease-(--ease-settle) starting:opacity-0">
			{@render children?.()}
		</div>
	{/key}
</div>
