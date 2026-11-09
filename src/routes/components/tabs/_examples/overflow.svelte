<script lang="ts">
	import { Tabs, TabsList, TabsTrigger } from '#lib/registry/ui/tabs/index.js';

	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];
</script>

<Tabs value="June" class="w-full max-w-xs">
	<TabsList aria-label="Month">
		{#each months as month (month)}
			<TabsTrigger value={month}>{month}</TabsTrigger>
		{/each}
	</TabsList>
</Tabs>
