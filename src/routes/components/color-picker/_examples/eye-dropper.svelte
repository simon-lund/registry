<script lang="ts">
	import { ColorPicker, ColorPickerInput, ColorPickerEyeDropper } from '#lib/registry/ui/color-picker/index.js';

	let value = $state('#5f7a3a');
</script>

<div class="flex w-full max-w-56 items-center gap-2">
	<ColorPicker bind:value>
		<ColorPickerInput aria-label="Hex value" class="flex-1" />
		<ColorPickerEyeDropper aria-label="Pick a colour from the screen" />
	</ColorPicker>
</div>
