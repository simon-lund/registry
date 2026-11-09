<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Input } from '#lib/registry/ui/input/index.js';
	import { cn } from '#lib/utils.js';
	import { parseColor } from './color.js';
	import { getColorPicker } from './context.svelte.js';
	import { COLOR_HAIRLINE, overChecker } from './look.js';

	/**
	 * ColorPickerInput: the colour as hex in a stock Input, with a swatch of the colour set in at its
	 * start, concentric with the field. It shows `#rrggbb` (`#rrggbbaa` with the root's `alpha` and a
	 * translucent colour), whatever `format` the root writes.
	 *
	 * Typing a readable colour applies it at once (hex with or without `#`, 3 to 8 digits; a pasted
	 * `rgb()`, `hsl()` or `oklch()` too). Enter or leaving the field commits and writes it back as
	 * hex; if what is there cannot be read, the field shows the Input's invalid state and the colour
	 * stays as it was. Escape puts the current colour back. `bind:invalid` tells you, so a message
	 * can say what to fix (point `aria-describedby` at it). `class` goes on the wrapper.
	 *
	 * Name it: `aria-label` ("Hex value") or `aria-labelledby`.
	 *
	 * @example
	 * <ColorPickerInput aria-label="Hex value" bind:invalid aria-describedby="colour-msg" />
	 * {#if invalid}<p id="colour-msg" class="text-destructive text-sm">Enter a hex value, like #3a7bd5.</p>{/if}
	 */
	let {
		ref = $bindable(null),
		invalid = $bindable(false),
		class: className,
		onfocus,
		onblur,
		oninput,
		onkeydown,
		...restProps
	}: Omit<HTMLInputAttributes, 'type' | 'value' | 'files' | 'disabled'> & {
		ref?: HTMLInputElement | null;
		/** Whether the field holds something that cannot be read as a colour (after Enter or blur). */
		invalid?: boolean;
	} = $props();

	const picker = getColorPicker('ColorPickerInput');

	let text = $state(picker.hex);
	let editing = $state(false);
	// typed since the last commit
	let dirty = false;

	// Follows the colour while nobody is typing in it.
	$effect.pre(() => {
		const hex = picker.hex;
		if (!editing) text = hex;
	});

	function handleInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		oninput?.(e);
		dirty = true;
		const rgb = parseColor(text);
		if (!rgb) return;
		invalid = false;
		picker.setRgb(rgb);
	}

	function finish() {
		// passing through without typing writes nothing
		if (!dirty) return;
		const rgb = parseColor(text);
		if (!rgb) {
			invalid = true;
			return;
		}
		invalid = false;
		dirty = false;
		picker.setRgb(rgb);
		text = picker.hex;
		picker.commit();
	}

	function handleKeyDown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) {
		onkeydown?.(e);
		if (e.defaultPrevented) return;
		if (e.key === 'Enter') {
			e.preventDefault();
			finish();
		} else if (e.key === 'Escape' && (invalid || text !== picker.hex)) {
			// only consumed when there is something to undo, so an overlay's Escape still closes it
			e.preventDefault();
			e.stopPropagation();
			text = picker.hex;
			invalid = false;
			dirty = false;
		}
	}
</script>

<div
	data-slot="color-picker-input"
	data-disabled={picker.disabled ? '' : undefined}
	class={cn('group/input relative w-full min-w-0', className)}
>
	<!-- concentric with the field: its radius less the 6px this sits in -->
	<span
		aria-hidden="true"
		data-slot="color-picker-input-swatch"
		class={cn(
			'pointer-events-none absolute top-1.5 left-1.5 size-5 rounded-[calc(var(--radius-lg)-var(--spacing)*1.5)]',
			'group-data-disabled/input:opacity-50',
			COLOR_HAIRLINE
		)}
		style:background={overChecker(picker.css)}
	></span>
	<Input
		bind:ref
		bind:value={text}
		spellcheck={false}
		autocapitalize="off"
		autocorrect="off"
		inputmode="text"
		disabled={picker.disabled}
		aria-invalid={invalid || undefined}
		class="pl-8 font-medium tabular-nums"
		onfocus={(e) => {
			editing = true;
			onfocus?.(e);
		}}
		onblur={(e) => {
			editing = false;
			finish();
			onblur?.(e);
		}}
		oninput={handleInput}
		onkeydown={handleKeyDown}
		{...restProps}
	/>
</div>
