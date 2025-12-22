## 변경 요약(gh-pages 배포 + 자동 배포)

### 핵심 변경 파일

- `vite.config.ts`

  - GitHub Pages 대응을 위해 `base`를 `process.env.BASE_URL ?? '/'`로 설정
  - Vitest 설정을 `defineConfig` 내부의 `test` 필드로 통합(타입 충돌 방지)

- `.github/workflows/deploy-pages.yml`

  - push마다 `pnpm install` → `pnpm build` → `dist` 업로드 → Pages 배포
  - `BASE_URL=/${{ github.event.repository.name }}/` 주입
  - pnpm 버전 `10.26.1` 고정

- `pnpm-workspace.yaml`

  - `packages: - '.'` 추가 (pnpm workspace 오류 해결)

- `src/setupTests.ts`
  - `@testing-library/jest-dom` import 추가 (Vitest setupFiles 경로 충족)

### 관련 커밋(참고)

- `35045e6`: `fix: pnpm workspace + pages deploy`
  - `.github/workflows/deploy-pages.yml`, `pnpm-workspace.yaml`

> 현재 `main`의 HEAD는 `427b2a0`이며, 위 커밋은 그 직전 히스토리에 포함됩니다.
