// note: @clack/prompts@1.2.0 chosen over @inquirer/prompts for cleaner UX with
// built-in spinners, cancellation handling, and an ESM-native package structure.

// Interactive install command — implements the §6.2 prompt flow exactly.
//
// Q1.5 (project name + description) is a necessary addition: spec §6.4 requires
// `project.name` and `project.description` in the config, but §6.2 does not
// specify where that data is collected. These prompts bridge the gap.

import * as p from "@clack/prompts";
import chalk from "chalk";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import type { PmKitConfig } from "../types/config.js";
import { copySkillsTree } from "./copy.js";

/** Load the package version from package.json at runtime. */
function getPackageVersion(): string {
  const require = createRequire(import.meta.url);
  const pkgPath = path.resolve(fileURLToPath(import.meta.url), "../../../package.json");
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (require(pkgPath) as any).version as string;
  } catch {
    // Fallback: sync read when createRequire is unavailable (e.g., bundled env)
    const raw = fs.readFileSync(pkgPath, "utf8");
    return (JSON.parse(raw) as { version: string }).version;
  }
}

/** Options passed from the CLI entry point. */
export interface InstallOptions {
  /** If true, skip the brainstorming deck prompt and default to "full" (60 strategies). */
  fullDeck: boolean;
  /** If true, skip the sources mode prompt and default to "online". */
  onlineMode: boolean;
}

