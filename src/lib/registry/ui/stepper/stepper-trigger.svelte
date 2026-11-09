<script lang="ts" module>
	/*
	 * Indicator in the first column, title beside it in a row as tall as the indicator, the
	 * description under the title. The same grid in both orientations, so a description never
	 * pulls the indicator off the separator's line.
	 */
	const BASE = [
		'relative grid min-w-0 grid-cols-[auto_minmax(0,1fr)] grid-rows-[calc(var(--spacing)*8)_auto] items-center gap-x-3 gap-y-0.5 rounded-full text-start',
		'[&>[data-slot=stepper-indicator]]:row-start-1 [&>[data-slot=stepper-indicator]]:col-start-1',
		'[&>[data-slot=stepper-title]]:row-start-1 [&>[data-slot=stepper-title]]:col-start-2',
		'[&>[data-slot=stepper-description]]:row-start-2 [&>[data-slot=stepper-description]]:col-start-2 [&>[data-slot=stepper-description]]:self-start'
	];
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getStepperItem, getStepperRoot } from './context.js';

	/**
	 * StepperTrigger: the step itself, holding its StepperIndicator, StepperTitle and (optionally)
	 * StepperDescription. A button while the step can be reached (see Stepper: linear or free),
	 * otherwise plain text; the current step's says `aria-current="step"` either way. Named by its
	 * title, described by its description.
	 *
	 * Drawn as tall as the indicator (32px); its hit area reaches 44px without moving the layout.
	 * Pressing dips the indicator to 94%. Leave it out entirely for a stepper that only shows the
	 * way (put the indicator and title straight into the StepperItem).
	 *
	 * @example
	 * <StepperTrigger>
	 *   <StepperIndicator />
	 *   <StepperTitle>Profile</StepperTitle>
	 *   <StepperDescription>Name and photo</StepperDescription>
	 * </StepperTrigger>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLElement> & { ref?: HTMLElement | null } = $props();

	const root = getStepperRoot('StepperTrigger');
	const item = getStepperItem('StepperTrigger');

	const current = $derived(item.state === 'active');
	const interactive = $derived(!item.disabled && root.reachable(item.value));
	// One tab stop for the list: the last focused trigger, else the current step's.
	const stop = $derived(root.focused === null ? current : root.focused === item.value);

	const labelledby = $derived(item.hasTitle ? item.titleId : undefined);
	const describedby = $derived(item.hasDescription ? item.descriptionId : undefined);
</script>

{#if interactive}
	<button
		bind:this={ref}
		type="button"
		data-slot="stepper-trigger"
		data-state={item.state}
		aria-current={current ? 'step' : undefined}
		aria-busy={item.loading || undefined}
		aria-labelledby={labelledby}
		aria-describedby={describedby}
		tabindex={stop ? 0 : -1}
		class={cn(
			BASE,
			'group/stepper-trigger cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
			/* the hit area: 44px tall around the 32px row */
			"before:absolute before:-inset-x-1 before:-inset-y-1.5 before:rounded-full before:content-['']",
			className
		)}
		{...restProps}
		onclick={(event) => {
			restProps.onclick?.(event as MouseEvent & { currentTarget: EventTarget & HTMLElement });
			if (!event.defaultPrevented) root.go(item.value);
		}}
		onfocus={(event) => {
			restProps.onfocus?.(event as FocusEvent & { currentTarget: EventTarget & HTMLElement });
			root.focus(item.value);
		}}
	>
		{@render children?.()}
	</button>
{:else}
	<div
		bind:this={ref}
		data-slot="stepper-trigger"
		data-state={item.state}
		aria-current={current ? 'step' : undefined}
		aria-busy={item.loading || undefined}
		class={cn(BASE, className)}
		{...restProps}
	>
		{@render children?.()}
	</div>
{/if}
