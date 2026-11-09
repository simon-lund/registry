<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getSwipeDeck } from './context.svelte.js';

	/**
	 * SwipeDeckActions: the row of buttons under the deck, the alternative to the gesture. Centred,
	 * in the order the directions sit: the left action, undo, the right action.
	 *
	 * @example
	 * <SwipeDeckActions>
	 *   <SwipeDeckAction direction="left">Skip</SwipeDeckAction>
	 *   <SwipeDeckUndo aria-label="Undo"><Undo2Icon /></SwipeDeckUndo>
	 *   <SwipeDeckAction direction="right" variant="default">Save</SwipeDeckAction>
	 * </SwipeDeckActions>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> = $props();

	getSwipeDeck('SwipeDeckActions');
</script>

<div
	bind:this={ref}
	data-slot="swipe-deck-actions"
	class={cn('flex flex-wrap items-center justify-center gap-3', className)}
	{...restProps}
>
	{@render children?.()}
</div>
