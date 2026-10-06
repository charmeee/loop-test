# 견적 계산기 — L3 Loop Engineering 실험

샘플 앱의 금액 반올림, 할인 계산과 통계를 feature/fix PR로 추가하고 실제 CI 실패 → 에이전트 수정 → 독립 검증 → 머지를 시험합니다.

현재 정책은 **charmeee/loop-test의 실험 PR에 한정한 L3**입니다. 정기 스케줄은 없습니다. 아래 첫 L1 설정 기록은 이전 단계의 이력입니다. 최종 L3 결과는 reports/l3-experiment.md에 기록합니다.

# Loop Engineering 테스트 환경

`charmeee/loop-test`에 연결된 Codex용 Daily Triage L1 환경입니다. 공식 [Loop Engineering quickstart](https://github.com/cobusgreyling/loop-engineering/blob/main/docs/quickstart.md)를 기반으로 구성했습니다.

## 설치와 검증

Node.js 18 이상 필요 (실제 검증: Node 22.14.0).

```sh
npm ci
npm test
npm run lint
npm run loop:check
npm run loop:cost
```

`npm test`는 정상 실행, 반복 실패 차단, 토큰 상한, 민감 경로 차단, L1 자동 머지 차단과 수동 커밋 정책, kill switch를 검사합니다. 이 테스트에는 AI API 키가 필요 없습니다.

## 실제 에이전트 실행

Orca 또는 Codex에서 다음 프롬프트를 실행합니다. CLI check 명령은 검증만 수행하며 AI를 호출하지 않습니다.

```text
Read LOOP.md and STATE.md. Run $loop-triage.
Run npm test, npm run lint and npm run loop:check.
Read GitHub issues, PRs and CI for charmeee/loop-test using gh.
Merge findings into STATE.md without duplicates; update Last run.
Append one actual entry to loop-run-log.md and write a report in reports/.
Report only: no code fixes, commits, pushes, PRs or remote writes.
```

공식 scaffold는 `.codex/skills`에 있고, `.agents/skills` 심볼릭 링크로 Codex의 현재 프로젝트 스킬 검색 경로에도 노출했습니다. 첫 실행은 Orca supervised worker로 진행합니다. 결과는 [STATE.md](STATE.md), [첫 보고서](reports/first-triage.md), [실행 기록](loop-run-log.md)에서 확인하세요.

## 운영 설정

- 현재 L1 보고 전용. 주기 스케줄은 비활성입니다.
- 수동 실행 최대 하루 2회, 예산 하루 100k 토큰. 실제 토큰 측정이 없으면 unknown으로 기록합니다.
- `touch LOOP_PAUSED`로 local check를 중지하고, 검토 후 `rm LOOP_PAUSED`로 재개합니다.
- `gate.yaml`은 모든 자동 머지를 차단합니다.
- 원격 origin: https://github.com/charmeee/loop-test.git
- 실제 AI 실행은 Orca/Codex 로그인과 해당 서비스 사용량이 필요합니다. GitHub 조회는 `gh auth status`로 확인합니다.

예산 및 실행 횟수는 운영 정책입니다. context CLI는 ledger에 기록된 시도/토큰만 검사하며, 에이전트 토큰을 자동 수집하거나 하루 실행 횟수를 자동 강제하지 않습니다.

## 발견한 upstream 호환성 문제

`loop-sync@1.0.0` CLI가 `--json`을 파싱하지만 반환 객체에서 빠뜨려 `loop doctor`가 Sync를 `n/a`로 표시합니다. `npm run loop:sync`는 설치된 패키지의 `runSync` API를 호출하여 실제 JSON/종료 코드를 확인하고, `loop:check`도 이를 별도로 검사합니다. node_modules 수정은 하지 않습니다.

상태와 설정 문서의 제목이 달라 structural similarity 경고가 남을 수 있습니다. 실제 파일 참조와 운영 정책을 검토해야 하며, 준비 점수 100은 무인 운영이나 AI 품질을 보증하지 않습니다.

## 재현성

npm 의존성 버전과 package-lock.json을 고정했습니다. upstream 참고 소스는 작업 저장소로 복사하지 않았고 기존 origin을 사용합니다. GitHub Actions workflow도 준비했으며 push 후 CI에서 같은 검사를 실행합니다. 아직 push하지 않았습니다. 초기 원격 저장소는 비어 있어 CI/커밋 이력 검증은 데이터가 생성된 뒤 가능합니다.
