import{x as c,j as n,F as r,B as i,a as e,b as p,G as s,y as x,z as G,H as $,I as F,J as H}from"./index-ce0e40fa.js";import{R as d}from"./index-93f6b7ae.js";import{S as v,b as W,a as P,c as L}from"./icons-b73c9b18.js";import"./index-c197feae.js";const K={title:"UI/AlertDialog",component:c,args:{tone:"warning",variant:"soft",size:"md",elevation:"high",radius:12,dismissible:!0,closeOnEsc:!0,closeOnBackdrop:!1}};function y({children:a}){return e(s,{style:{gap:14,maxInlineSize:980,padding:20,border:"1px solid var(--base-panel-border, var(--ui-border))",borderRadius:"var(--ui-radius, 4px)",background:"var(--base-panel-bg, var(--color-panel-solid, #fff))",boxShadow:"var(--base-panel-shadow, none)"},children:a})}function g(a){const[t,u]=d.useState(!1);return n(y,{children:[n(r,{align:"center",justify:"space-between",style:{gap:12,flexWrap:"wrap"},children:[n(i,{children:[e(i,{style:{fontWeight:650,fontSize:"var(--ui-default-font-size, 14px)"},children:"Destructive confirmation"}),e(i,{style:{color:"var(--ui-muted, #646464)",fontSize:13,marginTop:4},children:"Use alert dialogs for blocking, high-consequence actions."})]}),e(p,{onClick:()=>u(!0),children:"Open dialog"})]}),e(c,{...a,open:t,onClose:()=>u(!1),config:{title:"Delete environment",description:"This permanently deletes the selected environment and all associated deployment metadata.",confirmText:"Delete environment",cancelText:"Keep environment"}})]})}function f(){return e(s,{style:{gap:14,maxInlineSize:980},children:["surface","soft","outline","solid"].map(t=>n(y,{children:[e(i,{style:{fontWeight:650,textTransform:"capitalize"},children:t}),e(c,{open:!0,headless:!0,tone:t==="solid"?"danger":"warning",variant:t,elevation:t==="outline"?"none":"high",radius:12,dismissible:!0,config:{title:"Review production rollout",description:"Publishing now will update the live workflow for all operators in the selected tenant.",confirmText:"Publish",cancelText:"Cancel"}})]},t))})}function m(){const[a,t]=d.useState(!0);return n(y,{children:[n(s,{style:{gap:12,maxInlineSize:720},children:[n(i,{children:[e(i,{style:{fontWeight:700,fontSize:18,lineHeight:1.25},children:"Policy approval with embedded evidence"}),e(i,{style:{color:"var(--ui-muted, #646464)",fontSize:13,marginTop:4,lineHeight:1.5},children:"This pattern shows the structured composition path for richer dialogs that still stay visually aligned with the alert-dialog shell."})]}),n(r,{style:{gap:8,flexWrap:"wrap"},children:[e(i,{style:{padding:"4px 10px",borderRadius:999,background:"color-mix(in srgb, var(--ui-color-primary, #2563eb) 10%, transparent)",color:"var(--ui-color-primary, #2563eb)",fontSize:12,fontWeight:600},children:"Access control"}),e(i,{style:{padding:"4px 10px",borderRadius:999,background:"color-mix(in srgb, var(--ui-color-success, #16a34a) 12%, transparent)",color:"var(--ui-color-success, #16a34a)",fontSize:12,fontWeight:600},children:"Auditable rollout"})]})]}),n(c,{open:a,headless:!0,tone:"info",variant:"surface",size:"lg",radius:"none",indicator:"none",dismissible:!0,onClose:()=>t(!1),children:[e(x,{children:e(v,{size:16})}),e(G,{children:"Approve updated access policy"}),e($,{children:"Publishing this policy will require re-authentication for privileged roles on their next session."}),e(F,{children:n(s,{style:{gap:12},children:[n(s,{style:{gap:10,padding:12,border:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)",borderRadius:12,background:"color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, var(--color-panel-solid, #fff))"},children:[n(r,{align:"start",style:{gap:8},children:[e(W,{size:14,style:{marginTop:2,color:"var(--ui-color-success, #16a34a)"}}),e(i,{style:{fontSize:13,lineHeight:1.5},children:"A signed audit trail entry will be generated automatically for each affected workspace."})]}),n(r,{align:"start",style:{gap:8},children:[e(P,{size:14,style:{marginTop:2,color:"var(--ui-color-primary, #2563eb)"}}),e(i,{style:{fontSize:13,lineHeight:1.5},children:"Policy propagation typically completes across tenants in under 30 seconds."})]})]}),n(s,{style:{gap:8,gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))"},children:[n(i,{style:{padding:12,borderRadius:12,background:"var(--color-panel-solid, #fff)",border:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)"},children:[e(i,{style:{fontSize:12,color:"var(--ui-muted, #646464)",marginBottom:4},children:"Affected roles"}),e(i,{style:{fontWeight:650},children:"Platform Admins"})]}),n(i,{style:{padding:12,borderRadius:12,background:"var(--color-panel-solid, #fff)",border:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)"},children:[e(i,{style:{fontSize:12,color:"var(--ui-muted, #646464)",marginBottom:4},children:"Rollback window"}),e(i,{style:{fontWeight:650},children:"15 minutes"})]})]})]})}),e(H,{children:n(r,{justify:"end",style:{gap:8,width:"100%"},children:[e(p,{variant:"secondary",onClick:()=>t(!1),children:"Review later"}),e(p,{onClick:()=>t(!1),children:"Publish policy"})]})})]})]})}function h(){const[a,t]=d.useState(!1),[u,b]=d.useState(!1),[E,l]=d.useState("None");return n(s,{style:{gap:14,maxInlineSize:980},children:[e(y,{children:n(r,{align:"center",justify:"space-between",style:{gap:12,flexWrap:"wrap"},children:[n(i,{children:[e(i,{style:{fontWeight:700,fontSize:18},children:"Incident command dialogs"}),e(i,{style:{color:"var(--ui-muted, #646464)",fontSize:13,marginTop:4},children:"Production-safe confirmation flows with layered safeguards."})]}),n(r,{align:"center",style:{gap:6,color:"var(--ui-muted, #646464)",fontSize:12},children:[e(P,{size:14}),"Operations status: Elevated risk"]})]})}),n(r,{style:{gap:8,flexWrap:"wrap"},children:[e(p,{onClick:()=>t(!0),children:"Open critical shutdown"}),e(p,{variant:"secondary",onClick:()=>b(!0),children:"Open policy review"})]}),n(c,{open:a,tone:"danger",variant:"soft",size:"lg",radius:12,elevation:"high",dismissible:!0,onConfirm:o=>l(`confirm:critical checked=${String(o.checked)}`),onCancel:()=>l("cancel:critical"),onDismiss:o=>l(`dismiss:critical:${o.source}`),onClose:o=>{t(!1),l(`close:critical:${o.action}${o.source?`:${o.source}`:""}`)},config:{title:"Confirm emergency ward shutdown",description:"This action halts admissions, paging, and medication dispatch for the selected unit.",confirmText:"Confirm shutdown",cancelText:"Keep running",input:{enabled:!0,label:"Type SHUTDOWN to continue",placeholder:"SHUTDOWN",required:!0},checkbox:{enabled:!0,label:"Notify executive on-call immediately",checked:!0}},children:[e(x,{children:e(L,{size:16})}),e(F,{children:n(s,{style:{gap:10},children:[n(r,{align:"start",style:{gap:8},children:[e(v,{size:14,style:{marginTop:2,color:"#b45309"}}),e(i,{style:{fontSize:13,lineHeight:1.5},children:"Active trauma cases will be rerouted to fallback units immediately."})]}),n(r,{align:"start",style:{gap:8},children:[e(v,{size:14,style:{marginTop:2,color:"#b45309"}}),e(i,{style:{fontSize:13,lineHeight:1.5},children:"Audit trail entry will include operator identity and confirmation payload."})]})]})})]}),e(c,{open:u,tone:"info",variant:"surface",dismissible:!0,onConfirm:()=>l("confirm:policy"),onCancel:()=>l("cancel:policy"),onDismiss:o=>l(`dismiss:policy:${o.source}`),onClose:o=>{b(!1),l(`close:policy:${o.action}${o.source?`:${o.source}`:""}`)},config:{title:"Approve updated escalation policy",description:"This will publish revised response SLAs to all on-call teams.",confirmText:"Publish policy",cancelText:"Review later",checkbox:{enabled:!0,label:"Require supervisor acknowledgment at next login"}},children:e(x,{children:e(W,{size:16})})}),n(i,{style:{border:"1px solid var(--base-panel-border, var(--ui-border))",borderRadius:"var(--ui-radius, 4px)",padding:10,color:"var(--ui-muted, #646464)",fontSize:13},children:["Last event: ",e("strong",{children:E})]})]})}var S,w,z;g.parameters={...g.parameters,docs:{...(S=g.parameters)==null?void 0:S.docs,source:{originalSource:`function Playground(args: React.ComponentProps<typeof AlertDialog>) {
  const [open, setOpen] = React.useState(false);
  return <SurfaceFrame>
      <Flex align="center" justify="space-between" style={{
      gap: 12,
      flexWrap: 'wrap'
    }}>
        <Box>
          <Box style={{
          fontWeight: 650,
          fontSize: 'var(--ui-default-font-size, 14px)'
        }}>Destructive confirmation</Box>
          <Box style={{
          color: 'var(--ui-muted, #646464)',
          fontSize: 13,
          marginTop: 4
        }}>
            Use alert dialogs for blocking, high-consequence actions.
          </Box>
        </Box>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
      </Flex>

      <AlertDialog {...args} open={open} onClose={() => setOpen(false)} config={{
      title: 'Delete environment',
      description: 'This permanently deletes the selected environment and all associated deployment metadata.',
      confirmText: 'Delete environment',
      cancelText: 'Keep environment'
    }} />
    </SurfaceFrame>;
}`,...(z=(w=g.parameters)==null?void 0:w.docs)==null?void 0:z.source}}};var B,C,A;f.parameters={...f.parameters,docs:{...(B=f.parameters)==null?void 0:B.docs,source:{originalSource:`function VariantGallery() {
  const variants: Array<NonNullable<React.ComponentProps<typeof AlertDialog>['variant']>> = ['surface', 'soft', 'outline', 'solid'];
  return <Grid style={{
    gap: 14,
    maxInlineSize: 980
  }}>
      {variants.map(variant => <SurfaceFrame key={variant}>
          <Box style={{
        fontWeight: 650,
        textTransform: 'capitalize'
      }}>{variant}</Box>
          <AlertDialog open headless tone={variant === 'solid' ? 'danger' : 'warning'} variant={variant} elevation={variant === 'outline' ? 'none' : 'high'} radius={12} dismissible config={{
        title: 'Review production rollout',
        description: 'Publishing now will update the live workflow for all operators in the selected tenant.',
        confirmText: 'Publish',
        cancelText: 'Cancel'
      }} />
        </SurfaceFrame>)}
    </Grid>;
}`,...(A=(C=f.parameters)==null?void 0:C.docs)==null?void 0:A.source}}};var k,T,D;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:`function StructuredComposition() {
  const [open, setOpen] = React.useState(true);
  return <SurfaceFrame>
      <Grid style={{
      gap: 12,
      maxInlineSize: 720
    }}>
        <Box>
          <Box style={{
          fontWeight: 700,
          fontSize: 18,
          lineHeight: 1.25
        }}>Policy approval with embedded evidence</Box>
          <Box style={{
          color: 'var(--ui-muted, #646464)',
          fontSize: 13,
          marginTop: 4,
          lineHeight: 1.5
        }}>
            This pattern shows the structured composition path for richer dialogs that still stay visually aligned with the
            alert-dialog shell.
          </Box>
        </Box>
        <Flex style={{
        gap: 8,
        flexWrap: 'wrap'
      }}>
          <Box style={{
          padding: '4px 10px',
          borderRadius: 999,
          background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 10%, transparent)',
          color: 'var(--ui-color-primary, #2563eb)',
          fontSize: 12,
          fontWeight: 600
        }}>
            Access control
          </Box>
          <Box style={{
          padding: '4px 10px',
          borderRadius: 999,
          background: 'color-mix(in srgb, var(--ui-color-success, #16a34a) 12%, transparent)',
          color: 'var(--ui-color-success, #16a34a)',
          fontSize: 12,
          fontWeight: 600
        }}>
            Auditable rollout
          </Box>
        </Flex>
      </Grid>
      <AlertDialog open={open} headless tone="info" variant="surface" size="lg" radius="none" indicator="none" dismissible onClose={() => setOpen(false)}>
        <AlertDialogIcon>
          <ShieldIcon size={16} />
        </AlertDialogIcon>
        <AlertDialogTitle>Approve updated access policy</AlertDialogTitle>
        <AlertDialogDescription>
          Publishing this policy will require re-authentication for privileged roles on their next session.
        </AlertDialogDescription>
        <AlertDialogContent>
          <Grid style={{
          gap: 12
        }}>
            <Grid style={{
            gap: 10,
            padding: 12,
            border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)',
            borderRadius: 12,
            background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, var(--color-panel-solid, #fff))'
          }}>
              <Flex align="start" style={{
              gap: 8
            }}>
                <CheckCircleIcon size={14} style={{
                marginTop: 2,
                color: 'var(--ui-color-success, #16a34a)'
              }} />
                <Box style={{
                fontSize: 13,
                lineHeight: 1.5
              }}>
                  A signed audit trail entry will be generated automatically for each affected workspace.
                </Box>
              </Flex>
              <Flex align="start" style={{
              gap: 8
            }}>
                <ClockIcon size={14} style={{
                marginTop: 2,
                color: 'var(--ui-color-primary, #2563eb)'
              }} />
                <Box style={{
                fontSize: 13,
                lineHeight: 1.5
              }}>
                  Policy propagation typically completes across tenants in under 30 seconds.
                </Box>
              </Flex>
            </Grid>
            <Grid style={{
            gap: 8,
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))'
          }}>
              <Box style={{
              padding: 12,
              borderRadius: 12,
              background: 'var(--color-panel-solid, #fff)',
              border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)'
            }}>
                <Box style={{
                fontSize: 12,
                color: 'var(--ui-muted, #646464)',
                marginBottom: 4
              }}>Affected roles</Box>
                <Box style={{
                fontWeight: 650
              }}>Platform Admins</Box>
              </Box>
              <Box style={{
              padding: 12,
              borderRadius: 12,
              background: 'var(--color-panel-solid, #fff)',
              border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)'
            }}>
                <Box style={{
                fontSize: 12,
                color: 'var(--ui-muted, #646464)',
                marginBottom: 4
              }}>Rollback window</Box>
                <Box style={{
                fontWeight: 650
              }}>15 minutes</Box>
              </Box>
            </Grid>
          </Grid>
        </AlertDialogContent>
        <AlertDialogActions>
          <Flex justify="end" style={{
          gap: 8,
          width: '100%'
        }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Review later
            </Button>
            <Button onClick={() => setOpen(false)}>Publish policy</Button>
          </Flex>
        </AlertDialogActions>
      </AlertDialog>
    </SurfaceFrame>;
}`,...(D=(T=m.parameters)==null?void 0:T.docs)==null?void 0:D.source}}};var R,I,O;h.parameters={...h.parameters,docs:{...(R=h.parameters)==null?void 0:R.docs,source:{originalSource:`function EnterpriseIncidentResponse() {
  const [openCritical, setOpenCritical] = React.useState(false);
  const [openReview, setOpenReview] = React.useState(false);
  const [lastEvent, setLastEvent] = React.useState('None');
  return <Grid style={{
    gap: 14,
    maxInlineSize: 980
  }}>
      <SurfaceFrame>
        <Flex align="center" justify="space-between" style={{
        gap: 12,
        flexWrap: 'wrap'
      }}>
          <Box>
            <Box style={{
            fontWeight: 700,
            fontSize: 18
          }}>Incident command dialogs</Box>
            <Box style={{
            color: 'var(--ui-muted, #646464)',
            fontSize: 13,
            marginTop: 4
          }}>
              Production-safe confirmation flows with layered safeguards.
            </Box>
          </Box>
          <Flex align="center" style={{
          gap: 6,
          color: 'var(--ui-muted, #646464)',
          fontSize: 12
        }}>
            <ClockIcon size={14} />
            Operations status: Elevated risk
          </Flex>
        </Flex>
      </SurfaceFrame>

      <Flex style={{
      gap: 8,
      flexWrap: 'wrap'
    }}>
        <Button onClick={() => setOpenCritical(true)}>Open critical shutdown</Button>
        <Button variant="secondary" onClick={() => setOpenReview(true)}>
          Open policy review
        </Button>
      </Flex>

      <AlertDialog open={openCritical} tone="danger" variant="soft" size="lg" radius={12} elevation="high" dismissible onConfirm={detail => setLastEvent(\`confirm:critical checked=\${String(detail.checked)}\`)} onCancel={() => setLastEvent('cancel:critical')} onDismiss={detail => setLastEvent(\`dismiss:critical:\${detail.source}\`)} onClose={detail => {
      setOpenCritical(false);
      setLastEvent(\`close:critical:\${detail.action}\${detail.source ? \`:\${detail.source}\` : ''}\`);
    }} config={{
      title: 'Confirm emergency ward shutdown',
      description: 'This action halts admissions, paging, and medication dispatch for the selected unit.',
      confirmText: 'Confirm shutdown',
      cancelText: 'Keep running',
      input: {
        enabled: true,
        label: 'Type SHUTDOWN to continue',
        placeholder: 'SHUTDOWN',
        required: true
      },
      checkbox: {
        enabled: true,
        label: 'Notify executive on-call immediately',
        checked: true
      }
    }}>
        <AlertDialogIcon>
          <AlertTriangleIcon size={16} />
        </AlertDialogIcon>
        <AlertDialogContent>
          <Grid style={{
          gap: 10
        }}>
            <Flex align="start" style={{
            gap: 8
          }}>
              <ShieldIcon size={14} style={{
              marginTop: 2,
              color: '#b45309'
            }} />
              <Box style={{
              fontSize: 13,
              lineHeight: 1.5
            }}>
                Active trauma cases will be rerouted to fallback units immediately.
              </Box>
            </Flex>
            <Flex align="start" style={{
            gap: 8
          }}>
              <ShieldIcon size={14} style={{
              marginTop: 2,
              color: '#b45309'
            }} />
              <Box style={{
              fontSize: 13,
              lineHeight: 1.5
            }}>
                Audit trail entry will include operator identity and confirmation payload.
              </Box>
            </Flex>
          </Grid>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openReview} tone="info" variant="surface" dismissible onConfirm={() => setLastEvent('confirm:policy')} onCancel={() => setLastEvent('cancel:policy')} onDismiss={detail => setLastEvent(\`dismiss:policy:\${detail.source}\`)} onClose={detail => {
      setOpenReview(false);
      setLastEvent(\`close:policy:\${detail.action}\${detail.source ? \`:\${detail.source}\` : ''}\`);
    }} config={{
      title: 'Approve updated escalation policy',
      description: 'This will publish revised response SLAs to all on-call teams.',
      confirmText: 'Publish policy',
      cancelText: 'Review later',
      checkbox: {
        enabled: true,
        label: 'Require supervisor acknowledgment at next login'
      }
    }}>
        <AlertDialogIcon>
          <CheckCircleIcon size={16} />
        </AlertDialogIcon>
      </AlertDialog>

      <Box style={{
      border: '1px solid var(--base-panel-border, var(--ui-border))',
      borderRadius: 'var(--ui-radius, 4px)',
      padding: 10,
      color: 'var(--ui-muted, #646464)',
      fontSize: 13
    }}>
        Last event: <strong>{lastEvent}</strong>
      </Box>
    </Grid>;
}`,...(O=(I=h.parameters)==null?void 0:I.docs)==null?void 0:O.source}}};const V=["Playground","VariantGallery","StructuredComposition","EnterpriseIncidentResponse"];export{h as EnterpriseIncidentResponse,g as Playground,m as StructuredComposition,f as VariantGallery,V as __namedExportsOrder,K as default};
