<script lang="ts">
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '#lib/registry/ui/tabs/index.js';
</script>

<Tabs value="account">
	<TabsList aria-label="Settings">
		<TabsTrigger value="account">Account</TabsTrigger>
		<TabsTrigger value="billing">Billing</TabsTrigger>
	</TabsList>
	<TabsContent value="account">Your name and email.</TabsContent>
	<TabsContent value="billing">Your plan and invoices.</TabsContent>
</Tabs>
