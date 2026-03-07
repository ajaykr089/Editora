import{ao as c,j as a,G as M,a as e,B as u}from"./index-c1b18327.js";import{R as j}from"./index-93f6b7ae.js";const $={title:"UI/Table",component:c,argTypes:{sortable:{control:"boolean"},selectable:{control:"boolean"},multiSelect:{control:"boolean"},striped:{control:"boolean"},hover:{control:"boolean"},compact:{control:"boolean"},bordered:{control:"boolean"},stickyHeader:{control:"boolean"},loading:{control:"boolean"}}},A=[{name:"Ava Johnson",role:"Designer",status:"Active",tasks:12,updated:"2026-02-15"},{name:"Liam Carter",role:"Engineer",status:"Review",tasks:7,updated:"2026-02-18"},{name:"Mia Chen",role:"Product",status:"Active",tasks:5,updated:"2026-02-17"},{name:"Noah Patel",role:"Ops",status:"Blocked",tasks:2,updated:"2026-02-12"},{name:"Emma Garcia",role:"QA",status:"Active",tasks:14,updated:"2026-02-19"}];function m(){return a("table",{children:[e("thead",{children:a("tr",{children:[e("th",{"data-key":"name",children:"Name"}),e("th",{"data-key":"role",children:"Role"}),e("th",{"data-key":"status",children:"Status"}),e("th",{"data-key":"tasks",children:"Open Tasks"}),e("th",{"data-key":"updated",children:"Last Updated"})]})}),e("tbody",{children:A.map(t=>a("tr",{children:[e("td",{children:t.name}),e("td",{children:t.role}),e("td",{children:t.status}),e("td",{children:t.tasks}),e("td",{children:t.updated})]},t.name))})]})}const p=t=>e(u,{style:{maxWidth:900},children:e(c,{...t,children:e(m,{})})}),r=p.bind({});r.args={striped:!0,hover:!0};const l=()=>{const[t,i]=j.useState("none");return a(M,{style:{display:"grid",gap:10,maxWidth:900},children:[e(c,{sortable:!0,striped:!0,onSortChange:s=>i(`${s.key} (${s.direction})`),children:e(m,{})}),a(u,{style:{fontSize:13,color:"#475569"},children:["Current sort: ",t]})]})},d=()=>{const[t,i]=j.useState([]);return a(M,{style:{display:"grid",gap:10,maxWidth:900},children:[e(c,{selectable:!0,multiSelect:!0,striped:!0,hover:!0,onRowSelect:s=>i(s.indices),children:e(m,{})}),a(u,{style:{fontSize:13,color:"#475569"},children:["Selected row indices: ",t.length?t.join(", "):"none"]})]})},o=p.bind({});o.args={compact:!0,bordered:!0};const n=p.bind({});n.args={loading:!0,striped:!0};var h,b,S;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`(args: any) => <Box style={{
  maxWidth: 900
}}>
    <Table {...args}>
      <TeamMarkup />
    </Table>
  </Box>`,...(S=(b=r.parameters)==null?void 0:b.docs)==null?void 0:S.source}}};var g,y,k;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`() => {
  const [sort, setSort] = React.useState('none');
  return <Grid style={{
    display: 'grid',
    gap: 10,
    maxWidth: 900
  }}>
      <Table sortable striped onSortChange={detail => setSort(\`\${detail.key} (\${detail.direction})\`)}>
        <TeamMarkup />
      </Table>
      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>Current sort: {sort}</Box>
    </Grid>;
}`,...(k=(y=l.parameters)==null?void 0:y.docs)==null?void 0:k.source}}};var x,T,B;d.parameters={...d.parameters,docs:{...(x=d.parameters)==null?void 0:x.docs,source:{originalSource:`() => {
  const [selection, setSelection] = React.useState<number[]>([]);
  return <Grid style={{
    display: 'grid',
    gap: 10,
    maxWidth: 900
  }}>
      <Table selectable multiSelect striped hover onRowSelect={detail => setSelection(detail.indices)}>
        <TeamMarkup />
      </Table>
      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>
        Selected row indices: {selection.length ? selection.join(', ') : 'none'}
      </Box>
    </Grid>;
}`,...(B=(T=d.parameters)==null?void 0:T.docs)==null?void 0:B.source}}};var R,f,v;o.parameters={...o.parameters,docs:{...(R=o.parameters)==null?void 0:R.docs,source:{originalSource:`(args: any) => <Box style={{
  maxWidth: 900
}}>
    <Table {...args}>
      <TeamMarkup />
    </Table>
  </Box>`,...(v=(f=o.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};var C,W,G;n.parameters={...n.parameters,docs:{...(C=n.parameters)==null?void 0:C.docs,source:{originalSource:`(args: any) => <Box style={{
  maxWidth: 900
}}>
    <Table {...args}>
      <TeamMarkup />
    </Table>
  </Box>`,...(G=(W=n.parameters)==null?void 0:W.docs)==null?void 0:G.source}}};const w=["Default","Sortable","SelectableRows","CompactBordered","LoadingState"];export{o as CompactBordered,r as Default,n as LoadingState,d as SelectableRows,l as Sortable,w as __namedExportsOrder,$ as default};
