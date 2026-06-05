---
name: svg-diagram
description: >
  手写 SVG 绘制生产级技术图表。当用户要求画图、绘制流程、展示数据流转、画时序图、
  画架构图、解释概念、绘制任何可视化图表时必须使用本 skill，即使用户没有明确说"画图"
  也要主动判断是否适合用图表辅助说明。支持：时序图、流程图、结构图、ER 图、
  交互图、示意图。比 Mermaid 更美观，支持深色模式，颜色有语义，不会翻车。
  触发关键词：画图、绘图、时序图、流程图、架构图、数据流、示意图、可视化、
  sequence diagram、flowchart、diagram、visualize、数据库结构、ER图。
---

# SVG Diagram Skill — 生产级手册

每次画图前必须完整阅读本文件，然后参考 `references/` 目录获取完整示例代码。

---

## 第一步：图类型决策

**先判断图类型，再决定技术方案。**

| 用户意图 | 图类型 | 技术方案 |
|---------|-------|---------|
| 消息交互、调用链、时序 | 时序图 | 手写 SVG |
| 步骤流程、决策分支 | 流程图 | 手写 SVG |
| 组件包含、系统架构 | 结构图 | 手写 SVG |
| 解释抽象概念、机制原理 | 示意图 | HTML + 内嵌 SVG（可交互）|
| 数据库表结构、ER 图 | ERD | mermaid.js（见 references/erd.md）|
| 有状态切换、需要控件 | 交互图 | HTML widget（见 references/interactive.md）|

**强制拆分规则（超出以下限制必须拆成多张图）：**
- 时序图参与者 > 6 个 → 拆成「总览图 + 子流程图」
- 横向流程节点 > 5 个 → 改竖向或拆分
- 结构图嵌套 > 3 层 → 拆成「系统级 + 组件级」
- 有循环的流程 → 禁止画环形，改用 HTML stepper（见 references/interactive.md）

---

## 第二步：画布与坐标系

```
viewBox="0 0 680 {H}"    ← 680 是常量，绝对不能改
width="100%"
role="img"               ← 无障碍必填
```

**H 的计算方法（按顺序执行）：**
1. 先完成所有元素的坐标计算
2. 找出 max_y = 所有元素中最大的 (y + height)
3. H = max_y + 40
4. 不允许估算，不允许"先写 600 再调"

安全区：x ∈ [40, 640]，y ∈ [40, H-40]

**SVG 根元素模板：**
```xml
<svg width="100%" viewBox="0 0 680 {H}" role="img"
  xmlns="http://www.w3.org/2000/svg">
  <title>图表标题</title>
  <desc>一句话描述图表内容，供屏幕阅读器使用</desc>
  <defs>
    <style>
      svg{font-family:"Anthropic Sans",-apple-system,system-ui,"Segoe UI",sans-serif}
      :root{--b:rgba(31,30,29,.3);--bg2:#F5F4ED;--s:#3D3D3A}
      .t{font-size:16px;font-weight:400;fill:var(--s)}
      .ts{font-size:12px;font-weight:400;fill:var(--s)}
      .th{font-size:14px;font-weight:500}
      /* ← 仅包含本图使用的 c-* 色阶（最多3个）
           完整色阶样式见 references/embedded-styles.md */
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <!-- 内容 -->
</svg>
```

**关键：** `xmlns` 和 `<style>` 缺一不可，否则浏览器直接打开 SVG 文件时会显示为 XML 文本且无样式。
每个 `c-*` 色阶对应的 CSS 规则从 `references/embedded-styles.md` 复制，必须包含 `@media(prefers-color-scheme:dark)` 深色模式反转。

`context-stroke` 使箭头头部自动继承线条颜色，禁止用其他方式定义箭头颜色。

---

## 第三步：颜色系统

### 色阶速查表

| class | 语义 | 50 填充 | 600 描边 | 800 标题 | 600 副标题 |
|-------|-----|--------|---------|---------|----------|
| `c-teal` | 人物/用户/角色 | #E1F5EE | #0F6E56 | #085041 | #0F6E56 |
| `c-blue` | 数据/信息/存储 | #E6F1FB | #185FA5 | #0C447C | #185FA5 |
| `c-purple` | 处理/操作/逻辑 | #EEEDFE | #534AB7 | #3C3489 | #534AB7 |
| `c-amber` | 外部系统/第三方 | #FAEEDA | #854F0B | #633806 | #854F0B |
| `c-coral` | 异步/队列/任务 | #FAECE7 | #993C1D | #712B13 | #993C1D |
| `c-gray` | 中性/结构/起止 | #F1EFE8 | #5F5E5A | #444441 | #5F5E5A |
| `c-green` | 成功/完成/正向 | #EAF3DE | #3B6D11 | #27500A | #3B6D11 |
| `c-red` | 错误/失败/警告 | #FCEBEB | #A32D2D | #791F1F | #A32D2D |

