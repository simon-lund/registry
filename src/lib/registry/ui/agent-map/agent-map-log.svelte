<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { duration, getMap } from './context.svelte.js';

	/**
	 * AgentMapLog: every call, newest first, one row each: its mark (turning while it runs, a dot once
	 * done, a cross once failed), its node, what it does, and how long it took. With a node selected,
	 * only that node's calls. Give it a height and `overflow-y-auto` to keep it short.
	 */
	interface Props extends HTMLAttributes<HTMLElement> {
		/** Show at most this many, the newest. */
		limit?: number;
	}

	let { limit, class: className, ...rest }: Props = $props();

	const map = getMap('AgentMapLog');
	const shown = $derived.by(() => {
		const calls = map.selected ? map.calls.filter((c) => c.node === map.selected) : map.calls;
		const newest = [...calls].reverse();
		return limit ? newest.slice(0, limit) : newest;
	});
</script>

{#if shown.length === 0}
	<!-- empty and no-results say different things: nothing has happened, or nothing here has -->
	<p data-slot="agent-map-log" class={cn('text-muted-foreground m-0 text-sm leading-8', className)} {...rest}>
		{map.selected && map.calls.length ? `No calls to ${map.label(map.selected)} yet.` : 'No calls yet.'}
	</p>
{:else}
	<ol data-slot="agent-map-log" aria-label="Calls" class={cn('m-0 flex list-none flex-col p-0 text-sm', className)} {...rest}>
		{#each shown as call (call.id)}
			<li
				data-state={call.state}
				class={cn(
					'grid min-h-8 grid-cols-[1rem_4.5rem_minmax(0,1fr)_auto] items-center gap-x-2',
					'transition-opacity duration-(--dur-base) ease-(--ease-settle) starting:opacity-0',
					call.state === 'done' && 'text-muted-foreground'
				)}
			>
				<svg viewBox="0 0 12 12" class="size-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
					{#if call.state === 'running'}
						<path d="M6 1.25A4.75 4.75 0 1 1 1.25 6" class="origin-center motion-safe:animate-[spin_3s_linear_infinite]" />
					{:else if call.state === 'done'}
						<circle cx="6" cy="6" r="1.5" fill="currentColor" stroke="none" />
					{:else}
						<path d="M3 3l6 6M9 3l-6 6" />
					{/if}
				</svg>
				<span class="text-muted-foreground truncate">{map.label(call.node)}</span>
				<span class={cn('truncate', call.state === 'failed' && 'font-medium')}>{call.label}</span>
				<!-- the mark says the state; the words are for a screen reader -->
				<span class="text-muted-foreground font-mono text-xs tabular-nums">
					<span class="sr-only">{call.state}</span>
					{#if call.ms !== undefined && call.state !== 'running'}{duration(call.ms)}{/if}
				</span>
			</li>
		{/each}
	</ol>
{/if}
