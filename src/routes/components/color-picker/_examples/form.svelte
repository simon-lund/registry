<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { ColorPicker, ColorPickerSwatch } from '#lib/registry/ui/color-picker/index.js';

	let sent = $state('nothing yet');

	function onsubmit(e: SubmitEvent & { currentTarget: HTMLFormElement }) {
		e.preventDefault();
		const entries = [...new FormData(e.currentTarget)].map(([key, value]) => `${key}=${value}`);
		sent = entries.join(', ') || 'nothing';
	}
</script>

<form {onsubmit} class="flex w-full max-w-xs flex-col items-center gap-3">
	<ColorPicker name="colour" required aria-label="Label colour">
		<ColorPickerSwatch value="#2f6f8f" aria-label="Lake" />
		<ColorPickerSwatch value="#c2552d" aria-label="Rust" />
		<ColorPickerSwatch value="#5f7a3a" aria-label="Moss" />
	</ColorPicker>
	<Button type="submit" size="sm">Save</Button>
	<p class="text-muted-foreground m-0 font-mono text-xs">sent: {sent}</p>
</form>
