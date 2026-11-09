<script lang="ts">
	import { Dial, DialKnob, DialStop, DialUnit } from '#lib/registry/ui/dial/index.js';

	const stops = [5, 10, 15, 30, 60];
</script>

<Dial value={15} step={stops} disabled aria-label="Pause after" aria-valuetext="15 minutes">
	{#each stops as stop (stop)}
		<DialStop value={stop} variant="major">{stop}</DialStop>
	{/each}
	<DialKnob />
	<DialUnit>min</DialUnit>
</Dial>
