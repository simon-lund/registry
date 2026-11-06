// Builds one story: the copy on one side, the live app in a phone or a window on the other.

export type Frame = 'phone' | 'desktop' | 'screens';

/** A still screen of an app, with a few words under it. */
export interface Screen {
	src: string;
	caption: string;
	alt: string;
}

export interface Showcase {
	/** How far the project is, shown as the pill: "In development", "Prototype". */
	status: string;
	/** The project and its stack, one line under the pill. */
	project: string;
	title: string;
	text: string[];
	frame: Frame;
	/** The live app's address on this site, with the query that opens this story's state. */
	src?: string;
	/** For `screens`: still screens shown side by side instead of a live app. */
	screens?: Screen[];
	/** A picture in the window instead of a live app, for sites that can't be framed. */
	image?: { src: string; alt: string };
	/** A link out under the copy, e.g. to the live site. */
	link?: { href: string; label: string };
	note?: string;
}

const PHONE = { width: 390, height: 844, chrome: 24 };

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) {
	const node = document.createElement(tag);
	if (className) node.className = className;
	if (text) node.textContent = text;
	return node;
}

function copy(s: Showcase) {
	const box = el('div', 'copy');
	// the project line, then the title with its status beside it
	const head = el('div', 'title-row');
	head.append(el('h1', '', s.title), el('span', 'pill', s.status));
	box.append(el('p', 'project', s.project), head);
	for (const t of s.text) box.append(el('p', '', t));
	if (s.link) {
		const a = el('a', 'link', s.link.label);
		a.href = s.link.href;
		a.target = '_blank';
		a.rel = 'noopener';
		box.append(a);
	}
	if (s.note) box.append(el('p', 'note', s.note));
	return box;
}

function screens(list: Screen[]) {
	const row = el('div', 'stills');
	for (const sc of list) {
		const fig = el('figure');
		const device = el('div', 'device');
		const img = el('img');
		img.src = sc.src;
		img.alt = sc.alt;
		img.width = 585;
		img.height = 1266;
		img.loading = 'lazy';
		device.append(img);
		fig.append(device, el('figcaption', '', sc.caption));
		row.append(fig);
	}
	return row;
}

function frame(s: Showcase) {
	if (s.frame === 'screens') return screens(s.screens ?? []);
	let iframe: HTMLElement;
	if (s.image) {
		const img = el('img', 'shot');
		img.src = s.image.src;
		img.alt = s.image.alt;
		iframe = img;
	} else {
		const live = el('iframe');
		live.src = s.src ?? '';
		live.title = s.title;
		live.setAttribute('allow', 'clipboard-write');
		iframe = live;
	}

	if (s.frame === 'desktop') {
		const win = el('div', 'window');
		const bar = el('div', 'bar');
		bar.append(el('span'), el('span'), el('span'));
		win.append(bar, iframe);
		return win;
	}

	const stage = el('div', 'phone-stage');
	const phone = el('div', 'phone-frame');
	// A web app knows no safe areas inside an iframe: a status bar and a home bar keep its edges clear of the rounded screen.
	const screen = el('div', 'phone-screen');
	const status = el('div', 'phone-status');
	status.append(el('span', '', '9:41'), el('span', 'phone-icons'));
	const home = el('div', 'phone-home');
	screen.append(status, iframe, home);
	phone.append(screen);
	stage.append(phone);
	// scale the phone to the window's height, never above its real size
	const fit = () => {
		const room = window.innerHeight - 80;
		const s = Math.min(1, Math.max(0.5, room / (PHONE.height + PHONE.chrome)));
		stage.style.setProperty('--s', String(s));
		phone.style.setProperty('--s', String(s));
	};
	fit();
	window.addEventListener('resize', fit);
	return stage;
}

/** A story's page: the copy and the live app. */
export function showcase(s: Showcase): HTMLElement {
	const page = el('main', `show ${s.frame}`);
	page.append(copy(s), frame(s));
	return page;
}
