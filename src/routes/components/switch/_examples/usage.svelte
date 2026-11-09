<script lang="ts">
	import { Switch } from '#lib/registry/ui/switch/index.js';

	let checked = $state(false);
</script>

<Switch bind:checked aria-label="Reminders" />
