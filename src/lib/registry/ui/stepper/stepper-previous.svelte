<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { getStepperRoot } from './context.js';
	import StepperButton from './stepper-button.svelte';

	/**
	 * StepperPrevious: a stock Button that goes one step back (skipping disabled steps). On the
	 * first step it dims and stays focusable (`aria-disabled`, pressing it does nothing), so
	 * keyboard focus is never dropped onto the page; only its own `disabled` disables it. The words
	 * are yours ("Back"). Any Button prop applies (`variant`, `size`, `disabled`), plus `loading`;
	 * the default is `outline`.
	 *
	 * @example
	 * <StepperPrevious>Back</StepperPrevious>
	 */
	let {
		ref = $bindable(null),
		onclick,
		children,
		...restProps
	}: ComponentProps<typeof StepperButton> = $props();

	const root = getStepperRoot('StepperPrevious');
</script>

<StepperButton
	bind:ref
	data-slot="stepper-previous"
	end={!root.canPrevious()}
	onclick={(event: MouseEvent) => {
		onclick?.(event);
		if (!event.defaultPrevented) root.previous();
	}}
	{...restProps}
>
	{@render children?.()}
</StepperButton>
