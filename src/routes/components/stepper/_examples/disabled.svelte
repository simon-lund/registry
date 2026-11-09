<script lang="ts">
	import {
		Stepper,
		StepperList,
		StepperItem,
		StepperTrigger,
		StepperIndicator,
		StepperTitle,
		StepperSeparator,
		StepperContent,
		StepperPrevious,
		StepperNext
	} from '#lib/registry/ui/stepper/index.js';

	const steps = [
		{ title: 'Order', disabled: false },
		{ title: 'Gift wrap', disabled: true },
		{ title: 'Payment', disabled: false }
	];

	let step = $state(1);
</script>

<Stepper bind:value={step} class="w-full max-w-md">
	<StepperList aria-label="Checkout">
		{#each steps as { title, disabled }, i (title)}
			<StepperItem value={i + 1} {disabled}>
				<StepperTrigger>
					<StepperIndicator />
					<StepperTitle>{title}</StepperTitle>
				</StepperTrigger>
				{#if i < steps.length - 1}<StepperSeparator />{/if}
			</StepperItem>
		{/each}
	</StepperList>

	{#each steps as { title }, i (title)}
		<StepperContent value={i + 1} class="text-sm">{title}</StepperContent>
	{/each}

	<div class="flex justify-between">
		<StepperPrevious>Back</StepperPrevious>
		<StepperNext variant="default">Continue</StepperNext>
	</div>
</Stepper>
