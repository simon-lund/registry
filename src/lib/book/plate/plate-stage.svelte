<script lang="ts">
	import type { Example } from '../examples.js';
	import PlatePreview from './plate-preview.svelte';

	/** The component, large and working, with its code one switch away. Flat: the muted surface, no border. */
	let { example }: { example: Example } = $props();
</script>

<PlatePreview {example} rounded="rounded-xl" class="min-h-80 p-6 sm:p-12" />
