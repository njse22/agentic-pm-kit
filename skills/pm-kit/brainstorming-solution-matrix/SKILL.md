---
name: brainstorming-solution-matrix
description: "Facilitate a Solution Matrix session to score and rank competing options against weighted criteria, producing a defensible, bias-reduced recommendation. Invoke when the user must choose among two or more alternatives and the decision requires structured multi-criteria evaluation."
---

> Adapted from bmad-method:bmad-brainstorming (MIT, © 2025 BMad Code, LLC). See THIRD_PARTY_NOTICES.md.

## When to use

Use this skill when a team must choose among two or more alternatives and needs a structured, auditable basis for the decision. Typical triggers include:

- A vendor or tool selection where multiple candidates have been shortlisted and must be compared on defined criteria
- A technical architecture trade-off where team members hold differing priorities (performance vs. cost vs. maintainability)
- A feature prioritization session where business value, effort, and strategic alignment must all be weighted
- A risk response selection where several mitigation options differ across cost, effectiveness, and implementation speed

Do not invoke when only one option exists or when the decision has already been made and justification is not needed. Do not invoke for open-ended ideation; prefer Mind Mapping or Morphological Analysis when options have not yet been generated.

## Summon the SME

Before facilitating, load the canonical decision matrix reference to ground the session in established practice.

**Reading the config.** Check `.pm-kit.config.json` for the `sourcesMode` field:

- If `sourcesMode` is `"online"` (opt-in): fetch the URL stored at the key `sources.solutionMatrix` in `vendor/pm-kit/sources-index.json` using your available web-fetch capability. Do not name a specific tool — use whatever your runtime provides. Ground the facilitation in what you read. Do not fabricate quotations or page numbers from any version of that page.
- If `sourcesMode` is `"offline"` or the field is absent (the default): rely on your general knowledge of multi-criteria decision analysis and the Pugh concept selection / weighted decision matrix method. Cite the canonical URL from `vendor/pm-kit/sources-index.json` at key `sources.solutionMatrix` in the output. Do not fabricate quotations or page numbers.

In both cases, the URL to cite is `https://en.wikipedia.org/wiki/Decision_matrix`.

## Facilitation script

Walk the user through these steps in sequence. Do not skip steps or combine them.

**Step 1 — Decision question.** Ask the user to state the selection decision in one sentence (e.g., "Which data persistence layer should we adopt for the payment service?"). Confirm it is a genuine selection among real alternatives.

**Step 2 — List alternatives.** Ask the user to name all alternatives under consideration. Record them as columns. Aim for 2–6 alternatives; warn if there is only one (no comparison is possible).

**Step 3 — Define criteria.** Ask the user to list the criteria by which alternatives will be judged (e.g., "total cost of ownership," "team expertise," "scalability," "time to implement"). Aim for 3–8 criteria. Ensure each criterion is independent and observable.

**Step 4 — Assign weights.** Ask the user to assign a relative weight to each criterion on a scale of 1–5 (1 = low importance, 5 = critical). Confirm that at least one criterion has a weight of 4 or 5 to ensure the matrix reflects genuine priorities.

**Step 5 — Score each alternative.** For each alternative, score it against each criterion on a scale of 1–5 (1 = poor fit, 5 = excellent fit). Walk through one row at a time. Do not allow scores to be assigned without a brief rationale from the user.

**Step 6 — Compute weighted scores.** For each cell, multiply the raw score by the criterion weight. Sum the weighted scores per alternative to produce a total. The alternative with the highest total is the matrix recommendation.

**Step 7 — Sense check.** Present the totals to the user. Ask: "Does this ranking match your team's intuition? If not, identify which criterion weighting may be off and adjust." Run one sensitivity pass if the user wants to test a different weighting scenario.

**Step 8 — Recommendation.** State the recommended alternative based on the final weighted totals. Note any close runner-up and the criterion on which it outperforms the winner.

**Step 9 — Output.** Produce the completed matrix using the structure in `TEMPLATE.md` (sibling file). Fill every section. Leave no placeholder unfilled.

**Step 10 — Save the artifact.** Save the filled artifact to `docs/pm-kit/outputs/brainstorming-solution-matrix/<short-slug>.md`. `<short-slug>` is a kebab-case ASCII slug (max 40 characters) derived from the decision question (e.g., `payment-persistence-layer`). Confirm the final path with the user before writing. If the target file already exists, ask the user whether to overwrite, append a date suffix (e.g., `-2026-04-20`), or choose a different slug. The artifact must begin with the three-line provenance header below (preserved as HTML comments so they do not render):

```
<!-- Generated by agentic-pm-kit:brainstorming-solution-matrix on YYYY-MM-DD -->
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
