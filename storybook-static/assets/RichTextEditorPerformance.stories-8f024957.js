import{j as r,B as m,a as n}from"./index-ce0e40fa.js";import{R as d}from"./RichTextEditor-2dfe365c.js";import"./index-93f6b7ae.js";/* empty css                *//* empty css             */import{a as p}from"./richTextEditor.shared-1995808a.js";import"./index-c197feae.js";import"./HeadingPlugin.native-b74ae03d.js";import"./A11yCheckerPlugin.native-b89c1fcd.js";import"./TextAlignmentPlugin.native-8d0de10f.js";import"./index-76e7d200.js";import"./SearchExtension-5db95884.js";import"./ReadOnlyExtension-88fcf3b5.js";import"./ApprovalWorkflowPlugin.native-eaed16b3.js";import"./ContentRulesPlugin.native-706a3efc.js";import"./PIIRedactionPlugin.native-6cafc2ca.js";import"./iframe-c526a5dc.js";import"../sb-preview/runtime.js";const C={title:"Editor/Rich Text Editor - Web Component/Performance",component:d,parameters:{layout:"padded",docs:{source:{type:"code"},description:{component:"The large-document stress case is isolated here so it does not slow down the main Rich Text Editor docs page."}}}};function c(){let t="<h1>Large Document Performance Test</h1>";t+="<p><strong>This document contains 100 sections to stress test editor rendering and navigation.</strong></p>";for(let e=1;e<=100;e+=1)t+=`<h3>Section ${e}</h3>`,t+=`<p>This is paragraph ${e}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`,e%10===0&&(t+=`<blockquote>Milestone: Completed ${e} sections.</blockquote>`);return t}const o={render:()=>r("div",{children:[r(m,{style:{marginBottom:"20px",padding:"15px",background:"#ffebee",borderRadius:"4px"},children:[n("h4",{style:{margin:"0 0 10px 0"},children:"Performance Test"}),n("p",{style:{margin:0,fontSize:"14px"},children:"This story is intentionally isolated because it mounts a large document and is meant for performance validation, not for the default docs page."})]}),n(d,{plugins:p,statusbar:{enabled:!0},defaultValue:c()})]})};var i,a,s;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <div>
      <Box style={{
      marginBottom: '20px',
      padding: '15px',
      background: '#ffebee',
      borderRadius: '4px'
    }}>
        <h4 style={{
        margin: '0 0 10px 0'
      }}>Performance Test</h4>
        <p style={{
        margin: 0,
        fontSize: '14px'
      }}>
          This story is intentionally isolated because it mounts a large document and is meant for performance validation, not for the default docs page.
        </p>
      </Box>

      <EditoraEditor plugins={allNativePlugins} statusbar={{
      enabled: true
    }} defaultValue={generateLargeContent()} />
    </div>
}`,...(s=(a=o.parameters)==null?void 0:a.docs)==null?void 0:s.source}}};const j=["LargeDocument"];export{o as LargeDocument,j as __namedExportsOrder,C as default};
