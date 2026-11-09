<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getStepperRoot } from './context.js';

	/**
	 * StepperContent: what one step holds (`value` = its step). Shown only while that step is
	 * current; the others stay in the page, hidden, so what was typed into them survives going back
	 * and forth (and still submits with the form). A group named by the step's title. StepperNext
	 * checks the form fields in the current panel before it moves on. Swaps without animation (the
	 * indicators already say what changed). In a vertical stepper it may also sit inside its
	 * StepperItem, under the trigger.
	 *
	 * @example
	 * <StepperContent value={2}>…</StepperContent>
	 */
	let {
		ref = $bindable(null),
		class: className,
		value,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		ref?: HTMLDivElement | null;
		/** The step this panel belongs to. */
		value: number;
	} = $props();

	const root = getStepperRoot('StepperContent');
	const active = $derived(root.value === value);

	// The root knows each step's panel: StepperNext checks the current one, a submit finds the
	// step of an invalid field.
	$effect(() => {
		if (ref) return root.registerPanel(value, ref);
	});
</script>

<div
	bind:this={ref}
	role="group"
	aria-labelledby={root.titleId(value)}
	data-slot="stepper-content"
	data-state={active ? 'active' : 'inactive'}
	hidden={!active}
	class={cn('min-w-0', className)}
	{...restProps}
>
	{@render children?.()}
</div>
