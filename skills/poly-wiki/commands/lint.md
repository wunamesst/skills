---
description: 对 02_Wiki/ 执行健康检查
allowed-tools: [Read, Glob, Grep, Bash]
---

执行 Wiki 健康检查：

1. 扫描孤儿页面（无入链）
2. 检测断裂链接（指向不存在的 `[[页面]]`）
3. 检查过期内容（status:已过时）
4. 发现矛盾（不同页面间的事实冲突）
5. 验证索引完整性（`02_Wiki/index.md` 是否覆盖所有页面）
6. 检查标签一致性
7. 输出报告到 `00_SYSTEM/LINT_LOG.md`
