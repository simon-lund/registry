<script lang="ts">
	import {
		Stepper,
		StepperList,
		StepperItem,
		StepperTrigger,
		StepperIndicator,
		StepperTitle,
		StepperDescription,
		StepperSeparator
	} from '#lib/registry/ui/stepper/index.js';

	let step = $state(3);
</script>

<Stepper bind:value={step} class="w-full max-w-lg">
	<StepperList aria-label="Checkout">
		<StepperItem value={1}>
			<StepperTrigger>
				<StepperIndicator />
				<StepperTitle>Cart</StepperTitle>
			</StepperTrigger>
			<StepperSeparator />
		</StepperItem>
		<StepperItem value={2} invalid>
			<StepperTrigger>
				<StepperIndicator />
				<StepperTitle>Address</StepperTitle>
				<StepperDescription class="text-destructive">Postcode missing</StepperDescription>
			</StepperTrigger>
			<StepperSeparator />
		</StepperItem>
		<StepperItem value={3}>
			<StepperTrigger>
				<StepperIndicator />
				<StepperTitle>Payment</StepperTitle>
			</StepperTrigger>
		</StepperItem>
	</StepperList>
</Stepper>
