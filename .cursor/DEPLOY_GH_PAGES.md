## GitHub Pages(gh-pages) 자동 배포 구성

### 배포 방식

- **GitHub Actions**가 `main`(또는 `master`) 브랜치에 push 될 때마다:
  - `pnpm install --frozen-lockfile`
  - `pnpm build` (산출물: `dist/`)
  - `dist/`를 GitHub Pages에 업로드/배포

관련 워크플로우: `.github/workflows/deploy-pages.yml`

### Vite base 경로(가장 중요)

GitHub Pages(Project site)는 앱이 `/<repo-name>/` 하위 경로에서 서빙됩니다.
그래서 Vite 빌드 시 `base`가 `/<repo-name>/`가 되도록 설정했습니다.

- 설정 파일: `vite.config.ts`
- 동작:
  - 로컬/일반 빌드: `base = "/"` (기본)
  - Actions 빌드: `BASE_URL=/<repo-name>/` 주입 → `base = "/<repo-name>/"`

### 저장소에서 반드시 확인할 설정(한 번만)

GitHub 저장소 → **Settings → Pages**

- **Source**: `GitHub Actions`

### 배포 성공 확인 방법

GitHub 저장소 → **Actions**

- 워크플로우: **Deploy to GitHub Pages**
- `build`, `deploy` job이 모두 녹색이면 성공

### 로컬에서 Pages 경로 재현(선택)

아래처럼 `BASE_URL`을 줘서 Pages 경로를 흉내낼 수 있습니다.

```bash
BASE_URL=/front_7th_chapter4-2/ pnpm build
pnpm vite preview
```
