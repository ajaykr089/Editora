import{a,g as u,j as n,B as e,G as l,b as g,l as i}from"./index-c1b18327.js";import"./index-93f6b7ae.js";const y={title:"QA/Design Token Governance"},x={colors:{primary:"#0f62fe",primaryHover:"#0043ce",foregroundOnPrimary:"#ffffff",background:"#f8fafc",surface:"#ffffff",surfaceAlt:"#eef2ff",text:"#0f172a",muted:"#475569",border:"rgba(15, 23, 42, 0.2)",focusRing:"#0f62fe",success:"#15803d",warning:"#b45309",danger:"#b91c1c"},radius:"10px",spacing:{xs:"4px",sm:"8px",md:"12px",lg:"16px"},typography:{family:'"IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',size:{sm:"12px",md:"14px",lg:"18px"}},shadows:{sm:"0 1px 2px rgba(2,6,23,0.06)",md:"0 16px 30px rgba(2,6,23,0.12)"},motion:{durationShort:"120ms",durationBase:"180ms",durationLong:"280ms",easing:"cubic-bezier(.2,.9,.2,1)"}};function r({label:c,value:p}){return n(e,{style:{display:"grid",gap:4},children:[a(e,{style:{fontSize:12,color:"#475569"},children:c}),a(e,{style:{border:"1px solid #cbd5e1",borderRadius:8,padding:"8px 10px",fontSize:12,background:"#fff"},children:p})]})}const o=()=>a(u,{tokens:x,children:n(e,{style:{padding:18,display:"grid",gap:14,background:"var(--ui-color-background)",color:"var(--ui-color-text)"},children:[a(e,{style:{fontSize:18,fontWeight:700},children:"Design Token Governance Baseline"}),a(e,{style:{fontSize:13,color:"var(--ui-color-muted)"},children:"4px spacing rhythm + consistent radius/typography/elevation across all primitives."}),n(l,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))",gap:10},children:[a(r,{label:"Space XS",value:"4px"}),a(r,{label:"Space SM",value:"8px"}),a(r,{label:"Space MD",value:"12px"}),a(r,{label:"Space LG",value:"16px"}),a(r,{label:"Font SM",value:"12px"}),a(r,{label:"Font MD",value:"14px"}),a(r,{label:"Font LG",value:"18px"}),a(r,{label:"Radius",value:"10px"})]}),n(l,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:10},children:[n(e,{style:{border:"1px solid var(--ui-color-border)",borderRadius:"var(--ui-radius)",background:"var(--ui-color-surface)",boxShadow:"var(--ui-shadow-sm)",padding:12,display:"grid",gap:8},children:[a(e,{style:{fontWeight:600},children:"Tokenized Card"}),a(e,{style:{color:"var(--ui-color-muted)",fontSize:13},children:"Spacing, border, shadow, and typography all come from tokens."}),a(g,{size:"sm",children:"Primary Action"})]}),n(e,{style:{border:"1px solid var(--ui-color-border)",borderRadius:"var(--ui-radius)",background:"var(--ui-color-surface-alt)",boxShadow:"var(--ui-shadow-md)",padding:12,display:"grid",gap:8},children:[a(e,{style:{fontWeight:600},children:"Status Palette"}),n(e,{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[a(i,{tone:"success",variant:"soft",children:"Success"}),a(i,{tone:"warning",variant:"soft",children:"Warning"}),a(i,{tone:"danger",variant:"soft",children:"Danger"})]})]})]})]})});var s,t,d;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`() => <ThemeProvider tokens={governanceTokens as any}>
    <Box style={{
    padding: 18,
    display: 'grid',
    gap: 14,
    background: 'var(--ui-color-background)',
    color: 'var(--ui-color-text)'
  }}>
      <Box style={{
      fontSize: 18,
      fontWeight: 700
    }}>Design Token Governance Baseline</Box>
      <Box style={{
      fontSize: 13,
      color: 'var(--ui-color-muted)'
    }}>
        4px spacing rhythm + consistent radius/typography/elevation across all primitives.
      </Box>

      <Grid style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: 10
    }}>
        <Swatch label="Space XS" value="4px" />
        <Swatch label="Space SM" value="8px" />
        <Swatch label="Space MD" value="12px" />
        <Swatch label="Space LG" value="16px" />
        <Swatch label="Font SM" value="12px" />
        <Swatch label="Font MD" value="14px" />
        <Swatch label="Font LG" value="18px" />
        <Swatch label="Radius" value="10px" />
      </Grid>

      <Grid style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 10
    }}>
        <Box style={{
        border: '1px solid var(--ui-color-border)',
        borderRadius: 'var(--ui-radius)',
        background: 'var(--ui-color-surface)',
        boxShadow: 'var(--ui-shadow-sm)',
        padding: 12,
        display: 'grid',
        gap: 8
      }}>
          <Box style={{
          fontWeight: 600
        }}>Tokenized Card</Box>
          <Box style={{
          color: 'var(--ui-color-muted)',
          fontSize: 13
        }}>Spacing, border, shadow, and typography all come from tokens.</Box>
          <Button size="sm">Primary Action</Button>
        </Box>

        <Box style={{
        border: '1px solid var(--ui-color-border)',
        borderRadius: 'var(--ui-radius)',
        background: 'var(--ui-color-surface-alt)',
        boxShadow: 'var(--ui-shadow-md)',
        padding: 12,
        display: 'grid',
        gap: 8
      }}>
          <Box style={{
          fontWeight: 600
        }}>Status Palette</Box>
          <Box style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap'
        }}>
            <Badge tone="success" variant="soft">Success</Badge>
            <Badge tone="warning" variant="soft">Warning</Badge>
            <Badge tone="danger" variant="soft">Danger</Badge>
          </Box>
        </Box>
      </Grid>
    </Box>
  </ThemeProvider>`,...(d=(t=o.parameters)==null?void 0:t.docs)==null?void 0:d.source}}};const v=["ScaleParity"];export{o as ScaleParity,v as __namedExportsOrder,y as default};
