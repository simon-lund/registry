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
	import { Input } from '#lib/registry/ui/input/index.js';

	const steps = ['Account', 'Profile', 'Review'];

	let step = $state(1);
	let furthest = $state(1);
	let email = $state('ada@example.com');
	let name = $state('');
</script>

<Stepper
	bind:value={step}
	onValueChange={(next) => (furthest = Math.max(furthest, next))}
	class="w-full max-w-lg"
>
	<StepperList aria-label="Set up your account">
		{#each steps as title, i (title)}
			<StepperItem value={i + 1}>
				<StepperTrigger>
					<StepperIndicator />
					<StepperTitle>
						{title}{#if i + 1 < furthest}<span class="sr-only">, done</span>{/if}
					</StepperTitle>
				</StepperTrigger>
				{#if i < steps.length - 1}<StepperSeparator />{/if}
			</StepperItem>
		{/each}
	</StepperList>

	<div class="min-h-20">
		<StepperContent value={1}>
			<label class="flex flex-col gap-1.5 text-sm">
				Email
				<Input type="email" required bind:value={email} />
			</label>
		</StepperContent>
		<StepperContent value={2}>
			<label class="flex flex-col gap-1.5 text-sm">
				Your name
				<Input bind:value={name} placeholder="Ada Lovelace" />
			</label>
		</StepperContent>
		<StepperContent value={3}>
			<p class="text-sm">{name || 'No name'}, {email}. Go back to change anything.</p>
		</StepperContent>
	</div>

	<div class="flex justify-between">
		<StepperPrevious>Back</StepperPrevious>
		<StepperNext variant="default">Continue</StepperNext>
	</div>
</Stepper>
