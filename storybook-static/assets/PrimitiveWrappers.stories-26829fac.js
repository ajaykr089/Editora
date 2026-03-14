import{a as e,j as t,F as v,b as r,B as f,a_ as M,a$ as D,b0 as j,b1 as $,b2 as G,b3 as U,b4 as q}from"./index-ce0e40fa.js";import{R as c}from"./index-93f6b7ae.js";import{S as _,a as K,b as N,c as C}from"./storybook-showcase-2b62d73c.js";import"./index-c197feae.js";const ne={title:"UI/Primitive Wrappers"},B={display:"grid",gap:18,maxWidth:980,padding:24,border:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent)",borderRadius:20,background:"var(--ui-color-surface, #ffffff)",boxShadow:"0 18px 42px rgba(15, 23, 42, 0.08)"},R={display:"grid",gap:12,padding:16,border:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)",borderRadius:14,background:"color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, #eff6ff 4%)"},J={width:"100%",display:"grid",gridTemplateColumns:"minmax(0, 1fr) auto",gap:12,alignItems:"center",minHeight:42,padding:"10px 12px",border:0,borderRadius:10,background:"transparent",color:"#0f172a",textAlign:"left",cursor:"pointer"},Q={justifySelf:"end",padding:"4px 6px",borderRadius:8,background:"rgba(15, 23, 42, 0.04)",fontSize:12,fontFamily:"IBM Plex Mono, SFMono-Regular, monospace",color:"#64748b"},b=()=>{const l=c.useRef(null),a=c.useRef(null),[p,n]=c.useState("3 items registered"),[o,h]=c.useState("schedule"),d=c.useCallback(()=>{var s,u;const i=((u=(s=l.current)==null?void 0:s.queryItems)==null?void 0:u.call(s))||[];n(`${i.length} items registered`)},[]),m=c.useCallback(()=>{var s,u;const i=(u=(s=a.current)==null?void 0:s.getActiveItem)==null?void 0:u.call(s);h((i==null?void 0:i.getAttribute("data-value"))||"(none)")},[]);return c.useEffect(()=>{var u;d();const i=a.current;if(!i)return;const s=((u=i.findByValue)==null?void 0:u.call(i,"schedule"))||null;s&&(i.setActiveItem(s,{focus:!1,scroll:!1}),m())},[m,d]),e(_,{eyebrow:"Infrastructure",title:"Primitive wrappers need audit surfaces too, not just product-facing components",description:"These stories are intentionally utilitarian, but they still need clean spacing, strong hierarchy, and enough framing to debug behavior without visual noise.",meta:[{label:"Collection",value:p},{label:"Active",value:o},{label:"Pattern",value:"Behavioral primitive"}],children:t(K,{eyebrow:"Collection + Listbox",title:"Item discovery and active traversal",description:"This story is for debugging low-level selection mechanics, so the surrounding presentation should stay quiet and systematic.",children:[t("div",{style:N,children:[e("span",{style:C,children:"Imperative hooks"}),e("span",{style:C,children:"Discovery"}),e("span",{style:C,children:"Traversal"})]}),t(v,{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[e(r,{size:"sm",onClick:()=>d(),children:"Refresh collection"}),e(r,{size:"sm",variant:"secondary",onClick:()=>{var i,s;(s=(i=a.current)==null?void 0:i.move)==null||s.call(i,-1,{focus:!1,scroll:!0}),m()},children:"Previous option"}),e(r,{size:"sm",variant:"secondary",onClick:()=>{var i,s;(s=(i=a.current)==null?void 0:i.move)==null||s.call(i,1,{focus:!1,scroll:!0}),m()},children:"Next option"})]}),t("div",{style:{display:"grid",gap:16,gridTemplateColumns:"minmax(240px, 280px) minmax(280px, 1fr)"},children:[t(f,{style:R,children:[e("strong",{children:"ui-collection"}),t(M,{ref:l,itemSelector:"[data-collection-item]",itemRole:"option",onCollectionChange:d,children:[e("div",{"data-collection-item":!0,"data-value":"schedule",children:"Schedule publish"}),e("div",{"data-collection-item":!0,"data-value":"duplicate",children:"Duplicate release"}),e("div",{"data-collection-item":!0,"data-value":"archive",children:"Archive draft"})]}),e("div",{style:{fontSize:13,color:"#64748b"},children:p})]}),t(f,{style:R,children:[e("strong",{children:"ui-listbox"}),e(D,{ref:a,itemSelector:"[data-menu-item]",itemRole:"option",activeAttribute:"data-current",children:[["schedule","Schedule publish","⌘K"],["duplicate","Duplicate release",""],["archive","Archive draft",""]].map(([i,s,u])=>t("button",{"data-menu-item":!0,"data-value":i,style:J,onClick:V=>{var g,A;(A=(g=a.current)==null?void 0:g.setActiveItem)==null||A.call(g,V.currentTarget,{focus:!1,scroll:!1}),m()},children:[e("span",{children:s}),u?e("span",{style:Q,children:u}):null]},i))}),t("div",{style:{fontSize:13,color:"#64748b"},children:["Active value: ",e("code",{children:o})]})]})]})]})})},y=()=>{const l=c.useRef(null),[a,p]=c.useState("Bold");return t(f,{style:B,children:[t("div",{children:[e("div",{style:{fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#64748b"},children:"Roving Focus Group"}),e("div",{style:{marginTop:8,fontSize:28,fontWeight:700,lineHeight:1.1,color:"#0f172a"},children:"Test directional focus management over a toolbar-style surface"})]}),t(v,{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[e(r,{size:"sm",onClick:()=>{var n,o;return(o=(n=l.current)==null?void 0:n.focusBoundary)==null?void 0:o.call(n,"first",{focus:!0})},children:"First item"}),e(r,{size:"sm",variant:"secondary",onClick:()=>{var n,o;return(o=(n=l.current)==null?void 0:n.move)==null?void 0:o.call(n,-1,{focus:!0})},children:"Move left"}),e(r,{size:"sm",variant:"secondary",onClick:()=>{var n,o;return(o=(n=l.current)==null?void 0:n.move)==null?void 0:o.call(n,1,{focus:!0})},children:"Move right"})]}),t(f,{style:R,children:[e(j,{ref:l,itemSelector:"[data-tool]",activeAttribute:"data-current",onActiveItemChange:n=>{var h,d;const o=(d=(h=n.item)==null?void 0:h.textContent)==null?void 0:d.trim();o&&p(o)},children:e(v,{style:{display:"flex",gap:8,flexWrap:"wrap"},children:["Bold","Italic","Underline","Comment"].map((n,o)=>e("button",{"data-tool":!0,style:{minHeight:40,padding:"0 14px",borderRadius:10,border:"1px solid #dbe4f0",background:o===0?"#eff6ff":"#ffffff"},onClick:h=>{var d,m;return(m=(d=l.current)==null?void 0:d.setActiveItem)==null?void 0:m.call(d,h.currentTarget,{focus:!0})},children:n},n))})}),t("div",{style:{fontSize:13,color:"#64748b"},children:["Active tool: ",e("code",{children:a})]})]})]})},x=()=>{const[l,a]=c.useState(!1),[p,n]=c.useState("Closed");return t(f,{style:B,children:[t("div",{children:[e("div",{style:{fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#64748b"},children:"Dismissable Layer + Focus Scope"}),e("div",{style:{marginTop:8,fontSize:28,fontWeight:700,lineHeight:1.1,color:"#0f172a"},children:"Test outside dismissal, Escape handling, and trapped focus"})]}),e(r,{size:"sm",onClick:()=>a(!0),children:"Open test layer"}),t("div",{style:{fontSize:13,color:"#64748b"},children:["Event log: ",e("code",{children:p})]}),l?e($,{open:!0,closeOnEscape:!0,closeOnPointerOutside:!0,onBeforeClose:o=>n(`before-close:${o.reason}`),onClose:o=>{n(`close:${o.reason}`),a(!1)},style:{position:"fixed",inset:0,display:"grid",placeItems:"center",background:"rgba(15, 23, 42, 0.22)",zIndex:2e3},children:e(G,{active:!0,trapped:!0,loop:!0,autoFocus:"container",onEscape:()=>{n("focus-scope:escape"),a(!1)},children:t(f,{tabIndex:-1,style:{width:360,padding:20,borderRadius:16,background:"#ffffff",boxShadow:"0 24px 48px rgba(15, 23, 42, 0.18)",display:"grid",gap:12},children:[e("strong",{children:"Primitive test surface"}),e("div",{style:{fontSize:13,color:"#64748b"},children:"Use Tab and Escape here to validate focus containment and dismissal behavior."}),e("input",{placeholder:"First field",style:{minHeight:38,padding:"0 12px",borderRadius:10,border:"1px solid #cbd5e1"}}),e("input",{placeholder:"Second field",style:{minHeight:38,padding:"0 12px",borderRadius:10,border:"1px solid #cbd5e1"}}),t(v,{style:{display:"flex",gap:8,justifyContent:"flex-end"},children:[e(r,{size:"sm",variant:"secondary",onClick:()=>a(!1),children:"Close"}),e(r,{size:"sm",children:"Confirm"})]})]})})}):null]})},S=()=>{const[l,a]=c.useState(!1),[p,n]=c.useState("bottom-start");return t(f,{style:B,children:[t("div",{children:[e("div",{style:{fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#64748b"},children:"Positioner + Anchor"}),e("div",{style:{marginTop:8,fontSize:28,fontWeight:700,lineHeight:1.1,color:"#0f172a"},children:"Test anchored floating layout with live placement updates"})]}),t(v,{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[e(r,{size:"sm",onClick:()=>a(o=>!o),children:l?"Hide layer":"Show layer"}),e(r,{size:"sm",variant:"secondary",onClick:()=>n("top-start"),children:"Top start"}),e(r,{size:"sm",variant:"secondary",onClick:()=>n("bottom-start"),children:"Bottom start"}),e(r,{size:"sm",variant:"secondary",onClick:()=>n("right-start"),children:"Right start"})]}),e(f,{style:{minHeight:260,borderRadius:18,border:"1px dashed #94a3b8",background:"linear-gradient(180deg, #f8fafc, #eef2ff)",display:"grid",placeItems:"center",padding:24},children:t(U,{open:l,placement:p,offset:10,shift:!0,fitViewport:!0,onPositionChange:o=>n(o.placement),children:[e(q,{slot:"anchor",children:e(r,{children:"Anchored trigger"})}),t(f,{slot:"content",style:{minWidth:240,padding:14,borderRadius:14,border:"1px solid #cbd5e1",background:"#ffffff",boxShadow:"0 22px 48px rgba(15, 23, 42, 0.14)"},children:[e("strong",{children:"Positioned surface"}),t("div",{style:{marginTop:8,fontSize:13,color:"#64748b"},children:["Current placement: ",e("code",{children:p})]})]})]})})]})};var z,k,w;b.parameters={...b.parameters,docs:{...(z=b.parameters)==null?void 0:z.docs,source:{originalSource:`() => {
  const collectionRef = React.useRef<HTMLElement | null>(null);
  const listboxRef = React.useRef<HTMLElement | null>(null);
  const [collectionInfo, setCollectionInfo] = React.useState('3 items registered');
  const [activeValue, setActiveValue] = React.useState('schedule');
  const updateCollectionInfo = React.useCallback(() => {
    const items = ((collectionRef.current as any)?.queryItems?.() || []) as HTMLElement[];
    setCollectionInfo(\`\${items.length} items registered\`);
  }, []);
  const syncActiveValue = React.useCallback(() => {
    const active = (listboxRef.current as any)?.getActiveItem?.() as HTMLElement | null;
    setActiveValue(active?.getAttribute('data-value') || '(none)');
  }, []);
  React.useEffect(() => {
    updateCollectionInfo();
    const listbox = listboxRef.current as any;
    if (!listbox) return;
    const first = listbox.findByValue?.('schedule') || null;
    if (first) {
      listbox.setActiveItem(first, {
        focus: false,
        scroll: false
      });
      syncActiveValue();
    }
  }, [syncActiveValue, updateCollectionInfo]);
  return <ShowcasePage eyebrow="Infrastructure" title="Primitive wrappers need audit surfaces too, not just product-facing components" description="These stories are intentionally utilitarian, but they still need clean spacing, strong hierarchy, and enough framing to debug behavior without visual noise." meta={[{
    label: 'Collection',
    value: collectionInfo
  }, {
    label: 'Active',
    value: activeValue
  }, {
    label: 'Pattern',
    value: 'Behavioral primitive'
  }]}>
      <ShowcaseSection eyebrow="Collection + Listbox" title="Item discovery and active traversal" description="This story is for debugging low-level selection mechanics, so the surrounding presentation should stay quiet and systematic.">
        <div style={showcaseChipRowStyle}>
          <span style={showcaseChipStyle}>Imperative hooks</span>
          <span style={showcaseChipStyle}>Discovery</span>
          <span style={showcaseChipStyle}>Traversal</span>
        </div>

        <Flex style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }}>
          <Button size="sm" onClick={() => updateCollectionInfo()}>
            Refresh collection
          </Button>
          <Button size="sm" variant="secondary" onClick={() => {
          (listboxRef.current as any)?.move?.(-1, {
            focus: false,
            scroll: true
          });
          syncActiveValue();
        }}>
            Previous option
          </Button>
          <Button size="sm" variant="secondary" onClick={() => {
          (listboxRef.current as any)?.move?.(1, {
            focus: false,
            scroll: true
          });
          syncActiveValue();
        }}>
            Next option
          </Button>
        </Flex>

        <div style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'minmax(240px, 280px) minmax(280px, 1fr)'
      }}>
          <Box style={panel}>
            <strong>ui-collection</strong>
            <Collection ref={collectionRef} itemSelector="[data-collection-item]" itemRole="option" onCollectionChange={updateCollectionInfo}>
              <div data-collection-item data-value="schedule">Schedule publish</div>
              <div data-collection-item data-value="duplicate">Duplicate release</div>
              <div data-collection-item data-value="archive">Archive draft</div>
            </Collection>
            <div style={{
            fontSize: 13,
            color: '#64748b'
          }}>{collectionInfo}</div>
          </Box>

          <Box style={panel}>
            <strong>ui-listbox</strong>
            <Listbox ref={listboxRef} itemSelector="[data-menu-item]" itemRole="option" activeAttribute="data-current">
              {[['schedule', 'Schedule publish', '⌘K'], ['duplicate', 'Duplicate release', ''], ['archive', 'Archive draft', '']].map(([value, label, keys]) => <button key={value} data-menu-item data-value={value} style={menuButton} onClick={event => {
              (listboxRef.current as any)?.setActiveItem?.(event.currentTarget, {
                focus: false,
                scroll: false
              });
              syncActiveValue();
            }}>
                  <span>{label}</span>
                  {keys ? <span style={shortcut}>{keys}</span> : null}
                </button>)}
            </Listbox>
            <div style={{
            fontSize: 13,
            color: '#64748b'
          }}>Active value: <code>{activeValue}</code></div>
          </Box>
        </div>
      </ShowcaseSection>
    </ShowcasePage>;
}`,...(w=(k=b.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var I,T,F;y.parameters={...y.parameters,docs:{...(I=y.parameters)==null?void 0:I.docs,source:{originalSource:`() => {
  const ref = React.useRef<HTMLElement | null>(null);
  const [active, setActive] = React.useState('Bold');
  return <Box style={shell}>
      <div>
        <div style={{
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#64748b'
      }}>
          Roving Focus Group
        </div>
        <div style={{
        marginTop: 8,
        fontSize: 28,
        fontWeight: 700,
        lineHeight: 1.1,
        color: '#0f172a'
      }}>
          Test directional focus management over a toolbar-style surface
        </div>
      </div>

      <Flex style={{
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }}>
        <Button size="sm" onClick={() => (ref.current as any)?.focusBoundary?.('first', {
        focus: true
      })}>First item</Button>
        <Button size="sm" variant="secondary" onClick={() => (ref.current as any)?.move?.(-1, {
        focus: true
      })}>Move left</Button>
        <Button size="sm" variant="secondary" onClick={() => (ref.current as any)?.move?.(1, {
        focus: true
      })}>Move right</Button>
      </Flex>

      <Box style={panel}>
        <RovingFocusGroup ref={ref} itemSelector="[data-tool]" activeAttribute="data-current" onActiveItemChange={detail => {
        const label = detail.item?.textContent?.trim();
        if (label) setActive(label);
      }}>
          <Flex style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap'
        }}>
            {['Bold', 'Italic', 'Underline', 'Comment'].map((label, index) => <button key={label} data-tool style={{
            minHeight: 40,
            padding: '0 14px',
            borderRadius: 10,
            border: '1px solid #dbe4f0',
            background: index === 0 ? '#eff6ff' : '#ffffff'
          }} onClick={event => (ref.current as any)?.setActiveItem?.(event.currentTarget, {
            focus: true
          })}>
                {label}
              </button>)}
          </Flex>
        </RovingFocusGroup>
        <div style={{
        fontSize: 13,
        color: '#64748b'
      }}>Active tool: <code>{active}</code></div>
      </Box>
    </Box>;
}`,...(F=(T=y.parameters)==null?void 0:T.docs)==null?void 0:F.source}}};var P,W,L;x.parameters={...x.parameters,docs:{...(P=x.parameters)==null?void 0:P.docs,source:{originalSource:`() => {
  const [open, setOpen] = React.useState(false);
  const [log, setLog] = React.useState('Closed');
  return <Box style={shell}>
      <div>
        <div style={{
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#64748b'
      }}>
          Dismissable Layer + Focus Scope
        </div>
        <div style={{
        marginTop: 8,
        fontSize: 28,
        fontWeight: 700,
        lineHeight: 1.1,
        color: '#0f172a'
      }}>
          Test outside dismissal, Escape handling, and trapped focus
        </div>
      </div>

      <Button size="sm" onClick={() => setOpen(true)}>Open test layer</Button>
      <div style={{
      fontSize: 13,
      color: '#64748b'
    }}>Event log: <code>{log}</code></div>

      {open ? <DismissableLayer open closeOnEscape closeOnPointerOutside onBeforeClose={detail => setLog(\`before-close:\${detail.reason}\`)} onClose={detail => {
      setLog(\`close:\${detail.reason}\`);
      setOpen(false);
    }} style={{
      position: 'fixed',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(15, 23, 42, 0.22)',
      zIndex: 2000
    }}>
          <FocusScope active trapped loop autoFocus="container" onEscape={() => {
        setLog('focus-scope:escape');
        setOpen(false);
      }}>
            <Box tabIndex={-1} style={{
          width: 360,
          padding: 20,
          borderRadius: 16,
          background: '#ffffff',
          boxShadow: '0 24px 48px rgba(15, 23, 42, 0.18)',
          display: 'grid',
          gap: 12
        }}>
              <strong>Primitive test surface</strong>
              <div style={{
            fontSize: 13,
            color: '#64748b'
          }}>Use Tab and Escape here to validate focus containment and dismissal behavior.</div>
              <input placeholder="First field" style={{
            minHeight: 38,
            padding: '0 12px',
            borderRadius: 10,
            border: '1px solid #cbd5e1'
          }} />
              <input placeholder="Second field" style={{
            minHeight: 38,
            padding: '0 12px',
            borderRadius: 10,
            border: '1px solid #cbd5e1'
          }} />
              <Flex style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'flex-end'
          }}>
                <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Close</Button>
                <Button size="sm">Confirm</Button>
              </Flex>
            </Box>
          </FocusScope>
        </DismissableLayer> : null}
    </Box>;
}`,...(L=(W=x.parameters)==null?void 0:W.docs)==null?void 0:L.source}}};var H,E,O;S.parameters={...S.parameters,docs:{...(H=S.parameters)==null?void 0:H.docs,source:{originalSource:`() => {
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState('bottom-start');
  return <Box style={shell}>
      <div>
        <div style={{
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#64748b'
      }}>
          Positioner + Anchor
        </div>
        <div style={{
        marginTop: 8,
        fontSize: 28,
        fontWeight: 700,
        lineHeight: 1.1,
        color: '#0f172a'
      }}>
          Test anchored floating layout with live placement updates
        </div>
      </div>

      <Flex style={{
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }}>
        <Button size="sm" onClick={() => setOpen(value => !value)}>{open ? 'Hide layer' : 'Show layer'}</Button>
        <Button size="sm" variant="secondary" onClick={() => setPlacement('top-start')}>Top start</Button>
        <Button size="sm" variant="secondary" onClick={() => setPlacement('bottom-start')}>Bottom start</Button>
        <Button size="sm" variant="secondary" onClick={() => setPlacement('right-start')}>Right start</Button>
      </Flex>

      <Box style={{
      minHeight: 260,
      borderRadius: 18,
      border: '1px dashed #94a3b8',
      background: 'linear-gradient(180deg, #f8fafc, #eef2ff)',
      display: 'grid',
      placeItems: 'center',
      padding: 24
    }}>
        <Positioner open={open} placement={placement as any} offset={10} shift fitViewport onPositionChange={detail => setPlacement(detail.placement)}>
          <Anchor slot="anchor">
            <Button>Anchored trigger</Button>
          </Anchor>
          <Box slot="content" style={{
          minWidth: 240,
          padding: 14,
          borderRadius: 14,
          border: '1px solid #cbd5e1',
          background: '#ffffff',
          boxShadow: '0 22px 48px rgba(15, 23, 42, 0.14)'
        }}>
            <strong>Positioned surface</strong>
            <div style={{
            marginTop: 8,
            fontSize: 13,
            color: '#64748b'
          }}>
              Current placement: <code>{placement}</code>
            </div>
          </Box>
        </Positioner>
      </Box>
    </Box>;
}`,...(O=(E=S.parameters)==null?void 0:E.docs)==null?void 0:O.source}}};const te=["CollectionAndListbox","RovingFocusToolbar","LayerAndFocusScope","PositionerAndAnchor"];export{b as CollectionAndListbox,x as LayerAndFocusScope,S as PositionerAndAnchor,y as RovingFocusToolbar,te as __namedExportsOrder,ne as default};
