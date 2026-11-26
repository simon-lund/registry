<script lang="ts">
	import { Rating } from '#lib/registry/ui/rating/index.js';

	let stars = $state(3);
</script>

<Rating bind:value={stars} aria-label="Rating" aria-valuetext={(v, max) => `${v} of ${max} stars`} />
