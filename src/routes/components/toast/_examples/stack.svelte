<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Toaster, createToaster } from '#lib/registry/ui/toast/index.js';

	const queue = createToaster({ limit: 3 });
	let count = 0;

	function upload() {
		count += 1;
		queue.toast({ verb: 'Uploaded', title: `Photo ${count}`, duration: 8000 });
	}
</script>

<div class="w-full max-w-sm pt-36">
	<div class="relative">
		<Toaster toaster={queue} aria-label="Notifications" />
		<div class="bg-muted relative z-10 flex justify-center gap-2 py-1">
			<Button variant="outline" onclick={upload}>Upload</Button>
			<Button variant="ghost" onclick={() => queue.dismiss()}>Clear all</Button>
		</div>
	</div>
</div>
