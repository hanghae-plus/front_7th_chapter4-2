import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) =>
 mergeConfig(
  defineConfig({
    plugins: [react()],
    // Use Vite's mode to detect production builds (NODE_ENV is not set by Vite)
    base: mode === "production" ? "/front_7th_chapter4-2/" : "",
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      coverage: {
        reportsDirectory: "./.coverage",
        reporter: ["lcov", "json", "json-summary"],
      },
    },
  }))
);