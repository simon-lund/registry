<script lang="ts" module>
	/*
	 * The channel sliders' look: a 32px pill track painted by the colour, a 22 x 30 thumb inside it.
	 * `--channel-thumb` is the thumb's length along the track; bits-ui keeps the thumb's centre
	 * half of it inside each end, so the gradient's stops sit on that same run.
	 */
	export const CHANNEL_THUMB = 'calc(var(--spacing) * 7.5)';

	/** CSS gradient stops placed on the thumb's run: `[colour, 0-1][]` to `c calc(...), ...`. */
	export function channelStops(stops: [string, number][]): string {
		return stops
			.map(([c, t]) => `${c} calc(var(--channel-thumb) / 2 + (100% - var(--channel-thumb)) * ${t})`)
			.join(', ');
	}
</script>

<script lang="ts">
	import { Slider as SliderPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';
	import { COLOR_HAIRLINE, HIT_AREA } from './look.js';

	// File-local: the shared body of ColorPickerHue and ColorPickerAlpha (bits-ui Slider).
	let {
		ref = $bindable(null),
		class: className,
		part,
		value,
		min,
		max,
		step,
		bigStep,
		track,
		disabled,
		onValue,
		onCommit,
		getValueText,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		'aria-describedby': ariaDescribedby
	}: {
		ref?: HTMLElement | null;
		class?: string;
		part: string;
		value: number;
		min: number;
		max: number;
		step: number;
		bigStep: number;
		/** The track's CSS background (gradients, a checkerboard). */
		track: string;
		disabled: boolean;
		onValue: (value: number) => void;
		onCommit: () => void;
		getValueText?: (value: number) => string;
		'aria-label'?: string;
		'aria-labelledby'?: string;
		'aria-describedby'?: string;
	} = $props();

	// Shift + arrows and Page Up / Down: bits-ui steps by `step` only, so the big step is ours.
	function onkeydown(e: KeyboardEvent) {
		const dir: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 };
		let delta = 0;
		if (e.shiftKey && dir[e.key]) delta = dir[e.key] * bigStep;
		else if (e.key === 'PageUp') delta = bigStep;
		else if (e.key === 'PageDown') delta = -bigStep;
		else return;
		e.preventDefault();
		e.stopPropagation();
		onValue(Math.min(max, Math.max(min, Math.round((value + delta) / step) * step)));
		onCommit();
	}
</script>

<SliderPrimitive.Root
	bind:ref
	type="single"
	bind:value={() => value, (v: number) => onValue(v)}
	onValueCommit={onCommit}
	{min}
	{max}
	{step}
	{disabled}
	data-slot={part}
	data-vaul-no-drag=""
	onkeydowncapture={onkeydown}
	style="--channel-thumb: {CHANNEL_THUMB}"
	class={cn(
		'group/channel relative flex h-11 w-full touch-none items-center select-none',
		'data-disabled:cursor-not-allowed data-disabled:opacity-50',
		className
	)}
>
	<span
		data-slot="{part}-track"
		aria-hidden="true"
		class={cn('relative h-8 w-full overflow-hidden rounded-full', COLOR_HAIRLINE)}
		style:background={track}
	></span>
	<SliderPrimitive.Thumb
		index={0}
		data-slot="{part}-thumb"
		aria-label={ariaLabel}
		aria-labelledby={ariaLabelledby}
		aria-describedby={ariaDescribedby}
		class={cn(
			'group/thumb relative block h-8 w-7.5 shrink-0 cursor-grab rounded-[calc(var(--spacing)*2.25)] outline-none',
			'active:cursor-grabbing data-active:cursor-grabbing group-data-disabled/channel:pointer-events-none',
			HIT_AREA
		)}
	>
		{#snippet child({ props })}
			<span {...props} aria-valuetext={getValueText?.(value)}>
				<!-- The thumb: light in both themes, a hairline so it reads on a pale track; held, it gives a little. -->
				<span
					aria-hidden="true"
					class={cn(
						'pointer-events-none absolute inset-x-1 inset-y-px rounded-[calc(var(--spacing)*2)]',
						'bg-card ring-input ring-1 dark:bg-foreground',
						'outline-2 outline-offset-2 outline-transparent group-focus-visible/thumb:outline-ring',
						'transition-[scale] duration-(--dur-quick) ease-(--ease-settle)',
						'group-active/thumb:duration-(--dur-press) group-data-active/thumb:duration-(--dur-press)',
						'motion-safe:group-active/thumb:scale-[0.97] motion-safe:group-data-active/thumb:scale-[0.97]'
					)}
				></span>
			</span>
		{/snippet}
	</SliderPrimitive.Thumb>
</SliderPrimitive.Root>
