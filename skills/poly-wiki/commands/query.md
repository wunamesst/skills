---
description: 查询 Wiki 知识并归档有价值回答
argument-hint: <问题>
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

查询 Wiki 中的知识：

1. 读取 `02_Wiki/index.md` 定位相关页面
2. 读取相关页面内容
3. 综合回答用户问题
4. 如果回答有价值，询问用户是否归档到 Wiki
5. 若用户同意，写入 `02_Wiki/` 作为新页面或补充
6. 追加 `00_SYSTEM/INGEST_LOG.md`（类型:query）
