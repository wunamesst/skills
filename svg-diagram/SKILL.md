---
name: svg-diagram
description: >
  手写 SVG 绘制生产级技术图表。当用户要求画图、绘制流程、展示数据流转、画时序图、
  画架构图、解释概念、绘制任何可视化图表时必须使用本 skill。
  Production-grade hand-written SVG diagrams. Use when users request diagrams, flowcharts,
  architecture diagrams, sequence diagrams, data flow, concept visualization, ERDs.
  Supports: sequence, flowchart, structure, ERD, interactive, illustrative, state machine, timeline.
  Dark mode support, semantic colors, better than Mermaid.
  Triggers: 画图 绘图 时序图 流程图 架构图 数据流 示意图 可视化 ER图 状态机 时间线 生命周期 里程碑
  diagram flowchart sequence architecture visualize ERD state-machine timeline lifecycle milestone.
---

# SVG Diagram Skill — Production-Grade Handbook

Read this entire file before drawing any diagram. Then consult `references/` for complete examples.

---

## Step 1: Diagram Type Decision

**Determine the diagram type first, then choose the technical approach.**

| User Intent | Type | Approach |
|-------------|------|----------|
| Message interaction, call chains, sequence | Sequence diagram | Hand-written SVG |
| Step flows, decision branches | Flowchart | Hand-written SVG |
| Component containment, system architecture | Structure diagram | Hand-written SVG |
| Abstract concepts, mechanism explanation | Illustrative diagram | HTML + inline SVG (interactive) |
| Database table structures, ER diagrams | ERD | mermaid.js (see references/erd.md) |
| State transitions, lifecycle | State machine diagram | Hand-written SVG (see references/state-machine.md) |
| Chronological events, milestones | Timeline diagram | Hand-written SVG (see references/timeline.md) |
| Controls needed | Interactive diagram | HTML widget (see references/interactive.md) |

**Mandatory split rules (exceed these limits → split into multiple diagrams):**
- Sequence participants > 6 → split into "overview + sub-flow"
- Horizontal flow nodes > 5 → switch to vertical or split
- Structure nesting > 3 levels → split into "system-level + component-level"
- Flows with loops → never draw circular, use HTML stepper (see references/interactive.md)

---

## Step 2: Canvas & Coordinate System

```
viewBox="0 0 680 {H}"    ← 680 is a hard constant, never change it
width="100%"
role="img"               ← required for accessibility
```

**How to calculate H (execute in order):**
1. Complete coordinate calculations for all elements first
2. Find max_y = largest (y + height) across all elements
3. H = max_y + 40
4. Never estimate, never "start with 600 and adjust"

Safe zone: x ∈ [40, 640], y ∈ [40, H-40]

