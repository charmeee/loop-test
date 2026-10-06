# L3 견적 계산기 실험 — 2026-10-06

대상: https://github.com/charmeee/loop-test
Orca Run: run_1a57e0e44eda

## 실험 방법

기존 빈 원격 저장소에 견적 계산기 baseline과 GitHub Actions를 등록했습니다. 할인 feature PR #1, 통계 feature PR #2, 반올림 fix PR #3에 의도적으로 경계값 오류를 포함시키고 실제 GitHub CI 실패를 확인했습니다. 이는 실제 서비스에서 발생한 장애가 아니라 승인된 재현 실험입니다.

Orca maker는 실패 CI를 조회하고 PR별 Git worktree에서 구현만 수정했습니다. 별도 checker는 원래 회귀 테스트의 SHA256 해시, 정확한 커밋 SHA, 허용 경로, 로컬 검사와 실제 CI를 확인하고 세 변경을 합친 임시 checkout도 테스트했습니다.

## 실패 후 재시도

첫 후보는 CI가 모두 통과했으나 checker가 roundMoney(10.075)와 roundMoney(4.015), 음수 대칭 입력의 오류를 발견해 PR #3을 거절했습니다. merge-verified.mjs도 이 거절 상태에서 exit 1로 중지했고 원격 머지는 0건이었습니다. first-review 증거를 보존했습니다.

두 번째 maker는 첫 시도의 최종 outcome을 failure로 표시하고 기존 ledger의 max-iterations=3 circuit breaker를 통과한 뒤 소수 표현과 BigInt 계수에 기반한 반올림으로 재수정했습니다. 원래 테스트는 변경하지 않았습니다. 추가 32개 양수/음수·과학적 표기·유한 극값 probe와 원격 CI가 통과했습니다.

## 결과

PR 3개 모두 독립 검증 APPROVE 및 정확한 SHA의 성공 CI 확인 후 자동 게이트를 통과해 squash merge되었습니다. 통합 suite 18/18과 독립 Decimal oracle 2,048개 비교가 통과했습니다. main에는 checker가 발견한 결함과 과학적 표기/극값 회귀 테스트 2개를 추가해 영구 suite는 20개입니다. 이 추가 테스트는 후보 승인 및 머지 이후 coordinator가 작성했으며 원래 fixture는 수정 작업 중 변경하지 않았습니다. 실제 merge SHA는 l3-merges.json에 있습니다.

| PR | 종류 | 수정 시도 | 첫 실패 |
|---|---|---:|---|
| [#1](https://github.com/charmeee/loop-test/pull/1) | 할인 feature | 1 | 잘못된 입력을 허용 |
| [#2](https://github.com/charmeee/loop-test/pull/2) | 통계 feature | 1 | 빈 입력과 비유한 값 |
| [#3](https://github.com/charmeee/loop-test/pull/3) | 반올림 fix | 2 | 소수 반 센트; 첫 checker가 추가 결함 발견 |

## 증거

- l3-manifest.json: 초기 SHA와 원래 테스트 해시, Orca task/dispatch IDs.
- l3-initial-ci.json, initial-ci-*.log: 실제 GitHub 실패 이력.
- l3-maker.md, l3-maker-retry.md, ledger-*.json: 수정/재시도와 검사 출력.
- l3-checker-first-review.md, l3-verdicts-first-review.json: 거절 증거.
- l3-rejection-gate.json: 거절된 후보 머지 차단.
- l3-checker-final.md, l3-verdicts.json: 최종 독립 검증.
- l3-merges.json: 정확한 승인 SHA와 실제 원격 머지 커밋.

## 운영 범위

한 번 실행하는 L3 실험입니다. 정기 스케줄은 활성화하지 않았습니다. 지정된 3개 PR만 처리하고 src/*.mjs repair만 게이트로 허용했습니다. 별도 에이전트 세션을 사용했으나 같은 Codex provider이며 모델 교차 검증은 아닙니다. 테스트를 약화하지 않았고 수정 작업자는 테스트/CI/정책을 편집하지 않았습니다. 실제 토큰은 측정되지 않아 null로 기록했고 예산 준수는 인증하지 않습니다.

기존 loop-sync CLI JSON 반환 문제와 문서 제목 구조 경고는 남아 있으며 별도 API 검사로 보완했습니다.

최종 로컬 main 검증: npm ci, npm test 20/20, npm run lint, npm run loop:check, git diff --check 모두 성공. 모든 Orca Task가 settled succeeded이고 작업자 4개 터미널은 released입니다.

아카이브된 CI .log 파일의 줄 끝 공백만 정규화했습니다. 실패 내용과 타임스탬프는 보존했습니다.
