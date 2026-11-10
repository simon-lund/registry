<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';
	import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';

	/**
	 * ColorPickerSwatch: one colour of a ColorPicker, a 32px disc of it with a hairline inside
	 * (foreground at 10%), so white reads on a light surface and black on a dark one. Picked, the
	 * disc draws in and a primary ring closes around it, 140ms on settle. Keyboard focus draws the
	 * focus ring outside it (focus follows the pick, so the ring is what shows focus is there).
	 * 44px to touch. `value` is any CSS colour, and what the picker's value becomes; `aria-label` is
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
	}: Omit<WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps>, 'aria-label'> & {
		/** The colour, any CSS colour; the picker's value when picked. */
		value: string;
		/** Required: the colour's name. The library carries no copy. */
		'aria-label': string;
	} = $props();
</script>

<RadioGroupPrimitive.Item
	bind:ref
	data-slot="color-picker-swatch"
	{value}
	aria-label={ariaLabel}
	class={cn(
		'group/swatch relative size-8 shrink-0 cursor-pointer rounded-full',
		// 44px to touch
		"before:absolute before:top-1/2 before:left-1/2 before:size-11 before:-translate-1/2 before:rounded-full before:content-['']",
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
			'shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--foreground)_10%,transparent)]',
			'transition-[scale] duration-(--dur-quick) ease-(--ease-settle)',
			'group-data-[state=checked]/swatch:scale-[0.7]',
			// pressed, a free one gives a little
			'motion-safe:group-data-[state=unchecked]/swatch:group-active/swatch:scale-[0.92]'
		)}
		style:background={value}
	></span>
</RadioGroupPrimitive.Item>
