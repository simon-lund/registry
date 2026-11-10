<script lang="ts">
	import { ColorPicker, ColorPickerSwatch } from '#lib/registry/ui/color-picker/index.js';

	const colours = [
		{ name: 'Lake', value: '#2f6f8f' },
		{ name: 'Rust', value: '#c2552d' },
		{ name: 'Moss', value: '#5f7a3a' },
		{ name: 'Sand', value: '#d9c7a0' },
		{ name: 'Plum', value: '#5a2e4e' },
		{ name: 'Slate', value: '#3d4654' }
	];

	let value = $state('#2f6f8f');
	const name = $derived(colours.find((colour) => colour.value === value)?.name);
</script>

<div class="flex w-full max-w-xs flex-col items-center gap-3">
	<p id="label-colour" class="text-muted-foreground m-0 text-sm">Label colour</p>
	<ColorPicker bind:value aria-labelledby="label-colour">
		{#each colours as colour (colour.value)}
			<ColorPickerSwatch value={colour.value} aria-label={colour.name} />
		{/each}
	</ColorPicker>
	<p class="text-muted-foreground m-0 font-mono text-xs">value: {value} ({name})</p>
</div>
