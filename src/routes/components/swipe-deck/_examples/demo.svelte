<script lang="ts">
	import BookmarkIcon from '@lucide/svelte/icons/bookmark';
	import PaperclipIcon from '@lucide/svelte/icons/paperclip';
	import WavesIcon from '@lucide/svelte/icons/waves';
	import WindIcon from '@lucide/svelte/icons/wind';
	import Undo2Icon from '@lucide/svelte/icons/undo-2';
	import XIcon from '@lucide/svelte/icons/x';
	import { Button } from '#lib/registry/ui/button/index.js';
	import {
		SwipeDeck,
		SwipeDeckStack,
		SwipeDeckCard,
		SwipeDeckLabel,
		SwipeDeckEmpty,
		SwipeDeckActions,
		SwipeDeckAction,
		SwipeDeckUndo,
		type SwipeDeckDirection
	} from '#lib/registry/ui/swipe-deck/index.js';

	const articles = [
		{ id: 'tides', title: 'How tides are measured', source: 'Field Notes', minutes: 6, icon: WavesIcon },
		{ id: 'bridges', title: 'Why bridges hum in the wind', source: 'Structures', minutes: 9, icon: WindIcon },
		{ id: 'paperclip', title: 'A short history of the paperclip', source: 'Small Things', minutes: 4, icon: PaperclipIcon }
	];

	const id = $props.id();
	let round = $state(0);
	let saved = $state<string[]>([]);
	let skipped = $state<string[]>([]);
	const left = $derived(articles.length - saved.length - skipped.length);

	function onSwipe(card: string, direction: SwipeDeckDirection) {
		if (direction === 'right') saved.push(card);
		else skipped.push(card);
	}
	function onUndo(card: string) {
		saved = saved.filter((c) => c !== card);
		skipped = skipped.filter((c) => c !== card);
	}
	function startOver() {
		saved = [];
		skipped = [];
		round++;
	}
</script>

<div class="flex w-full max-w-xs flex-col gap-4">
	{#key round}
		<SwipeDeck aria-label="Reading list" aria-describedby="{id}-keys" {onSwipe} {onUndo}>
			<SwipeDeckStack>
				{#each articles as article (article.id)}
					<SwipeDeckCard value={article.id}>
						<SwipeDeckLabel direction="right" variant="default"><BookmarkIcon aria-hidden="true" />Save</SwipeDeckLabel>
						<SwipeDeckLabel direction="left"><XIcon aria-hidden="true" />Skip</SwipeDeckLabel>
						<div class="bg-card text-card-foreground flex h-full flex-col gap-2 rounded-lg border p-3">
							<div class="bg-muted text-muted-foreground grid h-28 place-items-center rounded-sm">
								<article.icon class="size-10" strokeWidth={1.5} aria-hidden="true" />
							</div>
							<p class="text-muted-foreground m-0 mt-1 px-2 text-sm">{article.source}</p>
							<p class="m-0 px-2 text-lg font-medium">{article.title}</p>
							<p class="text-muted-foreground m-0 mb-2 px-2 text-sm">{article.minutes} min read</p>
						</div>
					</SwipeDeckCard>
				{/each}
				<SwipeDeckEmpty class="gap-3 text-center">
					<p class="m-0 font-medium">All caught up</p>
					<p class="text-muted-foreground m-0 text-sm">{saved.length} saved, {skipped.length} skipped.</p>
					<Button variant="outline" onclick={startOver}>Start over</Button>
				</SwipeDeckEmpty>
			</SwipeDeckStack>

			<SwipeDeckActions>
				<SwipeDeckAction direction="left" size="lg"><XIcon aria-hidden="true" />Skip</SwipeDeckAction>
				<SwipeDeckUndo aria-label="Undo" size="icon-lg"><Undo2Icon aria-hidden="true" /></SwipeDeckUndo>
				<SwipeDeckAction direction="right" variant="default" size="lg"><BookmarkIcon aria-hidden="true" />Save</SwipeDeckAction>
			</SwipeDeckActions>
		</SwipeDeck>
	{/key}

	<p id="{id}-keys" class="text-muted-foreground m-0 text-center text-xs">
		{left} left. Drag, or use the arrow keys. Backspace undoes.
	</p>
</div>
