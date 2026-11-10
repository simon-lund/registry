<script lang="ts">
	import { ColorPicker, ColorPickerSwatch } from '#lib/registry/ui/color-picker/index.js';

	const colours = ['#2f6f8f', '#c2552d', '#5f7a3a', '#d9c7a0', '#5a2e4e', '#3d4654', '#f4efe6', '#1a1917'];
	const names = ['Lake', 'Rust', 'Moss', 'Sand', 'Plum', 'Slate', 'Chalk', 'Ink'];

	let value = $state('#f4efe6');
</script>

<ColorPicker bind:value aria-label="Card colour" class="grid grid-cols-4 gap-2">
	{#each colours as colour, i (colour)}
		<ColorPickerSwatch value={colour} aria-label={names[i]} />
	{/each}
</ColorPicker>
