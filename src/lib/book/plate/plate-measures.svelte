<script lang="ts">
	import type { Snippet } from 'svelte';

	/** The measurements, one under the other. */
	let { children }: { children: Snippet } = $props();
</script>

<dl class="m-0 flex flex-col gap-3 text-sm">
	{@render children()}
</dl>
