# 示意图（抽象概念 / 机制解释）

适用于：解释工作原理、展示抽象机制、让用户"看懂"而非"查文档"。
不适用于：参考文档、需要精确标注的架构图。

---

## 与普通流程图的核心区别

| 普通流程图 | 示意图 |
|----------|-------|
| 颜色区分类别 | 颜色区分强度（暖=活跃，冷=静止）|
| 矩形为主 | 形状随内容而定 |
| 标签说明一切 | 空间位置本身传达含义 |
| 静态文档 | 优先做成可交互版本 |

**判断标准：** 把所有标签盖住，图还能传达核心意思吗？能 → 好的示意图。不能 → 退化成了流程图。

---

## 物理主题示意图

适用：水循环、CPU 散热、电路、化学反应等有真实物理形态的主题。

**规则：**
- 用 `<path>`、`<ellipse>`、`<polygon>` 画简化的物理外形
- 颜色映射物理属性：暖色（amber/coral/red）= 热/能量，冷色（blue/teal）= 冷/稳定
- 允许唯一例外的 `<linearGradient>`：表示连续物理属性（温度分层、压力梯度）
  - 只能两个色止（stop），不能多段
  - 只用于真正连续的物理量，不用于装饰

**颜色全部 hardcode（物理场景不跟主题走）：**
```xml
<!-- 物理场景：全部 hardcode hex，不用 c-* class -->
<rect x="100" y="50" width="200" height="300" fill="#3B8BD4"/>  <!-- 冷水 -->
<rect x="100" y="50" width="200" height="150" fill="#E8593C"/>  <!-- 热水 -->

<!-- 必须提供深色模式变体 -->
<style>
@media (prefers-color-scheme: dark) {
  .water-cold { fill: #1a5a8a; }
  .water-hot  { fill: #b03020; }
}
</style>
```

---

## 抽象主题示意图

适用：注意力机制、哈希表、调用栈、梯度下降等抽象 CS 概念。

**核心技巧：发明一个让机制可见的空间隐喻。**

常见隐喻模式：

| 概念 | 隐喻 |
|------|------|
| 注意力权重 | 从查询 token 发出的线，粗细=权重 |
| 哈希函数 | 漏斗，多个 key 落入不同桶 |
| 调用栈 | 字面意义的栈，帧叠叠往上长 |
| 梯度下降 | 曲面 + 滚动的小球 + 轨迹 |
| Transformer 层 | 横向叠放的板条，token 线穿过 |
| 缓存命中率 | 两段颜色的进度条 |

**颜色用强度，不用类别：**
```xml
<!-- 注意力权重：线的粗细和颜色深浅都表示权重 -->
<line x1="340" y1="230" x2="116" y2="146" stroke="#EF9F27"
  stroke-width="1" opacity="0.25"/>   <!-- 低权重 -->
<line x1="340" y1="230" x2="340" y2="146" stroke="#EF9F27"
  stroke-width="4" opacity="1.0"/>    <!-- 高权重 -->
```

---

## 优先做交互版本的判断

问自己：**这个概念有"旋钮"吗？**

- 水加热 → 温度旋钮 → 做交互
- 注意力机制 → 点击 token 切换查询 → 做交互
- 梯度下降 → learning rate 滑块 → 做交互
- 哈希表 → 输入不同 key 看落桶 → 做交互
- 静态架构关系 → 没有旋钮 → 静态 SVG 即可

交互版用 `references/interactive.md` 的 HTML 模板。

---

## 标签放置规则

```
优先级：右侧留白区 > 底部 > 左侧 > 顶部 > 内部（仅大区域）

右侧标签（推荐）：
  x = 图形右边界 + 20~30px（text-anchor="start"）
  用 leader 线（0.5px 虚线）指向对应部位

左侧标签（次选）：
  必须检查 label_chars × 8 < anchor_x，防止超出 x=0
  改用 text-anchor="start" 并右移起点更安全

内部标签（仅限大区域）：
  区域宽度 > 200px，高度 > 60px 才放内部标签
  标签到区域边缘 ≥ 20px
```

leader 线模板：
```xml
<line class="leader" x1="{point_x}" y1="{point_y}"
  x2="{label_x-4}" y2="{label_y}"/>
<circle cx="{point_x}" cy="{point_y}" r="2" fill="var(--t)"/>
<text class="ts" x="{label_x}" y="{label_y}"
  text-anchor="start">{标签文字}</text>
```

---

## 示意图示例：注意力权重可视化

