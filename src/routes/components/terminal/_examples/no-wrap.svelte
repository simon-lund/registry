<script lang="ts">
	import {
		Terminal,
		TerminalHeader,
		TerminalTitle,
		TerminalContent
	} from '#lib/registry/ui/terminal/index.js';

	const output = [
		'\u001b[1;36mPID    USER     CPU    MEM   COMMAND\u001b[0m',
		'4127   ada      12.4   3.1   node dist/server.js --port 3000 --workers 4 --log-level info',
		'4188   ada       2.0   0.8   postgres: writer process',
		'\u001b[33m4210   root     71.9   9.6   /usr/bin/convert --quality 80 --resize 1600x hero.jpg hero.webp\u001b[0m'
	];
</script>

<Terminal {output} class="w-full max-w-lg">
	<TerminalHeader>
		<TerminalTitle>Processes</TerminalTitle>
	</TerminalHeader>
	<TerminalContent wrap={false} />
</Terminal>
