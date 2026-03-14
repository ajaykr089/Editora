import{H as Rf}from"./HeadingPlugin.native-b74ae03d.js";import{b as Nf,c as Df,f as fd,g as md,p as Hf,B as If,I as Bf,U as Pf,L as Of,d as zf,e as _f,h as qf,a as jf,T as Ff,i as Vf,M as Kf,A as Wf,F as Uf,H as Gf}from"./A11yCheckerPlugin.native-b89c1fcd.js";import{S as Zf,a as Yf,B as Xf,C as Jf,T as Qf,F as em,b as tm}from"./TextAlignmentPlugin.native-8d0de10f.js";import{T as rm,A as nm}from"./ApprovalWorkflowPlugin.native-eaed16b3.js";import{C as om}from"./ContentRulesPlugin.native-706a3efc.js";import{P as am}from"./PIIRedactionPlugin.native-6cafc2ca.js";import{_ as zi}from"./iframe-c526a5dc.js";const $s="__editoraCommandEditorRoot",im=e=>{if(!e)return null;const t=e.querySelector('[contenteditable="true"]');return t instanceof HTMLElement?t:null},lm=()=>{if(typeof window>"u")return null;const e=window[$s];if(!(e instanceof HTMLElement))return null;window[$s]=null;const t=e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(e.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?e:null);if(t){const n=im(t);if(n)return n;if(t.getAttribute("contenteditable")==="true")return t}if(e.getAttribute("contenteditable")==="true")return e;const r=e.closest('[contenteditable="true"]');return r instanceof HTMLElement?r:null},sm=()=>{const e=lm();if(e&&document.contains(e))return e;const t=window.getSelection();if(t&&t.rangeCount>0){let n=t.getRangeAt(0).startContainer;for(;n&&n!==document.body;){if(n.nodeType===Node.ELEMENT_NODE){const o=n;if(o.getAttribute("contenteditable")==="true")return o}n=n.parentNode}}const r=document.activeElement;if(r){if(r.getAttribute("contenteditable")==="true")return r;const n=r.closest('[contenteditable="true"]');if(n)return n}return document.querySelector('[contenteditable="true"]')},cm=e=>e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null,dm=e=>{const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);return e.contains(r.commonAncestorContainer)?r:null},Ls=e=>{e.dispatchEvent(new Event("input",{bubbles:!0}))},As=(e,t)=>{if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}},Pn=(e,t)=>{if(!e.isConnected){t.focus({preventScroll:!0});return}const r=window.getSelection();if(!r)return;const n=document.createRange();n.selectNodeContents(e),n.collapse(!1),r.removeAllRanges();try{r.addRange(n)}catch{t.focus({preventScroll:!0});return}t.focus({preventScroll:!0})},um=e=>{let t=e.querySelector(":scope > p");if(!t){t=document.createElement("p");const r=[];e.childNodes.forEach(n=>{n.nodeType===Node.ELEMENT_NODE&&["UL","OL"].includes(n.tagName)||r.push(n)}),r.forEach(n=>t.appendChild(n)),e.insertBefore(t,e.firstChild)}return t.innerHTML.trim()||(t.innerHTML="<br>"),t},Ko=e=>{const t=document.createElement("li");t.setAttribute("data-type","checklist-item"),t.setAttribute("data-checked","false");const r=document.createElement("p");return r.innerHTML=e.trim()||"<br>",t.appendChild(r),t},_i=e=>Array.from(e.children).filter(t=>t instanceof HTMLLIElement),fm=new Set(["P","DIV","H1","H2","H3","H4","H5","H6","BLOCKQUOTE","PRE","LI"]),qi=e=>fm.has(e.tagName)&&e.getAttribute("contenteditable")!=="true",mm=(e,t)=>{const r=[],n=new Set,o=c=>{!c||n.has(c)||t.contains(c)&&qi(c)&&(c.closest("ul, ol")||(n.add(c),r.push(c)))},a=c=>{let d=c;for(;d&&d!==document.body;){if(d.nodeType===Node.ELEMENT_NODE){const u=d;if(qi(u))return u;if(u.getAttribute("contenteditable")==="true")break}d=d.parentNode}return null};if(e.collapsed)return o(a(e.startContainer)),r;const i=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT,{acceptNode:c=>{const d=c;if(!qi(d)||d.closest("ul, ol"))return NodeFilter.FILTER_SKIP;if(typeof e.intersectsNode=="function")return e.intersectsNode(d)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;const u=document.createRange();return u.selectNodeContents(d),e.compareBoundaryPoints(Range.END_TO_START,u)>0&&e.compareBoundaryPoints(Range.START_TO_END,u)<0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});let l=i.nextNode();for(;l;)o(l),l=i.nextNode();if(r.length===0&&o(a(e.commonAncestorContainer)),r.length<=1)return r;const s=r.filter(c=>!r.some(d=>d!==c&&c.contains(d)));return s.length>0?s:r},pm=e=>{const t=[],r=document.createElement("div"),n=()=>{const o=r.innerHTML.trim();if(!o)return;const a=document.createElement("p");a.innerHTML=o,t.push(a),r.innerHTML=""};if(e.childNodes.forEach(o=>{if(o.nodeType===Node.ELEMENT_NODE&&["UL","OL"].includes(o.tagName)){n();return}if(o.nodeType===Node.ELEMENT_NODE&&o.tagName==="P"){n();const a=o.innerHTML.trim(),i=document.createElement("p");i.innerHTML=a||"<br>",t.push(i);return}o.nodeType===Node.TEXT_NODE&&!(o.textContent||"").trim()||r.appendChild(o.cloneNode(!0))}),n(),t.length===0){const o=document.createElement("p");o.innerHTML="<br>",t.push(o)}return t},gm=()=>({name:"checklist",init:()=>{if(typeof document>"u"||typeof window>"u"||window.__checklistPluginClickInitialized)return;window.__checklistPluginClickInitialized=!0;const e=t=>{const n=t.target.closest('li[data-type="checklist-item"]');if(!n)return;const o=n.getBoundingClientRect();if(!(t.clientX-o.left<32))return;t.preventDefault(),t.stopPropagation();const l=n.closest("[contenteditable], .rte-content, .editora-content");if((l==null?void 0:l.getAttribute("contenteditable"))==="false"||!!(l!=null&&l.closest('[data-readonly="true"], .editora-editor[readonly], editora-editor[readonly]')))return;const c=(l==null?void 0:l.innerHTML)||"",d=n.getAttribute("data-checked")==="true";n.setAttribute("data-checked",(!d).toString()),l&&(As(l,c),Ls(l))};document.addEventListener("click",e)},nodes:{checklist:{content:"checklistItem+",group:"block",parseDOM:[{tag:'ul[data-type="checklist"]'}],toDOM:()=>["ul",{"data-type":"checklist"},0]},checklistItem:{content:"paragraph",attrs:{checked:{default:!1}},parseDOM:[{tag:'li[data-type="checklist-item"]',getAttrs:e=>({checked:e.getAttribute("data-checked")==="true"})}],toDOM:e=>{var t;return["li",{"data-type":"checklist-item","data-checked":(t=e==null?void 0:e.attrs)!=null&&t.checked?"true":"false"},0]}}},toolbar:[{label:"Checklist",command:"toggleChecklist",icon:'<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 4.48h-.71L2 3.43l.71-.7.69.68L4.81 2l.71.71-1.77 1.77zM6.99 3h8v1h-8V3zm0 3h8v1h-8V6zm8 3h-8v1h8V9zm-8 3h8v1h-8v-1zM3.04 7.48h.71l1.77-1.77-.71-.7L3.4 6.42l-.69-.69-.71.71 1.04 1.04zm.71 3.01h-.71L2 9.45l.71-.71.69.69 1.41-1.42.71.71-1.77 1.77zm-.71 3.01h.71l1.77-1.77-.71-.71-1.41 1.42-.69-.69-.71.7 1.04 1.05z"></path></g></svg>',shortcut:"Mod-Shift-9"}],commands:{toggleChecklist:()=>{try{const e=sm();if(!e)return!1;const t=e.innerHTML,r=()=>(As(e,t),Ls(e),!0),n=dm(e);if(!n)return!1;const o=cm(n.startContainer);if(!o)return!1;const a=o.closest('ul[data-type="checklist"]');if(a&&e.contains(a)){const f=_i(a);if(f.length===0)return!1;const p=document.createDocumentFragment();let g=null;return f.forEach((m,h)=>{const b=pm(m);b.forEach(y=>{p.appendChild(y),!g&&(m.contains(n.startContainer)||h===0)&&(g=y)}),!g&&h===0&&b[0]&&(g=b[0])}),a.replaceWith(p),g&&Pn(g,e),r()}const i=o.closest("ul, ol");if(i&&e.contains(i)){let f;if(i.tagName.toLowerCase()==="ul")f=i;else{for(f=document.createElement("ul");i.firstChild;)f.appendChild(i.firstChild);i.replaceWith(f)}f.setAttribute("data-type","checklist");let p=_i(f);p.length===0&&(f.appendChild(Ko("")),p=_i(f));let g=null;p.forEach(h=>{h.setAttribute("data-type","checklist-item"),h.hasAttribute("data-checked")||h.setAttribute("data-checked","false");const b=um(h);h.contains(n.startContainer)&&(g=b)});const m=f.querySelector(':scope > li[data-type="checklist-item"] > p');return Pn(g||m||f,e),r()}const l=mm(n,e);if(l.length>1){const f=document.createElement("ul");f.setAttribute("data-type","checklist"),l.forEach(m=>{f.appendChild(Ko(m.innerHTML))}),l[0].replaceWith(f),l.slice(1).forEach(m=>{m.isConnected&&m.remove()});const g=f.querySelector(':scope > li[data-type="checklist-item"] > p');return g&&Pn(g,e),r()}const s=l[0]||o.closest("p, h1, h2, h3, h4, h5, h6, blockquote, pre");if(s&&s!==e){const f=document.createElement("ul");f.setAttribute("data-type","checklist");const p=Ko(s.innerHTML);f.appendChild(p),s.replaceWith(f);const g=p.querySelector(":scope > p");return g&&Pn(g,e),r()}const c=document.createElement("ul");c.setAttribute("data-type","checklist");const d=Ko("");c.appendChild(d),n.deleteContents(),n.insertNode(c);const u=d.querySelector(":scope > p");return u&&Pn(u,e),r()}catch(e){return console.error("Failed to toggle checklist:",e),!1}}},keymap:{"Mod-Shift-9":"toggleChecklist"}});let ie=null,Ol=null,ir=null,zl=null,Te="#ffff00";const On='[data-theme="dark"], .dark, .editora-theme-dark',bm=["#000000","#ffffff","#808080","#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ffa500","#800080","#ffc0cb"];function pd(){const e=window.getSelection();if(e&&e.rangeCount>0){const n=e.getRangeAt(0).startContainer,o=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement;if(o){const a=o.closest('[data-editora-editor="true"], .rte-editor, .editora-editor');if(a)return a}}const t=document.activeElement;return t?t.closest('[data-editora-editor="true"], .rte-editor, .editora-editor'):null}function hm(e){const t=window.__editoraLastCommand,r=window.__editoraLastCommandButton;if(t===e&&r&&r.isConnected){const i=window.getComputedStyle(r),l=r.getBoundingClientRect();if(i.display!=="none"&&i.visibility!=="hidden"&&i.pointerEvents!=="none"&&!(l.width===0&&l.height===0))return r}const n=i=>{for(const l of i){const s=window.getComputedStyle(l),c=l.getBoundingClientRect();if(!(s.display==="none"||s.visibility==="hidden"||s.pointerEvents==="none")&&!(c.width===0&&c.height===0))return l}return null},o=pd();if(o){const i=Array.from(o.querySelectorAll(`[data-command="${e}"]`)),l=n(i);if(l)return l}const a=Array.from(document.querySelectorAll(`[data-command="${e}"]`));return n(a)}function ym(e){if(e!=null&&e.closest(On))return!0;const t=window.getSelection();if(t&&t.rangeCount>0){const n=t.getRangeAt(0).startContainer,o=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement;if(o!=null&&o.closest(On))return!0}const r=document.activeElement;return r!=null&&r.closest(On)?!0:document.body.matches(On)||document.documentElement.matches(On)}function xm(){if(document.getElementById("rte-bg-color-picker-styles"))return;const e=document.createElement("style");e.id="rte-bg-color-picker-styles",e.textContent=`
    .rte-bg-color-picker {
      position: fixed;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 220px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      overflow: hidden;
    }

    .rte-bg-color-picker-header {
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .rte-bg-color-picker-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .rte-bg-color-picker-close {
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

    .rte-bg-color-picker-close:hover {
      color: #333;
    }

    .rte-bg-color-picker-body {
      padding: 8px;
    }

    .rte-bg-color-section {
      margin-bottom: 16px;
    }

    .rte-bg-color-section:last-child {
      margin-bottom: 0;
    }

    .rte-bg-color-section-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #555;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .rte-bg-color-preview {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      padding: 6px;
      background-color: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
    }

    .rte-bg-color-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
      max-width: 180px;
    }

    .rte-bg-color-swatch {
      width: 100%;
      aspect-ratio: 1;
      border: 1px solid #e0e0e0;
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.15s;
      padding: 0;
      background: none;
      min-height: 20px;
    }

    .rte-bg-color-swatch:hover {
      transform: scale(1.05);
      border-color: #ccc;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    }

    .rte-bg-color-swatch.selected {
      border-color: #1976d2;
      box-shadow: 0 0 0 1px rgba(25, 118, 210, 0.3);
    }

    .rte-bg-color-preview-swatch {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid #ddd;
      flex-shrink: 0;
    }

    .rte-bg-color-preview-hex {
      font-size: 13px;
      font-weight: 500;
      color: #666;
      font-family: monospace;
    }

    .rte-bg-color-input {
      width: 50px;
      height: 26px;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      padding: 2px;
    }

    .rte-bg-color-text-input {
      flex: 1;
      height: 26px;
      width: 50px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0 12px;
      font-size: 13px;
      font-family: monospace;
    }

    .rte-bg-color-text-input:focus {
      outline: none;
      border-color: #1976d2;
    }

    .rte-bg-color-custom {
      display: flex;
      gap: 8px;
    }

    .rte-bg-color-picker.rte-theme-dark {
      background: #1f2937;
      border: 1px solid #4b5563;
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.5);
    }

    .rte-bg-color-picker.rte-theme-dark .rte-bg-color-picker-header {
      border-bottom-color: #3b4657;
    }

    .rte-bg-color-picker.rte-theme-dark .rte-bg-color-picker-title {
      color: #e2e8f0;
    }

    .rte-bg-color-picker.rte-theme-dark .rte-bg-color-picker-close {
      color: #94a3b8;
    }

    .rte-bg-color-picker.rte-theme-dark .rte-bg-color-picker-close:hover {
      color: #f8fafc;
    }

    .rte-bg-color-picker.rte-theme-dark .rte-bg-color-section-label {
      color: #9fb0c6;
    }

    .rte-bg-color-picker.rte-theme-dark .rte-bg-color-preview {
      background-color: #111827;
      border-color: #4b5563;
    }

    .rte-bg-color-picker.rte-theme-dark .rte-bg-color-preview-hex {
      color: #cbd5e1;
    }

    .rte-bg-color-picker.rte-theme-dark .rte-bg-color-preview-swatch,
    .rte-bg-color-picker.rte-theme-dark .rte-bg-color-swatch {
      border-color: #4b5563;
    }

    .rte-bg-color-picker.rte-theme-dark .rte-bg-color-swatch:hover {
      border-color: #7a8ba5;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    }

    .rte-bg-color-picker.rte-theme-dark .rte-bg-color-swatch.selected {
      border-color: #58a6ff;
      box-shadow: 0 0 0 1px rgba(88, 166, 255, 0.4);
    }

    .rte-bg-color-picker.rte-theme-dark .rte-bg-color-input,
    .rte-bg-color-picker.rte-theme-dark .rte-bg-color-text-input {
      background: #111827;
      border-color: #4b5563;
      color: #e2e8f0;
    }

    .rte-bg-color-picker.rte-theme-dark .rte-bg-color-text-input::placeholder {
      color: #94a3b8;
    }

    .rte-bg-color-picker.rte-theme-dark .rte-bg-color-text-input:focus {
      border-color: #58a6ff;
    }
  `,document.head.appendChild(e)}function vm(){const e=document.createElement("div");e.className="rte-bg-color-picker",ym(Ol)&&e.classList.add("rte-theme-dark"),e.addEventListener("click",b=>b.stopPropagation());const t=document.createElement("div");t.className="rte-bg-color-picker-header";const r=document.createElement("span");r.className="rte-bg-color-picker-title",r.textContent="Background Color";const n=document.createElement("button");n.type="button",n.className="rte-bg-color-picker-close",n.id="rte-bg-color-close",n.setAttribute("aria-label","Close"),n.textContent="×",t.appendChild(r),t.appendChild(n);const o=document.createElement("div");o.className="rte-bg-color-picker-body";const a=document.createElement("div");a.className="rte-bg-color-section";const i=document.createElement("div");i.className="rte-bg-color-preview";const l=document.createElement("div");l.className="rte-bg-color-preview-swatch",l.id="rte-bg-color-preview-swatch";const s=document.createElement("span");s.className="rte-bg-color-preview-hex",s.id="rte-bg-color-preview-hex",i.appendChild(l),i.appendChild(s),a.appendChild(i);const c=document.createElement("div");c.className="rte-bg-color-section";const d=document.createElement("div");d.className="rte-bg-color-section-label",d.textContent="Colors";const u=document.createElement("div");u.className="rte-bg-color-grid",u.id="rte-bg-color-grid",bm.forEach(b=>{const y=document.createElement("button");y.type="button",y.className="rte-bg-color-swatch",y.style.backgroundColor=b,y.dataset.color=b,y.title=b,u.appendChild(y)}),c.appendChild(d),c.appendChild(u);const f=document.createElement("div");f.className="rte-bg-color-section";const p=document.createElement("div");p.className="rte-bg-color-section-label",p.textContent="Custom";const g=document.createElement("div");g.className="rte-bg-color-custom";const m=document.createElement("input");m.type="color",m.className="rte-bg-color-input",m.id="rte-bg-color-input",m.value=Te;const h=document.createElement("input");return h.type="text",h.className="rte-bg-color-text-input",h.id="rte-bg-color-text-input",h.placeholder="#FFFF00",h.value=Te.toUpperCase(),h.maxLength=7,g.appendChild(m),g.appendChild(h),f.appendChild(p),f.appendChild(g),o.appendChild(a),o.appendChild(c),o.appendChild(f),e.appendChild(t),e.appendChild(o),e}function km(){if(!ie)return;const e=ie.querySelector("#rte-bg-color-close");e==null||e.addEventListener("click",()=>Mr());const t=ie.querySelector("#rte-bg-color-grid");t&&t.addEventListener("click",o=>{const a=o.target;if(a.classList.contains("rte-bg-color-swatch")){const i=a.dataset.color;i&&(Te=i,ka(i),Mr())}});const r=ie.querySelector("#rte-bg-color-input");r&&(r.addEventListener("change",o=>{const a=o.target.value.toUpperCase();Te=a,ka(a),Mr()}),r.addEventListener("input",o=>{Te=o.target.value.toUpperCase(),nl(),ol()}));const n=ie.querySelector("#rte-bg-color-text-input");n&&(n.addEventListener("change",o=>{let a=o.target.value.trim();a&&!a.startsWith("#")&&(a="#"+a),/^#[0-9A-F]{6}$/i.test(a)&&(Te=a.toUpperCase(),ka(Te),Mr())}),n.addEventListener("input",o=>{let a=o.target.value.trim();a&&!a.startsWith("#")&&(a="#"+a,n.value=a),/^#[0-9A-F]{6}$/i.test(a)&&(Te=a.toUpperCase(),nl(),ol())}))}function nl(){if(!ie)return;const e=ie.querySelector("#rte-bg-color-preview-swatch"),t=ie.querySelector("#rte-bg-color-preview-hex"),r=ie.querySelector("#rte-bg-color-input"),n=ie.querySelector("#rte-bg-color-text-input");e&&(e.style.backgroundColor=Te),t&&(t.textContent=Te.toUpperCase()),r&&(r.value=Te),n&&(n.value=Te.toUpperCase())}function ol(){if(!ie)return;ie.querySelectorAll(".rte-bg-color-swatch").forEach(t=>{const r=t.dataset.color;(r==null?void 0:r.toUpperCase())===Te.toUpperCase()?t.classList.add("selected"):t.classList.remove("selected")})}function wm(){try{const e=window.getSelection();if(!e||e.rangeCount===0)return"#ffff00";const r=e.getRangeAt(0).commonAncestorContainer,n=r.nodeType===1?r:r.parentElement;if(n){const o=n.closest('[style*="background-color"]');if(o){const a=o.style.backgroundColor;if(a)return Em(a)}}return"#ffff00"}catch{return"#ffff00"}}function Em(e){if(e.startsWith("#"))return e.toUpperCase();const t=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(t){const r=parseInt(t[1]),n=parseInt(t[2]),o=parseInt(t[3]);return"#"+[r,n,o].map(a=>{const i=a.toString(16);return i.length===1?"0"+i:i}).join("").toUpperCase()}return"#ffff00"}function ka(e){const t=Nf({color:e,className:"rte-bg-color",styleProperty:"backgroundColor",commands:["hiliteColor","backColor"],savedRange:zl,getActiveEditorRoot:pd,warnMessage:"[BackgroundColor] Could not apply highlight for current selection"});return t&&console.log("[BackgroundColor] Applied color:",e),t}function Mr(){ir&&(ir.destroy(),ir=null),ie&&(ie.remove(),ie=null),Ol=null,zl=null}function Cm(){if(xm(),ie)return Mr(),!0;const e=hm("openBackgroundColorPicker");if(!e)return!1;const t=window.getSelection();return!t||t.isCollapsed?(alert("Please select text to apply background color"),!1):(t.rangeCount>0&&(zl=t.getRangeAt(0).cloneRange()),Te=wm(),ie=vm(),document.body.appendChild(ie),Ol=e,ir&&(ir.destroy(),ir=null),ir=Df({popover:ie,anchor:e,onClose:Mr,gap:8,margin:8,zIndex:1e4}),nl(),ol(),km(),!0)}const Sm=()=>({name:"backgroundColor",marks:{backgroundColor:{attrs:{color:{default:"#ffffff"}},parseDOM:[{tag:'span[style*="background-color"]',getAttrs:e=>{const n=(e.getAttribute("style")||"").match(/background-color:\s*([^;]+)/);return n?{color:n[1]}:null}},{tag:"mark",getAttrs:e=>({color:e.style.backgroundColor||"#ffff00"})}],toDOM:e=>{var t;return["span",{style:`background-color: ${((t=e.attrs)==null?void 0:t.color)||"#ffffff"}`,class:"rte-bg-color"},0]}}},toolbar:[{label:"Background Color",command:"openBackgroundColorPicker",icon:'<svg width="24" height="24" focusable="false"><g fill-rule="evenodd"><path class="tox-icon-highlight-bg-color__color" d="M3 18h18v3H3z" fill="#000000"></path><path fill-rule="nonzero" d="M7.7 16.7H3l3.3-3.3-.7-.8L10.2 8l4 4.1-4 4.2c-.2.2-.6.2-.8 0l-.6-.7-1.1 1.1zm5-7.5L11 7.4l3-2.9a2 2 0 0 1 2.6 0L18 6c.7.7.7 2 0 2.7l-2.9 2.9-1.8-1.8-.5-.6"></path></g></svg>',shortcut:"Mod-Shift-h"}],commands:{openBackgroundColorPicker:()=>Cm(),setBackgroundColor:e=>e?ka(e):!1},keymap:{"Mod-Shift-h":"openBackgroundColorPicker"}}),Tm=new Set(["P","DIV","H1","H2","H3","H4","H5","H6","LI","BLOCKQUOTE","PRE"]),al=e=>Tm.has(e.tagName)&&e.getAttribute("contenteditable")!=="true",$m=()=>{const e=window.getSelection();if(e&&e.rangeCount>0){let r=e.getRangeAt(0).startContainer;for(;r&&r!==document.body;){if(r.nodeType===Node.ELEMENT_NODE){const n=r;if(n.getAttribute("contenteditable")==="true")return n}r=r.parentNode}}const t=document.activeElement;if(t){if(t.getAttribute("contenteditable")==="true")return t;const r=t.closest('[contenteditable="true"]');if(r)return r}return document.querySelector('[contenteditable="true"]')},Ms=e=>{let t=e;for(;t&&t!==document.body;){if(t.nodeType===Node.ELEMENT_NODE){const r=t;if(al(r))return r;if(r.getAttribute("contenteditable")==="true")break}t=t.parentNode}return null},Lm=(e,t)=>{const r=[],n=new Set,o=l=>{!l||n.has(l)||t.contains(l)&&al(l)&&(n.add(l),r.push(l))};if(e.collapsed)return o(Ms(e.startContainer)),r;const a=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT,{acceptNode:l=>{const s=l;if(!al(s))return NodeFilter.FILTER_SKIP;if(typeof e.intersectsNode=="function")return e.intersectsNode(s)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;const c=document.createRange();return c.selectNodeContents(s),e.compareBoundaryPoints(Range.END_TO_START,c)>0&&e.compareBoundaryPoints(Range.START_TO_END,c)<0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});let i=a.nextNode();for(;i;)o(i),i=a.nextNode();return r.length===0&&o(Ms(e.commonAncestorContainer)),r},Am=(e,t)=>{if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}},Rs=e=>{const t=$m();if(!t)return!1;const r=window.getSelection();if(!r||r.rangeCount===0)return!1;const n=r.getRangeAt(0);if(!t.contains(n.commonAncestorContainer))return!1;const o=Lm(n,t);if(o.length===0)return!1;const a=t.innerHTML;return o.forEach(i=>{e==="rtl"?i.setAttribute("dir","rtl"):i.removeAttribute("dir")}),Am(t,a),t.dispatchEvent(new Event("input",{bubbles:!0})),!0},Mm=()=>({name:"direction",toolbar:[{label:"Left to Right",command:"setDirectionLTR",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 18H3M21 18L18 21M21 18L18 15M13 3V12M13 3H7M13 3C13.4596 3 13.9148 3.0776 14.3394 3.22836C14.764 3.37913 15.1499 3.6001 15.4749 3.87868C15.7999 4.15726 16.0577 4.48797 16.2336 4.85195C16.4095 5.21593 16.5 5.60603 16.5 6C16.5 6.39397 16.4095 6.78407 16.2336 7.14805C16.0577 7.51203 15.7999 7.84274 15.4749 8.12132C15.1499 8.3999 14.764 8.62087 14.3394 8.77164C13.9148 8.9224 13.4596 9 13 9V3ZM9 3V12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',shortcut:"Mod-Shift-l"},{label:"Right to Left",command:"setDirectionRTL",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 18H21M3 18L6 21M3 18L6 15M11 12V3H17M15 3V12M10.5 3C10.0404 3 9.58525 3.0776 9.16061 3.22836C8.73597 3.37913 8.35013 3.6001 8.02513 3.87868C7.70012 4.15726 7.44231 4.48797 7.26642 4.85195C7.09053 5.21593 7 5.60603 7 6C7 6.39397 7.09053 6.78407 7.26642 7.14805C7.44231 7.51203 7.70012 7.84274 8.02513 8.12132C8.35013 8.3999 8.73597 8.62087 9.16061 8.77164C9.58525 8.9224 10.0404 9 10.5 9L10.5 3Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',shortcut:"Mod-Shift-r"}],commands:{setDirectionLTR:()=>{try{return Rs(null)}catch(e){return console.error("Failed to set LTR direction:",e),!1}},setDirectionRTL:()=>{try{return Rs("rtl")}catch(e){return console.error("Failed to set RTL direction:",e),!1}}},keymap:{"Mod-Shift-l":"setDirectionLTR","Mod-Shift-r":"setDirectionRTL"}}),Rm=()=>{const e=()=>{try{const n=window.getSelection();if(n&&n.rangeCount>0&&!n.isCollapsed){const o=n.getRangeAt(0),i=o.toString().toUpperCase();return o.deleteContents(),o.insertNode(document.createTextNode(i)),!0}return!1}catch(n){return console.error("Failed to convert to uppercase:",n),!1}},t=()=>{try{const n=window.getSelection();if(n&&n.rangeCount>0&&!n.isCollapsed){const o=n.getRangeAt(0),i=o.toString().toLowerCase();return o.deleteContents(),o.insertNode(document.createTextNode(i)),!0}return!1}catch(n){return console.error("Failed to convert to lowercase:",n),!1}},r=()=>{try{const n=window.getSelection();if(n&&n.rangeCount>0&&!n.isCollapsed){const o=n.getRangeAt(0),i=o.toString().replace(/\w\S*/g,l=>l.charAt(0).toUpperCase()+l.substr(1).toLowerCase());return o.deleteContents(),o.insertNode(document.createTextNode(i)),!0}return!1}catch(n){return console.error("Failed to convert to title case:",n),!1}};return{name:"capitalization",toolbar:[{label:"Capitalization",command:"setCapitalization",type:"inline-menu",options:[{label:"lowercase",value:"lowercase"},{label:"UPPERCASE",value:"uppercase"},{label:"Title Case",value:"titlecase"}],icon:'<svg fill="#000000" width="24" height="24" viewBox="0 0 32.00 32.00" id="icon" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.192"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;}</style></defs><title>letter--Aa</title><path d="M23,13H18v2h5v2H19a2,2,0,0,0-2,2v2a2,2,0,0,0,2,2h6V15A2,2,0,0,0,23,13Zm0,8H19V19h4Z"></path><path d="M13,9H9a2,2,0,0,0-2,2V23H9V18h4v5h2V11A2,2,0,0,0,13,9ZM9,16V11h4v5Z"></path><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"></rect></g></svg>'}],commands:{setCapitalization:n=>{if(!n)return!1;switch(n){case"uppercase":return e();case"lowercase":return t();case"titlecase":return r();default:return!1}},toUpperCase:e,toLowerCase:t,toTitleCase:r},keymap:{"Mod-Shift-u":"toUpperCase","Mod-Shift-k":"toLowerCase","Mod-Shift-t":"toTitleCase"}}},ji={all:{name:"All",characters:["€","£","¥","¢","₹","₽","₩","₿","₺","₴","₦","₨","₪","₫","₭","₮","₯","₰","₱","₲","₳","₴","₵","₶","₷","₹","₺","₼","₽","₾","₿",'"',"'","«","»","„","‟","‹","›","‚","‛","〝","〞","〟","‟","„","©","®","™","°","§","¶","†","‡","•","‣","⁃","‰","‱","′","″","‴","‵","‶","‷","※","‼","‽","‾","‿","⁀","⁁","⁂","⁃","⁇","⁈","⁉","+","-","×","÷","=","≠","≈","≡","≤","≥","<",">","±","∓","∴","∵","∶","∷","∸","∹","∺","∻","∼","∽","∾","∿","≀","≁","≂","≃","≄","≅","≆","≇","≈","≉","≊","≋","≌","≍","≎","≏","≐","≑","≒","≓","≔","≕","≖","≗","≘","≙","≚","≛","≜","≝","≞","≟","≠","≡","≢","≣","≤","≥","≦","≧","≨","≩","≪","≫","≬","≭","≮","≯","≰","≱","≲","≳","≴","≵","≶","≷","≸","≹","≺","≻","≼","≽","≾","≿","À","Á","Â","Ã","Ä","Å","Æ","Ç","È","É","Ê","Ë","Ì","Í","Î","Ï","Ð","Ñ","Ò","Ó","Ô","Õ","Ö","×","Ø","Ù","Ú","Û","Ü","Ý","Þ","ß","à","á","â","ã","ä","å","æ","ç","è","é","ê","ë","ì","í","î","ï","ð","ñ","ò","ó","ô","õ","ö","÷","ø","ù","ú","û","ü","ý","þ","ÿ","¡","¿","‽","‼","⁇","⁈","⁉","※","‾","‿","⁀","⁁","⁂","⁃","←","↑","→","↓","↔","↕","↖","↗","↘","↙","↚","↛","↜","↝","↞","↟","↠","↡","↢","↣","↤","↥","↦","↧","↨","↩","↪","↫","↬","↭","↮","↯","↰","↱","↲","↳","↴","↵","↶","↷","↸","↹","↺","↻","↼","↽","↾","↿","⇀","⇁","⇂","⇃","⇄","⇅","⇆","⇇","⇈","⇉","⇊","⇋","⇌","⇍","⇎","⇏","⇐","⇑","⇒","⇓","⇔","⇕","⇖","⇗","⇘","⇙","⇚","⇛","⇜","⇝","⇞","⇟","⇠","⇡","⇢","⇣","⇤","⇥","⇦","⇧","⇨","⇩","⇪","⇫","⇬","⇭","⇮","⇯","⇰","⇱","⇲","⇳","⇴","⇵","⇶","⇷","⇸","⇹","⇺","⇻","⇼","⇽","⇾","⇿"]},currency:{name:"Currency",characters:["€","£","¥","¢","₹","₽","₩","₿","₺","₴","₦","₨","₪","₫","₭","₮","₯","₰","₱","₲","₳","₵","₶","₷","₼","₾","₿"]},text:{name:"Text",characters:["©","®","™","°","§","¶","†","‡","•","‣","⁃","‰","‱","′","″","‴","‵","‶","‷","※","‼","‽","‾","‿","⁀","⁁","⁂"]},quotation:{name:"Quotation",characters:['"',"'","«","»","„","‟","‹","›","‚","‛","〝","〞","〟"]},mathematical:{name:"Mathematical",characters:["+","-","×","÷","=","≠","≈","≡","≤","≥","<",">","±","∓","∴","∵","∶","∷","∸","∹","∺","∻","∼","∽","∾","∿","≀","≁","≂","≃","≄","≅","≆","≇","≉","≊","≋","≌","≍","≎","≏","≐","≑","≒","≓","≔","≕","≖","≗","≘","≙","≚","≛","≜","≝","≞","≟","≢","≣","≦","≧","≨","≩","≪","≫","≬","≭","≮","≯","≰","≱","≲","≳","≴","≵","≶","≷","≸","≹","≺","≻","≼","≽","≾","≿"]},"extended-latin":{name:"Extended Latin",characters:["À","Á","Â","Ã","Ä","Å","Æ","Ç","È","É","Ê","Ë","Ì","Í","Î","Ï","Ð","Ñ","Ò","Ó","Ô","Õ","Ö","×","Ø","Ù","Ú","Û","Ü","Ý","Þ","ß","à","á","â","ã","ä","å","æ","ç","è","é","ê","ë","ì","í","î","ï","ð","ñ","ò","ó","ô","õ","ö","÷","ø","ù","ú","û","ü","ý","þ","ÿ"]},symbols:{name:"Symbols",characters:["¡","¿","‽","‼","⁇","⁈","⁉","※","‾","‿","⁀","⁁","⁂","⁃"]},arrows:{name:"Arrows",characters:["←","↑","→","↓","↔","↕","↖","↗","↘","↙","↚","↛","↜","↝","↞","↟","↠","↡","↢","↣","↤","↥","↦","↧","↨","↩","↪","↫","↬","↭","↮","↯","↰","↱","↲","↳","↴","↵","↶","↷","↸","↹","↺","↻","↼","↽","↾","↿","⇀","⇁","⇂","⇃","⇄","⇅","⇆","⇇","⇈","⇉","⇊","⇋","⇌","⇍","⇎","⇏","⇐","⇑","⇒","⇓","⇔","⇕","⇖","⇗","⇘","⇙","⇚","⇛","⇜","⇝","⇞","⇟","⇠","⇡","⇢","⇣","⇤","⇥","⇦","⇧","⇨","⇩","⇪","⇫","⇬","⇭","⇮","⇯","⇰","⇱","⇲","⇳","⇴","⇵","⇶","⇷","⇸","⇹","⇺","⇻","⇼","⇽","⇾","⇿"]}},Ns={"€":"euro","£":"pound","¥":"yen","¢":"cent","₹":"rupee","₽":"ruble","₩":"won","₿":"bitcoin",'"':"quote","'":"apostrophe","«":"left angle quote","»":"right angle quote","„":"low quote","©":"copyright","®":"registered","™":"trademark","°":"degree","§":"section","¶":"paragraph","†":"dagger","‡":"double dagger","•":"bullet","‰":"per mille","′":"prime","″":"double prime","+":"plus","-":"minus","×":"multiplication","÷":"division","=":"equals","≠":"not equal","≈":"approximately","≡":"identical","≤":"less or equal","≥":"greater or equal","±":"plus minus",À:"a grave",Á:"a acute",Â:"a circumflex",Ã:"a tilde",Ä:"a diaeresis",Ç:"c cedilla","←":"left arrow","↑":"up arrow","→":"right arrow","↓":"down arrow","↔":"left right arrow"};let Fi=!1;const Nm='[data-theme="dark"], .dark, .editora-theme-dark',gd=()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return null;const t=e.anchorNode,r=t instanceof HTMLElement?t:t==null?void 0:t.parentElement;return(r==null?void 0:r.closest(".rte-content, .editora-content"))||null},Dm=e=>{const t=e||gd();return t?!!t.closest(Nm):!1},Hm=()=>{if(typeof document>"u")return;const e="special-characters-plugin-styles";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
    .special-characters-overlay {
      --rte-sc-overlay-bg: rgba(15, 23, 36, 0.56);
      --rte-sc-dialog-bg: #ffffff;
      --rte-sc-dialog-text: #101828;
      --rte-sc-border: #d6dbe4;
      --rte-sc-subtle-bg: #f7f9fc;
      --rte-sc-subtle-hover: #eef2f7;
      --rte-sc-muted-text: #5f6b7d;
      --rte-sc-accent: #1f75fe;
      --rte-sc-accent-strong: #165fd6;
      --rte-sc-ring: rgba(31, 117, 254, 0.18);
      --rte-picker-dialog-width: min(640px, 96vw);
      --rte-picker-dialog-max-height: min(560px, 86vh);
      --rte-picker-dialog-radius: 12px;
      --rte-picker-search-wrap-padding: 12px;
      --rte-picker-search-height: 38px;
      --rte-picker-search-font-size: 13px;
      --rte-picker-search-radius: 8px;
      --rte-picker-tabs-width: 156px;
      --rte-picker-tab-padding-y: 10px;
      --rte-picker-tab-padding-x: 12px;
      --rte-picker-tab-font-size: 13px;
      --rte-picker-grid-padding: 12px;
      --rte-picker-grid-gap: 6px;
      --rte-picker-cell-size: 34px;
      --rte-picker-cell-font-size: 17px;
      --rte-picker-cell-radius: 7px;
      --rte-picker-mobile-tab-min-width: 82px;
      --rte-picker-mobile-cell-size: 32px;
      --rte-picker-mobile-grid-gap: 5px;
      --rte-picker-mobile-dialog-max-height: 88vh;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--rte-sc-overlay-bg);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 16px;
      box-sizing: border-box;
    }

    .special-characters-overlay.rte-ui-theme-dark {
      --rte-sc-overlay-bg: rgba(2, 8, 20, 0.72);
      --rte-sc-dialog-bg: #202938;
      --rte-sc-dialog-text: #e8effc;
      --rte-sc-border: #49566c;
      --rte-sc-subtle-bg: #2a3444;
      --rte-sc-subtle-hover: #344256;
      --rte-sc-muted-text: #a5b1c5;
      --rte-sc-accent: #58a6ff;
      --rte-sc-accent-strong: #4598f4;
      --rte-sc-ring: rgba(88, 166, 255, 0.22);
    }

    .special-characters-dialog {
      background: var(--rte-sc-dialog-bg);
      color: var(--rte-sc-dialog-text);
      border: 1px solid var(--rte-sc-border);
      border-radius: var(--rte-picker-dialog-radius);
      box-shadow: 0 24px 48px rgba(10, 15, 24, 0.28);
      width: var(--rte-picker-dialog-width);
      max-height: var(--rte-picker-dialog-max-height);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .special-characters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--rte-sc-border);
      background: linear-gradient(180deg, rgba(127, 154, 195, 0.08) 0%, rgba(127, 154, 195, 0) 100%);
    }

    .special-characters-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--rte-sc-dialog-text);
    }

    .special-characters-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--rte-sc-muted-text);
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: background-color 0.16s ease, color 0.16s ease;
    }

    .special-characters-close:hover {
      background-color: var(--rte-sc-subtle-hover);
      color: var(--rte-sc-dialog-text);
    }

    .special-characters-content {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .special-characters-main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }

    .special-characters-search {
      padding: var(--rte-picker-search-wrap-padding) var(--rte-picker-search-wrap-padding) 0 var(--rte-picker-search-wrap-padding);
    }

    .special-characters-search-input {
      width: 100%;
      height: var(--rte-picker-search-height);
      padding: 8px 12px;
      border: 1px solid var(--rte-sc-border);
      border-radius: var(--rte-picker-search-radius);
      font-size: var(--rte-picker-search-font-size);
      color: var(--rte-sc-dialog-text);
      background-color: var(--rte-sc-subtle-bg);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      box-sizing: border-box;
    }

    .special-characters-search-input::placeholder {
      color: var(--rte-sc-muted-text);
    }

    .special-characters-search-input:focus {
      outline: none;
      border-color: var(--rte-sc-accent);
      box-shadow: 0 0 0 3px var(--rte-sc-ring);
    }

    .special-characters-tabs {
      display: flex;
      flex-direction: column;
      width: var(--rte-picker-tabs-width);
      border-right: 1px solid var(--rte-sc-border);
      background-color: var(--rte-sc-subtle-bg);
      overflow-y: auto;
    }

    .special-characters-tab {
      padding: var(--rte-picker-tab-padding-y) var(--rte-picker-tab-padding-x);
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      font-size: var(--rte-picker-tab-font-size);
      color: var(--rte-sc-muted-text);
      border-bottom: 1px solid var(--rte-sc-border);
      transition: all 0.2s ease;
      line-height: 1.25;
    }

    .special-characters-tab:hover {
      background-color: var(--rte-sc-subtle-hover);
      color: var(--rte-sc-dialog-text);
    }

    .special-characters-tab.active {
      background-color: var(--rte-sc-accent);
      color: #fff;
      font-weight: 500;
    }

    .special-characters-grid {
      padding: var(--rte-picker-grid-padding);
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(var(--rte-picker-cell-size), 1fr));
      gap: var(--rte-picker-grid-gap);
      contain: content;
    }

    .special-characters-item {
      width: var(--rte-picker-cell-size);
      height: var(--rte-picker-cell-size);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--rte-sc-border);
      background: var(--rte-sc-subtle-bg);
      border-radius: var(--rte-picker-cell-radius);
      cursor: pointer;
      font-size: var(--rte-picker-cell-font-size);
      transition: all 0.2s ease;
      color: var(--rte-sc-dialog-text);
    }

    .special-characters-item:hover {
      background-color: var(--rte-sc-accent);
      border-color: var(--rte-sc-accent);
      color: #fff;
      transform: scale(1.05);
    }

    .special-characters-item:active {
      transform: scale(0.95);
    }

    .special-characters-no-results {
      grid-column: 1 / -1;
      text-align: center;
      color: var(--rte-sc-muted-text);
      font-size: 14px;
      padding: 40px 20px;
      background-color: var(--rte-sc-subtle-bg);
      border-radius: 8px;
      border: 1px solid var(--rte-sc-border);
    }

    @media (max-width: 768px) {
      .special-characters-dialog {
        width: 96%;
        max-height: var(--rte-picker-mobile-dialog-max-height);
      }

      .special-characters-content {
        flex-direction: column;
      }

      .special-characters-tabs {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--rte-sc-border);
        flex-direction: row;
        overflow-x: auto;
      }

      .special-characters-tab {
        border-bottom: none;
        border-right: 1px solid var(--rte-sc-border);
        white-space: nowrap;
        min-width: var(--rte-picker-mobile-tab-min-width);
      }

      .special-characters-grid {
        grid-template-columns: repeat(auto-fill, minmax(var(--rte-picker-mobile-cell-size), 1fr));
        gap: var(--rte-picker-mobile-grid-gap);
      }

      .special-characters-item {
        width: var(--rte-picker-mobile-cell-size);
        height: var(--rte-picker-mobile-cell-size);
        font-size: 16px;
      }
    }
  `,document.head.appendChild(t)},Im=e=>{const t=window.getSelection();if(t&&t.rangeCount>0){const r=t.getRangeAt(0);r.deleteContents();const n=document.createTextNode(e);r.insertNode(n),r.setStartAfter(n),r.setEndAfter(n),t.removeAllRanges(),t.addRange(r)}},Bm=e=>{if(typeof window>"u"||Fi)return;Fi=!0,Hm();let t="all",r="",n=null;const o=document.createElement("div");o.className="special-characters-overlay",Dm(e)&&o.classList.add("rte-ui-theme-dark");const a=document.createElement("div");a.className="special-characters-dialog",a.setAttribute("role","dialog"),a.setAttribute("aria-modal","true"),a.innerHTML=`
    <div class="special-characters-header">
      <h2>Insert Special Characters</h2>
      <button class="special-characters-close">×</button>
    </div>
    <div class="special-characters-content">
      <div class="special-characters-tabs">
        ${Object.keys(ji).map(m=>`
          <button class="special-characters-tab ${t===m?"active":""}" data-category="${m}">
            ${ji[m].name}
          </button>
        `).join("")}
      </div>
      <div class="special-characters-main-content">
        <div class="special-characters-search">
          <input
            type="text"
            placeholder="Search characters..."
            class="special-characters-search-input"
          >
        </div>
        <div class="special-characters-grid"></div>
      </div>
    </div>
  `;const i=a.querySelector(".special-characters-tabs"),l=a.querySelector(".special-characters-grid"),s=a.querySelector(".special-characters-search-input"),c=a.querySelector(".special-characters-close"),d=()=>ji[t].characters.filter(m=>{if(!r.trim())return!0;const h=r.toLowerCase();return m.toLowerCase().includes(h)||(Ns[m]||"").toLowerCase().includes(h)}),u=()=>{i==null||i.querySelectorAll(".special-characters-tab").forEach(m=>{m.classList.toggle("active",m.getAttribute("data-category")===t)})},f=()=>{if(!l)return;const m=d();if(m.length===0){l.innerHTML=`<div class="special-characters-no-results">No characters found for "${r}"</div>`;return}l.innerHTML=m.map(h=>`
      <button class="special-characters-item" data-char="${h}" title="${Ns[h]||h}">
        ${h}
      </button>
    `).join("")},p=()=>{n!==null&&(window.clearTimeout(n),n=null),o.parentNode&&o.parentNode.removeChild(o),Fi=!1,document.removeEventListener("keydown",g,!0)},g=m=>{m.key==="Escape"&&(m.preventDefault(),m.stopPropagation(),p())};c==null||c.addEventListener("click",p),i==null||i.addEventListener("click",m=>{const b=m.target.closest(".special-characters-tab");if(!b)return;const y=b.getAttribute("data-category");!y||t===y||(t=y,u(),f())}),s==null||s.addEventListener("input",m=>{r=m.target.value,n!==null&&window.clearTimeout(n),n=window.setTimeout(()=>{n=null,f()},90)}),l==null||l.addEventListener("click",m=>{const b=m.target.closest(".special-characters-item");if(!b)return;const y=b.getAttribute("data-char");y&&(Im(y),p())}),o.addEventListener("click",m=>{m.target===o&&p()}),document.addEventListener("keydown",g,!0),u(),f(),o.appendChild(a),document.body.appendChild(o),requestAnimationFrame(()=>s==null?void 0:s.focus())},Pm=()=>({name:"specialCharacters",toolbar:[{label:"Special Characters",command:"insertSpecialCharacter",icon:'<svg width="24" height="24" focusable="false"><path d="M15 18h4l1-2v4h-6v-3.3l1.4-1a6 6 0 0 0 1.8-2.9 6.3 6.3 0 0 0-.1-4.1 5.8 5.8 0 0 0-3-3.2c-.6-.3-1.3-.5-2.1-.5a5.1 5.1 0 0 0-3.9 1.8 6.3 6.3 0 0 0-1.3 6 6.2 6.2 0 0 0 1.8 3l1.4.9V20H4v-4l1 2h4v-.5l-2-1L5.4 15A6.5 6.5 0 0 1 4 11c0-1 .2-1.9.6-2.7A7 7 0 0 1 6.3 6C7.1 5.4 8 5 9 4.5c1-.3 2-.5 3.1-.5a8.8 8.8 0 0 1 5.7 2 7 7 0 0 1 1.7 2.3 6 6 0 0 1 .2 4.8c-.2.7-.6 1.3-1 1.9a7.6 7.6 0 0 1-3.6 2.5v.5Z" fill-rule="evenodd"></path></svg>'}],commands:{insertSpecialCharacter:(e,t)=>{const r=(t==null?void 0:t.contentElement)instanceof HTMLElement?t.contentElement:gd();return Bm(r),!0}},keymap:{}}),il={all:{name:"All",emojis:["❤️","💔","💙","💚","💛","🖤","🤍","🤎","✔️","❌","☑️","❗","❓","⚠️","💯","➕","➖","✖️","➗","♻️","⚡","🔥","✨","⭐","⭕","🚫","😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😍","😘","😎","🤓","😐","😑","😬","🙄","😏","😌","🤩","🥳","🤔","😴","😭","😢","😡","🤯","👍","👎","👌","✌️","🤞","🙏","👏","🙌","💪","🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦅","🦄","🐝","🦋","🌲","🌳","🌴","🌵","🌸","🌼","🌻","☀️","🌙","⭐","🌈","🌧️","❄️","🌊","🍎","🍌","🍉","🍇","🍓","🍒","🍍","🥭","🍐","🍊","🍋","🍑","🥝","🥑","🍔","🍟","🍕","🌭","🥪","🌮","🌯","🍣","🍜","🍰","🧁","🍩","🍪","🍫","☕","🍵","🥤","🍺","🍷","🍸","🍹","🥂","⚽","🏀","🏈","⚾","🎾","🏐","🏉","🎮","🎯","🎳","🎲","♟️","🏃","🚴","🏊","🏋️","🧘","🎸","🎹","🥁","🎺","🎤","🏆","🥇","🚗","🚕","🚌","🚎","🚓","🚑","🚒","✈️","🚀","🚁","🚤","🛳️","🚢","🏠","🏢","🏬","🏫","🏥","🏰","🗼","🗽","⛩️","🕌","🌍","🌎","🌏","🏖️","🏝️","📱","💻","🖥️","⌨️","🖱️","📷","📸","🎥","📹","📚","📖","📝","📄","📂","🔒","🔑","🗝️","💡","🔦","🕯️","🧰","🛠️","🔧","⚙️","📦","💳","💰","🔋","🔌","🇮🇳","🇺🇸","🇬🇧","🇨🇦","🇦🇺","🇩🇪","🇫🇷","🇪🇸","🇮🇹","🇯🇵","🇰🇷","🇨🇳","🇧🇷","🇲🇽","🇷🇺","🇿🇦","🇳🇿"]},symbols:{name:"Symbols",emojis:["❤️","💔","💙","💚","💛","🖤","🤍","🤎","✔️","❌","☑️","❗","❓","⚠️","💯","➕","➖","✖️","➗","♻️","⚡","🔥","✨","⭐","⭕","🚫","⬆️","⬇️","⬅️","➡️","🔄","🔁","🔀","🔔","🔕","⏰","⌛","⏳"]},people:{name:"People",emojis:["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😍","😘","😎","🤓","😐","😑","😬","🙄","😏","😌","🤩","🥳","🤔","😴","😭","😢","😡","🤯","👍","👎","👌","✌️","🤞","🙏","👏","🙌","💪"]},"animals-nature":{name:"Animals & Nature",emojis:["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦅","🦄","🐝","🦋","🌲","🌳","🌴","🌵","🌸","🌼","🌻","☀️","🌙","⭐","🌈","🌧️","❄️","🌊"]},"food-drink":{name:"Food & Drink",emojis:["🍎","🍌","🍉","🍇","🍓","🍒","🍍","🥭","🍐","🍊","🍋","🍑","🥝","🥑","🍔","🍟","🍕","🌭","🥪","🌮","🌯","🍣","🍜","🍰","🧁","🍩","🍪","🍫","☕","🍵","🥤","🍺","🍷","🍸","🍹","🥂"]},activity:{name:"Activity",emojis:["⚽","🏀","🏈","⚾","🎾","🏐","🏉","🎮","🎯","🎳","🎲","♟️","🏃","🚴","🏊","🏋️","🧘","🎸","🎹","🥁","🎺","🎤","🏆","🥇","🥈","🥉"]},"travel-places":{name:"Travel & Places",emojis:["🚗","🚕","🚌","🚎","🚓","🚑","🚒","✈️","🚀","🚁","🚤","🛳️","🚢","🏠","🏢","🏬","🏫","🏥","🏰","🗼","🗽","⛩️","🕌","🌍","🌎","🌏","🏖️","🏝️"]},objects:{name:"Objects",emojis:["📱","💻","🖥️","⌨️","🖱️","📷","📸","🎥","📹","📚","📖","📝","📄","📂","🔒","🔑","🗝️","💡","🔦","🕯️","🧰","🛠️","🔧","⚙️","📦","💳","💰","🔋","🔌"]},flags:{name:"Flags",emojis:["🇮🇳","🇺🇸","🇬🇧","🇨🇦","🇦🇺","🇩🇪","🇫🇷","🇪🇸","🇮🇹","🇯🇵","🇰🇷","🇨🇳","🇧🇷","🇲🇽","🇷🇺","🇿🇦","🇳🇿"]}},Om={"💙":"blue heart","💚":"green heart","💛":"yellow heart","🖤":"black heart","🤍":"white heart","🤎":"brown heart","☑️":"check box with check","🔴":"red circle","🟢":"green circle","🟡":"yellow circle","🔵":"blue circle","⬆️":"up arrow","⬇️":"down arrow","⬅️":"left arrow","➡️":"right arrow","🔄":"counterclockwise arrows","🔁":"repeat button","🔀":"shuffle tracks","🔔":"bell","🔕":"muted bell","⏰":"alarm clock","⏳":"hourglass not done","⌛":"hourglass done","♠️":"spade suit","♥️":"heart suit","♦️":"diamond suit","♣️":"club suit","🚫":"prohibited","⭕":"hollow red circle","❎":"cross mark button","😐":"neutral face","😑":"expressionless face","😬":"grimacing face","🙄":"face with rolling eyes","😏":"smirking face","😌":"relieved face","🤩":"star struck","😜":"winking face with tongue","😝":"squinting face with tongue","🤪":"zany face","😢":"crying face","😥":"sad but relieved face","😓":"downcast face with sweat","😱":"face screaming in fear","😨":"fearful face","🤗":"hugging face","🤭":"face with hand over mouth","🤫":"shushing face","🤥":"lying face","👌":"ok hand","✌️":"victory hand","🤞":"crossed fingers","🙌":"raising hands","💪":"flexed biceps","🐔":"chicken","🐧":"penguin","🐦":"bird","🐤":"baby chick","🦆":"duck","🦅":"eagle","🐺":"wolf","🦄":"unicorn","🐝":"honeybee","🐞":"lady beetle","🦋":"butterfly","🐢":"turtle","🐍":"snake","🦖":"t-rex","🌿":"herb","🍀":"four leaf clover","🍁":"maple leaf","🍂":"fallen leaf","🌊":"water wave","❄️":"snowflake","☁️":"cloud","⛈️":"cloud with lightning and rain","🌪️":"tornado","🍐":"pear","🍊":"tangerine","🍋":"lemon","🍑":"peach","🥝":"kiwi fruit","🥑":"avocado","🍆":"eggplant","🌽":"ear of corn","🥕":"carrot","🥔":"potato","🍞":"bread","🥐":"croissant","🥖":"baguette bread","🧀":"cheese wedge","🍖":"meat on bone","🍗":"poultry leg","🥩":"cut of meat","🍦":"soft ice cream","🍨":"ice cream","🍫":"chocolate bar","🍬":"candy","🥛":"glass of milk","🧃":"beverage box","🍹":"tropical drink","🥂":"clinking glasses","🏓":"ping pong","🥊":"boxing glove","🥋":"martial arts uniform","⛳":"flag in hole","🏹":"bow and arrow","🎿":"skis","⛷️":"skier","🏂":"snowboarder","🎤":"microphone","🎬":"clapper board","🎨":"artist palette","🧩":"puzzle piece","🪀":"yo-yo","🚇":"metro","🚉":"station","🚊":"tram","🚝":"monorail","🛻":"pickup truck","🚐":"minibus","🗺️":"world map","🧭":"compass","⛰️":"mountain","🏔️":"snow capped mountain","🌋":"volcano","🏜️":"desert","🏕️":"camping","🏙️":"cityscape","🌆":"city at dusk","🌃":"night with stars","📦":"package","📫":"closed mailbox with raised flag","📬":"open mailbox with raised flag","📭":"open mailbox with lowered flag","🧾":"receipt","💳":"credit card","💰":"money bag","🪙":"coin","🔋":"battery","🔌":"electric plug","🧯":"fire extinguisher","🪜":"ladder","🪞":"mirror","🧹":"broom","🧸":"teddy bear"};let wa=null,Kn="all",ja="",lr=null,Wn=null,Un=null;const zm='[data-theme="dark"], .dark, .editora-theme-dark',_m=()=>({name:"emojis",toolbar:[{label:"Insert Emoji",command:"openEmojiDialog",icon:'<svg width="24" height="24" focusable="false"><path d="M9 11c.6 0 1-.4 1-1s-.4-1-1-1a1 1 0 0 0-1 1c0 .6.4 1 1 1Zm6 0c.6 0 1-.4 1-1s-.4-1-1-1a1 1 0 0 0-1 1c0 .6.4 1 1 1Zm-3 5.5c2.1 0 4-1.5 4.4-3.5H7.6c.5 2 2.3 3.5 4.4 3.5ZM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" fill-rule="nonzero"></path></svg>',shortcut:"Mod-Shift-j",type:"button"}],commands:{openEmojiDialog:(e,t)=>{const r=(t==null?void 0:t.contentElement)||ll();return r?(qm(r),!0):!1},insertEmoji:(e,t)=>{if(!e)return!1;const r=(t==null?void 0:t.contentElement)||ll();if(!r)return!1;try{return yd(e,r),!0}catch{return!1}}},keymap:{"Mod-Shift-j":"openEmojiDialog"}});function qm(e){Gn(),Kn="all",ja="";const t=window.getSelection();Wn=null,t&&t.rangeCount>0&&e.contains(t.anchorNode)&&(Wn=t.getRangeAt(0).cloneRange());const r=document.createElement("div");r.className="emojis-overlay",Vm(e)&&r.classList.add("rte-ui-theme-dark"),r.onclick=Gn;const n=document.createElement("div");n.className="emojis-dialog",n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true"),n.onclick=a=>a.stopPropagation();const o=Object.keys(il);n.innerHTML=`
    <div class="rte-dialog-header emojis-header">
      <h3>Insert Emojis</h3>
      <button class="rte-dialog-close emojis-close">×</button>
    </div>
    <div class="rte-dialog-body emojis-content">
      <div class="emojis-tabs">
        ${o.map(a=>`
          <button class="emojis-tab ${a===Kn?"active":""}" data-category="${a}">
            ${il[a].name}
          </button>
        `).join("")}
      </div>
      <div class="emojis-main-content">
        <div class="emojis-search">
          <svg class="emojis-search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search emojis..." 
            class="emojis-search-input"
            id="emoji-search-input"
          />
        </div>
        <div class="emojis-grid" id="emojis-grid">
          ${hd(Kn,ja)}
        </div>
      </div>
    </div>
  `,r.appendChild(n),document.body.appendChild(r),wa=r,Un=a=>{a.key==="Escape"&&(a.preventDefault(),a.stopPropagation(),Gn())},document.addEventListener("keydown",Un,!0),jm(n,e),Km(),requestAnimationFrame(()=>{var a;(a=n.querySelector("#emoji-search-input"))==null||a.focus()})}function jm(e,t){var o;(o=e.querySelector(".emojis-close"))==null||o.addEventListener("click",Gn),e.querySelectorAll(".emojis-tab").forEach(a=>{a.addEventListener("click",i=>{const l=i.target.getAttribute("data-category");l&&Fm(e,l)})});const r=e.querySelector("#emoji-search-input");r==null||r.addEventListener("input",a=>{ja=a.target.value,lr!==null&&window.clearTimeout(lr),lr=window.setTimeout(()=>{lr=null,bd(e)},90)});const n=e.querySelector("#emojis-grid");n==null||n.addEventListener("click",a=>{var c;const l=a.target.closest(".emojis-item");if(!l)return;const s=l.getAttribute("data-emoji")||((c=l.textContent)==null?void 0:c.trim())||"";s&&(yd(s,t),Gn())})}function Fm(e,t){Kn=t,e.querySelectorAll(".emojis-tab").forEach(r=>{r.classList.toggle("active",r.getAttribute("data-category")===t)}),bd(e)}function bd(e){const t=e.querySelector("#emojis-grid");t&&(t.innerHTML=hd(Kn,ja))}function hd(e,t){let r=il[e].emojis;return t.trim()&&(r=r.filter(n=>n.toLowerCase().includes(t.toLowerCase())?!0:(Om[n]||"").toLowerCase().includes(t.toLowerCase()))),r.length===0&&t.trim()?`<div class="emojis-no-results">No emojis found for "${t}"</div>`:r.map((n,o)=>`
    <button 
      class="emojis-item" 
      title="Insert ${n}"
      data-emoji="${n}"
    >
      ${n}
    </button>
  `).join("")}function Gn(){Un&&(document.removeEventListener("keydown",Un,!0),Un=null),lr!==null&&(window.clearTimeout(lr),lr=null),wa&&(wa.remove(),wa=null)}function yd(e,t){t.focus();let r=window.getSelection();if(Wn&&(r==null||r.removeAllRanges(),r==null||r.addRange(Wn),Wn=null),r=window.getSelection(),r&&r.rangeCount>0){const n=r.getRangeAt(0);n.deleteContents();const o=document.createTextNode(e);n.insertNode(o),n.setStartAfter(o),n.setEndAfter(o),r.removeAllRanges(),r.addRange(n)}}function ll(){const e=window.getSelection();if(e&&e.rangeCount>0){const r=e.anchorNode,n=r instanceof HTMLElement?r:r==null?void 0:r.parentElement,o=n==null?void 0:n.closest(".editora-content, .rte-content");if(o)return o}const t=document.activeElement;return t&&(t.classList.contains("editora-content")||t.classList.contains("rte-content"))?t:document.querySelector(".editora-content, .rte-content")}function Vm(e){const t=e||ll();return t?!!t.closest(zm):!1}function Km(){if(document.getElementById("emojis-dialog-styles"))return;const e=document.createElement("style");e.id="emojis-dialog-styles",e.textContent=`
    .emojis-overlay {
      --rte-emoji-overlay-bg: rgba(15, 23, 36, 0.56);
      --rte-emoji-dialog-bg: #ffffff;
      --rte-emoji-dialog-text: #101828;
      --rte-emoji-border: #d6dbe4;
      --rte-emoji-subtle-bg: #f7f9fc;
      --rte-emoji-subtle-hover: #eef2f7;
      --rte-emoji-muted-text: #5f6b7d;
      --rte-emoji-accent: #1f75fe;
      --rte-emoji-accent-strong: #165fd6;
      --rte-emoji-ring: rgba(31, 117, 254, 0.18);
      --rte-picker-dialog-width: min(640px, 96vw);
      --rte-picker-dialog-max-height: min(560px, 86vh);
      --rte-picker-dialog-radius: 12px;
      --rte-picker-search-wrap-padding: 12px;
      --rte-picker-search-height: 38px;
      --rte-picker-search-font-size: 13px;
      --rte-picker-search-radius: 8px;
      --rte-picker-tabs-width: 156px;
      --rte-picker-tab-padding-y: 10px;
      --rte-picker-tab-padding-x: 12px;
      --rte-picker-tab-font-size: 13px;
      --rte-picker-grid-padding: 12px;
      --rte-picker-grid-gap: 6px;
      --rte-picker-cell-size: 34px;
      --rte-picker-cell-font-size: 17px;
      --rte-picker-cell-radius: 7px;
      --rte-picker-mobile-tab-min-width: 82px;
      --rte-picker-mobile-cell-size: 32px;
      --rte-picker-mobile-grid-gap: 5px;
      --rte-picker-mobile-dialog-max-height: 88vh;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--rte-emoji-overlay-bg);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 16px;
      box-sizing: border-box;
    }

    .emojis-overlay.rte-ui-theme-dark {
      --rte-emoji-overlay-bg: rgba(2, 8, 20, 0.72);
      --rte-emoji-dialog-bg: #202938;
      --rte-emoji-dialog-text: #e8effc;
      --rte-emoji-border: #49566c;
      --rte-emoji-subtle-bg: #2a3444;
      --rte-emoji-subtle-hover: #344256;
      --rte-emoji-muted-text: #a5b1c5;
      --rte-emoji-accent: #58a6ff;
      --rte-emoji-accent-strong: #4598f4;
      --rte-emoji-ring: rgba(88, 166, 255, 0.22);
    }

    .emojis-dialog {
      background: var(--rte-emoji-dialog-bg);
      color: var(--rte-emoji-dialog-text);
      border: 1px solid var(--rte-emoji-border);
      border-radius: var(--rte-picker-dialog-radius);
      box-shadow: 0 24px 48px rgba(10, 15, 24, 0.28);
      width: var(--rte-picker-dialog-width);
      max-height: var(--rte-picker-dialog-max-height);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .emojis-header {
      border-bottom: 1px solid var(--rte-emoji-border);
      background: linear-gradient(180deg, rgba(127, 154, 195, 0.08) 0%, rgba(127, 154, 195, 0) 100%);
    }

    .emojis-header h3 {
      color: var(--rte-emoji-dialog-text);
    }

    .emojis-close {
      color: var(--rte-emoji-muted-text);
      border-radius: 8px;
      transition: background-color 0.16s ease, color 0.16s ease;
    }

    .emojis-close:hover {
      background-color: var(--rte-emoji-subtle-hover);
      color: var(--rte-emoji-dialog-text);
    }

    .emojis-content {
      display: flex;
      flex: 1;
      overflow: hidden;
      padding: 0;
    }

    .emojis-main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }

    .emojis-search {
      padding: var(--rte-picker-search-wrap-padding) var(--rte-picker-search-wrap-padding) 0 var(--rte-picker-search-wrap-padding);
      position: relative;
    }

    .emojis-search-icon {
      position: absolute;
      left: 24px;
      top: 22px;
      color: var(--rte-emoji-muted-text);
      pointer-events: none;
      z-index: 1;
    }

    .emojis-search-input {
      width: 100%;
      height: var(--rte-picker-search-height);
      padding: 8px 12px 8px 36px;
      border: 1px solid var(--rte-emoji-border);
      border-radius: var(--rte-picker-search-radius);
      font-size: var(--rte-picker-search-font-size);
      color: var(--rte-emoji-dialog-text);
      background-color: var(--rte-emoji-subtle-bg);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      box-sizing: border-box;
    }

    .emojis-search-input:focus {
      outline: none;
      border-color: var(--rte-emoji-accent);
      box-shadow: 0 0 0 3px var(--rte-emoji-ring);
    }

    .emojis-search:focus-within .emojis-search-icon {
      color: var(--rte-emoji-accent);
    }

    .emojis-search-input::placeholder {
      color: var(--rte-emoji-muted-text);
    }

    .emojis-tabs {
      display: flex;
      flex-direction: column;
      width: var(--rte-picker-tabs-width);
      border-right: 1px solid var(--rte-emoji-border);
      background-color: var(--rte-emoji-subtle-bg);
      overflow-y: auto;
    }

    .emojis-tab {
      padding: var(--rte-picker-tab-padding-y) var(--rte-picker-tab-padding-x);
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      font-size: var(--rte-picker-tab-font-size);
      color: var(--rte-emoji-muted-text);
      border-bottom: 1px solid var(--rte-emoji-border);
      transition: all 0.2s ease;
      line-height: 1.25;
    }

    .emojis-tab:hover {
      background-color: var(--rte-emoji-subtle-hover);
      color: var(--rte-emoji-dialog-text);
    }

    .emojis-tab.active {
      background-color: var(--rte-emoji-accent);
      color: #fff;
      font-weight: 500;
    }

    .emojis-tab.active:hover {
      background-color: var(--rte-emoji-accent-strong);
    }

    .emojis-grid {
      padding: var(--rte-picker-grid-padding);
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(var(--rte-picker-cell-size), 1fr));
      gap: var(--rte-picker-grid-gap);
      contain: content;
    }

    .emojis-item {
      width: var(--rte-picker-cell-size);
      height: var(--rte-picker-cell-size);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--rte-emoji-border);
      background: var(--rte-emoji-subtle-bg);
      border-radius: var(--rte-picker-cell-radius);
      cursor: pointer;
      font-size: var(--rte-picker-cell-font-size);
      transition: all 0.2s ease;
      color: var(--rte-emoji-dialog-text);
    }

    .emojis-item:hover {
      background-color: var(--rte-emoji-accent);
      border-color: var(--rte-emoji-accent);
      color: #fff;
      transform: scale(1.05);
    }

    .emojis-item:active {
      transform: scale(0.95);
    }

    .emojis-no-results {
      grid-column: 1 / -1;
      text-align: center;
      color: var(--rte-emoji-muted-text);
      font-size: 14px;
      padding: 40px 20px;
      background-color: var(--rte-emoji-subtle-bg);
      border-radius: 8px;
      border: 1px solid var(--rte-emoji-border);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .emojis-dialog {
        width: 96%;
        max-height: var(--rte-picker-mobile-dialog-max-height);
      }

      .emojis-content {
        flex-direction: column;
      }

      .emojis-tabs {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--rte-emoji-border);
        flex-direction: row;
        overflow-x: auto;
      }

      .emojis-tab {
        border-bottom: none;
        border-right: 1px solid var(--rte-emoji-border);
        white-space: nowrap;
        min-width: var(--rte-picker-mobile-tab-min-width);
      }

      .emojis-grid {
        grid-template-columns: repeat(auto-fill, minmax(var(--rte-picker-mobile-cell-size), 1fr));
        gap: var(--rte-picker-mobile-grid-gap);
      }

      .emojis-item {
        width: var(--rte-picker-mobile-cell-size);
        height: var(--rte-picker-mobile-cell-size);
        font-size: 16px;
      }
    }
  `,document.head.appendChild(e)}const Wm=[{label:"Inline Value",value:"inline"},{label:"Responsive - 21x9",value:"21x9"},{label:"Responsive - 16x9",value:"16x9"},{label:"Responsive - 4x3",value:"4x3"},{label:"Responsive - 1x1",value:"1x1"}],zn='[data-theme="dark"], .dark, .editora-theme-dark',Vi=new WeakMap,It=e=>(Vi.has(e)||Vi.set(e,{dialogElement:null,escapeHandler:null,activeTab:"general",formData:{src:"",selectedSize:"inline",width:"100%",height:"400px",constrainProportions:!0,name:"",title:"",longDescription:"",descriptionUrl:"",showBorder:!0,enableScrollbar:!0}}),Vi.get(e));function Um(e){if(e!=null&&e.matches(zn)||e!=null&&e.closest(zn))return!0;const t=document.activeElement;return t!=null&&t.closest(zn)?!0:document.body.matches(zn)||document.documentElement.matches(zn)}const Gm=()=>({name:"embedIframe",toolbar:[{label:"Embed Content",command:"openEmbedIframeDialog",icon:'<svg width="24" height="24" focusable="false"><path d="M19 6V5H5v14h2A13 13 0 0 1 19 6Zm0 1.4c-.8.8-1.6 2.4-2.2 4.6H19V7.4Zm0 5.6h-2.4c-.4 1.8-.6 3.8-.6 6h3v-6Zm-4 6c0-2.2.2-4.2.6-6H13c-.7 1.8-1.1 3.8-1.1 6h3Zm-4 0c0-2.2.4-4.2 1-6H9.6A12 12 0 0 0 8 19h3ZM4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm11.8 9c.4-1.9 1-3.4 1.8-4.5a9.2 9.2 0 0 0-4 4.5h2.2Zm-3.4 0a12 12 0 0 1 2.8-4 12 12 0 0 0-5 4h2.2Z" fill-rule="nonzero"></path></svg>',shortcut:"Mod-Shift-e",type:"button"}],commands:{openEmbedIframeDialog:e=>(Zm(e),!0)},keymap:{"Mod-Shift-e":"openEmbedIframeDialog"}});function Zm(e){if(!e){const o=document.activeElement;o&&o.closest("[data-editora-editor]")&&(e=o.closest("[data-editora-editor]"))}if(e||(e=document.querySelector("[data-editora-editor]")),!e){console.warn("Editor element not found");return}const t=It(e);t.formData={src:"",selectedSize:"inline",width:"100%",height:"400px",constrainProportions:!0,name:"",title:"",longDescription:"",descriptionUrl:"",showBorder:!0,enableScrollbar:!0},t.activeTab="general";const r=document.createElement("div");r.className="rte-dialog-overlay rte-embed-iframe-overlay",Um(e)&&r.classList.add("rte-theme-dark"),r.onclick=()=>fo(e);const n=document.createElement("div");n.className="rte-dialog-content embed-iframe-dialog",n.onclick=o=>o.stopPropagation(),n.innerHTML=`
    <div class="rte-dialog-header">
      <h3>Embed Iframe</h3>
      <button class="rte-dialog-close">×</button>
    </div>
    <div class="rte-dialog-body">
      <div class="rte-vertical-tabs">
        <div class="rte-tab-buttons">
          <button class="rte-tab-button active" data-tab="general">General</button>
          <button class="rte-tab-button" data-tab="advanced">Advanced</button>
        </div>
        <div class="rte-tab-content">
          <div class="rte-tab-panel" data-panel="general" style="display: block;">
            <div class="rte-form-group">
              <label class="rte-form-label">Source</label>
              <input type="url" class="rte-form-input" id="iframe-src" placeholder="https://example.com" required />
            </div>
            <div class="rte-form-group">
              <label class="rte-form-label">Size</label>
              <select class="rte-form-select" id="iframe-size">
                ${Wm.map(o=>`<option value="${o.value}">${o.label}</option>`).join("")}
              </select>
            </div>
            <div class="rte-form-row" id="dimensions-row">
              <div class="rte-form-group">
                <label class="rte-form-label">Width</label>
                <input type="text" class="rte-form-input" id="iframe-width" placeholder="100%" value="100%" />
              </div>
              <div class="rte-form-group">
                <label class="rte-form-label">Height</label>
                <input type="text" class="rte-form-input" id="iframe-height" placeholder="400px" value="400px" />
              </div>
              <div class="rte-form-group constrain-group">
                <button type="button" class="rte-constrain-btn locked" id="constrain-btn" title="Unlock proportions">🔒</button>
              </div>
            </div>
          </div>
          <div class="rte-tab-panel" data-panel="advanced" style="display: none;">
            <div class="rte-form-group">
              <label class="rte-form-label">Name</label>
              <input type="text" class="rte-form-input" id="iframe-name" placeholder="Iframe name" />
            </div>
            <div class="rte-form-group">
              <label class="rte-form-label">Title</label>
              <input type="text" class="rte-form-input" id="iframe-title" placeholder="Iframe title" />
            </div>
            <div class="rte-form-group">
              <label class="rte-form-label">Long Description</label>
              <textarea class="rte-form-textarea" id="iframe-longdesc" placeholder="Detailed description of the iframe content" rows="3"></textarea>
            </div>
            <div class="rte-form-group">
              <label class="rte-form-label">Description URL</label>
              <input type="url" class="rte-form-input" id="iframe-desc-url" placeholder="https://example.com/description" />
            </div>
            <div class="rte-form-group">
              <label class="rte-checkbox-label">
                <input type="checkbox" id="iframe-border" checked />
                Show iframe border
              </label>
            </div>
            <div class="rte-form-group">
              <label class="rte-checkbox-label">
                <input type="checkbox" id="iframe-scrollbar" checked />
                Enable scrollbar
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rte-dialog-footer">
      <button type="button" class="rte-btn rte-btn-secondary" id="cancel-btn">Cancel</button>
      <button type="submit" class="rte-btn rte-btn-primary" id="save-btn">Save</button>
    </div>
  `,r.appendChild(n),document.body.appendChild(r),t.dialogElement=r,t.escapeHandler=o=>{o.key==="Escape"&&(o.preventDefault(),o.stopPropagation(),fo(e))},document.addEventListener("keydown",t.escapeHandler,!0),Ym(n,e),op(),setTimeout(()=>{var o;(o=n.querySelector("#iframe-src"))==null||o.focus()},100)}function Ym(e,t){var a,i,l,s;It(t),(a=e.querySelector(".rte-dialog-close"))==null||a.addEventListener("click",()=>fo(t)),e.querySelectorAll(".rte-tab-button").forEach(c=>{c.addEventListener("click",d=>{const u=d.target.getAttribute("data-tab");u&&Xm(e,u,t)})});const r=e.querySelector("#iframe-size");r==null||r.addEventListener("change",c=>Jm(e,c.target.value,t));const n=e.querySelector("#iframe-width"),o=e.querySelector("#iframe-height");n==null||n.addEventListener("input",c=>Qm(e,c.target.value,t)),o==null||o.addEventListener("input",c=>ep(e,c.target.value,t)),(i=e.querySelector("#constrain-btn"))==null||i.addEventListener("click",()=>tp(e,t)),(l=e.querySelector("#cancel-btn"))==null||l.addEventListener("click",()=>fo(t)),(s=e.querySelector("#save-btn"))==null||s.addEventListener("click",()=>rp(e,t))}function Xm(e,t,r){const n=It(r);n.activeTab=t,e.querySelectorAll(".rte-tab-button").forEach(o=>{o.classList.toggle("active",o.getAttribute("data-tab")===t)}),e.querySelectorAll(".rte-tab-panel").forEach(o=>{o.style.display=o.getAttribute("data-panel")===t?"block":"none"})}function Jm(e,t,r){const n=It(r);n.formData.selectedSize=t;const o=e.querySelector("#dimensions-row"),a=e.querySelector("#iframe-width"),i=e.querySelector("#iframe-height");t==="inline"?(o.style.display="flex",a.value="100%",i.value="400px",n.formData.width="100%",n.formData.height="400px"):(o.style.display="none",n.formData.width="100%",n.formData.height="auto")}function Qm(e,t,r){const n=It(r);if(n.formData.width=t,n.formData.constrainProportions&&n.formData.selectedSize==="inline"){const o=parseFloat(t);if(!isNaN(o)){const a=o*9/16;n.formData.height=`${a}px`;const i=e.querySelector("#iframe-height");i&&(i.value=n.formData.height)}}}function ep(e,t,r){const n=It(r);if(n.formData.height=t,n.formData.constrainProportions&&n.formData.selectedSize==="inline"){const o=parseFloat(t);if(!isNaN(o)){const a=o*16/9;n.formData.width=`${a}px`;const i=e.querySelector("#iframe-width");i&&(i.value=n.formData.width)}}}function tp(e,t){const r=It(t);r.formData.constrainProportions=!r.formData.constrainProportions;const n=e.querySelector("#constrain-btn");n&&(n.textContent=r.formData.constrainProportions?"🔒":"🔓",n.className=`rte-constrain-btn ${r.formData.constrainProportions?"locked":"unlocked"}`,n.title=r.formData.constrainProportions?"Unlock proportions":"Lock proportions")}function rp(e,t){var f,p,g,m,h,b,y;const r=It(t),n=(f=e.querySelector("#iframe-src"))==null?void 0:f.value.trim();if(!n){alert("Please enter a source URL");return}if(!n.startsWith("https://")&&!n.startsWith("http://")){alert("Please enter a valid URL starting with https:// or http://");return}const o=(p=e.querySelector("#iframe-name"))==null?void 0:p.value.trim(),a=(g=e.querySelector("#iframe-title"))==null?void 0:g.value.trim(),i=(m=e.querySelector("#iframe-longdesc"))==null?void 0:m.value.trim(),l=(h=e.querySelector("#iframe-desc-url"))==null?void 0:h.value.trim(),s=((b=e.querySelector("#iframe-border"))==null?void 0:b.checked)??!0,c=((y=e.querySelector("#iframe-scrollbar"))==null?void 0:y.checked)??!0;let d=r.formData.width,u=r.formData.height;r.formData.selectedSize!=="inline"&&(d="100%",u="auto"),np(t,{src:n,width:d,height:u,aspectRatio:r.formData.selectedSize,name:o||void 0,title:a||void 0,longDescription:i||void 0,descriptionUrl:l||void 0,showBorder:s,enableScrollbar:c}),fo(t)}function np(e,t){const r=e.querySelector('[contenteditable="true"]');r&&(r.focus(),setTimeout(()=>{const n=[`src="${t.src}"`,`width="${t.width}"`,`height="${t.height}"`,"allowfullscreen",`frameborder="${t.showBorder?"1":"0"}"`,`scrolling="${t.enableScrollbar?"auto":"no"}"`];t.name&&n.push(`name="${t.name}"`),t.title&&n.push(`title="${t.title}"`),t.longDescription&&n.push(`longdesc="${t.longDescription}"`);const o=[];t.aspectRatio!=="inline"&&o.push(`rte-iframe-${t.aspectRatio}`);const a=o.length>0?`class="${o.join(" ")}"`:"",i=`data-aspect-ratio="${t.aspectRatio}"`,l=`<iframe ${n.join(" ")} ${a} ${i}></iframe>`;if(!document.execCommand("insertHTML",!1,l)){const c=window.getSelection();if(c&&c.rangeCount>0){const d=c.getRangeAt(0);d.deleteContents();const u=document.createElement("div");u.innerHTML=l;const f=document.createDocumentFragment();for(;u.firstChild;)f.appendChild(u.firstChild);d.insertNode(f)}}},10))}function fo(e){const t=It(e);t.escapeHandler&&(document.removeEventListener("keydown",t.escapeHandler,!0),t.escapeHandler=null),t.dialogElement&&(t.dialogElement.remove(),t.dialogElement=null)}function op(){if(document.getElementById("embed-iframe-dialog-styles"))return;const e=document.createElement("style");e.id="embed-iframe-dialog-styles",e.textContent=`
    /* Embed Iframe Dialog Styles */
    .embed-iframe-dialog {
      max-width: 600px;
      width: 100%;
    }

    .rte-vertical-tabs {
      display: flex;
      gap: 20px;
      min-height: 400px;
    }

    .rte-tab-buttons {
      display: flex;
      flex-direction: column;
      width: 120px;
      border-right: 1px solid #e1e5e9;
    }

    .rte-tab-button {
      padding: 12px 16px;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #666;
      border-right: 3px solid transparent;
      transition: all 0.2s ease;
    }

    .rte-tab-button:hover {
      background-color: #f8f9fa;
      color: #333;
    }

    .rte-tab-button.active {
      background-color: #e3f2fd;
      color: #1976d2;
      border-right-color: #1976d2;
      font-weight: 600;
    }

    .rte-tab-content {
      flex: 1;
      padding: 0 0 0 20px;
    }

    .rte-tab-panel {
      padding: 0;
    }

    .rte-form-group {
      margin-bottom: 16px;
    }

    .rte-form-label {
      display: block;
      margin-bottom: 6px;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .rte-form-textarea,
    .rte-form-input,
    .rte-form-select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.2s ease;
      box-sizing: border-box;
    }

    .rte-form-textarea:focus,
    .rte-form-input:focus,
    .rte-form-select:focus {
      outline: none;
      border-color: #0066cc;
      box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
    }

    .rte-form-textarea {
      resize: vertical;
      min-height: 80px;
      font-family: inherit;
    }

    .rte-form-row {
      display: flex;
      gap: 12px;
      align-items: flex-end;
    }

    .rte-form-row .rte-form-group {
      flex: 1;
    }

    .rte-form-row .constrain-group {
      flex: 0 0 auto;
      margin-bottom: 0;
    }

    .rte-constrain-btn {
      padding: 8px 12px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
      transition: all 0.2s ease;
      height: 38px;
      width: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rte-constrain-btn:hover {
      background-color: #f5f5f5;
      border-color: #1976d2;
    }

    .rte-constrain-btn.locked {
      background-color: #e3f2fd;
      border-color: #1976d2;
    }

    .rte-checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #333;
      cursor: pointer;
      padding: 4px 0;
    }

    .rte-checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #0066cc;
    }

    .rte-checkbox-label:hover {
      color: #000;
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-dialog-content {
      background: #1f2937;
      border: 1px solid #4b5563;
      color: #e2e8f0;
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.6);
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-dialog-header,
    .rte-embed-iframe-overlay.rte-theme-dark .rte-dialog-footer {
      background: #222d3a;
      border-color: #3b4657;
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-dialog-header h3,
    .rte-embed-iframe-overlay.rte-theme-dark .rte-form-label,
    .rte-embed-iframe-overlay.rte-theme-dark .rte-checkbox-label {
      color: #e2e8f0;
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-tab-buttons {
      border-right-color: #3b4657;
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-tab-button {
      color: #a8b5c8;
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-tab-button:hover {
      background: #334155;
      color: #f8fafc;
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-tab-button.active {
      background: rgba(88, 166, 255, 0.18);
      color: #8cc6ff;
      border-right-color: #58a6ff;
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-form-input,
    .rte-embed-iframe-overlay.rte-theme-dark .rte-form-select,
    .rte-embed-iframe-overlay.rte-theme-dark .rte-form-textarea {
      background: #111827;
      border-color: #4b5563;
      color: #e2e8f0;
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-form-input::placeholder,
    .rte-embed-iframe-overlay.rte-theme-dark .rte-form-textarea::placeholder {
      color: #94a3b8;
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-form-input:focus,
    .rte-embed-iframe-overlay.rte-theme-dark .rte-form-select:focus,
    .rte-embed-iframe-overlay.rte-theme-dark .rte-form-textarea:focus {
      border-color: #58a6ff;
      box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.28);
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-constrain-btn {
      background: #111827;
      border-color: #4b5563;
      color: #e2e8f0;
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-constrain-btn:hover {
      background: #334155;
      border-color: #58a6ff;
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-constrain-btn.locked {
      background: rgba(88, 166, 255, 0.22);
      border-color: #58a6ff;
      color: #d9ecff;
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-btn-secondary {
      background: #334155;
      border-color: #4b5563;
      color: #e2e8f0;
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-btn-secondary:hover {
      background: #475569;
      border-color: #64748b;
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-btn-primary {
      background: #3b82f6;
      color: #fff;
    }

    .rte-embed-iframe-overlay.rte-theme-dark .rte-btn-primary:hover {
      background: #2563eb;
    }

    /* Responsive iframe classes */
    .rte-iframe-21x9,
    .rte-iframe-16x9,
    .rte-iframe-4x3,
    .rte-iframe-1x1 {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
    }

    .rte-iframe-21x9 {
      padding-bottom: 42.857%;
    }

    .rte-iframe-16x9 {
      padding-bottom: 56.25%;
    }

    .rte-iframe-4x3 {
      padding-bottom: 75%;
    }

    .rte-iframe-1x1 {
      padding-bottom: 100%;
    }

    .rte-iframe-21x9 iframe,
    .rte-iframe-16x9 iframe,
    .rte-iframe-4x3 iframe,
    .rte-iframe-1x1 iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  `,document.head.appendChild(e)}const $t=new Set,_n='[data-theme="dark"], .dark, .editora-theme-dark';function ap(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function ip(){if(typeof window>"u"||window.__anchorObserverInitialized)return;window.__anchorObserverInitialized=!0,new MutationObserver(t=>{t.forEach(r=>{r.removedNodes.forEach(n=>{var o,a;if(n.nodeType===Node.ELEMENT_NODE){const i=n;if((o=i.classList)!=null&&o.contains("rte-anchor")){const s=i.id;s&&$t.delete(s)}const l=(a=i.querySelectorAll)==null?void 0:a.call(i,".rte-anchor");l==null||l.forEach(s=>{const c=s.id;c&&$t.delete(c)})}})})}).observe(document.body,{childList:!0,subtree:!0})}function Ds(e){return!e||e.trim().length===0?{valid:!1,error:"Anchor ID cannot be empty"}:e.length>256?{valid:!1,error:"Anchor ID must be less than 256 characters"}:/^[a-z_]/.test(e)?/^[a-z0-9\-_]+$/.test(e)?{valid:!0,error:""}:{valid:!1,error:"Anchor ID can only contain letters, numbers, hyphens, and underscores"}:{valid:!1,error:"Anchor ID must start with a letter or underscore"}}function lp(){const e=fd();if(!e)return;const t=md(e);if(!t)return;const r=t.querySelectorAll(".rte-anchor"),n=new Set;r.forEach(o=>{const a=o.id;a&&n.add(a)}),$t.clear(),n.forEach(o=>$t.add(o))}function sp(e){if(e){const n=e.startContainer,o=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement;if(o!=null&&o.closest(_n))return!0}const t=window.getSelection();if(t&&t.rangeCount>0){const n=t.getRangeAt(0).startContainer,o=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement;if(o!=null&&o.closest(_n))return!0}const r=document.activeElement;return r!=null&&r.closest(_n)?!0:document.body.matches(_n)||document.documentElement.matches(_n)}function cp(e,t,r,n){lp();const o=sp(n),a=o?{overlay:"rgba(0, 0, 0, 0.62)",dialogBg:"#1f2937",panelBg:"#222d3a",border:"#3b4657",text:"#e2e8f0",muted:"#94a3b8",closeHoverBg:"#334155",fieldBg:"#111827",fieldFocusBg:"#111827",fieldBorder:"#4b5563",fieldText:"#e2e8f0",fieldPlaceholder:"#94a3b8",fieldErrorBg:"#3f2124",fieldErrorBorder:"#ef4444",cancelBg:"#334155",cancelHover:"#475569",cancelText:"#e2e8f0",saveBg:"#3b82f6",saveHover:"#2563eb",saveDisabledBg:"#374151",saveDisabledText:"#7f8ca1",help:"#9fb0c6",focusRing:"rgba(88, 166, 255, 0.25)",errorRing:"rgba(239, 68, 68, 0.25)"}:{overlay:"rgba(0, 0, 0, 0.5)",dialogBg:"#ffffff",panelBg:"#f9f9f9",border:"#e0e0e0",text:"#333333",muted:"#999999",closeHoverBg:"#e0e0e0",fieldBg:"#ffffff",fieldFocusBg:"#f9f9ff",fieldBorder:"#d0d0d0",fieldText:"#333333",fieldPlaceholder:"#9ca3af",fieldErrorBg:"#ffebee",fieldErrorBorder:"#d32f2f",cancelBg:"#f0f0f0",cancelHover:"#e0e0e0",cancelText:"#333333",saveBg:"#0066cc",saveHover:"#0052a3",saveDisabledBg:"#d0d0d0",saveDisabledText:"#999999",help:"#999999",focusRing:"rgba(0, 102, 204, 0.1)",errorRing:"rgba(211, 47, 47, 0.1)"},i=document.createElement("div");i.className="rte-anchor-dialog-overlay",i.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${a.overlay};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  `;const l=document.createElement("div");if(l.className="rte-anchor-dialog",l.style.cssText=`
    background: ${a.dialogBg};
    border: 1px solid ${a.border};
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 450px;
    overflow: hidden;
    animation: rte-anchor-dialog-appear 0.2s ease;
  `,!document.getElementById("rte-anchor-dialog-styles")){const x=document.createElement("style");x.id="rte-anchor-dialog-styles",x.textContent=`
      @keyframes rte-anchor-dialog-appear {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .rte-anchor-dialog input:focus {
        outline: none !important;
      }
    `,document.head.appendChild(x)}let s="";const c=document.createElement("div");c.style.cssText=`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid ${a.border};
    background: ${a.panelBg};
  `;const d=document.createElement("h3");d.style.cssText=`margin: 0; font-size: 18px; font-weight: 600; color: ${a.text};`,d.textContent=e==="add"?"Add Anchor":"Edit Anchor";const u=document.createElement("button");u.textContent="✕",u.style.cssText=`
    background: none;
    border: none;
    font-size: 24px;
    color: ${a.muted};
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s ease;
  `,u.onmouseover=()=>{u.style.background=a.closeHoverBg,u.style.color="#f8fafc"},u.onmouseout=()=>{u.style.background="none",u.style.color=a.muted},c.appendChild(d),c.appendChild(u);const f=document.createElement("div");f.style.cssText="padding: 20px;";const p=document.createElement("div");p.style.cssText="margin-bottom: 0;";const g=document.createElement("label");g.textContent="Anchor ID",g.style.cssText=`display: block; font-size: 14px; font-weight: 500; color: ${a.text}; margin-bottom: 8px;`,g.setAttribute("for","anchor-id-input");const m=document.createElement("input");m.id="anchor-id-input",m.type="text",m.placeholder="e.g., section-introduction",m.value=t||"",m.style.cssText=`
    width: 100%;
    padding: 10px 12px;
    font-size: 14px;
    border: 1px solid ${a.fieldBorder};
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    color: ${a.fieldText};
    background: ${a.fieldBg};
    transition: all 0.2s ease;
    box-sizing: border-box;
  `,m.style.setProperty("caret-color",a.fieldText);const h=document.createElement("div");h.style.cssText=`
    color: #d32f2f;
    font-size: 12px;
    margin-top: 6px;
    display: none;
  `;const b=document.createElement("div");b.textContent="URL-safe ID (letters, numbers, hyphens, underscores). Must start with letter or underscore.",b.style.cssText=`color: ${a.help}; font-size: 12px; margin-top: 8px; line-height: 1.4;`,p.appendChild(g),p.appendChild(m),p.appendChild(h),p.appendChild(b),f.appendChild(p);const y=document.createElement("div");y.style.cssText=`
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    border-top: 1px solid ${a.border};
    background: ${a.panelBg};
    justify-content: flex-end;
  `;const E=document.createElement("button");E.textContent="Cancel",E.style.cssText=`
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${a.cancelBg};
    color: ${a.cancelText};
  `,E.onmouseover=()=>E.style.background=a.cancelHover,E.onmouseout=()=>E.style.background=a.cancelBg;const v=document.createElement("button");v.textContent=e==="add"?"Add Anchor":"Save Changes",v.style.cssText=`
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${a.saveBg};
    color: white;
  `,v.disabled=!m.value.trim();const C=()=>{m.value.trim()?(v.disabled=!1,v.style.background=a.saveBg,v.style.color="white",v.style.cursor="pointer"):(v.disabled=!0,v.style.background=a.saveDisabledBg,v.style.color=a.saveDisabledText,v.style.cursor="not-allowed")};v.onmouseover=()=>{v.disabled||(v.style.background=a.saveHover,v.style.boxShadow=o?"0 2px 8px rgba(59, 130, 246, 0.35)":"0 2px 8px rgba(0, 102, 204, 0.3)")},v.onmouseout=()=>{v.disabled||(v.style.background=a.saveBg,v.style.boxShadow="none")},y.appendChild(E),y.appendChild(v),m.oninput=()=>{const x=m.value;if(C(),x.trim()){const w=Ds(x);w.valid?e==="add"&&$t.has(x)?(s=`Anchor ID already exists: ${x}`,h.textContent="⚠ "+s,h.style.display="block",m.style.borderColor=a.fieldErrorBorder,m.style.background=a.fieldErrorBg):e==="edit"&&x!==t&&$t.has(x)?(s=`Anchor ID already exists: ${x}`,h.textContent="⚠ "+s,h.style.display="block",m.style.borderColor=a.fieldErrorBorder,m.style.background=a.fieldErrorBg):(s="",h.style.display="none",m.style.borderColor=a.fieldBorder,m.style.background=a.fieldBg):(s=w.error,h.textContent="⚠ "+s,h.style.display="block",m.style.borderColor=a.fieldErrorBorder,m.style.background=a.fieldErrorBg)}else h.style.display="none",m.style.borderColor=a.fieldBorder,m.style.background=a.fieldBg},m.onfocus=()=>{m.style.borderColor=s?a.fieldErrorBorder:a.saveBg,m.style.boxShadow=s?`0 0 0 3px ${a.errorRing}`:`0 0 0 3px ${a.focusRing}`,m.style.background=s?a.fieldErrorBg:a.fieldFocusBg},m.onblur=()=>{m.style.boxShadow="none",s||(m.style.background=a.fieldBg)};const T=()=>{const x=m.value.trim();!x||!Ds(x).valid||e==="add"&&$t.has(x)||e==="edit"&&x!==t&&$t.has(x)||(r&&r(x),i.remove())},k=()=>{i.remove()};v.onclick=T,E.onclick=k,u.onclick=k,m.onkeydown=x=>{x.key==="Enter"?(x.preventDefault(),T()):x.key==="Escape"&&(x.preventDefault(),k())},i.onclick=x=>{x.target===i&&k()},l.appendChild(c),l.appendChild(f),l.appendChild(y),i.appendChild(l),document.body.appendChild(i),setTimeout(()=>m.focus(),100)}function dp(e,t){let r;if(t)r=t;else{const s=window.getSelection();if(!s||s.rangeCount===0)return;r=s.getRangeAt(0)}let n=null,o=r.startContainer;for(;o&&o!==document.body;){if(o.nodeType===Node.ELEMENT_NODE){const s=o;if(s.getAttribute("contenteditable")==="true"){n=s;break}}o=o.parentNode}const a=(n==null?void 0:n.innerHTML)??"",i=document.createElement("span");i.id=e,i.className="rte-anchor",i.setAttribute("data-type","anchor"),i.setAttribute("data-anchor-id",e),i.setAttribute("title",`Anchor: ${e}`),i.style.cssText=`
    display: inline;
    position: relative;
    cursor: pointer;
  `,r.insertNode(i),$t.add(e),r.setStart(i.nextSibling||i.parentNode,0),r.collapse(!0);const l=window.getSelection();if(l&&(l.removeAllRanges(),l.addRange(r)),n)ap(n,a),n.dispatchEvent(new Event("input",{bubbles:!0}));else{const s=fd();if(s){const c=md(s);c&&c.dispatchEvent(new Event("input",{bubbles:!0}))}}xd()}function xd(){if(document.getElementById("rte-anchor-styles"))return;const e=document.createElement("style");e.id="rte-anchor-styles",e.textContent=`
    .rte-anchor {
      display: inline;
      position: relative;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .rte-anchor:hover::before {
      content: '⚓';
      position: absolute;
      top: -1.2em;
      left: 0;
      background: #333;
      color: #fff;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.8em;
      white-space: nowrap;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .rte-anchor:hover::after {
      content: attr(data-anchor-id);
      position: absolute;
      top: -1.2em;
      left: 1.4em;
      background: #333;
      color: #fff;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.75em;
      font-family: 'Courier New', monospace;
      white-space: nowrap;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    [contenteditable='true'] .rte-anchor::before {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      background: #0066cc;
      border-radius: 50%;
      top: -3px;
      left: 0;
      opacity: 0.5;
      transition: opacity 0.2s ease;
    }
    
    [contenteditable='true'] .rte-anchor:hover::before {
      opacity: 1;
      width: auto;
      height: auto;
      background: #333;
      border-radius: 3px;
      top: -1.2em;
      padding: 2px 6px;
      font-size: 0.8em;
      content: '⚓';
    }
    
    @media print {
      .rte-anchor::before,
      .rte-anchor::after {
        display: none;
      }
      .rte-anchor {
        cursor: auto;
      }
    }
    
    .rte-anchor:focus {
      outline: 2px solid #0066cc;
      outline-offset: 2px;
    }
  `,document.head.appendChild(e)}const up=()=>(typeof window<"u"&&(ip(),xd()),{name:"anchor",toolbar:[{label:"Anchor",command:"insertAnchor",icon:'<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 8.4C13.4912 8.4 14.7 7.19117 14.7 5.7C14.7 4.20883 13.4912 3 12 3C10.5088 3 9.3 4.20883 9.3 5.7C9.3 7.19117 10.5088 8.4 12 8.4ZM12 8.4V20.9999M12 20.9999C9.61305 20.9999 7.32387 20.0518 5.63604 18.364C3.94821 16.6761 3 14.3869 3 12H5M12 20.9999C14.3869 20.9999 16.6761 20.0518 18.364 18.364C20.0518 16.6761 21 14.3869 21 12H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',shortcut:"Mod-Shift-k"}],commands:{insertAnchor:()=>{try{const e=window.getSelection();if(!e||e.rangeCount===0)return alert("Please place your cursor where you want to insert the anchor."),!1;const t=e.getRangeAt(0).cloneRange();return cp("add","",r=>{dp(r,t)},t),!0}catch(e){return console.error("Failed to insert anchor:",e),!1}}},keymap:{"Mod-Shift-k":"insertAnchor"}}),vt=".rte-content, .editora-content",fp="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",wn='.rte-mention[data-mention="true"]',ar=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',Fa=new WeakMap,Va=new WeakMap;let Hs=!1,Ka=!1,Zn=null,Wo=0;function vd(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function kd(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function Nt(e,t){const r=window.getSelection();r&&(r.removeAllRanges(),r.addRange(t),e.focus({preventScroll:!0}))}function hi(e,t){return e.startContainer===t.startContainer&&e.startOffset===t.startOffset&&e.endContainer===t.endContainer&&e.endOffset===t.endOffset}function pr(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);return e.contains(r.commonAncestorContainer)?r.cloneRange():null}function mo(e){Array.from(e.querySelectorAll(wn)).forEach(r=>{r.setAttribute("data-mention","true"),r.setAttribute("contenteditable","false"),r.setAttribute("spellcheck","false"),r.setAttribute("draggable","false"),r.classList.add("rte-mention")})}function Is(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function mp(e){return e.closest(fp)||e}function Uo(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function pp(e){const t=mp(e);if(Uo(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return Uo(r)?!0:Uo(document.documentElement)||Uo(document.body)}function wd(e,t){e.classList.remove("rte-mention-theme-dark"),pp(t)&&e.classList.add("rte-mention-theme-dark")}function gp(e){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const n=e.editorElement;if(n.matches(vt))return n;const o=n.querySelector(vt);if(o instanceof HTMLElement)return o}const t=window.getSelection();if(t&&t.rangeCount>0){const n=t.getRangeAt(0).startContainer,o=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement,a=o==null?void 0:o.closest(vt);if(a)return a}const r=document.activeElement;if(r){if(r.matches(vt))return r;const n=r.closest(vt);if(n)return n}return document.querySelector(vt)}function Lr(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function _l(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function bp(e,t){return t?t.split(".").filter(Boolean).reduce((r,n)=>{if(!(!_l(r)&&!Array.isArray(r)))return r[n]},e):e}function hp(e){return e?/\s|[([{"'`]/.test(e):!0}function yp(e){if(!e.collapsed)return null;const t=e.startContainer,r=e.startOffset;if(t.nodeType===Node.TEXT_NODE){const n=t;return{node:n,textBefore:n.data.slice(0,r),caretOffset:r}}if(t.nodeType===Node.ELEMENT_NODE){const n=t;if(r>0){const o=n.childNodes[r-1];if(o&&o.nodeType===Node.TEXT_NODE){const a=o;return{node:a,textBefore:a.data,caretOffset:a.length}}}}return null}function xp(e,t,r){let n=-1,o="";if(t.forEach(i=>{const l=e.lastIndexOf(i);l>n&&(n=l,o=i)}),n<0||!hp(e[n-1]))return null;const a=e.slice(n+1);return/\s/.test(a)||a.length>r?null:{trigger:o,query:a,startOffset:n}}function vp(e,t){const r=t.cloneRange();r.collapse(!1);const n=r.getClientRects();if(n.length>0)return n[n.length-1];const o=document.createElement("span");o.textContent="​",o.style.position="relative",r.insertNode(o);const a=o.getBoundingClientRect();return o.remove(),e.normalize(),a}function kp(e,t){if(e.panel&&e.list)return;const r=document.createElement("div");r.className="rte-mention-panel",r.style.display="none";const n=document.createElement("div");n.className="rte-mention-list",r.appendChild(n),document.body.appendChild(r),wd(r,e.editor),e.panel=r,e.list=n,r.addEventListener("mousedown",o=>{o.preventDefault()}),r.addEventListener("click",o=>{const a=o.target;if(!a)return;const i=a.closest(".rte-mention-item");if(!i)return;const l=Number(i.getAttribute("data-index"));Number.isFinite(l)&&Cd(e,t,l)})}function et(e){e.panel&&(e.debounceHandle!==null&&(window.clearTimeout(e.debounceHandle),e.debounceHandle=null),e.abortController&&(e.abortController.abort(),e.abortController=null),e.panel.style.display="none",e.panel.classList.remove("show"),e.isOpen=!1,e.loading=!1,e.items=[],e.activeIndex=0,e.query="",e.replaceRange=null)}function Bs(e,t){if(!e.panel)return;wd(e.panel,e.editor);const r=vp(e.editor,t),n=e.panel;n.style.display="block",n.classList.add("show"),n.style.left="0px",n.style.top="0px";const o=n.getBoundingClientRect(),a=window.innerWidth,i=window.innerHeight;let l=Math.max(8,Math.min(r.left,a-o.width-8)),s=r.bottom+8;s+o.height>i-8&&(s=Math.max(8,r.top-o.height-8)),n.style.position="fixed",n.style.left=`${l}px`,n.style.top=`${s}px`}function wp(e,t){if(!t)return Lr(e);const r=e.toLowerCase(),n=t.toLowerCase(),o=r.indexOf(n);if(o<0)return Lr(e);const a=Lr(e.slice(0,o)),i=Lr(e.slice(o,o+t.length)),l=Lr(e.slice(o+t.length));return`${a}<mark>${i}</mark>${l}`}function Ps(e,t){if(!e.list)return;const r=e.list;if(r.innerHTML="",e.loading){const n=document.createElement("div");n.className="rte-mention-empty",n.textContent=t.loadingText,r.appendChild(n);return}if(e.items.length===0){const n=document.createElement("div");n.className="rte-mention-empty",n.textContent=e.query.length>0?t.noResultsText:t.emptyStateText,r.appendChild(n);return}e.items.forEach((n,o)=>{const a=document.createElement("button");a.type="button",a.className="rte-mention-item",o===e.activeIndex&&a.classList.add("active"),a.setAttribute("data-index",String(o));const i=t.itemRenderer?t.itemRenderer(n,e.query):`<span class="rte-mention-item-label">${wp(n.label,e.query)}</span>${n.meta?`<span class="rte-mention-item-meta">${Lr(n.meta)}</span>`:""}`;a.innerHTML=i,r.appendChild(a)})}function Ed(e,t){const r=new Set,n=[];return e.forEach(o=>{const a=(o.id||"").trim();!a||r.has(a)||(r.add(a),n.push({id:a,label:o.label||a,value:o.value,meta:o.meta}))}),n.slice(0,t)}function Ep(e,t){if(e.buildRequest){const d=e.buildRequest(t);return{url:d.url,init:d.init||{}}}const r=(e.method||"GET").toUpperCase(),n=typeof e.headers=="function"?e.headers(t):e.headers||{},o=e.queryParam||"q",a=e.triggerParam||"trigger",i=e.limitParam||"limit",l=e.staticParams||{},s={method:r,headers:{...n},credentials:e.credentials,mode:e.mode,cache:e.cache,signal:t.signal},c=new URL(e.url,window.location.origin);if(r==="GET"||r==="HEAD"){const d=new URLSearchParams(c.search);Object.entries(l).forEach(([u,f])=>d.set(u,String(f))),d.set(o,t.query),d.set(a,t.trigger),d.set(i,String(t.limit)),c.search=d.toString()}else{const d=typeof e.body=="function"?e.body(t):e.body,u={[o]:t.query,[a]:t.trigger,[i]:t.limit,...l},f=d??u;if(_l(f)){s.body=JSON.stringify(f);const p=s.headers;!p["Content-Type"]&&!p["content-type"]&&(p["Content-Type"]="application/json")}else s.body=f}return{url:c.toString(),init:s}}async function Cp(e,t,r,n){var c;const o=t.api;if(!o)return[];e.abortController&&e.abortController.abort();const a=new AbortController;e.abortController=a;const i={query:r,trigger:n,limit:t.maxSuggestions,signal:a.signal},l=Math.max(0,o.timeoutMs??1e4);let s=null;l>0&&(s=window.setTimeout(()=>a.abort(),l));try{const{url:d,init:u}=Ep(o,i),f=await fetch(d,{...u,signal:a.signal});if(!f.ok)throw new Error(`Mention API request failed: ${f.status}`);const g=(o.responseType||"json")==="text"?await f.text():await f.json();let m=[];if(o.transformResponse)m=o.transformResponse(g,i)||[];else{const h=bp(g,o.responsePath);m=(Array.isArray(h)?h:Array.isArray(g)?g:[]).map((y,E)=>{if(o.mapItem)return o.mapItem(y,E);if(!_l(y))return null;const v=String(y.id??y.value??y.key??"").trim();if(!v)return null;const C=String(y.label??y.name??v).trim();return{id:v,label:C,value:y.value?String(y.value):void 0,meta:y.meta?String(y.meta):void 0}}).filter(y=>!!y)}return Ed(m,t.maxSuggestions)}catch(d){return(d==null?void 0:d.name)!=="AbortError"&&((c=o.onError)==null||c.call(o,d,i)),[]}finally{s!==null&&window.clearTimeout(s),e.abortController===a&&(e.abortController=null)}}async function Sp(e,t,r,n){const o=++e.requestId;let a=[];if(t.search){const i=await t.search(r,n);a=Array.isArray(i)?i:[]}else if(t.api)a=await Cp(e,t,r,n);else{const i=r.toLowerCase();a=t.items.filter(l=>i?l.label.toLowerCase().includes(i)||l.id.toLowerCase().includes(i):!0)}return o!==e.requestId?[]:Ed(a,t.maxSuggestions)}function Tp(e,t,r){const n=e.editor;if(mo(n),!window.getSelection())return!1;const a=n.innerHTML;let i=e.replaceRange?e.replaceRange.cloneRange():pr(n);if(!i||!n.contains(i.commonAncestorContainer)&&(i=pr(n),!i))return!1;const l=yi(n,i.cloneRange(),"after");hi(l,i)||(Nt(n,l),i=l),i.deleteContents();const s=document.createElement("span");s.className="rte-mention",s.setAttribute("data-mention","true"),s.setAttribute("data-mention-id",r.id),s.setAttribute("contenteditable","false"),s.textContent=r.value||`${e.trigger}${r.label}`,i.insertNode(s);let c=s,d=1;if(t.insertSpaceAfterMention){const f=document.createTextNode(" ");s.after(f),c=f,d=1}const u=document.createRange();return u.setStart(c,d),u.collapse(!0),Nt(n,u),et(e),mo(n),kd(n),vd(n,a),!0}function Cd(e,t,r){if(r<0||r>=e.items.length)return;const n=e.items[r];Tp(e,t,n)}function $p(e){return e.startContainer!==e.endContainer||e.startContainer.nodeType!==Node.ELEMENT_NODE||e.endOffset-e.startOffset!==1?null:e.startContainer.childNodes[e.startOffset]||null}function Lp(e,t){const r=$p(e);return!(r instanceof HTMLElement)||!r.matches(wn)||!t.contains(r)?null:r}function Sd(e,t){const r=Lp(e,t);if(r)return r;const n=Is(e.startContainer),o=n==null?void 0:n.closest(wn);if(o&&t.contains(o))return o;const a=Is(e.endContainer),i=a==null?void 0:a.closest(wn);return i&&t.contains(i)?i:null}function yi(e,t,r="after"){const n=Sd(t,e);if(!n)return t;const o=document.createRange();return r==="before"?o.setStartBefore(n):o.setStartAfter(n),o.collapse(!0),o}function Os(e,t,r="after"){const n=document.createRange();r==="before"?n.setStartBefore(t):n.setStartAfter(t),n.collapse(!0),Nt(e,n)}function Ap(e,t,r){if(!e.collapsed)return null;const n=e.startContainer,o=e.startOffset;let a=null;if(n.nodeType===Node.TEXT_NODE){const i=n;t==="backward"&&o===0?a=i.previousSibling:t==="forward"&&o===i.length&&(a=i.nextSibling)}else if(n.nodeType===Node.ELEMENT_NODE){const i=n;t==="backward"&&o>0?a=i.childNodes[o-1]||null:t==="forward"&&o<i.childNodes.length&&(a=i.childNodes[o]||null)}return!(a instanceof HTMLElement)||!a.matches(wn)||!r.contains(a)?null:a}function zs(e,t){const r=pr(e);if(!r)return!1;const n=Ap(r,t,e);if(!n)return!1;const o=n.parentNode;if(!o)return!1;const a=e.innerHTML,i=Array.prototype.indexOf.call(o.childNodes,n);n.remove();const l=document.createRange();return l.setStart(o,Math.max(0,i)),l.collapse(!0),Nt(e,l),kd(e),vd(e,a),!0}function Td(e,t,r,n,o,a){if(kp(e,t),e.query=n,e.trigger=o,e.replaceRange=a.cloneRange(),e.loading=!!(t.api&&!t.search),e.debounceHandle!==null&&(window.clearTimeout(e.debounceHandle),e.debounceHandle=null),!e.panel)return;e.isOpen||(e.panel.style.display="block",e.panel.classList.add("show"),e.isOpen=!0),Ps(e,t),Bs(e,r);const i=()=>{e.debounceHandle=null,Sp(e,t,n,o).then(s=>{e.loading=!1,e.items=s,e.activeIndex=0,e.panel&&(Ps(e,t),Bs(e,r))})},l=t.api&&!t.search?Math.max(0,t.api.debounceMs??180):0;l>0?e.debounceHandle=window.setTimeout(i,l):i()}function Mp(e,t){const r=e.editor;mo(r);let n=pr(r);if(!n||!n.collapsed){et(e);return}const o=yi(r,n.cloneRange(),"after");if(!hi(o,n)){Nt(r,o),n=o,et(e);return}const a=yp(n);if(!a){et(e);return}const i=xp(a.textBefore,t.triggerChars,t.maxQueryLength);if(!i){et(e);return}if(i.query.length<t.minChars){et(e);return}const l=n.cloneRange();l.setStart(a.node,i.startOffset),l.setEnd(a.node,a.caretOffset),Td(e,t,n,i.query,i.trigger,l)}function _s(e,t){if(e.items.length===0)return;const r=e.items.length;if(e.activeIndex=((e.activeIndex+t)%r+r)%r,!e.list)return;const n=Array.from(e.list.querySelectorAll(".rte-mention-item"));n.forEach((a,i)=>a.classList.toggle("active",i===e.activeIndex));const o=n[e.activeIndex];o==null||o.scrollIntoView({block:"nearest"})}function Rp(e){return{editor:e,panel:null,list:null,replaceRange:null,items:[],activeIndex:0,query:"",trigger:"@",loading:!1,isOpen:!1,requestId:0,debounceHandle:null,abortController:null}}function Np(e){var r;const t=Fa.get(e);t&&((r=t.panel)!=null&&r.parentNode&&t.panel.parentNode.removeChild(t.panel),Fa.delete(e))}function sl(e,t,r){if(Va.has(e))return;mo(e);const n={beforeInput:o=>{mo(e);const a=pr(e);if(!a)return;const i=Sd(a,e);if(!i)return;const l=o.inputType||"";if(l.startsWith("insert")){if(o.preventDefault(),Os(e,i,"after"),l==="insertParagraph"||l==="insertLineBreak"){const s=l==="insertLineBreak"?"insertLineBreak":"insertParagraph";document.execCommand(s,!1);return}if(l==="insertText"||l==="insertCompositionText"){const s=o.data||"";if(!s)return;document.execCommand("insertText",!1,s)}}},input:()=>{Mp(t,r)},keydown:o=>{if(t.isOpen){if(o.key==="ArrowDown"){o.preventDefault(),_s(t,1);return}if(o.key==="ArrowUp"){o.preventDefault(),_s(t,-1);return}if(o.key==="Enter"||o.key==="Tab"){o.preventDefault(),Cd(t,r,t.activeIndex);return}if(o.key==="Escape"){o.preventDefault(),et(t);return}}const a=pr(e);if(a){const i=yi(e,a.cloneRange(),"after");if(!hi(i,a)){if(o.key==="Enter"){o.preventDefault(),Nt(e,i),document.execCommand("insertParagraph",!1);return}o.key.length===1&&!o.metaKey&&!o.ctrlKey&&!o.altKey&&Nt(e,i)}}if(o.key==="Backspace"&&zs(e,"backward")){o.preventDefault();return}if(o.key==="Delete"&&zs(e,"forward")){o.preventDefault();return}},click:o=>{const a=o.target;if(!a)return;const i=a.nodeType===Node.ELEMENT_NODE?a:a.parentElement,l=i==null?void 0:i.closest(wn);!l||!e.contains(l)||(o.preventDefault(),o.stopPropagation(),Os(e,l,"after"),et(t))},blur:()=>{window.setTimeout(()=>{const o=document.activeElement;t.panel&&o&&t.panel.contains(o)||et(t)},0)},mousedown:o=>{if(!t.isOpen||!t.panel)return;const a=o.target;a&&!t.panel.contains(a)&&!e.contains(a)&&et(t)}};e.addEventListener("beforeinput",n.beforeInput),e.addEventListener("input",n.input),e.addEventListener("keydown",n.keydown),e.addEventListener("click",n.click),e.addEventListener("blur",n.blur),document.addEventListener("mousedown",n.mousedown,!0),Va.set(e,n)}function Dp(e){const t=Va.get(e);t&&(e.removeEventListener("beforeinput",t.beforeInput),e.removeEventListener("input",t.input),e.removeEventListener("keydown",t.keydown),e.removeEventListener("click",t.click),e.removeEventListener("blur",t.blur),document.removeEventListener("mousedown",t.mousedown,!0),Va.delete(e))}function Hp(){if(Hs||typeof document>"u")return;Hs=!0;const e=document.createElement("style");e.id="rte-mention-plugin-styles",e.textContent=`
    .rte-mention {
      display: inline-block;
      padding: 0 6px;
      margin: 0 1px;
      border-radius: 10px;
      background: #e8f0ff;
      color: #1d4ed8;
      font-weight: 600;
      line-height: 1.6;
      white-space: nowrap;
      cursor: pointer;
    }

    .rte-mention-panel {
      width: min(320px, calc(100vw - 16px));
      max-height: min(320px, calc(100vh - 32px));
      overflow: hidden;
      border: 1px solid #d9dfeb;
      border-radius: 3px;
      background: #ffffff;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.2);
      z-index: 2147483646;
    }

    .rte-mention-list {
      max-height: min(300px, calc(100vh - 56px));
      overflow: auto;
      padding: 0px;
    }

    .rte-mention-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border: none;
      background: transparent;
      padding: 10px 12px;
      border-radius: 0px;
      color: #0f172a;
      text-align: left;
      cursor: pointer;
      font: inherit;
    }

    .rte-mention-item:hover,
    .rte-mention-item.active {
      background: #eff6ff;
      color: #1d4ed8;
    }

    .rte-mention-item-label mark {
      background: rgba(59, 130, 246, 0.16);
      color: inherit;
      padding: 0 2px;
      border-radius: 3px;
    }

    .rte-mention-item-meta {
      font-size: 12px;
      color: #64748b;
      white-space: nowrap;
    }

    .rte-mention-empty {
      padding: 12px;
      color: #64748b;
      font-size: 13px;
      text-align: center;
    }

    ${ar} .rte-mention {
      background: rgba(37, 99, 235, 0.25);
      color: #bfdbfe;
    }

    ${ar} .rte-mention-panel,
    .rte-mention-panel.rte-mention-theme-dark {
      border-color: #364152;
      background: #1f2937;
      box-shadow: 0 22px 44px rgba(0, 0, 0, 0.48);
    }

    ${ar} .rte-mention-item,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-item {
      color: #e5e7eb;
    }

    ${ar} .rte-mention-item:hover,
    ${ar} .rte-mention-item.active,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-item:hover,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-item.active {
      background: #334155;
      color: #bfdbfe;
    }

    ${ar} .rte-mention-item-meta,
    ${ar} .rte-mention-empty,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-item-meta,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-empty {
      color: #9ca3af;
    }
  `,document.head.appendChild(e)}function Ip(e){const t=(e.triggerChars||["@"]).filter(r=>typeof r=="string"&&r.length>0).map(r=>r[0]);return{triggerChars:t.length>0?t:["@"],minChars:Math.max(0,e.minChars??1),maxQueryLength:Math.max(1,e.maxQueryLength??32),maxSuggestions:Math.max(1,e.maxSuggestions??8),items:e.items||[{id:"john.doe",label:"John Doe",meta:"john@acme.com"},{id:"sarah.lee",label:"Sarah Lee",meta:"sarah@acme.com"},{id:"alex.chen",label:"Alex Chen",meta:"alex@acme.com"}],api:e.api,search:e.search,itemRenderer:e.itemRenderer,emptyStateText:e.emptyStateText||"Type to search mentions",noResultsText:e.noResultsText||"No matching mentions",loadingText:e.loadingText||"Loading...",insertSpaceAfterMention:e.insertSpaceAfterMention!==!1}}function Ea(e){const t=Fa.get(e);if(t)return t;const r=Rp(e);return Fa.set(e,r),r}function Bp(e){Ka||(Ka=!0,Zn=t=>{const r=t.target;if(!(r instanceof Node))return;const n=r.nodeType===Node.ELEMENT_NODE?r:r.parentElement,o=(n==null?void 0:n.closest(vt))||null;if(!o)return;const a=Ea(o);sl(o,a,e)},document.addEventListener("focusin",Zn,!0))}function Pp(){!Ka||!Zn||(document.removeEventListener("focusin",Zn,!0),Ka=!1,Zn=null)}const Op=(e={})=>{Hp();const t=Ip(e);return{name:"mentions",toolbar:[{label:"Mention",command:"insertMention",icon:'<svg width="24" height="24" focusable="false"><path d="M12.1 4a7.9 7.9 0 0 0-8 8c0 4.4 3.6 8 8 8 1.6 0 3-.4 4.4-1.3.4-.3.5-.9.2-1.3a1 1 0 0 0-1.3-.3 6 6 0 0 1-3.3.9 6 6 0 1 1 6-6v1.6c0 .8-.5 1.4-1.2 1.4-.8 0-1.2-.6-1.2-1.4V12c0-2-1.6-3.5-3.7-3.5s-3.8 1.6-3.8 3.6c0 2 1.7 3.6 3.8 3.6 1 0 1.9-.4 2.6-1 .5 1 1.4 1.6 2.5 1.6 1.8 0 3.2-1.5 3.2-3.4V12A7.9 7.9 0 0 0 12 4Zm0 9.7c-1 0-1.8-.8-1.8-1.7s.8-1.7 1.8-1.7c1 0 1.7.8 1.7 1.7s-.8 1.7-1.7 1.7Z"></path></svg>'}],commands:{insertMention:(r,n)=>{const o=gp(n);if(!o)return!1;const a=Ea(o);sl(o,a,t);let i=pr(o);i||(i=document.createRange(),i.selectNodeContents(o),i.collapse(!1),Nt(o,i));const l=yi(o,i.cloneRange(),"after");hi(l,i)||(Nt(o,l),i=l),a.query="";const s=i.cloneRange();return a.trigger=t.triggerChars[0],Td(a,t,i,"",a.trigger,s),!0}},init:()=>{Wo+=1,Bp(t),Array.from(document.querySelectorAll(vt)).forEach(n=>{const o=Ea(n);sl(n,o,t)})},destroy:()=>{Wo=Math.max(0,Wo-1),Array.from(document.querySelectorAll(vt)).forEach(n=>{et(Ea(n)),Dp(n),Np(n)}),Wo===0&&Pp()}}},zt=".rte-content, .editora-content",Z='[data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark',U="rte-version-diff-overlay",qs="rte-version-diff-styles",zp={title:"Version Diff",baseline:"Baseline",current:"Current",noChanges:"No changes detected between baseline and current content.",loading:"Preparing diff...",tabInline:"Inline Diff",tabSideBySide:"Side by Side",refresh:"Refresh",setBaseline:"Set Current as Baseline",close:"Close",mode:"Mode",ignoreWhitespace:"Ignore whitespace",largeDocFallback:"Large document fallback mode applied for performance."},gr=new WeakMap,Wa=new WeakMap;let Go=0,Pr=null,Yn=null,cl=null,Or=null,zr=null,_r=null;function re(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function _p(e){return{...zp,...e||{}}}function dl(e,t=!0){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const o=e.editorElement;if(o.matches(zt))return o;const a=o.querySelector(zt);if(a instanceof HTMLElement)return a}const r=window.getSelection();if(r&&r.rangeCount>0){const o=r.getRangeAt(0).startContainer,a=o.nodeType===Node.ELEMENT_NODE?o:o.parentElement,i=a==null?void 0:a.closest(zt);if(i)return i}const n=document.activeElement;if(n){if(n.matches(zt))return n;const o=n.closest(zt);if(o)return o}return _r&&_r.isConnected?_r:t?document.querySelector(zt):null}function ql(e){return e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||e}function Zo(e){if(!e)return!1;const t=e.getAttribute("data-theme")||e.getAttribute("theme");if(t&&t.toLowerCase()==="dark")return!0;const r=e.classList;return r.contains("dark")||r.contains("editora-theme-dark")||r.contains("rte-theme-dark")}function js(e){const t=ql(e);if(Zo(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return!!(Zo(r)||Zo(document.documentElement)||Zo(document.body))}function qp(e){const t=document.createElement("textarea");return t.innerHTML=e,t.value}function jl(e){const r=ql(e).getAttribute("data-initial-content");return r?qp(r):e.innerHTML}function $d(e){return e.replace(/\r\n?/g,`
`)}function Fs(e){const t=document.createElement("div"),r=e.replace(/<br\s*\/?>/gi,`
`).replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|tr|blockquote|pre|section|article)>/gi,`$&
`);t.innerHTML=r;const n=t.textContent||"";return $d(n).replace(/\u00a0/g," ").replace(/\n{3,}/g,`

`).trim()}function Vs(e,t,r){let n=$d(e);if(r&&(n=n.replace(/[ \t]+/g," ").replace(/\n{3,}/g,`

`).trim()),!n)return[];if(t==="line")return n.split(`
`);if(r)return n.split(/\s+/).filter(Boolean);const o=[],a=n.split(`
`);return a.forEach((i,l)=>{const s=i.split(/[ \t]+/).filter(Boolean);o.push(...s),l<a.length-1&&o.push(`
`)}),o}function jp(e,t,r){if(e.length===0)return"";if(t==="line")return e.join(`
`);if(r)return e.join(" ");let n="";for(let o=0;o<e.length;o+=1){const a=e[o];if(a===`
`){n=n.replace(/[ \t]+$/g,""),n+=`
`;continue}n.length>0&&!n.endsWith(`
`)&&(n+=" "),n+=a}return n}function Fp(e,t,r){const n=[];return e.forEach(o=>{const a=n[n.length-1];if(a&&a.type===o.type){a.tokens.push(o.token);return}n.push({type:o.type,tokens:[o.token]})}),n.map(o=>({type:o.type,value:jp(o.tokens,t,r),count:o.tokens.length}))}function Vp(e,t){let r=0;for(;r<e.length&&r<t.length&&e[r]===t[r];)r+=1;let n=e.length-1,o=t.length-1;for(;n>=r&&o>=r&&e[n]===t[o];)n-=1,o-=1;const a=e.slice(0,r),i=n<e.length-1?e.slice(n+1):[],l=r<=n?e.slice(r,n+1):[],s=r<=o?t.slice(r,o+1):[];return{prefix:a,suffix:i,aMiddle:l,bMiddle:s}}function Kp(e,t,r,n,o,a){if(e.length===0&&t.length===0)return{segments:[],insertedCount:0,deletedCount:0,equalCount:0,usedFallback:!1};const{prefix:i,suffix:l,aMiddle:s,bMiddle:c}=Vp(e,t);let d=[];i.forEach(b=>d.push({type:"equal",token:b}));const u=s.length*c.length,f=s.length>a||c.length>a||u>o;if(f)s.forEach(b=>d.push({type:"delete",token:b})),c.forEach(b=>d.push({type:"insert",token:b}));else{const b=Array.from({length:s.length+1},()=>new Uint32Array(c.length+1));for(let v=s.length-1;v>=0;v-=1){const C=b[v],T=b[v+1];for(let k=c.length-1;k>=0;k-=1)C[k]=s[v]===c[k]?T[k+1]+1:Math.max(T[k],C[k+1])}let y=0,E=0;for(;y<s.length&&E<c.length;)s[y]===c[E]?(d.push({type:"equal",token:s[y]}),y+=1,E+=1):b[y+1][E]>=b[y][E+1]?(d.push({type:"delete",token:s[y]}),y+=1):(d.push({type:"insert",token:c[E]}),E+=1);for(;y<s.length;)d.push({type:"delete",token:s[y]}),y+=1;for(;E<c.length;)d.push({type:"insert",token:c[E]}),E+=1}l.forEach(b=>d.push({type:"equal",token:b}));const p=Fp(d,r,n);let g=0,m=0,h=0;return p.forEach(b=>{b.type==="insert"&&(g+=b.count),b.type==="delete"&&(m+=b.count),b.type==="equal"&&(h+=b.count)}),{segments:p,insertedCount:g,deletedCount:m,equalCount:h,usedFallback:f}}function Ld(e){return re(e.value).replace(/\n/g,`
`)}function Wp(e,t){return e.length===0?`<p class="rte-version-diff-empty">${re(t.noChanges)}</p>`:e.map(r=>`<span class="${r.type==="equal"?"rte-version-diff-equal":r.type==="insert"?"rte-version-diff-insert":"rte-version-diff-delete"}">${Ld(r)}</span>`).join("")}function Up(e,t){if(e.length===0){const o=`<p class="rte-version-diff-empty">${re(t.noChanges)}</p>`;return{baselineHtml:o,currentHtml:o}}const r=[],n=[];return e.forEach(o=>{const a=Ld(o);if(o.type==="equal"){r.push(`<span class="rte-version-diff-equal">${a}</span>`),n.push(`<span class="rte-version-diff-equal">${a}</span>`);return}if(o.type==="delete"){r.push(`<span class="rte-version-diff-delete">${a}</span>`);return}n.push(`<span class="rte-version-diff-insert">${a}</span>`)}),{baselineHtml:r.join(""),currentHtml:n.join("")}}function Gp(e){const t=e.metaKey||e.ctrlKey,n=(typeof e.key=="string"?e.key:"").toLowerCase(),o=typeof e.code=="string"?e.code.toLowerCase():"",a=t&&e.altKey&&!e.shiftKey&&(n==="d"||o==="keyd"),i=!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&(n==="f8"||o==="f8");return a||i}function Zp(){if(typeof document>"u"||document.getElementById(qs))return;const e=document.createElement("style");e.id=qs,e.textContent=`
    .${U} {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.55);
      z-index: 2147483646;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .rte-version-diff-dialog {
      width: min(980px, 96vw);
      max-height: min(90vh, 860px);
      background: #ffffff;
      color: #0f172a;
      border: 1px solid #d7dee8;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 24px 48px rgba(15, 23, 42, 0.3);
      overflow: hidden;
    }

    .rte-version-diff-header,
    .rte-version-diff-footer {
      padding: 12px 14px;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .rte-version-diff-footer {
      border-top: 1px solid #e2e8f0;
      border-bottom: none;
      justify-content: space-between;
    }

    .rte-version-diff-title {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      flex: 1;
    }

    .rte-version-diff-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .rte-version-diff-select,
    .rte-version-diff-btn {
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      border-radius: 6px;
      min-height: 34px;
      padding: 6px 10px;
      font-size: 13px;
      cursor: pointer;
    }

    .rte-version-diff-btn:hover,
    .rte-version-diff-btn:focus-visible,
    .rte-version-diff-select:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .rte-version-diff-btn-primary {
      background: #2563eb;
      border-color: #2563eb;
      color: #ffffff;
    }

    .rte-version-diff-btn-primary:hover {
      background: #1d4ed8;
    }

    .rte-version-diff-close-btn {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      min-height: 34px;
      min-width: 34px;
      width: 34px;
      height: 34px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      color: #0f172a;
      font-size: 16px;
      line-height: 1;
      font-weight: 600;
    }

    .rte-version-diff-close-btn:hover,
    .rte-version-diff-close-btn:focus-visible {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      background: #ffffff;
      outline: none;
    }

    .rte-version-diff-tabs {
      display: flex;
      gap: 6px;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
      padding: 8px 14px;
    }

    .rte-version-diff-tab {
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      border-radius: 6px;
      min-height: 32px;
      padding: 4px 10px;
      font-size: 13px;
      cursor: pointer;
    }

    .rte-version-diff-tab[aria-selected="true"] {
      background: #dbeafe;
      border-color: #60a5fa;
      color: #1e3a8a;
    }

    .rte-version-diff-body {
      flex: 1;
      overflow: auto;
      padding: 10px 14px 14px;
      background: #ffffff;
    }

    .rte-version-diff-summary {
      font-size: 12px;
      color: #475569;
      margin-bottom: 10px;
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
    }

    .rte-version-diff-panel {
      display: none;
    }

    .rte-version-diff-panel.active {
      display: block;
    }

    .rte-version-diff-inline,
    .rte-version-diff-side-pane {
      border: 1px solid #dbe3ec;
      border-radius: 6px;
      padding: 10px;
      min-height: 140px;
      max-height: 50vh;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 12px;
      line-height: 1.5;
      background: #ffffff;
    }

    .rte-version-diff-side-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .rte-version-diff-pane-title {
      margin: 0 0 6px;
      font-size: 12px;
      font-weight: 700;
      color: #334155;
    }

    .rte-version-diff-equal { color: inherit; }
    .rte-version-diff-insert {
      background: rgba(22, 163, 74, 0.18);
      color: #14532d;
      border-radius: 2px;
    }
    .rte-version-diff-delete {
      background: rgba(220, 38, 38, 0.18);
      color: #7f1d1d;
      text-decoration: line-through;
      border-radius: 2px;
    }

    .rte-version-diff-empty {
      margin: 0;
      color: #64748b;
      font-size: 13px;
    }

    ${Z} .rte-version-diff-dialog,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-dialog {
      background: #1f2937;
      color: #e5e7eb;
      border-color: #334155;
    }

    ${Z} .rte-version-diff-header,
    ${Z} .rte-version-diff-footer,
    ${Z} .rte-version-diff-tabs,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-header,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-footer,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-tabs {
      background: #111827;
      border-color: #334155;
    }

    ${Z} .rte-version-diff-body,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-body {
      background: #1f2937;
    }

    ${Z} .rte-version-diff-select,
    ${Z} .rte-version-diff-btn,
    ${Z} .rte-version-diff-tab,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-select,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-btn,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-tab {
      background: #0f172a;
      color: #e5e7eb;
      border-color: #475569;
    }

    ${Z} .rte-version-diff-close-btn,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-close-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    ${Z} .rte-version-diff-close-btn:hover,
    ${Z} .rte-version-diff-close-btn:focus-visible,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-close-btn:hover,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-close-btn:focus-visible {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.24);
      outline: none;
    }

    ${Z} .rte-version-diff-tab[aria-selected="true"],
    .${U}.rte-version-diff-theme-dark .rte-version-diff-tab[aria-selected="true"] {
      background: #1e3a8a;
      border-color: #3b82f6;
      color: #dbeafe;
    }

    ${Z} .rte-version-diff-inline,
    ${Z} .rte-version-diff-side-pane,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-inline,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-side-pane {
      background: #0f172a;
      border-color: #334155;
      color: #e5e7eb;
    }

    ${Z} .rte-version-diff-pane-title,
    ${Z} .rte-version-diff-summary,
    ${Z} .rte-version-diff-empty,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-pane-title,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-summary,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-empty {
      color: #94a3b8;
    }

    ${Z} .rte-version-diff-insert,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-insert {
      background: rgba(22, 163, 74, 0.25);
      color: #bbf7d0;
    }

    ${Z} .rte-version-diff-delete,
    .${U}.rte-version-diff-theme-dark .rte-version-diff-delete {
      background: rgba(220, 38, 38, 0.25);
      color: #fecaca;
    }
    :is(${Z}) .rte-toolbar-item .rte-toolbar-button[data-command="openVersionDiff"] svg{
      fill: none;
    }
  `,document.head.appendChild(e)}async function Yp(e,t,r){if(r!=null)return r;if(typeof t.getBaselineHtml=="function"){const a=ql(e),i=await Promise.resolve(t.getBaselineHtml({editor:e,editorRoot:a}));if(typeof i=="string")return i}const n=gr.get(e);if(typeof n=="string")return n;if(typeof t.baselineHtml=="string")return t.baselineHtml;const o=jl(e);return gr.set(e,o),o}function Xp(e){const t=e.querySelector('button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');t==null||t.focus()}function Jp(e,t){if(e.key!=="Tab")return;const r=Array.from(t.querySelectorAll('button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(i=>!i.hasAttribute("disabled"));if(r.length===0)return;const n=r[0],o=r[r.length-1],a=document.activeElement;e.shiftKey&&a===n?(e.preventDefault(),o.focus()):!e.shiftKey&&a===o&&(e.preventDefault(),n.focus())}function Ad(){Yn&&(Yn(),Yn=null)}function Ks(e){!e||gr.has(e)||gr.set(e,jl(e))}function Qp(e){return{baselineHtml:e.baselineHtml,getBaselineHtml:e.getBaselineHtml,mode:e.mode||"word",ignoreWhitespace:e.ignoreWhitespace!==!1,maxTokens:Math.max(200,e.maxTokens??1200),maxMatrixSize:Math.max(5e4,e.maxMatrixSize??1e6),labels:_p(e.labels)}}function Md(e,t,r){Ad(),_r=e,Wa.set(e,t);const n=document.createElement("div");n.className=U,js(e)&&n.classList.add("rte-version-diff-theme-dark");const o=document.createElement("section");o.className="rte-version-diff-dialog",o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.setAttribute("aria-labelledby","rte-version-diff-title");const a=t.labels;let i=(r==null?void 0:r.mode)||t.mode,l=(r==null?void 0:r.ignoreWhitespace)??t.ignoreWhitespace,s="inline";o.innerHTML=`
    <header class="rte-version-diff-header">
      <h2 id="rte-version-diff-title" class="rte-version-diff-title">${re(a.title)}</h2>
      <div class="rte-version-diff-controls">
        <label>
          <span>${re(a.mode)}:</span>
          <select class="rte-version-diff-select" aria-label="${re(a.mode)}">
            <option value="word">Word</option>
            <option value="line">Line</option>
          </select>
        </label>
        <label class="rte-version-diff-checkbox">
          <input type="checkbox" class="rte-version-diff-ignore-ws" ${l?"checked":""}>
          ${re(a.ignoreWhitespace)}
        </label>
        <button type="button" class="rte-version-diff-btn rte-version-diff-set-baseline" aria-label="${re(a.setBaseline)}">${re(a.setBaseline)}</button>
        <button type="button" class="rte-version-diff-btn" data-action="refresh" aria-label="${re(a.refresh)}">${re(a.refresh)}</button>
        <button type="button" class="rte-version-diff-btn rte-version-diff-close-btn" data-action="close" aria-label="${re(a.close)}">✕</button>
      </div>
    </header>

    <div class="rte-version-diff-tabs" role="tablist" aria-label="Diff views">
      <button type="button" role="tab" class="rte-version-diff-tab" data-tab="inline" aria-selected="true">${re(a.tabInline)}</button>
      <button type="button" role="tab" class="rte-version-diff-tab" data-tab="side" aria-selected="false">${re(a.tabSideBySide)}</button>
    </div>

    <main class="rte-version-diff-body">
      <div class="rte-version-diff-summary" aria-live="polite"></div>
      <section class="rte-version-diff-panel active" data-panel="inline" role="tabpanel">
        <div class="rte-version-diff-inline" aria-label="Inline diff result"></div>
      </section>
      <section class="rte-version-diff-panel" data-panel="side" role="tabpanel">
        <div class="rte-version-diff-side-grid">
          <div>
            <h3 class="rte-version-diff-pane-title">${re(a.baseline)}</h3>
            <div class="rte-version-diff-side-pane" data-side="baseline" aria-label="${re(a.baseline)}"></div>
          </div>
          <div>
            <h3 class="rte-version-diff-pane-title">${re(a.current)}</h3>
            <div class="rte-version-diff-side-pane" data-side="current" aria-label="${re(a.current)}"></div>
          </div>
        </div>
      </section>
    </main>

    <footer class="rte-version-diff-footer">
      <small>Shortcut: Ctrl/Cmd + Alt + D (fallback: F8)</small>
      <small>Esc: close</small>
    </footer>
  `,n.appendChild(o),document.body.appendChild(n);const c=o.querySelector(".rte-version-diff-select");c.value=i;const d=o.querySelector(".rte-version-diff-ignore-ws"),u=o.querySelector(".rte-version-diff-summary"),f=o.querySelector(".rte-version-diff-inline"),p=o.querySelector('[data-side="baseline"]'),g=o.querySelector('[data-side="current"]');let m=0;const h=()=>{const x=`<p class="rte-version-diff-empty">${re(a.loading)}</p>`;f.innerHTML=x,p.innerHTML=x,g.innerHTML=x,u.textContent=""},b=async x=>{m+=1;const w=m;n.classList.toggle("rte-version-diff-theme-dark",js(e)),h();const I=e.innerHTML;let z="";try{z=await Yp(e,t,x??(r==null?void 0:r.baselineHtml))}catch{z=gr.get(e)??jl(e)}if(w!==m||!n.isConnected)return;const He=Fs(z),Ie=Fs(I),or=Vs(He,i,l),$=Vs(Ie,i,l),M=Kp(or,$,i,l,t.maxMatrixSize,t.maxTokens),te=Up(M.segments,a);f.innerHTML=Wp(M.segments,a),p.innerHTML=te.baselineHtml,g.innerHTML=te.currentHtml;const V=[`+${M.insertedCount} inserted`,`-${M.deletedCount} deleted`,`${M.equalCount} unchanged`];M.usedFallback&&V.push(a.largeDocFallback),u.textContent=V.join(" | ")},y=x=>{s=x,o.querySelectorAll(".rte-version-diff-tab").forEach(w=>{const I=w.getAttribute("data-tab")===x;w.setAttribute("aria-selected",I?"true":"false"),w.tabIndex=I?0:-1}),o.querySelectorAll(".rte-version-diff-panel").forEach(w=>{w.classList.toggle("active",w.getAttribute("data-panel")===x)})},E=()=>{n.removeEventListener("keydown",T,!0),n.removeEventListener("click",C),document.removeEventListener("keydown",v,!0),n.parentNode&&n.parentNode.removeChild(n),Yn=null,e.focus({preventScroll:!0})},v=x=>{x.key==="Escape"&&(x.preventDefault(),x.stopPropagation(),E())},C=x=>{x.target===n&&E()},T=x=>{if(x.key==="Escape"){x.preventDefault(),E();return}if(Jp(x,o),x.target&&x.target.classList.contains("rte-version-diff-tab")&&(x.key==="ArrowRight"||x.key==="ArrowLeft")){x.preventDefault();const w=s==="inline"?"side":"inline";y(w);const I=o.querySelector(`.rte-version-diff-tab[data-tab="${w}"]`);I==null||I.focus()}};o.addEventListener("click",x=>{const w=x.target,I=w.getAttribute("data-action");if(I==="close"){E();return}if(I==="refresh"){b();return}const z=w.getAttribute("data-tab");(z==="inline"||z==="side")&&y(z)}),c.addEventListener("change",()=>{i=c.value==="line"?"line":"word",b()}),d.addEventListener("change",()=>{l=d.checked,b()}),o.querySelector(".rte-version-diff-set-baseline").addEventListener("click",()=>{gr.set(e,e.innerHTML),b(e.innerHTML)}),n.addEventListener("keydown",T,!0),n.addEventListener("click",C),document.addEventListener("keydown",v,!0),Yn=E,Xp(o),b()}function eg(e){cl=e,!Pr&&(Pr=t=>{if(!Gp(t))return;if(document.querySelector(`.${U}`)){t.preventDefault();return}const r=t.target;if(!!(r!=null&&r.closest("input, textarea, select")))return;const o=dl(void 0,!1);if(!o||o.getAttribute("contenteditable")==="false")return;t.preventDefault(),t.stopPropagation();const a=Wa.get(o)||cl||e;Md(o,a)},document.addEventListener("keydown",Pr,!0))}function tg(){Pr&&(document.removeEventListener("keydown",Pr,!0),Pr=null,cl=null)}function rg(){Or||(Or=e=>{const t=e.target,r=t==null?void 0:t.closest(zt);r&&(_r=r,Ks(r))},document.addEventListener("focusin",Or,!0)),zr||(zr=e=>{const r=e.target,n=r==null?void 0:r.closest(zt);n&&n.getAttribute("contenteditable")!=="false"&&(_r=n,Ks(n))},document.addEventListener("beforeinput",zr,!0))}function ng(){Or&&(document.removeEventListener("focusin",Or,!0),Or=null),zr&&(document.removeEventListener("beforeinput",zr,!0),zr=null)}const og=(e={})=>{const t=Qp(e);return Zp(),{name:"versionDiff",toolbar:[{id:"versionDiff",label:"Version Diff",command:"openVersionDiff",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="3.5" y="4.5" width="7" height="15" rx="1.5" stroke="currentColor" stroke-width="1.8"></rect><rect x="13.5" y="4.5" width="7" height="15" rx="1.5" stroke="currentColor" stroke-width="1.8"></rect><path d="M5.5 12h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><path d="M15.5 12h3m-1.5-1.5v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>'}],commands:{openVersionDiff:(r,n)=>{const o=dl(n);return o?(Wa.set(o,t),Md(o,t,r),!0):!1},setVersionDiffBaseline:(r,n)=>{const o=dl(n);if(!o)return!1;Wa.set(o,t);const a=typeof r=="string"?r:typeof(r==null?void 0:r.html)=="string"?r.html:o.innerHTML;return gr.set(o,a),!0}},keymap:{"Mod-Alt-d":"openVersionDiff","Mod-Alt-D":"openVersionDiff",F8:"openVersionDiff"},init:()=>{Go+=1,eg(t),rg()},destroy:()=>{Go=Math.max(0,Go-1),Go===0&&(Ad(),tg(),ng())}}},Xe=".rte-content, .editora-content",Gt='.rte-conditional-block[data-conditional-content="true"]',F=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',_=':is([data-theme="acme"], .editora-theme-acme, .rte-theme-acme)',Y=":is(.rte-content.rte-conditional-theme-dark, .editora-content.rte-conditional-theme-dark)",X=":is(.rte-content.rte-conditional-theme-acme, .editora-content.rte-conditional-theme-acme)",Ws="rte-conditional-content-styles",S="rte-conditional-dialog-overlay",B="rte-conditional-floating-toolbar",gt=new WeakMap,ul=new WeakMap,ce=new WeakMap,br=new Map,hr=new Map;let Xn=null,Yo=0,qr=null,jr=null,Fr=null,Vr=null,Kr=null,Wr=null,qt=null,J=null,Ur=null;const ag={dialogTitleInsert:"Insert Conditional Content",dialogTitleEdit:"Edit Conditional Content",conditionLabel:"Condition",conditionPlaceholder:'user.role == "admin"',audienceLabel:"Audience (comma separated)",audiencePlaceholder:"all",localeLabel:"Locale (comma separated)",localePlaceholder:"all",elseLabel:"Enable Else Block",saveText:"Save",cancelText:"Cancel",blockIfLabel:"IF",blockElseLabel:"ELSE",allAudiencesText:"all audiences",allLocalesText:"all locales"};function ne(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function er(e){return e?e.split(",").map(t=>t.trim()).filter(Boolean):[]}function Us(e){return!e||e.length===0?"":e.join(", ")}function En(e){return e?e.map(t=>t.trim()).filter(Boolean):[]}function ig(e){return{...ag,...e||{}}}function Et(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function Ho(e){return e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||e}function Xo(e){if(!e)return!1;const t=e.getAttribute("data-theme")||e.getAttribute("theme");return t&&t.toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark")}function lg(e){const t=Ho(e);if(Xo(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return Xo(r)?!0:Xo(document.documentElement)||Xo(document.body)}function Jo(e){if(!e)return!1;const t=e.getAttribute("data-theme")||e.getAttribute("theme");return t&&t.toLowerCase()==="acme"?!0:e.classList.contains("editora-theme-acme")||e.classList.contains("rte-theme-acme")}function sg(e){const t=Ho(e);if(Jo(t))return!0;const r=t.closest("[data-theme], [theme], .editora-theme-acme, .rte-theme-acme");return Jo(r)?!0:Jo(document.documentElement)||Jo(document.body)}function cg(e){return lg(e)?"dark":sg(e)?"acme":"light"}function xi(e,t){const r=cg(t);e.classList.remove("rte-conditional-theme-dark","rte-conditional-theme-acme"),r==="dark"?e.classList.add("rte-conditional-theme-dark"):r==="acme"&&e.classList.add("rte-conditional-theme-acme")}function ut(e,t=!0){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const o=e.editorElement;if(o.matches(Xe))return o;const a=o.querySelector(Xe);if(a instanceof HTMLElement)return a}const r=window.getSelection();if(r&&r.rangeCount>0){const o=r.getRangeAt(0).startContainer,a=o.nodeType===Node.ELEMENT_NODE?o:o.parentElement,i=a==null?void 0:a.closest(Xe);if(i)return i}const n=document.activeElement;if(n){if(n.matches(Xe))return n;const o=n.closest(Xe);if(o)return o}return J&&J.isConnected?J:t?document.querySelector(Xe):null}function Rd(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);return e.contains(r.commonAncestorContainer)?r.cloneRange():null}function Fl(e,t){const r=window.getSelection();r&&(r.removeAllRanges(),r.addRange(t),e.focus({preventScroll:!0}))}function Nd(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function Dd(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function Ua(e,t){const r=document.createRange();r.selectNodeContents(t),r.collapse(!1),Fl(e,r)}function Ki(e,t){if(t)return t.split(".").filter(Boolean).reduce((r,n)=>{if(r!=null&&typeof r=="object")return r[n]},e)}function dg(e){const t=e.trim();if(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))return t.slice(1,-1);if(t==="true")return!0;if(t==="false")return!1;if(t==="null")return null;const r=Number(t);if(!Number.isNaN(r)&&t!=="")return r;if(t.startsWith("[")&&t.endsWith("]")||t.startsWith("{")&&t.endsWith("}"))try{return JSON.parse(t)}catch{return t}return t}function ug(e,t){const r=e.trim();if(!r)return!0;if(r.startsWith("!")){const c=r.slice(1).trim();return!Ki(t,c)}const n=r.match(/^([a-zA-Z_$][\w.$]*)\s*(==|!=|>=|<=|>|<|in|contains|~=)\s*(.+)$/);if(!n)return!!Ki(t,r);const[,o,a,i]=n,l=Ki(t,o),s=dg(i);switch(a){case"==":return l==s;case"!=":return l!=s;case">":return Number(l)>Number(s);case"<":return Number(l)<Number(s);case">=":return Number(l)>=Number(s);case"<=":return Number(l)<=Number(s);case"in":return Array.isArray(s)?s.some(c=>c==l):typeof s=="string"?s.split(",").map(c=>c.trim()).includes(String(l)):!1;case"contains":case"~=":return Array.isArray(l)?l.some(c=>String(c).toLowerCase()===String(s).toLowerCase()):typeof l=="string"?l.toLowerCase().includes(String(s).toLowerCase()):!1;default:return!1}}function fg(){if(typeof document>"u"||document.getElementById(Ws))return;const e=document.createElement("style");e.id=Ws,e.textContent=`
    .rte-conditional-block {
      border: 1px solid #dbe3ec;
      border-radius: 8px;
      margin: 10px 0;
      background: #f8fafc;
      overflow: hidden;
    }

    .rte-conditional-header,
    .rte-conditional-else-label {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #eef2f7;
      border-bottom: 1px solid #dbe3ec;
      padding: 8px 10px;
      user-select: none;
    }

    .rte-conditional-else-label {
      border-top: 1px solid #dbe3ec;
      border-bottom: 1px solid #dbe3ec;
    }

    .rte-conditional-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 34px;
      height: 20px;
      border-radius: 999px;
      border: 1px solid #bfdbfe;
      background: #dbeafe;
      color: #1e3a8a;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      padding: 0 7px;
      flex: 0 0 auto;
    }

    .rte-conditional-chip-else {
      border-color: #fecaca;
      background: #fee2e2;
      color: #991b1b;
    }

    .rte-conditional-summary {
      font-size: 12px;
      color: #0f172a;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }

    .rte-conditional-meta {
      font-size: 11px;
      color: #64748b;
      white-space: nowrap;
      flex: 0 0 auto;
    }

    .rte-conditional-body {
      padding: 10px;
      background: #ffffff;
      min-height: 44px;
    }

    .rte-conditional-hidden {
      display: none !important;
    }

    .rte-toolbar-group-items.conditional-content,
    .editora-toolbar-group-items.conditional-content {
      display: flex;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #ffffff;
    }

    .rte-toolbar-group-items.conditional-content .rte-toolbar-item,
    .editora-toolbar-group-items.conditional-content .editora-toolbar-item {
      display: flex;
    }

    .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    .editora-toolbar-group-items.conditional-content .editora-toolbar-button {
      border: none;
      border-right: 1px solid #cbd5e1;
      border-radius: 0;
    }

    .rte-toolbar-group-items.conditional-content .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.conditional-content .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    .rte-toolbar-button[data-command="toggleConditionalPreview"].active,
    .editora-toolbar-button[data-command="toggleConditionalPreview"].active {
      background: #ccc;
    }

    .rte-conditional-block.rte-conditional-preview {
      border-style: dashed;
    }

    .rte-conditional-block.rte-conditional-preview .rte-conditional-body[contenteditable="false"] {
      cursor: default;
    }

    .${S} {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.5);
      z-index: 2147483646;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .rte-conditional-dialog {
      width: min(560px, 96vw);
      max-height: min(88vh, 760px);
      border: 1px solid #dbe3ec;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0 24px 50px rgba(15, 23, 42, 0.25);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .rte-conditional-dialog-header,
    .rte-conditional-dialog-footer {
      padding: 12px 14px;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .rte-conditional-dialog-footer {
      border-top: 1px solid #e2e8f0;
      border-bottom: none;
      justify-content: flex-end;
    }

    .rte-conditional-dialog-title {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }

    .rte-conditional-dialog-body {
      padding: 14px;
      overflow: auto;
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .rte-conditional-field {
      display: grid;
      gap: 6px;
    }

    .rte-conditional-field label {
      font-size: 12px;
      font-weight: 600;
      color: #334155;
    }

    .rte-conditional-field input[type="text"] {
      width: 100%;
      min-height: 36px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 13px;
      line-height: 1.4;
      box-sizing: border-box;
      color: #0f172a;
      background: #ffffff;
    }

    .rte-conditional-field input[type="text"]:focus-visible,
    .rte-conditional-btn:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .rte-conditional-checkbox {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #334155;
      min-height: 36px;
    }

    .rte-conditional-help {
      margin: 0;
      font-size: 12px;
      color: #64748b;
    }

    .rte-conditional-btn {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      min-height: 34px;
      padding: 6px 12px;
      background: #ffffff;
      color: #0f172a;
      font-size: 13px;
      cursor: pointer;
    }

    .rte-conditional-btn-primary {
      border-color: #2563eb;
      background: #2563eb;
      color: #ffffff;
    }

    .rte-conditional-btn-primary:hover {
      background: #1d4ed8;
    }

    .${B} {
      position: fixed;
      z-index: 2147483645;
      display: none;
      align-items: center;
      gap: 6px;
      padding: 6px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: rgba(255, 255, 255, 0.98);
      box-shadow: 0 14px 30px rgba(15, 23, 42, 0.2);
      backdrop-filter: blur(6px);
    }

    .${B}.show {
      display: inline-flex;
    }

    .${B} .rte-conditional-float-btn {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      min-height: 30px;
      min-width: 30px;
      padding: 0 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: #ffffff;
      color: #0f172a;
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
    }

    .${B} .rte-conditional-float-btn:hover {
      background: #f8fafc;
    }

    .${B} .rte-conditional-float-btn[data-action="delete"] {
      border-color: #fecaca;
      color: #991b1b;
      background: #fff5f5;
    }

    .rte-conditional-preview-on ${Gt} {
      border-width: 2px;
    }

    .rte-conditional-preview-on ${Gt} .rte-conditional-header {
      background: #ecfeff;
      border-color: #bae6fd;
    }

    ${F} .rte-conditional-block,
    ${Y} .rte-conditional-block,
    .${S}.rte-conditional-theme-dark .rte-conditional-block {
      background: #111827;
      border-color: #334155;
    }

    ${F} .rte-conditional-header,
    ${F} .rte-conditional-else-label,
    ${Y} .rte-conditional-header,
    ${Y} .rte-conditional-else-label,
    .${S}.rte-conditional-theme-dark .rte-conditional-header,
    .${S}.rte-conditional-theme-dark .rte-conditional-else-label {
      background: #0f172a;
      border-color: #334155;
    }

    ${F} .rte-conditional-summary,
    ${Y} .rte-conditional-summary,
    .${S}.rte-conditional-theme-dark .rte-conditional-summary {
      color: #e2e8f0;
    }

    ${F} .rte-conditional-meta,
    ${Y} .rte-conditional-meta,
    .${S}.rte-conditional-theme-dark .rte-conditional-meta {
      color: #94a3b8;
    }

    ${F} .rte-conditional-chip,
    ${Y} .rte-conditional-chip,
    .${S}.rte-conditional-theme-dark .rte-conditional-chip {
      background: #1e3a8a;
      border-color: #3b82f6;
      color: #dbeafe;
    }

    ${F} .rte-conditional-chip-else,
    ${Y} .rte-conditional-chip-else,
    .${S}.rte-conditional-theme-dark .rte-conditional-chip-else {
      background: #7f1d1d;
      border-color: #ef4444;
      color: #fee2e2;
    }

    ${F} .rte-conditional-body,
    ${Y} .rte-conditional-body,
    .${S}.rte-conditional-theme-dark .rte-conditional-body {
      background: #1f2937;
      color: #e2e8f0;
    }

    ${F} .rte-conditional-dialog,
    ${Y} .rte-conditional-dialog,
    .${S}.rte-conditional-theme-dark .rte-conditional-dialog {
      background: #1f2937;
      border-color: #334155;
    }

    ${F} .rte-conditional-dialog-header,
    ${F} .rte-conditional-dialog-footer,
    ${Y} .rte-conditional-dialog-header,
    ${Y} .rte-conditional-dialog-footer,
    .${S}.rte-conditional-theme-dark .rte-conditional-dialog-header,
    .${S}.rte-conditional-theme-dark .rte-conditional-dialog-footer {
      background: #111827;
      border-color: #334155;
    }

    ${F} .rte-conditional-dialog-title,
    ${F} .rte-conditional-field label,
    ${F} .rte-conditional-checkbox,
    ${Y} .rte-conditional-dialog-title,
    ${Y} .rte-conditional-field label,
    ${Y} .rte-conditional-checkbox,
    .${S}.rte-conditional-theme-dark .rte-conditional-dialog-title,
    .${S}.rte-conditional-theme-dark .rte-conditional-field label,
    .${S}.rte-conditional-theme-dark .rte-conditional-checkbox {
      color: #e2e8f0;
    }

    ${F} .rte-conditional-help,
    ${Y} .rte-conditional-help,
    .${S}.rte-conditional-theme-dark .rte-conditional-help {
      color: #94a3b8;
    }

    ${F} .rte-conditional-field input[type="text"],
    ${F} .rte-conditional-btn,
    ${Y} .rte-conditional-field input[type="text"],
    ${Y} .rte-conditional-btn,
    .${S}.rte-conditional-theme-dark .rte-conditional-field input[type="text"],
    .${S}.rte-conditional-theme-dark .rte-conditional-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    ${F} .rte-conditional-btn-primary,
    ${Y} .rte-conditional-btn-primary,
    .${S}.rte-conditional-theme-dark .rte-conditional-btn-primary {
      border-color: #3b82f6;
      background: #2563eb;
      color: #ffffff;
    }

    ${F} .rte-toolbar-group-items.conditional-content,
    .${S}.rte-conditional-theme-dark .rte-toolbar-group-items.conditional-content,
    ${Y} .rte-toolbar-group-items.conditional-content,
    ${F} .editora-toolbar-group-items.conditional-content {
      border-color: #566275;
    }

    ${F} .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    ${Y} .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    ${F} .editora-toolbar-group-items.conditional-content .editora-toolbar-button {
      border-right-color: #566275;
    }

    ${F} .${B},
    .${S}.rte-conditional-theme-dark .${B},
    .${B}.rte-conditional-theme-dark {
      background: rgba(17, 24, 39, 0.98);
      border-color: #334155;
      box-shadow: 0 14px 30px rgba(2, 6, 23, 0.5);
    }

    ${F} .${B} .rte-conditional-float-btn,
    .${S}.rte-conditional-theme-dark .${B} .rte-conditional-float-btn,
    .${B}.rte-conditional-theme-dark .rte-conditional-float-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    ${F} .${B} .rte-conditional-float-btn[data-action="delete"],
    .${S}.rte-conditional-theme-dark .${B} .rte-conditional-float-btn[data-action="delete"],
    .${B}.rte-conditional-theme-dark .rte-conditional-float-btn[data-action="delete"] {
      border-color: #ef4444;
      color: #fecaca;
      background: rgba(127, 29, 29, 0.45);
    }

    ${_} .rte-conditional-block,
    ${X} .rte-conditional-block,
    .${S}.rte-conditional-theme-acme .rte-conditional-block {
      background: #f8fbff;
      border-color: #cbd8e8;
    }

    ${_} .rte-conditional-header,
    ${_} .rte-conditional-else-label,
    ${X} .rte-conditional-header,
    ${X} .rte-conditional-else-label,
    .${S}.rte-conditional-theme-acme .rte-conditional-header,
    .${S}.rte-conditional-theme-acme .rte-conditional-else-label {
      background: linear-gradient(180deg, #eef4fb 0%, #e6eef8 100%);
      border-color: #cbd8e8;
    }

    ${_} .rte-conditional-summary,
    ${X} .rte-conditional-summary,
    .${S}.rte-conditional-theme-acme .rte-conditional-summary {
      color: #0f172a;
    }

    ${_} .rte-conditional-meta,
    ${X} .rte-conditional-meta,
    .${S}.rte-conditional-theme-acme .rte-conditional-meta {
      color: #587089;
    }

    ${_} .rte-conditional-chip,
    ${X} .rte-conditional-chip,
    .${S}.rte-conditional-theme-acme .rte-conditional-chip {
      background: #d9f5ee;
      border-color: #66c6b3;
      color: #0f4f4a;
    }

    ${_} .rte-conditional-chip-else,
    ${X} .rte-conditional-chip-else,
    .${S}.rte-conditional-theme-acme .rte-conditional-chip-else {
      background: #fde8ea;
      border-color: #f1a7b2;
      color: #8b1f2f;
    }

    ${_} .rte-conditional-body,
    ${X} .rte-conditional-body,
    .${S}.rte-conditional-theme-acme .rte-conditional-body {
      background: #fcfeff;
      color: #0f172a;
    }

    ${_} .rte-conditional-dialog,
    ${X} .rte-conditional-dialog,
    .${S}.rte-conditional-theme-acme .rte-conditional-dialog {
      background: #ffffff;
      border-color: #cbd8e8;
      box-shadow: 0 20px 44px rgba(15, 23, 42, 0.18);
    }

    ${_} .rte-conditional-dialog-header,
    ${_} .rte-conditional-dialog-footer,
    ${X} .rte-conditional-dialog-header,
    ${X} .rte-conditional-dialog-footer,
    .${S}.rte-conditional-theme-acme .rte-conditional-dialog-header,
    .${S}.rte-conditional-theme-acme .rte-conditional-dialog-footer {
      background: #f3f8fd;
      border-color: #d8e4f1;
    }

    ${_} .rte-conditional-dialog-title,
    ${_} .rte-conditional-field label,
    ${_} .rte-conditional-checkbox,
    ${X} .rte-conditional-dialog-title,
    ${X} .rte-conditional-field label,
    ${X} .rte-conditional-checkbox,
    .${S}.rte-conditional-theme-acme .rte-conditional-dialog-title,
    .${S}.rte-conditional-theme-acme .rte-conditional-field label,
    .${S}.rte-conditional-theme-acme .rte-conditional-checkbox {
      color: #1f334a;
    }

    ${_} .rte-conditional-help,
    ${X} .rte-conditional-help,
    .${S}.rte-conditional-theme-acme .rte-conditional-help {
      color: #5f738d;
    }

    ${_} .rte-conditional-field input[type="text"],
    ${_} .rte-conditional-btn,
    ${X} .rte-conditional-field input[type="text"],
    ${X} .rte-conditional-btn,
    .${S}.rte-conditional-theme-acme .rte-conditional-field input[type="text"],
    .${S}.rte-conditional-theme-acme .rte-conditional-btn {
      background: #ffffff;
      border-color: #bfd0e2;
      color: #0f172a;
    }

    ${_} .rte-conditional-btn-primary,
    ${X} .rte-conditional-btn-primary,
    .${S}.rte-conditional-theme-acme .rte-conditional-btn-primary {
      border-color: #0f766e;
      background: #0f766e;
      color: #ffffff;
    }

    ${_} .rte-toolbar-group-items.conditional-content,
    .${S}.rte-conditional-theme-acme .rte-toolbar-group-items.conditional-content,
    ${X} .rte-toolbar-group-items.conditional-content,
    ${_} .editora-toolbar-group-items.conditional-content {
      border-color: #bfd0e2;
    }

    ${_} .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    ${X} .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    ${_} .editora-toolbar-group-items.conditional-content .editora-toolbar-button {
      border-right-color: #bfd0e2;
    }

    ${_} .${B},
    .${S}.rte-conditional-theme-acme .${B},
    .${B}.rte-conditional-theme-acme {
      background: rgba(255, 255, 255, 0.98);
      border-color: #bfd0e2;
      box-shadow: 0 14px 28px rgba(15, 23, 42, 0.16);
    }

    ${_} .${B} .rte-conditional-float-btn,
    .${S}.rte-conditional-theme-acme .${B} .rte-conditional-float-btn,
    .${B}.rte-conditional-theme-acme .rte-conditional-float-btn {
      background: #ffffff;
      border-color: #bfd0e2;
      color: #1f334a;
    }

    ${_} .${B} .rte-conditional-float-btn:hover,
    .${S}.rte-conditional-theme-acme .${B} .rte-conditional-float-btn:hover,
    .${B}.rte-conditional-theme-acme .rte-conditional-float-btn:hover {
      background: #eef7f5;
      color: #0f4f4a;
    }

    ${_} .${B} .rte-conditional-float-btn[data-action="delete"],
    .${S}.rte-conditional-theme-acme .${B} .rte-conditional-float-btn[data-action="delete"],
    .${B}.rte-conditional-theme-acme .rte-conditional-float-btn[data-action="delete"] {
      border-color: #f1a7b2;
      color: #8b1f2f;
      background: #fff4f6;
    }
  `,document.head.appendChild(e)}function mg(e){return{defaultCondition:e.defaultCondition||"",defaultAudience:En(e.defaultAudience||[]),defaultLocale:En(e.defaultLocale||[]),enableElseByDefault:e.enableElseByDefault===!0,labels:ig(e.labels),context:e.context,getContext:e.getContext,currentAudience:e.currentAudience,currentLocale:e.currentLocale,evaluateCondition:e.evaluateCondition||ug}}function Hd(){Xn&&(Xn.cleanup(),Xn=null)}function pg(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function Cn(e,t){e.setAttribute("contenteditable","false"),e.setAttribute("spellcheck","false");const r=e.querySelector(".rte-conditional-header");r&&(r.setAttribute("contenteditable","false"),r.setAttribute("tabindex","0"),r.setAttribute("role","button"),r.setAttribute("aria-label","Edit conditional rule"));const n=e.querySelector(".rte-conditional-else-label");n&&n.setAttribute("contenteditable","false"),hg(e,!t)}function gg(e){const t=e.querySelector('.rte-conditional-body[data-slot="if"]');if(!t)return;const r=new Set,n=e.querySelector(".rte-conditional-header"),o=e.querySelector(".rte-conditional-else-label"),a=e.querySelector('.rte-conditional-body[data-slot="else"]');n&&r.add(n),r.add(t),o&&r.add(o),a&&r.add(a),Array.from(e.childNodes).forEach(l=>{if(!(l instanceof HTMLElement&&r.has(l))){if(l.nodeType===Node.TEXT_NODE&&!(l.textContent||"").trim()){l.remove();return}t.appendChild(l)}})}function Rr(e){const t=window.getSelection();if(t&&t.rangeCount>0){const o=t.getRangeAt(0).startContainer,a=o.nodeType===Node.ELEMENT_NODE?o:o.parentElement,i=a==null?void 0:a.closest(Gt);if(i&&e.contains(i))return i}const r=document.activeElement,n=r==null?void 0:r.closest(Gt);return n&&e.contains(n)?n:null}function Vl(e,t){let r=e.querySelector(".rte-conditional-else-label"),n=e.querySelector('.rte-conditional-body[data-slot="else"]');r||(r=document.createElement("div"),r.className="rte-conditional-else-label",r.setAttribute("contenteditable","false"),r.innerHTML=`
      <span class="rte-conditional-chip rte-conditional-chip-else">${ne(t.blockElseLabel)}</span>
      <span class="rte-conditional-summary">Else branch</span>
    `,e.appendChild(r)),n||(n=document.createElement("div"),n.className="rte-conditional-body rte-conditional-else-body",n.setAttribute("data-slot","else"),n.innerHTML="<p><br></p>",e.appendChild(n))}function bg(e,t){e.setAttribute("data-has-else",t?"true":"false");const r=e.querySelector(".rte-conditional-else-label"),n=e.querySelector('.rte-conditional-body[data-slot="else"]');r&&r.classList.toggle("rte-conditional-hidden",!t),n&&n.classList.toggle("rte-conditional-hidden",!t)}function hg(e,t){Array.from(e.querySelectorAll(".rte-conditional-body")).forEach(n=>{n.setAttribute("contenteditable",t?"true":"false")}),e.setAttribute("contenteditable","false")}function Kl(e,t){const r=e.getAttribute("data-condition")||"",n=er(e.getAttribute("data-audience")),o=er(e.getAttribute("data-locale"));let a=e.querySelector(".rte-conditional-header");a||(a=document.createElement("div"),a.className="rte-conditional-header",e.prepend(a)),a.setAttribute("contenteditable","false"),a.setAttribute("tabindex","0"),a.setAttribute("role","button"),a.setAttribute("aria-label","Edit conditional rule");const i=r||"(always true)",l=n.length>0?n.join(", "):t.allAudiencesText,s=o.length>0?o.join(", "):t.allLocalesText;if(a.innerHTML=`
    <span class="rte-conditional-chip">${ne(t.blockIfLabel)}</span>
    <span class="rte-conditional-summary">${ne(i)}</span>
    <span class="rte-conditional-meta">${ne(l)} · ${ne(s)}</span>
  `,!e.querySelector('.rte-conditional-body[data-slot="if"]')){const u=document.createElement("div");u.className="rte-conditional-body",u.setAttribute("data-slot","if"),u.innerHTML="<p><br></p>",e.insertBefore(u,e.children[1]||null)}const d=e.getAttribute("data-has-else")==="true";d&&Vl(e,t),gg(e),bg(e,d)}function Id(e,t){const r=document.createElement("section");r.className="rte-conditional-block",r.setAttribute("data-conditional-content","true"),r.setAttribute("data-condition",(e.condition||"").trim()),r.setAttribute("data-audience",En(e.audience).join(",")),r.setAttribute("data-locale",En(e.locale).join(",")),r.setAttribute("data-has-else",e.hasElse?"true":"false"),r.setAttribute("role","group"),r.setAttribute("aria-label","Conditional content block"),r.setAttribute("contenteditable","false"),r.setAttribute("spellcheck","false");const n=document.createElement("div");n.className="rte-conditional-header",n.setAttribute("contenteditable","false");const o=document.createElement("div");return o.className="rte-conditional-body",o.setAttribute("data-slot","if"),o.innerHTML="<p><br></p>",r.appendChild(n),r.appendChild(o),e.hasElse&&Vl(r,t),Kl(r,t),Cn(r,!1),r}function yg(e,t){if(t)try{if(!e.isConnected)return;const r=e.contains(t.startContainer),n=e.contains(t.endContainer);if(!r||!n)return;Fl(e,t)}catch{}}function xg(e){return(e.textContent||"").replace(/\u200B/g,"").trim().length>0?!0:e.querySelector("img, video, table, iframe, hr, pre, blockquote, ul, ol")!==null}function Bd(e,t,r){let n=null;if(r)try{const i=r.cloneRange();e.contains(i.commonAncestorContainer)&&(n=i)}catch{n=null}n||(n=Rd(e)),n||(n=document.createRange(),n.selectNodeContents(e),n.collapse(!1));let o=null;n.collapsed||(o=n.extractContents()),n.insertNode(t);const a=t.querySelector('.rte-conditional-body[data-slot="if"]');a&&o&&xg(o)&&(a.innerHTML="",a.appendChild(o)),a?Ua(e,a):Ua(e,t),e.normalize()}function vg(e){return{condition:e.getAttribute("data-condition")||"",audience:er(e.getAttribute("data-audience")),locale:er(e.getAttribute("data-locale")),hasElse:e.getAttribute("data-has-else")==="true"}}function kg(e,t,r){e.setAttribute("data-condition",(t.condition||"").trim()),e.setAttribute("data-audience",En(t.audience).join(",")),e.setAttribute("data-locale",En(t.locale).join(",")),e.setAttribute("data-has-else",t.hasElse?"true":"false"),t.hasElse&&Vl(e,r),Kl(e,r),Cn(e,e.classList.contains("rte-conditional-preview"))}function Sn(e,t){xi(e,e);const r=Array.from(e.querySelectorAll(Gt)),n=gt.get(e)===!0;return r.forEach(o=>{o.classList.add("rte-conditional-block"),o.setAttribute("data-conditional-content","true"),o.hasAttribute("data-condition")||o.setAttribute("data-condition",""),o.hasAttribute("data-audience")||o.setAttribute("data-audience",""),o.hasAttribute("data-locale")||o.setAttribute("data-locale",""),o.hasAttribute("data-has-else")||o.setAttribute("data-has-else","false"),o.setAttribute("role","group"),o.setAttribute("aria-label","Conditional content block"),o.setAttribute("contenteditable","false"),o.setAttribute("spellcheck","false"),Kl(o,t),Cn(o,n)}),r}async function wg(e,t){const r=ul.get(e);if(r)return r;if(typeof t.getContext=="function")try{const n=Ho(e),o=await Promise.resolve(t.getContext({editor:e,editorRoot:n}));if(o&&typeof o=="object")return o}catch{return{}}if(typeof t.context=="function")try{const n=t.context();if(n&&typeof n=="object")return n}catch{return{}}return t.context&&typeof t.context=="object"?t.context:{}}function Qo(e){return Array.isArray(e)?e.map(t=>t.trim().toLowerCase()).filter(Boolean):typeof e=="string"?e.split(",").map(t=>t.trim().toLowerCase()).filter(Boolean):[]}function Gs(e,t){return e.length===0||e.includes("all")?!0:t.length===0?!1:e.some(r=>t.includes(r))}async function Nr(e,t,r){var p,g;const n=t.labels,o=Sn(e,n);if(gt.set(e,r),Pd(e,r),Ho(e).classList.toggle("rte-conditional-preview-on",r),!r){o.forEach(m=>{m.classList.remove("rte-conditional-preview"),Cn(m,!1);const h=m.querySelector('.rte-conditional-body[data-slot="if"]'),b=m.querySelector('.rte-conditional-body[data-slot="else"]'),y=m.querySelector(".rte-conditional-else-label"),E=m.getAttribute("data-has-else")==="true";h&&(h.classList.remove("rte-conditional-hidden"),h.removeAttribute("aria-hidden")),b&&(b.classList.toggle("rte-conditional-hidden",!E),b.setAttribute("aria-hidden",E?"false":"true")),y&&y.classList.toggle("rte-conditional-hidden",!E)});return}const i=await wg(e,t),l=Qo(t.currentAudience),s=Qo(t.currentLocale),c=Qo(i.audience??((p=i.user)==null?void 0:p.audience)),d=Qo(i.locale??((g=i.user)==null?void 0:g.locale)),u=l.length>0?l:c,f=s.length>0?s:d;o.forEach(m=>{const h=m.getAttribute("data-condition")||"",b=er(m.getAttribute("data-audience")).map(z=>z.toLowerCase()),y=er(m.getAttribute("data-locale")).map(z=>z.toLowerCase()),E=m.getAttribute("data-has-else")==="true",v=t.evaluateCondition(h,i),C=Gs(b,u),T=Gs(y,f),k=v&&C&&T,x=m.querySelector('.rte-conditional-body[data-slot="if"]'),w=m.querySelector('.rte-conditional-body[data-slot="else"]'),I=m.querySelector(".rte-conditional-else-label");if(m.classList.add("rte-conditional-preview"),Cn(m,!0),x&&(x.classList.toggle("rte-conditional-hidden",!k),x.setAttribute("aria-hidden",k?"false":"true")),w){const z=E&&!k;w.classList.toggle("rte-conditional-hidden",!z),w.setAttribute("aria-hidden",z?"false":"true")}if(I){const z=E&&!k;I.classList.toggle("rte-conditional-hidden",!z)}})}function Pd(e,t){const r=Ho(e);Array.from(r.querySelectorAll('[data-command="toggleConditionalPreview"], [data-command="conditionalPreview"]')).forEach(o=>{o.setAttribute("data-active",t?"true":"false"),o.classList.toggle("active",t),o.setAttribute("aria-pressed",t?"true":"false")})}function Eg(e){const t=br.get(e);if(t&&t.isConnected)return t;const r=document.createElement("div");return r.className=B,r.setAttribute("role","toolbar"),r.setAttribute("aria-label","Conditional block actions"),r.innerHTML=`
    <button type="button" class="rte-conditional-float-btn" data-action="edit" title="Edit Condition" aria-label="Edit Condition">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4 17.3V20h2.7l9.7-9.7-2.7-2.7L4 17.3Zm14.7-9.4a1 1 0 0 0 0-1.4l-1.2-1.2a1 1 0 0 0-1.4 0l-1.1 1.1 2.7 2.7 1-1.2Z" fill="currentColor"></path></svg>
    </button>
    <button type="button" class="rte-conditional-float-btn" data-action="delete" title="Delete Block" aria-label="Delete Block">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M8 4h8l1 2h4v2H3V6h4l1-2Zm1 6h2v8H9v-8Zm4 0h2v8h-2v-8Z" fill="currentColor"></path></svg>
    </button>
  `,r.addEventListener("mousedown",n=>{n.preventDefault()}),r.addEventListener("click",n=>{var s;const o=n.target,a=(s=o==null?void 0:o.closest("[data-action]"))==null?void 0:s.getAttribute("data-action");if(!a)return;const i=ce.get(e)||Ur;if(!i)return;const l=hr.get(e);if(!(!l||!e.contains(l))){if(a==="edit"){je(e,i,"edit",void 0,l);return}a==="delete"&&(zd(e,l),hr.set(e,null),sr(e))}}),document.body.appendChild(r),br.set(e,r),r}function sr(e){const t=br.get(e);t&&t.classList.remove("show")}function Od(e,t){const r=t.getBoundingClientRect();e.style.left="0px",e.style.top="0px",e.classList.add("show");const n=e.getBoundingClientRect(),o=8,a=window.innerWidth,i=window.innerHeight;let l=r.top-n.height-o;l<o&&(l=r.bottom+o),l=Math.min(l,i-n.height-o);let s=r.right-n.width;s=Math.max(o,Math.min(s,a-n.width-o)),e.style.left=`${s}px`,e.style.top=`${l}px`}function Ca(e,t){const r=Eg(e);xi(r,e),hr.set(e,t),Od(r,t)}function jt(e){const t=ce.get(e)||Ur;if(!t)return;const r=Rr(e);if(!r||!e.contains(r)||Et(e)){hr.set(e,null),sr(e);return}Sn(e,t.labels),Ca(e,r)}function Cg(){br.forEach((e,t)=>{if(!t.isConnected||!e.isConnected){e.remove(),br.delete(t),hr.delete(t);return}if(!e.classList.contains("show"))return;xi(e,t);const r=hr.get(t);if(!r||!t.contains(r)){sr(t);return}Od(e,r)})}function zd(e,t){if(!e.contains(t))return!1;const r=e.innerHTML,n=t.parentNode,o=t.nextSibling;t.remove(),n===e&&e.innerHTML.trim()===""&&(e.innerHTML="<p><br></p>");const a=document.createRange();return o&&e.contains(o)?a.setStartBefore(o):(a.selectNodeContents(e),a.collapse(!1)),a.collapse(!0),Fl(e,a),Nd(e),Dd(e,r),!0}function Zs(e,t,r){const n=e.cloneRange(),o=document.createRange();return o.selectNodeContents(t),o.collapse(r==="start"),n.startContainer===o.startContainer&&n.startOffset===o.startOffset&&n.endContainer===o.endContainer&&n.endOffset===o.endOffset}function je(e,t,r,n,o){Hd();const a=t.labels,i=r==="insert"?Rd(e):null,l=document.createElement("div");l.className=S,xi(l,e);const s=document.createElement("section");s.className="rte-conditional-dialog",s.setAttribute("role","dialog"),s.setAttribute("aria-modal","true"),s.setAttribute("aria-labelledby","rte-conditional-dialog-title");const c=o?vg(o):void 0,d=n||c||{},u=d.condition??t.defaultCondition,f=d.audience??t.defaultAudience,p=d.locale??t.defaultLocale,g=d.hasElse??t.enableElseByDefault;s.innerHTML=`
    <header class="rte-conditional-dialog-header">
      <h2 id="rte-conditional-dialog-title" class="rte-conditional-dialog-title">${ne(r==="edit"?a.dialogTitleEdit:a.dialogTitleInsert)}</h2>
      <button type="button" class="rte-conditional-btn" data-action="cancel" aria-label="${ne(a.cancelText)}">✕</button>
    </header>
    <div class="rte-conditional-dialog-body">
      <div class="rte-conditional-field">
        <label for="rte-conditional-condition">${ne(a.conditionLabel)}</label>
        <input id="rte-conditional-condition" class="rte-conditional-input-condition" type="text" value="${ne(u||"")}" placeholder="${ne(a.conditionPlaceholder)}" />
      </div>
      <div class="rte-conditional-field">
        <label for="rte-conditional-audience">${ne(a.audienceLabel)}</label>
        <input id="rte-conditional-audience" class="rte-conditional-input-audience" type="text" value="${ne(Us(f))}" placeholder="${ne(a.audiencePlaceholder)}" />
      </div>
      <div class="rte-conditional-field">
        <label for="rte-conditional-locale">${ne(a.localeLabel)}</label>
        <input id="rte-conditional-locale" class="rte-conditional-input-locale" type="text" value="${ne(Us(p))}" placeholder="${ne(a.localePlaceholder)}" />
      </div>
      <label class="rte-conditional-checkbox">
        <input class="rte-conditional-input-else" type="checkbox" ${g?"checked":""} />
        <span>${ne(a.elseLabel)}</span>
      </label>
      <p class="rte-conditional-help">Example condition: <code>user.role == "admin"</code>, <code>locale == "en-US"</code>, <code>!feature.beta</code></p>
    </div>
    <footer class="rte-conditional-dialog-footer">
      <button type="button" class="rte-conditional-btn" data-action="cancel">${ne(a.cancelText)}</button>
      <button type="button" class="rte-conditional-btn rte-conditional-btn-primary" data-action="save">${ne(a.saveText)}</button>
    </footer>
  `,l.appendChild(s),document.body.appendChild(l);const m=s.querySelector(".rte-conditional-input-condition"),h=s.querySelector(".rte-conditional-input-audience"),b=s.querySelector(".rte-conditional-input-locale"),y=s.querySelector(".rte-conditional-input-else"),E=()=>{l.removeEventListener("click",C),l.removeEventListener("keydown",x,!0),document.removeEventListener("keydown",v,!0),l.parentNode&&l.parentNode.removeChild(l),Xn=null,e.focus({preventScroll:!0}),jt(e)},v=w=>{w.key==="Escape"&&(w.preventDefault(),w.stopPropagation(),E())},C=w=>{w.target===l&&E()},T=w=>{if(w.key!=="Tab")return;const I=Array.from(s.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));if(I.length===0)return;const z=I[0],He=I[I.length-1],Ie=document.activeElement;if(w.shiftKey&&Ie===z){w.preventDefault(),He.focus();return}!w.shiftKey&&Ie===He&&(w.preventDefault(),z.focus())},k=async()=>{var He;const w={condition:((He=m==null?void 0:m.value)==null?void 0:He.trim())||"",audience:er(h==null?void 0:h.value),locale:er(b==null?void 0:b.value),hasElse:(y==null?void 0:y.checked)||!1},I=e.innerHTML;if(o)kg(o,w,a),Cn(o,gt.get(e)===!0);else{yg(e,i);const Ie=Id(w,a);try{Bd(e,Ie)}catch{e.appendChild(Ie);const or=Ie.querySelector('.rte-conditional-body[data-slot="if"]');or?Ua(e,or):Ua(e,Ie)}}gt.get(e)===!0&&await Nr(e,t,!0),Nd(e),Dd(e,I),jt(e),E()},x=w=>{if(w.key==="Escape"){w.preventDefault(),E();return}T(w),w.key==="Enter"&&!w.shiftKey&&w.target instanceof HTMLInputElement&&(w.preventDefault(),k())};s.addEventListener("click",w=>{const z=w.target.getAttribute("data-action");if(z==="cancel"){E();return}z==="save"&&k()}),l.addEventListener("click",C),l.addEventListener("keydown",x,!0),document.addEventListener("keydown",v,!0),Xn={cleanup:E},m==null||m.focus()}function Sg(e){const t=e.metaKey||e.ctrlKey,n=(typeof e.key=="string"?e.key:"").toLowerCase(),o=typeof e.code=="string"?e.code.toLowerCase():"",a=t&&e.altKey&&e.shiftKey&&(n==="c"||o==="keyc"),i=!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&(n==="f9"||o==="f9");return a||i}function Tg(e){const t=e.metaKey||e.ctrlKey,n=(typeof e.key=="string"?e.key:"").toLowerCase(),o=typeof e.code=="string"?e.code.toLowerCase():"",a=t&&e.altKey&&e.shiftKey&&(n==="p"||o==="keyp"),i=!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&(n==="f10"||o==="f10");return a||i}function $g(e){Ur=e,jr||(jr=t=>{const r=t.target,n=r==null?void 0:r.closest(Xe);if(!n)return;J=n,ce.has(n)||ce.set(n,e);const o=ce.get(n)||e;Sn(n,o.labels),Pd(n,gt.get(n)===!0),jt(n)},document.addEventListener("focusin",jr,!0)),qr||(qr=t=>{var d;if(document.querySelector(`.${S}`))return;const n=t.target;if(!!(n!=null&&n.closest("input, textarea, select")))return;const i=(n==null?void 0:n.closest(Xe))||ut(void 0,!1)||J;if(!i||Et(i))return;const l=ce.get(i)||Ur||e,s=document.activeElement,c=(n==null?void 0:n.closest(".rte-conditional-header"))||(s==null?void 0:s.closest(".rte-conditional-header"));if(c&&(t.key==="Enter"||t.key===" ")){const u=c.closest(Gt);if(u&&i.contains(u)){t.preventDefault(),t.stopPropagation(),je(i,l,"edit",void 0,u);return}}if(Sg(t)){t.preventDefault(),t.stopPropagation();const u=Rr(i);u?je(i,l,"edit",void 0,u):je(i,l,"insert");return}if(Tg(t)){t.preventDefault(),t.stopPropagation();const u=gt.get(i)!==!0;Nr(i,l,u),jt(i);return}if((t.key==="Backspace"||t.key==="Delete")&&!t.altKey&&!t.ctrlKey&&!t.metaKey){const u=window.getSelection();if(!u||u.rangeCount===0)return;const f=u.getRangeAt(0);if(!f.collapsed||!i.contains(f.commonAncestorContainer))return;const p=(d=pg(f.startContainer))==null?void 0:d.closest(".rte-conditional-body");if(!p||!i.contains(p))return;if(t.key==="Backspace"&&Zs(f,p,"start")){t.preventDefault();return}if(t.key==="Delete"&&Zs(f,p,"end")){t.preventDefault();return}}},document.addEventListener("keydown",qr,!0)),Vr||(Vr=t=>{const r=t.target;if(!r||r.closest(`.${B}`))return;const n=r.closest(Xe);if(!n){J&&sr(J);return}if(Et(n))return;J=n,ce.has(n)||ce.set(n,e);const o=r.closest(Gt);if(!o){sr(n);return}requestAnimationFrame(()=>{!n.isConnected||!n.contains(o)||Ca(n,o)})},document.addEventListener("mousedown",Vr,!0)),Fr||(Fr=t=>{const r=t.target;if(!r||r.closest(`.${B}`))return;const n=r.closest(Xe);if(!n){J&&sr(J);return}if(Et(n))return;J=n,ce.has(n)||ce.set(n,e);const o=ce.get(n)||e,a=r.closest(Gt),i=!!r.closest(".rte-conditional-header, .rte-conditional-summary, .rte-conditional-meta, .rte-conditional-else-label");if(a&&i){t.preventDefault(),t.stopPropagation(),je(n,o,"edit",void 0,a),Ca(n,a);return}a?Ca(n,a):sr(n)},document.addEventListener("click",Fr,!0)),Kr||(Kr=()=>{const t=ut(void 0,!1)||J;t&&t.isConnected&&jt(t)},document.addEventListener("selectionchange",Kr)),Wr||(Wr=t=>{const r=t.target,n=r==null?void 0:r.closest(Xe);if(!n)return;const o=ce.get(n)||Ur||e;Sn(n,o.labels),jt(n)},document.addEventListener("input",Wr,!0)),qt||(qt=()=>{Cg()},window.addEventListener("scroll",qt,!0),window.addEventListener("resize",qt))}function Lg(){jr&&(document.removeEventListener("focusin",jr,!0),jr=null),qr&&(document.removeEventListener("keydown",qr,!0),qr=null),Fr&&(document.removeEventListener("click",Fr,!0),Fr=null),Vr&&(document.removeEventListener("mousedown",Vr,!0),Vr=null),Kr&&(document.removeEventListener("selectionchange",Kr),Kr=null),Wr&&(document.removeEventListener("input",Wr,!0),Wr=null),qt&&(window.removeEventListener("scroll",qt,!0),window.removeEventListener("resize",qt),qt=null),br.forEach(e=>{e.remove()}),br.clear(),hr.clear(),Ur=null,J=null}const Ag=(e={})=>{const t=mg(e);return fg(),{name:"conditionalContent",toolbar:[{id:"conditionalContentGroup",label:"Conditional Content",type:"group",command:"conditionalContent",items:[{id:"conditionalContent",label:"Conditional Rule",command:"openConditionalDialog",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M6 5h12a1 1 0 0 1 1 1v3h-2V7H7v3H5V6a1 1 0 0 1 1-1Zm-1 9h2v3h10v-3h2v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4Zm3-2a1 1 0 0 1 1-1h2.6l1.8-2.4a1 1 0 1 1 1.6 1.2L13.8 11H15a1 1 0 1 1 0 2h-2.7l-1.9 2.5a1 1 0 1 1-1.6-1.2L10.1 13H9a1 1 0 0 1-1-1Z" fill="currentColor"></path></svg>',shortcut:"Mod-Alt-Shift-c"},{id:"conditionalPreview",label:"Conditional Preview",command:"toggleConditionalPreview",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4 6h16a1 1 0 0 1 1 1v3h-2V8H5v8h14v-2h2v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm5 3h2v2H9V9Zm0 4h2v2H9v-2Zm4-4h6v2h-6V9Zm0 4h6v2h-6v-2Z" fill="currentColor"></path></svg>',shortcut:"Mod-Alt-Shift-p"}]}],commands:{conditionalContent:(r,n)=>{const o=ut(n);if(!o||Et(o))return!1;J=o,ce.set(o,t),Sn(o,t.labels);const a=r==null?void 0:r.target;if(a==="insert")return je(o,t,"insert",r),!0;const i=Rr(o);return a==="edit"||i?!i&&a==="edit"?!1:(je(o,t,"edit",r,i||void 0),!0):(je(o,t,"insert",r),!0)},openConditionalDialog:(r,n)=>{const o=ut(n);if(!o||Et(o))return!1;J=o,ce.set(o,t),Sn(o,t.labels);const a=r==null?void 0:r.target;if(a==="insert")return je(o,t,"insert",r),!0;const i=Rr(o);return a==="edit"||i?!i&&a==="edit"?!1:(je(o,t,"edit",r,i||void 0),!0):(je(o,t,"insert",r),!0)},conditionalPreview:async(r,n)=>{const o=ut(n);if(!o)return!1;J=o,ce.set(o,t);const a=typeof r=="boolean"?r:gt.get(o)!==!0;return await Nr(o,t,a),jt(o),!0},editConditionalBlock:(r,n)=>{const o=ut(n);if(!o||Et(o))return!1;J=o,ce.set(o,t);const a=Rr(o);return a?(je(o,t,"edit",r,a),!0):!1},deleteConditionalBlock:(r,n)=>{const o=ut(n);if(!o||Et(o))return!1;const a=Rr(o);if(!a)return!1;const i=zd(o,a);return i&&jt(o),i},insertConditionalBlock:(r,n)=>{const o=ut(n);if(!o||Et(o))return!1;J=o,ce.set(o,t);const a={condition:(r==null?void 0:r.condition)??t.defaultCondition,audience:(r==null?void 0:r.audience)??t.defaultAudience,locale:(r==null?void 0:r.locale)??t.defaultLocale,hasElse:(r==null?void 0:r.hasElse)??t.enableElseByDefault},i=Id(a,t.labels);return Bd(o,i),gt.get(o)===!0&&Nr(o,t,!0),!0},toggleConditionalPreview:async(r,n)=>{const o=ut(n);if(!o)return!1;J=o,ce.set(o,t);const a=typeof r=="boolean"?r:gt.get(o)!==!0;return await Nr(o,t,a),!0},setConditionalContext:(r,n)=>{const o=ut(n);return o?(J=o,!r||typeof r!="object"?ul.delete(o):ul.set(o,r),gt.get(o)===!0&&Nr(o,t,!0),!0):!1}},keymap:{"Mod-Alt-Shift-c":"openConditionalDialog","Mod-Alt-Shift-C":"openConditionalDialog","Mod-Alt-Shift-p":"toggleConditionalPreview","Mod-Alt-Shift-P":"toggleConditionalPreview",F9:"openConditionalDialog",F10:"toggleConditionalPreview"},init:()=>{Yo+=1,$g(t)},destroy:()=>{Yo=Math.max(0,Yo-1),Yo===0&&(Hd(),Lg())}}},_t=".rte-content, .editora-content",Gr='.rte-data-binding[data-binding="true"]',Ys="rte-data-binding-styles",fe="rte-data-binding-dialog-overlay",le=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',Mg={dialogTitleInsert:"Insert Data Binding",dialogTitleEdit:"Edit Data Binding",keyLabel:"Data Key",keyPlaceholder:"user.firstName",fallbackLabel:"Fallback Text",fallbackPlaceholder:"Guest",formatLabel:"Format",currencyLabel:"Currency",currencyPlaceholder:"USD",saveText:"Save",cancelText:"Cancel",previewOnText:"Preview On",previewOffText:"Preview Off",tokenAriaPrefix:"Data binding token"},Je=new WeakMap,fl=new WeakMap,se=new WeakMap,Jn=new WeakMap,Wi=new WeakMap;let Qn=null,Se=null,ea=0,Zr=null,Yr=null,Xr=null,Sa=null;function Rg(e){return{...Mg,...e||{}}}function Xs(e={}){const t=(e.locale||(typeof navigator<"u"?navigator.language:"en-US")).trim()||"en-US";return{data:e.data,getData:e.getData,api:e.api,cacheTtlMs:Math.max(0,Number(e.cacheTtlMs??3e4)),labels:Rg(e.labels),defaultFormat:e.defaultFormat||"text",defaultFallback:e.defaultFallback||"",locale:t,numberFormatOptions:e.numberFormatOptions||{},dateFormatOptions:e.dateFormatOptions||{year:"numeric",month:"short",day:"2-digit"}}}function Ce(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function _d(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function Io(e){return e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||e}function ta(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function Ng(e){const t=Io(e);if(ta(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return ta(r)?!0:ta(document.documentElement)||ta(document.body)}function Ot(e,t=!0){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const o=e.editorElement;if(o.matches(_t))return o;const a=o.querySelector(_t);if(a instanceof HTMLElement)return a}const r=window.getSelection();if(r&&r.rangeCount>0){const o=r.getRangeAt(0).startContainer,a=_d(o),i=a==null?void 0:a.closest(_t);if(i)return i}const n=document.activeElement;if(n){if(n.matches(_t))return n;const o=n.closest(_t);if(o)return o}return Se&&Se.isConnected?Se:t?document.querySelector(_t):null}function eo(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function qd(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);return e.contains(r.commonAncestorContainer)?r.cloneRange():null}function jd(e,t){const r=window.getSelection();r&&(r.removeAllRanges(),r.addRange(t),e.focus({preventScroll:!0}))}function Dg(e,t){const r=(t||"").trim();if(r)return r.split(".").filter(Boolean).reduce((n,o)=>{if(!(n==null||typeof n!="object"))return n[o]},e)}function Hg(){if(typeof document>"u"||document.getElementById(Ys))return;const e=document.createElement("style");e.id=Ys,e.textContent=`
    .rte-data-binding {
      display: inline-flex;
      align-items: center;
      max-width: 100%;
      gap: 5px;
      padding: 2px 8px 2px 7px;
      border-radius: 999px;
      border: 1px dashed #8b5cf6;
      background: linear-gradient(180deg, #f9f7ff 0%, #f1edff 100%);
      color: #4c1d95;
      font-size: 0.88em;
      font-weight: 600;
      line-height: 1.3;
      vertical-align: baseline;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      user-select: all;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      cursor: pointer;
    }

    .rte-data-binding::before {
      content: '{}';
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 14px;
      height: 14px;
      border-radius: 999px;
      background: rgba(139, 92, 246, 0.16);
      color: #5b21b6;
      font-size: 10px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: -0.2px;
      flex: 0 0 auto;
    }

    .rte-data-binding.rte-data-binding-preview {
      border-style: solid;
      background: #ecfdf5;
      border-color: #34d399;
      color: #065f46;
      user-select: text;
    }

    .rte-data-binding.rte-data-binding-preview::before {
      content: '=';
      background: rgba(16, 185, 129, 0.15);
      color: #047857;
      letter-spacing: 0;
    }

    .rte-data-binding.rte-data-binding-missing {
      border-style: dashed;
      border-color: #f87171;
      background: #fef2f2;
      color: #991b1b;
    }

    .rte-data-binding-dialog-overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483646;
      background: rgba(15, 23, 42, 0.54);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .rte-data-binding-dialog {
      width: min(560px, 96vw);
      max-height: min(86vh, 720px);
      border: 1px solid #dbe3ec;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0 24px 50px rgba(15, 23, 42, 0.26);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .rte-data-binding-header,
    .rte-data-binding-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 12px 14px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .rte-data-binding-footer {
      justify-content: flex-end;
      border-bottom: 0;
      border-top: 1px solid #e2e8f0;
    }

    .rte-data-binding-title {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }

    .rte-data-binding-body {
      padding: 14px;
      overflow: auto;
      display: grid;
      gap: 12px;
      grid-template-columns: 1fr;
    }

    .rte-data-binding-field {
      display: grid;
      gap: 6px;
    }

    .rte-data-binding-field label {
      font-size: 12px;
      font-weight: 600;
      color: #334155;
    }

    .rte-data-binding-field input,
    .rte-data-binding-field select {
      width: 100%;
      min-height: 36px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 13px;
      line-height: 1.4;
      color: #0f172a;
      background: #ffffff;
      box-sizing: border-box;
    }

    .rte-data-binding-help {
      margin: 0;
      font-size: 12px;
      color: #64748b;
    }

    .rte-data-binding-btn {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      min-height: 34px;
      padding: 6px 12px;
      background: #ffffff;
      color: #0f172a;
      font-size: 13px;
      cursor: pointer;
    }

    .rte-data-binding-btn-primary {
      background: #2563eb;
      border-color: #2563eb;
      color: #ffffff;
    }

    .rte-data-binding-btn-primary:hover {
      background: #1d4ed8;
    }

    .rte-toolbar-group-items.data-binding,
    .editora-toolbar-group-items.data-binding {
      display: flex;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
      background: #ffffff;
    }

    .rte-toolbar-group-items.data-binding .rte-toolbar-item,
    .editora-toolbar-group-items.data-binding .editora-toolbar-item {
      display: flex;
    }

    .rte-toolbar-group-items.data-binding .rte-toolbar-button,
    .editora-toolbar-group-items.data-binding .editora-toolbar-button {
      border: 0;
      border-radius: 0;
      border-right: 1px solid #cbd5e1;
    }

    .rte-toolbar-group-items.data-binding .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.data-binding .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: 0;
    }

    .rte-data-binding-btn:focus-visible,
    .rte-data-binding-field input:focus-visible,
    .rte-data-binding-field select:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    ${le} .rte-data-binding,
    .${fe}.rte-data-binding-theme-dark .rte-data-binding {
      background: linear-gradient(180deg, #3b0764 0%, #2e1065 100%);
      border-color: #a78bfa;
      color: #ede9fe;
    }

    ${le} .rte-data-binding::before,
    .${fe}.rte-data-binding-theme-dark .rte-data-binding::before {
      background: rgba(167, 139, 250, 0.22);
      color: #ddd6fe;
    }

    ${le} .rte-data-binding.rte-data-binding-preview,
    .${fe}.rte-data-binding-theme-dark .rte-data-binding.rte-data-binding-preview {
      background: #064e3b;
      border-color: #10b981;
      color: #d1fae5;
    }

    ${le} .rte-data-binding.rte-data-binding-missing,
    .${fe}.rte-data-binding-theme-dark .rte-data-binding.rte-data-binding-missing {
      background: #7f1d1d;
      border-color: #ef4444;
      color: #fee2e2;
    }

    ${le} .rte-toolbar-group-items.data-binding,
    ${le} .editora-toolbar-group-items.data-binding {
      display: flex;
      border: 1px solid #566275;
      border-radius: 6px;
      overflow: hidden;
    }

    ${le} .rte-toolbar-group-items.data-binding .rte-toolbar-button,
    ${le} .editora-toolbar-group-items.data-binding .editora-toolbar-button {
      border-right-color: #566275;
    }

    ${le} .rte-data-binding-dialog,
    .${fe}.rte-data-binding-theme-dark .rte-data-binding-dialog {
      background: #1f2937;
      border-color: #334155;
    }

    ${le} .rte-data-binding-header,
    ${le} .rte-data-binding-footer,
    .${fe}.rte-data-binding-theme-dark .rte-data-binding-header,
    .${fe}.rte-data-binding-theme-dark .rte-data-binding-footer {
      background: #111827;
      border-color: #334155;
    }

    ${le} .rte-data-binding-title,
    ${le} .rte-data-binding-field label,
    .${fe}.rte-data-binding-theme-dark .rte-data-binding-title,
    .${fe}.rte-data-binding-theme-dark .rte-data-binding-field label {
      color: #e2e8f0;
    }

    ${le} .rte-data-binding-help,
    .${fe}.rte-data-binding-theme-dark .rte-data-binding-help {
      color: #94a3b8;
    }

    ${le} .rte-data-binding-field input,
    ${le} .rte-data-binding-field select,
    ${le} .rte-data-binding-btn,
    .${fe}.rte-data-binding-theme-dark .rte-data-binding-field input,
    .${fe}.rte-data-binding-theme-dark .rte-data-binding-field select,
    .${fe}.rte-data-binding-theme-dark .rte-data-binding-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    ${le} .rte-data-binding-btn-primary,
    .${fe}.rte-data-binding-theme-dark .rte-data-binding-btn-primary {
      background: #2563eb;
      border-color: #2563eb;
      color: #ffffff;
    }
  `,document.head.appendChild(e)}function ml(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function pl(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function po(e,t){return{key:String(e.key||"").trim(),fallback:String(e.fallback??t.defaultFallback??""),format:e.format||t.defaultFormat||"text",currency:String(e.currency||"USD").trim().toUpperCase()||"USD"}}function Fd(e){return`{{${e.key}}}`}function Vd(e,t){const r=document.createElement("span");return r.className="rte-data-binding",r.setAttribute("data-binding","true"),r.setAttribute("data-binding-key",e.key),r.setAttribute("data-binding-fallback",e.fallback||""),r.setAttribute("data-binding-format",e.format||"text"),r.setAttribute("data-binding-currency",e.currency||"USD"),r.setAttribute("contenteditable","false"),r.setAttribute("spellcheck","false"),r.setAttribute("draggable","false"),r.setAttribute("tabindex","0"),r.setAttribute("role","button"),r.setAttribute("aria-label",`${t.tokenAriaPrefix}: ${e.key}. Press Enter to edit.`),r.textContent=Fd(e),r}function vi(e,t){return po({key:e.getAttribute("data-binding-key")||"",fallback:e.getAttribute("data-binding-fallback")||t.defaultFallback,format:e.getAttribute("data-binding-format")||t.defaultFormat,currency:e.getAttribute("data-binding-currency")||"USD"},t)}function Wl(e,t,r){e.classList.add("rte-data-binding"),e.setAttribute("data-binding","true"),e.setAttribute("data-binding-key",t.key),e.setAttribute("data-binding-fallback",t.fallback||""),e.setAttribute("data-binding-format",t.format||"text"),e.setAttribute("data-binding-currency",t.currency||"USD"),e.setAttribute("contenteditable","false"),e.setAttribute("spellcheck","false"),e.setAttribute("draggable","false"),e.setAttribute("tabindex","0"),e.setAttribute("role","button"),e.setAttribute("aria-label",`${r.tokenAriaPrefix}: ${t.key}. Press Enter to edit.`)}function Ga(e,t){const r=Array.from(e.querySelectorAll(Gr));return r.forEach(n=>{const o=vi(n,t);Wl(n,o,t.labels)}),r}function gl(e){const t=window.getSelection();if(t&&t.rangeCount>0){const o=t.getRangeAt(0).startContainer,a=_d(o),i=a==null?void 0:a.closest(Gr);if(i&&e.contains(i))return i}const r=document.activeElement,n=r==null?void 0:r.closest(Gr);return n&&e.contains(n)?n:null}function Kd(){Qn&&(Qn.cleanup(),Qn=null)}function Ul(e,t,r){const n=Io(e);Array.from(n.querySelectorAll('[data-command="toggleDataBindingPreview"]')).forEach(a=>{if(a.setAttribute("data-active",t?"true":"false"),a.classList.toggle("active",t),a.setAttribute("aria-pressed",t?"true":"false"),r){const i=t?r.labels.previewOnText:r.labels.previewOffText;a.setAttribute("title",i),a.setAttribute("aria-label",i)}})}function Ig(e,t,r){const n=t.format||"text";if(e==null)return t.fallback||"";if(n==="json"){if(typeof e=="string")return e;try{return JSON.stringify(e)}catch{return String(e)}}if(n==="date"){const o=e instanceof Date?e:new Date(String(e));if(Number.isNaN(o.getTime()))return String(e);try{return new Intl.DateTimeFormat(r.locale,r.dateFormatOptions).format(o)}catch{return o.toISOString()}}if(n==="number"||n==="currency"){const o=typeof e=="number"?e:Number(e);if(!Number.isFinite(o))return String(e);const a={...r.numberFormatOptions};if(n==="currency"){const i=(t.currency||"USD").toUpperCase();Object.assign(a,{style:"currency",currency:i})}try{return new Intl.NumberFormat(r.locale,a).format(o)}catch{return String(o)}}return String(e)}function yr(e,t,r,n){const o=vi(e,t),a=o.key;if(e.classList.remove("rte-data-binding-preview","rte-data-binding-missing"),!r){e.textContent=Fd(o),e.setAttribute("aria-label",`${t.labels.tokenAriaPrefix}: ${a}. Press Enter to edit.`);return}const i=Dg(n,a),l=i==null,s=l?o.fallback||"":Ig(i,o,t);e.textContent=s||o.fallback||"",e.classList.add("rte-data-binding-preview"),l&&!(o.fallback||"").trim()&&e.classList.add("rte-data-binding-missing"),e.setAttribute("aria-label",`${t.labels.tokenAriaPrefix}: ${a} = ${e.textContent||""}. Press Enter to edit.`)}function Lt(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Bg(e,t){return t?t.split(".").filter(Boolean).reduce((r,n)=>{if(!(!Lt(r)&&!Array.isArray(r)))return r[n]},e):e}function Pg(e,t,r){const n=t.api,o=Io(e),a={editor:e,editorRoot:o,signal:r};if(n.buildRequest){const u=n.buildRequest(a);return{url:u.url,init:{...u.init||{},signal:r}}}const i=(n.method||"GET").toUpperCase(),l=typeof n.headers=="function"?n.headers(a):n.headers||{},s=typeof n.params=="function"?n.params(a):n.params,c=new URL(n.url,window.location.origin);s&&Object.entries(s).forEach(([u,f])=>{f!=null&&c.searchParams.set(u,String(f))});const d={method:i,headers:{...l},credentials:n.credentials,mode:n.mode,cache:n.cache,signal:r};if(i!=="GET"&&i!=="HEAD"){const u=typeof n.body=="function"?n.body(a):n.body;if(u!=null)if(Lt(u)){d.body=JSON.stringify(u);const f=d.headers;!f["Content-Type"]&&!f["content-type"]&&(f["Content-Type"]="application/json")}else d.body=u}return{url:c.toString(),init:d}}async function Og(e,t){var s;const r=t.api;if(!r)return{};const n=new AbortController,o=Io(e),a={editor:e,editorRoot:o,signal:n.signal},i=Math.max(0,Number(r.timeoutMs??1e4));let l=null;i>0&&(l=window.setTimeout(()=>n.abort(),i));try{const{url:c,init:d}=Pg(e,t,n.signal),u=await fetch(c,{...d,signal:n.signal});if(!u.ok)throw new Error(`Data binding API request failed: ${u.status}`);const p=(r.responseType||"json")==="text"?await u.text():await u.json();if(r.transformResponse){const m=r.transformResponse(p,a);return Lt(m)?m:{}}const g=Bg(p,r.responsePath);return Lt(g)?g:Lt(p)?p:{value:g}}catch(c){return(c==null?void 0:c.name)!=="AbortError"&&((s=r.onError)==null||s.call(r,c,a)),{}}finally{l!==null&&window.clearTimeout(l)}}async function go(e,t){const r=fl.get(e);if(r)return r;const n=Jn.get(e),o=Date.now();if(n&&o-n.timestamp<=t.cacheTtlMs)return n.data;const a=Wi.get(e);if(a)return a;const i=(async()=>{try{if(typeof t.getData=="function"){const s=await Promise.resolve(t.getData({editor:e,editorRoot:Io(e)}));if(Lt(s))return s}if(t.api){const s=await Og(e,t);if(Lt(s))return s}if(typeof t.data=="function"){const s=await Promise.resolve(t.data());if(Lt(s))return s}return Lt(t.data)?t.data:{}}finally{Wi.delete(e)}})();Wi.set(e,i);const l=await i;return Jn.set(e,{timestamp:o,data:l}),l}async function Ta(e,t,r){const n=Ga(e,t);if(Je.set(e,r),Ul(e,r,t),!r){n.forEach(a=>yr(a,t,!1));return}const o=await go(e,t);n.forEach(a=>yr(a,t,!0,o))}function Wd(e,t){let r=qd(e);r||(r=document.createRange(),r.selectNodeContents(e),r.collapse(!1)),r.collapsed||r.deleteContents(),r.insertNode(t);const n=document.createTextNode(" ");t.after(n);const o=document.createRange();o.setStart(n,1),o.collapse(!0),jd(e,o),e.normalize()}function zg(e){const t=e.metaKey||e.ctrlKey,r=e.key.toLowerCase(),n=t&&e.altKey&&e.shiftKey&&r==="d",o=!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&r==="f7";return n||o}function _g(e){const t=e.metaKey||e.ctrlKey,r=e.key.toLowerCase(),n=t&&e.altKey&&e.shiftKey&&r==="b",o=!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&r==="f8";return n||o}function cr(e,t,r,n,o){Kd();const a=r==="insert"?qd(e):null,i=t.labels,l=o?vi(o,t):po(n||{},t),s=document.createElement("div");s.className=fe,Ng(e)&&s.classList.add("rte-data-binding-theme-dark");const c=document.createElement("section");c.className="rte-data-binding-dialog",c.setAttribute("role","dialog"),c.setAttribute("aria-modal","true"),c.setAttribute("aria-labelledby","rte-data-binding-dialog-title"),c.innerHTML=`
    <header class="rte-data-binding-header">
      <h2 id="rte-data-binding-dialog-title" class="rte-data-binding-title">${Ce(r==="edit"?i.dialogTitleEdit:i.dialogTitleInsert)}</h2>
      <button type="button" class="rte-data-binding-btn" data-action="cancel" aria-label="${Ce(i.cancelText)}">✕</button>
    </header>
    <div class="rte-data-binding-body">
      <div class="rte-data-binding-field">
        <label for="rte-data-binding-key">${Ce(i.keyLabel)}</label>
        <input id="rte-data-binding-key" class="rte-data-binding-key" type="text" value="${Ce(l.key)}" placeholder="${Ce(i.keyPlaceholder)}" />
      </div>
      <div class="rte-data-binding-field">
        <label for="rte-data-binding-fallback">${Ce(i.fallbackLabel)}</label>
        <input id="rte-data-binding-fallback" class="rte-data-binding-fallback" type="text" value="${Ce(l.fallback||"")}" placeholder="${Ce(i.fallbackPlaceholder)}" />
      </div>
      <div class="rte-data-binding-field">
        <label for="rte-data-binding-format">${Ce(i.formatLabel)}</label>
        <select id="rte-data-binding-format" class="rte-data-binding-format">
          <option value="text" ${l.format==="text"?"selected":""}>Text</option>
          <option value="number" ${l.format==="number"?"selected":""}>Number</option>
          <option value="currency" ${l.format==="currency"?"selected":""}>Currency</option>
          <option value="date" ${l.format==="date"?"selected":""}>Date</option>
          <option value="json" ${l.format==="json"?"selected":""}>JSON</option>
        </select>
      </div>
      <div class="rte-data-binding-field">
        <label for="rte-data-binding-currency">${Ce(i.currencyLabel)}</label>
        <input id="rte-data-binding-currency" class="rte-data-binding-currency" type="text" maxlength="3" value="${Ce(l.currency||"USD")}" placeholder="${Ce(i.currencyPlaceholder)}" />
      </div>
      <p class="rte-data-binding-help">Use dot paths like <code>user.name</code> or <code>order.total</code>.</p>
    </div>
    <footer class="rte-data-binding-footer">
      <button type="button" class="rte-data-binding-btn" data-action="cancel">${Ce(i.cancelText)}</button>
      <button type="button" class="rte-data-binding-btn rte-data-binding-btn-primary" data-action="save">${Ce(i.saveText)}</button>
    </footer>
  `,s.appendChild(c),document.body.appendChild(s);const d=c.querySelector(".rte-data-binding-key"),u=c.querySelector(".rte-data-binding-fallback"),f=c.querySelector(".rte-data-binding-format"),p=c.querySelector(".rte-data-binding-currency"),g=()=>{const C=(f==null?void 0:f.value)==="currency",T=p==null?void 0:p.closest(".rte-data-binding-field");T&&(T.style.display=C?"grid":"none")};g(),f==null||f.addEventListener("change",g);const m=()=>{s.removeEventListener("click",b),s.removeEventListener("keydown",v,!0),document.removeEventListener("keydown",h,!0),s.parentNode&&s.parentNode.removeChild(s),Qn=null,e.focus({preventScroll:!0})},h=C=>{C.key==="Escape"&&(C.preventDefault(),C.stopPropagation(),m())},b=C=>{C.target===s&&m()},y=C=>{if(C.key!=="Tab")return;const T=Array.from(c.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));if(T.length===0)return;const k=T[0],x=T[T.length-1],w=document.activeElement;if(C.shiftKey&&w===k){C.preventDefault(),x.focus();return}!C.shiftKey&&w===x&&(C.preventDefault(),k.focus())},E=async()=>{const C=((d==null?void 0:d.value)||"").trim();if(!C){d==null||d.focus();return}const T=po({key:C,fallback:((u==null?void 0:u.value)||"").trim(),format:(f==null?void 0:f.value)||t.defaultFormat,currency:((p==null?void 0:p.value)||"USD").trim().toUpperCase()},t),k=e.innerHTML;if(o){Wl(o,T,i);const x=Je.get(e)===!0,w=x?await go(e,t):void 0;yr(o,t,x,w)}else{if(a)try{jd(e,a)}catch{}const x=Vd(T,i);if(Wd(e,x),Je.get(e)===!0){const I=await go(e,t);yr(x,t,!0,I)}}ml(e),pl(e,k),m()},v=C=>{if(C.key==="Escape"){C.preventDefault(),m();return}y(C),C.key==="Enter"&&!C.shiftKey&&C.target instanceof HTMLInputElement&&(C.preventDefault(),E())};c.addEventListener("click",C=>{const T=C.target,k=T==null?void 0:T.getAttribute("data-action");if(k){if(k==="cancel"){m();return}k==="save"&&E()}}),s.addEventListener("click",b),s.addEventListener("keydown",v,!0),document.addEventListener("keydown",h,!0),Qn={cleanup:m},d==null||d.focus()}function qg(e){Sa=e,Yr||(Yr=t=>{const r=t.target,n=r==null?void 0:r.closest(_t);if(!n)return;Se=n,se.has(n)||se.set(n,e);const o=se.get(n)||e;Ga(n,o);const a=Je.get(n)===!0;Ul(n,a,o),a||Array.from(n.querySelectorAll(Gr)).forEach(l=>yr(l,o,!1))},document.addEventListener("focusin",Yr,!0)),Zr||(Zr=t=>{if(document.querySelector(`.${fe}`))return;const r=t.target;if(r!=null&&r.closest("input, textarea, select"))return;const n=Ot(void 0,!1);if(!n||eo(n))return;const o=se.get(n)||Sa||e,a=r==null?void 0:r.closest(Gr);if(a&&(t.key==="Enter"||t.key===" ")){t.preventDefault(),t.stopPropagation(),Se=n,cr(n,o,"edit",void 0,a);return}if(zg(t)){t.preventDefault(),t.stopPropagation();const i=gl(n);i?cr(n,o,"edit",void 0,i):cr(n,o,"insert");return}if(_g(t)){t.preventDefault(),t.stopPropagation();const i=Je.get(n)!==!0;Ta(n,o,i)}},document.addEventListener("keydown",Zr,!0)),Xr||(Xr=t=>{if(document.querySelector(`.${fe}`)||t.defaultPrevented||t.button!==0||t.metaKey||t.ctrlKey||t.altKey||t.shiftKey)return;const r=t.target,n=r==null?void 0:r.closest(Gr);if(!n)return;const o=n.closest(_t);if(!o||eo(o))return;const a=se.get(o)||Sa||e;se.set(o,a),Se=o,t.preventDefault(),t.stopPropagation(),n.focus({preventScroll:!0}),cr(o,a,"edit",void 0,n)},document.addEventListener("click",Xr,!0))}function jg(){Yr&&(document.removeEventListener("focusin",Yr,!0),Yr=null),Zr&&(document.removeEventListener("keydown",Zr,!0),Zr=null),Xr&&(document.removeEventListener("click",Xr,!0),Xr=null),Sa=null,Se=null}const Fg=(e={})=>{const t=Xs(e);return Hg(),{name:"dataBinding",toolbar:[{id:"dataBindingTools",label:"Data Binding",type:"group",command:"openDataBindingDialog",items:[{id:"dataBinding",label:"Data Binding",command:"openDataBindingDialog",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M7 4a3 3 0 0 0-3 3v3h2V7a1 1 0 0 1 1-1h3V4H7Zm10 0h-3v2h3a1 1 0 0 1 1 1v3h2V7a3 3 0 0 0-3-3ZM4 14v3a3 3 0 0 0 3 3h3v-2H7a1 1 0 0 1-1-1v-3H4Zm14 0v3a1 1 0 0 1-1 1h-3v2h3a3 3 0 0 0 3-3v-3h-2ZM8.5 12a1.5 1.5 0 1 1 0-3h7a1.5 1.5 0 0 1 0 3h-7Zm0 4a1.5 1.5 0 1 1 0-3h4a1.5 1.5 0 0 1 0 3h-4Z" fill="currentColor"></path></svg>'},{id:"dataBindingPreview",label:"Data Preview",command:"toggleDataBindingPreview",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M12 3c-4.4 0-8 1.3-8 3v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6c0-1.7-3.6-3-8-3Zm0 2c3.9 0 6 .9 6 1s-2.1 1-6 1-6-.9-6-1 2.1-1 6-1Zm0 4c3 0 5.6-.5 7-1.3V11c0 .9-2.7 2-7 2s-7-1.1-7-2V7.7C6.4 8.5 9 9 12 9Zm0 6c-4.3 0-7-1.1-7-2v3c0 .9 2.7 2 7 2s7-1.1 7-2v-3c0 .9-2.7 2-7 2Z" fill="currentColor"></path><path d="M16.5 9.4a1 1 0 0 1 1.4 0l1.1 1.1 1.8-1.8a1 1 0 1 1 1.4 1.4l-2.5 2.5a1 1 0 0 1-1.4 0l-1.8-1.8a1 1 0 0 1 0-1.4Z" fill="currentColor"></path></svg>'}]}],commands:{openDataBindingDialog:(r,n)=>{const o=Ot(n);if(!o||eo(o))return!1;Se=o;const a=se.get(o)||t;se.set(o,a),Ga(o,a);const i=r==null?void 0:r.target;if(i==="insert")return cr(o,a,"insert",r),!0;const l=gl(o);return i==="edit"||l?!l&&i==="edit"?!1:(cr(o,a,"edit",r,l||void 0),!0):(cr(o,a,"insert",r),!0)},insertDataBindingToken:async(r,n)=>{const o=Ot(n);if(!o||eo(o))return!1;Se=o;const a=se.get(o)||t;se.set(o,a);const i=po(r||{},a);if(!i.key)return!1;const l=o.innerHTML,s=Vd(i,a.labels);if(Wd(o,s),Je.get(o)===!0){const d=await go(o,a);yr(s,a,!0,d)}return ml(o),pl(o,l),!0},editDataBindingToken:async(r,n)=>{const o=Ot(n);if(!o||eo(o))return!1;Se=o;const a=se.get(o)||t;se.set(o,a);const i=gl(o);if(!i)return!1;const l=vi(i,a),s=po({...l,...r||{}},a);if(!s.key)return!1;const c=o.innerHTML;Wl(i,s,a.labels);const d=Je.get(o)===!0,u=d?await go(o,a):void 0;return yr(i,a,d,u),ml(o),pl(o,c),!0},toggleDataBindingPreview:async(r,n)=>{const o=Ot(n);if(!o)return!1;Se=o;const a=se.get(o)||t;se.set(o,a);const i=typeof r=="boolean"?r:Je.get(o)!==!0;return await Ta(o,a,i),!0},setDataBindingData:async(r,n)=>{const o=Ot(n);if(!o)return!1;if(Se=o,r&&typeof r=="object"?(fl.set(o,r),Jn.set(o,{timestamp:Date.now(),data:r})):(fl.delete(o),Jn.delete(o)),Je.get(o)===!0){const a=se.get(o)||t;await Ta(o,a,!0)}return!0},refreshDataBindings:async(r,n)=>{const o=Ot(n);if(!o)return!1;Se=o,Jn.delete(o);const a=se.get(o)||t;se.set(o,a);const i=Je.get(o)===!0;return await Ta(o,a,i),!0}},keymap:{"Mod-Alt-Shift-d":"openDataBindingDialog","Mod-Alt-Shift-D":"openDataBindingDialog","Mod-Alt-Shift-b":"toggleDataBindingPreview","Mod-Alt-Shift-B":"toggleDataBindingPreview",F7:"openDataBindingDialog",F8:"toggleDataBindingPreview"},init:function(n){ea+=1;const o=this&&typeof this.__pluginConfig=="object"?Xs({...t,...this.__pluginConfig}):t;qg(o);const a=Ot(n&&n.editorElement?{editorElement:n.editorElement}:void 0,!1);if(a){Se=a,se.set(a,o),Ga(a,o);const i=Je.get(a)===!0;Ul(a,i,o)}},destroy:()=>{ea=Math.max(0,ea-1),ea===0&&(Kd(),jg())}}},kt=".rte-content, .editora-content",Js="rte-citations-styles",K="rte-citations-panel",ki=".rte-citation-ref[data-citation-id]",Bo='.rte-citation-bibliography[data-type="citation-bibliography"]',Po='.rte-citation-footnotes[data-type="citation-footnotes"]',Be=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',mr=["apa","mla","chicago"],Vg={panelTitle:"Citations",panelAriaLabel:"Citations panel",styleLabel:"Citation style",authorLabel:"Author",yearLabel:"Year",titleLabel:"Title",sourceLabel:"Source",urlLabel:"URL",noteLabel:"Footnote note",insertText:"Insert Citation",refreshText:"Refresh Bibliography",closeText:"Close",bibliographyTitle:"References",footnotesTitle:"Citation Notes",noCitationsText:"No citations inserted yet.",styleButtonPrefix:"Style",recentHeading:"Recent citations",deleteRecentText:"x",summaryPrefix:"Citations",invalidMessage:"Author and title are required."},D=new WeakMap,Zt=new WeakMap,Qs=new WeakMap,Tn=new WeakMap,bt=new Map,Oo=new WeakMap,Za=new WeakMap,bo=new Set;let Jr=null,Qr=null,en=null,Ft=null,ra=0,Kg=0,Ui=0,Yt=null,pe=null;function G(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Wg(e){return e.replace(/\u00A0/g," ").replace(/\s+/g," ").trim()}function Ud(e,t){const r=t(e);if(!r)return"";const n=r.match(/\d{4}/);return n?n[0]:r}function Gd(e,t){const r=t(e);return r?/^https?:\/\//i.test(r)?r:`https://${r}`:""}function Bn(e){return e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)}function Zd(e,t){return{id:Bn(t.normalizeText(e.id||"")),author:t.normalizeText(e.author||""),year:Ud(e.year||"",t.normalizeText)||void 0,title:t.normalizeText(e.title||""),source:t.normalizeText(e.source||"")||void 0,url:Gd(e.url||"",t.normalizeText)||void 0,note:t.normalizeText(e.note||"")||void 0}}function $a(e={}){const t=e.defaultStyle&&mr.includes(e.defaultStyle)?e.defaultStyle:"apa",r={...Vg,...e.labels||{}};return{defaultStyle:t,enableFootnoteSync:e.enableFootnoteSync!==!1,debounceMs:Math.max(80,Number(e.debounceMs??220)),maxRecentCitations:Math.max(3,Math.min(30,Number(e.maxRecentCitations??8))),labels:r,normalizeText:e.normalizeText||Wg,generateCitationId:typeof e.generateCitationId=="function"?e.generateCitationId:void 0}}function Yd(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function Gl(e){return e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||e}function na(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function Ug(e){const t=Gl(e);if(na(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return na(r)?!0:na(document.documentElement)||na(document.body)}function Ya(e,t){e.classList.remove("rte-citations-theme-dark"),Ug(t)&&e.classList.add("rte-citations-theme-dark")}function Re(e,t=!0){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const o=e.editorElement;if(o.matches(kt))return o;const a=o.querySelector(kt);if(a instanceof HTMLElement)return a}const r=window.getSelection();if(r&&r.rangeCount>0){const o=r.getRangeAt(0).startContainer,a=Yd(o),i=a==null?void 0:a.closest(kt);if(i)return i}const n=document.activeElement;if(n){if(n.matches(kt))return n;const o=n.closest(kt);if(o)return o}return pe&&pe.isConnected?pe:(pe&&!pe.isConnected&&(pe=null),t?document.querySelector(kt):null)}function Ct(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function ho(e){const t=Yd(e);return t?!!(t.closest(Bo)||t.closest(Po)):!1}function Gg(e,t){if(Ui+=1,t.generateCitationId){const r=t.generateCitationId({editor:e,index:Ui}),n=Bn(t.normalizeText(r||""));if(n)return n}return`cite-${Date.now().toString(36)}-${Ui.toString(36)}`}function Gi(e){return e.map(t=>(t||"").trim()).filter(Boolean).join(" ").trim()}function Zg(e,t){const r=e.author||"Unknown",n=e.year||"n.d.";return t==="mla"?`(${r} ${n})`:t==="chicago"?`(${r} ${n})`:`(${r}, ${n})`}function Zl(e,t){const r=e.author||"Unknown",n=e.year||"n.d.",o=e.title||"Untitled",a=e.source||"",i=e.url||"";return Gi(t==="mla"?[`${r}.`,`"${o}."`,a?`${a},`:"",`${n}.`,i]:t==="chicago"?[`${r}.`,`${o}.`,a?`${a}.`:"",`(${n}).`,i]:[`${r}.`,`(${n}).`,`${o}.`,a?`${a}.`:"",i])}function xr(e){return Array.from(e.querySelectorAll(ki)).filter(t=>!t.closest(Bo)&&!t.closest(Po))}function Xd(e,t){const r=Bn(t.normalizeText(e.getAttribute("data-citation-id")||""));if(!r)return null;const n=t.normalizeText(e.getAttribute("data-citation-author")||""),o=t.normalizeText(e.getAttribute("data-citation-title")||"");return{id:r,author:n||"Unknown",year:Ud(e.getAttribute("data-citation-year")||"",t.normalizeText)||void 0,title:o||"Untitled",source:t.normalizeText(e.getAttribute("data-citation-source")||"")||void 0,url:Gd(e.getAttribute("data-citation-url")||"",t.normalizeText)||void 0,note:t.normalizeText(e.getAttribute("data-citation-note")||"")||void 0}}function Jd(e,t,r){e.classList.add("rte-citation-ref"),e.setAttribute("data-citation-id",t.id),e.setAttribute("data-citation-author",t.author||""),e.setAttribute("data-citation-year",t.year||""),e.setAttribute("data-citation-title",t.title||""),e.setAttribute("data-citation-source",t.source||""),e.setAttribute("data-citation-url",t.url||""),e.setAttribute("data-citation-note",t.note||""),e.setAttribute("contenteditable","false"),e.setAttribute("tabindex","0"),e.setAttribute("role","doc-biblioref"),e.setAttribute("data-style",r),e.textContent=Zg(t,r)}function wi(e,t,r){const n=Gl(e);Array.from(n.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",r),a.setAttribute("data-active",r?"true":"false"),a.setAttribute("aria-pressed",r?"true":"false")})}function vr(e,t){const r=Zt.get(e);return r&&mr.includes(r)?r:(t==null?void 0:t.defaultStyle)||"apa"}function yo(e,t){const r=xr(e),n=new Map;return r.forEach(o=>{const a=Xd(o,t);if(!a)return;if(!n.has(a.id)){n.set(a.id,a);return}const i=n.get(a.id);n.set(a.id,{...i,author:i.author||a.author,title:i.title||a.title,year:i.year||a.year,source:i.source||a.source,url:i.url||a.url,note:i.note||a.note})}),Array.from(n.values())}function Yg(e,t,r){const n=Zd(t,r);if(!n.id||!n.author||!n.title)return;const a=(Tn.get(e)||[]).filter(i=>i.id!==n.id);Tn.set(e,[n,...a].slice(0,r.maxRecentCitations))}function Ei(e,t,r){const n=Tn.get(e)||[],o=new Map;t.slice(Math.max(0,t.length-r.maxRecentCitations)).reverse().forEach(i=>{i.id&&o.set(i.id,i)}),n.forEach(i=>{!i.id||o.has(i.id)||o.set(i.id,i)});const a=Array.from(o.values()).slice(0,r.maxRecentCitations);return Tn.set(e,a),a}function Qd(e,t,r,n){const o=Bn(n.normalizeText(t||""));return o&&Ei(e,r,n).find(i=>i.id===o)||null}function Xg(e,t,r){const n=Bn(r.normalizeText(t||""));if(!n)return!1;const o=Tn.get(e)||[],a=o.filter(i=>i.id!==n);return a.length===o.length?!1:(Tn.set(e,a),!0)}function eu(e,t,r){const n=document.createElement("section");n.className=e,n.setAttribute("data-type",t),n.setAttribute("contenteditable","false"),n.setAttribute("aria-label",r),t==="citation-bibliography"?n.setAttribute("role","doc-bibliography"):t==="citation-footnotes"&&n.setAttribute("role","doc-endnotes");const o=document.createElement("h3");o.className="rte-citation-section-title",o.textContent=r;const a=document.createElement("ol");return a.className="rte-citation-list",a.setAttribute("role","list"),n.appendChild(o),n.appendChild(a),n}function Jg(e,t){let r=e.querySelector(Bo);r||(r=eu("rte-citation-bibliography","citation-bibliography",t.labels.bibliographyTitle),e.appendChild(r));const n=r.querySelector(".rte-citation-section-title");return n&&(n.textContent=t.labels.bibliographyTitle),r.setAttribute("aria-label",t.labels.bibliographyTitle),r}function Qg(e,t){let r=e.querySelector(Po);r||(r=eu("rte-citation-footnotes","citation-footnotes",t.labels.footnotesTitle),e.appendChild(r));const n=r.querySelector(".rte-citation-section-title");return n&&(n.textContent=t.labels.footnotesTitle),r.setAttribute("aria-label",t.labels.footnotesTitle),r}function tu(e,t){const r=e.querySelector(t);r==null||r.remove()}function eb(e,t,r,n){if(t.length===0){tu(e,Bo);return}const a=Jg(e,r).querySelector(".rte-citation-list");if(!a)return;const i=document.createDocumentFragment();t.forEach((l,s)=>{const c=document.createElement("li");c.className="rte-citation-item",c.id=`rte-citation-entry-${l.id}`,c.setAttribute("data-citation-id",l.id),c.setAttribute("data-citation-number",String(s+1)),c.textContent=Zl(l,n),i.appendChild(c)}),a.innerHTML="",a.appendChild(i)}function tb(e,t,r,n){if(!r.enableFootnoteSync||t.length===0){tu(e,Po),xr(e).forEach(d=>{d.removeAttribute("data-footnote-number"),d.removeAttribute("data-footnote-target")});return}const a=Qg(e,r).querySelector(".rte-citation-list");if(!a)return;const i=new Map,l=new Map;t.forEach((d,u)=>{l.set(d.id,u+1)});const s=new Map;xr(e).forEach(d=>{const u=d.getAttribute("data-citation-id")||"";if(!u||!l.has(u))return;const f=(s.get(u)||0)+1;s.set(u,f);const p=`rte-citation-ref-${u}-${f}`;d.id=p;const g=l.get(u);d.setAttribute("data-footnote-number",String(g)),d.setAttribute("data-footnote-target",`rte-citation-note-${u}`),i.has(u)||i.set(u,p)});const c=document.createDocumentFragment();t.forEach((d,u)=>{const f=document.createElement("li");f.className="rte-citation-item rte-citation-footnote-item",f.id=`rte-citation-note-${d.id}`,f.setAttribute("data-citation-id",d.id);const p=document.createElement("span");p.className="rte-citation-footnote-number",p.textContent=`${u+1}. `;const g=document.createElement("span");g.className="rte-citation-footnote-text";const m=d.note?`${d.note}. `:"";g.textContent=`${m}${Zl(d,n)}`,f.appendChild(p),f.appendChild(g);const h=i.get(d.id);if(h){const b=document.createElement("a");b.className="rte-citation-backref",b.href=`#${h}`,b.setAttribute("aria-label",`Back to citation ${u+1}`),b.textContent="Back",f.appendChild(b)}c.appendChild(f)}),a.innerHTML="",a.appendChild(c)}function rb(e,t,r,n){const o=Zl(t,r);e.setAttribute("data-citation-number",String(n)),e.setAttribute("aria-label",`Citation ${n}: ${o}`)}function nb(e,t,r){const n=xr(e);let o=`${t}:${r?"1":"0"}:${n.length}`;return n.forEach(a=>{o+=`|${a.getAttribute("data-citation-id")||""}`,o+=`|${a.getAttribute("data-citation-author")||""}`,o+=`|${a.getAttribute("data-citation-year")||""}`,o+=`|${a.getAttribute("data-citation-title")||""}`,o+=`|${a.getAttribute("data-citation-source")||""}`,o+=`|${a.getAttribute("data-citation-url")||""}`,o+=`|${a.getAttribute("data-citation-note")||""}`}),o}function $n(e){const t=bt.get(e);if(!t)return;const r=D.get(e)||Yt;if(!r)return;const n=vr(e,r),o=yo(e,r),a=Ei(e,o,r),i=t.querySelector(".rte-citations-status"),l=t.querySelector('[data-action="cycle-style"]'),s=t.querySelector(".rte-citations-recent-list");if(i){const c=o.length;i.textContent=`${r.labels.summaryPrefix}: ${c} | Style: ${n.toUpperCase()} | Footnotes: ${r.enableFootnoteSync?"On":"Off"}`}if(l&&(l.textContent=`${r.labels.styleButtonPrefix}: ${n.toUpperCase()}`,l.setAttribute("aria-label",`${r.labels.styleButtonPrefix}: ${n.toUpperCase()}`)),s){if(a.length===0){s.innerHTML=`<li class="rte-citations-empty">${G(r.labels.noCitationsText)}</li>`;return}s.innerHTML=a.map(c=>`
          <li class="rte-citations-recent-item">
            <div class="rte-citations-recent-row">
              <button
                type="button"
                class="rte-citations-recent-btn"
                data-action="insert-from-recent"
                data-citation-id="${G(c.id)}"
                aria-label="Insert citation: ${G(c.title)}"
              >
                <span class="rte-citations-recent-title">${G(c.title)}</span>
                <span class="rte-citations-recent-meta">${G(c.author)}${c.year?` (${G(c.year)})`:""}</span>
              </button>
              <button
                type="button"
                class="rte-citations-recent-delete"
                data-action="delete-by-id"
                data-citation-id="${G(c.id)}"
                aria-label="Delete citation: ${G(c.title)}"
              >${G(r.labels.deleteRecentText)}</button>
            </div>
          </li>
        `).join("")}}function Fe(e,t,r=!1){const n=vr(e,t),o=nb(e,n,t.enableFootnoteSync);if(!r&&Qs.get(e)===o)return yo(e,t);const a=xr(e),i=new Map;a.forEach(c=>{const d=Xd(c,t);d&&(i.has(d.id)||i.set(d.id,d))});const l=Array.from(i.values());Ei(e,l,t);const s=new Map;return l.forEach((c,d)=>{s.set(c.id,d+1)}),a.forEach(c=>{const d=c.getAttribute("data-citation-id")||"",u=i.get(d);if(!u)return;Jd(c,u,n);const f=s.get(u.id)||1;rb(c,u,n,Math.max(1,f))}),eb(e,l,t,n),tb(e,l,t,n),Qs.set(e,o),$n(e),e.dispatchEvent(new CustomEvent("editora:citations-refreshed",{bubbles:!0,detail:{citations:l,style:n,footnoteSync:t.enableFootnoteSync}})),l}function ru(e){const t=Za.get(e);typeof t=="number"&&(window.clearTimeout(t),bo.delete(t),Za.delete(e))}function nu(e){const t=D.get(e)||Yt;if(!t)return;ru(e);const r=window.setTimeout(()=>{bo.delete(r),Za.delete(e),Fe(e,t,!1)},t.debounceMs);bo.add(r),Za.set(e,r)}function ob(e){const t=window.getSelection();if(!t)throw new Error("Selection unavailable");if(t.rangeCount>0){const i=t.getRangeAt(0);if(e.contains(i.commonAncestorContainer)&&!ho(i.commonAncestorContainer))return i.cloneRange()}const r=document.createRange(),n=e.querySelector(Bo),o=e.querySelector(Po),a=n||o;return a?(r.setStartBefore(a),r.collapse(!0),r):(r.selectNodeContents(e),r.collapse(!1),r)}function Yl(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function Xl(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function ou(e,t){const r=window.getSelection();if(!r)return;const n=document.createRange();if(e.nodeType===Node.TEXT_NODE){const o=e,a=Math.max(0,Math.min(t,o.length));n.setStart(o,a)}else{const o=e.childNodes.length,a=Math.max(0,Math.min(t,o));n.setStart(e,a)}n.collapse(!0),r.removeAllRanges(),r.addRange(n)}function au(e){if(e.collapsed||e.startContainer!==e.endContainer||e.endOffset!==e.startOffset+1||!(e.startContainer instanceof Element||e.startContainer instanceof DocumentFragment))return null;const t=e.startContainer.childNodes[e.startOffset];return!(t instanceof HTMLElement)||!t.matches(ki)?null:t}function oa(e,t,r){const{startContainer:n,startOffset:o}=e;if(n.nodeType===Node.ELEMENT_NODE){const i=n;if(r==="previous"){if(o>0)return i.childNodes[o-1]||null}else if(o<i.childNodes.length)return i.childNodes[o]||null}if(n.nodeType===Node.TEXT_NODE&&(r==="previous"&&o<n.data.length||r==="next"&&o>0))return null;let a=n;for(;a&&a!==t;){const i=r==="previous"?a.previousSibling:a.nextSibling;if(i)return i;a=a.parentNode}return null}function iu(e,t,r){if(!e.collapsed)return null;const n=i=>i instanceof HTMLElement&&i.matches(ki)?i:null,{startContainer:o,startOffset:a}=e;if(o.nodeType===Node.ELEMENT_NODE){const i=o;return r==="Backspace"&&a>0?n(i.childNodes[a-1]||null):r==="Delete"?n(i.childNodes[a]||null):null}if(o.nodeType===Node.TEXT_NODE){const i=o;if(r==="Backspace"&&a===0){const l=n(i.previousSibling);return l||n(oa(e,t,"previous"))}if(r==="Delete"&&a===i.data.length){const l=n(i.nextSibling);return l||n(oa(e,t,"next"))}}return n(r==="Backspace"?oa(e,t,"previous"):oa(e,t,"next"))}function tn(e,t,r){const n=e.closest(kt);if(!n||ho(e))return!1;const o=e.parentNode;if(!o)return!1;const a=n.innerHTML,i=Array.from(o.childNodes).indexOf(e);if(i<0)return!1;const l=e.nextSibling;return l instanceof Text&&(l.data===" "?l.remove():l.data.startsWith(" ")&&(l.data=l.data.slice(1))),e.remove(),ou(o,i),Fe(n,r,!0),Xl(n,a),Yl(n),t==="Delete"&&n.focus({preventScroll:!0}),!0}function ab(e,t,r){if(e.key!=="Backspace"&&e.key!=="Delete")return!1;const n=e.key,o=e.target;if(o!=null&&o.matches(ki)&&t.contains(o)&&!ho(o))return e.preventDefault(),e.stopPropagation(),tn(o,n,r);const a=window.getSelection();if(!a||a.rangeCount===0)return!1;const i=a.getRangeAt(0);if(!t.contains(i.commonAncestorContainer)||ho(i.commonAncestorContainer))return!1;const l=au(i);if(l)return e.preventDefault(),e.stopPropagation(),tn(l,n,r);const s=iu(i,t,n);return s?(e.preventDefault(),e.stopPropagation(),tn(s,n,r)):!1}function lu(e,t,r){const n=Bn(r.normalizeText(t||""));if(!n)return!1;const o=xr(e).filter(i=>i.getAttribute("data-citation-id")===n);if(o.length===0)return!1;if(o.length===1)return tn(o[0],"Delete",r);const a=e.innerHTML;return o.forEach(i=>{const l=i.nextSibling;l instanceof Text&&(l.data===" "?l.remove():l.data.startsWith(" ")&&(l.data=l.data.slice(1))),i.remove()}),ou(e,e.childNodes.length),Fe(e,r,!0),Xl(e,a),Yl(e),e.focus({preventScroll:!0}),!0}function ib(e,t){const r=window.getSelection();if(!r||r.rangeCount===0)return!1;const n=r.getRangeAt(0);if(!e.contains(n.commonAncestorContainer)||ho(n.commonAncestorContainer))return!1;const o=au(n);if(o)return tn(o,"Delete",t);const a=iu(n,e,"Backspace");return a?tn(a,"Backspace",t):!1}function Xa(e,t,r){var d,u;const n=Zd(t,r);if(!n.author||!n.title)return!1;n.id||(n.id=Gg(e,r));const o=e.innerHTML;let a;try{a=ob(e)}catch{return!1}const i=window.getSelection();if(!i)return!1;a.collapsed||a.deleteContents();const l=document.createElement("span");Jd(l,n,vr(e,r));try{a.insertNode(l)}catch{return!1}const s=document.createTextNode(" ");l.nextSibling?(d=l.parentNode)==null||d.insertBefore(s,l.nextSibling):(u=l.parentNode)==null||u.appendChild(s);const c=document.createRange();if(s.parentNode){const f=Array.from(s.parentNode.childNodes).indexOf(s)+1;c.setStart(s.parentNode,Math.max(0,f))}else c.setStartAfter(l);return c.collapse(!0),i.removeAllRanges(),i.addRange(c),Yg(e,n,r),Fe(e,r,!0),Xl(e,o),Yl(e),!0}function lb(e,t){if(!t)return!1;const r=xr(e).find(a=>a.getAttribute("data-citation-id")===t)||null;if(!r)return!1;r.scrollIntoView({behavior:"smooth",block:"center",inline:"nearest"}),r.focus({preventScroll:!0});const n=window.getSelection();if(!n)return!0;const o=document.createRange();return o.selectNode(r),n.removeAllRanges(),n.addRange(o),!0}function Ja(e){return Oo.get(e)===!0}function xo(e,t=!1){const r=bt.get(e);r&&(r.classList.remove("show"),Oo.set(e,!1),wi(e,"toggleCitationsPanel",!1),t&&e.focus({preventScroll:!0}))}function sb(e){bt.forEach((t,r)=>{r!==e&&xo(r,!1)})}function bl(e,t){if(!t.classList.contains("show"))return;const n=Gl(e).getBoundingClientRect(),o=Math.min(window.innerWidth-20,380),a=Math.max(10,window.innerWidth-o-10),i=Math.min(Math.max(10,n.right-o),a),l=Math.max(10,Math.min(window.innerHeight-10-260,n.top+10));t.style.width=`${o}px`,t.style.left=`${i}px`,t.style.top=`${l}px`,t.style.maxHeight=`${Math.max(260,window.innerHeight-24)}px`}function Qe(e,t){return e.querySelector(`[data-field="${t}"]`)}function cb(e){var l,s,c,d,u,f;const t=((l=Qe(e,"author"))==null?void 0:l.value)||"",r=((s=Qe(e,"year"))==null?void 0:s.value)||"",n=((c=Qe(e,"title"))==null?void 0:c.value)||"",o=((d=Qe(e,"source"))==null?void 0:d.value)||"",a=((u=Qe(e,"url"))==null?void 0:u.value)||"",i=((f=Qe(e,"note"))==null?void 0:f.value)||"";return{author:t,year:r,title:n,source:o,url:a,note:i}}function yt(e,t){const r=e.querySelector(".rte-citations-live");r&&(r.textContent=t)}function db(e,t,r){const n=Qe(t,"style");n&&(n.value=vr(e,r))}function su(e,t,r){const n=mr.includes(t)?t:r.defaultStyle;return Zt.set(e,n),Fe(e,r,!0),n}function Jl(e,t){const r=vr(e,t),n=mr.indexOf(r),o=mr[(n+1)%mr.length];return Zt.set(e,o),Fe(e,t,!0),o}function ub(e){const t=bt.get(e);if(t)return t;const r=D.get(e)||Yt||$a(),n=`rte-citations-panel-${Kg++}`,o=document.createElement("section");o.className=K,o.id=n,o.setAttribute("role","dialog"),o.setAttribute("aria-modal","false"),o.setAttribute("aria-label",r.labels.panelAriaLabel),o.setAttribute("tabindex","-1"),o.innerHTML=`
    <header class="rte-citations-header">
      <h2 class="rte-citations-title">${G(r.labels.panelTitle)}</h2>
      <button type="button" class="rte-citations-icon-btn" data-action="close" aria-label="${G(r.labels.closeText)}">✕</button>
    </header>
    <div class="rte-citations-body">
      <p class="rte-citations-status" aria-live="polite"></p>

      <div class="rte-citations-grid">
        <label class="rte-citations-label">
          ${G(r.labels.styleLabel)}
          <select data-field="style" class="rte-citations-field">
            <option value="apa">APA</option>
            <option value="mla">MLA</option>
            <option value="chicago">Chicago</option>
          </select>
        </label>
        <label class="rte-citations-label">
          ${G(r.labels.authorLabel)}
          <input type="text" data-field="author" class="rte-citations-field" autocomplete="off" />
        </label>
        <label class="rte-citations-label">
          ${G(r.labels.yearLabel)}
          <input type="text" data-field="year" class="rte-citations-field" inputmode="numeric" autocomplete="off" />
        </label>
        <label class="rte-citations-label">
          ${G(r.labels.titleLabel)}
          <input type="text" data-field="title" class="rte-citations-field" autocomplete="off" />
        </label>
        <label class="rte-citations-label">
          ${G(r.labels.sourceLabel)}
          <input type="text" data-field="source" class="rte-citations-field" autocomplete="off" />
        </label>
        <label class="rte-citations-label">
          ${G(r.labels.urlLabel)}
          <input type="url" data-field="url" class="rte-citations-field" autocomplete="off" />
        </label>
        <label class="rte-citations-label rte-citations-label-note">
          ${G(r.labels.noteLabel)}
          <textarea data-field="note" class="rte-citations-field" rows="2"></textarea>
        </label>
      </div>

      <div class="rte-citations-controls" role="toolbar" aria-label="Citation actions">
        <button type="button" class="rte-citations-btn rte-citations-btn-primary" data-action="insert">${G(r.labels.insertText)}</button>
        <button type="button" class="rte-citations-btn" data-action="refresh">${G(r.labels.refreshText)}</button>
        <button type="button" class="rte-citations-btn" data-action="cycle-style"></button>
      </div>

      <section class="rte-citations-recent" aria-label="${G(r.labels.recentHeading)}">
        <h3 class="rte-citations-recent-heading">${G(r.labels.recentHeading)}</h3>
        <ul class="rte-citations-recent-list" role="list"></ul>
      </section>

      <p class="rte-citations-shortcut">Shortcut: Ctrl/Cmd + Alt + Shift + C</p>
      <span class="rte-citations-live" aria-live="polite"></span>
    </div>
  `,o.addEventListener("click",i=>{const l=i.target;if(!l)return;const s=l.closest("[data-action]");if(!s)return;const c=s.getAttribute("data-action")||"",d=D.get(e)||Yt||r;if(D.set(e,d),c==="close"){xo(e,!0);return}if(c==="insert"){if(Ct(e))return;const u=cb(o);if(!d.normalizeText(u.author)||!d.normalizeText(u.title)){yt(o,d.labels.invalidMessage);return}if(!Xa(e,u,d)){yt(o,d.labels.invalidMessage);return}yt(o,"Citation inserted.");const p=Qe(o,"title"),g=Qe(o,"note");p&&(p.value=""),g&&(g.value="");return}if(c==="refresh"){const u=Fe(e,d,!0);yt(o,`Refreshed ${u.length} citation${u.length===1?"":"s"}.`);return}if(c==="cycle-style"){const u=Jl(e,d);db(e,o,d),yt(o,`Style changed to ${u.toUpperCase()}.`);return}if(c==="insert-from-recent"){if(Ct(e))return;const u=s.getAttribute("data-citation-id")||"",f=Qd(e,u,yo(e,d),d);if(!f)return;Xa(e,f,d),yt(o,`Inserted citation: ${f.title}.`);return}if(c==="delete-by-id"){if(Ct(e))return;const u=s.getAttribute("data-citation-id")||"";if(lu(e,u,d)){yt(o,"Citation deleted.");return}Xg(e,u,d)&&($n(e),yt(o,"Removed from recent citations."))}}),o.addEventListener("keydown",i=>{if(i.key==="Escape"){i.preventDefault(),xo(e,!0);return}const l=i.target;if(!l||!l.matches(".rte-citations-recent-btn")||i.key!=="ArrowDown"&&i.key!=="ArrowUp")return;const s=Array.from(o.querySelectorAll(".rte-citations-recent-btn"));if(s.length===0)return;const c=s.indexOf(l);if(c<0)return;i.preventDefault();const d=i.key==="ArrowDown"?1:-1,u=(c+d+s.length)%s.length;s[u].focus()});const a=Qe(o,"style");return a==null||a.addEventListener("change",()=>{const i=D.get(e)||Yt||r,l=a.value;su(e,l,i),yt(o,`Style changed to ${l.toUpperCase()}.`)}),Ya(o,e),document.body.appendChild(o),bt.set(e,o),Oo.set(e,!1),$n(e),o}function Dr(e){const t=ub(e);sb(e),t.classList.add("show"),Oo.set(e,!0),wi(e,"toggleCitationsPanel",!0),Ya(t,e),bl(e,t),$n(e);const r=Qe(t,"author");r==null||r.focus()}function cu(e,t){const r=Ja(e);return(typeof t=="boolean"?t:!r)?Dr(e):xo(e,!1),!0}function fb(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="c"}function mb(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="b"}function pb(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="j"}function gb(e){Yt=e,Jr||(Jr=t=>{const r=t.target,n=r==null?void 0:r.closest(kt);if(!n)return;pe=n,D.has(n)||D.set(n,e),Zt.has(n)||Zt.set(n,e.defaultStyle);const o=bt.get(n);o&&(Ya(o,n),bl(n,o)),wi(n,"toggleCitationsPanel",Ja(n))},document.addEventListener("focusin",Jr,!0)),Qr||(Qr=t=>{const r=t.target,n=r==null?void 0:r.closest(kt);n&&(pe=n,nu(n))},document.addEventListener("input",Qr,!0)),en||(en=t=>{if(t.defaultPrevented)return;const r=t.target,n=!!(r!=null&&r.closest(`.${K} input, .${K} textarea, .${K} select`)),o=Re(void 0,!1);if(!o||Ct(o))return;const a=D.get(o)||Yt||e;if(D.set(o,a),pe=o,t.key==="Escape"&&Ja(o)){t.preventDefault(),xo(o,!0);return}if(!n&&!ab(t,o,a)){if(fb(t)){t.preventDefault(),t.stopPropagation(),cu(o);return}if(mb(t)){t.preventDefault(),t.stopPropagation(),Fe(o,a,!0),Dr(o);return}pb(t)&&(t.preventDefault(),t.stopPropagation(),Jl(o,a))}},document.addEventListener("keydown",en,!0)),Ft||(Ft=()=>{bt.forEach((t,r)=>{if(!r.isConnected||!t.isConnected){ru(r),t.remove(),bt.delete(r),Oo.delete(r);return}Ya(t,r),bl(r,t)})},window.addEventListener("scroll",Ft,!0),window.addEventListener("resize",Ft))}function bb(){Jr&&(document.removeEventListener("focusin",Jr,!0),Jr=null),Qr&&(document.removeEventListener("input",Qr,!0),Qr=null),en&&(document.removeEventListener("keydown",en,!0),en=null),Ft&&(window.removeEventListener("scroll",Ft,!0),window.removeEventListener("resize",Ft),Ft=null),bt.forEach(e=>e.remove()),bt.clear(),Yt=null,pe=null}function hb(){if(typeof document>"u"||document.getElementById(Js))return;const e=document.createElement("style");e.id=Js,e.textContent=`
    .rte-toolbar-group-items.citations,
    .editora-toolbar-group-items.citations {
      display: flex;
      border: 1px solid #ccc;
      border-radius: 3px;
      background: #fff;
    }

    .rte-toolbar-group-items.citations .rte-toolbar-button,
    .editora-toolbar-group-items.citations .editora-toolbar-button {
      border: none;
      border-radius: 0;
      border-right: 1px solid #ccc;
    }

    .rte-toolbar-group-items.citations .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.citations .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    .rte-toolbar-button[data-command="toggleCitationsPanel"].active,
    .editora-toolbar-button[data-command="toggleCitationsPanel"].active {
      background: #ccc;
    }

    ${Be} .rte-toolbar-group-items.citations,
    ${Be} .editora-toolbar-group-items.citations,
    .${K}.rte-citations-theme-dark {
      border-color: #566275;
    }

    ${Be} .rte-toolbar-group-items.citations .rte-toolbar-button[data-command="refreshCitations"] svg,
    ${Be} .editora-toolbar-group-items.citations .editora-toolbar-button[data-command="refreshCitations"] svg
    {
      fill: none;
    }
    ${Be} .rte-toolbar-group-items.citations .rte-toolbar-button,
    ${Be} .editora-toolbar-group-items.citations .editora-toolbar-button
    {
      border-color: #566275;
    }
    ${Be} .rte-toolbar-button[data-command="toggleCitationsPanel"].active,
    ${Be} .editora-toolbar-button[data-command="toggleCitationsPanel"].active {
      background: linear-gradient(180deg, #5eaaf6 0%, #4a95de 100%);
    }
    .${K} {
      position: fixed;
      z-index: 1500;
      right: 16px;
      top: 16px;
      width: min(380px, calc(100vw - 20px));
      max-height: calc(100vh - 24px);
      display: none;
      flex-direction: column;
      border-radius: 12px;
      border: 1px solid #d1d5db;
      background: #ffffff;
      color: #0f172a;
      box-shadow: 0 18px 38px rgba(15, 23, 42, 0.16);
      overflow: hidden;
    }

    .${K}.show {
      display: flex;
    }

    .${K}.rte-citations-theme-dark {
      background: #0f172a;
      color: #e2e8f0;
      border-color: #334155;
      box-shadow: 0 20px 40px rgba(2, 6, 23, 0.5);
    }

    .rte-citations-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
    }

    .${K}.rte-citations-theme-dark .rte-citations-header {
      border-bottom-color: #334155;
      background: #111827;
    }

    .rte-citations-title {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
    }

    .rte-citations-icon-btn {
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      border-radius: 6px;
      cursor: pointer;
      min-width: 34px;
      min-height: 34px;
      width: 34px;
      height: 34px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      line-height: 1;
      font-weight: 600;
    }

    .rte-citations-icon-btn:hover,
    .rte-citations-icon-btn:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .${K}.rte-citations-theme-dark .rte-citations-icon-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    .${K}.rte-citations-theme-dark .rte-citations-icon-btn:hover,
    .${K}.rte-citations-theme-dark .rte-citations-icon-btn:focus-visible {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.24);
    }

    .rte-citations-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      overflow: auto;
    }

    .rte-citations-status {
      margin: 0;
      font-size: 12px;
      color: #475569;
    }

    .${K}.rte-citations-theme-dark .rte-citations-status {
      color: #94a3b8;
    }

    .rte-citations-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .rte-citations-label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      color: inherit;
    }

    .rte-citations-label-note {
      grid-column: 1 / -1;
    }

    .rte-citations-field {
      width: 100%;
      box-sizing: border-box;
      min-height: 30px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: inherit;
      font-size: 13px;
      padding: 6px 8px;
    }

    .rte-citations-field:focus-visible {
      outline: none;
      border-color: #1d4ed8;
      box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.2);
    }

    .${K}.rte-citations-theme-dark .rte-citations-field {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .rte-citations-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .rte-citations-btn {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: inherit;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .rte-citations-btn:hover,
    .rte-citations-btn:focus-visible {
      outline: none;
      border-color: #1d4ed8;
      box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.2);
    }

    .rte-citations-btn-primary {
      background: #1d4ed8;
      border-color: #1d4ed8;
      color: #ffffff;
    }

    .rte-citations-btn-primary:hover,
    .rte-citations-btn-primary:focus-visible {
      background: #1e40af;
      border-color: #1e40af;
    }

    .${K}.rte-citations-theme-dark .rte-citations-btn {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .${K}.rte-citations-theme-dark .rte-citations-btn-primary {
      border-color: #2563eb;
      background: #2563eb;
      color: #ffffff;
    }

    .rte-citations-recent {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px;
    }

    .${K}.rte-citations-theme-dark .rte-citations-recent {
      border-color: #334155;
    }

    .rte-citations-recent-heading {
      margin: 0 0 8px;
      font-size: 12px;
      font-weight: 700;
    }

    .rte-citations-recent-list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 170px;
      overflow: auto;
    }

    .rte-citations-recent-btn {
      width: 100%;
      text-align: left;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: inherit;
      border-radius: 8px;
      padding: 7px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .rte-citations-recent-row {
      display: flex;
      gap: 6px;
      align-items: stretch;
    }

    .rte-citations-recent-delete {
      flex: 0 0 auto;
      border: 1px solid #fecaca;
      background: #fff1f2;
      color: #b91c1c;
      border-radius: 8px;
      padding: 0 8px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      min-height: 34px;
    }

    .rte-citations-recent-delete:hover,
    .rte-citations-recent-delete:focus-visible {
      outline: none;
      border-color: #f87171;
      box-shadow: 0 0 0 2px rgba(248, 113, 113, 0.2);
    }

    .rte-citations-recent-btn:focus-visible,
    .rte-citations-recent-btn:hover {
      outline: none;
      border-color: #1d4ed8;
      box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.18);
    }

    .${K}.rte-citations-theme-dark .rte-citations-recent-btn {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .${K}.rte-citations-theme-dark .rte-citations-recent-delete {
      border-color: #7f1d1d;
      background: #2b1218;
      color: #fca5a5;
    }

    .rte-citations-recent-title {
      font-size: 12px;
      font-weight: 700;
      line-height: 1.3;
    }

    .rte-citations-recent-meta {
      font-size: 11px;
      color: #64748b;
      line-height: 1.3;
    }

    .${K}.rte-citations-theme-dark .rte-citations-recent-meta {
      color: #94a3b8;
    }

    .rte-citations-empty {
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 8px;
      font-size: 12px;
      color: #64748b;
    }

    .${K}.rte-citations-theme-dark .rte-citations-empty {
      border-color: #334155;
      color: #94a3b8;
    }

    .rte-citations-shortcut {
      margin: 0;
      font-size: 11px;
      color: #64748b;
    }

    .${K}.rte-citations-theme-dark .rte-citations-shortcut {
      color: #94a3b8;
    }

    .rte-citations-live {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      border: 0;
    }

    .rte-citation-ref {
      display: inline-flex;
      align-items: center;
      border-radius: 6px;
      border: 1px solid rgba(29, 78, 216, 0.24);
      background: rgba(29, 78, 216, 0.08);
      color: #1e3a8a;
      padding: 0 4px;
      margin: 0 1px;
      font-size: 0.92em;
      line-height: 1.35;
      white-space: nowrap;
      cursor: pointer;
      user-select: all;
    }

    .rte-citation-ref:focus,
    .rte-citation-ref:focus-visible {
      outline: none;
      border-color: #1d4ed8;
      box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.22);
    }

    .${Be} .rte-citation-ref {
      border-color: rgba(96, 165, 250, 0.45);
      background: rgba(37, 99, 235, 0.22);
      color: #bfdbfe;
    }

    .rte-citation-bibliography,
    .rte-citation-footnotes {
      margin-top: 16px;
      border-top: 1px solid #d1d5db;
      padding-top: 10px;
    }

    .${Be} .rte-citation-bibliography,
    .${Be} .rte-citation-footnotes {
      border-top-color: #475569;
    }

    .rte-citation-section-title {
      margin: 0 0 8px;
      font-size: 1em;
      font-weight: 700;
    }

    .rte-citation-list {
      margin: 0;
      padding-left: 22px;
    }

    .rte-citation-item {
      margin: 0 0 8px;
      line-height: 1.45;
    }

    .rte-citation-backref {
      margin-left: 8px;
      color: #1d4ed8;
      text-decoration: none;
      font-size: 0.9em;
    }

    .rte-citation-backref:hover,
    .rte-citation-backref:focus-visible {
      text-decoration: underline;
      outline: none;
    }

    .${Be} .rte-citation-backref {
      color: #93c5fd;
    }

    @media (max-width: 768px) {
      .${K} {
        left: 10px !important;
        right: 10px;
        top: 10px !important;
        width: auto !important;
        max-height: calc(100vh - 20px);
      }

      .rte-citations-grid {
        grid-template-columns: 1fr;
      }

      .rte-citations-recent-list {
        max-height: 34vh;
      }
    }
  `,document.head.appendChild(e)}const yb=(e={})=>{const t=$a(e);return hb(),{name:"citations",toolbar:[{id:"citationsGroup",label:"Citations",type:"group",command:"citations",items:[{id:"citations",label:"Citations",command:"toggleCitationsPanel",shortcut:"Mod-Alt-Shift-c",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M6 5h12M6 9h12M6 13h8M6 17h10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M17 14.5a2.5 2.5 0 0 1 2.5 2.5v2H15v-2a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.5"/></svg>'},{id:"citationsRefresh",label:"Refresh Citations",command:"refreshCitations",shortcut:"Mod-Alt-Shift-b",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.34-5.66" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M20 4v6h-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'},{id:"citationsStyle",label:"Cycle Citation Style",command:"cycleCitationStyle",shortcut:"Mod-Alt-Shift-j",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M5 6h14M5 10h8M5 14h14M5 18h10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="18" cy="10" r="2" stroke="currentColor" stroke-width="1.6"/></svg>'}]}],commands:{citations:(r,n)=>{const o=Re(n);if(!o||Ct(o))return!1;const a=D.get(o)||t;return D.set(o,a),Zt.set(o,vr(o,a)),pe=o,Dr(o),Fe(o,a,!1),!0},toggleCitationsPanel:(r,n)=>{const o=Re(n);if(!o||Ct(o))return!1;const a=D.get(o)||t;D.set(o,a),pe=o;const i=cu(o,typeof r=="boolean"?r:void 0);return Ja(o)&&Fe(o,a,!1),i},insertCitation:(r,n)=>{const o=Re(n);if(!o||Ct(o)||!r||typeof r!="object")return!1;const a=D.get(o)||t;D.set(o,a),pe=o;const i=Xa(o,r,a);return i&&Dr(o),i},refreshCitations:(r,n)=>{const o=Re(n);if(!o)return!1;const a=D.get(o)||t;return D.set(o,a),pe=o,Fe(o,a,!0),Dr(o),!0},setCitationStyle:(r,n)=>{const o=Re(n);if(!o||!r)return!1;const a=D.get(o)||t;return D.set(o,a),pe=o,su(o,r,a),!0},cycleCitationStyle:(r,n)=>{const o=Re(n);if(!o)return!1;const a=D.get(o)||t;return D.set(o,a),pe=o,Jl(o,a),$n(o),!0},getCitationRecords:(r,n)=>{const o=Re(n);if(!o)return!1;const a=D.get(o)||t,i=yo(o,a);if(typeof r=="function")try{r(i)}catch{}return o.__citationRecords=i,o.dispatchEvent(new CustomEvent("editora:citations-data",{bubbles:!0,detail:{records:i,style:vr(o,a)}})),!0},setCitationsOptions:(r,n)=>{const o=Re(n);if(!o||!r||typeof r!="object")return!1;const a=D.get(o)||t,i=$a({...a,...r,labels:{...a.labels,...r.labels||{}},normalizeText:r.normalizeText||a.normalizeText,generateCitationId:r.generateCitationId||a.generateCitationId});return D.set(o,i),r.defaultStyle&&mr.includes(r.defaultStyle)&&Zt.set(o,r.defaultStyle),Fe(o,i,!0),$n(o),!0},locateCitation:(r,n)=>{const o=Re(n);return!o||typeof r!="string"?!1:lb(o,r)},deleteCitation:(r,n)=>{const o=Re(n);if(!o||Ct(o))return!1;const a=D.get(o)||t;return D.set(o,a),typeof r=="string"&&r.trim()?lu(o,r,a):ib(o,a)},insertRecentCitation:(r,n)=>{const o=Re(n);if(!o||Ct(o))return!1;const a=D.get(o)||t;D.set(o,a);const i=yo(o,a),l=Ei(o,i,a);if(l.length===0)return!1;const s=typeof r=="string"&&r.trim()?Qd(o,r,i,a):l[0];if(!s)return!1;const c=Xa(o,s,a);return c&&Dr(o),c}},keymap:{"Mod-Alt-Shift-c":"toggleCitationsPanel","Mod-Alt-Shift-C":"toggleCitationsPanel","Mod-Alt-Shift-b":"refreshCitations","Mod-Alt-Shift-B":"refreshCitations","Mod-Alt-Shift-j":"cycleCitationStyle","Mod-Alt-Shift-J":"cycleCitationStyle"},init:function(n){ra+=1;const o=this&&typeof this.__pluginConfig=="object"?$a({...t,...this.__pluginConfig}):t;gb(o);const a=Re(n&&n.editorElement?{editorElement:n.editorElement}:void 0,!1);a&&(pe=a,D.set(a,o),Zt.set(a,o.defaultStyle),wi(a,"toggleCitationsPanel",!1),nu(a))},destroy:()=>{ra=Math.max(0,ra-1),!(ra>0)&&(bo.forEach(r=>{window.clearTimeout(r)}),bo.clear(),bb())}}},Ve=".rte-content, .editora-content",Ql="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",ec="__editoraCommandEditorRoot",tc="rte-smart-paste-styles",q="rte-smart-paste-panel",Pe="smart-paste",ot="smartPaste",at=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',xb=typeof NodeFilter<"u"?NodeFilter.SHOW_COMMENT:128,rc="__editoraSmartPasteHandled",vb=new Set(["script","style","meta","link","object","embed","iframe","svg","canvas","math","form","input","button","textarea","select","option"]),kb=new Set(["table","thead","tbody","tfoot","tr","td","th","colgroup","col"]),wb=new Set(["span","font"]),Eb=/^(https?:|mailto:|tel:|#|\/)/i,Cb=/^data:image\/(?:png|gif|jpeg|jpg|webp);base64,/i,Sb=new Set(["color","background-color","font-weight","font-style","text-decoration","text-align","font-size","font-family","line-height","letter-spacing","word-spacing","white-space","vertical-align","margin-left","margin-right","margin-top","margin-bottom","padding-left","padding-right","padding-top","padding-bottom","text-indent","border","border-top","border-right","border-bottom","border-left","border-color","border-width","border-style","list-style-type"]),Tb={panelTitle:"Smart Paste",panelAriaLabel:"Smart paste panel",enabledText:"Smart paste is enabled",disabledText:"Smart paste is disabled",toggleOnText:"Disable Smart Paste",toggleOffText:"Enable Smart Paste",cycleProfileText:"Cycle Profile",profileLabel:"Profile",fidelityText:"Fidelity",balancedText:"Balanced",plainText:"Plain Text",lastPasteHeading:"Last Paste Result",lastPasteEmptyText:"Paste content to see cleanup metrics.",lastPasteSourceLabel:"Source",lastPasteProfileLabel:"Profile",lastPasteRemovedLabel:"Removed",lastPasteCharsLabel:"Output Chars",closeText:"Close",shortcutText:"Shortcuts: Ctrl/Cmd+Alt+Shift+S/V/G",readonlyMessage:"Editor is read-only. Smart paste was skipped."},Zi={fidelity:{keepStyles:!0,keepClasses:!1,keepDataAttributes:!1,preserveTables:!0},balanced:{keepStyles:!1,keepClasses:!1,keepDataAttributes:!1,preserveTables:!0},plain:{keepStyles:!1,keepClasses:!1,keepDataAttributes:!1,preserveTables:!1}},O=new WeakMap,Ln=new WeakMap,Ne=new Map,zo=new WeakMap,Qa=new WeakMap,vo=new Set;let aa=0,$b=0,An=null,we=null,rn=null,nn=null,Vt=null,on=null;function Yi(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Lb(e){return e.replace(/\u00A0/g," ").replace(/\r\n?/g,`
`)}function ko(e){return e==="balanced"||e==="plain"?e:"fidelity"}function Xi(e,t){return{keepStyles:(e==null?void 0:e.keepStyles)??t.keepStyles,keepClasses:(e==null?void 0:e.keepClasses)??t.keepClasses,keepDataAttributes:(e==null?void 0:e.keepDataAttributes)??t.keepDataAttributes,preserveTables:(e==null?void 0:e.preserveTables)??t.preserveTables}}function La(e={}){const t=e.profileOptions||{};return{enabled:e.enabled!==!1,defaultProfile:ko(e.defaultProfile),maxHtmlLength:Math.max(8e3,Math.min(8e5,Number(e.maxHtmlLength??22e4))),removeComments:e.removeComments!==!1,normalizeWhitespace:e.normalizeWhitespace!==!1,labels:{...Tb,...e.labels||{}},normalizeText:e.normalizeText||Lb,profileOptions:{fidelity:Xi(t.fidelity,Zi.fidelity),balanced:Xi(t.balanced,Zi.balanced),plain:Xi(t.plain,Zi.plain)}}}function nc(e){return{enabled:e.enabled,defaultProfile:e.defaultProfile,maxHtmlLength:e.maxHtmlLength,removeComments:e.removeComments,normalizeWhitespace:e.normalizeWhitespace,labels:{...e.labels},normalizeText:e.normalizeText,profileOptions:{fidelity:{...e.profileOptions.fidelity},balanced:{...e.profileOptions.balanced},plain:{...e.profileOptions.plain}}}}function es(e){return e.closest(Ql)||e}function wo(e){if(!e)return null;if(e.matches(Ve))return e;const t=e.querySelector(Ve);return t instanceof HTMLElement?t:null}function Ab(){if(typeof window>"u")return null;const e=window[ec];if(!(e instanceof HTMLElement))return null;window[ec]=null;const t=wo(e);if(t)return t;const r=e.closest(Ql);if(r){const o=wo(r);if(o)return o}const n=e.closest(Ve);return n instanceof HTMLElement?n:null}function Mb(e){const t=e.closest("[data-editora-editor]");if(t&&wo(t)===e)return t;let r=e;for(;r;){if(r.matches(Ql)&&(r===e||wo(r)===e))return r;r=r.parentElement}return es(e)}function du(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function Bt(e,t=!0,r=!0){if(Aa(),(e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const i=wo(e.editorElement);if(i)return i}const n=Ab();if(n)return n;const o=window.getSelection();if(o&&o.rangeCount>0){const i=du(o.getRangeAt(0).startContainer),l=i==null?void 0:i.closest(Ve);if(l)return l}const a=document.activeElement;if(a){if(a.matches(Ve))return a;const i=a.closest(Ve);if(i)return i}if(r){if(we&&we.isConnected)return we;we&&!we.isConnected&&(we=null)}return t?document.querySelector(Ve):null}function Rb(e){const t=e.target;if(t){const n=t.closest(Ve);if(n)return n}const r=window.getSelection();if(r&&r.rangeCount>0){const n=du(r.getRangeAt(0).startContainer),o=n==null?void 0:n.closest(Ve);if(o)return o}return null}function ia(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function Nb(e){const t=es(e);if(ia(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return ia(r)?!0:ia(document.documentElement)||ia(document.body)}function ei(e,t){e.classList.remove("rte-smart-paste-theme-dark"),Nb(t)&&e.classList.add("rte-smart-paste-theme-dark")}function oc(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function Eo(e,t,r){const n=Mb(e);Array.from(n.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",r),a.setAttribute("data-active",r?"true":"false"),a.setAttribute("aria-pressed",r?"true":"false")})}function he(e,t){O.has(e)||O.set(e,t);let r=Ln.get(e);return r||(r={enabled:t.enabled,profile:t.defaultProfile,lastReport:null},Ln.set(e,r)),Yb(e),vo.add(e),r}function uu(e){const t=Qa.get(e);t&&(e.removeEventListener("paste",t,!0),Qa.delete(e))}function fu(e){var t;uu(e),(t=Ne.get(e))==null||t.remove(),Ne.delete(e),zo.delete(e),O.delete(e),Ln.delete(e),vo.delete(e),we===e&&(we=null)}function Aa(){Array.from(vo).forEach(t=>{t.isConnected||fu(t)})}function Db(e){var t,r,n,o;for(let a=0;a<e.length;a+=1){const i=e[a];if(!(i.type!=="childList"||i.removedNodes.length===0))for(let l=0;l<i.removedNodes.length;l+=1){const s=i.removedNodes[l];if(s.nodeType!==Node.ELEMENT_NODE)continue;const c=s;if((t=c.matches)!=null&&t.call(c,Ve)||(r=c.matches)!=null&&r.call(c,`.${q}`)||(n=c.querySelector)!=null&&n.call(c,Ve)||(o=c.querySelector)!=null&&o.call(c,`.${q}`))return!0}}return!1}function ts(e){return zo.get(e)===!0}function to(e,t){const r=e.querySelector(".rte-smart-paste-live");r&&(r.textContent=t)}function Ji(e,t){const r=t.normalizeText(e);return t.normalizeWhitespace?r.split(`
`).map(o=>o.replace(/[\t ]+/g," ").trimEnd()).join(`
`).replace(/\n{3,}/g,`

`).trim():r}function Hb(e){return/class=["'][^"']*Mso|xmlns:w=|urn:schemas-microsoft-com:office|<o:p\b/i.test(e)}function Ib(e){return/id=["']docs-internal-guid|docs-\w+|data-sheets-value|data-sheets-userformat/i.test(e)}function Bb(e,t){return e?Hb(e)?"word":Ib(e)?"google-docs":"html":t?"plain":"html"}function Pb(e){return e.split(/\s+/).map(r=>r.trim()).filter(Boolean).filter(r=>!/^mso/i.test(r)).filter(r=>!/^docs-/i.test(r)).filter(r=>!/^c\d+$/i.test(r)).join(" ")}function Ob(e){if(!e)return{value:"",changed:!1};const t=e.split(";"),r=[];let n=!1;return t.forEach(o=>{const a=o.indexOf(":");if(a<=0){o.trim()&&(n=!0);return}const i=o.slice(0,a).trim().toLowerCase(),l=o.slice(a+1).trim();if(!i||!l){n=!0;return}if(!Sb.has(i)){n=!0;return}if(/expression\s*\(|javascript\s*:|vbscript\s*:|url\s*\(/i.test(l)){n=!0;return}r.push(`${i}: ${l}`)}),{value:r.join("; "),changed:n}}function ac(e){const t=e.trim();return t&&(Eb.test(t)||Cb.test(t))?t:""}function ic(e){const t=e.parentNode;if(t){for(;e.firstChild;)t.insertBefore(e.firstChild,e);t.removeChild(e)}}function zb(e,t,r,n){const o=e.tagName.toLowerCase();if(vb.has(o)){n.removedElements+=1,e.remove();return}if(!t.preserveTables&&kb.has(o)){const i=e.textContent||"",l=document.createTextNode(i);e.replaceWith(l),n.removedElements+=1;return}if(Array.from(e.attributes).forEach(i=>{const l=i.name.toLowerCase(),s=i.value;if(l.startsWith("on")){e.removeAttribute(i.name),n.removedAttributes+=1;return}if(l==="style"){if(!t.keepStyles){e.removeAttribute(i.name),n.removedAttributes+=1;return}const c=Ob(s);if(!c.value){e.removeAttribute(i.name),n.removedAttributes+=1,c.changed&&(n.normalizedStyles+=1);return}(c.changed||c.value!==s)&&(e.setAttribute("style",c.value),n.normalizedStyles+=1);return}if(l==="class"){if(!t.keepClasses){e.removeAttribute(i.name),n.removedAttributes+=1;return}const c=Pb(s);if(!c){e.removeAttribute(i.name),n.removedAttributes+=1;return}c!==s&&(e.setAttribute("class",c),n.removedAttributes+=1);return}if(l.startsWith("data-")&&!t.keepDataAttributes){e.removeAttribute(i.name),n.removedAttributes+=1;return}if(l==="id"||l==="xmlns"||l.startsWith("xml")){e.removeAttribute(i.name),n.removedAttributes+=1;return}if((r==="word"||r==="google-docs")&&(l==="lang"||l==="dir")){e.removeAttribute(i.name),n.removedAttributes+=1;return}if(l==="href"||l==="src"||l==="xlink:href"){const c=ac(s);if(!c){e.removeAttribute(i.name),n.removedAttributes+=1;return}c!==s&&e.setAttribute(i.name,c)}}),o==="a"){if(!e.getAttribute("href")){ic(e),n.removedElements+=1;return}e.getAttribute("target")==="_blank"&&e.setAttribute("rel","noopener noreferrer")}if(o==="img"){const i=e.getAttribute("src");if(!i||!ac(i)){n.removedElements+=1,e.remove();return}}if(wb.has(o)&&!e.attributes.length&&!e.className&&!e.style.cssText){const i=e.children.length>0,l=(e.textContent||"").trim().length>0;if(!i&&!l){e.remove(),n.removedElements+=1;return}!i&&l&&(ic(e),n.removedElements+=1)}}function _b(e,t,r,n,o){const a=document.createElement("template");a.innerHTML=e;const i={removedElements:0,removedAttributes:0,removedComments:0,normalizedStyles:0};if(n.removeComments)try{const d=document.createTreeWalker(a.content,xb,null),u=[];let f=d.nextNode();for(;f;)u.push(f),f=d.nextNode();u.forEach(p=>{p.remove(),i.removedComments+=1})}catch{}Array.from(a.content.querySelectorAll("*")).forEach(d=>{d.isConnected&&zb(d,t,r,i)});let s=a.innerHTML;n.normalizeWhitespace&&o!=="fidelity"?s=s.replace(/\s{2,}/g," ").replace(/>\s+</g,"><").trim():n.normalizeWhitespace&&(s=s.trim());const c=(a.content.textContent||"").trim().length;return{html:s,textLength:c,counters:i}}function mu(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);return e.contains(r.commonAncestorContainer)?r:null}function pu(e,t){if(!e.isConnected)return;const r=window.getSelection();r&&(r.removeAllRanges(),r.addRange(t))}function qb(e,t){e.focus({preventScroll:!0});try{if(document.execCommand("insertHTML",!1,t))return!0}catch{}const r=mu(e);if(!r)return!1;r.deleteContents();const n=document.createElement("template");n.innerHTML=t;const o=n.content,a=o.lastChild;if(r.insertNode(o),a){const i=document.createRange();i.setStartAfter(a),i.collapse(!0),pu(e,i)}return!0}function jb(e,t){e.focus({preventScroll:!0});try{if(document.execCommand("insertText",!1,t))return!0}catch{}const r=mu(e);if(!r)return!1;r.deleteContents();const n=document.createTextNode(t);r.insertNode(n);const o=document.createRange();return o.setStart(n,n.length),o.collapse(!0),pu(e,o),!0}function Fb(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function Vb(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function la(e,t,r,n,o,a){return{source:e,profile:t,inputHtmlLength:r,outputHtmlLength:n,outputTextLength:o,removedElements:a.removedElements,removedAttributes:a.removedAttributes,removedComments:a.removedComments,normalizedStyles:a.normalizedStyles,createdAt:new Date().toISOString()}}function Kb(e,t,r,n){const o=Bb(e,t);if(r==="plain"){const l=t||e.replace(/<[^>]*>/g," "),s=Ji(l,n);return{mode:"text",value:s,report:la(o,r,e.length,0,s.length,{removedElements:0,removedAttributes:0,removedComments:0,normalizedStyles:0})}}if(!e||e.length>n.maxHtmlLength){const l=Ji(t||e.replace(/<[^>]*>/g," "),n);return{mode:"text",value:l,report:la(o,r,e.length,0,l.length,{removedElements:0,removedAttributes:0,removedComments:0,normalizedStyles:0})}}const a=n.profileOptions[r],i=_b(e,a,o,n,r);if(!i.html){const l=Ji(t||e.replace(/<[^>]*>/g," "),n);return{mode:"text",value:l,report:la(o,r,e.length,0,l.length,i.counters)}}return{mode:"html",value:i.html,report:la(o,r,e.length,i.html.length,i.textLength,i.counters)}}function ti(e,t){return e==="balanced"?t.balancedText:e==="plain"?t.plainText:t.fidelityText}function rs(e){return e==="fidelity"?"balanced":e==="balanced"?"plain":"fidelity"}function Wb(e,t){e.setAttribute("aria-label",t.labels.panelAriaLabel);const r=e.querySelector(".rte-smart-paste-title");r&&(r.textContent=t.labels.panelTitle);const n=e.querySelector('[data-action="close"]');n&&n.setAttribute("aria-label",t.labels.closeText);const o=e.querySelector('[data-action="toggle-enabled"]');if(o){const y=o.getAttribute("data-enabled")==="true";o.textContent=y?t.labels.toggleOnText:t.labels.toggleOffText}const a=e.querySelector('[data-action="cycle-profile"]');a&&(a.textContent=t.labels.cycleProfileText);const i=e.querySelector(".rte-smart-paste-profile-heading");i&&(i.textContent=t.labels.profileLabel);const l=e.querySelector('.rte-smart-paste-profile[role="group"]');l&&l.setAttribute("aria-label",t.labels.profileLabel);const s=e.querySelector('[data-action="set-profile"][data-profile="fidelity"]');s&&(s.textContent=t.labels.fidelityText);const c=e.querySelector('[data-action="set-profile"][data-profile="balanced"]');c&&(c.textContent=t.labels.balancedText);const d=e.querySelector('[data-action="set-profile"][data-profile="plain"]');d&&(d.textContent=t.labels.plainText);const u=e.querySelector(".rte-smart-paste-report-title");u&&(u.textContent=t.labels.lastPasteHeading);const f=e.querySelector(".rte-smart-paste-empty");f&&(f.textContent=t.labels.lastPasteEmptyText);const p=e.querySelector('[data-key="source-label"]');p&&(p.textContent=t.labels.lastPasteSourceLabel);const g=e.querySelector('[data-key="profile-label"]');g&&(g.textContent=t.labels.lastPasteProfileLabel);const m=e.querySelector('[data-key="removed-label"]');m&&(m.textContent=t.labels.lastPasteRemovedLabel);const h=e.querySelector('[data-key="chars-label"]');h&&(h.textContent=t.labels.lastPasteCharsLabel);const b=e.querySelector(".rte-smart-paste-shortcut");b&&(b.textContent=t.labels.shortcutText)}function Ke(e){const t=Ne.get(e),r=O.get(e)||An,n=Ln.get(e);if(!t||!r||!n)return;Wb(t,r);const o=t.querySelector(".rte-smart-paste-status");o&&(o.textContent=n.enabled?r.labels.enabledText:r.labels.disabledText);const a=t.querySelector('[data-action="toggle-enabled"]');a&&(a.setAttribute("data-enabled",n.enabled?"true":"false"),a.textContent=n.enabled?r.labels.toggleOnText:r.labels.toggleOffText,a.setAttribute("aria-pressed",n.enabled?"true":"false")),Array.from(t.querySelectorAll('[data-action="set-profile"][data-profile]')).forEach(p=>{const m=ko(p.getAttribute("data-profile"))===n.profile;p.classList.toggle("active",m),p.setAttribute("aria-pressed",m?"true":"false")});const l=t.querySelector(".rte-smart-paste-empty"),s=t.querySelector(".rte-smart-paste-report"),c=t.querySelector('[data-key="source-value"]'),d=t.querySelector('[data-key="profile-value"]'),u=t.querySelector('[data-key="removed-value"]'),f=t.querySelector('[data-key="chars-value"]');if(!n.lastReport){l&&(l.hidden=!1),s&&(s.hidden=!0);return}if(l&&(l.hidden=!0),s&&(s.hidden=!1),c&&(c.textContent=n.lastReport.source),d&&(d.textContent=ti(n.lastReport.profile,r.labels)),u){const p=n.lastReport.removedElements+n.lastReport.removedAttributes+n.lastReport.removedComments+n.lastReport.normalizedStyles;u.textContent=String(p)}f&&(f.textContent=String(n.lastReport.outputTextLength))}function hl(e,t){if(!t.classList.contains("show"))return;const r=es(e).getBoundingClientRect(),n=Math.min(window.innerWidth-20,360),o=Math.max(10,window.innerWidth-n-10),a=Math.min(Math.max(10,r.right-n),o),i=Math.max(10,Math.min(window.innerHeight-10,r.top+12));t.style.width=`${n}px`,t.style.left=`${a}px`,t.style.top=`${i}px`,t.style.maxHeight=`${Math.max(240,window.innerHeight-20)}px`}function Co(e,t=!1){const r=Ne.get(e);r&&(r.classList.remove("show"),zo.set(e,!1),Eo(e,"toggleSmartPastePanel",!1),t&&e.focus({preventScroll:!0}))}function Ub(e){const t=Ne.get(e);if(t)return t;const r=O.get(e)||An||La(),n=`rte-smart-paste-panel-${$b++}`,o=document.createElement("section");return o.className=q,o.id=n,o.setAttribute("role","dialog"),o.setAttribute("aria-modal","false"),o.setAttribute("aria-label",r.labels.panelAriaLabel),o.innerHTML=`
    <header class="rte-smart-paste-header">
      <h2 class="rte-smart-paste-title">${Yi(r.labels.panelTitle)}</h2>
      <button type="button" class="rte-smart-paste-icon-btn" data-action="close" aria-label="${Yi(r.labels.closeText)}">✕</button>
    </header>
    <div class="rte-smart-paste-body">
      <p class="rte-smart-paste-status"></p>
      <div class="rte-smart-paste-controls">
        <button type="button" class="rte-smart-paste-btn rte-smart-paste-btn-primary" data-action="toggle-enabled" data-enabled="true"></button>
        <button type="button" class="rte-smart-paste-btn" data-action="cycle-profile"></button>
      </div>
      <div class="rte-smart-paste-profile" role="group" aria-label="${Yi(r.labels.profileLabel)}">
        <p class="rte-smart-paste-profile-heading"></p>
        <div class="rte-smart-paste-profile-grid">
          <button type="button" class="rte-smart-paste-chip" data-action="set-profile" data-profile="fidelity" aria-pressed="false"></button>
          <button type="button" class="rte-smart-paste-chip" data-action="set-profile" data-profile="balanced" aria-pressed="false"></button>
          <button type="button" class="rte-smart-paste-chip" data-action="set-profile" data-profile="plain" aria-pressed="false"></button>
        </div>
      </div>
      <section class="rte-smart-paste-metrics" aria-live="polite">
        <h3 class="rte-smart-paste-report-title"></h3>
        <p class="rte-smart-paste-empty"></p>
        <dl class="rte-smart-paste-report" hidden>
          <div class="rte-smart-paste-line"><dt data-key="source-label"></dt><dd data-key="source-value"></dd></div>
          <div class="rte-smart-paste-line"><dt data-key="profile-label"></dt><dd data-key="profile-value"></dd></div>
          <div class="rte-smart-paste-line"><dt data-key="removed-label"></dt><dd data-key="removed-value"></dd></div>
          <div class="rte-smart-paste-line"><dt data-key="chars-label"></dt><dd data-key="chars-value"></dd></div>
        </dl>
      </section>
      <p class="rte-smart-paste-shortcut"></p>
    </div>
    <div class="rte-smart-paste-live" aria-live="polite" aria-atomic="true"></div>
  `,o.addEventListener("click",a=>{const i=a.target,l=i==null?void 0:i.closest("[data-action]");if(!l)return;const s=l.getAttribute("data-action");if(s){if(s==="close"){Co(e,!0);return}if(s==="toggle-enabled"){const c=he(e,O.get(e)||r);c.enabled=!c.enabled,Eo(e,"toggleSmartPasteEnabled",c.enabled),Ke(e),to(o,c.enabled?r.labels.enabledText:r.labels.disabledText);return}if(s==="cycle-profile"){const c=he(e,O.get(e)||r);c.profile=rs(c.profile),Ke(e),to(o,`${r.labels.profileLabel}: ${ti(c.profile,r.labels)}`);return}if(s==="set-profile"){const c=he(e,O.get(e)||r);c.profile=ko(l.getAttribute("data-profile")),Ke(e),to(o,`${r.labels.profileLabel}: ${ti(c.profile,r.labels)}`)}}}),o.addEventListener("keydown",a=>{if(a.key==="Escape"){a.preventDefault(),Co(e,!0);return}if(a.key!=="ArrowRight"&&a.key!=="ArrowLeft")return;const i=Array.from(o.querySelectorAll('[data-action="set-profile"][data-profile]'));if(i.length===0)return;const l=i.findIndex(d=>d===document.activeElement);if(l<0)return;const s=a.key==="ArrowRight"?1:-1,c=(l+s+i.length)%i.length;a.preventDefault(),i[c].focus()}),ei(o,e),document.body.appendChild(o),Ne.set(e,o),zo.set(e,!1),Ke(e),o}function gu(e){const t=Ub(e);Ne.forEach((n,o)=>{o!==e&&Co(o,!1)}),t.classList.add("show"),zo.set(e,!0),Eo(e,"toggleSmartPastePanel",!0),ei(t,e),hl(e,t);const r=t.querySelector('[data-action="toggle-enabled"]');r==null||r.focus()}function bu(e,t){const r=ts(e);return(typeof t=="boolean"?t:!r)?gu(e):Co(e,!1),!0}function hu(e){return{enabled:e.enabled,profile:e.profile,lastReport:e.lastReport?{...e.lastReport}:null}}function Gb(e,t){const r=O.get(e)||An;if(!r)return!1;const n=he(e,r);if(!n.enabled||oc(e)){const u=Ne.get(e);return u&&oc(e)&&to(u,r.labels.readonlyMessage),!1}const o=t.clipboardData;if(!o)return!1;const a=o.getData("text/html")||"",i=o.getData("text/plain")||"";if(!a&&!i)return!1;const l=Kb(a,i,n.profile,r);if(!l.value)return!1;const s=e.innerHTML;if(!(l.mode==="html"?qb(e,l.value):jb(e,l.value)))return!1;n.lastReport={...l.report},Ln.set(e,n),Fb(e,s),Vb(e),e.dispatchEvent(new CustomEvent("editora:smart-paste",{bubbles:!0,detail:hu(n)})),Ke(e);const d=Ne.get(e);if(d){const u=l.report.removedElements+l.report.removedAttributes+l.report.removedComments+l.report.normalizedStyles;to(d,`${r.labels.panelTitle}: ${ti(n.profile,r.labels)}. ${r.labels.lastPasteRemovedLabel}: ${u}.`)}return!0}function Zb(e){return t=>{t.defaultPrevented||t[rc]===!0||(we=e,!Gb(e,t))||(t[rc]=!0,t.preventDefault(),typeof t.stopImmediatePropagation=="function"?t.stopImmediatePropagation():t.stopPropagation())}}function Yb(e){if(Qa.has(e))return;const t=Zb(e);e.addEventListener("paste",t,!0),Qa.set(e,t)}function ro(e){const t=Ln.get(e);Eo(e,"toggleSmartPastePanel",ts(e)),Eo(e,"toggleSmartPasteEnabled",(t==null?void 0:t.enabled)===!0)}function Xb(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="s"}function Jb(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="v"}function Qb(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="g"}function eh(e){An=e,rn||(rn=t=>{Aa();const r=t.target,n=r==null?void 0:r.closest(Ve);if(!n)return;const o=O.get(n)||e;he(n,o),O.set(n,o),we=n,ro(n);const a=Ne.get(n);a&&(ei(a,n),hl(n,a),Ke(n))},document.addEventListener("focusin",rn,!0)),nn||(nn=t=>{if(t.defaultPrevented)return;const r=t.target;if(r!=null&&r.closest(`.${q} input, .${q} textarea, .${q} select`))return;const n=Rb(t);if(!n)return;const o=O.get(n)||An||e;if(he(n,o),O.set(n,o),we=n,t.key==="Escape"&&ts(n)){t.preventDefault(),Co(n,!0);return}if(Xb(t)){t.preventDefault(),t.stopPropagation(),bu(n);return}if(Jb(t)){t.preventDefault(),t.stopPropagation();const a=he(n,o);a.profile=rs(a.profile),Ke(n);return}if(Qb(t)){t.preventDefault(),t.stopPropagation();const a=he(n,o);a.enabled=!a.enabled,ro(n),Ke(n)}},document.addEventListener("keydown",nn,!0)),Vt||(Vt=()=>{Aa(),Ne.forEach((t,r)=>{!r.isConnected||!t.isConnected||(ei(t,r),hl(r,t))})},window.addEventListener("scroll",Vt,!0),window.addEventListener("resize",Vt)),!on&&typeof MutationObserver<"u"&&document.body&&(on=new MutationObserver(t=>{Db(t)&&Aa()}),on.observe(document.body,{childList:!0,subtree:!0}))}function th(){rn&&(document.removeEventListener("focusin",rn,!0),rn=null),nn&&(document.removeEventListener("keydown",nn,!0),nn=null),Vt&&(window.removeEventListener("scroll",Vt,!0),window.removeEventListener("resize",Vt),Vt=null),on&&(on.disconnect(),on=null),Ne.forEach(e=>e.remove()),Ne.clear(),vo.forEach(e=>uu(e)),vo.clear(),An=null,we=null}function rh(){if(typeof document>"u"||document.getElementById(tc))return;const e=document.createElement("style");e.id=tc,e.textContent=`
    .rte-toolbar-group-items.${Pe},
    .editora-toolbar-group-items.${Pe},
    .rte-toolbar-group-items.${ot},
    .editora-toolbar-group-items.${ot} {
      display: flex;
      border: 1px solid #ccc;
      border-radius: 3px;
      background: #fff;
    }

    .rte-toolbar-group-items.${Pe} .rte-toolbar-button,
    .editora-toolbar-group-items.${Pe} .editora-toolbar-button,
    .rte-toolbar-group-items.${ot} .rte-toolbar-button,
    .editora-toolbar-group-items.${ot} .editora-toolbar-button {
      border: none;
      border-right: 1px solid #ccc;
      border-radius: 0;
    }

    .rte-toolbar-group-items.${Pe} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${Pe} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${ot} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${ot} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    .rte-toolbar-button[data-command="toggleSmartPasteEnabled"].active,
    .editora-toolbar-button[data-command="toggleSmartPasteEnabled"].active {
      background-color: #ccc;
    }

    ${at} .rte-toolbar-group-items.${Pe},
    ${at} .editora-toolbar-group-items.${Pe},
    ${at} .rte-toolbar-group-items.${ot},
    ${at} .editora-toolbar-group-items.${ot},
    .${q}.rte-smart-paste-theme-dark {
      border-color: #566275;
    }

    ${at} .rte-toolbar-group-items.${Pe} .rte-toolbar-button svg,
    ${at} .editora-toolbar-group-items.${Pe} .editora-toolbar-button svg,
    ${at} .rte-toolbar-group-items.${ot} .rte-toolbar-button svg,
    ${at} .editora-toolbar-group-items.${ot} .editora-toolbar-button svg {
      fill: none;
    }

    ${at} .rte-toolbar-group-items.${Pe} .rte-toolbar-button,
    ${at} .editora-toolbar-group-items.${Pe} .editora-toolbar-button
    {
      border-color: #566275;
    }
    
    .${q} {
      position: fixed;
      z-index: 12000;
      display: none;
      width: min(360px, calc(100vw - 20px));
      max-height: calc(100vh - 20px);
      border: 1px solid #d1d5db;
      border-radius: 14px;
      background: #ffffff;
      color: #111827;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.25);
      overflow: hidden;
    }

    .${q}.show {
      display: flex;
      flex-direction: column;
    }

    .${q}.rte-smart-paste-theme-dark {
      border-color: #334155;
      background: #0f172a;
      color: #e2e8f0;
      box-shadow: 0 20px 46px rgba(2, 6, 23, 0.68);
    }

    .rte-smart-paste-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
    }

    .${q}.rte-smart-paste-theme-dark .rte-smart-paste-header {
      border-color: #1e293b;
      background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
    }

    .rte-smart-paste-title {
      margin: 0;
      font-size: 15px;
      line-height: 1.2;
      font-weight: 700;
    }

    .rte-smart-paste-icon-btn {
      width: 34px;
      height: 34px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #ffffff;
      color: #0f172a;
      font-size: 16px;
      line-height: 1;
      font-weight: 600;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .rte-smart-paste-icon-btn:hover,
    .rte-smart-paste-icon-btn:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .${q}.rte-smart-paste-theme-dark .rte-smart-paste-icon-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    .${q}.rte-smart-paste-theme-dark .rte-smart-paste-icon-btn:hover,
    .${q}.rte-smart-paste-theme-dark .rte-smart-paste-icon-btn:focus-visible {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.24);
    }

    .rte-smart-paste-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      overflow: auto;
    }

    .rte-smart-paste-status {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #475569;
      font-weight: 600;
    }

    .${q}.rte-smart-paste-theme-dark .rte-smart-paste-status {
      color: #94a3b8;
    }

    .rte-smart-paste-controls {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .rte-smart-paste-btn {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      height: 34px;
      padding: 0 10px;
      background: #ffffff;
      color: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .rte-smart-paste-btn:hover,
    .rte-smart-paste-btn:focus-visible {
      border-color: #94a3b8;
      background: #f8fafc;
      outline: none;
    }

    .rte-smart-paste-btn-primary {
      border-color: #0284c7;
      background: #0ea5e9;
      color: #f8fafc;
    }

    .rte-smart-paste-btn-primary:hover,
    .rte-smart-paste-btn-primary:focus-visible {
      border-color: #0369a1;
      background: #0284c7;
      color: #ffffff;
    }

    .${q}.rte-smart-paste-theme-dark .rte-smart-paste-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${q}.rte-smart-paste-theme-dark .rte-smart-paste-btn:hover,
    .${q}.rte-smart-paste-theme-dark .rte-smart-paste-btn:focus-visible {
      border-color: #475569;
      background: #1e293b;
    }

    .rte-smart-paste-profile {
      display: grid;
      gap: 6px;
    }

    .rte-smart-paste-profile-heading {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      font-weight: 700;
      color: #334155;
    }

    .${q}.rte-smart-paste-theme-dark .rte-smart-paste-profile-heading {
      color: #cbd5e1;
    }

    .rte-smart-paste-profile-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
    }

    .rte-smart-paste-chip {
      height: 34px;
      border-radius: 9px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .rte-smart-paste-chip:hover,
    .rte-smart-paste-chip:focus-visible {
      border-color: #0284c7;
      outline: none;
    }

    .rte-smart-paste-chip.active {
      border-color: #0284c7;
      background: rgba(14, 165, 233, 0.14);
      color: #0c4a6e;
    }

    .${q}.rte-smart-paste-theme-dark .rte-smart-paste-chip {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .${q}.rte-smart-paste-theme-dark .rte-smart-paste-chip.active {
      border-color: #38bdf8;
      background: rgba(14, 165, 233, 0.2);
      color: #e0f2fe;
    }

    .rte-smart-paste-metrics {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px;
      background: #f8fafc;
      display: grid;
      gap: 8px;
    }

    .${q}.rte-smart-paste-theme-dark .rte-smart-paste-metrics {
      border-color: #334155;
      background: #0b1220;
    }

    .rte-smart-paste-report-title {
      margin: 0;
      font-size: 12px;
      line-height: 1.3;
      font-weight: 700;
    }

    .rte-smart-paste-empty {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #475569;
    }

    .${q}.rte-smart-paste-theme-dark .rte-smart-paste-empty {
      color: #94a3b8;
    }

    .rte-smart-paste-report {
      margin: 0;
      display: grid;
      gap: 6px;
    }

    .rte-smart-paste-line {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      font-size: 12px;
      line-height: 1.3;
    }

    .rte-smart-paste-line dt {
      margin: 0;
      color: #475569;
      font-weight: 600;
    }

    .rte-smart-paste-line dd {
      margin: 0;
      font-weight: 700;
    }

    .${q}.rte-smart-paste-theme-dark .rte-smart-paste-line dt {
      color: #94a3b8;
    }

    .rte-smart-paste-shortcut {
      margin: 2px 0 0;
      font-size: 11px;
      color: #64748b;
    }

    .${q}.rte-smart-paste-theme-dark .rte-smart-paste-shortcut {
      color: #94a3b8;
    }

    .rte-smart-paste-live {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      border: 0;
    }

    @media (max-width: 768px) {
      .${q} {
        left: 10px !important;
        right: 10px;
        top: 10px !important;
        width: auto !important;
        max-height: calc(100vh - 20px);
      }

      .rte-smart-paste-profile-grid {
        grid-template-columns: 1fr;
      }
    }
  `,document.head.appendChild(e)}const nh=(e={})=>{const t=La(e),r=new Set;return rh(),{name:"smartPaste",toolbar:[{id:"smartPasteGroup",label:"Smart Paste",type:"group",command:"smartPaste",items:[{id:"smartPaste",label:"Smart Paste Panel",command:"toggleSmartPastePanel",shortcut:"Mod-Alt-Shift-s",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M8.5 4.5h7l3 3V18a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6.5 18V7a2.5 2.5 0 0 1 2-2.45Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M15.5 4.5V8h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.3 12h5.4M9.3 15h5.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'},{id:"smartPasteProfile",label:"Cycle Smart Paste Profile",command:"cycleSmartPasteProfile",shortcut:"Mod-Alt-Shift-v",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4.5 7.5h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="17.5" cy="7.5" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 12h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12.5" cy="12" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 16.5h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="9.5" cy="16.5" r="2" stroke="currentColor" stroke-width="1.6"/></svg>'},{id:"smartPasteToggle",label:"Toggle Smart Paste",command:"toggleSmartPasteEnabled",shortcut:"Mod-Alt-Shift-g",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="3.5" y="8" width="17" height="8" rx="4" stroke="currentColor" stroke-width="1.6"/><circle cx="8" cy="12" r="2.6" fill="currentColor"/><path d="M14.5 12h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'}]}],commands:{smartPaste:(n,o)=>{const a=Bt(o,!1,!1);if(!a)return!1;const i=O.get(a)||t;return he(a,i),O.set(a,i),we=a,gu(a),!0},toggleSmartPastePanel:(n,o)=>{const a=Bt(o,!1,!1);if(!a)return!1;const i=O.get(a)||t;return he(a,i),O.set(a,i),we=a,bu(a,typeof n=="boolean"?n:void 0)},cycleSmartPasteProfile:(n,o)=>{const a=Bt(o,!1,!1);if(!a)return!1;const i=O.get(a)||t,l=he(a,i);return O.set(a,i),l.profile=rs(l.profile),Ke(a),!0},setSmartPasteProfile:(n,o)=>{const a=Bt(o,!1,!1);if(!a)return!1;const i=O.get(a)||t,l=he(a,i);return O.set(a,i),l.profile=ko(n),Ke(a),!0},toggleSmartPasteEnabled:(n,o)=>{const a=Bt(o,!1,!1);if(!a)return!1;const i=O.get(a)||t,l=he(a,i);return O.set(a,i),l.enabled=typeof n=="boolean"?n:!l.enabled,ro(a),Ke(a),!0},setSmartPasteOptions:(n,o)=>{var d,u,f,p,g,m;const a=Bt(o,!1,!1);if(!a||!n||typeof n!="object")return!1;const i=O.get(a)||t,l=nc(i),s=La({...l,...n,labels:{...i.labels,...n.labels||{}},profileOptions:{...l.profileOptions,...n.profileOptions||{},fidelity:{...((d=l.profileOptions)==null?void 0:d.fidelity)||{},...((u=n.profileOptions)==null?void 0:u.fidelity)||{}},balanced:{...((f=l.profileOptions)==null?void 0:f.balanced)||{},...((p=n.profileOptions)==null?void 0:p.balanced)||{}},plain:{...((g=l.profileOptions)==null?void 0:g.plain)||{},...((m=n.profileOptions)==null?void 0:m.plain)||{}}},normalizeText:n.normalizeText||i.normalizeText});O.set(a,s);const c=he(a,s);return typeof n.enabled=="boolean"&&(c.enabled=n.enabled),n.defaultProfile&&(c.profile=ko(n.defaultProfile)),Ke(a),ro(a),!0},getSmartPasteState:(n,o)=>{const a=Bt(o,!1,!1);if(!a)return!1;const i=O.get(a)||t,l=he(a,i),s=hu(l);if(typeof n=="function")try{n(s)}catch{}return a.__smartPasteState=s,a.dispatchEvent(new CustomEvent("editora:smart-paste-state",{bubbles:!0,detail:s})),!0}},keymap:{"Mod-Alt-Shift-s":"toggleSmartPastePanel","Mod-Alt-Shift-S":"toggleSmartPastePanel","Mod-Alt-Shift-v":"cycleSmartPasteProfile","Mod-Alt-Shift-V":"cycleSmartPasteProfile","Mod-Alt-Shift-g":"toggleSmartPasteEnabled","Mod-Alt-Shift-G":"toggleSmartPasteEnabled"},init:function(o){aa+=1;const a=this&&typeof this.__pluginConfig=="object"?La({...nc(t),...this.__pluginConfig}):t;eh(a);const i=Bt(o!=null&&o.editorElement?{editorElement:o.editorElement}:void 0,!1,!1);if(!i)return;we=i,r.add(i);const l=he(i,a);l.enabled=a.enabled,l.profile=a.defaultProfile,O.set(i,a),ro(i)},destroy:()=>{r.forEach(n=>fu(n)),r.clear(),aa=Math.max(0,aa-1),!(aa>0)&&th()}}},We=".rte-content, .editora-content",ns="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",lc="__editoraCommandEditorRoot",sc="rte-blocks-library-styles",N="rte-blocks-library-panel",Oe="blocks-library",it="blocksLibrary",lt=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',oh=80,yu=new Set(["script","style","meta","link","object","embed","iframe"]),ah=/^(https?:|mailto:|tel:|#|\/)/i,ih=/^data:image\/(?:png|gif|jpeg|jpg|webp);base64,/i,lh={panelTitle:"Blocks Library",panelAriaLabel:"Blocks library panel",searchLabel:"Search blocks",searchPlaceholder:"Search by name, category, or keyword",categoryLabel:"Category",allCategoriesText:"All categories",recentHeading:"Recent inserts",insertText:"Insert Selected",closeText:"Close",noResultsText:"No matching blocks found.",summaryPrefix:"Blocks",loadingText:"Loading blocks...",loadErrorText:"Unable to load blocks right now.",readonlyMessage:"Editor is read-only. Block insertion is disabled.",shortcutText:"Shortcuts: Ctrl/Cmd+Alt+Shift+B (panel), Ctrl/Cmd+Alt+Shift+L (insert last)",helperText:"Use Arrow keys to move through blocks, Enter to insert, Esc to close.",lastInsertedPrefix:"Last inserted",resultsListLabel:"Block results"},H=new WeakMap,Ma=new WeakMap,De=new WeakMap,Xt=new WeakMap,Mn=new WeakMap,Fn=new WeakMap,no=new WeakMap,Ar=new WeakMap,Hr=new WeakMap,ri=new WeakMap,Me=new Map,_o=new WeakMap,Ci=new Set;let sa=0,sh=0,cc=0,Dt=null,ge=null,an=null,ln=null,Kt=null,sn=null;function me(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ch(e){return e.replace(/\u00A0/g," ").replace(/\s+/g," ").trim()}function dh(e){return e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)}function yl(e){const t=e.trim();return t&&(ah.test(t)||ih.test(t))?t:""}function dc(e){let t=e;return yu.forEach(r=>{const n=new RegExp(`<${r}[\\s\\S]*?>[\\s\\S]*?<\\/${r}>`,"gi"),o=new RegExp(`<${r}\\b[^>]*\\/?>`,"gi");t=t.replace(n,"").replace(o,"")}),t=t.replace(/\son\w+=(\"[^\"]*\"|'[^']*'|[^\s>]+)/gi,"").replace(/\s(xmlns|xml:[^=\s>]+)\s*=\s*(\"[^\"]*\"|'[^']*'|[^\s>]+)/gi,"").replace(/\s(href|src|xlink:href)\s*=\s*("|\')\s*(?:javascript:|vbscript:|data:text\/html)[^"']*\2/gi,"").replace(/\s(href|src|xlink:href)\s*=\s*(?:javascript:|vbscript:|data:text\/html)[^\s>]*/gi,"").replace(/\s(href|src|xlink:href)\s*=\s*("([^"]*)"|'([^']*)')/gi,(r,n,o,a,i)=>{const l=typeof a=="string"&&a.length>0?a:i||"",s=yl(l);if(!s)return"";const c=o.startsWith('"')?'"':"'";return` ${n}=${c}${s}${c}`}).replace(/\s(href|src|xlink:href)\s*=\s*([^\s>]+)/gi,(r,n,o)=>{const a=yl(o);return a?` ${n}="${a}"`:""}).replace(/\sstyle\s*=\s*("([^"]*)"|'([^']*)')/gi,(r,n,o,a)=>{const i=typeof o=="string"&&o.length>0?o:a||"";if(/expression\s*\(|javascript\s*:|vbscript\s*:|url\s*\(/i.test(i))return"";const l=n.startsWith('"')?'"':"'";return` style=${l}${i}${l}`}).trim(),t}function uh(e){if(!e)return"";if(typeof document>"u")return dc(e);const t=document.createElement("template");t.innerHTML=e;const r=t.content;return!r||typeof r.querySelectorAll!="function"?dc(e):(Array.from(r.querySelectorAll("*")).forEach(o=>{const a=o.tagName.toLowerCase();if(yu.has(a)){o.remove();return}Array.from(o.attributes).forEach(l=>{const s=l.name.toLowerCase(),c=l.value;if(s.startsWith("on")){o.removeAttribute(l.name);return}if(s==="style"){/expression\s*\(|javascript\s*:|vbscript\s*:|url\s*\(/i.test(c)&&o.removeAttribute(l.name);return}if(s==="href"||s==="src"||s==="xlink:href"){const d=yl(c);if(!d){o.removeAttribute(l.name);return}d!==c&&o.setAttribute(l.name,d)}})}),t.innerHTML.trim())}function Si(e){return e.trim().toLowerCase()}function fh(e){if(!e)return"";if(typeof document>"u")return e.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();const t=document.createElement("template");t.innerHTML=e;const r=t.content;return!r||typeof r.textContent!="string"?e.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim():r.textContent.replace(/\s+/g," ").trim()}function xu(e,t){if(!Array.isArray(e)||e.length===0)return[];const r=new Set,n=[];return e.forEach(o=>{const a=t.normalizeText(o.label||""),i=t.sanitizeBlockHtml(o.html||"",o).trim();if(!a||!i)return;const l=t.normalizeText(o.category||"General")||"General",s=Si(l);let d=dh(t.normalizeText(o.id||a))||`block-${cc++}`;for(;r.has(d);)d=`${d}-${cc++}`;r.add(d);const u=(o.tags||[]).map(h=>t.normalizeText(h)).filter(Boolean),f=(o.keywords||[]).map(h=>t.normalizeText(h)).filter(Boolean),p=t.normalizeText(o.description||""),g=fh(i),m=[a,p,l,...u,...f,g].join(" ").toLowerCase();n.push({id:d,label:a,html:i,description:p,category:l,categoryKey:s,tags:u,keywords:f,previewText:g,searchBlob:m})}),n}function Ra(e={}){const t=e.normalizeText||ch,r=e.sanitizeBlockHtml||uh,n={blocks:[],defaultCategory:t(e.defaultCategory||""),maxResults:Math.max(4,Math.min(300,Number(e.maxResults??80))),maxRecentBlocks:Math.max(1,Math.min(20,Number(e.maxRecentBlocks??6))),debounceMs:Math.max(0,Math.min(700,Number(e.debounceMs??90))),cacheTtlMs:Math.max(0,Number(e.cacheTtlMs??6e4)),labels:{...lh,...e.labels||{}},normalizeText:t,sanitizeBlockHtml:r,getBlocks:typeof e.getBlocks=="function"?e.getBlocks:void 0};return n.blocks=xu(e.blocks,n),n}function mh(e){return{blocks:e.blocks.map(t=>({id:t.id,label:t.label,html:t.html,description:t.description||void 0,category:t.category||void 0,tags:t.tags.length?[...t.tags]:void 0,keywords:t.keywords.length?[...t.keywords]:void 0})),defaultCategory:e.defaultCategory,maxResults:e.maxResults,maxRecentBlocks:e.maxRecentBlocks,debounceMs:e.debounceMs,cacheTtlMs:e.cacheTtlMs,labels:{...e.labels},normalizeText:e.normalizeText,sanitizeBlockHtml:e.sanitizeBlockHtml,getBlocks:e.getBlocks}}function Ti(e){return e.closest(ns)||e}function So(e){if(!e)return null;if(e.matches(We))return e;const t=e.querySelector(We);return t instanceof HTMLElement?t:null}function ph(){if(typeof window>"u")return null;const e=window[lc];if(!(e instanceof HTMLElement))return null;window[lc]=null;const t=So(e);if(t)return t;const r=e.closest(ns);if(r){const o=So(r);if(o)return o}const n=e.closest(We);return n instanceof HTMLElement?n:null}function gh(e){const t=e.closest("[data-editora-editor]");if(t&&So(t)===e)return t;let r=e;for(;r;){if(r.matches(ns)&&(r===e||So(r)===e))return r;r=r.parentElement}return Ti(e)}function vu(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function Na(){Array.from(Ci).forEach(t=>{t.isConnected||os(t)})}function xt(e,t=!0,r=!0){if(Na(),(e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const i=So(e.editorElement);if(i)return i}const n=ph();if(n)return n;const o=window.getSelection();if(o&&o.rangeCount>0){const i=vu(o.getRangeAt(0).startContainer),l=i==null?void 0:i.closest(We);if(l)return l}const a=document.activeElement;if(a){if(a.matches(We))return a;const i=a.closest(We);if(i)return i}if(r){if(ge&&ge.isConnected)return ge;ge&&!ge.isConnected&&(ge=null)}return t?document.querySelector(We):null}function bh(e){const t=e.target;if(t){const n=t.closest(We);if(n)return n}const r=window.getSelection();if(r&&r.rangeCount>0){const n=vu(r.getRangeAt(0).startContainer),o=n==null?void 0:n.closest(We);if(o)return o}return null}function ca(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function hh(e){const t=Ti(e);if(ca(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return ca(r)?!0:ca(document.documentElement)||ca(document.body)}function ni(e,t){e.classList.remove("rte-blocks-library-theme-dark"),hh(t)&&e.classList.add("rte-blocks-library-theme-dark")}function ku(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function uc(e,t,r){const n=gh(e);Array.from(n.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",r),a.setAttribute("data-active",r?"true":"false"),a.setAttribute("aria-pressed",r?"true":"false")})}function fc(e,t){const r=e.querySelector(".rte-blocks-library-live");r&&(r.textContent=t)}function $i(e){const t=Tu(e);if(t)try{Hr.set(e,t.cloneRange())}catch{}}function wu(e){const t=Hr.get(e);if(!t)return null;if(!e.isConnected)return Hr.delete(e),null;try{const r=t.cloneRange();return e.contains(r.commonAncestorContainer)?r:(Hr.delete(e),null)}catch{return Hr.delete(e),null}}function yh(e){const t=wu(e);return t?($u(e,t),!0):!1}function xh(e){if(ri.has(e))return;const t=()=>{const r=window.getSelection();if(!r||r.rangeCount===0)return;const n=r.getRangeAt(0);e.contains(n.commonAncestorContainer)&&$i(e)};e.addEventListener("keyup",t),e.addEventListener("mouseup",t),e.addEventListener("touchend",t),ri.set(e,t)}function vh(e){const t=ri.get(e);t&&(e.removeEventListener("keyup",t),e.removeEventListener("mouseup",t),e.removeEventListener("touchend",t),ri.delete(e))}function ve(e,t){H.has(e)||H.set(e,t),Xt.has(e)||(Xt.set(e,t.blocks),Mn.set(e,Date.now()));let r=De.get(e);return r||(r={query:"",category:t.defaultCategory?Si(t.defaultCategory):"all",selectedBlockId:null,recentBlockIds:[],lastInsertedBlockId:null,loading:!1,loadError:null,totalMatches:0,visibleMatches:0,filterCache:new Map,debounceTimer:null},De.set(e,r)),Ci.add(e),xh(e),r}function Eu(e){const t=De.get(e);!t||t.debounceTimer===null||(window.clearTimeout(t.debounceTimer),t.debounceTimer=null)}function os(e){var r;Eu(e),vh(e),Hr.delete(e);const t=no.get(e);t&&(t.abort(),no.delete(e)),Fn.delete(e),Ar.delete(e),(r=Me.get(e))==null||r.remove(),Me.delete(e),_o.delete(e),H.delete(e),Ma.delete(e),De.delete(e),Xt.delete(e),Mn.delete(e),Ci.delete(e),ge===e&&(ge=null)}function kh(e){var t,r,n,o;for(let a=0;a<e.length;a+=1){const i=e[a];if(!(i.type!=="childList"||i.removedNodes.length===0))for(let l=0;l<i.removedNodes.length;l+=1){const s=i.removedNodes[l];if(s.nodeType!==Node.ELEMENT_NODE)continue;const c=s;if((t=c.matches)!=null&&t.call(c,We)||(r=c.matches)!=null&&r.call(c,`.${N}`)||(n=c.querySelector)!=null&&n.call(c,We)||(o=c.querySelector)!=null&&o.call(c,`.${N}`))return!0}}return!1}function as(e){return _o.get(e)===!0}function xl(e,t){if(!t.classList.contains("show"))return;const r=Ti(e).getBoundingClientRect(),n=Math.min(window.innerWidth-20,420),o=Math.max(10,window.innerWidth-n-10),a=Math.min(Math.max(10,r.right-n),o),i=Math.max(10,Math.min(window.innerHeight-10,r.top+12));t.style.width=`${n}px`,t.style.left=`${a}px`,t.style.top=`${i}px`,t.style.maxHeight=`${Math.max(260,window.innerHeight-20)}px`}function Li(e){var t;return Xt.get(e)||((t=H.get(e))==null?void 0:t.blocks)||[]}function wh(e,t){const r=new Map;Li(e).forEach(o=>{r.has(o.categoryKey)||r.set(o.categoryKey,o.category)});const n=Array.from(r.entries()).sort((o,a)=>o[1].localeCompare(a[1])).map(([o,a])=>({value:o,label:a}));return[{value:"all",label:t.labels.allCategoriesText},...n]}function Cu(e,t){const r=ve(e,t),n=Li(e),o=r.query.trim().toLowerCase(),a=r.category||"all",i=`${o}|${a}|${t.maxResults}`,l=r.filterCache.get(i);if(l){const d=new Map(n.map(f=>[f.id,f])),u=l.ids.map(f=>d.get(f)).filter(Boolean);return r.totalMatches=l.total,r.visibleMatches=u.length,u}const s=[];let c=0;for(let d=0;d<n.length;d+=1){const u=n[d];a!=="all"&&u.categoryKey!==a||o&&!u.searchBlob.includes(o)||(c+=1,s.length<t.maxResults&&s.push(u))}if(r.totalMatches=c,r.visibleMatches=s.length,r.filterCache.set(i,{ids:s.map(d=>d.id),total:c}),r.filterCache.size>oh){const d=r.filterCache.keys().next().value;typeof d=="string"&&r.filterCache.delete(d)}return s}function Eh(e,t){const r=De.get(e);if(!r)return;if(t.length===0){r.selectedBlockId=null;return}t.some(o=>o.id===r.selectedBlockId)||(r.selectedBlockId=t[0].id)}function Rn(e){const t=De.get(e);uc(e,"toggleBlocksLibraryPanel",as(e)),uc(e,"insertLastBlockSnippet",!!(t!=null&&t.lastInsertedBlockId))}function nt(e){const t=Me.get(e),r=H.get(e)||Dt,n=De.get(e);if(!t||!r||!n)return;ni(t,e);const o=t.querySelector(".rte-blocks-library-title");o&&(o.textContent=r.labels.panelTitle);const a=t.querySelector('[data-action="close"]');a&&(a.setAttribute("aria-label",r.labels.closeText),a.textContent="✕");const i=t.querySelector(".rte-blocks-library-search-label");i&&(i.textContent=r.labels.searchLabel);const l=t.querySelector('[data-field="query"]');l&&(l.setAttribute("placeholder",r.labels.searchPlaceholder),l.value!==n.query&&(l.value=n.query));const s=t.querySelector(".rte-blocks-library-category-label");s&&(s.textContent=r.labels.categoryLabel);const c=t.querySelector('[data-field="category"]');if(c){const E=wh(e,r);c.innerHTML=E.map(v=>`<option value="${me(v.value)}">${me(v.label)}</option>`).join(""),E.some(v=>v.value===n.category)||(n.category="all"),c.value=n.category}const d=t.querySelector(".rte-blocks-library-helper");d&&(d.textContent=r.labels.helperText);const u=t.querySelector('.rte-blocks-library-list[role="listbox"]');u&&u.setAttribute("aria-label",r.labels.resultsListLabel);const f=t.querySelector(".rte-blocks-library-shortcut");f&&(f.textContent=r.labels.shortcutText);const p=t.querySelector('[data-action="insert-selected"]');if(p){p.textContent=r.labels.insertText;const E=!ku(e)&&!!n.selectedBlockId;p.disabled=!E,p.setAttribute("aria-disabled",E?"false":"true")}const g=t.querySelector(".rte-blocks-library-empty"),m=t.querySelector(".rte-blocks-library-list"),h=Cu(e,r);Eh(e,h);const b=t.querySelector(".rte-blocks-library-status");if(b&&(n.loading?b.textContent=r.labels.loadingText:n.loadError?b.textContent=n.loadError:b.textContent=`${r.labels.summaryPrefix}: ${n.visibleMatches}/${n.totalMatches}`),m){const E=new Set(n.recentBlockIds);m.innerHTML=h.map(v=>{const C=n.selectedBlockId===v.id,T=v.tags.length?` • ${v.tags.join(", ")}`:"",k=E.has(v.id),x=v.previewText.slice(0,180);return`
          <li class="rte-blocks-library-item-wrapper" role="presentation">
            <button
              type="button"
              class="rte-blocks-library-item${C?" active":""}"
              data-block-id="${me(v.id)}"
              role="option"
              aria-selected="${C?"true":"false"}"
              aria-label="${me(v.label)}"
              tabindex="${C?"0":"-1"}"
            >
              <span class="rte-blocks-library-item-head">
                <span class="rte-blocks-library-item-label">${me(v.label)}</span>
                ${k?`<span class="rte-blocks-library-recent-pill">${me(r.labels.recentHeading)}</span>`:""}
              </span>
              <span class="rte-blocks-library-item-meta">${me(v.category)}${me(T)}</span>
              ${v.description?`<span class="rte-blocks-library-item-description">${me(v.description)}</span>`:""}
              ${x?`<span class="rte-blocks-library-item-preview">${me(x)}</span>`:""}
            </button>
          </li>
        `}).join("")}g&&(g.hidden=h.length>0,g.textContent=r.labels.noResultsText);const y=t.querySelector(".rte-blocks-library-last-inserted");if(y)if(n.lastInsertedBlockId){const E=Li(e).find(v=>v.id===n.lastInsertedBlockId);E?(y.hidden=!1,y.textContent=`${r.labels.lastInsertedPrefix}: ${E.label}`):y.hidden=!0}else y.hidden=!0;t.setAttribute("aria-label",r.labels.panelAriaLabel)}function St(e,t=!1){const r=Me.get(e);r&&(r.classList.remove("show"),_o.set(e,!1),Rn(e),t&&(e.focus({preventScroll:!0}),yh(e)))}function Ch(e){const t=e.querySelector(".rte-blocks-library-item.active");t==null||t.focus()}function mc(e,t){const r=H.get(e)||Dt;if(!r)return;const n=De.get(e);if(!n)return;const o=Cu(e,r);if(o.length===0)return;const i=(Math.max(0,o.findIndex(s=>s.id===n.selectedBlockId))+t+o.length)%o.length;n.selectedBlockId=o[i].id,nt(e);const l=Me.get(e);l&&Ch(l)}function vl(e){const t=Ah(e);$i(e),Me.forEach((n,o)=>{o!==e&&St(o,!1)}),t.classList.add("show"),_o.set(e,!0),nt(e),xl(e,t),Rn(e);const r=t.querySelector('[data-field="query"]');r==null||r.focus(),kl(e,!1)}function Su(e,t){const r=as(e);return(typeof t=="boolean"?t:!r)?vl(e):St(e,!1),!0}function Tu(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);return e.contains(r.commonAncestorContainer)?r:null}function $u(e,t){if(!e.isConnected)return;const r=window.getSelection();r&&(r.removeAllRanges(),r.addRange(t))}function pc(e,t,r){const n=t.cloneRange();if(!e.contains(n.commonAncestorContainer))return!1;n.deleteContents();const o=document.createElement("template");o.innerHTML=r;const a=o.content;if(!a)return!1;const i=a.lastChild;if(n.insertNode(a),i){const l=document.createRange();l.setStartAfter(i),l.collapse(!0),$u(e,l)}return $i(e),!0}function Sh(e,t){e.focus({preventScroll:!0});const r=wu(e);if(r&&pc(e,r,t))return!0;try{if(document.execCommand("insertHTML",!1,t))return $i(e),!0}catch{}const n=Tu(e);return n?pc(e,n,t):!1}function Th(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function $h(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function oo(e,t){const r=H.get(e)||Dt;if(!r)return!1;const n=ve(e,r),o=Me.get(e);if(ku(e))return o&&fc(o,r.labels.readonlyMessage),!1;const a=Li(e).find(s=>s.id===t);if(!a)return!1;const i=e.innerHTML;return Sh(e,a.html)?(n.lastInsertedBlockId=a.id,n.selectedBlockId=a.id,n.recentBlockIds=[a.id,...n.recentBlockIds.filter(s=>s!==a.id)].slice(0,r.maxRecentBlocks),Th(e,i),$h(e),Rn(e),e.dispatchEvent(new CustomEvent("editora:blocks-library-insert",{bubbles:!0,detail:{blockId:a.id,label:a.label,category:a.category}})),nt(e),o&&fc(o,`${r.labels.lastInsertedPrefix}: ${a.label}`),!0):!1}function Lu(e){const t=De.get(e);return t!=null&&t.lastInsertedBlockId?oo(e,t.lastInsertedBlockId):!1}function Lh(e){const t=H.get(e)||Dt;if(!t)return;const r=De.get(e);if(!r)return;Eu(e);const n=()=>{r.debounceTimer=null,r.filterCache.clear(),nt(e)};if(t.debounceMs<=0){n();return}r.debounceTimer=window.setTimeout(n,t.debounceMs)}function Ah(e){const t=Me.get(e);if(t)return t;const r=H.get(e)||Dt||Ra(),n=ve(e,r),o=`rte-blocks-library-panel-${sh++}`,a=`${o}-query`,i=`${o}-category`,l=document.createElement("section");return l.className=N,l.id=o,l.setAttribute("role","dialog"),l.setAttribute("aria-modal","false"),l.setAttribute("aria-label",r.labels.panelAriaLabel),l.innerHTML=`
    <header class="rte-blocks-library-header">
      <h2 class="rte-blocks-library-title">${me(r.labels.panelTitle)}</h2>
      <button type="button" class="rte-blocks-library-icon-btn" data-action="close" aria-label="${me(r.labels.closeText)}">✕</button>
    </header>
    <div class="rte-blocks-library-body">
      <label class="rte-blocks-library-search-label" for="${me(a)}"></label>
      <input id="${me(a)}" class="rte-blocks-library-input" type="text" data-field="query" autocomplete="off" />
      <label class="rte-blocks-library-category-label" for="${me(i)}"></label>
      <select id="${me(i)}" class="rte-blocks-library-select" data-field="category"></select>
      <p class="rte-blocks-library-status" aria-live="polite"></p>
      <p class="rte-blocks-library-helper"></p>
      <p class="rte-blocks-library-last-inserted" hidden></p>
      <div class="rte-blocks-library-list-wrap">
        <ul class="rte-blocks-library-list" role="listbox" aria-label="${me(r.labels.resultsListLabel)}"></ul>
        <p class="rte-blocks-library-empty" hidden></p>
      </div>
      <div class="rte-blocks-library-actions">
        <button type="button" class="rte-blocks-library-btn rte-blocks-library-btn-primary" data-action="insert-selected"></button>
      </div>
      <p class="rte-blocks-library-shortcut"></p>
    </div>
    <div class="rte-blocks-library-live" aria-live="polite" aria-atomic="true"></div>
  `,l.addEventListener("click",s=>{const c=s.target,d=c==null?void 0:c.closest("[data-action]");if(d){const p=d.getAttribute("data-action");if(p==="close"){St(e,!0);return}if(p==="insert-selected"){if(!n.selectedBlockId)return;oo(e,n.selectedBlockId)&&St(e,!0)}return}const u=c==null?void 0:c.closest("[data-block-id]");if(!u)return;const f=u.getAttribute("data-block-id");f&&(n.selectedBlockId=f,nt(e),s.detail>=2&&oo(e,f)&&St(e,!0))}),l.addEventListener("input",s=>{const c=s.target;!(c instanceof HTMLInputElement)||c.getAttribute("data-field")!=="query"||(n.query=r.normalizeText(c.value).toLowerCase(),n.filterCache.clear(),Lh(e))}),l.addEventListener("change",s=>{const c=s.target;!(c instanceof HTMLSelectElement)||c.getAttribute("data-field")!=="category"||(n.category=Si(c.value||"all")||"all",n.filterCache.clear(),nt(e))}),l.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault(),St(e,!0);return}if(s.key==="ArrowDown"){s.preventDefault(),mc(e,1);return}if(s.key==="ArrowUp"){s.preventDefault(),mc(e,-1);return}if(s.key==="Enter"){const c=s.target;if(!(c==null?void 0:c.matches('[data-field="query"], [data-field="category"], [data-block-id]'))||!n.selectedBlockId)return;s.preventDefault(),oo(e,n.selectedBlockId)&&St(e,!0)}}),ni(l,e),document.body.appendChild(l),Me.set(e,l),_o.set(e,!1),nt(e),l}function Mh(e){const t=De.get(e);return{query:(t==null?void 0:t.query)||"",category:(t==null?void 0:t.category)||"all",selectedBlockId:(t==null?void 0:t.selectedBlockId)||null,totalMatches:(t==null?void 0:t.totalMatches)||0,visibleMatches:(t==null?void 0:t.visibleMatches)||0,recentBlockIds:t!=null&&t.recentBlockIds?[...t.recentBlockIds]:[],lastInsertedBlockId:(t==null?void 0:t.lastInsertedBlockId)||null,loading:(t==null?void 0:t.loading)===!0,loadError:(t==null?void 0:t.loadError)||null}}async function kl(e,t){const r=H.get(e)||Dt;if(!r||typeof r.getBlocks!="function")return;const n=ve(e,r),o=Mn.get(e)||0;if(!t&&r.cacheTtlMs>0&&Date.now()-o<r.cacheTtlMs)return;const a=Fn.get(e);if(a&&!t)return a;const i=no.get(e);i&&i.abort(),t&&a&&Fn.delete(e);const l=new AbortController;no.set(e,l);const s=(Ar.get(e)||0)+1;Ar.set(e,s),n.loading=!0,n.loadError=null,nt(e);const c=Promise.resolve().then(async()=>{var g;const d={editor:e,editorRoot:Ti(e),signal:l.signal},u=await((g=r.getBlocks)==null?void 0:g.call(r,d));if(l.signal.aborted||Ar.get(e)!==s)return;const f=xu(u||[],r);Xt.set(e,f),Mn.set(e,Date.now());const p=De.get(e);p&&(p.loading=!1,p.loadError=null,p.filterCache.clear())}).catch(()=>{if(l.signal.aborted||Ar.get(e)!==s)return;const d=De.get(e);d&&(d.loading=!1,d.loadError=r.labels.loadErrorText)}).finally(()=>{Ar.get(e)===s&&(Fn.delete(e),no.delete(e)),nt(e)});return Fn.set(e,c),c}function Rh(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="b"}function Nh(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="l"}function Dh(e){Dt=e,an||(an=t=>{Na();const r=t.target,n=r==null?void 0:r.closest(We);if(!n)return;const o=H.get(n)||e;ve(n,o),H.set(n,o),ge=n,Rn(n);const a=Me.get(n);a&&(ni(a,n),xl(n,a),nt(n))},document.addEventListener("focusin",an,!0)),ln||(ln=t=>{if(t.defaultPrevented)return;const r=`.${N} input, .${N} textarea, .${N} select`,n=t.target;if(n!=null&&n.closest(r)){if(t.key==="Escape"){const i=n.closest(`.${N}`),l=Array.from(Me.entries()).find(([,s])=>s===i);l&&(t.preventDefault(),St(l[0],!0))}return}const o=bh(t);if(!o)return;const a=H.get(o)||Dt||e;if(ve(o,a),H.set(o,a),ge=o,t.key==="Escape"&&as(o)){t.preventDefault(),St(o,!0);return}if(Rh(t)){t.preventDefault(),t.stopPropagation(),Su(o);return}Nh(t)&&(t.preventDefault(),t.stopPropagation(),Lu(o))},document.addEventListener("keydown",ln,!0)),Kt||(Kt=()=>{Na(),Me.forEach((t,r)=>{!r.isConnected||!t.isConnected||(ni(t,r),xl(r,t))})},window.addEventListener("scroll",Kt,!0),window.addEventListener("resize",Kt)),!sn&&typeof MutationObserver<"u"&&document.body&&(sn=new MutationObserver(t=>{kh(t)&&Na()}),sn.observe(document.body,{childList:!0,subtree:!0}))}function Hh(){an&&(document.removeEventListener("focusin",an,!0),an=null),ln&&(document.removeEventListener("keydown",ln,!0),ln=null),Kt&&(window.removeEventListener("scroll",Kt,!0),window.removeEventListener("resize",Kt),Kt=null),sn&&(sn.disconnect(),sn=null),Me.forEach(t=>t.remove()),Me.clear(),Array.from(Ci).forEach(t=>os(t)),Dt=null,ge=null}function Ih(){if(typeof document>"u"||document.getElementById(sc))return;const e=document.createElement("style");e.id=sc,e.textContent=`
    .rte-toolbar-group-items.${Oe},
    .editora-toolbar-group-items.${Oe},
    .rte-toolbar-group-items.${it},
    .editora-toolbar-group-items.${it} {
      display: flex;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: #ffffff;
    }

    .rte-toolbar-group-items.${Oe} .rte-toolbar-button,
    .editora-toolbar-group-items.${Oe} .editora-toolbar-button,
    .rte-toolbar-group-items.${it} .rte-toolbar-button,
    .editora-toolbar-group-items.${it} .editora-toolbar-button {
      border: none;
      border-right: 1px solid #cbd5e1;
      border-radius: 0;
    }

    .rte-toolbar-group-items.${Oe} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${Oe} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${it} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${it} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    .rte-toolbar-button[data-command="insertLastBlockSnippet"].active,
    .editora-toolbar-button[data-command="insertLastBlockSnippet"].active {
      background: rgba(15, 118, 110, 0.12);
    }

    ${lt} .rte-toolbar-group-items.${Oe},
    ${lt} .editora-toolbar-group-items.${Oe},
    ${lt} .rte-toolbar-group-items.${it},
    ${lt} .editora-toolbar-group-items.${it} {
      border-color: #566275;
    }
    ${lt} .rte-toolbar-group-items.${Oe} .rte-toolbar-button svg,
    ${lt} .editora-toolbar-group-items.${Oe} .editora-toolbar-button svg,
    ${lt} .rte-toolbar-group-items.${it} .rte-toolbar-button svg,
    ${lt} .editora-toolbar-group-items.${it} .editora-toolbar-button svg
    {
      fill: none;
    }
    ${lt} .rte-toolbar-group-items.${Oe} .rte-toolbar-button,
    ${lt} .editora-toolbar-group-items.${Oe} .editora-toolbar-button
    {
      border-color: #566275;
    }
    .${N} {
      position: fixed;
      z-index: 12000;
      display: none;
      width: min(420px, calc(100vw - 20px));
      max-height: calc(100vh - 20px);
      border: 1px solid #d1d5db;
      border-radius: 14px;
      background: #ffffff;
      color: #0f172a;
      box-shadow: 0 24px 48px rgba(15, 23, 42, 0.24);
      overflow: hidden;
    }

    .${N}.show {
      display: flex;
      flex-direction: column;
    }

    .${N}.rte-blocks-library-theme-dark {
      border-color: #334155;
      background: #0f172a;
      color: #e2e8f0;
      box-shadow: 0 24px 52px rgba(2, 6, 23, 0.68);
    }

    .rte-blocks-library-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid #e2e8f0;
      background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
    }

    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-header {
      border-color: #1e293b;
      background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
    }

    .rte-blocks-library-title {
      margin: 0;
      font-size: 15px;
      line-height: 1.2;
      font-weight: 700;
    }

    .rte-blocks-library-icon-btn {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      min-height: 34px;
      min-width: 34px;
      width: 34px;
      height: 34px;
      padding: 0;
      background: #ffffff;
      color: #0f172a;
      font-size: 16px;
      line-height: 1;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .rte-blocks-library-icon-btn:hover,
    .rte-blocks-library-icon-btn:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-icon-btn {
      border-color: #475569;
      background: #0f172a;
      color: #e2e8f0;
    }

    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-icon-btn:hover,
    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-icon-btn:focus-visible {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.24);
    }

    .rte-blocks-library-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      overflow: auto;
    }

    .rte-blocks-library-search-label,
    .rte-blocks-library-category-label {
      font-size: 12px;
      line-height: 1.3;
      font-weight: 700;
      color: #334155;
    }

    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-search-label,
    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-category-label {
      color: #cbd5e1;
    }

    .rte-blocks-library-input,
    .rte-blocks-library-select {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 34px;
      padding: 0 10px;
      font-size: 13px;
      background: #ffffff;
      color: inherit;
    }

    .rte-blocks-library-input:focus-visible,
    .rte-blocks-library-select:focus-visible {
      border-color: #0f766e;
      box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.18);
      outline: none;
    }

    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-input,
    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-select {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .rte-blocks-library-status,
    .rte-blocks-library-helper,
    .rte-blocks-library-shortcut,
    .rte-blocks-library-last-inserted {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #475569;
    }

    .rte-blocks-library-last-inserted {
      font-weight: 600;
      color: #0f766e;
    }

    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-status,
    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-helper,
    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-shortcut {
      color: #94a3b8;
    }

    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-last-inserted {
      color: #5eead4;
    }

    .rte-blocks-library-list-wrap {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 6px;
      background: #f8fafc;
      max-height: min(44vh, 360px);
      overflow: auto;
    }

    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-list-wrap {
      border-color: #334155;
      background: #0b1220;
    }

    .rte-blocks-library-list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 6px;
    }

    .rte-blocks-library-item-wrapper {
      margin: 0;
      padding: 0;
    }

    .rte-blocks-library-item {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      color: inherit;
      text-align: left;
      padding: 8px;
      display: grid;
      gap: 3px;
      cursor: pointer;
    }

    .rte-blocks-library-item:hover,
    .rte-blocks-library-item:focus-visible {
      border-color: #0f766e;
      outline: none;
    }

    .rte-blocks-library-item.active {
      border-color: #0f766e;
      background: rgba(15, 118, 110, 0.12);
    }

    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-item {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-item.active {
      border-color: #2dd4bf;
      background: rgba(45, 212, 191, 0.15);
    }

    .rte-blocks-library-item-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .rte-blocks-library-item-label {
      font-size: 13px;
      line-height: 1.3;
      font-weight: 700;
    }

    .rte-blocks-library-recent-pill {
      font-size: 10px;
      line-height: 1;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      color: #0f766e;
      border: 1px solid rgba(15, 118, 110, 0.38);
      border-radius: 999px;
      padding: 2px 6px;
    }

    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-recent-pill {
      color: #5eead4;
      border-color: rgba(94, 234, 212, 0.45);
    }

    .rte-blocks-library-item-meta,
    .rte-blocks-library-item-description,
    .rte-blocks-library-item-preview {
      font-size: 11px;
      line-height: 1.3;
      color: #64748b;
    }

    .rte-blocks-library-item-preview {
      color: #334155;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-item-meta,
    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-item-description {
      color: #94a3b8;
    }

    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-item-preview {
      color: #cbd5e1;
    }

    .rte-blocks-library-empty {
      margin: 8px;
      font-size: 12px;
      color: #64748b;
    }

    .rte-blocks-library-actions {
      display: flex;
      gap: 8px;
    }

    .rte-blocks-library-btn {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 34px;
      padding: 0 12px;
      background: #ffffff;
      color: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .rte-blocks-library-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .rte-blocks-library-btn-primary {
      border-color: #0f766e;
      background: #0f766e;
      color: #f8fafc;
    }

    .rte-blocks-library-btn-primary:hover,
    .rte-blocks-library-btn-primary:focus-visible {
      border-color: #115e59;
      background: #115e59;
      outline: none;
    }

    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${N}.rte-blocks-library-theme-dark .rte-blocks-library-btn-primary {
      border-color: #14b8a6;
      background: #0f766e;
      color: #f0fdfa;
    }

    .rte-blocks-library-live {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      border: 0;
    }

    @media (max-width: 768px) {
      .${N} {
        left: 10px !important;
        right: 10px;
        top: 10px !important;
        width: auto !important;
        max-height: calc(100vh - 20px);
      }
    }
  `,document.head.appendChild(e)}const Bh=(e={})=>{const t=Ra(e),r=new Set;return Ih(),{name:"blocksLibrary",toolbar:[{id:"blocksLibraryGroup",label:"Blocks Library",type:"group",command:"blocksLibrary",items:[{id:"blocksLibraryPanel",label:"Blocks Library Panel",command:"toggleBlocksLibraryPanel",shortcut:"Mod-Alt-Shift-b",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="4" y="5" width="7" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="5" width="7" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="4" y="13" width="7" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="13" width="7" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/></svg>'},{id:"insertLastBlockSnippet",label:"Insert Last Block",command:"insertLastBlockSnippet",shortcut:"Mod-Alt-Shift-l",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M7 5.5h10a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 17 18.5H7A1.5 1.5 0 0 1 5.5 17V7A1.5 1.5 0 0 1 7 5.5Z" stroke="currentColor" stroke-width="1.6"/><path d="M12 8.5v7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8.5 12h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'}]}],commands:{blocksLibrary:(n,o)=>{const a=xt(o,!1,!1);if(!a)return!1;const i=H.get(a)||t;return ve(a,i),H.set(a,i),ge=a,vl(a),!0},openBlocksLibraryPanel:(n,o)=>{const a=xt(o,!1,!1);if(!a)return!1;const i=H.get(a)||t;return ve(a,i),H.set(a,i),ge=a,vl(a),!0},toggleBlocksLibraryPanel:(n,o)=>{const a=xt(o,!1,!1);if(!a)return!1;const i=H.get(a)||t;return ve(a,i),H.set(a,i),ge=a,Su(a,typeof n=="boolean"?n:void 0)},insertBlockSnippet:(n,o)=>{const a=xt(o,!1,!1);if(!a)return!1;const i=H.get(a)||t;ve(a,i),H.set(a,i);const l=typeof n=="string"?n:n==null?void 0:n.id;return l?(ge=a,oo(a,l)):!1},insertLastBlockSnippet:(n,o)=>{const a=xt(o,!1,!1);if(!a)return!1;const i=H.get(a)||t;return ve(a,i),H.set(a,i),ge=a,Lu(a)},refreshBlocksLibraryData:(n,o)=>{const a=xt(o,!1,!1);if(!a)return!1;const i=H.get(a)||t;return ve(a,i),H.set(a,i),kl(a,!0),!0},setBlocksLibraryOptions:(n,o)=>{const a=xt(o,!1,!1);if(!a||!n||typeof n!="object")return!1;const i=H.get(a)||t,l=Ma.get(a)||mh(i),s={...l,...n,labels:{...l.labels||{},...n.labels||{}},blocks:Array.isArray(n.blocks)?n.blocks:l.blocks,normalizeText:n.normalizeText||i.normalizeText,sanitizeBlockHtml:n.sanitizeBlockHtml||i.sanitizeBlockHtml,getBlocks:n.getBlocks||i.getBlocks},c=Ra(s),d=Array.isArray(n.blocks),u=n.getBlocks!==void 0;H.set(a,c),Ma.set(a,s),(d||u||!Xt.has(a))&&(Xt.set(a,c.blocks),Mn.set(a,u?0:Date.now()));const f=ve(a,c);return f.filterCache.clear(),typeof n.defaultCategory=="string"&&(f.category=Si(c.defaultCategory)||"all"),nt(a),Rn(a),u&&kl(a,!0),!0},getBlocksLibraryState:(n,o)=>{const a=xt(o,!1,!1);if(!a)return!1;const i=H.get(a)||t;ve(a,i);const l=Mh(a);if(typeof n=="function")try{n(l)}catch{}return a.__blocksLibraryState=l,a.dispatchEvent(new CustomEvent("editora:blocks-library-state",{bubbles:!0,detail:l})),!0}},keymap:{"Mod-Alt-Shift-b":"toggleBlocksLibraryPanel","Mod-Alt-Shift-B":"toggleBlocksLibraryPanel","Mod-Alt-Shift-l":"insertLastBlockSnippet","Mod-Alt-Shift-L":"insertLastBlockSnippet"},init:function(o){sa+=1;const a=this&&typeof this.__pluginConfig=="object"?{...e,...this.__pluginConfig}:e,i=Ra(a);Dh(i);const l=xt(o!=null&&o.editorElement?{editorElement:o.editorElement}:void 0,!1,!1);l&&(ge=l,r.add(l),ve(l,i),H.set(l,i),Ma.set(l,a),Xt.set(l,i.blocks),Mn.set(l,Date.now()),Rn(l))},destroy:()=>{r.forEach(n=>os(n)),r.clear(),sa=Math.max(0,sa-1),!(sa>0)&&Hh()}}},Le=".rte-content, .editora-content",is="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",gc="__editoraCommandEditorRoot",bc="rte-doc-schema-styles",P="rte-doc-schema-panel",ze="document-schema",st="doc-schema",Pt="docSchema",_e=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',Ph={panelTitle:"Document Schema",panelAriaLabel:"Document schema panel",schemaLabel:"Schema",schemaDescriptionPrefix:"Description",validateText:"Run Validation",insertMissingText:"Insert Missing Sections",realtimeOnText:"Realtime On",realtimeOffText:"Realtime Off",closeText:"Close",noIssuesText:"No schema violations detected.",summaryPrefix:"Schema",issueListLabel:"Schema issues",shortcutText:"Shortcuts: Ctrl/Cmd+Alt+Shift+G (panel), Ctrl/Cmd+Alt+Shift+J (validate)",helperText:"Choose a schema, validate structure, then insert missing sections safely.",readonlyMessage:"Editor is read-only. Missing sections cannot be inserted.",defaultPlaceholderText:"Add section content.",missingSectionMessage:"Missing required section",duplicateSectionMessage:"Section appears too many times",outOfOrderMessage:"Section appears out of required order",unknownHeadingMessage:"Heading is not part of selected schema",insertedSummaryPrefix:"Inserted missing sections"},R=new WeakMap,Da=new WeakMap,To=new WeakMap,Ee=new Map,qo=new WeakMap,oi=new WeakMap,Ai=new Set;let da=0,Oh=0,hc=0,Ge=null,ke=null,cn=null,dn=null,un=null,Wt=null,fn=null;function pt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function zh(e){return e.replace(/\u00A0/g," ").replace(/\s+/g," ").trim()}function kr(e,t,r){return Number.isFinite(e)?Math.max(t,Math.min(r,e)):t}function Au(e){return e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)}function ls(e,t){return t(e).toLowerCase().replace(/^[\s\-\u2022]*(?:[0-9]+(?:\.[0-9]+)*)[\)\.\-:\s]+/,"").replace(/^[\s\-\u2022]*(?:[ivxlcdm]+)[\)\.\-:\s]+/i,"").replace(/[：:]+$/g,"").replace(/\s+/g," ").trim()}function yc(){return[{id:"contract",label:"Contract",description:"Template for legal/commercial agreements with strict section ordering.",strictOrder:!0,allowUnknownHeadings:!1,sections:[{id:"summary",title:"Executive Summary",aliases:["Overview"]},{id:"scope",title:"Scope"},{id:"terms",title:"Terms and Conditions",aliases:["Terms"]},{id:"responsibilities",title:"Responsibilities"},{id:"sla",title:"Service Levels",aliases:["SLA","Service Level Agreement"]},{id:"termination",title:"Termination"}]},{id:"sop",label:"SOP",description:"Standard operating procedure with clear implementation and governance sections.",strictOrder:!0,allowUnknownHeadings:!0,sections:[{id:"purpose",title:"Purpose"},{id:"scope",title:"Scope"},{id:"procedure",title:"Procedure",maxOccurrences:10},{id:"roles",title:"Roles and Responsibilities",aliases:["Responsibilities"]},{id:"validation",title:"Validation"},{id:"revision-history",title:"Revision History",aliases:["Change History"]}]},{id:"policy",label:"Policy",description:"Policy document with control ownership, exception handling, and enforcement.",strictOrder:!0,allowUnknownHeadings:!0,sections:[{id:"statement",title:"Policy Statement"},{id:"applicability",title:"Applicability",aliases:["Scope"]},{id:"controls",title:"Controls"},{id:"exceptions",title:"Exceptions"},{id:"enforcement",title:"Enforcement"}]}]}function _h(e,t,r){const n=r(e.title||"");if(!n)return null;const o=Au(r(e.id||n))||`section-${t+1}`,a=kr(Number(e.minOccurrences??1),0,20),i=Math.max(1,a),l=kr(Number(e.maxOccurrences??i),a,40),s=r(e.placeholder||""),c=Array.isArray(e.aliases)?e.aliases.map(u=>r(u)).filter(Boolean):[],d=[n,...c].map(u=>ls(u,r)).filter(Boolean);return{id:o,title:n,minOccurrences:a,maxOccurrences:l,placeholder:s,matchKeys:Array.from(new Set(d))}}function Mu(e,t){const r=Array.isArray(e)&&e.length>0?e:yc(),n=[],o=new Set;return r.forEach((a,i)=>{const l=t(a.label||"");if(!l)return;const s=Au(t(a.id||l))||`schema-${i+1}`;let c=s,d=1;for(;o.has(c);)c=`${s}-${d++}`;o.add(c);const u=Array.isArray(a.sections)?a.sections:[],f=[],p=new Set;if(u.forEach((h,b)=>{const y=_h(h,b,t);if(!y)return;let E=y.id,v=1;for(;p.has(E);)E=`${y.id}-${v++}`;p.add(E),f.push({...y,id:E})}),f.length===0)return;const g=new Map,m=new Map;f.forEach((h,b)=>{m.set(h.id,b),h.matchKeys.forEach(y=>{g.has(y)||g.set(y,h)})}),n.push({id:c,label:l,description:t(a.description||""),strictOrder:a.strictOrder!==!1,allowUnknownHeadings:!!a.allowUnknownHeadings,sections:f,matchKeyToSection:g,orderBySectionId:m})}),n.length>0?n:Mu(yc(),t)}function Ha(e={}){var a;const t=e.normalizeText||zh,r=Mu(e.schemas,t),n=t(e.defaultSchemaId||""),o=r.some(i=>i.id===n)?n:((a=r[0])==null?void 0:a.id)||null;return{schemas:r,defaultSchemaId:o,enableRealtime:e.enableRealtime!==!1,debounceMs:kr(Number(e.debounceMs??260),60,2e3),maxIssues:kr(Number(e.maxIssues??80),5,500),labels:{...Ph,...e.labels||{}},normalizeText:t}}function qh(e){return{schemas:e.schemas.map(t=>({id:t.id,label:t.label,description:t.description||void 0,strictOrder:t.strictOrder,allowUnknownHeadings:t.allowUnknownHeadings,sections:t.sections.map(r=>({id:r.id,title:r.title,minOccurrences:r.minOccurrences,maxOccurrences:r.maxOccurrences,placeholder:r.placeholder||void 0}))})),defaultSchemaId:e.defaultSchemaId||void 0,enableRealtime:e.enableRealtime,debounceMs:e.debounceMs,maxIssues:e.maxIssues,labels:{...e.labels},normalizeText:e.normalizeText}}function ss(e){return e.closest(is)||e}function $o(e){if(!e)return null;if(e.matches(Le))return e;const t=e.querySelector(Le);return t instanceof HTMLElement?t:null}function jh(){if(typeof window>"u")return null;const e=window[gc];if(!(e instanceof HTMLElement))return null;window[gc]=null;const t=$o(e);if(t)return t;const r=e.closest(is);if(r){const o=$o(r);if(o)return o}const n=e.closest(Le);return n instanceof HTMLElement?n:null}function Fh(e){const t=e.closest("[data-editora-editor]");if(t&&$o(t)===e)return t;let r=e;for(;r;){if(r.matches(is)&&(r===e||$o(r)===e))return r;r=r.parentElement}return ss(e)}function Ru(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function ua(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function Vh(e){const t=ss(e);if(ua(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return ua(r)?!0:ua(document.documentElement)||ua(document.body)}function wl(e,t){e.classList.remove("rte-doc-schema-theme-dark"),Vh(t)&&e.classList.add("rte-doc-schema-theme-dark")}function Kh(e){var t,r,n,o;for(let a=0;a<e.length;a+=1){const i=e[a];if(!(i.type!=="childList"||i.removedNodes.length===0))for(let l=0;l<i.removedNodes.length;l+=1){const s=i.removedNodes[l];if(s.nodeType!==Node.ELEMENT_NODE)continue;const c=s;if((t=c.matches)!=null&&t.call(c,Le)||(r=c.matches)!=null&&r.call(c,`.${P}`)||(n=c.querySelector)!=null&&n.call(c,Le)||(o=c.querySelector)!=null&&o.call(c,`.${P}`))return!0}}return!1}function Ia(){Array.from(Ai).forEach(t=>{t.isConnected||ds(t)})}function ct(e,t=!0,r=!0){var l;if(Ia(),(e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const s=$o(e.editorElement);if(s)return s}const n=jh();if(n)return n;const o=window.getSelection();if(o&&o.rangeCount>0){const s=(l=Ru(o.getRangeAt(0).startContainer))==null?void 0:l.closest(Le);if(s)return s}const a=document.activeElement;if(a){if(a.matches(Le))return a;const s=a.closest(Le);if(s)return s}if(r&&ke&&ke.isConnected)return ke;if(!t)return null;const i=document.querySelector(Le);return i instanceof HTMLElement?i:null}function Wh(e){const t=e.target;if(t){const n=t.closest(`.${P}`);if(n){const a=Array.from(Ee.entries()).find(([,i])=>i===n);if(a)return a[0]}const o=t.closest(Le);if(o)return o}const r=document.activeElement;if(r){const n=r.closest(`.${P}`);if(n){const a=Array.from(Ee.entries()).find(([,i])=>i===n);if(a)return a[0]}const o=r.closest(Le);if(o)return o}return null}function xc(e,t,r){const n=Fh(e);Array.from(n.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",r),a.setAttribute("data-active",r?"true":"false"),a.setAttribute("aria-pressed",r?"true":"false")})}function cs(e){const t=oi.get(e);typeof t=="number"&&(window.clearTimeout(t),oi.delete(e))}function Mt(e,t){return t&&e.schemas.find(r=>r.id===t)||null}function El(e){var t;return e.defaultSchemaId||((t=e.schemas[0])==null?void 0:t.id)||null}function oe(e,t){R.has(e)||R.set(e,t);let r=To.get(e);return r||(r={activeSchemaId:El(t),realtimeEnabled:t.enableRealtime,issues:[],headingCount:0,recognizedHeadingCount:0,missingCount:0,lastRunAt:null,snapshot:""},To.set(e,r)),(!r.activeSchemaId||!Mt(t,r.activeSchemaId))&&(r.activeSchemaId=El(t)),Ai.add(e),r}function ds(e){var t;cs(e),(t=Ee.get(e))==null||t.remove(),Ee.delete(e),qo.delete(e),R.delete(e),Da.delete(e),To.delete(e),Ai.delete(e),ke===e&&(ke=null)}function us(e){return qo.get(e)===!0}function Nu(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function Cl(e,t){if(!t.classList.contains("show"))return;const r=ss(e).getBoundingClientRect(),n=Math.min(window.innerWidth-20,440),o=Math.max(10,window.innerWidth-n-10),a=Math.min(Math.max(10,r.right-n),o),i=Math.max(10,Math.min(window.innerHeight-10,r.top+12));t.style.width=`${n}px`,t.style.left=`${a}px`,t.style.top=`${i}px`,t.style.maxHeight=`${Math.max(260,window.innerHeight-20)}px`}function Ba(e,t){const r=e.querySelector(".rte-doc-schema-live");r&&(r.textContent=t)}function Uh(e,t){const r=Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6")),n=[];return r.forEach((o,a)=>{const i=t(o.textContent||"");if(!i)return;const l=Number(o.tagName.slice(1))||0,s=ls(i,t);n.push({text:i,key:s,index:a,level:l})}),n}function Du(e,t,r){const n=Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6")),o=[];return n.forEach(a=>{const i=r(a.textContent||"");if(!i)return;const l=ls(i,r),s=l&&t.matchKeyToSection.get(l)||null,c=s?t.orderBySectionId.get(s.id)??null:null,d=kr(Number(a.tagName.slice(1))||0,1,6);o.push({element:a,level:d,section:s,order:c})}),o}function Gh(e,t=2){const r=e.filter(s=>s.section).map(s=>s.level),n=r.length>0?r:e.map(s=>s.level);if(n.length===0)return t;const o=new Map;n.forEach((s,c)=>{o.has(s)||o.set(s,{count:0,firstIndex:c});const d=o.get(s);d.count+=1});let a=t,i=-1,l=Number.MAX_SAFE_INTEGER;return o.forEach((s,c)=>{(s.count>i||s.count===i&&s.firstIndex<l||s.count===i&&s.firstIndex===l&&c<a)&&(a=c,i=s.count,l=s.firstIndex)}),kr(a,1,6)}function Zh(e){var a;const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);if(((a=Ru(r.startContainer))==null?void 0:a.closest(Le))!==e)return null;if(r.startContainer.nodeType===Node.ELEMENT_NODE){const i=r.startContainer,l=i.childNodes[r.startOffset]||null;return{parent:i,referenceNode:l}}const o=r.startContainer.parentNode;return o?{parent:o,referenceNode:r.startContainer.nextSibling||null}:null}function Yh(e,t,r,n){var s;const o=Du(e,r,n),a=r.orderBySectionId.get(t.id);if(typeof a!="number"||o.length===0)return{parent:e,referenceNode:null};const i=o.find(c=>typeof c.order=="number"&&c.order>a);if(i&&i.element.parentNode)return{parent:i.element.parentNode,referenceNode:i.element};let l=-1;for(let c=0;c<o.length;c+=1){const d=o[c];typeof d.order=="number"&&d.order<a&&(l=c)}if(l>=0){const c=((s=o[l+1])==null?void 0:s.element)||null;return{parent:(c==null?void 0:c.parentNode)||o[l].element.parentNode||e,referenceNode:c}}return{parent:e,referenceNode:null}}function Xh(e,t,r,n){const o=e.ownerDocument||document,a=`h${kr(n,1,6)}`,i=o.createElement(a);i.setAttribute("data-doc-schema-section",t.id),i.textContent=t.title;const l=o.createElement("p");return l.textContent=t.placeholder||r.labels.defaultPlaceholderText,[i,l]}function Vn(e,t,r,n={}){return hc+=1,{id:`doc-schema-issue-${hc}`,type:e,severity:t,message:r,...n}}function fa(e,t,r){return e.replace(/\{section\}/g,t||"").replace(/\{heading\}/g,r||"").trim()}function Jh(e,t,r){const n=Uh(e,r.normalizeText),o=[],a=new Map,i=[];for(let s=0;s<n.length&&!(o.length>=r.maxIssues);s+=1){const c=n[s];if(!c.key)continue;const d=t.matchKeyToSection.get(c.key);if(d){a.set(d.id,(a.get(d.id)||0)+1),i.push({section:d,heading:c});continue}t.allowUnknownHeadings||o.push(Vn("unknown-heading","warning",fa(r.labels.unknownHeadingMessage,null,c.text),{headingText:c.text,suggestion:"Map this heading to a schema alias or remove it from strict structure mode."}))}let l=0;for(let s=0;s<t.sections.length&&!(o.length>=r.maxIssues);s+=1){const c=t.sections[s],d=a.get(c.id)||0;d<c.minOccurrences&&(l+=1,o.push(Vn("missing-section","error",fa(r.labels.missingSectionMessage,c.title,null),{sectionId:c.id,sectionTitle:c.title,suggestion:`Add heading "${c.title}" to satisfy schema requirements.`}))),d>c.maxOccurrences&&o.length<r.maxIssues&&o.push(Vn("duplicate-section","warning",fa(r.labels.duplicateSectionMessage,c.title,null),{sectionId:c.id,sectionTitle:c.title,suggestion:`Keep at most ${c.maxOccurrences} instance(s) of "${c.title}".`}))}if(t.strictOrder&&o.length<r.maxIssues){let s=-1;for(let c=0;c<i.length&&!(o.length>=r.maxIssues);c+=1){const d=i[c],u=t.orderBySectionId.get(d.section.id)??c;u<s?o.push(Vn("out-of-order","warning",fa(r.labels.outOfOrderMessage,d.section.title,d.heading.text),{sectionId:d.section.id,sectionTitle:d.section.title,headingText:d.heading.text,suggestion:`Move "${d.section.title}" after earlier required sections.`})):s=u}}return{issues:o,headingCount:n.length,recognizedHeadingCount:i.length,missingCount:l}}function Hu(e){const t=R.get(e)||Ge,r=To.get(e),n=t?Mt(t,(r==null?void 0:r.activeSchemaId)||null):null;return{activeSchemaId:(r==null?void 0:r.activeSchemaId)||null,activeSchemaLabel:(n==null?void 0:n.label)||null,realtimeEnabled:(r==null?void 0:r.realtimeEnabled)===!0,issues:r!=null&&r.issues?r.issues.map(o=>({...o})):[],headingCount:(r==null?void 0:r.headingCount)||0,recognizedHeadingCount:(r==null?void 0:r.recognizedHeadingCount)||0,missingCount:(r==null?void 0:r.missingCount)||0,lastRunAt:(r==null?void 0:r.lastRunAt)||null}}function tr(e){const t=To.get(e);xc(e,"toggleDocSchemaPanel",us(e)),xc(e,"toggleDocSchemaRealtime",(t==null?void 0:t.realtimeEnabled)===!0)}function wr(e){const t=Ee.get(e);if(!t)return;const r=R.get(e)||Ge;if(!r)return;const n=oe(e,r),o=Mt(r,n.activeSchemaId),a=t.querySelector(".rte-doc-schema-label");a&&(a.textContent=r.labels.schemaLabel);const i=t.querySelector('[data-field="schema"]');i&&(i.innerHTML=r.schemas.map(b=>`<option value="${pt(b.id)}">${pt(b.label)}</option>`).join(""),i.value=n.activeSchemaId||"");const l=t.querySelector(".rte-doc-schema-description");if(l){const b=(o==null?void 0:o.description)||"";l.textContent=b?`${r.labels.schemaDescriptionPrefix}: ${b}`:"",l.hidden=!b}const s=t.querySelector(".rte-doc-schema-summary");if(s){const b=(o==null?void 0:o.label)||"N/A",y=n.issues.length;s.textContent=`${r.labels.summaryPrefix}: ${b} • ${y} issue${y===1?"":"s"}`}const c=t.querySelector(".rte-doc-schema-helper");c&&(c.textContent=r.labels.helperText);const d=t.querySelector(".rte-doc-schema-shortcut");d&&(d.textContent=r.labels.shortcutText);const u=t.querySelector('[data-action="run-validation"]');u&&(u.textContent=r.labels.validateText);const f=t.querySelector('[data-action="insert-missing"]');if(f){f.textContent=r.labels.insertMissingText;const b=n.issues.some(y=>y.type==="missing-section");f.disabled=!b||Nu(e)}const p=t.querySelector('[data-action="toggle-realtime"]');p&&(p.textContent=n.realtimeEnabled?r.labels.realtimeOnText:r.labels.realtimeOffText,p.setAttribute("aria-pressed",n.realtimeEnabled?"true":"false"));const g=t.querySelector('[data-action="close"]');g&&g.setAttribute("aria-label",r.labels.closeText);const m=t.querySelector(".rte-doc-schema-issues"),h=t.querySelector(".rte-doc-schema-empty");m&&(m.setAttribute("aria-label",r.labels.issueListLabel),n.issues.length===0?(m.innerHTML="",h&&(h.hidden=!1,h.textContent=r.labels.noIssuesText)):(h&&(h.hidden=!0),m.innerHTML=n.issues.map(b=>{const y=b.severity==="error"?"error":b.severity==="warning"?"warning":"info",E=b.sectionTitle||b.headingText||"";return`
            <li class="rte-doc-schema-issue ${y}" role="listitem">
              <p class="rte-doc-schema-issue-message">${pt(b.message)}${E?`: <strong>${pt(E)}</strong>`:""}</p>
              ${b.suggestion?`<p class="rte-doc-schema-issue-suggestion">${pt(b.suggestion)}</p>`:""}
            </li>
          `}).join(""))),t.setAttribute("aria-label",r.labels.panelAriaLabel)}function Lo(e,t=!1){const r=Ee.get(e);r&&(r.classList.remove("show"),qo.set(e,!1),tr(e),t&&e.focus({preventScroll:!0}))}function Sl(e){const t=ty(e);Ee.forEach((n,o)=>{o!==e&&Lo(o,!1)}),t.classList.add("show"),qo.set(e,!0),wr(e),Cl(e,t),tr(e);const r=t.querySelector('[data-field="schema"]');r==null||r.focus(),tt(e,"panel-open",!1)}function Iu(e,t){const r=us(e);return(typeof t=="boolean"?t:!r)?Sl(e):Lo(e,!1),!0}function Qh(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function ey(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function tt(e,t,r){const n=R.get(e)||Ge;if(!n)return[];const o=oe(e,n),a=Ee.get(e),i=e.innerHTML;if(!r&&o.snapshot===i)return o.issues;const l=Mt(n,o.activeSchemaId);if(!l)return o.issues=[Vn("missing-section","error","No active schema is configured for this editor.",{suggestion:"Set `defaultSchemaId` or update schema options."})],o.headingCount=0,o.recognizedHeadingCount=0,o.missingCount=1,o.lastRunAt=new Date().toISOString(),o.snapshot=i,wr(e),tr(e),o.issues;const s=Jh(e,l,n);return o.issues=s.issues,o.headingCount=s.headingCount,o.recognizedHeadingCount=s.recognizedHeadingCount,o.missingCount=s.missingCount,o.lastRunAt=new Date().toISOString(),o.snapshot=i,wr(e),tr(e),e.dispatchEvent(new CustomEvent("editora:doc-schema-validation",{bubbles:!0,detail:{reason:t,state:Hu(e)}})),a&&Ba(a,s.issues.length===0?n.labels.noIssuesText:`${s.issues.length} issue${s.issues.length===1?"":"s"} detected.`),o.issues}function Bu(e){const t=R.get(e)||Ge;if(!t)return;cs(e);const r=window.setTimeout(()=>{oi.delete(e),tt(e,"realtime",!1)},t.debounceMs);oi.set(e,r)}function Pu(e,t){const r=R.get(e)||Ge;if(!r)return!1;const n=oe(e,r),o=typeof t=="boolean"?t:!n.realtimeEnabled;return n.realtimeEnabled=o,o?Bu(e):cs(e),wr(e),tr(e),!0}function Ou(e){const t=R.get(e)||Ge;if(!t)return!1;const r=oe(e,t),n=Ee.get(e);if(Nu(e))return n&&Ba(n,t.labels.readonlyMessage),!1;const o=Mt(t,r.activeSchemaId);if(!o)return!1;tt(e,"insert-missing-pre",!0);const a=Array.from(new Set(r.issues.filter(f=>f.type==="missing-section"&&f.sectionId).map(f=>f.sectionId))),i=o.sections.filter(f=>a.includes(f.id));if(i.length===0)return n&&Ba(n,t.labels.noIssuesText),!1;const l=e.innerHTML,s=Du(e,o,t.normalizeText),c=Gh(s,2),d=Zh(e);i.forEach(f=>{const p=o.strictOrder?Yh(e,f,o,t.normalizeText):d||{parent:e,referenceNode:null},[g,m]=Xh(e,f,t,c);p.parent.insertBefore(g,p.referenceNode),p.parent.insertBefore(m,p.referenceNode)}),Qh(e,l),ey(e),tt(e,"insert-missing-post",!0);const u=i.map(f=>f.title).join(", ");return e.dispatchEvent(new CustomEvent("editora:doc-schema-insert-missing",{bubbles:!0,detail:{schemaId:o.id,sectionIds:i.map(f=>f.id)}})),n&&Ba(n,`${t.labels.insertedSummaryPrefix}: ${u}`),!0}function ty(e){const t=Ee.get(e);if(t)return t;const r=R.get(e)||Ge||Ha();oe(e,r);const n=`rte-doc-schema-panel-${Oh++}`,o=`${n}-schema`,a=document.createElement("section");return a.className=P,a.id=n,a.setAttribute("role","dialog"),a.setAttribute("aria-modal","false"),a.setAttribute("aria-label",r.labels.panelAriaLabel),a.innerHTML=`
    <header class="rte-doc-schema-header">
      <h2 class="rte-doc-schema-title">${pt(r.labels.panelTitle)}</h2>
      <button type="button" class="rte-doc-schema-icon-btn" data-action="close" aria-label="${pt(r.labels.closeText)}">✕</button>
    </header>
    <div class="rte-doc-schema-body">
      <label class="rte-doc-schema-label" for="${pt(o)}"></label>
      <select id="${pt(o)}" class="rte-doc-schema-select" data-field="schema"></select>
      <p class="rte-doc-schema-description" hidden></p>
      <p class="rte-doc-schema-summary"></p>
      <div class="rte-doc-schema-actions">
        <button type="button" class="rte-doc-schema-btn rte-doc-schema-btn-primary" data-action="run-validation"></button>
        <button type="button" class="rte-doc-schema-btn" data-action="insert-missing"></button>
        <button type="button" class="rte-doc-schema-btn" data-action="toggle-realtime" aria-pressed="false"></button>
      </div>
      <p class="rte-doc-schema-helper"></p>
      <p class="rte-doc-schema-shortcut"></p>
      <div class="rte-doc-schema-issues-wrap">
        <ul class="rte-doc-schema-issues" role="list" aria-label="${pt(r.labels.issueListLabel)}"></ul>
        <p class="rte-doc-schema-empty" hidden></p>
      </div>
    </div>
    <div class="rte-doc-schema-live" aria-live="polite" aria-atomic="true"></div>
  `,a.addEventListener("click",i=>{const l=i.target,s=l==null?void 0:l.closest("[data-action]");if(!s)return;const c=s.getAttribute("data-action");if(c==="close"){Lo(e,!0);return}if(c==="run-validation"){tt(e,"panel-button",!0);return}if(c==="insert-missing"){Ou(e);return}c==="toggle-realtime"&&Pu(e)}),a.addEventListener("change",i=>{const l=i.target;if(!(l instanceof HTMLSelectElement)||l.getAttribute("data-field")!=="schema")return;const s=R.get(e)||Ge;if(!s)return;const c=oe(e,s),d=l.value;Mt(s,d)&&(c.activeSchemaId=d,c.snapshot="",tt(e,"schema-change",!0))}),a.addEventListener("keydown",i=>{i.key==="Escape"&&(i.preventDefault(),Lo(e,!0))}),wl(a,e),document.body.appendChild(a),Ee.set(e,a),qo.set(e,!1),wr(e),a}function ry(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="g"}function ny(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="j"}function oy(e){Ge=e,cn||(cn=t=>{Ia();const r=t.target,n=r==null?void 0:r.closest(Le);if(!n)return;const o=R.get(n)||e;oe(n,o),R.set(n,o),ke=n,tr(n);const a=Ee.get(n);a&&(wl(a,n),Cl(n,a),wr(n))},document.addEventListener("focusin",cn,!0)),dn||(dn=t=>{const r=t.target,n=r==null?void 0:r.closest(Le);if(!n)return;const o=R.get(n)||Ge;!o||!oe(n,o).realtimeEnabled||Bu(n)},document.addEventListener("input",dn,!0)),un||(un=t=>{if(t.defaultPrevented)return;const r=t.target;if(r!=null&&r.closest(`.${P}`)&&t.key!=="Escape")return;const n=Wh(t);if(!n)return;const o=R.get(n)||Ge||e;if(oe(n,o),R.set(n,o),ke=n,t.key==="Escape"&&us(n)){t.preventDefault(),Lo(n,!0);return}if(ry(t)){t.preventDefault(),t.stopPropagation(),Iu(n);return}ny(t)&&(t.preventDefault(),t.stopPropagation(),tt(n,"shortcut",!0))},document.addEventListener("keydown",un,!0)),Wt||(Wt=()=>{Ia(),Ee.forEach((t,r)=>{!r.isConnected||!t.isConnected||(wl(t,r),Cl(r,t))})},window.addEventListener("scroll",Wt,!0),window.addEventListener("resize",Wt)),!fn&&typeof MutationObserver<"u"&&document.body&&(fn=new MutationObserver(t=>{Kh(t)&&Ia()}),fn.observe(document.body,{childList:!0,subtree:!0}))}function ay(){cn&&(document.removeEventListener("focusin",cn,!0),cn=null),dn&&(document.removeEventListener("input",dn,!0),dn=null),un&&(document.removeEventListener("keydown",un,!0),un=null),Wt&&(window.removeEventListener("scroll",Wt,!0),window.removeEventListener("resize",Wt),Wt=null),fn&&(fn.disconnect(),fn=null),Ee.forEach(t=>t.remove()),Ee.clear(),Array.from(Ai).forEach(t=>ds(t)),Ge=null,ke=null}function iy(){if(typeof document>"u"||document.getElementById(bc))return;const e=document.createElement("style");e.id=bc,e.textContent=`
    .rte-toolbar-group-items.${ze},
    .editora-toolbar-group-items.${ze},
    .rte-toolbar-group-items.${st},
    .editora-toolbar-group-items.${st},
    .rte-toolbar-group-items.${Pt},
    .editora-toolbar-group-items.${Pt} {
      display: flex;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: #ffffff;
    }

    .rte-toolbar-group-items.${ze} .rte-toolbar-button,
    .editora-toolbar-group-items.${ze} .editora-toolbar-button,
    .rte-toolbar-group-items.${st} .rte-toolbar-button,
    .editora-toolbar-group-items.${st} .editora-toolbar-button,
    .rte-toolbar-group-items.${Pt} .rte-toolbar-button,
    .editora-toolbar-group-items.${Pt} .editora-toolbar-button {
      border: none;
      border-right: 1px solid #cbd5e1;
      border-radius: 0;
    }

    .rte-toolbar-group-items.${ze} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${ze} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${st} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${st} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${Pt} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${Pt} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    ${_e} .rte-toolbar-group-items.${ze},
    ${_e} .editora-toolbar-group-items.${ze},
    ${_e} .rte-toolbar-group-items.${st},
    ${_e} .editora-toolbar-group-items.${st},
    ${_e} .rte-toolbar-group-items.${Pt},
    ${_e} .editora-toolbar-group-items.${Pt} {
      border-color: #566275;
    }
    .rte-toolbar-button[data-command="toggleDocSchemaRealtime"].active,
    .editora-toolbar-button[data-command="toggleDocSchemaRealtime"].active {
      background-color: #ccc;
    }
    ${_e} .rte-toolbar-group-items.${ze} .rte-toolbar-button svg,
    ${_e} .editora-toolbar-group-items.${ze} .editora-toolbar-button svg,
    ${_e} .rte-toolbar-group-items.${st} .rte-toolbar-button svg,
    ${_e} .editora-toolbar-group-items.${st} .editora-toolbar-button svg
    {
      fill: none;
    }
    ${_e} .rte-toolbar-group-items.${ze} .rte-toolbar-button,
    ${_e} .editora-toolbar-group-items.${ze} .editora-toolbar-button
    {
      border-color: #566275;
    }
    .${P} {
      position: fixed;
      z-index: 12000;
      display: none;
      width: min(440px, calc(100vw - 20px));
      max-height: calc(100vh - 20px);
      border: 1px solid #d1d5db;
      border-radius: 14px;
      background: #ffffff;
      color: #0f172a;
      box-shadow: 0 24px 48px rgba(15, 23, 42, 0.24);
      overflow: hidden;
    }

    .${P}.show {
      display: flex;
      flex-direction: column;
    }

    .${P}.rte-doc-schema-theme-dark {
      border-color: #334155;
      background: #0f172a;
      color: #e2e8f0;
      box-shadow: 0 24px 52px rgba(2, 6, 23, 0.68);
    }

    .rte-doc-schema-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid #e2e8f0;
      background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
    }

    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-header {
      border-color: #1e293b;
      background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
    }

    .rte-doc-schema-title {
      margin: 0;
      font-size: 15px;
      line-height: 1.2;
      font-weight: 700;
    }

    .rte-doc-schema-icon-btn {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      min-height: 34px;
      width: 34px;
      background: #ffffff;
      color: #0f172a;
      font-size: 16px;
      line-height: 1;
      font-weight: 600;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .rte-doc-schema-icon-btn:hover,
    .rte-doc-schema-icon-btn:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-icon-btn {
      border-color: #475569;
      background: #0f172a;
      color: #e2e8f0;
    }

    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-icon-btn:hover,
    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-icon-btn:focus-visible {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.24);
    }

    .rte-doc-schema-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      overflow: auto;
    }

    .rte-doc-schema-label {
      font-size: 12px;
      line-height: 1.3;
      font-weight: 700;
      color: #334155;
    }

    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-label {
      color: #cbd5e1;
    }

    .rte-doc-schema-select {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 34px;
      padding: 0 10px;
      font-size: 13px;
      background: #ffffff;
      color: inherit;
    }

    .rte-doc-schema-select:focus-visible {
      border-color: #0f766e;
      box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.18);
      outline: none;
    }

    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-select {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .rte-doc-schema-description,
    .rte-doc-schema-summary,
    .rte-doc-schema-helper,
    .rte-doc-schema-shortcut {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #475569;
    }

    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-description,
    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-summary,
    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-helper,
    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-shortcut {
      color: #94a3b8;
    }

    .rte-doc-schema-actions {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
    }

    .rte-doc-schema-btn {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 34px;
      padding: 0 8px;
      background: #ffffff;
      color: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .rte-doc-schema-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .rte-doc-schema-btn-primary {
      border-color: #0f766e;
      background: #0f766e;
      color: #f8fafc;
    }

    .rte-doc-schema-btn:hover,
    .rte-doc-schema-btn:focus-visible {
      border-color: #94a3b8;
      outline: none;
    }

    .rte-doc-schema-btn-primary:hover,
    .rte-doc-schema-btn-primary:focus-visible {
      border-color: #115e59;
      background: #115e59;
    }

    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-btn-primary {
      border-color: #14b8a6;
      background: #0f766e;
      color: #f0fdfa;
    }

    .rte-doc-schema-issues-wrap {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 6px;
      background: #f8fafc;
      max-height: min(40vh, 320px);
      overflow: auto;
    }

    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-issues-wrap {
      border-color: #334155;
      background: #0b1220;
    }

    .rte-doc-schema-issues {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 6px;
    }

    .rte-doc-schema-issue {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      padding: 8px;
      display: grid;
      gap: 4px;
    }

    .rte-doc-schema-issue.error {
      border-color: #ef4444;
      background: #fef2f2;
    }

    .rte-doc-schema-issue.warning {
      border-color: #f59e0b;
      background: #fffbeb;
    }

    .rte-doc-schema-issue.info {
      border-color: #0ea5e9;
      background: #f0f9ff;
    }

    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-issue {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-issue.error {
      border-color: rgba(239, 68, 68, 0.7);
      background: rgba(127, 29, 29, 0.28);
    }

    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-issue.warning {
      border-color: rgba(245, 158, 11, 0.72);
      background: rgba(120, 53, 15, 0.28);
    }

    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-issue.info {
      border-color: rgba(14, 165, 233, 0.7);
      background: rgba(7, 89, 133, 0.28);
    }

    .rte-doc-schema-issue-message,
    .rte-doc-schema-issue-suggestion {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #1f2937;
    }

    .rte-doc-schema-issue-suggestion {
      color: #475569;
    }

    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-issue-message {
      color: #e2e8f0;
    }

    .${P}.rte-doc-schema-theme-dark .rte-doc-schema-issue-suggestion {
      color: #cbd5e1;
    }

    .rte-doc-schema-empty {
      margin: 8px;
      font-size: 12px;
      color: #64748b;
    }

    .rte-doc-schema-live {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      border: 0;
    }

    @media (max-width: 768px) {
      .${P} {
        left: 10px !important;
        right: 10px;
        top: 10px !important;
        width: auto !important;
        max-height: calc(100vh - 20px);
      }

      .rte-doc-schema-actions {
        grid-template-columns: 1fr;
      }
    }
  `,document.head.appendChild(e)}const ly=(e={})=>{const t=Ha(e),r=new Set;return iy(),{name:"docSchema",toolbar:[{id:"docSchemaGroup",label:"Document Schema",type:"group",command:"docSchema",items:[{id:"toggleDocSchemaPanel",label:"Document Schema",command:"toggleDocSchemaPanel",shortcut:"Mod-Alt-Shift-g",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M6 4.5h12A1.5 1.5 0 0 1 19.5 6v12A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5Z" stroke="currentColor" stroke-width="1.6"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'},{id:"runDocSchemaValidation",label:"Run Schema Validation",command:"runDocSchemaValidation",shortcut:"Mod-Alt-Shift-j",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M12 3.5 4.5 6.5v5c0 4.8 3.1 8.9 7.5 10 4.4-1.1 7.5-5.2 7.5-10v-5L12 3.5Z" stroke="currentColor" stroke-width="1.6"/><path d="m9 12.5 2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'},{id:"toggleDocSchemaRealtime",label:"Toggle Schema Realtime",command:"toggleDocSchemaRealtime",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 1 7.5 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9.5 19.5H5.5v-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>'}]}],commands:{docSchema:(n,o)=>{const a=ct(o,!1,!1);if(!a)return!1;const i=R.get(a)||t;return oe(a,i),R.set(a,i),ke=a,Sl(a),!0},openDocSchemaPanel:(n,o)=>{const a=ct(o,!1,!1);if(!a)return!1;const i=R.get(a)||t;return oe(a,i),R.set(a,i),ke=a,Sl(a),!0},toggleDocSchemaPanel:(n,o)=>{const a=ct(o,!1,!1);if(!a)return!1;const i=R.get(a)||t;return oe(a,i),R.set(a,i),ke=a,Iu(a,typeof n=="boolean"?n:void 0)},runDocSchemaValidation:(n,o)=>{const a=ct(o,!1,!1);if(!a)return!1;const i=R.get(a)||t;return oe(a,i),R.set(a,i),ke=a,tt(a,"command",!0),!0},insertMissingDocSchemaSections:(n,o)=>{const a=ct(o,!1,!1);if(!a)return!1;const i=R.get(a)||t;return oe(a,i),R.set(a,i),ke=a,Ou(a)},toggleDocSchemaRealtime:(n,o)=>{const a=ct(o,!1,!1);if(!a)return!1;const i=R.get(a)||t;return oe(a,i),R.set(a,i),ke=a,Pu(a,typeof n=="boolean"?n:void 0)},setDocSchemaMode:(n,o)=>{const a=ct(o,!1,!1);if(!a)return!1;const i=R.get(a)||t,l=oe(a,i);R.set(a,i);const s=typeof n=="string"?n:(n==null?void 0:n.schemaId)||(n==null?void 0:n.id);return!s||!Mt(i,s)?!1:(l.activeSchemaId=s,l.snapshot="",tt(a,"set-mode",!0),!0)},setDocSchemaOptions:(n,o)=>{const a=ct(o,!1,!1);if(!a||!n||typeof n!="object")return!1;const i=R.get(a)||t,l=Da.get(a)||qh(i),s={...l,...n,labels:{...l.labels||{},...n.labels||{}},schemas:Array.isArray(n.schemas)?n.schemas:l.schemas,normalizeText:n.normalizeText||i.normalizeText},c=Ha(s);R.set(a,c),Da.set(a,s);const d=oe(a,c);return typeof n.enableRealtime=="boolean"&&(d.realtimeEnabled=n.enableRealtime),(!d.activeSchemaId||!Mt(c,d.activeSchemaId))&&(d.activeSchemaId=El(c)),typeof n.defaultSchemaId=="string"&&Mt(c,n.defaultSchemaId)&&(d.activeSchemaId=n.defaultSchemaId),d.snapshot="",tt(a,"set-options",!0),wr(a),tr(a),!0},getDocSchemaState:(n,o)=>{const a=ct(o,!1,!1);if(!a)return!1;const i=R.get(a)||t;oe(a,i);const l=Hu(a);if(typeof n=="function")try{n(l)}catch{}return a.__docSchemaState=l,a.dispatchEvent(new CustomEvent("editora:doc-schema-state",{bubbles:!0,detail:l})),!0}},keymap:{"Mod-Alt-Shift-g":"toggleDocSchemaPanel","Mod-Alt-Shift-G":"toggleDocSchemaPanel","Mod-Alt-Shift-j":"runDocSchemaValidation","Mod-Alt-Shift-J":"runDocSchemaValidation"},init:function(o){da+=1;const a=this&&typeof this.__pluginConfig=="object"?{...e,...this.__pluginConfig}:e,i=Ha(a);oy(i);const l=ct(o!=null&&o.editorElement?{editorElement:o.editorElement}:void 0,!1,!1);l&&(ke=l,r.add(l),oe(l,i),R.set(l,i),Da.set(l,a),tr(l),tt(l,"init",!0))},destroy:()=>{r.forEach(n=>ds(n)),r.clear(),da=Math.max(0,da-1),!(da>0)&&ay()}}},Ae=".rte-content, .editora-content",fs="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",vc="__editoraCommandEditorRoot",kc="rte-translation-workflow-styles",A="rte-translation-workflow-panel",qe="translation-workflow",dt="translationWorkflow",ue=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',wc=["p","h1","h2","h3","h4","h5","h6","li","td","th","blockquote","figcaption"].join(", "),zu=new Set(["ArrowUp","ArrowDown","Home","End"]),Ec=[{locale:"en",label:"English",minLengthRatio:.6,maxLengthRatio:1.4,requireDifferentFromSource:!1,preserveTokens:!0},{locale:"fr",label:"French",minLengthRatio:.75,maxLengthRatio:1.7,requireDifferentFromSource:!0,preserveTokens:!0},{locale:"de",label:"German",minLengthRatio:.8,maxLengthRatio:1.9,requireDifferentFromSource:!0,preserveTokens:!0},{locale:"es",label:"Spanish",minLengthRatio:.7,maxLengthRatio:1.7,requireDifferentFromSource:!0,preserveTokens:!0},{locale:"it",label:"Italian",minLengthRatio:.7,maxLengthRatio:1.7,requireDifferentFromSource:!0,preserveTokens:!0},{locale:"ja",label:"Japanese",minLengthRatio:.45,maxLengthRatio:1.2,requireDifferentFromSource:!0,preserveTokens:!0},{locale:"zh",label:"Chinese",minLengthRatio:.4,maxLengthRatio:1.2,requireDifferentFromSource:!0,preserveTokens:!0}],sy={panelTitle:"Translation Workflow",panelAriaLabel:"Translation workflow panel",sourceLocaleLabel:"Source Locale",targetLocaleLabel:"Target Locale",validateText:"Validate Locale",captureSourceText:"Capture Source",lockSelectedText:"Lock Selected",unlockSelectedText:"Unlock Selected",lockSegmentAriaLabel:"Lock segment",unlockSegmentAriaLabel:"Unlock segment",realtimeOnText:"Realtime On",realtimeOffText:"Realtime Off",closeText:"Close",summaryPrefix:"Locale QA",noIssuesText:"No locale validation issues.",issuesLabel:"Locale issues",segmentsLabel:"Segments",sourcePreviewLabel:"Source",targetPreviewLabel:"Target",helperText:"Select segments, lock finalized ones, and run locale validation before handoff.",shortcutText:"Shortcuts: Ctrl/Cmd+Alt+Shift+L (panel), Ctrl/Cmd+Alt+Shift+V (validate), Ctrl/Cmd+Alt+Shift+K (lock segment)",readonlySegmentMessage:"This segment is locked. Unlock before editing.",sourceCapturedMessage:"Source snapshot captured from current content.",selectedSegmentPrefix:"Selected Segment",missingTargetMessage:"Segment is empty in target locale.",tokenMismatchMessage:"Tokens/placeholders do not match source segment.",untranslatedMessage:"Segment appears untranslated (same as source).",lengthOutOfRangeMessage:"Translation length is outside expected locale range."},L=new WeakMap,Pa=new WeakMap,Er=new WeakMap,ae=new Map,jo=new WeakMap,ai=new WeakMap,Fo=new Set;let ma=0,cy=0,Cc=0,dy=0,be=null,ye=null,mn=null,pn=null,gn=null,bn=null,Ut=null,hn=null;function j(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function uy(e){return e.replace(/\u00A0/g," ").replace(/\s+/g," ").trim()}function dr(e,t,r){return Number.isFinite(e)?Math.max(t,Math.min(r,e)):t}function At(e){return(e||"").trim()||"en-US"}function ao(e){return e.trim().toLowerCase()}function fy(e){return e.replace(/"/g,"&quot;")}function my(e,t=120){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1)).trimEnd()}…`}function Sc(e){const t=e.match(/\{\{[^{}]+\}\}|%[A-Z0-9_]+%|\$\{[^{}]+\}/gi);return!t||t.length===0?[]:t.map(r=>r.trim()).filter(Boolean)}function py(e,t){const r=Sc(e).sort(),n=Sc(t).sort();if(r.length!==n.length)return!1;for(let o=0;o<r.length;o+=1)if(r[o]!==n[o])return!1;return!0}function gy(e,t){const r=Array.isArray(t)&&t.length>0?t:Ec,n=[],o=new Set;return r.forEach(a=>{const i=ao(a.locale||"");if(!i)return;const l=i;o.has(l)||(o.add(l),n.push({locale:l,label:(a.label||i).trim()||i,minLengthRatio:dr(Number(a.minLengthRatio??.5),.1,3),maxLengthRatio:dr(Number(a.maxLengthRatio??1.8),.2,4),requireDifferentFromSource:a.requireDifferentFromSource!==!1,preserveTokens:a.preserveTokens!==!1}))}),e.forEach(a=>{const i=ao(a);if(o.has(i))return;const l=Ec.find(s=>i.startsWith(s.locale));n.push(l?{...l,locale:i,label:a}:{locale:i,label:a,minLengthRatio:.5,maxLengthRatio:1.8,requireDifferentFromSource:!0,preserveTokens:!0})}),n}function Oa(e={}){const t=e.normalizeText||uy,r=At(e.sourceLocale||"en-US"),n=At(e.targetLocale||"fr-FR"),o=new Set([r,n]);(Array.isArray(e.locales)?e.locales:[]).forEach(l=>{if(typeof l!="string")return;const s=At(l);s&&o.add(s)});const a=Array.from(o),i=gy(a,e.localeRules);return{sourceLocale:r,targetLocale:n,locales:a,localeRules:i,enableRealtime:e.enableRealtime!==!1,debounceMs:dr(Number(e.debounceMs??260),60,2e3),maxIssues:dr(Number(e.maxIssues??120),5,1e3),maxSegments:dr(Number(e.maxSegments??600),20,3e3),minSourceLengthForRatio:dr(Number(e.minSourceLengthForRatio??8),2,100),segmentSelector:(e.segmentSelector||wc).trim()||wc,labels:{...sy,...e.labels||{}},normalizeText:t}}function by(e){return{sourceLocale:e.sourceLocale,targetLocale:e.targetLocale,locales:[...e.locales],localeRules:e.localeRules.map(t=>({locale:t.locale,label:t.label,minLengthRatio:t.minLengthRatio,maxLengthRatio:t.maxLengthRatio,requireDifferentFromSource:t.requireDifferentFromSource,preserveTokens:t.preserveTokens})),enableRealtime:e.enableRealtime,debounceMs:e.debounceMs,maxIssues:e.maxIssues,maxSegments:e.maxSegments,minSourceLengthForRatio:e.minSourceLengthForRatio,segmentSelector:e.segmentSelector,labels:{...e.labels},normalizeText:e.normalizeText}}function ms(e){return e.closest(fs)||e}function Ao(e){if(!e)return null;if(e.matches(Ae))return e;const t=e.querySelector(Ae);return t instanceof HTMLElement?t:null}function hy(){if(typeof window>"u")return null;const e=window[vc];if(!(e instanceof HTMLElement))return null;window[vc]=null;const t=Ao(e);if(t)return t;const r=e.closest(fs);if(r){const o=Ao(r);if(o)return o}const n=e.closest(Ae);return n instanceof HTMLElement?n:null}function yy(e){const t=e.closest("[data-editora-editor]");if(t&&Ao(t)===e)return t;let r=e;for(;r;){if(r.matches(fs)&&(r===e||Ao(r)===e))return r;r=r.parentElement}return ms(e)}function _u(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function pa(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function xy(e){const t=ms(e);if(pa(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return pa(r)?!0:pa(document.documentElement)||pa(document.body)}function Tl(e,t){e.classList.remove("rte-translation-workflow-theme-dark"),xy(t)&&e.classList.add("rte-translation-workflow-theme-dark")}function vy(e){var t,r,n,o;for(let a=0;a<e.length;a+=1){const i=e[a];if(!(i.type!=="childList"||i.removedNodes.length===0))for(let l=0;l<i.removedNodes.length;l+=1){const s=i.removedNodes[l];if(s.nodeType!==Node.ELEMENT_NODE)continue;const c=s;if((t=c.matches)!=null&&t.call(c,Ae)||(r=c.matches)!=null&&r.call(c,`.${A}`)||(n=c.querySelector)!=null&&n.call(c,Ae)||(o=c.querySelector)!=null&&o.call(c,`.${A}`))return!0}}return!1}function za(){Array.from(Fo).forEach(t=>{t.isConnected||gs(t)})}function Ye(e,t=!0,r=!0){var l;if(za(),(e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const s=Ao(e.editorElement);if(s)return s}const n=hy();if(n)return n;const o=window.getSelection();if(o&&o.rangeCount>0){const s=(l=_u(o.getRangeAt(0).startContainer))==null?void 0:l.closest(Ae);if(s)return s}const a=document.activeElement;if(a){if(a.matches(Ae))return a;const s=a.closest(Ae);if(s)return s}if(r&&ye&&ye.isConnected)return ye;if(!t)return null;const i=document.querySelector(Ae);return i instanceof HTMLElement?i:null}function ky(e){const t=e.target;if(t){const n=t.closest(`.${A}`);if(n){const a=Array.from(ae.entries()).find(([,i])=>i===n);if(a)return a[0]}const o=t.closest(Ae);if(o)return o}const r=document.activeElement;if(r){const n=r.closest(`.${A}`);if(n){const a=Array.from(ae.entries()).find(([,i])=>i===n);if(a)return a[0]}const o=r.closest(Ae);if(o)return o}return null}function Qi(e,t,r){const n=yy(e);Array.from(n.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",r),a.setAttribute("data-active",r?"true":"false"),a.setAttribute("aria-pressed",r?"true":"false")})}function ps(e){const t=ai.get(e);typeof t=="number"&&(window.clearTimeout(t),ai.delete(e))}function wy(e,t){const r=ao(t),n=e.localeRules.find(i=>ao(i.locale)===r);if(n)return n;const o=r.split("-")[0],a=e.localeRules.find(i=>ao(i.locale).split("-")[0]===o);return a||{locale:r,label:t,minLengthRatio:.5,maxLengthRatio:1.8,requireDifferentFromSource:!0,preserveTokens:!0}}function ga(e,t,r,n={}){return Cc+=1,{id:`translation-workflow-issue-${Cc}`,type:e,severity:t,message:r,...n}}function Mi(e,t){if(t){e.hasAttribute("data-translation-prev-contenteditable")||e.setAttribute("data-translation-prev-contenteditable",e.hasAttribute("contenteditable")&&e.getAttribute("contenteditable")||"inherit"),e.setAttribute("data-translation-locked","true"),e.setAttribute("contenteditable","false"),e.setAttribute("aria-readonly","true"),e.classList.add("rte-translation-segment-locked");return}if(e.removeAttribute("data-translation-locked"),e.removeAttribute("aria-readonly"),e.classList.remove("rte-translation-segment-locked"),e.hasAttribute("data-translation-prev-contenteditable")){const r=e.getAttribute("data-translation-prev-contenteditable")||"";r==="inherit"?e.setAttribute("contenteditable","true"):e.setAttribute("contenteditable",r),e.removeAttribute("data-translation-prev-contenteditable")}else e.setAttribute("contenteditable","true")}function Ri(e,t){return e.querySelector(`[data-translation-segment-id="${fy(t)}"]`)}function qu(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=_u(t.getRangeAt(0).startContainer);return!r||!e.contains(r)?null:r.closest("[data-translation-segment-id]")}function Ey(e,t){const r=Array.from(e.querySelectorAll(t));if(r.length<=1)return r;const n=new Set(r);return r.filter(o=>{let a=o.parentElement;for(;a&&a!==e;){if(n.has(a))return!1;a=a.parentElement}return!0})}function Cy(e,t,r){let n=(r||"").trim();if(!n||t.has(n)){do n=`translation-segment-${cy++}`;while(t.has(n));e.setAttribute("data-translation-segment-id",n)}return n}function $l(e,t){if(t.lockedSegmentIds.size===0)return!1;let r=!1;return t.lockedSegmentIds.forEach(n=>{const o=Ri(e,n);if(!o)return;Mi(o,!0);const a=t.lockedHtmlBySegmentId.get(n);if(typeof a=="string"){o.innerHTML!==a&&(o.innerHTML=a,r=!0);return}t.lockedHtmlBySegmentId.set(n,o.innerHTML)}),r}function rr(e,t,r){var i;const n=Ey(e,t.segmentSelector),o=[],a=new Set;for(let l=0;l<n.length&&!(o.length>=t.maxSegments);l+=1){const s=n[l],c=Cy(s,a,s.getAttribute("data-translation-segment-id")),d=r.lockedSegmentIds.has(c),u=s.getAttribute("data-translation-locked")==="true",f=d||u;if(f)if(r.lockedSegmentIds.add(c),Mi(s,!0),!r.lockedHtmlBySegmentId.has(c))r.lockedHtmlBySegmentId.set(c,s.innerHTML);else{const m=r.lockedHtmlBySegmentId.get(c)||"";s.innerHTML!==m&&(s.innerHTML=m)}else r.lockedHtmlBySegmentId.delete(c);const p=t.normalizeText(s.textContent||"");if(!p)continue;r.sourceTextBySegmentId.has(c)||r.sourceTextBySegmentId.set(c,p);const g=r.sourceTextBySegmentId.get(c)||p;o.push({id:c,tagName:s.tagName.toLowerCase(),index:o.length,text:p,sourceText:g,locked:f}),a.add(c)}return Array.from(r.sourceTextBySegmentId.keys()).forEach(l=>{a.has(l)||r.sourceTextBySegmentId.delete(l)}),Array.from(r.lockedSegmentIds.keys()).forEach(l=>{a.has(l)||r.lockedSegmentIds.delete(l)}),Array.from(r.lockedHtmlBySegmentId.keys()).forEach(l=>{(!a.has(l)||!r.lockedSegmentIds.has(l))&&r.lockedHtmlBySegmentId.delete(l)}),(!r.selectedSegmentId||!o.some(l=>l.id===r.selectedSegmentId))&&(r.selectedSegmentId=((i=o[0])==null?void 0:i.id)||null),o}function W(e,t){L.has(e)||L.set(e,t);let r=Er.get(e);return r||(r={sourceLocale:t.sourceLocale,targetLocale:t.targetLocale,selectedSegmentId:null,realtimeEnabled:t.enableRealtime,segments:[],issues:[],sourceTextBySegmentId:new Map,lockedSegmentIds:new Set,lockedHtmlBySegmentId:new Map,snapshot:"",lastRunAt:null},Er.set(e,r)),Fo.add(e),r}function gs(e){ps(e);const t=ae.get(e);t&&t.remove(),ae.delete(e),jo.delete(e);const r=Er.get(e);r&&(r.lockedSegmentIds.forEach(n=>{const o=Ri(e,n);o&&Mi(o,!1)}),r.lockedHtmlBySegmentId.clear()),L.delete(e),Pa.delete(e),Er.delete(e),Fo.delete(e),ye===e&&(ye=null)}function bs(e){return jo.get(e)===!0}function Ll(e,t){if(!t.classList.contains("show"))return;const r=ms(e).getBoundingClientRect(),n=Math.min(window.innerWidth-20,520),o=Math.max(10,window.innerWidth-n-10),a=Math.min(Math.max(10,r.right-n),o),i=Math.max(10,Math.min(window.innerHeight-10,r.top+12));t.style.width=`${n}px`,t.style.left=`${a}px`,t.style.top=`${i}px`,t.style.maxHeight=`${Math.max(260,window.innerHeight-20)}px`}function ur(e,t){const r=e.querySelector(".rte-translation-live");r&&(r.textContent=t)}function Sy(e,t){return`${e.innerHTML}::${t.sourceLocale}::${t.targetLocale}::${Array.from(t.lockedSegmentIds).sort().join("|")}`}function Ty(e,t,r){const n=[],o=wy(r,t.targetLocale);for(let a=0;a<e.length&&!(n.length>=r.maxIssues);a+=1){const i=e[a],l=r.normalizeText(i.sourceText||""),s=r.normalizeText(i.text||"");if(!s){n.push(ga("missing-target","error",r.labels.missingTargetMessage,{segmentId:i.id,sourceText:l,targetText:s,suggestion:"Provide translated content for this segment before export."}));continue}if(o.preserveTokens&&l&&!py(l,s)&&(n.push(ga("token-mismatch","error",r.labels.tokenMismatchMessage,{segmentId:i.id,sourceText:l,targetText:s,suggestion:"Preserve placeholders/tokens exactly (for example {{name}}, %ID%, ${value})."})),n.length>=r.maxIssues)||o.requireDifferentFromSource&&l&&r.normalizeText(l)===r.normalizeText(s)&&(n.push(ga("untranslated","warning",r.labels.untranslatedMessage,{segmentId:i.id,sourceText:l,targetText:s,suggestion:"Translate the segment or mark it intentionally unchanged."})),n.length>=r.maxIssues))break;if(l.length>=r.minSourceLengthForRatio){const c=s.length/Math.max(1,l.length);(c<o.minLengthRatio||c>o.maxLengthRatio)&&n.push(ga("length-out-of-range","warning",r.labels.lengthOutOfRangeMessage,{segmentId:i.id,sourceText:l,targetText:s,suggestion:`Expected ratio for ${o.label}: ${o.minLengthRatio.toFixed(2)} - ${o.maxLengthRatio.toFixed(2)}.`}))}}return n}function ju(e){const t=L.get(e)||be,r=Er.get(e);return{sourceLocale:(r==null?void 0:r.sourceLocale)||(t==null?void 0:t.sourceLocale)||"en-US",targetLocale:(r==null?void 0:r.targetLocale)||(t==null?void 0:t.targetLocale)||"fr-FR",realtimeEnabled:(r==null?void 0:r.realtimeEnabled)===!0,selectedSegmentId:(r==null?void 0:r.selectedSegmentId)||null,segmentCount:(r==null?void 0:r.segments.length)||0,lockedSegmentCount:r?r.segments.filter(n=>n.locked).length:0,issues:r!=null&&r.issues?r.issues.map(n=>({...n})):[],segments:(r==null?void 0:r.segments.map(n=>({id:n.id,tagName:n.tagName,index:n.index,sourceLength:n.sourceText.length,targetLength:n.text.length,locked:n.locked})))||[],lastRunAt:(r==null?void 0:r.lastRunAt)||null}}function ht(e){const t=Er.get(e),r=t&&t.selectedSegmentId?t.segments.find(n=>n.id===t.selectedSegmentId):null;Qi(e,"toggleTranslationWorkflowPanel",bs(e)),Qi(e,"toggleTranslationRealtime",(t==null?void 0:t.realtimeEnabled)===!0),Qi(e,"toggleTranslationSegmentLock",(r==null?void 0:r.locked)===!0)}function $y(e,t){const r=Ri(e,t);if(!r)return;try{r.scrollIntoView({block:"nearest",inline:"nearest"})}catch{}const n=window.getSelection();if(!(!n||typeof document.createRange!="function"))try{const o=document.createRange();o.selectNodeContents(r),o.collapse(!0),n.removeAllRanges(),n.addRange(o),e.focus({preventScroll:!0})}catch{}}function Rt(e){const t=ae.get(e);if(!t)return;const r=L.get(e)||be;if(!r)return;const n=W(e,r),o=t.querySelector(".rte-translation-source-label");o&&(o.textContent=r.labels.sourceLocaleLabel);const a=t.querySelector(".rte-translation-target-label");a&&(a.textContent=r.labels.targetLocaleLabel);const i=t.querySelector('[data-field="source-locale"]'),l=t.querySelector('[data-field="target-locale"]'),s=r.locales.map(k=>`<option value="${j(k)}">${j(k)}</option>`).join("");i&&(i.innerHTML=s,i.value=n.sourceLocale),l&&(l.innerHTML=s,l.value=n.targetLocale);const c=t.querySelector(".rte-translation-summary");if(c){const k=n.issues.length,x=n.selectedSegmentId?` • ${r.labels.selectedSegmentPrefix}: ${n.selectedSegmentId}`:"";c.textContent=`${r.labels.summaryPrefix}: ${n.sourceLocale} → ${n.targetLocale} • ${k} issue${k===1?"":"s"}${x}`}const d=t.querySelector(".rte-translation-helper");d&&(d.textContent=r.labels.helperText);const u=t.querySelector(".rte-translation-shortcut");u&&(u.textContent=r.labels.shortcutText);const f=t.querySelector('[data-action="run-validation"]');f&&(f.textContent=r.labels.validateText);const p=t.querySelector('[data-action="capture-source"]');p&&(p.textContent=r.labels.captureSourceText);const g=t.querySelector('[data-action="toggle-realtime"]');g&&(g.textContent=n.realtimeEnabled?r.labels.realtimeOnText:r.labels.realtimeOffText,g.setAttribute("aria-pressed",n.realtimeEnabled?"true":"false"));const m=t.querySelector('[data-action="lock-selected"]'),h=n.selectedSegmentId&&n.segments.find(k=>k.id===n.selectedSegmentId)||null;m&&(m.textContent=h!=null&&h.locked?r.labels.unlockSelectedText:r.labels.lockSelectedText,m.disabled=!h,m.setAttribute("aria-pressed",h!=null&&h.locked?"true":"false"));const b=t.querySelector('[data-action="close"]');b&&b.setAttribute("aria-label",r.labels.closeText);const y=t.querySelector(".rte-translation-issues"),E=t.querySelector(".rte-translation-empty");y&&(y.setAttribute("aria-label",r.labels.issuesLabel),n.issues.length===0?(y.innerHTML="",E&&(E.hidden=!1,E.textContent=r.labels.noIssuesText)):(E&&(E.hidden=!0),y.innerHTML=n.issues.map(k=>`
            <li class="rte-translation-issue ${k.severity==="error"?"error":k.severity==="warning"?"warning":"info"}" role="listitem" data-segment-id="${j(k.segmentId||"")}">
              <p class="rte-translation-issue-message">${j(k.message)}</p>
              ${k.suggestion?`<p class="rte-translation-issue-suggestion">${j(k.suggestion)}</p>`:""}
            </li>
          `).join("")));const v=t.querySelector(".rte-translation-segments");v&&(v.setAttribute("aria-label",r.labels.segmentsLabel),v.innerHTML=n.segments.map(k=>{const x=k.id===n.selectedSegmentId?"selected":"",w=k.locked?"locked":"";return`
          <li class="rte-translation-segment-item ${x} ${w}" role="option" aria-selected="${k.id===n.selectedSegmentId?"true":"false"}" data-segment-id="${j(k.id)}">
            <button type="button" class="rte-translation-segment-select" data-action="select-segment" data-segment-id="${j(k.id)}" title="${j(k.text)}">
              <span class="rte-translation-segment-meta">#${k.index+1} • ${j(k.tagName)}</span>
              <span class="rte-translation-segment-text">${j(my(k.text,110))}</span>
            </button>
            <button type="button" class="rte-translation-segment-lock" data-action="toggle-lock" data-segment-id="${j(k.id)}" aria-label="${k.locked?r.labels.unlockSegmentAriaLabel:r.labels.lockSegmentAriaLabel}" aria-pressed="${k.locked?"true":"false"}"></button>
          </li>
        `}).join(""));const C=t.querySelector(".rte-translation-source-preview"),T=t.querySelector(".rte-translation-target-preview");if(C||T){const k=n.selectedSegmentId&&n.segments.find(x=>x.id===n.selectedSegmentId)||null;C&&(C.textContent=(k==null?void 0:k.sourceText)||"—",C.setAttribute("aria-label",r.labels.sourcePreviewLabel)),T&&(T.textContent=(k==null?void 0:k.text)||"—",T.setAttribute("aria-label",r.labels.targetPreviewLabel))}t.setAttribute("aria-label",r.labels.panelAriaLabel)}function Fu(e){const t=L.get(e)||be;if(!t)return;ps(e);const r=window.setTimeout(()=>{ai.delete(e),Ue(e,"realtime",!1)},t.debounceMs);ai.set(e,r)}function Ue(e,t,r){const n=L.get(e)||be;if(!n)return[];const o=W(e,n),a=$l(e,o);o.segments=rr(e,n,o);const i=Sy(e,o);if(!r&&o.snapshot===i)return o.issues;o.issues=Ty(o.segments,o,n),o.lastRunAt=new Date().toISOString(),o.snapshot=i,Rt(e),ht(e),e.dispatchEvent(new CustomEvent("editora:translation-workflow-validation",{bubbles:!0,detail:{reason:t,state:ju(e)}}));const l=ae.get(e);if(l){if(a)return ur(l,n.labels.readonlySegmentMessage),o.issues;ur(l,o.issues.length===0?n.labels.noIssuesText:`${o.issues.length} issue${o.issues.length===1?"":"s"} detected.`)}return o.issues}function Vu(e){const t=L.get(e)||be;if(!t)return!1;const r=W(e,t),n=rr(e,t,r);n.forEach(a=>{r.sourceTextBySegmentId.set(a.id,a.text)}),r.snapshot="",Ue(e,"capture-source",!0);const o=ae.get(e);return o&&ur(o,t.labels.sourceCapturedMessage),e.dispatchEvent(new CustomEvent("editora:translation-source-captured",{bubbles:!0,detail:{sourceLocale:r.sourceLocale,segmentCount:n.length}})),!0}function ii(e,t,r){var c,d;const n=L.get(e)||be;if(!n)return!1;const o=W(e,n);o.segments=rr(e,n,o);const a=((c=qu(e))==null?void 0:c.getAttribute("data-translation-segment-id"))||null,i=t||a||o.selectedSegmentId||((d=o.segments[0])==null?void 0:d.id)||null;if(!i)return!1;const l=Ri(e,i);if(!l)return!1;const s=typeof r=="boolean"?r:!o.lockedSegmentIds.has(i);return s?(o.lockedSegmentIds.add(i),o.lockedHtmlBySegmentId.set(i,l.innerHTML)):(o.lockedSegmentIds.delete(i),o.lockedHtmlBySegmentId.delete(i)),Mi(l,s),o.selectedSegmentId=i,o.snapshot="",Ue(e,"lock-segment",!0),e.dispatchEvent(new CustomEvent("editora:translation-segment-lock",{bubbles:!0,detail:{segmentId:i,locked:s}})),!0}function Ku(e,t){const r=L.get(e)||be;if(!r)return!1;const n=W(e,r),o=typeof t=="boolean"?t:!n.realtimeEnabled;return n.realtimeEnabled=o,o?Fu(e):ps(e),Rt(e),ht(e),!0}function Al(e,t,r=!0){const n=L.get(e)||be;if(!n)return!1;const o=W(e,n);return o.segments=rr(e,n,o),o.segments.some(a=>a.id===t)?(o.selectedSegmentId=t,Rt(e),ht(e),r&&$y(e,t),!0):!1}function ba(e,t){const r=L.get(e)||be;if(!r)return!1;const n=W(e,r);if(n.segments=rr(e,r,n),n.segments.length===0)return!1;const o=Math.max(0,n.segments.findIndex(l=>l.id===n.selectedSegmentId));let a=o;t==="start"?a=0:t==="end"?a=n.segments.length-1:a=dr(o+t,0,n.segments.length-1);const i=n.segments[a];return i?Al(e,i.id,!0):!1}function Mo(e,t=!1){const r=ae.get(e);r&&(r.classList.remove("show"),jo.set(e,!1),ht(e),t&&e.focus({preventScroll:!0}))}function Ml(e){const t=Ny(e);ae.forEach((n,o)=>{o!==e&&Mo(o,!1)}),t.classList.add("show"),jo.set(e,!0),Ue(e,"panel-open",!1),Rt(e),Ll(e,t),ht(e);const r=t.querySelector('[data-field="target-locale"]');r==null||r.focus()}function Wu(e,t){const r=bs(e);return(typeof t=="boolean"?t:!r)?Ml(e):Mo(e,!1),!0}function Ly(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="l"}function Ay(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="v"}function My(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="k"}function Ry(e){return e.key.length===1&&!e.metaKey&&!e.ctrlKey&&!e.altKey?!0:e.key==="Backspace"||e.key==="Delete"||e.key==="Enter"}function Tc(e){return e instanceof HTMLElement?e.closest('[data-translation-locked="true"]'):null}function Ny(e){const t=ae.get(e);if(t)return t;const r=L.get(e)||be||Oa();W(e,r);const n=`rte-translation-workflow-panel-${dy++}`,o=`${n}-source`,a=`${n}-target`,i=document.createElement("section");return i.className=A,i.id=n,i.setAttribute("role","dialog"),i.setAttribute("aria-modal","false"),i.setAttribute("aria-label",r.labels.panelAriaLabel),i.innerHTML=`
    <header class="rte-translation-header">
      <h2 class="rte-translation-title">${j(r.labels.panelTitle)}</h2>
      <button type="button" class="rte-translation-icon-btn" data-action="close" aria-label="${j(r.labels.closeText)}">✕</button>
    </header>
    <div class="rte-translation-body">
      <div class="rte-translation-locales">
        <div class="rte-translation-locale-field">
          <label class="rte-translation-source-label" for="${j(o)}"></label>
          <select id="${j(o)}" class="rte-translation-select" data-field="source-locale"></select>
        </div>
        <div class="rte-translation-locale-field">
          <label class="rte-translation-target-label" for="${j(a)}"></label>
          <select id="${j(a)}" class="rte-translation-select" data-field="target-locale"></select>
        </div>
      </div>
      <p class="rte-translation-summary"></p>
      <div class="rte-translation-actions">
        <button type="button" class="rte-translation-btn rte-translation-btn-primary" data-action="run-validation"></button>
        <button type="button" class="rte-translation-btn" data-action="capture-source"></button>
        <button type="button" class="rte-translation-btn" data-action="lock-selected"></button>
        <button type="button" class="rte-translation-btn" data-action="toggle-realtime" aria-pressed="false"></button>
      </div>
      <p class="rte-translation-helper"></p>
      <p class="rte-translation-shortcut"></p>
      <div class="rte-translation-grid">
        <section class="rte-translation-segments-wrap" aria-label="${j(r.labels.segmentsLabel)}">
          <h3 class="rte-translation-subtitle">${j(r.labels.segmentsLabel)}</h3>
          <ul class="rte-translation-segments" role="listbox" tabindex="0" aria-label="${j(r.labels.segmentsLabel)}"></ul>
        </section>
        <section class="rte-translation-preview-wrap">
          <h3 class="rte-translation-subtitle">${j(r.labels.sourcePreviewLabel)} / ${j(r.labels.targetPreviewLabel)}</h3>
          <div class="rte-translation-preview-block">
            <p class="rte-translation-preview-label">${j(r.labels.sourcePreviewLabel)}</p>
            <p class="rte-translation-source-preview"></p>
          </div>
          <div class="rte-translation-preview-block">
            <p class="rte-translation-preview-label">${j(r.labels.targetPreviewLabel)}</p>
            <p class="rte-translation-target-preview"></p>
          </div>
        </section>
      </div>
      <section class="rte-translation-issues-wrap">
        <h3 class="rte-translation-subtitle">${j(r.labels.issuesLabel)}</h3>
        <ul class="rte-translation-issues" role="list" aria-label="${j(r.labels.issuesLabel)}"></ul>
        <p class="rte-translation-empty" hidden></p>
      </section>
    </div>
    <div class="rte-translation-live" aria-live="polite" aria-atomic="true"></div>
  `,i.addEventListener("click",l=>{const s=l.target;if(!s)return;const c=s.closest("[data-action]");if(!c){const u=s.closest(".rte-translation-issue[data-segment-id]"),f=(u==null?void 0:u.getAttribute("data-segment-id"))||"";f&&Al(e,f,!0);return}const d=c.getAttribute("data-action");if(d==="close"){Mo(e,!0);return}if(d==="run-validation"){Ue(e,"panel-button",!0);return}if(d==="capture-source"){Vu(e);return}if(d==="lock-selected"){ii(e);return}if(d==="toggle-realtime"){Ku(e);return}if(d==="select-segment"){const u=c.getAttribute("data-segment-id")||"";u&&Al(e,u,!0);return}if(d==="toggle-lock"){const u=c.getAttribute("data-segment-id")||"";u&&ii(e,u)}}),i.addEventListener("change",l=>{const s=l.target;if(!(s instanceof HTMLSelectElement))return;const c=L.get(e)||be;if(!c)return;const d=W(e,c);if(s.getAttribute("data-field")==="source-locale"){d.sourceLocale=At(s.value),d.snapshot="",Ue(e,"source-locale-change",!0);return}s.getAttribute("data-field")==="target-locale"&&(d.targetLocale=At(s.value),d.snapshot="",Ue(e,"target-locale-change",!0))}),i.addEventListener("keydown",l=>{const s=l.target;if(l.key==="Escape"){l.preventDefault(),Mo(e,!0);return}!(s!=null&&s.closest(".rte-translation-segments"))||!zu.has(l.key)||(l.preventDefault(),l.key==="ArrowUp"?ba(e,-1):l.key==="ArrowDown"?ba(e,1):l.key==="Home"?ba(e,"start"):l.key==="End"&&ba(e,"end"))}),Tl(i,e),document.body.appendChild(i),ae.set(e,i),jo.set(e,!1),Rt(e),i}function Dy(e){be=e,mn||(mn=t=>{var s;za();const r=t.target,n=r==null?void 0:r.closest(Ae);if(!n)return;const o=L.get(n)||e,a=W(n,o);L.set(n,o),ye=n;const i=((s=qu(n))==null?void 0:s.getAttribute("data-translation-segment-id"))||null;i&&(a.selectedSegmentId=i),ht(n);const l=ae.get(n);l&&(Tl(l,n),Ll(n,l),Rt(n))},document.addEventListener("focusin",mn,!0)),pn||(pn=t=>{const r=t.target,n=r==null?void 0:r.closest(Ae);if(!n)return;const o=L.get(n)||be;if(!o)return;const a=W(n,o),i=$l(n,a);if(a.segments=rr(n,o,a),!a.realtimeEnabled){if(i){const l=ae.get(n);l&&ur(l,o.labels.readonlySegmentMessage)}Rt(n),ht(n);return}Fu(n)},document.addEventListener("input",pn,!0)),gn||(gn=t=>{const r=t,n=r.target,o=n==null?void 0:n.closest(Ae);if(!o)return;const a=Tc(n);if(!a||!o.contains(a))return;r.preventDefault();const i=ae.get(o),l=L.get(o)||be;i&&l&&ur(i,l.labels.readonlySegmentMessage)},document.addEventListener("beforeinput",gn,!0)),bn||(bn=t=>{if(t.defaultPrevented)return;const r=t.target;if((r==null?void 0:r.closest(`.${A}`))&&t.key!=="Escape"&&!zu.has(t.key))return;const o=t.key==="Escape",a=Ly(t),i=Ay(t),l=My(t),s=Tc(r);if(!o&&!a&&!i&&!l&&!s)return;const c=ky(t);if(!c)return;const d=L.get(c)||be||e;if(W(c,d),L.set(c,d),ye=c,o&&bs(c)){t.preventDefault(),Mo(c,!0);return}if(s&&c.contains(s)&&Ry(t)){t.preventDefault();const u=ae.get(c);u&&ur(u,d.labels.readonlySegmentMessage);return}if(a){t.preventDefault(),t.stopPropagation(),Wu(c);return}if(i){t.preventDefault(),t.stopPropagation(),Ue(c,"shortcut",!0);return}l&&(t.preventDefault(),t.stopPropagation(),ii(c))},document.addEventListener("keydown",bn,!0)),Ut||(Ut=()=>{za(),ae.forEach((t,r)=>{!r.isConnected||!t.isConnected||(Tl(t,r),Ll(r,t))})},window.addEventListener("scroll",Ut,!0),window.addEventListener("resize",Ut)),!hn&&typeof MutationObserver<"u"&&document.body&&(hn=new MutationObserver(t=>{vy(t)&&za(),t.some(n=>n.type==="characterData"?!0:n.type==="childList"&&(n.addedNodes.length>0||n.removedNodes.length>0))&&Fo.forEach(n=>{const o=Er.get(n);if(!o||o.lockedSegmentIds.size===0||!$l(n,o))return;o.snapshot="";const i=L.get(n)||be,l=ae.get(n);l&&i&&ur(l,i.labels.readonlySegmentMessage),i&&(o.segments=rr(n,i,o),Rt(n),ht(n))})}),hn.observe(document.body,{childList:!0,subtree:!0,characterData:!0}))}function Hy(){mn&&(document.removeEventListener("focusin",mn,!0),mn=null),pn&&(document.removeEventListener("input",pn,!0),pn=null),gn&&(document.removeEventListener("beforeinput",gn,!0),gn=null),bn&&(document.removeEventListener("keydown",bn,!0),bn=null),Ut&&(window.removeEventListener("scroll",Ut,!0),window.removeEventListener("resize",Ut),Ut=null),hn&&(hn.disconnect(),hn=null),ae.forEach(t=>t.remove()),ae.clear(),Array.from(Fo).forEach(t=>gs(t)),be=null,ye=null}function Iy(){if(typeof document>"u"||document.getElementById(kc))return;const e=document.createElement("style");e.id=kc,e.textContent=`
    .rte-toolbar-group-items.${qe},
    .editora-toolbar-group-items.${qe},
    .rte-toolbar-group-items.${dt},
    .editora-toolbar-group-items.${dt} {
      display: flex;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: #ffffff;
    }

    .rte-toolbar-group-items.${qe} .rte-toolbar-button,
    .editora-toolbar-group-items.${qe} .editora-toolbar-button,
    .rte-toolbar-group-items.${dt} .rte-toolbar-button,
    .editora-toolbar-group-items.${dt} .editora-toolbar-button {
      border: none;
      border-right: 1px solid #cbd5e1;
      border-radius: 0;
    }

    .rte-toolbar-group-items.${qe} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${qe} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${dt} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${dt} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    ${ue} .rte-toolbar-group-items.${qe},
    ${ue} .editora-toolbar-group-items.${qe},
    ${ue} .rte-toolbar-group-items.${dt},
    ${ue} .editora-toolbar-group-items.${dt} {
      border-color: #566275;
    }
    .rte-toolbar-button[data-command="toggleTranslationWorkflowPanel"].active,
    .editora-toolbar-button[data-command="toggleTranslationWorkflowPanel"].active,
    .rte-toolbar-button[data-command="toggleTranslationSegmentLock"].active,
    .editora-toolbar-button[data-command="toggleTranslationSegmentLock"].active, 
    .rte-toolbar-button[data-command="toggleTranslationRealtime"].active,
    .editora-toolbar-button[data-command="toggleTranslationRealtime"].active {
      background: #ccc;
    }
    ${ue} .rte-toolbar-group-items.${qe} .rte-toolbar-button svg,
    ${ue} .editora-toolbar-group-items.${qe} .editora-toolbar-button svg,
    ${ue} .rte-toolbar-group-items.${dt} .rte-toolbar-button svg,
    ${ue} .editora-toolbar-group-items.${dt} .editora-toolbar-button svg
    {
      fill: none;
    }
    ${ue} .rte-toolbar-group-items.${qe} .rte-toolbar-button,
    ${ue} .editora-toolbar-group-items.${qe} .editora-toolbar-button
    {
      border-color: #566275;
    }

    ${ue} .rte-toolbar-button[data-command="toggleTranslationWorkflowPanel"].active,
    ${ue} .editora-toolbar-button[data-command="toggleTranslationWorkflowPanel"].active,
    ${ue} .rte-toolbar-button[data-command="toggleTranslationSegmentLock"].active,
    ${ue} .editora-toolbar-button[data-command="toggleTranslationSegmentLock"].active, 
    ${ue} .rte-toolbar-button[data-command="toggleTranslationRealtime"].active,
    ${ue} .editora-toolbar-button[data-command="toggleTranslationRealtime"].active {
      background: linear-gradient(180deg, #5eaaf6 0%, #4a95de 100%);
    }

    .${A} {
      position: fixed;
      z-index: 12000;
      display: none;
      width: min(520px, calc(100vw - 20px));
      max-height: calc(100vh - 20px);
      border: 1px solid #d1d5db;
      border-radius: 14px;
      background: #ffffff;
      color: #0f172a;
      box-shadow: 0 24px 48px rgba(15, 23, 42, 0.24);
      overflow: hidden;
    }

    .${A}.show {
      display: flex;
      flex-direction: column;
    }

    .${A}.rte-translation-workflow-theme-dark {
      border-color: #334155;
      background: #0f172a;
      color: #e2e8f0;
      box-shadow: 0 24px 52px rgba(2, 6, 23, 0.68);
    }

    .rte-translation-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid #e2e8f0;
      background: linear-gradient(180deg, #eff6ff 0%, #e2e8f0 100%);
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-header {
      border-color: #1e293b;
      background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
    }

    .rte-translation-title {
      margin: 0;
      font-size: 15px;
      line-height: 1.2;
      font-weight: 700;
    }

    .rte-translation-icon-btn {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      min-height: 34px;
      width: 34px;
      background: #ffffff;
      color: #0f172a;
      font-size: 16px;
      line-height: 1;
      font-weight: 600;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .rte-translation-icon-btn:hover,
    .rte-translation-icon-btn:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-icon-btn {
      border-color: #475569;
      background: #0f172a;
      color: #e2e8f0;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-icon-btn:hover,
    .${A}.rte-translation-workflow-theme-dark .rte-translation-icon-btn:focus-visible {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.24);
    }

    .rte-translation-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      overflow: auto;
    }

    .rte-translation-locales {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .rte-translation-locale-field {
      display: grid;
      gap: 4px;
    }

    .rte-translation-source-label,
    .rte-translation-target-label {
      font-size: 12px;
      font-weight: 700;
      color: #334155;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-source-label,
    .${A}.rte-translation-workflow-theme-dark .rte-translation-target-label {
      color: #cbd5e1;
    }

    .rte-translation-select {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 34px;
      padding: 0 10px;
      font-size: 13px;
      background: #ffffff;
      color: inherit;
    }

    .rte-translation-select:focus-visible {
      border-color: #0e7490;
      box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.18);
      outline: none;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-select {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .rte-translation-summary,
    .rte-translation-helper,
    .rte-translation-shortcut {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #475569;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-summary,
    .${A}.rte-translation-workflow-theme-dark .rte-translation-helper,
    .${A}.rte-translation-workflow-theme-dark .rte-translation-shortcut {
      color: #94a3b8;
    }

    .rte-translation-actions {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
    }

    .rte-translation-btn {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 34px;
      padding: 0 8px;
      background: #ffffff;
      color: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .rte-translation-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .rte-translation-btn-primary {
      border-color: #0e7490;
      background: #0e7490;
      color: #f8fafc;
    }

    .rte-translation-btn:hover,
    .rte-translation-btn:focus-visible {
      border-color: #94a3b8;
      outline: none;
    }

    .rte-translation-btn-primary:hover,
    .rte-translation-btn-primary:focus-visible {
      border-color: #155e75;
      background: #155e75;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-btn-primary {
      border-color: #22d3ee;
      background: #0e7490;
      color: #ecfeff;
    }

    .rte-translation-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .rte-translation-segments-wrap,
    .rte-translation-preview-wrap,
    .rte-translation-issues-wrap {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      background: #f8fafc;
      padding: 8px;
      min-height: 120px;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-segments-wrap,
    .${A}.rte-translation-workflow-theme-dark .rte-translation-preview-wrap,
    .${A}.rte-translation-workflow-theme-dark .rte-translation-issues-wrap {
      border-color: #334155;
      background: #0b1220;
    }

    .rte-translation-subtitle {
      margin: 0 0 6px;
      font-size: 12px;
      font-weight: 700;
      color: #334155;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-subtitle {
      color: #cbd5e1;
    }

    .rte-translation-segments {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 6px;
      max-height: 220px;
      overflow: auto;
      outline: none;
    }

    .rte-translation-segment-item {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 6px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      padding: 6px;
    }

    .rte-translation-segment-item.selected {
      border-color: #0e7490;
      box-shadow: 0 0 0 2px rgba(14, 116, 144, 0.16);
    }

    .rte-translation-segment-item.locked {
      border-color: #f59e0b;
      background: #fffbeb;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-segment-item {
      border-color: #334155;
      background: #111827;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-segment-item.locked {
      border-color: rgba(245, 158, 11, 0.72);
      background: rgba(120, 53, 15, 0.28);
    }

    .rte-translation-segment-select {
      border: none;
      background: transparent;
      color: inherit;
      text-align: left;
      padding: 0;
      cursor: pointer;
      display: grid;
      gap: 2px;
    }

    .rte-translation-segment-meta {
      font-size: 11px;
      color: #64748b;
      font-weight: 700;
    }

    .rte-translation-segment-text {
      font-size: 12px;
      color: #334155;
      line-height: 1.3;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-segment-meta {
      color: #94a3b8;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-segment-text {
      color: #e2e8f0;
    }

    .rte-translation-segment-lock {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      width: 28px;
      min-height: 28px;
      background: #ffffff;
      cursor: pointer;
      position: relative;
      color: inherit;
      font-size: 0;
    }

    .rte-translation-segment-lock::before {
      content: '🔒';
      font-size: 14px;
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      opacity: 0.35;
    }

    .rte-translation-segment-lock[aria-pressed="true"]::before {
      opacity: 1;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-segment-lock {
      border-color: #334155;
      background: #111827;
    }

    .rte-translation-preview-block {
      display: grid;
      gap: 4px;
      margin-bottom: 8px;
    }

    .rte-translation-preview-label {
      margin: 0;
      font-size: 11px;
      color: #64748b;
      font-weight: 700;
    }

    .rte-translation-source-preview,
    .rte-translation-target-preview {
      margin: 0;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      padding: 8px;
      font-size: 12px;
      min-height: 56px;
      white-space: pre-wrap;
      line-height: 1.35;
      color: #1f2937;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-preview-label {
      color: #94a3b8;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-source-preview,
    .${A}.rte-translation-workflow-theme-dark .rte-translation-target-preview {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .rte-translation-issues {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 6px;
      max-height: 200px;
      overflow: auto;
    }

    .rte-translation-issue {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      padding: 8px;
      display: grid;
      gap: 4px;
      cursor: pointer;
    }

    .rte-translation-issue.error {
      border-color: #ef4444;
      background: #fef2f2;
    }

    .rte-translation-issue.warning {
      border-color: #f59e0b;
      background: #fffbeb;
    }

    .rte-translation-issue.info {
      border-color: #0ea5e9;
      background: #f0f9ff;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-issue {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-issue.error {
      border-color: rgba(239, 68, 68, 0.7);
      background: rgba(127, 29, 29, 0.28);
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-issue.warning {
      border-color: rgba(245, 158, 11, 0.72);
      background: rgba(120, 53, 15, 0.28);
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-issue.info {
      border-color: rgba(14, 165, 233, 0.7);
      background: rgba(7, 89, 133, 0.28);
    }

    .rte-translation-issue-message,
    .rte-translation-issue-suggestion {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #1f2937;
    }

    .rte-translation-issue-suggestion {
      color: #475569;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-issue-message {
      color: #e2e8f0;
    }

    .${A}.rte-translation-workflow-theme-dark .rte-translation-issue-suggestion {
      color: #cbd5e1;
    }

    .rte-translation-empty {
      margin: 8px;
      font-size: 12px;
      color: #64748b;
    }

    .rte-translation-live {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      border: 0;
    }

    [data-translation-locked="true"].rte-translation-segment-locked {
      outline: 2px dashed rgba(245, 158, 11, 0.65);
      outline-offset: 2px;
      background: rgba(255, 251, 235, 0.8);
      border-radius: 4px;
    }

    ${ue} [data-translation-locked="true"].rte-translation-segment-locked {
      outline-color: rgba(245, 158, 11, 0.75);
      background: rgba(120, 53, 15, 0.22);
    }

    @media (max-width: 920px) {
      .${A} {
        left: 10px !important;
        right: 10px;
        top: 10px !important;
        width: auto !important;
        max-height: calc(100vh - 20px);
      }

      .rte-translation-locales,
      .rte-translation-actions,
      .rte-translation-grid {
        grid-template-columns: 1fr;
      }
    }
  `,document.head.appendChild(e)}const By=(e={})=>{const t=Oa(e),r=new Set;return Iy(),{name:"translationWorkflow",toolbar:[{id:"translationWorkflowGroup",label:"Translation Workflow",type:"group",command:"translationWorkflow",items:[{id:"toggleTranslationWorkflowPanel",label:"Translation Workflow",command:"toggleTranslationWorkflowPanel",shortcut:"Mod-Alt-Shift-l",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4 6.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H8l-4 3V6.5Z" stroke="currentColor" stroke-width="1.6"/><path d="M20 17.5a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-1.5" stroke="currentColor" stroke-width="1.6"/><path d="m13 8 2 2m0 0 2-2m-2 2V4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'},{id:"runTranslationLocaleValidation",label:"Run Locale Validation",command:"runTranslationLocaleValidation",shortcut:"Mod-Alt-Shift-v",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="4.5" y="4" width="12" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 8h5.5M8 11h4M8 14h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="m15.5 15.5 1.7 1.7 3.3-3.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'},{id:"toggleTranslationSegmentLock",label:"Toggle Segment Lock",command:"toggleTranslationSegmentLock",shortcut:"Mod-Alt-Shift-k",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8.5 10V7.5a3.5 3.5 0 1 1 7 0V10" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="15" r="1.2" fill="currentColor"/></svg>'},{id:"toggleTranslationRealtime",label:"Toggle Translation Realtime",command:"toggleTranslationRealtime",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 1 7.5 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9.5 19.5H5.5v-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8v4l2.5 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'}]}],commands:{translationWorkflow:(n,o)=>{const a=Ye(o,!1,!1);if(!a)return!1;const i=L.get(a)||t;return W(a,i),L.set(a,i),ye=a,Ml(a),!0},openTranslationWorkflowPanel:(n,o)=>{const a=Ye(o,!1,!1);if(!a)return!1;const i=L.get(a)||t;return W(a,i),L.set(a,i),ye=a,Ml(a),!0},toggleTranslationWorkflowPanel:(n,o)=>{const a=Ye(o,!1,!1);if(!a)return!1;const i=L.get(a)||t;return W(a,i),L.set(a,i),ye=a,Wu(a,typeof n=="boolean"?n:void 0)},runTranslationLocaleValidation:(n,o)=>{const a=Ye(o,!1,!1);if(!a)return!1;const i=L.get(a)||t;return W(a,i),L.set(a,i),ye=a,Ue(a,"command",!0),!0},toggleTranslationRealtime:(n,o)=>{const a=Ye(o,!1,!1);if(!a)return!1;const i=L.get(a)||t;return W(a,i),L.set(a,i),ye=a,Ku(a,typeof n=="boolean"?n:void 0)},toggleTranslationSegmentLock:(n,o)=>{const a=Ye(o,!1,!1);if(!a)return!1;const i=L.get(a)||t;W(a,i),L.set(a,i),ye=a;const l=typeof n=="boolean"?n:n==null?void 0:n.locked,s=typeof n=="object"?n==null?void 0:n.segmentId:void 0;return ii(a,s,l)},setTranslationLocales:(n,o)=>{const a=Ye(o,!1,!1);if(!a||!n||typeof n!="object")return!1;const i=L.get(a)||t,l=W(a,i);return L.set(a,i),typeof n.sourceLocale=="string"&&n.sourceLocale.trim()&&(l.sourceLocale=At(n.sourceLocale)),typeof n.targetLocale=="string"&&n.targetLocale.trim()&&(l.targetLocale=At(n.targetLocale)),l.snapshot="",Ue(a,"set-locales",!0),!0},captureTranslationSourceSnapshot:(n,o)=>{const a=Ye(o,!1,!1);if(!a)return!1;const i=L.get(a)||t;return W(a,i),L.set(a,i),ye=a,Vu(a)},setTranslationWorkflowOptions:(n,o)=>{const a=Ye(o,!1,!1);if(!a||!n||typeof n!="object")return!1;const i=L.get(a)||t,l=Pa.get(a)||by(i),s={...l,...n,labels:{...l.labels||{},...n.labels||{}},localeRules:Array.isArray(n.localeRules)?n.localeRules:l.localeRules,locales:Array.isArray(n.locales)?n.locales:l.locales,normalizeText:n.normalizeText||i.normalizeText},c=Oa(s);L.set(a,c),Pa.set(a,s);const d=W(a,c);return typeof n.enableRealtime=="boolean"&&(d.realtimeEnabled=n.enableRealtime),typeof n.sourceLocale=="string"&&n.sourceLocale.trim()&&(d.sourceLocale=At(n.sourceLocale)),typeof n.targetLocale=="string"&&n.targetLocale.trim()&&(d.targetLocale=At(n.targetLocale)),d.snapshot="",Ue(a,"set-options",!0),Rt(a),ht(a),!0},getTranslationWorkflowState:(n,o)=>{const a=Ye(o,!1,!1);if(!a)return!1;const i=L.get(a)||t;W(a,i);const l=ju(a);if(typeof n=="function")try{n(l)}catch{}return a.__translationWorkflowState=l,a.dispatchEvent(new CustomEvent("editora:translation-workflow-state",{bubbles:!0,detail:l})),!0}},keymap:{"Mod-Alt-Shift-l":"toggleTranslationWorkflowPanel","Mod-Alt-Shift-L":"toggleTranslationWorkflowPanel","Mod-Alt-Shift-v":"runTranslationLocaleValidation","Mod-Alt-Shift-V":"runTranslationLocaleValidation","Mod-Alt-Shift-k":"toggleTranslationSegmentLock","Mod-Alt-Shift-K":"toggleTranslationSegmentLock"},init:function(o){ma+=1;const a=this&&typeof this.__pluginConfig=="object"?{...e,...this.__pluginConfig}:e,i=Oa(a);Dy(i);const l=Ye(o!=null&&o.editorElement?{editorElement:o.editorElement}:void 0,!1,!1);if(!l)return;ye=l,r.add(l);const s=W(l,i);L.set(l,i),Pa.set(l,a),s.segments=rr(l,i,s),Ue(l,"init",!0),ht(l)},destroy:()=>{r.forEach(n=>gs(n)),r.clear(),ma=Math.max(0,ma-1),!(ma>0)&&Hy()}}};function Py(e,t){const r=Array.from({length:t}).map(()=>"<th><p><br></p></th>").join(""),n=Array.from({length:e}).map(()=>`<tr>${Array.from({length:t}).map(()=>"<td><p><br></p></td>").join("")}</tr>`).join("");return`<table class="rte-table"><thead><tr>${r}</tr></thead><tbody>${n}</tbody></table><p><br></p>`}function Oy(){return[{id:"paragraph",label:"Paragraph",description:"Switch to paragraph text",command:"paragraph",keywords:["text","normal","p"]},{id:"h1",label:"Heading 1",description:"Large section heading",command:"heading1",keywords:["title","header","h1"]},{id:"h2",label:"Heading 2",description:"Medium section heading",command:"heading2",keywords:["subtitle","header","h2"]},{id:"h3",label:"Heading 3",description:"Small section heading",command:"heading3",keywords:["header","h3"]},{id:"bulleted-list",label:"Bulleted List",description:"Create a bullet list",command:"toggleBulletList",keywords:["list","ul","bullet"]},{id:"numbered-list",label:"Numbered List",description:"Create a numbered list",command:"toggleOrderedList",keywords:["list","ol","numbered"]},{id:"blockquote",label:"Blockquote",description:"Insert a quote block",command:"toggleBlockquote",keywords:["quote","citation"]},{id:"table-3x3",label:"Table 3x3",description:"Insert a 3 x 3 table",action:({insertHTML:e})=>e(Py(3,3)),keywords:["table","grid","rows","columns"]},{id:"horizontal-rule",label:"Divider",description:"Insert a horizontal rule",command:"insertHorizontalRule",keywords:["hr","separator","line"]},{id:"bold",label:"Bold",description:"Toggle bold formatting",command:"toggleBold",keywords:["strong","b"]},{id:"italic",label:"Italic",description:"Toggle italic formatting",command:"toggleItalic",keywords:["emphasis","i"]},{id:"underline",label:"Underline",description:"Toggle underline formatting",command:"toggleUnderline",keywords:["u"]},{id:"strikethrough",label:"Strikethrough",description:"Toggle strikethrough formatting",command:"toggleStrikethrough",keywords:["strike","s"]},{id:"clear-formatting",label:"Clear Formatting",description:"Remove text formatting",command:"clearFormatting",keywords:["reset","plain"]}]}function zy(e){const t=[],r=new Set;return e.forEach(n=>{const o=String(n.id||"").trim(),a=String(n.label||"").trim();!o||!a||r.has(o)||(r.add(o),t.push({...n,id:o,label:a,description:n.description?String(n.description):void 0,keywords:Array.isArray(n.keywords)?n.keywords.map(i=>String(i)).filter(Boolean):void 0}))}),t}function _y(e){const t=(e.triggerChar||"/")[0]||"/",r=e.includeDefaultItems!==!1,n=r?[...e.items||[],...Oy()]:e.items||[];return{triggerChar:t,minChars:Math.max(0,e.minChars??0),maxQueryLength:Math.max(1,e.maxQueryLength??48),maxSuggestions:Math.max(1,e.maxSuggestions??10),requireBoundary:e.requireBoundary!==!1,includeDefaultItems:r,items:zy(n),itemRenderer:e.itemRenderer||(o=>o.label),emptyStateText:e.emptyStateText||"No commands found",panelLabel:e.panelLabel||"Slash commands"}}const $r='[data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark';let $c=!1;function qy(){if($c||typeof document>"u")return;$c=!0;const e=document.createElement("style");e.id="rte-slash-commands-styles",e.textContent=`
    .rte-slash-panel {
      width: min(225px, calc(100vw - 16px));
      max-height: min(360px, calc(100vh - 24px));
      overflow: hidden;
      border: 1px solid #d9dfeb;
      border-radius: 0px;
      background: #ffffff;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.2);
      z-index: 2147483646;
    }

    .rte-slash-list {
      max-height: min(340px, calc(100vh - 32px));
      overflow: auto;
      padding: 0px;
      display: grid;
      gap: 1px;
    }

    .rte-slash-item {
      width: 100%;
      border: none;
      background: transparent;
      color: #0f172a;
      border-radius: 0px;
      padding: 6px 9px;
      text-align: left;
      display: grid;
      gap: 0px;
      cursor: pointer;
      font: inherit;
    }

    .rte-slash-item:hover,
    .rte-slash-item.active {
      background: #eff6ff;
      color: #1d4ed8;
    }

    .rte-slash-item-title {
      font-size: 13px;
      font-weight: 600;
      line-height: 1.35;
    }

    .rte-slash-item-description {
      font-size: 12px;
      color: #64748b;
      line-height: 1.35;
    }

    .rte-slash-item mark {
      background: rgba(59, 130, 246, 0.16);
      color: inherit;
      padding: 0 2px;
      border-radius: 3px;
    }

    .rte-slash-empty {
      font-size: 13px;
      color: #64748b;
      text-align: center;
      padding: 12px;
    }

    ${$r} .rte-slash-panel {
      border-color: #364152;
      background: #1f2937;
      box-shadow: 0 22px 44px rgba(0, 0, 0, 0.48);
    }

    ${$r} .rte-slash-item {
      color: #e5e7eb;
    }

    ${$r} .rte-slash-item:hover,
    ${$r} .rte-slash-item.active {
      background: #334155;
      color: #bfdbfe;
    }

    ${$r} .rte-slash-item-description,
    ${$r} .rte-slash-empty {
      color: #9ca3af;
    }
  `,document.head.appendChild(e)}const wt=".rte-content, .editora-content",Ro=new WeakMap,li=new WeakMap;let si=!1,io=null,ha=0,jy=0;function Fy(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function Uu(e){return e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||e}function Vy(e){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const n=e.editorElement;if(n.matches(wt))return n;const o=n.querySelector(wt);if(o instanceof HTMLElement)return o}const t=window.getSelection();if(t&&t.rangeCount>0){const n=t.getRangeAt(0).startContainer,o=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement,a=o==null?void 0:o.closest(wt);if(a)return a}const r=document.activeElement;if(r){if(r.matches(wt))return r;const n=r.closest(wt);if(n)return n}return document.querySelector(wt)}function qn(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ky(e){return e?/\s|[([{"'`]/.test(e):!0}function hs(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);return e.contains(r.commonAncestorContainer)?r.cloneRange():null}function Ni(e,t){const r=window.getSelection();r&&(r.removeAllRanges(),r.addRange(t),e.focus({preventScroll:!0}))}function Wy(e){if(!e.collapsed)return null;const t=e.startContainer,r=e.startOffset;if(t.nodeType===Node.TEXT_NODE){const n=t;return{node:n,textBefore:n.data.slice(0,r),caretOffset:r}}if(t.nodeType===Node.ELEMENT_NODE){const n=t;if(r>0){const o=n.childNodes[r-1];if(o&&o.nodeType===Node.TEXT_NODE){const a=o;return{node:a,textBefore:a.data,caretOffset:a.length}}}}return null}function Uy(e,t,r,n){const o=e.lastIndexOf(t);if(o<0||n&&!Ky(e[o-1]))return null;const a=e.slice(o+1);return/\s/.test(a)||a.length>r?null:{trigger:t,query:a,startOffset:o}}function Gy(e,t){const r=t.cloneRange();r.collapse(!1);const n=r.getClientRects();if(n.length>0)return n[n.length-1];const o=document.createElement("span");o.textContent="​",r.insertNode(o);const a=o.getBoundingClientRect();return o.remove(),e.normalize(),a}function Gu(e,t){if(!e.panel)return;const r=Gy(e.editor,t),n=e.panel;n.style.display="block",n.classList.add("show"),n.style.left="0px",n.style.top="0px";const o=n.getBoundingClientRect(),a=window.innerWidth,i=window.innerHeight;let l=Math.max(8,Math.min(r.left,a-o.width-8)),s=r.bottom+8;s+o.height>i-8&&(s=Math.max(8,r.top-o.height-8)),n.style.position="fixed",n.style.left=`${l}px`,n.style.top=`${s}px`}function Lc(e,t){if(!t)return qn(e);const r=e.toLowerCase(),n=t.toLowerCase(),o=r.indexOf(n);if(o<0)return qn(e);const a=qn(e.slice(0,o)),i=qn(e.slice(o,o+t.length)),l=qn(e.slice(o+t.length));return`${a}<mark>${i}</mark>${l}`}function Zy(e,t){if(e.panel&&e.list)return;const r=document.createElement("div");r.className="rte-slash-panel",r.style.display="none",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","false");const n=document.createElement("div");n.className="rte-slash-list",n.setAttribute("role","listbox"),n.setAttribute("aria-label",t.panelLabel),r.appendChild(n),document.body.appendChild(r),e.panel=r,e.list=n,r.addEventListener("mousedown",o=>{o.preventDefault()}),r.addEventListener("click",o=>{const a=o.target;if(!a)return;const i=a.closest(".rte-slash-item");if(!i)return;const l=Number(i.getAttribute("data-index"));Number.isFinite(l)&&Zu(e,l)})}function $e(e){e.panel&&(e.panel.style.display="none",e.panel.classList.remove("show"),e.isOpen=!1,e.filteredItems=[],e.activeIndex=0,e.query="",e.replaceRange=null,e.anchorRange=null)}function Yy(e,t,r){if(!t)return e.slice(0,r);const n=t.toLowerCase();return e.filter(a=>[a.id,a.label,a.description||"",a.command||"",...a.keywords||[]].join(" ").toLowerCase().includes(n)).slice(0,r)}function Xy(e,t){if(!e.list)return;const r=e.list;if(r.innerHTML="",e.filteredItems.length===0){const n=document.createElement("div");n.className="rte-slash-empty",n.textContent=t.emptyStateText,r.appendChild(n),r.removeAttribute("aria-activedescendant");return}e.filteredItems.forEach((n,o)=>{const a=document.createElement("button");a.type="button",a.className="rte-slash-item",a.setAttribute("role","option"),a.setAttribute("data-index",String(o)),a.setAttribute("id",`rte-slash-item-${e.instanceId}-${o}`),a.setAttribute("aria-selected",o===e.activeIndex?"true":"false"),a.setAttribute("aria-label",n.description?`${n.label} - ${n.description}`:n.label),o===e.activeIndex&&a.classList.add("active"),t.itemRenderer?a.innerHTML=t.itemRenderer(n,e.query):a.innerHTML=`
        <span class="rte-slash-item-title">${Lc(n.label,e.query)}</span>
        ${n.description?`<span class="rte-slash-item-description">${Lc(n.description,e.query)}</span>`:""}
      `,r.appendChild(a)}),e.filteredItems.length>0&&r.setAttribute("aria-activedescendant",`rte-slash-item-${e.instanceId}-${e.activeIndex}`)}function Jy(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function Qy(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function Ac(e,t){e.focus({preventScroll:!0});try{if(document.execCommand("insertHTML",!1,t))return!0}catch{}const r=window.getSelection();if(!r||r.rangeCount===0)return!1;const n=r.getRangeAt(0);if(!e.contains(n.commonAncestorContainer))return!1;n.deleteContents();const o=document.createElement("template");o.innerHTML=t;const a=o.content,i=a.lastChild;if(n.insertNode(a),i){const l=document.createRange();l.setStartAfter(i),l.collapse(!0),Ni(e,l)}return!0}function e1(e,t){e.focus({preventScroll:!0});try{if(document.execCommand("insertText",!1,t))return!0}catch{}const r=window.getSelection();if(!r||r.rangeCount===0)return!1;const n=r.getRangeAt(0);if(!e.contains(n.commonAncestorContainer))return!1;n.deleteContents();const o=document.createTextNode(t);n.insertNode(o);const a=document.createRange();return a.setStart(o,o.length),a.collapse(!0),Ni(e,a),!0}function t1(e,t){switch(e.toLowerCase()){case"paragraph":case"p":return document.execCommand("formatBlock",!1,"<p>");case"heading1":case"h1":return document.execCommand("formatBlock",!1,"<h1>");case"heading2":case"h2":return document.execCommand("formatBlock",!1,"<h2>");case"heading3":case"h3":return document.execCommand("formatBlock",!1,"<h3>");case"blockquote":case"toggleblockquote":return document.execCommand("formatBlock",!1,"<blockquote>");case"bulletlist":case"togglebulletlist":case"insertunorderedlist":return document.execCommand("insertUnorderedList");case"numberedlist":case"toggleorderedlist":case"insertorderedlist":return document.execCommand("insertOrderedList");case"horizontalrule":case"divider":case"inserthorizontalrule":return document.execCommand("insertHorizontalRule");case"bold":case"togglebold":return document.execCommand("bold");case"italic":case"toggleitalic":return document.execCommand("italic");case"underline":case"toggleunderline":return document.execCommand("underline");case"strikethrough":case"togglestrikethrough":return document.execCommand("strikeThrough");case"clearformatting":case"removeformat":return document.execCommand("removeFormat");default:try{return document.execCommand(e,!1,t)}catch{return!1}}}function Mc(e,t,r){const n=Uu(e);if(n&&typeof n.execCommand=="function")try{if(n.execCommand(t,r)!==!1)return!0}catch{}const o=window.execEditorCommand||window.executeEditorCommand;if(typeof o=="function")try{if(o(t,r,{editorElement:n,contentElement:e})!==!1)return!0}catch{}return t1(t,r)}async function r1(e,t){const r=e.editor,n=Uu(r),o={editor:r,editorRoot:n,query:e.query,trigger:e.trigger,executeCommand:(a,i)=>Mc(r,a,i),insertHTML:a=>Ac(r,a)};return t.action?await Promise.resolve(t.action(o))!==!1:t.insertHTML?Ac(r,t.insertHTML):t.command?Mc(r,t.command,t.commandValue):!1}async function Zu(e,t){if(t<0||t>=e.filteredItems.length||!e.replaceRange)return;const r=e.filteredItems[t],n=e.editor,o=n.innerHTML,a=`${e.trigger}${e.query}`;if(!window.getSelection())return;const l=e.replaceRange.cloneRange();if(!n.contains(l.commonAncestorContainer))return;l.deleteContents();const s=l.cloneRange();s.collapse(!0),Ni(n,s);let c=!1;try{c=await r1(e,r)}catch{c=!1}$e(e),c?(Qy(n),Jy(n,o)):a&&e1(n,a),n.focus({preventScroll:!0})}function Rc(e,t){if(e.filteredItems.length===0)return;const r=e.filteredItems.length;if(e.activeIndex=((e.activeIndex+t)%r+r)%r,!e.list)return;const n=Array.from(e.list.querySelectorAll(".rte-slash-item"));n.forEach((a,i)=>{const l=i===e.activeIndex;a.classList.toggle("active",l),a.setAttribute("aria-selected",l?"true":"false")});const o=n[e.activeIndex];o&&(e.list.setAttribute("aria-activedescendant",o.id),o.scrollIntoView({block:"nearest"}))}function Nc(e){if(!(!e.isOpen||!e.panel||!e.anchorRange)){if(!e.editor.isConnected){$e(e);return}Gu(e,e.anchorRange)}}function Yu(e,t,r,n,o,a){Zy(e,t),e.query=n,e.trigger=o,e.replaceRange=a.cloneRange(),e.anchorRange=r.cloneRange(),e.filteredItems=Yy(e.items,n,t.maxSuggestions),e.activeIndex=0,e.isOpen=!0,e.panel&&(Xy(e,t),Gu(e,r))}function n1(e,t){const r=e.editor;if(r.getAttribute("contenteditable")==="false"){$e(e);return}const n=hs(r);if(!n||!n.collapsed){$e(e);return}const o=Wy(n);if(!o){$e(e);return}const a=Uy(o.textBefore,t.triggerChar,t.maxQueryLength,t.requireBoundary);if(!a){$e(e);return}if(a.query.length<t.minChars){$e(e);return}const i=n.cloneRange();i.setStart(o.node,a.startOffset),i.setEnd(o.node,o.caretOffset),Yu(e,t,n,a.query,a.trigger,i)}function Xu(e,t){const r=e.editor;if(r.getAttribute("contenteditable")==="false")return!1;let n=hs(r);n||(n=document.createRange(),n.selectNodeContents(r),n.collapse(!1),Ni(r,n));const o=n.cloneRange();return o.collapse(!0),Yu(e,t,n,"",t.triggerChar,o),!0}function o1(e){return!(e.metaKey||e.ctrlKey)||e.altKey?!1:e.key==="/"||e.code==="Slash"}function a1(e,t){return{editor:e,panel:null,list:null,replaceRange:null,items:t.items,filteredItems:[],activeIndex:0,query:"",trigger:t.triggerChar,isOpen:!1,instanceId:++jy,anchorRange:null}}function Rl(e,t){const r=Ro.get(e);if(r)return r.items=t.items,r;const n=a1(e,t);return Ro.set(e,n),n}function i1(e){var r;const t=Ro.get(e);t&&((r=t.panel)!=null&&r.parentNode&&t.panel.parentNode.removeChild(t.panel),Ro.delete(e))}function Nl(e,t,r){if(li.has(e))return;const n={input:()=>{n1(t,r)},keydown:o=>{if(t.editor.getAttribute("contenteditable")==="false"){$e(t);return}if(!t.isOpen&&o1(o)){o.preventDefault(),Xu(t,r);return}if(t.isOpen){if(o.key==="ArrowDown"){o.preventDefault(),Rc(t,1);return}if(o.key==="ArrowUp"){o.preventDefault(),Rc(t,-1);return}if(o.key==="Enter"||o.key==="Tab"){if(t.filteredItems.length===0){o.key==="Tab"&&o.preventDefault(),$e(t);return}o.preventDefault(),Zu(t,t.activeIndex);return}if(o.key==="Escape"){o.preventDefault(),$e(t);return}}},blur:()=>{window.setTimeout(()=>{const o=document.activeElement;t.panel&&o&&t.panel.contains(o)||$e(t)},0)},mousedown:o=>{if(!t.isOpen||!t.panel)return;const a=o.target;a&&!t.panel.contains(a)&&!e.contains(a)&&$e(t)},selectionchange:()=>{if(!t.isOpen)return;const o=hs(e);if(!o||!o.collapsed){$e(t);return}t.anchorRange=o.cloneRange(),Nc(t)},reposition:()=>{Nc(t)}};e.addEventListener("input",n.input),e.addEventListener("keydown",n.keydown),e.addEventListener("blur",n.blur),document.addEventListener("mousedown",n.mousedown,!0),document.addEventListener("selectionchange",n.selectionchange),window.addEventListener("resize",n.reposition,{passive:!0}),window.addEventListener("scroll",n.reposition,!0),li.set(e,n)}function l1(e){const t=li.get(e);t&&(e.removeEventListener("input",t.input),e.removeEventListener("keydown",t.keydown),e.removeEventListener("blur",t.blur),document.removeEventListener("mousedown",t.mousedown,!0),document.removeEventListener("selectionchange",t.selectionchange),window.removeEventListener("resize",t.reposition),window.removeEventListener("scroll",t.reposition,!0),li.delete(e))}function s1(e){si||(si=!0,io=t=>{const r=t.target;if(!(r instanceof Node))return;const n=Fy(r),o=(n==null?void 0:n.closest(wt))||null;if(!o)return;const a=Rl(o,e);Nl(o,a,e)},document.addEventListener("focusin",io,!0))}function c1(){!si||!io||(document.removeEventListener("focusin",io,!0),si=!1,io=null)}const d1=(e={})=>{qy();const t=_y(e);return{name:"slashCommands",toolbar:[{id:"slashCommands",label:"Slash Commands",command:"openSlashCommands",icon:'<svg width="24" height="24" focusable="false" aria-hidden="true"><path d="M8.7 20a1 1 0 0 1-.7-.3c-.4-.4-.4-1 0-1.4L15.6 5a1 1 0 0 1 1.4 1.4L9.4 19.7a1 1 0 0 1-.7.3Zm7.8 0c-.3 0-.5 0-.7-.3l-1.8-1.8a1 1 0 1 1 1.4-1.4l1.8 1.8a1 1 0 0 1-.7 1.7Zm-9-12a1 1 0 0 1-.7-1.7L8.6 4.5A1 1 0 1 1 10 6L8.2 7.8a1 1 0 0 1-.7.3Z"></path></svg>'}],commands:{openSlashCommands:(r,n)=>{const o=Vy(n);if(!o)return!1;const a=Rl(o,t);return Nl(o,a,t),Xu(a,t)}},keymap:{"Mod-/":"openSlashCommands","Mod-Shift-7":"openSlashCommands"},init:()=>{ha+=1,s1(t),Array.from(document.querySelectorAll(wt)).forEach(n=>{const o=Rl(n,t);Nl(n,o,t)})},destroy:()=>{ha=Math.max(0,ha-1),Array.from(document.querySelectorAll(wt)).forEach(n=>{const o=Ro.get(n);o&&($e(o),l1(n),i1(n))}),ha===0&&c1()}}},u1=()=>({name:"document-manager",toolbar:[{label:"Import Word",command:"importWord",icon:'<svg width="24" height="24" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3h7.4L19 7.6V15h-2V9h-4V5H5c0-1.1.9-2 2-2Z"></path><path d="M9.5 7A1.5 1.5 0 0 1 11 8.4v7.1A1.5 1.5 0 0 1 9.6 17H2.5A1.5 1.5 0 0 1 1 15.6V8.5A1.5 1.5 0 0 1 2.4 7h7.1Zm-1 2.8-1 2.6-1-2.5v-.1a.6.6 0 0 0-1 0l-.1.1-.9 2.5-1-2.5v-.1a.6.6 0 0 0-1 .4v.1l1.5 4v.1a.6.6 0 0 0 1 0v-.1l1-2.5.9 2.5v.1a.6.6 0 0 0 1 0H8l1.6-4v-.2a.6.6 0 0 0-1.1-.4Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11.4 18.2a1 1 0 0 0 1.2 1.6l1.4-1V22a1 1 0 1 0 2 0v-3.1l1.4 1a1 1 0 0 0 1.2-1.7L15 15.8l-3.6 2.4Z"></path></svg>',type:"button"},{label:"Export Word",command:"exportWord",icon:'<svg width="24" height="24" focusable="false"><path d="M9.5 7A1.5 1.5 0 0 1 11 8.4v7.1A1.5 1.5 0 0 1 9.6 17H2.5A1.5 1.5 0 0 1 1 15.6V8.5A1.5 1.5 0 0 1 2.4 7h7.1Zm-1 2.8-1 2.6-1-2.5v-.1a.6.6 0 0 0-1 0l-.1.1-.9 2.5-1-2.5v-.1a.6.6 0 0 0-1 .4v.1l1.5 4v.1a.6.6 0 0 0 1 0v-.1l1-2.5.9 2.5v.1a.6.6 0 0 0 1 0H8l1.6-4v-.2a.6.6 0 0 0-1.1-.4Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3h7.4L19 7.6V17h-2V9h-4V5H7v3H5V5c0-1.1.9-2 2-2ZM15 17a1 1 0 1 0-2 0v3.1l-1.4-1a1 1 0 1 0-1.2 1.7l3.6 2.4 3.6-2.4a1 1 0 0 0-1.2-1.6l-1.4 1V17Z"></path></svg>',type:"button"},{label:"Export PDF",command:"exportPdf",icon:'<svg width="24" height="24" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3h7.4L19 7.6V17h-2V9h-4V5H7v3H5V5c0-1.1.9-2 2-2Z"></path><path d="M2.6 15.2v-1.9h1c.6 0 1-.2 1.4-.5.3-.3.5-.7.5-1.2s-.2-.9-.5-1.2a2 2 0 0 0-1.3-.4H1v5.2h1.6Zm.4-3h-.4v-1.1h.5l.6.1.2.5c0 .1 0 .3-.2.4l-.7.1Zm5.7 3 1-.1c.3 0 .5-.2.7-.4l.5-.8c.2-.3.2-.7.2-1.3v-1l-.5-.8c-.2-.3-.4-.5-.7-.6L8.7 10H6.3v5.2h2.4Zm-.4-1.1H8v-3h.4c.5 0 .8.2 1 .4l.2 1.1-.1 1-.3.3-.8.2Zm5.3 1.2V13h2v-1h-2v-1H16V10h-4v5.2h1.6Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M15 17a1 1 0 1 0-2 0v3.1l-1.4-1a1 1 0 1 0-1.2 1.7l3.6 2.4 3.6-2.4a1 1 0 0 0-1.2-1.6l-1.4 1V17Z"></path></svg>',type:"button"}],commands:{importWord:()=>{const e=()=>{const r=window.getSelection();if(r&&r.rangeCount>0){let a=r.getRangeAt(0).startContainer;for(;a&&a!==document.body;){if(a.nodeType===Node.ELEMENT_NODE){const i=a;if(i.getAttribute("contenteditable")==="true")return i}a=a.parentNode}}const n=document.activeElement;if((n==null?void 0:n.getAttribute("contenteditable"))==="true")return n;const o=n==null?void 0:n.closest('[contenteditable="true"]');return o||document.querySelector('[contenteditable="true"]')},t=document.createElement("input");return t.type="file",t.accept=".docx",t.onchange=async r=>{var o;const n=(o=r.target.files)==null?void 0:o[0];if(n)try{const a=e();if(a){const{importFromWord:i}=await zi(()=>import("./documentManager-2e7bb0c7.js"),["./documentManager-2e7bb0c7.js","./iframe-c526a5dc.js"],import.meta.url),l=await i(n);a.innerHTML=l,a.dispatchEvent(new Event("input",{bubbles:!0}))}}catch(a){console.error("Import failed:",a),alert("Failed to import Word document. Please check the console for details.")}},t.click(),!0},exportWord:async()=>{const e=()=>{const t=window.getSelection();if(t&&t.rangeCount>0){let o=t.getRangeAt(0).startContainer;for(;o&&o!==document.body;){if(o.nodeType===Node.ELEMENT_NODE&&o.getAttribute("contenteditable")==="true")return o;o=o.parentNode}}const r=document.activeElement;return(r==null?void 0:r.getAttribute("contenteditable"))==="true"?r:(r==null?void 0:r.closest('[contenteditable="true"]'))||document.querySelector('[contenteditable="true"]')};try{const t=e();if(t){const r=t.innerHTML,{exportToWord:n}=await zi(()=>import("./documentManager-2e7bb0c7.js"),["./documentManager-2e7bb0c7.js","./iframe-c526a5dc.js"],import.meta.url);await n(r,"document.docx")}return!0}catch(t){return console.error("Export failed:",t),alert("Failed to export to Word. Please check the console for details."),!1}},exportPdf:async()=>{const e=()=>{const t=window.getSelection();if(t&&t.rangeCount>0){let o=t.getRangeAt(0).startContainer;for(;o&&o!==document.body;){if(o.nodeType===Node.ELEMENT_NODE&&o.getAttribute("contenteditable")==="true")return o;o=o.parentNode}}const r=document.activeElement;return(r==null?void 0:r.getAttribute("contenteditable"))==="true"?r:(r==null?void 0:r.closest('[contenteditable="true"]'))||document.querySelector('[contenteditable="true"]')};try{const t=e();if(t){const r=t.innerHTML,{exportToPdf:n}=await zi(()=>import("./documentManager-2e7bb0c7.js"),["./documentManager-2e7bb0c7.js","./iframe-c526a5dc.js"],import.meta.url);await n(r,"document.pdf",t)}else console.error("PDF Export: No editor element found"),alert("No active editor found. Please click in the editor area first.");return!0}catch(t){return console.error("PDF Export: Export failed:",t),alert("Failed to export to PDF. Please check the console for details."),!1}}},keymap:{}});let el=!1;const f1=()=>{if(typeof document>"u")return;const e="rte-preview-plugin-styles";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
    /* Preview Editor Dialog Styles */
    .rte-preview-editor-overlay {
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

    .rte-preview-editor-modal {
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

    .rte-preview-editor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #e1e5e9;
      background: #f8f9fa;
      border-radius: 8px 8px 0 0;
    }

    .rte-preview-editor-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .rte-preview-editor-header-actions {
      display: flex;
      gap: 8px;
    }

    .rte-preview-editor-close-btn {
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

    .rte-preview-editor-close-btn:hover {
      background: #e1e5e9;
      color: #1a1a1a;
    }

    .rte-preview-editor-body {
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      padding: 25px;
    }

    .rte-preview-editor-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .rte-preview-editor-light-editor {
      flex: 1;
      overflow: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #1a1a1a;
      padding: 20px;
      background: #fafafa;
      border: 1px solid #e1e5e9;
      border-radius: 4px;
      min-height: 400px;
    }

    .rte-preview-editor-light-editor h1,
    .rte-preview-editor-light-editor h2,
    .rte-preview-editor-light-editor h3,
    .rte-preview-editor-light-editor h4,
    .rte-preview-editor-light-editor h5,
    .rte-preview-editor-light-editor h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
    }

    .rte-preview-editor-light-editor h1 {
      font-size: 2em;
    }

    .rte-preview-editor-light-editor h2 {
      font-size: 1.5em;
    }

    .rte-preview-editor-light-editor h3 {
      font-size: 1.25em;
    }

    .rte-preview-editor-light-editor p {
      margin: 1em 0;
    }

    .rte-preview-editor-light-editor ul,
    .rte-preview-editor-light-editor ol {
      padding-left: 2em;
      margin: 1em 0;
    }

    .rte-preview-editor-light-editor li {
      margin: 0.5em 0;
    }

    .rte-preview-editor-light-editor table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }

    .rte-preview-editor-light-editor table td,
    .rte-preview-editor-light-editor table th {
      border: 1px solid #ddd;
      padding: 0.5em;
    }

    .rte-preview-editor-light-editor table th {
      background: #f5f5f5;
      font-weight: 600;
    }

    .rte-preview-editor-light-editor blockquote {
      border-left: 4px solid #ddd;
      margin: 1em 0;
      padding-left: 1em;
      color: #666;
    }

    .rte-preview-editor-light-editor code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
      font-size: 0.9em;
    }

    .rte-preview-editor-light-editor pre {
      background: #f5f5f5;
      padding: 1em;
      border-radius: 4px;
      overflow-x: auto;
      margin: 1em 0;
    }

    .rte-preview-editor-light-editor pre code {
      background: none;
      padding: 0;
    }

    .rte-preview-editor-light-editor img {
      max-width: 100%;
      height: auto;
    }

    .rte-preview-editor-light-editor a {
      color: #007acc;
      text-decoration: underline;
    }

    .rte-preview-editor-light-editor a:hover {
      color: #0056b3;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .rte-preview-editor-overlay {
        padding: 10px;
      }

      .rte-preview-editor-modal {
        max-height: 95vh;
      }

      .rte-preview-editor-header {
        padding: 12px 16px;
      }

      .rte-preview-editor-body {
        padding: 16px;
      }

      .rte-preview-editor-light-editor {
        padding: 12px;
        font-size: 14px;
      }
    }
  `,document.head.appendChild(t)},m1=()=>{const e=window.getSelection();if(e&&e.rangeCount>0){let r=e.getRangeAt(0).startContainer;for(;r&&r!==document.body;){if(r.nodeType===Node.ELEMENT_NODE){const n=r;if(n.getAttribute("contenteditable")==="true")return n}r=r.parentNode}}const t=document.activeElement;if(t){if(t.getAttribute("contenteditable")==="true")return t;const r=t.closest('[contenteditable="true"]');if(r)return r}return document.querySelector('[contenteditable="true"]')},p1=()=>{const e=m1();if(!e)return"";const t=e.cloneNode(!0);return[".rte-floating-toolbar",".rte-selection-marker",".rte-toolbar",".rte-resize-handle","[data-rte-internal]"].forEach(n=>{t.querySelectorAll(n).forEach(o=>o.remove())}),t.innerHTML},g1=e=>{const t=document.createElement("div");return t.innerHTML=e,t.querySelectorAll('script, iframe[src^="javascript:"], object, embed, form[action^="javascript:"]').forEach(o=>o.remove()),t.querySelectorAll("*").forEach(o=>{Array.from(o.attributes).forEach(a=>{a.name.startsWith("on")&&o.removeAttribute(a.name),(a.name==="href"||a.name==="src")&&a.value.startsWith("javascript:")&&o.removeAttribute(a.name),a.name.toLowerCase()==="contenteditable"&&o.removeAttribute(a.name)}),o.setAttribute("contenteditable","false")}),t.innerHTML},b1=()=>{if(typeof window>"u"||el)return;el=!0,f1();const e=p1(),t=g1(e),r=document.createElement("div");r.className="rte-preview-editor-overlay",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.setAttribute("aria-labelledby","preview-editor-title");const n=document.createElement("div");n.className="rte-preview-editor-modal";const o=document.createElement("div");o.className="rte-preview-editor-header",o.innerHTML=`
    <h2 id="preview-editor-title">Preview Editor</h2>
    <div class="rte-preview-editor-header-actions">
      <button class="rte-preview-editor-close-btn" aria-label="Close preview editor">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  `;const a=document.createElement("div");a.className="rte-preview-editor-body";const i=document.createElement("div");i.className="rte-preview-editor-content";const l=document.createElement("div");l.className="rte-preview-editor-light-editor",l.innerHTML=t,i.appendChild(l),a.appendChild(i),n.appendChild(o),n.appendChild(a),r.appendChild(n);const s=()=>{r.parentNode&&r.parentNode.removeChild(r),el=!1,document.removeEventListener("keydown",c)},c=u=>{u.key==="Escape"&&(u.preventDefault(),u.stopPropagation(),s())},d=o.querySelector(".rte-preview-editor-close-btn");d&&d.addEventListener("click",u=>{u.preventDefault(),u.stopPropagation(),s()}),r.addEventListener("click",u=>{u.target===r&&s()}),document.addEventListener("keydown",c),document.body.appendChild(r)},h1=()=>({name:"preview",toolbar:[{label:"Preview",command:"togglePreview",icon:'<svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 92 92" enable-background="new 0 0 92 92" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_1239_" d="M91.3,43.8C90.6,42.8,74.4,19,46,19C17.6,19,1.4,42.8,0.7,43.8c-0.9,1.3-0.9,3.1,0,4.5 C1.4,49.2,17.6,73,46,73c28.4,0,44.6-23.8,45.3-24.8C92.2,46.9,92.2,45.1,91.3,43.8z M46,65C26.7,65,13.5,51.4,9,46 c4.5-5.5,17.6-19,37-19c19.3,0,32.5,13.6,37,19C78.4,51.5,65.3,65,46,65z M48.3,29.6c-4.4-0.6-8.7,0.5-12.3,3.2c0,0,0,0,0,0 c-7.3,5.5-8.8,15.9-3.3,23.2c2.7,3.6,6.5,5.8,10.9,6.5c0.8,0.1,1.6,0.2,2.3,0.2c3.6,0,7-1.2,9.9-3.3c7.3-5.5,8.8-15.9,3.3-23.2 C56.6,32.5,52.7,30.2,48.3,29.6z M52.3,54.5c-2.2,1.7-5,2.4-7.8,2c-2.8-0.4-5.3-1.9-7-4.1C34.1,47.7,35,41,39.7,37.5 c2.2-1.7,5-2.4,7.8-2c2.8,0.4,5.3,1.9,7,4.1C57.9,44.3,57,51,52.3,54.5z M51.9,40c0.8,0.7,1.2,1.8,1.2,2.8c0,1-0.4,2.1-1.2,2.8 c-0.7,0.7-1.8,1.2-2.8,1.2c-1.1,0-2.1-0.4-2.8-1.2c-0.8-0.8-1.2-1.8-1.2-2.8c0-1.1,0.4-2.1,1.2-2.8c0.7-0.8,1.8-1.2,2.8-1.2 C50.2,38.9,51.2,39.3,51.9,40z"></path> </g></svg>'}],commands:{togglePreview:()=>(b1(),!0)},keymap:{}}),y1=()=>`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      background: white;
      color: black;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.5;
    }

    .rte-print {
      background: white;
      color: black;
    }

    /* Page break handling */
    .rte-page-break {
      page-break-after: always;
      display: block;
      height: 0;
      margin: 0;
      border: none;
      background: none;
    }

    .rte-page-break::before {
      display: none;
    }

    /* Code block formatting */
    .rte-code-block,
    pre {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 12px;
      margin: 12px 0;
      overflow-x: auto;
      page-break-inside: avoid;
    }

    .rte-code-block code,
    pre code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12px;
      line-height: 1.4;
      white-space: pre-wrap;
      word-break: break-word;
    }

    /* Footnotes */
    .rte-footnotes {
      border-top: 1px solid #ccc;
      margin-top: 40px;
      padding-top: 12px;
      page-break-inside: avoid;
    }

    .rte-footnotes ol {
      margin-left: 20px;
    }

    .rte-footnotes li {
      margin: 8px 0;
      font-size: 0.9em;
    }

    .rte-footnote-ref {
      vertical-align: super;
      font-size: 0.8em;
    }

    .rte-footnote-backref {
      margin-left: 4px;
      text-decoration: none;
      color: #666;
    }

    /* Anchors - preserve IDs but hide visual markers */
    .rte-anchor {
      display: none;
    }

    /* Lists and tables */
    ul, ol {
      margin: 12px 0;
      padding-left: 40px;
    }

    li {
      margin: 4px 0;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin: 12px 0;
      page-break-inside: avoid;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    th {
      background: #f5f5f5;
      font-weight: bold;
    }

    /* Heading hierarchy */
    h1 { 
      font-size: 2em; 
      margin: 20px 0 12px;
      page-break-after: avoid;
    }
    
    h2 { 
      font-size: 1.5em; 
      margin: 16px 0 10px;
      page-break-after: avoid;
    }
    
    h3 { 
      font-size: 1.25em; 
      margin: 14px 0 8px;
      page-break-after: avoid;
    }
    
    h4 { 
      font-size: 1.1em; 
      margin: 12px 0 6px;
      page-break-after: avoid;
    }
    
    h5 { 
      font-size: 1em; 
      margin: 12px 0 6px;
      page-break-after: avoid;
    }
    
    h6 { 
      font-size: 0.9em; 
      margin: 12px 0 6px;
      page-break-after: avoid;
    }

    p {
      margin: 8px 0;
    }

    /* Emphasis and strong */
    strong, b {
      font-weight: bold;
    }

    em, i {
      font-style: italic;
    }

    u {
      text-decoration: underline;
    }

    /* Block elements */
    blockquote {
      border-left: 4px solid #ddd;
      margin: 12px 0;
      padding-left: 16px;
      color: #666;
    }

    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 16px 0;
      page-break-after: avoid;
    }

    /* Images */
    img {
      max-width: 100%;
      height: auto;
      page-break-inside: avoid;
    }

    /* Links */
    a {
      color: #0066cc;
      text-decoration: underline;
    }

    /* Merge tags */
    .rte-merge-tag {
      background-color: #e3f2fd;
      border: 1px solid #bbdefb;
      border-radius: 3px;
      padding: 2px 6px;
      margin: 0 2px;
      display: inline-block;
      white-space: nowrap;
      font-weight: 500;
      color: #1976d2;
      font-size: 0.9em;
    }

    /* Hide selection */
    ::selection {
      background: transparent;
    }

    /* Print-specific rules */
    @media print {
      body {
        margin: 0;
        padding: 0;
      }

      .rte-page-break {
        page-break-after: always;
      }

      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
        page-break-inside: avoid;
      }

      table, figure, img, pre {
        page-break-inside: avoid;
      }

      ul, ol, blockquote {
        page-break-inside: avoid;
      }
    }
  `,Dc=()=>{var l;if(typeof window>"u")return!1;const t=(()=>{const s=window.getSelection();if(s&&s.rangeCount>0){let d=s.getRangeAt(0).startContainer;for(;d&&d!==document.body;){if(d.nodeType===Node.ELEMENT_NODE){const u=d;if(u.getAttribute("contenteditable")==="true")return u}d=d.parentNode}}const c=document.activeElement;if(c){if(c.getAttribute("contenteditable")==="true")return c;const d=c.closest('[contenteditable="true"]');if(d)return d}return document.querySelector('[contenteditable="true"]')})();if(!t)return console.warn("Editor content not found"),!1;const r=t.cloneNode(!0),n=document.createElement("article");n.className="rte-document rte-print",n.appendChild(r);const o=`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Print Document</title>
        <style>${y1()}</style>
      </head>
      <body>
        ${n.outerHTML}
      </body>
    </html>
  `,a=document.createElement("iframe");a.style.position="absolute",a.style.left="-9999px",a.style.top="-9999px",a.style.width="0",a.style.height="0",document.body.appendChild(a);const i=a.contentDocument||((l=a.contentWindow)==null?void 0:l.document);return i?(i.open(),i.write(o),i.close(),setTimeout(()=>{a.contentWindow&&(a.contentWindow.print(),setTimeout(()=>{document.body.removeChild(a)},100))},250),!0):(console.error("Could not access print frame document"),document.body.removeChild(a),!1)},x1=()=>({name:"print",toolbar:[{label:"Print",command:"print",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M7 9V4h10v5M6 18h12v-4H6v4Zm0 0v2h12v-2M6 9H5a2 2 0 0 0-2 2v3h3m12-5h1a2 2 0 0 1 2 2v3h-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',shortcut:"Mod-p"}],commands:{print:Dc},keymap:{"Mod-p":()=>(Dc(),!0)}}),Cr='.rte-page-break[data-type="page-break"]',ci=".rte-content, .editora-content";let ya=null,Hc=!1;const Ju=(e,t)=>{if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}},v1=new Set(["DIV","P","BLOCKQUOTE","PRE","H1","H2","H3","H4","H5","H6","LI","TD","TH"]),k1=()=>{ya||typeof document>"u"||(ya=document.createElement("style"),ya.textContent=`
    .rte-page-break {
      display: block;
      position: relative;
      height: 12px;
      margin: 8px 0;
      background: linear-gradient(90deg, #ccc 0%, transparent 100%);
      border-top: 2px dashed #999;
      border-bottom: none;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;
      outline: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    }

    .rte-page-break::before {
      content: '⎙ PAGE BREAK';
      position: absolute;
      top: -12px;
      left: 0;
      font-size: 10px;
      font-weight: bold;
      color: #666;
      background: white;
      padding: 2px 6px;
      letter-spacing: 0.5px;
      opacity: 0.7;
      pointer-events: none;
    }

    .rte-page-break:hover {
      background: linear-gradient(90deg, #999 0%, transparent 100%);
      border-top-color: #666;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    }

    .rte-page-break:hover::before {
      opacity: 1;
      color: #333;
    }

    .rte-page-break:focus,
    .rte-page-break:focus-visible,
    .rte-page-break-selected {
      outline: 2px solid #0066cc;
      outline-offset: -2px;
      border-top-color: #0066cc;
      background: linear-gradient(90deg, #0066cc 0%, transparent 100%);
    }

    .rte-page-break * {
      user-select: none;
    }

    @media print {
      .rte-page-break {
        display: block;
        height: 0;
        margin: 0;
        background: none;
        border: none;
        page-break-after: always;
      }

      .rte-page-break::before {
        display: none;
      }
    }
  `,document.head.appendChild(ya))},w1=()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return null;const t=e.getRangeAt(0),r=t.startContainer.nodeType===Node.ELEMENT_NODE?t.startContainer:t.startContainer.parentElement;return(r==null?void 0:r.closest(ci))||null},Qu=()=>{const e=w1();if(e)return e;const t=document.activeElement,r=t==null?void 0:t.closest(ci);return r||document.querySelector(ci)},Ic=(e,t)=>{let r=e;for(;r&&r!==t;){if(r.nodeType===Node.ELEMENT_NODE){const n=r;if(v1.has(n.tagName))return n}r=r.parentNode}return null},E1=()=>{const e=document.createElement("div");return e.className="rte-page-break",e.setAttribute("data-page-break","true"),e.setAttribute("data-type","page-break"),e.setAttribute("contenteditable","false"),e.setAttribute("tabindex","0"),e.setAttribute("role","separator"),e.setAttribute("aria-label","Page break"),e},C1=e=>{let t=e.nextElementSibling;for(;t&&t.matches(Cr);){const n=t;t=t.nextElementSibling,n.remove()}let r=e.previousElementSibling;for(;r&&r.matches(Cr);){const n=r;r=r.previousElementSibling,n.remove()}},ef=e=>{var n;const t=e.nextElementSibling;if(t&&!t.matches(Cr))return t;const r=document.createElement("p");return r.innerHTML="<br>",(n=e.parentNode)==null||n.insertBefore(r,e.nextSibling),r},fr=e=>{const t=window.getSelection();if(!t)return;const r=document.createRange();e.nodeType,Node.TEXT_NODE,r.setStart(e,0),r.collapse(!0),t.removeAllRanges(),t.addRange(r)},Dl=e=>{const t=window.getSelection();if(!t)return;const r=document.createRange();if(e.nodeType===Node.TEXT_NODE){const n=e;r.setStart(n,n.data.length)}else r.selectNodeContents(e),r.collapse(!1);t.removeAllRanges(),t.addRange(r)},di=(e,t)=>{let r=e;for(;r;){if(!(r instanceof HTMLElement&&r.matches(Cr)))return r;r=t==="previous"?r.previousSibling:r.nextSibling}return null},S1=e=>{const t=window.getSelection();if(!t||!e.parentNode)return;const r=e.parentNode,n=Array.from(r.childNodes).indexOf(e);if(n<0)return;const o=document.createRange();o.setStart(r,n),o.setEnd(r,n+1),t.removeAllRanges(),t.addRange(o),e.focus({preventScroll:!0})},T1=e=>{if(e.collapsed||e.startContainer!==e.endContainer||e.endOffset!==e.startOffset+1||!(e.startContainer instanceof Element||e.startContainer instanceof DocumentFragment))return null;const t=e.startContainer.childNodes[e.startOffset];return t instanceof HTMLElement&&t.matches(Cr)?t:null},$1=(e,t,r)=>{if(!e.collapsed)return null;const{startContainer:n,startOffset:o}=e,a=l=>l instanceof HTMLElement&&l.matches(Cr)?l:null,i=l=>{if(n.nodeType===Node.ELEMENT_NODE){const c=n;if(l==="previous"){if(o>0)return c.childNodes[o-1]||null}else if(o<c.childNodes.length)return c.childNodes[o]||null}if(n.nodeType===Node.TEXT_NODE&&(l==="previous"&&o<n.data.length||l==="next"&&o>0))return null;let s=n;for(;s&&s!==t;){const c=l==="previous"?s.previousSibling:s.nextSibling;if(c)return c;s=s.parentNode}return null};if(n.nodeType===Node.ELEMENT_NODE){const l=n;return r==="Backspace"&&o>0?a(l.childNodes[o-1]||null):r==="Delete"?a(l.childNodes[o]||null):null}if(n.nodeType===Node.TEXT_NODE){const l=n;if(r==="Backspace"&&o===0){const s=a(l.previousSibling);return s||a(i("previous"))}if(r==="Delete"&&o===l.data.length){const s=a(l.nextSibling);return s||a(i("next"))}}return a(i(r==="Backspace"?"previous":"next"))},Bc=(e,t)=>{const r=e.closest(ci),n=(r==null?void 0:r.innerHTML)??"",o=e.previousSibling,a=e.nextSibling;e.remove();const i=di(o,"previous"),l=di(a,"next");if(t==="Backspace"){if(i)Dl(i);else if(l)fr(l);else if(r){const s=document.createElement("p");s.innerHTML="<br>",r.appendChild(s),fr(s)}}else if(l)fr(l);else if(i)Dl(i);else if(r){const s=document.createElement("p");s.innerHTML="<br>",r.appendChild(s),fr(s)}return r&&(Ju(r,n),r.dispatchEvent(new Event("input",{bubbles:!0}))),!0},L1=()=>{const e=Qu();if(!e)return!1;const t=e.innerHTML,r=window.getSelection();if(!r)return!1;let n;r.rangeCount>0&&e.contains(r.getRangeAt(0).commonAncestorContainer)?n=r.getRangeAt(0):(n=document.createRange(),n.selectNodeContents(e),n.collapse(!1),r.removeAllRanges(),r.addRange(n));const o=Ic(n.endContainer,e)||Ic(n.startContainer,e),a=E1();o&&o.parentNode?o.parentNode.insertBefore(a,o.nextSibling):e.appendChild(a),C1(a);const i=ef(a);return fr(i),Ju(e,t),e.dispatchEvent(new Event("input",{bubbles:!0})),!0},A1=()=>{Hc||typeof document>"u"||(Hc=!0,document.addEventListener("click",e=>{const t=e.target,r=t==null?void 0:t.closest(Cr);r&&(e.preventDefault(),e.stopPropagation(),S1(r))}),document.addEventListener("keydown",e=>{const t=e.key;if(!["Backspace","Delete","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(t))return;const r=window.getSelection();if(!r||r.rangeCount===0)return;const n=r.getRangeAt(0),o=Qu();if(!o||!o.contains(n.commonAncestorContainer))return;const a=T1(n);if(a){if(t==="Backspace"||t==="Delete"){e.preventDefault(),e.stopPropagation(),Bc(a,t);return}if(t==="ArrowRight"||t==="ArrowDown"){e.preventDefault();const i=di(a.nextSibling,"next")||ef(a);fr(i);return}if(t==="ArrowLeft"||t==="ArrowUp"){e.preventDefault();const i=di(a.previousSibling,"previous");i?Dl(i):fr(o);return}}if(t==="Backspace"||t==="Delete"){const i=$1(n,o,t);if(!i)return;e.preventDefault(),e.stopPropagation(),Bc(i,t)}}))},M1=()=>(k1(),A1(),{name:"pageBreak",toolbar:[{label:"Page Break",command:"insertPageBreak",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M5 5H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M5 9H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M5 15H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-dasharray="3.2 3.2"/><path d="M5 19H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',shortcut:"Mod-Enter"}],commands:{insertPageBreak:L1},keymap:{"Mod-Enter":"insertPageBreak"}}),tf=".rte-content, .editora-content",ys='.rte-footnotes[data-type="footnotes"]',Vo=".rte-footnote-ref[data-footnote-id]",ui='li.rte-footnote-item[data-type="footnote"]',Pc="__editoraCommandEditorRoot";let Oc=!1,zc=!1,_c=0;function R1(){if(Oc||typeof document>"u")return;Oc=!0;const e=document.createElement("style");e.id="editora-footnote-plugin-styles",e.textContent=`
    .rte-footnote-ref {
      display: inline-block;
      font-size: 0.72em;
      line-height: 1;
      vertical-align: super;
      margin-left: 1px;
      color: #1f4dbd;
      cursor: pointer;
      user-select: none;
      border-radius: 4px;
      padding: 0 2px;
      outline: none;
      font-weight: 600;
    }

    .rte-footnote-ref:focus,
    .rte-footnote-ref:focus-visible,
    .rte-footnote-ref.rte-footnote-selected {
      background: rgba(31, 77, 189, 0.12);
      box-shadow: 0 0 0 2px rgba(31, 77, 189, 0.24);
    }

    .rte-footnotes {
      margin-top: 16px;
      padding-top: 10px;
      border-top: 1px solid #d1d5db;
    }

    .rte-footnotes ol {
      margin: 0;
      padding-left: 24px;
    }

    .rte-footnote-item {
      margin: 0 0 8px;
      color: inherit;
    }

    .rte-footnote-content {
      display: inline;
      outline: none;
    }

    .rte-footnote-backref {
      margin-left: 8px;
      color: #1f4dbd;
      text-decoration: none;
      font-size: 0.9em;
      user-select: none;
    }

    .rte-footnote-backref:hover,
    .rte-footnote-backref:focus {
      text-decoration: underline;
    }

    .rte-footnote-highlighted {
      animation: rte-footnote-flash 1s ease;
    }

    @keyframes rte-footnote-flash {
      0% { background-color: rgba(255, 234, 143, 0.9); }
      100% { background-color: transparent; }
    }

    :is([data-theme="dark"], .dark, .editora-theme-dark) .rte-footnote-ref {
      color: #8ab4ff;
    }

    :is([data-theme="dark"], .dark, .editora-theme-dark) .rte-footnote-ref:focus,
    :is([data-theme="dark"], .dark, .editora-theme-dark) .rte-footnote-ref:focus-visible,
    :is([data-theme="dark"], .dark, .editora-theme-dark) .rte-footnote-ref.rte-footnote-selected {
      background: rgba(138, 180, 255, 0.16);
      box-shadow: 0 0 0 2px rgba(138, 180, 255, 0.3);
    }

    :is([data-theme="dark"], .dark, .editora-theme-dark) .rte-footnotes {
      border-top-color: #4b5563;
    }

    :is([data-theme="dark"], .dark, .editora-theme-dark) .rte-footnote-backref {
      color: #8ab4ff;
    }
  `,document.head.appendChild(e)}function rf(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function N1(e){if(!e)return null;const t=e.querySelector('[contenteditable="true"]');return t instanceof HTMLElement?t:null}function D1(){if(typeof window>"u")return null;const e=window[Pc];if(!(e instanceof HTMLElement))return null;window[Pc]=null;const t=e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(e.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?e:null);if(t){const n=N1(t);if(n)return n;if(t.getAttribute("contenteditable")==="true")return t}if(e.getAttribute("contenteditable")==="true")return e;const r=e.closest('[contenteditable="true"]');return r instanceof HTMLElement?r:null}function H1(e){const t=e.closest('[contenteditable="true"]');if(!t)return null;let r=t,n=r.parentElement;for(;n;)n.getAttribute("contenteditable")==="true"&&(r=n),n=n.parentElement;return r}function yn(e){const t=rf(e);if(!t)return null;const r=t.closest(tf);return r||H1(t)}function I1(){const e=window.getSelection();return!e||e.rangeCount===0?null:yn(e.getRangeAt(0).startContainer)}function B1(){const e=D1();if(e&&document.contains(e))return e;const t=I1();if(t)return t;const r=document.activeElement,n=r?yn(r):null;if(n)return n;const o=document.querySelector(tf);return o||document.querySelector('[contenteditable="true"]')}function P1(){const e=document.createElement("section");e.className="rte-footnotes",e.setAttribute("data-type","footnotes"),e.setAttribute("contenteditable","false");const t=document.createElement("ol");return e.appendChild(t),e}function fi(e,t){let r=e.querySelector(ys);return!r&&t&&(r=P1(),e.appendChild(r)),r?(r.querySelector("ol")||r.appendChild(document.createElement("ol")),r):null}function nf(e){let t=e.querySelector("ol");return t||(t=document.createElement("ol"),e.appendChild(t)),t}function O1(e){const t=document.createElement("sup");return t.className="rte-footnote-ref",t.setAttribute("data-footnote-id",e),t.setAttribute("data-number","0"),t.setAttribute("contenteditable","false"),t.setAttribute("tabindex","0"),t.setAttribute("role","doc-noteref"),t.id=`ref-${e}`,t.textContent="0",t}function of(e,t){const r=document.createElement("li");r.id=e,r.className="rte-footnote-item",r.setAttribute("data-type","footnote"),r.setAttribute("data-number","0"),r.setAttribute("contenteditable","false");const n=document.createElement("div");n.className="rte-footnote-content",n.setAttribute("contenteditable","true"),n.textContent=t;const o=document.createElement("a");return o.className="rte-footnote-backref",o.href=`#ref-${e}`,o.setAttribute("aria-label","Back to reference"),o.setAttribute("contenteditable","false"),o.textContent="↩",r.appendChild(n),r.appendChild(o),r}function z1(e){let t="";do _c+=1,t=`fn-${Date.now().toString(36)}-${_c.toString(36)}`;while(e.querySelector(`#${CSS.escape(t)}`));return t}function qc(e){e.classList.remove("rte-footnote-highlighted"),e.classList.add("rte-footnote-highlighted"),window.setTimeout(()=>{e.classList.remove("rte-footnote-highlighted")},1e3)}function af(e){e&&e.dispatchEvent(new Event("input",{bubbles:!0}))}function lf(e,t){if(!e||t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function _1(e,t){return Array.from(e.querySelectorAll(Vo)).find(n=>n.getAttribute("data-footnote-id")===t)||null}function q1(e){const t=window.getSelection();if(!t)throw new Error("Selection unavailable");let r=null;if(t.rangeCount>0){const o=t.getRangeAt(0);e.contains(o.commonAncestorContainer)&&(r=o.cloneRange())}if(!r){r=document.createRange();const o=fi(e,!1);o?(r.setStartBefore(o),r.collapse(!0)):(r.selectNodeContents(e),r.collapse(!1))}const n=rf(r.commonAncestorContainer);if(n!=null&&n.closest(ys)){const o=fi(e,!0);o&&(r.setStartBefore(o),r.collapse(!0))}return t.removeAllRanges(),t.addRange(r),r}function jc(e){const t=e.parentNode;if(!t)return;const r=Array.from(t.childNodes).indexOf(e);if(r<0)return;const n=window.getSelection();if(!n)return;const o=document.createRange();o.setStart(t,r),o.setEnd(t,r+1),n.removeAllRanges(),n.addRange(o),e.focus({preventScroll:!0})}function Fc(e,t){const r=window.getSelection();if(!r)return;const n=Math.max(0,Math.min(t,e.childNodes.length)),o=document.createRange();o.setStart(e,n),o.collapse(!0),r.removeAllRanges(),r.addRange(o)}function j1(e){if(e.collapsed||e.startContainer!==e.endContainer||e.endOffset!==e.startOffset+1||!(e.startContainer instanceof Element||e.startContainer instanceof DocumentFragment))return null;const t=e.startContainer.childNodes[e.startOffset];return!(t instanceof HTMLElement)||!t.matches(Vo)?null:t}function xa(e,t,r){const{startContainer:n,startOffset:o}=e;if(n.nodeType===Node.ELEMENT_NODE){const i=n;if(r==="previous"){if(o>0)return i.childNodes[o-1]||null}else if(o<i.childNodes.length)return i.childNodes[o]||null}if(n.nodeType===Node.TEXT_NODE&&(r==="previous"&&o<n.data.length||r==="next"&&o>0))return null;let a=n;for(;a&&a!==t;){const i=r==="previous"?a.previousSibling:a.nextSibling;if(i)return i;a=a.parentNode}return null}function F1(e,t,r){if(!e.collapsed)return null;const n=i=>i instanceof HTMLElement&&i.matches(Vo)?i:null,{startContainer:o,startOffset:a}=e;if(o.nodeType===Node.ELEMENT_NODE){const i=o;return r==="Backspace"&&a>0?n(i.childNodes[a-1]||null):r==="Delete"?n(i.childNodes[a]||null):null}if(o.nodeType===Node.TEXT_NODE){const i=o;if(r==="Backspace"&&a===0){const l=n(i.previousSibling);return l||n(xa(e,t,"previous"))}if(r==="Delete"&&a===i.data.length){const l=n(i.nextSibling);return l||n(xa(e,t,"next"))}}return n(r==="Backspace"?xa(e,t,"previous"):xa(e,t,"next"))}function sf(e){const t=Array.from(e.querySelectorAll(Vo)).filter(l=>!l.closest(ys)),r=fi(e,t.length>0);if(!r)return;const n=nf(r),o=Array.from(n.querySelectorAll(ui)),a=new Map;o.forEach(l=>a.set(l.id,l));const i=[];t.forEach((l,s)=>{const c=l.getAttribute("data-footnote-id");if(!c)return;const d=s+1;l.setAttribute("data-number",String(d)),l.id=`ref-${c}`,l.textContent=String(d);let u=a.get(c);u||(u=of(c,`Footnote ${d}`)),u.setAttribute("data-number",String(d));const f=u.querySelector(".rte-footnote-content");f&&!(f.textContent||"").trim()&&(f.textContent=`Footnote ${d}`);const p=u.querySelector(".rte-footnote-backref");p&&(p.href=`#ref-${c}`,p.setAttribute("aria-label",`Back to reference ${d}`)),i.push(u)}),n.innerHTML="",i.forEach(l=>n.appendChild(l)),i.length===0&&r.remove()}function Vc(e,t){const r=yn(e),n=e.parentNode;if(!r||!n)return!1;const o=r.innerHTML,a=Array.from(n.childNodes).indexOf(e);if(a<0)return!1;const i=e.getAttribute("data-footnote-id")||"";if(e.remove(),i){const l=r.querySelector(`${ui}#${CSS.escape(i)}`);l==null||l.remove()}return Fc(n,a),sf(r),lf(r,o),af(r),!0}function V1(){zc||typeof document>"u"||(zc=!0,document.addEventListener("click",e=>{const t=e.target;if(!t)return;const r=t.closest(Vo);if(r){const s=yn(r);if(!s||!s.contains(r))return;e.preventDefault(),e.stopPropagation(),jc(r),r.classList.add("rte-footnote-selected"),window.setTimeout(()=>r.classList.remove("rte-footnote-selected"),1200);const c=r.getAttribute("data-footnote-id");if(!c)return;const d=s.querySelector(`${ui}#${CSS.escape(c)}`);if(!d)return;d.scrollIntoView({behavior:"smooth",block:"center"}),qc(d);return}const n=t.closest(".rte-footnote-backref");if(!n)return;const o=n.closest(ui);if(!o)return;const a=yn(o);if(!a||!a.contains(o))return;e.preventDefault(),e.stopPropagation();const i=o.id;if(!i)return;const l=_1(a,i);l&&(l.scrollIntoView({behavior:"smooth",block:"center"}),qc(l),jc(l))}),document.addEventListener("keydown",e=>{if(e.key!=="Backspace"&&e.key!=="Delete")return;const t=window.getSelection();if(!t||t.rangeCount===0)return;const r=t.getRangeAt(0),n=yn(r.commonAncestorContainer);if(!n||!n.contains(r.commonAncestorContainer))return;const o=j1(r);if(o){e.preventDefault(),e.stopPropagation(),Vc(o,e.key);return}const a=F1(r,n,e.key);a&&(e.preventDefault(),e.stopPropagation(),Vc(a,e.key))}))}const K1=(e="")=>{const t=B1();if(!t)return!1;const r=t.innerHTML,n=window.getSelection();if(!n)return!1;let o;try{o=q1(t)}catch{return!1}o.collapsed||(o.collapse(!1),n.removeAllRanges(),n.addRange(o));const a=z1(t),i=O1(a);try{o.insertNode(i)}catch{return!1}const l=document.createRange();l.setStartAfter(i),l.collapse(!0),n.removeAllRanges(),n.addRange(l);const s=fi(t,!0);if(!s)return!1;const c=nf(s),d=e.trim()||"Footnote";return c.appendChild(of(a,d)),sf(t),lf(t,r),af(t),!0},W1=()=>(R1(),V1(),{name:"footnote",toolbar:[{label:"Footnote",command:"insertFootnote",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="14" height="2" rx="1"></rect><rect x="3" y="8" width="18" height="2" rx="1"></rect><rect x="3" y="12" width="16" height="2" rx="1"></rect><rect x="3" y="16" width="10" height="1.5" rx="0.75"></rect><text x="19" y="11" font-size="9" font-weight="600" fill="currentColor" font-family="system-ui, sans-serif">1</text></svg>'}],commands:{insertFootnote:()=>K1()},keymap:{}}),mi=()=>{const e=window.getSelection();if(e&&e.rangeCount>0){let r=e.getRangeAt(0).startContainer;for(;r&&r!==document.body;){if(r.nodeType===Node.ELEMENT_NODE){const n=r;if(n.getAttribute("contenteditable")==="true")return n}r=r.parentNode}}const t=document.activeElement;if(t){if(t.getAttribute("contenteditable")==="true")return t;const r=t.closest('[contenteditable="true"]');if(r)return r}return document.querySelector('[contenteditable="true"]')},jn='[data-theme="dark"], .dark, .editora-theme-dark',U1=()=>{const e=mi();if(e!=null&&e.closest(jn))return!0;const t=window.getSelection();if(t&&t.rangeCount>0){const n=t.getRangeAt(0).startContainer,o=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement;if(o!=null&&o.closest(jn))return!0}const r=document.activeElement;return r!=null&&r.closest(jn)?!0:document.body.matches(jn)||document.documentElement.matches(jn)},G1=[{value:"javascript",label:"JavaScript"},{value:"typescript",label:"TypeScript"},{value:"python",label:"Python"},{value:"java",label:"Java"},{value:"csharp",label:"C#"},{value:"cpp",label:"C++"},{value:"c",label:"C"},{value:"php",label:"PHP"},{value:"ruby",label:"Ruby"},{value:"go",label:"Go"},{value:"rust",label:"Rust"},{value:"swift",label:"Swift"},{value:"kotlin",label:"Kotlin"},{value:"html",label:"HTML"},{value:"css",label:"CSS"},{value:"scss",label:"SCSS"},{value:"json",label:"JSON"},{value:"xml",label:"XML"},{value:"yaml",label:"YAML"},{value:"markdown",label:"Markdown"},{value:"sql",label:"SQL"},{value:"bash",label:"Bash"},{value:"shell",label:"Shell"},{value:"plaintext",label:"Plain Text"}],cf=new Map;function df(e,t,r,n){const o=!!t,a=n||"javascript",i=r||"",l=U1(),s=l?{overlay:"rgba(0, 0, 0, 0.62)",dialogBg:"#1f2937",dialogBorder:"#4b5563",text:"#e2e8f0",mutedText:"#a8b5c8",headerFooterBg:"#222d3a",border:"#3b4657",fieldBg:"#111827",fieldBorder:"#4b5563",cancelBg:"#334155",cancelHover:"#475569",cancelText:"#e2e8f0",primaryBg:"#3b82f6",primaryHover:"#2563eb"}:{overlay:"rgba(0, 0, 0, 0.5)",dialogBg:"#ffffff",dialogBorder:"#e0e0e0",text:"#333333",mutedText:"#666666",headerFooterBg:"#ffffff",border:"#e0e0e0",fieldBg:"#ffffff",fieldBorder:"#dddddd",cancelBg:"#e5e7eb",cancelHover:"#d1d5db",cancelText:"#333333",primaryBg:"#2563eb",primaryHover:"#1d4ed8"},c=document.createElement("div");c.className="rte-code-sample-overlay",l&&c.classList.add("rte-theme-dark"),c.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${s.overlay};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 160ms ease-out;
  `;const d=document.createElement("div");d.className="rte-code-sample-dialog",d.style.cssText=`
    background: ${s.dialogBg};
    border: 1px solid ${s.dialogBorder};
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 700px;
    width: 90vw;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 200ms cubic-bezier(0.2, 0.9, 0.25, 1);
  `;const u=document.createElement("div");u.style.cssText=`
    padding: 20px;
    border-bottom: 1px solid ${s.border};
    background: ${s.headerFooterBg};
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,u.innerHTML=`
    <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: ${s.text};">
      ${o?"Edit Code Sample":"Insert Code Sample"}
    </h2>
    <button class="rte-code-close-btn" style="background: none; border: none; font-size: 28px; color: ${s.mutedText}; cursor: pointer; padding: 0; width: 32px; height: 32px;">×</button>
  `;const f=document.createElement("div");f.style.cssText=`
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  `;const p=document.createElement("div");p.style.marginBottom="20px",p.innerHTML=`
    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: ${s.text}; font-size: 14px;">Language</label>
    <select class="rte-code-language" style="
      width: 100%;
      padding: 10px 12px;
      border: 1px solid ${s.fieldBorder};
      border-radius: 4px;
      font-size: 14px;
      background-color: ${s.fieldBg};
      color: ${s.text};
      cursor: pointer;
    ">
      ${G1.map(w=>`
        <option value="${w.value}" ${w.value===a?"selected":""}>
          ${w.label}
        </option>
      `).join("")}
    </select>
  `;const g=document.createElement("div");g.style.marginBottom="20px",g.innerHTML=`
    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: ${s.text}; font-size: 14px;">Code</label>
    <textarea class="rte-code-textarea" spellcheck="false" placeholder="Paste or type your code here..." style="
      width: 100%;
      padding: 12px;
      border: 1px solid ${s.fieldBorder};
      border-radius: 4px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 13px;
      line-height: 1.5;
      resize: vertical;
      min-height: 250px;
      max-height: 400px;
      background-color: ${s.fieldBg};
      color: ${s.text};
      box-sizing: border-box;
    ">${i}</textarea>
    <div class="rte-code-error" style="color: #dc2626; font-size: 12px; margin-top: 6px; display: none;"></div>
  `;const m=document.createElement("div");m.style.cssText=`color: ${s.mutedText}; font-size: 12px; margin-top: 10px;`,m.innerHTML="💡 Tip: Press Ctrl+Enter (or Cmd+Enter on Mac) to save, or Escape to cancel",f.appendChild(p),f.appendChild(g),f.appendChild(m);const h=document.createElement("div");h.style.cssText=`
    padding: 20px;
    border-top: 1px solid ${s.border};
    background: ${s.headerFooterBg};
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  `,h.innerHTML=`
    <button class="rte-code-cancel-btn" style="
      padding: 10px 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      background: ${s.cancelBg};
      color: ${s.cancelText};
    ">Cancel</button>
    <button class="rte-code-save-btn" style="
      padding: 10px 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      background: ${s.primaryBg};
      color: #fff;
    ">${o?"Update Code Sample":"Insert Code Sample"}</button>
  `,d.appendChild(u),d.appendChild(f),d.appendChild(h),c.appendChild(d);const b=p.querySelector(".rte-code-language"),y=g.querySelector(".rte-code-textarea"),E=g.querySelector(".rte-code-error"),v=u.querySelector(".rte-code-close-btn"),C=h.querySelector(".rte-code-cancel-btn"),T=h.querySelector(".rte-code-save-btn");v.onmouseover=()=>{v.style.color="#f8fafc",v.style.background=l?"#334155":"#f0f0f0",v.style.borderRadius="4px"},v.onmouseout=()=>{v.style.color=s.mutedText,v.style.background="none"},C.onmouseover=()=>{C.style.background=s.cancelHover},C.onmouseout=()=>{C.style.background=s.cancelBg},T.onmouseover=()=>{T.style.background=s.primaryHover},T.onmouseout=()=>{T.style.background=s.primaryBg};const k=()=>{c.remove()},x=()=>{const w=y.value.trim();if(!w){E.textContent="⚠ Code cannot be empty",E.style.display="block";return}const I=b.value;e(w,I),k()};if(v.onclick=k,C.onclick=k,T.onclick=x,y.addEventListener("keydown",w=>{(w.ctrlKey||w.metaKey)&&w.key==="Enter"&&(w.preventDefault(),x()),w.key==="Escape"&&k()}),y.addEventListener("input",()=>{E.style.display="none"}),c.addEventListener("click",w=>{w.target===c&&k()}),!document.getElementById("rte-code-sample-animations")){const w=document.createElement("style");w.id="rte-code-sample-animations",w.textContent=`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `,document.head.appendChild(w)}return document.body.appendChild(c),setTimeout(()=>y.focus(),100),c}function Z1(){if(!mi())return;let t=null;const r=window.getSelection();r&&r.rangeCount>0&&(t=r.getRangeAt(0).cloneRange()),df((n,o)=>{const a=window.getSelection();if(t&&(a==null||a.removeAllRanges(),a==null||a.addRange(t)),!a||a.rangeCount===0)return;const i=mi();if(!i)return;const l=a.anchorNode;if(!l||!i.contains(l))return;const s=a.getRangeAt(0),c=`code-block-${Date.now()}`,d=document.createElement("pre");d.className="rte-code-block",d.id=c,d.setAttribute("data-type","code-block"),d.setAttribute("data-lang",o),d.setAttribute("data-code-id",c),d.setAttribute("contenteditable","false"),d.style.cssText=`
      display: block;
      position: relative;
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 12px;
      margin: 12px 0;
      overflow-x: auto;
      font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
      font-size: 13px;
      line-height: 1.5;
      color: #333;
      user-select: text;
      cursor: default;
    `;const u=document.createElement("code");u.className=`language-${o}`,u.style.cssText=`
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      color: inherit;
      white-space: pre;
      word-break: normal;
      display: block;
    `,u.textContent=n;const f=document.createElement("span");f.style.cssText=`
      position: absolute;
      top: 0;
      right: 0;
      background: #333;
      color: #fff;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: bold;
      border-radius: 0 6px 0 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      pointer-events: none;
    `,f.textContent=o;const p=document.createElement("button");p.className="rte-code-copy",p.textContent="Copy",p.style.cssText=`
      position: absolute;
      top: 8px;
      left: 8px;
      background: #fff;
      border: 1px solid #d0d0d0;
      border-radius: 3px;
      padding: 4px 8px;
      font-size: 11px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
    `,p.onclick=m=>{m.stopPropagation(),navigator.clipboard.writeText(n).then(()=>{p.textContent="✓ Copied!",setTimeout(()=>{p.textContent="Copy"},2e3)})},d.appendChild(f),d.appendChild(p),d.appendChild(u),d.addEventListener("mouseenter",()=>{p.style.opacity="1"}),d.addEventListener("mouseleave",()=>{p.style.opacity="0"}),d.addEventListener("dblclick",()=>{Y1(c)}),cf.set(c,{id:c,language:o,code:n}),s.insertNode(d);const g=document.createRange();g.setStartAfter(d),g.collapse(!0),a.removeAllRanges(),a.addRange(g)})}function Y1(e){const t=mi();if(!t)return;const r=t.querySelector(`#${e}`);if(!r)return;const n=cf.get(e);n&&df((o,a)=>{const i=r.querySelector("code");i&&(i.textContent=o,i.className=`language-${a}`);const l=r.querySelector("span");l&&(l.textContent=a),r.setAttribute("data-lang",a),n.language=a,n.code=o;const s=r.querySelector(".rte-code-copy");s&&(s.onclick=c=>{c.stopPropagation(),navigator.clipboard.writeText(o).then(()=>{s.textContent="✓ Copied!",setTimeout(()=>{s.textContent="Copy"},2e3)})})},e,n.code,n.language)}const X1=()=>({name:"codeSample",toolbar:[{label:"Insert Code",command:"insertCodeBlock",icon:'<svg width="24" height="26" focusable="false"><path d="M7.1 11a2.8 2.8 0 0 1-.8 2 2.8 2.8 0 0 1 .8 2v1.7c0 .3.1.6.4.8.2.3.5.4.8.4.3 0 .4.2.4.4v.8c0 .2-.1.4-.4.4-.7 0-1.4-.3-2-.8-.5-.6-.8-1.3-.8-2V15c0-.3-.1-.6-.4-.8-.2-.3-.5-.4-.8-.4a.4.4 0 0 1-.4-.4v-.8c0-.2.2-.4.4-.4.3 0 .6-.1.8-.4.3-.2.4-.5.4-.8V9.3c0-.7.3-1.4.8-2 .6-.5 1.3-.8 2-.8.3 0 .4.2.4.4v.8c0 .2-.1.4-.4.4-.3 0-.6.1-.8.4-.3.2-.4.5-.4.8V11Zm9.8 0V9.3c0-.3-.1-.6-.4-.8-.2-.3-.5-.4-.8-.4a.4.4 0 0 1-.4-.4V7c0-.2.1-.4.4-.4.7 0 1.4.3 2 .8.5.6.8 1.3.8 2V11c0 .3.1.6.4.8.2.3.5.4.8.4.2 0 .4.2.4.4v.8c0 .2-.2.4-.4.4-.3 0-.6.1-.8.4-.3.2-.4.5-.4.8v1.7c0 .7-.3 1.4-.8 2-.6.5-1.3.8-2 .8a.4.4 0 0 1-.4-.4v-.8c0-.2.1-.4.4-.4.3 0 .6-.1.8-.4.3-.2.4-.5.4-.8V15a2.8 2.8 0 0 1 .8-2 2.8 2.8 0 0 1-.8-2Zm-3.3-.4c0 .4-.1.8-.5 1.1-.3.3-.7.5-1.1.5-.4 0-.8-.2-1.1-.5-.4-.3-.5-.7-.5-1.1 0-.5.1-.9.5-1.2.3-.3.7-.4 1.1-.4.4 0 .8.1 1.1.4.4.3.5.7.5 1.2ZM12 13c.4 0 .8.1 1.1.5.4.3.5.7.5 1.1 0 1-.1 1.6-.5 2a3 3 0 0 1-1.1 1c-.4.3-.8.4-1.1.4a.5.5 0 0 1-.5-.5V17a3 3 0 0 0 1-.2l.6-.6c-.6 0-1-.2-1.3-.5-.2-.3-.3-.7-.3-1 0-.5.1-1 .5-1.2.3-.4.7-.5 1.1-.5Z" fill-rule="evenodd"></path></svg>',shortcut:"Mod-Shift-C"}],commands:{insertCodeBlock:(...e)=>(Z1(),!0)}}),Nn=".rte-content, .editora-content",J1='[data-theme="dark"], .dark, .editora-theme-dark',Q1={title:"Insert Merge Tag",searchPlaceholder:"Search merge tags...",emptyStateText:"No merge tags found",cancelText:"Cancel",insertText:"Insert",showPreview:!0};function e0(){return[{id:"USER",name:"User",tags:[{key:"first_name",label:"First Name",category:"User",preview:"John"},{key:"last_name",label:"Last Name",category:"User",preview:"Doe"},{key:"email",label:"Email",category:"User",preview:"john@example.com"},{key:"phone",label:"Phone",category:"User",preview:"+1-555-1234"},{key:"full_name",label:"Full Name",category:"User",preview:"John Doe"},{key:"username",label:"Username",category:"User",preview:"johndoe"}]},{id:"COMPANY",name:"Company",tags:[{key:"company_name",label:"Company Name",category:"Company",preview:"Acme Corp"},{key:"company_address",label:"Company Address",category:"Company",preview:"123 Main St"},{key:"company_phone",label:"Company Phone",category:"Company",preview:"+1-555-0000"},{key:"company_email",label:"Company Email",category:"Company",preview:"info@acme.com"}]},{id:"DATE",name:"Date",tags:[{key:"today",label:"Today",category:"Date",preview:new Date().toLocaleDateString()},{key:"tomorrow",label:"Tomorrow",category:"Date",preview:new Date(Date.now()+864e5).toLocaleDateString()},{key:"next_week",label:"Next Week",category:"Date",preview:new Date(Date.now()+6048e5).toLocaleDateString()}]},{id:"CUSTOM",name:"Custom",tags:[]}]}function tl(e,t){return e.trim().toUpperCase().replace(/[^A-Z0-9]+/g,"_").replace(/^_+|_+$/g,"")||`CATEGORY_${t+1}`}function t0(e,t){return(e.key||e.value||e.label).trim().toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")||`tag_${t+1}`}function r0(e){const t=(()=>{if(Array.isArray(e==null?void 0:e.categories)&&e.categories.length>0)return e.categories;if(Array.isArray(e==null?void 0:e.tags)&&e.tags.length>0){const i=new Map;return e.tags.forEach(l=>{const s=(l.category||"Custom").trim()||"Custom",c=i.get(s);c?c.push(l):i.set(s,[l])}),Array.from(i.entries()).map(([l,s],c)=>({id:tl(l,c),name:l,tags:s}))}return e0()})(),r={},n=[];if(t.forEach((i,l)=>{const s=tl(i.id||i.name,l);n.push(s),r[s]={name:i.name,tags:(Array.isArray(i.tags)?i.tags:[]).map((c,d)=>{const u=t0(c,d),f=(c.category||i.name).trim()||i.name;return{...c,key:u,category:f,categoryKey:s,searchIndex:`${c.label} ${u} ${f} ${c.description??""} ${c.value??""}`.toLowerCase()}})}}),n.length===0){const i="CUSTOM";n.push(i),r[i]={name:"Custom",tags:[]}}const o=e!=null&&e.defaultCategory?tl(e.defaultCategory,0):null,a=o&&n.includes(o)?o:n[0];return{categoriesByKey:r,categoryKeys:n,defaultCategory:a}}function n0(e){const t=e==null?void 0:e.tokenTemplate;return typeof t=="function"?r=>{var o;const n=t(r);return typeof n=="string"&&n.trim()?n:((o=r.value)==null?void 0:o.trim())||`{{ ${r.label} }}`}:typeof t=="string"&&t.trim()?r=>t.replace(/\{key\}/gi,r.key).replace(/\{label\}/gi,r.label).replace(/\{category\}/gi,r.category).replace(/\{value\}/gi,r.value??""):r=>{var n;return((n=r.value)==null?void 0:n.trim())||`{{ ${r.label} }}`}}function o0(e){return{catalog:r0(e),dialog:{...Q1,...(e==null?void 0:e.dialog)||{}},formatToken:n0(e)}}let Kc=!1,Wc=!1,Ir=null,_a=null,lo=null,Uc=!1;function uf(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function Hl(){if(Kc||typeof document>"u")return;Kc=!0;const e=document.createElement("style");e.id="merge-tag-plugin-styles",e.textContent=`
    .rte-merge-tag-overlay {
      --rte-mt-overlay-bg: rgba(15, 23, 36, 0.56);
      --rte-mt-dialog-bg: #ffffff;
      --rte-mt-dialog-text: #101828;
      --rte-mt-border: #d6dbe4;
      --rte-mt-subtle-bg: #f7f9fc;
      --rte-mt-subtle-hover: #eef2f7;
      --rte-mt-muted-text: #5f6b7d;
      --rte-mt-accent: #1976d2;
      --rte-mt-accent-strong: #1565c0;
      position: fixed;
      inset: 0;
      background-color: var(--rte-mt-overlay-bg);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 16px;
      box-sizing: border-box;
    }

    .rte-merge-tag-overlay.rte-ui-theme-dark {
      --rte-mt-overlay-bg: rgba(2, 8, 20, 0.72);
      --rte-mt-dialog-bg: #202938;
      --rte-mt-dialog-text: #e8effc;
      --rte-mt-border: #49566c;
      --rte-mt-subtle-bg: #2a3444;
      --rte-mt-subtle-hover: #344256;
      --rte-mt-muted-text: #a5b1c5;
      --rte-mt-accent: #58a6ff;
      --rte-mt-accent-strong: #4598f4;
    }

    .rte-merge-tag-dialog {
      background: var(--rte-mt-dialog-bg);
      color: var(--rte-mt-dialog-text);
      border: 1px solid var(--rte-mt-border);
      border-radius: 12px;
      box-shadow: 0 24px 48px rgba(10, 15, 24, 0.28);
      width: 500px;
      max-width: 90vw;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .rte-merge-tag-header { padding: 16px; border-bottom: 1px solid var(--rte-mt-border); display:flex; justify-content:space-between; align-items:center; }
    .rte-merge-tag-body {
      padding: 16px;
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .rte-merge-tag-input {
      width:100%;
      padding:11px 12px;
      border:1px solid var(--rte-mt-border);
      border-radius:6px;
      background:var(--rte-mt-subtle-bg);
      color:var(--rte-mt-dialog-text);
      font-size:14px;
      line-height:1.45;
      box-sizing:border-box;
    }
    .rte-merge-tag-tabs { display:flex; flex-wrap: wrap; gap:8px; margin: 12px 0; }
    .rte-merge-tag-tab { padding:8px 12px; background:none; border:none; cursor:pointer; color:var(--rte-mt-muted-text); border-bottom:3px solid transparent; }
    .rte-merge-tag-tab.active { color:var(--rte-mt-accent); border-bottom-color:var(--rte-mt-accent); }
    .rte-merge-tag-list {
      border:1px solid var(--rte-mt-border);
      border-radius:4px;
      flex: 1;
      min-height: 180px;
      max-height: 300px;
      overflow-y:auto;
      overflow-x:hidden;
      margin-bottom:12px;
      background:var(--rte-mt-subtle-bg);
    }
    .rte-merge-tag-item {
      padding:8px 12px;
      border-bottom:1px solid var(--rte-mt-border);
      cursor:pointer;
      transition:background-color 0.16s;
      color:var(--rte-mt-dialog-text);
      overflow-wrap:anywhere;
      word-break:break-word;
    }
    .rte-merge-tag-item:last-child { border-bottom: none; }
    .rte-merge-tag-item.selected, .rte-merge-tag-item:hover { background-color:var(--rte-mt-subtle-hover); }
    .rte-merge-tag-item-label { font-weight: 600; }
    .rte-merge-tag-item-preview { font-size: 12px; color: var(--rte-mt-muted-text); margin-top: 2px; overflow-wrap:anywhere; word-break:break-word; }
    .rte-merge-tag-empty { padding: 24px; text-align: center; color: var(--rte-mt-muted-text); }
    .rte-merge-tag-preview { padding:8px; background:var(--rte-mt-subtle-bg); border-radius:4px; font-family:monospace; font-size:12px; color:var(--rte-mt-dialog-text); overflow-wrap:anywhere; word-break:break-word; }
    .rte-merge-tag-footer { padding:12px 16px; border-top:1px solid var(--rte-mt-border); display:flex; gap:8px; justify-content:flex-end; background:var(--rte-mt-subtle-bg); }
    .rte-merge-tag-btn-primary { padding:8px 16px; border:none; border-radius:4px; background:var(--rte-mt-accent); color:#fff; cursor:pointer; }
    .rte-merge-tag-btn-primary:hover { background: var(--rte-mt-accent-strong); }
    .rte-merge-tag-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .rte-merge-tag-btn-secondary { padding:8px 16px; border:1px solid var(--rte-mt-border); border-radius:4px; background:var(--rte-mt-subtle-bg); color:var(--rte-mt-dialog-text); cursor:pointer; }

    .rte-merge-tag {
      display: inline-flex;
      align-items: center;
      white-space: nowrap;
      user-select: none;
      background-color: #e3f2fd;
      border: 1px solid #bbdefb;
      border-radius: 3px;
      padding: 1px 6px;
      margin: 0 2px;
      color: #1976d2;
      font-weight: 600;
      line-height: 1.3;
    }

    :is([data-theme="dark"], .dark, .editora-theme-dark) .rte-merge-tag {
      background: #223247;
      border-color: #3f5f84;
      color: #8dc4ff;
    }
  `,document.head.appendChild(e)}function Gc(){Wc||typeof document>"u"||(Wc=!0,document.addEventListener("focusin",e=>{const t=e.target,r=t==null?void 0:t.closest(Nn);r&&(Ir=r)}),document.addEventListener("selectionchange",()=>{const e=ff();e&&(Ir=e)}))}function ff(){const e=window.getSelection();if(!e||e.rangeCount===0)return null;const r=e.getRangeAt(0).startContainer,n=r.nodeType===Node.ELEMENT_NODE?r:r.parentElement;return(n==null?void 0:n.closest(Nn))||null}function mf(){const e=ff();if(e)return e;const t=document.activeElement,r=t==null?void 0:t.closest(Nn);return r||(Ir!=null&&Ir.isConnected?Ir:document.querySelector(Nn))}function a0(e){const t=e.parentNode;if(!t)return;const r=window.getSelection();if(!r)return;const n=document.createRange(),a=Array.from(t.childNodes).indexOf(e);a<0||(n.setStart(t,a),n.setEnd(t,a+1),r.removeAllRanges(),r.addRange(n))}function Zc(e,t){var r;e instanceof Text&&e.data.length!==0&&(t?(e.data.startsWith(" ")||e.data.startsWith(" "))&&e.deleteData(0,1):(e.data.endsWith(" ")||e.data.endsWith(" "))&&e.deleteData(e.data.length-1,1),e.data.length===0&&((r=e.parentNode)==null||r.removeChild(e)))}function Yc(e,t){const r=window.getSelection();if(!r)return;const n=document.createRange(),o=Math.max(0,Math.min(t,e.childNodes.length));n.setStart(e,o),n.collapse(!0),r.removeAllRanges(),r.addRange(n)}function i0(e,t){const r=e.closest(Nn),n=(r==null?void 0:r.innerHTML)??"",o=e.parentNode;if(!o)return!1;const i=Array.from(o.childNodes).indexOf(e);if(i<0)return!1;const l=e.previousSibling,s=e.nextSibling;return o.removeChild(e),t==="Backspace"?(Zc(s,!0),Yc(o,i)):(Zc(l,!1),Yc(o,i)),r&&(uf(r,n),r.dispatchEvent(new Event("input",{bubbles:!0}))),!0}function l0(e){if(e.collapsed||!(e.startContainer instanceof HTMLElement||e.startContainer instanceof Text)||e.startContainer!==e.endContainer||e.endOffset!==e.startOffset+1)return null;const t=e.startContainer;if(!(t instanceof Element||t instanceof DocumentFragment))return null;const r=t.childNodes[e.startOffset];return r instanceof HTMLElement&&r.classList.contains("rte-merge-tag")?r:null}function s0(e,t){if(!e.collapsed)return null;const{startContainer:r,startOffset:n}=e,o=a=>a instanceof HTMLElement&&a.classList.contains("rte-merge-tag")?a:null;if(r.nodeType===Node.ELEMENT_NODE){const a=r;return t==="Backspace"&&n>0?o(a.childNodes[n-1]||null):t==="Delete"?o(a.childNodes[n]||null):null}if(r.nodeType===Node.TEXT_NODE){const a=r;return t==="Backspace"?n===0?o(a.previousSibling):n===1&&(a.data[0]===" "||a.data[0]===" ")&&a.previousSibling instanceof HTMLElement&&a.previousSibling.classList.contains("rte-merge-tag")?a.previousSibling:null:n===a.data.length?o(a.nextSibling):null}return null}function Xc(){Uc||typeof document>"u"||(Uc=!0,document.addEventListener("click",e=>{const t=e.target,r=t==null?void 0:t.closest(".rte-merge-tag");if(!r)return;const n=r.closest(Nn);n&&(e.preventDefault(),e.stopPropagation(),n.focus({preventScroll:!0}),a0(r))}),document.addEventListener("keydown",e=>{if(e.key!=="Backspace"&&e.key!=="Delete")return;const t=window.getSelection();if(!t||t.rangeCount===0)return;const r=t.getRangeAt(0),n=mf();if(!n||!n.contains(r.commonAncestorContainer))return;let o=l0(r);o||(o=s0(r,e.key)),o&&(e.preventDefault(),e.stopPropagation(),i0(o,e.key))}))}function c0(e){return e?!!e.closest(J1):!1}function d0(){lo&&(lo(),lo=null),_a=null}function Jc(e){const t=document.createRange();return t.selectNodeContents(e),t.collapse(!1),t}function u0(e,t){const r=window.getSelection(),n=t?t.cloneRange():Jc(e),a=n.startContainer.isConnected&&n.endContainer.isConnected&&e.contains(n.commonAncestorContainer)?n:Jc(e);return r&&(r.removeAllRanges(),r.addRange(a)),a}function f0(e,t){const r=document.createElement("span");r.className="rte-merge-tag",r.setAttribute("contenteditable","false"),r.setAttribute("data-key",e.key),r.setAttribute("data-category",e.category),r.setAttribute("data-label",e.label),e.value&&r.setAttribute("data-value",e.value);const n=t(e);return r.setAttribute("data-token",n),r.setAttribute("aria-label",`Merge tag: ${e.label}`),r.textContent=n,r}function m0(e,t,r,n){const o=window.getSelection();if(!o)return!1;const a=e.innerHTML;e.focus({preventScroll:!0});const i=u0(e,t),l=i.startContainer.nodeType===Node.ELEMENT_NODE?i.startContainer:i.startContainer.parentElement,s=l==null?void 0:l.closest(".rte-merge-tag");s&&e.contains(s)&&(i.setStartAfter(s),i.setEndAfter(s));try{i.deleteContents();const c=f0(r,n),d=document.createTextNode(" "),u=document.createDocumentFragment();u.appendChild(c),u.appendChild(d),i.insertNode(u);const f=document.createRange();return f.setStartAfter(d),f.collapse(!0),o.removeAllRanges(),o.addRange(f),uf(e,a),e.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch(c){return console.error("Failed to insert merge tag:",c),!1}}function p0(e,t,r){var a;const n=((a=e.catalog.categoriesByKey[t])==null?void 0:a.tags)||[],o=r.trim().toLowerCase();return o?n.filter(i=>i.searchIndex.includes(o)):n}function g0(e,t){var or;d0(),Hl();const r={category:t.catalog.defaultCategory,searchTerm:"",filteredTags:((or=t.catalog.categoriesByKey[t.catalog.defaultCategory])==null?void 0:or.tags)||[],selectedIndex:0,savedRange:(()=>{const $=window.getSelection();if(!$||$.rangeCount===0)return null;const M=$.getRangeAt(0);return e.contains(M.commonAncestorContainer)?M.cloneRange():null})(),searchRaf:null},n=document.createElement("div");n.className="rte-merge-tag-overlay",n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true"),c0(e)&&n.classList.add("rte-ui-theme-dark");const o=document.createElement("div");o.className="rte-merge-tag-dialog";const a=document.createElement("div");a.className="rte-merge-tag-header";const i=document.createElement("h2");i.style.margin="0",i.style.fontSize="18px",i.style.fontWeight="700",i.textContent=t.dialog.title;const l=document.createElement("button");l.className="rte-merge-tag-close",l.setAttribute("aria-label","Close"),l.style.background="none",l.style.border="none",l.style.color="inherit",l.style.cursor="pointer",l.style.fontSize="20px",l.textContent="✕",a.appendChild(i),a.appendChild(l);const s=document.createElement("div");s.className="rte-merge-tag-body";const c=document.createElement("input");c.type="text",c.className="rte-merge-tag-input",c.placeholder=t.dialog.searchPlaceholder,c.setAttribute("aria-label","Search merge tags");const d=document.createElement("div");d.className="rte-merge-tag-tabs",t.catalog.categoryKeys.forEach($=>{var te;const M=document.createElement("button");M.type="button",M.className="rte-merge-tag-tab",M.setAttribute("data-category",$),M.textContent=((te=t.catalog.categoriesByKey[$])==null?void 0:te.name)||$,d.appendChild(M)});const u=document.createElement("div");u.className="rte-merge-tag-list";const f=document.createElement("div");f.className="rte-merge-tag-preview",s.appendChild(c),s.appendChild(d),s.appendChild(u),s.appendChild(f);const p=document.createElement("div");p.className="rte-merge-tag-footer";const g=document.createElement("button");g.type="button",g.className="rte-merge-tag-btn-secondary",g.textContent=t.dialog.cancelText;const m=document.createElement("button");m.type="button",m.className="rte-merge-tag-btn-primary",m.textContent=t.dialog.insertText,p.appendChild(g),p.appendChild(m),o.appendChild(a),o.appendChild(s),o.appendChild(p),n.appendChild(o),document.body.appendChild(n),_a=n;const h=()=>{d.querySelectorAll(".rte-merge-tag-tab").forEach(M=>{const te=M.dataset.category===r.category;M.classList.toggle("active",te)})},b=()=>{if(r.filteredTags.length===0){r.selectedIndex=-1;return}r.selectedIndex<0&&(r.selectedIndex=0),r.selectedIndex>=r.filteredTags.length&&(r.selectedIndex=r.filteredTags.length-1)},y=()=>{if(!t.dialog.showPreview){f.style.display="none",m.disabled=r.filteredTags.length===0;return}b();const $=r.selectedIndex>=0?r.filteredTags[r.selectedIndex]:null;if(!$){f.style.display="none",m.disabled=!0;return}f.style.display="block",f.textContent=`Preview: ${t.formatToken($)}`,m.disabled=!1},E=()=>{if(r.selectedIndex<0)return;const $=u.querySelector(`.rte-merge-tag-item[data-index="${r.selectedIndex}"]`);$==null||$.scrollIntoView({block:"nearest"})},v=()=>{const $=u.querySelector(".rte-merge-tag-item.selected");if($==null||$.classList.remove("selected"),r.selectedIndex>=0){const M=u.querySelector(`.rte-merge-tag-item[data-index="${r.selectedIndex}"]`);M==null||M.classList.add("selected")}y(),E()},C=()=>{if(r.filteredTags=p0(t,r.category,r.searchTerm),r.filteredTags.length>0&&r.selectedIndex<0&&(r.selectedIndex=0),b(),u.innerHTML="",r.filteredTags.length===0){const M=document.createElement("div");M.className="rte-merge-tag-empty",M.textContent=t.dialog.emptyStateText,u.appendChild(M),y();return}const $=document.createDocumentFragment();r.filteredTags.forEach((M,te)=>{const V=document.createElement("div");V.className="rte-merge-tag-item",V.setAttribute("data-index",String(te)),V.classList.toggle("selected",te===r.selectedIndex);const Pi=document.createElement("div");if(Pi.className="rte-merge-tag-item-label",Pi.textContent=M.label,V.appendChild(Pi),M.preview){const Oi=document.createElement("div");Oi.className="rte-merge-tag-item-preview",Oi.textContent=M.preview,V.appendChild(Oi)}$.appendChild(V)}),u.appendChild($),v()},T=()=>{r.searchRaf!==null&&cancelAnimationFrame(r.searchRaf),r.searchRaf=requestAnimationFrame(()=>{r.searchRaf=null,r.searchTerm=c.value,r.selectedIndex=0,C()})},k=()=>{r.searchRaf!==null&&(cancelAnimationFrame(r.searchRaf),r.searchRaf=null),n.remove(),_a===n&&(_a=null,lo=null)},x=()=>{if(b(),r.selectedIndex<0)return;const $=r.filteredTags[r.selectedIndex];m0(e,r.savedRange,$,t.formatToken)&&k()},w=$=>{const te=$.target.closest(".rte-merge-tag-tab");if(!te)return;const V=te.dataset.category;!V||!t.catalog.categoriesByKey[V]||(r.category=V,r.searchTerm="",c.value="",r.selectedIndex=0,h(),C())},I=$=>{const te=$.target.closest(".rte-merge-tag-item");if(!te)return;const V=Number(te.dataset.index||"-1");Number.isNaN(V)||V<0||V>=r.filteredTags.length||(r.selectedIndex=V,v())},z=$=>{const te=$.target.closest(".rte-merge-tag-item");if(!te)return;const V=Number(te.dataset.index||"-1");Number.isNaN(V)||V<0||V>=r.filteredTags.length||(r.selectedIndex=V,x())},He=$=>{if($.key==="Escape"){$.preventDefault(),k();return}if($.key==="ArrowDown"){if($.preventDefault(),r.filteredTags.length===0)return;r.selectedIndex=Math.min(r.filteredTags.length-1,r.selectedIndex+1),v();return}if($.key==="ArrowUp"){if($.preventDefault(),r.filteredTags.length===0)return;r.selectedIndex=Math.max(0,r.selectedIndex-1),v();return}$.key==="Enter"&&($.preventDefault(),x())},Ie=$=>{$.target===n&&k()};d.addEventListener("click",w),u.addEventListener("click",I),u.addEventListener("dblclick",z),c.addEventListener("input",T),c.addEventListener("keydown",He),n.addEventListener("click",Ie),o.addEventListener("keydown",He),l==null||l.addEventListener("click",k),g.addEventListener("click",k),m.addEventListener("click",x),lo=()=>{d.removeEventListener("click",w),u.removeEventListener("click",I),u.removeEventListener("dblclick",z),c.removeEventListener("input",T),c.removeEventListener("keydown",He),n.removeEventListener("click",Ie),o.removeEventListener("keydown",He),l==null||l.removeEventListener("click",k),g.removeEventListener("click",k),m.removeEventListener("click",x),r.searchRaf!==null&&(cancelAnimationFrame(r.searchRaf),r.searchRaf=null),n.remove()},h(),C(),setTimeout(()=>{c.focus()},0)}const b0=e=>({name:"mergeTag",config:e,init:()=>{Hl(),Gc(),Xc()},toolbar:[{label:"Merge Tag",command:"insertMergeTag",icon:"{{ }}"}],commands:{insertMergeTag:()=>{Hl(),Gc(),Xc();const t=mf();return t?(g0(t,o0(e)),!0):!1}}});let Q=null,mt=null,Dn=null,ee=null,Hn="",In="",so="insert",co=null,ft=null,Br=null;function pf(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function h0(e){if(!e)return null;let t=e.startContainer;for(;t&&t!==document.body;){if(t.nodeType===Node.ELEMENT_NODE){const r=t;if(r.getAttribute("contenteditable")==="true")return r}t=t.parentNode}return null}const y0=[{id:"formal-letter",name:"Formal Letter",category:"Letters",description:"Professional business letter template",html:`<p><strong>{{ Company Name }}</strong></p>
<p>{{ Today }}</p>
<p>Dear {{ first_name }} {{ last_name }},</p>
<p>I hope this letter finds you well. [Your letter content here]</p>
<p>Thank you for your time and consideration.</p>
<p>Sincerely,<br>Your Name</p>`},{id:"meeting-notes",name:"Meeting Notes",category:"Notes",description:"Template for meeting notes with attendees and action items",html:`<h2>Meeting Notes - {{ today }}</h2>
<p><strong>Attendees:</strong> [List attendees]</p>
<p><strong>Agenda:</strong></p>
<ul>
  <li>[Item 1]</li>
  <li>[Item 2]</li>
  <li>[Item 3]</li>
</ul>
<p><strong>Action Items:</strong></p>
<ul>
  <li>[Owner]: [Task] - [Due Date]</li>
</ul>
<p><strong>Next Meeting:</strong> [Date]</p>`},{id:"proposal",name:"Project Proposal",category:"Business",description:"Structured project proposal template",html:`<h1>Project Proposal</h1>
<h2>Executive Summary</h2>
<p>[Summary of the proposal]</p>
<h2>Objectives</h2>
<ul>
  <li>[Objective 1]</li>
  <li>[Objective 2]</li>
</ul>
<h2>Scope</h2>
<p>[Project scope details]</p>
<h2>Timeline</h2>
<p>[Project timeline]</p>
<h2>Budget</h2>
<p>[Budget details]</p>
<h2>Contact</h2>
<p>{{ first_name }} {{ last_name }}<br>{{ email }}<br>{{ phone }}</p>`},{id:"faq",name:"FAQ Template",category:"Documentation",description:"FAQ document structure",html:`<h1>Frequently Asked Questions</h1>
<h2>General Questions</h2>
<h3>Q: What is this about?</h3>
<p>A: [Answer here]</p>
<h3>Q: Who should use this?</h3>
<p>A: [Answer here]</p>
<h2>Technical Questions</h2>
<h3>Q: How do I get started?</h3>
<p>A: [Answer here]</p>
<h3>Q: What are the requirements?</h3>
<p>A: [Answer here]</p>`}];let xs=[...y0];const gf=()=>xs,bf=()=>{const e=new Set(xs.map(t=>t.category));return Array.from(e)},x0=e=>{const t=e.toLowerCase();return xs.filter(r=>{var n,o;return r.name.toLowerCase().includes(t)||((n=r.description)==null?void 0:n.toLowerCase().includes(t))||((o=r.tags)==null?void 0:o.some(a=>a.toLowerCase().includes(t)))})},hf=e=>Hf.sanitize(e,{ALLOWED_TAGS:["p","br","strong","em","u","h1","h2","h3","h4","ul","ol","li","blockquote","table","thead","tbody","tr","th","td","a","span"],ALLOWED_ATTR:["href","target","class","data-key","data-category"]});function v0(e){mt=document.createElement("div"),mt.className="rte-dialog-overlay",E0(e)&&mt.classList.add("rte-ui-theme-dark"),mt.addEventListener("click",()=>Jt()),Q=document.createElement("div"),Q.className="rte-dialog rte-template-dialog",Q.addEventListener("click",r=>r.stopPropagation());const t=bf();t.length>0&&!Hn&&(Hn=t[0]),No(),mt.appendChild(Q),document.body.appendChild(mt),k0(),A0()}function k0(){yf(),co=e=>{e.key==="Escape"&&(!mt||!Q||(e.preventDefault(),e.stopPropagation(),Jt()))},document.addEventListener("keydown",co,!0)}function yf(){co&&(document.removeEventListener("keydown",co,!0),co=null)}const w0='[data-theme="dark"], .dark, .editora-theme-dark',vs=()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return null;const t=e.anchorNode,r=t instanceof HTMLElement?t:t==null?void 0:t.parentElement;return(r==null?void 0:r.closest(".rte-content, .editora-content"))||null},E0=e=>{const t=e||vs();return t?!!t.closest(w0):!1};function ks(){const e=h0(Dn);if(e)return e;if(Br!=null&&Br.isConnected)return Br;const t=vs();return t||document.querySelector(".rte-content, .editora-content")}function No(){if(!Q)return;const e=bf(),t=ws();Q.innerHTML=`
    <div class="rte-dialog-header">
      <h2>Insert Template</h2>
      <button class="rte-dialog-close" aria-label="Close">✕</button>
    </div>

    <div class="rte-dialog-body">
      <!-- Search -->
      <input
        type="text"
        placeholder="Search templates..."
        value="${In}"
        class="rte-input rte-template-search"
        aria-label="Search templates"
      />

      <!-- Category Tabs -->
      <div class="rte-tabs">
        ${e.map(r=>`
          <button class="rte-tab ${Hn===r?"active":""}" data-category="${r}">
            ${r}
          </button>
        `).join("")}
      </div>

      <!-- Template List -->
      <div class="rte-template-list">
        ${t.length>0?t.map(r=>`
          <div
            class="rte-template-item ${(ee==null?void 0:ee.id)===r.id?"selected":""}"
            data-template-id="${r.id}"
          >
            <div class="template-name">${r.name}</div>
            ${r.description?`<div class="template-description">${r.description}</div>`:""}
          </div>
        `).join(""):'<div class="rte-empty-state">No templates found</div>'}
      </div>

      <!-- Preview -->
      ${ee?`
        <div class="rte-template-preview">
          <strong>Preview:</strong>
          <div class="template-preview-content">${ee.html}</div>
        </div>
      `:""}

      <!-- Insert Mode Toggle -->
      <div class="rte-insert-mode">
        <label>
          <input type="radio" name="insertMode" value="insert" ${so==="insert"?"checked":""} />
          Insert at cursor
        </label>
        <label>
          <input type="radio" name="insertMode" value="replace" ${so==="replace"?"checked":""} />
          Replace document
        </label>
      </div>
    </div>

    <div class="rte-dialog-footer">
      <button class="rte-button-secondary rte-cancel-btn">Cancel</button>
      <button class="rte-button-primary rte-insert-btn" ${ee?"":"disabled"}>
        ${so==="insert"?"Insert":"Replace"}
      </button>
    </div>
  `,S0()}function C0(){if(!Q)return;Q.innerHTML=`
    <div class="rte-dialog-header">
      <h2>Replace Document?</h2>
    </div>
    <div class="rte-dialog-body">
      <p>This will replace your current document content. Continue?</p>
    </div>
    <div class="rte-dialog-footer">
      <button class="rte-button-secondary rte-cancel-warning-btn">Cancel</button>
      <button class="rte-button-primary rte-confirm-replace-btn">Replace</button>
    </div>
  `;const e=Q.querySelector(".rte-cancel-warning-btn"),t=Q.querySelector(".rte-confirm-replace-btn");e==null||e.addEventListener("click",()=>No()),t==null||t.addEventListener("click",()=>T0())}function ws(){const e=gf();return In.trim()?x0(In):Hn?e.filter(t=>t.category===Hn):e}function S0(){if(!Q)return;const e=Q.querySelector(".rte-dialog-close");e==null||e.addEventListener("click",()=>Jt());const t=Q.querySelector(".rte-cancel-btn");t==null||t.addEventListener("click",()=>Jt());const r=Q.querySelector(".rte-insert-btn");r==null||r.addEventListener("click",()=>rl());const n=Q.querySelector(".rte-template-search");n==null||n.addEventListener("input",s=>{ft!==null&&cancelAnimationFrame(ft),In=s.target.value,ft=requestAnimationFrame(()=>{ft=null,Qc()})}),n==null||n.addEventListener("keydown",s=>{s.key==="Enter"&&ee?rl():s.key==="Escape"&&Jt()});const o=Q.querySelector(".rte-tabs");o==null||o.addEventListener("click",s=>{const d=s.target.closest(".rte-tab");if(!d)return;const u=d.getAttribute("data-category");u&&(Hn=u,In="",ft!==null&&(cancelAnimationFrame(ft),ft=null),Qc())});const a=Q.querySelector(".rte-template-list"),i=s=>{const d=s.target.closest(".rte-template-item");if(!d)return null;const u=d.getAttribute("data-template-id");return u&&gf().find(f=>f.id===u)||null};a==null||a.addEventListener("click",s=>{const c=i(s);c&&(ee=c,No())}),a==null||a.addEventListener("dblclick",s=>{const c=i(s);c&&(ee=c,rl())});const l=Q.querySelector(".rte-insert-mode");l==null||l.addEventListener("change",s=>{const c=s.target;!c||c.name!=="insertMode"||(so=c.value,No())})}function Qc(){const e=ws();e.length>0?(!ee||!e.find(t=>t.id===ee.id))&&(ee=e[0]):ee=null,No()}function rl(){var e;if(ee)if(so==="replace"){const t=ks();if((e=t==null?void 0:t.innerHTML)!=null&&e.trim()){C0();return}xf(ee),Jt()}else $0(ee),Jt()}function T0(){ee&&(xf(ee),Jt())}function $0(e){const t=window.getSelection();if(!t)return;const r=ks();if(!r)return;if(Dn)t.removeAllRanges(),t.addRange(Dn);else{const l=document.createRange();l.selectNodeContents(r),l.collapse(!1),t.removeAllRanges(),t.addRange(l)}if(t.rangeCount===0)return;const n=t.getRangeAt(0),o=(r==null?void 0:r.innerHTML)??"",a=document.createRange().createContextualFragment(hf(e.html));n.deleteContents(),n.insertNode(a);const i=document.createRange();i.setStartAfter(n.endContainer),i.collapse(!0),t.removeAllRanges(),t.addRange(i),r&&(pf(r,o),r.dispatchEvent(new Event("input",{bubbles:!0})))}function xf(e){const t=ks();if(t){const r=t.innerHTML;t.innerHTML=hf(e.html),pf(t,r),t.dispatchEvent(new Event("input",{bubbles:!0}))}}function Jt(){yf(),ft!==null&&(cancelAnimationFrame(ft),ft=null),mt&&(mt.remove(),mt=null),Q=null,Dn=null,In="",Br=null}function L0(e){const t=window.getSelection();t&&t.rangeCount>0?Dn=t.getRangeAt(0).cloneRange():Dn=null;const r=ws();r.length>0&&!ee&&(ee=r[0]);const n=(e==null?void 0:e.contentElement)instanceof HTMLElement?e.contentElement:vs();Br=n||null,v0(n)}function A0(){if(typeof document>"u")return;const e="template-plugin-dialog-styles";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
    .rte-dialog-overlay {
      --rte-tmpl-overlay-bg: rgba(15, 23, 36, 0.56);
      --rte-tmpl-dialog-bg: #fff;
      --rte-tmpl-dialog-text: #101828;
      --rte-tmpl-border: #d6dbe4;
      --rte-tmpl-subtle-bg: #f7f9fc;
      --rte-tmpl-subtle-hover: #eef2f7;
      --rte-tmpl-muted-text: #5f6b7d;
      --rte-tmpl-accent: #1976d2;
      --rte-tmpl-accent-strong: #1565c0;
      --rte-tmpl-ring: rgba(31, 117, 254, 0.18);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--rte-tmpl-overlay-bg);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 16px;
      box-sizing: border-box;
    }
    .rte-dialog-overlay.rte-ui-theme-dark {
      --rte-tmpl-overlay-bg: rgba(2, 8, 20, 0.72);
      --rte-tmpl-dialog-bg: #202938;
      --rte-tmpl-dialog-text: #e8effc;
      --rte-tmpl-border: #49566c;
      --rte-tmpl-subtle-bg: #2a3444;
      --rte-tmpl-subtle-hover: #344256;
      --rte-tmpl-muted-text: #a5b1c5;
      --rte-tmpl-accent: #58a6ff;
      --rte-tmpl-accent-strong: #4598f4;
      --rte-tmpl-ring: rgba(88, 166, 255, 0.22);
    }
    .rte-template-dialog {
      background: var(--rte-tmpl-dialog-bg);
      color: var(--rte-tmpl-dialog-text);
      border: 1px solid var(--rte-tmpl-border);
      border-radius: 12px;
      box-shadow: 0 24px 48px rgba(10, 15, 24, 0.28);
      width: 600px;
      max-height: 700px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .rte-dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--rte-tmpl-border);
      background: linear-gradient(180deg, rgba(127, 154, 195, 0.08) 0%, rgba(127, 154, 195, 0) 100%);
    }
    .rte-dialog-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--rte-tmpl-dialog-text);
    }
    .rte-dialog-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--rte-tmpl-muted-text);
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: background-color 0.16s ease, color 0.16s ease;
    }
    .rte-dialog-close:hover {
      background-color: var(--rte-tmpl-subtle-hover);
      color: var(--rte-tmpl-dialog-text);
    }
    .rte-dialog-body {
      padding: 20px;
      flex: 1;
      overflow-y: auto;
    }
    .rte-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--rte-tmpl-border);
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
      background: var(--rte-tmpl-subtle-bg);
      color: var(--rte-tmpl-dialog-text);
    }
    .rte-input:focus {
      outline: none;
      border-color: var(--rte-tmpl-accent);
    }
    .rte-tabs {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      border-bottom: 1px solid var(--rte-tmpl-border);
      padding-bottom: 8px;
    }
    .rte-tab {
      padding: 6px 12px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 14px;
      color: var(--rte-tmpl-muted-text);
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }
    .rte-tab:hover {
      color: var(--rte-tmpl-dialog-text);
    }
    .rte-tab.active {
      color: var(--rte-tmpl-accent);
      border-bottom-color: var(--rte-tmpl-accent);
      font-weight: 600;
    }
    .rte-template-list {
      border: 1px solid var(--rte-tmpl-border);
      border-radius: 4px;
      max-height: 250px;
      overflow-y: auto;
      margin: 12px 0;
      background: var(--rte-tmpl-subtle-bg);
    }
    .rte-template-item {
      padding: 12px;
      border-bottom: 1px solid var(--rte-tmpl-border);
      cursor: pointer;
      transition: background-color 0.2s;
      background: none;
    }
    .rte-template-item:last-child {
      border-bottom: none;
    }
    .rte-template-item:hover,
    .rte-template-item.selected {
      background-color: var(--rte-tmpl-subtle-hover);
    }
    .template-name {
      font-weight: 600;
      color: var(--rte-tmpl-dialog-text);
      margin-bottom: 4px;
    }
    .template-description {
      font-size: 12px;
      color: var(--rte-tmpl-muted-text);
    }
    .rte-template-preview {
      padding: 12px;
      background-color: var(--rte-tmpl-subtle-bg);
      border: 1px solid var(--rte-tmpl-border);
      border-radius: 4px;
      margin-top: 12px;
      max-height: 200px;
      overflow-y: auto;
    }
    .template-preview-content {
      font-size: 13px;
      line-height: 1.5;
      margin-top: 8px;
    }
    .template-preview-content * {
      margin: 4px 0;
    }
    .rte-insert-mode {
      margin-top: 12px;
      padding: 12px;
      background-color: var(--rte-tmpl-subtle-bg);
      border-radius: 4px;
      display: flex;
      gap: 16px;
    }
    .rte-insert-mode label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 14px;
    }
    .rte-insert-mode input {
      margin-right: 6px;
      cursor: pointer;
    }
    .rte-empty-state {
      padding: 40px;
      text-align: center;
      color: var(--rte-tmpl-muted-text);
      font-size: 14px;
    }
    .rte-dialog-footer {
      padding: 16px 20px;
      border-top: 1px solid var(--rte-tmpl-border);
      background: var(--rte-tmpl-subtle-bg);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .rte-button-primary {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      background-color: var(--rte-tmpl-accent);
      color: white;
      transition: all 0.2s;
    }
    .rte-button-primary:hover:not([disabled]) {
      background-color: var(--rte-tmpl-accent-strong);
    }
    .rte-button-primary[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .rte-button-secondary {
      padding: 8px 16px;
      border: 1px solid var(--rte-tmpl-border);
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      background-color: var(--rte-tmpl-subtle-bg);
      color: var(--rte-tmpl-dialog-text);
      transition: all 0.2s;
    }
    .rte-button-secondary:hover {
      background-color: var(--rte-tmpl-subtle-hover);
    }
  `,document.head.appendChild(t)}const M0=()=>({name:"template",toolbar:[{label:"Template",command:"insertTemplate",icon:'<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3 3V9H21V3H3ZM19 5H5V7H19V5Z" fill="#000000"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M3 11V21H11V11H3ZM9 13H5V19H9V13Z" fill="#000000"></path> <path d="M21 11H13V13H21V11Z" fill="#000000"></path> <path d="M13 15H21V17H13V15Z" fill="#000000"></path> <path d="M21 19H13V21H21V19Z" fill="#000000"></path> </g></svg>'}],commands:{insertTemplate:(e,t)=>(L0(t),!0)},keymap:{}}),Il=new WeakMap;let nr=null,ed=!1,td=0;const Bl="User";function qa(e){return td+=1,`${e}-${Date.now()}-${td}`}function pi(e){if(!e)return null;const t=e instanceof Element?e:e.parentElement;return t?t.closest("[data-editora-editor]")||t.closest(".rte-editor")||t.closest(".editora-editor"):null}function rd(e){const t=(e==null?void 0:e.editorElement)||(e==null?void 0:e.contentElement)||null;if(!(t instanceof HTMLElement))return;const r=t.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(t.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?t:null);r&&(nr=r)}function Di(e,t){return t.contains(e.commonAncestorContainer)}function R0(){if(typeof window<"u"){const n=window.__editoraCommandEditorRoot;if(n instanceof HTMLElement){const o=n.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(n.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?n:null);if(o)return nr=o,window.__editoraCommandEditorRoot=null,o}}const e=document.activeElement,t=e?pi(e):null;if(t)return t;const r=window.getSelection();if(r&&r.rangeCount>0){const n=pi(r.getRangeAt(0).commonAncestorContainer);if(n)return n}return nr}function N0(e){const t=Il.get(e);if(t)return t;const r={root:e,comments:new Map,panelVisible:!1,panelElement:null,expandedComments:new Set,replyTexts:{},savedSelection:null,newCommentText:"",selectionChangeListener:null};return Il.set(e,r),r}function Ht(){const e=R0();return e?(nr=e,N0(e)):null}function vf(e){const t=window.getSelection();if(!t||t.rangeCount===0||t.isCollapsed)return null;const r=t.getRangeAt(0);return Di(r,e)?r.cloneRange():null}function kf(e,t){if(!t.anchorId)return;const r=e.root.querySelector(`#${t.anchorId}`);r&&r.classList.toggle("rte-comment-anchor-resolved",t.resolved)}function va(e,t,r){const n=e.comments.get(t);if(!n||!n.anchorId)return;const o=e.root.querySelector(`#${n.anchorId}`);o&&o.classList.toggle("highlighted",r)}function D0(e,t,r){t.onclick=n=>{n.preventDefault(),n.stopPropagation(),nr=e.root,e.expandedComments.add(r),Do(e,!0),Ze(e)}}function H0(e){const t=e.parentNode;if(t){for(;e.firstChild;)t.insertBefore(e.firstChild,e);e.remove()}}function Do(e,t){if(e.panelVisible=t,t){K0(),I0(e),e.root.setAttribute("data-rte-comments-open","true"),e.panelElement&&(e.panelElement.classList.add("is-open"),e.panelElement.setAttribute("aria-hidden","false")),B0(e);return}e.root.removeAttribute("data-rte-comments-open"),P0(e),e.panelElement&&(e.panelElement.remove(),e.panelElement=null)}function I0(e){if(e.panelElement)return;const t=document.createElement("aside");t.className="rte-comments-panel",t.setAttribute("role","complementary"),t.setAttribute("aria-label","Comments"),t.setAttribute("aria-hidden","true"),window.getComputedStyle(e.root).position==="static"&&(e.root.style.position="relative"),e.root.appendChild(t),e.panelElement=t}function B0(e){e.selectionChangeListener||(e.selectionChangeListener=()=>{const t=window.getSelection();if(!t||t.rangeCount===0||t.isCollapsed)return;const r=t.getRangeAt(0);Di(r,e.root)&&(e.savedSelection=r.cloneRange(),nr=e.root)},document.addEventListener("selectionchange",e.selectionChangeListener))}function P0(e){e.selectionChangeListener&&(document.removeEventListener("selectionchange",e.selectionChangeListener),e.selectionChangeListener=null)}function O0(e){return Array.from(e.comments.values()).sort((t,r)=>r.createdAt.localeCompare(t.createdAt))}function nd(e){return new Date(e).toLocaleString()}function z0(e,t){const r=e.expandedComments.has(t.id),n=document.createElement("article");n.className=`rte-comment-item${t.resolved?" resolved":""}`,n.innerHTML=`
    <header class="rte-comment-header">
      <div class="rte-comment-meta">
        <strong class="rte-comment-author">${t.author}</strong>
        <time class="rte-comment-date">${nd(t.createdAt)}</time>
      </div>
      <button class="rte-comment-expand" type="button" aria-label="Toggle details">
        ${r?"▾":"▸"}
      </button>
    </header>
    <div class="rte-comment-text"></div>
    ${t.selectedText?`<blockquote class="rte-comment-selection">${t.selectedText}</blockquote>`:""}
    <section class="rte-comment-expanded${r?" show":""}"></section>
  `;const o=n.querySelector(".rte-comment-text");o&&(o.textContent=t.text);const a=n.querySelector(".rte-comment-expand");a==null||a.addEventListener("click",()=>{e.expandedComments.has(t.id)?e.expandedComments.delete(t.id):e.expandedComments.add(t.id),Ze(e)});const i=n.querySelector(".rte-comment-expanded");if(i&&r){if(t.replies.length>0){const c=document.createElement("div");c.className="rte-comment-replies",t.replies.forEach(d=>{const u=document.createElement("div");u.className="rte-comment-reply",u.innerHTML=`
          <div class="rte-comment-reply-header">
            <strong>${d.author}</strong>
            <time>${nd(d.createdAt)}</time>
          </div>
          <div class="rte-comment-reply-text"></div>
        `;const f=u.querySelector(".rte-comment-reply-text");f&&(f.textContent=d.text),c.appendChild(u)}),i.appendChild(c)}if(!t.resolved){const c=document.createElement("div");c.className="rte-comment-reply-composer",c.innerHTML=`
        <textarea class="rte-comment-reply-textarea" rows="2" placeholder="Reply..."></textarea>
        <button type="button" class="rte-comment-btn primary">Reply</button>
      `;const d=c.querySelector(".rte-comment-reply-textarea"),u=c.querySelector(".rte-comment-btn.primary");if(d&&u){d.value=e.replyTexts[t.id]||"";const f=()=>{const p=!!d.value.trim();u.disabled=!p};f(),d.addEventListener("input",()=>{e.replyTexts[t.id]=d.value,f()}),u.addEventListener("click",()=>{const p=d.value.trim();p&&(V0(t.id,Bl,p),e.replyTexts[t.id]="",Ze(e))})}i.appendChild(c)}const l=document.createElement("div");if(l.className="rte-comment-actions",t.anchorId){const c=document.createElement("button");c.type="button",c.className="rte-comment-btn ghost",c.textContent="Jump to text",c.onclick=()=>{const d=e.root.querySelector(`#${t.anchorId}`);d&&(d.scrollIntoView({behavior:"smooth",block:"center",inline:"nearest"}),va(e,t.id,!0),window.setTimeout(()=>va(e,t.id,!1),1200))},l.appendChild(c)}if(t.resolved){const c=document.createElement("button");c.type="button",c.className="rte-comment-btn ghost",c.textContent="Reopen",c.onclick=()=>j0(t.id),l.appendChild(c)}else{const c=document.createElement("button");c.type="button",c.className="rte-comment-btn success",c.textContent="Resolve",c.onclick=()=>q0(t.id,Bl),l.appendChild(c)}const s=document.createElement("button");s.type="button",s.className="rte-comment-btn danger",s.textContent="Delete",s.onclick=()=>F0(t.id),l.appendChild(s),i.appendChild(l)}return n.addEventListener("mouseenter",()=>va(e,t.id,!0)),n.addEventListener("mouseleave",()=>va(e,t.id,!1)),n}function Ze(e){const t=e||Ht();if(!(t!=null&&t.panelElement))return;const r=O0(t);t.panelElement.innerHTML=`
    <div class="rte-comments-header">
      <div>
        <h3>Comments (${r.length})</h3>
        <p>Select text and add comments, or add a general note.</p>
      </div>
      <button class="rte-comments-close" type="button" aria-label="Close comments panel">✕</button>
    </div>
    <div class="rte-comments-composer">
      <textarea class="new-comment-textarea" rows="3" placeholder="Add a comment..."></textarea>
      <div class="rte-comments-composer-actions">
        <button class="rte-comment-btn primary add-comment-btn" type="button">Add Comment</button>
      </div>
    </div>
    ${r.length===0?'<div class="rte-comments-empty">No comments yet.</div>':'<div class="rte-comments-list"></div>'}
  `;const n=t.panelElement.querySelector(".rte-comments-close");n==null||n.addEventListener("click",()=>{Do(t,!1)});const o=t.panelElement.querySelector(".new-comment-textarea"),a=t.panelElement.querySelector(".add-comment-btn");if(o&&a){o.value=t.newCommentText;const l=()=>{const s=!!o.value.trim();a.disabled=!s};l(),o.addEventListener("input",()=>{t.newCommentText=o.value,l()}),o.addEventListener("keydown",s=>{(s.ctrlKey||s.metaKey)&&s.key==="Enter"&&(s.preventDefault(),a.click())}),a.addEventListener("click",()=>{const s=o.value.trim();if(!s)return;const c=!!t.savedSelection;_0(Bl,s,!c),t.newCommentText="",Ze(t)})}const i=t.panelElement.querySelector(".rte-comments-list");i&&r.forEach(l=>{i.appendChild(z0(t,l))})}function od(){ed||(ed=!0,document.addEventListener("focusin",e=>{const t=pi(e.target);t&&(nr=t)}),document.addEventListener("selectionchange",()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return;const t=e.getRangeAt(0),r=pi(t.commonAncestorContainer);if(!r)return;nr=r;const n=Il.get(r);!n||e.isCollapsed||Di(t,r)&&(n.savedSelection=t.cloneRange())}),document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;const t=Ht();!t||!t.panelVisible||(e.preventDefault(),e.stopPropagation(),Do(t,!1))},!0))}function _0(e,t,r=!1){var u;const n=Ht();if(!n)return"";const o=t.trim();if(!o)return"";if(r){const f=qa("comment");return n.comments.set(f,{id:f,anchorId:"",selectedText:"",author:e,text:o,createdAt:new Date().toISOString(),resolved:!1,replies:[]}),Ze(n),f}const a=n.savedSelection||vf(n.root);if(!a||!Di(a,n.root))return"";const i=a.toString().trim();if(!i)return"";const l=qa("comment"),s=qa("comment-anchor"),c=document.createElement("span");c.id=s,c.className="rte-comment-anchor",c.setAttribute("data-comment-id",l),c.setAttribute("title","Commented text");try{const f=a.cloneRange(),p=f.extractContents();if(!((u=p.textContent)!=null&&u.trim()))return"";c.appendChild(p),f.insertNode(c)}catch{return""}D0(n,c,l),n.comments.set(l,{id:l,anchorId:s,selectedText:i,author:e,text:o,createdAt:new Date().toISOString(),resolved:!1,replies:[]}),n.savedSelection=null;const d=window.getSelection();return d==null||d.removeAllRanges(),Ze(n),l}function q0(e,t){const r=Ht();if(!r)return;const n=r.comments.get(e);n&&(n.resolved=!0,n.resolvedBy=t,n.resolvedAt=new Date().toISOString(),kf(r,n),Ze(r))}function j0(e){const t=Ht();if(!t)return;const r=t.comments.get(e);r&&(r.resolved=!1,r.resolvedBy=void 0,r.resolvedAt=void 0,kf(t,r),Ze(t))}function F0(e){const t=Ht();if(!t)return;const r=t.comments.get(e);if(r){if(r.anchorId){const n=t.root.querySelector(`#${r.anchorId}`);n&&H0(n)}t.comments.delete(e),t.expandedComments.delete(e),delete t.replyTexts[e],Ze(t)}}function V0(e,t,r){const n=Ht();if(!n)return;const o=n.comments.get(e);if(!o)return;const a=r.trim();a&&(o.replies.push({id:qa("reply"),author:t,text:a,createdAt:new Date().toISOString()}),Ze(n))}function K0(){if(document.getElementById("rte-comments-panel-styles"))return;const e=document.createElement("style");e.id="rte-comments-panel-styles",e.textContent=`
    .rte-comments-panel {
      --rte-comments-panel-width: min(360px, 42vw);
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: var(--rte-comments-panel-width);
      display: flex;
      flex-direction: column;
      background: var(--rte-color-bg-primary, #ffffff);
      color: var(--rte-color-text-primary, #111827);
      border-left: 1px solid var(--rte-color-border, #d1d5db);
      box-shadow: -12px 0 28px rgba(15, 23, 42, 0.2);
      transform: translateX(100%);
      opacity: 0;
      pointer-events: none;
      transition: transform 180ms ease, opacity 180ms ease;
      z-index: 55;
    }

    .rte-comments-panel.is-open {
      transform: translateX(0);
      opacity: 1;
      pointer-events: auto;
    }

    [data-rte-comments-open="true"] :is(.rte-toolbar, .editora-toolbar, .rte-content, .editora-content, .editora-statusbar, .editora-statusbar-container) {
      margin-right: var(--rte-comments-panel-width);
      transition: margin-right 180ms ease;
    }

    .rte-comments-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 14px 12px;
      border-bottom: 1px solid var(--rte-color-border-light, #e5e7eb);
      background: var(--rte-color-bg-secondary, #f8fafc);
    }

    .rte-comments-header h3 {
      margin: 0;
      font-size: 15px;
      line-height: 1.2;
    }

    .rte-comments-header p {
      margin: 6px 0 0;
      font-size: 12px;
      color: var(--rte-color-text-muted, #64748b);
    }

    .rte-comments-close {
      border: 1px solid var(--rte-color-border, #d1d5db);
      background: transparent;
      color: var(--rte-color-text-secondary, #475569);
      border-radius: 6px;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
    }

    .rte-comments-close:hover {
      background: var(--rte-color-bg-hover, #f1f5f9);
      color: var(--rte-color-text-primary, #0f172a);
    }

    .rte-comments-composer {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid var(--rte-color-border-light, #e5e7eb);
      background: var(--rte-color-bg-secondary, #f8fafc);
    }

    .new-comment-textarea,
    .rte-comment-reply-textarea {
      width: 100%;
      resize: vertical;
      min-height: 62px;
      font-family: inherit;
      font-size: 13px;
      line-height: 1.35;
      border: 1px solid var(--rte-color-border, #d1d5db);
      border-radius: 8px;
      background: var(--rte-color-bg-primary, #ffffff);
      color: var(--rte-color-text-primary, #0f172a);
      padding: 8px 10px;
      outline: none;
    }

    .new-comment-textarea:focus,
    .rte-comment-reply-textarea:focus {
      border-color: var(--rte-color-border-focus, #2563eb);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--rte-color-border-focus, #2563eb) 20%, transparent);
    }

    .rte-comments-composer-actions {
      display: flex;
      justify-content: flex-end;
    }

    .rte-comments-list {
      flex: 1;
      overflow: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .rte-comments-empty {
      padding: 18px 14px;
      color: var(--rte-color-text-muted, #64748b);
      font-size: 13px;
    }

    .rte-comment-item {
      border: 1px solid var(--rte-color-border-light, #e5e7eb);
      border-radius: 10px;
      background: var(--rte-color-bg-primary, #ffffff);
      padding: 10px;
    }

    .rte-comment-item.resolved {
      opacity: 0.74;
    }

    .rte-comment-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .rte-comment-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .rte-comment-author {
      font-size: 13px;
      color: var(--rte-color-text-primary, #0f172a);
    }

    .rte-comment-date {
      font-size: 11px;
      color: var(--rte-color-text-muted, #64748b);
    }

    .rte-comment-expand {
      border: none;
      background: transparent;
      cursor: pointer;
      color: var(--rte-color-text-secondary, #475569);
      font-size: 16px;
      line-height: 1;
      padding: 0;
    }

    .rte-comment-text {
      margin-top: 8px;
      font-size: 13px;
      line-height: 1.45;
      color: var(--rte-color-text-primary, #0f172a);
      white-space: pre-wrap;
      word-break: break-word;
    }

    .rte-comment-selection {
      margin: 8px 0 0;
      border-left: 3px solid var(--rte-color-primary, #2563eb);
      background: var(--rte-color-bg-secondary, #f8fafc);
      color: var(--rte-color-text-secondary, #475569);
      padding: 6px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-style: italic;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .rte-comment-expanded {
      display: none;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid var(--rte-color-border-light, #e5e7eb);
    }

    .rte-comment-expanded.show {
      display: block;
    }

    .rte-comment-replies {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 10px;
    }

    .rte-comment-reply {
      border: 1px solid var(--rte-color-border-light, #e5e7eb);
      border-radius: 8px;
      padding: 8px;
      background: var(--rte-color-bg-secondary, #f8fafc);
    }

    .rte-comment-reply-header {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 4px;
      font-size: 11px;
      color: var(--rte-color-text-muted, #64748b);
    }

    .rte-comment-reply-text {
      font-size: 12px;
      color: var(--rte-color-text-secondary, #334155);
      white-space: pre-wrap;
      word-break: break-word;
    }

    .rte-comment-reply-composer {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 10px;
    }

    .rte-comment-actions {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 6px;
    }

    .rte-comment-btn {
      border: 1px solid var(--rte-color-border, #d1d5db);
      border-radius: 7px;
      padding: 5px 9px;
      font-size: 12px;
      cursor: pointer;
      background: var(--rte-color-bg-primary, #ffffff);
      color: var(--rte-color-text-secondary, #334155);
    }

    .rte-comment-btn:hover {
      background: var(--rte-color-bg-hover, #f1f5f9);
      color: var(--rte-color-text-primary, #0f172a);
    }

    .rte-comment-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .rte-comment-btn.primary {
      border-color: var(--rte-color-primary, #2563eb);
      background: var(--rte-color-primary, #2563eb);
      color: var(--rte-color-text-inverse, #ffffff);
    }

    .rte-comment-btn.primary:hover {
      background: var(--rte-color-primary-hover, #1d4ed8);
      border-color: var(--rte-color-primary-hover, #1d4ed8);
      color: var(--rte-color-text-inverse, #ffffff);
    }

    .rte-comment-btn.success {
      border-color: color-mix(in srgb, var(--rte-color-success, #15803d) 60%, transparent);
      color: var(--rte-color-success, #15803d);
    }

    .rte-comment-btn.danger {
      border-color: color-mix(in srgb, var(--rte-color-danger, #b91c1c) 60%, transparent);
      color: var(--rte-color-danger, #b91c1c);
    }

    .rte-comment-anchor {
      background: rgba(250, 204, 21, 0.34);
      border-bottom: 2px solid rgba(217, 119, 6, 0.75);
      border-radius: 2px;
      cursor: pointer;
      transition: outline-color 120ms ease, box-shadow 120ms ease;
    }

    .rte-comment-anchor.rte-comment-anchor-resolved {
      background: rgba(148, 163, 184, 0.2);
      border-bottom-color: rgba(100, 116, 139, 0.6);
    }

    .rte-comment-anchor.highlighted {
      outline: 2px solid var(--rte-color-primary, #2563eb);
      outline-offset: 2px;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-comments-panel {
      box-shadow: -14px 0 30px rgba(0, 0, 0, 0.45);
    }

    @media (max-width: 900px) {
      .rte-comments-panel {
        --rte-comments-panel-width: min(420px, 100%);
      }

      [data-rte-comments-open="true"] :is(.rte-toolbar, .editora-toolbar, .rte-content, .editora-content, .editora-statusbar, .editora-statusbar-container) {
        margin-right: 0;
      }
    }
  `,document.head.appendChild(e)}const W0=()=>({name:"comments",toolbar:[{label:"Add Comment",command:"addComment",type:"button",icon:'<svg fill="#000000" width="24px" height="24px" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;}</style></defs><title>add-comment</title><path d="M17.74,30,16,29l4-7h6a2,2,0,0,0,2-2V8a2,2,0,0,0-2-2H6A2,2,0,0,0,4,8V20a2,2,0,0,0,2,2h9v2H6a4,4,0,0,1-4-4V8A4,4,0,0,1,6,4H26a4,4,0,0,1,4,4V20a4,4,0,0,1-4,4H21.16Z"></path><polygon points="17 9 15 9 15 13 11 13 11 15 15 15 15 19 17 19 17 15 21 15 21 13 17 13 17 9"></polygon><rect class="cls-1" width="32" height="32"></rect></svg>'},{label:"Show / Hide Comments",command:"toggleComments",type:"button",icon:'<svg width="24px" height="24px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 1H4V11H8L10 13L12 11H16V1Z" fill="#000000"></path><path d="M2 5V13H7.17157L8.70711 14.5355L7.29289 15.9497L6.34315 15H0V5H2Z" fill="#000000"></path></svg>'}],commands:{addComment:(e,t)=>{var o;rd(t),od();const r=Ht();if(!r)return!1;if(r.savedSelection=vf(r.root),r.savedSelection){const a=window.getSelection();a==null||a.removeAllRanges()}Do(r,!0),Ze(r);const n=(o=r.panelElement)==null?void 0:o.querySelector(".new-comment-textarea");return n==null||n.focus({preventScroll:!0}),!0},toggleComments:(e,t)=>{rd(t),od();const r=Ht();return r?(Do(r,!r.panelVisible),r.panelVisible&&Ze(r),!0):!1}},keymap:{}}),wf=new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","is","are","be","was","were","have","has","had","do","does","did","will","would","could","should","may","might","must","can","this","that","these","those","what","which","who","whom","where","when","why","how","all","each","every","both","few","more","most","other","same","such","no","nor","not","only","own","so","than","too","very","just","as","if","because","while","although","though","it","its","their","them","they","you","he","she","we","me","him","her","us","our","i","my","your","his","hers","ours","yours","theirs","editor","document","text","word","paragraph","line","page","content","hello","world","test","example","sample","demo","lorem","ipsum"]),Hi=new Set,Ii=new Set;let Qt=!1,rt=null,xn=null,de=null,xe=null,uo=null,gi=!1,Tt=null,ad=!1,vn=0,kn=null;const Ef={characterData:!0,childList:!0,subtree:!0},id="rte-spellcheck-styles",ld="__editoraCommandEditorRoot";function U0(e){var a;const t=(e==null?void 0:e.contentElement)||(e==null?void 0:e.editorElement)||null;if(!(t instanceof HTMLElement))return;const r=t.getAttribute("contenteditable")==="true"?t:(a=t.querySelector)==null?void 0:a.call(t,'[contenteditable="true"]');if(r instanceof HTMLElement){xe=r,Tt=r;return}const n=t.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(t.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?t:null),o=Es(n);o&&(xe=o,Tt=o)}function Cf(){if(typeof window>"u")return null;const e=window[ld];if(!(e instanceof HTMLElement))return null;window[ld]=null;const t=e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(e.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?e:null);if(t){const n=Es(t);if(n)return n;if(t.getAttribute("contenteditable")==="true")return t}if(e.getAttribute("contenteditable")==="true")return e;const r=e.closest('[contenteditable="true"]');return r instanceof HTMLElement?r:null}function Pl(){let e=document.getElementById(id);e||(e=document.createElement("style"),e.id=id,document.head.appendChild(e)),e.textContent=`
    .rte-spell-check-panel {
      position: absolute;
      top: 12px;
      right: 12px;
      width: min(360px, calc(100% - 24px));
      max-height: min(560px, calc(100% - 24px));
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border-radius: 12px;
      border: 1px solid #d7dbe3;
      background: #ffffff;
      color: #1f2937;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
      z-index: 1200;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .rte-spell-check-panel,
    .rte-spell-check-panel * {
      box-sizing: border-box;
    }

    .editora-theme-dark .rte-spell-check-panel {
      border-color: #4b5563;
      background: #1f2937;
      color: #e5e7eb;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
    }

    .rte-spellcheck-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 16px 12px;
      border-bottom: 1px solid #eceff5;
    }

    .editora-theme-dark .rte-spellcheck-header {
      border-bottom-color: #374151;
    }

    .rte-spellcheck-title {
      margin: 0;
      font-size: 15px;
      font-weight: 650;
    }

    .rte-spellcheck-subtitle {
      margin: 2px 0 0;
      font-size: 12px;
      color: #64748b;
    }

    .editora-theme-dark .rte-spellcheck-subtitle {
      color: #9ca3af;
    }

    .rte-spellcheck-close {
      appearance: none;
      border: none;
      background: transparent;
      font-size: 20px;
      line-height: 1;
      color: #6b7280;
      cursor: pointer;
      border-radius: 8px;
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
    }

    .rte-spellcheck-close:hover {
      background: rgba(15, 23, 42, 0.06);
      color: #0f172a;
    }

    .editora-theme-dark .rte-spellcheck-close {
      color: #9ca3af;
    }

    .editora-theme-dark .rte-spellcheck-close:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #f3f4f6;
    }

    .rte-spellcheck-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      padding: 12px 16px;
      border-bottom: 1px solid #eceff5;
    }

    .editora-theme-dark .rte-spellcheck-stats {
      border-bottom-color: #374151;
    }

    .rte-spellcheck-stat {
      border-radius: 10px;
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      padding: 8px 10px;
      display: grid;
      gap: 2px;
    }

    .editora-theme-dark .rte-spellcheck-stat {
      background: #111827;
      border-color: #374151;
    }

    .rte-spellcheck-stat-label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .editora-theme-dark .rte-spellcheck-stat-label {
      color: #9ca3af;
    }

    .rte-spellcheck-stat-value {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
    }

    .editora-theme-dark .rte-spellcheck-stat-value {
      color: #f3f4f6;
    }

    .rte-spellcheck-list {
      flex: 1 1 auto;
      min-height: 0;
      max-height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      padding: 10px 12px 12px;
      display: grid;
      gap: 8px;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f5f9;
    }

    .rte-spellcheck-list::-webkit-scrollbar {
      width: 10px;
    }

    .rte-spellcheck-list::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 999px;
    }

    .rte-spellcheck-list::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 999px;
      border: 2px solid #f1f5f9;
    }

    .rte-spellcheck-list::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .rte-spellcheck-empty {
      padding: 18px 14px;
      text-align: center;
      color: #64748b;
      font-size: 13px;
      border-radius: 10px;
      border: 1px dashed #d1d5db;
      background: #f8fafc;
    }

    .editora-theme-dark .rte-spellcheck-empty {
      color: #9ca3af;
      border-color: #4b5563;
      background: #111827;
    }

    .editora-theme-dark .rte-spellcheck-list {
      scrollbar-color: #4b5563 #1f2937;
    }

    .editora-theme-dark .rte-spellcheck-list::-webkit-scrollbar-track {
      background: #1f2937;
    }

    .editora-theme-dark .rte-spellcheck-list::-webkit-scrollbar-thumb {
      background: #4b5563;
      border-color: #1f2937;
    }

    .editora-theme-dark .rte-spellcheck-list::-webkit-scrollbar-thumb:hover {
      background: #64748b;
    }

    .rte-spellcheck-item {
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      background: #f8fafc;
      overflow: visible;
    }

    .editora-theme-dark .rte-spellcheck-item {
      border-color: #4b5563;
      background: #111827;
    }

    .rte-spell-check-panel .rte-spellcheck-word-header {
      all: unset;
      width: 100%;
      padding: 10px 11px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      cursor: pointer;
      text-align: left;
      color: #111827;
      font-size: 14px;
      line-height: 1.35;
      user-select: none;
      opacity: 1;
      visibility: visible;
    }

    .rte-spell-check-panel .rte-spellcheck-word {
      font-weight: 700;
      color: #c62828;
      word-break: break-word;
      flex: 1;
      opacity: 1;
      visibility: visible;
    }

    .editora-theme-dark .rte-spell-check-panel .rte-spellcheck-word-header {
      color: #e5e7eb !important;
    }

    .editora-theme-dark .rte-spell-check-panel .rte-spellcheck-word {
      color: #f87171 !important;
    }

    .rte-spell-check-panel .rte-spellcheck-caret {
      color: #64748b;
      font-size: 12px;
      min-width: 12px;
      text-align: right;
      opacity: 1;
      visibility: visible;
    }

    .rte-spell-check-panel .rte-spellcheck-suggestions {
      display: none;
      border-top: 1px solid #e5e7eb;
      padding: 9px 11px 11px;
      color: #334155;
      font-size: 12px;
      line-height: 1.4;
      opacity: 1;
      visibility: visible;
    }

    .editora-theme-dark .rte-spell-check-panel .rte-spellcheck-suggestions {
      border-top-color: #374151;
      color: #d1d5db !important;
    }

    .rte-spell-check-panel .rte-spellcheck-suggestions.show {
      display: block;
    }

    .rte-spell-check-panel .rte-spellcheck-actions {
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .rte-spell-check-panel .rte-spellcheck-btn {
      all: unset;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      background: #fff;
      color: #1f2937;
      font-size: 12px;
      font-weight: 550;
      padding: 5px 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      opacity: 1;
      visibility: visible;
    }

    .rte-spell-check-panel .rte-spellcheck-btn:hover {
      background: #f3f4f6;
    }

    .rte-spell-check-panel .rte-spellcheck-btn.primary {
      border-color: #2563eb;
      background: #2563eb;
      color: #fff;
    }

    .rte-spell-check-panel .rte-spellcheck-btn.primary:hover {
      background: #1d4ed8;
    }

    .editora-theme-dark .rte-spell-check-panel .rte-spellcheck-btn {
      border-color: #4b5563;
      background: #1f2937;
      color: #f3f4f6 !important;
    }

    .editora-theme-dark .rte-spell-check-panel .rte-spellcheck-btn:hover {
      background: #374151;
    }

    .editora-theme-dark .rte-spell-check-panel .rte-spellcheck-btn.primary {
      border-color: #60a5fa;
      background: #2563eb;
      color: #fff;
    }

    .rte-spellcheck-menu {
      position: fixed;
      background: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 10px;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.2);
      z-index: 1300;
      padding: 6px 0;
      min-width: 180px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      color: #111827;
    }

    .rte-spellcheck-menu-item {
      padding: 8px 14px;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .rte-spellcheck-menu-item:hover {
      background: #f3f4f6;
    }

    .rte-spellcheck-menu-item.meta {
      color: #64748b;
    }

    .rte-spellcheck-menu-item.positive {
      color: #1d4ed8;
    }

    .editora-theme-dark .rte-spellcheck-menu {
      background: #1f2937;
      border-color: #4b5563;
      color: #e5e7eb;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
    }

    .editora-theme-dark .rte-spellcheck-menu-item:hover {
      background: #374151;
    }

    .editora-theme-dark .rte-spellcheck-menu-item.meta {
      color: #9ca3af;
    }

    .editora-theme-dark .rte-spellcheck-menu-item.positive {
      color: #93c5fd;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spell-check-panel {
      border-color: #4b5563;
      background: #1f2937;
      color: #e5e7eb;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-header {
      border-bottom-color: #374151;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-subtitle {
      color: #9ca3af;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-item {
      border-color: #4b5563;
      background: #111827;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-list {
      scrollbar-color: #4b5563 #1f2937;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-list::-webkit-scrollbar-track {
      background: #1f2937;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-list::-webkit-scrollbar-thumb {
      background: #4b5563;
      border-color: #1f2937;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-list::-webkit-scrollbar-thumb:hover {
      background: #64748b;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spell-check-panel .rte-spellcheck-word-header {
      color: #e5e7eb !important;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spell-check-panel .rte-spellcheck-word {
      color: #f87171 !important;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spell-check-panel .rte-spellcheck-suggestions {
      border-top-color: #374151;
      color: #d1d5db !important;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spell-check-panel .rte-spellcheck-btn {
      border-color: #4b5563;
      background: #1f2937;
      color: #f3f4f6 !important;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spell-check-panel .rte-spellcheck-btn:hover {
      background: #374151;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spell-check-panel .rte-spellcheck-btn.primary {
      border-color: #60a5fa;
      background: #2563eb;
      color: #fff;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-menu {
      background: #1f2937;
      border-color: #4b5563;
      color: #e5e7eb;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-menu-item:hover {
      background: #374151;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-menu-item.meta {
      color: #9ca3af;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-menu-item.positive {
      color: #93c5fd;
    }
  `}function Tr(){if(xe&&document.contains(xe))return xe;const e=Tf();return e&&(xe=e),e}function Sf(e){if(!e)return;const t=e.nodeType===Node.ELEMENT_NODE?e:e.parentElement,r=t==null?void 0:t.closest('[contenteditable="true"]');r&&(xe=r)}function Es(e){if(!e)return null;const t=e.querySelector('[contenteditable="true"]');return t instanceof HTMLElement?t:null}function G0(){if(ad)return;const e=t=>{const r=t.target;if(!r)return;const n=r.closest('.editora-toolbar-button[data-command="toggleSpellCheck"], .rte-toolbar-button[data-command="toggleSpellCheck"]');if(!n)return;const o=n.closest("[data-editora-editor]"),a=Es(o);a&&(Tt=a,xe=a)};document.addEventListener("pointerdown",e,!0),ad=!0}function Z0(){const e=Cf();if(e&&document.contains(e))return xe=e,Tt=null,e;if(Tt&&document.contains(Tt)){const t=Tt;return Tt=null,xe=t,t}return Tf()}function Y0(){vn+=1,vn===1&&rt&&rt.disconnect()}function X0(){if(vn===0||(vn-=1,vn>0)||!rt)return;const e=Tr();e&&rt.observe(e,Ef)}function Cs(e){Y0();try{return e()}finally{X0()}}const J0=()=>{try{const e=localStorage.getItem("rte-custom-dictionary");e&&JSON.parse(e).forEach(r=>Hi.add(r.toLowerCase()))}catch(e){console.warn("Failed to load custom dictionary:",e)}},Q0=()=>{try{const e=Array.from(Hi);localStorage.setItem("rte-custom-dictionary",JSON.stringify(e))}catch(e){console.warn("Failed to save custom dictionary:",e)}};function ex(e,t){const r=[];for(let n=0;n<=t.length;n++)r[n]=[n];for(let n=0;n<=e.length;n++)r[0][n]=n;for(let n=1;n<=t.length;n++)for(let o=1;o<=e.length;o++)t.charAt(n-1)===e.charAt(o-1)?r[n][o]=r[n-1][o-1]:r[n][o]=Math.min(r[n-1][o-1]+1,r[n][o-1]+1,r[n-1][o]+1);return r[t.length][e.length]}function tx(e){const t=e.toLowerCase();return wf.has(t)||Hi.has(t)||Ii.has(t)}function rx(e,t=5){const r=e.toLowerCase(),o=Array.from(wf).map(a=>({word:a,distance:ex(r,a)}));return o.sort((a,i)=>a.distance-i.distance),o.filter(a=>a.distance<=3).slice(0,t).map(a=>a.word)}function nx(e){if(e.nodeType!==Node.ELEMENT_NODE)return!1;const t=e;return!!(t.closest('code, pre, [contenteditable="false"], .rte-widget, .rte-template, .rte-comment, .rte-merge-tag')||t.hasAttribute("data-comment-id")||t.hasAttribute("data-template")||t.hasAttribute("data-merge-tag"))}function ox(e){const t=[],r=/([\p{L}\p{M}\p{N}\p{Emoji_Presentation}\u200d'-]+|[\uD800-\uDBFF][\uDC00-\uDFFF])/gu;let n;for(;(n=r.exec(e.data))!==null;){const o=n[0],a=n.index,i=a+o.length;/https?:\/\//.test(o)||/@/.test(o)||/\{\{.*\}\}/.test(o)||/^\d+$/.test(o)||tx(o)||/[a-z][A-Z]/.test(o)||/-/.test(o)||o[0]===o[0].toUpperCase()&&o.length>1||t.push({id:`${o}-${a}`,node:e,startOffset:a,endOffset:i,word:o,suggestions:rx(o),ignored:!1})}return t}const Tf=()=>{const e=Cf();if(e&&document.contains(e))return xe=e,e;const t=window.getSelection();if(t&&t.rangeCount>0){let n=t.getRangeAt(0).startContainer;for(;n&&n!==document.body;){if(n.nodeType===Node.ELEMENT_NODE){const o=n;if(o.getAttribute("contenteditable")==="true")return o}n=n.parentNode}}const r=document.activeElement;if(r){if(r.getAttribute("contenteditable")==="true")return r;const n=r.closest('[contenteditable="true"]');if(n)return n;const o=r.closest("[data-editora-editor]");if(o){const a=o.querySelector('[contenteditable="true"]');if(a)return a}}return document.querySelector('[contenteditable="true"]')};function Ss(){const e=Tr();if(!e)return[];const t=[],r=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,{acceptNode:o=>{var a;return!((a=o.textContent)!=null&&a.trim())||o.parentNode&&nx(o.parentNode)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});let n=r.nextNode();for(;n;)t.push(...ox(n)),n=r.nextNode();return t}function Sr(e){const t=Tr();t&&(e||(e=Ss()),Cs(()=>{t.querySelectorAll(".rte-misspelled").forEach(r=>{const n=r.parentNode;if(n){for(;r.firstChild;)n.insertBefore(r.firstChild,r);n.removeChild(r)}}),e.forEach(r=>{if(Ii.has(r.word.toLowerCase()))return;const n=r.node.data.length;if(!(r.startOffset<0||r.endOffset>n||r.startOffset>=r.endOffset))try{const o=document.createRange();o.setStart(r.node,r.startOffset),o.setEnd(r.node,r.endOffset);const a=document.createElement("span");a.className="rte-misspelled",a.setAttribute("data-word",r.word),a.setAttribute("data-suggestions",r.suggestions.join(",")),a.setAttribute("title",`Suggestions: ${r.suggestions.join(", ")}`),a.style.borderBottom="2px wavy red",a.style.cursor="pointer",o.surroundContents(a)}catch{}})}),bi(e))}function Bi(){const e=Tr();e&&Cs(()=>{e.querySelectorAll(".rte-misspelled").forEach(t=>{const r=t.parentNode;if(r){for(;t.firstChild;)r.insertBefore(t.firstChild,t);r.removeChild(t)}})})}function ax(e,t){Cs(()=>{const r=document.createRange();r.setStart(e.node,e.startOffset),r.setEnd(e.node,e.endOffset);const n=document.createTextNode(t);r.deleteContents(),r.insertNode(n)})}function $f(e){Ii.add(e.toLowerCase()),Bi(),Sr()}function Lf(e){Hi.add(e.toLowerCase()),Q0(),Bi(),Sr()}function ix(e){const t=Tr();if(!t)return{total:0,misspelled:0,accuracy:100};e||(e=Ss());const r=e.filter(i=>!Ii.has(i.word.toLowerCase())).length,a=((t.textContent||"").match(/[\p{L}\p{M}\p{N}]+/gu)||[]).length;return{total:a,misspelled:r,accuracy:a>0?(a-r)/a*100:100}}function lx(e,t){const r=document.createTextNode(t);e.replaceWith(r)}function sx(e){e.classList.remove("rte-misspelled"),e.removeAttribute("data-word"),e.removeAttribute("data-suggestions"),e.removeAttribute("title"),e.style.borderBottom="",e.style.cursor=""}function cx(e,t,r,n,o){Sf(o),document.querySelectorAll(".rte-spellcheck-menu").forEach(p=>p.remove());const a=document.createElement("div");if(a.className="rte-spellcheck-menu",n.slice(0,5).forEach(p=>{const g=document.createElement("div");g.className="rte-spellcheck-menu-item",g.textContent=p,g.onclick=()=>{lx(o,p),window.setTimeout(()=>{Qt&&(Sr(),bi())},0),a.remove()},a.appendChild(g)}),n.length>0){const p=document.createElement("div");p.style.cssText="height: 1px; background: #ddd; margin: 4px 0;",a.appendChild(p)}const i=document.createElement("div");i.className="rte-spellcheck-menu-item meta",i.textContent="Ignore Once",i.onclick=()=>{sx(o),a.remove()},a.appendChild(i);const l=document.createElement("div");l.className="rte-spellcheck-menu-item meta",l.textContent="Ignore All",l.onclick=()=>{$f(r),a.remove()},a.appendChild(l);const s=document.createElement("div");s.className="rte-spellcheck-menu-item positive",s.textContent="Add to Dictionary",s.onclick=()=>{Lf(r),a.remove()},a.appendChild(s),document.body.appendChild(a);const c=a.getBoundingClientRect(),d=window.innerWidth-c.width-8,u=window.innerHeight-c.height-8;a.style.left=`${Math.max(8,Math.min(e,d))}px`,a.style.top=`${Math.max(8,Math.min(t,u))}px`;const f=p=>{a.contains(p.target)||(a.remove(),document.removeEventListener("mousedown",f))};setTimeout(()=>document.addEventListener("mousedown",f),0)}function sd(){gi||(uo=e=>{const t=e.target;if(t&&t.classList.contains("rte-misspelled")){e.preventDefault(),Sf(t);const r=t.getAttribute("data-word"),n=(t.getAttribute("data-suggestions")||"").split(",").filter(o=>o);cx(e.clientX,e.clientY,r,n,t)}},document.addEventListener("contextmenu",uo),gi=!0)}function dx(){!gi||!uo||(document.removeEventListener("contextmenu",uo),uo=null,gi=!1)}function ux(e){return e.closest("[data-editora-editor]")||e.parentElement||e}function cd(){const e=Tr();if(!e)throw new Error("Spell check panel requested without active editor");const t=ux(e);Pl();const r=document.createElement("div");return r.className="rte-spell-check-panel",window.getComputedStyle(t).position==="static"&&(t.style.position="relative"),t.appendChild(r),r}function bi(e){if(!de)return;const t=e||Ss(),r=ix(t);de.innerHTML=`
    <div class="rte-spellcheck-header">
      <div>
        <h3 class="rte-spellcheck-title">Spell Check</h3>
        <p class="rte-spellcheck-subtitle">Review suggestions and resolve issues quickly</p>
      </div>
      <button class="rte-spellcheck-close" aria-label="Close spell check panel">✕</button>
    </div>
    
    <div class="rte-spellcheck-stats">
      <div class="rte-spellcheck-stat">
        <span class="rte-spellcheck-stat-label">Total</span>
        <strong class="rte-spellcheck-stat-value">${r.total}</strong>
      </div>
      <div class="rte-spellcheck-stat">
        <span class="rte-spellcheck-stat-label">Misspelled</span>
        <strong class="rte-spellcheck-stat-value">${r.misspelled}</strong>
      </div>
      <div class="rte-spellcheck-stat">
        <span class="rte-spellcheck-stat-label">Accuracy</span>
        <strong class="rte-spellcheck-stat-value">${r.accuracy.toFixed(1)}%</strong>
      </div>
    </div>
    
    <div class="rte-spellcheck-list">
      ${t.length===0?'<div class="rte-spellcheck-empty">No spelling errors found in this editor.</div>':t.map((o,a)=>`
            <div class="rte-spellcheck-item" data-word="${o.word}" data-index="${a}">
              <button class="rte-spellcheck-word-header" type="button">
                <span class="rte-spellcheck-word">${o.word}</span>
                <span class="rte-spellcheck-caret">▶</span>
              </button>
              <div class="rte-spellcheck-suggestions">
                ${o.suggestions.length>0?`<div class="rte-spellcheck-actions">
                       ${o.suggestions.map(i=>`<button class="rte-spellcheck-btn primary suggestion-btn" data-suggestion="${i}" type="button">${i}</button>`).join("")}
                     </div>`:'<div class="rte-spellcheck-subtitle">No suggestions available</div>'}
                <div class="rte-spellcheck-actions">
                  <button class="rte-spellcheck-btn ignore-btn" type="button">Ignore</button>
                  <button class="rte-spellcheck-btn add-btn" type="button">Add to Dictionary</button>
                </div>
              </div>
            </div>
          `).join("")}
    </div>
  `;const n=de.querySelector(".rte-spellcheck-close");n==null||n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Ts()}),de.querySelectorAll(".rte-spellcheck-word-header").forEach(o=>{o.addEventListener("click",()=>{const a=o.closest(".rte-spellcheck-item"),i=a==null?void 0:a.querySelector(".rte-spellcheck-suggestions"),l=o.querySelector(".rte-spellcheck-caret");i&&l&&(i.classList.contains("show")?(i.classList.remove("show"),l.textContent="▶"):(i.classList.add("show"),l.textContent="▼"))})}),de.querySelectorAll(".suggestion-btn").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-suggestion"),i=o.closest(".rte-spellcheck-item");i==null||i.getAttribute("data-word");const l=parseInt((i==null?void 0:i.getAttribute("data-index"))||"0");t[l]&&(ax(t[l],a),Sr())})}),de.querySelectorAll(".ignore-btn").forEach(o=>{o.addEventListener("click",()=>{const a=o.closest(".rte-spellcheck-item"),i=a==null?void 0:a.getAttribute("data-word");$f(i)})}),de.querySelectorAll(".add-btn").forEach(o=>{o.addEventListener("click",()=>{const a=o.closest(".rte-spellcheck-item"),i=a==null?void 0:a.getAttribute("data-word");Lf(i)})})}function dd(){const e=Tr();e&&(rt&&rt.disconnect(),rt=new MutationObserver(t=>{vn>0||t.some(r=>r.type==="characterData"||r.type==="childList")&&(xn&&clearTimeout(xn),xn=window.setTimeout(()=>{Qt&&Sr()},350))}),rt.observe(e,{...Ef}))}function Af(){rt&&(rt.disconnect(),rt=null),xn&&(clearTimeout(xn),xn=null)}function Mf(){document.querySelectorAll(".rte-spellcheck-menu").forEach(e=>e.remove())}function ud(){kn||(kn=e=>{e.key!=="Escape"||!Qt||(e.preventDefault(),e.stopPropagation(),Ts())},document.addEventListener("keydown",kn,!0))}function fx(){kn&&(document.removeEventListener("keydown",kn,!0),kn=null)}function Ts(){return Qt&&(Bi(),Af(),dx(),Mf(),de&&(de.remove(),de=null),xe=null,Tt=null,Qt=!1,fx()),!1}function mx(){const e=Z0();return e?Qt&&xe&&xe!==e?(Bi(),Af(),Mf(),de&&(de.remove(),de=null),xe=e,Pl(),sd(),ud(),Sr(),dd(),de=cd(),bi(),!0):Qt?Ts():(xe=e,Qt=!0,Pl(),sd(),ud(),Sr(),dd(),de&&(de.remove(),de=null),de=cd(),bi(),!0):!1}const px=()=>({name:"spellCheck",init:()=>{J0(),G0()},toolbar:[{label:"Spell Check",command:"toggleSpellCheck",icon:'<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 12.5L3.84375 9.5M3.84375 9.5L5 5.38889C5 5.38889 5.25 4.5 6 4.5C6.75 4.5 7 5.38889 7 5.38889L8.15625 9.5M3.84375 9.5H8.15625M9 12.5L8.15625 9.5M13 16.8333L15.4615 19.5L21 13.5M12 8.5H15C16.1046 8.5 17 7.60457 17 6.5C17 5.39543 16.1046 4.5 15 4.5H12V8.5ZM12 8.5H16C17.1046 8.5 18 9.39543 18 10.5C18 11.6046 17.1046 12.5 16 12.5H12V8.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',shortcut:"F7"}],commands:{toggleSpellCheck:(e,t)=>(U0(t),mx(),!0)},keymap:{F7:"toggleSpellCheck"}});const wx=[If(),Bf(),Pf(),Zf(),Yf(),Rf(),Xf(),Jf(),X1(),Of(),gm(),Qf(),zf(),Mm(),_f(),Sm(),em(),tm(),qf(),Rm(),jf(),Ff(),up(),Gm(),Vf(),Kf(),b0(),M1(),x1(),h1(),Pm(),px(),_m(),Wf(),W0(),u1(),Uf(),M0(),Gf(),W1(),rm(),og(),Ag(),Fg({data:{user:{firstName:"Ava",lastName:"Miller"},order:{total:1234.56,createdAt:"2026-03-03T12:00:00Z"}}}),om({bannedWords:["obviously","simply"],requiredHeadings:["Summary"],maxSentenceWords:28,minReadabilityScore:55,enableRealtime:!0}),yb({defaultStyle:"apa",enableFootnoteSync:!0}),nm({defaultStatus:"draft",lockOnApproval:!0,defaultActor:"Editorial Lead"}),am({enableRealtime:!0,redactionMode:"token",maxFindings:120}),nh({defaultProfile:"balanced",maxHtmlLength:22e4}),Bh({maxResults:120,blocks:[{id:"incident-summary",label:"Incident Summary Block",category:"Operations",tags:["incident","summary"],keywords:["postmortem","rca"],html:"<h3>Incident Summary</h3><p>Describe impact, timeline, and customer exposure.</p>"},{id:"risk-register-entry",label:"Risk Register Entry",category:"Compliance",tags:["risk","governance"],keywords:["mitigation","owner"],html:"<h3>Risk Register Entry</h3><p><strong>Risk:</strong> <em>Describe risk here.</em></p><p><strong>Mitigation:</strong> Define mitigation owner and due date.</p>"},{id:"release-rollback",label:"Release Rollback Plan",category:"Engineering",tags:["release","rollback"],keywords:["deployment","runbook"],html:"<h3>Rollback Plan</h3><ol><li>Pause rollout</li><li>Revert deployment</li><li>Validate service health</li></ol>"}]}),ly({defaultSchemaId:"policy",enableRealtime:!0,schemas:[{id:"policy",label:"Policy",strictOrder:!0,allowUnknownHeadings:!0,sections:[{title:"Policy Statement"},{title:"Applicability",aliases:["Scope"]},{title:"Controls"},{title:"Exceptions"},{title:"Enforcement"}]}]}),By({sourceLocale:"en-US",targetLocale:"fr-FR",enableRealtime:!0,locales:["en-US","fr-FR","de-DE","es-ES","ja-JP"]}),d1(),Op({items:[{id:"john.doe",label:"John Doe",meta:"john@acme.com"},{id:"sarah.lee",label:"Sarah Lee",meta:"sarah@acme.com"},{id:"ops.team",label:"Ops Team",meta:"team"}]})];export{wx as a};
