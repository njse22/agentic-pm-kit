/// <reference types="node" />

/**
 * copy.ts — File copier and docs synthesizer for agentic-pm-kit.
 *
 * Given a `PmKitConfig` (produced by the interactive install command in
 * `install.ts`) and a `targetDir`, writes the full on-disk layout described in
 * spec §6.3 into the target directory.
 *
 * All write operations are idempotent. `fs.cp` defaults to force-overwrite
 * (`{ force: true }`) when the destination exists, which is the intentional
 * behavior: re-running `npx agentic-pm-kit install` refreshes the skill and
 * vendor files to the current package version without requiring the user to
 * uninstall first. The only state that accumulates across runs is the user's
 * own output files in `docs/pm-kit/outputs/`, which we never touch.
 *
 * Zero runtime dependencies: only Node built-ins are used (fs/promises, path,
 * node:url). Do NOT add third-party packages here without explicit orchestrator
 * approval — see the B3 task brief.
 *
 * @module copy
 */

import fs from "node:fs/promises";
import path from "node:path";
import { sourcePaths } from "../lib/paths.js";
import type { PmKitConfig } from "../types/config.js";

// ---------------------------------------------------------------------------
// Module → skill name mapping (spec §5)
// ---------------------------------------------------------------------------

/**
 * Named artifact skills that belong to each lifecycle module.
 *
 * IMPORTANT: Most of these skill directories have NOT been authored yet —
 * they are being created by the A-team content authors in parallel. The
 * copier is defensive: it checks whether each source directory exists before
 * copying and emits a console.warn (not an error) for any missing skill.
 * This way a partial content tree still produces a valid (if incomplete)
 * install.
 */
const MODULE_SKILLS: Record<
  Exclude<PmKitConfig["modules"][number], never>,
  string[]
