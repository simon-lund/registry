<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button } from '#lib/registry/ui/button/index.js';
	import { getSwipeDeck, type SwipeDeckDirection } from './context.svelte.js';

	// A button here, never a link, so the click is a button's (stock Button types both).
	type ButtonClick = Parameters<NonNullable<HTMLButtonAttributes['onclick']>>[0];

	/**
	 * SwipeDeckAction: a Button that sends the top card toward `direction`, with the same flight a
	 * swipe has (its label shows on the way). Disabled while the top card cannot go that way, or when
	 * no card is left; if it held focus then, focus moves to undo (or to the deck). Outline by default:
	 * give the one main action `variant="default"`. Write the words, and an `aria-label` if it is
	 * icon-only.
	 *
	 * @example
	 * <SwipeDeckAction direction="right" variant="default">Save</SwipeDeckAction>
	 */
	let {
		ref = $bindable(null),
		direction,
		variant = 'outline',
		disabled = false,
		onclick,
		children,
		...restProps
	}: ComponentProps<typeof Button> & { direction: SwipeDeckDirection } = $props();

	const deck = getSwipeDeck('SwipeDeckAction');
	const KEY: Record<SwipeDeckDirection, string> = { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp' };
	const off = $derived(disabled || !deck.can(direction));

	// A focused button that turns disabled drops focus to the body; hand it on first.
	$effect.pre(() => {
		if (off && ref && ref === document.activeElement) deck.focusFallback();
	});
</script>

<Button
	bind:ref
	data-slot="swipe-deck-action"
	data-direction={direction}
	aria-keyshortcuts={KEY[direction]}
	{variant}
	disabled={off}
	{...restProps}
	onclick={(event) => {
		onclick?.(event as ButtonClick);
		if (!event.defaultPrevented) deck.swipe(direction, 'button');
	}}
>
	{@render children?.()}
</Button>
