<script lang="ts">
	import type { Snippet } from 'svelte';
	import { install } from '../catalogue.js';
	import PlateCode from './plate-code.svelte';

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
		<PlateCode code={install(name)} label="install command" class="mt-2" />
	</header>
	{@render children()}
</article>
