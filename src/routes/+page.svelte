<script lang="ts">
	import { components } from '#lib/book/catalogue.js';
</script>

<svelte:head>
	<title>Registry · ui.simon-lund.com</title>
</svelte:head>

<div class="flex flex-col gap-14">
	<section class="flex flex-col gap-3">
		<h1 class="text-4xl">Less, but better.</h1>
		<p class="text-muted-foreground max-w-prose">
			A registry of components I designed and use, each on its own plate: large and working, with
			its intention, what was left out, its states and its measurements.
		</p>
	</section>

	<section class="flex flex-col gap-4">
		<h2 class="text-xl">Components</h2>
		<ul class="m-0 flex max-w-prose list-none flex-col gap-4 p-0">
			{#each components as c (c.name)}
				<li>
					<a
						href="/components/{c.name}"
						class="bg-muted hover:bg-accent focus-visible:ring-ring flex h-full flex-col gap-2 rounded-xl p-5 no-underline focus-visible:ring-2 focus-visible:outline-none"
					>
						<span class="font-heading text-lg">{c.title}</span>
						<span class="text-muted-foreground text-sm">{c.tagline}</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</div>
