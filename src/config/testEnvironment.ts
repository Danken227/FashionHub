import path from "node:path";
import dotenv from "dotenv";
import environmentConfig from "../../config/environments.json";

dotenv.config();

type EnvironmentName = keyof typeof environmentConfig.environments;

interface ResolvedEnvironment {
  selectedEnvironment: EnvironmentName;
  baseURL: string;
}

function readCliArg(argName: string): string | undefined {
  const directPrefix = `--${argName}=`;
  const args = process.argv;

  for (let index = 0; index < args.length; index += 1) {
    const currentArg = args[index];
    if (currentArg.startsWith(directPrefix)) {
      return currentArg.replace(directPrefix, "").trim();
    }

    if (currentArg === `--${argName}`) {
      const nextArg = args[index + 1];
      if (nextArg && !nextArg.startsWith("--")) {
        return nextArg.trim();
      }
    }
  }

  return undefined;
}

function normalizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

function resolveEnvironmentName(): EnvironmentName {
  const cliEnvironment = readCliArg("env");
  const envEnvironment = process.env.TEST_ENV;
  const fallbackEnvironment = environmentConfig.defaultEnvironment;

  const chosenEnvironment = (cliEnvironment ?? envEnvironment ?? fallbackEnvironment) as EnvironmentName;

  if (!environmentConfig.environments[chosenEnvironment]) {
    const supportedEnvironments = Object.keys(environmentConfig.environments).join(", ");
    throw new Error(
      `Unsupported environment "${chosenEnvironment}". Supported environments: ${supportedEnvironments}.`
    );
  }

  return chosenEnvironment;
}

export function getResolvedEnvironment(): ResolvedEnvironment {
  const selectedEnvironment = resolveEnvironmentName();
  const baseUrlOverride = readCliArg("base-url") ?? process.env.BASE_URL;
  const configuredBaseUrl = environmentConfig.environments[selectedEnvironment];
  const baseURL = normalizeBaseUrl(baseUrlOverride ?? configuredBaseUrl);

  if (!baseURL) {
    throw new Error(
      `Could not resolve base URL for environment "${selectedEnvironment}". ` +
        "Provide --base-url, BASE_URL or update config/environments.json."
    );
  }

  process.env.SELECTED_TEST_ENV = selectedEnvironment;
  process.env.SELECTED_BASE_URL = baseURL;

  return {
    selectedEnvironment,
    baseURL
  };
}

export const artifactOutputDir = path.join(process.cwd(), "test-results");
