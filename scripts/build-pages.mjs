// Builds the static site for GitHub Pages into ./out (works on Windows, macOS and Linux).
//
//   npm run build:pages                      -> served from /portfolio (the repository name)
//   PAGES_BASE_PATH=/other npm run build:pages
//   PAGES_BASE_PATH= npm run build:pages     -> served from the domain root (custom domain)
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const basePath = process.env.PAGES_BASE_PATH ?? '/portfolio';

const result = spawnSync(process.execPath, [require.resolve('next/dist/bin/next'), 'build'], {
  stdio: 'inherit',
  env: { ...process.env, STATIC_EXPORT: 'true', NEXT_PUBLIC_BASE_PATH: basePath },
});

process.exit(result.status ?? 1);
