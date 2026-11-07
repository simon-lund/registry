<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** The first column's heading: "Prop" for a component, "Field" for a type. */
		head?: string;
		children: Snippet;
	}

	/** A part's props (or a type's fields) as a table: name, type, default. */
	let { head = 'Prop', children }: Props = $props();
</script>

<!-- on a phone the table scrolls sideways inside its own box; the page never does -->
<div class="overflow-x-auto">
	<table class="w-full border-collapse text-left text-sm">
		<thead>
			<tr class="border-border border-b">
				<th class="py-2 pr-4 font-medium">{head}</th>
				<th class="py-2 pr-4 font-medium">Type</th>
				<th class="py-2 font-medium">Default</th>
			</tr>
		</thead>
		<tbody>
			{@render children()}
		</tbody>
	</table>
</div>
