# agentic-pm-kit

`agentic-pm-kit` is a free, MIT-licensed npm package that installs Agent Skills for project-management work into AI-powered CLI tools. Once installed, those skills enable your AI assistant to produce competent drafts of PMBOK- and Scrum-shaped artifacts — charters, risk matrices, sprint plans, retrospectives, and more — directly from your terminal, grounded in authoritative sources rather than hallucinated content.

Supports **Claude Code**, **Gemini CLI** and **OpenCode** out of the box.

---

## Install

### Method 1 — npx (recommended, zero config)

```bash
npx agentic-pm-kit install
```

No global install required. `npx` fetches the package on first run.

> **Note:** `npx` runs the version published on npm, and may serve a cached copy. To force the latest: `npx agentic-pm-kit@latest install`. To run an unpublished local clone instead: `npm install && npm run build && node dist/bin.js install`.

### Method 2 — Claude Code plugin

```bash
/plugin marketplace add Agentic-Engineering-Agency/agentic-pm-kit
/plugin install agentic-pm-kit@agentic-engineering-agency
```

Plugin skills are namespaced (`/agentic-pm-kit:charter`) so they never collide with your standalone skills.

### Method 3 — Gemini CLI extension

```bash
gemini extensions install https://github.com/Agentic-Engineering-Agency/agentic-pm-kit
```

### Method 4 — OpenCode

OpenCode V2 needs no plugin manifest — it auto-discovers skills in `.opencode/skills/`. Run the Method 1 installer and select **OpenCode** as the agent target; skills land in `<project>/.opencode/skills/pm-kit/` and are available the next time you open OpenCode in that project.

Prefer to skip the installer and use a local clone directly? Point OpenCode at the skills tree from your project's `opencode.json(c)`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "skills": ["./path/to/agentic-pm-kit/skills/pm-kit"],
}
```

Or copy `skills/pm-kit/` into `~/.config/opencode/skills/` for a user-global install shared across projects. Note: the direct-source route installs only the skill files. The installer is the supported path because the skills read `.pm-kit.config.json` (languages, source mode) and `vendor/pm-kit/` (bundled sources) at runtime — both are written by the installer, alongside `docs/pm-kit/` for your outputs.

---

## Quick start (npx path)

install gobal skill: 

1. `cd agentic-pm-kit`

2. `node dist/bin.js install` 

3. `agentic-pm-kit install`

For a single project:

1. `cd` into your project directory.
2. Run `npx agentic-pm-kit install`.
3. Answer the interactive prompts (target dir, agent, language, modules — see below).
4. Confirm the summary screen.
5. Open your AI agent and invoke a skill, e.g. `charter` in Claude Code or `@charter` in OpenCode.

---

## Usage flow

```mermaid
flowchart TD
  subgraph install["One-time install"]
    A["npx agentic-pm-kit install"] --> B["Interactive prompts: agents, languages, modules"]
    B --> C["Files written: skills, docs/pm-kit, vendor/pm-kit, config"]
  end
  subgraph loop_["Per artifact"]
    D["Open your agent in the project root"] --> E["Invoke a skill: @charter or plain language"]
    E --> F["Skill reads .pm-kit.config.json and the authoritative source"]
    F --> G["Step-by-step facilitation questions"]
    G --> H["Artifact saved to docs/pm-kit/outputs/"]
    H --> I{"Checklist review"}
    I -- "FAIL: return with notes" --> G
    I -- "PASS" --> J["Next lifecycle skill"]
  end
  C --> D
  J --> E
```

You are the signer of record: every skill produces a draft, and the binary checklist (`docs/pm-kit/checklists/<skill>.md`) gates it. Skills chain in lifecycle order — ideation feeds initiation (charter reads your concept memo), initiation feeds planning, and so on.

---

## What gets installed

The kit ships **40 Agent Skills** across five lifecycle phases:

| Phase          | Skills included                                                                                                 |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| **Ideation**   | Brainstorming Lab wrapper + 20 PM-curated strategies (Five Whys, Six Thinking Hats, Risk Reversal, and 17 more) |
| **Initiation** | Project Charter, Stakeholder Register, Product Brief                                                            |
| **Planning**   | PRD, WBS, Schedule/Gantt, Cost Estimation, Risk Matrix, Communication Plan, Quality Plan, Resource Plan         |
| **Execution**  | Sprint Planning, Story Execution, Daily Standup Prep, Sprint Review                                             |
| **Closing**    | Sprint Retrospective, Post-Mortem, Project Closure Report                                                       |

Each skill includes a SKILL.md (the agent prompt), a TEMPLATE.md (blank output scaffold), and a CHECKLIST.md (binary acceptance gate). Every artifact skill is grounded in an authoritative source: the Scrum Guide 2020 (bundled), the Agile Manifesto (bundled), or a PMI/ISO canonical URL (linked, open-access version).

### The five phases at a glance

```mermaid
flowchart LR
  A["Ideation<br/>develop the concept<br/><i>@brainstorming-<br/>lab</i>"] -->|"an idea worth funding"| B["Initiation<br/>authorize the work<br/><i>@charter</i>"]
  B -->|"charter signed"| C["Planning<br/>decide how<br/><i>@prd</i>"]
  C -->|"baseline approved"| D["Execution<br/>build in sprints<br/><i>@sprint-<br/>planning</i>"]
  D -->|"increment delivered"| E["Closing<br/>learn and formalize<br/><i>@retrospective</i>"]
  E -. "lessons feed the next cycle" .-> A