> = {
  // "ideation" module: brainstorming-* skills are enumerated dynamically from
  // the source tree at copy time (see copyBrainstormingSkills). No static list
  // needed here.
  ideation: [],

  initiation: ["charter", "stakeholder-register", "product-brief"],

  planning: [
    "prd",
    "wbs",
    "epics-and-stories",
    "schedule-gantt",
    "cost-estimation",
    "risk-matrix",
    "communication-plan",
    "quality-plan",
    "resource-plan",
  ],

  execution: ["sprint-planning", "story-execution", "standup-prep", "sprint-review"],

  closing: ["retrospective", "post-mortem", "closure-report"],
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface CopySkillsTreeOptions {
  /** Absolute path to the user's target project directory. Created if absent. */
  targetDir: string;
  /** Config produced by the interactive install command. */
  config: PmKitConfig;
}

/**
 * copySkillsTree — Write all agentic-pm-kit files into the user's project.
 *
 * Produces the following tree under `targetDir` (spec §6.3):
 *
 * ```
 * targetDir/
 * ├── .claude/skills/pm-kit/   ← if config.agents includes "claude-code"
 * ├── .gemini/skills/pm-kit/   ← if config.agents includes "gemini-cli"
 * ├── docs/pm-kit/
 * │   ├── README.md            ← synthesized from config
 * │   ├── checklists/          ← CHECKLIST.md per installed skill
 * │   ├── templates/           ← TEMPLATE.md per installed skill
 * │   └── outputs/             ← empty; user artifacts land here
 * ├── vendor/pm-kit/           ← always written (if source exists)
 * └── .pm-kit.config.json
 * ```
 *
 * The function is idempotent: re-running it overwrites existing skill and
 * vendor files with the package's current versions. User output files in
 * `docs/pm-kit/outputs/` are never modified.
 *
 * @param options - targetDir and config; see CopySkillsTreeOptions.
 * @returns A promise that resolves when all files have been written.
 */
export async function copySkillsTree(
  options: CopySkillsTreeOptions
): Promise<void> {
  const { targetDir, config } = options;

  // Ensure the target directory exists. If it's already there nothing changes.
  // If the user pointed us at a non-existent path, we create it (and any
  // missing ancestors) so the copy operations below don't fail.
  await fs.mkdir(targetDir, { recursive: true });

  // Build the list of skill names to install based on the configured modules.
  const brainstormingSkillNames = await resolveBrainstormingSkillNames(config);
  const artifactSkillNames = resolveArtifactSkillNames(config);
  const allSkillNames = [...brainstormingSkillNames, ...artifactSkillNames];

  // 1. Agent-target skill trees
  await copyAgentSkillTrees({ targetDir, config, allSkillNames });

  // 2. Synthesized docs tree
  await writeDocs({ targetDir, config, allSkillNames });

  // 3. Vendor tree
  await copyVendorTree({ targetDir });

  // 4. Config file
  await writeConfigFile({ targetDir, config });
}

// ---------------------------------------------------------------------------
// Step 1 — Agent skill trees
// ---------------------------------------------------------------------------

interface AgentTreeOptions {
  targetDir: string;
  config: PmKitConfig;
  allSkillNames: string[];
}

async function copyAgentSkillTrees(opts: AgentTreeOptions): Promise<void> {
  const { targetDir, config, allSkillNames } = opts;

  const agentRoots: Array<{ agent: string; root: string }> = [
    { agent: "claude-code", root: path.join(targetDir, ".claude", "skills", "pm-kit") },
    { agent: "gemini-cli", root: path.join(targetDir, ".gemini", "skills", "pm-kit") },
  ];

  for (const { agent, root } of agentRoots) {
    if (!config.agents.includes(agent as PmKitConfig["agents"][number])) {
      continue;
    }

    // Create the destination root (and any parent .claude/ or .gemini/ dirs
    // that may not yet exist in the user's project).
    await fs.mkdir(root, { recursive: true });

    for (const skillName of allSkillNames) {
      const srcSkillDir = path.join(sourcePaths.skills, skillName);
      const destSkillDir = path.join(root, skillName);

      // Defensive: if the skill directory hasn't been authored yet, warn and
      // continue. We never throw here — a partial install is better than a
      // failed install.
      if (!(await exists(srcSkillDir))) {
        console.warn(
          `[agentic-pm-kit] Skill source missing — skipping: ${srcSkillDir}`
        );
        continue;
      }

      // fs.cp with recursive: true copies the entire skill directory tree.
      // force: true (default) overwrites existing destination files, making
      // the operation idempotent.
      await fs.cp(srcSkillDir, destSkillDir, { recursive: true });
    }
  }
}

// ---------------------------------------------------------------------------
// Step 2 — Synthesized docs tree
// ---------------------------------------------------------------------------

interface WriteDocsOptions {
  targetDir: string;
  config: PmKitConfig;
  allSkillNames: string[];
}

async function writeDocs(opts: WriteDocsOptions): Promise<void> {
  const { targetDir, config, allSkillNames } = opts;
  const docsRoot = path.join(targetDir, "docs", "pm-kit");

  // Create all required subdirectories up front.
  await fs.mkdir(path.join(docsRoot, "checklists"), { recursive: true });
  await fs.mkdir(path.join(docsRoot, "templates"), { recursive: true });
  // outputs/ is always created empty; we never write user artifacts here.
  await fs.mkdir(path.join(docsRoot, "outputs"), { recursive: true });

  // 2a. Synthesized README
  await fs.writeFile(
    path.join(docsRoot, "README.md"),
    synthesizeReadme(config),
    "utf-8"
  );

  // 2b–2c. Checklists and templates (per installed skill)
  for (const skillName of allSkillNames) {
    const srcSkillDir = path.join(sourcePaths.skills, skillName);
    if (!(await exists(srcSkillDir))) {
      // Already warned during agent tree copy; skip silently here.
      continue;
    }

    const checklistSrc = path.join(srcSkillDir, "CHECKLIST.md");
    const templateSrc = path.join(srcSkillDir, "TEMPLATE.md");

    // Copy CHECKLIST.md → docs/pm-kit/checklists/<skill-name>.md
    if (await exists(checklistSrc)) {
      await fs.cp(
        checklistSrc,
        path.join(docsRoot, "checklists", `${skillName}.md`)
      );
    } else {
      console.warn(
        `[agentic-pm-kit] CHECKLIST.md missing for skill: ${skillName}`
      );
    }

    // Copy TEMPLATE.md → docs/pm-kit/templates/<skill-name>.md
    if (await exists(templateSrc)) {
      await fs.cp(
        templateSrc,
        path.join(docsRoot, "templates", `${skillName}.md`)
      );
    } else {
      console.warn(
        `[agentic-pm-kit] TEMPLATE.md missing for skill: ${skillName}`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Step 3 — Vendor tree
// ---------------------------------------------------------------------------

interface CopyVendorOptions {
  targetDir: string;
}

async function copyVendorTree(opts: CopyVendorOptions): Promise<void> {
  const { targetDir } = opts;

  // vendor/pm-kit/ — Scrum Guide, Agile Manifesto, sources-index.json, etc.
  // Always written, regardless of which agent targets or modules were chosen.
  const vendorPmDest = path.join(targetDir, "vendor", "pm-kit");
  if (await exists(sourcePaths.vendorPm)) {
    await fs.mkdir(vendorPmDest, { recursive: true });
    await fs.cp(sourcePaths.vendorPm, vendorPmDest, { recursive: true });
  } else {
    console.warn(
      `[agentic-pm-kit] vendor/pm-kit source missing — skipping: ${sourcePaths.vendorPm}` +
        "\n  (This tree is being populated by a parallel content author; re-run install once it ships.)"
    );
  }

  // vendor/bmad/LICENSE — attribution file, lives in its own subtree.
  const vendorBmadLicenseSrc = path.join(sourcePaths.vendorBmad, "LICENSE");
  const vendorBmadLicenseDest = path.join(targetDir, "vendor", "bmad", "LICENSE");
  if (await exists(vendorBmadLicenseSrc)) {
    await fs.mkdir(path.join(targetDir, "vendor", "bmad"), { recursive: true });
    await fs.cp(vendorBmadLicenseSrc, vendorBmadLicenseDest);
  } else {
    console.warn(
      `[agentic-pm-kit] vendor/bmad/LICENSE source missing — skipping: ${vendorBmadLicenseSrc}` +
        "\n  (This file is being populated by a parallel content author; re-run install once it ships.)"
    );
  }
}

// ---------------------------------------------------------------------------
// Step 4 — Config file
// ---------------------------------------------------------------------------

interface WriteConfigOptions {
  targetDir: string;
  config: PmKitConfig;
}

async function writeConfigFile(opts: WriteConfigOptions): Promise<void> {
  const { targetDir, config } = opts;
  const configPath = path.join(targetDir, ".pm-kit.config.json");
  await fs.writeFile(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
}

// ---------------------------------------------------------------------------
// Skill resolution helpers
// ---------------------------------------------------------------------------

/**
 * Enumerate brainstorming skill directories from the source tree.
 *
 * We walk `skills/pm-kit/` and collect every entry whose name starts with
 * `brainstorming-`. This avoids hardcoding the 20 (or 60) strategy names —
 * Team A authors them incrementally and we pick up whatever is present.
 *
 * Brainstorming deck selection:
 *   - "curated" — include all brainstorming-* skills present in the source.
 *     (In v1, only the 20 curated PM strategies will be authored, so this
 *      naturally produces the curated set.)
 *   - "full" — per spec §6.2, the full-60 set is not yet implemented in v1.
 *     Falls back to "curated" with a console.warn. TODO: implement full deck
 *     in v2 once the remaining 40 strategy skills are authored.
 *
 * If "ideation" is NOT in config.modules, returns an empty array.
 */
async function resolveBrainstormingSkillNames(
  config: PmKitConfig
): Promise<string[]> {
  if (!config.modules.includes("ideation")) {
    return [];
  }

  if (config.brainstorming === "full") {
    // TODO(v2): implement full 60-strategy deck once strategy skills are authored.
    console.warn(
      "[agentic-pm-kit] Full brainstorming deck (60 strategies) is not yet available in v1. " +
        "Falling back to curated 20-strategy deck."
    );
  }

  // Enumerate source directories that start with "brainstorming-"
  let entries: string[] = [];
  try {
    const all = await fs.readdir(sourcePaths.skills, { withFileTypes: true });
    entries = all
      .filter((e) => e.isDirectory() && e.name.startsWith("brainstorming-"))
      .map((e) => e.name);
  } catch {
    console.warn(
      `[agentic-pm-kit] Could not read skills source directory: ${sourcePaths.skills}`
    );
  }

  return entries;
}

/**
 * Build the list of named artifact skill names to install based on the
 * modules the user selected. Skills for modules the user did NOT select are
 * excluded. "ideation" uses dynamic enumeration (see resolveBrainstormingSkillNames).
 */
function resolveArtifactSkillNames(config: PmKitConfig): string[] {
  const names: string[] = [];
  for (const mod of config.modules) {
    if (mod === "ideation") continue; // handled separately
    names.push(...(MODULE_SKILLS[mod] ?? []));
  }
  return names;
}

// ---------------------------------------------------------------------------
// README synthesizer
// ---------------------------------------------------------------------------

/**
 * Produce the synthesized `docs/pm-kit/README.md` content for the user's
 * project. Includes the project name, description, configured languages, and
 * an orientation paragraph pointing to the labs URL.
 *
 * The content is intentionally bilingual-aware: it names both languages when
 * communication and output differ, and uses a neutral English structure for
 * the scaffold itself. (The agent will translate the doc's own content at
 * invocation time using language.output; this file is a starting scaffold.)
 */
function synthesizeReadme(config: PmKitConfig): string {
  const { name, description } = config.project;
  const commLang = config.language.communication;
  const outLang = config.language.output || commLang;

  // One-line descriptions for each lifecycle module (spec §5).
  const moduleDescriptions: Record<PmKitConfig["modules"][number], string> = {
    ideation: "Brainstorming Lab — 20 PM-curated strategies to surface and develop concepts",
    initiation: "Project Charter, Stakeholder Register, Product Brief",
    planning: "PRD, WBS, Schedule/Gantt, Cost Estimation, Risk Matrix, Comms, Quality, Resource Plans",
    execution: "Sprint Planning, Story Execution, Daily Standup Prep, Sprint Review",
    closing: "Retrospective, Post-Mortem, Project Closure Report",
  };

  const moduleLines = config.modules
    .map((m: PmKitConfig["modules"][number]) => `- **${m.charAt(0).toUpperCase() + m.slice(1)}** — ${moduleDescriptions[m]}`)
    .join("\n");

  return `# ${name} — Project Management Playbook

> ${description}

This directory holds your project-management artifacts, generated by Agent Skills installed via \`agentic-pm-kit\`. Each skill produces a draft; you, the human PM, are the signer of record.

## Phases included

${moduleLines}

## How it works

1. Invoke a skill in your AI agent (Claude Code or Gemini CLI).
2. The agent reads the canonical source for the artifact (Scrum Guide, Lean references, etc.) and walks you through the facilitation.
3. The agent saves the artifact to \`outputs/<skill-name>/<slug>.md\` with a provenance header.
4. Open \`checklists/<skill-name>.md\` and mark **PASS** or **FAIL**.
5. On **FAIL**, return to the skill with notes.

## Languages

- Agent communication: ${commLang}
- Artifact output: ${outLang}

## Source mode

${config.sourcesMode}
`;
}

// ---------------------------------------------------------------------------
// Internal utilities
// ---------------------------------------------------------------------------

/**
 * Return true if the given path exists (as a file or directory).
 * Uses fs.access — does not throw on missing paths.
 */
async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}
