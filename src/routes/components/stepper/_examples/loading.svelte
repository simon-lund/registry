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

	const steps = ['Upload', 'Check', 'Publish'];

	let step = $state(1);
	let saving = $state(false);

	// `validate` may return a promise: the step stays until it settles.
	async function save() {
		saving = true;
		await new Promise((resolve) => setTimeout(resolve, 1200));
		saving = false;
	}
</script>

<Stepper bind:value={step} class="w-full max-w-md">
	<StepperList aria-label="Publish a report">
		{#each steps as title, i (title)}
			<StepperItem value={i + 1} loading={saving && step === i + 1}>
				<StepperTrigger>
					<StepperIndicator />
					<StepperTitle>{title}</StepperTitle>
				</StepperTrigger>
				{#if i < steps.length - 1}<StepperSeparator />{/if}
			</StepperItem>
		{/each}
	</StepperList>

	{#each steps as title, i (title)}
		<StepperContent value={i + 1} class="text-sm">{title}: saved when you continue.</StepperContent>
	{/each}

	<div class="flex justify-between">
		<StepperPrevious disabled={saving}>Back</StepperPrevious>
		<StepperNext variant="default" loading={saving} validate={save}>Save and continue</StepperNext>
	</div>
</Stepper>
