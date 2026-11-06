<script lang="ts">
	import type { Snippet } from 'svelte';
	import { install } from '../catalogue.js';

	interface Props {
		/** The registry item's name: the install command is built from it. */
		name: string;
		title: string;
		/** One line above the title: the kind and the stack, e.g. "Input · Svelte". */
		kind: string;
		children: Snippet;
	}

	let { name, title, kind, children }: Props = $props();
</script>

<svelte:head>
	<title>{title} · ui.simon-lund.com</title>
</svelte:head>

<article class="flex flex-col gap-10">
	<header class="flex flex-col gap-2">
		<p class="text-muted-foreground text-sm">{kind}</p>
		<h1 class="text-4xl">{title}</h1>
		<pre
			class="bg-muted text-muted-foreground mt-2 overflow-x-auto rounded-md px-3 py-2 font-mono text-xs select-all"><code>{install(name)}</code></pre>
	</header>
	{@render children()}
</article>
