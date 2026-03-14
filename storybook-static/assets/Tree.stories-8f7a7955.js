import{aE as u,j as r,G as m,aF as e,a,B as o}from"./index-ce0e40fa.js";import{r as p}from"./index-93f6b7ae.js";import"./index-c197feae.js";const g={title:"UI/Tree",component:u},l=()=>{const[n,i]=p.useState("button");return r(m,{columns:"320px 1fr",gap:"16px",style:{minHeight:420},children:[r(u,{value:n,indentSize:"14px",onSelect:c=>i(c.value),style:{minHeight:360},children:[r(e,{value:"src",label:"src",expanded:!0,children:[r(e,{value:"components",label:"components",expanded:!0,children:[a(e,{value:"button",label:"button.tsx"}),a(e,{value:"dialog",label:"dialog.tsx"}),a(e,{value:"tree",label:"tree.tsx"})]}),r(e,{value:"hooks",label:"hooks",expanded:!0,children:[a(e,{value:"use-floating",label:"useFloating.ts"}),a(e,{value:"use-theme",label:"useTheme.ts"})]})]}),r(e,{value:"docs",label:"docs",expanded:!0,children:[a(e,{value:"changelog",label:"changelog.md"}),a(e,{value:"roadmap",label:"roadmap.md"})]})]}),r(o,{style:{border:"1px solid var(--ui-color-border, #cbd5e1)",borderRadius:"var(--ui-radius, 12px)",padding:16,background:"var(--ui-color-surface, #ffffff)"},children:[a("strong",{children:"Selected node"}),a(o,{style:{marginTop:8,color:"var(--ui-color-muted, #64748b)"},children:n}),a(o,{style:{marginTop:12,color:"var(--ui-color-muted, #64748b)"},children:"Production-style explorer navigation with nested groups, roving focus, expand/collapse arrows, and typeahead."})]})]})};var t,s,d;l.parameters={...l.parameters,docs:{...(t=l.parameters)==null?void 0:t.docs,source:{originalSource:`() => {
  const [value, setValue] = useState('button');
  return <Grid columns="320px 1fr" gap="16px" style={{
    minHeight: 420
  }}>
      <Tree value={value} indentSize="14px" onSelect={detail => setValue(detail.value)} style={{
      minHeight: 360
    }}>
        <TreeItem value="src" label="src" expanded>
          <TreeItem value="components" label="components" expanded>
            <TreeItem value="button" label="button.tsx" />
            <TreeItem value="dialog" label="dialog.tsx" />
            <TreeItem value="tree" label="tree.tsx" />
          </TreeItem>
          <TreeItem value="hooks" label="hooks" expanded>
            <TreeItem value="use-floating" label="useFloating.ts" />
            <TreeItem value="use-theme" label="useTheme.ts" />
          </TreeItem>
        </TreeItem>
        <TreeItem value="docs" label="docs" expanded>
          <TreeItem value="changelog" label="changelog.md" />
          <TreeItem value="roadmap" label="roadmap.md" />
        </TreeItem>
      </Tree>

      <Box style={{
      border: '1px solid var(--ui-color-border, #cbd5e1)',
      borderRadius: 'var(--ui-radius, 12px)',
      padding: 16,
      background: 'var(--ui-color-surface, #ffffff)'
    }}>
        <strong>Selected node</strong>
        <Box style={{
        marginTop: 8,
        color: 'var(--ui-color-muted, #64748b)'
      }}>{value}</Box>
        <Box style={{
        marginTop: 12,
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          Production-style explorer navigation with nested groups, roving focus, expand/collapse arrows, and typeahead.
        </Box>
      </Box>
    </Grid>;
}`,...(d=(s=l.parameters)==null?void 0:s.docs)==null?void 0:d.source}}};const h=["Explorer"];export{l as Explorer,h as __namedExportsOrder,g as default};
