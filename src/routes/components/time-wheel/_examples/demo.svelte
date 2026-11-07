<script lang="ts">
	import { TimeWheel } from '#lib/registry/ui/time-wheel/index.js';

	let date = $state(new Date(2026, 10, 6, 9, 41));
	const time = $derived(date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
</script>

<div class="flex w-full flex-col items-center gap-4">
	<TimeWheel bind:date />
	<p class="text-muted-foreground m-0 font-mono text-sm">selected {time}</p>
</div>
