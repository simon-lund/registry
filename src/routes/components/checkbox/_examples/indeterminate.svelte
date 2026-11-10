<script lang="ts">
	import { Checkbox } from '#lib/registry/ui/checkbox/index.js';

	const kinds = ['Comments', 'Mentions', 'Reminders'];
	let picked = $state<Record<string, boolean>>({ Comments: true, Mentions: false, Reminders: true });

	const count = $derived(kinds.filter((k) => picked[k]).length);
	// All picked: checked; some: indeterminate; none: unchecked.
	const all = $derived(count === kinds.length);
	const some = $derived(count > 0 && !all);
</script>

<div class="flex flex-col gap-3">
	<label class="flex cursor-pointer items-center gap-2 text-sm font-medium">
		<Checkbox
			checked={all}
			indeterminate={some}
			onCheckedChange={(on) => kinds.forEach((k) => (picked[k] = on))}
		/>
		All notifications
	</label>
	<div class="flex flex-col gap-2 pl-6">
		{#each kinds as kind (kind)}
			<label class="flex cursor-pointer items-center gap-2 text-sm">
				<Checkbox bind:checked={picked[kind]} />
				{kind}
			</label>
		{/each}
	</div>
</div>
