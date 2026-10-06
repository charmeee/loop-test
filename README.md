# 견적 계산기 · Loop Engineering L3 실험

금액 반올림, 할인 계산, 견적 통계를 제공하는 작은 Node.js 테스트 프로젝트입니다.

## 실행

Node.js 22 기준으로 검증했습니다.

```sh
npm ci
npm test
npm run lint
npm run loop:check
npm run loop:cost
```

```js
import { roundMoney } from './src/money.mjs';
import { discountedTotal } from './src/discount.mjs';
import { quoteStatistics } from './src/statistics.mjs';

roundMoney(1.005);                 // 1.01
discountedTotal(200, 25);           // 150
quoteStatistics([100, 150, 200]);  // { count: 3, total: 450, average: 150 }
```

## 실제 L3 실험

사용자가 승인한 `charmeee/loop-test` 실험 PR 3개만 처리했습니다. 의도적으로 실패하는 회귀 테스트를 포함한 feature PR 2개와 fix PR 1개를 만들고 실제 GitHub CI 실패를 확인했습니다.

1. Orca maker가 실패 CI를 읽고 PR별 Git worktree에서 구현만 수정합니다.
2. circuit breaker가 PR당 최대 3회 시도 제한을 확인합니다.
3. gate.yaml이 구현 경로만 허용하고 tests, CI, package, 민감 경로 변경을 거부합니다.
4. 별도 Orca checker가 정확한 SHA, 초기 테스트 해시, 로컬 검사, 실제 CI와 합친 상태를 검증합니다.
5. 세 후보가 모두 승인된 뒤 `node scripts/merge-verified.mjs`가 APPROVE, 통합 검사, 최신 SHA, 모든 CI 성공과 실제 수정 경로를 확인한 뒤 지정 PR을 머지합니다.

머지 스크립트는 `reports/l3-manifest.json`과 `reports/l3-verdicts.json`을 입력으로 사용합니다. 이미 머지한 PR이나 변경된 SHA는 거부하며 일반적인 PR 자동 처리 도구가 아닙니다.

PR: [할인 #1](https://github.com/charmeee/loop-test/pull/1), [통계 #2](https://github.com/charmeee/loop-test/pull/2), [반올림 #3](https://github.com/charmeee/loop-test/pull/3).

최종 결과: [L3 보고서](reports/l3-experiment.md). 수정 증거: [maker](reports/l3-maker.md), 독립 검증: [checker 최종](reports/l3-checker-final.md). PR별 원본 실패와 시도 기록은 reports/ledger-*.json에 있습니다.

## 범위와 중지

이번 실험은 한 번 실행하는 L3이며 정기 스케줄은 활성화하지 않았습니다. `touch LOOP_PAUSED`로 실행/머지를 중지하고 검토 후 파일을 제거합니다. 실제 AI 실행은 Orca/Codex 로그인이 필요하고 GitHub 작업은 인증된 gh CLI를 사용합니다.

시도 횟수는 ledger로 제한합니다. 실제 토큰은 자동 측정되지 않아 null로 기록했고, 100k 토큰 예산 준수는 인증할 수 없습니다. Git worktree는 OS 수준의 보안 격리가 아닙니다. 같은 Codex provider의 별도 maker/checker 세션이며 서로 다른 모델 교차 검증은 아닙니다.

## upstream 호환성

의존성 버전과 package-lock.json을 고정했습니다. `loop-sync@1.0.0` CLI의 --json 반환 누락으로 doctor가 Sync n/a를 표시합니다. scripts/sync.mjs는 설치된 패키지 API로 별도 검사합니다. 현재 sync 90/100, 문서 제목 구조 경고 1건입니다. 준비 점수는 무인 운영 품질 보증과 다릅니다.

공식 자료: [Loop Engineering quickstart](https://github.com/cobusgreyling/loop-engineering/blob/main/docs/quickstart.md). 이전 L1 실행 이력은 reports/first-triage.md에 보존했습니다.
