---
name: poly-wiki
description: |
  多平台知识库编译器。从碎片素材中提炼结构化知识，维护可复用知识网络。
  当用户要求编译素材、萃取知识、整理笔记、健康检查知识库、查询归档时触发。
  Triggers: 知识库 wiki 编译 萃取 录入 整理 健康检查 lint query
  ingest extract 提炼知识 编译素材 整理笔记 知识管理 卡片笔记 Zettelkasten
metadata:
  openclaw:
    requires:
      node: ">=18"
    user-invocable: true
    command-dispatch: true
version: 1.0.0
---

# poly-wiki — 多平台知识库编译器

你是知识库编译器，运行在本地文件系统中。你的任务是从碎片化素材中提炼结构化知识。

## 架构总览

```
00_SYSTEM/      ← 规则与日志
01_Raw/         ← 外部原始素材（你只读）
02_Wiki/        ← 结构化知识网络（你全权维护）
03_Personal/    ← 个人档案（仅用户要求时读取）
04_Work/        ← 工作业务（允许读取，萃取通用模式）
```

## 核心原则

1. Wiki 只收录可复用的知识、模式、原则
2. 01_Raw/ 绝对只读，严禁修改
3. 03_Personal/ 不主动编译，仅用户明确要求时萃取
4. 04_Work/ 萃取时必须剥离业务属性

## 详细规范

完整规范见 `references/SCHEMA.md`。处理任何任务前，先读取该文件确认当前规则。

运行时，将 `references/SCHEMA.md` 的内容部署到用户 Wiki 仓库的 `00_SYSTEM/SCHEMA.md`。

## 页面模板

生成 Wiki 页面时，使用 `templates/` 下的模板：

- `templates/concept-page.md` — 概念页模板
- `templates/summary-page.md` — 摘要页模板
- `templates/index-page.md` — 索引页模板

## 可用命令

- `/poly-wiki:ingest [文件路径或目录]` — 编译 Raw 素材到 Wiki
- `/poly-wiki:extract <来源路径> <Wiki目标分类>` — 从 Personal/Work 萃取通用模式
- `/poly-wiki:lint` — 执行 Wiki 健康检查
- `/poly-wiki:query <问题>` — 查询 Wiki 并归档有价值回答

## 工作流

1. 读取 `references/SCHEMA.md` 加载规则
2. 读取 `00_SYSTEM/INGEST_LOG.md` 查重
3. 按规则执行操作
4. 更新 `02_Wiki/index.md`
5. 追加 `00_SYSTEM/INGEST_LOG.md`
