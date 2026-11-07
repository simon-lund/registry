<script lang="ts">
	import type { Snippet } from 'svelte';

	/** The sections under the stage, one after the other: the plate reads top to bottom at every width. */
	let { children }: { children: Snippet } = $props();
</script>

<div class="flex flex-col gap-10">
	{@render children()}
</div>
