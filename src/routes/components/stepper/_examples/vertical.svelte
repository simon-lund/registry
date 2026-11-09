<script lang="ts">
	import {
		Stepper,
		StepperList,
		StepperItem,
		StepperTrigger,
		StepperIndicator,
		StepperTitle,
		StepperDescription,
		StepperSeparator,
		StepperContent,
		StepperNext
	} from '#lib/registry/ui/stepper/index.js';

	const steps = [
		{ title: 'Choose a plan', description: 'Monthly or yearly', body: 'Yearly saves two months.' },
		{ title: 'Add your team', description: 'Up to five people', body: 'Invite by email.' },
		{ title: 'Start', description: 'Takes a minute', body: 'You can change all of this later.' }
	];

	let step = $state(1);
</script>

<Stepper bind:value={step} orientation="vertical" class="w-full max-w-sm">
	<StepperList aria-label="Getting started">
		{#each steps as { title, description, body }, i (title)}
			<StepperItem value={i + 1}>
				<StepperTrigger>
					<StepperIndicator />
					<StepperTitle>{title}</StepperTitle>
					<StepperDescription>{description}</StepperDescription>
				</StepperTrigger>
				<StepperContent value={i + 1} class="flex flex-col items-start gap-3 pl-11 text-sm">
					{body}
					<StepperNext size="sm" variant="default">Continue</StepperNext>
				</StepperContent>
				{#if i < steps.length - 1}<StepperSeparator />{/if}
			</StepperItem>
		{/each}
	</StepperList>
</Stepper>
