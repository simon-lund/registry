<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getDial, polar } from './context.js';

	/**
	 * DialUnit: the unit of a Dial's values ("days", "min"), in muted label type, centred in the open
	 * part of the sweep (below the knob for the default 270 degree arc), between the knob and the
	 * labels. Shown to sight only: put the unit into the dial's `aria-valuetext`.
	 *
	 * @example
	 * <DialUnit>days</DialUnit>
	 */
	let {
		ref = $bindable(null),
		class: className,
		style,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();

	const dial = getDial('DialUnit');
	// The middle of the gap; a full circle has none, so the bottom.
	const at = $derived(polar(dial.sweep >= 360 ? 180 : dial.start + dial.sweep + (360 - dial.sweep) / 2));
</script>

<span
	bind:this={ref}
	data-slot="dial-unit"
	aria-hidden="true"
	class={cn(
		'pointer-events-none absolute -translate-1/2 text-xs font-medium whitespace-nowrap text-muted-foreground',
		className
	)}
	style="left:calc(50% + {at.x} * var(--dial-mark-r));top:calc(50% + {at.y} * var(--dial-mark-r));{style ?? ''}"
	{...restProps}
>
	{@render children?.()}
</span>
