const ya=()=>({name:"bold",marks:{bold:{parseDOM:[{tag:"strong"},{tag:"b"},{style:"font-weight",getAttrs:e=>{const t=typeof e=="string"?e:e.style.fontWeight;return/^(bold(er)?|[5-9]\d{2,})$/.test(t)&&null}}],toDOM:()=>["strong",0]}},toolbar:[{label:"Bold",command:"toggleBold",icon:'<svg width="24" height="24" focusable="false"><path d="M7.8 19c-.3 0-.5 0-.6-.2l-.2-.5V5.7c0-.2 0-.4.2-.5l.6-.2h5c1.5 0 2.7.3 3.5 1 .7.6 1.1 1.4 1.1 2.5a3 3 0 0 1-.6 1.9c-.4.6-1 1-1.6 1.2.4.1.9.3 1.3.6s.8.7 1 1.2c.4.4.5 1 .5 1.6 0 1.3-.4 2.3-1.3 3-.8.7-2.1 1-3.8 1H7.8Zm5-8.3c.6 0 1.2-.1 1.6-.5.4-.3.6-.7.6-1.3 0-1.1-.8-1.7-2.3-1.7H9.3v3.5h3.4Zm.5 6c.7 0 1.3-.1 1.7-.4.4-.4.6-.9.6-1.5s-.2-1-.7-1.4c-.4-.3-1-.4-2-.4H9.4v3.8h4Z" fill-rule="evenodd"></path></svg>',shortcut:"Mod-b"}],commands:{toggleBold:()=>(document.execCommand("bold",!1),!0)},keymap:{"Mod-b":"toggleBold","Mod-B":"toggleBold"}}),Er=()=>(document.execCommand("italic",!1),!0),yo=(e,t)=>{var n;typeof window<"u"&&((n=window.registerEditorCommand)==null||n.call(window,e,t))},Hn=()=>{yo("toggleItalic",Er)};typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Hn):Hn());const xa=()=>({name:"italic",marks:{italic:{parseDOM:[{tag:"i"},{tag:"em"},{style:"font-style=italic"}],toDOM:()=>["em",0]}},toolbar:[{label:"Italic",command:"toggleItalic",type:"button",icon:'<svg width="24" height="24" focusable="false"><path d="M16.7 4.7l-.1.9h-.3c-.6 0-1 0-1.4.3-.3.3-.4.6-.5 1.1l-2.1 9.8v.6c0 .5.4.8 1.4.8h.2l-.2.8H8l.2-.8h.2c1.1 0 1.8-.5 2-1.5l2-9.8.1-.5c0-.6-.4-.8-1.4-.8h-.3l.2-.9h5.8Z" fill-rule="evenodd"></path></svg>',shortcut:"Mod-i"}],commands:{toggleItalic:Er},keymap:{"Mod-i":"toggleItalic","Mod-I":"toggleItalic"}}),wa=()=>({name:"underline",marks:{underline:{parseDOM:[{tag:"u"}],toDOM:()=>["u",{},0]}},toolbar:[{label:"Underline",command:"toggleUnderline",icon:'<svg width="24" height="24" focusable="false"><path d="M16 5c.6 0 1 .4 1 1v7c0 2.8-2.2 5-5 5s-5-2.2-5-5V6c0-.6.4-1 1-1s1 .4 1 1v7c0 1.7 1.3 3 3 3s3-1.3 3-3V6c0-.6.4-1 1-1ZM4 17h16c.6 0 1 .4 1 1s-.4 1-1 1H4a1 1 0 1 1 0-2Z" fill-rule="evenodd"></path></svg>',shortcut:"Mod-u"}],commands:{toggleUnderline:()=>(document.execCommand("underline",!1),!0)},keymap:{"Mod-u":"toggleUnderline","Mod-U":"toggleUnderline"}}),kr=()=>Tr("insertUnorderedList"),Cr=()=>Tr("insertOrderedList");function xo(){const e=window.getSelection();if(e&&e.rangeCount>0){const n=e.getRangeAt(0).startContainer,r=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement,o=r==null?void 0:r.closest('[contenteditable="true"], .rte-content, .editora-content');if(o)return o}const t=document.activeElement;return t?t.getAttribute("contenteditable")==="true"?t:t.closest('[contenteditable="true"], .rte-content, .editora-content'):null}function wo(e){e.querySelectorAll('ul:not([data-type="checklist"]), ol').forEach(n=>{Array.from(n.childNodes).forEach(o=>{if(o.nodeType===Node.TEXT_NODE){const l=(o.textContent||"").trim();if(!l){n.removeChild(o);return}const s=document.createElement("li");s.textContent=l,n.replaceChild(s,o);return}if(!(o instanceof HTMLElement)){n.removeChild(o);return}if(o.tagName==="LI")return;const i=document.createElement("li");for(;o.firstChild;)i.appendChild(o.firstChild);n.replaceChild(i,o)})})}function Tr(e){const t=xo();if(!t)return!1;const n=window.getSelection();if(!n||n.rangeCount===0)return!1;const r=n.getRangeAt(0);if(!t.contains(r.commonAncestorContainer))return!1;t.focus({preventScroll:!0});const o=document.execCommand(e,!1);return wo(t),t.dispatchEvent(new Event("input",{bubbles:!0})),o!==!1}const In=(e,t)=>{var n;typeof window<"u"&&((n=window.registerEditorCommand)==null||n.call(window,e,t))},Dn=()=>{In("toggleBulletList",kr),In("toggleOrderedList",Cr)};typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Dn):Dn());const Ea=()=>({name:"list",nodes:{bulletList:{content:"listItem+",group:"block",parseDOM:[{tag:"ul"}],toDOM:()=>["ul",0]},orderedList:{content:"listItem+",group:"block",parseDOM:[{tag:"ol"}],toDOM:()=>["ol",0]},listItem:{content:"paragraph",parseDOM:[{tag:"li"}],toDOM:()=>["li",0]}},toolbar:[{label:"Bullet List",command:"toggleBulletList",type:"button",icon:'<svg width="24" height="24" focusable="false"><path d="M11 5h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2ZM4.5 6c0 .4.1.8.4 1 .3.4.7.5 1.1.5.4 0 .8-.1 1-.4.4-.3.5-.7.5-1.1 0-.4-.1-.8-.4-1-.3-.4-.7-.5-1.1-.5-.4 0-.8.1-1 .4-.4.3-.5.7-.5 1.1Zm0 6c0 .4.1.8.4 1 .3.4.7.5 1.1.5.4 0 .8-.1 1-.4.4-.3.5-.7.5-1.1 0-.4-.1-.8-.4-1-.3-.4-.7-.5-1.1-.5-.4 0-.8.1-1 .4-.4.3-.5.7-.5 1.1Zm0 6c0 .4.1.8.4 1 .3.4.7.5 1.1.5.4 0 .8-.1 1-.4.4-.3.5-.7.5-1.1 0-.4-.1-.8-.4-1-.3-.4-.7-.5-1.1-.5-.4 0-.8.1-1 .4-.4.3-.5.7-.5 1.1Z" fill-rule="evenodd"></path></svg>',shortcut:"Mod-Shift-8"},{label:"Numbered List",command:"toggleOrderedList",type:"button",icon:'<svg width="24" height="24" focusable="false"><path d="M10 17h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 1 1 0-2ZM6 4v3.5c0 .3-.2.5-.5.5a.5.5 0 0 1-.5-.5V5h-.5a.5.5 0 0 1 0-1H6Zm-1 8.8l.2.2h1.3c.3 0 .5.2.5.5s-.2.5-.5.5H4.9a1 1 0 0 1-.9-1V13c0-.4.3-.8.6-1l1.2-.4.2-.3a.2.2 0 0 0 0-.2l-.7.3a.5.5 0 0 1-.7-.3.5.5 0 0 1 .3-.6l.7-.4c.5-.2 1.1 0 1.4.4.3.5.3 1.1-.1 1.5l-1.2.7Zm0 3.7v.5c0 .3.2.5.5.5h1c.3 0 .5.2.5.5s-.2.5-.5.5h-1a1.5 1.5 0 0 1-1.5-1.5v-.5c0-.3.1-.6.3-.8l1.3-1.4c.3-.4.1-.9-.2-1-.1 0-.2 0-.3.2l-.4.5a.5.5 0 0 1-.7.1.5.5 0 0 1-.1-.7l.4-.5c.5-.5 1.2-.6 1.8-.4.6.3 1 .9 1 1.6 0 .4-.2.8-.5 1.1l-1.3 1.4-.3.4Z" fill-rule="evenodd"></path></svg>',shortcut:"Mod-Shift-7"}],commands:{toggleBulletList:kr,toggleOrderedList:Cr},keymap:{"Mod-Shift-8":"toggleBulletList","Mod-Shift-7":"toggleOrderedList"}}),Lr=".rte-content, .editora-content",On=100,$n="__editoraCommandEditorRoot",Ie=new Map,jt={};let zn=!1,X=null;function Eo(e){if(!e)return null;const t=e.querySelector('[contenteditable="true"]');return t instanceof HTMLElement?t:null}function ko(){if(typeof window>"u")return null;const e=window[$n];if(!(e instanceof HTMLElement))return null;window[$n]=null;const t=e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(e.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?e:null);if(t){const r=Eo(t);if(r)return r;if(t.getAttribute("contenteditable")==="true")return t}if(e.getAttribute("contenteditable")==="true")return e;const n=e.closest('[contenteditable="true"]');return n instanceof HTMLElement?n:null}function Co(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function Ze(e){const t=Co(e);if(!t)return null;const n=t.closest(Lr);if(n)return n;const r=t.closest('[contenteditable="true"]');if(!r)return null;let o=r,i=o.parentElement;for(;i;)i.getAttribute("contenteditable")==="true"&&(o=i),i=i.parentElement;return o}function ht(){const e=ko();if(e&&document.contains(e))return e;const t=window.getSelection();if(t&&t.rangeCount>0){const i=Ze(t.getRangeAt(0).startContainer);if(i)return i}const n=document.activeElement;if(n){const i=Ze(n);if(i)return i}if(X!=null&&X.isConnected)return X;const r=Array.from(Ie.keys()).find(i=>i.isConnected);if(r)return r;const o=document.querySelector(Lr);return o||document.querySelector('[contenteditable="true"]')}function Ar(){for(const e of Ie.keys())e.isConnected||(Ie.delete(e),X===e&&(X=null))}function rn(e){Ar();let t=Ie.get(e);return t||(t={undoStack:[],redoStack:[]},Ie.set(e,t)),t}function De(e){e&&e.dispatchEvent(new Event("input",{bubbles:!0}))}function Bn(e){return e?e.innerHTML:""}function bt(e,t){if(!e)return;const n=rn(e);n.undoStack.push(t),n.redoStack.length=0,n.undoStack.length>On&&n.undoStack.splice(0,n.undoStack.length-On),X=e}function Sr(e,t="undo"){if(Ar(),e!=null&&e.isConnected)return e;const n=ht();if(n!=null&&n.isConnected)return n;if(X!=null&&X.isConnected)return X;const r=o=>t==="undo"?o.undoStack.length>0:o.redoStack.length>0;for(const[o,i]of Ie.entries())if(o.isConnected&&r(i))return o;return null}function Pn(e){const t={};for(const o of e.getAttributeNames()){const i=e.getAttribute(o);i!==null&&(t[o]=i)}const n=e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLSelectElement,r=e instanceof HTMLInputElement;return{attributes:t,innerHTML:e.innerHTML,value:n?e.value:null,checked:r?e.checked:null}}function Fn(e,t){const n=new Set(e.getAttributeNames());Object.keys(t.attributes).forEach(r=>n.delete(r)),n.forEach(r=>e.removeAttribute(r)),Object.entries(t.attributes).forEach(([r,o])=>{e.setAttribute(r,o)}),e.innerHTML!==t.innerHTML&&(e.innerHTML=t.innerHTML),t.value!==null&&(e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLSelectElement)&&(e.value=t.value),t.checked!==null&&e instanceof HTMLInputElement&&(e.checked=t.checked)}function ue(e,t){if(jt[e]=t,typeof window>"u")return;const n=window.registerEditorCommand;typeof n=="function"?n(e,t):(window.registerEditorCommand=(r,o)=>{jt[r]=o},window.registerEditorCommand(e,t))}const qn=(e,...t)=>{const n=jt[e];return n?n(...t):!1};function Zt(){zn||typeof window>"u"||(zn=!0,window.execEditorCommand||(window.execEditorCommand=qn),window.executeEditorCommand||(window.executeEditorCommand=qn),ue("undo",_r),ue("redo",Rr),ue("setAttribute",Nr),ue("setText",Hr),ue("autoFixA11y",Ir),ue("recordDomTransaction",Dr),ue("undoDom",on),ue("redoDom",an))}function Mr(e,t){const n=t||ht(),r=Bn(n);n==null||n.focus({preventScroll:!0});let o=!1;try{o=!!document.execCommand(e,!1)}catch{o=!1}const i=Bn(n),l=r!==i;return l&&De(n),{executed:o,changed:l}}const _r=()=>{const e=ht();return Mr("undo",e).changed?!0:on(e??void 0)},Rr=()=>{const e=ht();return Mr("redo",e).changed?!0:an(e??void 0)},Nr=(e,t,n)=>{if(!(e instanceof HTMLElement))return;const r=Ze(e),o=e.hasAttribute(t),i=e.getAttribute(t);e.setAttribute(t,n),bt(r,{undo:()=>{e.isConnected&&(o&&i!==null?e.setAttribute(t,i):e.removeAttribute(t))},redo:()=>{e.isConnected&&e.setAttribute(t,n)}}),De(r)},Hr=(e,t)=>{if(!(e instanceof HTMLElement))return;const n=Ze(e),r=e.textContent??"";e.textContent=t,bt(n,{undo:()=>{e.isConnected&&(e.textContent=r)},redo:()=>{e.isConnected&&(e.textContent=t)}}),De(n)},Ir=e=>{var l;const t=e==null?void 0:e.element;if(!(t instanceof HTMLElement))return;const n=Ze(t),r=(l=window.a11yRuleRegistry)==null?void 0:l.find(s=>s.id===e.rule);if(!r||typeof r.fix!="function")return;const o=Pn(t);r.fix(e);const i=Pn(t);bt(n,{undo:()=>{t.isConnected&&Fn(t,o)},redo:()=>{t.isConnected&&Fn(t,i)}}),De(n)},Dr=(e,t,n)=>{if(!(e instanceof HTMLElement))return!1;const r=typeof n=="string"?n:e.innerHTML;return t===r?!1:(bt(e,{undo:()=>{e.isConnected&&(e.innerHTML=t)},redo:()=>{e.isConnected&&(e.innerHTML=r)}}),!0)},on=e=>{const t=Sr(e,"undo");if(!t)return!1;const n=rn(t),r=n.undoStack.pop();return r?(r.undo(),n.redoStack.push(r),X=t,De(t),!0):!1},an=e=>{const t=Sr(e,"redo");if(!t)return!1;const n=rn(t),r=n.redoStack.pop();return r?(r.redo(),n.undoStack.push(r),X=t,De(t),!0):!1};typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Zt,{once:!0}):Zt());const ka=()=>(Zt(),{name:"history",toolbar:[{label:"Undo",command:"undo",type:"button",icon:'<svg width="24" height="24" focusable="false"><path d="M6.4 8H12c3.7 0 6.2 2 6.8 5.1.6 2.7-.4 5.6-2.3 6.8a1 1 0 0 1-1-1.8c1.1-.6 1.8-2.7 1.4-4.6-.5-2.1-2.1-3.5-4.9-3.5H6.4l3.3 3.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 1.4L6.4 8Z" fill-rule="nonzero"></path></svg>',shortcut:"Mod-z"},{label:"Redo",command:"redo",type:"button",icon:'<svg width="24" height="24" focusable="false"><path d="M17.6 10H12c-2.8 0-4.4 1.4-4.9 3.5-.4 2 .3 4 1.4 4.6a1 1 0 1 1-1 1.8c-2-1.2-2.9-4.1-2.3-6.8.6-3 3-5.1 6.8-5.1h5.6l-3.3-3.3a1 1 0 1 1 1.4-1.4l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4l3.3-3.3Z" fill-rule="nonzero"></path></svg>',shortcut:"Mod-y"}],commands:{undo:_r,redo:Rr,setAttribute:Nr,setText:Hr,autoFixA11y:Ir,recordDomTransaction:Dr,undoDom:on,redoDom:an},keymap:{"Mod-z":"undo","Mod-Z":"undo","Mod-y":"redo","Mod-Y":"redo","Mod-Shift-z":"redo","Mod-Shift-Z":"redo"}});let ce=null,ut=!1,Q=null;const nt='[data-theme="dark"], .dark, .editora-theme-dark',To=e=>{if(!e)return null;let t=e;for(;t;){if(t.hasAttribute("contenteditable")&&t.getAttribute("contenteditable")==="true"||t.hasAttribute("data-editora-content"))return t;t=t.parentElement}return null},Lo=e=>{if(e){const n=e.startContainer,r=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement;if(r!=null&&r.closest(nt))return!0}const t=document.activeElement;return t!=null&&t.closest(nt)?!0:document.body.matches(nt)||document.documentElement.matches(nt)},Ao=()=>{if(document.getElementById("rte-link-dialog-theme-styles"))return;const e=document.createElement("style");e.id="rte-link-dialog-theme-styles",e.textContent=`
    .link-dialog-overlay.rte-theme-dark .link-dialog {
      background: #1f2937 !important;
      border: 1px solid #4b5563 !important;
      color: #e2e8f0 !important;
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.6) !important;
    }

    .link-dialog-overlay.rte-theme-dark .link-dialog-header {
      border-bottom-color: #3b4657 !important;
      background: #222d3a !important;
    }

    .link-dialog-overlay.rte-theme-dark .link-dialog-header h3,
    .link-dialog-overlay.rte-theme-dark label {
      color: #e2e8f0 !important;
    }

    .link-dialog-overlay.rte-theme-dark .link-dialog-close {
      color: #94a3b8 !important;
    }

    .link-dialog-overlay.rte-theme-dark .link-dialog-close:hover {
      background: #334155 !important;
      color: #f8fafc !important;
      border-radius: 4px;
    }

    .link-dialog-overlay.rte-theme-dark .link-dialog-footer {
      border-top-color: #3b4657 !important;
      background: #222d3a !important;
    }

    .link-dialog-overlay.rte-theme-dark input[type='text'],
    .link-dialog-overlay.rte-theme-dark input[type='url'] {
      background: #111827 !important;
      border-color: #4b5563 !important;
      color: #e2e8f0 !important;
    }

    .link-dialog-overlay.rte-theme-dark input[type='text']::placeholder,
    .link-dialog-overlay.rte-theme-dark input[type='url']::placeholder {
      color: #94a3b8 !important;
    }

    .link-dialog-overlay.rte-theme-dark .btn-cancel {
      background: #334155 !important;
      border-color: #4b5563 !important;
      color: #e2e8f0 !important;
    }

    .link-dialog-overlay.rte-theme-dark .btn-cancel:hover {
      background: #475569 !important;
      border-color: #64748b !important;
    }

    .link-dialog-overlay.rte-theme-dark .btn-submit {
      background: #3b82f6 !important;
    }

    .link-dialog-overlay.rte-theme-dark .btn-submit:hover {
      background: #2563eb !important;
    }
  `,document.head.appendChild(e)},So=e=>{if(!ce){console.warn("No selection range stored");return}const t=ce.startContainer,n=t.nodeType===Node.TEXT_NODE?t.parentElement:t,r=To(n);if(r){if(ut&&Q){Q.href=e.url,Q.textContent=e.text,Q.target=e.target,e.target==="_blank"?Q.setAttribute("rel","noopener noreferrer"):Q.removeAttribute("rel"),e.title?Q.title=e.title:Q.removeAttribute("title");const o=document.createRange();o.selectNodeContents(Q);const i=window.getSelection();i&&(i.removeAllRanges(),i.addRange(o))}else{const o=document.createElement("a");o.href=e.url,o.textContent=e.text,o.target=e.target,e.target==="_blank"&&o.setAttribute("rel","noopener noreferrer"),e.title&&(o.title=e.title),ce.deleteContents(),ce.insertNode(o),ce.setStartAfter(o),ce.setEndAfter(o);const i=window.getSelection();i&&(i.removeAllRanges(),i.addRange(ce))}r.focus(),ce=null,ut=!1,Q=null}},Un=(e,t)=>{Ao();const n=document.createElement("div");n.className="link-dialog-overlay",t&&n.classList.add("rte-theme-dark"),n.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;const r=document.createElement("div");r.className="link-dialog",r.style.cssText=`
    background: white;
    border-radius: 8px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  `,r.innerHTML=`
    <div class="link-dialog-header" style="padding: 16px 20px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
      <h3 style="margin: 0; font-size: 18px;">${e.isEditing?"Edit Link":"Insert Link"}</h3>
      <button class="link-dialog-close" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px;">×</button>
    </div>
    <form id="link-form">
      <div class="link-dialog-body" style="padding: 20px;">
        <div class="form-group" style="margin-bottom: 16px;">
          <label for="link-text" style="display: block; margin-bottom: 6px; font-weight: 500;">Link Text:</label>
          <input
            id="link-text"
            type="text"
            value="${e.text||""}"
            placeholder="Enter link text"
            style="width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; line-height: 1.45; box-sizing: border-box;"
          />
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label for="link-url" style="display: block; margin-bottom: 6px; font-weight: 500;">URL:</label>
          <input
            id="link-url"
            type="url"
            value="${e.url||""}"
            placeholder="https://example.com"
            required
            style="width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; line-height: 1.45; box-sizing: border-box;"
          />
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label for="link-title" style="display: block; margin-bottom: 6px; font-weight: 500;">Title (optional):</label>
          <input
            id="link-title"
            type="text"
            value="${e.title||""}"
            placeholder="Link tooltip text"
            style="width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; line-height: 1.45; box-sizing: border-box;"
          />
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label style="display: flex; align-items: center; cursor: pointer;">
            <input
              id="link-target"
              type="checkbox"
              ${e.target==="_blank"?"checked":""}
              style="margin-right: 8px;"
            />
            Open in new window/tab
          </label>
        </div>
      </div>
      <div class="link-dialog-footer" style="padding: 12px 20px; border-top: 1px solid #ddd; display: flex; justify-content: flex-end; gap: 10px;">
        <button type="button" class="btn-cancel" style="padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer;">Cancel</button>
        <button type="submit" class="btn-submit" style="padding: 8px 16px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer;">
          ${e.isEditing?"Update Link":"Insert Link"}
        </button>
      </div>
    </form>
  `,n.appendChild(r),document.body.appendChild(n);const o=r.querySelector("#link-form"),i=r.querySelector("#link-text"),l=r.querySelector("#link-url"),s=r.querySelector("#link-title"),c=r.querySelector("#link-target"),u=r.querySelector(".link-dialog-close"),h=r.querySelector(".btn-cancel"),g=f=>{f.key==="Escape"&&(f.preventDefault(),f.stopPropagation(),m())},m=()=>{document.removeEventListener("keydown",g,!0),n.remove()};u.addEventListener("click",m),h.addEventListener("click",m),n.addEventListener("click",f=>{f.target===n&&m()}),document.addEventListener("keydown",g,!0),o.addEventListener("submit",f=>{f.preventDefault();const C=l.value.trim();C&&(So({text:i.value.trim()||C,url:C,target:c.checked?"_blank":"_self",title:s.value.trim()||void 0}),m())}),setTimeout(()=>i.focus(),100)},Or=()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return!1;const t=e.getRangeAt(0).cloneRange();ce=t;const n=Lo(t),r=e.toString()||"",o=t.startContainer,i=o.nodeType===Node.TEXT_NODE?o.parentElement:o,l=i==null?void 0:i.closest("a");return l?(ut=!0,Q=l,Un({text:l.textContent||"",url:l.href,target:l.target||"_self",title:l.title||"",isEditing:!0},n)):(ut=!1,Q=null,Un({text:r,url:"",target:"_self",isEditing:!1},n)),!0},$r=()=>(document.execCommand("unlink",!1),!0),Dt=(e,t)=>{var n;typeof window<"u"&&((n=window.registerEditorCommand)==null||n.call(window,e,t))},Vn=()=>{Dt("openLinkDialog",Or),Dt("removeLink",$r),Dt("createLink",e=>{e&&document.execCommand("createLink",!1,e)})};typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Vn):Vn());const Ca=()=>({name:"link",marks:{link:{attrs:{href:{},title:{default:null},target:{default:null}},parseDOM:[{tag:"a[href]",getAttrs:e=>({href:e.getAttribute("href"),title:e.getAttribute("title"),target:e.getAttribute("target")})}],toDOM:e=>["a",{href:e.attrs.href,title:e.attrs.title,target:e.attrs.target,rel:e.attrs.target==="_blank"?"noopener noreferrer":null},0]}},toolbar:[{label:"Link",command:"openLinkDialog",type:"button",icon:'<svg width="24" height="24" focusable="false"><path d="M6.2 12.3a1 1 0 0 1 1.4 1.4l-2 2a2 2 0 1 0 2.6 2.8l4.8-4.8a1 1 0 0 0 0-1.4 1 1 0 1 1 1.4-1.3 2.9 2.9 0 0 1 0 4L9.6 20a3.9 3.9 0 0 1-5.5-5.5l2-2Zm11.6-.6a1 1 0 0 1-1.4-1.4l2-2a2 2 0 1 0-2.6-2.8L11 10.3a1 1 0 0 0 0 1.4A1 1 0 1 1 9.6 13a2.9 2.9 0 0 1 0-4L14.4 4a3.9 3.9 0 0 1 5.5 5.5l-2 2Z" fill-rule="nonzero"></path></svg>',shortcut:"Mod-k"}],commands:{openLinkDialog:Or,removeLink:$r},keymap:{"Mod-k":"openLinkDialog"}});function Mo(){const e=window.getSelection();if(!e||!e.rangeCount)return null;const n=e.getRangeAt(0).startContainer,r=n.nodeType===Node.TEXT_NODE?n.parentElement:n;return _o(r)}function _o(e){if(!e)return null;if(e.hasAttribute("data-editora-editor"))return e;let t=e.parentElement;for(;t;){if(t.hasAttribute("data-editora-editor"))return t;t=t.parentElement}return null}function Ro(e){return e?e.querySelector(".rte-content"):(console.warn("[Editora] Editor container not found"),null)}let H=null,$=null,Wn=null,Gn=null,jn=null,Zn=null,Xn=null;const Ot='[data-theme="dark"], .dark, .editora-theme-dark';let Ge=!1,Pe=null,Kn=0,Yn=0,$t=!1,Qn=0,Jn=0,er=0,tr=0;const No=()=>{const e=Mo(),t=Ro(e);if(!t)return alert("Please place your cursor in the editor before inserting a table"),!1;const n=window.getSelection();if(!n||n.rangeCount===0)return;const r=n.getRangeAt(0),o=document.createElement("table");o.className="rte-table";const i=document.createElement("thead"),l=document.createElement("tr");for(let u=0;u<3;u++){const h=document.createElement("th"),g=document.createElement("p");g.appendChild(document.createElement("br")),h.appendChild(g),l.appendChild(h)}i.appendChild(l);const s=document.createElement("tbody");for(let u=0;u<2;u++){const h=document.createElement("tr");for(let g=0;g<3;g++){const m=document.createElement("td"),f=document.createElement("p");f.appendChild(document.createElement("br")),m.appendChild(f),h.appendChild(m)}s.appendChild(h)}o.appendChild(i),o.appendChild(s),r.deleteContents(),r.insertNode(o);const c=o.querySelector("th p");if(c){const u=document.createRange();u.setStart(c,0),u.collapse(!0),n.removeAllRanges(),n.addRange(u)}t.focus()},Ho=()=>{var l;const e=ne();if(!e)return;const{table:t,rowIndex:n}=e,r=document.createElement("tr"),o=((l=t.rows[0])==null?void 0:l.cells.length)||0;for(let s=0;s<o;s++){const c=document.createElement("td"),u=document.createElement("p");u.innerHTML="<br>",c.appendChild(u),r.appendChild(c)}const i=t.rows[n];i&&i.parentElement?i.parentElement.insertBefore(r,i):t.appendChild(r),de()},ln=()=>{var i;const e=ne();if(!e)return;const{table:t,rowIndex:n}=e,r=document.createElement("tr"),o=((i=t.rows[0])==null?void 0:i.cells.length)||0;for(let l=0;l<o;l++){const s=document.createElement("td"),c=document.createElement("p");c.innerHTML="<br>",s.appendChild(c),r.appendChild(s)}n>=t.rows.length-1?t.appendChild(r):t.insertBefore(r,t.rows[n+1]),de()},Io=()=>{const e=ne();if(!e)return;const{table:t,colIndex:n}=e;for(let r=0;r<t.rows.length;r++){const o=t.rows[r],i=document.createElement("td"),l=document.createElement("p");l.innerHTML="<br>",i.appendChild(l),n===0?o.insertBefore(i,o.cells[0]):o.insertBefore(i,o.cells[n])}de()},sn=()=>{const e=ne();if(!e)return;const{table:t,colIndex:n}=e;for(let r=0;r<t.rows.length;r++){const o=t.rows[r],i=document.createElement("td"),l=document.createElement("p");l.innerHTML="<br>",i.appendChild(l),n>=o.cells.length-1?o.appendChild(i):o.insertBefore(i,o.cells[n+1])}de()},Do=()=>{const e=ne();if(!e||e.rowCount<=1)return;const{table:t,rowIndex:n}=e;t.deleteRow(n),de()},Oo=()=>{const e=ne();if(!e||e.cellCount<=1)return;const{table:t,colIndex:n}=e;for(let r=0;r<t.rows.length;r++){const o=t.rows[r];o.cells[n]&&o.deleteCell(n)}de()},$o=()=>{var i;const e=ne();if(!e)return;const{table:t,rowIndex:n}=e,r=t.rows[n];if(((i=r.parentElement)==null?void 0:i.tagName.toLowerCase())==="thead"){const l=t.querySelector("tbody")||t.appendChild(document.createElement("tbody")),s=t.querySelector("thead");s&&(l.insertBefore(r,l.firstChild),s.rows.length===0&&s.remove())}else{let l=t.querySelector("thead");l||(l=document.createElement("thead"),t.insertBefore(l,t.firstChild)),l.appendChild(r)}de()},zo=()=>{var r;const e=ne();if(!e)return;const{table:t,colIndex:n}=e;for(let o=0;o<t.rows.length;o++){const i=t.rows[o].cells[n];if(i){const l=i.tagName.toLowerCase()==="th"?"td":"th",s=document.createElement(l);s.innerHTML=i.innerHTML;for(let c=0;c<i.attributes.length;c++){const u=i.attributes[c];s.setAttribute(u.name,u.value)}(r=i.parentNode)==null||r.replaceChild(s,i)}}de()},Bo=()=>{const e=ne();if(!e)return;e.table.remove(),document.dispatchEvent(new CustomEvent("tableDeleted"))},Po=()=>{var g,m;const e=window.getSelection();if(!e||e.rangeCount===0)return;const n=e.getRangeAt(0).startContainer;if(!(n.nodeType===Node.TEXT_NODE?(g=n.parentElement)==null?void 0:g.closest("table"):n.closest("table")))return;let o=null;if(n.nodeType===Node.TEXT_NODE?o=(m=n.parentElement)==null?void 0:m.closest("td, th"):n.nodeType===Node.ELEMENT_NODE&&(o=n.closest("td, th")),!o)return;const i=o.parentElement;if(!i)return;let l=-1;for(let f=0;f<i.cells.length;f++)if(i.cells[f]===o){l=f;break}if(l===-1||l===i.cells.length-1)return;const s=i.cells[l+1];if(!s)return;const c=parseInt(o.getAttribute("colspan")||"1"),u=parseInt(s.getAttribute("colspan")||"1");o.setAttribute("colspan",String(c+u)),Array.from(s.childNodes).forEach(f=>{o.appendChild(f)}),s.remove(),de()};function ne(){var c,u,h;const e=window.getSelection();if(!e||e.rangeCount===0)return null;const n=e.getRangeAt(0).startContainer;let r=n.nodeType===Node.TEXT_NODE?(c=n.parentElement)==null?void 0:c.closest("table"):n.closest("table");if(!r)return null;const o=r;let i=0,l=0;const s=n.nodeType===Node.TEXT_NODE?(u=n.parentElement)==null?void 0:u.closest("td, th"):n.closest("td, th");if(s){let g=s.parentElement;for(;g&&g!==o.rows[i]&&(i++,!(i>=o.rows.length)););const m=g;if(m){for(let f=0;f<m.cells.length;f++)if(m.cells[f]===s){l=f;break}}}return{table:o,rowIndex:i,colIndex:l,rowCount:o.rows.length,cellCount:((h=o.rows[0])==null?void 0:h.cells.length)||0}}function de(){if(!H||!$)return;const e=ne();if(!e)return;const t=e.rowCount>1,n=e.cellCount>1;zr(t,n)}function Fo(){Wn=()=>{const e=ne();e?qo(e.table):zt()},Gn=e=>{const t=e.target,n=t.closest("table"),r=t.closest(".table-toolbar");!n&&!r&&zt()},jn=()=>{zt()},Zn=()=>{$&&H&&H.style.display!=="none"&&Xt($)},Xn=()=>{$&&H&&H.style.display!=="none"&&Xt($)},document.addEventListener("selectionchange",Wn),document.addEventListener("mousedown",Gn),document.addEventListener("tableDeleted",jn),window.addEventListener("scroll",Zn,!0),window.addEventListener("resize",Xn)}function Xt(e){if(!H)return;const t=e.getBoundingClientRect(),n=H.getBoundingClientRect(),r=n.height||40,o=n.width||280,i=10;let l=t.top-r-i,s=t.left+t.width/2-o/2;l<i&&(l=t.bottom+i),s<i&&(s=i);const c=window.innerWidth;s+o>c-i&&(s=c-o-i);const u=window.innerHeight;l+r>u-i&&(l=u-r-i),H.style.top=l+"px",H.style.left=s+"px"}function qo(e){$=e,H||(H=Uo(),document.body.appendChild(H));const t=!!e.closest(Ot)||document.body.matches(Ot)||document.documentElement.matches(Ot);H.classList.toggle("rte-theme-dark",t),H.style.display="flex",H.style.visibility="hidden",requestAnimationFrame(()=>{Xt(e),H&&(H.style.visibility="visible")});const n=ne();n&&zr(n.rowCount>1,n.cellCount>1),Wo(e)}function zt(){if(H&&(H.style.display="none"),$){$.querySelectorAll(".resize-handle").forEach(n=>n.remove());const t=$.querySelector(".table-resize-handle");t&&t.remove()}$=null}function zr(e,t){if(!H)return;const n=H.querySelector('[data-action="deleteRow"]'),r=H.querySelector('[data-action="deleteColumn"]');n&&(n.disabled=!e),r&&(r.disabled=!t)}function Uo(){const e=document.createElement("div");e.className="table-toolbar",e.style.cssText=`
    position: fixed;
    z-index: 1000;
    display: none;
  `,e.setAttribute("role","toolbar"),e.setAttribute("aria-label","Table editing toolbar");const t=h=>{const g=document.createElement("button");return g.className="toolbar-icon-btn",h.danger&&g.classList.add("toolbar-icon-btn-danger"),h.delete&&g.classList.add("toolbar-icon-btn-delete"),g.innerHTML=h.icon,g.title=h.title,g.setAttribute("aria-label",h.title),g.setAttribute("type","button"),g.setAttribute("data-action",h.action),g.onclick=()=>Vo(h.action),g},n=()=>{const h=document.createElement("div");return h.className="toolbar-divider",h},r=(...h)=>{const g=document.createElement("div");return g.className="toolbar-section",h.forEach(m=>g.appendChild(m)),g},o=r(t({icon:Zo(),title:"Add row above (Ctrl+Shift+R)",action:"addRowAbove"}),t({icon:Xo(),title:"Add row below",action:"addRowBelow"}),t({icon:Ko(),title:"Delete row",action:"deleteRow",danger:!0})),i=r(t({icon:Yo(),title:"Add column left",action:"addColumnLeft"}),t({icon:Qo(),title:"Add column right (Ctrl+Shift+C)",action:"addColumnRight"}),t({icon:Jo(),title:"Delete column",action:"deleteColumn",danger:!0})),l=r(t({icon:ei(),title:"Toggle header row",action:"toggleHeaderRow"}),t({icon:ti(),title:"Toggle header column",action:"toggleHeaderColumn"})),s=r(t({icon:ri(),title:"Merge cells (horizontally)",action:"mergeCells"})),c=r(t({icon:ni(),title:"Delete table",action:"deleteTable",delete:!0}));e.appendChild(o),e.appendChild(n()),e.appendChild(i),e.appendChild(n()),e.appendChild(l),e.appendChild(n()),e.appendChild(s),e.appendChild(n()),e.appendChild(c);const u=h=>{!H||H.style.display==="none"||(h.ctrlKey||h.metaKey)&&h.shiftKey&&(h.key==="r"||h.key==="R"?(h.preventDefault(),ln()):(h.key==="c"||h.key==="C")&&(h.preventDefault(),sn()))};return window.addEventListener("keydown",u),e}function Vo(e){switch(e){case"addRowAbove":Ho();break;case"addRowBelow":ln();break;case"addColumnLeft":Io();break;case"addColumnRight":sn();break;case"deleteRow":Do();break;case"deleteColumn":Oo();break;case"toggleHeaderRow":$o();break;case"toggleHeaderColumn":zo();break;case"deleteTable":Bo();break;case"mergeCells":Po();break}}function Wo(e){e.querySelectorAll(".resize-handle").forEach(l=>l.remove());const n=e.querySelector(".table-resize-handle");n&&n.remove();const r=e.querySelector("thead tr, tbody tr:first-child");if(!r)return;const o=r.querySelectorAll("td, th");o.forEach((l,s)=>{if(s===o.length-1)return;const c=document.createElement("div");c.className="resize-handle",c.style.cssText=`
      position: absolute;
      right: -4px;
      top: 0;
      bottom: 0;
      width: 8px;
      background: transparent;
      cursor: col-resize;
      z-index: 10;
      transition: background 0.15s ease;
    `,c.addEventListener("mouseenter",()=>{Ge||(c.style.background="rgba(0, 102, 204, 0.3)")}),c.addEventListener("mouseleave",()=>{Ge||(c.style.background="transparent")}),c.addEventListener("mousedown",u=>{u.preventDefault(),u.stopPropagation(),Go(u,s)}),l.style.position="relative",l.appendChild(c)});const i=document.createElement("div");i.className="table-resize-handle",i.addEventListener("mousedown",l=>{l.preventDefault(),l.stopPropagation(),jo(l)}),e.appendChild(i)}function Go(e,t){if(Ge=!0,Pe=t,Kn=e.clientX,!$)return;const n=$.querySelector("thead tr, tbody tr:first-child");n&&n.cells[t]&&(Yn=n.cells[t].offsetWidth),document.body.style.cursor="col-resize",document.body.style.userSelect="none";const r=i=>{if(!Ge||Pe===null||!$)return;const l=i.clientX-Kn,s=Math.max(50,Yn+l);$.querySelectorAll("tr").forEach(u=>{u.cells[Pe]&&(u.cells[Pe].style.width=s+"px")})},o=()=>{Ge=!1,Pe=null,document.body.style.cursor="",document.body.style.userSelect="",document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",o)};document.addEventListener("mousemove",r),document.addEventListener("mouseup",o)}function jo(e){if(!$)return;$t=!0,Qn=e.clientX,Jn=e.clientY,er=$.offsetWidth,tr=$.offsetHeight,document.body.style.cursor="nwse-resize",document.body.style.userSelect="none";const t=r=>{if(!$t||!$)return;const o=r.clientX-Qn,i=r.clientY-Jn,l=Math.max(200,er+o),s=Math.max(100,tr+i);$.style.width=l+"px",$.style.height=s+"px"},n=()=>{$t=!1,document.body.style.cursor="",document.body.style.userSelect="",document.removeEventListener("mousemove",t),document.removeEventListener("mouseup",n)};document.addEventListener("mousemove",t),document.addEventListener("mouseup",n)}function Zo(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 7h12V5H2v2zm0 4h12V9H2v2zM8 1v3H5v2h3v3h2V6h3V4h-3V1H8z"/>
  </svg>`}function Xo(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 3h12V1H2v2zm0 4h12V5H2v2zm6 4v3h3v-2h2v-2h-2v-3h-2v3H5v2h3z"/>
  </svg>`}function Ko(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 5h12v2H2V5zm0 4h12v2H2V9zm4-6v2H4v2h2v2h2V7h2V5H8V3H6z"/>
  </svg>`}function Yo(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M7 2v12h2V2H7zm4 0v12h2V2h-2zM1 8h3v-3H1v3zm3 2H1v3h3v-3z"/>
  </svg>`}function Qo(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2v12h2V2H2zm4 0v12h2V2H6zM12 8h3v-3h-3v3zm0 2h3v3h-3v-3z"/>
  </svg>`}function Jo(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5 2v12h2V2H5zm4 0v12h2V2H9zm3 2h3V1h-3v3zm3 2h-3v3h3V6zm0 4h-3v3h3v-3z"/>
  </svg>`}function ei(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2h12v3H2V2zm0 5h12v8H2V7zm2 2v4h2V9H4zm4 0v4h2V9H8zm4 0v4h2V9h-2z"/>
  </svg>`}function ti(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2v12h3V2H2zm5 0v12h8V2H7zm2 2h4v2H9V4zm0 4h4v2H9V8zm0 4h4v2H9v-2z"/>
  </svg>`}function ni(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 1h10v1H3V1zm1 2v11h8V3H4zM6 5h1v6H6V5zm3 0h1v6H9V5z"/>
  </svg>`}function ri(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2h4v3H2V2zm5 0h4v3H7V2zm5 0h2v3h-2V2zm-10 4h4v3H2V6zm5 0h4v3H7V6zm5 0h2v3h-2V6zm-10 4h4v3H2v-3zm5 0h4v3H7v-3zm5 0h2v3h-2v-3z"/>
  </svg>`}if(typeof window<"u"&&!window.__tablePluginInitialized){window.__tablePluginInitialized=!0;const e=()=>{Fo()};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):setTimeout(e,100)}const Ta=()=>({name:"table",toolbar:[{label:"Insert Table",command:"insertTable",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18M3 15h18M9 4v16M15 4v16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'}],commands:{insertTable:()=>(No(),!0)},keymap:{"Mod-Shift-r":()=>(ln(),!0),"Mod-Shift-c":()=>(sn(),!0)}}),oi="p,div,li,ul,ol,table,thead,tbody,tfoot,tr,td,th,h1,h2,h3,h4,h5,h6,blockquote,pre";function ii(e){return!!e.cloneContents().querySelector(oi)}function Br(e,t){var r;const n=(e==null?void 0:e.nodeType)===Node.ELEMENT_NODE?e:(e==null?void 0:e.parentElement)??null;return(n==null?void 0:n.closest('[contenteditable="true"]'))||((r=t())==null?void 0:r.querySelector('[contenteditable="true"]'))||document.querySelector('[contenteditable="true"]')}function nr(e,t){const n=Br(e,t);n&&n.dispatchEvent(new Event("input",{bubbles:!0}))}function ai(e,t){let r=e.startContainer.nodeType===Node.TEXT_NODE?e.startContainer.parentElement:e.startContainer;for(;r&&r!==document.body;){if(r.classList.contains(t)){const o=document.createRange();if(o.selectNodeContents(r),o.compareBoundaryPoints(Range.START_TO_START,e)<=0&&o.compareBoundaryPoints(Range.END_TO_END,e)>=0)return r}r=r.parentElement}return null}function li(e){try{if(e.savedRange){const l=window.getSelection();l&&(l.removeAllRanges(),l.addRange(e.savedRange.cloneRange()))}const t=window.getSelection();if(!t||t.rangeCount===0||t.isCollapsed)return!1;const n=t.getRangeAt(0);if(n.collapsed)return!1;const r=ai(n,e.className);if(r)return e.styleProperty==="backgroundColor"?r.style.backgroundColor=e.color:r.style.color=e.color,nr(r,e.getActiveEditorRoot),!0;const o=Br(n.commonAncestorContainer,e.getActiveEditorRoot);o==null||o.focus({preventScroll:!0});try{document.execCommand("styleWithCSS",!1,"true")}catch{}let i=!1;if(e.commands.forEach(l=>{i||(i=document.execCommand(l,!1,e.color))}),!i&&!ii(n)){const l=document.createElement("span");e.styleProperty==="backgroundColor"?l.style.backgroundColor=e.color:l.style.color=e.color,l.className=e.className;const s=n.extractContents();l.appendChild(s),n.insertNode(l),n.setStartAfter(l),n.collapse(!0),t.removeAllRanges(),t.addRange(n),i=!0}return i?(nr(n.commonAncestorContainer,e.getActiveEditorRoot),!0):(e.warnMessage&&console.warn(e.warnMessage),!1)}catch(t){return e.warnMessage?console.error(e.warnMessage,t):console.error("[ColorApply] Failed to apply color",t),!1}}function si({popover:e,anchor:t,onClose:n,gap:r=6,margin:o=8,zIndex:i=1e4}){e.style.position="fixed",e.style.zIndex=`${i}`,e.style.visibility="hidden";const l=()=>{if(!e.isConnected||!t.isConnected){n();return}const m=t.getBoundingClientRect();if(m.width===0&&m.height===0){n();return}const f=e.getBoundingClientRect(),C=f.width||e.offsetWidth||220,k=f.height||e.offsetHeight||260,b=window.innerWidth,w=window.innerHeight;let x=m.left,L=m.bottom+r;if(x+C>b-o&&(x=b-C-o),x=Math.max(o,x),L+k>w-o){const E=m.top-k-r;E>=o?L=E:L=Math.max(o,w-k-o)}L<o&&(L=o),e.style.left=`${Math.round(x)}px`,e.style.top=`${Math.round(L)}px`,e.style.visibility="visible"},s=()=>{l()},c=m=>{const f=m.target;f&&(e.contains(f)||t.contains(f)||n())},u=m=>{m.key==="Escape"&&n()};window.addEventListener("resize",s),window.addEventListener("scroll",s,!0),document.addEventListener("keydown",u);const h=window.requestAnimationFrame(()=>{document.addEventListener("mousedown",c,!0)});return l(),{reposition:l,destroy:()=>{window.cancelAnimationFrame(h),window.removeEventListener("resize",s),window.removeEventListener("scroll",s,!0),document.removeEventListener("keydown",u),document.removeEventListener("mousedown",c,!0)}}}let R=null,ke=null,cn=null,J="#000000";const Fe='[data-theme="dark"], .dark, .editora-theme-dark',ci=["#000000","#ffffff","#808080","#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ffa500","#800080","#ffc0cb"];function Pr(){const e=window.getSelection();if(e&&e.rangeCount>0){const r=e.getRangeAt(0).startContainer,o=r.nodeType===Node.ELEMENT_NODE?r:r.parentElement;if(o){const i=o.closest('[data-editora-editor="true"], .rte-editor, .editora-editor');if(i)return i}}const t=document.activeElement;return t?t.closest('[data-editora-editor="true"], .rte-editor, .editora-editor'):null}function di(e){const t=window.__editoraLastCommand,n=window.__editoraLastCommandButton;if(t===e&&n&&n.isConnected){const l=window.getComputedStyle(n),s=n.getBoundingClientRect();if(l.display!=="none"&&l.visibility!=="hidden"&&l.pointerEvents!=="none"&&!(s.width===0&&s.height===0))return n}const r=l=>{for(const s of l){const c=window.getComputedStyle(s),u=s.getBoundingClientRect();if(!(c.display==="none"||c.visibility==="hidden"||c.pointerEvents==="none")&&!(u.width===0&&u.height===0))return s}return null},o=Pr();if(o){const l=Array.from(o.querySelectorAll(`[data-command="${e}"]`)),s=r(l);if(s)return s}const i=Array.from(document.querySelectorAll(`[data-command="${e}"]`));return r(i)}function ui(e){if(e!=null&&e.closest(Fe))return!0;const t=window.getSelection();if(t&&t.rangeCount>0){const r=t.getRangeAt(0).startContainer,o=r.nodeType===Node.ELEMENT_NODE?r:r.parentElement;if(o!=null&&o.closest(Fe))return!0}const n=document.activeElement;return n!=null&&n.closest(Fe)?!0:document.body.matches(Fe)||document.documentElement.matches(Fe)}function st(e){return li({color:e,className:"rte-text-color",styleProperty:"color",commands:["foreColor"],savedRange:cn,getActiveEditorRoot:Pr,warnMessage:"[TextColor] Could not apply color for current selection"})}function mi(){const e=window.getSelection();if(!e||e.rangeCount===0)return"#000000";let n=e.getRangeAt(0).startContainer;for(;n&&n!==document.body;){if(n.nodeType===Node.ELEMENT_NODE){const r=n,o=r.style.color||window.getComputedStyle(r).color;if(o&&o!=="rgb(0, 0, 0)")return fi(o)}n=n.parentNode}return"#000000"}function fi(e){if(e.startsWith("#"))return e;const t=e.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);if(!t)return"#000000";const n=parseInt(t[1]),r=parseInt(t[2]),o=parseInt(t[3]);return"#"+[n,r,o].map(i=>{const l=i.toString(16);return l.length===1?"0"+l:l}).join("")}function pi(e){const t=window.getSelection();t&&t.rangeCount>0&&(cn=t.getRangeAt(0).cloneRange()),J=mi(),R=document.createElement("div"),R.className="rte-inline-color-picker",ui(e)&&R.classList.add("rte-theme-dark"),R.addEventListener("click",n=>n.stopPropagation()),R.innerHTML=`
    <div class="rte-color-picker-header">
      <span class="rte-color-picker-title">Text Color</span>
      <button class="rte-color-picker-close" aria-label="Close">×</button>
    </div>
    
    <div class="rte-color-picker-body">
      <!-- Current Color Preview -->
      <div class="rte-color-preview-section">
        <div class="rte-color-preview-box" style="background-color: ${J}; ${J==="#ffffff"?"border: 1px solid #ccc;":""}"></div>
        <span class="rte-color-preview-label">${J.toUpperCase()}</span>
      </div>

      <!-- Preset Colors -->
      <div class="rte-color-section">
        <label class="rte-color-section-label">Colors</label>
        <div class="rte-color-palette">
          ${ci.map(n=>`
            <button
              class="rte-color-swatch ${J===n?"selected":""}"
              style="background-color: ${n}; ${n==="#ffffff"?"border: 1px solid #ccc;":""}"
              data-color="${n}"
              title="${n.toUpperCase()}"
              aria-label="${n.toUpperCase()}"
            ></button>
          `).join("")}
        </div>
      </div>

      <!-- Custom Color -->
      <div class="rte-color-section">
        <label class="rte-color-section-label">Custom</label>
        <div class="rte-custom-color-inputs">
          <input
            type="color"
            value="${J}"
            class="rte-color-input-native"
            aria-label="Color picker"
          />
          <input
            type="text"
            value="${J}"
            placeholder="#000000"
            pattern="^#[0-9A-Fa-f]{6}$"
            class="rte-color-input-text"
            aria-label="Hex color input"
          />
        </div>
      </div>
    </div>
  `,document.body.appendChild(R),ke&&(ke.destroy(),ke=null),ke=si({popover:R,anchor:e,onClose:He,gap:4,margin:8,zIndex:1e4}),gi()}function gi(){if(!R)return;const e=R.querySelector(".rte-color-picker-close");e==null||e.addEventListener("click",()=>He()),R.querySelectorAll(".rte-color-swatch").forEach(o=>{o.addEventListener("click",()=>{const i=o.getAttribute("data-color");i&&(J=i,st(i),He())})});const n=R.querySelector(".rte-color-input-native");n==null||n.addEventListener("change",o=>{const i=o.target.value;J=i,st(i),He()});const r=R.querySelector(".rte-color-input-text");r==null||r.addEventListener("change",o=>{const i=o.target.value;/^#[0-9A-Fa-f]{6}$/.test(i)&&(J=i,st(i),He())}),n==null||n.addEventListener("input",o=>{const i=o.target.value;J=i,rr(i),or(i),bi(i)}),r==null||r.addEventListener("input",o=>{const i=o.target.value;/^#[0-9A-Fa-f]{6}$/.test(i)&&(J=i,rr(i),or(i),hi(i))})}function rr(e){if(!R)return;const t=R.querySelector(".rte-color-preview-box"),n=R.querySelector(".rte-color-preview-label");t&&(t.style.backgroundColor=e,t.style.border=e==="#ffffff"?"1px solid #ccc":"none"),n&&(n.textContent=e.toUpperCase())}function or(e){if(!R)return;R.querySelectorAll(".rte-color-swatch").forEach(n=>{n.getAttribute("data-color")===e?n.classList.add("selected"):n.classList.remove("selected")})}function hi(e){if(!R)return;const t=R.querySelector(".rte-color-input-native");t&&(t.value=e)}function bi(e){if(!R)return;const t=R.querySelector(".rte-color-input-text");t&&(t.value=e)}function He(){ke&&(ke.destroy(),ke=null),R&&(R.remove(),R=null),cn=null}function vi(){if(Kt(),R)return He(),!0;const e=di("openTextColorPicker");return e?(pi(e),!0):!1}function Kt(){if(!window.__textColorPluginInitialized&&(window.__textColorPluginInitialized=!0,!document.getElementById("text-color-plugin-styles"))){const e=document.createElement("style");e.id="text-color-plugin-styles",e.textContent=`
      .rte-inline-color-picker {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        width: 220px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      .rte-color-picker-header {
        padding: 12px 16px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .rte-color-picker-title {
        font-size: 14px;
        font-weight: 600;
        color: #333;
      }

      .rte-color-picker-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }

      .rte-color-picker-close:hover {
        color: #333;
      }

      .rte-color-picker-body {
        padding: 8px;
      }

      .rte-color-preview-section {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
        padding: 6px;
        background-color: #f8f9fa;
        border-radius: 6px;
        border: 1px solid #e0e0e0;
      }

      .rte-color-preview-box {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .rte-color-preview-label {
        font-size: 13px;
        font-weight: 500;
        color: #666;
        font-family: monospace;
      }

      .rte-color-section {
        margin-bottom: 16px;
      }

      .rte-color-section:last-child {
        margin-bottom: 0;
      }

      .rte-color-section-label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: #666;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .rte-color-palette {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 6px;
        max-width: 180px;
      }

      .rte-color-swatch {
        width: 100%;
        aspect-ratio: 1;
        border: 1px solid #e0e0e0;
        border-radius: 3px;
        cursor: pointer;
        transition: all 0.15s ease;
        padding: 0;
        min-height: 20px;
      }

      .rte-color-swatch:hover {
        transform: scale(1.05);
        border-color: #ccc;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
      }

      .rte-color-swatch.selected {
        border-color: #1976d2;
        box-shadow: 0 0 0 1px rgba(25, 118, 210, 0.3);
      }

      .rte-custom-color-inputs {
        display: flex;
        gap: 8px;
      }

      .rte-color-input-native {
        width: 50px;
        height: 26px;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        padding: 2px;
      }

      .rte-color-input-text {
        flex: 1;
        height: 26px;
        width: 50px;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 0 12px;
        font-size: 13px;
        font-family: monospace;
      }

      .rte-color-input-text:focus {
        outline: none;
        border-color: #1976d2;
      }

      .rte-color-picker-footer {
        padding: 12px 16px;
        border-top: 1px solid #eee;
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .rte-btn-primary,
      .rte-btn-secondary {
        padding: 6px 16px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
      }

      .rte-btn-primary {
        background-color: #1976d2;
        color: white;
      }

      .rte-btn-primary:hover {
        background-color: #1565c0;
      }

      .rte-btn-secondary {
        background-color: #f5f5f5;
        color: #333;
        border: 1px solid #ddd;
      }

      .rte-btn-secondary:hover {
        background-color: #eeeeee;
      }

      .rte-inline-color-picker.rte-theme-dark {
        background: #1f2937;
        border: 1px solid #4b5563;
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.5);
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-picker-header {
        border-bottom-color: #3b4657;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-picker-title {
        color: #e2e8f0;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-picker-close {
        color: #94a3b8;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-picker-close:hover {
        color: #f8fafc;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-preview-section {
        background-color: #111827;
        border-color: #4b5563;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-preview-label {
        color: #cbd5e1;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-section-label {
        color: #9fb0c6;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-swatch {
        border-color: #4b5563;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-swatch:hover {
        border-color: #7a8ba5;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-swatch.selected {
        border-color: #58a6ff;
        box-shadow: 0 0 0 1px rgba(88, 166, 255, 0.4);
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-input-native,
      .rte-inline-color-picker.rte-theme-dark .rte-color-input-text {
        background: #111827;
        border-color: #4b5563;
        color: #e2e8f0;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-input-text::placeholder {
        color: #94a3b8;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-input-text:focus {
        border-color: #58a6ff;
      }
    `,document.head.appendChild(e)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Kt):setTimeout(Kt,100);const La=()=>({name:"textColor",marks:{textColor:{attrs:{color:{default:"#000000"}},parseDOM:[{tag:"span[style*=color]",getAttrs:e=>{const n=(e.getAttribute("style")||"").match(/color:\s*([^;]+)/);return n?{color:n[1]}:null}},{tag:"font[color]",getAttrs:e=>{const t=e.getAttribute("color");return t?{color:t}:null}}],toDOM:e=>{var t;return["span",{style:`color: ${((t=e.attrs)==null?void 0:t.color)||"#000000"}`,class:"rte-text-color"},0]}}},toolbar:[{label:"Text Color",command:"openTextColorPicker",icon:'<svg width="24" height="24" focusable="false"><g fill-rule="evenodd"><path class="tox-icon-text-color__color" d="M3 18h18v3H3z" fill="currentColor"></path><path d="M8.7 16h-.8a.5.5 0 0 1-.5-.6l2.7-9c.1-.3.3-.4.5-.4h2.8c.2 0 .4.1.5.4l2.7 9a.5.5 0 0 1-.5.6h-.8a.5.5 0 0 1-.4-.4l-.7-2.2c0-.3-.3-.4-.5-.4h-3.4c-.2 0-.4.1-.5.4l-.7 2.2c0 .3-.2.4-.4.4Zm2.6-7.6-.6 2a.5.5 0 0 0 .5.6h1.6a.5.5 0 0 0 .5-.6l-.6-2c0-.3-.3-.4-.5-.4h-.4c-.2 0-.4.1-.5.4Z"></path></g></svg>'}],commands:{openTextColorPicker:()=>vi(),setTextColor:e=>e?st(e):!1},keymap:{}}),yi=[{label:"1.0",value:"1.0"},{label:"1.15",value:"1.15"},{label:"1.5",value:"1.5"},{label:"2.0",value:"2.0"},{label:"2.5",value:"2.5"},{label:"3.0",value:"3.0"}],xi=new Set(["P","DIV","H1","H2","H3","H4","H5","H6","LI","BLOCKQUOTE","PRE"]),Yt=e=>xi.has(e.tagName)&&e.getAttribute("contenteditable")!=="true",wi=()=>{const e=window.getSelection();if(e&&e.rangeCount>0){let n=e.getRangeAt(0).startContainer;for(;n&&n!==document.body;){if(n.nodeType===Node.ELEMENT_NODE){const r=n;if(r.getAttribute("contenteditable")==="true")return r}n=n.parentNode}}const t=document.activeElement;if(t){if(t.getAttribute("contenteditable")==="true")return t;const n=t.closest('[contenteditable="true"]');if(n)return n}return document.querySelector('[contenteditable="true"]')},ir=e=>{let t=e;for(;t;){if(t.nodeType===Node.ELEMENT_NODE){const n=t;if(Yt(n))return n;if(n.getAttribute("contenteditable")==="true")break}t=t.parentNode}return null},Ei=(e,t)=>{const n=[],r=new Set,o=s=>{!s||r.has(s)||t.contains(s)&&Yt(s)&&(r.add(s),n.push(s))};if(e.collapsed)return o(ir(e.startContainer)),n;const i=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT,{acceptNode:s=>{const c=s;if(!Yt(c))return NodeFilter.FILTER_SKIP;if(typeof e.intersectsNode=="function")return e.intersectsNode(c)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;const u=document.createRange();return u.selectNodeContents(c),e.compareBoundaryPoints(Range.END_TO_START,u)>0&&e.compareBoundaryPoints(Range.START_TO_END,u)<0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});let l=i.nextNode();for(;l;)o(l),l=i.nextNode();return n.length===0&&o(ir(e.commonAncestorContainer)),n},ki=e=>{e.dispatchEvent(new Event("input",{bubbles:!0}))},Ci=(e,t)=>{if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}},Fr=e=>{if(!e)return!1;try{const t=wi();if(!t)return!1;const n=window.getSelection();if(!n||n.rangeCount===0)return!1;const r=n.getRangeAt(0);if(!t.contains(r.commonAncestorContainer))return!1;const o=Ei(r,t);if(o.length===0)return!1;const i=t.innerHTML;return o.forEach(l=>{l.style.lineHeight=e}),Ci(t,i),ki(t),!0}catch(t){return console.error("Failed to set line height:",t),!1}},Ti=(e,t)=>{var n;typeof window<"u"&&((n=window.registerEditorCommand)==null||n.call(window,e,t))},ar=()=>{Ti("setLineHeight",Fr)};typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ar):ar());const Aa=()=>({name:"lineHeight",marks:{lineHeight:{attrs:{height:{default:null}},parseDOM:[{tag:'span[style*="line-height"]',getAttrs:e=>{const n=e.style.lineHeight;return n?{height:n}:!1}}],toDOM:e=>{var t;return["span",{style:`line-height: ${(t=e.attrs)==null?void 0:t.height}`},0]}}},toolbar:[{label:"Line Height",command:"setLineHeight",type:"inline-menu",options:yi,icon:'<svg width="24" height="24" focusable="false"><path d="M21 5a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zm0 4a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zm0 4a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zm0 4a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zM7 3.6l3.7 3.7a1 1 0 0 1-1.3 1.5h-.1L8 7.3v9.2l1.3-1.3a1 1 0 0 1 1.3 0h.1c.4.4.4 1 0 1.3v.1L7 20.4l-3.7-3.7a1 1 0 0 1 1.3-1.5h.1L6 16.7V7.4L4.7 8.7a1 1 0 0 1-1.3 0h-.1a1 1 0 0 1 0-1.3v-.1L7 3.6z"></path></svg>'}],commands:{setLineHeight:Fr}}),qr=40,mt=e=>["P","DIV","H1","H2","H3","H4","H5","H6","LI","BLOCKQUOTE","PRE"].includes(e.tagName)&&e.getAttribute("contenteditable")!=="true",Ur=()=>{const e=window.getSelection();if(e&&e.rangeCount>0){let n=e.getRangeAt(0).startContainer;for(;n&&n!==document.body;){if(n.nodeType===Node.ELEMENT_NODE){const r=n;if(r.getAttribute("contenteditable")==="true")return r}n=n.parentNode}}const t=document.activeElement;if(t){if(t.getAttribute("contenteditable")==="true")return t;const n=t.closest('[contenteditable="true"]');if(n)return n}return document.querySelector('[contenteditable="true"]')},lr=e=>{let t=e;if(t.nodeType===Node.ELEMENT_NODE){const n=t;if(mt(n))return n}for(;t;){if(t.nodeType===Node.ELEMENT_NODE){const n=t;if(mt(n))return n;if(n.getAttribute("contenteditable")==="true")break}t=t.parentNode}return null},Vr=(e,t)=>{const n=[],r=new Set,o=s=>{!s||r.has(s)||t.contains(s)&&mt(s)&&(r.add(s),n.push(s))};if(e.collapsed)return o(lr(e.startContainer)),n;const i=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT,{acceptNode:s=>{const c=s;if(!mt(c))return NodeFilter.FILTER_SKIP;if(typeof e.intersectsNode=="function")return e.intersectsNode(c)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;const u=document.createRange();return u.selectNodeContents(c),e.compareBoundaryPoints(Range.END_TO_START,u)>0&&e.compareBoundaryPoints(Range.START_TO_END,u)<0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});let l=i.nextNode();for(;l;)o(l),l=i.nextNode();return n.length===0&&o(lr(e.commonAncestorContainer)),n},Wr=e=>{const t=window.getComputedStyle(e),n=t.paddingLeft;if(n.endsWith("px"))return parseFloat(n);if(n.endsWith("em")){const r=parseFloat(t.fontSize);return parseFloat(n)*r}return 0},Gr=(e,t)=>{if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}},jr=()=>{const e=Ur();if(!e)return!1;const t=window.getSelection();if(!t||t.rangeCount===0)return!1;const n=t.getRangeAt(0);if(!e.contains(n.commonAncestorContainer))return!1;const r=Vr(n,e);if(r.length===0)return!1;const o=e.innerHTML;return r.forEach(i=>{const s=Wr(i)+qr;i.style.paddingLeft=`${s}px`}),Gr(e,o),e.dispatchEvent(new Event("input",{bubbles:!0})),!0},Zr=()=>{const e=Ur();if(!e)return!1;const t=window.getSelection();if(!t||t.rangeCount===0)return!1;const n=t.getRangeAt(0);if(!e.contains(n.commonAncestorContainer))return!1;const r=Vr(n,e);if(r.length===0)return!1;const o=e.innerHTML;return r.forEach(i=>{const l=Wr(i),s=Math.max(0,l-qr);i.style.paddingLeft=`${s}px`}),Gr(e,o),e.dispatchEvent(new Event("input",{bubbles:!0})),!0},sr=(e,t)=>{var n;typeof window<"u"&&((n=window.registerEditorCommand)==null||n.call(window,e,t))},cr=()=>{sr("increaseIndent",jr),sr("decreaseIndent",Zr)};typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",cr):cr());const Sa=()=>({name:"indent",toolbar:[{label:"Increase Indent",command:"increaseIndent",type:"button",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm8-7h10v2H11v-2zm0 4h10v2H11v-2zM3 8l4 4-4 4V8z"/></svg>',shortcut:"Mod-]"},{label:"Decrease Indent",command:"decreaseIndent",type:"button",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm8-7h10v2H11v-2zm0 4h10v2H11v-2zM7 8v8l-4-4 4-4z"/></svg>',shortcut:"Mod-["}],commands:{increaseIndent:jr,decreaseIndent:Zr},keymap:{"Mod-]":"increaseIndent","Mod-[":"decreaseIndent",Tab:"increaseIndent","Shift-Tab":"decreaseIndent"}}),Li={latex:[{name:"Fraction",formula:"\\frac{a}{b}",description:"Simple fraction"},{name:"Square Root",formula:"\\sqrt{x}",description:"Square root"},{name:"Power",formula:"x^{2}",description:"Exponent/power"},{name:"Subscript",formula:"x_{sub}",description:"Subscript"},{name:"Integral",formula:"\\int_{a}^{b} f(x) \\, dx",description:"Definite integral"},{name:"Summation",formula:"\\sum_{i=1}^{n} x_{i}",description:"Summation"},{name:"Limit",formula:"\\lim_{x \\to 0} f(x)",description:"Limit"},{name:"Derivative",formula:"\\frac{d}{dx} f(x)",description:"Derivative"},{name:"Matrix 2x2",formula:"\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",description:"2x2 matrix"},{name:"System",formula:"\\begin{cases} x + y = 1 \\\\ 2x - y = 0 \\end{cases}",description:"System of equations"}],mathml:[{name:"Fraction",formula:"<mfrac><mi>a</mi><mi>b</mi></mfrac>",description:"Simple fraction"},{name:"Square Root",formula:"<msqrt><mi>x</mi></msqrt>",description:"Square root"},{name:"Power",formula:"<msup><mi>x</mi><mn>2</mn></msup>",description:"Exponent/power"},{name:"Subscript",formula:"<msub><mi>x</mi><mi>sub</mi></msub>",description:"Subscript"},{name:"Parentheses",formula:'<mfenced open="(" close=")"><mi>a</mi><mo>+</mo><mi>b</mi></mfenced>',description:"Grouped expression"}]};let rt=null,Ne=null,dr=!1,_e=null;const qe='[data-theme="dark"], .dark, .editora-theme-dark',Ai=()=>new Promise((e,t)=>{if(window.katex){e(window.katex);return}if(dr){const o=setInterval(()=>{window.katex&&(clearInterval(o),e(window.katex))},100);return}dr=!0;const n=document.createElement("link");n.rel="stylesheet",n.href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",document.head.appendChild(n);const r=document.createElement("script");r.src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js",r.onload=()=>e(window.katex),r.onerror=t,document.head.appendChild(r)}),Xr=()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return null;const t=e.getRangeAt(0).startContainer,n=t.nodeType===Node.ELEMENT_NODE?t:t.parentElement;return(n==null?void 0:n.closest(".rte-content, .editora-content"))||null},Si=e=>{const t=e||Xr();if(t!=null&&t.closest(qe))return!0;const n=window.getSelection();if(n&&n.rangeCount>0){const o=n.getRangeAt(0).startContainer,i=o.nodeType===Node.ELEMENT_NODE?o:o.parentElement;if(i!=null&&i.closest(qe))return!0}const r=document.activeElement;return r!=null&&r.closest(qe)?!0:document.body.matches(qe)||document.documentElement.matches(qe)},Kr=async(e,t)=>{const n=t||(Ne==null?void 0:Ne.closest(".rte-content, .editora-content"))||Xr()||_e;_e=n||null;const r=window.getSelection();if(r&&r.rangeCount>0){const v=r.getRangeAt(0);rt=n&&n.contains(v.commonAncestorContainer)?v.cloneRange():null}await Ai();const o=Si(n),i=o?{overlay:"rgba(0, 0, 0, 0.62)",dialogBg:"#1f2937",border:"#3b4657",panelBg:"#222d3a",fieldBg:"#111827",fieldBorder:"#4b5563",text:"#e2e8f0",muted:"#94a3b8",templateBtnBg:"#273244",templateBtnHover:"#334155",templateBtnText:"#dbe7f7",templateSubText:"#9fb0c6",previewBg:"#111827",previewText:"#cbd5e1",cancelBg:"#334155",cancelText:"#e2e8f0",cancelBorder:"#4b5563",insertBg:"#3b82f6",insertHover:"#2563eb",invalid:"#f87171"}:{overlay:"rgba(0, 0, 0, 0.5)",dialogBg:"#ffffff",border:"#e1e5e9",panelBg:"#f8f9fa",fieldBg:"#ffffff",fieldBorder:"#ced4da",text:"#1f2937",muted:"#6c757d",templateBtnBg:"#ffffff",templateBtnHover:"#f8f9fa",templateBtnText:"#1f2937",templateSubText:"#6c757d",previewBg:"#f8f9fa",previewText:"#6c757d",cancelBg:"#ffffff",cancelText:"#1f2937",cancelBorder:"#ced4da",insertBg:"#007bff",insertHover:"#0069d9",invalid:"#cc0000"},l=document.createElement("div");l.style.cssText=`position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: ${i.overlay}; display: flex; align-items: center; justify-content: center; z-index: 99999;`;const s=document.createElement("div");s.style.cssText=`background: ${i.dialogBg}; border: 1px solid ${i.border}; border-radius: 8px; width: 90%; max-width: 600px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); color: ${i.text};`;let c=(e==null?void 0:e.format)||"latex",u=(e==null?void 0:e.formula)||"",h=(e==null?void 0:e.inline)!==!1,g=null,m="";s.innerHTML=`
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid ${i.border}; background: ${i.panelBg};">
      <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: ${i.text};">${e?"Edit":"Insert"} Math Formula</h2>
      <button class="close-btn" style="background: none; border: none; font-size: 28px; cursor: pointer; color: ${i.muted}; padding: 0; width: 30px; height: 30px; line-height: 1;">×</button>
    </div>
    
    <div style="padding: 20px; overflow-y: auto; flex: 1;">
      <div style="margin-bottom: 20px;">
        <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px; color: ${i.text};">Format:</label>
        <div style="display: flex; gap: 16px;">
          <label style="cursor: pointer; color: ${i.text};"><input type="radio" name="format" value="latex" ${c==="latex"?"checked":""} style="margin-right: 6px;"> LaTeX</label>
          <label style="cursor: pointer; color: ${i.text};"><input type="radio" name="format" value="mathml" ${c==="mathml"?"checked":""} style="margin-right: 6px;"> MathML</label>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px; color: ${i.text};">Quick Templates:</label>
        <div id="templates-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; max-height: 200px; overflow-y: auto;"></div>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="cursor: pointer; color: ${i.text};"><input type="checkbox" id="inline-cb" ${h?"checked":""} style="margin-right: 8px;"> Inline math</label>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px; color: ${i.text};">Formula:</label>
        <textarea id="formula-input" rows="4" style="width: 100%; min-height: 112px; padding: 10px 12px; border: 1px solid ${i.fieldBorder}; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.45; background: ${i.fieldBg}; color: ${i.text}; box-sizing: border-box; overflow-x: hidden; overflow-y: auto; resize: vertical;">${u}</textarea>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px; color: ${i.text};">Preview:</label>
        <div id="preview-area" style="min-height: 60px; padding: 15px; border: 1px solid ${i.fieldBorder}; border-radius: 4px; background: ${i.previewBg}; display: flex; align-items: center; justify-content: center; color: ${i.previewText};"></div>
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 10px; padding: 16px 20px; border-top: 1px solid ${i.border}; background: ${i.panelBg};">
      <button class="cancel-btn" style="padding: 10px 20px; background: ${i.cancelBg}; color: ${i.cancelText}; border: 1px solid ${i.cancelBorder}; border-radius: 4px; cursor: pointer; font-size: 14px;">Cancel</button>
      <button id="insert-btn" style="padding: 10px 20px; background: ${i.insertBg}; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;" disabled>${e?"Update":"Insert"}</button>
    </div>
  `,l.appendChild(s),document.body.appendChild(l);const f=s.querySelector("#formula-input"),C=s.querySelector("#preview-area"),k=s.querySelector("#templates-grid"),b=s.querySelectorAll('input[name="format"]'),w=s.querySelector("#inline-cb"),x=s.querySelector("#insert-btn"),L=s.querySelector(".close-btn"),E=s.querySelector(".cancel-btn"),S=v=>encodeURIComponent(v),I=v=>{try{return decodeURIComponent(v)}catch{return v}},B=()=>{const v=Li[c];k.innerHTML=v.map(D=>`
      <button type="button" data-formula="${S(D.formula)}" title="${D.description}" style="padding: 8px; border: 1px solid ${i.fieldBorder}; border-radius: 4px; background: ${i.templateBtnBg}; cursor: pointer; text-align: left; transition: background-color 0.16s ease;">
        <div style="font-weight: 600; font-size: 12px; color: ${i.templateBtnText};">${D.name}</div>
        <div style="font-size: 10px; color: ${i.templateSubText}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${D.formula.substring(0,20)}...</div>
      </button>
    `).join("")},j=()=>{const v=f.value.trim(),D=`${c}:${v}`;if(D!==m){if(m=D,!v){C.innerHTML=`<span style="color: ${i.previewText};">Enter a formula to see preview</span>`,x.disabled=!0;return}x.disabled=!1;try{if(c==="latex"){const M=window.katex;C.innerHTML=M.renderToString(v,{displayMode:!1,throwOnError:!1})}else v.trim().startsWith("<math")?C.innerHTML=v:C.innerHTML=`<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">${v}</math>`}catch{C.innerHTML=`<span style="color: ${i.invalid};">Invalid formula</span>`}}},K=()=>{g!==null&&cancelAnimationFrame(g),g=requestAnimationFrame(()=>{g=null,j()})},Xe=v=>{v.key==="Escape"&&(v.preventDefault(),v.stopPropagation(),pe())},pe=()=>{document.removeEventListener("keydown",Xe,!0),g!==null&&(cancelAnimationFrame(g),g=null),l.parentNode&&l.parentNode.removeChild(l)};L.onmouseover=()=>{L.style.color="#f8fafc",L.style.background=o?"#334155":"#e5e7eb",L.style.borderRadius="4px"},L.onmouseout=()=>{L.style.color=i.muted,L.style.background="none"},E.onmouseover=()=>{E.style.background=o?"#475569":"#f3f4f6"},E.onmouseout=()=>{E.style.background=i.cancelBg},x.onmouseover=()=>{x.disabled||(x.style.background=i.insertHover)},x.onmouseout=()=>{x.style.background=i.insertBg},k.addEventListener("mouseover",v=>{const M=v.target.closest("button[data-formula]");M&&(M.style.background=i.templateBtnHover)}),k.addEventListener("mouseout",v=>{const M=v.target.closest("button[data-formula]");M&&(M.style.background=i.templateBtnBg)}),k.addEventListener("click",v=>{const M=v.target.closest("button[data-formula]");M&&(f.value=I(M.getAttribute("data-formula")||""),u=f.value,K())});const Oe=()=>{const v=f.value.trim();if(!v)return;const D={formula:v,format:c,inline:w.checked},M=D.inline?document.createElement("span"):document.createElement("div");if(M.className=D.inline?"math-formula":"math-block",M.setAttribute("data-math-formula",v),M.setAttribute("data-math-format",c),M.contentEditable="false",M.style.cssText=D.inline?"background: #f0f8ff; border: 1px solid #b8daff; border-radius: 4px; padding: 2px 6px; margin: 0 2px; color: #004085; display: inline-block; cursor: pointer;":"background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 12px; margin: 8px 0; text-align: center; display: block; cursor: pointer;",c==="latex"){const ae=window.katex;try{M.innerHTML=ae.renderToString(v,{displayMode:!D.inline,throwOnError:!1})}catch{M.textContent=D.inline?`$${v}$`:`$$${v}$$`}}else if(v.trim().startsWith("<math"))M.innerHTML=v;else{const ae=`<math xmlns="http://www.w3.org/1998/Math/MathML" display="${D.inline?"inline":"block"}">${v}</math>`;M.innerHTML=ae}if(Ne)Ne.replaceWith(M);else if(rt)rt.deleteContents(),rt.insertNode(M);else if(_e&&_e.isConnected){const ae=document.createRange();ae.selectNodeContents(_e),ae.collapse(!1),ae.insertNode(M)}const ge=M.closest(".rte-content, .editora-content")||_e;ge==null||ge.dispatchEvent(new Event("input",{bubbles:!0})),pe()};L.addEventListener("click",pe),E.addEventListener("click",pe),x.addEventListener("click",Oe),l.addEventListener("click",v=>{v.target===l&&pe()}),document.addEventListener("keydown",Xe,!0),b.forEach(v=>{v.addEventListener("change",D=>{c=D.target.value,m="",B(),K()})}),f.addEventListener("input",()=>{u=f.value,K()}),f.addEventListener("keydown",v=>{(v.ctrlKey||v.metaKey)&&v.key==="Enter"&&(v.preventDefault(),Oe())}),B(),K(),f.focus()};if(typeof window<"u"&&!window.__mathPluginDoubleClickInitialized){window.__mathPluginDoubleClickInitialized=!0;const e=n=>{const o=n.target.closest(".math-formula, .math-block");if(o){n.preventDefault(),n.stopPropagation(),n.stopImmediatePropagation(),Ne=o;const i=o.getAttribute("data-math-formula")||"",l=o.getAttribute("data-math-format")||"latex",s=o.classList.contains("math-formula");Kr({formula:i,format:l,inline:s})}},t=()=>{document.addEventListener("dblclick",e,{capture:!0})};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",t):setTimeout(t,100)}const Ma=()=>({name:"math",toolbar:[{label:"Insert Math",command:"insertMath",icon:'<svg width="24" height="24" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 4.8c.1-.5.5-.8 1-.8h10a1 1 0 1 1 0 2h-9.2L8.3 19.2a1 1 0 0 1-1.7.4l-3.4-4.2a1 1 0 0 1 1.6-1.2l2 2.5L9 4.8Zm9.7 5.5c.4.4.4 1 0 1.4L17 13.5l1.8 1.8a1 1 0 0 1-1.4 1.4L15.5 15l-1.8 1.8a1 1 0 0 1-1.4-1.4l1.8-1.8-1.8-1.8a1 1 0 0 1 1.4-1.4l1.8 1.8 1.8-1.8a1 1 0 0 1 1.4 0Z"></path></svg>'}],commands:{insertMath:(e,t)=>{const n=(t==null?void 0:t.contentElement)instanceof HTMLElement?t.contentElement:null;return Kr(void 0,n),!0}},keymap:{"Mod-Shift-m":"insertMath"}});let ot=null,N=null,_=null,ft=[],it=!1,Ue=null,ur=0,mr=0,ye=0,xe=0,Bt=1,je=null;const Yr='[data-theme="dark"], .dark, .editora-theme-dark',vt=(e,t)=>{const n=r=>{r.key!=="Escape"||!e.isConnected||(r.preventDefault(),r.stopPropagation(),t())};return document.addEventListener("keydown",n,!0),()=>{document.removeEventListener("keydown",n,!0)}},Mi=()=>{if(typeof document>"u"||document.getElementById("rte-media-dialog-styles"))return;const e=document.createElement("style");e.id="rte-media-dialog-styles",e.textContent=`
    .rte-media-overlay {
      --rte-media-overlay-bg: rgba(15, 23, 36, 0.56);
      --rte-media-bg: #ffffff;
      --rte-media-text: #101828;
      --rte-media-muted: #5f6b7d;
      --rte-media-border: #d6dbe4;
      --rte-media-surface: #f7f9fc;
      --rte-media-surface-hover: #eef2f7;
      --rte-media-accent: #1f75fe;
      --rte-media-accent-hover: #165fd6;
      --rte-media-danger: #dc3545;
      --rte-media-danger-hover: #b92735;
      --rte-media-ring: rgba(31, 117, 254, 0.18);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--rte-media-overlay-bg);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      padding: 16px;
      box-sizing: border-box;
    }

    .rte-media-overlay.rte-ui-theme-dark {
      --rte-media-overlay-bg: rgba(2, 8, 20, 0.72);
      --rte-media-bg: #202938;
      --rte-media-text: #e8effc;
      --rte-media-muted: #a5b1c5;
      --rte-media-border: #49566c;
      --rte-media-surface: #2a3444;
      --rte-media-surface-hover: #344256;
      --rte-media-accent: #58a6ff;
      --rte-media-accent-hover: #4598f4;
      --rte-media-danger: #ff7b72;
      --rte-media-danger-hover: #ff645b;
      --rte-media-ring: rgba(88, 166, 255, 0.22);
    }

    .rte-media-dialog {
      width: min(92vw, 640px);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--rte-media-bg);
      color: var(--rte-media-text);
      border: 1px solid var(--rte-media-border);
      border-radius: 12px;
      box-shadow: 0 24px 48px rgba(10, 15, 24, 0.28);
    }

    .rte-media-dialog.rte-media-dialog-compact {
      width: min(92vw, 520px);
    }

    .rte-media-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--rte-media-border);
      background: linear-gradient(180deg, rgba(127, 154, 195, 0.08) 0%, rgba(127, 154, 195, 0) 100%);
    }

    .rte-media-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--rte-media-text);
    }

    .rte-media-close-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--rte-media-muted);
      font-size: 24px;
      line-height: 1;
      cursor: pointer;
      transition: background-color 0.16s ease, color 0.16s ease;
    }

    .rte-media-close-btn:hover {
      background: var(--rte-media-surface-hover);
      color: var(--rte-media-text);
    }

    .rte-media-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-bottom: 1px solid var(--rte-media-border);
      gap: 0;
    }

    .rte-media-tab {
      border: none;
      border-right: 1px solid var(--rte-media-border);
      padding: 12px 14px;
      background: var(--rte-media-surface);
      color: var(--rte-media-muted);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.16s ease, color 0.16s ease;
    }

    .rte-media-tab:last-child {
      border-right: none;
    }

    .rte-media-tab:hover {
      background: var(--rte-media-surface-hover);
      color: var(--rte-media-text);
    }

    .rte-media-tab.active {
      background: var(--rte-media-accent);
      color: #fff;
    }

    .rte-media-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    .rte-media-field {
      margin-bottom: 16px;
    }

    .rte-media-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }

    .rte-media-label {
      display: block;
      margin-bottom: 8px;
      color: var(--rte-media-text);
      font-size: 14px;
      font-weight: 600;
    }

    .rte-media-input,
    .rte-media-textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 12px;
      border: 1px solid var(--rte-media-border);
      border-radius: 8px;
      background: var(--rte-media-surface);
      color: var(--rte-media-text);
      font-size: 14px;
      transition: border-color 0.16s ease, box-shadow 0.16s ease;
    }

    .rte-media-input::placeholder,
    .rte-media-textarea::placeholder {
      color: var(--rte-media-muted);
    }

    .rte-media-input:focus,
    .rte-media-textarea:focus {
      outline: none;
      border-color: var(--rte-media-accent);
      box-shadow: 0 0 0 3px var(--rte-media-ring);
    }

    .rte-media-textarea {
      min-height: 92px;
      resize: vertical;
      font-family: inherit;
    }

    .rte-media-dropzone {
      border: 2px dashed var(--rte-media-border);
      border-radius: 12px;
      padding: 36px 18px;
      text-align: center;
      cursor: pointer;
      background: var(--rte-media-surface);
      transition: border-color 0.16s ease, background-color 0.16s ease;
    }

    .rte-media-dropzone:hover,
    .rte-media-dropzone.is-dragover {
      border-color: var(--rte-media-accent);
      background: var(--rte-media-surface-hover);
    }

    .rte-media-dropzone-icon {
      font-size: 40px;
      margin-bottom: 10px;
      line-height: 1;
    }

    .rte-media-dropzone-title {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--rte-media-text);
    }

    .rte-media-muted {
      margin: 0 0 8px 0;
      color: var(--rte-media-muted);
      font-size: 14px;
    }

    .rte-media-hint {
      margin: 0;
      color: var(--rte-media-muted);
      font-size: 12px;
    }

    .rte-media-progress {
      margin-top: 16px;
    }

    .rte-media-progress-track {
      height: 8px;
      border-radius: 999px;
      background: var(--rte-media-surface);
      overflow: hidden;
      border: 1px solid var(--rte-media-border);
    }

    .rte-media-progress-bar {
      height: 100%;
      width: 0;
      background: var(--rte-media-accent);
      transition: width 0.3s ease;
    }

    .rte-media-progress-text {
      margin-top: 8px;
      text-align: center;
      color: var(--rte-media-muted);
      font-size: 13px;
    }

    .rte-media-preview {
      border: 1px solid var(--rte-media-border);
      border-radius: 10px;
      padding: 10px;
      text-align: center;
      background: var(--rte-media-surface);
    }

    .rte-media-preview img,
    .rte-media-preview video {
      max-width: 100%;
      max-height: 240px;
    }

    .rte-media-helper {
      margin-top: 8px;
      margin-bottom: 0;
      font-size: 12px;
      color: var(--rte-media-muted);
      line-height: 1.5;
    }

    .rte-media-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 16px 20px;
      border-top: 1px solid var(--rte-media-border);
      background: var(--rte-media-surface);
    }

    .rte-media-footer.rte-media-footer-spread {
      justify-content: space-between;
      align-items: center;
    }

    .rte-media-btn {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.16s ease, border-color 0.16s ease, color 0.16s ease;
    }

    .rte-media-btn-secondary {
      background: var(--rte-media-bg);
      border-color: var(--rte-media-border);
      color: var(--rte-media-text);
    }

    .rte-media-btn-secondary:hover {
      background: var(--rte-media-surface-hover);
    }

    .rte-media-btn-primary {
      background: var(--rte-media-accent);
      color: #fff;
    }

    .rte-media-btn-primary:hover {
      background: var(--rte-media-accent-hover);
    }

    .rte-media-btn-primary:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .rte-media-btn-danger {
      background: var(--rte-media-danger);
      color: #fff;
    }

    .rte-media-btn-danger:hover {
      background: var(--rte-media-danger-hover);
    }

    .rte-media-checkbox-label {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--rte-media-text);
      font-size: 14px;
      cursor: pointer;
    }

    .rte-media-checkbox-label input {
      accent-color: var(--rte-media-accent);
    }

    .rte-media-actions {
      display: flex;
      gap: 10px;
    }

    .rte-media-spacer {
      flex: 1;
    }

    .media-floating-toolbar {
      --rte-media-toolbar-bg: #ffffff;
      --rte-media-toolbar-border: #d6dbe4;
      --rte-media-toolbar-text: #344054;
      --rte-media-toolbar-hover-bg: #f3f6fb;
      --rte-media-toolbar-hover-text: #101828;
      --rte-media-toolbar-active-bg: #e6edf7;
      --rte-media-toolbar-separator: #d9e1eb;
      --rte-media-toolbar-danger-hover-bg: #fee2e2;
      --rte-media-toolbar-danger-hover-text: #b42318;
      position: absolute;
      display: none;
      align-items: center;
      gap: 2px;
      padding: 4px;
      border: 1px solid var(--rte-media-toolbar-border);
      border-radius: 8px;
      background: var(--rte-media-toolbar-bg);
      color: var(--rte-media-toolbar-text);
      box-shadow: 0 10px 24px rgba(15, 23, 36, 0.18);
      z-index: 10000;
      pointer-events: auto;
      backdrop-filter: blur(6px);
    }

    .media-floating-toolbar.rte-ui-theme-dark,
    ${Yr} .media-floating-toolbar {
      --rte-media-toolbar-bg: #24303f;
      --rte-media-toolbar-border: #4a5a71;
      --rte-media-toolbar-text: #d9e6fb;
      --rte-media-toolbar-hover-bg: #33445a;
      --rte-media-toolbar-hover-text: #f4f8ff;
      --rte-media-toolbar-active-bg: #415875;
      --rte-media-toolbar-separator: #566884;
      --rte-media-toolbar-danger-hover-bg: #5f2a32;
      --rte-media-toolbar-danger-hover-text: #ffd7d5;
      box-shadow: 0 16px 30px rgba(2, 8, 20, 0.42);
    }

    .media-floating-toolbar-btn {
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: inherit;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.16s ease, color 0.16s ease, transform 0.12s ease;
    }

    .media-floating-toolbar-btn:hover {
      background: var(--rte-media-toolbar-hover-bg);
      color: var(--rte-media-toolbar-hover-text);
    }

    .media-floating-toolbar-btn:active {
      background: var(--rte-media-toolbar-active-bg);
      transform: scale(0.96);
    }

    .media-floating-toolbar-btn.btn-remove:hover {
      background: var(--rte-media-toolbar-danger-hover-bg);
      color: var(--rte-media-toolbar-danger-hover-text);
    }

    .media-floating-toolbar-separator {
      width: 1px;
      height: 20px;
      margin: 0 2px;
      background: var(--rte-media-toolbar-separator);
    }
  `,document.head.appendChild(e)},_i=()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return null;const t=e.anchorNode,n=t instanceof HTMLElement?t:t==null?void 0:t.parentElement;return(n==null?void 0:n.closest(".rte-content, .editora-content"))||null},Ri=e=>{if(e)return e;const t=_i();if(t)return t;if(je)return je;const n=document.activeElement;return n?n.closest(".rte-content, .editora-content")||n:null},Qr=e=>{const t=Ri(e);return t?!!t.closest(Yr):!1},yt=e=>{Mi();const t=document.createElement("div");return t.className="rte-media-overlay",Qr(e)&&t.classList.add("rte-ui-theme-dark"),t},xt=(e=!1)=>{const t=document.createElement("div");return t.className=e?"rte-media-dialog rte-media-dialog-compact":"rte-media-dialog",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t},fr=(e,t)=>{const n=window.getSelection();n&&n.rangeCount>0&&(ot=n.getRangeAt(0).cloneRange());const r=yt(t),o=xt();let i="upload",l="",s="",c="",u="";const h=()=>{o.innerHTML=`
      <div class="rte-media-header">
        <h2 class="rte-media-title">Insert ${e==="image"?"Image":"Video"}</h2>
        <button class="close-btn rte-media-close-btn" type="button" aria-label="Close">×</button>
      </div>

      <div class="rte-media-tabs">
        <button class="tab-upload rte-media-tab ${i==="upload"?"active":""}" type="button">Upload</button>
        <button class="tab-url rte-media-tab ${i==="url"?"active":""}" type="button">URL</button>
      </div>

      <div class="rte-media-body">
        ${i==="upload"?`
          <div id="upload-section">
            <div class="dropzone rte-media-dropzone">
              <div class="rte-media-dropzone-icon">📁</div>
              <p class="rte-media-dropzone-title">Drag and drop your ${e} here</p>
              <p class="rte-media-muted">or click to browse</p>
              <p class="rte-media-hint">Max file size: 50MB</p>
            </div>
            <input type="file" id="file-input" accept="${e==="image"?"image/*":"video/*"}" style="display: none;">
            <div id="upload-progress" class="rte-media-progress" style="display: none;">
              <div class="rte-media-progress-track">
                <div id="progress-bar" class="rte-media-progress-bar"></div>
              </div>
              <p id="progress-text" class="rte-media-progress-text">Uploading...</p>
            </div>
          </div>
        `:`
          <div id="url-section">
            <div class="rte-media-field">
              <label class="rte-media-label">URL</label>
              <input type="text" id="url-input" class="rte-media-input" placeholder="https://example.com/${e}.${e==="image"?"jpg":"mp4"}" value="${l}">
            </div>
            ${e==="image"?`
              <div class="rte-media-field">
                <label class="rte-media-label">Alt Text (for accessibility)</label>
                <input type="text" id="alt-input" class="rte-media-input" placeholder="Describe the image" value="${u}">
              </div>
            `:""}
            <div class="rte-media-grid">
              <div class="rte-media-field">
                <label class="rte-media-label">Width (px)</label>
                <input type="number" id="width-input" class="rte-media-input" placeholder="Auto" value="${s}">
              </div>
              <div class="rte-media-field">
                <label class="rte-media-label">Height (px)</label>
                <input type="number" id="height-input" class="rte-media-input" placeholder="Auto" value="${c}">
              </div>
            </div>
            ${l?`
              <div class="rte-media-field">
                <label class="rte-media-label">Preview</label>
                <div class="rte-media-preview">
                  ${e==="image"?`<img src="${l}" alt="Preview">`:`<video src="${l}" controls></video>`}
                </div>
              </div>
            `:""}
          </div>
        `}
      </div>

      <div class="rte-media-footer">
        <button class="cancel-btn rte-media-btn rte-media-btn-secondary" type="button">Cancel</button>
        <button id="insert-btn" class="rte-media-btn rte-media-btn-primary" type="button" ${!l&&i==="url"?"disabled":""}>Insert</button>
      </div>
    `};h(),r.appendChild(o),document.body.appendChild(r);let g=()=>{};const m=()=>{g(),r.parentNode&&r.parentNode.removeChild(r)};g=vt(r,m);const f=()=>{if(!l)return;const b=e==="image"?document.createElement("img"):document.createElement("video");b.src=l,b.setAttribute("data-media-type",e),e==="image"&&u&&(b.alt=u),s&&(b.style.width=`${s}px`,b.setAttribute("width",s)),c&&(b.style.height=`${c}px`,b.setAttribute("height",c)),e==="video"&&(b.controls=!0),!s&&!c?b.style.cssText="max-width: 100%; height: auto; display: block; margin: 1em 0; cursor: pointer;":b.style.cssText=`display: block; margin: 1em 0; cursor: pointer; ${s?`width: ${s}px;`:"max-width: 100%;"} ${c?`height: ${c}px;`:"height: auto;"}`,ot&&(ot.deleteContents(),ot.insertNode(b)),m()},C=async b=>{const w=o.querySelector("#upload-progress"),x=o.querySelector("#progress-bar"),L=o.querySelector("#progress-text");if(w&&x&&L){w.style.display="block";let E=0;const S=setInterval(()=>{E+=Math.random()*30,E>90&&(E=90),x.style.width=`${E}%`},200);try{const I=new FileReader;I.onload=()=>{clearInterval(S),x.style.width="100%",L.textContent="Upload complete",setTimeout(()=>{l=I.result,i="url",h(),k()},500)},I.readAsDataURL(b)}catch{clearInterval(S),L.textContent="Upload failed"}}},k=()=>{const b=o.querySelector(".close-btn"),w=o.querySelector(".cancel-btn"),x=o.querySelector("#insert-btn"),L=o.querySelector(".tab-upload"),E=o.querySelector(".tab-url");if(b==null||b.addEventListener("click",m),w==null||w.addEventListener("click",m),x==null||x.addEventListener("click",f),L==null||L.addEventListener("click",()=>{i="upload",h(),k()}),E==null||E.addEventListener("click",()=>{i="url",h(),k()}),i==="upload"){const S=o.querySelector(".dropzone"),I=o.querySelector("#file-input");S==null||S.addEventListener("click",()=>I==null?void 0:I.click()),S==null||S.addEventListener("dragover",B=>{B.preventDefault(),S.classList.add("is-dragover")}),S==null||S.addEventListener("dragleave",()=>{S.classList.remove("is-dragover")}),S==null||S.addEventListener("drop",B=>{var K;B.preventDefault(),S.classList.remove("is-dragover");const j=(K=B.dataTransfer)==null?void 0:K.files[0];j&&C(j)}),I==null||I.addEventListener("change",B=>{var K;const j=(K=B.target.files)==null?void 0:K[0];j&&C(j)})}if(i==="url"){const S=o.querySelector("#url-input"),I=o.querySelector("#alt-input"),B=o.querySelector("#width-input"),j=o.querySelector("#height-input");S==null||S.addEventListener("input",()=>{l=S.value,h(),k()}),I==null||I.addEventListener("input",()=>{u=I.value}),B==null||B.addEventListener("input",()=>{s=B.value}),j==null||j.addEventListener("input",()=>{c=j.value})}};k(),r.addEventListener("click",b=>{b.target===r&&m()})},Ni=()=>{["nw","ne","sw","se"].forEach(t=>{const n=document.createElement("div");n.className=`media-resize-handle-${t}`,n.style.cssText=`
      position: fixed;
      width: 10px;
      height: 10px;
      background: #007bff;
      border: 2px solid white;
      border-radius: 50%;
      cursor: ${t}-resize;
      z-index: 10001;
      display: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    `,n.setAttribute("data-position",t),document.body.appendChild(n),ft.push(n)})},Ee=()=>{if(!N){ft.forEach(n=>n.style.display="none");return}const e=N.getBoundingClientRect(),t={nw:{x:e.left-5,y:e.top-5},ne:{x:e.right-5,y:e.top-5},sw:{x:e.left-5,y:e.bottom-5},se:{x:e.right-5,y:e.bottom-5}};ft.forEach(n=>{const r=n.getAttribute("data-position"),o=t[r];n.style.left=`${o.x}px`,n.style.top=`${o.y}px`,n.style.display="block"})},Hi=e=>{const t=yt(e),n=xt(!0);n.innerHTML=`
    <div class="rte-media-header">
      <h2 class="rte-media-title">Edit Alt Text</h2>
      <button class="close-btn rte-media-close-btn" type="button" aria-label="Close">×</button>
    </div>
    <div class="rte-media-body">
      <label class="rte-media-label">Alternative Text (for accessibility)</label>
      <textarea id="alt-text-input" class="rte-media-textarea" placeholder="Describe the image for screen readers...">${e.alt||""}</textarea>
      <p class="rte-media-helper">Good alt text is descriptive and concise. It helps users with visual impairments understand your content.</p>
    </div>
    <div class="rte-media-footer">
      <button class="cancel-btn rte-media-btn rte-media-btn-secondary" type="button">Cancel</button>
      <button class="save-btn rte-media-btn rte-media-btn-primary" type="button">Save</button>
    </div>
  `,t.appendChild(n),document.body.appendChild(t);const r=n.querySelector("#alt-text-input"),o=n.querySelector(".close-btn"),i=n.querySelector(".cancel-btn"),l=n.querySelector(".save-btn");let s=()=>{};const c=()=>{s(),t.parentNode&&t.parentNode.removeChild(t)};s=vt(t,c),o.addEventListener("click",c),i.addEventListener("click",c),t.addEventListener("click",u=>{u.target===t&&c()}),l.addEventListener("click",()=>{e.alt=r.value,c()}),r.focus(),r.select()},Ii=e=>{const t=e.closest("a"),n=(t==null?void 0:t.getAttribute("href"))||"",r=(t==null?void 0:t.getAttribute("target"))||"_self",o=(t==null?void 0:t.getAttribute("title"))||"",i=yt(e),l=xt(!0);l.innerHTML=`
    <div class="rte-media-header">
      <h2 class="rte-media-title">${t?"Edit Link":"Add Link"}</h2>
      <button class="close-btn rte-media-close-btn" type="button" aria-label="Close">×</button>
    </div>
    <div class="rte-media-body">
      <div class="rte-media-field">
        <label class="rte-media-label">URL</label>
        <input id="link-url" type="url" class="rte-media-input" value="${n}" placeholder="https://example.com" />
      </div>
      <div class="rte-media-field">
        <label class="rte-media-label">Title (tooltip)</label>
        <input id="link-title" type="text" class="rte-media-input" value="${o}" placeholder="Optional tooltip text" />
      </div>
      <label class="rte-media-checkbox-label">
        <input id="link-target" type="checkbox" ${r==="_blank"?"checked":""} />
        Open in new window/tab
      </label>
    </div>
    <div class="rte-media-footer rte-media-footer-spread">
      ${t?'<button class="remove-link-btn rte-media-btn rte-media-btn-danger" type="button">Remove Link</button>':'<span class="rte-media-spacer"></span>'}
      <div class="rte-media-actions">
        <button class="cancel-btn rte-media-btn rte-media-btn-secondary" type="button">Cancel</button>
        <button class="save-btn rte-media-btn rte-media-btn-primary" type="button">Save</button>
      </div>
    </div>
  `,i.appendChild(l),document.body.appendChild(i);const s=l.querySelector("#link-url"),c=l.querySelector("#link-title"),u=l.querySelector("#link-target"),h=l.querySelector(".close-btn"),g=l.querySelector(".cancel-btn"),m=l.querySelector(".save-btn"),f=l.querySelector(".remove-link-btn");let C=()=>{};const k=()=>{C(),i.parentNode&&i.parentNode.removeChild(i)};C=vt(i,k),h.addEventListener("click",k),g.addEventListener("click",k),i.addEventListener("click",b=>{b.target===i&&k()}),m.addEventListener("click",()=>{const b=s.value.trim();if(b){const w=b.startsWith("http")?b:`https://${b}`;if(t)t.setAttribute("href",w),t.setAttribute("target",u.checked?"_blank":"_self"),u.checked?t.setAttribute("rel","noopener noreferrer"):t.removeAttribute("rel"),c.value.trim()?t.setAttribute("title",c.value.trim()):t.removeAttribute("title");else{const x=document.createElement("a");x.href=w,x.target=u.checked?"_blank":"_self",u.checked&&(x.rel="noopener noreferrer"),c.value.trim()&&(x.title=c.value.trim()),e.replaceWith(x),x.appendChild(e)}k(),_&&N&&Qt(N)}}),f==null||f.addEventListener("click",()=>{t&&confirm("Remove link from this media?")&&(t.replaceWith(e),k(),_&&N&&Qt(N))}),s.focus()},Di=e=>{const t=yt(e),n=xt();let r="url",o=e.src;const i=()=>{n.innerHTML=`
      <div class="rte-media-header">
        <h2 class="rte-media-title">Replace Image</h2>
        <button class="close-btn rte-media-close-btn" type="button" aria-label="Close">×</button>
      </div>

      <div class="rte-media-tabs">
        <button class="tab-upload rte-media-tab ${r==="upload"?"active":""}" type="button">Upload</button>
        <button class="tab-url rte-media-tab ${r==="url"?"active":""}" type="button">URL</button>
      </div>

      <div class="rte-media-body">
        ${r==="upload"?`
          <div id="upload-section">
            <div class="dropzone rte-media-dropzone">
              <div class="rte-media-dropzone-icon">📁</div>
              <p class="rte-media-dropzone-title">Drag and drop your image here</p>
              <p class="rte-media-muted">or click to browse</p>
            </div>
            <input type="file" id="file-input" accept="image/*" style="display: none;">
            <div id="upload-progress" class="rte-media-progress" style="display: none;">
              <div class="rte-media-progress-track">
                <div id="progress-bar" class="rte-media-progress-bar"></div>
              </div>
              <p id="progress-text" class="rte-media-progress-text">Uploading...</p>
            </div>
          </div>
        `:`
          <div id="url-section">
            <div class="rte-media-field">
              <label class="rte-media-label">Image URL</label>
              <input type="text" id="url-input" class="rte-media-input" placeholder="https://example.com/image.jpg" value="${o}">
            </div>
            ${o?`
              <div class="rte-media-field">
                <label class="rte-media-label">Preview</label>
                <div class="rte-media-preview">
                  <img src="${o}" alt="Preview" onerror="this.parentElement.innerHTML='<p class=&quot;rte-media-muted&quot;>Failed to load image</p>'">
                </div>
              </div>
            `:""}
          </div>
        `}
      </div>

      <div class="rte-media-footer">
        <button class="cancel-btn rte-media-btn rte-media-btn-secondary" type="button">Cancel</button>
        <button id="replace-btn" class="rte-media-btn rte-media-btn-primary" type="button" ${!o&&r==="url"?"disabled":""}>Replace</button>
      </div>
    `};i(),t.appendChild(n),document.body.appendChild(t);let l=()=>{};const s=()=>{l(),t.parentNode&&t.parentNode.removeChild(t)};l=vt(t,s);const c=()=>{o&&(e.src=o,s())},u=async g=>{const m=n.querySelector("#upload-progress"),f=n.querySelector("#progress-bar"),C=n.querySelector("#progress-text");if(m&&f&&C){m.style.display="block";let k=0;const b=setInterval(()=>{k+=Math.random()*30,k>90&&(k=90),f.style.width=`${k}%`},200);try{const w=new FileReader;w.onload=()=>{clearInterval(b),f.style.width="100%",C.textContent="Upload complete",setTimeout(()=>{o=w.result,r="url",i(),h()},500)},w.readAsDataURL(g)}catch{clearInterval(b),C.textContent="Upload failed"}}},h=()=>{const g=n.querySelector(".close-btn"),m=n.querySelector(".cancel-btn"),f=n.querySelector("#replace-btn"),C=n.querySelector(".tab-upload"),k=n.querySelector(".tab-url");if(g==null||g.addEventListener("click",s),m==null||m.addEventListener("click",s),f==null||f.addEventListener("click",c),C==null||C.addEventListener("click",()=>{r="upload",i(),h()}),k==null||k.addEventListener("click",()=>{r="url",i(),h()}),r==="upload"){const b=n.querySelector(".dropzone"),w=n.querySelector("#file-input");b==null||b.addEventListener("click",()=>w==null?void 0:w.click()),b==null||b.addEventListener("dragover",x=>{x.preventDefault(),b.classList.add("is-dragover")}),b==null||b.addEventListener("dragleave",()=>{b.classList.remove("is-dragover")}),b==null||b.addEventListener("drop",x=>{var E;x.preventDefault(),b.classList.remove("is-dragover");const L=(E=x.dataTransfer)==null?void 0:E.files[0];L&&u(L)}),w==null||w.addEventListener("change",x=>{var E;const L=(E=x.target.files)==null?void 0:E[0];L&&u(L)})}if(r==="url"){const b=n.querySelector("#url-input");b==null||b.addEventListener("input",()=>{o=b.value,i(),h()})}};h(),t.addEventListener("click",g=>{g.target===t&&s()})},ie=()=>{if(!_||!N)return;const e=_.offsetHeight||40,t=N.offsetTop,n=N.offsetLeft,r=N.offsetWidth,o=t-e-8,i=n+r/2-(_.offsetWidth||120)/2;_.style.top=`${o}px`,_.style.left=`${i}px`,setTimeout(()=>{_&&(_.style.display="flex")},100)},Qt=e=>{var s,c,u,h,g,m,f,C;_&&(_._cleanup&&_._cleanup(),_.remove());const t=e.parentElement;if(t){const k=t.style.position;(!k||k==="static")&&(t.style.position="relative",t._originalPosition=k),_=document.createElement("div"),_.className="media-floating-toolbar",Qr(e)&&_.classList.add("rte-ui-theme-dark"),t.insertBefore(_,t.firstChild),ie()}const n=_;if(!n)return;const r=e.tagName==="IMG",o=e.closest("a");n.innerHTML=`
    <button class="media-floating-toolbar-btn btn-align-left" title="Align Left" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>
    </button>
    <button class="media-floating-toolbar-btn btn-align-center" title="Align Center" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>
    </button>
    <button class="media-floating-toolbar-btn btn-align-right" title="Align Right" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>
    </button>
    <div class="media-floating-toolbar-separator" aria-hidden="true"></div>
    ${r?`
    <button class="media-floating-toolbar-btn btn-alt" title="Edit Alt Text" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
    </button>`:""}
    <button class="media-floating-toolbar-btn btn-link" title="${o?"Edit/Remove Link":"Add Link"}" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
    </button>
    ${r?`
    <button class="media-floating-toolbar-btn btn-replace" title="Replace Image" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
    </button>`:""}
    <div class="media-floating-toolbar-separator" aria-hidden="true"></div>
    <button class="media-floating-toolbar-btn btn-remove" title="Remove" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
    </button>
  `,setTimeout(()=>{ie()},0);const i=()=>ie();let l=e.parentElement;for(;l;)l.addEventListener("scroll",i),l=l.parentElement;window.addEventListener("scroll",i),window.addEventListener("resize",i),n._cleanup=()=>{let k=e.parentElement;for(;k;)k.removeEventListener("scroll",i),k=k.parentElement;window.removeEventListener("scroll",i),window.removeEventListener("resize",i)},(s=n.querySelector(".btn-align-left"))==null||s.addEventListener("click",()=>{e.style.display="block",e.style.marginLeft="0",e.style.marginRight="auto",ie()}),(c=n.querySelector(".btn-align-center"))==null||c.addEventListener("click",()=>{e.style.display="block",e.style.marginLeft="auto",e.style.marginRight="auto",ie()}),(u=n.querySelector(".btn-align-right"))==null||u.addEventListener("click",()=>{e.style.display="block",e.style.marginLeft="auto",e.style.marginRight="0",ie()}),(h=n.querySelector(".btn-alt"))==null||h.addEventListener("click",()=>{e.tagName==="IMG"&&Hi(e)}),(g=n.querySelector(".btn-link"))==null||g.addEventListener("click",()=>{Ii(e)}),(m=n.querySelector(".btn-replace"))==null||m.addEventListener("click",()=>{e.tagName==="IMG"&&Di(e)}),(f=n.querySelector(".btn-resize"))==null||f.addEventListener("click",()=>{const k=prompt("Enter width in pixels:",String(e.width||e.offsetWidth));if(k&&!isNaN(parseInt(k))){const b=parseInt(k);e.style.width=`${b}px`,e.setAttribute("width",String(b)),Ee(),ie()}}),(C=n.querySelector(".btn-remove"))==null||C.addEventListener("click",()=>{confirm("Remove this media?")&&(e.remove(),_&&(_._cleanup&&_._cleanup(),_.remove(),_=null),N=null,Ee())}),n._cleanup=()=>{window.removeEventListener("scroll",ie),window.removeEventListener("resize",ie)}},Jr=e=>{je=e||null,Ni(),document.addEventListener("click",t=>{const n=t.target;if(n.tagName==="IMG"||n.tagName==="VIDEO"){const r=n;let o=!1;if(je?o=je.contains(r):o=!!r.closest('[contenteditable="true"]'),o){t.preventDefault(),t.stopPropagation(),N=r,N.style.display="block",Qt(r),Ee();return}}if(!n.closest(".btn-link, .btn-resize, .btn-remove")&&_&&!n.closest("button")){if(_._cleanup&&_._cleanup(),_.remove(),_=null,N&&N.parentElement){const r=N.parentElement;r._originalPosition!==void 0&&(r.style.position=r._originalPosition,delete r._originalPosition)}N=null,Ee()}}),ft.forEach(t=>{t.addEventListener("mousedown",n=>{if(!N)return;n.preventDefault(),n.stopPropagation(),it=!0,Ue=t.getAttribute("data-position"),ur=n.clientX,mr=n.clientY;const r=N.getBoundingClientRect();ye=r.width,xe=r.height,Bt=ye/xe,document.body.style.userSelect="none",document.body.style.cursor=`${Ue}-resize`})}),document.addEventListener("mousemove",t=>{if(!it||!N||!Ue)return;const n=t.clientX-ur,r=t.clientY-mr;let o=ye,i=xe;switch(Ue){case"se":o=ye+n,i=xe+r;break;case"sw":o=ye-n,i=xe+r;break;case"ne":o=ye+n,i=xe-r;break;case"nw":o=ye-n,i=xe-r;break}Math.abs(n)>Math.abs(r)?i=o/Bt:o=i*Bt,o=Math.max(50,o),i=Math.max(50,i),N.style.width=`${o}px`,N.style.height=`${i}px`,N.setAttribute("width",String(Math.round(o))),N.setAttribute("height",String(Math.round(i))),Ee(),ie()}),document.addEventListener("mouseup",()=>{it&&(it=!1,Ue=null,document.body.style.userSelect="",document.body.style.cursor="")}),window.addEventListener("scroll",Ee),window.addEventListener("resize",Ee)};typeof window<"u"&&!window.__mediaManagerInitialized&&(window.__mediaManagerInitialized=!0,Jr());const _a=()=>({name:"image",initialize:e=>{const t=e==null?void 0:e.editorElement;Jr(t)},toolbar:[{label:"Image",command:"insertImage",icon:'<svg width="24px" height="24px" viewBox="0 0 32 32" enable-background="new 0 0 32 32"><g><rect fill="none" height="22" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" width="30" x="1" y="5"></rect><polygon fill="none" points="31,27 21,17 11,27" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></polygon><polygon fill="none" points="18,20 9,11 1,19 1,27 11,27" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></polygon><circle cx="19" cy="11" fill="none" r="2" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></circle></g></svg>'},{label:"Video",command:"insertVideo",icon:'<svg width="24" height="24" focusable="false"><path d="M4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm1 2v14h14V5H5Zm4.8 2.6 5.6 4a.5.5 0 0 1 0 .8l-5.6 4A.5.5 0 0 1 9 16V8a.5.5 0 0 1 .8-.4Z" fill-rule="nonzero"></path></svg>'}],commands:{insertImage:(e,t)=>{const n=(t==null?void 0:t.contentElement)instanceof HTMLElement?t.contentElement:void 0;return fr("image",n),!0},insertVideo:(e,t)=>{const n=(t==null?void 0:t.contentElement)instanceof HTMLElement?t.contentElement:void 0;return fr("video",n),!0}},keymap:{"Mod-Shift-i":"insertImage"}}),Pt=new WeakMap,eo="rte-fullscreen-active",pt=e=>(Pt.has(e)||Pt.set(e,{isFullscreen:!1,fullscreenButton:null}),Pt.get(e)),Oi=(e,t)=>{if(e.classList.add(eo),e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.right="0",e.style.bottom="0",e.style.width="100%",e.style.height="100%",e.style.maxWidth="100%",e.style.maxHeight="100%",e.style.borderRadius="0",e.style.zIndex="9999",e.style.margin="0",e.style.padding="0",e.style.boxShadow="none",e.style.display="flex",e.style.flexDirection="column",e.style.background="white",document.body.style.overflow="hidden",document.body.classList.add("fullscreen-active"),t.fullscreenButton){t.fullscreenButton.setAttribute("data-active","true"),t.fullscreenButton.style.backgroundColor="var(--rte-color-primary, #007bff)",t.fullscreenButton.style.color="white";const n=t.fullscreenButton.querySelector("svg");n&&(n.style.fill="white",n.style.stroke="white")}},Jt=(e,t)=>{if(e.classList.remove(eo),e.style.position="",e.style.top="",e.style.left="",e.style.right="",e.style.bottom="",e.style.width="",e.style.height="",e.style.maxWidth="",e.style.maxHeight="",e.style.borderRadius="",e.style.zIndex="",e.style.margin="",e.style.padding="",e.style.boxShadow="",e.style.display="",e.style.flexDirection="",e.style.background="",document.body.style.overflow="",document.body.classList.remove("fullscreen-active"),t.fullscreenButton){t.fullscreenButton.setAttribute("data-active","false"),t.fullscreenButton.style.backgroundColor="",t.fullscreenButton.style.color="";const n=t.fullscreenButton.querySelector("svg");n&&(n.style.fill="",n.style.stroke="")}},$i=e=>{try{if(!e){const n=document.activeElement;n&&n.closest("[data-editora-editor]")&&(e=n.closest("[data-editora-editor]"))}if(e||(e=document.querySelector("[data-editora-editor]")),!e)return console.warn("Editor element not found"),!1;const t=pt(e);return t.fullscreenButton||(t.fullscreenButton=e.querySelector('[data-command="toggleFullscreen"]')),t.isFullscreen=!t.isFullscreen,t.isFullscreen?Oi(e,t):Jt(e,t),!0}catch(t){return console.error("Fullscreen toggle failed:",t),!1}},to=e=>{if(!e){document.querySelectorAll("[data-editora-editor]").forEach(n=>{const r=n,o=pt(r);o.isFullscreen&&(o.isFullscreen=!1,Jt(r,o))});return}const t=pt(e);t.isFullscreen&&(t.isFullscreen=!1,Jt(e,t))},zi=e=>pt(e).isFullscreen,pr=()=>{const e=t=>{t.key==="Escape"&&to()};return typeof window<"u"&&window.addEventListener("keydown",e),()=>{typeof window<"u"&&window.removeEventListener("keydown",e)}};typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",pr):pr());const Ra=()=>({name:"fullscreen",toolbar:[{label:"Fullscreen",command:"toggleFullscreen",type:"button",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>'}],commands:{toggleFullscreen:$i},keymap:{Escape:()=>{const e=document.querySelectorAll("[data-editora-editor]");for(const t of e)if(zi(t))return to(t),!0;return!1}}});/*! @license DOMPurify 2.5.8 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.5.8/LICENSE */function me(e){"@babel/helpers - typeof";return me=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},me(e)}function en(e,t){return en=Object.setPrototypeOf||function(r,o){return r.__proto__=o,r},en(e,t)}function Bi(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function ct(e,t,n){return Bi()?ct=Reflect.construct:ct=function(o,i,l){var s=[null];s.push.apply(s,i);var c=Function.bind.apply(o,s),u=new c;return l&&en(u,l.prototype),u},ct.apply(null,arguments)}function oe(e){return Pi(e)||Fi(e)||qi(e)||Ui()}function Pi(e){if(Array.isArray(e))return tn(e)}function Fi(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function qi(e,t){if(e){if(typeof e=="string")return tn(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if(n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set")return Array.from(e);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return tn(e,t)}}function tn(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function Ui(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var Vi=Object.hasOwnProperty,gr=Object.setPrototypeOf,Wi=Object.isFrozen,Gi=Object.getPrototypeOf,ji=Object.getOwnPropertyDescriptor,G=Object.freeze,ee=Object.seal,Zi=Object.create,no=typeof Reflect<"u"&&Reflect,gt=no.apply,nn=no.construct;gt||(gt=function(t,n,r){return t.apply(n,r)});G||(G=function(t){return t});ee||(ee=function(t){return t});nn||(nn=function(t,n){return ct(t,oe(n))});var Xi=te(Array.prototype.forEach),hr=te(Array.prototype.pop),Ve=te(Array.prototype.push),dt=te(String.prototype.toLowerCase),Ft=te(String.prototype.toString),br=te(String.prototype.match),re=te(String.prototype.replace),Ki=te(String.prototype.indexOf),Yi=te(String.prototype.trim),V=te(RegExp.prototype.test),qt=Qi(TypeError);function te(e){return function(t){for(var n=arguments.length,r=new Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];return gt(e,t,r)}}function Qi(e){return function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return nn(e,n)}}function T(e,t,n){var r;n=(r=n)!==null&&r!==void 0?r:dt,gr&&gr(e,null);for(var o=t.length;o--;){var i=t[o];if(typeof i=="string"){var l=n(i);l!==i&&(Wi(t)||(t[o]=l),i=l)}e[i]=!0}return e}function we(e){var t=Zi(null),n;for(n in e)gt(Vi,e,[n])===!0&&(t[n]=e[n]);return t}function at(e,t){for(;e!==null;){var n=ji(e,t);if(n){if(n.get)return te(n.get);if(typeof n.value=="function")return te(n.value)}e=Gi(e)}function r(o){return console.warn("fallback value for",o),null}return r}var vr=G(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Ut=G(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Vt=G(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Ji=G(["animate","color-profile","cursor","discard","fedropshadow","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Wt=G(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover"]),ea=G(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),yr=G(["#text"]),xr=G(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","xmlns","slot"]),Gt=G(["accent-height","accumulate","additive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),wr=G(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),lt=G(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),ta=ee(/\{\{[\w\W]*|[\w\W]*\}\}/gm),na=ee(/<%[\w\W]*|[\w\W]*%>/gm),ra=ee(/\${[\w\W]*}/gm),oa=ee(/^data-[\-\w.\u00B7-\uFFFF]+$/),ia=ee(/^aria-[\-\w]+$/),aa=ee(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),la=ee(/^(?:\w+script|data):/i),sa=ee(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),ca=ee(/^html$/i),da=ee(/^[a-z][.\w]*(-[.\w]+)+$/i),ua=function(){return typeof window>"u"?null:window},ma=function(t,n){if(me(t)!=="object"||typeof t.createPolicy!="function")return null;var r=null,o="data-tt-policy-suffix";n.currentScript&&n.currentScript.hasAttribute(o)&&(r=n.currentScript.getAttribute(o));var i="dompurify"+(r?"#"+r:"");try{return t.createPolicy(i,{createHTML:function(s){return s},createScriptURL:function(s){return s}})}catch{return console.warn("TrustedTypes policy "+i+" could not be created."),null}};function ro(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:ua(),t=function(a){return ro(a)};if(t.version="2.5.8",t.removed=[],!e||!e.document||e.document.nodeType!==9)return t.isSupported=!1,t;var n=e.document,r=e.document,o=e.DocumentFragment,i=e.HTMLTemplateElement,l=e.Node,s=e.Element,c=e.NodeFilter,u=e.NamedNodeMap,h=u===void 0?e.NamedNodeMap||e.MozNamedAttrMap:u,g=e.HTMLFormElement,m=e.DOMParser,f=e.trustedTypes,C=s.prototype,k=at(C,"cloneNode"),b=at(C,"nextSibling"),w=at(C,"childNodes"),x=at(C,"parentNode");if(typeof i=="function"){var L=r.createElement("template");L.content&&L.content.ownerDocument&&(r=L.content.ownerDocument)}var E=ma(f,n),S=E?E.createHTML(""):"",I=r,B=I.implementation,j=I.createNodeIterator,K=I.createDocumentFragment,Xe=I.getElementsByTagName,pe=n.importNode,Oe={};try{Oe=we(r).documentMode?r.documentMode:{}}catch{}var v={};t.isSupported=typeof x=="function"&&B&&B.createHTMLDocument!==void 0&&Oe!==9;var D=ta,M=na,ge=ra,ae=oa,lo=ia,so=la,un=sa,co=da,wt=aa,P=null,mn=T({},[].concat(oe(vr),oe(Ut),oe(Vt),oe(Wt),oe(yr))),F=null,fn=T({},[].concat(oe(xr),oe(Gt),oe(wr),oe(lt))),O=Object.seal(Object.create(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),$e=null,Et=null,pn=!0,kt=!0,gn=!1,hn=!0,Ce=!1,Ct=!0,he=!1,Tt=!1,Lt=!1,Te=!1,Ke=!1,Ye=!1,bn=!0,vn=!1,uo="user-content-",At=!0,ze=!1,Le={},Ae=null,yn=T({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),xn=null,wn=T({},["audio","video","img","source","image","track"]),St=null,En=T({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Qe="http://www.w3.org/1998/Math/MathML",Je="http://www.w3.org/2000/svg",le="http://www.w3.org/1999/xhtml",Se=le,Mt=!1,_t=null,mo=T({},[Qe,Je,le],Ft),be,fo=["application/xhtml+xml","text/html"],po="text/html",q,Me=null,go=r.createElement("form"),kn=function(a){return a instanceof RegExp||a instanceof Function},Rt=function(a){Me&&Me===a||((!a||me(a)!=="object")&&(a={}),a=we(a),be=fo.indexOf(a.PARSER_MEDIA_TYPE)===-1?be=po:be=a.PARSER_MEDIA_TYPE,q=be==="application/xhtml+xml"?Ft:dt,P="ALLOWED_TAGS"in a?T({},a.ALLOWED_TAGS,q):mn,F="ALLOWED_ATTR"in a?T({},a.ALLOWED_ATTR,q):fn,_t="ALLOWED_NAMESPACES"in a?T({},a.ALLOWED_NAMESPACES,Ft):mo,St="ADD_URI_SAFE_ATTR"in a?T(we(En),a.ADD_URI_SAFE_ATTR,q):En,xn="ADD_DATA_URI_TAGS"in a?T(we(wn),a.ADD_DATA_URI_TAGS,q):wn,Ae="FORBID_CONTENTS"in a?T({},a.FORBID_CONTENTS,q):yn,$e="FORBID_TAGS"in a?T({},a.FORBID_TAGS,q):{},Et="FORBID_ATTR"in a?T({},a.FORBID_ATTR,q):{},Le="USE_PROFILES"in a?a.USE_PROFILES:!1,pn=a.ALLOW_ARIA_ATTR!==!1,kt=a.ALLOW_DATA_ATTR!==!1,gn=a.ALLOW_UNKNOWN_PROTOCOLS||!1,hn=a.ALLOW_SELF_CLOSE_IN_ATTR!==!1,Ce=a.SAFE_FOR_TEMPLATES||!1,Ct=a.SAFE_FOR_XML!==!1,he=a.WHOLE_DOCUMENT||!1,Te=a.RETURN_DOM||!1,Ke=a.RETURN_DOM_FRAGMENT||!1,Ye=a.RETURN_TRUSTED_TYPE||!1,Lt=a.FORCE_BODY||!1,bn=a.SANITIZE_DOM!==!1,vn=a.SANITIZE_NAMED_PROPS||!1,At=a.KEEP_CONTENT!==!1,ze=a.IN_PLACE||!1,wt=a.ALLOWED_URI_REGEXP||wt,Se=a.NAMESPACE||le,O=a.CUSTOM_ELEMENT_HANDLING||{},a.CUSTOM_ELEMENT_HANDLING&&kn(a.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(O.tagNameCheck=a.CUSTOM_ELEMENT_HANDLING.tagNameCheck),a.CUSTOM_ELEMENT_HANDLING&&kn(a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(O.attributeNameCheck=a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),a.CUSTOM_ELEMENT_HANDLING&&typeof a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(O.allowCustomizedBuiltInElements=a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),Ce&&(kt=!1),Ke&&(Te=!0),Le&&(P=T({},oe(yr)),F=[],Le.html===!0&&(T(P,vr),T(F,xr)),Le.svg===!0&&(T(P,Ut),T(F,Gt),T(F,lt)),Le.svgFilters===!0&&(T(P,Vt),T(F,Gt),T(F,lt)),Le.mathMl===!0&&(T(P,Wt),T(F,wr),T(F,lt))),a.ADD_TAGS&&(P===mn&&(P=we(P)),T(P,a.ADD_TAGS,q)),a.ADD_ATTR&&(F===fn&&(F=we(F)),T(F,a.ADD_ATTR,q)),a.ADD_URI_SAFE_ATTR&&T(St,a.ADD_URI_SAFE_ATTR,q),a.FORBID_CONTENTS&&(Ae===yn&&(Ae=we(Ae)),T(Ae,a.FORBID_CONTENTS,q)),At&&(P["#text"]=!0),he&&T(P,["html","head","body"]),P.table&&(T(P,["tbody"]),delete $e.tbody),G&&G(a),Me=a)},Cn=T({},["mi","mo","mn","ms","mtext"]),Tn=T({},["annotation-xml"]),ho=T({},["title","style","font","a","script"]),et=T({},Ut);T(et,Vt),T(et,Ji);var Nt=T({},Wt);T(Nt,ea);var bo=function(a){var d=x(a);(!d||!d.tagName)&&(d={namespaceURI:Se,tagName:"template"});var p=dt(a.tagName),A=dt(d.tagName);return _t[a.namespaceURI]?a.namespaceURI===Je?d.namespaceURI===le?p==="svg":d.namespaceURI===Qe?p==="svg"&&(A==="annotation-xml"||Cn[A]):!!et[p]:a.namespaceURI===Qe?d.namespaceURI===le?p==="math":d.namespaceURI===Je?p==="math"&&Tn[A]:!!Nt[p]:a.namespaceURI===le?d.namespaceURI===Je&&!Tn[A]||d.namespaceURI===Qe&&!Cn[A]?!1:!Nt[p]&&(ho[p]||!et[p]):!!(be==="application/xhtml+xml"&&_t[a.namespaceURI]):!1},Y=function(a){Ve(t.removed,{element:a});try{a.parentNode.removeChild(a)}catch{try{a.outerHTML=S}catch{a.remove()}}},tt=function(a,d){try{Ve(t.removed,{attribute:d.getAttributeNode(a),from:d})}catch{Ve(t.removed,{attribute:null,from:d})}if(d.removeAttribute(a),a==="is"&&!F[a])if(Te||Ke)try{Y(d)}catch{}else try{d.setAttribute(a,"")}catch{}},Ln=function(a){var d,p;if(Lt)a="<remove></remove>"+a;else{var A=br(a,/^[\r\n\t ]+/);p=A&&A[0]}be==="application/xhtml+xml"&&Se===le&&(a='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+a+"</body></html>");var Z=E?E.createHTML(a):a;if(Se===le)try{d=new m().parseFromString(Z,be)}catch{}if(!d||!d.documentElement){d=B.createDocument(Se,"template",null);try{d.documentElement.innerHTML=Mt?S:Z}catch{}}var W=d.body||d.documentElement;return a&&p&&W.insertBefore(r.createTextNode(p),W.childNodes[0]||null),Se===le?Xe.call(d,he?"html":"body")[0]:he?d.documentElement:W},An=function(a){return j.call(a.ownerDocument||a,a,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null,!1)},Ht=function(a){return a instanceof g&&(typeof a.nodeName!="string"||typeof a.textContent!="string"||typeof a.removeChild!="function"||!(a.attributes instanceof h)||typeof a.removeAttribute!="function"||typeof a.setAttribute!="function"||typeof a.namespaceURI!="string"||typeof a.insertBefore!="function"||typeof a.hasChildNodes!="function")},Be=function(a){return me(l)==="object"?a instanceof l:a&&me(a)==="object"&&typeof a.nodeType=="number"&&typeof a.nodeName=="string"},se=function(a,d,p){v[a]&&Xi(v[a],function(A){A.call(t,d,p,Me)})},Sn=function(a){var d;if(se("beforeSanitizeElements",a,null),Ht(a)||V(/[\u0080-\uFFFF]/,a.nodeName))return Y(a),!0;var p=q(a.nodeName);if(se("uponSanitizeElement",a,{tagName:p,allowedTags:P}),a.hasChildNodes()&&!Be(a.firstElementChild)&&(!Be(a.content)||!Be(a.content.firstElementChild))&&V(/<[/\w]/g,a.innerHTML)&&V(/<[/\w]/g,a.textContent)||p==="select"&&V(/<template/i,a.innerHTML)||a.nodeType===7||Ct&&a.nodeType===8&&V(/<[/\w]/g,a.data))return Y(a),!0;if(!P[p]||$e[p]){if(!$e[p]&&_n(p)&&(O.tagNameCheck instanceof RegExp&&V(O.tagNameCheck,p)||O.tagNameCheck instanceof Function&&O.tagNameCheck(p)))return!1;if(At&&!Ae[p]){var A=x(a)||a.parentNode,Z=w(a)||a.childNodes;if(Z&&A)for(var W=Z.length,U=W-1;U>=0;--U){var ve=k(Z[U],!0);ve.__removalCount=(a.__removalCount||0)+1,A.insertBefore(ve,b(a))}}return Y(a),!0}return a instanceof s&&!bo(a)||(p==="noscript"||p==="noembed"||p==="noframes")&&V(/<\/no(script|embed|frames)/i,a.innerHTML)?(Y(a),!0):(Ce&&a.nodeType===3&&(d=a.textContent,d=re(d,D," "),d=re(d,M," "),d=re(d,ge," "),a.textContent!==d&&(Ve(t.removed,{element:a.cloneNode()}),a.textContent=d)),se("afterSanitizeElements",a,null),!1)},Mn=function(a,d,p){if(bn&&(d==="id"||d==="name")&&(p in r||p in go))return!1;if(!(kt&&!Et[d]&&V(ae,d))){if(!(pn&&V(lo,d))){if(!F[d]||Et[d]){if(!(_n(a)&&(O.tagNameCheck instanceof RegExp&&V(O.tagNameCheck,a)||O.tagNameCheck instanceof Function&&O.tagNameCheck(a))&&(O.attributeNameCheck instanceof RegExp&&V(O.attributeNameCheck,d)||O.attributeNameCheck instanceof Function&&O.attributeNameCheck(d))||d==="is"&&O.allowCustomizedBuiltInElements&&(O.tagNameCheck instanceof RegExp&&V(O.tagNameCheck,p)||O.tagNameCheck instanceof Function&&O.tagNameCheck(p))))return!1}else if(!St[d]){if(!V(wt,re(p,un,""))){if(!((d==="src"||d==="xlink:href"||d==="href")&&a!=="script"&&Ki(p,"data:")===0&&xn[a])){if(!(gn&&!V(so,re(p,un,"")))){if(p)return!1}}}}}}return!0},_n=function(a){return a!=="annotation-xml"&&br(a,co)},Rn=function(a){var d,p,A,Z;se("beforeSanitizeAttributes",a,null);var W=a.attributes;if(!(!W||Ht(a))){var U={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:F};for(Z=W.length;Z--;){d=W[Z];var ve=d,z=ve.name,It=ve.namespaceURI;if(p=z==="value"?d.value:Yi(d.value),A=q(z),U.attrName=A,U.attrValue=p,U.keepAttr=!0,U.forceKeepAttr=void 0,se("uponSanitizeAttribute",a,U),p=U.attrValue,!U.forceKeepAttr&&(tt(z,a),!!U.keepAttr)){if(!hn&&V(/\/>/i,p)){tt(z,a);continue}Ce&&(p=re(p,D," "),p=re(p,M," "),p=re(p,ge," "));var Nn=q(a.nodeName);if(Mn(Nn,A,p)){if(vn&&(A==="id"||A==="name")&&(tt(z,a),p=uo+p),Ct&&V(/((--!?|])>)|<\/(style|title)/i,p)){tt(z,a);continue}if(E&&me(f)==="object"&&typeof f.getAttributeType=="function"&&!It)switch(f.getAttributeType(Nn,A)){case"TrustedHTML":{p=E.createHTML(p);break}case"TrustedScriptURL":{p=E.createScriptURL(p);break}}try{It?a.setAttributeNS(It,z,p):a.setAttribute(z,p),Ht(a)?Y(a):hr(t.removed)}catch{}}}}se("afterSanitizeAttributes",a,null)}},vo=function y(a){var d,p=An(a);for(se("beforeSanitizeShadowDOM",a,null);d=p.nextNode();)se("uponSanitizeShadowNode",d,null),Sn(d),Rn(d),d.content instanceof o&&y(d.content);se("afterSanitizeShadowDOM",a,null)};return t.sanitize=function(y){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},d,p,A,Z,W;if(Mt=!y,Mt&&(y="<!-->"),typeof y!="string"&&!Be(y))if(typeof y.toString=="function"){if(y=y.toString(),typeof y!="string")throw qt("dirty is not a string, aborting")}else throw qt("toString is not a function");if(!t.isSupported){if(me(e.toStaticHTML)==="object"||typeof e.toStaticHTML=="function"){if(typeof y=="string")return e.toStaticHTML(y);if(Be(y))return e.toStaticHTML(y.outerHTML)}return y}if(Tt||Rt(a),t.removed=[],typeof y=="string"&&(ze=!1),ze){if(y.nodeName){var U=q(y.nodeName);if(!P[U]||$e[U])throw qt("root node is forbidden and cannot be sanitized in-place")}}else if(y instanceof l)d=Ln("<!---->"),p=d.ownerDocument.importNode(y,!0),p.nodeType===1&&p.nodeName==="BODY"||p.nodeName==="HTML"?d=p:d.appendChild(p);else{if(!Te&&!Ce&&!he&&y.indexOf("<")===-1)return E&&Ye?E.createHTML(y):y;if(d=Ln(y),!d)return Te?null:Ye?S:""}d&&Lt&&Y(d.firstChild);for(var ve=An(ze?y:d);A=ve.nextNode();)A.nodeType===3&&A===Z||(Sn(A),Rn(A),A.content instanceof o&&vo(A.content),Z=A);if(Z=null,ze)return y;if(Te){if(Ke)for(W=K.call(d.ownerDocument);d.firstChild;)W.appendChild(d.firstChild);else W=d;return(F.shadowroot||F.shadowrootmod)&&(W=pe.call(n,W,!0)),W}var z=he?d.outerHTML:d.innerHTML;return he&&P["!doctype"]&&d.ownerDocument&&d.ownerDocument.doctype&&d.ownerDocument.doctype.name&&V(ca,d.ownerDocument.doctype.name)&&(z="<!DOCTYPE "+d.ownerDocument.doctype.name+`>
