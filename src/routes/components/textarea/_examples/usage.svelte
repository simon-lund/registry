<script lang="ts">
	import { Textarea } from '#lib/registry/ui/textarea/index.js';

	let value = $state('');
</script>

<Textarea bind:value resizeLabel="Resize" aria-label="Comment" />
