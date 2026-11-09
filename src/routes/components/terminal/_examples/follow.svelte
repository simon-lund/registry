<script lang="ts">
	import {
		Terminal,
		TerminalHeader,
		TerminalTitle,
		TerminalContent
	} from '#lib/registry/ui/terminal/index.js';

	const line = (n: number) =>
		`\u001b[32m✓\u001b[0m #${String(n).padStart(3, '0')} synced \u001b[2min ${(n % 9) * 3 + 4} ms\u001b[0m`;

	const total = 400;

	let lines = $state(Array.from({ length: 40 }, (_, i) => line(i + 1)));

	$effect(() => {
		const timer = setInterval(() => {
			lines = [...lines, line(lines.length + 1)];
			if (lines.length === total) clearInterval(timer);
		}, 500);
		return () => clearInterval(timer);
	});
</script>

<Terminal output={lines} streaming={lines.length < total} class="w-full max-w-2xl">
	<TerminalHeader>
		<TerminalTitle>Sync</TerminalTitle>
	</TerminalHeader>
	<TerminalContent class="h-56" />
</Terminal>