**SVG root element template:**
```
<svg width="100%" viewBox="0 0 680 {H}" role="img"
  xmlns="http://www.w3.org/2000/svg">
  <title>Diagram title</title>
  <desc>One-line description for screen readers</desc>
  <defs>
    <style>
      <!-- Copy from here; keep only c-* classes used, delete unused -->
      svg{font-family:"JetBrains Mono","Anthropic Sans",-apple-system,system-ui,"Segoe UI",sans-serif}
      :root{--b:rgba(31,30,29,.3);--bg2:#F5F4ED;--s:#3D3D3A}
      .t{font-size:16px;font-weight:400;fill:var(--s)}
      .ts{font-size:12px;font-weight:400;fill:var(--s)}
      .th{font-size:14px;font-weight:500}
      /* ---- 8 color classes; pick only the ones used (max 3) ---- */
      .c-teal>rect,.c-teal>polygon,.c-teal>circle,.c-teal>ellipse{fill:#E1F5EE;stroke:#0F6E56}
      .c-teal>.th{fill:#085041}.c-teal>.ts{fill:#0F6E56}
      .c-blue>rect,.c-blue>polygon,.c-blue>circle,.c-blue>ellipse{fill:#E6F1FB;stroke:#185FA5}
      .c-blue>.th{fill:#0C447C}.c-blue>.ts{fill:#185FA5}
      .c-purple>rect,.c-purple>polygon,.c-purple>circle,.c-purple>ellipse{fill:#EEEDFE;stroke:#534AB7}
      .c-purple>.th{fill:#3C3489}.c-purple>.ts{fill:#534AB7}
      .c-amber>rect,.c-amber>polygon,.c-amber>circle,.c-amber>ellipse{fill:#FAEEDA;stroke:#854F0B}
      .c-amber>.th{fill:#633806}.c-amber>.ts{fill:#854F0B}
      .c-coral>rect,.c-coral>polygon,.c-coral>circle,.c-coral>ellipse{fill:#FAECE7;stroke:#993C1D}
      .c-coral>.th{fill:#712B13}.c-coral>.ts{fill:#993C1D}
      .c-gray>rect,.c-gray>polygon,.c-gray>circle,.c-gray>ellipse{fill:#F1EFE8;stroke:#5F5E5A}
      .c-gray>.th{fill:#444441}.c-gray>.ts{fill:#5F5E5A}
      .c-green>rect,.c-green>polygon,.c-green>circle,.c-green>ellipse{fill:#EAF3DE;stroke:#3B6D11}
      .c-green>.th{fill:#27500A}.c-green>.ts{fill:#3B6D11}
      .c-red>rect,.c-red>polygon,.c-red>circle,.c-red>ellipse{fill:#FCEBEB;stroke:#A32D2D}
      .c-red>.th{fill:#791F1F}.c-red>.ts{fill:#A32D2D}
      @media(prefers-color-scheme:dark){
        :root{--b:rgba(224,225,226,.3);--bg2:#2A2A28;--s:#B0B0AD}
        .c-teal>rect,.c-teal>polygon,.c-teal>circle,.c-teal>ellipse{fill:#0B2E24;stroke:#2DB88A}
        .c-teal>.th{fill:#5DC9A3}.c-teal>.ts{fill:#2DB88A}
        .c-blue>rect,.c-blue>polygon,.c-blue>circle,.c-blue>ellipse{fill:#0D2640;stroke:#3A8CD0}
        .c-blue>.th{fill:#7AB8E8}.c-blue>.ts{fill:#3A8CD0}
        .c-purple>rect,.c-purple>polygon,.c-purple>circle,.c-purple>ellipse{fill:#1E1C3D;stroke:#7A70D0}
        .c-purple>.th{fill:#ADA5F0}.c-purple>.ts{fill:#7A70D0}
        .c-amber>rect,.c-amber>polygon,.c-amber>circle,.c-amber>ellipse{fill:#33230A;stroke:#C49020}
        .c-amber>.th{fill:#E0B850}.c-amber>.ts{fill:#C49020}
        .c-coral>rect,.c-coral>polygon,.c-coral>circle,.c-coral>ellipse{fill:#331510;stroke:#C05838}
        .c-coral>.th{fill:#E08868}.c-coral>.ts{fill:#C05838}
        .c-gray>rect,.c-gray>polygon,.c-gray>circle,.c-gray>ellipse{fill:#252523;stroke:#8E8D88}
        .c-gray>.th{fill:#B0B0AD}.c-gray>.ts{fill:#8E8D88}
        .c-green>rect,.c-green>polygon,.c-green>circle,.c-green>ellipse{fill:#152D08;stroke:#5A9E20}
        .c-green>.th{fill:#80C040}.c-green>.ts{fill:#5A9E20}
        .c-red>rect,.c-red>polygon,.c-red>circle,.c-red>ellipse{fill:#331212;stroke:#C04040}
        .c-red>.th{fill:#E07070}.c-red>.ts{fill:#C04040}
      }
      <!-- End copy -->
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <!-- Content -->
</svg>
```

**Critical:** Both `xmlns` and `<style>` are mandatory. Keep only the `c-*` classes used in the diagram (max 3), but the corresponding dark-mode `@media` overrides for those classes must also be kept. Delete unused classes entirely — no commented-out dead code.

