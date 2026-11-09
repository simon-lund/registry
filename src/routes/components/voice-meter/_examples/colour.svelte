<script lang="ts">
	import { VoiceMeter } from '#lib/registry/ui/voice-meter/index.js';

	// Fixed numbers: nothing is listening, and the row stands still.
	const levels = [0, 0.2, 0.6, 0.3, 0, 0.5, 0.9, 0.4, 0, 0, 0.3, 0.7, 0.2, 0, 0.4, 0.8, 0.3, 0, 0.2, 0.5, 0.2, 0, 0.3, 0.6, 0.1];
</script>

<VoiceMeter {levels} class="text-foreground" />
