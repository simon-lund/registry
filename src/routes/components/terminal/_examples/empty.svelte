<script lang="ts">
	import {
		Terminal,
		TerminalHeader,
		TerminalTitle,
		TerminalActions,
		TerminalCopyButton,
		TerminalContent,
		TerminalEmpty
	} from '#lib/registry/ui/terminal/index.js';
</script>

<Terminal output="" class="w-full max-w-2xl">
	<TerminalHeader>
		<TerminalTitle>Deploy log</TerminalTitle>
		<TerminalActions>
			<TerminalCopyButton aria-label="Copy output" copiedLabel="Copied" />
		</TerminalActions>
	</TerminalHeader>
	<TerminalContent>
		<TerminalEmpty>No output yet. Start a deploy.</TerminalEmpty>
	</TerminalContent>
</Terminal>
