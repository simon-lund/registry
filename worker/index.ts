// ui.simon-lund.com: the Storybook and the live apps, for people with the link only.
// The link /k/<key> sets a cookie (an HMAC of the key, never the key) and goes to the start page;
// every other request needs that cookie, or gets a short "private" page. Nothing is indexed.

interface Env {
	ASSETS: Fetcher;
	/** The secret in the shared link: `wrangler secret put SHOWCASE_KEY`. */
	SHOWCASE_KEY?: string;
}

const COOKIE = 'showcase';
const NOINDEX = { 'X-Robots-Tag': 'noindex, nofollow' };

async function sign(key: string): Promise<string> {
	const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
	const mac = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode('showcase-v1'));
	return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function same(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}

function cookie(request: Request, name: string): string | undefined {
	for (const part of (request.headers.get('Cookie') ?? '').split(';')) {
		const [k, ...v] = part.trim().split('=');
		if (k === name) return v.join('=');
	}
}

function privatePage(status: number): Response {
	const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Private</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#faf6f0;color:#1a1917;font:400 1.0625rem/1.6 system-ui,sans-serif}main{max-width:28rem;padding:1.5rem}h1{font:700 1.75rem/1.2 Georgia,serif;margin:0 0 .75rem}p{color:#3a3835;margin:0 0 .5rem}a{color:inherit}</style></head>
<body><main><h1>This page is private</h1><p>It opens with the link I shared with you. If you have it, open it again from there.</p><p><a href="https://simon-lund.com">simon-lund.com</a></p></main></body></html>`;
	return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', ...NOINDEX } });
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/robots.txt') {
			return new Response('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain' } });
		}
		// without a key configured, nobody gets in (fails closed)
		if (!env.SHOWCASE_KEY) return privatePage(403);
		const expected = await sign(env.SHOWCASE_KEY);

		const link = url.pathname.match(/^\/k\/([^/]+)\/?$/);
		if (link) {
			if (!same(link[1], env.SHOWCASE_KEY)) return privatePage(404);
			return new Response(null, {
				status: 302,
				headers: {
					Location: '/',
					'Set-Cookie': `${COOKIE}=${expected}; Path=/; Max-Age=${60 * 60 * 24 * 90}; HttpOnly; Secure; SameSite=Lax`,
					...NOINDEX,
				},
			});
		}

		if (!same(cookie(request, COOKIE) ?? '', expected)) return privatePage(403);

		let response = await env.ASSETS.fetch(request);
		// zettel and Desk are single-page apps: their deep links are answered by their index.html
		const spa = ['/zettel/', '/desk/'].find((prefix) => url.pathname.startsWith(prefix));
		if (response.status === 404 && spa) {
			response = await env.ASSETS.fetch(new Request(new URL(spa, url), request));
		}
		const out = new Response(response.body, response);
		out.headers.set('X-Robots-Tag', NOINDEX['X-Robots-Tag']);
		return out;
	},
} satisfies ExportedHandler<Env>;
