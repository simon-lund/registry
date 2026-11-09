import Root from './color-picker.svelte';
import Area from './color-picker-area.svelte';
import Hue from './color-picker-hue.svelte';
import Alpha from './color-picker-alpha.svelte';
import Swatches from './color-picker-swatches.svelte';
import Swatch from './color-picker-swatch.svelte';
import Input from './color-picker-input.svelte';
import EyeDropper from './color-picker-eye-dropper.svelte';
import Trigger from './color-picker-trigger.svelte';

export {
	Root,
	Area,
	Hue,
	Alpha,
	Swatches,
	Swatch,
	Input,
	EyeDropper,
	Trigger,
	//
	Root as ColorPicker,
	Area as ColorPickerArea,
	Hue as ColorPickerHue,
	Alpha as ColorPickerAlpha,
	Swatches as ColorPickerSwatches,
	Swatch as ColorPickerSwatch,
	Input as ColorPickerInput,
	EyeDropper as ColorPickerEyeDropper,
	Trigger as ColorPickerTrigger
};

export {
	parseColor,
	formatColor,
	toHex,
	rgbToHsv,
	hsvToRgb,
	rgbToHsl,
	hslToRgb,
	rgbToOklch,
	oklchToRgb,
	gamutMap,
	inGamut,
	maxChroma,
	sameColor,
	type Rgb,
	type Hsv,
	type Hsl,
	type Oklch,
	type ColorFormat,
	type ColorSpace
} from './color.js';
