<script lang="ts">
	import { onMount } from 'svelte';

	// The same switch as simon-lund.com: a class on <html>, remembered in localStorage, and the
	// favicon to match.
	let dark = $state(false);
	onMount(() => {
		dark = document.documentElement.classList.contains('dark');
	});
	function toggle() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]');
		if (icon) icon.href = dark ? '/favicon.svg' : '/favicon-light.svg';
		try {
			localStorage.setItem('theme', dark ? 'dark' : 'light');
		} catch {
			// private mode: the choice lasts for this page only
		}
	}
</script>

<button
	type="button"
	onclick={toggle}
	aria-pressed={dark}
	aria-label={dark ? 'Switch to light' : 'Switch to dark'}
	class="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-md p-2 focus-visible:ring-2 focus-visible:outline-none"
>
	{#if dark}
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
	{:else}
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
	{/if}
</button>
