<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '#lib/utils.js';

	/** FilterMatrixRow: one line of the table, a `<tr>`. No look of its own. */
	let {
		ref = $bindable(null),
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement> = $props();
</script>

<tr bind:this={ref} data-slot="filter-matrix-row" {...restProps}>
	{@render children?.()}
</tr>
