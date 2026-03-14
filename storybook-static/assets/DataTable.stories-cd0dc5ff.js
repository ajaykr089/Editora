import{m as h,j as t,G as p,B as a,F as v,a as e,l as y,b as x,ab as q,ac as L,o as N,n as J,h as ke,E as we}from"./index-ce0e40fa.js";import{R as d}from"./index-93f6b7ae.js";import"./index-c197feae.js";const Ae={title:"UI/DataTable",component:h,argTypes:{pageSize:{control:{type:"number",min:3,max:20,step:1}},shape:{control:{type:"radio",options:["default","square","soft"]}},variant:{control:{type:"radio",options:["default","flat","contrast"]}},elevation:{control:{type:"radio",options:["default","none","low","high"]}},striped:{control:"boolean"},hover:{control:"boolean"},stickyHeader:{control:"boolean"},stickyFooter:{control:"boolean"}}},z={display:"grid",gap:"var(--ui-space-lg, 16px)",maxWidth:1040},m={border:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent)",borderRadius:"calc(var(--ui-radius, 12px) + 4px)",background:"linear-gradient(180deg, color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent), color-mix(in srgb, var(--ui-color-surface-alt, #f8fafc) 86%, transparent))",boxShadow:"var(--ui-shadow-sm, 0 10px 24px rgba(15, 23, 42, 0.08))",padding:"var(--ui-space-lg, 16px)"},C={margin:0,fontSize:"var(--ui-font-size-xl, 20px)",lineHeight:1.3,color:"var(--ui-color-text, #0f172a)",letterSpacing:"-0.01em"},g={margin:"var(--ui-space-xs, 4px) 0 0",fontSize:"var(--ui-font-size-md, 14px)",lineHeight:1.45,color:"var(--ui-color-muted, #64748b)"},ze={display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))",gap:"var(--ui-space-sm, 8px)"},H={border:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)",borderRadius:"var(--ui-radius, 12px)",background:"color-mix(in srgb, var(--ui-color-surface, #ffffff) 95%, transparent)",padding:"var(--ui-space-sm, 8px) var(--ui-space-md, 12px)"},V={fontSize:"var(--ui-font-size-sm, 12px)",color:"var(--ui-color-muted, #64748b)",textTransform:"uppercase",letterSpacing:"0.06em"},$={marginTop:"var(--ui-space-xs, 4px)",fontSize:"var(--ui-font-size-xl, 20px)",color:"var(--ui-color-text, #0f172a)",fontWeight:700,lineHeight:1.2},j={display:"flex",gap:"var(--ui-space-sm, 8px)",flexWrap:"wrap",alignItems:"center"},k=[{name:"Ava Johnson",email:"ava@acme.com",role:"Admin",status:"Active",signups:12},{name:"Liam Carter",email:"liam@acme.com",role:"Manager",status:"Invited",signups:3},{name:"Mia Chen",email:"mia@acme.com",role:"Editor",status:"Active",signups:8},{name:"Noah Patel",email:"noah@acme.com",role:"Editor",status:"Suspended",signups:1},{name:"Emma Garcia",email:"emma@acme.com",role:"Analyst",status:"Active",signups:9},{name:"Lucas Brown",email:"lucas@acme.com",role:"Manager",status:"Active",signups:14},{name:"Sophia Miller",email:"sophia@acme.com",role:"Admin",status:"Invited",signups:2},{name:"Ethan Wilson",email:"ethan@acme.com",role:"Editor",status:"Active",signups:6},{name:"Olivia Moore",email:"olivia@acme.com",role:"Analyst",status:"Active",signups:11},{name:"James Taylor",email:"james@acme.com",role:"Editor",status:"Suspended",signups:4},{name:"Charlotte Davis",email:"charlotte@acme.com",role:"Admin",status:"Active",signups:16},{name:"Benjamin Lee",email:"benjamin@acme.com",role:"Manager",status:"Active",signups:10}],S=[{id:"ORD-1048",customer:"Northstar LLC",total:"$5,420",status:"Paid",placed:"2026-02-19"},{id:"ORD-1047",customer:"Urban Grid",total:"$1,280",status:"Pending",placed:"2026-02-19"},{id:"ORD-1046",customer:"Summit Lab",total:"$2,730",status:"Paid",placed:"2026-02-18"},{id:"ORD-1045",customer:"Cloudline",total:"$940",status:"Refunded",placed:"2026-02-18"},{id:"ORD-1044",customer:"Pixel Grove",total:"$3,105",status:"Pending",placed:"2026-02-17"},{id:"ORD-1043",customer:"Blue Harbor",total:"$620",status:"Paid",placed:"2026-02-16"},{id:"ORD-1042",customer:"Nimble Ops",total:"$4,420",status:"Failed",placed:"2026-02-15"},{id:"ORD-1041",customer:"Atlas Media",total:"$2,040",status:"Paid",placed:"2026-02-15"}],_=Array.from({length:1200},(n,u)=>{const l=u+1;return{id:`USR-${String(l).padStart(4,"0")}`,name:`User ${l}`,email:`user${l}@acme.com`,team:["Design","Engineering","Product","Ops"][u%4],active:u%7!==0?"Active":"Idle"}});function w(n){return n==="Active"||n==="Paid"?"success":n==="Pending"||n==="Invited"?"warning":n==="Suspended"||n==="Failed"||n==="Refunded"?"danger":"info"}const R=n=>{const[u,l]=d.useState(1),[i,o]=d.useState([]),b=d.useMemo(()=>k.reduce((c,f)=>c+f.signups,0),[]);return t(p,{style:z,children:[t(a,{style:m,children:[t(v,{style:{display:"flex",justifyContent:"space-between",gap:"var(--ui-space-md, 12px)",flexWrap:"wrap"},children:[t("div",{children:[e("h3",{style:C,children:"Workforce Access Directory"}),e("p",{style:g,children:"Operational user inventory with multi-select workflows and in-row actions."})]}),e(y,{tone:"brand",variant:"soft",children:"Directory"})]}),t(p,{style:{...ze,marginTop:"var(--ui-space-md, 12px)"},children:[t(a,{style:H,children:[e("div",{style:V,children:"Total Records"}),e("div",{style:$,children:k.length})]}),t(a,{style:H,children:[e("div",{style:V,children:"Selected"}),e("div",{style:$,children:i.length})]}),t(a,{style:H,children:[e("div",{style:V,children:"Current Page"}),e("div",{style:$,children:u})]})]})]}),e(h,{sortable:!0,selectable:!0,multiSelect:!0,shape:n.shape,variant:n.variant,elevation:n.elevation,striped:n.striped,hover:n.hover,stickyHeader:n.stickyHeader,stickyFooter:n.stickyFooter,page:u,pageSize:n.pageSize,paginationId:"users-pagination",onPageChange:c=>l(c.page),onRowSelect:c=>o(c.indices),children:t("table",{children:[e("caption",{children:"Click row actions to validate that controls do not toggle row selection."}),e("thead",{children:t("tr",{children:[e("th",{"data-key":"name",children:"Name"}),e("th",{"data-key":"email",children:"Email"}),e("th",{"data-key":"role",children:"Role"}),e("th",{"data-key":"status",children:"Status"}),e("th",{"data-key":"signups",children:"Signups"}),e("th",{"data-key":"actions",children:"Actions"})]})}),e("tbody",{children:k.map(c=>t("tr",{children:[e("td",{children:c.name}),e("td",{children:c.email}),e("td",{children:c.role}),e("td",{children:e(y,{tone:w(c.status),variant:"soft",size:"sm",children:c.status})}),e("td",{children:c.signups}),e("td",{children:e(x,{size:"sm",variant:"ghost",children:"View"})})]},c.email))}),e("tfoot",{children:t("tr",{children:[e("td",{colSpan:4,children:"Total signups"}),e("td",{children:b}),e("td",{children:i.length?`${i.length} selected`:""})]})})]})}),t(v,{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"var(--ui-space-sm, 8px)",flexWrap:"wrap"},children:[t(a,{style:{fontSize:"var(--ui-font-size-md, 14px)",color:"var(--ui-color-muted, #64748b)"},children:["Selected users: ",i.length?i.length:"none"]}),e(q,{id:"users-pagination",page:u})]})]})};R.args={pageSize:6,shape:"default",variant:"default",elevation:"default",striped:!0,hover:!0,stickyHeader:!1,stickyFooter:!1};const P=()=>t(p,{style:z,children:[t(a,{style:m,children:[e("h3",{style:C,children:"Shape + Surface Variants"}),e("p",{style:g,children:"Use square corners and flat surfaces for utility-heavy enterprise screens, or softer/elevated styles for dashboards."})]}),t(p,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:"var(--ui-space-md, 12px)"},children:[t(a,{style:m,children:[e("h4",{style:{margin:0,fontSize:"var(--ui-font-size-lg, 16px)",color:"var(--ui-color-text, #0f172a)"},children:"Default"}),e("p",{style:{...g,marginBottom:"var(--ui-space-sm, 8px)"},children:"Balanced rounded enterprise table"}),e(h,{sortable:!0,hover:!0,striped:!0,pageSize:4,children:t("table",{children:[e("thead",{children:t("tr",{children:[e("th",{"data-key":"id",children:"Order"}),e("th",{"data-key":"customer",children:"Customer"}),e("th",{"data-key":"status",children:"Status"})]})}),e("tbody",{children:S.slice(0,4).map(n=>t("tr",{children:[e("td",{children:n.id}),e("td",{children:n.customer}),e("td",{children:e(y,{tone:w(n.status),variant:"soft",size:"sm",children:n.status})})]},`default-${n.id}`))}),e("tfoot",{children:t("tr",{children:[e("td",{colSpan:2,children:"Visible rows"}),e("td",{children:S.slice(0,4).length})]})})]})})]}),t(a,{style:m,children:[e("h4",{style:{margin:0,fontSize:"var(--ui-font-size-lg, 16px)",color:"var(--ui-color-text, #0f172a)"},children:"Flat Square"}),e("p",{style:{...g,marginBottom:"var(--ui-space-sm, 8px)"},children:"Minimal shape for dense operations"}),e(h,{sortable:!0,hover:!0,striped:!0,stickyFooter:!0,shape:"square",variant:"flat",elevation:"none",pageSize:4,children:t("table",{children:[e("thead",{children:t("tr",{children:[e("th",{"data-key":"id",children:"Order"}),e("th",{"data-key":"customer",children:"Customer"}),e("th",{"data-key":"status",children:"Status"})]})}),e("tbody",{children:S.slice(0,4).map(n=>t("tr",{children:[e("td",{children:n.id}),e("td",{children:n.customer}),e("td",{children:e(y,{tone:w(n.status),variant:"soft",size:"sm",children:n.status})})]},`flat-${n.id}`))}),e("tfoot",{children:t("tr",{children:[e("td",{colSpan:2,children:"Flat footer"}),e("td",{children:"Sticky"})]})})]})})]}),t(a,{style:m,children:[e("h4",{style:{margin:0,fontSize:"var(--ui-font-size-lg, 16px)",color:"var(--ui-color-text, #0f172a)"},children:"Soft High Elevation"}),e("p",{style:{...g,marginBottom:"var(--ui-space-sm, 8px)"},children:"Premium dashboard card treatment"}),e(h,{sortable:!0,hover:!0,striped:!0,stickyFooter:!0,shape:"soft",elevation:"high",pageSize:4,children:t("table",{children:[e("thead",{children:t("tr",{children:[e("th",{"data-key":"id",children:"Order"}),e("th",{"data-key":"customer",children:"Customer"}),e("th",{"data-key":"status",children:"Status"})]})}),e("tbody",{children:S.slice(0,4).map(n=>t("tr",{children:[e("td",{children:n.id}),e("td",{children:n.customer}),e("td",{children:e(y,{tone:w(n.status),variant:"soft",size:"sm",children:n.status})})]},`soft-${n.id}`))}),e("tfoot",{children:t("tr",{children:[e("td",{colSpan:2,children:"Surface style"}),e("td",{children:"Soft + High"})]})})]})})]})]})]}),D=()=>{const[n,u]=d.useState(1),l=d.useMemo(()=>S.filter(i=>i.status==="Paid").length,[]);return t(p,{style:z,children:[e(a,{style:m,children:t(v,{style:{display:"flex",justifyContent:"space-between",gap:"var(--ui-space-md, 12px)",flexWrap:"wrap"},children:[t("div",{children:[e("h3",{style:C,children:"Order Pipeline"}),e("p",{style:g,children:"Live commerce orders sorted by status, payout amount, and settlement date."})]}),e(y,{tone:"info",variant:"soft",children:"Revenue Ops"})]})}),e(h,{sortable:!0,striped:!0,hover:!0,stickyHeader:!0,stickyFooter:!0,page:n,pageSize:4,paginationId:"orders-pagination",onPageChange:i=>u(i.page),children:t("table",{children:[e("caption",{children:"Sortable order ledger for finance and support triage."}),e("thead",{children:t("tr",{children:[e("th",{"data-key":"id",children:"Order"}),e("th",{"data-key":"customer",children:"Customer"}),e("th",{"data-key":"total",children:"Total"}),e("th",{"data-key":"status",children:"Status"}),e("th",{"data-key":"placed",children:"Placed"})]})}),e("tbody",{children:S.map(i=>t("tr",{children:[e("td",{children:i.id}),e("td",{children:i.customer}),e("td",{children:i.total}),e("td",{children:e(y,{tone:w(i.status),variant:"soft",size:"sm",children:i.status})}),e("td",{children:i.placed})]},i.id))}),e("tfoot",{children:t("tr",{children:[e("td",{colSpan:3,children:"Paid orders"}),e("td",{children:l}),t("td",{children:[S.length," total"]})]})})]})}),e(v,{style:{display:"flex",justifyContent:"flex-end"},children:e(q,{id:"orders-pagination",page:n})})]})},M=()=>{const[n,u]=d.useState(""),[l,i]=d.useState("all"),[o,b]=d.useState("name,email,role,status,signups"),[c,f]=d.useState(1),[B,T]=d.useState({total:k.length,filtered:k.length});return t(p,{style:z,children:[t(a,{style:m,children:[e("h3",{style:C,children:"Analyst View Builder"}),e("p",{style:g,children:"Filter by token, resize columns, and drag headers to curate review-ready layouts."})]}),t(v,{style:j,children:[e(L,{value:n,onChange:s=>{u(s),f(1)},placeholder:"Filter users...",style:{minWidth:220}}),t(N,{value:l,onChange:s=>{i(s),f(1)},children:[e("option",{value:"all",children:"All columns"}),e("option",{value:"name",children:"Name"}),e("option",{value:"email",children:"Email"}),e("option",{value:"role",children:"Role"}),e("option",{value:"status",children:"Status"})]}),e(x,{size:"sm",variant:"secondary",onClick:()=>b("name,email,role,status,signups"),children:"Default order"}),e(x,{size:"sm",variant:"secondary",onClick:()=>b("status,name,role,email,signups"),children:"Status-first"}),e(a,{style:{fontSize:"var(--ui-font-size-sm, 12px)",color:"var(--ui-color-muted, #64748b)"},children:"Drag table headers to reorder columns"})]}),e(h,{sortable:!0,draggableColumns:!0,striped:!0,hover:!0,resizableColumns:!0,filterQuery:n,filterColumn:l==="all"?void 0:l,columnOrder:o,page:c,pageSize:5,paginationId:"filter-pagination",onPageChange:s=>f(s.page),onFilterChange:s=>T({total:s.total,filtered:s.filtered}),onColumnOrderChange:s=>b(s.order),children:t("table",{children:[e("caption",{children:"Interactive analyst table with drag/reorder/resize behaviors."}),e("thead",{children:t("tr",{children:[e("th",{"data-key":"name",children:"Name"}),e("th",{"data-key":"email",children:"Email"}),e("th",{"data-key":"role",children:"Role"}),e("th",{"data-key":"status",children:"Status"}),e("th",{"data-key":"signups",children:"Signups"})]})}),e("tbody",{children:k.map(s=>t("tr",{children:[e("td",{children:s.name}),e("td",{children:s.email}),e("td",{children:s.role}),e("td",{children:e(y,{tone:w(s.status),variant:"soft",size:"sm",children:s.status})}),e("td",{children:s.signups})]},s.email))})]})}),t(v,{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[t(a,{style:{fontSize:"var(--ui-font-size-md, 14px)",color:"var(--ui-color-muted, #64748b)"},children:["Matched ",B.filtered," of ",B.total," users"]}),t(a,{style:{fontSize:"var(--ui-font-size-sm, 12px)",color:"var(--ui-color-muted, #64748b)"},children:["Order: ",e("code",{children:o})]}),e(q,{id:"filter-pagination",page:c})]})]})},F=()=>{const[n,u]=d.useState(""),[l,i]=d.useState({start:0,end:0,visible:0,total:_.length});return t(p,{style:z,children:[t(a,{style:m,children:[e("h3",{style:C,children:"Large Dataset Performance"}),e("p",{style:g,children:"Virtualized rendering with overscan keeps interaction smooth at 1,200+ rows."})]}),t(v,{style:{...j,justifyContent:"space-between"},children:[e(L,{value:n,onChange:o=>u(o),placeholder:"Filter large dataset...",style:{minWidth:240}}),t(a,{style:{fontSize:"var(--ui-font-size-md, 14px)",color:"var(--ui-color-muted, #64748b)"},children:["Window: ",l.start+1,"-",Math.max(l.start+1,l.end+1)," / ",l.total," (visible ",l.visible,")"]})]}),e(h,{virtualize:!0,sortable:!0,striped:!0,hover:!0,stickyHeader:!0,pageSize:2e3,rowHeight:44,overscan:8,filterQuery:n,style:{"--ui-data-table-virtual-height":"460px"},onVirtualRangeChange:o=>i(o),children:t("table",{children:[e("caption",{children:"Virtualized enterprise directory. Scroll to test range window updates."}),e("thead",{children:t("tr",{children:[e("th",{"data-key":"id",children:"ID"}),e("th",{"data-key":"name",children:"Name"}),e("th",{"data-key":"email",children:"Email"}),e("th",{"data-key":"team",children:"Team"}),e("th",{"data-key":"active",children:"State"})]})}),e("tbody",{children:_.map(o=>t("tr",{children:[e("td",{children:o.id}),e("td",{children:o.name}),e("td",{children:o.email}),e("td",{children:o.team}),e("td",{children:e(y,{tone:o.active==="Active"?"success":"warning",variant:"soft",size:"sm",children:o.active})})]},o.id))})]})})]})},O=()=>t(p,{style:z,children:[t(a,{style:{border:"1px solid color-mix(in srgb, var(--ui-color-primary, #2563eb) 22%, var(--ui-color-border, #cbd5e1))",borderRadius:"var(--ui-radius, 12px)",background:"color-mix(in srgb, var(--ui-color-primary, #2563eb) 6%, var(--ui-color-surface-alt, #f8fafc))",color:"color-mix(in srgb, var(--ui-color-primary, #2563eb) 74%, #0f172a 26%)",fontSize:"var(--ui-font-size-md, 14px)",padding:"var(--ui-space-md, 12px)",lineHeight:1.5},children:["Header keys: ",e("strong",{children:"Enter/Space"})," sort, ",e("strong",{children:"Arrow Left/Right"})," move focus,",e("strong",{children:"Alt + Arrow Left/Right"})," reorder columns, ",e("strong",{children:"Home/End"})," jump first/last header. Row keys (when selectable): ",e("strong",{children:"Arrow Up/Down"})," move row focus,",e("strong",{children:"Space/Enter"})," toggle selection. Pointer: drag resize handles to resize columns. In ",e("strong",{children:"RTL"}),", left/right shortcuts are mirrored."]}),t(a,{dir:"rtl",style:{border:"1px solid var(--ui-color-border, #cbd5e1)",borderRadius:"var(--ui-radius, 12px)",padding:"var(--ui-space-md, 12px)"},children:[e("h4",{style:{margin:"0 0 10px"},children:"RTL Preview"}),e(h,{sortable:!0,draggableColumns:!0,striped:!0,hover:!0,children:t("table",{children:[e("thead",{children:t("tr",{children:[e("th",{"data-key":"name",children:"Name"}),e("th",{"data-key":"role",children:"Role"}),e("th",{"data-key":"status",children:"Status"})]})}),t("tbody",{children:[t("tr",{children:[e("td",{children:"Ava Johnson"}),e("td",{children:"Admin"}),e("td",{children:"Active"})]}),t("tr",{children:[e("td",{children:"Mia Chen"}),e("td",{children:"Editor"}),e("td",{children:"Invited"})]}),t("tr",{children:[e("td",{children:"Noah Patel"}),e("td",{children:"Analyst"}),e("td",{children:"Suspended"})]})]})]})})]})]}),E=()=>t(p,{style:{display:"grid",gap:"var(--ui-space-md, 12px)"},children:[t(a,{style:m,children:[e("h3",{style:C,children:"Operational States Matrix"}),e("p",{style:g,children:"Demonstrates loading, error, empty, and success table states for production flows."})]}),t(p,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:14},children:[t(a,{style:{border:"1px solid var(--ui-color-border, #cbd5e1)",borderRadius:"calc(var(--ui-radius, 12px) + 2px)",padding:"var(--ui-space-lg, 16px)"},children:[e("h4",{style:{margin:"0 0 10px"},children:"Loading"}),e(h,{loading:!0,state:"loading",stateText:"Syncing billing records",children:t("table",{children:[e("thead",{children:t("tr",{children:[e("th",{"data-key":"metric",children:"Metric"}),e("th",{"data-key":"value",children:"Value"})]})}),t("tbody",{children:[t("tr",{children:[e("td",{children:"Pending invoices"}),e("td",{children:e(J,{variant:"text",count:1,animated:!0})})]}),t("tr",{children:[e("td",{children:"Open disputes"}),e("td",{children:e(J,{variant:"text",count:1,animated:!0})})]})]})]})})]}),t(a,{style:{border:"1px solid var(--ui-color-border, #cbd5e1)",borderRadius:"calc(var(--ui-radius, 12px) + 2px)",padding:"var(--ui-space-lg, 16px)"},children:[e("h4",{style:{margin:"0 0 10px"},children:"Error"}),e(h,{state:"error",stateText:"Orders API timeout, retry required",children:t("table",{children:[e("thead",{children:t("tr",{children:[e("th",{"data-key":"metric",children:"Metric"}),e("th",{"data-key":"value",children:"Value"})]})}),t("tbody",{children:[t("tr",{children:[e("td",{children:"Failed requests"}),e("td",{children:"12"})]}),t("tr",{children:[e("td",{children:"Last healthy sync"}),e("td",{children:"2m ago"})]})]})]})}),e(a,{style:{marginTop:"var(--ui-space-sm, 8px)"},children:e(ke,{tone:"danger",title:"Could not fetch orders",description:"API returned 502. Retry or contact platform team.",dismissible:!0,children:e(a,{slot:"actions",children:e(x,{size:"sm",children:"Retry"})})})})]}),t(a,{style:{border:"1px solid var(--ui-color-border, #cbd5e1)",borderRadius:"calc(var(--ui-radius, 12px) + 2px)",padding:"var(--ui-space-lg, 16px)"},children:[e("h4",{style:{margin:"0 0 10px"},children:"Empty"}),e(we,{title:"No orders in this range",description:"Try a different date range or create a manual order.",actionLabel:"Create order",compact:!0})]})]}),t(a,{style:{border:"1px solid var(--ui-color-border, #cbd5e1)",borderRadius:"calc(var(--ui-radius, 12px) + 2px)",padding:"var(--ui-space-lg, 16px)"},children:[e("h4",{style:{margin:"0 0 10px"},children:"Success"}),e(h,{sortable:!0,striped:!0,hover:!0,state:"success",stateText:"Data quality checks passed",page:1,pageSize:3,children:t("table",{children:[e("thead",{children:t("tr",{children:[e("th",{"data-key":"metric",children:"Metric"}),e("th",{"data-key":"value",children:"Value"}),e("th",{"data-key":"trend",children:"Trend"})]})}),t("tbody",{children:[t("tr",{children:[e("td",{children:"Daily Active Users"}),e("td",{children:"2,184"}),e("td",{children:"+8.4%"})]}),t("tr",{children:[e("td",{children:"Conversion Rate"}),e("td",{children:"4.9%"}),e("td",{children:"+0.7%"})]}),t("tr",{children:[e("td",{children:"Avg. Response Time"}),e("td",{children:"218ms"}),e("td",{children:"-12ms"})]})]})]})})]})]}),I=()=>{const[n,u]=d.useState(""),[l,i]=d.useState("all"),[o,b]=d.useState("all"),[c,f]=d.useState("0"),[B,T]=d.useState(1),[s,W]=d.useState([]),[Q,Se]=d.useState("default"),[U,A]=d.useState(""),xe=d.useMemo(()=>{const r=[];l!=="all"&&r.push({column:"role",op:"equals",value:l}),o!=="all"&&r.push({column:"status",op:"equals",value:o});const G=Number(c);return Number.isFinite(G)&&G>0&&r.push({column:"signups",op:"gte",value:G}),r},[l,o,c]);return t(p,{style:z,children:[t(a,{style:m,children:[e("h3",{style:C,children:"Pinned Columns + Bulk Operations"}),e("p",{style:g,children:"Segment users by filter rules, keep critical columns pinned, and run bulk workflows."})]}),t(v,{style:j,children:[e(L,{value:n,onChange:r=>{u(r),T(1)},placeholder:"Search by token...",style:{minWidth:200}}),t(N,{value:l,onChange:r=>i(r),children:[e("option",{value:"all",children:"Any role"}),e("option",{value:"Admin",children:"Admin"}),e("option",{value:"Manager",children:"Manager"}),e("option",{value:"Editor",children:"Editor"}),e("option",{value:"Analyst",children:"Analyst"})]}),t(N,{value:o,onChange:r=>b(r),children:[e("option",{value:"all",children:"Any status"}),e("option",{value:"Active",children:"Active"}),e("option",{value:"Invited",children:"Invited"}),e("option",{value:"Suspended",children:"Suspended"})]}),e(L,{type:"number",value:c,onChange:r=>f(r),placeholder:"Min signups",style:{width:110}}),t(x,{size:"sm",variant:"secondary",onClick:()=>Se(r=>r==="default"?"analytics":"default"),children:["Pin mode: ",Q]})]}),t(h,{sortable:!0,selectable:!0,multiSelect:!0,striped:!0,hover:!0,stickyHeader:!0,draggableColumns:!0,resizableColumns:!0,page:B,pageSize:6,paginationId:"pinned-pagination",filterQuery:n,filterRules:xe,pinColumns:Q==="analytics"?{left:["status"],right:["signups"]}:{left:["name"],right:["signups"]},bulkActionsLabel:"{count} rows selected",bulkClearLabel:"Clear",onPageChange:r=>T(r.page),onRowSelect:r=>W(r.indices),onBulkClear:()=>{W([]),A("Selection cleared"),window.setTimeout(()=>A(""),1e3)},children:[e(x,{slot:"bulk-actions",size:"sm",variant:"secondary",onClick:()=>A(`Exporting ${s.length||0} selected rows`),children:"Export selected"}),e(x,{slot:"bulk-actions",size:"sm",variant:"ghost",onClick:()=>A(`Assigning ${s.length||0} users to campaign`),children:"Assign campaign"}),t("table",{children:[e("caption",{children:"Pinned-column campaign table with reusable bulk actions."}),e("thead",{children:t("tr",{children:[e("th",{"data-key":"name",children:"Name"}),e("th",{"data-key":"email",children:"Email"}),e("th",{"data-key":"role",children:"Role"}),e("th",{"data-key":"status",children:"Status"}),e("th",{"data-key":"signups",children:"Signups"})]})}),e("tbody",{children:k.map(r=>t("tr",{children:[e("td",{children:r.name}),e("td",{children:r.email}),e("td",{children:r.role}),e("td",{children:e(y,{tone:w(r.status),variant:"soft",size:"sm",children:r.status})}),e("td",{children:r.signups})]},r.email))})]})]}),t(v,{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"},children:[t(a,{style:{fontSize:"var(--ui-font-size-md, 14px)",color:"var(--ui-color-muted, #64748b)"},children:["Selected rows: ",e("strong",{children:s.length})," ",U?`• ${U}`:""]}),e(q,{id:"pinned-pagination",page:B})]})]})};var K,X,Y;R.parameters={...R.parameters,docs:{...(K=R.parameters)==null?void 0:K.docs,source:{originalSource:`(args: any) => {
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<number[]>([]);
  const totalSignups = React.useMemo(() => users.reduce((sum, row) => sum + row.signups, 0), []);
  return <Grid style={dashboardShellStyle}>
      <Box style={panelStyle}>
        <Flex style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 'var(--ui-space-md, 12px)',
        flexWrap: 'wrap'
      }}>
          <div>
            <h3 style={panelTitleStyle}>Workforce Access Directory</h3>
            <p style={panelSubtitleStyle}>Operational user inventory with multi-select workflows and in-row actions.</p>
          </div>
          <Badge tone="brand" variant="soft">Directory</Badge>
        </Flex>

        <Grid style={{
        ...metricGridStyle,
        marginTop: 'var(--ui-space-md, 12px)'
      }}>
          <Box style={metricCardStyle}>
            <div style={metricLabelStyle}>Total Records</div>
            <div style={metricValueStyle}>{users.length}</div>
          </Box>
          <Box style={metricCardStyle}>
            <div style={metricLabelStyle}>Selected</div>
            <div style={metricValueStyle}>{selected.length}</div>
          </Box>
          <Box style={metricCardStyle}>
            <div style={metricLabelStyle}>Current Page</div>
            <div style={metricValueStyle}>{page}</div>
          </Box>
        </Grid>
      </Box>

      <DataTable sortable selectable multiSelect shape={args.shape} variant={args.variant} elevation={args.elevation} striped={args.striped} hover={args.hover} stickyHeader={args.stickyHeader} stickyFooter={args.stickyFooter} page={page} pageSize={args.pageSize} paginationId="users-pagination" onPageChange={detail => setPage(detail.page)} onRowSelect={detail => setSelected(detail.indices)}>
        <table>
          <caption>Click row actions to validate that controls do not toggle row selection.</caption>
          <thead>
            <tr>
              <th data-key="name">Name</th>
              <th data-key="email">Email</th>
              <th data-key="role">Role</th>
              <th data-key="status">Status</th>
              <th data-key="signups">Signups</th>
              <th data-key="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(row => <tr key={row.email}>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>
                  <Badge tone={statusTone(row.status)} variant="soft" size="sm">
                    {row.status}
                  </Badge>
                </td>
                <td>{row.signups}</td>
                <td>
                  <Button size="sm" variant="ghost">View</Button>
                </td>
              </tr>)}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>Total signups</td>
              <td>{totalSignups}</td>
              <td>{selected.length ? \`\${selected.length} selected\` : ''}</td>
            </tr>
          </tfoot>
        </table>
      </DataTable>

      <Flex style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'var(--ui-space-sm, 8px)',
      flexWrap: 'wrap'
    }}>
        <Box style={{
        fontSize: 'var(--ui-font-size-md, 14px)',
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          Selected users: {selected.length ? selected.length : 'none'}
        </Box>
        <Pagination id="users-pagination" page={page} />
      </Flex>
    </Grid>;
}`,...(Y=(X=R.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,ee,te;P.parameters={...P.parameters,docs:{...(Z=P.parameters)==null?void 0:Z.docs,source:{originalSource:`() => <Grid style={dashboardShellStyle}>
    <Box style={panelStyle}>
      <h3 style={panelTitleStyle}>Shape + Surface Variants</h3>
      <p style={panelSubtitleStyle}>Use square corners and flat surfaces for utility-heavy enterprise screens, or softer/elevated styles for dashboards.</p>
    </Box>

    <Grid style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'var(--ui-space-md, 12px)'
  }}>
      <Box style={panelStyle}>
        <h4 style={{
        margin: 0,
        fontSize: 'var(--ui-font-size-lg, 16px)',
        color: 'var(--ui-color-text, #0f172a)'
      }}>Default</h4>
        <p style={{
        ...panelSubtitleStyle,
        marginBottom: 'var(--ui-space-sm, 8px)'
      }}>Balanced rounded enterprise table</p>
        <DataTable sortable hover striped pageSize={4}>
          <table>
            <thead>
              <tr>
                <th data-key="id">Order</th>
                <th data-key="customer">Customer</th>
                <th data-key="status">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 4).map(row => <tr key={\`default-\${row.id}\`}>
                  <td>{row.id}</td>
                  <td>{row.customer}</td>
                  <td><Badge tone={statusTone(row.status)} variant="soft" size="sm">{row.status}</Badge></td>
                </tr>)}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Visible rows</td>
                <td>{orders.slice(0, 4).length}</td>
              </tr>
            </tfoot>
          </table>
        </DataTable>
      </Box>

      <Box style={panelStyle}>
        <h4 style={{
        margin: 0,
        fontSize: 'var(--ui-font-size-lg, 16px)',
        color: 'var(--ui-color-text, #0f172a)'
      }}>Flat Square</h4>
        <p style={{
        ...panelSubtitleStyle,
        marginBottom: 'var(--ui-space-sm, 8px)'
      }}>Minimal shape for dense operations</p>
        <DataTable sortable hover striped stickyFooter shape="square" variant="flat" elevation="none" pageSize={4}>
          <table>
            <thead>
              <tr>
                <th data-key="id">Order</th>
                <th data-key="customer">Customer</th>
                <th data-key="status">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 4).map(row => <tr key={\`flat-\${row.id}\`}>
                  <td>{row.id}</td>
                  <td>{row.customer}</td>
                  <td><Badge tone={statusTone(row.status)} variant="soft" size="sm">{row.status}</Badge></td>
                </tr>)}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Flat footer</td>
                <td>Sticky</td>
              </tr>
            </tfoot>
          </table>
        </DataTable>
      </Box>

      <Box style={panelStyle}>
        <h4 style={{
        margin: 0,
        fontSize: 'var(--ui-font-size-lg, 16px)',
        color: 'var(--ui-color-text, #0f172a)'
      }}>Soft High Elevation</h4>
        <p style={{
        ...panelSubtitleStyle,
        marginBottom: 'var(--ui-space-sm, 8px)'
      }}>Premium dashboard card treatment</p>
        <DataTable sortable hover striped stickyFooter shape="soft" elevation="high" pageSize={4}>
          <table>
            <thead>
              <tr>
                <th data-key="id">Order</th>
                <th data-key="customer">Customer</th>
                <th data-key="status">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 4).map(row => <tr key={\`soft-\${row.id}\`}>
                  <td>{row.id}</td>
                  <td>{row.customer}</td>
                  <td><Badge tone={statusTone(row.status)} variant="soft" size="sm">{row.status}</Badge></td>
                </tr>)}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Surface style</td>
                <td>Soft + High</td>
              </tr>
            </tfoot>
          </table>
        </DataTable>
      </Box>
    </Grid>
  </Grid>`,...(te=(ee=P.parameters)==null?void 0:ee.docs)==null?void 0:te.source}}};var ne,ae,re;D.parameters={...D.parameters,docs:{...(ne=D.parameters)==null?void 0:ne.docs,source:{originalSource:`() => {
  const [page, setPage] = React.useState(1);
  const paidOrders = React.useMemo(() => orders.filter(order => order.status === 'Paid').length, []);
  return <Grid style={dashboardShellStyle}>
      <Box style={panelStyle}>
        <Flex style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 'var(--ui-space-md, 12px)',
        flexWrap: 'wrap'
      }}>
          <div>
            <h3 style={panelTitleStyle}>Order Pipeline</h3>
            <p style={panelSubtitleStyle}>Live commerce orders sorted by status, payout amount, and settlement date.</p>
          </div>
          <Badge tone="info" variant="soft">Revenue Ops</Badge>
        </Flex>
      </Box>
      <DataTable sortable striped hover stickyHeader stickyFooter page={page} pageSize={4} paginationId="orders-pagination" onPageChange={detail => setPage(detail.page)}>
        <table>
          <caption>Sortable order ledger for finance and support triage.</caption>
          <thead>
            <tr>
              <th data-key="id">Order</th>
              <th data-key="customer">Customer</th>
              <th data-key="total">Total</th>
              <th data-key="status">Status</th>
              <th data-key="placed">Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(row => <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.customer}</td>
                <td>{row.total}</td>
                <td>
                  <Badge tone={statusTone(row.status)} variant="soft" size="sm">
                    {row.status}
                  </Badge>
                </td>
                <td>{row.placed}</td>
              </tr>)}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>Paid orders</td>
              <td>{paidOrders}</td>
              <td>{orders.length} total</td>
            </tr>
          </tfoot>
        </table>
      </DataTable>

      <Flex style={{
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
        <Pagination id="orders-pagination" page={page} />
      </Flex>
    </Grid>;
}`,...(re=(ae=D.parameters)==null?void 0:ae.docs)==null?void 0:re.source}}};var ie,le,se;M.parameters={...M.parameters,docs:{...(ie=M.parameters)==null?void 0:ie.docs,source:{originalSource:`() => {
  const [query, setQuery] = React.useState('');
  const [column, setColumn] = React.useState('all');
  const [order, setOrder] = React.useState('name,email,role,status,signups');
  const [page, setPage] = React.useState(1);
  const [stats, setStats] = React.useState({
    total: users.length,
    filtered: users.length
  });
  return <Grid style={dashboardShellStyle}>
      <Box style={panelStyle}>
        <h3 style={panelTitleStyle}>Analyst View Builder</h3>
        <p style={panelSubtitleStyle}>Filter by token, resize columns, and drag headers to curate review-ready layouts.</p>
      </Box>

      <Flex style={toolbarStyle}>
        <Input value={query} onChange={next => {
        setQuery(next);
        setPage(1);
      }} placeholder="Filter users..." style={{
        minWidth: 220
      }} />
        <Select value={column} onChange={next => {
        setColumn(next);
        setPage(1);
      }}>
          <option value="all">All columns</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="role">Role</option>
          <option value="status">Status</option>
        </Select>
        <Button size="sm" variant="secondary" onClick={() => setOrder('name,email,role,status,signups')}>
          Default order
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setOrder('status,name,role,email,signups')}>
          Status-first
        </Button>
        <Box style={{
        fontSize: 'var(--ui-font-size-sm, 12px)',
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          Drag table headers to reorder columns
        </Box>
      </Flex>

      <DataTable sortable draggableColumns striped hover resizableColumns filterQuery={query} filterColumn={column === 'all' ? undefined : column} columnOrder={order} page={page} pageSize={5} paginationId="filter-pagination" onPageChange={detail => setPage(detail.page)} onFilterChange={detail => setStats({
      total: detail.total,
      filtered: detail.filtered
    })} onColumnOrderChange={detail => setOrder(detail.order)}>
        <table>
          <caption>Interactive analyst table with drag/reorder/resize behaviors.</caption>
          <thead>
            <tr>
              <th data-key="name">Name</th>
              <th data-key="email">Email</th>
              <th data-key="role">Role</th>
              <th data-key="status">Status</th>
              <th data-key="signups">Signups</th>
            </tr>
          </thead>
          <tbody>
            {users.map(row => <tr key={row.email}>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>
                  <Badge tone={statusTone(row.status)} variant="soft" size="sm">
                    {row.status}
                  </Badge>
                </td>
                <td>{row.signups}</td>
              </tr>)}
          </tbody>
        </table>
      </DataTable>

      <Flex style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
        <Box style={{
        fontSize: 'var(--ui-font-size-md, 14px)',
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          Matched {stats.filtered} of {stats.total} users
        </Box>
        <Box style={{
        fontSize: 'var(--ui-font-size-sm, 12px)',
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          Order: <code>{order}</code>
        </Box>
        <Pagination id="filter-pagination" page={page} />
      </Flex>
    </Grid>;
}`,...(se=(le=M.parameters)==null?void 0:le.docs)==null?void 0:se.source}}};var oe,de,ce;F.parameters={...F.parameters,docs:{...(oe=F.parameters)==null?void 0:oe.docs,source:{originalSource:`() => {
  const [query, setQuery] = React.useState('');
  const [range, setRange] = React.useState({
    start: 0,
    end: 0,
    visible: 0,
    total: virtualRows.length
  });
  return <Grid style={dashboardShellStyle}>
      <Box style={panelStyle}>
        <h3 style={panelTitleStyle}>Large Dataset Performance</h3>
        <p style={panelSubtitleStyle}>Virtualized rendering with overscan keeps interaction smooth at 1,200+ rows.</p>
      </Box>

      <Flex style={{
      ...toolbarStyle,
      justifyContent: 'space-between'
    }}>
        <Input value={query} onChange={next => setQuery(next)} placeholder="Filter large dataset..." style={{
        minWidth: 240
      }} />
        <Box style={{
        fontSize: 'var(--ui-font-size-md, 14px)',
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          Window: {range.start + 1}-{Math.max(range.start + 1, range.end + 1)} / {range.total} (visible {range.visible})
        </Box>
      </Flex>

      <DataTable virtualize sortable striped hover stickyHeader pageSize={2000} rowHeight={44} overscan={8} filterQuery={query} style={{
      ['--ui-data-table-virtual-height' as any]: '460px'
    }} onVirtualRangeChange={detail => setRange(detail)}>
        <table>
          <caption>Virtualized enterprise directory. Scroll to test range window updates.</caption>
          <thead>
            <tr>
              <th data-key="id">ID</th>
              <th data-key="name">Name</th>
              <th data-key="email">Email</th>
              <th data-key="team">Team</th>
              <th data-key="active">State</th>
            </tr>
          </thead>
          <tbody>
            {virtualRows.map(row => <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.team}</td>
                <td>
                  <Badge tone={row.active === 'Active' ? 'success' : 'warning'} variant="soft" size="sm">
                    {row.active}
                  </Badge>
                </td>
              </tr>)}
          </tbody>
        </table>
      </DataTable>
    </Grid>;
}`,...(ce=(de=F.parameters)==null?void 0:de.docs)==null?void 0:ce.source}}};var ue,he,pe;O.parameters={...O.parameters,docs:{...(ue=O.parameters)==null?void 0:ue.docs,source:{originalSource:`() => <Grid style={dashboardShellStyle}>
    <Box style={{
    border: '1px solid color-mix(in srgb, var(--ui-color-primary, #2563eb) 22%, var(--ui-color-border, #cbd5e1))',
    borderRadius: 'var(--ui-radius, 12px)',
    background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 6%, var(--ui-color-surface-alt, #f8fafc))',
    color: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 74%, #0f172a 26%)',
    fontSize: 'var(--ui-font-size-md, 14px)',
    padding: 'var(--ui-space-md, 12px)',
    lineHeight: 1.5
  }}>
      Header keys: <strong>Enter/Space</strong> sort, <strong>Arrow Left/Right</strong> move focus,
      <strong>Alt + Arrow Left/Right</strong> reorder columns, <strong>Home/End</strong> jump first/last header.
      Row keys (when selectable): <strong>Arrow Up/Down</strong> move row focus,
      <strong>Space/Enter</strong> toggle selection. Pointer: drag resize handles to resize columns.
      In <strong>RTL</strong>, left/right shortcuts are mirrored.
    </Box>

    <Box dir="rtl" style={{
    border: '1px solid var(--ui-color-border, #cbd5e1)',
    borderRadius: 'var(--ui-radius, 12px)',
    padding: 'var(--ui-space-md, 12px)'
  }}>
      <h4 style={{
      margin: '0 0 10px'
    }}>RTL Preview</h4>
      <DataTable sortable draggableColumns striped hover>
        <table>
          <thead>
            <tr>
              <th data-key="name">Name</th>
              <th data-key="role">Role</th>
              <th data-key="status">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Ava Johnson</td><td>Admin</td><td>Active</td></tr>
            <tr><td>Mia Chen</td><td>Editor</td><td>Invited</td></tr>
            <tr><td>Noah Patel</td><td>Analyst</td><td>Suspended</td></tr>
          </tbody>
        </table>
      </DataTable>
    </Box>
  </Grid>`,...(pe=(he=O.parameters)==null?void 0:he.docs)==null?void 0:pe.source}}};var me,ge,ye;E.parameters={...E.parameters,docs:{...(me=E.parameters)==null?void 0:me.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 'var(--ui-space-md, 12px)'
}}>
    <Box style={panelStyle}>
      <h3 style={panelTitleStyle}>Operational States Matrix</h3>
      <p style={panelSubtitleStyle}>Demonstrates loading, error, empty, and success table states for production flows.</p>
    </Box>

    <Grid style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 14
  }}>
      <Box style={{
      border: '1px solid var(--ui-color-border, #cbd5e1)',
      borderRadius: 'calc(var(--ui-radius, 12px) + 2px)',
      padding: 'var(--ui-space-lg, 16px)'
    }}>
        <h4 style={{
        margin: '0 0 10px'
      }}>Loading</h4>
        <DataTable loading state="loading" stateText="Syncing billing records">
          <table>
            <thead>
              <tr>
                <th data-key="metric">Metric</th>
                <th data-key="value">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Pending invoices</td><td><Skeleton variant="text" count={1} animated /></td></tr>
              <tr><td>Open disputes</td><td><Skeleton variant="text" count={1} animated /></td></tr>
            </tbody>
          </table>
        </DataTable>
      </Box>

      <Box style={{
      border: '1px solid var(--ui-color-border, #cbd5e1)',
      borderRadius: 'calc(var(--ui-radius, 12px) + 2px)',
      padding: 'var(--ui-space-lg, 16px)'
    }}>
        <h4 style={{
        margin: '0 0 10px'
      }}>Error</h4>
        <DataTable state="error" stateText="Orders API timeout, retry required">
          <table>
            <thead>
              <tr>
                <th data-key="metric">Metric</th>
                <th data-key="value">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Failed requests</td><td>12</td></tr>
              <tr><td>Last healthy sync</td><td>2m ago</td></tr>
            </tbody>
          </table>
        </DataTable>
        <Box style={{
        marginTop: 'var(--ui-space-sm, 8px)'
      }}>
          <Alert tone="danger" title="Could not fetch orders" description="API returned 502. Retry or contact platform team." dismissible>
            <Box slot="actions">
              <Button size="sm">Retry</Button>
            </Box>
          </Alert>
        </Box>
      </Box>

      <Box style={{
      border: '1px solid var(--ui-color-border, #cbd5e1)',
      borderRadius: 'calc(var(--ui-radius, 12px) + 2px)',
      padding: 'var(--ui-space-lg, 16px)'
    }}>
        <h4 style={{
        margin: '0 0 10px'
      }}>Empty</h4>
        <EmptyState title="No orders in this range" description="Try a different date range or create a manual order." actionLabel="Create order" compact />
      </Box>
    </Grid>

    <Box style={{
    border: '1px solid var(--ui-color-border, #cbd5e1)',
    borderRadius: 'calc(var(--ui-radius, 12px) + 2px)',
    padding: 'var(--ui-space-lg, 16px)'
  }}>
      <h4 style={{
      margin: '0 0 10px'
    }}>Success</h4>
      <DataTable sortable striped hover state="success" stateText="Data quality checks passed" page={1} pageSize={3}>
        <table>
          <thead>
            <tr>
              <th data-key="metric">Metric</th>
              <th data-key="value">Value</th>
              <th data-key="trend">Trend</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Daily Active Users</td><td>2,184</td><td>+8.4%</td></tr>
            <tr><td>Conversion Rate</td><td>4.9%</td><td>+0.7%</td></tr>
            <tr><td>Avg. Response Time</td><td>218ms</td><td>-12ms</td></tr>
          </tbody>
        </table>
      </DataTable>
    </Box>
  </Grid>`,...(ye=(ge=E.parameters)==null?void 0:ge.docs)==null?void 0:ye.source}}};var ve,be,fe;I.parameters={...I.parameters,docs:{...(ve=I.parameters)==null?void 0:ve.docs,source:{originalSource:`() => {
  const [query, setQuery] = React.useState('');
  const [role, setRole] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const [minSignups, setMinSignups] = React.useState('0');
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [pinMode, setPinMode] = React.useState<'default' | 'analytics'>('default');
  const [message, setMessage] = React.useState('');
  const filterRules = React.useMemo(() => {
    const rules: Array<{
      column: string;
      op: 'equals' | 'gte';
      value: string | number;
    }> = [];
    if (role !== 'all') rules.push({
      column: 'role',
      op: 'equals',
      value: role
    });
    if (status !== 'all') rules.push({
      column: 'status',
      op: 'equals',
      value: status
    });
    const min = Number(minSignups);
    if (Number.isFinite(min) && min > 0) rules.push({
      column: 'signups',
      op: 'gte',
      value: min
    });
    return rules;
  }, [role, status, minSignups]);
  const pinColumns = pinMode === 'analytics' ? {
    left: ['status'],
    right: ['signups']
  } : {
    left: ['name'],
    right: ['signups']
  };
  return <Grid style={dashboardShellStyle}>
      <Box style={panelStyle}>
        <h3 style={panelTitleStyle}>Pinned Columns + Bulk Operations</h3>
        <p style={panelSubtitleStyle}>Segment users by filter rules, keep critical columns pinned, and run bulk workflows.</p>
      </Box>

      <Flex style={toolbarStyle}>
        <Input value={query} onChange={next => {
        setQuery(next);
        setPage(1);
      }} placeholder="Search by token..." style={{
        minWidth: 200
      }} />
        <Select value={role} onChange={next => setRole(next)}>
          <option value="all">Any role</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Editor">Editor</option>
          <option value="Analyst">Analyst</option>
        </Select>
        <Select value={status} onChange={next => setStatus(next)}>
          <option value="all">Any status</option>
          <option value="Active">Active</option>
          <option value="Invited">Invited</option>
          <option value="Suspended">Suspended</option>
        </Select>
        <Input type="number" value={minSignups} onChange={next => setMinSignups(next)} placeholder="Min signups" style={{
        width: 110
      }} />
        <Button size="sm" variant="secondary" onClick={() => setPinMode(mode => mode === 'default' ? 'analytics' : 'default')}>
          Pin mode: {pinMode}
        </Button>
      </Flex>

      <DataTable sortable selectable multiSelect striped hover stickyHeader draggableColumns resizableColumns page={page} pageSize={6} paginationId="pinned-pagination" filterQuery={query} filterRules={filterRules} pinColumns={pinColumns} bulkActionsLabel="{count} rows selected" bulkClearLabel="Clear" onPageChange={detail => setPage(detail.page)} onRowSelect={detail => setSelected(detail.indices)} onBulkClear={() => {
      setSelected([]);
      setMessage('Selection cleared');
      window.setTimeout(() => setMessage(''), 1000);
    }}>
        <Button slot="bulk-actions" size="sm" variant="secondary" onClick={() => setMessage(\`Exporting \${selected.length || 0} selected rows\`)}>
          Export selected
        </Button>
        <Button slot="bulk-actions" size="sm" variant="ghost" onClick={() => setMessage(\`Assigning \${selected.length || 0} users to campaign\`)}>
          Assign campaign
        </Button>

        <table>
          <caption>Pinned-column campaign table with reusable bulk actions.</caption>
          <thead>
            <tr>
              <th data-key="name">Name</th>
              <th data-key="email">Email</th>
              <th data-key="role">Role</th>
              <th data-key="status">Status</th>
              <th data-key="signups">Signups</th>
            </tr>
          </thead>
          <tbody>
            {users.map(row => <tr key={row.email}>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>
                  <Badge tone={statusTone(row.status)} variant="soft" size="sm">
                    {row.status}
                  </Badge>
                </td>
                <td>{row.signups}</td>
              </tr>)}
          </tbody>
        </table>
      </DataTable>

      <Flex style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }}>
        <Box style={{
        fontSize: 'var(--ui-font-size-md, 14px)',
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          Selected rows: <strong>{selected.length}</strong> {message ? \`• \${message}\` : ''}
        </Box>
        <Pagination id="pinned-pagination" page={page} />
      </Flex>
    </Grid>;
}`,...(fe=(be=I.parameters)==null?void 0:be.docs)==null?void 0:fe.source}}};const Pe=["UsersTable","ShapeVariants","OrdersTable","FilterResizeReorder","VirtualizedLargeDataset","AccessibilityKeyboardMap","LoadingErrorEmptyMatrix","PinnedFilterBuilderBulkActions"];export{O as AccessibilityKeyboardMap,M as FilterResizeReorder,E as LoadingErrorEmptyMatrix,D as OrdersTable,I as PinnedFilterBuilderBulkActions,P as ShapeVariants,R as UsersTable,F as VirtualizedLargeDataset,Pe as __namedExportsOrder,Ae as default};
