<script lang="ts">
	import type { Snippet } from 'svelte';

	/** One section of the page under an h2: Installation, Usage, an example, API Reference. */
	let { title, children }: { title: string; children: Snippet } = $props();

	const slug = $derived(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
</script>

<section class="flex scroll-mt-6 flex-col gap-4" id={slug}>
	<h2 class="text-2xl">{title}</h2>
	<!-- text keeps a reading width; previews, code and tables take the column; inline code is a chip -->
	<div
		class="text-foreground flex flex-col gap-4 [&_:is(p,li)]:max-w-prose [&_p]:m-0 [&_:is(p,li,h3)_code]:bg-muted [&_:is(p,li,h3)_code]:rounded [&_:is(p,li)_code]:px-1.5 [&_:is(p,li)_code]:py-0.5 [&_:is(p,li)_code]:font-mono [&_:is(p,li)_code]:text-[0.85em]"
	>
		{@render children()}
	</div>
</section>
