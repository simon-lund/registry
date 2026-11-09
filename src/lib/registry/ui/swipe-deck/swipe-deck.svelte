<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import {
		SwipeDeckState,
		setSwipeDeck,
		type SwipeDeckDirection,
		type SwipeDeckSwipeHandler,
		type SwipeDeckUndoHandler,
		type SwipeDeckUndoVia,
		type SwipeDeckVia
	} from './context.svelte.js';

	/**
	 * SwipeDeck: a stack of cards you go through one at a time, swiping each one away. Nothing
	 * domain-specific inside: what a direction means is the consumer's, and so are all the words.
	 * Cards are children, so any markup or snippet can be a card.
	 *
	 * Parts: SwipeDeckStack (the stage: every card in one cell), SwipeDeckCard (one card, any content;
	 * give that content `h-full`), SwipeDeckLabel (inside a card: turns a direction on and is the word
	 * that grows while the card is dragged that way), SwipeDeckEmpty (shown once every card is gone),
	 * SwipeDeckActions with SwipeDeckAction and SwipeDeckUndo (the buttons: a gesture is never the
	 * only way).
	 *
	 * The deck owns the order and a short history. Render every card, always, in order; the deck hides
	 * the swiped ones. `onSwipe(card, direction, { via })` fires as a card starts to leave (the next
	 * one is already on top, so people can swipe on at once); change your data there, and return
	 * `false` to keep the card. Undo (SwipeDeckUndo, Backspace, Cmd+Z / Ctrl+Z, or `undo()` through
	 * `bind:this`) brings the last card back with the reverse motion and calls
	 * `onUndo(card, direction, { via })`: reverse the meaning there.
	 *
	 * The top card follows the pointer: the axis locks after 8px, the card follows 1:1 toward a
	 * direction with a label and rubber-bands toward one without, rotating with the drag (12 degrees
	 * per card width; grabbed below its middle it turns the other way). Its label grows with the
	 * distance and locks once the threshold is reached (22% of the card's width, 6px hysteresis).
	 * Released there, or flicked toward a direction (over 0.5px/ms, at least 16px out), it flies off
	 * along its own momentum and fades; released short it springs home with its release velocity
	 * (stiffness 400, damping ratio 0.78). The cards behind rise with the drag and settle into place
	 * when it goes. Without an `up` label, a vertical drag belongs to the page (`touch-action: pan-y`);
	 * with one, an upward finger is the card's and a downward one still scrolls (`pan-up`).
	 *
	 * Keyboard: the deck is one tab stop. Left, Right and Up send the top card that way (only
	 * directions its labels turned on), Backspace or Cmd+Z / Ctrl+Z undo. The committed label's words
	 * are announced politely. Give the deck an `aria-label` and describe the keys in
	 * `aria-describedby`.
	 *
	 * Reduced motion: the finger still moves the card, but nothing flies or rises: the card fades out
	 * where it is, the next one is simply there, undo fades the card back in.
	 *
	 * States, mutually exclusive: cards left (the top card is live), none left (SwipeDeckEmpty).
	 * Loading and failing are the consumer's: render something else instead of the deck.
	 *
	 * A flying card passes the deck's edges and the deck does not clip it: give the page or the column
	 * around it `overflow-x: clip` (not `hidden`), or the page scrolls sideways.
	 *
	 * @example
	 * <SwipeDeck aria-label="Reading list" onSwipe={(id, direction) => decide(id, direction)}>
	 *   <SwipeDeckStack>
	 *     {#each articles as article (article.id)}
	 *       <SwipeDeckCard value={article.id}>
	 *         <SwipeDeckLabel direction="right"><BookmarkIcon />Save</SwipeDeckLabel>
	 *         <SwipeDeckLabel direction="left"><XIcon />Skip</SwipeDeckLabel>
	 *         <div class="bg-card h-full rounded-lg border p-5">{article.title}</div>
	 *       </SwipeDeckCard>
	 *     {/each}
	 *     <SwipeDeckEmpty><p>All caught up.</p></SwipeDeckEmpty>
	 *   </SwipeDeckStack>
	 *   <SwipeDeckActions>
	 *     <SwipeDeckAction direction="left">Skip</SwipeDeckAction>
	 *     <SwipeDeckUndo aria-label="Undo"><Undo2Icon /></SwipeDeckUndo>
	 *     <SwipeDeckAction direction="right" variant="default">Save</SwipeDeckAction>
	 *   </SwipeDeckActions>
	 * </SwipeDeck>
	 */
	let {
		ref = $bindable(null),
		class: className,
		peek = 2,
		historyLimit = 10,
		onSwipe,
		onUndo,
		onkeydown,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
		/** How many cards show behind the top one, 0–3. Default 2. */
		peek?: number;
		/** How many swipes undo can take back. Default 10. */
		historyLimit?: number;
		/** A card started leaving toward `direction`. Return `false` to keep it. */
		onSwipe?: SwipeDeckSwipeHandler;
		/** A card came back through undo: reverse what its swipe did. */
		onUndo?: SwipeDeckUndoHandler;
	} = $props();

	const deck = setSwipeDeck(
		new SwipeDeckState({
			onSwipe: () => onSwipe,
			onUndo: () => onUndo,
			historyLimit: () => historyLimit,
			peek: () => Math.max(0, Math.min(3, Math.round(peek)))
		})
	);

	$effect(() => {
		deck.root = ref;
		return () => {
			if (deck.root === ref) deck.root = null;
		};
	});

	/** Send the top card toward `direction`, exactly as its button does. */
	export function swipe(direction: SwipeDeckDirection, via: SwipeDeckVia = 'call') {
		return deck.swipe(direction, via);
	}
	/** Bring the last swiped card back. */
	export function undo(via: SwipeDeckUndoVia = 'call') {
		return deck.undo(via);
	}

	const KEYS: Record<string, SwipeDeckDirection> = {
		ArrowLeft: 'left',
		ArrowRight: 'right',
		ArrowUp: 'up'
	};
	const KEY_NAMES: Record<SwipeDeckDirection, string> = {
		left: 'ArrowLeft',
		right: 'ArrowRight',
		up: 'ArrowUp'
	};

	const shortcuts = $derived(
		[
			...(['left', 'right', 'up'] as const).filter((d) => deck.can(d)).map((d) => KEY_NAMES[d]),
			...(deck.canUndo ? ['Backspace', 'Meta+Z', 'Control+Z'] : [])
		].join(' ') || undefined
	);

	function editable(target: EventTarget | null) {
		return (
			target instanceof HTMLElement &&
			(target.isContentEditable || !!target.closest('input, textarea, select, [contenteditable]'))
		);
	}

	function handleKeydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		onkeydown?.(event);
		if (event.defaultPrevented || event.repeat || editable(event.target)) return;
		const mod = event.metaKey || event.ctrlKey;
		const direction = KEYS[event.key];
		if (direction && !mod && !event.altKey && !event.shiftKey) {
			if (deck.swipe(direction, 'keyboard')) event.preventDefault();
		} else if (
			(event.key === 'Backspace' && !mod && !event.altKey && !event.shiftKey) ||
			(event.key.toLowerCase() === 'z' && mod && !event.shiftKey && !event.altKey)
		) {
			if (deck.undo('keyboard')) event.preventDefault();
		}
	}
</script>

<!--
	A focusable group: the arrow keys and Backspace are its keyboard alternative to the swipe
	(documented above), so it needs a tab stop of its own even though a group is not interactive.
-->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	bind:this={ref}
	data-slot="swipe-deck"
	data-empty={deck.remaining.length === 0 || undefined}
	role="group"
	tabindex="0"
	aria-keyshortcuts={shortcuts}
	class={cn(
		'focus-visible:ring-ring/50 flex flex-col gap-6 rounded-lg outline-none focus-visible:ring-3',
		className
	)}
	style:--swipe-deck-peek={deck.peek}
	{...restProps}
	onkeydown={handleKeydown}
>
	{@render children?.()}
	<span class="sr-only" aria-live="polite">{deck.announcement}</span>
</div>
