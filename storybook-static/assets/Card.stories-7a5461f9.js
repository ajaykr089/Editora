import{M as t,j as n,N as o,a as e,O as a,P as r,a0 as f,a1 as Q,G as R,F as W,a2 as B}from"./index-ce0e40fa.js";import{S as d,a as l}from"./storybook-showcase-2b62d73c.js";import"./index-93f6b7ae.js";import"./index-c197feae.js";const O={title:"UI/Card",component:t,argTypes:{variant:{control:{type:"radio",options:["surface","outline","soft","solid","ghost","glass"]}},size:{control:{type:"radio",options:["sm","md","lg"]}},radius:{control:"text"},tone:{control:{type:"radio",options:["neutral","info","success","warning","danger"]}},elevation:{control:{type:"radio",options:["none","low","high"]}},interactive:{control:"boolean"},disabled:{control:"boolean"}}};function E(){return e("div",{style:{aspectRatio:"4 / 2.4",background:"linear-gradient(135deg, rgba(236,242,255,1) 0%, rgba(248,250,252,1) 38%, rgba(226,232,240,1) 100%)",borderBottom:"1px solid rgba(15, 23, 42, 0.08)",position:"relative",overflow:"hidden"},children:n("div",{style:{position:"absolute",inset:"14% 18%",transform:"rotate(-12deg)",background:"#ffffff",borderRadius:8,boxShadow:"0 22px 50px rgba(15, 23, 42, 0.12)",display:"grid",gridTemplateColumns:"1fr 1.1fr",padding:18,gap:14},children:[n("div",{style:{borderRight:"1px solid rgba(15, 23, 42, 0.08)",paddingRight:12},children:[e("div",{style:{fontSize:54,lineHeight:1,fontWeight:700,color:"#111827"},children:"A"}),e("div",{style:{marginTop:10,fontSize:10,lineHeight:"14px",color:"#64748b",textTransform:"uppercase",letterSpacing:"0.08em"},children:"Editorial layout"})]}),n("div",{style:{display:"grid",gap:10},children:[e("div",{style:{inlineSize:110,blockSize:34,background:"#1f2937",color:"#ffffff",display:"grid",placeItems:"center",fontWeight:700},children:"FACTURES"}),e("div",{style:{fontSize:11,lineHeight:"16px",color:"#475569"},children:"Typography is the art and technique of arranging type to make written language legible and expressive."})]})]})})}const c={args:{variant:"surface",size:"md",radius:"4",tone:"neutral",elevation:"low",interactive:!1,disabled:!1},render:i=>n(t,{...i,style:{maxInlineSize:360},children:[n(o,{children:[e(a,{children:"Project overview"}),e(r,{children:"Launch health and release readiness."})]}),e("div",{style:{fontSize:14,lineHeight:"20px",color:"#334155"},children:"Track migration progress, QA handoff, and final release blockers from one place."}),n(f,{style:{display:"flex",justifyContent:"space-between",fontSize:13,lineHeight:"18px",color:"#64748b"},children:[e("span",{children:"Updated 2m ago"}),e("span",{children:"12 items"})]})]})},p=()=>e(d,{eyebrow:"Composition",title:"With inset content",description:"Use the inset slot to align media flush with the card edges while keeping the reading content padded.",children:e(l,{title:"Inset media",description:"Full-bleed artwork and a readable text block can live in the same card without custom wrappers.",children:n(t,{variant:"surface",size:"lg",radius:8,style:{maxInlineSize:520},children:[e(Q,{children:e(E,{})}),n("div",{style:{display:"grid",gap:10},children:[e(a,{as:"div",children:"Typography is the art and technique of arranging type."}),e("div",{style:{fontSize:15,lineHeight:"24px",color:"#334155"},children:"Use inset sections when imagery, charts, or media should sit flush against the card frame while the rest of the content stays comfortably padded."})]})]})})}),h=()=>e(d,{eyebrow:"Visual language",title:"Variant",description:"Use the variant prop to control the visual style.",children:e(l,{title:"Card variants",description:"Choose a surface that matches the amount of visual weight the layout needs.",children:e(R,{style:{gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))"},children:[["surface","Quick start"],["outline","Documentation shell"],["soft","Status summary"],["solid","Priority insight"],["ghost","Canvas section"],["glass","Overlay surface"]].map(([i,s])=>n(t,{variant:i,size:"md",radius:8,style:{minBlockSize:132},children:[n(o,{children:[e("div",{style:{fontSize:14,lineHeight:"18px",color:"#64748b",textTransform:"uppercase",letterSpacing:"0.08em"},children:i}),e(a,{as:"div",children:s})]}),e(r,{as:"div",children:"Start building your next project in minutes."})]},i))})})}),u=()=>e(d,{eyebrow:"Scaling",title:"Size",description:"Use the size prop to control the padding rhythm of the card.",children:e(l,{title:"Size ramp",description:"Size now drives content rhythm too, including media height, title scale, description line height, and footer density.",children:e(W,{direction:"column",style:{gap:18,maxInlineSize:980},children:[["sm",40],["md",54],["lg",68]].map(([i,s])=>n(t,{size:i,variant:"surface",radius:8,style:{maxInlineSize:i==="lg"?760:i==="md"?610:520},children:[n("div",{style:{display:"flex",alignItems:"center",gap:16},children:[e("div",{style:{inlineSize:s,blockSize:s,borderRadius:999,display:"grid",placeItems:"center",background:"#e2e8f0",color:"#3358c5",fontSize:s*.45,lineHeight:1},children:"T"}),n("div",{style:{display:"grid",gap:"var(--ui-card-header-gap, 4px)"},children:[e(a,{as:"div",children:"Teodros Girmay"}),e(r,{as:"div",children:"Engineering"})]})]}),n(f,{style:{display:"flex",justifyContent:"space-between"},children:[n("span",{children:[String(i).toUpperCase()," density"]}),e("span",{children:"Footer follows size too"})]})]},i))})})}),g=()=>e(d,{eyebrow:"Composition",title:"Structured card composition",description:"Use the convenience subcomponents to write readable card markup while preserving the same slot contract underneath.",children:e(l,{title:"Semantic sections",description:"Header, media, inset, title, description, and footer helpers keep the structure clear for developers.",children:n(t,{variant:"soft",tone:"info",size:"lg",radius:12,style:{maxInlineSize:540},children:[e(B,{children:e("div",{style:{aspectRatio:"16 / 8",background:"linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 100%)",display:"grid",placeItems:"center",color:"#1d4ed8",fontSize:42,fontWeight:700},children:"Q3"})}),n(o,{children:[e(a,{children:"Quarterly planning workspace"}),e(r,{style:{color:"#475569"},children:"Centralize milestones, owner updates, and launch decisions for the quarter."})]}),e("div",{style:{color:"#334155",fontSize:14,lineHeight:"22px"},children:"Use the convenience exports when teams want a clear authoring model without remembering slot names for every section."}),n(f,{style:{display:"flex",justifyContent:"space-between",color:"#64748b",fontSize:13,lineHeight:"18px"},children:[e("span",{children:"6 active workstreams"}),e("span",{children:"Updated today"})]})]})})}),m=()=>e(d,{eyebrow:"Interaction",title:"Interactive card states",description:"Interactive cards now support keyboard focus, activation, and disabled semantics in addition to hover styling.",children:e(l,{title:"Focus and activation",description:"Use interactive cards for clickable summary surfaces. They receive button semantics and keyboard activation by default.",children:n(R,{style:{gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))"},children:[n(t,{interactive:!0,variant:"surface",elevation:"low",radius:12,onClick:()=>window.alert("Card activated"),style:{minBlockSize:152},children:[n(o,{children:[e(a,{children:"Interactive project summary"}),e(r,{children:"Press Enter or Space after focusing the card to activate it."})]}),e("div",{style:{color:"#334155",fontSize:14,lineHeight:"22px"},children:"This is the production interaction model for clickable cards."})]}),n(t,{interactive:!0,disabled:!0,variant:"outline",radius:12,style:{minBlockSize:152},children:[n(o,{children:[e(a,{children:"Disabled state"}),e(r,{children:"The disabled card is not focusable and exposes aria-disabled."})]}),e("div",{style:{color:"#64748b",fontSize:14,lineHeight:"22px"},children:"Use disabled when the whole card surface should be unavailable."})]})]})})});var y,v,S;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    variant: 'surface',
    size: 'md',
    radius: '4',
    tone: 'neutral',
    elevation: 'low',
    interactive: false,
    disabled: false
  },
  render: (args: Record<string, unknown>) => <Card {...args} style={{
    maxInlineSize: 360
  }}>
      <CardHeader>
        <CardTitle>Project overview</CardTitle>
        <CardDescription>
          Launch health and release readiness.
        </CardDescription>
      </CardHeader>
      <div style={{
      fontSize: 14,
      lineHeight: '20px',
      color: '#334155'
    }}>
        Track migration progress, QA handoff, and final release blockers from one place.
      </div>
      <CardFooter style={{
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13,
      lineHeight: '18px',
      color: '#64748b'
    }}>
        <span>Updated 2m ago</span>
        <span>12 items</span>
      </CardFooter>
    </Card>
}`,...(S=(v=c.parameters)==null?void 0:v.docs)==null?void 0:S.source}}};var b,C,w;p.parameters={...p.parameters,docs:{...(b=p.parameters)==null?void 0:b.docs,source:{originalSource:`() => <ShowcasePage eyebrow="Composition" title="With inset content" description="Use the inset slot to align media flush with the card edges while keeping the reading content padded.">
    <ShowcaseSection title="Inset media" description="Full-bleed artwork and a readable text block can live in the same card without custom wrappers.">
      <Card variant="surface" size="lg" radius={8} style={{
      maxInlineSize: 520
    }}>
        <CardInset>
          <InsetArtwork />
        </CardInset>
        <div style={{
        display: 'grid',
        gap: 10
      }}>
          <CardTitle as="div">
            Typography is the art and technique of arranging type.
          </CardTitle>
          <div style={{
          fontSize: 15,
          lineHeight: '24px',
          color: '#334155'
        }}>
            Use inset sections when imagery, charts, or media should sit flush against the card frame while the rest of the content stays comfortably padded.
          </div>
        </div>
      </Card>
    </ShowcaseSection>
  </ShowcasePage>`,...(w=(C=p.parameters)==null?void 0:C.docs)==null?void 0:w.source}}};var x,z,k;h.parameters={...h.parameters,docs:{...(x=h.parameters)==null?void 0:x.docs,source:{originalSource:`() => <ShowcasePage eyebrow="Visual language" title="Variant" description="Use the variant prop to control the visual style.">
    <ShowcaseSection title="Card variants" description="Choose a surface that matches the amount of visual weight the layout needs.">
      <Grid style={{
      gap: 16,
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
    }}>
        {[['surface', 'Quick start'], ['outline', 'Documentation shell'], ['soft', 'Status summary'], ['solid', 'Priority insight'], ['ghost', 'Canvas section'], ['glass', 'Overlay surface']].map(([variant, title]) => <Card key={variant} variant={variant as any} size="md" radius={8} style={{
        minBlockSize: 132
      }}>
            <CardHeader>
              <div style={{
            fontSize: 14,
            lineHeight: '18px',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>{variant}</div>
              <CardTitle as="div">{title}</CardTitle>
            </CardHeader>
            <CardDescription as="div">
              Start building your next project in minutes.
            </CardDescription>
          </Card>)}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>`,...(k=(z=h.parameters)==null?void 0:z.docs)==null?void 0:k.source}}};var T,I,H;u.parameters={...u.parameters,docs:{...(T=u.parameters)==null?void 0:T.docs,source:{originalSource:`() => <ShowcasePage eyebrow="Scaling" title="Size" description="Use the size prop to control the padding rhythm of the card.">
    <ShowcaseSection title="Size ramp" description="Size now drives content rhythm too, including media height, title scale, description line height, and footer density.">
      <Flex direction="column" style={{
      gap: 18,
      maxInlineSize: 980
    }}>
        {[['sm', 40], ['md', 54], ['lg', 68]].map(([size, avatar]) => <Card key={size} size={size as any} variant="surface" radius={8} style={{
        maxInlineSize: size === 'lg' ? 760 : size === 'md' ? 610 : 520
      }}>
            <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
              <div style={{
            inlineSize: avatar as number,
            blockSize: avatar as number,
            borderRadius: 999,
            display: 'grid',
            placeItems: 'center',
            background: '#e2e8f0',
            color: '#3358c5',
            fontSize: (avatar as number) * 0.45,
            lineHeight: 1
          }}>
                T
              </div>
              <div style={{
            display: 'grid',
            gap: 'var(--ui-card-header-gap, 4px)'
          }}>
                <CardTitle as="div">Teodros Girmay</CardTitle>
                <CardDescription as="div">Engineering</CardDescription>
              </div>
            </div>
            <CardFooter style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
              <span>{String(size).toUpperCase()} density</span>
              <span>Footer follows size too</span>
            </CardFooter>
          </Card>)}
      </Flex>
    </ShowcaseSection>
  </ShowcasePage>`,...(H=(I=u.parameters)==null?void 0:I.docs)==null?void 0:H.source}}};var U,P,F;g.parameters={...g.parameters,docs:{...(U=g.parameters)==null?void 0:U.docs,source:{originalSource:`() => <ShowcasePage eyebrow="Composition" title="Structured card composition" description="Use the convenience subcomponents to write readable card markup while preserving the same slot contract underneath.">
    <ShowcaseSection title="Semantic sections" description="Header, media, inset, title, description, and footer helpers keep the structure clear for developers.">
        <Card variant="soft" tone="info" size="lg" radius={12} style={{
      maxInlineSize: 540
    }}>
          <CardMedia>
            <div style={{
          aspectRatio: '16 / 8',
          background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 100%)',
          display: 'grid',
          placeItems: 'center',
          color: '#1d4ed8',
          fontSize: 42,
          fontWeight: 700
        }}>
            Q3
          </div>
        </CardMedia>
        <CardHeader>
          <CardTitle>Quarterly planning workspace</CardTitle>
          <CardDescription style={{
          color: '#475569'
        }}>
            Centralize milestones, owner updates, and launch decisions for the quarter.
          </CardDescription>
        </CardHeader>
        <div style={{
        color: '#334155',
        fontSize: 14,
        lineHeight: '22px'
      }}>
          Use the convenience exports when teams want a clear authoring model without remembering slot names for every section.
        </div>
        <CardFooter style={{
        display: 'flex',
        justifyContent: 'space-between',
        color: '#64748b',
        fontSize: 13,
        lineHeight: '18px'
      }}>
          <span>6 active workstreams</span>
          <span>Updated today</span>
        </CardFooter>
      </Card>
    </ShowcaseSection>
  </ShowcasePage>`,...(F=(P=g.parameters)==null?void 0:P.docs)==null?void 0:F.source}}};var D,j,G;m.parameters={...m.parameters,docs:{...(D=m.parameters)==null?void 0:D.docs,source:{originalSource:`() => <ShowcasePage eyebrow="Interaction" title="Interactive card states" description="Interactive cards now support keyboard focus, activation, and disabled semantics in addition to hover styling.">
    <ShowcaseSection title="Focus and activation" description="Use interactive cards for clickable summary surfaces. They receive button semantics and keyboard activation by default.">
      <Grid style={{
      gap: 16,
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
    }}>
        <Card interactive variant="surface" elevation="low" radius={12} onClick={() => window.alert('Card activated')} style={{
        minBlockSize: 152
      }}>
          <CardHeader>
            <CardTitle>Interactive project summary</CardTitle>
            <CardDescription>Press Enter or Space after focusing the card to activate it.</CardDescription>
          </CardHeader>
          <div style={{
          color: '#334155',
          fontSize: 14,
          lineHeight: '22px'
        }}>
            This is the production interaction model for clickable cards.
          </div>
        </Card>

        <Card interactive disabled variant="outline" radius={12} style={{
        minBlockSize: 152
      }}>
          <CardHeader>
            <CardTitle>Disabled state</CardTitle>
            <CardDescription>The disabled card is not focusable and exposes aria-disabled.</CardDescription>
          </CardHeader>
          <div style={{
          color: '#64748b',
          fontSize: 14,
          lineHeight: '22px'
        }}>
            Use disabled when the whole card surface should be unavailable.
          </div>
        </Card>
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>`,...(G=(j=m.parameters)==null?void 0:j.docs)==null?void 0:G.source}}};const L=["Playground","WithInsetContent","VariantGallery","SizeGallery","StructuredComposition","InteractiveStates"];export{m as InteractiveStates,c as Playground,u as SizeGallery,g as StructuredComposition,h as VariantGallery,p as WithInsetContent,L as __namedExportsOrder,O as default};
