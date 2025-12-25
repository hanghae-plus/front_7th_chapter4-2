import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: '/front_7th_chapter4-2/',
  plugins: [react()],
  build: {
    minify: "esbuild",
    // CSS 코드 스플리팅 활성화
    cssCodeSplit: true,
    // 소스맵 생성 비활성화 (프로덕션 빌드 크기 감소)
    sourcemap: false,
    // 빌드 최적화
    target: 'esnext',
    // 압축 레벨 최적화
    reportCompressedSize: false,
    rollupOptions: {
      // Tree-shaking 최적화 강화
      treeshake: {
        moduleSideEffects: (id) => {
          // node_modules는 side effect가 있을 수 있으므로 확인
          if (id.includes('node_modules')) {
            // 특정 라이브러리는 side effect가 있음
            if (id.includes('@chakra-ui') || id.includes('@emotion')) {
              return true;
            }
            return false;
          }
          return false;
        },
      },
      output: {
        // 청크 파일명 최적화 (해시 사용으로 캐싱 개선)
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks(id) {
          // node_modules는 별도 청크로 분리
          if (id.includes('node_modules')) {
            // react와 react-dom을 분리하여 더 세밀한 캐싱
            if (id.includes("react/") && !id.includes("react-dom") && !id.includes("react/jsx")) {
              return "react-core";
            }
            if (id.includes("react/jsx-runtime") || id.includes("react/jsx-dev-runtime")) {
              return "react-jsx";
            }
            if (id.includes("react-dom")) {
              return "react-dom";
            }
            // scheduler는 react-dom과 함께
            if (id.includes("scheduler")) {
              return "react-dom";
            }
            // chakra-ui 청크
            if (
              id.includes("@chakra-ui") ||
              id.includes("@emotion") ||
              id.includes("framer-motion")
            ) {
              return "chakra-ui";
            }
            // dnd-kit 청크
            if (id.includes("@dnd-kit")) {
              return "dnd-kit";
            }
            // axios 청크
            if (id.includes("axios")) {
              return "axios";
            }
            // 기타 node_modules는 vendor로
            return "vendor";
          }
          // ScheduleTable 관련 컴포넌트들을 하나의 청크로 묶기
          if (
            id.includes("ScheduleTable") ||
            id.includes("ScheduleTableItem") ||
            id.includes("ScheduleDndProvider")
          ) {
            return "schedule-table";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    // esbuild는 기본적으로 console.log를 제거하지 않으므로, 별도 설정 필요
    drop: ["console", "debugger"],
    // 최소화 설정 강화
    legalComments: 'none',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    // 추가 최적화 옵션
    treeShaking: true,
    // 글로벌 변수 최소화
    keepNames: false,
    // Pure annotations 제거
    pure: ['console.log', 'console.info', 'console.debug'],
  },
  // 최적화 설정
  optimizeDeps: {
    // 의존성 사전 번들링 최적화
    include: ["react", "react-dom", "@chakra-ui/react"],
    // 사용하지 않는 의존성 제외
    exclude: ["msw"],
    // esbuild 옵션으로 최적화
    esbuildOptions: {
      target: 'esnext',
    },
  },
});
