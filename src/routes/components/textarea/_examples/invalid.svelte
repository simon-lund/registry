<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Textarea } from '#lib/registry/ui/textarea/index.js';
</script>

<div class="flex w-full max-w-md flex-col gap-6">
	<Textarea aria-invalid="true" aria-label="Reason" value="Too short." />
	<form class="flex flex-col gap-3" onsubmit={(e) => e.preventDefault()}>
		<Textarea required minlength={10} aria-label="Feedback" placeholder="At least ten characters." />
		<Button type="submit" size="sm" class="self-start">Send</Button>
	</form>
</div>
