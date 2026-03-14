import{g as a,a as o,ap as h,j as n,B as x,b as y}from"./index-c1b18327.js";import"./index-93f6b7ae.js";const T={title:"UI/Theming",component:a,argTypes:{primary:{control:"color"},background:{control:"color"},text:{control:"color"},radius:{control:"text"},fontSizeMd:{control:"text"}}};function p(){const{tokens:r,setTokens:u}=h(),g=()=>{const f=r.colors.background==="#111827";u({...r,colors:f?{...r.colors,background:"#ffffff",text:"#111827",primary:"#2563eb"}:{...r.colors,background:"#111827",text:"#f8fafc",primary:"#7c3aed"}})};return n(x,{style:{padding:20,background:"var(--ui-color-background)",color:"var(--ui-color-text)"},children:[o("h3",{children:"Theme demo"}),n("p",{children:["Primary color token: ",o("strong",{style:{color:"var(--ui-color-primary)"},children:r.colors.primary})]}),o(y,{onClick:g,children:"Toggle theme"})]})}const e=r=>o(a,{tokens:{colors:{primary:r.primary,background:r.background,text:r.text},radius:r.radius,typography:{size:{md:r.fontSizeMd}}},children:o(p,{})});e.args={primary:"#2563eb",background:"#ffffff",text:"#111827",radius:"6px",fontSizeMd:"14px"};e.parameters={controls:{expanded:!0}};const t=()=>o(a,{children:o(p,{})});t.parameters={controls:{hideNoControlsWarning:!0}};var s,c,i;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`(args: any) => <ThemeProvider tokens={{
  colors: {
    primary: args.primary,
    background: args.background,
    text: args.text
  },
  radius: args.radius,
  typography: {
    size: {
      md: args.fontSizeMd
    }
  }
}}>
    <Demo />
  </ThemeProvider>`,...(i=(c=e.parameters)==null?void 0:c.docs)==null?void 0:i.source}}};var d,l,m;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`() => <ThemeProvider>
    <Demo />
  </ThemeProvider>`,...(m=(l=t.parameters)==null?void 0:l.docs)==null?void 0:m.source}}};const v=["Interactive","Default"];export{t as Default,e as Interactive,v as __namedExportsOrder,T as default};
