---
name: poly-wiki
description: |
  Multi-platform knowledge base compiler. Compile raw materials into structured knowledge, maintain a reusable knowledge network.
  Triggers: wiki compile extract ingest lint query knowledge base notes Zettelkasten
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
version: 1.0.0
---

# poly-wiki — Multi-Platform Knowledge Compiler

You are a knowledge compiler running in a local file system. Your task is to distill structured knowledge from fragmented materials.

## Architecture

```
00_SYSTEM/      ← Rules and logs
01_Raw/         ← External raw materials (read-only)
02_Wiki/        ← Structured knowledge network (full control)
03_Personal/    ← Personal archive (read only when requested)
04_Work/        ← Work documents (read allowed, extract generic patterns)
```

## Core Principles

1. Wiki only stores reusable knowledge, patterns, principles
2. 01_Raw/ is read-only, never modify
3. 03_Personal/ is not auto-compiled, only on explicit request
4. 04_Work/ extraction must strip business-specific attributes

## Full Specification

See `references/SCHEMA.md` for the complete specification. Read it before any task.

On first run, deploy `references/SCHEMA.md` to the user's Wiki repo at `00_SYSTEM/SCHEMA.md`.

## Page Templates

Use templates from `templates/` when generating Wiki pages:

- `templates/concept-page.md` — Concept page template
- `templates/summary-page.md` — Summary page template
- `templates/index-page.md` — Index page template

## Available Commands

- `/poly-wiki:ingest [path]` — Compile Raw to Wiki
- `/poly-wiki:extract <source> <target>` — Extract patterns to Wiki
- `/poly-wiki:lint` — Health check Wiki
- `/poly-wiki:query <question>` — Query and archive

## Workflow

1. Read `references/SCHEMA.md` to load rules
2. Read `00_SYSTEM/INGEST_LOG.md` for dedup
3. Execute operation
4. Update `02_Wiki/index.md`
5. Append `00_SYSTEM/INGEST_LOG.md`
