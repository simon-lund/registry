<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { ViewChange, sideOf, type ViewSide } from '#lib/registry/ui/view-change/index.js';

	const sections = [
		{ id: 'profile', label: 'Profile', lines: ['Name', 'Photo', 'Email address'] },
		{ id: 'general', label: 'General', lines: ['Language', 'Appearance', 'Week starts on'] },
		{ id: 'billing', label: 'Billing', lines: ['Plan', 'Payment method', 'Invoices'] }
	];
	const order = sections.map((s) => s.id);

	let active = $state('profile');
	let from = $state<ViewSide>();
	const current = $derived(sections.find((s) => s.id === active) ?? sections[0]);

	function open(id: string) {
		from = sideOf(order, active, id);
		active = id;
	}
</script>

<div class="bg-background ring-border w-full max-w-md overflow-hidden rounded-lg ring-1">
	<nav aria-label="Settings" class="border-border flex gap-1 border-b p-2">
		{#each sections as s (s.id)}
			<Button
				size="sm"
				variant={active === s.id ? 'default' : 'ghost'}
				aria-current={active === s.id ? 'page' : undefined}
				onclick={() => open(s.id)}
			>
				{s.label}
			</Button>
		{/each}
	</nav>
	<ViewChange key={active} {from} class="flex flex-col gap-3 p-4">
		<p class="font-medium">{current.label}</p>
		<ul class="text-muted-foreground flex flex-col gap-2 text-sm">
			{#each current.lines as line (line)}
				<li>{line}</li>
			{/each}
		</ul>
	</ViewChange>
</div>
