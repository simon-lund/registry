<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '#lib/utils.js';
	import { components } from './catalogue.js';

	interface Props {
		/** Tablet and up: a column beside the content. Phone: one row of links under the header. */
		variant?: 'column' | 'row';
		class?: string;
	}

	let { variant = 'column', class: className }: Props = $props();

	const current = (name: string) => page.url.pathname === `/components/${name}`;
</script>

<nav aria-label="Components" class={cn(variant === 'column' ? 'flex flex-col gap-2' : 'flex flex-col gap-1', className)}>
	<p class={cn('text-muted-foreground text-xs tracking-wide uppercase', variant === 'column' ? 'px-2' : 'sr-only')}>
		Components
	</p>
	<ul
		class={cn(
			'm-0 list-none p-0',
			variant === 'column' ? 'flex flex-col' : 'flex gap-1 overflow-x-auto [scrollbar-width:none]'
		)}
	>
		{#each components as c (c.name)}
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
