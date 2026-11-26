<script lang="ts">
	import { Meter, MeterField, MeterLabel, MeterValue } from '#lib/registry/ui/meter/index.js';

	// low 3, high 4.5, optimum 0: up to 3 is good, up to 4.5 is one region away, past it two
	const rows = [
		{ label: 'Plenty left', value: 2 },
		{ label: 'Getting full', value: 4 },
		{ label: 'Nearly out', value: 4.8 }
	];
</script>

<div class="flex w-full max-w-sm flex-col gap-5">
	{#each rows as row (row.label)}
		<MeterField>
			<MeterLabel>{row.label}</MeterLabel>
			<MeterValue>{row.value} of 5 GB</MeterValue>
			<Meter value={row.value} max={5} low={3} high={4.5} optimum={0} aria-valuetext="{row.value} of 5 GB" />
		</MeterField>
	{/each}
</div>
