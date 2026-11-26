<script lang="ts">
	import { Meter, MeterField, MeterLabel, MeterValue } from '#lib/registry/ui/meter/index.js';
</script>

<MeterField>
	<MeterLabel>Storage</MeterLabel>
	<MeterValue>3.2 of 5 GB</MeterValue>
	<Meter value={3.2} max={5} aria-valuetext="3.2 of 5 GB" />
</MeterField>
