<script lang="ts">
	import {
		ColorPicker,
		ColorPickerArea,
		ColorPickerHue,
		ColorPickerInput
	} from '#lib/registry/ui/color-picker/index.js';

	let value = $state('#2f6f8f');
</script>

<ColorPicker bind:value>
	<ColorPickerArea aria-label="Colour" channelLabels={['Saturation', 'Brightness']} />
	<ColorPickerHue aria-label="Hue" />
	<ColorPickerInput aria-label="Hex value" />
</ColorPicker>