`context-stroke` makes arrowheads auto-inherit line color. Never use any other method to define arrowhead color.

---

## Step 3: Color System

### Color Class Reference

| class | Semantic role | 50 Fill | 600 Stroke | 800 Title | 600 Subtitle |
|-------|-------------|--------|---------|---------|----------|
| `c-teal` | Person / user / actor | #E1F5EE | #0F6E56 | #085041 | #0F6E56 |
| `c-blue` | Data / information / storage | #E6F1FB | #185FA5 | #0C447C | #185FA5 |
| `c-purple` | Processing / operation / logic | #EEEDFE | #534AB7 | #3C3489 | #534AB7 |
| `c-amber` | External system / third-party | #FAEEDA | #854F0B | #633806 | #854F0B |
| `c-coral` | Async / queue / task | #FAECE7 | #993C1D | #712B13 | #993C1D |
| `c-gray` | Neutral / structure / start-end | #F1EFE8 | #5F5E5A | #444441 | #5F5E5A |
| `c-green` | Success / completion / positive | #EAF3DE | #3B6D11 | #27500A | #3B6D11 |
| `c-red` | Error / failure / warning | #FCEBEB | #A32D2D | #791F1F | #A32D2D |

### Color Usage Rules

**Must follow:**
- Same-type nodes use the same color (group by semantic role, not by sequence)
- Title text uses 800 shade, subtitle text uses 600 shade — never identical (loses hierarchy)
- `c-*` only on `<g>`, `<rect>`, `<polygon>`, `<circle>`, or `<ellipse>` — **never on `<path>`**
- `c-*` uses direct-child selectors; nesting `<g>` tags breaks styling — avoid deep nesting

**Dark mode rules (what separates production from toy):**
- All text colors must use CSS variables or `c-*` class auto-inversion
- Never hardcode hex on text (invisible in dark mode)
- Line colors may use hardcoded hex (mid-tone values readable in both modes, e.g. `#1D9E75`)
- Only exception: physical-scene diagrams (fire, sky, real-world colors) may hardcode everything, but must provide `@media (prefers-color-scheme: dark)` variants
- **Mixing trap**: hardcoded background + `c-*` foreground = only half-inverts in dark mode. Never mix.

---

## Step 4: Precise Character Widths

**Measured widths at 14px Anthropic Sans (used for calculating rect minimum width):**

| Text type | Width per char | Example |
|-----------|---------------|---------|
| English uppercase A-Z | ~10px | `AUTH` (4 chars) ≈ 40px |
| English lowercase a-z | ~7px | `token` (5 chars) ≈ 35px |
| Mixed case English | ~8px/char | `Auth Service` (12 chars) ≈ 96px |
| Digits 0-9 | ~8px | `200 OK` (6 chars) ≈ 48px |
| Chinese characters | ~15px/char | `数据流转` (4 chars) ≈ 60px |
| Mixed CJK + English | estimate per segment | `POST /login` ≈ 88px |
| Special chars `_/:` | ~6px | `user_id` ≈ 88px |

**Rect minimum width formula:**
```
rect_min_width = max(title_width, subtitle_width) + 48
                                               ↑ 24px padding on each side
```

**12px subtitle text width = 14px estimate × 0.86**

**Verification steps (do before every rect):**
1. Find the longest text string in that rect
2. Estimate rendered width by type
3. Add 48px for minimum width
4. If planned rect width < minimum width, widen the rect or shorten the text

---

## Step 5: Per-Type Specifications

### Sequence Diagram

**X-coordinate allocation (by participant count):**

| Count | Center X positions |
|-------|-------------------|
| 2 | 160, 520 |
| 3 | 120, 340, 560 |
| 4 | 90, 270, 450, 610 (box width 90) |
| 5 | 65, 195, 330, 465, 600 (box width 80) |
| 6 | 50, 160, 282, 390, 505, 621 (box width 90) |

Participant box height fixed at 40px, rx=6.

