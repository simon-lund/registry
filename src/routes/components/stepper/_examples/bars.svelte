<script lang="ts">
	import {
		Stepper,
		StepperList,
		StepperItem,
		StepperIndicator,
		StepperPrevious,
		StepperNext
	} from '#lib/registry/ui/stepper/index.js';

	const steps = [1, 2, 3, 4];

	let step = $state(2);
</script>

<Stepper bind:value={step} class="w-full max-w-xs">
	<div class="flex items-center justify-between gap-3">
		<StepperList variant="bars" aria-hidden="true">
			{#each steps as value (value)}
				<StepperItem {value}><StepperIndicator /></StepperItem>
			{/each}
		</StepperList>
		<p class="text-muted-foreground text-sm" aria-live="polite">Step {step} of {steps.length}</p>
	</div>

	<div class="flex justify-between">
		<StepperPrevious size="sm">Back</StepperPrevious>
		<StepperNext size="sm" variant="default">Continue</StepperNext>
	</div>
</Stepper>
