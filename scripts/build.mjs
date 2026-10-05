import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
const root = resolve(process.cwd());
const output = resolve(root, 'dist');
if (dirname(output) !== root) throw new Error('Build output must stay in this checkout.');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp('src', output, { recursive: true });
for (const dir of ['assets', 'templates']) {
  await cp(dir, 'dist/' + dir, { recursive: true });
}
await import('./check-build.mjs');
