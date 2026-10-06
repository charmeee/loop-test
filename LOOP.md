# Loop Configuration — loop-test

## Active Loops

| Pattern | Cadence | Status | Automation prompt |
|---------|---------|--------|-------------------|
| CI Sweeper + PR Babysitter | one finite experiment completed; scheduler disabled | L3 experiment completed | Read STATE.md, run loop-triage, update findings and run log. |

## State

State: STATE.md

Read [STATE.md](STATE.md) before each run. Update Last run, High Priority, Watch List, Recent Noise, and [loop-run-log.md](loop-run-log.md). Repeated findings must be merged, not duplicated.

## Human Gates

User authorized sample feature/fix PRs and autonomous repair. Scope: seeded PRs in charmeee/loop-test only. Maker edits src/*.mjs, verifies gate, commits and pushes. Independent checker validates exact SHA; coordinator merges only after green CI. Tests in seeded fixture PRs are coordinator-authorized; fixer must not edit tests.

## Worktrees

Each candidate PR uses its own Git worktree. Separate Orca checker never implements fixes.

## Connectors

GitHub read/write for the authorized experiment via gh CLI: charmeee/loop-test. MCP is optional and not configured. No Slack or Linear access.

## Budget

See loop-budget.md. Maximum 3 repair attempts per PR, 100k recorded tokens per experiment. Worker sub-agent spawns: zero. Coordinator dispatches maker and independent checker. Token usage must be marked unknown unless measured. Check circuit breaker before a run; exit 2 means escalate.

## Kill switch

Create LOOP_PAUSED to stop local loop:check. No recurring schedule is enabled. Resume by removing the file after review.

## Sources

- https://github.com/cobusgreyling/loop-engineering/blob/main/docs/quickstart.md
- https://github.com/cobusgreyling/loop-engineering/blob/main/patterns/daily-triage.md
