<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '#lib/utils.js';

	/** FilterMatrixBody: the rows of cells, a `<tbody>`. No look of its own. */
	let {
		ref = $bindable(null),
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement> = $props();
</script>

<tbody bind:this={ref} data-slot="filter-matrix-body" {...restProps}>
	{@render children?.()}
</tbody>
