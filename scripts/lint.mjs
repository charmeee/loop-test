import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
for (const dir of ['src', 'scripts', 'tests']) {
  for (const file of readdirSync(dir).filter(x => x.endsWith('.mjs')).sort()) {
    const r = spawnSync(process.execPath, ['--check', `${dir}/${file}`], { stdio: 'inherit' });
    if (r.error) throw r.error;
    if (r.status !== 0) process.exit(r.status ?? 1);
  }
}
