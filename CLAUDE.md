# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a skills registry — a collection of pluggable skill modules for AI coding assistants (Claude Code, Copilot CLI, etc.). Each skill is a self-contained directory with a `SKILL.md` entry point.

## Skill Structure

Every skill follows the standard layout:

```
<skill-name>/
  SKILL.md          # Entry point — YAML frontmatter (name, description) + full instructions
  references/       # Supplementary docs, templates, examples referenced by SKILL.md
  assets/           # Bundled resources used in output (templates, icons, fonts) — optional
  scripts/          # Executable code for deterministic/repetitive tasks — optional
```

- `SKILL.md` is the authoritative file. Frontmatter `name` and `description` fields are used by the skill loader for discovery and matching.
- The `description` in frontmatter should include Chinese trigger keywords when the skill targets Chinese-speaking users.
- Reference files are loaded on-demand by `SKILL.md`, not auto-loaded — keep them focused on specific sub-topics.
- Skill directories must follow the standard structure above. Never add project-specific directories (like `demo/`) inside skill directories — those belong in the repo-level `output/` directory.

## Skill Output Convention

All skill-generated files during development (diagrams, HTML widgets, etc.) go into the repo-level `output/` directory:

```
output/
  <name>.svg            # SVG diagrams
  <name>.html           # HTML interactive widgets
```

- Write all generated files to `output/`, never into skill directories themselves or arbitrary locations.
- Use descriptive filenames (e.g., `oauth2-flow.svg`, not `diagram1.svg`).
- After writing, use `open` to view in browser for verification.

## Current Skills

### svg-diagram

Production-grade hand-written SVG diagram skill. Supports sequence diagrams, flowcharts, structure diagrams, state machines, timelines, ERDs (via mermaid.js), interactive HTML widgets, and illustrative diagrams.

Architecture: `SKILL.md` is a multi-step procedural handbook (type decision → canvas setup → color system → text sizing → per-type specs → dark mode → anti-overlap → checklist). Reference files are specialized sub-manuals:

| Reference | Purpose |
|-----------|---------|
| `references/sequence.md` | Sequence diagram spec + Y-coordinate lookup tables + example |
| `references/flowchart.md` | Flowchart spec + node sizing + decision diamond layout + example |
| `references/structure.md` | Structure diagram spec + nesting rules + example |
| `references/state-machine.md` | State machine spec + initial/final state templates + example |
| `references/timeline.md` | Timeline spec + event marker/card templates + example |
| `references/erd.md` | Mermaid.js ERD template with dark-mode and rounded-corner post-processing |
| `references/interactive.md` | HTML widget templates: stepper, slider, clickable nodes, animation |
| `references/illustrative.md` | Illustrative diagram rules: spatial metaphors, physical vs abstract themes |
| `references/embedded-styles.md` | Complete embedded CSS style block (color classes + dark mode) — backup reference |

Key design invariants:
- Canvas width is always `viewBox="0 0 680 {H}"` — 680 is a hard constant
- Every SVG must include `xmlns="http://www.w3.org/2000/svg"` and an embedded `<style>` block (CSS template in SKILL.md step 2) for standalone browser rendering
- Color classes (`c-*`) chosen by semantic role not sequence; use as many as semantically needed
- Text on nodes must use `c-*` classes for automatic dark-mode support; hardcoded hex is only allowed on connecting lines (mid-tone safe values listed in SKILL.md §6)
- Connecting lines match source node's semantic color
- ERDs use mermaid.js, everything else is hand-written SVG
- PNG export available via `scripts/svg2png.sh`

## Adding a New Skill

1. Create `<skill-name>/SKILL.md` with YAML frontmatter (`---`, `name`, `description`) and the full instruction body.
2. Add `<skill-name>/references/` for any supplementary files the skill needs to reference.
3. Add `<skill-name>/assets/` or `<skill-name>/scripts/` only if the skill bundles resources or executable code.
4. No registration step — skills are auto-discovered by the runtime scanning for `SKILL.md` files.

## Repo Layout Notes

- `output/` — All skill-generated files during development. Git-ignored.
- `.claude/skills/` — Claude Code skill symlinks for local development.
