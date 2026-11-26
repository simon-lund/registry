<script lang="ts">
	import { useId } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { setMeterFieldContext } from './context.svelte.js';

	/**
	 * MeterField: a Meter with its words. The MeterLabel at the start and the MeterValue at the end
	 * of one line, the track under both; it wires the ids, so the Meter is named by its label and
	 * described by its value. Put the MeterValue before the Meter, as in the example. The words come
	 * from you; format numbers with `Intl` in your locale.
	 *
	 * @example
	 * <MeterField>
	 *   <MeterLabel>Monthly limit</MeterLabel>
	 *   <MeterValue>€38 of €50</MeterValue>
	 *   <Meter value={38} max={50} low={35} high={45} optimum={0} aria-valuetext="38 of 50 euros" />
	 * </MeterField>
	 */
	let {
		ref = $bindable(null),
		id: idProp,
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	// The ids are fixed when the field mounts.
	// svelte-ignore state_referenced_locally
	const id = idProp ?? useId();
	setMeterFieldContext(id);
</script>

<div
	bind:this={ref}
	{id}
	data-slot="meter-field"
	class={cn('group/meter-field grid w-full grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-2 [&>[data-slot=meter]]:col-span-2', className)}
	{...restProps}
>
	{@render children?.()}
</div>
