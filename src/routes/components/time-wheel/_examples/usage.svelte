<script lang="ts">
	import { TimeWheel } from '#lib/registry/ui/time-wheel/index.js';

	let date = $state(new Date());
</script>

<TimeWheel bind:date />
