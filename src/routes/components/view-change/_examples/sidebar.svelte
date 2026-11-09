<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { ViewChange, type ViewSide } from '#lib/registry/ui/view-change/index.js';

	const pages = [
		{ name: 'Today', line: 'Three tasks due.' },
		{ name: 'Upcoming', line: 'Twelve tasks this week.' },
		{ name: 'Reminders', line: 'One reminder at 16:00.' }
	];

	let active = $state('Today');
	let from = $state<ViewSide>();
	const current = $derived(pages.find((p) => p.name === active) ?? pages[0]);

	function open(name: string) {
		from = 'left';
		active = name;
	}
</script>

<div class="bg-background ring-border grid min-h-40 w-full max-w-md grid-cols-[7rem_minmax(0,1fr)] overflow-hidden rounded-lg ring-1">
	<nav aria-label="Pages" class="border-border flex flex-col gap-1 border-r p-2">
		{#each pages as p (p.name)}
			<Button
				size="sm"
				variant={active === p.name ? 'default' : 'ghost'}
				aria-current={active === p.name ? 'page' : undefined}
				class="justify-start"
				onclick={() => open(p.name)}
			>
				{p.name}
			</Button>
		{/each}
	</nav>
	<ViewChange key={active} {from} class="flex flex-col gap-1 p-4">
		<p class="font-medium">{current.name}</p>
		<p class="text-muted-foreground text-sm">{current.line}</p>
	</ViewChange>
</div>
