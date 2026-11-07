<script lang="ts">
	import type { Snippet } from 'svelte';

	/** Every state, each working, one under the other. */
	let { children }: { children: Snippet } = $props();
</script>

<div class="flex flex-col gap-4">
	{@render children()}
</div>
