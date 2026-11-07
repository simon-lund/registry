<script lang="ts">
	/** One measurement: what, then how much, in mono. */
	let { label, value }: { label: string; value: string } = $props();
</script>

<div class="flex flex-col gap-0.5">
	<dt class="text-muted-foreground m-0">{label}</dt>
	<dd class="m-0 font-mono">{value}</dd>
</div>
