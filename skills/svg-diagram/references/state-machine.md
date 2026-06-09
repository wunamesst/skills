# State Machine Diagram Specification

## When to Use

State transitions, lifecycle flows, order status, task states, connection states.

## Elements

| Element | SVG | Description |
|---------|-----|-------------|
| State | Rounded rect `rx="20"` | A stable state the system can be in |
| Initial state | Filled circle `r=8` | Entry point, filled with stroke color |
| Final state | Bullseye (circle + inner circle) | Terminal state |
| Transition | Arrow with label | Event that triggers state change |
| Self-transition | Loop arrow back to same state | Event that doesn't change state |

## Color Assignment

- Start/End states: `c-green` (success) or `c-red` (failure)
- Normal states: `c-purple` (processing) or `c-blue` (data)
- Error states: `c-red`
- Transitions: hardcoded mid-tone hex from source state's color family

## Layout

- Horizontal layout: states arranged left-to-right, 40px gap minimum
- Vertical layout: states arranged top-to-bottom, 60px gap minimum
- Self-transitions: loop to the top or right of the state box
- Transition labels: 8px above the arrow, text-anchor="middle"

## State Box Template

```xml
<g class="c-purple">
  <rect x="X" y="Y" width="140" height="50" rx="20" stroke-width="0.5"/>
  <text class="th" x="CX" y="CY" text-anchor="middle" dominant-baseline="central">State Name</text>
</g>
```

## Initial State

```xml
<circle cx="X" cy="CY" r="8" fill="#3B6D11" stroke="#3B6D11" stroke-width="1.5"/>
<line x1="X+8" y1="CY" x2="X+30" y2="CY" stroke="#3B6D11" stroke-width="1.5" marker-end="url(#arrow)"/>
```

## Final State (Bullseye)

```xml
<circle cx="X" cy="CY" r="12" fill="none" stroke="#3B6D11" stroke-width="1.5"/>
<circle cx="X" cy="CY" r="6" fill="#3B6D11"/>
```

## Self-Transition

```xml
<path d="M {right_x} {cy} C {right_x+40} {cy-30} {right_x+40} {cy+30} {right_x} {cy+2}"
  fill="none" stroke="#534AB7" stroke-width="1.5" marker-end="url(#arrow)"/>
<text class="ts" x="{right_x+45}" y="{cy}" text-anchor="start" dominant-baseline="central">event</text>
```

## Example: Order Lifecycle

