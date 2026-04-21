/**
 * PmKitConfig — the contract between the install command (B2) and the file
 * copier (B3). Schema is spec-locked to §6.4 of the design spec.
 */
export interface PmKitConfig {
  /** Package version at install time, e.g. "1.0.0" */
  version: string;
  /** ISO 8601 timestamp recorded at the moment of install */
  installedAt: string;
  /** Agent platforms the user chose to install for */
  agents: ("claude-code" | "gemini-cli")[];
  language: {
    /** Free-form string, stored verbatim from the install prompt */
    communication: string;
    /** Free-form string; defaults to `communication` when left blank */
    output: string;
  };
  /** PM lifecycle modules selected during install */
  modules: ("ideation" | "initiation" | "planning" | "execution" | "closing")[];
  /** "curated" = 20 PM-focused brainstorming strategies; "full" = all 60 */
  brainstorming: "curated" | "full";
  /** "offline" = bundled vendor sources only (default); "online" = opt-in WebFetch */
  sourcesMode: "offline" | "online";
  project: {
    /** Short project name chosen by the user during install */
    name: string;
    /** One-sentence description of the project scope */
    description: string;
  };
}
