<script lang="ts">
	import { FilterMatrix } from '#lib/registry/ui/filter-matrix/index.js';
	import { areas, countTasks, describe, tasks } from './tasks.js';

	// an area with nothing in it, and a status that is only worth it for one area
	const statuses = [
		{ id: 'open', label: 'Open' },
		{ id: 'doing', label: 'Doing' },
		{ id: 'blocked', label: 'Blocked' },
		{ id: 'done', label: 'Done' }
	];
	let value = $state<string[]>([]);
	const counts = countTasks(tasks);
</script>

<div class="flex w-full max-w-md flex-col gap-3 [--filter-ground:var(--muted)]">
	<FilterMatrix rows={areas.slice(0, 3)} columns={statuses} {counts} bind:value cellLabel={describe} aria-label="Filter tasks" />
</div>
