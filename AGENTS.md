# AGENTS.md

This file provides guidance to Codex when working with code in this repository.

## Repository Purpose

This is the FloLib Skills repository: a multi-platform collection of agent
skills distributed through platform-specific marketplace metadata.

Canonical skill sources live in `skills/`. Codex uses the root
`.agents/plugins/marketplace.json` file and generated plugin packages under
`plugins/`.

## Marketplace

Marketplace name:

```text
flolib-skills
```

Install from Codex:

```bash
codex plugin marketplace add flolibio/skills
```

Local development:

```bash
node scripts/build-platforms.mjs
node scripts/validate.mjs
codex plugin marketplace add .
```

## Plugin Structure

```
skills/                 Canonical cross-platform skill sources
.claude-plugin/         Claude Code marketplace entry
.agents/plugins/        Codex marketplace entry
plugins/                Codex plugin packages generated from skills/
scripts/                Build and validation scripts
docs/                   Repository standards and design notes
output/                 Generated files during development, git-ignored
```

Do not edit generated copies under `plugins/*/skills/` directly. Edit
`skills/<skill-name>/` and run the build script.

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

### poly-wiki

Knowledge-base compiler for ingesting raw materials, extracting reusable
patterns, linting wiki structure, and querying archived knowledge.

Claude Code command prompts live in `skills/poly-wiki/commands/`. Codex users
invoke it through `$poly-wiki`, `/skills`, or natural language.

## Adding A Skill

Follow `docs/main/flolib-skills-standards.md`.

1. Add canonical source under `skills/<skill-name>/`.
2. Add the Claude marketplace entry in `.claude-plugin/marketplace.json`.
3. Add the Codex marketplace entry in `.agents/plugins/marketplace.json`.
4. Add `plugins/<skill-name>/.codex-plugin/plugin.json`.
5. Add the skill name to `scripts/build-platforms.mjs` and
   `scripts/validate.mjs`.
6. Run build and validation.

## Repo Layout Notes

- `skills/` — Canonical skill directories, each containing a `SKILL.md` entry point.
- `.agents/plugins/` — Codex marketplace metadata.
- `plugins/` — Generated Codex plugin packages.
- `.claude-plugin/` — Claude Code marketplace metadata.
- `output/` — Skill-generated files during development. Git-ignored.


<claude-mem-context>
# Memory Context

# [skills] recent context, 2026-07-01 12:04pm GMT+8

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 3 obs (1,104t read) | 0t work

### Jun 5, 2026
1743 3:37p 🔵 SVG diagram skill generates unstyled XML output
1744 " 🔵 SVG diagram skill has embedded styles template for browser rendering
1745 3:38p 🔴 SVG diagram generated with proper embedded styles and xmlns
S33 Fix SVG diagram skill output rendering as unstyled XML in browser (Jun 5 at 3:38 PM)
**Investigated**: Read the svg-diagram skill's embedded-styles.md reference file to understand the required CSS style template that must be included in generated SVGs. The reference file defines the complete style system including font variables, color classes (c-teal, c-blue, c-purple, c-amber, c-coral, c-gray, c-green, c-red), and dark mode support via @media(prefers-color-scheme:dark).

**Learned**: SVG files generated by the @svg-diagram skill must include: (1) xmlns="http://www.w3.org/2000/svg" on the root element, (2) a style block inside defs with CSS variables (--b, --bg2, --s), text classes (.t, .ts, .th), and color class definitions, (3) only the color classes actually used in the diagram, (4) dark mode @media block for each used color class. Without the embedded style block, browsers display raw XML tree instead of rendered graphics.

**Completed**: Generated a corrected SVG sequence diagram (svg-diagram-demo/intro-video.svg) depicting a video transcoding workflow with 4 participants (后端, 数据库, IMM, 钉钉) across 2 phases: task creation triggered by launch_status and periodic IMM result polling. The SVG includes proper embedded styles with 3 color classes (c-purple, c-blue, c-amber), xmlns declaration, and dark mode support. File was opened in browser to verify rendering.

**Next Steps**: Awaiting user feedback on whether the regenerated SVG renders correctly in the browser, confirming the style fix resolves the original unstyled XML issue.
</claude-mem-context>
