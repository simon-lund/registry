<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * ChainOfThoughtStepContent: what a step found, hanging off the rail under its label:
	 * ChainOfThoughtSearchResults, a ChainOfThoughtImage, or a paragraph (14px, muted, at most 65
	 * characters a line). 8px apart.
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & { ref?: HTMLDivElement | null } = $props();
</script>

<div
	bind:this={ref}
	data-slot="chain-of-thought-step-content"
	class={cn(
		'col-start-2 mt-2 flex min-w-0 flex-col items-start gap-2',
		'[&>p]:max-w-[65ch] [&>p]:text-sm [&>p]:text-pretty [&>p]:text-muted-foreground',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
