<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';
	import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import { parseColor } from './color.js';
	import { getColorPicker } from './context.svelte.js';

	/**
	 * ColorPickerSwatches: a preset palette, one ColorPickerSwatch per colour (bits-ui RadioGroup:
	 * one is picked, Tab enters at the picked one, the arrows move and pick, in both axes, wrapping).
	 * The swatch that matches the colour (at 8 bits per channel) shows as picked; none does while
	 * the colour is off the palette. Picking one sets the colour and commits. On its own it is the
	 * whole picker for a fixed palette; beside the area it is the presets.
	 *
	 * A wrapping row with 8px gaps (the swatches are 32px, 44px to touch); lay it out otherwise
	 * with a class (`grid grid-cols-6`). Name it: `aria-label` ("Presets") or `aria-labelledby`.
	 *
	 * @example
	 * <ColorPickerSwatches aria-label="Presets">
	 *   <ColorPickerSwatch value="#2f6f8f" aria-label="Lake" />
	 *   <ColorPickerSwatch value="#c2552d" aria-label="Rust" />
	 * </ColorPickerSwatches>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: Omit<WithoutChildrenOrChild<RadioGroupPrimitive.RootProps>, 'value' | 'onValueChange' | 'disabled'> & {
		children?: Snippet;
	} = $props();

	const picker = getColorPicker('ColorPickerSwatches');

	function pick(next: string) {
		const rgb = parseColor(next);
		if (!rgb) return;
		picker.setRgb(rgb);
		picker.commit();
	}
</script>

<RadioGroupPrimitive.Root
	bind:ref
	data-slot="color-picker-swatches"
	orientation="horizontal"
	loop
	value={picker.hex}
	onValueChange={pick}
	disabled={picker.disabled}
	class={cn('flex flex-wrap gap-2 data-disabled:opacity-50', className)}
	{...restProps}
>
	{@render children?.()}
</RadioGroupPrimitive.Root>
