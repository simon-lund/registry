<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import {
		FilterMatrix,
		FilterMatrixHeader,
		FilterMatrixBody,
		FilterMatrixFooter,
		FilterMatrixRow,
		FilterMatrixHead,
		FilterMatrixCell,
		FilterMatrixTotal,
		matches,
		type FilterMatrixValue
	} from '#lib/registry/ui/filter-matrix/index.js';
	import { areas, count, inWords, statuses, tasks } from './tasks.js';

	let value = $state<FilterMatrixValue[]>([]);
	const shown = $derived(tasks.filter((t) => matches(value, t.area, t.status)));
	const label = (id: string, list: { id: string; label: string }[]) => list.find((x) => x.id === id)?.label;
</script>

<div class="flex w-full max-w-sm flex-col gap-5">
	<FilterMatrix
		rows={areas.map((a) => a.id)}
		columns={statuses.map((s) => s.id)}
		bind:value
		aria-label="Filter tasks by area and status"
	>
		<FilterMatrixHeader>
			<FilterMatrixRow>
				<FilterMatrixHead />
				{#each statuses as s (s.id)}
					<FilterMatrixHead column={s.id}>{s.label}</FilterMatrixHead>
				{/each}
				<FilterMatrixHead />
			</FilterMatrixRow>
		</FilterMatrixHeader>
		<FilterMatrixBody>
			{#each areas as a (a.id)}
				<FilterMatrixRow>
					<FilterMatrixHead row={a.id}>{a.label}</FilterMatrixHead>
					{#each statuses as s (s.id)}
						{@const n = count(a.id, s.id)}
						<!-- an empty cell steps back, and can still be picked -->
						<FilterMatrixCell row={a.id} column={s.id} class={n === 0 ? 'text-muted-foreground' : undefined}>{n}</FilterMatrixCell>
					{/each}
					<FilterMatrixTotal row={a.id} aria-label="All of {a.label}: {inWords(count(a.id))}">{count(a.id)}</FilterMatrixTotal>
				</FilterMatrixRow>
			{/each}
		</FilterMatrixBody>
		<FilterMatrixFooter>
			<FilterMatrixRow>
				<FilterMatrixHead />
				{#each statuses as s (s.id)}
					<FilterMatrixTotal column={s.id} aria-label="All {s.label}: {inWords(count(undefined, s.id))}">
						{count(undefined, s.id)}
					</FilterMatrixTotal>
				{/each}
				<FilterMatrixTotal aria-label="All {inWords(count())}">{count()}</FilterMatrixTotal>
			</FilterMatrixRow>
		</FilterMatrixFooter>
	</FilterMatrix>

	<div class="flex flex-col gap-2">
		<div class="flex min-h-7 items-center justify-between gap-3">
			<!-- only the count is announced, not the whole list -->
			<p class="text-muted-foreground m-0 text-xs" aria-live="polite">
				{value.length ? `${shown.length} of ${inWords(tasks.length)}` : `All ${inWords(tasks.length)}`}
			</p>
			<!-- the visible way out: a pointer and a finger have no Escape -->
			{#if value.length}
				<Button size="sm" variant="ghost" onclick={() => (value = [])}>Clear</Button>
			{/if}
		</div>
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
