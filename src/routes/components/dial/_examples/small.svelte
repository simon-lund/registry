<script lang="ts">
	import { Dial, DialKnob, DialStop } from '#lib/registry/ui/dial/index.js';

	const stops = [5, 10, 15, 30, 60];
	const inWords = (minutes: number) => (minutes === 60 ? '1 hour before' : `${minutes} minutes before`);

	let reminder = $state(15);
</script>

<div class="flex w-64 max-w-full items-center justify-between gap-4">
	<div class="flex flex-col gap-0.5">
		<span id="remind-me" class="text-sm font-medium">Remind me</span>
		<span class="text-muted-foreground text-xs">{inWords(reminder)}</span>
	</div>
	<Dial size="sm" bind:value={reminder} step={stops} aria-labelledby="remind-me" aria-valuetext={inWords(reminder)}>
		{#each stops as stop (stop)}
			<DialStop value={stop} variant="major" />
		{/each}
		<DialKnob />
	</Dial>
</div>