**Lifeline:**
```xml
<line x1="{cx}" y1="60" x2="{cx}" y2="{H-60}"
  stroke="var(--b)" stroke-width="0.5" stroke-dasharray="4 3"/>
```

**Message arrows (solid = active call, dashed = return/async):**
```xml
<!-- Active call -->
<line x1="{from_cx}" y1="{y}" x2="{to_cx}" y2="{y}"
  stroke="{color}" stroke-width="1.5" marker-end="url(#arrow)"/>

<!-- Return / response -->
<line x1="{from_cx}" y1="{y}" x2="{to_cx}" y2="{y}"
  stroke="#888780" stroke-width="1" stroke-dasharray="5 3"
  marker-end="url(#arrow)"/>
```

Message label placed 8px above the arrow: `y="{arrow_y - 8}"`

**Phase group background:**
```xml
<rect x="28" y="{group_y}" width="630" height="{group_h}"
  rx="4" fill="var(--bg2)" opacity="0.5"/>
<text class="ts" x="36" y="{group_y + 16}" fill="var(--s)">① Phase name</text>
```

**Spacing rules:**
- Participant head bottom to first message: ≥ 20px
- Group title to first message arrow in group: ≥ 28px (avoid crowding)
- Adjacent message arrows: ≥ 32px
- Between groups, extra: 20px
- Group bottom margin: ≥ 20px (last arrow to group bottom)
- Last message to bottom participant: ≥ 28px

**Group height quick formula:**
```
group_h = (n_msgs + 1) × 32 + 16
  n_msgs = messages in group
  Example: 6 messages → group_h = 7×32+16 = 240
```

**Y-coordinate lookup table (common sequence scenarios—reuse directly, no manual calculation):**

All Y values pre-computed per spacing rules. Just fill in arrow X coordinates and message labels.

Single-group scenarios (1 group, N messages):
| N | group_y | Message arrow Ys | group_h | H (with bottom participants, top=group_y) |
|---|---------|-------------|---------|------|
| 2 | 76 | 120, 152 | 96 | 340 |
| 3 | 76 | 120, 152, 184 | 128 | 380 |
| 4 | 76 | 120, 152, 184, 216 | 160 | 420 |
| 5 | 76 | 120, 152, 184, 216, 248 | 192 | 460 |

Two-group scenarios (2 groups, N₁+N₂ messages):
| N₁+N₂ | group₁ y/h | group₂ y/h | Message arrow Ys | H |
|-------|------------|------------|-------------|----|
| 2+3 | 76 / 96 | 192 / 128 | ① 120,152 → ② 236,268,300 | 460 |
| 3+4 | 76 / 128 | 224 / 160 | ① 120,152,184 → ② 268,300,332,364 | 520 |
| 4+4 | 76 / 160 | 256 / 160 | ① 120,152,184,216 → ② 300,332,364,396 | 560 |
| 3+6 | 76 / 128 | 224 / 224 | ① 120,152,184 → ② 268,300,332,364,396,428 | 580 |

Bottom participant y = last group_y + group_h + 28
H = bottom participant y + 40 + 40 (round up to nearest 10)

For scenarios beyond two groups or outside the table, derive using the algorithm formula.

### Flowchart

**Standard node sizes:**
- Single-line node: height 44px
- Two-line node (title + subtitle): height 56px
- Decision diamond: use `<polygon>`, width ~120px, height ~60px

**Two-line node text positioning:**
```xml
<text class="th" x="{cx}" y="{rect_y + 19}"
  text-anchor="middle" dominant-baseline="central">Title</text>
<text class="ts" x="{cx}" y="{rect_y + 38}"
  text-anchor="middle" dominant-baseline="central">Subtitle</text>
```

**Horizontal layout width calculation (must compute upfront):**
```
n nodes, gap = 20:
total = n × node_w + (n-1) × gap
Must satisfy total ≤ 600
node_w = (600 - (n-1) × 20) / n

n=3 → node_w = (600-40)/3 = 186
n=4 → node_w = (600-60)/4 = 135
n=5 → node_w = (600-80)/5 = 104 (too cramped, consider vertical)
```

