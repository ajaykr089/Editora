import{h as c,j as r,G as d,B as i,a as e,s as m,u as f,v as g,b as o,F as t,t as a,w as y}from"./index-ce0e40fa.js";import{R as p}from"./index-93f6b7ae.js";import{R as B}from"./RichTextEditor-c94fbf83.js";import{a as D,c as I,S as E,B as O,b as T}from"./icons-b73c9b18.js";/* empty css              *//* empty css                */import"./index-c197feae.js";const q={title:"UI/Alert",component:c,parameters:{docs:{source:{type:"code"}}}};function n(u){return r(c,{...u,children:[e(m,{children:"Deployment notice"}),e(f,{children:"Production rollout windows have shifted by 20 minutes for the eu-west cluster."}),r(g,{style:{display:"inline-flex",gap:8,flexWrap:"wrap"},children:[e(o,{size:"sm",variant:"secondary",children:"Review plan"}),e(o,{size:"sm",children:"Acknowledge"})]})]})}function s(){return r(d,{style:{gap:18,maxInlineSize:1100},children:[r(i,{style:{border:"1px solid var(--ui-color-border, #d8e1ec)",borderRadius:16,padding:16,background:"var(--ui-color-surface, #fff)",display:"grid",gap:14},children:[e(i,{style:{fontSize:12,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--ui-color-muted, #64748b)"},children:"Variants"}),r(d,{style:{gap:14},children:[e(n,{variant:"surface",tone:"info",radius:12,elevation:"low"}),e(n,{variant:"outline",tone:"success",radius:12,elevation:"none"}),e(n,{variant:"soft",tone:"warning",radius:12,elevation:"none"}),e(n,{variant:"solid",tone:"danger",radius:12,elevation:"low"})]})]}),r(d,{columns:2,style:{gap:16},children:[r(i,{style:{border:"1px solid var(--ui-color-border, #d8e1ec)",borderRadius:16,padding:16,background:"var(--ui-color-surface, #fff)",display:"grid",gap:14},children:[e(i,{style:{fontSize:12,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--ui-color-muted, #64748b)"},children:"Sizes"}),e(n,{size:"sm",radius:8}),e(n,{size:"md",radius:12}),e(n,{size:"lg",radius:16})]}),r(i,{style:{border:"1px solid var(--ui-color-border, #d8e1ec)",borderRadius:16,padding:16,background:"var(--ui-color-surface, #fff)",display:"grid",gap:14},children:[e(i,{style:{fontSize:12,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--ui-color-muted, #64748b)"},children:"Radius and indicator"}),e(n,{radius:0,variant:"outline"}),e(n,{radius:4,variant:"outline"}),e(n,{radius:12,variant:"outline"}),e(n,{radius:"full",variant:"outline",indicator:"none"})]})]})]})}function G(){const[u,h]=p.useState(!0),[C,v]=p.useState(!0),[k,R]=p.useState("<p><strong>On-call note:</strong> Validate renal dosing override and confirm escalation callback.</p>");return r(d,{style:{gap:14,maxInlineSize:980},children:[e(i,{style:{border:"1px solid var(--ui-color-border, #d8e1ec)",borderRadius:16,padding:16,background:"linear-gradient(135deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 7%, #fff) 0%, var(--ui-color-surface, #fff) 42%)"},children:r(t,{align:"center",justify:"space-between",style:{gap:10,flexWrap:"wrap"},children:[r(i,{children:[e(i,{style:{fontWeight:700,fontSize:18},children:"Clinical Alert Center"}),e(i,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13,marginTop:4},children:"Enterprise alert patterns powered by `ui-core` and wrapped by `ui-react`."})]}),r(t,{align:"center",style:{gap:6,color:"var(--ui-color-muted, #64748b)",fontSize:12},children:[e(D,{size:14}),"Shift status: Active monitoring"]})]})}),u?r(c,{tone:"danger",variant:"soft",size:"md",radius:16,elevation:"low",dismissible:!0,onClose:()=>{h(!1),a.warning("Critical alert dismissed",{duration:1800,theme:"light"})},children:[e(y,{"aria-hidden":"true",style:{display:"inline-flex"},children:e(I,{size:16})}),e(m,{children:"Sepsis protocol breach detected"}),e(f,{children:"Medication administration delayed by 11 minutes in Ward 4C. Immediate physician acknowledgment required."}),r(g,{as:"div",style:{display:"flex",gap:8,flexWrap:"wrap"},children:[e(o,{size:"sm",variant:"secondary",onClick:()=>a.info("Critical alert assigned to on-call physician",{duration:1800}),children:"Assign Owner"}),e(o,{size:"sm",onClick:()=>a.success("Escalation acknowledged and action plan started",{duration:1800}),children:"Escalate Now"})]})]}):e(o,{size:"sm",variant:"secondary",onClick:()=>{h(!0),a.info("Critical alert restored",{duration:1400,theme:"light"})},children:"Restore Critical Alert"}),C?r(c,{tone:"info",variant:"outline",radius:16,elevation:"none",dismissible:!0,onClose:()=>{v(!1),a.info("Operations notice dismissed",{duration:1400,theme:"light"})},children:[e(y,{"aria-hidden":"true",style:{display:"inline-flex"},children:e(E,{size:16})}),e(m,{children:"Overnight audit reminder"}),e(f,{children:"Ensure narcotics log reconciliation is complete before 06:00 handoff."}),r(g,{as:"div",style:{display:"flex",gap:8,flexWrap:"wrap"},children:[e(o,{size:"sm",variant:"secondary",onClick:()=>a.success("Checklist opened",{duration:1200,theme:"light"}),children:"Open Checklist"}),e(o,{size:"sm",variant:"secondary",onClick:()=>a.info("Reminder snoozed for 30 minutes",{duration:1200,theme:"light"}),children:"Snooze"})]})]}):e(o,{size:"sm",variant:"secondary",onClick:()=>{v(!0),a.info("Operations notice restored",{duration:1200,theme:"light"})},children:"Restore Ops Notice"}),r(i,{style:{border:"1px solid var(--ui-color-border, #d8e1ec)",borderRadius:16,padding:12,background:"var(--ui-color-surface, #fff)",display:"grid",gap:10},children:[r(t,{justify:"space-between",align:"center",style:{gap:10,flexWrap:"wrap"},children:[r(t,{align:"center",style:{gap:8},children:[e(O,{size:14}),e(i,{style:{fontWeight:700,fontSize:14},children:"Responder Notes"})]}),r(t,{align:"center",style:{gap:6,color:"#15803d",fontSize:12},children:[e(T,{size:14}),"Rich text editor integration"]})]}),e(i,{style:{border:"1px solid #dbe4ef",borderRadius:12,minHeight:220,overflow:"hidden"},children:e(B,{value:k,onChange:R})}),r(t,{justify:"end",style:{gap:8},children:[e(o,{size:"sm",variant:"secondary",onClick:()=>a.warning("Reminder sent to ward supervisor",{duration:1500,theme:"light"}),children:"Notify Supervisor"}),e(o,{size:"sm",onClick:()=>a.success("Responder note saved",{duration:1500,theme:"light"}),children:"Save Notes"})]})]})]})}const l=G;var b,x,z;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`function BaselineStyles() {
  return <Grid style={{
    gap: 18,
    maxInlineSize: 1100
  }}>
      <Box style={{
      border: '1px solid var(--ui-color-border, #d8e1ec)',
      borderRadius: 16,
      padding: 16,
      background: 'var(--ui-color-surface, #fff)',
      display: 'grid',
      gap: 14
    }}>
        <Box style={{
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          Variants
        </Box>
        <Grid style={{
        gap: 14
      }}>
          <DemoAlert variant="surface" tone="info" radius={12} elevation="low" />
          <DemoAlert variant="outline" tone="success" radius={12} elevation="none" />
          <DemoAlert variant="soft" tone="warning" radius={12} elevation="none" />
          <DemoAlert variant="solid" tone="danger" radius={12} elevation="low" />
        </Grid>
      </Box>

      <Grid columns={2} style={{
      gap: 16
    }}>
        <Box style={{
        border: '1px solid var(--ui-color-border, #d8e1ec)',
        borderRadius: 16,
        padding: 16,
        background: 'var(--ui-color-surface, #fff)',
        display: 'grid',
        gap: 14
      }}>
          <Box style={{
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--ui-color-muted, #64748b)'
        }}>
            Sizes
          </Box>
          <DemoAlert size="sm" radius={8} />
          <DemoAlert size="md" radius={12} />
          <DemoAlert size="lg" radius={16} />
        </Box>

        <Box style={{
        border: '1px solid var(--ui-color-border, #d8e1ec)',
        borderRadius: 16,
        padding: 16,
        background: 'var(--ui-color-surface, #fff)',
        display: 'grid',
        gap: 14
      }}>
          <Box style={{
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--ui-color-muted, #64748b)'
        }}>
            Radius and indicator
          </Box>
          <DemoAlert radius={0} variant="outline" />
          <DemoAlert radius={4} variant="outline" />
          <DemoAlert radius={12} variant="outline" />
          <DemoAlert radius="full" variant="outline" indicator="none" />
        </Box>
      </Grid>
    </Grid>;
}`,...(z=(x=s.parameters)==null?void 0:x.docs)==null?void 0:z.source}}};var S,w,A;l.parameters={...l.parameters,docs:{...(S=l.parameters)==null?void 0:S.docs,source:{originalSource:"EnterpriseAlertCenter",...(A=(w=l.parameters)==null?void 0:w.docs)==null?void 0:A.source}}};const M=["BaselineStyles","EnterpriseClinicalAlerts"];export{s as BaselineStyles,l as EnterpriseClinicalAlerts,M as __namedExportsOrder,q as default};
