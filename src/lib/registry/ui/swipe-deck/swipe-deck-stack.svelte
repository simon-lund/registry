<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getSwipeDeck } from './context.svelte.js';

	/**
	 * SwipeDeckStack: the stage. Every SwipeDeckCard and the SwipeDeckEmpty share its one grid cell,
	 * stretched to the tallest card, so the deck keeps its size as cards leave and the end state
	 * stands where the cards stood. Its bottom padding is the peek of the cards behind (9px each).
	 * Give it a width (`max-w-sm`, the column's); the cards fill it.
	 *
	 * @example
	 * <SwipeDeckStack class="max-w-sm">
	 *   {#each cards as card (card.id)}<SwipeDeckCard value={card.id}>...</SwipeDeckCard>{/each}
	 *   <SwipeDeckEmpty>...</SwipeDeckEmpty>
	 * </SwipeDeckStack>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> = $props();

	getSwipeDeck('SwipeDeckStack');
</script>

<div
	bind:this={ref}
	data-slot="swipe-deck-stack"
	class={cn(
		'relative isolate grid w-full grid-cols-1 grid-rows-1',
		'pb-[calc(var(--spacing)*2.25*var(--swipe-deck-peek,2))]',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
