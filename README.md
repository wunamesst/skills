# Skills Registry

Claude Code plugin marketplace — production-grade skill modules distributed via the Plugin Marketplace system.

## Installation

```bash
# Add this marketplace
/plugin marketplace add https://github.com/wunamesst/skills

# Install the svg-diagram plugin
/plugin install svg-diagram@svg-diagram-marketplace
```

## Plugins

| Plugin | Description |
|--------|-------------|
| [svg-diagram](skills/svg-diagram/) | Production-grade hand-written SVG diagrams (sequence, flowchart, structure, ERD, interactive, state machine, timeline). Dark mode, semantic colors, CJK support. |

## Directory Structure

```
.claude-plugin/
  plugin.json         # Plugin manifest
  marketplace.json    # Marketplace catalog
skills/
  svg-diagram/
    SKILL.md          # Skill entry point with YAML frontmatter
    references/       # Supplementary docs loaded on-demand
    scripts/          # Executable helpers (svg2png.sh)
output/               # Generated files (git-ignored)
```

## Local Development

For local testing without marketplace:
```bash
ln -sf $(pwd)/skills/svg-diagram ~/.claude/skills/svg-diagram
```

## License

MIT
