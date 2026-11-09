<script lang="ts">
	import { ColorPicker, ColorPickerArea, ColorPickerHue } from '#lib/registry/ui/color-picker/index.js';

	let value = $state('#5a2e4e');
	let saved = $state('#5a2e4e');
</script>

<div class="flex w-full max-w-72 flex-col gap-2">
	<ColorPicker bind:value onValueCommit={(next) => (saved = next)}>
		<ColorPickerArea aria-label="Colour" channelLabels={['Saturation', 'Brightness']} />
		<ColorPickerHue aria-label="Hue" />
	</ColorPicker>
	<p class="text-muted-foreground font-mono text-xs">value: {value}<br />saved: {saved}</p>
</div>
