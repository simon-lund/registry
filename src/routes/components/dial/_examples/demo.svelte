<script lang="ts">
	import { Dial, DialKnob, DialStop, DialUnit } from '#lib/registry/ui/dial/index.js';

	const stops = [1, 3, 7, 14, 30, 60, 90, 180, 365];
	const labelled = new Set([1, 7, 30, 90, 365]);
	const inWords = (days: number) => (days === 1 ? '1 day' : `${days} days`);

	let days = $state(30);
</script>

<div class="flex flex-col items-center gap-3">
	<span id="keep-backups" class="text-muted-foreground text-sm">Keep backups for</span>
	<Dial bind:value={days} step={stops} aria-labelledby="keep-backups" aria-valuetext={inWords(days)}>
		{#each stops as stop (stop)}
			{#if labelled.has(stop)}
				<DialStop value={stop} variant="major">{stop}</DialStop>
			{:else}
				<DialStop value={stop} />
			{/if}
		{/each}
		<DialKnob />
		<DialUnit>days</DialUnit>
	</Dial>
	<p class="text-muted-foreground font-mono text-xs">value: {days}</p>
</div>
