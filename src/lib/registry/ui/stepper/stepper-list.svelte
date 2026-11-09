<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	/**
	 * The list's look, one of three:
	 *   default  indicators with titles (and descriptions), joined by separators;
	 *   bars     the inline form: one short bar per step, filled up to the current one;
	 *   dots     the inline form: one dot per step, the current one a touch larger.
	 */
	export const stepperListVariants = tv({
		base: 'm-0 flex min-w-0 list-none p-0',
		variants: {
			variant: { default: '', bars: 'items-center gap-1', dots: 'items-center gap-2' },
			orientation: { horizontal: 'flex-row', vertical: 'flex-col' }
		},
		compoundVariants: [
			{ variant: 'default', orientation: 'horizontal', class: 'items-start gap-3' },
			/* The inline forms are always one line. */
			{ variant: ['bars', 'dots'], orientation: 'vertical', class: 'flex-row' }
		],
		defaultVariants: { variant: 'default', orientation: 'horizontal' }
	});
</script>

<script lang="ts">
	import type { HTMLOlAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getStepperRoot, setStepperList, type StepperListVariant } from './context.js';

	/**
	 * StepperList: the steps, an ordered list (`<ol>`, so a screen reader says "2 of 4"). Name it
	 * with `aria-label` or `aria-labelledby`.
	 *
	 * Variants: `default` (indicators and titles), or one of the inline forms for a tight spot (a
	 * dialog header, a sheet's top): `bars` (short bars, filled up to the current step) or `dots`.
	 * The inline forms show no text; put the words beside them ("Step 2 of 4") and, where the
	 * step changes in place, say it in a live region. Give a list that only draws `aria-hidden`.
	 *
	 * Keyboard: the triggers that are buttons share one tab stop (the current step). Arrow keys
	 * along the orientation move the focus between them (they do not switch steps), Home / End
	 * jump to the ends, Enter / Space go to the focused step.
	 *
	 * @example
	 * <StepperList aria-label="Set up your account">…</StepperList>
	 * <StepperList variant="bars" aria-hidden="true">…</StepperList>
	 */
	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		children,
		...restProps
	}: HTMLOlAttributes & {
		ref?: HTMLOListElement | null;
		variant?: StepperListVariant;
	} = $props();

	const root = getStepperRoot('StepperList');

	setStepperList({
		get variant() {
			return variant;
		}
	});

	function onkeydown(event: KeyboardEvent & { currentTarget: HTMLOListElement }) {
		restProps.onkeydown?.(event);
		if (event.defaultPrevented) return;
		const target = event.target as HTMLElement;
		if (!target.matches?.("button[data-slot='stepper-trigger']")) return;
		const buttons = [
			...event.currentTarget.querySelectorAll<HTMLButtonElement>("button[data-slot='stepper-trigger']")
		];
		const at = buttons.indexOf(target as HTMLButtonElement);
		if (at < 0 || buttons.length < 2) return;

		const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
		const [back, forward] =
			root.orientation === 'vertical'
				? ['ArrowUp', 'ArrowDown']
				: rtl
					? ['ArrowRight', 'ArrowLeft']
					: ['ArrowLeft', 'ArrowRight'];
		let to: number;
		if (event.key === forward) to = (at + 1) % buttons.length;
		else if (event.key === back) to = (at - 1 + buttons.length) % buttons.length;
		else if (event.key === 'Home') to = 0;
		else if (event.key === 'End') to = buttons.length - 1;
		else return;
		event.preventDefault();
		buttons[to].focus();
	}
</script>

<ol
	bind:this={ref}
	data-slot="stepper-list"
	data-variant={variant}
	data-orientation={root.orientation}
	class={cn(stepperListVariants({ variant, orientation: root.orientation }), className)}
	{...restProps}
	{onkeydown}
>
	{@render children?.()}
</ol>

<style>
	/*
	 * A horizontal stepper in a narrow room (a phone): only the current step keeps its title in
	 * sight; every other title and all descriptions stay in the accessibility tree, visually hidden.
	 * The separators take the freed width. Chosen over turning vertical, which would push the
	 * step's panel several rows down the screen.
	 */
	@container stepper (max-width: 30rem) {
		:global(
				[data-slot='stepper-list'][data-orientation='horizontal'] [data-slot='stepper-item']:not([data-state='active'])
					[data-slot='stepper-title']
			),
		:global([data-slot='stepper-list'][data-orientation='horizontal'] [data-slot='stepper-description']) {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
		:global(
			[data-slot='stepper-list'][data-orientation='horizontal'] [data-slot='stepper-item']:not([data-state='active'])
				[data-slot='stepper-trigger']
		) {
			column-gap: 0;
		}
	}
</style>
