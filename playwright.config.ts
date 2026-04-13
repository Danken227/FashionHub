import { defineConfig, devices } from "@playwright/test";
import { artifactOutputDir, getResolvedEnvironment } from "./src/config/testEnvironment";

const { baseURL, selectedEnvironment } = getResolvedEnvironment();

console.log(`[playwright] Environment: ${selectedEnvironment}`);
console.log(`[playwright] Base URL: ${baseURL}`);

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  outputDir: artifactOutputDir,
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15_000,
    navigationTimeout: 30_000
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] }
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] }
    }
  ]
});
