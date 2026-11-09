<script lang="ts">
	import { Textarea } from '#lib/registry/ui/textarea/index.js';

	let note = $state('');
</script>

<div class="flex w-full max-w-md flex-col gap-2">
	<label for="note" class="text-sm font-medium">Delivery note</label>
	<Textarea
		id="note"
		bind:value={note}
		resizeLabel="Resize"
		aria-describedby="note-hint"
		placeholder="Leave it with the neighbour at number 12."
		class="max-h-72"
	/>
	<p id="note-hint" class="text-muted-foreground text-xs">
		Drag the corner, or tab to it and use the arrow keys.
	</p>
</div>