Start x = (680 - total) / 2, to center horizontally.

**Vertical arrow endpoints (leave 10px gap):**
```
Upper node exit: y1 = rect_y + rect_h + 10
Lower node entry: y2 = rect_y - 10 (with marker, aligns flush to edge)
```

**Backward / return edge (L-shaped, never straight through other nodes):**
```xml
<path d="M {x1} {y1} L {x_detour} {y1} L {x_detour} {y2} L {x2} {y2}"
  fill="none" stroke="#E24B4A" stroke-width="1"
  stroke-dasharray="5 3" marker-end="url(#arrow)"/>
```

**Decision diamond branching layout (critical — prevents node overlap):**

Diamond template:
```xml
<g class="c-amber">
  <polygon points="{cx},{top_y} {right_x},{cy} {cx},{bot_y} {left_x},{cy}" stroke-width="0.5"/>
  <text class="th" x="{cx}" y="{cy}" text-anchor="middle" dominant-baseline="central">Label</text>
</g>
```
Diamond dimensions: width = right_x − left_x (recommended 130–160px), height = bot_y − top_y (recommended 50–60px).

**Exit points** are the left and right corners of the diamond:
```
left_exit  = (left_x, cy)   // i.e. (cx - diamond_w/2, cy)
right_exit = (right_x, cy)  // i.e. (cx + diamond_w/2, cy)
```

**Downstream box positioning — center-align to exit points, NOT to diamond center:**
```
box_left_center_x  = left_exit.x
box_right_center_x = right_exit.x

box_left_x  = box_left_center_x  − box_w / 2
box_right_x = box_right_center_x − box_w / 2
```

**Non-overlap constraint** (must verify before drawing):
```
box_right_x ≥ box_left_x + box_w + 20
             ↑ minimum 20px gap between edges
If violated: reduce box_w, increase diamond_w, or stagger vertically.
```

**Arrow routing** (straight diagonal from exit corner to box top-center):
```xml
<line x1="{left_exit.x}" y1="{left_exit.y}" x2="{box_left_center_x}" y2="{box_top_y}"
  stroke="{color}" stroke-width="1.5" marker-end="url(#arrow)"/>
```

**Common mistake:** positioning downstream boxes relative to the diamond center instead of its exit corners. This causes the boxes to cluster under the center and overlap, while arrows from the exit corners point to the wrong targets.

**Error path collection (critical — when multiple diamonds share the same error endpoint):**

When a flowchart has multiple decision diamonds whose error/failure branches lead to the same outcome (e.g. multiple validation checks → all return 401), use this pattern:

1. **Error endpoint at the bottom**, not near the first diamond. Place the error box and failure end node at the same vertical level as the success end node, on the right side.
2. **Vertical collector line** on the right side of the main flow. All error branches connect horizontally to this collector.
3. **Horizontal error lines** from each diamond's right exit point to the collector. No arrowheads on these lines (the collector provides the visual flow).

```xml
<!-- Error line from diamond (no arrowhead — joins collector) -->
<line x1="{right_exit.x}" y1="{right_exit.y}" x2="{collector_x}" y2="{right_exit.y}"
  stroke="#E24B4A" stroke-width="1" stroke-dasharray="5 3"/>

<!-- Vertical collector line -->
<line x1="{collector_x}" y1="{first_error_y}" x2="{collector_x}" y2="{last_error_y}"
  stroke="#E24B4A" stroke-width="1" stroke-dasharray="5 3"/>

<!-- Collector → Error box (with arrowhead) -->
<line x1="{collector_x}" y1="{last_error_y}" x2="{error_box_left_x}" y2="{last_error_y}"
  stroke="#E24B4A" stroke-width="1" stroke-dasharray="5 3" marker-end="url(#arrow)"/>
```

