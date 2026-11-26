<script lang="ts">
	import BrainIcon from '@lucide/svelte/icons/brain';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CloudSunIcon from '@lucide/svelte/icons/cloud-sun';
	import SearchIcon from '@lucide/svelte/icons/search';
	import {
		ChainOfThought,
		ChainOfThoughtHeader,
		ChainOfThoughtContent,
		ChainOfThoughtStep,
		ChainOfThoughtStepIcon,
		ChainOfThoughtStepLabel,
		ChainOfThoughtStepDescription,
		ChainOfThoughtStepContent,
		ChainOfThoughtSearchResults,
		ChainOfThoughtSearchResult
	} from '#lib/registry/ui/chain-of-thought/index.js';

	let open = $state(true);
</script>

<div class="w-full max-w-md">
	<ChainOfThought bind:open>
		<ChainOfThoughtHeader><BrainIcon />Thought process</ChainOfThoughtHeader>
		<ChainOfThoughtContent>
			<ChainOfThoughtStep>
				<ChainOfThoughtStepIcon><CalendarIcon /></ChainOfThoughtStepIcon>
				<ChainOfThoughtStepLabel>Read your calendar for today</ChainOfThoughtStepLabel>
				<ChainOfThoughtStepDescription>3 events found</ChainOfThoughtStepDescription>
			</ChainOfThoughtStep>
			<ChainOfThoughtStep>
				<ChainOfThoughtStepIcon><SearchIcon /></ChainOfThoughtStepIcon>
				<ChainOfThoughtStepLabel>Looked for a quiet hour</ChainOfThoughtStepLabel>
				<ChainOfThoughtStepContent>
					<ChainOfThoughtSearchResults aria-label="Sources">
						<ChainOfThoughtSearchResult href="#calendar"><CalendarIcon />Calendar</ChainOfThoughtSearchResult>
						<ChainOfThoughtSearchResult href="#tasks">Tasks</ChainOfThoughtSearchResult>
					</ChainOfThoughtSearchResults>
				</ChainOfThoughtStepContent>
			</ChainOfThoughtStep>
			<ChainOfThoughtStep status="active">
				<ChainOfThoughtStepIcon><CloudSunIcon /></ChainOfThoughtStepIcon>
				<ChainOfThoughtStepLabel>Checking the weather</ChainOfThoughtStepLabel>
			</ChainOfThoughtStep>
			<ChainOfThoughtStep status="pending">
				<ChainOfThoughtStepIcon />
				<ChainOfThoughtStepLabel>Write the plan</ChainOfThoughtStepLabel>
			</ChainOfThoughtStep>
		</ChainOfThoughtContent>
	</ChainOfThought>
</div>