### 颜色使用规则

**必须遵守：**
- 同类型节点用同一颜色（语义分组，不按顺序循环）
- 每张图最多 3 个色阶
- 标题文字用 800，副标题文字用 600，两档不能相同（否则层级感消失）
- `c-*` 只加在 `<g>` 或 `<rect>`/`<circle>`/`<ellipse>` 上，**禁止加在 `<path>` 上**
- `c-*` 使用直接子元素选择器，嵌套 `<g>` 会导致内层变黑，避免多层嵌套

**深色模式规则（生产级关键）：**
- 所有文字颜色必须用 CSS 变量（`var(--color-text-primary)` 等）或 `c-*` class 的自动反转
- 禁止在文字上 hardcode hex 颜色（深色模式下不可见）
- 连线颜色可以 hardcode hex（中间色调在两种模式下都可读，如 `#1D9E75`）
- 唯一例外：物理场景图（画火焰、天空等真实颜色）可全部 hardcode，但必须同时提供 `@media (prefers-color-scheme: dark)` 变体
- **混用陷阱**：hardcoded 背景 + `c-*` 前景 = 深色模式下只有一半反转，禁止混用

---

## 第四步：精确字符宽度

**14px Anthropic Sans 实测宽度（用于计算矩形最小宽度）：**

| 文字类型 | 每字符宽度 | 示例 |
|---------|----------|------|
| 英文大写 A-Z | ~10px | `AUTH` (4字) ≈ 40px |
| 英文小写 a-z | ~7px | `token` (5字) ≈ 35px |
| 混合英文 | ~8px/字符 | `Auth Service` (12字) ≈ 96px |
| 数字 0-9 | ~8px | `200 OK` (6字) ≈ 48px |
| 中文字符 | ~15px/字 | `数据流转` (4字) ≈ 60px |
| 中英混合 | 分段估算 | `POST /login` ≈ 88px |
| 特殊字符 `_/:` | ~6px | `tutor_video` ≈ 88px |

**矩形最小宽度公式：**
```
rect_min_width = max(标题宽度, 副标题宽度) + 48
                                              ↑ 两侧各 24px 内边距
```

**12px 副标题文字宽度 = 14px 估算值 × 0.86**

**验证步骤（写每个矩形前必做）：**
1. 找出该矩形内最长的文字
2. 按类型估算渲染宽度
3. 加 48px 得到最小宽度
4. 如果矩形计划宽度 < 最小宽度，放大矩形或缩短文字

---

## 第五步：各图类型规范

### 时序图

**x 坐标分配（按参与者数量）：**

| 数量 | 中心 x 坐标序列 |
|------|--------------|
| 2 | 160, 520 |
| 3 | 120, 340, 560 |
| 4 | 90, 270, 450, 610 (盒子宽90) |
| 5 | 65, 195, 330, 465, 600 (盒子宽80) |
| 6 | 50, 160, 282, 390, 505, 621 (盒子宽90) |

参与者盒子高度固定 40px，rx=6。

**生命线：**
```xml
<line x1="{cx}" y1="60" x2="{cx}" y2="{H-60}"
  stroke="var(--b)" stroke-width="0.5" stroke-dasharray="4 3"/>
```

**消息箭头（实线=主动调用，虚线=返回/异步）：**
```xml
<!-- 主动调用 -->
<line x1="{from_cx}" y1="{y}" x2="{to_cx}" y2="{y}"
  stroke="{color}" stroke-width="1.5" marker-end="url(#arrow)"/>

<!-- 返回响应 -->
<line x1="{from_cx}" y1="{y}" x2="{to_cx}" y2="{y}"
  stroke="#888780" stroke-width="1" stroke-dasharray="5 3"
  marker-end="url(#arrow)"/>
```

消息标签放在箭头上方 8px：`y="{arrow_y - 8}"`

