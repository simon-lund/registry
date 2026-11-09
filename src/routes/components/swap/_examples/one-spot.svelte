<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Swap, SwapItem } from '#lib/registry/ui/swap/index.js';

	const stages = ['Draft', 'In review', 'Published'];
	let stage = $state(0);
</script>

<div class="flex flex-col items-center gap-4">
	<p class="text-sm">
		The report is
		<Swap class="ring-border rounded px-1.5 ring-1">
			{#each stages as label, i (label)}
				<SwapItem active={stage === i}>{label}</SwapItem>
			{/each}
		</Swap>
		as of today.
	</p>
	<Button variant="outline" size="sm" onclick={() => (stage = (stage + 1) % stages.length)}>
		Next stage
	</Button>
</div>
