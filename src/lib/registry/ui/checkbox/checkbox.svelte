<script lang="ts">
	import { untrack } from 'svelte';
	import { Checkbox as CheckboxPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';
	import { restoreOnReset } from '#lib/registry/ui/form-reset/index.js';

	/**
	 * Checkbox (bits-ui Checkbox), for a choice that is confirmed later (a form's Save), not one that
	 * applies at once (that is a Switch).
	 *
	 * Motion, one of three looks: unchecked a flat box with a fine line; checked the copper box with
	 * a tick; indeterminate the copper box with a dash. Checking, the copper grows from the centre in
	 * quick 140ms and the tick draws itself along its stroke in the base 220ms, both on settle.
	 * Unchecking, the mark undraws and the copper shrinks away in quick on exit. A dash and a tick
	 * draw out and in, never fade. Pressing gives the box a little (92%). Reduced motion: the mark
	 * and the copper cross-fade.
	 *
	 * 16px drawn, the stock size, so it sits in the same forms; 44px to touch. It has no label of its
	 * own: use `<label for>` with an `id`, or wrap it in the label.
	 *
	 * In a form, with a `name` it always submits: `value` (default "on") while checked and
	 * `uncheckedValue` (default "off") while not, so unchecked is said, not left out. A disabled box
	 * submits nothing, like any disabled control: the field is missing, which a server can read as
	 * "no change". `form.reset()` or a reset button puts it back to the state it mounted with,
	 * drawn and submitted alike (`onCheckedChange` is not called).
	 *
	 * @example
	 * <Checkbox id="terms" bind:checked={agreed} /> <label for="terms">I agree</label>
	 */
	let {
		ref = $bindable(null),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		uncheckedValue = 'off',
		class: className,
		...restProps
	}: Omit<CheckboxPrimitive.RootProps, 'children' | 'child'> & {
		/** What a named box submits while unchecked. */
		uncheckedValue?: string;
	} = $props();

	// form.reset() resets bits-ui's hidden input (to its defaultChecked, set here to the mount
	// state) but not the drawn box: the box goes back there too.
	let mounted: boolean | undefined;
	$effect(() => {
		void restProps.name; // the hidden input comes and goes with the name
		const el = ref;
		if (!el) return;
		const start = (mounted ??= untrack(() => checked));
		return restoreOnReset(
			el,
			() => {
				checked = start;
				indeterminate = false;
			},
			(input) => (input.defaultChecked = start)
		);
	});
</script>

<CheckboxPrimitive.Root
	bind:ref
	bind:checked
	bind:indeterminate
	data-slot="checkbox"
	class={cn(
		'group/checkbox peer border-input dark:bg-input/30 relative inline-grid size-4 shrink-0 cursor-pointer place-items-center rounded-[4px] border align-middle',
		// 44px to touch, without moving layout
		"before:absolute before:top-1/2 before:left-1/2 before:size-11 before:-translate-1/2 before:content-['']",
		'focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-3',
		'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
		'data-[state=checked]:border-primary data-[state=indeterminate]:border-primary',
		'transition-[border-color,box-shadow,scale] duration-(--dur-quick) ease-(--ease-settle)',
		'motion-safe:not-data-disabled:active:scale-[0.92]',
		'data-disabled:cursor-not-allowed data-disabled:opacity-50',
		className
	)}
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		{@const state = indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
		<!-- the copper, 1px over the border so the box is one colour when on -->
		<span data-slot="checkbox-fill" data-state={state} class="fill" aria-hidden="true"></span>
		<svg viewBox="0 0 16 16" class="mark text-primary-foreground relative size-3.5" aria-hidden="true">
			<path data-state={state} class="tick" pathLength="1" d="M3.5 8.5 6.5 11.5 12.5 4.5" />
			<path data-state={state} class="dash" pathLength="1" d="M4 8h8" />
		</svg>
	{/snippet}
</CheckboxPrimitive.Root>
<!-- Unchecked is submitted too: bits-ui's checkbox only sends while checked, this only while not. -->
{#if restProps.name !== undefined}
	<input
		type="hidden"
		name={restProps.name}
		value={uncheckedValue}
		disabled={checked || indeterminate || !!restProps.disabled}
	/>
{/if}

<style>
	/*
	 * Three looks, mutually exclusive (data-state): unchecked · checked · indeterminate. The fill and
	 * each stroke move on their own clock: in, the fill first and the mark after it; out, both at
	 * once and faster.
	 */
	.fill {
		position: absolute;
		inset: -1px;
		border-radius: inherit;
		background: var(--primary);
		scale: 0.4;
		opacity: 0;
		transition:
			scale var(--dur-quick) var(--ease-exit),
			opacity var(--dur-quick) var(--ease-exit);
	}
	.fill:not([data-state='unchecked']) {
		scale: 1;
		opacity: 1;
		transition:
			scale var(--dur-quick) var(--ease-settle),
			opacity var(--dur-quick) var(--ease-settle);
	}

	.tick,
	.dash {
		fill: none;
		stroke: currentColor;
		stroke-width: 2.25;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		transition: stroke-dashoffset var(--dur-quick) var(--ease-exit);
	}
	/* Drawn in after the fill has started, along the stroke: the tick from its short arm. */
	.tick[data-state='checked'],
	.dash[data-state='indeterminate'] {
		stroke-dashoffset: 0;
		transition: stroke-dashoffset var(--dur-base) var(--ease-settle) calc(var(--dur-quick) * 0.5);
	}

	/* Reduced motion: nothing grows or draws; the fill and the mark cross-fade. */
	@media (prefers-reduced-motion: reduce) {
		.fill,
		.fill:not([data-state='unchecked']) {
			scale: 1;
		}
		.tick,
		.dash {
			stroke-dashoffset: 0;
			opacity: 0;
			transition: opacity var(--dur-quick) var(--ease-settle);
		}
		.tick[data-state='checked'],
		.dash[data-state='indeterminate'] {
			opacity: 1;
			transition: opacity var(--dur-quick) var(--ease-settle);
		}
	}
</style>
