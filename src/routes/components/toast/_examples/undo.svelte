<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Toaster, createToaster } from '#lib/registry/ui/toast/index.js';

	const queue = createToaster();
	let status = $state('Nothing archived yet');

	function archive() {
		queue.toast({
			verb: 'Archived',
			title: 'Q3 report',
			action: { label: 'Undo', onClick: () => (status = 'Restored') },
			// The window is over: commit, whatever made it end, unless it was the undo.
			onDismiss: (reason) => {
				if (reason !== 'action') status = `Archived for good, on ${reason}`;
			}
		});
	}
</script>

<div class="flex w-full max-w-sm flex-col gap-3 pt-20">
	<div class="relative">
		<Toaster toaster={queue} aria-label="Notifications" />
		<div class="bg-muted relative z-10 flex justify-center py-1">
			<Button variant="outline" onclick={archive}>Archive</Button>
		</div>
	</div>
	<p class="text-muted-foreground text-center font-mono text-xs">{status}</p>
</div>
