<script lang="ts">
	import {
		ScrollMap,
		ScrollMapNext,
		ScrollMapPrevious,
		ScrollMapTick,
		ScrollMapTicks,
		ScrollMapTickTitle
	} from '#lib/registry/ui/scroll-map/index.js';

	const chapters = [
		'Packing the bag',
		'The first climb',
		'Lunch at the hut',
		'Crossing the ridge',
		'Weather turns',
		'The long way down',
		'Back in the valley',
		'What to bring next time'
	].map((title, i) => ({ title, id: `hike-${i + 1}` }));

	let scroller = $state<HTMLElement | null>(null);
</script>

<div class="bg-background flex h-64 w-full max-w-md overflow-hidden rounded-lg border">
	<ScrollMap target={scroller} side="left" aria-label="Chapters">
		<ScrollMapPrevious aria-label="Previous chapter" />
		<ScrollMapTicks>
			{#each chapters as chapter (chapter.id)}
				<ScrollMapTick value={chapter.id} aria-label={chapter.title}>
					<ScrollMapTickTitle>{chapter.title}</ScrollMapTickTitle>
				</ScrollMapTick>
			{/each}
		</ScrollMapTicks>
		<ScrollMapNext aria-label="Next chapter" />
	</ScrollMap>
	<div bind:this={scroller} role="region" aria-label="Trip notes" class="min-w-0 flex-1 overflow-y-auto px-5 py-4">
		{#each chapters as chapter (chapter.id)}
			<section id={chapter.id} class="pb-16 last:pb-0">
				<h3 class="text-base">{chapter.title}</h3>
				<p class="text-muted-foreground mt-1 text-sm">Notes from the second day of the walk, written up at home.</p>
			</section>
		{/each}
	</div>
</div>
