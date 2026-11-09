<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Spinner } from '#lib/registry/ui/spinner/index.js';
	import { VoiceMeter } from '#lib/registry/ui/voice-meter/index.js';

	type Mic = 'unsupported' | 'idle' | 'asking' | 'live' | 'denied' | 'missing' | 'failed';

	let mic = $state<Mic>('idle');
	let stream = $state<MediaStream | null>(null);
	let left = false;

	const words: Record<Mic, string> = {
		unsupported: 'This browser has no microphone access here. It needs a secure page (https).',
		idle: 'The microphone is off. The browser asks for permission when you press the button.',
		asking: "Waiting for your answer in the browser's prompt.",
		live: 'Listening to your microphone. The sound stays on this page and is not recorded or sent.',
		denied: "Microphone access was denied. Allow it in the browser's site settings, then try again.",
		missing: 'No microphone was found. Connect one, then try again.',
		failed: 'The microphone could not be read. It may be in use by another app.'
	};
	const failure = $derived(mic === 'denied' || mic === 'missing' || mic === 'failed');

	onMount(() => {
		// This only looks for the API: it asks nothing, and the microphone stays off.
		if (!navigator.mediaDevices?.getUserMedia) mic = 'unsupported';
		return () => {
			left = true;
			release();
		};
	});

	// The only place that asks, and only a press of the button gets here.
	async function start() {
		mic = 'asking';
		try {
			const granted = await navigator.mediaDevices.getUserMedia({ audio: true });
			// Gone while the prompt was open: let go at once.
			if (left) {
				granted.getTracks().forEach((track) => track.stop());
				return;
			}
			// Unplugged, or permission taken back while it runs.
			granted.getAudioTracks()[0]?.addEventListener('ended', () => {
				release();
				mic = 'failed';
			});
			stream = granted;
			mic = 'live';
		} catch (error) {
			const name = error instanceof DOMException ? error.name : '';
			if (name === 'NotAllowedError' || name === 'SecurityError') mic = 'denied';
			else if (name === 'NotFoundError') mic = 'missing';
			else mic = 'failed';
		}
	}

	// The tracks are ours to stop: VoiceMeter never stops a stream it was given.
	function release() {
		stream?.getTracks().forEach((track) => track.stop());
		stream = null;
	}
	function stop() {
		release();
		mic = 'idle';
	}
</script>

<div class="flex w-full max-w-80 flex-col items-center gap-3">
	<div class="bg-background border-border flex h-14 w-full items-center justify-center rounded-xl border">
		{#if stream}
			<VoiceMeter {stream} />
		{:else}
			<VoiceMeter />
		{/if}
	</div>
	<p class={['text-center text-sm', failure ? 'text-destructive' : 'text-muted-foreground']} aria-live="polite">
		{words[mic]}
	</p>
	{#if mic === 'idle'}
		<Button onclick={start}>Use my microphone</Button>
	{:else if mic === 'asking'}
		<Button disabled><Spinner aria-label="Waiting" />Use my microphone</Button>
	{:else if mic === 'live'}
		<Button variant="outline" onclick={stop}>Stop the microphone</Button>
	{:else if failure}
		<Button variant="outline" onclick={start}>Try again</Button>
	{/if}
</div>
