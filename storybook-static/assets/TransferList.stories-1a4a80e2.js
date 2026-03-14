import{bz as o,a,B as l}from"./index-ce0e40fa.js";import{R as d}from"./index-93f6b7ae.js";import"./index-c197feae.js";const m={title:"UI/TransferList",component:o},e=()=>{const[s,i]=d.useState(["read"]);return a(l,{style:{maxWidth:860},children:a(o,{label:"Workspace permissions",description:"Move permissions into the selected column to grant them.",value:s,onValueChange:i,options:[{value:"read",label:"Read",description:"View records and reports."},{value:"write",label:"Write",description:"Create and edit content."},{value:"export",label:"Export",description:"Download audit and CSV exports."},{value:"admin",label:"Admin",description:"Manage workspace configuration."}]})})};var n,t,r;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`() => {
  const [value, setValue] = React.useState<string[]>(['read']);
  return <Box style={{
    maxWidth: 860
  }}>
      <TransferList label="Workspace permissions" description="Move permissions into the selected column to grant them." value={value} onValueChange={setValue} options={[{
      value: 'read',
      label: 'Read',
      description: 'View records and reports.'
    }, {
      value: 'write',
      label: 'Write',
      description: 'Create and edit content.'
    }, {
      value: 'export',
      label: 'Export',
      description: 'Download audit and CSV exports.'
    }, {
      value: 'admin',
      label: 'Admin',
      description: 'Manage workspace configuration.'
    }]} />
    </Box>;
}`,...(r=(t=e.parameters)==null?void 0:t.docs)==null?void 0:r.source}}};const v=["RoleMapping"];export{e as RoleMapping,v as __namedExportsOrder,m as default};
