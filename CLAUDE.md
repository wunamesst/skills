# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Repository Purpose

This is the FloLib Skills repository: a multi-platform collection of agent
skills distributed through platform-specific marketplace metadata.

Canonical skill sources live in `skills/`. Claude Code uses the root
`.claude-plugin/` files to install those canonical skill directories directly.

## Marketplace

Marketplace name:

```text
flolib-skills
```

Install from Claude Code:

```text
/plugin marketplace add https://github.com/flolibio/skills
/plugin install svg-diagram@flolib-skills
/plugin install poly-wiki@flolib-skills
```

Local development:

```text
/plugin marketplace add .
/plugin install svg-diagram@flolib-skills
/plugin install poly-wiki@flolib-skills
```

## Repository Layout

```text
skills/                 Canonical cross-platform skill sources
.claude-plugin/         Claude Code marketplace entry
.agents/plugins/        Codex marketplace entry
plugins/                Codex plugin packages generated from skills/
scripts/                Build and validation scripts
docs/                   Repository standards and design notes
output/                 Generated files during development, git-ignored
```

Do not edit generated copies under `plugins/*/skills/` directly. Edit
`skills/<skill-name>/` and run:

```bash
node scripts/build-platforms.mjs
node scripts/validate.mjs
```

## Current Skills

### svg-diagram

Production-grade hand-written SVG diagram skill. Supports sequence diagrams,
flowcharts, structure diagrams, state machines, timelines, ERDs, interactive
HTML widgets, and illustrative diagrams.

### poly-wiki

Knowledge-base compiler for ingesting raw materials, extracting reusable
patterns, linting wiki structure, and querying archived knowledge.

Claude Code command prompts live in `skills/poly-wiki/commands/`.

## Adding A Skill

Follow `docs/main/flolib-skills-standards.md`.

At minimum:

1. Add canonical source under `skills/<skill-name>/`.
2. Add the Claude marketplace entry in `.claude-plugin/marketplace.json`.
3. Add the Codex marketplace entry in `.agents/plugins/marketplace.json`.
4. Add `plugins/<skill-name>/.codex-plugin/plugin.json`.
5. Add the skill name to `scripts/build-platforms.mjs` and
   `scripts/validate.mjs`.
6. Run build and validation.
