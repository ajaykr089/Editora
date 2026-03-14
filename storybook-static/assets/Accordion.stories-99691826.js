import{A as f,j as n,G as t,B as i,a as e,d as l,e as c,f as d,F as p,b as x,t as w}from"./index-ce0e40fa.js";import{R as W}from"./index-93f6b7ae.js";import{R as Z}from"./RichTextEditor-c94fbf83.js";import{A as ee,S as ne,C as ie,a as te,b as oe,c as re}from"./icons-b73c9b18.js";/* empty css              *//* empty css                */import"./index-c197feae.js";const fe={title:"UI/Accordion",component:f,parameters:{docs:{source:{type:"code"}}}},C=[{title:"Triage Summary",subtitle:"Vitals, nurse handoff, and immediate risk profile.",badge:"Priority",icon:e(ee,{size:16}),points:["Bed occupancy at 92% with two high-risk alerts.","Average triage time 11 minutes over the last 4 hours.","Pending physician acknowledgment for transfer handoff."]},{title:"Medication Safety",subtitle:"Renal dosing, interaction checks, and pharmacy clearance.",badge:"Safety",icon:e(ne,{size:16}),points:["High-risk medications reviewed for this shift.","Drug interaction clearance pending for anticoagulants.","Renal dose adjustments applied to latest lab values."]},{title:"Discharge Checklist",subtitle:"Follow-up, caregiver confirmation, and closure artifacts.",badge:"Ready",icon:e(ie,{size:16}),points:["Discharge summary signed by attending physician.","Caregiver confirmation still required before release.","Follow-up visit scheduled within 7 days."]}],u={border:"1px solid var(--ui-color-border, #d8e1ec)",borderRadius:16,padding:16,background:"var(--ui-color-surface, #fff)"},y={fontSize:12,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--ui-color-muted, #64748b)",marginBottom:10};function ae(o){return Array.isArray(o)?o.filter(a=>Number.isFinite(a)&&a>=0):Number.isFinite(o)&&o>=0?[o]:[]}function se({section:o}){return n(p,{align:"center",style:{gap:12},children:[e(i,{"aria-hidden":"true",style:{inlineSize:30,blockSize:30,borderRadius:10,display:"inline-flex",alignItems:"center",justifyContent:"center",background:"color-mix(in srgb, var(--ui-accordion-accent, #2563eb) 12%, transparent)",color:"var(--ui-accordion-accent, #2563eb)"},children:o.icon}),e(t,{style:{minWidth:0},children:e(i,{style:{fontSize:14,fontWeight:650,lineHeight:1.3},children:o.title})})]})}function r(o){return n(f,{collapsible:!0,...o,children:[n(l,{description:"What the product does",badge:"Overview",children:[e(c,{children:"What is Editora?"}),e(d,{children:"Editora is a rich text editing system with a web-component core and React wrappers."})]}),n(l,{description:"Runtime model",badge:"Core",children:[e(c,{children:"How does it work?"}),e(d,{children:"It composes token-aware web components behind React wrappers and shared theme primitives."})]}),n(l,{description:"Production guidance",badge:"Usage",children:[e(c,{children:"When should teams use it?"}),e(d,{children:"Use it for disclosure-heavy settings panels, FAQ groups, and operational workflows that need clear hierarchy."})]})]})}function S(){return n(t,{style:{gap:18,maxInlineSize:1100},children:[n(i,{style:u,children:[e(i,{style:y,children:"Variants"}),n(t,{style:{gap:16},children:[n(t,{style:{gap:10},children:[e(i,{style:{fontWeight:650},children:"Surface"}),e(r,{variant:"surface",tone:"neutral",radius:12,elevation:"low"})]}),n(t,{style:{gap:10},children:[e(i,{style:{fontWeight:650},children:"Outline"}),e(r,{variant:"outline",tone:"info",radius:12,elevation:"none"})]}),n(t,{style:{gap:10},children:[e(i,{style:{fontWeight:650},children:"Soft"}),e(r,{variant:"soft",tone:"success",radius:12,elevation:"none"})]}),n(t,{style:{gap:10},children:[e(i,{style:{fontWeight:650},children:"Solid"}),e(r,{variant:"solid",tone:"warning",radius:12,elevation:"low"})]}),n(t,{style:{gap:10},children:[e(i,{style:{fontWeight:650},children:"Ghost"}),e(r,{variant:"ghost",tone:"danger",radius:12,elevation:"none"})]}),n(t,{style:{gap:10},children:[e(i,{style:{fontWeight:650},children:"Without indicator"}),e(r,{variant:"outline",tone:"info",radius:12,elevation:"none",indicator:"none"})]})]})]}),n(t,{columns:2,style:{gap:16},children:[n(i,{style:u,children:[e(i,{style:y,children:"Sizes"}),n(t,{style:{gap:14},children:[n(t,{style:{gap:8},children:[e(i,{style:{fontWeight:650},children:"Small"}),e(r,{size:"sm",radius:8})]}),n(t,{style:{gap:8},children:[e(i,{style:{fontWeight:650},children:"Medium"}),e(r,{size:"md",radius:12})]}),n(t,{style:{gap:8},children:[e(i,{style:{fontWeight:650},children:"Large"}),e(r,{size:"lg",radius:16})]})]})]}),n(i,{style:u,children:[e(i,{style:y,children:"Radius"}),n(t,{style:{gap:14},children:[n(t,{style:{gap:8},children:[e(i,{style:{fontWeight:650},children:"0"}),e(r,{radius:0,variant:"outline"})]}),n(t,{style:{gap:8},children:[e(i,{style:{fontWeight:650},children:"4"}),e(r,{radius:4,variant:"outline"})]}),n(t,{style:{gap:8},children:[e(i,{style:{fontWeight:650},children:"12"}),e(r,{radius:12,variant:"outline"})]}),n(t,{style:{gap:8},children:[e(i,{style:{fontWeight:650},children:"Full"}),e(r,{radius:"full",variant:"outline"})]})]})]})]})]})}function A(){return e(t,{style:{gap:16,maxInlineSize:860},children:n(i,{style:{...u,padding:24},children:[e(i,{style:{fontWeight:700,fontSize:28,lineHeight:1.15,marginBottom:8},children:"Frequently asked questions"}),e(i,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:15,lineHeight:1.6,marginBottom:18},children:"A cleaner, customer-facing disclosure pattern with low-noise borders and generous reading rhythm."}),n(f,{collapsible:!0,variant:"outline",radius:12,size:"lg",tone:"neutral",elevation:"none",children:[n(l,{description:"Deployment model and editor surface",children:[e(c,{children:"Can teams use Editora in both React and plain web components?"}),e(d,{children:"Yes. The system ships a custom-element core and React wrappers so product teams can adopt the same primitives across both integration styles."})]}),n(l,{description:"Lifecycle, upgrades, and adoption strategy",children:[e(c,{children:"How should we roll it out inside an existing design system?"}),e(d,{children:"Start with infrastructure primitives and form controls, then move high-traffic composed components such as menus, dialogs, and editor workflows."})]}),n(l,{description:"Tokens, themes, and Storybook alignment",children:[e(c,{children:"Does it support product-level theming without forking styles?"}),e(d,{children:"Yes. The baseline theme system exposes semantic and component-level tokens so teams can tune color, radius, motion, density, and elevation without rewriting component CSS."})]})]})]})})}function B(){return n(t,{columns:2,style:{gap:18,maxInlineSize:1180,alignItems:"start"},children:[n(i,{style:{...u,padding:18},children:[e(i,{style:y,children:"Compact sidebar pattern"}),n(f,{multiple:!0,variant:"ghost",tone:"neutral",size:"sm",radius:8,elevation:"none",open:[0,2],children:[n(l,{description:"Identity, roles, workspace metadata",badge:"Core",children:[e(c,{children:"Workspace settings"}),e(d,{children:"Naming rules, environment labels, ownership metadata, and internal access settings."})]}),n(l,{description:"Data retention and access events",badge:"Audit",children:[e(c,{children:"Security and compliance"}),e(d,{children:"Access reviews, retention windows, export controls, and event retention policies."})]}),n(l,{description:"Theme, typography, and interaction defaults",badge:"Brand",children:[e(c,{children:"Appearance controls"}),e(d,{children:"Color system, density preferences, component radius, and motion policy configuration."})]})]})]}),n(i,{style:{...u,padding:18},children:[e(i,{style:y,children:"High-signal sections"}),n(t,{style:{gap:12},children:[e(i,{style:{padding:16,borderRadius:12,background:"var(--ui-color-surface-alt, #f8fafc)"},children:"Keep sidebar accordions compact, border-light, and collapsible by default."}),e(i,{style:{padding:16,borderRadius:12,background:"var(--ui-color-surface-alt, #f8fafc)"},children:"Use `ghost` or `outline` for utility-heavy settings shells where the accordion should recede behind content."}),e(i,{style:{padding:16,borderRadius:12,background:"var(--ui-color-surface-alt, #f8fafc)"},children:"Reserve `solid` or stronger tones for workflows where state emphasis matters more than chrome reduction."})]})]})]})}function z(){const[o,a]=W.useState(0);return e(t,{style:{gap:16,maxInlineSize:900},children:n(i,{style:{...u,padding:20},children:[n(p,{align:"center",justify:"space-between",style:{gap:12,flexWrap:"wrap",marginBottom:16},children:[n(i,{children:[e(i,{style:{fontWeight:700,fontSize:20},children:"Controlled operations review"}),e(i,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13,marginTop:4},children:"Single-open mode managed by React state."})]}),n(p,{style:{gap:8,flexWrap:"wrap"},children:[e(x,{size:"sm",variant:"secondary",onClick:()=>a(0),children:"Open Summary"}),e(x,{size:"sm",variant:"secondary",onClick:()=>a(1),children:"Open Safety"}),e(x,{size:"sm",variant:"secondary",onClick:()=>a(2),children:"Open Discharge"})]})]}),e(f,{open:o,onToggle:a,variant:"soft",tone:"info",radius:12,size:"md",children:C.map((s,I)=>n(l,{description:s.subtitle,badge:s.badge,children:[e(c,{children:s.title}),e(d,{children:s.points[I%s.points.length]})]},s.title))})]})})}function k(){return e(t,{columns:2,style:{gap:16,maxInlineSize:1100},children:[["Info","info","outline"],["Success","success","soft"],["Warning","warning","solid"],["Danger","danger","outline"]].map(([o,a,s])=>n(i,{style:{...u,padding:18},children:[e(i,{style:{...y,marginBottom:12},children:o}),e(r,{variant:s,tone:a,radius:12,size:"md",elevation:s==="solid"?"low":"none"})]},o))})}function le(){const[o,a]=W.useState([0]),[s,I]=W.useState("<p><strong>Shift note:</strong> Continue fall-risk monitoring and confirm caregiver briefing before discharge.</p>"),T=W.useRef([0]);return n(t,{style:{gap:14,maxInlineSize:980},children:[e(i,{style:{border:"1px solid var(--ui-color-border, #d8e1ec)",borderRadius:16,padding:16,background:"linear-gradient(135deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 6%, #fff) 0%, var(--ui-color-surface, #fff) 42%)"},children:n(p,{align:"center",justify:"space-between",style:{gap:12,flexWrap:"wrap"},children:[n(i,{children:[e(i,{style:{fontWeight:700,fontSize:18},children:"Inpatient Care Workflow"}),e(i,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13,marginTop:4},children:"Enterprise accordion built on `ui-core` and wrapped by `ui-react`."})]}),n(p,{align:"center",style:{gap:8,color:"var(--ui-color-muted, #64748b)",fontSize:12},children:[e(te,{size:14}),"Live operation summary"]})]})}),e(f,{multiple:!0,open:o,onToggle:g=>{const m=ae(g),R=T.current,J=m.filter(h=>!R.includes(h)),X=R.filter(h=>!m.includes(h));J.forEach(h=>{var v;const b=(v=C[h])==null?void 0:v.title;b&&w.info(`${b} expanded`,{duration:1600,theme:"light"})}),X.forEach(h=>{var v;const b=(v=C[h])==null?void 0:v.title;b&&w.success(`${b} reviewed`,{duration:1400,theme:"light"})}),T.current=m,a(g)},variant:"surface",tone:"info",size:"md",radius:16,elevation:"low",children:C.map(g=>n(l,{description:g.subtitle,badge:g.badge,children:[e(c,{"aria-label":`Toggle ${g.title}`,children:e(se,{section:g})}),e(d,{children:e(t,{style:{gap:10},children:g.points.map(m=>n(p,{align:"start",style:{gap:8},children:[e(oe,{size:14,style:{marginTop:2,color:"#15803d"}}),e(i,{style:{fontSize:13,lineHeight:1.5},children:m})]},m))})})]},g.title))}),n(i,{style:{border:"1px solid var(--ui-color-border, #d8e1ec)",borderRadius:16,padding:12,background:"var(--ui-color-surface, #fff)",display:"grid",gap:10},children:[n(p,{justify:"space-between",align:"center",style:{gap:8,flexWrap:"wrap"},children:[e(i,{style:{fontWeight:700},children:"Care Plan Notes"}),n(p,{align:"center",style:{gap:6,color:"#b45309",fontSize:12},children:[e(re,{size:14}),"Rich text area powered by @editora/editor"]})]}),e(i,{style:{border:"1px solid #dbe4ef",borderRadius:12,minHeight:220,overflow:"hidden"},children:e(Z,{value:s,onChange:I})}),n(p,{justify:"end",style:{gap:8},children:[e(x,{size:"sm",variant:"secondary",onClick:()=>w.warning("Escalation sent to on-call supervisor",{duration:1800,theme:"light"}),children:"Escalate"}),e(x,{size:"sm",onClick:()=>w.success("Care plan note saved",{duration:1800,theme:"light"}),children:"Save Note"})]})]})]})}const G=le;var D,F,P;S.parameters={...S.parameters,docs:{...(D=S.parameters)==null?void 0:D.docs,source:{originalSource:`function BaselineStyles() {
  return <Grid style={{
    gap: 18,
    maxInlineSize: 1100
  }}>
      <Box style={showcaseFrameStyle}>
        <Box style={showcaseHeadingStyle}>Variants</Box>
        <Grid style={{
        gap: 16
      }}>
          <Grid style={{
          gap: 10
        }}>
            <Box style={{
            fontWeight: 650
          }}>Surface</Box>
            <DemoAccordion variant="surface" tone="neutral" radius={12} elevation="low" />
          </Grid>
          <Grid style={{
          gap: 10
        }}>
            <Box style={{
            fontWeight: 650
          }}>Outline</Box>
            <DemoAccordion variant="outline" tone="info" radius={12} elevation="none" />
          </Grid>
          <Grid style={{
          gap: 10
        }}>
            <Box style={{
            fontWeight: 650
          }}>Soft</Box>
            <DemoAccordion variant="soft" tone="success" radius={12} elevation="none" />
          </Grid>
          <Grid style={{
          gap: 10
        }}>
            <Box style={{
            fontWeight: 650
          }}>Solid</Box>
            <DemoAccordion variant="solid" tone="warning" radius={12} elevation="low" />
          </Grid>
          <Grid style={{
          gap: 10
        }}>
            <Box style={{
            fontWeight: 650
          }}>Ghost</Box>
            <DemoAccordion variant="ghost" tone="danger" radius={12} elevation="none" />
          </Grid>
          <Grid style={{
          gap: 10
        }}>
            <Box style={{
            fontWeight: 650
          }}>Without indicator</Box>
            <DemoAccordion variant="outline" tone="info" radius={12} elevation="none" indicator="none" />
          </Grid>
        </Grid>
      </Box>

      <Grid columns={2} style={{
      gap: 16
    }}>
        <Box style={showcaseFrameStyle}>
          <Box style={showcaseHeadingStyle}>Sizes</Box>
          <Grid style={{
          gap: 14
        }}>
            <Grid style={{
            gap: 8
          }}>
              <Box style={{
              fontWeight: 650
            }}>Small</Box>
              <DemoAccordion size="sm" radius={8} />
            </Grid>
            <Grid style={{
            gap: 8
          }}>
              <Box style={{
              fontWeight: 650
            }}>Medium</Box>
              <DemoAccordion size="md" radius={12} />
            </Grid>
            <Grid style={{
            gap: 8
          }}>
              <Box style={{
              fontWeight: 650
            }}>Large</Box>
              <DemoAccordion size="lg" radius={16} />
            </Grid>
          </Grid>
        </Box>

        <Box style={showcaseFrameStyle}>
          <Box style={showcaseHeadingStyle}>Radius</Box>
          <Grid style={{
          gap: 14
        }}>
            <Grid style={{
            gap: 8
          }}>
              <Box style={{
              fontWeight: 650
            }}>0</Box>
              <DemoAccordion radius={0} variant="outline" />
            </Grid>
            <Grid style={{
            gap: 8
          }}>
              <Box style={{
              fontWeight: 650
            }}>4</Box>
              <DemoAccordion radius={4} variant="outline" />
            </Grid>
            <Grid style={{
            gap: 8
          }}>
              <Box style={{
              fontWeight: 650
            }}>12</Box>
              <DemoAccordion radius={12} variant="outline" />
            </Grid>
            <Grid style={{
            gap: 8
          }}>
              <Box style={{
              fontWeight: 650
            }}>Full</Box>
              <DemoAccordion radius="full" variant="outline" />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>;
}`,...(P=(F=S.parameters)==null?void 0:F.docs)==null?void 0:P.source}}};var O,H,E;A.parameters={...A.parameters,docs:{...(O=A.parameters)==null?void 0:O.docs,source:{originalSource:`function FAQPattern() {
  return <Grid style={{
    gap: 16,
    maxInlineSize: 860
  }}>
      <Box style={{
      ...showcaseFrameStyle,
      padding: 24
    }}>
        <Box style={{
        fontWeight: 700,
        fontSize: 28,
        lineHeight: 1.15,
        marginBottom: 8
      }}>Frequently asked questions</Box>
        <Box style={{
        color: 'var(--ui-color-muted, #64748b)',
        fontSize: 15,
        lineHeight: 1.6,
        marginBottom: 18
      }}>
          A cleaner, customer-facing disclosure pattern with low-noise borders and generous reading rhythm.
        </Box>
        <Accordion collapsible variant="outline" radius={12} size="lg" tone="neutral" elevation="none">
          <AccordionItem description="Deployment model and editor surface">
            <AccordionTrigger>Can teams use Editora in both React and plain web components?</AccordionTrigger>
            <AccordionPanel>
              Yes. The system ships a custom-element core and React wrappers so product teams can adopt the same
              primitives across both integration styles.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem description="Lifecycle, upgrades, and adoption strategy">
            <AccordionTrigger>How should we roll it out inside an existing design system?</AccordionTrigger>
            <AccordionPanel>
              Start with infrastructure primitives and form controls, then move high-traffic composed components such
              as menus, dialogs, and editor workflows.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem description="Tokens, themes, and Storybook alignment">
            <AccordionTrigger>Does it support product-level theming without forking styles?</AccordionTrigger>
            <AccordionPanel>
              Yes. The baseline theme system exposes semantic and component-level tokens so teams can tune color,
              radius, motion, density, and elevation without rewriting component CSS.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Grid>;
}`,...(E=(H=A.parameters)==null?void 0:H.docs)==null?void 0:E.source}}};var j,N,q;B.parameters={...B.parameters,docs:{...(j=B.parameters)==null?void 0:j.docs,source:{originalSource:`function SettingsSidebarPattern() {
  return <Grid columns={2} style={{
    gap: 18,
    maxInlineSize: 1180,
    alignItems: 'start'
  }}>
      <Box style={{
      ...showcaseFrameStyle,
      padding: 18
    }}>
        <Box style={showcaseHeadingStyle}>Compact sidebar pattern</Box>
        <Accordion multiple variant="ghost" tone="neutral" size="sm" radius={8} elevation="none" open={[0, 2]}>
          <AccordionItem description="Identity, roles, workspace metadata" badge="Core">
            <AccordionTrigger>Workspace settings</AccordionTrigger>
            <AccordionPanel>
              Naming rules, environment labels, ownership metadata, and internal access settings.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem description="Data retention and access events" badge="Audit">
            <AccordionTrigger>Security and compliance</AccordionTrigger>
            <AccordionPanel>
              Access reviews, retention windows, export controls, and event retention policies.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem description="Theme, typography, and interaction defaults" badge="Brand">
            <AccordionTrigger>Appearance controls</AccordionTrigger>
            <AccordionPanel>
              Color system, density preferences, component radius, and motion policy configuration.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      <Box style={{
      ...showcaseFrameStyle,
      padding: 18
    }}>
        <Box style={showcaseHeadingStyle}>High-signal sections</Box>
        <Grid style={{
        gap: 12
      }}>
          <Box style={{
          padding: 16,
          borderRadius: 12,
          background: 'var(--ui-color-surface-alt, #f8fafc)'
        }}>
            Keep sidebar accordions compact, border-light, and collapsible by default.
          </Box>
          <Box style={{
          padding: 16,
          borderRadius: 12,
          background: 'var(--ui-color-surface-alt, #f8fafc)'
        }}>
            Use \`ghost\` or \`outline\` for utility-heavy settings shells where the accordion should recede behind content.
          </Box>
          <Box style={{
          padding: 16,
          borderRadius: 12,
          background: 'var(--ui-color-surface-alt, #f8fafc)'
        }}>
            Reserve \`solid\` or stronger tones for workflows where state emphasis matters more than chrome reduction.
          </Box>
        </Grid>
      </Box>
    </Grid>;
}`,...(q=(N=B.parameters)==null?void 0:N.docs)==null?void 0:q.source}}};var L,U,Q;z.parameters={...z.parameters,docs:{...(L=z.parameters)==null?void 0:L.docs,source:{originalSource:`function ControlledSingleOpen() {
  const [open, setOpen] = React.useState<number | number[]>(0);
  return <Grid style={{
    gap: 16,
    maxInlineSize: 900
  }}>
      <Box style={{
      ...showcaseFrameStyle,
      padding: 20
    }}>
        <Flex align="center" justify="space-between" style={{
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 16
      }}>
          <Box>
            <Box style={{
            fontWeight: 700,
            fontSize: 20
          }}>Controlled operations review</Box>
            <Box style={{
            color: 'var(--ui-color-muted, #64748b)',
            fontSize: 13,
            marginTop: 4
          }}>
              Single-open mode managed by React state.
            </Box>
          </Box>
          <Flex style={{
          gap: 8,
          flexWrap: 'wrap'
        }}>
            <Button size="sm" variant="secondary" onClick={() => setOpen(0)}>
              Open Summary
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setOpen(1)}>
              Open Safety
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setOpen(2)}>
              Open Discharge
            </Button>
          </Flex>
        </Flex>

        <Accordion open={open} onToggle={setOpen} variant="soft" tone="info" radius={12} size="md">
          {sections.map((section, index) => <AccordionItem key={section.title} description={section.subtitle} badge={section.badge}>
              <AccordionTrigger>{section.title}</AccordionTrigger>
              <AccordionPanel>
                {section.points[index % section.points.length]}
              </AccordionPanel>
            </AccordionItem>)}
        </Accordion>
      </Box>
    </Grid>;
}`,...(Q=(U=z.parameters)==null?void 0:U.docs)==null?void 0:Q.source}}};var Y,M,V;k.parameters={...k.parameters,docs:{...(Y=k.parameters)==null?void 0:Y.docs,source:{originalSource:`function ToneGallery() {
  return <Grid columns={2} style={{
    gap: 16,
    maxInlineSize: 1100
  }}>
      {[['Info', 'info', 'outline'], ['Success', 'success', 'soft'], ['Warning', 'warning', 'solid'], ['Danger', 'danger', 'outline']].map(([label, tone, variant]) => <Box key={label} style={{
      ...showcaseFrameStyle,
      padding: 18
    }}>
          <Box style={{
        ...showcaseHeadingStyle,
        marginBottom: 12
      }}>{label}</Box>
          <DemoAccordion variant={variant as React.ComponentProps<typeof Accordion>['variant']} tone={tone as React.ComponentProps<typeof Accordion>['tone']} radius={12} size="md" elevation={variant === 'solid' ? 'low' : 'none'} />
        </Box>)}
    </Grid>;
}`,...(V=(M=k.parameters)==null?void 0:M.docs)==null?void 0:V.source}}};var $,K,_;G.parameters={...G.parameters,docs:{...($=G.parameters)==null?void 0:$.docs,source:{originalSource:"EnterpriseClinicalAccordion",...(_=(K=G.parameters)==null?void 0:K.docs)==null?void 0:_.source}}};const be=["BaselineStyles","FAQPattern","SettingsSidebarPattern","ControlledSingleOpen","ToneGallery","EnterpriseClinicalOps"];export{S as BaselineStyles,z as ControlledSingleOpen,G as EnterpriseClinicalOps,A as FAQPattern,B as SettingsSidebarPattern,k as ToneGallery,be as __namedExportsOrder,fe as default};
