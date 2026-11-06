<script lang="ts">
	import '../app.css';
	import ThemeToggle from '#lib/book/theme-toggle.svelte';

	let { children } = $props();
</script>

<div class="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 sm:px-8">
	<header class="flex items-center justify-between py-6">
		<a href="/" class="font-heading text-lg">Registry</a>
		<nav class="flex items-center gap-4 text-sm">
			<a href="https://simon-lund.com" class="text-muted-foreground hover:text-foreground">simon-lund.com</a>
			<ThemeToggle />
		</nav>
	</header>
	<main class="flex-1 py-6">
		{@render children()}
	</main>
	<footer class="text-muted-foreground py-10 text-sm">
		Components I designed and use. Install any of them with the shadcn-svelte CLI.
	</footer>
</div>
