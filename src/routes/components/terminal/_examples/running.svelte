<script lang="ts">
	import { Spinner } from '#lib/registry/ui/spinner/index.js';
	import {
		Terminal,
		TerminalHeader,
		TerminalTitle,
		TerminalStatus,
		TerminalContent
	} from '#lib/registry/ui/terminal/index.js';

	const green = (text: string) => `\u001b[32m${text}\u001b[0m`;
	const dim = (text: string) => `\u001b[2m${text}\u001b[0m`;

	const next = [
		`${green('✓')} src/cart.test.ts ${dim('(14 tests)')}`,
		`${green('✓')} src/price.test.ts ${dim('(9 tests)')}`,
		`${green('✓')} src/search.test.ts ${dim('(22 tests)')}`,
		dim('Waiting for file changes')
	];

	let lines = $state([dim('$ pnpm test --watch')]);

	$effect(() => {
		const timer = setInterval(() => {
			if (lines.length > next.length) clearInterval(timer);
			else lines = [...lines, next[lines.length - 1]];
		}, 900);
		return () => clearInterval(timer);
	});
</script>

<Terminal output={lines} streaming class="w-full max-w-2xl">
	<TerminalHeader>
		<TerminalTitle>Tests</TerminalTitle>
		<TerminalStatus><Spinner aria-hidden="true" class="size-3.5" />Watching</TerminalStatus>
	</TerminalHeader>
	<TerminalContent class="h-40" />
</Terminal>
