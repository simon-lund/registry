<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getMap } from './context.svelte.js';

	/**
	 * AgentMapStatus: one line, what the agent is doing now: the newest running call ("Shell: Run
	 * the test suite"), and how many more run beside it. Read out as it changes.
	 */
	let { class: className, ...rest }: HTMLAttributes<HTMLParagraphElement> = $props();

	const map = getMap('AgentMapStatus');
	const newest = $derived(map.running.at(-1));
	const more = $derived(map.running.length - 1);
</script>

<p data-slot="agent-map-status" aria-live="polite" class={cn('m-0 h-6 truncate text-sm leading-6', className)} {...rest}>
	{#if newest}
		<span class="font-medium">{map.label(newest.node)}:</span>
		{newest.label}{#if more > 0}{' '}<span class="text-muted-foreground">and {more} more</span>{/if}
	{:else}
		<!-- before the first call too: the log says whether anything has happened -->
		<span class="text-muted-foreground">Nothing is running.</span>
	{/if}
</p>
