<script lang="ts">
	import { Checkbox } from '#lib/registry/ui/checkbox/index.js';

	let agreed = $state(false);
</script>

<div class="flex w-full max-w-xs flex-col gap-1.5">
	<div class="flex items-center gap-2">
		<Checkbox id="terms-invalid" bind:checked={agreed} aria-invalid={!agreed} aria-describedby="terms-message" />
		<label for="terms-invalid" class="text-sm">I agree to the terms</label>
	</div>
	<p id="terms-message" class="m-0 min-h-5 pl-6 text-sm {agreed ? 'text-muted-foreground' : 'text-destructive'}">
		{agreed ? 'Thank you.' : 'Agree to the terms to go on.'}
	</p>
</div>
