---
description: 编译 01_Raw/ 中的素材到 02_Wiki/
argument-hint: [文件路径或目录，默认为 01_Raw/]
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

编译指定路径下的 Raw 素材：

1. 读取 `00_SYSTEM/INGEST_LOG.md` 查重
2. 读取 `00_SYSTEM/SCHEMA.md` 确认规则（首次运行时从 `references/SCHEMA.md` 部署）
3. 遍历指定路径下的未处理文件
4. 对每个文件：
   - 去水存干，提取硬核知识
   - 原子化拆分为概念卡片
   - 强制双向链接已有概念
   - 生成/更新 Wiki 页面（使用 `templates/concept-page.md` 模板）
5. 更新 `02_Wiki/index.md`
6. 追加 `00_SYSTEM/INGEST_LOG.md`
7. 输出处理摘要

如果指定了具体文件，只处理该文件。
如果未指定，处理 01_Raw/ 下所有未处理文件。
