import{E as n,a,j as s,F as u,b as r}from"./index-ce0e40fa.js";import"./index-93f6b7ae.js";import"./index-c197feae.js";const S={title:"UI/EmptyState",component:n,argTypes:{title:{control:"text"},description:{control:"text"},actionLabel:{control:"text"},tone:{control:"radio",options:["neutral","success","warning","danger"]},compact:{control:"boolean"}}},e=t=>a(n,{title:t.title,description:t.description,actionLabel:t.actionLabel,tone:t.tone,compact:t.compact});e.args={title:"No users matched your filter",description:"Try changing role filters or invite a new team member.",actionLabel:"Invite user",tone:"neutral",compact:!1};const o=()=>s(n,{title:"No invoices",description:"Create your first invoice to start collecting payments.",children:[a("span",{slot:"icon",children:"USD"}),s(u,{slot:"actions",style:{display:"flex",gap:8},children:[a(r,{size:"sm",children:"Create invoice"}),a(r,{size:"sm",variant:"secondary",children:"Import data"})]})]});var i,c,l;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:"(args: any) => <EmptyState title={args.title} description={args.description} actionLabel={args.actionLabel} tone={args.tone} compact={args.compact} />",...(l=(c=e.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var p,m,d;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`() => <EmptyState title="No invoices" description="Create your first invoice to start collecting payments.">
    <span slot="icon">USD</span>
    <Flex slot="actions" style={{
    display: 'flex',
    gap: 8
  }}>
      <Button size="sm">Create invoice</Button>
      <Button size="sm" variant="secondary">Import data</Button>
    </Flex>
  </EmptyState>`,...(d=(m=o.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};const f=["Default","SlottedActions"];export{e as Default,o as SlottedActions,f as __namedExportsOrder,S as default};
