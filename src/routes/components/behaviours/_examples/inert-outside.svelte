<script lang="ts">
	import { tick } from 'svelte';
	import { Button } from '#lib/registry/ui/button/index.js';
	import { inertOutside, modalLayers } from '#lib/registry/ui/inert-outside/index.js';

	let open = $state(false);
	let plain = $state(0);
	let kept = $state(0);
	let trigger = $state<HTMLElement | null>(null);
	let closer = $state<HTMLElement | null>(null);

	async function show() {
		open = true;
		await tick();
		closer?.focus();
	}

	async function close() {
		open = false;
		// The page comes back first: an inert trigger refuses focus.
		await tick();
		trigger?.focus();
	}
</script>

<svelte:window
	onkeydown={(event) => {
		if (open && event.key === 'Escape') close();
	}}
/>

<div class="flex w-full max-w-sm flex-col gap-3">
	<div class="flex flex-wrap gap-2">
		<Button variant="outline" onclick={() => plain++}>Plain: {plain}</Button>
		<Button variant="outline" data-kept onclick={() => kept++}>Kept: {kept}</Button>
	</div>

	<Button bind:ref={trigger} class="self-start" onclick={show}>Open the layer</Button>

	{#if open}
		<div
			role="dialog"
			aria-modal="true"
			aria-label="Modal layer"
			class="bg-background border-border flex flex-col gap-3 rounded-lg border p-4"
			{@attach inertOutside({ keep: '[data-kept]' })}
		>
			<p class="text-sm">
				Everything outside this box is inert now, the sidebar too. Click around or press Tab: only
				Kept still answers, because the <code>keep</code> selector matches it.
			</p>
			<Button bind:ref={closer} variant="outline" size="sm" class="self-start" onclick={close}>Close</Button>
		</div>
	{/if}

	<p class="text-muted-foreground font-mono text-xs">modalLayers.open: {modalLayers.open}</p>
</div>
