# Loop Budget — loop-test

> Primary loop: **Bounded PR repair** (scaffolded by loop-init)

## Daily limits

| Loop | Max runs/day | Max tokens/day | Max sub-agent spawns/run |
|------|--------------|----------------|--------------------------|
| Bounded PR repair | 9 repair attempts (3/PR) | 100k | 0 nested; coordinator-managed maker/checker |

## On budget exceed

1. Stop the current run; no scheduler is enabled.
2. Append event to `loop-run-log.md`
3. Record escalation in STATE.md High Priority; no external messages.

## Kill switch

- Local file: `LOOP_PAUSED` (`touch LOOP_PAUSED`). loop:check exits 2.
- Resume after review by removing LOOP_PAUSED.

## Estimate spend

```bash
npx @cobusgreyling/loop-cost --pattern daily-triage
```

Limits are policy, not automatic metering. The circuit breaker enforces ledger-recorded attempts and tokens only; actual agent usage remains unknown unless measured.
