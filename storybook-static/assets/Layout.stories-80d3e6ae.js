import{a4 as s,j as t,F as c,a as e,b as o,B as n,G as d,a5 as v,M as C}from"./index-c1b18327.js";import"./index-93f6b7ae.js";const R={title:"UI/Layout",component:s,argTypes:{mode:{control:"select",options:["dashboard","split","stack"]},variant:{control:"select",options:["default","flat","elevated","glass","contrast"]},density:{control:"select",options:["default","compact","comfortable"]},maxWidth:{control:"select",options:["sm","md","lg","xl"]},sidebarSide:{control:"select",options:["start","end"]},collapsed:{control:"boolean"}}},p=()=>t(d,{style:{display:"grid",gap:8},children:[e(o,{variant:"ghost",children:"Dashboard"}),e(o,{variant:"ghost",children:"Users"}),e(o,{variant:"ghost",children:"Reports"}),e(o,{variant:"ghost",children:"Settings"})]}),x=()=>t(d,{style:{display:"grid",gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:12},children:[t(n,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:14},children:[e("strong",{children:"Weekly revenue"}),e(n,{style:{marginTop:8,fontSize:13,color:"#64748b"},children:"+18.4% vs last week"})]}),t(n,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:14},children:[e("strong",{children:"Active users"}),e(n,{style:{marginTop:8,fontSize:13,color:"#64748b"},children:"12,482 online"})]}),t(n,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:14},children:[e("strong",{children:"Conversion rate"}),e(n,{style:{marginTop:8,fontSize:13,color:"#64748b"},children:"4.8% this month"})]}),t(n,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:14},children:[e("strong",{children:"Pending alerts"}),e(n,{style:{marginTop:8,fontSize:13,color:"#64748b"},children:"7 require review"})]})]}),i=r=>t(s,{mode:r.mode,variant:r.variant,density:r.density,maxWidth:r.maxWidth,sidebarSide:r.sidebarSide,collapsed:r.collapsed,style:{width:"100%",minHeight:520},children:[t(c,{slot:"header",style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10},children:[e("strong",{children:"Admin workspace"}),t(c,{style:{display:"flex",gap:8},children:[e(o,{variant:"secondary",children:"Filters"}),e(o,{children:"New report"})]})]}),e(n,{slot:"sidebar",children:e(p,{})}),e(n,{slot:"content",children:e(x,{})}),e(n,{slot:"aside",children:t(d,{style:{display:"grid",gap:10},children:[t(n,{style:{border:"1px solid #e2e8f0",borderRadius:10,padding:12},children:[e("strong",{children:"Team notes"}),e(n,{style:{marginTop:8,fontSize:13,color:"#64748b"},children:"Sprint planning at 14:30."})]}),t(n,{style:{border:"1px solid #e2e8f0",borderRadius:10,padding:12},children:[e("strong",{children:"Deploy status"}),e(n,{style:{marginTop:8,fontSize:13,color:"#64748b"},children:"Production healthy."})]})]})}),t(c,{slot:"footer",style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8},children:[e(n,{style:{fontSize:13,color:"#64748b"},children:"Updated 2 minutes ago"}),e(o,{variant:"secondary",children:"Export"})]})]});i.args={mode:"dashboard",variant:"default",density:"default",maxWidth:"xl",sidebarSide:"start",collapsed:!1};const a=()=>t(d,{style:{display:"grid",gap:18},children:[t(s,{variant:"default",maxWidth:"xl",style:{width:"100%"},children:[e(n,{slot:"header",children:e("strong",{children:"Default"})}),e(n,{slot:"sidebar",children:e(p,{})}),e(n,{slot:"content",children:e(x,{})}),e(n,{slot:"aside",children:"Insights"})]}),t(s,{variant:"flat",density:"compact",maxWidth:"xl",style:{width:"100%"},children:[e(n,{slot:"header",children:e("strong",{children:"Flat / Compact"})}),e(n,{slot:"sidebar",children:e(p,{})}),e(n,{slot:"content",children:e(x,{})})]}),t(s,{variant:"glass",density:"comfortable",maxWidth:"xl",style:{width:"100%"},children:[e(n,{slot:"header",children:e("strong",{children:"Glass / Comfortable"})}),e(n,{slot:"sidebar",children:e(p,{})}),e(n,{slot:"content",children:e(x,{})}),e(n,{slot:"aside",children:"Quick actions"})]})]}),l=()=>t(n,{style:{padding:20},children:[t(c,{style:{display:"flex",gap:12,marginBottom:12},children:[e(n,{style:{border:"1px solid #e2e8f0",borderRadius:10,padding:12,flex:1},children:"ui-flex item A"}),e(n,{style:{border:"1px solid #e2e8f0",borderRadius:10,padding:12,flex:1},children:"ui-flex item B"})]}),t(d,{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12},children:[e(n,{style:{border:"1px solid #e2e8f0",borderRadius:10,padding:12},children:"ui-grid A"}),e(n,{style:{border:"1px solid #e2e8f0",borderRadius:10,padding:12},children:"ui-grid B"})]}),e(v,{size:"medium",style:{marginTop:14},children:e(C,{size:"lg",children:e(n,{style:{border:"1px dashed #cbd5e1",borderRadius:10,padding:12},children:"Existing `Section` and `Container` remain supported with `Layout`."})})})]});var g,h,y;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`(args: any) => <Layout mode={args.mode} variant={args.variant} density={args.density} maxWidth={args.maxWidth} sidebarSide={args.sidebarSide} collapsed={args.collapsed} style={{
  width: '100%',
  minHeight: 520
}}>
    <Flex slot="header" style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10
  }}>
      <strong>Admin workspace</strong>
      <Flex style={{
      display: 'flex',
      gap: 8
    }}>
        <Button variant="secondary">Filters</Button>
        <Button>New report</Button>
      </Flex>
    </Flex>

    <Box slot="sidebar">
      <SidebarList />
    </Box>

    <Box slot="content">
      <ContentCards />
    </Box>

    <Box slot="aside">
      <Grid style={{
      display: 'grid',
      gap: 10
    }}>
        <Box style={{
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        padding: 12
      }}>
          <strong>Team notes</strong>
          <Box style={{
          marginTop: 8,
          fontSize: 13,
          color: '#64748b'
        }}>Sprint planning at 14:30.</Box>
        </Box>
        <Box style={{
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        padding: 12
      }}>
          <strong>Deploy status</strong>
          <Box style={{
          marginTop: 8,
          fontSize: 13,
          color: '#64748b'
        }}>Production healthy.</Box>
        </Box>
      </Grid>
    </Box>

    <Flex slot="footer" style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
  }}>
      <Box style={{
      fontSize: 13,
      color: '#64748b'
    }}>Updated 2 minutes ago</Box>
      <Button variant="secondary">Export</Button>
    </Flex>
  </Layout>`,...(y=(h=i.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var m,u,b;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 18
}}>
    <Layout variant="default" maxWidth="xl" style={{
    width: '100%'
  }}>
      <Box slot="header"><strong>Default</strong></Box>
      <Box slot="sidebar"><SidebarList /></Box>
      <Box slot="content"><ContentCards /></Box>
      <Box slot="aside">Insights</Box>
    </Layout>

    <Layout variant="flat" density="compact" maxWidth="xl" style={{
    width: '100%'
  }}>
      <Box slot="header"><strong>Flat / Compact</strong></Box>
      <Box slot="sidebar"><SidebarList /></Box>
      <Box slot="content"><ContentCards /></Box>
    </Layout>

    <Layout variant="glass" density="comfortable" maxWidth="xl" style={{
    width: '100%'
  }}>
      <Box slot="header"><strong>Glass / Comfortable</strong></Box>
      <Box slot="sidebar"><SidebarList /></Box>
      <Box slot="content"><ContentCards /></Box>
      <Box slot="aside">Quick actions</Box>
    </Layout>
  </Grid>`,...(b=(u=a.parameters)==null?void 0:u.docs)==null?void 0:b.source}}};var f,B,S;l.parameters={...l.parameters,docs:{...(f=l.parameters)==null?void 0:f.docs,source:{originalSource:`() => <Box style={{
  padding: 20
}}>
    <Flex style={{
    display: 'flex',
    gap: 12,
    marginBottom: 12
  }}>
      <Box style={{
      border: '1px solid #e2e8f0',
      borderRadius: 10,
      padding: 12,
      flex: 1
    }}>ui-flex item A</Box>
      <Box style={{
      border: '1px solid #e2e8f0',
      borderRadius: 10,
      padding: 12,
      flex: 1
    }}>ui-flex item B</Box>
    </Flex>
    <Grid style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12
  }}>
      <Box style={{
      border: '1px solid #e2e8f0',
      borderRadius: 10,
      padding: 12
    }}>ui-grid A</Box>
      <Box style={{
      border: '1px solid #e2e8f0',
      borderRadius: 10,
      padding: 12
    }}>ui-grid B</Box>
    </Grid>
    <Section size="medium" style={{
    marginTop: 14
  }}>
      <Container size="lg">
        <Box style={{
        border: '1px dashed #cbd5e1',
        borderRadius: 10,
        padding: 12
      }}>
          Existing \`Section\` and \`Container\` remain supported with \`Layout\`.
        </Box>
      </Container>
    </Section>
  </Box>`,...(S=(B=l.parameters)==null?void 0:B.docs)==null?void 0:S.source}}};const T=["Playground","VisualModes","LegacyPrimitives"];export{l as LegacyPrimitives,i as Playground,a as VisualModes,T as __namedExportsOrder,R as default};
