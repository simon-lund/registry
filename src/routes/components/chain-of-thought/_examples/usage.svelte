<script lang="ts">
	import BrainIcon from '@lucide/svelte/icons/brain';
	import SearchIcon from '@lucide/svelte/icons/search';
	import {
		ChainOfThought,
		ChainOfThoughtHeader,
		ChainOfThoughtContent,
		ChainOfThoughtStep,
		ChainOfThoughtStepIcon,
		ChainOfThoughtStepLabel
	} from '#lib/registry/ui/chain-of-thought/index.js';
</script>

<ChainOfThought>
	<ChainOfThoughtHeader><BrainIcon />Thought process</ChainOfThoughtHeader>
	<ChainOfThoughtContent>
		<ChainOfThoughtStep>
			<ChainOfThoughtStepIcon><SearchIcon /></ChainOfThoughtStepIcon>
			<ChainOfThoughtStepLabel>Searched today's events</ChainOfThoughtStepLabel>
		</ChainOfThoughtStep>
	</ChainOfThoughtContent>
</ChainOfThought>
