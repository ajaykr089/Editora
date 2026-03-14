import{aU as d,a as e,j as t,B as C,ao as R,aV as I,b as M}from"./index-ce0e40fa.js";import{R as c}from"./index-93f6b7ae.js";import{S as T,a as p,b as V,c as l,s as O,f as h,d as k}from"./storybook-showcase-2b62d73c.js";import"./index-c197feae.js";const E={title:"UI/PinInput",component:d,argTypes:{length:{control:{type:"range",min:4,max:8,step:1}},mask:{control:"boolean"},mode:{control:"select",options:["numeric","alpha","alphanumeric"]}}},o=n=>{const[a,s]=c.useState(""),[x,P]=c.useState("");return e(T,{eyebrow:"Verification Inputs",title:"Segmented pin entry should feel secure, calm, and operationally clear",description:"These stories are intended to validate focus flow, paste behavior, completion states, and visual rhythm for authentication and approval flows.",meta:[{label:"Entry mode",value:n.mode},{label:"Length",value:`${n.length} cells`},{label:"Masking",value:n.mask?"On":"Off",tone:n.mask?"warning":"neutral"}],children:e(p,{eyebrow:"Default Pattern",title:"Verification code",description:"The segmented field should be easy to scan, forgiving to paste, and visually balanced enough to sit in auth screens without looking improvised.",children:t(C,{style:{display:"grid",gap:16,maxWidth:560},children:[t("div",{style:V,children:[e("span",{style:l,children:"Auto-advance"}),e("span",{style:l,children:"Paste friendly"}),e("span",{style:l,children:"Completion event"})]}),e(d,{length:n.length,mode:n.mode,mask:n.mask,label:"Verification code",description:"Enter the one-time code sent to your device.",value:a,onChange:s,onComplete:P,placeholderChar:"•"}),t("div",{style:{...O,gap:8},children:[e("div",{style:{fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#64748b"},children:"Input state"}),t("div",{style:{fontSize:14,color:"#0f172a"},children:["Current: ",e("code",{style:h,children:a||"(empty)"})]}),t("div",{style:{fontSize:14,color:"#0f172a"},children:["Complete: ",e("code",{style:h,children:x||"(waiting)"})]})]})]})})})};o.args={length:6,mode:"numeric",mask:!1};const r=()=>t(p,{eyebrow:"Admin Recovery",title:"Longer OTP pattern",description:"Alpha-numeric recovery paths need stronger framing and more semantic grouping than a standard login OTP.",children:[e(R,{legend:"Recovery verification",description:"Alpha-numeric challenge code for admin recovery flows.",variant:"surface",style:{maxWidth:640},children:e(I,{length:8,mode:"alphanumeric",label:"Recovery code",description:"Paste or type the issued code."})}),e("p",{style:k,children:"Use this for account recovery, secondary approval, and high-assurance admin challenges."})]}),i=()=>{const n=c.useRef(null);return e(p,{eyebrow:"Sensitive Flow",title:"Masked approval entry",description:"Masking should still preserve calm spacing and an obvious recovery action when the user needs to restart entry.",children:t(C,{style:{display:"grid",gap:16,maxWidth:560},children:[e(d,{ref:n,length:6,mask:!0,label:"Secure approval code",description:"Masked entry for high-sensitivity flows."}),t("div",{style:{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"},children:[e(M,{size:"sm",onClick:()=>{var a,s;return(s=(a=n.current)==null?void 0:a.clear)==null?void 0:s.call(a)},children:"Clear code"}),e("p",{style:k,children:"Reset should feel secondary and deliberate, not like a destructive primary action."})]})]})})};var u,m,y;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`(args: any) => {
  const [value, setValue] = React.useState('');
  const [completed, setCompleted] = React.useState('');
  return <ShowcasePage eyebrow="Verification Inputs" title="Segmented pin entry should feel secure, calm, and operationally clear" description="These stories are intended to validate focus flow, paste behavior, completion states, and visual rhythm for authentication and approval flows." meta={[{
    label: 'Entry mode',
    value: args.mode
  }, {
    label: 'Length',
    value: \`\${args.length} cells\`
  }, {
    label: 'Masking',
    value: args.mask ? 'On' : 'Off',
    tone: args.mask ? 'warning' : 'neutral'
  }]}>
      <ShowcaseSection eyebrow="Default Pattern" title="Verification code" description="The segmented field should be easy to scan, forgiving to paste, and visually balanced enough to sit in auth screens without looking improvised.">
        <Box style={{
        display: 'grid',
        gap: 16,
        maxWidth: 560
      }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Auto-advance</span>
            <span style={showcaseChipStyle}>Paste friendly</span>
            <span style={showcaseChipStyle}>Completion event</span>
          </div>
          <PinInput length={args.length} mode={args.mode} mask={args.mask} label="Verification code" description="Enter the one-time code sent to your device." value={value} onChange={setValue} onComplete={setCompleted} placeholderChar="•" />
          <div style={{
          ...showcasePanelStyle,
          gap: 8
        }}>
            <div style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#64748b'
          }}>
              Input state
            </div>
            <div style={{
            fontSize: 14,
            color: '#0f172a'
          }}>
              Current: <code style={showcaseMonoStyle}>{value || '(empty)'}</code>
            </div>
            <div style={{
            fontSize: 14,
            color: '#0f172a'
          }}>
              Complete: <code style={showcaseMonoStyle}>{completed || '(waiting)'}</code>
            </div>
          </div>
        </Box>
      </ShowcaseSection>
    </ShowcasePage>;
}`,...(y=(m=o.parameters)==null?void 0:m.docs)==null?void 0:y.source}}};var g,v,f;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`() => <ShowcaseSection eyebrow="Admin Recovery" title="Longer OTP pattern" description="Alpha-numeric recovery paths need stronger framing and more semantic grouping than a standard login OTP.">
    <Fieldset legend="Recovery verification" description="Alpha-numeric challenge code for admin recovery flows." variant="surface" style={{
    maxWidth: 640
  }}>
      <OTPInput length={8} mode="alphanumeric" label="Recovery code" description="Paste or type the issued code." />
    </Fieldset>
    <p style={showcaseCaptionStyle}>Use this for account recovery, secondary approval, and high-assurance admin challenges.</p>
  </ShowcaseSection>`,...(f=(v=r.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};var w,S,b;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`() => {
  const ref = React.useRef<HTMLElement | null>(null);
  return <ShowcaseSection eyebrow="Sensitive Flow" title="Masked approval entry" description="Masking should still preserve calm spacing and an obvious recovery action when the user needs to restart entry.">
      <Box style={{
      display: 'grid',
      gap: 16,
      maxWidth: 560
    }}>
        <PinInput ref={ref} length={6} mask label="Secure approval code" description="Masked entry for high-sensitivity flows." />
        <div style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
          <Button size="sm" onClick={() => (ref.current as any)?.clear?.()}>Clear code</Button>
          <p style={showcaseCaptionStyle}>Reset should feel secondary and deliberate, not like a destructive primary action.</p>
        </div>
      </Box>
    </ShowcaseSection>;
}`,...(b=(S=i.parameters)==null?void 0:S.docs)==null?void 0:b.source}}};const F=["VerificationCode","RecoveryCode","MaskedEntry"];export{i as MaskedEntry,r as RecoveryCode,o as VerificationCode,F as __namedExportsOrder,E as default};
