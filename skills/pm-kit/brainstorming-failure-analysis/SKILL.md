---
name: brainstorming-failure-analysis
description: "Facilitate a Failure Analysis session that systematically extracts lessons from past failures to prevent recurrence and improve current plans. Invoke when the user needs to learn from a project incident, a failed deliverable, a rejected milestone, or a repeated process breakdown."
---

> Adapted from bmad-method:bmad-brainstorming (MIT, © 2025 BMad Code, LLC). See THIRD_PARTY_NOTICES.md.

## When to use

Use this skill when a specific failure — a missed deadline, a defect escape, a stakeholder rejection, a cost overrun, or a process breakdown — has occurred and the team needs structured learning rather than a blame discussion. Typical triggers include:

- A sprint deliverable was rejected at review and the reason is not fully understood
- A project phase closed over budget or behind schedule and contributing causes are unresolved
- A recurring defect or process error has appeared in multiple sprints
- A post-implementation review revealed that a risk that was identified was not mitigated
- A client or stakeholder formally escalated an issue and a structured response is required

Do not invoke for future-risk ideation; use Reverse Brainstorming or the Risk Matrix skill instead. Do not invoke for exploring open possibilities or reframing a problem; use Question Storming or Assumption Reversal instead.

## Summon the SME

Before facilitating, load the canonical Failure Analysis reference to ground the session in established practice.

**Reading the config.** Check `.pm-kit.config.json` for the `sourcesMode` field:

- If `sourcesMode` is `"online"` (opt-in): fetch the URL stored at the key `sources.failureAnalysis` in `vendor/pm-kit/sources-index.json` using your available web-fetch capability. Do not name a specific tool — use whatever your runtime provides. Ground the facilitation in what you read. Do not fabricate quotations or page numbers from any version of that page.
- If `sourcesMode` is `"offline"` or the field is absent (the default): rely on your general knowledge of failure analysis as a systematic process for collecting and examining data to determine causes of failures and identify corrective actions. Cite the canonical URL from `vendor/pm-kit/sources-index.json` at key `sources.failureAnalysis` in the output. Do not fabricate quotations or page numbers.

In both cases, the URL to cite is `https://en.wikipedia.org/wiki/Failure_analysis`.

## Facilitation script

Walk the user through these steps in sequence. Do not skip steps or combine them.

**Step 1 — Failure statement.** Ask the user to describe the failure in a single, concrete sentence that states what happened, when it happened, and what the observable impact was. Confirm the statement is bounded to a specific event before proceeding.

**Step 2 — Timeline reconstruction.** Ask the user to narrate the sequence of events leading up to the failure. Prompt with: "What was the state of the project or process before this happened?" and "Walk me through what changed in the period leading up to the failure." Capture the timeline as a numbered sequence of events.

**Step 3 — Contributing factors.** For each event in the timeline, ask: "Did this event contribute to the failure, and if so, how?" Identify contributing factors across at least three categories:
  - **Process factors** — steps that were skipped, misunderstood, or absent.
  - **Communication factors** — information that was not shared, was misunderstood, or arrived too late.
  - **Resource factors** — capacity, skill, tooling, or time constraints that created pressure.

**Step 4 — Root cause identification.** Ask: "Which contributing factor, if it had been different, would most likely have prevented the failure?" Identify the primary root cause. Confirm it is a systemic condition or process gap, not an attribution of blame to an individual.

**Step 5 — Impact assessment.** Document the observable impact of the failure: cost (budget deviation), schedule (days or sprints lost), quality (defects, rework, stakeholder trust), and scope (features or deliverables affected). Use measured data where available; use estimates where not.

**Step 6 — Lessons extracted.** Ask: "What do we now know that we did not know or act on before this failure?" Capture at least two lessons. Each lesson is a declarative statement of a durable principle the team can apply going forward.

**Step 7 — Corrective actions.** For each lesson, define at least one corrective action: a process change, a new practice, a communication protocol, or a tooling addition. Each action is assigned to a role and given a target date. Actions must target the root cause or a contributing factor, not a downstream symptom.

**Step 8 — Output.** Produce the completed analysis using the structure in `TEMPLATE.md` (sibling file). Fill every section. Leave no placeholder unfilled.

**Step 9 — Save the artifact.** Save the filled artifact to `docs/pm-kit/outputs/brainstorming-failure-analysis/<short-slug>.md`. `<short-slug>` is a kebab-case ASCII slug (max 40 characters) derived from the failure statement (e.g., `sprint-4-demo-rejection`). Confirm the final path with the user before writing. If the target file already exists, ask the user whether to overwrite, append a date suffix (e.g., `-2026-04-20`), or choose a different slug. The artifact must begin with the three-line provenance header below (preserved as HTML comments so they do not render):

```
<!-- Generated by agentic-pm-kit:brainstorming-failure-analysis on YYYY-MM-DD -->
<!-- Languages: communication=<value>, output=<value> -->
<!-- Source mode: offline | online -->
```

## Languages

The kit separates the language used for live agent–user dialogue from the language used in the saved artifact. Both values live in `.pm-kit.config.json` and are free-form strings — read each value verbatim, never infer a language from the conversation, and never select from a hardcoded list.

**Facilitation dialogue.** Speak to the user during facilitation in the language at `language.communication`. Use the string verbatim.

**Filled artifact (saved TEMPLATE.md output).** Produce the written artifact in the language at `language.output`. If `language.output` is absent or empty, fall back to `language.communication`.

Example values either field might contain: `"en-US"`, `"es-MX"`, `"Português brasileiro"`, `"Mandarin Chinese"`. Accept any string as given. This bifurcation is the normative pattern for every skill in the kit.

## Acceptance gate

When the analysis is complete, point the user to `CHECKLIST.md` (sibling file) and ask them to verify each item. Remind them that the output must be marked **PASS** or **FAIL**. On **FAIL**, invite the user to return with specific notes so the facilitation can be resumed or corrected.
