import{aZ as t,j as u,G as f,a as e,F as E,b as k,B as s}from"./index-ce0e40fa.js";import{R as c}from"./index-93f6b7ae.js";import"./index-c197feae.js";const D={title:"UI/Presence",component:t,argTypes:{present:{control:"boolean"},mode:{control:"select",options:["fade","scale","slide-up","slide-down","slide-left","slide-right","blur","flip"]},size:{control:"select",options:["sm","md","lg"]},variant:{control:"select",options:["default","soft","glass","contrast"]},keepMounted:{control:"boolean"},lazy:{control:"boolean"},enterDuration:{control:{type:"number",min:50,max:600,step:10}},exitDuration:{control:{type:"number",min:50,max:600,step:10}},delay:{control:{type:"number",min:0,max:500,step:10}}}},d=r=>{const[i,p]=c.useState(!!r.present),[x,o]=c.useState([]);return u(f,{style:{display:"grid",gap:12,maxWidth:560},children:[e(E,{style:{display:"flex",gap:8,flexWrap:"wrap"},children:e(k,{size:"sm",onClick:()=>p(n=>!n),children:i?"Hide card":"Show card"})}),e(t,{present:i,mode:r.mode,size:r.size,variant:r.variant,keepMounted:r.keepMounted,lazy:r.lazy,enterDuration:r.enterDuration,exitDuration:r.exitDuration,delay:r.delay,onBeforeEnter:()=>o(n=>["before-enter",...n].slice(0,6)),onEnter:()=>o(n=>["enter",...n].slice(0,6)),onAfterEnter:()=>o(n=>["after-enter",...n].slice(0,6)),onBeforeExit:()=>o(n=>["before-exit",...n].slice(0,6)),onExit:()=>o(n=>["exit",...n].slice(0,6)),onAfterExit:()=>o(n=>["after-exit",...n].slice(0,6)),children:e(s,{style:{padding:16,borderRadius:12,border:"1px solid #bfdbfe",background:"linear-gradient(135deg, #eff6ff, #e0f2fe)"},children:"Presence-aware content with configurable motion states."})}),e(s,{style:{fontSize:12,color:"#64748b"},children:x.length?x.join(" | "):"No motion events yet."})]})};d.args={present:!0,mode:"fade",size:"md",variant:"default",keepMounted:!1,lazy:!1,enterDuration:180,exitDuration:150,delay:0};const a=()=>u(f,{style:{display:"grid",gridTemplateColumns:"repeat(2, minmax(220px, 1fr))",gap:12,maxWidth:700},children:[e(t,{present:!0,mode:"fade",children:e(s,{style:{padding:12,borderRadius:10,border:"1px solid #e2e8f0"},children:"Fade"})}),e(t,{present:!0,mode:"scale",variant:"soft",children:e(s,{style:{padding:12,borderRadius:10,border:"1px solid #e2e8f0"},children:"Scale"})}),e(t,{present:!0,mode:"slide-up",children:e(s,{style:{padding:12,borderRadius:10,border:"1px solid #e2e8f0"},children:"Slide Up"})}),e(t,{present:!0,mode:"slide-right",children:e(s,{style:{padding:12,borderRadius:10,border:"1px solid #e2e8f0"},children:"Slide Right"})}),e(t,{present:!0,mode:"blur",variant:"glass",children:e(s,{style:{padding:12,borderRadius:10,border:"1px solid #e2e8f0",background:"linear-gradient(135deg, #f8fafc, #eef2ff)"},children:"Blur"})}),e(t,{present:!0,mode:"flip",variant:"contrast",children:e(s,{style:{padding:12,borderRadius:10,border:"1px solid #334155",background:"#0f172a",color:"#e2e8f0"},children:"Flip"})})]}),l=()=>{const[r,i]=c.useState(!0);return u(f,{style:{display:"grid",gap:12,maxWidth:520},children:[e(k,{size:"sm",onClick:()=>i(p=>!p),children:"Toggle (keep-mounted)"}),e(t,{present:r,keepMounted:!0,mode:"slide-down",children:e(s,{style:{padding:14,borderRadius:10,border:"1px solid #dbeafe",background:"#f8fbff"},children:"This node stays mounted in DOM even after exit transitions."})})]})};var m,g,b;d.parameters={...d.parameters,docs:{...(m=d.parameters)==null?void 0:m.docs,source:{originalSource:`(args: any) => {
  const [present, setPresent] = React.useState(!!args.present);
  const [events, setEvents] = React.useState<string[]>([]);
  return <Grid style={{
    display: 'grid',
    gap: 12,
    maxWidth: 560
  }}>
      <Flex style={{
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }}>
        <Button size="sm" onClick={() => setPresent(v => !v)}>
          {present ? 'Hide card' : 'Show card'}
        </Button>
      </Flex>

      <Presence present={present} mode={args.mode} size={args.size} variant={args.variant} keepMounted={args.keepMounted} lazy={args.lazy} enterDuration={args.enterDuration} exitDuration={args.exitDuration} delay={args.delay} onBeforeEnter={() => setEvents(prev => ['before-enter', ...prev].slice(0, 6))} onEnter={() => setEvents(prev => ['enter', ...prev].slice(0, 6))} onAfterEnter={() => setEvents(prev => ['after-enter', ...prev].slice(0, 6))} onBeforeExit={() => setEvents(prev => ['before-exit', ...prev].slice(0, 6))} onExit={() => setEvents(prev => ['exit', ...prev].slice(0, 6))} onAfterExit={() => setEvents(prev => ['after-exit', ...prev].slice(0, 6))}>
        <Box style={{
        padding: 16,
        borderRadius: 12,
        border: '1px solid #bfdbfe',
        background: 'linear-gradient(135deg, #eff6ff, #e0f2fe)'
      }}>
          Presence-aware content with configurable motion states.
        </Box>
      </Presence>

      <Box style={{
      fontSize: 12,
      color: '#64748b'
    }}>{events.length ? events.join(' | ') : 'No motion events yet.'}</Box>
    </Grid>;
}`,...(b=(g=d.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var y,v,h;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(220px, 1fr))',
  gap: 12,
  maxWidth: 700
}}>
    <Presence present mode="fade">
      <Box style={{
      padding: 12,
      borderRadius: 10,
      border: '1px solid #e2e8f0'
    }}>Fade</Box>
    </Presence>
    <Presence present mode="scale" variant="soft">
      <Box style={{
      padding: 12,
      borderRadius: 10,
      border: '1px solid #e2e8f0'
    }}>Scale</Box>
    </Presence>
    <Presence present mode="slide-up">
      <Box style={{
      padding: 12,
      borderRadius: 10,
      border: '1px solid #e2e8f0'
    }}>Slide Up</Box>
    </Presence>
    <Presence present mode="slide-right">
      <Box style={{
      padding: 12,
      borderRadius: 10,
      border: '1px solid #e2e8f0'
    }}>Slide Right</Box>
    </Presence>
    <Presence present mode="blur" variant="glass">
      <Box style={{
      padding: 12,
      borderRadius: 10,
      border: '1px solid #e2e8f0',
      background: 'linear-gradient(135deg, #f8fafc, #eef2ff)'
    }}>
        Blur
      </Box>
    </Presence>
    <Presence present mode="flip" variant="contrast">
      <Box style={{
      padding: 12,
      borderRadius: 10,
      border: '1px solid #334155',
      background: '#0f172a',
      color: '#e2e8f0'
    }}>
        Flip
      </Box>
    </Presence>
  </Grid>`,...(h=(v=a.parameters)==null?void 0:v.docs)==null?void 0:h.source}}};var B,P,R;l.parameters={...l.parameters,docs:{...(B=l.parameters)==null?void 0:B.docs,source:{originalSource:`() => {
  const [present, setPresent] = React.useState(true);
  return <Grid style={{
    display: 'grid',
    gap: 12,
    maxWidth: 520
  }}>
      <Button size="sm" onClick={() => setPresent(v => !v)}>
        Toggle (keep-mounted)
      </Button>
      <Presence present={present} keepMounted mode="slide-down">
        <Box style={{
        padding: 14,
        borderRadius: 10,
        border: '1px solid #dbeafe',
        background: '#f8fbff'
      }}>
          This node stays mounted in DOM even after exit transitions.
        </Box>
      </Presence>
    </Grid>;
}`,...(R=(P=l.parameters)==null?void 0:P.docs)==null?void 0:R.source}}};const w=["Playground","MotionModes","KeepMounted"];export{l as KeepMounted,a as MotionModes,d as Playground,w as __namedExportsOrder,D as default};
