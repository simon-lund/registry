<script lang="ts" module>
	import type { AnsiColor, AnsiLine, AnsiStyle } from './ansi.js';

	// Spelled out so Tailwind sees every class (one per colour, foreground and background).
	const FG = [
		'text-(--terminal-black)',
		'text-(--terminal-red)',
		'text-(--terminal-green)',
		'text-(--terminal-yellow)',
		'text-(--terminal-blue)',
		'text-(--terminal-magenta)',
		'text-(--terminal-cyan)',
		'text-(--terminal-white)',
		'text-(--terminal-bright-black)',
		'text-(--terminal-bright-red)',
		'text-(--terminal-bright-green)',
		'text-(--terminal-bright-yellow)',
		'text-(--terminal-bright-blue)',
		'text-(--terminal-bright-magenta)',
		'text-(--terminal-bright-cyan)',
		'text-(--terminal-bright-white)'
	];
	const BG = [
		'bg-(--terminal-black)',
		'bg-(--terminal-red)',
		'bg-(--terminal-green)',
		'bg-(--terminal-yellow)',
		'bg-(--terminal-blue)',
		'bg-(--terminal-magenta)',
		'bg-(--terminal-cyan)',
		'bg-(--terminal-white)',
		'bg-(--terminal-bright-black)',
		'bg-(--terminal-bright-red)',
		'bg-(--terminal-bright-green)',
		'bg-(--terminal-bright-yellow)',
		'bg-(--terminal-bright-blue)',
		'bg-(--terminal-bright-magenta)',
		'bg-(--terminal-bright-cyan)',
		'bg-(--terminal-bright-white)'
	];

	const rgb = (c: AnsiColor & { kind: 'rgb' }) => `rgb(${c.r | 0} ${c.g | 0} ${c.b | 0})`;

	// Classes and an inline style for one run. Only numbers reach the style attribute. Dim with a
	// colour keeps the colour (a dimmed colour would fall under 4.5:1 on the surface).
	function look(s: AnsiStyle): { class: string | undefined; style: string | undefined } {
		let fg = s.fg;
		let bg = s.bg;
		let inkOnColour = false;
		if (s.inverse) {
			// Inverse: the text takes the background (the surface when unset), the run the ink.
			[fg, bg] = [bg, fg ?? { kind: 'ansi', index: 15 }];
			inkOnColour = !fg;
		} else if (bg && !fg) inkOnColour = true;
		const classes: string[] = [];
		const styles: string[] = [];
		// Black or white on a colour is the surface's colour: every palette colour reads on it, and
		// which of black or white would read depends on the theme.
		if (fg?.kind === 'ansi' && bg && [0, 7, 8, 15].includes(fg.index)) classes.push('text-muted');
		else if (fg?.kind === 'ansi') classes.push(FG[fg.index]);
		else if (fg?.kind === 'rgb') styles.push(`color: ${rgb(fg)}`);
		else if (inkOnColour) classes.push('text-muted');
		else if (s.dim) classes.push('text-(--terminal-dim)');
		if (bg?.kind === 'ansi') classes.push(BG[bg.index], 'rounded-[2px]');
		else if (bg?.kind === 'rgb') styles.push(`background-color: ${rgb(bg)}`);
		if (s.bold) classes.push('font-bold');
		if (s.italic) classes.push('italic');
		if (s.underline) classes.push('underline decoration-1 underline-offset-2');
		return { class: classes.join(' ') || undefined, style: styles.join('; ') || undefined };
	}
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getTerminal } from './context.js';

	/**
	 * TerminalContent: the output, monospace, in a native scrolling box (at most 96 spacing units
	 * tall by default: set `h-*` for a fixed height or `[--terminal-max-h:…]`). `ref` is that box.
	 * A live log (`role="log"`, named by the TerminalTitle), so new lines are announced politely;
	 * `aria-busy` while streaming.
	 *
	 * Sticks to the bottom while output arrives; as soon as the reader scrolls up (wheel, touch,
	 * keys, the scrollbar) it stays where they are, and following resumes once they are back at
	 * the end. A text selection in the output is never scrolled away. With lines above the view
	 * the top edge fades out over 16px. Jumps are instant (no smooth scroll to follow a stream;
	 * nothing to shorten under reduced motion).
	 *
	 * `wrap` (default true): long lines wrap, right for a build log on a phone. `wrap={false}`
	 * keeps columns (tables, progress bars) and scrolls sideways.
	 *
	 * Children render after the lines: TerminalEmpty for the empty state.
	 *
	 * @example
	 * <TerminalContent class="h-80"><TerminalEmpty>No output yet.</TerminalEmpty></TerminalContent>
	 */
	let {
		ref = $bindable(null),
		class: className,
		wrap = true,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		ref?: HTMLDivElement | null;
		/** Wrap long lines (default) or keep them and scroll sideways. */
		wrap?: boolean;
	} = $props();

	const terminal = getTerminal('TerminalContent');
	let content = $state<HTMLDivElement | null>(null);
	// Lines above the view: the top edge fades under the header.
	let above = $state(false);

	// Follow the end while the reader is there. `stuck` is decided by where the reader leaves
	// the viewport, so a scroll that is not ours (wheel, touch, keys, the scrollbar) lets go.
	$effect(() => {
		const vp = ref;
		const el = content;
		if (!vp || !el) return;
		let stuck = true;
		const atEnd = () => vp.scrollHeight - vp.scrollTop - vp.clientHeight < 8;
		const selecting = () => {
			const sel = document.getSelection();
			return !!sel && !sel.isCollapsed && !!sel.anchorNode && el.contains(sel.anchorNode);
		};
		const toEnd = () => {
			if (stuck && !selecting()) vp.scrollTop = vp.scrollHeight;
		};
		const onScroll = () => {
			stuck = atEnd();
			above = vp.scrollTop > 0;
		};
		const onWheel = (e: WheelEvent) => {
			if (e.deltaY < 0) stuck = false;
		};
		vp.addEventListener('scroll', onScroll, { passive: true });
		vp.addEventListener('wheel', onWheel, { passive: true });
		const ro = new ResizeObserver(toEnd);
		ro.observe(el);
		ro.observe(vp);
		toEnd();
		onScroll();
		return () => {
			vp.removeEventListener('scroll', onScroll);
			vp.removeEventListener('wheel', onWheel);
			ro.disconnect();
		};
	});

	// Every line but the last renders in the keyed list; the last one (the one still growing, with
	// the cursor) on its own, so a new chunk touches no other line.
	const body = $derived(terminal.lines.slice(0, -1));
	const tail = $derived(terminal.lines.at(-1));
	// On each line, not the log: the template's whitespace between lines must not render. Wrapped
	// lines off screen skip their rendering (content-visibility, 20px until first drawn, then their
	// own height); kept columns do not, as their widths size the sideways scroll.
	const lineClass = $derived(
		cn(
			'min-h-5',
			wrap
				? 'break-words whitespace-pre-wrap [content-visibility:auto] [contain-intrinsic-size:auto_1.25rem]'
				: 'whitespace-pre'
		)
	);
