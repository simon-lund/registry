<script lang="ts">
	import { Button, type ButtonProps } from '#lib/registry/ui/button/index.js';
	import { cn } from '#lib/utils.js';
	import { getColorPicker } from './context.svelte.js';
	import { COLOR_HAIRLINE, HIT_AREA, overChecker } from './look.js';

	/**
	 * ColorPickerTrigger: the colour as a button, to open the picker in an overlay. A 32px outline
	 * Button (44px to touch) with the colour set in 4px from its edge (concentric; over the
	 * checkerboard when translucent). It stays tinted while what it opens is open
	 * (`data-state="open"` or `aria-expanded`, which an overlay's trigger hands over). Render it
	 * through the overlay trigger's `child` and spread its props. `aria-label` is required
	 * ("List colour: lake", say what it is and, ideally, the colour).
	 *
	 * @example
	 * <Popover.Trigger>
	 *   {#snippet child({ props })}<ColorPickerTrigger {...props} aria-label="List colour" />{/snippet}
	 * </Popover.Trigger>
	 */
	let {
		ref = $bindable(null),
		class: className,
		disabled = false,
		'aria-label': ariaLabel,
		children,
		...restProps
	}: Omit<ButtonProps, 'aria-label' | 'href' | 'variant' | 'size'> & {
		/** Required: the library carries no copy. */
		'aria-label': string;
	} = $props();

	const picker = getColorPicker('ColorPickerTrigger');
</script>

<Button
	bind:ref
	variant="outline"
	size="icon"
	aria-label={ariaLabel}
	class={cn('relative data-[state=open]:bg-muted', HIT_AREA, className)}
	{...restProps}
	disabled={picker.disabled || disabled}
	data-slot="color-picker-trigger"
>
	<!-- inset 3px from the padding box plus the 1px border: 4px from the edge, concentric with the radius -->
	<span
		aria-hidden="true"
		data-slot="color-picker-trigger-swatch"
		class={cn('absolute inset-0.75 rounded-[calc(var(--radius-lg)-var(--spacing))]', COLOR_HAIRLINE)}
		style:background={overChecker(picker.css)}
	></span>
	{@render children?.()}
</Button>
