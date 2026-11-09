<script lang="ts">
	import { Tabs, TabsList, TabsTrigger } from '#lib/registry/ui/tabs/index.js';
</script>

<Tabs value="week">
	<TabsList aria-label="Period" class="w-fit">
		<TabsTrigger value="day" class="flex-none">Day</TabsTrigger>
		<TabsTrigger value="week" class="flex-none">Week</TabsTrigger>
		<TabsTrigger value="quarter" class="flex-none">Quarter</TabsTrigger>
	</TabsList>
</Tabs>
