# agentic-pm-kit

`agentic-pm-kit` is a free, MIT-licensed npm package that installs Agent Skills for project-management work into AI-powered CLI tools. Once installed, those skills enable your AI assistant to produce competent drafts of PMBOK- and Scrum-shaped artifacts — charters, risk matrices, sprint plans, retrospectives, and more — directly from your terminal, grounded in authoritative sources rather than hallucinated content.

Supports **Claude Code** and **Gemini CLI** out of the box.

---

## Install

```bash
npx agentic-pm-kit install
```

No global install required. `npx` fetches the package on first run.

---

## Quick start

1. `cd` into your project directory.
2. Run `npx agentic-pm-kit install`.
3. Answer the interactive prompts (target dir, agent, language, modules — see below).
4. Confirm the summary screen.
5. Open your AI agent and invoke a skill, e.g. `/pm-kit-charter` in Claude Code.

---

## What gets installed

The kit ships **40 Agent Skills** across five lifecycle phases:

| Phase | Skills included |
|---|---|
| **Ideation** | Brainstorming Lab wrapper + 20 PM-curated strategies (Five Whys, Six Thinking Hats, Risk Reversal, and 17 more) |
| **Initiation** | Project Charter, Stakeholder Register, Product Brief |
| **Planning** | PRD, WBS, Schedule/Gantt, Cost Estimation, Risk Matrix, Communication Plan, Quality Plan, Resource Plan |
| **Execution** | Sprint Planning, Story Execution, Daily Standup Prep, Sprint Review |
| **Closing** | Sprint Retrospective, Post-Mortem, Project Closure Report |

Each skill includes a SKILL.md (the agent prompt), a TEMPLATE.md (blank output scaffold), and a CHECKLIST.md (binary acceptance gate). Every artifact skill is grounded in an authoritative source: the Scrum Guide 2020 (bundled), the Agile Manifesto (bundled), or a PMI/ISO canonical URL (linked, open-access version).

---

## Install destinations

### Claude Code

Skills land in your **project directory**, auto-discovered by Claude Code:

```
<project>/
├── .claude/
│   └── skills/
│       └── pm-kit/
│           ├── brainstorming-five-whys/SKILL.md
│           ├── charter/SKILL.md
│           └── ... (40 skills)
├── docs/pm-kit/          ← checklists, templates, outputs
├── vendor/pm-kit/        ← bundled Scrum Guide, Manifesto
└── .pm-kit.config.json
```

Per-project install: each project can have its own language, module selection, and config.

### Gemini CLI

Skills land in a **user-global extension directory**, auto-discovered on Gemini startup:

```
~/.gemini/
└── extensions/
    └── pm-kit/
        ├── gemini-extension.json   ← manifest (auto-written)
        └── skills/
            ├── brainstorming-five-whys/SKILL.md
            ├── charter/SKILL.md
            └── ... (40 skills)
```

One install, shared across all your Gemini projects. The per-project artifacts (`docs/pm-kit/`, `vendor/pm-kit/`, `.pm-kit.config.json`) still land in your project directory.

---

## Interactive prompt flow

`npx agentic-pm-kit install` walks you through eight prompts:

1. **Target directory** — default: current working directory.
2. **Project name and description** — stored in `.pm-kit.config.json`.
3. **Agent target** — Claude Code, Gemini CLI, or both (default: both).
4. **Agent communication language** — free-form text; any language string accepted (e.g., `español`, `English`, `português`). Stored verbatim.
5. **Artifact output language** — defaults to the communication language if left blank.
6. **Modules** — multi-select: Ideation, Initiation, Planning, Execution, Closing (default: all).
7. **Brainstorming deck** — Curated 20 (recommended) or Full 60 (includes ~40 non-PM strategies). Also settable via `--full-deck` flag.
8. **Source mode** — Offline (default, bundled sources only) or Online (agent WebFetches canonical URLs). Also settable via `--online-mode` flag.

A summary screen is shown before any files are written.

### Flags

```
npx agentic-pm-kit install --full-deck     # skip deck prompt, install all 60 strategies
npx agentic-pm-kit install --online-mode   # skip source-mode prompt, enable WebFetch
npx agentic-pm-kit --version               # print package version
npx agentic-pm-kit --help                  # print usage
```

### Re-running install

Re-running `npx agentic-pm-kit install` in a directory that already has a `.pm-kit.config.json` refreshes all skill and vendor files to the current package version. Your own output files in `docs/pm-kit/outputs/` are never modified.

---

## Authoritative sources

| Mode | Behavior |
|---|---|
| **Offline** (default) | Skills use the bundled Scrum Guide 2020 (EN + ES) and Agile Manifesto. For PMBOK concepts, the agent cites named principles and performance domains from general knowledge without fabricating page numbers or direct quotations. |
| **Online** (opt-in) | Skills additionally instruct the agent to WebFetch the canonical URL for each artifact before drafting. Gives access to public PMI explainers and current Scrum Guide pages. Paywalled PMBOK content remains inaccessible. |

---

## FAQ

**What language will the output be in?**
Whatever language you typed into the install prompt. The agent reads your `language.output` config and produces all artifacts in that language. You can type any language string — `español`, `English`, `português`, `français`, etc.

**How do I change the language after install?**
Re-run `npx agentic-pm-kit install` and enter the new language when prompted. Your existing output files are not touched.

**How do I uninstall?**
Delete the following paths:
- `.claude/skills/pm-kit/` (if you installed for Claude Code)
- `~/.gemini/extensions/pm-kit/` (if you installed for Gemini CLI)
- `docs/pm-kit/`
- `vendor/pm-kit/`
- `.pm-kit.config.json`

**Is my data sent anywhere?**
No. The install is purely local: files are written to your disk from the npm package. There is no telemetry, no account, and no network calls during install (beyond the initial `npx` fetch). Online mode causes your AI agent to make web requests when it runs a skill — that traffic is between your agent and the source websites, not Agentic Engineering Agency.

**Which Node version is required?**
Node 18 or later. Bun 1.0+ also works.

**Does this work with agents other than Claude Code and Gemini CLI?**
Not in v1. The skill format (YAML frontmatter + Markdown body) is based on the shared Agent Skills open standard, so other agents may load the files — but only Claude Code and Gemini CLI are tested and officially supported install targets.

---

## Attribution

Built on open-source methodology from BMad-Method (MIT, © 2025 BMad Code, LLC) — see [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

Bundled vendor content: Scrum Guide 2020 (CC BY-SA 4.0, Ken Schwaber and Jeff Sutherland), Agile Manifesto (© 2001, the signatories). Full attribution in THIRD_PARTY_NOTICES.md.

---

## Documentation

Full playbook, phase-by-phase usage guides, and a complete worked example (BookSwap Campus):

**<https://labs.agenticengineering.agency/docs/pm-kit>**

---

## License

MIT — see [LICENSE](./LICENSE).
