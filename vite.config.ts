import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(() => {
  /**
   * GitHub Pages(project site) 배포 시 리포지토리 하위 경로로 서비스되므로 base 경로가 필요합니다.
   * - 로컬/일반 배포: "/"
   * - GitHub Actions(Pages): BASE_URL="/<repo-name>/"
   */
  const base = process.env.BASE_URL ?? '/';

  return {
    base,
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      coverage: {
        reportsDirectory: './.coverage',
        reporter: ['lcov', 'json', 'json-summary'],
      },
    },
  };
});
