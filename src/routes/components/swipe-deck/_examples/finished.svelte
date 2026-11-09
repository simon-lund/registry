<script lang="ts">
	import { onMount } from 'svelte';
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

	let deck = $state<ReturnType<typeof SwipeDeck>>();

	// This example starts with its only card already swiped, so the end state is on show.
	onMount(() => deck?.swipe('right'));
</script>

<SwipeDeck bind:this={deck} aria-label="Reading list" class="w-full max-w-xs">
	<SwipeDeckStack>
		<SwipeDeckCard value="tides">
			<SwipeDeckLabel direction="left">Skip</SwipeDeckLabel>
			<SwipeDeckLabel direction="right">Save</SwipeDeckLabel>
			<div class="bg-card h-full min-h-40 rounded-lg border p-5">How tides are measured</div>
		</SwipeDeckCard>
		<SwipeDeckEmpty class="gap-1 text-center">
			<p class="m-0 font-medium">All caught up</p>
			<p class="text-muted-foreground m-0 text-sm">Undo brings the last card back.</p>
		</SwipeDeckEmpty>
	</SwipeDeckStack>

	<SwipeDeckActions>
		<SwipeDeckAction direction="left">Skip</SwipeDeckAction>
		<SwipeDeckUndo aria-label="Undo"><Undo2Icon aria-hidden="true" /></SwipeDeckUndo>
		<SwipeDeckAction direction="right" variant="default">Save</SwipeDeckAction>
	</SwipeDeckActions>
</SwipeDeck>
