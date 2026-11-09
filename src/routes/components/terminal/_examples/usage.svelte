<script lang="ts">
	import {
		Terminal,
		TerminalHeader,
		TerminalTitle,
		TerminalActions,
		TerminalCopyButton,
		TerminalContent
	} from '#lib/registry/ui/terminal/index.js';

	const output = '\u001b[32m✓\u001b[0m 12 tests passed\n\u001b[2mFinished in 0.8 s\u001b[0m';
</script>

<Terminal {output} class="w-full">
	<TerminalHeader>
		<TerminalTitle>Test output</TerminalTitle>
		<TerminalActions>
			<TerminalCopyButton aria-label="Copy output" copiedLabel="Copied" />
		</TerminalActions>
	</TerminalHeader>
	<TerminalContent />
</Terminal>
