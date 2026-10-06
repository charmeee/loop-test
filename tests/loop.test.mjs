import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const run = (bin, args, input) => spawnSync(`node_modules/.bin/${bin}`, args, { encoding: 'utf8', input });
test('fresh ledger permits a report-only run', () => {
  const r = run('loop-context', ['--check', '--ledger', 'loop-ledger.json']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
test('repeated failure trips circuit breaker', () => {
  const input = JSON.stringify({ goal: 'failure injection', attempts: [1,2,3].map(iteration => ({iteration, action:'test', outcome:'failure', error:'same test failure', tokensUsed:10})) });
  const r = run('loop-context', ['--check', '--json'], input);
  assert.equal(r.status, 2, r.stdout + r.stderr);
});
test('token cap trips circuit breaker', () => {
  const input = JSON.stringify({goal:'budget injection', attempts:[{iteration:1, action:'test', outcome:'success', tokensUsed:101}]});
  const r = run('loop-context', ['--check', '--token-budget', '100', '--json'], input);
  assert.equal(r.status, 2, r.stdout + r.stderr);
});
test('sensitive paths require escalation', () => {
  const r = run('loop-gate', ['check','--action','commit','--paths','.env','--json']);
  assert.equal(r.status, 2, r.stdout + r.stderr);
});
test('L3 policy prevents documentation auto-merge', () => {
  const r = run('loop-gate', ['check','--action','auto-merge','--paths','README.md','--json']);
  assert.equal(r.status, 2, r.stdout + r.stderr);
});
test('non-sensitive changes can be reviewed for a manual commit', () => {
  const r = run('loop-gate', ['check','--action','commit','--paths','README.md','--json']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test('kill switch stops before invoking any tools', () => {
  const dir = mkdtempSync(join(tmpdir(), 'loop-paused-'));
  try {
    writeFileSync(join(dir, 'LOOP_PAUSED'), '');
    const r = spawnSync(process.execPath, [resolve('scripts/check.mjs')], { cwd: dir, encoding: 'utf8' });
    assert.equal(r.status, 2, r.stdout + r.stderr);
    assert.match(r.stderr, /Loop paused/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('L3 allows implementation repairs only', () => {
  const r = run('loop-gate', ['check','--action','auto-merge','--paths','src/money.mjs','--json']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
test('L3 rejects test changes', () => {
  const r = run('loop-gate', ['check','--action','auto-merge','--paths','tests/app.test.mjs','--json']);
  assert.equal(r.status, 2, r.stdout + r.stderr);
});
