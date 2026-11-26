<script lang="ts">
	import { Rating } from '#lib/registry/ui/rating/index.js';
	import { Button } from '#lib/registry/ui/button/index.js';

	let submitted = $state('nothing yet');
</script>

<form
	class="flex flex-col items-start gap-3"
	onsubmit={(e) => {
		e.preventDefault();
		submitted = String(new FormData(e.currentTarget).get('score'));
	}}
>
	<Rating
		name="score"
		value={2}
		aria-label="Rating"
		aria-valuetext={(v, max) => `${v} of ${max} stars`}
	/>
	<div class="flex gap-2">
		<Button type="submit" size="sm">Send</Button>
		<Button type="reset" variant="outline" size="sm">Reset</Button>
	</div>
	<p class="text-muted-foreground font-mono text-xs">score: {submitted}</p>
</form>
