<script lang="ts">
	import { Dial, DialKnob, DialStop, DialUnit } from '#lib/registry/ui/dial/index.js';

	const stops = [5, 10, 15, 30, 60];

	let minutes = $state(15);
</script>

<Dial bind:value={minutes} step={stops} aria-label="Pause after" aria-valuetext="{minutes} minutes">
	{#each stops as stop (stop)}
		<DialStop value={stop} variant="major">{stop}</DialStop>
	{/each}
	<DialKnob />
	<DialUnit>min</DialUnit>
</Dial>
