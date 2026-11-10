<script lang="ts">
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import MessageCircleIcon from '@lucide/svelte/icons/message-circle';
	import MousePointer2Icon from '@lucide/svelte/icons/mouse-pointer-2';
	import {
		Markup,
		MarkupLayer,
		MarkupBar,
		MarkupTools,
		MarkupTool,
		MarkupComment,
		MarkupCommentPin,
		MarkupCommentBox,
		MarkupCommentSend,
		type MarkupSpot,
		type MarkupToolName
	} from '#lib/registry/ui/markup/index.js';

	let tool = $state<MarkupToolName | null>(null);
	// what select picked: yours to use, say as context for a chat
	let picked = $state<Element[]>([]);
	type Comment = MarkupSpot & { text: string; open: boolean };
	let comments = $state<Comment[]>([]);

	// Saved as it is sent: there is nothing to send them all with. An element is not data: keep a
	// way to find it again (here its id) and the point on it.
	const save = (c: Comment, text: string) =>
		fetch('/comments', { method: 'POST', body: JSON.stringify({ element: c.element.id, at: c.at, text }) });
</script>

<Markup bind:tool>
	<MarkupLayer bind:selected={picked} onPlace={(spot) => comments.push({ ...spot, text: '', open: true })} />
	{#each comments as c, i (c)}
		<MarkupComment bind:open={c.open} bind:value={c.text} onSend={(text) => save(c, text)}>
			<MarkupCommentPin anchor={c.element} at={c.at} aria-label="Comment {i + 1}">{i + 1}</MarkupCommentPin>
			<MarkupCommentBox placeholder="Add a comment" aria-label="Comment {i + 1}">
				<MarkupCommentSend aria-label="Send"><ArrowUpIcon /></MarkupCommentSend>
			</MarkupCommentBox>
		</MarkupComment>
	{/each}
	<MarkupBar aria-label="Mark up this page">
		<MarkupTools aria-label="Tools">
			<MarkupTool value="select" aria-label="Select"><MousePointer2Icon /></MarkupTool>
			<MarkupTool value="comment" aria-label="Comment"><MessageCircleIcon /></MarkupTool>
		</MarkupTools>
	</MarkupBar>
</Markup>
