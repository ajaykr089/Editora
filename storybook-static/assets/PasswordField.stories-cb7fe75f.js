import{aT as t,a as e,j as a,G as l,B as r}from"./index-ce0e40fa.js";import{r as f}from"./index-93f6b7ae.js";import{S as I,a as n,b as W,c as y,s as M,d as w}from"./storybook-showcase-2b62d73c.js";import"./index-c197feae.js";const K={title:"UI/PasswordField",component:t,argTypes:{label:{control:"text"},description:{control:"text"},placeholder:{control:"text"},disabled:{control:"boolean"},readOnly:{control:"boolean"},required:{control:"boolean"},clearable:{control:"boolean"},counter:{control:"boolean"},floatingLabel:{control:"boolean"},showStrength:{control:"boolean"},revealable:{control:"boolean"},validation:{control:"radio",options:["none","error","success"]},variant:{control:"select",options:["classic","surface","soft","outlined","filled","flushed","minimal","contrast","elevated"]},tone:{control:"select",options:["default","brand","success","warning","danger"]},density:{control:"select",options:["default","compact","comfortable"]},shape:{control:"select",options:["default","square","soft"]},size:{control:"select",options:["sm","md","lg"]}}},d=o=>{const[i,s]=f.useState(!1),[j,N]=f.useState(0);return e(I,{eyebrow:"Credential Entry",title:"Password inputs should feel deliberate, secure, and operationally clear",description:"This field packages visibility control and strength feedback into the same design system language as the rest of the input stack.",meta:[{label:"Reveal toggle",value:o.revealable?"Enabled":"Disabled"},{label:"Strength",value:o.showStrength?"Visible":"Hidden"},{label:"Pattern",value:"Production auth"}],children:e(n,{eyebrow:"Core Pattern",title:"Password toggle field",description:"The default pattern should handle form semantics, visibility changes, and password quality feedback without custom one-off suffix wiring.",children:a(l,{style:{display:"grid",gap:18,gridTemplateColumns:"minmax(320px, 1fr) minmax(260px, 320px)"},children:[a(r,{style:{display:"grid",gap:14},children:[a("div",{style:W,children:[e("span",{style:y,children:"Visibility toggle"}),e("span",{style:y,children:"Strength guidance"}),e("span",{style:y,children:"Form ready"})]}),e(t,{...o,onInput:Z=>N(Z.length),onVisibilityChange:s})]}),a(r,{style:M,children:[e("strong",{style:{color:"#0f172a"},children:"Live state"}),a(r,{style:{color:"#64748b",fontSize:13},children:["Visibility: ",i?"visible":"hidden"]}),a(r,{style:{color:"#64748b",fontSize:13},children:["Characters: ",j]}),e("p",{style:w,children:"Use `showStrength` for signup, recovery, or admin-reset flows where quality feedback is part of the product contract."})]})]})})})};d.args={label:"Workspace password",description:"Used for admin-level changes and destructive actions.",placeholder:"Enter password",disabled:!1,readOnly:!1,required:!1,clearable:!1,counter:!1,floatingLabel:!1,showStrength:!0,revealable:!0,validation:"none",variant:"surface",tone:"default",density:"default",shape:"default",size:"md"};const c=()=>e(n,{eyebrow:"Account Creation",title:"Strength-led signup pattern",description:"This is the common SaaS account-creation path: strong password guidance, floating label, and a slightly more elevated shell.",children:a(r,{style:{maxWidth:520,display:"grid",gap:12},children:[e(t,{label:"Create password",description:"Use at least 12 characters. Mix uppercase, lowercase, numbers, and symbols.",placeholder:"Choose a strong password",showStrength:!0,floatingLabel:!0,variant:"elevated",clearable:!0,autoComplete:"new-password"}),e("p",{style:w,children:"Pair this with a confirm-password field and a mismatch validator when the flow requires explicit confirmation."})]})}),p=()=>e(n,{eyebrow:"Admin Console",title:"Compact verification field",description:"For higher-friction admin checks, the field should stay dense and deliberate without losing the reveal affordance.",children:a(l,{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(2, minmax(240px, 1fr))"},children:[e(t,{label:"Current password",description:"Required before rotating signing keys.",variant:"outlined",density:"compact",shape:"square",autoComplete:"current-password"}),e(t,{label:"Recovery key",description:"Reveal is disabled when shoulder-surfing risk is higher.",variant:"contrast",tone:"warning",density:"compact",revealable:!1,autoComplete:"one-time-code"})]})}),u=()=>{const[o,i]=f.useState("Awaiting input");return e(n,{eyebrow:"Custom Policy",title:"Policy-driven strength evaluation",description:"Production auth flows often need to plug in enterprise-specific password rules instead of relying on fixed heuristics.",children:a(l,{style:{display:"grid",gap:16,gridTemplateColumns:"minmax(320px, 1fr) minmax(260px, 320px)"},children:[e(t,{label:"Privileged account password",description:"Requires a minimum length plus a company-specific rule set.",showStrength:!0,strengthEvaluator:s=>s.length>=16&&/[A-Z]/.test(s)&&/\d/.test(s)&&/[^A-Za-z0-9]/.test(s)?{score:4,label:"Enterprise strong",caption:"Matches privileged-account policy."}:{score:2,label:"Needs policy work",caption:"Use 16+ chars with uppercase, numbers, and symbols."},onStrengthChange:s=>i(s.label)}),a(r,{style:M,children:[e("strong",{style:{color:"#0f172a"},children:"Current strength label"}),e(r,{style:{color:"#64748b",fontSize:13},children:o}),e("p",{style:w,children:"This is the integration path for products with their own password policy language or compliance requirements."})]})]})})},h=()=>e(n,{eyebrow:"Visual System",title:"Variant gallery",description:"Each password field variant should keep the same affordances: direct typing, reveal control, and predictable password guidance.",children:e(l,{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))"},children:[["classic","Classic"],["surface","Surface"],["soft","Soft"],["outlined","Outlined"],["filled","Filled"],["flushed","Flushed"],["minimal","Minimal"],["contrast","Contrast"],["elevated","Elevated"]].map(([i,s])=>a(r,{style:{display:"grid",gap:10},children:[e("strong",{style:{color:"#0f172a",fontSize:13},children:s}),e(t,{label:`${s} password`,description:"Reveal stays ghosted by default so it reads as a field affordance, not a pill button.",placeholder:"Enter password",variant:i,showStrength:!0,clearable:!0})]},i))})}),g=()=>e(n,{eyebrow:"Operational States",title:"Production state coverage",description:"The component needs to hold up not just in the default state, but in readonly, invalid, success, no-reveal, and dense admin usage.",children:a(l,{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))"},children:[e(t,{label:"Readonly password",description:"Used in audit views where reveal should not mutate the field.",value:"ReadonlySecret42!",readOnly:!0,variant:"surface"}),e(t,{label:"Validation error",description:"Used when the backend rejects the credential or policy requirements are unmet.",value:"short",validation:"error",error:"Password must be at least 12 characters.",showStrength:!0,tone:"danger",variant:"outlined"}),e(t,{label:"Validated success",description:"Used after policy confirmation in setup or reset flows.",value:"VeryStrongPassword#42",validation:"success",showStrength:!0,tone:"success",variant:"soft"}),e(t,{label:"No reveal",description:"For sensitive support-console flows where reveal is intentionally suppressed.",placeholder:"Enter recovery secret",revealable:!1,autoComplete:"off",variant:"contrast",tone:"warning"}),e(t,{label:"Disabled field",description:"Communicates locked state cleanly without showing stray toggle chrome.",value:"DisabledValue42!",disabled:!0,showStrength:!0,variant:"filled"}),e(t,{label:"Clearable with counter",description:"Useful for temporary secret entry or wizard-style setup steps.",placeholder:"Set workspace password",clearable:!0,counter:!0,maxlength:32,variant:"elevated"})]})}),m=()=>e(n,{eyebrow:"Layout Variations",title:"Density, size, and shape patterns",description:"These are the combinations teams usually need when the same field moves from app shell forms into admin rails or console drawers.",children:a(l,{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))"},children:[e(t,{label:"Compact square",description:"Toolbar-style administrative density.",density:"compact",size:"sm",shape:"square",variant:"outlined"}),e(t,{label:"Default soft",description:"Balanced product default.",density:"default",size:"md",shape:"soft",variant:"surface",showStrength:!0}),e(t,{label:"Comfortable large",description:"Signup and recovery forms that need more breathing room.",density:"comfortable",size:"lg",shape:"soft",floatingLabel:!0,variant:"elevated",showStrength:!0})]})});var b,v,S;d.parameters={...d.parameters,docs:{...(b=d.parameters)==null?void 0:b.docs,source:{originalSource:`(args: any) => {
  const [revealed, setRevealed] = useState(false);
  const [length, setLength] = useState(0);
  return <ShowcasePage eyebrow="Credential Entry" title="Password inputs should feel deliberate, secure, and operationally clear" description="This field packages visibility control and strength feedback into the same design system language as the rest of the input stack." meta={[{
    label: 'Reveal toggle',
    value: args.revealable ? 'Enabled' : 'Disabled'
  }, {
    label: 'Strength',
    value: args.showStrength ? 'Visible' : 'Hidden'
  }, {
    label: 'Pattern',
    value: 'Production auth'
  }]}>
      <ShowcaseSection eyebrow="Core Pattern" title="Password toggle field" description="The default pattern should handle form semantics, visibility changes, and password quality feedback without custom one-off suffix wiring.">
        <Grid style={{
        display: 'grid',
        gap: 18,
        gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)'
      }}>
          <Box style={{
          display: 'grid',
          gap: 14
        }}>
            <div style={showcaseChipRowStyle}>
              <span style={showcaseChipStyle}>Visibility toggle</span>
              <span style={showcaseChipStyle}>Strength guidance</span>
              <span style={showcaseChipStyle}>Form ready</span>
            </div>
            <PasswordField {...args} onInput={next => setLength(next.length)} onVisibilityChange={setRevealed} />
          </Box>
          <Box style={showcasePanelStyle}>
            <strong style={{
            color: '#0f172a'
          }}>Live state</strong>
            <Box style={{
            color: '#64748b',
            fontSize: 13
          }}>
              Visibility: {revealed ? 'visible' : 'hidden'}
            </Box>
            <Box style={{
            color: '#64748b',
            fontSize: 13
          }}>
              Characters: {length}
            </Box>
            <p style={showcaseCaptionStyle}>Use \`showStrength\` for signup, recovery, or admin-reset flows where quality feedback is part of the product contract.</p>
          </Box>
        </Grid>
      </ShowcaseSection>
    </ShowcasePage>;
}`,...(S=(v=d.parameters)==null?void 0:v.docs)==null?void 0:S.source}}};var x,C,P;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`() => <ShowcaseSection eyebrow="Account Creation" title="Strength-led signup pattern" description="This is the common SaaS account-creation path: strong password guidance, floating label, and a slightly more elevated shell.">
    <Box style={{
    maxWidth: 520,
    display: 'grid',
    gap: 12
  }}>
      <PasswordField label="Create password" description="Use at least 12 characters. Mix uppercase, lowercase, numbers, and symbols." placeholder="Choose a strong password" showStrength floatingLabel variant="elevated" clearable autoComplete="new-password" />
      <p style={showcaseCaptionStyle}>Pair this with a confirm-password field and a mismatch validator when the flow requires explicit confirmation.</p>
    </Box>
  </ShowcaseSection>`,...(P=(C=c.parameters)==null?void 0:C.docs)==null?void 0:P.source}}};var k,F,T;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`() => <ShowcaseSection eyebrow="Admin Console" title="Compact verification field" description="For higher-friction admin checks, the field should stay dense and deliberate without losing the reveal affordance.">
    <Grid style={{
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(2, minmax(240px, 1fr))'
  }}>
      <PasswordField label="Current password" description="Required before rotating signing keys." variant="outlined" density="compact" shape="square" autoComplete="current-password" />
      <PasswordField label="Recovery key" description="Reveal is disabled when shoulder-surfing risk is higher." variant="contrast" tone="warning" density="compact" revealable={false} autoComplete="one-time-code" />
    </Grid>
  </ShowcaseSection>`,...(T=(F=p.parameters)==null?void 0:F.docs)==null?void 0:T.source}}};var q,V,R;u.parameters={...u.parameters,docs:{...(q=u.parameters)==null?void 0:q.docs,source:{originalSource:`() => {
  const [label, setLabel] = useState('Awaiting input');
  return <ShowcaseSection eyebrow="Custom Policy" title="Policy-driven strength evaluation" description="Production auth flows often need to plug in enterprise-specific password rules instead of relying on fixed heuristics.">
      <Grid style={{
      display: 'grid',
      gap: 16,
      gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)'
    }}>
        <PasswordField label="Privileged account password" description="Requires a minimum length plus a company-specific rule set." showStrength strengthEvaluator={value => {
        if (value.length >= 16 && /[A-Z]/.test(value) && /\\d/.test(value) && /[^A-Za-z0-9]/.test(value)) {
          return {
            score: 4,
            label: 'Enterprise strong',
            caption: 'Matches privileged-account policy.'
          };
        }
        return {
          score: 2,
          label: 'Needs policy work',
          caption: 'Use 16+ chars with uppercase, numbers, and symbols.'
        };
      }} onStrengthChange={detail => setLabel(detail.label)} />
        <Box style={showcasePanelStyle}>
          <strong style={{
          color: '#0f172a'
        }}>Current strength label</strong>
          <Box style={{
          color: '#64748b',
          fontSize: 13
        }}>{label}</Box>
          <p style={showcaseCaptionStyle}>This is the integration path for products with their own password policy language or compliance requirements.</p>
        </Box>
      </Grid>
    </ShowcaseSection>;
}`,...(R=(V=u.parameters)==null?void 0:V.docs)==null?void 0:R.source}}};var z,E,B;h.parameters={...h.parameters,docs:{...(z=h.parameters)==null?void 0:z.docs,source:{originalSource:`() => {
  const variants = [['classic', 'Classic'], ['surface', 'Surface'], ['soft', 'Soft'], ['outlined', 'Outlined'], ['filled', 'Filled'], ['flushed', 'Flushed'], ['minimal', 'Minimal'], ['contrast', 'Contrast'], ['elevated', 'Elevated']] as const;
  return <ShowcaseSection eyebrow="Visual System" title="Variant gallery" description="Each password field variant should keep the same affordances: direct typing, reveal control, and predictable password guidance.">
      <Grid style={{
      display: 'grid',
      gap: 16,
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
    }}>
        {variants.map(([variant, title]) => <Box key={variant} style={{
        display: 'grid',
        gap: 10
      }}>
            <strong style={{
          color: '#0f172a',
          fontSize: 13
        }}>{title}</strong>
            <PasswordField label={\`\${title} password\`} description="Reveal stays ghosted by default so it reads as a field affordance, not a pill button." placeholder="Enter password" variant={variant} showStrength clearable />
          </Box>)}
      </Grid>
    </ShowcaseSection>;
}`,...(B=(E=h.parameters)==null?void 0:E.docs)==null?void 0:B.source}}};var G,L,U;g.parameters={...g.parameters,docs:{...(G=g.parameters)==null?void 0:G.docs,source:{originalSource:`() => <ShowcaseSection eyebrow="Operational States" title="Production state coverage" description="The component needs to hold up not just in the default state, but in readonly, invalid, success, no-reveal, and dense admin usage.">
    <Grid style={{
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
  }}>
      <PasswordField label="Readonly password" description="Used in audit views where reveal should not mutate the field." value="ReadonlySecret42!" readOnly variant="surface" />
      <PasswordField label="Validation error" description="Used when the backend rejects the credential or policy requirements are unmet." value="short" validation="error" error="Password must be at least 12 characters." showStrength tone="danger" variant="outlined" />
      <PasswordField label="Validated success" description="Used after policy confirmation in setup or reset flows." value="VeryStrongPassword#42" validation="success" showStrength tone="success" variant="soft" />
      <PasswordField label="No reveal" description="For sensitive support-console flows where reveal is intentionally suppressed." placeholder="Enter recovery secret" revealable={false} autoComplete="off" variant="contrast" tone="warning" />
      <PasswordField label="Disabled field" description="Communicates locked state cleanly without showing stray toggle chrome." value="DisabledValue42!" disabled showStrength variant="filled" />
      <PasswordField label="Clearable with counter" description="Useful for temporary secret entry or wizard-style setup steps." placeholder="Set workspace password" clearable counter maxlength={32} variant="elevated" />
    </Grid>
  </ShowcaseSection>`,...(U=(L=g.parameters)==null?void 0:L.docs)==null?void 0:U.source}}};var A,D,O;m.parameters={...m.parameters,docs:{...(A=m.parameters)==null?void 0:A.docs,source:{originalSource:`() => <ShowcaseSection eyebrow="Layout Variations" title="Density, size, and shape patterns" description="These are the combinations teams usually need when the same field moves from app shell forms into admin rails or console drawers.">
    <Grid style={{
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'
  }}>
      <PasswordField label="Compact square" description="Toolbar-style administrative density." density="compact" size="sm" shape="square" variant="outlined" />
      <PasswordField label="Default soft" description="Balanced product default." density="default" size="md" shape="soft" variant="surface" showStrength />
      <PasswordField label="Comfortable large" description="Signup and recovery forms that need more breathing room." density="comfortable" size="lg" shape="soft" floatingLabel variant="elevated" showStrength />
    </Grid>
  </ShowcaseSection>`,...(O=(D=m.parameters)==null?void 0:D.docs)==null?void 0:O.source}}};const Q=["Playground","SignupRequirements","SecurityConsole","EnterprisePolicy","VariantGallery","StateMatrix","DensityAndShape"];export{m as DensityAndShape,u as EnterprisePolicy,d as Playground,p as SecurityConsole,c as SignupRequirements,g as StateMatrix,h as VariantGallery,Q as __namedExportsOrder,K as default};
