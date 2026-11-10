<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '#lib/utils.js';
	import { categories, components } from './catalogue.js';
	import { filter } from './filter.svelte.js';

	interface Props {
		/** Tablet and up: a column beside the content. Phone: one row of links under the header. */
		variant?: 'column' | 'row';
		class?: string;
	}

	let { variant = 'column', class: className }: Props = $props();

	const current = (name: string) => page.url.pathname === `/components/${name}`;
	// Still in alphabetical order, only the chosen category's.
	const shown = $derived(
		filter.category ? components.filter((c) => c.category === filter.category) : components
	);

	// On a phone the links are one scrolling row: keep the page you are on in view. No smooth scroll,
	// this is not a move you made.
	let list = $state<HTMLUListElement>();
	$effect(() => {
		page.url.pathname;
		if (variant !== 'row' || !list) return;
		const link = list.querySelector<HTMLElement>('[aria-current=page]');
		if (link) list.scrollLeft = link.offsetLeft - list.offsetLeft - 16;
	});
</script>

<nav aria-label="Components" class={cn(variant === 'column' ? 'flex max-h-[calc(100dvh-3rem)] flex-col gap-2' : 'flex flex-col gap-1', className)}>
	<p class={cn('text-muted-foreground text-xs tracking-wide uppercase', variant === 'column' ? 'px-2' : 'sr-only')}>
		Components
	</p>
	<!-- One category at a time: a tag shows only its components, pressed again it shows them all. -->
	<div
		role="group"
		aria-label="Filter by category"
		class={cn('flex gap-1', variant === 'column' ? 'flex-wrap px-1' : 'overflow-x-auto [scrollbar-width:none]')}
	>
		{#each categories as category (category)}
			<button
				type="button"
				aria-pressed={filter.category === category}
				onclick={() => (filter.category = filter.category === category ? null : category)}
				class="text-muted-foreground hover:text-foreground focus-visible:ring-ring aria-pressed:bg-muted aria-pressed:text-foreground shrink-0 cursor-pointer rounded-md px-1.5 py-0.5 text-xs transition-colors duration-(--dur-quick) focus-visible:ring-2 focus-visible:outline-none aria-pressed:font-medium"
			>
				#{category}
			</button>
		{/each}
	</div>
	<ul
		bind:this={list}
		class={cn(
			'm-0 list-none p-0',
			variant === 'column' ? 'flex min-h-0 flex-col overflow-y-auto [scrollbar-width:thin]' : 'flex gap-1 overflow-x-auto [scrollbar-width:none]'
		)}
	>
		{#each shown as c (c.name)}
			<li class={variant === 'row' ? 'shrink-0' : undefined}>
				<a
					href="/components/{c.name}"
					aria-current={current(c.name) ? 'page' : undefined}
					class="text-muted-foreground hover:text-foreground focus-visible:ring-ring aria-[current=page]:text-foreground aria-[current=page]:bg-muted block rounded-md px-2 py-1.5 text-sm no-underline focus-visible:ring-2 focus-visible:outline-none aria-[current=page]:font-medium"
				>
					{c.title}
				</a>
			</li>
		{/each}
	</ul>
</nav>
