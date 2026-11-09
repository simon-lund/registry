<script lang="ts">
	import { Popover } from 'bits-ui';
	import {
		ColorPicker,
		ColorPickerArea,
		ColorPickerHue,
		ColorPickerInput,
		ColorPickerTrigger
	} from '#lib/registry/ui/color-picker/index.js';

	let value = $state('#c2552d');
</script>

<div class="flex items-center gap-3">
	<span class="text-muted-foreground text-sm">Label colour</span>
	<ColorPicker bind:value>
		<Popover.Root>
			<Popover.Trigger>
				{#snippet child({ props })}
					<ColorPickerTrigger {...props} aria-label="Label colour: {value}" />
				{/snippet}
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					sideOffset={8}
					aria-label="Label colour"
					class="bg-popover text-popover-foreground z-50 flex w-64 max-w-[calc(100vw-2rem)] flex-col gap-2 rounded-lg border p-3 shadow-lg"
				>
					<ColorPickerArea aria-label="Colour" channelLabels={['Saturation', 'Brightness']} />
					<ColorPickerHue aria-label="Hue" />
					<ColorPickerInput aria-label="Hex value" />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	</ColorPicker>
</div>
