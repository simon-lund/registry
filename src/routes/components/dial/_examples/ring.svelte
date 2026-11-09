<script lang="ts">
	import { Dial, DialKnob, DialStop } from '#lib/registry/ui/dial/index.js';

	// A full hour: 60 is 0 again, so the last stop is 55.
	const stops = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

	let minute = $state(45);
</script>

<Dial
	bind:value={minute}
	min={0}
	max={55}
	step={5}
	sweep={360}
	start={0}
	aria-label="Minute"
	aria-valuetext="{minute} minutes past"
>
	{#each stops as stop (stop)}
		{#if stop % 15 === 0}
			<DialStop value={stop} variant="major">{stop}</DialStop>
		{:else}
			<DialStop value={stop} />
		{/if}
	{/each}
	<DialKnob />
</Dial>
