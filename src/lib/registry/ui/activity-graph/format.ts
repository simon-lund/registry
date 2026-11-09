import type { ActivityGranularity, ActivityLabel } from './model.js';

// The default label formats: a short month above weeks, a narrow one above the twelve months of
// a year row, a short weekday, a numeric year. One formatter per locale and style.
const cache = new Map<string, Intl.DateTimeFormat>();

function formatter(locale: string, options: Intl.DateTimeFormatOptions) {
	const id = `${locale}|${JSON.stringify(options)}`;
	let f = cache.get(id);
	if (!f) cache.set(id, (f = new Intl.DateTimeFormat(locale, options)));
	return f;
}

export function defaultLabel(label: ActivityLabel, granularity: ActivityGranularity, locale: string): string {
	switch (label.unit) {
		case 'weekday':
			return formatter(locale, { weekday: 'short' }).format(label.date);
		case 'year':
			return formatter(locale, { year: 'numeric' }).format(label.date);
		case 'month':
			return formatter(locale, { month: granularity === 'month' ? 'narrow' : 'short' }).format(label.date);
	}
}
