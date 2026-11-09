<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Switch } from '#lib/registry/ui/switch/index.js';

	let digest = $state(true);
	let sent = $state('nothing yet');

	function onsubmit(e: SubmitEvent & { currentTarget: HTMLFormElement }) {
		e.preventDefault();
		const entries = [...new FormData(e.currentTarget)].map(([key, value]) => `${key}=${value}`);
		sent = entries.join(', ') || 'nothing';
	}
</script>

<form {onsubmit} class="flex w-full max-w-xs flex-col gap-4">
	<div class="flex items-center justify-between gap-4">
		<label for="digest" class="text-sm">Weekly digest</label>
		<Switch id="digest" name="digest" bind:checked={digest} />
	</div>
	<div class="flex gap-2">
		<Button type="submit" size="sm">Save</Button>
		<Button type="reset" size="sm" variant="outline">Reset</Button>
	</div>
	<p class="text-muted-foreground font-mono text-xs">sent: {sent}</p>
</form>
