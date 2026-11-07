<script lang="ts">
	import type { Snippet } from 'svelte';

	/** Every part the item exports, one under the other. */
	let { children }: { children: Snippet } = $props();
</script>

<div class="flex flex-col gap-10">
	{@render children()}
</div>
