import{a8 as y,j as c,G as b,F as O,a as n,b as u,B as g}from"./index-ce0e40fa.js";import{r as o}from"./index-93f6b7ae.js";import"./index-c197feae.js";const F={title:"UI/CommandPalette",component:y,argTypes:{open:{control:"boolean"}}},p=["Create document","Insert image","Toggle sidebar","Export as PDF","Open settings"],s=i=>{const[r,t]=o.useState(!!i.open),[l,m]=o.useState(null),[e,B]=o.useState("");return c(b,{style:{display:"grid",gap:12},children:[c(O,{style:{display:"flex",gap:8},children:[n(u,{onClick:()=>t(!0),children:"Open Palette"}),n(u,{variant:"secondary",onClick:()=>t(!1),children:"Close"})]}),n(y,{open:r,query:e,placeholder:"Search workflows",emptyText:"No command matches",onQueryChange:a=>B(a.value),onSelect:a=>{m(a.index),t(!1)},children:p.map(a=>n(g,{slot:"command",style:{padding:8,borderRadius:6},children:a},a))}),c(g,{style:{fontSize:13,color:"#475569"},children:["Selected: ",l==null?"none":p[l]," • query: ",e||"empty"]})]})};s.args={open:!1};const d=()=>{const[i,r]=o.useState(!0),[t,l]=o.useState(""),m=o.useMemo(()=>p.filter(e=>e.toLowerCase().includes(t.toLowerCase())),[t]);return c(b,{style:{display:"grid",gap:12},children:[n("input",{value:t,onChange:e=>l(e.target.value),placeholder:"Filter commands before rendering",style:{maxWidth:320,padding:8,border:"1px solid #cbd5e1",borderRadius:8}}),n(y,{open:i,onSelect:()=>r(!1),children:m.map(e=>n("div",{slot:"command",children:e},e))}),n(u,{size:"sm",variant:"secondary",onClick:()=>r(e=>!e),children:"Toggle palette"})]})};var f,h,S;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`(args: any) => {
  const [open, setOpen] = useState(!!args.open);
  const [selected, setSelected] = useState<number | null>(null);
  const [query, setQuery] = useState('');
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

      <CommandPalette open={open} query={query} placeholder="Search workflows" emptyText="No command matches" onQueryChange={detail => setQuery(detail.value)} onSelect={detail => {
      setSelected(detail.index);
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
        Selected: {selected == null ? 'none' : commands[selected]} • query: {query || 'empty'}
      </Box>
    </Grid>;
}`,...(S=(h=s.parameters)==null?void 0:h.docs)==null?void 0:S.source}}};var x,C,v;d.parameters={...d.parameters,docs:{...(x=d.parameters)==null?void 0:x.docs,source:{originalSource:`() => {
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
}`,...(v=(C=d.parameters)==null?void 0:C.docs)==null?void 0:v.source}}};const w=["Default","FilteredList"];export{s as Default,d as FilteredList,w as __namedExportsOrder,F as default};
