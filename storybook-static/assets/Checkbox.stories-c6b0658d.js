import{I as r,a as e,B as c,j as o,F as t}from"./index-c1b18327.js";import{R as ke}from"./index-93f6b7ae.js";const Be={title:"UI/Checkbox",component:r},s={border:"1px solid #e2e8f0",borderRadius:14,padding:14,background:"linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)"},l=()=>e(c,{style:s,children:e(r,{children:"Enable smart formatting"})}),d=()=>e(c,{style:s,children:e(r,{checked:!0,children:"Checked"})}),i=()=>e(c,{style:s,children:e(r,{disabled:!0,children:"Disabled"})}),h=()=>e(c,{style:s,children:e(r,{indeterminate:!0,children:"Indeterminate"})}),p=()=>e(c,{style:s,children:e(r,{children:"Accept terms and conditions"})}),x=()=>{const[a,B]=ke.useState(!1);return e(c,{style:s,children:o(t,{style:{display:"flex",flexDirection:"column",gap:8},children:[o(r,{checked:a,onCheckedChange:n=>B(n),children:["Controlled (",a?"On":"Off",")"]}),o(c,{style:{fontSize:12,color:"#64748b"},children:["Value: ",String(a)]})]})})},m=()=>e(c,{style:s,children:e(r,{style:{"--ui-checkbox-size":"32px"},children:"Large Checkbox"})}),u=()=>e(c,{style:s,children:e(r,{style:{"--ui-checkbox-checked-background":"#22c55e","--ui-checkbox-border":"2px solid #22c55e"},checked:!0,children:"Success"})}),k=()=>e(c,{style:s,children:e(r,{style:{"--ui-checkbox-checked-background":"#ef4444","--ui-checkbox-border":"2px solid #ef4444"},checked:!0,children:"Error"})}),b=()=>e(c,{style:s,children:e(r,{invalid:!0,children:"Validation error state"})}),y=()=>e(c,{style:s,children:o(t,{style:{display:"flex",flexDirection:"column",gap:8},children:[e(r,{preset:"admin",density:"compact",checked:!0,children:"Compact active"}),e(r,{preset:"admin",density:"compact",children:"Compact default"}),e(r,{preset:"admin",density:"compact",indeterminate:!0,children:"Compact mixed"}),e(r,{preset:"admin",density:"compact",disabled:!0,children:"Compact disabled"})]})}),C=()=>e(c,{style:s,children:e(r,{headless:!0,style:{padding:"6px 10px",border:"1px dashed #94a3b8",borderRadius:10},children:"Headless (unstyled)"})}),f=()=>{const[a,B]=ke.useState([!1,!0,!1]);return e(c,{style:s,children:e(t,{style:{display:"flex",gap:16,flexWrap:"wrap"},children:["One","Two","Three"].map((n,D)=>e(r,{checked:a[D],onCheckedChange:be=>B(ye=>ye.map((Ce,fe)=>fe===D?be:Ce)),children:n},n))})})},g=()=>e(c,{style:s,children:o(t,{style:{display:"flex",flexDirection:"column",gap:8},children:[e(r,{density:"compact",children:"Compact density"}),e(r,{children:"Default density"}),e(r,{density:"comfortable",children:"Comfortable density"})]})}),S=()=>e(c,{style:s,children:o(t,{style:{display:"flex",gap:16,flexWrap:"wrap"},children:[e(r,{loading:!0,children:"Loading"}),e(r,{loading:!0,checked:!0,children:"Loading checked"}),e(r,{loading:!0,indeterminate:!0,children:"Loading mixed"})]})});var v,F,L;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`() => <Box style={shellStyle}>
    <Checkbox>Enable smart formatting</Checkbox>
  </Box>`,...(L=(F=l.parameters)==null?void 0:F.docs)==null?void 0:L.source}}};var R,I,E;d.parameters={...d.parameters,docs:{...(R=d.parameters)==null?void 0:R.docs,source:{originalSource:`() => <Box style={shellStyle}>
    <Checkbox checked>Checked</Checkbox>
  </Box>`,...(E=(I=d.parameters)==null?void 0:I.docs)==null?void 0:E.source}}};var O,V,w;i.parameters={...i.parameters,docs:{...(O=i.parameters)==null?void 0:O.docs,source:{originalSource:`() => <Box style={shellStyle}>
    <Checkbox disabled>Disabled</Checkbox>
  </Box>`,...(w=(V=i.parameters)==null?void 0:V.docs)==null?void 0:w.source}}};var z,W,P;h.parameters={...h.parameters,docs:{...(z=h.parameters)==null?void 0:z.docs,source:{originalSource:`() => <Box style={shellStyle}>
    <Checkbox indeterminate>Indeterminate</Checkbox>
  </Box>`,...(P=(W=h.parameters)==null?void 0:W.docs)==null?void 0:P.source}}};var A,H,T;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`() => <Box style={shellStyle}>
    <Checkbox>Accept terms and conditions</Checkbox>
  </Box>`,...(T=(H=p.parameters)==null?void 0:H.docs)==null?void 0:T.source}}};var j,_,G;x.parameters={...x.parameters,docs:{...(j=x.parameters)==null?void 0:j.docs,source:{originalSource:`() => {
  const [checked, setChecked] = React.useState(false);
  return <Box style={shellStyle}>
      <Flex style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }}>
        <Checkbox checked={checked} onCheckedChange={next => setChecked(next)}>
          Controlled ({checked ? 'On' : 'Off'})
        </Checkbox>
        <Box style={{
        fontSize: 12,
        color: '#64748b'
      }}>Value: {String(checked)}</Box>
      </Flex>
    </Box>;
}`,...(G=(_=x.parameters)==null?void 0:_.docs)==null?void 0:G.source}}};var U,q,J;m.parameters={...m.parameters,docs:{...(U=m.parameters)==null?void 0:U.docs,source:{originalSource:`() => <Box style={shellStyle}>
    <Checkbox style={{
    '--ui-checkbox-size': '32px'
  } as React.CSSProperties}>Large Checkbox</Checkbox>
  </Box>`,...(J=(q=m.parameters)==null?void 0:q.docs)==null?void 0:J.source}}};var K,M,N;u.parameters={...u.parameters,docs:{...(K=u.parameters)==null?void 0:K.docs,source:{originalSource:`() => <Box style={shellStyle}>
    <Checkbox style={{
    '--ui-checkbox-checked-background': '#22c55e',
    '--ui-checkbox-border': '2px solid #22c55e'
  } as React.CSSProperties} checked>
      Success
    </Checkbox>
  </Box>`,...(N=(M=u.parameters)==null?void 0:M.docs)==null?void 0:N.source}}};var Q,X,Y;k.parameters={...k.parameters,docs:{...(Q=k.parameters)==null?void 0:Q.docs,source:{originalSource:`() => <Box style={shellStyle}>
    <Checkbox style={{
    '--ui-checkbox-checked-background': '#ef4444',
    '--ui-checkbox-border': '2px solid #ef4444'
  } as React.CSSProperties} checked>
      Error
    </Checkbox>
  </Box>`,...(Y=(X=k.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,$,ee;b.parameters={...b.parameters,docs:{...(Z=b.parameters)==null?void 0:Z.docs,source:{originalSource:`() => <Box style={shellStyle}>
    <Checkbox invalid>Validation error state</Checkbox>
  </Box>`,...(ee=($=b.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var re,ce,se;y.parameters={...y.parameters,docs:{...(re=y.parameters)==null?void 0:re.docs,source:{originalSource:`() => <Box style={shellStyle}>
    <Flex style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }}>
      <Checkbox preset="admin" density="compact" checked>
        Compact active
      </Checkbox>
      <Checkbox preset="admin" density="compact">
        Compact default
      </Checkbox>
      <Checkbox preset="admin" density="compact" indeterminate>
        Compact mixed
      </Checkbox>
      <Checkbox preset="admin" density="compact" disabled>
        Compact disabled
      </Checkbox>
    </Flex>
  </Box>`,...(se=(ce=y.parameters)==null?void 0:ce.docs)==null?void 0:se.source}}};var oe,ae,te;C.parameters={...C.parameters,docs:{...(oe=C.parameters)==null?void 0:oe.docs,source:{originalSource:`() => <Box style={shellStyle}>
    <Checkbox headless style={{
    padding: '6px 10px',
    border: '1px dashed #94a3b8',
    borderRadius: 10
  }}>
      Headless (unstyled)
    </Checkbox>
  </Box>`,...(te=(ae=C.parameters)==null?void 0:ae.docs)==null?void 0:te.source}}};var ne,le,de;f.parameters={...f.parameters,docs:{...(ne=f.parameters)==null?void 0:ne.docs,source:{originalSource:`() => {
  const [values, setValues] = React.useState([false, true, false]);
  return <Box style={shellStyle}>
      <Flex style={{
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap'
    }}>
        {['One', 'Two', 'Three'].map((label, i) => <Checkbox key={label} checked={values[i]} onCheckedChange={next => setValues(prev => prev.map((val, idx) => idx === i ? next : val))}>
            {label}
          </Checkbox>)}
      </Flex>
    </Box>;
}`,...(de=(le=f.parameters)==null?void 0:le.docs)==null?void 0:de.source}}};var ie,he,pe;g.parameters={...g.parameters,docs:{...(ie=g.parameters)==null?void 0:ie.docs,source:{originalSource:`() => <Box style={shellStyle}>
    <Flex style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }}>
      <Checkbox density="compact">Compact density</Checkbox>
      <Checkbox>Default density</Checkbox>
      <Checkbox density="comfortable">Comfortable density</Checkbox>
    </Flex>
  </Box>`,...(pe=(he=g.parameters)==null?void 0:he.docs)==null?void 0:pe.source}}};var xe,me,ue;S.parameters={...S.parameters,docs:{...(xe=S.parameters)==null?void 0:xe.docs,source:{originalSource:`() => <Box style={shellStyle}>
    <Flex style={{
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap'
  }}>
      <Checkbox loading>Loading</Checkbox>
      <Checkbox loading checked>
        Loading checked
      </Checkbox>
      <Checkbox loading indeterminate>
        Loading mixed
      </Checkbox>
    </Flex>
  </Box>`,...(ue=(me=S.parameters)==null?void 0:me.docs)==null?void 0:ue.source}}};const De=["Default","Checked","Disabled","Indeterminate","WithLabel","Controlled","CustomSize","CustomColor","ErrorState","Invalid","AdminCompactPreset","Headless","CheckboxGroup","DensityScale","Loading"];export{y as AdminCompactPreset,f as CheckboxGroup,d as Checked,x as Controlled,u as CustomColor,m as CustomSize,l as Default,g as DensityScale,i as Disabled,k as ErrorState,C as Headless,h as Indeterminate,b as Invalid,S as Loading,p as WithLabel,De as __namedExportsOrder,Be as default};
