<script lang="ts">
	import { untrack } from 'svelte';
	import { Checkbox } from 'bits-ui';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { Button } from '#lib/registry/ui/button/index.js';
	import { restoreOnReset } from '#lib/registry/ui/form-reset/index.js';

	const id = $props.id();
	const box =
		'bg-background border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex size-5 shrink-0 items-center justify-center rounded border outline-none focus-visible:ring-3';

	let restored = $state(true);
	let plain = $state(true);
	let ref = $state<HTMLElement | null>(null);

	let mounted: boolean | undefined;
	$effect(() => {
		const el = ref;
		if (!el) return;
		const start = (mounted ??= untrack(() => restored));
		return restoreOnReset(
			el,
			() => (restored = start),
			(input) => (input.defaultChecked = start)
		);
	});
</script>

<form class="flex w-full max-w-xs flex-col gap-4">
	<div class="relative flex items-center gap-3">
		<Checkbox.Root id="{id}-restored" name="restored" bind:ref bind:checked={restored} class={box}>
			{#snippet children({ checked })}
				{#if checked}<CheckIcon class="size-4" />{/if}
			{/snippet}
		</Checkbox.Root>
		<label for="{id}-restored" class="text-sm">With restoreOnReset</label>
	</div>

	<div class="relative flex items-center gap-3">
		<Checkbox.Root id="{id}-plain" name="plain" bind:checked={plain} class={box}>
			{#snippet children({ checked })}
				{#if checked}<CheckIcon class="size-4" />{/if}
			{/snippet}
		</Checkbox.Root>
		<label for="{id}-plain" class="text-sm">Without it</label>
	</div>

	<Button type="reset" variant="outline" class="self-start">Reset</Button>
</form>
