<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { ViewChange, sideOf, type ViewSide } from '#lib/registry/ui/view-change/index.js';

	const order = ['Profile', 'General', 'Billing'];
	let section = $state('Profile');
	let from = $state<ViewSide>();
	const following = $derived(order[(order.indexOf(section) + 1) % order.length]);

	function open(next: string, how: 'pointer' | 'shortcut') {
		from = how === 'shortcut' ? undefined : sideOf(order, section, next);
		section = next;
	}
</script>

<div class="flex w-full max-w-md flex-col gap-4">
	<div class="bg-background ring-border overflow-hidden rounded-lg ring-1">
		<ViewChange key={section} {from} class="p-4 font-medium">{section}</ViewChange>
	</div>
	<div class="flex flex-wrap justify-center gap-2">
		<Button variant="outline" size="sm" onclick={() => open(following, 'pointer')}>
			Open {following}
		</Button>
		<Button variant="outline" size="sm" onclick={() => open(following, 'shortcut')}>
			Open {following} by shortcut
		</Button>
	</div>
</div>
