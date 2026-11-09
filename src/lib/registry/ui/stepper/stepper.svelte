<script lang="ts">
	import { tick } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { SvelteMap } from 'svelte/reactivity';
	import { cn } from '#lib/utils.js';
	import { setStepperRoot, type StepperOrientation, type StepperStep } from './context.js';

	/**
	 * Stepper: a task in a few ordered steps (setting up an account, a checkout), showing where you
	 * are, what is done and what comes. The root holds the current step and lays out the list and
	 * the panels.
	 *
	 * Steps are numbered from 1 (`StepperItem value={n}`): order is what linear navigation and the
	 * separators' fill are made of. `bind:value` is the current step; `onValueChange` hears every
	 * change made inside (a trigger, StepperPrevious, StepperNext).
	 *
	 * Navigation through the triggers, one of two:
	 *   linear (default)  back to any earlier step; ahead only to a step whose every predecessor is
	 *                     done (by default the steps before the furthest one reached are);
	 *   free              to any step that is not disabled (`linear={false}`).
	 * A trigger that cannot be used is plain text, not a button. StepperPrevious / StepperNext move
	 * one step either way in both modes.
	 *
	 * Forms: put the steps in one `<form>` and give the fields their native constraints
	 * (`required`, `type="email"`, `pattern`, …). Don't disable StepperNext until the step is valid:
	 * it checks the current panel's fields itself and, if one is invalid, shows the browser's
	 * message on the first and stays (custom rules: its `validate`; opt out: `novalidate`). On
	 * submit, an invalid field in a panel that is not shown takes the stepper to its step first, so
	 * the browser's message is seen (`invalid` events, caught on the root).
	 *
	 * `orientation`: `horizontal` (default) or `vertical`. The root is its own size container: a
	 * horizontal stepper narrower than 30rem (a phone) keeps only the current step's title in
	 * sight; the others stay readable for screen readers. As a size container it takes no width from
	 * its content: inside a flex row, give it one (`w-full`).
	 *
	 * @example
	 * <Stepper bind:value={step}>
	 *   <StepperList aria-label="Set up your account">
	 *     <StepperItem value={1}>
	 *       <StepperTrigger><StepperIndicator /><StepperTitle>Account</StepperTitle></StepperTrigger>
	 *       <StepperSeparator />
	 *     </StepperItem>
	 *     …
	 *   </StepperList>
	 *   <StepperContent value={1}>…</StepperContent>
	 *   <StepperPrevious>Back</StepperPrevious><StepperNext variant="default">Continue</StepperNext>
	 * </Stepper>
	 */
	let {
		ref = $bindable(null),
		value = $bindable(1),
		orientation = 'horizontal',
		linear = true,
		onValueChange,
		class: className,
		children,
		...restProps
	}: Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> & {
		ref?: HTMLDivElement | null;
		/** The current step, from 1. */
		value?: number;
		orientation?: StepperOrientation;
		/** true (default): no skipping ahead past a step that is not done. false: free navigation. */
		linear?: boolean;
		/** Called with the new step whenever a part inside changes it. */
		onValueChange?: (value: number) => void;
	} = $props();

	const steps = new SvelteMap<number, StepperStep>();
	let focused = $state<number | null>(null);
	// The furthest step reached so far: the steps before it count as done unless an item says
	// otherwise, so going back to fix something keeps the way forward open.
	// svelte-ignore state_referenced_locally
	let reached = $state(value);
	$effect.pre(() => {
		if (value > reached) reached = value;
	});

	const sorted = $derived([...steps.keys()].sort((a, b) => a - b));
	const panels = new Map<number, HTMLElement>();

	// A submit with an invalid field in a hidden panel: the browser cannot focus it or show its
	// message. The first `invalid` of a validation pass (they come in tree order, so it is the one
	// the browser would report) takes the stepper to that field's step, then reports it there.
	let checking = false;
	function oninvalidcapture(event: Event) {
		(restProps.oninvalidcapture as ((e: Event) => void) | undefined)?.(event);
		if (checking) return;
		checking = true;
		setTimeout(() => (checking = false));
		const field = event.target as HTMLInputElement;
		for (const [v, panel] of panels) {
			if (v === value || !panel.contains(field)) continue;
			go(v);
			void tick().then(() => field.reportValidity?.());
			return;
		}
	}

	function go(next: number) {
		if (next === value) return;
		value = next;
		focused = null;
		onValueChange?.(next);
	}

	// The nearest step in a direction that is not disabled.
	function neighbour(dir: 1 | -1): number | undefined {
		const list = dir === 1 ? sorted : [...sorted].reverse();
		return list.find((v) => (dir === 1 ? v > value : v < value) && !steps.get(v)?.disabled);
	}

	setStepperRoot({
		get value() {
			return value;
		},
		get orientation() {
			return orientation;
		},
		get linear() {
			return linear;
		},
		get focused() {
			return focused;
		},
		get reached() {
			return Math.max(reached, value);
		},
		register(v, step) {
			steps.set(v, step);
			return () => {
				if (steps.get(v) === step) steps.delete(v);
			};
		},
		reachable(v) {
			// Before the items have registered (the first render, the server), order alone decides.
			if (steps.get(v)?.disabled) return false;
			if (!linear || v <= value) return true;
			return steps.has(v) && sorted.every((s) => s >= v || steps.get(s)?.done);
		},
		titleId: (v) => steps.get(v)?.titleId,
		go,
		previous() {
			const v = neighbour(-1);
			if (v !== undefined) go(v);
		},
		next() {
			const v = neighbour(1);
			if (v !== undefined) go(v);
		},
		canPrevious: () => neighbour(-1) !== undefined,
		canNext: () => neighbour(1) !== undefined,
		focus(v) {
			focused = v;
		},
		registerPanel(v, element) {
			panels.set(v, element);
			return () => {
				if (panels.get(v) === element) panels.delete(v);
			};
		},
		panel: (v) => panels.get(v)
	});
</script>

<div
	bind:this={ref}
	data-slot="stepper"
	data-orientation={orientation}
	class={cn('@container/stepper flex min-w-0 flex-col gap-6', className)}
	{...restProps}
	{oninvalidcapture}
>
	{@render children?.()}
</div>
