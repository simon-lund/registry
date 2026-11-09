<script lang="ts">
	import { Dial, DialKnob, DialStop } from '#lib/registry/ui/dial/index.js';

	const stops = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

	let volume = $state(40);
</script>

<Dial bind:value={volume} min={0} max={100} step={10} aria-label="Volume" aria-valuetext="{volume} percent">
	{#each stops as stop (stop)}
		{#if stop % 50 === 0}
			<DialStop value={stop} variant="major">{stop}</DialStop>
		{:else}
			<DialStop value={stop} />
		{/if}
	{/each}
	<DialKnob />
</Dial>
