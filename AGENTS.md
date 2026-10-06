# AGENTS.md

## Checks
npm ci
npm test
npm run lint
npm run loop:check

## Bounded L3 operation
Read LOOP.md, loop-constraints.md and your live Orca task. This experiment permits src/*.mjs repairs, commit/push on assigned PR branches, and coordinator merges after independent verification and green CI. Workers own only assigned implementation files. Do not edit tests, gate, CI, package files, or other workers changes. No nested agents. Maximum three repair attempts per PR. No recurring schedule.
