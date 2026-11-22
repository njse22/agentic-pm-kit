/**
 * menu.ts — Subsequent-run menu for agentic-pm-kit.
 *
 * Invoked when the user runs `npx agentic-pm-kit` (no subcommand) inside a
 * directory that already has a `.pm-kit.config.json`. Presents a five-option
 * menu:
 *
 *   1. Add / remove modules
 *   2. Change language
 *   3. Switch source mode (offline ↔ online)
 *   4. Reinstall (refresh all skills and vendor files to the current package version)
 *   5. Uninstall
 *
 * Implements spec §6.5 exactly.
 *
 * Module-removal strategy: nuke-and-pave.
 *   When the module list changes (whether modules were added or removed), we
 *   delete the agent skill subtrees and the per-skill docs (checklists + templates),
 *   then re-run the copier. This avoids duplicating the MODULE_SKILLS mapping that
 *   lives inside copy.ts (which we may not edit). User output files in
 *   docs/pm-kit/outputs/ are always preserved.
 */

import * as p from "@clack/prompts";
import chalk from "chalk";
import * as fs from "node:fs";
import fsp from "node:fs/promises";
import * as path from "node:path";
import { homedir } from "node:os";
import type { PmKitConfig } from "../types/config.js";
import { copySkillsTree } from "./copy.js";

// ─── Public entry point ───────────────────────────────────────────────────────

/**
 * runMenu — Read the existing config from targetDir and present the
 * subsequent-run menu. Each menu option may mutate the config and trigger
 * a file-system update.
 *
 * @param targetDir  Absolute path to the user's project directory (must
 *                   already contain a `.pm-kit.config.json`).
 */
export async function runMenu(targetDir: string): Promise<void> {
  const configPath = path.join(targetDir, ".pm-kit.config.json");

  // Read current config
  let config: PmKitConfig;
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as PmKitConfig;
  } catch {
    p.cancel(`Cannot read ${configPath}. The file may be corrupted.`);
    process.exit(1);
  }

  p.intro(
    chalk.bold.cyan(`  agentic-pm-kit  `) +
      chalk.dim(` — ${config.project.name}`)
  );
  console.log(
    chalk.dim(
      `  Existing install detected in ${chalk.white(targetDir)}\n`
    )
  );

  // ─── Top-level menu ───────────────────────────────────────────────────────
  type MenuChoice =
    | "modules"
    | "language"
    | "sources"
    | "reinstall"
    | "uninstall";

  const choice = await p.select<MenuChoice>({
    message: "What would you like to do?",
    options: [
      {
        value: "modules" as MenuChoice,
        label: "Add / remove modules",
        hint: `current: ${config.modules.join(", ")}`,
      },
      {
        value: "language" as MenuChoice,
        label: "Change language",
        hint: `comm: ${config.language.communication}  output: ${config.language.output}`,
      },
      {
        value: "sources" as MenuChoice,
        label: "Switch source mode",
        hint: `current: ${config.sourcesMode}`,
      },
      {
        value: "reinstall" as MenuChoice,
        label: "Reinstall",
        hint: "refresh skills and vendor files to the current package version",
      },
      {
        value: "uninstall" as MenuChoice,
        label: "Uninstall",
        hint: "remove all pm-kit files and the config from this project",
      },
    ],
  });

  if (p.isCancel(choice)) {
    p.cancel("No changes made.");
    process.exit(0);
  }

  switch (choice as MenuChoice) {
    case "modules":
      await handleModules(config, targetDir, configPath);
      break;
    case "language":
      await handleLanguage(config, targetDir, configPath);
      break;
    case "sources":
      await handleSources(config, targetDir, configPath);
      break;
    case "reinstall":
      await handleReinstall(config, targetDir);
      break;
    case "uninstall":
      await handleUninstall(config, targetDir, configPath);
      break;
  }
}

// ─── Option 1: Add / remove modules ──────────────────────────────────────────

