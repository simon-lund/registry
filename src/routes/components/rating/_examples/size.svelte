<script lang="ts">
	import { Rating } from '#lib/registry/ui/rating/index.js';

	const words = (v: number, max: number) => `${v} of ${max} stars`;
</script>

<div class="flex flex-col items-start gap-3">
	<Rating size="sm" value={3} readonly aria-label="Small" aria-valuetext={words} />
	<Rating value={3} aria-label="Default" aria-valuetext={words} />
	<Rating size="lg" value={3} aria-label="Large" aria-valuetext={words} />
</div>
