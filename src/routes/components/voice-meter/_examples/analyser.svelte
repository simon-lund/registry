<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '#lib/registry/ui/button/index.js';
	import { VoiceMeter } from '#lib/registry/ui/voice-meter/index.js';

	let context: AudioContext | null = null;
	let analyser = $state<AnalyserNode | null>(null);

	// A test tone that swells and fades 1.5 times a second. It goes into the analyser and never
	// to the speakers, so it is silent, and there is no microphone in this graph.
	function start() {
		context = new AudioContext();
		const tone = context.createOscillator();
		const swell = context.createGain();
		const pulse = context.createOscillator();
		const depth = context.createGain();
		swell.gain.value = 0.1;
		depth.gain.value = 0.1;
		pulse.frequency.value = 1.5;
		pulse.connect(depth).connect(swell.gain);

		const node = context.createAnalyser();
		node.fftSize = 1024;
		tone.connect(swell).connect(node);
		tone.start();
		pulse.start();
		analyser = node;
	}

	function stop() {
		void context?.close();
		context = null;
		analyser = null;
	}

	onMount(() => stop);
</script>

<div class="flex flex-col items-center gap-4">
	{#if analyser}
		<VoiceMeter {analyser} />
	{:else}
		<VoiceMeter />
	{/if}
	<Button variant="outline" size="sm" onclick={analyser ? stop : start}>
		{analyser ? 'Stop the test tone' : 'Start a silent test tone'}
	</Button>
</div>