async function handleModules(
  config: PmKitConfig,
  targetDir: string,
  configPath: string
): Promise<void> {
  type ModuleValue =
    | "ideation"
    | "initiation"
    | "planning"
    | "execution"
    | "closing";

  const moduleChoices = await p.multiselect<ModuleValue>({
    message: "Which PM lifecycle modules should be installed?",
    options: [
      {
        value: "ideation" as ModuleValue,
        label: "Ideation — Brainstorming Lab",
      },
      {
        value: "initiation" as ModuleValue,
        label: "Initiation — Charter, Stakeholders, Business Case",
      },
      {
        value: "planning" as ModuleValue,
        label: "Planning — PRD, WBS, Gantt, Risk, Comms, Cost",
      },
      {
        value: "execution" as ModuleValue,
        label: "Execution — Sprints, Story, Standup, Review",
      },
      {
        value: "closing" as ModuleValue,
        label: "Closing — Retrospective, Post-Mortem, Closure Report",
      },
    ],
    initialValues: config.modules as ModuleValue[],
    required: true,
  });

  if (p.isCancel(moduleChoices)) {
    p.cancel("No changes made.");
    process.exit(0);
  }

  const newModules = moduleChoices as ModuleValue[];
  if (newModules.length === 0) {
    p.cancel("At least one module is required.");
    process.exit(1);
  }

  // Check whether anything actually changed
  const unchanged =
    newModules.length === config.modules.length &&
    newModules.every((m) => config.modules.includes(m));
  if (unchanged) {
    p.outro(chalk.dim("No module changes detected. Nothing written."));
    return;
  }

  config.modules = newModules;

  // Nuke-and-pave: remove existing skill subtrees so orphaned skills from
  // de-selected modules don't linger, then re-run the copier.
  const spinner = p.spinner();
  spinner.start("Updating modules (removing old skill trees)...");
  try {
    await nukeSkillSubtrees(config, targetDir);
  } catch (err) {
    spinner.stop("Failed while removing old skill trees.");
    throw err;
  }
  spinner.message("Reinstalling skills for selected modules...");
  try {
    await copySkillsTree({ targetDir, config });
  } catch (err) {
    spinner.stop("Install failed.");
    throw err;
  }
  spinner.stop("Modules updated.");

  // Persist config (copySkillsTree already writes it, but we call explicitly
  // so the update is canonical regardless of copier internals).
  persistConfig(config, configPath);

  p.outro(
    chalk.bold.green("Done.") +
      chalk.dim(`  Modules updated: ${newModules.join(", ")}`)
  );
}

// ─── Option 2: Change language ────────────────────────────────────────────────

async function handleLanguage(
  config: PmKitConfig,
  _targetDir: string,
  configPath: string
): Promise<void> {
  // Communication language
  const commLanguage = await p.text({
    message: "What language should the agent speak to you in?",
    placeholder: config.language.communication,
    initialValue: config.language.communication,
    validate(v: string | undefined): string | undefined {
      if (!v || !v.trim()) return "Please enter a language.";
      return undefined;
    },
  });
  if (p.isCancel(commLanguage)) {
    p.cancel("No changes made.");
    process.exit(0);
  }
  const newCommLang = (commLanguage as string).trim();

  // Artifact output language
  const outputLanguage = await p.text({
    message: "What language should artifacts be written in? (leave blank to match above)",
    placeholder: newCommLang,
    initialValue: config.language.output,
  });
  if (p.isCancel(outputLanguage)) {
    p.cancel("No changes made.");
    process.exit(0);
  }
  const newOutputLang = (outputLanguage as string).trim() || newCommLang;

  config.language = { communication: newCommLang, output: newOutputLang };
  persistConfig(config, configPath);

  // Language is read from config at skill-invocation time — no copier call needed.
  p.outro(
    chalk.bold.green("Done.") +
      chalk.dim(
        `  Communication: ${newCommLang}  |  Output: ${newOutputLang}`
      )
  );
}

