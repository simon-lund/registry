<script lang="ts">
	import { ColorPicker, ColorPickerArea, ColorPickerHue } from '#lib/registry/ui/color-picker/index.js';

	let value = $state('oklch(50% 0.08 230)');
</script>

<div class="flex w-full max-w-72 flex-col gap-2">
	<ColorPicker bind:value format="oklch">
		<ColorPickerArea
			aria-label="Colour"
			channelLabels={['Saturation', 'Brightness']}
			getValueText={({ x, y }) => `Saturation ${x} %, brightness ${y} %`}
		/>
		<ColorPickerHue aria-label="Hue" getValueText={(h) => `${h} degrees`} />
	</ColorPicker>
	<p class="text-muted-foreground font-mono text-xs">value: {value}</p>
</div>
