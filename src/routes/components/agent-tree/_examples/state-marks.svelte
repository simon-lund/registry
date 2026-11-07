<script lang="ts">
	import { AgentTreeState } from '#lib/registry/ui/agent-tree/index.js';
</script>

<ul class="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-sm">
	<li><AgentTreeState state="working" /></li>
	<li><AgentTreeState state="needs-you" /></li>
	<li><AgentTreeState state="failed" exit={1} /></li>
	<li><AgentTreeState state="paused" markOnly aria-label="paused" /></li>
</ul>
