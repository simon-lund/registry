<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/** ScrollMapTickTitle: the section's title in its tick's tooltip ("Shape the loaf"), medium, two lines at most. */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLSpanElement> & { ref?: HTMLSpanElement | null } = $props();
</script>

<span bind:this={ref} data-slot="scroll-map-tick-title" class={cn('line-clamp-2 text-xs font-medium', className)} {...restProps}>
	{@render children?.()}
</span>
