<script lang="ts">
	import { onMount } from 'svelte';
	import TurtleIcon from '@lucide/svelte/icons/turtle';

	// Every duration five times longer (app.css, :root[data-slow]), to watch a motion closely.
	// Remembered in localStorage, like the theme; the book's own, never shipped.
	let slow = $state(false);
	onMount(() => {
		try {
			slow = localStorage.getItem('slow') === '1';
		} catch {
			// private mode: off
		}
		document.documentElement.toggleAttribute('data-slow', slow);
	});
	function toggle() {
		slow = !slow;
		document.documentElement.toggleAttribute('data-slow', slow);
		try {
			localStorage.setItem('slow', slow ? '1' : '0');
		} catch {
			// private mode: the choice lasts for this page only
		}
	}
</script>

<button
	type="button"
	onclick={toggle}
	aria-pressed={slow}
	aria-label="Slow motion"
	title="Slow motion"
	class="text-muted-foreground hover:text-foreground focus-visible:ring-ring aria-pressed:bg-muted aria-pressed:text-foreground rounded-md p-2 focus-visible:ring-2 focus-visible:outline-none"
>
	<TurtleIcon class="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
</button>
