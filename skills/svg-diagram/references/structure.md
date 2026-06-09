# Structure Diagram Specification

## Nesting Rules

- Outer and inner containers MUST use different color classes
- Same-color nesting destroys hierarchy

## Container Padding

- Outer: ≥ 24px
- Inner region spacing: ≥ 16px
- Label to container edge: ≥ 12px

## Example: Microservice Architecture

```xml
<svg width="100%" viewBox="0 0 680 320" role="img"
  xmlns="http://www.w3.org/2000/svg">
  <title>Microservice Architecture Structure Diagram</title>
  <desc>API gateway contains user service and order service, each with independent databases</desc>
  <defs>
    <style>
      svg{font-family:"JetBrains Mono","Anthropic Sans",-apple-system,system-ui,"Segoe UI",sans-serif}
      :root{--b:rgba(31,30,29,.3);--bg2:#F5F4ED;--s:#3D3D3A}
      .t{font-size:16px;font-weight:400;fill:var(--s)}
      .ts{font-size:12px;font-weight:400;fill:var(--s)}
      .th{font-size:14px;font-weight:500}
      .c-blue>rect,.c-blue>polygon,.c-blue>circle,.c-blue>ellipse{fill:#E6F1FB;stroke:#185FA5}
      .c-blue>.th{fill:#0C447C}.c-blue>.ts{fill:#185FA5}
      .c-teal>rect,.c-teal>polygon,.c-teal>circle,.c-teal>ellipse{fill:#E1F5EE;stroke:#0F6E56}
      .c-teal>.th{fill:#085041}.c-teal>.ts{fill:#0F6E56}
      .c-coral>rect,.c-coral>polygon,.c-coral>circle,.c-coral>ellipse{fill:#FAECE7;stroke:#993C1D}
      .c-coral>.th{fill:#712B13}.c-coral>.ts{fill:#993C1D}
      .c-gray>rect,.c-gray>polygon,.c-gray>circle,.c-gray>ellipse{fill:#F1EFE8;stroke:#5F5E5A}
      .c-gray>.th{fill:#444441}.c-gray>.ts{fill:#5F5E5A}
      @media(prefers-color-scheme:dark){
        :root{--b:rgba(224,225,226,.3);--bg2:#2A2A28;--s:#B0B0AD}
        .c-blue>rect,.c-blue>polygon,.c-blue>circle,.c-blue>ellipse{fill:#0D2640;stroke:#3A8CD0}
        .c-blue>.th{fill:#7AB8E8}.c-blue>.ts{fill:#3A8CD0}
        .c-teal>rect,.c-teal>polygon,.c-teal>circle,.c-teal>ellipse{fill:#0B2E24;stroke:#2DB88A}
        .c-teal>.th{fill:#5DC9A3}.c-teal>.ts{fill:#2DB88A}
        .c-coral>rect,.c-coral>polygon,.c-coral>circle,.c-coral>ellipse{fill:#331510;stroke:#C05838}
        .c-coral>.th{fill:#E08868}.c-coral>.ts{fill:#C05838}
        .c-gray>rect,.c-gray>polygon,.c-gray>circle,.c-gray>ellipse{fill:#252523;stroke:#8E8D88}
        .c-gray>.th{fill:#B0B0AD}.c-gray>.ts{fill:#8E8D88}
      }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <g class="c-blue">
    <rect x="60" y="20" width="580" height="270" rx="20" stroke-width="0.5"/>
    <text class="th" x="350" y="50" text-anchor="middle" dominant-baseline="central">Backend System</text>
  </g>
  <g class="c-teal">
    <rect x="90" y="74" width="220" height="80" rx="8" stroke-width="0.5"/>
    <text class="th" x="200" y="106" text-anchor="middle" dominant-baseline="central">User Service</text>
    <text class="ts" x="200" y="126" text-anchor="middle" dominant-baseline="central">Register, Login, Auth</text>
  </g>
  <g class="c-coral">
    <rect x="330" y="74" width="290" height="80" rx="8" stroke-width="0.5"/>
    <text class="th" x="475" y="106" text-anchor="middle" dominant-baseline="central">Order Service</text>
    <text class="ts" x="475" y="126" text-anchor="middle" dominant-baseline="central">Create, Query, Pay</text>
  </g>
  <g class="c-gray">
    <rect x="90" y="194" width="220" height="74" rx="8" stroke-width="0.5"/>
    <text class="th" x="200" y="224" text-anchor="middle" dominant-baseline="central">User DB</text>
    <text class="ts" x="200" y="244" text-anchor="middle" dominant-baseline="central">PostgreSQL</text>
  </g>
  <g class="c-gray">
    <rect x="330" y="194" width="290" height="74" rx="8" stroke-width="0.5"/>
    <text class="th" x="475" y="224" text-anchor="middle" dominant-baseline="central">Order DB</text>
    <text class="ts" x="475" y="244" text-anchor="middle" dominant-baseline="central">MySQL</text>
  </g>

  <line x1="200" y1="154" x2="200" y2="192" stroke="#888780" stroke-width="1" marker-end="url(#arrow)"/>
  <line x1="475" y1="154" x2="475" y2="192" stroke="#888780" stroke-width="1" marker-end="url(#arrow)"/>

  <text class="ts" x="22" y="118" text-anchor="middle">Client</text>
  <line x1="42" y1="114" x2="58" y2="114" stroke="#888780" stroke-width="1.5" marker-end="url(#arrow)"/>
</svg>
```
