# FloLib Skills Repository Standards

This document defines how this repository publishes cross-platform agent skills.

## Goals

- Maintain one canonical source for each skill.
- Let users install skills through each supported platform's native marketplace
  or plugin mechanism.
- Keep the structure extensible for more skills and more platforms.
- Prioritize Claude Code and Codex.

## Naming

- Public marketplace name: `flolib-skills`.
- Public display name: `FloLib Skills`.
- Target GitHub repository: `flolibio/skills`.
- Skill names use lowercase kebab-case and match their folder names.

## Source of Truth

`skills/<skill-name>/` is the only hand-authored source for a skill.

Each skill must include:

- `SKILL.md` with YAML frontmatter containing `name` and `description`.
- Optional `references/` for detailed instructions loaded on demand.
- Optional `scripts/` for deterministic helpers.
- Optional `templates/` or `assets/` for reusable output resources.
- Optional `agents/openai.yaml` for Codex UI metadata.

Generated platform copies must not be edited directly.

## Platform Entrypoints

### Claude Code

Claude Code reads the root `.claude-plugin/` marketplace files.

The Claude marketplace points directly at canonical skill folders:

```text
skills/svg-diagram
skills/poly-wiki
```

This preserves the short install flow:

```text
/plugin marketplace add https://github.com/flolibio/skills
/plugin install svg-diagram@flolib-skills
```

### Codex

Codex uses a repo marketplace at:

```text
.agents/plugins/marketplace.json
```

Each Codex plugin lives under:

```text
plugins/<skill-name>/
```

Each plugin must include:

```text
.codex-plugin/plugin.json
skills/<skill-name>/SKILL.md
```

Codex plugin skill copies are generated from `skills/` by:

```bash
node scripts/build-platforms.mjs
```

## Generated Content Rules

`plugins/*/skills/*` is generated from `skills/*`.

The build excludes known platform-specific legacy subdirectories inside a skill,
including `codex/` and `openclaw/`, so generated Codex packages do not contain
nested duplicate `SKILL.md` files.

If a platform needs platform-specific files, add them to the platform packaging
layer instead of duplicating the core skill.

## Adding A Skill

1. Create `skills/<skill-name>/SKILL.md`.
2. Add references, scripts, templates, or assets only when they directly support
   the skill.
3. Add `skills/<skill-name>/agents/openai.yaml` when Codex UI metadata improves
   discovery.
4. Add a Claude marketplace entry in `.claude-plugin/marketplace.json`.
5. Add a Codex marketplace entry in `.agents/plugins/marketplace.json`.
6. Add `plugins/<skill-name>/.codex-plugin/plugin.json`.
7. Add the skill name to `scripts/build-platforms.mjs` and
   `scripts/validate.mjs`.
8. Run the build and validation commands.

## Adding A Platform

Add a platform only when there is a real install or packaging requirement.

Use this pattern:

```text
platforms/<platform-name>/   Platform-specific metadata, docs, or adapters
```

Do not fork the full skill content unless the platform requires a materially
different skill format. Prefer generated adapters from `skills/`.

## Validation

Before publishing:

```bash
node scripts/build-platforms.mjs
node scripts/validate.mjs
```

The validator checks:

- canonical `SKILL.md` frontmatter,
- Claude marketplace name and skill paths,
- Codex marketplace name, display name, policy, and paths,
- Codex plugin manifests,
- generated plugin skill copies,
- absence of nested generated `SKILL.md` files.

## Release Checklist

1. Update the canonical skill content under `skills/`.
2. Run `node scripts/build-platforms.mjs`.
3. Run `node scripts/validate.mjs`.
4. Review `git diff`.
5. Update README installation notes if repository URLs or platform behavior
   changed.
6. Tag or publish the release from the repository root.
