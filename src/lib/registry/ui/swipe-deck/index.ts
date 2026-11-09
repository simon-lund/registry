import Root from './swipe-deck.svelte';
import Stack from './swipe-deck-stack.svelte';
import Card, { SWIPE_DECK_THRESHOLDS, type SwipeDeckThresholds } from './swipe-deck-card.svelte';
import Label from './swipe-deck-label.svelte';
import Empty from './swipe-deck-empty.svelte';
import Actions from './swipe-deck-actions.svelte';
import Action from './swipe-deck-action.svelte';
import Undo from './swipe-deck-undo.svelte';
import type {
	SwipeDeckDirection,
	SwipeDeckVia,
	SwipeDeckUndoVia,
	SwipeDeckEntry,
	SwipeDeckSwipeHandler,
	SwipeDeckUndoHandler
} from './context.svelte.js';

export {
	Root,
	Stack,
	Card,
	Label,
	Empty,
	Actions,
	Action,
	Undo,
	//
	Root as SwipeDeck,
	Stack as SwipeDeckStack,
	Card as SwipeDeckCard,
	Label as SwipeDeckLabel,
	Empty as SwipeDeckEmpty,
	Actions as SwipeDeckActions,
	Action as SwipeDeckAction,
	Undo as SwipeDeckUndo,
	SWIPE_DECK_THRESHOLDS,
	type SwipeDeckThresholds,
	type SwipeDeckDirection,
	type SwipeDeckVia,
	type SwipeDeckUndoVia,
	type SwipeDeckEntry,
	type SwipeDeckSwipeHandler,
	type SwipeDeckUndoHandler
};
