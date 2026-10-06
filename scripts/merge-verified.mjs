// One-shot coordinator gate for this user-authorized, seeded L3 experiment.
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const repo = 'charmeee/loop-test';
function cmd(bin, args) {
  const r = spawnSync(bin, args, { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`${bin} failed: ${r.stderr || r.stdout}`);
  return r.stdout.trim();
}
const manifest = JSON.parse(readFileSync('reports/l3-manifest.json', 'utf8'));
const verdicts = JSON.parse(readFileSync('reports/l3-verdicts.json', 'utf8'));
assert.equal(verdicts.integration?.passed, true, 'Combined integration check must pass');
// Fail the whole wave before any remote mutation if any candidate was rejected.
for (const c of manifest.cases) {
  const v = verdicts.candidates.find(x => x.pr === c.pr);
  assert.ok(v && v.verdict === 'APPROVE' && v.testsImmutable === true, `PR ${c.pr}: missing approval`);
}
const receipts = [];
for (const c of manifest.cases) {
  assert.ok(!existsSync('LOOP_PAUSED'), 'Loop is paused');
  const v = verdicts.candidates.find(x => x.pr === c.pr);
  assert.ok(v && v.verdict === 'APPROVE' && v.testsImmutable === true, `PR ${c.pr}: missing approval`);
  const pr = JSON.parse(cmd('gh', ['pr', 'view', String(c.pr), '--repo', repo, '--json', 'state,headRefOid,baseRefName,statusCheckRollup,url']));
  assert.equal(pr.state, 'OPEN');
  assert.equal(pr.baseRefName, 'main');
  assert.equal(pr.headRefOid, v.sha, 'Candidate SHA changed since checker approval');
  assert.ok(pr.statusCheckRollup.length > 0, 'No remote CI evidence');
  for (const check of pr.statusCheckRollup) {
    assert.equal(check.status, 'COMPLETED', 'CI is not completed');
    assert.equal(check.conclusion, 'SUCCESS', 'CI is not green');
  }
  cmd('git', ['fetch', 'origin', c.branch]);
  const paths = cmd('git', ['diff', '--name-only', c.seed_sha, v.sha]).split('\n').filter(Boolean);
  assert.ok(paths.length > 0, 'No actual repair');
  cmd('node_modules/.bin/loop-gate', ['check', '--action', 'auto-merge', '--paths', paths.join(','), '--json']);
  cmd('gh', ['pr', 'merge', String(c.pr), '--repo', repo, '--squash', '--match-head-commit', v.sha]);
  const receipt = JSON.parse(cmd('gh', ['pr', 'view', String(c.pr), '--repo', repo, '--json', 'number,state,mergedAt,mergeCommit,url']));
  assert.equal(receipt.state, 'MERGED');
  receipts.push({ ...receipt, approvedSha: v.sha, repairPaths: paths });
  writeFileSync('reports/l3-merges.json', JSON.stringify(receipts, null, 2) + '\n');
  console.log(`Merged PR #${c.pr}: ${receipt.url}`);
}
