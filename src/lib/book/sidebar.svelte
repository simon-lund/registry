<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '#lib/utils.js';
	import { groups, inGroup } from './catalogue.js';

	interface Props {
		/** Tablet and up: a column beside the content. Phone: one row of links under the header. */
		variant?: 'column' | 'row';
		class?: string;
	}

	let { variant = 'column', class: className }: Props = $props();

	const current = (name: string) => page.url.pathname === `/components/${name}`;

	// On a phone the links are one scrolling row: keep the page you are on in view. No smooth scroll,
	// this is not a move you made.
	let list = $state<HTMLDivElement>();
	$effect(() => {
		page.url.pathname;
		if (variant !== 'row' || !list) return;
		const link = list.querySelector<HTMLElement>('[aria-current=page]');
		// the row is the links' offset parent, so offsetLeft is already measured from its edge
		if (link) list.scrollLeft = link.offsetLeft - 16;
	});
</script>

<nav aria-label="Components" class={cn(variant === 'column' ? 'flex max-h-[calc(100dvh-3rem)] flex-col gap-4 overflow-y-auto [scrollbar-width:thin]' : 'flex flex-col gap-1', className)}>
	<!-- phone: one row, the groups one after the other -->
	<!-- relative: the groups' visually hidden names are absolute, and must stay inside the scrolling row -->
	<div bind:this={list} class={cn('relative', variant === 'column' ? 'flex flex-col gap-4' : 'flex gap-1 overflow-x-auto [scrollbar-width:none]')}>
		{#each groups as g (g.id)}
			<div class={cn(variant === 'column' ? 'flex flex-col gap-2' : 'flex shrink-0 gap-1')}>
				<!-- a label for its list, not a heading: the page's own h1 comes first -->
				<p
					id="group-{g.id}-{variant}"
					class={cn('text-muted-foreground m-0 text-xs tracking-wide uppercase', variant === 'column' ? 'px-2' : 'sr-only')}
				>
					{g.title}
				</p>
				<ul aria-labelledby="group-{g.id}-{variant}" class={cn('m-0 list-none p-0', variant === 'column' ? 'flex flex-col' : 'flex gap-1')}>
					{#each inGroup(g.id) as c (c.name)}
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
			</div>
		{/each}
	</div>
</nav>
