# Timeline Diagram Specification

## When to Use

Chronological events, version releases, project milestones, historical sequences.

## Elements

| Element | SVG | Description |
|---------|-----|-------------|
| Axis | Horizontal or vertical line | Time progression |
| Event marker | Circle or diamond on axis | Point in time |
| Event card | Rounded rect with label | Description of the event |
| Period span | Rounded rect spanning axis segment | Duration/event range |

## Layout

**Horizontal timeline (default):**
- Axis: `y=150`, from `x=60` to `x=620`
- Event markers: circles `r=6` on the axis
- Event cards: alternate above/below axis to avoid overlap
- Card width: 100-120px, height: 50-60px
- Connector line from marker to card: 1px, stroke `var(--b)`

**Vertical timeline:**
- Axis: `x=100`, from `y=40` to `y={H-40}`
- Event cards: to the right of the axis
- Connector line: horizontal from axis to card

## Color Assignment

- Axis: `var(--b)` (subtle)
- Event markers: `c-*` by category (e.g., release=c-green, breaking=c-red, feature=c-purple)
- Cards: same `c-*` as their marker

## Event Marker

```xml
<circle cx="X" cy="150" r="6" fill="#3B6D11" stroke="#3B6D11" stroke-width="1.5"/>
```

## Event Card (above axis)

```xml
<line x1="X" y1="144" x2="X" y2="100" stroke="var(--b)" stroke-width="1"/>
<g class="c-green">
  <rect x="{X-50}" y="50" width="100" height="48" rx="8" stroke-width="0.5"/>
  <text class="th" x="X" y="70" text-anchor="middle" dominant-baseline="central">v1.0</text>
  <text class="ts" x="X" y="86" text-anchor="middle" dominant-baseline="central">Initial release</text>
</g>
```

## Example: Project Milestones

```xml
<svg width="100%" viewBox="0 0 680 300" role="img"
  xmlns="http://www.w3.org/2000/svg">
  <title>Project Timeline</title>
  <desc>Key milestones from project kickoff to production launch</desc>
  <defs>
    <style>
      svg{font-family:"JetBrains Mono","Anthropic Sans",-apple-system,system-ui,"Segoe UI",sans-serif}
      :root{--b:rgba(31,30,29,.3);--bg2:#F5F4ED;--s:#3D3D3A}
      .t{font-size:16px;font-weight:400;fill:var(--s)}
      .ts{font-size:12px;font-weight:400;fill:var(--s)}
      .th{font-size:14px;font-weight:500}
      .c-teal>rect,.c-teal>circle{fill:#E1F5EE;stroke:#0F6E56}
      .c-teal>.th{fill:#085041}.c-teal>.ts{fill:#0F6E56}
      .c-purple>rect,.c-purple>circle{fill:#EEEDFE;stroke:#534AB7}
      .c-purple>.th{fill:#3C3489}.c-purple>.ts{fill:#534AB7}
      .c-amber>rect,.c-amber>circle{fill:#FAEEDA;stroke:#854F0B}
      .c-amber>.th{fill:#633806}.c-amber>.ts{fill:#854F0B}
      .c-green>rect,.c-green>circle{fill:#EAF3DE;stroke:#3B6D11}
      .c-green>.th{fill:#27500A}.c-green>.ts{fill:#3B6D11}
      @media(prefers-color-scheme:dark){
        :root{--b:rgba(224,225,226,.3);--bg2:#2A2A28;--s:#B0B0AD}
        .c-teal>rect,.c-teal>circle{fill:#0B2E24;stroke:#2DB88A}
        .c-teal>.th{fill:#5DC9A3}.c-teal>.ts{fill:#2DB88A}
        .c-purple>rect,.c-purple>circle{fill:#1E1C3D;stroke:#7A70D0}
        .c-purple>.th{fill:#ADA5F0}.c-purple>.ts{fill:#7A70D0}
        .c-amber>rect,.c-amber>circle{fill:#33230A;stroke:#C49020}
        .c-amber>.th{fill:#E0B850}.c-amber>.ts{fill:#C49020}
        .c-green>rect,.c-green>circle{fill:#152D08;stroke:#5A9E20}
        .c-green>.th{fill:#80C040}.c-green>.ts{fill:#5A9E20}
      }
    </style>
  </defs>

  <!-- Axis -->
  <line x1="60" y1="150" x2="620" y2="150" stroke="var(--b)" stroke-width="2" stroke-linecap="round"/>
  <!-- Axis end arrow -->
  <polygon points="620,150 612,145 612,155" fill="var(--b)"/>

  <!-- Event 1: Kickoff (above) -->
  <circle cx="100" cy="150" r="6" fill="#0F6E56" stroke="#0F6E56" stroke-width="1.5"/>
  <line x1="100" y1="144" x2="100" y2="105" stroke="var(--b)" stroke-width="1"/>
  <g class="c-teal">
    <rect x="40" y="55" width="120" height="48" rx="8" stroke-width="0.5"/>
    <text class="th" x="100" y="75" text-anchor="middle" dominant-baseline="central">Kickoff</text>
    <text class="ts" x="100" y="91" text-anchor="middle" dominant-baseline="central">2025-01-15</text>
  </g>

  <!-- Event 2: Design (below) -->
  <circle cx="220" cy="150" r="6" fill="#534AB7" stroke="#534AB7" stroke-width="1.5"/>
  <line x1="220" y1="156" x2="220" y2="195" stroke="var(--b)" stroke-width="1"/>
  <g class="c-purple">
    <rect x="160" y="197" width="120" height="48" rx="8" stroke-width="0.5"/>
    <text class="th" x="220" y="217" text-anchor="middle" dominant-baseline="central">Design Done</text>
    <text class="ts" x="220" y="233" text-anchor="middle" dominant-baseline="central">2025-02-20</text>
  </g>

  <!-- Event 3: Alpha (above) -->
  <circle cx="360" cy="150" r="6" fill="#854F0B" stroke="#854F0B" stroke-width="1.5"/>
  <line x1="360" y1="144" x2="360" y2="105" stroke="var(--b)" stroke-width="1"/>
  <g class="c-amber">
    <rect x="300" y="55" width="120" height="48" rx="8" stroke-width="0.5"/>
    <text class="th" x="360" y="75" text-anchor="middle" dominant-baseline="central">Alpha</text>
    <text class="ts" x="360" y="91" text-anchor="middle" dominant-baseline="central">2025-04-10</text>
  </g>

  <!-- Event 4: Launch (below) -->
  <circle cx="520" cy="150" r="6" fill="#3B6D11" stroke="#3B6D11" stroke-width="1.5"/>
  <line x1="520" y1="156" x2="520" y2="195" stroke="var(--b)" stroke-width="1"/>
  <g class="c-green">
    <rect x="460" y="197" width="120" height="48" rx="8" stroke-width="0.5"/>
    <text class="th" x="520" y="217" text-anchor="middle" dominant-baseline="central">Launch</text>
    <text class="ts" x="520" y="233" text-anchor="middle" dominant-baseline="central">2025-06-01</text>
  </g>
</svg>
```
