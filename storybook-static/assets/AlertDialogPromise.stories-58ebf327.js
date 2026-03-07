import{a as o,u as g,v as A,j as a,B as c,F as w,b as l}from"./index-c1b18327.js";import{R as P}from"./index-93f6b7ae.js";const v={title:"UI/AlertDialogPromise"},h=`import React from 'react';
import { AlertDialogProvider, Box, Button, Flex, useAlertDialog } from '@editora/ui-react';

function PromiseActions() {
  const dialogs = useAlertDialog();
  const [result, setResult] = React.useState('No result yet');

  const runAlert = async () => {
    const next = await dialogs.alert({
      title: 'Maintenance complete',
      description: 'Your deployment finished successfully.',
      confirmText: 'Great',
      mode: 'queue'
    });
    setResult(JSON.stringify(next));
  };

  return (
    <Box>
      <Flex gap="10px" wrap="wrap">
        <Button onClick={runAlert}>Run Alert</Button>
      </Flex>
      <Box mt="14px">Result: {result}</Box>
    </Box>
  );
}

export function AlertDialogPromiseExample() {
  return (
    <AlertDialogProvider>
      <PromiseActions />
    </AlertDialogProvider>
  );
}`;function y(){const n=A(),[p,s]=P.useState("No result yet");return a(c,{children:[a(w,{gap:"10px",wrap:"wrap",children:[o(l,{onClick:async()=>{const e=await n.alert({title:"Maintenance complete",description:"Your deployment finished successfully.",confirmText:"Great",mode:"queue"});s(JSON.stringify(e))},children:"Run Alert"}),o(l,{variant:"secondary",onClick:async()=>{const e=await n.confirm({title:"Delete customer account?",description:"This cannot be undone and will remove all related records.",confirmText:"Delete",cancelText:"Keep",mode:"replace",onConfirm:async()=>{await new Promise(i=>setTimeout(i,700))}});s(JSON.stringify(e))},children:"Run Confirm"}),o(l,{variant:"ghost",onClick:async()=>{const e=new AbortController,i=window.setTimeout(()=>e.abort(),12e3),x=await n.prompt({title:"Rename workspace",description:"Use 3+ characters. This demonstrates validation + async confirm.",confirmText:"Save",cancelText:"Cancel",input:{label:"Workspace name",placeholder:"e.g. Northwind Ops",required:!0,validate:t=>t.trim().length<3?"Use at least 3 characters.":null},signal:e.signal,onConfirm:async({value:t})=>{if(await new Promise(f=>setTimeout(f,900)),(t==null?void 0:t.toLowerCase())==="error")throw new Error('"error" is reserved. Use another name.')}});window.clearTimeout(i),s(JSON.stringify(x))},children:"Run Prompt"})]}),a(c,{mt:"14px",children:["Result: ",p]})]})}const r=()=>o(g,{children:o(y,{})});r.parameters={docs:{source:{type:"code",code:h}}};var m,u,d;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`() => <AlertDialogProvider>
    <PromiseDemo />
  </AlertDialogProvider>`,...(d=(u=r.parameters)==null?void 0:u.docs)==null?void 0:d.source}}};const S=["PromiseAPI"];export{r as PromiseAPI,S as __namedExportsOrder,v as default};
