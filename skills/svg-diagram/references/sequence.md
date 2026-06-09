# Sequence Diagram Specification

## Participant X-Coordinate Table

| Count | Center X positions |
|-------|-------------------|
| 2 | 160, 520 |
| 3 | 120, 340, 560 |
| 4 | 90, 270, 450, 610 (box width 90) |
| 5 | 65, 195, 330, 465, 600 (box width 80) |
| 6 | 50, 160, 282, 390, 505, 621 (box width 90) |

## Spacing Rules

- Participant head bottom to first message: ≥ 20px
- Group title to first message arrow in group: ≥ 28px
- Adjacent message arrows: ≥ 32px
- Between groups, extra: 20px
- Group bottom margin: ≥ 20px
- Last message to bottom participant: ≥ 28px

## Group Height Formula

```
group_h = (n_msgs + 1) × 32 + 16
```

## Y-Coordinate Lookup Table

Single-group scenarios:
| N | group_y | Message arrow Ys | group_h | H |
|---|---------|-------------|---------|------|
| 2 | 76 | 120, 152 | 96 | 340 |
| 3 | 76 | 120, 152, 184 | 128 | 380 |
| 4 | 76 | 120, 152, 184, 216 | 160 | 420 |
| 5 | 76 | 120, 152, 184, 216, 248 | 192 | 460 |

Two-group scenarios:
| N₁+N₂ | group₁ y/h | group₂ y/h | Message arrow Ys | H |
|-------|------------|------------|-------------|----|
| 2+3 | 76 / 96 | 192 / 128 | ① 120,152 → ② 236,268,300 | 460 |
| 3+4 | 76 / 128 | 224 / 160 | ① 120,152,184 → ② 268,300,332,364 | 520 |
| 4+4 | 76 / 160 | 256 / 160 | ① 120,152,184,216 → ② 300,332,364,396 | 560 |
| 3+6 | 76 / 128 | 224 / 224 | ① 120,152,184 → ② 268,300,332,364,396,428 | 580 |

## Example: Video Upload Flow (6 participants)

