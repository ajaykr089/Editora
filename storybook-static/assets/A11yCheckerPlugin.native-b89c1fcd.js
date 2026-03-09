const pa=()=>({name:"bold",marks:{bold:{parseDOM:[{tag:"strong"},{tag:"b"},{style:"font-weight",getAttrs:e=>{const t=typeof e=="string"?e:e.style.fontWeight;return/^(bold(er)?|[5-9]\d{2,})$/.test(t)&&null}}],toDOM:()=>["strong",0]}},toolbar:[{label:"Bold",command:"toggleBold",icon:'<svg width="24" height="24" focusable="false"><path d="M7.8 19c-.3 0-.5 0-.6-.2l-.2-.5V5.7c0-.2 0-.4.2-.5l.6-.2h5c1.5 0 2.7.3 3.5 1 .7.6 1.1 1.4 1.1 2.5a3 3 0 0 1-.6 1.9c-.4.6-1 1-1.6 1.2.4.1.9.3 1.3.6s.8.7 1 1.2c.4.4.5 1 .5 1.6 0 1.3-.4 2.3-1.3 3-.8.7-2.1 1-3.8 1H7.8Zm5-8.3c.6 0 1.2-.1 1.6-.5.4-.3.6-.7.6-1.3 0-1.1-.8-1.7-2.3-1.7H9.3v3.5h3.4Zm.5 6c.7 0 1.3-.1 1.7-.4.4-.4.6-.9.6-1.5s-.2-1-.7-1.4c-.4-.3-1-.4-2-.4H9.4v3.8h4Z" fill-rule="evenodd"></path></svg>',shortcut:"Mod-b"}],commands:{toggleBold:()=>(document.execCommand("bold",!1),!0)},keymap:{"Mod-b":"toggleBold","Mod-B":"toggleBold"}}),Ao=()=>(document.execCommand("italic",!1),!0),kr=(e,t)=>{var n;typeof window<"u"&&((n=window.registerEditorCommand)==null||n.call(window,e,t))},On=()=>{kr("toggleItalic",Ao)};typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",On):On());const ga=()=>({name:"italic",marks:{italic:{parseDOM:[{tag:"i"},{tag:"em"},{style:"font-style=italic"}],toDOM:()=>["em",0]}},toolbar:[{label:"Italic",command:"toggleItalic",type:"button",icon:'<svg width="24" height="24" focusable="false"><path d="M16.7 4.7l-.1.9h-.3c-.6 0-1 0-1.4.3-.3.3-.4.6-.5 1.1l-2.1 9.8v.6c0 .5.4.8 1.4.8h.2l-.2.8H8l.2-.8h.2c1.1 0 1.8-.5 2-1.5l2-9.8.1-.5c0-.6-.4-.8-1.4-.8h-.3l.2-.9h5.8Z" fill-rule="evenodd"></path></svg>',shortcut:"Mod-i"}],commands:{toggleItalic:Ao},keymap:{"Mod-i":"toggleItalic","Mod-I":"toggleItalic"}}),ha=()=>({name:"underline",marks:{underline:{parseDOM:[{tag:"u"}],toDOM:()=>["u",{},0]}},toolbar:[{label:"Underline",command:"toggleUnderline",icon:'<svg width="24" height="24" focusable="false"><path d="M16 5c.6 0 1 .4 1 1v7c0 2.8-2.2 5-5 5s-5-2.2-5-5V6c0-.6.4-1 1-1s1 .4 1 1v7c0 1.7 1.3 3 3 3s3-1.3 3-3V6c0-.6.4-1 1-1ZM4 17h16c.6 0 1 .4 1 1s-.4 1-1 1H4a1 1 0 1 1 0-2Z" fill-rule="evenodd"></path></svg>',shortcut:"Mod-u"}],commands:{toggleUnderline:()=>(document.execCommand("underline",!1),!0)},keymap:{"Mod-u":"toggleUnderline","Mod-U":"toggleUnderline"}}),So=()=>_o("insertUnorderedList"),Mo=()=>_o("insertOrderedList");function Cr(){const e=window.getSelection();if(e&&e.rangeCount>0){const n=e.getRangeAt(0).startContainer,o=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement,r=o==null?void 0:o.closest('[contenteditable="true"], .rte-content, .editora-content');if(r)return r}const t=document.activeElement;return t?t.getAttribute("contenteditable")==="true"?t:t.closest('[contenteditable="true"], .rte-content, .editora-content'):null}function Tr(e){e.querySelectorAll('ul:not([data-type="checklist"]), ol').forEach(n=>{Array.from(n.childNodes).forEach(r=>{if(r.nodeType===Node.TEXT_NODE){const l=(r.textContent||"").trim();if(!l){n.removeChild(r);return}const s=document.createElement("li");s.textContent=l,n.replaceChild(s,r);return}if(!(r instanceof HTMLElement)){n.removeChild(r);return}if(r.tagName==="LI")return;const i=document.createElement("li");for(;r.firstChild;)i.appendChild(r.firstChild);n.replaceChild(i,r)})})}function _o(e){const t=Cr();if(!t)return!1;const n=window.getSelection();if(!n||n.rangeCount===0)return!1;const o=n.getRangeAt(0);if(!t.contains(o.commonAncestorContainer))return!1;t.focus({preventScroll:!0});const r=document.execCommand(e,!1);return Tr(t),t.dispatchEvent(new Event("input",{bubbles:!0})),r!==!1}const zn=(e,t)=>{var n;typeof window<"u"&&((n=window.registerEditorCommand)==null||n.call(window,e,t))},Bn=()=>{zn("toggleBulletList",So),zn("toggleOrderedList",Mo)};typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Bn):Bn());const ba=()=>({name:"list",nodes:{bulletList:{content:"listItem+",group:"block",parseDOM:[{tag:"ul"}],toDOM:()=>["ul",0]},orderedList:{content:"listItem+",group:"block",parseDOM:[{tag:"ol"}],toDOM:()=>["ol",0]},listItem:{content:"paragraph",parseDOM:[{tag:"li"}],toDOM:()=>["li",0]}},toolbar:[{label:"Bullet List",command:"toggleBulletList",type:"button",icon:'<svg width="24" height="24" focusable="false"><path d="M11 5h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2ZM4.5 6c0 .4.1.8.4 1 .3.4.7.5 1.1.5.4 0 .8-.1 1-.4.4-.3.5-.7.5-1.1 0-.4-.1-.8-.4-1-.3-.4-.7-.5-1.1-.5-.4 0-.8.1-1 .4-.4.3-.5.7-.5 1.1Zm0 6c0 .4.1.8.4 1 .3.4.7.5 1.1.5.4 0 .8-.1 1-.4.4-.3.5-.7.5-1.1 0-.4-.1-.8-.4-1-.3-.4-.7-.5-1.1-.5-.4 0-.8.1-1 .4-.4.3-.5.7-.5 1.1Zm0 6c0 .4.1.8.4 1 .3.4.7.5 1.1.5.4 0 .8-.1 1-.4.4-.3.5-.7.5-1.1 0-.4-.1-.8-.4-1-.3-.4-.7-.5-1.1-.5-.4 0-.8.1-1 .4-.4.3-.5.7-.5 1.1Z" fill-rule="evenodd"></path></svg>',shortcut:"Mod-Shift-8"},{label:"Numbered List",command:"toggleOrderedList",type:"button",icon:'<svg width="24" height="24" focusable="false"><path d="M10 17h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 1 1 0-2ZM6 4v3.5c0 .3-.2.5-.5.5a.5.5 0 0 1-.5-.5V5h-.5a.5.5 0 0 1 0-1H6Zm-1 8.8l.2.2h1.3c.3 0 .5.2.5.5s-.2.5-.5.5H4.9a1 1 0 0 1-.9-1V13c0-.4.3-.8.6-1l1.2-.4.2-.3a.2.2 0 0 0 0-.2l-.7.3a.5.5 0 0 1-.7-.3.5.5 0 0 1 .3-.6l.7-.4c.5-.2 1.1 0 1.4.4.3.5.3 1.1-.1 1.5l-1.2.7Zm0 3.7v.5c0 .3.2.5.5.5h1c.3 0 .5.2.5.5s-.2.5-.5.5h-1a1.5 1.5 0 0 1-1.5-1.5v-.5c0-.3.1-.6.3-.8l1.3-1.4c.3-.4.1-.9-.2-1-.1 0-.2 0-.3.2l-.4.5a.5.5 0 0 1-.7.1.5.5 0 0 1-.1-.7l.4-.5c.5-.5 1.2-.6 1.8-.4.6.3 1 .9 1 1.6 0 .4-.2.8-.5 1.1l-1.3 1.4-.3.4Z" fill-rule="evenodd"></path></svg>',shortcut:"Mod-Shift-7"}],commands:{toggleBulletList:So,toggleOrderedList:Mo},keymap:{"Mod-Shift-8":"toggleBulletList","Mod-Shift-7":"toggleOrderedList"}}),Ro=".rte-content, .editora-content",$n=100,Pn="__editoraCommandEditorRoot",He=new Map,Yt={};let Fn=!1,Q=null;function Lr(e){if(!e)return null;const t=e.querySelector('[contenteditable="true"]');return t instanceof HTMLElement?t:null}function Ar(){if(typeof window>"u")return null;const e=window[Pn];if(!(e instanceof HTMLElement))return null;window[Pn]=null;const t=e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(e.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?e:null);if(t){const o=Lr(t);if(o)return o;if(t.getAttribute("contenteditable")==="true")return t}if(e.getAttribute("contenteditable")==="true")return e;const n=e.closest('[contenteditable="true"]');return n instanceof HTMLElement?n:null}function Sr(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function Qe(e){const t=Sr(e);if(!t)return null;const n=t.closest(Ro);if(n)return n;const o=t.closest('[contenteditable="true"]');if(!o)return null;let r=o,i=r.parentElement;for(;i;)i.getAttribute("contenteditable")==="true"&&(r=i),i=i.parentElement;return r}function wt(){const e=Ar();if(e&&document.contains(e))return e;const t=window.getSelection();if(t&&t.rangeCount>0){const i=Qe(t.getRangeAt(0).startContainer);if(i)return i}const n=document.activeElement;if(n){const i=Qe(n);if(i)return i}if(Q!=null&&Q.isConnected)return Q;const o=Array.from(He.keys()).find(i=>i.isConnected);if(o)return o;const r=document.querySelector(Ro);return r||document.querySelector('[contenteditable="true"]')}function No(){for(const e of He.keys())e.isConnected||(He.delete(e),Q===e&&(Q=null))}function rn(e){No();let t=He.get(e);return t||(t={undoStack:[],redoStack:[]},He.set(e,t)),t}function De(e){e&&e.dispatchEvent(new Event("input",{bubbles:!0}))}function qn(e){return e?e.innerHTML:""}function Et(e,t){if(!e)return;const n=rn(e);n.undoStack.push(t),n.redoStack.length=0,n.undoStack.length>$n&&n.undoStack.splice(0,n.undoStack.length-$n),Q=e}function Io(e,t="undo"){if(No(),e!=null&&e.isConnected)return e;const n=wt();if(n!=null&&n.isConnected)return n;if(Q!=null&&Q.isConnected)return Q;const o=r=>t==="undo"?r.undoStack.length>0:r.redoStack.length>0;for(const[r,i]of He.entries())if(r.isConnected&&o(i))return r;return null}function Un(e){const t={};for(const r of e.getAttributeNames()){const i=e.getAttribute(r);i!==null&&(t[r]=i)}const n=e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLSelectElement,o=e instanceof HTMLInputElement;return{attributes:t,innerHTML:e.innerHTML,value:n?e.value:null,checked:o?e.checked:null}}function Vn(e,t){const n=new Set(e.getAttributeNames());Object.keys(t.attributes).forEach(o=>n.delete(o)),n.forEach(o=>e.removeAttribute(o)),Object.entries(t.attributes).forEach(([o,r])=>{e.setAttribute(o,r)}),e.innerHTML!==t.innerHTML&&(e.innerHTML=t.innerHTML),t.value!==null&&(e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLSelectElement)&&(e.value=t.value),t.checked!==null&&e instanceof HTMLInputElement&&(e.checked=t.checked)}function ge(e,t){if(Yt[e]=t,typeof window>"u")return;const n=window.registerEditorCommand;typeof n=="function"?n(e,t):(window.registerEditorCommand=(o,r)=>{Yt[o]=r},window.registerEditorCommand(e,t))}const Wn=(e,...t)=>{const n=Yt[e];return n?n(...t):!1};function Zt(){Fn||typeof window>"u"||(Fn=!0,window.execEditorCommand||(window.execEditorCommand=Wn),window.executeEditorCommand||(window.executeEditorCommand=Wn),ge("undo",Do),ge("redo",Oo),ge("setAttribute",zo),ge("setText",Bo),ge("autoFixA11y",$o),ge("recordDomTransaction",Po),ge("undoDom",an),ge("redoDom",ln))}function Ho(e,t){const n=t||wt(),o=qn(n);n==null||n.focus({preventScroll:!0});let r=!1;try{r=!!document.execCommand(e,!1)}catch{r=!1}const i=qn(n),l=o!==i;return l&&De(n),{executed:r,changed:l}}const Do=()=>{const e=wt();return Ho("undo",e).changed?!0:an(e??void 0)},Oo=()=>{const e=wt();return Ho("redo",e).changed?!0:ln(e??void 0)},zo=(e,t,n)=>{if(!(e instanceof HTMLElement))return;const o=Qe(e),r=e.hasAttribute(t),i=e.getAttribute(t);e.setAttribute(t,n),Et(o,{undo:()=>{e.isConnected&&(r&&i!==null?e.setAttribute(t,i):e.removeAttribute(t))},redo:()=>{e.isConnected&&e.setAttribute(t,n)}}),De(o)},Bo=(e,t)=>{if(!(e instanceof HTMLElement))return;const n=Qe(e),o=e.textContent??"";e.textContent=t,Et(n,{undo:()=>{e.isConnected&&(e.textContent=o)},redo:()=>{e.isConnected&&(e.textContent=t)}}),De(n)},$o=e=>{var l;const t=e==null?void 0:e.element;if(!(t instanceof HTMLElement))return;const n=Qe(t),o=(l=window.a11yRuleRegistry)==null?void 0:l.find(s=>s.id===e.rule);if(!o||typeof o.fix!="function")return;const r=Un(t);o.fix(e);const i=Un(t);Et(n,{undo:()=>{t.isConnected&&Vn(t,r)},redo:()=>{t.isConnected&&Vn(t,i)}}),De(n)},Po=(e,t,n)=>{if(!(e instanceof HTMLElement))return!1;const o=typeof n=="string"?n:e.innerHTML;return t===o?!1:(Et(e,{undo:()=>{e.isConnected&&(e.innerHTML=t)},redo:()=>{e.isConnected&&(e.innerHTML=o)}}),!0)},an=e=>{const t=Io(e,"undo");if(!t)return!1;const n=rn(t),o=n.undoStack.pop();return o?(o.undo(),n.redoStack.push(o),Q=t,De(t),!0):!1},ln=e=>{const t=Io(e,"redo");if(!t)return!1;const n=rn(t),o=n.redoStack.pop();return o?(o.redo(),n.undoStack.push(o),Q=t,De(t),!0):!1};typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Zt,{once:!0}):Zt());const va=()=>(Zt(),{name:"history",toolbar:[{label:"Undo",command:"undo",type:"button",icon:'<svg width="24" height="24" focusable="false"><path d="M6.4 8H12c3.7 0 6.2 2 6.8 5.1.6 2.7-.4 5.6-2.3 6.8a1 1 0 0 1-1-1.8c1.1-.6 1.8-2.7 1.4-4.6-.5-2.1-2.1-3.5-4.9-3.5H6.4l3.3 3.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 1.4L6.4 8Z" fill-rule="nonzero"></path></svg>',shortcut:"Mod-z"},{label:"Redo",command:"redo",type:"button",icon:'<svg width="24" height="24" focusable="false"><path d="M17.6 10H12c-2.8 0-4.4 1.4-4.9 3.5-.4 2 .3 4 1.4 4.6a1 1 0 1 1-1 1.8c-2-1.2-2.9-4.1-2.3-6.8.6-3 3-5.1 6.8-5.1h5.6l-3.3-3.3a1 1 0 1 1 1.4-1.4l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4l3.3-3.3Z" fill-rule="nonzero"></path></svg>',shortcut:"Mod-y"}],commands:{undo:Do,redo:Oo,setAttribute:zo,setText:Bo,autoFixA11y:$o,recordDomTransaction:Po,undoDom:an,redoDom:ln},keymap:{"Mod-z":"undo","Mod-Z":"undo","Mod-y":"redo","Mod-Y":"redo","Mod-Shift-z":"redo","Mod-Shift-Z":"redo"}});let me=null,bt=!1,ee=null;const st='[data-theme="dark"], .dark, .editora-theme-dark',Mr=e=>{if(!e)return null;let t=e;for(;t;){if(t.hasAttribute("contenteditable")&&t.getAttribute("contenteditable")==="true"||t.hasAttribute("data-editora-content"))return t;t=t.parentElement}return null},_r=e=>{if(e){const n=e.startContainer,o=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement;if(o!=null&&o.closest(st))return!0}const t=document.activeElement;return t!=null&&t.closest(st)?!0:document.body.matches(st)||document.documentElement.matches(st)},Rr=()=>{if(document.getElementById("rte-link-dialog-theme-styles"))return;const e=document.createElement("style");e.id="rte-link-dialog-theme-styles",e.textContent=`
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
  `,document.head.appendChild(e)},Nr=e=>{if(!me){console.warn("No selection range stored");return}const t=me.startContainer,n=t.nodeType===Node.TEXT_NODE?t.parentElement:t,o=Mr(n);if(o){if(bt&&ee){ee.href=e.url,ee.textContent=e.text,ee.target=e.target,e.target==="_blank"?ee.setAttribute("rel","noopener noreferrer"):ee.removeAttribute("rel"),e.title?ee.title=e.title:ee.removeAttribute("title");const r=document.createRange();r.selectNodeContents(ee);const i=window.getSelection();i&&(i.removeAllRanges(),i.addRange(r))}else{const r=document.createElement("a");r.href=e.url,r.textContent=e.text,r.target=e.target,e.target==="_blank"&&r.setAttribute("rel","noopener noreferrer"),e.title&&(r.title=e.title),me.deleteContents(),me.insertNode(r),me.setStartAfter(r),me.setEndAfter(r);const i=window.getSelection();i&&(i.removeAllRanges(),i.addRange(me))}o.focus(),me=null,bt=!1,ee=null}},Gn=(e,t)=>{Rr();const n=document.createElement("div");n.className="link-dialog-overlay",t&&n.classList.add("rte-theme-dark"),n.style.cssText=`
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
  `;const o=document.createElement("div");o.className="link-dialog",o.style.cssText=`
    background: white;
    border-radius: 8px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  `,o.innerHTML=`
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
  `,n.appendChild(o),document.body.appendChild(n);const r=o.querySelector("#link-form"),i=o.querySelector("#link-text"),l=o.querySelector("#link-url"),s=o.querySelector("#link-title"),c=o.querySelector("#link-target"),u=o.querySelector(".link-dialog-close"),g=o.querySelector(".btn-cancel"),p=f=>{f.key==="Escape"&&(f.preventDefault(),f.stopPropagation(),m())},m=()=>{document.removeEventListener("keydown",p,!0),n.remove()};u.addEventListener("click",m),g.addEventListener("click",m),n.addEventListener("click",f=>{f.target===n&&m()}),document.addEventListener("keydown",p,!0),r.addEventListener("submit",f=>{f.preventDefault();const C=l.value.trim();C&&(Nr({text:i.value.trim()||C,url:C,target:c.checked?"_blank":"_self",title:s.value.trim()||void 0}),m())}),setTimeout(()=>i.focus(),100)},Fo=()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return!1;const t=e.getRangeAt(0).cloneRange();me=t;const n=_r(t),o=e.toString()||"",r=t.startContainer,i=r.nodeType===Node.TEXT_NODE?r.parentElement:r,l=i==null?void 0:i.closest("a");return l?(bt=!0,ee=l,Gn({text:l.textContent||"",url:l.href,target:l.target||"_self",title:l.title||"",isEditing:!0},n)):(bt=!1,ee=null,Gn({text:o,url:"",target:"_self",isEditing:!1},n)),!0},qo=()=>(document.execCommand("unlink",!1),!0),zt=(e,t)=>{var n;typeof window<"u"&&((n=window.registerEditorCommand)==null||n.call(window,e,t))},jn=()=>{zt("openLinkDialog",Fo),zt("removeLink",qo),zt("createLink",e=>{e&&document.execCommand("createLink",!1,e)})};typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",jn):jn());const ya=()=>({name:"link",marks:{link:{attrs:{href:{},title:{default:null},target:{default:null}},parseDOM:[{tag:"a[href]",getAttrs:e=>({href:e.getAttribute("href"),title:e.getAttribute("title"),target:e.getAttribute("target")})}],toDOM:e=>["a",{href:e.attrs.href,title:e.attrs.title,target:e.attrs.target,rel:e.attrs.target==="_blank"?"noopener noreferrer":null},0]}},toolbar:[{label:"Link",command:"openLinkDialog",type:"button",icon:'<svg width="24" height="24" focusable="false"><path d="M6.2 12.3a1 1 0 0 1 1.4 1.4l-2 2a2 2 0 1 0 2.6 2.8l4.8-4.8a1 1 0 0 0 0-1.4 1 1 0 1 1 1.4-1.3 2.9 2.9 0 0 1 0 4L9.6 20a3.9 3.9 0 0 1-5.5-5.5l2-2Zm11.6-.6a1 1 0 0 1-1.4-1.4l2-2a2 2 0 1 0-2.6-2.8L11 10.3a1 1 0 0 0 0 1.4A1 1 0 1 1 9.6 13a2.9 2.9 0 0 1 0-4L14.4 4a3.9 3.9 0 0 1 5.5 5.5l-2 2Z" fill-rule="nonzero"></path></svg>',shortcut:"Mod-k"}],commands:{openLinkDialog:Fo,removeLink:qo},keymap:{"Mod-k":"openLinkDialog"}});function Ir(){const e=window.getSelection();if(!e||!e.rangeCount)return null;const n=e.getRangeAt(0).startContainer,o=n.nodeType===Node.TEXT_NODE?n.parentElement:n;return Hr(o)}function Hr(e){if(!e)return null;if(e.hasAttribute("data-editora-editor"))return e;let t=e.parentElement;for(;t;){if(t.hasAttribute("data-editora-editor"))return t;t=t.parentElement}return null}function Dr(e){return e?e.querySelector(".rte-content"):(console.warn("[Editora] Editor container not found"),null)}let I=null,$=null,Xn=null,Yn=null,Zn=null,Kn=null,Qn=null;const Bt='[data-theme="dark"], .dark, .editora-theme-dark';let Ze=!1,Pe=null,Jn=0,eo=0,$t=!1,to=0,no=0,oo=0,ro=0;const Or=()=>{const e=Ir(),t=Dr(e);if(!t)return alert("Please place your cursor in the editor before inserting a table"),!1;const n=window.getSelection();if(!n||n.rangeCount===0)return;const o=n.getRangeAt(0),r=document.createElement("table");r.className="rte-table";const i=document.createElement("thead"),l=document.createElement("tr");for(let u=0;u<3;u++){const g=document.createElement("th"),p=document.createElement("p");p.appendChild(document.createElement("br")),g.appendChild(p),l.appendChild(g)}i.appendChild(l);const s=document.createElement("tbody");for(let u=0;u<2;u++){const g=document.createElement("tr");for(let p=0;p<3;p++){const m=document.createElement("td"),f=document.createElement("p");f.appendChild(document.createElement("br")),m.appendChild(f),g.appendChild(m)}s.appendChild(g)}r.appendChild(i),r.appendChild(s),o.deleteContents(),o.insertNode(r);const c=r.querySelector("th p");if(c){const u=document.createRange();u.setStart(c,0),u.collapse(!0),n.removeAllRanges(),n.addRange(u)}t.focus()},zr=()=>{var l;const e=oe();if(!e)return;const{table:t,rowIndex:n}=e,o=document.createElement("tr"),r=((l=t.rows[0])==null?void 0:l.cells.length)||0;for(let s=0;s<r;s++){const c=document.createElement("td"),u=document.createElement("p");u.innerHTML="<br>",c.appendChild(u),o.appendChild(c)}const i=t.rows[n];i&&i.parentElement?i.parentElement.insertBefore(o,i):t.appendChild(o),fe()},sn=()=>{var i;const e=oe();if(!e)return;const{table:t,rowIndex:n}=e,o=document.createElement("tr"),r=((i=t.rows[0])==null?void 0:i.cells.length)||0;for(let l=0;l<r;l++){const s=document.createElement("td"),c=document.createElement("p");c.innerHTML="<br>",s.appendChild(c),o.appendChild(s)}n>=t.rows.length-1?t.appendChild(o):t.insertBefore(o,t.rows[n+1]),fe()},Br=()=>{const e=oe();if(!e)return;const{table:t,colIndex:n}=e;for(let o=0;o<t.rows.length;o++){const r=t.rows[o],i=document.createElement("td"),l=document.createElement("p");l.innerHTML="<br>",i.appendChild(l),n===0?r.insertBefore(i,r.cells[0]):r.insertBefore(i,r.cells[n])}fe()},cn=()=>{const e=oe();if(!e)return;const{table:t,colIndex:n}=e;for(let o=0;o<t.rows.length;o++){const r=t.rows[o],i=document.createElement("td"),l=document.createElement("p");l.innerHTML="<br>",i.appendChild(l),n>=r.cells.length-1?r.appendChild(i):r.insertBefore(i,r.cells[n+1])}fe()},$r=()=>{const e=oe();if(!e||e.rowCount<=1)return;const{table:t,rowIndex:n}=e;t.deleteRow(n),fe()},Pr=()=>{const e=oe();if(!e||e.cellCount<=1)return;const{table:t,colIndex:n}=e;for(let o=0;o<t.rows.length;o++){const r=t.rows[o];r.cells[n]&&r.deleteCell(n)}fe()},Fr=()=>{var i;const e=oe();if(!e)return;const{table:t,rowIndex:n}=e,o=t.rows[n];if(((i=o.parentElement)==null?void 0:i.tagName.toLowerCase())==="thead"){const l=t.querySelector("tbody")||t.appendChild(document.createElement("tbody")),s=t.querySelector("thead");s&&(l.insertBefore(o,l.firstChild),s.rows.length===0&&s.remove())}else{let l=t.querySelector("thead");l||(l=document.createElement("thead"),t.insertBefore(l,t.firstChild)),l.appendChild(o)}fe()},qr=()=>{var o;const e=oe();if(!e)return;const{table:t,colIndex:n}=e;for(let r=0;r<t.rows.length;r++){const i=t.rows[r].cells[n];if(i){const l=i.tagName.toLowerCase()==="th"?"td":"th",s=document.createElement(l);s.innerHTML=i.innerHTML;for(let c=0;c<i.attributes.length;c++){const u=i.attributes[c];s.setAttribute(u.name,u.value)}(o=i.parentNode)==null||o.replaceChild(s,i)}}fe()},Ur=()=>{const e=oe();if(!e)return;e.table.remove(),document.dispatchEvent(new CustomEvent("tableDeleted"))},Vr=()=>{var p,m;const e=window.getSelection();if(!e||e.rangeCount===0)return;const n=e.getRangeAt(0).startContainer;if(!(n.nodeType===Node.TEXT_NODE?(p=n.parentElement)==null?void 0:p.closest("table"):n.closest("table")))return;let r=null;if(n.nodeType===Node.TEXT_NODE?r=(m=n.parentElement)==null?void 0:m.closest("td, th"):n.nodeType===Node.ELEMENT_NODE&&(r=n.closest("td, th")),!r)return;const i=r.parentElement;if(!i)return;let l=-1;for(let f=0;f<i.cells.length;f++)if(i.cells[f]===r){l=f;break}if(l===-1||l===i.cells.length-1)return;const s=i.cells[l+1];if(!s)return;const c=parseInt(r.getAttribute("colspan")||"1"),u=parseInt(s.getAttribute("colspan")||"1");r.setAttribute("colspan",String(c+u)),Array.from(s.childNodes).forEach(f=>{r.appendChild(f)}),s.remove(),fe()};function oe(){var c,u,g;const e=window.getSelection();if(!e||e.rangeCount===0)return null;const n=e.getRangeAt(0).startContainer;let o=n.nodeType===Node.TEXT_NODE?(c=n.parentElement)==null?void 0:c.closest("table"):n.closest("table");if(!o)return null;const r=o;let i=0,l=0;const s=n.nodeType===Node.TEXT_NODE?(u=n.parentElement)==null?void 0:u.closest("td, th"):n.closest("td, th");if(s){let p=s.parentElement;for(;p&&p!==r.rows[i]&&(i++,!(i>=r.rows.length)););const m=p;if(m){for(let f=0;f<m.cells.length;f++)if(m.cells[f]===s){l=f;break}}}return{table:r,rowIndex:i,colIndex:l,rowCount:r.rows.length,cellCount:((g=r.rows[0])==null?void 0:g.cells.length)||0}}function fe(){if(!I||!$)return;const e=oe();if(!e)return;const t=e.rowCount>1,n=e.cellCount>1;Uo(t,n)}function Wr(){Xn=()=>{const e=oe();e?Gr(e.table):Pt()},Yn=e=>{const t=e.target,n=t.closest("table"),o=t.closest(".table-toolbar");!n&&!o&&Pt()},Zn=()=>{Pt()},Kn=()=>{$&&I&&I.style.display!=="none"&&Kt($)},Qn=()=>{$&&I&&I.style.display!=="none"&&Kt($)},document.addEventListener("selectionchange",Xn),document.addEventListener("mousedown",Yn),document.addEventListener("tableDeleted",Zn),window.addEventListener("scroll",Kn,!0),window.addEventListener("resize",Qn)}function Kt(e){if(!I)return;const t=e.getBoundingClientRect(),n=I.getBoundingClientRect(),o=n.height||40,r=n.width||280,i=10;let l=t.top-o-i,s=t.left+t.width/2-r/2;l<i&&(l=t.bottom+i),s<i&&(s=i);const c=window.innerWidth;s+r>c-i&&(s=c-r-i);const u=window.innerHeight;l+o>u-i&&(l=u-o-i),I.style.top=l+"px",I.style.left=s+"px"}function Gr(e){$=e,I||(I=jr(),document.body.appendChild(I));const t=!!e.closest(Bt)||document.body.matches(Bt)||document.documentElement.matches(Bt);I.classList.toggle("rte-theme-dark",t),I.style.display="flex",I.style.visibility="hidden",requestAnimationFrame(()=>{Kt(e),I&&(I.style.visibility="visible")});const n=oe();n&&Uo(n.rowCount>1,n.cellCount>1),Yr(e)}function Pt(){if(I&&(I.style.display="none"),$){$.querySelectorAll(".resize-handle").forEach(n=>n.remove());const t=$.querySelector(".table-resize-handle");t&&t.remove()}$=null}function Uo(e,t){if(!I)return;const n=I.querySelector('[data-action="deleteRow"]'),o=I.querySelector('[data-action="deleteColumn"]');n&&(n.disabled=!e),o&&(o.disabled=!t)}function jr(){const e=document.createElement("div");e.className="table-toolbar",e.style.cssText=`
    position: fixed;
    z-index: 1000;
    display: none;
  `,e.setAttribute("role","toolbar"),e.setAttribute("aria-label","Table editing toolbar");const t=g=>{const p=document.createElement("button");return p.className="toolbar-icon-btn",g.danger&&p.classList.add("toolbar-icon-btn-danger"),g.delete&&p.classList.add("toolbar-icon-btn-delete"),p.innerHTML=g.icon,p.title=g.title,p.setAttribute("aria-label",g.title),p.setAttribute("type","button"),p.setAttribute("data-action",g.action),p.onclick=()=>Xr(g.action),p},n=()=>{const g=document.createElement("div");return g.className="toolbar-divider",g},o=(...g)=>{const p=document.createElement("div");return p.className="toolbar-section",g.forEach(m=>p.appendChild(m)),p},r=o(t({icon:Qr(),title:"Add row above (Ctrl+Shift+R)",action:"addRowAbove"}),t({icon:Jr(),title:"Add row below",action:"addRowBelow"}),t({icon:ei(),title:"Delete row",action:"deleteRow",danger:!0})),i=o(t({icon:ti(),title:"Add column left",action:"addColumnLeft"}),t({icon:ni(),title:"Add column right (Ctrl+Shift+C)",action:"addColumnRight"}),t({icon:oi(),title:"Delete column",action:"deleteColumn",danger:!0})),l=o(t({icon:ri(),title:"Toggle header row",action:"toggleHeaderRow"}),t({icon:ii(),title:"Toggle header column",action:"toggleHeaderColumn"})),s=o(t({icon:li(),title:"Merge cells (horizontally)",action:"mergeCells"})),c=o(t({icon:ai(),title:"Delete table",action:"deleteTable",delete:!0}));e.appendChild(r),e.appendChild(n()),e.appendChild(i),e.appendChild(n()),e.appendChild(l),e.appendChild(n()),e.appendChild(s),e.appendChild(n()),e.appendChild(c);const u=g=>{!I||I.style.display==="none"||(g.ctrlKey||g.metaKey)&&g.shiftKey&&(g.key==="r"||g.key==="R"?(g.preventDefault(),sn()):(g.key==="c"||g.key==="C")&&(g.preventDefault(),cn()))};return window.addEventListener("keydown",u),e}function Xr(e){switch(e){case"addRowAbove":zr();break;case"addRowBelow":sn();break;case"addColumnLeft":Br();break;case"addColumnRight":cn();break;case"deleteRow":$r();break;case"deleteColumn":Pr();break;case"toggleHeaderRow":Fr();break;case"toggleHeaderColumn":qr();break;case"deleteTable":Ur();break;case"mergeCells":Vr();break}}function Yr(e){e.querySelectorAll(".resize-handle").forEach(l=>l.remove());const n=e.querySelector(".table-resize-handle");n&&n.remove();const o=e.querySelector("thead tr, tbody tr:first-child");if(!o)return;const r=o.querySelectorAll("td, th");r.forEach((l,s)=>{if(s===r.length-1)return;const c=document.createElement("div");c.className="resize-handle",c.style.cssText=`
      position: absolute;
      right: -4px;
      top: 0;
      bottom: 0;
      width: 8px;
      background: transparent;
      cursor: col-resize;
      z-index: 10;
      transition: background 0.15s ease;
    `,c.addEventListener("mouseenter",()=>{Ze||(c.style.background="rgba(0, 102, 204, 0.3)")}),c.addEventListener("mouseleave",()=>{Ze||(c.style.background="transparent")}),c.addEventListener("mousedown",u=>{u.preventDefault(),u.stopPropagation(),Zr(u,s)}),l.style.position="relative",l.appendChild(c)});const i=document.createElement("div");i.className="table-resize-handle",i.addEventListener("mousedown",l=>{l.preventDefault(),l.stopPropagation(),Kr(l)}),e.appendChild(i)}function Zr(e,t){if(Ze=!0,Pe=t,Jn=e.clientX,!$)return;const n=$.querySelector("thead tr, tbody tr:first-child");n&&n.cells[t]&&(eo=n.cells[t].offsetWidth),document.body.style.cursor="col-resize",document.body.style.userSelect="none";const o=i=>{if(!Ze||Pe===null||!$)return;const l=i.clientX-Jn,s=Math.max(50,eo+l);$.querySelectorAll("tr").forEach(u=>{u.cells[Pe]&&(u.cells[Pe].style.width=s+"px")})},r=()=>{Ze=!1,Pe=null,document.body.style.cursor="",document.body.style.userSelect="",document.removeEventListener("mousemove",o),document.removeEventListener("mouseup",r)};document.addEventListener("mousemove",o),document.addEventListener("mouseup",r)}function Kr(e){if(!$)return;$t=!0,to=e.clientX,no=e.clientY,oo=$.offsetWidth,ro=$.offsetHeight,document.body.style.cursor="nwse-resize",document.body.style.userSelect="none";const t=o=>{if(!$t||!$)return;const r=o.clientX-to,i=o.clientY-no,l=Math.max(200,oo+r),s=Math.max(100,ro+i);$.style.width=l+"px",$.style.height=s+"px"},n=()=>{$t=!1,document.body.style.cursor="",document.body.style.userSelect="",document.removeEventListener("mousemove",t),document.removeEventListener("mouseup",n)};document.addEventListener("mousemove",t),document.addEventListener("mouseup",n)}function Qr(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 7h12V5H2v2zm0 4h12V9H2v2zM8 1v3H5v2h3v3h2V6h3V4h-3V1H8z"/>
  </svg>`}function Jr(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 3h12V1H2v2zm0 4h12V5H2v2zm6 4v3h3v-2h2v-2h-2v-3h-2v3H5v2h3z"/>
  </svg>`}function ei(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 5h12v2H2V5zm0 4h12v2H2V9zm4-6v2H4v2h2v2h2V7h2V5H8V3H6z"/>
  </svg>`}function ti(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M7 2v12h2V2H7zm4 0v12h2V2h-2zM1 8h3v-3H1v3zm3 2H1v3h3v-3z"/>
  </svg>`}function ni(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2v12h2V2H2zm4 0v12h2V2H6zM12 8h3v-3h-3v3zm0 2h3v3h-3v-3z"/>
  </svg>`}function oi(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5 2v12h2V2H5zm4 0v12h2V2H9zm3 2h3V1h-3v3zm3 2h-3v3h3V6zm0 4h-3v3h3v-3z"/>
  </svg>`}function ri(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2h12v3H2V2zm0 5h12v8H2V7zm2 2v4h2V9H4zm4 0v4h2V9H8zm4 0v4h2V9h-2z"/>
  </svg>`}function ii(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2v12h3V2H2zm5 0v12h8V2H7zm2 2h4v2H9V4zm0 4h4v2H9V8zm0 4h4v2H9v-2z"/>
  </svg>`}function ai(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 1h10v1H3V1zm1 2v11h8V3H4zM6 5h1v6H6V5zm3 0h1v6H9V5z"/>
  </svg>`}function li(){return`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2h4v3H2V2zm5 0h4v3H7V2zm5 0h2v3h-2V2zm-10 4h4v3H2V6zm5 0h4v3H7V6zm5 0h2v3h-2V6zm-10 4h4v3H2v-3zm5 0h4v3H7v-3zm5 0h2v3h-2v-3z"/>
  </svg>`}if(typeof window<"u"&&!window.__tablePluginInitialized){window.__tablePluginInitialized=!0;const e=()=>{Wr()};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):setTimeout(e,100)}const xa=()=>({name:"table",toolbar:[{label:"Insert Table",command:"insertTable",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18M3 15h18M9 4v16M15 4v16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'}],commands:{insertTable:()=>(Or(),!0)},keymap:{"Mod-Shift-r":()=>(sn(),!0),"Mod-Shift-c":()=>(cn(),!0)}}),si="p,div,li,ul,ol,table,thead,tbody,tfoot,tr,td,th,h1,h2,h3,h4,h5,h6,blockquote,pre";function ci(e){return!!e.cloneContents().querySelector(si)}function Vo(e,t){var o;const n=(e==null?void 0:e.nodeType)===Node.ELEMENT_NODE?e:(e==null?void 0:e.parentElement)??null;return(n==null?void 0:n.closest('[contenteditable="true"]'))||((o=t())==null?void 0:o.querySelector('[contenteditable="true"]'))||document.querySelector('[contenteditable="true"]')}function io(e,t){const n=Vo(e,t);n&&n.dispatchEvent(new Event("input",{bubbles:!0}))}function di(e,t){let o=e.startContainer.nodeType===Node.TEXT_NODE?e.startContainer.parentElement:e.startContainer;for(;o&&o!==document.body;){if(o.classList.contains(t)){const r=document.createRange();if(r.selectNodeContents(o),r.compareBoundaryPoints(Range.START_TO_START,e)<=0&&r.compareBoundaryPoints(Range.END_TO_END,e)>=0)return o}o=o.parentElement}return null}function ui(e){try{if(e.savedRange){const l=window.getSelection();l&&(l.removeAllRanges(),l.addRange(e.savedRange.cloneRange()))}const t=window.getSelection();if(!t||t.rangeCount===0||t.isCollapsed)return!1;const n=t.getRangeAt(0);if(n.collapsed)return!1;const o=di(n,e.className);if(o)return e.styleProperty==="backgroundColor"?o.style.backgroundColor=e.color:o.style.color=e.color,io(o,e.getActiveEditorRoot),!0;const r=Vo(n.commonAncestorContainer,e.getActiveEditorRoot);r==null||r.focus({preventScroll:!0});try{document.execCommand("styleWithCSS",!1,"true")}catch{}let i=!1;if(e.commands.forEach(l=>{i||(i=document.execCommand(l,!1,e.color))}),!i&&!ci(n)){const l=document.createElement("span");e.styleProperty==="backgroundColor"?l.style.backgroundColor=e.color:l.style.color=e.color,l.className=e.className;const s=n.extractContents();l.appendChild(s),n.insertNode(l),n.setStartAfter(l),n.collapse(!0),t.removeAllRanges(),t.addRange(n),i=!0}return i?(io(n.commonAncestorContainer,e.getActiveEditorRoot),!0):(e.warnMessage&&console.warn(e.warnMessage),!1)}catch(t){return e.warnMessage?console.error(e.warnMessage,t):console.error("[ColorApply] Failed to apply color",t),!1}}function mi({popover:e,anchor:t,onClose:n,gap:o=6,margin:r=8,zIndex:i=1e4}){e.style.position="fixed",e.style.zIndex=`${i}`,e.style.visibility="hidden";const l=()=>{if(!e.isConnected||!t.isConnected){n();return}const m=t.getBoundingClientRect();if(m.width===0&&m.height===0){n();return}const f=e.getBoundingClientRect(),C=f.width||e.offsetWidth||220,k=f.height||e.offsetHeight||260,h=window.innerWidth,E=window.innerHeight;let x=m.left,L=m.bottom+o;if(x+C>h-r&&(x=h-C-r),x=Math.max(r,x),L+k>E-r){const y=m.top-k-o;y>=r?L=y:L=Math.max(r,E-k-r)}L<r&&(L=r),e.style.left=`${Math.round(x)}px`,e.style.top=`${Math.round(L)}px`,e.style.visibility="visible"},s=()=>{l()},c=m=>{const f=m.target;f&&(e.contains(f)||t.contains(f)||n())},u=m=>{m.key==="Escape"&&n()};window.addEventListener("resize",s),window.addEventListener("scroll",s,!0),document.addEventListener("keydown",u);const g=window.requestAnimationFrame(()=>{document.addEventListener("mousedown",c,!0)});return l(),{reposition:l,destroy:()=>{window.cancelAnimationFrame(g),window.removeEventListener("resize",s),window.removeEventListener("scroll",s,!0),document.removeEventListener("keydown",u),document.removeEventListener("mousedown",c,!0)}}}let _=null,Ee=null,dn=null,te="#000000";const Fe='[data-theme="dark"], .dark, .editora-theme-dark',fi=["#000000","#ffffff","#808080","#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ffa500","#800080","#ffc0cb"];function Wo(){const e=window.getSelection();if(e&&e.rangeCount>0){const o=e.getRangeAt(0).startContainer,r=o.nodeType===Node.ELEMENT_NODE?o:o.parentElement;if(r){const i=r.closest('[data-editora-editor="true"], .rte-editor, .editora-editor');if(i)return i}}const t=document.activeElement;return t?t.closest('[data-editora-editor="true"], .rte-editor, .editora-editor'):null}function pi(e){const t=window.__editoraLastCommand,n=window.__editoraLastCommandButton;if(t===e&&n&&n.isConnected){const l=window.getComputedStyle(n),s=n.getBoundingClientRect();if(l.display!=="none"&&l.visibility!=="hidden"&&l.pointerEvents!=="none"&&!(s.width===0&&s.height===0))return n}const o=l=>{for(const s of l){const c=window.getComputedStyle(s),u=s.getBoundingClientRect();if(!(c.display==="none"||c.visibility==="hidden"||c.pointerEvents==="none")&&!(u.width===0&&u.height===0))return s}return null},r=Wo();if(r){const l=Array.from(r.querySelectorAll(`[data-command="${e}"]`)),s=o(l);if(s)return s}const i=Array.from(document.querySelectorAll(`[data-command="${e}"]`));return o(i)}function gi(e){if(e!=null&&e.closest(Fe))return!0;const t=window.getSelection();if(t&&t.rangeCount>0){const o=t.getRangeAt(0).startContainer,r=o.nodeType===Node.ELEMENT_NODE?o:o.parentElement;if(r!=null&&r.closest(Fe))return!0}const n=document.activeElement;return n!=null&&n.closest(Fe)?!0:document.body.matches(Fe)||document.documentElement.matches(Fe)}function pt(e){return ui({color:e,className:"rte-text-color",styleProperty:"color",commands:["foreColor"],savedRange:dn,getActiveEditorRoot:Wo,warnMessage:"[TextColor] Could not apply color for current selection"})}function hi(){const e=window.getSelection();if(!e||e.rangeCount===0)return"#000000";let n=e.getRangeAt(0).startContainer;for(;n&&n!==document.body;){if(n.nodeType===Node.ELEMENT_NODE){const o=n,r=o.style.color||window.getComputedStyle(o).color;if(r&&r!=="rgb(0, 0, 0)")return bi(r)}n=n.parentNode}return"#000000"}function bi(e){if(e.startsWith("#"))return e;const t=e.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);if(!t)return"#000000";const n=parseInt(t[1]),o=parseInt(t[2]),r=parseInt(t[3]);return"#"+[n,o,r].map(i=>{const l=i.toString(16);return l.length===1?"0"+l:l}).join("")}function vi(e){const t=window.getSelection();t&&t.rangeCount>0&&(dn=t.getRangeAt(0).cloneRange()),te=hi(),_=document.createElement("div"),_.className="rte-inline-color-picker",gi(e)&&_.classList.add("rte-theme-dark"),_.addEventListener("click",n=>n.stopPropagation()),_.innerHTML=`
    <div class="rte-color-picker-header">
      <span class="rte-color-picker-title">Text Color</span>
      <button class="rte-color-picker-close" aria-label="Close">×</button>
    </div>
    
    <div class="rte-color-picker-body">
      <!-- Current Color Preview -->
      <div class="rte-color-preview-section">
        <div class="rte-color-preview-box" style="background-color: ${te}; ${te==="#ffffff"?"border: 1px solid #ccc;":""}"></div>
        <span class="rte-color-preview-label">${te.toUpperCase()}</span>
      </div>

      <!-- Preset Colors -->
      <div class="rte-color-section">
        <label class="rte-color-section-label">Colors</label>
        <div class="rte-color-palette">
          ${fi.map(n=>`
            <button
              class="rte-color-swatch ${te===n?"selected":""}"
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
            value="${te}"
            class="rte-color-input-native"
            aria-label="Color picker"
          />
          <input
            type="text"
            value="${te}"
            placeholder="#000000"
            pattern="^#[0-9A-Fa-f]{6}$"
            class="rte-color-input-text"
            aria-label="Hex color input"
          />
        </div>
      </div>
    </div>
  `,document.body.appendChild(_),Ee&&(Ee.destroy(),Ee=null),Ee=mi({popover:_,anchor:e,onClose:Ie,gap:4,margin:8,zIndex:1e4}),yi()}function yi(){if(!_)return;const e=_.querySelector(".rte-color-picker-close");e==null||e.addEventListener("click",()=>Ie()),_.querySelectorAll(".rte-color-swatch").forEach(r=>{r.addEventListener("click",()=>{const i=r.getAttribute("data-color");i&&(te=i,pt(i),Ie())})});const n=_.querySelector(".rte-color-input-native");n==null||n.addEventListener("change",r=>{const i=r.target.value;te=i,pt(i),Ie()});const o=_.querySelector(".rte-color-input-text");o==null||o.addEventListener("change",r=>{const i=r.target.value;/^#[0-9A-Fa-f]{6}$/.test(i)&&(te=i,pt(i),Ie())}),n==null||n.addEventListener("input",r=>{const i=r.target.value;te=i,ao(i),lo(i),wi(i)}),o==null||o.addEventListener("input",r=>{const i=r.target.value;/^#[0-9A-Fa-f]{6}$/.test(i)&&(te=i,ao(i),lo(i),xi(i))})}function ao(e){if(!_)return;const t=_.querySelector(".rte-color-preview-box"),n=_.querySelector(".rte-color-preview-label");t&&(t.style.backgroundColor=e,t.style.border=e==="#ffffff"?"1px solid #ccc":"none"),n&&(n.textContent=e.toUpperCase())}function lo(e){if(!_)return;_.querySelectorAll(".rte-color-swatch").forEach(n=>{n.getAttribute("data-color")===e?n.classList.add("selected"):n.classList.remove("selected")})}function xi(e){if(!_)return;const t=_.querySelector(".rte-color-input-native");t&&(t.value=e)}function wi(e){if(!_)return;const t=_.querySelector(".rte-color-input-text");t&&(t.value=e)}function Ie(){Ee&&(Ee.destroy(),Ee=null),_&&(_.remove(),_=null),dn=null}function Ei(){if(Qt(),_)return Ie(),!0;const e=pi("openTextColorPicker");return e?(vi(e),!0):!1}function Qt(){if(!window.__textColorPluginInitialized&&(window.__textColorPluginInitialized=!0,!document.getElementById("text-color-plugin-styles"))){const e=document.createElement("style");e.id="text-color-plugin-styles",e.textContent=`
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
    `,document.head.appendChild(e)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Qt):setTimeout(Qt,100);const wa=()=>({name:"textColor",marks:{textColor:{attrs:{color:{default:"#000000"}},parseDOM:[{tag:"span[style*=color]",getAttrs:e=>{const n=(e.getAttribute("style")||"").match(/color:\s*([^;]+)/);return n?{color:n[1]}:null}},{tag:"font[color]",getAttrs:e=>{const t=e.getAttribute("color");return t?{color:t}:null}}],toDOM:e=>{var t;return["span",{style:`color: ${((t=e.attrs)==null?void 0:t.color)||"#000000"}`,class:"rte-text-color"},0]}}},toolbar:[{label:"Text Color",command:"openTextColorPicker",icon:'<svg width="24" height="24" focusable="false"><g fill-rule="evenodd"><path class="tox-icon-text-color__color" d="M3 18h18v3H3z" fill="currentColor"></path><path d="M8.7 16h-.8a.5.5 0 0 1-.5-.6l2.7-9c.1-.3.3-.4.5-.4h2.8c.2 0 .4.1.5.4l2.7 9a.5.5 0 0 1-.5.6h-.8a.5.5 0 0 1-.4-.4l-.7-2.2c0-.3-.3-.4-.5-.4h-3.4c-.2 0-.4.1-.5.4l-.7 2.2c0 .3-.2.4-.4.4Zm2.6-7.6-.6 2a.5.5 0 0 0 .5.6h1.6a.5.5 0 0 0 .5-.6l-.6-2c0-.3-.3-.4-.5-.4h-.4c-.2 0-.4.1-.5.4Z"></path></g></svg>'}],commands:{openTextColorPicker:()=>Ei(),setTextColor:e=>e?pt(e):!1},keymap:{}}),ki=[{label:"1.0",value:"1.0"},{label:"1.15",value:"1.15"},{label:"1.5",value:"1.5"},{label:"2.0",value:"2.0"},{label:"2.5",value:"2.5"},{label:"3.0",value:"3.0"}],Ci=new Set(["P","DIV","H1","H2","H3","H4","H5","H6","LI","BLOCKQUOTE","PRE"]),Jt=e=>Ci.has(e.tagName)&&e.getAttribute("contenteditable")!=="true",Ti=()=>{const e=window.getSelection();if(e&&e.rangeCount>0){let n=e.getRangeAt(0).startContainer;for(;n&&n!==document.body;){if(n.nodeType===Node.ELEMENT_NODE){const o=n;if(o.getAttribute("contenteditable")==="true")return o}n=n.parentNode}}const t=document.activeElement;if(t){if(t.getAttribute("contenteditable")==="true")return t;const n=t.closest('[contenteditable="true"]');if(n)return n}return document.querySelector('[contenteditable="true"]')},so=e=>{let t=e;for(;t;){if(t.nodeType===Node.ELEMENT_NODE){const n=t;if(Jt(n))return n;if(n.getAttribute("contenteditable")==="true")break}t=t.parentNode}return null},Li=(e,t)=>{const n=[],o=new Set,r=s=>{!s||o.has(s)||t.contains(s)&&Jt(s)&&(o.add(s),n.push(s))};if(e.collapsed)return r(so(e.startContainer)),n;const i=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT,{acceptNode:s=>{const c=s;if(!Jt(c))return NodeFilter.FILTER_SKIP;if(typeof e.intersectsNode=="function")return e.intersectsNode(c)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;const u=document.createRange();return u.selectNodeContents(c),e.compareBoundaryPoints(Range.END_TO_START,u)>0&&e.compareBoundaryPoints(Range.START_TO_END,u)<0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});let l=i.nextNode();for(;l;)r(l),l=i.nextNode();return n.length===0&&r(so(e.commonAncestorContainer)),n},Ai=e=>{e.dispatchEvent(new Event("input",{bubbles:!0}))},Si=(e,t)=>{if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}},Go=e=>{if(!e)return!1;try{const t=Ti();if(!t)return!1;const n=window.getSelection();if(!n||n.rangeCount===0)return!1;const o=n.getRangeAt(0);if(!t.contains(o.commonAncestorContainer))return!1;const r=Li(o,t);if(r.length===0)return!1;const i=t.innerHTML;return r.forEach(l=>{l.style.lineHeight=e}),Si(t,i),Ai(t),!0}catch(t){return console.error("Failed to set line height:",t),!1}},Mi=(e,t)=>{var n;typeof window<"u"&&((n=window.registerEditorCommand)==null||n.call(window,e,t))},co=()=>{Mi("setLineHeight",Go)};typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",co):co());const Ea=()=>({name:"lineHeight",marks:{lineHeight:{attrs:{height:{default:null}},parseDOM:[{tag:'span[style*="line-height"]',getAttrs:e=>{const n=e.style.lineHeight;return n?{height:n}:!1}}],toDOM:e=>{var t;return["span",{style:`line-height: ${(t=e.attrs)==null?void 0:t.height}`},0]}}},toolbar:[{label:"Line Height",command:"setLineHeight",type:"inline-menu",options:ki,icon:'<svg width="24" height="24" focusable="false"><path d="M21 5a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zm0 4a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zm0 4a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zm0 4a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zM7 3.6l3.7 3.7a1 1 0 0 1-1.3 1.5h-.1L8 7.3v9.2l1.3-1.3a1 1 0 0 1 1.3 0h.1c.4.4.4 1 0 1.3v.1L7 20.4l-3.7-3.7a1 1 0 0 1 1.3-1.5h.1L6 16.7V7.4L4.7 8.7a1 1 0 0 1-1.3 0h-.1a1 1 0 0 1 0-1.3v-.1L7 3.6z"></path></svg>'}],commands:{setLineHeight:Go}}),jo=40,vt=e=>["P","DIV","H1","H2","H3","H4","H5","H6","LI","BLOCKQUOTE","PRE"].includes(e.tagName)&&e.getAttribute("contenteditable")!=="true",Xo=()=>{const e=window.getSelection();if(e&&e.rangeCount>0){let n=e.getRangeAt(0).startContainer;for(;n&&n!==document.body;){if(n.nodeType===Node.ELEMENT_NODE){const o=n;if(o.getAttribute("contenteditable")==="true")return o}n=n.parentNode}}const t=document.activeElement;if(t){if(t.getAttribute("contenteditable")==="true")return t;const n=t.closest('[contenteditable="true"]');if(n)return n}return document.querySelector('[contenteditable="true"]')},uo=e=>{let t=e;if(t.nodeType===Node.ELEMENT_NODE){const n=t;if(vt(n))return n}for(;t;){if(t.nodeType===Node.ELEMENT_NODE){const n=t;if(vt(n))return n;if(n.getAttribute("contenteditable")==="true")break}t=t.parentNode}return null},Yo=(e,t)=>{const n=[],o=new Set,r=s=>{!s||o.has(s)||t.contains(s)&&vt(s)&&(o.add(s),n.push(s))};if(e.collapsed)return r(uo(e.startContainer)),n;const i=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT,{acceptNode:s=>{const c=s;if(!vt(c))return NodeFilter.FILTER_SKIP;if(typeof e.intersectsNode=="function")return e.intersectsNode(c)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;const u=document.createRange();return u.selectNodeContents(c),e.compareBoundaryPoints(Range.END_TO_START,u)>0&&e.compareBoundaryPoints(Range.START_TO_END,u)<0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});let l=i.nextNode();for(;l;)r(l),l=i.nextNode();return n.length===0&&r(uo(e.commonAncestorContainer)),n},Zo=e=>{const t=window.getComputedStyle(e),n=t.paddingLeft;if(n.endsWith("px"))return parseFloat(n);if(n.endsWith("em")){const o=parseFloat(t.fontSize);return parseFloat(n)*o}return 0},Ko=(e,t)=>{if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}},Qo=()=>{const e=Xo();if(!e)return!1;const t=window.getSelection();if(!t||t.rangeCount===0)return!1;const n=t.getRangeAt(0);if(!e.contains(n.commonAncestorContainer))return!1;const o=Yo(n,e);if(o.length===0)return!1;const r=e.innerHTML;return o.forEach(i=>{const s=Zo(i)+jo;i.style.paddingLeft=`${s}px`}),Ko(e,r),e.dispatchEvent(new Event("input",{bubbles:!0})),!0},Jo=()=>{const e=Xo();if(!e)return!1;const t=window.getSelection();if(!t||t.rangeCount===0)return!1;const n=t.getRangeAt(0);if(!e.contains(n.commonAncestorContainer))return!1;const o=Yo(n,e);if(o.length===0)return!1;const r=e.innerHTML;return o.forEach(i=>{const l=Zo(i),s=Math.max(0,l-jo);i.style.paddingLeft=`${s}px`}),Ko(e,r),e.dispatchEvent(new Event("input",{bubbles:!0})),!0},mo=(e,t)=>{var n;typeof window<"u"&&((n=window.registerEditorCommand)==null||n.call(window,e,t))},fo=()=>{mo("increaseIndent",Qo),mo("decreaseIndent",Jo)};typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",fo):fo());const ka=()=>({name:"indent",toolbar:[{label:"Increase Indent",command:"increaseIndent",type:"button",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm8-7h10v2H11v-2zm0 4h10v2H11v-2zM3 8l4 4-4 4V8z"/></svg>',shortcut:"Mod-]"},{label:"Decrease Indent",command:"decreaseIndent",type:"button",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm8-7h10v2H11v-2zm0 4h10v2H11v-2zM7 8v8l-4-4 4-4z"/></svg>',shortcut:"Mod-["}],commands:{increaseIndent:Qo,decreaseIndent:Jo},keymap:{"Mod-]":"increaseIndent","Mod-[":"decreaseIndent",Tab:"increaseIndent","Shift-Tab":"decreaseIndent"}}),_i={latex:[{name:"Fraction",formula:"\\frac{a}{b}",description:"Simple fraction"},{name:"Square Root",formula:"\\sqrt{x}",description:"Square root"},{name:"Power",formula:"x^{2}",description:"Exponent/power"},{name:"Subscript",formula:"x_{sub}",description:"Subscript"},{name:"Integral",formula:"\\int_{a}^{b} f(x) \\, dx",description:"Definite integral"},{name:"Summation",formula:"\\sum_{i=1}^{n} x_{i}",description:"Summation"},{name:"Limit",formula:"\\lim_{x \\to 0} f(x)",description:"Limit"},{name:"Derivative",formula:"\\frac{d}{dx} f(x)",description:"Derivative"},{name:"Matrix 2x2",formula:"\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",description:"2x2 matrix"},{name:"System",formula:"\\begin{cases} x + y = 1 \\\\ 2x - y = 0 \\end{cases}",description:"System of equations"}],mathml:[{name:"Fraction",formula:"<mfrac><mi>a</mi><mi>b</mi></mfrac>",description:"Simple fraction"},{name:"Square Root",formula:"<msqrt><mi>x</mi></msqrt>",description:"Square root"},{name:"Power",formula:"<msup><mi>x</mi><mn>2</mn></msup>",description:"Exponent/power"},{name:"Subscript",formula:"<msub><mi>x</mi><mi>sub</mi></msub>",description:"Subscript"},{name:"Parentheses",formula:'<mfenced open="(" close=")"><mi>a</mi><mo>+</mo><mi>b</mi></mfenced>',description:"Grouped expression"}]};let ct=null,Ne=null,po=!1,_e=null;const qe='[data-theme="dark"], .dark, .editora-theme-dark',Ri=()=>new Promise((e,t)=>{if(window.katex){e(window.katex);return}if(po){const r=setInterval(()=>{window.katex&&(clearInterval(r),e(window.katex))},100);return}po=!0;const n=document.createElement("link");n.rel="stylesheet",n.href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",document.head.appendChild(n);const o=document.createElement("script");o.src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js",o.onload=()=>e(window.katex),o.onerror=t,document.head.appendChild(o)}),er=()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return null;const t=e.getRangeAt(0).startContainer,n=t.nodeType===Node.ELEMENT_NODE?t:t.parentElement;return(n==null?void 0:n.closest(".rte-content, .editora-content"))||null},Ni=e=>{const t=e||er();if(t!=null&&t.closest(qe))return!0;const n=window.getSelection();if(n&&n.rangeCount>0){const r=n.getRangeAt(0).startContainer,i=r.nodeType===Node.ELEMENT_NODE?r:r.parentElement;if(i!=null&&i.closest(qe))return!0}const o=document.activeElement;return o!=null&&o.closest(qe)?!0:document.body.matches(qe)||document.documentElement.matches(qe)},tr=async(e,t)=>{const n=t||(Ne==null?void 0:Ne.closest(".rte-content, .editora-content"))||er()||_e;_e=n||null;const o=window.getSelection();if(o&&o.rangeCount>0){const w=o.getRangeAt(0);ct=n&&n.contains(w.commonAncestorContainer)?w.cloneRange():null}await Ri();const r=Ni(n),i=r?{overlay:"rgba(0, 0, 0, 0.62)",dialogBg:"#1f2937",border:"#3b4657",panelBg:"#222d3a",fieldBg:"#111827",fieldBorder:"#4b5563",text:"#e2e8f0",muted:"#94a3b8",templateBtnBg:"#273244",templateBtnHover:"#334155",templateBtnText:"#dbe7f7",templateSubText:"#9fb0c6",previewBg:"#111827",previewText:"#cbd5e1",cancelBg:"#334155",cancelText:"#e2e8f0",cancelBorder:"#4b5563",insertBg:"#3b82f6",insertHover:"#2563eb",invalid:"#f87171"}:{overlay:"rgba(0, 0, 0, 0.5)",dialogBg:"#ffffff",border:"#e1e5e9",panelBg:"#f8f9fa",fieldBg:"#ffffff",fieldBorder:"#ced4da",text:"#1f2937",muted:"#6c757d",templateBtnBg:"#ffffff",templateBtnHover:"#f8f9fa",templateBtnText:"#1f2937",templateSubText:"#6c757d",previewBg:"#f8f9fa",previewText:"#6c757d",cancelBg:"#ffffff",cancelText:"#1f2937",cancelBorder:"#ced4da",insertBg:"#007bff",insertHover:"#0069d9",invalid:"#cc0000"},l=document.createElement("div");l.style.cssText=`position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: ${i.overlay}; display: flex; align-items: center; justify-content: center; z-index: 99999;`;const s=document.createElement("div");s.style.cssText=`background: ${i.dialogBg}; border: 1px solid ${i.border}; border-radius: 8px; width: 90%; max-width: 600px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); color: ${i.text};`;let c=(e==null?void 0:e.format)||"latex",u=(e==null?void 0:e.formula)||"",g=(e==null?void 0:e.inline)!==!1,p=null,m="";s.innerHTML=`
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
        <label style="cursor: pointer; color: ${i.text};"><input type="checkbox" id="inline-cb" ${g?"checked":""} style="margin-right: 8px;"> Inline math</label>
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
  `,l.appendChild(s),document.body.appendChild(l);const f=s.querySelector("#formula-input"),C=s.querySelector("#preview-area"),k=s.querySelector("#templates-grid"),h=s.querySelectorAll('input[name="format"]'),E=s.querySelector("#inline-cb"),x=s.querySelector("#insert-btn"),L=s.querySelector(".close-btn"),y=s.querySelector(".cancel-btn"),A=w=>encodeURIComponent(w),D=w=>{try{return decodeURIComponent(w)}catch{return w}},V=()=>{const w=_i[c];k.innerHTML=w.map(H=>`
      <button type="button" data-formula="${A(H.formula)}" title="${H.description}" style="padding: 8px; border: 1px solid ${i.fieldBorder}; border-radius: 4px; background: ${i.templateBtnBg}; cursor: pointer; text-align: left; transition: background-color 0.16s ease;">
        <div style="font-weight: 600; font-size: 12px; color: ${i.templateBtnText};">${H.name}</div>
        <div style="font-size: 10px; color: ${i.templateSubText}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${H.formula.substring(0,20)}...</div>
      </button>
    `).join("")},Y=()=>{const w=f.value.trim(),H=`${c}:${w}`;if(H!==m){if(m=H,!w){C.innerHTML=`<span style="color: ${i.previewText};">Enter a formula to see preview</span>`,x.disabled=!0;return}x.disabled=!1;try{if(c==="latex"){const M=window.katex;C.innerHTML=M.renderToString(w,{displayMode:!1,throwOnError:!1})}else w.trim().startsWith("<math")?C.innerHTML=w:C.innerHTML=`<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">${w}</math>`}catch{C.innerHTML=`<span style="color: ${i.invalid};">Invalid formula</span>`}}},J=()=>{p!==null&&cancelAnimationFrame(p),p=requestAnimationFrame(()=>{p=null,Y()})},Je=w=>{w.key==="Escape"&&(w.preventDefault(),w.stopPropagation(),O())},O=()=>{document.removeEventListener("keydown",Je,!0),p!==null&&(cancelAnimationFrame(p),p=null),l.parentNode&&l.parentNode.removeChild(l)};L.onmouseover=()=>{L.style.color="#f8fafc",L.style.background=r?"#334155":"#e5e7eb",L.style.borderRadius="4px"},L.onmouseout=()=>{L.style.color=i.muted,L.style.background="none"},y.onmouseover=()=>{y.style.background=r?"#475569":"#f3f4f6"},y.onmouseout=()=>{y.style.background=i.cancelBg},x.onmouseover=()=>{x.disabled||(x.style.background=i.insertHover)},x.onmouseout=()=>{x.style.background=i.insertBg},k.addEventListener("mouseover",w=>{const M=w.target.closest("button[data-formula]");M&&(M.style.background=i.templateBtnHover)}),k.addEventListener("mouseout",w=>{const M=w.target.closest("button[data-formula]");M&&(M.style.background=i.templateBtnBg)}),k.addEventListener("click",w=>{const M=w.target.closest("button[data-formula]");M&&(f.value=D(M.getAttribute("data-formula")||""),u=f.value,J())});const ke=()=>{const w=f.value.trim();if(!w)return;const H={formula:w,format:c,inline:E.checked},M=H.inline?document.createElement("span"):document.createElement("div");if(M.className=H.inline?"math-formula":"math-block",M.setAttribute("data-math-formula",w),M.setAttribute("data-math-format",c),M.contentEditable="false",M.style.cssText=H.inline?"background: #f0f8ff; border: 1px solid #b8daff; border-radius: 4px; padding: 2px 6px; margin: 0 2px; color: #004085; display: inline-block; cursor: pointer;":"background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 12px; margin: 8px 0; text-align: center; display: block; cursor: pointer;",c==="latex"){const se=window.katex;try{M.innerHTML=se.renderToString(w,{displayMode:!H.inline,throwOnError:!1})}catch{M.textContent=H.inline?`$${w}$`:`$$${w}$$`}}else if(w.trim().startsWith("<math"))M.innerHTML=w;else{const se=`<math xmlns="http://www.w3.org/1998/Math/MathML" display="${H.inline?"inline":"block"}">${w}</math>`;M.innerHTML=se}if(Ne)Ne.replaceWith(M);else if(ct)ct.deleteContents(),ct.insertNode(M);else if(_e&&_e.isConnected){const se=document.createRange();se.selectNodeContents(_e),se.collapse(!1),se.insertNode(M)}const Oe=M.closest(".rte-content, .editora-content")||_e;Oe==null||Oe.dispatchEvent(new Event("input",{bubbles:!0})),O()};L.addEventListener("click",O),y.addEventListener("click",O),x.addEventListener("click",ke),l.addEventListener("click",w=>{w.target===l&&O()}),document.addEventListener("keydown",Je,!0),h.forEach(w=>{w.addEventListener("change",H=>{c=H.target.value,m="",V(),J()})}),f.addEventListener("input",()=>{u=f.value,J()}),f.addEventListener("keydown",w=>{(w.ctrlKey||w.metaKey)&&w.key==="Enter"&&(w.preventDefault(),ke())}),V(),J(),f.focus()};if(typeof window<"u"&&!window.__mathPluginDoubleClickInitialized){window.__mathPluginDoubleClickInitialized=!0;const e=n=>{const r=n.target.closest(".math-formula, .math-block");if(r){n.preventDefault(),n.stopPropagation(),n.stopImmediatePropagation(),Ne=r;const i=r.getAttribute("data-math-formula")||"",l=r.getAttribute("data-math-format")||"latex",s=r.classList.contains("math-formula");tr({formula:i,format:l,inline:s})}},t=()=>{document.addEventListener("dblclick",e,{capture:!0})};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",t):setTimeout(t,100)}const Ca=()=>({name:"math",toolbar:[{label:"Insert Math",command:"insertMath",icon:'<svg width="24" height="24" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 4.8c.1-.5.5-.8 1-.8h10a1 1 0 1 1 0 2h-9.2L8.3 19.2a1 1 0 0 1-1.7.4l-3.4-4.2a1 1 0 0 1 1.6-1.2l2 2.5L9 4.8Zm9.7 5.5c.4.4.4 1 0 1.4L17 13.5l1.8 1.8a1 1 0 0 1-1.4 1.4L15.5 15l-1.8 1.8a1 1 0 0 1-1.4-1.4l1.8-1.8-1.8-1.8a1 1 0 0 1 1.4-1.4l1.8 1.8 1.8-1.8a1 1 0 0 1 1.4 0Z"></path></svg>'}],commands:{insertMath:(e,t)=>{const n=(t==null?void 0:t.contentElement)instanceof HTMLElement?t.contentElement:null;return tr(void 0,n),!0}},keymap:{"Mod-Shift-m":"insertMath"}});let dt=null,N=null,S=null,yt=[],ut=!1,Ue=null,go=0,ho=0,ye=0,xe=0,Ft=1,Ke=null;const nr='[data-theme="dark"], .dark, .editora-theme-dark',kt=(e,t)=>{const n=o=>{o.key!=="Escape"||!e.isConnected||(o.preventDefault(),o.stopPropagation(),t())};return document.addEventListener("keydown",n,!0),()=>{document.removeEventListener("keydown",n,!0)}},Ii=()=>{if(typeof document>"u"||document.getElementById("rte-media-dialog-styles"))return;const e=document.createElement("style");e.id="rte-media-dialog-styles",e.textContent=`
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
    ${nr} .media-floating-toolbar {
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
  `,document.head.appendChild(e)},Hi=()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return null;const t=e.anchorNode,n=t instanceof HTMLElement?t:t==null?void 0:t.parentElement;return(n==null?void 0:n.closest(".rte-content, .editora-content"))||null},Di=e=>{if(e)return e;const t=Hi();if(t)return t;if(Ke)return Ke;const n=document.activeElement;return n?n.closest(".rte-content, .editora-content")||n:null},or=e=>{const t=Di(e);return t?!!t.closest(nr):!1},Ct=e=>{Ii();const t=document.createElement("div");return t.className="rte-media-overlay",or(e)&&t.classList.add("rte-ui-theme-dark"),t},Tt=(e=!1)=>{const t=document.createElement("div");return t.className=e?"rte-media-dialog rte-media-dialog-compact":"rte-media-dialog",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t},bo=(e,t)=>{const n=window.getSelection();n&&n.rangeCount>0&&(dt=n.getRangeAt(0).cloneRange());const o=Ct(t),r=Tt();let i="upload",l="",s="",c="",u="";const g=()=>{r.innerHTML=`
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
    `};g(),o.appendChild(r),document.body.appendChild(o);let p=()=>{};const m=()=>{p(),o.parentNode&&o.parentNode.removeChild(o)};p=kt(o,m);const f=()=>{if(!l)return;const h=e==="image"?document.createElement("img"):document.createElement("video");h.src=l,h.setAttribute("data-media-type",e),e==="image"&&u&&(h.alt=u),s&&(h.style.width=`${s}px`,h.setAttribute("width",s)),c&&(h.style.height=`${c}px`,h.setAttribute("height",c)),e==="video"&&(h.controls=!0),!s&&!c?h.style.cssText="max-width: 100%; height: auto; display: block; margin: 1em 0; cursor: pointer;":h.style.cssText=`display: block; margin: 1em 0; cursor: pointer; ${s?`width: ${s}px;`:"max-width: 100%;"} ${c?`height: ${c}px;`:"height: auto;"}`,dt&&(dt.deleteContents(),dt.insertNode(h)),m()},C=async h=>{const E=r.querySelector("#upload-progress"),x=r.querySelector("#progress-bar"),L=r.querySelector("#progress-text");if(E&&x&&L){E.style.display="block";let y=0;const A=setInterval(()=>{y+=Math.random()*30,y>90&&(y=90),x.style.width=`${y}%`},200);try{const D=new FileReader;D.onload=()=>{clearInterval(A),x.style.width="100%",L.textContent="Upload complete",setTimeout(()=>{l=D.result,i="url",g(),k()},500)},D.readAsDataURL(h)}catch{clearInterval(A),L.textContent="Upload failed"}}},k=()=>{const h=r.querySelector(".close-btn"),E=r.querySelector(".cancel-btn"),x=r.querySelector("#insert-btn"),L=r.querySelector(".tab-upload"),y=r.querySelector(".tab-url");if(h==null||h.addEventListener("click",m),E==null||E.addEventListener("click",m),x==null||x.addEventListener("click",f),L==null||L.addEventListener("click",()=>{i="upload",g(),k()}),y==null||y.addEventListener("click",()=>{i="url",g(),k()}),i==="upload"){const A=r.querySelector(".dropzone"),D=r.querySelector("#file-input");A==null||A.addEventListener("click",()=>D==null?void 0:D.click()),A==null||A.addEventListener("dragover",V=>{V.preventDefault(),A.classList.add("is-dragover")}),A==null||A.addEventListener("dragleave",()=>{A.classList.remove("is-dragover")}),A==null||A.addEventListener("drop",V=>{var J;V.preventDefault(),A.classList.remove("is-dragover");const Y=(J=V.dataTransfer)==null?void 0:J.files[0];Y&&C(Y)}),D==null||D.addEventListener("change",V=>{var J;const Y=(J=V.target.files)==null?void 0:J[0];Y&&C(Y)})}if(i==="url"){const A=r.querySelector("#url-input"),D=r.querySelector("#alt-input"),V=r.querySelector("#width-input"),Y=r.querySelector("#height-input");A==null||A.addEventListener("input",()=>{l=A.value,g(),k()}),D==null||D.addEventListener("input",()=>{u=D.value}),V==null||V.addEventListener("input",()=>{s=V.value}),Y==null||Y.addEventListener("input",()=>{c=Y.value})}};k(),o.addEventListener("click",h=>{h.target===o&&m()})},Oi=()=>{["nw","ne","sw","se"].forEach(t=>{const n=document.createElement("div");n.className=`media-resize-handle-${t}`,n.style.cssText=`
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
    `,n.setAttribute("data-position",t),document.body.appendChild(n),yt.push(n)})},we=()=>{if(!N){yt.forEach(n=>n.style.display="none");return}const e=N.getBoundingClientRect(),t={nw:{x:e.left-5,y:e.top-5},ne:{x:e.right-5,y:e.top-5},sw:{x:e.left-5,y:e.bottom-5},se:{x:e.right-5,y:e.bottom-5}};yt.forEach(n=>{const o=n.getAttribute("data-position"),r=t[o];n.style.left=`${r.x}px`,n.style.top=`${r.y}px`,n.style.display="block"})},zi=e=>{const t=Ct(e),n=Tt(!0);n.innerHTML=`
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
  `,t.appendChild(n),document.body.appendChild(t);const o=n.querySelector("#alt-text-input"),r=n.querySelector(".close-btn"),i=n.querySelector(".cancel-btn"),l=n.querySelector(".save-btn");let s=()=>{};const c=()=>{s(),t.parentNode&&t.parentNode.removeChild(t)};s=kt(t,c),r.addEventListener("click",c),i.addEventListener("click",c),t.addEventListener("click",u=>{u.target===t&&c()}),l.addEventListener("click",()=>{e.alt=o.value,c()}),o.focus(),o.select()},Bi=e=>{const t=e.closest("a"),n=(t==null?void 0:t.getAttribute("href"))||"",o=(t==null?void 0:t.getAttribute("target"))||"_self",r=(t==null?void 0:t.getAttribute("title"))||"",i=Ct(e),l=Tt(!0);l.innerHTML=`
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
        <input id="link-title" type="text" class="rte-media-input" value="${r}" placeholder="Optional tooltip text" />
      </div>
      <label class="rte-media-checkbox-label">
        <input id="link-target" type="checkbox" ${o==="_blank"?"checked":""} />
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
  `,i.appendChild(l),document.body.appendChild(i);const s=l.querySelector("#link-url"),c=l.querySelector("#link-title"),u=l.querySelector("#link-target"),g=l.querySelector(".close-btn"),p=l.querySelector(".cancel-btn"),m=l.querySelector(".save-btn"),f=l.querySelector(".remove-link-btn");let C=()=>{};const k=()=>{C(),i.parentNode&&i.parentNode.removeChild(i)};C=kt(i,k),g.addEventListener("click",k),p.addEventListener("click",k),i.addEventListener("click",h=>{h.target===i&&k()}),m.addEventListener("click",()=>{const h=s.value.trim();if(h){const E=h.startsWith("http")?h:`https://${h}`;if(t)t.setAttribute("href",E),t.setAttribute("target",u.checked?"_blank":"_self"),u.checked?t.setAttribute("rel","noopener noreferrer"):t.removeAttribute("rel"),c.value.trim()?t.setAttribute("title",c.value.trim()):t.removeAttribute("title");else{const x=document.createElement("a");x.href=E,x.target=u.checked?"_blank":"_self",u.checked&&(x.rel="noopener noreferrer"),c.value.trim()&&(x.title=c.value.trim()),e.replaceWith(x),x.appendChild(e)}k(),S&&N&&en(N)}}),f==null||f.addEventListener("click",()=>{t&&confirm("Remove link from this media?")&&(t.replaceWith(e),k(),S&&N&&en(N))}),s.focus()},$i=e=>{const t=Ct(e),n=Tt();let o="url",r=e.src;const i=()=>{n.innerHTML=`
      <div class="rte-media-header">
        <h2 class="rte-media-title">Replace Image</h2>
        <button class="close-btn rte-media-close-btn" type="button" aria-label="Close">×</button>
      </div>

      <div class="rte-media-tabs">
        <button class="tab-upload rte-media-tab ${o==="upload"?"active":""}" type="button">Upload</button>
        <button class="tab-url rte-media-tab ${o==="url"?"active":""}" type="button">URL</button>
      </div>

      <div class="rte-media-body">
        ${o==="upload"?`
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
              <input type="text" id="url-input" class="rte-media-input" placeholder="https://example.com/image.jpg" value="${r}">
            </div>
            ${r?`
              <div class="rte-media-field">
                <label class="rte-media-label">Preview</label>
                <div class="rte-media-preview">
                  <img src="${r}" alt="Preview" onerror="this.parentElement.innerHTML='<p class=&quot;rte-media-muted&quot;>Failed to load image</p>'">
                </div>
              </div>
            `:""}
          </div>
        `}
      </div>

      <div class="rte-media-footer">
        <button class="cancel-btn rte-media-btn rte-media-btn-secondary" type="button">Cancel</button>
        <button id="replace-btn" class="rte-media-btn rte-media-btn-primary" type="button" ${!r&&o==="url"?"disabled":""}>Replace</button>
      </div>
    `};i(),t.appendChild(n),document.body.appendChild(t);let l=()=>{};const s=()=>{l(),t.parentNode&&t.parentNode.removeChild(t)};l=kt(t,s);const c=()=>{r&&(e.src=r,s())},u=async p=>{const m=n.querySelector("#upload-progress"),f=n.querySelector("#progress-bar"),C=n.querySelector("#progress-text");if(m&&f&&C){m.style.display="block";let k=0;const h=setInterval(()=>{k+=Math.random()*30,k>90&&(k=90),f.style.width=`${k}%`},200);try{const E=new FileReader;E.onload=()=>{clearInterval(h),f.style.width="100%",C.textContent="Upload complete",setTimeout(()=>{r=E.result,o="url",i(),g()},500)},E.readAsDataURL(p)}catch{clearInterval(h),C.textContent="Upload failed"}}},g=()=>{const p=n.querySelector(".close-btn"),m=n.querySelector(".cancel-btn"),f=n.querySelector("#replace-btn"),C=n.querySelector(".tab-upload"),k=n.querySelector(".tab-url");if(p==null||p.addEventListener("click",s),m==null||m.addEventListener("click",s),f==null||f.addEventListener("click",c),C==null||C.addEventListener("click",()=>{o="upload",i(),g()}),k==null||k.addEventListener("click",()=>{o="url",i(),g()}),o==="upload"){const h=n.querySelector(".dropzone"),E=n.querySelector("#file-input");h==null||h.addEventListener("click",()=>E==null?void 0:E.click()),h==null||h.addEventListener("dragover",x=>{x.preventDefault(),h.classList.add("is-dragover")}),h==null||h.addEventListener("dragleave",()=>{h.classList.remove("is-dragover")}),h==null||h.addEventListener("drop",x=>{var y;x.preventDefault(),h.classList.remove("is-dragover");const L=(y=x.dataTransfer)==null?void 0:y.files[0];L&&u(L)}),E==null||E.addEventListener("change",x=>{var y;const L=(y=x.target.files)==null?void 0:y[0];L&&u(L)})}if(o==="url"){const h=n.querySelector("#url-input");h==null||h.addEventListener("input",()=>{r=h.value,i(),g()})}};g(),t.addEventListener("click",p=>{p.target===t&&s()})},ae=()=>{if(!S||!N)return;const e=S.offsetHeight||40,t=N.offsetTop,n=N.offsetLeft,o=N.offsetWidth,r=t-e-8,i=n+o/2-(S.offsetWidth||120)/2;S.style.top=`${r}px`,S.style.left=`${i}px`,setTimeout(()=>{S&&(S.style.display="flex")},100)},en=e=>{var s,c,u,g,p,m,f,C;S&&(S._cleanup&&S._cleanup(),S.remove());const t=e.parentElement;if(t){const k=t.style.position;(!k||k==="static")&&(t.style.position="relative",t._originalPosition=k),S=document.createElement("div"),S.className="media-floating-toolbar",or(e)&&S.classList.add("rte-ui-theme-dark"),t.insertBefore(S,t.firstChild),ae()}const n=S;if(!n)return;const o=e.tagName==="IMG",r=e.closest("a");n.innerHTML=`
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
    ${o?`
    <button class="media-floating-toolbar-btn btn-alt" title="Edit Alt Text" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
    </button>`:""}
    <button class="media-floating-toolbar-btn btn-link" title="${r?"Edit/Remove Link":"Add Link"}" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
    </button>
    ${o?`
    <button class="media-floating-toolbar-btn btn-replace" title="Replace Image" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
    </button>`:""}
    <div class="media-floating-toolbar-separator" aria-hidden="true"></div>
    <button class="media-floating-toolbar-btn btn-remove" title="Remove" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
    </button>
  `,setTimeout(()=>{ae()},0);const i=()=>ae();let l=e.parentElement;for(;l;)l.addEventListener("scroll",i),l=l.parentElement;window.addEventListener("scroll",i),window.addEventListener("resize",i),n._cleanup=()=>{let k=e.parentElement;for(;k;)k.removeEventListener("scroll",i),k=k.parentElement;window.removeEventListener("scroll",i),window.removeEventListener("resize",i)},(s=n.querySelector(".btn-align-left"))==null||s.addEventListener("click",()=>{e.style.display="block",e.style.marginLeft="0",e.style.marginRight="auto",ae()}),(c=n.querySelector(".btn-align-center"))==null||c.addEventListener("click",()=>{e.style.display="block",e.style.marginLeft="auto",e.style.marginRight="auto",ae()}),(u=n.querySelector(".btn-align-right"))==null||u.addEventListener("click",()=>{e.style.display="block",e.style.marginLeft="auto",e.style.marginRight="0",ae()}),(g=n.querySelector(".btn-alt"))==null||g.addEventListener("click",()=>{e.tagName==="IMG"&&zi(e)}),(p=n.querySelector(".btn-link"))==null||p.addEventListener("click",()=>{Bi(e)}),(m=n.querySelector(".btn-replace"))==null||m.addEventListener("click",()=>{e.tagName==="IMG"&&$i(e)}),(f=n.querySelector(".btn-resize"))==null||f.addEventListener("click",()=>{const k=prompt("Enter width in pixels:",String(e.width||e.offsetWidth));if(k&&!isNaN(parseInt(k))){const h=parseInt(k);e.style.width=`${h}px`,e.setAttribute("width",String(h)),we(),ae()}}),(C=n.querySelector(".btn-remove"))==null||C.addEventListener("click",()=>{confirm("Remove this media?")&&(e.remove(),S&&(S._cleanup&&S._cleanup(),S.remove(),S=null),N=null,we())}),n._cleanup=()=>{window.removeEventListener("scroll",ae),window.removeEventListener("resize",ae)}},rr=e=>{Ke=e||null,Oi(),document.addEventListener("click",t=>{const n=t.target;if(n.tagName==="IMG"||n.tagName==="VIDEO"){const o=n;let r=!1;if(Ke?r=Ke.contains(o):r=!!o.closest('[contenteditable="true"]'),r){t.preventDefault(),t.stopPropagation(),N=o,N.style.display="block",en(o),we();return}}if(!n.closest(".btn-link, .btn-resize, .btn-remove")&&S&&!n.closest("button")){if(S._cleanup&&S._cleanup(),S.remove(),S=null,N&&N.parentElement){const o=N.parentElement;o._originalPosition!==void 0&&(o.style.position=o._originalPosition,delete o._originalPosition)}N=null,we()}}),yt.forEach(t=>{t.addEventListener("mousedown",n=>{if(!N)return;n.preventDefault(),n.stopPropagation(),ut=!0,Ue=t.getAttribute("data-position"),go=n.clientX,ho=n.clientY;const o=N.getBoundingClientRect();ye=o.width,xe=o.height,Ft=ye/xe,document.body.style.userSelect="none",document.body.style.cursor=`${Ue}-resize`})}),document.addEventListener("mousemove",t=>{if(!ut||!N||!Ue)return;const n=t.clientX-go,o=t.clientY-ho;let r=ye,i=xe;switch(Ue){case"se":r=ye+n,i=xe+o;break;case"sw":r=ye-n,i=xe+o;break;case"ne":r=ye+n,i=xe-o;break;case"nw":r=ye-n,i=xe-o;break}Math.abs(n)>Math.abs(o)?i=r/Ft:r=i*Ft,r=Math.max(50,r),i=Math.max(50,i),N.style.width=`${r}px`,N.style.height=`${i}px`,N.setAttribute("width",String(Math.round(r))),N.setAttribute("height",String(Math.round(i))),we(),ae()}),document.addEventListener("mouseup",()=>{ut&&(ut=!1,Ue=null,document.body.style.userSelect="",document.body.style.cursor="")}),window.addEventListener("scroll",we),window.addEventListener("resize",we)};typeof window<"u"&&!window.__mediaManagerInitialized&&(window.__mediaManagerInitialized=!0,rr());const Ta=()=>({name:"image",initialize:e=>{const t=e==null?void 0:e.editorElement;rr(t)},toolbar:[{label:"Image",command:"insertImage",icon:'<svg width="24px" height="24px" viewBox="0 0 32 32" enable-background="new 0 0 32 32"><g><rect fill="none" height="22" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" width="30" x="1" y="5"></rect><polygon fill="none" points="31,27 21,17 11,27" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></polygon><polygon fill="none" points="18,20 9,11 1,19 1,27 11,27" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></polygon><circle cx="19" cy="11" fill="none" r="2" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></circle></g></svg>'},{label:"Video",command:"insertVideo",icon:'<svg width="24" height="24" focusable="false"><path d="M4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm1 2v14h14V5H5Zm4.8 2.6 5.6 4a.5.5 0 0 1 0 .8l-5.6 4A.5.5 0 0 1 9 16V8a.5.5 0 0 1 .8-.4Z" fill-rule="nonzero"></path></svg>'}],commands:{insertImage:(e,t)=>{const n=(t==null?void 0:t.contentElement)instanceof HTMLElement?t.contentElement:void 0;return bo("image",n),!0},insertVideo:(e,t)=>{const n=(t==null?void 0:t.contentElement)instanceof HTMLElement?t.contentElement:void 0;return bo("video",n),!0}},keymap:{"Mod-Shift-i":"insertImage"}}),qt=new WeakMap,ir="rte-fullscreen-active",xt=e=>(qt.has(e)||qt.set(e,{isFullscreen:!1,fullscreenButton:null}),qt.get(e)),Pi=(e,t)=>{if(e.classList.add(ir),e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.right="0",e.style.bottom="0",e.style.width="100%",e.style.height="100%",e.style.maxWidth="100%",e.style.maxHeight="100%",e.style.borderRadius="0",e.style.zIndex="9999",e.style.margin="0",e.style.padding="0",e.style.boxShadow="none",e.style.display="flex",e.style.flexDirection="column",e.style.background="white",document.body.style.overflow="hidden",document.body.classList.add("fullscreen-active"),t.fullscreenButton){t.fullscreenButton.setAttribute("data-active","true"),t.fullscreenButton.style.backgroundColor="var(--rte-color-primary, #007bff)",t.fullscreenButton.style.color="white";const n=t.fullscreenButton.querySelector("svg");n&&(n.style.fill="white",n.style.stroke="white")}},tn=(e,t)=>{if(e.classList.remove(ir),e.style.position="",e.style.top="",e.style.left="",e.style.right="",e.style.bottom="",e.style.width="",e.style.height="",e.style.maxWidth="",e.style.maxHeight="",e.style.borderRadius="",e.style.zIndex="",e.style.margin="",e.style.padding="",e.style.boxShadow="",e.style.display="",e.style.flexDirection="",e.style.background="",document.body.style.overflow="",document.body.classList.remove("fullscreen-active"),t.fullscreenButton){t.fullscreenButton.setAttribute("data-active","false"),t.fullscreenButton.style.backgroundColor="",t.fullscreenButton.style.color="";const n=t.fullscreenButton.querySelector("svg");n&&(n.style.fill="",n.style.stroke="")}},Fi=e=>{try{if(!e){const n=document.activeElement;n&&n.closest("[data-editora-editor]")&&(e=n.closest("[data-editora-editor]"))}if(e||(e=document.querySelector("[data-editora-editor]")),!e)return console.warn("Editor element not found"),!1;const t=xt(e);return t.fullscreenButton||(t.fullscreenButton=e.querySelector('[data-command="toggleFullscreen"]')),t.isFullscreen=!t.isFullscreen,t.isFullscreen?Pi(e,t):tn(e,t),!0}catch(t){return console.error("Fullscreen toggle failed:",t),!1}},ar=e=>{if(!e){document.querySelectorAll("[data-editora-editor]").forEach(n=>{const o=n,r=xt(o);r.isFullscreen&&(r.isFullscreen=!1,tn(o,r))});return}const t=xt(e);t.isFullscreen&&(t.isFullscreen=!1,tn(e,t))},qi=e=>xt(e).isFullscreen,vo=()=>{const e=t=>{t.key==="Escape"&&ar()};return typeof window<"u"&&window.addEventListener("keydown",e),()=>{typeof window<"u"&&window.removeEventListener("keydown",e)}};typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",vo):vo());const La=()=>({name:"fullscreen",toolbar:[{label:"Fullscreen",command:"toggleFullscreen",type:"button",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>'}],commands:{toggleFullscreen:Fi},keymap:{Escape:()=>{const e=document.querySelectorAll("[data-editora-editor]");for(const t of e)if(qi(t))return ar(t),!0;return!1}}});/*! @license DOMPurify 3.3.2 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.2/LICENSE */const{entries:lr,setPrototypeOf:yo,isFrozen:Ui,getPrototypeOf:Vi,getOwnPropertyDescriptor:Wi}=Object;let{freeze:j,seal:ne,create:gt}=Object,{apply:nn,construct:on}=typeof Reflect<"u"&&Reflect;j||(j=function(t){return t});ne||(ne=function(t){return t});nn||(nn=function(t,n){for(var o=arguments.length,r=new Array(o>2?o-2:0),i=2;i<o;i++)r[i-2]=arguments[i];return t.apply(n,r)});on||(on=function(t){for(var n=arguments.length,o=new Array(n>1?n-1:0),r=1;r<n;r++)o[r-1]=arguments[r];return new t(...o)});const mt=X(Array.prototype.forEach),Gi=X(Array.prototype.lastIndexOf),xo=X(Array.prototype.pop),Ve=X(Array.prototype.push),ji=X(Array.prototype.splice),ht=X(String.prototype.toLowerCase),Ut=X(String.prototype.toString),Vt=X(String.prototype.match),We=X(String.prototype.replace),Xi=X(String.prototype.indexOf),Yi=X(String.prototype.trim),K=X(Object.prototype.hasOwnProperty),G=X(RegExp.prototype.test),Ge=Zi(TypeError);function X(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,o=new Array(n>1?n-1:0),r=1;r<n;r++)o[r-1]=arguments[r];return nn(e,t,o)}}function Zi(e){return function(){for(var t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];return on(e,n)}}function T(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:ht;yo&&yo(e,null);let o=t.length;for(;o--;){let r=t[o];if(typeof r=="string"){const i=n(r);i!==r&&(Ui(t)||(t[o]=i),r=i)}e[r]=!0}return e}function Ki(e){for(let t=0;t<e.length;t++)K(e,t)||(e[t]=null);return e}function le(e){const t=gt(null);for(const[n,o]of lr(e))K(e,n)&&(Array.isArray(o)?t[n]=Ki(o):o&&typeof o=="object"&&o.constructor===Object?t[n]=le(o):t[n]=o);return t}function je(e,t){for(;e!==null;){const o=Wi(e,t);if(o){if(o.get)return X(o.get);if(typeof o.value=="function")return X(o.value)}e=Vi(e)}function n(){return null}return n}const wo=j(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Wt=j(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Gt=j(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Qi=j(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),jt=j(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Ji=j(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Eo=j(["#text"]),ko=j(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Xt=j(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Co=j(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),ft=j(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),ea=ne(/\{\{[\w\W]*|[\w\W]*\}\}/gm),ta=ne(/<%[\w\W]*|[\w\W]*%>/gm),na=ne(/\$\{[\w\W]*/gm),oa=ne(/^data-[\-\w.\u00B7-\uFFFF]+$/),ra=ne(/^aria-[\-\w]+$/),sr=ne(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),ia=ne(/^(?:\w+script|data):/i),aa=ne(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),cr=ne(/^html$/i),la=ne(/^[a-z][.\w]*(-[.\w]+)+$/i);var To=Object.freeze({__proto__:null,ARIA_ATTR:ra,ATTR_WHITESPACE:aa,CUSTOM_ELEMENT:la,DATA_ATTR:oa,DOCTYPE_NAME:cr,ERB_EXPR:ta,IS_ALLOWED_URI:sr,IS_SCRIPT_OR_DATA:ia,MUSTACHE_EXPR:ea,TMPLIT_EXPR:na});const Xe={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,progressingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},sa=function(){return typeof window>"u"?null:window},ca=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let o=null;const r="data-tt-policy-suffix";n&&n.hasAttribute(r)&&(o=n.getAttribute(r));const i="dompurify"+(o?"#"+o:"");try{return t.createPolicy(i,{createHTML(l){return l},createScriptURL(l){return l}})}catch{return console.warn("TrustedTypes policy "+i+" could not be created."),null}},Lo=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function dr(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:sa();const t=v=>dr(v);if(t.version="3.3.2",t.removed=[],!e||!e.document||e.document.nodeType!==Xe.document||!e.Element)return t.isSupported=!1,t;let{document:n}=e;const o=n,r=o.currentScript,{DocumentFragment:i,HTMLTemplateElement:l,Node:s,Element:c,NodeFilter:u,NamedNodeMap:g=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:p,DOMParser:m,trustedTypes:f}=e,C=c.prototype,k=je(C,"cloneNode"),h=je(C,"remove"),E=je(C,"nextSibling"),x=je(C,"childNodes"),L=je(C,"parentNode");if(typeof l=="function"){const v=n.createElement("template");v.content&&v.content.ownerDocument&&(n=v.content.ownerDocument)}let y,A="";const{implementation:D,createNodeIterator:V,createDocumentFragment:Y,getElementsByTagName:J}=n,{importNode:Je}=o;let O=Lo();t.isSupported=typeof lr=="function"&&typeof L=="function"&&D&&D.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:ke,ERB_EXPR:w,TMPLIT_EXPR:H,DATA_ATTR:M,ARIA_ATTR:Oe,IS_SCRIPT_OR_DATA:se,ATTR_WHITESPACE:mn,CUSTOM_ELEMENT:pr}=To;let{IS_ALLOWED_URI:fn}=To,F=null;const pn=T({},[...wo,...Wt,...Gt,...jt,...Eo]);let q=null;const gn=T({},[...ko,...Xt,...Co,...ft]);let z=Object.seal(gt(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),ze=null,et=null;const pe=Object.seal(gt(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let hn=!0,Lt=!0,bn=!1,vn=!0,Ce=!1,tt=!0,be=!1,At=!1,St=!1,Te=!1,nt=!1,ot=!1,yn=!0,xn=!1;const gr="user-content-";let Mt=!0,Be=!1,Le={},re=null;const _t=T({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let wn=null;const En=T({},["audio","video","img","source","image","track"]);let Rt=null;const kn=T({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),rt="http://www.w3.org/1998/Math/MathML",it="http://www.w3.org/2000/svg",ce="http://www.w3.org/1999/xhtml";let Ae=ce,Nt=!1,It=null;const hr=T({},[rt,it,ce],Ut);let at=T({},["mi","mo","mn","ms","mtext"]),lt=T({},["annotation-xml"]);const br=T({},["title","style","font","a","script"]);let $e=null;const vr=["application/xhtml+xml","text/html"],yr="text/html";let P=null,Se=null;const xr=n.createElement("form"),Cn=function(a){return a instanceof RegExp||a instanceof Function},Ht=function(){let a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(Se&&Se===a)){if((!a||typeof a!="object")&&(a={}),a=le(a),$e=vr.indexOf(a.PARSER_MEDIA_TYPE)===-1?yr:a.PARSER_MEDIA_TYPE,P=$e==="application/xhtml+xml"?Ut:ht,F=K(a,"ALLOWED_TAGS")?T({},a.ALLOWED_TAGS,P):pn,q=K(a,"ALLOWED_ATTR")?T({},a.ALLOWED_ATTR,P):gn,It=K(a,"ALLOWED_NAMESPACES")?T({},a.ALLOWED_NAMESPACES,Ut):hr,Rt=K(a,"ADD_URI_SAFE_ATTR")?T(le(kn),a.ADD_URI_SAFE_ATTR,P):kn,wn=K(a,"ADD_DATA_URI_TAGS")?T(le(En),a.ADD_DATA_URI_TAGS,P):En,re=K(a,"FORBID_CONTENTS")?T({},a.FORBID_CONTENTS,P):_t,ze=K(a,"FORBID_TAGS")?T({},a.FORBID_TAGS,P):le({}),et=K(a,"FORBID_ATTR")?T({},a.FORBID_ATTR,P):le({}),Le=K(a,"USE_PROFILES")?a.USE_PROFILES:!1,hn=a.ALLOW_ARIA_ATTR!==!1,Lt=a.ALLOW_DATA_ATTR!==!1,bn=a.ALLOW_UNKNOWN_PROTOCOLS||!1,vn=a.ALLOW_SELF_CLOSE_IN_ATTR!==!1,Ce=a.SAFE_FOR_TEMPLATES||!1,tt=a.SAFE_FOR_XML!==!1,be=a.WHOLE_DOCUMENT||!1,Te=a.RETURN_DOM||!1,nt=a.RETURN_DOM_FRAGMENT||!1,ot=a.RETURN_TRUSTED_TYPE||!1,St=a.FORCE_BODY||!1,yn=a.SANITIZE_DOM!==!1,xn=a.SANITIZE_NAMED_PROPS||!1,Mt=a.KEEP_CONTENT!==!1,Be=a.IN_PLACE||!1,fn=a.ALLOWED_URI_REGEXP||sr,Ae=a.NAMESPACE||ce,at=a.MATHML_TEXT_INTEGRATION_POINTS||at,lt=a.HTML_INTEGRATION_POINTS||lt,z=a.CUSTOM_ELEMENT_HANDLING||{},a.CUSTOM_ELEMENT_HANDLING&&Cn(a.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(z.tagNameCheck=a.CUSTOM_ELEMENT_HANDLING.tagNameCheck),a.CUSTOM_ELEMENT_HANDLING&&Cn(a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(z.attributeNameCheck=a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),a.CUSTOM_ELEMENT_HANDLING&&typeof a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(z.allowCustomizedBuiltInElements=a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),Ce&&(Lt=!1),nt&&(Te=!0),Le&&(F=T({},Eo),q=gt(null),Le.html===!0&&(T(F,wo),T(q,ko)),Le.svg===!0&&(T(F,Wt),T(q,Xt),T(q,ft)),Le.svgFilters===!0&&(T(F,Gt),T(q,Xt),T(q,ft)),Le.mathMl===!0&&(T(F,jt),T(q,Co),T(q,ft))),K(a,"ADD_TAGS")||(pe.tagCheck=null),K(a,"ADD_ATTR")||(pe.attributeCheck=null),a.ADD_TAGS&&(typeof a.ADD_TAGS=="function"?pe.tagCheck=a.ADD_TAGS:(F===pn&&(F=le(F)),T(F,a.ADD_TAGS,P))),a.ADD_ATTR&&(typeof a.ADD_ATTR=="function"?pe.attributeCheck=a.ADD_ATTR:(q===gn&&(q=le(q)),T(q,a.ADD_ATTR,P))),a.ADD_URI_SAFE_ATTR&&T(Rt,a.ADD_URI_SAFE_ATTR,P),a.FORBID_CONTENTS&&(re===_t&&(re=le(re)),T(re,a.FORBID_CONTENTS,P)),a.ADD_FORBID_CONTENTS&&(re===_t&&(re=le(re)),T(re,a.ADD_FORBID_CONTENTS,P)),Mt&&(F["#text"]=!0),be&&T(F,["html","head","body"]),F.table&&(T(F,["tbody"]),delete ze.tbody),a.TRUSTED_TYPES_POLICY){if(typeof a.TRUSTED_TYPES_POLICY.createHTML!="function")throw Ge('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof a.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw Ge('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');y=a.TRUSTED_TYPES_POLICY,A=y.createHTML("")}else y===void 0&&(y=ca(f,r)),y!==null&&typeof A=="string"&&(A=y.createHTML(""));j&&j(a),Se=a}},Tn=T({},[...Wt,...Gt,...Qi]),Ln=T({},[...jt,...Ji]),wr=function(a){let d=L(a);(!d||!d.tagName)&&(d={namespaceURI:Ae,tagName:"template"});const b=ht(a.tagName),R=ht(d.tagName);return It[a.namespaceURI]?a.namespaceURI===it?d.namespaceURI===ce?b==="svg":d.namespaceURI===rt?b==="svg"&&(R==="annotation-xml"||at[R]):!!Tn[b]:a.namespaceURI===rt?d.namespaceURI===ce?b==="math":d.namespaceURI===it?b==="math"&&lt[R]:!!Ln[b]:a.namespaceURI===ce?d.namespaceURI===it&&!lt[R]||d.namespaceURI===rt&&!at[R]?!1:!Ln[b]&&(br[b]||!Tn[b]):!!($e==="application/xhtml+xml"&&It[a.namespaceURI]):!1},ie=function(a){Ve(t.removed,{element:a});try{L(a).removeChild(a)}catch{h(a)}},ve=function(a,d){try{Ve(t.removed,{attribute:d.getAttributeNode(a),from:d})}catch{Ve(t.removed,{attribute:null,from:d})}if(d.removeAttribute(a),a==="is")if(Te||nt)try{ie(d)}catch{}else try{d.setAttribute(a,"")}catch{}},An=function(a){let d=null,b=null;if(St)a="<remove></remove>"+a;else{const B=Vt(a,/^[\r\n\t ]+/);b=B&&B[0]}$e==="application/xhtml+xml"&&Ae===ce&&(a='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+a+"</body></html>");const R=y?y.createHTML(a):a;if(Ae===ce)try{d=new m().parseFromString(R,$e)}catch{}if(!d||!d.documentElement){d=D.createDocument(Ae,"template",null);try{d.documentElement.innerHTML=Nt?A:R}catch{}}const W=d.body||d.documentElement;return a&&b&&W.insertBefore(n.createTextNode(b),W.childNodes[0]||null),Ae===ce?J.call(d,be?"html":"body")[0]:be?d.documentElement:W},Sn=function(a){return V.call(a.ownerDocument||a,a,u.SHOW_ELEMENT|u.SHOW_COMMENT|u.SHOW_TEXT|u.SHOW_PROCESSING_INSTRUCTION|u.SHOW_CDATA_SECTION,null)},Dt=function(a){return a instanceof p&&(typeof a.nodeName!="string"||typeof a.textContent!="string"||typeof a.removeChild!="function"||!(a.attributes instanceof g)||typeof a.removeAttribute!="function"||typeof a.setAttribute!="function"||typeof a.namespaceURI!="string"||typeof a.insertBefore!="function"||typeof a.hasChildNodes!="function")},Mn=function(a){return typeof s=="function"&&a instanceof s};function de(v,a,d){mt(v,b=>{b.call(t,a,d,Se)})}const _n=function(a){let d=null;if(de(O.beforeSanitizeElements,a,null),Dt(a))return ie(a),!0;const b=P(a.nodeName);if(de(O.uponSanitizeElement,a,{tagName:b,allowedTags:F}),tt&&a.hasChildNodes()&&!Mn(a.firstElementChild)&&G(/<[/\w!]/g,a.innerHTML)&&G(/<[/\w!]/g,a.textContent)||a.nodeType===Xe.progressingInstruction||tt&&a.nodeType===Xe.comment&&G(/<[/\w]/g,a.data))return ie(a),!0;if(!(pe.tagCheck instanceof Function&&pe.tagCheck(b))&&(!F[b]||ze[b])){if(!ze[b]&&Nn(b)&&(z.tagNameCheck instanceof RegExp&&G(z.tagNameCheck,b)||z.tagNameCheck instanceof Function&&z.tagNameCheck(b)))return!1;if(Mt&&!re[b]){const R=L(a)||a.parentNode,W=x(a)||a.childNodes;if(W&&R){const B=W.length;for(let Z=B-1;Z>=0;--Z){const ue=k(W[Z],!0);ue.__removalCount=(a.__removalCount||0)+1,R.insertBefore(ue,E(a))}}}return ie(a),!0}return a instanceof c&&!wr(a)||(b==="noscript"||b==="noembed"||b==="noframes")&&G(/<\/no(script|embed|frames)/i,a.innerHTML)?(ie(a),!0):(Ce&&a.nodeType===Xe.text&&(d=a.textContent,mt([ke,w,H],R=>{d=We(d,R," ")}),a.textContent!==d&&(Ve(t.removed,{element:a.cloneNode()}),a.textContent=d)),de(O.afterSanitizeElements,a,null),!1)},Rn=function(a,d,b){if(et[d]||yn&&(d==="id"||d==="name")&&(b in n||b in xr))return!1;if(!(Lt&&!et[d]&&G(M,d))){if(!(hn&&G(Oe,d))){if(!(pe.attributeCheck instanceof Function&&pe.attributeCheck(d,a))){if(!q[d]||et[d]){if(!(Nn(a)&&(z.tagNameCheck instanceof RegExp&&G(z.tagNameCheck,a)||z.tagNameCheck instanceof Function&&z.tagNameCheck(a))&&(z.attributeNameCheck instanceof RegExp&&G(z.attributeNameCheck,d)||z.attributeNameCheck instanceof Function&&z.attributeNameCheck(d,a))||d==="is"&&z.allowCustomizedBuiltInElements&&(z.tagNameCheck instanceof RegExp&&G(z.tagNameCheck,b)||z.tagNameCheck instanceof Function&&z.tagNameCheck(b))))return!1}else if(!Rt[d]){if(!G(fn,We(b,mn,""))){if(!((d==="src"||d==="xlink:href"||d==="href")&&a!=="script"&&Xi(b,"data:")===0&&wn[a])){if(!(bn&&!G(se,We(b,mn,"")))){if(b)return!1}}}}}}}return!0},Nn=function(a){return a!=="annotation-xml"&&Vt(a,pr)},In=function(a){de(O.beforeSanitizeAttributes,a,null);const{attributes:d}=a;if(!d||Dt(a))return;const b={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:q,forceKeepAttr:void 0};let R=d.length;for(;R--;){const W=d[R],{name:B,namespaceURI:Z,value:ue}=W,Me=P(B),Ot=ue;let U=B==="value"?Ot:Yi(Ot);if(b.attrName=Me,b.attrValue=U,b.keepAttr=!0,b.forceKeepAttr=void 0,de(O.uponSanitizeAttribute,a,b),U=b.attrValue,xn&&(Me==="id"||Me==="name")&&(ve(B,a),U=gr+U),tt&&G(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,U)){ve(B,a);continue}if(Me==="attributename"&&Vt(U,"href")){ve(B,a);continue}if(b.forceKeepAttr)continue;if(!b.keepAttr){ve(B,a);continue}if(!vn&&G(/\/>/i,U)){ve(B,a);continue}Ce&&mt([ke,w,H],Dn=>{U=We(U,Dn," ")});const Hn=P(a.nodeName);if(!Rn(Hn,Me,U)){ve(B,a);continue}if(y&&typeof f=="object"&&typeof f.getAttributeType=="function"&&!Z)switch(f.getAttributeType(Hn,Me)){case"TrustedHTML":{U=y.createHTML(U);break}case"TrustedScriptURL":{U=y.createScriptURL(U);break}}if(U!==Ot)try{Z?a.setAttributeNS(Z,B,U):a.setAttribute(B,U),Dt(a)?ie(a):xo(t.removed)}catch{ve(B,a)}}de(O.afterSanitizeAttributes,a,null)},Er=function v(a){let d=null;const b=Sn(a);for(de(O.beforeSanitizeShadowDOM,a,null);d=b.nextNode();)de(O.uponSanitizeShadowNode,d,null),_n(d),In(d),d.content instanceof i&&v(d.content);de(O.afterSanitizeShadowDOM,a,null)};return t.sanitize=function(v){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},d=null,b=null,R=null,W=null;if(Nt=!v,Nt&&(v="<!-->"),typeof v!="string"&&!Mn(v))if(typeof v.toString=="function"){if(v=v.toString(),typeof v!="string")throw Ge("dirty is not a string, aborting")}else throw Ge("toString is not a function");if(!t.isSupported)return v;if(At||Ht(a),t.removed=[],typeof v=="string"&&(Be=!1),Be){if(v.nodeName){const ue=P(v.nodeName);if(!F[ue]||ze[ue])throw Ge("root node is forbidden and cannot be sanitized in-place")}}else if(v instanceof s)d=An("<!---->"),b=d.ownerDocument.importNode(v,!0),b.nodeType===Xe.element&&b.nodeName==="BODY"||b.nodeName==="HTML"?d=b:d.appendChild(b);else{if(!Te&&!Ce&&!be&&v.indexOf("<")===-1)return y&&ot?y.createHTML(v):v;if(d=An(v),!d)return Te?null:ot?A:""}d&&St&&ie(d.firstChild);const B=Sn(Be?v:d);for(;R=B.nextNode();)_n(R),In(R),R.content instanceof i&&Er(R.content);if(Be)return v;if(Te){if(nt)for(W=Y.call(d.ownerDocument);d.firstChild;)W.appendChild(d.firstChild);else W=d;return(q.shadowroot||q.shadowrootmode)&&(W=Je.call(o,W,!0)),W}let Z=be?d.outerHTML:d.innerHTML;return be&&F["!doctype"]&&d.ownerDocument&&d.ownerDocument.doctype&&d.ownerDocument.doctype.name&&G(cr,d.ownerDocument.doctype.name)&&(Z="<!DOCTYPE "+d.ownerDocument.doctype.name+`>
`+Z),Ce&&mt([ke,w,H],ue=>{Z=We(Z,ue," ")}),y&&ot?y.createHTML(Z):Z},t.setConfig=function(){let v=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Ht(v),At=!0},t.clearConfig=function(){Se=null,At=!1},t.isValidAttribute=function(v,a,d){Se||Ht({});const b=P(v),R=P(a);return Rn(b,R,d)},t.addHook=function(v,a){typeof a=="function"&&Ve(O[v],a)},t.removeHook=function(v,a){if(a!==void 0){const d=Gi(O[v],a);return d===-1?void 0:ji(O[v],d,1)[0]}return xo(O[v])},t.removeHooks=function(v){O[v]=[]},t.removeAllHooks=function(){O=Lo()},t}var Aa=dr();const da=new Set,un=[],he=e=>{un.push(e)},Ye='[data-theme="dark"], .dark, .editora-theme-dark';he({id:"image-alt-text",wcag:"1.1.1",description:"Images must have alt text",severity:"error",selector:"img",evaluate(e,t){var o;const n=e;return n.hasAttribute("role")&&n.getAttribute("role")==="presentation"||n.hasAttribute("data-a11y-ignore")&&n.getAttribute("data-a11y-ignore")==="image-alt-text"?null:!n.hasAttribute("alt")||((o=n.getAttribute("alt"))==null?void 0:o.trim())===""?{id:`img-alt-${t.cache.get("imgIdx")}`,rule:"image-alt-text",wcag:"1.1.1",severity:"error",message:"Image missing alt text",nodePath:t.cache.get("imgPath"),element:n,suggestion:"Add descriptive alt text to all images",fixable:!0,fixLabel:"Add empty alt"}:null},fix(e){e.element&&e.element.setAttribute("alt","")}});he({id:"empty-interactive",wcag:"4.1.2",description:"Interactive elements must have accessible names",severity:"error",selector:'button, a, [role="button"]',evaluate(e,t){var s;const n=e;if(n.hasAttribute("data-a11y-ignore")&&n.getAttribute("data-a11y-ignore")==="empty-interactive")return null;const o=(s=n.textContent)==null?void 0:s.trim(),r=n.hasAttribute("aria-label"),i=n.hasAttribute("aria-labelledby"),l=n.hasAttribute("title");return!o&&!r&&!i&&!l?{id:`interactive-empty-${t.cache.get("buttonIdx")}`,rule:"empty-interactive",wcag:"4.1.2",severity:"error",message:"Interactive element has no accessible name",nodePath:t.cache.get("buttonPath"),element:n,suggestion:"Add text, aria-label, aria-labelledby, or title",fixable:!0,fixLabel:"Add aria-label"}:null},fix(e){e.element&&e.element.setAttribute("aria-label","Button")}});he({id:"form-label",wcag:"1.3.1",description:"Form controls must have labels",severity:"error",selector:"input, textarea, select",evaluate(e,t){const n=e;if(n.hasAttribute("type")&&n.getAttribute("type")==="hidden"||n.hasAttribute("data-a11y-ignore")&&n.getAttribute("data-a11y-ignore")==="form-label")return null;const o=t.doc.querySelector(`label[for="${n.getAttribute("id")}"]`),r=n.hasAttribute("aria-label"),i=n.hasAttribute("aria-labelledby");return!o&&!r&&!i?{id:`form-label-${t.cache.get("inputIdx")}`,rule:"form-label",wcag:"1.3.1",severity:"error",message:"Form control missing label",nodePath:t.cache.get("inputPath"),element:n,suggestion:"Add <label>, aria-label, or aria-labelledby",fixable:!0,fixLabel:"Add aria-label"}:null},fix(e){e.element&&e.element.setAttribute("aria-label","Input")}});he({id:"table-headers",wcag:"1.3.1",description:"Tables must have header rows",severity:"error",selector:"table",evaluate(e,t){const n=e;if(n.hasAttribute("data-a11y-ignore")&&n.getAttribute("data-a11y-ignore")==="table-headers")return null;const o=n.querySelectorAll("th"),r=n.querySelectorAll("tr");return o.length===0&&r.length>0?{id:`table-no-headers-${t.cache.get("tableIdx")}`,rule:"table-headers",wcag:"1.3.1",severity:"error",message:"Table missing header row (<th> elements)",nodePath:t.cache.get("tablePath"),element:n,suggestion:"Add <th> elements to first row",fixable:!0,fixLabel:"Convert first row to headers"}:null},fix(e){if(e.element){const n=e.element.querySelector("tr");n&&Array.from(n.children).forEach(o=>{if(o.tagName==="TD"){const r=document.createElement("th");r.innerHTML=o.innerHTML,n.replaceChild(r,o)}})}}});he({id:"heading-empty",wcag:"1.3.1",description:"Headings must not be empty",severity:"error",selector:"h1, h2, h3, h4, h5, h6",evaluate(e,t){var i;const n=e;if(n.hasAttribute("data-a11y-ignore")&&n.getAttribute("data-a11y-ignore")==="heading-empty")return null;const o=((i=n.textContent)==null?void 0:i.replace(/\s+/g,""))||"",r=n.childNodes.length===1&&n.childNodes[0].nodeName==="BR";return!o&&!r?{id:`heading-empty-${t.cache.get("headingIdx")}`,rule:"heading-empty",wcag:"1.3.1",severity:"error",message:`Empty ${n.tagName.toLowerCase()} heading`,nodePath:t.cache.get("headingPath"),element:n,suggestion:"All headings must contain text",fixable:!1}:null}});he({id:"heading-order",wcag:"1.3.1",description:"Headings should not skip levels",severity:"warning",selector:"h1, h2, h3, h4, h5, h6",evaluate(e,t){const n=e,o=parseInt(n.tagName[1]),r=t.cache.get("previousHeadingLevel")||o;return t.cache.set("previousHeadingLevel",o),o-r>1?{id:`heading-order-${t.cache.get("headingIdx")}`,rule:"heading-order",wcag:"1.3.1",severity:"warning",message:`Heading skips level (${r} → ${o})`,nodePath:t.cache.get("headingPath"),element:n,suggestion:`Use heading level ${r+1} instead`,fixable:!1}:null}});he({id:"link-text",wcag:"2.4.4",description:"Links must have descriptive text",severity:"error",selector:"a",evaluate(e,t){var l,s;const n=e;if(n.hasAttribute("data-a11y-ignore")&&n.getAttribute("data-a11y-ignore")==="link-text")return null;const o=((l=n.textContent)==null?void 0:l.replace(/\s+/g,"").toLowerCase())||"",r=n.childNodes.length===1&&n.childNodes[0].nodeName==="BR",i=["clickhere","readmore","link","here","this","page"];return!o&&!r?{id:`link-empty-${t.cache.get("aIdx")}`,rule:"link-text",wcag:"2.4.4",severity:"error",message:"Link has no text content",nodePath:t.cache.get("aPath"),element:n,suggestion:"All links must have descriptive text",fixable:!0,fixLabel:"Insert placeholder"}:i.some(c=>o.includes(c))?{id:`link-vague-${t.cache.get("aIdx")}`,rule:"link-text",wcag:"2.4.4",severity:"warning",message:`Vague link text: "${(s=n.textContent)==null?void 0:s.trim()}"`,nodePath:t.cache.get("aPath"),element:n,suggestion:"Use descriptive link text",fixable:!1}:null},fix(e){e.element&&(e.element.textContent="Link")}});he({id:"list-structure",wcag:"1.3.1",description:"Lists must only contain <li> children",severity:"error",selector:"ul, ol",evaluate(e,t){const n=e;if(n.hasAttribute("data-a11y-ignore")&&n.getAttribute("data-a11y-ignore")==="list-structure")return null;const o=n.querySelectorAll(":scope > li");return Array.from(n.children).filter(i=>i.tagName!=="LI").length>0?{id:`list-structure-${t.cache.get("ulIdx")}`,rule:"list-structure",wcag:"1.3.1",severity:"error",message:"List contains non-li elements",nodePath:t.cache.get("ulPath"),element:n,suggestion:"All direct children of ul/ol must be li elements",fixable:!1}:o.length===0?{id:`list-empty-${t.cache.get("ulIdx")}`,rule:"list-structure",wcag:"1.3.1",severity:"warning",message:"Empty list element",nodePath:t.cache.get("ulPath"),element:n,suggestion:"Remove empty lists or add list items",fixable:!1}:null}});const ur=()=>{const e=window.getSelection();if(e&&e.rangeCount>0){let n=e.getRangeAt(0).startContainer;for(;n&&n!==document.body;){if(n.nodeType===Node.ELEMENT_NODE){const o=n;if(o.getAttribute("contenteditable")==="true")return o}n=n.parentNode}}const t=document.activeElement;if(t){if(t.getAttribute("contenteditable")==="true")return t;const n=t.closest('[contenteditable="true"]');if(n)return n}return document.querySelector('[contenteditable="true"]')},ua=()=>{const e=ur();if(e!=null&&e.closest(Ye))return!0;const t=window.getSelection();if(t&&t.rangeCount>0){const o=t.getRangeAt(0).startContainer,r=o.nodeType===Node.ELEMENT_NODE?o:o.parentElement;if(r!=null&&r.closest(Ye))return!0}const n=document.activeElement;return n!=null&&n.closest(Ye)?!0:document.body.matches(Ye)||document.documentElement.matches(Ye)},mr=()=>{var c,u,g;const e=ur();if(!e)return[];const t=[],n={doc:e.ownerDocument||document,cache:new Map},o=n.doc.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,null);let r=o.currentNode,i={},l={},s=0;for(;r&&s<5e3;){const p=r,m=((u=(c=p.tagName)==null?void 0:c.toLowerCase)==null?void 0:u.call(c))||"";if(p.hidden||p.style.display==="none"||p.style.visibility==="hidden"){r=o.nextNode(),s++;continue}i[m]=(i[m]||0)+1,l[m]=`${m}[${i[m]-1}]`;for(const f of un){if(da.has(f.id)||f.selector&&!((g=r.matches)!=null&&g.call(r,f.selector)))continue;n.cache.set(`${m}Idx`,i[m]-1),n.cache.set(`${m}Path`,l[m]),/^h[1-6]$/.test(m)&&(n.cache.set("headingIdx",i[m]-1),n.cache.set("headingPath",l[m])),m==="a"&&(n.cache.set("aIdx",i[m]-1),n.cache.set("aPath",l[m])),m==="table"&&(n.cache.set("tableIdx",i[m]-1),n.cache.set("tablePath",l[m])),m==="button"&&(n.cache.set("buttonIdx",i[m]-1),n.cache.set("buttonPath",l[m])),m==="input"&&(n.cache.set("inputIdx",i[m]-1),n.cache.set("inputPath",l[m])),(m==="ul"||m==="ol")&&(n.cache.set("ulIdx",i[m]-1),n.cache.set("ulPath",l[m]));const C=f.evaluate(r,n);C&&t.push(C)}r=o.nextNode(),s++}return t},Re=(e,t=!0)=>{e.element&&(t?(e.element.classList.add("a11y-highlighted"),e.element.style.outline="2px solid #ff9800",e.element.style.backgroundColor="#fff3cd"):(e.element.classList.remove("a11y-highlighted"),e.element.style.outline="",e.element.style.backgroundColor=""))},ma=e=>{e||(e=mr());const t=e.filter(r=>r.severity==="error").length,n=e.filter(r=>r.severity==="warning").length;let o=100-t*20-n*5;return Math.max(0,o)},fa=e=>{const t=un.find(n=>n.id===e.rule);t&&t.fix&&t.fix(e)},fr=()=>{const e=mr(),t=ma(e),o=ua()?{overlay:"rgba(0, 0, 0, 0.62)",dialogBg:"#1f2937",panelBg:"#222d3a",border:"#3b4657",text:"#e2e8f0",muted:"#9fb0c6",closeHover:"#334155",summaryBg:"#111827",issueBg:"#1f2937",issueHoverBg:"#273244",issueBorder:"#4b5563",issueHoverBorder:"#58a6ff",fixBtn:"#3b82f6",fixBtnHover:"#2563eb"}:{overlay:"rgba(0, 0, 0, 0.5)",dialogBg:"#ffffff",panelBg:"#ffffff",border:"#e0e0e0",text:"#1f2937",muted:"#666666",closeHover:"#f0f0f0",summaryBg:"#f5f5f5",issueBg:"#ffffff",issueHoverBg:"#f5f9ff",issueBorder:"#e0e0e0",issueHoverBorder:"#2196f3",fixBtn:"#2196f3",fixBtnHover:"#1976d2"},r=document.createElement("div");r.className="a11y-dialog-overlay",r.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${o.overlay};
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;const i=document.createElement("div");i.className="a11y-dialog",i.style.cssText=`
    background: ${o.dialogBg};
    border: 1px solid ${o.border};
    color: ${o.text};
    border-radius: 8px;
    max-width: 800px;
    width: 90%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  `;const l=document.createElement("div");l.style.cssText=`
    padding: 20px;
    border-bottom: 1px solid ${o.border};
    background: ${o.panelBg};
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;const s=document.createElement("h2");s.style.cssText=`margin: 0; font-size: 20px; font-weight: 600; color: ${o.text};`,s.textContent="Accessibility Checker";const c=document.createElement("div");c.style.cssText=`
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
    color: ${o.muted};
  `,u.onmouseover=()=>{u.style.background=o.closeHover,u.style.color="#f8fafc"},u.onmouseout=()=>{u.style.background="none",u.style.color=o.muted},u.onclick=()=>{e.forEach(f=>Re(f,!1)),r.remove()};const g=document.createElement("div");g.style.cssText="display: flex; align-items: center; gap: 16px;",g.appendChild(s),g.appendChild(c),l.appendChild(g),l.appendChild(u);const p=document.createElement("div");if(p.style.cssText=`
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: ${o.dialogBg};
  `,e.length===0)p.innerHTML=`
      <div style="text-align: center; padding: 40px 20px;">
        <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
        <h3 style="margin: 0 0 8px 0; color: #4caf50;">No issues found!</h3>
        <p style="margin: 0; color: ${o.muted};">Your content meets WCAG 2.1 AA standards.</p>
      </div>
    `;else{const f=document.createElement("div");f.style.cssText=`
      background: ${o.summaryBg};
      border: 1px solid ${o.border};
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 20px;
      display: flex;
      gap: 20px;
    `;const C=e.filter(E=>E.severity==="error").length,k=e.filter(E=>E.severity==="warning").length,h=e.filter(E=>E.severity==="info").length;f.innerHTML=`
      <div><strong style="color: #f44336;">${C}</strong> <span style="color: ${o.muted};">Errors</span></div>
      <div><strong style="color: #ff9800;">${k}</strong> <span style="color: ${o.muted};">Warnings</span></div>
      <div><strong style="color: #2196f3;">${h}</strong> <span style="color: ${o.muted};">Info</span></div>
    `,p.appendChild(f),e.forEach(E=>{const x=document.createElement("div");x.style.cssText=`
        border: 1px solid ${o.issueBorder};
        border-radius: 6px;
        padding: 16px;
        margin-bottom: 12px;
        transition: all 0.2s;
        background: ${o.issueBg};
        color: ${o.text};
      `,x.onmouseover=()=>{x.style.borderColor=o.issueHoverBorder,x.style.background=o.issueHoverBg,Re(E,!0)},x.onmouseout=()=>{x.style.borderColor=o.issueBorder,x.style.background=o.issueBg,Re(E,!1)};const L=E.severity==="error"?"#f44336":E.severity==="warning"?"#ff9800":"#2196f3";if(x.innerHTML=`
        <div style="display: flex; align-items: start; gap: 12px; margin-bottom: 8px;">
          <span style="
            background: ${L};
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          ">${E.severity}</span>
          <div style="flex: 1;">
            <div style="font-weight: 600; margin-bottom: 4px;">${E.message}</div>
            <div style="font-size: 12px; color: ${o.muted};">WCAG ${E.wcag} · ${E.rule}</div>
          </div>
        </div>
        <div style="font-size: 14px; color: ${o.text}; margin-bottom: 8px; padding-left: 68px;">
          ${E.suggestion||""}
        </div>
      `,E.fixable){const y=document.createElement("button");y.textContent=`🔧 ${E.fixLabel||"Auto-fix"}`,y.style.cssText=`
          background: ${o.fixBtn};
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          margin-left: 68px;
        `,y.onmouseover=()=>y.style.background=o.fixBtnHover,y.onmouseout=()=>y.style.background=o.fixBtn,y.onclick=()=>{fa(E),y.textContent="✓ Fixed",y.style.background="#4caf50",y.disabled=!0,y.style.cursor="not-allowed",Re(E,!1),setTimeout(()=>{r.remove(),fr()},1e3)},x.appendChild(y)}p.appendChild(x)})}i.appendChild(l),i.appendChild(p),r.appendChild(i),document.body.appendChild(r),r.onclick=f=>{f.target===r&&(e.forEach(C=>Re(C,!1)),r.remove())};const m=f=>{f.key==="Escape"&&(e.forEach(C=>Re(C,!1)),r.remove(),document.removeEventListener("keydown",m))};document.addEventListener("keydown",m)},Sa=()=>({name:"a11yChecker",toolbar:[{label:"Accessibility",command:"toggleA11yChecker",icon:'<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M9 6.82954C10.1652 6.4177 11 5.30646 11 4.00024C11 2.34339 9.65686 1.00024 8 1.00024C6.34315 1.00024 5 2.34339 5 4.00024C5 5.30646 5.83481 6.4177 7 6.82954V12.0002C7 13.6571 8.34315 15.0002 10 15.0002H14.9296C15.264 15.0002 15.5762 15.1673 15.7617 15.4455L18.4913 19.54C19.1914 20.5901 20.6772 20.7373 21.5696 19.8448L22.7071 18.7074C23.0976 18.3168 23.0976 17.6837 22.7071 17.2931C22.3166 16.9026 21.6834 16.9026 21.2929 17.2931L20.1554 18.4306L17.4258 14.3361C16.8694 13.5015 15.9327 13.0002 14.9296 13.0002H10C9.44772 13.0002 9 12.5525 9 12.0002V11.0002H15C15.5523 11.0002 16 10.5525 16 10.0002C16 9.44796 15.5523 9.00025 15 9.00025H9V6.82954ZM8 5.10758C7.38844 5.10758 6.89267 4.61181 6.89267 4.00024C6.89267 3.38868 7.38844 2.89291 8 2.89291C8.61157 2.89291 9.10734 3.38868 9.10734 4.00024C9.10734 4.61181 8.61157 5.10758 8 5.10758Z" fill="#0F0F0F"></path> <path d="M4.6328 9.07414C5.10517 8.78987 5.69738 9.0279 5.91645 9.53381C6.13552 10.0397 5.89604 10.6205 5.43795 10.9272C4.92993 11.2673 4.48018 11.6911 4.10882 12.1826C3.53598 12.9408 3.16922 13.8345 3.04425 14.7765C2.91928 15.7185 3.04036 16.6768 3.3957 17.5582C3.75103 18.4395 4.32852 19.2138 5.07194 19.8058C5.81535 20.3977 6.69937 20.787 7.63791 20.9359C8.57646 21.0847 9.53756 20.988 10.4276 20.6552C11.3177 20.3223 12.1065 19.7647 12.7171 19.0366C13.1129 18.5645 13.4251 18.0313 13.6428 17.46C13.8391 16.9448 14.3514 16.5813 14.8936 16.6815C15.4357 16.7816 15.8004 17.3054 15.6291 17.8295C15.3326 18.7372 14.8644 19.583 14.2468 20.3194C13.4147 21.3117 12.3399 22.0716 11.1269 22.5252C9.91394 22.9787 8.6042 23.1105 7.32518 22.9077C6.04617 22.7048 4.84148 22.1742 3.82838 21.3676C2.81528 20.561 2.02831 19.5058 1.54407 18.3047C1.05983 17.1037 0.894836 15.7977 1.06514 14.5139C1.23545 13.2302 1.73525 12.0124 2.51589 10.9791C3.09523 10.2123 3.81459 9.56654 4.6328 9.07414Z" fill="#0F0F0F"></path> </g></svg>',shortcut:"Mod-Shift-Alt-a"}],commands:{toggleA11yChecker:()=>{try{return fr(),!0}catch(e){return console.error("Failed to open accessibility checker:",e),!1}}},keymap:{"Mod-Shift-Alt-a":"toggleA11yChecker"}});export{Sa as A,pa as B,La as F,va as H,ga as I,ba as L,Ta as M,xa as T,ha as U,ya as a,ui as b,mi as c,ka as d,wa as e,Ir as f,Dr as g,Ea as h,Ca as i,Aa as p};
