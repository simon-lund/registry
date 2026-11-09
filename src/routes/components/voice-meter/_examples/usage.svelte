<script lang="ts">
	import { VoiceMeter } from '#lib/registry/ui/voice-meter/index.js';

	// 0..1, newest last. Replace the array with each new sample and the row drifts one slot.
	let levels = $state([0, 0.2, 0.7, 0.3, 0, 0.5, 0.9, 0.2, 0]);
</script>

<VoiceMeter {levels} />
