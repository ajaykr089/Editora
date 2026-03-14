import{aO as i,a as e,j as n,g as K,_ as Q}from"./index-ce0e40fa.js";import{R as q}from"./index-93f6b7ae.js";import{s as X,S as Y,a as l,e as Z,b as $,c as z}from"./storybook-showcase-2b62d73c.js";import"./index-c197feae.js";const de={title:"UI/NavigationMenu",component:i,args:{orientation:"horizontal",activation:"automatic",variant:"surface",size:"md",radius:12,elevation:"low",tone:"default",loop:!0,collapsible:!1},argTypes:{selected:{control:"number"},orientation:{control:"select",options:["horizontal","vertical"]},activation:{control:"select",options:["automatic","manual"]},variant:{control:"select",options:["surface","soft","solid","outline","flat","contrast"]},size:{control:"select",options:["sm","md","lg","1","2","3"]},radius:{control:"text"},elevation:{control:"select",options:["none","low","high"]},tone:{control:"select",options:["default","neutral","info","success","warning","danger"]},loop:{control:"boolean"},collapsible:{control:"boolean"}}};function ee(t){return Q({},{accentPalette:t,mode:"light"})}const te={position:"relative",display:"grid",alignItems:"start",justifyItems:"center",minHeight:780,padding:"40px 20px 120px",borderRadius:28,overflow:"hidden",background:"linear-gradient(120deg, #4361d9 0%, #6165dc 38%, #8756cf 100%)"},ne={position:"absolute",inset:"auto 10% 12% 10%",height:220,borderRadius:999,background:"radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 68%)",filter:"blur(20px)",pointerEvents:"none"},T={display:"grid",gridTemplateColumns:"1.02fr 1fr",gap:18},k={display:"grid",alignContent:"end",minHeight:100,padding:28,borderRadius:18,color:"#ffffff",background:"linear-gradient(145deg, #9551d2 0%, #5d64da 55%, #4b67e1 100%)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.18)"};({...X});const a={margin:0,fontSize:24,lineHeight:1.15,fontWeight:700,color:"#1f2937"},r={margin:0,fontSize:18,lineHeight:1.45,color:"#6b7280"},J={position:"relative",display:"grid",justifyItems:"center",alignItems:"start",minHeight:520,padding:"28px 20px 360px",borderRadius:24,border:"1px solid rgba(148, 163, 184, 0.18)",background:"linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,247,251,0.98) 100%)",boxSizing:"border-box",overflow:"visible"},ie={...J,minHeight:480,paddingBottom:320};function b(t){return n(i.Root,{...t,style:{width:"100%",maxWidth:1180},children:[n(i.List,{children:[n(i.Item,{children:[e(i.Trigger,{children:"Learn"}),e(i.Content,{children:n("div",{style:T,children:[e("div",{style:k,children:e("p",{style:{margin:0,fontSize:18,lineHeight:1.5,color:"rgba(255,255,255,0.9)"},children:"Unstyled, accessible components for React and design-system teams."})}),e("div",{style:{display:"grid",gap:18},children:n("div",{style:{display:"grid",gap:18,gridTemplateColumns:"1fr 1fr"},children:[n("div",{style:{display:"grid",gap:8},children:[e("h3",{style:{...a,fontSize:20},children:"Getting started"}),e("p",{style:{...r,fontSize:16},children:"A quick tutorial to get you up and running."})]}),n("div",{style:{display:"grid",gap:8},children:[e("h3",{style:{...a,fontSize:20},children:"Accessibility"}),e("p",{style:{...r,fontSize:16},children:"Tested in a range of browsers and assistive technologies."})]}),n("div",{style:{display:"grid",gap:8},children:[e("h3",{style:{...a,fontSize:20},children:"Styling"}),e("p",{style:{...r,fontSize:16},children:"Unstyled and compatible with any styling solution."})]}),n("div",{style:{display:"grid",gap:8},children:[e("h3",{style:{...a,fontSize:20},children:"Releases"}),e("p",{style:{...r,fontSize:16},children:"Track updates and ship consistent foundations."})]})]})})]})})]}),n(i.Item,{children:[e(i.Trigger,{children:"Overview"}),e(i.Content,{children:n("div",{style:T,children:[e("div",{style:k,children:n("div",{style:{display:"grid",gap:12},children:[e("div",{style:{fontSize:64,lineHeight:1,fontWeight:700},children:"✦"}),n("div",{style:{fontSize:54,lineHeight:.98,fontWeight:700,letterSpacing:"-0.03em"},children:["Platform",e("br",{}),"Overview"]}),e("p",{style:{margin:0,fontSize:18,lineHeight:1.5,color:"rgba(255,255,255,0.9)"},children:"Core packages, token system, and implementation guides for product teams."})]})}),e("div",{style:{display:"grid",gap:18},children:n("div",{style:{display:"grid",gap:18,gridTemplateColumns:"1fr"},children:[n("div",{style:{display:"grid",gap:8},children:[e("h3",{style:{...a,fontSize:20},children:"Colors"}),e("p",{style:{...r,fontSize:16},children:"Beautiful, thought-out palettes with auto dark mode."})]}),n("div",{style:{display:"grid",gap:8},children:[e("h3",{style:{...a,fontSize:20},children:"Icons"}),e("p",{style:{...r,fontSize:16},children:"A crisp set of 15x15 icons, balanced and consistent."})]})]})})]})})]}),e(i.Item,{children:e(i.Link,{href:"https://editora-free.netlify.app/",children:"Github"})})]}),e(i.Indicator,{}),e(i.Viewport,{})]})}function ae(t){return n("div",{style:te,children:[e("div",{style:ne}),e(b,{...t})]})}function f(t){const{frameStyle:s,...o}=t,[d,S]=q.useState(-1);return e("div",{style:s??J,onMouseLeave:()=>S(-1),onBlur:c=>{const w=c.relatedTarget;(!w||!c.currentTarget.contains(w))&&S(-1)},children:e(b,{...o,selected:d,onSelect:c=>S(c)})})}const g={render:t=>e(Y,{eyebrow:"Interactive Navigation",title:"Navigation Menu",description:"A collection of links for navigating websites. The shell, trigger bar, and content viewport are styled to feel like one composed surface rather than a basic tab strip.",meta:[{label:"Pattern",value:"Hero navigation"},{label:"Viewport",value:"Structured panel"},{label:"State",value:"Interactive"}],children:e(ae,{...t})})},p={render:()=>e(l,{eyebrow:"Visual Recipes",title:"Navigation Variants",description:"Use the same content with different shell treatments to validate how the trigger bar and panel feel across app surfaces.",children:e("div",{style:{display:"grid",gap:20},children:["surface","soft","solid","outline","flat","contrast"].map(t=>n("div",{style:{display:"grid",gap:10},children:[e("div",{style:{fontSize:18,fontWeight:700,color:"#475569",textTransform:"capitalize"},children:t}),e(f,{variant:t,size:"md",elevation:t==="flat"?"none":"low"})]},t))})})},h={render:()=>e(l,{eyebrow:"Scale",title:"Small, medium, large",description:"The size prop affects trigger rhythm and viewport padding so the menu can sit comfortably inside compact tools or spacious landing sections.",children:e("div",{style:{display:"grid",gap:22},children:["sm","md","lg"].map(t=>n("div",{style:{display:"grid",gap:10},children:[e("div",{style:{fontSize:18,fontWeight:700,color:"#475569",textTransform:"capitalize"},children:t}),e(f,{size:t,frameStyle:ie})]},t))})})},y={render:()=>e(l,{eyebrow:"Tones",title:"Semantic emphasis",description:"Tone changes the ring and active treatments without changing the structural geometry.",children:e("div",{style:{display:"grid",gap:22},children:["neutral","info","success","warning","danger"].map(t=>n("div",{style:{display:"grid",gap:10},children:[e("div",{style:{fontSize:18,fontWeight:700,color:"#475569",textTransform:"capitalize"},children:t}),e(f,{tone:t,variant:"soft"})]},t))})})},v={render:()=>e(l,{eyebrow:"Palettes",title:"All colors",description:"Preview the same navigation system across the accent palettes supported by the shared theme tokens.",children:e("div",{style:{display:"grid",gap:22},children:["blue","amber","green","red","gray"].map(t=>e(K,{tokens:ee(t),children:n("div",{style:{display:"grid",gap:10},children:[e("div",{style:{fontSize:18,fontWeight:700,color:"#475569",textTransform:"capitalize"},children:t}),e(f,{variant:"soft"})]})},t))})})},m={render:t=>e(l,{eyebrow:"Sidebar",title:"Vertical navigation",description:"The same API can collapse into a vertical rail with a stacked viewport for workspace side navigation.",children:e("div",{style:{maxWidth:420},children:n(i.Root,{...t,orientation:"vertical",size:"lg",variant:"soft",radius:16,elevation:"low",children:[n(i.List,{children:[n(i.Item,{children:[e(i.Trigger,{children:"Dashboard"}),e(i.Content,{children:n("div",{style:{display:"grid",gap:10},children:[e("h3",{style:{...a,fontSize:22},children:"Dashboard links"}),e("p",{style:{...r,fontSize:16},children:"Daily summaries, service status, and team activity."})]})})]}),n(i.Item,{children:[e(i.Trigger,{children:"Analytics"}),e(i.Content,{children:n("div",{style:{display:"grid",gap:10},children:[e("h3",{style:{...a,fontSize:22},children:"Analytics links"}),e("p",{style:{...r,fontSize:16},children:"Conversion, retention, and operational trend reports."})]})})]}),n(i.Item,{children:[e(i.Trigger,{children:"Billing"}),e(i.Content,{children:n("div",{style:{display:"grid",gap:10},children:[e("h3",{style:{...a,fontSize:22},children:"Billing links"}),e("p",{style:{...r,fontSize:16},children:"Plans, invoices, entitlements, and workspace limits."})]})})]})]}),e(i.Indicator,{}),e(i.Viewport,{})]})})})},u={render:()=>{const[t,s]=q.useState(1);return e(l,{eyebrow:"Controlled",title:"Selection managed in React",description:"The component still supports a controlled model while keeping the more polished visual shell.",children:n("div",{style:{display:"grid",gap:14},children:[e(b,{selected:t,onSelect:o=>s(o)}),n("div",{style:{...Z,fontSize:13},children:["Selected index: ",t]}),e("div",{style:$,children:["Learn","Overview","Github"].map((o,d)=>e("button",{type:"button",onClick:()=>s(d),style:{...z,cursor:"pointer",border:d===t?"1px solid color-mix(in srgb, #2563eb 32%, transparent)":z.border},children:o},o))})]})})}};var x,N,C;g.parameters={...g.parameters,docs:{...(x=g.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: args => <ShowcasePage eyebrow="Interactive Navigation" title="Navigation Menu" description="A collection of links for navigating websites. The shell, trigger bar, and content viewport are styled to feel like one composed surface rather than a basic tab strip." meta={[{
    label: 'Pattern',
    value: 'Hero navigation'
  }, {
    label: 'Viewport',
    value: 'Structured panel'
  }, {
    label: 'State',
    value: 'Interactive'
  }]}>
      <HeroComposition {...args} />
    </ShowcasePage>
}`,...(C=(N=g.parameters)==null?void 0:N.docs)==null?void 0:C.source}}};var M,P,I;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <ShowcaseSection eyebrow="Visual Recipes" title="Navigation Variants" description="Use the same content with different shell treatments to validate how the trigger bar and panel feel across app surfaces.">
      <div style={{
      display: 'grid',
      gap: 20
    }}>
        {(['surface', 'soft', 'solid', 'outline', 'flat', 'contrast'] as const).map(variant => <div key={variant} style={{
        display: 'grid',
        gap: 10
      }}>
            <div style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'capitalize'
        }}>{variant}</div>
            <GalleryNavigationPreview variant={variant} size="md" elevation={variant === 'flat' ? 'none' : 'low'} />
          </div>)}
      </div>
    </ShowcaseSection>
}`,...(I=(P=p.parameters)==null?void 0:P.docs)==null?void 0:I.source}}};var G,R,H;h.parameters={...h.parameters,docs:{...(G=h.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <ShowcaseSection eyebrow="Scale" title="Small, medium, large" description="The size prop affects trigger rhythm and viewport padding so the menu can sit comfortably inside compact tools or spacious landing sections.">
      <div style={{
      display: 'grid',
      gap: 22
    }}>
        {(['sm', 'md', 'lg'] as const).map(size => <div key={size} style={{
        display: 'grid',
        gap: 10
      }}>
            <div style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'capitalize'
        }}>{size}</div>
            <GalleryNavigationPreview size={size} frameStyle={compactGalleryFrameStyle} />
          </div>)}
      </div>
    </ShowcaseSection>
}`,...(H=(R=h.parameters)==null?void 0:R.docs)==null?void 0:H.source}}};var V,W,A;y.parameters={...y.parameters,docs:{...(V=y.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => <ShowcaseSection eyebrow="Tones" title="Semantic emphasis" description="Tone changes the ring and active treatments without changing the structural geometry.">
      <div style={{
      display: 'grid',
      gap: 22
    }}>
        {(['neutral', 'info', 'success', 'warning', 'danger'] as const).map(tone => <div key={tone} style={{
        display: 'grid',
        gap: 10
      }}>
            <div style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'capitalize'
        }}>{tone}</div>
            <GalleryNavigationPreview tone={tone} variant="soft" />
          </div>)}
      </div>
    </ShowcaseSection>
}`,...(A=(W=y.parameters)==null?void 0:W.docs)==null?void 0:A.source}}};var B,L,D;v.parameters={...v.parameters,docs:{...(B=v.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <ShowcaseSection eyebrow="Palettes" title="All colors" description="Preview the same navigation system across the accent palettes supported by the shared theme tokens.">
      <div style={{
      display: 'grid',
      gap: 22
    }}>
        {(['blue', 'amber', 'green', 'red', 'gray'] as const).map(palette => <ThemeProvider key={palette} tokens={paletteTokens(palette)}>
            <div style={{
          display: 'grid',
          gap: 10
        }}>
              <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#475569',
            textTransform: 'capitalize'
          }}>{palette}</div>
              <GalleryNavigationPreview variant="soft" />
            </div>
          </ThemeProvider>)}
      </div>
    </ShowcaseSection>
}`,...(D=(L=v.parameters)==null?void 0:L.docs)==null?void 0:D.source}}};var O,j,U;m.parameters={...m.parameters,docs:{...(O=m.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: args => <ShowcaseSection eyebrow="Sidebar" title="Vertical navigation" description="The same API can collapse into a vertical rail with a stacked viewport for workspace side navigation.">
      <div style={{
      maxWidth: 420
    }}>
        <NavigationMenu.Root {...args} orientation="vertical" size="lg" variant="soft" radius={16} elevation="low">
          <NavigationMenu.List>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger>Dashboard</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div style={{
                display: 'grid',
                gap: 10
              }}>
                  <h3 style={{
                  ...sectionTitleStyle,
                  fontSize: 22
                }}>Dashboard links</h3>
                  <p style={{
                  ...sectionBodyStyle,
                  fontSize: 16
                }}>Daily summaries, service status, and team activity.</p>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger>Analytics</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div style={{
                display: 'grid',
                gap: 10
              }}>
                  <h3 style={{
                  ...sectionTitleStyle,
                  fontSize: 22
                }}>Analytics links</h3>
                  <p style={{
                  ...sectionBodyStyle,
                  fontSize: 16
                }}>Conversion, retention, and operational trend reports.</p>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger>Billing</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div style={{
                display: 'grid',
                gap: 10
              }}>
                  <h3 style={{
                  ...sectionTitleStyle,
                  fontSize: 22
                }}>Billing links</h3>
                  <p style={{
                  ...sectionBodyStyle,
                  fontSize: 16
                }}>Plans, invoices, entitlements, and workspace limits.</p>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
          <NavigationMenu.Indicator />
          <NavigationMenu.Viewport />
        </NavigationMenu.Root>
      </div>
    </ShowcaseSection>
}`,...(U=(j=m.parameters)==null?void 0:j.docs)==null?void 0:U.source}}};var F,_,E;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = React.useState(1);
    return <ShowcaseSection eyebrow="Controlled" title="Selection managed in React" description="The component still supports a controlled model while keeping the more polished visual shell.">
        <div style={{
        display: 'grid',
        gap: 14
      }}>
          <ReferenceNavigation selected={selected} onSelect={next => setSelected(next)} />
          <div style={{
          ...showcaseBodyStyle,
          fontSize: 13
        }}>Selected index: {selected}</div>
          <div style={showcaseChipRowStyle}>
            {['Learn', 'Overview', 'Github'].map((label, index) => <button key={label} type="button" onClick={() => setSelected(index)} style={{
            ...showcaseChipStyle,
            cursor: 'pointer',
            border: index === selected ? '1px solid color-mix(in srgb, #2563eb 32%, transparent)' : showcaseChipStyle.border
          }}>
                {label}
              </button>)}
          </div>
        </div>
      </ShowcaseSection>;
  }
}`,...(E=(_=u.parameters)==null?void 0:_.docs)==null?void 0:E.source}}};const ce=["Playground","VariantGallery","SizeGallery","ToneGallery","ColorPaletteGallery","Vertical","Controlled"];export{v as ColorPaletteGallery,u as Controlled,g as Playground,h as SizeGallery,y as ToneGallery,p as VariantGallery,m as Vertical,ce as __namedExportsOrder,de as default};
