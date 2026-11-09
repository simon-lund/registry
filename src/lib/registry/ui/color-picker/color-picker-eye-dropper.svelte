<script lang="ts" module>
	type EyeDropperApi = new () => { open: (options?: { signal?: AbortSignal }) => Promise<{ sRGBHex: string }> };

	// The EyeDropper API is not in lib.dom yet: the part used here (missing outside Chromium).
	declare global {
		interface Window {
			EyeDropper?: EyeDropperApi;
		}
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import PipetteIcon from '@lucide/svelte/icons/pipette';
	import { Button, type ButtonProps } from '#lib/registry/ui/button/index.js';
	import { cn } from '#lib/utils.js';
	import { parseColor } from './color.js';
	import { getColorPicker } from './context.svelte.js';
	import { HIT_AREA } from './look.js';

	/**
	 * ColorPickerEyeDropper: the pipette, a 32px outline Button (44px to touch) that picks a colour
	 * from anywhere on screen with the browser's EyeDropper (Chromium on the desktop). Where the
	 * browser has none (Safari, Firefox, phones) and during server rendering it renders nothing, so
	 * lay it out to work without it. Picking sets the colour and commits; Escape in the browser's
	 * loupe cancels. While the loupe is open the button is busy. `aria-label` is required
	 * ("Pick a colour from the screen"); children replace the icon.
	 *
	 * @example
	 * <ColorPickerEyeDropper aria-label="Pick a colour from the screen" />
	 */
	let {
		ref = $bindable(null),
		class: className,
		'aria-label': ariaLabel,
		children,
		onclick,
		...restProps
	}: Omit<ButtonProps, 'aria-label' | 'href' | 'onclick'> & {
		/** Required: the library carries no copy. */
		'aria-label': string;
		onclick?: (e: MouseEvent) => void;
	} = $props();

	const picker = getColorPicker('ColorPickerEyeDropper');
	let api = $state<EyeDropperApi | undefined>();
	let busy = $state(false);

	// Only in the browser, and only where it exists.
	onMount(() => {
		api = window.EyeDropper;
	});

	async function pick(e: MouseEvent) {
		onclick?.(e);
		if (e.defaultPrevented || !api || busy) return;
		busy = true;
		try {
			const result = await new api().open();
			const rgb = parseColor(result.sRGBHex);
			if (rgb) {
				picker.setRgb(rgb);
				picker.commit();
			}
		} catch {
			// cancelled (Escape) or refused: the colour stays
		} finally {
			busy = false;
		}
	}
</script>

{#if api}
	<Button
		bind:ref
		data-slot="color-picker-eye-dropper"
		variant="outline"
		size="icon"
		class={cn('relative', HIT_AREA, className)}
		aria-label={ariaLabel}
		aria-busy={busy || undefined}
		disabled={picker.disabled}
		onclick={pick}
		{...restProps}
	>
		{#if children}
			{@render children()}
		{:else}
			<PipetteIcon aria-hidden="true" />
		{/if}
	</Button>
{/if}
