---
description: 从 03_Personal/ 或 04_Work/ 萃取通用模式到 02_Wiki/
argument-hint: <来源路径> <Wiki目标分类>
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

从个人项目或工作文档中萃取可复用的知识模式：

1. 确认用户授权（本命令即视为授权）
2. 读取来源路径下的文件
3. 剥离业务属性（公司名、具体数据、内部术语）
4. 提炼通用模式、架构原则、设计决策
5. 写入 `02_Wiki/项目知识/` 或 `02_Wiki/业务洞察/`
6. Frontmatter 标注 `[业务萃取]` 或 `[个人萃取]`
7. 追加 `00_SYSTEM/INGEST_LOG.md`

示例：
/wiki:extract 04_Work/51Talk/CRM/capacity 业务洞察
