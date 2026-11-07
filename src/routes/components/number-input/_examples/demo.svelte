<script lang="ts">
	import { NumberInput } from '#lib/registry/ui/number-input/index.js';

	let quantity = $state(1240);
</script>

<div class="flex flex-col items-center gap-3">
	<label for="quantity" class="text-muted-foreground text-sm">Quantity</label>
	<NumberInput id="quantity" bind:value={quantity} min={0} max={99999} step={10} size="lg" class="w-56" />
	<p class="text-muted-foreground font-mono text-xs">value: {quantity}</p>
</div>
