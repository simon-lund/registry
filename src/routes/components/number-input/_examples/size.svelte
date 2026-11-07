<script lang="ts">
	import { NumberInput } from '#lib/registry/ui/number-input/index.js';

	let small = $state(12);
	let large = $state(12);
</script>

<div class="flex flex-col items-center gap-4">
	<NumberInput bind:value={small} aria-label="Default size" class="w-36" />
	<NumberInput bind:value={large} size="lg" aria-label="Large" class="w-48" />
</div>
