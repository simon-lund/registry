<script lang="ts">
	import PauseIcon from '@lucide/svelte/icons/pause';
	import PlayIcon from '@lucide/svelte/icons/play';
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Swap, SwapItem } from '#lib/registry/ui/swap/index.js';

	let playing = $state(false);
</script>

<div class="flex items-center gap-3">
	<Button
		variant="outline"
		size="icon-lg"
		aria-label={playing ? 'Pause' : 'Play'}
		onclick={() => (playing = !playing)}
	>
		<Swap>
			<SwapItem active={!playing}><PlayIcon /></SwapItem>
			<SwapItem active={playing}><PauseIcon /></SwapItem>
		</Swap>
	</Button>
	<span class="text-muted-foreground text-sm">Voice note, 0:42</span>
</div>
