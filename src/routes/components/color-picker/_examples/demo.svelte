<script lang="ts">
	import {
		ColorPicker,
		ColorPickerArea,
		ColorPickerHue,
		ColorPickerInput,
		ColorPickerEyeDropper,
		ColorPickerSwatches,
		ColorPickerSwatch
	} from '#lib/registry/ui/color-picker/index.js';

	const presets = [
		{ name: 'Lake', value: '#2f6f8f' },
		{ name: 'Rust', value: '#c2552d' },
		{ name: 'Moss', value: '#5f7a3a' },
		{ name: 'Sand', value: '#d9c7a0' },
		{ name: 'Plum', value: '#5a2e4e' },
		{ name: 'Slate', value: '#3d4654' }
	];

	let value = $state('#2f6f8f');
</script>

<div class="flex w-full max-w-72 flex-col gap-2">
	<ColorPicker bind:value>
		<ColorPickerArea
			aria-label="Colour"
			channelLabels={['Saturation', 'Brightness']}
			getValueText={({ x, y }) => `Saturation ${x} %, brightness ${y} %`}
		/>
		<ColorPickerHue aria-label="Hue" getValueText={(h) => `${h} degrees`} />
		<div class="flex items-center gap-2">
			<ColorPickerInput aria-label="Hex value" class="flex-1" />
			<ColorPickerEyeDropper aria-label="Pick a colour from the screen" />
		</div>
		<ColorPickerSwatches aria-label="Presets" class="mt-2">
			{#each presets as preset (preset.value)}
				<ColorPickerSwatch value={preset.value} aria-label={preset.name} />
			{/each}
		</ColorPickerSwatches>
	</ColorPicker>
	<p class="text-muted-foreground mt-2 font-mono text-xs">value: {value}</p>
</div>
