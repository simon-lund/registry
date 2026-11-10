<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * MarkupHighlight: the outline around the element the select tool points at, with its tag above
	 * ("span.status"), as children. It only draws: which element is under the pointer and its box
	 * are yours. Give `rect` in the coordinates of where you place it (`class="fixed"` with
	 * viewport coordinates, `absolute` in a layer). Clicks pass through it.
	 *
	 * @example
	 * <MarkupHighlight class="fixed" rect={el.getBoundingClientRect()}>span.status</MarkupHighlight>
	 */
	let {
		rect,
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		/** The element's box. */
		rect: { x: number; y: number; width: number; height: number };
	} = $props();
</script>

<div
	data-slot="markup-highlight"
	class={cn('outline-primary pointer-events-none rounded-sm outline-[1.5px] outline-offset-2 outline-solid', className)}
	style:left="{rect.x}px"
	style:top="{rect.y}px"
	style:width="{rect.width}px"
	style:height="{rect.height}px"
	{...restProps}
>
	{#if children}
		<span
			data-slot="markup-highlight-label"
			class="bg-primary text-primary-foreground absolute bottom-[calc(100%+6px)] -left-0.5 rounded-sm px-1.5 py-0.5 text-xs leading-4 font-medium whitespace-nowrap"
		>
			{@render children()}
		</span>
	{/if}
</div>
