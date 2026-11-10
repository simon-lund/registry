<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	/*
	 * One step's room in the list. Horizontal: the trigger, then the separator stretching to the
	 * next step (the last item takes only its own width). Vertical: the trigger, whatever the step
	 * holds under it (a StepperContent), and the separator drawn down the indicator's column.
	 */
	export const stepperItemVariants = tv({
		base: 'relative min-w-0 data-disabled:opacity-45',
		variants: {
			layout: {
				horizontal: 'flex flex-auto items-start gap-3 last:flex-none',
				vertical: 'flex flex-col gap-3 pb-6 last:pb-0',
				inline: 'flex flex-none items-center'
			}
		},
		defaultVariants: { layout: 'horizontal' }
	});
</script>

<script lang="ts">
	import type { HTMLLiAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getStepperList, getStepperRoot, setStepperItem, type StepperItemState } from './context.js';

	/**
	 * StepperItem: one step. `value` is its place, from 1. Its look is one of three:
	 *   active   the step you are on (`aria-current="step"` on its trigger);
	 *   done     by default every step before the furthest one reached (going back keeps them
	 *            done); pass `done` to control it (a step left with something missing, a later
	 *            one already filled in, a flow started over);
	 *   pending  everything else.
	 * Active wins over done (a done step you went back to keeps its check, in the active look).
	 * The look is the item's `data-state` (and its trigger's, indicator's and title's); `data-done`
	 * marks a done step whether or not it is the active one.
	 *
	 * On top of the look, independently: `loading` (the indicator turns into a spinner, the trigger
	 * reports `aria-busy`: saving the step), `invalid` (a red ring with an X on the indicator;
	 * say what is wrong in a StepperDescription) and `disabled` (dimmed, never a button, skipped by
	 * StepperPrevious / StepperNext).
	 *
	 * The check is only drawn: to say "done" to a screen reader, put it in the title
	 * (`<span class="sr-only">, done</span>`).
	 *
	 * @example
	 * <StepperItem value={2} loading={saving}>
	 *   <StepperTrigger><StepperIndicator /><StepperTitle>Profile</StepperTitle></StepperTrigger>
	 *   <StepperSeparator />
	 * </StepperItem>
	 */
	let {
		ref = $bindable(null),
		class: className,
		value,
		done: doneProp = undefined,
		disabled = false,
		loading = false,
		invalid = false,
		children,
		...restProps
	}: Omit<HTMLLiAttributes, 'value'> & {
		ref?: HTMLLIElement | null;
		/** The step's place, from 1. */
		value: number;
		/** Done. Default: the step lies before the furthest step reached. */
		done?: boolean;
		disabled?: boolean;
		/** Under way (saving, checking): the indicator shows a spinner. */
		loading?: boolean;
		/** Something in this step needs attention: a red ring with an X on the indicator. */
		invalid?: boolean;
	} = $props();

	const root = getStepperRoot('StepperItem');
	const list = getStepperList();
	const id = $props.id();

	let hasTitle = $state(false);
	let hasDescription = $state(false);

	const done = $derived(doneProp ?? value < root.reached);
	const look: StepperItemState = $derived(
		value === root.value ? 'active' : done ? 'done' : 'pending'
	);
	const layout = $derived(list.variant === 'default' ? root.orientation : 'inline');

	$effect(() => {
		const v = value;
		return root.register(v, {
			get done() {
				return done;
			},
			get disabled() {
				return disabled;
			},
			get titleId() {
				return hasTitle ? `${id}-title` : undefined;
			}
		});
	});

	setStepperItem({
		get value() {
			return value;
		},
		get state() {
			return look;
		},
		get done() {
			return done;
		},
		get loading() {
			return loading;
		},
		get disabled() {
			return disabled;
		},
		get invalid() {
			return invalid;
		},
		titleId: `${id}-title`,
		descriptionId: `${id}-description`,
		get hasTitle() {
			return hasTitle;
		},
		get hasDescription() {
			return hasDescription;
		},
		setTitle(on) {
			hasTitle = on;
		},
		setDescription(on) {
			hasDescription = on;
		}
	});
</script>

<li
	bind:this={ref}
	data-slot="stepper-item"
	data-state={look}
	data-orientation={root.orientation}
	data-done={done || undefined}
	data-loading={loading || undefined}
	data-invalid={invalid || undefined}
	data-disabled={disabled || undefined}
	class={cn(stepperItemVariants({ layout }), className)}
	{...restProps}
>
	{@render children?.()}
</li>
