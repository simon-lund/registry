<script lang="ts">
	import {
		SwipeDeck,
		SwipeDeckStack,
		SwipeDeckCard,
		SwipeDeckLabel,
		SwipeDeckEmpty,
		SwipeDeckActions,
		SwipeDeckAction
	} from '#lib/registry/ui/swipe-deck/index.js';

	const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
</script>

<SwipeDeck aria-label="Days of the week" peek={3} class="w-full max-w-xs">
	<SwipeDeckStack>
		{#each days as day (day)}
			<SwipeDeckCard value={day}>
				<SwipeDeckLabel direction="right">Next</SwipeDeckLabel>
				<div class="bg-card h-full min-h-40 rounded-lg border p-5">{day}</div>
			</SwipeDeckCard>
		{/each}
		<SwipeDeckEmpty>That was the week.</SwipeDeckEmpty>
	</SwipeDeckStack>

	<SwipeDeckActions>
		<SwipeDeckAction direction="right">Next</SwipeDeckAction>
	</SwipeDeckActions>
</SwipeDeck>
