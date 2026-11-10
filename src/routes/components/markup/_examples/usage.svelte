<script lang="ts">
	import PenIcon from '@lucide/svelte/icons/pen';
	import SendIcon from '@lucide/svelte/icons/send';
	import {
		Markup,
		MarkupBar,
		MarkupTools,
		MarkupTool,
		MarkupNote,
		MarkupSend,
		type MarkupToolName
	} from '#lib/registry/ui/markup/index.js';

	let tool = $state<MarkupToolName | null>(null);
</script>

<Markup bind:tool onSend={(note) => console.log(note)}>
	<MarkupBar aria-label="Mark up this page">
		<MarkupTools aria-label="Tools">
			<MarkupTool value="pen" aria-label="Pen"><PenIcon /></MarkupTool>
		</MarkupTools>
		<MarkupNote placeholder="Add to chat" aria-label="Note">
			<MarkupSend aria-label="Send">{#snippet children()}<SendIcon />{/snippet}</MarkupSend>
		</MarkupNote>
	</MarkupBar>
</Markup>
