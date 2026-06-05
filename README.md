# Skills Registry

AI coding assistant skill modules — pluggable, self-contained skills for Claude Code, Copilot CLI, and other AI coding tools.

## Skills

| Skill | Description |
|-------|-------------|
| [svg-diagram](svg-diagram/) | Production-grade hand-written SVG diagrams (sequence, flowchart, structure, ERD, interactive). Supports dark mode, semantic colors, Chinese/English labels. |

## Directory Structure

```
skills/
├── skill-name/
│   ├── SKILL.md          # Entry point with YAML frontmatter (name, description)
│   ├── references/       # Supplementary docs loaded on-demand
│   ├── assets/           # Bundled resources (templates, icons, fonts)
│   └── scripts/          # Executable code for deterministic tasks
├── output/               # Local generated files (git-ignored)
└── CLAUDE.md             # Project-level guidance for Claude Code
```

## Usage

Each skill is a standalone directory. To use a skill, symlink or copy it into your AI tool's skills directory.

**Claude Code:**
```bash
ln -sf $(pwd)/svg-diagram ~/.claude/skills/svg-diagram
```

**Copilot CLI:**
```bash
ln -sf $(pwd)/svg-diagram ~/.copilot/skills/svg-diagram
```

## Contributing

1. Create a new `<skill-name>/SKILL.md` with YAML frontmatter (`name`, `description`) and full instructions.
2. Add `references/` for supplementary documentation.
3. No registration needed — skills are auto-discovered by scanning for `SKILL.md` files.

See [CLAUDE.md](CLAUDE.md) for this repo's conventions and tooling guidance.

## License

MIT
