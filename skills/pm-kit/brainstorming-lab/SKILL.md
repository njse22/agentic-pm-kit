---
name: brainstorming-lab
description: "Route the user to the right brainstorming strategy for their situation by matching their goal to a curated shortcut table or, when the goal is unclear, asking 3 diagnostic questions and recommending one or two strategies from the curated 20. Invoke when the user wants to brainstorm but has not yet chosen a technique."
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

**Step 2 — Goal shortcut.** Ask the user to identify their primary goal from the list below. If they name a goal or clearly imply one, present the 2–3 recommended strategies for that row and proceed to Step 4. If no goal fits, continue to Step 3.

| Goal | Recommended strategies | Rationale |
|---|---|---|
| Discover stakeholders we might be missing | `brainstorming-role-playing`, `brainstorming-alien-anthropologist` | Role-playing surfaces stakeholder perspectives through embodiment; Alien Anthropologist reveals overlooked actors through an outsider lens. |
| Identify risks to the project | `brainstorming-failure-analysis`, `brainstorming-chaos-engineering`, `brainstorming-reverse-brainstorming` | Failure Analysis excavates known failure modes; Chaos Engineering stress-tests the plan against adversarial conditions; Reverse Brainstorming inverts the goal to expose risk vectors. |
| Choose between multiple options or vendors | `brainstorming-solution-matrix`, `brainstorming-decision-tree-mapping`, `brainstorming-morphological-analysis` | Solution Matrix compares options across shared criteria; Decision Tree Mapping traces outcomes per path; Morphological Analysis structures the full parameter space for systematic comparison. |
| Understand the root cause of a problem | `brainstorming-five-whys`, `brainstorming-constraint-mapping` | Five Whys drills iteratively to the causal chain; Constraint Mapping surfaces structural limitations that sustain the problem. |
| Align a team that disagrees about priorities | `brainstorming-six-thinking-hats`, `brainstorming-values-archaeology` | Six Thinking Hats separates roles so each perspective is heard without debate; Values Archaeology surfaces the underlying motivations driving disagreement. |
| Reframe a problem that feels stuck | `brainstorming-assumption-reversal`, `brainstorming-what-if-scenarios`, `brainstorming-first-principles-thinking` | Assumption Reversal dismantles the frame currently constraining thinking; What-If Scenarios introduce radical hypotheticals; First Principles rebuilds the problem from foundational truths. |
| Generate options when scope is ambiguous | `brainstorming-mind-mapping`, `brainstorming-morphological-analysis`, `brainstorming-question-storming` | Mind Mapping branches freely from a central concept; Morphological Analysis generates systematic option combinations; Question Storming surfaces scope boundaries before committing to answers. |
| Evaluate what could go wrong with a plan | `brainstorming-failure-analysis`, `brainstorming-reverse-brainstorming`, `brainstorming-chaos-engineering` | Failure Analysis catalogs known failure modes; Reverse Brainstorming generates problems from the plan's premise; Chaos Engineering tests resilience under deliberate stress. |
| Discover hidden assumptions | `brainstorming-assumption-reversal`, `brainstorming-alien-anthropologist`, `brainstorming-anti-solution` | Assumption Reversal makes implicit premises visible; Alien Anthropologist treats the familiar as foreign to surface taken-for-granted beliefs; Anti-Solution generates failure paths that expose unstated requirements. |
| Facilitate a retrospective / surface dysfunctions | `brainstorming-five-whys`, `brainstorming-values-archaeology`, `brainstorming-reverse-brainstorming` | Five Whys traces incident root causes; Values Archaeology uncovers team friction rooted in conflicting priorities; Reverse Brainstorming inverts "what went well" to reveal systemic issues. |
| Force creative thinking under a tight constraint | `brainstorming-resource-constraints`, `brainstorming-anti-solution` | Resource Constraints imposes extreme scarcity to force novel prioritization; Anti-Solution generates absurd failure paths that, when inverted, reveal non-obvious solutions. |
| Explore a paradigm shift or bold reframing | `brainstorming-first-principles-thinking`, `brainstorming-assumption-reversal`, `brainstorming-what-if-scenarios` | First Principles deconstructs existing models to rebuild from scratch; Assumption Reversal invalidates the current paradigm's core beliefs; What-If Scenarios project the team into radically different futures. |

**Step 3 — Diagnostic questions (fallback).** Use this step only if the user's goal did not match any row in Step 2. Ask the following questions one at a time, waiting for each answer before asking the next. Adjust phrasing naturally; the goal is accurate information, not a rigid questionnaire.

1. *Problem mode:* "Are you primarily trying to understand something you don't yet know, generate new options, or evaluate and choose among options you already have?"
2. *Group size:* "Will this be a solo session, a small team (2–5), or a larger group (6+)?"
3. *Time available:* "How much time can you dedicate to this session — under 30 minutes, 30–90 minutes, or a longer workshop?"

If the recommendation is still ambiguous after these three answers, default to `brainstorming-question-storming` — generating disciplined questions before assuming the problem is well-defined is the safe universal starting point.

**Step 4 — Strategy recommendation.** Based on the goal shortcut (Step 2) or the diagnostic answers (Step 3), recommend one or two strategies from the curated 20 listed below. State your recommendation, then give a two- to three-sentence rationale explaining why each recommended strategy fits the user's situation. Do not recommend strategies outside this curated list unless the user explicitly requests the full deck.

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

**Step 5 — Hand-off.** Tell the user which skill to invoke next. Example: "To run this session, invoke `brainstorming-six-thinking-hats`." Name the skill by its kebab-case identifier so the user's agent can locate and load it.

**Step 6 — Save the artifact.** Save the filled strategy selection rationale to `docs/pm-kit/outputs/brainstorming-lab/<short-slug>.md`. `<short-slug>` is a kebab-case ASCII slug (max 40 chars) derived from the project or problem described by the user (e.g., `bookswap-stakeholder-ideation`). Confirm the final path with the user before writing. If the file exists, ask: overwrite, append a date suffix (e.g., `-2026-04-20`), or pick a new slug. The artifact begins with the three-line provenance header below (HTML comments, do not render):

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
