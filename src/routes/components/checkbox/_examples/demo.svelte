<script lang="ts">
	import { Checkbox } from '#lib/registry/ui/checkbox/index.js';

	let digest = $state(true);
</script>

<label class="flex w-full max-w-sm cursor-pointer items-start gap-3">
	<Checkbox bind:checked={digest} class="mt-0.5" />
	<span class="flex min-w-0 flex-col gap-0.5">
		<span class="text-sm font-medium">Weekly digest</span>
		<span class="text-muted-foreground text-sm">A summary of the week, every Monday morning.</span>
	</span>
</label>
