import type { Category } from './catalogue.js';

/**
 * The category the components list is filtered by, or null for all of them. One for the page, so
 * the sidebar's column and its phone row show the same list. Only a click sets it, in the browser:
 * the server always renders the whole list.
 */
export const filter = $state<{ category: Category | null }>({ category: null });
