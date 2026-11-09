<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { parseAnsiIncremental, type AnsiLine, type AnsiParse } from './ansi.js';
	import { setTerminal } from './context.js';

	/**
	 * Terminal: command output on the muted surface, flat, in both themes. Owns the output: `output`
	 * is a string with ANSI escapes or an array of lines (each may carry escapes); styles carry across
	 * lines as in a terminal. The parts read it: TerminalContent renders it, TerminalCopyButton copies
	 * it without escapes, TerminalEmpty shows while there is none.
	 *
	 * `streaming`: output is still arriving. The content shows a cursor at its end (steady under
	 * reduced motion) and reports `aria-busy`. Clearing is the consumer's: empty `output` from
	 * TerminalClearButton's `onclick`.
	 *
	 * Long logs stay cheap: when `output` only grew, only the new tail is parsed (with the style
	 * open where it starts) and the lines before it are kept as they were, so they do not render
	 * again. While `streaming`, chunks are taken once per animation frame (several chunks in one
	 * frame cost one update); otherwise, and when the stream ends, every change shows at once.
	 *
	 * ANSI colours are the log's data, so they keep their hue: the `--terminal-*` variables below,
	 * one set for light and one for `.dark`, each at least 4.5:1 on `--muted`. An exact colour (256 or
	 * truecolour) is shown as it came, whatever the theme.
	 *
	 * @example
	 * <Terminal output={log} streaming={running}>
	 *   <TerminalHeader>
	 *     <TerminalTitle><SquareTerminalIcon />Build output</TerminalTitle>
	 *     <TerminalActions>
	 *       <TerminalCopyButton aria-label="Copy output" copiedLabel="Copied" />
	 *       <TerminalClearButton aria-label="Clear output" onclick={() => (log = '')} />
	 *     </TerminalActions>
	 *   </TerminalHeader>
	 *   <TerminalContent>
	 *     <TerminalEmpty>No output yet.</TerminalEmpty>
	 *   </TerminalContent>
	 * </Terminal>
	 */
	let {
		ref = $bindable(null),
		class: className,
		output = '',
		streaming = false,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		ref?: HTMLDivElement | null;
		/** The output: one string with ANSI escapes and newlines, or one string per line. */
		output?: string | readonly string[];
		/** Output is still arriving: a cursor at the end, `aria-busy` on the log. */
		streaming?: boolean;
	} = $props();

	const titleId = $props.id();
	// The parse, continued from the last one while the output only grows (see parseAnsiIncremental).
	let parsed = $state.raw<AnsiParse>(parseAnsiIncremental(untrack(() => output)));
	let frame = 0;
	$effect.pre(() => {
		const out = output;
		if (!streaming) {
			if (frame) cancelAnimationFrame(frame);
			frame = 0;
			parsed = parseAnsiIncremental(out, untrack(() => parsed));
			return;
		}
		// Streaming: one parse per frame, of whatever arrived by then.
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			parsed = parseAnsiIncremental(output, parsed);
		});
	});
	onDestroy(() => {
		if (frame) cancelAnimationFrame(frame);
	});
	const lines = $derived(parsed.lines as AnsiLine[]);
	// Read only by the copy button's click; `hasText` is the cheap check for its disabled state.
	const text = $derived(lines.map((l) => l.map((s) => s.text).join('')).join('\n'));
	const hasText = $derived(lines.some((l) => l.length > 0));
	let hasTitle = $state(false);

	setTerminal({
		get lines() {
			return lines;
		},
		get text() {
			return text;
		},
		get hasText() {
			return hasText;
		},
		get streaming() {
			return streaming;
		},
		titleId: `${titleId}-title`,
		get hasTitle() {
			return hasTitle;
		},
		set hasTitle(v) {
			hasTitle = v;
		}
	});
</script>

<div
	bind:this={ref}
	data-slot="terminal"
	data-streaming={streaming || undefined}
	class={cn(
		'terminal border-border bg-muted text-foreground flex min-w-0 flex-col overflow-hidden rounded-lg border',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>

<style>
	/*
	 * The palette: the log's own colours, not the theme's. Set here, read by TerminalContent,
	 * TerminalStatus and TerminalEmpty. Every value is at least 4.5:1 on --muted, so the surface
	 * colour is just as readable on top of any of them, as a background.
	 */
	.terminal {
		--terminal-dim: color-mix(in oklab, var(--foreground) 65%, var(--muted));
		--terminal-black: #3a3733;
		--terminal-red: #ab2d26;
		--terminal-green: #1f6b3a;
		--terminal-yellow: #725400;
		--terminal-blue: #1f5aa3;
		--terminal-magenta: #853a96;
		--terminal-cyan: #0d656d;
		--terminal-white: #5a5751;
		--terminal-bright-black: #64605a;
		--terminal-bright-red: #bb362c;
		--terminal-bright-green: #26753f;
		--terminal-bright-yellow: #7d5e00;
		--terminal-bright-blue: #2a66b0;
		--terminal-bright-magenta: #9342a4;
		--terminal-bright-cyan: #126f78;
		--terminal-bright-white: #1a1917;
	}
	:global(.dark) .terminal {
		--terminal-black: #aeaba4;
		--terminal-red: #f78d9b;
		--terminal-green: #89e29d;
		--terminal-yellow: #f1e583;
		--terminal-blue: #7abaf7;
		--terminal-magenta: #dabaff;
		--terminal-cyan: #76e2e2;
		--terminal-white: #dedbd3;
		--terminal-bright-black: #c4c1ba;
		--terminal-bright-red: #ffa6b1;
		--terminal-bright-green: #a5f0b4;
		--terminal-bright-yellow: #fcf2a2;
		--terminal-bright-blue: #98cdff;
		--terminal-bright-magenta: #e7ceff;
		--terminal-bright-cyan: #98f0ef;
		--terminal-bright-white: #ffffff;
	}
</style>
