import{k as s,a as e,G as r,j as n,M as k,N as B,O as w,P as W,B as t,F as E}from"./index-ce0e40fa.js";import{R as m}from"./index-93f6b7ae.js";import{H as P,F,S as L,b as R,d as T}from"./icons-b73c9b18.js";import"./index-c197feae.js";const U={title:"UI/Breadcrumb",component:s,args:{separator:"/",maxItems:6,currentIndex:3,size:"md",variant:"surface",tone:"neutral",radius:"md",elevation:"none",state:"idle",disabled:!1},argTypes:{separator:{control:"text"},maxItems:{control:{type:"number",min:3,max:10,step:1}},currentIndex:{control:{type:"number",min:0,max:10,step:1}},size:{control:"select",options:["sm","md","lg","1","2","3"]},variant:{control:"select",options:["surface","soft","solid","outline","ghost","minimal"]},tone:{control:"select",options:["neutral","info","success","warning","danger"]},radius:{control:"text"},elevation:{control:"select",options:["none","low","high"]},state:{control:"select",options:["idle","loading","error","success"]},disabled:{control:"boolean"}}},u=["Workspace","Programs","Spring release","Governance","Audit logs"],l={render:a=>e(r,{style:{gap:16,maxInlineSize:860},children:n(k,{radius:16,children:[n(B,{children:[e(w,{children:"Breadcrumb"}),e(W,{children:"Hierarchical navigation with collapse logic, keyboard support, and theme-backed visual variants."})]}),n(t,{slot:"inset",style:{padding:16,display:"grid",gap:12},children:[n(s,{...a,ariaLabel:"Release navigation",children:[n("span",{slot:"item",children:[e(P,{size:13,style:{marginInlineEnd:4}}),"Workspace"]}),n("span",{slot:"item",children:[e(F,{size:13,style:{marginInlineEnd:4}}),"Programs"]}),e("span",{slot:"item",children:"Spring release"}),e("span",{slot:"item",children:"Governance"}),e("span",{slot:"item",children:"Audit logs"})]}),e(t,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:"Uses the real breadcrumb API: `variant`, `size`, `radius`, `elevation`, `tone`, `state`, and `onSelect`."})]})]})})},o={render:()=>e(r,{style:{gap:14,maxInlineSize:920},children:[{label:"Surface",variant:"surface",tone:"neutral"},{label:"Soft",variant:"soft",tone:"info"},{label:"Solid",variant:"solid",tone:"success"},{label:"Outline",variant:"outline",tone:"warning"},{label:"Ghost",variant:"ghost",tone:"danger"},{label:"Minimal",variant:"minimal",tone:"neutral"}].map(a=>n(r,{style:{gap:8},children:[e(t,{style:{fontSize:13,fontWeight:600,color:"var(--ui-color-muted, #64748b)"},children:a.label}),n(s,{separator:"/",currentIndex:3,variant:a.variant,tone:a.tone,radius:a.variant==="ghost"?"none":"md",elevation:a.variant==="solid"?"low":"none",children:[e("span",{slot:"item",children:"Workspace"}),e("span",{slot:"item",children:"Programs"}),e("span",{slot:"item",children:"Governance"}),e("span",{slot:"item",children:"Audit logs"})]})]},a.label))})},d={render:()=>e(r,{style:{gap:14,maxInlineSize:860},children:[{label:"Small",size:"sm"},{label:"Medium",size:"md"},{label:"Large",size:"lg"}].map(a=>n(r,{style:{gap:8},children:[e(t,{style:{fontSize:13,fontWeight:600,color:"var(--ui-color-muted, #64748b)"},children:a.label}),n(s,{separator:"/",currentIndex:3,size:a.size,variant:"surface",tone:"info",radius:12,children:[e("span",{slot:"item",children:"Workspace"}),e("span",{slot:"item",children:"Programs"}),e("span",{slot:"item",children:"Governance"}),e("span",{slot:"item",children:"Audit logs"})]})]},a.label))})},c={render:()=>{const[a,A]=m.useState(3),[i,H]=m.useState("idle");return e(r,{style:{gap:16,maxInlineSize:980},children:n(k,{radius:18,variant:"soft",tone:"info",children:[n(B,{children:[e(w,{children:"Governance review trail"}),e(W,{children:"Collapsed breadcrumb for deep navigation paths with state feedback and keyboard-friendly selection."})]}),n(t,{slot:"inset",style:{padding:16,display:"grid",gap:14},children:[n(s,{separator:"/",maxItems:5,currentIndex:a,variant:"soft",tone:i==="error"?"danger":i==="success"?"success":"info",state:i,radius:12,elevation:"low",ariaLabel:"Governance review trail",onSelect:p=>{A(p.index),H(p.index===u.length-1?"success":"idle")},children:[n("span",{slot:"item",children:[e(P,{size:13,style:{marginInlineEnd:4}}),"Workspace"]}),e("span",{slot:"item",children:"Programs"}),e("span",{slot:"item",children:"Spring release"}),e("span",{slot:"item",children:"Governance"}),n("span",{slot:"item",children:[e(L,{size:13,style:{marginInlineEnd:4}}),"Audit logs"]})]}),e(E,{align:"center",style:{gap:10,flexWrap:"wrap",color:"var(--ui-color-muted, #64748b)",fontSize:13},children:n("span",{style:{display:"inline-flex",alignItems:"center",gap:6},children:[i==="success"?e(R,{size:14}):e(T,{size:14}),"Active step: ",u[a]]})})]})]})})}};var g,v,h;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: args => <Grid style={{
    gap: 16,
    maxInlineSize: 860
  }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>Breadcrumb</CardTitle>
          <CardDescription>
            Hierarchical navigation with collapse logic, keyboard support, and theme-backed visual variants.
          </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{
        padding: 16,
        display: 'grid',
        gap: 12
      }}>
          <Breadcrumb {...args} ariaLabel="Release navigation">
            <span slot="item">
              <HomeIcon size={13} style={{
              marginInlineEnd: 4
            }} />
              Workspace
            </span>
            <span slot="item">
              <FolderIcon size={13} style={{
              marginInlineEnd: 4
            }} />
              Programs
            </span>
            <span slot="item">Spring release</span>
            <span slot="item">Governance</span>
            <span slot="item">Audit logs</span>
          </Breadcrumb>
          <Box style={{
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: 13
        }}>
            Uses the real breadcrumb API: \`variant\`, \`size\`, \`radius\`, \`elevation\`, \`tone\`, \`state\`, and \`onSelect\`.
          </Box>
        </Box>
      </Card>
    </Grid>
}`,...(h=(v=l.parameters)==null?void 0:v.docs)==null?void 0:h.source}}};var b,y,x;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <Grid style={{
    gap: 14,
    maxInlineSize: 920
  }}>
      {[{
      label: 'Surface',
      variant: 'surface',
      tone: 'neutral'
    }, {
      label: 'Soft',
      variant: 'soft',
      tone: 'info'
    }, {
      label: 'Solid',
      variant: 'solid',
      tone: 'success'
    }, {
      label: 'Outline',
      variant: 'outline',
      tone: 'warning'
    }, {
      label: 'Ghost',
      variant: 'ghost',
      tone: 'danger'
    }, {
      label: 'Minimal',
      variant: 'minimal',
      tone: 'neutral'
    }].map(entry => <Grid key={entry.label} style={{
      gap: 8
    }}>
          <Box style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--ui-color-muted, #64748b)'
      }}>{entry.label}</Box>
          <Breadcrumb separator="/" currentIndex={3} variant={entry.variant as any} tone={entry.tone as any} radius={entry.variant === 'ghost' ? 'none' : 'md'} elevation={entry.variant === 'solid' ? 'low' : 'none'}>
            <span slot="item">Workspace</span>
            <span slot="item">Programs</span>
            <span slot="item">Governance</span>
            <span slot="item">Audit logs</span>
          </Breadcrumb>
        </Grid>)}
    </Grid>
}`,...(x=(y=o.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};var f,S,I;d.parameters={...d.parameters,docs:{...(f=d.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <Grid style={{
    gap: 14,
    maxInlineSize: 860
  }}>
      {[{
      label: 'Small',
      size: 'sm'
    }, {
      label: 'Medium',
      size: 'md'
    }, {
      label: 'Large',
      size: 'lg'
    }].map(entry => <Grid key={entry.label} style={{
      gap: 8
    }}>
          <Box style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--ui-color-muted, #64748b)'
      }}>{entry.label}</Box>
          <Breadcrumb separator="/" currentIndex={3} size={entry.size as any} variant="surface" tone="info" radius={12}>
            <span slot="item">Workspace</span>
            <span slot="item">Programs</span>
            <span slot="item">Governance</span>
            <span slot="item">Audit logs</span>
          </Breadcrumb>
        </Grid>)}
    </Grid>
}`,...(I=(S=d.parameters)==null?void 0:S.docs)==null?void 0:I.source}}};var z,G,C;c.parameters={...c.parameters,docs:{...(z=c.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => {
    const [currentIndex, setCurrentIndex] = React.useState(3);
    const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
    return <Grid style={{
      gap: 16,
      maxInlineSize: 980
    }}>
        <Card radius={18} variant="soft" tone="info">
          <CardHeader>
            <CardTitle>Governance review trail</CardTitle>
            <CardDescription>
              Collapsed breadcrumb for deep navigation paths with state feedback and keyboard-friendly selection.
            </CardDescription>
          </CardHeader>
          <Box slot="inset" style={{
          padding: 16,
          display: 'grid',
          gap: 14
        }}>
            <Breadcrumb separator="/" maxItems={5} currentIndex={currentIndex} variant="soft" tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'} state={state} radius={12} elevation="low" ariaLabel="Governance review trail" onSelect={detail => {
            setCurrentIndex(detail.index);
            setState(detail.index === trail.length - 1 ? 'success' : 'idle');
          }}>
              <span slot="item">
                <HomeIcon size={13} style={{
                marginInlineEnd: 4
              }} />
                Workspace
              </span>
              <span slot="item">Programs</span>
              <span slot="item">Spring release</span>
              <span slot="item">Governance</span>
              <span slot="item">
                <ShieldIcon size={13} style={{
                marginInlineEnd: 4
              }} />
                Audit logs
              </span>
            </Breadcrumb>

            <Flex align="center" style={{
            gap: 10,
            flexWrap: 'wrap',
            color: 'var(--ui-color-muted, #64748b)',
            fontSize: 13
          }}>
              <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}>
                {state === 'success' ? <CheckCircleIcon size={14} /> : <SparklesIcon size={14} />}
                Active step: {trail[currentIndex]}
              </span>
            </Flex>
          </Box>
        </Card>
      </Grid>;
  }
}`,...(C=(G=c.parameters)==null?void 0:G.docs)==null?void 0:C.source}}};const V=["Playground","VariantGallery","SizeGallery","WorkflowPattern"];export{l as Playground,d as SizeGallery,o as VariantGallery,c as WorkflowPattern,V as __namedExportsOrder,U as default};
