<script lang="ts">
	import Undo2Icon from '@lucide/svelte/icons/undo-2';
	import {
		SwipeDeck,
		SwipeDeckStack,
		SwipeDeckCard,
		SwipeDeckLabel,
		SwipeDeckEmpty,
		SwipeDeckActions,
		SwipeDeckAction,
		SwipeDeckUndo
	} from '#lib/registry/ui/swipe-deck/index.js';

	const cards = [
		{ id: 'a', title: 'First card' },
		{ id: 'b', title: 'Second card' }
	];
</script>

<SwipeDeck
	aria-label="Cards"
	class="w-full max-w-xs"
	onSwipe={(card, direction) => console.log('swiped', card, direction)}
	onUndo={(card) => console.log('back', card)}
>
	<SwipeDeckStack>
		{#each cards as card (card.id)}
			<SwipeDeckCard value={card.id}>
				<SwipeDeckLabel direction="left">No</SwipeDeckLabel>
				<SwipeDeckLabel direction="right">Yes</SwipeDeckLabel>
				<div class="bg-card h-full min-h-40 rounded-lg border p-5">{card.title}</div>
			</SwipeDeckCard>
		{/each}
		<SwipeDeckEmpty>No cards left.</SwipeDeckEmpty>
	</SwipeDeckStack>

	<SwipeDeckActions>
		<SwipeDeckAction direction="left">No</SwipeDeckAction>
		<SwipeDeckUndo aria-label="Undo"><Undo2Icon aria-hidden="true" /></SwipeDeckUndo>
		<SwipeDeckAction direction="right" variant="default">Yes</SwipeDeckAction>
	</SwipeDeckActions>
</SwipeDeck>
