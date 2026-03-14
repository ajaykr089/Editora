import{L as u,j as d,G as b,F as v,a as n,b as m,B as g}from"./index-c1b18327.js";import{r as s}from"./index-93f6b7ae.js";const P={title:"UI/CommandPalette",component:u,argTypes:{open:{control:"boolean"}}},p=["Create document","Insert image","Toggle sidebar","Export as PDF","Open settings"],o=c=>{const[a,t]=s.useState(!!c.open),[r,i]=s.useState(null);return d(b,{style:{display:"grid",gap:12},children:[d(v,{style:{display:"flex",gap:8},children:[n(m,{onClick:()=>t(!0),children:"Open Palette"}),n(m,{variant:"secondary",onClick:()=>t(!1),children:"Close"})]}),n(u,{open:a,onSelect:e=>{i(e),t(!1)},children:p.map(e=>n(g,{slot:"command",style:{padding:8,borderRadius:6},children:e},e))}),d(g,{style:{fontSize:13,color:"#475569"},children:["Selected: ",r==null?"none":p[r]]})]})};o.args={open:!1};const l=()=>{const[c,a]=s.useState(!0),[t,r]=s.useState(""),i=s.useMemo(()=>p.filter(e=>e.toLowerCase().includes(t.toLowerCase())),[t]);return d(b,{style:{display:"grid",gap:12},children:[n("input",{value:t,onChange:e=>r(e.target.value),placeholder:"Filter commands before rendering",style:{maxWidth:320,padding:8,border:"1px solid #cbd5e1",borderRadius:8}}),n(u,{open:c,onSelect:()=>a(!1),children:i.map(e=>n("div",{slot:"command",children:e},e))}),n(m,{size:"sm",variant:"secondary",onClick:()=>a(e=>!e),children:"Toggle palette"})]})};var y,f,x;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`(args: any) => {
  const [open, setOpen] = useState(!!args.open);
  const [selected, setSelected] = useState<number | null>(null);
  return <Grid style={{
    display: 'grid',
    gap: 12
  }}>
      <Flex style={{
      display: 'flex',
      gap: 8
    }}>
        <Button onClick={() => setOpen(true)}>Open Palette</Button>
        <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      </Flex>

      <CommandPalette open={open} onSelect={idx => {
      setSelected(idx);
      setOpen(false);
    }}>
        {commands.map(command => <Box key={command} slot="command" style={{
        padding: 8,
        borderRadius: 6
      }}>
            {command}
          </Box>)}
      </CommandPalette>

      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>
        Selected: {selected == null ? 'none' : commands[selected]}
      </Box>
    </Grid>;
}`,...(x=(f=o.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};var C,S,h;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`() => {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => commands.filter(command => command.toLowerCase().includes(query.toLowerCase())), [query]);
  return <Grid style={{
    display: 'grid',
    gap: 12
  }}>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter commands before rendering" style={{
      maxWidth: 320,
      padding: 8,
      border: '1px solid #cbd5e1',
      borderRadius: 8
    }} />
      <CommandPalette open={open} onSelect={() => setOpen(false)}>
        {filtered.map(command => <div key={command} slot="command">{command}</div>)}
      </CommandPalette>
      <Button size="sm" variant="secondary" onClick={() => setOpen(v => !v)}>
        Toggle palette
      </Button>
    </Grid>;
}`,...(h=(S=l.parameters)==null?void 0:S.docs)==null?void 0:h.source}}};const F=["Default","FilteredList"];export{o as Default,l as FilteredList,F as __namedExportsOrder,P as default};
