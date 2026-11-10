<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getSwipeDeckCard, type SwipeDeckDirection } from './context.svelte.js';

	/**
	 * SwipeDeckLabel: what a direction means, shown over the card while it is dragged that way, and
	 * the switch that turns the direction on for its card (its button and arrow key too). Its children
	 * are an icon and a word: it frosts the whole card (a tint over an 8px backdrop blur) with the
	 * icon large in the middle; the word is not drawn but is what the deck announces when the card
	 * goes. Hidden from assistive tech.
	 *
	 * `variant` matches the direction's SwipeDeckAction, so the glass has its button's colour:
	 * `outline` (default) milky, the background at 60%, the icon in foreground; `default` copper,
	 * primary at 80%, the icon in primary-foreground. Give `default` to the one direction whose
	 * button is the main action.
	 *
	 * One continuous motion with the finger: past the first 15% of the way the glass fades in and the
	 * icon grows with the distance (80% to 95%); at the threshold, where a release commits, the icon
	 * settles to full size in the base 220ms, and below it again settles back as gently. Nothing
	 * pops, nothing changes colour. Reduced motion: it only fades.
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
	bind:this={ref}
	data-slot="swipe-deck-label"
	data-direction={direction}
	data-state={labelState}
	data-variant={variant}
	aria-hidden="true"
	class={cn(
		'wrap pointer-events-none absolute inset-0 z-[2] grid place-items-center rounded-[inherit] backdrop-blur-sm',
		variant === 'default'
			? 'bg-primary/80 text-primary-foreground'
			: 'bg-background/60 text-foreground',
		className
	)}
	{...restProps}
>
	<!-- The icon shows; the word is set at no size, kept only as the words the deck announces. -->
	<span bind:this={words} class="stamp grid place-items-center text-[0px] leading-none [&_svg]:size-12 [&_svg]:shrink-0">
		{@render children?.()}
	</span>
</div>

<style>
	/*
	 * Follows the finger (no transition: it is the distance). Invisible for the first 15% of the way,
	 * so a card nudged about shows nothing, then the glass fades in and the icon grows to 95% at the
	 * threshold.
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
		scale: calc(0.8 + 0.15 * var(--shown));
	}

	/* Short of the threshold the size eases after the finger in quick, so falling back is soft too. */
	.wrap[data-state='approaching'] .stamp {
		transition: scale var(--dur-quick) var(--ease-settle);
	}
	/* The threshold: the last 5% to full size in the base duration, on settle. */
	.wrap[data-state='armed'] .stamp {
		scale: 1;
		transition: scale var(--dur-base) var(--ease-settle);
	}

	@media (prefers-reduced-motion: reduce) {
		.stamp,
		.wrap[data-state='armed'] .stamp {
			scale: 1;
			transition: none;
		}
	}
</style>
