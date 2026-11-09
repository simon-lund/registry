<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { ViewChange, sideOf, type ViewSide } from '#lib/registry/ui/view-change/index.js';

	const order = ['Profile', 'Billing'];
	let section = $state('Profile');
	let from = $state<ViewSide>();

	function open(next: string) {
		from = sideOf(order, section, next);
		section = next;
	}
</script>

{#each order as name (name)}
	<Button variant="ghost" onclick={() => open(name)}>{name}</Button>
{/each}

<ViewChange key={section} {from}>
	<p>{section}</p>
</ViewChange>
