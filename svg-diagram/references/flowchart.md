# Flowchart Specification

## Node Sizes

- Single-line node: height 44px
- Two-line node (title + subtitle): height 56px
- Decision diamond: `<polygon>`, width ~120px, height ~60px

## Two-Line Node Text Positioning

```xml
<text class="th" x="{cx}" y="{rect_y + 19}"
  text-anchor="middle" dominant-baseline="central">Title</text>
<text class="ts" x="{cx}" y="{rect_y + 38}"
  text-anchor="middle" dominant-baseline="central">Subtitle</text>
```

## Horizontal Layout

```
n nodes, gap = 20:
total = n × node_w + (n-1) × gap
Must satisfy total ≤ 600
node_w = (600 - (n-1) × 20) / n
start_x = (680 - total) / 2
```

## Vertical Arrow Endpoints

```
Upper node exit: y1 = rect_y + rect_h + 10
Lower node entry: y2 = rect_y - 10
```

## Decision Diamond

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

## Error Path Collection

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

```
Diamond1 ──→ ┃
              ┃  (vertical collector)
Diamond2 ──→ ┃
              ┃
Diamond3 ──→ ┃──→ [ Error Box ] → End(fail)
```

**Common mistake:** placing the error box next to the first diamond, then drawing error lines from later diamonds that point into empty space with no endpoint. Every line must connect to a valid target.

## Example: Approval Flow (with rejection fallback)

```xml
<svg width="100%" viewBox="0 0 680 280" role="img"
  xmlns="http://www.w3.org/2000/svg">
  <title>Approval Flowchart</title>
  <desc>Submit application, review, decide, notify; reject sends back for revision</desc>
  <defs>
    <style>
      svg{font-family:"JetBrains Mono","Anthropic Sans",-apple-system,system-ui,"Segoe UI",sans-serif}
      :root{--b:rgba(31,30,29,.3);--bg2:#F5F4ED;--s:#3D3D3A}
      .t{font-size:16px;font-weight:400;fill:var(--s)}
      .ts{font-size:12px;font-weight:400;fill:var(--s)}
      .th{font-size:14px;font-weight:500}
      .c-teal>rect,.c-teal>polygon,.c-teal>circle,.c-teal>ellipse{fill:#E1F5EE;stroke:#0F6E56}
      .c-teal>.th{fill:#085041}.c-teal>.ts{fill:#0F6E56}
      .c-purple>rect,.c-purple>polygon,.c-purple>circle,.c-purple>ellipse{fill:#EEEDFE;stroke:#534AB7}
      .c-purple>.th{fill:#3C3489}.c-purple>.ts{fill:#534AB7}
      .c-amber>rect,.c-amber>polygon,.c-amber>circle,.c-amber>ellipse{fill:#FAEEDA;stroke:#854F0B}
      .c-amber>.th{fill:#633806}.c-amber>.ts{fill:#854F0B}
      .c-green>rect,.c-green>polygon,.c-green>circle,.c-green>ellipse{fill:#EAF3DE;stroke:#3B6D11}
      .c-green>.th{fill:#27500A}.c-green>.ts{fill:#3B6D11}
      @media(prefers-color-scheme:dark){
        :root{--b:rgba(224,225,226,.3);--bg2:#2A2A28;--s:#B0B0AD}
        .c-teal>rect,.c-teal>polygon,.c-teal>circle,.c-teal>ellipse{fill:#0B2E24;stroke:#2DB88A}
        .c-teal>.th{fill:#5DC9A3}.c-teal>.ts{fill:#2DB88A}
        .c-purple>rect,.c-purple>polygon,.c-purple>circle,.c-purple>ellipse{fill:#1E1C3D;stroke:#7A70D0}
        .c-purple>.th{fill:#ADA5F0}.c-purple>.ts{fill:#7A70D0}
        .c-amber>rect,.c-amber>polygon,.c-amber>circle,.c-amber>ellipse{fill:#33230A;stroke:#C49020}
        .c-amber>.th{fill:#E0B850}.c-amber>.ts{fill:#C49020}
        .c-green>rect,.c-green>polygon,.c-green>circle,.c-green>ellipse{fill:#152D08;stroke:#5A9E20}
        .c-green>.th{fill:#80C040}.c-green>.ts{fill:#5A9E20}
      }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <g class="c-teal">
    <rect x="40" y="60" width="135" height="56" rx="8" stroke-width="0.5"/>
    <text class="th" x="107" y="79" text-anchor="middle" dominant-baseline="central">Submit</text>
    <text class="ts" x="107" y="98" text-anchor="middle" dominant-baseline="central">User fills form</text>
  </g>
  <g class="c-purple">
    <rect x="195" y="60" width="135" height="56" rx="8" stroke-width="0.5"/>
    <text class="th" x="262" y="79" text-anchor="middle" dominant-baseline="central">Review</text>
    <text class="ts" x="262" y="98" text-anchor="middle" dominant-baseline="central">Reviewer checks</text>
  </g>
  <g class="c-amber">
    <rect x="350" y="60" width="135" height="56" rx="8" stroke-width="0.5"/>
    <text class="th" x="417" y="79" text-anchor="middle" dominant-baseline="central">Decide</text>
    <text class="ts" x="417" y="98" text-anchor="middle" dominant-baseline="central">Approve / Reject</text>
  </g>
  <g class="c-green">
    <rect x="505" y="60" width="135" height="56" rx="8" stroke-width="0.5"/>
    <text class="th" x="572" y="79" text-anchor="middle" dominant-baseline="central">Notify</text>
    <text class="ts" x="572" y="98" text-anchor="middle" dominant-baseline="central">Send result</text>
  </g>

  <line x1="175" y1="88" x2="193" y2="88" stroke="#1D9E75" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="330" y1="88" x2="348" y2="88" stroke="#534AB7" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="485" y1="88" x2="503" y2="88" stroke="#BA7517" stroke-width="1.5" marker-end="url(#arrow)"/>

  <path d="M 417 116 L 417 170 L 107 170 L 107 116"
    fill="none" stroke="#E24B4A" stroke-width="1"
    stroke-dasharray="5 3" marker-end="url(#arrow)"/>
  <text class="ts" x="262" y="190" text-anchor="middle">Rejected, send back</text>
</svg>
```
