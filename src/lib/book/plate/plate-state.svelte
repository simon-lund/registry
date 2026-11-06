<script lang="ts">
	import type { Snippet } from 'svelte';

	/** One state: its name, then the component in it. */
	let { label, children }: { label: string; children: Snippet } = $props();
</script>

<figure class="m-0 flex flex-col gap-2">
	<div class="bg-muted flex min-h-28 items-center justify-center rounded-lg p-4">
		{@render children()}
	</div>
	<figcaption class="text-muted-foreground text-sm">{label}</figcaption>
</figure>
