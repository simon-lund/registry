<script lang="ts">
	import { onDestroy } from 'svelte';
	import BrainIcon from '@lucide/svelte/icons/brain';
	import {
		ChainOfThought,
		ChainOfThoughtHeader,
		ChainOfThoughtContent,
		ChainOfThoughtStep,
		ChainOfThoughtStepIcon,
		ChainOfThoughtStepLabel,
		type ChainOfThoughtStepStatus
	} from '#lib/registry/ui/chain-of-thought/index.js';
	import { Button } from '#lib/registry/ui/button/index.js';

	const all = ['Read the question', 'Searched the notes', 'Compared two drafts', 'Wrote the answer'];
	// how many steps have arrived; the last one is under way until the run ends
	let arrived = $state(0);
	let running = $state(false);

	let timer: ReturnType<typeof setInterval> | undefined;
	function run() {
		arrived = 1;
		running = true;
		timer = setInterval(() => {
			if (arrived < all.length) arrived += 1;
			else {
				running = false;
				clearInterval(timer);
			}
		}, 1100);
	}
	// leaving the page mid-run stops the run
	onDestroy(() => clearInterval(timer));
	const statusOf = (i: number): ChainOfThoughtStepStatus => (running && i === arrived - 1 ? 'active' : 'done');
</script>

<div class="flex w-full max-w-md flex-col items-start gap-3">
	<Button size="sm" variant="outline" disabled={running} onclick={run}>{arrived ? 'Run again' : 'Run'}</Button>
	<ChainOfThought open={arrived > 0}>
		<ChainOfThoughtHeader><BrainIcon />{running ? 'Thinking' : 'Thought process'}</ChainOfThoughtHeader>
		<ChainOfThoughtContent>
			{#each all.slice(0, arrived) as step, i (step)}
				<ChainOfThoughtStep status={statusOf(i)}>
					<ChainOfThoughtStepIcon />
					<ChainOfThoughtStepLabel>{step}</ChainOfThoughtStepLabel>
				</ChainOfThoughtStep>
			{/each}
		</ChainOfThoughtContent>
	</ChainOfThought>
</div>
