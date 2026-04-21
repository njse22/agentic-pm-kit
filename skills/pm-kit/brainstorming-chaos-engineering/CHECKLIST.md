# Chaos Engineering — Acceptance Checklist

- [ ] Steady state is defined with at least two measurable indicators and a stated measurement method for each.
- [ ] The hypothesis is stated explicitly before failure variables are introduced.
- [ ] At least eight failure variables are listed, spanning at least three of the four prompt categories (People, Dependencies, Scope, Environment).
- [ ] Each failure variable is probed: the result (Resilient, Fragile, Unknown) is recorded with an explanation of what breaks and an estimated recovery time.
- [ ] The top three systemic weaknesses are ranked by likelihood × impact, not selected arbitrarily.
- [ ] At least one concrete recovery mechanism is proposed for each of the three top weaknesses, with a named owner and target date.
- [ ] The output cites the canonical Chaos Engineering reference URL (`https://principlesofchaos.org/`).
- [ ] The "Source consulted" section records which mode was used (offline or online) and does not include fabricated quotations or page numbers.
- [ ] The facilitation dialogue is in the language at `language.communication`, and the saved artifact is in the language at `language.output` (falling back to `language.communication` if `language.output` is absent or empty).
- [ ] The artifact is saved to `docs/pm-kit/outputs/brainstorming-chaos-engineering/<slug>.md` and begins with the three-line provenance header.

> Mark **PASS** or **FAIL**. On **FAIL**, return to the skill with notes.
