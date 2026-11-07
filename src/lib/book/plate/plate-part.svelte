<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** The export's name, e.g. "NumberInput". */
		name: string;
		/** What kind of export: component, type, function. */
		kind?: string;
		/** One or two sentences: what the part is for; then its props, if it has any. */
		children: Snippet;
	}

	let { name, kind = 'component', children }: Props = $props();
</script>

<section class="flex flex-col gap-3" aria-labelledby="part-{name}">
	<h3 id="part-{name}" class="flex items-baseline gap-2 text-lg">
		<code class="font-mono text-base">{name}</code>
		<span class="text-muted-foreground font-sans text-xs">{kind}</span>
	</h3>
	<div class="flex flex-col gap-4">
		{@render children()}
	</div>
</section>
