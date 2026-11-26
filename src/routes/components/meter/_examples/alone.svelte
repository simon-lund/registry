<script lang="ts">
	import { Meter } from '#lib/registry/ui/meter/index.js';
</script>

<!-- a line under a row: no field, so the Meter carries its own name -->
<div class="flex w-full max-w-sm flex-col gap-2">
	<div class="flex items-baseline justify-between text-sm">
		<span>Battery</span>
		<span class="text-muted-foreground tabular-nums">72 %</span>
	</div>
	<Meter size="sm" value={72} low={20} optimum={100} aria-label="Battery" aria-valuetext="72 percent" />
</div>
