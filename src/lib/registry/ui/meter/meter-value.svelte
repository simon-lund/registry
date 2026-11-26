<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { useMeterFieldContext } from './context.svelte.js';

	/**
	 * MeterValue: the value in words ("3.2 of 5 GB"), with tabular digits, at the end of the
	 * MeterField's line. It describes the Meter. Its colour follows the Meter's tone: muted in the
	 * good region, full ink one region away (suboptimal), destructive two regions away (poor).
	 *
	 * @example
	 * <MeterValue>4.9 of 5 GB</MeterValue>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();

	// Said while it is set up, so the Meter after it is described on the server too.
	const field = useMeterFieldContext();
	if (field) {
		field.hasValue = true;
		onDestroy(() => (field.hasValue = false));
	}
</script>

<span
	bind:this={ref}
	id={field?.valueId}
	data-slot="meter-value"
	class={cn(
		'text-sm font-medium text-muted-foreground tabular-nums transition-colors duration-(--dur-base) ease-(--ease-settle)',
		// the field is the group: the value reads the tone off the meter beside it
		'group-has-[[data-slot=meter][data-tone=suboptimal]]/meter-field:text-foreground',
		'group-has-[[data-slot=meter][data-tone=poor]]/meter-field:text-destructive',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
