<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Toaster, createToaster } from '#lib/registry/ui/toast/index.js';

	const queue = createToaster();
	let running = $state<number | null>(null);

	function start() {
		running = queue.toast({ verb: 'Exporting', title: 'Q3 report', duration: null });
	}

	function finish() {
		if (running === null) return;
		queue.dismiss(running);
		running = null;
		queue.toast({ verb: 'Exported', title: 'Q3 report' });
	}
</script>

<div class="w-full max-w-sm pt-20">
	<div class="relative">
		<Toaster toaster={queue} aria-label="Notifications" />
		<div class="bg-muted relative z-10 flex justify-center py-1">
			{#if running === null}
				<Button variant="outline" onclick={start}>Start export</Button>
			{:else}
				<Button variant="outline" onclick={finish}>Finish export</Button>
			{/if}
		</div>
	</div>
</div>
