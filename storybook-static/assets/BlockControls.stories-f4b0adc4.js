import{Z as f,a as n,G as c,j as r,M as L,N as D,O as R,P as W,B as p,b as a,F as O}from"./index-ce0e40fa.js";import{R as l}from"./index-93f6b7ae.js";import{g as M,h as H,i as q,j as E,d as V,a as _,c as N,b as U,k as Z,l as J,L as K}from"./icons-b73c9b18.js";import"./index-c197feae.js";const nn={title:"UI/BlockControls",component:f,args:{variant:"surface",tone:"neutral",size:"md",radius:12,elevation:"low",state:"idle",orientation:"horizontal",density:"compact",wrap:!0},argTypes:{variant:{control:"select",options:["surface","soft","solid","outline","ghost"]},tone:{control:"select",options:["neutral","info","success","warning","danger"]},size:{control:"select",options:["sm","md","lg","1","2","3"]},radius:{control:"text"},elevation:{control:"select",options:["none","low","high"]},state:{control:"select",options:["idle","loading","error","success"]},orientation:{control:"select",options:["horizontal","vertical"]},density:{control:"select",options:["compact","comfortable"]},wrap:{control:"boolean"},loop:{control:"boolean"},disabled:{control:"boolean"}}};function k(e){const[t,o]=l.useState("left"),[d,i]=l.useState(!1),[s,F]=l.useState(!1),[P,j]=l.useState(!1);return r(f,{...e,ariaLabel:"Formatting controls",children:[n(a,{variant:d?"primary":"secondary",onClick:()=>i(u=>!u),children:n(Z,{size:14})}),n(a,{variant:s?"primary":"secondary",onClick:()=>F(u=>!u),children:n(J,{size:14})}),n(a,{variant:P?"primary":"secondary",onClick:()=>j(u=>!u),children:n(K,{size:14})}),n("span",{"data-separator":!0,"aria-hidden":"true"}),n(a,{variant:t==="left"?"primary":"secondary",onClick:()=>o("left"),children:n(H,{size:14})}),n(a,{variant:t==="center"?"primary":"secondary",onClick:()=>o("center"),children:n(q,{size:14})}),n(a,{variant:t==="right"?"primary":"secondary",onClick:()=>o("right"),children:n(E,{size:14})})]})}const g={render:e=>n(c,{style:{gap:16,maxInlineSize:840},children:r(L,{radius:16,children:[r(D,{children:[n(R,{children:"Block controls"}),n(W,{children:"Token-backed command strip for editor controls, inline formatting actions, and contextual action groups."})]}),n(p,{slot:"inset",style:{padding:16},children:n(k,{...e})})]})})},m={render:()=>n(c,{style:{gap:14,maxInlineSize:920},children:[{label:"Surface",variant:"surface",tone:"neutral"},{label:"Soft",variant:"soft",tone:"info"},{label:"Outline",variant:"outline",tone:"warning"},{label:"Solid",variant:"solid",tone:"success"},{label:"Ghost",variant:"ghost",tone:"danger"}].map(e=>r(c,{style:{gap:8},children:[n(p,{style:{fontSize:13,fontWeight:600,color:"var(--ui-color-muted, #64748b)"},children:e.label}),n(k,{variant:e.variant,tone:e.tone,size:"md",radius:12,elevation:"low",wrap:!0})]},e.label))})},y={render:()=>n(c,{style:{gap:14,maxInlineSize:920},children:[{label:"Small",size:"sm",radius:8},{label:"Medium",size:"md",radius:12},{label:"Large",size:"lg",radius:16}].map(e=>r(c,{style:{gap:8},children:[n(p,{style:{fontSize:13,fontWeight:600,color:"var(--ui-color-muted, #64748b)"},children:e.label}),n(k,{variant:"surface",tone:"info",size:e.size,radius:e.radius,elevation:"low",wrap:!0})]},e.label))})},h={render:()=>{const[e,t]=l.useState("paragraph"),[o,d]=l.useState("left"),[i,s]=l.useState("idle");return n(c,{style:{gap:14,maxInlineSize:980},children:r(L,{radius:16,children:[r(D,{children:[n(R,{children:"Clinical note toolbar"}),n(W,{children:"Baseline-themed command strip for formatting, alignment, and AI-assisted note review."})]}),r(p,{slot:"inset",style:{padding:16,display:"grid",gap:14},children:[r(f,{ariaLabel:"Clinical note formatting controls",variant:i==="error"?"outline":i==="success"?"soft":"surface",tone:i==="error"?"danger":i==="success"?"success":"info",state:i,size:"md",radius:12,elevation:"low",wrap:!0,children:[n(a,{variant:e==="paragraph"?"primary":"secondary",onClick:()=>t("paragraph"),children:"P"}),n(a,{variant:e==="heading"?"primary":"secondary",onClick:()=>t("heading"),children:"H1"}),n(a,{variant:e==="quote"?"primary":"secondary",onClick:()=>t("quote"),children:'"'}),n(a,{variant:e==="code"?"primary":"secondary",onClick:()=>t("code"),children:n(M,{size:14})}),n("span",{"data-separator":!0,"aria-hidden":"true"}),n(a,{variant:o==="left"?"primary":"secondary",onClick:()=>d("left"),children:n(H,{size:14})}),n(a,{variant:o==="center"?"primary":"secondary",onClick:()=>d("center"),children:n(q,{size:14})}),n(a,{variant:o==="right"?"primary":"secondary",onClick:()=>d("right"),children:n(E,{size:14})}),n("span",{"data-separator":!0,"aria-hidden":"true"}),r(a,{variant:"secondary",onClick:()=>{s("loading"),window.setTimeout(()=>s("success"),900)},children:[n(V,{size:14}),"Suggest"]})]}),r(O,{align:"center",style:{gap:8,flexWrap:"wrap"},children:[r(a,{size:"sm",variant:"secondary",onClick:()=>s("idle"),children:[n(_,{size:14}),"Idle"]}),r(a,{size:"sm",variant:"secondary",onClick:()=>s("error"),children:[n(N,{size:14}),"Error"]}),r(a,{size:"sm",onClick:()=>s("success"),children:[n(U,{size:14}),"Success"]})]}),r(p,{style:{border:"1px solid var(--ui-color-border, #d8e1ec)",borderRadius:12,padding:12,background:"var(--ui-color-surface, #fff)",fontSize:13,color:"var(--ui-color-muted, #64748b)"},children:["Block: ",n("strong",{children:e})," | Alignment: ",n("strong",{children:o})," | State: ",n("strong",{children:i})]})]})]})})}};var v,C,b;g.parameters={...g.parameters,docs:{...(v=g.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: args => <Grid style={{
    gap: 16,
    maxInlineSize: 840
  }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>Block controls</CardTitle>
          <CardDescription>
            Token-backed command strip for editor controls, inline formatting actions, and contextual action groups.
          </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{
        padding: 16
      }}>
          <DemoToolbar {...args} />
        </Box>
      </Card>
    </Grid>
}`,...(b=(C=g.parameters)==null?void 0:C.docs)==null?void 0:b.source}}};var z,B,S;m.parameters={...m.parameters,docs:{...(z=m.parameters)==null?void 0:z.docs,source:{originalSource:`{
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
      label: 'Outline',
      variant: 'outline',
      tone: 'warning'
    }, {
      label: 'Solid',
      variant: 'solid',
      tone: 'success'
    }, {
      label: 'Ghost',
      variant: 'ghost',
      tone: 'danger'
    }].map(entry => <Grid key={entry.label} style={{
      gap: 8
    }}>
          <Box style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--ui-color-muted, #64748b)'
      }}>{entry.label}</Box>
          <DemoToolbar variant={entry.variant as any} tone={entry.tone as any} size="md" radius={12} elevation="low" wrap />
        </Grid>)}
    </Grid>
}`,...(S=(B=m.parameters)==null?void 0:B.docs)==null?void 0:S.source}}};var I,x,w;y.parameters={...y.parameters,docs:{...(I=y.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <Grid style={{
    gap: 14,
    maxInlineSize: 920
  }}>
      {[{
      label: 'Small',
      size: 'sm',
      radius: 8
    }, {
      label: 'Medium',
      size: 'md',
      radius: 12
    }, {
      label: 'Large',
      size: 'lg',
      radius: 16
    }].map(entry => <Grid key={entry.label} style={{
      gap: 8
    }}>
          <Box style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--ui-color-muted, #64748b)'
      }}>{entry.label}</Box>
          <DemoToolbar variant="surface" tone="info" size={entry.size as any} radius={entry.radius} elevation="low" wrap />
        </Grid>)}
    </Grid>
}`,...(w=(x=y.parameters)==null?void 0:x.docs)==null?void 0:w.source}}};var G,A,T;h.parameters={...h.parameters,docs:{...(G=h.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => {
    const [block, setBlock] = React.useState<'paragraph' | 'heading' | 'quote' | 'code'>('paragraph');
    const [align, setAlign] = React.useState<'left' | 'center' | 'right'>('left');
    const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
    return <Grid style={{
      gap: 14,
      maxInlineSize: 980
    }}>
        <Card radius={16}>
          <CardHeader>
            <CardTitle>Clinical note toolbar</CardTitle>
            <CardDescription>
              Baseline-themed command strip for formatting, alignment, and AI-assisted note review.
            </CardDescription>
          </CardHeader>

          <Box slot="inset" style={{
          padding: 16,
          display: 'grid',
          gap: 14
        }}>
            <BlockControls ariaLabel="Clinical note formatting controls" variant={state === 'error' ? 'outline' : state === 'success' ? 'soft' : 'surface'} tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'} state={state} size="md" radius={12} elevation="low" wrap>
              <Button variant={block === 'paragraph' ? 'primary' : 'secondary'} onClick={() => setBlock('paragraph')}>
                P
              </Button>
              <Button variant={block === 'heading' ? 'primary' : 'secondary'} onClick={() => setBlock('heading')}>
                H1
              </Button>
              <Button variant={block === 'quote' ? 'primary' : 'secondary'} onClick={() => setBlock('quote')}>
                "
              </Button>
              <Button variant={block === 'code' ? 'primary' : 'secondary'} onClick={() => setBlock('code')}>
                <CodeIcon size={14} />
              </Button>

              <span data-separator aria-hidden="true" />

              <Button variant={align === 'left' ? 'primary' : 'secondary'} onClick={() => setAlign('left')}>
                <AlignLeftIcon size={14} />
              </Button>
              <Button variant={align === 'center' ? 'primary' : 'secondary'} onClick={() => setAlign('center')}>
                <AlignCenterIcon size={14} />
              </Button>
              <Button variant={align === 'right' ? 'primary' : 'secondary'} onClick={() => setAlign('right')}>
                <AlignRightIcon size={14} />
              </Button>

              <span data-separator aria-hidden="true" />

              <Button variant="secondary" onClick={() => {
              setState('loading');
              window.setTimeout(() => setState('success'), 900);
            }}>
                <SparklesIcon size={14} />
                Suggest
              </Button>
            </BlockControls>

            <Flex align="center" style={{
            gap: 8,
            flexWrap: 'wrap'
          }}>
              <Button size="sm" variant="secondary" onClick={() => setState('idle')}>
                <ClockIcon size={14} />
                Idle
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setState('error')}>
                <AlertTriangleIcon size={14} />
                Error
              </Button>
              <Button size="sm" onClick={() => setState('success')}>
                <CheckCircleIcon size={14} />
                Success
              </Button>
            </Flex>

            <Box style={{
            border: '1px solid var(--ui-color-border, #d8e1ec)',
            borderRadius: 12,
            padding: 12,
            background: 'var(--ui-color-surface, #fff)',
            fontSize: 13,
            color: 'var(--ui-color-muted, #64748b)'
          }}>
              Block: <strong>{block}</strong> | Alignment: <strong>{align}</strong> | State: <strong>{state}</strong>
            </Box>
          </Box>
        </Card>
      </Grid>;
  }
}`,...(T=(A=h.parameters)==null?void 0:A.docs)==null?void 0:T.source}}};const en=["Playground","VariantGallery","SizeGallery","EditorialWorkflow"];export{h as EditorialWorkflow,g as Playground,y as SizeGallery,m as VariantGallery,en as __namedExportsOrder,nn as default};
