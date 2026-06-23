# poly-wiki

基于 Andrej Karpathy LLM Wiki 理念的多平台知识库编译器 Skill。

支持从碎片化素材中自动提炼结构化知识，维护可复用的知识网络。

## 支持平台

| 平台 | 目录 | 状态 |
|------|------|------|
| Claude Code | `.claude/skills/poly-wiki/` | ✅ 已适配 |
| Codex CLI | `.codex/skills/poly-wiki/` | ✅ 已适配 |
| OpenClaw | `skills/poly-wiki/` | ✅ 已适配 |
| Cursor | `.cursor/skills/poly-wiki/` | 🔄 结构同 Claude |
| Gemini CLI | `.gemini/skills/poly-wiki/` | 🔄 结构同 Claude |
| VS Code Copilot | `.agents/skills/poly-wiki/` | 🔄 结构同 Claude |

## 快速开始

### Claude Code

```bash
# 1. 复制 Skill 到项目
cp -r .claude/skills/poly-wiki /path/to/your-wiki/.claude/skills/

# 2. 进入你的 Wiki 目录
cd /path/to/your-wiki

# 3. 启动 Claude Code，自动发现 Skill
claude

# 4. 使用命令
/poly-wiki:ingest
/poly-wiki:extract 03_Personal/项目/MyProject 项目知识
/poly-wiki:lint
/poly-wiki:query "MCP最佳实践"
```

### Codex CLI

```bash
cp -r .codex/skills/poly-wiki /path/to/your-wiki/.codex/skills/
codex
/wiki:ingest
```

### OpenClaw

```bash
openclaw skills install ./skills/poly-wiki --as poly-wiki
openclaw skills list
/wiki:ingest
```

## 目录结构要求

你的 Wiki 仓库需要符合以下结构：

```
your-wiki/
├── 00_SYSTEM/
│   ├── SCHEMA.md          ← 首次运行时从 skill 的 references/SCHEMA.md 部署
│   ├── INGEST_LOG.md      ← 自动创建
│   └── LINT_LOG.md        ← 自动创建
├── 01_Raw/                ← 外部素材（只读）
├── 02_Wiki/               ← 编译产出
├── 03_Personal/           ← 个人档案
└── 04_Work/               ← 工作文档
```

## 命令说明

| 命令 | 用途 | 示例 |
|------|------|------|
| `/poly-wiki:ingest` | 编译 Raw 素材到 Wiki | `/poly-wiki:ingest 01_Raw/Clippings/` |
| `/poly-wiki:extract` | 萃取通用模式 | `/poly-wiki:extract 04_Work/CRM 业务洞察` |
| `/poly-wiki:lint` | 健康检查 | `/poly-wiki:lint` |
| `/poly-wiki:query` | 查询并归档 | `/poly-wiki:query "MCP 工具接入最佳实践"` |

## 自定义

编辑 `references/SCHEMA.md` 来调整：
- 目录边界规则
- 萃取策略
- 输出格式
- 标签体系

首次运行时，skill 会将 `references/SCHEMA.md` 部署到你的 Wiki 仓库的 `00_SYSTEM/SCHEMA.md`。

## 许可证

MIT
