<script lang="ts">
	import type { Snippet } from 'svelte';

	/** One part of the notes: Intention, Left out, States, Measurements. */
	let { title, children }: { title: string; children: Snippet } = $props();
</script>

<section class="flex flex-col gap-3">
	<h2 class="text-xl">{title}</h2>
	<div class="text-foreground flex max-w-prose flex-col gap-3 [&_p]:m-0">
		{@render children()}
	</div>
</section>
