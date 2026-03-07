import{c as ne,L as ie,T as ae,B as se,C as ce,S as le}from"./index-76e7d200.js";import{R as de}from"./ReadOnlyExtension-88fcf3b5.js";import{S as ue}from"./SearchExtension-5db95884.js";const je=()=>({name:"strikethrough",marks:{strikethrough:{parseDOM:[{tag:"s"},{tag:"strike"},{tag:"del"},{style:"text-decoration",getAttrs:e=>(typeof e=="string"?e:e.style.textDecoration)==="line-through"&&null}],toDOM:()=>["s",0]}},toolbar:[{label:"Strikethrough",command:"toggleStrikethrough",icon:'<svg width="24" height="24" focusable="false"><g fill-rule="evenodd"><path d="M15.6 8.5c-.5-.7-1-1.1-1.3-1.3-.6-.4-1.3-.6-2-.6-2.7 0-2.8 1.7-2.8 2.1 0 1.6 1.8 2 3.2 2.3 4.4.9 4.6 2.8 4.6 3.9 0 1.4-.7 4.1-5 4.1A6.2 6.2 0 0 1 7 16.4l1.5-1.1c.4.6 1.6 2 3.7 2 1.6 0 2.5-.4 3-1.2.4-.8.3-2-.8-2.6-.7-.4-1.6-.7-2.9-1-1-.2-3.9-.8-3.9-3.6C7.6 6 10.3 5 12.4 5c2.9 0 4.2 1.6 4.7 2.4l-1.5 1.1Z"></path><path d="M5 11h14a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" fill-rule="nonzero"></path></g></svg>',shortcut:"Mod-Shift-x"}],commands:{toggleStrikethrough:()=>{const e=fe();if(!e)return!1;const t=window.getSelection();if(!t||t.rangeCount===0)return!1;const o=t.getRangeAt(0);if(!e.contains(o.commonAncestorContainer))return!1;e.focus({preventScroll:!0});const r=document.execCommand("strikeThrough",!1);return me(e),e.dispatchEvent(new Event("input",{bubbles:!0})),r!==!1}},keymap:{"Mod-Shift-x":"toggleStrikethrough","Mod-Shift-X":"toggleStrikethrough"}});function fe(){const e=window.getSelection();if(e&&e.rangeCount>0){const o=e.getRangeAt(0).startContainer,r=o.nodeType===Node.ELEMENT_NODE?o:o.parentElement,n=r==null?void 0:r.closest('[contenteditable="true"], .rte-content, .editora-content');if(n)return n}const t=document.activeElement;return t?t.getAttribute("contenteditable")==="true"?t:t.closest('[contenteditable="true"], .rte-content, .editora-content'):null}function me(e){e.querySelectorAll("strike, del").forEach(o=>{var n;const r=document.createElement("s");for(const i of Array.from(o.attributes))i.name!=="style"&&r.setAttribute(i.name,i.value);for(;o.firstChild;)r.appendChild(o.firstChild);(n=o.parentNode)==null||n.replaceChild(r,o)})}const Ge=()=>({name:"blockquote",nodes:{blockquote:{content:"block+",group:"block",parseDOM:[{tag:"blockquote"}],toDOM:()=>["blockquote",0]}},toolbar:[{label:"Quote",command:"toggleBlockquote",icon:'<svg fill="#000000" height="24px" width="24px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M13,11c0.6,0,1-0.4,1-1s-0.4-1-1-1c-5,0-9,4-9,9c0,2.8,2.2,5,5,5s5-2.2,5-5s-2.2-5-5-5c-0.3,0-0.7,0-1,0.1 C9.3,11.8,11,11,13,11z"></path> <path d="M23,13c-0.3,0-0.7,0-1,0.1c1.3-1.3,3-2.1,5-2.1c0.6,0,1-0.4,1-1s-0.4-1-1-1c-5,0-9,4-9,9c0,2.8,2.2,5,5,5s5-2.2,5-5 S25.8,13,23,13z"></path> </g> </g></svg>',shortcut:"Mod-Shift-9"}],commands:{toggleBlockquote:()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return!1;let t=e.anchorNode,o=!1;for(;t&&t!==document.body;){if(t.nodeName==="BLOCKQUOTE"){o=!0;break}t=t.parentNode}return o?document.execCommand("formatBlock",!1,"p"):document.execCommand("formatBlock",!1,"blockquote"),!0}},keymap:{"Mod-Shift-9":"toggleBlockquote"}}),Ue=()=>({name:"clearFormatting",toolbar:[{label:"Clear Formatting",command:"clearFormatting",icon:'<svg width="24" height="24" focusable="false"><path d="M13.2 6a1 1 0 0 1 0 .2l-2.6 10a1 1 0 0 1-1 .8h-.2a.8.8 0 0 1-.8-1l2.6-10H8a1 1 0 1 1 0-2h9a1 1 0 0 1 0 2h-3.8ZM5 18h7a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Zm13 1.5L16.5 18 15 19.5a.7.7 0 0 1-1-1l1.5-1.5-1.5-1.5a.7.7 0 0 1 1-1l1.5 1.5 1.5-1.5a.7.7 0 0 1 1 1L17.5 17l1.5 1.5a.7.7 0 0 1-1 1Z" fill-rule="evenodd"></path></svg>',shortcut:"Mod-\\"}],commands:{clearFormatting:()=>{const e=ye();if(!e)return!1;const t=window.getSelection();if(!t||t.rangeCount===0)return!1;const o=t.getRangeAt(0);if(!e.contains(o.commonAncestorContainer))return!1;const r=o.cloneRange();return e.focus({preventScroll:!0}),document.execCommand("unlink",!1),document.execCommand("removeFormat",!1),ve(e,r),xe(e,r),e.dispatchEvent(new Event("input",{bubbles:!0})),!0}},keymap:{"Mod-\\":"clearFormatting"}}),he=new Set(["A","B","STRONG","I","EM","U","S","STRIKE","DEL","FONT","MARK","CODE","SUB","SUP"]),ge=new Set(["H1","H2","H3","H4","H5","H6","BLOCKQUOTE","PRE"]),pe=["color","background-color","font-size","font-family","font-weight","font-style","text-decoration","text-transform","line-height","letter-spacing","word-spacing","vertical-align","text-align","padding-left"];function ye(){const e=window.getSelection();if(e&&e.rangeCount>0){const o=e.getRangeAt(0).startContainer,r=o.nodeType===Node.ELEMENT_NODE?o:o.parentElement,n=r==null?void 0:r.closest('[contenteditable="true"], .rte-content, .editora-content');if(n)return n}const t=document.activeElement;return t?t.getAttribute("contenteditable")==="true"?t:t.closest('[contenteditable="true"], .rte-content, .editora-content'):null}function W(e,t){try{if(typeof e.intersectsNode=="function")return e.intersectsNode(t)}catch{}const o=document.createRange();return t.nodeType===Node.ELEMENT_NODE?o.selectNodeContents(t):o.selectNode(t),e.compareBoundaryPoints(Range.END_TO_START,o)>0&&e.compareBoundaryPoints(Range.START_TO_END,o)<0}function P(e){let t=0,o=e;for(;o&&o.parentNode;)t+=1,o=o.parentNode;return t}function be(e){pe.forEach(t=>{e.style.removeProperty(t)}),(!e.getAttribute("style")||e.style.length===0)&&e.removeAttribute("style"),e.classList.contains("rte-text-color")&&e.classList.remove("rte-text-color"),e.classList.contains("rte-bg-color")&&e.classList.remove("rte-bg-color"),e.classList.length===0&&e.removeAttribute("class")}function V(e){const t=e.parentNode;if(t){for(;e.firstChild;)t.insertBefore(e.firstChild,e);t.removeChild(e)}}function ve(e,t){Array.from(e.querySelectorAll("h1,h2,h3,h4,h5,h6,blockquote,pre")).forEach(r=>{var i;if(!W(t,r)||!ge.has(r.tagName))return;const n=document.createElement("p");for(;r.firstChild;)n.appendChild(r.firstChild);(i=r.parentNode)==null||i.replaceChild(n,r)})}function xe(e,t){const o=Array.from(e.querySelectorAll("a,b,strong,i,em,u,s,strike,del,font,mark,code,sub,sup,span,[style],[class]"));o.sort((r,n)=>P(n)-P(r)),o.forEach(r=>{if(r.isConnected&&W(t,r)&&!(r.getAttribute("contenteditable")==="false"||r.closest('[contenteditable="false"]'))){if(be(r),he.has(r.tagName)){V(r);return}r.tagName==="SPAN"&&r.attributes.length===0&&V(r)}})}const R='[data-theme="dark"], .dark, .editora-theme-dark',Se=`/* Source Editor Dialog Styles */
.rte-source-editor-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background-color: rgba(0, 0, 0, 0.6) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 10000 !important;
  padding: 20px !important;
  box-sizing: border-box !important;
  margin: 0 !important;
}

.rte-source-editor-overlay.fullscreen {
  padding: 0 !important;
}

.rte-source-editor-modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.rte-source-editor-overlay.fullscreen .rte-source-editor-modal {
  border-radius: 0;
  max-width: 100%;
  max-height: 100vh;
  width: 100%;
  height: 100vh;
}

.rte-source-editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e1e5e9;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.rte-source-editor-overlay.fullscreen .rte-source-editor-header {
  border-radius: 0;
}

.rte-source-editor-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.rte-source-editor-header-toolbar {
  display: flex;
  gap: 8px;
  margin-left: auto;
  margin-right: 16px;
}

.rte-source-editor-toolbar-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  font-size: 16px;
  line-height: 1;
  transition: all 0.2s ease;
  color: #666;
}

.rte-source-editor-toolbar-btn:hover:not(:disabled) {
  background: #e1e5e9;
  color: #1a1a1a;
}

.rte-source-editor-toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.rte-source-editor-toolbar-btn.active {
  background: #007acc;
  color: white;
}

.rte-source-editor-toolbar-btn.active:hover {
  background: #0056b3;
}

.rte-source-editor-header-actions {
  display: flex;
  gap: 8px;
}

.rte-source-editor-fullscreen-btn,
.rte-source-editor-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #666;
  font-size: 16px;
  line-height: 1;
  transition: all 0.2s ease;
}

.rte-source-editor-fullscreen-btn:hover,
.rte-source-editor-close-btn:hover {
  background: #e1e5e9;
  color: #1a1a1a;
}

.rte-source-editor-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.rte-source-editor-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
  position: absolute;
  z-index: 9;
  margin: 0 auto;
  width: 100%;
  top: 44%;
}

.rte-source-editor-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e1e5e9;
  border-top: 3px solid #007acc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.rte-source-editor-error {
  background: #fee;
  color: #c53030;
  padding: 12px 16px;
  border-left: 4px solid #c53030;
  margin: 16px;
  border-radius: 4px;
  font-size: 14px;
}

.rte-source-editor-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.rte-source-editor-warning {
  background: #fefcbf;
  color: #744210;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  border-bottom: 1px solid #f6e05e;
}

.rte-source-editor-codemirror {
  flex: 1;
  overflow: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.rte-source-editor-codemirror .cm-editor {
  height: 100%;
}

.rte-source-editor-codemirror .cm-focused {
  outline: none;
}

.rte-source-editor-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid #e1e5e9;
  background: #f8f9fa;
  border-radius: 0 0 8px 8px;
}

.rte-source-editor-overlay.fullscreen .rte-source-editor-footer {
  border-radius: 0;
}

.rte-source-editor-footer-info {
  font-size: 12px;
  color: #666;
}

.unsaved-changes {
  color: #d69e2e;
  font-weight: 500;
}

.rte-source-editor-footer-actions {
  display: flex;
  gap: 12px;
}

.rte-source-editor-btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.rte-source-editor-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.rte-source-editor-btn-cancel {
  background: white;
  border-color: #d1d5db;
  color: #374151;
}

.rte-source-editor-btn-cancel:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.rte-source-editor-btn-save {
  background: #007acc;
  color: white;
}

.rte-source-editor-btn-save:hover:not(:disabled) {
  background: #0056b3;
}

.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-modal {
  background: #1e1e1e;
  color: #f8f9fa;
  border: 1px solid #434d5f;
}

.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-header,
.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-footer {
  background: #2a3442;
  border-color: #434d5f;
}

.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-header h2 {
  color: #f8f9fa;
}

.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-toolbar-btn,
.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-fullscreen-btn,
.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-close-btn {
  color: #c1cede;
}

.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-toolbar-btn:hover:not(:disabled),
.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-fullscreen-btn:hover,
.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-close-btn:hover {
  background: #404a5a;
  color: #f8fafc;
}

.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-toolbar-btn.active {
  background: #3b82f6;
  color: #ffffff;
}

.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-toolbar-btn.active:hover {
  background: #2563eb;
}

.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-loading,
.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-footer-info {
  color: #cbd5e1;
}

.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-spinner {
  border-color: #3f4b60;
  border-top-color: #58a6ff;
}

.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-error {
  background: #3f2124;
  color: #fecaca;
  border-color: #ef4444;
}

.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-warning {
  background: #3b3220;
  color: #fde68a;
  border-color: #f59e0b;
}

.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-btn-cancel {
  background: #334155;
  border-color: #475569;
  color: #f1f5f9;
}

.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-btn-cancel:hover:not(:disabled) {
  background: #475569;
  border-color: #64748b;
}

.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-btn-save {
  background: #3b82f6;
}

.rte-source-editor-overlay.rte-theme-dark .rte-source-editor-btn-save:hover:not(:disabled) {
  background: #2563eb;
}

/* Responsive design */
@media (max-width: 768px) {
  .rte-source-editor-overlay {
    padding: 10px;
  }

  .rte-source-editor-modal {
    max-height: 95vh;
  }

  .rte-source-editor-header {
    padding: 12px 16px;
  }

  .rte-source-editor-footer {
    padding: 12px 16px;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .rte-source-editor-footer-actions {
    justify-content: stretch;
  }

  .rte-source-editor-btn {
    flex: 1;
    text-align: center;
  }
}`,We=()=>({name:"code",toolbar:[{label:"Source",command:"toggleSourceView",icon:'<svg width="24" height="24" focusable="false"><g fill-rule="nonzero"><path d="M9.8 15.7c.3.3.3.8 0 1-.3.4-.9.4-1.2 0l-4.4-4.1a.8.8 0 0 1 0-1.2l4.4-4.2c.3-.3.9-.3 1.2 0 .3.3.3.8 0 1.1L6 12l3.8 3.7ZM14.2 15.7c-.3.3-.3.8 0 1 .4.4.9.4 1.2 0l4.4-4.1c.3-.3.3-.9 0-1.2l-4.4-4.2a.8.8 0 0 0-1.2 0c-.3.3-.3.8 0 1.1L18 12l-3.8 3.7Z"></path></g></svg>',shortcut:"Mod-Shift-S"}],commands:{toggleSourceView:()=>{const t=(()=>{var a,c,u;const i=window.getSelection();if(i&&i.anchorNode){let s=i.anchorNode instanceof HTMLElement?i.anchorNode:i.anchorNode.parentElement;for(;s;){if((a=s.classList)!=null&&a.contains("rte-content"))return s;s=s.parentElement}}if(document.activeElement){let s=document.activeElement;if((c=s.classList)!=null&&c.contains("rte-content"))return s;for(;s&&s!==document.body;){if((u=s.classList)!=null&&u.contains("rte-content"))return s;const m=s.querySelector(".rte-content");if(m)return m;s=s.parentElement}}const l=document.querySelector("[data-editora-editor]");if(l){const s=l.querySelector(".rte-content");if(s)return s}return document.querySelector(".rte-content")})();if(!t)return console.error("[CodePlugin] Editor content area not found"),alert("Editor content area not found. Please click inside the editor first."),!1;const o=t.innerHTML,r=i=>{let l="",a=0;const c=2,u=i.split(/(<\/?[a-zA-Z][^>]*>)/);for(const s of u)s.trim()&&(s.match(/^<\/[a-zA-Z]/)?(a=Math.max(0,a-1),l+=`
`+" ".repeat(a*c)+s):s.match(/^<[a-zA-Z]/)&&!s.match(/\/>$/)?(l+=`
`+" ".repeat(a*c)+s,a++):s.match(/^<[a-zA-Z].*\/>$/)?l+=`
`+" ".repeat(a*c)+s:l+=s.trim());return l.trim()};return(()=>{const l=r(o);let a=null,c="dark",u=!1,s=!1,m=!1,b=!1;const x=!!t.closest(R)||document.body.matches(R)||document.documentElement.matches(R),f=document.createElement("div");f.className="rte-source-editor-overlay",x&&f.classList.add("rte-theme-dark");const g=document.createElement("div");g.className="rte-source-editor-modal",g.setAttribute("role","dialog"),g.setAttribute("aria-modal","true"),g.setAttribute("aria-labelledby","source-editor-title");const y=document.createElement("div");y.className="rte-source-editor-header",y.innerHTML=`
          <h2 id="source-editor-title">Source Editor</h2>
          <div class="rte-source-editor-header-toolbar">
            <button class="rte-source-editor-toolbar-btn theme-toggle-btn" title="Switch theme">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            </button>
            <button class="rte-source-editor-toolbar-btn readonly-toggle-btn" title="Toggle read-only">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
          <div class="rte-source-editor-header-actions">
            <button class="rte-source-editor-fullscreen-btn" title="Toggle fullscreen">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
            </button>
            <button class="rte-source-editor-close-btn" aria-label="Close source editor">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        `;const T=document.createElement("div");T.className="rte-source-editor-body";const C=document.createElement("div");C.className="rte-source-editor-content";const z=document.createElement("div");z.className="rte-source-editor-warning",z.textContent="⚠️ Advanced users only. Invalid HTML may break the editor.";const S=document.createElement("div");S.className="rte-source-editor-light-editor",S.style.height="400px",C.appendChild(z),C.appendChild(S),T.appendChild(C);const v=document.createElement("div");if(v.className="rte-source-editor-footer",v.innerHTML=`
          <div class="rte-source-editor-footer-info">
            <span class="unsaved-changes" style="display: none;">• Unsaved changes</span>
          </div>
          <div class="rte-source-editor-footer-actions">
            <button class="rte-source-editor-btn rte-source-editor-btn-cancel">Cancel</button>
            <button class="rte-source-editor-btn rte-source-editor-btn-save">Save</button>
          </div>
        `,g.appendChild(y),g.appendChild(T),g.appendChild(v),f.appendChild(g),!document.getElementById("rte-source-editor-styles")){const d=document.createElement("style");d.id="rte-source-editor-styles",d.textContent=Se,document.head.appendChild(d)}const k=y.querySelector(".theme-toggle-btn"),w=y.querySelector(".readonly-toggle-btn"),A=y.querySelector(".rte-source-editor-fullscreen-btn"),H=y.querySelector(".rte-source-editor-close-btn"),B=v.querySelector(".rte-source-editor-btn-cancel"),D=v.querySelector(".rte-source-editor-btn-save"),_=v.querySelector(".unsaved-changes"),M=[],p=(d,h,F,N)=>{d.addEventListener(h,F,N),M.push(()=>d.removeEventListener(h,F,N))},q=d=>{m!==d&&(m=d,_&&(_.style.display=m?"inline":"none"))},E=()=>{if(!b){for(b=!0;M.length;){const d=M.pop();d==null||d()}a&&(a.destroy(),a=null),f.isConnected&&f.remove()}},J=()=>{c=c==="dark"?"light":"dark",a==null||a.setTheme(c),k&&(k.innerHTML=c==="light"?`
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            `:`
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            `)},ee=()=>{u=!u,a==null||a.setReadOnly(u),w&&(w.classList.toggle("active",u),w.innerHTML=u?`
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              `:`
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              `)},te=()=>{s=!s,f.classList.toggle("fullscreen",s),S.style.height=s?"calc(100vh - 200px)":"400px",A&&(A.innerHTML=s?`
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 0 2-2h3M3 16h3a2 2 0 0 0 2 2v3"/>
              </svg>
            `:`
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
            `)},oe=()=>{m&&!confirm("You have unsaved changes. Are you sure you want to cancel?")||E()},re=()=>{try{const d=(a==null?void 0:a.getValue())||"",h=document.createElement("div");h.innerHTML=d,h.querySelectorAll('script, iframe[src^="javascript:"], object, embed').forEach(N=>N.remove()),t.innerHTML=h.innerHTML;try{t.dispatchEvent(new InputEvent("input",{bubbles:!0,cancelable:!1,inputType:"insertReplacementText"}))}catch{t.dispatchEvent(new Event("input",{bubbles:!0}))}t.dispatchEvent(new Event("change",{bubbles:!0})),q(!1),E()}catch(d){alert("Failed to update HTML. Please check your syntax."),console.error("HTML update error:",d)}};k&&p(k,"click",J),w&&p(w,"click",ee),A&&p(A,"click",te),H&&p(H,"click",E),B&&p(B,"click",oe),D&&p(D,"click",re),p(f,"click",d=>{d.target===f&&E()}),p(document,"keydown",d=>{const h=d;h.key==="Escape"&&(h.preventDefault(),E())}),document.body.appendChild(f),requestAnimationFrame(()=>{if(!(b||!f.isConnected))try{a=ne(S,{value:l,theme:"dark",readOnly:!1,extensions:[new ie,new ae,new de,new se,new ue,new ce,new le]}),a.on("change",()=>{const d=(a==null?void 0:a.getValue())||"";q(d!==l)}),requestAnimationFrame(()=>a==null?void 0:a.focus())}catch(d){console.error("Failed to initialize code editor:",d)}})})(),!0}},keymap:{"Mod-Shift-s":"toggleSourceView","Mod-Shift-S":"toggleSourceView"}}),Xe=()=>({name:"fontSize",marks:{fontSize:{attrs:{size:{default:null}},parseDOM:[{tag:'span[style*="font-size"]',getAttrs:e=>{const o=e.style.fontSize;return o?{size:o}:!1}},{tag:"font[size]",getAttrs:e=>{const o=e.getAttribute("size");return o?{size:o}:!1}}],toDOM:e=>{var t;return["span",{style:`font-size: ${(t=e.attrs)==null?void 0:t.size}`},0]}}},toolbar:[{label:"Font Size",command:"fontSize",type:"group",items:[{label:"Decrease Font Size",command:"decreaseFontSize",icon:"−",type:"button"},{label:"Font Size",command:"setFontSize",type:"input",placeholder:"14"},{label:"Increase Font Size",command:"increaseFontSize",icon:"+",type:"button"}]}],commands:{decreaseFontSize:()=>{try{return Z(-2),K(),!0}catch(e){return console.error("Failed to decrease font size:",e),!1}},increaseFontSize:()=>{try{return Z(2),K(),!0}catch(e){return console.error("Failed to increase font size:",e),!1}},setFontSize:e=>{var t;if(!e)return!1;try{const r=e.trim().match(/^(\d+(?:\.\d+)?)(px|em|rem)?$/i);if(!r)return!1;const n=parseFloat(r[1]),i=((t=r[2])==null?void 0:t.toLowerCase())||"px";return i==="px"&&(n<8||n>72)||(i==="em"||i==="rem")&&(n<.5||n>5)?!1:(Y(n,i),!0)}catch(o){return console.error("Failed to set font size:",o),!1}}},keymap:{}}),we="p,div,li,ul,ol,table,thead,tbody,tfoot,tr,td,th,h1,h2,h3,h4,h5,h6,blockquote,pre",X={"xx-small":9,"x-small":10,small:13,medium:16,large:18,"x-large":24,"xx-large":32,"xxx-large":48,smaller:13,larger:18};function $(e){const t=e.trim().toLowerCase(),o=t.match(/^(\d+(?:\.\d+)?)(px|em|rem)$/i);if(o)return{value:parseFloat(o[1]),unit:o[2].toLowerCase()};const r=X[t];return r?{value:r,unit:"px"}:null}function Ee(e){return e.trim().toLowerCase()in X}function Ce(e){return!!e.cloneContents().querySelector(we)}function ke(e){const t=e.nodeType===Node.ELEMENT_NODE?e:e.parentElement;return(t==null?void 0:t.closest('[contenteditable="true"]'))||document.querySelector('[contenteditable="true"]')}function L(e){e&&e.dispatchEvent(new Event("input",{bubbles:!0}))}function Ae(e,t){var n;const o=document.createElement("span");for(const i of Array.from(e.attributes))i.name==="size"||i.name==="style"||o.setAttribute(i.name,i.value);const r=e.getAttribute("style");for(r&&o.setAttribute("style",r),o.style.fontSize=t;e.firstChild;)o.appendChild(e.firstChild);(n=e.parentNode)==null||n.replaceChild(o,e)}function Ne(e,t,o,r){const n=Array.from(e.querySelectorAll("font[size], [style*='font-size']")),i=a=>{if(!r||!a.isConnected)return!1;try{if(typeof r.intersectsNode=="function")return r.intersectsNode(a)}catch{}const c=document.createRange();return c.selectNodeContents(a),r.compareBoundaryPoints(Range.END_TO_START,c)>0&&r.compareBoundaryPoints(Range.START_TO_END,c)<0};let l=!1;return n.forEach(a=>{const c=!t.has(a),u=a.tagName==="FONT",s=Ee(a.style.fontSize||""),m=i(a);if(!(!c&&!m)&&!(!c&&!u&&!s)){if(l=!0,a.tagName==="FONT"){Ae(a,o);return}a.style.fontSize=o}}),l}function I(e){e.querySelectorAll("span").forEach(o=>{o.childElementCount>0||(o.textContent||"").trim().length>0||o.remove()})}function Te(e,t,o){if(Ce(e))return!1;const r=document.createElement("span");r.style.fontSize=o;try{e.surroundContents(r)}catch{const i=e.extractContents();r.appendChild(i),e.insertNode(r)}const n=document.createRange();return n.selectNodeContents(r),t.removeAllRanges(),t.addRange(n),!0}function Z(e){const t=window.getSelection();if(!t||t.rangeCount===0)return;const{value:o,unit:r}=Q();let n=e;(r==="em"||r==="rem")&&(n=e*.125);let i;r==="px"?i=e<0?Math.max(8,o+e):Math.min(72,o+e):i=e<0?Math.max(.5,o+n):Math.min(5,o+n),Y(i,r)}function Q(){var n;const e=window.getSelection();if(!e||e.rangeCount===0)return{value:14,unit:"px"};const o=e.getRangeAt(0).startContainer,r=o.nodeType===Node.TEXT_NODE?o.parentElement:o;if(r){const i=(n=r.style)==null?void 0:n.fontSize;if(i){const u=$(i);if(u)return u}const a=window.getComputedStyle(r).fontSize,c=$(a);if(c)return c}return{value:14,unit:"px"}}function Y(e,t="px"){const o=window.getSelection();if(!o||o.rangeCount===0)return;const r=o.getRangeAt(0),n=r.cloneRange(),i=ke(r.commonAncestorContainer);if(r.collapsed)return;const l=`${e}${t}`,a=r.commonAncestorContainer,c=ze(a);if(c&&Me(r,c)){c.style.fontSize=l,L(i);const x=document.createRange();x.selectNodeContents(c),o.removeAllRanges(),o.addRange(x);return}if(!i)return;const u=new Set(Array.from(i.querySelectorAll("font[size], [style*='font-size']")));i.focus({preventScroll:!0});try{document.execCommand("styleWithCSS",!1,"true")}catch{}let s=document.execCommand("fontSize",!1,"7");const m=o.rangeCount>0?o.getRangeAt(0).cloneRange():n,b=Ne(i,u,l,m);if(s&&b){I(i),L(i);return}s=Te(n,o,l),s&&(I(i),L(i))}function ze(e){let t=e;for(;t&&t!==document.body;){if(t.nodeType===Node.ELEMENT_NODE){const o=t;if(o.tagName==="SPAN"&&o.style.fontSize)return o}t=t.parentNode}return null}function Me(e,t){const o=e.startContainer,r=e.endContainer;return t.contains(o)&&t.contains(r)}function K(){setTimeout(()=>{const{value:e,unit:t}=Q(),o=window.getSelection();if(!o||o.rangeCount===0)return;let r=null,i=o.getRangeAt(0).startContainer;for(;i;){if(i instanceof HTMLElement&&(i.classList.contains("rte-editor")||i.classList.contains("editora-editor")||i.hasAttribute("data-editora-editor"))){r=i;break}i=i.parentNode}if(!r)return;const l=r.querySelector(".rte-toolbar-wrapper, .editora-toolbar-container")||r,a=Array.from(l.querySelectorAll('input[data-command="setFontSize"], input.editora-toolbar-input.font-size, input.rte-toolbar-input.font-size, input[title="Font Size"]'));if(a.length===0)return;const u=`${e%1===0?e.toString():e.toFixed(2).replace(/\.?0+$/,"")}${t}`;a.forEach(s=>{s.value=u})},10)}const Qe=()=>({name:"fontFamily",marks:{fontFamily:{attrs:{family:{default:null}},parseDOM:[{tag:'span[style*="font-family"]',getAttrs:e=>{const o=e.style.fontFamily;return o?{family:o}:!1}},{tag:"font[face]",getAttrs:e=>{const o=e.getAttribute("face");return o?{family:o}:!1}}],toDOM:e=>{var t;return["span",{style:`font-family: ${(t=e.attrs)==null?void 0:t.family}`},0]}}},toolbar:[{label:"Font Family",command:"setFontFamily",type:"inline-menu",options:[{label:"Arial",value:"Arial, sans-serif"},{label:"Times New Roman",value:"Times New Roman, serif"},{label:"Courier New",value:"Courier New, monospace"},{label:"Georgia",value:"Georgia, serif"},{label:"Verdana",value:"Verdana, sans-serif"},{label:"Helvetica",value:"Helvetica, Arial, sans-serif"},{label:"Trebuchet MS",value:"Trebuchet MS, sans-serif"},{label:"Impact",value:"Impact, sans-serif"}],icon:'<svg fill="#000000" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M15 4h7v2h-7zm1 4h6v2h-6zm2 4h4v2h-4zM9.307 4l-6 16h2.137l1.875-5h6.363l1.875 5h2.137l-6-16H9.307zm-1.239 9L10.5 6.515 12.932 13H8.068z"></path></g></svg>'}],commands:{setFontFamily:e=>{if(!e)return!1;try{return De(e),!0}catch(t){return console.error("Failed to set font family:",t),!1}}},keymap:{"Mod-Shift-f":"setFontFamily"}}),Fe="p,div,li,ul,ol,table,thead,tbody,tfoot,tr,td,th,h1,h2,h3,h4,h5,h6,blockquote,pre";function Re(e){return!!e.cloneContents().querySelector(Fe)}function Le(e){const t=e.nodeType===Node.ELEMENT_NODE?e:e.parentElement;return(t==null?void 0:t.closest('[contenteditable="true"]'))||document.querySelector('[contenteditable="true"]')}function j(e){e&&e.dispatchEvent(new Event("input",{bubbles:!0}))}function Oe(e,t){var n;const o=document.createElement("span");for(const i of Array.from(e.attributes))i.name==="face"||i.name==="style"||o.setAttribute(i.name,i.value);const r=e.getAttribute("style");for(r&&o.setAttribute("style",r),o.style.fontFamily=t,o.classList.add("rte-font-family");e.firstChild;)o.appendChild(e.firstChild);(n=e.parentNode)==null||n.replaceChild(o,e)}function He(e){e.querySelectorAll("span").forEach(o=>{o.childElementCount>0||(o.textContent||"").trim().length>0||o.remove()})}function Be(e,t,o){if(Re(e))return!1;const r=document.createElement("span");r.style.fontFamily=o,r.className="rte-font-family";try{e.surroundContents(r)}catch{const i=e.extractContents();r.appendChild(i),e.insertNode(r)}const n=document.createRange();return n.selectNodeContents(r),t.removeAllRanges(),t.addRange(n),!0}function De(e){const t=window.getSelection();if(!t||t.rangeCount===0)return;const o=t.getRangeAt(0),r=o.cloneRange(),n=Le(o.commonAncestorContainer);if(o.collapsed)return;const i=o.commonAncestorContainer,l=_e(i);if(l&&qe(o,l)){l.style.fontFamily=e,l.classList.add("rte-font-family");const f=document.createRange();f.selectNodeContents(l),t.removeAllRanges(),t.addRange(f),j(n);return}if(!n)return;const a=new Set(Array.from(n.querySelectorAll("font[face]"))),c=new Set(Array.from(n.querySelectorAll("span[style*='font-family']")));n.focus({preventScroll:!0});try{document.execCommand("styleWithCSS",!1,"true")}catch{}const u=e.split(",").map(f=>f.trim().replace(/^['"]|['"]$/g,"")).filter(Boolean)[0]||"Arial";let s=document.execCommand("fontName",!1,u),m=!1;Array.from(n.querySelectorAll("font[face]")).forEach(f=>{a.has(f)||(Oe(f,e),m=!0)}),Array.from(n.querySelectorAll("span[style*='font-family']")).forEach(f=>{c.has(f)||(f.style.fontFamily=e,f.classList.add("rte-font-family"),m=!0)}),s||(s=Be(r,t,e)),(s||m)&&(He(n),j(n))}function _e(e){let t=e;for(;t;){if(t.nodeType===Node.ELEMENT_NODE){const o=t;if(o.tagName==="SPAN"&&o.style.fontFamily)return o}t=t.parentNode}return null}function qe(e,t){const o=e.startContainer,r=e.endContainer,n=t.contains(o)||o.nodeType===Node.TEXT_NODE&&o.parentElement===t,i=t.contains(r)||r.nodeType===Node.TEXT_NODE&&r.parentElement===t;return n&&i}const O=["P","DIV","H1","H2","H3","H4","H5","H6","LI","BLOCKQUOTE","PRE","TD","TH"];function G(e){let t=e;if(t.nodeType===Node.ELEMENT_NODE){const o=t;if(O.includes(o.tagName))return o}for(;t;){if(t.nodeType===Node.ELEMENT_NODE){const o=t;if(O.includes(o.tagName))return o;if(o.hasAttribute("contenteditable"))return null}t=t.parentNode}return null}function Pe(e){const t=[],o=G(e.startContainer),r=G(e.endContainer);if(!o&&!r)return t;if(e.collapsed)return o&&t.push(o),t;if(o===r)o&&t.push(o);else{let n=o;const i=new Set;for(o&&(t.push(o),i.add(o));n&&n!==r&&!i.has(r);){let l=n.nextElementSibling;for(;l;){if(O.includes(l.tagName)){n=l,i.has(n)||(t.push(n),i.add(n));break}l=l.nextElementSibling}if(!l)break}r&&!t.includes(r)&&t.push(r)}return t}function Ve(e){const t=e.commonAncestorContainer.nodeType===Node.ELEMENT_NODE?e.commonAncestorContainer:e.commonAncestorContainer.parentElement;return t?t.closest(".rte-content, .editora-content")||t.closest('[contenteditable="true"]'):null}function U(e,t){if(!e||t===e.innerHTML)return;const o=window.execEditorCommand||window.executeEditorCommand;if(typeof o=="function")try{o("recordDomTransaction",e,t,e.innerHTML)}catch{}}const $e=e=>{var a;if(!e||!["left","center","right","justify"].includes(e))return!1;const o=window.getSelection();if(!o||o.rangeCount===0)return!1;const r=o.getRangeAt(0).cloneRange(),n=Ve(r),i=(n==null?void 0:n.innerHTML)||"",l=Pe(r);if(l.length>0)l.forEach(c=>{c&&(c.style.textAlign=e)}),o.removeAllRanges(),o.addRange(r),U(n,i),n&&n.dispatchEvent(new Event("input",{bubbles:!0}));else try{const c=document.createElement("div");c.style.textAlign=e;const u=r.extractContents();c.appendChild(u),r.insertNode(c);const s=document.createRange();s.selectNodeContents(c),o.removeAllRanges(),o.addRange(s);const m=c.closest(".rte-content, .editora-content")||c.closest('[contenteditable="true"]');U(m||n,i),(m||n)&&((a=m||n)==null||a.dispatchEvent(new Event("input",{bubbles:!0})))}catch(c){return console.error("Failed to wrap content for alignment:",c),!1}return!0},Ye=()=>({name:"textAlignment",toolbar:[{label:"Text Alignment",command:"setTextAlignment",type:"inline-menu",options:[{label:"Left",value:"left"},{label:"Center",value:"center"},{label:"Right",value:"right"},{label:"Justify",value:"justify"}],icon:'<svg width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fill-rule="evenodd"></path></svg>'}],commands:{setTextAlignment:$e},keymap:{}});export{Ge as B,We as C,Xe as F,je as S,Ye as T,Ue as a,Qe as b};
