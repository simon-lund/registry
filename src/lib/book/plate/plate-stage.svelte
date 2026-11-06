<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';

	/** The component, large and working. Flat: the muted surface, no border. */
	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<div
	class={cn(
		'bg-muted flex min-h-80 items-center justify-center rounded-xl p-6 sm:p-12',
		className
	)}
>
	{@render children()}
</div>
