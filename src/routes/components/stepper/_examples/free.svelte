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

	const steps = ['Details', 'Photos', 'Price', 'Publish'];

	let step = $state(1);
</script>

<Stepper bind:value={step} linear={false} class="w-full max-w-lg">
	<StepperList aria-label="New listing">
		{#each steps as title, i (title)}
			<StepperItem value={i + 1}>
				<StepperTrigger>
					<StepperIndicator />
					<StepperTitle>{title}</StepperTitle>
				</StepperTrigger>
				{#if i < steps.length - 1}<StepperSeparator />{/if}
			</StepperItem>
		{/each}
	</StepperList>
</Stepper>
