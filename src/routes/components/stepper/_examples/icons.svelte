<script lang="ts">
	import MailIcon from '@lucide/svelte/icons/mail';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import UserIcon from '@lucide/svelte/icons/user';
	import {
		Stepper,
		StepperList,
		StepperItem,
		StepperTrigger,
		StepperIndicator,
		StepperTitle,
		StepperSeparator
	} from '#lib/registry/ui/stepper/index.js';

	const steps = [
		{ title: 'Name', icon: UserIcon },
		{ title: 'Email', icon: MailIcon },
		{ title: 'Address', icon: MapPinIcon }
	];

	let step = $state(2);
</script>

<Stepper bind:value={step} class="w-full max-w-md">
	<StepperList aria-label="Your details">
		{#each steps as { title, icon: Icon }, i (title)}
			<StepperItem value={i + 1}>
				<StepperTrigger>
					<StepperIndicator><Icon /></StepperIndicator>
					<StepperTitle>{title}</StepperTitle>
				</StepperTrigger>
				{#if i < steps.length - 1}<StepperSeparator />{/if}
			</StepperItem>
		{/each}
	</StepperList>
</Stepper>
