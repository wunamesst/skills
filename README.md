# Skills Registry

A curated collection of production-grade Claude Code skills.

## Features

- High-quality SVG diagram generation
- Architecture diagrams
- Sequence diagrams
- ER diagrams
- State machines
- Timeline visualizations
- Dark mode support
- CJK typography support

## Example Output

<table>
  <tr>
    <td align="center"><b>Sequence Diagram</b></td>
    <td align="center"><b>Flowchart</b></td>
    <td align="center"><b>Architecture Diagram</b></td>
  </tr>
  <tr>
    <td><img src="assets/sequence-example.svg" width="280" alt="Sequence diagram example"></td>
    <td><img src="assets/flowchart-example.svg" width="280" alt="Flowchart example"></td>
    <td><img src="assets/architecture-example.svg" width="280" alt="Architecture diagram example"></td>
  </tr>
</table>

## Installation

```bash
/plugin marketplace add https://github.com/wunamesst/skills
/plugin install svg-diagram@svg-diagram-marketplace
```

## Usage

After installation, just describe what you need in natural language — the skill activates automatically when it detects a diagram request.

**Direct invocation:**
```
/svg-diagram 画一个用户登录的时序图
/svg-diagram draw a CI/CD pipeline flowchart
```

**Natural language triggers (auto-detected):**
```
画一个 OAuth2 认证流程的时序图
Draw the microservice architecture for an order system
帮我画一个 DDD 分层架构图
```

**Supported diagram types:**

| Type | Trigger examples |
|------|-----------------|
| Sequence | "时序图", "调用链", "sequence diagram" |
| Flowchart | "流程图", "决策流程", "flowchart" |
| Architecture | "架构图", "组件关系", "architecture" |
| State machine | "状态机", "生命周期", "state machine" |
| Timeline | "时间线", "里程碑", "timeline" |
| ERD | "ER图", "数据库表关系", "ER diagram" |
| Interactive | "交互式", "可点击", "interactive widget" |

Output files are written to `output/` and opened in your browser automatically.

## Available Skills

| Skill | Description |
|---------|-------------|
| svg-diagram | Generate polished SVG diagrams for software architecture and documentation. |


## Local Development

For local testing without marketplace:
```bash
ln -sf $(pwd)/skills/svg-diagram ~/.claude/skills/svg-diagram
```

## License

MIT
