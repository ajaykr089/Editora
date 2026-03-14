import{a as t,j as i,F as h,B as b}from"./index-c1b18327.js";import{r as c}from"./index-93f6b7ae.js";import{B as G,C as J,c as X,L as ee,S as te,T as ne}from"./index-76e7d200.js";/* empty css                          */import{S as re}from"./SearchExtension-5db95884.js";import{R as ae}from"./ReadOnlyExtension-88fcf3b5.js";const he={title:"UI Components/Light Code Editor",parameters:{layout:"fullscreen",docs:{description:{component:`
# Light Code Editor - Lightweight Code Editor Library

**Bundle Size**: ~38 KB ES module (8.7 KB gzipped)  
**Features**: Syntax highlighting, themes, search, folding, extensions  
**Zero Dependencies**: Framework agnostic, works everywhere  

## Features
- ✅ Self-contained library (CSS included)
- ✅ Modular extension system
- ✅ HTML syntax highlighting
- ✅ Light and dark themes
- ✅ Line numbers gutter
- ✅ Search and replace
- ✅ Bracket matching
- ✅ Code folding
- ✅ Read-only mode
- ✅ TypeScript support
- ✅ Zero runtime dependencies
        `}}},argTypes:{theme:{control:{type:"select"},options:["light","dark"],description:"Editor theme"},showLineNumbers:{control:{type:"boolean"},description:"Show line numbers"},syntaxHighlighting:{control:{type:"boolean"},description:"Enable syntax highlighting"},readOnly:{control:{type:"boolean"},description:"Read-only mode"},enableSearch:{control:{type:"boolean"},description:"Enable search functionality"},bracketMatching:{control:{type:"boolean"},description:"Enable bracket matching"},codeFolding:{control:{type:"boolean"},description:"Enable code folding"}}},E=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Document</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      background-color: #f5f5f5;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    h1 {
      color: #333;
      text-align: center;
    }

    .highlight {
      background-color: #fff3cd;
      padding: 10px;
      border-left: 4px solid #ffc107;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to Our Website</h1>

    <p>This is a sample HTML document demonstrating various elements and styling.</p>

    <div class="highlight">
      <strong>Note:</strong> This content is highlighted for emphasis.
    </div>

    <ul>
      <li>First item</li>
      <li>Second item with <a href="#">a link</a></li>
      <li>Third item</li>
    </ul>

    <button onclick="alert('Hello!')">Click me</button>

    <!-- This is a comment -->
    <p>End of document.</p>
  </div>

  <script>
    console.log("Page loaded successfully!");
  <\/script>
</body>
</html>`,s=({theme:e="dark",showLineNumbers:u=!0,syntaxHighlighting:g=!0,readOnly:l=!1,enableSearch:d=!0,bracketMatching:r=!0,codeFolding:w=!0})=>{const C=c.useRef(null),a=c.useRef(null),[L,F]=c.useState(E),[p,K]=c.useState(""),[v,Q]=c.useState(!1);c.useEffect(()=>{var o,M;if(!C.current)return;a.current&&((M=(o=a.current).destroy)==null||M.call(o));const n=[];return u&&n.push(new ee),g&&n.push(new te),n.push(new ne),l&&n.push(new ae),d&&n.push(new re),r&&n.push(new G),w&&n.push(new J),a.current=X(C.current,{value:L,theme:e,readOnly:l,extensions:n}),a.current.on("change",()=>{const m=a.current.getValue();F(m)}),()=>{var m,T;a.current&&((T=(m=a.current).destroy)==null||T.call(m))}},[e,u,g,l,d,r,w]);const Y=()=>{if(a.current&&p){const n=a.current.search(p);console.log("Search results:",n)}},Z=()=>{if(a.current&&p){const n=prompt("Replace with:");if(n!==null){const o=a.current.replaceAll(p,n);alert(`Replaced ${o} occurrences`)}}},_=()=>{Q(!v)},q=n=>{let o="";switch(n){case"html":o=E;break;case"minimal":o=`<!DOCTYPE html>
<html>
<head><title>Minimal</title></head>
<body>
  <h1>Hello World</h1>
  <p>This is a minimal HTML document.</p>
</body>
</html>`;break;case"complex":o=`<div class="wrapper">
  <header>
    <nav>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="home">
      <h1>Welcome</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <button class="btn-primary">Get Started</button>
    </section>

    <section id="about">
      <h2>About Us</h2>
      <div class="grid">
        <div class="card">
          <h3>Feature 1</h3>
          <p>Description of feature 1.</p>
        </div>
        <div class="card">
          <h3>Feature 2</h3>
          <p>Description of feature 2.</p>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <p>&copy; 2024 Company Name. All rights reserved.</p>
  </footer>
</div>`;break;case"broken":o=`<html>
<head>
  <title>Broken HTML</title>
<body>
  <h1>Unclosed heading
  <p>Missing closing tags
  <div class="broken">
    <span>Nested content
    <img src="image.jpg" alt="Missing quote>
  </div>
  <p>More content
</body>
</html>`;break}F(o),a.current&&a.current.setValue(o)};return i(h,{style:{padding:"20px",height:"100vh",display:"flex",flexDirection:"column",backgroundColor:e==="dark"?"#1e1e1e":"#f5f5f5",color:e==="dark"?"#f8f9fa":"#333"},children:[i(h,{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",padding:"10px 0",borderBottom:`1px solid ${e==="dark"?"#404040":"#ddd"}`},children:[i("div",{children:[t("h1",{style:{margin:0,fontSize:"24px"},children:"Light Code Editor Demo"}),t("p",{style:{margin:"5px 0 0 0",opacity:.7},children:"Full-featured code editor with extensions"})]}),t("button",{onClick:_,style:{padding:"8px 16px",backgroundColor:e==="dark"?"#007acc":"#007bff",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"},children:v?"Exit Fullscreen":"Fullscreen"})]}),i(h,{style:{display:"flex",gap:"20px",marginBottom:"20px",flexWrap:"wrap",alignItems:"center"},children:[i("div",{children:[t("label",{style:{marginRight:"10px",fontWeight:"bold"},children:"Load Sample:"}),i("select",{onChange:n=>q(n.target.value),style:{padding:"5px 10px",backgroundColor:e==="dark"?"#2d2d2d":"white",color:e==="dark"?"#f8f9fa":"#333",border:`1px solid ${e==="dark"?"#404040":"#ddd"}`,borderRadius:"4px"},children:[t("option",{value:"html",children:"Full HTML"}),t("option",{value:"minimal",children:"Minimal"}),t("option",{value:"complex",children:"Complex Layout"}),t("option",{value:"broken",children:"Broken HTML"})]})]}),d&&i(h,{style:{display:"flex",gap:"10px",alignItems:"center"},children:[t("input",{type:"text",placeholder:"Search...",value:p,onChange:n=>K(n.target.value),style:{padding:"5px 10px",backgroundColor:e==="dark"?"#2d2d2d":"white",color:e==="dark"?"#f8f9fa":"#333",border:`1px solid ${e==="dark"?"#404040":"#ddd"}`,borderRadius:"4px",width:"150px"}}),t("button",{onClick:Y,style:{padding:"5px 10px",backgroundColor:"#28a745",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"},children:"Search"}),t("button",{onClick:Z,style:{padding:"5px 10px",backgroundColor:"#ffc107",color:"#333",border:"none",borderRadius:"4px",cursor:"pointer"},children:"Replace All"})]}),i(b,{style:{marginLeft:"auto",fontSize:"14px",opacity:.7},children:[L.split(`
`).length," lines, ",L.length," characters"]})]}),t(b,{ref:C,style:{flex:1,border:`1px solid ${e==="dark"?"#404040":"#ddd"}`,borderRadius:"8px",overflow:"hidden",backgroundColor:e==="dark"?"#1e1e1e":"white",minHeight:v?"calc(100vh - 140px)":"500px"}}),t(b,{style:{marginTop:"20px",padding:"10px 0",borderTop:`1px solid ${e==="dark"?"#404040":"#ddd"}`,fontSize:"14px",opacity:.7},children:i(h,{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[i("div",{children:["Active Extensions: ",[u&&"Line Numbers",g&&"Syntax Highlighting",l&&"Read Only",d&&"Search",r&&"Bracket Matching",w&&"Code Folding"].filter(Boolean).join(", ")||"None"]}),i("div",{children:["Theme: ",e," | Mode: ",l?"Read-Only":"Editable"]})]})})]})},f={render:e=>t(s,{...e}),args:{theme:"dark",showLineNumbers:!0,syntaxHighlighting:!0,readOnly:!1,enableSearch:!0,bracketMatching:!0,codeFolding:!0}},x={render:e=>t(s,{...e}),args:{theme:"light",showLineNumbers:!1,syntaxHighlighting:!1,readOnly:!1,enableSearch:!1,bracketMatching:!1,codeFolding:!1}},y={render:e=>t(s,{...e}),args:{theme:"dark",showLineNumbers:!0,syntaxHighlighting:!0,readOnly:!0,enableSearch:!0,bracketMatching:!0,codeFolding:!0}},k={render:e=>t(s,{...e}),args:{theme:"light",showLineNumbers:!0,syntaxHighlighting:!0,readOnly:!1,enableSearch:!0,bracketMatching:!0,codeFolding:!0}},S={render:()=>{var d;const[e,u]=c.useState("syntax"),g=[{id:"syntax",label:"Syntax Highlighting",description:"HTML syntax highlighting with VS Code-style colors"},{id:"search",label:"Search & Replace",description:"Find and replace functionality across the document"},{id:"folding",label:"Code Folding",description:"Collapse and expand code sections"},{id:"brackets",label:"Bracket Matching",description:"Automatic bracket pair highlighting"},{id:"themes",label:"Themes",description:"Light and dark theme support"},{id:"readonly",label:"Read-Only Mode",description:"Prevent text modifications"}],l=()=>{switch(e){case"syntax":return t(s,{theme:"dark",showLineNumbers:!0,syntaxHighlighting:!0,enableSearch:!1,bracketMatching:!1,codeFolding:!1});case"search":return t(s,{theme:"dark",showLineNumbers:!0,syntaxHighlighting:!0,enableSearch:!0,bracketMatching:!1,codeFolding:!1});case"folding":return t(s,{theme:"dark",showLineNumbers:!0,syntaxHighlighting:!0,enableSearch:!1,bracketMatching:!1,codeFolding:!0});case"brackets":return t(s,{theme:"dark",showLineNumbers:!0,syntaxHighlighting:!0,enableSearch:!1,bracketMatching:!0,codeFolding:!1});case"themes":return t(s,{theme:"light",showLineNumbers:!0,syntaxHighlighting:!0,enableSearch:!1,bracketMatching:!1,codeFolding:!1});case"readonly":return t(s,{theme:"dark",showLineNumbers:!0,syntaxHighlighting:!0,readOnly:!0,enableSearch:!0,bracketMatching:!0,codeFolding:!0});default:return t(s,{theme:"dark",showLineNumbers:!0,syntaxHighlighting:!0,enableSearch:!0,bracketMatching:!0,codeFolding:!0})}};return i(h,{style:{height:"100vh",display:"flex",flexDirection:"column"},children:[t(h,{style:{display:"flex",borderBottom:"1px solid #ddd",backgroundColor:"#f8f9fa",padding:"0 20px"},children:g.map(r=>t("button",{onClick:()=>u(r.id),style:{padding:"15px 20px",border:"none",backgroundColor:e===r.id?"white":"transparent",borderBottom:e===r.id?"2px solid #007acc":"2px solid transparent",cursor:"pointer",fontWeight:e===r.id?"bold":"normal",color:e===r.id?"#007acc":"#666"},children:r.label},r.id))}),t(b,{style:{padding:"10px 20px",backgroundColor:"#f8f9fa",borderBottom:"1px solid #ddd",fontSize:"14px",color:"#666"},children:(d=g.find(r=>r.id===e))==null?void 0:d.description}),t(b,{style:{flex:1,overflow:"hidden"},children:l()})]})}};var H,B,N;f.parameters={...f.parameters,docs:{...(H=f.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: args => <LightCodeEditorDemo {...args} />,
  args: {
    theme: "dark",
    showLineNumbers: true,
    syntaxHighlighting: true,
    readOnly: false,
    enableSearch: true,
    bracketMatching: true,
    codeFolding: true
  }
}`,...(N=(B=f.parameters)==null?void 0:B.docs)==null?void 0:N.source}}};var R,D,O;x.parameters={...x.parameters,docs:{...(R=x.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: args => <LightCodeEditorDemo {...args} />,
  args: {
    theme: "light",
    showLineNumbers: false,
    syntaxHighlighting: false,
    readOnly: false,
    enableSearch: false,
    bracketMatching: false,
    codeFolding: false
  }
}`,...(O=(D=x.parameters)==null?void 0:D.docs)==null?void 0:O.source}}};var A,W,j;y.parameters={...y.parameters,docs:{...(A=y.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: args => <LightCodeEditorDemo {...args} />,
  args: {
    theme: "dark",
    showLineNumbers: true,
    syntaxHighlighting: true,
    readOnly: true,
    enableSearch: true,
    bracketMatching: true,
    codeFolding: true
  }
}`,...(j=(W=y.parameters)==null?void 0:W.docs)==null?void 0:j.source}}};var z,I,$;k.parameters={...k.parameters,docs:{...(z=k.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: args => <LightCodeEditorDemo {...args} />,
  args: {
    theme: "light",
    showLineNumbers: true,
    syntaxHighlighting: true,
    readOnly: false,
    enableSearch: true,
    bracketMatching: true,
    codeFolding: true
  }
}`,...($=(I=k.parameters)==null?void 0:I.docs)==null?void 0:$.source}}};var P,U,V;S.parameters={...S.parameters,docs:{...(P=S.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => {
    const [activeTab, setActiveTab] = useState("syntax");
    const tabs = [{
      id: "syntax",
      label: "Syntax Highlighting",
      description: "HTML syntax highlighting with VS Code-style colors"
    }, {
      id: "search",
      label: "Search & Replace",
      description: "Find and replace functionality across the document"
    }, {
      id: "folding",
      label: "Code Folding",
      description: "Collapse and expand code sections"
    }, {
      id: "brackets",
      label: "Bracket Matching",
      description: "Automatic bracket pair highlighting"
    }, {
      id: "themes",
      label: "Themes",
      description: "Light and dark theme support"
    }, {
      id: "readonly",
      label: "Read-Only Mode",
      description: "Prevent text modifications"
    }];
    const getTabContent = () => {
      switch (activeTab) {
        case "syntax":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={false} codeFolding={false} />;
        case "search":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={true} bracketMatching={false} codeFolding={false} />;
        case "folding":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={false} codeFolding={true} />;
        case "brackets":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={true} codeFolding={false} />;
        case "themes":
          return <LightCodeEditorDemo theme="light" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={false} codeFolding={false} />;
        case "readonly":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} readOnly={true} enableSearch={true} bracketMatching={true} codeFolding={true} />;
        default:
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={true} bracketMatching={true} codeFolding={true} />;
      }
    };
    return <Flex style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>
        {/* Tab Navigation */}
        <Flex style={{
        display: "flex",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#f8f9fa",
        padding: "0 20px"
      }}>
          {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
          padding: "15px 20px",
          border: "none",
          backgroundColor: activeTab === tab.id ? "white" : "transparent",
          borderBottom: activeTab === tab.id ? "2px solid #007acc" : "2px solid transparent",
          cursor: "pointer",
          fontWeight: activeTab === tab.id ? "bold" : "normal",
          color: activeTab === tab.id ? "#007acc" : "#666"
        }}>
              {tab.label}
            </button>)}
        </Flex>

        {/* Tab Description */}
        <Box style={{
        padding: "10px 20px",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #ddd",
        fontSize: "14px",
        color: "#666"
      }}>
          {tabs.find(tab => tab.id === activeTab)?.description}
        </Box>

        {/* Tab Content */}
        <Box style={{
        flex: 1,
        overflow: "hidden"
      }}>
          {getTabContent()}
        </Box>
      </Flex>;
  }
}`,...(V=(U=S.parameters)==null?void 0:U.docs)==null?void 0:V.source}}};const ge=["Basic","Minimal","ReadOnly","LightTheme","FeatureShowcase"];export{f as Basic,S as FeatureShowcase,k as LightTheme,x as Minimal,y as ReadOnly,ge as __namedExportsOrder,he as default};
