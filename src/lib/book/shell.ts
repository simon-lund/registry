const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** A shell line in the code tokens: the command in ink, a URL as a string, the rest in stone. */
export const shell = (line: string) =>
	line
		.split(' ')
		.map((word, i) =>
			i === 0
				? `<span style="color:var(--code-token-function)">${escape(word)}</span>`
				: /^https?:/.test(word)
					? `<span style="color:var(--code-token-string)">${escape(word)}</span>`
					: escape(word)
		)
		.join(' ');
