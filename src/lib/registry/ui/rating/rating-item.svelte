<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	/**
	 * One cell. The star is two glyphs on one spot: the outline and the filled star
	 * (copper; ink when readonly) clipped from the right, so a half is the left half filled (the right half under
	 * `dir="rtl"`). Choosing slides the clip open, quick 140ms on settle (clip-path only); the
	 * hovered cell lifts to 110% (only where the device can hover) and dips to 92% while pressed.
	 * When several stars change at once the clip of each waits its turn (`--rating-i`, the cell's
	 * index, against the Rating's `--rating-anchor` / `--rating-dir` / `--rating-stagger`), so the
	 * fill sweeps along the row. Reduced motion: no scale, no sweep.
	 */
	export const ratingItemVariants = tv({
		base: [
			'group/rating-item relative grid shrink-0 place-items-center outline-none',
			'cursor-pointer data-readonly:cursor-default data-disabled:cursor-not-allowed',
			/*
			 * lift on hover, dip while pressed; only where it takes a rating. The lift goes through
			 * `hover:` (gated on `@media (hover: hover)`), so a tap on a phone, where `:hover` sticks
			 * to the last star touched, never leaves a star scaled.
			 */
			'motion-safe:not-data-readonly:not-data-disabled:hover:[&_[data-slot=rating-star]]:scale-110',
			'motion-safe:[&:not([data-readonly],[data-disabled]):active_[data-slot=rating-star]]:scale-[0.92]',
			'[&:active_[data-slot=rating-star]]:duration-(--dur-press)'
		],
		variants: {
			size: {
				sm: 'size-4',
				default: 'size-11 [&_[data-slot=rating-star]]:size-8',
				lg: 'size-12 [&_[data-slot=rating-star]]:size-10'
			}
		},
		defaultVariants: { size: 'default' }
	});
</script>

<script lang="ts">
	import { RatingGroup as RatingGroupPrimitive } from 'bits-ui';
	import StarIcon from '@lucide/svelte/icons/star';
	import { cn, type WithoutChild } from '#lib/utils.js';
	import { getRatingContext } from './context.js';

	/**
	 * RatingItem: one star of a Rating, for the `index` the Rating's children hand out. Its state
	 * (`data-state`): `active` filled, `partial` half filled, `inactive` an outline. While the
	 * pointer previews a rating, a cell whose state differs from the chosen value marks its star
	 * with `data-preview` (on the wrapper inside the cell) and fills in a lighter copper, so the preview never looks like the rating itself.
	 *
	 * Children replace the star (they get `{ state }`); without them it draws the star.
	 *
	 * @example
	 * <Rating bind:value aria-label="Rating" aria-valuetext={(v, max) => `${v} of ${max}`}>
	 *   {#snippet children({ items })}
	 *     {#each items as item (item.index)}<RatingItem index={item.index} />{/each}
	 *   {/snippet}
	 * </Rating>
	 */
	let {
		ref = $bindable(null),
		class: className,
		index,
		children: childrenProp,
		...restProps
	}: WithoutChild<RatingGroupPrimitive.ItemProps> = $props();

	const rating = getRatingContext();
	const size = $derived(rating?.size ?? 'default');

	// The state the chosen value alone gives this cell; a different shown state is a hover preview.
	const chosen = $derived.by(() => {
		const v = rating?.value ?? 0;
		if (v >= index + 1) return 'active';
		if (rating?.allowHalf && v >= index + 0.5) return 'partial';
		return 'inactive';
	});
</script>

<RatingGroupPrimitive.Item
	bind:ref
	{index}
	data-slot="rating-item"
	data-size={size}
	class={cn(ratingItemVariants({ size }), className)}
	{...restProps}
>
	{#snippet children({ state })}
		<span
			data-preview={state !== chosen ? '' : undefined}
			style="--rating-i:{index}"
			class="group/rating-cell contents"
		>
			{#if childrenProp}
				{@render childrenProp({ state })}
			{:else}
				<span
					data-slot="rating-star"
					aria-hidden="true"
					class={cn(
						'grid size-full place-items-center *:[grid-area:1/1] *:size-full',
						'transition-[scale] duration-(--dur-quick) ease-(--ease-settle)'
					)}
				>
					<StarIcon class="text-muted-foreground" />
					<StarIcon
						fill="currentColor"
						class={cn(
							'text-primary transition-[clip-path,color] duration-(--dur-quick) ease-(--ease-settle)',
							'[transition-delay:calc(max(0,var(--rating-dir,0)*(var(--rating-i,0)-var(--rating-anchor,0)))*var(--rating-stagger,0ms))]',
							'[clip-path:inset(0_100%_0_0)] rtl:[clip-path:inset(0_0_0_100%)]',
							'group-data-[state=partial]/rating-item:[clip-path:inset(0_50%_0_0)] rtl:group-data-[state=partial]/rating-item:[clip-path:inset(0_0_0_50%)]',
							'group-data-[state=active]/rating-item:[clip-path:inset(0)] rtl:group-data-[state=active]/rating-item:[clip-path:inset(0)]',
							'group-data-preview/rating-cell:text-primary/50',
							// on display, not in hand: ink
							'group-data-readonly/rating-item:text-foreground'
						)}
					/>
				</span>
			{/if}
		</span>
	{/snippet}
</RatingGroupPrimitive.Item>
