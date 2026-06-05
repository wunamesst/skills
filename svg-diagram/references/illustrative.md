# Illustrative Diagrams (Abstract Concepts / Mechanism Explanation)

Use for: explaining how something works, showing abstract mechanisms, helping users "understand" rather than "look up."
Not for: reference documentation, architecture diagrams needing precise annotations.

---

## Core Difference from Regular Flowcharts

| Regular Flowchart | Illustrative Diagram |
|-------------------|---------------------|
| Color distinguishes categories | Color distinguishes intensity (warm=active, cool=static) |
| Primarily rectangles | Shape follows content |
| Labels explain everything | Spatial position itself conveys meaning |
| Static document | Prioritize interactive version |

**Litmus test:** Cover all labels — does the diagram still convey the core idea? Yes → good illustrative diagram. No → degraded into a flowchart.

---

## Physical-Theme Illustrative Diagrams

Use for: water cycle, CPU cooling, circuits, chemical reactions, and other topics with real physical forms.

**Rules:**
- Use `<path>`, `<ellipse>`, `<polygon>` to draw simplified physical shapes
- Color maps to physical properties: warm colors (amber/coral/red) = heat/energy, cool colors (blue/teal) = cold/stable
- Allowed unique exception for `<linearGradient>`: represents continuous physical properties (temperature stratification, pressure gradient)
  - Only two color stops, no multi-stop gradients
  - Only for genuinely continuous physical quantities, never for decoration

**All colors hardcoded (physical scenes don't follow theme):**
```xml
<!-- Physical scene: hardcode all hex values, don't use c-* classes -->
<rect x="100" y="50" width="200" height="300" fill="#3B8BD4"/>  <!-- cold water -->
<rect x="100" y="50" width="200" height="150" fill="#E8593C"/>  <!-- hot water -->

<!-- Must provide dark mode variant -->
<style>
@media (prefers-color-scheme: dark) {
  .water-cold { fill: #1a5a8a; }
  .water-hot  { fill: #b03020; }
}
</style>
```

---

## Abstract-Theme Illustrative Diagrams

Use for: attention mechanisms, hash tables, call stacks, gradient descent, and other abstract CS concepts.

**Core technique:** Invent a spatial metaphor that makes the mechanism visible.

Common metaphor patterns:

| Concept | Metaphor |
|---------|----------|
| Attention weights | Lines from query token, thickness = weight |
| Hash function | Funnel, multiple keys falling into different buckets |
| Call stack | Literal stack, frames growing upward |
| Gradient descent | Surface + rolling ball + trajectory |
| Transformer layers | Horizontal slats, token lines passing through |
| Cache hit rate | Two-color progress bar |

**Color represents intensity, not category:**
```xml
<!-- Attention weights: line thickness and color depth both represent weight -->
<line x1="340" y1="230" x2="116" y2="146" stroke="#EF9F27"
  stroke-width="1" opacity="0.25"/>   <!-- low weight -->
<line x1="340" y1="230" x2="340" y2="146" stroke="#EF9F27"
  stroke-width="4" opacity="1.0"/>    <!-- high weight -->
```

---

## Deciding When to Build Interactive Versions

Ask yourself: **Does this concept have a "knob"?**

- Heating water → temperature knob → make it interactive
- Attention mechanism → click a token to switch query → make it interactive
- Gradient descent → learning rate slider → make it interactive
- Hash table → input different keys to see bucket placement → make it interactive
- Static architecture relationships → no knob → static SVG is fine

Use the HTML templates in `references/interactive.md` for interactive versions.

---

## Label Placement Rules

```
Priority: right margin > bottom > left > top > inside (large regions only)

Right-side labels (recommended):
  x = shape right edge + 20~30px (text-anchor="start")
  Use leader line (0.5px dashed) pointing to corresponding part

Left-side labels (secondary):
  Must verify label_chars × 8 < anchor_x, to avoid exceeding x=0
  Safer to shift start point right with text-anchor="start"

Inside labels (large regions only):
  Region width > 200px, height > 60px before placing inside labels
  Label to region edge ≥ 20px
```

Leader line template:
```xml
<line class="leader" x1="{point_x}" y1="{point_y}"
  x2="{label_x-4}" y2="{label_y}"/>
<circle cx="{point_x}" cy="{point_y}" r="2" fill="var(--t)"/>
<text class="ts" x="{label_x}" y="{label_y}"
  text-anchor="start">{Label text}</text>
```

---

## Illustrative Diagram Example: Attention Weight Visualization

```xml
<svg width="100%" viewBox="0 0 680 320" role="img"
  xmlns="http://www.w3.org/2000/svg">
  <title>Transformer Attention Weight Illustration</title>
  <desc>Attention weights from token "sat" to all other tokens; thicker lines = higher weight</desc>
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

  <!-- Transformer layers (horizontal slats) -->
  <g class="c-purple">
    <rect x="60" y="40"  width="560" height="24" rx="4" stroke-width="0.5"/>
    <text class="ts" x="72" y="52" dominant-baseline="central">Layer 3</text>
  </g>
  <g class="c-purple">
    <rect x="60" y="76"  width="560" height="24" rx="4" stroke-width="0.5"/>
    <text class="ts" x="72" y="88" dominant-baseline="central">Layer 2</text>
  </g>
  <g class="c-purple">
    <rect x="60" y="112" width="560" height="24" rx="4" stroke-width="0.5"/>
    <text class="ts" x="72" y="124" dominant-baseline="central">Layer 1</text>
  </g>

  <!-- Attention lines (thickness + opacity = weight) -->
  <line x1="340" y1="210" x2="116" y2="136" stroke="#EF9F27" stroke-width="1"   opacity="0.25" stroke-linecap="round"/>
  <line x1="340" y1="210" x2="228" y2="136" stroke="#EF9F27" stroke-width="1.5" opacity="0.40" stroke-linecap="round"/>
  <line x1="340" y1="210" x2="340" y2="136" stroke="#EF9F27" stroke-width="4"   opacity="1.0"  stroke-linecap="round"/>
  <line x1="340" y1="210" x2="452" y2="136" stroke="#EF9F27" stroke-width="2.5" opacity="0.70" stroke-linecap="round"/>
  <line x1="340" y1="210" x2="564" y2="136" stroke="#EF9F27" stroke-width="1"   opacity="0.20" stroke-linecap="round"/>

  <!-- Token row -->
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

  <!-- Annotation (in clear area, not overlapping lines) -->
  <text class="ts" x="340" y="280" text-anchor="middle">
    Line thickness = attention weight from "sat" to each token
  </text>
</svg>
```