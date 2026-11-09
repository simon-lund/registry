<script lang="ts">
	import { Tabs, TabsList, TabsTrigger } from '#lib/registry/ui/tabs/index.js';

	let appearance = $state('system');
</script>

<div class="flex w-full max-w-sm flex-col gap-3">
	<Tabs mode="radio" bind:value={appearance}>
		<TabsList aria-label="Appearance">
			<TabsTrigger value="system">System</TabsTrigger>
			<TabsTrigger value="light">Light</TabsTrigger>
			<TabsTrigger value="dark">Dark</TabsTrigger>
		</TabsList>
	</Tabs>
	<p class="text-muted-foreground font-mono text-xs">value: {appearance}</p>
</div>
