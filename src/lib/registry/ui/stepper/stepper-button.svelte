<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Spinner } from '#lib/registry/ui/spinner/index.js';
	import { cn } from '#lib/utils.js';

	/*
	 * What StepperPrevious and StepperNext share, on a stock Button. Not exported from index.ts.
	 *
	 * `end`: there is no step that way. The button dims but keeps focus (`aria-disabled` instead of
	 * the native attribute), so keyboard focus is never dropped onto the page. Only `disabled` is
	 * the native one.
	 *
	 * `loading`: the label fades out and a Spinner turns over it, so the width stays. The button
	 * keeps focus and reports `aria-busy`. Both states swallow the click, which also stops a submit.
	 */
	let {
		ref = $bindable(null),
		variant = 'outline',
		end = false,
		loading = false,
		onclick,
		class: className,
		children,
		...restProps
	}: Omit<ComponentProps<typeof Button>, 'onclick'> & {
		onclick?: (event: MouseEvent) => void;
		/** No step in this button's direction. */
		end?: boolean;
		/** Under way: a Spinner over the label, `aria-busy`, clicks do nothing. */
		loading?: boolean;
	} = $props();

	const inert = $derived(loading || (end && !restProps.disabled));
</script>

<Button
	bind:ref
	{variant}
	aria-busy={loading || undefined}
	aria-disabled={inert || undefined}
	class={cn(
		'relative aria-disabled:pointer-events-none not-aria-busy:aria-disabled:opacity-50',
		className
	)}
	{...restProps}
	onclick={(event: MouseEvent) => {
		if (inert) {
			event.preventDefault();
			return;
		}
		onclick?.(event);
	}}
>
	<span
		class="inline-flex items-center justify-center gap-[inherit] transition-[opacity,scale] duration-(--dur-quick) ease-(--ease-settle) group-aria-busy/button:scale-95 group-aria-busy/button:opacity-0 motion-reduce:group-aria-busy/button:scale-100"
	>
		{@render children?.()}
	</span>
	{#if loading}
		<span class="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
			<Spinner aria-hidden="true" />
		</span>
	{/if}
</Button>
