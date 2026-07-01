# FloLib Skills

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Skills](https://img.shields.io/badge/skills-2-success.svg)
![Platforms](https://img.shields.io/badge/platforms-Claude%20Code%20%7C%20Codex-success.svg)

FloLib Skills is a multi-platform agent skill repository. The canonical skill
sources live in `skills/`; platform marketplaces and plugin manifests make the
same skills installable in Claude Code, Codex, and future agent platforms.

## Skills

| Skill | Description | Version |
| --- | --- | --- |
| `svg-diagram` | Production-grade SVG diagrams: sequence, flowchart, architecture, ERD, state machine, timeline. Dark mode, semantic colors, CJK support. | 1.0.0 |
| `poly-wiki` | Knowledge-base compiler for ingesting raw materials, extracting reusable patterns, linting wiki structure, and querying archived knowledge. | 1.0.0 |

## Install

### Claude Code

```text
/plugin marketplace add https://github.com/flolibio/skills
/plugin install svg-diagram@flolib-skills
/plugin install poly-wiki@flolib-skills
```

### Codex

```bash
codex plugin marketplace add flolibio/skills
```

Then open `/plugins`, choose `FloLib Skills`, and install `svg-diagram` or
`poly-wiki`.

For local development from this checkout:

```bash
node scripts/build-platforms.mjs
node scripts/validate.mjs
codex plugin marketplace add .
```

## Repository Layout

```text
skills/                 Canonical cross-platform skill sources
.claude-plugin/         Claude Code marketplace entry
.agents/plugins/        Codex marketplace entry
plugins/                Codex plugin packages generated from skills/
scripts/                Build and validation scripts
docs/                   Repository standards and design notes
```

Do not edit generated copies under `plugins/*/skills/` directly. Edit
`skills/<skill-name>/` and run `node scripts/build-platforms.mjs`.

## svg-diagram

Hand-written SVG diagrams for software architecture and documentation.

Example prompts:

```text
画一个 OAuth2 认证流程的时序图
Draw the microservice architecture for an order system
Use $svg-diagram to create a CI/CD flowchart
```

Supported diagram types:

| Type | Trigger examples |
| --- | --- |
| Sequence | "时序图", "调用链", "sequence diagram" |
| Flowchart | "流程图", "决策流程", "flowchart" |
| Architecture | "架构图", "组件关系", "architecture" |
| State machine | "状态机", "生命周期", "state machine" |
| Timeline | "时间线", "里程碑", "timeline" |
| ERD | "ER图", "数据库表关系", "ER diagram" |
| Interactive | "交互式", "可点击", "interactive widget" |

### SVG to PNG

```bash
cd skills/svg-diagram/scripts
npm install
node svg2png.mjs ../../../output/diagram.svg
```

## poly-wiki

Poly Wiki compiles fragmented materials into a reusable knowledge network.

Example prompts:

```text
Use $poly-wiki to compile 01_Raw/Clippings into my wiki.
把 01_Raw 里的新文章编译到知识库
检查一下知识库有没有断裂链接
```

Claude Code users can also use the bundled command prompts in
`skills/poly-wiki/commands/`. Codex users should invoke the skill with
`$poly-wiki`, `/skills`, or natural language.

Expected wiki structure:

```text
your-wiki/
├── 00_SYSTEM/
│   ├── SCHEMA.md
│   ├── INGEST_LOG.md
│   └── LINT_LOG.md
├── 01_Raw/
├── 02_Wiki/
├── 03_Personal/
└── 04_Work/
```

## Development

Run these checks before publishing:

```bash
node scripts/build-platforms.mjs
node scripts/validate.mjs
```

See `docs/main/flolib-skills-standards.md` for the repository standards.

## License

MIT