```

Invocation is shown in OpenCode syntax (`@skill-id`). In Claude Code and Gemini CLI, name the skill in plain language (e.g. `charter` or `/agentic-pm-kit:charter` with the plugin). Each phase's entry-point skill is shown; its siblings follow the same pattern (e.g. `@stakeholder-register`, `@wbs`, `@risk-matrix`, `@sprint-review`, `@closure-report`).

These phases map to the PMBOK process groups (Initiating, Planning, Executing, Monitoring & Controlling, Closing). Ideation is a deliberate pre-project addition, and Monitoring & Controlling is folded into the sprint ceremonies (standup prep, sprint review).

| Phase          | What it does                                                                                         | When to use it                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Ideation**   | Turns a vague idea into a developed concept memo via structured brainstorming strategies             | At the very start — before any formal paperwork — to stress-test, expand, or reframe a concept  |
| **Initiation** | Produces formal authorization: charter, stakeholder register, product brief                          | A sponsor is ready to commit; the project needs a name, granted authority, and success criteria |
| **Planning**   | Produces the "how": PRD, WBS, schedule, cost estimate, risk matrix, and comms/quality/resource plans | The charter is signed and you need a detailed, baselined plan before the team starts building   |
| **Execution**  | Runs the build loop: sprint planning, story execution, standup prep, sprint review                   | The team is actively delivering — invoke repeatedly, once per sprint ceremony                   |
| **Closing**    | Captures lessons and formal sign-off: retrospective, post-mortem, closure report                     | A sprint or the whole project ends; use it before people disperse and knowledge evaporates      |



### Skill reference

Every skill is invoked by its ID — `@charter` in OpenCode, or by name (e.g. `charter`) in Claude Code and Gemini CLI.



| Skill                   | Function                                                                                                                                                                                                                                                                                                                                                                                                                  | How to use it                                                                               | Phase      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------- |
| `@brainstorming-lab`    | Routes you to the right brainstorming strategy via a curated shortcut table, or three diagnostic questions when the goal is unclear                                                                                                                                                                                                                                                                                       | Start here when you want to brainstorm but have not picked a technique                      | Ideation   |
| `@brainstorming-*`      | 20 PM-curated strategies: Five Whys, Six Thinking Hats, Role Playing, Mind Mapping, Assumption Reversal, Reverse Brainstorming, Anti-Solution, What If Scenarios, Morphological Analysis, Solution Matrix, Decision Tree Mapping, Constraint Mapping, Resource Constraints, First Principles, Question Storming, Failure Analysis, Chaos Engineering, Values Archaeology, Alien Anthropologist, Brain Writing Round Robin | Invoke the strategy directly, or let `@brainstorming-lab` recommend one                     | Ideation   |
| `@product-brief`        | Business case: problem statement, target users, success metrics, key risks, high-level approach                                                                                                                                                                                                                                                                                                                           | Before or during initiation, when the idea needs a structured business case                 | Initiation |
| `@charter`              | PMBOK-shaped charter: authority, objectives, scope boundaries, milestones, budget envelope, preliminary risks                                                                                                                                                                                                                                                                                                             | Once a concept memo or product brief exists and a sponsor is ready to authorize the project | Initiation |
| `@stakeholder-register` | Identifies, classifies, and documents stakeholders by running a brainstorming strategy against the charter                                                                                                                                                                                                                                                                                                                | At initiation, or whenever the stakeholder landscape needs a refresh                        | Initiation |
| `@prd`                  | Requirements baseline: simplified, PMBOK-compatible Product Requirements Document                                                                                                                                                                                                                                                                                                                                         | When planning begins and scope needs a structured baseline                                  | Planning   |
| `@epics-and-stories`    | Decomposes the PRD into epics and INVEST-shaped user stories with acceptance criteria                                                                                                                                                                                                                                                                                                                                     | Once the PRD is baselined, before sprint planning or WBS construction                       | Planning   |
| `@wbs`                  | Deliverable-oriented Work Breakdown Structure down to manageable work packages                                                                                                                                                                                                                                                                                                                                            | From the epic/story hierarchy, before building a schedule                                   | Planning   |
| `@schedule-gantt`       | Mermaid Gantt diagram plus narrative schedule with dependencies and critical path                                                                                                                                                                                                                                                                                                                                         | After the WBS and effort estimates exist                                                    | Planning   |
| `@cost-estimation`      | Teaches Planning Poker, T-shirt sizing, and three-point (PERT), then records the team's own estimates                                                                                                                                                                                                                                                                                                                     | When an estimate is required for a planning gate — human-led, the team estimates            | Planning   |
| `@risk-matrix`          | Probability × impact risk matrix with PMBOK-style response strategies                                                                                                                                                                                                                                                                                                                                                     | Before a planning gate, milestone review, or go/no-go decision                              | Planning   |
| `@communication-plan`   | Communication matrix, escalation paths, and meeting cadence                                                                                                                                                                                                                                                                                                                                                               | From the charter and stakeholder register, before execution                                 | Planning   |
| `@quality-plan`         | Quality objectives, measurable metrics, assurance activities, control checkpoints                                                                                                                                                                                                                                                                                                                                         | Before execution, to agree the quality bar explicitly                                       | Planning   |
| `@resource-plan`        | Team roster, equipment, budget rollup, external dependencies, hiring timeline                                                                                                                                                                                                                                                                                                                                             | When who/what/how-much commitments must be recorded                                         | Planning   |
| `@sprint-planning`      | Sprint goal plus committed Sprint Backlog drawn from the prioritized Product Backlog                                                                                                                                                                                                                                                                                                                                      | At the start of every sprint                                                                | Execution  |
| `@story-execution`      | Drives one story through implementation, testing, and acceptance                                                                                                                                                                                                                                                                                                                                                          | When a developer or team starts a specific backlog story                                    | Execution  |
| `@standup-prep`         | Three-bullet standup note: yesterday, today, blockers                                                                                                                                                                                                                                                                                                                                                                     | Two minutes before the Daily Scrum                                                          | Execution  |
| `@sprint-review`        | Captures the increment, stakeholder feedback from the demo, and next steps                                                                                                                                                                                                                                                                                                                                                | At the end of every sprint                                                                  | Execution  |
| `@retrospective`        | Sprint/iteration retrospective with owned, dated action items                                                                                                                                                                                                                                                                                                                                                             | When a sprint or iteration closes                                                           | Closing    |
| `@post-mortem`          | Blameless post-mortem for a serious incident, near-miss, or project-level failure                                                                                                                                                                                                                                                                                                                                         | After an incident, or when the project closes                                               | Closing    |
| `@closure-report`       | Formal closure for sponsor signature: charter, final schedule and budget, retros, post-mortems, acceptance records                                                                                                                                                                                                                                                                                                        | When final deliverable acceptance is reached                                                | Closing    |



---

## Install destinations

### Claude Code

Skills land in your **project directory**, auto-discovered by Claude Code:

```
<project>/
├── .claude/
│   └── skills/
│       ├── brainstorming-five-whys/SKILL.md
│       ├── charter/SKILL.md
│       └── ... (40 skills)
├── docs/pm-kit/          ← checklists, templates, outputs
├── vendor/pm-kit/        ← bundled Scrum Guide, Manifesto
└── .pm-kit.config.json
```

Per-project install: each project can have its own language, module selection, and config.

### OpenCode

Skills land in your **project directory**, auto-discovered by OpenCode V2 (no config file or manifest needed):

```
<project>/
├── .opencode/
│   └── skills/
│       └── pm-kit/
│           ├── brainstorming-five-whys/SKILL.md
│           ├── charter/SKILL.md
│           └── ... (40 skills)
├── docs/pm-kit/          ← checklists, templates, outputs
├── vendor/pm-kit/        ← bundled Scrum Guide, Manifesto
└── .pm-kit.config.json
```

Per-project install, same as Claude Code. Mention a skill as `@charter` in your prompt, or let the agent load it by ID when relevant.

### Gemini CLI

Skills land in a **user-global extension directory**, auto-discovered on Gemini startup:

```
~/.gemini/
└── extensions/
    └── agentic-pm-kit/
        ├── gemini-extension.json   ← manifest (auto-written)
        └── skills/
            ├── brainstorming-five-whys/SKILL.md
            ├── charter/SKILL.md
            └── ... (40 skills)
