<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';
	import type { Example } from '../examples.js';
	import PlateCode from './plate-code.svelte';

	interface Props {
		example: Example;
		/** Beside the switch: the state's name. */
		label?: Snippet;
		/** The preview's surface: the stage is large, a state is small. */
		class?: string;
		/** The corner both panels share, so the code sits in the same shape as the preview. */
		rounded?: string;
	}

	let { example, label, class: className, rounded = 'rounded-lg' }: Props = $props();

	const id = $props.id();
	const views = ['preview', 'code'] as const;
	type View = (typeof views)[number];
	let view: View = $state('preview');
	const tabs: Record<View, HTMLButtonElement | undefined> = $state({ preview: undefined, code: undefined });

	// The tabs pattern: the arrows move between the two and show the one they land on.
	function onkeydown(e: KeyboardEvent) {
		if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
		e.preventDefault();
		view = e.key === 'Home' ? 'preview' : e.key === 'End' ? 'code' : view === 'preview' ? 'code' : 'preview';
		tabs[view]?.focus();
	}
</script>

<div class="flex flex-col gap-2">
	<div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
		{#if label}<div class="text-muted-foreground text-sm">{@render label()}</div>{/if}
		<div role="tablist" aria-label="Preview or code" class="bg-muted ml-auto inline-flex rounded-md p-0.5">
			{#each views as v (v)}
				<button
					bind:this={tabs[v]}
					type="button"
					role="tab"
					id="{id}-{v}-tab"
					aria-selected={view === v}
					aria-controls="{id}-{v}"
					tabindex={view === v ? 0 : -1}
					onclick={() => (view = v)}
					{onkeydown}
					class="text-muted-foreground hover:text-foreground focus-visible:ring-ring aria-selected:bg-background aria-selected:text-foreground rounded px-2.5 py-1 text-xs capitalize focus-visible:ring-2 focus-visible:outline-none"
				>
					{v}
				</button>
			{/each}
		</div>
	</div>
	<!-- both panels sit in one grid cell, so the box keeps the taller one's height and nothing
	     below jumps on a switch; the other one is invisible, which also takes it out of the tab
	     order and the accessibility tree, and the example keeps its own state -->
	<div class="grid grid-cols-[minmax(0,1fr)]">
		<div
			role="tabpanel"
			id="{id}-preview"
			aria-labelledby="{id}-preview-tab"
			class={cn('bg-muted flex items-center justify-center [grid-area:1/1]', rounded, view !== 'preview' && 'invisible', className)}
		>
			<example.component />
		</div>
		<div
			role="tabpanel"
			id="{id}-code"
			aria-labelledby="{id}-code-tab"
			class={cn('[grid-area:1/1]', view !== 'code' && 'invisible')}
		>
			<PlateCode code={example.code} label="code" class={cn("h-full", rounded)} />
		</div>
	</div>
</div>
