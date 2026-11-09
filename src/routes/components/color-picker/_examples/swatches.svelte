<script lang="ts">
	import { ColorPicker, ColorPickerSwatches, ColorPickerSwatch } from '#lib/registry/ui/color-picker/index.js';

	const palette = [
		{ name: 'Lake', value: '#2f6f8f' },
		{ name: 'Rust', value: '#c2552d' },
		{ name: 'Moss', value: '#5f7a3a' },
		{ name: 'Sand', value: '#d9c7a0' },
		{ name: 'Plum', value: '#5a2e4e' },
		{ name: 'Slate', value: '#3d4654' }
	];

	let value = $state('#5f7a3a');
	const name = $derived(palette.find((colour) => colour.value === value)?.name);
</script>

<div class="flex flex-col items-center gap-3">
	<p id="label-colour" class="text-muted-foreground text-sm">Label colour</p>
	<ColorPicker bind:value>
		<ColorPickerSwatches aria-labelledby="label-colour" class="grid grid-cols-6 gap-2">
			{#each palette as colour (colour.value)}
				<ColorPickerSwatch value={colour.value} aria-label={colour.name} />
			{/each}
		</ColorPickerSwatches>
	</ColorPicker>
	<p class="text-muted-foreground font-mono text-xs">value: {value} ({name})</p>
</div>
