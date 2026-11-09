<script lang="ts">
	import {
		SwipeDeck,
		SwipeDeckStack,
		SwipeDeckCard,
		SwipeDeckLabel,
		SwipeDeckEmpty,
		SwipeDeckActions,
		SwipeDeckAction,
		type SwipeDeckDirection
	} from '#lib/registry/ui/swipe-deck/index.js';

	const notes = [
		{ id: 'wifi', title: 'Wi-Fi password', pinned: true },
		{ id: 'bins', title: 'Bins go out on Tuesday', pinned: false },
		{ id: 'keys', title: 'Spare keys are with Ana', pinned: false }
	];

	let message = $state('');

	function onSwipe(card: string, direction: SwipeDeckDirection) {
		const pinned = notes.find((note) => note.id === card)?.pinned;
		message = pinned && direction === 'left' ? 'Pinned notes stay.' : '';
		// false keeps the card on the deck.
		return !(pinned && direction === 'left');
	}
</script>

<div class="flex w-full max-w-xs flex-col gap-4">
	<SwipeDeck aria-label="Notes" {onSwipe}>
		<SwipeDeckStack>
			{#each notes as note (note.id)}
				<SwipeDeckCard value={note.id}>
					<SwipeDeckLabel direction="left">Archive</SwipeDeckLabel>
					<SwipeDeckLabel direction="right">Next</SwipeDeckLabel>
					<div class="bg-card flex h-full min-h-40 flex-col gap-1 rounded-lg border p-5">
						{#if note.pinned}<p class="text-muted-foreground m-0 text-sm">Pinned</p>{/if}
						<p class="m-0">{note.title}</p>
					</div>
				</SwipeDeckCard>
			{/each}
			<SwipeDeckEmpty>No notes left.</SwipeDeckEmpty>
		</SwipeDeckStack>

		<SwipeDeckActions>
			<SwipeDeckAction direction="left">Archive</SwipeDeckAction>
			<SwipeDeckAction direction="right" variant="default">Next</SwipeDeckAction>
		</SwipeDeckActions>
	</SwipeDeck>

	<p class="text-muted-foreground m-0 min-h-4 text-center text-xs" aria-live="polite">{message}</p>
</div>
