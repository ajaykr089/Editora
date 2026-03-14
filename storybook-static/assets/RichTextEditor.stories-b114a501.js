import{a as h,j as S,B as J,F as ji,G as aa}from"./index-c1b18327.js";import{r as Ne}from"./index-93f6b7ae.js";import{R as X}from"./RichTextEditor-6990c95b.js";/* empty css                *//* empty css             */import{H as Fm}from"./HeadingPlugin.native-b74ae03d.js";import{b as jm,c as Vm,f as kf,g as wf,p as Km,B as go,I as bo,U as us,L as Wm,d as Um,e as Gm,h as Zm,a as Ef,T as Ym,i as Xm,M as Jm,A as Qm,F as eg,H as Cf}from"./A11yCheckerPlugin.native-b89c1fcd.js";import{S as Sf,a as tg,B as rg,C as ng,T as og,F as ag,b as ig}from"./TextAlignmentPlugin.native-8d0de10f.js";import{T as lg,A as sg}from"./ApprovalWorkflowPlugin.native-eaed16b3.js";import{C as cg}from"./ContentRulesPlugin.native-706a3efc.js";import{P as dg}from"./PIIRedactionPlugin.native-6cafc2ca.js";import{_ as fl}from"./iframe-4322e920.js";import"./index-76e7d200.js";import"./SearchExtension-5db95884.js";import"./ReadOnlyExtension-88fcf3b5.js";import"../sb-preview/runtime.js";const tc="__editoraCommandEditorRoot",ug=e=>{if(!e)return null;const t=e.querySelector('[contenteditable="true"]');return t instanceof HTMLElement?t:null},fg=()=>{if(typeof window>"u")return null;const e=window[tc];if(!(e instanceof HTMLElement))return null;window[tc]=null;const t=e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(e.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?e:null);if(t){const n=ug(t);if(n)return n;if(t.getAttribute("contenteditable")==="true")return t}if(e.getAttribute("contenteditable")==="true")return e;const r=e.closest('[contenteditable="true"]');return r instanceof HTMLElement?r:null},pg=()=>{const e=fg();if(e&&document.contains(e))return e;const t=window.getSelection();if(t&&t.rangeCount>0){let n=t.getRangeAt(0).startContainer;for(;n&&n!==document.body;){if(n.nodeType===Node.ELEMENT_NODE){const o=n;if(o.getAttribute("contenteditable")==="true")return o}n=n.parentNode}}const r=document.activeElement;if(r){if(r.getAttribute("contenteditable")==="true")return r;const n=r.closest('[contenteditable="true"]');if(n)return n}return document.querySelector('[contenteditable="true"]')},mg=e=>e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null,gg=e=>{const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);return e.contains(r.commonAncestorContainer)?r:null},rc=e=>{e.dispatchEvent(new Event("input",{bubbles:!0}))},nc=(e,t)=>{if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}},jn=(e,t)=>{if(!e.isConnected){t.focus({preventScroll:!0});return}const r=window.getSelection();if(!r)return;const n=document.createRange();n.selectNodeContents(e),n.collapse(!1),r.removeAllRanges();try{r.addRange(n)}catch{t.focus({preventScroll:!0});return}t.focus({preventScroll:!0})},bg=e=>{let t=e.querySelector(":scope > p");if(!t){t=document.createElement("p");const r=[];e.childNodes.forEach(n=>{n.nodeType===Node.ELEMENT_NODE&&["UL","OL"].includes(n.tagName)||r.push(n)}),r.forEach(n=>t.appendChild(n)),e.insertBefore(t,e.firstChild)}return t.innerHTML.trim()||(t.innerHTML="<br>"),t},ha=e=>{const t=document.createElement("li");t.setAttribute("data-type","checklist-item"),t.setAttribute("data-checked","false");const r=document.createElement("p");return r.innerHTML=e.trim()||"<br>",t.appendChild(r),t},pl=e=>Array.from(e.children).filter(t=>t instanceof HTMLLIElement),hg=new Set(["P","DIV","H1","H2","H3","H4","H5","H6","BLOCKQUOTE","PRE","LI"]),ml=e=>hg.has(e.tagName)&&e.getAttribute("contenteditable")!=="true",yg=(e,t)=>{const r=[],n=new Set,o=c=>{!c||n.has(c)||t.contains(c)&&ml(c)&&(c.closest("ul, ol")||(n.add(c),r.push(c)))},a=c=>{let d=c;for(;d&&d!==document.body;){if(d.nodeType===Node.ELEMENT_NODE){const u=d;if(ml(u))return u;if(u.getAttribute("contenteditable")==="true")break}d=d.parentNode}return null};if(e.collapsed)return o(a(e.startContainer)),r;const i=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT,{acceptNode:c=>{const d=c;if(!ml(d)||d.closest("ul, ol"))return NodeFilter.FILTER_SKIP;if(typeof e.intersectsNode=="function")return e.intersectsNode(d)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;const u=document.createRange();return u.selectNodeContents(d),e.compareBoundaryPoints(Range.END_TO_START,u)>0&&e.compareBoundaryPoints(Range.START_TO_END,u)<0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});let l=i.nextNode();for(;l;)o(l),l=i.nextNode();if(r.length===0&&o(a(e.commonAncestorContainer)),r.length<=1)return r;const s=r.filter(c=>!r.some(d=>d!==c&&c.contains(d)));return s.length>0?s:r},xg=e=>{const t=[],r=document.createElement("div"),n=()=>{const o=r.innerHTML.trim();if(!o)return;const a=document.createElement("p");a.innerHTML=o,t.push(a),r.innerHTML=""};if(e.childNodes.forEach(o=>{if(o.nodeType===Node.ELEMENT_NODE&&["UL","OL"].includes(o.tagName)){n();return}if(o.nodeType===Node.ELEMENT_NODE&&o.tagName==="P"){n();const a=o.innerHTML.trim(),i=document.createElement("p");i.innerHTML=a||"<br>",t.push(i);return}o.nodeType===Node.TEXT_NODE&&!(o.textContent||"").trim()||r.appendChild(o.cloneNode(!0))}),n(),t.length===0){const o=document.createElement("p");o.innerHTML="<br>",t.push(o)}return t},vg=()=>({name:"checklist",init:()=>{if(typeof document>"u"||typeof window>"u"||window.__checklistPluginClickInitialized)return;window.__checklistPluginClickInitialized=!0;const e=t=>{const n=t.target.closest('li[data-type="checklist-item"]');if(!n)return;const o=n.getBoundingClientRect();if(!(t.clientX-o.left<32))return;t.preventDefault(),t.stopPropagation();const l=n.closest("[contenteditable], .rte-content, .editora-content");if((l==null?void 0:l.getAttribute("contenteditable"))==="false"||!!(l!=null&&l.closest('[data-readonly="true"], .editora-editor[readonly], editora-editor[readonly]')))return;const c=(l==null?void 0:l.innerHTML)||"",d=n.getAttribute("data-checked")==="true";n.setAttribute("data-checked",(!d).toString()),l&&(nc(l,c),rc(l))};document.addEventListener("click",e)},nodes:{checklist:{content:"checklistItem+",group:"block",parseDOM:[{tag:'ul[data-type="checklist"]'}],toDOM:()=>["ul",{"data-type":"checklist"},0]},checklistItem:{content:"paragraph",attrs:{checked:{default:!1}},parseDOM:[{tag:'li[data-type="checklist-item"]',getAttrs:e=>({checked:e.getAttribute("data-checked")==="true"})}],toDOM:e=>{var t;return["li",{"data-type":"checklist-item","data-checked":(t=e==null?void 0:e.attrs)!=null&&t.checked?"true":"false"},0]}}},toolbar:[{label:"Checklist",command:"toggleChecklist",icon:'<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 4.48h-.71L2 3.43l.71-.7.69.68L4.81 2l.71.71-1.77 1.77zM6.99 3h8v1h-8V3zm0 3h8v1h-8V6zm8 3h-8v1h8V9zm-8 3h8v1h-8v-1zM3.04 7.48h.71l1.77-1.77-.71-.7L3.4 6.42l-.69-.69-.71.71 1.04 1.04zm.71 3.01h-.71L2 9.45l.71-.71.69.69 1.41-1.42.71.71-1.77 1.77zm-.71 3.01h.71l1.77-1.77-.71-.71-1.41 1.42-.69-.69-.71.7 1.04 1.05z"></path></g></svg>',shortcut:"Mod-Shift-9"}],commands:{toggleChecklist:()=>{try{const e=pg();if(!e)return!1;const t=e.innerHTML,r=()=>(nc(e,t),rc(e),!0),n=gg(e);if(!n)return!1;const o=mg(n.startContainer);if(!o)return!1;const a=o.closest('ul[data-type="checklist"]');if(a&&e.contains(a)){const f=pl(a);if(f.length===0)return!1;const m=document.createDocumentFragment();let g=null;return f.forEach((p,y)=>{const b=xg(p);b.forEach(x=>{m.appendChild(x),!g&&(p.contains(n.startContainer)||y===0)&&(g=x)}),!g&&y===0&&b[0]&&(g=b[0])}),a.replaceWith(m),g&&jn(g,e),r()}const i=o.closest("ul, ol");if(i&&e.contains(i)){let f;if(i.tagName.toLowerCase()==="ul")f=i;else{for(f=document.createElement("ul");i.firstChild;)f.appendChild(i.firstChild);i.replaceWith(f)}f.setAttribute("data-type","checklist");let m=pl(f);m.length===0&&(f.appendChild(ha("")),m=pl(f));let g=null;m.forEach(y=>{y.setAttribute("data-type","checklist-item"),y.hasAttribute("data-checked")||y.setAttribute("data-checked","false");const b=bg(y);y.contains(n.startContainer)&&(g=b)});const p=f.querySelector(':scope > li[data-type="checklist-item"] > p');return jn(g||p||f,e),r()}const l=yg(n,e);if(l.length>1){const f=document.createElement("ul");f.setAttribute("data-type","checklist"),l.forEach(p=>{f.appendChild(ha(p.innerHTML))}),l[0].replaceWith(f),l.slice(1).forEach(p=>{p.isConnected&&p.remove()});const g=f.querySelector(':scope > li[data-type="checklist-item"] > p');return g&&jn(g,e),r()}const s=l[0]||o.closest("p, h1, h2, h3, h4, h5, h6, blockquote, pre");if(s&&s!==e){const f=document.createElement("ul");f.setAttribute("data-type","checklist");const m=ha(s.innerHTML);f.appendChild(m),s.replaceWith(f);const g=m.querySelector(":scope > p");return g&&jn(g,e),r()}const c=document.createElement("ul");c.setAttribute("data-type","checklist");const d=ha("");c.appendChild(d),n.deleteContents(),n.insertNode(c);const u=d.querySelector(":scope > p");return u&&jn(u,e),r()}catch(e){return console.error("Failed to toggle checklist:",e),!1}}},keymap:{"Mod-Shift-9":"toggleChecklist"}});let ue=null,fs=null,fr=null,ps=null,Re="#ffff00";const Vn='[data-theme="dark"], .dark, .editora-theme-dark',kg=["#000000","#ffffff","#808080","#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ffa500","#800080","#ffc0cb"];function Tf(){const e=window.getSelection();if(e&&e.rangeCount>0){const n=e.getRangeAt(0).startContainer,o=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement;if(o){const a=o.closest('[data-editora-editor="true"], .rte-editor, .editora-editor');if(a)return a}}const t=document.activeElement;return t?t.closest('[data-editora-editor="true"], .rte-editor, .editora-editor'):null}function wg(e){const t=window.__editoraLastCommand,r=window.__editoraLastCommandButton;if(t===e&&r&&r.isConnected){const i=window.getComputedStyle(r),l=r.getBoundingClientRect();if(i.display!=="none"&&i.visibility!=="hidden"&&i.pointerEvents!=="none"&&!(l.width===0&&l.height===0))return r}const n=i=>{for(const l of i){const s=window.getComputedStyle(l),c=l.getBoundingClientRect();if(!(s.display==="none"||s.visibility==="hidden"||s.pointerEvents==="none")&&!(c.width===0&&c.height===0))return l}return null},o=Tf();if(o){const i=Array.from(o.querySelectorAll(`[data-command="${e}"]`)),l=n(i);if(l)return l}const a=Array.from(document.querySelectorAll(`[data-command="${e}"]`));return n(a)}function Eg(e){if(e!=null&&e.closest(Vn))return!0;const t=window.getSelection();if(t&&t.rangeCount>0){const n=t.getRangeAt(0).startContainer,o=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement;if(o!=null&&o.closest(Vn))return!0}const r=document.activeElement;return r!=null&&r.closest(Vn)?!0:document.body.matches(Vn)||document.documentElement.matches(Vn)}function Cg(){if(document.getElementById("rte-bg-color-picker-styles"))return;const e=document.createElement("style");e.id="rte-bg-color-picker-styles",e.textContent=`
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
  `,document.head.appendChild(e)}function Sg(){const e=document.createElement("div");e.className="rte-bg-color-picker",Eg(fs)&&e.classList.add("rte-theme-dark"),e.addEventListener("click",b=>b.stopPropagation());const t=document.createElement("div");t.className="rte-bg-color-picker-header";const r=document.createElement("span");r.className="rte-bg-color-picker-title",r.textContent="Background Color";const n=document.createElement("button");n.type="button",n.className="rte-bg-color-picker-close",n.id="rte-bg-color-close",n.setAttribute("aria-label","Close"),n.textContent="×",t.appendChild(r),t.appendChild(n);const o=document.createElement("div");o.className="rte-bg-color-picker-body";const a=document.createElement("div");a.className="rte-bg-color-section";const i=document.createElement("div");i.className="rte-bg-color-preview";const l=document.createElement("div");l.className="rte-bg-color-preview-swatch",l.id="rte-bg-color-preview-swatch";const s=document.createElement("span");s.className="rte-bg-color-preview-hex",s.id="rte-bg-color-preview-hex",i.appendChild(l),i.appendChild(s),a.appendChild(i);const c=document.createElement("div");c.className="rte-bg-color-section";const d=document.createElement("div");d.className="rte-bg-color-section-label",d.textContent="Colors";const u=document.createElement("div");u.className="rte-bg-color-grid",u.id="rte-bg-color-grid",kg.forEach(b=>{const x=document.createElement("button");x.type="button",x.className="rte-bg-color-swatch",x.style.backgroundColor=b,x.dataset.color=b,x.title=b,u.appendChild(x)}),c.appendChild(d),c.appendChild(u);const f=document.createElement("div");f.className="rte-bg-color-section";const m=document.createElement("div");m.className="rte-bg-color-section-label",m.textContent="Custom";const g=document.createElement("div");g.className="rte-bg-color-custom";const p=document.createElement("input");p.type="color",p.className="rte-bg-color-input",p.id="rte-bg-color-input",p.value=Re;const y=document.createElement("input");return y.type="text",y.className="rte-bg-color-text-input",y.id="rte-bg-color-text-input",y.placeholder="#FFFF00",y.value=Re.toUpperCase(),y.maxLength=7,g.appendChild(p),g.appendChild(y),f.appendChild(m),f.appendChild(g),o.appendChild(a),o.appendChild(c),o.appendChild(f),e.appendChild(t),e.appendChild(o),e}function Tg(){if(!ue)return;const e=ue.querySelector("#rte-bg-color-close");e==null||e.addEventListener("click",()=>Ir());const t=ue.querySelector("#rte-bg-color-grid");t&&t.addEventListener("click",o=>{const a=o.target;if(a.classList.contains("rte-bg-color-swatch")){const i=a.dataset.color;i&&(Re=i,Ua(i),Ir())}});const r=ue.querySelector("#rte-bg-color-input");r&&(r.addEventListener("change",o=>{const a=o.target.value.toUpperCase();Re=a,Ua(a),Ir()}),r.addEventListener("input",o=>{Re=o.target.value.toUpperCase(),Ml(),Rl()}));const n=ue.querySelector("#rte-bg-color-text-input");n&&(n.addEventListener("change",o=>{let a=o.target.value.trim();a&&!a.startsWith("#")&&(a="#"+a),/^#[0-9A-F]{6}$/i.test(a)&&(Re=a.toUpperCase(),Ua(Re),Ir())}),n.addEventListener("input",o=>{let a=o.target.value.trim();a&&!a.startsWith("#")&&(a="#"+a,n.value=a),/^#[0-9A-F]{6}$/i.test(a)&&(Re=a.toUpperCase(),Ml(),Rl())}))}function Ml(){if(!ue)return;const e=ue.querySelector("#rte-bg-color-preview-swatch"),t=ue.querySelector("#rte-bg-color-preview-hex"),r=ue.querySelector("#rte-bg-color-input"),n=ue.querySelector("#rte-bg-color-text-input");e&&(e.style.backgroundColor=Re),t&&(t.textContent=Re.toUpperCase()),r&&(r.value=Re),n&&(n.value=Re.toUpperCase())}function Rl(){if(!ue)return;ue.querySelectorAll(".rte-bg-color-swatch").forEach(t=>{const r=t.dataset.color;(r==null?void 0:r.toUpperCase())===Re.toUpperCase()?t.classList.add("selected"):t.classList.remove("selected")})}function Lg(){try{const e=window.getSelection();if(!e||e.rangeCount===0)return"#ffff00";const r=e.getRangeAt(0).commonAncestorContainer,n=r.nodeType===1?r:r.parentElement;if(n){const o=n.closest('[style*="background-color"]');if(o){const a=o.style.backgroundColor;if(a)return $g(a)}}return"#ffff00"}catch{return"#ffff00"}}function $g(e){if(e.startsWith("#"))return e.toUpperCase();const t=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(t){const r=parseInt(t[1]),n=parseInt(t[2]),o=parseInt(t[3]);return"#"+[r,n,o].map(a=>{const i=a.toString(16);return i.length===1?"0"+i:i}).join("").toUpperCase()}return"#ffff00"}function Ua(e){const t=jm({color:e,className:"rte-bg-color",styleProperty:"backgroundColor",commands:["hiliteColor","backColor"],savedRange:ps,getActiveEditorRoot:Tf,warnMessage:"[BackgroundColor] Could not apply highlight for current selection"});return t&&console.log("[BackgroundColor] Applied color:",e),t}function Ir(){fr&&(fr.destroy(),fr=null),ue&&(ue.remove(),ue=null),fs=null,ps=null}function Ag(){if(Cg(),ue)return Ir(),!0;const e=wg("openBackgroundColorPicker");if(!e)return!1;const t=window.getSelection();return!t||t.isCollapsed?(alert("Please select text to apply background color"),!1):(t.rangeCount>0&&(ps=t.getRangeAt(0).cloneRange()),Re=Lg(),ue=Sg(),document.body.appendChild(ue),fs=e,fr&&(fr.destroy(),fr=null),fr=Vm({popover:ue,anchor:e,onClose:Ir,gap:8,margin:8,zIndex:1e4}),Ml(),Rl(),Tg(),!0)}const Mg=()=>({name:"backgroundColor",marks:{backgroundColor:{attrs:{color:{default:"#ffffff"}},parseDOM:[{tag:'span[style*="background-color"]',getAttrs:e=>{const n=(e.getAttribute("style")||"").match(/background-color:\s*([^;]+)/);return n?{color:n[1]}:null}},{tag:"mark",getAttrs:e=>({color:e.style.backgroundColor||"#ffff00"})}],toDOM:e=>{var t;return["span",{style:`background-color: ${((t=e.attrs)==null?void 0:t.color)||"#ffffff"}`,class:"rte-bg-color"},0]}}},toolbar:[{label:"Background Color",command:"openBackgroundColorPicker",icon:'<svg width="24" height="24" focusable="false"><g fill-rule="evenodd"><path class="tox-icon-highlight-bg-color__color" d="M3 18h18v3H3z" fill="#000000"></path><path fill-rule="nonzero" d="M7.7 16.7H3l3.3-3.3-.7-.8L10.2 8l4 4.1-4 4.2c-.2.2-.6.2-.8 0l-.6-.7-1.1 1.1zm5-7.5L11 7.4l3-2.9a2 2 0 0 1 2.6 0L18 6c.7.7.7 2 0 2.7l-2.9 2.9-1.8-1.8-.5-.6"></path></g></svg>',shortcut:"Mod-Shift-h"}],commands:{openBackgroundColorPicker:()=>Ag(),setBackgroundColor:e=>e?Ua(e):!1},keymap:{"Mod-Shift-h":"openBackgroundColorPicker"}}),Rg=new Set(["P","DIV","H1","H2","H3","H4","H5","H6","LI","BLOCKQUOTE","PRE"]),Dl=e=>Rg.has(e.tagName)&&e.getAttribute("contenteditable")!=="true",Dg=()=>{const e=window.getSelection();if(e&&e.rangeCount>0){let r=e.getRangeAt(0).startContainer;for(;r&&r!==document.body;){if(r.nodeType===Node.ELEMENT_NODE){const n=r;if(n.getAttribute("contenteditable")==="true")return n}r=r.parentNode}}const t=document.activeElement;if(t){if(t.getAttribute("contenteditable")==="true")return t;const r=t.closest('[contenteditable="true"]');if(r)return r}return document.querySelector('[contenteditable="true"]')},oc=e=>{let t=e;for(;t&&t!==document.body;){if(t.nodeType===Node.ELEMENT_NODE){const r=t;if(Dl(r))return r;if(r.getAttribute("contenteditable")==="true")break}t=t.parentNode}return null},Ng=(e,t)=>{const r=[],n=new Set,o=l=>{!l||n.has(l)||t.contains(l)&&Dl(l)&&(n.add(l),r.push(l))};if(e.collapsed)return o(oc(e.startContainer)),r;const a=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT,{acceptNode:l=>{const s=l;if(!Dl(s))return NodeFilter.FILTER_SKIP;if(typeof e.intersectsNode=="function")return e.intersectsNode(s)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;const c=document.createRange();return c.selectNodeContents(s),e.compareBoundaryPoints(Range.END_TO_START,c)>0&&e.compareBoundaryPoints(Range.START_TO_END,c)<0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});let i=a.nextNode();for(;i;)o(i),i=a.nextNode();return r.length===0&&o(oc(e.commonAncestorContainer)),r},Bg=(e,t)=>{if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}},ac=e=>{const t=Dg();if(!t)return!1;const r=window.getSelection();if(!r||r.rangeCount===0)return!1;const n=r.getRangeAt(0);if(!t.contains(n.commonAncestorContainer))return!1;const o=Ng(n,t);if(o.length===0)return!1;const a=t.innerHTML;return o.forEach(i=>{e==="rtl"?i.setAttribute("dir","rtl"):i.removeAttribute("dir")}),Bg(t,a),t.dispatchEvent(new Event("input",{bubbles:!0})),!0},Pg=()=>({name:"direction",toolbar:[{label:"Left to Right",command:"setDirectionLTR",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 18H3M21 18L18 21M21 18L18 15M13 3V12M13 3H7M13 3C13.4596 3 13.9148 3.0776 14.3394 3.22836C14.764 3.37913 15.1499 3.6001 15.4749 3.87868C15.7999 4.15726 16.0577 4.48797 16.2336 4.85195C16.4095 5.21593 16.5 5.60603 16.5 6C16.5 6.39397 16.4095 6.78407 16.2336 7.14805C16.0577 7.51203 15.7999 7.84274 15.4749 8.12132C15.1499 8.3999 14.764 8.62087 14.3394 8.77164C13.9148 8.9224 13.4596 9 13 9V3ZM9 3V12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',shortcut:"Mod-Shift-l"},{label:"Right to Left",command:"setDirectionRTL",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 18H21M3 18L6 21M3 18L6 15M11 12V3H17M15 3V12M10.5 3C10.0404 3 9.58525 3.0776 9.16061 3.22836C8.73597 3.37913 8.35013 3.6001 8.02513 3.87868C7.70012 4.15726 7.44231 4.48797 7.26642 4.85195C7.09053 5.21593 7 5.60603 7 6C7 6.39397 7.09053 6.78407 7.26642 7.14805C7.44231 7.51203 7.70012 7.84274 8.02513 8.12132C8.35013 8.3999 8.73597 8.62087 9.16061 8.77164C9.58525 8.9224 10.0404 9 10.5 9L10.5 3Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',shortcut:"Mod-Shift-r"}],commands:{setDirectionLTR:()=>{try{return ac(null)}catch(e){return console.error("Failed to set LTR direction:",e),!1}},setDirectionRTL:()=>{try{return ac("rtl")}catch(e){return console.error("Failed to set RTL direction:",e),!1}}},keymap:{"Mod-Shift-l":"setDirectionLTR","Mod-Shift-r":"setDirectionRTL"}}),Ig=()=>{const e=()=>{try{const n=window.getSelection();if(n&&n.rangeCount>0&&!n.isCollapsed){const o=n.getRangeAt(0),i=o.toString().toUpperCase();return o.deleteContents(),o.insertNode(document.createTextNode(i)),!0}return!1}catch(n){return console.error("Failed to convert to uppercase:",n),!1}},t=()=>{try{const n=window.getSelection();if(n&&n.rangeCount>0&&!n.isCollapsed){const o=n.getRangeAt(0),i=o.toString().toLowerCase();return o.deleteContents(),o.insertNode(document.createTextNode(i)),!0}return!1}catch(n){return console.error("Failed to convert to lowercase:",n),!1}},r=()=>{try{const n=window.getSelection();if(n&&n.rangeCount>0&&!n.isCollapsed){const o=n.getRangeAt(0),i=o.toString().replace(/\w\S*/g,l=>l.charAt(0).toUpperCase()+l.substr(1).toLowerCase());return o.deleteContents(),o.insertNode(document.createTextNode(i)),!0}return!1}catch(n){return console.error("Failed to convert to title case:",n),!1}};return{name:"capitalization",toolbar:[{label:"Capitalization",command:"setCapitalization",type:"inline-menu",options:[{label:"lowercase",value:"lowercase"},{label:"UPPERCASE",value:"uppercase"},{label:"Title Case",value:"titlecase"}],icon:'<svg fill="#000000" width="24" height="24" viewBox="0 0 32.00 32.00" id="icon" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.192"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;}</style></defs><title>letter--Aa</title><path d="M23,13H18v2h5v2H19a2,2,0,0,0-2,2v2a2,2,0,0,0,2,2h6V15A2,2,0,0,0,23,13Zm0,8H19V19h4Z"></path><path d="M13,9H9a2,2,0,0,0-2,2V23H9V18h4v5h2V11A2,2,0,0,0,13,9ZM9,16V11h4v5Z"></path><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"></rect></g></svg>'}],commands:{setCapitalization:n=>{if(!n)return!1;switch(n){case"uppercase":return e();case"lowercase":return t();case"titlecase":return r();default:return!1}},toUpperCase:e,toLowerCase:t,toTitleCase:r},keymap:{"Mod-Shift-u":"toUpperCase","Mod-Shift-k":"toLowerCase","Mod-Shift-t":"toTitleCase"}}},gl={all:{name:"All",characters:["€","£","¥","¢","₹","₽","₩","₿","₺","₴","₦","₨","₪","₫","₭","₮","₯","₰","₱","₲","₳","₴","₵","₶","₷","₹","₺","₼","₽","₾","₿",'"',"'","«","»","„","‟","‹","›","‚","‛","〝","〞","〟","‟","„","©","®","™","°","§","¶","†","‡","•","‣","⁃","‰","‱","′","″","‴","‵","‶","‷","※","‼","‽","‾","‿","⁀","⁁","⁂","⁃","⁇","⁈","⁉","+","-","×","÷","=","≠","≈","≡","≤","≥","<",">","±","∓","∴","∵","∶","∷","∸","∹","∺","∻","∼","∽","∾","∿","≀","≁","≂","≃","≄","≅","≆","≇","≈","≉","≊","≋","≌","≍","≎","≏","≐","≑","≒","≓","≔","≕","≖","≗","≘","≙","≚","≛","≜","≝","≞","≟","≠","≡","≢","≣","≤","≥","≦","≧","≨","≩","≪","≫","≬","≭","≮","≯","≰","≱","≲","≳","≴","≵","≶","≷","≸","≹","≺","≻","≼","≽","≾","≿","À","Á","Â","Ã","Ä","Å","Æ","Ç","È","É","Ê","Ë","Ì","Í","Î","Ï","Ð","Ñ","Ò","Ó","Ô","Õ","Ö","×","Ø","Ù","Ú","Û","Ü","Ý","Þ","ß","à","á","â","ã","ä","å","æ","ç","è","é","ê","ë","ì","í","î","ï","ð","ñ","ò","ó","ô","õ","ö","÷","ø","ù","ú","û","ü","ý","þ","ÿ","¡","¿","‽","‼","⁇","⁈","⁉","※","‾","‿","⁀","⁁","⁂","⁃","←","↑","→","↓","↔","↕","↖","↗","↘","↙","↚","↛","↜","↝","↞","↟","↠","↡","↢","↣","↤","↥","↦","↧","↨","↩","↪","↫","↬","↭","↮","↯","↰","↱","↲","↳","↴","↵","↶","↷","↸","↹","↺","↻","↼","↽","↾","↿","⇀","⇁","⇂","⇃","⇄","⇅","⇆","⇇","⇈","⇉","⇊","⇋","⇌","⇍","⇎","⇏","⇐","⇑","⇒","⇓","⇔","⇕","⇖","⇗","⇘","⇙","⇚","⇛","⇜","⇝","⇞","⇟","⇠","⇡","⇢","⇣","⇤","⇥","⇦","⇧","⇨","⇩","⇪","⇫","⇬","⇭","⇮","⇯","⇰","⇱","⇲","⇳","⇴","⇵","⇶","⇷","⇸","⇹","⇺","⇻","⇼","⇽","⇾","⇿"]},currency:{name:"Currency",characters:["€","£","¥","¢","₹","₽","₩","₿","₺","₴","₦","₨","₪","₫","₭","₮","₯","₰","₱","₲","₳","₵","₶","₷","₼","₾","₿"]},text:{name:"Text",characters:["©","®","™","°","§","¶","†","‡","•","‣","⁃","‰","‱","′","″","‴","‵","‶","‷","※","‼","‽","‾","‿","⁀","⁁","⁂"]},quotation:{name:"Quotation",characters:['"',"'","«","»","„","‟","‹","›","‚","‛","〝","〞","〟"]},mathematical:{name:"Mathematical",characters:["+","-","×","÷","=","≠","≈","≡","≤","≥","<",">","±","∓","∴","∵","∶","∷","∸","∹","∺","∻","∼","∽","∾","∿","≀","≁","≂","≃","≄","≅","≆","≇","≉","≊","≋","≌","≍","≎","≏","≐","≑","≒","≓","≔","≕","≖","≗","≘","≙","≚","≛","≜","≝","≞","≟","≢","≣","≦","≧","≨","≩","≪","≫","≬","≭","≮","≯","≰","≱","≲","≳","≴","≵","≶","≷","≸","≹","≺","≻","≼","≽","≾","≿"]},"extended-latin":{name:"Extended Latin",characters:["À","Á","Â","Ã","Ä","Å","Æ","Ç","È","É","Ê","Ë","Ì","Í","Î","Ï","Ð","Ñ","Ò","Ó","Ô","Õ","Ö","×","Ø","Ù","Ú","Û","Ü","Ý","Þ","ß","à","á","â","ã","ä","å","æ","ç","è","é","ê","ë","ì","í","î","ï","ð","ñ","ò","ó","ô","õ","ö","÷","ø","ù","ú","û","ü","ý","þ","ÿ"]},symbols:{name:"Symbols",characters:["¡","¿","‽","‼","⁇","⁈","⁉","※","‾","‿","⁀","⁁","⁂","⁃"]},arrows:{name:"Arrows",characters:["←","↑","→","↓","↔","↕","↖","↗","↘","↙","↚","↛","↜","↝","↞","↟","↠","↡","↢","↣","↤","↥","↦","↧","↨","↩","↪","↫","↬","↭","↮","↯","↰","↱","↲","↳","↴","↵","↶","↷","↸","↹","↺","↻","↼","↽","↾","↿","⇀","⇁","⇂","⇃","⇄","⇅","⇆","⇇","⇈","⇉","⇊","⇋","⇌","⇍","⇎","⇏","⇐","⇑","⇒","⇓","⇔","⇕","⇖","⇗","⇘","⇙","⇚","⇛","⇜","⇝","⇞","⇟","⇠","⇡","⇢","⇣","⇤","⇥","⇦","⇧","⇨","⇩","⇪","⇫","⇬","⇭","⇮","⇯","⇰","⇱","⇲","⇳","⇴","⇵","⇶","⇷","⇸","⇹","⇺","⇻","⇼","⇽","⇾","⇿"]}},ic={"€":"euro","£":"pound","¥":"yen","¢":"cent","₹":"rupee","₽":"ruble","₩":"won","₿":"bitcoin",'"':"quote","'":"apostrophe","«":"left angle quote","»":"right angle quote","„":"low quote","©":"copyright","®":"registered","™":"trademark","°":"degree","§":"section","¶":"paragraph","†":"dagger","‡":"double dagger","•":"bullet","‰":"per mille","′":"prime","″":"double prime","+":"plus","-":"minus","×":"multiplication","÷":"division","=":"equals","≠":"not equal","≈":"approximately","≡":"identical","≤":"less or equal","≥":"greater or equal","±":"plus minus",À:"a grave",Á:"a acute",Â:"a circumflex",Ã:"a tilde",Ä:"a diaeresis",Ç:"c cedilla","←":"left arrow","↑":"up arrow","→":"right arrow","↓":"down arrow","↔":"left right arrow"};let bl=!1;const Hg='[data-theme="dark"], .dark, .editora-theme-dark',Lf=()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return null;const t=e.anchorNode,r=t instanceof HTMLElement?t:t==null?void 0:t.parentElement;return(r==null?void 0:r.closest(".rte-content, .editora-content"))||null},Og=e=>{const t=e||Lf();return t?!!t.closest(Hg):!1},zg=()=>{if(typeof document>"u")return;const e="special-characters-plugin-styles";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
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
  `,document.head.appendChild(t)},qg=e=>{const t=window.getSelection();if(t&&t.rangeCount>0){const r=t.getRangeAt(0);r.deleteContents();const n=document.createTextNode(e);r.insertNode(n),r.setStartAfter(n),r.setEndAfter(n),t.removeAllRanges(),t.addRange(r)}},_g=e=>{if(typeof window>"u"||bl)return;bl=!0,zg();let t="all",r="",n=null;const o=document.createElement("div");o.className="special-characters-overlay",Og(e)&&o.classList.add("rte-ui-theme-dark");const a=document.createElement("div");a.className="special-characters-dialog",a.setAttribute("role","dialog"),a.setAttribute("aria-modal","true"),a.innerHTML=`
    <div class="special-characters-header">
      <h2>Insert Special Characters</h2>
      <button class="special-characters-close">×</button>
    </div>
    <div class="special-characters-content">
      <div class="special-characters-tabs">
        ${Object.keys(gl).map(p=>`
          <button class="special-characters-tab ${t===p?"active":""}" data-category="${p}">
            ${gl[p].name}
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
  `;const i=a.querySelector(".special-characters-tabs"),l=a.querySelector(".special-characters-grid"),s=a.querySelector(".special-characters-search-input"),c=a.querySelector(".special-characters-close"),d=()=>gl[t].characters.filter(p=>{if(!r.trim())return!0;const y=r.toLowerCase();return p.toLowerCase().includes(y)||(ic[p]||"").toLowerCase().includes(y)}),u=()=>{i==null||i.querySelectorAll(".special-characters-tab").forEach(p=>{p.classList.toggle("active",p.getAttribute("data-category")===t)})},f=()=>{if(!l)return;const p=d();if(p.length===0){l.innerHTML=`<div class="special-characters-no-results">No characters found for "${r}"</div>`;return}l.innerHTML=p.map(y=>`
      <button class="special-characters-item" data-char="${y}" title="${ic[y]||y}">
        ${y}
      </button>
    `).join("")},m=()=>{n!==null&&(window.clearTimeout(n),n=null),o.parentNode&&o.parentNode.removeChild(o),bl=!1,document.removeEventListener("keydown",g,!0)},g=p=>{p.key==="Escape"&&(p.preventDefault(),p.stopPropagation(),m())};c==null||c.addEventListener("click",m),i==null||i.addEventListener("click",p=>{const b=p.target.closest(".special-characters-tab");if(!b)return;const x=b.getAttribute("data-category");!x||t===x||(t=x,u(),f())}),s==null||s.addEventListener("input",p=>{r=p.target.value,n!==null&&window.clearTimeout(n),n=window.setTimeout(()=>{n=null,f()},90)}),l==null||l.addEventListener("click",p=>{const b=p.target.closest(".special-characters-item");if(!b)return;const x=b.getAttribute("data-char");x&&(qg(x),m())}),o.addEventListener("click",p=>{p.target===o&&m()}),document.addEventListener("keydown",g,!0),u(),f(),o.appendChild(a),document.body.appendChild(o),requestAnimationFrame(()=>s==null?void 0:s.focus())},Fg=()=>({name:"specialCharacters",toolbar:[{label:"Special Characters",command:"insertSpecialCharacter",icon:'<svg width="24" height="24" focusable="false"><path d="M15 18h4l1-2v4h-6v-3.3l1.4-1a6 6 0 0 0 1.8-2.9 6.3 6.3 0 0 0-.1-4.1 5.8 5.8 0 0 0-3-3.2c-.6-.3-1.3-.5-2.1-.5a5.1 5.1 0 0 0-3.9 1.8 6.3 6.3 0 0 0-1.3 6 6.2 6.2 0 0 0 1.8 3l1.4.9V20H4v-4l1 2h4v-.5l-2-1L5.4 15A6.5 6.5 0 0 1 4 11c0-1 .2-1.9.6-2.7A7 7 0 0 1 6.3 6C7.1 5.4 8 5 9 4.5c1-.3 2-.5 3.1-.5a8.8 8.8 0 0 1 5.7 2 7 7 0 0 1 1.7 2.3 6 6 0 0 1 .2 4.8c-.2.7-.6 1.3-1 1.9a7.6 7.6 0 0 1-3.6 2.5v.5Z" fill-rule="evenodd"></path></svg>'}],commands:{insertSpecialCharacter:(e,t)=>{const r=(t==null?void 0:t.contentElement)instanceof HTMLElement?t.contentElement:Lf();return _g(r),!0}},keymap:{}}),Nl={all:{name:"All",emojis:["❤️","💔","💙","💚","💛","🖤","🤍","🤎","✔️","❌","☑️","❗","❓","⚠️","💯","➕","➖","✖️","➗","♻️","⚡","🔥","✨","⭐","⭕","🚫","😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😍","😘","😎","🤓","😐","😑","😬","🙄","😏","😌","🤩","🥳","🤔","😴","😭","😢","😡","🤯","👍","👎","👌","✌️","🤞","🙏","👏","🙌","💪","🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦅","🦄","🐝","🦋","🌲","🌳","🌴","🌵","🌸","🌼","🌻","☀️","🌙","⭐","🌈","🌧️","❄️","🌊","🍎","🍌","🍉","🍇","🍓","🍒","🍍","🥭","🍐","🍊","🍋","🍑","🥝","🥑","🍔","🍟","🍕","🌭","🥪","🌮","🌯","🍣","🍜","🍰","🧁","🍩","🍪","🍫","☕","🍵","🥤","🍺","🍷","🍸","🍹","🥂","⚽","🏀","🏈","⚾","🎾","🏐","🏉","🎮","🎯","🎳","🎲","♟️","🏃","🚴","🏊","🏋️","🧘","🎸","🎹","🥁","🎺","🎤","🏆","🥇","🚗","🚕","🚌","🚎","🚓","🚑","🚒","✈️","🚀","🚁","🚤","🛳️","🚢","🏠","🏢","🏬","🏫","🏥","🏰","🗼","🗽","⛩️","🕌","🌍","🌎","🌏","🏖️","🏝️","📱","💻","🖥️","⌨️","🖱️","📷","📸","🎥","📹","📚","📖","📝","📄","📂","🔒","🔑","🗝️","💡","🔦","🕯️","🧰","🛠️","🔧","⚙️","📦","💳","💰","🔋","🔌","🇮🇳","🇺🇸","🇬🇧","🇨🇦","🇦🇺","🇩🇪","🇫🇷","🇪🇸","🇮🇹","🇯🇵","🇰🇷","🇨🇳","🇧🇷","🇲🇽","🇷🇺","🇿🇦","🇳🇿"]},symbols:{name:"Symbols",emojis:["❤️","💔","💙","💚","💛","🖤","🤍","🤎","✔️","❌","☑️","❗","❓","⚠️","💯","➕","➖","✖️","➗","♻️","⚡","🔥","✨","⭐","⭕","🚫","⬆️","⬇️","⬅️","➡️","🔄","🔁","🔀","🔔","🔕","⏰","⌛","⏳"]},people:{name:"People",emojis:["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😍","😘","😎","🤓","😐","😑","😬","🙄","😏","😌","🤩","🥳","🤔","😴","😭","😢","😡","🤯","👍","👎","👌","✌️","🤞","🙏","👏","🙌","💪"]},"animals-nature":{name:"Animals & Nature",emojis:["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦅","🦄","🐝","🦋","🌲","🌳","🌴","🌵","🌸","🌼","🌻","☀️","🌙","⭐","🌈","🌧️","❄️","🌊"]},"food-drink":{name:"Food & Drink",emojis:["🍎","🍌","🍉","🍇","🍓","🍒","🍍","🥭","🍐","🍊","🍋","🍑","🥝","🥑","🍔","🍟","🍕","🌭","🥪","🌮","🌯","🍣","🍜","🍰","🧁","🍩","🍪","🍫","☕","🍵","🥤","🍺","🍷","🍸","🍹","🥂"]},activity:{name:"Activity",emojis:["⚽","🏀","🏈","⚾","🎾","🏐","🏉","🎮","🎯","🎳","🎲","♟️","🏃","🚴","🏊","🏋️","🧘","🎸","🎹","🥁","🎺","🎤","🏆","🥇","🥈","🥉"]},"travel-places":{name:"Travel & Places",emojis:["🚗","🚕","🚌","🚎","🚓","🚑","🚒","✈️","🚀","🚁","🚤","🛳️","🚢","🏠","🏢","🏬","🏫","🏥","🏰","🗼","🗽","⛩️","🕌","🌍","🌎","🌏","🏖️","🏝️"]},objects:{name:"Objects",emojis:["📱","💻","🖥️","⌨️","🖱️","📷","📸","🎥","📹","📚","📖","📝","📄","📂","🔒","🔑","🗝️","💡","🔦","🕯️","🧰","🛠️","🔧","⚙️","📦","💳","💰","🔋","🔌"]},flags:{name:"Flags",emojis:["🇮🇳","🇺🇸","🇬🇧","🇨🇦","🇦🇺","🇩🇪","🇫🇷","🇪🇸","🇮🇹","🇯🇵","🇰🇷","🇨🇳","🇧🇷","🇲🇽","🇷🇺","🇿🇦","🇳🇿"]}},jg={"💙":"blue heart","💚":"green heart","💛":"yellow heart","🖤":"black heart","🤍":"white heart","🤎":"brown heart","☑️":"check box with check","🔴":"red circle","🟢":"green circle","🟡":"yellow circle","🔵":"blue circle","⬆️":"up arrow","⬇️":"down arrow","⬅️":"left arrow","➡️":"right arrow","🔄":"counterclockwise arrows","🔁":"repeat button","🔀":"shuffle tracks","🔔":"bell","🔕":"muted bell","⏰":"alarm clock","⏳":"hourglass not done","⌛":"hourglass done","♠️":"spade suit","♥️":"heart suit","♦️":"diamond suit","♣️":"club suit","🚫":"prohibited","⭕":"hollow red circle","❎":"cross mark button","😐":"neutral face","😑":"expressionless face","😬":"grimacing face","🙄":"face with rolling eyes","😏":"smirking face","😌":"relieved face","🤩":"star struck","😜":"winking face with tongue","😝":"squinting face with tongue","🤪":"zany face","😢":"crying face","😥":"sad but relieved face","😓":"downcast face with sweat","😱":"face screaming in fear","😨":"fearful face","🤗":"hugging face","🤭":"face with hand over mouth","🤫":"shushing face","🤥":"lying face","👌":"ok hand","✌️":"victory hand","🤞":"crossed fingers","🙌":"raising hands","💪":"flexed biceps","🐔":"chicken","🐧":"penguin","🐦":"bird","🐤":"baby chick","🦆":"duck","🦅":"eagle","🐺":"wolf","🦄":"unicorn","🐝":"honeybee","🐞":"lady beetle","🦋":"butterfly","🐢":"turtle","🐍":"snake","🦖":"t-rex","🌿":"herb","🍀":"four leaf clover","🍁":"maple leaf","🍂":"fallen leaf","🌊":"water wave","❄️":"snowflake","☁️":"cloud","⛈️":"cloud with lightning and rain","🌪️":"tornado","🍐":"pear","🍊":"tangerine","🍋":"lemon","🍑":"peach","🥝":"kiwi fruit","🥑":"avocado","🍆":"eggplant","🌽":"ear of corn","🥕":"carrot","🥔":"potato","🍞":"bread","🥐":"croissant","🥖":"baguette bread","🧀":"cheese wedge","🍖":"meat on bone","🍗":"poultry leg","🥩":"cut of meat","🍦":"soft ice cream","🍨":"ice cream","🍫":"chocolate bar","🍬":"candy","🥛":"glass of milk","🧃":"beverage box","🍹":"tropical drink","🥂":"clinking glasses","🏓":"ping pong","🥊":"boxing glove","🥋":"martial arts uniform","⛳":"flag in hole","🏹":"bow and arrow","🎿":"skis","⛷️":"skier","🏂":"snowboarder","🎤":"microphone","🎬":"clapper board","🎨":"artist palette","🧩":"puzzle piece","🪀":"yo-yo","🚇":"metro","🚉":"station","🚊":"tram","🚝":"monorail","🛻":"pickup truck","🚐":"minibus","🗺️":"world map","🧭":"compass","⛰️":"mountain","🏔️":"snow capped mountain","🌋":"volcano","🏜️":"desert","🏕️":"camping","🏙️":"cityscape","🌆":"city at dusk","🌃":"night with stars","📦":"package","📫":"closed mailbox with raised flag","📬":"open mailbox with raised flag","📭":"open mailbox with lowered flag","🧾":"receipt","💳":"credit card","💰":"money bag","🪙":"coin","🔋":"battery","🔌":"electric plug","🧯":"fire extinguisher","🪜":"ladder","🪞":"mirror","🧹":"broom","🧸":"teddy bear"};let Ga=null,ho="all",mi="",pr=null,yo=null,xo=null;const Vg='[data-theme="dark"], .dark, .editora-theme-dark',Kg=()=>({name:"emojis",toolbar:[{label:"Insert Emoji",command:"openEmojiDialog",icon:'<svg width="24" height="24" focusable="false"><path d="M9 11c.6 0 1-.4 1-1s-.4-1-1-1a1 1 0 0 0-1 1c0 .6.4 1 1 1Zm6 0c.6 0 1-.4 1-1s-.4-1-1-1a1 1 0 0 0-1 1c0 .6.4 1 1 1Zm-3 5.5c2.1 0 4-1.5 4.4-3.5H7.6c.5 2 2.3 3.5 4.4 3.5ZM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" fill-rule="nonzero"></path></svg>',shortcut:"Mod-Shift-j",type:"button"}],commands:{openEmojiDialog:(e,t)=>{const r=(t==null?void 0:t.contentElement)||Bl();return r?(Wg(r),!0):!1},insertEmoji:(e,t)=>{if(!e)return!1;const r=(t==null?void 0:t.contentElement)||Bl();if(!r)return!1;try{return Mf(e,r),!0}catch{return!1}}},keymap:{"Mod-Shift-j":"openEmojiDialog"}});function Wg(e){vo(),ho="all",mi="";const t=window.getSelection();yo=null,t&&t.rangeCount>0&&e.contains(t.anchorNode)&&(yo=t.getRangeAt(0).cloneRange());const r=document.createElement("div");r.className="emojis-overlay",Zg(e)&&r.classList.add("rte-ui-theme-dark"),r.onclick=vo;const n=document.createElement("div");n.className="emojis-dialog",n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true"),n.onclick=a=>a.stopPropagation();const o=Object.keys(Nl);n.innerHTML=`
    <div class="rte-dialog-header emojis-header">
      <h3>Insert Emojis</h3>
      <button class="rte-dialog-close emojis-close">×</button>
    </div>
    <div class="rte-dialog-body emojis-content">
      <div class="emojis-tabs">
        ${o.map(a=>`
          <button class="emojis-tab ${a===ho?"active":""}" data-category="${a}">
            ${Nl[a].name}
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
          ${Af(ho,mi)}
        </div>
      </div>
    </div>
  `,r.appendChild(n),document.body.appendChild(r),Ga=r,xo=a=>{a.key==="Escape"&&(a.preventDefault(),a.stopPropagation(),vo())},document.addEventListener("keydown",xo,!0),Ug(n,e),Yg(),requestAnimationFrame(()=>{var a;(a=n.querySelector("#emoji-search-input"))==null||a.focus()})}function Ug(e,t){var o;(o=e.querySelector(".emojis-close"))==null||o.addEventListener("click",vo),e.querySelectorAll(".emojis-tab").forEach(a=>{a.addEventListener("click",i=>{const l=i.target.getAttribute("data-category");l&&Gg(e,l)})});const r=e.querySelector("#emoji-search-input");r==null||r.addEventListener("input",a=>{mi=a.target.value,pr!==null&&window.clearTimeout(pr),pr=window.setTimeout(()=>{pr=null,$f(e)},90)});const n=e.querySelector("#emojis-grid");n==null||n.addEventListener("click",a=>{var c;const l=a.target.closest(".emojis-item");if(!l)return;const s=l.getAttribute("data-emoji")||((c=l.textContent)==null?void 0:c.trim())||"";s&&(Mf(s,t),vo())})}function Gg(e,t){ho=t,e.querySelectorAll(".emojis-tab").forEach(r=>{r.classList.toggle("active",r.getAttribute("data-category")===t)}),$f(e)}function $f(e){const t=e.querySelector("#emojis-grid");t&&(t.innerHTML=Af(ho,mi))}function Af(e,t){let r=Nl[e].emojis;return t.trim()&&(r=r.filter(n=>n.toLowerCase().includes(t.toLowerCase())?!0:(jg[n]||"").toLowerCase().includes(t.toLowerCase()))),r.length===0&&t.trim()?`<div class="emojis-no-results">No emojis found for "${t}"</div>`:r.map((n,o)=>`
    <button 
      class="emojis-item" 
      title="Insert ${n}"
      data-emoji="${n}"
    >
      ${n}
    </button>
  `).join("")}function vo(){xo&&(document.removeEventListener("keydown",xo,!0),xo=null),pr!==null&&(window.clearTimeout(pr),pr=null),Ga&&(Ga.remove(),Ga=null)}function Mf(e,t){t.focus();let r=window.getSelection();if(yo&&(r==null||r.removeAllRanges(),r==null||r.addRange(yo),yo=null),r=window.getSelection(),r&&r.rangeCount>0){const n=r.getRangeAt(0);n.deleteContents();const o=document.createTextNode(e);n.insertNode(o),n.setStartAfter(o),n.setEndAfter(o),r.removeAllRanges(),r.addRange(n)}}function Bl(){const e=window.getSelection();if(e&&e.rangeCount>0){const r=e.anchorNode,n=r instanceof HTMLElement?r:r==null?void 0:r.parentElement,o=n==null?void 0:n.closest(".editora-content, .rte-content");if(o)return o}const t=document.activeElement;return t&&(t.classList.contains("editora-content")||t.classList.contains("rte-content"))?t:document.querySelector(".editora-content, .rte-content")}function Zg(e){const t=e||Bl();return t?!!t.closest(Vg):!1}function Yg(){if(document.getElementById("emojis-dialog-styles"))return;const e=document.createElement("style");e.id="emojis-dialog-styles",e.textContent=`
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
  `,document.head.appendChild(e)}const Xg=[{label:"Inline Value",value:"inline"},{label:"Responsive - 21x9",value:"21x9"},{label:"Responsive - 16x9",value:"16x9"},{label:"Responsive - 4x3",value:"4x3"},{label:"Responsive - 1x1",value:"1x1"}],Kn='[data-theme="dark"], .dark, .editora-theme-dark',hl=new WeakMap,_t=e=>(hl.has(e)||hl.set(e,{dialogElement:null,escapeHandler:null,activeTab:"general",formData:{src:"",selectedSize:"inline",width:"100%",height:"400px",constrainProportions:!0,name:"",title:"",longDescription:"",descriptionUrl:"",showBorder:!0,enableScrollbar:!0}}),hl.get(e));function Jg(e){if(e!=null&&e.matches(Kn)||e!=null&&e.closest(Kn))return!0;const t=document.activeElement;return t!=null&&t.closest(Kn)?!0:document.body.matches(Kn)||document.documentElement.matches(Kn)}const Qg=()=>({name:"embedIframe",toolbar:[{label:"Embed Content",command:"openEmbedIframeDialog",icon:'<svg width="24" height="24" focusable="false"><path d="M19 6V5H5v14h2A13 13 0 0 1 19 6Zm0 1.4c-.8.8-1.6 2.4-2.2 4.6H19V7.4Zm0 5.6h-2.4c-.4 1.8-.6 3.8-.6 6h3v-6Zm-4 6c0-2.2.2-4.2.6-6H13c-.7 1.8-1.1 3.8-1.1 6h3Zm-4 0c0-2.2.4-4.2 1-6H9.6A12 12 0 0 0 8 19h3ZM4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm11.8 9c.4-1.9 1-3.4 1.8-4.5a9.2 9.2 0 0 0-4 4.5h2.2Zm-3.4 0a12 12 0 0 1 2.8-4 12 12 0 0 0-5 4h2.2Z" fill-rule="nonzero"></path></svg>',shortcut:"Mod-Shift-e",type:"button"}],commands:{openEmbedIframeDialog:e=>(eb(e),!0)},keymap:{"Mod-Shift-e":"openEmbedIframeDialog"}});function eb(e){if(!e){const o=document.activeElement;o&&o.closest("[data-editora-editor]")&&(e=o.closest("[data-editora-editor]"))}if(e||(e=document.querySelector("[data-editora-editor]")),!e){console.warn("Editor element not found");return}const t=_t(e);t.formData={src:"",selectedSize:"inline",width:"100%",height:"400px",constrainProportions:!0,name:"",title:"",longDescription:"",descriptionUrl:"",showBorder:!0,enableScrollbar:!0},t.activeTab="general";const r=document.createElement("div");r.className="rte-dialog-overlay rte-embed-iframe-overlay",Jg(e)&&r.classList.add("rte-theme-dark"),r.onclick=()=>Ho(e);const n=document.createElement("div");n.className="rte-dialog-content embed-iframe-dialog",n.onclick=o=>o.stopPropagation(),n.innerHTML=`
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
                ${Xg.map(o=>`<option value="${o.value}">${o.label}</option>`).join("")}
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
  `,r.appendChild(n),document.body.appendChild(r),t.dialogElement=r,t.escapeHandler=o=>{o.key==="Escape"&&(o.preventDefault(),o.stopPropagation(),Ho(e))},document.addEventListener("keydown",t.escapeHandler,!0),tb(n,e),cb(),setTimeout(()=>{var o;(o=n.querySelector("#iframe-src"))==null||o.focus()},100)}function tb(e,t){var a,i,l,s;_t(t),(a=e.querySelector(".rte-dialog-close"))==null||a.addEventListener("click",()=>Ho(t)),e.querySelectorAll(".rte-tab-button").forEach(c=>{c.addEventListener("click",d=>{const u=d.target.getAttribute("data-tab");u&&rb(e,u,t)})});const r=e.querySelector("#iframe-size");r==null||r.addEventListener("change",c=>nb(e,c.target.value,t));const n=e.querySelector("#iframe-width"),o=e.querySelector("#iframe-height");n==null||n.addEventListener("input",c=>ob(e,c.target.value,t)),o==null||o.addEventListener("input",c=>ab(e,c.target.value,t)),(i=e.querySelector("#constrain-btn"))==null||i.addEventListener("click",()=>ib(e,t)),(l=e.querySelector("#cancel-btn"))==null||l.addEventListener("click",()=>Ho(t)),(s=e.querySelector("#save-btn"))==null||s.addEventListener("click",()=>lb(e,t))}function rb(e,t,r){const n=_t(r);n.activeTab=t,e.querySelectorAll(".rte-tab-button").forEach(o=>{o.classList.toggle("active",o.getAttribute("data-tab")===t)}),e.querySelectorAll(".rte-tab-panel").forEach(o=>{o.style.display=o.getAttribute("data-panel")===t?"block":"none"})}function nb(e,t,r){const n=_t(r);n.formData.selectedSize=t;const o=e.querySelector("#dimensions-row"),a=e.querySelector("#iframe-width"),i=e.querySelector("#iframe-height");t==="inline"?(o.style.display="flex",a.value="100%",i.value="400px",n.formData.width="100%",n.formData.height="400px"):(o.style.display="none",n.formData.width="100%",n.formData.height="auto")}function ob(e,t,r){const n=_t(r);if(n.formData.width=t,n.formData.constrainProportions&&n.formData.selectedSize==="inline"){const o=parseFloat(t);if(!isNaN(o)){const a=o*9/16;n.formData.height=`${a}px`;const i=e.querySelector("#iframe-height");i&&(i.value=n.formData.height)}}}function ab(e,t,r){const n=_t(r);if(n.formData.height=t,n.formData.constrainProportions&&n.formData.selectedSize==="inline"){const o=parseFloat(t);if(!isNaN(o)){const a=o*16/9;n.formData.width=`${a}px`;const i=e.querySelector("#iframe-width");i&&(i.value=n.formData.width)}}}function ib(e,t){const r=_t(t);r.formData.constrainProportions=!r.formData.constrainProportions;const n=e.querySelector("#constrain-btn");n&&(n.textContent=r.formData.constrainProportions?"🔒":"🔓",n.className=`rte-constrain-btn ${r.formData.constrainProportions?"locked":"unlocked"}`,n.title=r.formData.constrainProportions?"Unlock proportions":"Lock proportions")}function lb(e,t){var f,m,g,p,y,b,x;const r=_t(t),n=(f=e.querySelector("#iframe-src"))==null?void 0:f.value.trim();if(!n){alert("Please enter a source URL");return}if(!n.startsWith("https://")&&!n.startsWith("http://")){alert("Please enter a valid URL starting with https:// or http://");return}const o=(m=e.querySelector("#iframe-name"))==null?void 0:m.value.trim(),a=(g=e.querySelector("#iframe-title"))==null?void 0:g.value.trim(),i=(p=e.querySelector("#iframe-longdesc"))==null?void 0:p.value.trim(),l=(y=e.querySelector("#iframe-desc-url"))==null?void 0:y.value.trim(),s=((b=e.querySelector("#iframe-border"))==null?void 0:b.checked)??!0,c=((x=e.querySelector("#iframe-scrollbar"))==null?void 0:x.checked)??!0;let d=r.formData.width,u=r.formData.height;r.formData.selectedSize!=="inline"&&(d="100%",u="auto"),sb(t,{src:n,width:d,height:u,aspectRatio:r.formData.selectedSize,name:o||void 0,title:a||void 0,longDescription:i||void 0,descriptionUrl:l||void 0,showBorder:s,enableScrollbar:c}),Ho(t)}function sb(e,t){const r=e.querySelector('[contenteditable="true"]');r&&(r.focus(),setTimeout(()=>{const n=[`src="${t.src}"`,`width="${t.width}"`,`height="${t.height}"`,"allowfullscreen",`frameborder="${t.showBorder?"1":"0"}"`,`scrolling="${t.enableScrollbar?"auto":"no"}"`];t.name&&n.push(`name="${t.name}"`),t.title&&n.push(`title="${t.title}"`),t.longDescription&&n.push(`longdesc="${t.longDescription}"`);const o=[];t.aspectRatio!=="inline"&&o.push(`rte-iframe-${t.aspectRatio}`);const a=o.length>0?`class="${o.join(" ")}"`:"",i=`data-aspect-ratio="${t.aspectRatio}"`,l=`<iframe ${n.join(" ")} ${a} ${i}></iframe>`;if(!document.execCommand("insertHTML",!1,l)){const c=window.getSelection();if(c&&c.rangeCount>0){const d=c.getRangeAt(0);d.deleteContents();const u=document.createElement("div");u.innerHTML=l;const f=document.createDocumentFragment();for(;u.firstChild;)f.appendChild(u.firstChild);d.insertNode(f)}}},10))}function Ho(e){const t=_t(e);t.escapeHandler&&(document.removeEventListener("keydown",t.escapeHandler,!0),t.escapeHandler=null),t.dialogElement&&(t.dialogElement.remove(),t.dialogElement=null)}function cb(){if(document.getElementById("embed-iframe-dialog-styles"))return;const e=document.createElement("style");e.id="embed-iframe-dialog-styles",e.textContent=`
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
  `,document.head.appendChild(e)}const Nt=new Set,Wn='[data-theme="dark"], .dark, .editora-theme-dark';function db(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function ub(){if(typeof window>"u"||window.__anchorObserverInitialized)return;window.__anchorObserverInitialized=!0,new MutationObserver(t=>{t.forEach(r=>{r.removedNodes.forEach(n=>{var o,a;if(n.nodeType===Node.ELEMENT_NODE){const i=n;if((o=i.classList)!=null&&o.contains("rte-anchor")){const s=i.id;s&&Nt.delete(s)}const l=(a=i.querySelectorAll)==null?void 0:a.call(i,".rte-anchor");l==null||l.forEach(s=>{const c=s.id;c&&Nt.delete(c)})}})})}).observe(document.body,{childList:!0,subtree:!0})}function lc(e){return!e||e.trim().length===0?{valid:!1,error:"Anchor ID cannot be empty"}:e.length>256?{valid:!1,error:"Anchor ID must be less than 256 characters"}:/^[a-z_]/.test(e)?/^[a-z0-9\-_]+$/.test(e)?{valid:!0,error:""}:{valid:!1,error:"Anchor ID can only contain letters, numbers, hyphens, and underscores"}:{valid:!1,error:"Anchor ID must start with a letter or underscore"}}function fb(){const e=kf();if(!e)return;const t=wf(e);if(!t)return;const r=t.querySelectorAll(".rte-anchor"),n=new Set;r.forEach(o=>{const a=o.id;a&&n.add(a)}),Nt.clear(),n.forEach(o=>Nt.add(o))}function pb(e){if(e){const n=e.startContainer,o=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement;if(o!=null&&o.closest(Wn))return!0}const t=window.getSelection();if(t&&t.rangeCount>0){const n=t.getRangeAt(0).startContainer,o=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement;if(o!=null&&o.closest(Wn))return!0}const r=document.activeElement;return r!=null&&r.closest(Wn)?!0:document.body.matches(Wn)||document.documentElement.matches(Wn)}function mb(e,t,r,n){fb();const o=pb(n),a=o?{overlay:"rgba(0, 0, 0, 0.62)",dialogBg:"#1f2937",panelBg:"#222d3a",border:"#3b4657",text:"#e2e8f0",muted:"#94a3b8",closeHoverBg:"#334155",fieldBg:"#111827",fieldFocusBg:"#111827",fieldBorder:"#4b5563",fieldText:"#e2e8f0",fieldPlaceholder:"#94a3b8",fieldErrorBg:"#3f2124",fieldErrorBorder:"#ef4444",cancelBg:"#334155",cancelHover:"#475569",cancelText:"#e2e8f0",saveBg:"#3b82f6",saveHover:"#2563eb",saveDisabledBg:"#374151",saveDisabledText:"#7f8ca1",help:"#9fb0c6",focusRing:"rgba(88, 166, 255, 0.25)",errorRing:"rgba(239, 68, 68, 0.25)"}:{overlay:"rgba(0, 0, 0, 0.5)",dialogBg:"#ffffff",panelBg:"#f9f9f9",border:"#e0e0e0",text:"#333333",muted:"#999999",closeHoverBg:"#e0e0e0",fieldBg:"#ffffff",fieldFocusBg:"#f9f9ff",fieldBorder:"#d0d0d0",fieldText:"#333333",fieldPlaceholder:"#9ca3af",fieldErrorBg:"#ffebee",fieldErrorBorder:"#d32f2f",cancelBg:"#f0f0f0",cancelHover:"#e0e0e0",cancelText:"#333333",saveBg:"#0066cc",saveHover:"#0052a3",saveDisabledBg:"#d0d0d0",saveDisabledText:"#999999",help:"#999999",focusRing:"rgba(0, 102, 204, 0.1)",errorRing:"rgba(211, 47, 47, 0.1)"},i=document.createElement("div");i.className="rte-anchor-dialog-overlay",i.style.cssText=`
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
  `,!document.getElementById("rte-anchor-dialog-styles")){const v=document.createElement("style");v.id="rte-anchor-dialog-styles",v.textContent=`
      @keyframes rte-anchor-dialog-appear {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .rte-anchor-dialog input:focus {
        outline: none !important;
      }
    `,document.head.appendChild(v)}let s="";const c=document.createElement("div");c.style.cssText=`
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
  `,u.onmouseover=()=>{u.style.background=a.closeHoverBg,u.style.color="#f8fafc"},u.onmouseout=()=>{u.style.background="none",u.style.color=a.muted},c.appendChild(d),c.appendChild(u);const f=document.createElement("div");f.style.cssText="padding: 20px;";const m=document.createElement("div");m.style.cssText="margin-bottom: 0;";const g=document.createElement("label");g.textContent="Anchor ID",g.style.cssText=`display: block; font-size: 14px; font-weight: 500; color: ${a.text}; margin-bottom: 8px;`,g.setAttribute("for","anchor-id-input");const p=document.createElement("input");p.id="anchor-id-input",p.type="text",p.placeholder="e.g., section-introduction",p.value=t||"",p.style.cssText=`
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
  `,p.style.setProperty("caret-color",a.fieldText);const y=document.createElement("div");y.style.cssText=`
    color: #d32f2f;
    font-size: 12px;
    margin-top: 6px;
    display: none;
  `;const b=document.createElement("div");b.textContent="URL-safe ID (letters, numbers, hyphens, underscores). Must start with letter or underscore.",b.style.cssText=`color: ${a.help}; font-size: 12px; margin-top: 8px; line-height: 1.4;`,m.appendChild(g),m.appendChild(p),m.appendChild(y),m.appendChild(b),f.appendChild(m);const x=document.createElement("div");x.style.cssText=`
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    border-top: 1px solid ${a.border};
    background: ${a.panelBg};
    justify-content: flex-end;
  `;const C=document.createElement("button");C.textContent="Cancel",C.style.cssText=`
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${a.cancelBg};
    color: ${a.cancelText};
  `,C.onmouseover=()=>C.style.background=a.cancelHover,C.onmouseout=()=>C.style.background=a.cancelBg;const k=document.createElement("button");k.textContent=e==="add"?"Add Anchor":"Save Changes",k.style.cssText=`
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${a.saveBg};
    color: white;
  `,k.disabled=!p.value.trim();const T=()=>{p.value.trim()?(k.disabled=!1,k.style.background=a.saveBg,k.style.color="white",k.style.cursor="pointer"):(k.disabled=!0,k.style.background=a.saveDisabledBg,k.style.color=a.saveDisabledText,k.style.cursor="not-allowed")};k.onmouseover=()=>{k.disabled||(k.style.background=a.saveHover,k.style.boxShadow=o?"0 2px 8px rgba(59, 130, 246, 0.35)":"0 2px 8px rgba(0, 102, 204, 0.3)")},k.onmouseout=()=>{k.disabled||(k.style.background=a.saveBg,k.style.boxShadow="none")},x.appendChild(C),x.appendChild(k),p.oninput=()=>{const v=p.value;if(T(),v.trim()){const E=lc(v);E.valid?e==="add"&&Nt.has(v)?(s=`Anchor ID already exists: ${v}`,y.textContent="⚠ "+s,y.style.display="block",p.style.borderColor=a.fieldErrorBorder,p.style.background=a.fieldErrorBg):e==="edit"&&v!==t&&Nt.has(v)?(s=`Anchor ID already exists: ${v}`,y.textContent="⚠ "+s,y.style.display="block",p.style.borderColor=a.fieldErrorBorder,p.style.background=a.fieldErrorBg):(s="",y.style.display="none",p.style.borderColor=a.fieldBorder,p.style.background=a.fieldBg):(s=E.error,y.textContent="⚠ "+s,y.style.display="block",p.style.borderColor=a.fieldErrorBorder,p.style.background=a.fieldErrorBg)}else y.style.display="none",p.style.borderColor=a.fieldBorder,p.style.background=a.fieldBg},p.onfocus=()=>{p.style.borderColor=s?a.fieldErrorBorder:a.saveBg,p.style.boxShadow=s?`0 0 0 3px ${a.errorRing}`:`0 0 0 3px ${a.focusRing}`,p.style.background=s?a.fieldErrorBg:a.fieldFocusBg},p.onblur=()=>{p.style.boxShadow="none",s||(p.style.background=a.fieldBg)};const $=()=>{const v=p.value.trim();!v||!lc(v).valid||e==="add"&&Nt.has(v)||e==="edit"&&v!==t&&Nt.has(v)||(r&&r(v),i.remove())},w=()=>{i.remove()};k.onclick=$,C.onclick=w,u.onclick=w,p.onkeydown=v=>{v.key==="Enter"?(v.preventDefault(),$()):v.key==="Escape"&&(v.preventDefault(),w())},i.onclick=v=>{v.target===i&&w()},l.appendChild(c),l.appendChild(f),l.appendChild(x),i.appendChild(l),document.body.appendChild(i),setTimeout(()=>p.focus(),100)}function gb(e,t){let r;if(t)r=t;else{const s=window.getSelection();if(!s||s.rangeCount===0)return;r=s.getRangeAt(0)}let n=null,o=r.startContainer;for(;o&&o!==document.body;){if(o.nodeType===Node.ELEMENT_NODE){const s=o;if(s.getAttribute("contenteditable")==="true"){n=s;break}}o=o.parentNode}const a=(n==null?void 0:n.innerHTML)??"",i=document.createElement("span");i.id=e,i.className="rte-anchor",i.setAttribute("data-type","anchor"),i.setAttribute("data-anchor-id",e),i.setAttribute("title",`Anchor: ${e}`),i.style.cssText=`
    display: inline;
    position: relative;
    cursor: pointer;
  `,r.insertNode(i),Nt.add(e),r.setStart(i.nextSibling||i.parentNode,0),r.collapse(!0);const l=window.getSelection();if(l&&(l.removeAllRanges(),l.addRange(r)),n)db(n,a),n.dispatchEvent(new Event("input",{bubbles:!0}));else{const s=kf();if(s){const c=wf(s);c&&c.dispatchEvent(new Event("input",{bubbles:!0}))}}Rf()}function Rf(){if(document.getElementById("rte-anchor-styles"))return;const e=document.createElement("style");e.id="rte-anchor-styles",e.textContent=`
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
  `,document.head.appendChild(e)}const bb=()=>(typeof window<"u"&&(ub(),Rf()),{name:"anchor",toolbar:[{label:"Anchor",command:"insertAnchor",icon:'<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 8.4C13.4912 8.4 14.7 7.19117 14.7 5.7C14.7 4.20883 13.4912 3 12 3C10.5088 3 9.3 4.20883 9.3 5.7C9.3 7.19117 10.5088 8.4 12 8.4ZM12 8.4V20.9999M12 20.9999C9.61305 20.9999 7.32387 20.0518 5.63604 18.364C3.94821 16.6761 3 14.3869 3 12H5M12 20.9999C14.3869 20.9999 16.6761 20.0518 18.364 18.364C20.0518 16.6761 21 14.3869 21 12H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',shortcut:"Mod-Shift-k"}],commands:{insertAnchor:()=>{try{const e=window.getSelection();if(!e||e.rangeCount===0)return alert("Please place your cursor where you want to insert the anchor."),!1;const t=e.getRangeAt(0).cloneRange();return mb("add","",r=>{gb(r,t)},t),!0}catch(e){return console.error("Failed to insert anchor:",e),!1}}},keymap:{"Mod-Shift-k":"insertAnchor"}}),Tt=".rte-content, .editora-content",hb="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",$n='.rte-mention[data-mention="true"]',ur=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',gi=new WeakMap,bi=new WeakMap;let sc=!1,hi=!1,ko=null,ya=0;function Df(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function Nf(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function Ot(e,t){const r=window.getSelection();r&&(r.removeAllRanges(),r.addRange(t),e.focus({preventScroll:!0}))}function Vi(e,t){return e.startContainer===t.startContainer&&e.startOffset===t.startOffset&&e.endContainer===t.endContainer&&e.endOffset===t.endOffset}function vr(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);return e.contains(r.commonAncestorContainer)?r.cloneRange():null}function Oo(e){Array.from(e.querySelectorAll($n)).forEach(r=>{r.setAttribute("data-mention","true"),r.setAttribute("contenteditable","false"),r.setAttribute("spellcheck","false"),r.setAttribute("draggable","false"),r.classList.add("rte-mention")})}function cc(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function yb(e){return e.closest(hb)||e}function xa(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function xb(e){const t=yb(e);if(xa(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return xa(r)?!0:xa(document.documentElement)||xa(document.body)}function Bf(e,t){e.classList.remove("rte-mention-theme-dark"),xb(t)&&e.classList.add("rte-mention-theme-dark")}function vb(e){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const n=e.editorElement;if(n.matches(Tt))return n;const o=n.querySelector(Tt);if(o instanceof HTMLElement)return o}const t=window.getSelection();if(t&&t.rangeCount>0){const n=t.getRangeAt(0).startContainer,o=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement,a=o==null?void 0:o.closest(Tt);if(a)return a}const r=document.activeElement;if(r){if(r.matches(Tt))return r;const n=r.closest(Tt);if(n)return n}return document.querySelector(Tt)}function Br(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ms(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function kb(e,t){return t?t.split(".").filter(Boolean).reduce((r,n)=>{if(!(!ms(r)&&!Array.isArray(r)))return r[n]},e):e}function wb(e){return e?/\s|[([{"'`]/.test(e):!0}function Eb(e){if(!e.collapsed)return null;const t=e.startContainer,r=e.startOffset;if(t.nodeType===Node.TEXT_NODE){const n=t;return{node:n,textBefore:n.data.slice(0,r),caretOffset:r}}if(t.nodeType===Node.ELEMENT_NODE){const n=t;if(r>0){const o=n.childNodes[r-1];if(o&&o.nodeType===Node.TEXT_NODE){const a=o;return{node:a,textBefore:a.data,caretOffset:a.length}}}}return null}function Cb(e,t,r){let n=-1,o="";if(t.forEach(i=>{const l=e.lastIndexOf(i);l>n&&(n=l,o=i)}),n<0||!wb(e[n-1]))return null;const a=e.slice(n+1);return/\s/.test(a)||a.length>r?null:{trigger:o,query:a,startOffset:n}}function Sb(e,t){const r=t.cloneRange();r.collapse(!1);const n=r.getClientRects();if(n.length>0)return n[n.length-1];const o=document.createElement("span");o.textContent="​",o.style.position="relative",r.insertNode(o);const a=o.getBoundingClientRect();return o.remove(),e.normalize(),a}function Tb(e,t){if(e.panel&&e.list)return;const r=document.createElement("div");r.className="rte-mention-panel",r.style.display="none";const n=document.createElement("div");n.className="rte-mention-list",r.appendChild(n),document.body.appendChild(r),Bf(r,e.editor),e.panel=r,e.list=n,r.addEventListener("mousedown",o=>{o.preventDefault()}),r.addEventListener("click",o=>{const a=o.target;if(!a)return;const i=a.closest(".rte-mention-item");if(!i)return;const l=Number(i.getAttribute("data-index"));Number.isFinite(l)&&If(e,t,l)})}function it(e){e.panel&&(e.debounceHandle!==null&&(window.clearTimeout(e.debounceHandle),e.debounceHandle=null),e.abortController&&(e.abortController.abort(),e.abortController=null),e.panel.style.display="none",e.panel.classList.remove("show"),e.isOpen=!1,e.loading=!1,e.items=[],e.activeIndex=0,e.query="",e.replaceRange=null)}function dc(e,t){if(!e.panel)return;Bf(e.panel,e.editor);const r=Sb(e.editor,t),n=e.panel;n.style.display="block",n.classList.add("show"),n.style.left="0px",n.style.top="0px";const o=n.getBoundingClientRect(),a=window.innerWidth,i=window.innerHeight;let l=Math.max(8,Math.min(r.left,a-o.width-8)),s=r.bottom+8;s+o.height>i-8&&(s=Math.max(8,r.top-o.height-8)),n.style.position="fixed",n.style.left=`${l}px`,n.style.top=`${s}px`}function Lb(e,t){if(!t)return Br(e);const r=e.toLowerCase(),n=t.toLowerCase(),o=r.indexOf(n);if(o<0)return Br(e);const a=Br(e.slice(0,o)),i=Br(e.slice(o,o+t.length)),l=Br(e.slice(o+t.length));return`${a}<mark>${i}</mark>${l}`}function uc(e,t){if(!e.list)return;const r=e.list;if(r.innerHTML="",e.loading){const n=document.createElement("div");n.className="rte-mention-empty",n.textContent=t.loadingText,r.appendChild(n);return}if(e.items.length===0){const n=document.createElement("div");n.className="rte-mention-empty",n.textContent=e.query.length>0?t.noResultsText:t.emptyStateText,r.appendChild(n);return}e.items.forEach((n,o)=>{const a=document.createElement("button");a.type="button",a.className="rte-mention-item",o===e.activeIndex&&a.classList.add("active"),a.setAttribute("data-index",String(o));const i=t.itemRenderer?t.itemRenderer(n,e.query):`<span class="rte-mention-item-label">${Lb(n.label,e.query)}</span>${n.meta?`<span class="rte-mention-item-meta">${Br(n.meta)}</span>`:""}`;a.innerHTML=i,r.appendChild(a)})}function Pf(e,t){const r=new Set,n=[];return e.forEach(o=>{const a=(o.id||"").trim();!a||r.has(a)||(r.add(a),n.push({id:a,label:o.label||a,value:o.value,meta:o.meta}))}),n.slice(0,t)}function $b(e,t){if(e.buildRequest){const d=e.buildRequest(t);return{url:d.url,init:d.init||{}}}const r=(e.method||"GET").toUpperCase(),n=typeof e.headers=="function"?e.headers(t):e.headers||{},o=e.queryParam||"q",a=e.triggerParam||"trigger",i=e.limitParam||"limit",l=e.staticParams||{},s={method:r,headers:{...n},credentials:e.credentials,mode:e.mode,cache:e.cache,signal:t.signal},c=new URL(e.url,window.location.origin);if(r==="GET"||r==="HEAD"){const d=new URLSearchParams(c.search);Object.entries(l).forEach(([u,f])=>d.set(u,String(f))),d.set(o,t.query),d.set(a,t.trigger),d.set(i,String(t.limit)),c.search=d.toString()}else{const d=typeof e.body=="function"?e.body(t):e.body,u={[o]:t.query,[a]:t.trigger,[i]:t.limit,...l},f=d??u;if(ms(f)){s.body=JSON.stringify(f);const m=s.headers;!m["Content-Type"]&&!m["content-type"]&&(m["Content-Type"]="application/json")}else s.body=f}return{url:c.toString(),init:s}}async function Ab(e,t,r,n){var c;const o=t.api;if(!o)return[];e.abortController&&e.abortController.abort();const a=new AbortController;e.abortController=a;const i={query:r,trigger:n,limit:t.maxSuggestions,signal:a.signal},l=Math.max(0,o.timeoutMs??1e4);let s=null;l>0&&(s=window.setTimeout(()=>a.abort(),l));try{const{url:d,init:u}=$b(o,i),f=await fetch(d,{...u,signal:a.signal});if(!f.ok)throw new Error(`Mention API request failed: ${f.status}`);const g=(o.responseType||"json")==="text"?await f.text():await f.json();let p=[];if(o.transformResponse)p=o.transformResponse(g,i)||[];else{const y=kb(g,o.responsePath);p=(Array.isArray(y)?y:Array.isArray(g)?g:[]).map((x,C)=>{if(o.mapItem)return o.mapItem(x,C);if(!ms(x))return null;const k=String(x.id??x.value??x.key??"").trim();if(!k)return null;const T=String(x.label??x.name??k).trim();return{id:k,label:T,value:x.value?String(x.value):void 0,meta:x.meta?String(x.meta):void 0}}).filter(x=>!!x)}return Pf(p,t.maxSuggestions)}catch(d){return(d==null?void 0:d.name)!=="AbortError"&&((c=o.onError)==null||c.call(o,d,i)),[]}finally{s!==null&&window.clearTimeout(s),e.abortController===a&&(e.abortController=null)}}async function Mb(e,t,r,n){const o=++e.requestId;let a=[];if(t.search){const i=await t.search(r,n);a=Array.isArray(i)?i:[]}else if(t.api)a=await Ab(e,t,r,n);else{const i=r.toLowerCase();a=t.items.filter(l=>i?l.label.toLowerCase().includes(i)||l.id.toLowerCase().includes(i):!0)}return o!==e.requestId?[]:Pf(a,t.maxSuggestions)}function Rb(e,t,r){const n=e.editor;if(Oo(n),!window.getSelection())return!1;const a=n.innerHTML;let i=e.replaceRange?e.replaceRange.cloneRange():vr(n);if(!i||!n.contains(i.commonAncestorContainer)&&(i=vr(n),!i))return!1;const l=Ki(n,i.cloneRange(),"after");Vi(l,i)||(Ot(n,l),i=l),i.deleteContents();const s=document.createElement("span");s.className="rte-mention",s.setAttribute("data-mention","true"),s.setAttribute("data-mention-id",r.id),s.setAttribute("contenteditable","false"),s.textContent=r.value||`${e.trigger}${r.label}`,i.insertNode(s);let c=s,d=1;if(t.insertSpaceAfterMention){const f=document.createTextNode(" ");s.after(f),c=f,d=1}const u=document.createRange();return u.setStart(c,d),u.collapse(!0),Ot(n,u),it(e),Oo(n),Nf(n),Df(n,a),!0}function If(e,t,r){if(r<0||r>=e.items.length)return;const n=e.items[r];Rb(e,t,n)}function Db(e){return e.startContainer!==e.endContainer||e.startContainer.nodeType!==Node.ELEMENT_NODE||e.endOffset-e.startOffset!==1?null:e.startContainer.childNodes[e.startOffset]||null}function Nb(e,t){const r=Db(e);return!(r instanceof HTMLElement)||!r.matches($n)||!t.contains(r)?null:r}function Hf(e,t){const r=Nb(e,t);if(r)return r;const n=cc(e.startContainer),o=n==null?void 0:n.closest($n);if(o&&t.contains(o))return o;const a=cc(e.endContainer),i=a==null?void 0:a.closest($n);return i&&t.contains(i)?i:null}function Ki(e,t,r="after"){const n=Hf(t,e);if(!n)return t;const o=document.createRange();return r==="before"?o.setStartBefore(n):o.setStartAfter(n),o.collapse(!0),o}function fc(e,t,r="after"){const n=document.createRange();r==="before"?n.setStartBefore(t):n.setStartAfter(t),n.collapse(!0),Ot(e,n)}function Bb(e,t,r){if(!e.collapsed)return null;const n=e.startContainer,o=e.startOffset;let a=null;if(n.nodeType===Node.TEXT_NODE){const i=n;t==="backward"&&o===0?a=i.previousSibling:t==="forward"&&o===i.length&&(a=i.nextSibling)}else if(n.nodeType===Node.ELEMENT_NODE){const i=n;t==="backward"&&o>0?a=i.childNodes[o-1]||null:t==="forward"&&o<i.childNodes.length&&(a=i.childNodes[o]||null)}return!(a instanceof HTMLElement)||!a.matches($n)||!r.contains(a)?null:a}function pc(e,t){const r=vr(e);if(!r)return!1;const n=Bb(r,t,e);if(!n)return!1;const o=n.parentNode;if(!o)return!1;const a=e.innerHTML,i=Array.prototype.indexOf.call(o.childNodes,n);n.remove();const l=document.createRange();return l.setStart(o,Math.max(0,i)),l.collapse(!0),Ot(e,l),Nf(e),Df(e,a),!0}function Of(e,t,r,n,o,a){if(Tb(e,t),e.query=n,e.trigger=o,e.replaceRange=a.cloneRange(),e.loading=!!(t.api&&!t.search),e.debounceHandle!==null&&(window.clearTimeout(e.debounceHandle),e.debounceHandle=null),!e.panel)return;e.isOpen||(e.panel.style.display="block",e.panel.classList.add("show"),e.isOpen=!0),uc(e,t),dc(e,r);const i=()=>{e.debounceHandle=null,Mb(e,t,n,o).then(s=>{e.loading=!1,e.items=s,e.activeIndex=0,e.panel&&(uc(e,t),dc(e,r))})},l=t.api&&!t.search?Math.max(0,t.api.debounceMs??180):0;l>0?e.debounceHandle=window.setTimeout(i,l):i()}function Pb(e,t){const r=e.editor;Oo(r);let n=vr(r);if(!n||!n.collapsed){it(e);return}const o=Ki(r,n.cloneRange(),"after");if(!Vi(o,n)){Ot(r,o),n=o,it(e);return}const a=Eb(n);if(!a){it(e);return}const i=Cb(a.textBefore,t.triggerChars,t.maxQueryLength);if(!i){it(e);return}if(i.query.length<t.minChars){it(e);return}const l=n.cloneRange();l.setStart(a.node,i.startOffset),l.setEnd(a.node,a.caretOffset),Of(e,t,n,i.query,i.trigger,l)}function mc(e,t){if(e.items.length===0)return;const r=e.items.length;if(e.activeIndex=((e.activeIndex+t)%r+r)%r,!e.list)return;const n=Array.from(e.list.querySelectorAll(".rte-mention-item"));n.forEach((a,i)=>a.classList.toggle("active",i===e.activeIndex));const o=n[e.activeIndex];o==null||o.scrollIntoView({block:"nearest"})}function Ib(e){return{editor:e,panel:null,list:null,replaceRange:null,items:[],activeIndex:0,query:"",trigger:"@",loading:!1,isOpen:!1,requestId:0,debounceHandle:null,abortController:null}}function Hb(e){var r;const t=gi.get(e);t&&((r=t.panel)!=null&&r.parentNode&&t.panel.parentNode.removeChild(t.panel),gi.delete(e))}function Pl(e,t,r){if(bi.has(e))return;Oo(e);const n={beforeInput:o=>{Oo(e);const a=vr(e);if(!a)return;const i=Hf(a,e);if(!i)return;const l=o.inputType||"";if(l.startsWith("insert")){if(o.preventDefault(),fc(e,i,"after"),l==="insertParagraph"||l==="insertLineBreak"){const s=l==="insertLineBreak"?"insertLineBreak":"insertParagraph";document.execCommand(s,!1);return}if(l==="insertText"||l==="insertCompositionText"){const s=o.data||"";if(!s)return;document.execCommand("insertText",!1,s)}}},input:()=>{Pb(t,r)},keydown:o=>{if(t.isOpen){if(o.key==="ArrowDown"){o.preventDefault(),mc(t,1);return}if(o.key==="ArrowUp"){o.preventDefault(),mc(t,-1);return}if(o.key==="Enter"||o.key==="Tab"){o.preventDefault(),If(t,r,t.activeIndex);return}if(o.key==="Escape"){o.preventDefault(),it(t);return}}const a=vr(e);if(a){const i=Ki(e,a.cloneRange(),"after");if(!Vi(i,a)){if(o.key==="Enter"){o.preventDefault(),Ot(e,i),document.execCommand("insertParagraph",!1);return}o.key.length===1&&!o.metaKey&&!o.ctrlKey&&!o.altKey&&Ot(e,i)}}if(o.key==="Backspace"&&pc(e,"backward")){o.preventDefault();return}if(o.key==="Delete"&&pc(e,"forward")){o.preventDefault();return}},click:o=>{const a=o.target;if(!a)return;const i=a.nodeType===Node.ELEMENT_NODE?a:a.parentElement,l=i==null?void 0:i.closest($n);!l||!e.contains(l)||(o.preventDefault(),o.stopPropagation(),fc(e,l,"after"),it(t))},blur:()=>{window.setTimeout(()=>{const o=document.activeElement;t.panel&&o&&t.panel.contains(o)||it(t)},0)},mousedown:o=>{if(!t.isOpen||!t.panel)return;const a=o.target;a&&!t.panel.contains(a)&&!e.contains(a)&&it(t)}};e.addEventListener("beforeinput",n.beforeInput),e.addEventListener("input",n.input),e.addEventListener("keydown",n.keydown),e.addEventListener("click",n.click),e.addEventListener("blur",n.blur),document.addEventListener("mousedown",n.mousedown,!0),bi.set(e,n)}function Ob(e){const t=bi.get(e);t&&(e.removeEventListener("beforeinput",t.beforeInput),e.removeEventListener("input",t.input),e.removeEventListener("keydown",t.keydown),e.removeEventListener("click",t.click),e.removeEventListener("blur",t.blur),document.removeEventListener("mousedown",t.mousedown,!0),bi.delete(e))}function zb(){if(sc||typeof document>"u")return;sc=!0;const e=document.createElement("style");e.id="rte-mention-plugin-styles",e.textContent=`
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

    ${ur} .rte-mention {
      background: rgba(37, 99, 235, 0.25);
      color: #bfdbfe;
    }

    ${ur} .rte-mention-panel,
    .rte-mention-panel.rte-mention-theme-dark {
      border-color: #364152;
      background: #1f2937;
      box-shadow: 0 22px 44px rgba(0, 0, 0, 0.48);
    }

    ${ur} .rte-mention-item,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-item {
      color: #e5e7eb;
    }

    ${ur} .rte-mention-item:hover,
    ${ur} .rte-mention-item.active,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-item:hover,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-item.active {
      background: #334155;
      color: #bfdbfe;
    }

    ${ur} .rte-mention-item-meta,
    ${ur} .rte-mention-empty,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-item-meta,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-empty {
      color: #9ca3af;
    }
  `,document.head.appendChild(e)}function qb(e){const t=(e.triggerChars||["@"]).filter(r=>typeof r=="string"&&r.length>0).map(r=>r[0]);return{triggerChars:t.length>0?t:["@"],minChars:Math.max(0,e.minChars??1),maxQueryLength:Math.max(1,e.maxQueryLength??32),maxSuggestions:Math.max(1,e.maxSuggestions??8),items:e.items||[{id:"john.doe",label:"John Doe",meta:"john@acme.com"},{id:"sarah.lee",label:"Sarah Lee",meta:"sarah@acme.com"},{id:"alex.chen",label:"Alex Chen",meta:"alex@acme.com"}],api:e.api,search:e.search,itemRenderer:e.itemRenderer,emptyStateText:e.emptyStateText||"Type to search mentions",noResultsText:e.noResultsText||"No matching mentions",loadingText:e.loadingText||"Loading...",insertSpaceAfterMention:e.insertSpaceAfterMention!==!1}}function Za(e){const t=gi.get(e);if(t)return t;const r=Ib(e);return gi.set(e,r),r}function _b(e){hi||(hi=!0,ko=t=>{const r=t.target;if(!(r instanceof Node))return;const n=r.nodeType===Node.ELEMENT_NODE?r:r.parentElement,o=(n==null?void 0:n.closest(Tt))||null;if(!o)return;const a=Za(o);Pl(o,a,e)},document.addEventListener("focusin",ko,!0))}function Fb(){!hi||!ko||(document.removeEventListener("focusin",ko,!0),hi=!1,ko=null)}const jb=(e={})=>{zb();const t=qb(e);return{name:"mentions",toolbar:[{label:"Mention",command:"insertMention",icon:'<svg width="24" height="24" focusable="false"><path d="M12.1 4a7.9 7.9 0 0 0-8 8c0 4.4 3.6 8 8 8 1.6 0 3-.4 4.4-1.3.4-.3.5-.9.2-1.3a1 1 0 0 0-1.3-.3 6 6 0 0 1-3.3.9 6 6 0 1 1 6-6v1.6c0 .8-.5 1.4-1.2 1.4-.8 0-1.2-.6-1.2-1.4V12c0-2-1.6-3.5-3.7-3.5s-3.8 1.6-3.8 3.6c0 2 1.7 3.6 3.8 3.6 1 0 1.9-.4 2.6-1 .5 1 1.4 1.6 2.5 1.6 1.8 0 3.2-1.5 3.2-3.4V12A7.9 7.9 0 0 0 12 4Zm0 9.7c-1 0-1.8-.8-1.8-1.7s.8-1.7 1.8-1.7c1 0 1.7.8 1.7 1.7s-.8 1.7-1.7 1.7Z"></path></svg>'}],commands:{insertMention:(r,n)=>{const o=vb(n);if(!o)return!1;const a=Za(o);Pl(o,a,t);let i=vr(o);i||(i=document.createRange(),i.selectNodeContents(o),i.collapse(!1),Ot(o,i));const l=Ki(o,i.cloneRange(),"after");Vi(l,i)||(Ot(o,l),i=l),a.query="";const s=i.cloneRange();return a.trigger=t.triggerChars[0],Of(a,t,i,"",a.trigger,s),!0}},init:()=>{ya+=1,_b(t),Array.from(document.querySelectorAll(Tt)).forEach(n=>{const o=Za(n);Pl(n,o,t)})},destroy:()=>{ya=Math.max(0,ya-1),Array.from(document.querySelectorAll(Tt)).forEach(n=>{it(Za(n)),Ob(n),Hb(n)}),ya===0&&Fb()}}},Kt=".rte-content, .editora-content",ee='[data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark',Z="rte-version-diff-overlay",gc="rte-version-diff-styles",Vb={title:"Version Diff",baseline:"Baseline",current:"Current",noChanges:"No changes detected between baseline and current content.",loading:"Preparing diff...",tabInline:"Inline Diff",tabSideBySide:"Side by Side",refresh:"Refresh",setBaseline:"Set Current as Baseline",close:"Close",mode:"Mode",ignoreWhitespace:"Ignore whitespace",largeDocFallback:"Large document fallback mode applied for performance."},kr=new WeakMap,yi=new WeakMap;let va=0,jr=null,wo=null,Il=null,Vr=null,Kr=null,Wr=null;function le(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Kb(e){return{...Vb,...e||{}}}function Hl(e,t=!0){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const o=e.editorElement;if(o.matches(Kt))return o;const a=o.querySelector(Kt);if(a instanceof HTMLElement)return a}const r=window.getSelection();if(r&&r.rangeCount>0){const o=r.getRangeAt(0).startContainer,a=o.nodeType===Node.ELEMENT_NODE?o:o.parentElement,i=a==null?void 0:a.closest(Kt);if(i)return i}const n=document.activeElement;if(n){if(n.matches(Kt))return n;const o=n.closest(Kt);if(o)return o}return Wr&&Wr.isConnected?Wr:t?document.querySelector(Kt):null}function gs(e){return e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||e}function ka(e){if(!e)return!1;const t=e.getAttribute("data-theme")||e.getAttribute("theme");if(t&&t.toLowerCase()==="dark")return!0;const r=e.classList;return r.contains("dark")||r.contains("editora-theme-dark")||r.contains("rte-theme-dark")}function bc(e){const t=gs(e);if(ka(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return!!(ka(r)||ka(document.documentElement)||ka(document.body))}function Wb(e){const t=document.createElement("textarea");return t.innerHTML=e,t.value}function bs(e){const r=gs(e).getAttribute("data-initial-content");return r?Wb(r):e.innerHTML}function zf(e){return e.replace(/\r\n?/g,`
`)}function hc(e){const t=document.createElement("div"),r=e.replace(/<br\s*\/?>/gi,`
`).replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|tr|blockquote|pre|section|article)>/gi,`$&
`);t.innerHTML=r;const n=t.textContent||"";return zf(n).replace(/\u00a0/g," ").replace(/\n{3,}/g,`

`).trim()}function yc(e,t,r){let n=zf(e);if(r&&(n=n.replace(/[ \t]+/g," ").replace(/\n{3,}/g,`

`).trim()),!n)return[];if(t==="line")return n.split(`
`);if(r)return n.split(/\s+/).filter(Boolean);const o=[],a=n.split(`
`);return a.forEach((i,l)=>{const s=i.split(/[ \t]+/).filter(Boolean);o.push(...s),l<a.length-1&&o.push(`
`)}),o}function Ub(e,t,r){if(e.length===0)return"";if(t==="line")return e.join(`
`);if(r)return e.join(" ");let n="";for(let o=0;o<e.length;o+=1){const a=e[o];if(a===`
`){n=n.replace(/[ \t]+$/g,""),n+=`
`;continue}n.length>0&&!n.endsWith(`
`)&&(n+=" "),n+=a}return n}function Gb(e,t,r){const n=[];return e.forEach(o=>{const a=n[n.length-1];if(a&&a.type===o.type){a.tokens.push(o.token);return}n.push({type:o.type,tokens:[o.token]})}),n.map(o=>({type:o.type,value:Ub(o.tokens,t,r),count:o.tokens.length}))}function Zb(e,t){let r=0;for(;r<e.length&&r<t.length&&e[r]===t[r];)r+=1;let n=e.length-1,o=t.length-1;for(;n>=r&&o>=r&&e[n]===t[o];)n-=1,o-=1;const a=e.slice(0,r),i=n<e.length-1?e.slice(n+1):[],l=r<=n?e.slice(r,n+1):[],s=r<=o?t.slice(r,o+1):[];return{prefix:a,suffix:i,aMiddle:l,bMiddle:s}}function Yb(e,t,r,n,o,a){if(e.length===0&&t.length===0)return{segments:[],insertedCount:0,deletedCount:0,equalCount:0,usedFallback:!1};const{prefix:i,suffix:l,aMiddle:s,bMiddle:c}=Zb(e,t);let d=[];i.forEach(b=>d.push({type:"equal",token:b}));const u=s.length*c.length,f=s.length>a||c.length>a||u>o;if(f)s.forEach(b=>d.push({type:"delete",token:b})),c.forEach(b=>d.push({type:"insert",token:b}));else{const b=Array.from({length:s.length+1},()=>new Uint32Array(c.length+1));for(let k=s.length-1;k>=0;k-=1){const T=b[k],$=b[k+1];for(let w=c.length-1;w>=0;w-=1)T[w]=s[k]===c[w]?$[w+1]+1:Math.max($[w],T[w+1])}let x=0,C=0;for(;x<s.length&&C<c.length;)s[x]===c[C]?(d.push({type:"equal",token:s[x]}),x+=1,C+=1):b[x+1][C]>=b[x][C+1]?(d.push({type:"delete",token:s[x]}),x+=1):(d.push({type:"insert",token:c[C]}),C+=1);for(;x<s.length;)d.push({type:"delete",token:s[x]}),x+=1;for(;C<c.length;)d.push({type:"insert",token:c[C]}),C+=1}l.forEach(b=>d.push({type:"equal",token:b}));const m=Gb(d,r,n);let g=0,p=0,y=0;return m.forEach(b=>{b.type==="insert"&&(g+=b.count),b.type==="delete"&&(p+=b.count),b.type==="equal"&&(y+=b.count)}),{segments:m,insertedCount:g,deletedCount:p,equalCount:y,usedFallback:f}}function qf(e){return le(e.value).replace(/\n/g,`
`)}function Xb(e,t){return e.length===0?`<p class="rte-version-diff-empty">${le(t.noChanges)}</p>`:e.map(r=>`<span class="${r.type==="equal"?"rte-version-diff-equal":r.type==="insert"?"rte-version-diff-insert":"rte-version-diff-delete"}">${qf(r)}</span>`).join("")}function Jb(e,t){if(e.length===0){const o=`<p class="rte-version-diff-empty">${le(t.noChanges)}</p>`;return{baselineHtml:o,currentHtml:o}}const r=[],n=[];return e.forEach(o=>{const a=qf(o);if(o.type==="equal"){r.push(`<span class="rte-version-diff-equal">${a}</span>`),n.push(`<span class="rte-version-diff-equal">${a}</span>`);return}if(o.type==="delete"){r.push(`<span class="rte-version-diff-delete">${a}</span>`);return}n.push(`<span class="rte-version-diff-insert">${a}</span>`)}),{baselineHtml:r.join(""),currentHtml:n.join("")}}function Qb(e){const t=e.metaKey||e.ctrlKey,n=(typeof e.key=="string"?e.key:"").toLowerCase(),o=typeof e.code=="string"?e.code.toLowerCase():"",a=t&&e.altKey&&!e.shiftKey&&(n==="d"||o==="keyd"),i=!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&(n==="f8"||o==="f8");return a||i}function eh(){if(typeof document>"u"||document.getElementById(gc))return;const e=document.createElement("style");e.id=gc,e.textContent=`
    .${Z} {
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

    ${ee} .rte-version-diff-dialog,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-dialog {
      background: #1f2937;
      color: #e5e7eb;
      border-color: #334155;
    }

    ${ee} .rte-version-diff-header,
    ${ee} .rte-version-diff-footer,
    ${ee} .rte-version-diff-tabs,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-header,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-footer,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-tabs {
      background: #111827;
      border-color: #334155;
    }

    ${ee} .rte-version-diff-body,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-body {
      background: #1f2937;
    }

    ${ee} .rte-version-diff-select,
    ${ee} .rte-version-diff-btn,
    ${ee} .rte-version-diff-tab,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-select,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-btn,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-tab {
      background: #0f172a;
      color: #e5e7eb;
      border-color: #475569;
    }

    ${ee} .rte-version-diff-close-btn,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-close-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    ${ee} .rte-version-diff-close-btn:hover,
    ${ee} .rte-version-diff-close-btn:focus-visible,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-close-btn:hover,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-close-btn:focus-visible {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.24);
      outline: none;
    }

    ${ee} .rte-version-diff-tab[aria-selected="true"],
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-tab[aria-selected="true"] {
      background: #1e3a8a;
      border-color: #3b82f6;
      color: #dbeafe;
    }

    ${ee} .rte-version-diff-inline,
    ${ee} .rte-version-diff-side-pane,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-inline,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-side-pane {
      background: #0f172a;
      border-color: #334155;
      color: #e5e7eb;
    }

    ${ee} .rte-version-diff-pane-title,
    ${ee} .rte-version-diff-summary,
    ${ee} .rte-version-diff-empty,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-pane-title,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-summary,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-empty {
      color: #94a3b8;
    }

    ${ee} .rte-version-diff-insert,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-insert {
      background: rgba(22, 163, 74, 0.25);
      color: #bbf7d0;
    }

    ${ee} .rte-version-diff-delete,
    .${Z}.rte-version-diff-theme-dark .rte-version-diff-delete {
      background: rgba(220, 38, 38, 0.25);
      color: #fecaca;
    }
    :is(${ee}) .rte-toolbar-item .rte-toolbar-button[data-command="openVersionDiff"] svg{
      fill: none;
    }
  `,document.head.appendChild(e)}async function th(e,t,r){if(r!=null)return r;if(typeof t.getBaselineHtml=="function"){const a=gs(e),i=await Promise.resolve(t.getBaselineHtml({editor:e,editorRoot:a}));if(typeof i=="string")return i}const n=kr.get(e);if(typeof n=="string")return n;if(typeof t.baselineHtml=="string")return t.baselineHtml;const o=bs(e);return kr.set(e,o),o}function rh(e){const t=e.querySelector('button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');t==null||t.focus()}function nh(e,t){if(e.key!=="Tab")return;const r=Array.from(t.querySelectorAll('button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(i=>!i.hasAttribute("disabled"));if(r.length===0)return;const n=r[0],o=r[r.length-1],a=document.activeElement;e.shiftKey&&a===n?(e.preventDefault(),o.focus()):!e.shiftKey&&a===o&&(e.preventDefault(),n.focus())}function _f(){wo&&(wo(),wo=null)}function xc(e){!e||kr.has(e)||kr.set(e,bs(e))}function oh(e){return{baselineHtml:e.baselineHtml,getBaselineHtml:e.getBaselineHtml,mode:e.mode||"word",ignoreWhitespace:e.ignoreWhitespace!==!1,maxTokens:Math.max(200,e.maxTokens??1200),maxMatrixSize:Math.max(5e4,e.maxMatrixSize??1e6),labels:Kb(e.labels)}}function Ff(e,t,r){_f(),Wr=e,yi.set(e,t);const n=document.createElement("div");n.className=Z,bc(e)&&n.classList.add("rte-version-diff-theme-dark");const o=document.createElement("section");o.className="rte-version-diff-dialog",o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.setAttribute("aria-labelledby","rte-version-diff-title");const a=t.labels;let i=(r==null?void 0:r.mode)||t.mode,l=(r==null?void 0:r.ignoreWhitespace)??t.ignoreWhitespace,s="inline";o.innerHTML=`
    <header class="rte-version-diff-header">
      <h2 id="rte-version-diff-title" class="rte-version-diff-title">${le(a.title)}</h2>
      <div class="rte-version-diff-controls">
        <label>
          <span>${le(a.mode)}:</span>
          <select class="rte-version-diff-select" aria-label="${le(a.mode)}">
            <option value="word">Word</option>
            <option value="line">Line</option>
          </select>
        </label>
        <label class="rte-version-diff-checkbox">
          <input type="checkbox" class="rte-version-diff-ignore-ws" ${l?"checked":""}>
          ${le(a.ignoreWhitespace)}
        </label>
        <button type="button" class="rte-version-diff-btn rte-version-diff-set-baseline" aria-label="${le(a.setBaseline)}">${le(a.setBaseline)}</button>
        <button type="button" class="rte-version-diff-btn" data-action="refresh" aria-label="${le(a.refresh)}">${le(a.refresh)}</button>
        <button type="button" class="rte-version-diff-btn rte-version-diff-close-btn" data-action="close" aria-label="${le(a.close)}">✕</button>
      </div>
    </header>

    <div class="rte-version-diff-tabs" role="tablist" aria-label="Diff views">
      <button type="button" role="tab" class="rte-version-diff-tab" data-tab="inline" aria-selected="true">${le(a.tabInline)}</button>
      <button type="button" role="tab" class="rte-version-diff-tab" data-tab="side" aria-selected="false">${le(a.tabSideBySide)}</button>
    </div>

    <main class="rte-version-diff-body">
      <div class="rte-version-diff-summary" aria-live="polite"></div>
      <section class="rte-version-diff-panel active" data-panel="inline" role="tabpanel">
        <div class="rte-version-diff-inline" aria-label="Inline diff result"></div>
      </section>
      <section class="rte-version-diff-panel" data-panel="side" role="tabpanel">
        <div class="rte-version-diff-side-grid">
          <div>
            <h3 class="rte-version-diff-pane-title">${le(a.baseline)}</h3>
            <div class="rte-version-diff-side-pane" data-side="baseline" aria-label="${le(a.baseline)}"></div>
          </div>
          <div>
            <h3 class="rte-version-diff-pane-title">${le(a.current)}</h3>
            <div class="rte-version-diff-side-pane" data-side="current" aria-label="${le(a.current)}"></div>
          </div>
        </div>
      </section>
    </main>

    <footer class="rte-version-diff-footer">
      <small>Shortcut: Ctrl/Cmd + Alt + D (fallback: F8)</small>
      <small>Esc: close</small>
    </footer>
  `,n.appendChild(o),document.body.appendChild(n);const c=o.querySelector(".rte-version-diff-select");c.value=i;const d=o.querySelector(".rte-version-diff-ignore-ws"),u=o.querySelector(".rte-version-diff-summary"),f=o.querySelector(".rte-version-diff-inline"),m=o.querySelector('[data-side="baseline"]'),g=o.querySelector('[data-side="current"]');let p=0;const y=()=>{const v=`<p class="rte-version-diff-empty">${le(a.loading)}</p>`;f.innerHTML=v,m.innerHTML=v,g.innerHTML=v,u.textContent=""},b=async v=>{p+=1;const E=p;n.classList.toggle("rte-version-diff-theme-dark",bc(e)),y();const H=e.innerHTML;let _="";try{_=await th(e,t,v??(r==null?void 0:r.baselineHtml))}catch{_=kr.get(e)??bs(e)}if(E!==p||!n.isConnected)return;const qe=hc(_),_e=hc(H),dr=yc(qe,i,l),A=yc(_e,i,l),D=Yb(dr,A,i,l,t.maxMatrixSize,t.maxTokens),ie=Jb(D.segments,a);f.innerHTML=Xb(D.segments,a),m.innerHTML=ie.baselineHtml,g.innerHTML=ie.currentHtml;const W=[`+${D.insertedCount} inserted`,`-${D.deletedCount} deleted`,`${D.equalCount} unchanged`];D.usedFallback&&W.push(a.largeDocFallback),u.textContent=W.join(" | ")},x=v=>{s=v,o.querySelectorAll(".rte-version-diff-tab").forEach(E=>{const H=E.getAttribute("data-tab")===v;E.setAttribute("aria-selected",H?"true":"false"),E.tabIndex=H?0:-1}),o.querySelectorAll(".rte-version-diff-panel").forEach(E=>{E.classList.toggle("active",E.getAttribute("data-panel")===v)})},C=()=>{n.removeEventListener("keydown",$,!0),n.removeEventListener("click",T),document.removeEventListener("keydown",k,!0),n.parentNode&&n.parentNode.removeChild(n),wo=null,e.focus({preventScroll:!0})},k=v=>{v.key==="Escape"&&(v.preventDefault(),v.stopPropagation(),C())},T=v=>{v.target===n&&C()},$=v=>{if(v.key==="Escape"){v.preventDefault(),C();return}if(nh(v,o),v.target&&v.target.classList.contains("rte-version-diff-tab")&&(v.key==="ArrowRight"||v.key==="ArrowLeft")){v.preventDefault();const E=s==="inline"?"side":"inline";x(E);const H=o.querySelector(`.rte-version-diff-tab[data-tab="${E}"]`);H==null||H.focus()}};o.addEventListener("click",v=>{const E=v.target,H=E.getAttribute("data-action");if(H==="close"){C();return}if(H==="refresh"){b();return}const _=E.getAttribute("data-tab");(_==="inline"||_==="side")&&x(_)}),c.addEventListener("change",()=>{i=c.value==="line"?"line":"word",b()}),d.addEventListener("change",()=>{l=d.checked,b()}),o.querySelector(".rte-version-diff-set-baseline").addEventListener("click",()=>{kr.set(e,e.innerHTML),b(e.innerHTML)}),n.addEventListener("keydown",$,!0),n.addEventListener("click",T),document.addEventListener("keydown",k,!0),wo=C,rh(o),b()}function ah(e){Il=e,!jr&&(jr=t=>{if(!Qb(t))return;if(document.querySelector(`.${Z}`)){t.preventDefault();return}const r=t.target;if(!!(r!=null&&r.closest("input, textarea, select")))return;const o=Hl(void 0,!1);if(!o||o.getAttribute("contenteditable")==="false")return;t.preventDefault(),t.stopPropagation();const a=yi.get(o)||Il||e;Ff(o,a)},document.addEventListener("keydown",jr,!0))}function ih(){jr&&(document.removeEventListener("keydown",jr,!0),jr=null,Il=null)}function lh(){Vr||(Vr=e=>{const t=e.target,r=t==null?void 0:t.closest(Kt);r&&(Wr=r,xc(r))},document.addEventListener("focusin",Vr,!0)),Kr||(Kr=e=>{const r=e.target,n=r==null?void 0:r.closest(Kt);n&&n.getAttribute("contenteditable")!=="false"&&(Wr=n,xc(n))},document.addEventListener("beforeinput",Kr,!0))}function sh(){Vr&&(document.removeEventListener("focusin",Vr,!0),Vr=null),Kr&&(document.removeEventListener("beforeinput",Kr,!0),Kr=null)}const ch=(e={})=>{const t=oh(e);return eh(),{name:"versionDiff",toolbar:[{id:"versionDiff",label:"Version Diff",command:"openVersionDiff",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="3.5" y="4.5" width="7" height="15" rx="1.5" stroke="currentColor" stroke-width="1.8"></rect><rect x="13.5" y="4.5" width="7" height="15" rx="1.5" stroke="currentColor" stroke-width="1.8"></rect><path d="M5.5 12h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><path d="M15.5 12h3m-1.5-1.5v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>'}],commands:{openVersionDiff:(r,n)=>{const o=Hl(n);return o?(yi.set(o,t),Ff(o,t,r),!0):!1},setVersionDiffBaseline:(r,n)=>{const o=Hl(n);if(!o)return!1;yi.set(o,t);const a=typeof r=="string"?r:typeof(r==null?void 0:r.html)=="string"?r.html:o.innerHTML;return kr.set(o,a),!0}},keymap:{"Mod-Alt-d":"openVersionDiff","Mod-Alt-D":"openVersionDiff",F8:"openVersionDiff"},init:()=>{va+=1,ah(t),lh()},destroy:()=>{va=Math.max(0,va-1),va===0&&(_f(),ih(),sh())}}},nt=".rte-content, .editora-content",er='.rte-conditional-block[data-conditional-content="true"]',K=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',F=':is([data-theme="acme"], .editora-theme-acme, .rte-theme-acme)',te=":is(.rte-content.rte-conditional-theme-dark, .editora-content.rte-conditional-theme-dark)",re=":is(.rte-content.rte-conditional-theme-acme, .editora-content.rte-conditional-theme-acme)",vc="rte-conditional-content-styles",L="rte-conditional-dialog-overlay",O="rte-conditional-floating-toolbar",kt=new WeakMap,Ol=new WeakMap,me=new WeakMap,wr=new Map,Er=new Map;let Eo=null,wa=0,Ur=null,Gr=null,Zr=null,Yr=null,Xr=null,Jr=null,Ut=null,ne=null,Qr=null;const dh={dialogTitleInsert:"Insert Conditional Content",dialogTitleEdit:"Edit Conditional Content",conditionLabel:"Condition",conditionPlaceholder:'user.role == "admin"',audienceLabel:"Audience (comma separated)",audiencePlaceholder:"all",localeLabel:"Locale (comma separated)",localePlaceholder:"all",elseLabel:"Enable Else Block",saveText:"Save",cancelText:"Cancel",blockIfLabel:"IF",blockElseLabel:"ELSE",allAudiencesText:"all audiences",allLocalesText:"all locales"};function se(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ir(e){return e?e.split(",").map(t=>t.trim()).filter(Boolean):[]}function kc(e){return!e||e.length===0?"":e.join(", ")}function An(e){return e?e.map(t=>t.trim()).filter(Boolean):[]}function uh(e){return{...dh,...e||{}}}function At(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function ia(e){return e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||e}function Ea(e){if(!e)return!1;const t=e.getAttribute("data-theme")||e.getAttribute("theme");return t&&t.toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark")}function fh(e){const t=ia(e);if(Ea(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return Ea(r)?!0:Ea(document.documentElement)||Ea(document.body)}function Ca(e){if(!e)return!1;const t=e.getAttribute("data-theme")||e.getAttribute("theme");return t&&t.toLowerCase()==="acme"?!0:e.classList.contains("editora-theme-acme")||e.classList.contains("rte-theme-acme")}function ph(e){const t=ia(e);if(Ca(t))return!0;const r=t.closest("[data-theme], [theme], .editora-theme-acme, .rte-theme-acme");return Ca(r)?!0:Ca(document.documentElement)||Ca(document.body)}function mh(e){return fh(e)?"dark":ph(e)?"acme":"light"}function Wi(e,t){const r=mh(t);e.classList.remove("rte-conditional-theme-dark","rte-conditional-theme-acme"),r==="dark"?e.classList.add("rte-conditional-theme-dark"):r==="acme"&&e.classList.add("rte-conditional-theme-acme")}function ht(e,t=!0){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const o=e.editorElement;if(o.matches(nt))return o;const a=o.querySelector(nt);if(a instanceof HTMLElement)return a}const r=window.getSelection();if(r&&r.rangeCount>0){const o=r.getRangeAt(0).startContainer,a=o.nodeType===Node.ELEMENT_NODE?o:o.parentElement,i=a==null?void 0:a.closest(nt);if(i)return i}const n=document.activeElement;if(n){if(n.matches(nt))return n;const o=n.closest(nt);if(o)return o}return ne&&ne.isConnected?ne:t?document.querySelector(nt):null}function jf(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);return e.contains(r.commonAncestorContainer)?r.cloneRange():null}function hs(e,t){const r=window.getSelection();r&&(r.removeAllRanges(),r.addRange(t),e.focus({preventScroll:!0}))}function Vf(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function Kf(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function xi(e,t){const r=document.createRange();r.selectNodeContents(t),r.collapse(!1),hs(e,r)}function yl(e,t){if(t)return t.split(".").filter(Boolean).reduce((r,n)=>{if(r!=null&&typeof r=="object")return r[n]},e)}function gh(e){const t=e.trim();if(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))return t.slice(1,-1);if(t==="true")return!0;if(t==="false")return!1;if(t==="null")return null;const r=Number(t);if(!Number.isNaN(r)&&t!=="")return r;if(t.startsWith("[")&&t.endsWith("]")||t.startsWith("{")&&t.endsWith("}"))try{return JSON.parse(t)}catch{return t}return t}function bh(e,t){const r=e.trim();if(!r)return!0;if(r.startsWith("!")){const c=r.slice(1).trim();return!yl(t,c)}const n=r.match(/^([a-zA-Z_$][\w.$]*)\s*(==|!=|>=|<=|>|<|in|contains|~=)\s*(.+)$/);if(!n)return!!yl(t,r);const[,o,a,i]=n,l=yl(t,o),s=gh(i);switch(a){case"==":return l==s;case"!=":return l!=s;case">":return Number(l)>Number(s);case"<":return Number(l)<Number(s);case">=":return Number(l)>=Number(s);case"<=":return Number(l)<=Number(s);case"in":return Array.isArray(s)?s.some(c=>c==l):typeof s=="string"?s.split(",").map(c=>c.trim()).includes(String(l)):!1;case"contains":case"~=":return Array.isArray(l)?l.some(c=>String(c).toLowerCase()===String(s).toLowerCase()):typeof l=="string"?l.toLowerCase().includes(String(s).toLowerCase()):!1;default:return!1}}function hh(){if(typeof document>"u"||document.getElementById(vc))return;const e=document.createElement("style");e.id=vc,e.textContent=`
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

    .${L} {
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

    .${O} {
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

    .${O}.show {
      display: inline-flex;
    }

    .${O} .rte-conditional-float-btn {
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

    .${O} .rte-conditional-float-btn:hover {
      background: #f8fafc;
    }

    .${O} .rte-conditional-float-btn[data-action="delete"] {
      border-color: #fecaca;
      color: #991b1b;
      background: #fff5f5;
    }

    .rte-conditional-preview-on ${er} {
      border-width: 2px;
    }

    .rte-conditional-preview-on ${er} .rte-conditional-header {
      background: #ecfeff;
      border-color: #bae6fd;
    }

    ${K} .rte-conditional-block,
    ${te} .rte-conditional-block,
    .${L}.rte-conditional-theme-dark .rte-conditional-block {
      background: #111827;
      border-color: #334155;
    }

    ${K} .rte-conditional-header,
    ${K} .rte-conditional-else-label,
    ${te} .rte-conditional-header,
    ${te} .rte-conditional-else-label,
    .${L}.rte-conditional-theme-dark .rte-conditional-header,
    .${L}.rte-conditional-theme-dark .rte-conditional-else-label {
      background: #0f172a;
      border-color: #334155;
    }

    ${K} .rte-conditional-summary,
    ${te} .rte-conditional-summary,
    .${L}.rte-conditional-theme-dark .rte-conditional-summary {
      color: #e2e8f0;
    }

    ${K} .rte-conditional-meta,
    ${te} .rte-conditional-meta,
    .${L}.rte-conditional-theme-dark .rte-conditional-meta {
      color: #94a3b8;
    }

    ${K} .rte-conditional-chip,
    ${te} .rte-conditional-chip,
    .${L}.rte-conditional-theme-dark .rte-conditional-chip {
      background: #1e3a8a;
      border-color: #3b82f6;
      color: #dbeafe;
    }

    ${K} .rte-conditional-chip-else,
    ${te} .rte-conditional-chip-else,
    .${L}.rte-conditional-theme-dark .rte-conditional-chip-else {
      background: #7f1d1d;
      border-color: #ef4444;
      color: #fee2e2;
    }

    ${K} .rte-conditional-body,
    ${te} .rte-conditional-body,
    .${L}.rte-conditional-theme-dark .rte-conditional-body {
      background: #1f2937;
      color: #e2e8f0;
    }

    ${K} .rte-conditional-dialog,
    ${te} .rte-conditional-dialog,
    .${L}.rte-conditional-theme-dark .rte-conditional-dialog {
      background: #1f2937;
      border-color: #334155;
    }

    ${K} .rte-conditional-dialog-header,
    ${K} .rte-conditional-dialog-footer,
    ${te} .rte-conditional-dialog-header,
    ${te} .rte-conditional-dialog-footer,
    .${L}.rte-conditional-theme-dark .rte-conditional-dialog-header,
    .${L}.rte-conditional-theme-dark .rte-conditional-dialog-footer {
      background: #111827;
      border-color: #334155;
    }

    ${K} .rte-conditional-dialog-title,
    ${K} .rte-conditional-field label,
    ${K} .rte-conditional-checkbox,
    ${te} .rte-conditional-dialog-title,
    ${te} .rte-conditional-field label,
    ${te} .rte-conditional-checkbox,
    .${L}.rte-conditional-theme-dark .rte-conditional-dialog-title,
    .${L}.rte-conditional-theme-dark .rte-conditional-field label,
    .${L}.rte-conditional-theme-dark .rte-conditional-checkbox {
      color: #e2e8f0;
    }

    ${K} .rte-conditional-help,
    ${te} .rte-conditional-help,
    .${L}.rte-conditional-theme-dark .rte-conditional-help {
      color: #94a3b8;
    }

    ${K} .rte-conditional-field input[type="text"],
    ${K} .rte-conditional-btn,
    ${te} .rte-conditional-field input[type="text"],
    ${te} .rte-conditional-btn,
    .${L}.rte-conditional-theme-dark .rte-conditional-field input[type="text"],
    .${L}.rte-conditional-theme-dark .rte-conditional-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    ${K} .rte-conditional-btn-primary,
    ${te} .rte-conditional-btn-primary,
    .${L}.rte-conditional-theme-dark .rte-conditional-btn-primary {
      border-color: #3b82f6;
      background: #2563eb;
      color: #ffffff;
    }

    ${K} .rte-toolbar-group-items.conditional-content,
    .${L}.rte-conditional-theme-dark .rte-toolbar-group-items.conditional-content,
    ${te} .rte-toolbar-group-items.conditional-content,
    ${K} .editora-toolbar-group-items.conditional-content {
      border-color: #566275;
    }

    ${K} .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    ${te} .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    ${K} .editora-toolbar-group-items.conditional-content .editora-toolbar-button {
      border-right-color: #566275;
    }

    ${K} .${O},
    .${L}.rte-conditional-theme-dark .${O},
    .${O}.rte-conditional-theme-dark {
      background: rgba(17, 24, 39, 0.98);
      border-color: #334155;
      box-shadow: 0 14px 30px rgba(2, 6, 23, 0.5);
    }

    ${K} .${O} .rte-conditional-float-btn,
    .${L}.rte-conditional-theme-dark .${O} .rte-conditional-float-btn,
    .${O}.rte-conditional-theme-dark .rte-conditional-float-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    ${K} .${O} .rte-conditional-float-btn[data-action="delete"],
    .${L}.rte-conditional-theme-dark .${O} .rte-conditional-float-btn[data-action="delete"],
    .${O}.rte-conditional-theme-dark .rte-conditional-float-btn[data-action="delete"] {
      border-color: #ef4444;
      color: #fecaca;
      background: rgba(127, 29, 29, 0.45);
    }

    ${F} .rte-conditional-block,
    ${re} .rte-conditional-block,
    .${L}.rte-conditional-theme-acme .rte-conditional-block {
      background: #f8fbff;
      border-color: #cbd8e8;
    }

    ${F} .rte-conditional-header,
    ${F} .rte-conditional-else-label,
    ${re} .rte-conditional-header,
    ${re} .rte-conditional-else-label,
    .${L}.rte-conditional-theme-acme .rte-conditional-header,
    .${L}.rte-conditional-theme-acme .rte-conditional-else-label {
      background: linear-gradient(180deg, #eef4fb 0%, #e6eef8 100%);
      border-color: #cbd8e8;
    }

    ${F} .rte-conditional-summary,
    ${re} .rte-conditional-summary,
    .${L}.rte-conditional-theme-acme .rte-conditional-summary {
      color: #0f172a;
    }

    ${F} .rte-conditional-meta,
    ${re} .rte-conditional-meta,
    .${L}.rte-conditional-theme-acme .rte-conditional-meta {
      color: #587089;
    }

    ${F} .rte-conditional-chip,
    ${re} .rte-conditional-chip,
    .${L}.rte-conditional-theme-acme .rte-conditional-chip {
      background: #d9f5ee;
      border-color: #66c6b3;
      color: #0f4f4a;
    }

    ${F} .rte-conditional-chip-else,
    ${re} .rte-conditional-chip-else,
    .${L}.rte-conditional-theme-acme .rte-conditional-chip-else {
      background: #fde8ea;
      border-color: #f1a7b2;
      color: #8b1f2f;
    }

    ${F} .rte-conditional-body,
    ${re} .rte-conditional-body,
    .${L}.rte-conditional-theme-acme .rte-conditional-body {
      background: #fcfeff;
      color: #0f172a;
    }

    ${F} .rte-conditional-dialog,
    ${re} .rte-conditional-dialog,
    .${L}.rte-conditional-theme-acme .rte-conditional-dialog {
      background: #ffffff;
      border-color: #cbd8e8;
      box-shadow: 0 20px 44px rgba(15, 23, 42, 0.18);
    }

    ${F} .rte-conditional-dialog-header,
    ${F} .rte-conditional-dialog-footer,
    ${re} .rte-conditional-dialog-header,
    ${re} .rte-conditional-dialog-footer,
    .${L}.rte-conditional-theme-acme .rte-conditional-dialog-header,
    .${L}.rte-conditional-theme-acme .rte-conditional-dialog-footer {
      background: #f3f8fd;
      border-color: #d8e4f1;
    }

    ${F} .rte-conditional-dialog-title,
    ${F} .rte-conditional-field label,
    ${F} .rte-conditional-checkbox,
    ${re} .rte-conditional-dialog-title,
    ${re} .rte-conditional-field label,
    ${re} .rte-conditional-checkbox,
    .${L}.rte-conditional-theme-acme .rte-conditional-dialog-title,
    .${L}.rte-conditional-theme-acme .rte-conditional-field label,
    .${L}.rte-conditional-theme-acme .rte-conditional-checkbox {
      color: #1f334a;
    }

    ${F} .rte-conditional-help,
    ${re} .rte-conditional-help,
    .${L}.rte-conditional-theme-acme .rte-conditional-help {
      color: #5f738d;
    }

    ${F} .rte-conditional-field input[type="text"],
    ${F} .rte-conditional-btn,
    ${re} .rte-conditional-field input[type="text"],
    ${re} .rte-conditional-btn,
    .${L}.rte-conditional-theme-acme .rte-conditional-field input[type="text"],
    .${L}.rte-conditional-theme-acme .rte-conditional-btn {
      background: #ffffff;
      border-color: #bfd0e2;
      color: #0f172a;
    }

    ${F} .rte-conditional-btn-primary,
    ${re} .rte-conditional-btn-primary,
    .${L}.rte-conditional-theme-acme .rte-conditional-btn-primary {
      border-color: #0f766e;
      background: #0f766e;
      color: #ffffff;
    }

    ${F} .rte-toolbar-group-items.conditional-content,
    .${L}.rte-conditional-theme-acme .rte-toolbar-group-items.conditional-content,
    ${re} .rte-toolbar-group-items.conditional-content,
    ${F} .editora-toolbar-group-items.conditional-content {
      border-color: #bfd0e2;
    }

    ${F} .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    ${re} .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    ${F} .editora-toolbar-group-items.conditional-content .editora-toolbar-button {
      border-right-color: #bfd0e2;
    }

    ${F} .${O},
    .${L}.rte-conditional-theme-acme .${O},
    .${O}.rte-conditional-theme-acme {
      background: rgba(255, 255, 255, 0.98);
      border-color: #bfd0e2;
      box-shadow: 0 14px 28px rgba(15, 23, 42, 0.16);
    }

    ${F} .${O} .rte-conditional-float-btn,
    .${L}.rte-conditional-theme-acme .${O} .rte-conditional-float-btn,
    .${O}.rte-conditional-theme-acme .rte-conditional-float-btn {
      background: #ffffff;
      border-color: #bfd0e2;
      color: #1f334a;
    }

    ${F} .${O} .rte-conditional-float-btn:hover,
    .${L}.rte-conditional-theme-acme .${O} .rte-conditional-float-btn:hover,
    .${O}.rte-conditional-theme-acme .rte-conditional-float-btn:hover {
      background: #eef7f5;
      color: #0f4f4a;
    }

    ${F} .${O} .rte-conditional-float-btn[data-action="delete"],
    .${L}.rte-conditional-theme-acme .${O} .rte-conditional-float-btn[data-action="delete"],
    .${O}.rte-conditional-theme-acme .rte-conditional-float-btn[data-action="delete"] {
      border-color: #f1a7b2;
      color: #8b1f2f;
      background: #fff4f6;
    }
  `,document.head.appendChild(e)}function yh(e){return{defaultCondition:e.defaultCondition||"",defaultAudience:An(e.defaultAudience||[]),defaultLocale:An(e.defaultLocale||[]),enableElseByDefault:e.enableElseByDefault===!0,labels:uh(e.labels),context:e.context,getContext:e.getContext,currentAudience:e.currentAudience,currentLocale:e.currentLocale,evaluateCondition:e.evaluateCondition||bh}}function Wf(){Eo&&(Eo.cleanup(),Eo=null)}function xh(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function Mn(e,t){e.setAttribute("contenteditable","false"),e.setAttribute("spellcheck","false");const r=e.querySelector(".rte-conditional-header");r&&(r.setAttribute("contenteditable","false"),r.setAttribute("tabindex","0"),r.setAttribute("role","button"),r.setAttribute("aria-label","Edit conditional rule"));const n=e.querySelector(".rte-conditional-else-label");n&&n.setAttribute("contenteditable","false"),wh(e,!t)}function vh(e){const t=e.querySelector('.rte-conditional-body[data-slot="if"]');if(!t)return;const r=new Set,n=e.querySelector(".rte-conditional-header"),o=e.querySelector(".rte-conditional-else-label"),a=e.querySelector('.rte-conditional-body[data-slot="else"]');n&&r.add(n),r.add(t),o&&r.add(o),a&&r.add(a),Array.from(e.childNodes).forEach(l=>{if(!(l instanceof HTMLElement&&r.has(l))){if(l.nodeType===Node.TEXT_NODE&&!(l.textContent||"").trim()){l.remove();return}t.appendChild(l)}})}function Hr(e){const t=window.getSelection();if(t&&t.rangeCount>0){const o=t.getRangeAt(0).startContainer,a=o.nodeType===Node.ELEMENT_NODE?o:o.parentElement,i=a==null?void 0:a.closest(er);if(i&&e.contains(i))return i}const r=document.activeElement,n=r==null?void 0:r.closest(er);return n&&e.contains(n)?n:null}function ys(e,t){let r=e.querySelector(".rte-conditional-else-label"),n=e.querySelector('.rte-conditional-body[data-slot="else"]');r||(r=document.createElement("div"),r.className="rte-conditional-else-label",r.setAttribute("contenteditable","false"),r.innerHTML=`
      <span class="rte-conditional-chip rte-conditional-chip-else">${se(t.blockElseLabel)}</span>
      <span class="rte-conditional-summary">Else branch</span>
    `,e.appendChild(r)),n||(n=document.createElement("div"),n.className="rte-conditional-body rte-conditional-else-body",n.setAttribute("data-slot","else"),n.innerHTML="<p><br></p>",e.appendChild(n))}function kh(e,t){e.setAttribute("data-has-else",t?"true":"false");const r=e.querySelector(".rte-conditional-else-label"),n=e.querySelector('.rte-conditional-body[data-slot="else"]');r&&r.classList.toggle("rte-conditional-hidden",!t),n&&n.classList.toggle("rte-conditional-hidden",!t)}function wh(e,t){Array.from(e.querySelectorAll(".rte-conditional-body")).forEach(n=>{n.setAttribute("contenteditable",t?"true":"false")}),e.setAttribute("contenteditable","false")}function xs(e,t){const r=e.getAttribute("data-condition")||"",n=ir(e.getAttribute("data-audience")),o=ir(e.getAttribute("data-locale"));let a=e.querySelector(".rte-conditional-header");a||(a=document.createElement("div"),a.className="rte-conditional-header",e.prepend(a)),a.setAttribute("contenteditable","false"),a.setAttribute("tabindex","0"),a.setAttribute("role","button"),a.setAttribute("aria-label","Edit conditional rule");const i=r||"(always true)",l=n.length>0?n.join(", "):t.allAudiencesText,s=o.length>0?o.join(", "):t.allLocalesText;if(a.innerHTML=`
    <span class="rte-conditional-chip">${se(t.blockIfLabel)}</span>
    <span class="rte-conditional-summary">${se(i)}</span>
    <span class="rte-conditional-meta">${se(l)} · ${se(s)}</span>
  `,!e.querySelector('.rte-conditional-body[data-slot="if"]')){const u=document.createElement("div");u.className="rte-conditional-body",u.setAttribute("data-slot","if"),u.innerHTML="<p><br></p>",e.insertBefore(u,e.children[1]||null)}const d=e.getAttribute("data-has-else")==="true";d&&ys(e,t),vh(e),kh(e,d)}function Uf(e,t){const r=document.createElement("section");r.className="rte-conditional-block",r.setAttribute("data-conditional-content","true"),r.setAttribute("data-condition",(e.condition||"").trim()),r.setAttribute("data-audience",An(e.audience).join(",")),r.setAttribute("data-locale",An(e.locale).join(",")),r.setAttribute("data-has-else",e.hasElse?"true":"false"),r.setAttribute("role","group"),r.setAttribute("aria-label","Conditional content block"),r.setAttribute("contenteditable","false"),r.setAttribute("spellcheck","false");const n=document.createElement("div");n.className="rte-conditional-header",n.setAttribute("contenteditable","false");const o=document.createElement("div");return o.className="rte-conditional-body",o.setAttribute("data-slot","if"),o.innerHTML="<p><br></p>",r.appendChild(n),r.appendChild(o),e.hasElse&&ys(r,t),xs(r,t),Mn(r,!1),r}function Eh(e,t){if(t)try{if(!e.isConnected)return;const r=e.contains(t.startContainer),n=e.contains(t.endContainer);if(!r||!n)return;hs(e,t)}catch{}}function Ch(e){return(e.textContent||"").replace(/\u200B/g,"").trim().length>0?!0:e.querySelector("img, video, table, iframe, hr, pre, blockquote, ul, ol")!==null}function Gf(e,t,r){let n=null;if(r)try{const i=r.cloneRange();e.contains(i.commonAncestorContainer)&&(n=i)}catch{n=null}n||(n=jf(e)),n||(n=document.createRange(),n.selectNodeContents(e),n.collapse(!1));let o=null;n.collapsed||(o=n.extractContents()),n.insertNode(t);const a=t.querySelector('.rte-conditional-body[data-slot="if"]');a&&o&&Ch(o)&&(a.innerHTML="",a.appendChild(o)),a?xi(e,a):xi(e,t),e.normalize()}function Sh(e){return{condition:e.getAttribute("data-condition")||"",audience:ir(e.getAttribute("data-audience")),locale:ir(e.getAttribute("data-locale")),hasElse:e.getAttribute("data-has-else")==="true"}}function Th(e,t,r){e.setAttribute("data-condition",(t.condition||"").trim()),e.setAttribute("data-audience",An(t.audience).join(",")),e.setAttribute("data-locale",An(t.locale).join(",")),e.setAttribute("data-has-else",t.hasElse?"true":"false"),t.hasElse&&ys(e,r),xs(e,r),Mn(e,e.classList.contains("rte-conditional-preview"))}function Rn(e,t){Wi(e,e);const r=Array.from(e.querySelectorAll(er)),n=kt.get(e)===!0;return r.forEach(o=>{o.classList.add("rte-conditional-block"),o.setAttribute("data-conditional-content","true"),o.hasAttribute("data-condition")||o.setAttribute("data-condition",""),o.hasAttribute("data-audience")||o.setAttribute("data-audience",""),o.hasAttribute("data-locale")||o.setAttribute("data-locale",""),o.hasAttribute("data-has-else")||o.setAttribute("data-has-else","false"),o.setAttribute("role","group"),o.setAttribute("aria-label","Conditional content block"),o.setAttribute("contenteditable","false"),o.setAttribute("spellcheck","false"),xs(o,t),Mn(o,n)}),r}async function Lh(e,t){const r=Ol.get(e);if(r)return r;if(typeof t.getContext=="function")try{const n=ia(e),o=await Promise.resolve(t.getContext({editor:e,editorRoot:n}));if(o&&typeof o=="object")return o}catch{return{}}if(typeof t.context=="function")try{const n=t.context();if(n&&typeof n=="object")return n}catch{return{}}return t.context&&typeof t.context=="object"?t.context:{}}function Sa(e){return Array.isArray(e)?e.map(t=>t.trim().toLowerCase()).filter(Boolean):typeof e=="string"?e.split(",").map(t=>t.trim().toLowerCase()).filter(Boolean):[]}function wc(e,t){return e.length===0||e.includes("all")?!0:t.length===0?!1:e.some(r=>t.includes(r))}async function Or(e,t,r){var m,g;const n=t.labels,o=Rn(e,n);if(kt.set(e,r),Zf(e,r),ia(e).classList.toggle("rte-conditional-preview-on",r),!r){o.forEach(p=>{p.classList.remove("rte-conditional-preview"),Mn(p,!1);const y=p.querySelector('.rte-conditional-body[data-slot="if"]'),b=p.querySelector('.rte-conditional-body[data-slot="else"]'),x=p.querySelector(".rte-conditional-else-label"),C=p.getAttribute("data-has-else")==="true";y&&(y.classList.remove("rte-conditional-hidden"),y.removeAttribute("aria-hidden")),b&&(b.classList.toggle("rte-conditional-hidden",!C),b.setAttribute("aria-hidden",C?"false":"true")),x&&x.classList.toggle("rte-conditional-hidden",!C)});return}const i=await Lh(e,t),l=Sa(t.currentAudience),s=Sa(t.currentLocale),c=Sa(i.audience??((m=i.user)==null?void 0:m.audience)),d=Sa(i.locale??((g=i.user)==null?void 0:g.locale)),u=l.length>0?l:c,f=s.length>0?s:d;o.forEach(p=>{const y=p.getAttribute("data-condition")||"",b=ir(p.getAttribute("data-audience")).map(_=>_.toLowerCase()),x=ir(p.getAttribute("data-locale")).map(_=>_.toLowerCase()),C=p.getAttribute("data-has-else")==="true",k=t.evaluateCondition(y,i),T=wc(b,u),$=wc(x,f),w=k&&T&&$,v=p.querySelector('.rte-conditional-body[data-slot="if"]'),E=p.querySelector('.rte-conditional-body[data-slot="else"]'),H=p.querySelector(".rte-conditional-else-label");if(p.classList.add("rte-conditional-preview"),Mn(p,!0),v&&(v.classList.toggle("rte-conditional-hidden",!w),v.setAttribute("aria-hidden",w?"false":"true")),E){const _=C&&!w;E.classList.toggle("rte-conditional-hidden",!_),E.setAttribute("aria-hidden",_?"false":"true")}if(H){const _=C&&!w;H.classList.toggle("rte-conditional-hidden",!_)}})}function Zf(e,t){const r=ia(e);Array.from(r.querySelectorAll('[data-command="toggleConditionalPreview"], [data-command="conditionalPreview"]')).forEach(o=>{o.setAttribute("data-active",t?"true":"false"),o.classList.toggle("active",t),o.setAttribute("aria-pressed",t?"true":"false")})}function $h(e){const t=wr.get(e);if(t&&t.isConnected)return t;const r=document.createElement("div");return r.className=O,r.setAttribute("role","toolbar"),r.setAttribute("aria-label","Conditional block actions"),r.innerHTML=`
    <button type="button" class="rte-conditional-float-btn" data-action="edit" title="Edit Condition" aria-label="Edit Condition">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4 17.3V20h2.7l9.7-9.7-2.7-2.7L4 17.3Zm14.7-9.4a1 1 0 0 0 0-1.4l-1.2-1.2a1 1 0 0 0-1.4 0l-1.1 1.1 2.7 2.7 1-1.2Z" fill="currentColor"></path></svg>
    </button>
    <button type="button" class="rte-conditional-float-btn" data-action="delete" title="Delete Block" aria-label="Delete Block">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M8 4h8l1 2h4v2H3V6h4l1-2Zm1 6h2v8H9v-8Zm4 0h2v8h-2v-8Z" fill="currentColor"></path></svg>
    </button>
  `,r.addEventListener("mousedown",n=>{n.preventDefault()}),r.addEventListener("click",n=>{var s;const o=n.target,a=(s=o==null?void 0:o.closest("[data-action]"))==null?void 0:s.getAttribute("data-action");if(!a)return;const i=me.get(e)||Qr;if(!i)return;const l=Er.get(e);if(!(!l||!e.contains(l))){if(a==="edit"){Ge(e,i,"edit",void 0,l);return}a==="delete"&&(Xf(e,l),Er.set(e,null),mr(e))}}),document.body.appendChild(r),wr.set(e,r),r}function mr(e){const t=wr.get(e);t&&t.classList.remove("show")}function Yf(e,t){const r=t.getBoundingClientRect();e.style.left="0px",e.style.top="0px",e.classList.add("show");const n=e.getBoundingClientRect(),o=8,a=window.innerWidth,i=window.innerHeight;let l=r.top-n.height-o;l<o&&(l=r.bottom+o),l=Math.min(l,i-n.height-o);let s=r.right-n.width;s=Math.max(o,Math.min(s,a-n.width-o)),e.style.left=`${s}px`,e.style.top=`${l}px`}function Ya(e,t){const r=$h(e);Wi(r,e),Er.set(e,t),Yf(r,t)}function Gt(e){const t=me.get(e)||Qr;if(!t)return;const r=Hr(e);if(!r||!e.contains(r)||At(e)){Er.set(e,null),mr(e);return}Rn(e,t.labels),Ya(e,r)}function Ah(){wr.forEach((e,t)=>{if(!t.isConnected||!e.isConnected){e.remove(),wr.delete(t),Er.delete(t);return}if(!e.classList.contains("show"))return;Wi(e,t);const r=Er.get(t);if(!r||!t.contains(r)){mr(t);return}Yf(e,r)})}function Xf(e,t){if(!e.contains(t))return!1;const r=e.innerHTML,n=t.parentNode,o=t.nextSibling;t.remove(),n===e&&e.innerHTML.trim()===""&&(e.innerHTML="<p><br></p>");const a=document.createRange();return o&&e.contains(o)?a.setStartBefore(o):(a.selectNodeContents(e),a.collapse(!1)),a.collapse(!0),hs(e,a),Vf(e),Kf(e,r),!0}function Ec(e,t,r){const n=e.cloneRange(),o=document.createRange();return o.selectNodeContents(t),o.collapse(r==="start"),n.startContainer===o.startContainer&&n.startOffset===o.startOffset&&n.endContainer===o.endContainer&&n.endOffset===o.endOffset}function Ge(e,t,r,n,o){Wf();const a=t.labels,i=r==="insert"?jf(e):null,l=document.createElement("div");l.className=L,Wi(l,e);const s=document.createElement("section");s.className="rte-conditional-dialog",s.setAttribute("role","dialog"),s.setAttribute("aria-modal","true"),s.setAttribute("aria-labelledby","rte-conditional-dialog-title");const c=o?Sh(o):void 0,d=n||c||{},u=d.condition??t.defaultCondition,f=d.audience??t.defaultAudience,m=d.locale??t.defaultLocale,g=d.hasElse??t.enableElseByDefault;s.innerHTML=`
    <header class="rte-conditional-dialog-header">
      <h2 id="rte-conditional-dialog-title" class="rte-conditional-dialog-title">${se(r==="edit"?a.dialogTitleEdit:a.dialogTitleInsert)}</h2>
      <button type="button" class="rte-conditional-btn" data-action="cancel" aria-label="${se(a.cancelText)}">✕</button>
    </header>
    <div class="rte-conditional-dialog-body">
      <div class="rte-conditional-field">
        <label for="rte-conditional-condition">${se(a.conditionLabel)}</label>
        <input id="rte-conditional-condition" class="rte-conditional-input-condition" type="text" value="${se(u||"")}" placeholder="${se(a.conditionPlaceholder)}" />
      </div>
      <div class="rte-conditional-field">
        <label for="rte-conditional-audience">${se(a.audienceLabel)}</label>
        <input id="rte-conditional-audience" class="rte-conditional-input-audience" type="text" value="${se(kc(f))}" placeholder="${se(a.audiencePlaceholder)}" />
      </div>
      <div class="rte-conditional-field">
        <label for="rte-conditional-locale">${se(a.localeLabel)}</label>
        <input id="rte-conditional-locale" class="rte-conditional-input-locale" type="text" value="${se(kc(m))}" placeholder="${se(a.localePlaceholder)}" />
      </div>
      <label class="rte-conditional-checkbox">
        <input class="rte-conditional-input-else" type="checkbox" ${g?"checked":""} />
        <span>${se(a.elseLabel)}</span>
      </label>
      <p class="rte-conditional-help">Example condition: <code>user.role == "admin"</code>, <code>locale == "en-US"</code>, <code>!feature.beta</code></p>
    </div>
    <footer class="rte-conditional-dialog-footer">
      <button type="button" class="rte-conditional-btn" data-action="cancel">${se(a.cancelText)}</button>
      <button type="button" class="rte-conditional-btn rte-conditional-btn-primary" data-action="save">${se(a.saveText)}</button>
    </footer>
  `,l.appendChild(s),document.body.appendChild(l);const p=s.querySelector(".rte-conditional-input-condition"),y=s.querySelector(".rte-conditional-input-audience"),b=s.querySelector(".rte-conditional-input-locale"),x=s.querySelector(".rte-conditional-input-else"),C=()=>{l.removeEventListener("click",T),l.removeEventListener("keydown",v,!0),document.removeEventListener("keydown",k,!0),l.parentNode&&l.parentNode.removeChild(l),Eo=null,e.focus({preventScroll:!0}),Gt(e)},k=E=>{E.key==="Escape"&&(E.preventDefault(),E.stopPropagation(),C())},T=E=>{E.target===l&&C()},$=E=>{if(E.key!=="Tab")return;const H=Array.from(s.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));if(H.length===0)return;const _=H[0],qe=H[H.length-1],_e=document.activeElement;if(E.shiftKey&&_e===_){E.preventDefault(),qe.focus();return}!E.shiftKey&&_e===qe&&(E.preventDefault(),_.focus())},w=async()=>{var qe;const E={condition:((qe=p==null?void 0:p.value)==null?void 0:qe.trim())||"",audience:ir(y==null?void 0:y.value),locale:ir(b==null?void 0:b.value),hasElse:(x==null?void 0:x.checked)||!1},H=e.innerHTML;if(o)Th(o,E,a),Mn(o,kt.get(e)===!0);else{Eh(e,i);const _e=Uf(E,a);try{Gf(e,_e)}catch{e.appendChild(_e);const dr=_e.querySelector('.rte-conditional-body[data-slot="if"]');dr?xi(e,dr):xi(e,_e)}}kt.get(e)===!0&&await Or(e,t,!0),Vf(e),Kf(e,H),Gt(e),C()},v=E=>{if(E.key==="Escape"){E.preventDefault(),C();return}$(E),E.key==="Enter"&&!E.shiftKey&&E.target instanceof HTMLInputElement&&(E.preventDefault(),w())};s.addEventListener("click",E=>{const _=E.target.getAttribute("data-action");if(_==="cancel"){C();return}_==="save"&&w()}),l.addEventListener("click",T),l.addEventListener("keydown",v,!0),document.addEventListener("keydown",k,!0),Eo={cleanup:C},p==null||p.focus()}function Mh(e){const t=e.metaKey||e.ctrlKey,n=(typeof e.key=="string"?e.key:"").toLowerCase(),o=typeof e.code=="string"?e.code.toLowerCase():"",a=t&&e.altKey&&e.shiftKey&&(n==="c"||o==="keyc"),i=!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&(n==="f9"||o==="f9");return a||i}function Rh(e){const t=e.metaKey||e.ctrlKey,n=(typeof e.key=="string"?e.key:"").toLowerCase(),o=typeof e.code=="string"?e.code.toLowerCase():"",a=t&&e.altKey&&e.shiftKey&&(n==="p"||o==="keyp"),i=!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&(n==="f10"||o==="f10");return a||i}function Dh(e){Qr=e,Gr||(Gr=t=>{const r=t.target,n=r==null?void 0:r.closest(nt);if(!n)return;ne=n,me.has(n)||me.set(n,e);const o=me.get(n)||e;Rn(n,o.labels),Zf(n,kt.get(n)===!0),Gt(n)},document.addEventListener("focusin",Gr,!0)),Ur||(Ur=t=>{var d;if(document.querySelector(`.${L}`))return;const n=t.target;if(!!(n!=null&&n.closest("input, textarea, select")))return;const i=(n==null?void 0:n.closest(nt))||ht(void 0,!1)||ne;if(!i||At(i))return;const l=me.get(i)||Qr||e,s=document.activeElement,c=(n==null?void 0:n.closest(".rte-conditional-header"))||(s==null?void 0:s.closest(".rte-conditional-header"));if(c&&(t.key==="Enter"||t.key===" ")){const u=c.closest(er);if(u&&i.contains(u)){t.preventDefault(),t.stopPropagation(),Ge(i,l,"edit",void 0,u);return}}if(Mh(t)){t.preventDefault(),t.stopPropagation();const u=Hr(i);u?Ge(i,l,"edit",void 0,u):Ge(i,l,"insert");return}if(Rh(t)){t.preventDefault(),t.stopPropagation();const u=kt.get(i)!==!0;Or(i,l,u),Gt(i);return}if((t.key==="Backspace"||t.key==="Delete")&&!t.altKey&&!t.ctrlKey&&!t.metaKey){const u=window.getSelection();if(!u||u.rangeCount===0)return;const f=u.getRangeAt(0);if(!f.collapsed||!i.contains(f.commonAncestorContainer))return;const m=(d=xh(f.startContainer))==null?void 0:d.closest(".rte-conditional-body");if(!m||!i.contains(m))return;if(t.key==="Backspace"&&Ec(f,m,"start")){t.preventDefault();return}if(t.key==="Delete"&&Ec(f,m,"end")){t.preventDefault();return}}},document.addEventListener("keydown",Ur,!0)),Yr||(Yr=t=>{const r=t.target;if(!r||r.closest(`.${O}`))return;const n=r.closest(nt);if(!n){ne&&mr(ne);return}if(At(n))return;ne=n,me.has(n)||me.set(n,e);const o=r.closest(er);if(!o){mr(n);return}requestAnimationFrame(()=>{!n.isConnected||!n.contains(o)||Ya(n,o)})},document.addEventListener("mousedown",Yr,!0)),Zr||(Zr=t=>{const r=t.target;if(!r||r.closest(`.${O}`))return;const n=r.closest(nt);if(!n){ne&&mr(ne);return}if(At(n))return;ne=n,me.has(n)||me.set(n,e);const o=me.get(n)||e,a=r.closest(er),i=!!r.closest(".rte-conditional-header, .rte-conditional-summary, .rte-conditional-meta, .rte-conditional-else-label");if(a&&i){t.preventDefault(),t.stopPropagation(),Ge(n,o,"edit",void 0,a),Ya(n,a);return}a?Ya(n,a):mr(n)},document.addEventListener("click",Zr,!0)),Xr||(Xr=()=>{const t=ht(void 0,!1)||ne;t&&t.isConnected&&Gt(t)},document.addEventListener("selectionchange",Xr)),Jr||(Jr=t=>{const r=t.target,n=r==null?void 0:r.closest(nt);if(!n)return;const o=me.get(n)||Qr||e;Rn(n,o.labels),Gt(n)},document.addEventListener("input",Jr,!0)),Ut||(Ut=()=>{Ah()},window.addEventListener("scroll",Ut,!0),window.addEventListener("resize",Ut))}function Nh(){Gr&&(document.removeEventListener("focusin",Gr,!0),Gr=null),Ur&&(document.removeEventListener("keydown",Ur,!0),Ur=null),Zr&&(document.removeEventListener("click",Zr,!0),Zr=null),Yr&&(document.removeEventListener("mousedown",Yr,!0),Yr=null),Xr&&(document.removeEventListener("selectionchange",Xr),Xr=null),Jr&&(document.removeEventListener("input",Jr,!0),Jr=null),Ut&&(window.removeEventListener("scroll",Ut,!0),window.removeEventListener("resize",Ut),Ut=null),wr.forEach(e=>{e.remove()}),wr.clear(),Er.clear(),Qr=null,ne=null}const Bh=(e={})=>{const t=yh(e);return hh(),{name:"conditionalContent",toolbar:[{id:"conditionalContentGroup",label:"Conditional Content",type:"group",command:"conditionalContent",items:[{id:"conditionalContent",label:"Conditional Rule",command:"openConditionalDialog",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M6 5h12a1 1 0 0 1 1 1v3h-2V7H7v3H5V6a1 1 0 0 1 1-1Zm-1 9h2v3h10v-3h2v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4Zm3-2a1 1 0 0 1 1-1h2.6l1.8-2.4a1 1 0 1 1 1.6 1.2L13.8 11H15a1 1 0 1 1 0 2h-2.7l-1.9 2.5a1 1 0 1 1-1.6-1.2L10.1 13H9a1 1 0 0 1-1-1Z" fill="currentColor"></path></svg>',shortcut:"Mod-Alt-Shift-c"},{id:"conditionalPreview",label:"Conditional Preview",command:"toggleConditionalPreview",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4 6h16a1 1 0 0 1 1 1v3h-2V8H5v8h14v-2h2v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm5 3h2v2H9V9Zm0 4h2v2H9v-2Zm4-4h6v2h-6V9Zm0 4h6v2h-6v-2Z" fill="currentColor"></path></svg>',shortcut:"Mod-Alt-Shift-p"}]}],commands:{conditionalContent:(r,n)=>{const o=ht(n);if(!o||At(o))return!1;ne=o,me.set(o,t),Rn(o,t.labels);const a=r==null?void 0:r.target;if(a==="insert")return Ge(o,t,"insert",r),!0;const i=Hr(o);return a==="edit"||i?!i&&a==="edit"?!1:(Ge(o,t,"edit",r,i||void 0),!0):(Ge(o,t,"insert",r),!0)},openConditionalDialog:(r,n)=>{const o=ht(n);if(!o||At(o))return!1;ne=o,me.set(o,t),Rn(o,t.labels);const a=r==null?void 0:r.target;if(a==="insert")return Ge(o,t,"insert",r),!0;const i=Hr(o);return a==="edit"||i?!i&&a==="edit"?!1:(Ge(o,t,"edit",r,i||void 0),!0):(Ge(o,t,"insert",r),!0)},conditionalPreview:async(r,n)=>{const o=ht(n);if(!o)return!1;ne=o,me.set(o,t);const a=typeof r=="boolean"?r:kt.get(o)!==!0;return await Or(o,t,a),Gt(o),!0},editConditionalBlock:(r,n)=>{const o=ht(n);if(!o||At(o))return!1;ne=o,me.set(o,t);const a=Hr(o);return a?(Ge(o,t,"edit",r,a),!0):!1},deleteConditionalBlock:(r,n)=>{const o=ht(n);if(!o||At(o))return!1;const a=Hr(o);if(!a)return!1;const i=Xf(o,a);return i&&Gt(o),i},insertConditionalBlock:(r,n)=>{const o=ht(n);if(!o||At(o))return!1;ne=o,me.set(o,t);const a={condition:(r==null?void 0:r.condition)??t.defaultCondition,audience:(r==null?void 0:r.audience)??t.defaultAudience,locale:(r==null?void 0:r.locale)??t.defaultLocale,hasElse:(r==null?void 0:r.hasElse)??t.enableElseByDefault},i=Uf(a,t.labels);return Gf(o,i),kt.get(o)===!0&&Or(o,t,!0),!0},toggleConditionalPreview:async(r,n)=>{const o=ht(n);if(!o)return!1;ne=o,me.set(o,t);const a=typeof r=="boolean"?r:kt.get(o)!==!0;return await Or(o,t,a),!0},setConditionalContext:(r,n)=>{const o=ht(n);return o?(ne=o,!r||typeof r!="object"?Ol.delete(o):Ol.set(o,r),kt.get(o)===!0&&Or(o,t,!0),!0):!1}},keymap:{"Mod-Alt-Shift-c":"openConditionalDialog","Mod-Alt-Shift-C":"openConditionalDialog","Mod-Alt-Shift-p":"toggleConditionalPreview","Mod-Alt-Shift-P":"toggleConditionalPreview",F9:"openConditionalDialog",F10:"toggleConditionalPreview"},init:()=>{wa+=1,Dh(t)},destroy:()=>{wa=Math.max(0,wa-1),wa===0&&(Wf(),Nh())}}},Wt=".rte-content, .editora-content",en='.rte-data-binding[data-binding="true"]',Cc="rte-data-binding-styles",he="rte-data-binding-dialog-overlay",fe=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',Ph={dialogTitleInsert:"Insert Data Binding",dialogTitleEdit:"Edit Data Binding",keyLabel:"Data Key",keyPlaceholder:"user.firstName",fallbackLabel:"Fallback Text",fallbackPlaceholder:"Guest",formatLabel:"Format",currencyLabel:"Currency",currencyPlaceholder:"USD",saveText:"Save",cancelText:"Cancel",previewOnText:"Preview On",previewOffText:"Preview Off",tokenAriaPrefix:"Data binding token"},ot=new WeakMap,zl=new WeakMap,pe=new WeakMap,Co=new WeakMap,xl=new WeakMap;let So=null,Me=null,Ta=0,tn=null,rn=null,nn=null,Xa=null;function Ih(e){return{...Ph,...e||{}}}function Sc(e={}){const t=(e.locale||(typeof navigator<"u"?navigator.language:"en-US")).trim()||"en-US";return{data:e.data,getData:e.getData,api:e.api,cacheTtlMs:Math.max(0,Number(e.cacheTtlMs??3e4)),labels:Ih(e.labels),defaultFormat:e.defaultFormat||"text",defaultFallback:e.defaultFallback||"",locale:t,numberFormatOptions:e.numberFormatOptions||{},dateFormatOptions:e.dateFormatOptions||{year:"numeric",month:"short",day:"2-digit"}}}function Ae(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Jf(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function la(e){return e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||e}function La(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function Hh(e){const t=la(e);if(La(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return La(r)?!0:La(document.documentElement)||La(document.body)}function Vt(e,t=!0){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const o=e.editorElement;if(o.matches(Wt))return o;const a=o.querySelector(Wt);if(a instanceof HTMLElement)return a}const r=window.getSelection();if(r&&r.rangeCount>0){const o=r.getRangeAt(0).startContainer,a=Jf(o),i=a==null?void 0:a.closest(Wt);if(i)return i}const n=document.activeElement;if(n){if(n.matches(Wt))return n;const o=n.closest(Wt);if(o)return o}return Me&&Me.isConnected?Me:t?document.querySelector(Wt):null}function To(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function Qf(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);return e.contains(r.commonAncestorContainer)?r.cloneRange():null}function ep(e,t){const r=window.getSelection();r&&(r.removeAllRanges(),r.addRange(t),e.focus({preventScroll:!0}))}function Oh(e,t){const r=(t||"").trim();if(r)return r.split(".").filter(Boolean).reduce((n,o)=>{if(!(n==null||typeof n!="object"))return n[o]},e)}function zh(){if(typeof document>"u"||document.getElementById(Cc))return;const e=document.createElement("style");e.id=Cc,e.textContent=`
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

    ${fe} .rte-data-binding,
    .${he}.rte-data-binding-theme-dark .rte-data-binding {
      background: linear-gradient(180deg, #3b0764 0%, #2e1065 100%);
      border-color: #a78bfa;
      color: #ede9fe;
    }

    ${fe} .rte-data-binding::before,
    .${he}.rte-data-binding-theme-dark .rte-data-binding::before {
      background: rgba(167, 139, 250, 0.22);
      color: #ddd6fe;
    }

    ${fe} .rte-data-binding.rte-data-binding-preview,
    .${he}.rte-data-binding-theme-dark .rte-data-binding.rte-data-binding-preview {
      background: #064e3b;
      border-color: #10b981;
      color: #d1fae5;
    }

    ${fe} .rte-data-binding.rte-data-binding-missing,
    .${he}.rte-data-binding-theme-dark .rte-data-binding.rte-data-binding-missing {
      background: #7f1d1d;
      border-color: #ef4444;
      color: #fee2e2;
    }

    ${fe} .rte-toolbar-group-items.data-binding,
    ${fe} .editora-toolbar-group-items.data-binding {
      display: flex;
      border: 1px solid #566275;
      border-radius: 6px;
      overflow: hidden;
    }

    ${fe} .rte-toolbar-group-items.data-binding .rte-toolbar-button,
    ${fe} .editora-toolbar-group-items.data-binding .editora-toolbar-button {
      border-right-color: #566275;
    }

    ${fe} .rte-data-binding-dialog,
    .${he}.rte-data-binding-theme-dark .rte-data-binding-dialog {
      background: #1f2937;
      border-color: #334155;
    }

    ${fe} .rte-data-binding-header,
    ${fe} .rte-data-binding-footer,
    .${he}.rte-data-binding-theme-dark .rte-data-binding-header,
    .${he}.rte-data-binding-theme-dark .rte-data-binding-footer {
      background: #111827;
      border-color: #334155;
    }

    ${fe} .rte-data-binding-title,
    ${fe} .rte-data-binding-field label,
    .${he}.rte-data-binding-theme-dark .rte-data-binding-title,
    .${he}.rte-data-binding-theme-dark .rte-data-binding-field label {
      color: #e2e8f0;
    }

    ${fe} .rte-data-binding-help,
    .${he}.rte-data-binding-theme-dark .rte-data-binding-help {
      color: #94a3b8;
    }

    ${fe} .rte-data-binding-field input,
    ${fe} .rte-data-binding-field select,
    ${fe} .rte-data-binding-btn,
    .${he}.rte-data-binding-theme-dark .rte-data-binding-field input,
    .${he}.rte-data-binding-theme-dark .rte-data-binding-field select,
    .${he}.rte-data-binding-theme-dark .rte-data-binding-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    ${fe} .rte-data-binding-btn-primary,
    .${he}.rte-data-binding-theme-dark .rte-data-binding-btn-primary {
      background: #2563eb;
      border-color: #2563eb;
      color: #ffffff;
    }
  `,document.head.appendChild(e)}function ql(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function _l(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function zo(e,t){return{key:String(e.key||"").trim(),fallback:String(e.fallback??t.defaultFallback??""),format:e.format||t.defaultFormat||"text",currency:String(e.currency||"USD").trim().toUpperCase()||"USD"}}function tp(e){return`{{${e.key}}}`}function rp(e,t){const r=document.createElement("span");return r.className="rte-data-binding",r.setAttribute("data-binding","true"),r.setAttribute("data-binding-key",e.key),r.setAttribute("data-binding-fallback",e.fallback||""),r.setAttribute("data-binding-format",e.format||"text"),r.setAttribute("data-binding-currency",e.currency||"USD"),r.setAttribute("contenteditable","false"),r.setAttribute("spellcheck","false"),r.setAttribute("draggable","false"),r.setAttribute("tabindex","0"),r.setAttribute("role","button"),r.setAttribute("aria-label",`${t.tokenAriaPrefix}: ${e.key}. Press Enter to edit.`),r.textContent=tp(e),r}function Ui(e,t){return zo({key:e.getAttribute("data-binding-key")||"",fallback:e.getAttribute("data-binding-fallback")||t.defaultFallback,format:e.getAttribute("data-binding-format")||t.defaultFormat,currency:e.getAttribute("data-binding-currency")||"USD"},t)}function vs(e,t,r){e.classList.add("rte-data-binding"),e.setAttribute("data-binding","true"),e.setAttribute("data-binding-key",t.key),e.setAttribute("data-binding-fallback",t.fallback||""),e.setAttribute("data-binding-format",t.format||"text"),e.setAttribute("data-binding-currency",t.currency||"USD"),e.setAttribute("contenteditable","false"),e.setAttribute("spellcheck","false"),e.setAttribute("draggable","false"),e.setAttribute("tabindex","0"),e.setAttribute("role","button"),e.setAttribute("aria-label",`${r.tokenAriaPrefix}: ${t.key}. Press Enter to edit.`)}function vi(e,t){const r=Array.from(e.querySelectorAll(en));return r.forEach(n=>{const o=Ui(n,t);vs(n,o,t.labels)}),r}function Fl(e){const t=window.getSelection();if(t&&t.rangeCount>0){const o=t.getRangeAt(0).startContainer,a=Jf(o),i=a==null?void 0:a.closest(en);if(i&&e.contains(i))return i}const r=document.activeElement,n=r==null?void 0:r.closest(en);return n&&e.contains(n)?n:null}function np(){So&&(So.cleanup(),So=null)}function ks(e,t,r){const n=la(e);Array.from(n.querySelectorAll('[data-command="toggleDataBindingPreview"]')).forEach(a=>{if(a.setAttribute("data-active",t?"true":"false"),a.classList.toggle("active",t),a.setAttribute("aria-pressed",t?"true":"false"),r){const i=t?r.labels.previewOnText:r.labels.previewOffText;a.setAttribute("title",i),a.setAttribute("aria-label",i)}})}function qh(e,t,r){const n=t.format||"text";if(e==null)return t.fallback||"";if(n==="json"){if(typeof e=="string")return e;try{return JSON.stringify(e)}catch{return String(e)}}if(n==="date"){const o=e instanceof Date?e:new Date(String(e));if(Number.isNaN(o.getTime()))return String(e);try{return new Intl.DateTimeFormat(r.locale,r.dateFormatOptions).format(o)}catch{return o.toISOString()}}if(n==="number"||n==="currency"){const o=typeof e=="number"?e:Number(e);if(!Number.isFinite(o))return String(e);const a={...r.numberFormatOptions};if(n==="currency"){const i=(t.currency||"USD").toUpperCase();Object.assign(a,{style:"currency",currency:i})}try{return new Intl.NumberFormat(r.locale,a).format(o)}catch{return String(o)}}return String(e)}function Cr(e,t,r,n){const o=Ui(e,t),a=o.key;if(e.classList.remove("rte-data-binding-preview","rte-data-binding-missing"),!r){e.textContent=tp(o),e.setAttribute("aria-label",`${t.labels.tokenAriaPrefix}: ${a}. Press Enter to edit.`);return}const i=Oh(n,a),l=i==null,s=l?o.fallback||"":qh(i,o,t);e.textContent=s||o.fallback||"",e.classList.add("rte-data-binding-preview"),l&&!(o.fallback||"").trim()&&e.classList.add("rte-data-binding-missing"),e.setAttribute("aria-label",`${t.labels.tokenAriaPrefix}: ${a} = ${e.textContent||""}. Press Enter to edit.`)}function Bt(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function _h(e,t){return t?t.split(".").filter(Boolean).reduce((r,n)=>{if(!(!Bt(r)&&!Array.isArray(r)))return r[n]},e):e}function Fh(e,t,r){const n=t.api,o=la(e),a={editor:e,editorRoot:o,signal:r};if(n.buildRequest){const u=n.buildRequest(a);return{url:u.url,init:{...u.init||{},signal:r}}}const i=(n.method||"GET").toUpperCase(),l=typeof n.headers=="function"?n.headers(a):n.headers||{},s=typeof n.params=="function"?n.params(a):n.params,c=new URL(n.url,window.location.origin);s&&Object.entries(s).forEach(([u,f])=>{f!=null&&c.searchParams.set(u,String(f))});const d={method:i,headers:{...l},credentials:n.credentials,mode:n.mode,cache:n.cache,signal:r};if(i!=="GET"&&i!=="HEAD"){const u=typeof n.body=="function"?n.body(a):n.body;if(u!=null)if(Bt(u)){d.body=JSON.stringify(u);const f=d.headers;!f["Content-Type"]&&!f["content-type"]&&(f["Content-Type"]="application/json")}else d.body=u}return{url:c.toString(),init:d}}async function jh(e,t){var s;const r=t.api;if(!r)return{};const n=new AbortController,o=la(e),a={editor:e,editorRoot:o,signal:n.signal},i=Math.max(0,Number(r.timeoutMs??1e4));let l=null;i>0&&(l=window.setTimeout(()=>n.abort(),i));try{const{url:c,init:d}=Fh(e,t,n.signal),u=await fetch(c,{...d,signal:n.signal});if(!u.ok)throw new Error(`Data binding API request failed: ${u.status}`);const m=(r.responseType||"json")==="text"?await u.text():await u.json();if(r.transformResponse){const p=r.transformResponse(m,a);return Bt(p)?p:{}}const g=_h(m,r.responsePath);return Bt(g)?g:Bt(m)?m:{value:g}}catch(c){return(c==null?void 0:c.name)!=="AbortError"&&((s=r.onError)==null||s.call(r,c,a)),{}}finally{l!==null&&window.clearTimeout(l)}}async function qo(e,t){const r=zl.get(e);if(r)return r;const n=Co.get(e),o=Date.now();if(n&&o-n.timestamp<=t.cacheTtlMs)return n.data;const a=xl.get(e);if(a)return a;const i=(async()=>{try{if(typeof t.getData=="function"){const s=await Promise.resolve(t.getData({editor:e,editorRoot:la(e)}));if(Bt(s))return s}if(t.api){const s=await jh(e,t);if(Bt(s))return s}if(typeof t.data=="function"){const s=await Promise.resolve(t.data());if(Bt(s))return s}return Bt(t.data)?t.data:{}}finally{xl.delete(e)}})();xl.set(e,i);const l=await i;return Co.set(e,{timestamp:o,data:l}),l}async function Ja(e,t,r){const n=vi(e,t);if(ot.set(e,r),ks(e,r,t),!r){n.forEach(a=>Cr(a,t,!1));return}const o=await qo(e,t);n.forEach(a=>Cr(a,t,!0,o))}function op(e,t){let r=Qf(e);r||(r=document.createRange(),r.selectNodeContents(e),r.collapse(!1)),r.collapsed||r.deleteContents(),r.insertNode(t);const n=document.createTextNode(" ");t.after(n);const o=document.createRange();o.setStart(n,1),o.collapse(!0),ep(e,o),e.normalize()}function Vh(e){const t=e.metaKey||e.ctrlKey,r=e.key.toLowerCase(),n=t&&e.altKey&&e.shiftKey&&r==="d",o=!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&r==="f7";return n||o}function Kh(e){const t=e.metaKey||e.ctrlKey,r=e.key.toLowerCase(),n=t&&e.altKey&&e.shiftKey&&r==="b",o=!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&r==="f8";return n||o}function gr(e,t,r,n,o){np();const a=r==="insert"?Qf(e):null,i=t.labels,l=o?Ui(o,t):zo(n||{},t),s=document.createElement("div");s.className=he,Hh(e)&&s.classList.add("rte-data-binding-theme-dark");const c=document.createElement("section");c.className="rte-data-binding-dialog",c.setAttribute("role","dialog"),c.setAttribute("aria-modal","true"),c.setAttribute("aria-labelledby","rte-data-binding-dialog-title"),c.innerHTML=`
    <header class="rte-data-binding-header">
      <h2 id="rte-data-binding-dialog-title" class="rte-data-binding-title">${Ae(r==="edit"?i.dialogTitleEdit:i.dialogTitleInsert)}</h2>
      <button type="button" class="rte-data-binding-btn" data-action="cancel" aria-label="${Ae(i.cancelText)}">✕</button>
    </header>
    <div class="rte-data-binding-body">
      <div class="rte-data-binding-field">
        <label for="rte-data-binding-key">${Ae(i.keyLabel)}</label>
        <input id="rte-data-binding-key" class="rte-data-binding-key" type="text" value="${Ae(l.key)}" placeholder="${Ae(i.keyPlaceholder)}" />
      </div>
      <div class="rte-data-binding-field">
        <label for="rte-data-binding-fallback">${Ae(i.fallbackLabel)}</label>
        <input id="rte-data-binding-fallback" class="rte-data-binding-fallback" type="text" value="${Ae(l.fallback||"")}" placeholder="${Ae(i.fallbackPlaceholder)}" />
      </div>
      <div class="rte-data-binding-field">
        <label for="rte-data-binding-format">${Ae(i.formatLabel)}</label>
        <select id="rte-data-binding-format" class="rte-data-binding-format">
          <option value="text" ${l.format==="text"?"selected":""}>Text</option>
          <option value="number" ${l.format==="number"?"selected":""}>Number</option>
          <option value="currency" ${l.format==="currency"?"selected":""}>Currency</option>
          <option value="date" ${l.format==="date"?"selected":""}>Date</option>
          <option value="json" ${l.format==="json"?"selected":""}>JSON</option>
        </select>
      </div>
      <div class="rte-data-binding-field">
        <label for="rte-data-binding-currency">${Ae(i.currencyLabel)}</label>
        <input id="rte-data-binding-currency" class="rte-data-binding-currency" type="text" maxlength="3" value="${Ae(l.currency||"USD")}" placeholder="${Ae(i.currencyPlaceholder)}" />
      </div>
      <p class="rte-data-binding-help">Use dot paths like <code>user.name</code> or <code>order.total</code>.</p>
    </div>
    <footer class="rte-data-binding-footer">
      <button type="button" class="rte-data-binding-btn" data-action="cancel">${Ae(i.cancelText)}</button>
      <button type="button" class="rte-data-binding-btn rte-data-binding-btn-primary" data-action="save">${Ae(i.saveText)}</button>
    </footer>
  `,s.appendChild(c),document.body.appendChild(s);const d=c.querySelector(".rte-data-binding-key"),u=c.querySelector(".rte-data-binding-fallback"),f=c.querySelector(".rte-data-binding-format"),m=c.querySelector(".rte-data-binding-currency"),g=()=>{const T=(f==null?void 0:f.value)==="currency",$=m==null?void 0:m.closest(".rte-data-binding-field");$&&($.style.display=T?"grid":"none")};g(),f==null||f.addEventListener("change",g);const p=()=>{s.removeEventListener("click",b),s.removeEventListener("keydown",k,!0),document.removeEventListener("keydown",y,!0),s.parentNode&&s.parentNode.removeChild(s),So=null,e.focus({preventScroll:!0})},y=T=>{T.key==="Escape"&&(T.preventDefault(),T.stopPropagation(),p())},b=T=>{T.target===s&&p()},x=T=>{if(T.key!=="Tab")return;const $=Array.from(c.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));if($.length===0)return;const w=$[0],v=$[$.length-1],E=document.activeElement;if(T.shiftKey&&E===w){T.preventDefault(),v.focus();return}!T.shiftKey&&E===v&&(T.preventDefault(),w.focus())},C=async()=>{const T=((d==null?void 0:d.value)||"").trim();if(!T){d==null||d.focus();return}const $=zo({key:T,fallback:((u==null?void 0:u.value)||"").trim(),format:(f==null?void 0:f.value)||t.defaultFormat,currency:((m==null?void 0:m.value)||"USD").trim().toUpperCase()},t),w=e.innerHTML;if(o){vs(o,$,i);const v=ot.get(e)===!0,E=v?await qo(e,t):void 0;Cr(o,t,v,E)}else{if(a)try{ep(e,a)}catch{}const v=rp($,i);if(op(e,v),ot.get(e)===!0){const H=await qo(e,t);Cr(v,t,!0,H)}}ql(e),_l(e,w),p()},k=T=>{if(T.key==="Escape"){T.preventDefault(),p();return}x(T),T.key==="Enter"&&!T.shiftKey&&T.target instanceof HTMLInputElement&&(T.preventDefault(),C())};c.addEventListener("click",T=>{const $=T.target,w=$==null?void 0:$.getAttribute("data-action");if(w){if(w==="cancel"){p();return}w==="save"&&C()}}),s.addEventListener("click",b),s.addEventListener("keydown",k,!0),document.addEventListener("keydown",y,!0),So={cleanup:p},d==null||d.focus()}function Wh(e){Xa=e,rn||(rn=t=>{const r=t.target,n=r==null?void 0:r.closest(Wt);if(!n)return;Me=n,pe.has(n)||pe.set(n,e);const o=pe.get(n)||e;vi(n,o);const a=ot.get(n)===!0;ks(n,a,o),a||Array.from(n.querySelectorAll(en)).forEach(l=>Cr(l,o,!1))},document.addEventListener("focusin",rn,!0)),tn||(tn=t=>{if(document.querySelector(`.${he}`))return;const r=t.target;if(r!=null&&r.closest("input, textarea, select"))return;const n=Vt(void 0,!1);if(!n||To(n))return;const o=pe.get(n)||Xa||e,a=r==null?void 0:r.closest(en);if(a&&(t.key==="Enter"||t.key===" ")){t.preventDefault(),t.stopPropagation(),Me=n,gr(n,o,"edit",void 0,a);return}if(Vh(t)){t.preventDefault(),t.stopPropagation();const i=Fl(n);i?gr(n,o,"edit",void 0,i):gr(n,o,"insert");return}if(Kh(t)){t.preventDefault(),t.stopPropagation();const i=ot.get(n)!==!0;Ja(n,o,i)}},document.addEventListener("keydown",tn,!0)),nn||(nn=t=>{if(document.querySelector(`.${he}`)||t.defaultPrevented||t.button!==0||t.metaKey||t.ctrlKey||t.altKey||t.shiftKey)return;const r=t.target,n=r==null?void 0:r.closest(en);if(!n)return;const o=n.closest(Wt);if(!o||To(o))return;const a=pe.get(o)||Xa||e;pe.set(o,a),Me=o,t.preventDefault(),t.stopPropagation(),n.focus({preventScroll:!0}),gr(o,a,"edit",void 0,n)},document.addEventListener("click",nn,!0))}function Uh(){rn&&(document.removeEventListener("focusin",rn,!0),rn=null),tn&&(document.removeEventListener("keydown",tn,!0),tn=null),nn&&(document.removeEventListener("click",nn,!0),nn=null),Xa=null,Me=null}const Gh=(e={})=>{const t=Sc(e);return zh(),{name:"dataBinding",toolbar:[{id:"dataBindingTools",label:"Data Binding",type:"group",command:"openDataBindingDialog",items:[{id:"dataBinding",label:"Data Binding",command:"openDataBindingDialog",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M7 4a3 3 0 0 0-3 3v3h2V7a1 1 0 0 1 1-1h3V4H7Zm10 0h-3v2h3a1 1 0 0 1 1 1v3h2V7a3 3 0 0 0-3-3ZM4 14v3a3 3 0 0 0 3 3h3v-2H7a1 1 0 0 1-1-1v-3H4Zm14 0v3a1 1 0 0 1-1 1h-3v2h3a3 3 0 0 0 3-3v-3h-2ZM8.5 12a1.5 1.5 0 1 1 0-3h7a1.5 1.5 0 0 1 0 3h-7Zm0 4a1.5 1.5 0 1 1 0-3h4a1.5 1.5 0 0 1 0 3h-4Z" fill="currentColor"></path></svg>'},{id:"dataBindingPreview",label:"Data Preview",command:"toggleDataBindingPreview",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M12 3c-4.4 0-8 1.3-8 3v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6c0-1.7-3.6-3-8-3Zm0 2c3.9 0 6 .9 6 1s-2.1 1-6 1-6-.9-6-1 2.1-1 6-1Zm0 4c3 0 5.6-.5 7-1.3V11c0 .9-2.7 2-7 2s-7-1.1-7-2V7.7C6.4 8.5 9 9 12 9Zm0 6c-4.3 0-7-1.1-7-2v3c0 .9 2.7 2 7 2s7-1.1 7-2v-3c0 .9-2.7 2-7 2Z" fill="currentColor"></path><path d="M16.5 9.4a1 1 0 0 1 1.4 0l1.1 1.1 1.8-1.8a1 1 0 1 1 1.4 1.4l-2.5 2.5a1 1 0 0 1-1.4 0l-1.8-1.8a1 1 0 0 1 0-1.4Z" fill="currentColor"></path></svg>'}]}],commands:{openDataBindingDialog:(r,n)=>{const o=Vt(n);if(!o||To(o))return!1;Me=o;const a=pe.get(o)||t;pe.set(o,a),vi(o,a);const i=r==null?void 0:r.target;if(i==="insert")return gr(o,a,"insert",r),!0;const l=Fl(o);return i==="edit"||l?!l&&i==="edit"?!1:(gr(o,a,"edit",r,l||void 0),!0):(gr(o,a,"insert",r),!0)},insertDataBindingToken:async(r,n)=>{const o=Vt(n);if(!o||To(o))return!1;Me=o;const a=pe.get(o)||t;pe.set(o,a);const i=zo(r||{},a);if(!i.key)return!1;const l=o.innerHTML,s=rp(i,a.labels);if(op(o,s),ot.get(o)===!0){const d=await qo(o,a);Cr(s,a,!0,d)}return ql(o),_l(o,l),!0},editDataBindingToken:async(r,n)=>{const o=Vt(n);if(!o||To(o))return!1;Me=o;const a=pe.get(o)||t;pe.set(o,a);const i=Fl(o);if(!i)return!1;const l=Ui(i,a),s=zo({...l,...r||{}},a);if(!s.key)return!1;const c=o.innerHTML;vs(i,s,a.labels);const d=ot.get(o)===!0,u=d?await qo(o,a):void 0;return Cr(i,a,d,u),ql(o),_l(o,c),!0},toggleDataBindingPreview:async(r,n)=>{const o=Vt(n);if(!o)return!1;Me=o;const a=pe.get(o)||t;pe.set(o,a);const i=typeof r=="boolean"?r:ot.get(o)!==!0;return await Ja(o,a,i),!0},setDataBindingData:async(r,n)=>{const o=Vt(n);if(!o)return!1;if(Me=o,r&&typeof r=="object"?(zl.set(o,r),Co.set(o,{timestamp:Date.now(),data:r})):(zl.delete(o),Co.delete(o)),ot.get(o)===!0){const a=pe.get(o)||t;await Ja(o,a,!0)}return!0},refreshDataBindings:async(r,n)=>{const o=Vt(n);if(!o)return!1;Me=o,Co.delete(o);const a=pe.get(o)||t;pe.set(o,a);const i=ot.get(o)===!0;return await Ja(o,a,i),!0}},keymap:{"Mod-Alt-Shift-d":"openDataBindingDialog","Mod-Alt-Shift-D":"openDataBindingDialog","Mod-Alt-Shift-b":"toggleDataBindingPreview","Mod-Alt-Shift-B":"toggleDataBindingPreview",F7:"openDataBindingDialog",F8:"toggleDataBindingPreview"},init:function(n){Ta+=1;const o=this&&typeof this.__pluginConfig=="object"?Sc({...t,...this.__pluginConfig}):t;Wh(o);const a=Vt(n&&n.editorElement?{editorElement:n.editorElement}:void 0,!1);if(a){Me=a,pe.set(a,o),vi(a,o);const i=ot.get(a)===!0;ks(a,i,o)}},destroy:()=>{Ta=Math.max(0,Ta-1),Ta===0&&(np(),Uh())}}},Lt=".rte-content, .editora-content",Tc="rte-citations-styles",U="rte-citations-panel",Gi=".rte-citation-ref[data-citation-id]",sa='.rte-citation-bibliography[data-type="citation-bibliography"]',ca='.rte-citation-footnotes[data-type="citation-footnotes"]',Fe=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',xr=["apa","mla","chicago"],Zh={panelTitle:"Citations",panelAriaLabel:"Citations panel",styleLabel:"Citation style",authorLabel:"Author",yearLabel:"Year",titleLabel:"Title",sourceLabel:"Source",urlLabel:"URL",noteLabel:"Footnote note",insertText:"Insert Citation",refreshText:"Refresh Bibliography",closeText:"Close",bibliographyTitle:"References",footnotesTitle:"Citation Notes",noCitationsText:"No citations inserted yet.",styleButtonPrefix:"Style",recentHeading:"Recent citations",deleteRecentText:"x",summaryPrefix:"Citations",invalidMessage:"Author and title are required."},P=new WeakMap,tr=new WeakMap,Lc=new WeakMap,Dn=new WeakMap,wt=new Map,da=new WeakMap,ki=new WeakMap,_o=new Set;let on=null,an=null,ln=null,Zt=null,$a=0,Yh=0,vl=0,rr=null,xe=null;function Y(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Xh(e){return e.replace(/\u00A0/g," ").replace(/\s+/g," ").trim()}function ap(e,t){const r=t(e);if(!r)return"";const n=r.match(/\d{4}/);return n?n[0]:r}function ip(e,t){const r=t(e);return r?/^https?:\/\//i.test(r)?r:`https://${r}`:""}function Fn(e){return e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)}function lp(e,t){return{id:Fn(t.normalizeText(e.id||"")),author:t.normalizeText(e.author||""),year:ap(e.year||"",t.normalizeText)||void 0,title:t.normalizeText(e.title||""),source:t.normalizeText(e.source||"")||void 0,url:ip(e.url||"",t.normalizeText)||void 0,note:t.normalizeText(e.note||"")||void 0}}function Qa(e={}){const t=e.defaultStyle&&xr.includes(e.defaultStyle)?e.defaultStyle:"apa",r={...Zh,...e.labels||{}};return{defaultStyle:t,enableFootnoteSync:e.enableFootnoteSync!==!1,debounceMs:Math.max(80,Number(e.debounceMs??220)),maxRecentCitations:Math.max(3,Math.min(30,Number(e.maxRecentCitations??8))),labels:r,normalizeText:e.normalizeText||Xh,generateCitationId:typeof e.generateCitationId=="function"?e.generateCitationId:void 0}}function sp(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function ws(e){return e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||e}function Aa(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function Jh(e){const t=ws(e);if(Aa(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return Aa(r)?!0:Aa(document.documentElement)||Aa(document.body)}function wi(e,t){e.classList.remove("rte-citations-theme-dark"),Jh(t)&&e.classList.add("rte-citations-theme-dark")}function He(e,t=!0){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const o=e.editorElement;if(o.matches(Lt))return o;const a=o.querySelector(Lt);if(a instanceof HTMLElement)return a}const r=window.getSelection();if(r&&r.rangeCount>0){const o=r.getRangeAt(0).startContainer,a=sp(o),i=a==null?void 0:a.closest(Lt);if(i)return i}const n=document.activeElement;if(n){if(n.matches(Lt))return n;const o=n.closest(Lt);if(o)return o}return xe&&xe.isConnected?xe:(xe&&!xe.isConnected&&(xe=null),t?document.querySelector(Lt):null)}function Mt(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function Fo(e){const t=sp(e);return t?!!(t.closest(sa)||t.closest(ca)):!1}function Qh(e,t){if(vl+=1,t.generateCitationId){const r=t.generateCitationId({editor:e,index:vl}),n=Fn(t.normalizeText(r||""));if(n)return n}return`cite-${Date.now().toString(36)}-${vl.toString(36)}`}function kl(e){return e.map(t=>(t||"").trim()).filter(Boolean).join(" ").trim()}function ey(e,t){const r=e.author||"Unknown",n=e.year||"n.d.";return t==="mla"?`(${r} ${n})`:t==="chicago"?`(${r} ${n})`:`(${r}, ${n})`}function Es(e,t){const r=e.author||"Unknown",n=e.year||"n.d.",o=e.title||"Untitled",a=e.source||"",i=e.url||"";return kl(t==="mla"?[`${r}.`,`"${o}."`,a?`${a},`:"",`${n}.`,i]:t==="chicago"?[`${r}.`,`${o}.`,a?`${a}.`:"",`(${n}).`,i]:[`${r}.`,`(${n}).`,`${o}.`,a?`${a}.`:"",i])}function Sr(e){return Array.from(e.querySelectorAll(Gi)).filter(t=>!t.closest(sa)&&!t.closest(ca))}function cp(e,t){const r=Fn(t.normalizeText(e.getAttribute("data-citation-id")||""));if(!r)return null;const n=t.normalizeText(e.getAttribute("data-citation-author")||""),o=t.normalizeText(e.getAttribute("data-citation-title")||"");return{id:r,author:n||"Unknown",year:ap(e.getAttribute("data-citation-year")||"",t.normalizeText)||void 0,title:o||"Untitled",source:t.normalizeText(e.getAttribute("data-citation-source")||"")||void 0,url:ip(e.getAttribute("data-citation-url")||"",t.normalizeText)||void 0,note:t.normalizeText(e.getAttribute("data-citation-note")||"")||void 0}}function dp(e,t,r){e.classList.add("rte-citation-ref"),e.setAttribute("data-citation-id",t.id),e.setAttribute("data-citation-author",t.author||""),e.setAttribute("data-citation-year",t.year||""),e.setAttribute("data-citation-title",t.title||""),e.setAttribute("data-citation-source",t.source||""),e.setAttribute("data-citation-url",t.url||""),e.setAttribute("data-citation-note",t.note||""),e.setAttribute("contenteditable","false"),e.setAttribute("tabindex","0"),e.setAttribute("role","doc-biblioref"),e.setAttribute("data-style",r),e.textContent=ey(t,r)}function Zi(e,t,r){const n=ws(e);Array.from(n.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",r),a.setAttribute("data-active",r?"true":"false"),a.setAttribute("aria-pressed",r?"true":"false")})}function Tr(e,t){const r=tr.get(e);return r&&xr.includes(r)?r:(t==null?void 0:t.defaultStyle)||"apa"}function jo(e,t){const r=Sr(e),n=new Map;return r.forEach(o=>{const a=cp(o,t);if(!a)return;if(!n.has(a.id)){n.set(a.id,a);return}const i=n.get(a.id);n.set(a.id,{...i,author:i.author||a.author,title:i.title||a.title,year:i.year||a.year,source:i.source||a.source,url:i.url||a.url,note:i.note||a.note})}),Array.from(n.values())}function ty(e,t,r){const n=lp(t,r);if(!n.id||!n.author||!n.title)return;const a=(Dn.get(e)||[]).filter(i=>i.id!==n.id);Dn.set(e,[n,...a].slice(0,r.maxRecentCitations))}function Yi(e,t,r){const n=Dn.get(e)||[],o=new Map;t.slice(Math.max(0,t.length-r.maxRecentCitations)).reverse().forEach(i=>{i.id&&o.set(i.id,i)}),n.forEach(i=>{!i.id||o.has(i.id)||o.set(i.id,i)});const a=Array.from(o.values()).slice(0,r.maxRecentCitations);return Dn.set(e,a),a}function up(e,t,r,n){const o=Fn(n.normalizeText(t||""));return o&&Yi(e,r,n).find(i=>i.id===o)||null}function ry(e,t,r){const n=Fn(r.normalizeText(t||""));if(!n)return!1;const o=Dn.get(e)||[],a=o.filter(i=>i.id!==n);return a.length===o.length?!1:(Dn.set(e,a),!0)}function fp(e,t,r){const n=document.createElement("section");n.className=e,n.setAttribute("data-type",t),n.setAttribute("contenteditable","false"),n.setAttribute("aria-label",r),t==="citation-bibliography"?n.setAttribute("role","doc-bibliography"):t==="citation-footnotes"&&n.setAttribute("role","doc-endnotes");const o=document.createElement("h3");o.className="rte-citation-section-title",o.textContent=r;const a=document.createElement("ol");return a.className="rte-citation-list",a.setAttribute("role","list"),n.appendChild(o),n.appendChild(a),n}function ny(e,t){let r=e.querySelector(sa);r||(r=fp("rte-citation-bibliography","citation-bibliography",t.labels.bibliographyTitle),e.appendChild(r));const n=r.querySelector(".rte-citation-section-title");return n&&(n.textContent=t.labels.bibliographyTitle),r.setAttribute("aria-label",t.labels.bibliographyTitle),r}function oy(e,t){let r=e.querySelector(ca);r||(r=fp("rte-citation-footnotes","citation-footnotes",t.labels.footnotesTitle),e.appendChild(r));const n=r.querySelector(".rte-citation-section-title");return n&&(n.textContent=t.labels.footnotesTitle),r.setAttribute("aria-label",t.labels.footnotesTitle),r}function pp(e,t){const r=e.querySelector(t);r==null||r.remove()}function ay(e,t,r,n){if(t.length===0){pp(e,sa);return}const a=ny(e,r).querySelector(".rte-citation-list");if(!a)return;const i=document.createDocumentFragment();t.forEach((l,s)=>{const c=document.createElement("li");c.className="rte-citation-item",c.id=`rte-citation-entry-${l.id}`,c.setAttribute("data-citation-id",l.id),c.setAttribute("data-citation-number",String(s+1)),c.textContent=Es(l,n),i.appendChild(c)}),a.innerHTML="",a.appendChild(i)}function iy(e,t,r,n){if(!r.enableFootnoteSync||t.length===0){pp(e,ca),Sr(e).forEach(d=>{d.removeAttribute("data-footnote-number"),d.removeAttribute("data-footnote-target")});return}const a=oy(e,r).querySelector(".rte-citation-list");if(!a)return;const i=new Map,l=new Map;t.forEach((d,u)=>{l.set(d.id,u+1)});const s=new Map;Sr(e).forEach(d=>{const u=d.getAttribute("data-citation-id")||"";if(!u||!l.has(u))return;const f=(s.get(u)||0)+1;s.set(u,f);const m=`rte-citation-ref-${u}-${f}`;d.id=m;const g=l.get(u);d.setAttribute("data-footnote-number",String(g)),d.setAttribute("data-footnote-target",`rte-citation-note-${u}`),i.has(u)||i.set(u,m)});const c=document.createDocumentFragment();t.forEach((d,u)=>{const f=document.createElement("li");f.className="rte-citation-item rte-citation-footnote-item",f.id=`rte-citation-note-${d.id}`,f.setAttribute("data-citation-id",d.id);const m=document.createElement("span");m.className="rte-citation-footnote-number",m.textContent=`${u+1}. `;const g=document.createElement("span");g.className="rte-citation-footnote-text";const p=d.note?`${d.note}. `:"";g.textContent=`${p}${Es(d,n)}`,f.appendChild(m),f.appendChild(g);const y=i.get(d.id);if(y){const b=document.createElement("a");b.className="rte-citation-backref",b.href=`#${y}`,b.setAttribute("aria-label",`Back to citation ${u+1}`),b.textContent="Back",f.appendChild(b)}c.appendChild(f)}),a.innerHTML="",a.appendChild(c)}function ly(e,t,r,n){const o=Es(t,r);e.setAttribute("data-citation-number",String(n)),e.setAttribute("aria-label",`Citation ${n}: ${o}`)}function sy(e,t,r){const n=Sr(e);let o=`${t}:${r?"1":"0"}:${n.length}`;return n.forEach(a=>{o+=`|${a.getAttribute("data-citation-id")||""}`,o+=`|${a.getAttribute("data-citation-author")||""}`,o+=`|${a.getAttribute("data-citation-year")||""}`,o+=`|${a.getAttribute("data-citation-title")||""}`,o+=`|${a.getAttribute("data-citation-source")||""}`,o+=`|${a.getAttribute("data-citation-url")||""}`,o+=`|${a.getAttribute("data-citation-note")||""}`}),o}function Nn(e){const t=wt.get(e);if(!t)return;const r=P.get(e)||rr;if(!r)return;const n=Tr(e,r),o=jo(e,r),a=Yi(e,o,r),i=t.querySelector(".rte-citations-status"),l=t.querySelector('[data-action="cycle-style"]'),s=t.querySelector(".rte-citations-recent-list");if(i){const c=o.length;i.textContent=`${r.labels.summaryPrefix}: ${c} | Style: ${n.toUpperCase()} | Footnotes: ${r.enableFootnoteSync?"On":"Off"}`}if(l&&(l.textContent=`${r.labels.styleButtonPrefix}: ${n.toUpperCase()}`,l.setAttribute("aria-label",`${r.labels.styleButtonPrefix}: ${n.toUpperCase()}`)),s){if(a.length===0){s.innerHTML=`<li class="rte-citations-empty">${Y(r.labels.noCitationsText)}</li>`;return}s.innerHTML=a.map(c=>`
          <li class="rte-citations-recent-item">
            <div class="rte-citations-recent-row">
              <button
                type="button"
                class="rte-citations-recent-btn"
                data-action="insert-from-recent"
                data-citation-id="${Y(c.id)}"
                aria-label="Insert citation: ${Y(c.title)}"
              >
                <span class="rte-citations-recent-title">${Y(c.title)}</span>
                <span class="rte-citations-recent-meta">${Y(c.author)}${c.year?` (${Y(c.year)})`:""}</span>
              </button>
              <button
                type="button"
                class="rte-citations-recent-delete"
                data-action="delete-by-id"
                data-citation-id="${Y(c.id)}"
                aria-label="Delete citation: ${Y(c.title)}"
              >${Y(r.labels.deleteRecentText)}</button>
            </div>
          </li>
        `).join("")}}function Ze(e,t,r=!1){const n=Tr(e,t),o=sy(e,n,t.enableFootnoteSync);if(!r&&Lc.get(e)===o)return jo(e,t);const a=Sr(e),i=new Map;a.forEach(c=>{const d=cp(c,t);d&&(i.has(d.id)||i.set(d.id,d))});const l=Array.from(i.values());Yi(e,l,t);const s=new Map;return l.forEach((c,d)=>{s.set(c.id,d+1)}),a.forEach(c=>{const d=c.getAttribute("data-citation-id")||"",u=i.get(d);if(!u)return;dp(c,u,n);const f=s.get(u.id)||1;ly(c,u,n,Math.max(1,f))}),ay(e,l,t,n),iy(e,l,t,n),Lc.set(e,o),Nn(e),e.dispatchEvent(new CustomEvent("editora:citations-refreshed",{bubbles:!0,detail:{citations:l,style:n,footnoteSync:t.enableFootnoteSync}})),l}function mp(e){const t=ki.get(e);typeof t=="number"&&(window.clearTimeout(t),_o.delete(t),ki.delete(e))}function gp(e){const t=P.get(e)||rr;if(!t)return;mp(e);const r=window.setTimeout(()=>{_o.delete(r),ki.delete(e),Ze(e,t,!1)},t.debounceMs);_o.add(r),ki.set(e,r)}function cy(e){const t=window.getSelection();if(!t)throw new Error("Selection unavailable");if(t.rangeCount>0){const i=t.getRangeAt(0);if(e.contains(i.commonAncestorContainer)&&!Fo(i.commonAncestorContainer))return i.cloneRange()}const r=document.createRange(),n=e.querySelector(sa),o=e.querySelector(ca),a=n||o;return a?(r.setStartBefore(a),r.collapse(!0),r):(r.selectNodeContents(e),r.collapse(!1),r)}function Cs(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function Ss(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function bp(e,t){const r=window.getSelection();if(!r)return;const n=document.createRange();if(e.nodeType===Node.TEXT_NODE){const o=e,a=Math.max(0,Math.min(t,o.length));n.setStart(o,a)}else{const o=e.childNodes.length,a=Math.max(0,Math.min(t,o));n.setStart(e,a)}n.collapse(!0),r.removeAllRanges(),r.addRange(n)}function hp(e){if(e.collapsed||e.startContainer!==e.endContainer||e.endOffset!==e.startOffset+1||!(e.startContainer instanceof Element||e.startContainer instanceof DocumentFragment))return null;const t=e.startContainer.childNodes[e.startOffset];return!(t instanceof HTMLElement)||!t.matches(Gi)?null:t}function Ma(e,t,r){const{startContainer:n,startOffset:o}=e;if(n.nodeType===Node.ELEMENT_NODE){const i=n;if(r==="previous"){if(o>0)return i.childNodes[o-1]||null}else if(o<i.childNodes.length)return i.childNodes[o]||null}if(n.nodeType===Node.TEXT_NODE&&(r==="previous"&&o<n.data.length||r==="next"&&o>0))return null;let a=n;for(;a&&a!==t;){const i=r==="previous"?a.previousSibling:a.nextSibling;if(i)return i;a=a.parentNode}return null}function yp(e,t,r){if(!e.collapsed)return null;const n=i=>i instanceof HTMLElement&&i.matches(Gi)?i:null,{startContainer:o,startOffset:a}=e;if(o.nodeType===Node.ELEMENT_NODE){const i=o;return r==="Backspace"&&a>0?n(i.childNodes[a-1]||null):r==="Delete"?n(i.childNodes[a]||null):null}if(o.nodeType===Node.TEXT_NODE){const i=o;if(r==="Backspace"&&a===0){const l=n(i.previousSibling);return l||n(Ma(e,t,"previous"))}if(r==="Delete"&&a===i.data.length){const l=n(i.nextSibling);return l||n(Ma(e,t,"next"))}}return n(r==="Backspace"?Ma(e,t,"previous"):Ma(e,t,"next"))}function sn(e,t,r){const n=e.closest(Lt);if(!n||Fo(e))return!1;const o=e.parentNode;if(!o)return!1;const a=n.innerHTML,i=Array.from(o.childNodes).indexOf(e);if(i<0)return!1;const l=e.nextSibling;return l instanceof Text&&(l.data===" "?l.remove():l.data.startsWith(" ")&&(l.data=l.data.slice(1))),e.remove(),bp(o,i),Ze(n,r,!0),Ss(n,a),Cs(n),t==="Delete"&&n.focus({preventScroll:!0}),!0}function dy(e,t,r){if(e.key!=="Backspace"&&e.key!=="Delete")return!1;const n=e.key,o=e.target;if(o!=null&&o.matches(Gi)&&t.contains(o)&&!Fo(o))return e.preventDefault(),e.stopPropagation(),sn(o,n,r);const a=window.getSelection();if(!a||a.rangeCount===0)return!1;const i=a.getRangeAt(0);if(!t.contains(i.commonAncestorContainer)||Fo(i.commonAncestorContainer))return!1;const l=hp(i);if(l)return e.preventDefault(),e.stopPropagation(),sn(l,n,r);const s=yp(i,t,n);return s?(e.preventDefault(),e.stopPropagation(),sn(s,n,r)):!1}function xp(e,t,r){const n=Fn(r.normalizeText(t||""));if(!n)return!1;const o=Sr(e).filter(i=>i.getAttribute("data-citation-id")===n);if(o.length===0)return!1;if(o.length===1)return sn(o[0],"Delete",r);const a=e.innerHTML;return o.forEach(i=>{const l=i.nextSibling;l instanceof Text&&(l.data===" "?l.remove():l.data.startsWith(" ")&&(l.data=l.data.slice(1))),i.remove()}),bp(e,e.childNodes.length),Ze(e,r,!0),Ss(e,a),Cs(e),e.focus({preventScroll:!0}),!0}function uy(e,t){const r=window.getSelection();if(!r||r.rangeCount===0)return!1;const n=r.getRangeAt(0);if(!e.contains(n.commonAncestorContainer)||Fo(n.commonAncestorContainer))return!1;const o=hp(n);if(o)return sn(o,"Delete",t);const a=yp(n,e,"Backspace");return a?sn(a,"Backspace",t):!1}function Ei(e,t,r){var d,u;const n=lp(t,r);if(!n.author||!n.title)return!1;n.id||(n.id=Qh(e,r));const o=e.innerHTML;let a;try{a=cy(e)}catch{return!1}const i=window.getSelection();if(!i)return!1;a.collapsed||a.deleteContents();const l=document.createElement("span");dp(l,n,Tr(e,r));try{a.insertNode(l)}catch{return!1}const s=document.createTextNode(" ");l.nextSibling?(d=l.parentNode)==null||d.insertBefore(s,l.nextSibling):(u=l.parentNode)==null||u.appendChild(s);const c=document.createRange();if(s.parentNode){const f=Array.from(s.parentNode.childNodes).indexOf(s)+1;c.setStart(s.parentNode,Math.max(0,f))}else c.setStartAfter(l);return c.collapse(!0),i.removeAllRanges(),i.addRange(c),ty(e,n,r),Ze(e,r,!0),Ss(e,o),Cs(e),!0}function fy(e,t){if(!t)return!1;const r=Sr(e).find(a=>a.getAttribute("data-citation-id")===t)||null;if(!r)return!1;r.scrollIntoView({behavior:"smooth",block:"center",inline:"nearest"}),r.focus({preventScroll:!0});const n=window.getSelection();if(!n)return!0;const o=document.createRange();return o.selectNode(r),n.removeAllRanges(),n.addRange(o),!0}function Ci(e){return da.get(e)===!0}function Vo(e,t=!1){const r=wt.get(e);r&&(r.classList.remove("show"),da.set(e,!1),Zi(e,"toggleCitationsPanel",!1),t&&e.focus({preventScroll:!0}))}function py(e){wt.forEach((t,r)=>{r!==e&&Vo(r,!1)})}function jl(e,t){if(!t.classList.contains("show"))return;const n=ws(e).getBoundingClientRect(),o=Math.min(window.innerWidth-20,380),a=Math.max(10,window.innerWidth-o-10),i=Math.min(Math.max(10,n.right-o),a),l=Math.max(10,Math.min(window.innerHeight-10-260,n.top+10));t.style.width=`${o}px`,t.style.left=`${i}px`,t.style.top=`${l}px`,t.style.maxHeight=`${Math.max(260,window.innerHeight-24)}px`}function at(e,t){return e.querySelector(`[data-field="${t}"]`)}function my(e){var l,s,c,d,u,f;const t=((l=at(e,"author"))==null?void 0:l.value)||"",r=((s=at(e,"year"))==null?void 0:s.value)||"",n=((c=at(e,"title"))==null?void 0:c.value)||"",o=((d=at(e,"source"))==null?void 0:d.value)||"",a=((u=at(e,"url"))==null?void 0:u.value)||"",i=((f=at(e,"note"))==null?void 0:f.value)||"";return{author:t,year:r,title:n,source:o,url:a,note:i}}function Ct(e,t){const r=e.querySelector(".rte-citations-live");r&&(r.textContent=t)}function gy(e,t,r){const n=at(t,"style");n&&(n.value=Tr(e,r))}function vp(e,t,r){const n=xr.includes(t)?t:r.defaultStyle;return tr.set(e,n),Ze(e,r,!0),n}function Ts(e,t){const r=Tr(e,t),n=xr.indexOf(r),o=xr[(n+1)%xr.length];return tr.set(e,o),Ze(e,t,!0),o}function by(e){const t=wt.get(e);if(t)return t;const r=P.get(e)||rr||Qa(),n=`rte-citations-panel-${Yh++}`,o=document.createElement("section");o.className=U,o.id=n,o.setAttribute("role","dialog"),o.setAttribute("aria-modal","false"),o.setAttribute("aria-label",r.labels.panelAriaLabel),o.setAttribute("tabindex","-1"),o.innerHTML=`
    <header class="rte-citations-header">
      <h2 class="rte-citations-title">${Y(r.labels.panelTitle)}</h2>
      <button type="button" class="rte-citations-icon-btn" data-action="close" aria-label="${Y(r.labels.closeText)}">✕</button>
    </header>
    <div class="rte-citations-body">
      <p class="rte-citations-status" aria-live="polite"></p>

      <div class="rte-citations-grid">
        <label class="rte-citations-label">
          ${Y(r.labels.styleLabel)}
          <select data-field="style" class="rte-citations-field">
            <option value="apa">APA</option>
            <option value="mla">MLA</option>
            <option value="chicago">Chicago</option>
          </select>
        </label>
        <label class="rte-citations-label">
          ${Y(r.labels.authorLabel)}
          <input type="text" data-field="author" class="rte-citations-field" autocomplete="off" />
        </label>
        <label class="rte-citations-label">
          ${Y(r.labels.yearLabel)}
          <input type="text" data-field="year" class="rte-citations-field" inputmode="numeric" autocomplete="off" />
        </label>
        <label class="rte-citations-label">
          ${Y(r.labels.titleLabel)}
          <input type="text" data-field="title" class="rte-citations-field" autocomplete="off" />
        </label>
        <label class="rte-citations-label">
          ${Y(r.labels.sourceLabel)}
          <input type="text" data-field="source" class="rte-citations-field" autocomplete="off" />
        </label>
        <label class="rte-citations-label">
          ${Y(r.labels.urlLabel)}
          <input type="url" data-field="url" class="rte-citations-field" autocomplete="off" />
        </label>
        <label class="rte-citations-label rte-citations-label-note">
          ${Y(r.labels.noteLabel)}
          <textarea data-field="note" class="rte-citations-field" rows="2"></textarea>
        </label>
      </div>

      <div class="rte-citations-controls" role="toolbar" aria-label="Citation actions">
        <button type="button" class="rte-citations-btn rte-citations-btn-primary" data-action="insert">${Y(r.labels.insertText)}</button>
        <button type="button" class="rte-citations-btn" data-action="refresh">${Y(r.labels.refreshText)}</button>
        <button type="button" class="rte-citations-btn" data-action="cycle-style"></button>
      </div>

      <section class="rte-citations-recent" aria-label="${Y(r.labels.recentHeading)}">
        <h3 class="rte-citations-recent-heading">${Y(r.labels.recentHeading)}</h3>
        <ul class="rte-citations-recent-list" role="list"></ul>
      </section>

      <p class="rte-citations-shortcut">Shortcut: Ctrl/Cmd + Alt + Shift + C</p>
      <span class="rte-citations-live" aria-live="polite"></span>
    </div>
  `,o.addEventListener("click",i=>{const l=i.target;if(!l)return;const s=l.closest("[data-action]");if(!s)return;const c=s.getAttribute("data-action")||"",d=P.get(e)||rr||r;if(P.set(e,d),c==="close"){Vo(e,!0);return}if(c==="insert"){if(Mt(e))return;const u=my(o);if(!d.normalizeText(u.author)||!d.normalizeText(u.title)){Ct(o,d.labels.invalidMessage);return}if(!Ei(e,u,d)){Ct(o,d.labels.invalidMessage);return}Ct(o,"Citation inserted.");const m=at(o,"title"),g=at(o,"note");m&&(m.value=""),g&&(g.value="");return}if(c==="refresh"){const u=Ze(e,d,!0);Ct(o,`Refreshed ${u.length} citation${u.length===1?"":"s"}.`);return}if(c==="cycle-style"){const u=Ts(e,d);gy(e,o,d),Ct(o,`Style changed to ${u.toUpperCase()}.`);return}if(c==="insert-from-recent"){if(Mt(e))return;const u=s.getAttribute("data-citation-id")||"",f=up(e,u,jo(e,d),d);if(!f)return;Ei(e,f,d),Ct(o,`Inserted citation: ${f.title}.`);return}if(c==="delete-by-id"){if(Mt(e))return;const u=s.getAttribute("data-citation-id")||"";if(xp(e,u,d)){Ct(o,"Citation deleted.");return}ry(e,u,d)&&(Nn(e),Ct(o,"Removed from recent citations."))}}),o.addEventListener("keydown",i=>{if(i.key==="Escape"){i.preventDefault(),Vo(e,!0);return}const l=i.target;if(!l||!l.matches(".rte-citations-recent-btn")||i.key!=="ArrowDown"&&i.key!=="ArrowUp")return;const s=Array.from(o.querySelectorAll(".rte-citations-recent-btn"));if(s.length===0)return;const c=s.indexOf(l);if(c<0)return;i.preventDefault();const d=i.key==="ArrowDown"?1:-1,u=(c+d+s.length)%s.length;s[u].focus()});const a=at(o,"style");return a==null||a.addEventListener("change",()=>{const i=P.get(e)||rr||r,l=a.value;vp(e,l,i),Ct(o,`Style changed to ${l.toUpperCase()}.`)}),wi(o,e),document.body.appendChild(o),wt.set(e,o),da.set(e,!1),Nn(e),o}function zr(e){const t=by(e);py(e),t.classList.add("show"),da.set(e,!0),Zi(e,"toggleCitationsPanel",!0),wi(t,e),jl(e,t),Nn(e);const r=at(t,"author");r==null||r.focus()}function kp(e,t){const r=Ci(e);return(typeof t=="boolean"?t:!r)?zr(e):Vo(e,!1),!0}function hy(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="c"}function yy(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="b"}function xy(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="j"}function vy(e){rr=e,on||(on=t=>{const r=t.target,n=r==null?void 0:r.closest(Lt);if(!n)return;xe=n,P.has(n)||P.set(n,e),tr.has(n)||tr.set(n,e.defaultStyle);const o=wt.get(n);o&&(wi(o,n),jl(n,o)),Zi(n,"toggleCitationsPanel",Ci(n))},document.addEventListener("focusin",on,!0)),an||(an=t=>{const r=t.target,n=r==null?void 0:r.closest(Lt);n&&(xe=n,gp(n))},document.addEventListener("input",an,!0)),ln||(ln=t=>{if(t.defaultPrevented)return;const r=t.target,n=!!(r!=null&&r.closest(`.${U} input, .${U} textarea, .${U} select`)),o=He(void 0,!1);if(!o||Mt(o))return;const a=P.get(o)||rr||e;if(P.set(o,a),xe=o,t.key==="Escape"&&Ci(o)){t.preventDefault(),Vo(o,!0);return}if(!n&&!dy(t,o,a)){if(hy(t)){t.preventDefault(),t.stopPropagation(),kp(o);return}if(yy(t)){t.preventDefault(),t.stopPropagation(),Ze(o,a,!0),zr(o);return}xy(t)&&(t.preventDefault(),t.stopPropagation(),Ts(o,a))}},document.addEventListener("keydown",ln,!0)),Zt||(Zt=()=>{wt.forEach((t,r)=>{if(!r.isConnected||!t.isConnected){mp(r),t.remove(),wt.delete(r),da.delete(r);return}wi(t,r),jl(r,t)})},window.addEventListener("scroll",Zt,!0),window.addEventListener("resize",Zt))}function ky(){on&&(document.removeEventListener("focusin",on,!0),on=null),an&&(document.removeEventListener("input",an,!0),an=null),ln&&(document.removeEventListener("keydown",ln,!0),ln=null),Zt&&(window.removeEventListener("scroll",Zt,!0),window.removeEventListener("resize",Zt),Zt=null),wt.forEach(e=>e.remove()),wt.clear(),rr=null,xe=null}function wy(){if(typeof document>"u"||document.getElementById(Tc))return;const e=document.createElement("style");e.id=Tc,e.textContent=`
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

    ${Fe} .rte-toolbar-group-items.citations,
    ${Fe} .editora-toolbar-group-items.citations,
    .${U}.rte-citations-theme-dark {
      border-color: #566275;
    }

    ${Fe} .rte-toolbar-group-items.citations .rte-toolbar-button[data-command="refreshCitations"] svg,
    ${Fe} .editora-toolbar-group-items.citations .editora-toolbar-button[data-command="refreshCitations"] svg
    {
      fill: none;
    }
    ${Fe} .rte-toolbar-group-items.citations .rte-toolbar-button,
    ${Fe} .editora-toolbar-group-items.citations .editora-toolbar-button
    {
      border-color: #566275;
    }
    ${Fe} .rte-toolbar-button[data-command="toggleCitationsPanel"].active,
    ${Fe} .editora-toolbar-button[data-command="toggleCitationsPanel"].active {
      background: linear-gradient(180deg, #5eaaf6 0%, #4a95de 100%);
    }
    .${U} {
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

    .${U}.show {
      display: flex;
    }

    .${U}.rte-citations-theme-dark {
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

    .${U}.rte-citations-theme-dark .rte-citations-header {
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

    .${U}.rte-citations-theme-dark .rte-citations-icon-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    .${U}.rte-citations-theme-dark .rte-citations-icon-btn:hover,
    .${U}.rte-citations-theme-dark .rte-citations-icon-btn:focus-visible {
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

    .${U}.rte-citations-theme-dark .rte-citations-status {
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

    .${U}.rte-citations-theme-dark .rte-citations-field {
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

    .${U}.rte-citations-theme-dark .rte-citations-btn {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .${U}.rte-citations-theme-dark .rte-citations-btn-primary {
      border-color: #2563eb;
      background: #2563eb;
      color: #ffffff;
    }

    .rte-citations-recent {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px;
    }

    .${U}.rte-citations-theme-dark .rte-citations-recent {
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

    .${U}.rte-citations-theme-dark .rte-citations-recent-btn {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .${U}.rte-citations-theme-dark .rte-citations-recent-delete {
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

    .${U}.rte-citations-theme-dark .rte-citations-recent-meta {
      color: #94a3b8;
    }

    .rte-citations-empty {
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 8px;
      font-size: 12px;
      color: #64748b;
    }

    .${U}.rte-citations-theme-dark .rte-citations-empty {
      border-color: #334155;
      color: #94a3b8;
    }

    .rte-citations-shortcut {
      margin: 0;
      font-size: 11px;
      color: #64748b;
    }

    .${U}.rte-citations-theme-dark .rte-citations-shortcut {
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

    .${Fe} .rte-citation-ref {
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

    .${Fe} .rte-citation-bibliography,
    .${Fe} .rte-citation-footnotes {
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

    .${Fe} .rte-citation-backref {
      color: #93c5fd;
    }

    @media (max-width: 768px) {
      .${U} {
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
  `,document.head.appendChild(e)}const Ey=(e={})=>{const t=Qa(e);return wy(),{name:"citations",toolbar:[{id:"citationsGroup",label:"Citations",type:"group",command:"citations",items:[{id:"citations",label:"Citations",command:"toggleCitationsPanel",shortcut:"Mod-Alt-Shift-c",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M6 5h12M6 9h12M6 13h8M6 17h10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M17 14.5a2.5 2.5 0 0 1 2.5 2.5v2H15v-2a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.5"/></svg>'},{id:"citationsRefresh",label:"Refresh Citations",command:"refreshCitations",shortcut:"Mod-Alt-Shift-b",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.34-5.66" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M20 4v6h-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'},{id:"citationsStyle",label:"Cycle Citation Style",command:"cycleCitationStyle",shortcut:"Mod-Alt-Shift-j",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M5 6h14M5 10h8M5 14h14M5 18h10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="18" cy="10" r="2" stroke="currentColor" stroke-width="1.6"/></svg>'}]}],commands:{citations:(r,n)=>{const o=He(n);if(!o||Mt(o))return!1;const a=P.get(o)||t;return P.set(o,a),tr.set(o,Tr(o,a)),xe=o,zr(o),Ze(o,a,!1),!0},toggleCitationsPanel:(r,n)=>{const o=He(n);if(!o||Mt(o))return!1;const a=P.get(o)||t;P.set(o,a),xe=o;const i=kp(o,typeof r=="boolean"?r:void 0);return Ci(o)&&Ze(o,a,!1),i},insertCitation:(r,n)=>{const o=He(n);if(!o||Mt(o)||!r||typeof r!="object")return!1;const a=P.get(o)||t;P.set(o,a),xe=o;const i=Ei(o,r,a);return i&&zr(o),i},refreshCitations:(r,n)=>{const o=He(n);if(!o)return!1;const a=P.get(o)||t;return P.set(o,a),xe=o,Ze(o,a,!0),zr(o),!0},setCitationStyle:(r,n)=>{const o=He(n);if(!o||!r)return!1;const a=P.get(o)||t;return P.set(o,a),xe=o,vp(o,r,a),!0},cycleCitationStyle:(r,n)=>{const o=He(n);if(!o)return!1;const a=P.get(o)||t;return P.set(o,a),xe=o,Ts(o,a),Nn(o),!0},getCitationRecords:(r,n)=>{const o=He(n);if(!o)return!1;const a=P.get(o)||t,i=jo(o,a);if(typeof r=="function")try{r(i)}catch{}return o.__citationRecords=i,o.dispatchEvent(new CustomEvent("editora:citations-data",{bubbles:!0,detail:{records:i,style:Tr(o,a)}})),!0},setCitationsOptions:(r,n)=>{const o=He(n);if(!o||!r||typeof r!="object")return!1;const a=P.get(o)||t,i=Qa({...a,...r,labels:{...a.labels,...r.labels||{}},normalizeText:r.normalizeText||a.normalizeText,generateCitationId:r.generateCitationId||a.generateCitationId});return P.set(o,i),r.defaultStyle&&xr.includes(r.defaultStyle)&&tr.set(o,r.defaultStyle),Ze(o,i,!0),Nn(o),!0},locateCitation:(r,n)=>{const o=He(n);return!o||typeof r!="string"?!1:fy(o,r)},deleteCitation:(r,n)=>{const o=He(n);if(!o||Mt(o))return!1;const a=P.get(o)||t;return P.set(o,a),typeof r=="string"&&r.trim()?xp(o,r,a):uy(o,a)},insertRecentCitation:(r,n)=>{const o=He(n);if(!o||Mt(o))return!1;const a=P.get(o)||t;P.set(o,a);const i=jo(o,a),l=Yi(o,i,a);if(l.length===0)return!1;const s=typeof r=="string"&&r.trim()?up(o,r,i,a):l[0];if(!s)return!1;const c=Ei(o,s,a);return c&&zr(o),c}},keymap:{"Mod-Alt-Shift-c":"toggleCitationsPanel","Mod-Alt-Shift-C":"toggleCitationsPanel","Mod-Alt-Shift-b":"refreshCitations","Mod-Alt-Shift-B":"refreshCitations","Mod-Alt-Shift-j":"cycleCitationStyle","Mod-Alt-Shift-J":"cycleCitationStyle"},init:function(n){$a+=1;const o=this&&typeof this.__pluginConfig=="object"?Qa({...t,...this.__pluginConfig}):t;vy(o);const a=He(n&&n.editorElement?{editorElement:n.editorElement}:void 0,!1);a&&(xe=a,P.set(a,o),tr.set(a,o.defaultStyle),Zi(a,"toggleCitationsPanel",!1),gp(a))},destroy:()=>{$a=Math.max(0,$a-1),!($a>0)&&(_o.forEach(r=>{window.clearTimeout(r)}),_o.clear(),ky())}}},Ye=".rte-content, .editora-content",Ls="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",$c="__editoraCommandEditorRoot",Ac="rte-smart-paste-styles",j="rte-smart-paste-panel",je="smart-paste",dt="smartPaste",ut=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',Cy=typeof NodeFilter<"u"?NodeFilter.SHOW_COMMENT:128,Mc="__editoraSmartPasteHandled",Sy=new Set(["script","style","meta","link","object","embed","iframe","svg","canvas","math","form","input","button","textarea","select","option"]),Ty=new Set(["table","thead","tbody","tfoot","tr","td","th","colgroup","col"]),Ly=new Set(["span","font"]),$y=/^(https?:|mailto:|tel:|#|\/)/i,Ay=/^data:image\/(?:png|gif|jpeg|jpg|webp);base64,/i,My=new Set(["color","background-color","font-weight","font-style","text-decoration","text-align","font-size","font-family","line-height","letter-spacing","word-spacing","white-space","vertical-align","margin-left","margin-right","margin-top","margin-bottom","padding-left","padding-right","padding-top","padding-bottom","text-indent","border","border-top","border-right","border-bottom","border-left","border-color","border-width","border-style","list-style-type"]),Ry={panelTitle:"Smart Paste",panelAriaLabel:"Smart paste panel",enabledText:"Smart paste is enabled",disabledText:"Smart paste is disabled",toggleOnText:"Disable Smart Paste",toggleOffText:"Enable Smart Paste",cycleProfileText:"Cycle Profile",profileLabel:"Profile",fidelityText:"Fidelity",balancedText:"Balanced",plainText:"Plain Text",lastPasteHeading:"Last Paste Result",lastPasteEmptyText:"Paste content to see cleanup metrics.",lastPasteSourceLabel:"Source",lastPasteProfileLabel:"Profile",lastPasteRemovedLabel:"Removed",lastPasteCharsLabel:"Output Chars",closeText:"Close",shortcutText:"Shortcuts: Ctrl/Cmd+Alt+Shift+S/V/G",readonlyMessage:"Editor is read-only. Smart paste was skipped."},wl={fidelity:{keepStyles:!0,keepClasses:!1,keepDataAttributes:!1,preserveTables:!0},balanced:{keepStyles:!1,keepClasses:!1,keepDataAttributes:!1,preserveTables:!0},plain:{keepStyles:!1,keepClasses:!1,keepDataAttributes:!1,preserveTables:!1}},q=new WeakMap,Bn=new WeakMap,Oe=new Map,ua=new WeakMap,Si=new WeakMap,Ko=new Set;let Ra=0,Dy=0,Pn=null,Le=null,cn=null,dn=null,Yt=null,un=null;function El(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ny(e){return e.replace(/\u00A0/g," ").replace(/\r\n?/g,`
`)}function Wo(e){return e==="balanced"||e==="plain"?e:"fidelity"}function Cl(e,t){return{keepStyles:(e==null?void 0:e.keepStyles)??t.keepStyles,keepClasses:(e==null?void 0:e.keepClasses)??t.keepClasses,keepDataAttributes:(e==null?void 0:e.keepDataAttributes)??t.keepDataAttributes,preserveTables:(e==null?void 0:e.preserveTables)??t.preserveTables}}function ei(e={}){const t=e.profileOptions||{};return{enabled:e.enabled!==!1,defaultProfile:Wo(e.defaultProfile),maxHtmlLength:Math.max(8e3,Math.min(8e5,Number(e.maxHtmlLength??22e4))),removeComments:e.removeComments!==!1,normalizeWhitespace:e.normalizeWhitespace!==!1,labels:{...Ry,...e.labels||{}},normalizeText:e.normalizeText||Ny,profileOptions:{fidelity:Cl(t.fidelity,wl.fidelity),balanced:Cl(t.balanced,wl.balanced),plain:Cl(t.plain,wl.plain)}}}function Rc(e){return{enabled:e.enabled,defaultProfile:e.defaultProfile,maxHtmlLength:e.maxHtmlLength,removeComments:e.removeComments,normalizeWhitespace:e.normalizeWhitespace,labels:{...e.labels},normalizeText:e.normalizeText,profileOptions:{fidelity:{...e.profileOptions.fidelity},balanced:{...e.profileOptions.balanced},plain:{...e.profileOptions.plain}}}}function $s(e){return e.closest(Ls)||e}function Uo(e){if(!e)return null;if(e.matches(Ye))return e;const t=e.querySelector(Ye);return t instanceof HTMLElement?t:null}function By(){if(typeof window>"u")return null;const e=window[$c];if(!(e instanceof HTMLElement))return null;window[$c]=null;const t=Uo(e);if(t)return t;const r=e.closest(Ls);if(r){const o=Uo(r);if(o)return o}const n=e.closest(Ye);return n instanceof HTMLElement?n:null}function Py(e){const t=e.closest("[data-editora-editor]");if(t&&Uo(t)===e)return t;let r=e;for(;r;){if(r.matches(Ls)&&(r===e||Uo(r)===e))return r;r=r.parentElement}return $s(e)}function wp(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function Ft(e,t=!0,r=!0){if(ti(),(e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const i=Uo(e.editorElement);if(i)return i}const n=By();if(n)return n;const o=window.getSelection();if(o&&o.rangeCount>0){const i=wp(o.getRangeAt(0).startContainer),l=i==null?void 0:i.closest(Ye);if(l)return l}const a=document.activeElement;if(a){if(a.matches(Ye))return a;const i=a.closest(Ye);if(i)return i}if(r){if(Le&&Le.isConnected)return Le;Le&&!Le.isConnected&&(Le=null)}return t?document.querySelector(Ye):null}function Iy(e){const t=e.target;if(t){const n=t.closest(Ye);if(n)return n}const r=window.getSelection();if(r&&r.rangeCount>0){const n=wp(r.getRangeAt(0).startContainer),o=n==null?void 0:n.closest(Ye);if(o)return o}return null}function Da(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function Hy(e){const t=$s(e);if(Da(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return Da(r)?!0:Da(document.documentElement)||Da(document.body)}function Ti(e,t){e.classList.remove("rte-smart-paste-theme-dark"),Hy(t)&&e.classList.add("rte-smart-paste-theme-dark")}function Dc(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function Go(e,t,r){const n=Py(e);Array.from(n.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",r),a.setAttribute("data-active",r?"true":"false"),a.setAttribute("aria-pressed",r?"true":"false")})}function we(e,t){q.has(e)||q.set(e,t);let r=Bn.get(e);return r||(r={enabled:t.enabled,profile:t.defaultProfile,lastReport:null},Bn.set(e,r)),tx(e),Ko.add(e),r}function Ep(e){const t=Si.get(e);t&&(e.removeEventListener("paste",t,!0),Si.delete(e))}function Cp(e){var t;Ep(e),(t=Oe.get(e))==null||t.remove(),Oe.delete(e),ua.delete(e),q.delete(e),Bn.delete(e),Ko.delete(e),Le===e&&(Le=null)}function ti(){Array.from(Ko).forEach(t=>{t.isConnected||Cp(t)})}function Oy(e){var t,r,n,o;for(let a=0;a<e.length;a+=1){const i=e[a];if(!(i.type!=="childList"||i.removedNodes.length===0))for(let l=0;l<i.removedNodes.length;l+=1){const s=i.removedNodes[l];if(s.nodeType!==Node.ELEMENT_NODE)continue;const c=s;if((t=c.matches)!=null&&t.call(c,Ye)||(r=c.matches)!=null&&r.call(c,`.${j}`)||(n=c.querySelector)!=null&&n.call(c,Ye)||(o=c.querySelector)!=null&&o.call(c,`.${j}`))return!0}}return!1}function As(e){return ua.get(e)===!0}function Lo(e,t){const r=e.querySelector(".rte-smart-paste-live");r&&(r.textContent=t)}function Sl(e,t){const r=t.normalizeText(e);return t.normalizeWhitespace?r.split(`
`).map(o=>o.replace(/[\t ]+/g," ").trimEnd()).join(`
`).replace(/\n{3,}/g,`

`).trim():r}function zy(e){return/class=["'][^"']*Mso|xmlns:w=|urn:schemas-microsoft-com:office|<o:p\b/i.test(e)}function qy(e){return/id=["']docs-internal-guid|docs-\w+|data-sheets-value|data-sheets-userformat/i.test(e)}function _y(e,t){return e?zy(e)?"word":qy(e)?"google-docs":"html":t?"plain":"html"}function Fy(e){return e.split(/\s+/).map(r=>r.trim()).filter(Boolean).filter(r=>!/^mso/i.test(r)).filter(r=>!/^docs-/i.test(r)).filter(r=>!/^c\d+$/i.test(r)).join(" ")}function jy(e){if(!e)return{value:"",changed:!1};const t=e.split(";"),r=[];let n=!1;return t.forEach(o=>{const a=o.indexOf(":");if(a<=0){o.trim()&&(n=!0);return}const i=o.slice(0,a).trim().toLowerCase(),l=o.slice(a+1).trim();if(!i||!l){n=!0;return}if(!My.has(i)){n=!0;return}if(/expression\s*\(|javascript\s*:|vbscript\s*:|url\s*\(/i.test(l)){n=!0;return}r.push(`${i}: ${l}`)}),{value:r.join("; "),changed:n}}function Nc(e){const t=e.trim();return t&&($y.test(t)||Ay.test(t))?t:""}function Bc(e){const t=e.parentNode;if(t){for(;e.firstChild;)t.insertBefore(e.firstChild,e);t.removeChild(e)}}function Vy(e,t,r,n){const o=e.tagName.toLowerCase();if(Sy.has(o)){n.removedElements+=1,e.remove();return}if(!t.preserveTables&&Ty.has(o)){const i=e.textContent||"",l=document.createTextNode(i);e.replaceWith(l),n.removedElements+=1;return}if(Array.from(e.attributes).forEach(i=>{const l=i.name.toLowerCase(),s=i.value;if(l.startsWith("on")){e.removeAttribute(i.name),n.removedAttributes+=1;return}if(l==="style"){if(!t.keepStyles){e.removeAttribute(i.name),n.removedAttributes+=1;return}const c=jy(s);if(!c.value){e.removeAttribute(i.name),n.removedAttributes+=1,c.changed&&(n.normalizedStyles+=1);return}(c.changed||c.value!==s)&&(e.setAttribute("style",c.value),n.normalizedStyles+=1);return}if(l==="class"){if(!t.keepClasses){e.removeAttribute(i.name),n.removedAttributes+=1;return}const c=Fy(s);if(!c){e.removeAttribute(i.name),n.removedAttributes+=1;return}c!==s&&(e.setAttribute("class",c),n.removedAttributes+=1);return}if(l.startsWith("data-")&&!t.keepDataAttributes){e.removeAttribute(i.name),n.removedAttributes+=1;return}if(l==="id"||l==="xmlns"||l.startsWith("xml")){e.removeAttribute(i.name),n.removedAttributes+=1;return}if((r==="word"||r==="google-docs")&&(l==="lang"||l==="dir")){e.removeAttribute(i.name),n.removedAttributes+=1;return}if(l==="href"||l==="src"||l==="xlink:href"){const c=Nc(s);if(!c){e.removeAttribute(i.name),n.removedAttributes+=1;return}c!==s&&e.setAttribute(i.name,c)}}),o==="a"){if(!e.getAttribute("href")){Bc(e),n.removedElements+=1;return}e.getAttribute("target")==="_blank"&&e.setAttribute("rel","noopener noreferrer")}if(o==="img"){const i=e.getAttribute("src");if(!i||!Nc(i)){n.removedElements+=1,e.remove();return}}if(Ly.has(o)&&!e.attributes.length&&!e.className&&!e.style.cssText){const i=e.children.length>0,l=(e.textContent||"").trim().length>0;if(!i&&!l){e.remove(),n.removedElements+=1;return}!i&&l&&(Bc(e),n.removedElements+=1)}}function Ky(e,t,r,n,o){const a=document.createElement("template");a.innerHTML=e;const i={removedElements:0,removedAttributes:0,removedComments:0,normalizedStyles:0};if(n.removeComments)try{const d=document.createTreeWalker(a.content,Cy,null),u=[];let f=d.nextNode();for(;f;)u.push(f),f=d.nextNode();u.forEach(m=>{m.remove(),i.removedComments+=1})}catch{}Array.from(a.content.querySelectorAll("*")).forEach(d=>{d.isConnected&&Vy(d,t,r,i)});let s=a.innerHTML;n.normalizeWhitespace&&o!=="fidelity"?s=s.replace(/\s{2,}/g," ").replace(/>\s+</g,"><").trim():n.normalizeWhitespace&&(s=s.trim());const c=(a.content.textContent||"").trim().length;return{html:s,textLength:c,counters:i}}function Sp(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);return e.contains(r.commonAncestorContainer)?r:null}function Tp(e,t){if(!e.isConnected)return;const r=window.getSelection();r&&(r.removeAllRanges(),r.addRange(t))}function Wy(e,t){e.focus({preventScroll:!0});try{if(document.execCommand("insertHTML",!1,t))return!0}catch{}const r=Sp(e);if(!r)return!1;r.deleteContents();const n=document.createElement("template");n.innerHTML=t;const o=n.content,a=o.lastChild;if(r.insertNode(o),a){const i=document.createRange();i.setStartAfter(a),i.collapse(!0),Tp(e,i)}return!0}function Uy(e,t){e.focus({preventScroll:!0});try{if(document.execCommand("insertText",!1,t))return!0}catch{}const r=Sp(e);if(!r)return!1;r.deleteContents();const n=document.createTextNode(t);r.insertNode(n);const o=document.createRange();return o.setStart(n,n.length),o.collapse(!0),Tp(e,o),!0}function Gy(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function Zy(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function Na(e,t,r,n,o,a){return{source:e,profile:t,inputHtmlLength:r,outputHtmlLength:n,outputTextLength:o,removedElements:a.removedElements,removedAttributes:a.removedAttributes,removedComments:a.removedComments,normalizedStyles:a.normalizedStyles,createdAt:new Date().toISOString()}}function Yy(e,t,r,n){const o=_y(e,t);if(r==="plain"){const l=t||e.replace(/<[^>]*>/g," "),s=Sl(l,n);return{mode:"text",value:s,report:Na(o,r,e.length,0,s.length,{removedElements:0,removedAttributes:0,removedComments:0,normalizedStyles:0})}}if(!e||e.length>n.maxHtmlLength){const l=Sl(t||e.replace(/<[^>]*>/g," "),n);return{mode:"text",value:l,report:Na(o,r,e.length,0,l.length,{removedElements:0,removedAttributes:0,removedComments:0,normalizedStyles:0})}}const a=n.profileOptions[r],i=Ky(e,a,o,n,r);if(!i.html){const l=Sl(t||e.replace(/<[^>]*>/g," "),n);return{mode:"text",value:l,report:Na(o,r,e.length,0,l.length,i.counters)}}return{mode:"html",value:i.html,report:Na(o,r,e.length,i.html.length,i.textLength,i.counters)}}function Li(e,t){return e==="balanced"?t.balancedText:e==="plain"?t.plainText:t.fidelityText}function Ms(e){return e==="fidelity"?"balanced":e==="balanced"?"plain":"fidelity"}function Xy(e,t){e.setAttribute("aria-label",t.labels.panelAriaLabel);const r=e.querySelector(".rte-smart-paste-title");r&&(r.textContent=t.labels.panelTitle);const n=e.querySelector('[data-action="close"]');n&&n.setAttribute("aria-label",t.labels.closeText);const o=e.querySelector('[data-action="toggle-enabled"]');if(o){const x=o.getAttribute("data-enabled")==="true";o.textContent=x?t.labels.toggleOnText:t.labels.toggleOffText}const a=e.querySelector('[data-action="cycle-profile"]');a&&(a.textContent=t.labels.cycleProfileText);const i=e.querySelector(".rte-smart-paste-profile-heading");i&&(i.textContent=t.labels.profileLabel);const l=e.querySelector('.rte-smart-paste-profile[role="group"]');l&&l.setAttribute("aria-label",t.labels.profileLabel);const s=e.querySelector('[data-action="set-profile"][data-profile="fidelity"]');s&&(s.textContent=t.labels.fidelityText);const c=e.querySelector('[data-action="set-profile"][data-profile="balanced"]');c&&(c.textContent=t.labels.balancedText);const d=e.querySelector('[data-action="set-profile"][data-profile="plain"]');d&&(d.textContent=t.labels.plainText);const u=e.querySelector(".rte-smart-paste-report-title");u&&(u.textContent=t.labels.lastPasteHeading);const f=e.querySelector(".rte-smart-paste-empty");f&&(f.textContent=t.labels.lastPasteEmptyText);const m=e.querySelector('[data-key="source-label"]');m&&(m.textContent=t.labels.lastPasteSourceLabel);const g=e.querySelector('[data-key="profile-label"]');g&&(g.textContent=t.labels.lastPasteProfileLabel);const p=e.querySelector('[data-key="removed-label"]');p&&(p.textContent=t.labels.lastPasteRemovedLabel);const y=e.querySelector('[data-key="chars-label"]');y&&(y.textContent=t.labels.lastPasteCharsLabel);const b=e.querySelector(".rte-smart-paste-shortcut");b&&(b.textContent=t.labels.shortcutText)}function Xe(e){const t=Oe.get(e),r=q.get(e)||Pn,n=Bn.get(e);if(!t||!r||!n)return;Xy(t,r);const o=t.querySelector(".rte-smart-paste-status");o&&(o.textContent=n.enabled?r.labels.enabledText:r.labels.disabledText);const a=t.querySelector('[data-action="toggle-enabled"]');a&&(a.setAttribute("data-enabled",n.enabled?"true":"false"),a.textContent=n.enabled?r.labels.toggleOnText:r.labels.toggleOffText,a.setAttribute("aria-pressed",n.enabled?"true":"false")),Array.from(t.querySelectorAll('[data-action="set-profile"][data-profile]')).forEach(m=>{const p=Wo(m.getAttribute("data-profile"))===n.profile;m.classList.toggle("active",p),m.setAttribute("aria-pressed",p?"true":"false")});const l=t.querySelector(".rte-smart-paste-empty"),s=t.querySelector(".rte-smart-paste-report"),c=t.querySelector('[data-key="source-value"]'),d=t.querySelector('[data-key="profile-value"]'),u=t.querySelector('[data-key="removed-value"]'),f=t.querySelector('[data-key="chars-value"]');if(!n.lastReport){l&&(l.hidden=!1),s&&(s.hidden=!0);return}if(l&&(l.hidden=!0),s&&(s.hidden=!1),c&&(c.textContent=n.lastReport.source),d&&(d.textContent=Li(n.lastReport.profile,r.labels)),u){const m=n.lastReport.removedElements+n.lastReport.removedAttributes+n.lastReport.removedComments+n.lastReport.normalizedStyles;u.textContent=String(m)}f&&(f.textContent=String(n.lastReport.outputTextLength))}function Vl(e,t){if(!t.classList.contains("show"))return;const r=$s(e).getBoundingClientRect(),n=Math.min(window.innerWidth-20,360),o=Math.max(10,window.innerWidth-n-10),a=Math.min(Math.max(10,r.right-n),o),i=Math.max(10,Math.min(window.innerHeight-10,r.top+12));t.style.width=`${n}px`,t.style.left=`${a}px`,t.style.top=`${i}px`,t.style.maxHeight=`${Math.max(240,window.innerHeight-20)}px`}function Zo(e,t=!1){const r=Oe.get(e);r&&(r.classList.remove("show"),ua.set(e,!1),Go(e,"toggleSmartPastePanel",!1),t&&e.focus({preventScroll:!0}))}function Jy(e){const t=Oe.get(e);if(t)return t;const r=q.get(e)||Pn||ei(),n=`rte-smart-paste-panel-${Dy++}`,o=document.createElement("section");return o.className=j,o.id=n,o.setAttribute("role","dialog"),o.setAttribute("aria-modal","false"),o.setAttribute("aria-label",r.labels.panelAriaLabel),o.innerHTML=`
    <header class="rte-smart-paste-header">
      <h2 class="rte-smart-paste-title">${El(r.labels.panelTitle)}</h2>
      <button type="button" class="rte-smart-paste-icon-btn" data-action="close" aria-label="${El(r.labels.closeText)}">✕</button>
    </header>
    <div class="rte-smart-paste-body">
      <p class="rte-smart-paste-status"></p>
      <div class="rte-smart-paste-controls">
        <button type="button" class="rte-smart-paste-btn rte-smart-paste-btn-primary" data-action="toggle-enabled" data-enabled="true"></button>
        <button type="button" class="rte-smart-paste-btn" data-action="cycle-profile"></button>
      </div>
      <div class="rte-smart-paste-profile" role="group" aria-label="${El(r.labels.profileLabel)}">
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
  `,o.addEventListener("click",a=>{const i=a.target,l=i==null?void 0:i.closest("[data-action]");if(!l)return;const s=l.getAttribute("data-action");if(s){if(s==="close"){Zo(e,!0);return}if(s==="toggle-enabled"){const c=we(e,q.get(e)||r);c.enabled=!c.enabled,Go(e,"toggleSmartPasteEnabled",c.enabled),Xe(e),Lo(o,c.enabled?r.labels.enabledText:r.labels.disabledText);return}if(s==="cycle-profile"){const c=we(e,q.get(e)||r);c.profile=Ms(c.profile),Xe(e),Lo(o,`${r.labels.profileLabel}: ${Li(c.profile,r.labels)}`);return}if(s==="set-profile"){const c=we(e,q.get(e)||r);c.profile=Wo(l.getAttribute("data-profile")),Xe(e),Lo(o,`${r.labels.profileLabel}: ${Li(c.profile,r.labels)}`)}}}),o.addEventListener("keydown",a=>{if(a.key==="Escape"){a.preventDefault(),Zo(e,!0);return}if(a.key!=="ArrowRight"&&a.key!=="ArrowLeft")return;const i=Array.from(o.querySelectorAll('[data-action="set-profile"][data-profile]'));if(i.length===0)return;const l=i.findIndex(d=>d===document.activeElement);if(l<0)return;const s=a.key==="ArrowRight"?1:-1,c=(l+s+i.length)%i.length;a.preventDefault(),i[c].focus()}),Ti(o,e),document.body.appendChild(o),Oe.set(e,o),ua.set(e,!1),Xe(e),o}function Lp(e){const t=Jy(e);Oe.forEach((n,o)=>{o!==e&&Zo(o,!1)}),t.classList.add("show"),ua.set(e,!0),Go(e,"toggleSmartPastePanel",!0),Ti(t,e),Vl(e,t);const r=t.querySelector('[data-action="toggle-enabled"]');r==null||r.focus()}function $p(e,t){const r=As(e);return(typeof t=="boolean"?t:!r)?Lp(e):Zo(e,!1),!0}function Ap(e){return{enabled:e.enabled,profile:e.profile,lastReport:e.lastReport?{...e.lastReport}:null}}function Qy(e,t){const r=q.get(e)||Pn;if(!r)return!1;const n=we(e,r);if(!n.enabled||Dc(e)){const u=Oe.get(e);return u&&Dc(e)&&Lo(u,r.labels.readonlyMessage),!1}const o=t.clipboardData;if(!o)return!1;const a=o.getData("text/html")||"",i=o.getData("text/plain")||"";if(!a&&!i)return!1;const l=Yy(a,i,n.profile,r);if(!l.value)return!1;const s=e.innerHTML;if(!(l.mode==="html"?Wy(e,l.value):Uy(e,l.value)))return!1;n.lastReport={...l.report},Bn.set(e,n),Gy(e,s),Zy(e),e.dispatchEvent(new CustomEvent("editora:smart-paste",{bubbles:!0,detail:Ap(n)})),Xe(e);const d=Oe.get(e);if(d){const u=l.report.removedElements+l.report.removedAttributes+l.report.removedComments+l.report.normalizedStyles;Lo(d,`${r.labels.panelTitle}: ${Li(n.profile,r.labels)}. ${r.labels.lastPasteRemovedLabel}: ${u}.`)}return!0}function ex(e){return t=>{t.defaultPrevented||t[Mc]===!0||(Le=e,!Qy(e,t))||(t[Mc]=!0,t.preventDefault(),typeof t.stopImmediatePropagation=="function"?t.stopImmediatePropagation():t.stopPropagation())}}function tx(e){if(Si.has(e))return;const t=ex(e);e.addEventListener("paste",t,!0),Si.set(e,t)}function $o(e){const t=Bn.get(e);Go(e,"toggleSmartPastePanel",As(e)),Go(e,"toggleSmartPasteEnabled",(t==null?void 0:t.enabled)===!0)}function rx(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="s"}function nx(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="v"}function ox(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="g"}function ax(e){Pn=e,cn||(cn=t=>{ti();const r=t.target,n=r==null?void 0:r.closest(Ye);if(!n)return;const o=q.get(n)||e;we(n,o),q.set(n,o),Le=n,$o(n);const a=Oe.get(n);a&&(Ti(a,n),Vl(n,a),Xe(n))},document.addEventListener("focusin",cn,!0)),dn||(dn=t=>{if(t.defaultPrevented)return;const r=t.target;if(r!=null&&r.closest(`.${j} input, .${j} textarea, .${j} select`))return;const n=Iy(t);if(!n)return;const o=q.get(n)||Pn||e;if(we(n,o),q.set(n,o),Le=n,t.key==="Escape"&&As(n)){t.preventDefault(),Zo(n,!0);return}if(rx(t)){t.preventDefault(),t.stopPropagation(),$p(n);return}if(nx(t)){t.preventDefault(),t.stopPropagation();const a=we(n,o);a.profile=Ms(a.profile),Xe(n);return}if(ox(t)){t.preventDefault(),t.stopPropagation();const a=we(n,o);a.enabled=!a.enabled,$o(n),Xe(n)}},document.addEventListener("keydown",dn,!0)),Yt||(Yt=()=>{ti(),Oe.forEach((t,r)=>{!r.isConnected||!t.isConnected||(Ti(t,r),Vl(r,t))})},window.addEventListener("scroll",Yt,!0),window.addEventListener("resize",Yt)),!un&&typeof MutationObserver<"u"&&document.body&&(un=new MutationObserver(t=>{Oy(t)&&ti()}),un.observe(document.body,{childList:!0,subtree:!0}))}function ix(){cn&&(document.removeEventListener("focusin",cn,!0),cn=null),dn&&(document.removeEventListener("keydown",dn,!0),dn=null),Yt&&(window.removeEventListener("scroll",Yt,!0),window.removeEventListener("resize",Yt),Yt=null),un&&(un.disconnect(),un=null),Oe.forEach(e=>e.remove()),Oe.clear(),Ko.forEach(e=>Ep(e)),Ko.clear(),Pn=null,Le=null}function lx(){if(typeof document>"u"||document.getElementById(Ac))return;const e=document.createElement("style");e.id=Ac,e.textContent=`
    .rte-toolbar-group-items.${je},
    .editora-toolbar-group-items.${je},
    .rte-toolbar-group-items.${dt},
    .editora-toolbar-group-items.${dt} {
      display: flex;
      border: 1px solid #ccc;
      border-radius: 3px;
      background: #fff;
    }

    .rte-toolbar-group-items.${je} .rte-toolbar-button,
    .editora-toolbar-group-items.${je} .editora-toolbar-button,
    .rte-toolbar-group-items.${dt} .rte-toolbar-button,
    .editora-toolbar-group-items.${dt} .editora-toolbar-button {
      border: none;
      border-right: 1px solid #ccc;
      border-radius: 0;
    }

    .rte-toolbar-group-items.${je} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${je} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${dt} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${dt} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    .rte-toolbar-button[data-command="toggleSmartPasteEnabled"].active,
    .editora-toolbar-button[data-command="toggleSmartPasteEnabled"].active {
      background-color: #ccc;
    }

    ${ut} .rte-toolbar-group-items.${je},
    ${ut} .editora-toolbar-group-items.${je},
    ${ut} .rte-toolbar-group-items.${dt},
    ${ut} .editora-toolbar-group-items.${dt},
    .${j}.rte-smart-paste-theme-dark {
      border-color: #566275;
    }

    ${ut} .rte-toolbar-group-items.${je} .rte-toolbar-button svg,
    ${ut} .editora-toolbar-group-items.${je} .editora-toolbar-button svg,
    ${ut} .rte-toolbar-group-items.${dt} .rte-toolbar-button svg,
    ${ut} .editora-toolbar-group-items.${dt} .editora-toolbar-button svg {
      fill: none;
    }

    ${ut} .rte-toolbar-group-items.${je} .rte-toolbar-button,
    ${ut} .editora-toolbar-group-items.${je} .editora-toolbar-button
    {
      border-color: #566275;
    }
    
    .${j} {
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

    .${j}.show {
      display: flex;
      flex-direction: column;
    }

    .${j}.rte-smart-paste-theme-dark {
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

    .${j}.rte-smart-paste-theme-dark .rte-smart-paste-header {
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

    .${j}.rte-smart-paste-theme-dark .rte-smart-paste-icon-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    .${j}.rte-smart-paste-theme-dark .rte-smart-paste-icon-btn:hover,
    .${j}.rte-smart-paste-theme-dark .rte-smart-paste-icon-btn:focus-visible {
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

    .${j}.rte-smart-paste-theme-dark .rte-smart-paste-status {
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

    .${j}.rte-smart-paste-theme-dark .rte-smart-paste-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${j}.rte-smart-paste-theme-dark .rte-smart-paste-btn:hover,
    .${j}.rte-smart-paste-theme-dark .rte-smart-paste-btn:focus-visible {
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

    .${j}.rte-smart-paste-theme-dark .rte-smart-paste-profile-heading {
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

    .${j}.rte-smart-paste-theme-dark .rte-smart-paste-chip {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .${j}.rte-smart-paste-theme-dark .rte-smart-paste-chip.active {
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

    .${j}.rte-smart-paste-theme-dark .rte-smart-paste-metrics {
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

    .${j}.rte-smart-paste-theme-dark .rte-smart-paste-empty {
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

    .${j}.rte-smart-paste-theme-dark .rte-smart-paste-line dt {
      color: #94a3b8;
    }

    .rte-smart-paste-shortcut {
      margin: 2px 0 0;
      font-size: 11px;
      color: #64748b;
    }

    .${j}.rte-smart-paste-theme-dark .rte-smart-paste-shortcut {
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
      .${j} {
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
  `,document.head.appendChild(e)}const sx=(e={})=>{const t=ei(e),r=new Set;return lx(),{name:"smartPaste",toolbar:[{id:"smartPasteGroup",label:"Smart Paste",type:"group",command:"smartPaste",items:[{id:"smartPaste",label:"Smart Paste Panel",command:"toggleSmartPastePanel",shortcut:"Mod-Alt-Shift-s",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M8.5 4.5h7l3 3V18a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6.5 18V7a2.5 2.5 0 0 1 2-2.45Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M15.5 4.5V8h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.3 12h5.4M9.3 15h5.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'},{id:"smartPasteProfile",label:"Cycle Smart Paste Profile",command:"cycleSmartPasteProfile",shortcut:"Mod-Alt-Shift-v",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4.5 7.5h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="17.5" cy="7.5" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 12h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12.5" cy="12" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 16.5h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="9.5" cy="16.5" r="2" stroke="currentColor" stroke-width="1.6"/></svg>'},{id:"smartPasteToggle",label:"Toggle Smart Paste",command:"toggleSmartPasteEnabled",shortcut:"Mod-Alt-Shift-g",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="3.5" y="8" width="17" height="8" rx="4" stroke="currentColor" stroke-width="1.6"/><circle cx="8" cy="12" r="2.6" fill="currentColor"/><path d="M14.5 12h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'}]}],commands:{smartPaste:(n,o)=>{const a=Ft(o,!1,!1);if(!a)return!1;const i=q.get(a)||t;return we(a,i),q.set(a,i),Le=a,Lp(a),!0},toggleSmartPastePanel:(n,o)=>{const a=Ft(o,!1,!1);if(!a)return!1;const i=q.get(a)||t;return we(a,i),q.set(a,i),Le=a,$p(a,typeof n=="boolean"?n:void 0)},cycleSmartPasteProfile:(n,o)=>{const a=Ft(o,!1,!1);if(!a)return!1;const i=q.get(a)||t,l=we(a,i);return q.set(a,i),l.profile=Ms(l.profile),Xe(a),!0},setSmartPasteProfile:(n,o)=>{const a=Ft(o,!1,!1);if(!a)return!1;const i=q.get(a)||t,l=we(a,i);return q.set(a,i),l.profile=Wo(n),Xe(a),!0},toggleSmartPasteEnabled:(n,o)=>{const a=Ft(o,!1,!1);if(!a)return!1;const i=q.get(a)||t,l=we(a,i);return q.set(a,i),l.enabled=typeof n=="boolean"?n:!l.enabled,$o(a),Xe(a),!0},setSmartPasteOptions:(n,o)=>{var d,u,f,m,g,p;const a=Ft(o,!1,!1);if(!a||!n||typeof n!="object")return!1;const i=q.get(a)||t,l=Rc(i),s=ei({...l,...n,labels:{...i.labels,...n.labels||{}},profileOptions:{...l.profileOptions,...n.profileOptions||{},fidelity:{...((d=l.profileOptions)==null?void 0:d.fidelity)||{},...((u=n.profileOptions)==null?void 0:u.fidelity)||{}},balanced:{...((f=l.profileOptions)==null?void 0:f.balanced)||{},...((m=n.profileOptions)==null?void 0:m.balanced)||{}},plain:{...((g=l.profileOptions)==null?void 0:g.plain)||{},...((p=n.profileOptions)==null?void 0:p.plain)||{}}},normalizeText:n.normalizeText||i.normalizeText});q.set(a,s);const c=we(a,s);return typeof n.enabled=="boolean"&&(c.enabled=n.enabled),n.defaultProfile&&(c.profile=Wo(n.defaultProfile)),Xe(a),$o(a),!0},getSmartPasteState:(n,o)=>{const a=Ft(o,!1,!1);if(!a)return!1;const i=q.get(a)||t,l=we(a,i),s=Ap(l);if(typeof n=="function")try{n(s)}catch{}return a.__smartPasteState=s,a.dispatchEvent(new CustomEvent("editora:smart-paste-state",{bubbles:!0,detail:s})),!0}},keymap:{"Mod-Alt-Shift-s":"toggleSmartPastePanel","Mod-Alt-Shift-S":"toggleSmartPastePanel","Mod-Alt-Shift-v":"cycleSmartPasteProfile","Mod-Alt-Shift-V":"cycleSmartPasteProfile","Mod-Alt-Shift-g":"toggleSmartPasteEnabled","Mod-Alt-Shift-G":"toggleSmartPasteEnabled"},init:function(o){Ra+=1;const a=this&&typeof this.__pluginConfig=="object"?ei({...Rc(t),...this.__pluginConfig}):t;ax(a);const i=Ft(o!=null&&o.editorElement?{editorElement:o.editorElement}:void 0,!1,!1);if(!i)return;Le=i,r.add(i);const l=we(i,a);l.enabled=a.enabled,l.profile=a.defaultProfile,q.set(i,a),$o(i)},destroy:()=>{r.forEach(n=>Cp(n)),r.clear(),Ra=Math.max(0,Ra-1),!(Ra>0)&&ix()}}},Je=".rte-content, .editora-content",Rs="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",Pc="__editoraCommandEditorRoot",Ic="rte-blocks-library-styles",B="rte-blocks-library-panel",Ve="blocks-library",ft="blocksLibrary",pt=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',cx=80,Mp=new Set(["script","style","meta","link","object","embed","iframe"]),dx=/^(https?:|mailto:|tel:|#|\/)/i,ux=/^data:image\/(?:png|gif|jpeg|jpg|webp);base64,/i,fx={panelTitle:"Blocks Library",panelAriaLabel:"Blocks library panel",searchLabel:"Search blocks",searchPlaceholder:"Search by name, category, or keyword",categoryLabel:"Category",allCategoriesText:"All categories",recentHeading:"Recent inserts",insertText:"Insert Selected",closeText:"Close",noResultsText:"No matching blocks found.",summaryPrefix:"Blocks",loadingText:"Loading blocks...",loadErrorText:"Unable to load blocks right now.",readonlyMessage:"Editor is read-only. Block insertion is disabled.",shortcutText:"Shortcuts: Ctrl/Cmd+Alt+Shift+B (panel), Ctrl/Cmd+Alt+Shift+L (insert last)",helperText:"Use Arrow keys to move through blocks, Enter to insert, Esc to close.",lastInsertedPrefix:"Last inserted",resultsListLabel:"Block results"},I=new WeakMap,ri=new WeakMap,ze=new WeakMap,nr=new WeakMap,In=new WeakMap,po=new WeakMap,Ao=new WeakMap,Pr=new WeakMap,qr=new WeakMap,$i=new WeakMap,Ie=new Map,fa=new WeakMap,Xi=new Set;let Ba=0,px=0,Hc=0,zt=null,ve=null,fn=null,pn=null,Xt=null,mn=null;function ye(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function mx(e){return e.replace(/\u00A0/g," ").replace(/\s+/g," ").trim()}function gx(e){return e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)}function Kl(e){const t=e.trim();return t&&(dx.test(t)||ux.test(t))?t:""}function Oc(e){let t=e;return Mp.forEach(r=>{const n=new RegExp(`<${r}[\\s\\S]*?>[\\s\\S]*?<\\/${r}>`,"gi"),o=new RegExp(`<${r}\\b[^>]*\\/?>`,"gi");t=t.replace(n,"").replace(o,"")}),t=t.replace(/\son\w+=(\"[^\"]*\"|'[^']*'|[^\s>]+)/gi,"").replace(/\s(xmlns|xml:[^=\s>]+)\s*=\s*(\"[^\"]*\"|'[^']*'|[^\s>]+)/gi,"").replace(/\s(href|src|xlink:href)\s*=\s*("|\')\s*(?:javascript:|vbscript:|data:text\/html)[^"']*\2/gi,"").replace(/\s(href|src|xlink:href)\s*=\s*(?:javascript:|vbscript:|data:text\/html)[^\s>]*/gi,"").replace(/\s(href|src|xlink:href)\s*=\s*("([^"]*)"|'([^']*)')/gi,(r,n,o,a,i)=>{const l=typeof a=="string"&&a.length>0?a:i||"",s=Kl(l);if(!s)return"";const c=o.startsWith('"')?'"':"'";return` ${n}=${c}${s}${c}`}).replace(/\s(href|src|xlink:href)\s*=\s*([^\s>]+)/gi,(r,n,o)=>{const a=Kl(o);return a?` ${n}="${a}"`:""}).replace(/\sstyle\s*=\s*("([^"]*)"|'([^']*)')/gi,(r,n,o,a)=>{const i=typeof o=="string"&&o.length>0?o:a||"";if(/expression\s*\(|javascript\s*:|vbscript\s*:|url\s*\(/i.test(i))return"";const l=n.startsWith('"')?'"':"'";return` style=${l}${i}${l}`}).trim(),t}function bx(e){if(!e)return"";if(typeof document>"u")return Oc(e);const t=document.createElement("template");t.innerHTML=e;const r=t.content;return!r||typeof r.querySelectorAll!="function"?Oc(e):(Array.from(r.querySelectorAll("*")).forEach(o=>{const a=o.tagName.toLowerCase();if(Mp.has(a)){o.remove();return}Array.from(o.attributes).forEach(l=>{const s=l.name.toLowerCase(),c=l.value;if(s.startsWith("on")){o.removeAttribute(l.name);return}if(s==="style"){/expression\s*\(|javascript\s*:|vbscript\s*:|url\s*\(/i.test(c)&&o.removeAttribute(l.name);return}if(s==="href"||s==="src"||s==="xlink:href"){const d=Kl(c);if(!d){o.removeAttribute(l.name);return}d!==c&&o.setAttribute(l.name,d)}})}),t.innerHTML.trim())}function Ji(e){return e.trim().toLowerCase()}function hx(e){if(!e)return"";if(typeof document>"u")return e.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();const t=document.createElement("template");t.innerHTML=e;const r=t.content;return!r||typeof r.textContent!="string"?e.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim():r.textContent.replace(/\s+/g," ").trim()}function Rp(e,t){if(!Array.isArray(e)||e.length===0)return[];const r=new Set,n=[];return e.forEach(o=>{const a=t.normalizeText(o.label||""),i=t.sanitizeBlockHtml(o.html||"",o).trim();if(!a||!i)return;const l=t.normalizeText(o.category||"General")||"General",s=Ji(l);let d=gx(t.normalizeText(o.id||a))||`block-${Hc++}`;for(;r.has(d);)d=`${d}-${Hc++}`;r.add(d);const u=(o.tags||[]).map(y=>t.normalizeText(y)).filter(Boolean),f=(o.keywords||[]).map(y=>t.normalizeText(y)).filter(Boolean),m=t.normalizeText(o.description||""),g=hx(i),p=[a,m,l,...u,...f,g].join(" ").toLowerCase();n.push({id:d,label:a,html:i,description:m,category:l,categoryKey:s,tags:u,keywords:f,previewText:g,searchBlob:p})}),n}function ni(e={}){const t=e.normalizeText||mx,r=e.sanitizeBlockHtml||bx,n={blocks:[],defaultCategory:t(e.defaultCategory||""),maxResults:Math.max(4,Math.min(300,Number(e.maxResults??80))),maxRecentBlocks:Math.max(1,Math.min(20,Number(e.maxRecentBlocks??6))),debounceMs:Math.max(0,Math.min(700,Number(e.debounceMs??90))),cacheTtlMs:Math.max(0,Number(e.cacheTtlMs??6e4)),labels:{...fx,...e.labels||{}},normalizeText:t,sanitizeBlockHtml:r,getBlocks:typeof e.getBlocks=="function"?e.getBlocks:void 0};return n.blocks=Rp(e.blocks,n),n}function yx(e){return{blocks:e.blocks.map(t=>({id:t.id,label:t.label,html:t.html,description:t.description||void 0,category:t.category||void 0,tags:t.tags.length?[...t.tags]:void 0,keywords:t.keywords.length?[...t.keywords]:void 0})),defaultCategory:e.defaultCategory,maxResults:e.maxResults,maxRecentBlocks:e.maxRecentBlocks,debounceMs:e.debounceMs,cacheTtlMs:e.cacheTtlMs,labels:{...e.labels},normalizeText:e.normalizeText,sanitizeBlockHtml:e.sanitizeBlockHtml,getBlocks:e.getBlocks}}function Qi(e){return e.closest(Rs)||e}function Yo(e){if(!e)return null;if(e.matches(Je))return e;const t=e.querySelector(Je);return t instanceof HTMLElement?t:null}function xx(){if(typeof window>"u")return null;const e=window[Pc];if(!(e instanceof HTMLElement))return null;window[Pc]=null;const t=Yo(e);if(t)return t;const r=e.closest(Rs);if(r){const o=Yo(r);if(o)return o}const n=e.closest(Je);return n instanceof HTMLElement?n:null}function vx(e){const t=e.closest("[data-editora-editor]");if(t&&Yo(t)===e)return t;let r=e;for(;r;){if(r.matches(Rs)&&(r===e||Yo(r)===e))return r;r=r.parentElement}return Qi(e)}function Dp(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function oi(){Array.from(Xi).forEach(t=>{t.isConnected||Ds(t)})}function St(e,t=!0,r=!0){if(oi(),(e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const i=Yo(e.editorElement);if(i)return i}const n=xx();if(n)return n;const o=window.getSelection();if(o&&o.rangeCount>0){const i=Dp(o.getRangeAt(0).startContainer),l=i==null?void 0:i.closest(Je);if(l)return l}const a=document.activeElement;if(a){if(a.matches(Je))return a;const i=a.closest(Je);if(i)return i}if(r){if(ve&&ve.isConnected)return ve;ve&&!ve.isConnected&&(ve=null)}return t?document.querySelector(Je):null}function kx(e){const t=e.target;if(t){const n=t.closest(Je);if(n)return n}const r=window.getSelection();if(r&&r.rangeCount>0){const n=Dp(r.getRangeAt(0).startContainer),o=n==null?void 0:n.closest(Je);if(o)return o}return null}function Pa(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function wx(e){const t=Qi(e);if(Pa(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return Pa(r)?!0:Pa(document.documentElement)||Pa(document.body)}function Ai(e,t){e.classList.remove("rte-blocks-library-theme-dark"),wx(t)&&e.classList.add("rte-blocks-library-theme-dark")}function Np(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function zc(e,t,r){const n=vx(e);Array.from(n.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",r),a.setAttribute("data-active",r?"true":"false"),a.setAttribute("aria-pressed",r?"true":"false")})}function qc(e,t){const r=e.querySelector(".rte-blocks-library-live");r&&(r.textContent=t)}function el(e){const t=Op(e);if(t)try{qr.set(e,t.cloneRange())}catch{}}function Bp(e){const t=qr.get(e);if(!t)return null;if(!e.isConnected)return qr.delete(e),null;try{const r=t.cloneRange();return e.contains(r.commonAncestorContainer)?r:(qr.delete(e),null)}catch{return qr.delete(e),null}}function Ex(e){const t=Bp(e);return t?(zp(e,t),!0):!1}function Cx(e){if($i.has(e))return;const t=()=>{const r=window.getSelection();if(!r||r.rangeCount===0)return;const n=r.getRangeAt(0);e.contains(n.commonAncestorContainer)&&el(e)};e.addEventListener("keyup",t),e.addEventListener("mouseup",t),e.addEventListener("touchend",t),$i.set(e,t)}function Sx(e){const t=$i.get(e);t&&(e.removeEventListener("keyup",t),e.removeEventListener("mouseup",t),e.removeEventListener("touchend",t),$i.delete(e))}function Se(e,t){I.has(e)||I.set(e,t),nr.has(e)||(nr.set(e,t.blocks),In.set(e,Date.now()));let r=ze.get(e);return r||(r={query:"",category:t.defaultCategory?Ji(t.defaultCategory):"all",selectedBlockId:null,recentBlockIds:[],lastInsertedBlockId:null,loading:!1,loadError:null,totalMatches:0,visibleMatches:0,filterCache:new Map,debounceTimer:null},ze.set(e,r)),Xi.add(e),Cx(e),r}function Pp(e){const t=ze.get(e);!t||t.debounceTimer===null||(window.clearTimeout(t.debounceTimer),t.debounceTimer=null)}function Ds(e){var r;Pp(e),Sx(e),qr.delete(e);const t=Ao.get(e);t&&(t.abort(),Ao.delete(e)),po.delete(e),Pr.delete(e),(r=Ie.get(e))==null||r.remove(),Ie.delete(e),fa.delete(e),I.delete(e),ri.delete(e),ze.delete(e),nr.delete(e),In.delete(e),Xi.delete(e),ve===e&&(ve=null)}function Tx(e){var t,r,n,o;for(let a=0;a<e.length;a+=1){const i=e[a];if(!(i.type!=="childList"||i.removedNodes.length===0))for(let l=0;l<i.removedNodes.length;l+=1){const s=i.removedNodes[l];if(s.nodeType!==Node.ELEMENT_NODE)continue;const c=s;if((t=c.matches)!=null&&t.call(c,Je)||(r=c.matches)!=null&&r.call(c,`.${B}`)||(n=c.querySelector)!=null&&n.call(c,Je)||(o=c.querySelector)!=null&&o.call(c,`.${B}`))return!0}}return!1}function Ns(e){return fa.get(e)===!0}function Wl(e,t){if(!t.classList.contains("show"))return;const r=Qi(e).getBoundingClientRect(),n=Math.min(window.innerWidth-20,420),o=Math.max(10,window.innerWidth-n-10),a=Math.min(Math.max(10,r.right-n),o),i=Math.max(10,Math.min(window.innerHeight-10,r.top+12));t.style.width=`${n}px`,t.style.left=`${a}px`,t.style.top=`${i}px`,t.style.maxHeight=`${Math.max(260,window.innerHeight-20)}px`}function tl(e){var t;return nr.get(e)||((t=I.get(e))==null?void 0:t.blocks)||[]}function Lx(e,t){const r=new Map;tl(e).forEach(o=>{r.has(o.categoryKey)||r.set(o.categoryKey,o.category)});const n=Array.from(r.entries()).sort((o,a)=>o[1].localeCompare(a[1])).map(([o,a])=>({value:o,label:a}));return[{value:"all",label:t.labels.allCategoriesText},...n]}function Ip(e,t){const r=Se(e,t),n=tl(e),o=r.query.trim().toLowerCase(),a=r.category||"all",i=`${o}|${a}|${t.maxResults}`,l=r.filterCache.get(i);if(l){const d=new Map(n.map(f=>[f.id,f])),u=l.ids.map(f=>d.get(f)).filter(Boolean);return r.totalMatches=l.total,r.visibleMatches=u.length,u}const s=[];let c=0;for(let d=0;d<n.length;d+=1){const u=n[d];a!=="all"&&u.categoryKey!==a||o&&!u.searchBlob.includes(o)||(c+=1,s.length<t.maxResults&&s.push(u))}if(r.totalMatches=c,r.visibleMatches=s.length,r.filterCache.set(i,{ids:s.map(d=>d.id),total:c}),r.filterCache.size>cx){const d=r.filterCache.keys().next().value;typeof d=="string"&&r.filterCache.delete(d)}return s}function $x(e,t){const r=ze.get(e);if(!r)return;if(t.length===0){r.selectedBlockId=null;return}t.some(o=>o.id===r.selectedBlockId)||(r.selectedBlockId=t[0].id)}function Hn(e){const t=ze.get(e);zc(e,"toggleBlocksLibraryPanel",Ns(e)),zc(e,"insertLastBlockSnippet",!!(t!=null&&t.lastInsertedBlockId))}function ct(e){const t=Ie.get(e),r=I.get(e)||zt,n=ze.get(e);if(!t||!r||!n)return;Ai(t,e);const o=t.querySelector(".rte-blocks-library-title");o&&(o.textContent=r.labels.panelTitle);const a=t.querySelector('[data-action="close"]');a&&(a.setAttribute("aria-label",r.labels.closeText),a.textContent="✕");const i=t.querySelector(".rte-blocks-library-search-label");i&&(i.textContent=r.labels.searchLabel);const l=t.querySelector('[data-field="query"]');l&&(l.setAttribute("placeholder",r.labels.searchPlaceholder),l.value!==n.query&&(l.value=n.query));const s=t.querySelector(".rte-blocks-library-category-label");s&&(s.textContent=r.labels.categoryLabel);const c=t.querySelector('[data-field="category"]');if(c){const C=Lx(e,r);c.innerHTML=C.map(k=>`<option value="${ye(k.value)}">${ye(k.label)}</option>`).join(""),C.some(k=>k.value===n.category)||(n.category="all"),c.value=n.category}const d=t.querySelector(".rte-blocks-library-helper");d&&(d.textContent=r.labels.helperText);const u=t.querySelector('.rte-blocks-library-list[role="listbox"]');u&&u.setAttribute("aria-label",r.labels.resultsListLabel);const f=t.querySelector(".rte-blocks-library-shortcut");f&&(f.textContent=r.labels.shortcutText);const m=t.querySelector('[data-action="insert-selected"]');if(m){m.textContent=r.labels.insertText;const C=!Np(e)&&!!n.selectedBlockId;m.disabled=!C,m.setAttribute("aria-disabled",C?"false":"true")}const g=t.querySelector(".rte-blocks-library-empty"),p=t.querySelector(".rte-blocks-library-list"),y=Ip(e,r);$x(e,y);const b=t.querySelector(".rte-blocks-library-status");if(b&&(n.loading?b.textContent=r.labels.loadingText:n.loadError?b.textContent=n.loadError:b.textContent=`${r.labels.summaryPrefix}: ${n.visibleMatches}/${n.totalMatches}`),p){const C=new Set(n.recentBlockIds);p.innerHTML=y.map(k=>{const T=n.selectedBlockId===k.id,$=k.tags.length?` • ${k.tags.join(", ")}`:"",w=C.has(k.id),v=k.previewText.slice(0,180);return`
          <li class="rte-blocks-library-item-wrapper" role="presentation">
            <button
              type="button"
              class="rte-blocks-library-item${T?" active":""}"
              data-block-id="${ye(k.id)}"
              role="option"
              aria-selected="${T?"true":"false"}"
              aria-label="${ye(k.label)}"
              tabindex="${T?"0":"-1"}"
            >
              <span class="rte-blocks-library-item-head">
                <span class="rte-blocks-library-item-label">${ye(k.label)}</span>
                ${w?`<span class="rte-blocks-library-recent-pill">${ye(r.labels.recentHeading)}</span>`:""}
              </span>
              <span class="rte-blocks-library-item-meta">${ye(k.category)}${ye($)}</span>
              ${k.description?`<span class="rte-blocks-library-item-description">${ye(k.description)}</span>`:""}
              ${v?`<span class="rte-blocks-library-item-preview">${ye(v)}</span>`:""}
            </button>
          </li>
        `}).join("")}g&&(g.hidden=y.length>0,g.textContent=r.labels.noResultsText);const x=t.querySelector(".rte-blocks-library-last-inserted");if(x)if(n.lastInsertedBlockId){const C=tl(e).find(k=>k.id===n.lastInsertedBlockId);C?(x.hidden=!1,x.textContent=`${r.labels.lastInsertedPrefix}: ${C.label}`):x.hidden=!0}else x.hidden=!0;t.setAttribute("aria-label",r.labels.panelAriaLabel)}function Rt(e,t=!1){const r=Ie.get(e);r&&(r.classList.remove("show"),fa.set(e,!1),Hn(e),t&&(e.focus({preventScroll:!0}),Ex(e)))}function Ax(e){const t=e.querySelector(".rte-blocks-library-item.active");t==null||t.focus()}function _c(e,t){const r=I.get(e)||zt;if(!r)return;const n=ze.get(e);if(!n)return;const o=Ip(e,r);if(o.length===0)return;const i=(Math.max(0,o.findIndex(s=>s.id===n.selectedBlockId))+t+o.length)%o.length;n.selectedBlockId=o[i].id,ct(e);const l=Ie.get(e);l&&Ax(l)}function Ul(e){const t=Bx(e);el(e),Ie.forEach((n,o)=>{o!==e&&Rt(o,!1)}),t.classList.add("show"),fa.set(e,!0),ct(e),Wl(e,t),Hn(e);const r=t.querySelector('[data-field="query"]');r==null||r.focus(),Gl(e,!1)}function Hp(e,t){const r=Ns(e);return(typeof t=="boolean"?t:!r)?Ul(e):Rt(e,!1),!0}function Op(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);return e.contains(r.commonAncestorContainer)?r:null}function zp(e,t){if(!e.isConnected)return;const r=window.getSelection();r&&(r.removeAllRanges(),r.addRange(t))}function Fc(e,t,r){const n=t.cloneRange();if(!e.contains(n.commonAncestorContainer))return!1;n.deleteContents();const o=document.createElement("template");o.innerHTML=r;const a=o.content;if(!a)return!1;const i=a.lastChild;if(n.insertNode(a),i){const l=document.createRange();l.setStartAfter(i),l.collapse(!0),zp(e,l)}return el(e),!0}function Mx(e,t){e.focus({preventScroll:!0});const r=Bp(e);if(r&&Fc(e,r,t))return!0;try{if(document.execCommand("insertHTML",!1,t))return el(e),!0}catch{}const n=Op(e);return n?Fc(e,n,t):!1}function Rx(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function Dx(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function Mo(e,t){const r=I.get(e)||zt;if(!r)return!1;const n=Se(e,r),o=Ie.get(e);if(Np(e))return o&&qc(o,r.labels.readonlyMessage),!1;const a=tl(e).find(s=>s.id===t);if(!a)return!1;const i=e.innerHTML;return Mx(e,a.html)?(n.lastInsertedBlockId=a.id,n.selectedBlockId=a.id,n.recentBlockIds=[a.id,...n.recentBlockIds.filter(s=>s!==a.id)].slice(0,r.maxRecentBlocks),Rx(e,i),Dx(e),Hn(e),e.dispatchEvent(new CustomEvent("editora:blocks-library-insert",{bubbles:!0,detail:{blockId:a.id,label:a.label,category:a.category}})),ct(e),o&&qc(o,`${r.labels.lastInsertedPrefix}: ${a.label}`),!0):!1}function qp(e){const t=ze.get(e);return t!=null&&t.lastInsertedBlockId?Mo(e,t.lastInsertedBlockId):!1}function Nx(e){const t=I.get(e)||zt;if(!t)return;const r=ze.get(e);if(!r)return;Pp(e);const n=()=>{r.debounceTimer=null,r.filterCache.clear(),ct(e)};if(t.debounceMs<=0){n();return}r.debounceTimer=window.setTimeout(n,t.debounceMs)}function Bx(e){const t=Ie.get(e);if(t)return t;const r=I.get(e)||zt||ni(),n=Se(e,r),o=`rte-blocks-library-panel-${px++}`,a=`${o}-query`,i=`${o}-category`,l=document.createElement("section");return l.className=B,l.id=o,l.setAttribute("role","dialog"),l.setAttribute("aria-modal","false"),l.setAttribute("aria-label",r.labels.panelAriaLabel),l.innerHTML=`
    <header class="rte-blocks-library-header">
      <h2 class="rte-blocks-library-title">${ye(r.labels.panelTitle)}</h2>
      <button type="button" class="rte-blocks-library-icon-btn" data-action="close" aria-label="${ye(r.labels.closeText)}">✕</button>
    </header>
    <div class="rte-blocks-library-body">
      <label class="rte-blocks-library-search-label" for="${ye(a)}"></label>
      <input id="${ye(a)}" class="rte-blocks-library-input" type="text" data-field="query" autocomplete="off" />
      <label class="rte-blocks-library-category-label" for="${ye(i)}"></label>
      <select id="${ye(i)}" class="rte-blocks-library-select" data-field="category"></select>
      <p class="rte-blocks-library-status" aria-live="polite"></p>
      <p class="rte-blocks-library-helper"></p>
      <p class="rte-blocks-library-last-inserted" hidden></p>
      <div class="rte-blocks-library-list-wrap">
        <ul class="rte-blocks-library-list" role="listbox" aria-label="${ye(r.labels.resultsListLabel)}"></ul>
        <p class="rte-blocks-library-empty" hidden></p>
      </div>
      <div class="rte-blocks-library-actions">
        <button type="button" class="rte-blocks-library-btn rte-blocks-library-btn-primary" data-action="insert-selected"></button>
      </div>
      <p class="rte-blocks-library-shortcut"></p>
    </div>
    <div class="rte-blocks-library-live" aria-live="polite" aria-atomic="true"></div>
  `,l.addEventListener("click",s=>{const c=s.target,d=c==null?void 0:c.closest("[data-action]");if(d){const m=d.getAttribute("data-action");if(m==="close"){Rt(e,!0);return}if(m==="insert-selected"){if(!n.selectedBlockId)return;Mo(e,n.selectedBlockId)&&Rt(e,!0)}return}const u=c==null?void 0:c.closest("[data-block-id]");if(!u)return;const f=u.getAttribute("data-block-id");f&&(n.selectedBlockId=f,ct(e),s.detail>=2&&Mo(e,f)&&Rt(e,!0))}),l.addEventListener("input",s=>{const c=s.target;!(c instanceof HTMLInputElement)||c.getAttribute("data-field")!=="query"||(n.query=r.normalizeText(c.value).toLowerCase(),n.filterCache.clear(),Nx(e))}),l.addEventListener("change",s=>{const c=s.target;!(c instanceof HTMLSelectElement)||c.getAttribute("data-field")!=="category"||(n.category=Ji(c.value||"all")||"all",n.filterCache.clear(),ct(e))}),l.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault(),Rt(e,!0);return}if(s.key==="ArrowDown"){s.preventDefault(),_c(e,1);return}if(s.key==="ArrowUp"){s.preventDefault(),_c(e,-1);return}if(s.key==="Enter"){const c=s.target;if(!(c==null?void 0:c.matches('[data-field="query"], [data-field="category"], [data-block-id]'))||!n.selectedBlockId)return;s.preventDefault(),Mo(e,n.selectedBlockId)&&Rt(e,!0)}}),Ai(l,e),document.body.appendChild(l),Ie.set(e,l),fa.set(e,!1),ct(e),l}function Px(e){const t=ze.get(e);return{query:(t==null?void 0:t.query)||"",category:(t==null?void 0:t.category)||"all",selectedBlockId:(t==null?void 0:t.selectedBlockId)||null,totalMatches:(t==null?void 0:t.totalMatches)||0,visibleMatches:(t==null?void 0:t.visibleMatches)||0,recentBlockIds:t!=null&&t.recentBlockIds?[...t.recentBlockIds]:[],lastInsertedBlockId:(t==null?void 0:t.lastInsertedBlockId)||null,loading:(t==null?void 0:t.loading)===!0,loadError:(t==null?void 0:t.loadError)||null}}async function Gl(e,t){const r=I.get(e)||zt;if(!r||typeof r.getBlocks!="function")return;const n=Se(e,r),o=In.get(e)||0;if(!t&&r.cacheTtlMs>0&&Date.now()-o<r.cacheTtlMs)return;const a=po.get(e);if(a&&!t)return a;const i=Ao.get(e);i&&i.abort(),t&&a&&po.delete(e);const l=new AbortController;Ao.set(e,l);const s=(Pr.get(e)||0)+1;Pr.set(e,s),n.loading=!0,n.loadError=null,ct(e);const c=Promise.resolve().then(async()=>{var g;const d={editor:e,editorRoot:Qi(e),signal:l.signal},u=await((g=r.getBlocks)==null?void 0:g.call(r,d));if(l.signal.aborted||Pr.get(e)!==s)return;const f=Rp(u||[],r);nr.set(e,f),In.set(e,Date.now());const m=ze.get(e);m&&(m.loading=!1,m.loadError=null,m.filterCache.clear())}).catch(()=>{if(l.signal.aborted||Pr.get(e)!==s)return;const d=ze.get(e);d&&(d.loading=!1,d.loadError=r.labels.loadErrorText)}).finally(()=>{Pr.get(e)===s&&(po.delete(e),Ao.delete(e)),ct(e)});return po.set(e,c),c}function Ix(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="b"}function Hx(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="l"}function Ox(e){zt=e,fn||(fn=t=>{oi();const r=t.target,n=r==null?void 0:r.closest(Je);if(!n)return;const o=I.get(n)||e;Se(n,o),I.set(n,o),ve=n,Hn(n);const a=Ie.get(n);a&&(Ai(a,n),Wl(n,a),ct(n))},document.addEventListener("focusin",fn,!0)),pn||(pn=t=>{if(t.defaultPrevented)return;const r=`.${B} input, .${B} textarea, .${B} select`,n=t.target;if(n!=null&&n.closest(r)){if(t.key==="Escape"){const i=n.closest(`.${B}`),l=Array.from(Ie.entries()).find(([,s])=>s===i);l&&(t.preventDefault(),Rt(l[0],!0))}return}const o=kx(t);if(!o)return;const a=I.get(o)||zt||e;if(Se(o,a),I.set(o,a),ve=o,t.key==="Escape"&&Ns(o)){t.preventDefault(),Rt(o,!0);return}if(Ix(t)){t.preventDefault(),t.stopPropagation(),Hp(o);return}Hx(t)&&(t.preventDefault(),t.stopPropagation(),qp(o))},document.addEventListener("keydown",pn,!0)),Xt||(Xt=()=>{oi(),Ie.forEach((t,r)=>{!r.isConnected||!t.isConnected||(Ai(t,r),Wl(r,t))})},window.addEventListener("scroll",Xt,!0),window.addEventListener("resize",Xt)),!mn&&typeof MutationObserver<"u"&&document.body&&(mn=new MutationObserver(t=>{Tx(t)&&oi()}),mn.observe(document.body,{childList:!0,subtree:!0}))}function zx(){fn&&(document.removeEventListener("focusin",fn,!0),fn=null),pn&&(document.removeEventListener("keydown",pn,!0),pn=null),Xt&&(window.removeEventListener("scroll",Xt,!0),window.removeEventListener("resize",Xt),Xt=null),mn&&(mn.disconnect(),mn=null),Ie.forEach(t=>t.remove()),Ie.clear(),Array.from(Xi).forEach(t=>Ds(t)),zt=null,ve=null}function qx(){if(typeof document>"u"||document.getElementById(Ic))return;const e=document.createElement("style");e.id=Ic,e.textContent=`
    .rte-toolbar-group-items.${Ve},
    .editora-toolbar-group-items.${Ve},
    .rte-toolbar-group-items.${ft},
    .editora-toolbar-group-items.${ft} {
      display: flex;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: #ffffff;
    }

    .rte-toolbar-group-items.${Ve} .rte-toolbar-button,
    .editora-toolbar-group-items.${Ve} .editora-toolbar-button,
    .rte-toolbar-group-items.${ft} .rte-toolbar-button,
    .editora-toolbar-group-items.${ft} .editora-toolbar-button {
      border: none;
      border-right: 1px solid #cbd5e1;
      border-radius: 0;
    }

    .rte-toolbar-group-items.${Ve} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${Ve} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${ft} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${ft} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    .rte-toolbar-button[data-command="insertLastBlockSnippet"].active,
    .editora-toolbar-button[data-command="insertLastBlockSnippet"].active {
      background: rgba(15, 118, 110, 0.12);
    }

    ${pt} .rte-toolbar-group-items.${Ve},
    ${pt} .editora-toolbar-group-items.${Ve},
    ${pt} .rte-toolbar-group-items.${ft},
    ${pt} .editora-toolbar-group-items.${ft} {
      border-color: #566275;
    }
    ${pt} .rte-toolbar-group-items.${Ve} .rte-toolbar-button svg,
    ${pt} .editora-toolbar-group-items.${Ve} .editora-toolbar-button svg,
    ${pt} .rte-toolbar-group-items.${ft} .rte-toolbar-button svg,
    ${pt} .editora-toolbar-group-items.${ft} .editora-toolbar-button svg
    {
      fill: none;
    }
    ${pt} .rte-toolbar-group-items.${Ve} .rte-toolbar-button,
    ${pt} .editora-toolbar-group-items.${Ve} .editora-toolbar-button
    {
      border-color: #566275;
    }
    .${B} {
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

    .${B}.show {
      display: flex;
      flex-direction: column;
    }

    .${B}.rte-blocks-library-theme-dark {
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

    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-header {
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

    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-icon-btn {
      border-color: #475569;
      background: #0f172a;
      color: #e2e8f0;
    }

    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-icon-btn:hover,
    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-icon-btn:focus-visible {
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

    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-search-label,
    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-category-label {
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

    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-input,
    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-select {
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

    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-status,
    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-helper,
    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-shortcut {
      color: #94a3b8;
    }

    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-last-inserted {
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

    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-list-wrap {
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

    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-item {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-item.active {
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

    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-recent-pill {
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

    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-item-meta,
    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-item-description {
      color: #94a3b8;
    }

    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-item-preview {
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

    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${B}.rte-blocks-library-theme-dark .rte-blocks-library-btn-primary {
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
      .${B} {
        left: 10px !important;
        right: 10px;
        top: 10px !important;
        width: auto !important;
        max-height: calc(100vh - 20px);
      }
    }
  `,document.head.appendChild(e)}const _x=(e={})=>{const t=ni(e),r=new Set;return qx(),{name:"blocksLibrary",toolbar:[{id:"blocksLibraryGroup",label:"Blocks Library",type:"group",command:"blocksLibrary",items:[{id:"blocksLibraryPanel",label:"Blocks Library Panel",command:"toggleBlocksLibraryPanel",shortcut:"Mod-Alt-Shift-b",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="4" y="5" width="7" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="5" width="7" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="4" y="13" width="7" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="13" width="7" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/></svg>'},{id:"insertLastBlockSnippet",label:"Insert Last Block",command:"insertLastBlockSnippet",shortcut:"Mod-Alt-Shift-l",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M7 5.5h10a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 17 18.5H7A1.5 1.5 0 0 1 5.5 17V7A1.5 1.5 0 0 1 7 5.5Z" stroke="currentColor" stroke-width="1.6"/><path d="M12 8.5v7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8.5 12h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'}]}],commands:{blocksLibrary:(n,o)=>{const a=St(o,!1,!1);if(!a)return!1;const i=I.get(a)||t;return Se(a,i),I.set(a,i),ve=a,Ul(a),!0},openBlocksLibraryPanel:(n,o)=>{const a=St(o,!1,!1);if(!a)return!1;const i=I.get(a)||t;return Se(a,i),I.set(a,i),ve=a,Ul(a),!0},toggleBlocksLibraryPanel:(n,o)=>{const a=St(o,!1,!1);if(!a)return!1;const i=I.get(a)||t;return Se(a,i),I.set(a,i),ve=a,Hp(a,typeof n=="boolean"?n:void 0)},insertBlockSnippet:(n,o)=>{const a=St(o,!1,!1);if(!a)return!1;const i=I.get(a)||t;Se(a,i),I.set(a,i);const l=typeof n=="string"?n:n==null?void 0:n.id;return l?(ve=a,Mo(a,l)):!1},insertLastBlockSnippet:(n,o)=>{const a=St(o,!1,!1);if(!a)return!1;const i=I.get(a)||t;return Se(a,i),I.set(a,i),ve=a,qp(a)},refreshBlocksLibraryData:(n,o)=>{const a=St(o,!1,!1);if(!a)return!1;const i=I.get(a)||t;return Se(a,i),I.set(a,i),Gl(a,!0),!0},setBlocksLibraryOptions:(n,o)=>{const a=St(o,!1,!1);if(!a||!n||typeof n!="object")return!1;const i=I.get(a)||t,l=ri.get(a)||yx(i),s={...l,...n,labels:{...l.labels||{},...n.labels||{}},blocks:Array.isArray(n.blocks)?n.blocks:l.blocks,normalizeText:n.normalizeText||i.normalizeText,sanitizeBlockHtml:n.sanitizeBlockHtml||i.sanitizeBlockHtml,getBlocks:n.getBlocks||i.getBlocks},c=ni(s),d=Array.isArray(n.blocks),u=n.getBlocks!==void 0;I.set(a,c),ri.set(a,s),(d||u||!nr.has(a))&&(nr.set(a,c.blocks),In.set(a,u?0:Date.now()));const f=Se(a,c);return f.filterCache.clear(),typeof n.defaultCategory=="string"&&(f.category=Ji(c.defaultCategory)||"all"),ct(a),Hn(a),u&&Gl(a,!0),!0},getBlocksLibraryState:(n,o)=>{const a=St(o,!1,!1);if(!a)return!1;const i=I.get(a)||t;Se(a,i);const l=Px(a);if(typeof n=="function")try{n(l)}catch{}return a.__blocksLibraryState=l,a.dispatchEvent(new CustomEvent("editora:blocks-library-state",{bubbles:!0,detail:l})),!0}},keymap:{"Mod-Alt-Shift-b":"toggleBlocksLibraryPanel","Mod-Alt-Shift-B":"toggleBlocksLibraryPanel","Mod-Alt-Shift-l":"insertLastBlockSnippet","Mod-Alt-Shift-L":"insertLastBlockSnippet"},init:function(o){Ba+=1;const a=this&&typeof this.__pluginConfig=="object"?{...e,...this.__pluginConfig}:e,i=ni(a);Ox(i);const l=St(o!=null&&o.editorElement?{editorElement:o.editorElement}:void 0,!1,!1);l&&(ve=l,r.add(l),Se(l,i),I.set(l,i),ri.set(l,a),nr.set(l,i.blocks),In.set(l,Date.now()),Hn(l))},destroy:()=>{r.forEach(n=>Ds(n)),r.clear(),Ba=Math.max(0,Ba-1),!(Ba>0)&&zx()}}},Be=".rte-content, .editora-content",Bs="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",jc="__editoraCommandEditorRoot",Vc="rte-doc-schema-styles",z="rte-doc-schema-panel",Ke="document-schema",mt="doc-schema",jt="docSchema",We=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',Fx={panelTitle:"Document Schema",panelAriaLabel:"Document schema panel",schemaLabel:"Schema",schemaDescriptionPrefix:"Description",validateText:"Run Validation",insertMissingText:"Insert Missing Sections",realtimeOnText:"Realtime On",realtimeOffText:"Realtime Off",closeText:"Close",noIssuesText:"No schema violations detected.",summaryPrefix:"Schema",issueListLabel:"Schema issues",shortcutText:"Shortcuts: Ctrl/Cmd+Alt+Shift+G (panel), Ctrl/Cmd+Alt+Shift+J (validate)",helperText:"Choose a schema, validate structure, then insert missing sections safely.",readonlyMessage:"Editor is read-only. Missing sections cannot be inserted.",defaultPlaceholderText:"Add section content.",missingSectionMessage:"Missing required section",duplicateSectionMessage:"Section appears too many times",outOfOrderMessage:"Section appears out of required order",unknownHeadingMessage:"Heading is not part of selected schema",insertedSummaryPrefix:"Inserted missing sections"},N=new WeakMap,ai=new WeakMap,Xo=new WeakMap,$e=new Map,pa=new WeakMap,Mi=new WeakMap,rl=new Set;let Ia=0,jx=0,Kc=0,et=null,Te=null,gn=null,bn=null,hn=null,Jt=null,yn=null;function vt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Vx(e){return e.replace(/\u00A0/g," ").replace(/\s+/g," ").trim()}function Lr(e,t,r){return Number.isFinite(e)?Math.max(t,Math.min(r,e)):t}function _p(e){return e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)}function Ps(e,t){return t(e).toLowerCase().replace(/^[\s\-\u2022]*(?:[0-9]+(?:\.[0-9]+)*)[\)\.\-:\s]+/,"").replace(/^[\s\-\u2022]*(?:[ivxlcdm]+)[\)\.\-:\s]+/i,"").replace(/[：:]+$/g,"").replace(/\s+/g," ").trim()}function Wc(){return[{id:"contract",label:"Contract",description:"Template for legal/commercial agreements with strict section ordering.",strictOrder:!0,allowUnknownHeadings:!1,sections:[{id:"summary",title:"Executive Summary",aliases:["Overview"]},{id:"scope",title:"Scope"},{id:"terms",title:"Terms and Conditions",aliases:["Terms"]},{id:"responsibilities",title:"Responsibilities"},{id:"sla",title:"Service Levels",aliases:["SLA","Service Level Agreement"]},{id:"termination",title:"Termination"}]},{id:"sop",label:"SOP",description:"Standard operating procedure with clear implementation and governance sections.",strictOrder:!0,allowUnknownHeadings:!0,sections:[{id:"purpose",title:"Purpose"},{id:"scope",title:"Scope"},{id:"procedure",title:"Procedure",maxOccurrences:10},{id:"roles",title:"Roles and Responsibilities",aliases:["Responsibilities"]},{id:"validation",title:"Validation"},{id:"revision-history",title:"Revision History",aliases:["Change History"]}]},{id:"policy",label:"Policy",description:"Policy document with control ownership, exception handling, and enforcement.",strictOrder:!0,allowUnknownHeadings:!0,sections:[{id:"statement",title:"Policy Statement"},{id:"applicability",title:"Applicability",aliases:["Scope"]},{id:"controls",title:"Controls"},{id:"exceptions",title:"Exceptions"},{id:"enforcement",title:"Enforcement"}]}]}function Kx(e,t,r){const n=r(e.title||"");if(!n)return null;const o=_p(r(e.id||n))||`section-${t+1}`,a=Lr(Number(e.minOccurrences??1),0,20),i=Math.max(1,a),l=Lr(Number(e.maxOccurrences??i),a,40),s=r(e.placeholder||""),c=Array.isArray(e.aliases)?e.aliases.map(u=>r(u)).filter(Boolean):[],d=[n,...c].map(u=>Ps(u,r)).filter(Boolean);return{id:o,title:n,minOccurrences:a,maxOccurrences:l,placeholder:s,matchKeys:Array.from(new Set(d))}}function Fp(e,t){const r=Array.isArray(e)&&e.length>0?e:Wc(),n=[],o=new Set;return r.forEach((a,i)=>{const l=t(a.label||"");if(!l)return;const s=_p(t(a.id||l))||`schema-${i+1}`;let c=s,d=1;for(;o.has(c);)c=`${s}-${d++}`;o.add(c);const u=Array.isArray(a.sections)?a.sections:[],f=[],m=new Set;if(u.forEach((y,b)=>{const x=Kx(y,b,t);if(!x)return;let C=x.id,k=1;for(;m.has(C);)C=`${x.id}-${k++}`;m.add(C),f.push({...x,id:C})}),f.length===0)return;const g=new Map,p=new Map;f.forEach((y,b)=>{p.set(y.id,b),y.matchKeys.forEach(x=>{g.has(x)||g.set(x,y)})}),n.push({id:c,label:l,description:t(a.description||""),strictOrder:a.strictOrder!==!1,allowUnknownHeadings:!!a.allowUnknownHeadings,sections:f,matchKeyToSection:g,orderBySectionId:p})}),n.length>0?n:Fp(Wc(),t)}function ii(e={}){var a;const t=e.normalizeText||Vx,r=Fp(e.schemas,t),n=t(e.defaultSchemaId||""),o=r.some(i=>i.id===n)?n:((a=r[0])==null?void 0:a.id)||null;return{schemas:r,defaultSchemaId:o,enableRealtime:e.enableRealtime!==!1,debounceMs:Lr(Number(e.debounceMs??260),60,2e3),maxIssues:Lr(Number(e.maxIssues??80),5,500),labels:{...Fx,...e.labels||{}},normalizeText:t}}function Wx(e){return{schemas:e.schemas.map(t=>({id:t.id,label:t.label,description:t.description||void 0,strictOrder:t.strictOrder,allowUnknownHeadings:t.allowUnknownHeadings,sections:t.sections.map(r=>({id:r.id,title:r.title,minOccurrences:r.minOccurrences,maxOccurrences:r.maxOccurrences,placeholder:r.placeholder||void 0}))})),defaultSchemaId:e.defaultSchemaId||void 0,enableRealtime:e.enableRealtime,debounceMs:e.debounceMs,maxIssues:e.maxIssues,labels:{...e.labels},normalizeText:e.normalizeText}}function Is(e){return e.closest(Bs)||e}function Jo(e){if(!e)return null;if(e.matches(Be))return e;const t=e.querySelector(Be);return t instanceof HTMLElement?t:null}function Ux(){if(typeof window>"u")return null;const e=window[jc];if(!(e instanceof HTMLElement))return null;window[jc]=null;const t=Jo(e);if(t)return t;const r=e.closest(Bs);if(r){const o=Jo(r);if(o)return o}const n=e.closest(Be);return n instanceof HTMLElement?n:null}function Gx(e){const t=e.closest("[data-editora-editor]");if(t&&Jo(t)===e)return t;let r=e;for(;r;){if(r.matches(Bs)&&(r===e||Jo(r)===e))return r;r=r.parentElement}return Is(e)}function jp(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function Ha(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function Zx(e){const t=Is(e);if(Ha(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return Ha(r)?!0:Ha(document.documentElement)||Ha(document.body)}function Zl(e,t){e.classList.remove("rte-doc-schema-theme-dark"),Zx(t)&&e.classList.add("rte-doc-schema-theme-dark")}function Yx(e){var t,r,n,o;for(let a=0;a<e.length;a+=1){const i=e[a];if(!(i.type!=="childList"||i.removedNodes.length===0))for(let l=0;l<i.removedNodes.length;l+=1){const s=i.removedNodes[l];if(s.nodeType!==Node.ELEMENT_NODE)continue;const c=s;if((t=c.matches)!=null&&t.call(c,Be)||(r=c.matches)!=null&&r.call(c,`.${z}`)||(n=c.querySelector)!=null&&n.call(c,Be)||(o=c.querySelector)!=null&&o.call(c,`.${z}`))return!0}}return!1}function li(){Array.from(rl).forEach(t=>{t.isConnected||Os(t)})}function gt(e,t=!0,r=!0){var l;if(li(),(e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const s=Jo(e.editorElement);if(s)return s}const n=Ux();if(n)return n;const o=window.getSelection();if(o&&o.rangeCount>0){const s=(l=jp(o.getRangeAt(0).startContainer))==null?void 0:l.closest(Be);if(s)return s}const a=document.activeElement;if(a){if(a.matches(Be))return a;const s=a.closest(Be);if(s)return s}if(r&&Te&&Te.isConnected)return Te;if(!t)return null;const i=document.querySelector(Be);return i instanceof HTMLElement?i:null}function Xx(e){const t=e.target;if(t){const n=t.closest(`.${z}`);if(n){const a=Array.from($e.entries()).find(([,i])=>i===n);if(a)return a[0]}const o=t.closest(Be);if(o)return o}const r=document.activeElement;if(r){const n=r.closest(`.${z}`);if(n){const a=Array.from($e.entries()).find(([,i])=>i===n);if(a)return a[0]}const o=r.closest(Be);if(o)return o}return null}function Uc(e,t,r){const n=Gx(e);Array.from(n.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",r),a.setAttribute("data-active",r?"true":"false"),a.setAttribute("aria-pressed",r?"true":"false")})}function Hs(e){const t=Mi.get(e);typeof t=="number"&&(window.clearTimeout(t),Mi.delete(e))}function It(e,t){return t&&e.schemas.find(r=>r.id===t)||null}function Yl(e){var t;return e.defaultSchemaId||((t=e.schemas[0])==null?void 0:t.id)||null}function ce(e,t){N.has(e)||N.set(e,t);let r=Xo.get(e);return r||(r={activeSchemaId:Yl(t),realtimeEnabled:t.enableRealtime,issues:[],headingCount:0,recognizedHeadingCount:0,missingCount:0,lastRunAt:null,snapshot:""},Xo.set(e,r)),(!r.activeSchemaId||!It(t,r.activeSchemaId))&&(r.activeSchemaId=Yl(t)),rl.add(e),r}function Os(e){var t;Hs(e),(t=$e.get(e))==null||t.remove(),$e.delete(e),pa.delete(e),N.delete(e),ai.delete(e),Xo.delete(e),rl.delete(e),Te===e&&(Te=null)}function zs(e){return pa.get(e)===!0}function Vp(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function Xl(e,t){if(!t.classList.contains("show"))return;const r=Is(e).getBoundingClientRect(),n=Math.min(window.innerWidth-20,440),o=Math.max(10,window.innerWidth-n-10),a=Math.min(Math.max(10,r.right-n),o),i=Math.max(10,Math.min(window.innerHeight-10,r.top+12));t.style.width=`${n}px`,t.style.left=`${a}px`,t.style.top=`${i}px`,t.style.maxHeight=`${Math.max(260,window.innerHeight-20)}px`}function si(e,t){const r=e.querySelector(".rte-doc-schema-live");r&&(r.textContent=t)}function Jx(e,t){const r=Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6")),n=[];return r.forEach((o,a)=>{const i=t(o.textContent||"");if(!i)return;const l=Number(o.tagName.slice(1))||0,s=Ps(i,t);n.push({text:i,key:s,index:a,level:l})}),n}function Kp(e,t,r){const n=Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6")),o=[];return n.forEach(a=>{const i=r(a.textContent||"");if(!i)return;const l=Ps(i,r),s=l&&t.matchKeyToSection.get(l)||null,c=s?t.orderBySectionId.get(s.id)??null:null,d=Lr(Number(a.tagName.slice(1))||0,1,6);o.push({element:a,level:d,section:s,order:c})}),o}function Qx(e,t=2){const r=e.filter(s=>s.section).map(s=>s.level),n=r.length>0?r:e.map(s=>s.level);if(n.length===0)return t;const o=new Map;n.forEach((s,c)=>{o.has(s)||o.set(s,{count:0,firstIndex:c});const d=o.get(s);d.count+=1});let a=t,i=-1,l=Number.MAX_SAFE_INTEGER;return o.forEach((s,c)=>{(s.count>i||s.count===i&&s.firstIndex<l||s.count===i&&s.firstIndex===l&&c<a)&&(a=c,i=s.count,l=s.firstIndex)}),Lr(a,1,6)}function e0(e){var a;const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);if(((a=jp(r.startContainer))==null?void 0:a.closest(Be))!==e)return null;if(r.startContainer.nodeType===Node.ELEMENT_NODE){const i=r.startContainer,l=i.childNodes[r.startOffset]||null;return{parent:i,referenceNode:l}}const o=r.startContainer.parentNode;return o?{parent:o,referenceNode:r.startContainer.nextSibling||null}:null}function t0(e,t,r,n){var s;const o=Kp(e,r,n),a=r.orderBySectionId.get(t.id);if(typeof a!="number"||o.length===0)return{parent:e,referenceNode:null};const i=o.find(c=>typeof c.order=="number"&&c.order>a);if(i&&i.element.parentNode)return{parent:i.element.parentNode,referenceNode:i.element};let l=-1;for(let c=0;c<o.length;c+=1){const d=o[c];typeof d.order=="number"&&d.order<a&&(l=c)}if(l>=0){const c=((s=o[l+1])==null?void 0:s.element)||null;return{parent:(c==null?void 0:c.parentNode)||o[l].element.parentNode||e,referenceNode:c}}return{parent:e,referenceNode:null}}function r0(e,t,r,n){const o=e.ownerDocument||document,a=`h${Lr(n,1,6)}`,i=o.createElement(a);i.setAttribute("data-doc-schema-section",t.id),i.textContent=t.title;const l=o.createElement("p");return l.textContent=t.placeholder||r.labels.defaultPlaceholderText,[i,l]}function mo(e,t,r,n={}){return Kc+=1,{id:`doc-schema-issue-${Kc}`,type:e,severity:t,message:r,...n}}function Oa(e,t,r){return e.replace(/\{section\}/g,t||"").replace(/\{heading\}/g,r||"").trim()}function n0(e,t,r){const n=Jx(e,r.normalizeText),o=[],a=new Map,i=[];for(let s=0;s<n.length&&!(o.length>=r.maxIssues);s+=1){const c=n[s];if(!c.key)continue;const d=t.matchKeyToSection.get(c.key);if(d){a.set(d.id,(a.get(d.id)||0)+1),i.push({section:d,heading:c});continue}t.allowUnknownHeadings||o.push(mo("unknown-heading","warning",Oa(r.labels.unknownHeadingMessage,null,c.text),{headingText:c.text,suggestion:"Map this heading to a schema alias or remove it from strict structure mode."}))}let l=0;for(let s=0;s<t.sections.length&&!(o.length>=r.maxIssues);s+=1){const c=t.sections[s],d=a.get(c.id)||0;d<c.minOccurrences&&(l+=1,o.push(mo("missing-section","error",Oa(r.labels.missingSectionMessage,c.title,null),{sectionId:c.id,sectionTitle:c.title,suggestion:`Add heading "${c.title}" to satisfy schema requirements.`}))),d>c.maxOccurrences&&o.length<r.maxIssues&&o.push(mo("duplicate-section","warning",Oa(r.labels.duplicateSectionMessage,c.title,null),{sectionId:c.id,sectionTitle:c.title,suggestion:`Keep at most ${c.maxOccurrences} instance(s) of "${c.title}".`}))}if(t.strictOrder&&o.length<r.maxIssues){let s=-1;for(let c=0;c<i.length&&!(o.length>=r.maxIssues);c+=1){const d=i[c],u=t.orderBySectionId.get(d.section.id)??c;u<s?o.push(mo("out-of-order","warning",Oa(r.labels.outOfOrderMessage,d.section.title,d.heading.text),{sectionId:d.section.id,sectionTitle:d.section.title,headingText:d.heading.text,suggestion:`Move "${d.section.title}" after earlier required sections.`})):s=u}}return{issues:o,headingCount:n.length,recognizedHeadingCount:i.length,missingCount:l}}function Wp(e){const t=N.get(e)||et,r=Xo.get(e),n=t?It(t,(r==null?void 0:r.activeSchemaId)||null):null;return{activeSchemaId:(r==null?void 0:r.activeSchemaId)||null,activeSchemaLabel:(n==null?void 0:n.label)||null,realtimeEnabled:(r==null?void 0:r.realtimeEnabled)===!0,issues:r!=null&&r.issues?r.issues.map(o=>({...o})):[],headingCount:(r==null?void 0:r.headingCount)||0,recognizedHeadingCount:(r==null?void 0:r.recognizedHeadingCount)||0,missingCount:(r==null?void 0:r.missingCount)||0,lastRunAt:(r==null?void 0:r.lastRunAt)||null}}function lr(e){const t=Xo.get(e);Uc(e,"toggleDocSchemaPanel",zs(e)),Uc(e,"toggleDocSchemaRealtime",(t==null?void 0:t.realtimeEnabled)===!0)}function $r(e){const t=$e.get(e);if(!t)return;const r=N.get(e)||et;if(!r)return;const n=ce(e,r),o=It(r,n.activeSchemaId),a=t.querySelector(".rte-doc-schema-label");a&&(a.textContent=r.labels.schemaLabel);const i=t.querySelector('[data-field="schema"]');i&&(i.innerHTML=r.schemas.map(b=>`<option value="${vt(b.id)}">${vt(b.label)}</option>`).join(""),i.value=n.activeSchemaId||"");const l=t.querySelector(".rte-doc-schema-description");if(l){const b=(o==null?void 0:o.description)||"";l.textContent=b?`${r.labels.schemaDescriptionPrefix}: ${b}`:"",l.hidden=!b}const s=t.querySelector(".rte-doc-schema-summary");if(s){const b=(o==null?void 0:o.label)||"N/A",x=n.issues.length;s.textContent=`${r.labels.summaryPrefix}: ${b} • ${x} issue${x===1?"":"s"}`}const c=t.querySelector(".rte-doc-schema-helper");c&&(c.textContent=r.labels.helperText);const d=t.querySelector(".rte-doc-schema-shortcut");d&&(d.textContent=r.labels.shortcutText);const u=t.querySelector('[data-action="run-validation"]');u&&(u.textContent=r.labels.validateText);const f=t.querySelector('[data-action="insert-missing"]');if(f){f.textContent=r.labels.insertMissingText;const b=n.issues.some(x=>x.type==="missing-section");f.disabled=!b||Vp(e)}const m=t.querySelector('[data-action="toggle-realtime"]');m&&(m.textContent=n.realtimeEnabled?r.labels.realtimeOnText:r.labels.realtimeOffText,m.setAttribute("aria-pressed",n.realtimeEnabled?"true":"false"));const g=t.querySelector('[data-action="close"]');g&&g.setAttribute("aria-label",r.labels.closeText);const p=t.querySelector(".rte-doc-schema-issues"),y=t.querySelector(".rte-doc-schema-empty");p&&(p.setAttribute("aria-label",r.labels.issueListLabel),n.issues.length===0?(p.innerHTML="",y&&(y.hidden=!1,y.textContent=r.labels.noIssuesText)):(y&&(y.hidden=!0),p.innerHTML=n.issues.map(b=>{const x=b.severity==="error"?"error":b.severity==="warning"?"warning":"info",C=b.sectionTitle||b.headingText||"";return`
            <li class="rte-doc-schema-issue ${x}" role="listitem">
              <p class="rte-doc-schema-issue-message">${vt(b.message)}${C?`: <strong>${vt(C)}</strong>`:""}</p>
              ${b.suggestion?`<p class="rte-doc-schema-issue-suggestion">${vt(b.suggestion)}</p>`:""}
            </li>
          `}).join(""))),t.setAttribute("aria-label",r.labels.panelAriaLabel)}function Qo(e,t=!1){const r=$e.get(e);r&&(r.classList.remove("show"),pa.set(e,!1),lr(e),t&&e.focus({preventScroll:!0}))}function Jl(e){const t=i0(e);$e.forEach((n,o)=>{o!==e&&Qo(o,!1)}),t.classList.add("show"),pa.set(e,!0),$r(e),Xl(e,t),lr(e);const r=t.querySelector('[data-field="schema"]');r==null||r.focus(),lt(e,"panel-open",!1)}function Up(e,t){const r=zs(e);return(typeof t=="boolean"?t:!r)?Jl(e):Qo(e,!1),!0}function o0(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function a0(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function lt(e,t,r){const n=N.get(e)||et;if(!n)return[];const o=ce(e,n),a=$e.get(e),i=e.innerHTML;if(!r&&o.snapshot===i)return o.issues;const l=It(n,o.activeSchemaId);if(!l)return o.issues=[mo("missing-section","error","No active schema is configured for this editor.",{suggestion:"Set `defaultSchemaId` or update schema options."})],o.headingCount=0,o.recognizedHeadingCount=0,o.missingCount=1,o.lastRunAt=new Date().toISOString(),o.snapshot=i,$r(e),lr(e),o.issues;const s=n0(e,l,n);return o.issues=s.issues,o.headingCount=s.headingCount,o.recognizedHeadingCount=s.recognizedHeadingCount,o.missingCount=s.missingCount,o.lastRunAt=new Date().toISOString(),o.snapshot=i,$r(e),lr(e),e.dispatchEvent(new CustomEvent("editora:doc-schema-validation",{bubbles:!0,detail:{reason:t,state:Wp(e)}})),a&&si(a,s.issues.length===0?n.labels.noIssuesText:`${s.issues.length} issue${s.issues.length===1?"":"s"} detected.`),o.issues}function Gp(e){const t=N.get(e)||et;if(!t)return;Hs(e);const r=window.setTimeout(()=>{Mi.delete(e),lt(e,"realtime",!1)},t.debounceMs);Mi.set(e,r)}function Zp(e,t){const r=N.get(e)||et;if(!r)return!1;const n=ce(e,r),o=typeof t=="boolean"?t:!n.realtimeEnabled;return n.realtimeEnabled=o,o?Gp(e):Hs(e),$r(e),lr(e),!0}function Yp(e){const t=N.get(e)||et;if(!t)return!1;const r=ce(e,t),n=$e.get(e);if(Vp(e))return n&&si(n,t.labels.readonlyMessage),!1;const o=It(t,r.activeSchemaId);if(!o)return!1;lt(e,"insert-missing-pre",!0);const a=Array.from(new Set(r.issues.filter(f=>f.type==="missing-section"&&f.sectionId).map(f=>f.sectionId))),i=o.sections.filter(f=>a.includes(f.id));if(i.length===0)return n&&si(n,t.labels.noIssuesText),!1;const l=e.innerHTML,s=Kp(e,o,t.normalizeText),c=Qx(s,2),d=e0(e);i.forEach(f=>{const m=o.strictOrder?t0(e,f,o,t.normalizeText):d||{parent:e,referenceNode:null},[g,p]=r0(e,f,t,c);m.parent.insertBefore(g,m.referenceNode),m.parent.insertBefore(p,m.referenceNode)}),o0(e,l),a0(e),lt(e,"insert-missing-post",!0);const u=i.map(f=>f.title).join(", ");return e.dispatchEvent(new CustomEvent("editora:doc-schema-insert-missing",{bubbles:!0,detail:{schemaId:o.id,sectionIds:i.map(f=>f.id)}})),n&&si(n,`${t.labels.insertedSummaryPrefix}: ${u}`),!0}function i0(e){const t=$e.get(e);if(t)return t;const r=N.get(e)||et||ii();ce(e,r);const n=`rte-doc-schema-panel-${jx++}`,o=`${n}-schema`,a=document.createElement("section");return a.className=z,a.id=n,a.setAttribute("role","dialog"),a.setAttribute("aria-modal","false"),a.setAttribute("aria-label",r.labels.panelAriaLabel),a.innerHTML=`
    <header class="rte-doc-schema-header">
      <h2 class="rte-doc-schema-title">${vt(r.labels.panelTitle)}</h2>
      <button type="button" class="rte-doc-schema-icon-btn" data-action="close" aria-label="${vt(r.labels.closeText)}">✕</button>
    </header>
    <div class="rte-doc-schema-body">
      <label class="rte-doc-schema-label" for="${vt(o)}"></label>
      <select id="${vt(o)}" class="rte-doc-schema-select" data-field="schema"></select>
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
        <ul class="rte-doc-schema-issues" role="list" aria-label="${vt(r.labels.issueListLabel)}"></ul>
        <p class="rte-doc-schema-empty" hidden></p>
      </div>
    </div>
    <div class="rte-doc-schema-live" aria-live="polite" aria-atomic="true"></div>
  `,a.addEventListener("click",i=>{const l=i.target,s=l==null?void 0:l.closest("[data-action]");if(!s)return;const c=s.getAttribute("data-action");if(c==="close"){Qo(e,!0);return}if(c==="run-validation"){lt(e,"panel-button",!0);return}if(c==="insert-missing"){Yp(e);return}c==="toggle-realtime"&&Zp(e)}),a.addEventListener("change",i=>{const l=i.target;if(!(l instanceof HTMLSelectElement)||l.getAttribute("data-field")!=="schema")return;const s=N.get(e)||et;if(!s)return;const c=ce(e,s),d=l.value;It(s,d)&&(c.activeSchemaId=d,c.snapshot="",lt(e,"schema-change",!0))}),a.addEventListener("keydown",i=>{i.key==="Escape"&&(i.preventDefault(),Qo(e,!0))}),Zl(a,e),document.body.appendChild(a),$e.set(e,a),pa.set(e,!1),$r(e),a}function l0(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="g"}function s0(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="j"}function c0(e){et=e,gn||(gn=t=>{li();const r=t.target,n=r==null?void 0:r.closest(Be);if(!n)return;const o=N.get(n)||e;ce(n,o),N.set(n,o),Te=n,lr(n);const a=$e.get(n);a&&(Zl(a,n),Xl(n,a),$r(n))},document.addEventListener("focusin",gn,!0)),bn||(bn=t=>{const r=t.target,n=r==null?void 0:r.closest(Be);if(!n)return;const o=N.get(n)||et;!o||!ce(n,o).realtimeEnabled||Gp(n)},document.addEventListener("input",bn,!0)),hn||(hn=t=>{if(t.defaultPrevented)return;const r=t.target;if(r!=null&&r.closest(`.${z}`)&&t.key!=="Escape")return;const n=Xx(t);if(!n)return;const o=N.get(n)||et||e;if(ce(n,o),N.set(n,o),Te=n,t.key==="Escape"&&zs(n)){t.preventDefault(),Qo(n,!0);return}if(l0(t)){t.preventDefault(),t.stopPropagation(),Up(n);return}s0(t)&&(t.preventDefault(),t.stopPropagation(),lt(n,"shortcut",!0))},document.addEventListener("keydown",hn,!0)),Jt||(Jt=()=>{li(),$e.forEach((t,r)=>{!r.isConnected||!t.isConnected||(Zl(t,r),Xl(r,t))})},window.addEventListener("scroll",Jt,!0),window.addEventListener("resize",Jt)),!yn&&typeof MutationObserver<"u"&&document.body&&(yn=new MutationObserver(t=>{Yx(t)&&li()}),yn.observe(document.body,{childList:!0,subtree:!0}))}function d0(){gn&&(document.removeEventListener("focusin",gn,!0),gn=null),bn&&(document.removeEventListener("input",bn,!0),bn=null),hn&&(document.removeEventListener("keydown",hn,!0),hn=null),Jt&&(window.removeEventListener("scroll",Jt,!0),window.removeEventListener("resize",Jt),Jt=null),yn&&(yn.disconnect(),yn=null),$e.forEach(t=>t.remove()),$e.clear(),Array.from(rl).forEach(t=>Os(t)),et=null,Te=null}function u0(){if(typeof document>"u"||document.getElementById(Vc))return;const e=document.createElement("style");e.id=Vc,e.textContent=`
    .rte-toolbar-group-items.${Ke},
    .editora-toolbar-group-items.${Ke},
    .rte-toolbar-group-items.${mt},
    .editora-toolbar-group-items.${mt},
    .rte-toolbar-group-items.${jt},
    .editora-toolbar-group-items.${jt} {
      display: flex;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: #ffffff;
    }

    .rte-toolbar-group-items.${Ke} .rte-toolbar-button,
    .editora-toolbar-group-items.${Ke} .editora-toolbar-button,
    .rte-toolbar-group-items.${mt} .rte-toolbar-button,
    .editora-toolbar-group-items.${mt} .editora-toolbar-button,
    .rte-toolbar-group-items.${jt} .rte-toolbar-button,
    .editora-toolbar-group-items.${jt} .editora-toolbar-button {
      border: none;
      border-right: 1px solid #cbd5e1;
      border-radius: 0;
    }

    .rte-toolbar-group-items.${Ke} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${Ke} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${mt} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${mt} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${jt} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${jt} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    ${We} .rte-toolbar-group-items.${Ke},
    ${We} .editora-toolbar-group-items.${Ke},
    ${We} .rte-toolbar-group-items.${mt},
    ${We} .editora-toolbar-group-items.${mt},
    ${We} .rte-toolbar-group-items.${jt},
    ${We} .editora-toolbar-group-items.${jt} {
      border-color: #566275;
    }
    .rte-toolbar-button[data-command="toggleDocSchemaRealtime"].active,
    .editora-toolbar-button[data-command="toggleDocSchemaRealtime"].active {
      background-color: #ccc;
    }
    ${We} .rte-toolbar-group-items.${Ke} .rte-toolbar-button svg,
    ${We} .editora-toolbar-group-items.${Ke} .editora-toolbar-button svg,
    ${We} .rte-toolbar-group-items.${mt} .rte-toolbar-button svg,
    ${We} .editora-toolbar-group-items.${mt} .editora-toolbar-button svg
    {
      fill: none;
    }
    ${We} .rte-toolbar-group-items.${Ke} .rte-toolbar-button,
    ${We} .editora-toolbar-group-items.${Ke} .editora-toolbar-button
    {
      border-color: #566275;
    }
    .${z} {
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

    .${z}.show {
      display: flex;
      flex-direction: column;
    }

    .${z}.rte-doc-schema-theme-dark {
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

    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-header {
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

    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-icon-btn {
      border-color: #475569;
      background: #0f172a;
      color: #e2e8f0;
    }

    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-icon-btn:hover,
    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-icon-btn:focus-visible {
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

    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-label {
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

    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-select {
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

    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-description,
    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-summary,
    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-helper,
    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-shortcut {
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

    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-btn-primary {
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

    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-issues-wrap {
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

    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-issue {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-issue.error {
      border-color: rgba(239, 68, 68, 0.7);
      background: rgba(127, 29, 29, 0.28);
    }

    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-issue.warning {
      border-color: rgba(245, 158, 11, 0.72);
      background: rgba(120, 53, 15, 0.28);
    }

    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-issue.info {
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

    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-issue-message {
      color: #e2e8f0;
    }

    .${z}.rte-doc-schema-theme-dark .rte-doc-schema-issue-suggestion {
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
      .${z} {
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
  `,document.head.appendChild(e)}const f0=(e={})=>{const t=ii(e),r=new Set;return u0(),{name:"docSchema",toolbar:[{id:"docSchemaGroup",label:"Document Schema",type:"group",command:"docSchema",items:[{id:"toggleDocSchemaPanel",label:"Document Schema",command:"toggleDocSchemaPanel",shortcut:"Mod-Alt-Shift-g",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M6 4.5h12A1.5 1.5 0 0 1 19.5 6v12A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5Z" stroke="currentColor" stroke-width="1.6"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'},{id:"runDocSchemaValidation",label:"Run Schema Validation",command:"runDocSchemaValidation",shortcut:"Mod-Alt-Shift-j",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M12 3.5 4.5 6.5v5c0 4.8 3.1 8.9 7.5 10 4.4-1.1 7.5-5.2 7.5-10v-5L12 3.5Z" stroke="currentColor" stroke-width="1.6"/><path d="m9 12.5 2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'},{id:"toggleDocSchemaRealtime",label:"Toggle Schema Realtime",command:"toggleDocSchemaRealtime",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 1 7.5 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9.5 19.5H5.5v-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>'}]}],commands:{docSchema:(n,o)=>{const a=gt(o,!1,!1);if(!a)return!1;const i=N.get(a)||t;return ce(a,i),N.set(a,i),Te=a,Jl(a),!0},openDocSchemaPanel:(n,o)=>{const a=gt(o,!1,!1);if(!a)return!1;const i=N.get(a)||t;return ce(a,i),N.set(a,i),Te=a,Jl(a),!0},toggleDocSchemaPanel:(n,o)=>{const a=gt(o,!1,!1);if(!a)return!1;const i=N.get(a)||t;return ce(a,i),N.set(a,i),Te=a,Up(a,typeof n=="boolean"?n:void 0)},runDocSchemaValidation:(n,o)=>{const a=gt(o,!1,!1);if(!a)return!1;const i=N.get(a)||t;return ce(a,i),N.set(a,i),Te=a,lt(a,"command",!0),!0},insertMissingDocSchemaSections:(n,o)=>{const a=gt(o,!1,!1);if(!a)return!1;const i=N.get(a)||t;return ce(a,i),N.set(a,i),Te=a,Yp(a)},toggleDocSchemaRealtime:(n,o)=>{const a=gt(o,!1,!1);if(!a)return!1;const i=N.get(a)||t;return ce(a,i),N.set(a,i),Te=a,Zp(a,typeof n=="boolean"?n:void 0)},setDocSchemaMode:(n,o)=>{const a=gt(o,!1,!1);if(!a)return!1;const i=N.get(a)||t,l=ce(a,i);N.set(a,i);const s=typeof n=="string"?n:(n==null?void 0:n.schemaId)||(n==null?void 0:n.id);return!s||!It(i,s)?!1:(l.activeSchemaId=s,l.snapshot="",lt(a,"set-mode",!0),!0)},setDocSchemaOptions:(n,o)=>{const a=gt(o,!1,!1);if(!a||!n||typeof n!="object")return!1;const i=N.get(a)||t,l=ai.get(a)||Wx(i),s={...l,...n,labels:{...l.labels||{},...n.labels||{}},schemas:Array.isArray(n.schemas)?n.schemas:l.schemas,normalizeText:n.normalizeText||i.normalizeText},c=ii(s);N.set(a,c),ai.set(a,s);const d=ce(a,c);return typeof n.enableRealtime=="boolean"&&(d.realtimeEnabled=n.enableRealtime),(!d.activeSchemaId||!It(c,d.activeSchemaId))&&(d.activeSchemaId=Yl(c)),typeof n.defaultSchemaId=="string"&&It(c,n.defaultSchemaId)&&(d.activeSchemaId=n.defaultSchemaId),d.snapshot="",lt(a,"set-options",!0),$r(a),lr(a),!0},getDocSchemaState:(n,o)=>{const a=gt(o,!1,!1);if(!a)return!1;const i=N.get(a)||t;ce(a,i);const l=Wp(a);if(typeof n=="function")try{n(l)}catch{}return a.__docSchemaState=l,a.dispatchEvent(new CustomEvent("editora:doc-schema-state",{bubbles:!0,detail:l})),!0}},keymap:{"Mod-Alt-Shift-g":"toggleDocSchemaPanel","Mod-Alt-Shift-G":"toggleDocSchemaPanel","Mod-Alt-Shift-j":"runDocSchemaValidation","Mod-Alt-Shift-J":"runDocSchemaValidation"},init:function(o){Ia+=1;const a=this&&typeof this.__pluginConfig=="object"?{...e,...this.__pluginConfig}:e,i=ii(a);c0(i);const l=gt(o!=null&&o.editorElement?{editorElement:o.editorElement}:void 0,!1,!1);l&&(Te=l,r.add(l),ce(l,i),N.set(l,i),ai.set(l,a),lr(l),lt(l,"init",!0))},destroy:()=>{r.forEach(n=>Os(n)),r.clear(),Ia=Math.max(0,Ia-1),!(Ia>0)&&d0()}}},Pe=".rte-content, .editora-content",qs="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",Gc="__editoraCommandEditorRoot",Zc="rte-translation-workflow-styles",R="rte-translation-workflow-panel",Ue="translation-workflow",bt="translationWorkflow",be=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',Yc=["p","h1","h2","h3","h4","h5","h6","li","td","th","blockquote","figcaption"].join(", "),Xp=new Set(["ArrowUp","ArrowDown","Home","End"]),Xc=[{locale:"en",label:"English",minLengthRatio:.6,maxLengthRatio:1.4,requireDifferentFromSource:!1,preserveTokens:!0},{locale:"fr",label:"French",minLengthRatio:.75,maxLengthRatio:1.7,requireDifferentFromSource:!0,preserveTokens:!0},{locale:"de",label:"German",minLengthRatio:.8,maxLengthRatio:1.9,requireDifferentFromSource:!0,preserveTokens:!0},{locale:"es",label:"Spanish",minLengthRatio:.7,maxLengthRatio:1.7,requireDifferentFromSource:!0,preserveTokens:!0},{locale:"it",label:"Italian",minLengthRatio:.7,maxLengthRatio:1.7,requireDifferentFromSource:!0,preserveTokens:!0},{locale:"ja",label:"Japanese",minLengthRatio:.45,maxLengthRatio:1.2,requireDifferentFromSource:!0,preserveTokens:!0},{locale:"zh",label:"Chinese",minLengthRatio:.4,maxLengthRatio:1.2,requireDifferentFromSource:!0,preserveTokens:!0}],p0={panelTitle:"Translation Workflow",panelAriaLabel:"Translation workflow panel",sourceLocaleLabel:"Source Locale",targetLocaleLabel:"Target Locale",validateText:"Validate Locale",captureSourceText:"Capture Source",lockSelectedText:"Lock Selected",unlockSelectedText:"Unlock Selected",lockSegmentAriaLabel:"Lock segment",unlockSegmentAriaLabel:"Unlock segment",realtimeOnText:"Realtime On",realtimeOffText:"Realtime Off",closeText:"Close",summaryPrefix:"Locale QA",noIssuesText:"No locale validation issues.",issuesLabel:"Locale issues",segmentsLabel:"Segments",sourcePreviewLabel:"Source",targetPreviewLabel:"Target",helperText:"Select segments, lock finalized ones, and run locale validation before handoff.",shortcutText:"Shortcuts: Ctrl/Cmd+Alt+Shift+L (panel), Ctrl/Cmd+Alt+Shift+V (validate), Ctrl/Cmd+Alt+Shift+K (lock segment)",readonlySegmentMessage:"This segment is locked. Unlock before editing.",sourceCapturedMessage:"Source snapshot captured from current content.",selectedSegmentPrefix:"Selected Segment",missingTargetMessage:"Segment is empty in target locale.",tokenMismatchMessage:"Tokens/placeholders do not match source segment.",untranslatedMessage:"Segment appears untranslated (same as source).",lengthOutOfRangeMessage:"Translation length is outside expected locale range."},M=new WeakMap,ci=new WeakMap,Ar=new WeakMap,de=new Map,ma=new WeakMap,Ri=new WeakMap,ga=new Set;let za=0,m0=0,Jc=0,g0=0,ke=null,Ee=null,xn=null,vn=null,kn=null,wn=null,Qt=null,En=null;function V(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function b0(e){return e.replace(/\u00A0/g," ").replace(/\s+/g," ").trim()}function br(e,t,r){return Number.isFinite(e)?Math.max(t,Math.min(r,e)):t}function Pt(e){return(e||"").trim()||"en-US"}function Ro(e){return e.trim().toLowerCase()}function h0(e){return e.replace(/"/g,"&quot;")}function y0(e,t=120){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1)).trimEnd()}…`}function Qc(e){const t=e.match(/\{\{[^{}]+\}\}|%[A-Z0-9_]+%|\$\{[^{}]+\}/gi);return!t||t.length===0?[]:t.map(r=>r.trim()).filter(Boolean)}function x0(e,t){const r=Qc(e).sort(),n=Qc(t).sort();if(r.length!==n.length)return!1;for(let o=0;o<r.length;o+=1)if(r[o]!==n[o])return!1;return!0}function v0(e,t){const r=Array.isArray(t)&&t.length>0?t:Xc,n=[],o=new Set;return r.forEach(a=>{const i=Ro(a.locale||"");if(!i)return;const l=i;o.has(l)||(o.add(l),n.push({locale:l,label:(a.label||i).trim()||i,minLengthRatio:br(Number(a.minLengthRatio??.5),.1,3),maxLengthRatio:br(Number(a.maxLengthRatio??1.8),.2,4),requireDifferentFromSource:a.requireDifferentFromSource!==!1,preserveTokens:a.preserveTokens!==!1}))}),e.forEach(a=>{const i=Ro(a);if(o.has(i))return;const l=Xc.find(s=>i.startsWith(s.locale));n.push(l?{...l,locale:i,label:a}:{locale:i,label:a,minLengthRatio:.5,maxLengthRatio:1.8,requireDifferentFromSource:!0,preserveTokens:!0})}),n}function di(e={}){const t=e.normalizeText||b0,r=Pt(e.sourceLocale||"en-US"),n=Pt(e.targetLocale||"fr-FR"),o=new Set([r,n]);(Array.isArray(e.locales)?e.locales:[]).forEach(l=>{if(typeof l!="string")return;const s=Pt(l);s&&o.add(s)});const a=Array.from(o),i=v0(a,e.localeRules);return{sourceLocale:r,targetLocale:n,locales:a,localeRules:i,enableRealtime:e.enableRealtime!==!1,debounceMs:br(Number(e.debounceMs??260),60,2e3),maxIssues:br(Number(e.maxIssues??120),5,1e3),maxSegments:br(Number(e.maxSegments??600),20,3e3),minSourceLengthForRatio:br(Number(e.minSourceLengthForRatio??8),2,100),segmentSelector:(e.segmentSelector||Yc).trim()||Yc,labels:{...p0,...e.labels||{}},normalizeText:t}}function k0(e){return{sourceLocale:e.sourceLocale,targetLocale:e.targetLocale,locales:[...e.locales],localeRules:e.localeRules.map(t=>({locale:t.locale,label:t.label,minLengthRatio:t.minLengthRatio,maxLengthRatio:t.maxLengthRatio,requireDifferentFromSource:t.requireDifferentFromSource,preserveTokens:t.preserveTokens})),enableRealtime:e.enableRealtime,debounceMs:e.debounceMs,maxIssues:e.maxIssues,maxSegments:e.maxSegments,minSourceLengthForRatio:e.minSourceLengthForRatio,segmentSelector:e.segmentSelector,labels:{...e.labels},normalizeText:e.normalizeText}}function _s(e){return e.closest(qs)||e}function ea(e){if(!e)return null;if(e.matches(Pe))return e;const t=e.querySelector(Pe);return t instanceof HTMLElement?t:null}function w0(){if(typeof window>"u")return null;const e=window[Gc];if(!(e instanceof HTMLElement))return null;window[Gc]=null;const t=ea(e);if(t)return t;const r=e.closest(qs);if(r){const o=ea(r);if(o)return o}const n=e.closest(Pe);return n instanceof HTMLElement?n:null}function E0(e){const t=e.closest("[data-editora-editor]");if(t&&ea(t)===e)return t;let r=e;for(;r;){if(r.matches(qs)&&(r===e||ea(r)===e))return r;r=r.parentElement}return _s(e)}function Jp(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function qa(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function C0(e){const t=_s(e);if(qa(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return qa(r)?!0:qa(document.documentElement)||qa(document.body)}function Ql(e,t){e.classList.remove("rte-translation-workflow-theme-dark"),C0(t)&&e.classList.add("rte-translation-workflow-theme-dark")}function S0(e){var t,r,n,o;for(let a=0;a<e.length;a+=1){const i=e[a];if(!(i.type!=="childList"||i.removedNodes.length===0))for(let l=0;l<i.removedNodes.length;l+=1){const s=i.removedNodes[l];if(s.nodeType!==Node.ELEMENT_NODE)continue;const c=s;if((t=c.matches)!=null&&t.call(c,Pe)||(r=c.matches)!=null&&r.call(c,`.${R}`)||(n=c.querySelector)!=null&&n.call(c,Pe)||(o=c.querySelector)!=null&&o.call(c,`.${R}`))return!0}}return!1}function ui(){Array.from(ga).forEach(t=>{t.isConnected||js(t)})}function rt(e,t=!0,r=!0){var l;if(ui(),(e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const s=ea(e.editorElement);if(s)return s}const n=w0();if(n)return n;const o=window.getSelection();if(o&&o.rangeCount>0){const s=(l=Jp(o.getRangeAt(0).startContainer))==null?void 0:l.closest(Pe);if(s)return s}const a=document.activeElement;if(a){if(a.matches(Pe))return a;const s=a.closest(Pe);if(s)return s}if(r&&Ee&&Ee.isConnected)return Ee;if(!t)return null;const i=document.querySelector(Pe);return i instanceof HTMLElement?i:null}function T0(e){const t=e.target;if(t){const n=t.closest(`.${R}`);if(n){const a=Array.from(de.entries()).find(([,i])=>i===n);if(a)return a[0]}const o=t.closest(Pe);if(o)return o}const r=document.activeElement;if(r){const n=r.closest(`.${R}`);if(n){const a=Array.from(de.entries()).find(([,i])=>i===n);if(a)return a[0]}const o=r.closest(Pe);if(o)return o}return null}function Tl(e,t,r){const n=E0(e);Array.from(n.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",r),a.setAttribute("data-active",r?"true":"false"),a.setAttribute("aria-pressed",r?"true":"false")})}function Fs(e){const t=Ri.get(e);typeof t=="number"&&(window.clearTimeout(t),Ri.delete(e))}function L0(e,t){const r=Ro(t),n=e.localeRules.find(i=>Ro(i.locale)===r);if(n)return n;const o=r.split("-")[0],a=e.localeRules.find(i=>Ro(i.locale).split("-")[0]===o);return a||{locale:r,label:t,minLengthRatio:.5,maxLengthRatio:1.8,requireDifferentFromSource:!0,preserveTokens:!0}}function _a(e,t,r,n={}){return Jc+=1,{id:`translation-workflow-issue-${Jc}`,type:e,severity:t,message:r,...n}}function nl(e,t){if(t){e.hasAttribute("data-translation-prev-contenteditable")||e.setAttribute("data-translation-prev-contenteditable",e.hasAttribute("contenteditable")&&e.getAttribute("contenteditable")||"inherit"),e.setAttribute("data-translation-locked","true"),e.setAttribute("contenteditable","false"),e.setAttribute("aria-readonly","true"),e.classList.add("rte-translation-segment-locked");return}if(e.removeAttribute("data-translation-locked"),e.removeAttribute("aria-readonly"),e.classList.remove("rte-translation-segment-locked"),e.hasAttribute("data-translation-prev-contenteditable")){const r=e.getAttribute("data-translation-prev-contenteditable")||"";r==="inherit"?e.setAttribute("contenteditable","true"):e.setAttribute("contenteditable",r),e.removeAttribute("data-translation-prev-contenteditable")}else e.setAttribute("contenteditable","true")}function ol(e,t){return e.querySelector(`[data-translation-segment-id="${h0(t)}"]`)}function Qp(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=Jp(t.getRangeAt(0).startContainer);return!r||!e.contains(r)?null:r.closest("[data-translation-segment-id]")}function $0(e,t){const r=Array.from(e.querySelectorAll(t));if(r.length<=1)return r;const n=new Set(r);return r.filter(o=>{let a=o.parentElement;for(;a&&a!==e;){if(n.has(a))return!1;a=a.parentElement}return!0})}function A0(e,t,r){let n=(r||"").trim();if(!n||t.has(n)){do n=`translation-segment-${m0++}`;while(t.has(n));e.setAttribute("data-translation-segment-id",n)}return n}function es(e,t){if(t.lockedSegmentIds.size===0)return!1;let r=!1;return t.lockedSegmentIds.forEach(n=>{const o=ol(e,n);if(!o)return;nl(o,!0);const a=t.lockedHtmlBySegmentId.get(n);if(typeof a=="string"){o.innerHTML!==a&&(o.innerHTML=a,r=!0);return}t.lockedHtmlBySegmentId.set(n,o.innerHTML)}),r}function sr(e,t,r){var i;const n=$0(e,t.segmentSelector),o=[],a=new Set;for(let l=0;l<n.length&&!(o.length>=t.maxSegments);l+=1){const s=n[l],c=A0(s,a,s.getAttribute("data-translation-segment-id")),d=r.lockedSegmentIds.has(c),u=s.getAttribute("data-translation-locked")==="true",f=d||u;if(f)if(r.lockedSegmentIds.add(c),nl(s,!0),!r.lockedHtmlBySegmentId.has(c))r.lockedHtmlBySegmentId.set(c,s.innerHTML);else{const p=r.lockedHtmlBySegmentId.get(c)||"";s.innerHTML!==p&&(s.innerHTML=p)}else r.lockedHtmlBySegmentId.delete(c);const m=t.normalizeText(s.textContent||"");if(!m)continue;r.sourceTextBySegmentId.has(c)||r.sourceTextBySegmentId.set(c,m);const g=r.sourceTextBySegmentId.get(c)||m;o.push({id:c,tagName:s.tagName.toLowerCase(),index:o.length,text:m,sourceText:g,locked:f}),a.add(c)}return Array.from(r.sourceTextBySegmentId.keys()).forEach(l=>{a.has(l)||r.sourceTextBySegmentId.delete(l)}),Array.from(r.lockedSegmentIds.keys()).forEach(l=>{a.has(l)||r.lockedSegmentIds.delete(l)}),Array.from(r.lockedHtmlBySegmentId.keys()).forEach(l=>{(!a.has(l)||!r.lockedSegmentIds.has(l))&&r.lockedHtmlBySegmentId.delete(l)}),(!r.selectedSegmentId||!o.some(l=>l.id===r.selectedSegmentId))&&(r.selectedSegmentId=((i=o[0])==null?void 0:i.id)||null),o}function G(e,t){M.has(e)||M.set(e,t);let r=Ar.get(e);return r||(r={sourceLocale:t.sourceLocale,targetLocale:t.targetLocale,selectedSegmentId:null,realtimeEnabled:t.enableRealtime,segments:[],issues:[],sourceTextBySegmentId:new Map,lockedSegmentIds:new Set,lockedHtmlBySegmentId:new Map,snapshot:"",lastRunAt:null},Ar.set(e,r)),ga.add(e),r}function js(e){Fs(e);const t=de.get(e);t&&t.remove(),de.delete(e),ma.delete(e);const r=Ar.get(e);r&&(r.lockedSegmentIds.forEach(n=>{const o=ol(e,n);o&&nl(o,!1)}),r.lockedHtmlBySegmentId.clear()),M.delete(e),ci.delete(e),Ar.delete(e),ga.delete(e),Ee===e&&(Ee=null)}function Vs(e){return ma.get(e)===!0}function ts(e,t){if(!t.classList.contains("show"))return;const r=_s(e).getBoundingClientRect(),n=Math.min(window.innerWidth-20,520),o=Math.max(10,window.innerWidth-n-10),a=Math.min(Math.max(10,r.right-n),o),i=Math.max(10,Math.min(window.innerHeight-10,r.top+12));t.style.width=`${n}px`,t.style.left=`${a}px`,t.style.top=`${i}px`,t.style.maxHeight=`${Math.max(260,window.innerHeight-20)}px`}function hr(e,t){const r=e.querySelector(".rte-translation-live");r&&(r.textContent=t)}function M0(e,t){return`${e.innerHTML}::${t.sourceLocale}::${t.targetLocale}::${Array.from(t.lockedSegmentIds).sort().join("|")}`}function R0(e,t,r){const n=[],o=L0(r,t.targetLocale);for(let a=0;a<e.length&&!(n.length>=r.maxIssues);a+=1){const i=e[a],l=r.normalizeText(i.sourceText||""),s=r.normalizeText(i.text||"");if(!s){n.push(_a("missing-target","error",r.labels.missingTargetMessage,{segmentId:i.id,sourceText:l,targetText:s,suggestion:"Provide translated content for this segment before export."}));continue}if(o.preserveTokens&&l&&!x0(l,s)&&(n.push(_a("token-mismatch","error",r.labels.tokenMismatchMessage,{segmentId:i.id,sourceText:l,targetText:s,suggestion:"Preserve placeholders/tokens exactly (for example {{name}}, %ID%, ${value})."})),n.length>=r.maxIssues)||o.requireDifferentFromSource&&l&&r.normalizeText(l)===r.normalizeText(s)&&(n.push(_a("untranslated","warning",r.labels.untranslatedMessage,{segmentId:i.id,sourceText:l,targetText:s,suggestion:"Translate the segment or mark it intentionally unchanged."})),n.length>=r.maxIssues))break;if(l.length>=r.minSourceLengthForRatio){const c=s.length/Math.max(1,l.length);(c<o.minLengthRatio||c>o.maxLengthRatio)&&n.push(_a("length-out-of-range","warning",r.labels.lengthOutOfRangeMessage,{segmentId:i.id,sourceText:l,targetText:s,suggestion:`Expected ratio for ${o.label}: ${o.minLengthRatio.toFixed(2)} - ${o.maxLengthRatio.toFixed(2)}.`}))}}return n}function em(e){const t=M.get(e)||ke,r=Ar.get(e);return{sourceLocale:(r==null?void 0:r.sourceLocale)||(t==null?void 0:t.sourceLocale)||"en-US",targetLocale:(r==null?void 0:r.targetLocale)||(t==null?void 0:t.targetLocale)||"fr-FR",realtimeEnabled:(r==null?void 0:r.realtimeEnabled)===!0,selectedSegmentId:(r==null?void 0:r.selectedSegmentId)||null,segmentCount:(r==null?void 0:r.segments.length)||0,lockedSegmentCount:r?r.segments.filter(n=>n.locked).length:0,issues:r!=null&&r.issues?r.issues.map(n=>({...n})):[],segments:(r==null?void 0:r.segments.map(n=>({id:n.id,tagName:n.tagName,index:n.index,sourceLength:n.sourceText.length,targetLength:n.text.length,locked:n.locked})))||[],lastRunAt:(r==null?void 0:r.lastRunAt)||null}}function Et(e){const t=Ar.get(e),r=t&&t.selectedSegmentId?t.segments.find(n=>n.id===t.selectedSegmentId):null;Tl(e,"toggleTranslationWorkflowPanel",Vs(e)),Tl(e,"toggleTranslationRealtime",(t==null?void 0:t.realtimeEnabled)===!0),Tl(e,"toggleTranslationSegmentLock",(r==null?void 0:r.locked)===!0)}function D0(e,t){const r=ol(e,t);if(!r)return;try{r.scrollIntoView({block:"nearest",inline:"nearest"})}catch{}const n=window.getSelection();if(!(!n||typeof document.createRange!="function"))try{const o=document.createRange();o.selectNodeContents(r),o.collapse(!0),n.removeAllRanges(),n.addRange(o),e.focus({preventScroll:!0})}catch{}}function Ht(e){const t=de.get(e);if(!t)return;const r=M.get(e)||ke;if(!r)return;const n=G(e,r),o=t.querySelector(".rte-translation-source-label");o&&(o.textContent=r.labels.sourceLocaleLabel);const a=t.querySelector(".rte-translation-target-label");a&&(a.textContent=r.labels.targetLocaleLabel);const i=t.querySelector('[data-field="source-locale"]'),l=t.querySelector('[data-field="target-locale"]'),s=r.locales.map(w=>`<option value="${V(w)}">${V(w)}</option>`).join("");i&&(i.innerHTML=s,i.value=n.sourceLocale),l&&(l.innerHTML=s,l.value=n.targetLocale);const c=t.querySelector(".rte-translation-summary");if(c){const w=n.issues.length,v=n.selectedSegmentId?` • ${r.labels.selectedSegmentPrefix}: ${n.selectedSegmentId}`:"";c.textContent=`${r.labels.summaryPrefix}: ${n.sourceLocale} → ${n.targetLocale} • ${w} issue${w===1?"":"s"}${v}`}const d=t.querySelector(".rte-translation-helper");d&&(d.textContent=r.labels.helperText);const u=t.querySelector(".rte-translation-shortcut");u&&(u.textContent=r.labels.shortcutText);const f=t.querySelector('[data-action="run-validation"]');f&&(f.textContent=r.labels.validateText);const m=t.querySelector('[data-action="capture-source"]');m&&(m.textContent=r.labels.captureSourceText);const g=t.querySelector('[data-action="toggle-realtime"]');g&&(g.textContent=n.realtimeEnabled?r.labels.realtimeOnText:r.labels.realtimeOffText,g.setAttribute("aria-pressed",n.realtimeEnabled?"true":"false"));const p=t.querySelector('[data-action="lock-selected"]'),y=n.selectedSegmentId&&n.segments.find(w=>w.id===n.selectedSegmentId)||null;p&&(p.textContent=y!=null&&y.locked?r.labels.unlockSelectedText:r.labels.lockSelectedText,p.disabled=!y,p.setAttribute("aria-pressed",y!=null&&y.locked?"true":"false"));const b=t.querySelector('[data-action="close"]');b&&b.setAttribute("aria-label",r.labels.closeText);const x=t.querySelector(".rte-translation-issues"),C=t.querySelector(".rte-translation-empty");x&&(x.setAttribute("aria-label",r.labels.issuesLabel),n.issues.length===0?(x.innerHTML="",C&&(C.hidden=!1,C.textContent=r.labels.noIssuesText)):(C&&(C.hidden=!0),x.innerHTML=n.issues.map(w=>`
            <li class="rte-translation-issue ${w.severity==="error"?"error":w.severity==="warning"?"warning":"info"}" role="listitem" data-segment-id="${V(w.segmentId||"")}">
              <p class="rte-translation-issue-message">${V(w.message)}</p>
              ${w.suggestion?`<p class="rte-translation-issue-suggestion">${V(w.suggestion)}</p>`:""}
            </li>
          `).join("")));const k=t.querySelector(".rte-translation-segments");k&&(k.setAttribute("aria-label",r.labels.segmentsLabel),k.innerHTML=n.segments.map(w=>{const v=w.id===n.selectedSegmentId?"selected":"",E=w.locked?"locked":"";return`
          <li class="rte-translation-segment-item ${v} ${E}" role="option" aria-selected="${w.id===n.selectedSegmentId?"true":"false"}" data-segment-id="${V(w.id)}">
            <button type="button" class="rte-translation-segment-select" data-action="select-segment" data-segment-id="${V(w.id)}" title="${V(w.text)}">
              <span class="rte-translation-segment-meta">#${w.index+1} • ${V(w.tagName)}</span>
              <span class="rte-translation-segment-text">${V(y0(w.text,110))}</span>
            </button>
            <button type="button" class="rte-translation-segment-lock" data-action="toggle-lock" data-segment-id="${V(w.id)}" aria-label="${w.locked?r.labels.unlockSegmentAriaLabel:r.labels.lockSegmentAriaLabel}" aria-pressed="${w.locked?"true":"false"}"></button>
          </li>
        `}).join(""));const T=t.querySelector(".rte-translation-source-preview"),$=t.querySelector(".rte-translation-target-preview");if(T||$){const w=n.selectedSegmentId&&n.segments.find(v=>v.id===n.selectedSegmentId)||null;T&&(T.textContent=(w==null?void 0:w.sourceText)||"—",T.setAttribute("aria-label",r.labels.sourcePreviewLabel)),$&&($.textContent=(w==null?void 0:w.text)||"—",$.setAttribute("aria-label",r.labels.targetPreviewLabel))}t.setAttribute("aria-label",r.labels.panelAriaLabel)}function tm(e){const t=M.get(e)||ke;if(!t)return;Fs(e);const r=window.setTimeout(()=>{Ri.delete(e),Qe(e,"realtime",!1)},t.debounceMs);Ri.set(e,r)}function Qe(e,t,r){const n=M.get(e)||ke;if(!n)return[];const o=G(e,n),a=es(e,o);o.segments=sr(e,n,o);const i=M0(e,o);if(!r&&o.snapshot===i)return o.issues;o.issues=R0(o.segments,o,n),o.lastRunAt=new Date().toISOString(),o.snapshot=i,Ht(e),Et(e),e.dispatchEvent(new CustomEvent("editora:translation-workflow-validation",{bubbles:!0,detail:{reason:t,state:em(e)}}));const l=de.get(e);if(l){if(a)return hr(l,n.labels.readonlySegmentMessage),o.issues;hr(l,o.issues.length===0?n.labels.noIssuesText:`${o.issues.length} issue${o.issues.length===1?"":"s"} detected.`)}return o.issues}function rm(e){const t=M.get(e)||ke;if(!t)return!1;const r=G(e,t),n=sr(e,t,r);n.forEach(a=>{r.sourceTextBySegmentId.set(a.id,a.text)}),r.snapshot="",Qe(e,"capture-source",!0);const o=de.get(e);return o&&hr(o,t.labels.sourceCapturedMessage),e.dispatchEvent(new CustomEvent("editora:translation-source-captured",{bubbles:!0,detail:{sourceLocale:r.sourceLocale,segmentCount:n.length}})),!0}function Di(e,t,r){var c,d;const n=M.get(e)||ke;if(!n)return!1;const o=G(e,n);o.segments=sr(e,n,o);const a=((c=Qp(e))==null?void 0:c.getAttribute("data-translation-segment-id"))||null,i=t||a||o.selectedSegmentId||((d=o.segments[0])==null?void 0:d.id)||null;if(!i)return!1;const l=ol(e,i);if(!l)return!1;const s=typeof r=="boolean"?r:!o.lockedSegmentIds.has(i);return s?(o.lockedSegmentIds.add(i),o.lockedHtmlBySegmentId.set(i,l.innerHTML)):(o.lockedSegmentIds.delete(i),o.lockedHtmlBySegmentId.delete(i)),nl(l,s),o.selectedSegmentId=i,o.snapshot="",Qe(e,"lock-segment",!0),e.dispatchEvent(new CustomEvent("editora:translation-segment-lock",{bubbles:!0,detail:{segmentId:i,locked:s}})),!0}function nm(e,t){const r=M.get(e)||ke;if(!r)return!1;const n=G(e,r),o=typeof t=="boolean"?t:!n.realtimeEnabled;return n.realtimeEnabled=o,o?tm(e):Fs(e),Ht(e),Et(e),!0}function rs(e,t,r=!0){const n=M.get(e)||ke;if(!n)return!1;const o=G(e,n);return o.segments=sr(e,n,o),o.segments.some(a=>a.id===t)?(o.selectedSegmentId=t,Ht(e),Et(e),r&&D0(e,t),!0):!1}function Fa(e,t){const r=M.get(e)||ke;if(!r)return!1;const n=G(e,r);if(n.segments=sr(e,r,n),n.segments.length===0)return!1;const o=Math.max(0,n.segments.findIndex(l=>l.id===n.selectedSegmentId));let a=o;t==="start"?a=0:t==="end"?a=n.segments.length-1:a=br(o+t,0,n.segments.length-1);const i=n.segments[a];return i?rs(e,i.id,!0):!1}function ta(e,t=!1){const r=de.get(e);r&&(r.classList.remove("show"),ma.set(e,!1),Et(e),t&&e.focus({preventScroll:!0}))}function ns(e){const t=H0(e);de.forEach((n,o)=>{o!==e&&ta(o,!1)}),t.classList.add("show"),ma.set(e,!0),Qe(e,"panel-open",!1),Ht(e),ts(e,t),Et(e);const r=t.querySelector('[data-field="target-locale"]');r==null||r.focus()}function om(e,t){const r=Vs(e);return(typeof t=="boolean"?t:!r)?ns(e):ta(e,!1),!0}function N0(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="l"}function B0(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="v"}function P0(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="k"}function I0(e){return e.key.length===1&&!e.metaKey&&!e.ctrlKey&&!e.altKey?!0:e.key==="Backspace"||e.key==="Delete"||e.key==="Enter"}function ed(e){return e instanceof HTMLElement?e.closest('[data-translation-locked="true"]'):null}function H0(e){const t=de.get(e);if(t)return t;const r=M.get(e)||ke||di();G(e,r);const n=`rte-translation-workflow-panel-${g0++}`,o=`${n}-source`,a=`${n}-target`,i=document.createElement("section");return i.className=R,i.id=n,i.setAttribute("role","dialog"),i.setAttribute("aria-modal","false"),i.setAttribute("aria-label",r.labels.panelAriaLabel),i.innerHTML=`
    <header class="rte-translation-header">
      <h2 class="rte-translation-title">${V(r.labels.panelTitle)}</h2>
      <button type="button" class="rte-translation-icon-btn" data-action="close" aria-label="${V(r.labels.closeText)}">✕</button>
    </header>
    <div class="rte-translation-body">
      <div class="rte-translation-locales">
        <div class="rte-translation-locale-field">
          <label class="rte-translation-source-label" for="${V(o)}"></label>
          <select id="${V(o)}" class="rte-translation-select" data-field="source-locale"></select>
        </div>
        <div class="rte-translation-locale-field">
          <label class="rte-translation-target-label" for="${V(a)}"></label>
          <select id="${V(a)}" class="rte-translation-select" data-field="target-locale"></select>
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
        <section class="rte-translation-segments-wrap" aria-label="${V(r.labels.segmentsLabel)}">
          <h3 class="rte-translation-subtitle">${V(r.labels.segmentsLabel)}</h3>
          <ul class="rte-translation-segments" role="listbox" tabindex="0" aria-label="${V(r.labels.segmentsLabel)}"></ul>
        </section>
        <section class="rte-translation-preview-wrap">
          <h3 class="rte-translation-subtitle">${V(r.labels.sourcePreviewLabel)} / ${V(r.labels.targetPreviewLabel)}</h3>
          <div class="rte-translation-preview-block">
            <p class="rte-translation-preview-label">${V(r.labels.sourcePreviewLabel)}</p>
            <p class="rte-translation-source-preview"></p>
          </div>
          <div class="rte-translation-preview-block">
            <p class="rte-translation-preview-label">${V(r.labels.targetPreviewLabel)}</p>
            <p class="rte-translation-target-preview"></p>
          </div>
        </section>
      </div>
      <section class="rte-translation-issues-wrap">
        <h3 class="rte-translation-subtitle">${V(r.labels.issuesLabel)}</h3>
        <ul class="rte-translation-issues" role="list" aria-label="${V(r.labels.issuesLabel)}"></ul>
        <p class="rte-translation-empty" hidden></p>
      </section>
    </div>
    <div class="rte-translation-live" aria-live="polite" aria-atomic="true"></div>
  `,i.addEventListener("click",l=>{const s=l.target;if(!s)return;const c=s.closest("[data-action]");if(!c){const u=s.closest(".rte-translation-issue[data-segment-id]"),f=(u==null?void 0:u.getAttribute("data-segment-id"))||"";f&&rs(e,f,!0);return}const d=c.getAttribute("data-action");if(d==="close"){ta(e,!0);return}if(d==="run-validation"){Qe(e,"panel-button",!0);return}if(d==="capture-source"){rm(e);return}if(d==="lock-selected"){Di(e);return}if(d==="toggle-realtime"){nm(e);return}if(d==="select-segment"){const u=c.getAttribute("data-segment-id")||"";u&&rs(e,u,!0);return}if(d==="toggle-lock"){const u=c.getAttribute("data-segment-id")||"";u&&Di(e,u)}}),i.addEventListener("change",l=>{const s=l.target;if(!(s instanceof HTMLSelectElement))return;const c=M.get(e)||ke;if(!c)return;const d=G(e,c);if(s.getAttribute("data-field")==="source-locale"){d.sourceLocale=Pt(s.value),d.snapshot="",Qe(e,"source-locale-change",!0);return}s.getAttribute("data-field")==="target-locale"&&(d.targetLocale=Pt(s.value),d.snapshot="",Qe(e,"target-locale-change",!0))}),i.addEventListener("keydown",l=>{const s=l.target;if(l.key==="Escape"){l.preventDefault(),ta(e,!0);return}!(s!=null&&s.closest(".rte-translation-segments"))||!Xp.has(l.key)||(l.preventDefault(),l.key==="ArrowUp"?Fa(e,-1):l.key==="ArrowDown"?Fa(e,1):l.key==="Home"?Fa(e,"start"):l.key==="End"&&Fa(e,"end"))}),Ql(i,e),document.body.appendChild(i),de.set(e,i),ma.set(e,!1),Ht(e),i}function O0(e){ke=e,xn||(xn=t=>{var s;ui();const r=t.target,n=r==null?void 0:r.closest(Pe);if(!n)return;const o=M.get(n)||e,a=G(n,o);M.set(n,o),Ee=n;const i=((s=Qp(n))==null?void 0:s.getAttribute("data-translation-segment-id"))||null;i&&(a.selectedSegmentId=i),Et(n);const l=de.get(n);l&&(Ql(l,n),ts(n,l),Ht(n))},document.addEventListener("focusin",xn,!0)),vn||(vn=t=>{const r=t.target,n=r==null?void 0:r.closest(Pe);if(!n)return;const o=M.get(n)||ke;if(!o)return;const a=G(n,o),i=es(n,a);if(a.segments=sr(n,o,a),!a.realtimeEnabled){if(i){const l=de.get(n);l&&hr(l,o.labels.readonlySegmentMessage)}Ht(n),Et(n);return}tm(n)},document.addEventListener("input",vn,!0)),kn||(kn=t=>{const r=t,n=r.target,o=n==null?void 0:n.closest(Pe);if(!o)return;const a=ed(n);if(!a||!o.contains(a))return;r.preventDefault();const i=de.get(o),l=M.get(o)||ke;i&&l&&hr(i,l.labels.readonlySegmentMessage)},document.addEventListener("beforeinput",kn,!0)),wn||(wn=t=>{if(t.defaultPrevented)return;const r=t.target;if((r==null?void 0:r.closest(`.${R}`))&&t.key!=="Escape"&&!Xp.has(t.key))return;const o=t.key==="Escape",a=N0(t),i=B0(t),l=P0(t),s=ed(r);if(!o&&!a&&!i&&!l&&!s)return;const c=T0(t);if(!c)return;const d=M.get(c)||ke||e;if(G(c,d),M.set(c,d),Ee=c,o&&Vs(c)){t.preventDefault(),ta(c,!0);return}if(s&&c.contains(s)&&I0(t)){t.preventDefault();const u=de.get(c);u&&hr(u,d.labels.readonlySegmentMessage);return}if(a){t.preventDefault(),t.stopPropagation(),om(c);return}if(i){t.preventDefault(),t.stopPropagation(),Qe(c,"shortcut",!0);return}l&&(t.preventDefault(),t.stopPropagation(),Di(c))},document.addEventListener("keydown",wn,!0)),Qt||(Qt=()=>{ui(),de.forEach((t,r)=>{!r.isConnected||!t.isConnected||(Ql(t,r),ts(r,t))})},window.addEventListener("scroll",Qt,!0),window.addEventListener("resize",Qt)),!En&&typeof MutationObserver<"u"&&document.body&&(En=new MutationObserver(t=>{S0(t)&&ui(),t.some(n=>n.type==="characterData"?!0:n.type==="childList"&&(n.addedNodes.length>0||n.removedNodes.length>0))&&ga.forEach(n=>{const o=Ar.get(n);if(!o||o.lockedSegmentIds.size===0||!es(n,o))return;o.snapshot="";const i=M.get(n)||ke,l=de.get(n);l&&i&&hr(l,i.labels.readonlySegmentMessage),i&&(o.segments=sr(n,i,o),Ht(n),Et(n))})}),En.observe(document.body,{childList:!0,subtree:!0,characterData:!0}))}function z0(){xn&&(document.removeEventListener("focusin",xn,!0),xn=null),vn&&(document.removeEventListener("input",vn,!0),vn=null),kn&&(document.removeEventListener("beforeinput",kn,!0),kn=null),wn&&(document.removeEventListener("keydown",wn,!0),wn=null),Qt&&(window.removeEventListener("scroll",Qt,!0),window.removeEventListener("resize",Qt),Qt=null),En&&(En.disconnect(),En=null),de.forEach(t=>t.remove()),de.clear(),Array.from(ga).forEach(t=>js(t)),ke=null,Ee=null}function q0(){if(typeof document>"u"||document.getElementById(Zc))return;const e=document.createElement("style");e.id=Zc,e.textContent=`
    .rte-toolbar-group-items.${Ue},
    .editora-toolbar-group-items.${Ue},
    .rte-toolbar-group-items.${bt},
    .editora-toolbar-group-items.${bt} {
      display: flex;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: #ffffff;
    }

    .rte-toolbar-group-items.${Ue} .rte-toolbar-button,
    .editora-toolbar-group-items.${Ue} .editora-toolbar-button,
    .rte-toolbar-group-items.${bt} .rte-toolbar-button,
    .editora-toolbar-group-items.${bt} .editora-toolbar-button {
      border: none;
      border-right: 1px solid #cbd5e1;
      border-radius: 0;
    }

    .rte-toolbar-group-items.${Ue} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${Ue} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${bt} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${bt} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    ${be} .rte-toolbar-group-items.${Ue},
    ${be} .editora-toolbar-group-items.${Ue},
    ${be} .rte-toolbar-group-items.${bt},
    ${be} .editora-toolbar-group-items.${bt} {
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
    ${be} .rte-toolbar-group-items.${Ue} .rte-toolbar-button svg,
    ${be} .editora-toolbar-group-items.${Ue} .editora-toolbar-button svg,
    ${be} .rte-toolbar-group-items.${bt} .rte-toolbar-button svg,
    ${be} .editora-toolbar-group-items.${bt} .editora-toolbar-button svg
    {
      fill: none;
    }
    ${be} .rte-toolbar-group-items.${Ue} .rte-toolbar-button,
    ${be} .editora-toolbar-group-items.${Ue} .editora-toolbar-button
    {
      border-color: #566275;
    }

    ${be} .rte-toolbar-button[data-command="toggleTranslationWorkflowPanel"].active,
    ${be} .editora-toolbar-button[data-command="toggleTranslationWorkflowPanel"].active,
    ${be} .rte-toolbar-button[data-command="toggleTranslationSegmentLock"].active,
    ${be} .editora-toolbar-button[data-command="toggleTranslationSegmentLock"].active, 
    ${be} .rte-toolbar-button[data-command="toggleTranslationRealtime"].active,
    ${be} .editora-toolbar-button[data-command="toggleTranslationRealtime"].active {
      background: linear-gradient(180deg, #5eaaf6 0%, #4a95de 100%);
    }

    .${R} {
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

    .${R}.show {
      display: flex;
      flex-direction: column;
    }

    .${R}.rte-translation-workflow-theme-dark {
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

    .${R}.rte-translation-workflow-theme-dark .rte-translation-header {
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

    .${R}.rte-translation-workflow-theme-dark .rte-translation-icon-btn {
      border-color: #475569;
      background: #0f172a;
      color: #e2e8f0;
    }

    .${R}.rte-translation-workflow-theme-dark .rte-translation-icon-btn:hover,
    .${R}.rte-translation-workflow-theme-dark .rte-translation-icon-btn:focus-visible {
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

    .${R}.rte-translation-workflow-theme-dark .rte-translation-source-label,
    .${R}.rte-translation-workflow-theme-dark .rte-translation-target-label {
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

    .${R}.rte-translation-workflow-theme-dark .rte-translation-select {
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

    .${R}.rte-translation-workflow-theme-dark .rte-translation-summary,
    .${R}.rte-translation-workflow-theme-dark .rte-translation-helper,
    .${R}.rte-translation-workflow-theme-dark .rte-translation-shortcut {
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

    .${R}.rte-translation-workflow-theme-dark .rte-translation-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${R}.rte-translation-workflow-theme-dark .rte-translation-btn-primary {
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

    .${R}.rte-translation-workflow-theme-dark .rte-translation-segments-wrap,
    .${R}.rte-translation-workflow-theme-dark .rte-translation-preview-wrap,
    .${R}.rte-translation-workflow-theme-dark .rte-translation-issues-wrap {
      border-color: #334155;
      background: #0b1220;
    }

    .rte-translation-subtitle {
      margin: 0 0 6px;
      font-size: 12px;
      font-weight: 700;
      color: #334155;
    }

    .${R}.rte-translation-workflow-theme-dark .rte-translation-subtitle {
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

    .${R}.rte-translation-workflow-theme-dark .rte-translation-segment-item {
      border-color: #334155;
      background: #111827;
    }

    .${R}.rte-translation-workflow-theme-dark .rte-translation-segment-item.locked {
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

    .${R}.rte-translation-workflow-theme-dark .rte-translation-segment-meta {
      color: #94a3b8;
    }

    .${R}.rte-translation-workflow-theme-dark .rte-translation-segment-text {
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

    .${R}.rte-translation-workflow-theme-dark .rte-translation-segment-lock {
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

    .${R}.rte-translation-workflow-theme-dark .rte-translation-preview-label {
      color: #94a3b8;
    }

    .${R}.rte-translation-workflow-theme-dark .rte-translation-source-preview,
    .${R}.rte-translation-workflow-theme-dark .rte-translation-target-preview {
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

    .${R}.rte-translation-workflow-theme-dark .rte-translation-issue {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${R}.rte-translation-workflow-theme-dark .rte-translation-issue.error {
      border-color: rgba(239, 68, 68, 0.7);
      background: rgba(127, 29, 29, 0.28);
    }

    .${R}.rte-translation-workflow-theme-dark .rte-translation-issue.warning {
      border-color: rgba(245, 158, 11, 0.72);
      background: rgba(120, 53, 15, 0.28);
    }

    .${R}.rte-translation-workflow-theme-dark .rte-translation-issue.info {
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

    .${R}.rte-translation-workflow-theme-dark .rte-translation-issue-message {
      color: #e2e8f0;
    }

    .${R}.rte-translation-workflow-theme-dark .rte-translation-issue-suggestion {
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

    ${be} [data-translation-locked="true"].rte-translation-segment-locked {
      outline-color: rgba(245, 158, 11, 0.75);
      background: rgba(120, 53, 15, 0.22);
    }

    @media (max-width: 920px) {
      .${R} {
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
  `,document.head.appendChild(e)}const _0=(e={})=>{const t=di(e),r=new Set;return q0(),{name:"translationWorkflow",toolbar:[{id:"translationWorkflowGroup",label:"Translation Workflow",type:"group",command:"translationWorkflow",items:[{id:"toggleTranslationWorkflowPanel",label:"Translation Workflow",command:"toggleTranslationWorkflowPanel",shortcut:"Mod-Alt-Shift-l",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4 6.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H8l-4 3V6.5Z" stroke="currentColor" stroke-width="1.6"/><path d="M20 17.5a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-1.5" stroke="currentColor" stroke-width="1.6"/><path d="m13 8 2 2m0 0 2-2m-2 2V4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'},{id:"runTranslationLocaleValidation",label:"Run Locale Validation",command:"runTranslationLocaleValidation",shortcut:"Mod-Alt-Shift-v",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="4.5" y="4" width="12" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 8h5.5M8 11h4M8 14h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="m15.5 15.5 1.7 1.7 3.3-3.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'},{id:"toggleTranslationSegmentLock",label:"Toggle Segment Lock",command:"toggleTranslationSegmentLock",shortcut:"Mod-Alt-Shift-k",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8.5 10V7.5a3.5 3.5 0 1 1 7 0V10" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="15" r="1.2" fill="currentColor"/></svg>'},{id:"toggleTranslationRealtime",label:"Toggle Translation Realtime",command:"toggleTranslationRealtime",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 1 7.5 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9.5 19.5H5.5v-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8v4l2.5 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'}]}],commands:{translationWorkflow:(n,o)=>{const a=rt(o,!1,!1);if(!a)return!1;const i=M.get(a)||t;return G(a,i),M.set(a,i),Ee=a,ns(a),!0},openTranslationWorkflowPanel:(n,o)=>{const a=rt(o,!1,!1);if(!a)return!1;const i=M.get(a)||t;return G(a,i),M.set(a,i),Ee=a,ns(a),!0},toggleTranslationWorkflowPanel:(n,o)=>{const a=rt(o,!1,!1);if(!a)return!1;const i=M.get(a)||t;return G(a,i),M.set(a,i),Ee=a,om(a,typeof n=="boolean"?n:void 0)},runTranslationLocaleValidation:(n,o)=>{const a=rt(o,!1,!1);if(!a)return!1;const i=M.get(a)||t;return G(a,i),M.set(a,i),Ee=a,Qe(a,"command",!0),!0},toggleTranslationRealtime:(n,o)=>{const a=rt(o,!1,!1);if(!a)return!1;const i=M.get(a)||t;return G(a,i),M.set(a,i),Ee=a,nm(a,typeof n=="boolean"?n:void 0)},toggleTranslationSegmentLock:(n,o)=>{const a=rt(o,!1,!1);if(!a)return!1;const i=M.get(a)||t;G(a,i),M.set(a,i),Ee=a;const l=typeof n=="boolean"?n:n==null?void 0:n.locked,s=typeof n=="object"?n==null?void 0:n.segmentId:void 0;return Di(a,s,l)},setTranslationLocales:(n,o)=>{const a=rt(o,!1,!1);if(!a||!n||typeof n!="object")return!1;const i=M.get(a)||t,l=G(a,i);return M.set(a,i),typeof n.sourceLocale=="string"&&n.sourceLocale.trim()&&(l.sourceLocale=Pt(n.sourceLocale)),typeof n.targetLocale=="string"&&n.targetLocale.trim()&&(l.targetLocale=Pt(n.targetLocale)),l.snapshot="",Qe(a,"set-locales",!0),!0},captureTranslationSourceSnapshot:(n,o)=>{const a=rt(o,!1,!1);if(!a)return!1;const i=M.get(a)||t;return G(a,i),M.set(a,i),Ee=a,rm(a)},setTranslationWorkflowOptions:(n,o)=>{const a=rt(o,!1,!1);if(!a||!n||typeof n!="object")return!1;const i=M.get(a)||t,l=ci.get(a)||k0(i),s={...l,...n,labels:{...l.labels||{},...n.labels||{}},localeRules:Array.isArray(n.localeRules)?n.localeRules:l.localeRules,locales:Array.isArray(n.locales)?n.locales:l.locales,normalizeText:n.normalizeText||i.normalizeText},c=di(s);M.set(a,c),ci.set(a,s);const d=G(a,c);return typeof n.enableRealtime=="boolean"&&(d.realtimeEnabled=n.enableRealtime),typeof n.sourceLocale=="string"&&n.sourceLocale.trim()&&(d.sourceLocale=Pt(n.sourceLocale)),typeof n.targetLocale=="string"&&n.targetLocale.trim()&&(d.targetLocale=Pt(n.targetLocale)),d.snapshot="",Qe(a,"set-options",!0),Ht(a),Et(a),!0},getTranslationWorkflowState:(n,o)=>{const a=rt(o,!1,!1);if(!a)return!1;const i=M.get(a)||t;G(a,i);const l=em(a);if(typeof n=="function")try{n(l)}catch{}return a.__translationWorkflowState=l,a.dispatchEvent(new CustomEvent("editora:translation-workflow-state",{bubbles:!0,detail:l})),!0}},keymap:{"Mod-Alt-Shift-l":"toggleTranslationWorkflowPanel","Mod-Alt-Shift-L":"toggleTranslationWorkflowPanel","Mod-Alt-Shift-v":"runTranslationLocaleValidation","Mod-Alt-Shift-V":"runTranslationLocaleValidation","Mod-Alt-Shift-k":"toggleTranslationSegmentLock","Mod-Alt-Shift-K":"toggleTranslationSegmentLock"},init:function(o){za+=1;const a=this&&typeof this.__pluginConfig=="object"?{...e,...this.__pluginConfig}:e,i=di(a);O0(i);const l=rt(o!=null&&o.editorElement?{editorElement:o.editorElement}:void 0,!1,!1);if(!l)return;Ee=l,r.add(l);const s=G(l,i);M.set(l,i),ci.set(l,a),s.segments=sr(l,i,s),Qe(l,"init",!0),Et(l)},destroy:()=>{r.forEach(n=>js(n)),r.clear(),za=Math.max(0,za-1),!(za>0)&&z0()}}};function F0(e,t){const r=Array.from({length:t}).map(()=>"<th><p><br></p></th>").join(""),n=Array.from({length:e}).map(()=>`<tr>${Array.from({length:t}).map(()=>"<td><p><br></p></td>").join("")}</tr>`).join("");return`<table class="rte-table"><thead><tr>${r}</tr></thead><tbody>${n}</tbody></table><p><br></p>`}function j0(){return[{id:"paragraph",label:"Paragraph",description:"Switch to paragraph text",command:"paragraph",keywords:["text","normal","p"]},{id:"h1",label:"Heading 1",description:"Large section heading",command:"heading1",keywords:["title","header","h1"]},{id:"h2",label:"Heading 2",description:"Medium section heading",command:"heading2",keywords:["subtitle","header","h2"]},{id:"h3",label:"Heading 3",description:"Small section heading",command:"heading3",keywords:["header","h3"]},{id:"bulleted-list",label:"Bulleted List",description:"Create a bullet list",command:"toggleBulletList",keywords:["list","ul","bullet"]},{id:"numbered-list",label:"Numbered List",description:"Create a numbered list",command:"toggleOrderedList",keywords:["list","ol","numbered"]},{id:"blockquote",label:"Blockquote",description:"Insert a quote block",command:"toggleBlockquote",keywords:["quote","citation"]},{id:"table-3x3",label:"Table 3x3",description:"Insert a 3 x 3 table",action:({insertHTML:e})=>e(F0(3,3)),keywords:["table","grid","rows","columns"]},{id:"horizontal-rule",label:"Divider",description:"Insert a horizontal rule",command:"insertHorizontalRule",keywords:["hr","separator","line"]},{id:"bold",label:"Bold",description:"Toggle bold formatting",command:"toggleBold",keywords:["strong","b"]},{id:"italic",label:"Italic",description:"Toggle italic formatting",command:"toggleItalic",keywords:["emphasis","i"]},{id:"underline",label:"Underline",description:"Toggle underline formatting",command:"toggleUnderline",keywords:["u"]},{id:"strikethrough",label:"Strikethrough",description:"Toggle strikethrough formatting",command:"toggleStrikethrough",keywords:["strike","s"]},{id:"clear-formatting",label:"Clear Formatting",description:"Remove text formatting",command:"clearFormatting",keywords:["reset","plain"]}]}function V0(e){const t=[],r=new Set;return e.forEach(n=>{const o=String(n.id||"").trim(),a=String(n.label||"").trim();!o||!a||r.has(o)||(r.add(o),t.push({...n,id:o,label:a,description:n.description?String(n.description):void 0,keywords:Array.isArray(n.keywords)?n.keywords.map(i=>String(i)).filter(Boolean):void 0}))}),t}function K0(e){const t=(e.triggerChar||"/")[0]||"/",r=e.includeDefaultItems!==!1,n=r?[...e.items||[],...j0()]:e.items||[];return{triggerChar:t,minChars:Math.max(0,e.minChars??0),maxQueryLength:Math.max(1,e.maxQueryLength??48),maxSuggestions:Math.max(1,e.maxSuggestions??10),requireBoundary:e.requireBoundary!==!1,includeDefaultItems:r,items:V0(n),itemRenderer:e.itemRenderer||(o=>o.label),emptyStateText:e.emptyStateText||"No commands found",panelLabel:e.panelLabel||"Slash commands"}}const Nr='[data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark';let td=!1;function W0(){if(td||typeof document>"u")return;td=!0;const e=document.createElement("style");e.id="rte-slash-commands-styles",e.textContent=`
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

    ${Nr} .rte-slash-panel {
      border-color: #364152;
      background: #1f2937;
      box-shadow: 0 22px 44px rgba(0, 0, 0, 0.48);
    }

    ${Nr} .rte-slash-item {
      color: #e5e7eb;
    }

    ${Nr} .rte-slash-item:hover,
    ${Nr} .rte-slash-item.active {
      background: #334155;
      color: #bfdbfe;
    }

    ${Nr} .rte-slash-item-description,
    ${Nr} .rte-slash-empty {
      color: #9ca3af;
    }
  `,document.head.appendChild(e)}const $t=".rte-content, .editora-content",ra=new WeakMap,Ni=new WeakMap;let Bi=!1,Do=null,ja=0,U0=0;function G0(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function am(e){return e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||e}function Z0(e){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const n=e.editorElement;if(n.matches($t))return n;const o=n.querySelector($t);if(o instanceof HTMLElement)return o}const t=window.getSelection();if(t&&t.rangeCount>0){const n=t.getRangeAt(0).startContainer,o=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement,a=o==null?void 0:o.closest($t);if(a)return a}const r=document.activeElement;if(r){if(r.matches($t))return r;const n=r.closest($t);if(n)return n}return document.querySelector($t)}function Un(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Y0(e){return e?/\s|[([{"'`]/.test(e):!0}function Ks(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);return e.contains(r.commonAncestorContainer)?r.cloneRange():null}function al(e,t){const r=window.getSelection();r&&(r.removeAllRanges(),r.addRange(t),e.focus({preventScroll:!0}))}function X0(e){if(!e.collapsed)return null;const t=e.startContainer,r=e.startOffset;if(t.nodeType===Node.TEXT_NODE){const n=t;return{node:n,textBefore:n.data.slice(0,r),caretOffset:r}}if(t.nodeType===Node.ELEMENT_NODE){const n=t;if(r>0){const o=n.childNodes[r-1];if(o&&o.nodeType===Node.TEXT_NODE){const a=o;return{node:a,textBefore:a.data,caretOffset:a.length}}}}return null}function J0(e,t,r,n){const o=e.lastIndexOf(t);if(o<0||n&&!Y0(e[o-1]))return null;const a=e.slice(o+1);return/\s/.test(a)||a.length>r?null:{trigger:t,query:a,startOffset:o}}function Q0(e,t){const r=t.cloneRange();r.collapse(!1);const n=r.getClientRects();if(n.length>0)return n[n.length-1];const o=document.createElement("span");o.textContent="​",r.insertNode(o);const a=o.getBoundingClientRect();return o.remove(),e.normalize(),a}function im(e,t){if(!e.panel)return;const r=Q0(e.editor,t),n=e.panel;n.style.display="block",n.classList.add("show"),n.style.left="0px",n.style.top="0px";const o=n.getBoundingClientRect(),a=window.innerWidth,i=window.innerHeight;let l=Math.max(8,Math.min(r.left,a-o.width-8)),s=r.bottom+8;s+o.height>i-8&&(s=Math.max(8,r.top-o.height-8)),n.style.position="fixed",n.style.left=`${l}px`,n.style.top=`${s}px`}function rd(e,t){if(!t)return Un(e);const r=e.toLowerCase(),n=t.toLowerCase(),o=r.indexOf(n);if(o<0)return Un(e);const a=Un(e.slice(0,o)),i=Un(e.slice(o,o+t.length)),l=Un(e.slice(o+t.length));return`${a}<mark>${i}</mark>${l}`}function e1(e,t){if(e.panel&&e.list)return;const r=document.createElement("div");r.className="rte-slash-panel",r.style.display="none",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","false");const n=document.createElement("div");n.className="rte-slash-list",n.setAttribute("role","listbox"),n.setAttribute("aria-label",t.panelLabel),r.appendChild(n),document.body.appendChild(r),e.panel=r,e.list=n,r.addEventListener("mousedown",o=>{o.preventDefault()}),r.addEventListener("click",o=>{const a=o.target;if(!a)return;const i=a.closest(".rte-slash-item");if(!i)return;const l=Number(i.getAttribute("data-index"));Number.isFinite(l)&&lm(e,l)})}function De(e){e.panel&&(e.panel.style.display="none",e.panel.classList.remove("show"),e.isOpen=!1,e.filteredItems=[],e.activeIndex=0,e.query="",e.replaceRange=null,e.anchorRange=null)}function t1(e,t,r){if(!t)return e.slice(0,r);const n=t.toLowerCase();return e.filter(a=>[a.id,a.label,a.description||"",a.command||"",...a.keywords||[]].join(" ").toLowerCase().includes(n)).slice(0,r)}function r1(e,t){if(!e.list)return;const r=e.list;if(r.innerHTML="",e.filteredItems.length===0){const n=document.createElement("div");n.className="rte-slash-empty",n.textContent=t.emptyStateText,r.appendChild(n),r.removeAttribute("aria-activedescendant");return}e.filteredItems.forEach((n,o)=>{const a=document.createElement("button");a.type="button",a.className="rte-slash-item",a.setAttribute("role","option"),a.setAttribute("data-index",String(o)),a.setAttribute("id",`rte-slash-item-${e.instanceId}-${o}`),a.setAttribute("aria-selected",o===e.activeIndex?"true":"false"),a.setAttribute("aria-label",n.description?`${n.label} - ${n.description}`:n.label),o===e.activeIndex&&a.classList.add("active"),t.itemRenderer?a.innerHTML=t.itemRenderer(n,e.query):a.innerHTML=`
        <span class="rte-slash-item-title">${rd(n.label,e.query)}</span>
        ${n.description?`<span class="rte-slash-item-description">${rd(n.description,e.query)}</span>`:""}
      `,r.appendChild(a)}),e.filteredItems.length>0&&r.setAttribute("aria-activedescendant",`rte-slash-item-${e.instanceId}-${e.activeIndex}`)}function n1(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function o1(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function nd(e,t){e.focus({preventScroll:!0});try{if(document.execCommand("insertHTML",!1,t))return!0}catch{}const r=window.getSelection();if(!r||r.rangeCount===0)return!1;const n=r.getRangeAt(0);if(!e.contains(n.commonAncestorContainer))return!1;n.deleteContents();const o=document.createElement("template");o.innerHTML=t;const a=o.content,i=a.lastChild;if(n.insertNode(a),i){const l=document.createRange();l.setStartAfter(i),l.collapse(!0),al(e,l)}return!0}function a1(e,t){e.focus({preventScroll:!0});try{if(document.execCommand("insertText",!1,t))return!0}catch{}const r=window.getSelection();if(!r||r.rangeCount===0)return!1;const n=r.getRangeAt(0);if(!e.contains(n.commonAncestorContainer))return!1;n.deleteContents();const o=document.createTextNode(t);n.insertNode(o);const a=document.createRange();return a.setStart(o,o.length),a.collapse(!0),al(e,a),!0}function i1(e,t){switch(e.toLowerCase()){case"paragraph":case"p":return document.execCommand("formatBlock",!1,"<p>");case"heading1":case"h1":return document.execCommand("formatBlock",!1,"<h1>");case"heading2":case"h2":return document.execCommand("formatBlock",!1,"<h2>");case"heading3":case"h3":return document.execCommand("formatBlock",!1,"<h3>");case"blockquote":case"toggleblockquote":return document.execCommand("formatBlock",!1,"<blockquote>");case"bulletlist":case"togglebulletlist":case"insertunorderedlist":return document.execCommand("insertUnorderedList");case"numberedlist":case"toggleorderedlist":case"insertorderedlist":return document.execCommand("insertOrderedList");case"horizontalrule":case"divider":case"inserthorizontalrule":return document.execCommand("insertHorizontalRule");case"bold":case"togglebold":return document.execCommand("bold");case"italic":case"toggleitalic":return document.execCommand("italic");case"underline":case"toggleunderline":return document.execCommand("underline");case"strikethrough":case"togglestrikethrough":return document.execCommand("strikeThrough");case"clearformatting":case"removeformat":return document.execCommand("removeFormat");default:try{return document.execCommand(e,!1,t)}catch{return!1}}}function od(e,t,r){const n=am(e);if(n&&typeof n.execCommand=="function")try{if(n.execCommand(t,r)!==!1)return!0}catch{}const o=window.execEditorCommand||window.executeEditorCommand;if(typeof o=="function")try{if(o(t,r,{editorElement:n,contentElement:e})!==!1)return!0}catch{}return i1(t,r)}async function l1(e,t){const r=e.editor,n=am(r),o={editor:r,editorRoot:n,query:e.query,trigger:e.trigger,executeCommand:(a,i)=>od(r,a,i),insertHTML:a=>nd(r,a)};return t.action?await Promise.resolve(t.action(o))!==!1:t.insertHTML?nd(r,t.insertHTML):t.command?od(r,t.command,t.commandValue):!1}async function lm(e,t){if(t<0||t>=e.filteredItems.length||!e.replaceRange)return;const r=e.filteredItems[t],n=e.editor,o=n.innerHTML,a=`${e.trigger}${e.query}`;if(!window.getSelection())return;const l=e.replaceRange.cloneRange();if(!n.contains(l.commonAncestorContainer))return;l.deleteContents();const s=l.cloneRange();s.collapse(!0),al(n,s);let c=!1;try{c=await l1(e,r)}catch{c=!1}De(e),c?(o1(n),n1(n,o)):a&&a1(n,a),n.focus({preventScroll:!0})}function ad(e,t){if(e.filteredItems.length===0)return;const r=e.filteredItems.length;if(e.activeIndex=((e.activeIndex+t)%r+r)%r,!e.list)return;const n=Array.from(e.list.querySelectorAll(".rte-slash-item"));n.forEach((a,i)=>{const l=i===e.activeIndex;a.classList.toggle("active",l),a.setAttribute("aria-selected",l?"true":"false")});const o=n[e.activeIndex];o&&(e.list.setAttribute("aria-activedescendant",o.id),o.scrollIntoView({block:"nearest"}))}function id(e){if(!(!e.isOpen||!e.panel||!e.anchorRange)){if(!e.editor.isConnected){De(e);return}im(e,e.anchorRange)}}function sm(e,t,r,n,o,a){e1(e,t),e.query=n,e.trigger=o,e.replaceRange=a.cloneRange(),e.anchorRange=r.cloneRange(),e.filteredItems=t1(e.items,n,t.maxSuggestions),e.activeIndex=0,e.isOpen=!0,e.panel&&(r1(e,t),im(e,r))}function s1(e,t){const r=e.editor;if(r.getAttribute("contenteditable")==="false"){De(e);return}const n=Ks(r);if(!n||!n.collapsed){De(e);return}const o=X0(n);if(!o){De(e);return}const a=J0(o.textBefore,t.triggerChar,t.maxQueryLength,t.requireBoundary);if(!a){De(e);return}if(a.query.length<t.minChars){De(e);return}const i=n.cloneRange();i.setStart(o.node,a.startOffset),i.setEnd(o.node,o.caretOffset),sm(e,t,n,a.query,a.trigger,i)}function cm(e,t){const r=e.editor;if(r.getAttribute("contenteditable")==="false")return!1;let n=Ks(r);n||(n=document.createRange(),n.selectNodeContents(r),n.collapse(!1),al(r,n));const o=n.cloneRange();return o.collapse(!0),sm(e,t,n,"",t.triggerChar,o),!0}function c1(e){return!(e.metaKey||e.ctrlKey)||e.altKey?!1:e.key==="/"||e.code==="Slash"}function d1(e,t){return{editor:e,panel:null,list:null,replaceRange:null,items:t.items,filteredItems:[],activeIndex:0,query:"",trigger:t.triggerChar,isOpen:!1,instanceId:++U0,anchorRange:null}}function os(e,t){const r=ra.get(e);if(r)return r.items=t.items,r;const n=d1(e,t);return ra.set(e,n),n}function u1(e){var r;const t=ra.get(e);t&&((r=t.panel)!=null&&r.parentNode&&t.panel.parentNode.removeChild(t.panel),ra.delete(e))}function as(e,t,r){if(Ni.has(e))return;const n={input:()=>{s1(t,r)},keydown:o=>{if(t.editor.getAttribute("contenteditable")==="false"){De(t);return}if(!t.isOpen&&c1(o)){o.preventDefault(),cm(t,r);return}if(t.isOpen){if(o.key==="ArrowDown"){o.preventDefault(),ad(t,1);return}if(o.key==="ArrowUp"){o.preventDefault(),ad(t,-1);return}if(o.key==="Enter"||o.key==="Tab"){if(t.filteredItems.length===0){o.key==="Tab"&&o.preventDefault(),De(t);return}o.preventDefault(),lm(t,t.activeIndex);return}if(o.key==="Escape"){o.preventDefault(),De(t);return}}},blur:()=>{window.setTimeout(()=>{const o=document.activeElement;t.panel&&o&&t.panel.contains(o)||De(t)},0)},mousedown:o=>{if(!t.isOpen||!t.panel)return;const a=o.target;a&&!t.panel.contains(a)&&!e.contains(a)&&De(t)},selectionchange:()=>{if(!t.isOpen)return;const o=Ks(e);if(!o||!o.collapsed){De(t);return}t.anchorRange=o.cloneRange(),id(t)},reposition:()=>{id(t)}};e.addEventListener("input",n.input),e.addEventListener("keydown",n.keydown),e.addEventListener("blur",n.blur),document.addEventListener("mousedown",n.mousedown,!0),document.addEventListener("selectionchange",n.selectionchange),window.addEventListener("resize",n.reposition,{passive:!0}),window.addEventListener("scroll",n.reposition,!0),Ni.set(e,n)}function f1(e){const t=Ni.get(e);t&&(e.removeEventListener("input",t.input),e.removeEventListener("keydown",t.keydown),e.removeEventListener("blur",t.blur),document.removeEventListener("mousedown",t.mousedown,!0),document.removeEventListener("selectionchange",t.selectionchange),window.removeEventListener("resize",t.reposition),window.removeEventListener("scroll",t.reposition,!0),Ni.delete(e))}function p1(e){Bi||(Bi=!0,Do=t=>{const r=t.target;if(!(r instanceof Node))return;const n=G0(r),o=(n==null?void 0:n.closest($t))||null;if(!o)return;const a=os(o,e);as(o,a,e)},document.addEventListener("focusin",Do,!0))}function m1(){!Bi||!Do||(document.removeEventListener("focusin",Do,!0),Bi=!1,Do=null)}const g1=(e={})=>{W0();const t=K0(e);return{name:"slashCommands",toolbar:[{id:"slashCommands",label:"Slash Commands",command:"openSlashCommands",icon:'<svg width="24" height="24" focusable="false" aria-hidden="true"><path d="M8.7 20a1 1 0 0 1-.7-.3c-.4-.4-.4-1 0-1.4L15.6 5a1 1 0 0 1 1.4 1.4L9.4 19.7a1 1 0 0 1-.7.3Zm7.8 0c-.3 0-.5 0-.7-.3l-1.8-1.8a1 1 0 1 1 1.4-1.4l1.8 1.8a1 1 0 0 1-.7 1.7Zm-9-12a1 1 0 0 1-.7-1.7L8.6 4.5A1 1 0 1 1 10 6L8.2 7.8a1 1 0 0 1-.7.3Z"></path></svg>'}],commands:{openSlashCommands:(r,n)=>{const o=Z0(n);if(!o)return!1;const a=os(o,t);return as(o,a,t),cm(a,t)}},keymap:{"Mod-/":"openSlashCommands","Mod-Shift-7":"openSlashCommands"},init:()=>{ja+=1,p1(t),Array.from(document.querySelectorAll($t)).forEach(n=>{const o=os(n,t);as(n,o,t)})},destroy:()=>{ja=Math.max(0,ja-1),Array.from(document.querySelectorAll($t)).forEach(n=>{const o=ra.get(n);o&&(De(o),f1(n),u1(n))}),ja===0&&m1()}}},b1=()=>({name:"document-manager",toolbar:[{label:"Import Word",command:"importWord",icon:'<svg width="24" height="24" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3h7.4L19 7.6V15h-2V9h-4V5H5c0-1.1.9-2 2-2Z"></path><path d="M9.5 7A1.5 1.5 0 0 1 11 8.4v7.1A1.5 1.5 0 0 1 9.6 17H2.5A1.5 1.5 0 0 1 1 15.6V8.5A1.5 1.5 0 0 1 2.4 7h7.1Zm-1 2.8-1 2.6-1-2.5v-.1a.6.6 0 0 0-1 0l-.1.1-.9 2.5-1-2.5v-.1a.6.6 0 0 0-1 .4v.1l1.5 4v.1a.6.6 0 0 0 1 0v-.1l1-2.5.9 2.5v.1a.6.6 0 0 0 1 0H8l1.6-4v-.2a.6.6 0 0 0-1.1-.4Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11.4 18.2a1 1 0 0 0 1.2 1.6l1.4-1V22a1 1 0 1 0 2 0v-3.1l1.4 1a1 1 0 0 0 1.2-1.7L15 15.8l-3.6 2.4Z"></path></svg>',type:"button"},{label:"Export Word",command:"exportWord",icon:'<svg width="24" height="24" focusable="false"><path d="M9.5 7A1.5 1.5 0 0 1 11 8.4v7.1A1.5 1.5 0 0 1 9.6 17H2.5A1.5 1.5 0 0 1 1 15.6V8.5A1.5 1.5 0 0 1 2.4 7h7.1Zm-1 2.8-1 2.6-1-2.5v-.1a.6.6 0 0 0-1 0l-.1.1-.9 2.5-1-2.5v-.1a.6.6 0 0 0-1 .4v.1l1.5 4v.1a.6.6 0 0 0 1 0v-.1l1-2.5.9 2.5v.1a.6.6 0 0 0 1 0H8l1.6-4v-.2a.6.6 0 0 0-1.1-.4Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3h7.4L19 7.6V17h-2V9h-4V5H7v3H5V5c0-1.1.9-2 2-2ZM15 17a1 1 0 1 0-2 0v3.1l-1.4-1a1 1 0 1 0-1.2 1.7l3.6 2.4 3.6-2.4a1 1 0 0 0-1.2-1.6l-1.4 1V17Z"></path></svg>',type:"button"},{label:"Export PDF",command:"exportPdf",icon:'<svg width="24" height="24" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3h7.4L19 7.6V17h-2V9h-4V5H7v3H5V5c0-1.1.9-2 2-2Z"></path><path d="M2.6 15.2v-1.9h1c.6 0 1-.2 1.4-.5.3-.3.5-.7.5-1.2s-.2-.9-.5-1.2a2 2 0 0 0-1.3-.4H1v5.2h1.6Zm.4-3h-.4v-1.1h.5l.6.1.2.5c0 .1 0 .3-.2.4l-.7.1Zm5.7 3 1-.1c.3 0 .5-.2.7-.4l.5-.8c.2-.3.2-.7.2-1.3v-1l-.5-.8c-.2-.3-.4-.5-.7-.6L8.7 10H6.3v5.2h2.4Zm-.4-1.1H8v-3h.4c.5 0 .8.2 1 .4l.2 1.1-.1 1-.3.3-.8.2Zm5.3 1.2V13h2v-1h-2v-1H16V10h-4v5.2h1.6Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M15 17a1 1 0 1 0-2 0v3.1l-1.4-1a1 1 0 1 0-1.2 1.7l3.6 2.4 3.6-2.4a1 1 0 0 0-1.2-1.6l-1.4 1V17Z"></path></svg>',type:"button"}],commands:{importWord:()=>{const e=()=>{const r=window.getSelection();if(r&&r.rangeCount>0){let a=r.getRangeAt(0).startContainer;for(;a&&a!==document.body;){if(a.nodeType===Node.ELEMENT_NODE){const i=a;if(i.getAttribute("contenteditable")==="true")return i}a=a.parentNode}}const n=document.activeElement;if((n==null?void 0:n.getAttribute("contenteditable"))==="true")return n;const o=n==null?void 0:n.closest('[contenteditable="true"]');return o||document.querySelector('[contenteditable="true"]')},t=document.createElement("input");return t.type="file",t.accept=".docx",t.onchange=async r=>{var o;const n=(o=r.target.files)==null?void 0:o[0];if(n)try{const a=e();if(a){const{importFromWord:i}=await fl(()=>import("./documentManager-011c782c.js"),["./documentManager-011c782c.js","./iframe-4322e920.js"],import.meta.url),l=await i(n);a.innerHTML=l,a.dispatchEvent(new Event("input",{bubbles:!0}))}}catch(a){console.error("Import failed:",a),alert("Failed to import Word document. Please check the console for details.")}},t.click(),!0},exportWord:async()=>{const e=()=>{const t=window.getSelection();if(t&&t.rangeCount>0){let o=t.getRangeAt(0).startContainer;for(;o&&o!==document.body;){if(o.nodeType===Node.ELEMENT_NODE&&o.getAttribute("contenteditable")==="true")return o;o=o.parentNode}}const r=document.activeElement;return(r==null?void 0:r.getAttribute("contenteditable"))==="true"?r:(r==null?void 0:r.closest('[contenteditable="true"]'))||document.querySelector('[contenteditable="true"]')};try{const t=e();if(t){const r=t.innerHTML,{exportToWord:n}=await fl(()=>import("./documentManager-011c782c.js"),["./documentManager-011c782c.js","./iframe-4322e920.js"],import.meta.url);await n(r,"document.docx")}return!0}catch(t){return console.error("Export failed:",t),alert("Failed to export to Word. Please check the console for details."),!1}},exportPdf:async()=>{const e=()=>{const t=window.getSelection();if(t&&t.rangeCount>0){let o=t.getRangeAt(0).startContainer;for(;o&&o!==document.body;){if(o.nodeType===Node.ELEMENT_NODE&&o.getAttribute("contenteditable")==="true")return o;o=o.parentNode}}const r=document.activeElement;return(r==null?void 0:r.getAttribute("contenteditable"))==="true"?r:(r==null?void 0:r.closest('[contenteditable="true"]'))||document.querySelector('[contenteditable="true"]')};try{const t=e();if(t){const r=t.innerHTML,{exportToPdf:n}=await fl(()=>import("./documentManager-011c782c.js"),["./documentManager-011c782c.js","./iframe-4322e920.js"],import.meta.url);await n(r,"document.pdf",t)}else console.error("PDF Export: No editor element found"),alert("No active editor found. Please click in the editor area first.");return!0}catch(t){return console.error("PDF Export: Export failed:",t),alert("Failed to export to PDF. Please check the console for details."),!1}}},keymap:{}});let Ll=!1;const h1=()=>{if(typeof document>"u")return;const e="rte-preview-plugin-styles";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
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
  `,document.head.appendChild(t)},y1=()=>{const e=window.getSelection();if(e&&e.rangeCount>0){let r=e.getRangeAt(0).startContainer;for(;r&&r!==document.body;){if(r.nodeType===Node.ELEMENT_NODE){const n=r;if(n.getAttribute("contenteditable")==="true")return n}r=r.parentNode}}const t=document.activeElement;if(t){if(t.getAttribute("contenteditable")==="true")return t;const r=t.closest('[contenteditable="true"]');if(r)return r}return document.querySelector('[contenteditable="true"]')},x1=()=>{const e=y1();if(!e)return"";const t=e.cloneNode(!0);return[".rte-floating-toolbar",".rte-selection-marker",".rte-toolbar",".rte-resize-handle","[data-rte-internal]"].forEach(n=>{t.querySelectorAll(n).forEach(o=>o.remove())}),t.innerHTML},v1=e=>{const t=document.createElement("div");return t.innerHTML=e,t.querySelectorAll('script, iframe[src^="javascript:"], object, embed, form[action^="javascript:"]').forEach(o=>o.remove()),t.querySelectorAll("*").forEach(o=>{Array.from(o.attributes).forEach(a=>{a.name.startsWith("on")&&o.removeAttribute(a.name),(a.name==="href"||a.name==="src")&&a.value.startsWith("javascript:")&&o.removeAttribute(a.name),a.name.toLowerCase()==="contenteditable"&&o.removeAttribute(a.name)}),o.setAttribute("contenteditable","false")}),t.innerHTML},k1=()=>{if(typeof window>"u"||Ll)return;Ll=!0,h1();const e=x1(),t=v1(e),r=document.createElement("div");r.className="rte-preview-editor-overlay",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.setAttribute("aria-labelledby","preview-editor-title");const n=document.createElement("div");n.className="rte-preview-editor-modal";const o=document.createElement("div");o.className="rte-preview-editor-header",o.innerHTML=`
    <h2 id="preview-editor-title">Preview Editor</h2>
    <div class="rte-preview-editor-header-actions">
      <button class="rte-preview-editor-close-btn" aria-label="Close preview editor">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  `;const a=document.createElement("div");a.className="rte-preview-editor-body";const i=document.createElement("div");i.className="rte-preview-editor-content";const l=document.createElement("div");l.className="rte-preview-editor-light-editor",l.innerHTML=t,i.appendChild(l),a.appendChild(i),n.appendChild(o),n.appendChild(a),r.appendChild(n);const s=()=>{r.parentNode&&r.parentNode.removeChild(r),Ll=!1,document.removeEventListener("keydown",c)},c=u=>{u.key==="Escape"&&(u.preventDefault(),u.stopPropagation(),s())},d=o.querySelector(".rte-preview-editor-close-btn");d&&d.addEventListener("click",u=>{u.preventDefault(),u.stopPropagation(),s()}),r.addEventListener("click",u=>{u.target===r&&s()}),document.addEventListener("keydown",c),document.body.appendChild(r)},w1=()=>({name:"preview",toolbar:[{label:"Preview",command:"togglePreview",icon:'<svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 92 92" enable-background="new 0 0 92 92" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_1239_" d="M91.3,43.8C90.6,42.8,74.4,19,46,19C17.6,19,1.4,42.8,0.7,43.8c-0.9,1.3-0.9,3.1,0,4.5 C1.4,49.2,17.6,73,46,73c28.4,0,44.6-23.8,45.3-24.8C92.2,46.9,92.2,45.1,91.3,43.8z M46,65C26.7,65,13.5,51.4,9,46 c4.5-5.5,17.6-19,37-19c19.3,0,32.5,13.6,37,19C78.4,51.5,65.3,65,46,65z M48.3,29.6c-4.4-0.6-8.7,0.5-12.3,3.2c0,0,0,0,0,0 c-7.3,5.5-8.8,15.9-3.3,23.2c2.7,3.6,6.5,5.8,10.9,6.5c0.8,0.1,1.6,0.2,2.3,0.2c3.6,0,7-1.2,9.9-3.3c7.3-5.5,8.8-15.9,3.3-23.2 C56.6,32.5,52.7,30.2,48.3,29.6z M52.3,54.5c-2.2,1.7-5,2.4-7.8,2c-2.8-0.4-5.3-1.9-7-4.1C34.1,47.7,35,41,39.7,37.5 c2.2-1.7,5-2.4,7.8-2c2.8,0.4,5.3,1.9,7,4.1C57.9,44.3,57,51,52.3,54.5z M51.9,40c0.8,0.7,1.2,1.8,1.2,2.8c0,1-0.4,2.1-1.2,2.8 c-0.7,0.7-1.8,1.2-2.8,1.2c-1.1,0-2.1-0.4-2.8-1.2c-0.8-0.8-1.2-1.8-1.2-2.8c0-1.1,0.4-2.1,1.2-2.8c0.7-0.8,1.8-1.2,2.8-1.2 C50.2,38.9,51.2,39.3,51.9,40z"></path> </g></svg>'}],commands:{togglePreview:()=>(k1(),!0)},keymap:{}}),E1=()=>`
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
  `,ld=()=>{var l;if(typeof window>"u")return!1;const t=(()=>{const s=window.getSelection();if(s&&s.rangeCount>0){let d=s.getRangeAt(0).startContainer;for(;d&&d!==document.body;){if(d.nodeType===Node.ELEMENT_NODE){const u=d;if(u.getAttribute("contenteditable")==="true")return u}d=d.parentNode}}const c=document.activeElement;if(c){if(c.getAttribute("contenteditable")==="true")return c;const d=c.closest('[contenteditable="true"]');if(d)return d}return document.querySelector('[contenteditable="true"]')})();if(!t)return console.warn("Editor content not found"),!1;const r=t.cloneNode(!0),n=document.createElement("article");n.className="rte-document rte-print",n.appendChild(r);const o=`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Print Document</title>
        <style>${E1()}</style>
      </head>
      <body>
        ${n.outerHTML}
      </body>
    </html>
  `,a=document.createElement("iframe");a.style.position="absolute",a.style.left="-9999px",a.style.top="-9999px",a.style.width="0",a.style.height="0",document.body.appendChild(a);const i=a.contentDocument||((l=a.contentWindow)==null?void 0:l.document);return i?(i.open(),i.write(o),i.close(),setTimeout(()=>{a.contentWindow&&(a.contentWindow.print(),setTimeout(()=>{document.body.removeChild(a)},100))},250),!0):(console.error("Could not access print frame document"),document.body.removeChild(a),!1)},C1=()=>({name:"print",toolbar:[{label:"Print",command:"print",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M7 9V4h10v5M6 18h12v-4H6v4Zm0 0v2h12v-2M6 9H5a2 2 0 0 0-2 2v3h3m12-5h1a2 2 0 0 1 2 2v3h-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',shortcut:"Mod-p"}],commands:{print:ld},keymap:{"Mod-p":()=>(ld(),!0)}}),Mr='.rte-page-break[data-type="page-break"]',Pi=".rte-content, .editora-content";let Va=null,sd=!1;const dm=(e,t)=>{if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}},S1=new Set(["DIV","P","BLOCKQUOTE","PRE","H1","H2","H3","H4","H5","H6","LI","TD","TH"]),T1=()=>{Va||typeof document>"u"||(Va=document.createElement("style"),Va.textContent=`
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
  `,document.head.appendChild(Va))},L1=()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return null;const t=e.getRangeAt(0),r=t.startContainer.nodeType===Node.ELEMENT_NODE?t.startContainer:t.startContainer.parentElement;return(r==null?void 0:r.closest(Pi))||null},um=()=>{const e=L1();if(e)return e;const t=document.activeElement,r=t==null?void 0:t.closest(Pi);return r||document.querySelector(Pi)},cd=(e,t)=>{let r=e;for(;r&&r!==t;){if(r.nodeType===Node.ELEMENT_NODE){const n=r;if(S1.has(n.tagName))return n}r=r.parentNode}return null},$1=()=>{const e=document.createElement("div");return e.className="rte-page-break",e.setAttribute("data-page-break","true"),e.setAttribute("data-type","page-break"),e.setAttribute("contenteditable","false"),e.setAttribute("tabindex","0"),e.setAttribute("role","separator"),e.setAttribute("aria-label","Page break"),e},A1=e=>{let t=e.nextElementSibling;for(;t&&t.matches(Mr);){const n=t;t=t.nextElementSibling,n.remove()}let r=e.previousElementSibling;for(;r&&r.matches(Mr);){const n=r;r=r.previousElementSibling,n.remove()}},fm=e=>{var n;const t=e.nextElementSibling;if(t&&!t.matches(Mr))return t;const r=document.createElement("p");return r.innerHTML="<br>",(n=e.parentNode)==null||n.insertBefore(r,e.nextSibling),r},yr=e=>{const t=window.getSelection();if(!t)return;const r=document.createRange();e.nodeType,Node.TEXT_NODE,r.setStart(e,0),r.collapse(!0),t.removeAllRanges(),t.addRange(r)},is=e=>{const t=window.getSelection();if(!t)return;const r=document.createRange();if(e.nodeType===Node.TEXT_NODE){const n=e;r.setStart(n,n.data.length)}else r.selectNodeContents(e),r.collapse(!1);t.removeAllRanges(),t.addRange(r)},Ii=(e,t)=>{let r=e;for(;r;){if(!(r instanceof HTMLElement&&r.matches(Mr)))return r;r=t==="previous"?r.previousSibling:r.nextSibling}return null},M1=e=>{const t=window.getSelection();if(!t||!e.parentNode)return;const r=e.parentNode,n=Array.from(r.childNodes).indexOf(e);if(n<0)return;const o=document.createRange();o.setStart(r,n),o.setEnd(r,n+1),t.removeAllRanges(),t.addRange(o),e.focus({preventScroll:!0})},R1=e=>{if(e.collapsed||e.startContainer!==e.endContainer||e.endOffset!==e.startOffset+1||!(e.startContainer instanceof Element||e.startContainer instanceof DocumentFragment))return null;const t=e.startContainer.childNodes[e.startOffset];return t instanceof HTMLElement&&t.matches(Mr)?t:null},D1=(e,t,r)=>{if(!e.collapsed)return null;const{startContainer:n,startOffset:o}=e,a=l=>l instanceof HTMLElement&&l.matches(Mr)?l:null,i=l=>{if(n.nodeType===Node.ELEMENT_NODE){const c=n;if(l==="previous"){if(o>0)return c.childNodes[o-1]||null}else if(o<c.childNodes.length)return c.childNodes[o]||null}if(n.nodeType===Node.TEXT_NODE&&(l==="previous"&&o<n.data.length||l==="next"&&o>0))return null;let s=n;for(;s&&s!==t;){const c=l==="previous"?s.previousSibling:s.nextSibling;if(c)return c;s=s.parentNode}return null};if(n.nodeType===Node.ELEMENT_NODE){const l=n;return r==="Backspace"&&o>0?a(l.childNodes[o-1]||null):r==="Delete"?a(l.childNodes[o]||null):null}if(n.nodeType===Node.TEXT_NODE){const l=n;if(r==="Backspace"&&o===0){const s=a(l.previousSibling);return s||a(i("previous"))}if(r==="Delete"&&o===l.data.length){const s=a(l.nextSibling);return s||a(i("next"))}}return a(i(r==="Backspace"?"previous":"next"))},dd=(e,t)=>{const r=e.closest(Pi),n=(r==null?void 0:r.innerHTML)??"",o=e.previousSibling,a=e.nextSibling;e.remove();const i=Ii(o,"previous"),l=Ii(a,"next");if(t==="Backspace"){if(i)is(i);else if(l)yr(l);else if(r){const s=document.createElement("p");s.innerHTML="<br>",r.appendChild(s),yr(s)}}else if(l)yr(l);else if(i)is(i);else if(r){const s=document.createElement("p");s.innerHTML="<br>",r.appendChild(s),yr(s)}return r&&(dm(r,n),r.dispatchEvent(new Event("input",{bubbles:!0}))),!0},N1=()=>{const e=um();if(!e)return!1;const t=e.innerHTML,r=window.getSelection();if(!r)return!1;let n;r.rangeCount>0&&e.contains(r.getRangeAt(0).commonAncestorContainer)?n=r.getRangeAt(0):(n=document.createRange(),n.selectNodeContents(e),n.collapse(!1),r.removeAllRanges(),r.addRange(n));const o=cd(n.endContainer,e)||cd(n.startContainer,e),a=$1();o&&o.parentNode?o.parentNode.insertBefore(a,o.nextSibling):e.appendChild(a),A1(a);const i=fm(a);return yr(i),dm(e,t),e.dispatchEvent(new Event("input",{bubbles:!0})),!0},B1=()=>{sd||typeof document>"u"||(sd=!0,document.addEventListener("click",e=>{const t=e.target,r=t==null?void 0:t.closest(Mr);r&&(e.preventDefault(),e.stopPropagation(),M1(r))}),document.addEventListener("keydown",e=>{const t=e.key;if(!["Backspace","Delete","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(t))return;const r=window.getSelection();if(!r||r.rangeCount===0)return;const n=r.getRangeAt(0),o=um();if(!o||!o.contains(n.commonAncestorContainer))return;const a=R1(n);if(a){if(t==="Backspace"||t==="Delete"){e.preventDefault(),e.stopPropagation(),dd(a,t);return}if(t==="ArrowRight"||t==="ArrowDown"){e.preventDefault();const i=Ii(a.nextSibling,"next")||fm(a);yr(i);return}if(t==="ArrowLeft"||t==="ArrowUp"){e.preventDefault();const i=Ii(a.previousSibling,"previous");i?is(i):yr(o);return}}if(t==="Backspace"||t==="Delete"){const i=D1(n,o,t);if(!i)return;e.preventDefault(),e.stopPropagation(),dd(i,t)}}))},P1=()=>(T1(),B1(),{name:"pageBreak",toolbar:[{label:"Page Break",command:"insertPageBreak",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M5 5H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M5 9H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M5 15H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-dasharray="3.2 3.2"/><path d="M5 19H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',shortcut:"Mod-Enter"}],commands:{insertPageBreak:N1},keymap:{"Mod-Enter":"insertPageBreak"}}),pm=".rte-content, .editora-content",Ws='.rte-footnotes[data-type="footnotes"]',ba=".rte-footnote-ref[data-footnote-id]",Hi='li.rte-footnote-item[data-type="footnote"]',ud="__editoraCommandEditorRoot";let fd=!1,pd=!1,md=0;function I1(){if(fd||typeof document>"u")return;fd=!0;const e=document.createElement("style");e.id="editora-footnote-plugin-styles",e.textContent=`
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
  `,document.head.appendChild(e)}function mm(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function H1(e){if(!e)return null;const t=e.querySelector('[contenteditable="true"]');return t instanceof HTMLElement?t:null}function O1(){if(typeof window>"u")return null;const e=window[ud];if(!(e instanceof HTMLElement))return null;window[ud]=null;const t=e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(e.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?e:null);if(t){const n=H1(t);if(n)return n;if(t.getAttribute("contenteditable")==="true")return t}if(e.getAttribute("contenteditable")==="true")return e;const r=e.closest('[contenteditable="true"]');return r instanceof HTMLElement?r:null}function z1(e){const t=e.closest('[contenteditable="true"]');if(!t)return null;let r=t,n=r.parentElement;for(;n;)n.getAttribute("contenteditable")==="true"&&(r=n),n=n.parentElement;return r}function Cn(e){const t=mm(e);if(!t)return null;const r=t.closest(pm);return r||z1(t)}function q1(){const e=window.getSelection();return!e||e.rangeCount===0?null:Cn(e.getRangeAt(0).startContainer)}function _1(){const e=O1();if(e&&document.contains(e))return e;const t=q1();if(t)return t;const r=document.activeElement,n=r?Cn(r):null;if(n)return n;const o=document.querySelector(pm);return o||document.querySelector('[contenteditable="true"]')}function F1(){const e=document.createElement("section");e.className="rte-footnotes",e.setAttribute("data-type","footnotes"),e.setAttribute("contenteditable","false");const t=document.createElement("ol");return e.appendChild(t),e}function Oi(e,t){let r=e.querySelector(Ws);return!r&&t&&(r=F1(),e.appendChild(r)),r?(r.querySelector("ol")||r.appendChild(document.createElement("ol")),r):null}function gm(e){let t=e.querySelector("ol");return t||(t=document.createElement("ol"),e.appendChild(t)),t}function j1(e){const t=document.createElement("sup");return t.className="rte-footnote-ref",t.setAttribute("data-footnote-id",e),t.setAttribute("data-number","0"),t.setAttribute("contenteditable","false"),t.setAttribute("tabindex","0"),t.setAttribute("role","doc-noteref"),t.id=`ref-${e}`,t.textContent="0",t}function bm(e,t){const r=document.createElement("li");r.id=e,r.className="rte-footnote-item",r.setAttribute("data-type","footnote"),r.setAttribute("data-number","0"),r.setAttribute("contenteditable","false");const n=document.createElement("div");n.className="rte-footnote-content",n.setAttribute("contenteditable","true"),n.textContent=t;const o=document.createElement("a");return o.className="rte-footnote-backref",o.href=`#ref-${e}`,o.setAttribute("aria-label","Back to reference"),o.setAttribute("contenteditable","false"),o.textContent="↩",r.appendChild(n),r.appendChild(o),r}function V1(e){let t="";do md+=1,t=`fn-${Date.now().toString(36)}-${md.toString(36)}`;while(e.querySelector(`#${CSS.escape(t)}`));return t}function gd(e){e.classList.remove("rte-footnote-highlighted"),e.classList.add("rte-footnote-highlighted"),window.setTimeout(()=>{e.classList.remove("rte-footnote-highlighted")},1e3)}function hm(e){e&&e.dispatchEvent(new Event("input",{bubbles:!0}))}function ym(e,t){if(!e||t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function K1(e,t){return Array.from(e.querySelectorAll(ba)).find(n=>n.getAttribute("data-footnote-id")===t)||null}function W1(e){const t=window.getSelection();if(!t)throw new Error("Selection unavailable");let r=null;if(t.rangeCount>0){const o=t.getRangeAt(0);e.contains(o.commonAncestorContainer)&&(r=o.cloneRange())}if(!r){r=document.createRange();const o=Oi(e,!1);o?(r.setStartBefore(o),r.collapse(!0)):(r.selectNodeContents(e),r.collapse(!1))}const n=mm(r.commonAncestorContainer);if(n!=null&&n.closest(Ws)){const o=Oi(e,!0);o&&(r.setStartBefore(o),r.collapse(!0))}return t.removeAllRanges(),t.addRange(r),r}function bd(e){const t=e.parentNode;if(!t)return;const r=Array.from(t.childNodes).indexOf(e);if(r<0)return;const n=window.getSelection();if(!n)return;const o=document.createRange();o.setStart(t,r),o.setEnd(t,r+1),n.removeAllRanges(),n.addRange(o),e.focus({preventScroll:!0})}function hd(e,t){const r=window.getSelection();if(!r)return;const n=Math.max(0,Math.min(t,e.childNodes.length)),o=document.createRange();o.setStart(e,n),o.collapse(!0),r.removeAllRanges(),r.addRange(o)}function U1(e){if(e.collapsed||e.startContainer!==e.endContainer||e.endOffset!==e.startOffset+1||!(e.startContainer instanceof Element||e.startContainer instanceof DocumentFragment))return null;const t=e.startContainer.childNodes[e.startOffset];return!(t instanceof HTMLElement)||!t.matches(ba)?null:t}function Ka(e,t,r){const{startContainer:n,startOffset:o}=e;if(n.nodeType===Node.ELEMENT_NODE){const i=n;if(r==="previous"){if(o>0)return i.childNodes[o-1]||null}else if(o<i.childNodes.length)return i.childNodes[o]||null}if(n.nodeType===Node.TEXT_NODE&&(r==="previous"&&o<n.data.length||r==="next"&&o>0))return null;let a=n;for(;a&&a!==t;){const i=r==="previous"?a.previousSibling:a.nextSibling;if(i)return i;a=a.parentNode}return null}function G1(e,t,r){if(!e.collapsed)return null;const n=i=>i instanceof HTMLElement&&i.matches(ba)?i:null,{startContainer:o,startOffset:a}=e;if(o.nodeType===Node.ELEMENT_NODE){const i=o;return r==="Backspace"&&a>0?n(i.childNodes[a-1]||null):r==="Delete"?n(i.childNodes[a]||null):null}if(o.nodeType===Node.TEXT_NODE){const i=o;if(r==="Backspace"&&a===0){const l=n(i.previousSibling);return l||n(Ka(e,t,"previous"))}if(r==="Delete"&&a===i.data.length){const l=n(i.nextSibling);return l||n(Ka(e,t,"next"))}}return n(r==="Backspace"?Ka(e,t,"previous"):Ka(e,t,"next"))}function xm(e){const t=Array.from(e.querySelectorAll(ba)).filter(l=>!l.closest(Ws)),r=Oi(e,t.length>0);if(!r)return;const n=gm(r),o=Array.from(n.querySelectorAll(Hi)),a=new Map;o.forEach(l=>a.set(l.id,l));const i=[];t.forEach((l,s)=>{const c=l.getAttribute("data-footnote-id");if(!c)return;const d=s+1;l.setAttribute("data-number",String(d)),l.id=`ref-${c}`,l.textContent=String(d);let u=a.get(c);u||(u=bm(c,`Footnote ${d}`)),u.setAttribute("data-number",String(d));const f=u.querySelector(".rte-footnote-content");f&&!(f.textContent||"").trim()&&(f.textContent=`Footnote ${d}`);const m=u.querySelector(".rte-footnote-backref");m&&(m.href=`#ref-${c}`,m.setAttribute("aria-label",`Back to reference ${d}`)),i.push(u)}),n.innerHTML="",i.forEach(l=>n.appendChild(l)),i.length===0&&r.remove()}function yd(e,t){const r=Cn(e),n=e.parentNode;if(!r||!n)return!1;const o=r.innerHTML,a=Array.from(n.childNodes).indexOf(e);if(a<0)return!1;const i=e.getAttribute("data-footnote-id")||"";if(e.remove(),i){const l=r.querySelector(`${Hi}#${CSS.escape(i)}`);l==null||l.remove()}return hd(n,a),xm(r),ym(r,o),hm(r),!0}function Z1(){pd||typeof document>"u"||(pd=!0,document.addEventListener("click",e=>{const t=e.target;if(!t)return;const r=t.closest(ba);if(r){const s=Cn(r);if(!s||!s.contains(r))return;e.preventDefault(),e.stopPropagation(),bd(r),r.classList.add("rte-footnote-selected"),window.setTimeout(()=>r.classList.remove("rte-footnote-selected"),1200);const c=r.getAttribute("data-footnote-id");if(!c)return;const d=s.querySelector(`${Hi}#${CSS.escape(c)}`);if(!d)return;d.scrollIntoView({behavior:"smooth",block:"center"}),gd(d);return}const n=t.closest(".rte-footnote-backref");if(!n)return;const o=n.closest(Hi);if(!o)return;const a=Cn(o);if(!a||!a.contains(o))return;e.preventDefault(),e.stopPropagation();const i=o.id;if(!i)return;const l=K1(a,i);l&&(l.scrollIntoView({behavior:"smooth",block:"center"}),gd(l),bd(l))}),document.addEventListener("keydown",e=>{if(e.key!=="Backspace"&&e.key!=="Delete")return;const t=window.getSelection();if(!t||t.rangeCount===0)return;const r=t.getRangeAt(0),n=Cn(r.commonAncestorContainer);if(!n||!n.contains(r.commonAncestorContainer))return;const o=U1(r);if(o){e.preventDefault(),e.stopPropagation(),yd(o,e.key);return}const a=G1(r,n,e.key);a&&(e.preventDefault(),e.stopPropagation(),yd(a,e.key))}))}const Y1=(e="")=>{const t=_1();if(!t)return!1;const r=t.innerHTML,n=window.getSelection();if(!n)return!1;let o;try{o=W1(t)}catch{return!1}o.collapsed||(o.collapse(!1),n.removeAllRanges(),n.addRange(o));const a=V1(t),i=j1(a);try{o.insertNode(i)}catch{return!1}const l=document.createRange();l.setStartAfter(i),l.collapse(!0),n.removeAllRanges(),n.addRange(l);const s=Oi(t,!0);if(!s)return!1;const c=gm(s),d=e.trim()||"Footnote";return c.appendChild(bm(a,d)),xm(t),ym(t,r),hm(t),!0},X1=()=>(I1(),Z1(),{name:"footnote",toolbar:[{label:"Footnote",command:"insertFootnote",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="14" height="2" rx="1"></rect><rect x="3" y="8" width="18" height="2" rx="1"></rect><rect x="3" y="12" width="16" height="2" rx="1"></rect><rect x="3" y="16" width="10" height="1.5" rx="0.75"></rect><text x="19" y="11" font-size="9" font-weight="600" fill="currentColor" font-family="system-ui, sans-serif">1</text></svg>'}],commands:{insertFootnote:()=>Y1()},keymap:{}}),zi=()=>{const e=window.getSelection();if(e&&e.rangeCount>0){let r=e.getRangeAt(0).startContainer;for(;r&&r!==document.body;){if(r.nodeType===Node.ELEMENT_NODE){const n=r;if(n.getAttribute("contenteditable")==="true")return n}r=r.parentNode}}const t=document.activeElement;if(t){if(t.getAttribute("contenteditable")==="true")return t;const r=t.closest('[contenteditable="true"]');if(r)return r}return document.querySelector('[contenteditable="true"]')},Gn='[data-theme="dark"], .dark, .editora-theme-dark',J1=()=>{const e=zi();if(e!=null&&e.closest(Gn))return!0;const t=window.getSelection();if(t&&t.rangeCount>0){const n=t.getRangeAt(0).startContainer,o=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement;if(o!=null&&o.closest(Gn))return!0}const r=document.activeElement;return r!=null&&r.closest(Gn)?!0:document.body.matches(Gn)||document.documentElement.matches(Gn)},Q1=[{value:"javascript",label:"JavaScript"},{value:"typescript",label:"TypeScript"},{value:"python",label:"Python"},{value:"java",label:"Java"},{value:"csharp",label:"C#"},{value:"cpp",label:"C++"},{value:"c",label:"C"},{value:"php",label:"PHP"},{value:"ruby",label:"Ruby"},{value:"go",label:"Go"},{value:"rust",label:"Rust"},{value:"swift",label:"Swift"},{value:"kotlin",label:"Kotlin"},{value:"html",label:"HTML"},{value:"css",label:"CSS"},{value:"scss",label:"SCSS"},{value:"json",label:"JSON"},{value:"xml",label:"XML"},{value:"yaml",label:"YAML"},{value:"markdown",label:"Markdown"},{value:"sql",label:"SQL"},{value:"bash",label:"Bash"},{value:"shell",label:"Shell"},{value:"plaintext",label:"Plain Text"}],vm=new Map;function km(e,t,r,n){const o=!!t,a=n||"javascript",i=r||"",l=J1(),s=l?{overlay:"rgba(0, 0, 0, 0.62)",dialogBg:"#1f2937",dialogBorder:"#4b5563",text:"#e2e8f0",mutedText:"#a8b5c8",headerFooterBg:"#222d3a",border:"#3b4657",fieldBg:"#111827",fieldBorder:"#4b5563",cancelBg:"#334155",cancelHover:"#475569",cancelText:"#e2e8f0",primaryBg:"#3b82f6",primaryHover:"#2563eb"}:{overlay:"rgba(0, 0, 0, 0.5)",dialogBg:"#ffffff",dialogBorder:"#e0e0e0",text:"#333333",mutedText:"#666666",headerFooterBg:"#ffffff",border:"#e0e0e0",fieldBg:"#ffffff",fieldBorder:"#dddddd",cancelBg:"#e5e7eb",cancelHover:"#d1d5db",cancelText:"#333333",primaryBg:"#2563eb",primaryHover:"#1d4ed8"},c=document.createElement("div");c.className="rte-code-sample-overlay",l&&c.classList.add("rte-theme-dark"),c.style.cssText=`
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
  `;const m=document.createElement("div");m.style.marginBottom="20px",m.innerHTML=`
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
      ${Q1.map(E=>`
        <option value="${E.value}" ${E.value===a?"selected":""}>
          ${E.label}
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
  `;const p=document.createElement("div");p.style.cssText=`color: ${s.mutedText}; font-size: 12px; margin-top: 10px;`,p.innerHTML="💡 Tip: Press Ctrl+Enter (or Cmd+Enter on Mac) to save, or Escape to cancel",f.appendChild(m),f.appendChild(g),f.appendChild(p);const y=document.createElement("div");y.style.cssText=`
    padding: 20px;
    border-top: 1px solid ${s.border};
    background: ${s.headerFooterBg};
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  `,y.innerHTML=`
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
  `,d.appendChild(u),d.appendChild(f),d.appendChild(y),c.appendChild(d);const b=m.querySelector(".rte-code-language"),x=g.querySelector(".rte-code-textarea"),C=g.querySelector(".rte-code-error"),k=u.querySelector(".rte-code-close-btn"),T=y.querySelector(".rte-code-cancel-btn"),$=y.querySelector(".rte-code-save-btn");k.onmouseover=()=>{k.style.color="#f8fafc",k.style.background=l?"#334155":"#f0f0f0",k.style.borderRadius="4px"},k.onmouseout=()=>{k.style.color=s.mutedText,k.style.background="none"},T.onmouseover=()=>{T.style.background=s.cancelHover},T.onmouseout=()=>{T.style.background=s.cancelBg},$.onmouseover=()=>{$.style.background=s.primaryHover},$.onmouseout=()=>{$.style.background=s.primaryBg};const w=()=>{c.remove()},v=()=>{const E=x.value.trim();if(!E){C.textContent="⚠ Code cannot be empty",C.style.display="block";return}const H=b.value;e(E,H),w()};if(k.onclick=w,T.onclick=w,$.onclick=v,x.addEventListener("keydown",E=>{(E.ctrlKey||E.metaKey)&&E.key==="Enter"&&(E.preventDefault(),v()),E.key==="Escape"&&w()}),x.addEventListener("input",()=>{C.style.display="none"}),c.addEventListener("click",E=>{E.target===c&&w()}),!document.getElementById("rte-code-sample-animations")){const E=document.createElement("style");E.id="rte-code-sample-animations",E.textContent=`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `,document.head.appendChild(E)}return document.body.appendChild(c),setTimeout(()=>x.focus(),100),c}function ev(){if(!zi())return;let t=null;const r=window.getSelection();r&&r.rangeCount>0&&(t=r.getRangeAt(0).cloneRange()),km((n,o)=>{const a=window.getSelection();if(t&&(a==null||a.removeAllRanges(),a==null||a.addRange(t)),!a||a.rangeCount===0)return;const i=zi();if(!i)return;const l=a.anchorNode;if(!l||!i.contains(l))return;const s=a.getRangeAt(0),c=`code-block-${Date.now()}`,d=document.createElement("pre");d.className="rte-code-block",d.id=c,d.setAttribute("data-type","code-block"),d.setAttribute("data-lang",o),d.setAttribute("data-code-id",c),d.setAttribute("contenteditable","false"),d.style.cssText=`
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
    `,f.textContent=o;const m=document.createElement("button");m.className="rte-code-copy",m.textContent="Copy",m.style.cssText=`
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
    `,m.onclick=p=>{p.stopPropagation(),navigator.clipboard.writeText(n).then(()=>{m.textContent="✓ Copied!",setTimeout(()=>{m.textContent="Copy"},2e3)})},d.appendChild(f),d.appendChild(m),d.appendChild(u),d.addEventListener("mouseenter",()=>{m.style.opacity="1"}),d.addEventListener("mouseleave",()=>{m.style.opacity="0"}),d.addEventListener("dblclick",()=>{tv(c)}),vm.set(c,{id:c,language:o,code:n}),s.insertNode(d);const g=document.createRange();g.setStartAfter(d),g.collapse(!0),a.removeAllRanges(),a.addRange(g)})}function tv(e){const t=zi();if(!t)return;const r=t.querySelector(`#${e}`);if(!r)return;const n=vm.get(e);n&&km((o,a)=>{const i=r.querySelector("code");i&&(i.textContent=o,i.className=`language-${a}`);const l=r.querySelector("span");l&&(l.textContent=a),r.setAttribute("data-lang",a),n.language=a,n.code=o;const s=r.querySelector(".rte-code-copy");s&&(s.onclick=c=>{c.stopPropagation(),navigator.clipboard.writeText(o).then(()=>{s.textContent="✓ Copied!",setTimeout(()=>{s.textContent="Copy"},2e3)})})},e,n.code,n.language)}const rv=()=>({name:"codeSample",toolbar:[{label:"Insert Code",command:"insertCodeBlock",icon:'<svg width="24" height="26" focusable="false"><path d="M7.1 11a2.8 2.8 0 0 1-.8 2 2.8 2.8 0 0 1 .8 2v1.7c0 .3.1.6.4.8.2.3.5.4.8.4.3 0 .4.2.4.4v.8c0 .2-.1.4-.4.4-.7 0-1.4-.3-2-.8-.5-.6-.8-1.3-.8-2V15c0-.3-.1-.6-.4-.8-.2-.3-.5-.4-.8-.4a.4.4 0 0 1-.4-.4v-.8c0-.2.2-.4.4-.4.3 0 .6-.1.8-.4.3-.2.4-.5.4-.8V9.3c0-.7.3-1.4.8-2 .6-.5 1.3-.8 2-.8.3 0 .4.2.4.4v.8c0 .2-.1.4-.4.4-.3 0-.6.1-.8.4-.3.2-.4.5-.4.8V11Zm9.8 0V9.3c0-.3-.1-.6-.4-.8-.2-.3-.5-.4-.8-.4a.4.4 0 0 1-.4-.4V7c0-.2.1-.4.4-.4.7 0 1.4.3 2 .8.5.6.8 1.3.8 2V11c0 .3.1.6.4.8.2.3.5.4.8.4.2 0 .4.2.4.4v.8c0 .2-.2.4-.4.4-.3 0-.6.1-.8.4-.3.2-.4.5-.4.8v1.7c0 .7-.3 1.4-.8 2-.6.5-1.3.8-2 .8a.4.4 0 0 1-.4-.4v-.8c0-.2.1-.4.4-.4.3 0 .6-.1.8-.4.3-.2.4-.5.4-.8V15a2.8 2.8 0 0 1 .8-2 2.8 2.8 0 0 1-.8-2Zm-3.3-.4c0 .4-.1.8-.5 1.1-.3.3-.7.5-1.1.5-.4 0-.8-.2-1.1-.5-.4-.3-.5-.7-.5-1.1 0-.5.1-.9.5-1.2.3-.3.7-.4 1.1-.4.4 0 .8.1 1.1.4.4.3.5.7.5 1.2ZM12 13c.4 0 .8.1 1.1.5.4.3.5.7.5 1.1 0 1-.1 1.6-.5 2a3 3 0 0 1-1.1 1c-.4.3-.8.4-1.1.4a.5.5 0 0 1-.5-.5V17a3 3 0 0 0 1-.2l.6-.6c-.6 0-1-.2-1.3-.5-.2-.3-.3-.7-.3-1 0-.5.1-1 .5-1.2.3-.4.7-.5 1.1-.5Z" fill-rule="evenodd"></path></svg>',shortcut:"Mod-Shift-C"}],commands:{insertCodeBlock:(...e)=>(ev(),!0)}}),On=".rte-content, .editora-content",nv='[data-theme="dark"], .dark, .editora-theme-dark',ov={title:"Insert Merge Tag",searchPlaceholder:"Search merge tags...",emptyStateText:"No merge tags found",cancelText:"Cancel",insertText:"Insert",showPreview:!0};function av(){return[{id:"USER",name:"User",tags:[{key:"first_name",label:"First Name",category:"User",preview:"John"},{key:"last_name",label:"Last Name",category:"User",preview:"Doe"},{key:"email",label:"Email",category:"User",preview:"john@example.com"},{key:"phone",label:"Phone",category:"User",preview:"+1-555-1234"},{key:"full_name",label:"Full Name",category:"User",preview:"John Doe"},{key:"username",label:"Username",category:"User",preview:"johndoe"}]},{id:"COMPANY",name:"Company",tags:[{key:"company_name",label:"Company Name",category:"Company",preview:"Acme Corp"},{key:"company_address",label:"Company Address",category:"Company",preview:"123 Main St"},{key:"company_phone",label:"Company Phone",category:"Company",preview:"+1-555-0000"},{key:"company_email",label:"Company Email",category:"Company",preview:"info@acme.com"}]},{id:"DATE",name:"Date",tags:[{key:"today",label:"Today",category:"Date",preview:new Date().toLocaleDateString()},{key:"tomorrow",label:"Tomorrow",category:"Date",preview:new Date(Date.now()+864e5).toLocaleDateString()},{key:"next_week",label:"Next Week",category:"Date",preview:new Date(Date.now()+6048e5).toLocaleDateString()}]},{id:"CUSTOM",name:"Custom",tags:[]}]}function $l(e,t){return e.trim().toUpperCase().replace(/[^A-Z0-9]+/g,"_").replace(/^_+|_+$/g,"")||`CATEGORY_${t+1}`}function iv(e,t){return(e.key||e.value||e.label).trim().toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")||`tag_${t+1}`}function lv(e){const t=(()=>{if(Array.isArray(e==null?void 0:e.categories)&&e.categories.length>0)return e.categories;if(Array.isArray(e==null?void 0:e.tags)&&e.tags.length>0){const i=new Map;return e.tags.forEach(l=>{const s=(l.category||"Custom").trim()||"Custom",c=i.get(s);c?c.push(l):i.set(s,[l])}),Array.from(i.entries()).map(([l,s],c)=>({id:$l(l,c),name:l,tags:s}))}return av()})(),r={},n=[];if(t.forEach((i,l)=>{const s=$l(i.id||i.name,l);n.push(s),r[s]={name:i.name,tags:(Array.isArray(i.tags)?i.tags:[]).map((c,d)=>{const u=iv(c,d),f=(c.category||i.name).trim()||i.name;return{...c,key:u,category:f,categoryKey:s,searchIndex:`${c.label} ${u} ${f} ${c.description??""} ${c.value??""}`.toLowerCase()}})}}),n.length===0){const i="CUSTOM";n.push(i),r[i]={name:"Custom",tags:[]}}const o=e!=null&&e.defaultCategory?$l(e.defaultCategory,0):null,a=o&&n.includes(o)?o:n[0];return{categoriesByKey:r,categoryKeys:n,defaultCategory:a}}function sv(e){const t=e==null?void 0:e.tokenTemplate;return typeof t=="function"?r=>{var o;const n=t(r);return typeof n=="string"&&n.trim()?n:((o=r.value)==null?void 0:o.trim())||`{{ ${r.label} }}`}:typeof t=="string"&&t.trim()?r=>t.replace(/\{key\}/gi,r.key).replace(/\{label\}/gi,r.label).replace(/\{category\}/gi,r.category).replace(/\{value\}/gi,r.value??""):r=>{var n;return((n=r.value)==null?void 0:n.trim())||`{{ ${r.label} }}`}}function cv(e){return{catalog:lv(e),dialog:{...ov,...(e==null?void 0:e.dialog)||{}},formatToken:sv(e)}}let xd=!1,vd=!1,_r=null,fi=null,No=null,kd=!1;function wm(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function ls(){if(xd||typeof document>"u")return;xd=!0;const e=document.createElement("style");e.id="merge-tag-plugin-styles",e.textContent=`
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
  `,document.head.appendChild(e)}function wd(){vd||typeof document>"u"||(vd=!0,document.addEventListener("focusin",e=>{const t=e.target,r=t==null?void 0:t.closest(On);r&&(_r=r)}),document.addEventListener("selectionchange",()=>{const e=Em();e&&(_r=e)}))}function Em(){const e=window.getSelection();if(!e||e.rangeCount===0)return null;const r=e.getRangeAt(0).startContainer,n=r.nodeType===Node.ELEMENT_NODE?r:r.parentElement;return(n==null?void 0:n.closest(On))||null}function Cm(){const e=Em();if(e)return e;const t=document.activeElement,r=t==null?void 0:t.closest(On);return r||(_r!=null&&_r.isConnected?_r:document.querySelector(On))}function dv(e){const t=e.parentNode;if(!t)return;const r=window.getSelection();if(!r)return;const n=document.createRange(),a=Array.from(t.childNodes).indexOf(e);a<0||(n.setStart(t,a),n.setEnd(t,a+1),r.removeAllRanges(),r.addRange(n))}function Ed(e,t){var r;e instanceof Text&&e.data.length!==0&&(t?(e.data.startsWith(" ")||e.data.startsWith(" "))&&e.deleteData(0,1):(e.data.endsWith(" ")||e.data.endsWith(" "))&&e.deleteData(e.data.length-1,1),e.data.length===0&&((r=e.parentNode)==null||r.removeChild(e)))}function Cd(e,t){const r=window.getSelection();if(!r)return;const n=document.createRange(),o=Math.max(0,Math.min(t,e.childNodes.length));n.setStart(e,o),n.collapse(!0),r.removeAllRanges(),r.addRange(n)}function uv(e,t){const r=e.closest(On),n=(r==null?void 0:r.innerHTML)??"",o=e.parentNode;if(!o)return!1;const i=Array.from(o.childNodes).indexOf(e);if(i<0)return!1;const l=e.previousSibling,s=e.nextSibling;return o.removeChild(e),t==="Backspace"?(Ed(s,!0),Cd(o,i)):(Ed(l,!1),Cd(o,i)),r&&(wm(r,n),r.dispatchEvent(new Event("input",{bubbles:!0}))),!0}function fv(e){if(e.collapsed||!(e.startContainer instanceof HTMLElement||e.startContainer instanceof Text)||e.startContainer!==e.endContainer||e.endOffset!==e.startOffset+1)return null;const t=e.startContainer;if(!(t instanceof Element||t instanceof DocumentFragment))return null;const r=t.childNodes[e.startOffset];return r instanceof HTMLElement&&r.classList.contains("rte-merge-tag")?r:null}function pv(e,t){if(!e.collapsed)return null;const{startContainer:r,startOffset:n}=e,o=a=>a instanceof HTMLElement&&a.classList.contains("rte-merge-tag")?a:null;if(r.nodeType===Node.ELEMENT_NODE){const a=r;return t==="Backspace"&&n>0?o(a.childNodes[n-1]||null):t==="Delete"?o(a.childNodes[n]||null):null}if(r.nodeType===Node.TEXT_NODE){const a=r;return t==="Backspace"?n===0?o(a.previousSibling):n===1&&(a.data[0]===" "||a.data[0]===" ")&&a.previousSibling instanceof HTMLElement&&a.previousSibling.classList.contains("rte-merge-tag")?a.previousSibling:null:n===a.data.length?o(a.nextSibling):null}return null}function Sd(){kd||typeof document>"u"||(kd=!0,document.addEventListener("click",e=>{const t=e.target,r=t==null?void 0:t.closest(".rte-merge-tag");if(!r)return;const n=r.closest(On);n&&(e.preventDefault(),e.stopPropagation(),n.focus({preventScroll:!0}),dv(r))}),document.addEventListener("keydown",e=>{if(e.key!=="Backspace"&&e.key!=="Delete")return;const t=window.getSelection();if(!t||t.rangeCount===0)return;const r=t.getRangeAt(0),n=Cm();if(!n||!n.contains(r.commonAncestorContainer))return;let o=fv(r);o||(o=pv(r,e.key)),o&&(e.preventDefault(),e.stopPropagation(),uv(o,e.key))}))}function mv(e){return e?!!e.closest(nv):!1}function gv(){No&&(No(),No=null),fi=null}function Td(e){const t=document.createRange();return t.selectNodeContents(e),t.collapse(!1),t}function bv(e,t){const r=window.getSelection(),n=t?t.cloneRange():Td(e),a=n.startContainer.isConnected&&n.endContainer.isConnected&&e.contains(n.commonAncestorContainer)?n:Td(e);return r&&(r.removeAllRanges(),r.addRange(a)),a}function hv(e,t){const r=document.createElement("span");r.className="rte-merge-tag",r.setAttribute("contenteditable","false"),r.setAttribute("data-key",e.key),r.setAttribute("data-category",e.category),r.setAttribute("data-label",e.label),e.value&&r.setAttribute("data-value",e.value);const n=t(e);return r.setAttribute("data-token",n),r.setAttribute("aria-label",`Merge tag: ${e.label}`),r.textContent=n,r}function yv(e,t,r,n){const o=window.getSelection();if(!o)return!1;const a=e.innerHTML;e.focus({preventScroll:!0});const i=bv(e,t),l=i.startContainer.nodeType===Node.ELEMENT_NODE?i.startContainer:i.startContainer.parentElement,s=l==null?void 0:l.closest(".rte-merge-tag");s&&e.contains(s)&&(i.setStartAfter(s),i.setEndAfter(s));try{i.deleteContents();const c=hv(r,n),d=document.createTextNode(" "),u=document.createDocumentFragment();u.appendChild(c),u.appendChild(d),i.insertNode(u);const f=document.createRange();return f.setStartAfter(d),f.collapse(!0),o.removeAllRanges(),o.addRange(f),wm(e,a),e.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch(c){return console.error("Failed to insert merge tag:",c),!1}}function xv(e,t,r){var a;const n=((a=e.catalog.categoriesByKey[t])==null?void 0:a.tags)||[],o=r.trim().toLowerCase();return o?n.filter(i=>i.searchIndex.includes(o)):n}function vv(e,t){var dr;gv(),ls();const r={category:t.catalog.defaultCategory,searchTerm:"",filteredTags:((dr=t.catalog.categoriesByKey[t.catalog.defaultCategory])==null?void 0:dr.tags)||[],selectedIndex:0,savedRange:(()=>{const A=window.getSelection();if(!A||A.rangeCount===0)return null;const D=A.getRangeAt(0);return e.contains(D.commonAncestorContainer)?D.cloneRange():null})(),searchRaf:null},n=document.createElement("div");n.className="rte-merge-tag-overlay",n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true"),mv(e)&&n.classList.add("rte-ui-theme-dark");const o=document.createElement("div");o.className="rte-merge-tag-dialog";const a=document.createElement("div");a.className="rte-merge-tag-header";const i=document.createElement("h2");i.style.margin="0",i.style.fontSize="18px",i.style.fontWeight="700",i.textContent=t.dialog.title;const l=document.createElement("button");l.className="rte-merge-tag-close",l.setAttribute("aria-label","Close"),l.style.background="none",l.style.border="none",l.style.color="inherit",l.style.cursor="pointer",l.style.fontSize="20px",l.textContent="✕",a.appendChild(i),a.appendChild(l);const s=document.createElement("div");s.className="rte-merge-tag-body";const c=document.createElement("input");c.type="text",c.className="rte-merge-tag-input",c.placeholder=t.dialog.searchPlaceholder,c.setAttribute("aria-label","Search merge tags");const d=document.createElement("div");d.className="rte-merge-tag-tabs",t.catalog.categoryKeys.forEach(A=>{var ie;const D=document.createElement("button");D.type="button",D.className="rte-merge-tag-tab",D.setAttribute("data-category",A),D.textContent=((ie=t.catalog.categoriesByKey[A])==null?void 0:ie.name)||A,d.appendChild(D)});const u=document.createElement("div");u.className="rte-merge-tag-list";const f=document.createElement("div");f.className="rte-merge-tag-preview",s.appendChild(c),s.appendChild(d),s.appendChild(u),s.appendChild(f);const m=document.createElement("div");m.className="rte-merge-tag-footer";const g=document.createElement("button");g.type="button",g.className="rte-merge-tag-btn-secondary",g.textContent=t.dialog.cancelText;const p=document.createElement("button");p.type="button",p.className="rte-merge-tag-btn-primary",p.textContent=t.dialog.insertText,m.appendChild(g),m.appendChild(p),o.appendChild(a),o.appendChild(s),o.appendChild(m),n.appendChild(o),document.body.appendChild(n),fi=n;const y=()=>{d.querySelectorAll(".rte-merge-tag-tab").forEach(D=>{const ie=D.dataset.category===r.category;D.classList.toggle("active",ie)})},b=()=>{if(r.filteredTags.length===0){r.selectedIndex=-1;return}r.selectedIndex<0&&(r.selectedIndex=0),r.selectedIndex>=r.filteredTags.length&&(r.selectedIndex=r.filteredTags.length-1)},x=()=>{if(!t.dialog.showPreview){f.style.display="none",p.disabled=r.filteredTags.length===0;return}b();const A=r.selectedIndex>=0?r.filteredTags[r.selectedIndex]:null;if(!A){f.style.display="none",p.disabled=!0;return}f.style.display="block",f.textContent=`Preview: ${t.formatToken(A)}`,p.disabled=!1},C=()=>{if(r.selectedIndex<0)return;const A=u.querySelector(`.rte-merge-tag-item[data-index="${r.selectedIndex}"]`);A==null||A.scrollIntoView({block:"nearest"})},k=()=>{const A=u.querySelector(".rte-merge-tag-item.selected");if(A==null||A.classList.remove("selected"),r.selectedIndex>=0){const D=u.querySelector(`.rte-merge-tag-item[data-index="${r.selectedIndex}"]`);D==null||D.classList.add("selected")}x(),C()},T=()=>{if(r.filteredTags=xv(t,r.category,r.searchTerm),r.filteredTags.length>0&&r.selectedIndex<0&&(r.selectedIndex=0),b(),u.innerHTML="",r.filteredTags.length===0){const D=document.createElement("div");D.className="rte-merge-tag-empty",D.textContent=t.dialog.emptyStateText,u.appendChild(D),x();return}const A=document.createDocumentFragment();r.filteredTags.forEach((D,ie)=>{const W=document.createElement("div");W.className="rte-merge-tag-item",W.setAttribute("data-index",String(ie)),W.classList.toggle("selected",ie===r.selectedIndex);const dl=document.createElement("div");if(dl.className="rte-merge-tag-item-label",dl.textContent=D.label,W.appendChild(dl),D.preview){const ul=document.createElement("div");ul.className="rte-merge-tag-item-preview",ul.textContent=D.preview,W.appendChild(ul)}A.appendChild(W)}),u.appendChild(A),k()},$=()=>{r.searchRaf!==null&&cancelAnimationFrame(r.searchRaf),r.searchRaf=requestAnimationFrame(()=>{r.searchRaf=null,r.searchTerm=c.value,r.selectedIndex=0,T()})},w=()=>{r.searchRaf!==null&&(cancelAnimationFrame(r.searchRaf),r.searchRaf=null),n.remove(),fi===n&&(fi=null,No=null)},v=()=>{if(b(),r.selectedIndex<0)return;const A=r.filteredTags[r.selectedIndex];yv(e,r.savedRange,A,t.formatToken)&&w()},E=A=>{const ie=A.target.closest(".rte-merge-tag-tab");if(!ie)return;const W=ie.dataset.category;!W||!t.catalog.categoriesByKey[W]||(r.category=W,r.searchTerm="",c.value="",r.selectedIndex=0,y(),T())},H=A=>{const ie=A.target.closest(".rte-merge-tag-item");if(!ie)return;const W=Number(ie.dataset.index||"-1");Number.isNaN(W)||W<0||W>=r.filteredTags.length||(r.selectedIndex=W,k())},_=A=>{const ie=A.target.closest(".rte-merge-tag-item");if(!ie)return;const W=Number(ie.dataset.index||"-1");Number.isNaN(W)||W<0||W>=r.filteredTags.length||(r.selectedIndex=W,v())},qe=A=>{if(A.key==="Escape"){A.preventDefault(),w();return}if(A.key==="ArrowDown"){if(A.preventDefault(),r.filteredTags.length===0)return;r.selectedIndex=Math.min(r.filteredTags.length-1,r.selectedIndex+1),k();return}if(A.key==="ArrowUp"){if(A.preventDefault(),r.filteredTags.length===0)return;r.selectedIndex=Math.max(0,r.selectedIndex-1),k();return}A.key==="Enter"&&(A.preventDefault(),v())},_e=A=>{A.target===n&&w()};d.addEventListener("click",E),u.addEventListener("click",H),u.addEventListener("dblclick",_),c.addEventListener("input",$),c.addEventListener("keydown",qe),n.addEventListener("click",_e),o.addEventListener("keydown",qe),l==null||l.addEventListener("click",w),g.addEventListener("click",w),p.addEventListener("click",v),No=()=>{d.removeEventListener("click",E),u.removeEventListener("click",H),u.removeEventListener("dblclick",_),c.removeEventListener("input",$),c.removeEventListener("keydown",qe),n.removeEventListener("click",_e),o.removeEventListener("keydown",qe),l==null||l.removeEventListener("click",w),g.removeEventListener("click",w),p.removeEventListener("click",v),r.searchRaf!==null&&(cancelAnimationFrame(r.searchRaf),r.searchRaf=null),n.remove()},y(),T(),setTimeout(()=>{c.focus()},0)}const kv=e=>({name:"mergeTag",config:e,init:()=>{ls(),wd(),Sd()},toolbar:[{label:"Merge Tag",command:"insertMergeTag",icon:"{{ }}"}],commands:{insertMergeTag:()=>{ls(),wd(),Sd();const t=Cm();return t?(vv(t,cv(e)),!0):!1}}});let oe=null,xt=null,zn=null,ae=null,qn="",_n="",Bo="insert",Po=null,yt=null,Fr=null;function Sm(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function wv(e){if(!e)return null;let t=e.startContainer;for(;t&&t!==document.body;){if(t.nodeType===Node.ELEMENT_NODE){const r=t;if(r.getAttribute("contenteditable")==="true")return r}t=t.parentNode}return null}const Ev=[{id:"formal-letter",name:"Formal Letter",category:"Letters",description:"Professional business letter template",html:`<p><strong>{{ Company Name }}</strong></p>
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
<p>A: [Answer here]</p>`}];let Us=[...Ev];const Tm=()=>Us,Lm=()=>{const e=new Set(Us.map(t=>t.category));return Array.from(e)},Cv=e=>{const t=e.toLowerCase();return Us.filter(r=>{var n,o;return r.name.toLowerCase().includes(t)||((n=r.description)==null?void 0:n.toLowerCase().includes(t))||((o=r.tags)==null?void 0:o.some(a=>a.toLowerCase().includes(t)))})},$m=e=>Km.sanitize(e,{ALLOWED_TAGS:["p","br","strong","em","u","h1","h2","h3","h4","ul","ol","li","blockquote","table","thead","tbody","tr","th","td","a","span"],ALLOWED_ATTR:["href","target","class","data-key","data-category"]});function Sv(e){xt=document.createElement("div"),xt.className="rte-dialog-overlay",$v(e)&&xt.classList.add("rte-ui-theme-dark"),xt.addEventListener("click",()=>or()),oe=document.createElement("div"),oe.className="rte-dialog rte-template-dialog",oe.addEventListener("click",r=>r.stopPropagation());const t=Lm();t.length>0&&!qn&&(qn=t[0]),na(),xt.appendChild(oe),document.body.appendChild(xt),Tv(),Bv()}function Tv(){Am(),Po=e=>{e.key==="Escape"&&(!xt||!oe||(e.preventDefault(),e.stopPropagation(),or()))},document.addEventListener("keydown",Po,!0)}function Am(){Po&&(document.removeEventListener("keydown",Po,!0),Po=null)}const Lv='[data-theme="dark"], .dark, .editora-theme-dark',Gs=()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return null;const t=e.anchorNode,r=t instanceof HTMLElement?t:t==null?void 0:t.parentElement;return(r==null?void 0:r.closest(".rte-content, .editora-content"))||null},$v=e=>{const t=e||Gs();return t?!!t.closest(Lv):!1};function Zs(){const e=wv(zn);if(e)return e;if(Fr!=null&&Fr.isConnected)return Fr;const t=Gs();return t||document.querySelector(".rte-content, .editora-content")}function na(){if(!oe)return;const e=Lm(),t=Ys();oe.innerHTML=`
    <div class="rte-dialog-header">
      <h2>Insert Template</h2>
      <button class="rte-dialog-close" aria-label="Close">✕</button>
    </div>

    <div class="rte-dialog-body">
      <!-- Search -->
      <input
        type="text"
        placeholder="Search templates..."
        value="${_n}"
        class="rte-input rte-template-search"
        aria-label="Search templates"
      />

      <!-- Category Tabs -->
      <div class="rte-tabs">
        ${e.map(r=>`
          <button class="rte-tab ${qn===r?"active":""}" data-category="${r}">
            ${r}
          </button>
        `).join("")}
      </div>

      <!-- Template List -->
      <div class="rte-template-list">
        ${t.length>0?t.map(r=>`
          <div
            class="rte-template-item ${(ae==null?void 0:ae.id)===r.id?"selected":""}"
            data-template-id="${r.id}"
          >
            <div class="template-name">${r.name}</div>
            ${r.description?`<div class="template-description">${r.description}</div>`:""}
          </div>
        `).join(""):'<div class="rte-empty-state">No templates found</div>'}
      </div>

      <!-- Preview -->
      ${ae?`
        <div class="rte-template-preview">
          <strong>Preview:</strong>
          <div class="template-preview-content">${ae.html}</div>
        </div>
      `:""}

      <!-- Insert Mode Toggle -->
      <div class="rte-insert-mode">
        <label>
          <input type="radio" name="insertMode" value="insert" ${Bo==="insert"?"checked":""} />
          Insert at cursor
        </label>
        <label>
          <input type="radio" name="insertMode" value="replace" ${Bo==="replace"?"checked":""} />
          Replace document
        </label>
      </div>
    </div>

    <div class="rte-dialog-footer">
      <button class="rte-button-secondary rte-cancel-btn">Cancel</button>
      <button class="rte-button-primary rte-insert-btn" ${ae?"":"disabled"}>
        ${Bo==="insert"?"Insert":"Replace"}
      </button>
    </div>
  `,Mv()}function Av(){if(!oe)return;oe.innerHTML=`
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
  `;const e=oe.querySelector(".rte-cancel-warning-btn"),t=oe.querySelector(".rte-confirm-replace-btn");e==null||e.addEventListener("click",()=>na()),t==null||t.addEventListener("click",()=>Rv())}function Ys(){const e=Tm();return _n.trim()?Cv(_n):qn?e.filter(t=>t.category===qn):e}function Mv(){if(!oe)return;const e=oe.querySelector(".rte-dialog-close");e==null||e.addEventListener("click",()=>or());const t=oe.querySelector(".rte-cancel-btn");t==null||t.addEventListener("click",()=>or());const r=oe.querySelector(".rte-insert-btn");r==null||r.addEventListener("click",()=>Al());const n=oe.querySelector(".rte-template-search");n==null||n.addEventListener("input",s=>{yt!==null&&cancelAnimationFrame(yt),_n=s.target.value,yt=requestAnimationFrame(()=>{yt=null,Ld()})}),n==null||n.addEventListener("keydown",s=>{s.key==="Enter"&&ae?Al():s.key==="Escape"&&or()});const o=oe.querySelector(".rte-tabs");o==null||o.addEventListener("click",s=>{const d=s.target.closest(".rte-tab");if(!d)return;const u=d.getAttribute("data-category");u&&(qn=u,_n="",yt!==null&&(cancelAnimationFrame(yt),yt=null),Ld())});const a=oe.querySelector(".rte-template-list"),i=s=>{const d=s.target.closest(".rte-template-item");if(!d)return null;const u=d.getAttribute("data-template-id");return u&&Tm().find(f=>f.id===u)||null};a==null||a.addEventListener("click",s=>{const c=i(s);c&&(ae=c,na())}),a==null||a.addEventListener("dblclick",s=>{const c=i(s);c&&(ae=c,Al())});const l=oe.querySelector(".rte-insert-mode");l==null||l.addEventListener("change",s=>{const c=s.target;!c||c.name!=="insertMode"||(Bo=c.value,na())})}function Ld(){const e=Ys();e.length>0?(!ae||!e.find(t=>t.id===ae.id))&&(ae=e[0]):ae=null,na()}function Al(){var e;if(ae)if(Bo==="replace"){const t=Zs();if((e=t==null?void 0:t.innerHTML)!=null&&e.trim()){Av();return}Mm(ae),or()}else Dv(ae),or()}function Rv(){ae&&(Mm(ae),or())}function Dv(e){const t=window.getSelection();if(!t)return;const r=Zs();if(!r)return;if(zn)t.removeAllRanges(),t.addRange(zn);else{const l=document.createRange();l.selectNodeContents(r),l.collapse(!1),t.removeAllRanges(),t.addRange(l)}if(t.rangeCount===0)return;const n=t.getRangeAt(0),o=(r==null?void 0:r.innerHTML)??"",a=document.createRange().createContextualFragment($m(e.html));n.deleteContents(),n.insertNode(a);const i=document.createRange();i.setStartAfter(n.endContainer),i.collapse(!0),t.removeAllRanges(),t.addRange(i),r&&(Sm(r,o),r.dispatchEvent(new Event("input",{bubbles:!0})))}function Mm(e){const t=Zs();if(t){const r=t.innerHTML;t.innerHTML=$m(e.html),Sm(t,r),t.dispatchEvent(new Event("input",{bubbles:!0}))}}function or(){Am(),yt!==null&&(cancelAnimationFrame(yt),yt=null),xt&&(xt.remove(),xt=null),oe=null,zn=null,_n="",Fr=null}function Nv(e){const t=window.getSelection();t&&t.rangeCount>0?zn=t.getRangeAt(0).cloneRange():zn=null;const r=Ys();r.length>0&&!ae&&(ae=r[0]);const n=(e==null?void 0:e.contentElement)instanceof HTMLElement?e.contentElement:Gs();Fr=n||null,Sv(n)}function Bv(){if(typeof document>"u")return;const e="template-plugin-dialog-styles";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
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
  `,document.head.appendChild(t)}const Pv=()=>({name:"template",toolbar:[{label:"Template",command:"insertTemplate",icon:'<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3 3V9H21V3H3ZM19 5H5V7H19V5Z" fill="#000000"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M3 11V21H11V11H3ZM9 13H5V19H9V13Z" fill="#000000"></path> <path d="M21 11H13V13H21V11Z" fill="#000000"></path> <path d="M13 15H21V17H13V15Z" fill="#000000"></path> <path d="M21 19H13V21H21V19Z" fill="#000000"></path> </g></svg>'}],commands:{insertTemplate:(e,t)=>(Nv(t),!0)},keymap:{}}),ss=new WeakMap;let cr=null,$d=!1,Ad=0;const cs="User";function pi(e){return Ad+=1,`${e}-${Date.now()}-${Ad}`}function qi(e){if(!e)return null;const t=e instanceof Element?e:e.parentElement;return t?t.closest("[data-editora-editor]")||t.closest(".rte-editor")||t.closest(".editora-editor"):null}function Md(e){const t=(e==null?void 0:e.editorElement)||(e==null?void 0:e.contentElement)||null;if(!(t instanceof HTMLElement))return;const r=t.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(t.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?t:null);r&&(cr=r)}function il(e,t){return t.contains(e.commonAncestorContainer)}function Iv(){if(typeof window<"u"){const n=window.__editoraCommandEditorRoot;if(n instanceof HTMLElement){const o=n.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(n.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?n:null);if(o)return cr=o,window.__editoraCommandEditorRoot=null,o}}const e=document.activeElement,t=e?qi(e):null;if(t)return t;const r=window.getSelection();if(r&&r.rangeCount>0){const n=qi(r.getRangeAt(0).commonAncestorContainer);if(n)return n}return cr}function Hv(e){const t=ss.get(e);if(t)return t;const r={root:e,comments:new Map,panelVisible:!1,panelElement:null,expandedComments:new Set,replyTexts:{},savedSelection:null,newCommentText:"",selectionChangeListener:null};return ss.set(e,r),r}function qt(){const e=Iv();return e?(cr=e,Hv(e)):null}function Rm(e){const t=window.getSelection();if(!t||t.rangeCount===0||t.isCollapsed)return null;const r=t.getRangeAt(0);return il(r,e)?r.cloneRange():null}function Dm(e,t){if(!t.anchorId)return;const r=e.root.querySelector(`#${t.anchorId}`);r&&r.classList.toggle("rte-comment-anchor-resolved",t.resolved)}function Wa(e,t,r){const n=e.comments.get(t);if(!n||!n.anchorId)return;const o=e.root.querySelector(`#${n.anchorId}`);o&&o.classList.toggle("highlighted",r)}function Ov(e,t,r){t.onclick=n=>{n.preventDefault(),n.stopPropagation(),cr=e.root,e.expandedComments.add(r),oa(e,!0),tt(e)}}function zv(e){const t=e.parentNode;if(t){for(;e.firstChild;)t.insertBefore(e.firstChild,e);e.remove()}}function oa(e,t){if(e.panelVisible=t,t){Yv(),qv(e),e.root.setAttribute("data-rte-comments-open","true"),e.panelElement&&(e.panelElement.classList.add("is-open"),e.panelElement.setAttribute("aria-hidden","false")),_v(e);return}e.root.removeAttribute("data-rte-comments-open"),Fv(e),e.panelElement&&(e.panelElement.remove(),e.panelElement=null)}function qv(e){if(e.panelElement)return;const t=document.createElement("aside");t.className="rte-comments-panel",t.setAttribute("role","complementary"),t.setAttribute("aria-label","Comments"),t.setAttribute("aria-hidden","true"),window.getComputedStyle(e.root).position==="static"&&(e.root.style.position="relative"),e.root.appendChild(t),e.panelElement=t}function _v(e){e.selectionChangeListener||(e.selectionChangeListener=()=>{const t=window.getSelection();if(!t||t.rangeCount===0||t.isCollapsed)return;const r=t.getRangeAt(0);il(r,e.root)&&(e.savedSelection=r.cloneRange(),cr=e.root)},document.addEventListener("selectionchange",e.selectionChangeListener))}function Fv(e){e.selectionChangeListener&&(document.removeEventListener("selectionchange",e.selectionChangeListener),e.selectionChangeListener=null)}function jv(e){return Array.from(e.comments.values()).sort((t,r)=>r.createdAt.localeCompare(t.createdAt))}function Rd(e){return new Date(e).toLocaleString()}function Vv(e,t){const r=e.expandedComments.has(t.id),n=document.createElement("article");n.className=`rte-comment-item${t.resolved?" resolved":""}`,n.innerHTML=`
    <header class="rte-comment-header">
      <div class="rte-comment-meta">
        <strong class="rte-comment-author">${t.author}</strong>
        <time class="rte-comment-date">${Rd(t.createdAt)}</time>
      </div>
      <button class="rte-comment-expand" type="button" aria-label="Toggle details">
        ${r?"▾":"▸"}
      </button>
    </header>
    <div class="rte-comment-text"></div>
    ${t.selectedText?`<blockquote class="rte-comment-selection">${t.selectedText}</blockquote>`:""}
    <section class="rte-comment-expanded${r?" show":""}"></section>
  `;const o=n.querySelector(".rte-comment-text");o&&(o.textContent=t.text);const a=n.querySelector(".rte-comment-expand");a==null||a.addEventListener("click",()=>{e.expandedComments.has(t.id)?e.expandedComments.delete(t.id):e.expandedComments.add(t.id),tt(e)});const i=n.querySelector(".rte-comment-expanded");if(i&&r){if(t.replies.length>0){const c=document.createElement("div");c.className="rte-comment-replies",t.replies.forEach(d=>{const u=document.createElement("div");u.className="rte-comment-reply",u.innerHTML=`
          <div class="rte-comment-reply-header">
            <strong>${d.author}</strong>
            <time>${Rd(d.createdAt)}</time>
          </div>
          <div class="rte-comment-reply-text"></div>
        `;const f=u.querySelector(".rte-comment-reply-text");f&&(f.textContent=d.text),c.appendChild(u)}),i.appendChild(c)}if(!t.resolved){const c=document.createElement("div");c.className="rte-comment-reply-composer",c.innerHTML=`
        <textarea class="rte-comment-reply-textarea" rows="2" placeholder="Reply..."></textarea>
        <button type="button" class="rte-comment-btn primary">Reply</button>
      `;const d=c.querySelector(".rte-comment-reply-textarea"),u=c.querySelector(".rte-comment-btn.primary");if(d&&u){d.value=e.replyTexts[t.id]||"";const f=()=>{const m=!!d.value.trim();u.disabled=!m};f(),d.addEventListener("input",()=>{e.replyTexts[t.id]=d.value,f()}),u.addEventListener("click",()=>{const m=d.value.trim();m&&(Zv(t.id,cs,m),e.replyTexts[t.id]="",tt(e))})}i.appendChild(c)}const l=document.createElement("div");if(l.className="rte-comment-actions",t.anchorId){const c=document.createElement("button");c.type="button",c.className="rte-comment-btn ghost",c.textContent="Jump to text",c.onclick=()=>{const d=e.root.querySelector(`#${t.anchorId}`);d&&(d.scrollIntoView({behavior:"smooth",block:"center",inline:"nearest"}),Wa(e,t.id,!0),window.setTimeout(()=>Wa(e,t.id,!1),1200))},l.appendChild(c)}if(t.resolved){const c=document.createElement("button");c.type="button",c.className="rte-comment-btn ghost",c.textContent="Reopen",c.onclick=()=>Uv(t.id),l.appendChild(c)}else{const c=document.createElement("button");c.type="button",c.className="rte-comment-btn success",c.textContent="Resolve",c.onclick=()=>Wv(t.id,cs),l.appendChild(c)}const s=document.createElement("button");s.type="button",s.className="rte-comment-btn danger",s.textContent="Delete",s.onclick=()=>Gv(t.id),l.appendChild(s),i.appendChild(l)}return n.addEventListener("mouseenter",()=>Wa(e,t.id,!0)),n.addEventListener("mouseleave",()=>Wa(e,t.id,!1)),n}function tt(e){const t=e||qt();if(!(t!=null&&t.panelElement))return;const r=jv(t);t.panelElement.innerHTML=`
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
  `;const n=t.panelElement.querySelector(".rte-comments-close");n==null||n.addEventListener("click",()=>{oa(t,!1)});const o=t.panelElement.querySelector(".new-comment-textarea"),a=t.panelElement.querySelector(".add-comment-btn");if(o&&a){o.value=t.newCommentText;const l=()=>{const s=!!o.value.trim();a.disabled=!s};l(),o.addEventListener("input",()=>{t.newCommentText=o.value,l()}),o.addEventListener("keydown",s=>{(s.ctrlKey||s.metaKey)&&s.key==="Enter"&&(s.preventDefault(),a.click())}),a.addEventListener("click",()=>{const s=o.value.trim();if(!s)return;const c=!!t.savedSelection;Kv(cs,s,!c),t.newCommentText="",tt(t)})}const i=t.panelElement.querySelector(".rte-comments-list");i&&r.forEach(l=>{i.appendChild(Vv(t,l))})}function Dd(){$d||($d=!0,document.addEventListener("focusin",e=>{const t=qi(e.target);t&&(cr=t)}),document.addEventListener("selectionchange",()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return;const t=e.getRangeAt(0),r=qi(t.commonAncestorContainer);if(!r)return;cr=r;const n=ss.get(r);!n||e.isCollapsed||il(t,r)&&(n.savedSelection=t.cloneRange())}),document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;const t=qt();!t||!t.panelVisible||(e.preventDefault(),e.stopPropagation(),oa(t,!1))},!0))}function Kv(e,t,r=!1){var u;const n=qt();if(!n)return"";const o=t.trim();if(!o)return"";if(r){const f=pi("comment");return n.comments.set(f,{id:f,anchorId:"",selectedText:"",author:e,text:o,createdAt:new Date().toISOString(),resolved:!1,replies:[]}),tt(n),f}const a=n.savedSelection||Rm(n.root);if(!a||!il(a,n.root))return"";const i=a.toString().trim();if(!i)return"";const l=pi("comment"),s=pi("comment-anchor"),c=document.createElement("span");c.id=s,c.className="rte-comment-anchor",c.setAttribute("data-comment-id",l),c.setAttribute("title","Commented text");try{const f=a.cloneRange(),m=f.extractContents();if(!((u=m.textContent)!=null&&u.trim()))return"";c.appendChild(m),f.insertNode(c)}catch{return""}Ov(n,c,l),n.comments.set(l,{id:l,anchorId:s,selectedText:i,author:e,text:o,createdAt:new Date().toISOString(),resolved:!1,replies:[]}),n.savedSelection=null;const d=window.getSelection();return d==null||d.removeAllRanges(),tt(n),l}function Wv(e,t){const r=qt();if(!r)return;const n=r.comments.get(e);n&&(n.resolved=!0,n.resolvedBy=t,n.resolvedAt=new Date().toISOString(),Dm(r,n),tt(r))}function Uv(e){const t=qt();if(!t)return;const r=t.comments.get(e);r&&(r.resolved=!1,r.resolvedBy=void 0,r.resolvedAt=void 0,Dm(t,r),tt(t))}function Gv(e){const t=qt();if(!t)return;const r=t.comments.get(e);if(r){if(r.anchorId){const n=t.root.querySelector(`#${r.anchorId}`);n&&zv(n)}t.comments.delete(e),t.expandedComments.delete(e),delete t.replyTexts[e],tt(t)}}function Zv(e,t,r){const n=qt();if(!n)return;const o=n.comments.get(e);if(!o)return;const a=r.trim();a&&(o.replies.push({id:pi("reply"),author:t,text:a,createdAt:new Date().toISOString()}),tt(n))}function Yv(){if(document.getElementById("rte-comments-panel-styles"))return;const e=document.createElement("style");e.id="rte-comments-panel-styles",e.textContent=`
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
  `,document.head.appendChild(e)}const Xv=()=>({name:"comments",toolbar:[{label:"Add Comment",command:"addComment",type:"button",icon:'<svg fill="#000000" width="24px" height="24px" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;}</style></defs><title>add-comment</title><path d="M17.74,30,16,29l4-7h6a2,2,0,0,0,2-2V8a2,2,0,0,0-2-2H6A2,2,0,0,0,4,8V20a2,2,0,0,0,2,2h9v2H6a4,4,0,0,1-4-4V8A4,4,0,0,1,6,4H26a4,4,0,0,1,4,4V20a4,4,0,0,1-4,4H21.16Z"></path><polygon points="17 9 15 9 15 13 11 13 11 15 15 15 15 19 17 19 17 15 21 15 21 13 17 13 17 9"></polygon><rect class="cls-1" width="32" height="32"></rect></svg>'},{label:"Show / Hide Comments",command:"toggleComments",type:"button",icon:'<svg width="24px" height="24px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 1H4V11H8L10 13L12 11H16V1Z" fill="#000000"></path><path d="M2 5V13H7.17157L8.70711 14.5355L7.29289 15.9497L6.34315 15H0V5H2Z" fill="#000000"></path></svg>'}],commands:{addComment:(e,t)=>{var o;Md(t),Dd();const r=qt();if(!r)return!1;if(r.savedSelection=Rm(r.root),r.savedSelection){const a=window.getSelection();a==null||a.removeAllRanges()}oa(r,!0),tt(r);const n=(o=r.panelElement)==null?void 0:o.querySelector(".new-comment-textarea");return n==null||n.focus({preventScroll:!0}),!0},toggleComments:(e,t)=>{Md(t),Dd();const r=qt();return r?(oa(r,!r.panelVisible),r.panelVisible&&tt(r),!0):!1}},keymap:{}}),Nm=new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","is","are","be","was","were","have","has","had","do","does","did","will","would","could","should","may","might","must","can","this","that","these","those","what","which","who","whom","where","when","why","how","all","each","every","both","few","more","most","other","same","such","no","nor","not","only","own","so","than","too","very","just","as","if","because","while","although","though","it","its","their","them","they","you","he","she","we","me","him","her","us","our","i","my","your","his","hers","ours","yours","theirs","editor","document","text","word","paragraph","line","page","content","hello","world","test","example","sample","demo","lorem","ipsum"]),ll=new Set,sl=new Set;let ar=!1,st=null,Sn=null,ge=null,Ce=null,Io=null,_i=!1,Dt=null,Nd=!1,Tn=0,Ln=null;const Bm={characterData:!0,childList:!0,subtree:!0},Bd="rte-spellcheck-styles",Pd="__editoraCommandEditorRoot";function Jv(e){var a;const t=(e==null?void 0:e.contentElement)||(e==null?void 0:e.editorElement)||null;if(!(t instanceof HTMLElement))return;const r=t.getAttribute("contenteditable")==="true"?t:(a=t.querySelector)==null?void 0:a.call(t,'[contenteditable="true"]');if(r instanceof HTMLElement){Ce=r,Dt=r;return}const n=t.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(t.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?t:null),o=Xs(n);o&&(Ce=o,Dt=o)}function Pm(){if(typeof window>"u")return null;const e=window[Pd];if(!(e instanceof HTMLElement))return null;window[Pd]=null;const t=e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(e.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?e:null);if(t){const n=Xs(t);if(n)return n;if(t.getAttribute("contenteditable")==="true")return t}if(e.getAttribute("contenteditable")==="true")return e;const r=e.closest('[contenteditable="true"]');return r instanceof HTMLElement?r:null}function ds(){let e=document.getElementById(Bd);e||(e=document.createElement("style"),e.id=Bd,document.head.appendChild(e)),e.textContent=`
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
  `}function Dr(){if(Ce&&document.contains(Ce))return Ce;const e=Hm();return e&&(Ce=e),e}function Im(e){if(!e)return;const t=e.nodeType===Node.ELEMENT_NODE?e:e.parentElement,r=t==null?void 0:t.closest('[contenteditable="true"]');r&&(Ce=r)}function Xs(e){if(!e)return null;const t=e.querySelector('[contenteditable="true"]');return t instanceof HTMLElement?t:null}function Qv(){if(Nd)return;const e=t=>{const r=t.target;if(!r)return;const n=r.closest('.editora-toolbar-button[data-command="toggleSpellCheck"], .rte-toolbar-button[data-command="toggleSpellCheck"]');if(!n)return;const o=n.closest("[data-editora-editor]"),a=Xs(o);a&&(Dt=a,Ce=a)};document.addEventListener("pointerdown",e,!0),Nd=!0}function ek(){const e=Pm();if(e&&document.contains(e))return Ce=e,Dt=null,e;if(Dt&&document.contains(Dt)){const t=Dt;return Dt=null,Ce=t,t}return Hm()}function tk(){Tn+=1,Tn===1&&st&&st.disconnect()}function rk(){if(Tn===0||(Tn-=1,Tn>0)||!st)return;const e=Dr();e&&st.observe(e,Bm)}function Js(e){tk();try{return e()}finally{rk()}}const nk=()=>{try{const e=localStorage.getItem("rte-custom-dictionary");e&&JSON.parse(e).forEach(r=>ll.add(r.toLowerCase()))}catch(e){console.warn("Failed to load custom dictionary:",e)}},ok=()=>{try{const e=Array.from(ll);localStorage.setItem("rte-custom-dictionary",JSON.stringify(e))}catch(e){console.warn("Failed to save custom dictionary:",e)}};function ak(e,t){const r=[];for(let n=0;n<=t.length;n++)r[n]=[n];for(let n=0;n<=e.length;n++)r[0][n]=n;for(let n=1;n<=t.length;n++)for(let o=1;o<=e.length;o++)t.charAt(n-1)===e.charAt(o-1)?r[n][o]=r[n-1][o-1]:r[n][o]=Math.min(r[n-1][o-1]+1,r[n][o-1]+1,r[n-1][o]+1);return r[t.length][e.length]}function ik(e){const t=e.toLowerCase();return Nm.has(t)||ll.has(t)||sl.has(t)}function lk(e,t=5){const r=e.toLowerCase(),o=Array.from(Nm).map(a=>({word:a,distance:ak(r,a)}));return o.sort((a,i)=>a.distance-i.distance),o.filter(a=>a.distance<=3).slice(0,t).map(a=>a.word)}function sk(e){if(e.nodeType!==Node.ELEMENT_NODE)return!1;const t=e;return!!(t.closest('code, pre, [contenteditable="false"], .rte-widget, .rte-template, .rte-comment, .rte-merge-tag')||t.hasAttribute("data-comment-id")||t.hasAttribute("data-template")||t.hasAttribute("data-merge-tag"))}function ck(e){const t=[],r=/([\p{L}\p{M}\p{N}\p{Emoji_Presentation}\u200d'-]+|[\uD800-\uDBFF][\uDC00-\uDFFF])/gu;let n;for(;(n=r.exec(e.data))!==null;){const o=n[0],a=n.index,i=a+o.length;/https?:\/\//.test(o)||/@/.test(o)||/\{\{.*\}\}/.test(o)||/^\d+$/.test(o)||ik(o)||/[a-z][A-Z]/.test(o)||/-/.test(o)||o[0]===o[0].toUpperCase()&&o.length>1||t.push({id:`${o}-${a}`,node:e,startOffset:a,endOffset:i,word:o,suggestions:lk(o),ignored:!1})}return t}const Hm=()=>{const e=Pm();if(e&&document.contains(e))return Ce=e,e;const t=window.getSelection();if(t&&t.rangeCount>0){let n=t.getRangeAt(0).startContainer;for(;n&&n!==document.body;){if(n.nodeType===Node.ELEMENT_NODE){const o=n;if(o.getAttribute("contenteditable")==="true")return o}n=n.parentNode}}const r=document.activeElement;if(r){if(r.getAttribute("contenteditable")==="true")return r;const n=r.closest('[contenteditable="true"]');if(n)return n;const o=r.closest("[data-editora-editor]");if(o){const a=o.querySelector('[contenteditable="true"]');if(a)return a}}return document.querySelector('[contenteditable="true"]')};function Qs(){const e=Dr();if(!e)return[];const t=[],r=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,{acceptNode:o=>{var a;return!((a=o.textContent)!=null&&a.trim())||o.parentNode&&sk(o.parentNode)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});let n=r.nextNode();for(;n;)t.push(...ck(n)),n=r.nextNode();return t}function Rr(e){const t=Dr();t&&(e||(e=Qs()),Js(()=>{t.querySelectorAll(".rte-misspelled").forEach(r=>{const n=r.parentNode;if(n){for(;r.firstChild;)n.insertBefore(r.firstChild,r);n.removeChild(r)}}),e.forEach(r=>{if(sl.has(r.word.toLowerCase()))return;const n=r.node.data.length;if(!(r.startOffset<0||r.endOffset>n||r.startOffset>=r.endOffset))try{const o=document.createRange();o.setStart(r.node,r.startOffset),o.setEnd(r.node,r.endOffset);const a=document.createElement("span");a.className="rte-misspelled",a.setAttribute("data-word",r.word),a.setAttribute("data-suggestions",r.suggestions.join(",")),a.setAttribute("title",`Suggestions: ${r.suggestions.join(", ")}`),a.style.borderBottom="2px wavy red",a.style.cursor="pointer",o.surroundContents(a)}catch{}})}),Fi(e))}function cl(){const e=Dr();e&&Js(()=>{e.querySelectorAll(".rte-misspelled").forEach(t=>{const r=t.parentNode;if(r){for(;t.firstChild;)r.insertBefore(t.firstChild,t);r.removeChild(t)}})})}function dk(e,t){Js(()=>{const r=document.createRange();r.setStart(e.node,e.startOffset),r.setEnd(e.node,e.endOffset);const n=document.createTextNode(t);r.deleteContents(),r.insertNode(n)})}function Om(e){sl.add(e.toLowerCase()),cl(),Rr()}function zm(e){ll.add(e.toLowerCase()),ok(),cl(),Rr()}function uk(e){const t=Dr();if(!t)return{total:0,misspelled:0,accuracy:100};e||(e=Qs());const r=e.filter(i=>!sl.has(i.word.toLowerCase())).length,a=((t.textContent||"").match(/[\p{L}\p{M}\p{N}]+/gu)||[]).length;return{total:a,misspelled:r,accuracy:a>0?(a-r)/a*100:100}}function fk(e,t){const r=document.createTextNode(t);e.replaceWith(r)}function pk(e){e.classList.remove("rte-misspelled"),e.removeAttribute("data-word"),e.removeAttribute("data-suggestions"),e.removeAttribute("title"),e.style.borderBottom="",e.style.cursor=""}function mk(e,t,r,n,o){Im(o),document.querySelectorAll(".rte-spellcheck-menu").forEach(m=>m.remove());const a=document.createElement("div");if(a.className="rte-spellcheck-menu",n.slice(0,5).forEach(m=>{const g=document.createElement("div");g.className="rte-spellcheck-menu-item",g.textContent=m,g.onclick=()=>{fk(o,m),window.setTimeout(()=>{ar&&(Rr(),Fi())},0),a.remove()},a.appendChild(g)}),n.length>0){const m=document.createElement("div");m.style.cssText="height: 1px; background: #ddd; margin: 4px 0;",a.appendChild(m)}const i=document.createElement("div");i.className="rte-spellcheck-menu-item meta",i.textContent="Ignore Once",i.onclick=()=>{pk(o),a.remove()},a.appendChild(i);const l=document.createElement("div");l.className="rte-spellcheck-menu-item meta",l.textContent="Ignore All",l.onclick=()=>{Om(r),a.remove()},a.appendChild(l);const s=document.createElement("div");s.className="rte-spellcheck-menu-item positive",s.textContent="Add to Dictionary",s.onclick=()=>{zm(r),a.remove()},a.appendChild(s),document.body.appendChild(a);const c=a.getBoundingClientRect(),d=window.innerWidth-c.width-8,u=window.innerHeight-c.height-8;a.style.left=`${Math.max(8,Math.min(e,d))}px`,a.style.top=`${Math.max(8,Math.min(t,u))}px`;const f=m=>{a.contains(m.target)||(a.remove(),document.removeEventListener("mousedown",f))};setTimeout(()=>document.addEventListener("mousedown",f),0)}function Id(){_i||(Io=e=>{const t=e.target;if(t&&t.classList.contains("rte-misspelled")){e.preventDefault(),Im(t);const r=t.getAttribute("data-word"),n=(t.getAttribute("data-suggestions")||"").split(",").filter(o=>o);mk(e.clientX,e.clientY,r,n,t)}},document.addEventListener("contextmenu",Io),_i=!0)}function gk(){!_i||!Io||(document.removeEventListener("contextmenu",Io),Io=null,_i=!1)}function bk(e){return e.closest("[data-editora-editor]")||e.parentElement||e}function Hd(){const e=Dr();if(!e)throw new Error("Spell check panel requested without active editor");const t=bk(e);ds();const r=document.createElement("div");return r.className="rte-spell-check-panel",window.getComputedStyle(t).position==="static"&&(t.style.position="relative"),t.appendChild(r),r}function Fi(e){if(!ge)return;const t=e||Qs(),r=uk(t);ge.innerHTML=`
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
  `;const n=ge.querySelector(".rte-spellcheck-close");n==null||n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),ec()}),ge.querySelectorAll(".rte-spellcheck-word-header").forEach(o=>{o.addEventListener("click",()=>{const a=o.closest(".rte-spellcheck-item"),i=a==null?void 0:a.querySelector(".rte-spellcheck-suggestions"),l=o.querySelector(".rte-spellcheck-caret");i&&l&&(i.classList.contains("show")?(i.classList.remove("show"),l.textContent="▶"):(i.classList.add("show"),l.textContent="▼"))})}),ge.querySelectorAll(".suggestion-btn").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-suggestion"),i=o.closest(".rte-spellcheck-item");i==null||i.getAttribute("data-word");const l=parseInt((i==null?void 0:i.getAttribute("data-index"))||"0");t[l]&&(dk(t[l],a),Rr())})}),ge.querySelectorAll(".ignore-btn").forEach(o=>{o.addEventListener("click",()=>{const a=o.closest(".rte-spellcheck-item"),i=a==null?void 0:a.getAttribute("data-word");Om(i)})}),ge.querySelectorAll(".add-btn").forEach(o=>{o.addEventListener("click",()=>{const a=o.closest(".rte-spellcheck-item"),i=a==null?void 0:a.getAttribute("data-word");zm(i)})})}function Od(){const e=Dr();e&&(st&&st.disconnect(),st=new MutationObserver(t=>{Tn>0||t.some(r=>r.type==="characterData"||r.type==="childList")&&(Sn&&clearTimeout(Sn),Sn=window.setTimeout(()=>{ar&&Rr()},350))}),st.observe(e,{...Bm}))}function qm(){st&&(st.disconnect(),st=null),Sn&&(clearTimeout(Sn),Sn=null)}function _m(){document.querySelectorAll(".rte-spellcheck-menu").forEach(e=>e.remove())}function zd(){Ln||(Ln=e=>{e.key!=="Escape"||!ar||(e.preventDefault(),e.stopPropagation(),ec())},document.addEventListener("keydown",Ln,!0))}function hk(){Ln&&(document.removeEventListener("keydown",Ln,!0),Ln=null)}function ec(){return ar&&(cl(),qm(),gk(),_m(),ge&&(ge.remove(),ge=null),Ce=null,Dt=null,ar=!1,hk()),!1}function yk(){const e=ek();return e?ar&&Ce&&Ce!==e?(cl(),qm(),_m(),ge&&(ge.remove(),ge=null),Ce=e,ds(),Id(),zd(),Rr(),Od(),ge=Hd(),Fi(),!0):ar?ec():(Ce=e,ar=!0,ds(),Id(),zd(),Rr(),Od(),ge&&(ge.remove(),ge=null),ge=Hd(),Fi(),!0):!1}const xk=()=>({name:"spellCheck",init:()=>{nk(),Qv()},toolbar:[{label:"Spell Check",command:"toggleSpellCheck",icon:'<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 12.5L3.84375 9.5M3.84375 9.5L5 5.38889C5 5.38889 5.25 4.5 6 4.5C6.75 4.5 7 5.38889 7 5.38889L8.15625 9.5M3.84375 9.5H8.15625M9 12.5L8.15625 9.5M13 16.8333L15.4615 19.5L21 13.5M12 8.5H15C16.1046 8.5 17 7.60457 17 6.5C17 5.39543 16.1046 4.5 15 4.5H12V8.5ZM12 8.5H16C17.1046 8.5 18 9.39543 18 10.5C18 11.6046 17.1046 12.5 16 12.5H12V8.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',shortcut:"F7"}],commands:{toggleSpellCheck:(e,t)=>(Jv(t),yk(),!0)},keymap:{F7:"toggleSpellCheck"}});const Ik={title:"Editor/Rich Text Editor - Web Component",component:X,parameters:{layout:"padded",docs:{source:{type:"code"},description:{component:`
# Editora Web Component - Framework Agnostic Rich Text Editor

**Bundle Size**: 115 KB minified (28.65 KB gzipped)  
**Native Plugins**: 42  
**Framework Dependencies**: 0  
**Supports**: React, Vue, Angular, Svelte, Vanilla JS

## Features
- ✅ Zero framework dependencies
- ✅ 91% bundle size reduction
- ✅ TinyMCE-style declarative API
- ✅ Works everywhere
- ✅ 39 native plugins including Code Sample, Media Manager, Math, Merge Tags, Page Break, Template, A11y Checker, Comments, and more
        `}}}},Q=[go(),bo(),us(),Sf(),tg(),Fm(),rg(),ng(),rv(),Wm(),vg(),og(),Um(),Pg(),Gm(),Mg(),ag(),ig(),Zm(),Ig(),Ef(),Ym(),bb(),Qg(),Xm(),Jm(),kv(),P1(),C1(),w1(),Fg(),xk(),Kg(),Qm(),Xv(),b1(),eg(),Pv(),Cf(),X1(),lg(),ch(),Bh(),Gh({data:{user:{firstName:"Ava",lastName:"Miller"},order:{total:1234.56,createdAt:"2026-03-03T12:00:00Z"}}}),cg({bannedWords:["obviously","simply"],requiredHeadings:["Summary"],maxSentenceWords:28,minReadabilityScore:55,enableRealtime:!0}),Ey({defaultStyle:"apa",enableFootnoteSync:!0}),sg({defaultStatus:"draft",lockOnApproval:!0,defaultActor:"Editorial Lead"}),dg({enableRealtime:!0,redactionMode:"token",maxFindings:120}),sx({defaultProfile:"balanced",maxHtmlLength:22e4}),_x({maxResults:120,blocks:[{id:"incident-summary",label:"Incident Summary Block",category:"Operations",tags:["incident","summary"],keywords:["postmortem","rca"],html:"<h3>Incident Summary</h3><p>Describe impact, timeline, and customer exposure.</p>"},{id:"risk-register-entry",label:"Risk Register Entry",category:"Compliance",tags:["risk","governance"],keywords:["mitigation","owner"],html:"<h3>Risk Register Entry</h3><p><strong>Risk:</strong> <em>Describe risk here.</em></p><p><strong>Mitigation:</strong> Define mitigation owner and due date.</p>"},{id:"release-rollback",label:"Release Rollback Plan",category:"Engineering",tags:["release","rollback"],keywords:["deployment","runbook"],html:"<h3>Rollback Plan</h3><ol><li>Pause rollout</li><li>Revert deployment</li><li>Validate service health</li></ol>"}]}),f0({defaultSchemaId:"policy",enableRealtime:!0,schemas:[{id:"policy",label:"Policy",strictOrder:!0,allowUnknownHeadings:!0,sections:[{title:"Policy Statement"},{title:"Applicability",aliases:["Scope"]},{title:"Controls"},{title:"Exceptions"},{title:"Enforcement"}]}]}),_0({sourceLocale:"en-US",targetLocale:"fr-FR",enableRealtime:!0,locales:["en-US","fr-FR","de-DE","es-ES","ja-JP"]}),g1(),jb({items:[{id:"john.doe",label:"John Doe",meta:"john@acme.com"},{id:"sarah.lee",label:"Sarah Lee",meta:"sarah@acme.com"},{id:"ops.team",label:"Ops Team",meta:"team"}]})],Zn={render:()=>h(X,{plugins:Q,statusbar:{enabled:!0,position:"bottom"},floatingToolbar:!0,defaultValue:`
        <h2>Welcome to Editora!!</h2>
        <p>This is a <strong>framework-agnostic</strong> rich text editor with <mark style="background: #ffeb3b;">39 native plugins</mark>.</p>
        <p>✨ <strong>Key Features:</strong></p>
        <ul>
          <li>Zero framework dependencies</li>
          <li>115 KB minified (28.65 KB gzipped)</li>
          <li>91% smaller than before!</li>
          <li>Works with React, Vue, Angular, Svelte</li>
        </ul>
        <p>Try editing this content!</p>
      `})},Yn={render:()=>{const e=Ne.useRef(null),[t,r]=Ne.useState(""),[n,o]=Ne.useState(0),[a,i]=Ne.useState("");return Ne.useEffect(()=>{var c;if(typeof window<"u"&&window.Editora){const d=window.Editora;i(d.version||"N/A"),o(((c=d.plugins)==null?void 0:c.length)||0)}},[]),S("div",{children:[S(J,{style:{marginBottom:"20px",padding:"15px",background:"#f5f5f5",borderRadius:"4px"},children:[h("h4",{style:{margin:"0 0 10px 0"},children:"🌐 Global Editora API"}),S("p",{style:{margin:"5px 0"},children:["Version: ",h("strong",{children:a})]}),S("p",{style:{margin:"5px 0"},children:["Plugins Available: ",h("strong",{children:n})]}),S(ji,{style:{marginTop:"10px",display:"flex",gap:"10px"},children:[h("button",{onClick:()=>{if(e.current){const c=e.current.innerHTML;r(c)}},style:{padding:"8px 16px"},children:"Get Content"}),h("button",{onClick:()=>{e.current&&(e.current.innerHTML=`
          <h3>Content Set via API!</h3>
          <p>Updated at: ${new Date().toLocaleTimeString()}</p>
          <p>This was set using the Web Component API.</p>
        `)},style:{padding:"8px 16px"},children:"Set Content"})]})]}),h("div",{ref:e,children:h(X,{plugins:Q,statusbar:{enabled:!0},defaultValue:`
              <h3>Web Component API Demo</h3>
              <p>This editor can be controlled via the global <code>window.Editora</code> object.</p>
              <p>Try the buttons above to interact with the editor programmatically!</p>
            `})}),t&&S(J,{style:{marginTop:"20px",padding:"15px",background:"#e8f5e9",borderRadius:"4px"},children:[h("h4",{style:{margin:"0 0 10px 0"},children:"📄 Output:"}),h("pre",{style:{overflow:"auto",fontSize:"12px"},children:t})]})]})}},Xn={render:()=>S("div",{children:[S(J,{style:{marginBottom:"20px",padding:"15px",background:"#e3f2fd",borderRadius:"4px"},children:[h("h3",{style:{margin:"0 0 10px 0"},children:"🔌 All 32 Native Plugins Loaded"}),S(aa,{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"10px",fontSize:"13px"},children:[S("div",{children:[h("strong",{children:"Basic Formatting (5):"}),h("br",{}),"Bold, Italic, Underline, Strikethrough, ClearFormatting"]}),S("div",{children:[h("strong",{children:"Block Types (4):"}),h("br",{}),"Paragraph, Heading, Blockquote, Code"]}),S("div",{children:[h("strong",{children:"Lists (2):"}),h("br",{}),"List, Checklist"]}),S("div",{children:[h("strong",{children:"Layout (3):"}),h("br",{}),"TextAlignment, Indent, Direction"]}),S("div",{children:[h("strong",{children:"Typography (6):"}),h("br",{}),"TextColor, BackgroundColor, FontSize, FontFamily, LineHeight, Capitalization"]}),S("div",{children:[h("strong",{children:"Content (6):"}),h("br",{}),"Link, Image, Table, Anchor, EmbedIframe, Footnote"]}),S("div",{children:[h("strong",{children:"Special (3):"}),h("br",{}),"Math, SpecialCharacters, Emojis"]}),S("div",{children:[h("strong",{children:"Tools (4):"}),h("br",{}),"A11yChecker, Comments, DocumentManager, Fullscreen"]}),S("div",{children:[h("strong",{children:"History (1):"}),h("br",{}),"History"]})]})]}),h(X,{plugins:Q,statusbar:{enabled:!0},defaultValue:`
          <h1>🎨 All Plugin Features</h1>
          
          <h2>Basic Formatting</h2>
          <p><strong>Bold</strong>, <em>Italic</em>, <u>Underline</u>, <s>Strikethrough</s></p>
          
          <h2>Typography</h2>
          <p style="color: #e91e63;">Text Color</p>
          <p style="background-color: #ffeb3b;">Background Color</p>
          <p style="font-size: 18px;">Font Size: 18px</p>
          <p style="font-family: 'Courier New';">Font Family: Courier New</p>
          <p style="line-height: 2;">Line Height: 2.0</p>
          
          <h2>Text Alignment</h2>
          <p style="text-align: left;">Left aligned</p>
          <p style="text-align: center;">Center aligned</p>
          <p style="text-align: right;">Right aligned</p>
          <p style="text-align: justify;">Justified text with enough content to wrap and demonstrate the justification effect across multiple lines.</p>
          
          <h2>Lists</h2>
          <ul>
            <li>Bullet list item 1</li>
            <li>Bullet list item 2</li>
          </ul>
          <ol>
            <li>Numbered list item 1</li>
            <li>Numbered list item 2</li>
          </ol>
          
          <h2>Block Quotes</h2>
          <blockquote>
            "This is a blockquote. It can contain multiple paragraphs and formatting."
          </blockquote>
          
          <h2>Code</h2>
          <pre><code>function hello() {
  console.log("Hello, World!");
}</code></pre>
          
          <h2>Links & Media</h2>
          <p><a href="https://example.com">Click here for a link</a></p>
          
          <h2>Tables</h2>
          <table border="1">
            <tr><th>Header 1</th><th>Header 2</th></tr>
            <tr><td>Cell 1</td><td>Cell 2</td></tr>
            <tr><td>Cell 3</td><td>Cell 4</td></tr>
          </table>
          
          <p>Try using the toolbar to test all features! 🚀</p>
        `})]})},Jn={render:()=>S("div",{children:[S(J,{style:{marginBottom:"20px",padding:"15px",background:"#fff3e0",borderRadius:"4px"},children:[h("h4",{style:{margin:"0 0 10px 0"},children:"🎨 Custom Toolbar"}),h("p",{style:{margin:0,fontSize:"14px"},children:"Only essential formatting tools are shown in the toolbar."})]}),h(X,{plugins:[go(),bo(),us(),Sf(),Ef(),Cf()],statusbar:{enabled:!0},toolbar:{items:"undo redo | bold italic underline strikethrough | link",sticky:!0},defaultValue:`
          <h2>Minimal Editor</h2>
          <p>This editor has a <strong>simplified toolbar</strong> with only essential formatting options.</p>
          <p>Perfect for comment sections, chat applications, or simple text input.</p>
        `})]})},Qn={render:()=>{const[e,t]=Ne.useState(!0);return S("div",{children:[S(J,{style:{marginBottom:"20px",padding:"15px",background:"#f3e5f5",borderRadius:"4px"},children:[h("h4",{style:{margin:"0 0 10px 0"},children:"🔒 Readonly Mode"}),h("button",{onClick:()=>t(!e),style:{padding:"8px 16px"},children:e?"Enable Editing":"Disable Editing"})]}),h(X,{plugins:Q,statusbar:{enabled:!0},readonly:e,defaultValue:`
            <h2>Readonly Content</h2>
            <p>This content is <strong>${e?"readonly":"editable"}</strong>.</p>
            <p>Click the button above to toggle editing mode.</p>
            <ul>
              <li>Perfect for previewing documents</li>
              <li>Displaying formatted content</li>
              <li>Review mode in collaborative editing</li>
            </ul>
          `})]})}},eo={render:()=>S("div",{children:[S(J,{style:{marginBottom:"20px",padding:"15px",background:"#e3f2fd",borderRadius:"4px"},children:[h("h4",{style:{margin:"0 0 10px 0"},children:"🧪 Test 6: Placeholder"}),h("p",{style:{margin:0,fontSize:"14px"},children:"Three placeholder examples: simple, detailed guidance, and prefilled-content fallback."})]}),S(aa,{style:{display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:"16px"},children:[S("div",{children:[h("h4",{style:{margin:"0 0 8px 0"},children:"Simple Placeholder"}),h(X,{plugins:[go(),bo()],toolbar:{items:"bold italic",showMoreOptions:!1},statusbar:{enabled:!0},placeholder:"Type something here..."})]}),S("div",{children:[h("h4",{style:{margin:"0 0 8px 0"},children:"Detailed Placeholder"}),h(X,{plugins:[go(),bo(),us()],toolbar:{items:"bold italic underline",showMoreOptions:!1},statusbar:{enabled:!0},placeholder:"Draft release notes: summary, impact, migration steps, and rollback plan."})]}),S("div",{children:[h("h4",{style:{margin:"0 0 8px 0"},children:"Prefilled Then Clear"}),h(X,{plugins:[go(),bo()],toolbar:{items:"bold italic",showMoreOptions:!1},statusbar:{enabled:!0},placeholder:"Delete all content to show this placeholder.",defaultValue:"<p>This editor starts with content. Clear it to reveal placeholder.</p>"})]})]})]})},to={render:()=>{const[e,t]=Ne.useState("default"),[r,n]=Ne.useState("dark"),o=a=>a==="default"?"dark":a==="dark"?"acme":"default";return S("div",{children:[S(J,{style:{marginBottom:"20px",padding:"15px",background:"#ede7f6",borderRadius:"4px"},children:[h("h4",{style:{margin:"0 0 10px 0"},children:"🎨 Test 7: Theme Switcher (Editor Only)"}),h("p",{style:{margin:"0 0 12px 0",fontSize:"14px"},children:"Switches only editor themes using wrapper-level attributes (`data-theme`)."}),S(ji,{style:{display:"flex",gap:"10px",flexWrap:"wrap"},children:[h("button",{onClick:()=>t(o(e)),style:{padding:"8px 16px"},children:"Cycle Editor A"}),h("button",{onClick:()=>n(o(r)),style:{padding:"8px 16px"},children:"Cycle Editor B"}),h("button",{onClick:()=>{t("dark"),n("dark")},style:{padding:"8px 16px"},children:"Set Both Dark"}),h("button",{onClick:()=>{t("default"),n("default")},style:{padding:"8px 16px"},children:"Set Both Default"}),h("button",{onClick:()=>{t("acme"),n("acme")},style:{padding:"8px 16px"},children:"Set Both Acme"})]}),S("p",{style:{margin:"12px 0 0 0",fontSize:"13px"},children:["Current themes: ",S("strong",{children:["Editor A = ",e]}),", ",S("strong",{children:["Editor B = ",r]})]})]}),S(aa,{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},children:[S("div",{"data-theme":e,style:{padding:"10px",borderRadius:"8px",background:e==="dark"?"#0b1220":e==="acme"?"#eef4fb":"#ffffff"},children:[h("h4",{style:{margin:"0 0 8px 0",color:e==="dark"?"#f8fafc":e==="acme"?"#0f4f4a":"#111827"},children:"Editor A"}),h(X,{plugins:Q,toolbar:{showMoreOptions:!1},statusbar:{enabled:!0},floatingToolbar:!0,defaultValue:"<p>Editor A theme is controlled independently.</p>"})]}),S("div",{"data-theme":r,style:{padding:"10px",borderRadius:"8px",background:r==="dark"?"#0b1220":r==="acme"?"#eef4fb":"#ffffff"},children:[h("h4",{style:{margin:"0 0 8px 0",color:r==="dark"?"#f8fafc":r==="acme"?"#0f4f4a":"#111827"},children:"Editor B"}),h(X,{plugins:Q,toolbar:{showMoreOptions:!1},statusbar:{enabled:!0},floatingToolbar:!0,defaultValue:"<p>Editor B can use a different theme from Editor A.</p>"})]})]})]})}},ro={render:()=>{const[e,t]=Ne.useState(""),[r,n]=Ne.useState(0),[o,a]=Ne.useState(0);return S("div",{children:[h(X,{plugins:Q,statusbar:{enabled:!0},onChange:l=>{t(l);const s=l.replace(/<[^>]*>/g,"").trim();n(s.split(/\s+/).filter(Boolean).length),a(s.length)},defaultValue:`
            <h2>Try typing here!</h2>
            <p>Watch the statistics update in real-time as you type.</p>
          `}),S(J,{style:{marginTop:"20px",padding:"15px",background:"#e8f5e9",borderRadius:"4px"},children:[h("h4",{style:{margin:"0 0 10px 0"},children:"📊 Statistics"}),S("p",{style:{margin:"5px 0"},children:["Words: ",h("strong",{children:r})]}),S("p",{style:{margin:"5px 0"},children:["Characters: ",h("strong",{children:o})]}),S("details",{style:{marginTop:"10px"},children:[h("summary",{style:{cursor:"pointer"},children:"Show HTML"}),h("pre",{style:{fontSize:"12px",overflow:"auto",marginTop:"10px"},children:e})]})]})]})}},no={render:()=>S("div",{children:[S(J,{style:{marginBottom:"20px",padding:"15px",background:"#e1f5fe",borderRadius:"4px"},children:[h("h4",{style:{margin:"0 0 10px 0"},children:"🔢 Math Plugin"}),h("p",{style:{margin:0,fontSize:"14px"},children:"Insert mathematical equations using LaTeX notation. Click the Math button in the toolbar (fx)."})]}),h(X,{plugins:Q,statusbar:{enabled:!0},defaultValue:`
          <h2>Mathematical Equations</h2>
          <p>Inline equation: <span data-math-inline="true" data-latex="E = mc^2" class="math-inline">$E = mc^2$</span></p>
          
          <p>Block equation:</p>
          <div data-math-block="true" data-latex="\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}" class="math-block">
            $$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$
          </div>
          
          <p>Pythagorean theorem: <span data-math-inline="true" data-latex="a^2 + b^2 = c^2" class="math-inline">$a^2 + b^2 = c^2$</span></p>
          
          <p><strong>Try it:</strong> Use Cmd/Ctrl-Shift-M to open the math dialog!</p>
        `})]})},oo={render:()=>S("div",{children:[S(J,{style:{marginBottom:"20px",padding:"15px",background:"#fce4ec",borderRadius:"4px"},children:[h("h4",{style:{margin:"0 0 10px 0"},children:"✨ Special Characters & Emojis"}),h("p",{style:{margin:0,fontSize:"14px"},children:"Insert special characters (Cmd/Ctrl-Shift-S) and emojis (Cmd/Ctrl-Shift-J)."})]}),h(X,{plugins:Q,statusbar:{enabled:!0},defaultValue:`
          <h2>Special Characters & Emojis</h2>
          
          <h3>Special Characters</h3>
          <p>Common: © ® ™ § ¶ † ‡ • ★</p>
          <p>Arrows: → ← ↑ ↓ ↔ ⇒ ⇐</p>
          <p>Currency: $ € £ ¥ ₹ ₽</p>
          <p>Math: ± × ÷ ≠ ≤ ≥ ∞ ∑ ∫ √</p>
          <p>Greek: α β γ δ π σ θ Ω</p>
          
          <h3>Emojis</h3>
          <p>Smileys: 😀 😃 😄 😊 😍 🤩</p>
          <p>Gestures: 👍 👏 🙌 💪 ✌️ 🤝</p>
          <p>Objects: 💻 📱 📷 ⌚ 💡 🔋</p>
          <p>Nature: 🌵 🌲 🌹 🌸 ⭐ 🌞</p>
          
          <p><strong>Try it:</strong> Use the toolbar buttons to insert more!</p>
        `})]})},ao={render:()=>S("div",{children:[S(J,{style:{marginBottom:"20px",padding:"15px",background:"#f1f8e9",borderRadius:"4px"},children:[h("h4",{style:{margin:"0 0 10px 0"},children:"📊 Table Plugin"}),h("p",{style:{margin:0,fontSize:"14px"},children:"Create and edit tables with the table button in the toolbar."})]}),h(X,{plugins:Q,statusbar:{enabled:!0},defaultValue:`
          <h2>Tables</h2>
          <p>Below is an example table:</p>
          
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                <th style="padding: 8px; background: #f5f5f5;">Feature</th>
                <th style="padding: 8px; background: #f5f5f5;">Status</th>
                <th style="padding: 8px; background: #f5f5f5;">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px;">Web Component</td>
                <td style="padding: 8px;">✅ Complete</td>
                <td style="padding: 8px;">100% framework-agnostic</td>
              </tr>
              <tr>
                <td style="padding: 8px;">Native Plugins</td>
                <td style="padding: 8px;">✅ Complete</td>
                <td style="padding: 8px;">29 plugins available</td>
              </tr>
              <tr>
                <td style="padding: 8px;">Bundle Size</td>
                <td style="padding: 8px;">✅ Optimized</td>
                <td style="padding: 8px;">115 KB (91% reduction)</td>
              </tr>
            </tbody>
          </table>
          
          <p><strong>Try it:</strong> Click the table button to create a new table!</p>
        `})]})},io={render:()=>{const[e,t]=Ne.useState(""),[r,n]=Ne.useState("");return S("div",{children:[S(J,{style:{marginBottom:"20px",padding:"15px",background:"#fff9c4",borderRadius:"4px"},children:[h("h4",{style:{margin:"0 0 10px 0"},children:"👥 Multiple Editors"}),h("p",{style:{margin:"0 0 10px 0",fontSize:"14px"},children:"Two independent editor instances with content synchronization."}),S(ji,{style:{display:"flex",gap:"10px"},children:[h("button",{onClick:()=>{n(e)},style:{padding:"8px 16px"},children:"Sync A → B"}),h("button",{onClick:()=>{t(r)},style:{padding:"8px 16px"},children:"Sync B → A"})]})]}),S(aa,{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"},children:[S("div",{children:[h("h4",{children:"Editor A"}),h(X,{plugins:Q,toolbar:{showMoreOptions:!1},statusbar:{enabled:!0},onChange:t,defaultValue:"<h3>Editor A</h3><p>Type here...</p>"})]}),S("div",{children:[h("h4",{children:"Editor B"}),h(X,{plugins:Q,toolbar:{showMoreOptions:!1},statusbar:{enabled:!0},value:r,onChange:n,defaultValue:"<h3>Editor B</h3><p>Type here...</p>"})]})]})]})}},lo={render:()=>{const[e,t]=Ne.useState(`
      <h2>Controlled Editor</h2>
      <p>This editor's content is controlled by React state.</p>
    `);return S("div",{children:[S(J,{style:{marginBottom:"20px",padding:"15px",background:"#e0f2f1",borderRadius:"4px"},children:[h("h4",{style:{margin:"0 0 10px 0"},children:"🎛️ Controlled Component"}),S(ji,{style:{display:"flex",gap:"10px"},children:[h("button",{onClick:()=>{t(`
        <h2>Reset!</h2>
        <p>Content was reset at ${new Date().toLocaleTimeString()}</p>
      `)},style:{padding:"8px 16px"},children:"Reset Content"}),h("button",{onClick:()=>{t(o=>o+`<p>Appended at ${new Date().toLocaleTimeString()}</p>`)},style:{padding:"8px 16px"},children:"Append Content"})]})]}),h(X,{plugins:Q,statusbar:{enabled:!0},value:e,onChange:t})]})}},so={render:()=>S("div",{children:[S(J,{style:{marginBottom:"20px",padding:"15px",background:"#ffebee",borderRadius:"4px"},children:[h("h4",{style:{margin:"0 0 10px 0"},children:"⚡ Performance Test"}),h("p",{style:{margin:0,fontSize:"14px"},children:"This editor contains 100 sections (300+ paragraphs) to test performance with large documents."})]}),h(X,{plugins:Q,statusbar:{enabled:!0},defaultValue:(()=>{let t="<h1>Large Document Performance Test</h1>";t+="<p><strong>This document contains 100 paragraphs to test performance.</strong></p>";for(let r=1;r<=100;r++)t+=`<h3>Section ${r}</h3>`,t+=`<p>This is paragraph ${r}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`,r%10===0&&(t+=`<blockquote>Milestone: Completed ${r} sections!</blockquote>`);return t})()})]})},co={render:()=>S("div",{children:[S(J,{style:{marginBottom:"20px",padding:"15px",background:"#f3e5f5",borderRadius:"4px"},children:[h("h3",{style:{margin:"0 0 10px 0"},children:"🌐 Framework Independence"}),h("p",{style:{margin:0,fontSize:"14px"},children:"This same editor can be used in React (shown here), Vue, Angular, Svelte, or vanilla JavaScript!"}),S(aa,{style:{marginTop:"15px",display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"10px",fontSize:"13px"},children:[S(J,{style:{padding:"10px",background:"white",borderRadius:"4px"},children:[h("strong",{children:"React:"}),h("br",{}),h("code",{style:{fontSize:"11px"},children:"<EditoraEditor />"})]}),S(J,{style:{padding:"10px",background:"white",borderRadius:"4px"},children:[h("strong",{children:"Vanilla JS:"}),h("br",{}),h("code",{style:{fontSize:"11px"},children:"<editora-editor>"})]}),S(J,{style:{padding:"10px",background:"white",borderRadius:"4px"},children:[h("strong",{children:"Vue:"}),h("br",{}),h("code",{style:{fontSize:"11px"},children:"<editora-editor>"})]}),S(J,{style:{padding:"10px",background:"white",borderRadius:"4px"},children:[h("strong",{children:"Angular:"}),h("br",{}),h("code",{style:{fontSize:"11px"},children:"<editora-editor>"})]})]})]}),h(X,{plugins:Q,statusbar:{enabled:!0},defaultValue:`
          <h2>🚀 Universal Editor</h2>
          <p><strong>Zero framework dependencies!</strong></p>
          
          <h3>✅ Works With:</h3>
          <ul>
            <li>React (this example)</li>
            <li>Vue.js</li>
            <li>Angular</li>
            <li>Svelte</li>
            <li>Vanilla JavaScript</li>
            <li>Any web framework</li>
          </ul>
          
          <h3>📦 Bundle Benefits:</h3>
          <ul>
            <li><strong>115 KB</strong> minified</li>
            <li><strong>28.65 KB</strong> gzipped</li>
            <li><strong>91% smaller</strong> than before</li>
            <li>No React in production bundle</li>
          </ul>
          
          <blockquote>
            "Build once, use everywhere!"
          </blockquote>
        `})]})},uo={render:()=>S("div",{children:[S(J,{style:{marginBottom:"16px",padding:"14px",background:"#ecfdf5",borderRadius:"8px"},children:[h("h4",{style:{margin:"0 0 8px 0"},children:"📐 Doc Schema Test Scenario"}),S("p",{style:{margin:0,fontSize:"13px"},children:["Use ",h("code",{children:"Ctrl/Cmd+Alt+Shift+G"})," to open schema panel, run validation, and insert missing sections."]})]}),h(X,{plugins:Q,statusbar:{enabled:!0,position:"bottom"},defaultValue:`
          <h2>Q2 Access Control Policy Draft</h2>
          <h3>Policy Statement</h3>
          <p>All production access must be approved and logged.</p>
          <h3>Controls</h3>
          <p>Access reviews run monthly. Emergency access expires in 24 hours.</p>
        `})]})},fo={render:()=>S("div",{children:[S(J,{style:{marginBottom:"16px",padding:"14px",background:"#eff6ff",borderRadius:"8px"},children:[h("h4",{style:{margin:"0 0 8px 0"},children:"🌍 Translation Workflow Test Scenario"}),S("p",{style:{margin:0,fontSize:"13px"},children:["Use ",h("code",{children:"Ctrl/Cmd+Alt+Shift+L"})," to open panel, capture source, lock approved segments, and run locale QA."]})]}),h(X,{plugins:Q,statusbar:{enabled:!0,position:"bottom"},defaultValue:`
          <h2>Release Notes v4.8</h2>
          <p>Welcome {{firstName}}! Your order ID is %ORDER_ID%.</p>
          <p>Click <strong>Upgrade Now</strong> to activate premium analytics.</p>
          <p>For support, contact support@acme.com within 24 hours.</p>
        `})]})};var qd,_d,Fd;Q.parameters={...Q.parameters,docs:{...(qd=Q.parameters)==null?void 0:qd.docs,source:{originalSource:`[BoldPlugin(), ItalicPlugin(), UnderlinePlugin(), StrikethroughPlugin(), ClearFormattingPlugin(),
// ParagraphPlugin removed - paragraph option is in HeadingPlugin dropdown
HeadingPlugin(), BlockquotePlugin(), CodePlugin(), CodeSamplePlugin(), ListPlugin(), ChecklistPlugin(), TextAlignmentPlugin(), IndentPlugin(), DirectionPlugin(), TextColorPlugin(), BackgroundColorPlugin(), FontSizePlugin(), FontFamilyPlugin(), LineHeightPlugin(), CapitalizationPlugin(), LinkPlugin(), TablePlugin(), AnchorPlugin(), EmbedIframePlugin(), MathPlugin(), MediaManagerPlugin(), MergeTagPlugin(), PageBreakPlugin(), PrintPlugin(), PreviewPlugin(), SpecialCharactersPlugin(), SpellCheckPlugin(), EmojisPlugin(), A11yCheckerPlugin(), CommentsPlugin(), DocumentManagerPlugin(), FullscreenPlugin(), TemplatePlugin(), HistoryPlugin(), FootnotePlugin(), TrackChangesPlugin(), VersionDiffPlugin(), ConditionalContentPlugin(), DataBindingPlugin({
  data: {
    user: {
      firstName: "Ava",
      lastName: "Miller"
    },
    order: {
      total: 1234.56,
      createdAt: "2026-03-03T12:00:00Z"
    }
  }
}), ContentRulesPlugin({
  bannedWords: ["obviously", "simply"],
  requiredHeadings: ["Summary"],
  maxSentenceWords: 28,
  minReadabilityScore: 55,
  enableRealtime: true
}), CitationsPlugin({
  defaultStyle: "apa",
  enableFootnoteSync: true
}), ApprovalWorkflowPlugin({
  defaultStatus: "draft",
  lockOnApproval: true,
  defaultActor: "Editorial Lead"
}), PIIRedactionPlugin({
  enableRealtime: true,
  redactionMode: "token",
  maxFindings: 120
}), SmartPastePlugin({
  defaultProfile: "balanced",
  maxHtmlLength: 220000
}), BlocksLibraryPlugin({
  maxResults: 120,
  blocks: [{
    id: "incident-summary",
    label: "Incident Summary Block",
    category: "Operations",
    tags: ["incident", "summary"],
    keywords: ["postmortem", "rca"],
    html: "<h3>Incident Summary</h3><p>Describe impact, timeline, and customer exposure.</p>"
  }, {
    id: "risk-register-entry",
    label: "Risk Register Entry",
    category: "Compliance",
    tags: ["risk", "governance"],
    keywords: ["mitigation", "owner"],
    html: "<h3>Risk Register Entry</h3><p><strong>Risk:</strong> <em>Describe risk here.</em></p><p><strong>Mitigation:</strong> Define mitigation owner and due date.</p>"
  }, {
    id: "release-rollback",
    label: "Release Rollback Plan",
    category: "Engineering",
    tags: ["release", "rollback"],
    keywords: ["deployment", "runbook"],
    html: "<h3>Rollback Plan</h3><ol><li>Pause rollout</li><li>Revert deployment</li><li>Validate service health</li></ol>"
  }]
}), DocSchemaPlugin({
  defaultSchemaId: "policy",
  enableRealtime: true,
  schemas: [{
    id: "policy",
    label: "Policy",
    strictOrder: true,
    allowUnknownHeadings: true,
    sections: [{
      title: "Policy Statement"
    }, {
      title: "Applicability",
      aliases: ["Scope"]
    }, {
      title: "Controls"
    }, {
      title: "Exceptions"
    }, {
      title: "Enforcement"
    }]
  }]
}), TranslationWorkflowPlugin({
  sourceLocale: "en-US",
  targetLocale: "fr-FR",
  enableRealtime: true,
  locales: ["en-US", "fr-FR", "de-DE", "es-ES", "ja-JP"]
}), SlashCommandsPlugin(), MentionPlugin({
  items: [{
    id: "john.doe",
    label: "John Doe",
    meta: "john@acme.com"
  }, {
    id: "sarah.lee",
    label: "Sarah Lee",
    meta: "sarah@acme.com"
  }, {
    id: "ops.team",
    label: "Ops Team",
    meta: "team"
  }]
})]`,...(Fd=(_d=Q.parameters)==null?void 0:_d.docs)==null?void 0:Fd.source}}};var jd,Vd,Kd,Wd,Ud;Zn.parameters={...Zn.parameters,docs:{...(jd=Zn.parameters)==null?void 0:jd.docs,source:{originalSource:`{
  render: () => <EditoraEditor plugins={allNativePlugins} statusbar={{
    enabled: true,
    position: "bottom"
  }} floatingToolbar={true} defaultValue={\`
        <h2>Welcome to Editora!!</h2>
        <p>This is a <strong>framework-agnostic</strong> rich text editor with <mark style="background: #ffeb3b;">39 native plugins</mark>.</p>
        <p>✨ <strong>Key Features:</strong></p>
        <ul>
          <li>Zero framework dependencies</li>
          <li>115 KB minified (28.65 KB gzipped)</li>
          <li>91% smaller than before!</li>
          <li>Works with React, Vue, Angular, Svelte</li>
        </ul>
        <p>Try editing this content!</p>
      \`} />
}`,...(Kd=(Vd=Zn.parameters)==null?void 0:Vd.docs)==null?void 0:Kd.source},description:{story:`Basic usage with default configuration
All 39 native plugins loaded automatically`,...(Ud=(Wd=Zn.parameters)==null?void 0:Wd.docs)==null?void 0:Ud.description}}};var Gd,Zd,Yd,Xd,Jd;Yn.parameters={...Yn.parameters,docs:{...(Gd=Yn.parameters)==null?void 0:Gd.docs,source:{originalSource:`{
  render: () => {
    const editorRef = useRef<any>(null);
    const [output, setOutput] = useState("");
    const [pluginCount, setPluginCount] = useState(0);
    const [version, setVersion] = useState("");
    useEffect(() => {
      // Access the global Editora object
      if (typeof window !== 'undefined' && (window as any).Editora) {
        const Editora = (window as any).Editora;
        setVersion(Editora.version || "N/A");
        setPluginCount(Editora.plugins?.length || 0);
      }
    }, []);
    const getContent = () => {
      if (editorRef.current) {
        const content = editorRef.current.innerHTML;
        setOutput(content);
      }
    };
    const setContent = () => {
      if (editorRef.current) {
        editorRef.current.innerHTML = \`
          <h3>Content Set via API!</h3>
          <p>Updated at: \${new Date().toLocaleTimeString()}</p>
          <p>This was set using the Web Component API.</p>
        \`;
      }
    };
    return <div>
        <Box style={{
        marginBottom: "20px",
        padding: "15px",
        background: "#f5f5f5",
        borderRadius: "4px"
      }}>
          <h4 style={{
          margin: "0 0 10px 0"
        }}>🌐 Global Editora API</h4>
          <p style={{
          margin: "5px 0"
        }}>Version: <strong>{version}</strong></p>
          <p style={{
          margin: "5px 0"
        }}>Plugins Available: <strong>{pluginCount}</strong></p>
          <Flex style={{
          marginTop: "10px",
          display: "flex",
          gap: "10px"
        }}>
            <button onClick={getContent} style={{
            padding: "8px 16px"
          }}>Get Content</button>
            <button onClick={setContent} style={{
            padding: "8px 16px"
          }}>Set Content</button>
          </Flex>
        </Box>

        <div ref={editorRef}>
          <EditoraEditor plugins={allNativePlugins} statusbar={{
          enabled: true
        }} defaultValue={\`
              <h3>Web Component API Demo</h3>
              <p>This editor can be controlled via the global <code>window.Editora</code> object.</p>
              <p>Try the buttons above to interact with the editor programmatically!</p>
            \`} />
        </div>

        {output && <Box style={{
        marginTop: "20px",
        padding: "15px",
        background: "#e8f5e9",
        borderRadius: "4px"
      }}>
            <h4 style={{
          margin: "0 0 10px 0"
        }}>📄 Output:</h4>
            <pre style={{
          overflow: "auto",
          fontSize: "12px"
        }}>{output}</pre>
          </Box>}
      </div>;
  }
}`,...(Yd=(Zd=Yn.parameters)==null?void 0:Zd.docs)==null?void 0:Yd.source},description:{story:`Web Component API - TinyMCE Style Usage
Demonstrates using the global Editora API`,...(Jd=(Xd=Yn.parameters)==null?void 0:Xd.docs)==null?void 0:Jd.description}}};var Qd,eu,tu,ru,nu;Xn.parameters={...Xn.parameters,docs:{...(Qd=Xn.parameters)==null?void 0:Qd.docs,source:{originalSource:`{
  render: () => <div>
      <Box style={{
      marginBottom: "20px",
      padding: "15px",
      background: "#e3f2fd",
      borderRadius: "4px"
    }}>
        <h3 style={{
        margin: "0 0 10px 0"
      }}>🔌 All 32 Native Plugins Loaded</h3>
        <Grid style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
        fontSize: "13px"
      }}>
          <div><strong>Basic Formatting (5):</strong><br />Bold, Italic, Underline, Strikethrough, ClearFormatting</div>
          <div><strong>Block Types (4):</strong><br />Paragraph, Heading, Blockquote, Code</div>
          <div><strong>Lists (2):</strong><br />List, Checklist</div>
          <div><strong>Layout (3):</strong><br />TextAlignment, Indent, Direction</div>
          <div><strong>Typography (6):</strong><br />TextColor, BackgroundColor, FontSize, FontFamily, LineHeight, Capitalization</div>
          <div><strong>Content (6):</strong><br />Link, Image, Table, Anchor, EmbedIframe, Footnote</div>
          <div><strong>Special (3):</strong><br />Math, SpecialCharacters, Emojis</div>
          <div><strong>Tools (4):</strong><br />A11yChecker, Comments, DocumentManager, Fullscreen</div>
          <div><strong>History (1):</strong><br />History</div>
        </Grid>
      </Box>

      <EditoraEditor plugins={allNativePlugins} statusbar={{
      enabled: true
    }} defaultValue={\`
          <h1>🎨 All Plugin Features</h1>
          
          <h2>Basic Formatting</h2>
          <p><strong>Bold</strong>, <em>Italic</em>, <u>Underline</u>, <s>Strikethrough</s></p>
          
          <h2>Typography</h2>
          <p style="color: #e91e63;">Text Color</p>
          <p style="background-color: #ffeb3b;">Background Color</p>
          <p style="font-size: 18px;">Font Size: 18px</p>
          <p style="font-family: 'Courier New';">Font Family: Courier New</p>
          <p style="line-height: 2;">Line Height: 2.0</p>
          
          <h2>Text Alignment</h2>
          <p style="text-align: left;">Left aligned</p>
          <p style="text-align: center;">Center aligned</p>
          <p style="text-align: right;">Right aligned</p>
          <p style="text-align: justify;">Justified text with enough content to wrap and demonstrate the justification effect across multiple lines.</p>
          
          <h2>Lists</h2>
          <ul>
            <li>Bullet list item 1</li>
            <li>Bullet list item 2</li>
          </ul>
          <ol>
            <li>Numbered list item 1</li>
            <li>Numbered list item 2</li>
          </ol>
          
          <h2>Block Quotes</h2>
          <blockquote>
            "This is a blockquote. It can contain multiple paragraphs and formatting."
          </blockquote>
          
          <h2>Code</h2>
          <pre><code>function hello() {
  console.log("Hello, World!");
}</code></pre>
          
          <h2>Links & Media</h2>
          <p><a href="https://example.com">Click here for a link</a></p>
          
          <h2>Tables</h2>
          <table border="1">
            <tr><th>Header 1</th><th>Header 2</th></tr>
            <tr><td>Cell 1</td><td>Cell 2</td></tr>
            <tr><td>Cell 3</td><td>Cell 4</td></tr>
          </table>
          
          <p>Try using the toolbar to test all features! 🚀</p>
        \`} />
    </div>
}`,...(tu=(eu=Xn.parameters)==null?void 0:eu.docs)==null?void 0:tu.source},description:{story:`All 32 Native Plugins Showcase
Demonstrates every available plugin`,...(nu=(ru=Xn.parameters)==null?void 0:ru.docs)==null?void 0:nu.description}}};var ou,au,iu,lu,su;Jn.parameters={...Jn.parameters,docs:{...(ou=Jn.parameters)==null?void 0:ou.docs,source:{originalSource:`{
  render: () => <div>
      <Box style={{
      marginBottom: "20px",
      padding: "15px",
      background: "#fff3e0",
      borderRadius: "4px"
    }}>
        <h4 style={{
        margin: "0 0 10px 0"
      }}>🎨 Custom Toolbar</h4>
        <p style={{
        margin: 0,
        fontSize: "14px"
      }}>Only essential formatting tools are shown in the toolbar.</p>
      </Box>

      <EditoraEditor plugins={[BoldPlugin(), ItalicPlugin(), UnderlinePlugin(), StrikethroughPlugin(), LinkPlugin(), HistoryPlugin()]} statusbar={{
      enabled: true
    }} toolbar={{
      items: "undo redo | bold italic underline strikethrough | link",
      sticky: true
    }} defaultValue={\`
          <h2>Minimal Editor</h2>
          <p>This editor has a <strong>simplified toolbar</strong> with only essential formatting options.</p>
          <p>Perfect for comment sections, chat applications, or simple text input.</p>
        \`} />
    </div>
}`,...(iu=(au=Jn.parameters)==null?void 0:au.docs)==null?void 0:iu.source},description:{story:`Custom Toolbar Configuration
Demonstrates toolbar customization`,...(su=(lu=Jn.parameters)==null?void 0:lu.docs)==null?void 0:su.description}}};var cu,du,uu,fu,pu;Qn.parameters={...Qn.parameters,docs:{...(cu=Qn.parameters)==null?void 0:cu.docs,source:{originalSource:`{
  render: () => {
    const [readonly, setReadonly] = useState(true);
    return <div>
        <Box style={{
        marginBottom: "20px",
        padding: "15px",
        background: "#f3e5f5",
        borderRadius: "4px"
      }}>
          <h4 style={{
          margin: "0 0 10px 0"
        }}>🔒 Readonly Mode</h4>
          <button onClick={() => setReadonly(!readonly)} style={{
          padding: "8px 16px"
        }}>
            {readonly ? "Enable Editing" : "Disable Editing"}
          </button>
        </Box>

        <EditoraEditor plugins={allNativePlugins} statusbar={{
        enabled: true
      }} readonly={readonly} defaultValue={\`
            <h2>Readonly Content</h2>
            <p>This content is <strong>\${readonly ? "readonly" : "editable"}</strong>.</p>
            <p>Click the button above to toggle editing mode.</p>
            <ul>
              <li>Perfect for previewing documents</li>
              <li>Displaying formatted content</li>
              <li>Review mode in collaborative editing</li>
            </ul>
          \`} />
      </div>;
  }
}`,...(uu=(du=Qn.parameters)==null?void 0:du.docs)==null?void 0:uu.source},description:{story:`Readonly Mode
Demonstrates readonly editor for viewing content`,...(pu=(fu=Qn.parameters)==null?void 0:fu.docs)==null?void 0:pu.description}}};var mu,gu,bu,hu,yu;eo.parameters={...eo.parameters,docs:{...(mu=eo.parameters)==null?void 0:mu.docs,source:{originalSource:`{
  render: () => {
    return <div>
        <Box style={{
        marginBottom: "20px",
        padding: "15px",
        background: "#e3f2fd",
        borderRadius: "4px"
      }}>
          <h4 style={{
          margin: "0 0 10px 0"
        }}>🧪 Test 6: Placeholder</h4>
          <p style={{
          margin: 0,
          fontSize: "14px"
        }}>
            Three placeholder examples: simple, detailed guidance, and
            prefilled-content fallback.
          </p>
        </Box>

        <Grid style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "16px"
      }}>
          <div>
            <h4 style={{
            margin: "0 0 8px 0"
          }}>Simple Placeholder</h4>
            <EditoraEditor plugins={[BoldPlugin(), ItalicPlugin()]} toolbar={{
            items: "bold italic",
            showMoreOptions: false
          }} statusbar={{
            enabled: true
          }} placeholder="Type something here..." />
          </div>

          <div>
            <h4 style={{
            margin: "0 0 8px 0"
          }}>Detailed Placeholder</h4>
            <EditoraEditor plugins={[BoldPlugin(), ItalicPlugin(), UnderlinePlugin()]} toolbar={{
            items: "bold italic underline",
            showMoreOptions: false
          }} statusbar={{
            enabled: true
          }} placeholder="Draft release notes: summary, impact, migration steps, and rollback plan." />
          </div>

          <div>
            <h4 style={{
            margin: "0 0 8px 0"
          }}>Prefilled Then Clear</h4>
            <EditoraEditor plugins={[BoldPlugin(), ItalicPlugin()]} toolbar={{
            items: "bold italic",
            showMoreOptions: false
          }} statusbar={{
            enabled: true
          }} placeholder="Delete all content to show this placeholder." defaultValue="<p>This editor starts with content. Clear it to reveal placeholder.</p>" />
          </div>
        </Grid>
      </div>;
  }
}`,...(bu=(gu=eo.parameters)==null?void 0:gu.docs)==null?void 0:bu.source},description:{story:`Test 6: Placeholder
Shows multiple placeholder examples in editor instances`,...(yu=(hu=eo.parameters)==null?void 0:hu.docs)==null?void 0:yu.description}}};var xu,vu,ku,wu,Eu;to.parameters={...to.parameters,docs:{...(xu=to.parameters)==null?void 0:xu.docs,source:{originalSource:`{
  render: () => {
    const [themeA, setThemeA] = useState<"default" | "dark" | "acme">("default");
    const [themeB, setThemeB] = useState<"default" | "dark" | "acme">("dark");
    const cycleTheme = (theme: "default" | "dark" | "acme") => {
      if (theme === "default") return "dark";
      if (theme === "dark") return "acme";
      return "default";
    };
    return <div>
        <Box style={{
        marginBottom: "20px",
        padding: "15px",
        background: "#ede7f6",
        borderRadius: "4px"
      }}>
          <h4 style={{
          margin: "0 0 10px 0"
        }}>🎨 Test 7: Theme Switcher (Editor Only)</h4>
          <p style={{
          margin: "0 0 12px 0",
          fontSize: "14px"
        }}>
            Switches only editor themes using wrapper-level attributes (\`data-theme\`).
          </p>
          <Flex style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap"
        }}>
            <button onClick={() => setThemeA(cycleTheme(themeA))} style={{
            padding: "8px 16px"
          }}>
              Cycle Editor A
            </button>
            <button onClick={() => setThemeB(cycleTheme(themeB))} style={{
            padding: "8px 16px"
          }}>
              Cycle Editor B
            </button>
            <button onClick={() => {
            setThemeA("dark");
            setThemeB("dark");
          }} style={{
            padding: "8px 16px"
          }}>
              Set Both Dark
            </button>
            <button onClick={() => {
            setThemeA("default");
            setThemeB("default");
          }} style={{
            padding: "8px 16px"
          }}>
              Set Both Default
            </button>
            <button onClick={() => {
            setThemeA("acme");
            setThemeB("acme");
          }} style={{
            padding: "8px 16px"
          }}>
              Set Both Acme
            </button>
          </Flex>
          <p style={{
          margin: "12px 0 0 0",
          fontSize: "13px"
        }}>
            Current themes: <strong>Editor A = {themeA}</strong>, <strong>Editor B = {themeB}</strong>
          </p>
        </Box>

        <Grid style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px"
      }}>
          <div data-theme={themeA} style={{
          padding: "10px",
          borderRadius: "8px",
          background: themeA === "dark" ? "#0b1220" : themeA === "acme" ? "#eef4fb" : "#ffffff"
        }}>
            <h4 style={{
            margin: "0 0 8px 0",
            color: themeA === "dark" ? "#f8fafc" : themeA === "acme" ? "#0f4f4a" : "#111827"
          }}>
              Editor A
            </h4>
            <EditoraEditor plugins={allNativePlugins} toolbar={{
            showMoreOptions: false
          }} statusbar={{
            enabled: true
          }} floatingToolbar={true} defaultValue="<p>Editor A theme is controlled independently.</p>" />
          </div>

          <div data-theme={themeB} style={{
          padding: "10px",
          borderRadius: "8px",
          background: themeB === "dark" ? "#0b1220" : themeB === "acme" ? "#eef4fb" : "#ffffff"
        }}>
            <h4 style={{
            margin: "0 0 8px 0",
            color: themeB === "dark" ? "#f8fafc" : themeB === "acme" ? "#0f4f4a" : "#111827"
          }}>
              Editor B
            </h4>
            <EditoraEditor plugins={allNativePlugins} toolbar={{
            showMoreOptions: false
          }} statusbar={{
            enabled: true
          }} floatingToolbar={true} defaultValue="<p>Editor B can use a different theme from Editor A.</p>" />
          </div>
        </Grid>
      </div>;
  }
}`,...(ku=(vu=to.parameters)==null?void 0:vu.docs)==null?void 0:ku.source},description:{story:`Test 7: Theme Switcher (Editor Only)
Toggles theme on editor wrappers without changing Storybook page theme`,...(Eu=(wu=to.parameters)==null?void 0:wu.docs)==null?void 0:Eu.description}}};var Cu,Su,Tu,Lu,$u;ro.parameters={...ro.parameters,docs:{...(Cu=ro.parameters)==null?void 0:Cu.docs,source:{originalSource:`{
  render: () => {
    const [content, setContent] = useState("");
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const handleChange = (html: string) => {
      setContent(html);
      const text = html.replace(/<[^>]*>/g, "").trim();
      setWordCount(text.split(/\\s+/).filter(Boolean).length);
      setCharCount(text.length);
    };
    return <div>
        <EditoraEditor plugins={allNativePlugins} statusbar={{
        enabled: true
      }} onChange={handleChange} defaultValue={\`
            <h2>Try typing here!</h2>
            <p>Watch the statistics update in real-time as you type.</p>
          \`} />

        <Box style={{
        marginTop: "20px",
        padding: "15px",
        background: "#e8f5e9",
        borderRadius: "4px"
      }}>
          <h4 style={{
          margin: "0 0 10px 0"
        }}>📊 Statistics</h4>
          <p style={{
          margin: "5px 0"
        }}>Words: <strong>{wordCount}</strong></p>
          <p style={{
          margin: "5px 0"
        }}>Characters: <strong>{charCount}</strong></p>
          <details style={{
          marginTop: "10px"
        }}>
            <summary style={{
            cursor: "pointer"
          }}>Show HTML</summary>
            <pre style={{
            fontSize: "12px",
            overflow: "auto",
            marginTop: "10px"
          }}>{content}</pre>
          </details>
        </Box>
      </div>;
  }
}`,...(Tu=(Su=ro.parameters)==null?void 0:Su.docs)==null?void 0:Tu.source},description:{story:`Event Handling
Demonstrates onChange events and content tracking`,...($u=(Lu=ro.parameters)==null?void 0:Lu.docs)==null?void 0:$u.description}}};var Au,Mu,Ru,Du,Nu;no.parameters={...no.parameters,docs:{...(Au=no.parameters)==null?void 0:Au.docs,source:{originalSource:`{
  render: () => <div>
      <Box style={{
      marginBottom: "20px",
      padding: "15px",
      background: "#e1f5fe",
      borderRadius: "4px"
    }}>
        <h4 style={{
        margin: "0 0 10px 0"
      }}>🔢 Math Plugin</h4>
        <p style={{
        margin: 0,
        fontSize: "14px"
      }}>
          Insert mathematical equations using LaTeX notation. Click the Math button in the toolbar (fx).
        </p>
      </Box>

      <EditoraEditor plugins={allNativePlugins} statusbar={{
      enabled: true
    }} defaultValue={\`
          <h2>Mathematical Equations</h2>
          <p>Inline equation: <span data-math-inline="true" data-latex="E = mc^2" class="math-inline">$E = mc^2$</span></p>
          
          <p>Block equation:</p>
          <div data-math-block="true" data-latex="\\\\sum_{i=1}^{n} i = \\\\frac{n(n+1)}{2}" class="math-block">
            $$\\\\sum_{i=1}^{n} i = \\\\frac{n(n+1)}{2}$$
          </div>
          
          <p>Pythagorean theorem: <span data-math-inline="true" data-latex="a^2 + b^2 = c^2" class="math-inline">$a^2 + b^2 = c^2$</span></p>
          
          <p><strong>Try it:</strong> Use Cmd/Ctrl-Shift-M to open the math dialog!</p>
        \`} />
    </div>
}`,...(Ru=(Mu=no.parameters)==null?void 0:Mu.docs)==null?void 0:Ru.source},description:{story:`Math Equations
Demonstrates the Math plugin with LaTeX support`,...(Nu=(Du=no.parameters)==null?void 0:Du.docs)==null?void 0:Nu.description}}};var Bu,Pu,Iu,Hu,Ou;oo.parameters={...oo.parameters,docs:{...(Bu=oo.parameters)==null?void 0:Bu.docs,source:{originalSource:`{
  render: () => <div>
      <Box style={{
      marginBottom: "20px",
      padding: "15px",
      background: "#fce4ec",
      borderRadius: "4px"
    }}>
        <h4 style={{
        margin: "0 0 10px 0"
      }}>✨ Special Characters & Emojis</h4>
        <p style={{
        margin: 0,
        fontSize: "14px"
      }}>
          Insert special characters (Cmd/Ctrl-Shift-S) and emojis (Cmd/Ctrl-Shift-J).
        </p>
      </Box>

      <EditoraEditor plugins={allNativePlugins} statusbar={{
      enabled: true
    }} defaultValue={\`
          <h2>Special Characters & Emojis</h2>
          
          <h3>Special Characters</h3>
          <p>Common: © ® ™ § ¶ † ‡ • ★</p>
          <p>Arrows: → ← ↑ ↓ ↔ ⇒ ⇐</p>
          <p>Currency: $ € £ ¥ ₹ ₽</p>
          <p>Math: ± × ÷ ≠ ≤ ≥ ∞ ∑ ∫ √</p>
          <p>Greek: α β γ δ π σ θ Ω</p>
          
          <h3>Emojis</h3>
          <p>Smileys: 😀 😃 😄 😊 😍 🤩</p>
          <p>Gestures: 👍 👏 🙌 💪 ✌️ 🤝</p>
          <p>Objects: 💻 📱 📷 ⌚ 💡 🔋</p>
          <p>Nature: 🌵 🌲 🌹 🌸 ⭐ 🌞</p>
          
          <p><strong>Try it:</strong> Use the toolbar buttons to insert more!</p>
        \`} />
    </div>
}`,...(Iu=(Pu=oo.parameters)==null?void 0:Pu.docs)==null?void 0:Iu.source},description:{story:`Special Characters & Emojis
Demonstrates special character and emoji insertion`,...(Ou=(Hu=oo.parameters)==null?void 0:Hu.docs)==null?void 0:Ou.description}}};var zu,qu,_u,Fu,ju;ao.parameters={...ao.parameters,docs:{...(zu=ao.parameters)==null?void 0:zu.docs,source:{originalSource:`{
  render: () => <div>
      <Box style={{
      marginBottom: "20px",
      padding: "15px",
      background: "#f1f8e9",
      borderRadius: "4px"
    }}>
        <h4 style={{
        margin: "0 0 10px 0"
      }}>📊 Table Plugin</h4>
        <p style={{
        margin: 0,
        fontSize: "14px"
      }}>
          Create and edit tables with the table button in the toolbar.
        </p>
      </Box>

      <EditoraEditor plugins={allNativePlugins} statusbar={{
      enabled: true
    }} defaultValue={\`
          <h2>Tables</h2>
          <p>Below is an example table:</p>
          
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                <th style="padding: 8px; background: #f5f5f5;">Feature</th>
                <th style="padding: 8px; background: #f5f5f5;">Status</th>
                <th style="padding: 8px; background: #f5f5f5;">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px;">Web Component</td>
                <td style="padding: 8px;">✅ Complete</td>
                <td style="padding: 8px;">100% framework-agnostic</td>
              </tr>
              <tr>
                <td style="padding: 8px;">Native Plugins</td>
                <td style="padding: 8px;">✅ Complete</td>
                <td style="padding: 8px;">29 plugins available</td>
              </tr>
              <tr>
                <td style="padding: 8px;">Bundle Size</td>
                <td style="padding: 8px;">✅ Optimized</td>
                <td style="padding: 8px;">115 KB (91% reduction)</td>
              </tr>
            </tbody>
          </table>
          
          <p><strong>Try it:</strong> Click the table button to create a new table!</p>
        \`} />
    </div>
}`,...(_u=(qu=ao.parameters)==null?void 0:qu.docs)==null?void 0:_u.source},description:{story:`Tables
Demonstrates table creation and editing`,...(ju=(Fu=ao.parameters)==null?void 0:Fu.docs)==null?void 0:ju.description}}};var Vu,Ku,Wu,Uu,Gu;io.parameters={...io.parameters,docs:{...(Vu=io.parameters)==null?void 0:Vu.docs,source:{originalSource:`{
  render: () => {
    const [contentA, setContentA] = useState("");
    const [contentB, setContentB] = useState("");
    const syncAtoB = () => {
      setContentB(contentA);
    };
    const syncBtoA = () => {
      setContentA(contentB);
    };
    return <div>
        <Box style={{
        marginBottom: "20px",
        padding: "15px",
        background: "#fff9c4",
        borderRadius: "4px"
      }}>
          <h4 style={{
          margin: "0 0 10px 0"
        }}>👥 Multiple Editors</h4>
          <p style={{
          margin: "0 0 10px 0",
          fontSize: "14px"
        }}>
            Two independent editor instances with content synchronization.
          </p>
          <Flex style={{
          display: "flex",
          gap: "10px"
        }}>
            <button onClick={syncAtoB} style={{
            padding: "8px 16px"
          }}>Sync A → B</button>
            <button onClick={syncBtoA} style={{
            padding: "8px 16px"
          }}>Sync B → A</button>
          </Flex>
        </Box>

        <Grid style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px"
      }}>
          <div>
            <h4>Editor A</h4>
            <EditoraEditor plugins={allNativePlugins} toolbar={{
            showMoreOptions: false
          }} statusbar={{
            enabled: true
          }} onChange={setContentA} defaultValue="<h3>Editor A</h3><p>Type here...</p>" />
          </div>
          <div>
            <h4>Editor B</h4>
            <EditoraEditor plugins={allNativePlugins} toolbar={{
            showMoreOptions: false
          }} statusbar={{
            enabled: true
          }} value={contentB} onChange={setContentB} defaultValue="<h3>Editor B</h3><p>Type here...</p>" />
          </div>
        </Grid>
      </div>;
  }
}`,...(Wu=(Ku=io.parameters)==null?void 0:Ku.docs)==null?void 0:Wu.source},description:{story:`Multiple Editors
Demonstrates multiple editor instances on one page`,...(Gu=(Uu=io.parameters)==null?void 0:Uu.docs)==null?void 0:Gu.description}}};var Zu,Yu,Xu,Ju,Qu;lo.parameters={...lo.parameters,docs:{...(Zu=lo.parameters)==null?void 0:Zu.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState(\`
      <h2>Controlled Editor</h2>
      <p>This editor's content is controlled by React state.</p>
    \`);
    const resetContent = () => {
      setValue(\`
        <h2>Reset!</h2>
        <p>Content was reset at \${new Date().toLocaleTimeString()}</p>
      \`);
    };
    const appendContent = () => {
      setValue(prev => prev + \`<p>Appended at \${new Date().toLocaleTimeString()}</p>\`);
    };
    return <div>
        <Box style={{
        marginBottom: "20px",
        padding: "15px",
        background: "#e0f2f1",
        borderRadius: "4px"
      }}>
          <h4 style={{
          margin: "0 0 10px 0"
        }}>🎛️ Controlled Component</h4>
          <Flex style={{
          display: "flex",
          gap: "10px"
        }}>
            <button onClick={resetContent} style={{
            padding: "8px 16px"
          }}>Reset Content</button>
            <button onClick={appendContent} style={{
            padding: "8px 16px"
          }}>Append Content</button>
          </Flex>
        </Box>

        <EditoraEditor plugins={allNativePlugins} statusbar={{
        enabled: true
      }} value={value} onChange={setValue} />
      </div>;
  }
}`,...(Xu=(Yu=lo.parameters)==null?void 0:Yu.docs)==null?void 0:Xu.source},description:{story:`Controlled Editor
Demonstrates controlled component pattern`,...(Qu=(Ju=lo.parameters)==null?void 0:Ju.docs)==null?void 0:Qu.description}}};var ef,tf,rf,nf,of;so.parameters={...so.parameters,docs:{...(ef=so.parameters)==null?void 0:ef.docs,source:{originalSource:`{
  render: () => {
    const generateLargeContent = () => {
      let content = "<h1>Large Document Performance Test</h1>";
      content += "<p><strong>This document contains 100 paragraphs to test performance.</strong></p>";
      for (let i = 1; i <= 100; i++) {
        content += \`<h3>Section \${i}</h3>\`;
        content += \`<p>This is paragraph \${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>\`;
        if (i % 10 === 0) {
          content += \`<blockquote>Milestone: Completed \${i} sections!</blockquote>\`;
        }
      }
      return content;
    };
    return <div>
        <Box style={{
        marginBottom: "20px",
        padding: "15px",
        background: "#ffebee",
        borderRadius: "4px"
      }}>
          <h4 style={{
          margin: "0 0 10px 0"
        }}>⚡ Performance Test</h4>
          <p style={{
          margin: 0,
          fontSize: "14px"
        }}>
            This editor contains 100 sections (300+ paragraphs) to test performance with large documents.
          </p>
        </Box>

        <EditoraEditor plugins={allNativePlugins} statusbar={{
        enabled: true
      }} defaultValue={generateLargeContent()} />
      </div>;
  }
}`,...(rf=(tf=so.parameters)==null?void 0:tf.docs)==null?void 0:rf.source},description:{story:`Performance - Large Document
Tests editor with large content`,...(of=(nf=so.parameters)==null?void 0:nf.docs)==null?void 0:of.description}}};var af,lf,sf,cf,df;co.parameters={...co.parameters,docs:{...(af=co.parameters)==null?void 0:af.docs,source:{originalSource:`{
  render: () => <div>
      <Box style={{
      marginBottom: "20px",
      padding: "15px",
      background: "#f3e5f5",
      borderRadius: "4px"
    }}>
        <h3 style={{
        margin: "0 0 10px 0"
      }}>🌐 Framework Independence</h3>
        <p style={{
        margin: 0,
        fontSize: "14px"
      }}>
          This same editor can be used in React (shown here), Vue, Angular, Svelte, or vanilla JavaScript!
        </p>
        
        <Grid style={{
        marginTop: "15px",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "10px",
        fontSize: "13px"
      }}>
          <Box style={{
          padding: "10px",
          background: "white",
          borderRadius: "4px"
        }}>
            <strong>React:</strong><br />
            <code style={{
            fontSize: "11px"
          }}>&lt;EditoraEditor /&gt;</code>
          </Box>
          <Box style={{
          padding: "10px",
          background: "white",
          borderRadius: "4px"
        }}>
            <strong>Vanilla JS:</strong><br />
            <code style={{
            fontSize: "11px"
          }}>&lt;editora-editor&gt;</code>
          </Box>
          <Box style={{
          padding: "10px",
          background: "white",
          borderRadius: "4px"
        }}>
            <strong>Vue:</strong><br />
            <code style={{
            fontSize: "11px"
          }}>&lt;editora-editor&gt;</code>
          </Box>
          <Box style={{
          padding: "10px",
          background: "white",
          borderRadius: "4px"
        }}>
            <strong>Angular:</strong><br />
            <code style={{
            fontSize: "11px"
          }}>&lt;editora-editor&gt;</code>
          </Box>
        </Grid>
      </Box>

      <EditoraEditor plugins={allNativePlugins} statusbar={{
      enabled: true
    }} defaultValue={\`
          <h2>🚀 Universal Editor</h2>
          <p><strong>Zero framework dependencies!</strong></p>
          
          <h3>✅ Works With:</h3>
          <ul>
            <li>React (this example)</li>
            <li>Vue.js</li>
            <li>Angular</li>
            <li>Svelte</li>
            <li>Vanilla JavaScript</li>
            <li>Any web framework</li>
          </ul>
          
          <h3>📦 Bundle Benefits:</h3>
          <ul>
            <li><strong>115 KB</strong> minified</li>
            <li><strong>28.65 KB</strong> gzipped</li>
            <li><strong>91% smaller</strong> than before</li>
            <li>No React in production bundle</li>
          </ul>
          
          <blockquote>
            "Build once, use everywhere!"
          </blockquote>
        \`} />
    </div>
}`,...(sf=(lf=co.parameters)==null?void 0:lf.docs)==null?void 0:sf.source},description:{story:`Framework Independence Demo
Shows that the same editor works in different contexts`,...(df=(cf=co.parameters)==null?void 0:cf.docs)==null?void 0:df.description}}};var uf,ff,pf,mf,gf;uo.parameters={...uo.parameters,docs:{...(uf=uo.parameters)==null?void 0:uf.docs,source:{originalSource:`{
  render: () => <div>
      <Box style={{
      marginBottom: "16px",
      padding: "14px",
      background: "#ecfdf5",
      borderRadius: "8px"
    }}>
        <h4 style={{
        margin: "0 0 8px 0"
      }}>📐 Doc Schema Test Scenario</h4>
        <p style={{
        margin: 0,
        fontSize: "13px"
      }}>
          Use <code>Ctrl/Cmd+Alt+Shift+G</code> to open schema panel, run validation, and insert missing sections.
        </p>
      </Box>

      <EditoraEditor plugins={allNativePlugins} statusbar={{
      enabled: true,
      position: "bottom"
    }} defaultValue={\`
          <h2>Q2 Access Control Policy Draft</h2>
          <h3>Policy Statement</h3>
          <p>All production access must be approved and logged.</p>
          <h3>Controls</h3>
          <p>Access reviews run monthly. Emergency access expires in 24 hours.</p>
        \`} />
    </div>
}`,...(pf=(ff=uo.parameters)==null?void 0:ff.docs)==null?void 0:pf.source},description:{story:`Doc Schema Workflow Scenario
Structured authoring flow for policy/governance documents.`,...(gf=(mf=uo.parameters)==null?void 0:mf.docs)==null?void 0:gf.description}}};var bf,hf,yf,xf,vf;fo.parameters={...fo.parameters,docs:{...(bf=fo.parameters)==null?void 0:bf.docs,source:{originalSource:`{
  render: () => <div>
      <Box style={{
      marginBottom: "16px",
      padding: "14px",
      background: "#eff6ff",
      borderRadius: "8px"
    }}>
        <h4 style={{
        margin: "0 0 8px 0"
      }}>🌍 Translation Workflow Test Scenario</h4>
        <p style={{
        margin: 0,
        fontSize: "13px"
      }}>
          Use <code>Ctrl/Cmd+Alt+Shift+L</code> to open panel, capture source, lock approved segments, and run locale QA.
        </p>
      </Box>

      <EditoraEditor plugins={allNativePlugins} statusbar={{
      enabled: true,
      position: "bottom"
    }} defaultValue={\`
          <h2>Release Notes v4.8</h2>
          <p>Welcome {{firstName}}! Your order ID is %ORDER_ID%.</p>
          <p>Click <strong>Upgrade Now</strong> to activate premium analytics.</p>
          <p>For support, contact support@acme.com within 24 hours.</p>
        \`} />
    </div>
}`,...(yf=(hf=fo.parameters)==null?void 0:hf.docs)==null?void 0:yf.source},description:{story:`Translation Workflow Scenario
Localization QA with segment locking + source-target validation.`,...(vf=(xf=fo.parameters)==null?void 0:xf.docs)==null?void 0:vf.description}}};const Hk=["allNativePlugins","Basic","WebComponentAPI","AllPluginsShowcase","CustomToolbar","ReadonlyMode","Test6Placeholder","Test7ThemeSwitcherEditorOnly","EventHandling","MathEquations","SpecialContent","Tables","MultipleEditors","ControlledEditor","PerformanceLargeDocument","FrameworkIndependence","DocSchemaWorkflow","TranslationWorkflowScenario"];export{Xn as AllPluginsShowcase,Zn as Basic,lo as ControlledEditor,Jn as CustomToolbar,uo as DocSchemaWorkflow,ro as EventHandling,co as FrameworkIndependence,no as MathEquations,io as MultipleEditors,so as PerformanceLargeDocument,Qn as ReadonlyMode,oo as SpecialContent,ao as Tables,eo as Test6Placeholder,to as Test7ThemeSwitcherEditorOnly,fo as TranslationWorkflowScenario,Yn as WebComponentAPI,Hk as __namedExportsOrder,Q as allNativePlugins,Ik as default};
