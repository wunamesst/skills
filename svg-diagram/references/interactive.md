# 交互图与 HTML Widget

当图表需要以下任一特性时，使用 HTML + 内嵌 SVG，不用纯静态 SVG：
- 滑块、开关、按钮等控件
- 点击节点触发状态变化
- 分步展示（stepper）
- 动画效果（流动线条、淡入淡出）
- 循环流程（必须用 stepper，禁止画环形）

---

## 核心约束

```
禁止使用 localStorage / sessionStorage（沙箱不支持）
禁止使用 position: fixed（导致 iframe 高度坍塌）
禁止使用 display: none 在流式渲染期间隐藏内容
脚本在流式渲染结束后才执行，JS 驱动的 stepper 没问题
外部库只能从：cdnjs.cloudflare.com / esm.sh / cdn.jsdelivr.net / unpkg.com
```

---

## 模板 A：Stepper（分步流程 / 循环流程）

适用：有循环的流程（事件循环、Krebs 循环、GC 周期）、步骤讲解。

```html
<style>
.step-container { padding: 1rem 0; }
.step-nav { display:flex; align-items:center; gap:12px; margin-bottom:16px; }
.step-dots { display:flex; gap:6px; }
.dot { width:8px; height:8px; border-radius:50%; background:var(--color-border-secondary); transition:background .2s; }
.dot.active { background:var(--color-text-info); }
.step-btn { padding:6px 16px; border-radius:var(--border-radius-md);
  border:1px solid var(--color-border-secondary); background:var(--color-background-secondary);
  color:var(--color-text-primary); cursor:pointer; font-size:13px; }
.step-btn:hover { border-color:var(--color-border-primary); }
.step-panel { border:1px solid var(--color-border-tertiary);
  border-radius:var(--border-radius-lg); padding:20px; }
.step-title { font-size:14px; font-weight:500; color:var(--color-text-primary); margin-bottom:8px; }
.step-desc { font-size:13px; color:var(--color-text-secondary); line-height:1.6; }
</style>

<div class="step-container">
  <div class="step-nav">
    <button class="step-btn" onclick="prevStep()">← 上一步</button>
    <div class="step-dots" id="dots"></div>
    <button class="step-btn" onclick="nextStep()">下一步 →</button>
    <span id="step-counter" style="font-size:12px;color:var(--color-text-tertiary)"></span>
  </div>
  <div class="step-panel" id="panel"></div>
</div>

<script>
const steps = [
  {
    title: "步骤 1 标题",
    desc: "步骤 1 详细说明，可以很长。",
    svg: `<svg width="100%" viewBox="0 0 680 200" role="img">
      <title>步骤1</title><desc>步骤1示意</desc>
      <defs><marker id="a1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5"/></marker></defs>
      <!-- 步骤1 SVG 内容 -->
    </svg>`
  },
  {
    title: "步骤 2 标题",
    desc: "步骤 2 说明。",
    svg: `<svg width="100%" viewBox="0 0 680 200" role="img">
      <title>步骤2</title><desc>步骤2示意</desc>
      <defs><marker id="a2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5"/></marker></defs>
      <!-- 步骤2 SVG 内容 -->
    </svg>`
  }
];

let current = 0;

function render() {
  const s = steps[current];
  document.getElementById('panel').innerHTML = `
    <div class="step-title">${s.title}</div>
    ${s.svg}
    <div class="step-desc" style="margin-top:12px">${s.desc}</div>
  `;
  const dots = document.getElementById('dots');
  dots.innerHTML = steps.map((_, i) =>
    `<div class="dot ${i===current?'active':''}"></div>`
  ).join('');
  document.getElementById('step-counter').textContent = `${current+1} / ${steps.length}`;
}

function nextStep() { current = (current + 1) % steps.length; render(); }
function prevStep() { current = (current - 1 + steps.length) % steps.length; render(); }

render();
</script>
```

