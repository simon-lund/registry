<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** The export's name, e.g. "NumberInput". */
		name: string;
		/** Shown beside a name that is not a component: "type", "function". */
		kind?: string;
		/** A sentence on what the part is for; then its props table, if it has props. */
		children: Snippet;
	}

	let { name, kind, children }: Props = $props();
</script>

<section class="flex flex-col gap-3" aria-labelledby="part-{name}">
	<h3 id="part-{name}" class="flex items-baseline gap-2 text-lg">
		{name}
		{#if kind}<span class="text-muted-foreground font-sans text-xs">{kind}</span>{/if}
	</h3>
	{@render children()}
</section>