`+z),Ce&&(z=re(z,D," "),z=re(z,M," "),z=re(z,ge," ")),E&&Ye?E.createHTML(z):z},t.setConfig=function(y){Rt(y),Tt=!0},t.clearConfig=function(){Me=null,Tt=!1},t.isValidAttribute=function(y,a,d){Me||Rt({});var p=q(y),A=q(a);return Mn(p,A,d)},t.addHook=function(y,a){typeof a=="function"&&(v[y]=v[y]||[],Ve(v[y],a))},t.removeHook=function(y){if(v[y])return hr(v[y])},t.removeHooks=function(y){v[y]&&(v[y]=[])},t.removeAllHooks=function(){v={}},t}var fa=ro();const Na=Object.freeze(Object.defineProperty({__proto__:null,default:fa},Symbol.toStringTag,{value:"Module"})),pa=new Set,dn=[],fe=e=>{dn.push(e)},We='[data-theme="dark"], .dark, .editora-theme-dark';fe({id:"image-alt-text",wcag:"1.1.1",description:"Images must have alt text",severity:"error",selector:"img",evaluate(e,t){var r;const n=e;return n.hasAttribute("role")&&n.getAttribute("role")==="presentation"||n.hasAttribute("data-a11y-ignore")&&n.getAttribute("data-a11y-ignore")==="image-alt-text"?null:!n.hasAttribute("alt")||((r=n.getAttribute("alt"))==null?void 0:r.trim())===""?{id:`img-alt-${t.cache.get("imgIdx")}`,rule:"image-alt-text",wcag:"1.1.1",severity:"error",message:"Image missing alt text",nodePath:t.cache.get("imgPath"),element:n,suggestion:"Add descriptive alt text to all images",fixable:!0,fixLabel:"Add empty alt"}:null},fix(e){e.element&&e.element.setAttribute("alt","")}});fe({id:"empty-interactive",wcag:"4.1.2",description:"Interactive elements must have accessible names",severity:"error",selector:'button, a, [role="button"]',evaluate(e,t){var s;const n=e;if(n.hasAttribute("data-a11y-ignore")&&n.getAttribute("data-a11y-ignore")==="empty-interactive")return null;const r=(s=n.textContent)==null?void 0:s.trim(),o=n.hasAttribute("aria-label"),i=n.hasAttribute("aria-labelledby"),l=n.hasAttribute("title");return!r&&!o&&!i&&!l?{id:`interactive-empty-${t.cache.get("buttonIdx")}`,rule:"empty-interactive",wcag:"4.1.2",severity:"error",message:"Interactive element has no accessible name",nodePath:t.cache.get("buttonPath"),element:n,suggestion:"Add text, aria-label, aria-labelledby, or title",fixable:!0,fixLabel:"Add aria-label"}:null},fix(e){e.element&&e.element.setAttribute("aria-label","Button")}});fe({id:"form-label",wcag:"1.3.1",description:"Form controls must have labels",severity:"error",selector:"input, textarea, select",evaluate(e,t){const n=e;if(n.hasAttribute("type")&&n.getAttribute("type")==="hidden"||n.hasAttribute("data-a11y-ignore")&&n.getAttribute("data-a11y-ignore")==="form-label")return null;const r=t.doc.querySelector(`label[for="${n.getAttribute("id")}"]`),o=n.hasAttribute("aria-label"),i=n.hasAttribute("aria-labelledby");return!r&&!o&&!i?{id:`form-label-${t.cache.get("inputIdx")}`,rule:"form-label",wcag:"1.3.1",severity:"error",message:"Form control missing label",nodePath:t.cache.get("inputPath"),element:n,suggestion:"Add <label>, aria-label, or aria-labelledby",fixable:!0,fixLabel:"Add aria-label"}:null},fix(e){e.element&&e.element.setAttribute("aria-label","Input")}});fe({id:"table-headers",wcag:"1.3.1",description:"Tables must have header rows",severity:"error",selector:"table",evaluate(e,t){const n=e;if(n.hasAttribute("data-a11y-ignore")&&n.getAttribute("data-a11y-ignore")==="table-headers")return null;const r=n.querySelectorAll("th"),o=n.querySelectorAll("tr");return r.length===0&&o.length>0?{id:`table-no-headers-${t.cache.get("tableIdx")}`,rule:"table-headers",wcag:"1.3.1",severity:"error",message:"Table missing header row (<th> elements)",nodePath:t.cache.get("tablePath"),element:n,suggestion:"Add <th> elements to first row",fixable:!0,fixLabel:"Convert first row to headers"}:null},fix(e){if(e.element){const n=e.element.querySelector("tr");n&&Array.from(n.children).forEach(r=>{if(r.tagName==="TD"){const o=document.createElement("th");o.innerHTML=r.innerHTML,n.replaceChild(o,r)}})}}});fe({id:"heading-empty",wcag:"1.3.1",description:"Headings must not be empty",severity:"error",selector:"h1, h2, h3, h4, h5, h6",evaluate(e,t){var i;const n=e;if(n.hasAttribute("data-a11y-ignore")&&n.getAttribute("data-a11y-ignore")==="heading-empty")return null;const r=((i=n.textContent)==null?void 0:i.replace(/\s+/g,""))||"",o=n.childNodes.length===1&&n.childNodes[0].nodeName==="BR";return!r&&!o?{id:`heading-empty-${t.cache.get("headingIdx")}`,rule:"heading-empty",wcag:"1.3.1",severity:"error",message:`Empty ${n.tagName.toLowerCase()} heading`,nodePath:t.cache.get("headingPath"),element:n,suggestion:"All headings must contain text",fixable:!1}:null}});fe({id:"heading-order",wcag:"1.3.1",description:"Headings should not skip levels",severity:"warning",selector:"h1, h2, h3, h4, h5, h6",evaluate(e,t){const n=e,r=parseInt(n.tagName[1]),o=t.cache.get("previousHeadingLevel")||r;return t.cache.set("previousHeadingLevel",r),r-o>1?{id:`heading-order-${t.cache.get("headingIdx")}`,rule:"heading-order",wcag:"1.3.1",severity:"warning",message:`Heading skips level (${o} → ${r})`,nodePath:t.cache.get("headingPath"),element:n,suggestion:`Use heading level ${o+1} instead`,fixable:!1}:null}});fe({id:"link-text",wcag:"2.4.4",description:"Links must have descriptive text",severity:"error",selector:"a",evaluate(e,t){var l,s;const n=e;if(n.hasAttribute("data-a11y-ignore")&&n.getAttribute("data-a11y-ignore")==="link-text")return null;const r=((l=n.textContent)==null?void 0:l.replace(/\s+/g,"").toLowerCase())||"",o=n.childNodes.length===1&&n.childNodes[0].nodeName==="BR",i=["clickhere","readmore","link","here","this","page"];return!r&&!o?{id:`link-empty-${t.cache.get("aIdx")}`,rule:"link-text",wcag:"2.4.4",severity:"error",message:"Link has no text content",nodePath:t.cache.get("aPath"),element:n,suggestion:"All links must have descriptive text",fixable:!0,fixLabel:"Insert placeholder"}:i.some(c=>r.includes(c))?{id:`link-vague-${t.cache.get("aIdx")}`,rule:"link-text",wcag:"2.4.4",severity:"warning",message:`Vague link text: "${(s=n.textContent)==null?void 0:s.trim()}"`,nodePath:t.cache.get("aPath"),element:n,suggestion:"Use descriptive link text",fixable:!1}:null},fix(e){e.element&&(e.element.textContent="Link")}});fe({id:"list-structure",wcag:"1.3.1",description:"Lists must only contain <li> children",severity:"error",selector:"ul, ol",evaluate(e,t){const n=e;if(n.hasAttribute("data-a11y-ignore")&&n.getAttribute("data-a11y-ignore")==="list-structure")return null;const r=n.querySelectorAll(":scope > li");return Array.from(n.children).filter(i=>i.tagName!=="LI").length>0?{id:`list-structure-${t.cache.get("ulIdx")}`,rule:"list-structure",wcag:"1.3.1",severity:"error",message:"List contains non-li elements",nodePath:t.cache.get("ulPath"),element:n,suggestion:"All direct children of ul/ol must be li elements",fixable:!1}:r.length===0?{id:`list-empty-${t.cache.get("ulIdx")}`,rule:"list-structure",wcag:"1.3.1",severity:"warning",message:"Empty list element",nodePath:t.cache.get("ulPath"),element:n,suggestion:"Remove empty lists or add list items",fixable:!1}:null}});const oo=()=>{const e=window.getSelection();if(e&&e.rangeCount>0){let n=e.getRangeAt(0).startContainer;for(;n&&n!==document.body;){if(n.nodeType===Node.ELEMENT_NODE){const r=n;if(r.getAttribute("contenteditable")==="true")return r}n=n.parentNode}}const t=document.activeElement;if(t){if(t.getAttribute("contenteditable")==="true")return t;const n=t.closest('[contenteditable="true"]');if(n)return n}return document.querySelector('[contenteditable="true"]')},ga=()=>{const e=oo();if(e!=null&&e.closest(We))return!0;const t=window.getSelection();if(t&&t.rangeCount>0){const r=t.getRangeAt(0).startContainer,o=r.nodeType===Node.ELEMENT_NODE?r:r.parentElement;if(o!=null&&o.closest(We))return!0}const n=document.activeElement;return n!=null&&n.closest(We)?!0:document.body.matches(We)||document.documentElement.matches(We)},io=()=>{var c,u,h;const e=oo();if(!e)return[];const t=[],n={doc:e.ownerDocument||document,cache:new Map},r=n.doc.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,null);let o=r.currentNode,i={},l={},s=0;for(;o&&s<5e3;){const g=o,m=((u=(c=g.tagName)==null?void 0:c.toLowerCase)==null?void 0:u.call(c))||"";if(g.hidden||g.style.display==="none"||g.style.visibility==="hidden"){o=r.nextNode(),s++;continue}i[m]=(i[m]||0)+1,l[m]=`${m}[${i[m]-1}]`;for(const f of dn){if(pa.has(f.id)||f.selector&&!((h=o.matches)!=null&&h.call(o,f.selector)))continue;n.cache.set(`${m}Idx`,i[m]-1),n.cache.set(`${m}Path`,l[m]),/^h[1-6]$/.test(m)&&(n.cache.set("headingIdx",i[m]-1),n.cache.set("headingPath",l[m])),m==="a"&&(n.cache.set("aIdx",i[m]-1),n.cache.set("aPath",l[m])),m==="table"&&(n.cache.set("tableIdx",i[m]-1),n.cache.set("tablePath",l[m])),m==="button"&&(n.cache.set("buttonIdx",i[m]-1),n.cache.set("buttonPath",l[m])),m==="input"&&(n.cache.set("inputIdx",i[m]-1),n.cache.set("inputPath",l[m])),(m==="ul"||m==="ol")&&(n.cache.set("ulIdx",i[m]-1),n.cache.set("ulPath",l[m]));const C=f.evaluate(o,n);C&&t.push(C)}o=r.nextNode(),s++}return t},Re=(e,t=!0)=>{e.element&&(t?(e.element.classList.add("a11y-highlighted"),e.element.style.outline="2px solid #ff9800",e.element.style.backgroundColor="#fff3cd"):(e.element.classList.remove("a11y-highlighted"),e.element.style.outline="",e.element.style.backgroundColor=""))},ha=e=>{e||(e=io());const t=e.filter(o=>o.severity==="error").length,n=e.filter(o=>o.severity==="warning").length;let r=100-t*20-n*5;return Math.max(0,r)},ba=e=>{const t=dn.find(n=>n.id===e.rule);t&&t.fix&&t.fix(e)},ao=()=>{const e=io(),t=ha(e),r=ga()?{overlay:"rgba(0, 0, 0, 0.62)",dialogBg:"#1f2937",panelBg:"#222d3a",border:"#3b4657",text:"#e2e8f0",muted:"#9fb0c6",closeHover:"#334155",summaryBg:"#111827",issueBg:"#1f2937",issueHoverBg:"#273244",issueBorder:"#4b5563",issueHoverBorder:"#58a6ff",fixBtn:"#3b82f6",fixBtnHover:"#2563eb"}:{overlay:"rgba(0, 0, 0, 0.5)",dialogBg:"#ffffff",panelBg:"#ffffff",border:"#e0e0e0",text:"#1f2937",muted:"#666666",closeHover:"#f0f0f0",summaryBg:"#f5f5f5",issueBg:"#ffffff",issueHoverBg:"#f5f9ff",issueBorder:"#e0e0e0",issueHoverBorder:"#2196f3",fixBtn:"#2196f3",fixBtnHover:"#1976d2"},o=document.createElement("div");o.className="a11y-dialog-overlay",o.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${r.overlay};
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;const i=document.createElement("div");i.className="a11y-dialog",i.style.cssText=`
    background: ${r.dialogBg};
    border: 1px solid ${r.border};
    color: ${r.text};
    border-radius: 8px;
    max-width: 800px;
    width: 90%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  `;const l=document.createElement("div");l.style.cssText=`
    padding: 20px;
    border-bottom: 1px solid ${r.border};
    background: ${r.panelBg};
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;const s=document.createElement("h2");s.style.cssText=`margin: 0; font-size: 20px; font-weight: 600; color: ${r.text};`,s.textContent="Accessibility Checker";const c=document.createElement("div");c.style.cssText=`
    font-size: 24px;
    font-weight: bold;
    padding: 8px 16px;
    border-radius: 4px;
    background: ${t>=80?"#4caf50":t>=60?"#ff9800":"#f44336"};
    color: white;
  `,c.textContent=`${t}/100`;const u=document.createElement("button");u.textContent="✕",u.style.cssText=`
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: ${r.muted};
  `,u.onmouseover=()=>{u.style.background=r.closeHover,u.style.color="#f8fafc"},u.onmouseout=()=>{u.style.background="none",u.style.color=r.muted},u.onclick=()=>{e.forEach(f=>Re(f,!1)),o.remove()};const h=document.createElement("div");h.style.cssText="display: flex; align-items: center; gap: 16px;",h.appendChild(s),h.appendChild(c),l.appendChild(h),l.appendChild(u);const g=document.createElement("div");if(g.style.cssText=`
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: ${r.dialogBg};
  `,e.length===0)g.innerHTML=`
      <div style="text-align: center; padding: 40px 20px;">
        <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
        <h3 style="margin: 0 0 8px 0; color: #4caf50;">No issues found!</h3>
        <p style="margin: 0; color: ${r.muted};">Your content meets WCAG 2.1 AA standards.</p>
      </div>
    `;else{const f=document.createElement("div");f.style.cssText=`
      background: ${r.summaryBg};
      border: 1px solid ${r.border};
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 20px;
      display: flex;
      gap: 20px;
    `;const C=e.filter(w=>w.severity==="error").length,k=e.filter(w=>w.severity==="warning").length,b=e.filter(w=>w.severity==="info").length;f.innerHTML=`
      <div><strong style="color: #f44336;">${C}</strong> <span style="color: ${r.muted};">Errors</span></div>
      <div><strong style="color: #ff9800;">${k}</strong> <span style="color: ${r.muted};">Warnings</span></div>
      <div><strong style="color: #2196f3;">${b}</strong> <span style="color: ${r.muted};">Info</span></div>
    `,g.appendChild(f),e.forEach(w=>{const x=document.createElement("div");x.style.cssText=`
        border: 1px solid ${r.issueBorder};
        border-radius: 6px;
        padding: 16px;
        margin-bottom: 12px;
        transition: all 0.2s;
        background: ${r.issueBg};
        color: ${r.text};
      `,x.onmouseover=()=>{x.style.borderColor=r.issueHoverBorder,x.style.background=r.issueHoverBg,Re(w,!0)},x.onmouseout=()=>{x.style.borderColor=r.issueBorder,x.style.background=r.issueBg,Re(w,!1)};const L=w.severity==="error"?"#f44336":w.severity==="warning"?"#ff9800":"#2196f3";if(x.innerHTML=`
        <div style="display: flex; align-items: start; gap: 12px; margin-bottom: 8px;">
          <span style="
            background: ${L};
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          ">${w.severity}</span>
          <div style="flex: 1;">
            <div style="font-weight: 600; margin-bottom: 4px;">${w.message}</div>
            <div style="font-size: 12px; color: ${r.muted};">WCAG ${w.wcag} · ${w.rule}</div>
          </div>
        </div>
        <div style="font-size: 14px; color: ${r.text}; margin-bottom: 8px; padding-left: 68px;">
          ${w.suggestion||""}
        </div>
      `,w.fixable){const E=document.createElement("button");E.textContent=`🔧 ${w.fixLabel||"Auto-fix"}`,E.style.cssText=`
          background: ${r.fixBtn};
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          margin-left: 68px;
        `,E.onmouseover=()=>E.style.background=r.fixBtnHover,E.onmouseout=()=>E.style.background=r.fixBtn,E.onclick=()=>{ba(w),E.textContent="✓ Fixed",E.style.background="#4caf50",E.disabled=!0,E.style.cursor="not-allowed",Re(w,!1),setTimeout(()=>{o.remove(),ao()},1e3)},x.appendChild(E)}g.appendChild(x)})}i.appendChild(l),i.appendChild(g),o.appendChild(i),document.body.appendChild(o),o.onclick=f=>{f.target===o&&(e.forEach(C=>Re(C,!1)),o.remove())};const m=f=>{f.key==="Escape"&&(e.forEach(C=>Re(C,!1)),o.remove(),document.removeEventListener("keydown",m))};document.addEventListener("keydown",m)},Ha=()=>({name:"a11yChecker",toolbar:[{label:"Accessibility",command:"toggleA11yChecker",icon:'<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M9 6.82954C10.1652 6.4177 11 5.30646 11 4.00024C11 2.34339 9.65686 1.00024 8 1.00024C6.34315 1.00024 5 2.34339 5 4.00024C5 5.30646 5.83481 6.4177 7 6.82954V12.0002C7 13.6571 8.34315 15.0002 10 15.0002H14.9296C15.264 15.0002 15.5762 15.1673 15.7617 15.4455L18.4913 19.54C19.1914 20.5901 20.6772 20.7373 21.5696 19.8448L22.7071 18.7074C23.0976 18.3168 23.0976 17.6837 22.7071 17.2931C22.3166 16.9026 21.6834 16.9026 21.2929 17.2931L20.1554 18.4306L17.4258 14.3361C16.8694 13.5015 15.9327 13.0002 14.9296 13.0002H10C9.44772 13.0002 9 12.5525 9 12.0002V11.0002H15C15.5523 11.0002 16 10.5525 16 10.0002C16 9.44796 15.5523 9.00025 15 9.00025H9V6.82954ZM8 5.10758C7.38844 5.10758 6.89267 4.61181 6.89267 4.00024C6.89267 3.38868 7.38844 2.89291 8 2.89291C8.61157 2.89291 9.10734 3.38868 9.10734 4.00024C9.10734 4.61181 8.61157 5.10758 8 5.10758Z" fill="#0F0F0F"></path> <path d="M4.6328 9.07414C5.10517 8.78987 5.69738 9.0279 5.91645 9.53381C6.13552 10.0397 5.89604 10.6205 5.43795 10.9272C4.92993 11.2673 4.48018 11.6911 4.10882 12.1826C3.53598 12.9408 3.16922 13.8345 3.04425 14.7765C2.91928 15.7185 3.04036 16.6768 3.3957 17.5582C3.75103 18.4395 4.32852 19.2138 5.07194 19.8058C5.81535 20.3977 6.69937 20.787 7.63791 20.9359C8.57646 21.0847 9.53756 20.988 10.4276 20.6552C11.3177 20.3223 12.1065 19.7647 12.7171 19.0366C13.1129 18.5645 13.4251 18.0313 13.6428 17.46C13.8391 16.9448 14.3514 16.5813 14.8936 16.6815C15.4357 16.7816 15.8004 17.3054 15.6291 17.8295C15.3326 18.7372 14.8644 19.583 14.2468 20.3194C13.4147 21.3117 12.3399 22.0716 11.1269 22.5252C9.91394 22.9787 8.6042 23.1105 7.32518 22.9077C6.04617 22.7048 4.84148 22.1742 3.82838 21.3676C2.81528 20.561 2.02831 19.5058 1.54407 18.3047C1.05983 17.1037 0.894836 15.7977 1.06514 14.5139C1.23545 13.2302 1.73525 12.0124 2.51589 10.9791C3.09523 10.2123 3.81459 9.56654 4.6328 9.07414Z" fill="#0F0F0F"></path> </g></svg>',shortcut:"Mod-Shift-Alt-a"}],commands:{toggleA11yChecker:()=>{try{return ao(),!0}catch(e){return console.error("Failed to open accessibility checker:",e),!1}}},keymap:{"Mod-Shift-Alt-a":"toggleA11yChecker"}});export{Ha as A,ya as B,Ra as F,ka as H,xa as I,Ea as L,_a as M,Ta as T,wa as U,Ca as a,li as b,si as c,Sa as d,La as e,Mo as f,Ro as g,Aa as h,Ma as i,Na as j,fa as p};
