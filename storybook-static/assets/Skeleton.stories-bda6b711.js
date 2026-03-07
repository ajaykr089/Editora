import{n as t,a as n,B as i,G as A,j as e,F as o}from"./index-c1b18327.js";import"./index-93f6b7ae.js";const R={title:"UI/Skeleton",component:t,argTypes:{count:{control:{type:"number",min:1,max:20,step:1}},variant:{control:"select",options:["rect","text","circle","pill","avatar","badge","button"]},animation:{control:"select",options:["none","shimmer","pulse","wave"]},density:{control:"select",options:["default","compact","comfortable"]},tone:{control:"select",options:["default","brand","success","warning","danger"]},animated:{control:"boolean"},duration:{control:"text"}}},r=a=>n(i,{style:{maxWidth:480},children:n(t,{count:a.count,variant:a.variant,animation:a.animation,density:a.density,tone:a.tone,animated:a.animated,duration:a.duration,height:a.variant==="circle"||a.variant==="avatar"?"44px":void 0,width:a.variant==="circle"||a.variant==="avatar"?"44px":void 0})});r.args={count:4,variant:"text",animation:"shimmer",density:"default",tone:"default",animated:!0,duration:"1.2s"};const l=()=>n(A,{style:{display:"grid",gap:16,maxWidth:980},children:e(o,{style:{display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"},children:[e(i,{style:{minWidth:200},children:[n("div",{style:{fontSize:12,marginBottom:6,color:"#64748b"},children:"Text"}),n(t,{variant:"text",count:3,animation:"shimmer"})]}),e(i,{children:[n("div",{style:{fontSize:12,marginBottom:6,color:"#64748b"},children:"Circle"}),n(t,{variant:"circle",animation:"wave",height:"40px",width:"40px"})]}),e(i,{children:[n("div",{style:{fontSize:12,marginBottom:6,color:"#64748b"},children:"Avatar"}),n(t,{variant:"avatar",animation:"pulse"})]}),e(i,{children:[n("div",{style:{fontSize:12,marginBottom:6,color:"#64748b"},children:"Badge"}),n(t,{variant:"badge",animation:"shimmer"})]}),e(i,{children:[n("div",{style:{fontSize:12,marginBottom:6,color:"#64748b"},children:"Button"}),n(t,{variant:"button",animation:"wave"})]}),e(i,{style:{minWidth:180},children:[n("div",{style:{fontSize:12,marginBottom:6,color:"#64748b"},children:"Pill"}),n(t,{variant:"pill",count:2,animation:"pulse"})]})]})}),d=()=>e(i,{style:{border:"1px solid #e2e8f0",borderRadius:14,padding:16,maxWidth:380,background:"#ffffff",display:"grid",gap:14},children:[n(t,{variant:"rect",height:"168px",radius:"12px",animation:"wave"}),n(t,{variant:"text",count:2,animation:"shimmer"}),e(o,{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[n(t,{variant:"badge",animation:"pulse"}),n(t,{variant:"button",animation:"shimmer",width:"96px"})]})]}),s=()=>n(i,{style:{border:"1px solid #cbd5e1",borderRadius:10,padding:12,maxWidth:980,display:"grid",gap:8},children:Array.from({length:6}).map((a,C)=>e(o,{style:{display:"grid",gridTemplateColumns:"220px 140px 160px 1fr 120px",gap:10,alignItems:"center"},children:[e(o,{style:{display:"flex",alignItems:"center",gap:10},children:[n(t,{variant:"avatar",width:"28px",height:"28px",animation:"none"}),n(t,{variant:"text",count:1,width:"140px",animation:"pulse"})]}),n(t,{variant:"pill",count:1,width:"110px",animation:"none"}),n(t,{variant:"text",count:1,width:"130px",animation:"shimmer"}),n(t,{variant:"text",count:1,width:"100%",animation:"wave"}),n(t,{variant:"button",count:1,width:"92px",height:"30px",animation:"none"})]},C))}),m=()=>e(i,{style:{border:"1px solid #e2e8f0",borderRadius:16,padding:18,maxWidth:520,display:"grid",gap:16},children:[e(o,{style:{display:"flex",gap:14,alignItems:"center"},children:[n(t,{variant:"avatar",width:"58px",height:"58px",tone:"brand",animation:"wave"}),n(i,{style:{flex:1},children:n(t,{variant:"text",count:2,tone:"brand",animation:"shimmer"})})]}),n(t,{variant:"rect",height:"96px",radius:"12px",tone:"brand",animation:"pulse"}),e(o,{style:{display:"flex",gap:10},children:[n(t,{variant:"button",tone:"brand",animation:"wave"}),n(t,{variant:"button",tone:"default",animation:"none"})]})]}),p=()=>n(A,{style:{display:"grid",gap:12,maxWidth:920},children:["shimmer","pulse","wave","none"].map(a=>e(o,{style:{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"},children:[n(i,{style:{width:80,fontSize:12,color:"#64748b",textTransform:"capitalize"},children:a}),n(t,{variant:"text",count:1,width:"140px",animation:a,tone:"default"}),n(t,{variant:"text",count:1,width:"140px",animation:a,tone:"brand"}),n(t,{variant:"text",count:1,width:"140px",animation:a,tone:"success"}),n(t,{variant:"text",count:1,width:"140px",animation:a,tone:"warning"}),n(t,{variant:"text",count:1,width:"140px",animation:a,tone:"danger"})]},a))});var c,x,h;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`(args: any) => <Box style={{
  maxWidth: 480
}}>
    <Skeleton count={args.count} variant={args.variant} animation={args.animation} density={args.density} tone={args.tone} animated={args.animated} duration={args.duration} height={args.variant === 'circle' || args.variant === 'avatar' ? '44px' : undefined} width={args.variant === 'circle' || args.variant === 'avatar' ? '44px' : undefined} />
  </Box>`,...(h=(x=r.parameters)==null?void 0:x.docs)==null?void 0:h.source}}};var u,v,g;l.parameters={...l.parameters,docs:{...(u=l.parameters)==null?void 0:u.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 16,
  maxWidth: 980
}}>
    <Flex style={{
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
    alignItems: 'center'
  }}>
      <Box style={{
      minWidth: 200
    }}>
        <div style={{
        fontSize: 12,
        marginBottom: 6,
        color: '#64748b'
      }}>Text</div>
        <Skeleton variant="text" count={3} animation="shimmer" />
      </Box>
      <Box>
        <div style={{
        fontSize: 12,
        marginBottom: 6,
        color: '#64748b'
      }}>Circle</div>
        <Skeleton variant="circle" animation="wave" height="40px" width="40px" />
      </Box>
      <Box>
        <div style={{
        fontSize: 12,
        marginBottom: 6,
        color: '#64748b'
      }}>Avatar</div>
        <Skeleton variant="avatar" animation="pulse" />
      </Box>
      <Box>
        <div style={{
        fontSize: 12,
        marginBottom: 6,
        color: '#64748b'
      }}>Badge</div>
        <Skeleton variant="badge" animation="shimmer" />
      </Box>
      <Box>
        <div style={{
        fontSize: 12,
        marginBottom: 6,
        color: '#64748b'
      }}>Button</div>
        <Skeleton variant="button" animation="wave" />
      </Box>
      <Box style={{
      minWidth: 180
    }}>
        <div style={{
        fontSize: 12,
        marginBottom: 6,
        color: '#64748b'
      }}>Pill</div>
        <Skeleton variant="pill" count={2} animation="pulse" />
      </Box>
    </Flex>
  </Grid>`,...(g=(v=l.parameters)==null?void 0:v.docs)==null?void 0:g.source}}};var y,f,b;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`() => <Box style={{
  border: '1px solid #e2e8f0',
  borderRadius: 14,
  padding: 16,
  maxWidth: 380,
  background: '#ffffff',
  display: 'grid',
  gap: 14
}}>
    <Skeleton variant="rect" height="168px" radius="12px" animation="wave" />
    <Skeleton variant="text" count={2} animation="shimmer" />
    <Flex style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }}>
      <Skeleton variant="badge" animation="pulse" />
      <Skeleton variant="button" animation="shimmer" width="96px" />
    </Flex>
  </Box>`,...(b=(f=d.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};var w,S,B;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`() => <Box style={{
  border: '1px solid #cbd5e1',
  borderRadius: 10,
  padding: 12,
  maxWidth: 980,
  display: 'grid',
  gap: 8
}}>
    {Array.from({
    length: 6
  }).map((_, rowIndex) => <Flex key={rowIndex} style={{
    display: 'grid',
    gridTemplateColumns: '220px 140px 160px 1fr 120px',
    gap: 10,
    alignItems: 'center'
  }}>
        <Flex style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }}>
          <Skeleton variant="avatar" width="28px" height="28px" animation="none" />
          <Skeleton variant="text" count={1} width="140px" animation="pulse" />
        </Flex>
        <Skeleton variant="pill" count={1} width="110px" animation="none" />
        <Skeleton variant="text" count={1} width="130px" animation="shimmer" />
        <Skeleton variant="text" count={1} width="100%" animation="wave" />
        <Skeleton variant="button" count={1} width="92px" height="30px" animation="none" />
      </Flex>)}
  </Box>`,...(B=(S=s.parameters)==null?void 0:S.docs)==null?void 0:B.source}}};var k,W,z;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:`() => <Box style={{
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  padding: 18,
  maxWidth: 520,
  display: 'grid',
  gap: 16
}}>
    <Flex style={{
    display: 'flex',
    gap: 14,
    alignItems: 'center'
  }}>
      <Skeleton variant="avatar" width="58px" height="58px" tone="brand" animation="wave" />
      <Box style={{
      flex: 1
    }}>
        <Skeleton variant="text" count={2} tone="brand" animation="shimmer" />
      </Box>
    </Flex>
    <Skeleton variant="rect" height="96px" radius="12px" tone="brand" animation="pulse" />
    <Flex style={{
    display: 'flex',
    gap: 10
  }}>
      <Skeleton variant="button" tone="brand" animation="wave" />
      <Skeleton variant="button" tone="default" animation="none" />
    </Flex>
  </Box>`,...(z=(W=m.parameters)==null?void 0:W.docs)==null?void 0:z.source}}};var F,I,T;p.parameters={...p.parameters,docs:{...(F=p.parameters)==null?void 0:F.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 12,
  maxWidth: 920
}}>
    {(['shimmer', 'pulse', 'wave', 'none'] as const).map(animation => <Flex key={animation} style={{
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
        <Box style={{
      width: 80,
      fontSize: 12,
      color: '#64748b',
      textTransform: 'capitalize'
    }}>{animation}</Box>
        <Skeleton variant="text" count={1} width="140px" animation={animation} tone="default" />
        <Skeleton variant="text" count={1} width="140px" animation={animation} tone="brand" />
        <Skeleton variant="text" count={1} width="140px" animation={animation} tone="success" />
        <Skeleton variant="text" count={1} width="140px" animation={animation} tone="warning" />
        <Skeleton variant="text" count={1} width="140px" animation={animation} tone="danger" />
      </Flex>)}
  </Grid>`,...(T=(I=p.parameters)==null?void 0:I.docs)==null?void 0:T.source}}};const j=["Playground","VariantGallery","EnterpriseCardLoading","DataTableRows","ProfilePanel","AnimationAndToneMatrix"];export{p as AnimationAndToneMatrix,s as DataTableRows,d as EnterpriseCardLoading,r as Playground,m as ProfilePanel,l as VariantGallery,j as __namedExportsOrder,R as default};
