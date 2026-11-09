<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { closeWatcher } from '#lib/registry/ui/close-watcher/index.js';

	let filters = $state(false);
	let sort = $state(false);
	let last = $state('none yet');
	let trigger = $state<HTMLElement | null>(null);

	// Read after mount: the server has no CloseWatcher.
	let available = $state<boolean>();
	$effect(() => {
		available = 'CloseWatcher' in globalThis;
	});

	function closeFilters() {
		filters = false;
		sort = false;
	}
</script>

<div class="flex w-full max-w-sm flex-col gap-3">
	<Button
		bind:ref={trigger}
		variant="outline"
		class="self-start"
		aria-expanded={filters}
		onclick={() => (filters ? closeFilters() : (filters = true))}
	>
		Filters
	</Button>

	{#if filters}
		<div
			role="group"
			aria-label="Filters"
			class="bg-background border-border flex flex-col gap-3 rounded-lg border p-4"
			{@attach closeWatcher(() => {
				closeFilters();
				last = 'Filters';
				trigger?.focus();
			})}
		>
			<Button
				variant="outline"
				size="sm"
				class="self-start"
				aria-expanded={sort}
				onclick={() => (sort = !sort)}
			>
				Sort order
			</Button>

			{#if sort}
				<p
					class="border-border rounded-md border p-3 text-sm"
					{@attach closeWatcher(() => {
						sort = false;
						last = 'Sort order';
					})}
				>
					Newest first. This layer is on top, so it closes first.
				</p>
			{/if}
		</div>
	{/if}

	<p class="text-muted-foreground min-h-8 font-mono text-xs">
		{#if available !== undefined}
			CloseWatcher: {available ? 'in this browser' : 'not in this browser, so Escape does nothing here'}
			<br />
			last close request: {last}
		{/if}
	</p>
</div>
