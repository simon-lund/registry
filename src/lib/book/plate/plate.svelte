<script lang="ts">
	import type { Snippet } from 'svelte';
	import { components } from '../catalogue.js';

	interface Props {
		/** The registry item's name: the description comes from the catalogue. */
		name: string;
		title: string;
		children: Snippet;
	}

	let { name, title, children }: Props = $props();

	const description = $derived(components.find((c) => c.name === name)?.tagline);
</script>

<svelte:head>
	<title>{title} · ui.simon-lund.com</title>
	{#if description}<meta name="description" content={description} />{/if}
</svelte:head>

<article class="flex flex-col gap-12">
	<header class="flex flex-col gap-2">
		<h1 class="text-4xl">{title}</h1>
		{#if description}<p class="text-muted-foreground m-0 max-w-prose text-lg">{description}</p>{/if}
	</header>
	{@render children()}
</article>
