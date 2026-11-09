<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * TabsCount: a tabular count after a segment's label, quiet (12px, 500). Never a badge, never
	 * coloured.
	 *
	 * @example
	 * <TabsTrigger value="open">Open <TabsCount>6</TabsCount></TabsTrigger>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLSpanElement> & { ref?: HTMLSpanElement | null } = $props();
</script>

<span
	bind:this={ref}
	data-slot="tabs-count"
	class={cn('text-muted-foreground text-xs font-medium tabular-nums', className)}
	{...restProps}
>
	{@render children?.()}
</span>
