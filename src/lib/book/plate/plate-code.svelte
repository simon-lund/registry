<script lang="ts">
	import { cn } from '#lib/utils.js';

	interface Props {
		/** The text, copied as is. */
		code: string;
		/** The same text highlighted (see vite.config.ts); shown instead of code when given. */
		html?: string;
		/** Read to assistive tech with the button, e.g. "install command". */
		label?: string;
		class?: string;
	}

	let { code, html, label = 'code', class: className }: Props = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	// Copying a selection works on any click, but only inside the click itself, so it goes first:
	// the plain text in a textarea of its own, never the highlighted markup. The clipboard API,
	// which may ask for permission, is the fallback.
	async function copy() {
		const area = document.createElement('textarea');
		area.value = code;
		area.setAttribute('readonly', '');
		area.style.position = 'fixed';
		area.style.opacity = '0';
		document.body.appendChild(area);
		area.select();
		let done = document.execCommand('copy');
		area.remove();
		if (!done) {
			try {
				await navigator.clipboard.writeText(code);
				done = true;
			} catch {
				// denied: the text is still there to select by hand
			}
		}
		if (!done) return;
		copied = true;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), 1500);
	}
</script>

<!-- the code fills the whole box, scrollbar along the bottom edge; Copy sits in the top corner on
     the box's own surface, and the first lines leave room for it -->
<div class={cn('bg-muted relative flex rounded-md', className)}>
	<pre class="text-muted-foreground m-0 min-w-0 flex-1 overflow-auto py-3 pr-16 pl-4 [scrollbar-width:thin] font-mono text-xs [tab-size:2] select-all"><code>{#if html}{@html html}{:else}{code}{/if}</code></pre>
	<button
		type="button"
		onclick={copy}
		aria-live="polite"
		aria-label={copied ? `Copied the ${label}` : `Copy the ${label}`}
		class="text-muted-foreground hover:text-foreground focus-visible:ring-ring bg-muted absolute top-1.5 right-1.5 rounded px-2 py-1 text-xs focus-visible:ring-2 focus-visible:outline-none"
	>
		{copied ? 'Copied' : 'Copy'}
	</button>
</div>