</script>

{#snippet segments(line: AnsiLine)}
	{#each line as segment, j (j)}
		{@const l = look(segment.style)}
		{#if l.class || l.style}<span class={l.class} style={l.style}>{segment.text}</span
			>{:else}{segment.text}{/if}
	{/each}
{/snippet}

<div
	bind:this={ref}
	data-slot="terminal-content"
	data-scrolled={above || undefined}
	class={cn(
		'max-h-(--terminal-max-h) min-h-0 overflow-auto [--terminal-max-h:calc(var(--spacing)*96)] [scrollbar-width:thin]',
		/* With lines above the view, the top 16px fade out under the header. */
		'data-scrolled:[mask-image:linear-gradient(to_bottom,transparent,black_calc(var(--spacing)*4))]',
		className
	)}
	{...restProps}
>
	<div
		bind:this={content}
		role="log"
		aria-labelledby={terminal.hasTitle ? terminal.titleId : undefined}
		aria-busy={terminal.streaming || undefined}
		data-slot="terminal-output"
		class={cn(
			'text-foreground px-4 pt-1 pb-4 font-mono text-[0.8125rem] leading-5 [tab-size:4]',
			!wrap && 'w-max min-w-full'
		)}
	>
		{#each body as line, i (i)}
			<div data-slot="terminal-line" class={lineClass}>{@render segments(line)}</div>
		{/each}
		{#if tail || terminal.streaming}
			<div data-slot="terminal-line" class={lineClass}>
				{#if tail}{@render segments(tail)}{/if}{#if terminal.streaming}<span
						class="terminal-cursor"
						aria-hidden="true"
					></span>{/if}
			</div>
		{/if}
		{@render children?.()}
	</div>
</div>

<style>
	/* A block cursor that blinks in steps while output streams; steady under reduced motion. */
	.terminal-cursor {
		display: inline-block;
		width: 0.6em;
		height: 1.15em;
		margin-left: 1px;
		vertical-align: text-bottom;
		border-radius: 1px;
		background: var(--terminal-dim);
		animation: terminal-blink 1.1s steps(1, end) infinite;
	}
	@keyframes terminal-blink {
		50% {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.terminal-cursor {
			animation: none;
		}
	}
</style>
