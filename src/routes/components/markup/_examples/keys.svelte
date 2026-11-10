<script lang="ts">
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import MousePointer2Icon from '@lucide/svelte/icons/mouse-pointer-2';
	import {
		Markup,
		MarkupBar,
		MarkupTools,
		MarkupTool,
		MarkupComment,
		MarkupCommentPin,
		MarkupCommentBox,
		MarkupCommentSend,
		type MarkupToolName
	} from '#lib/registry/ui/markup/index.js';

	let tool = $state<MarkupToolName | null>('select');
	let open = $state(false);
	let text = $state('');
	let heard = $state<string[]>([]);

	// What a slide deck would listen to: every key that reaches the page.
	$effect(() => {
		const listen = (e: KeyboardEvent) => (heard = [e.key === ' ' ? 'Space' : e.key, ...heard].slice(0, 6));
		document.addEventListener('keydown', listen);
		return () => document.removeEventListener('keydown', listen);
	});
</script>

<div class="relative flex h-56 w-full flex-col items-center gap-2 pt-6">
	<p class="text-muted-foreground m-0 text-sm">
		The page heard: <span class="text-foreground font-mono">{heard.join(' ') || 'nothing'}</span>
	</p>
	<Markup bind:tool>
		<MarkupComment bind:open bind:value={text}>
			<MarkupCommentPin class="absolute" style="left: 30%; top: 45%" aria-label="Comment 1">1</MarkupCommentPin>
			<MarkupCommentBox placeholder="Type here: space, arrows, Escape" aria-label="Comment 1">
				<MarkupCommentSend aria-label="Send"><ArrowUpIcon /></MarkupCommentSend>
			</MarkupCommentBox>
		</MarkupComment>
		<MarkupBar aria-label="Mark up this page" class="absolute max-w-[calc(100%-1rem)]">
			<MarkupTools aria-label="Tools">
				<MarkupTool value="select" aria-label="Select"><MousePointer2Icon /></MarkupTool>
			</MarkupTools>
		</MarkupBar>
	</Markup>
</div>
