<script lang="ts">
	import { Rating } from '#lib/registry/ui/rating/index.js';
</script>

<!-- a score shown in a list row, not taken -->
<div class="flex items-center gap-2 text-sm">
	<Rating
		size="sm"
		readonly
		allowHalf
		value={4.5}
		aria-label="Average rating"
		aria-valuetext="4.5 of 5 stars"
	/>
	<span class="text-muted-foreground font-mono text-xs">4.5 · 128 ratings</span>
</div>
