<script lang="ts">
	import { ColorPicker, ColorPickerSwatch } from '#lib/registry/ui/color-picker/index.js';

	let value = $state('#2f6f8f');
</script>

<ColorPicker bind:value aria-label="Label colour">
	<ColorPickerSwatch value="#2f6f8f" aria-label="Lake" />
	<ColorPickerSwatch value="#c2552d" aria-label="Rust" />
	<ColorPickerSwatch value="#5f7a3a" aria-label="Moss" />
</ColorPicker>
