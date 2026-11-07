<script lang="ts">
	import type { Example } from '../examples.js';
	import PlatePreview from './plate-preview.svelte';

	/** One state: its name, the component in it, and the code that makes it. */
	let { label, example }: { label: string; example: Example } = $props();
</script>

{#snippet name()}{label}{/snippet}
<PlatePreview {example} label={name} class="min-h-28 rounded-lg p-4" />
