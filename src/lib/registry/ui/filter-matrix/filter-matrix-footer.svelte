<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '#lib/utils.js';

	/** FilterMatrixFooter: the row of column totals, a `<tfoot>`. No look of its own. */
	let {
		ref = $bindable(null),
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement> = $props();
</script>

<tfoot bind:this={ref} data-slot="filter-matrix-footer" {...restProps}>
	{@render children?.()}
</tfoot>
