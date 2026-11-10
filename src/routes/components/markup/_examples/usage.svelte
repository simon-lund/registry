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
	// on the element select clicked, at that point of its box
	type Comment = { anchor: Element; at: { x: number; y: number }; text: string; open: boolean };
	let comments = $state<Comment[]>([]);

	// Saved as it is sent: there is nothing to send them all with. An element is not data: keep a
	// way to find it again (here its id) and the point on it.
	const save = (c: Comment, text: string) =>
		fetch('/comments', { method: 'POST', body: JSON.stringify({ element: c.anchor.id, at: c.at, text }) });
</script>

{#if tool === 'select'}
	<button
		class="fixed inset-0 cursor-default"
		aria-label="Comment on what is here"
		onclick={(e) => {
			// the element under the click layer
			const el = document.elementsFromPoint(e.clientX, e.clientY)[1];
			const r = el.getBoundingClientRect();
			comments.push({ anchor: el, at: { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }, text: '', open: true });
		}}
	></button>
{/if}

<Markup bind:tool>
	{#each comments as c, i (c)}
		<MarkupComment bind:open={c.open} bind:value={c.text} onSend={(text) => save(c, text)}>
			<MarkupCommentPin anchor={c.anchor} at={c.at} aria-label="Comment {i + 1}">{i + 1}</MarkupCommentPin>
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
