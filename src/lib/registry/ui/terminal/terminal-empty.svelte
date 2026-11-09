<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getTerminal } from './context.js';

	/**
	 * TerminalEmpty: what the content says while there is no output and none is arriving
	 * ("No output yet. Start a build."), centred, in the sans. Words only: the TerminalTitle already
	 * carries the terminal's glyph, a second one here would only repeat it. Renders nothing as soon
	 * as there is a line or a stream.
	 *
	 * @example
	 * <TerminalContent><TerminalEmpty>No output yet.</TerminalEmpty></TerminalContent>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & { ref?: HTMLDivElement | null } = $props();

	const terminal = getTerminal('TerminalEmpty');
</script>

{#if terminal.lines.length === 0 && !terminal.streaming}
	<div
		bind:this={ref}
		data-slot="terminal-empty"
		class={cn(
			'flex flex-col items-center justify-center gap-2 py-8 text-center font-sans text-xs whitespace-normal text-(--terminal-dim)',
			className
		)}
		{...restProps}
	>
		{@render children?.()}
	</div>
{/if}
