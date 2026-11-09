<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { TransitionConfig } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getSwipeDeck, motionMs } from './context.svelte.js';

	/**
	 * SwipeDeckEmpty: the end of the deck, shown once no card is left (and while the deck has none),
	 * in the stage's cell where the cards stood. Write your own words and, where it helps, the next
	 * step. It rises 8px and fades in (220ms, after 140ms, so the last card is on its way first); an
	 * undo takes it away at once. Reduced motion: it fades. A polite status, so the end is announced.
	 *
	 * @example
	 * <SwipeDeckEmpty><p>All caught up.</p></SwipeDeckEmpty>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> = $props();

	const deck = getSwipeDeck('SwipeDeckEmpty');

	function rise(node: Element): TransitionConfig {
		const reduced = prefersReducedMotion.current;
		return {
			delay: motionMs(node, '--dur-quick', 140),
			duration: motionMs(node, '--dur-base', 220),
			easing: cubicOut,
			css: (t, u) => `opacity:${t};translate:0 ${reduced ? 0 : u * 8}px`
		};
	}
</script>

<div role="status" class="contents">
	{#if deck.remaining.length === 0}
		<div
			bind:this={ref}
			data-slot="swipe-deck-empty"
			class={cn('z-0 flex min-w-0 flex-col items-center justify-center self-center [grid-area:1/1]', className)}
			in:rise
			{...restProps}
		>
			{@render children?.()}
		</div>
	{/if}
</div>
