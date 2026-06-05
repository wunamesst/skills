# ERD / 数据库关系图

数据库表结构图用 mermaid.js 渲染，不手写 SVG。
原因：字段对齐、连接线路由是文本布局问题，手写坐标极易出错。

---

## 完整模板（HTML widget）

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

/* 圆角化实体外框 */
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

/* 去除字段行边框 */
document.querySelectorAll(
  '#erd svg.erDiagram .row-rect-odd path, #erd svg.erDiagram .row-rect-even path'
).forEach(p => p.setAttribute('stroke', 'none'));
</script>
```

---

## 关系基数符号速查

| mermaid 语法 | 含义 |
|-------------|------|
| `||--||` | 一对一 |
| `||--o{` | 一对多（右侧多，可为零） |
| `||--|{` | 一对多（右侧至少一个） |
| `}o--o{` | 多对多（两侧均可为零） |

---

## 何时改用手写 SVG

如果只需要展示表之间的依赖关系（不含字段），可用手写 SVG 结构图替代，
每个表画成一个矩形节点，箭头表示外键方向。