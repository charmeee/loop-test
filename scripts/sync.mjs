// loop-sync 1.0.0 CLI drops its parsed --json flag; use its shipped API.
import { runSync } from '@cobusgreyling/loop-sync/dist/sync.js';
const report = await runSync({ targetDir: '.', autoFix: false, dryRun: true, verbose: false });
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.level === 'critical' ? 1 : report.level === 'warning' ? 2 : 0;
