<script lang="ts">
	import { ColorPicker, ColorPickerArea, ColorPickerHue } from '#lib/registry/ui/color-picker/index.js';

	let value = $state('oklch(62% 0.12 200)');
</script>

<div class="flex w-full max-w-72 flex-col gap-2">
	<ColorPicker bind:value space="oklch" format="oklch">
		<ColorPickerArea
			aria-label="Colour"
			channelLabels={['Chroma', 'Lightness']}
			getValueText={({ x, y }) => `Chroma ${x}, lightness ${y} %`}
		/>
		<ColorPickerHue aria-label="Hue" getValueText={(h) => `${h} degrees`} />
	</ColorPicker>
	<p class="text-muted-foreground font-mono text-xs">value: {value}</p>
</div>
