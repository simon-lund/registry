<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import StarIcon from '@lucide/svelte/icons/star';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
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

	const photos = [
		{ id: 'harbour', title: 'Harbour at dawn' },
		{ id: 'orchard', title: 'Orchard in October' },
		{ id: 'ferry', title: 'The last ferry' }
	];
</script>

<SwipeDeck aria-label="Photos to sort" class="w-full max-w-xs">
	<SwipeDeckStack>
		{#each photos as photo (photo.id)}
			<SwipeDeckCard value={photo.id}>
				<SwipeDeckLabel direction="left"><Trash2Icon aria-hidden="true" />Delete</SwipeDeckLabel>
				<SwipeDeckLabel direction="right" variant="default"><CheckIcon aria-hidden="true" />Keep</SwipeDeckLabel>
				<SwipeDeckLabel direction="up"><StarIcon aria-hidden="true" />Favourite</SwipeDeckLabel>
				<div class="bg-card h-full min-h-48 rounded-lg border p-5">{photo.title}</div>
			</SwipeDeckCard>
		{/each}
		<SwipeDeckEmpty>All sorted.</SwipeDeckEmpty>
	</SwipeDeckStack>

	<SwipeDeckActions>
		<SwipeDeckAction direction="left">Delete</SwipeDeckAction>
		<SwipeDeckAction direction="up">Favourite</SwipeDeckAction>
		<SwipeDeckUndo aria-label="Undo"><Undo2Icon aria-hidden="true" /></SwipeDeckUndo>
		<SwipeDeckAction direction="right" variant="default">Keep</SwipeDeckAction>
	</SwipeDeckActions>
</SwipeDeck>
