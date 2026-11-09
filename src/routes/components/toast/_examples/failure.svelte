<script lang="ts">
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Middot } from '#lib/registry/ui/middot/index.js';
	import {
		Toaster,
		ToastAction,
		ToastMessage,
		ToastProgress,
		ToastVerb,
		createToaster
	} from '#lib/registry/ui/toast/index.js';

	const queue = createToaster();
	let attempts = 0;

	function save() {
		attempts += 1;
		queue.toast({
			verb: 'Not saved',
			title: `No connection, attempt ${attempts}`,
			action: { label: 'Retry', onClick: save }
		});
	}
</script>

<div class="w-full max-w-sm pt-20">
	<div class="relative">
		<Toaster toaster={queue} aria-label="Notifications">
			{#snippet children(t)}
				<CircleAlertIcon class="text-destructive" aria-hidden="true" />
				<ToastMessage><ToastVerb>{t.verb}</ToastVerb><Middot />{t.title}</ToastMessage>
				{#if t.action}
					<ToastAction onclick={() => queue.act(t.id)}>{t.action.label}</ToastAction>
					<ToastProgress />
				{/if}
			{/snippet}
		</Toaster>
		<div class="bg-muted relative z-10 flex justify-center py-1">
			<Button variant="outline" onclick={save}>Save</Button>
		</div>
	</div>
</div>
