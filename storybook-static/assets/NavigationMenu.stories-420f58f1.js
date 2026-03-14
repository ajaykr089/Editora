import{a8 as l,a as e,j as n,G as i,B}from"./index-c1b18327.js";import{R as z}from"./index-93f6b7ae.js";const C={title:"UI/NavigationMenu",component:l,argTypes:{selected:{control:"number"},orientation:{control:{type:"radio",options:["horizontal","vertical"]}},activation:{control:{type:"radio",options:["automatic","manual"]}},loop:{control:"boolean"},collapsible:{control:"boolean"}}};function c(t){return n(l,{...t,style:{maxWidth:860},children:[e("button",{slot:"item",children:"Overview"}),e("button",{slot:"item",children:"Components"}),e("button",{slot:"item",children:"Resources"}),e("section",{slot:"panel",children:n(i,{style:{display:"grid",gap:4},children:[e("strong",{children:"Overview"}),e("span",{style:{fontSize:13,color:"#475569"},children:"Roadmap, release notes, and workspace activity."})]})}),e("section",{slot:"panel",children:n(i,{style:{display:"grid",gap:6},children:[e("strong",{children:"Components"}),n("ul",{style:{margin:0,paddingLeft:18,color:"#475569",fontSize:13},children:[e("li",{children:"Combobox"}),e("li",{children:"Badge"}),e("li",{children:"Table"}),e("li",{children:"Context Menu"})]})]})}),e("section",{slot:"panel",children:n(i,{style:{display:"grid",gap:4},children:[e("strong",{children:"Resources"}),e("span",{style:{fontSize:13,color:"#475569"},children:"Developer docs, tokens, and Storybook examples."})]})})]})}const o=c;o.args={selected:0,orientation:"horizontal",activation:"automatic",loop:!0};const s=t=>e(c,{...t,activation:"manual"});s.args={selected:1};const r=t=>n(l,{...t,orientation:"vertical",style:{maxWidth:360},children:[e("button",{slot:"item",children:"Dashboard"}),e("button",{slot:"item",children:"Analytics"}),e("button",{slot:"item",children:"Billing"}),e("section",{slot:"panel",children:e("strong",{children:"Dashboard links"})}),e("section",{slot:"panel",children:e("strong",{children:"Analytics links"})}),e("section",{slot:"panel",children:e("strong",{children:"Billing links"})})]});r.args={selected:0};const a=()=>{const[t,M]=z.useState(0);return n(i,{style:{display:"grid",gap:10},children:[e(c,{selected:t,onSelect:k=>M(k)}),n(B,{style:{fontSize:13,color:"#475569"},children:["Selected index: ",t]})]})};var d,u,p;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:"ProductMenu",...(p=(u=o.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};var g,m,h;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:'(args: any) => <ProductMenu {...args} activation="manual" />',...(h=(m=s.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};var y,b,v;r.parameters={...r.parameters,docs:{...(y=r.parameters)==null?void 0:y.docs,source:{originalSource:`(args: any) => <NavigationMenu {...args} orientation="vertical" style={{
  maxWidth: 360
}}>
    <button slot="item">Dashboard</button>
    <button slot="item">Analytics</button>
    <button slot="item">Billing</button>

    <section slot="panel">
      <strong>Dashboard links</strong>
    </section>
    <section slot="panel">
      <strong>Analytics links</strong>
    </section>
    <section slot="panel">
      <strong>Billing links</strong>
    </section>
  </NavigationMenu>`,...(v=(b=r.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};var S,x,f;a.parameters={...a.parameters,docs:{...(S=a.parameters)==null?void 0:S.docs,source:{originalSource:`() => {
  const [selected, setSelected] = React.useState(0);
  return <Grid style={{
    display: 'grid',
    gap: 10
  }}>
      <ProductMenu selected={selected} onSelect={next => setSelected(next)} />
      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>Selected index: {selected}</Box>
    </Grid>;
}`,...(f=(x=a.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};const R=["Default","ManualActivation","Vertical","Controlled"];export{a as Controlled,o as Default,s as ManualActivation,r as Vertical,R as __namedExportsOrder,C as default};
