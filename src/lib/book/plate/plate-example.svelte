<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Example } from '../examples.js';
	import PlatePreview from './plate-preview.svelte';
	import PlateSection from './plate-section.svelte';

	interface Props {
		/** The section's heading, e.g. "Size". */
		title: string;
		example: Example;
		/** A sentence or two above the preview: what to set to get this. */
		children?: Snippet;
	}

	let { title, example, children }: Props = $props();
</script>

<PlateSection {title}>
	{#if children}<p>{@render children()}</p>{/if}
	<PlatePreview {example} class="min-h-56" />
</PlateSection>
