<script lang="ts">
	import { Textarea } from '#lib/registry/ui/textarea/index.js';

	let comment = $state('Press Enter a few times: the field grows with its text, up to 240px.');
</script>

<div class="w-full max-w-md">
	<Textarea bind:value={comment} autogrow aria-label="Comment" class="max-h-60" />
</div>
