import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Joins class names and lets the later Tailwind class win, as shadcn's `cn`. */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** The props of an element, with `ref` bound to it (shadcn-svelte's convention). */
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

/** Props without `child`, for parts that render their own element. */
export type WithoutChild<T> = T extends { child?: unknown } ? Omit<T, 'child'> : T;

/** Props without `children`, for parts that take none. */
export type WithoutChildren<T> = T extends { children?: unknown } ? Omit<T, 'children'> : T;

export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