```xml
<svg width="100%" viewBox="0 0 680 560" role="img"
  xmlns="http://www.w3.org/2000/svg">
  <title>Video Processing Sequence Diagram</title>
  <desc>Complete message interaction sequence from upload to transcoding completion</desc>
  <defs>
    <style>
      svg{font-family:"JetBrains Mono","Anthropic Sans",-apple-system,system-ui,"Segoe UI",sans-serif}
      :root{--b:rgba(31,30,29,.3);--bg2:#F5F4ED;--s:#3D3D3A}
      .t{font-size:16px;font-weight:400;fill:var(--s)}
      .ts{font-size:12px;font-weight:400;fill:var(--s)}
      .th{font-size:14px;font-weight:500}
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
      }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <g class="c-teal"><rect x="5" y="20" width="90" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="50" y="40" text-anchor="middle" dominant-baseline="central">Uploader</text></g>
  <g class="c-purple"><rect x="115" y="20" width="90" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="160" y="40" text-anchor="middle" dominant-baseline="central">Reviewer</text></g>
  <g class="c-blue"><rect x="233" y="20" width="98" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="282" y="40" text-anchor="middle" dominant-baseline="central">video table</text></g>
  <g class="c-amber"><rect x="345" y="20" width="90" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="390" y="40" text-anchor="middle" dominant-baseline="central">TMS</text></g>
  <g class="c-coral"><rect x="455" y="20" width="100" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="505" y="40" text-anchor="middle" dominant-baseline="central">task table</text></g>
  <g class="c-gray"><rect x="571" y="20" width="100" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="621" y="40" text-anchor="middle" dominant-baseline="central">IMM Service</text></g>

  <line x1="50"  y1="60" x2="50"  y2="510" stroke="var(--b)" stroke-width="0.5" stroke-dasharray="4 3"/>
  <line x1="160" y1="60" x2="160" y2="510" stroke="var(--b)" stroke-width="0.5" stroke-dasharray="4 3"/>
  <line x1="282" y1="60" x2="282" y2="510" stroke="var(--b)" stroke-width="0.5" stroke-dasharray="4 3"/>
  <line x1="390" y1="60" x2="390" y2="510" stroke="var(--b)" stroke-width="0.5" stroke-dasharray="4 3"/>
  <line x1="505" y1="60" x2="505" y2="510" stroke="var(--b)" stroke-width="0.5" stroke-dasharray="4 3"/>
  <line x1="621" y1="60" x2="621" y2="510" stroke="var(--b)" stroke-width="0.5" stroke-dasharray="4 3"/>

  <rect x="28" y="76" width="630" height="52" rx="4" fill="var(--bg2)" opacity="0.5"/>
  <text class="ts" x="36" y="92" fill="var(--s)">① Upload file</text>
  <line x1="50" y1="112" x2="270" y2="112" stroke="#1D9E75" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="160" y="106" text-anchor="middle">Upload video</text>

  <rect x="28" y="144" width="630" height="90" rx="4" fill="var(--bg2)" opacity="0.5"/>
  <text class="ts" x="36" y="160" fill="var(--s)">② Review</text>
  <line x1="160" y1="176" x2="270" y2="176" stroke="#534AB7" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="215" y="170" text-anchor="middle">Read video</text>
  <line x1="270" y1="196" x2="172" y2="196" stroke="#888780" stroke-width="1" stroke-dasharray="5 3" marker-end="url(#arrow)"/>
  <text class="ts" x="215" y="190" text-anchor="middle">Return data</text>
  <line x1="160" y1="218" x2="270" y2="218" stroke="#534AB7" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="215" y="212" text-anchor="middle">Write audit log</text>

  <rect x="28" y="250" width="630" height="68" rx="4" fill="var(--bg2)" opacity="0.5"/>
  <text class="ts" x="36" y="266" fill="var(--s)">③ Completion sync</text>
  <line x1="50" y1="282" x2="270" y2="282" stroke="#BA7517" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="160" y="276" text-anchor="middle">Read video data</text>
  <line x1="50" y1="302" x2="378" y2="302" stroke="#BA7517" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="214" y="296" text-anchor="middle">Sync to TMS</text>

  <rect x="28" y="334" width="630" height="68" rx="4" fill="var(--bg2)" opacity="0.5"/>
  <text class="ts" x="36" y="350" fill="var(--s)">④ Trigger IMM transcode</text>
  <line x1="390" y1="366" x2="493" y2="366" stroke="#993C1D" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="441" y="360" text-anchor="middle">Write transcode task</text>
  <line x1="390" y1="386" x2="609" y2="386" stroke="#993C1D" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="500" y="380" text-anchor="middle">Send transcode request</text>

  <rect x="28" y="418" width="630" height="80" rx="4" fill="var(--bg2)" opacity="0.5"/>
  <text class="ts" x="36" y="434" fill="var(--s)">⑤ Cron write-back</text>
  <line x1="50" y1="450" x2="609" y2="450" stroke="#888780" stroke-width="1" stroke-dasharray="5 3" marker-end="url(#arrow)"/>
  <text class="ts" x="330" y="444" text-anchor="middle">Pull transcode result</text>
  <line x1="50" y1="470" x2="493" y2="470" stroke="#993C1D" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="272" y="464" text-anchor="middle">Write-back task + video status</text>

  <g class="c-teal"><rect x="5" y="518" width="90" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="50" y="538" text-anchor="middle" dominant-baseline="central">Uploader</text></g>
  <g class="c-purple"><rect x="115" y="518" width="90" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="160" y="538" text-anchor="middle" dominant-baseline="central">Reviewer</text></g>
  <g class="c-blue"><rect x="233" y="518" width="98" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="282" y="538" text-anchor="middle" dominant-baseline="central">video table</text></g>
  <g class="c-amber"><rect x="345" y="518" width="90" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="390" y="538" text-anchor="middle" dominant-baseline="central">TMS</text></g>
  <g class="c-coral"><rect x="455" y="518" width="100" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="505" y="538" text-anchor="middle" dominant-baseline="central">task table</text></g>
  <g class="c-gray"><rect x="571" y="518" width="100" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="621" y="538" text-anchor="middle" dominant-baseline="central">IMM Service</text></g>
</svg>
```
