<script lang="ts">
	import {
		FilterMatrix,
		FilterMatrixHeader,
		FilterMatrixBody,
		FilterMatrixFooter,
		FilterMatrixRow,
		FilterMatrixHead,
		FilterMatrixCell,
		FilterMatrixTotal,
		type FilterMatrixValue
	} from '#lib/registry/ui/filter-matrix/index.js';
	import { areas, count, inWords, statuses } from './tasks.js';

	let value = $state<FilterMatrixValue[]>([
		{ row: 'work', column: 'open' },
		{ row: 'home', column: 'open' }
	]);
	const rows = areas.slice(0, 3);
</script>

<div class="flex w-full max-w-sm flex-col gap-3">
	<FilterMatrix rows={rows.map((a) => a.id)} columns={statuses.map((s) => s.id)} bind:value aria-label="Filter tasks">
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
			{#each rows as a (a.id)}
				<FilterMatrixRow>
					<FilterMatrixHead row={a.id}>{a.label}</FilterMatrixHead>
					{#each statuses as s (s.id)}
						<FilterMatrixCell row={a.id} column={s.id}>{count(a.id, s.id)}</FilterMatrixCell>
					{/each}
					<FilterMatrixTotal row={a.id} aria-label="All of {a.label}: {inWords(count(a.id))}">{count(a.id)}</FilterMatrixTotal>
				</FilterMatrixRow>
			{/each}
		</FilterMatrixBody>
		<FilterMatrixFooter>
			<FilterMatrixRow>
				<FilterMatrixHead />
				{#each statuses as s (s.id)}
					{@const n = rows.reduce((sum, a) => sum + count(a.id, s.id), 0)}
					<FilterMatrixTotal column={s.id} aria-label="All {s.label}: {inWords(n)}">{n}</FilterMatrixTotal>
				{/each}
				<FilterMatrixTotal aria-label="Everything">{rows.reduce((sum, a) => sum + count(a.id), 0)}</FilterMatrixTotal>
			</FilterMatrixRow>
		</FilterMatrixFooter>
	</FilterMatrix>
	<p class="text-muted-foreground m-0 font-mono text-xs break-all">value: {JSON.stringify(value)}</p>
</div>
