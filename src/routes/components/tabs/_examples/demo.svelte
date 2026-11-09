<script lang="ts">
	import { Tabs, TabsContent, TabsCount, TabsList, TabsTrigger } from '#lib/registry/ui/tabs/index.js';
</script>

<Tabs value="to-read" class="w-full max-w-md">
	<TabsList aria-label="Reading list">
		<TabsTrigger value="to-read">To read <TabsCount>6</TabsCount></TabsTrigger>
		<TabsTrigger value="reading">Reading</TabsTrigger>
		<TabsTrigger value="finished">Finished</TabsTrigger>
	</TabsList>
	<TabsContent value="to-read" class="px-1 text-sm">
		Six books waiting, the next one a history of lighthouses.
	</TabsContent>
	<TabsContent value="reading" class="px-1 text-sm">
		One book open, on page 212 of 340.
	</TabsContent>
	<TabsContent value="finished" class="px-1 text-sm">
		Fourteen books finished this year, the last one on Sunday.
	</TabsContent>
</Tabs>
