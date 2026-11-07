<script lang="ts">
	import { AnimatedNumber } from '#lib/registry/ui/number-input/index.js';

	let views = $state(12808);
</script>

<button
	type="button"
	class="hover:bg-accent focus-visible:ring-ring rounded-md px-3 py-2 text-2xl focus-visible:ring-2 focus-visible:outline-none"
	onclick={() => (views += Math.floor(Math.random() * 900) + 1)}
>
	<AnimatedNumber value={views} />
	<span class="text-muted-foreground ml-2 text-sm">views · tap</span>
</button>
