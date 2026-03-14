import{r as l,j as t,B as i,a as e,b as s,G as d,F as g}from"./index-c1b18327.js";import{r as c}from"./index-93f6b7ae.js";const W={title:"UI/Drawer",component:l,argTypes:{open:{control:"boolean"},side:{control:"select",options:["left","right","top","bottom","start","end"]},dismissible:{control:"boolean"},variant:{control:"select",options:["default","solid","flat","line","glass","contrast"]},density:{control:"select",options:["default","compact","comfortable"]},shape:{control:"select",options:["default","square","soft"]},elevation:{control:"select",options:["default","none","low","high"]},tone:{control:"select",options:["default","brand","danger","success","warning"]},size:{control:"select",options:["default","sm","lg"]},inset:{control:"boolean"}}},a=o=>{const[n,r]=c.useState(!!o.open);return t(i,{style:{minHeight:220},children:[e(s,{onClick:()=>r(!0),children:"Open drawer"}),t(l,{open:n,side:o.side,dismissible:o.dismissible,variant:o.variant,density:o.density,shape:o.shape,elevation:o.elevation,tone:o.tone,size:o.size,inset:o.inset,onChange:r,children:[e(i,{slot:"header",style:{fontWeight:700},children:"Filters"}),t(d,{style:{display:"grid",gap:10},children:[t("label",{children:[e("input",{type:"checkbox",defaultChecked:!0})," Active only"]}),t("label",{children:[e("input",{type:"checkbox"})," Include archived"]}),t("label",{children:[e("input",{type:"checkbox"})," Assigned to me"]})]}),t(g,{slot:"footer",style:{display:"flex",gap:8},children:[e(s,{size:"sm",variant:"secondary",onClick:()=>r(!1),children:"Cancel"}),e(s,{size:"sm",onClick:()=>r(!1),children:"Apply"})]})]})]})};a.args={open:!1,side:"left",dismissible:!0,variant:"default",density:"default",shape:"default",elevation:"default",tone:"default",size:"default",inset:!1};const p=()=>{const[o,n]=c.useState("default");return t(d,{style:{display:"grid",gap:12},children:[t(g,{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[e(s,{size:"sm",onClick:()=>n("default"),children:"Default"}),e(s,{size:"sm",onClick:()=>n("square"),children:"Square Flat"}),e(s,{size:"sm",onClick:()=>n("line"),children:"Line Inset"}),e(s,{size:"sm",onClick:()=>n("comfortable"),children:"Comfortable"}),e(s,{size:"sm",onClick:()=>n("glass"),children:"Glass"}),e(s,{size:"sm",onClick:()=>n("contrast"),children:"Contrast"})]}),t(l,{open:o==="default",side:"left",dismissible:!0,onChange:r=>!r&&n(null),children:[e(i,{slot:"header",children:"Default / Soft"}),e("p",{style:{margin:0},children:"Balanced admin panel style."}),e(i,{slot:"footer",children:e(s,{size:"sm",onClick:()=>n(null),children:"Close"})})]}),t(l,{open:o==="square",side:"right",dismissible:!0,variant:"flat",elevation:"none",shape:"square",density:"compact",onChange:r=>!r&&n(null),children:[e(i,{slot:"header",children:"Square / Flat / Compact"}),e("p",{style:{margin:0},children:"Sharp, low-ornament variant."}),e(i,{slot:"footer",children:e(s,{size:"sm",variant:"secondary",onClick:()=>n(null),children:"Close"})})]}),t(l,{open:o==="line",side:"right",dismissible:!0,variant:"line",tone:"warning",shape:"square",density:"compact",inset:!0,onChange:r=>!r&&n(null),children:[e(i,{slot:"header",children:"Line / Warning / Inset"}),e("p",{style:{margin:0},children:"Floating side panel with crisp borders and no heavy shadows."}),e(i,{slot:"footer",children:e(s,{size:"sm",variant:"secondary",onClick:()=>n(null),children:"Close"})})]}),t(l,{open:o==="comfortable",side:"left",dismissible:!0,density:"comfortable",elevation:"high",size:"lg",onChange:r=>!r&&n(null),children:[e(i,{slot:"header",children:"Comfortable / Large"}),e("p",{style:{margin:0},children:"Roomier spacing for content-dense workflows."}),e(i,{slot:"footer",children:e(s,{size:"sm",onClick:()=>n(null),children:"Done"})})]}),t(l,{open:o==="glass",side:"left",dismissible:!0,variant:"glass",shape:"soft",elevation:"high",inset:!0,onChange:r=>!r&&n(null),children:[e(i,{slot:"header",children:"Glass / Soft / Inset"}),e("p",{style:{margin:0},children:"High-polish floating drawer for analytics and detail views."}),e(i,{slot:"footer",children:e(s,{size:"sm",onClick:()=>n(null),children:"Done"})})]}),t(l,{open:o==="contrast",side:"right",dismissible:!0,variant:"contrast",tone:"danger",onChange:r=>!r&&n(null),children:[e(i,{slot:"header",children:"Contrast / Danger Tone"}),e("p",{style:{margin:0},children:"High-contrast critical action panel."}),e(i,{slot:"footer",children:e(s,{size:"sm",variant:"secondary",onClick:()=>n(null),children:"Dismiss"})})]})]})},h=()=>{const[o,n]=c.useState(null);return t(d,{style:{display:"grid",gap:12},children:[t(g,{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[e(s,{size:"sm",onClick:()=>n("left"),children:"Open Left"}),e(s,{size:"sm",onClick:()=>n("right"),children:"Open Right"}),e(s,{size:"sm",onClick:()=>n("top"),children:"Open Top"}),e(s,{size:"sm",onClick:()=>n("bottom"),children:"Open Bottom"})]}),["left","right","top","bottom"].map(r=>t(l,{open:o===r,side:r,dismissible:!0,onChange:R=>{!R&&o===r&&n(null)},children:[t(i,{slot:"header",style:{fontWeight:700,textTransform:"capitalize"},children:[r," drawer"]}),t("p",{style:{margin:0},children:["Reusable panel for ",r," anchored workflows."]}),e(i,{slot:"footer",children:e(s,{size:"sm",onClick:()=>n(null),children:"Close"})})]},r))]})},u=()=>{const[o,n]=c.useState(!0);return t(l,{open:o,side:"right",dismissible:!0,onChange:n,style:{"--ui-drawer-width":"420px","--ui-drawer-bg":"#0f172a","--ui-drawer-color":"#e2e8f0","--ui-drawer-border":"#1e293b","--ui-drawer-overlay":"rgba(2, 6, 23, 0.72)"},children:[e(i,{slot:"header",style:{fontWeight:700},children:"Dark Drawer"}),e("p",{style:{margin:0,color:"#cbd5e1"},children:"Use tokens to align drawer with your dashboard theme."}),e(i,{slot:"footer",children:e(s,{size:"sm",variant:"secondary",onClick:()=>n(!1),children:"Close"})})]})},m=()=>{const[o,n]=c.useState(!1);return t(d,{style:{display:"grid",gap:12,minHeight:280},children:[t(i,{style:{border:"1px solid #dbeafe",borderRadius:12,background:"#f8fbff",color:"#1e3a8a",fontSize:13,padding:12,lineHeight:1.5},children:["Focus trap keys: ",e("strong",{children:"Tab / Shift+Tab"})," keep focus inside drawer while open. Dismiss keys: ",e("strong",{children:"Escape"})," closes when ",e("code",{children:"dismissible"})," is enabled. RTL note: set ",e("code",{children:'dir="rtl"'})," on container to validate mirrored layout and text flow."]}),e(g,{style:{display:"flex",gap:8},children:e(s,{onClick:()=>n(!0),children:"Open LTR Drawer"})}),t(l,{open:o,side:"left",dismissible:!0,onChange:n,children:[e(i,{slot:"header",style:{fontWeight:700},children:"Keyboard & Focus"}),t(d,{style:{display:"grid",gap:10},children:[e(s,{size:"sm",children:"Primary Action"}),e(s,{size:"sm",variant:"secondary",children:"Secondary Action"})]}),e(i,{slot:"footer",children:e(s,{size:"sm",onClick:()=>n(!1),children:"Close"})})]}),t(i,{dir:"rtl",style:{border:"1px solid #e2e8f0",borderRadius:12,padding:12},children:[e("h4",{style:{margin:"0 0 10px"},children:"RTL Preview"}),t(l,{open:!0,side:"right",dismissible:!0,onChange:()=>{},children:[e(i,{slot:"header",style:{fontWeight:700},children:"RTL Header"}),e("p",{style:{margin:0},children:"Drawer in RTL context with right-side anchor."}),e(i,{slot:"footer",children:e(s,{size:"sm",variant:"secondary",children:"Close"})})]})]})]})};var f,y,x;a.parameters={...a.parameters,docs:{...(f=a.parameters)==null?void 0:f.docs,source:{originalSource:`(args: any) => {
  const [open, setOpen] = useState(!!args.open);
  return <Box style={{
    minHeight: 220
  }}>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>

      <Drawer open={open} side={args.side} dismissible={args.dismissible} variant={args.variant} density={args.density} shape={args.shape} elevation={args.elevation} tone={args.tone} size={args.size} inset={args.inset} onChange={setOpen}>
        <Box slot="header" style={{
        fontWeight: 700
      }}>Filters</Box>
        <Grid style={{
        display: 'grid',
        gap: 10
      }}>
          <label><input type="checkbox" defaultChecked /> Active only</label>
          <label><input type="checkbox" /> Include archived</label>
          <label><input type="checkbox" /> Assigned to me</label>
        </Grid>
        <Flex slot="footer" style={{
        display: 'flex',
        gap: 8
      }}>
          <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={() => setOpen(false)}>Apply</Button>
        </Flex>
      </Drawer>
    </Box>;
}`,...(x=(y=a.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};var B,b,C;p.parameters={...p.parameters,docs:{...(B=p.parameters)==null?void 0:B.docs,source:{originalSource:`() => {
  const [open, setOpen] = useState<string | null>('default');
  return <Grid style={{
    display: 'grid',
    gap: 12
  }}>
      <Flex style={{
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }}>
        <Button size="sm" onClick={() => setOpen('default')}>Default</Button>
        <Button size="sm" onClick={() => setOpen('square')}>Square Flat</Button>
        <Button size="sm" onClick={() => setOpen('line')}>Line Inset</Button>
        <Button size="sm" onClick={() => setOpen('comfortable')}>Comfortable</Button>
        <Button size="sm" onClick={() => setOpen('glass')}>Glass</Button>
        <Button size="sm" onClick={() => setOpen('contrast')}>Contrast</Button>
      </Flex>

      <Drawer open={open === 'default'} side="left" dismissible onChange={next => !next && setOpen(null)}>
        <Box slot="header">Default / Soft</Box>
        <p style={{
        margin: 0
      }}>Balanced admin panel style.</p>
        <Box slot="footer"><Button size="sm" onClick={() => setOpen(null)}>Close</Button></Box>
      </Drawer>

      <Drawer open={open === 'square'} side="right" dismissible variant="flat" elevation="none" shape="square" density="compact" onChange={next => !next && setOpen(null)}>
        <Box slot="header">Square / Flat / Compact</Box>
        <p style={{
        margin: 0
      }}>Sharp, low-ornament variant.</p>
        <Box slot="footer"><Button size="sm" variant="secondary" onClick={() => setOpen(null)}>Close</Button></Box>
      </Drawer>

      <Drawer open={open === 'line'} side="right" dismissible variant="line" tone="warning" shape="square" density="compact" inset onChange={next => !next && setOpen(null)}>
        <Box slot="header">Line / Warning / Inset</Box>
        <p style={{
        margin: 0
      }}>Floating side panel with crisp borders and no heavy shadows.</p>
        <Box slot="footer"><Button size="sm" variant="secondary" onClick={() => setOpen(null)}>Close</Button></Box>
      </Drawer>

      <Drawer open={open === 'comfortable'} side="left" dismissible density="comfortable" elevation="high" size="lg" onChange={next => !next && setOpen(null)}>
        <Box slot="header">Comfortable / Large</Box>
        <p style={{
        margin: 0
      }}>Roomier spacing for content-dense workflows.</p>
        <Box slot="footer"><Button size="sm" onClick={() => setOpen(null)}>Done</Button></Box>
      </Drawer>

      <Drawer open={open === 'glass'} side="left" dismissible variant="glass" shape="soft" elevation="high" inset onChange={next => !next && setOpen(null)}>
        <Box slot="header">Glass / Soft / Inset</Box>
        <p style={{
        margin: 0
      }}>High-polish floating drawer for analytics and detail views.</p>
        <Box slot="footer"><Button size="sm" onClick={() => setOpen(null)}>Done</Button></Box>
      </Drawer>

      <Drawer open={open === 'contrast'} side="right" dismissible variant="contrast" tone="danger" onChange={next => !next && setOpen(null)}>
        <Box slot="header">Contrast / Danger Tone</Box>
        <p style={{
        margin: 0
      }}>High-contrast critical action panel.</p>
        <Box slot="footer"><Button size="sm" variant="secondary" onClick={() => setOpen(null)}>Dismiss</Button></Box>
      </Drawer>
    </Grid>;
}`,...(C=(b=p.parameters)==null?void 0:b.docs)==null?void 0:C.source}}};var w,k,z;h.parameters={...h.parameters,docs:{...(w=h.parameters)==null?void 0:w.docs,source:{originalSource:`() => {
  const [openSide, setOpenSide] = useState<string | null>(null);
  return <Grid style={{
    display: 'grid',
    gap: 12
  }}>
      <Flex style={{
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }}>
        <Button size="sm" onClick={() => setOpenSide('left')}>Open Left</Button>
        <Button size="sm" onClick={() => setOpenSide('right')}>Open Right</Button>
        <Button size="sm" onClick={() => setOpenSide('top')}>Open Top</Button>
        <Button size="sm" onClick={() => setOpenSide('bottom')}>Open Bottom</Button>
      </Flex>

      {(['left', 'right', 'top', 'bottom'] as const).map(side => <Drawer key={side} open={openSide === side} side={side} dismissible onChange={next => {
      if (!next && openSide === side) setOpenSide(null);
    }}>
          <Box slot="header" style={{
        fontWeight: 700,
        textTransform: 'capitalize'
      }}>{side} drawer</Box>
          <p style={{
        margin: 0
      }}>Reusable panel for {side} anchored workflows.</p>
          <Box slot="footer">
            <Button size="sm" onClick={() => setOpenSide(null)}>Close</Button>
          </Box>
        </Drawer>)}
    </Grid>;
}`,...(z=(k=h.parameters)==null?void 0:k.docs)==null?void 0:z.source}}};var v,O,D;u.parameters={...u.parameters,docs:{...(v=u.parameters)==null?void 0:v.docs,source:{originalSource:`() => {
  const [open, setOpen] = useState(true);
  return <Drawer open={open} side="right" dismissible onChange={setOpen} style={{
    ['--ui-drawer-width' as any]: '420px',
    ['--ui-drawer-bg' as any]: '#0f172a',
    ['--ui-drawer-color' as any]: '#e2e8f0',
    ['--ui-drawer-border' as any]: '#1e293b',
    ['--ui-drawer-overlay' as any]: 'rgba(2, 6, 23, 0.72)'
  }}>
      <Box slot="header" style={{
      fontWeight: 700
    }}>Dark Drawer</Box>
      <p style={{
      margin: 0,
      color: '#cbd5e1'
    }}>Use tokens to align drawer with your dashboard theme.</p>
      <Box slot="footer">
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      </Box>
    </Drawer>;
}`,...(D=(O=u.parameters)==null?void 0:O.docs)==null?void 0:D.source}}};var S,T,F;m.parameters={...m.parameters,docs:{...(S=m.parameters)==null?void 0:S.docs,source:{originalSource:`() => {
  const [open, setOpen] = useState(false);
  return <Grid style={{
    display: 'grid',
    gap: 12,
    minHeight: 280
  }}>
      <Box style={{
      border: '1px solid #dbeafe',
      borderRadius: 12,
      background: '#f8fbff',
      color: '#1e3a8a',
      fontSize: 13,
      padding: 12,
      lineHeight: 1.5
    }}>
        Focus trap keys: <strong>Tab / Shift+Tab</strong> keep focus inside drawer while open.
        Dismiss keys: <strong>Escape</strong> closes when <code>dismissible</code> is enabled.
        RTL note: set <code>dir="rtl"</code> on container to validate mirrored layout and text flow.
      </Box>

      <Flex style={{
      display: 'flex',
      gap: 8
    }}>
        <Button onClick={() => setOpen(true)}>Open LTR Drawer</Button>
      </Flex>

      <Drawer open={open} side="left" dismissible onChange={setOpen}>
        <Box slot="header" style={{
        fontWeight: 700
      }}>Keyboard & Focus</Box>
        <Grid style={{
        display: 'grid',
        gap: 10
      }}>
          <Button size="sm">Primary Action</Button>
          <Button size="sm" variant="secondary">Secondary Action</Button>
        </Grid>
        <Box slot="footer">
          <Button size="sm" onClick={() => setOpen(false)}>Close</Button>
        </Box>
      </Drawer>

      <Box dir="rtl" style={{
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      padding: 12
    }}>
        <h4 style={{
        margin: '0 0 10px'
      }}>RTL Preview</h4>
        <Drawer open side="right" dismissible onChange={() => {}}>
          <Box slot="header" style={{
          fontWeight: 700
        }}>RTL Header</Box>
          <p style={{
          margin: 0
        }}>Drawer in RTL context with right-side anchor.</p>
          <Box slot="footer">
            <Button size="sm" variant="secondary">Close</Button>
          </Box>
        </Drawer>
      </Box>
    </Grid>;
}`,...(F=(T=m.parameters)==null?void 0:T.docs)==null?void 0:F.source}}};const q=["Controlled","VisualVariants","SideVariants","TokenStyled","AccessibilityKeyboardMap"];export{m as AccessibilityKeyboardMap,a as Controlled,h as SideVariants,u as TokenStyled,p as VisualVariants,q as __namedExportsOrder,W as default};
