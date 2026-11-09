<script lang="ts">
	import {
		ColorPicker,
		ColorPickerArea,
		ColorPickerHue,
		ColorPickerAlpha,
		ColorPickerInput,
		ColorPickerSwatches,
		ColorPickerSwatch
	} from '#lib/registry/ui/color-picker/index.js';

	const washes = [
		{ name: 'Lake, half', value: '#2f6f8f80' },
		{ name: 'Rust, light', value: '#c2552d4d' },
		{ name: 'Plum, strong', value: '#5a2e4ecc' },
		{ name: 'Slate, veil', value: '#3d465433' }
	];

	let value = $state('rgb(47 111 143 / 0.6)');
</script>

<div class="flex w-full max-w-72 flex-col gap-2">
	<ColorPicker bind:value alpha format="rgb">
		<ColorPickerArea
			aria-label="Colour"
			channelLabels={['Saturation', 'Brightness']}
			getValueText={({ x, y }) => `Saturation ${x} %, brightness ${y} %`}
		/>
		<ColorPickerHue aria-label="Hue" getValueText={(h) => `${h} degrees`} />
		<ColorPickerAlpha aria-label="Opacity" getValueText={(a) => `${a} % opacity`} />
		<ColorPickerInput aria-label="Hex value" />
		<ColorPickerSwatches aria-label="Washes" class="mt-2">
			{#each washes as wash (wash.value)}
				<ColorPickerSwatch value={wash.value} aria-label={wash.name} />
			{/each}
		</ColorPickerSwatches>
	</ColorPicker>
	<p class="text-muted-foreground mt-2 font-mono text-xs">value: {value}</p>
</div>
