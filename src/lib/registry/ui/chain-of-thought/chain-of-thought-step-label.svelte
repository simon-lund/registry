<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * ChainOfThoughtStepLabel: the step's short line ("Searching today's events"), 14px with a
	 * 20px line to sit level with its icon. Colour by status: active full colour, done and pending
	 * muted. A pending step is told apart by its icon, never by fainter words.
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
	data-slot="chain-of-thought-step-label"
	class={cn(
		'col-start-2 min-h-5 text-sm leading-5 text-pretty text-muted-foreground',
		'group-data-[status=active]/cot-step:text-foreground',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