// ─── Option 3: Switch source mode ────────────────────────────────────────────

async function handleSources(
  config: PmKitConfig,
  _targetDir: string,
  configPath: string
): Promise<void> {
  const modeChoice = await p.select<"offline" | "online">({
    message: "Authoritative-source mode:",
    options: [
      {
        value: "offline" as const,
        label: "Offline (default)",
        hint: "uses bundled Scrum Guide + Manifesto; no network calls",
      },
      {
        value: "online" as const,
        label: "Online (opt-in)",
        hint: "agent WebFetches canonical URLs on each skill invocation",
      },
    ],
    initialValue: config.sourcesMode,
  });

  if (p.isCancel(modeChoice)) {
    p.cancel("No changes made.");
    process.exit(0);
  }

  const newMode = modeChoice as "offline" | "online";
  if (newMode === config.sourcesMode) {
    p.outro(chalk.dim(`Source mode is already ${newMode}. Nothing changed.`));
    return;
  }

  config.sourcesMode = newMode;
  persistConfig(config, configPath);

  // Source mode is read from config at skill-invocation time — no copier call needed.
  p.outro(
    chalk.bold.green("Done.") +
      chalk.dim(`  Source mode set to: ${newMode}`)
  );
}

// ─── Option 4: Reinstall ──────────────────────────────────────────────────────

async function handleReinstall(
  config: PmKitConfig,
  targetDir: string
): Promise<void> {
  const spinner = p.spinner();
  spinner.start("Refreshing skills and vendor files...");
  try {
    await copySkillsTree({ targetDir, config });
  } catch (err) {
    spinner.stop("Reinstall failed.");
    throw err;
  }
  spinner.stop("Reinstall complete.");

  p.outro(
    chalk.bold.green("Done.") +
      chalk.dim(`  All skill and vendor files refreshed in ${targetDir}`)
  );
}

// ─── Option 5: Uninstall ──────────────────────────────────────────────────────

