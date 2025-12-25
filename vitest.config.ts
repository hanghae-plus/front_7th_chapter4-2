import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      reportsDirectory: "./.coverage",
      reporter: ["lcov", "json", "json-summary"],
    },
  },
});
