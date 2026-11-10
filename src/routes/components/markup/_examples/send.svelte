<script lang="ts">
	import SendIcon from '@lucide/svelte/icons/send';
	import { Markup, MarkupBar, MarkupNote, MarkupSend, type MarkupStatus } from '#lib/registry/ui/markup/index.js';

	let note = $state('The heading is too large on the phone.');
	let tries = 0;
	let log = $state('nothing sent yet');

	// The first send fails, the next one goes through: the note is kept for the retry.
	async function send(text: string) {
		await new Promise((r) => setTimeout(r, 600));
		if (tries++ === 0) {
			log = 'the first send failed; the note is still there';
			throw new Error('offline');
		}
		log = `sent: ${text}`;
	}
</script>

<div class="relative flex h-40 w-full flex-col items-center gap-2 pt-6">
	<p class="text-muted-foreground m-0 text-sm" aria-live="polite">{log}</p>
	<Markup bind:note onSend={send}>
		<MarkupBar aria-label="Send a note" class="absolute max-w-[calc(100%-1rem)]">
			<MarkupNote placeholder="Add to chat" aria-label="Note" class="sm:w-72">
				<MarkupSend aria-label="Send" size="sm">
					{#snippet children({ status }: { status: MarkupStatus })}
						{#if status === 'failed'}Retry{:else}<SendIcon />{/if}
					{/snippet}
				</MarkupSend>
			</MarkupNote>
		</MarkupBar>
	</Markup>
</div>
