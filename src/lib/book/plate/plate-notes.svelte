<script lang="ts">
	import type { Snippet } from 'svelte';

	/** The sections under (phone) or beside (from 64rem) the stage. */
	let { children }: { children: Snippet } = $props();
</script>

<div class="grid gap-10 lg:grid-cols-2">
	{@render children()}
</div>
