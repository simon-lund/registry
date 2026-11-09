<script lang="ts">
	import {
		ColorPicker,
		ColorPickerHue,
		ColorPickerAlpha,
		ColorPickerInput
	} from '#lib/registry/ui/color-picker/index.js';

	let value = $state('#c2552dcc');
</script>

<div class="flex w-full max-w-72 flex-col gap-2">
	<ColorPicker bind:value alpha>
		<ColorPickerHue aria-label="Hue" getValueText={(h) => `${h} degrees`} />
		<ColorPickerAlpha aria-label="Opacity" getValueText={(a) => `${a} % opacity`} />
		<ColorPickerInput aria-label="Hex value" />
	</ColorPicker>
</div>
