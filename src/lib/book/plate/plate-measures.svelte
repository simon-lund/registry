<script lang="ts">
	import type { Snippet } from 'svelte';

	/** The measurements, as a list of term and value. */
	let { children }: { children: Snippet } = $props();
</script>

<dl class="m-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
	{@render children()}
</dl>
