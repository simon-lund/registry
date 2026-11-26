<script lang="ts">
	import { FilterMatrix, matches } from '#lib/registry/ui/filter-matrix/index.js';
	import { areas, countTasks, describe, statuses, tasks } from './tasks.js';

	let value = $state<string[]>([]);
	const counts = countTasks(tasks);
	const shown = $derived(tasks.filter((t) => matches(value, t.area, t.status)));
	const label = (id: string, list: { id: string; label: string }[]) => list.find((x) => x.id === id)?.label;
</script>

<!-- the stage is the muted surface: the grid's sticky row labels are drawn on it -->
<div class="flex w-full max-w-sm flex-col gap-5 [--filter-ground:var(--muted)]">
	<FilterMatrix rows={areas} columns={statuses} {counts} bind:value cellLabel={describe} aria-label="Filter tasks by area and status" />

	<div class="flex flex-col gap-2" aria-live="polite">
		<p class="text-muted-foreground m-0 text-xs">
			{value.length ? `${shown.length} of ${tasks.length} tasks` : `All ${tasks.length} tasks`}
		</p>
		{#if shown.length}
			<ul class="m-0 flex list-none flex-col gap-1 p-0 text-sm">
				{#each shown as t (t.title)}
					<li class="flex items-baseline justify-between gap-3">
						<span class="min-w-0 truncate">{t.title}</span>
						<span class="text-muted-foreground shrink-0 text-xs">{label(t.area, areas)} · {label(t.status, statuses)}</span>
					</li>
				{/each}
			</ul>
		{:else}
			<!-- no-results: something is picked and nothing is in it -->
			<p class="text-muted-foreground m-0 text-sm">No tasks in the cells you picked.</p>
		{/if}
	</div>
</div>
