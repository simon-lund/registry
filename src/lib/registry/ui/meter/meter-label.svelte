<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { useMeterFieldContext } from './context.svelte.js';

	/**
	 * MeterLabel: what the Meter measures ("Storage"), in the foreground colour, at the start of the
	 * MeterField's line. It names the Meter.
	 *
	 * @example
	 * <MeterLabel>Storage</MeterLabel>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();

	const field = useMeterFieldContext();
</script>

<span
	bind:this={ref}
	id={field?.labelId}
	data-slot="meter-label"
	class={cn('min-w-0 truncate text-sm text-foreground', className)}
	{...restProps}
>
	{@render children?.()}
</span>