**Layout rules:**
- `collector_x` = rightmost diamond right_exit.x + 20px (clear of the diamond)
- Error box left edge = collector_x + 10px
- All diamonds in the flow must use the **same width** (visual consistency)
- Text inside diamonds must use `dominant-baseline="central"` for vertical centering

**Common mistake:** placing the error box next to the first diamond, then drawing error lines from later diamonds that point into empty space with no endpoint. Every line must connect to a valid target.

### Structure Diagram

**Nested levels must use different color classes:**
- Outer level: lighter color (e.g. `c-blue`)
- Inner level: contrasting color (e.g. `c-teal`, `c-amber`)
- Same-color nesting destroys hierarchy — this is a hard production rule

**Container padding:**
- Outer container padding: ≥ 24px
- Inner region spacing: ≥ 16px
- Label to container edge: ≥ 12px

**Outer container template:**
```xml
<g class="c-blue">
  <rect x="80" y="30" width="560" height="240" rx="20" stroke-width="0.5"/>
  <text class="th" x="360" y="58" text-anchor="middle" dominant-baseline="central">
    System Name
  </text>
</g>
```

### Illustrative Diagram (abstract concepts)

Use when explaining how something works, showing data structures, or presenting spatial relationships.

**Core principle:** Draw the mechanism itself, not a "diagram about the mechanism." Color represents intensity, not category (warm = active, cool = static).

**Static SVG vs. HTML Interactive decision:**
- Has sliders, toggles, click states → HTML (see references/interactive.md)
- Pure display, no interaction needed → static SVG

See `references/illustrative.md` for detailed specs and examples.

---

## Step 6: Complete Dark Mode Rules

This is the biggest difference between production-grade and toy output.

**Safe usage (auto-adapts to dark mode):**
```xml
<!-- c-* classes: auto-handle light & dark -->
<g class="c-blue">
  <rect .../>
  <text class="th">Label</text>  <!-- auto-correct color -->
</g>

<!-- CSS variables: auto-adapt -->
<line stroke="var(--b)" .../>
<rect fill="var(--bg2)" .../>
```

**Dangerous usage (breaks in dark mode):**
```xml
<!-- Forbidden: hardcoded hex on text -->
<text fill="#333333">Label</text>  <!-- invisible on dark background -->

<!-- Forbidden: c-* background + hardcoded text -->
<g class="c-blue">
  <rect .../>
  <text fill="#333">Label</text>  <!-- bg inverts, text doesn't -->
</g>
```

**Safe hex values for line colors (mid-tone, readable in both modes):**
```
#1D9E75  teal 400
#534AB7  purple 400 (for purple-semantic lines)
#185FA5  blue 600
#BA7517  amber 400
#993C1D  coral 600
#888780  gray 400 (general neutral lines)
#E24B4A  red 400 (error/fallback paths)
```

**Line color rule — match source node's semantic color:**
Connecting lines (arrows) must use the same color family as the **source node** (where the arrow starts), not the target. This creates a visual "information flows from" signal. Use the safe hex value corresponding to the source node's `c-*` class:
- Source is `c-teal` → line stroke `#1D9E75`
- Source is `c-purple` → line stroke `#534AB7`
- Source is `c-blue` → line stroke `#185FA5`
- Source is `c-amber` → line stroke `#BA7517`
- Source is `c-coral` → line stroke `#993C1D`
- Source is `c-gray` or neutral → line stroke `#888780`
- Error/fallback paths → line stroke `#E24B4A`

Exception: return/response lines always use `#888780` (gray) regardless of source color.

---

## Step 7: Line Crossing Prevention

Before drawing every line, perform these checks:

**Checklist:**
1. List all rect bounding boxes: `{x, y, x+w, y+h}`
2. Compare line path X, Y ranges against each box
3. If line X range overlaps a rect X range, AND Y range overlaps → crossing detected

**Mitigation options:**