**注意：** 每个步骤的 SVG 内嵌了独立的 `<marker>`，id 必须唯一（a1、a2...），
否则后续步骤的箭头会引用前一个步骤已卸载的 marker。

---

## 模板 B：滑块控件图（连续量调节）

适用：展示参数变化对系统状态的影响（温度、负载、延迟等）。

```html
<style>
.ctrl { display:flex; align-items:center; gap:12px; margin:12px 0;
  font-size:13px; color:var(--color-text-secondary); }
.ctrl input[type=range] { flex:1; }
.ctrl-val { min-width:40px; text-align:right; color:var(--color-text-primary); font-weight:500; }
</style>

<svg id="main-svg" width="100%" viewBox="0 0 680 300" role="img">
  <title>可调节示意图</title>
  <desc>通过滑块调节参数，观察系统状态变化</desc>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <!-- SVG 内容，用 id 标记需要动态修改的元素 -->
  <rect id="level-bar" x="100" y="100" width="200" height="40" rx="8"/>
  <text class="th" x="340" y="125" text-anchor="middle" dominant-baseline="central" id="level-label">50%</text>
</svg>

<div class="ctrl">
  <span>参数名称</span>
  <input type="range" min="0" max="100" value="50" oninput="updateViz(this.value)">
  <span class="ctrl-val" id="ctrl-display">50</span>
</div>

<script>
function updateViz(v) {
  document.getElementById('ctrl-display').textContent = v;
  document.getElementById('level-label').textContent = v + '%';
  document.getElementById('level-bar').setAttribute('width', v * 2);
  // 根据 v 值更新其他 SVG 元素
}
</script>
```

---

## 模板 C：节点点击高亮

适用：架构图中点击节点查看详情。

```html
<div id="detail-box" style="margin-top:12px; padding:12px 16px;
  border:1px solid var(--color-border-tertiary);
  border-radius:var(--border-radius-lg);
  font-size:13px; color:var(--color-text-secondary);
  min-height:40px;">
  点击上方节点查看详情
</div>

<svg width="100%" viewBox="0 0 680 200" role="img">
  <title>可点击架构图</title>
  <desc>点击各节点查看组件详情</desc>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <g class="node c-teal" onclick="showDetail('用户服务', '处理注册、登录、Token 验证。依赖 Redis 做 session 存储。')">
    <rect x="80" y="60" width="160" height="56" rx="8" stroke-width="0.5"/>
    <text class="th" x="160" y="82" text-anchor="middle" dominant-baseline="central">用户服务</text>
    <text class="ts" x="160" y="100" text-anchor="middle" dominant-baseline="central">点击查看详情</text>
  </g>

  <g class="node c-coral" onclick="showDetail('订单服务', '处理下单、支付、退款。通过 MQ 与用户服务解耦。')">
    <rect x="440" y="60" width="160" height="56" rx="8" stroke-width="0.5"/>
    <text class="th" x="520" y="82" text-anchor="middle" dominant-baseline="central">订单服务</text>
    <text class="ts" x="520" y="100" text-anchor="middle" dominant-baseline="central">点击查看详情</text>
  </g>

  <line x1="240" y1="88" x2="438" y2="88" stroke="#888780" stroke-width="1.5" marker-end="url(#arrow)"/>
</svg>

<script>
function showDetail(name, desc) {
  document.getElementById('detail-box').innerHTML =
    `<strong style="color:var(--color-text-primary)">${name}</strong><br>${desc}`;
}
</script>
```

---

## 动画规范

```css
/* 只允许动 transform 和 opacity */
@keyframes flow {
  to { stroke-dashoffset: -20; }
}

/* 必须套 prefers-reduced-motion */
@media (prefers-reduced-motion: no-preference) {
  .flowing-line {
    stroke-dasharray: 5 5;
    animation: flow 1.6s linear infinite;
  }
}
```

动画用途：流动线条表示数据流向、淡入淡出表示状态切换。
禁止：纯装饰性动画、物理引擎、复杂的 JS 动画库。