<script lang="ts">
	import { VoiceMeter } from '#lib/registry/ui/voice-meter/index.js';

	let level = $state(0.4);
	let levels = $state<number[]>([]);

	// Sample the slider every 90ms, the pace the meter uses for a real source.
	$effect(() => {
		const timer = setInterval(() => (levels = [...levels, level].slice(-25)), 90);
		return () => clearInterval(timer);
	});
</script>

<div class="flex w-full max-w-64 flex-col items-center gap-4">
	<VoiceMeter {levels} />
	<label class="flex w-full flex-col gap-1.5">
		<span class="text-muted-foreground text-sm">Level from this slider, no audio: {level.toFixed(2)}</span>
		<input type="range" min="0" max="1" step="0.01" bind:value={level} class="accent-primary w-full" />
	</label>
</div>
