import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    base: '/front_7th_chapter4-2/',
    build: {
      rollupOptions: {
        output: {
          advancedChunks: {
            groups: [
              {
                name: 'react-vendor',
                test: /[\\/]node_modules[\\/]react(-dom)?[\\/]/,
              },
              {
                name: 'chakra-vendor',
                test: /[\\/]node_modules[\\/](@chakra-ui|@emotion|framer-motion)[\\/]/,
              },
              {
                name: 'dnd-vendor',
                test: /[\\/]node_modules[\\/]@dnd-kit[\\/]/,
              },
            ],
          },
        },
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      coverage: {
        reportsDirectory: './.coverage',
        reporter: ['lcov', 'json', 'json-summary'],
      },
    },
  }),
);
