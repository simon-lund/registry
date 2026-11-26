<script lang="ts">
	import {
		FilterMatrix,
		FilterMatrixHeader,
		FilterMatrixBody,
		FilterMatrixRow,
		FilterMatrixHead,
		FilterMatrixCell,
		type FilterMatrixValue
	} from '#lib/registry/ui/filter-matrix/index.js';
	import { areas, count } from './tasks.js';

	const statuses = [
		{ id: 'open', label: 'Open' },
		{ id: 'doing', label: 'Doing' },
		{ id: 'waiting', label: 'Waiting' },
		{ id: 'blocked', label: 'Blocked' },
		{ id: 'review', label: 'In review' },
		{ id: 'done', label: 'Done' }
	];
	let value = $state<FilterMatrixValue[]>([]);
</script>

<!-- narrow on purpose, so the table has to scroll -->
<div class="w-full max-w-64">
	<FilterMatrix rows={areas.map((a) => a.id)} columns={statuses.map((s) => s.id)} bind:value aria-label="Filter tasks">
		<FilterMatrixHeader>
			<FilterMatrixRow>
				<FilterMatrixHead class="bg-muted sticky left-0 z-10" />
				{#each statuses as s (s.id)}
					<FilterMatrixHead column={s.id}>{s.label}</FilterMatrixHead>
				{/each}
			</FilterMatrixRow>
		</FilterMatrixHeader>
		<FilterMatrixBody>
			{#each areas as a (a.id)}
				<FilterMatrixRow>
					<!-- sticky, on the surface the table sits on (here the muted stage) -->
					<FilterMatrixHead row={a.id} class="bg-muted sticky left-0 z-10">{a.label}</FilterMatrixHead>
					{#each statuses as s (s.id)}
						{@const n = count(a.id, s.id)}
						<FilterMatrixCell row={a.id} column={s.id} class={n === 0 ? 'text-muted-foreground' : undefined}>{n}</FilterMatrixCell>
					{/each}
				</FilterMatrixRow>
			{/each}
		</FilterMatrixBody>
	</FilterMatrix>
</div>
