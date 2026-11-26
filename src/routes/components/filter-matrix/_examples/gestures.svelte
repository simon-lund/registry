<script lang="ts">
	import { FilterMatrix } from '#lib/registry/ui/filter-matrix/index.js';
	import { areas, countTasks, describe, statuses, tasks } from './tasks.js';

	let value = $state<string[]>(['work|open', 'home|open']);
	const counts = countTasks(tasks);
</script>

<div class="flex w-full max-w-sm flex-col gap-3 [--filter-ground:var(--muted)]">
	<FilterMatrix rows={areas} columns={statuses} {counts} bind:value cellLabel={describe} aria-label="Filter tasks" />
	<p class="text-muted-foreground m-0 font-mono text-xs break-all">value: {JSON.stringify(value)}</p>
</div>
