<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import {
		SwipeDeck,
		SwipeDeckStack,
		SwipeDeckCard,
		SwipeDeckLabel,
		SwipeDeckEmpty,
		SwipeDeckActions,
		SwipeDeckAction
	} from '#lib/registry/ui/swipe-deck/index.js';

	const drafts = [
		{ id: 'spring', title: 'Spring newsletter' },
		{ id: 'welcome', title: 'Welcome letter' }
	];
</script>

<SwipeDeck aria-label="Old drafts" class="w-full max-w-xs">
	<SwipeDeckStack>
		{#each drafts as draft (draft.id)}
			<SwipeDeckCard value={draft.id} thresholds={{ left: 0.5 }}>
				<SwipeDeckLabel direction="left"><Trash2Icon aria-hidden="true" />Delete</SwipeDeckLabel>
				<SwipeDeckLabel direction="right" variant="default"><CheckIcon aria-hidden="true" />Keep</SwipeDeckLabel>
				<div class="bg-card h-full min-h-40 rounded-lg border p-5">{draft.title}</div>
			</SwipeDeckCard>
		{/each}
		<SwipeDeckEmpty>No drafts left.</SwipeDeckEmpty>
	</SwipeDeckStack>

	<SwipeDeckActions>
		<SwipeDeckAction direction="left">Delete</SwipeDeckAction>
		<SwipeDeckAction direction="right" variant="default">Keep</SwipeDeckAction>
	</SwipeDeckActions>
</SwipeDeck>