export async function runInstall(opts: InstallOptions): Promise<void> {
  const version = getPackageVersion();

  p.intro(chalk.bold.cyan(`  agentic-pm-kit v${version}  `));
  console.log(
    chalk.dim("  Install PM Agent Skills for Claude Code and/or Gemini CLI.\n")
  );

  // ─── Q1: Install target directory ────────────────────────────────────────
  const defaultDir = process.cwd();
  const confirmDir = await p.confirm({
    message: `Install to ${chalk.cyan(defaultDir)}?`,
    initialValue: true,
  });
  if (p.isCancel(confirmDir)) {
    p.cancel("Installation cancelled.");
    process.exit(0);
  }

  let targetDir = defaultDir;
  if (!confirmDir) {
    const customDir = await p.text({
      message: "Enter the target directory path:",
      placeholder: defaultDir,
      validate(v: string | undefined): string | undefined {
        if (!v || !v.trim()) return "Directory path cannot be empty.";
        if (!fs.existsSync(v.trim())) return `Directory not found: ${v.trim()}`;
        return undefined;
      },
    });
    if (p.isCancel(customDir)) {
      p.cancel("Installation cancelled.");
      process.exit(0);
    }
    targetDir = (customDir as string).trim();
  }

  // ─── Q1.5: Project name and description ──────────────────────────────────
  // Not listed in spec §6.2 but required by spec §6.4 config schema.
  // Positioned here (before agent target) so the user thinks of the project
  // context before selecting modules.
  const projectName = await p.text({
    message: "What is the project name?",
    placeholder: "e.g., BookSwap Campus",
    validate(v: string | undefined): string | undefined {
      if (!v || !v.trim()) return "Project name cannot be empty.";
      return undefined;
    },
  });
  if (p.isCancel(projectName)) {
    p.cancel("Installation cancelled.");
    process.exit(0);
  }

  const projectDescription = await p.text({
    message: "One-sentence description of this project:",
    placeholder: "e.g., Peer-to-peer used-textbook marketplace for university students",
    validate(v: string | undefined): string | undefined {
      if (!v || !v.trim()) return "Project description cannot be empty.";
      return undefined;
    },
  });
  if (p.isCancel(projectDescription)) {
    p.cancel("Installation cancelled.");
    process.exit(0);
  }

  // ─── Q2: Agent target ────────────────────────────────────────────────────
  type AgentValue = "claude-code" | "gemini-cli";
  const agentChoices = await p.multiselect<AgentValue>({
    message: "Which agent(s) should skills be installed for?",
    options: [
      { value: "claude-code" as AgentValue, label: "Claude Code" },
      { value: "gemini-cli" as AgentValue, label: "Gemini CLI" },
    ],
    initialValues: ["claude-code", "gemini-cli"] as AgentValue[],
    required: true,
  });
  if (p.isCancel(agentChoices)) {
    p.cancel("Installation cancelled.");
    process.exit(0);
  }
  const selectedAgents = agentChoices as AgentValue[];
  if (selectedAgents.length === 0) {
    p.cancel("At least one agent target is required.");
    process.exit(1);
  }

  // ─── Q3: Agent communication language ────────────────────────────────────
  const commLanguage = await p.text({
    message: "What language should the agent speak to you in?",
    placeholder: "e.g., español, English, português, français",
    validate(v: string | undefined): string | undefined {
      if (!v || !v.trim()) return "Please enter a language.";
      return undefined;
    },
  });
  if (p.isCancel(commLanguage)) {
    p.cancel("Installation cancelled.");
    process.exit(0);
  }
  const commLang = (commLanguage as string).trim();

  // ─── Q4: Artifact output language ────────────────────────────────────────
  const outputLanguage = await p.text({
    message: "What language should artifacts be written in? (leave blank to match above)",
    placeholder: commLang,
  });
  if (p.isCancel(outputLanguage)) {
    p.cancel("Installation cancelled.");
    process.exit(0);
  }
  const resolvedOutputLanguage = (outputLanguage as string).trim() || commLang;

  // ─── Q5: Modules to install ───────────────────────────────────────────────
  type ModuleValue = "ideation" | "initiation" | "planning" | "execution" | "closing";
  const moduleChoices = await p.multiselect<ModuleValue>({
    message: "Which PM lifecycle modules should be installed?",
    options: [
      { value: "ideation" as ModuleValue, label: "Ideation — Brainstorming Lab" },
      { value: "initiation" as ModuleValue, label: "Initiation — Charter, Stakeholders, Business Case" },
      { value: "planning" as ModuleValue, label: "Planning — PRD, WBS, Gantt, Risk, Comms, Cost" },
      { value: "execution" as ModuleValue, label: "Execution — Sprints, Story, Standup, Review" },
      { value: "closing" as ModuleValue, label: "Closing — Retrospective, Post-Mortem, Closure Report" },
    ],
    initialValues: ["ideation", "initiation", "planning", "execution", "closing"] as ModuleValue[],
    required: true,
  });
  if (p.isCancel(moduleChoices)) {
    p.cancel("Installation cancelled.");
    process.exit(0);
  }
  const selectedModules = moduleChoices as ModuleValue[];
  if (selectedModules.length === 0) {
    p.cancel("At least one module is required.");
    process.exit(1);
  }

  // ─── Q6: Brainstorming deck ───────────────────────────────────────────────
  let brainstorming: "curated" | "full" = "curated";
  if (opts.fullDeck) {
    brainstorming = "full";
    p.log.info(
      chalk.dim("--full-deck flag detected: installing all 60 brainstorming strategies.")
    );
  } else {
    const deckChoice = await p.select<"curated" | "full">({
      message: "Which brainstorming strategy deck?",
      options: [
        {
          value: "curated" as const,
          label: "Curated 20",
          hint: "recommended — PM-optimized strategies",
        },
        {
          value: "full" as const,
          label: "Full 60",
          hint: "includes ~40 strategies not specific to PM",
        },
      ],
      initialValue: "curated",
    });
    if (p.isCancel(deckChoice)) {
      p.cancel("Installation cancelled.");
      process.exit(0);
    }
    brainstorming = deckChoice as "curated" | "full";
  }

  // ─── Q7: Authoritative-source mode ───────────────────────────────────────
  let sourcesMode: "offline" | "online" = "offline";
  if (opts.onlineMode) {
    sourcesMode = "online";
    p.log.info(
      chalk.dim("--online-mode flag detected: skills will WebFetch canonical sources.")
    );
  } else {
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
      initialValue: "offline",
    });
    if (p.isCancel(modeChoice)) {
      p.cancel("Installation cancelled.");
      process.exit(0);
    }
    sourcesMode = modeChoice as "offline" | "online";
  }

  // ─── Q8: Install summary and final confirmation ───────────────────────────
  const agentLabels: Record<AgentValue, string> = {
    "claude-code": "Claude Code",
    "gemini-cli": "Gemini CLI",
  };
  const moduleLabels: Record<ModuleValue, string> = {
    ideation: "Ideation",
    initiation: "Initiation",
    planning: "Planning",
    execution: "Execution",
    closing: "Closing",
  };

  console.log("\n" + chalk.bold("  Install Summary"));
  console.log(chalk.dim("  ─────────────────────────────────────────"));
  console.log(`  ${chalk.dim("Target directory:")}  ${chalk.cyan(targetDir)}`);
  console.log(`  ${chalk.dim("Project:")}           ${chalk.white((projectName as string).trim())}`);
  console.log(`  ${chalk.dim("Description:")}       ${chalk.white((projectDescription as string).trim())}`);
  console.log(
    `  ${chalk.dim("Agents:")}            ${chalk.white(selectedAgents.map((a) => agentLabels[a]).join(", "))}`
  );
  console.log(
    `  ${chalk.dim("Comm language:")}     ${chalk.white(commLang)}`
  );
  console.log(
    `  ${chalk.dim("Output language:")}   ${chalk.white(resolvedOutputLanguage)}`
  );
  console.log(
    `  ${chalk.dim("Modules:")}           ${chalk.white(selectedModules.map((m) => moduleLabels[m]).join(", "))}`
  );
  console.log(
    `  ${chalk.dim("Brainstorming:")}     ${chalk.white(brainstorming === "curated" ? "Curated 20 strategies" : "Full 60 strategies")}`
  );
  console.log(
    `  ${chalk.dim("Sources mode:")}      ${chalk.white(sourcesMode === "offline" ? "Offline (bundled only)" : "Online (WebFetch enabled)")}`
  );
  console.log(chalk.dim("  ─────────────────────────────────────────\n"));

  const confirmed = await p.confirm({
    message: "Proceed with installation?",
    initialValue: true,
  });
  if (p.isCancel(confirmed) || !confirmed) {
    p.cancel("Installation cancelled.");
    process.exit(0);
  }

  // ─── Build config object ──────────────────────────────────────────────────
  const config: PmKitConfig = {
    version,
    installedAt: new Date().toISOString(),
    agents: selectedAgents,
    language: {
      communication: commLang,
      output: resolvedOutputLanguage,
    },
    modules: selectedModules,
    brainstorming,
    sourcesMode,
    project: {
      name: (projectName as string).trim(),
      description: (projectDescription as string).trim(),
    },
  };

  // ─── Copy files to target directory ──────────────────────────────────────
  const spinner = p.spinner();
  spinner.start("Installing files...");
  try {
    await copySkillsTree({ targetDir, config });
  } catch (err) {
    spinner.stop("Install failed.");
    throw err;
  }
  spinner.stop("Files installed.");

  p.outro(
    chalk.bold.green("Done.") + chalk.dim(`  Files installed to ${targetDir}`)
  );
}
