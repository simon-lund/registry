<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';
	import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';
	import { parseColor, toHex } from './color.js';
	import { getColorPicker } from './context.svelte.js';
	import { COLOR_HAIRLINE, HIT_AREA, overChecker } from './look.js';

	/**
	 * ColorPickerSwatch: one preset of a ColorPickerSwatches palette, a 32px disc of the colour (over
	 * the checkerboard when translucent) with a hairline inside, so white reads on a light surface.
	 * Picked, the disc draws in and a primary ring closes around it, 140ms on settle. Keyboard focus
	 * draws the focus ring outside it (focus follows the pick in the palette, so the ring is what shows
	 * focus is there). 44px to touch. `value` is any CSS colour the picker reads; `aria-label` is
	 * required (the colour's name: "Lake", "Rust").
	 *
	 * @example
	 * <ColorPickerSwatch value="#2f6f8f" aria-label="Lake" />
	 */
	let {
		ref = $bindable(null),
		class: className,
		value,
		'aria-label': ariaLabel,
		...restProps
	}: Omit<WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps>, 'value' | 'aria-label'> & {
		/** The colour: hex, rgb(), hsl() or oklch(). */
		value: string;
		/** Required: the colour's name. The library carries no copy. */
		'aria-label': string;
	} = $props();

	const picker = getColorPicker('ColorPickerSwatch');
	const rgb = $derived(parseColor(value));
	// The group's value is the picker's hex, so a swatch is picked exactly when its hex matches.
	const itemValue = $derived(rgb ? toHex(picker.alpha ? rgb : { ...rgb, a: 1 }, picker.alpha) : value);
	const paint = $derived(rgb ? overChecker(toHex(rgb, true)) : undefined);
</script>

<RadioGroupPrimitive.Item
	bind:ref
	data-slot="color-picker-swatch"
	value={itemValue}
	aria-label={ariaLabel}
	class={cn(
		'group/swatch relative size-8 shrink-0 cursor-pointer rounded-full',
		HIT_AREA,
		// the focus ring with keyboard focus (focus follows the pick, so the ring is what tells them apart)
		'outline-2 outline-offset-2 outline-solid outline-transparent focus-visible:outline-ring',
		// the ring closes around the picked one: the selected, so primary
		'shadow-[inset_0_0_0_0_var(--primary)] data-[state=checked]:shadow-[inset_0_0_0_2px_var(--primary)]',
		'transition-[box-shadow] duration-(--dur-quick) ease-(--ease-settle)',
		'data-disabled:cursor-not-allowed',
		className
	)}
	{...restProps}
>
	<span
		aria-hidden="true"
		class={cn(
			'pointer-events-none absolute inset-0 rounded-full',
			COLOR_HAIRLINE,
			'transition-[scale] duration-(--dur-quick) ease-(--ease-settle)',
			'group-data-[state=checked]/swatch:scale-[0.7]',
			// pressed, a free one gives a little
			'motion-safe:group-data-[state=unchecked]/swatch:group-active/swatch:scale-[0.92]'
		)}
		style:background={paint}
	></span>
</RadioGroupPrimitive.Item>
