import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';

const ink = '#282b26';
const paper = '#f5f0e5';
const muted = '#a49d8e';
const orange = '#ee7652';
const mint = '#a8d8c8';
const lime = '#d9ec70';
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: ease};

const line = (x1:number,y1:number,x2:number,y2:number,color=ink,width=3) =>
  <path d={`M ${x1} ${y1} L ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round"/>;

const HandLabel:React.FC<{x:number;y:number;text:string;color?:string;size?:number;rotate?:number}> = ({x,y,text,color=ink,size=25,rotate=0}) =>
  <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <path d={`M -10 -26 Q 2 -34 14 -27 L ${text.length*size*.55+14} -27 Q ${text.length*size*.57+25} -14 ${text.length*size*.56+12} 5 L ${text.length*size*.56+5} 31 Q ${text.length*size*.3+1} 37 -10 28 Z`} fill="#fffdf7" stroke={ink} strokeWidth="2.5"/>
    <text x="3" y="5" fontSize={size} fontFamily="KaiTi, STKaiti, serif" fontWeight="700" fill={color}>{text}</text>
  </g>;

const TaskSheet:React.FC<{x:number;y:number;scale?:number;opacity?:number;accent?:string}> = ({x,y,scale=1,opacity=1,accent=orange}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
    <path d="M0 5 Q2 0 9 1 H118 L136 18 V150 Q134 157 127 156 H8 Q0 155 0 147 Z" fill="#fffdf6" stroke={ink} strokeWidth="3"/>
    <path d="M118 2 V20 H136" fill="#e8dfcf" stroke={ink} strokeWidth="2"/>
    <path d={`M17 32 H103 M17 47 H94 M17 62 H100`} stroke="#ddd4c4" strokeWidth="2" strokeLinecap="round"/>
    <rect x="17" y="77" width="101" height="48" rx="8" fill={accent} opacity=".15" stroke={accent} strokeWidth="2"/>
    <rect x="25" y="87" width="15" height="15" rx="3" fill={accent}/>
    <path d="M31 90 V100 M26 95 H36" stroke="#fffaf0" strokeWidth="2"/>
    <path d="M48 93 H103 M48 104 H90" stroke="#716b5f" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="105" cy="136" r="4" fill={accent}/>
  </g>
);

const Mascot:React.FC<{x:number;y:number;scale?:number;happy?:boolean}> = ({x,y,scale=1,happy=true}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={ink} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
    <path d="M16 16 L7 1 M84 16 L93 1" fill="none"/>
    <path d="M12 17 Q12 8 23 8 H77 Q88 8 88 19 V77 Q88 87 77 87 H23 Q12 87 12 77 Z" fill={orange}/>
    <ellipse cx="35" cy="40" rx="4" ry="7" fill={ink} stroke="none"/><ellipse cx="65" cy="40" rx="4" ry="7" fill={ink} stroke="none"/>
    <path d={happy?'M39 57 Q50 68 62 57':'M39 64 Q50 56 62 64'} fill="none" strokeWidth="3"/>
    <path d="M26 87 L22 101 M74 87 L78 101" fill="none" strokeWidth="5"/>
    <path d="M12 51 L0 62 M88 51 L100 38" fill="none" strokeWidth="5"/>
    <rect x="35" y="18" width="30" height="9" rx="4" fill="#f5b48d" stroke="none"/>
  </g>
);

const AgentNode:React.FC<{x:number;y:number;name:string;role:string;tint:string;reveal:number;active:boolean}> = ({x,y,name,role,tint,reveal,active}) => {
  const lift=interpolate(reveal,[0,1],[48,0],clamp);
  const alpha=interpolate(reveal,[0,1],[0,1],clamp);
  return <g transform={`translate(${x} ${y+lift})`} opacity={alpha}>
    <path d="M0 18 Q0 0 18 0 H286 Q304 0 304 18 V198 Q304 214 286 214 H18 Q0 214 0 198Z" fill="#fffdf7" stroke={active?tint:ink} strokeWidth={active?5:3}/>
    <path d="M0 20 Q0 2 19 2 H284 V67 H2Z" fill={tint} opacity=".25"/>
    <circle cx="45" cy="44" r="24" fill={tint} stroke={ink} strokeWidth="2.5"/>
    {role==='CTO'?<g stroke={ink} strokeWidth="3" fill="none"><path d="M35 45 L43 53 57 34"/><circle cx="46" cy="44" r="16"/></g>:<g stroke={ink} strokeWidth="2.5" fill="none"><path d="M35 49 Q42 36 49 49 Q56 35 63 49"/><path d="M38 38 H57"/></g>}
    <text x="82" y="40" fill={ink} fontSize="30" fontWeight="800" fontFamily="Segoe UI,Microsoft YaHei,sans-serif">{name}</text>
    <text x="82" y="61" fill="#777064" fontSize="17" fontFamily="Segoe UI,Microsoft YaHei,sans-serif" letterSpacing="2">{role==='CTO'?'BUILD / SHIP':'CONTENT / GROWTH'}</text>
    <rect x="26" y="92" width="251" height="75" rx="13" fill={tint} opacity=".12" stroke={tint} strokeWidth="2"/>
    {role==='CTO'?<g>{line(48,120,108,120,tint,6)}{line(48,141,151,141,'#d4cbbb',5)}{line(48,156,124,156,'#d4cbbb',5)}<circle cx="244" cy="128" r="19" fill="#fff" stroke={tint} strokeWidth="3"/><path d="M235 128 l6 6 12-14" fill="none" stroke={tint} strokeWidth="4"/></g>:<g><rect x="48" y="111" width="49" height="39" rx="8" fill="#fff" stroke={tint} strokeWidth="3"/><path d="M56 140 l12-13 9 7 11-16" fill="none" stroke={tint} strokeWidth="3"/><circle cx="241" cy="130" r="16" fill={lime}/><path d="M241 139 V120 M234 126 L241 119 248 126" fill="none" stroke={ink} strokeWidth="3"/></g>}
    <text x="25" y="196" fill="#777064" fontSize="15" fontFamily="Segoe UI,Microsoft YaHei,sans-serif">{role==='CTO'?'技术方案 · Agent 开发':'营销内容 · 客户触达'}</text>
  </g>;
};

export const AgentDispatch:React.FC = () => {
  const f=useCurrentFrame();
  const incoming=interpolate(f,[0,12,28,40],[0,1,1,0],clamp);
  const focus=interpolate(f,[32,47,61,81],[0,1,1,0],clamp);
  const cto=interpolate(f,[76,89,166,171],[0,1,1,1],clamp);
  const cmo=interpolate(f,[120,137,166,171],[0,1,1,1],clamp);
  const split=interpolate(f,[73,94,145],[0,1,1],clamp);
  const pan=0;
  const glow=0.2+Math.sin(f/7)*0.08;
  const routed=interpolate(f,[59,78],[0,1],clamp);

  return <svg viewBox="0 0 1920 1080" width="1920" height="1080" xmlns="http://www.w3.org/2000/svg" style={{background:paper,fontFamily:'Segoe UI,Microsoft YaHei,sans-serif'}}>
    <defs>
      <pattern id="papergrain" width="116" height="116" patternUnits="userSpaceOnUse"><circle cx="9" cy="17" r="1.2" fill="#aa9e83" opacity=".20"/><circle cx="63" cy="88" r=".9" fill="#b6a991" opacity=".18"/><path d="M28 45 l4 -1 M92 23 l3 1 M18 101 l5 -1" stroke="#a99c81" strokeWidth="1" opacity=".14"/></pattern>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="11" floodColor="#332d24" floodOpacity=".13"/></filter>
      <marker id="arrow" markerWidth="11" markerHeight="11" refX="8" refY="5.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L10 5.5 L0 11 Q3 5.5 0 0" fill={orange}/></marker>
      <marker id="arrowMint" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L9 5 L0 10" fill="none" stroke="#63aa91" strokeWidth="2"/></marker>
    </defs>
    <rect width="1920" height="1080" fill={paper}/><rect width="1920" height="1080" fill="url(#papergrain)"/>
    <path d="M22 38 Q20 28 34 28 H1884 Q1899 29 1898 43 V1018 Q1896 1034 1880 1034 H37 Q21 1032 22 1017Z" fill="#f9f5eb" stroke={ink} strokeWidth="3"/>
    <path d="M28 44 Q28 36 38 36 H1881 V1010 Q1878 1024 1865 1024 H39 Q30 1020 29 1011Z" fill="none" stroke="#898170" strokeWidth="1.5"/>
      <g transform="translate(0 0)">
      {/* Editor tools */}
      <path d="M54 95 Q53 77 70 77 H368 Q389 79 389 98 V578 Q385 594 369 594 H70 Q52 592 54 576Z" fill="#fffdf6" stroke={ink} strokeWidth="3"/>
      <g fontFamily="KaiTi,STKaiti,serif" fontWeight="700" fontSize="24" fill={ink}>
        <path d="M66 111 Q65 94 81 94 H170 V137 H67Z" fill="#f2d8af" stroke={ink} strokeWidth="2"/><text x="91" y="124">素材</text>
        <path d="M171 94 H263 V137 H171Z" fill="#fffdf6" stroke={ink} strokeWidth="2"/><text x="192" y="124">转场</text>
        <path d="M264 94 H365 V137 H264Z" fill="#fffdf6" stroke={ink} strokeWidth="2"/><text x="291" y="124">文字</text>
      </g>
      {['来件 · 需求','部门 · 角色','流程 · 规则','交付 · 结果'].map((t,i)=>{
        const y=159+i*94; const colors=['#f6dfac','#c9e5d8','#f0cbd0','#dad5ed'];
        return <g key={t}>
          <rect x="78" y={y} width="132" height="75" rx="12" fill={colors[i]} stroke={ink} strokeWidth="2.5"/>
          {i===0?<g><path d={`M119 ${y+25} H169 V${y+57} H119Z M119 ${y+25} L144 ${y+44} L169 ${y+25}`} fill="none" stroke={ink} strokeWidth="3"/></g>:i===1?<g><circle cx="144" cy={y+37} r="17" fill="none" stroke={ink} strokeWidth="3"/><path d={`M144 ${y+54} V${y+61} M130 ${y+61} H158`} stroke={ink} strokeWidth="3"/></g>:i===2?<g><path d={`M124 ${y+27} H156 L170 ${y+42} V${y+60} H124Z M155 ${y+27} V${y+43} H170`} fill="none" stroke={ink} strokeWidth="3"/><path d={`M130 ${y+49} H160`} stroke={ink} strokeWidth="2"/></g>:<g><path d={`M127 ${y+47} l11 11 24-27`} fill="none" stroke={ink} strokeWidth="4"/></g>}
          <text x="228" y={y+31} fill={ink} fontSize="18" fontWeight="700" fontFamily="Segoe UI,Microsoft YaHei,sans-serif">{t.split(' · ')[0]}</text>
          <text x="228" y={y+55} fill="#888171" fontSize="13">{t.split(' · ')[1]}</text>
        </g>;
      })}
      <path d="M84 549 H353" stroke="#d6cebd" strokeWidth="2" strokeDasharray="4 7"/>
      <text x="92" y="574" fill="#928978" fontSize="14" letterSpacing="2">拖入时间线 · 自动整理</text>

      {/* Main workspace */}
      <path d="M416 91 Q416 77 434 77 H1458 Q1473 80 1473 96 V588 Q1471 602 1456 602 H430 Q414 598 416 583Z" fill="#fffdf7" stroke={ink} strokeWidth="3"/>
      <path d="M418 130 H1471" stroke={ink} strokeWidth="2"/>
      <circle cx="446" cy="105" r="7" fill="#ee8e7a"/><circle cx="468" cy="105" r="7" fill="#efcd78"/><circle cx="490" cy="105" r="7" fill="#a7d6bb"/>
      <text x="532" y="113" fill="#736d60" fontSize="18" fontFamily="KaiTi,serif">一人公司_任务编排 · 剪辑预览</text>
      <rect x="1332" y="91" width="105" height="30" rx="13" fill="#eaf2cf"/><text x="1354" y="112" fill="#516530" fontSize="15" fontWeight="700">自动保存</text>

      {/* central preview glass */}
      <path d="M564 157 Q563 148 575 148 H1307 Q1317 149 1317 159 V542 Q1315 552 1305 552 H575 Q563 550 564 540Z" fill="#faf6ed" stroke="#c5bba7" strokeWidth="2"/>
      <path d="M583 176 H1298 V523 H583Z" fill="#f2ecdf" stroke={ink} strokeWidth="2.5"/>
      <path d="M596 189 H1286 V510 H596Z" fill="#faf7ef" stroke="#a79d8c" strokeWidth="1.5"/>
      <text x="623" y="224" fontSize="16" fill="#8c8475" letterSpacing="3">任务工作台  /  ROUTE 01</text>
      <path d="M624 240 H1258" stroke="#dad1c1" strokeWidth="1.5"/>

      {/* Incoming task + CEO routing flow */}
      <g opacity={incoming}>
        <path d="M622 267 Q622 256 634 256 H831 Q845 256 845 270 V371 Q842 383 830 383 H634 Q621 381 622 369Z" fill="#fffdf9" stroke={ink} strokeWidth="3" filter="url(#shadow)"/>
        <rect x="644" y="276" width="42" height="37" rx="9" fill="#ed7653"/><text x="653" y="301" fill="#fff9ed" fontSize="18" fontWeight="800">!</text>
        <text x="701" y="292" fill={ink} fontSize="23" fontWeight="800">新的任务来了</text>
        <text x="648" y="337" fill="#756d61" fontSize="18">整理客户访谈 · 输出执行方案</text>
        <path d="M650 354 H813" stroke="#e4dccf" strokeWidth="2"/>
        <circle cx="660" cy="369" r="5" fill="#a8d8c8"/><text x="675" y="375" fontSize="14" fill="#8e8677">已收到需求 · 等待分派</text>
      </g>
      <g opacity={interpolate(f,[26,41],[0,1],clamp)}>
        <path d="M841 320 C895 320 889 292 939 292 H985" fill="none" stroke="#6eaa91" strokeWidth="4" strokeDasharray="7 9" strokeDashoffset={interpolate(f,[26,55],[80,0],clamp)} markerEnd="url(#arrowMint)"/>
        <circle cx="934" cy="292" r="8" fill={lime} stroke={ink} strokeWidth="2"/>
      </g>
      <g transform="translate(970 180)">
        <path d="M0 22 Q0 3 19 3 H230 Q249 5 249 24 V147 Q246 166 229 166 H19 Q0 164 0 146Z" fill="#eaf3e9" stroke={ink} strokeWidth="3"/>
        <circle cx="40" cy="47" r="24" fill={orange} stroke={ink} strokeWidth="2.5"/>
        <path d="M29 48 q11 13 22 0" fill="none" stroke={ink} strokeWidth="3"/>
        <text x="77" y="46" fill={ink} fontSize="27" fontWeight="800">CEO Agent</text>
        <text x="25" y="94" fill="#716a5e" fontSize="18">读取需求 · 判断任务归属</text>
        <path d="M26 112 H220" stroke="#bacbbb" strokeWidth="2"/>
        <rect x="25" y="124" width="68" height="24" rx="11" fill="#c8e5d6"/><text x="40" y="142" fontSize="13" fill="#3e725e">分析中</text>
        <circle cx="217" cy="136" r="5" fill={orange} opacity={0.6+glow}/>
      </g>

      {/* decision focus ring */}
      <g opacity={focus}>
        <circle cx="1094" cy="333" r={interpolate(f,[32,55,81],[26,66,26],clamp)} fill="none" stroke={orange} strokeWidth="4" strokeDasharray="12 8"/>
        <path d="M1094 260 V242 M1167 333 H1185 M1094 405 V423 M1021 333 H1003" stroke={orange} strokeWidth="3" strokeLinecap="round"/>
        <path d="M1190 263 q19-27 39 0 q-20 22-39 0 M1209 258 V267" fill="none" stroke={orange} strokeWidth="3"/>
      </g>

      {/* branching connectors, drawn continuously */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1054 346 C1040 352 1016 352 1008 360" stroke="#ee7957" strokeWidth="5" strokeDasharray={68} strokeDashoffset={interpolate(f,[67,102],[68,0],clamp)} markerEnd="url(#arrow)" opacity={interpolate(f,[66,75],[0,1],clamp)}/>
        <path d="M1140 346 C1170 352 1285 352 1322 360" stroke="#5fae91" strokeWidth="5" strokeDasharray={196} strokeDashoffset={interpolate(f,[113,151],[196,0],clamp)} markerEnd="url(#arrowMint)" opacity={interpolate(f,[112,122],[0,1],clamp)}/>
      </g>
      <g opacity={split}>
        <circle cx="1037" cy="363" r="7" fill="#fffdf7" stroke={orange} strokeWidth="3"/><circle cx="1269" cy="366" r="7" fill="#fffdf7" stroke="#5fae91" strokeWidth="3"/>
      </g>
      <AgentNode x={856} y={360} name="CTO" role="CTO" tint="#ffac72" reveal={cto} active={f>87}/>
      <AgentNode x={1170} y={360} name="CMO" role="CMO" tint="#8fcebd" reveal={cmo} active={f>136}/>

      {/* Right inspector echoes the source editor's adjustment panel. */}
      <path d="M1501 94 Q1500 78 1516 78 H1850 Q1865 80 1865 96 V578 Q1863 594 1848 594 H1517 Q1501 591 1501 577Z" fill="#fffdf6" stroke={ink} strokeWidth="3"/>
      <text x="1531" y="124" fill={ink} fontSize="25" fontWeight="800" fontFamily="KaiTi,serif">Agent 面板</text>
      <rect x="1726" y="96" width="107" height="30" rx="14" fill="#e5efc7"/><circle cx="1744" cy="111" r="5" fill="#71934a"/><text x="1758" y="116" fill="#536b34" fontSize="13" fontWeight="800">协作路由</text>
      <path d="M1527 146 H1838" stroke="#d8d0c3" strokeWidth="2"/>
      <text x="1530" y="177" fill="#8b8374" fontSize="14" letterSpacing="2">任务拆解进度</text>
      <circle cx="1548" cy="214" r="14" fill="#d9ec70" stroke={ink} strokeWidth="2"/><path d="M1542 214 l5 5 9-11" fill="none" stroke={ink} strokeWidth="2.5"/><text x="1574" y="219" fill={ink} fontSize="18" fontWeight="700">CEO Agent</text><text x="1809" y="219" textAnchor="end" fill="#71824a" fontSize="14">已接收</text>
      <rect x="1530" y="238" width="302" height="7" rx="3.5" fill="#e7e0d3"/><rect x="1530" y="238" width="302" height="7" rx="3.5" fill="#b1ca69"/>
      <text x="1530" y="284" fill="#8b8374" fontSize="14" letterSpacing="2">执行端分配</text>
      <g><rect x="1529" y="301" width="305" height="92" rx="12" fill="#fff9f1" stroke="#e0c5af" strokeWidth="2"/><circle cx="1554" cy="329" r="11" fill="#eea36d"/><text x="1575" y="335" fill={ink} fontSize="19" fontWeight="800">CTO Agent</text><text x="1809" y="334" textAnchor="end" fill={f>90?'#c16f47':'#958b79'} fontSize="14">{f>90?'已派发':'待指派'}</text><rect x="1550" y="354" width="255" height="8" rx="4" fill="#ece5d9"/><rect x="1550" y="354" width={interpolate(f,[70,101],[24,255],clamp)} height="8" rx="4" fill="#ef9364"/></g>
      <g><rect x="1529" y="411" width="305" height="92" rx="12" fill="#f4faf6" stroke="#c1ded2" strokeWidth="2"/><circle cx="1554" cy="439" r="11" fill="#8fcebd"/><text x="1575" y="445" fill={ink} fontSize="19" fontWeight="800">CMO Agent</text><text x="1809" y="444" textAnchor="end" fill={f>136?'#498d75':'#958b79'} fontSize="14">{f>136?'已派发':'待指派'}</text><rect x="1550" y="464" width="255" height="8" rx="4" fill="#e2ece5"/><rect x="1550" y="464" width={interpolate(f,[111,144],[12,255],clamp)} height="8" rx="4" fill="#77bca1"/></g>
      <path d="M1530 532 H1833" stroke="#e1d9ca" strokeWidth="2" strokeDasharray="5 7"/><circle cx="1540" cy="558" r="5" fill={lime} stroke="#73834b" strokeWidth="1"/><text x="1556" y="564" fill="#756e62" fontSize="14">各负其责 · 保留交付节点</text>

      {/* Lower timeline */}
      <path d="M52 648 Q51 634 66 634 H1852 Q1868 635 1868 651 V940 Q1866 955 1851 955 H67 Q51 953 52 939Z" fill="#fffdf7" stroke={ink} strokeWidth="3"/>
      <text x="79" y="674" fill={ink} fontSize="22" fontWeight="800" fontFamily="KaiTi,serif">时间线 / 任务派发</text>
      <text x="1718" y="674" fill="#8b8373" fontSize="15" letterSpacing="2">00:00 ───────────────▶ 00:06</text>
      {Array.from({length:13},(_,i)=><g key={i}><path d={`M${292+i*118} 700 V${i%2===0?718:709}`} stroke="#756e62" strokeWidth="2"/><text x={280+i*118} y="696" fontSize="12" fill="#8f877a">{String(i*5).padStart(2,'0')}</text></g>)}
      <path d="M75 728 H1843" stroke="#d8d0c3" strokeWidth="2"/>
      <rect x="76" y="746" width="163" height="122" rx="9" fill="#f4ead7" stroke={ink} strokeWidth="2"/>
      <text x="95" y="778" fill="#777064" fontSize="16">素材库</text>
      <path d="M94 794 H215 M94 808 H198 M94 822 H208" stroke="#c8bdaa" strokeWidth="4" strokeLinecap="round"/>
      <rect x="96" y="837" width="99" height="20" rx="9" fill="#d9ec70"/><text x="106" y="852" fontSize="12" fill="#4e562f">4 项素材</text>

      <g opacity={incoming}>
        <rect x="274" y="744" width="311" height="111" rx="13" fill="#f6dfac" stroke={ink} strokeWidth="2.8"/>
        <path d="M274 775 Q274 758 291 758 H565 Q585 760 585 779 V800 H274Z" fill="#f2ce83"/>
        <text x="296" y="782" fontSize="17" fill={ink} fontWeight="800">1  新任务 · 等待接收</text>
        <path d="M300 817 H534 M300 834 H468" stroke="#a3957c" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="558" cy="831" r="11" fill={orange}/>
      </g>
      <rect x="614" y="744" width="273" height="111" rx="13" fill="#e2eedc" stroke={ink} strokeWidth="2.8" opacity={interpolate(f,[30,49],[0,1],clamp)}/>
      <path d="M614 775 Q614 758 631 758 H870 Q887 760 887 779 V800 H614Z" fill="#c5dfc2" opacity={interpolate(f,[30,49],[0,1],clamp)}/>
      <g opacity={interpolate(f,[30,49],[0,1],clamp)}><text x="635" y="782" fontSize="17" fill={ink} fontWeight="800">2  CEO · 判断归属</text><path d="M640 817 H827 M640 834 H783" stroke="#a7b9a4" strokeWidth="4" strokeLinecap="round"/></g>
      <rect x="916" y="744" width="303" height="111" rx="13" fill="#f8e1d1" stroke={ink} strokeWidth="2.8" opacity={cto}/>
      <path d="M916 775 Q916 758 933 758 H1202 Q1219 760 1219 779 V800 H916Z" fill="#f1c1a6" opacity={cto}/>
      <g opacity={cto}><text x="938" y="782" fontSize="17" fill={ink} fontWeight="800">3  CTO · 技术实施</text><path d="M941 817 H1172 M941 834 H1104" stroke="#caa993" strokeWidth="4" strokeLinecap="round"/></g>
      <rect x="1246" y="744" width="305" height="111" rx="13" fill="#dff0e8" stroke={ink} strokeWidth="2.8" opacity={cmo}/>
      <path d="M1246 775 Q1246 758 1263 758 H1534 Q1551 760 1551 779 V800 H1246Z" fill="#c3e1d4" opacity={cmo}/>
      <g opacity={cmo}><text x="1268" y="782" fontSize="17" fill={ink} fontWeight="800">4  CMO · 内容触达</text><path d="M1272 817 H1512 M1272 834 H1446" stroke="#a7c7b6" strokeWidth="4" strokeLinecap="round"/></g>
      <rect x="1581" y="744" width="251" height="111" rx="13" fill="#f4efe4" stroke="#968c7b" strokeWidth="2" strokeDasharray="7 6"/>
      <circle cx="1637" cy="800" r="22" fill="#fff" stroke="#9a907f" strokeWidth="2"/><path d="M1627 800 H1647 M1637 790 V810" stroke="#9a907f" strokeWidth="3"/>
      <text x="1672" y="796" fontSize="16" fill="#777064">下一步</text><text x="1672" y="819" fontSize="14" fill="#a29a8b">继续交付</text>

      {/* Cursor / mascot anchors the whole continuous shot */}
      <g transform={`translate(${interpolate(f,[0,41,89,136,171],[244,405,780,1203,1584],clamp)} ${interpolate(f,[0,38,88,136,171],[817,825,813,825,807],clamp)})`}>
        <path d="M0 0 C10 -47 18 -103 23 -145" fill="none" stroke={orange} strokeWidth="4" strokeDasharray="4 7"/>
        <Mascot x={-45} y={0} scale={0.62} happy={f<137}/>
        <circle cx="24" cy="-146" r="8" fill={orange} stroke="#fffdf7" strokeWidth="3"/>
      </g>
      <path d="M94 910 H1820" stroke="#ded6c8" strokeWidth="2"/>
      <path d="M94 912 H1820" stroke="#fff" strokeWidth="1"/>
      <text x="95" y="935" fontSize="14" fill="#928a7a" letterSpacing="2">像剪辑素材一样，任务逐格落到对应的执行人手上</text>
    </g>

    {/* Speech captions */}
    <g transform="translate(0 0)">
      <rect x="326" y="974" width="1268" height="70" rx="25" fill="#262923" opacity=".94"/>
      <path d="M357 974 Q357 964 367 964 H1550" stroke={lime} strokeWidth="4" strokeLinecap="round"/>
      {f<41?<g><text x="960" y="1020" textAnchor="middle" fill="#fffdf5" fontSize="34" fontWeight="700">然后每次一件事情下来了</text><path d="M789 1031 H1130" stroke={lime} strokeWidth="3" strokeLinecap="round"/></g>:f<85?<g><text x="960" y="1020" textAnchor="middle" fill="#fffdf5" fontSize="35" fontWeight="700">CEO 去看该谁做</text><path d="M815 1031 H1106" stroke={lime} strokeWidth="3" strokeLinecap="round"/></g>:f<136?<g><text x="960" y="1020" textAnchor="middle" fill="#fffdf5" fontSize="34" fontWeight="700">然后就发给相应的 CTO Agent</text><path d="M730 1031 H1190" stroke={lime} strokeWidth="3" strokeLinecap="round"/></g>:<g><text x="960" y="1020" textAnchor="middle" fill="#fffdf5" fontSize="35" fontWeight="700">或者 CMO Agent</text><path d="M814 1031 H1108" stroke={lime} strokeWidth="3" strokeLinecap="round"/></g>}
    </g>
    <text x="66" y="1020" fontSize="15" fill="#888071" letterSpacing="3">VIBE EDITOR  /  08—14</text>
    <text x="1687" y="1020" fontSize="15" fill="#888071" letterSpacing="3">FRAME  {String(f).padStart(3,'0')}</text>
  </svg>;
};
