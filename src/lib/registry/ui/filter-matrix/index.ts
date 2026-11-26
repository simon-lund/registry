import Root from './filter-matrix.svelte';
import Header from './filter-matrix-header.svelte';
import Body from './filter-matrix-body.svelte';
import Footer from './filter-matrix-footer.svelte';
import Row from './filter-matrix-row.svelte';
import Head from './filter-matrix-head.svelte';
import Cell, { filterMatrixCellVariants, type FilterMatrixCellVariant } from './filter-matrix-cell.svelte';
import Total from './filter-matrix-total.svelte';
import type { FilterMatrixState } from './context.js';
import { matches, type FilterMatrixValue } from './value.js';

export {
	Root,
	Header,
	Body,
	Footer,
	Row,
	Head,
	Cell,
	Total,
	//
	Root as FilterMatrix,
	Header as FilterMatrixHeader,
	Body as FilterMatrixBody,
	Footer as FilterMatrixFooter,
	Row as FilterMatrixRow,
	Head as FilterMatrixHead,
	Cell as FilterMatrixCell,
	Total as FilterMatrixTotal,
	filterMatrixCellVariants,
	matches,
	type FilterMatrixCellVariant,
	type FilterMatrixState,
	type FilterMatrixValue
};