```xml
<svg width="100%" viewBox="0 0 680 200" role="img"
  xmlns="http://www.w3.org/2000/svg">
  <title>Order State Machine</title>
  <desc>Order lifecycle from creation through payment, shipping, to completion or cancellation</desc>
  <defs>
    <style>
      svg{font-family:"JetBrains Mono","Anthropic Sans",-apple-system,system-ui,"Segoe UI",sans-serif}
      :root{--b:rgba(31,30,29,.3);--bg2:#F5F4ED;--s:#3D3D3A}
      .t{font-size:16px;font-weight:400;fill:var(--s)}
      .ts{font-size:12px;font-weight:400;fill:var(--s)}
      .th{font-size:14px;font-weight:500}
      .c-green>rect,.c-green>polygon,.c-green>circle,.c-green>ellipse{fill:#EAF3DE;stroke:#3B6D11}
      .c-green>.th{fill:#27500A}.c-green>.ts{fill:#3B6D11}
      .c-purple>rect,.c-purple>polygon,.c-purple>circle,.c-purple>ellipse{fill:#EEEDFE;stroke:#534AB7}
      .c-purple>.th{fill:#3C3489}.c-purple>.ts{fill:#534AB7}
      .c-amber>rect,.c-amber>polygon,.c-amber>circle,.c-amber>ellipse{fill:#FAEEDA;stroke:#854F0B}
      .c-amber>.th{fill:#633806}.c-amber>.ts{fill:#854F0B}
      .c-red>rect,.c-red>polygon,.c-red>circle,.c-red>ellipse{fill:#FCEBEB;stroke:#A32D2D}
      .c-red>.th{fill:#791F1F}.c-red>.ts{fill:#A32D2D}
      @media(prefers-color-scheme:dark){
        :root{--b:rgba(224,225,226,.3);--bg2:#2A2A28;--s:#B0B0AD}
        .c-green>rect,.c-green>polygon,.c-green>circle,.c-green>ellipse{fill:#152D08;stroke:#5A9E20}
        .c-green>.th{fill:#80C040}.c-green>.ts{fill:#5A9E20}
        .c-purple>rect,.c-purple>polygon,.c-purple>circle,.c-purple>ellipse{fill:#1E1C3D;stroke:#7A70D0}
        .c-purple>.th{fill:#ADA5F0}.c-purple>.ts{fill:#7A70D0}
        .c-amber>rect,.c-amber>polygon,.c-amber>circle,.c-amber>ellipse{fill:#33230A;stroke:#C49020}
        .c-amber>.th{fill:#E0B850}.c-amber>.ts{fill:#C49020}
        .c-red>rect,.c-red>polygon,.c-red>circle,.c-red>ellipse{fill:#331212;stroke:#C04040}
        .c-red>.th{fill:#E07070}.c-red>.ts{fill:#C04040}
      }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <!-- Initial state -->
  <circle cx="40" cy="100" r="8" fill="#3B6D11" stroke="#3B6D11" stroke-width="1.5"/>
  <line x1="48" y1="100" x2="72" y2="100" stroke="#3B6D11" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- Created -->
  <g class="c-purple">
    <rect x="74" y="75" width="110" height="50" rx="20" stroke-width="0.5"/>
    <text class="th" x="129" y="100" text-anchor="middle" dominant-baseline="central">Created</text>
  </g>
  <text class="ts" x="129" y="68" text-anchor="middle">create</text>

  <!-- Created → Paid -->
  <line x1="184" y1="100" x2="218" y2="100" stroke="#534AB7" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="201" y="92" text-anchor="middle">pay</text>

  <!-- Paid -->
  <g class="c-amber">
    <rect x="220" y="75" width="110" height="50" rx="20" stroke-width="0.5"/>
    <text class="th" x="275" y="100" text-anchor="middle" dominant-baseline="central">Paid</text>
  </g>

  <!-- Paid → Shipped -->
  <line x1="330" y1="100" x2="364" y2="100" stroke="#BA7517" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="347" y="92" text-anchor="middle">ship</text>

  <!-- Shipped -->
  <g class="c-purple">
    <rect x="366" y="75" width="110" height="50" rx="20" stroke-width="0.5"/>
    <text class="th" x="421" y="100" text-anchor="middle" dominant-baseline="central">Shipped</text>
  </g>

  <!-- Shipped → Completed -->
  <line x1="476" y1="100" x2="510" y2="100" stroke="#534AB7" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="493" y="92" text-anchor="middle">confirm</text>

  <!-- Completed -->
  <g class="c-green">
    <rect x="512" y="75" width="110" height="50" rx="20" stroke-width="0.5"/>
    <text class="th" x="567" y="100" text-anchor="middle" dominant-baseline="central">Completed</text>
  </g>

  <!-- Final state -->
  <line x1="622" y1="100" x2="646" y2="100" stroke="#3B6D11" stroke-width="1.5" marker-end="url(#arrow)"/>
  <circle cx="660" cy="100" r="12" fill="none" stroke="#3B6D11" stroke-width="1.5"/>
  <circle cx="660" cy="100" r="6" fill="#3B6D11"/>

  <!-- Cancelled (branch from Created) -->
  <path d="M 129 125 L 129 165" fill="none" stroke="#A32D2D" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="140" y="148" text-anchor="start">cancel</text>
  <g class="c-red">
    <rect x="74" y="167" width="110" height="36" rx="18" stroke-width="0.5"/>
    <text class="th" x="129" y="185" text-anchor="middle" dominant-baseline="central">Cancelled</text>
  </g>
</svg>
```
