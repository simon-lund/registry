<script lang="ts">
	/** One measurement: what, and how much, in mono. */
	let { label, value }: { label: string; value: string } = $props();
</script>

<dt class="text-muted-foreground m-0">{label}</dt>
<dd class="m-0 font-mono">{value}</dd>
