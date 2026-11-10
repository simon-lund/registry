<script lang="ts">
	import BookmarkIcon from '@lucide/svelte/icons/bookmark';
	import { onMount } from 'svelte';
	import Undo2Icon from '@lucide/svelte/icons/undo-2';
	import {
		SwipeDeck,
		SwipeDeckStack,
		SwipeDeckCard,
		SwipeDeckLabel,
		SwipeDeckActions,
		SwipeDeckAction,
		SwipeDeckUndo,
		type SwipeDeckUndoVia
	} from '#lib/registry/ui/swipe-deck/index.js';

	const cards = [
		{ id: 'tides', title: 'How tides are measured' },
		{ id: 'bridges', title: 'Why bridges hum in the wind' },
		{ id: 'paperclip', title: 'A short history of the paperclip' }
	];

	let deck = $state<ReturnType<typeof SwipeDeck>>();
	let saved = $state<string[]>([]);
	let note = $state('');

	// This example starts with one card already swiped, so Undo is live.
	onMount(() => deck?.swipe('right'));

	function onUndo(card: string, _direction: string, { via }: { via: SwipeDeckUndoVia }) {
		saved = saved.filter((c) => c !== card);
		note = `"${card}" came back by ${via}.`;
	}
</script>

<div class="flex w-full max-w-xs flex-col gap-4">
	<SwipeDeck
		bind:this={deck}
		aria-label="Reading list"
		historyLimit={3}
		onSwipe={(card) => {
			saved.push(card);
			note = '';
		}}
		{onUndo}
	>
		<SwipeDeckStack>
			{#each cards as card (card.id)}
				<SwipeDeckCard value={card.id}>
					<SwipeDeckLabel direction="right" variant="default"><BookmarkIcon aria-hidden="true" />Save</SwipeDeckLabel>
					<div class="bg-card h-full min-h-40 rounded-lg border p-5">{card.title}</div>
				</SwipeDeckCard>
			{/each}
		</SwipeDeckStack>

		<SwipeDeckActions>
			<SwipeDeckUndo aria-label="Undo" variant="outline" size="default">
				<Undo2Icon aria-hidden="true" />Undo
			</SwipeDeckUndo>
			<SwipeDeckAction direction="right" variant="default">Save</SwipeDeckAction>
		</SwipeDeckActions>
	</SwipeDeck>

	<p class="text-muted-foreground m-0 text-center text-xs">
		{note || `${saved.length} saved. Undo can go back three steps.`}
	</p>
</div>
