<script lang="ts">
	import { onMount } from 'svelte';
	import TurtleIcon from '@lucide/svelte/icons/turtle';
	import XIcon from '@lucide/svelte/icons/x';
	import { Button } from '#lib/registry/ui/button/index.js';

	// Every duration five times longer (app.css, :root[data-slow]), to watch a motion closely.
	// Remembered in localStorage, like the theme; the book's own, never shipped.
	let slow = $state(false);
	// The first visit gets a note under the button saying what it is, until it is closed or the
	// button is used. Shown only once the browser has said it was never closed, so it never flashes.
	let hint = $state(false);

	const read = (key: string) => {
		try {
			return localStorage.getItem(key);
		} catch {
			return null; // private mode: off, and the note shows
		}
	};
	const write = (key: string, value: string) => {
		try {
			localStorage.setItem(key, value);
		} catch {
			// private mode: the choice lasts for this page only
		}
	};

	onMount(() => {
		slow = read('slow') === '1';
		document.documentElement.toggleAttribute('data-slow', slow);
		hint = read('slow-hint') !== 'seen';
	});

	function dismiss() {
		hint = false;
		write('slow-hint', 'seen');
	}

	function toggle() {
		slow = !slow;
		document.documentElement.toggleAttribute('data-slow', slow);
		write('slow', slow ? '1' : '0');
		dismiss();
	}
</script>

<div class="relative">
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
	{#if hint}
		<!-- Floats, so it has the one shadow; its point sits under the turtle. -->
		<div
			role="note"
			class="bg-popover text-popover-foreground absolute top-full right-0 z-50 mt-2 flex w-64 flex-col gap-1 rounded-lg border p-3 pt-2 shadow-lg"
		>
			<span aria-hidden="true" class="bg-popover absolute -top-[5px] right-3.5 size-2.5 rotate-45 border-t border-l"></span>
			<!-- The name and the close on one row; the explanation under them, the card's full width. -->
			<div class="flex items-center justify-between gap-2">
				<p class="m-0 text-sm font-semibold">Slow motion</p>
				<Button variant="ghost" size="icon-xs" aria-label="Dismiss" class="-mr-1.5" onclick={dismiss}>
					<XIcon aria-hidden="true" />
				</Button>
			</div>
			<p class="text-muted-foreground m-0 text-sm">
				Every animation on the page plays five times slower, so you can watch it closely.
			</p>
		</div>
	{/if}
</div>
