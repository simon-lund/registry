<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	/*
	 * The track is flat (a 12% tint of the text colour, no border, so it shows on the page, a card or
	 * the muted stage alike) and the fill is ink: a measurement is not the value in hand, so it is
	 * never copper. Only a poor value turns the fill to the destructive colour. Right to left the
	 * track is mirrored, so it still fills from the start. Drawn from --meter-track and --meter-fill.
	 */
	export const meterVariants = tv({
		base: [
			'relative w-full overflow-hidden rounded-full bg-(--meter-track) rtl:-scale-x-100',
			'[--meter-track:color-mix(in_oklch,var(--foreground)_12%,transparent)] [--meter-fill:var(--foreground)]',
			'data-[tone=poor]:[--meter-fill:var(--destructive)]'
		],
		variants: {
			size: {
				/** 8px: storage, a monthly limit. */
				default: 'h-2',
				/** 4px, for a line under something else (a card, a row). */
				sm: 'h-1'
			}
		},
		defaultVariants: { size: 'default' }
	});

	export type MeterSize = VariantProps<typeof meterVariants>['size'];
</script>

<script lang="ts">
	import { Meter as MeterPrimitive } from 'bits-ui';
	import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';
	import { meterTone, useMeterFieldContext } from './context.svelte.js';

	/**
	 * Meter: a value within a known range (bits-ui Meter, `role="meter"`): the storage used of a
	 * plan, the share of a monthly limit, a battery. It is **not** a progress or loading state:
	 * nothing is under way and nothing will finish. A flat track filled from the start in ink;
	 * a new value slides the fill there (base 220ms, settle; transform only).
	 *
	 * Thresholds, as on the HTML `<meter>`: `low` and `high` cut the range into three regions, and
	 * `optimum` says which one is good (a quota: `optimum={0}`, less is better; a battery: optimum
	 * at the top). The tone (`data-tone`) says how far the value is from the good region:
	 *   optimum     in it: the value's words are muted
	 *   suboptimal  one region away: the value's words step up to full ink
	 *   poor        two regions away: the fill and the value's words turn destructive
	 * `poor` needs both `low` and `high`, with the optimum beyond one of them; with one threshold
	 * the tone stops at `suboptimal`. Without thresholds it is always `optimum`.
	 *
	 * Inside a MeterField it is named by the MeterLabel and described by the MeterValue; alone,
	 * give it an `aria-label`. Pass `aria-valuetext` with the value in words ("3.2 of 5 GB"),
	 * since a screen reader would otherwise say a percentage. Sizes `default` (8px) and `sm` (4px).
	 *
	 * @example
	 * <MeterField>
	 *   <MeterLabel>Storage</MeterLabel>
	 *   <MeterValue>3.2 of 5 GB</MeterValue>
	 *   <Meter value={3.2} max={5} low={3} high={4.5} optimum={0} aria-valuetext="3.2 of 5 GB" />
	 * </MeterField>
	 */
	let {
		ref = $bindable(null),
		class: className,
		value = 0,
		min = 0,
		max = 100,
		low,
		high,
		optimum,
		size = 'default',
		...restProps
	}: WithoutChildrenOrChild<MeterPrimitive.RootProps> & {
		/** The upper end of the low region (default: `min`). */
		low?: number;
		/** The lower end of the high region (default: `max`). */
		high?: number;
		/** The best value; its region is the good one (default: the middle of the range). */
		optimum?: number;
		size?: MeterSize;
	} = $props();

	const field = useMeterFieldContext();
	const tone = $derived(meterTone(value, min, max, low, high, optimum));
	const percent = $derived(max <= min ? 0 : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)));
</script>

<MeterPrimitive.Root
	bind:ref
	data-slot="meter"
	data-size={size}
	data-tone={tone}
	{value}
	{min}
	{max}
	aria-labelledby={restProps['aria-label'] ? undefined : field?.labelId}
	aria-describedby={field?.hasValue ? field.valueId : undefined}
	class={cn(meterVariants({ size }), className)}
	{...restProps}
>
	<span
		data-slot="meter-indicator"
		class={cn(
			'absolute inset-y-0 left-0 w-full rounded-full bg-(--meter-fill)',
			'transition-[translate,background-color] duration-(--dur-base) ease-(--ease-settle)'
		)}
		style:translate={`${percent - 100}% 0`}
	></span>
</MeterPrimitive.Root>
