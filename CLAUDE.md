# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a skills registry — a collection of pluggable skill modules for AI coding assistants (Claude Code, Copilot CLI, etc.). Each skill is a self-contained directory with a `SKILL.md` entry point.

## Skill Structure

Every skill follows this layout:

```
<skill-name>/
  SKILL.md          # Entry point — YAML frontmatter (name, description) + full instructions
  references/       # Supplementary docs, templates, examples referenced by SKILL.md
  demo/             # Optional demo assets (currently empty for svg-diagram)
```

- `SKILL.md` is the authoritative file. Frontmatter `name` and `description` fields are used by the skill loader for discovery and matching.
- The `description` in frontmatter should include Chinese trigger keywords when the skill targets Chinese-speaking users.
- Reference files are loaded on-demand by `SKILL.md`, not auto-loaded — keep them focused on specific sub-topics.
- The `demo/` directory is for static demo assets; keep it empty if unused.

## Current Skills

### svg-diagram

Production-grade hand-written SVG diagram skill. Supports sequence diagrams, flowcharts, structure diagrams, ERDs (via mermaid.js), interactive HTML widgets, and illustrative diagrams.

Architecture: `SKILL.md` is a multi-step procedural handbook (type decision → canvas setup → color system → text sizing → per-type specs → dark mode → anti-overlap → checklist). Reference files are specialized sub-manuals:

| Reference | Purpose |
|-----------|---------|
| `references/embedded-styles.md` | Complete embedded CSS style block (color classes + dark mode) — **must read before drawing** |
| `references/examples.md` | Full SVG code for sequence, flow, and structure diagrams |
| `references/erd.md` | Mermaid.js ERD template with dark-mode and rounded-corner post-processing |
| `references/interactive.md` | HTML widget templates: stepper, slider, clickable nodes, animation |
| `references/illustrative.md` | Illustrative diagram rules: spatial metaphors, physical vs abstract themes |

Key design invariants:
- Canvas width is always `viewBox="0 0 680 {H}"` — 680 is a hard constant
- Every SVG must include `xmlns="http://www.w3.org/2000/svg"` and an embedded `<style>` block (from `references/embedded-styles.md`) for standalone browser rendering
- Max 3 color classes (`c-*`) per diagram, chosen by semantic role not sequence
- Text on nodes must use `c-*` classes for automatic dark-mode support; hardcoded hex is only allowed on connecting lines (mid-tone safe values listed in SKILL.md §6)
- ERDs use mermaid.js, everything else is hand-written SVG

## Adding a New Skill

1. Create `<skill-name>/SKILL.md` with YAML frontmatter (`---`, `name`, `description`) and the full instruction body.
2. Add `<skill-name>/references/` for any supplementary files the skill needs to reference.
3. Add `<skill-name>/demo/` only if the skill ships with demo assets.
4. No registration step — skills are auto-discovered by the runtime scanning for `SKILL.md` files.

## Repo Layout Notes

- `svg-diagram-demo/` — static SVG demo assets (overview, detail, introduce) for showcasing the svg-diagram skill; not part of the skill runtime.
- `.claude/skills/` — Claude Code skill symlinks for local development.
