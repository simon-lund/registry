<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getStepperItem, getStepperList, getStepperRoot } from './context.js';

	/**
	 * StepperSeparator: the line from this step to the next. Put it in every StepperItem but the
	 * last. A 2px track in the border colour; once the step is done a foreground line runs along it
	 * from this step to the next (base 220ms, settle, transform only: a scale from the start).
	 * Horizontal it stretches between the two steps on the indicators' centre line; vertical it
	 * runs down the indicators' column. Decoration only (`aria-hidden`). Not drawn in the inline
	 * lists.
	 *
	 * @example
	 * <StepperSeparator />
	 */
	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & { ref?: HTMLSpanElement | null } = $props();

	const root = getStepperRoot('StepperSeparator');
	const item = getStepperItem('StepperSeparator');
	const list = getStepperList();
	const filled = $derived(item.done);
</script>

{#if list.variant === 'default'}
	<span
		bind:this={ref}
		data-slot="stepper-separator"
		data-orientation={root.orientation}
		data-filled={filled || undefined}
		aria-hidden="true"
		class={cn(
			'separator block overflow-hidden rounded-full bg-border',
			root.orientation === 'vertical'
				? /* down the indicator column: centred under the 32px circle, 6px clear of both circles */
					'absolute top-[calc(var(--spacing)*9.5)] bottom-[calc(var(--spacing)*1.5)] left-[calc(var(--spacing)*4-1px)] w-0.5'
				: /* on the circles' centre line, 6px clear of the trigger before and the circle after */
					'mt-[calc(var(--spacing)*4-1px)] h-0.5 min-w-4 flex-1',
			className
		)}
		{...restProps}
	>
		<span class="separator-fill block size-full rounded-full bg-foreground"></span>
	</span>
{/if}

<style>
	.separator-fill {
		transition: scale var(--dur-base) var(--ease-settle);
	}
	.separator[data-orientation='horizontal'] .separator-fill {
		transform-origin: left center;
		scale: 0 1;
	}
	:global([dir='rtl']) .separator[data-orientation='horizontal'] .separator-fill {
		transform-origin: right center;
	}
	.separator[data-orientation='vertical'] .separator-fill {
		transform-origin: center top;
		scale: 1 0;
	}
	.separator[data-filled] .separator-fill {
		scale: 1 1;
	}
	/* Reduced motion: the line is simply there or not. */
	@media (prefers-reduced-motion: reduce) {
		.separator-fill {
			transition: none;
		}
	}
</style>
