/**
 * CLI entry point for agentic-pm-kit.
 *
 * Supported usage:
 *   agentic-pm-kit install [--full-deck] [--online-mode] [--help]
 *   agentic-pm-kit --version | -v
 *   agentic-pm-kit --help | -h
 *
 * For production (npx): invoked via bin/agentic-pm-kit.js → dist/bin.js
 * For development (bun): invoked directly as `bun run src/bin.ts`
 */

import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as path from "node:path";
import * as fs from "node:fs";
import chalk from "chalk";

// ─── Version helper ───────────────────────────────────────────────────────────
function getVersion(): string {
  const require = createRequire(import.meta.url);
  const pkgPath = path.resolve(fileURLToPath(import.meta.url), "../../package.json");
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (require(pkgPath) as any).version as string;
  } catch {
    return "0.0.0";
  }
}

// ─── Help text ────────────────────────────────────────────────────────────────
function printHelp(): void {
  const version = getVersion();
  console.log(`
${chalk.bold.cyan("agentic-pm-kit")} v${version}

  ${chalk.dim("Free MIT-licensed installer for PM Agent Skills")}
  ${chalk.dim("(Claude Code + Gemini CLI + OpenCode)")}

${chalk.bold("USAGE")}

  npx agentic-pm-kit install [flags]
  bun run src/bin.ts install [flags]

${chalk.bold("COMMANDS")}

  install     Interactive install of PM skills into a project directory.
              Writes skill files, vendor references, and a config file.

  (no command) Run inside a project that already has .pm-kit.config.json to
              open the subsequent-run menu (add/remove modules, change language,
              switch source mode, reinstall, uninstall).
              Run in a project without a config to start the install flow.

${chalk.bold("GLOBAL FLAGS")}

  --help, -h          Show this help message and exit.
  --version, -v       Print the package version and exit.

${chalk.bold("INSTALL FLAGS")}

  --full-deck         Skip the brainstorming deck prompt and install all 60
                      brainstorming strategies (default: curated 20).
  --online-mode       Skip the sources-mode prompt and enable WebFetch for
                      canonical source URLs (default: offline/bundled).
  --help              Show install-specific help and exit.

${chalk.bold("EXAMPLES")}

  npx agentic-pm-kit install
  npx agentic-pm-kit install --full-deck --online-mode
  npx agentic-pm-kit --version
`.trim() + "\n");
}

// ─── Main dispatcher ─────────────────────────────────────────────────────────
export async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Global flags — checked before subcommand dispatch
  if (args.includes("--version") || args.includes("-v")) {
    console.log(getVersion());
    return;
  }

  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }

  const [command, ...rest] = args;

  if (command === "install") {
    // Subcommand-level --help: print global help and exit
    if (rest.includes("--help") || rest.includes("-h")) {
      printHelp();
      return;
    }

    const fullDeck = rest.includes("--full-deck");
    const onlineMode = rest.includes("--online-mode");

    // Lazy-import to keep startup fast for --help / --version
    const { runInstall } = await import("./commands/install.js");
    await runInstall({ fullDeck, onlineMode });
    return;
  }

  // No subcommand given — dispatch based on whether a config already exists.
  if (command === undefined) {
    const configPath = path.join(process.cwd(), ".pm-kit.config.json");
    if (fs.existsSync(configPath)) {
      // Subsequent run: existing install detected → open the management menu.
      const { runMenu } = await import("./commands/menu.js");
      await runMenu(process.cwd());
    } else {
      // Fresh directory: start the interactive install flow.
      const { runInstall } = await import("./commands/install.js");
      await runInstall({ fullDeck: false, onlineMode: false });
    }
    return;
  }

  // Unknown command
  console.error(chalk.red(`Unknown command: ${command}`));
  console.error(chalk.dim("Run `agentic-pm-kit --help` for usage."));
  process.exit(1);
}

// ─── Auto-invoke when run directly ───────────────────────────────────────────
// Portable guard: works in both Bun (import.meta.main) and Node ESM
// (compare import.meta.url to the argv[1] URL).
function isMainModule(): boolean {
  const meta = import.meta as { main?: boolean };
  if (typeof meta.main === "boolean") {
    // Bun runtime provides import.meta.main natively
    return meta.main;
  }
  // Node ESM fallback
  if (!process.argv[1]) return false;
  try {
    return import.meta.url === pathToFileURL(process.argv[1]).href;
  } catch {
    return false;
  }
}

if (isMainModule()) {
  main().catch((err: unknown) => {
    console.error(chalk.red("Fatal error:"), err);
    process.exit(1);
  });
}
