<script lang="ts">
	import { TimeWheel } from '#lib/registry/ui/time-wheel/index.js';

	let date = $state(new Date(2026, 10, 6, 9, 41));
</script>

<TimeWheel bind:date class="px-4 py-2" />
