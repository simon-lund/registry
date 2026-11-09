import Root from './terminal.svelte';
import Header from './terminal-header.svelte';
import Title from './terminal-title.svelte';
import Status from './terminal-status.svelte';
import Actions from './terminal-actions.svelte';
import Button from './terminal-button.svelte';
import CopyButton from './terminal-copy-button.svelte';
import ClearButton from './terminal-clear-button.svelte';
import Content from './terminal-content.svelte';
import Empty from './terminal-empty.svelte';
export {
	parseAnsi,
	parseAnsiIncremental,
	stripAnsi,
	ANSI_COLOR_NAMES,
	type AnsiColor,
	type AnsiStyle,
	type AnsiSegment,
	type AnsiLine,
	type AnsiParse
} from './ansi.js';

export {
	Root,
	Header,
	Title,
	Status,
	Actions,
	Button,
	CopyButton,
	ClearButton,
	Content,
	Empty,
	//
	Root as Terminal,
	Header as TerminalHeader,
	Title as TerminalTitle,
	Status as TerminalStatus,
	Actions as TerminalActions,
	Button as TerminalButton,
	CopyButton as TerminalCopyButton,
	ClearButton as TerminalClearButton,
	Content as TerminalContent,
	Empty as TerminalEmpty
};
