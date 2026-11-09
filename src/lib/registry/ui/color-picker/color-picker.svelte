<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import type { ColorFormat, ColorSpace } from './color.js';
	import { ColorPickerState, setColorPicker } from './context.svelte.js';

	/**
	 * ColorPicker: picks a colour, from its own maths (no colour library). Renders nothing itself:
	 * it holds the colour and hands it to the parts, which you lay out:
	 * - ColorPickerArea, the 2D field (saturation x brightness, or chroma x lightness);
	 * - ColorPickerHue and ColorPickerAlpha, the channel sliders;
	 * - ColorPickerSwatches with a ColorPickerSwatch per preset;
	 * - ColorPickerInput, the hex field with a leading swatch;
	 * - ColorPickerEyeDropper, the pipette (where the browser has one);
	 * - ColorPickerTrigger, a button showing the colour, to open the picker in an overlay.
	 *
	 * `bind:value` is a CSS colour string. It reads hex (3, 4, 6 or 8 digits), `rgb()`, `hsl()` and
	 * `oklch()`; it writes `format` (`hex` default, `rgb`, `hsl`, `oklch`; a new format applies from
	 * the next change, the value is never rewritten on its own). With `alpha` the alpha is kept and
	 * written only while the colour is not opaque (`#rrggbbaa`, `rgb(... / 0.5)`); without it the
	 * colour is always opaque. An empty or unreadable value shows black until someone picks; the
	 * picker writes nothing until then.
	 *
	 * Inside it keeps the colour as HSV and as OKLCH, so moving through a grey or black keeps its
	 * hue, and its own written value is never read back. `space` picks the model the area and the
	 * hue work in: `hsv` (default, the familiar square) or `oklch` (perceptual: chroma across,
	 * lightness up; where sRGB ends the area shows the surface beneath, the gamut's own shape). It
	 * lives on the root so the area and the hue slider always agree.
	 *
	 * `onValueCommit` fires at the end of a gesture (pointer up, a key step, a pick, the field's
	 * Enter or blur), for saving; `bind:value` follows every move. `disabled` disables every part.
	 *
	 * @example
	 * <ColorPicker bind:value={colour}>
	 *   <div class="flex flex-col gap-3">
	 *     <ColorPickerArea aria-label="Colour" channelLabels={['Saturation', 'Brightness']} getValueText={({ x, y }) => `Saturation ${x} %, brightness ${y} %`} />
	 *     <ColorPickerHue aria-label="Hue" getValueText={(h) => `${h} degrees`} />
	 *     <ColorPickerInput aria-label="Hex value" />
	 *   </div>
	 * </ColorPicker>
	 */
	let {
		value = $bindable(),
		format = 'hex',
		alpha = false,
		space = 'hsv',
		disabled = false,
		onValueCommit,
		children
	}: {
		/** A CSS colour string (hex, rgb(), hsl(), oklch()). */
		value?: string;
		/** What the picker writes into `value`. */
		format?: ColorFormat;
		/** Keep and write the alpha (and offer ColorPickerAlpha). */
		alpha?: boolean;
		/** The model of the area and the hue slider. */
		space?: ColorSpace;
		disabled?: boolean;
		/** The end of a gesture, with the value written. */
		onValueCommit?: (value: string) => void;
		children?: Snippet;
	} = $props();

	const picker = setColorPicker(
		new ColorPickerState({
			get format() {
				return format;
			},
			get alpha() {
				return alpha;
			},
			get space() {
				return space;
			},
			get disabled() {
				return disabled;
			},
			emit: (next) => (value = next),
			commit: (next) => onValueCommit?.(next)
		})
	);

	// Read the value at once (the first paint shows it) and again whenever it changes from outside.
	picker.receive(untrack(() => value));
	$effect.pre(() => {
		const next = value;
		untrack(() => picker.receive(next));
	});
</script>

{@render children?.()}
