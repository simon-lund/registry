<script lang="ts">
	import { groups, inGroup } from '#lib/book/catalogue.js';

	// The components for AI agents, live: each plate's own demo (loaded in +page.ts), still a
	// picture here (inert), the card the link.
	let { data } = $props();
	const ai = $derived(data.ai);
</script>

<svelte:head>
	<title>Registry · ui.simon-lund.com</title>
</svelte:head>

<div class="flex flex-col gap-14">
	<section class="flex flex-col gap-3">
		<h1 class="text-4xl">Less, but better.</h1>
		<p class="text-muted-foreground max-w-prose">
			Svelte components I designed and use. Copy any of them into your app with the shadcn-svelte
			CLI.
		</p>
	</section>

	{#if ai.length}
		<section class="flex flex-col gap-4" aria-labelledby="ai">
			<h2 id="ai" class="text-xl">Examples</h2>
			<ul class="m-0 flex list-none flex-col gap-10 p-0">
				{#each ai as c (c.name)}
					<li class="group relative flex flex-col gap-3">
						<!-- the name first, so it reads as this card's title, not the section's -->
						<div class="flex flex-col gap-1">
							<!-- the link covers the whole card -->
							<a
								href="/components/{c.name}"
								class="font-heading focus-visible:ring-ring rounded-sm text-lg no-underline after:absolute after:inset-0 after:rounded-xl focus-visible:ring-2 focus-visible:outline-none"
								>{c.title}</a
							>
							<span class="text-muted-foreground max-w-prose text-sm">{c.tagline}</span>
						</div>
						{#if c.Demo}
							<!-- a picture of the component at work: it runs, but takes no clicks or focus -->
							<div
								inert
								class="bg-muted group-hover:bg-accent flex min-h-64 items-center justify-center overflow-hidden rounded-xl p-6 transition-colors duration-(--dur-quick) sm:p-10"
							>
								<c.Demo />
							</div>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#each groups as g (g.id)}
		<section class="flex flex-col gap-4">
			<h2 class="text-xl">{g.title}</h2>
			<ul class="m-0 flex list-none flex-col gap-4 p-0">
				{#each inGroup(g.id) as c (c.name)}
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
	{/each}
</div>
