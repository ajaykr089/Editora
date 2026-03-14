import{aK as g,a as e,G as a,j as t,M as P,N as F,O,P as A,B as h,F as b,b as H,l as v,aI as r,aL as R,aJ as c,aH as E,g as N,_ as x}from"./index-ce0e40fa.js";import{R as p}from"./index-93f6b7ae.js";import"./index-c197feae.js";const L={title:"UI/Menubar",component:g,args:{selected:1,open:!1,loop:!0,placement:"bottom",variant:"surface",size:"md",radius:12,elevation:"low",tone:"default",closeOnSelect:!0,typeahead:!0},argTypes:{selected:{control:"number"},open:{control:"boolean"},loop:{control:"boolean"},placement:{control:"select",options:["bottom","top","left","right"]},variant:{control:"select",options:["surface","soft","solid","outline","contrast","flat"]},size:{control:"select",options:["sm","md","lg","1","2","3"]},radius:{control:"text"},elevation:{control:"select",options:["none","low","high"]},tone:{control:"select",options:["default","neutral","info","success","warning","danger"]},closeOnSelect:{control:"boolean"},typeahead:{control:"boolean"}}};function f(n){return e("button",{type:"button",onClick:n.onClick,style:{appearance:"none",border:"none",borderBottom:n.active?"3px solid var(--ui-color-primary, #2563eb)":"3px solid transparent",background:"transparent",color:n.active?"var(--ui-color-text, #0f172a)":"var(--ui-color-muted, #64748b)",padding:"14px 4px 12px",font:"600 15px/1.4 inherit",cursor:"pointer"},children:n.children})}function W(n){return n==="purple"?x({colors:{primary:"#8b5cf6",primaryHover:"#7c3aed",focusRing:"#8b5cf6"},palette:{accent:{1:"#fdfcff",2:"#faf7ff",3:"#f3ecff",4:"#eadcff",5:"#ddc7ff",6:"#cdb0ff",7:"#b693ff",8:"#9b70ff",9:"#8b5cf6",10:"#7c3aed",11:"#6d28d9",12:"#2e1065"},accentAlpha:{1:"#7c3aed03",2:"#7c3aed08",3:"#7c3aed14",4:"#7c3aed24",5:"#7c3aed38",6:"#7c3aed4d",7:"#7c3aed68",8:"#7c3aed8f",9:"#7c3aed",10:"#6d28d9",11:"#5b21b6",12:"#2e1065"},accentContrast:"#ffffff",accentSurface:"#f5f0ffcc",accentIndicator:"#8b5cf6",accentTrack:"#8b5cf6"}},{accentPalette:"blue",mode:"light"}):x({},{accentPalette:n,mode:"light"})}function B(){return t(R,{children:[t("div",{slot:"content",children:[e(r,{shortcut:"⌘N",children:"New file"}),e(r,{shortcut:"⌘O",children:"Open…"}),e(c,{}),t("div",{role:"menuitem",tabIndex:-1,className:"item","data-menu-item":!0,children:[e("span",{className:"label",children:e("span",{className:"text",children:"Export"})}),e("span",{className:"submenu-arrow",children:"▶"}),t("div",{className:"submenu",children:[e(r,{children:"Export as PDF"}),e(r,{children:"Export as HTML"}),e(r,{children:"Export as Markdown"})]})]})]}),t("div",{slot:"content",children:[e(r,{shortcut:"⌘Z",children:"Undo"}),e(r,{shortcut:"⇧⌘Z",children:"Redo"}),e(c,{}),e(r,{shortcut:"⌘F",children:"Find"}),e(r,{shortcut:"⌘H",children:"Replace"})]}),t("div",{slot:"content",children:[e(r,{role:"menuitemcheckbox",checked:!0,children:"Show line numbers"}),e(r,{role:"menuitemcheckbox",children:"Wrap lines"}),e(c,{}),e(r,{role:"menuitemradio","data-group":"zoom",checked:!0,children:"100%"}),e(r,{role:"menuitemradio","data-group":"zoom",children:"125%"}),e(r,{role:"menuitemradio","data-group":"zoom",children:"150%"})]}),t("div",{slot:"content",children:[e(E,{children:"Workspace"}),e(r,{children:"Profile settings"}),e(r,{children:"Team access"}),e(c,{}),e(r,{tone:"danger",children:"Sign out"})]})]})}function i(n){const l=t(a,{style:{gap:12},children:[e(h,{style:{minHeight:120,borderRadius:16,border:"2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent)",background:"linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)",display:"grid",placeItems:"center",padding:24},children:t(g,{selected:1,closeOnSelect:!1,variant:n.variant,size:n.size,radius:n.radius,elevation:n.elevation,tone:n.tone,style:{maxWidth:"fit-content"},children:[e("button",{slot:"item",children:"File"}),e("button",{slot:"item",children:"Edit"}),e("button",{slot:"item",children:"View"}),e("button",{slot:"item",children:"Profiles"}),e(B,{})]})}),n.label?e("div",{style:{fontSize:13,color:"#64748b",textAlign:"center"},children:n.label}):null]});return n.palette?e(N,{tokens:W(n.palette),children:l}):l}function j(){const[n,l]=p.useState("theme");return t(a,{style:{gap:20,maxInlineSize:1280},children:[e("div",{children:e("div",{style:{fontSize:44,lineHeight:1.05,fontWeight:700,color:"#111827"},children:"Menubar"})}),t(b,{style:{gap:28,borderBottom:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)"},children:[e(f,{active:n==="theme",onClick:()=>l("theme"),children:"Theme colors"}),e(f,{active:n==="colors",onClick:()=>l("colors"),children:"All colors"}),e(f,{active:n==="sizes",onClick:()=>l("sizes"),children:"All sizes"})]}),n==="theme"?e(a,{style:{gap:22},children:t(a,{style:{gridTemplateColumns:"120px repeat(4, minmax(240px, 1fr))",gap:18,alignItems:"start"},children:[e("div",{style:{fontSize:18,color:"#5b6574"},children:"Solid"}),e(i,{variant:"solid",size:"md",elevation:"low",palette:"blue"}),e(i,{variant:"solid",size:"md",elevation:"low",palette:"blue",tone:"neutral"}),e(i,{variant:"solid",size:"md",elevation:"low",palette:"gray"}),e(i,{variant:"solid",size:"md",elevation:"low",palette:"gray",tone:"neutral"}),e("div",{style:{fontSize:18,color:"#5b6574"},children:"Soft"}),e(i,{variant:"soft",size:"md",elevation:"low",palette:"blue"}),e(i,{variant:"soft",size:"md",elevation:"low",palette:"blue",tone:"neutral"}),e(i,{variant:"soft",size:"md",elevation:"low",palette:"gray"}),e(i,{variant:"soft",size:"md",elevation:"low",palette:"gray",tone:"neutral"})]})}):null,n==="colors"?e(a,{style:{gap:16},children:t(a,{style:{gridTemplateColumns:"120px repeat(2, minmax(260px, 1fr))",gap:18,alignItems:"start"},children:[e("div",{}),e("div",{style:{textAlign:"center",fontSize:18,color:"#5b6574"},children:"Solid"}),e("div",{style:{textAlign:"center",fontSize:18,color:"#5b6574"},children:"Soft"}),["gray","amber","red","purple","blue","green"].map(o=>t(p.Fragment,{children:[e("div",{style:{fontSize:18,color:"#5b6574",textTransform:"capitalize"},children:o}),e(i,{variant:"solid",size:"md",elevation:"low",palette:o}),e(i,{variant:"soft",size:"md",elevation:"low",palette:o})]},o))]})}):null,n==="sizes"?e(a,{style:{gap:18},children:t(a,{style:{gridTemplateColumns:"120px repeat(2, minmax(280px, 1fr))",gap:18,alignItems:"start"},children:[e("div",{}),e("div",{style:{textAlign:"center",fontSize:18,color:"#5b6574"},children:"Solid"}),e("div",{style:{textAlign:"center",fontSize:18,color:"#5b6574"},children:"Soft"}),["1","2","3"].map(o=>t(p.Fragment,{children:[t("div",{style:{fontSize:18,color:"#5b6574"},children:["Size ",o]}),e(i,{variant:"solid",size:o,elevation:"low",palette:"blue"}),e(i,{variant:"soft",size:o,elevation:"low",palette:"blue"})]},o))]})}):null]})}const d={render:()=>e(j,{})},u={render:n=>{const[l,o]=p.useState({open:!1,selected:1});return e(a,{style:{gap:16,maxInlineSize:1040},children:t(P,{radius:18,children:[t(F,{children:[e(O,{children:"Production menubar surface"}),e(A,{children:"A baseline-token driven menubar with real panels, hover-open submenus, selection modes, and palette-aware variants."})]}),t(h,{slot:"inset",style:{padding:16,display:"grid",gap:16},children:[e(h,{style:{minHeight:240,borderRadius:18,border:"2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent)",background:"linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)",display:"grid",placeItems:"center",padding:24},children:t(g,{...n,selected:l.selected,open:l.open,onOpen:s=>o({open:!0,selected:s}),onClose:()=>o(s=>({...s,open:!1})),onChange:s=>o({open:s.open,selected:s.selected}),closeOnSelect:!1,children:[e("button",{slot:"item",children:"File"}),e("button",{slot:"item",children:"Edit"}),e("button",{slot:"item",children:"View"}),e("button",{slot:"item",children:"Profiles"}),e(B,{})]})}),t(b,{align:"center",justify:"space-between",style:{gap:12,flexWrap:"wrap"},children:[t(b,{align:"center",style:{gap:8,flexWrap:"wrap"},children:[e(H,{variant:"secondary",onClick:()=>o({open:!l.open,selected:l.selected}),children:l.open?"Close panel":"Open panel"}),t(v,{tone:"info",children:["selected: ",l.selected]})]}),t(v,{tone:"neutral",children:["open: ",String(l.open)]})]})]})]})})}},m={render:()=>t(b,{style:{display:"flex",gap:18,padding:24,alignItems:"flex-start"},children:[t(g,{orientation:"vertical",open:!0,selected:0,variant:"soft",size:"lg",radius:16,elevation:"low",style:{width:260},children:[e("button",{slot:"item",children:"Project"}),e("button",{slot:"item",children:"Team"}),e("button",{slot:"item",children:"Settings"}),t("div",{slot:"content",children:[e(r,{children:"Overview"}),e(r,{children:"Files"}),e(r,{children:"Activity"})]}),t("div",{slot:"content",children:[e(r,{children:"Members"}),e(r,{children:"Roles"}),e(r,{children:"Invites"})]}),t("div",{slot:"content",children:[e(r,{children:"Preferences"}),e(r,{children:"Billing"}),e(r,{children:"API keys"})]})]}),e(h,{style:{fontSize:13,color:"#64748b",maxInlineSize:280},children:"Vertical mode works for command strips, editor side rails, and compact admin tool clusters."})]})};var y,S,w;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <MenubarMatrixStory />
}`,...(w=(S=d.parameters)==null?void 0:S.docs)==null?void 0:w.source}}};var M,I,z;u.parameters={...u.parameters,docs:{...(M=u.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: args => {
    const [state, setState] = React.useState({
      open: false,
      selected: 1
    });
    return <Grid style={{
      gap: 16,
      maxInlineSize: 1040
    }}>
        <Card radius={18}>
          <CardHeader>
            <CardTitle>Production menubar surface</CardTitle>
            <CardDescription>
              A baseline-token driven menubar with real panels, hover-open submenus, selection modes, and palette-aware variants.
            </CardDescription>
          </CardHeader>
          <Box slot="inset" style={{
          padding: 16,
          display: 'grid',
          gap: 16
        }}>
            <Box style={{
            minHeight: 240,
            borderRadius: 18,
            border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent)',
            background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
            display: 'grid',
            placeItems: 'center',
            padding: 24
          }}>
              <Menubar {...args} selected={state.selected} open={state.open} onOpen={selected => setState({
              open: true,
              selected
            })} onClose={() => setState(current => ({
              ...current,
              open: false
            }))} onChange={detail => setState({
              open: detail.open,
              selected: detail.selected
            })} closeOnSelect={false}>
                <button slot="item">File</button>
                <button slot="item">Edit</button>
                <button slot="item">View</button>
                <button slot="item">Profiles</button>
                <MenubarContent />
              </Menubar>
            </Box>

            <Flex align="center" justify="space-between" style={{
            gap: 12,
            flexWrap: 'wrap'
          }}>
              <Flex align="center" style={{
              gap: 8,
              flexWrap: 'wrap'
            }}>
                <Button variant="secondary" onClick={() => setState({
                open: !state.open,
                selected: state.selected
              })}>
                  {state.open ? 'Close panel' : 'Open panel'}
                </Button>
                <Badge tone="info">selected: {state.selected}</Badge>
              </Flex>
              <Badge tone="neutral">open: {String(state.open)}</Badge>
            </Flex>
          </Box>
        </Card>
      </Grid>;
  }
}`,...(z=(I=u.parameters)==null?void 0:I.docs)==null?void 0:z.source}}};var C,k,T;m.parameters={...m.parameters,docs:{...(C=m.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <Flex style={{
    display: 'flex',
    gap: 18,
    padding: 24,
    alignItems: 'flex-start'
  }}>
      <Menubar orientation="vertical" open selected={0} variant="soft" size="lg" radius={16} elevation="low" style={{
      width: 260
    }}>
        <button slot="item">Project</button>
        <button slot="item">Team</button>
        <button slot="item">Settings</button>

        <div slot="content">
          <MenuItem>Overview</MenuItem>
          <MenuItem>Files</MenuItem>
          <MenuItem>Activity</MenuItem>
        </div>
        <div slot="content">
          <MenuItem>Members</MenuItem>
          <MenuItem>Roles</MenuItem>
          <MenuItem>Invites</MenuItem>
        </div>
        <div slot="content">
          <MenuItem>Preferences</MenuItem>
          <MenuItem>Billing</MenuItem>
          <MenuItem>API keys</MenuItem>
        </div>
      </Menubar>

      <Box style={{
      fontSize: 13,
      color: '#64748b',
      maxInlineSize: 280
    }}>
        Vertical mode works for command strips, editor side rails, and compact admin tool clusters.
      </Box>
    </Flex>
}`,...(T=(k=m.parameters)==null?void 0:k.docs)==null?void 0:T.source}}};const _=["ThemeTokenMatrix","Playground","Vertical"];export{u as Playground,d as ThemeTokenMatrix,m as Vertical,_ as __namedExportsOrder,L as default};
