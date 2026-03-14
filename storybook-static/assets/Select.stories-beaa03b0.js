import{o as h,a as e,G as n,j as t,M as C,N as k,O as T,P as B,B as s,F as b,b as I,l as f,g as A,_ as g}from"./index-ce0e40fa.js";import{R as d}from"./index-93f6b7ae.js";import"./index-c197feae.js";const j={title:"UI/Select",component:h,args:{value:"review",disabled:!1,loading:!1,required:!1,invalid:!1,placeholder:"Choose a status",size:"md",variant:"soft",tone:"default",density:"default",shape:"rounded",elevation:"low",radius:12,optionBorder:!1,validation:"none"},argTypes:{value:{control:"text"},disabled:{control:"boolean"},loading:{control:"boolean"},required:{control:"boolean"},invalid:{control:"boolean"},placeholder:{control:"text"},variant:{control:"select",options:["classic","surface","soft","filled","outline","line","minimal","ghost","solid","glass","contrast"]},size:{control:"select",options:["sm","md","lg","1","2","3"]},density:{control:"select",options:["default","compact","comfortable"]},shape:{control:"select",options:["rounded","square","pill"]},elevation:{control:"select",options:["none","low","high"]},tone:{control:"select",options:["default","brand","success","warning","danger"]},validation:{control:"select",options:["none","success","warning","error"]},radius:{control:"text"},optionBorder:{control:"boolean"}}},P=[{value:"draft",label:"Draft"},{value:"review",label:"In review"},{value:"approved",label:"Approved"},{value:"published1",label:"Published1"},{value:"published2",label:"Published2"},{value:"published3",label:"Published3"},{value:"published4",label:"Published4"},{value:"published5",label:"Published5"},{value:"published6",label:"Published6"},{value:"published7",label:"Published7"},{value:"published8",label:"Published8"},{value:"published9",label:"Published9"},{value:"published10",label:"Published10"},{value:"published11",label:"Published11"},{value:"published12",label:"Published12"},{value:"published13",label:"Published13"},{value:"published14",label:"Published14"},{value:"published15",label:"Published15"},{value:"published16",label:"Published16"},{value:"published17",label:"Published17"},{value:"published18",label:"Published18"},{value:"published19",label:"Published19"},{value:"published20",label:"Published20"},{value:"published21",label:"Published21"},{value:"published22",label:"Published22"},{value:"published23",label:"Published23"},{value:"published24",label:"Published24"},{value:"published25",label:"Published25"}];function v(l){return e("button",{type:"button",onClick:l.onClick,style:{appearance:"none",border:"none",borderBottom:l.active?"3px solid var(--ui-color-primary, #2563eb)":"3px solid transparent",background:"transparent",color:l.active?"var(--ui-color-text, #0f172a)":"var(--ui-color-muted, #64748b)",padding:"14px 4px 12px",font:"600 15px/1.4 inherit",cursor:"pointer"},children:l.children})}function R(l){return l==="purple"?g({colors:{primary:"#8b5cf6",primaryHover:"#7c3aed",focusRing:"#8b5cf6"},palette:{accent:{1:"#fdfcff",2:"#faf7ff",3:"#f3ecff",4:"#eadcff",5:"#ddc7ff",6:"#cdb0ff",7:"#b693ff",8:"#9b70ff",9:"#8b5cf6",10:"#7c3aed",11:"#6d28d9",12:"#2e1065"},accentAlpha:{1:"#7c3aed03",2:"#7c3aed08",3:"#7c3aed14",4:"#7c3aed24",5:"#7c3aed38",6:"#7c3aed4d",7:"#7c3aed68",8:"#7c3aed8f",9:"#7c3aed",10:"#6d28d9",11:"#5b21b6",12:"#2e1065"},accentContrast:"#ffffff",accentSurface:"#f5f0ffcc",accentIndicator:"#8b5cf6",accentTrack:"#8b5cf6"}},{accentPalette:"blue",mode:"light"}):g({},{accentPalette:l,mode:"light"})}function a(l){const[r,i]=d.useState(l.defaultValue??"review"),o=t(n,{style:{gap:12},children:[e(s,{style:{minHeight:148,borderRadius:16,border:"2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent)",background:"linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)",display:"grid",placeItems:"center",padding:20},children:e(s,{style:{width:"min(280px, 100%)"},children:t(h,{label:l.label||"Workflow status",description:"Open the menu to inspect option rendering.",placeholder:l.placeholder||"Choose a status",value:r,onChange:i,variant:l.variant,size:l.size,elevation:l.elevation,radius:l.radius,validation:l.validation&&l.validation!=="none"?l.validation:void 0,optionBorder:l.optionBorder,children:[l.placeholder?e("option",{value:"",children:l.placeholder}):null,P.map(p=>e("option",{value:p.value,children:p.label},p.value))]})})}),l.caption?e("div",{style:{fontSize:13,color:"#64748b",textAlign:"center"},children:l.caption}):null]});return l.palette?e(A,{tokens:R(l.palette),children:o}):o}function F(){const[l,r]=d.useState("theme");return t(n,{style:{gap:20,maxInlineSize:1280},children:[e("div",{children:e("div",{style:{fontSize:44,lineHeight:1.05,fontWeight:700,color:"#111827"},children:"Select"})}),t(b,{style:{gap:28,borderBottom:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)"},children:[e(v,{active:l==="theme",onClick:()=>r("theme"),children:"Theme colors"}),e(v,{active:l==="colors",onClick:()=>r("colors"),children:"All colors"}),e(v,{active:l==="sizes",onClick:()=>r("sizes"),children:"All sizes"})]}),l==="theme"?e(n,{style:{gap:22},children:t(n,{style:{gridTemplateColumns:"120px repeat(4, minmax(240px, 1fr))",gap:18,alignItems:"start"},children:[e("div",{style:{fontSize:18,color:"#5b6574"},children:"Surface"}),e(a,{variant:"surface",size:"md",elevation:"low",palette:"blue"}),e(a,{variant:"surface",size:"md",elevation:"low",palette:"gray"}),e(a,{variant:"surface",size:"md",elevation:"low",palette:"purple"}),e(a,{variant:"surface",size:"md",elevation:"low",palette:"green"}),e("div",{style:{fontSize:18,color:"#5b6574"},children:"Soft"}),e(a,{variant:"soft",size:"md",elevation:"low",palette:"blue"}),e(a,{variant:"soft",size:"md",elevation:"low",palette:"gray"}),e(a,{variant:"soft",size:"md",elevation:"low",palette:"purple"}),e(a,{variant:"soft",size:"md",elevation:"low",palette:"green"}),e("div",{style:{fontSize:18,color:"#5b6574"},children:"Solid"}),e(a,{variant:"solid",size:"md",elevation:"low",palette:"blue"}),e(a,{variant:"solid",size:"md",elevation:"low",palette:"gray"}),e(a,{variant:"solid",size:"md",elevation:"low",palette:"purple"}),e(a,{variant:"solid",size:"md",elevation:"low",palette:"green"}),e("div",{style:{fontSize:18,color:"#5b6574"},children:"Contrast"}),e(a,{variant:"contrast",size:"md",elevation:"low",palette:"blue"}),e(a,{variant:"contrast",size:"md",elevation:"low",palette:"gray"}),e(a,{variant:"contrast",size:"md",elevation:"low",palette:"purple"}),e(a,{variant:"contrast",size:"md",elevation:"low",palette:"green"})]})}):null,l==="colors"?e(n,{style:{gap:16},children:t(n,{style:{gridTemplateColumns:"120px repeat(3, minmax(240px, 1fr))",gap:18,alignItems:"start"},children:[e("div",{}),e("div",{style:{textAlign:"center",fontSize:18,color:"#5b6574"},children:"Surface"}),e("div",{style:{textAlign:"center",fontSize:18,color:"#5b6574"},children:"Soft"}),e("div",{style:{textAlign:"center",fontSize:18,color:"#5b6574"},children:"Solid"}),["gray","amber","red","purple","blue","green"].map(i=>t(d.Fragment,{children:[e("div",{style:{fontSize:18,color:"#5b6574",textTransform:"capitalize"},children:i}),e(a,{variant:"surface",size:"md",elevation:"low",palette:i}),e(a,{variant:"soft",size:"md",elevation:"low",palette:i}),e(a,{variant:"solid",size:"md",elevation:"low",palette:i})]},i))]})}):null,l==="sizes"?e(n,{style:{gap:18},children:t(n,{style:{gridTemplateColumns:"120px repeat(3, minmax(240px, 1fr))",gap:18,alignItems:"start"},children:[e("div",{}),e("div",{style:{textAlign:"center",fontSize:18,color:"#5b6574"},children:"Surface"}),e("div",{style:{textAlign:"center",fontSize:18,color:"#5b6574"},children:"Soft"}),e("div",{style:{textAlign:"center",fontSize:18,color:"#5b6574"},children:"Solid"}),["1","2","3"].map(i=>t(d.Fragment,{children:[t("div",{style:{fontSize:18,color:"#5b6574"},children:["Size ",i]}),e(a,{variant:"surface",size:i,elevation:"low",palette:"blue"}),e(a,{variant:"soft",size:i,elevation:"low",palette:"blue"}),e(a,{variant:"solid",size:i,elevation:"low",palette:"blue"})]},i))]})}):null]})}const c={render:()=>e(F,{})},u={render:l=>{const[r,i]=d.useState(l.value||"review");return d.useEffect(()=>{i(l.value||"")},[l.value]),e(n,{style:{gap:16,maxInlineSize:1040},children:t(C,{radius:18,children:[t(k,{children:[e(T,{children:"Production select surface"}),e(B,{children:"Controlled wrapper around `ui-select` with theme-backed variants, sizing, validation, and option-surface styling."})]}),t(s,{slot:"inset",style:{padding:16,display:"grid",gap:16},children:[e(s,{style:{minHeight:220,borderRadius:18,border:"2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent)",background:"linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)",display:"grid",placeItems:"center",padding:24},children:e(s,{style:{width:"min(320px, 100%)"},children:t(h,{...l,label:"Workflow status",description:"Used by reviewers and publish automations.",value:r,onChange:i,validation:l.validation&&l.validation!=="none"?l.validation:void 0,radius:"4px",children:[l.placeholder?e("option",{value:"",children:l.placeholder}):null,P.map(o=>e("option",{value:o.value,children:o.label},o.value))]})})}),t(b,{align:"center",justify:"space-between",style:{gap:12,flexWrap:"wrap"},children:[t(b,{align:"center",style:{gap:8,flexWrap:"wrap"},children:[e(I,{variant:"secondary",onClick:()=>i("draft"),children:"Reset to draft"}),t(f,{tone:"info",children:["value: ",r||"placeholder"]})]}),t(f,{tone:"neutral",children:["variant: ",String(l.variant||"classic")]})]})]})]})})}};var m,y,x;c.parameters={...c.parameters,docs:{...(m=c.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <ThemeTokenMatrixStory />
}`,...(x=(y=c.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};var w,z,S;u.parameters={...u.parameters,docs:{...(w=u.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = React.useState(args.value || 'review');
    React.useEffect(() => {
      setValue(args.value || '');
    }, [args.value]);
    return <Grid style={{
      gap: 16,
      maxInlineSize: 1040
    }}>
        <Card radius={18}>
          <CardHeader>
            <CardTitle>Production select surface</CardTitle>
            <CardDescription>
              Controlled wrapper around \`ui-select\` with theme-backed variants, sizing, validation, and option-surface styling.
            </CardDescription>
          </CardHeader>
          <Box slot="inset" style={{
          padding: 16,
          display: 'grid',
          gap: 16
        }}>
            <Box style={{
            minHeight: 220,
            borderRadius: 18,
            border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent)',
            background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
            display: 'grid',
            placeItems: 'center',
            padding: 24
          }}>
              <Box style={{
              width: 'min(320px, 100%)'
            }}>
                <Select {...args} label="Workflow status" description="Used by reviewers and publish automations." value={value} onChange={setValue} validation={args.validation && args.validation !== 'none' ? args.validation : undefined} radius={"4px"}>
                  {args.placeholder ? <option value="">{args.placeholder}</option> : null}
                  {workflowOptions.map(option => <option key={option.value} value={option.value}>
                      {option.label}
                    </option>)}
                </Select>
              </Box>
            </Box>

            <Flex align="center" justify="space-between" style={{
            gap: 12,
            flexWrap: 'wrap'
          }}>
              <Flex align="center" style={{
              gap: 8,
              flexWrap: 'wrap'
            }}>
                <Button variant="secondary" onClick={() => setValue('draft')}>
                  Reset to draft
                </Button>
                <Badge tone="info">value: {value || 'placeholder'}</Badge>
              </Flex>
              <Badge tone="neutral">variant: {String(args.variant || 'classic')}</Badge>
            </Flex>
          </Box>
        </Card>
      </Grid>;
  }
}`,...(S=(z=u.parameters)==null?void 0:z.docs)==null?void 0:S.source}}};const M=["ThemeTokenMatrix","Playground"];export{u as Playground,c as ThemeTokenMatrix,M as __namedExportsOrder,j as default};
