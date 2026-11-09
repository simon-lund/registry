<script lang="ts">
	import { Switch } from '#lib/registry/ui/switch/index.js';

	let reminders = $state(true);
</script>

<!-- the whole row is the label, and holding it stretches the knob too -->
<label
	class="bg-background border-border flex w-full max-w-sm cursor-pointer items-center gap-4 rounded-lg border p-4 motion-safe:[&:active_[data-slot=switch]]:[--switch-pressed:1]"
>
	<span class="flex min-w-0 flex-1 flex-col gap-0.5">
		<span class="text-sm font-medium">Reminders</span>
		<span class="text-muted-foreground text-sm">A push message the morning a task is due.</span>
	</span>
	<Switch bind:checked={reminders} />
</label>
