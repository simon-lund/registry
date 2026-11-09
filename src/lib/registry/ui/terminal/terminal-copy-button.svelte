<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { Swap, SwapItem } from '#lib/registry/ui/swap/index.js';
	import { getTerminal } from './context.js';
	import TerminalButton from './terminal-button.svelte';

	/**
	 * TerminalCopyButton: copies the output without its escapes. The copy glyph turns into a
	 * check (Swap, base 220ms; a plain fade under reduced motion) for `timeout` ms, the button's
	 * name becomes `copiedLabel` and a polite live region says it once. `aria-label` and
	 * `copiedLabel` are required: no copy inside. Disabled while there is no output (pass `disabled`
	 * to decide yourself). `onCopy` after success, `onError` if the clipboard refused (the button
	 * stays as it was).
	 *
	 * @example
	 * <TerminalCopyButton aria-label="Copy output" copiedLabel="Copied" />
	 */
	let {
		ref = $bindable(null),
		'aria-label': label,
		copiedLabel,
		timeout = 2000,
		onCopy,
		onError,
		onclick,
		...restProps
	}: Omit<ComponentProps<typeof TerminalButton>, 'children' | 'onclick'> & {
		onclick?: (event: MouseEvent) => void;
		/** The button's name while it shows the check, announced once ("Copied"). */
		copiedLabel: string;
		/** How long the check stays, in ms. */
		timeout?: number;
		onCopy?: () => void;
		onError?: (error: Error) => void;
	} = $props();

	const terminal = getTerminal('TerminalCopyButton');
	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function copy(event: MouseEvent) {
		onclick?.(event);
		if (event.defaultPrevented) return;
		try {
			await navigator.clipboard.writeText(terminal.text);
		} catch (e) {
			onError?.(e instanceof Error ? e : new Error(String(e)));
			return;
		}
		copied = true;
		onCopy?.();
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), timeout);
	}

	$effect(() => () => clearTimeout(timer));
</script>

<TerminalButton
	bind:ref
	data-slot="terminal-copy-button"
	data-copied={copied || undefined}
	aria-label={copied ? copiedLabel : label}
	disabled={!terminal.hasText}
	onclick={copy}
	{...restProps}
>
	<Swap>
		<SwapItem active={!copied}><CopyIcon aria-hidden="true" /></SwapItem>
		<SwapItem active={copied}><CheckIcon aria-hidden="true" strokeWidth={2.5} /></SwapItem>
	</Swap>
	<span class="sr-only" aria-live="polite">{copied ? copiedLabel : ''}</span>
</TerminalButton>
