// Tiny static server that behaves like GitHub Pages for this repo:
// the site lives under /akoo/, folders serve index.html, and file names are case-sensitive
// (macOS is not, so a wrong-case path would otherwise only break once published).
import { createServer } from 'node:http';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

export const PREFIX = '/akoo/';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.m4a': 'audio/mp4', '.mp3': 'audio/mpeg', '.txt': 'text/plain; charset=utf-8',
};

/** Look a URL path (starting with PREFIX) up in `root`. Returns { status, headers, body }. */
export async function lookup(root, pathname) {
  const notFound = { status: 404, headers: { 'content-type': 'text/plain' }, body: Buffer.from('Not found') };
  if (!pathname.startsWith(PREFIX)) return notFound;
  let parts;
  try { parts = decodeURIComponent(pathname.slice(PREFIX.length)).split('/').filter(Boolean); } catch { return notFound; }
  if (parts.some(p => p === '..' || p.startsWith('.'))) return notFound;

  let file = root;
  for (const part of parts) {
    const names = await readdir(file).catch(() => []);
    if (!names.includes(part)) return notFound; // exact case only
    file = path.join(file, part);
  }
  let info = await stat(file).catch(() => null);
  if (info?.isDirectory()) {
    if (!pathname.endsWith('/')) return { status: 301, headers: { location: pathname + '/' }, body: Buffer.alloc(0) };
    file = path.join(file, 'index.html');
    info = await stat(file).catch(() => null);
  }
  if (!info?.isFile()) return notFound;
  const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
  return { status: 200, headers: { 'content-type': type }, body: await readFile(file) };
}

export async function serve(root) {
  const server = createServer(async (req, res) => {
    try {
      const r = await lookup(root, new URL(req.url, 'http://localhost').pathname);
      res.writeHead(r.status, { ...r.headers, 'cache-control': 'no-store' });
      res.end(r.body);
    } catch (e) {
      res.writeHead(500); res.end(String(e));
    }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  return {
    origin: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }),
  };
}
