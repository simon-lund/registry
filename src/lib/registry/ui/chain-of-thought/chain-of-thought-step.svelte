<script lang="ts">
	import type { HTMLLiAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { setChainOfThoughtStep, type ChainOfThoughtStepStatus } from './context.js';

	/**
	 * ChainOfThoughtStep: one step: a 20px ChainOfThoughtStepIcon in the left column, then its
	 * ChainOfThoughtStepLabel (and -Description), and maybe a ChainOfThoughtStepContent. A quiet
	 * 1px rail in the border colour runs from its icon down to the next step's, so the steps read
	 * as one path and the content hangs off it.
	 *
	 * `status`: `done` (default; muted), `active` (full colour, a copper glyph that breathes: it is
	 * happening now) or `pending` (muted, its icon quieter and its dot hollow). A step that arrives while the chain
	 * streams fades in and slides 4px down into place (base 220ms, settle; reduced motion: the fade).
	 *
	 * @example
	 * <ChainOfThoughtStep status="active">
	 *   <ChainOfThoughtStepIcon><CloudSunIcon /></ChainOfThoughtStepIcon>
	 *   <ChainOfThoughtStepLabel>Checking the weather</ChainOfThoughtStepLabel>
	 * </ChainOfThoughtStep>
	 */
	let {
		ref = $bindable(null),
		class: className,
		status = 'done',
		children,
		...restProps
	}: HTMLLiAttributes & {
		ref?: HTMLLIElement | null;
		/** Where the step is. Default `done`. */
		status?: ChainOfThoughtStepStatus;
	} = $props();

	setChainOfThoughtStep({
		get status() {
			return status;
		}
	});
</script>

<li
	bind:this={ref}
	data-slot="chain-of-thought-step"
	data-status={status}
	class={cn(
		'group/cot-step relative grid grid-cols-[calc(var(--spacing)*5)_minmax(0,1fr)] gap-x-3 pb-4 last:pb-0',
		/* The rail: from under this icon to the next one. */
		"before:absolute before:top-6.5 before:bottom-1.5 before:left-[calc(var(--spacing)*2.5-0.5px)] before:w-px before:bg-border before:content-[''] last:before:hidden",
		'transition-[opacity,translate] duration-(--dur-base) ease-(--ease-settle) starting:opacity-0 motion-safe:starting:-translate-y-1',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</li>
