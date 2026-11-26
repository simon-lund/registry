<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { useMeterFieldContext } from './context.svelte.js';

	/**
	 * MeterValue: the value in words ("3.2 of 5 GB"), muted, with tabular digits, at
	 * the end of the MeterField's line. It describes the Meter. When the Meter's value is poor (two
	 * regions from the optimum) these words turn the destructive colour.
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

	const field = useMeterFieldContext();
	$effect(() => {
		if (!field) return;
		field.hasValue = true;
		return () => {
			field.hasValue = false;
		};
	});
</script>

<span
	bind:this={ref}
	id={field?.valueId}
	data-slot="meter-value"
	data-tone={field?.tone}
	class={cn(
		'text-sm font-medium text-muted-foreground tabular-nums transition-colors duration-(--dur-base) ease-(--ease-settle)',
		'data-[tone=poor]:text-destructive',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
