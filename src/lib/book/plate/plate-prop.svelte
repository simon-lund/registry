<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		name: string;
		type: string;
		/** As written in code, e.g. "0" or "'flat'"; left out when there is none. */
		default?: string;
		required?: boolean;
		/** Two-way: bind:name. */
		bindable?: boolean;
		/** One line on what it does, under the type. */
		children?: Snippet;
	}

	let { name, type, default: fallback, required = false, bindable = false, children }: Props = $props();

	// a value in a small box; a long union wraps, and each line keeps its box
	const chip = 'bg-muted rounded px-1.5 py-0.5 font-mono text-xs leading-6 [box-decoration-break:clone]';
</script>

<tr class="border-border border-b align-top">
	<td class="py-3 pr-4">
		<code class="{chip} whitespace-nowrap">{name}</code>
		{#if required || bindable}
			<span class="text-muted-foreground mt-1 block text-xs">{[required && 'required', bindable && 'bindable'].filter(Boolean).join(' · ')}</span>
		{/if}
	</td>
	<td class="py-3 pr-4">
		<code class={chip}>{type}</code>
		{#if children}<span class="text-muted-foreground mt-1.5 block text-xs">{@render children()}</span>{/if}
	</td>
	<td class="py-3">
		{#if fallback !== undefined}<code class="{chip} whitespace-nowrap">{fallback}</code>{:else}<span class="text-muted-foreground">–</span>{/if}
	</td>
</tr>
