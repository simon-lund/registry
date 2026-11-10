<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import type { AgentState } from './context.svelte.js';

	/** The mark and the word for one state. Stands alone in a legend. */
	interface Props extends HTMLAttributes<HTMLSpanElement> {
		state: AgentState;
		exit?: number;
		/** The mark alone, for a row that writes the word itself. */
		markOnly?: boolean;
	}

	let { state, exit, markOnly = false, class: className, ...rest }: Props = $props();

	const words: Record<AgentState, string> = {
		working: 'working',
		waiting: 'waiting',
		'needs-you': 'needs you',
		paused: 'paused',
		done: 'done',
		failed: 'failed'
	};
</script>

<span
	data-state={state}
	class={cn('inline-flex items-center gap-2', className)}
	{...rest}
>
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		aria-hidden="true"
		class="shrink-0"
	>
		{#if state === 'working'}
			<!-- an open arc: it is moving (slowly, and not at all under reduced motion) -->
			<path d="M8 1.75A6.25 6.25 0 1 1 1.75 8" class="origin-center motion-safe:animate-[spin_3s_linear_infinite]" />
		{:else if state === 'waiting'}
			<circle cx="8" cy="8" r="6.25" stroke-dasharray="2.2 2.7" />
		{:else if state === 'needs-you'}
			<circle cx="8" cy="8" r="6.25" />
			<circle cx="8" cy="8" r="2.75" fill="currentColor" stroke="none" />
		{:else if state === 'paused'}
			<circle cx="8" cy="8" r="6.25" />
			<path d="M6.25 5.5v5M9.75 5.5v5" />
		{:else if state === 'done'}
			<circle cx="8" cy="8" r="6.25" stroke-dasharray="3 2" />
			<path d="M5 8.2l2 2 4-4.4" />
		{:else}
			<circle cx="8" cy="8" r="6.25" stroke-dasharray="3 2" />
			<path d="M8 4.75v4M8 11.25v.01" />
		{/if}
	</svg>
	{#if !markOnly}
		<span class={cn(state === 'needs-you' && 'font-medium')}>{words[state]}</span>
	{/if}
</span>
