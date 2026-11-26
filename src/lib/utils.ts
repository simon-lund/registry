// The same file `shadcn-svelte init` writes into an app: the same exports, under the same names.
// It ships as the item `utils`, so keep it in step with shadcn-svelte's.

/** Joins class names and lets the later Tailwind class win: shadcn's `cn`, from the `cn` package. */
export { cn } from 'cn';

/** The props of an element, with `ref` bound to it (shadcn-svelte's convention). */
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

/** Props without `child`, for parts that render their own element. */
export type WithoutChild<T> = T extends { child?: unknown } ? Omit<T, 'child'> : T;

/** Props without `children`, for parts that take none. */
export type WithoutChildren<T> = T extends { children?: unknown } ? Omit<T, 'children'> : T;

export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
