<script lang="ts">
	import { Middot } from '#lib/registry/ui/middot/index.js';
</script>

<div class="flex flex-col gap-4">
	{#each ['text-xl', 'text-sm'] as size (size)}
		<div class="flex flex-col gap-1 {size}">
			<span class="text-muted-foreground text-xs">Typed</span>
			<span>Tomorrow · 09:00 · Laundry</span>
			<span class="text-muted-foreground mt-1 text-xs">Middot</span>
			<span>Tomorrow<Middot />09:00<Middot />Laundry</span>
		</div>
	{/each}
</div>
