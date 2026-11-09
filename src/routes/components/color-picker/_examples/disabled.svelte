<script lang="ts">
	import {
		ColorPicker,
		ColorPickerArea,
		ColorPickerHue,
		ColorPickerInput,
		ColorPickerEyeDropper,
		ColorPickerSwatches,
		ColorPickerSwatch,
		ColorPickerTrigger
	} from '#lib/registry/ui/color-picker/index.js';
</script>

<div class="flex w-full max-w-72 flex-col gap-2">
	<ColorPicker value="#5a2e4e" disabled>
		<ColorPickerArea aria-label="Colour" channelLabels={['Saturation', 'Brightness']} />
		<ColorPickerHue aria-label="Hue" />
		<div class="flex items-center gap-2">
			<ColorPickerInput aria-label="Hex value" class="flex-1" />
			<ColorPickerEyeDropper aria-label="Pick a colour from the screen" />
			<ColorPickerTrigger aria-label="Colour" />
		</div>
		<ColorPickerSwatches aria-label="Presets" class="mt-2">
			<ColorPickerSwatch value="#5a2e4e" aria-label="Plum" />
			<ColorPickerSwatch value="#2f6f8f" aria-label="Lake" />
			<ColorPickerSwatch value="#c2552d" aria-label="Rust" />
		</ColorPickerSwatches>
	</ColorPicker>
</div>
