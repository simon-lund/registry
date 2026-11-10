<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getStepperRoot } from './context.js';

	/**
	 * StepperContent: what one step holds (`value` = its step). Shown only while that step is
	 * current; the others stay in the page, hidden, so what was typed into them survives going back
	 * and forth (and still submits with the form). A group named by the step's title. StepperNext
	 * checks the form fields in the current panel before it moves on.
	 *
	 * Horizontal, it swaps without animation (the indicators already say what changed). Vertical,
	 * where it sits inside its StepperItem under the trigger, it opens and closes in the calm 320ms
	 * on settle (its height, its fade, and the item's gap above it), so the steps below glide instead
	 * of jumping. Closed, it is inert and, once shut, hidden. Reduced motion: it simply shows.
	 * `class` goes to the box that holds the children.
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
	const vertical = $derived(root.orientation === 'vertical');

	// The root knows each step's panel: StepperNext checks the current one, a submit finds the
	// step of an invalid field.
	$effect(() => {
		if (ref) return root.registerPanel(value, ref);
	});
</script>

{#if vertical}
	<!-- Grid rows from 0fr to 1fr: the height of whatever is inside, animated without measuring. -->
	<div
		bind:this={ref}
		role="group"
		aria-labelledby={root.titleId(value)}
		data-slot="stepper-content"
		data-state={active ? 'active' : 'inactive'}
		inert={!active}
		class="collapse-panel grid min-w-0"
		{...restProps}
	>
		<div class="min-h-0 overflow-hidden">
			<div class={cn('min-w-0', className)}>
				{@render children?.()}
			</div>
		</div>
	</div>
{:else}
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
{/if}

<style>
	/*
	 * Two states, mutually exclusive: open (active) · shut. Shutting, the content folds and fades,
	 * then is hidden (visibility on a delay, so it is not found or painted once gone); opening, it is
	 * shown at once and unfolds. The item's gap above it folds with it (--stepper-gap, set by
	 * StepperItem), so a shut step takes no room at all.
	 */
	.collapse-panel {
		grid-template-rows: 0fr;
		opacity: 0;
		visibility: hidden;
		margin-top: calc(-1 * var(--stepper-gap, 0px));
		transition:
			grid-template-rows var(--dur-calm) var(--ease-settle),
			margin-top var(--dur-calm) var(--ease-settle),
			opacity var(--dur-quick) var(--ease-exit),
			visibility 0s linear var(--dur-calm);
	}
	.collapse-panel[data-state='active'] {
		grid-template-rows: 1fr;
		opacity: 1;
		visibility: visible;
		margin-top: 0;
		transition:
			grid-template-rows var(--dur-calm) var(--ease-settle),
			margin-top var(--dur-calm) var(--ease-settle),
			opacity var(--dur-calm) var(--ease-settle),
			visibility 0s;
	}
	@media (prefers-reduced-motion: reduce) {
		.collapse-panel,
		.collapse-panel[data-state='active'] {
			transition: none;
		}
	}
</style>