**阶段分组背景：**
```xml
<rect x="28" y="{group_y}" width="630" height="{group_h}"
  rx="4" fill="var(--bg2)" opacity="0.5"/>
<text class="ts" x="36" y="{group_y + 16}" fill="var(--s)">① 阶段名</text>
```

**间距规范：**
- 参与者头部底边到第一条消息：≥ 20px
- 分组标题到组内第一条消息箭头：≥ 28px（避免标题与内容拥挤）
- 相邻消息箭头之间：≥ 32px
- 分组与分组之间额外增加：20px
- 分组底部边距：≥ 20px（组内最后一条消息箭头到分组底边）
- 最后一条消息到底部参与者：≥ 28px

**分组高度快速算法：**
```
group_h = (n_msgs + 1) × 32 + 16
  其中 n_msgs = 组内消息数，+1 留给标题到第一条消息的空间，+16 留给底部边距
  示例：组内有 6 条消息 → group_h = 7 × 32 + 16 = 240
```

### 流程图

**节点标准尺寸：**
- 单行节点：高 44px
- 双行节点（标题 + 副标题）：高 56px
- 决策菱形：用 `<polygon>` 绘制，宽约 120px，高约 60px

**双行节点文字定位：**
```xml
<text class="th" x="{cx}" y="{rect_y + 19}"
  text-anchor="middle" dominant-baseline="central">标题</text>
<text class="ts" x="{cx}" y="{rect_y + 38}"
  text-anchor="middle" dominant-baseline="central">副标题</text>
```

**横向布局宽度计算（必须提前算）：**
```
n 个节点，间距 gap=20：
total = n × node_w + (n-1) × gap
需满足 total ≤ 600
node_w = (600 - (n-1) × 20) / n

n=3 → node_w = (600-40)/3 = 186
n=4 → node_w = (600-60)/4 = 135
n=5 → node_w = (600-80)/5 = 104（文字会很挤，考虑竖向）
```

起始 x = (680 - total) / 2，保证水平居中。

**竖向箭头起止点（留 10px 间隙）：**
```
上方节点出口：y1 = rect_y + rect_h + 10
下方节点入口：y2 = rect_y - 10（配合 marker 后刚好贴边）
```

**反向回流（L 形，禁止直线穿越其他节点）：**
```xml
<path d="M {x1} {y1} L {x_detour} {y1} L {x_detour} {y2} L {x2} {y2}"
  fill="none" stroke="#E24B4A" stroke-width="1"
  stroke-dasharray="5 3" marker-end="url(#arrow)"/>
```

### 结构图

**嵌套层级颜色必须不同色阶：**
- 外层用浅色（如 `c-blue`）
- 内层用对比色（如 `c-teal`、`c-amber`）
- 同色阶嵌套会使层级感消失，这是生产级硬规则

**容器内边距：**
- 外层容器内边距：≥ 24px
- 内层区域之间间距：≥ 16px
- 标签到容器边缘：≥ 12px

**外层容器模板：**
```xml
<g class="c-blue">
  <rect x="80" y="30" width="560" height="240" rx="20" stroke-width="0.5"/>
  <text class="th" x="360" y="58" text-anchor="middle" dominant-baseline="central">
    系统名称
  </text>
</g>
```

### 示意图（抽象概念解释）

适用场景：解释工作原理、展示数据结构、呈现空间关系。

**核心原则：** 画机制本身，不画"关于机制的图"。颜色表示强度而非类别（暖色=活跃，冷色=静止）。

**静态 SVG vs HTML 交互图决策：**
- 有滑块、开关、点击状态 → HTML（见 references/interactive.md）
- 纯展示、无需操控 → 静态 SVG

详细规范和示例见 `references/illustrative.md`

---

## 第六步：深色模式完整规则

这是生产级与学习级最大的区别。

**安全用法（自动适配深色）：**
```xml
<!-- c-* class：自动处理深浅模式 -->
<g class="c-blue">
  <rect .../>
  <text class="th">标签</text>  <!-- 自动用正确颜色 -->
</g>

<!-- CSS 变量：自动适配 -->
<line stroke="var(--b)" .../>
<rect fill="var(--bg2)" .../>
```

**危险用法（会在深色模式下损坏）：**
```xml
<!-- 禁止：文字 hardcode hex -->
<text fill="#333333">标签</text>  <!-- 深色背景下不可见 -->

<!-- 禁止：c-* 背景 + hardcode 文字混用 -->
<g class="c-blue">
  <rect .../>
  <text fill="#333">标签</text>  <!-- 背景反转但文字不反转 -->
</g>
```

