import{O as a,j as r,B as o,a as n,G as T,g as P}from"./index-c1b18327.js";import"./index-93f6b7ae.js";const G={title:"UI/Input",component:a,argTypes:{value:{control:"text"},placeholder:{control:"text"},disabled:{control:"boolean"},clearable:{control:"boolean"},debounce:{control:"number"},validation:{control:{type:"radio",options:["none","error","success"]}},size:{control:{type:"radio",options:["1","2","3","sm","md","lg"]}},maxlength:{control:"number"},minlength:{control:"number"},autofocus:{control:"boolean"},required:{control:"boolean"},floatingLabel:{control:"boolean"},counter:{control:"boolean"},variant:{control:"select",options:["classic","surface","soft","outlined","filled","flushed","minimal","contrast","elevated"]},tone:{control:"select",options:["default","brand","success","warning","danger"]},density:{control:"select",options:["default","compact","comfortable"]},shape:{control:"select",options:["default","square","soft"]},radius:{control:{type:"radio",options:["none","default","large","full"]}},label:{control:"text"},description:{control:"text"}}},l=e=>r(o,{style:{inlineSize:"min(460px, 100%)"},children:[n(a,{value:e.value,placeholder:e.placeholder,disabled:e.disabled,clearable:e.clearable,debounce:e.debounce,validation:e.validation,size:e.size,minlength:e.minlength,maxlength:e.maxlength,autofocus:e.autofocus,required:e.required,floatingLabel:e.floatingLabel,counter:e.counter,variant:e.variant,tone:e.tone,density:e.density,shape:e.shape,radius:e.radius==="default"?void 0:e.radius,label:e.label,description:e.description,onDebouncedInput:D=>{const c=document.getElementById("input-playground-value");c&&(c.textContent=`Debounced value: ${D}`)}}),n(o,{id:"input-playground-value",style:{marginTop:8,fontSize:12,color:"#64748b"},children:"Debounced value:"})]});l.args={value:"",placeholder:"Type here…",disabled:!1,clearable:!0,debounce:220,validation:"none",size:"md",minlength:void 0,maxlength:64,autofocus:!1,required:!1,floatingLabel:!1,counter:!1,variant:"surface",tone:"default",density:"default",shape:"default",radius:"default",label:"Workspace name",description:"Shown in the app header and analytics reports."};const t=()=>n(o,{style:{inlineSize:"min(480px, 100%)"},children:r(a,{label:"Search users",description:"Prefix, suffix, and custom error slot.",clearable:!0,variant:"outlined",placeholder:"Find by name or email",children:[n("span",{slot:"prefix",children:"🔍"}),n("button",{slot:"suffix",style:{border:"none",background:"transparent",cursor:"pointer"},children:"Go"}),n("span",{slot:"error",children:"No matching user in current workspace."})]})}),i=()=>r(T,{style:{display:"grid",gap:14,gridTemplateColumns:"repeat(3, minmax(240px, 1fr))"},children:[r(o,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:12,display:"grid",gap:10},children:[n(o,{style:{fontSize:12,color:"#64748b"},children:"MUI-like"}),n(a,{label:"Project",variant:"outlined",tone:"brand",placeholder:"Roadmap V3"}),n(a,{label:"Version",variant:"filled",placeholder:"2.1.0"})]}),r(o,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:12,display:"grid",gap:10,background:"linear-gradient(145deg, #f8fafc, #eef2ff)"},children:[n(o,{style:{fontSize:12,color:"#64748b"},children:"Chakra-like"}),n(a,{label:"Team",variant:"soft",tone:"success",shape:"soft",placeholder:"Engineering"}),n(a,{label:"Channel",variant:"soft",tone:"brand",shape:"soft",placeholder:"#release-sync"})]}),r(o,{style:{border:"1px solid #1e293b",borderRadius:12,padding:12,display:"grid",gap:10,background:"#020617"},children:[n(o,{style:{fontSize:12,color:"#93a4bd"},children:"Ant-like"}),n(a,{label:"Email",variant:"contrast",placeholder:"ops@company.com",type:"email"}),n(a,{label:"Token",variant:"flushed",tone:"warning",placeholder:"Paste token"})]})]}),s=()=>r(T,{style:{display:"grid",gap:12,inlineSize:"min(480px, 100%)"},children:[n(a,{label:"Release note",description:"Validation + counter mode.",validation:"error",counter:!0,maxlength:48,value:"Need update",clearable:!0,children:n("span",{slot:"error",children:"Please include the ticket reference."})}),n(a,{label:"Tag",validation:"success",value:"approved",size:"sm",tone:"success"})]}),d=()=>n(P,{tokens:{colors:{primary:"#0f766e",background:"#f8fafc",text:"#0f172a"},radius:"12px"},children:n(o,{style:{padding:12,background:"var(--ui-color-background)",borderRadius:12,inlineSize:"min(460px, 100%)"},children:n(a,{label:"Token-driven input",placeholder:"Uses theme provider tokens",variant:"elevated"})})});var u,p,b;l.parameters={...l.parameters,docs:{...(u=l.parameters)==null?void 0:u.docs,source:{originalSource:`(args: any) => <Box style={{
  inlineSize: 'min(460px, 100%)'
}}>
    <Input value={args.value} placeholder={args.placeholder} disabled={args.disabled} clearable={args.clearable} debounce={args.debounce} validation={args.validation} size={args.size} minlength={args.minlength} maxlength={args.maxlength} autofocus={args.autofocus} required={args.required} floatingLabel={args.floatingLabel} counter={args.counter} variant={args.variant} tone={args.tone} density={args.density} shape={args.shape} radius={args.radius === 'default' ? undefined : args.radius} label={args.label} description={args.description} onDebouncedInput={next => {
    const root = document.getElementById('input-playground-value');
    if (root) root.textContent = \`Debounced value: \${next}\`;
  }} />
    <Box id="input-playground-value" style={{
    marginTop: 8,
    fontSize: 12,
    color: '#64748b'
  }}>
      Debounced value:
    </Box>
  </Box>`,...(b=(p=l.parameters)==null?void 0:p.docs)==null?void 0:b.source}}};var m,f,g;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`() => <Box style={{
  inlineSize: 'min(480px, 100%)'
}}>
    <Input label="Search users" description="Prefix, suffix, and custom error slot." clearable variant="outlined" placeholder="Find by name or email">
      <span slot="prefix">🔍</span>
      <button slot="suffix" style={{
      border: 'none',
      background: 'transparent',
      cursor: 'pointer'
    }}>Go</button>
      <span slot="error">No matching user in current workspace.</span>
    </Input>
  </Box>`,...(g=(f=t.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};var h,x,y;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 14,
  gridTemplateColumns: 'repeat(3, minmax(240px, 1fr))'
}}>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 12,
    display: 'grid',
    gap: 10
  }}>
      <Box style={{
      fontSize: 12,
      color: '#64748b'
    }}>MUI-like</Box>
      <Input label="Project" variant="outlined" tone="brand" placeholder="Roadmap V3" />
      <Input label="Version" variant="filled" placeholder="2.1.0" />
    </Box>

    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 12,
    display: 'grid',
    gap: 10,
    background: 'linear-gradient(145deg, #f8fafc, #eef2ff)'
  }}>
      <Box style={{
      fontSize: 12,
      color: '#64748b'
    }}>Chakra-like</Box>
      <Input label="Team" variant="soft" tone="success" shape="soft" placeholder="Engineering" />
      <Input label="Channel" variant="soft" tone="brand" shape="soft" placeholder="#release-sync" />
    </Box>

    <Box style={{
    border: '1px solid #1e293b',
    borderRadius: 12,
    padding: 12,
    display: 'grid',
    gap: 10,
    background: '#020617'
  }}>
      <Box style={{
      fontSize: 12,
      color: '#93a4bd'
    }}>Ant-like</Box>
      <Input label="Email" variant="contrast" placeholder="ops@company.com" type="email" />
      <Input label="Token" variant="flushed" tone="warning" placeholder="Paste token" />
    </Box>
  </Grid>`,...(y=(x=i.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var v,k,B;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 12,
  inlineSize: 'min(480px, 100%)'
}}>
    <Input label="Release note" description="Validation + counter mode." validation="error" counter maxlength={48} value="Need update" clearable>
      <span slot="error">Please include the ticket reference.</span>
    </Input>
    <Input label="Tag" validation="success" value="approved" size="sm" tone="success" />
  </Grid>`,...(B=(k=s.parameters)==null?void 0:k.docs)==null?void 0:B.source}}};var S,z,I;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`() => <ThemeProvider tokens={{
  colors: {
    primary: '#0f766e',
    background: '#f8fafc',
    text: '#0f172a'
  },
  radius: '12px'
}}>
    <Box style={{
    padding: 12,
    background: 'var(--ui-color-background)',
    borderRadius: 12,
    inlineSize: 'min(460px, 100%)'
  }}>
      <Input label="Token-driven input" placeholder="Uses theme provider tokens" variant="elevated" />
    </Box>
  </ThemeProvider>`,...(I=(z=d.parameters)==null?void 0:z.docs)==null?void 0:I.source}}};const V=["Playground","WithSlots","DesignDirections","ValidationAndCounter","ThemedByTokens"];export{i as DesignDirections,l as Playground,d as ThemedByTokens,s as ValidationAndCounter,t as WithSlots,V as __namedExportsOrder,G as default};
