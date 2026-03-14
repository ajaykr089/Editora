import{bw as s,j as l,G as y,a as e,bv as t,B as u}from"./index-ce0e40fa.js";import{R as S}from"./index-93f6b7ae.js";import"./index-c197feae.js";const B={title:"UI/ToggleGroup",component:s,argTypes:{multiple:{control:"boolean"},orientation:{control:"select",options:["horizontal","vertical"]},variant:{control:"select",options:["default","soft","contrast","minimal"]},activation:{control:"select",options:["auto","manual"]}}},r=()=>{const[a,g]=S.useState("left");return l(y,{gap:"12px",style:{maxWidth:520},children:[l(s,{value:a,orientation:"horizontal",variant:"soft",onValueChange:n=>{typeof n.value=="string"&&g(n.value)},children:[e(t,{value:"left",children:"Left"}),e(t,{value:"center",children:"Center"}),e(t,{value:"right",children:"Right"})]}),l(u,{style:{fontSize:13,color:"#475569"},children:["Alignment: ",e("strong",{children:a})]})]})},o=()=>{const[a,g]=S.useState(["bold"]);return l(y,{gap:"12px",style:{maxWidth:560},children:[l(s,{multiple:!0,value:a,variant:"default",onValueChange:n=>{Array.isArray(n.value)&&g(n.value)},children:[e(t,{value:"bold",children:"Bold"}),e(t,{value:"italic",children:"Italic"}),e(t,{value:"underline",children:"Underline"}),e(t,{value:"strike",children:"Strike"})]}),l(u,{style:{fontSize:13,color:"#475569"},children:["Active styles: ",e("strong",{children:a.join(", ")||"none"})]})]})},i=()=>e(u,{variant:"contrast",p:"12px",radius:"lg",style:{maxWidth:280},children:l(s,{orientation:"vertical",variant:"contrast",multiple:!0,value:["overview","alerts"],children:[e(t,{value:"overview",children:"Overview"}),e(t,{value:"analytics",children:"Analytics"}),e(t,{value:"alerts",children:"Alerts"}),e(t,{value:"settings",children:"Settings"})]})});var c,v,d;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`() => {
  const [value, setValue] = React.useState('left');
  return <Grid gap="12px" style={{
    maxWidth: 520
  }}>
      <ToggleGroup value={value} orientation="horizontal" variant="soft" onValueChange={detail => {
      if (typeof detail.value === 'string') setValue(detail.value);
    }}>
        <Toggle value="left">Left</Toggle>
        <Toggle value="center">Center</Toggle>
        <Toggle value="right">Right</Toggle>
      </ToggleGroup>

      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>Alignment: <strong>{value}</strong></Box>
    </Grid>;
}`,...(d=(v=r.parameters)==null?void 0:v.docs)==null?void 0:d.source}}};var p,h,m;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`() => {
  const [value, setValue] = React.useState<string[]>(['bold']);
  return <Grid gap="12px" style={{
    maxWidth: 560
  }}>
      <ToggleGroup multiple value={value} variant="default" onValueChange={detail => {
      if (Array.isArray(detail.value)) setValue(detail.value);
    }}>
        <Toggle value="bold">Bold</Toggle>
        <Toggle value="italic">Italic</Toggle>
        <Toggle value="underline">Underline</Toggle>
        <Toggle value="strike">Strike</Toggle>
      </ToggleGroup>

      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>
        Active styles: <strong>{value.join(', ') || 'none'}</strong>
      </Box>
    </Grid>;
}`,...(m=(h=o.parameters)==null?void 0:h.docs)==null?void 0:m.source}}};var T,f,x;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`() => <Box variant="contrast" p="12px" radius="lg" style={{
  maxWidth: 280
}}>
    <ToggleGroup orientation="vertical" variant="contrast" multiple value={["overview", "alerts"]}>
      <Toggle value="overview">Overview</Toggle>
      <Toggle value="analytics">Analytics</Toggle>
      <Toggle value="alerts">Alerts</Toggle>
      <Toggle value="settings">Settings</Toggle>
    </ToggleGroup>
  </Box>`,...(x=(f=i.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};const C=["SingleSelect","MultipleSelect","VerticalContrast"];export{o as MultipleSelect,r as SingleSelect,i as VerticalContrast,C as __namedExportsOrder,B as default};
