<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { longPress, type LongPressDetail } from '#lib/registry/ui/long-press/index.js';

	const actions = ['Rename', 'Move', 'Share'];

	let open = $state(false);
	let last = $state<LongPressDetail | null>(null);
</script>

<div class="flex w-full max-w-sm flex-col gap-3">
	<div
		class="bg-background border-border flex items-center justify-between gap-3 rounded-lg border p-4"
		{@attach longPress((detail) => {
			last = detail;
			open = true;
		})}
	>
		<div class="flex min-w-0 flex-col gap-1">
			<span class="truncate text-sm font-medium">Annual report.pdf</span>
			<span class="text-muted-foreground text-xs">Hold here, or right-click</span>
		</div>
		<!-- A press has no path without a pointer or a context-menu key: a visible control opens the same thing. -->
		<Button variant="outline" size="sm" aria-expanded={open} onclick={() => (open = !open)}>Actions</Button>
	</div>

	{#if open}
		<div class="flex flex-wrap gap-2">
			{#each actions as action (action)}
				<Button variant="outline" size="sm" onclick={() => (open = false)}>{action}</Button>
			{/each}
		</div>
	{/if}

	<p class="text-muted-foreground font-mono text-xs">
		{#if last}
			last: {last.source}, {last.pointerType}, at {Math.round(last.x)}, {Math.round(last.y)}
		{:else}
			last: none yet
		{/if}
	</p>
</div>
