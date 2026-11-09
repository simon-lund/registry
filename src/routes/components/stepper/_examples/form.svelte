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
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Input } from '#lib/registry/ui/input/index.js';

	const steps = ['Email', 'Password', 'Name'];

	let step = $state(1);
	let password = $state('');
	let repeat = $state('');
	let created = $state(false);
	let repeatField = $state<HTMLInputElement | null>(null);

	// A custom rule: Continue and the submit both run it, and typing clears it.
	function passwordsMatch() {
		repeatField?.setCustomValidity(repeat === password ? '' : 'The passwords differ.');
	}

	function clearMismatch() {
		repeatField?.setCustomValidity('');
	}

	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		passwordsMatch();
		if (repeatField?.reportValidity()) created = true;
	}
</script>

<form {onsubmit} class="w-full max-w-md">
	<Stepper bind:value={step}>
		<StepperList aria-label="Create an account">
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

		<StepperContent value={1}>
			<label class="flex flex-col gap-1.5 text-sm">
				Email
				<Input type="email" name="email" required placeholder="ada@example.com" />
			</label>
		</StepperContent>
		<StepperContent value={2} class="flex flex-col gap-3">
			<label class="flex flex-col gap-1.5 text-sm">
				Password
				<Input
					type="password"
					required
					minlength={8}
					autocomplete="new-password"
					bind:value={password}
					oninput={clearMismatch}
				/>
			</label>
			<label class="flex flex-col gap-1.5 text-sm">
				Repeat it
				<Input
					type="password"
					required
					autocomplete="new-password"
					bind:ref={repeatField}
					bind:value={repeat}
					oninput={clearMismatch}
				/>
			</label>
		</StepperContent>
		<StepperContent value={3}>
			<label class="flex flex-col gap-1.5 text-sm">
				Your name
				<Input name="name" required autocomplete="name" placeholder="Ada Lovelace" />
			</label>
		</StepperContent>

		<div class="flex flex-wrap items-center gap-2">
			<StepperPrevious>Back</StepperPrevious>
			<StepperNext validate={passwordsMatch}>Continue</StepperNext>
			<Button type="submit" class="ml-auto">Create account</Button>
		</div>
		<p class="text-muted-foreground min-h-5 text-sm" role="status">
			{created ? 'Account created.' : ''}
		</p>
	</Stepper>
</form>
