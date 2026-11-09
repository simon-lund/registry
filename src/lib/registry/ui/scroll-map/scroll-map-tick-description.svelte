<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/** ScrollMapTickDescription: a quieter line under the title in the tooltip (who and when, "Ana, 07:59"), at 70%. */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLSpanElement> & { ref?: HTMLSpanElement | null } = $props();
</script>

<span bind:this={ref} data-slot="scroll-map-tick-description" class={cn('text-xs font-normal opacity-70', className)} {...restProps}>
	{@render children?.()}
</span>
