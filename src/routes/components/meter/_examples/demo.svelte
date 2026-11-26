<script lang="ts">
	import { Meter, MeterField, MeterLabel, MeterValue } from '#lib/registry/ui/meter/index.js';
	import { Button } from '#lib/registry/ui/button/index.js';

	let used = $state(2.4);
	const words = $derived(`${used.toFixed(1)} of 5 GB`);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
	<MeterField>
		<MeterLabel>Storage</MeterLabel>
		<MeterValue>{words}</MeterValue>
		<Meter value={used} max={5} low={3} high={4.5} optimum={0} aria-valuetext={words} />
	</MeterField>
	<div class="flex gap-2">
		<Button size="sm" variant="outline" onclick={() => (used = Math.max(0, +(used - 0.8).toFixed(1)))}>Less</Button>
		<Button size="sm" variant="outline" onclick={() => (used = Math.min(5, +(used + 0.8).toFixed(1)))}>More</Button>
	</div>
</div>
