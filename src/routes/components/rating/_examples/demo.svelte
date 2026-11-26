<script lang="ts">
	import { Rating } from '#lib/registry/ui/rating/index.js';

	let stars = $state(4);
	const words = (v: number, max: number) => `${v} of ${max} stars`;
</script>

<div class="flex flex-col items-center gap-3">
	<span id="how-was-it" class="text-muted-foreground text-sm">How was the session?</span>
	<Rating bind:value={stars} size="lg" aria-labelledby="how-was-it" aria-valuetext={words} />
	<p class="text-muted-foreground font-mono text-xs">value: {stars}</p>
</div>