```

One install, shared across all your Gemini projects. The per-project artifacts (`docs/pm-kit/`, `vendor/pm-kit/`, `.pm-kit.config.json`) still land in your project directory.

---

## Interactive prompt flow

`npx agentic-pm-kit install` walks you through eight prompts. In multi-select prompts (agents, modules), move with the arrow keys, **toggle with Space**, and confirm with **Enter** — Enter alone submits the current selection without changing it.

1. **Target directory** — default: current working directory.
2. **Project name and description** — stored in `.pm-kit.config.json`.
3. **Agent target** — Claude Code, Gemini CLI, OpenCode, or any combination (default: all three).
4. **Agent communication language** — free-form text; any language string accepted (e.g., `español`, `English`, `português`). Stored verbatim.
5. **Artifact output language** — defaults to the communication language if left blank.
6. **Modules** — multi-select: Ideation, Initiation, Planning, Execution, Closing (default: all).
7. **Brainstorming deck** — Curated 20 (recommended) or Full 60 (includes ~40 non-PM strategies). Also settable via `--full-deck` flag.
8. **Source mode** — Offline (default, bundled sources only) or Online (agent WebFetches canonical URLs). Also settable via `--online-mode` flag.

A summary screen is shown before any files are written.

### Command reference

| Command                                    | Function                                                                                                                                        | How to use it                                                                                  |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `npx agentic-pm-kit install`               | Interactive installer: prompts for agent targets, languages, modules, deck, and source mode, then writes skills, docs, vendor files, and config | Run it in your project root and answer the eight prompts                                       |
| `npx agentic-pm-kit install --full-deck`   | Installs all 60 brainstorming strategies instead of the curated 20                                                                              | Add the flag to skip the deck prompt                                                           |
| `npx agentic-pm-kit install --online-mode` | Enables WebFetch of the canonical source URLs when a skill runs                                                                                 | Add the flag to skip the source-mode prompt; the agent then needs network access at skill time |
| `npx agentic-pm-kit`                       | Management menu for an existing install: add/remove modules, change language, switch source mode, reinstall, uninstall                          | Run with no subcommand inside a directory that has `.pm-kit.config.json`                       |
| `npx agentic-pm-kit --version`             | Prints the package version                                                                                                                      | Use it to check which version `npx` is serving (e.g. after an upgrade)                         |
| `npx agentic-pm-kit --help`                | Prints usage and all available flags                                                                                                            | Use it any time you forget a flag                                                              |

### Re-running install

Re-running `npx agentic-pm-kit install` in a directory that already has a `.pm-kit.config.json` refreshes all skill and vendor files to the current package version. Your own output files in `docs/pm-kit/outputs/` are never modified.

---

## Authoritative sources

| Mode                  | Behavior                                                                                                                                                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Offline** (default) | Skills use the bundled Scrum Guide 2020 (EN + ES) and Agile Manifesto. For PMBOK concepts, the agent cites named principles and performance domains from general knowledge without fabricating page numbers or direct quotations. |
| **Online** (opt-in)   | Skills additionally instruct the agent to WebFetch the canonical URL for each artifact before drafting. Gives access to public PMI explainers and current Scrum Guide pages. Paywalled PMBOK content remains inaccessible.        |

---

## FAQ

**What language will the output be in?**
Whatever language you typed into the install prompt. The agent reads your `language.output` config and produces all artifacts in that language. You can type any language string — `español`, `English`, `português`, `français`, etc.

**How do I change the language after install?**
Re-run `npx agentic-pm-kit install` and enter the new language when prompted. Your existing output files are not touched.

**How do I uninstall?**
Delete the following paths:

- `.claude/skills/` — remove the skill directories installed by the kit (e.g., `charter/`, `brainstorming-five-whys/`, etc.)
- `.opencode/skills/pm-kit/` (if you installed for OpenCode)
- `~/.gemini/extensions/agentic-pm-kit/` (if you installed for Gemini CLI)
- `docs/pm-kit/`
- `vendor/pm-kit/`
- `.pm-kit.config.json`

**Is my data sent anywhere?**
No. The install is purely local: files are written to your disk from the npm package. There is no telemetry, no account, and no network calls during install (beyond the initial `npx` fetch). Online mode causes your AI agent to make web requests when it runs a skill — that traffic is between your agent and the source websites, not Agentic Engineering Agency.

**Which Node version is required?**
Node 18 or later. Bun 1.0+ also works.

**Does this work with agents other than Claude Code, Gemini CLI and OpenCode?**
Not in v1. The skill format (YAML frontmatter + Markdown body) is based on the shared Agent Skills open standard, so other agents may load the files — but only Claude Code, Gemini CLI and OpenCode are tested and officially supported install targets.

---

## Attribution

Built on open-source methodology from BMad-Method (MIT, © 2025 BMad Code, LLC) — see [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

Bundled vendor content: Scrum Guide 2020 (CC BY-SA 4.0, Ken Schwaber and Jeff Sutherland), Agile Manifesto (© 2001, the signatories). Full attribution in THIRD_PARTY_NOTICES.md.

---

## Documentation

Full playbook and phase-by-phase usage guides:

**<https://labs.agenticengineering.agency/docs/pm-kit>**

---

## License

MIT — see [LICENSE](./LICENSE).
