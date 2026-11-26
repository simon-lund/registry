<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/** ChainOfThoughtStepDescription: a quieter line under the step's label, 12px and muted. */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLSpanElement> & { ref?: HTMLSpanElement | null } = $props();
</script>

<span
	bind:this={ref}
	data-slot="chain-of-thought-step-description"
	class={cn('col-start-2 mt-0.5 text-xs text-muted-foreground group-data-[status=pending]/cot-step:opacity-60', className)}
	{...restProps}
>
	{@render children?.()}
</span>
