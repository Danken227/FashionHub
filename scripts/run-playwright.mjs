import { spawn } from "node:child_process";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: node scripts/run-playwright.mjs <playwright-command> [options]");
  process.exit(1);
}

const passthroughArgs = [];
let resolvedEnv;
let resolvedBaseUrl;

for (let index = 0; index < args.length; index += 1) {
  const current = args[index];

  if (current === "--env") {
    resolvedEnv = args[index + 1];
    index += 1;
    continue;
  }

  if (current.startsWith("--env=")) {
    resolvedEnv = current.replace("--env=", "");
    continue;
  }

  if (current === "--base-url") {
    resolvedBaseUrl = args[index + 1];
    index += 1;
    continue;
  }

  if (current.startsWith("--base-url=")) {
    resolvedBaseUrl = current.replace("--base-url=", "");
    continue;
  }

  passthroughArgs.push(current);
}

const env = {
  ...process.env,
  ...(resolvedEnv ? { TEST_ENV: resolvedEnv } : {}),
  ...(resolvedBaseUrl ? { BASE_URL: resolvedBaseUrl } : {})
};

const playwrightProcess = spawn("npx", ["playwright", ...passthroughArgs], {
  stdio: "inherit",
  env,
  shell: process.platform === "win32"
});

playwrightProcess.on("close", (code) => {
  process.exit(code ?? 1);
});
