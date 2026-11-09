<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import RotateCcwIcon from '@lucide/svelte/icons/rotate-ccw';
	import SquareTerminalIcon from '@lucide/svelte/icons/square-terminal';
	import { Spinner } from '#lib/registry/ui/spinner/index.js';
	import {
		Terminal,
		TerminalHeader,
		TerminalTitle,
		TerminalStatus,
		TerminalActions,
		TerminalButton,
		TerminalCopyButton,
		TerminalClearButton,
		TerminalContent,
		TerminalEmpty
	} from '#lib/registry/ui/terminal/index.js';

	const sgr = (code: string, text: string) => `\u001b[${code}m${text}\u001b[0m`;
	const dim = (text: string) => sgr('2', text);
	const bold = (text: string) => sgr('1', text);
	const green = (text: string) => sgr('32', text);
	const yellow = (text: string) => sgr('33', text);
	const blue = (text: string) => sgr('34', text);
	const red = (text: string) => sgr('31', text);

	const build = [
		`${dim('$')} pnpm build ${dim('--target web')}`,
		`${blue('info')}  Building ${sgr('35', 'storefront v2.14.0')}`,
		`${blue('info')}  Reading ${bold('site.config.ts')}`,
		`${green('✓')} 214 modules transformed`,
		`${green('✓')} Types checked ${dim('(0 errors)')}`,
		`${yellow('warn')}  ${bold('hero.jpg')} is 2.4 MB, consider a smaller image`,
		`${green('✓')} Styles built ${dim('(theme.css, 38 kB)')}`,
		`${red('error')} Could not reach the image service: timed out`,
		`${blue('info')}  Trying again in 2 s`,
		`${green('✓')} Images optimized ${dim('(48 files)')}`,
		'',
		sgr('1;36', 'Route        Size   First load'),
		`/            4 kB   ${dim('82 kB')}`,
		`/products    9 kB   ${dim('87 kB')}`,
		`/checkout    6 kB   ${dim('84 kB')}`,
		'',
		`${green('✓')} ${bold('Done.')} Output in ${bold('dist/')}`
	];

	// One of three: nothing has run, it is running, it has finished.
	type Run = 'idle' | 'running' | 'finished';

	let lines = $state<string[]>([]);
	let run = $state<Run>('running');

	$effect(() => {
		if (run !== 'running') return;
		const timer = setInterval(() => {
			lines = [...lines, build[lines.length]];
			if (lines.length === build.length) run = 'finished';
		}, 220);
		return () => clearInterval(timer);
	});

	function restart() {
		lines = [];
		run = 'running';
	}

	function clear() {
		lines = [];
		run = 'idle';
	}
</script>

<Terminal output={lines} streaming={run === 'running'} class="w-full max-w-2xl">
	<TerminalHeader>
		<TerminalTitle><SquareTerminalIcon />Build output</TerminalTitle>
		{#if run === 'running'}
			<TerminalStatus><Spinner aria-hidden="true" class="size-3.5" />Running</TerminalStatus>
		{:else if run === 'finished'}
			<TerminalStatus><CheckIcon aria-hidden="true" />Done in 4.8 s</TerminalStatus>
		{/if}
		<TerminalActions>
			<TerminalButton aria-label="Run again" onclick={restart}>
				<RotateCcwIcon aria-hidden="true" />
			</TerminalButton>
			<TerminalCopyButton aria-label="Copy output" copiedLabel="Copied" />
			<TerminalClearButton aria-label="Clear output" onclick={clear} />
		</TerminalActions>
	</TerminalHeader>
	<TerminalContent class="h-72">
		<TerminalEmpty>No output yet. Run the build.</TerminalEmpty>
	</TerminalContent>
</Terminal>
