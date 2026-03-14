import{aa as b,a as e,j as t,G as l,M,N as A,O as B,P as H,B as p,F as d,l as f,b as F,g as W,_ as y}from"./index-ce0e40fa.js";import{R as c}from"./index-93f6b7ae.js";import{S as P,d as G,H as j,C as O,u as E}from"./icons-b73c9b18.js";import"./index-c197feae.js";const D=[{label:"Edit",shortcut:"⌘ E"},{label:"Duplicate",shortcut:"⌘ D"},{separator:!0},{label:"Archive",shortcut:"⌘ N"},{label:"More",submenu:[{label:"Move to project…"},{label:"Move to folder…"},{separator:!0},{label:"Advanced options…"}]},{separator:!0},{label:"Share"},{label:"Add to favorites"},{separator:!0},{label:"Delete",shortcut:"⌘ ⌫",tone:"danger"}],q={title:"UI/ContextMenu",component:b,args:{variant:"surface",size:"md",radius:12,elevation:"low",tone:"default",state:"idle",closeOnSelect:!0,closeOnEscape:!0,typeahead:!0,disabled:!1},argTypes:{variant:{control:"select",options:["surface","soft","solid","outline","contrast","flat"]},size:{control:"select",options:["sm","md","lg","1","2","3"]},radius:{control:"text"},elevation:{control:"select",options:["none","low","high"]},tone:{control:"select",options:["default","neutral","info","success","warning","danger"]},state:{control:"select",options:["idle","loading","error","success"]},closeOnSelect:{control:"boolean"},closeOnEscape:{control:"boolean"},typeahead:{control:"boolean"},disabled:{control:"boolean"}}};function x(n){return e("button",{type:"button",onClick:n.onClick,style:{appearance:"none",border:"none",borderBottom:n.active?"3px solid var(--ui-color-primary, #2563eb)":"3px solid transparent",background:"transparent",color:n.active?"var(--ui-color-text, #0f172a)":"var(--ui-color-muted, #64748b)",padding:"14px 4px 12px",font:"600 15px/1.4 inherit",cursor:"pointer"},children:n.children})}function U(n){return n==="purple"?y({colors:{primary:"#8b5cf6",primaryHover:"#7c3aed",focusRing:"#8b5cf6"},palette:{accent:{1:"#fdfcff",2:"#faf7ff",3:"#f3ecff",4:"#eadcff",5:"#ddc7ff",6:"#cdb0ff",7:"#b693ff",8:"#9b70ff",9:"#8b5cf6",10:"#7c3aed",11:"#6d28d9",12:"#2e1065"},accentAlpha:{1:"#7c3aed03",2:"#7c3aed08",3:"#7c3aed14",4:"#7c3aed24",5:"#7c3aed38",6:"#7c3aed4d",7:"#7c3aed68",8:"#7c3aed8f",9:"#7c3aed",10:"#6d28d9",11:"#5b21b6",12:"#2e1065"},accentContrast:"#ffffff",accentSurface:"#f5f0ffcc",accentIndicator:"#8b5cf6",accentTrack:"#8b5cf6"}},{accentPalette:"blue",mode:"light"}):y({},{accentPalette:n,mode:"light"})}function i(n){const[r,a]=c.useState({open:!1}),u=t(p,{onContextMenu:s=>{s.preventDefault(),a({open:!0,point:{x:s.clientX,y:s.clientY}})},style:{display:"grid",placeItems:"center",minHeight:92,borderRadius:14,border:"2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 34%, transparent)",color:"color-mix(in srgb, var(--ui-color-primary, #2563eb) 70%, var(--ui-color-text, #0f172a))",background:"linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)",fontSize:17,lineHeight:"24px"},children:[n.label,e(b,{open:r.open,anchorPoint:r.point,items:D,variant:n.variant,size:n.size,tone:n.tone,radius:n.radius,elevation:n.elevation,state:n.state,onClose:()=>a(s=>({...s,open:!1}))})]});return n.palette?e(W,{tokens:U(n.palette),children:u}):u}function X(){const[n,r]=c.useState("theme");return t(l,{style:{gap:20,maxInlineSize:1280},children:[e("div",{children:e("div",{style:{fontSize:44,lineHeight:1.05,fontWeight:700,color:"#111827"},children:"Context Menu"})}),t(d,{style:{gap:28,borderBottom:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)"},children:[e(x,{active:n==="theme",onClick:()=>r("theme"),children:"Theme colors"}),e(x,{active:n==="colors",onClick:()=>r("colors"),children:"All colors"}),e(x,{active:n==="sizes",onClick:()=>r("sizes"),children:"All sizes"})]}),n==="theme"?t(l,{style:{gap:22},children:[t(l,{style:{gridTemplateColumns:"120px repeat(2, minmax(240px, 1fr)) repeat(2, minmax(240px, 1fr))",gap:18,alignItems:"center"},children:[e("div",{}),e("div",{style:{textAlign:"center",fontSize:18,color:"#5b6574"},children:"Accent"}),e("div",{}),e("div",{style:{textAlign:"center",fontSize:18,color:"#5b6574"},children:"Gray"}),e("div",{})]}),t(l,{style:{gridTemplateColumns:"120px repeat(4, minmax(240px, 1fr))",gap:18,alignItems:"center"},children:[e("div",{style:{fontSize:18,color:"#5b6574"},children:"Solid"}),e(i,{label:"Right-click here",variant:"solid",size:"md",elevation:"low",palette:"blue"}),e(i,{label:"Right-click here",variant:"solid",size:"md",elevation:"low",palette:"blue",tone:"neutral"}),e(i,{label:"Right-click here",variant:"solid",size:"md",elevation:"low",palette:"gray"}),e(i,{label:"Right-click here",variant:"solid",size:"md",elevation:"low",palette:"gray",tone:"neutral"}),e("div",{style:{fontSize:18,color:"#5b6574"},children:"Soft"}),e(i,{label:"Right-click here",variant:"soft",size:"md",elevation:"low",palette:"blue"}),e(i,{label:"Right-click here",variant:"soft",size:"md",elevation:"low",palette:"blue",tone:"neutral"}),e(i,{label:"Right-click here",variant:"soft",size:"md",elevation:"low",palette:"gray"}),e(i,{label:"Right-click here",variant:"soft",size:"md",elevation:"low",palette:"gray",tone:"neutral"})]})]}):null,n==="colors"?e(l,{style:{gap:16},children:t(l,{style:{gridTemplateColumns:"120px repeat(2, minmax(260px, 1fr))",gap:18,alignItems:"center"},children:[e("div",{}),e("div",{style:{textAlign:"center",fontSize:18,color:"#5b6574"},children:"Solid"}),e("div",{style:{textAlign:"center",fontSize:18,color:"#5b6574"},children:"Soft"}),["gray","amber","red","purple","blue","green"].map(a=>t(c.Fragment,{children:[e("div",{style:{fontSize:18,color:"#5b6574",textTransform:"capitalize"},children:a}),e(i,{label:"Right-click here",variant:"solid",size:"md",elevation:"low",palette:a}),e(i,{label:"Right-click here",variant:"soft",size:"md",elevation:"low",palette:a})]},a))]})}):null,n==="sizes"?e(l,{style:{gap:18},children:t(l,{style:{gridTemplateColumns:"120px repeat(2, minmax(280px, 1fr))",gap:18,alignItems:"center"},children:[e("div",{}),e("div",{style:{textAlign:"center",fontSize:18,color:"#5b6574"},children:"Solid"}),e("div",{style:{textAlign:"center",fontSize:18,color:"#5b6574"},children:"Soft"}),["1","2","3"].map(a=>t(c.Fragment,{children:[t("div",{style:{fontSize:18,color:"#5b6574"},children:["Size ",a]}),e(i,{label:"Right-click here",variant:"solid",size:a,elevation:"low",palette:"blue"}),e(i,{label:"Right-click here",variant:"soft",size:a,elevation:"low",palette:"blue"})]},a))]})}):null]})}const m={render:()=>e(X,{})},h={render:n=>{const[r,a]=c.useState({open:!1}),[u,s]=c.useState("No action yet");return t(l,{style:{gap:16,maxInlineSize:1040},children:[t(M,{radius:18,children:[t(A,{children:[e(B,{children:"Anchored production surface"}),e(H,{children:"Right-click the canvas to inspect the real component contract: variants, size, radius, elevation, tone, state, keyboard support, and submenu handling."})]}),t(p,{slot:"inset",style:{padding:16,display:"grid",gap:16},children:[e(p,{onContextMenu:o=>{o.preventDefault(),a({open:!0,point:{x:o.clientX,y:o.clientY}})},style:{minHeight:220,borderRadius:18,border:"2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 34%, transparent)",background:"linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)",display:"grid",placeItems:"center",padding:24},children:t(l,{style:{gap:12,justifyItems:"center",textAlign:"center"},children:[t(d,{align:"center",style:{gap:10},children:[e(P,{size:16}),e("span",{style:{fontWeight:700},children:"Critical Escalation Workspace"})]}),e("div",{style:{maxInlineSize:560,color:"#64748b",fontSize:14,lineHeight:1.6},children:"Right-click anywhere in this surface to open the context menu. The component is portaled, typeahead-aware, submenu-capable, and theme-token driven."}),e(f,{tone:"info",children:"Right-click here"})]})}),t(d,{align:"center",justify:"space-between",style:{gap:12,flexWrap:"wrap"},children:[t(d,{align:"center",style:{gap:10,flexWrap:"wrap"},children:[e(F,{variant:"secondary",onClick:()=>a(o=>({...o,open:!1})),children:"Close menu"}),e(f,{tone:"success",children:u})]}),e(d,{align:"center",style:{gap:8,flexWrap:"wrap"},children:e(f,{tone:n.state==="error"?"danger":n.state==="success"?"success":n.state==="loading"?"warning":"neutral",children:n.state})})]})]})]}),e(b,{...n,open:r.open,anchorPoint:r.point,items:D,onClose:()=>a(o=>({...o,open:!1})),onSelect:o=>{var v;s(o.label||o.value||"Unknown action"),(v=n.onSelect)==null||v.call(n,o)}})]})}},g={render:()=>{const[n,r]=c.useState({open:!1});return t(l,{style:{gap:16,maxInlineSize:920},children:[t(M,{radius:18,variant:"soft",tone:"info",children:[t(A,{children:[e(B,{children:"Structured composition"}),e(H,{children:"Use custom slotted content when the built-in `items` model is not expressive enough for mixed labels, captions, and workflow-specific states."})]}),e(p,{slot:"inset",style:{padding:16},children:e(p,{onContextMenu:a=>{a.preventDefault(),r({open:!0,point:{x:a.clientX,y:a.clientY}})},style:{minHeight:160,borderRadius:16,border:"2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 34%, transparent)",display:"grid",placeItems:"center",color:"#334155"},children:t(d,{align:"center",style:{gap:10},children:[e(G,{size:16}),e("span",{children:"Right-click the workflow card"})]})})})]}),t(b,{open:n.open,anchorPoint:n.point,variant:"soft",size:"md",radius:12,elevation:"low",onClose:()=>r(a=>({...a,open:!1})),children:[e("div",{className:"section-label",children:"Workflow actions"}),t("div",{className:"menuitem",role:"menuitem",tabIndex:0,children:[e("span",{className:"icon",children:e(j,{size:14})}),t("span",{className:"label",children:[e("span",{className:"text",children:"Open review room"}),e("span",{className:"caption",children:"Continue moderated triage"})]}),e("span",{className:"shortcut",children:"⌘ R"})]}),t("div",{className:"menuitem",role:"menuitem",tabIndex:0,children:[e("span",{className:"icon",children:e(O,{size:14})}),t("span",{className:"label",children:[e("span",{className:"text",children:"Sync operator notes"}),e("span",{className:"caption",children:"Refresh assignee comments"})]}),e("span",{className:"shortcut",children:"⌘ S"})]}),e("div",{className:"separator",role:"separator"}),t("div",{className:"menuitem",role:"menuitem",tabIndex:0,"data-tone":"danger",children:[e("span",{className:"icon",children:e(E,{size:14})}),t("span",{className:"label",children:[e("span",{className:"text",children:"Delete draft"}),e("span",{className:"caption",children:"This action cannot be undone"})]})]})]})]})}};var C,S,k;m.parameters={...m.parameters,docs:{...(C=m.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <ThemeTokenMatrixStory />
}`,...(k=(S=m.parameters)==null?void 0:S.docs)==null?void 0:k.source}}};var w,z,N;h.parameters={...h.parameters,docs:{...(w=h.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: args => {
    const [menu, setMenu] = React.useState<{
      open: boolean;
      point?: {
        x: number;
        y: number;
      };
    }>({
      open: false
    });
    const [lastAction, setLastAction] = React.useState('No action yet');
    return <Grid style={{
      gap: 16,
      maxInlineSize: 1040
    }}>
        <Card radius={18}>
          <CardHeader>
            <CardTitle>Anchored production surface</CardTitle>
            <CardDescription>
              Right-click the canvas to inspect the real component contract: variants, size, radius, elevation, tone, state, keyboard support, and submenu handling.
            </CardDescription>
          </CardHeader>
          <Box slot="inset" style={{
          padding: 16,
          display: 'grid',
          gap: 16
        }}>
            <Box onContextMenu={event => {
            event.preventDefault();
            setMenu({
              open: true,
              point: {
                x: event.clientX,
                y: event.clientY
              }
            });
          }} style={{
            minHeight: 220,
            borderRadius: 18,
            border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 34%, transparent)',
            background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
            display: 'grid',
            placeItems: 'center',
            padding: 24
          }}>
              <Grid style={{
              gap: 12,
              justifyItems: 'center',
              textAlign: 'center'
            }}>
                <Flex align="center" style={{
                gap: 10
              }}>
                  <ShieldIcon size={16} />
                  <span style={{
                  fontWeight: 700
                }}>Critical Escalation Workspace</span>
                </Flex>
                <div style={{
                maxInlineSize: 560,
                color: '#64748b',
                fontSize: 14,
                lineHeight: 1.6
              }}>
                  Right-click anywhere in this surface to open the context menu. The component is portaled, typeahead-aware, submenu-capable, and theme-token driven.
                </div>
                <Badge tone="info">Right-click here</Badge>
              </Grid>
            </Box>

            <Flex align="center" justify="space-between" style={{
            gap: 12,
            flexWrap: 'wrap'
          }}>
              <Flex align="center" style={{
              gap: 10,
              flexWrap: 'wrap'
            }}>
                <Button variant="secondary" onClick={() => setMenu(current => ({
                ...current,
                open: false
              }))}>
                  Close menu
                </Button>
                <Badge tone="success">{lastAction}</Badge>
              </Flex>
              <Flex align="center" style={{
              gap: 8,
              flexWrap: 'wrap'
            }}>
                <Badge tone={args.state === 'error' ? 'danger' : args.state === 'success' ? 'success' : args.state === 'loading' ? 'warning' : 'neutral'}>
                  {args.state}
                </Badge>
              </Flex>
            </Flex>
          </Box>
        </Card>

        <ContextMenu {...args} open={menu.open} anchorPoint={menu.point} items={baseItems as any} onClose={() => setMenu(current => ({
        ...current,
        open: false
      }))} onSelect={detail => {
        setLastAction(detail.label || detail.value || 'Unknown action');
        args.onSelect?.(detail);
      }} />
      </Grid>;
  }
}`,...(N=(z=h.parameters)==null?void 0:z.docs)==null?void 0:N.source}}};var I,R,T;g.parameters={...g.parameters,docs:{...(I=g.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => {
    const [menu, setMenu] = React.useState<{
      open: boolean;
      point?: {
        x: number;
        y: number;
      };
    }>({
      open: false
    });
    return <Grid style={{
      gap: 16,
      maxInlineSize: 920
    }}>
        <Card radius={18} variant="soft" tone="info">
          <CardHeader>
            <CardTitle>Structured composition</CardTitle>
            <CardDescription>
              Use custom slotted content when the built-in \`items\` model is not expressive enough for mixed labels, captions, and workflow-specific states.
            </CardDescription>
          </CardHeader>
          <Box slot="inset" style={{
          padding: 16
        }}>
            <Box onContextMenu={event => {
            event.preventDefault();
            setMenu({
              open: true,
              point: {
                x: event.clientX,
                y: event.clientY
              }
            });
          }} style={{
            minHeight: 160,
            borderRadius: 16,
            border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 34%, transparent)',
            display: 'grid',
            placeItems: 'center',
            color: '#334155'
          }}>
              <Flex align="center" style={{
              gap: 10
            }}>
                <SparklesIcon size={16} />
                <span>Right-click the workflow card</span>
              </Flex>
            </Box>
          </Box>
        </Card>

        <ContextMenu open={menu.open} anchorPoint={menu.point} variant="soft" size="md" radius={12} elevation="low" onClose={() => setMenu(current => ({
        ...current,
        open: false
      }))}>
          <div className="section-label">Workflow actions</div>
          <div className="menuitem" role="menuitem" tabIndex={0}>
            <span className="icon"><HomeIcon size={14} /></span>
            <span className="label">
              <span className="text">Open review room</span>
              <span className="caption">Continue moderated triage</span>
            </span>
            <span className="shortcut">⌘ R</span>
          </div>
          <div className="menuitem" role="menuitem" tabIndex={0}>
            <span className="icon"><ClipboardCheckIcon size={14} /></span>
            <span className="label">
              <span className="text">Sync operator notes</span>
              <span className="caption">Refresh assignee comments</span>
            </span>
            <span className="shortcut">⌘ S</span>
          </div>
          <div className="separator" role="separator" />
          <div className="menuitem" role="menuitem" tabIndex={0} data-tone="danger">
            <span className="icon"><TrashIcon size={14} /></span>
            <span className="label">
              <span className="text">Delete draft</span>
              <span className="caption">This action cannot be undone</span>
            </span>
          </div>
        </ContextMenu>
      </Grid>;
  }
}`,...(T=(R=g.parameters)==null?void 0:R.docs)==null?void 0:T.source}}};const J=["ThemeTokenMatrix","Playground","StructuredComposition"];export{h as Playground,g as StructuredComposition,m as ThemeTokenMatrix,J as __namedExportsOrder,q as default};
