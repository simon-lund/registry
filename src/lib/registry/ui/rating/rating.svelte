<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	/**
	 * The row of stars. Sizes (all spacing multiples, so they scale with the density):
	 *   sm      16px stars, 2px apart: a readonly display in a list row or a card's meta line;
	 *   default 32px stars in 44px cells (44px to touch): a rating someone gives;
	 *   lg      40px stars in 48px cells: the one question on a screen ("How was it?").
	 * The focus ring (keyboard only) goes round the whole row: it is one control.
	 */
	export const ratingVariants = tv({
		base: [
			'group/rating inline-flex w-fit items-center rounded-sm text-foreground select-none',
			/* one control, one ring: round the whole row, keyboard only */
			'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
			/* the fill runs from star to star, 35ms apart; reduced motion: all at once */
			'[--rating-stagger:35ms] motion-reduce:[--rating-stagger:0ms]',
			'data-disabled:cursor-not-allowed data-disabled:opacity-45'
		],
		variants: {
			size: {
				sm: 'gap-0.5',
				default: '',
				lg: ''
			}
		},
		defaultVariants: { size: 'default' }
	});

	export type RatingSize = NonNullable<VariantProps<typeof ratingVariants>['size']>;
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { RatingGroup as RatingGroupPrimitive } from 'bits-ui';
	import { cn, type WithoutChild } from '#lib/utils.js';
	import { restoreOnReset } from '#lib/registry/ui/form-reset/index.js';
	import { setRatingContext } from './context.js';
	import Item from './rating-item.svelte';

	/**
	 * Rating: a score in stars (bits-ui RatingGroup). The chosen stars are filled in copper (the
	 * value in hand), the rest are outlines; never yellow. `allowHalf` lets it stop at halves (the left half
	 * of a star fills). `readonly` shows a rating without taking one (use `size="sm"` in a list): its stars are ink, not
	 * copper, since a score on display is not a value in your hand.
	 *
	 * Keyboard: it is one tab stop with the slider role; ← → (↑ ↓) move by one (by a half with
	 * `allowHalf`), Home / End jump to the ends, a digit sets that many stars ("2", ".", "5" for 2.5).
	 * Pointer: the hovered star and those before it preview the rating in a lighter copper (not on touch);
	 * a change of several stars runs as one sweep, star after star (35ms apart): left to right
	 * as it fills, right to left as it empties (reduced motion: all at once);
	 * pressing the first star again when it is the whole rating clears it to 0 (bits-ui), unless
	 * `min` is above 0.
	 *
	 * No copy of its own: the name (`aria-label` or `aria-labelledby`) and `aria-valuetext` (a
	 * string or `(value, max) => string`, e.g. "3 of 5 stars") are required. A readonly rating
	 * stays focusable (bits-ui), so a screen reader can read it, and carries `aria-readonly`, so it
	 * is not announced as adjustable.
	 *
	 * Without children it draws `max` RatingItems; pass children to draw your own (they get
	 * `{ items, value, max }`).
	 *
	 * In a form: with a `name` it submits the value (bits-ui's hidden input). `form.reset()` or a
	 * reset button puts it back to the value it mounted with, drawn and submitted alike (the bound
	 * `value` follows; `onValueChange` is not called). `bind:value` may point at a value that is
	 * still `undefined` (a missing key in a record): it reads as 0.
	 *
	 * @example
	 * <Rating bind:value aria-label="Rating" aria-valuetext={(v, max) => `${v} of ${max} stars`} />
	 * <Rating readonly size="sm" value={4.5} allowHalf aria-label="Rating" aria-valuetext="4.5 of 5 stars" />
	 */
	let {
		ref = $bindable(null),
		// No fallback: a binding to a missing key (`bind:value={scores[id]}`) is allowed and reads as
		// 0; Svelte rejects `bind:x={undefined}` on a prop with a fallback.
		value = $bindable(),
		class: className,
		size = 'default',
		max = 5,
		allowHalf = false,
		children: childrenProp,
		'aria-label': ariaLabel,
		...restProps
	}: WithoutChild<RatingGroupPrimitive.RootProps> & {
		size?: RatingSize;
		/** What the value says, in the consumer's words. Required: bits-ui's default is English. */
		'aria-valuetext': NonNullable<RatingGroupPrimitive.RootProps['aria-valuetext']>;
	} & ({ 'aria-label': string } | { 'aria-labelledby': string }) = $props();

	// form.reset() resets bits-ui's hidden input (to its defaultValue, set here to the mount
	// value) but not the drawn stars: the stars go back there too.
	let mounted: number | undefined;
	$effect(() => {
		void restProps.name; // the hidden input comes and goes with the name
		const el = ref;
		if (!el) return;
		const start = (mounted ??= untrack(() => value ?? 0));
		return restoreOnReset(
			el,
			() => (value = start),
			(input) => (input.defaultValue = String(start))
		);
	});

	// The sweep: which star a change starts from and which way it runs, read in the same render
	// as the new states (a transition-delay must be in place when the state flips). Each star's
	// delay is max(0, dir × (index − anchor)) × the stagger (rating-item). Filling starts at the
	// first star that changes, emptying at the last lit one; no change of level, no delay (the
	// preview's colour turning into the rating's on a click).
	type Sweep = { anchor: number; dir: number };
	let lastLevel: number | undefined;
	function sweepFor(items: { state: string }[]): Sweep {
		const level = items.reduce(
			(n, item) => n + (item.state === 'active' ? 1 : item.state === 'partial' ? 0.5 : 0),
			0
		);
		const from = lastLevel ?? level;
		lastLevel = level;
		if (level > from) return { anchor: Math.floor(from), dir: 1 };
		if (level < from) return { anchor: Math.ceil(from) - 1, dir: -1 };
		return { anchor: 0, dir: 0 };
	}

	// bits-ui names the root "Rating" (English) unless given an aria-label, so the root is drawn
	// through `child` with only the consumer's name.
	setRatingContext({
		get size() {
			return size;
		},
		get value() {
			return value ?? 0;
		},
		get allowHalf() {
			return allowHalf;
		}
	});
</script>

<RatingGroupPrimitive.Root
	bind:ref
	bind:value={() => value ?? 0, (v) => (value = v)}
	data-slot="rating"
	data-size={size}
	{max}
	{allowHalf}
	class={cn(ratingVariants({ size }), className)}
	{...restProps}
>
	{#snippet child({ props, ...snippetProps })}
		{@const sweep = sweepFor(snippetProps.items)}
		<!-- bits-ui marks readonly with data-readonly only: assistive tech hears it too. -->
		<div
			{...props}
			style="{props.style ?? ''};--rating-anchor:{sweep.anchor};--rating-dir:{sweep.dir}"
			aria-label={ariaLabel}
			aria-readonly={restProps.readonly ? 'true' : undefined}
		>
			{#if childrenProp}
				{@render childrenProp(snippetProps)}
			{:else}
				{#each snippetProps.items as item (item.index)}
					<Item index={item.index} />
				{/each}
			{/if}
		</div>
	{/snippet}
</RatingGroupPrimitive.Root>
