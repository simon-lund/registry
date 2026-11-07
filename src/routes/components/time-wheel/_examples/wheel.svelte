<script lang="ts">
	import { Wheel } from '#lib/registry/ui/time-wheel/index.js';

	const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
	let size = $state<string | number>('M');
</script>

<div class="relative flex w-full justify-center">
	<div class="bg-primary/15 pointer-events-none absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 rounded-md"></div>
	<Wheel items={sizes} bind:value={size} loop={false} label="Size" class="w-16" />
</div>
