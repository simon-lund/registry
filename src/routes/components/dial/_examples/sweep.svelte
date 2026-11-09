<script lang="ts">
	import { Dial, DialKnob, DialStop, DialUnit } from '#lib/registry/ui/dial/index.js';

	const stops = [10, 20, 30, 40, 50, 60, 70];
	const labelled = new Set([10, 40, 70]);

	let brightness = $state(40);
</script>

<Dial
	bind:value={brightness}
	step={stops}
	sweep={180}
	aria-label="Brightness"
	aria-valuetext="{brightness} percent"
>
	{#each stops as stop (stop)}
		{#if labelled.has(stop)}
			<DialStop value={stop} variant="major">{stop}</DialStop>
		{:else}
			<DialStop value={stop} />
		{/if}
	{/each}
	<DialKnob />
	<DialUnit>percent</DialUnit>
</Dial>
