<script lang="ts">
	import type { Example } from '../examples.js';
	import PlatePreview from './plate-preview.svelte';

	/** The component, large and working, under the title, with its code one switch away. */
	let { example }: { example: Example } = $props();
</script>

<PlatePreview {example} class="min-h-80 sm:p-12" />
