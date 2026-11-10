<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	/**
	 * MarkupWidth: one width in MarkupWidths, drawn as a line of that width; the picked one is
	 * copper. `value` in px; `aria-label` names it ("Thin").
	 *
	 * @example
	 * <MarkupWidth value={4} aria-label="Medium" />
	 */
	let {
		value,
		class: className,
		'aria-label': ariaLabel,
		...restProps
	}: Omit<RadioGroupPrimitive.ItemProps, 'value' | 'children' | 'child'> & {
		value: number;
		'aria-label': string;
	} = $props();
</script>

<RadioGroupPrimitive.Item
	value={String(value)}
	data-slot="markup-width"
	aria-label={ariaLabel}
	class={cn(
		'text-muted-foreground hover:bg-foreground/6 hover:text-foreground focus-visible:ring-ring data-[state=checked]:text-primary flex h-8 w-16 cursor-pointer items-center justify-center rounded-md outline-none focus-visible:ring-2',
		className
	)}
	{...restProps}
>
	<svg viewBox="0 0 40 16" class="h-4 w-10" aria-hidden="true">
		<path d="M4 8h32" stroke="currentColor" stroke-width={value} stroke-linecap="round" />
	</svg>
</RadioGroupPrimitive.Item>
