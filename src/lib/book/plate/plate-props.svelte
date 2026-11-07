<script lang="ts">
	import type { Snippet } from 'svelte';

	/** A part's props (or a type's fields), one under the other. */
	let { children }: { children: Snippet } = $props();
</script>

<dl class="border-border m-0 flex flex-col border-t">
	{@render children()}
</dl>
