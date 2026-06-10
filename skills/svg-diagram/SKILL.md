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

Read this entire file before drawing any diagram. Then consult `references/` for detailed specs and complete examples.

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

**SVG root element skeleton:**
```xml
<svg width="100%" viewBox="0 0 680 {H}" role="img"
  xmlns="http://www.w3.org/2000/svg">
  <title>Diagram title</title>
  <desc>One-line description for screen readers</desc>
  <defs>
    <style>
      <!-- Copy full style block from references/embedded-styles.md -->
      <!-- Keep only the c-* classes actually used in this diagram -->
      <!-- Keep corresponding dark-mode @media overrides for used c-* classes -->
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

**Critical:** Both `xmlns` and `<style>` are mandatory. The style block must include CSS variables (`--b`, `--bg2`, `--s`), text classes (`.t`/`.ts`/`.th`), and only the `c-*` color classes used in the diagram with their dark-mode overrides. Copy the complete template from `references/embedded-styles.md`.

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

Each type below lists the core rules. For detailed coordinate tables, complete specs, and full examples, read the corresponding reference file before drawing.

### Sequence Diagram

**Read `references/sequence.md` before drawing any sequence diagram.**

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

**Spacing rules and group height:**
- Adjacent arrows: ≥ 32px; between groups: +20px extra
- `group_h = (n_msgs + 1) × 32 + 16`
- For pre-computed Y-coordinate lookup tables (single-group and two-group scenarios), see `references/sequence.md`

### Flowchart

**Read `references/flowchart.md` before drawing any flowchart.**

**Layout direction — decide before drawing:**
- **Horizontal** (compact): ≤ 4 nodes, linear flow (no branches), short labels (title only, no subtitle). Produces a short, wide diagram — ideal for simple sequential flows.
- **Vertical** (spacious): > 4 nodes, has decision branches, needs subtitles, or complex routing. Produces a tall diagram — necessary for branching logic.

**Standard node sizes:**
- Single-line node: height 44px
- Two-line node (title + subtitle): height 56px
- Decision diamond: `<polygon>`, width ~120px, height ~60px

**Two-line node text positioning:**
```xml
<text class="th" x="{cx}" y="{rect_y + 19}"
  text-anchor="middle" dominant-baseline="central">Title</text>
<text class="ts" x="{cx}" y="{rect_y + 38}"
  text-anchor="middle" dominant-baseline="central">Subtitle</text>
```

**Horizontal layout width calculation:**
```
gap = 40 (minimum — 10px exit + 20px visible shaft + 10px entry)
total = sum(node_w) + (n-1) × gap, must satisfy total ≤ 600
node_w = max(title_width + 48, 90)  per node — variable width
start_x = (680 - total) / 2
```

**Vertical arrow endpoints (leave 10px gap):**
```
Upper node exit: y1 = rect_y + rect_h + 10
Lower node entry: y2 = rect_y - 10
```

**Backward / return edge (L-shaped):**
```xml
<path d="M {x1} {y1} L {x_detour} {y1} L {x_detour} {y2} L {x2} {y2}"
  fill="none" stroke="#E24B4A" stroke-width="1"
  stroke-dasharray="5 3" marker-end="url(#arrow)"/>
```

**Decision diamonds:** Exit points are the left/right corners. Downstream boxes center-align to exit corners, NOT to diamond center. Non-overlap constraint: `box_right_x ≥ box_left_x + box_w + 20`. For full branching layout, arrow routing templates, and common mistakes, see `references/flowchart.md`.

**Error path collection:** When multiple diamonds share the same error endpoint, use a vertical collector line on the right side. All error branches connect horizontally to it (no arrowheads), collector feeds into error box. For complete XML templates and layout rules, see `references/flowchart.md`.

### Structure Diagram

**Nested levels must use different color classes:**
- Outer level: lighter color (e.g. `c-blue`)
- Inner level: contrasting color (e.g. `c-teal`, `c-amber`)
- Same-color nesting destroys hierarchy — hard production rule

**Container padding:** Outer ≥ 24px, inner spacing ≥ 16px, label to edge ≥ 12px.

See `references/structure.md` for nesting rules and complete example.

### Illustrative Diagram (abstract concepts)

Use when explaining how something works, showing data structures, or presenting spatial relationships.

**Core principle:** Draw the mechanism itself, not a "diagram about the mechanism." Color represents intensity, not category (warm = active, cool = static).

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
- Source is `c-green` → line stroke `#3B6D11`
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
| `references/embedded-styles.md` | Complete CSS style block for SVG `<defs>` | Required for every diagram |

## PNG Export

After saving the SVG, convert to @2x PNG for sharing on platforms that don't render SVG:

```bash
node {skillDir}/scripts/svg2png.mjs <svg-path> [options]
```

Options:
- `-s, --scale <n>` — Scale factor (default: 2)
- `-o, --output <path>` — Custom output path

Prerequisites: run `cd {skillDir}/scripts && npm install` once to install sharp.

---

## Output Instructions

1. SVG must be self-contained: embed `<style>` (copy from `references/embedded-styles.md`, keep only used `c-*` classes) + `xmlns`
2. If `visualize:show_widget` is available, pass the full SVG code; otherwise write to `.svg` file and use `open` command to view in browser
3. HTML interactive diagrams: pass the complete HTML fragment (no DOCTYPE/html/body tags)
4. Add text context before and after the diagram to explain what it shows