**连线颜色的安全 hex 值（中间色调，两种模式可读）：**
```
#1D9E75  teal 400
#534AB7  purple 400（用于紫色语义线）
#185FA5  blue 600
#BA7517  amber 400
#993C1D  coral 600
#888780  gray 400（通用中性线）
#E24B4A  red 400（错误/回退路径）
```

---

## 第七步：连线防穿越指南

每条连线画之前执行以下检查：

**检查步骤：**
1. 列出所有矩形的 bounding box：`{x, y, x+w, y+h}`
2. 对比连线路径的 x、y 范围
3. 如果直线路径的 x 范围与某矩形 x 范围重叠，且 y 范围也重叠 → 判定穿越

**穿越时的处理方案：**

```xml
<!-- 方案A：L 形折线绕右侧 -->
<path d="M {x1} {y1} L {x1} {y_bypass} L {x2} {y_bypass} L {x2} {y2}"
  fill="none" stroke="..." marker-end="url(#arrow)"/>

<!-- 方案B：从矩形左侧绕行 -->
<path d="M {x1} {y1} L {x_left-20} {y1} L {x_left-20} {y2} L {x2} {y2}"
  fill="none" stroke="..." marker-end="url(#arrow)"/>

<!-- 方案C：标注替代连线（连线太复杂时） -->
<!-- 在源节点和目标节点各放一个相同字母标记 -->
<text class="ts" x="{x}" y="{y}">→ A</text>
```

**时序图特殊规则：** 消息只能水平，不能斜向。如果两个参与者不相邻，消息仍是水平线，只是跨越更远。

---

## 第八步：画完必做检查表

按顺序逐项检查，不能跳过：

**坐标与布局：**
- [ ] viewBox H = 最后元素 max(y+height) + 40，是计算值不是估算
- [ ] 同行所有矩形总宽（含间距）≤ 600px，实际算过
- [ ] text-anchor="end" 的最小 x > 文字估算宽度（防止超出左边界）
- [ ] 没有任何连线穿过不相关的矩形（逐条检查过）

**文字：**
- [ ] 所有 `<text>` 都有 class（`t` / `ts` / `th`），没有裸 text
- [ ] 所有节点内文字加了 `dominant-baseline="central"`
- [ ] 没有文字超出其所在矩形右边界（宽度算过）

**颜色与深色模式：**
- [ ] 节点文字全部用 `c-*` class 自动处理，没有 hardcode hex
- [ ] 连线颜色用安全 hex 值（见第六步列表）
- [ ] 没有 hardcode 背景 + `c-*` 前景混用

**SVG 规范：**
- [ ] 根 `<svg>` 有 `xmlns="http://www.w3.org/2000/svg"`（否则浏览器当 XML 显示）
- [ ] `<defs>` 内有 `<style>` 块（含 CSS 变量、文字 class、使用的 c-* 色阶 + 深色模式）
- [ ] 所有 `<path>` 连线都有 `fill="none"`
- [ ] `<defs>` 里有 arrow marker
- [ ] 根 `<svg>` 有 `role="img"`、`<title>`、`<desc>`
- [ ] 每张图只有一个 `<svg>` 元素

---

## 参考文件索引

| 文件 | 内容 | 何时读 |
|------|------|-------|
| `references/embedded-styles.md` | 完整内嵌 CSS 样式模板（色阶 + 深色模式） | **每次画图前必读** |
| `references/examples.md` | 时序图、流程图、结构图完整示例 | 画对应图类型时 |
| `references/erd.md` | mermaid.js ERD 完整模板 + 深色模式适配 | 画数据库关系图时 |
| `references/interactive.md` | HTML 交互图模板（滑块、stepper、点击） | 需要交互控件时 |
| `references/illustrative.md` | 示意图规范（抽象概念空间隐喻） | 解释原理/机制时 |

---

## 输出方式

1. SVG 必须自包含：嵌入 `<style>` + `xmlns`，浏览器直接打开即可渲染
2. 画图前先读取 `references/embedded-styles.md` 获取完整 CSS 色阶模板
3. 如有 `visualize:show_widget` 可用，传入完整 SVG 代码展示
4. HTML 交互图传完整 HTML 片段（不含 DOCTYPE/html/body 标签）
5. 图前后用文字说明上下文，不要连续调用两次 show_widget 不加文字