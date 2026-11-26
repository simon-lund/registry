<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from 'bits-ui';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { cn, type WithoutChild } from '#lib/utils.js';

	/**
	 * ChainOfThoughtHeader: the line that folds the steps: your glyph and words ("Thought process",
	 * "3 steps"), muted and full colour on hover, and a caret at the end that turns over when open
	 * (base 220ms, settle; no turn under reduced motion). 44px to touch.
	 *
	 * @example
	 * <ChainOfThoughtHeader><BrainIcon />Thought process</ChainOfThoughtHeader>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithoutChild<CollapsiblePrimitive.TriggerProps> = $props();
</script>

<CollapsiblePrimitive.Trigger
	bind:ref
	data-slot="chain-of-thought-header"
	class={cn(
		'group/cot-header relative inline-flex h-9 max-w-full cursor-pointer items-center gap-2 self-start rounded-sm text-sm font-medium text-muted-foreground',
		'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
		'transition-[color,scale] duration-(--dur-quick) ease-(--ease-settle) hover:text-foreground motion-safe:active:scale-[0.98] active:duration-(--dur-press)',
		"before:absolute before:inset-x-0 before:-inset-y-1 before:content-['']",
		"[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ChevronDownIcon
		aria-hidden="true"
		class="size-3.5 transition-[rotate] duration-(--dur-base) ease-(--ease-settle) group-data-[state=open]/cot-header:rotate-180 motion-reduce:transition-none"
	/>
</CollapsiblePrimitive.Trigger>
