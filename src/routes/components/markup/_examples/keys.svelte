<script lang="ts">
	import PenIcon from '@lucide/svelte/icons/pen';
	import { Markup, MarkupBar, MarkupTools, MarkupTool, MarkupNote, type MarkupToolName } from '#lib/registry/ui/markup/index.js';

	let tool = $state<MarkupToolName | null>('pen');
	let heard = $state<string[]>([]);

	// What a slide deck would listen to: every key that reaches the page.
	$effect(() => {
		const listen = (e: KeyboardEvent) => (heard = [e.key === ' ' ? 'Space' : e.key, ...heard].slice(0, 6));
		document.addEventListener('keydown', listen);
		return () => document.removeEventListener('keydown', listen);
	});
</script>

<div class="relative flex h-40 w-full flex-col items-center gap-2 pt-6">
	<p class="text-muted-foreground m-0 text-sm">
		The page heard: <span class="text-foreground font-mono">{heard.join(' ') || 'nothing'}</span>
	</p>
	<Markup bind:tool>
		<MarkupBar aria-label="Mark up this page" class="absolute max-w-[calc(100%-1rem)]">
			<MarkupTools aria-label="Tools">
				<MarkupTool value="pen" aria-label="Pen"><PenIcon /></MarkupTool>
			</MarkupTools>
			<MarkupNote placeholder="Type here: space, arrows, Escape" aria-label="Note" class="sm:w-64" />
		</MarkupBar>
	</Markup>
</div>
