<script lang="ts">
	import '../app.css';
	import ThemeToggle from '#lib/book/theme-toggle.svelte';
	import SlowMotion from '#lib/book/slow-motion.svelte';
	import Sidebar from '#lib/book/sidebar.svelte';

	let { children } = $props();
</script>

<!-- pb-32: room at the end, so the last section never sits on the window's edge -->
<div class="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-32 sm:px-8">
	<header class="flex items-center justify-between py-6">
		<a href="/" class="font-heading text-lg">Registry</a>
		<nav class="flex items-center gap-4 text-sm">
			<a href="https://simon-lund.com" class="text-muted-foreground hover:text-foreground">simon-lund.com</a>
			<div class="flex items-center">
				<SlowMotion />
				<ThemeToggle />
			</div>
		</nav>
	</header>
	<!-- phone: the components as one row under the header, scrolling sideways when there are many -->
	<Sidebar variant="row" class="-mx-2 md:hidden" />
	<div class="flex flex-1 gap-10">
		<!-- tablet and up: the components as a column that stays put while the plate scrolls -->
		<aside class="hidden w-44 shrink-0 md:block">
			<Sidebar class="sticky top-6 -mx-2 py-6" />
		</aside>
		<main class="min-w-0 flex-1 py-6">
			{@render children()}
		</main>
	</div>
</div>
