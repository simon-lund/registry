<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { focusFirst, returnFocus, tabStops, triggerOf } from '#lib/registry/ui/focus-return/index.js';

	const id = $props.id();
	const files = ['Budget.xlsx', 'Minutes.docx', 'Roadmap.pdf'];

	let open = $state(false);
	let rows = $state<string[]>([]);
	let panel = $state<HTMLElement | null>(null);
	let focused = $state('nothing');

	function show() {
		rows = [...files];
		open = true;
	}

	function close() {
		const layer = panel;
		open = false;
		// The Close button that had focus is going away: back to the control that opened the panel.
		returnFocus(layer, () => triggerOf(layer));
	}

	function remove(name: string, button: HTMLElement) {
		// This button is going away: the next Tab stop in the panel takes over. Close is always there.
		const stops = panel ? tabStops(panel) : [];
		focusFirst(stops[stops.indexOf(button) + 1]);
		rows = rows.filter((row) => row !== name);
	}

	function nameOf(target: EventTarget | null) {
		if (!(target instanceof HTMLElement)) return 'nothing';
		return target.getAttribute('aria-label') || target.textContent?.trim() || target.tagName.toLowerCase();
	}
</script>

<svelte:document
	onfocusin={(event) => (focused = nameOf(event.target))}
	onfocusout={(event) => {
		if (!event.relatedTarget) focused = 'nothing';
	}}
/>

<div class="flex w-full max-w-sm flex-col gap-3">
	<Button variant="outline" class="self-start" aria-controls={id} aria-expanded={open} onclick={show}>
		Open files
	</Button>

	{#if open}
		<div
			{id}
			bind:this={panel}
			role="group"
			aria-label="Files"
			class="bg-background border-border flex flex-col gap-2 rounded-lg border p-4"
			{@attach (node) => void focusFirst(tabStops(node)[0])}
		>
			{#each rows as row (row)}
				<div class="flex items-center justify-between gap-3 text-sm">
					<span class="min-w-0 truncate">{row}</span>
					<Button
						variant="ghost"
						size="sm"
						aria-label="Remove {row}"
						onclick={(event) => remove(row, event.currentTarget)}
					>
						Remove
					</Button>
				</div>
			{/each}
			<Button variant="outline" size="sm" class="self-end" onclick={close}>Close</Button>
		</div>
	{/if}

	<p class="text-muted-foreground truncate font-mono text-xs">focus: {focused}</p>
</div>
