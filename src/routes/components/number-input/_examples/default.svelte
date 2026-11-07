<script lang="ts">
	import { NumberInput } from '#lib/registry/ui/number-input/index.js';

	let value = $state(42);
</script>

<NumberInput bind:value aria-label="Amount" class="w-36" />
