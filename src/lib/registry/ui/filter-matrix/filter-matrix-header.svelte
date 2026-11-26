<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '#lib/utils.js';

	/** FilterMatrixHeader: the row of column names, a `<thead>`. No look of its own. */
	let {
		ref = $bindable(null),
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement> = $props();
</script>

<thead bind:this={ref} data-slot="filter-matrix-header" {...restProps}>
	{@render children?.()}
</thead>
