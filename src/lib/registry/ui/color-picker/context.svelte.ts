import { getContext, hasContext, setContext } from 'svelte';
import {
	formatColor,
	gamutMap,
	hsvToRgb,
	oklchToRgb,
	parseColor,
	rgbToHsv,
	rgbToOklch,
	toHex,
	type ColorFormat,
	type ColorSpace,
	type Hsv,
	type Oklch,
	type Rgb
} from './color.js';

// Shared between the ColorPicker and its parts. Not exported from index.ts: the parts are the API.

type Options = {
	readonly format: ColorFormat;
	readonly alpha: boolean;
	readonly space: ColorSpace;
	readonly disabled: boolean;
	/** Writes the formatted colour into the root's `value`. */
	emit: (value: string) => void;
	commit: (value: string) => void;
};

const BLACK: Rgb = { r: 0, g: 0, b: 0, a: 1 };

/*
 * The model: the colour as sRGB plus its HSV and OKLCH readings, kept together. Each reading
 * remembers what the other cannot say: a grey has no hue and black no saturation, so a move
 * through them keeps the last hue (and saturation) instead of snapping to 0. OKLCH keeps the
 * chroma that was asked for; the colour shown is that chroma brought into sRGB, so sweeping the
 * hue past a narrow part of the gamut does not wear the chroma down.
 */
export class ColorPickerState {
	rgb = $state<Rgb>(BLACK);
	hsv = $state<Hsv>({ h: 0, s: 0, v: 0, a: 1 });
	oklch = $state<Oklch>({ l: 0, c: 0, h: 0, a: 1 });
	/** The OKLCH colour actually shown (the asked-for chroma, brought into sRGB). */
	shown = $derived(gamutMap(this.oklch));
	/** The colour for painting a preview (alpha included). */
	css = $derived(formatColor(this.rgb, 'rgb', true));
	/** The colour without its alpha (a thumb's fill, a gradient's end). */
	opaque = $derived(formatColor({ ...this.rgb, a: 1 }, 'rgb'));

	#lastEmitted: string | undefined;
	readonly opts: Options;

	constructor(opts: Options) {
		this.opts = opts;
	}

	get format() {
		return this.opts.format;
	}
	get alpha() {
		return this.opts.alpha;
	}
	get space() {
		return this.opts.space;
	}
	get disabled() {
		return this.opts.disabled;
	}
	/** `#rrggbb`, or `#rrggbbaa` with alpha on and a colour that is not opaque. */
	get hex() {
		return toHex(this.rgb, this.opts.alpha);
	}

	// A value from outside: read it unless it is the one we just wrote (that would lose the hue of
	// a grey and the floats behind the 8-bit string). Unreadable values leave the model as it is.
	receive(value: string | undefined) {
		if (value === this.#lastEmitted) return;
		const rgb = parseColor(value);
		if (!rgb) return;
		this.#setRgb(this.opts.alpha ? rgb : { ...rgb, a: 1 });
	}

	/** Set from a finished colour (a swatch, the field, the pipette). */
	setRgb(rgb: Rgb) {
		this.#setRgb(this.opts.alpha ? rgb : { ...rgb, a: 1 });
		this.#emit();
	}

	setHsv(next: Partial<Omit<Hsv, 'a'>>) {
		this.hsv = { ...this.hsv, ...next };
		this.rgb = hsvToRgb(this.hsv);
		this.oklch = keepHue(rgbToOklch(this.rgb), this.oklch);
		this.#emit();
	}

	setOklch(next: Partial<Omit<Oklch, 'a'>>) {
		this.oklch = { ...this.oklch, ...next };
		this.rgb = oklchToRgb(gamutMap(this.oklch));
		this.hsv = keepHsv(rgbToHsv(this.rgb), this.hsv);
		this.#emit();
	}

	setAlpha(a: number) {
		this.rgb = { ...this.rgb, a };
		this.hsv = { ...this.hsv, a };
		this.oklch = { ...this.oklch, a };
		this.#emit();
	}

	/** The end of a gesture (pointer up, a key step, a pick): the consumer's `onValueCommit`. */
	commit() {
		this.opts.commit(formatColor(this.rgb, this.opts.format, this.opts.alpha));
	}

	#setRgb(rgb: Rgb) {
		this.rgb = rgb;
		this.hsv = keepHsv(rgbToHsv(rgb), this.hsv);
		this.oklch = keepHue(rgbToOklch(rgb), this.oklch);
	}

	#emit() {
		const value = formatColor(this.rgb, this.opts.format, this.opts.alpha);
		this.#lastEmitted = value;
		this.opts.emit(value);
	}
}

// Grey has no hue, black no saturation: keep the previous ones.
function keepHsv(next: Hsv, prev: Hsv): Hsv {
	if (next.v < 1e-4) return { ...next, h: prev.h, s: prev.s };
	if (next.s < 1e-4) return { ...next, h: prev.h };
	return next;
}

function keepHue(next: Oklch, prev: Oklch): Oklch {
	return next.c < 2e-3 ? { ...next, h: prev.h } : next;
}

const KEY = Symbol('registry.color-picker');

export function setColorPicker(state: ColorPickerState) {
	setContext(KEY, state);
	return state;
}

export function getColorPicker(part: string): ColorPickerState {
	if (!hasContext(KEY)) throw new Error(`<${part}> must be used inside <ColorPicker>`);
	return getContext(KEY);
}
