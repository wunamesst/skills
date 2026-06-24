# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Repository Purpose

This is a Codex plugin marketplace — a collection of pluggable skill modules distributed via the Plugin Marketplace system. Each plugin follows the `.Codex-plugin/` convention with skills, references, and scripts.

## Plugin Structure

```
.Codex-plugin/
  plugin.json         # Plugin manifest (name, version, description, skills path)
  marketplace.json    # Marketplace catalog for distribution
skills/
  svg-diagram/
    SKILL.md          # Entry point — YAML frontmatter + full instructions
    references/       # Supplementary docs loaded on-demand by SKILL.md
    scripts/          # Executable code (e.g. svg2png.sh)
output/               # Generated files during development (git-ignored)
```

## Installing This Plugin

From any Codex session:
```
/plugin marketplace add https://github.com/wunamesst/skills
/plugin install svg-diagram@svg-diagram-marketplace
```

For local development:
```
/plugin marketplace add .
/plugin install svg-diagram@svg-diagram-marketplace
```

Or symlink the skill directly:
```
ln -sf $(pwd)/skills/svg-diagram ~/.Codex/skills/svg-diagram
```

## Current Plugins

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

## Adding a New Plugin

1. Create `skills/<plugin-name>/SKILL.md` with YAML frontmatter and full instructions.
2. Add `skills/<plugin-name>/references/` for supplementary files.
3. Add `skills/<plugin-name>/scripts/` for executable code.
4. Add the plugin entry to `.Codex-plugin/marketplace.json` plugins array.
5. Add the plugin manifest at `.Codex-plugin/plugin.json` (or create a separate `.Codex-plugin/` per plugin).

## Repo Layout Notes

- `output/` — All skill-generated files during development. Git-ignored.
- `.Codex-plugin/` — Plugin marketplace manifests for distribution.
- `skills/` — Plugin skill directories, each containing a `SKILL.md` entry point.
