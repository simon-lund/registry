<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * ChainOfThoughtSearchResults: the sources a step looked at, a wrapping row of
	 * ChainOfThoughtSearchResult links, 8px apart. A list: give it an `aria-label` ("Sources").
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLUListElement> & { ref?: HTMLUListElement | null } = $props();
</script>

<ul bind:this={ref} data-slot="chain-of-thought-search-results" class={cn('flex flex-wrap gap-2', className)} {...restProps}>
	{@render children?.()}
</ul>
