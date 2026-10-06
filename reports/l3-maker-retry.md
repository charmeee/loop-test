# PR3 money repair — attempt 2

Task `task_947bc31be928`, dispatch `ctx_7deead35be7d`.

Exact candidate SHA: `a81eae9f8905265d0a4308e677a28aa0637b7453`. Pushed to `origin/fix/money-rounding`; ls-remote matches and money worktree is clean.

Attempt 1 is now final outcome failure after independent checker rejection of `604c7816e169740f0cd17f6bbda75d86fed127a3`. Its original local success evidence and immutable hashes remain intact in ledger-money.json. Before implementation attempt 2, the circuit breaker ran against that original ledger with `--max-iterations 3 --token-budget 100000` and returned CONTINUE, exit 0. The ledger now has two attempts total; tokensUsed is null (unknown, not measured). No nested agents or schedules.

The implementation parses the finite number's absolute decimal representation (including scientific notation), builds a BigInt coefficient, shifts to cents, and compares the exact remainder with half the divisor. Half values round away from zero; final decimal parsing avoids overflow when cents exceed the finite Number range, and zero is normalized. Non-finite and non-number rejection is retained. No constant tolerance or special-case input patches.

Validation: npm ci passed (0 vulnerabilities), npm test passed 12/12, npm run lint passed, npm run loop:check passed, node --check src/money.mjs passed, and src-only auto-merge gate passed (policy evaluation only; no merge performed). git diff --check passed. Existing loop doctor sync/structural warnings remain non-blocking.

Additional assertion probes passed 32 signed cases: ±1.005→±1.01, ±2.675→±2.68, ±4.015→±4.02, ±10.075→±10.08, ±0.005→±0.01, ordinary values and values immediately around the half-cent boundary, scientific notation, Number.MIN_VALUE, 1e21, and Number.MAX_VALUE. Zero/-zero/-0.001 normalize to positive zero; NaN, infinities, string, null, and undefined reject. Full probe script and outputs plus original-check outputs are in reports/ledger-money.json.

Seed-to-candidate implementation diff contains only src/money.mjs; no tests, packages, CI, gates, or policy changes. All three fixture SHA256 hashes match the unchanged reports/l3-manifest.json before and after validation:

- `tests/app.test.mjs`: `fadefb8ea866d27ff3d9c9fe0c74648a120487e338c71d740b83bb774e46c056`
- `tests/loop.test.mjs`: `5adeab2ab74153a7c21f077c03b048dc3bc6ae27366470fef614a5bb5905bb34`
- `tests/money.test.mjs`: `7542f537d2b89f98feed348a85117acdee0287bb5d61fad0e7a467f1644ec345`

Local attempt 2 outcome: success. Exact-SHA independent checker approval and remote green CI remain for the coordinator; no merge performed.
