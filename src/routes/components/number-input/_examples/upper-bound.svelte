<script lang="ts">
	import { NumberInput } from '#lib/registry/ui/number-input/index.js';

	let seats = $state(8);
</script>

<NumberInput bind:value={seats} min={1} max={8} aria-label="Seats" class="w-36" />
