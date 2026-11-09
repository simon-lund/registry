<script lang="ts">
	import {
		ScrollMap,
		ScrollMapNext,
		ScrollMapPrevious,
		ScrollMapTick,
		ScrollMapTicks,
		ScrollMapTickTitle
	} from '#lib/registry/ui/scroll-map/index.js';

	const sections = [
		{ id: 'install', title: 'Install' },
		{ id: 'configure', title: 'Configure' },
		{ id: 'deploy', title: 'Deploy' }
	];

	let scroller = $state<HTMLElement | null>(null);
</script>

<div class="flex h-80">
	<div bind:this={scroller} class="flex-1 overflow-y-auto">
		{#each sections as section (section.id)}
			<section id={section.id}><h3>{section.title}</h3></section>
		{/each}
	</div>
	<ScrollMap target={scroller} aria-label="Sections">
		<ScrollMapPrevious aria-label="Previous section" />
		<ScrollMapTicks>
			{#each sections as section (section.id)}
				<ScrollMapTick value={section.id} aria-label={section.title}>
					<ScrollMapTickTitle>{section.title}</ScrollMapTickTitle>
				</ScrollMapTick>
			{/each}
		</ScrollMapTicks>
		<ScrollMapNext aria-label="Next section" />
	</ScrollMap>
</div>
