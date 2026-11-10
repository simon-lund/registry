<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Checkbox } from '#lib/registry/ui/checkbox/index.js';

	let sent = $state('nothing yet');

	function onsubmit(e: SubmitEvent & { currentTarget: HTMLFormElement }) {
		e.preventDefault();
		const entries = [...new FormData(e.currentTarget)].map(([key, value]) => `${key}=${value}`);
		sent = entries.join(', ') || 'nothing';
	}
</script>

<form {onsubmit} class="flex w-full max-w-xs flex-col gap-4">
	<label class="flex cursor-pointer items-center gap-2 text-sm">
		<Checkbox name="newsletter" />
		Send me the newsletter
	</label>
	<div class="flex gap-2">
		<Button type="submit" size="sm">Save</Button>
		<Button type="reset" size="sm" variant="outline">Reset</Button>
	</div>
	<p class="text-muted-foreground m-0 font-mono text-xs">sent: {sent}</p>
</form>
