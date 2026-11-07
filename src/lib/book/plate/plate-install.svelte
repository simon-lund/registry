<script lang="ts">
	import type { Source } from '../examples.js';
	import { install } from '../catalogue.js';
	import PlateCode from './plate-code.svelte';
	import PlateTablist from './plate-tablist.svelte';

	interface Props {
		/** The registry item's name. */
		name: string;
		/** Its npm dependencies, from meta.json. */
		dependencies?: string[];
		/** Its files, highlighted: the path under components/ui, then the source. */
		files: (Source & { path: string })[];
	}

	let { name, dependencies = [], files }: Props = $props();

	const id = $props.id();
	const tabs = [
		{ value: 'cli', label: 'Command' },
		{ value: 'manual', label: 'Manual' }
	];
	let view = $state('cli');

	// A shell line in the code tokens: the command in ink, a URL as a string, the rest in stone.
	const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
	const shell = (line: string) =>
		line
			.split(' ')
			.map((word, i) =>
				i === 0
					? `<span style="color:var(--code-token-function)">${escape(word)}</span>`
					: /^https?:/.test(word)
						? `<span style="color:var(--code-token-string)">${escape(word)}</span>`
						: escape(word)
			)
			.join(' ');

	const command = $derived(install(name));
	const add = $derived(`pnpm add ${dependencies.join(' ')}`);
</script>

<div class="flex flex-col gap-3">
	<PlateTablist {tabs} bind:value={view} {id} label="Install with the command or by hand" class="self-start" />

	<div role="tabpanel" id="{id}-cli" aria-labelledby="{id}-cli-tab" hidden={view !== 'cli'}>
		<PlateCode code={command} html={shell(command)} label="install command" />
	</div>

	<div role="tabpanel" id="{id}-manual" aria-labelledby="{id}-manual-tab" hidden={view !== 'manual'}>
		<ol class="m-0 flex list-none flex-col gap-6 p-0 [counter-reset:step]">
			{#if dependencies.length}
				<li class="step flex flex-col gap-3">
					<p>Install the dependencies:</p>
					<PlateCode code={add} html={shell(add)} label="dependencies" />
				</li>
			{/if}
			<li class="step flex flex-col gap-3">
				<p>Copy these files into <code>components/ui/{name}/</code>:</p>
				{#each files as file (file.path)}
					<div class="flex flex-col gap-1.5">
						<p class="text-muted-foreground font-mono text-xs">{file.path}</p>
						<PlateCode code={file.code} html={file.html} label={file.path} class="max-h-80" />
					</div>
				{/each}
			</li>
			<li class="step flex flex-col gap-3">
				<p>
					Update the import paths to match your project. The files import <code>cn</code> from
					<code>#lib/utils.js</code>, which a shadcn-svelte project already has.
				</p>
			</li>
		</ol>
	</div>
</div>

<style>
	/* the steps are numbered in a small circle on the line, as on shadcn's pages */
	.step {
		counter-increment: step;
		position: relative;
		padding-left: 2.25rem;
	}
	.step::before {
		content: counter(step);
		position: absolute;
		left: 0;
		top: 0;
		width: 1.5rem;
		height: 1.5rem;
		display: grid;
		place-items: center;
		border-radius: 9999px;
		background: var(--muted);
		color: var(--foreground);
		font-size: 0.75rem;
		font-family: var(--font-mono);
	}
</style>
