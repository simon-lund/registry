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

	let tool = $state<MarkupToolName | null>(null);
	type Comment = { x: number; y: number; text: string; open: boolean };
	let comments = $state<Comment[]>([]);

	// Saved as it is sent: there is nothing to send them all with.
	const save = (c: Comment, text: string) => fetch('/comments', { method: 'POST', body: JSON.stringify({ ...c, text }) });
</script>

{#if tool === 'select'}
	<button
		class="fixed inset-0 cursor-crosshair"
		aria-label="Place a comment here"
		onclick={(e) => comments.push({ x: e.clientX, y: e.clientY, text: '', open: true })}
	></button>
{/if}

<Markup bind:tool>
	{#each comments as c, i (c)}
		<MarkupComment bind:open={c.open} bind:value={c.text} onSend={(text) => save(c, text)}>
			<MarkupCommentPin class="fixed" style="left: {c.x}px; top: {c.y}px" aria-label="Comment {i + 1}">{i + 1}</MarkupCommentPin>
			<MarkupCommentBox placeholder="Add a comment" aria-label="Comment {i + 1}">
				<MarkupCommentSend aria-label="Send"><ArrowUpIcon /></MarkupCommentSend>
			</MarkupCommentBox>
		</MarkupComment>
	{/each}
	<MarkupBar aria-label="Mark up this page">
		<MarkupTools aria-label="Tools">
			<MarkupTool value="select" aria-label="Select"><MousePointer2Icon /></MarkupTool>
		</MarkupTools>
	</MarkupBar>
</Markup>
