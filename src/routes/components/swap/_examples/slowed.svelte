<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Swap, SwapItem } from '#lib/registry/ui/swap/index.js';

	let copied = $state(false);
</script>

<div class="flex flex-col items-center gap-6">
	<div class="flex items-center gap-3 text-2xl [--dur-base:2200ms]">
		<Swap class="[&_svg]:size-8">
			<SwapItem active={!copied}><CopyIcon /></SwapItem>
			<SwapItem active={copied}><CheckIcon /></SwapItem>
		</Swap>
		<Swap>
			<SwapItem active={!copied}>Copy</SwapItem>
			<SwapItem active={copied}>Copied</SwapItem>
		</Swap>
	</div>
	<Button variant="outline" size="sm" onclick={() => (copied = !copied)}>Turn</Button>
</div>
