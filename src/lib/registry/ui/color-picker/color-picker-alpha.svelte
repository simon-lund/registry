<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { getColorPicker } from './context.svelte.js';
	import { CHECKER } from './look.js';
	import Channel, { channelStops } from './color-picker-channel.svelte';

	/**
	 * ColorPickerAlpha: the opacity slider (bits-ui Slider, 0-100 %): a 32px pill track running from
	 * clear to the colour over a quiet checkerboard, the thumb inside it. Only with the root's `alpha`:
	 * without it the colour is always opaque and this renders nothing.
	 *
	 * Keyboard: arrows step 1 %, Shift + arrows and Page Up / Down 10 %, Home / End the ends; no
	 * step is animated. Inside a vaul drawer it never starts the drag.
	 *
	 * Name it (`aria-label` or `aria-labelledby`); `getValueText` gives its `aria-valuetext`
	 * ("80 % opacity").
	 *
	 * @example
	 * <ColorPickerAlpha aria-label="Opacity" getValueText={(a) => `${a} %`} />
	 */
	let {
		ref = $bindable(null),
		class: className,
		getValueText,
		...restProps
	}: {
		ref?: HTMLElement | null;
		class?: string;
		/** The opacity (0–100) in words for assistive tech (`aria-valuetext`). */
		getValueText?: (percent: number) => string;
		'aria-label'?: string;
		'aria-labelledby'?: string;
		'aria-describedby'?: string;
	} = $props();

	const picker = getColorPicker('ColorPickerAlpha');
	const percent = $derived(Math.round(picker.rgb.a * 100));
	const clear = $derived(picker.opaque.replace(')', ' / 0)'));
	const track = $derived(
		`linear-gradient(to right, ${channelStops([
			[clear, 0],
			[picker.opaque, 1]
		])}), ${CHECKER}`
	);
</script>

{#if picker.alpha}
	<Channel
		bind:ref
		part="color-picker-alpha"
		class={cn(className)}
		value={percent}
		min={0}
		max={100}
		step={1}
		bigStep={10}
		{track}
		disabled={picker.disabled}
		onValue={(p) => picker.setAlpha(p / 100)}
		onCommit={() => picker.commit()}
		{getValueText}
		{...restProps}
	/>
{/if}
