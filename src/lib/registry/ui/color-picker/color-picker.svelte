<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';
	import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';
	import type { Snippet } from 'svelte';

	/**
	 * ColorPicker: one colour out of a few, as a row of ColorPickerSwatch (bits-ui RadioGroup: Tab
	 * enters at the picked one, the arrows move and pick, in both axes, wrapping). Most of the time a
	 * handful of colours is the whole choice; this is that choice, nothing more.
	 *
	 * `bind:value` is the picked swatch's `value`, exactly as written there; none is picked while it
	 * matches no swatch. With `name` it submits in a form (`required` too). A wrapping row with 8px
	 * gaps (the swatches are 32px, 44px to touch); lay it out otherwise with a class
	 * (`grid grid-cols-6`). Name it: `aria-label` ("Label colour") or `aria-labelledby`.
	 *
	 * @example
	 * <ColorPicker bind:value={colour} aria-label="Label colour">
	 *   <ColorPickerSwatch value="#2f6f8f" aria-label="Lake" />
	 *   <ColorPickerSwatch value="#c2552d" aria-label="Rust" />
	 * </ColorPicker>
	 */
	let {
		ref = $bindable(null),
		value = $bindable(''),
		class: className,
		children,
		...restProps
	}: WithoutChildrenOrChild<RadioGroupPrimitive.RootProps> & {
		children?: Snippet;
	} = $props();
</script>

<RadioGroupPrimitive.Root
	bind:ref
	bind:value
	data-slot="color-picker"
	orientation="horizontal"
	loop
	class={cn('flex flex-wrap gap-2 data-disabled:opacity-50', className)}
	{...restProps}
>
	{@render children?.()}
</RadioGroupPrimitive.Root>
