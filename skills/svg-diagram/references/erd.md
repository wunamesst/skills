# ERD / Database Relationship Diagrams

Use mermaid.js for database table structure diagrams, not hand-written SVG.
Reason: field alignment and relationship routing are text-layout problems; hand-written coordinates are extremely error-prone.

---

## Complete Template (HTML widget)

```html
<style>
#erd svg.erDiagram .divider path { stroke-opacity: 0.5; }
#erd svg.erDiagram .row-rect-odd path,
#erd svg.erDiagram .row-rect-odd rect,
#erd svg.erDiagram .row-rect-even path,
#erd svg.erDiagram .row-rect-even rect { stroke: none !important; }
</style>

<div id="erd"></div>

<script type="module">
import mermaid from 'https://esm.sh/mermaid@11/dist/mermaid.esm.min.mjs';
const dark = matchMedia('(prefers-color-scheme: dark)').matches;
await document.fonts.ready;

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  fontFamily: '"Anthropic Sans", sans-serif',
  themeVariables: {
    darkMode: dark,
    fontSize: '13px',
    fontFamily: '"Anthropic Sans", sans-serif',
    lineColor: dark ? '#9c9a92' : '#73726c',
    textColor: dark ? '#c2c0b6' : '#3d3d3a',
  },
});

const diagram = `erDiagram
  USERS ||--o{ POSTS : writes
  POSTS ||--o{ COMMENTS : has
  USERS {
    uuid id PK
    string email
    string name
    timestamp created_at
  }
  POSTS {
    uuid id PK
    uuid user_id FK
    string title
    text content
    timestamp published_at
  }
  COMMENTS {
    uuid id PK
    uuid post_id FK
    uuid user_id FK
    text body
  }`;

const { svg } = await mermaid.render('erd-svg', diagram);
document.getElementById('erd').innerHTML = svg;

/* Round entity border corners */
document.querySelectorAll('#erd svg.erDiagram .node').forEach(node => {
  const firstPath = node.querySelector('path[d]');
  if (!firstPath) return;
  const d = firstPath.getAttribute('d');
  const nums = d.match(/-?[\d.]+/g)?.map(Number);
  if (!nums || nums.length < 8) return;
  const xs = [nums[0], nums[2], nums[4], nums[6]];
  const ys = [nums[1], nums[3], nums[5], nums[7]];
  const x = Math.min(...xs), y = Math.min(...ys);
  const w = Math.max(...xs) - x, h = Math.max(...ys) - y;
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', x); rect.setAttribute('y', y);
  rect.setAttribute('width', w); rect.setAttribute('height', h);
  rect.setAttribute('rx', '8');
  for (const a of ['fill', 'stroke', 'stroke-width', 'class', 'style']) {
    if (firstPath.hasAttribute(a)) rect.setAttribute(a, firstPath.getAttribute(a));
  }
  firstPath.replaceWith(rect);
});

/* Remove field row borders */
document.querySelectorAll(
  '#erd svg.erDiagram .row-rect-odd path, #erd svg.erDiagram .row-rect-even path'
).forEach(p => p.setAttribute('stroke', 'none'));
</script>
```

---

## Relationship Cardinality Quick Reference

| mermaid syntax | Meaning |
|---------------|---------|
| `||--||` | One-to-one |
| `||--o{` | One-to-many (right side many, zero allowed) |
| `||--|{` | One-to-many (right side at least one) |
| `}o--o{` | Many-to-many (zero allowed on both sides) |

---

## When to Use Hand-Written SVG Instead

If you only need to show dependencies between tables (without fields), use a hand-written SVG structure diagram instead. Draw each table as a rect node, with arrows indicating foreign key direction.