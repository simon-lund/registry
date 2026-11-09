<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Swap, SwapItem } from '#lib/registry/ui/swap/index.js';

	let saved = $state(false);
</script>

<Button variant="outline" onclick={() => (saved = !saved)}>
	<Swap>
		<SwapItem active={!saved}>Save</SwapItem>
		<SwapItem active={saved}>Saved</SwapItem>
	</Swap>
</Button>
