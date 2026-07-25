import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.js"],
    clearMocks: true,
    testTimeout: 10000,
    hookTimeout: 30000,
  },
});
