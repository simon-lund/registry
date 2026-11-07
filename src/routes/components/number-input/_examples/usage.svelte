<script lang="ts">
	import { NumberInput } from '#lib/registry/ui/number-input/index.js';

	let value = $state(1);
</script>

<NumberInput bind:value min={0} max={99} aria-label="Quantity" />