```xml
<svg width="100%" viewBox="0 0 680 320" role="img"
  xmlns="http://www.w3.org/2000/svg">
  <title>Transformer 注意力权重示意</title>
  <desc>sat 这个 token 对其他所有 token 的注意力权重，线越粗权重越高</desc>
  <defs>
    <style>
      svg{font-family:"Anthropic Sans",-apple-system,system-ui,"Segoe UI",sans-serif}
      :root{--b:rgba(31,30,29,.3);--bg2:#F5F4ED;--s:#3D3D3A}
      .t{font-size:16px;font-weight:400;fill:var(--s)}
      .ts{font-size:12px;font-weight:400;fill:var(--s)}
      .th{font-size:14px;font-weight:500}
      .c-purple>rect,.c-purple>circle,.c-purple>ellipse{fill:#EEEDFE;stroke:#534AB7}
      .c-purple>.th{fill:#3C3489}.c-purple>.ts{fill:#534AB7}
      .c-gray>rect,.c-gray>circle,.c-gray>ellipse{fill:#F1EFE8;stroke:#5F5E5A}
      .c-gray>.th{fill:#444441}.c-gray>.ts{fill:#5F5E5A}
      .c-amber>rect,.c-amber>circle,.c-amber>ellipse{fill:#FAEEDA;stroke:#854F0B}
      .c-amber>.th{fill:#633806}.c-amber>.ts{fill:#854F0B}
      @media(prefers-color-scheme:dark){
        :root{--b:rgba(224,225,226,.3);--bg2:#2A2A28;--s:#B0B0AD}
        .c-purple>rect,.c-purple>circle,.c-purple>ellipse{fill:#1E1C3D;stroke:#7A70D0}
        .c-purple>.th{fill:#ADA5F0}.c-purple>.ts{fill:#7A70D0}
        .c-gray>rect,.c-gray>circle,.c-gray>ellipse{fill:#252523;stroke:#8E8D88}
        .c-gray>.th{fill:#B0B0AD}.c-gray>.ts{fill:#8E8D88}
        .c-amber>rect,.c-amber>circle,.c-amber>ellipse{fill:#33230A;stroke:#C49020}
        .c-amber>.th{fill:#E0B850}.c-amber>.ts{fill:#C49020}
      }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <!-- Transformer 层（横向板条） -->
  <g class="c-purple">
    <rect x="60" y="40"  width="560" height="24" rx="4" stroke-width="0.5"/>
    <text class="ts" x="72" y="52" dominant-baseline="central">第 3 层</text>
  </g>
  <g class="c-purple">
    <rect x="60" y="76"  width="560" height="24" rx="4" stroke-width="0.5"/>
    <text class="ts" x="72" y="88" dominant-baseline="central">第 2 层</text>
  </g>
  <g class="c-purple">
    <rect x="60" y="112" width="560" height="24" rx="4" stroke-width="0.5"/>
    <text class="ts" x="72" y="124" dominant-baseline="central">第 1 层</text>
  </g>

  <!-- 注意力线（粗细+透明度表示权重） -->
  <line x1="340" y1="210" x2="116" y2="136" stroke="#EF9F27" stroke-width="1"   opacity="0.25" stroke-linecap="round"/>
  <line x1="340" y1="210" x2="228" y2="136" stroke="#EF9F27" stroke-width="1.5" opacity="0.40" stroke-linecap="round"/>
  <line x1="340" y1="210" x2="340" y2="136" stroke="#EF9F27" stroke-width="4"   opacity="1.0"  stroke-linecap="round"/>
  <line x1="340" y1="210" x2="452" y2="136" stroke="#EF9F27" stroke-width="2.5" opacity="0.70" stroke-linecap="round"/>
  <line x1="340" y1="210" x2="564" y2="136" stroke="#EF9F27" stroke-width="1"   opacity="0.20" stroke-linecap="round"/>

  <!-- Token 行 -->
  <g class="c-gray">
    <rect x="80"  y="196" width="72" height="36" rx="6" stroke-width="0.5"/>
    <text class="ts" x="116" y="214" text-anchor="middle" dominant-baseline="central">the</text>
  </g>
  <g class="c-gray">
    <rect x="192" y="196" width="72" height="36" rx="6" stroke-width="0.5"/>
    <text class="ts" x="228" y="214" text-anchor="middle" dominant-baseline="central">cat</text>
  </g>
  <g class="c-amber">
    <rect x="304" y="196" width="72" height="36" rx="6" stroke-width="1"/>
    <text class="th" x="340" y="214" text-anchor="middle" dominant-baseline="central">sat</text>
  </g>
  <g class="c-gray">
    <rect x="416" y="196" width="72" height="36" rx="6" stroke-width="0.5"/>
    <text class="ts" x="452" y="214" text-anchor="middle" dominant-baseline="central">on</text>
  </g>
  <g class="c-gray">
    <rect x="528" y="196" width="72" height="36" rx="6" stroke-width="0.5"/>
    <text class="ts" x="564" y="214" text-anchor="middle" dominant-baseline="central">the</text>
  </g>

  <!-- 说明（在图形空白区，不与线条重叠） -->
  <text class="ts" x="340" y="280" text-anchor="middle">
    线条粗细 = "sat" 对各 token 的注意力权重
  </text>
</svg>
```