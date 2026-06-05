# 完整示例代码

## 目录
1. [时序图 — 6 参与者](#时序图)
2. [流程图 — 垂直 + 分支](#流程图)
3. [结构图 — 双层嵌套](#结构图)

---

## 时序图

场景：视频上传 → 审核 → 转码完整流程（6 参与者）

参与者中心 x：50 / 160 / 282 / 390 / 505 / 621
盒子宽 90，起始 x = 中心 x - 45

```xml
<svg width="100%" viewBox="0 0 680 560" role="img"
  xmlns="http://www.w3.org/2000/svg">
  <title>视频处理时序图</title>
  <desc>从上传到转码完成的完整消息交互时序</desc>
  <defs>
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
      }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <!-- 参与者头部 -->
  <g class="c-teal"><rect x="5" y="20" width="90" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="50" y="40" text-anchor="middle" dominant-baseline="central">上传者</text></g>
  <g class="c-purple"><rect x="115" y="20" width="90" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="160" y="40" text-anchor="middle" dominant-baseline="central">审核员</text></g>
  <g class="c-blue"><rect x="233" y="20" width="98" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="282" y="40" text-anchor="middle" dominant-baseline="central">video 表</text></g>
  <g class="c-amber"><rect x="345" y="20" width="90" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="390" y="40" text-anchor="middle" dominant-baseline="central">TMS</text></g>
  <g class="c-coral"><rect x="455" y="20" width="100" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="505" y="40" text-anchor="middle" dominant-baseline="central">task 表</text></g>
  <g class="c-gray"><rect x="571" y="20" width="100" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="621" y="40" text-anchor="middle" dominant-baseline="central">IMM 服务</text></g>

  <!-- 生命线 -->
  <line x1="50"  y1="60" x2="50"  y2="510" stroke="var(--b)" stroke-width="0.5" stroke-dasharray="4 3"/>
  <line x1="160" y1="60" x2="160" y2="510" stroke="var(--b)" stroke-width="0.5" stroke-dasharray="4 3"/>
  <line x1="282" y1="60" x2="282" y2="510" stroke="var(--b)" stroke-width="0.5" stroke-dasharray="4 3"/>
  <line x1="390" y1="60" x2="390" y2="510" stroke="var(--b)" stroke-width="0.5" stroke-dasharray="4 3"/>
  <line x1="505" y1="60" x2="505" y2="510" stroke="var(--b)" stroke-width="0.5" stroke-dasharray="4 3"/>
  <line x1="621" y1="60" x2="621" y2="510" stroke="var(--b)" stroke-width="0.5" stroke-dasharray="4 3"/>

  <!-- ① 上传 -->
  <rect x="28" y="76" width="630" height="52" rx="4" fill="var(--bg2)" opacity="0.5"/>
  <text class="ts" x="36" y="92" fill="var(--s)">① 上传文件</text>
  <line x1="50" y1="112" x2="270" y2="112" stroke="#1D9E75" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="160" y="106" text-anchor="middle">上传视频</text>

  <!-- ② 审核 -->
  <rect x="28" y="144" width="630" height="90" rx="4" fill="var(--bg2)" opacity="0.5"/>
  <text class="ts" x="36" y="160" fill="var(--s)">② 审核</text>
  <line x1="160" y1="176" x2="270" y2="176" stroke="#534AB7" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="215" y="170" text-anchor="middle">读取视频</text>
  <line x1="270" y1="196" x2="172" y2="196" stroke="#888780" stroke-width="1" stroke-dasharray="5 3" marker-end="url(#arrow)"/>
  <text class="ts" x="215" y="190" text-anchor="middle">返回数据</text>
  <line x1="160" y1="218" x2="270" y2="218" stroke="#534AB7" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="215" y="212" text-anchor="middle">写审核日志</text>

  <!-- ③ 同步 TMS -->
  <rect x="28" y="250" width="630" height="68" rx="4" fill="var(--bg2)" opacity="0.5"/>
  <text class="ts" x="36" y="266" fill="var(--s)">③ Completion 同步</text>
  <line x1="50" y1="282" x2="270" y2="282" stroke="#BA7517" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="160" y="276" text-anchor="middle">读取视频数据</text>
  <line x1="50" y1="302" x2="378" y2="302" stroke="#BA7517" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="214" y="296" text-anchor="middle">同步到 TMS</text>

  <!-- ④ 发起转码 -->
  <rect x="28" y="334" width="630" height="68" rx="4" fill="var(--bg2)" opacity="0.5"/>
  <text class="ts" x="36" y="350" fill="var(--s)">④ 发起 IMM 转码</text>
  <line x1="390" y1="366" x2="493" y2="366" stroke="#993C1D" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="441" y="360" text-anchor="middle">写入转码任务</text>
  <line x1="390" y1="386" x2="609" y2="386" stroke="#993C1D" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="500" y="380" text-anchor="middle">发起转码请求</text>

  <!-- ⑤ 定时回写 -->
  <rect x="28" y="418" width="630" height="80" rx="4" fill="var(--bg2)" opacity="0.5"/>
  <text class="ts" x="36" y="434" fill="var(--s)">⑤ 定时任务回写</text>
  <line x1="50" y1="450" x2="609" y2="450" stroke="#888780" stroke-width="1" stroke-dasharray="5 3" marker-end="url(#arrow)"/>
  <text class="ts" x="330" y="444" text-anchor="middle">拉取转码结果</text>
  <line x1="50" y1="470" x2="493" y2="470" stroke="#993C1D" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text class="ts" x="272" y="464" text-anchor="middle">回写任务 + 视频状态</text>

  <!-- 底部参与者（与顶部相同） -->
  <g class="c-teal"><rect x="5" y="518" width="90" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="50" y="538" text-anchor="middle" dominant-baseline="central">上传者</text></g>
  <g class="c-purple"><rect x="115" y="518" width="90" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="160" y="538" text-anchor="middle" dominant-baseline="central">审核员</text></g>
  <g class="c-blue"><rect x="233" y="518" width="98" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="282" y="538" text-anchor="middle" dominant-baseline="central">video 表</text></g>
  <g class="c-amber"><rect x="345" y="518" width="90" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="390" y="538" text-anchor="middle" dominant-baseline="central">TMS</text></g>
  <g class="c-coral"><rect x="455" y="518" width="100" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="505" y="538" text-anchor="middle" dominant-baseline="central">task 表</text></g>
  <g class="c-gray"><rect x="571" y="518" width="100" height="40" rx="6" stroke-width="0.5"/>
    <text class="th" x="621" y="538" text-anchor="middle" dominant-baseline="central">IMM 服务</text></g>
</svg>
```

---

## 流程图

场景：审批流程（含拒绝回流）

节点宽 135，间距 20，4 节点总宽 = 4×135+3×20 = 600，起始 x = 40

```xml
<svg width="100%" viewBox="0 0 680 280" role="img"
  xmlns="http://www.w3.org/2000/svg">
  <title>审批流程图</title>
  <desc>提交申请经审核、决策到通知用户，拒绝时退回修改</desc>
  <defs>
    <style>
      svg{font-family:"Anthropic Sans",-apple-system,system-ui,"Segoe UI",sans-serif}
      :root{--b:rgba(31,30,29,.3);--bg2:#F5F4ED;--s:#3D3D3A}
      .t{font-size:16px;font-weight:400;fill:var(--s)}
      .ts{font-size:12px;font-weight:400;fill:var(--s)}
      .th{font-size:14px;font-weight:500}
      .c-teal>rect,.c-teal>circle,.c-teal>ellipse{fill:#E1F5EE;stroke:#0F6E56}
      .c-teal>.th{fill:#085041}.c-teal>.ts{fill:#0F6E56}
      .c-purple>rect,.c-purple>circle,.c-purple>ellipse{fill:#EEEDFE;stroke:#534AB7}
      .c-purple>.th{fill:#3C3489}.c-purple>.ts{fill:#534AB7}
      .c-amber>rect,.c-amber>circle,.c-amber>ellipse{fill:#FAEEDA;stroke:#854F0B}
      .c-amber>.th{fill:#633806}.c-amber>.ts{fill:#854F0B}
      .c-green>rect,.c-green>circle,.c-green>ellipse{fill:#EAF3DE;stroke:#3B6D11}
      .c-green>.th{fill:#27500A}.c-green>.ts{fill:#3B6D11}
      @media(prefers-color-scheme:dark){
        :root{--b:rgba(224,225,226,.3);--bg2:#2A2A28;--s:#B0B0AD}
        .c-teal>rect,.c-teal>circle,.c-teal>ellipse{fill:#0B2E24;stroke:#2DB88A}
        .c-teal>.th{fill:#5DC9A3}.c-teal>.ts{fill:#2DB88A}
        .c-purple>rect,.c-purple>circle,.c-purple>ellipse{fill:#1E1C3D;stroke:#7A70D0}
        .c-purple>.th{fill:#ADA5F0}.c-purple>.ts{fill:#7A70D0}
        .c-amber>rect,.c-amber>circle,.c-amber>ellipse{fill:#33230A;stroke:#C49020}
        .c-amber>.th{fill:#E0B850}.c-amber>.ts{fill:#C49020}
        .c-green>rect,.c-green>circle,.c-green>ellipse{fill:#152D08;stroke:#5A9E20}
        .c-green>.th{fill:#80C040}.c-green>.ts{fill:#5A9E20}
      }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <!-- 4 个节点，宽 135，间距 20，起始 x=40 -->
  <g class="c-teal">
    <rect x="40" y="60" width="135" height="56" rx="8" stroke-width="0.5"/>
    <text class="th" x="107" y="79" text-anchor="middle" dominant-baseline="central">提交申请</text>
    <text class="ts" x="107" y="98" text-anchor="middle" dominant-baseline="central">用户填写表单</text>
  </g>
  <g class="c-purple">
    <rect x="195" y="60" width="135" height="56" rx="8" stroke-width="0.5"/>
    <text class="th" x="262" y="79" text-anchor="middle" dominant-baseline="central">审核材料</text>
    <text class="ts" x="262" y="98" text-anchor="middle" dominant-baseline="central">审核员核查</text>
  </g>
  <g class="c-amber">
    <rect x="350" y="60" width="135" height="56" rx="8" stroke-width="0.5"/>
    <text class="th" x="417" y="79" text-anchor="middle" dominant-baseline="central">决策</text>
    <text class="ts" x="417" y="98" text-anchor="middle" dominant-baseline="central">通过 / 拒绝</text>
  </g>
  <g class="c-green">
    <rect x="505" y="60" width="135" height="56" rx="8" stroke-width="0.5"/>
    <text class="th" x="572" y="79" text-anchor="middle" dominant-baseline="central">通知用户</text>
    <text class="ts" x="572" y="98" text-anchor="middle" dominant-baseline="central">发送结果通知</text>
  </g>

  <!-- 正向连线 -->
  <line x1="175" y1="88" x2="193" y2="88" stroke="#1D9E75" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="330" y1="88" x2="348" y2="88" stroke="#534AB7" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="485" y1="88" x2="503" y2="88" stroke="#BA7517" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- 拒绝回流（L 形绕过所有节点下方） -->
  <path d="M 417 116 L 417 170 L 107 170 L 107 116"
    fill="none" stroke="#E24B4A" stroke-width="1"
    stroke-dasharray="5 3" marker-end="url(#arrow)"/>
  <text class="ts" x="262" y="190" text-anchor="middle">拒绝，退回重填</text>
</svg>
```

---

## 结构图

场景：微服务系统（外层 API 网关，内层两个服务 + 数据库）

```xml
<svg width="100%" viewBox="0 0 680 320" role="img"
  xmlns="http://www.w3.org/2000/svg">
  <title>微服务架构结构图</title>
  <desc>API 网关下包含用户服务和订单服务，各自连接独立数据库</desc>
  <defs>
    <style>
      svg{font-family:"Anthropic Sans",-apple-system,system-ui,"Segoe UI",sans-serif}
      :root{--b:rgba(31,30,29,.3);--bg2:#F5F4ED;--s:#3D3D3A}
      .t{font-size:16px;font-weight:400;fill:var(--s)}
      .ts{font-size:12px;font-weight:400;fill:var(--s)}
      .th{font-size:14px;font-weight:500}
      .c-blue>rect,.c-blue>circle,.c-blue>ellipse{fill:#E6F1FB;stroke:#185FA5}
      .c-blue>.th{fill:#0C447C}.c-blue>.ts{fill:#185FA5}
      .c-teal>rect,.c-teal>circle,.c-teal>ellipse{fill:#E1F5EE;stroke:#0F6E56}
      .c-teal>.th{fill:#085041}.c-teal>.ts{fill:#0F6E56}
      .c-coral>rect,.c-coral>circle,.c-coral>ellipse{fill:#FAECE7;stroke:#993C1D}
      .c-coral>.th{fill:#712B13}.c-coral>.ts{fill:#993C1D}
      .c-gray>rect,.c-gray>circle,.c-gray>ellipse{fill:#F1EFE8;stroke:#5F5E5A}
      .c-gray>.th{fill:#444441}.c-gray>.ts{fill:#5F5E5A}
      @media(prefers-color-scheme:dark){
        :root{--b:rgba(224,225,226,.3);--bg2:#2A2A28;--s:#B0B0AD}
        .c-blue>rect,.c-blue>circle,.c-blue>ellipse{fill:#0D2640;stroke:#3A8CD0}
        .c-blue>.th{fill:#7AB8E8}.c-blue>.ts{fill:#3A8CD0}
        .c-teal>rect,.c-teal>circle,.c-teal>ellipse{fill:#0B2E24;stroke:#2DB88A}
        .c-teal>.th{fill:#5DC9A3}.c-teal>.ts{fill:#2DB88A}
        .c-coral>rect,.c-coral>circle,.c-coral>ellipse{fill:#331510;stroke:#C05838}
        .c-coral>.th{fill:#E08868}.c-coral>.ts{fill:#C05838}
        .c-gray>rect,.c-gray>circle,.c-gray>ellipse{fill:#252523;stroke:#8E8D88}
        .c-gray>.th{fill:#B0B0AD}.c-gray>.ts{fill:#8E8D88}
      }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <!-- 外层容器（c-blue） -->
  <g class="c-blue">
    <rect x="60" y="20" width="580" height="270" rx="20" stroke-width="0.5"/>
    <text class="th" x="350" y="50" text-anchor="middle" dominant-baseline="central">后端系统</text>
  </g>

  <!-- 内层：用户服务（c-teal，不同色阶） -->
  <g class="c-teal">
    <rect x="90" y="74" width="220" height="80" rx="8" stroke-width="0.5"/>
    <text class="th" x="200" y="106" text-anchor="middle" dominant-baseline="central">用户服务</text>
    <text class="ts" x="200" y="126" text-anchor="middle" dominant-baseline="central">注册、登录、鉴权</text>
  </g>

  <!-- 内层：订单服务（c-coral，不同色阶） -->
  <g class="c-coral">
    <rect x="330" y="74" width="290" height="80" rx="8" stroke-width="0.5"/>
    <text class="th" x="475" y="106" text-anchor="middle" dominant-baseline="central">订单服务</text>
    <text class="ts" x="475" y="126" text-anchor="middle" dominant-baseline="central">创建、查询、支付</text>
  </g>

  <!-- 数据库（c-gray） -->
  <g class="c-gray">
    <rect x="90" y="194" width="220" height="74" rx="8" stroke-width="0.5"/>
    <text class="th" x="200" y="224" text-anchor="middle" dominant-baseline="central">用户 DB</text>
    <text class="ts" x="200" y="244" text-anchor="middle" dominant-baseline="central">PostgreSQL</text>
  </g>
  <g class="c-gray">
    <rect x="330" y="194" width="290" height="74" rx="8" stroke-width="0.5"/>
    <text class="th" x="475" y="224" text-anchor="middle" dominant-baseline="central">订单 DB</text>
    <text class="ts" x="475" y="244" text-anchor="middle" dominant-baseline="central">MySQL</text>
  </g>

  <!-- 服务到 DB 的连线 -->
  <line x1="200" y1="154" x2="200" y2="192" stroke="#888780" stroke-width="1" marker-end="url(#arrow)"/>
  <line x1="475" y1="154" x2="475" y2="192" stroke="#888780" stroke-width="1" marker-end="url(#arrow)"/>

  <!-- 外部输入（客户端） -->
  <text class="ts" x="22" y="118" text-anchor="middle">客户端</text>
  <line x1="42" y1="114" x2="58" y2="114" stroke="#888780" stroke-width="1.5" marker-end="url(#arrow)"/>
</svg>
```