<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { CENTRE, getMap } from './context.svelte.js';

	/**
	 * AgentMapHub: the agent, in the middle of AgentMapGraph. Its name (and its model, smaller) are
	 * your children; round it, how full its context is, as a ring and a percentage, when AgentMap has
	 * `context`.
	 *
	 * @example
	 * <AgentMapHub>Claude <span class="text-muted-foreground font-mono text-[11px] font-normal">opus 5.5</span></AgentMapHub>
	 */
	let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();

	const map = getMap('AgentMapHub');
	// the ring's length, so the context can be drawn as a share of it
	const R = 47;
	const length = 2 * Math.PI * R;
	const share = $derived(map.context === null ? null : Math.min(1, Math.max(0, map.context)));
</script>

<div
	data-slot="agent-map-hub"
	class={cn(
		'bg-background absolute grid size-20 -translate-x-1/2 @min-[22rem]/map:size-24 -translate-y-1/2 place-content-center place-items-center gap-0.5 rounded-full text-center text-[13px] leading-5 font-medium @min-[22rem]/map:text-sm',
		className
	)}
	style:left="{CENTRE.x}%"
	style:top="{CENTRE.y}%"
	{...rest}
>
	<svg viewBox="0 0 100 100" class="absolute inset-0 size-full -rotate-90" fill="none" aria-hidden="true">
		<circle cx="50" cy="50" r={R} class="stroke-border" stroke-width="1.5" />
		{#if share !== null}
			<circle
				cx="50"
				cy="50"
				r={R}
				class="stroke-foreground transition-[stroke-dashoffset] duration-(--dur-calm) ease-(--ease-settle)"
				stroke-width="2"
				stroke-linecap="round"
				stroke-dasharray={length}
				stroke-dashoffset={length * (1 - share)}
			/>
		{/if}
	</svg>
	{#if share !== null}
		<span class="text-muted-foreground font-mono text-[10px] leading-3 font-normal tabular-nums">
			<span class="sr-only">context </span>{Math.round(share * 100)}%
		</span>
	{/if}
	{@render children?.()}
</div>
