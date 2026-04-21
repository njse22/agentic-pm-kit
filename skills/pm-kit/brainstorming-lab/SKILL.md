---
name: brainstorming-lab
description: "Route the user to the right brainstorming strategy for their situation by asking 3–5 diagnostic questions and recommending one or two strategies from the curated 20. Invoke when the user wants to brainstorm but does not know which technique to use."
---

> Adapted from bmad-method:bmad-brainstorming (MIT, © 2025 BMad Code, LLC). See THIRD_PARTY_NOTICES.md.

## When to use

Use this skill as a meta-skill entry point when the user wants structured creative facilitation but has not yet chosen a brainstorming technique. Typical triggers include:

- The user says "let's brainstorm" or "I need to think through this" without naming a strategy
- A team is stuck and wants a fresh creative lens but does not know which technique fits their situation
- A project phase is beginning and the team wants to select the right divergent-thinking tool before the working session

Do not invoke when the user has already named a specific strategy — invoke that strategy's skill directly. Do not invoke for analytical tasks that do not require divergent thinking.

## Summon the SME

Before facilitating, load the canonical brainstorming reference to ground the strategy selection in established theory.

**Reading the config.** Check `.pm-kit.config.json` for the `sourcesMode` field:

- If `sourcesMode` is `"online"` (opt-in): fetch the URL stored at the key `sources.brainstormingLab` in `vendor/pm-kit/sources-index.json` using your available web-fetch capability. Do not name a specific tool — use whatever your runtime provides. Ground the facilitation in what you read. Do not fabricate quotations or page numbers.
- If `sourcesMode` is `"offline"` or the field is absent (the default): rely on your general knowledge of brainstorming theory and strategy selection, drawing on the Wikipedia article on brainstorming and general creative facilitation principles. Cite the canonical URL from `vendor/pm-kit/sources-index.json` at key `sources.brainstormingLab` in the output. Do not fabricate quotations or page numbers.

In both cases, the URL to cite is `https://en.wikipedia.org/wiki/Brainstorming`.

## Facilitation script

Walk the user through these steps in sequence. Do not skip steps or combine them.

**Step 1 — Situation summary.** Ask the user to describe their situation in two or three sentences: what they are working on and what they hope to achieve through brainstorming. Confirm your understanding before proceeding.

**Step 2 — Diagnostic questions.** Ask the following questions one at a time, waiting for each answer before asking the next. Adjust phrasing naturally; the goal is accurate information, not a rigid questionnaire.

1. *Problem type:* "Is this primarily a problem of understanding (you need to discover something), a problem of generating options (you need ideas), or a problem of evaluating choices (you need to decide among alternatives)?"
2. *Phase:* "Where are you in the project? Early ideation, mid-planning, a specific blocker, or closing review?"
3. *Group size:* "Will this be a solo session, a small team (2–5), or a larger group (6+)?"
4. *Time available:* "How much time can you dedicate to this session — under 30 minutes, 30–90 minutes, or a longer workshop?"
5. *Convergent or divergent:* "Do you need to expand the solution space (generate more ideas) or narrow it down (find the best path forward)?"

**Step 3 — Strategy recommendation.** Based on the diagnostic answers, recommend one or two strategies from the curated 20 listed below. State your recommendation, then give a two- to three-sentence rationale explaining why each recommended strategy fits the user's situation. Do not recommend strategies outside this curated list unless the user explicitly requests the full deck.

**Curated 20 strategies:**

1. `brainstorming-five-whys` — root-cause analysis; best for convergent problem diagnosis
2. `brainstorming-question-storming` — question generation before answers; best for early discovery
3. `brainstorming-assumption-reversal` — flip core assumptions; best for paradigm-shift moments
4. `brainstorming-constraint-mapping` — surface and challenge limitations; best for blocked planning
5. `brainstorming-failure-analysis` — learn from failures; best for risk identification
6. `brainstorming-morphological-analysis` — systematic parameter combinations; best for complex option spaces
7. `brainstorming-six-thinking-hats` — multi-perspective parallel thinking; best for teams needing structured debate
8. `brainstorming-mind-mapping` — visual idea branching; best for solo or small-team exploration
9. `brainstorming-decision-tree-mapping` — map decision paths and outcomes; best for choice evaluation
10. `brainstorming-solution-matrix` — grid of variables and approaches; best for systematic option comparison
11. `brainstorming-resource-constraints` — extreme limitation imposition; best for forcing creative priorities
12. `brainstorming-role-playing` — stakeholder perspective embodiment; best for empathy and stakeholder discovery
13. `brainstorming-brain-writing-round-robin` — silent written idea building; best for inclusive large groups
14. `brainstorming-reverse-brainstorming` — generate problems to reveal solutions; best for risk and opportunity discovery
15. `brainstorming-what-if-scenarios` — radical possibility exploration; best for breaking stuck thinking
16. `brainstorming-first-principles-thinking` — rebuild from fundamental truths; best for breakthrough innovation
17. `brainstorming-values-archaeology` — excavate deep motivating values; best for alignment and priority conflicts
18. `brainstorming-alien-anthropologist` — outsider's bewildered perspective; best for surfacing hidden assumptions
19. `brainstorming-chaos-engineering` — deliberate stress-testing; best for resilience and risk planning
20. `brainstorming-anti-solution` — generate ways to make the problem worse; best for revealing hidden assumptions

**Step 4 — Hand-off.** Tell the user which skill to invoke next. Example: "To run this session, invoke `brainstorming-six-thinking-hats`." Name the skill by its kebab-case identifier so the user's agent can locate and load it.

**Step 5 — Save the artifact.** Save the filled strategy selection rationale to `docs/pm-kit/outputs/brainstorming-lab/<short-slug>.md`. `<short-slug>` is a kebab-case ASCII slug (max 40 chars) derived from the project or problem described by the user (e.g., `bookswap-stakeholder-ideation`). Confirm the final path with the user before writing. If the file exists, ask: overwrite, append a date suffix (e.g., `-2026-04-20`), or pick a new slug. The artifact begins with the three-line provenance header below (HTML comments, do not render):

```
<!-- Generated by agentic-pm-kit:brainstorming-lab on YYYY-MM-DD -->
<!-- Languages: communication=<value>, output=<value> -->
<!-- Source mode: offline | online -->
```

## Languages

The kit separates the language used for live agent–user dialogue from the language used in the saved artifact. Both values live in `.pm-kit.config.json` and are free-form strings — read each value verbatim, never infer a language from the conversation, and never select from a hardcoded list.

**Facilitation dialogue.** Speak to the user during facilitation in the language at `language.communication`. Use the string verbatim.

**Filled artifact (saved TEMPLATE.md output).** Produce the written artifact in the language at `language.output`. If `language.output` is absent or empty, fall back to `language.communication`.

Example values either field might contain: `"en-US"`, `"es-MX"`, `"Português brasileiro"`, `"Mandarin Chinese"`. Accept any string as given. This bifurcation is the normative pattern for every skill in the kit.

## Acceptance gate

When the strategy selection rationale is complete, point the user to `CHECKLIST.md` (sibling file) and ask them to verify each item. Remind them that the output must be marked **PASS** or **FAIL**. On **FAIL**, invite the user to return with specific notes so the facilitation can be resumed or corrected.
