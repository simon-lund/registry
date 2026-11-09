<script lang="ts">
	import {
		ScrollMap,
		ScrollMapNext,
		ScrollMapPrevious,
		ScrollMapTick,
		ScrollMapTickDescription,
		ScrollMapTicks,
		ScrollMapTickTitle
	} from '#lib/registry/ui/scroll-map/index.js';

	const steps = [
		{ title: 'Feed the starter', time: '12 hours', text: 'Mix a spoon of starter with equal parts flour and water. Leave it somewhere warm until it has doubled.' },
		{ title: 'Mix the flour', time: '5 minutes', text: 'Stir 450 g of bread flour and 50 g of rye with 350 g of water until no dry patches are left.' },
		{ title: 'Rest', time: '1 hour', text: 'Cover the bowl. The flour takes up the water, and the dough starts to feel smooth by itself.' },
		{ title: 'Add starter', time: '5 minutes', text: 'Work in 100 g of starter with wet hands, squeezing it through the dough until it disappears.' },
		{ title: 'Add salt', time: '5 minutes', text: 'Sprinkle 10 g of salt over the top with a splash of water, then fold until you can no longer feel the grains.' },
		{ title: 'First fold', time: '30 minutes', text: 'Pull one side up and over the middle, turn the bowl and repeat four times. Cover it again.' },
		{ title: 'Second fold', time: '30 minutes', text: 'The dough holds its shape a little longer now. Fold it the same way, gently this time.' },
		{ title: 'Third fold', time: '30 minutes', text: 'One more round. Stop when the dough feels springy and small bubbles show under the skin.' },
		{ title: 'Bulk rise', time: '3 hours', text: 'Leave it alone until it has grown by half and jiggles when you shake the bowl.' },
		{ title: 'Pre-shape', time: '5 minutes', text: 'Turn the dough out on a bare counter and pull it into a loose round with a scraper.' },
		{ title: 'Bench rest', time: '20 minutes', text: 'Leave the round uncovered. It relaxes and spreads, which makes the final shape easier.' },
		{ title: 'Shape', time: '5 minutes', text: 'Flour the top, flip it and fold the sides in. Roll it towards you to tighten the skin.' },
		{ title: 'Proof', time: '12 hours', text: 'Put it seam side up in a floured basket and into the fridge overnight.' },
		{ title: 'Heat the oven', time: '45 minutes', text: 'Set the oven to 250 degrees with a lidded pot inside, so the pot is as hot as the air.' },
		{ title: 'Score', time: '1 minute', text: 'Turn the cold loaf onto paper and cut one long line along the top with a sharp blade.' },
		{ title: 'Bake covered', time: '20 minutes', text: 'Lower the loaf into the pot and close the lid. The steam it gives off keeps the crust soft while it rises.' },
		{ title: 'Bake open', time: '20 minutes', text: 'Take off the lid and bake until the crust is a deep brown, darker than feels right.' },
		{ title: 'Cool', time: '1 hour', text: 'Leave it on a rack before you cut it. The crumb is still setting, and it gums up if you hurry.' }
	].map((step, i) => ({ ...step, id: `bread-${i + 1}` }));

	let scroller = $state<HTMLElement | null>(null);
</script>

<div class="bg-background flex h-80 w-full max-w-lg overflow-hidden rounded-lg border">
	<div bind:this={scroller} role="region" aria-label="Country loaf" class="min-w-0 flex-1 overflow-y-auto px-5 py-4">
		{#each steps as step (step.id)}
			<section id={step.id} class="pb-6 last:pb-0">
				<h3 class="text-base">{step.title}</h3>
				<p class="text-muted-foreground mt-1 text-sm">{step.text}</p>
			</section>
		{/each}
	</div>
	<ScrollMap target={scroller} aria-label="Steps">
		<ScrollMapPrevious aria-label="Previous step" />
		<ScrollMapTicks>
			{#each steps as step (step.id)}
				<ScrollMapTick value={step.id} aria-label={step.title}>
					<ScrollMapTickTitle>{step.title}</ScrollMapTickTitle>
					<ScrollMapTickDescription>{step.time}</ScrollMapTickDescription>
				</ScrollMapTick>
			{/each}
		</ScrollMapTicks>
		<ScrollMapNext aria-label="Next step" />
	</ScrollMap>
</div>
