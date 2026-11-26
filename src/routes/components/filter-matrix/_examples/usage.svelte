<script lang="ts">
	import {
		FilterMatrix,
		FilterMatrixHeader,
		FilterMatrixBody,
		FilterMatrixRow,
		FilterMatrixHead,
		FilterMatrixCell,
		matches,
		type FilterMatrixValue
	} from '#lib/registry/ui/filter-matrix/index.js';

	let value = $state<FilterMatrixValue[]>([]);
	// and filter your own list: tasks.filter((t) => matches(value, t.area, t.status))
</script>

<FilterMatrix rows={['work', 'home']} columns={['open', 'done']} bind:value aria-label="Filter tasks">
	<FilterMatrixHeader>
		<FilterMatrixRow>
			<FilterMatrixHead />
			<FilterMatrixHead column="open">Open</FilterMatrixHead>
			<FilterMatrixHead column="done">Done</FilterMatrixHead>
		</FilterMatrixRow>
	</FilterMatrixHeader>
	<FilterMatrixBody>
		<FilterMatrixRow>
			<FilterMatrixHead row="work">Work</FilterMatrixHead>
			<FilterMatrixCell row="work" column="open">3</FilterMatrixCell>
			<FilterMatrixCell row="work" column="done">1</FilterMatrixCell>
		</FilterMatrixRow>
		<FilterMatrixRow>
			<FilterMatrixHead row="home">Home</FilterMatrixHead>
			<FilterMatrixCell row="home" column="open">2</FilterMatrixCell>
			<FilterMatrixCell row="home" column="done">4</FilterMatrixCell>
		</FilterMatrixRow>
	</FilterMatrixBody>
</FilterMatrix>
