<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Toaster, createToaster, type ToastDismissReason } from '#lib/registry/ui/toast/index.js';

	const queue = createToaster();
	let reason = $state<ToastDismissReason | null>(null);

	const onDismiss = (why: ToastDismissReason) => (reason = why);
	const restore = () => {}; // put the report back
</script>

<div class="flex w-full max-w-sm flex-col gap-3 pt-36">
	<div class="relative">
		<Toaster toaster={queue} aria-label="Notifications" />
		<!-- the bar sits above the stack, so a toast rises from behind it -->
		<div class="bg-muted relative z-10 flex flex-wrap justify-center gap-2 py-1">
			<Button variant="outline" onclick={() => queue.toast({ verb: 'Saved', title: 'Project brief', onDismiss })}>
				Save
			</Button>
			<Button
				variant="outline"
				onclick={() =>
					queue.toast({
						verb: 'Archived',
						title: 'Q3 report',
						action: { label: 'Undo', onClick: restore },
						onDismiss
					})}
			>
				Archive
			</Button>
			<Button
				variant="outline"
				onclick={() =>
					queue.toast({ variant: 'notice', verb: 'Offline', title: 'Changes will sync later', onDismiss })}
			>
				Go offline
			</Button>
		</div>
	</div>
	<p class="text-muted-foreground text-center font-mono text-xs">last dismissed: {reason ?? 'none yet'}</p>
</div>
