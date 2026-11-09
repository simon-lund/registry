<script lang="ts">
	import { ColorPicker, ColorPickerInput } from '#lib/registry/ui/color-picker/index.js';

	let value = $state('#2f6f8f');
	let invalid = $state(false);
</script>

<div class="flex w-full max-w-56 flex-col gap-1.5">
	<ColorPicker bind:value>
		<ColorPickerInput aria-label="Hex value" bind:invalid aria-describedby="hex-message" />
	</ColorPicker>
	<p id="hex-message" class="text-xs {invalid ? 'text-destructive' : 'text-muted-foreground'}">
		{invalid ? 'Enter a hex value, like #3a7bd5.' : 'Hex, rgb(), hsl() or oklch().'}
	</p>
</div>
