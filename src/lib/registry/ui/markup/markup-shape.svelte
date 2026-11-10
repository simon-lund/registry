<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';
	import type { MarkupShape } from './context.svelte.js';

	/**
	 * MarkupShape: one kind in MarkupShapes, its icon and its name. The kind in hand is copper.
	 *
	 * @example
	 * <MarkupShape value="arrow"><ArrowUpRightIcon /> Arrow</MarkupShape>
	 */
	let {
		value,
		class: className,
		children,
		...restProps
	}: Omit<RadioGroupPrimitive.ItemProps, 'value' | 'children' | 'child'> & {
		value: MarkupShape;
		children?: Snippet;
	} = $props();
</script>

<RadioGroupPrimitive.Item
	{value}
	data-slot="markup-shape"
	data-value={value}
	class={cn(
		'text-foreground hover:bg-foreground/6 focus-visible:ring-ring data-[state=checked]:text-primary flex h-8 cursor-pointer items-center gap-2.5 rounded-md px-2 text-sm outline-none focus-visible:ring-2',
		"[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</RadioGroupPrimitive.Item>
