<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		name: string;
		type: string;
		/** As written in code, e.g. "0" or "'flat'"; left out for a required prop. */
		default?: string;
		required?: boolean;
		/** Two-way: bind:name. */
		bindable?: boolean;
		children?: Snippet;
	}

	let { name, type, default: fallback, required = false, bindable = false, children }: Props = $props();
</script>

<div class="border-border flex flex-col gap-1 border-b py-3 text-sm">
	<dt class="m-0 flex flex-wrap items-baseline gap-x-2 gap-y-1">
		<code class="text-foreground font-mono">{name}</code>
		{#if required}<span class="text-muted-foreground text-xs">required</span>{/if}
		{#if bindable}<span class="text-muted-foreground text-xs">bindable</span>{/if}
	</dt>
	<dd class="m-0 flex flex-col gap-1">
		<code class="text-muted-foreground font-mono text-xs break-words">{type}{#if fallback !== undefined}&ensp;=&ensp;{fallback}{/if}</code>
		{#if children}<span class="text-foreground">{@render children()}</span>{/if}
	</dd>
</div>
