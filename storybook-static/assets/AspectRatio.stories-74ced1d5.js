import{X as t,a as e,G as r,j as a,M as T,N as O,O as P,P as M,B as s,F as i,b as o}from"./index-ce0e40fa.js";import{R as f}from"./index-93f6b7ae.js";import{b as U,f as q,P as $,I as D}from"./icons-b73c9b18.js";import"./index-c197feae.js";const _={title:"UI/AspectRatio",component:t,args:{ratio:"16/9",fit:"cover",variant:"surface",tone:"neutral",size:"md",elevation:"none",radius:12},argTypes:{variant:{control:"select",options:["surface","soft","outline","solid"]},tone:{control:"select",options:["neutral","info","success","warning","danger"]},size:{control:"select",options:["sm","md","lg"]},elevation:{control:"select",options:["none","low","high"]},fit:{control:"select",options:["cover","contain","fill","none","scale-down"]}}},m="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&q=80",l={render:n=>e(r,{style:{gap:16},children:a(T,{radius:16,children:[a(O,{children:[e(P,{children:"Aspect ratio"}),e(M,{children:"Stable media frames for previews, thumbnails, editorial cards, and workflow canvases."})]}),e(s,{slot:"inset",style:{padding:12},children:e(t,{...n,showRatioBadge:!0,style:{width:"100%"},children:e("img",{src:m,alt:"Operations team reviewing dashboards"})})})]})})},c={render:()=>e(r,{style:{gap:14},children:[{label:"Surface",variant:"surface",tone:"neutral"},{label:"Soft",variant:"soft",tone:"info"},{label:"Outline",variant:"outline",tone:"warning"},{label:"Solid",variant:"solid",tone:"success"}].map(n=>a(r,{style:{gap:8},children:[e(s,{style:{fontSize:13,fontWeight:600,color:"var(--ui-color-muted, #64748b)"},children:n.label}),e(t,{ratio:"16/9",showRatioBadge:!0,variant:n.variant,tone:n.tone,radius:12,style:{width:"100%"},children:e("img",{src:m,alt:`${n.label} preview`})})]},n.label))})},d={render:()=>e(r,{style:{gap:14},children:[{label:"Small",size:"sm",radius:8},{label:"Medium",size:"md",radius:12},{label:"Large",size:"lg",radius:16}].map(n=>a(r,{style:{gap:8},children:[e(s,{style:{fontSize:13,fontWeight:600,color:"var(--ui-color-muted, #64748b)"},children:n.label}),e(t,{ratio:"4/3",size:n.size,radius:n.radius,tone:"info",variant:"soft",showRatioBadge:!0,style:{width:"100%"},children:e("img",{src:m,alt:`${n.label} media frame`})})]},n.label))})},u={render:()=>{const[n,g]=f.useState("16/9"),[k,W]=f.useState("cover");return a(r,{style:{gap:14,maxInlineSize:980},children:[a(i,{align:"center",justify:"space-between",style:{gap:12,flexWrap:"wrap"},children:[a(s,{children:[e(s,{style:{fontWeight:700,fontSize:18},children:"Media composition surface"}),e(s,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13,marginTop:4},children:"Production preview frames for campaign assets, dashboard thumbnails, and review queues."})]}),a(i,{align:"center",style:{gap:8,flexWrap:"wrap"},children:[e(o,{size:"sm",recipe:"soft",variant:"secondary",onClick:()=>g("16/9"),children:"16:9"}),e(o,{size:"sm",recipe:"soft",variant:"secondary",onClick:()=>g("4/3"),children:"4:3"}),e(o,{size:"sm",recipe:"soft",variant:"secondary",onClick:()=>g("1/1"),children:"1:1"}),e(o,{size:"sm",onClick:()=>W(j=>j==="cover"?"contain":"cover"),children:"Toggle Fit"})]})]}),e(t,{ratio:n,fit:k,tone:"info",interactive:!0,showRatioBadge:!0,radius:16,elevation:"low",children:e("img",{src:m,alt:"Operations team reviewing clinical dashboards"})}),a(r,{style:{gap:12,gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))"},children:[e(t,{ratio:"1/1",tone:"success",variant:"soft",showRatioBadge:!0,radius:12,children:a(i,{style:{width:"100%",height:"100%",alignItems:"center",justifyContent:"center",gap:8,color:"#0f172a"},children:[e(U,{size:16}),"Approved thumbnail"]})}),e(t,{ratio:"4/3",tone:"warning",variant:"soft",showRatioBadge:!0,radius:0,children:a(i,{style:{width:"100%",height:"100%",alignItems:"center",justifyContent:"center",gap:8,color:"#0f172a"},children:[e(q,{size:16}),"Capture queue"]})}),e(t,{ratio:"16/9",tone:"danger",variant:"soft",showRatioBadge:!0,radius:12,children:a(i,{style:{width:"100%",height:"100%",alignItems:"center",justifyContent:"center",gap:8,color:"#0f172a"},children:[e($,{size:16}),"Pending review"]})})]}),a(i,{justify:"end",style:{gap:8,flexWrap:"wrap"},children:[a(o,{size:"sm",recipe:"soft",variant:"secondary",children:[e(D,{size:14}),"Generate preview"]}),e(o,{size:"sm",children:"Save layout"})]})]})}},p={render:()=>a(r,{style:{gap:12,gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))"},children:[e(t,{ratio:"16/9",showRatioBadge:!0,variant:"surface",radius:12}),e(t,{ratio:"4/3",showRatioBadge:!0,variant:"soft",tone:"info",radius:12}),e(t,{ratio:"1/1",showRatioBadge:!0,variant:"outline",tone:"warning",radius:12})]})};var h,y,v;l.parameters={...l.parameters,docs:{...(h=l.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: args => <Grid style={{
    gap: 16
  }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>Aspect ratio</CardTitle>
          <CardDescription>
            Stable media frames for previews, thumbnails, editorial cards, and workflow canvases.
          </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{
        padding: 12
      }}>
          <AspectRatio {...args} showRatioBadge style={{
          width: '100%'
        }}>
            <img src={imageUrl} alt="Operations team reviewing dashboards" />
          </AspectRatio>
        </Box>
      </Card>
    </Grid>
}`,...(v=(y=l.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};var w,b,R;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <Grid style={{
    gap: 14
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
    }].map(entry => <Grid key={entry.label} style={{
      gap: 8
    }}>
          <Box style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--ui-color-muted, #64748b)'
      }}>{entry.label}</Box>
          <AspectRatio ratio="16/9" showRatioBadge variant={entry.variant as 'surface' | 'soft' | 'outline' | 'solid'} tone={entry.tone as 'neutral' | 'info' | 'warning' | 'success'} radius={12} style={{
        width: '100%'
      }}>
            <img src={imageUrl} alt={\`\${entry.label} preview\`} />
          </AspectRatio>
        </Grid>)}
    </Grid>
}`,...(R=(b=c.parameters)==null?void 0:b.docs)==null?void 0:R.source}}};var B,x,z;d.parameters={...d.parameters,docs:{...(B=d.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <Grid style={{
    gap: 14
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
          <AspectRatio ratio="4/3" size={entry.size as 'sm' | 'md' | 'lg'} radius={entry.radius} tone="info" variant="soft" showRatioBadge style={{
        width: '100%'
      }}>
            <img src={imageUrl} alt={\`\${entry.label} media frame\`} />
          </AspectRatio>
        </Grid>)}
    </Grid>
}`,...(z=(x=d.parameters)==null?void 0:x.docs)==null?void 0:z.source}}};var C,S,G;u.parameters={...u.parameters,docs:{...(C=u.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    const [ratio, setRatio] = React.useState<'16/9' | '4/3' | '1/1'>('16/9');
    const [fit, setFit] = React.useState<'cover' | 'contain'>('cover');
    return <Grid style={{
      gap: 14,
      maxInlineSize: 980
    }}>
        <Flex align="center" justify="space-between" style={{
        gap: 12,
        flexWrap: 'wrap'
      }}>
          <Box>
            <Box style={{
            fontWeight: 700,
            fontSize: 18
          }}>Media composition surface</Box>
            <Box style={{
            color: 'var(--ui-color-muted, #64748b)',
            fontSize: 13,
            marginTop: 4
          }}>
              Production preview frames for campaign assets, dashboard thumbnails, and review queues.
            </Box>
          </Box>
          <Flex align="center" style={{
          gap: 8,
          flexWrap: 'wrap'
        }}>
            <Button size="sm" recipe="soft" variant="secondary" onClick={() => setRatio('16/9')}>
              16:9
            </Button>
            <Button size="sm" recipe="soft" variant="secondary" onClick={() => setRatio('4/3')}>
              4:3
            </Button>
            <Button size="sm" recipe="soft" variant="secondary" onClick={() => setRatio('1/1')}>
              1:1
            </Button>
            <Button size="sm" onClick={() => setFit(current => current === 'cover' ? 'contain' : 'cover')}>
              Toggle Fit
            </Button>
          </Flex>
        </Flex>

        <AspectRatio ratio={ratio} fit={fit} tone="info" interactive showRatioBadge radius={16} elevation="low">
          <img src={imageUrl} alt="Operations team reviewing clinical dashboards" />
        </AspectRatio>

        <Grid style={{
        gap: 12,
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
      }}>
          <AspectRatio ratio="1/1" tone="success" variant="soft" showRatioBadge radius={12}>
            <Flex style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: '#0f172a'
          }}>
              <CheckCircleIcon size={16} />
              Approved thumbnail
            </Flex>
          </AspectRatio>

          <AspectRatio ratio="4/3" tone="warning" variant="soft" showRatioBadge radius={0}>
            <Flex style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: '#0f172a'
          }}>
              <CameraIcon size={16} />
              Capture queue
            </Flex>
          </AspectRatio>

          <AspectRatio ratio="16/9" tone="danger" variant="soft" showRatioBadge radius={12}>
            <Flex style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: '#0f172a'
          }}>
              <PlayCircleIcon size={16} />
              Pending review
            </Flex>
          </AspectRatio>
        </Grid>

        <Flex justify="end" style={{
        gap: 8,
        flexWrap: 'wrap'
      }}>
          <Button size="sm" recipe="soft" variant="secondary">
            <ImageIcon size={14} />
            Generate preview
          </Button>
          <Button size="sm">Save layout</Button>
        </Flex>
      </Grid>;
  }
}`,...(G=(S=u.parameters)==null?void 0:S.docs)==null?void 0:G.source}}};var A,I,F;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <Grid style={{
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
  }}>
      <AspectRatio ratio="16/9" showRatioBadge variant="surface" radius={12} />
      <AspectRatio ratio="4/3" showRatioBadge variant="soft" tone="info" radius={12} />
      <AspectRatio ratio="1/1" showRatioBadge variant="outline" tone="warning" radius={12} />
    </Grid>
}`,...(F=(I=p.parameters)==null?void 0:I.docs)==null?void 0:F.source}}};const N=["Playground","VariantGallery","SizeGallery","MediaOpsWorkflow","EmptyStates"];export{p as EmptyStates,u as MediaOpsWorkflow,l as Playground,d as SizeGallery,c as VariantGallery,N as __namedExportsOrder,_ as default};
