<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setTabsCopy } from './context.js';

	// Internal: the key's second rendering of the list's children. Triggers inside render as inert,
	// active-styled labels.
	let { children }: { children?: Snippet } = $props();

	setTabsCopy();
</script>

{@render children?.()}
