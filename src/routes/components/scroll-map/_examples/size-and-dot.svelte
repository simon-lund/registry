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

	const turns = [
		{ you: true, time: '09:12', text: 'My rear brake squeaks when it rains.' },
		{ you: false, time: '09:13', text: 'That is usually wet pads. Does it stop once they have warmed up, or does it squeak all the way down a hill?' },
		{ you: true, time: '09:15', text: 'All the way. Here is a photo of the pad.', photo: true },
		{ you: false, time: '09:16', text: 'The pad looks glazed. Sand it lightly and wipe the rim with alcohol. If that does not help, it is time for new pads.' },
		{ you: true, time: '09:20', text: 'Which pads fit?' },
		{ you: false, time: '09:21', text: 'Any V-brake pad of 70 mm fits. For wet roads take a softer compound, they wear faster but squeak less.' },
		{ you: true, time: '09:24', text: 'Can you fit them for me?' },
		{ you: false, time: '09:25', text: 'Yes. Bring it in on Thursday morning and it will be ready by the afternoon.' },
		{ you: true, time: '09:26', text: 'Thursday works, thanks.' },
		{ you: false, time: '09:26', text: 'Booked. You will get a message when it is ready to pick up.' }
	].map((turn, i) => ({ ...turn, id: `turn-${i + 1}` }));

	let scroller = $state<HTMLElement | null>(null);
</script>

<div class="bg-background flex h-72 w-full max-w-md overflow-hidden rounded-lg border">
	<div bind:this={scroller} role="region" aria-label="Conversation with the bike shop" class="min-w-0 flex-1 overflow-y-auto px-5 py-4">
		{#each turns as turn (turn.id)}
			<p id={turn.id} class={['pb-5 text-sm last:pb-0', turn.you ? 'font-medium' : 'text-muted-foreground']}>{turn.text}</p>
		{/each}
	</div>
	<ScrollMap target={scroller} aria-label="Conversation">
		<ScrollMapPrevious aria-label="Previous message" />
		<ScrollMapTicks>
			{#each turns as turn (turn.id)}
				<ScrollMapTick value={turn.id} size={turn.you ? 'sm' : 'default'} dot={turn.photo} aria-label={turn.text}>
					<ScrollMapTickTitle>{turn.text}</ScrollMapTickTitle>
					<ScrollMapTickDescription>
						{turn.you ? 'You' : 'Bike shop'}, {turn.time}{turn.photo ? ', one photo' : ''}
					</ScrollMapTickDescription>
				</ScrollMapTick>
			{/each}
		</ScrollMapTicks>
		<ScrollMapNext aria-label="Next message" />
	</ScrollMap>
</div>
