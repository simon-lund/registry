<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getStepperItem } from './context.js';

	/**
	 * StepperDescription: a short line under the title ("Name and photo"), in muted-foreground. It
	 * describes the trigger. It wraps `pretty` and hyphenates (in the page's `lang`), so a long word
	 * breaks instead of overflowing. For a step that needs attention (`invalid`), say what is wrong
	 * here in one short phrase and colour it yourself (`text-destructive`).
	 *
	 * @example
	 * <StepperDescription>Name and photo</StepperDescription>
	 * <StepperDescription class="text-destructive">Address missing</StepperDescription>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLSpanElement> & { ref?: HTMLSpanElement | null } = $props();

	const item = getStepperItem('StepperDescription');

	$effect(() => {
		item.setDescription(true);
		return () => item.setDescription(false);
	});
</script>

<span
	bind:this={ref}
	id={item.descriptionId}
	data-slot="stepper-description"
	class={cn(
		'min-w-0 text-xs text-pretty hyphens-auto text-muted-foreground [overflow-wrap:break-word]',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
