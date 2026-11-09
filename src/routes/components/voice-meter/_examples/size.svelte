<script lang="ts">
	import { VoiceMeter } from '#lib/registry/ui/voice-meter/index.js';

	// Fixed numbers: nothing is listening, and the row stands still.
	const levels = [0, 0.3, 0.8, 0.4, 0, 0, 0.6, 1, 0.5, 0.2, 0, 0.4, 0.7];
</script>

<VoiceMeter
	{levels}
	count={12}
	class="h-16 [--voice-meter-dot:calc(var(--spacing)*2)] [--voice-meter-gap:calc(var(--spacing)*3)]"
/>
