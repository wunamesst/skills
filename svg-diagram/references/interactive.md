# Interactive Diagrams & HTML Widgets

When the diagram needs any of the following, use HTML + inline SVG instead of static SVG:
- Controls: sliders, toggles, buttons
- Click nodes to trigger state changes
- Step-by-step presentation (stepper)
- Animation effects (flowing lines, fade in/out)
- Cyclic flows (must use stepper; never draw circular diagrams)

---

## Core Constraints

```
Forbidden: localStorage / sessionStorage (sandbox doesn't support them)
Forbidden: position: fixed (collapses iframe height)
Forbidden: display: none to hide content during streaming render
Scripts execute after streaming render completes — JS-driven stepper is fine
External libs only from: cdnjs.cloudflare.com / esm.sh / cdn.jsdelivr.net / unpkg.com
```

---

## Template A: Stepper (Step-by-Step / Cyclic Flows)

Use for: cyclic flows (event loops, Krebs cycle, GC cycles), step-by-step explanations.

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
    <button class="step-btn" onclick="prevStep()">← Prev</button>
    <div class="step-dots" id="dots"></div>
    <button class="step-btn" onclick="nextStep()">Next →</button>
    <span id="step-counter" style="font-size:12px;color:var(--color-text-tertiary)"></span>
  </div>
  <div class="step-panel" id="panel"></div>
</div>

<script>
const steps = [
  {
    title: "Step 1 Title",
    desc: "Step 1 detailed description, can be lengthy.",
    svg: `<svg width="100%" viewBox="0 0 680 200" role="img">
      <title>Step 1</title><desc>Step 1 illustration</desc>
      <defs><marker id="a1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5"/></marker></defs>
      <!-- Step 1 SVG content -->
    </svg>`
  },
  {
    title: "Step 2 Title",
    desc: "Step 2 description.",
    svg: `<svg width="100%" viewBox="0 0 680 200" role="img">
      <title>Step 2</title><desc>Step 2 illustration</desc>
      <defs><marker id="a2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5"/></marker></defs>
      <!-- Step 2 SVG content -->
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

**Note:** Each step's SVG embeds its own `<marker>` with a unique id (a1, a2...), otherwise later steps' arrows may reference an already-unmounted marker from a previous step.

---

## Template B: Slider Control (Continuous Parameter Adjustment)

Use for: showing how parameter changes affect system state (temperature, load, latency, etc.).

```html
<style>
.ctrl { display:flex; align-items:center; gap:12px; margin:12px 0;
  font-size:13px; color:var(--color-text-secondary); }
.ctrl input[type=range] { flex:1; }
.ctrl-val { min-width:40px; text-align:right; color:var(--color-text-primary); font-weight:500; }
</style>

<svg id="main-svg" width="100%" viewBox="0 0 680 300" role="img">
  <title>Adjustable illustration</title>
  <desc>Adjust parameter via slider to observe system state changes</desc>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <!-- SVG content, mark dynamic elements with id -->
  <rect id="level-bar" x="100" y="100" width="200" height="40" rx="8"/>
  <text class="th" x="340" y="125" text-anchor="middle" dominant-baseline="central" id="level-label">50%</text>
</svg>

<div class="ctrl">
  <span>Parameter name</span>
  <input type="range" min="0" max="100" value="50" oninput="updateViz(this.value)">
  <span class="ctrl-val" id="ctrl-display">50</span>
</div>

<script>
function updateViz(v) {
  document.getElementById('ctrl-display').textContent = v;
  document.getElementById('level-label').textContent = v + '%';
  document.getElementById('level-bar').setAttribute('width', v * 2);
  // Update other SVG elements based on v value
}
</script>
```

---

## Template C: Clickable Node Highlight

Use for: clicking nodes in architecture diagrams to view details.

```html
<div id="detail-box" style="margin-top:12px; padding:12px 16px;
  border:1px solid var(--color-border-tertiary);
  border-radius:var(--border-radius-lg);
  font-size:13px; color:var(--color-text-secondary);
  min-height:40px;">
  Click a node above to view details
</div>

<svg width="100%" viewBox="0 0 680 200" role="img">
  <title>Clickable Architecture Diagram</title>
  <desc>Click nodes to view component details</desc>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <g class="node c-teal" onclick="showDetail('User Service', 'Handles registration, login, token verification. Depends on Redis for session storage.')">
    <rect x="80" y="60" width="160" height="56" rx="8" stroke-width="0.5"/>
    <text class="th" x="160" y="82" text-anchor="middle" dominant-baseline="central">User Service</text>
    <text class="ts" x="160" y="100" text-anchor="middle" dominant-baseline="central">Click for details</text>
  </g>

  <g class="node c-coral" onclick="showDetail('Order Service', 'Handles ordering, payment, refunds. Decoupled from User Service via MQ.')">
    <rect x="440" y="60" width="160" height="56" rx="8" stroke-width="0.5"/>
    <text class="th" x="520" y="82" text-anchor="middle" dominant-baseline="central">Order Service</text>
    <text class="ts" x="520" y="100" text-anchor="middle" dominant-baseline="central">Click for details</text>
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

## Animation Guidelines

```css
/* Only animate transform and opacity */
@keyframes flow {
  to { stroke-dashoffset: -20; }
}

/* Must wrap in prefers-reduced-motion */
@media (prefers-reduced-motion: no-preference) {
  .flowing-line {
    stroke-dasharray: 5 5;
    animation: flow 1.6s linear infinite;
  }
}
```

Animation purposes: flowing lines for data direction, fade in/out for state transitions.
Forbidden: purely decorative animations, physics engines, complex JS animation libraries.