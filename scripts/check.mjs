import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
if (existsSync('LOOP_PAUSED')) { console.error('Loop paused: LOOP_PAUSED exists'); process.exit(2); }
for (const [bin, args] of [
  ['loop-context', ['--check', '--ledger', 'loop-ledger.json', '--max-iterations', '3', '--token-budget', '100000']],
  ['loop', ['doctor', '.']],
]) {
  const result = spawnSync(`node_modules/.bin/${bin}`, args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const sync = spawnSync(process.execPath, ['scripts/sync.mjs'], { stdio: 'inherit' });
if (sync.error) throw sync.error;
process.exitCode = sync.status ?? 1;