```xml
<!-- Option A: L-shaped detour around right side -->
<path d="M {x1} {y1} L {x1} {y_bypass} L {x2} {y_bypass} L {x2} {y2}"
  fill="none" stroke="..." marker-end="url(#arrow)"/>

<!-- Option B: detour around left side -->
<path d="M {x1} {y1} L {x_left-20} {y1} L {x_left-20} {y2} L {x2} {y2}"
  fill="none" stroke="..." marker-end="url(#arrow)"/>

<!-- Option C: symbolic cross-reference (when routing is too complex) -->
<!-- Place matching letter markers at source and target -->
<text class="ts" x="{x}" y="{y}">→ A</text>
```

**Sequence diagram special rule:** Messages are strictly horizontal, never diagonal. If two participants aren't adjacent, the message is still horizontal, just spanning farther.

---

## Step 8: Post-Draw Checklist (7 items, covering the most common failures)

Check in order — don't skip:

- [ ] Root `<svg>` has `xmlns="http://www.w3.org/2000/svg"`; `<defs>` contains `<style>` block (including dark-mode `@media`)
- [ ] viewBox H = max(element y + height) + 40 — computed, not estimated
- [ ] All `<text>` has a class (`th`/`ts`/`t`); text inside nodes has `dominant-baseline="central"`
- [ ] All `<path>` lines have `fill="none"`
- [ ] Single `<svg>` element per diagram, with `role="img"` + `<title>` + `<desc>`
- [ ] **Node position overlap check**: for every pair of shape elements (rect, polygon, circle, ellipse), verify bounding boxes do not overlap. Compare `{x, x+w}` and `{y, y+h}` ranges — if both X and Y ranges overlap, the nodes collide and one must be repositioned. Pay special attention to decision diamonds: their bounding box is wider than it appears (`cx ± half_w`), and adjacent rects must start after `cx + half_w`.
- [ ] **Line connectivity check**: every `<line>` and `<path>` must connect to a valid target element (a rect, circle, or another line endpoint). No line should point into empty space. For error/fallback paths from decision diamonds, verify the error line reaches an error box or a collector line that leads to one.

Other rules (text not overflowing rects, line colors using safe hex, lines not crossing nodes) are naturally enforced during drawing and don't need a separate post-check.

---

## Reference File Index

| File | Content | When to Read |
|------|---------|-------------|
| `references/sequence.md` | Sequence diagram spec + Y-coordinate lookup tables + example | Drawing sequence diagrams |
| `references/flowchart.md` | Flowchart spec + node sizing + decision diamond layout + example | Drawing flowcharts |
| `references/structure.md` | Structure diagram spec + nesting rules + example | Drawing architecture/component diagrams |
| `references/state-machine.md` | State machine spec + initial/final state templates + example | Drawing state transitions, lifecycles |
| `references/timeline.md` | Timeline spec + event marker/card templates + example | Drawing chronological events, milestones |
| `references/erd.md` | mermaid.js ERD template + dark mode adaptation | Drawing ERDs |
| `references/interactive.md` | HTML interactive widget templates (slider, stepper, click) | When interactive controls needed |
| `references/illustrative.md` | Illustrative diagram spec (abstract concept spatial metaphor) | Explaining principles/mechanisms |
| `references/embedded-styles.md` | Complete CSS style reference (same as Step 2 template above) | Backup reference, no need to read each time |

## PNG Export

After saving the SVG, convert to @2x PNG for sharing on platforms that don't render SVG:

```bash
bash {skillDir}/scripts/svg2png.sh <svg-path> [scale]
```

- `scale`: 1, 2, 3 (default: 2)
- Uses macOS `qlmanage` (built-in) or `rsvg-convert` (better quality, `brew install librsvg`)
- Output: `<input>@2x.png` in the same directory

---

## Output Instructions

1. SVG must be self-contained: embed `<style>` (copy from Step 2 template, keep only used `c-*` classes) + `xmlns`
2. If `visualize:show_widget` is available, pass the full SVG code; otherwise write to `.svg` file and use `open` command to view in browser
3. HTML interactive diagrams: pass the complete HTML fragment (no DOCTYPE/html/body tags)
4. Add text context before and after the diagram to explain what it shows
