<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Toaster, createToaster } from '#lib/registry/ui/toast/index.js';

	const queue = createToaster();
</script>

<div class="w-full max-w-sm pt-20">
	<div class="relative">
		<Toaster toaster={queue} aria-label="Notifications" />
		<div class="bg-muted relative z-10 flex justify-center py-1">
			<Button variant="outline" onclick={() => queue.toast({ verb: 'Saved', title: 'Project brief' })}>
				Save
			</Button>
		</div>
	</div>
</div>
