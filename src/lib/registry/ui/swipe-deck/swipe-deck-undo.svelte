<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button } from '#lib/registry/ui/button/index.js';
	import { getSwipeDeck } from './context.svelte.js';

	// A button here, never a link, so the click is a button's (stock Button types both).
	type ButtonClick = Parameters<NonNullable<HTMLButtonAttributes['onclick']>>[0];

	/**
	 * SwipeDeckUndo: brings the last swiped card back, with the reverse motion (Backspace and
	 * Cmd+Z / Ctrl+Z do the same). Disabled while there is nothing to undo; if it held focus then,
	 * focus moves to the deck. A ghost icon Button by default; `aria-label` is required.
	 *
	 * @example
	 * <SwipeDeckUndo aria-label="Undo"><Undo2Icon /></SwipeDeckUndo>
	 */
	let {
		ref = $bindable(null),
		variant = 'ghost',
		size = 'icon',
		disabled = false,
		onclick,
		children,
		...restProps
	}: ComponentProps<typeof Button> & { 'aria-label': string } = $props();

	const deck = getSwipeDeck('SwipeDeckUndo');
	const off = $derived(disabled || !deck.canUndo);

	$effect(() => {
		deck.undoButton = ref;
		return () => {
			if (deck.undoButton === ref) deck.undoButton = null;
		};
	});
	// A focused button that turns disabled drops focus to the body; hand it to the deck first.
	$effect.pre(() => {
		if (off && ref && ref === document.activeElement) deck.root?.focus();
	});
</script>

<Button
	bind:ref
	data-slot="swipe-deck-undo"
	aria-keyshortcuts="Backspace Meta+Z Control+Z"
	{variant}
	{size}
	disabled={off}
	{...restProps}
	onclick={(event) => {
		onclick?.(event as ButtonClick);
		if (!event.defaultPrevented) deck.undo('button');
	}}
>
	{@render children?.()}
</Button>
