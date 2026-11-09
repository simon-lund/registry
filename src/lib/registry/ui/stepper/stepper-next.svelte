<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { getStepperRoot } from './context.js';
	import StepperButton from './stepper-button.svelte';

	/**
	 * StepperNext: a stock Button that goes one step on (skipping disabled steps). On the last step
	 * it dims and stays focusable (`aria-disabled`, pressing it does nothing), so keyboard focus is
	 * never dropped onto the page; only its own `disabled` disables it. The words are yours
	 * ("Continue"; "Finish" on the last one is a different button). Any Button prop applies
	 * (`variant`, `size`). The default is `outline`; the committing one is `variant="default"`, the
	 * copper one. `loading` puts a Spinner over the label, sets `aria-busy` and swallows clicks. It
	 * ignores linear navigation.
	 *
	 * Before it moves on it checks the current step's panel, so leave it enabled (a disabled
	 * button doesn't say what is missing):
	 *   1. `validate(panel, step)`, if given: custom rules. Set a field's message with
	 *      `setCustomValidity` (the browser shows it in step 2), or return `false` to stay (and say
	 *      why yourself). It may return a promise (pass `loading` while it runs).
	 *   2. the form fields in the panel (`checkValidity`): the first invalid one gets the browser's
	 *      message and focus (`reportValidity`), and the step stays. Skipped with `novalidate`, or
	 *      when the form has `novalidate`.
	 *
	 * @example
	 * <StepperNext variant="default">Continue</StepperNext>
	 * <StepperNext variant="default" validate={() => {
	 *   repeat.setCustomValidity(repeat.value === password ? '' : 'The passwords differ.');
	 * }}>Continue</StepperNext>
	 */
	let {
		ref = $bindable(null),
		onclick,
		validate,
		novalidate = false,
		children,
		...restProps
	}: ComponentProps<typeof StepperButton> & {
		/**
		 * Custom rules for the current step, run before its fields are checked: set messages with
		 * `setCustomValidity`, or return `false` to stay. May return a promise.
		 */
		validate?: (panel: HTMLElement, step: number) => boolean | void | Promise<boolean | void>;
		/** Move on without checking the panel's fields (`validate` still runs). */
		novalidate?: boolean;
	} = $props();

	const root = getStepperRoot('StepperNext');

	type Field = HTMLElement & Pick<HTMLInputElement, 'willValidate' | 'checkValidity' | 'reportValidity'>;
	let pending = false;
	async function advance() {
		const step = root.value;
		const panel = root.panel(step);
		if (panel && validate) {
			pending = true;
			try {
				if ((await validate(panel, step)) === false) return;
			} finally {
				pending = false;
			}
			// moved elsewhere while the rules ran: that wins
			if (root.value !== step) return;
		}
		if (panel && !novalidate && !panel.closest('form')?.noValidate) {
			const fields = [...panel.querySelectorAll<Field>('input, select, textarea, button')];
			const invalid = fields.find((f) => f.willValidate && !f.checkValidity());
			if (invalid) {
				invalid.reportValidity();
				return;
			}
		}
		root.next();
	}
</script>

<StepperButton
	bind:ref
	data-slot="stepper-next"
	end={!root.canNext()}
	onclick={(event: MouseEvent) => {
		onclick?.(event);
		if (!event.defaultPrevented && !pending) void advance();
	}}
	{...restProps}
>
	{@render children?.()}
</StepperButton>
