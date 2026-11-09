<script lang="ts">
	import {
		Terminal,
		TerminalHeader,
		TerminalTitle,
		TerminalContent
	} from '#lib/registry/ui/terminal/index.js';

	const sgr = (code: string | number, text: string) => `\u001b[${code}m${text}\u001b[0m`;
	const names = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];

	const output = [
		names.map((name, i) => sgr(30 + i, name)).join(' '),
		names.map((name, i) => sgr(90 + i, name)).join(' '),
		[
			sgr(1, 'bold'),
			sgr(2, 'dim'),
			sgr(3, 'italic'),
			sgr(4, 'underline'),
			sgr(7, 'inverse')
		].join(' '),
		[sgr(41, ' FAIL '), sgr(42, ' PASS '), sgr('30;43', ' WARN '), sgr('97;44', ' INFO ')].join(' '),
		`256: ${sgr('38;5;67', 'steel')}  truecolour: ${sgr('38;2;150;110;170', 'plum')}`
	];
</script>

<Terminal {output} class="w-full max-w-2xl">
	<TerminalHeader>
		<TerminalTitle>Colours</TerminalTitle>
	</TerminalHeader>
	<TerminalContent />
</Terminal>
