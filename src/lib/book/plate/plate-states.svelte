<script lang="ts">
	import type { Snippet } from 'svelte';

	/** Every state, each small and working, side by side. */
	let { children }: { children: Snippet } = $props();
</script>

<div class="grid gap-4 sm:grid-cols-2">
	{@render children()}
</div>
