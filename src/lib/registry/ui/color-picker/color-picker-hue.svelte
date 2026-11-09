<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { gamutMap, hsvToRgb, oklchToRgb, toHex } from './color.js';
	import { getColorPicker } from './context.svelte.js';
	import Channel, { channelStops } from './color-picker-channel.svelte';

	/**
	 * ColorPickerHue: the hue slider (bits-ui Slider, 0-360 degrees): a 32px pill track painted with
	 * every hue, the thumb inside it. Its hue is the root's `space`: HSV's rainbow, or OKLCH's
	 * even-lightness ring (each hue at the same perceived lightness, brought into sRGB).
	 *
	 * Keyboard: arrows step 1 degree, Shift + arrows and Page Up / Down 15, Home / End the ends; no
	 * step is animated. Inside a vaul drawer it never starts the drag.
	 *
	 * Name it (`aria-label` or `aria-labelledby`); `getValueText` gives its `aria-valuetext`
	 * ("Hue 210 degrees").
	 *
	 * @example
	 * <ColorPickerHue aria-label="Hue" getValueText={(h) => `${h} degrees`} />
	 */
	let {
		ref = $bindable(null),
		class: className,
		getValueText,
		...restProps
	}: {
		ref?: HTMLElement | null;
		class?: string;
		/** The hue in words for assistive tech (`aria-valuetext`). */
		getValueText?: (hue: number) => string;
		'aria-label'?: string;
		'aria-labelledby'?: string;
		'aria-describedby'?: string;
	} = $props();

	const picker = getColorPicker('ColorPickerHue');
	const hue = $derived(Math.round(picker.space === 'oklch' ? picker.oklch.h : picker.hsv.h));

	// Thirteen stops (every 30°) read as a smooth ring; OKLCH's at a mid lightness and chroma.
	const STOPS = Array.from({ length: 13 }, (_, i) => i * 30);
	const hsvTrack = `linear-gradient(to right, ${channelStops(
		STOPS.map((h) => [toHex(hsvToRgb({ h, s: 1, v: 1, a: 1 })), h / 360])
	)})`;
	const oklchTrack = `linear-gradient(to right, ${channelStops(
		STOPS.map((h) => [toHex(oklchToRgb(gamutMap({ l: 0.72, c: 0.15, h, a: 1 }))), h / 360])
	)})`;

	function set(h: number) {
		if (picker.space === 'oklch') picker.setOklch({ h });
		else picker.setHsv({ h });
	}
</script>

<Channel
	bind:ref
	part="color-picker-hue"
	class={cn(className)}
	value={hue}
	min={0}
	max={360}
	step={1}
	bigStep={15}
	track={picker.space === 'oklch' ? oklchTrack : hsvTrack}
	disabled={picker.disabled}
	onValue={set}
	onCommit={() => picker.commit()}
	{getValueText}
	{...restProps}
/>
