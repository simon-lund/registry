<script lang="ts">
	import {
		Stepper,
		StepperList,
		StepperItem,
		StepperTrigger,
		StepperIndicator,
		StepperTitle,
		StepperSeparator
	} from '#lib/registry/ui/stepper/index.js';

	// Filled in on an earlier visit, so Payment is done while Delivery is not.
	const steps = [
		{ title: 'Address', done: true },
		{ title: 'Delivery', done: false },
		{ title: 'Payment', done: true },
		{ title: 'Review', done: false }
	];

	let step = $state(2);
</script>

<Stepper bind:value={step} class="w-full max-w-lg">
	<StepperList aria-label="Checkout">
		{#each steps as { title, done }, i (title)}
			<StepperItem value={i + 1} {done}>
				<StepperTrigger>
					<StepperIndicator />
					<StepperTitle>{title}</StepperTitle>
				</StepperTrigger>
				{#if i < steps.length - 1}<StepperSeparator />{/if}
			</StepperItem>
		{/each}
	</StepperList>
</Stepper>
