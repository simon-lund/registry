import Root from './tabs.svelte';
import List, { tabsListVariants } from './tabs-list.svelte';
import Trigger, { tabsTriggerVariants } from './tabs-trigger.svelte';
import Count from './tabs-count.svelte';
import Content from './tabs-content.svelte';
import type { TabsMode } from './context.js';

export {
	Root,
	List,
	Trigger,
	Count,
	Content,
	//
	Root as Tabs,
	List as TabsList,
	Trigger as TabsTrigger,
	Count as TabsCount,
	Content as TabsContent,
	tabsListVariants,
	tabsTriggerVariants,
	type TabsMode
};
