<script lang="ts">
	import { Meter } from '#lib/registry/ui/meter/index.js';
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
	<Meter value={60} aria-label="Default" aria-valuetext="60 percent" />
	<Meter size="sm" value={60} aria-label="Small" aria-valuetext="60 percent" />
</div>
