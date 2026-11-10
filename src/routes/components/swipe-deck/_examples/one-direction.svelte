<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
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

	const steps = [
		{ id: 'wash', title: 'Wash the rice' },
		{ id: 'soak', title: 'Soak it for ten minutes' },
		{ id: 'simmer', title: 'Simmer with the lid on' }
	];
</script>

<SwipeDeck aria-label="Recipe steps" class="w-full max-w-xs">
	<SwipeDeckStack>
		{#each steps as step (step.id)}
			<SwipeDeckCard value={step.id}>
				<SwipeDeckLabel direction="right" variant="default"><CheckIcon aria-hidden="true" />Done</SwipeDeckLabel>
				<div class="bg-card h-full min-h-40 rounded-lg border p-5">{step.title}</div>
			</SwipeDeckCard>
		{/each}
		<SwipeDeckEmpty>Ready to serve.</SwipeDeckEmpty>
	</SwipeDeckStack>

	<SwipeDeckActions>
		<SwipeDeckAction direction="left">Back</SwipeDeckAction>
		<SwipeDeckUndo aria-label="Undo"><Undo2Icon aria-hidden="true" /></SwipeDeckUndo>
		<SwipeDeckAction direction="right" variant="default">Done</SwipeDeckAction>
	</SwipeDeckActions>
</SwipeDeck>
