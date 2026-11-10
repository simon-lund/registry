<script lang="ts">
	import {
		ColorPicker,
		ColorPickerSwatch,
		ColorPickerInput
	} from '#lib/registry/ui/color-picker/index.js';

	let value = $state('#c2552d');
	let invalid = $state(false);
</script>

<div class="flex w-full max-w-64 flex-col gap-3">
	<ColorPicker bind:value aria-label="Label colour">
		<ColorPickerSwatch value="#2f6f8f" aria-label="Lake" />
		<ColorPickerSwatch value="#c2552d" aria-label="Rust" />
		<ColorPickerSwatch value="#5f7a3a" aria-label="Moss" />
		<ColorPickerSwatch value="#5a2e4e" aria-label="Plum" />
	</ColorPicker>
	<ColorPickerInput bind:value bind:invalid aria-label="Hex value" aria-describedby="hex-message" />
	<p id="hex-message" class="m-0 min-h-5 text-sm {invalid ? 'text-destructive' : 'text-muted-foreground'}">
		{invalid ? 'Enter a hex value, like #3a7bd5.' : 'Or type any colour as hex.'}
	</p>
</div>
