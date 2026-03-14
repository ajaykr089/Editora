import{S as o,bc as ie,_ as ae,a as e,g as re,j as n,F as c,b as C,G as k,bd as m,B as t,be as te,bf as ee,bg as I,bh as l,bi as i,bj as ne,aL as oe}from"./index-ce0e40fa.js";import{r as p}from"./index-93f6b7ae.js";import{e as le,d as z,D as g,w as b,x as W,y as T,z as B,E as G,G as se,J as de,K as ce,M as pe,N as ue}from"./icons-b73c9b18.js";import"./index-c197feae.js";const we={title:"UI/Sidebar",component:o,argTypes:{collapsed:{control:"boolean"},collapsible:{control:"boolean"},resizable:{control:"boolean"},variant:{control:"select",options:["surface","soft","floating","contrast","minimal","split"]},size:{control:"select",options:["sm","md","lg","1","2","3"]},density:{control:"select",options:["compact","default","comfortable"]},tone:{control:"select",options:["default","brand","success","warning","danger"]},radius:{control:"text"},elevation:{control:"select",options:["none","low","high"]}}},w=[{section:"Overview",value:"home",label:"Overview",icon:e(g,{}),active:!0,description:"System status and KPIs"},{section:"Overview",value:"alerts",label:"Alerts",badge:"5",tone:"danger",description:"Urgent incidents"},{section:"Operations",value:"orders",label:"Orders",icon:e(W,{}),children:[{value:"pending",label:"Pending approval",badge:"18"},{value:"packed",label:"Packed & staged"},{value:"returns",label:"Returns",tone:"warning"}]},{section:"Operations",value:"inventory",label:"Inventory",description:"Realtime stock health"},{section:"Growth",value:"campaigns",label:"Campaigns",icon:e(z,{})},{section:"Growth",value:"audiences",label:"Audiences"},{section:"System",value:"settings",label:"Settings",icon:e(G,{})}],be=ie(ae({colors:{text:"#f7fbff",muted:"#9fb6d7",border:"rgba(142, 197, 255, 0.18)",primary:"#0f68e8",primaryHover:"#0b58c8",foregroundOnPrimary:"#ffffff"},surfaces:{panel:"rgba(10, 28, 58, 0.82)",panelSolid:"#0c2447"},components:{sidebar:{bg:"linear-gradient(180deg, rgba(5, 24, 50, 0.96), rgba(11, 39, 76, 0.92))",border:"1px solid rgba(143, 196, 255, 0.12)",radius:"26px",shadow:"0 36px 68px rgba(2, 12, 30, 0.42)",padding:"18px",gap:"14px","item-radius":"16px","item-height":"54px","item-padding-x":"16px","item-padding-y":"12px","item-gap":"14px","item-font-size":"16px","item-line-height":"24px","submenu-indent":"20px","promo-radius":"20px","promo-padding":"22px"}}}),"blue"),me={padding:24,borderRadius:32,minHeight:820,background:"radial-gradient(circle at 72% 18%, rgba(25, 122, 255, 0.22), transparent 28%), linear-gradient(180deg, #04162f 0%, #0a2446 48%, #0b2c56 100%)"},ge={display:"grid",gridTemplateColumns:"auto minmax(0, 1fr)",minHeight:760,gap:18};function he(){return n("div",{style:{padding:22,borderRadius:20,background:"linear-gradient(140deg, rgba(16, 96, 226, 0.96), rgba(98, 154, 255, 0.42))",color:"#ffffff",display:"grid",gap:18,boxShadow:"inset 0 1px 0 rgba(255,255,255,0.18)"},children:[n("div",{style:{display:"grid",gap:10},children:[e("div",{style:{fontSize:18,lineHeight:"1.25",fontWeight:800},children:"Upgrade to Premium"}),e("div",{style:{fontSize:14,lineHeight:"1.55",color:"rgba(255,255,255,0.82)"},children:"Unlock unlimited reading and offline access across your whole library."})]}),e(C,{recipe:"solid",scale:"2",radius:4,style:{width:"100%"},children:"Upgrade Now"})]})}function ve({value:a}){return n(oe,{children:[e(m,{children:n(c,{align:"center",gap:"12px",style:{color:"#ffffff",fontWeight:900,fontSize:21},children:[e("span",{style:{display:"inline-grid",placeItems:"center",width:38,height:38,borderRadius:4,background:"rgba(255,255,255,0.1)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.08)"},children:e(b,{width:22,height:22})}),e("span",{children:"Publify"})]})}),n(I,{children:[n(l,{title:"Library",children:[e(i,{value:"dashboard",label:"Dashboard",icon:e(g,{}),active:a==="dashboard"}),e(i,{value:"library",label:"My Library",icon:e(W,{}),active:a==="library"}),e(i,{value:"books",label:"Books",icon:e(b,{}),active:a==="books"}),n(i,{value:"magazines",label:"Magazines",icon:e(se,{}),active:a==="magazines",children:[e(i,{value:"editorial",label:"Editorial picks",description:"Weekly hand-picked reads"}),e(i,{value:"trending",label:"Trending now",description:"Most opened this week"}),n(i,{value:"collections",href:"#collections",children:[e("span",{children:"Collections"}),e("span",{children:"Curated reading lists"})]})]}),e(i,{value:"bookmarks",label:"Bookmarks",icon:e(de,{}),active:a==="bookmarks"}),e(i,{value:"history",label:"Reading History",icon:e(ce,{}),active:a==="history"})]}),n(l,{title:"Account",children:[e(i,{value:"subscription",label:"Subscription",icon:e(B,{}),active:a==="subscription"}),e(i,{value:"downloads",label:"Downloads",icon:e(pe,{}),active:a==="downloads"}),e(i,{value:"payments",label:"Payments",icon:e(ue,{}),active:a==="payments"}),n(i,{value:"settings",label:"Settings",icon:e(G,{}),active:a==="settings",children:[e(i,{value:"preferences",label:"Preferences"}),e(i,{value:"devices",label:"Devices"}),e(i,{value:"security",label:"Security"})]}),e(i,{value:"support",label:"Help & Support",icon:e(T,{}),active:a==="support"})]})]}),e(ee,{children:e(he,{})}),e(ne,{children:e("div",{style:{color:"rgba(255,255,255,0.72)"},children:"Signed in as premium@publify.app"})})]})}const u=a=>{const[r,s]=p.useState("dashboard"),[d,P]=p.useState(!1);return e(re,{tokens:be,storageKey:null,children:e("div",{style:me,children:n("div",{style:ge,children:[e(o,{...a,value:r,collapsed:d,onSelect:H=>s(H.value),onToggle:P,collapsible:!0,resizable:!0,variant:"contrast",tone:"brand",size:"sm",itemFontSize:12,children:e(ve,{value:r})}),e("div",{style:{minHeight:760,borderRadius:28,border:"1px solid rgba(158, 197, 255, 0.16)",background:"linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.08)",padding:26,color:"#f7fbff"},children:n("div",{style:{display:"grid",gap:12,maxWidth:720},children:[e("div",{style:{fontSize:14,letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(255,255,255,0.54)"},children:"Reading dashboard"}),e("div",{style:{fontSize:40,lineHeight:1.05,fontWeight:900},children:"Sidebar-driven premium shell"}),e("div",{style:{fontSize:16,lineHeight:1.7,color:"rgba(255,255,255,0.78)"},children:"The sidebar keeps the reading app navigation structured with grouped links, expandable subsections, and a dedicated promo rail without sacrificing keyboard support or resize persistence."}),n(c,{gap:"10px",wrap:"wrap",children:[e(C,{recipe:"solid",scale:"2",radius:14,children:"Open active module"}),e(C,{recipe:"surface",scale:"2",radius:14,onClick:()=>P(H=>!H),children:d?"Expand sidebar":"Collapse sidebar"})]})]})})]})})})};u.parameters={controls:{exclude:["children"]}};const h=()=>{const[a,r]=p.useState("home"),s=p.useMemo(()=>w.map(d=>({...d,active:d.value===a})),[a]);return n(k,{columns:"auto minmax(0, 1fr)",style:{minHeight:620,border:"1px solid var(--ui-color-border, #d6dce6)",borderRadius:28,overflow:"hidden"},children:[n(o,{items:s,value:a,onSelect:d=>r(d.value),collapsible:!0,resizable:!0,variant:"surface",children:[e(m,{children:n(c,{align:"center",justify:"space-between",style:{fontWeight:800,fontSize:18},children:[e("span",{children:"Operations Hub"}),e(t,{style:{fontSize:12,color:"var(--ui-color-muted, #64748b)"},children:"24/7"})]})}),e(te,{placeholder:"Search orders, audiences, incidents…",icon:e(le,{width:16,height:16})}),e(ee,{children:n(t,{style:{borderRadius:18,padding:18,background:"linear-gradient(140deg, color-mix(in srgb, var(--ui-color-primary) 92%, #1d4ed8 8%), color-mix(in srgb, var(--ui-color-primary) 22%, #ffffff 78%))",color:"#ffffff",display:"grid",gap:12},children:[n(c,{align:"center",gap:"8px",style:{fontWeight:800},children:[e(z,{width:16,height:16}),e("strong",{children:"Quarter-end launch"})]}),e("span",{style:{color:"rgba(255,255,255,0.8)",lineHeight:1.5},children:"Review every open operational blocker before the release checklist closes."})]})})]}),e(t,{p:"24px",style:{background:"var(--ui-color-surface-alt, #f8fafc)"},children:n("div",{style:{display:"grid",gap:10,maxWidth:760},children:[e("div",{style:{fontSize:14,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--ui-color-muted, #64748b)"},children:"Selected module"}),e("div",{style:{fontSize:34,lineHeight:1.08,fontWeight:900},children:a}),e("div",{style:{fontSize:16,lineHeight:1.7,color:"var(--ui-color-muted, #64748b)"},children:"Light theme application shell with nested operations routes, inline promo card, and search/header/footer regions."})]})})]})},v=()=>e("div",{style:{display:"grid",gap:18},children:["surface","soft","floating","contrast","minimal"].map(r=>n("div",{style:{display:"grid",gridTemplateColumns:"120px auto",alignItems:"start",gap:18},children:[e("div",{style:{fontWeight:800,textTransform:"capitalize"},children:r}),e(o,{items:w.slice(0,4),variant:r,style:{height:340},children:e(t,{slot:"header",style:{fontWeight:800},children:"Shell"})})]},r))}),f=()=>e("div",{style:{display:"grid",gap:18},children:["sm","md","lg"].map(a=>n("div",{style:{display:"grid",gridTemplateColumns:"120px auto auto",gap:18,alignItems:"start"},children:[e("div",{style:{fontWeight:800,textTransform:"uppercase"},children:a}),e(o,{items:w.slice(0,4),size:a,density:"compact",style:{height:300}}),e(o,{items:w.slice(0,4),size:a,density:"comfortable",style:{height:300}})]},a))}),y=()=>{const[a,r]=p.useState("dashboard");return n(k,{columns:"auto minmax(0, 1fr)",style:{minHeight:640,border:"1px solid var(--ui-color-border, #d6dce6)",borderRadius:28,overflow:"hidden",background:"var(--ui-color-surface-alt, #f8fafc)"},children:[n(o,{value:a,onSelect:s=>r(s.value),collapsible:!0,resizable:!0,sectionLabelTransform:"none",children:[e(m,{children:n(c,{align:"center",justify:"space-between",style:{fontWeight:800,fontSize:18},children:[e("span",{children:"Product docs"}),e(t,{style:{fontSize:12,color:"var(--ui-color-muted, #64748b)"},children:"v4.2"})]})}),n(I,{children:[n(l,{title:"Getting started",children:[e(i,{value:"dashboard",label:"Overview",icon:e(g,{}),href:"#overview",active:a==="dashboard"}),n(i,{value:"guides",href:"#guides",children:[e(b,{}),e("span",{children:"Guides"}),e("span",{children:"Patterns, conventions, and implementation notes"})]}),n(i,{value:"components",label:"Components",icon:e(W,{}),children:[e(i,{value:"navigation",label:"Navigation",href:"#navigation"}),e(i,{value:"feedback",label:"Feedback",href:"#feedback"}),e(i,{value:"data-entry",label:"Data entry",href:"#data-entry"})]})]}),n(l,{title:"Resources",children:[e(i,{value:"releases",label:"Release notes",icon:e(z,{}),href:"#releases"}),e(i,{value:"support",label:"Help & Support",icon:e(T,{}),href:"#support"})]})]}),e(ne,{children:e("div",{style:{color:"var(--ui-color-muted, #64748b)"},children:"Links use real anchor navigation and still emit sidebar selection."})})]}),n(t,{p:"28px",style:{display:"grid",gap:14,alignContent:"start"},children:[e("div",{style:{fontSize:14,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--ui-color-muted, #64748b)"},children:"Current selection"}),e("div",{style:{fontSize:34,lineHeight:1.05,fontWeight:900},children:a}),n("div",{style:{maxWidth:720,fontSize:16,lineHeight:1.7,color:"var(--ui-color-muted, #64748b)"},children:["This story demonstrates two new sidebar capabilities: leaf items can be real links through ",e("code",{children:"href"}),", and display content can be authored directly inside ",e("code",{children:"SidebarItem"})," instead of relying only on ",e("code",{children:"label"})," and ",e("code",{children:"description"}),"."]}),n(t,{style:{padding:18,borderRadius:18,border:"1px solid color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, transparent)",background:"color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, var(--color-panel-solid, #ffffff))"},children:[e("div",{style:{fontWeight:800,marginBottom:8},children:"API example"}),e("pre",{style:{margin:0,whiteSpace:"pre-wrap",fontSize:13,lineHeight:1.55,color:"var(--ui-color-text, #202020)"},children:`<SidebarItem value="guides" href="#guides">
  <BookIcon />
  <span>Guides</span>
  <span>Patterns, conventions, and implementation notes</span>
</SidebarItem>`})]}),n(t,{style:{padding:18,borderRadius:18,border:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 84%, transparent)",background:"var(--color-panel-solid, #ffffff)",display:"grid",gap:10},children:[e("div",{style:{fontWeight:800},children:"What this demo covers"}),e("div",{style:{color:"var(--ui-color-muted, #64748b)",lineHeight:1.65},children:"Link rows keep anchor navigation semantics, custom leading icons can be authored directly in the item body, and nested submenu sections animate open and closed instead of snapping."})]})]})]})},S=()=>e(k,{columns:"repeat(3, minmax(0, 1fr))",style:{gap:18,alignItems:"start"},children:[{title:"Uppercase",transform:"uppercase"},{title:"None",transform:"none"},{title:"Capitalize",transform:"capitalize"}].map(a=>n("div",{style:{display:"grid",gap:14},children:[e("div",{style:{fontWeight:800},children:a.title}),n(o,{variant:"surface",sectionLabelTransform:a.transform,style:{height:360},children:[e(m,{children:n(c,{align:"center",justify:"space-between",style:{fontWeight:800},children:[e("span",{children:"Sidebar labels"}),e(t,{style:{fontSize:12,color:"var(--ui-color-muted, #64748b)"},children:a.transform})]})}),n(I,{children:[n(l,{title:"Primary navigation",children:[e(i,{value:"overview",label:"Overview",icon:e(g,{})}),n(i,{value:"reading",icon:e(b,{}),children:[e("span",{children:"Reading lists"}),e("span",{children:"Custom content rendered inside the row"})]})]}),n(l,{title:"Account settings",children:[e(i,{value:"billing",label:"Billing",icon:e(B,{})}),e(i,{value:"preferences",label:"Preferences",icon:e(G,{})})]})]})]})]},a.transform))}),x=()=>{const[a,r]=p.useState("overview");return n(k,{columns:"auto minmax(0, 1fr)",style:{minHeight:620,border:"1px solid var(--ui-color-border, #d6dce6)",borderRadius:28,overflow:"hidden",background:"linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 3%, #ffffff), #f8fafc)"},children:[n(o,{value:a,onSelect:s=>r(s.value),variant:"soft",sectionLabelTransform:"capitalize",children:[e(m,{children:n(c,{align:"center",justify:"space-between",style:{fontWeight:800,fontSize:18},children:[e("span",{children:"Docs navigation"}),e(t,{style:{fontSize:12,color:"var(--ui-color-muted, #64748b)"},children:"animated"})]})}),n(I,{children:[n(l,{title:"Core guides",children:[n(i,{value:"overview",href:"#overview",children:[e(g,{}),e("span",{children:"Overview"}),e("span",{children:"Entry points, architecture, and release notes"})]}),n(i,{value:"patterns",children:[e(b,{}),e("span",{children:"Patterns"}),e("span",{children:"Open this item to preview submenu motion"}),e(i,{value:"forms",href:"#forms",label:"Forms"}),e(i,{value:"navigation",href:"#navigation",label:"Navigation"}),e(i,{value:"feedback",href:"#feedback",label:"Feedback"})]}),n(i,{value:"tooling",href:"#tooling",children:[e(z,{}),e("span",{children:"Tooling"}),e("span",{children:"Storybook, E2E, and docs automation"})]})]}),n(l,{title:"Support links",children:[e(i,{value:"account",href:"#account",icon:e(B,{}),label:"Account"}),e(i,{value:"support",href:"#support",icon:e(T,{}),label:"Help & Support"})]})]})]}),n(t,{p:"28px",style:{display:"grid",gap:16,alignContent:"start"},children:[e("div",{style:{fontSize:14,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--ui-color-muted, #64748b)"},children:"Demo focus"}),e("div",{style:{fontSize:34,lineHeight:1.05,fontWeight:900},children:"Animated submenus and icon-as-child rows"}),n("div",{style:{maxWidth:720,fontSize:16,lineHeight:1.7,color:"var(--ui-color-muted, #64748b)"},children:["This example is tuned for visual review. Open the “Patterns” group to inspect the submenu transition, and check that icon spacing remains correct even when icons are authored directly as children inside each ",e("code",{children:"SidebarItem"}),"."]})]})]})};var R,F,O;u.parameters={...u.parameters,docs:{...(R=u.parameters)==null?void 0:R.docs,source:{originalSource:`(args: any) => {
  const [value, setValue] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  return <ThemeProvider tokens={premiumTokens} storageKey={null}>
      <div style={pageFrameStyle}>
        <div style={previewShellStyle}>
          <Sidebar {...args} value={value} collapsed={collapsed} onSelect={detail => setValue(detail.value)} onToggle={setCollapsed} collapsible resizable variant="contrast" tone="brand" size="sm" itemFontSize={12}>
            <PremiumSidebarStructure value={value} />
          </Sidebar>

          <div style={{
          minHeight: 760,
          borderRadius: 28,
          border: "1px solid rgba(158, 197, 255, 0.16)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          padding: 26,
          color: "#f7fbff"
        }}>
            <div style={{
            display: "grid",
            gap: 12,
            maxWidth: 720
          }}>
              <div style={{
              fontSize: 14,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.54)"
            }}>
                Reading dashboard
              </div>
              <div style={{
              fontSize: 40,
              lineHeight: 1.05,
              fontWeight: 900
            }}>
                Sidebar-driven premium shell
              </div>
              <div style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.78)"
            }}>
                The sidebar keeps the reading app navigation structured with
                grouped links, expandable subsections, and a dedicated promo
                rail without sacrificing keyboard support or resize persistence.
              </div>
              <Flex gap="10px" wrap="wrap">
                <Button recipe="solid" scale="2" radius={14}>
                  Open active module
                </Button>
                <Button recipe="surface" scale="2" radius={14} onClick={() => setCollapsed(current => !current)}>
                  {collapsed ? "Expand sidebar" : "Collapse sidebar"}
                </Button>
              </Flex>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>;
}`,...(O=(F=u.parameters)==null?void 0:F.docs)==null?void 0:O.source}}};var L,A,D;h.parameters={...h.parameters,docs:{...(L=h.parameters)==null?void 0:L.docs,source:{originalSource:`() => {
  const [value, setValue] = useState('home');
  const items = useMemo(() => operationsItems.map(item => ({
    ...item,
    active: item.value === value
  })), [value]);
  return <Grid columns="auto minmax(0, 1fr)" style={{
    minHeight: 620,
    border: '1px solid var(--ui-color-border, #d6dce6)',
    borderRadius: 28,
    overflow: 'hidden'
  }}>
      <Sidebar items={items} value={value} onSelect={detail => setValue(detail.value)} collapsible resizable variant="surface">
        <SidebarHeader>
          <Flex align="center" justify="space-between" style={{
          fontWeight: 800,
          fontSize: 18
        }}>
          <span>Operations Hub</span>
          <Box style={{
            fontSize: 12,
            color: 'var(--ui-color-muted, #64748b)'
          }}>24/7</Box>
          </Flex>
        </SidebarHeader>
        <SidebarSearchInput placeholder="Search orders, audiences, incidents…" icon={<SearchIcon width={16} height={16} />} />
        <SidebarPromo>
          <Box style={{
          borderRadius: 18,
          padding: 18,
          background: 'linear-gradient(140deg, color-mix(in srgb, var(--ui-color-primary) 92%, #1d4ed8 8%), color-mix(in srgb, var(--ui-color-primary) 22%, #ffffff 78%))',
          color: '#ffffff',
          display: 'grid',
          gap: 12
        }}>
            <Flex align="center" gap="8px" style={{
            fontWeight: 800
          }}>
              <SparklesIcon width={16} height={16} />
              <strong>Quarter-end launch</strong>
            </Flex>
          <span style={{
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.5
          }}>Review every open operational blocker before the release checklist closes.</span>
        </Box>
        </SidebarPromo>
      </Sidebar>

      <Box p="24px" style={{
      background: 'var(--ui-color-surface-alt, #f8fafc)'
    }}>
        <div style={{
        display: 'grid',
        gap: 10,
        maxWidth: 760
      }}>
          <div style={{
          fontSize: 14,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--ui-color-muted, #64748b)'
        }}>
            Selected module
          </div>
          <div style={{
          fontSize: 34,
          lineHeight: 1.08,
          fontWeight: 900
        }}>{value}</div>
          <div style={{
          fontSize: 16,
          lineHeight: 1.7,
          color: 'var(--ui-color-muted, #64748b)'
        }}>
            Light theme application shell with nested operations routes, inline promo card, and search/header/footer regions.
          </div>
        </div>
      </Box>
    </Grid>;
}`,...(D=(A=h.parameters)==null?void 0:A.docs)==null?void 0:D.source}}};var V,j,E;v.parameters={...v.parameters,docs:{...(V=v.parameters)==null?void 0:V.docs,source:{originalSource:`() => {
  const rows = ['surface', 'soft', 'floating', 'contrast', 'minimal'] as const;
  return <div style={{
    display: 'grid',
    gap: 18
  }}>
      {rows.map(variant => <div key={variant} style={{
      display: 'grid',
      gridTemplateColumns: '120px auto',
      alignItems: 'start',
      gap: 18
    }}>
          <div style={{
        fontWeight: 800,
        textTransform: 'capitalize'
      }}>{variant}</div>
          <Sidebar items={operationsItems.slice(0, 4)} variant={variant} style={{
        height: 340
      }}>
            <Box slot="header" style={{
          fontWeight: 800
        }}>Shell</Box>
          </Sidebar>
        </div>)}
    </div>;
}`,...(E=(j=v.parameters)==null?void 0:j.docs)==null?void 0:E.source}}};var N,M,U;f.parameters={...f.parameters,docs:{...(N=f.parameters)==null?void 0:N.docs,source:{originalSource:`() => <div style={{
  display: 'grid',
  gap: 18
}}>
    {(['sm', 'md', 'lg'] as const).map(size => <div key={size} style={{
    display: 'grid',
    gridTemplateColumns: '120px auto auto',
    gap: 18,
    alignItems: 'start'
  }}>
        <div style={{
      fontWeight: 800,
      textTransform: 'uppercase'
    }}>{size}</div>
        <Sidebar items={operationsItems.slice(0, 4)} size={size} density="compact" style={{
      height: 300
    }} />
        <Sidebar items={operationsItems.slice(0, 4)} size={size} density="comfortable" style={{
      height: 300
    }} />
      </div>)}
  </div>`,...(U=(M=f.parameters)==null?void 0:M.docs)==null?void 0:U.source}}};var K,_,Q;y.parameters={...y.parameters,docs:{...(K=y.parameters)==null?void 0:K.docs,source:{originalSource:`() => {
  const [value, setValue] = useState('dashboard');
  return <Grid columns="auto minmax(0, 1fr)" style={{
    minHeight: 640,
    border: '1px solid var(--ui-color-border, #d6dce6)',
    borderRadius: 28,
    overflow: 'hidden',
    background: 'var(--ui-color-surface-alt, #f8fafc)'
  }}>
      <Sidebar value={value} onSelect={detail => setValue(detail.value)} collapsible resizable sectionLabelTransform="none">
        <SidebarHeader>
          <Flex align="center" justify="space-between" style={{
          fontWeight: 800,
          fontSize: 18
        }}>
            <span>Product docs</span>
            <Box style={{
            fontSize: 12,
            color: 'var(--ui-color-muted, #64748b)'
          }}>v4.2</Box>
          </Flex>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup title="Getting started">
            <SidebarItem value="dashboard" label="Overview" icon={<DashboardIcon />} href="#overview" active={value === 'dashboard'} />
            <SidebarItem value="guides" href="#guides">
              <BookIcon />
              <span>Guides</span>
              <span>Patterns, conventions, and implementation notes</span>
            </SidebarItem>
            <SidebarItem value="components" label="Components" icon={<FolderOpenIcon />}>
              <SidebarItem value="navigation" label="Navigation" href="#navigation" />
              <SidebarItem value="feedback" label="Feedback" href="#feedback" />
              <SidebarItem value="data-entry" label="Data entry" href="#data-entry" />
            </SidebarItem>
          </SidebarGroup>
          <SidebarGroup title="Resources">
            <SidebarItem value="releases" label="Release notes" icon={<SparklesIcon />} href="#releases" />
            <SidebarItem value="support" label="Help & Support" icon={<HelpCircleIcon />} href="#support" />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div style={{
          color: 'var(--ui-color-muted, #64748b)'
        }}>Links use real anchor navigation and still emit sidebar selection.</div>
        </SidebarFooter>
      </Sidebar>

      <Box p="28px" style={{
      display: 'grid',
      gap: 14,
      alignContent: 'start'
    }}>
        <div style={{
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          Current selection
        </div>
        <div style={{
        fontSize: 34,
        lineHeight: 1.05,
        fontWeight: 900
      }}>{value}</div>
        <div style={{
        maxWidth: 720,
        fontSize: 16,
        lineHeight: 1.7,
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          This story demonstrates two new sidebar capabilities: leaf items can be real links through <code>href</code>, and display content can be authored directly inside <code>SidebarItem</code> instead of relying only on <code>label</code> and <code>description</code>.
        </div>
        <Box style={{
        padding: 18,
        borderRadius: 18,
        border: '1px solid color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, transparent)',
        background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, var(--color-panel-solid, #ffffff))'
      }}>
          <div style={{
          fontWeight: 800,
          marginBottom: 8
        }}>API example</div>
          <pre style={{
          margin: 0,
          whiteSpace: 'pre-wrap',
          fontSize: 13,
          lineHeight: 1.55,
          color: 'var(--ui-color-text, #202020)'
        }}>{\`<SidebarItem value="guides" href="#guides">
  <BookIcon />
  <span>Guides</span>
  <span>Patterns, conventions, and implementation notes</span>
</SidebarItem>\`}</pre>
        </Box>
        <Box style={{
        padding: 18,
        borderRadius: 18,
        border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 84%, transparent)',
        background: 'var(--color-panel-solid, #ffffff)',
        display: 'grid',
        gap: 10
      }}>
          <div style={{
          fontWeight: 800
        }}>What this demo covers</div>
          <div style={{
          color: 'var(--ui-color-muted, #64748b)',
          lineHeight: 1.65
        }}>
            Link rows keep anchor navigation semantics, custom leading icons can be authored directly in the item body, and nested submenu sections animate open and closed instead of snapping.
          </div>
        </Box>
      </Box>
    </Grid>;
}`,...(Q=(_=y.parameters)==null?void 0:_.docs)==null?void 0:Q.source}}};var J,q,X;S.parameters={...S.parameters,docs:{...(J=S.parameters)==null?void 0:J.docs,source:{originalSource:`() => <Grid columns="repeat(3, minmax(0, 1fr))" style={{
  gap: 18,
  alignItems: 'start'
}}>
    {[{
    title: 'Uppercase',
    transform: 'uppercase' as const
  }, {
    title: 'None',
    transform: 'none' as const
  }, {
    title: 'Capitalize',
    transform: 'capitalize' as const
  }].map(example => <div key={example.transform} style={{
    display: 'grid',
    gap: 14
  }}>
        <div style={{
      fontWeight: 800
    }}>{example.title}</div>
        <Sidebar variant="surface" sectionLabelTransform={example.transform} style={{
      height: 360
    }}>
          <SidebarHeader>
            <Flex align="center" justify="space-between" style={{
          fontWeight: 800
        }}>
              <span>Sidebar labels</span>
              <Box style={{
            fontSize: 12,
            color: 'var(--ui-color-muted, #64748b)'
          }}>{example.transform}</Box>
            </Flex>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup title="Primary navigation">
              <SidebarItem value="overview" label="Overview" icon={<DashboardIcon />} />
              <SidebarItem value="reading" icon={<BookIcon />}>
                <span>Reading lists</span>
                <span>Custom content rendered inside the row</span>
              </SidebarItem>
            </SidebarGroup>
            <SidebarGroup title="Account settings">
              <SidebarItem value="billing" label="Billing" icon={<CreditCardIcon />} />
              <SidebarItem value="preferences" label="Preferences" icon={<SettingsIcon />} />
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>)}
  </Grid>`,...(X=(q=S.parameters)==null?void 0:q.docs)==null?void 0:X.source}}};var Y,Z,$;x.parameters={...x.parameters,docs:{...(Y=x.parameters)==null?void 0:Y.docs,source:{originalSource:`() => {
  const [value, setValue] = useState('overview');
  return <Grid columns="auto minmax(0, 1fr)" style={{
    minHeight: 620,
    border: '1px solid var(--ui-color-border, #d6dce6)',
    borderRadius: 28,
    overflow: 'hidden',
    background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 3%, #ffffff), #f8fafc)'
  }}>
      <Sidebar value={value} onSelect={detail => setValue(detail.value)} variant="soft" sectionLabelTransform="capitalize">
        <SidebarHeader>
          <Flex align="center" justify="space-between" style={{
          fontWeight: 800,
          fontSize: 18
        }}>
            <span>Docs navigation</span>
            <Box style={{
            fontSize: 12,
            color: 'var(--ui-color-muted, #64748b)'
          }}>animated</Box>
          </Flex>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup title="Core guides">
            <SidebarItem value="overview" href="#overview">
              <DashboardIcon />
              <span>Overview</span>
              <span>Entry points, architecture, and release notes</span>
            </SidebarItem>
            <SidebarItem value="patterns">
              <BookIcon />
              <span>Patterns</span>
              <span>Open this item to preview submenu motion</span>
              <SidebarItem value="forms" href="#forms" label="Forms" />
              <SidebarItem value="navigation" href="#navigation" label="Navigation" />
              <SidebarItem value="feedback" href="#feedback" label="Feedback" />
            </SidebarItem>
            <SidebarItem value="tooling" href="#tooling">
              <SparklesIcon />
              <span>Tooling</span>
              <span>Storybook, E2E, and docs automation</span>
            </SidebarItem>
          </SidebarGroup>
          <SidebarGroup title="Support links">
            <SidebarItem value="account" href="#account" icon={<CreditCardIcon />} label="Account" />
            <SidebarItem value="support" href="#support" icon={<HelpCircleIcon />} label="Help & Support" />
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <Box p="28px" style={{
      display: 'grid',
      gap: 16,
      alignContent: 'start'
    }}>
        <div style={{
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          Demo focus
        </div>
        <div style={{
        fontSize: 34,
        lineHeight: 1.05,
        fontWeight: 900
      }}>Animated submenus and icon-as-child rows</div>
        <div style={{
        maxWidth: 720,
        fontSize: 16,
        lineHeight: 1.7,
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          This example is tuned for visual review. Open the “Patterns” group to inspect the submenu transition, and check that icon spacing remains correct even when icons are authored directly as children inside each <code>SidebarItem</code>.
        </div>
      </Box>
    </Grid>;
}`,...($=(Z=x.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};const ke=["PremiumReadingShell","OperationsWorkspace","VariantGallery","SizeAndDensityGallery","NavigationLinksAndCustomContent","SectionLabelTransformGallery","SubmenuMotionAndCustomIcons"];export{y as NavigationLinksAndCustomContent,h as OperationsWorkspace,u as PremiumReadingShell,S as SectionLabelTransformGallery,f as SizeAndDensityGallery,x as SubmenuMotionAndCustomIcons,v as VariantGallery,ke as __namedExportsOrder,we as default};
