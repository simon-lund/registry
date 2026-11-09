import { getContext, setContext } from 'svelte';
import type { AnsiLine } from './ansi.js';

/*
 * Shared by the Terminal's parts. Not exported from index.ts: the parts are the API.
 * The root parses `output` once; the content renders the lines, the copy button copies the
 * plain text, the empty state shows while there are no lines.
 */
export type TerminalState = {
	readonly lines: AnsiLine[];
	/** The output without escapes, as it goes to the clipboard. */
	readonly text: string;
	/** Whether there is any text to copy (cheaper than reading `text`). */
	readonly hasText: boolean;
	readonly streaming: boolean;
	/** The id TerminalTitle puts on itself, so the log is named by it. */
	readonly titleId: string;
	hasTitle: boolean;
};

const KEY = Symbol('terminal');

export function setTerminal(state: TerminalState) {
	return setContext(KEY, state);
}

export function getTerminal(part: string): TerminalState {
	const state = getContext<TerminalState | undefined>(KEY);
	if (!state) throw new Error(`${part} must be inside <Terminal>`);
	return state;
}
