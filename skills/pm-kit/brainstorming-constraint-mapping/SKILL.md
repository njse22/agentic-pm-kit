---
name: brainstorming-constraint-mapping
description: "Facilitate a Constraint Mapping session that identifies, categorizes, and evaluates all constraints bearing on a project challenge to reveal viable solution pathways. Invoke when the user needs to distinguish real from imagined limitations, plan around blockers, or prioritize which constraints to address before execution begins."
---

> Adapted from bmad-method:bmad-brainstorming (MIT, © 2025 BMad Code, LLC). See THIRD_PARTY_NOTICES.md.

## When to use

Use this skill when a team's solution space feels artificially narrow due to constraints that have not been examined or classified. Typical triggers include:

- A planning session keeps producing options that are immediately ruled out without analysis
- A risk review has surfaced blockers but has not mapped which are fixed versus negotiable
- A project scope negotiation requires clear documentation of what cannot be changed
- A retrospective reveals the team worked around constraints that could have been removed
- A new initiative inherits constraints from a prior project phase that may no longer apply

Do not invoke when the challenge is primarily about problem definition; use Question Storming first. Do not invoke for root-cause analysis of a known failure; use Five Whys instead.

## Summon the SME

Before facilitating, load the canonical Constraint Mapping reference to ground the session in established practice.

**Reading the config.** Check `.pm-kit.config.json` for the `sourcesMode` field:

- If `sourcesMode` is `"online"` (opt-in): fetch the URL stored at the key `sources.constraintMapping` in `vendor/pm-kit/sources-index.json` using your available web-fetch capability. Do not name a specific tool — use whatever your runtime provides. Ground the facilitation in what you read. Do not fabricate quotations or page numbers from any version of that page.
- If `sourcesMode` is `"offline"` or the field is absent (the default): rely on your general knowledge of constraint identification and analysis as described in Eliyahu M. Goldratt's Theory of Constraints. Cite the canonical URL from `vendor/pm-kit/sources-index.json` at key `sources.constraintMapping` in the output. Do not fabricate quotations or page numbers.

In both cases, the URL to cite is `https://en.wikipedia.org/wiki/Theory_of_constraints`.

## Facilitation script

Walk the user through these steps in sequence. Do not skip steps or combine them.

**Step 1 — Challenge scope.** Ask the user to state the project challenge, goal, or decision being analyzed in a single sentence. Confirm the scope before proceeding.

**Step 2 — Constraint enumeration.** Ask the user to list every constraint they are aware of — without filtering or judging — using these prompts: "What are you not allowed to do?" "What resources are fixed?" "What deadlines or milestones cannot move?" "What technical or regulatory requirements are non-negotiable?" Capture each constraint as a brief declarative statement.

**Step 3 — Classify each constraint.** For each constraint, assign one of three classifications:
  - **Hard** — externally imposed and verified; cannot be changed within the project (regulatory, legal, physical, contractual).
  - **Soft** — internally assumed or historically inherited; may be negotiable or removable with stakeholder approval.
  - **Imagined** — not grounded in any verified requirement; believed to be a constraint but unconfirmed.

**Step 4 — Impact assessment.** For each constraint, estimate the degree to which it limits the solution space: High (blocks a large category of solutions), Medium (forces a significant trade-off), or Low (minor preference or style restriction).

**Step 5 — Action planning.** For each Soft or Imagined constraint rated Medium or High impact, define a concrete action:
  - Soft constraint: identify who has authority to relax or remove it, and assign an owner and target date to raise the question.
  - Imagined constraint: assign an owner and target date to verify whether the constraint is real.
  Hard constraints remain as documented; no action needed beyond acknowledging them.

**Step 6 — Pathway identification.** Ask the user: "Given only the confirmed Hard constraints, which solution approaches remain open?" Capture at least two viable pathways that respect Hard constraints only.

**Step 7 — Output.** Produce the completed constraint map using the structure in `TEMPLATE.md` (sibling file). Fill every section. Leave no placeholder unfilled.

**Step 8 — Save the artifact.** Save the filled artifact to `docs/pm-kit/outputs/brainstorming-constraint-mapping/<short-slug>.md`. `<short-slug>` is a kebab-case ASCII slug (max 40 characters) derived from the challenge scope (e.g., `launch-timeline-constraints`). Confirm the final path with the user before writing. If the target file already exists, ask the user whether to overwrite, append a date suffix (e.g., `-2026-04-20`), or choose a different slug. The artifact must begin with the three-line provenance header below (preserved as HTML comments so they do not render):

```
<!-- Generated by agentic-pm-kit:brainstorming-constraint-mapping on YYYY-MM-DD -->
<!-- Languages: communication=<value>, output=<value> -->
<!-- Source mode: offline | online -->
```

## Languages

The kit separates the language used for live agent–user dialogue from the language used in the saved artifact. Both values live in `.pm-kit.config.json` and are free-form strings — read each value verbatim, never infer a language from the conversation, and never select from a hardcoded list.

**Facilitation dialogue.** Speak to the user during facilitation in the language at `language.communication`. Use the string verbatim.

**Filled artifact (saved TEMPLATE.md output).** Produce the written artifact in the language at `language.output`. If `language.output` is absent or empty, fall back to `language.communication`.

Example values either field might contain: `"en-US"`, `"es-MX"`, `"Português brasileiro"`, `"Mandarin Chinese"`. Accept any string as given. This bifurcation is the normative pattern for every skill in the kit.

## Acceptance gate

When the mapping is complete, point the user to `CHECKLIST.md` (sibling file) and ask them to verify each item. Remind them that the output must be marked **PASS** or **FAIL**. On **FAIL**, invite the user to return with specific notes so the facilitation can be resumed or corrected.
