<script lang="ts">
	import { Checkbox } from '#lib/registry/ui/checkbox/index.js';

	let agreed = $state(false);
</script>

<div class="flex items-center gap-2">
	<Checkbox id="terms" bind:checked={agreed} />
	<label for="terms" class="text-sm">I agree to the terms</label>
</div>
