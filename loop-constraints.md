# Loop Constraints — bounded L3 experiment

User authorized creating a sample project, feature/fix PRs and L3 repair on 2026-10-06.

## Scope
- Only charmeee/loop-test and seeded experiment PRs.
- Coordinator may create fixtures, tests, CI and initial baseline, commit/push and create PRs.
- Repair workers may edit src/*.mjs only, commit/push their assigned PR branch.
- Never weaken or modify tests to obtain green checks.
- No secrets, auth, production infrastructure, dependency changes or unrelated repos.
- Independent checker must verify exact candidate SHA before coordinator merges.
- Coordinator may merge only experiment PRs after required CI and checker approval; initial test fixtures are explicitly authorized changes, but fixer changes must pass gate.yaml.

## Limits
- Maximum three repair attempts per PR; enforce ledger before retry.
- One finite experiment, no recurring scheduler.
- LOOP_PAUSED stops execution. Log measured tokens or null if unavailable.
- No messages to Slack/email; PR descriptions and commits are authorized by this request.
