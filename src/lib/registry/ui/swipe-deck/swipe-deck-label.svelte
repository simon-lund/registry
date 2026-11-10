<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getSwipeDeckCard, type SwipeDeckDirection } from './context.svelte.js';

	/**
	 * SwipeDeckLabel: what a direction means, shown over the card while it is dragged that way, and
	 * the switch that turns the direction on for its card (its button and arrow key too). Its children
	 * are an icon and a word: the icon is drawn in a 64px circle over the card's centre, the word is
	 * not drawn but is what the deck announces when the card goes. Hidden from assistive tech.
	 *
	 * `variant` matches the direction's SwipeDeckAction, so the circle has its button's colour:
	 * `outline` (default) a ring around the icon on the background, `default` the primary disc. Give
	 * `default` to the one direction whose button is the main action.
	 *
	 * One continuous motion with the finger: past the first 15% of the way it fades in and grows
	 * with the distance (60% to 90%); at the threshold, where a release commits, it settles to full
	 * size in the base 220ms, and below it again settles back as gently. Nothing pops, nothing
	 * changes colour. Reduced motion: it only fades.
	 *
	 * @example
	 * <SwipeDeckLabel direction="left"><XIcon />Skip</SwipeDeckLabel>
	 * <SwipeDeckLabel direction="right" variant="default"><BookmarkIcon />Save</SwipeDeckLabel>
	 */
	let {
		ref = $bindable(null),
		class: className,
		direction,
		variant = 'outline',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
		direction: SwipeDeckDirection;
		/** The colour of this direction's button: `outline` (default) or `default` (primary). */
		variant?: 'default' | 'outline';
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
	class="wrap pointer-events-none absolute inset-0 z-[2] grid place-items-center"
>
	<div
		bind:this={ref}
		data-state={labelState}
		data-variant={variant}
		class={cn(
			'stamp grid size-16 place-items-center rounded-full shadow-lg',
			variant === 'default'
				? 'bg-primary text-primary-foreground'
				: 'bg-background text-foreground border-input border',
			className
		)}
		{...restProps}
	>
		<!-- The icon shows; the word is set at no size, kept only as the words the deck announces. -->
		<span bind:this={words} class="grid place-items-center text-[0px] leading-none [&_svg]:size-7 [&_svg]:shrink-0">
			{@render children?.()}
		</span>
	</div>
</div>

<style>
	/*
	 * Follows the finger (no transition: it is the distance). Invisible for the first 15% of the way,
	 * so a card nudged about shows nothing, then fades in and grows to 90% at the threshold.
	 */
	.wrap {
		--shown: clamp(0, calc((var(--swipe-progress, 0) - 0.15) / 0.85), 1);
		opacity: 0;
	}
	.wrap[data-state='approaching'] {
		opacity: var(--shown);
	}
	.wrap[data-state='armed'] {
		opacity: 1;
	}
	.stamp {
		scale: calc(0.6 + 0.3 * var(--shown));
	}

	/* The threshold: the last 10% to full size in the base duration, both ways, on settle. */
	.wrap[data-state='armed'] .stamp {
		scale: 1;
		transition: scale var(--dur-base) var(--ease-settle);
	}
	/* Short of it, the size eases after the finger in quick, so falling back below is soft too. */
	.wrap[data-state='approaching'] .stamp {
		transition: scale var(--dur-quick) var(--ease-settle);
	}

	@media (prefers-reduced-motion: reduce) {
		.stamp,
		.wrap[data-state='armed'] .stamp {
			scale: 1;
			transition: none;
		}
	}
</style>
