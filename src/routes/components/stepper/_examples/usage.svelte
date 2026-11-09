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

	let step = $state(1);
</script>

<Stepper bind:value={step} class="w-full">
	<StepperList aria-label="Checkout">
		<StepperItem value={1}>
			<StepperTrigger>
				<StepperIndicator />
				<StepperTitle>Cart</StepperTitle>
			</StepperTrigger>
			<StepperSeparator />
		</StepperItem>
		<StepperItem value={2}>
			<StepperTrigger>
				<StepperIndicator />
				<StepperTitle>Payment</StepperTitle>
			</StepperTrigger>
		</StepperItem>
	</StepperList>

	<StepperContent value={1}>Two items in your cart.</StepperContent>
	<StepperContent value={2}>Pay by card or invoice.</StepperContent>

	<div class="flex justify-between">
		<StepperPrevious>Back</StepperPrevious>
		<StepperNext variant="default">Continue</StepperNext>
	</div>
</Stepper>
