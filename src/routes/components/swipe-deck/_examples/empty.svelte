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

	const articles: { id: string; title: string }[] = [];
</script>

<SwipeDeck aria-label="Reading list" class="w-full max-w-xs">
	<SwipeDeckStack>
		{#each articles as article (article.id)}
			<SwipeDeckCard value={article.id}>
				<SwipeDeckLabel direction="left">Skip</SwipeDeckLabel>
				<SwipeDeckLabel direction="right">Save</SwipeDeckLabel>
				<div class="bg-card h-full min-h-40 rounded-lg border p-5">{article.title}</div>
			</SwipeDeckCard>
		{/each}
		<SwipeDeckEmpty class="min-h-40 gap-1 text-center">
			<p class="m-0 font-medium">Nothing to read yet</p>
			<p class="text-muted-foreground m-0 text-sm">Articles you add show up here.</p>
		</SwipeDeckEmpty>
	</SwipeDeckStack>

	<SwipeDeckActions>
		<SwipeDeckAction direction="left">Skip</SwipeDeckAction>
		<SwipeDeckUndo aria-label="Undo"><Undo2Icon aria-hidden="true" /></SwipeDeckUndo>
		<SwipeDeckAction direction="right" variant="default">Save</SwipeDeckAction>
	</SwipeDeckActions>
</SwipeDeck>
