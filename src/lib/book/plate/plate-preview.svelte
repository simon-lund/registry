<script lang="ts">
	import { cn } from '#lib/utils.js';
	import type { Example } from '../examples.js';
	import PlateCode from './plate-code.svelte';
	import PlateTablist from './plate-tablist.svelte';

	interface Props {
		example: Example;
		/** The preview's surface: its height and padding. */
		class?: string;
	}

	let { example, class: className }: Props = $props();

	const id = $props.id();
	const tabs = [
		{ value: 'preview', label: 'Preview' },
		{ value: 'code', label: 'Code' }
	];
	let view = $state('preview');
</script>

<div class="flex flex-col gap-2">
	<PlateTablist {tabs} bind:value={view} {id} label="Preview or code" class="self-end" />
	<!-- both panels sit in one grid cell, so the box keeps the taller one's height and nothing
	     below jumps on a switch; the other one is invisible, which also takes it out of the tab
	     order and the accessibility tree, and the example keeps its own state -->
	<div class="grid grid-cols-[minmax(0,1fr)]">
		<div
			role="tabpanel"
			id="{id}-preview"
			aria-labelledby="{id}-preview-tab"
			class={cn(
				'bg-muted flex items-center justify-center rounded-xl p-6 [grid-area:1/1] sm:p-10',
				view !== 'preview' && 'invisible',
				className
			)}
		>
			<example.component />
		</div>
		<div
			role="tabpanel"
			id="{id}-code"
			aria-labelledby="{id}-code-tab"
			class={cn('[grid-area:1/1]', view !== 'code' && 'invisible')}
		>
			<PlateCode code={example.code} html={example.html} label="code" class="h-full rounded-xl" />
		</div>
	</div>
</div>