async function handleUninstall(
  config: PmKitConfig,
  targetDir: string,
  configPath: string
): Promise<void> {
  // Warn the user explicitly that outputs/ will be wiped.
  console.log(
    "\n" +
      chalk.yellow("  Warning: This will remove ALL pm-kit files, including:") +
      "\n" +
      chalk.dim(`    • ${path.join(targetDir, ".claude", "skills", "pm-kit")}  (if Claude Code was installed)`) +
      "\n" +
      chalk.dim(`    • ${path.join(targetDir, ".opencode", "skills", "pm-kit")}  (if OpenCode was installed)`) +
      "\n" +
      chalk.dim(`    • ${path.join(homedir(), ".gemini", "extensions", "pm-kit")}  (user-global; if Gemini CLI was installed)`) +
      "\n" +
      chalk.dim(`    • ${path.join(targetDir, "docs", "pm-kit")}  ← INCLUDES outputs/ (your generated artifacts!)`) +
      "\n" +
      chalk.dim(`    • ${path.join(targetDir, "vendor", "pm-kit")}`) +
      "\n" +
      chalk.dim(`    • ${path.join(targetDir, "vendor", "bmad")}`) +
      "\n" +
      chalk.dim(`    • ${configPath}`) +
      "\n"
  );

  const confirmed = await p.confirm({
    message:
      "Delete all pm-kit files including docs/pm-kit/outputs/? This will remove your generated artifacts.",
    initialValue: false,
  });

  if (p.isCancel(confirmed) || !confirmed) {
    p.cancel("Uninstall cancelled. No files were removed.");
    process.exit(0);
  }

  const spinner = p.spinner();
  spinner.start("Removing pm-kit files...");

  const errors: string[] = [];

  // Helper: attempt to remove a path, record any error without throwing.
  const removeQuiet = async (targetPath: string): Promise<void> => {
    try {
      await fsp.rm(targetPath, { recursive: true, force: true });
    } catch (err) {
      errors.push(
        `  Failed to remove ${targetPath}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  // 1. Claude Code: per-project skills dir
  if (config.agents.includes("claude-code")) {
    await removeQuiet(path.join(targetDir, ".claude", "skills", "pm-kit"));
  }

  // 1b. OpenCode: per-project skills dir (namespaced subtree)
  if (config.agents.includes("opencode")) {
    await removeQuiet(path.join(targetDir, ".opencode", "skills", "pm-kit"));
  }

  // 2. Gemini CLI: user-global extension root (includes manifest + skills/ subdir)
  if (config.agents.includes("gemini-cli")) {
    await removeQuiet(path.join(homedir(), ".gemini", "extensions", "pm-kit"));
  }

  // 3. docs/pm-kit/ — the entire tree, including outputs/
  await removeQuiet(path.join(targetDir, "docs", "pm-kit"));

  // 4. vendor/pm-kit/
  await removeQuiet(path.join(targetDir, "vendor", "pm-kit"));

  // 5. vendor/bmad/
  await removeQuiet(path.join(targetDir, "vendor", "bmad"));

  // 6. .pm-kit.config.json
  await removeQuiet(configPath);

  spinner.stop("Removal complete.");

  if (errors.length > 0) {
    console.log(chalk.yellow("\n  Some paths could not be removed:"));
    for (const msg of errors) {
      console.log(chalk.dim(msg));
    }
  }

  p.outro(
    chalk.bold.green("Done.") +
      chalk.dim("  pm-kit has been uninstalled from this project.")
  );
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Persist the mutated config object back to `.pm-kit.config.json`.
 * Trailing newline matches the convention used in install.ts and copy.ts.
 */
function persistConfig(config: PmKitConfig, configPath: string): void {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
}

/**
 * nukeSkillSubtrees — Remove agent skill directories and per-skill doc files
 * so that a subsequent copier run produces a clean install matching only the
 * newly selected modules.
 *
 * Strategy (nuke-and-pave):
 *   - Delete the agent skill roots (the copier recreates them).
 *   - Delete docs/pm-kit/checklists/ and docs/pm-kit/templates/ (the copier
 *     recreates them from the new skill set).
 *   - Preserve docs/pm-kit/outputs/ (user-generated artifacts — never touched).
 *   - Preserve vendor/ (the copier overwrites it idempotently and has no
 *     module-scoped content to clean).
 *   - Preserve the Gemini extension manifest root (copier rewrites it).
 *
 * This avoids duplicating the MODULE_SKILLS mapping from copy.ts.
 */
async function nukeSkillSubtrees(
  config: PmKitConfig,
  targetDir: string
): Promise<void> {
  const rmrf = (p: string) => fsp.rm(p, { recursive: true, force: true });

  // Claude Code per-project skills root
  if (config.agents.includes("claude-code")) {
    await rmrf(path.join(targetDir, ".claude", "skills", "pm-kit"));
  }

  // OpenCode per-project skills root (namespaced subtree)
  if (config.agents.includes("opencode")) {
    await rmrf(path.join(targetDir, ".opencode", "skills", "pm-kit"));
  }

  // Gemini CLI per-agent skills dir (only the skills/ subdir — preserve the
  // extension root so the manifest isn't orphaned before the copier rewrites it;
  // the copier recreates the skills/ subdir automatically).
  if (config.agents.includes("gemini-cli")) {
    await rmrf(
      path.join(homedir(), ".gemini", "extensions", "pm-kit", "skills")
    );
  }

  // docs/pm-kit/checklists/ and docs/pm-kit/templates/ — the copier recreates
  // these from the new module selection. outputs/ is intentionally excluded.
  await rmrf(path.join(targetDir, "docs", "pm-kit", "checklists"));
  await rmrf(path.join(targetDir, "docs", "pm-kit", "templates"));
}
