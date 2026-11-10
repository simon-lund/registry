<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Input } from '#lib/registry/ui/input/index.js';
	import { cn } from '#lib/utils.js';

	/**
	 * ColorPickerInput: a colour as hex in a stock Input, with a preview of it set in at the start,
	 * concentric with the field. Bind it to the same `value` as a ColorPicker and the two follow each
	 * other: a picked swatch shows here, a typed hex picks its swatch.
	 *
	 * Typing a readable hex applies it at once (3 or 6 digits, with or without `#`), written as
	 * `#rrggbb` in lower case. Enter or leaving the field tidies the text to that; if what is there
	 * cannot be read, the field shows the Input's invalid state and `value` stays as it was. Escape
	 * puts the current value back. `bind:invalid` tells you, so a message can say what to fix (point
	 * `aria-describedby` at it). With `name` it submits the text. `class` goes on the wrapper.
	 *
	 * Name it: `aria-label` ("Hex value") or `aria-labelledby`.
	 *
	 * @example
	 * <ColorPickerInput bind:value={colour} aria-label="Hex value" />
	 */
	let {
		ref = $bindable(null),
		value = $bindable(''),
		invalid = $bindable(false),
		disabled = false,
		class: className,
		onfocus,
		onblur,
		oninput,
		onkeydown,
		...restProps
	}: Omit<HTMLInputAttributes, 'type' | 'value' | 'files'> & {
		ref?: HTMLInputElement | null;
		/** The colour, `#rrggbb` once typed here; any CSS colour shows in the preview. */
		value?: string;
		/** Whether the field holds something that cannot be read as hex (after Enter or blur). */
		invalid?: boolean;
	} = $props();

	// #rgb or #rrggbb, the # optional, as lower-case #rrggbb; null when it is not that.
	function readHex(text: string): string | null {
		const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text.trim());
		if (!m) return null;
		const h = m[1].toLowerCase();
		return '#' + (h.length === 3 ? [...h].map((c) => c + c).join('') : h);
	}

	// svelte-ignore state_referenced_locally
	let text = $state(value);
	let editing = $state(false);
	// typed since the last Enter or blur
	let dirty = false;

	// Follows the value while nobody is typing in it.
	$effect.pre(() => {
		const v = value;
		if (!editing) text = v;
	});

	function handleInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		oninput?.(e);
		dirty = true;
		const hex = readHex(text);
		if (!hex) return;
		invalid = false;
		value = hex;
	}

	function finish() {
		// passing through without typing writes nothing
		if (!dirty) return;
		const hex = readHex(text);
		if (!hex) {
			invalid = true;
			return;
		}
		invalid = false;
		dirty = false;
		value = hex;
		text = hex;
	}

	function handleKeyDown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) {
		onkeydown?.(e);
		if (e.defaultPrevented) return;
		if (e.key === 'Enter') {
			e.preventDefault();
			finish();
		} else if (e.key === 'Escape' && (invalid || text !== value)) {
			// only taken when there is something to undo, so an overlay's Escape still closes it
			e.preventDefault();
			e.stopPropagation();
			text = value;
			invalid = false;
			dirty = false;
		}
	}
</script>

<div
	data-slot="color-picker-input"
	data-disabled={disabled ? '' : undefined}
	class={cn('group/input relative w-full min-w-0', className)}
>
	<!-- concentric with the field: its radius less the 6px this sits in -->
	<span
		aria-hidden="true"
		data-slot="color-picker-input-preview"
		class={cn(
			'pointer-events-none absolute top-1.5 left-1.5 size-5 rounded-[calc(var(--radius-lg)-var(--spacing)*1.5)]',
			'shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--foreground)_10%,transparent)]',
			'group-data-disabled/input:opacity-50'
		)}
		style:background={value || 'transparent'}
	></span>
	<Input
		bind:ref
		bind:value={text}
		spellcheck={false}
		autocapitalize="off"
		autocorrect="off"
		autocomplete="off"
		{disabled}
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
