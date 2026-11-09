<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Swap, SwapItem } from '#lib/registry/ui/swap/index.js';

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		try {
			await navigator.clipboard.writeText('https://example.com/invite/7f3a');
		} catch {
			// denied: nothing was copied, so the button doesn't say it was
			return;
		}
		copied = true;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), 1600);
	}
</script>

<Button variant="outline" size="lg" onclick={copy}>
	<Swap>
		<SwapItem active={!copied}><CopyIcon /></SwapItem>
		<SwapItem active={copied}><CheckIcon /></SwapItem>
	</Swap>
	<Swap>
		<SwapItem active={!copied}>Copy</SwapItem>
		<SwapItem active={copied}>Copied</SwapItem>
	</Swap>
</Button>
<span role="status" class="sr-only">{copied ? 'Copied' : ''}</span>
