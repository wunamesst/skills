# SVG 内嵌样式块

每个 SVG 必须在 `<defs>` 内包含以下 `<style>` 块，使图表在浏览器中直接打开时能正确渲染。
仅保留本图实际使用的 `c-*` 色阶即可，但基础变量和文字 class 必须完整。

## 完整样式模板

```xml
<style>
  svg{font-family:"Anthropic Sans",-apple-system,system-ui,"Segoe UI",sans-serif}
  :root{--b:rgba(31,30,29,.3);--bg2:#F5F4ED;--s:#3D3D3A}
  .t{font-size:16px;font-weight:400;fill:var(--s)}
  .ts{font-size:12px;font-weight:400;fill:var(--s)}
  .th{font-size:14px;font-weight:500}
  .c-teal>rect,.c-teal>circle,.c-teal>ellipse{fill:#E1F5EE;stroke:#0F6E56}
  .c-teal>.th{fill:#085041}.c-teal>.ts{fill:#0F6E56}
  .c-blue>rect,.c-blue>circle,.c-blue>ellipse{fill:#E6F1FB;stroke:#185FA5}
  .c-blue>.th{fill:#0C447C}.c-blue>.ts{fill:#185FA5}
  .c-purple>rect,.c-purple>circle,.c-purple>ellipse{fill:#EEEDFE;stroke:#534AB7}
  .c-purple>.th{fill:#3C3489}.c-purple>.ts{fill:#534AB7}
  .c-amber>rect,.c-amber>circle,.c-amber>ellipse{fill:#FAEEDA;stroke:#854F0B}
  .c-amber>.th{fill:#633806}.c-amber>.ts{fill:#854F0B}
  .c-coral>rect,.c-coral>circle,.c-coral>ellipse{fill:#FAECE7;stroke:#993C1D}
  .c-coral>.th{fill:#712B13}.c-coral>.ts{fill:#993C1D}
  .c-gray>rect,.c-gray>circle,.c-gray>ellipse{fill:#F1EFE8;stroke:#5F5E5A}
  .c-gray>.th{fill:#444441}.c-gray>.ts{fill:#5F5E5A}
  .c-green>rect,.c-green>circle,.c-green>ellipse{fill:#EAF3DE;stroke:#3B6D11}
  .c-green>.th{fill:#27500A}.c-green>.ts{fill:#3B6D11}
  .c-red>rect,.c-red>circle,.c-red>ellipse{fill:#FCEBEB;stroke:#A32D2D}
  .c-red>.th{fill:#791F1F}.c-red>.ts{fill:#A32D2D}
  @media(prefers-color-scheme:dark){
    :root{--b:rgba(224,225,226,.3);--bg2:#2A2A28;--s:#B0B0AD}
    .c-teal>rect,.c-teal>circle,.c-teal>ellipse{fill:#0B2E24;stroke:#2DB88A}
    .c-teal>.th{fill:#5DC9A3}.c-teal>.ts{fill:#2DB88A}
    .c-blue>rect,.c-blue>circle,.c-blue>ellipse{fill:#0D2640;stroke:#3A8CD0}
    .c-blue>.th{fill:#7AB8E8}.c-blue>.ts{fill:#3A8CD0}
    .c-purple>rect,.c-purple>circle,.c-purple>ellipse{fill:#1E1C3D;stroke:#7A70D0}
    .c-purple>.th{fill:#ADA5F0}.c-purple>.ts{fill:#7A70D0}
    .c-amber>rect,.c-amber>circle,.c-amber>ellipse{fill:#33230A;stroke:#C49020}
    .c-amber>.th{fill:#E0B850}.c-amber>.ts{fill:#C49020}
    .c-coral>rect,.c-coral>circle,.c-coral>ellipse{fill:#331510;stroke:#C05838}
    .c-coral>.th{fill:#E08868}.c-coral>.ts{fill:#C05838}
    .c-gray>rect,.c-gray>circle,.c-gray>ellipse{fill:#252523;stroke:#8E8D88}
    .c-gray>.th{fill:#B0B0AD}.c-gray>.ts{fill:#8E8D88}
    .c-green>rect,.c-green>circle,.c-green>ellipse{fill:#152D08;stroke:#5A9E20}
    .c-green>.th{fill:#80C040}.c-green>.ts{fill:#5A9E20}
    .c-red>rect,.c-red>circle,.c-red>ellipse{fill:#331212;stroke:#C04040}
    .c-red>.th{fill:#E07070}.c-red>.ts{fill:#C04040}
  }
</style>
```

## 规则

1. `<style>` 必须放在 `<defs>` 内，位于 `<marker>` 之前
2. `<svg>` 根元素必须包含 `xmlns="http://www.w3.org/2000/svg"`
3. 只包含本图使用的 `c-*` 色阶（最多 3 个），基础部分（font、变量、`.t`/`.ts`/`.th`）始终保留
4. 深色模式 `@media` 块中只需包含对应的 `c-*` 反转规则
