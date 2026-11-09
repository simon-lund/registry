<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getSwipeDeckCard, type SwipeDeckDirection } from './context.svelte.js';

	/**
	 * SwipeDeckLabel: what a direction means, written on the card while it is dragged that way, and
	 * the switch that turns the direction on for its card (its button and arrow key too). Its children
	 * are the words: an icon and a word. It sits in the corner the card leaves from: `right` at the
	 * top start, `left` at the top end, `up` at the bottom centre.
	 *
	 * Dragging toward it, it fades in and grows with the distance (72% to 86%); at the threshold it
	 * turns primary, because a release now commits, and locks at full size with one small overshoot;
	 * below it again, it falls back in 140ms. Reduced motion: it only fades. Hidden from assistive
	 * tech; the deck announces its words when the card goes.
	 *
	 * @example
	 * <SwipeDeckLabel direction="left"><XIcon />Skip</SwipeDeckLabel>
	 */
	let {
		ref = $bindable(null),
		class: className,
		direction,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
		direction: SwipeDeckDirection;
	} = $props();

	const card = getSwipeDeckCard('SwipeDeckLabel');
	let words: HTMLElement | null = $state(null);

	$effect(() => {
		if (words) return card.registerLabel(direction, words);
	});

	/* Mutually exclusive: the card is not out toward this direction, it is but short of the threshold,
	 * or past it (or sent this way by a button or key). */
	const labelState = $derived(
		card.armed === direction ? 'armed' : card.direction === direction ? 'approaching' : 'hidden'
	);
</script>

<div
	data-slot="swipe-deck-label"
	data-direction={direction}
	data-state={labelState}
	aria-hidden="true"
	class={cn(
		'wrap pointer-events-none absolute z-[2]',
		direction === 'right' && 'start-4 top-4 origin-top-left',
		direction === 'left' && 'end-4 top-4 origin-top-right',
		direction === 'up' && 'inset-x-0 bottom-4 flex origin-bottom justify-center'
	)}
>
	<div
		bind:this={ref}
		data-state={labelState}
		class={cn(
			'stamp bg-background text-foreground border-border relative inline-flex h-11 items-center rounded-full border px-4 text-base font-semibold whitespace-nowrap',
			'data-[state=armed]:bg-primary data-[state=armed]:text-primary-foreground data-[state=armed]:border-primary',
			className
		)}
		{...restProps}
	>
		<span bind:this={words} class="inline-flex items-center gap-2 [&_svg]:size-5 [&_svg]:shrink-0">
			{@render children?.()}
		</span>
	</div>
</div>

<style>
	/* Grows with the finger (no transition: it is the distance), invisible until the card moves this way. */
	.wrap {
		opacity: 0;
		scale: calc(0.72 + 0.14 * var(--swipe-progress, 0));
	}
	.wrap[data-state='approaching'] {
		opacity: min(1, calc(var(--swipe-progress, 0) * 1.6));
	}
	.wrap[data-state='armed'] {
		opacity: 1;
		scale: 0.86;
	}

	/* The detent: 86% to 100% with one small overshoot; back down quickly, no flourish. */
	.stamp {
		transition:
			scale var(--dur-quick) var(--ease-exit),
			background-color var(--dur-quick) var(--ease-settle),
			border-color var(--dur-quick) var(--ease-settle),
			color var(--dur-quick) var(--ease-settle);
	}
	.wrap[data-state='armed'] .stamp {
		scale: calc(1 / 0.86);
		transition:
			scale var(--dur-base) cubic-bezier(0.34, 1.56, 0.64, 1),
			background-color var(--dur-quick) var(--ease-settle),
			border-color var(--dur-quick) var(--ease-settle),
			color var(--dur-quick) var(--ease-settle);
	}

	@media (prefers-reduced-motion: reduce) {
		.wrap,
		.wrap[data-state='armed'] {
			scale: 1;
		}
		.wrap[data-state='armed'] .stamp {
			scale: 1;
		}
	}
</style>
