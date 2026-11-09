<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { VoiceMeter } from '#lib/registry/ui/voice-meter/index.js';

	// A script, not a voice: short bursts and pauses that read like speech.
	function* script(): Generator<number, never> {
		for (;;) {
			for (let word = 2 + Math.floor(Math.random() * 4); word > 0; word--) {
				yield 0.55 + Math.random() * 0.45;
				if (Math.random() < 0.5) yield 0.2 + Math.random() * 0.25;
				for (let gap = 1 + Math.floor(Math.random() * 3); gap > 0; gap--) yield 0;
			}
			for (let breath = 4 + Math.floor(Math.random() * 6); breath > 0; breath--) yield 0;
		}
	}

	let playing = $state(true);
	let levels = $state<number[]>([]);

	// One scripted level every 90ms, in the browser only. Nothing here touches a microphone.
	$effect(() => {
		if (!playing) return;
		const next = script();
		const timer = setInterval(() => (levels = [...levels, next.next().value].slice(-25)), 90);
		return () => clearInterval(timer);
	});
</script>

<div class="flex w-full max-w-80 flex-col items-center gap-3">
	<div class="bg-background border-border flex h-14 w-full items-center justify-center rounded-xl border">
		<VoiceMeter {levels} />
	</div>
	<p class="text-muted-foreground text-center text-sm">
		Simulated speech. A script plays these levels: no microphone is on.
	</p>
	<Button variant="outline" size="sm" onclick={() => (playing = !playing)}>
		{playing ? 'Pause the script' : 'Play the script'}
	</Button>
</div>
