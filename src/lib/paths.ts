/// <reference types="node" />

/**
 * paths.ts — Package-root resolution helpers for ESM environments.
 *
 * Path math (verified against tsconfig.json outDir: "dist", rootDir: "src"):
 *   After `tsc`:
 *     src/lib/paths.ts  →  dist/lib/paths.js
 *
 *   At runtime, `import.meta.url` resolves to:
 *     file:///path/to/agentic-pm-kit/dist/lib/paths.js
 *
 *   So:
 *     here  = dirname(fileURLToPath(import.meta.url))
 *           = /path/to/agentic-pm-kit/dist/lib
 *
 *     resolve(here, "../..")
 *           = /path/to/agentic-pm-kit/dist/lib/../../
 *           = /path/to/agentic-pm-kit          ← packageRoot ✓
 *
 * This resolves correctly whether the package is:
 *   - run directly from the repo (via `bun run src/bin.ts` — Bun compiles on the fly)
 *   - installed globally via `npm install -g agentic-pm-kit`
 *   - invoked via `npx agentic-pm-kit`
 *
 * NOTE: Do NOT use `__dirname` or `__filename` — those are CommonJS-only.
 * The package is ESM ("type": "module" in package.json).
 */

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Current file after compilation: dist/lib/paths.js
const here = dirname(fileURLToPath(import.meta.url));

/**
 * Absolute path to the package root directory.
 * Computed at module load time; never hardcoded.
 */
export const packageRoot = resolve(here, "../..");

/**
 * Absolute source paths for content that the file copier reads from.
 * These point into the package's own installed tree, not the user's project.
 */
export const sourcePaths = {
  /** The pm-kit skills tree: brainstorming-* and artifact skill directories */
  skills: resolve(packageRoot, "skills/pm-kit"),

  /** Bundled vendor files for pm-kit (Scrum Guide, Agile Manifesto, sources-index.json) */
  vendorPm: resolve(packageRoot, "vendor/pm-kit"),

  /** BMad-Method vendored content (LICENSE file for attribution) */
  vendorBmad: resolve(packageRoot, "vendor/bmad"),
} as const;
