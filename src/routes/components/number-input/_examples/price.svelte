<script lang="ts">
	import { NumberInput } from '#lib/registry/ui/number-input/index.js';

	let price = $state(49.9);
</script>

<NumberInput
	bind:value={price}
	min={0}
	step={0.1}
	format={{ style: 'currency', currency: 'EUR' }}
	aria-label="Price"
	class="w-40"
/>
