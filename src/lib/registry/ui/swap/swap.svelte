<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * Swap: a few things on one spot, exactly one shown (`SwapItem active`), e.g. a button's icon and
	 * label turning into a check and "Copied". The items are stacked in one grid cell, so the box is
	 * as wide as the widest item and nothing around it moves.
	 *
	 * @example
	 * <Button variant="ghost" onclick={copy}>
	 *   <Swap>
	 *     <SwapItem active={!copied}><CopyIcon /></SwapItem>
	 *     <SwapItem active={copied}><CheckIcon /></SwapItem>
	 *   </Swap>
	 *   <Swap>
	 *     <SwapItem active={!copied}>Copy</SwapItem>
	 *     <SwapItem active={copied}>Copied</SwapItem>
	 *   </Swap>
	 * </Button>
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
	data-slot="swap"
	class={cn('inline-grid place-items-center *:[grid-area:1/1]', className)}
	{...restProps}
>
	{@render children?.()}
</span>
