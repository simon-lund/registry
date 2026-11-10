<script lang="ts">
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import MousePointer2Icon from '@lucide/svelte/icons/mouse-pointer-2';
	import PenIcon from '@lucide/svelte/icons/pen';
	import XIcon from '@lucide/svelte/icons/x';
	import { ColorPickerSwatch } from '#lib/registry/ui/color-picker/index.js';
	import {
		Markup,
		MarkupBar,
		MarkupTools,
		MarkupTool,
		MarkupSeparator,
		MarkupColors,
		MarkupWidths,
		MarkupWidth,
		MarkupNote,
		MarkupSend,
		MarkupClose,
		type MarkupToolName
	} from '#lib/registry/ui/markup/index.js';

	const colours = [
		{ name: 'Red', value: '#e5484d' },
		{ name: 'Orange', value: '#f76b15' },
		{ name: 'Yellow', value: '#ffc53d' },
		{ name: 'Green', value: '#30a46c' },
		{ name: 'Blue', value: '#0090ff' }
	];

	let tool = $state<MarkupToolName | null>('pen');
	let colour = $state('#e5484d');
	let width = $state(3);
	let open = $state(true);
	let sent = $state<string[]>([]);

	// The app decides where a note goes; here it waits a moment and keeps it.
	async function send(note: string) {
		await new Promise((r) => setTimeout(r, 600));
		sent = [note, ...sent];
	}
</script>

<div class="relative flex h-72 w-full flex-col items-center justify-start gap-2 pt-6">
	<p class="text-muted-foreground m-0 text-sm">
		{tool ?? 'no tool'} · <span class="font-mono" style:color={colour}>{colour}</span> · {width}px
	</p>
	{#each sent.slice(0, 3) as note, i (i)}
		<p class="m-0 text-sm">Sent: {note}</p>
	{/each}

	{#if open}
		<Markup bind:tool bind:colour bind:width onSend={send}>
			<MarkupBar aria-label="Mark up this page" class="absolute max-w-[calc(100%-1rem)]">
				<MarkupTools aria-label="Tools">
					<MarkupTool value="select" aria-label="Select"><MousePointer2Icon /></MarkupTool>
					<MarkupTool value="pen" aria-label="Pen"><PenIcon /></MarkupTool>
					<MarkupSeparator />
					<MarkupColors aria-label="Colour">
						{#each colours as c (c.value)}
							<ColorPickerSwatch value={c.value} aria-label={c.name} />
						{/each}
					</MarkupColors>
					<MarkupWidths aria-label="Width">
						<MarkupWidth value={2} aria-label="Thin" />
						<MarkupWidth value={3} aria-label="Medium" />
						<MarkupWidth value={6} aria-label="Thick" />
					</MarkupWidths>
				</MarkupTools>
				<MarkupSeparator />
				<MarkupNote placeholder="Add to chat" aria-label="Note">
					<MarkupSend aria-label="Send">
						{#snippet children()}<ArrowUpIcon />{/snippet}
					</MarkupSend>
				</MarkupNote>
				<MarkupClose aria-label="Close" onclick={() => (open = false)}><XIcon /></MarkupClose>
			</MarkupBar>
		</Markup>
	{:else}
		<button type="button" class="text-muted-foreground mt-auto mb-6 text-sm underline" onclick={() => (open = true)}>Open the bar again</button>
	{/if}
</div>
