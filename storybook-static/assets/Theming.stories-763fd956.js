import{a as o,g as m,bq as k,j as n,B as y,b}from"./index-ce0e40fa.js";import"./index-93f6b7ae.js";import"./index-c197feae.js";const P={title:"UI/Theming",argTypes:{primary:{control:"color"},background:{control:"color"},text:{control:"color"},radius:{control:"text"},fontSizeMd:{control:"text"}}};function p(){const r=k(),u=(r==null?void 0:r.setTokens)||(()=>{}),t=(r==null?void 0:r.tokens)||{colors:{primary:"#2563eb",background:"#ffffff",text:"#111827"}},g=()=>{const x=t.colors.background==="#111827";u({...t,colors:x?{...t.colors,background:"#ffffff",text:"#111827",primary:"#2563eb"}:{...t.colors,background:"#111827",text:"#f8fafc",primary:"#7c3aed"}})};return n(y,{style:{padding:20,background:"var(--ui-color-background)",color:"var(--ui-color-text)"},children:[o("h3",{children:"Theme demo"}),n("p",{children:["Primary color token: ",o("strong",{style:{color:"var(--ui-color-primary)"},children:t.colors.primary})]}),o(b,{onClick:g,children:"Toggle theme"})]})}const e=(r={})=>o(m,{tokens:{colors:{primary:r.primary||"#2563eb",background:r.background||"#ffffff",text:r.text||"#111827"},radius:r.radius||"6px",typography:{size:{md:r.fontSizeMd||"14px"}}},children:o(p,{})});e.args={primary:"#2563eb",background:"#ffffff",text:"#111827",radius:"6px",fontSizeMd:"14px"};e.parameters={controls:{expanded:!0}};const a=()=>o(m,{children:o(p,{})});a.parameters={controls:{hideNoControlsWarning:!0}};var s,c,i;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`(args: any = {}) => <ThemeProvider tokens={{
  colors: {
    primary: args.primary || '#2563eb',
    background: args.background || '#ffffff',
    text: args.text || '#111827'
  },
  radius: args.radius || '6px',
  typography: {
    size: {
      md: args.fontSizeMd || '14px'
    }
  }
}}>
    <Demo />
  </ThemeProvider>`,...(i=(c=e.parameters)==null?void 0:c.docs)==null?void 0:i.source}}};var d,f,l;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`() => <ThemeProvider>
    <Demo />
  </ThemeProvider>`,...(l=(f=a.parameters)==null?void 0:f.docs)==null?void 0:l.source}}};const S=["Interactive","Default"];export{a as Default,e as Interactive,S as __namedExportsOrder,P as default};
