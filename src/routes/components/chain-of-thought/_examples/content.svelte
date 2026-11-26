<script lang="ts">
	import BrainIcon from '@lucide/svelte/icons/brain';
	import ImageIcon from '@lucide/svelte/icons/image';
	import {
		ChainOfThought,
		ChainOfThoughtHeader,
		ChainOfThoughtContent,
		ChainOfThoughtStep,
		ChainOfThoughtStepIcon,
		ChainOfThoughtStepLabel,
		ChainOfThoughtStepContent,
		ChainOfThoughtImage,
		ChainOfThoughtImageCaption
	} from '#lib/registry/ui/chain-of-thought/index.js';

	// a stand-in picture, so the example needs no network
	const picture =
		"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 140'><rect width='320' height='140' fill='%23c9c4bb'/><path d='M0 100 L80 60 L140 90 L210 40 L320 95 V140 H0Z' fill='%23a39d92'/></svg>";
</script>

<div class="w-full max-w-md">
	<ChainOfThought open>
		<ChainOfThoughtHeader><BrainIcon />Thought process</ChainOfThoughtHeader>
		<ChainOfThoughtContent>
			<ChainOfThoughtStep>
				<ChainOfThoughtStepIcon />
				<ChainOfThoughtStepLabel>A note on the route</ChainOfThoughtStepLabel>
				<ChainOfThoughtStepContent>
					<p>The ridge path is shorter, but the trail is closed after the first snow.</p>
				</ChainOfThoughtStepContent>
			</ChainOfThoughtStep>
			<ChainOfThoughtStep>
				<ChainOfThoughtStepIcon><ImageIcon /></ChainOfThoughtStepIcon>
				<ChainOfThoughtStepLabel>Looked at the map</ChainOfThoughtStepLabel>
				<ChainOfThoughtStepContent>
					<ChainOfThoughtImage>
						<img src={picture} alt="A map of two ridges" />
						<ChainOfThoughtImageCaption>Ridge path and valley path</ChainOfThoughtImageCaption>
					</ChainOfThoughtImage>
				</ChainOfThoughtStepContent>
			</ChainOfThoughtStep>
		</ChainOfThoughtContent>
	</ChainOfThought>
</div>
