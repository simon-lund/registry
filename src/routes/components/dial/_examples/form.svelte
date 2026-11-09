<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Dial, DialKnob, DialStop, DialUnit } from '#lib/registry/ui/dial/index.js';

	const stops = [5, 10, 15, 30, 60];

	let pause = $state(15);
	let sent = $state('nothing yet');

	function read(form: HTMLFormElement) {
		sent = [...new FormData(form)].map(([key, value]) => `${key}=${value}`).join(', ');
	}
	function onsubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
		event.preventDefault();
		read(event.currentTarget);
	}
</script>

<form class="flex flex-col items-center gap-3" {onsubmit}>
	<span id="pause-after" class="text-muted-foreground text-sm">Pause after</span>
	<Dial name="pause" bind:value={pause} step={stops} aria-labelledby="pause-after" aria-valuetext="{pause} minutes">
		{#each stops as stop (stop)}
			<DialStop value={stop} variant="major">{stop}</DialStop>
		{/each}
		<DialKnob />
		<DialUnit>min</DialUnit>
	</Dial>
	<div class="flex gap-2">
		<Button type="reset" variant="ghost">Reset</Button>
		<Button type="submit">Save</Button>
	</div>
	<output class="text-muted-foreground font-mono text-xs">sent: {sent}</output>
</form>
