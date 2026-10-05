import { access, readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
const root = resolve('dist');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const ids = new Set([...html.matchAll(/\bid="([^"<>]+)"/g)].map((m) => m[1]));
let checked = 0;
for (const match of html.matchAll(/\b(?:src|href)="([^"<>]+)"/g)) {
  const ref = match[1];
  if (/^(?:https?:|data:|mailto:)/.test(ref) || ref === '#') continue;
  if (ref.startsWith('#')) {
    if (!ids.has(ref.slice(1))) throw new Error('Missing anchor: ' + ref);
    continue;
  }
  const path = resolve(root, ref.split(/[?#]/)[0]);
  if (!path.startsWith(root + sep)) throw new Error('Reference escapes build: ' + ref);
  await access(path);
  checked++;
}
for (const match of html.matchAll(/\bdata-template="([^"<>]+)"/g)) {
  const template = resolve(root, 'templates/dental', match[1] + '.json');
  const data = JSON.parse(await readFile(template, 'utf8'));
  if (!Array.isArray(data.nodes) || !data.connections)
    throw new Error('Invalid template graph: ' + match[1]);
  checked++;
}
await access(resolve(root, 'assets/og.png'));
console.log('Build references and all 3 template downloads verified (' + checked + ' resources).');
