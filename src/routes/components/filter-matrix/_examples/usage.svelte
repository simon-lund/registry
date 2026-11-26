<script lang="ts">
	import { FilterMatrix, matches } from '#lib/registry/ui/filter-matrix/index.js';

	const rows = [{ id: 'work', label: 'Work' }, { id: 'home', label: 'Home' }];
	const columns = [{ id: 'open', label: 'Open' }, { id: 'done', label: 'Done' }];
	// how many things lie in each cell, by `area|status`; a missing cell is 0
	const counts = { 'work|open': 3, 'work|done': 1, 'home|open': 2 };

	let value = $state<string[]>([]);
	const cellLabel = ({ row, column, count }: { row?: { label: string }; column?: { label: string }; count: number }) =>
		`${[row?.label, column?.label].filter(Boolean).join(', ') || 'All'}: ${count}`;
	// and filter your own list with matches(value, task.area, task.status)
</script>

<FilterMatrix {rows} {columns} {counts} bind:value {cellLabel} aria-label="Filter" />
