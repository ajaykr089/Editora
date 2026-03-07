import{a as y,j as S,B as ee,F as kl,G as Aa}from"./index-5f82d582.js";import{r as Ie}from"./index-93f6b7ae.js";import{R as Q}from"./RichTextEditor-35a6b422.js";/* empty css                *//* empty css             */import{c as qg,d as _g,f as mp,g as gp,p as Fg,B as Oo,I as zo,U as Gs,a as jg,L as Vg,e as Wg,h as Kg,i as Ug,b as bp,T as Gg,j as Zg,M as Yg,A as Xg,F as Jg,H as hp}from"./A11yCheckerPlugin.native-187d1946.js";import{S as yp,a as Qg,B as eb,C as tb,T as nb,F as rb,b as ob}from"./TextAlignmentPlugin.native-60e8d515.js";import{T as ab,A as ib}from"./ApprovalWorkflowPlugin.native-eaed16b3.js";import{P as lb}from"./PIIRedactionPlugin.native-6cafc2ca.js";import{_ as Wl}from"./iframe-23402cb8.js";import"./index-d132a59e.js";import"./SearchExtension-5db95884.js";import"../sb-preview/runtime.js";const _c="__editoraCommandEditorRoot",sb=e=>{if(!e)return null;const t=e.querySelector('[contenteditable="true"]');return t instanceof HTMLElement?t:null},cb=()=>{if(typeof window>"u")return null;const e=window[_c];if(!(e instanceof HTMLElement))return null;window[_c]=null;const t=e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(e.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?e:null);if(t){const r=sb(t);if(r)return r;if(t.getAttribute("contenteditable")==="true")return t}if(e.getAttribute("contenteditable")==="true")return e;const n=e.closest('[contenteditable="true"]');return n instanceof HTMLElement?n:null},db=()=>{const e=cb();if(e&&document.contains(e))return e;const t=window.getSelection();if(t&&t.rangeCount>0){let r=t.getRangeAt(0).startContainer;for(;r&&r!==document.body;){if(r.nodeType===Node.ELEMENT_NODE){const o=r;if(o.getAttribute("contenteditable")==="true")return o}r=r.parentNode}}const n=document.activeElement;if(n){if(n.getAttribute("contenteditable")==="true")return n;const r=n.closest('[contenteditable="true"]');if(r)return r}return document.querySelector('[contenteditable="true"]')},ub=e=>e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null,fb=e=>{const t=window.getSelection();if(!t||t.rangeCount===0)return null;const n=t.getRangeAt(0);return e.contains(n.commonAncestorContainer)?n:null},Fc=e=>{e.dispatchEvent(new Event("input",{bubbles:!0}))},jc=(e,t)=>{if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}},co=(e,t)=>{if(!e.isConnected){t.focus({preventScroll:!0});return}const n=window.getSelection();if(!n)return;const r=document.createRange();r.selectNodeContents(e),r.collapse(!1),n.removeAllRanges();try{n.addRange(r)}catch{t.focus({preventScroll:!0});return}t.focus({preventScroll:!0})},pb=e=>{let t=e.querySelector(":scope > p");if(!t){t=document.createElement("p");const n=[];e.childNodes.forEach(r=>{r.nodeType===Node.ELEMENT_NODE&&["UL","OL"].includes(r.tagName)||n.push(r)}),n.forEach(r=>t.appendChild(r)),e.insertBefore(t,e.firstChild)}return t.innerHTML.trim()||(t.innerHTML="<br>"),t},Fa=e=>{const t=document.createElement("li");t.setAttribute("data-type","checklist-item"),t.setAttribute("data-checked","false");const n=document.createElement("p");return n.innerHTML=e.trim()||"<br>",t.appendChild(n),t},Kl=e=>Array.from(e.children).filter(t=>t instanceof HTMLLIElement),mb=new Set(["P","DIV","H1","H2","H3","H4","H5","H6","BLOCKQUOTE","PRE","LI"]),Ul=e=>mb.has(e.tagName)&&e.getAttribute("contenteditable")!=="true",gb=(e,t)=>{const n=[],r=new Set,o=c=>{!c||r.has(c)||t.contains(c)&&Ul(c)&&(c.closest("ul, ol")||(r.add(c),n.push(c)))},a=c=>{let d=c;for(;d&&d!==document.body;){if(d.nodeType===Node.ELEMENT_NODE){const u=d;if(Ul(u))return u;if(u.getAttribute("contenteditable")==="true")break}d=d.parentNode}return null};if(e.collapsed)return o(a(e.startContainer)),n;const i=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT,{acceptNode:c=>{const d=c;if(!Ul(d)||d.closest("ul, ol"))return NodeFilter.FILTER_SKIP;if(typeof e.intersectsNode=="function")return e.intersectsNode(d)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;const u=document.createRange();return u.selectNodeContents(d),e.compareBoundaryPoints(Range.END_TO_START,u)>0&&e.compareBoundaryPoints(Range.START_TO_END,u)<0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});let l=i.nextNode();for(;l;)o(l),l=i.nextNode();if(n.length===0&&o(a(e.commonAncestorContainer)),n.length<=1)return n;const s=n.filter(c=>!n.some(d=>d!==c&&c.contains(d)));return s.length>0?s:n},bb=e=>{const t=[],n=document.createElement("div"),r=()=>{const o=n.innerHTML.trim();if(!o)return;const a=document.createElement("p");a.innerHTML=o,t.push(a),n.innerHTML=""};if(e.childNodes.forEach(o=>{if(o.nodeType===Node.ELEMENT_NODE&&["UL","OL"].includes(o.tagName)){r();return}if(o.nodeType===Node.ELEMENT_NODE&&o.tagName==="P"){r();const a=o.innerHTML.trim(),i=document.createElement("p");i.innerHTML=a||"<br>",t.push(i);return}o.nodeType===Node.TEXT_NODE&&!(o.textContent||"").trim()||n.appendChild(o.cloneNode(!0))}),r(),t.length===0){const o=document.createElement("p");o.innerHTML="<br>",t.push(o)}return t},hb=()=>({name:"checklist",init:()=>{if(typeof document>"u"||typeof window>"u"||window.__checklistPluginClickInitialized)return;window.__checklistPluginClickInitialized=!0;const e=t=>{const r=t.target.closest('li[data-type="checklist-item"]');if(!r)return;const o=r.getBoundingClientRect();if(!(t.clientX-o.left<32))return;t.preventDefault(),t.stopPropagation();const l=r.closest("[contenteditable], .rte-content, .editora-content");if((l==null?void 0:l.getAttribute("contenteditable"))==="false"||!!(l!=null&&l.closest('[data-readonly="true"], .editora-editor[readonly], editora-editor[readonly]')))return;const c=(l==null?void 0:l.innerHTML)||"",d=r.getAttribute("data-checked")==="true";r.setAttribute("data-checked",(!d).toString()),l&&(jc(l,c),Fc(l))};document.addEventListener("click",e)},nodes:{checklist:{content:"checklistItem+",group:"block",parseDOM:[{tag:'ul[data-type="checklist"]'}],toDOM:()=>["ul",{"data-type":"checklist"},0]},checklistItem:{content:"paragraph",attrs:{checked:{default:!1}},parseDOM:[{tag:'li[data-type="checklist-item"]',getAttrs:e=>({checked:e.getAttribute("data-checked")==="true"})}],toDOM:e=>{var t;return["li",{"data-type":"checklist-item","data-checked":(t=e==null?void 0:e.attrs)!=null&&t.checked?"true":"false"},0]}}},toolbar:[{label:"Checklist",command:"toggleChecklist",icon:'<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 4.48h-.71L2 3.43l.71-.7.69.68L4.81 2l.71.71-1.77 1.77zM6.99 3h8v1h-8V3zm0 3h8v1h-8V6zm8 3h-8v1h8V9zm-8 3h8v1h-8v-1zM3.04 7.48h.71l1.77-1.77-.71-.7L3.4 6.42l-.69-.69-.71.71 1.04 1.04zm.71 3.01h-.71L2 9.45l.71-.71.69.69 1.41-1.42.71.71-1.77 1.77zm-.71 3.01h.71l1.77-1.77-.71-.71-1.41 1.42-.69-.69-.71.7 1.04 1.05z"></path></g></svg>',shortcut:"Mod-Shift-9"}],commands:{toggleChecklist:()=>{try{const e=db();if(!e)return!1;const t=e.innerHTML,n=()=>(jc(e,t),Fc(e),!0),r=fb(e);if(!r)return!1;const o=ub(r.startContainer);if(!o)return!1;const a=o.closest('ul[data-type="checklist"]');if(a&&e.contains(a)){const f=Kl(a);if(f.length===0)return!1;const m=document.createDocumentFragment();let g=null;return f.forEach((p,b)=>{const h=bb(p);h.forEach(x=>{m.appendChild(x),!g&&(p.contains(r.startContainer)||b===0)&&(g=x)}),!g&&b===0&&h[0]&&(g=h[0])}),a.replaceWith(m),g&&co(g,e),n()}const i=o.closest("ul, ol");if(i&&e.contains(i)){let f;if(i.tagName.toLowerCase()==="ul")f=i;else{for(f=document.createElement("ul");i.firstChild;)f.appendChild(i.firstChild);i.replaceWith(f)}f.setAttribute("data-type","checklist");let m=Kl(f);m.length===0&&(f.appendChild(Fa("")),m=Kl(f));let g=null;m.forEach(b=>{b.setAttribute("data-type","checklist-item"),b.hasAttribute("data-checked")||b.setAttribute("data-checked","false");const h=pb(b);b.contains(r.startContainer)&&(g=h)});const p=f.querySelector(':scope > li[data-type="checklist-item"] > p');return co(g||p||f,e),n()}const l=gb(r,e);if(l.length>1){const f=document.createElement("ul");f.setAttribute("data-type","checklist"),l.forEach(p=>{f.appendChild(Fa(p.innerHTML))}),l[0].replaceWith(f),l.slice(1).forEach(p=>{p.isConnected&&p.remove()});const g=f.querySelector(':scope > li[data-type="checklist-item"] > p');return g&&co(g,e),n()}const s=l[0]||o.closest("p, h1, h2, h3, h4, h5, h6, blockquote, pre");if(s&&s!==e){const f=document.createElement("ul");f.setAttribute("data-type","checklist");const m=Fa(s.innerHTML);f.appendChild(m),s.replaceWith(f);const g=m.querySelector(":scope > p");return g&&co(g,e),n()}const c=document.createElement("ul");c.setAttribute("data-type","checklist");const d=Fa("");c.appendChild(d),r.deleteContents(),r.insertNode(c);const u=d.querySelector(":scope > p");return u&&co(u,e),n()}catch(e){return console.error("Failed to toggle checklist:",e),!1}}},keymap:{"Mod-Shift-9":"toggleChecklist"}});let pe=null,Zs=null,$n=null,Ys=null,Be="#ffff00";const uo='[data-theme="dark"], .dark, .editora-theme-dark',yb=["#000000","#ffffff","#808080","#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ffa500","#800080","#ffc0cb"];function xp(){const e=window.getSelection();if(e&&e.rangeCount>0){const r=e.getRangeAt(0).startContainer,o=r.nodeType===Node.ELEMENT_NODE?r:r.parentElement;if(o){const a=o.closest('[data-editora-editor="true"], .rte-editor, .editora-editor');if(a)return a}}const t=document.activeElement;return t?t.closest('[data-editora-editor="true"], .rte-editor, .editora-editor'):null}function xb(e){const t=window.__editoraLastCommand,n=window.__editoraLastCommandButton;if(t===e&&n&&n.isConnected){const i=window.getComputedStyle(n),l=n.getBoundingClientRect();if(i.display!=="none"&&i.visibility!=="hidden"&&i.pointerEvents!=="none"&&!(l.width===0&&l.height===0))return n}const r=i=>{for(const l of i){const s=window.getComputedStyle(l),c=l.getBoundingClientRect();if(!(s.display==="none"||s.visibility==="hidden"||s.pointerEvents==="none")&&!(c.width===0&&c.height===0))return l}return null},o=xp();if(o){const i=Array.from(o.querySelectorAll(`[data-command="${e}"]`)),l=r(i);if(l)return l}const a=Array.from(document.querySelectorAll(`[data-command="${e}"]`));return r(a)}function vb(e){if(e!=null&&e.closest(uo))return!0;const t=window.getSelection();if(t&&t.rangeCount>0){const r=t.getRangeAt(0).startContainer,o=r.nodeType===Node.ELEMENT_NODE?r:r.parentElement;if(o!=null&&o.closest(uo))return!0}const n=document.activeElement;return n!=null&&n.closest(uo)?!0:document.body.matches(uo)||document.documentElement.matches(uo)}function kb(){if(document.getElementById("rte-bg-color-picker-styles"))return;const e=document.createElement("style");e.id="rte-bg-color-picker-styles",e.textContent=`
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
  `,document.head.appendChild(e)}function wb(){const e=document.createElement("div");e.className="rte-bg-color-picker",vb(Zs)&&e.classList.add("rte-theme-dark"),e.addEventListener("click",h=>h.stopPropagation());const t=document.createElement("div");t.className="rte-bg-color-picker-header";const n=document.createElement("span");n.className="rte-bg-color-picker-title",n.textContent="Background Color";const r=document.createElement("button");r.type="button",r.className="rte-bg-color-picker-close",r.id="rte-bg-color-close",r.setAttribute("aria-label","Close"),r.textContent="×",t.appendChild(n),t.appendChild(r);const o=document.createElement("div");o.className="rte-bg-color-picker-body";const a=document.createElement("div");a.className="rte-bg-color-section";const i=document.createElement("div");i.className="rte-bg-color-preview";const l=document.createElement("div");l.className="rte-bg-color-preview-swatch",l.id="rte-bg-color-preview-swatch";const s=document.createElement("span");s.className="rte-bg-color-preview-hex",s.id="rte-bg-color-preview-hex",i.appendChild(l),i.appendChild(s),a.appendChild(i);const c=document.createElement("div");c.className="rte-bg-color-section";const d=document.createElement("div");d.className="rte-bg-color-section-label",d.textContent="Colors";const u=document.createElement("div");u.className="rte-bg-color-grid",u.id="rte-bg-color-grid",yb.forEach(h=>{const x=document.createElement("button");x.type="button",x.className="rte-bg-color-swatch",x.style.backgroundColor=h,x.dataset.color=h,x.title=h,u.appendChild(x)}),c.appendChild(d),c.appendChild(u);const f=document.createElement("div");f.className="rte-bg-color-section";const m=document.createElement("div");m.className="rte-bg-color-section-label",m.textContent="Custom";const g=document.createElement("div");g.className="rte-bg-color-custom";const p=document.createElement("input");p.type="color",p.className="rte-bg-color-input",p.id="rte-bg-color-input",p.value=Be;const b=document.createElement("input");return b.type="text",b.className="rte-bg-color-text-input",b.id="rte-bg-color-text-input",b.placeholder="#FFFF00",b.value=Be.toUpperCase(),b.maxLength=7,g.appendChild(p),g.appendChild(b),f.appendChild(m),f.appendChild(g),o.appendChild(a),o.appendChild(c),o.appendChild(f),e.appendChild(t),e.appendChild(o),e}function Eb(){if(!pe)return;const e=pe.querySelector("#rte-bg-color-close");e==null||e.addEventListener("click",()=>Jn());const t=pe.querySelector("#rte-bg-color-grid");t&&t.addEventListener("click",o=>{const a=o.target;if(a.classList.contains("rte-bg-color-swatch")){const i=a.dataset.color;i&&(Be=i,vi(i),Jn())}});const n=pe.querySelector("#rte-bg-color-input");n&&(n.addEventListener("change",o=>{const a=o.target.value.toUpperCase();Be=a,vi(a),Jn()}),n.addEventListener("input",o=>{Be=o.target.value.toUpperCase(),ds(),us()}));const r=pe.querySelector("#rte-bg-color-text-input");r&&(r.addEventListener("change",o=>{let a=o.target.value.trim();a&&!a.startsWith("#")&&(a="#"+a),/^#[0-9A-F]{6}$/i.test(a)&&(Be=a.toUpperCase(),vi(Be),Jn())}),r.addEventListener("input",o=>{let a=o.target.value.trim();a&&!a.startsWith("#")&&(a="#"+a,r.value=a),/^#[0-9A-F]{6}$/i.test(a)&&(Be=a.toUpperCase(),ds(),us())}))}function ds(){if(!pe)return;const e=pe.querySelector("#rte-bg-color-preview-swatch"),t=pe.querySelector("#rte-bg-color-preview-hex"),n=pe.querySelector("#rte-bg-color-input"),r=pe.querySelector("#rte-bg-color-text-input");e&&(e.style.backgroundColor=Be),t&&(t.textContent=Be.toUpperCase()),n&&(n.value=Be),r&&(r.value=Be.toUpperCase())}function us(){if(!pe)return;pe.querySelectorAll(".rte-bg-color-swatch").forEach(t=>{const n=t.dataset.color;(n==null?void 0:n.toUpperCase())===Be.toUpperCase()?t.classList.add("selected"):t.classList.remove("selected")})}function Cb(){try{const e=window.getSelection();if(!e||e.rangeCount===0)return"#ffff00";const n=e.getRangeAt(0).commonAncestorContainer,r=n.nodeType===1?n:n.parentElement;if(r){const o=r.closest('[style*="background-color"]');if(o){const a=o.style.backgroundColor;if(a)return Sb(a)}}return"#ffff00"}catch{return"#ffff00"}}function Sb(e){if(e.startsWith("#"))return e.toUpperCase();const t=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(t){const n=parseInt(t[1]),r=parseInt(t[2]),o=parseInt(t[3]);return"#"+[n,r,o].map(a=>{const i=a.toString(16);return i.length===1?"0"+i:i}).join("").toUpperCase()}return"#ffff00"}function vi(e){const t=qg({color:e,className:"rte-bg-color",styleProperty:"backgroundColor",commands:["hiliteColor","backColor"],savedRange:Ys,getActiveEditorRoot:xp,warnMessage:"[BackgroundColor] Could not apply highlight for current selection"});return t&&console.log("[BackgroundColor] Applied color:",e),t}function Jn(){$n&&($n.destroy(),$n=null),pe&&(pe.remove(),pe=null),Zs=null,Ys=null}function Tb(){if(kb(),pe)return Jn(),!0;const e=xb("openBackgroundColorPicker");if(!e)return!1;const t=window.getSelection();return!t||t.isCollapsed?(alert("Please select text to apply background color"),!1):(t.rangeCount>0&&(Ys=t.getRangeAt(0).cloneRange()),Be=Cb(),pe=wb(),document.body.appendChild(pe),Zs=e,$n&&($n.destroy(),$n=null),$n=_g({popover:pe,anchor:e,onClose:Jn,gap:8,margin:8,zIndex:1e4}),ds(),us(),Eb(),!0)}const $b=()=>({name:"backgroundColor",marks:{backgroundColor:{attrs:{color:{default:"#ffffff"}},parseDOM:[{tag:'span[style*="background-color"]',getAttrs:e=>{const r=(e.getAttribute("style")||"").match(/background-color:\s*([^;]+)/);return r?{color:r[1]}:null}},{tag:"mark",getAttrs:e=>({color:e.style.backgroundColor||"#ffff00"})}],toDOM:e=>{var t;return["span",{style:`background-color: ${((t=e.attrs)==null?void 0:t.color)||"#ffffff"}`,class:"rte-bg-color"},0]}}},toolbar:[{label:"Background Color",command:"openBackgroundColorPicker",icon:'<svg width="24" height="24" focusable="false"><g fill-rule="evenodd"><path class="tox-icon-highlight-bg-color__color" d="M3 18h18v3H3z" fill="#000000"></path><path fill-rule="nonzero" d="M7.7 16.7H3l3.3-3.3-.7-.8L10.2 8l4 4.1-4 4.2c-.2.2-.6.2-.8 0l-.6-.7-1.1 1.1zm5-7.5L11 7.4l3-2.9a2 2 0 0 1 2.6 0L18 6c.7.7.7 2 0 2.7l-2.9 2.9-1.8-1.8-.5-.6"></path></g></svg>',shortcut:"Mod-Shift-h"}],commands:{openBackgroundColorPicker:()=>Tb(),setBackgroundColor:e=>e?vi(e):!1},keymap:{"Mod-Shift-h":"openBackgroundColorPicker"}}),Lb=new Set(["P","DIV","H1","H2","H3","H4","H5","H6","LI","BLOCKQUOTE","PRE"]),fs=e=>Lb.has(e.tagName)&&e.getAttribute("contenteditable")!=="true",Ab=()=>{const e=window.getSelection();if(e&&e.rangeCount>0){let n=e.getRangeAt(0).startContainer;for(;n&&n!==document.body;){if(n.nodeType===Node.ELEMENT_NODE){const r=n;if(r.getAttribute("contenteditable")==="true")return r}n=n.parentNode}}const t=document.activeElement;if(t){if(t.getAttribute("contenteditable")==="true")return t;const n=t.closest('[contenteditable="true"]');if(n)return n}return document.querySelector('[contenteditable="true"]')},Vc=e=>{let t=e;for(;t&&t!==document.body;){if(t.nodeType===Node.ELEMENT_NODE){const n=t;if(fs(n))return n;if(n.getAttribute("contenteditable")==="true")break}t=t.parentNode}return null},Mb=(e,t)=>{const n=[],r=new Set,o=l=>{!l||r.has(l)||t.contains(l)&&fs(l)&&(r.add(l),n.push(l))};if(e.collapsed)return o(Vc(e.startContainer)),n;const a=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT,{acceptNode:l=>{const s=l;if(!fs(s))return NodeFilter.FILTER_SKIP;if(typeof e.intersectsNode=="function")return e.intersectsNode(s)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;const c=document.createRange();return c.selectNodeContents(s),e.compareBoundaryPoints(Range.END_TO_START,c)>0&&e.compareBoundaryPoints(Range.START_TO_END,c)<0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});let i=a.nextNode();for(;i;)o(i),i=a.nextNode();return n.length===0&&o(Vc(e.commonAncestorContainer)),n},Rb=(e,t)=>{if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}},Wc=e=>{const t=Ab();if(!t)return!1;const n=window.getSelection();if(!n||n.rangeCount===0)return!1;const r=n.getRangeAt(0);if(!t.contains(r.commonAncestorContainer))return!1;const o=Mb(r,t);if(o.length===0)return!1;const a=t.innerHTML;return o.forEach(i=>{e==="rtl"?i.setAttribute("dir","rtl"):i.removeAttribute("dir")}),Rb(t,a),t.dispatchEvent(new Event("input",{bubbles:!0})),!0},Db=()=>({name:"direction",toolbar:[{label:"Left to Right",command:"setDirectionLTR",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 18H3M21 18L18 21M21 18L18 15M13 3V12M13 3H7M13 3C13.4596 3 13.9148 3.0776 14.3394 3.22836C14.764 3.37913 15.1499 3.6001 15.4749 3.87868C15.7999 4.15726 16.0577 4.48797 16.2336 4.85195C16.4095 5.21593 16.5 5.60603 16.5 6C16.5 6.39397 16.4095 6.78407 16.2336 7.14805C16.0577 7.51203 15.7999 7.84274 15.4749 8.12132C15.1499 8.3999 14.764 8.62087 14.3394 8.77164C13.9148 8.9224 13.4596 9 13 9V3ZM9 3V12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',shortcut:"Mod-Shift-l"},{label:"Right to Left",command:"setDirectionRTL",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 18H21M3 18L6 21M3 18L6 15M11 12V3H17M15 3V12M10.5 3C10.0404 3 9.58525 3.0776 9.16061 3.22836C8.73597 3.37913 8.35013 3.6001 8.02513 3.87868C7.70012 4.15726 7.44231 4.48797 7.26642 4.85195C7.09053 5.21593 7 5.60603 7 6C7 6.39397 7.09053 6.78407 7.26642 7.14805C7.44231 7.51203 7.70012 7.84274 8.02513 8.12132C8.35013 8.3999 8.73597 8.62087 9.16061 8.77164C9.58525 8.9224 10.0404 9 10.5 9L10.5 3Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',shortcut:"Mod-Shift-r"}],commands:{setDirectionLTR:()=>{try{return Wc(null)}catch(e){return console.error("Failed to set LTR direction:",e),!1}},setDirectionRTL:()=>{try{return Wc("rtl")}catch(e){return console.error("Failed to set RTL direction:",e),!1}}},keymap:{"Mod-Shift-l":"setDirectionLTR","Mod-Shift-r":"setDirectionRTL"}}),Nb=()=>{const e=()=>{try{const r=window.getSelection();if(r&&r.rangeCount>0&&!r.isCollapsed){const o=r.getRangeAt(0),i=o.toString().toUpperCase();return o.deleteContents(),o.insertNode(document.createTextNode(i)),!0}return!1}catch(r){return console.error("Failed to convert to uppercase:",r),!1}},t=()=>{try{const r=window.getSelection();if(r&&r.rangeCount>0&&!r.isCollapsed){const o=r.getRangeAt(0),i=o.toString().toLowerCase();return o.deleteContents(),o.insertNode(document.createTextNode(i)),!0}return!1}catch(r){return console.error("Failed to convert to lowercase:",r),!1}},n=()=>{try{const r=window.getSelection();if(r&&r.rangeCount>0&&!r.isCollapsed){const o=r.getRangeAt(0),i=o.toString().replace(/\w\S*/g,l=>l.charAt(0).toUpperCase()+l.substr(1).toLowerCase());return o.deleteContents(),o.insertNode(document.createTextNode(i)),!0}return!1}catch(r){return console.error("Failed to convert to title case:",r),!1}};return{name:"capitalization",toolbar:[{label:"Capitalization",command:"setCapitalization",type:"inline-menu",options:[{label:"lowercase",value:"lowercase"},{label:"UPPERCASE",value:"uppercase"},{label:"Title Case",value:"titlecase"}],icon:'<svg fill="#000000" width="24" height="24" viewBox="0 0 32.00 32.00" id="icon" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.192"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;}</style></defs><title>letter--Aa</title><path d="M23,13H18v2h5v2H19a2,2,0,0,0-2,2v2a2,2,0,0,0,2,2h6V15A2,2,0,0,0,23,13Zm0,8H19V19h4Z"></path><path d="M13,9H9a2,2,0,0,0-2,2V23H9V18h4v5h2V11A2,2,0,0,0,13,9ZM9,16V11h4v5Z"></path><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"></rect></g></svg>'}],commands:{setCapitalization:r=>{if(!r)return!1;switch(r){case"uppercase":return e();case"lowercase":return t();case"titlecase":return n();default:return!1}},toUpperCase:e,toLowerCase:t,toTitleCase:n},keymap:{"Mod-Shift-u":"toUpperCase","Mod-Shift-k":"toLowerCase","Mod-Shift-t":"toTitleCase"}}},Gl={all:{name:"All",characters:["€","£","¥","¢","₹","₽","₩","₿","₺","₴","₦","₨","₪","₫","₭","₮","₯","₰","₱","₲","₳","₴","₵","₶","₷","₹","₺","₼","₽","₾","₿",'"',"'","«","»","„","‟","‹","›","‚","‛","〝","〞","〟","‟","„","©","®","™","°","§","¶","†","‡","•","‣","⁃","‰","‱","′","″","‴","‵","‶","‷","※","‼","‽","‾","‿","⁀","⁁","⁂","⁃","⁇","⁈","⁉","+","-","×","÷","=","≠","≈","≡","≤","≥","<",">","±","∓","∴","∵","∶","∷","∸","∹","∺","∻","∼","∽","∾","∿","≀","≁","≂","≃","≄","≅","≆","≇","≈","≉","≊","≋","≌","≍","≎","≏","≐","≑","≒","≓","≔","≕","≖","≗","≘","≙","≚","≛","≜","≝","≞","≟","≠","≡","≢","≣","≤","≥","≦","≧","≨","≩","≪","≫","≬","≭","≮","≯","≰","≱","≲","≳","≴","≵","≶","≷","≸","≹","≺","≻","≼","≽","≾","≿","À","Á","Â","Ã","Ä","Å","Æ","Ç","È","É","Ê","Ë","Ì","Í","Î","Ï","Ð","Ñ","Ò","Ó","Ô","Õ","Ö","×","Ø","Ù","Ú","Û","Ü","Ý","Þ","ß","à","á","â","ã","ä","å","æ","ç","è","é","ê","ë","ì","í","î","ï","ð","ñ","ò","ó","ô","õ","ö","÷","ø","ù","ú","û","ü","ý","þ","ÿ","¡","¿","‽","‼","⁇","⁈","⁉","※","‾","‿","⁀","⁁","⁂","⁃","←","↑","→","↓","↔","↕","↖","↗","↘","↙","↚","↛","↜","↝","↞","↟","↠","↡","↢","↣","↤","↥","↦","↧","↨","↩","↪","↫","↬","↭","↮","↯","↰","↱","↲","↳","↴","↵","↶","↷","↸","↹","↺","↻","↼","↽","↾","↿","⇀","⇁","⇂","⇃","⇄","⇅","⇆","⇇","⇈","⇉","⇊","⇋","⇌","⇍","⇎","⇏","⇐","⇑","⇒","⇓","⇔","⇕","⇖","⇗","⇘","⇙","⇚","⇛","⇜","⇝","⇞","⇟","⇠","⇡","⇢","⇣","⇤","⇥","⇦","⇧","⇨","⇩","⇪","⇫","⇬","⇭","⇮","⇯","⇰","⇱","⇲","⇳","⇴","⇵","⇶","⇷","⇸","⇹","⇺","⇻","⇼","⇽","⇾","⇿"]},currency:{name:"Currency",characters:["€","£","¥","¢","₹","₽","₩","₿","₺","₴","₦","₨","₪","₫","₭","₮","₯","₰","₱","₲","₳","₵","₶","₷","₼","₾","₿"]},text:{name:"Text",characters:["©","®","™","°","§","¶","†","‡","•","‣","⁃","‰","‱","′","″","‴","‵","‶","‷","※","‼","‽","‾","‿","⁀","⁁","⁂"]},quotation:{name:"Quotation",characters:['"',"'","«","»","„","‟","‹","›","‚","‛","〝","〞","〟"]},mathematical:{name:"Mathematical",characters:["+","-","×","÷","=","≠","≈","≡","≤","≥","<",">","±","∓","∴","∵","∶","∷","∸","∹","∺","∻","∼","∽","∾","∿","≀","≁","≂","≃","≄","≅","≆","≇","≉","≊","≋","≌","≍","≎","≏","≐","≑","≒","≓","≔","≕","≖","≗","≘","≙","≚","≛","≜","≝","≞","≟","≢","≣","≦","≧","≨","≩","≪","≫","≬","≭","≮","≯","≰","≱","≲","≳","≴","≵","≶","≷","≸","≹","≺","≻","≼","≽","≾","≿"]},"extended-latin":{name:"Extended Latin",characters:["À","Á","Â","Ã","Ä","Å","Æ","Ç","È","É","Ê","Ë","Ì","Í","Î","Ï","Ð","Ñ","Ò","Ó","Ô","Õ","Ö","×","Ø","Ù","Ú","Û","Ü","Ý","Þ","ß","à","á","â","ã","ä","å","æ","ç","è","é","ê","ë","ì","í","î","ï","ð","ñ","ò","ó","ô","õ","ö","÷","ø","ù","ú","û","ü","ý","þ","ÿ"]},symbols:{name:"Symbols",characters:["¡","¿","‽","‼","⁇","⁈","⁉","※","‾","‿","⁀","⁁","⁂","⁃"]},arrows:{name:"Arrows",characters:["←","↑","→","↓","↔","↕","↖","↗","↘","↙","↚","↛","↜","↝","↞","↟","↠","↡","↢","↣","↤","↥","↦","↧","↨","↩","↪","↫","↬","↭","↮","↯","↰","↱","↲","↳","↴","↵","↶","↷","↸","↹","↺","↻","↼","↽","↾","↿","⇀","⇁","⇂","⇃","⇄","⇅","⇆","⇇","⇈","⇉","⇊","⇋","⇌","⇍","⇎","⇏","⇐","⇑","⇒","⇓","⇔","⇕","⇖","⇗","⇘","⇙","⇚","⇛","⇜","⇝","⇞","⇟","⇠","⇡","⇢","⇣","⇤","⇥","⇦","⇧","⇨","⇩","⇪","⇫","⇬","⇭","⇮","⇯","⇰","⇱","⇲","⇳","⇴","⇵","⇶","⇷","⇸","⇹","⇺","⇻","⇼","⇽","⇾","⇿"]}},Kc={"€":"euro","£":"pound","¥":"yen","¢":"cent","₹":"rupee","₽":"ruble","₩":"won","₿":"bitcoin",'"':"quote","'":"apostrophe","«":"left angle quote","»":"right angle quote","„":"low quote","©":"copyright","®":"registered","™":"trademark","°":"degree","§":"section","¶":"paragraph","†":"dagger","‡":"double dagger","•":"bullet","‰":"per mille","′":"prime","″":"double prime","+":"plus","-":"minus","×":"multiplication","÷":"division","=":"equals","≠":"not equal","≈":"approximately","≡":"identical","≤":"less or equal","≥":"greater or equal","±":"plus minus",À:"a grave",Á:"a acute",Â:"a circumflex",Ã:"a tilde",Ä:"a diaeresis",Ç:"c cedilla","←":"left arrow","↑":"up arrow","→":"right arrow","↓":"down arrow","↔":"left right arrow"};let Zl=!1;const Bb='[data-theme="dark"], .dark, .editora-theme-dark',vp=()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return null;const t=e.anchorNode,n=t instanceof HTMLElement?t:t==null?void 0:t.parentElement;return(n==null?void 0:n.closest(".rte-content, .editora-content"))||null},Pb=e=>{const t=e||vp();return t?!!t.closest(Bb):!1},Ib=()=>{if(typeof document>"u")return;const e="special-characters-plugin-styles";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
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
  `,document.head.appendChild(t)},Hb=e=>{const t=window.getSelection();if(t&&t.rangeCount>0){const n=t.getRangeAt(0);n.deleteContents();const r=document.createTextNode(e);n.insertNode(r),n.setStartAfter(r),n.setEndAfter(r),t.removeAllRanges(),t.addRange(n)}},Ob=e=>{if(typeof window>"u"||Zl)return;Zl=!0,Ib();let t="all",n="",r=null;const o=document.createElement("div");o.className="special-characters-overlay",Pb(e)&&o.classList.add("rte-ui-theme-dark");const a=document.createElement("div");a.className="special-characters-dialog",a.setAttribute("role","dialog"),a.setAttribute("aria-modal","true"),a.innerHTML=`
    <div class="special-characters-header">
      <h2>Insert Special Characters</h2>
      <button class="special-characters-close">×</button>
    </div>
    <div class="special-characters-content">
      <div class="special-characters-tabs">
        ${Object.keys(Gl).map(p=>`
          <button class="special-characters-tab ${t===p?"active":""}" data-category="${p}">
            ${Gl[p].name}
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
  `;const i=a.querySelector(".special-characters-tabs"),l=a.querySelector(".special-characters-grid"),s=a.querySelector(".special-characters-search-input"),c=a.querySelector(".special-characters-close"),d=()=>Gl[t].characters.filter(p=>{if(!n.trim())return!0;const b=n.toLowerCase();return p.toLowerCase().includes(b)||(Kc[p]||"").toLowerCase().includes(b)}),u=()=>{i==null||i.querySelectorAll(".special-characters-tab").forEach(p=>{p.classList.toggle("active",p.getAttribute("data-category")===t)})},f=()=>{if(!l)return;const p=d();if(p.length===0){l.innerHTML=`<div class="special-characters-no-results">No characters found for "${n}"</div>`;return}l.innerHTML=p.map(b=>`
      <button class="special-characters-item" data-char="${b}" title="${Kc[b]||b}">
        ${b}
      </button>
    `).join("")},m=()=>{r!==null&&(window.clearTimeout(r),r=null),o.parentNode&&o.parentNode.removeChild(o),Zl=!1,document.removeEventListener("keydown",g,!0)},g=p=>{p.key==="Escape"&&(p.preventDefault(),p.stopPropagation(),m())};c==null||c.addEventListener("click",m),i==null||i.addEventListener("click",p=>{const h=p.target.closest(".special-characters-tab");if(!h)return;const x=h.getAttribute("data-category");!x||t===x||(t=x,u(),f())}),s==null||s.addEventListener("input",p=>{n=p.target.value,r!==null&&window.clearTimeout(r),r=window.setTimeout(()=>{r=null,f()},90)}),l==null||l.addEventListener("click",p=>{const h=p.target.closest(".special-characters-item");if(!h)return;const x=h.getAttribute("data-char");x&&(Hb(x),m())}),o.addEventListener("click",p=>{p.target===o&&m()}),document.addEventListener("keydown",g,!0),u(),f(),o.appendChild(a),document.body.appendChild(o),requestAnimationFrame(()=>s==null?void 0:s.focus())},zb=()=>({name:"specialCharacters",toolbar:[{label:"Special Characters",command:"insertSpecialCharacter",icon:'<svg width="24" height="24" focusable="false"><path d="M15 18h4l1-2v4h-6v-3.3l1.4-1a6 6 0 0 0 1.8-2.9 6.3 6.3 0 0 0-.1-4.1 5.8 5.8 0 0 0-3-3.2c-.6-.3-1.3-.5-2.1-.5a5.1 5.1 0 0 0-3.9 1.8 6.3 6.3 0 0 0-1.3 6 6.2 6.2 0 0 0 1.8 3l1.4.9V20H4v-4l1 2h4v-.5l-2-1L5.4 15A6.5 6.5 0 0 1 4 11c0-1 .2-1.9.6-2.7A7 7 0 0 1 6.3 6C7.1 5.4 8 5 9 4.5c1-.3 2-.5 3.1-.5a8.8 8.8 0 0 1 5.7 2 7 7 0 0 1 1.7 2.3 6 6 0 0 1 .2 4.8c-.2.7-.6 1.3-1 1.9a7.6 7.6 0 0 1-3.6 2.5v.5Z" fill-rule="evenodd"></path></svg>'}],commands:{insertSpecialCharacter:(e,t)=>{const n=(t==null?void 0:t.contentElement)instanceof HTMLElement?t.contentElement:vp();return Ob(n),!0}},keymap:{}}),ps={all:{name:"All",emojis:["❤️","💔","💙","💚","💛","🖤","🤍","🤎","✔️","❌","☑️","❗","❓","⚠️","💯","➕","➖","✖️","➗","♻️","⚡","🔥","✨","⭐","⭕","🚫","😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😍","😘","😎","🤓","😐","😑","😬","🙄","😏","😌","🤩","🥳","🤔","😴","😭","😢","😡","🤯","👍","👎","👌","✌️","🤞","🙏","👏","🙌","💪","🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦅","🦄","🐝","🦋","🌲","🌳","🌴","🌵","🌸","🌼","🌻","☀️","🌙","⭐","🌈","🌧️","❄️","🌊","🍎","🍌","🍉","🍇","🍓","🍒","🍍","🥭","🍐","🍊","🍋","🍑","🥝","🥑","🍔","🍟","🍕","🌭","🥪","🌮","🌯","🍣","🍜","🍰","🧁","🍩","🍪","🍫","☕","🍵","🥤","🍺","🍷","🍸","🍹","🥂","⚽","🏀","🏈","⚾","🎾","🏐","🏉","🎮","🎯","🎳","🎲","♟️","🏃","🚴","🏊","🏋️","🧘","🎸","🎹","🥁","🎺","🎤","🏆","🥇","🚗","🚕","🚌","🚎","🚓","🚑","🚒","✈️","🚀","🚁","🚤","🛳️","🚢","🏠","🏢","🏬","🏫","🏥","🏰","🗼","🗽","⛩️","🕌","🌍","🌎","🌏","🏖️","🏝️","📱","💻","🖥️","⌨️","🖱️","📷","📸","🎥","📹","📚","📖","📝","📄","📂","🔒","🔑","🗝️","💡","🔦","🕯️","🧰","🛠️","🔧","⚙️","📦","💳","💰","🔋","🔌","🇮🇳","🇺🇸","🇬🇧","🇨🇦","🇦🇺","🇩🇪","🇫🇷","🇪🇸","🇮🇹","🇯🇵","🇰🇷","🇨🇳","🇧🇷","🇲🇽","🇷🇺","🇿🇦","🇳🇿"]},symbols:{name:"Symbols",emojis:["❤️","💔","💙","💚","💛","🖤","🤍","🤎","✔️","❌","☑️","❗","❓","⚠️","💯","➕","➖","✖️","➗","♻️","⚡","🔥","✨","⭐","⭕","🚫","⬆️","⬇️","⬅️","➡️","🔄","🔁","🔀","🔔","🔕","⏰","⌛","⏳"]},people:{name:"People",emojis:["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😍","😘","😎","🤓","😐","😑","😬","🙄","😏","😌","🤩","🥳","🤔","😴","😭","😢","😡","🤯","👍","👎","👌","✌️","🤞","🙏","👏","🙌","💪"]},"animals-nature":{name:"Animals & Nature",emojis:["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦅","🦄","🐝","🦋","🌲","🌳","🌴","🌵","🌸","🌼","🌻","☀️","🌙","⭐","🌈","🌧️","❄️","🌊"]},"food-drink":{name:"Food & Drink",emojis:["🍎","🍌","🍉","🍇","🍓","🍒","🍍","🥭","🍐","🍊","🍋","🍑","🥝","🥑","🍔","🍟","🍕","🌭","🥪","🌮","🌯","🍣","🍜","🍰","🧁","🍩","🍪","🍫","☕","🍵","🥤","🍺","🍷","🍸","🍹","🥂"]},activity:{name:"Activity",emojis:["⚽","🏀","🏈","⚾","🎾","🏐","🏉","🎮","🎯","🎳","🎲","♟️","🏃","🚴","🏊","🏋️","🧘","🎸","🎹","🥁","🎺","🎤","🏆","🥇","🥈","🥉"]},"travel-places":{name:"Travel & Places",emojis:["🚗","🚕","🚌","🚎","🚓","🚑","🚒","✈️","🚀","🚁","🚤","🛳️","🚢","🏠","🏢","🏬","🏫","🏥","🏰","🗼","🗽","⛩️","🕌","🌍","🌎","🌏","🏖️","🏝️"]},objects:{name:"Objects",emojis:["📱","💻","🖥️","⌨️","🖱️","📷","📸","🎥","📹","📚","📖","📝","📄","📂","🔒","🔑","🗝️","💡","🔦","🕯️","🧰","🛠️","🔧","⚙️","📦","💳","💰","🔋","🔌"]},flags:{name:"Flags",emojis:["🇮🇳","🇺🇸","🇬🇧","🇨🇦","🇦🇺","🇩🇪","🇫🇷","🇪🇸","🇮🇹","🇯🇵","🇰🇷","🇨🇳","🇧🇷","🇲🇽","🇷🇺","🇿🇦","🇳🇿"]}},qb={"💙":"blue heart","💚":"green heart","💛":"yellow heart","🖤":"black heart","🤍":"white heart","🤎":"brown heart","☑️":"check box with check","🔴":"red circle","🟢":"green circle","🟡":"yellow circle","🔵":"blue circle","⬆️":"up arrow","⬇️":"down arrow","⬅️":"left arrow","➡️":"right arrow","🔄":"counterclockwise arrows","🔁":"repeat button","🔀":"shuffle tracks","🔔":"bell","🔕":"muted bell","⏰":"alarm clock","⏳":"hourglass not done","⌛":"hourglass done","♠️":"spade suit","♥️":"heart suit","♦️":"diamond suit","♣️":"club suit","🚫":"prohibited","⭕":"hollow red circle","❎":"cross mark button","😐":"neutral face","😑":"expressionless face","😬":"grimacing face","🙄":"face with rolling eyes","😏":"smirking face","😌":"relieved face","🤩":"star struck","😜":"winking face with tongue","😝":"squinting face with tongue","🤪":"zany face","😢":"crying face","😥":"sad but relieved face","😓":"downcast face with sweat","😱":"face screaming in fear","😨":"fearful face","🤗":"hugging face","🤭":"face with hand over mouth","🤫":"shushing face","🤥":"lying face","👌":"ok hand","✌️":"victory hand","🤞":"crossed fingers","🙌":"raising hands","💪":"flexed biceps","🐔":"chicken","🐧":"penguin","🐦":"bird","🐤":"baby chick","🦆":"duck","🦅":"eagle","🐺":"wolf","🦄":"unicorn","🐝":"honeybee","🐞":"lady beetle","🦋":"butterfly","🐢":"turtle","🐍":"snake","🦖":"t-rex","🌿":"herb","🍀":"four leaf clover","🍁":"maple leaf","🍂":"fallen leaf","🌊":"water wave","❄️":"snowflake","☁️":"cloud","⛈️":"cloud with lightning and rain","🌪️":"tornado","🍐":"pear","🍊":"tangerine","🍋":"lemon","🍑":"peach","🥝":"kiwi fruit","🥑":"avocado","🍆":"eggplant","🌽":"ear of corn","🥕":"carrot","🥔":"potato","🍞":"bread","🥐":"croissant","🥖":"baguette bread","🧀":"cheese wedge","🍖":"meat on bone","🍗":"poultry leg","🥩":"cut of meat","🍦":"soft ice cream","🍨":"ice cream","🍫":"chocolate bar","🍬":"candy","🥛":"glass of milk","🧃":"beverage box","🍹":"tropical drink","🥂":"clinking glasses","🏓":"ping pong","🥊":"boxing glove","🥋":"martial arts uniform","⛳":"flag in hole","🏹":"bow and arrow","🎿":"skis","⛷️":"skier","🏂":"snowboarder","🎤":"microphone","🎬":"clapper board","🎨":"artist palette","🧩":"puzzle piece","🪀":"yo-yo","🚇":"metro","🚉":"station","🚊":"tram","🚝":"monorail","🛻":"pickup truck","🚐":"minibus","🗺️":"world map","🧭":"compass","⛰️":"mountain","🏔️":"snow capped mountain","🌋":"volcano","🏜️":"desert","🏕️":"camping","🏙️":"cityscape","🌆":"city at dusk","🌃":"night with stars","📦":"package","📫":"closed mailbox with raised flag","📬":"open mailbox with raised flag","📭":"open mailbox with lowered flag","🧾":"receipt","💳":"credit card","💰":"money bag","🪙":"coin","🔋":"battery","🔌":"electric plug","🧯":"fire extinguisher","🪜":"ladder","🪞":"mirror","🧹":"broom","🧸":"teddy bear"};let ki=null,qo="all",Fi="",Ln=null,_o=null,Fo=null;const _b='[data-theme="dark"], .dark, .editora-theme-dark',Fb=()=>({name:"emojis",toolbar:[{label:"Insert Emoji",command:"openEmojiDialog",icon:'<svg width="24" height="24" focusable="false"><path d="M9 11c.6 0 1-.4 1-1s-.4-1-1-1a1 1 0 0 0-1 1c0 .6.4 1 1 1Zm6 0c.6 0 1-.4 1-1s-.4-1-1-1a1 1 0 0 0-1 1c0 .6.4 1 1 1Zm-3 5.5c2.1 0 4-1.5 4.4-3.5H7.6c.5 2 2.3 3.5 4.4 3.5ZM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" fill-rule="nonzero"></path></svg>',shortcut:"Mod-Shift-j",type:"button"}],commands:{openEmojiDialog:(e,t)=>{const n=(t==null?void 0:t.contentElement)||ms();return n?(jb(n),!0):!1},insertEmoji:(e,t)=>{if(!e)return!1;const n=(t==null?void 0:t.contentElement)||ms();if(!n)return!1;try{return Ep(e,n),!0}catch{return!1}}},keymap:{"Mod-Shift-j":"openEmojiDialog"}});function jb(e){jo(),qo="all",Fi="";const t=window.getSelection();_o=null,t&&t.rangeCount>0&&e.contains(t.anchorNode)&&(_o=t.getRangeAt(0).cloneRange());const n=document.createElement("div");n.className="emojis-overlay",Kb(e)&&n.classList.add("rte-ui-theme-dark"),n.onclick=jo;const r=document.createElement("div");r.className="emojis-dialog",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.onclick=a=>a.stopPropagation();const o=Object.keys(ps);r.innerHTML=`
    <div class="rte-dialog-header emojis-header">
      <h3>Insert Emojis</h3>
      <button class="rte-dialog-close emojis-close">×</button>
    </div>
    <div class="rte-dialog-body emojis-content">
      <div class="emojis-tabs">
        ${o.map(a=>`
          <button class="emojis-tab ${a===qo?"active":""}" data-category="${a}">
            ${ps[a].name}
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
          ${wp(qo,Fi)}
        </div>
      </div>
    </div>
  `,n.appendChild(r),document.body.appendChild(n),ki=n,Fo=a=>{a.key==="Escape"&&(a.preventDefault(),a.stopPropagation(),jo())},document.addEventListener("keydown",Fo,!0),Vb(r,e),Ub(),requestAnimationFrame(()=>{var a;(a=r.querySelector("#emoji-search-input"))==null||a.focus()})}function Vb(e,t){var o;(o=e.querySelector(".emojis-close"))==null||o.addEventListener("click",jo),e.querySelectorAll(".emojis-tab").forEach(a=>{a.addEventListener("click",i=>{const l=i.target.getAttribute("data-category");l&&Wb(e,l)})});const n=e.querySelector("#emoji-search-input");n==null||n.addEventListener("input",a=>{Fi=a.target.value,Ln!==null&&window.clearTimeout(Ln),Ln=window.setTimeout(()=>{Ln=null,kp(e)},90)});const r=e.querySelector("#emojis-grid");r==null||r.addEventListener("click",a=>{var c;const l=a.target.closest(".emojis-item");if(!l)return;const s=l.getAttribute("data-emoji")||((c=l.textContent)==null?void 0:c.trim())||"";s&&(Ep(s,t),jo())})}function Wb(e,t){qo=t,e.querySelectorAll(".emojis-tab").forEach(n=>{n.classList.toggle("active",n.getAttribute("data-category")===t)}),kp(e)}function kp(e){const t=e.querySelector("#emojis-grid");t&&(t.innerHTML=wp(qo,Fi))}function wp(e,t){let n=ps[e].emojis;return t.trim()&&(n=n.filter(r=>r.toLowerCase().includes(t.toLowerCase())?!0:(qb[r]||"").toLowerCase().includes(t.toLowerCase()))),n.length===0&&t.trim()?`<div class="emojis-no-results">No emojis found for "${t}"</div>`:n.map((r,o)=>`
    <button 
      class="emojis-item" 
      title="Insert ${r}"
      data-emoji="${r}"
    >
      ${r}
    </button>
  `).join("")}function jo(){Fo&&(document.removeEventListener("keydown",Fo,!0),Fo=null),Ln!==null&&(window.clearTimeout(Ln),Ln=null),ki&&(ki.remove(),ki=null)}function Ep(e,t){t.focus();let n=window.getSelection();if(_o&&(n==null||n.removeAllRanges(),n==null||n.addRange(_o),_o=null),n=window.getSelection(),n&&n.rangeCount>0){const r=n.getRangeAt(0);r.deleteContents();const o=document.createTextNode(e);r.insertNode(o),r.setStartAfter(o),r.setEndAfter(o),n.removeAllRanges(),n.addRange(r)}}function ms(){const e=window.getSelection();if(e&&e.rangeCount>0){const n=e.anchorNode,r=n instanceof HTMLElement?n:n==null?void 0:n.parentElement,o=r==null?void 0:r.closest(".editora-content, .rte-content");if(o)return o}const t=document.activeElement;return t&&(t.classList.contains("editora-content")||t.classList.contains("rte-content"))?t:document.querySelector(".editora-content, .rte-content")}function Kb(e){const t=e||ms();return t?!!t.closest(_b):!1}function Ub(){if(document.getElementById("emojis-dialog-styles"))return;const e=document.createElement("style");e.id="emojis-dialog-styles",e.textContent=`
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
  `,document.head.appendChild(e)}const Gb=[{label:"Inline Value",value:"inline"},{label:"Responsive - 21x9",value:"21x9"},{label:"Responsive - 16x9",value:"16x9"},{label:"Responsive - 4x3",value:"4x3"},{label:"Responsive - 1x1",value:"1x1"}],fo='[data-theme="dark"], .dark, .editora-theme-dark',Yl=new WeakMap,Jt=e=>(Yl.has(e)||Yl.set(e,{dialogElement:null,escapeHandler:null,activeTab:"general",formData:{src:"",selectedSize:"inline",width:"100%",height:"400px",constrainProportions:!0,name:"",title:"",longDescription:"",descriptionUrl:"",showBorder:!0,enableScrollbar:!0}}),Yl.get(e));function Zb(e){if(e!=null&&e.matches(fo)||e!=null&&e.closest(fo))return!0;const t=document.activeElement;return t!=null&&t.closest(fo)?!0:document.body.matches(fo)||document.documentElement.matches(fo)}const Yb=()=>({name:"embedIframe",toolbar:[{label:"Embed Content",command:"openEmbedIframeDialog",icon:'<svg width="24" height="24" focusable="false"><path d="M19 6V5H5v14h2A13 13 0 0 1 19 6Zm0 1.4c-.8.8-1.6 2.4-2.2 4.6H19V7.4Zm0 5.6h-2.4c-.4 1.8-.6 3.8-.6 6h3v-6Zm-4 6c0-2.2.2-4.2.6-6H13c-.7 1.8-1.1 3.8-1.1 6h3Zm-4 0c0-2.2.4-4.2 1-6H9.6A12 12 0 0 0 8 19h3ZM4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm11.8 9c.4-1.9 1-3.4 1.8-4.5a9.2 9.2 0 0 0-4 4.5h2.2Zm-3.4 0a12 12 0 0 1 2.8-4 12 12 0 0 0-5 4h2.2Z" fill-rule="nonzero"></path></svg>',shortcut:"Mod-Shift-e",type:"button"}],commands:{openEmbedIframeDialog:e=>(Xb(e),!0)},keymap:{"Mod-Shift-e":"openEmbedIframeDialog"}});function Xb(e){if(!e){const o=document.activeElement;o&&o.closest("[data-editora-editor]")&&(e=o.closest("[data-editora-editor]"))}if(e||(e=document.querySelector("[data-editora-editor]")),!e){console.warn("Editor element not found");return}const t=Jt(e);t.formData={src:"",selectedSize:"inline",width:"100%",height:"400px",constrainProportions:!0,name:"",title:"",longDescription:"",descriptionUrl:"",showBorder:!0,enableScrollbar:!0},t.activeTab="general";const n=document.createElement("div");n.className="rte-dialog-overlay rte-embed-iframe-overlay",Zb(e)&&n.classList.add("rte-theme-dark"),n.onclick=()=>ia(e);const r=document.createElement("div");r.className="rte-dialog-content embed-iframe-dialog",r.onclick=o=>o.stopPropagation(),r.innerHTML=`
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
                ${Gb.map(o=>`<option value="${o.value}">${o.label}</option>`).join("")}
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
  `,n.appendChild(r),document.body.appendChild(n),t.dialogElement=n,t.escapeHandler=o=>{o.key==="Escape"&&(o.preventDefault(),o.stopPropagation(),ia(e))},document.addEventListener("keydown",t.escapeHandler,!0),Jb(r,e),ih(),setTimeout(()=>{var o;(o=r.querySelector("#iframe-src"))==null||o.focus()},100)}function Jb(e,t){var a,i,l,s;Jt(t),(a=e.querySelector(".rte-dialog-close"))==null||a.addEventListener("click",()=>ia(t)),e.querySelectorAll(".rte-tab-button").forEach(c=>{c.addEventListener("click",d=>{const u=d.target.getAttribute("data-tab");u&&Qb(e,u,t)})});const n=e.querySelector("#iframe-size");n==null||n.addEventListener("change",c=>eh(e,c.target.value,t));const r=e.querySelector("#iframe-width"),o=e.querySelector("#iframe-height");r==null||r.addEventListener("input",c=>th(e,c.target.value,t)),o==null||o.addEventListener("input",c=>nh(e,c.target.value,t)),(i=e.querySelector("#constrain-btn"))==null||i.addEventListener("click",()=>rh(e,t)),(l=e.querySelector("#cancel-btn"))==null||l.addEventListener("click",()=>ia(t)),(s=e.querySelector("#save-btn"))==null||s.addEventListener("click",()=>oh(e,t))}function Qb(e,t,n){const r=Jt(n);r.activeTab=t,e.querySelectorAll(".rte-tab-button").forEach(o=>{o.classList.toggle("active",o.getAttribute("data-tab")===t)}),e.querySelectorAll(".rte-tab-panel").forEach(o=>{o.style.display=o.getAttribute("data-panel")===t?"block":"none"})}function eh(e,t,n){const r=Jt(n);r.formData.selectedSize=t;const o=e.querySelector("#dimensions-row"),a=e.querySelector("#iframe-width"),i=e.querySelector("#iframe-height");t==="inline"?(o.style.display="flex",a.value="100%",i.value="400px",r.formData.width="100%",r.formData.height="400px"):(o.style.display="none",r.formData.width="100%",r.formData.height="auto")}function th(e,t,n){const r=Jt(n);if(r.formData.width=t,r.formData.constrainProportions&&r.formData.selectedSize==="inline"){const o=parseFloat(t);if(!isNaN(o)){const a=o*9/16;r.formData.height=`${a}px`;const i=e.querySelector("#iframe-height");i&&(i.value=r.formData.height)}}}function nh(e,t,n){const r=Jt(n);if(r.formData.height=t,r.formData.constrainProportions&&r.formData.selectedSize==="inline"){const o=parseFloat(t);if(!isNaN(o)){const a=o*16/9;r.formData.width=`${a}px`;const i=e.querySelector("#iframe-width");i&&(i.value=r.formData.width)}}}function rh(e,t){const n=Jt(t);n.formData.constrainProportions=!n.formData.constrainProportions;const r=e.querySelector("#constrain-btn");r&&(r.textContent=n.formData.constrainProportions?"🔒":"🔓",r.className=`rte-constrain-btn ${n.formData.constrainProportions?"locked":"unlocked"}`,r.title=n.formData.constrainProportions?"Unlock proportions":"Lock proportions")}function oh(e,t){var f,m,g,p,b,h,x;const n=Jt(t),r=(f=e.querySelector("#iframe-src"))==null?void 0:f.value.trim();if(!r){alert("Please enter a source URL");return}if(!r.startsWith("https://")&&!r.startsWith("http://")){alert("Please enter a valid URL starting with https:// or http://");return}const o=(m=e.querySelector("#iframe-name"))==null?void 0:m.value.trim(),a=(g=e.querySelector("#iframe-title"))==null?void 0:g.value.trim(),i=(p=e.querySelector("#iframe-longdesc"))==null?void 0:p.value.trim(),l=(b=e.querySelector("#iframe-desc-url"))==null?void 0:b.value.trim(),s=((h=e.querySelector("#iframe-border"))==null?void 0:h.checked)??!0,c=((x=e.querySelector("#iframe-scrollbar"))==null?void 0:x.checked)??!0;let d=n.formData.width,u=n.formData.height;n.formData.selectedSize!=="inline"&&(d="100%",u="auto"),ah(t,{src:r,width:d,height:u,aspectRatio:n.formData.selectedSize,name:o||void 0,title:a||void 0,longDescription:i||void 0,descriptionUrl:l||void 0,showBorder:s,enableScrollbar:c}),ia(t)}function ah(e,t){const n=e.querySelector('[contenteditable="true"]');n&&(n.focus(),setTimeout(()=>{const r=[`src="${t.src}"`,`width="${t.width}"`,`height="${t.height}"`,"allowfullscreen",`frameborder="${t.showBorder?"1":"0"}"`,`scrolling="${t.enableScrollbar?"auto":"no"}"`];t.name&&r.push(`name="${t.name}"`),t.title&&r.push(`title="${t.title}"`),t.longDescription&&r.push(`longdesc="${t.longDescription}"`);const o=[];t.aspectRatio!=="inline"&&o.push(`rte-iframe-${t.aspectRatio}`);const a=o.length>0?`class="${o.join(" ")}"`:"",i=`data-aspect-ratio="${t.aspectRatio}"`,l=`<iframe ${r.join(" ")} ${a} ${i}></iframe>`;if(!document.execCommand("insertHTML",!1,l)){const c=window.getSelection();if(c&&c.rangeCount>0){const d=c.getRangeAt(0);d.deleteContents();const u=document.createElement("div");u.innerHTML=l;const f=document.createDocumentFragment();for(;u.firstChild;)f.appendChild(u.firstChild);d.insertNode(f)}}},10))}function ia(e){const t=Jt(e);t.escapeHandler&&(document.removeEventListener("keydown",t.escapeHandler,!0),t.escapeHandler=null),t.dialogElement&&(t.dialogElement.remove(),t.dialogElement=null)}function ih(){if(document.getElementById("embed-iframe-dialog-styles"))return;const e=document.createElement("style");e.id="embed-iframe-dialog-styles",e.textContent=`
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
  `,document.head.appendChild(e)}const Ft=new Set,po='[data-theme="dark"], .dark, .editora-theme-dark';function lh(e,t){if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}}function sh(){if(typeof window>"u"||window.__anchorObserverInitialized)return;window.__anchorObserverInitialized=!0,new MutationObserver(t=>{t.forEach(n=>{n.removedNodes.forEach(r=>{var o,a;if(r.nodeType===Node.ELEMENT_NODE){const i=r;if((o=i.classList)!=null&&o.contains("rte-anchor")){const s=i.id;s&&Ft.delete(s)}const l=(a=i.querySelectorAll)==null?void 0:a.call(i,".rte-anchor");l==null||l.forEach(s=>{const c=s.id;c&&Ft.delete(c)})}})})}).observe(document.body,{childList:!0,subtree:!0})}function Uc(e){return!e||e.trim().length===0?{valid:!1,error:"Anchor ID cannot be empty"}:e.length>256?{valid:!1,error:"Anchor ID must be less than 256 characters"}:/^[a-z_]/.test(e)?/^[a-z0-9\-_]+$/.test(e)?{valid:!0,error:""}:{valid:!1,error:"Anchor ID can only contain letters, numbers, hyphens, and underscores"}:{valid:!1,error:"Anchor ID must start with a letter or underscore"}}function ch(){const e=mp();if(!e)return;const t=gp(e);if(!t)return;const n=t.querySelectorAll(".rte-anchor"),r=new Set;n.forEach(o=>{const a=o.id;a&&r.add(a)}),Ft.clear(),r.forEach(o=>Ft.add(o))}function dh(e){if(e){const r=e.startContainer,o=r.nodeType===Node.ELEMENT_NODE?r:r.parentElement;if(o!=null&&o.closest(po))return!0}const t=window.getSelection();if(t&&t.rangeCount>0){const r=t.getRangeAt(0).startContainer,o=r.nodeType===Node.ELEMENT_NODE?r:r.parentElement;if(o!=null&&o.closest(po))return!0}const n=document.activeElement;return n!=null&&n.closest(po)?!0:document.body.matches(po)||document.documentElement.matches(po)}function uh(e,t,n,r){ch();const o=dh(r),a=o?{overlay:"rgba(0, 0, 0, 0.62)",dialogBg:"#1f2937",panelBg:"#222d3a",border:"#3b4657",text:"#e2e8f0",muted:"#94a3b8",closeHoverBg:"#334155",fieldBg:"#111827",fieldFocusBg:"#111827",fieldBorder:"#4b5563",fieldText:"#e2e8f0",fieldPlaceholder:"#94a3b8",fieldErrorBg:"#3f2124",fieldErrorBorder:"#ef4444",cancelBg:"#334155",cancelHover:"#475569",cancelText:"#e2e8f0",saveBg:"#3b82f6",saveHover:"#2563eb",saveDisabledBg:"#374151",saveDisabledText:"#7f8ca1",help:"#9fb0c6",focusRing:"rgba(88, 166, 255, 0.25)",errorRing:"rgba(239, 68, 68, 0.25)"}:{overlay:"rgba(0, 0, 0, 0.5)",dialogBg:"#ffffff",panelBg:"#f9f9f9",border:"#e0e0e0",text:"#333333",muted:"#999999",closeHoverBg:"#e0e0e0",fieldBg:"#ffffff",fieldFocusBg:"#f9f9ff",fieldBorder:"#d0d0d0",fieldText:"#333333",fieldPlaceholder:"#9ca3af",fieldErrorBg:"#ffebee",fieldErrorBorder:"#d32f2f",cancelBg:"#f0f0f0",cancelHover:"#e0e0e0",cancelText:"#333333",saveBg:"#0066cc",saveHover:"#0052a3",saveDisabledBg:"#d0d0d0",saveDisabledText:"#999999",help:"#999999",focusRing:"rgba(0, 102, 204, 0.1)",errorRing:"rgba(211, 47, 47, 0.1)"},i=document.createElement("div");i.className="rte-anchor-dialog-overlay",i.style.cssText=`
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
  `,p.style.setProperty("caret-color",a.fieldText);const b=document.createElement("div");b.style.cssText=`
    color: #d32f2f;
    font-size: 12px;
    margin-top: 6px;
    display: none;
  `;const h=document.createElement("div");h.textContent="URL-safe ID (letters, numbers, hyphens, underscores). Must start with letter or underscore.",h.style.cssText=`color: ${a.help}; font-size: 12px; margin-top: 8px; line-height: 1.4;`,m.appendChild(g),m.appendChild(p),m.appendChild(b),m.appendChild(h),f.appendChild(m);const x=document.createElement("div");x.style.cssText=`
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
  `,k.disabled=!p.value.trim();const T=()=>{p.value.trim()?(k.disabled=!1,k.style.background=a.saveBg,k.style.color="white",k.style.cursor="pointer"):(k.disabled=!0,k.style.background=a.saveDisabledBg,k.style.color=a.saveDisabledText,k.style.cursor="not-allowed")};k.onmouseover=()=>{k.disabled||(k.style.background=a.saveHover,k.style.boxShadow=o?"0 2px 8px rgba(59, 130, 246, 0.35)":"0 2px 8px rgba(0, 102, 204, 0.3)")},k.onmouseout=()=>{k.disabled||(k.style.background=a.saveBg,k.style.boxShadow="none")},x.appendChild(C),x.appendChild(k),p.oninput=()=>{const v=p.value;if(T(),v.trim()){const E=Uc(v);E.valid?e==="add"&&Ft.has(v)?(s=`Anchor ID already exists: ${v}`,b.textContent="⚠ "+s,b.style.display="block",p.style.borderColor=a.fieldErrorBorder,p.style.background=a.fieldErrorBg):e==="edit"&&v!==t&&Ft.has(v)?(s=`Anchor ID already exists: ${v}`,b.textContent="⚠ "+s,b.style.display="block",p.style.borderColor=a.fieldErrorBorder,p.style.background=a.fieldErrorBg):(s="",b.style.display="none",p.style.borderColor=a.fieldBorder,p.style.background=a.fieldBg):(s=E.error,b.textContent="⚠ "+s,b.style.display="block",p.style.borderColor=a.fieldErrorBorder,p.style.background=a.fieldErrorBg)}else b.style.display="none",p.style.borderColor=a.fieldBorder,p.style.background=a.fieldBg},p.onfocus=()=>{p.style.borderColor=s?a.fieldErrorBorder:a.saveBg,p.style.boxShadow=s?`0 0 0 3px ${a.errorRing}`:`0 0 0 3px ${a.focusRing}`,p.style.background=s?a.fieldErrorBg:a.fieldFocusBg},p.onblur=()=>{p.style.boxShadow="none",s||(p.style.background=a.fieldBg)};const L=()=>{const v=p.value.trim();!v||!Uc(v).valid||e==="add"&&Ft.has(v)||e==="edit"&&v!==t&&Ft.has(v)||(n&&n(v),i.remove())},w=()=>{i.remove()};k.onclick=L,C.onclick=w,u.onclick=w,p.onkeydown=v=>{v.key==="Enter"?(v.preventDefault(),L()):v.key==="Escape"&&(v.preventDefault(),w())},i.onclick=v=>{v.target===i&&w()},l.appendChild(c),l.appendChild(f),l.appendChild(x),i.appendChild(l),document.body.appendChild(i),setTimeout(()=>p.focus(),100)}function fh(e,t){let n;if(t)n=t;else{const s=window.getSelection();if(!s||s.rangeCount===0)return;n=s.getRangeAt(0)}let r=null,o=n.startContainer;for(;o&&o!==document.body;){if(o.nodeType===Node.ELEMENT_NODE){const s=o;if(s.getAttribute("contenteditable")==="true"){r=s;break}}o=o.parentNode}const a=(r==null?void 0:r.innerHTML)??"",i=document.createElement("span");i.id=e,i.className="rte-anchor",i.setAttribute("data-type","anchor"),i.setAttribute("data-anchor-id",e),i.setAttribute("title",`Anchor: ${e}`),i.style.cssText=`
    display: inline;
    position: relative;
    cursor: pointer;
  `,n.insertNode(i),Ft.add(e),n.setStart(i.nextSibling||i.parentNode,0),n.collapse(!0);const l=window.getSelection();if(l&&(l.removeAllRanges(),l.addRange(n)),r)lh(r,a),r.dispatchEvent(new Event("input",{bubbles:!0}));else{const s=mp();if(s){const c=gp(s);c&&c.dispatchEvent(new Event("input",{bubbles:!0}))}}Cp()}function Cp(){if(document.getElementById("rte-anchor-styles"))return;const e=document.createElement("style");e.id="rte-anchor-styles",e.textContent=`
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
  `,document.head.appendChild(e)}const ph=()=>(typeof window<"u"&&(sh(),Cp()),{name:"anchor",toolbar:[{label:"Anchor",command:"insertAnchor",icon:'<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 8.4C13.4912 8.4 14.7 7.19117 14.7 5.7C14.7 4.20883 13.4912 3 12 3C10.5088 3 9.3 4.20883 9.3 5.7C9.3 7.19117 10.5088 8.4 12 8.4ZM12 8.4V20.9999M12 20.9999C9.61305 20.9999 7.32387 20.0518 5.63604 18.364C3.94821 16.6761 3 14.3869 3 12H5M12 20.9999C14.3869 20.9999 16.6761 20.0518 18.364 18.364C20.0518 16.6761 21 14.3869 21 12H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',shortcut:"Mod-Shift-k"}],commands:{insertAnchor:()=>{try{const e=window.getSelection();if(!e||e.rangeCount===0)return alert("Please place your cursor where you want to insert the anchor."),!1;const t=e.getRangeAt(0).cloneRange();return uh("add","",n=>{fh(n,t)},t),!0}catch(e){return console.error("Failed to insert anchor:",e),!1}}},keymap:{"Mod-Shift-k":"insertAnchor"}}),Pt=".rte-content, .editora-content",mh="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",Ur='.rte-mention[data-mention="true"]',Tn=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',ji=new WeakMap,Vi=new WeakMap;let Gc=!1,Wi=!1,Vo=null,ja=0;function Sp(e,t){if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}}function Tp(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function Zt(e,t){const n=window.getSelection();n&&(n.removeAllRanges(),n.addRange(t),e.focus({preventScroll:!0}))}function wl(e,t){return e.startContainer===t.startContainer&&e.startOffset===t.startOffset&&e.endContainer===t.endContainer&&e.endOffset===t.endOffset}function Pn(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const n=t.getRangeAt(0);return e.contains(n.commonAncestorContainer)?n.cloneRange():null}function la(e){Array.from(e.querySelectorAll(Ur)).forEach(n=>{n.setAttribute("data-mention","true"),n.setAttribute("contenteditable","false"),n.setAttribute("spellcheck","false"),n.setAttribute("draggable","false"),n.classList.add("rte-mention")})}function Zc(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function gh(e){return e.closest(mh)||e}function Va(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function bh(e){const t=gh(e);if(Va(t))return!0;const n=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return Va(n)?!0:Va(document.documentElement)||Va(document.body)}function $p(e,t){e.classList.remove("rte-mention-theme-dark"),bh(t)&&e.classList.add("rte-mention-theme-dark")}function hh(e){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const r=e.editorElement;if(r.matches(Pt))return r;const o=r.querySelector(Pt);if(o instanceof HTMLElement)return o}const t=window.getSelection();if(t&&t.rangeCount>0){const r=t.getRangeAt(0).startContainer,o=r.nodeType===Node.ELEMENT_NODE?r:r.parentElement,a=o==null?void 0:o.closest(Pt);if(a)return a}const n=document.activeElement;if(n){if(n.matches(Pt))return n;const r=n.closest(Pt);if(r)return r}return document.querySelector(Pt)}function Yn(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Xs(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function yh(e,t){return t?t.split(".").filter(Boolean).reduce((n,r)=>{if(!(!Xs(n)&&!Array.isArray(n)))return n[r]},e):e}function xh(e){return e?/\s|[([{"'`]/.test(e):!0}function vh(e){if(!e.collapsed)return null;const t=e.startContainer,n=e.startOffset;if(t.nodeType===Node.TEXT_NODE){const r=t;return{node:r,textBefore:r.data.slice(0,n),caretOffset:n}}if(t.nodeType===Node.ELEMENT_NODE){const r=t;if(n>0){const o=r.childNodes[n-1];if(o&&o.nodeType===Node.TEXT_NODE){const a=o;return{node:a,textBefore:a.data,caretOffset:a.length}}}}return null}function kh(e,t,n){let r=-1,o="";if(t.forEach(i=>{const l=e.lastIndexOf(i);l>r&&(r=l,o=i)}),r<0||!xh(e[r-1]))return null;const a=e.slice(r+1);return/\s/.test(a)||a.length>n?null:{trigger:o,query:a,startOffset:r}}function wh(e,t){const n=t.cloneRange();n.collapse(!1);const r=n.getClientRects();if(r.length>0)return r[r.length-1];const o=document.createElement("span");o.textContent="​",o.style.position="relative",n.insertNode(o);const a=o.getBoundingClientRect();return o.remove(),e.normalize(),a}function Eh(e,t){if(e.panel&&e.list)return;const n=document.createElement("div");n.className="rte-mention-panel",n.style.display="none";const r=document.createElement("div");r.className="rte-mention-list",n.appendChild(r),document.body.appendChild(n),$p(n,e.editor),e.panel=n,e.list=r,n.addEventListener("mousedown",o=>{o.preventDefault()}),n.addEventListener("click",o=>{const a=o.target;if(!a)return;const i=a.closest(".rte-mention-item");if(!i)return;const l=Number(i.getAttribute("data-index"));Number.isFinite(l)&&Ap(e,t,l)})}function ut(e){e.panel&&(e.debounceHandle!==null&&(window.clearTimeout(e.debounceHandle),e.debounceHandle=null),e.abortController&&(e.abortController.abort(),e.abortController=null),e.panel.style.display="none",e.panel.classList.remove("show"),e.isOpen=!1,e.loading=!1,e.items=[],e.activeIndex=0,e.query="",e.replaceRange=null)}function Yc(e,t){if(!e.panel)return;$p(e.panel,e.editor);const n=wh(e.editor,t),r=e.panel;r.style.display="block",r.classList.add("show"),r.style.left="0px",r.style.top="0px";const o=r.getBoundingClientRect(),a=window.innerWidth,i=window.innerHeight;let l=Math.max(8,Math.min(n.left,a-o.width-8)),s=n.bottom+8;s+o.height>i-8&&(s=Math.max(8,n.top-o.height-8)),r.style.position="fixed",r.style.left=`${l}px`,r.style.top=`${s}px`}function Ch(e,t){if(!t)return Yn(e);const n=e.toLowerCase(),r=t.toLowerCase(),o=n.indexOf(r);if(o<0)return Yn(e);const a=Yn(e.slice(0,o)),i=Yn(e.slice(o,o+t.length)),l=Yn(e.slice(o+t.length));return`${a}<mark>${i}</mark>${l}`}function Xc(e,t){if(!e.list)return;const n=e.list;if(n.innerHTML="",e.loading){const r=document.createElement("div");r.className="rte-mention-empty",r.textContent=t.loadingText,n.appendChild(r);return}if(e.items.length===0){const r=document.createElement("div");r.className="rte-mention-empty",r.textContent=e.query.length>0?t.noResultsText:t.emptyStateText,n.appendChild(r);return}e.items.forEach((r,o)=>{const a=document.createElement("button");a.type="button",a.className="rte-mention-item",o===e.activeIndex&&a.classList.add("active"),a.setAttribute("data-index",String(o));const i=t.itemRenderer?t.itemRenderer(r,e.query):`<span class="rte-mention-item-label">${Ch(r.label,e.query)}</span>${r.meta?`<span class="rte-mention-item-meta">${Yn(r.meta)}</span>`:""}`;a.innerHTML=i,n.appendChild(a)})}function Lp(e,t){const n=new Set,r=[];return e.forEach(o=>{const a=(o.id||"").trim();!a||n.has(a)||(n.add(a),r.push({id:a,label:o.label||a,value:o.value,meta:o.meta}))}),r.slice(0,t)}function Sh(e,t){if(e.buildRequest){const d=e.buildRequest(t);return{url:d.url,init:d.init||{}}}const n=(e.method||"GET").toUpperCase(),r=typeof e.headers=="function"?e.headers(t):e.headers||{},o=e.queryParam||"q",a=e.triggerParam||"trigger",i=e.limitParam||"limit",l=e.staticParams||{},s={method:n,headers:{...r},credentials:e.credentials,mode:e.mode,cache:e.cache,signal:t.signal},c=new URL(e.url,window.location.origin);if(n==="GET"||n==="HEAD"){const d=new URLSearchParams(c.search);Object.entries(l).forEach(([u,f])=>d.set(u,String(f))),d.set(o,t.query),d.set(a,t.trigger),d.set(i,String(t.limit)),c.search=d.toString()}else{const d=typeof e.body=="function"?e.body(t):e.body,u={[o]:t.query,[a]:t.trigger,[i]:t.limit,...l},f=d??u;if(Xs(f)){s.body=JSON.stringify(f);const m=s.headers;!m["Content-Type"]&&!m["content-type"]&&(m["Content-Type"]="application/json")}else s.body=f}return{url:c.toString(),init:s}}async function Th(e,t,n,r){var c;const o=t.api;if(!o)return[];e.abortController&&e.abortController.abort();const a=new AbortController;e.abortController=a;const i={query:n,trigger:r,limit:t.maxSuggestions,signal:a.signal},l=Math.max(0,o.timeoutMs??1e4);let s=null;l>0&&(s=window.setTimeout(()=>a.abort(),l));try{const{url:d,init:u}=Sh(o,i),f=await fetch(d,{...u,signal:a.signal});if(!f.ok)throw new Error(`Mention API request failed: ${f.status}`);const g=(o.responseType||"json")==="text"?await f.text():await f.json();let p=[];if(o.transformResponse)p=o.transformResponse(g,i)||[];else{const b=yh(g,o.responsePath);p=(Array.isArray(b)?b:Array.isArray(g)?g:[]).map((x,C)=>{if(o.mapItem)return o.mapItem(x,C);if(!Xs(x))return null;const k=String(x.id??x.value??x.key??"").trim();if(!k)return null;const T=String(x.label??x.name??k).trim();return{id:k,label:T,value:x.value?String(x.value):void 0,meta:x.meta?String(x.meta):void 0}}).filter(x=>!!x)}return Lp(p,t.maxSuggestions)}catch(d){return(d==null?void 0:d.name)!=="AbortError"&&((c=o.onError)==null||c.call(o,d,i)),[]}finally{s!==null&&window.clearTimeout(s),e.abortController===a&&(e.abortController=null)}}async function $h(e,t,n,r){const o=++e.requestId;let a=[];if(t.search){const i=await t.search(n,r);a=Array.isArray(i)?i:[]}else if(t.api)a=await Th(e,t,n,r);else{const i=n.toLowerCase();a=t.items.filter(l=>i?l.label.toLowerCase().includes(i)||l.id.toLowerCase().includes(i):!0)}return o!==e.requestId?[]:Lp(a,t.maxSuggestions)}function Lh(e,t,n){const r=e.editor;if(la(r),!window.getSelection())return!1;const a=r.innerHTML;let i=e.replaceRange?e.replaceRange.cloneRange():Pn(r);if(!i||!r.contains(i.commonAncestorContainer)&&(i=Pn(r),!i))return!1;const l=El(r,i.cloneRange(),"after");wl(l,i)||(Zt(r,l),i=l),i.deleteContents();const s=document.createElement("span");s.className="rte-mention",s.setAttribute("data-mention","true"),s.setAttribute("data-mention-id",n.id),s.setAttribute("contenteditable","false"),s.textContent=n.value||`${e.trigger}${n.label}`,i.insertNode(s);let c=s,d=1;if(t.insertSpaceAfterMention){const f=document.createTextNode(" ");s.after(f),c=f,d=1}const u=document.createRange();return u.setStart(c,d),u.collapse(!0),Zt(r,u),ut(e),la(r),Tp(r),Sp(r,a),!0}function Ap(e,t,n){if(n<0||n>=e.items.length)return;const r=e.items[n];Lh(e,t,r)}function Ah(e){return e.startContainer!==e.endContainer||e.startContainer.nodeType!==Node.ELEMENT_NODE||e.endOffset-e.startOffset!==1?null:e.startContainer.childNodes[e.startOffset]||null}function Mh(e,t){const n=Ah(e);return!(n instanceof HTMLElement)||!n.matches(Ur)||!t.contains(n)?null:n}function Mp(e,t){const n=Mh(e,t);if(n)return n;const r=Zc(e.startContainer),o=r==null?void 0:r.closest(Ur);if(o&&t.contains(o))return o;const a=Zc(e.endContainer),i=a==null?void 0:a.closest(Ur);return i&&t.contains(i)?i:null}function El(e,t,n="after"){const r=Mp(t,e);if(!r)return t;const o=document.createRange();return n==="before"?o.setStartBefore(r):o.setStartAfter(r),o.collapse(!0),o}function Jc(e,t,n="after"){const r=document.createRange();n==="before"?r.setStartBefore(t):r.setStartAfter(t),r.collapse(!0),Zt(e,r)}function Rh(e,t,n){if(!e.collapsed)return null;const r=e.startContainer,o=e.startOffset;let a=null;if(r.nodeType===Node.TEXT_NODE){const i=r;t==="backward"&&o===0?a=i.previousSibling:t==="forward"&&o===i.length&&(a=i.nextSibling)}else if(r.nodeType===Node.ELEMENT_NODE){const i=r;t==="backward"&&o>0?a=i.childNodes[o-1]||null:t==="forward"&&o<i.childNodes.length&&(a=i.childNodes[o]||null)}return!(a instanceof HTMLElement)||!a.matches(Ur)||!n.contains(a)?null:a}function Qc(e,t){const n=Pn(e);if(!n)return!1;const r=Rh(n,t,e);if(!r)return!1;const o=r.parentNode;if(!o)return!1;const a=e.innerHTML,i=Array.prototype.indexOf.call(o.childNodes,r);r.remove();const l=document.createRange();return l.setStart(o,Math.max(0,i)),l.collapse(!0),Zt(e,l),Tp(e),Sp(e,a),!0}function Rp(e,t,n,r,o,a){if(Eh(e,t),e.query=r,e.trigger=o,e.replaceRange=a.cloneRange(),e.loading=!!(t.api&&!t.search),e.debounceHandle!==null&&(window.clearTimeout(e.debounceHandle),e.debounceHandle=null),!e.panel)return;e.isOpen||(e.panel.style.display="block",e.panel.classList.add("show"),e.isOpen=!0),Xc(e,t),Yc(e,n);const i=()=>{e.debounceHandle=null,$h(e,t,r,o).then(s=>{e.loading=!1,e.items=s,e.activeIndex=0,e.panel&&(Xc(e,t),Yc(e,n))})},l=t.api&&!t.search?Math.max(0,t.api.debounceMs??180):0;l>0?e.debounceHandle=window.setTimeout(i,l):i()}function Dh(e,t){const n=e.editor;la(n);let r=Pn(n);if(!r||!r.collapsed){ut(e);return}const o=El(n,r.cloneRange(),"after");if(!wl(o,r)){Zt(n,o),r=o,ut(e);return}const a=vh(r);if(!a){ut(e);return}const i=kh(a.textBefore,t.triggerChars,t.maxQueryLength);if(!i){ut(e);return}if(i.query.length<t.minChars){ut(e);return}const l=r.cloneRange();l.setStart(a.node,i.startOffset),l.setEnd(a.node,a.caretOffset),Rp(e,t,r,i.query,i.trigger,l)}function ed(e,t){if(e.items.length===0)return;const n=e.items.length;if(e.activeIndex=((e.activeIndex+t)%n+n)%n,!e.list)return;const r=Array.from(e.list.querySelectorAll(".rte-mention-item"));r.forEach((a,i)=>a.classList.toggle("active",i===e.activeIndex));const o=r[e.activeIndex];o==null||o.scrollIntoView({block:"nearest"})}function Nh(e){return{editor:e,panel:null,list:null,replaceRange:null,items:[],activeIndex:0,query:"",trigger:"@",loading:!1,isOpen:!1,requestId:0,debounceHandle:null,abortController:null}}function Bh(e){var n;const t=ji.get(e);t&&((n=t.panel)!=null&&n.parentNode&&t.panel.parentNode.removeChild(t.panel),ji.delete(e))}function gs(e,t,n){if(Vi.has(e))return;la(e);const r={beforeInput:o=>{la(e);const a=Pn(e);if(!a)return;const i=Mp(a,e);if(!i)return;const l=o.inputType||"";if(l.startsWith("insert")){if(o.preventDefault(),Jc(e,i,"after"),l==="insertParagraph"||l==="insertLineBreak"){const s=l==="insertLineBreak"?"insertLineBreak":"insertParagraph";document.execCommand(s,!1);return}if(l==="insertText"||l==="insertCompositionText"){const s=o.data||"";if(!s)return;document.execCommand("insertText",!1,s)}}},input:()=>{Dh(t,n)},keydown:o=>{if(t.isOpen){if(o.key==="ArrowDown"){o.preventDefault(),ed(t,1);return}if(o.key==="ArrowUp"){o.preventDefault(),ed(t,-1);return}if(o.key==="Enter"||o.key==="Tab"){o.preventDefault(),Ap(t,n,t.activeIndex);return}if(o.key==="Escape"){o.preventDefault(),ut(t);return}}const a=Pn(e);if(a){const i=El(e,a.cloneRange(),"after");if(!wl(i,a)){if(o.key==="Enter"){o.preventDefault(),Zt(e,i),document.execCommand("insertParagraph",!1);return}o.key.length===1&&!o.metaKey&&!o.ctrlKey&&!o.altKey&&Zt(e,i)}}if(o.key==="Backspace"&&Qc(e,"backward")){o.preventDefault();return}if(o.key==="Delete"&&Qc(e,"forward")){o.preventDefault();return}},click:o=>{const a=o.target;if(!a)return;const i=a.nodeType===Node.ELEMENT_NODE?a:a.parentElement,l=i==null?void 0:i.closest(Ur);!l||!e.contains(l)||(o.preventDefault(),o.stopPropagation(),Jc(e,l,"after"),ut(t))},blur:()=>{window.setTimeout(()=>{const o=document.activeElement;t.panel&&o&&t.panel.contains(o)||ut(t)},0)},mousedown:o=>{if(!t.isOpen||!t.panel)return;const a=o.target;a&&!t.panel.contains(a)&&!e.contains(a)&&ut(t)}};e.addEventListener("beforeinput",r.beforeInput),e.addEventListener("input",r.input),e.addEventListener("keydown",r.keydown),e.addEventListener("click",r.click),e.addEventListener("blur",r.blur),document.addEventListener("mousedown",r.mousedown,!0),Vi.set(e,r)}function Ph(e){const t=Vi.get(e);t&&(e.removeEventListener("beforeinput",t.beforeInput),e.removeEventListener("input",t.input),e.removeEventListener("keydown",t.keydown),e.removeEventListener("click",t.click),e.removeEventListener("blur",t.blur),document.removeEventListener("mousedown",t.mousedown,!0),Vi.delete(e))}function Ih(){if(Gc||typeof document>"u")return;Gc=!0;const e=document.createElement("style");e.id="rte-mention-plugin-styles",e.textContent=`
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

    ${Tn} .rte-mention {
      background: rgba(37, 99, 235, 0.25);
      color: #bfdbfe;
    }

    ${Tn} .rte-mention-panel,
    .rte-mention-panel.rte-mention-theme-dark {
      border-color: #364152;
      background: #1f2937;
      box-shadow: 0 22px 44px rgba(0, 0, 0, 0.48);
    }

    ${Tn} .rte-mention-item,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-item {
      color: #e5e7eb;
    }

    ${Tn} .rte-mention-item:hover,
    ${Tn} .rte-mention-item.active,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-item:hover,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-item.active {
      background: #334155;
      color: #bfdbfe;
    }

    ${Tn} .rte-mention-item-meta,
    ${Tn} .rte-mention-empty,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-item-meta,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-empty {
      color: #9ca3af;
    }
  `,document.head.appendChild(e)}function Hh(e){const t=(e.triggerChars||["@"]).filter(n=>typeof n=="string"&&n.length>0).map(n=>n[0]);return{triggerChars:t.length>0?t:["@"],minChars:Math.max(0,e.minChars??1),maxQueryLength:Math.max(1,e.maxQueryLength??32),maxSuggestions:Math.max(1,e.maxSuggestions??8),items:e.items||[{id:"john.doe",label:"John Doe",meta:"john@acme.com"},{id:"sarah.lee",label:"Sarah Lee",meta:"sarah@acme.com"},{id:"alex.chen",label:"Alex Chen",meta:"alex@acme.com"}],api:e.api,search:e.search,itemRenderer:e.itemRenderer,emptyStateText:e.emptyStateText||"Type to search mentions",noResultsText:e.noResultsText||"No matching mentions",loadingText:e.loadingText||"Loading...",insertSpaceAfterMention:e.insertSpaceAfterMention!==!1}}function wi(e){const t=ji.get(e);if(t)return t;const n=Nh(e);return ji.set(e,n),n}function Oh(e){Wi||(Wi=!0,Vo=t=>{const n=t.target;if(!(n instanceof Node))return;const r=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement,o=(r==null?void 0:r.closest(Pt))||null;if(!o)return;const a=wi(o);gs(o,a,e)},document.addEventListener("focusin",Vo,!0))}function zh(){!Wi||!Vo||(document.removeEventListener("focusin",Vo,!0),Wi=!1,Vo=null)}const qh=(e={})=>{Ih();const t=Hh(e);return{name:"mentions",toolbar:[{label:"Mention",command:"insertMention",icon:'<svg width="24" height="24" focusable="false"><path d="M12.1 4a7.9 7.9 0 0 0-8 8c0 4.4 3.6 8 8 8 1.6 0 3-.4 4.4-1.3.4-.3.5-.9.2-1.3a1 1 0 0 0-1.3-.3 6 6 0 0 1-3.3.9 6 6 0 1 1 6-6v1.6c0 .8-.5 1.4-1.2 1.4-.8 0-1.2-.6-1.2-1.4V12c0-2-1.6-3.5-3.7-3.5s-3.8 1.6-3.8 3.6c0 2 1.7 3.6 3.8 3.6 1 0 1.9-.4 2.6-1 .5 1 1.4 1.6 2.5 1.6 1.8 0 3.2-1.5 3.2-3.4V12A7.9 7.9 0 0 0 12 4Zm0 9.7c-1 0-1.8-.8-1.8-1.7s.8-1.7 1.8-1.7c1 0 1.7.8 1.7 1.7s-.8 1.7-1.7 1.7Z"></path></svg>'}],commands:{insertMention:(n,r)=>{const o=hh(r);if(!o)return!1;const a=wi(o);gs(o,a,t);let i=Pn(o);i||(i=document.createRange(),i.selectNodeContents(o),i.collapse(!1),Zt(o,i));const l=El(o,i.cloneRange(),"after");wl(l,i)||(Zt(o,l),i=l),a.query="";const s=i.cloneRange();return a.trigger=t.triggerChars[0],Rp(a,t,i,"",a.trigger,s),!0}},init:()=>{ja+=1,Oh(t),Array.from(document.querySelectorAll(Pt)).forEach(r=>{const o=wi(r);gs(r,o,t)})},destroy:()=>{ja=Math.max(0,ja-1),Array.from(document.querySelectorAll(Pt)).forEach(r=>{ut(wi(r)),Ph(r),Bh(r)}),ja===0&&zh()}}},rn=".rte-content, .editora-content",ne='[data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark',X="rte-version-diff-overlay",td="rte-version-diff-styles",_h={title:"Version Diff",baseline:"Baseline",current:"Current",noChanges:"No changes detected between baseline and current content.",loading:"Preparing diff...",tabInline:"Inline Diff",tabSideBySide:"Side by Side",refresh:"Refresh",setBaseline:"Set Current as Baseline",close:"Close",mode:"Mode",ignoreWhitespace:"Ignore whitespace",largeDocFallback:"Large document fallback mode applied for performance."},In=new WeakMap,Ki=new WeakMap;let Wa=0,ar=null,Wo=null,bs=null,ir=null,lr=null,sr=null;function ce(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Fh(e){return{..._h,...e||{}}}function hs(e,t=!0){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const o=e.editorElement;if(o.matches(rn))return o;const a=o.querySelector(rn);if(a instanceof HTMLElement)return a}const n=window.getSelection();if(n&&n.rangeCount>0){const o=n.getRangeAt(0).startContainer,a=o.nodeType===Node.ELEMENT_NODE?o:o.parentElement,i=a==null?void 0:a.closest(rn);if(i)return i}const r=document.activeElement;if(r){if(r.matches(rn))return r;const o=r.closest(rn);if(o)return o}return sr&&sr.isConnected?sr:t?document.querySelector(rn):null}function Js(e){return e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||e}function Ka(e){if(!e)return!1;const t=e.getAttribute("data-theme")||e.getAttribute("theme");if(t&&t.toLowerCase()==="dark")return!0;const n=e.classList;return n.contains("dark")||n.contains("editora-theme-dark")||n.contains("rte-theme-dark")}function nd(e){const t=Js(e);if(Ka(t))return!0;const n=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return!!(Ka(n)||Ka(document.documentElement)||Ka(document.body))}function jh(e){const t=document.createElement("textarea");return t.innerHTML=e,t.value}function Qs(e){const n=Js(e).getAttribute("data-initial-content");return n?jh(n):e.innerHTML}function Dp(e){return e.replace(/\r\n?/g,`
`)}function rd(e){const t=document.createElement("div"),n=e.replace(/<br\s*\/?>/gi,`
`).replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|tr|blockquote|pre|section|article)>/gi,`$&
`);t.innerHTML=n;const r=t.textContent||"";return Dp(r).replace(/\u00a0/g," ").replace(/\n{3,}/g,`

`).trim()}function od(e,t,n){let r=Dp(e);if(n&&(r=r.replace(/[ \t]+/g," ").replace(/\n{3,}/g,`

`).trim()),!r)return[];if(t==="line")return r.split(`
`);if(n)return r.split(/\s+/).filter(Boolean);const o=[],a=r.split(`
`);return a.forEach((i,l)=>{const s=i.split(/[ \t]+/).filter(Boolean);o.push(...s),l<a.length-1&&o.push(`
`)}),o}function Vh(e,t,n){if(e.length===0)return"";if(t==="line")return e.join(`
`);if(n)return e.join(" ");let r="";for(let o=0;o<e.length;o+=1){const a=e[o];if(a===`
`){r=r.replace(/[ \t]+$/g,""),r+=`
`;continue}r.length>0&&!r.endsWith(`
`)&&(r+=" "),r+=a}return r}function Wh(e,t,n){const r=[];return e.forEach(o=>{const a=r[r.length-1];if(a&&a.type===o.type){a.tokens.push(o.token);return}r.push({type:o.type,tokens:[o.token]})}),r.map(o=>({type:o.type,value:Vh(o.tokens,t,n),count:o.tokens.length}))}function Kh(e,t){let n=0;for(;n<e.length&&n<t.length&&e[n]===t[n];)n+=1;let r=e.length-1,o=t.length-1;for(;r>=n&&o>=n&&e[r]===t[o];)r-=1,o-=1;const a=e.slice(0,n),i=r<e.length-1?e.slice(r+1):[],l=n<=r?e.slice(n,r+1):[],s=n<=o?t.slice(n,o+1):[];return{prefix:a,suffix:i,aMiddle:l,bMiddle:s}}function Uh(e,t,n,r,o,a){if(e.length===0&&t.length===0)return{segments:[],insertedCount:0,deletedCount:0,equalCount:0,usedFallback:!1};const{prefix:i,suffix:l,aMiddle:s,bMiddle:c}=Kh(e,t);let d=[];i.forEach(h=>d.push({type:"equal",token:h}));const u=s.length*c.length,f=s.length>a||c.length>a||u>o;if(f)s.forEach(h=>d.push({type:"delete",token:h})),c.forEach(h=>d.push({type:"insert",token:h}));else{const h=Array.from({length:s.length+1},()=>new Uint32Array(c.length+1));for(let k=s.length-1;k>=0;k-=1){const T=h[k],L=h[k+1];for(let w=c.length-1;w>=0;w-=1)T[w]=s[k]===c[w]?L[w+1]+1:Math.max(L[w],T[w+1])}let x=0,C=0;for(;x<s.length&&C<c.length;)s[x]===c[C]?(d.push({type:"equal",token:s[x]}),x+=1,C+=1):h[x+1][C]>=h[x][C+1]?(d.push({type:"delete",token:s[x]}),x+=1):(d.push({type:"insert",token:c[C]}),C+=1);for(;x<s.length;)d.push({type:"delete",token:s[x]}),x+=1;for(;C<c.length;)d.push({type:"insert",token:c[C]}),C+=1}l.forEach(h=>d.push({type:"equal",token:h}));const m=Wh(d,n,r);let g=0,p=0,b=0;return m.forEach(h=>{h.type==="insert"&&(g+=h.count),h.type==="delete"&&(p+=h.count),h.type==="equal"&&(b+=h.count)}),{segments:m,insertedCount:g,deletedCount:p,equalCount:b,usedFallback:f}}function Np(e){return ce(e.value).replace(/\n/g,`
`)}function Gh(e,t){return e.length===0?`<p class="rte-version-diff-empty">${ce(t.noChanges)}</p>`:e.map(n=>`<span class="${n.type==="equal"?"rte-version-diff-equal":n.type==="insert"?"rte-version-diff-insert":"rte-version-diff-delete"}">${Np(n)}</span>`).join("")}function Zh(e,t){if(e.length===0){const o=`<p class="rte-version-diff-empty">${ce(t.noChanges)}</p>`;return{baselineHtml:o,currentHtml:o}}const n=[],r=[];return e.forEach(o=>{const a=Np(o);if(o.type==="equal"){n.push(`<span class="rte-version-diff-equal">${a}</span>`),r.push(`<span class="rte-version-diff-equal">${a}</span>`);return}if(o.type==="delete"){n.push(`<span class="rte-version-diff-delete">${a}</span>`);return}r.push(`<span class="rte-version-diff-insert">${a}</span>`)}),{baselineHtml:n.join(""),currentHtml:r.join("")}}function Yh(e){const t=e.metaKey||e.ctrlKey,r=(typeof e.key=="string"?e.key:"").toLowerCase(),o=typeof e.code=="string"?e.code.toLowerCase():"",a=t&&e.altKey&&!e.shiftKey&&(r==="d"||o==="keyd"),i=!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&(r==="f8"||o==="f8");return a||i}function Xh(){if(typeof document>"u"||document.getElementById(td))return;const e=document.createElement("style");e.id=td,e.textContent=`
    .${X} {
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

    ${ne} .rte-version-diff-dialog,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-dialog {
      background: #1f2937;
      color: #e5e7eb;
      border-color: #334155;
    }

    ${ne} .rte-version-diff-header,
    ${ne} .rte-version-diff-footer,
    ${ne} .rte-version-diff-tabs,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-header,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-footer,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-tabs {
      background: #111827;
      border-color: #334155;
    }

    ${ne} .rte-version-diff-body,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-body {
      background: #1f2937;
    }

    ${ne} .rte-version-diff-select,
    ${ne} .rte-version-diff-btn,
    ${ne} .rte-version-diff-tab,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-select,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-btn,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-tab {
      background: #0f172a;
      color: #e5e7eb;
      border-color: #475569;
    }

    ${ne} .rte-version-diff-close-btn,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-close-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    ${ne} .rte-version-diff-close-btn:hover,
    ${ne} .rte-version-diff-close-btn:focus-visible,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-close-btn:hover,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-close-btn:focus-visible {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.24);
      outline: none;
    }

    ${ne} .rte-version-diff-tab[aria-selected="true"],
    .${X}.rte-version-diff-theme-dark .rte-version-diff-tab[aria-selected="true"] {
      background: #1e3a8a;
      border-color: #3b82f6;
      color: #dbeafe;
    }

    ${ne} .rte-version-diff-inline,
    ${ne} .rte-version-diff-side-pane,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-inline,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-side-pane {
      background: #0f172a;
      border-color: #334155;
      color: #e5e7eb;
    }

    ${ne} .rte-version-diff-pane-title,
    ${ne} .rte-version-diff-summary,
    ${ne} .rte-version-diff-empty,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-pane-title,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-summary,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-empty {
      color: #94a3b8;
    }

    ${ne} .rte-version-diff-insert,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-insert {
      background: rgba(22, 163, 74, 0.25);
      color: #bbf7d0;
    }

    ${ne} .rte-version-diff-delete,
    .${X}.rte-version-diff-theme-dark .rte-version-diff-delete {
      background: rgba(220, 38, 38, 0.25);
      color: #fecaca;
    }
    :is(${ne}) .rte-toolbar-item .rte-toolbar-button[data-command="openVersionDiff"] svg{
      fill: none;
    }
  `,document.head.appendChild(e)}async function Jh(e,t,n){if(n!=null)return n;if(typeof t.getBaselineHtml=="function"){const a=Js(e),i=await Promise.resolve(t.getBaselineHtml({editor:e,editorRoot:a}));if(typeof i=="string")return i}const r=In.get(e);if(typeof r=="string")return r;if(typeof t.baselineHtml=="string")return t.baselineHtml;const o=Qs(e);return In.set(e,o),o}function Qh(e){const t=e.querySelector('button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');t==null||t.focus()}function ey(e,t){if(e.key!=="Tab")return;const n=Array.from(t.querySelectorAll('button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(i=>!i.hasAttribute("disabled"));if(n.length===0)return;const r=n[0],o=n[n.length-1],a=document.activeElement;e.shiftKey&&a===r?(e.preventDefault(),o.focus()):!e.shiftKey&&a===o&&(e.preventDefault(),r.focus())}function Bp(){Wo&&(Wo(),Wo=null)}function ad(e){!e||In.has(e)||In.set(e,Qs(e))}function ty(e){return{baselineHtml:e.baselineHtml,getBaselineHtml:e.getBaselineHtml,mode:e.mode||"word",ignoreWhitespace:e.ignoreWhitespace!==!1,maxTokens:Math.max(200,e.maxTokens??1200),maxMatrixSize:Math.max(5e4,e.maxMatrixSize??1e6),labels:Fh(e.labels)}}function Pp(e,t,n){Bp(),sr=e,Ki.set(e,t);const r=document.createElement("div");r.className=X,nd(e)&&r.classList.add("rte-version-diff-theme-dark");const o=document.createElement("section");o.className="rte-version-diff-dialog",o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.setAttribute("aria-labelledby","rte-version-diff-title");const a=t.labels;let i=(n==null?void 0:n.mode)||t.mode,l=(n==null?void 0:n.ignoreWhitespace)??t.ignoreWhitespace,s="inline";o.innerHTML=`
    <header class="rte-version-diff-header">
      <h2 id="rte-version-diff-title" class="rte-version-diff-title">${ce(a.title)}</h2>
      <div class="rte-version-diff-controls">
        <label>
          <span>${ce(a.mode)}:</span>
          <select class="rte-version-diff-select" aria-label="${ce(a.mode)}">
            <option value="word">Word</option>
            <option value="line">Line</option>
          </select>
        </label>
        <label class="rte-version-diff-checkbox">
          <input type="checkbox" class="rte-version-diff-ignore-ws" ${l?"checked":""}>
          ${ce(a.ignoreWhitespace)}
        </label>
        <button type="button" class="rte-version-diff-btn rte-version-diff-set-baseline" aria-label="${ce(a.setBaseline)}">${ce(a.setBaseline)}</button>
        <button type="button" class="rte-version-diff-btn" data-action="refresh" aria-label="${ce(a.refresh)}">${ce(a.refresh)}</button>
        <button type="button" class="rte-version-diff-btn rte-version-diff-close-btn" data-action="close" aria-label="${ce(a.close)}">✕</button>
      </div>
    </header>

    <div class="rte-version-diff-tabs" role="tablist" aria-label="Diff views">
      <button type="button" role="tab" class="rte-version-diff-tab" data-tab="inline" aria-selected="true">${ce(a.tabInline)}</button>
      <button type="button" role="tab" class="rte-version-diff-tab" data-tab="side" aria-selected="false">${ce(a.tabSideBySide)}</button>
    </div>

    <main class="rte-version-diff-body">
      <div class="rte-version-diff-summary" aria-live="polite"></div>
      <section class="rte-version-diff-panel active" data-panel="inline" role="tabpanel">
        <div class="rte-version-diff-inline" aria-label="Inline diff result"></div>
      </section>
      <section class="rte-version-diff-panel" data-panel="side" role="tabpanel">
        <div class="rte-version-diff-side-grid">
          <div>
            <h3 class="rte-version-diff-pane-title">${ce(a.baseline)}</h3>
            <div class="rte-version-diff-side-pane" data-side="baseline" aria-label="${ce(a.baseline)}"></div>
          </div>
          <div>
            <h3 class="rte-version-diff-pane-title">${ce(a.current)}</h3>
            <div class="rte-version-diff-side-pane" data-side="current" aria-label="${ce(a.current)}"></div>
          </div>
        </div>
      </section>
    </main>

    <footer class="rte-version-diff-footer">
      <small>Shortcut: Ctrl/Cmd + Alt + D (fallback: F8)</small>
      <small>Esc: close</small>
    </footer>
  `,r.appendChild(o),document.body.appendChild(r);const c=o.querySelector(".rte-version-diff-select");c.value=i;const d=o.querySelector(".rte-version-diff-ignore-ws"),u=o.querySelector(".rte-version-diff-summary"),f=o.querySelector(".rte-version-diff-inline"),m=o.querySelector('[data-side="baseline"]'),g=o.querySelector('[data-side="current"]');let p=0;const b=()=>{const v=`<p class="rte-version-diff-empty">${ce(a.loading)}</p>`;f.innerHTML=v,m.innerHTML=v,g.innerHTML=v,u.textContent=""},h=async v=>{p+=1;const E=p;r.classList.toggle("rte-version-diff-theme-dark",nd(e)),b();const H=e.innerHTML;let _="";try{_=await Jh(e,t,v??(n==null?void 0:n.baselineHtml))}catch{_=In.get(e)??Qs(e)}if(E!==p||!r.isConnected)return;const Ve=rd(_),We=rd(H),Sn=od(Ve,i,l),A=od(We,i,l),D=Uh(Sn,A,i,l,t.maxMatrixSize,t.maxTokens),se=Zh(D.segments,a);f.innerHTML=Gh(D.segments,a),m.innerHTML=se.baselineHtml,g.innerHTML=se.currentHtml;const K=[`+${D.insertedCount} inserted`,`-${D.deletedCount} deleted`,`${D.equalCount} unchanged`];D.usedFallback&&K.push(a.largeDocFallback),u.textContent=K.join(" | ")},x=v=>{s=v,o.querySelectorAll(".rte-version-diff-tab").forEach(E=>{const H=E.getAttribute("data-tab")===v;E.setAttribute("aria-selected",H?"true":"false"),E.tabIndex=H?0:-1}),o.querySelectorAll(".rte-version-diff-panel").forEach(E=>{E.classList.toggle("active",E.getAttribute("data-panel")===v)})},C=()=>{r.removeEventListener("keydown",L,!0),r.removeEventListener("click",T),document.removeEventListener("keydown",k,!0),r.parentNode&&r.parentNode.removeChild(r),Wo=null,e.focus({preventScroll:!0})},k=v=>{v.key==="Escape"&&(v.preventDefault(),v.stopPropagation(),C())},T=v=>{v.target===r&&C()},L=v=>{if(v.key==="Escape"){v.preventDefault(),C();return}if(ey(v,o),v.target&&v.target.classList.contains("rte-version-diff-tab")&&(v.key==="ArrowRight"||v.key==="ArrowLeft")){v.preventDefault();const E=s==="inline"?"side":"inline";x(E);const H=o.querySelector(`.rte-version-diff-tab[data-tab="${E}"]`);H==null||H.focus()}};o.addEventListener("click",v=>{const E=v.target,H=E.getAttribute("data-action");if(H==="close"){C();return}if(H==="refresh"){h();return}const _=E.getAttribute("data-tab");(_==="inline"||_==="side")&&x(_)}),c.addEventListener("change",()=>{i=c.value==="line"?"line":"word",h()}),d.addEventListener("change",()=>{l=d.checked,h()}),o.querySelector(".rte-version-diff-set-baseline").addEventListener("click",()=>{In.set(e,e.innerHTML),h(e.innerHTML)}),r.addEventListener("keydown",L,!0),r.addEventListener("click",T),document.addEventListener("keydown",k,!0),Wo=C,Qh(o),h()}function ny(e){bs=e,!ar&&(ar=t=>{if(!Yh(t))return;if(document.querySelector(`.${X}`)){t.preventDefault();return}const n=t.target;if(!!(n!=null&&n.closest("input, textarea, select")))return;const o=hs(void 0,!1);if(!o||o.getAttribute("contenteditable")==="false")return;t.preventDefault(),t.stopPropagation();const a=Ki.get(o)||bs||e;Pp(o,a)},document.addEventListener("keydown",ar,!0))}function ry(){ar&&(document.removeEventListener("keydown",ar,!0),ar=null,bs=null)}function oy(){ir||(ir=e=>{const t=e.target,n=t==null?void 0:t.closest(rn);n&&(sr=n,ad(n))},document.addEventListener("focusin",ir,!0)),lr||(lr=e=>{const n=e.target,r=n==null?void 0:n.closest(rn);r&&r.getAttribute("contenteditable")!=="false"&&(sr=r,ad(r))},document.addEventListener("beforeinput",lr,!0))}function ay(){ir&&(document.removeEventListener("focusin",ir,!0),ir=null),lr&&(document.removeEventListener("beforeinput",lr,!0),lr=null)}const iy=(e={})=>{const t=ty(e);return Xh(),{name:"versionDiff",toolbar:[{id:"versionDiff",label:"Version Diff",command:"openVersionDiff",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="3.5" y="4.5" width="7" height="15" rx="1.5" stroke="currentColor" stroke-width="1.8"></rect><rect x="13.5" y="4.5" width="7" height="15" rx="1.5" stroke="currentColor" stroke-width="1.8"></rect><path d="M5.5 12h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><path d="M15.5 12h3m-1.5-1.5v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>'}],commands:{openVersionDiff:(n,r)=>{const o=hs(r);return o?(Ki.set(o,t),Pp(o,t,n),!0):!1},setVersionDiffBaseline:(n,r)=>{const o=hs(r);if(!o)return!1;Ki.set(o,t);const a=typeof n=="string"?n:typeof(n==null?void 0:n.html)=="string"?n.html:o.innerHTML;return In.set(o,a),!0}},keymap:{"Mod-Alt-d":"openVersionDiff","Mod-Alt-D":"openVersionDiff",F8:"openVersionDiff"},init:()=>{Wa+=1,ny(t),oy()},destroy:()=>{Wa=Math.max(0,Wa-1),Wa===0&&(Bp(),ry(),ay())}}},st=".rte-content, .editora-content",mn='.rte-conditional-block[data-conditional-content="true"]',W=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',F=':is([data-theme="acme"], .editora-theme-acme, .rte-theme-acme)',re=":is(.rte-content.rte-conditional-theme-dark, .editora-content.rte-conditional-theme-dark)",oe=":is(.rte-content.rte-conditional-theme-acme, .editora-content.rte-conditional-theme-acme)",id="rte-conditional-content-styles",$="rte-conditional-dialog-overlay",O="rte-conditional-floating-toolbar",Mt=new WeakMap,ys=new WeakMap,be=new WeakMap,Hn=new Map,On=new Map;let Ko=null,Ua=0,cr=null,dr=null,ur=null,fr=null,pr=null,mr=null,an=null,ae=null,gr=null;const ly={dialogTitleInsert:"Insert Conditional Content",dialogTitleEdit:"Edit Conditional Content",conditionLabel:"Condition",conditionPlaceholder:'user.role == "admin"',audienceLabel:"Audience (comma separated)",audiencePlaceholder:"all",localeLabel:"Locale (comma separated)",localePlaceholder:"all",elseLabel:"Enable Else Block",saveText:"Save",cancelText:"Cancel",blockIfLabel:"IF",blockElseLabel:"ELSE",allAudiencesText:"all audiences",allLocalesText:"all locales"};function de(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function kn(e){return e?e.split(",").map(t=>t.trim()).filter(Boolean):[]}function ld(e){return!e||e.length===0?"":e.join(", ")}function Gr(e){return e?e.map(t=>t.trim()).filter(Boolean):[]}function sy(e){return{...ly,...e||{}}}function Ot(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function Ma(e){return e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||e}function Ga(e){if(!e)return!1;const t=e.getAttribute("data-theme")||e.getAttribute("theme");return t&&t.toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark")}function cy(e){const t=Ma(e);if(Ga(t))return!0;const n=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return Ga(n)?!0:Ga(document.documentElement)||Ga(document.body)}function Za(e){if(!e)return!1;const t=e.getAttribute("data-theme")||e.getAttribute("theme");return t&&t.toLowerCase()==="acme"?!0:e.classList.contains("editora-theme-acme")||e.classList.contains("rte-theme-acme")}function dy(e){const t=Ma(e);if(Za(t))return!0;const n=t.closest("[data-theme], [theme], .editora-theme-acme, .rte-theme-acme");return Za(n)?!0:Za(document.documentElement)||Za(document.body)}function uy(e){return cy(e)?"dark":dy(e)?"acme":"light"}function Cl(e,t){const n=uy(t);e.classList.remove("rte-conditional-theme-dark","rte-conditional-theme-acme"),n==="dark"?e.classList.add("rte-conditional-theme-dark"):n==="acme"&&e.classList.add("rte-conditional-theme-acme")}function wt(e,t=!0){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const o=e.editorElement;if(o.matches(st))return o;const a=o.querySelector(st);if(a instanceof HTMLElement)return a}const n=window.getSelection();if(n&&n.rangeCount>0){const o=n.getRangeAt(0).startContainer,a=o.nodeType===Node.ELEMENT_NODE?o:o.parentElement,i=a==null?void 0:a.closest(st);if(i)return i}const r=document.activeElement;if(r){if(r.matches(st))return r;const o=r.closest(st);if(o)return o}return ae&&ae.isConnected?ae:t?document.querySelector(st):null}function Ip(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const n=t.getRangeAt(0);return e.contains(n.commonAncestorContainer)?n.cloneRange():null}function ec(e,t){const n=window.getSelection();n&&(n.removeAllRanges(),n.addRange(t),e.focus({preventScroll:!0}))}function Hp(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function Op(e,t){if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}}function Ui(e,t){const n=document.createRange();n.selectNodeContents(t),n.collapse(!1),ec(e,n)}function Xl(e,t){if(t)return t.split(".").filter(Boolean).reduce((n,r)=>{if(n!=null&&typeof n=="object")return n[r]},e)}function fy(e){const t=e.trim();if(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))return t.slice(1,-1);if(t==="true")return!0;if(t==="false")return!1;if(t==="null")return null;const n=Number(t);if(!Number.isNaN(n)&&t!=="")return n;if(t.startsWith("[")&&t.endsWith("]")||t.startsWith("{")&&t.endsWith("}"))try{return JSON.parse(t)}catch{return t}return t}function py(e,t){const n=e.trim();if(!n)return!0;if(n.startsWith("!")){const c=n.slice(1).trim();return!Xl(t,c)}const r=n.match(/^([a-zA-Z_$][\w.$]*)\s*(==|!=|>=|<=|>|<|in|contains|~=)\s*(.+)$/);if(!r)return!!Xl(t,n);const[,o,a,i]=r,l=Xl(t,o),s=fy(i);switch(a){case"==":return l==s;case"!=":return l!=s;case">":return Number(l)>Number(s);case"<":return Number(l)<Number(s);case">=":return Number(l)>=Number(s);case"<=":return Number(l)<=Number(s);case"in":return Array.isArray(s)?s.some(c=>c==l):typeof s=="string"?s.split(",").map(c=>c.trim()).includes(String(l)):!1;case"contains":case"~=":return Array.isArray(l)?l.some(c=>String(c).toLowerCase()===String(s).toLowerCase()):typeof l=="string"?l.toLowerCase().includes(String(s).toLowerCase()):!1;default:return!1}}function my(){if(typeof document>"u"||document.getElementById(id))return;const e=document.createElement("style");e.id=id,e.textContent=`
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

    .${$} {
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

    .rte-conditional-preview-on ${mn} {
      border-width: 2px;
    }

    .rte-conditional-preview-on ${mn} .rte-conditional-header {
      background: #ecfeff;
      border-color: #bae6fd;
    }

    ${W} .rte-conditional-block,
    ${re} .rte-conditional-block,
    .${$}.rte-conditional-theme-dark .rte-conditional-block {
      background: #111827;
      border-color: #334155;
    }

    ${W} .rte-conditional-header,
    ${W} .rte-conditional-else-label,
    ${re} .rte-conditional-header,
    ${re} .rte-conditional-else-label,
    .${$}.rte-conditional-theme-dark .rte-conditional-header,
    .${$}.rte-conditional-theme-dark .rte-conditional-else-label {
      background: #0f172a;
      border-color: #334155;
    }

    ${W} .rte-conditional-summary,
    ${re} .rte-conditional-summary,
    .${$}.rte-conditional-theme-dark .rte-conditional-summary {
      color: #e2e8f0;
    }

    ${W} .rte-conditional-meta,
    ${re} .rte-conditional-meta,
    .${$}.rte-conditional-theme-dark .rte-conditional-meta {
      color: #94a3b8;
    }

    ${W} .rte-conditional-chip,
    ${re} .rte-conditional-chip,
    .${$}.rte-conditional-theme-dark .rte-conditional-chip {
      background: #1e3a8a;
      border-color: #3b82f6;
      color: #dbeafe;
    }

    ${W} .rte-conditional-chip-else,
    ${re} .rte-conditional-chip-else,
    .${$}.rte-conditional-theme-dark .rte-conditional-chip-else {
      background: #7f1d1d;
      border-color: #ef4444;
      color: #fee2e2;
    }

    ${W} .rte-conditional-body,
    ${re} .rte-conditional-body,
    .${$}.rte-conditional-theme-dark .rte-conditional-body {
      background: #1f2937;
      color: #e2e8f0;
    }

    ${W} .rte-conditional-dialog,
    ${re} .rte-conditional-dialog,
    .${$}.rte-conditional-theme-dark .rte-conditional-dialog {
      background: #1f2937;
      border-color: #334155;
    }

    ${W} .rte-conditional-dialog-header,
    ${W} .rte-conditional-dialog-footer,
    ${re} .rte-conditional-dialog-header,
    ${re} .rte-conditional-dialog-footer,
    .${$}.rte-conditional-theme-dark .rte-conditional-dialog-header,
    .${$}.rte-conditional-theme-dark .rte-conditional-dialog-footer {
      background: #111827;
      border-color: #334155;
    }

    ${W} .rte-conditional-dialog-title,
    ${W} .rte-conditional-field label,
    ${W} .rte-conditional-checkbox,
    ${re} .rte-conditional-dialog-title,
    ${re} .rte-conditional-field label,
    ${re} .rte-conditional-checkbox,
    .${$}.rte-conditional-theme-dark .rte-conditional-dialog-title,
    .${$}.rte-conditional-theme-dark .rte-conditional-field label,
    .${$}.rte-conditional-theme-dark .rte-conditional-checkbox {
      color: #e2e8f0;
    }

    ${W} .rte-conditional-help,
    ${re} .rte-conditional-help,
    .${$}.rte-conditional-theme-dark .rte-conditional-help {
      color: #94a3b8;
    }

    ${W} .rte-conditional-field input[type="text"],
    ${W} .rte-conditional-btn,
    ${re} .rte-conditional-field input[type="text"],
    ${re} .rte-conditional-btn,
    .${$}.rte-conditional-theme-dark .rte-conditional-field input[type="text"],
    .${$}.rte-conditional-theme-dark .rte-conditional-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    ${W} .rte-conditional-btn-primary,
    ${re} .rte-conditional-btn-primary,
    .${$}.rte-conditional-theme-dark .rte-conditional-btn-primary {
      border-color: #3b82f6;
      background: #2563eb;
      color: #ffffff;
    }

    ${W} .rte-toolbar-group-items.conditional-content,
    .${$}.rte-conditional-theme-dark .rte-toolbar-group-items.conditional-content,
    ${re} .rte-toolbar-group-items.conditional-content,
    ${W} .editora-toolbar-group-items.conditional-content {
      border-color: #566275;
    }

    ${W} .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    ${re} .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    ${W} .editora-toolbar-group-items.conditional-content .editora-toolbar-button {
      border-right-color: #566275;
    }

    ${W} .${O},
    .${$}.rte-conditional-theme-dark .${O},
    .${O}.rte-conditional-theme-dark {
      background: rgba(17, 24, 39, 0.98);
      border-color: #334155;
      box-shadow: 0 14px 30px rgba(2, 6, 23, 0.5);
    }

    ${W} .${O} .rte-conditional-float-btn,
    .${$}.rte-conditional-theme-dark .${O} .rte-conditional-float-btn,
    .${O}.rte-conditional-theme-dark .rte-conditional-float-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    ${W} .${O} .rte-conditional-float-btn[data-action="delete"],
    .${$}.rte-conditional-theme-dark .${O} .rte-conditional-float-btn[data-action="delete"],
    .${O}.rte-conditional-theme-dark .rte-conditional-float-btn[data-action="delete"] {
      border-color: #ef4444;
      color: #fecaca;
      background: rgba(127, 29, 29, 0.45);
    }

    ${F} .rte-conditional-block,
    ${oe} .rte-conditional-block,
    .${$}.rte-conditional-theme-acme .rte-conditional-block {
      background: #f8fbff;
      border-color: #cbd8e8;
    }

    ${F} .rte-conditional-header,
    ${F} .rte-conditional-else-label,
    ${oe} .rte-conditional-header,
    ${oe} .rte-conditional-else-label,
    .${$}.rte-conditional-theme-acme .rte-conditional-header,
    .${$}.rte-conditional-theme-acme .rte-conditional-else-label {
      background: linear-gradient(180deg, #eef4fb 0%, #e6eef8 100%);
      border-color: #cbd8e8;
    }

    ${F} .rte-conditional-summary,
    ${oe} .rte-conditional-summary,
    .${$}.rte-conditional-theme-acme .rte-conditional-summary {
      color: #0f172a;
    }

    ${F} .rte-conditional-meta,
    ${oe} .rte-conditional-meta,
    .${$}.rte-conditional-theme-acme .rte-conditional-meta {
      color: #587089;
    }

    ${F} .rte-conditional-chip,
    ${oe} .rte-conditional-chip,
    .${$}.rte-conditional-theme-acme .rte-conditional-chip {
      background: #d9f5ee;
      border-color: #66c6b3;
      color: #0f4f4a;
    }

    ${F} .rte-conditional-chip-else,
    ${oe} .rte-conditional-chip-else,
    .${$}.rte-conditional-theme-acme .rte-conditional-chip-else {
      background: #fde8ea;
      border-color: #f1a7b2;
      color: #8b1f2f;
    }

    ${F} .rte-conditional-body,
    ${oe} .rte-conditional-body,
    .${$}.rte-conditional-theme-acme .rte-conditional-body {
      background: #fcfeff;
      color: #0f172a;
    }

    ${F} .rte-conditional-dialog,
    ${oe} .rte-conditional-dialog,
    .${$}.rte-conditional-theme-acme .rte-conditional-dialog {
      background: #ffffff;
      border-color: #cbd8e8;
      box-shadow: 0 20px 44px rgba(15, 23, 42, 0.18);
    }

    ${F} .rte-conditional-dialog-header,
    ${F} .rte-conditional-dialog-footer,
    ${oe} .rte-conditional-dialog-header,
    ${oe} .rte-conditional-dialog-footer,
    .${$}.rte-conditional-theme-acme .rte-conditional-dialog-header,
    .${$}.rte-conditional-theme-acme .rte-conditional-dialog-footer {
      background: #f3f8fd;
      border-color: #d8e4f1;
    }

    ${F} .rte-conditional-dialog-title,
    ${F} .rte-conditional-field label,
    ${F} .rte-conditional-checkbox,
    ${oe} .rte-conditional-dialog-title,
    ${oe} .rte-conditional-field label,
    ${oe} .rte-conditional-checkbox,
    .${$}.rte-conditional-theme-acme .rte-conditional-dialog-title,
    .${$}.rte-conditional-theme-acme .rte-conditional-field label,
    .${$}.rte-conditional-theme-acme .rte-conditional-checkbox {
      color: #1f334a;
    }

    ${F} .rte-conditional-help,
    ${oe} .rte-conditional-help,
    .${$}.rte-conditional-theme-acme .rte-conditional-help {
      color: #5f738d;
    }

    ${F} .rte-conditional-field input[type="text"],
    ${F} .rte-conditional-btn,
    ${oe} .rte-conditional-field input[type="text"],
    ${oe} .rte-conditional-btn,
    .${$}.rte-conditional-theme-acme .rte-conditional-field input[type="text"],
    .${$}.rte-conditional-theme-acme .rte-conditional-btn {
      background: #ffffff;
      border-color: #bfd0e2;
      color: #0f172a;
    }

    ${F} .rte-conditional-btn-primary,
    ${oe} .rte-conditional-btn-primary,
    .${$}.rte-conditional-theme-acme .rte-conditional-btn-primary {
      border-color: #0f766e;
      background: #0f766e;
      color: #ffffff;
    }

    ${F} .rte-toolbar-group-items.conditional-content,
    .${$}.rte-conditional-theme-acme .rte-toolbar-group-items.conditional-content,
    ${oe} .rte-toolbar-group-items.conditional-content,
    ${F} .editora-toolbar-group-items.conditional-content {
      border-color: #bfd0e2;
    }

    ${F} .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    ${oe} .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    ${F} .editora-toolbar-group-items.conditional-content .editora-toolbar-button {
      border-right-color: #bfd0e2;
    }

    ${F} .${O},
    .${$}.rte-conditional-theme-acme .${O},
    .${O}.rte-conditional-theme-acme {
      background: rgba(255, 255, 255, 0.98);
      border-color: #bfd0e2;
      box-shadow: 0 14px 28px rgba(15, 23, 42, 0.16);
    }

    ${F} .${O} .rte-conditional-float-btn,
    .${$}.rte-conditional-theme-acme .${O} .rte-conditional-float-btn,
    .${O}.rte-conditional-theme-acme .rte-conditional-float-btn {
      background: #ffffff;
      border-color: #bfd0e2;
      color: #1f334a;
    }

    ${F} .${O} .rte-conditional-float-btn:hover,
    .${$}.rte-conditional-theme-acme .${O} .rte-conditional-float-btn:hover,
    .${O}.rte-conditional-theme-acme .rte-conditional-float-btn:hover {
      background: #eef7f5;
      color: #0f4f4a;
    }

    ${F} .${O} .rte-conditional-float-btn[data-action="delete"],
    .${$}.rte-conditional-theme-acme .${O} .rte-conditional-float-btn[data-action="delete"],
    .${O}.rte-conditional-theme-acme .rte-conditional-float-btn[data-action="delete"] {
      border-color: #f1a7b2;
      color: #8b1f2f;
      background: #fff4f6;
    }
  `,document.head.appendChild(e)}function gy(e){return{defaultCondition:e.defaultCondition||"",defaultAudience:Gr(e.defaultAudience||[]),defaultLocale:Gr(e.defaultLocale||[]),enableElseByDefault:e.enableElseByDefault===!0,labels:sy(e.labels),context:e.context,getContext:e.getContext,currentAudience:e.currentAudience,currentLocale:e.currentLocale,evaluateCondition:e.evaluateCondition||py}}function zp(){Ko&&(Ko.cleanup(),Ko=null)}function by(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function Zr(e,t){e.setAttribute("contenteditable","false"),e.setAttribute("spellcheck","false");const n=e.querySelector(".rte-conditional-header");n&&(n.setAttribute("contenteditable","false"),n.setAttribute("tabindex","0"),n.setAttribute("role","button"),n.setAttribute("aria-label","Edit conditional rule"));const r=e.querySelector(".rte-conditional-else-label");r&&r.setAttribute("contenteditable","false"),xy(e,!t)}function hy(e){const t=e.querySelector('.rte-conditional-body[data-slot="if"]');if(!t)return;const n=new Set,r=e.querySelector(".rte-conditional-header"),o=e.querySelector(".rte-conditional-else-label"),a=e.querySelector('.rte-conditional-body[data-slot="else"]');r&&n.add(r),n.add(t),o&&n.add(o),a&&n.add(a),Array.from(e.childNodes).forEach(l=>{if(!(l instanceof HTMLElement&&n.has(l))){if(l.nodeType===Node.TEXT_NODE&&!(l.textContent||"").trim()){l.remove();return}t.appendChild(l)}})}function Qn(e){const t=window.getSelection();if(t&&t.rangeCount>0){const o=t.getRangeAt(0).startContainer,a=o.nodeType===Node.ELEMENT_NODE?o:o.parentElement,i=a==null?void 0:a.closest(mn);if(i&&e.contains(i))return i}const n=document.activeElement,r=n==null?void 0:n.closest(mn);return r&&e.contains(r)?r:null}function tc(e,t){let n=e.querySelector(".rte-conditional-else-label"),r=e.querySelector('.rte-conditional-body[data-slot="else"]');n||(n=document.createElement("div"),n.className="rte-conditional-else-label",n.setAttribute("contenteditable","false"),n.innerHTML=`
      <span class="rte-conditional-chip rte-conditional-chip-else">${de(t.blockElseLabel)}</span>
      <span class="rte-conditional-summary">Else branch</span>
    `,e.appendChild(n)),r||(r=document.createElement("div"),r.className="rte-conditional-body rte-conditional-else-body",r.setAttribute("data-slot","else"),r.innerHTML="<p><br></p>",e.appendChild(r))}function yy(e,t){e.setAttribute("data-has-else",t?"true":"false");const n=e.querySelector(".rte-conditional-else-label"),r=e.querySelector('.rte-conditional-body[data-slot="else"]');n&&n.classList.toggle("rte-conditional-hidden",!t),r&&r.classList.toggle("rte-conditional-hidden",!t)}function xy(e,t){Array.from(e.querySelectorAll(".rte-conditional-body")).forEach(r=>{r.setAttribute("contenteditable",t?"true":"false")}),e.setAttribute("contenteditable","false")}function nc(e,t){const n=e.getAttribute("data-condition")||"",r=kn(e.getAttribute("data-audience")),o=kn(e.getAttribute("data-locale"));let a=e.querySelector(".rte-conditional-header");a||(a=document.createElement("div"),a.className="rte-conditional-header",e.prepend(a)),a.setAttribute("contenteditable","false"),a.setAttribute("tabindex","0"),a.setAttribute("role","button"),a.setAttribute("aria-label","Edit conditional rule");const i=n||"(always true)",l=r.length>0?r.join(", "):t.allAudiencesText,s=o.length>0?o.join(", "):t.allLocalesText;if(a.innerHTML=`
    <span class="rte-conditional-chip">${de(t.blockIfLabel)}</span>
    <span class="rte-conditional-summary">${de(i)}</span>
    <span class="rte-conditional-meta">${de(l)} · ${de(s)}</span>
  `,!e.querySelector('.rte-conditional-body[data-slot="if"]')){const u=document.createElement("div");u.className="rte-conditional-body",u.setAttribute("data-slot","if"),u.innerHTML="<p><br></p>",e.insertBefore(u,e.children[1]||null)}const d=e.getAttribute("data-has-else")==="true";d&&tc(e,t),hy(e),yy(e,d)}function qp(e,t){const n=document.createElement("section");n.className="rte-conditional-block",n.setAttribute("data-conditional-content","true"),n.setAttribute("data-condition",(e.condition||"").trim()),n.setAttribute("data-audience",Gr(e.audience).join(",")),n.setAttribute("data-locale",Gr(e.locale).join(",")),n.setAttribute("data-has-else",e.hasElse?"true":"false"),n.setAttribute("role","group"),n.setAttribute("aria-label","Conditional content block"),n.setAttribute("contenteditable","false"),n.setAttribute("spellcheck","false");const r=document.createElement("div");r.className="rte-conditional-header",r.setAttribute("contenteditable","false");const o=document.createElement("div");return o.className="rte-conditional-body",o.setAttribute("data-slot","if"),o.innerHTML="<p><br></p>",n.appendChild(r),n.appendChild(o),e.hasElse&&tc(n,t),nc(n,t),Zr(n,!1),n}function vy(e,t){if(t)try{if(!e.isConnected)return;const n=e.contains(t.startContainer),r=e.contains(t.endContainer);if(!n||!r)return;ec(e,t)}catch{}}function ky(e){return(e.textContent||"").replace(/\u200B/g,"").trim().length>0?!0:e.querySelector("img, video, table, iframe, hr, pre, blockquote, ul, ol")!==null}function _p(e,t,n){let r=null;if(n)try{const i=n.cloneRange();e.contains(i.commonAncestorContainer)&&(r=i)}catch{r=null}r||(r=Ip(e)),r||(r=document.createRange(),r.selectNodeContents(e),r.collapse(!1));let o=null;r.collapsed||(o=r.extractContents()),r.insertNode(t);const a=t.querySelector('.rte-conditional-body[data-slot="if"]');a&&o&&ky(o)&&(a.innerHTML="",a.appendChild(o)),a?Ui(e,a):Ui(e,t),e.normalize()}function wy(e){return{condition:e.getAttribute("data-condition")||"",audience:kn(e.getAttribute("data-audience")),locale:kn(e.getAttribute("data-locale")),hasElse:e.getAttribute("data-has-else")==="true"}}function Ey(e,t,n){e.setAttribute("data-condition",(t.condition||"").trim()),e.setAttribute("data-audience",Gr(t.audience).join(",")),e.setAttribute("data-locale",Gr(t.locale).join(",")),e.setAttribute("data-has-else",t.hasElse?"true":"false"),t.hasElse&&tc(e,n),nc(e,n),Zr(e,e.classList.contains("rte-conditional-preview"))}function Yr(e,t){Cl(e,e);const n=Array.from(e.querySelectorAll(mn)),r=Mt.get(e)===!0;return n.forEach(o=>{o.classList.add("rte-conditional-block"),o.setAttribute("data-conditional-content","true"),o.hasAttribute("data-condition")||o.setAttribute("data-condition",""),o.hasAttribute("data-audience")||o.setAttribute("data-audience",""),o.hasAttribute("data-locale")||o.setAttribute("data-locale",""),o.hasAttribute("data-has-else")||o.setAttribute("data-has-else","false"),o.setAttribute("role","group"),o.setAttribute("aria-label","Conditional content block"),o.setAttribute("contenteditable","false"),o.setAttribute("spellcheck","false"),nc(o,t),Zr(o,r)}),n}async function Cy(e,t){const n=ys.get(e);if(n)return n;if(typeof t.getContext=="function")try{const r=Ma(e),o=await Promise.resolve(t.getContext({editor:e,editorRoot:r}));if(o&&typeof o=="object")return o}catch{return{}}if(typeof t.context=="function")try{const r=t.context();if(r&&typeof r=="object")return r}catch{return{}}return t.context&&typeof t.context=="object"?t.context:{}}function Ya(e){return Array.isArray(e)?e.map(t=>t.trim().toLowerCase()).filter(Boolean):typeof e=="string"?e.split(",").map(t=>t.trim().toLowerCase()).filter(Boolean):[]}function sd(e,t){return e.length===0||e.includes("all")?!0:t.length===0?!1:e.some(n=>t.includes(n))}async function er(e,t,n){var m,g;const r=t.labels,o=Yr(e,r);if(Mt.set(e,n),Fp(e,n),Ma(e).classList.toggle("rte-conditional-preview-on",n),!n){o.forEach(p=>{p.classList.remove("rte-conditional-preview"),Zr(p,!1);const b=p.querySelector('.rte-conditional-body[data-slot="if"]'),h=p.querySelector('.rte-conditional-body[data-slot="else"]'),x=p.querySelector(".rte-conditional-else-label"),C=p.getAttribute("data-has-else")==="true";b&&(b.classList.remove("rte-conditional-hidden"),b.removeAttribute("aria-hidden")),h&&(h.classList.toggle("rte-conditional-hidden",!C),h.setAttribute("aria-hidden",C?"false":"true")),x&&x.classList.toggle("rte-conditional-hidden",!C)});return}const i=await Cy(e,t),l=Ya(t.currentAudience),s=Ya(t.currentLocale),c=Ya(i.audience??((m=i.user)==null?void 0:m.audience)),d=Ya(i.locale??((g=i.user)==null?void 0:g.locale)),u=l.length>0?l:c,f=s.length>0?s:d;o.forEach(p=>{const b=p.getAttribute("data-condition")||"",h=kn(p.getAttribute("data-audience")).map(_=>_.toLowerCase()),x=kn(p.getAttribute("data-locale")).map(_=>_.toLowerCase()),C=p.getAttribute("data-has-else")==="true",k=t.evaluateCondition(b,i),T=sd(h,u),L=sd(x,f),w=k&&T&&L,v=p.querySelector('.rte-conditional-body[data-slot="if"]'),E=p.querySelector('.rte-conditional-body[data-slot="else"]'),H=p.querySelector(".rte-conditional-else-label");if(p.classList.add("rte-conditional-preview"),Zr(p,!0),v&&(v.classList.toggle("rte-conditional-hidden",!w),v.setAttribute("aria-hidden",w?"false":"true")),E){const _=C&&!w;E.classList.toggle("rte-conditional-hidden",!_),E.setAttribute("aria-hidden",_?"false":"true")}if(H){const _=C&&!w;H.classList.toggle("rte-conditional-hidden",!_)}})}function Fp(e,t){const n=Ma(e);Array.from(n.querySelectorAll('[data-command="toggleConditionalPreview"], [data-command="conditionalPreview"]')).forEach(o=>{o.setAttribute("data-active",t?"true":"false"),o.classList.toggle("active",t),o.setAttribute("aria-pressed",t?"true":"false")})}function Sy(e){const t=Hn.get(e);if(t&&t.isConnected)return t;const n=document.createElement("div");return n.className=O,n.setAttribute("role","toolbar"),n.setAttribute("aria-label","Conditional block actions"),n.innerHTML=`
    <button type="button" class="rte-conditional-float-btn" data-action="edit" title="Edit Condition" aria-label="Edit Condition">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4 17.3V20h2.7l9.7-9.7-2.7-2.7L4 17.3Zm14.7-9.4a1 1 0 0 0 0-1.4l-1.2-1.2a1 1 0 0 0-1.4 0l-1.1 1.1 2.7 2.7 1-1.2Z" fill="currentColor"></path></svg>
    </button>
    <button type="button" class="rte-conditional-float-btn" data-action="delete" title="Delete Block" aria-label="Delete Block">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M8 4h8l1 2h4v2H3V6h4l1-2Zm1 6h2v8H9v-8Zm4 0h2v8h-2v-8Z" fill="currentColor"></path></svg>
    </button>
  `,n.addEventListener("mousedown",r=>{r.preventDefault()}),n.addEventListener("click",r=>{var s;const o=r.target,a=(s=o==null?void 0:o.closest("[data-action]"))==null?void 0:s.getAttribute("data-action");if(!a)return;const i=be.get(e)||gr;if(!i)return;const l=On.get(e);if(!(!l||!e.contains(l))){if(a==="edit"){Je(e,i,"edit",void 0,l);return}a==="delete"&&(Vp(e,l),On.set(e,null),An(e))}}),document.body.appendChild(n),Hn.set(e,n),n}function An(e){const t=Hn.get(e);t&&t.classList.remove("show")}function jp(e,t){const n=t.getBoundingClientRect();e.style.left="0px",e.style.top="0px",e.classList.add("show");const r=e.getBoundingClientRect(),o=8,a=window.innerWidth,i=window.innerHeight;let l=n.top-r.height-o;l<o&&(l=n.bottom+o),l=Math.min(l,i-r.height-o);let s=n.right-r.width;s=Math.max(o,Math.min(s,a-r.width-o)),e.style.left=`${s}px`,e.style.top=`${l}px`}function Ei(e,t){const n=Sy(e);Cl(n,e),On.set(e,t),jp(n,t)}function ln(e){const t=be.get(e)||gr;if(!t)return;const n=Qn(e);if(!n||!e.contains(n)||Ot(e)){On.set(e,null),An(e);return}Yr(e,t.labels),Ei(e,n)}function Ty(){Hn.forEach((e,t)=>{if(!t.isConnected||!e.isConnected){e.remove(),Hn.delete(t),On.delete(t);return}if(!e.classList.contains("show"))return;Cl(e,t);const n=On.get(t);if(!n||!t.contains(n)){An(t);return}jp(e,n)})}function Vp(e,t){if(!e.contains(t))return!1;const n=e.innerHTML,r=t.parentNode,o=t.nextSibling;t.remove(),r===e&&e.innerHTML.trim()===""&&(e.innerHTML="<p><br></p>");const a=document.createRange();return o&&e.contains(o)?a.setStartBefore(o):(a.selectNodeContents(e),a.collapse(!1)),a.collapse(!0),ec(e,a),Hp(e),Op(e,n),!0}function cd(e,t,n){const r=e.cloneRange(),o=document.createRange();return o.selectNodeContents(t),o.collapse(n==="start"),r.startContainer===o.startContainer&&r.startOffset===o.startOffset&&r.endContainer===o.endContainer&&r.endOffset===o.endOffset}function Je(e,t,n,r,o){zp();const a=t.labels,i=n==="insert"?Ip(e):null,l=document.createElement("div");l.className=$,Cl(l,e);const s=document.createElement("section");s.className="rte-conditional-dialog",s.setAttribute("role","dialog"),s.setAttribute("aria-modal","true"),s.setAttribute("aria-labelledby","rte-conditional-dialog-title");const c=o?wy(o):void 0,d=r||c||{},u=d.condition??t.defaultCondition,f=d.audience??t.defaultAudience,m=d.locale??t.defaultLocale,g=d.hasElse??t.enableElseByDefault;s.innerHTML=`
    <header class="rte-conditional-dialog-header">
      <h2 id="rte-conditional-dialog-title" class="rte-conditional-dialog-title">${de(n==="edit"?a.dialogTitleEdit:a.dialogTitleInsert)}</h2>
      <button type="button" class="rte-conditional-btn" data-action="cancel" aria-label="${de(a.cancelText)}">✕</button>
    </header>
    <div class="rte-conditional-dialog-body">
      <div class="rte-conditional-field">
        <label for="rte-conditional-condition">${de(a.conditionLabel)}</label>
        <input id="rte-conditional-condition" class="rte-conditional-input-condition" type="text" value="${de(u||"")}" placeholder="${de(a.conditionPlaceholder)}" />
      </div>
      <div class="rte-conditional-field">
        <label for="rte-conditional-audience">${de(a.audienceLabel)}</label>
        <input id="rte-conditional-audience" class="rte-conditional-input-audience" type="text" value="${de(ld(f))}" placeholder="${de(a.audiencePlaceholder)}" />
      </div>
      <div class="rte-conditional-field">
        <label for="rte-conditional-locale">${de(a.localeLabel)}</label>
        <input id="rte-conditional-locale" class="rte-conditional-input-locale" type="text" value="${de(ld(m))}" placeholder="${de(a.localePlaceholder)}" />
      </div>
      <label class="rte-conditional-checkbox">
        <input class="rte-conditional-input-else" type="checkbox" ${g?"checked":""} />
        <span>${de(a.elseLabel)}</span>
      </label>
      <p class="rte-conditional-help">Example condition: <code>user.role == "admin"</code>, <code>locale == "en-US"</code>, <code>!feature.beta</code></p>
    </div>
    <footer class="rte-conditional-dialog-footer">
      <button type="button" class="rte-conditional-btn" data-action="cancel">${de(a.cancelText)}</button>
      <button type="button" class="rte-conditional-btn rte-conditional-btn-primary" data-action="save">${de(a.saveText)}</button>
    </footer>
  `,l.appendChild(s),document.body.appendChild(l);const p=s.querySelector(".rte-conditional-input-condition"),b=s.querySelector(".rte-conditional-input-audience"),h=s.querySelector(".rte-conditional-input-locale"),x=s.querySelector(".rte-conditional-input-else"),C=()=>{l.removeEventListener("click",T),l.removeEventListener("keydown",v,!0),document.removeEventListener("keydown",k,!0),l.parentNode&&l.parentNode.removeChild(l),Ko=null,e.focus({preventScroll:!0}),ln(e)},k=E=>{E.key==="Escape"&&(E.preventDefault(),E.stopPropagation(),C())},T=E=>{E.target===l&&C()},L=E=>{if(E.key!=="Tab")return;const H=Array.from(s.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));if(H.length===0)return;const _=H[0],Ve=H[H.length-1],We=document.activeElement;if(E.shiftKey&&We===_){E.preventDefault(),Ve.focus();return}!E.shiftKey&&We===Ve&&(E.preventDefault(),_.focus())},w=async()=>{var Ve;const E={condition:((Ve=p==null?void 0:p.value)==null?void 0:Ve.trim())||"",audience:kn(b==null?void 0:b.value),locale:kn(h==null?void 0:h.value),hasElse:(x==null?void 0:x.checked)||!1},H=e.innerHTML;if(o)Ey(o,E,a),Zr(o,Mt.get(e)===!0);else{vy(e,i);const We=qp(E,a);try{_p(e,We)}catch{e.appendChild(We);const Sn=We.querySelector('.rte-conditional-body[data-slot="if"]');Sn?Ui(e,Sn):Ui(e,We)}}Mt.get(e)===!0&&await er(e,t,!0),Hp(e),Op(e,H),ln(e),C()},v=E=>{if(E.key==="Escape"){E.preventDefault(),C();return}L(E),E.key==="Enter"&&!E.shiftKey&&E.target instanceof HTMLInputElement&&(E.preventDefault(),w())};s.addEventListener("click",E=>{const _=E.target.getAttribute("data-action");if(_==="cancel"){C();return}_==="save"&&w()}),l.addEventListener("click",T),l.addEventListener("keydown",v,!0),document.addEventListener("keydown",k,!0),Ko={cleanup:C},p==null||p.focus()}function $y(e){const t=e.metaKey||e.ctrlKey,r=(typeof e.key=="string"?e.key:"").toLowerCase(),o=typeof e.code=="string"?e.code.toLowerCase():"",a=t&&e.altKey&&e.shiftKey&&(r==="c"||o==="keyc"),i=!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&(r==="f9"||o==="f9");return a||i}function Ly(e){const t=e.metaKey||e.ctrlKey,r=(typeof e.key=="string"?e.key:"").toLowerCase(),o=typeof e.code=="string"?e.code.toLowerCase():"",a=t&&e.altKey&&e.shiftKey&&(r==="p"||o==="keyp"),i=!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&(r==="f10"||o==="f10");return a||i}function Ay(e){gr=e,dr||(dr=t=>{const n=t.target,r=n==null?void 0:n.closest(st);if(!r)return;ae=r,be.has(r)||be.set(r,e);const o=be.get(r)||e;Yr(r,o.labels),Fp(r,Mt.get(r)===!0),ln(r)},document.addEventListener("focusin",dr,!0)),cr||(cr=t=>{var d;if(document.querySelector(`.${$}`))return;const r=t.target;if(!!(r!=null&&r.closest("input, textarea, select")))return;const i=(r==null?void 0:r.closest(st))||wt(void 0,!1)||ae;if(!i||Ot(i))return;const l=be.get(i)||gr||e,s=document.activeElement,c=(r==null?void 0:r.closest(".rte-conditional-header"))||(s==null?void 0:s.closest(".rte-conditional-header"));if(c&&(t.key==="Enter"||t.key===" ")){const u=c.closest(mn);if(u&&i.contains(u)){t.preventDefault(),t.stopPropagation(),Je(i,l,"edit",void 0,u);return}}if($y(t)){t.preventDefault(),t.stopPropagation();const u=Qn(i);u?Je(i,l,"edit",void 0,u):Je(i,l,"insert");return}if(Ly(t)){t.preventDefault(),t.stopPropagation();const u=Mt.get(i)!==!0;er(i,l,u),ln(i);return}if((t.key==="Backspace"||t.key==="Delete")&&!t.altKey&&!t.ctrlKey&&!t.metaKey){const u=window.getSelection();if(!u||u.rangeCount===0)return;const f=u.getRangeAt(0);if(!f.collapsed||!i.contains(f.commonAncestorContainer))return;const m=(d=by(f.startContainer))==null?void 0:d.closest(".rte-conditional-body");if(!m||!i.contains(m))return;if(t.key==="Backspace"&&cd(f,m,"start")){t.preventDefault();return}if(t.key==="Delete"&&cd(f,m,"end")){t.preventDefault();return}}},document.addEventListener("keydown",cr,!0)),fr||(fr=t=>{const n=t.target;if(!n||n.closest(`.${O}`))return;const r=n.closest(st);if(!r){ae&&An(ae);return}if(Ot(r))return;ae=r,be.has(r)||be.set(r,e);const o=n.closest(mn);if(!o){An(r);return}requestAnimationFrame(()=>{!r.isConnected||!r.contains(o)||Ei(r,o)})},document.addEventListener("mousedown",fr,!0)),ur||(ur=t=>{const n=t.target;if(!n||n.closest(`.${O}`))return;const r=n.closest(st);if(!r){ae&&An(ae);return}if(Ot(r))return;ae=r,be.has(r)||be.set(r,e);const o=be.get(r)||e,a=n.closest(mn),i=!!n.closest(".rte-conditional-header, .rte-conditional-summary, .rte-conditional-meta, .rte-conditional-else-label");if(a&&i){t.preventDefault(),t.stopPropagation(),Je(r,o,"edit",void 0,a),Ei(r,a);return}a?Ei(r,a):An(r)},document.addEventListener("click",ur,!0)),pr||(pr=()=>{const t=wt(void 0,!1)||ae;t&&t.isConnected&&ln(t)},document.addEventListener("selectionchange",pr)),mr||(mr=t=>{const n=t.target,r=n==null?void 0:n.closest(st);if(!r)return;const o=be.get(r)||gr||e;Yr(r,o.labels),ln(r)},document.addEventListener("input",mr,!0)),an||(an=()=>{Ty()},window.addEventListener("scroll",an,!0),window.addEventListener("resize",an))}function My(){dr&&(document.removeEventListener("focusin",dr,!0),dr=null),cr&&(document.removeEventListener("keydown",cr,!0),cr=null),ur&&(document.removeEventListener("click",ur,!0),ur=null),fr&&(document.removeEventListener("mousedown",fr,!0),fr=null),pr&&(document.removeEventListener("selectionchange",pr),pr=null),mr&&(document.removeEventListener("input",mr,!0),mr=null),an&&(window.removeEventListener("scroll",an,!0),window.removeEventListener("resize",an),an=null),Hn.forEach(e=>{e.remove()}),Hn.clear(),On.clear(),gr=null,ae=null}const Ry=(e={})=>{const t=gy(e);return my(),{name:"conditionalContent",toolbar:[{id:"conditionalContentGroup",label:"Conditional Content",type:"group",command:"conditionalContent",items:[{id:"conditionalContent",label:"Conditional Rule",command:"openConditionalDialog",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M6 5h12a1 1 0 0 1 1 1v3h-2V7H7v3H5V6a1 1 0 0 1 1-1Zm-1 9h2v3h10v-3h2v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4Zm3-2a1 1 0 0 1 1-1h2.6l1.8-2.4a1 1 0 1 1 1.6 1.2L13.8 11H15a1 1 0 1 1 0 2h-2.7l-1.9 2.5a1 1 0 1 1-1.6-1.2L10.1 13H9a1 1 0 0 1-1-1Z" fill="currentColor"></path></svg>',shortcut:"Mod-Alt-Shift-c"},{id:"conditionalPreview",label:"Conditional Preview",command:"toggleConditionalPreview",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4 6h16a1 1 0 0 1 1 1v3h-2V8H5v8h14v-2h2v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm5 3h2v2H9V9Zm0 4h2v2H9v-2Zm4-4h6v2h-6V9Zm0 4h6v2h-6v-2Z" fill="currentColor"></path></svg>',shortcut:"Mod-Alt-Shift-p"}]}],commands:{conditionalContent:(n,r)=>{const o=wt(r);if(!o||Ot(o))return!1;ae=o,be.set(o,t),Yr(o,t.labels);const a=n==null?void 0:n.target;if(a==="insert")return Je(o,t,"insert",n),!0;const i=Qn(o);return a==="edit"||i?!i&&a==="edit"?!1:(Je(o,t,"edit",n,i||void 0),!0):(Je(o,t,"insert",n),!0)},openConditionalDialog:(n,r)=>{const o=wt(r);if(!o||Ot(o))return!1;ae=o,be.set(o,t),Yr(o,t.labels);const a=n==null?void 0:n.target;if(a==="insert")return Je(o,t,"insert",n),!0;const i=Qn(o);return a==="edit"||i?!i&&a==="edit"?!1:(Je(o,t,"edit",n,i||void 0),!0):(Je(o,t,"insert",n),!0)},conditionalPreview:async(n,r)=>{const o=wt(r);if(!o)return!1;ae=o,be.set(o,t);const a=typeof n=="boolean"?n:Mt.get(o)!==!0;return await er(o,t,a),ln(o),!0},editConditionalBlock:(n,r)=>{const o=wt(r);if(!o||Ot(o))return!1;ae=o,be.set(o,t);const a=Qn(o);return a?(Je(o,t,"edit",n,a),!0):!1},deleteConditionalBlock:(n,r)=>{const o=wt(r);if(!o||Ot(o))return!1;const a=Qn(o);if(!a)return!1;const i=Vp(o,a);return i&&ln(o),i},insertConditionalBlock:(n,r)=>{const o=wt(r);if(!o||Ot(o))return!1;ae=o,be.set(o,t);const a={condition:(n==null?void 0:n.condition)??t.defaultCondition,audience:(n==null?void 0:n.audience)??t.defaultAudience,locale:(n==null?void 0:n.locale)??t.defaultLocale,hasElse:(n==null?void 0:n.hasElse)??t.enableElseByDefault},i=qp(a,t.labels);return _p(o,i),Mt.get(o)===!0&&er(o,t,!0),!0},toggleConditionalPreview:async(n,r)=>{const o=wt(r);if(!o)return!1;ae=o,be.set(o,t);const a=typeof n=="boolean"?n:Mt.get(o)!==!0;return await er(o,t,a),!0},setConditionalContext:(n,r)=>{const o=wt(r);return o?(ae=o,!n||typeof n!="object"?ys.delete(o):ys.set(o,n),Mt.get(o)===!0&&er(o,t,!0),!0):!1}},keymap:{"Mod-Alt-Shift-c":"openConditionalDialog","Mod-Alt-Shift-C":"openConditionalDialog","Mod-Alt-Shift-p":"toggleConditionalPreview","Mod-Alt-Shift-P":"toggleConditionalPreview",F9:"openConditionalDialog",F10:"toggleConditionalPreview"},init:()=>{Ua+=1,Ay(t)},destroy:()=>{Ua=Math.max(0,Ua-1),Ua===0&&(zp(),My())}}},on=".rte-content, .editora-content",br='.rte-data-binding[data-binding="true"]',dd="rte-data-binding-styles",xe="rte-data-binding-dialog-overlay",me=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',Dy={dialogTitleInsert:"Insert Data Binding",dialogTitleEdit:"Edit Data Binding",keyLabel:"Data Key",keyPlaceholder:"user.firstName",fallbackLabel:"Fallback Text",fallbackPlaceholder:"Guest",formatLabel:"Format",currencyLabel:"Currency",currencyPlaceholder:"USD",saveText:"Save",cancelText:"Cancel",previewOnText:"Preview On",previewOffText:"Preview Off",tokenAriaPrefix:"Data binding token"},ct=new WeakMap,xs=new WeakMap,ge=new WeakMap,Uo=new WeakMap,Jl=new WeakMap;let Go=null,Ne=null,Xa=0,hr=null,yr=null,xr=null,Ci=null;function Ny(e){return{...Dy,...e||{}}}function ud(e={}){const t=(e.locale||(typeof navigator<"u"?navigator.language:"en-US")).trim()||"en-US";return{data:e.data,getData:e.getData,api:e.api,cacheTtlMs:Math.max(0,Number(e.cacheTtlMs??3e4)),labels:Ny(e.labels),defaultFormat:e.defaultFormat||"text",defaultFallback:e.defaultFallback||"",locale:t,numberFormatOptions:e.numberFormatOptions||{},dateFormatOptions:e.dateFormatOptions||{year:"numeric",month:"short",day:"2-digit"}}}function De(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Wp(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function Ra(e){return e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||e}function Ja(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function By(e){const t=Ra(e);if(Ja(t))return!0;const n=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return Ja(n)?!0:Ja(document.documentElement)||Ja(document.body)}function tn(e,t=!0){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const o=e.editorElement;if(o.matches(on))return o;const a=o.querySelector(on);if(a instanceof HTMLElement)return a}const n=window.getSelection();if(n&&n.rangeCount>0){const o=n.getRangeAt(0).startContainer,a=Wp(o),i=a==null?void 0:a.closest(on);if(i)return i}const r=document.activeElement;if(r){if(r.matches(on))return r;const o=r.closest(on);if(o)return o}return Ne&&Ne.isConnected?Ne:t?document.querySelector(on):null}function Zo(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function Kp(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const n=t.getRangeAt(0);return e.contains(n.commonAncestorContainer)?n.cloneRange():null}function Up(e,t){const n=window.getSelection();n&&(n.removeAllRanges(),n.addRange(t),e.focus({preventScroll:!0}))}function Py(e,t){const n=(t||"").trim();if(n)return n.split(".").filter(Boolean).reduce((r,o)=>{if(!(r==null||typeof r!="object"))return r[o]},e)}function Iy(){if(typeof document>"u"||document.getElementById(dd))return;const e=document.createElement("style");e.id=dd,e.textContent=`
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

    ${me} .rte-data-binding,
    .${xe}.rte-data-binding-theme-dark .rte-data-binding {
      background: linear-gradient(180deg, #3b0764 0%, #2e1065 100%);
      border-color: #a78bfa;
      color: #ede9fe;
    }

    ${me} .rte-data-binding::before,
    .${xe}.rte-data-binding-theme-dark .rte-data-binding::before {
      background: rgba(167, 139, 250, 0.22);
      color: #ddd6fe;
    }

    ${me} .rte-data-binding.rte-data-binding-preview,
    .${xe}.rte-data-binding-theme-dark .rte-data-binding.rte-data-binding-preview {
      background: #064e3b;
      border-color: #10b981;
      color: #d1fae5;
    }

    ${me} .rte-data-binding.rte-data-binding-missing,
    .${xe}.rte-data-binding-theme-dark .rte-data-binding.rte-data-binding-missing {
      background: #7f1d1d;
      border-color: #ef4444;
      color: #fee2e2;
    }

    ${me} .rte-toolbar-group-items.data-binding,
    ${me} .editora-toolbar-group-items.data-binding {
      display: flex;
      border: 1px solid #566275;
      border-radius: 6px;
      overflow: hidden;
    }

    ${me} .rte-toolbar-group-items.data-binding .rte-toolbar-button,
    ${me} .editora-toolbar-group-items.data-binding .editora-toolbar-button {
      border-right-color: #566275;
    }

    ${me} .rte-data-binding-dialog,
    .${xe}.rte-data-binding-theme-dark .rte-data-binding-dialog {
      background: #1f2937;
      border-color: #334155;
    }

    ${me} .rte-data-binding-header,
    ${me} .rte-data-binding-footer,
    .${xe}.rte-data-binding-theme-dark .rte-data-binding-header,
    .${xe}.rte-data-binding-theme-dark .rte-data-binding-footer {
      background: #111827;
      border-color: #334155;
    }

    ${me} .rte-data-binding-title,
    ${me} .rte-data-binding-field label,
    .${xe}.rte-data-binding-theme-dark .rte-data-binding-title,
    .${xe}.rte-data-binding-theme-dark .rte-data-binding-field label {
      color: #e2e8f0;
    }

    ${me} .rte-data-binding-help,
    .${xe}.rte-data-binding-theme-dark .rte-data-binding-help {
      color: #94a3b8;
    }

    ${me} .rte-data-binding-field input,
    ${me} .rte-data-binding-field select,
    ${me} .rte-data-binding-btn,
    .${xe}.rte-data-binding-theme-dark .rte-data-binding-field input,
    .${xe}.rte-data-binding-theme-dark .rte-data-binding-field select,
    .${xe}.rte-data-binding-theme-dark .rte-data-binding-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    ${me} .rte-data-binding-btn-primary,
    .${xe}.rte-data-binding-theme-dark .rte-data-binding-btn-primary {
      background: #2563eb;
      border-color: #2563eb;
      color: #ffffff;
    }
  `,document.head.appendChild(e)}function vs(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function ks(e,t){if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}}function sa(e,t){return{key:String(e.key||"").trim(),fallback:String(e.fallback??t.defaultFallback??""),format:e.format||t.defaultFormat||"text",currency:String(e.currency||"USD").trim().toUpperCase()||"USD"}}function Gp(e){return`{{${e.key}}}`}function Zp(e,t){const n=document.createElement("span");return n.className="rte-data-binding",n.setAttribute("data-binding","true"),n.setAttribute("data-binding-key",e.key),n.setAttribute("data-binding-fallback",e.fallback||""),n.setAttribute("data-binding-format",e.format||"text"),n.setAttribute("data-binding-currency",e.currency||"USD"),n.setAttribute("contenteditable","false"),n.setAttribute("spellcheck","false"),n.setAttribute("draggable","false"),n.setAttribute("tabindex","0"),n.setAttribute("role","button"),n.setAttribute("aria-label",`${t.tokenAriaPrefix}: ${e.key}. Press Enter to edit.`),n.textContent=Gp(e),n}function Sl(e,t){return sa({key:e.getAttribute("data-binding-key")||"",fallback:e.getAttribute("data-binding-fallback")||t.defaultFallback,format:e.getAttribute("data-binding-format")||t.defaultFormat,currency:e.getAttribute("data-binding-currency")||"USD"},t)}function rc(e,t,n){e.classList.add("rte-data-binding"),e.setAttribute("data-binding","true"),e.setAttribute("data-binding-key",t.key),e.setAttribute("data-binding-fallback",t.fallback||""),e.setAttribute("data-binding-format",t.format||"text"),e.setAttribute("data-binding-currency",t.currency||"USD"),e.setAttribute("contenteditable","false"),e.setAttribute("spellcheck","false"),e.setAttribute("draggable","false"),e.setAttribute("tabindex","0"),e.setAttribute("role","button"),e.setAttribute("aria-label",`${n.tokenAriaPrefix}: ${t.key}. Press Enter to edit.`)}function Gi(e,t){const n=Array.from(e.querySelectorAll(br));return n.forEach(r=>{const o=Sl(r,t);rc(r,o,t.labels)}),n}function ws(e){const t=window.getSelection();if(t&&t.rangeCount>0){const o=t.getRangeAt(0).startContainer,a=Wp(o),i=a==null?void 0:a.closest(br);if(i&&e.contains(i))return i}const n=document.activeElement,r=n==null?void 0:n.closest(br);return r&&e.contains(r)?r:null}function Yp(){Go&&(Go.cleanup(),Go=null)}function oc(e,t,n){const r=Ra(e);Array.from(r.querySelectorAll('[data-command="toggleDataBindingPreview"]')).forEach(a=>{if(a.setAttribute("data-active",t?"true":"false"),a.classList.toggle("active",t),a.setAttribute("aria-pressed",t?"true":"false"),n){const i=t?n.labels.previewOnText:n.labels.previewOffText;a.setAttribute("title",i),a.setAttribute("aria-label",i)}})}function Hy(e,t,n){const r=t.format||"text";if(e==null)return t.fallback||"";if(r==="json"){if(typeof e=="string")return e;try{return JSON.stringify(e)}catch{return String(e)}}if(r==="date"){const o=e instanceof Date?e:new Date(String(e));if(Number.isNaN(o.getTime()))return String(e);try{return new Intl.DateTimeFormat(n.locale,n.dateFormatOptions).format(o)}catch{return o.toISOString()}}if(r==="number"||r==="currency"){const o=typeof e=="number"?e:Number(e);if(!Number.isFinite(o))return String(e);const a={...n.numberFormatOptions};if(r==="currency"){const i=(t.currency||"USD").toUpperCase();Object.assign(a,{style:"currency",currency:i})}try{return new Intl.NumberFormat(n.locale,a).format(o)}catch{return String(o)}}return String(e)}function zn(e,t,n,r){const o=Sl(e,t),a=o.key;if(e.classList.remove("rte-data-binding-preview","rte-data-binding-missing"),!n){e.textContent=Gp(o),e.setAttribute("aria-label",`${t.labels.tokenAriaPrefix}: ${a}. Press Enter to edit.`);return}const i=Py(r,a),l=i==null,s=l?o.fallback||"":Hy(i,o,t);e.textContent=s||o.fallback||"",e.classList.add("rte-data-binding-preview"),l&&!(o.fallback||"").trim()&&e.classList.add("rte-data-binding-missing"),e.setAttribute("aria-label",`${t.labels.tokenAriaPrefix}: ${a} = ${e.textContent||""}. Press Enter to edit.`)}function jt(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Oy(e,t){return t?t.split(".").filter(Boolean).reduce((n,r)=>{if(!(!jt(n)&&!Array.isArray(n)))return n[r]},e):e}function zy(e,t,n){const r=t.api,o=Ra(e),a={editor:e,editorRoot:o,signal:n};if(r.buildRequest){const u=r.buildRequest(a);return{url:u.url,init:{...u.init||{},signal:n}}}const i=(r.method||"GET").toUpperCase(),l=typeof r.headers=="function"?r.headers(a):r.headers||{},s=typeof r.params=="function"?r.params(a):r.params,c=new URL(r.url,window.location.origin);s&&Object.entries(s).forEach(([u,f])=>{f!=null&&c.searchParams.set(u,String(f))});const d={method:i,headers:{...l},credentials:r.credentials,mode:r.mode,cache:r.cache,signal:n};if(i!=="GET"&&i!=="HEAD"){const u=typeof r.body=="function"?r.body(a):r.body;if(u!=null)if(jt(u)){d.body=JSON.stringify(u);const f=d.headers;!f["Content-Type"]&&!f["content-type"]&&(f["Content-Type"]="application/json")}else d.body=u}return{url:c.toString(),init:d}}async function qy(e,t){var s;const n=t.api;if(!n)return{};const r=new AbortController,o=Ra(e),a={editor:e,editorRoot:o,signal:r.signal},i=Math.max(0,Number(n.timeoutMs??1e4));let l=null;i>0&&(l=window.setTimeout(()=>r.abort(),i));try{const{url:c,init:d}=zy(e,t,r.signal),u=await fetch(c,{...d,signal:r.signal});if(!u.ok)throw new Error(`Data binding API request failed: ${u.status}`);const m=(n.responseType||"json")==="text"?await u.text():await u.json();if(n.transformResponse){const p=n.transformResponse(m,a);return jt(p)?p:{}}const g=Oy(m,n.responsePath);return jt(g)?g:jt(m)?m:{value:g}}catch(c){return(c==null?void 0:c.name)!=="AbortError"&&((s=n.onError)==null||s.call(n,c,a)),{}}finally{l!==null&&window.clearTimeout(l)}}async function ca(e,t){const n=xs.get(e);if(n)return n;const r=Uo.get(e),o=Date.now();if(r&&o-r.timestamp<=t.cacheTtlMs)return r.data;const a=Jl.get(e);if(a)return a;const i=(async()=>{try{if(typeof t.getData=="function"){const s=await Promise.resolve(t.getData({editor:e,editorRoot:Ra(e)}));if(jt(s))return s}if(t.api){const s=await qy(e,t);if(jt(s))return s}if(typeof t.data=="function"){const s=await Promise.resolve(t.data());if(jt(s))return s}return jt(t.data)?t.data:{}}finally{Jl.delete(e)}})();Jl.set(e,i);const l=await i;return Uo.set(e,{timestamp:o,data:l}),l}async function Si(e,t,n){const r=Gi(e,t);if(ct.set(e,n),oc(e,n,t),!n){r.forEach(a=>zn(a,t,!1));return}const o=await ca(e,t);r.forEach(a=>zn(a,t,!0,o))}function Xp(e,t){let n=Kp(e);n||(n=document.createRange(),n.selectNodeContents(e),n.collapse(!1)),n.collapsed||n.deleteContents(),n.insertNode(t);const r=document.createTextNode(" ");t.after(r);const o=document.createRange();o.setStart(r,1),o.collapse(!0),Up(e,o),e.normalize()}function _y(e){const t=e.metaKey||e.ctrlKey,n=e.key.toLowerCase(),r=t&&e.altKey&&e.shiftKey&&n==="d",o=!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&n==="f7";return r||o}function Fy(e){const t=e.metaKey||e.ctrlKey,n=e.key.toLowerCase(),r=t&&e.altKey&&e.shiftKey&&n==="b",o=!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&n==="f8";return r||o}function Mn(e,t,n,r,o){Yp();const a=n==="insert"?Kp(e):null,i=t.labels,l=o?Sl(o,t):sa(r||{},t),s=document.createElement("div");s.className=xe,By(e)&&s.classList.add("rte-data-binding-theme-dark");const c=document.createElement("section");c.className="rte-data-binding-dialog",c.setAttribute("role","dialog"),c.setAttribute("aria-modal","true"),c.setAttribute("aria-labelledby","rte-data-binding-dialog-title"),c.innerHTML=`
    <header class="rte-data-binding-header">
      <h2 id="rte-data-binding-dialog-title" class="rte-data-binding-title">${De(n==="edit"?i.dialogTitleEdit:i.dialogTitleInsert)}</h2>
      <button type="button" class="rte-data-binding-btn" data-action="cancel" aria-label="${De(i.cancelText)}">✕</button>
    </header>
    <div class="rte-data-binding-body">
      <div class="rte-data-binding-field">
        <label for="rte-data-binding-key">${De(i.keyLabel)}</label>
        <input id="rte-data-binding-key" class="rte-data-binding-key" type="text" value="${De(l.key)}" placeholder="${De(i.keyPlaceholder)}" />
      </div>
      <div class="rte-data-binding-field">
        <label for="rte-data-binding-fallback">${De(i.fallbackLabel)}</label>
        <input id="rte-data-binding-fallback" class="rte-data-binding-fallback" type="text" value="${De(l.fallback||"")}" placeholder="${De(i.fallbackPlaceholder)}" />
      </div>
      <div class="rte-data-binding-field">
        <label for="rte-data-binding-format">${De(i.formatLabel)}</label>
        <select id="rte-data-binding-format" class="rte-data-binding-format">
          <option value="text" ${l.format==="text"?"selected":""}>Text</option>
          <option value="number" ${l.format==="number"?"selected":""}>Number</option>
          <option value="currency" ${l.format==="currency"?"selected":""}>Currency</option>
          <option value="date" ${l.format==="date"?"selected":""}>Date</option>
          <option value="json" ${l.format==="json"?"selected":""}>JSON</option>
        </select>
      </div>
      <div class="rte-data-binding-field">
        <label for="rte-data-binding-currency">${De(i.currencyLabel)}</label>
        <input id="rte-data-binding-currency" class="rte-data-binding-currency" type="text" maxlength="3" value="${De(l.currency||"USD")}" placeholder="${De(i.currencyPlaceholder)}" />
      </div>
      <p class="rte-data-binding-help">Use dot paths like <code>user.name</code> or <code>order.total</code>.</p>
    </div>
    <footer class="rte-data-binding-footer">
      <button type="button" class="rte-data-binding-btn" data-action="cancel">${De(i.cancelText)}</button>
      <button type="button" class="rte-data-binding-btn rte-data-binding-btn-primary" data-action="save">${De(i.saveText)}</button>
    </footer>
  `,s.appendChild(c),document.body.appendChild(s);const d=c.querySelector(".rte-data-binding-key"),u=c.querySelector(".rte-data-binding-fallback"),f=c.querySelector(".rte-data-binding-format"),m=c.querySelector(".rte-data-binding-currency"),g=()=>{const T=(f==null?void 0:f.value)==="currency",L=m==null?void 0:m.closest(".rte-data-binding-field");L&&(L.style.display=T?"grid":"none")};g(),f==null||f.addEventListener("change",g);const p=()=>{s.removeEventListener("click",h),s.removeEventListener("keydown",k,!0),document.removeEventListener("keydown",b,!0),s.parentNode&&s.parentNode.removeChild(s),Go=null,e.focus({preventScroll:!0})},b=T=>{T.key==="Escape"&&(T.preventDefault(),T.stopPropagation(),p())},h=T=>{T.target===s&&p()},x=T=>{if(T.key!=="Tab")return;const L=Array.from(c.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));if(L.length===0)return;const w=L[0],v=L[L.length-1],E=document.activeElement;if(T.shiftKey&&E===w){T.preventDefault(),v.focus();return}!T.shiftKey&&E===v&&(T.preventDefault(),w.focus())},C=async()=>{const T=((d==null?void 0:d.value)||"").trim();if(!T){d==null||d.focus();return}const L=sa({key:T,fallback:((u==null?void 0:u.value)||"").trim(),format:(f==null?void 0:f.value)||t.defaultFormat,currency:((m==null?void 0:m.value)||"USD").trim().toUpperCase()},t),w=e.innerHTML;if(o){rc(o,L,i);const v=ct.get(e)===!0,E=v?await ca(e,t):void 0;zn(o,t,v,E)}else{if(a)try{Up(e,a)}catch{}const v=Zp(L,i);if(Xp(e,v),ct.get(e)===!0){const H=await ca(e,t);zn(v,t,!0,H)}}vs(e),ks(e,w),p()},k=T=>{if(T.key==="Escape"){T.preventDefault(),p();return}x(T),T.key==="Enter"&&!T.shiftKey&&T.target instanceof HTMLInputElement&&(T.preventDefault(),C())};c.addEventListener("click",T=>{const L=T.target,w=L==null?void 0:L.getAttribute("data-action");if(w){if(w==="cancel"){p();return}w==="save"&&C()}}),s.addEventListener("click",h),s.addEventListener("keydown",k,!0),document.addEventListener("keydown",b,!0),Go={cleanup:p},d==null||d.focus()}function jy(e){Ci=e,yr||(yr=t=>{const n=t.target,r=n==null?void 0:n.closest(on);if(!r)return;Ne=r,ge.has(r)||ge.set(r,e);const o=ge.get(r)||e;Gi(r,o);const a=ct.get(r)===!0;oc(r,a,o),a||Array.from(r.querySelectorAll(br)).forEach(l=>zn(l,o,!1))},document.addEventListener("focusin",yr,!0)),hr||(hr=t=>{if(document.querySelector(`.${xe}`))return;const n=t.target;if(n!=null&&n.closest("input, textarea, select"))return;const r=tn(void 0,!1);if(!r||Zo(r))return;const o=ge.get(r)||Ci||e,a=n==null?void 0:n.closest(br);if(a&&(t.key==="Enter"||t.key===" ")){t.preventDefault(),t.stopPropagation(),Ne=r,Mn(r,o,"edit",void 0,a);return}if(_y(t)){t.preventDefault(),t.stopPropagation();const i=ws(r);i?Mn(r,o,"edit",void 0,i):Mn(r,o,"insert");return}if(Fy(t)){t.preventDefault(),t.stopPropagation();const i=ct.get(r)!==!0;Si(r,o,i)}},document.addEventListener("keydown",hr,!0)),xr||(xr=t=>{if(document.querySelector(`.${xe}`)||t.defaultPrevented||t.button!==0||t.metaKey||t.ctrlKey||t.altKey||t.shiftKey)return;const n=t.target,r=n==null?void 0:n.closest(br);if(!r)return;const o=r.closest(on);if(!o||Zo(o))return;const a=ge.get(o)||Ci||e;ge.set(o,a),Ne=o,t.preventDefault(),t.stopPropagation(),r.focus({preventScroll:!0}),Mn(o,a,"edit",void 0,r)},document.addEventListener("click",xr,!0))}function Vy(){yr&&(document.removeEventListener("focusin",yr,!0),yr=null),hr&&(document.removeEventListener("keydown",hr,!0),hr=null),xr&&(document.removeEventListener("click",xr,!0),xr=null),Ci=null,Ne=null}const Wy=(e={})=>{const t=ud(e);return Iy(),{name:"dataBinding",toolbar:[{id:"dataBindingTools",label:"Data Binding",type:"group",command:"openDataBindingDialog",items:[{id:"dataBinding",label:"Data Binding",command:"openDataBindingDialog",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M7 4a3 3 0 0 0-3 3v3h2V7a1 1 0 0 1 1-1h3V4H7Zm10 0h-3v2h3a1 1 0 0 1 1 1v3h2V7a3 3 0 0 0-3-3ZM4 14v3a3 3 0 0 0 3 3h3v-2H7a1 1 0 0 1-1-1v-3H4Zm14 0v3a1 1 0 0 1-1 1h-3v2h3a3 3 0 0 0 3-3v-3h-2ZM8.5 12a1.5 1.5 0 1 1 0-3h7a1.5 1.5 0 0 1 0 3h-7Zm0 4a1.5 1.5 0 1 1 0-3h4a1.5 1.5 0 0 1 0 3h-4Z" fill="currentColor"></path></svg>'},{id:"dataBindingPreview",label:"Data Preview",command:"toggleDataBindingPreview",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M12 3c-4.4 0-8 1.3-8 3v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6c0-1.7-3.6-3-8-3Zm0 2c3.9 0 6 .9 6 1s-2.1 1-6 1-6-.9-6-1 2.1-1 6-1Zm0 4c3 0 5.6-.5 7-1.3V11c0 .9-2.7 2-7 2s-7-1.1-7-2V7.7C6.4 8.5 9 9 12 9Zm0 6c-4.3 0-7-1.1-7-2v3c0 .9 2.7 2 7 2s7-1.1 7-2v-3c0 .9-2.7 2-7 2Z" fill="currentColor"></path><path d="M16.5 9.4a1 1 0 0 1 1.4 0l1.1 1.1 1.8-1.8a1 1 0 1 1 1.4 1.4l-2.5 2.5a1 1 0 0 1-1.4 0l-1.8-1.8a1 1 0 0 1 0-1.4Z" fill="currentColor"></path></svg>'}]}],commands:{openDataBindingDialog:(n,r)=>{const o=tn(r);if(!o||Zo(o))return!1;Ne=o;const a=ge.get(o)||t;ge.set(o,a),Gi(o,a);const i=n==null?void 0:n.target;if(i==="insert")return Mn(o,a,"insert",n),!0;const l=ws(o);return i==="edit"||l?!l&&i==="edit"?!1:(Mn(o,a,"edit",n,l||void 0),!0):(Mn(o,a,"insert",n),!0)},insertDataBindingToken:async(n,r)=>{const o=tn(r);if(!o||Zo(o))return!1;Ne=o;const a=ge.get(o)||t;ge.set(o,a);const i=sa(n||{},a);if(!i.key)return!1;const l=o.innerHTML,s=Zp(i,a.labels);if(Xp(o,s),ct.get(o)===!0){const d=await ca(o,a);zn(s,a,!0,d)}return vs(o),ks(o,l),!0},editDataBindingToken:async(n,r)=>{const o=tn(r);if(!o||Zo(o))return!1;Ne=o;const a=ge.get(o)||t;ge.set(o,a);const i=ws(o);if(!i)return!1;const l=Sl(i,a),s=sa({...l,...n||{}},a);if(!s.key)return!1;const c=o.innerHTML;rc(i,s,a.labels);const d=ct.get(o)===!0,u=d?await ca(o,a):void 0;return zn(i,a,d,u),vs(o),ks(o,c),!0},toggleDataBindingPreview:async(n,r)=>{const o=tn(r);if(!o)return!1;Ne=o;const a=ge.get(o)||t;ge.set(o,a);const i=typeof n=="boolean"?n:ct.get(o)!==!0;return await Si(o,a,i),!0},setDataBindingData:async(n,r)=>{const o=tn(r);if(!o)return!1;if(Ne=o,n&&typeof n=="object"?(xs.set(o,n),Uo.set(o,{timestamp:Date.now(),data:n})):(xs.delete(o),Uo.delete(o)),ct.get(o)===!0){const a=ge.get(o)||t;await Si(o,a,!0)}return!0},refreshDataBindings:async(n,r)=>{const o=tn(r);if(!o)return!1;Ne=o,Uo.delete(o);const a=ge.get(o)||t;ge.set(o,a);const i=ct.get(o)===!0;return await Si(o,a,i),!0}},keymap:{"Mod-Alt-Shift-d":"openDataBindingDialog","Mod-Alt-Shift-D":"openDataBindingDialog","Mod-Alt-Shift-b":"toggleDataBindingPreview","Mod-Alt-Shift-B":"toggleDataBindingPreview",F7:"openDataBindingDialog",F8:"toggleDataBindingPreview"},init:function(r){Xa+=1;const o=this&&typeof this.__pluginConfig=="object"?ud({...t,...this.__pluginConfig}):t;jy(o);const a=tn(r&&r.editorElement?{editorElement:r.editorElement}:void 0,!1);if(a){Ne=a,ge.set(a,o),Gi(a,o);const i=ct.get(a)===!0;oc(a,i,o)}},destroy:()=>{Xa=Math.max(0,Xa-1),Xa===0&&(Yp(),Vy())}}},St=".rte-content, .editora-content",ac="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",fd="__editoraCommandEditorRoot",pd="rte-content-rules-styles",Y="rte-content-rules-panel",mo=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',Ky={panelTitle:"Content Rules",panelAriaLabel:"Content rules panel",runAuditText:"Run Audit",realtimeOnText:"Realtime On",realtimeOffText:"Realtime Off",closeText:"Close",noIssuesText:"No rule violations detected.",summaryPrefix:"Issues",locateText:"Locate",bannedWordMessage:"Banned word found",requiredHeadingMessage:"Missing required heading",sentenceLengthMessage:"Sentence is too long",readabilityMessage:"Readability score is below threshold"},G=new WeakMap,Wt=new WeakMap,Jp=new WeakMap,gn=new WeakMap,Zi=new WeakMap,md=new WeakMap,Ql=new WeakMap,_e=new Map,Da=new WeakMap,da=new Set;let Qa=0,Uy=0,$t=null,Ae=null,vr=null,kr=null,wr=null,sn=null;function Et(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Gy(e){return{...Ky,...e||{}}}function Zy(e){return e.replace(/\u00A0/g," ").replace(/\s+/g," ").trim()}function gd(e){if(!e)return[];const t=new Set;return e.forEach(n=>{const r=n.trim();r&&t.add(r)}),Array.from(t)}function Ti(e={}){return{bannedWords:gd(e.bannedWords),requiredHeadings:gd(e.requiredHeadings),maxSentenceWords:Math.max(8,Number(e.maxSentenceWords??32)),minReadabilityScore:Math.max(0,Math.min(120,Number(e.minReadabilityScore??55))),maxIssues:Math.max(1,Number(e.maxIssues??100)),debounceMs:Math.max(50,Number(e.debounceMs??220)),enableRealtime:e.enableRealtime!==!1,labels:Gy(e.labels),normalizeText:e.normalizeText||Zy,customRules:Array.isArray(e.customRules)?e.customRules:[]}}function Tl(e){return e.closest(ac)||e}function Yi(e){if(!e)return null;if(e.matches(St))return e;const t=e.querySelector(St);return t instanceof HTMLElement?t:null}function Yy(){if(typeof window>"u")return null;const e=window[fd];if(!(e instanceof HTMLElement))return null;window[fd]=null;const t=Yi(e);if(t)return t;const n=e.closest(ac);if(n){const r=Yi(n);if(r)return r}return null}function Xy(e){const t=e.closest("[data-editora-editor]");if(t&&Yi(t)===e)return t;let n=e;for(;n;){if(n.matches(ac)&&(n===e||Yi(n)===e))return n;n=n.parentElement}return Tl(e)}function ei(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function Jy(e){const t=Tl(e);if(ei(t))return!0;const n=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return ei(n)?!0:ei(document.documentElement)||ei(document.body)}function Xi(e,t){e.classList.remove("rte-content-rules-theme-dark"),Jy(t)&&e.classList.add("rte-content-rules-theme-dark")}function Qy(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function nn(e,t=!0){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const a=e.editorElement;if(a.matches(St))return a;const i=a.querySelector(St);if(i instanceof HTMLElement)return i}const n=Yy();if(n)return n;const r=window.getSelection();if(r&&r.rangeCount>0){const a=r.getRangeAt(0).startContainer,i=Qy(a),l=i==null?void 0:i.closest(St);if(l)return l}const o=document.activeElement;if(o){if(o.matches(St))return o;const a=o.closest(St);if(a)return a}return Ae&&Ae.isConnected?Ae:(Ae&&!Ae.isConnected&&(Ae=null),t?document.querySelector(St):null)}function Es(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function ex(e,t){const n=e.innerText||e.textContent||"";return t(n)}function tx(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function bd(e){let t=2166136261;for(let n=0;n<e.length;n+=1)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return t>>>0}function hd(e){const t=e.match(/\b[\w'-]+\b/g);return t?t.length:0}function Qp(e){const t=e.match(/[^.!?]+[.!?]*/g);return t?t.map(n=>n.trim()).filter(Boolean).length:0}function nx(e){const t=e.toLowerCase().replace(/[^a-z]/g,"");if(!t)return 0;if(t.length<=3)return 1;const n=t.match(/[aeiouy]+/g);let r=n?n.length:1;return t.endsWith("e")&&(r-=1),Math.max(1,r)}function rx(e){const t=e.match(/\b[\w'-]+\b/g)||[],n=t.length;if(n===0)return 100;const r=Math.max(1,Qp(e)),o=t.reduce((i,l)=>i+nx(l),0),a=206.835-1.015*(n/r)-84.6*(o/Math.max(1,n));return Number.isFinite(a)?Math.max(0,Math.min(120,a)):0}function Po(e,t){return`${e}-${t}`}function lt(e,t){return e.length>=t}function go(e,t,n){lt(e,n)||e.push(t)}function em(e,t=140){return e.length<=t?e:`${e.slice(0,t-1).trimEnd()}...`}function ox(e,t,n,r){return{id:e.id||Po(t,r),ruleId:e.ruleId||t,severity:e.severity||n,message:e.message||t,excerpt:e.excerpt?em(e.excerpt,220):void 0,suggestion:e.suggestion,locateText:e.locateText,selector:e.selector}}function ax(e,t){const n=Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6")),r=new Set;return n.forEach(o=>{const a=t(o.textContent||"").toLowerCase();a&&r.add(a)}),r}function ix(e){const t=e.match(/[^.!?\n]+[.!?]?/g);return t?t.map(n=>n.trim()).filter(Boolean):[]}async function Lt(e,t,n=!1){const r=ex(e,t.normalizeText),o=e.innerHTML,a=`${r.length}:${bd(r)}:${o.length}:${bd(o)}`;if(!n&&md.get(e)===a)return Wt.get(e)||[];const i=(Ql.get(e)||0)+1;Ql.set(e,i);const l=hd(r),s=Qp(r),c=rx(r),d=[],u=t.labels;if(t.bannedWords.length>0){let m=0;for(const g of t.bannedWords){const p=new RegExp(`\\b${tx(g)}\\b`,"gi");let b=p.exec(r);for(;b&&!lt(d,t.maxIssues);){const h=b[0];go(d,{id:Po("banned-word",m),ruleId:"banned-word",severity:"error",message:`${u.bannedWordMessage}: "${h}"`,locateText:h,suggestion:"Replace or remove banned terms."},t.maxIssues),m+=1,b=p.exec(r)}if(lt(d,t.maxIssues))break}}if(!lt(d,t.maxIssues)&&t.requiredHeadings.length>0){const m=ax(e,t.normalizeText);let g=0;t.requiredHeadings.forEach(p=>{if(lt(d,t.maxIssues))return;const b=t.normalizeText(p).toLowerCase();!b||m.has(b)||(go(d,{id:Po("required-heading",g),ruleId:"required-heading",severity:"warning",message:`${u.requiredHeadingMessage}: "${p}"`,suggestion:`Add a heading named "${p}".`},t.maxIssues),g+=1)})}if(!lt(d,t.maxIssues)){const m=ix(r);let g=0;for(const p of m){if(lt(d,t.maxIssues))break;const b=hd(p);b<=t.maxSentenceWords||(go(d,{id:Po("sentence-length",g),ruleId:"sentence-length",severity:"warning",message:`${u.sentenceLengthMessage} (${b}/${t.maxSentenceWords} words)`,excerpt:em(p,200),locateText:p.slice(0,64),suggestion:"Split into shorter sentences for readability."},t.maxIssues),g+=1)}}if(!lt(d,t.maxIssues)&&l>0&&c<t.minReadabilityScore&&go(d,{id:Po("readability",0),ruleId:"readability",severity:"info",message:`${u.readabilityMessage}: ${c.toFixed(1)} < ${t.minReadabilityScore}`,suggestion:"Use shorter sentences and simpler wording."},t.maxIssues),!lt(d,t.maxIssues)&&t.customRules.length>0){const m={editor:e,editorRoot:Tl(e),text:r,html:o,wordCount:l,sentenceCount:s,readabilityScore:c};for(const g of t.customRules){if(lt(d,t.maxIssues))break;try{const p=await g.evaluate(m);if(!Array.isArray(p))continue;for(let b=0;b<p.length&&!lt(d,t.maxIssues);b+=1)go(d,ox(p[b],g.id,g.severity||"warning",b),t.maxIssues)}catch{}}}if(Ql.get(e)!==i)return Wt.get(e)||[];const f={readabilityScore:c,wordCount:l,sentenceCount:s};return md.set(e,a),Wt.set(e,d),Jp.set(e,f),ic(e),e.dispatchEvent(new CustomEvent("editora:content-rules-audit",{bubbles:!0,detail:{issues:d,metrics:f}})),d}function lx(e){return e.reduce((t,n)=>(t[n.severity]+=1,t),{error:0,warning:0,info:0})}function sx(e){return e==="error"?"Error":e==="warning"?"Warning":"Info"}function Kt(e,t,n){const r=Xy(e);Array.from(r.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",n),a.setAttribute("data-active",n?"true":"false"),a.setAttribute("aria-pressed",n?"true":"false")})}function Ji(e){return Da.get(e)===!0}function Cs(e,t){if(!t.classList.contains("show"))return;const r=Tl(e).getBoundingClientRect(),o=Math.min(window.innerWidth-20,360);t.style.width=`${o}px`,t.style.maxHeight=`${Math.max(220,window.innerHeight-24)}px`;const a=Math.max(10,r.right-o),i=Math.max(10,window.innerWidth-o-10),l=Math.min(a,i),s=Math.max(10,Math.min(window.innerHeight-10-240,r.top+10));t.style.left=`${l}px`,t.style.top=`${s}px`}function yd(e,t){const n=t.trim().toLowerCase();if(!n)return!1;const r=window.getSelection();if(!r)return!1;const o=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,null);let a=o.nextNode();for(;a;){const l=a.data.toLowerCase().indexOf(n);if(l!==-1){const s=document.createRange();s.setStart(a,l),s.setEnd(a,Math.min(a.length,l+n.length)),r.removeAllRanges(),r.addRange(s);const c=a.parentElement;return c&&c.scrollIntoView({behavior:"smooth",block:"center",inline:"nearest"}),e.focus({preventScroll:!0}),!0}a=o.nextNode()}return!1}function cx(e,t){if(t.selector){const n=e.querySelector(t.selector);if(n)return n.scrollIntoView({behavior:"smooth",block:"center",inline:"nearest"}),n.focus({preventScroll:!0}),!0}return!!(t.locateText&&yd(e,t.locateText)||t.excerpt&&yd(e,t.excerpt.slice(0,64)))}function dx(e,t){return(Wt.get(e)||[]).find(r=>r.id===t)}function qn(e,t){const n=gn.get(e);return typeof n=="boolean"?n:t?t.enableRealtime:!0}function Xr(e,t,n){const r=t.querySelector('[data-action="toggle-realtime"]');if(!r)return;const o=qn(e,n);r.textContent=o?n.labels.realtimeOnText:n.labels.realtimeOffText,r.setAttribute("aria-pressed",o?"true":"false"),Kt(e,"toggleContentRulesRealtime",o)}function ic(e){const t=_e.get(e);if(!t)return;const n=G.get(e)||$t;if(!n)return;const r=Wt.get(e)||[],o=Jp.get(e)||{readabilityScore:100,wordCount:0,sentenceCount:0},a=t.querySelector(".rte-content-rules-count"),i=t.querySelector(".rte-content-rules-summary"),l=t.querySelector(".rte-content-rules-list"),s=t.querySelector(".rte-content-rules-live");if(!a||!i||!l||!s)return;const c=lx(r);if(a.textContent=String(r.length),i.textContent=`${n.labels.summaryPrefix}: ${r.length} | Error ${c.error} | Warning ${c.warning} | Info ${c.info} | Readability ${o.readabilityScore.toFixed(1)}`,s.textContent=`${r.length} issues. ${c.error} errors, ${c.warning} warnings, ${c.info} info.`,r.length===0){l.innerHTML=`<li class="rte-content-rules-empty">${Et(n.labels.noIssuesText)}</li>`;return}l.innerHTML=r.map(d=>{const u=d.excerpt?`<p class="rte-content-rules-excerpt">${Et(d.excerpt)}</p>`:"",f=d.suggestion?`<p class="rte-content-rules-suggestion">${Et(d.suggestion)}</p>`:"",m=`${n.labels.locateText}: ${d.message}`;return`
        <li class="rte-content-rules-item rte-content-rules-item-${d.severity}">
          <button
            type="button"
            class="rte-content-rules-item-btn"
            data-action="focus-issue"
            data-issue-id="${Et(d.id)}"
            data-role="issue-button"
            aria-label="${Et(m)}"
          >
            <span class="rte-content-rules-badge">${Et(sx(d.severity))}</span>
            <span class="rte-content-rules-message">${Et(d.message)}</span>
          </button>
          ${u}
          ${f}
        </li>
      `}).join("")}function Er(e,t=!1){const n=_e.get(e);n&&(n.classList.remove("show"),Da.set(e,!1),Kt(e,"toggleContentRulesPanel",!1),t&&e.focus({preventScroll:!0}))}function ux(e){_e.forEach((t,n)=>{n!==e&&Er(n,!1)})}function fx(e){const t=_e.get(e);if(t)return t;const n=G.get(e)||$t||Ti(),r=`rte-content-rules-panel-${Uy++}`,o=document.createElement("section");return o.className=Y,o.id=r,o.setAttribute("role","dialog"),o.setAttribute("aria-modal","false"),o.setAttribute("aria-label",n.labels.panelAriaLabel),o.innerHTML=`
    <header class="rte-content-rules-header">
      <h2 class="rte-content-rules-title">${Et(n.labels.panelTitle)}</h2>
      <button type="button" class="rte-content-rules-icon-btn" data-action="close" aria-label="${Et(n.labels.closeText)}">✕</button>
    </header>
    <div class="rte-content-rules-body">
      <div class="rte-content-rules-topline">
        <p class="rte-content-rules-summary" aria-live="polite"></p>
        <span class="rte-content-rules-count" aria-hidden="true">0</span>
      </div>
      <div class="rte-content-rules-controls" role="toolbar" aria-label="Content rules controls">
        <button type="button" class="rte-content-rules-btn rte-content-rules-btn-primary" data-action="run-audit">${Et(n.labels.runAuditText)}</button>
        <button type="button" class="rte-content-rules-btn" data-action="toggle-realtime" aria-pressed="false"></button>
      </div>
      <ul class="rte-content-rules-list" role="list" aria-label="Detected content rule issues"></ul>
      <p class="rte-content-rules-shortcut">Shortcut: Ctrl/Cmd + Alt + Shift + R</p>
      <span class="rte-content-rules-live" aria-live="polite"></span>
    </div>
  `,o.addEventListener("click",a=>{const i=a.target,l=i==null?void 0:i.closest("[data-action]");if(!l)return;const s=l.getAttribute("data-action");if(s){if(s==="close"){Er(e,!0);return}if(s==="run-audit"){const c=G.get(e)||$t||n;Lt(e,c,!0);return}if(s==="toggle-realtime"){const d=!qn(e,G.get(e)||$t||n);if(gn.set(e,d),Xr(e,o,G.get(e)||$t||n),d){const u=G.get(e)||$t||n;Lt(e,u,!0)}return}if(s==="focus-issue"){const c=l.getAttribute("data-issue-id")||"",d=dx(e,c);if(!d)return;cx(e,d),Er(e,!1)}}}),o.addEventListener("keydown",a=>{if(a.key==="Escape"){a.preventDefault(),Er(e,!0);return}if(a.key!=="ArrowDown"&&a.key!=="ArrowUp")return;const i=Array.from(o.querySelectorAll('[data-role="issue-button"]'));if(i.length===0)return;const l=document.activeElement,s=i.findIndex(u=>u===l);if(s===-1)return;a.preventDefault();const c=a.key==="ArrowDown"?1:-1,d=(s+c+i.length)%i.length;i[d].focus()}),Xi(o,e),document.body.appendChild(o),_e.set(e,o),Da.set(e,!1),Xr(e,o,n),o}function lc(e){const t=fx(e);ux(e),t.classList.add("show"),Da.set(e,!0),Xi(t,e),Cs(e,t),ic(e),Kt(e,"toggleContentRulesPanel",!0);const n=t.querySelector('[data-action="run-audit"]');n==null||n.focus()}function Ss(e,t){const n=Ji(e);return(typeof t=="boolean"?t:!n)?lc(e):Er(e,!1),!0}function tm(e){const t=Zi.get(e);typeof t=="number"&&(window.clearTimeout(t),da.delete(t),Zi.delete(e))}function nm(e){const t=G.get(e)||$t;if(!t||!qn(e,t))return;tm(e);const n=window.setTimeout(()=>{da.delete(n),Zi.delete(e),Lt(e,t,!1)},t.debounceMs);da.add(n),Zi.set(e,n)}function px(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="r"}function mx(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="l"}function gx(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="t"}function bx(){if(typeof document>"u"||document.getElementById(pd))return;const e=document.createElement("style");e.id=pd,e.textContent=`
    .rte-toolbar-group-items.content-rules,
    .editora-toolbar-group-items.content-rules {
      display: flex;
      border: 1px solid #ccc;
      border-radius: 3px;
      background: #fff;
    }

    .rte-toolbar-group-items.content-rules .rte-toolbar-button,
    .editora-toolbar-group-items.content-rules .editora-toolbar-button {
      border: none;
      border-radius: 0px; 
    }

    .rte-toolbar-group-items.content-rules .rte-toolbar-button,
    .editora-toolbar-group-items.content-rules .editora-toolbar-button {
      border-right: 1px solid #ccc;
    }
    .rte-toolbar-group-items.content-rules .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.content-rules .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }
    .rte-toolbar-button[data-command="toggleContentRulesRealtime"].active,
    .editora-toolbar-button[data-command="toggleContentRulesRealtime"].active {
      background-color: #ccc;
    }

    ${mo} .rte-toolbar-group-items.content-rules,
    ${mo} .editora-toolbar-group-items.content-rules {
      border-color: #566275;
    }    
    ${mo} .rte-toolbar-group-items.content-rules .rte-toolbar-button,
    ${mo} .editora-toolbar-group-items.content-rules .editora-toolbar-button
    {
      border-color: #566275;
    }
    ${mo} .rte-toolbar-group-items.content-rules .rte-toolbar-button svg{
      fill: none;
    }
    .${Y} {
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

    .${Y}.show {
      display: flex;
      flex-direction: column;
    }

    .${Y}.rte-content-rules-theme-dark {
      border-color: #334155;
      background: #0f172a;
      color: #e2e8f0;
      box-shadow: 0 20px 46px rgba(2, 6, 23, 0.68);
    }

    .rte-content-rules-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
    }

    .${Y}.rte-content-rules-theme-dark .rte-content-rules-header {
      border-color: #1e293b;
      background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
    }

    .rte-content-rules-title {
      margin: 0;
      font-size: 15px;
      line-height: 1.2;
      font-weight: 700;
    }

    .rte-content-rules-icon-btn {
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

    .rte-content-rules-icon-btn:hover,
    .rte-content-rules-icon-btn:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .${Y}.rte-content-rules-theme-dark .rte-content-rules-icon-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    .${Y}.rte-content-rules-theme-dark .rte-content-rules-icon-btn:hover,
    .${Y}.rte-content-rules-theme-dark .rte-content-rules-icon-btn:focus-visible {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.24);
    }

    .rte-content-rules-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      overflow: auto;
    }

    .rte-content-rules-topline {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .rte-content-rules-summary {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #475569;
      flex: 1;
    }

    .${Y}.rte-content-rules-theme-dark .rte-content-rules-summary {
      color: #94a3b8;
    }

    .rte-content-rules-count {
      min-width: 32px;
      height: 32px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
    }

    .${Y}.rte-content-rules-theme-dark .rte-content-rules-count {
      border-color: #334155;
      background: #111827;
      color: #cbd5e1;
    }

    .rte-content-rules-controls {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .rte-content-rules-btn {
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

    .rte-content-rules-btn:hover,
    .rte-content-rules-btn:focus-visible {
      border-color: #94a3b8;
      background: #f8fafc;
      outline: none;
    }

    .rte-content-rules-btn-primary {
      border-color: #0284c7;
      background: #0ea5e9;
      color: #f8fafc;
    }

    .rte-content-rules-btn-primary:hover,
    .rte-content-rules-btn-primary:focus-visible {
      border-color: #0369a1;
      background: #0284c7;
      color: #ffffff;
    }

    .${Y}.rte-content-rules-theme-dark .rte-content-rules-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${Y}.rte-content-rules-theme-dark .rte-content-rules-btn:hover,
    .${Y}.rte-content-rules-theme-dark .rte-content-rules-btn:focus-visible {
      border-color: #475569;
      background: #1e293b;
    }

    .rte-content-rules-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: min(55vh, 420px);
      overflow: auto;
    }

    .rte-content-rules-item {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px;
      background: #ffffff;
    }

    .rte-content-rules-item-error {
      border-color: #fca5a5;
      background: #fef2f2;
    }

    .rte-content-rules-item-warning {
      border-color: #fcd34d;
      background: #fffbeb;
    }

    .rte-content-rules-item-info {
      border-color: #93c5fd;
      background: #eff6ff;
    }

    .${Y}.rte-content-rules-theme-dark .rte-content-rules-item {
      border-color: #334155;
      background: #0b1220;
    }

    .${Y}.rte-content-rules-theme-dark .rte-content-rules-item-error {
      border-color: #7f1d1d;
      background: #2b0b11;
    }

    .${Y}.rte-content-rules-theme-dark .rte-content-rules-item-warning {
      border-color: #78350f;
      background: #2b1907;
    }

    .${Y}.rte-content-rules-theme-dark .rte-content-rules-item-info {
      border-color: #1d4ed8;
      background: #0a162f;
    }

    .rte-content-rules-item-btn {
      width: 100%;
      border: none;
      background: transparent;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      text-align: left;
      padding: 0;
      color: inherit;
      cursor: pointer;
    }

    .rte-content-rules-item-btn:focus-visible {
      outline: 2px solid #0284c7;
      outline-offset: 3px;
      border-radius: 6px;
    }

    .rte-content-rules-badge {
      flex: 0 0 auto;
      margin-top: 1px;
      border-radius: 999px;
      border: 1px solid currentColor;
      padding: 1px 8px;
      font-size: 10px;
      font-weight: 700;
      line-height: 1.3;
      text-transform: uppercase;
      opacity: 0.86;
    }

    .rte-content-rules-message {
      font-size: 13px;
      line-height: 1.35;
      font-weight: 600;
    }

    .rte-content-rules-excerpt,
    .rte-content-rules-suggestion {
      margin: 8px 0 0;
      font-size: 12px;
      line-height: 1.35;
      color: #334155;
    }

    .${Y}.rte-content-rules-theme-dark .rte-content-rules-excerpt,
    .${Y}.rte-content-rules-theme-dark .rte-content-rules-suggestion {
      color: #94a3b8;
    }

    .rte-content-rules-empty {
      border: 1px dashed #cbd5e1;
      border-radius: 10px;
      padding: 10px;
      font-size: 13px;
      color: #475569;
      background: #f8fafc;
    }

    .${Y}.rte-content-rules-theme-dark .rte-content-rules-empty {
      border-color: #334155;
      background: #0b1220;
      color: #94a3b8;
    }

    .rte-content-rules-shortcut {
      margin: 2px 0 0;
      font-size: 11px;
      color: #64748b;
    }

    .${Y}.rte-content-rules-theme-dark .rte-content-rules-shortcut {
      color: #94a3b8;
    }

    .rte-content-rules-live {
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
      .${Y} {
        left: 10px !important;
        right: 10px;
        top: 10px !important;
        width: auto !important;
        max-height: calc(100vh - 20px);
      }

      .rte-content-rules-list {
        max-height: 45vh;
      }
    }
  `,document.head.appendChild(e)}function hx(e){$t=e,vr||(vr=t=>{const n=t.target,r=n==null?void 0:n.closest(St);if(!r)return;Ae=r,G.has(r)||G.set(r,e),Wt.has(r)||Wt.set(r,[]),gn.has(r)||gn.set(r,e.enableRealtime);const o=_e.get(r);o&&(Xi(o,r),Cs(r,o),Xr(r,o,G.get(r)||e)),Kt(r,"toggleContentRulesPanel",Ji(r)),Kt(r,"toggleContentRulesRealtime",qn(r,e))},document.addEventListener("focusin",vr,!0)),kr||(kr=t=>{const n=t.target,r=n==null?void 0:n.closest(St);r&&(Ae=r,nm(r))},document.addEventListener("input",kr,!0)),wr||(wr=t=>{if(t.defaultPrevented)return;const n=t.target;if(n!=null&&n.closest("input, textarea, select"))return;const r=t.key==="Escape",o=px(t),a=mx(t),i=gx(t);if(!r&&!o&&!a&&!i)return;const l=nn(void 0,!1);if(!l||Es(l))return;const s=G.get(l)||$t||e;if(G.set(l,s),Ae=l,r&&Ji(l)){t.preventDefault(),Er(l,!0);return}if(o){t.preventDefault(),t.stopPropagation(),Ss(l);return}if(a){t.preventDefault(),t.stopPropagation(),Lt(l,s,!0),lc(l);return}if(i){t.preventDefault(),t.stopPropagation();const c=!qn(l,s);gn.set(l,c);const d=_e.get(l);d&&Xr(l,d,s),Kt(l,"toggleContentRulesRealtime",c),c&&Lt(l,s,!0)}},document.addEventListener("keydown",wr,!0)),sn||(sn=()=>{_e.forEach((t,n)=>{if(!n.isConnected||!t.isConnected){tm(n),t.remove(),_e.delete(n),Da.delete(n);return}Xi(t,n),Cs(n,t)})},window.addEventListener("scroll",sn,!0),window.addEventListener("resize",sn))}function yx(){vr&&(document.removeEventListener("focusin",vr,!0),vr=null),kr&&(document.removeEventListener("input",kr,!0),kr=null),wr&&(document.removeEventListener("keydown",wr,!0),wr=null),sn&&(window.removeEventListener("scroll",sn,!0),window.removeEventListener("resize",sn),sn=null),_e.forEach(e=>{e.remove()}),_e.clear(),$t=null,Ae=null}const xx=(e={})=>{const t=Ti(e);return bx(),{name:"contentRules",toolbar:[{id:"contentRulesGroup",label:"Content Rules",type:"group",command:"contentRules",items:[{id:"contentRules",label:"Content Rules",command:"toggleContentRulesPanel",shortcut:"Mod-Alt-Shift-r",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M6 3h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm8 2v4h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 11h8M8 15h8M8 19h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'},{id:"contentRulesAudit",label:"Run Rules Audit",command:"runContentRulesAudit",shortcut:"Mod-Alt-Shift-l",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4 12h4l2 5 4-10 2 5h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/></svg>'},{id:"contentRulesRealtime",label:"Toggle Realtime Rules",command:"toggleContentRulesRealtime",shortcut:"Mod-Alt-Shift-t",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M12 3v4M12 17v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M3 12h4M17 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/></svg>'}]}],commands:{contentRules:(n,r)=>{const o=nn(r);if(!o||Es(o))return!1;const a=G.get(o)||t;return G.set(o,a),Ae=o,Ss(o,!0),Lt(o,a,!1),!0},toggleContentRulesPanel:(n,r)=>{const o=nn(r);if(!o||Es(o))return!1;Ae=o;const a=G.get(o)||t;G.set(o,a);const i=Ss(o,typeof n=="boolean"?n:void 0);return Ji(o)&&Lt(o,a,!1),i},runContentRulesAudit:async(n,r)=>{const o=nn(r);if(!o)return!1;Ae=o;const a=G.get(o)||t;return G.set(o,a),await Lt(o,a,!0),lc(o),!0},toggleContentRulesRealtime:(n,r)=>{const o=nn(r);if(!o)return!1;Ae=o;const a=G.get(o)||t;G.set(o,a);const i=typeof n=="boolean"?n:!qn(o,a);gn.set(o,i);const l=_e.get(o);return l&&Xr(o,l,a),Kt(o,"toggleContentRulesRealtime",i),i&&Lt(o,a,!0),!0},getContentRulesIssues:(n,r)=>{const o=nn(r);if(!o)return!1;const a=Wt.get(o)||[];if(typeof n=="function")try{n(a)}catch{}return o.__contentRulesIssues=a,o.dispatchEvent(new CustomEvent("editora:content-rules-issues",{bubbles:!0,detail:{issues:a}})),!0},setContentRulesOptions:(n,r)=>{const o=nn(r);if(!o||!n||typeof n!="object")return!1;const a=G.get(o)||t,i=Ti({...a,...n,labels:{...a.labels,...n.labels||{}}});G.set(o,i),typeof n.enableRealtime=="boolean"&&gn.set(o,n.enableRealtime),qn(o,i)&&Lt(o,i,!0);const l=_e.get(o);if(l){l.setAttribute("aria-label",i.labels.panelAriaLabel);const s=l.querySelector(".rte-content-rules-title");s&&(s.textContent=i.labels.panelTitle),Xr(o,l,i),ic(o)}return!0}},keymap:{"Mod-Alt-Shift-r":"toggleContentRulesPanel","Mod-Alt-Shift-R":"toggleContentRulesPanel","Mod-Alt-Shift-l":"runContentRulesAudit","Mod-Alt-Shift-L":"runContentRulesAudit","Mod-Alt-Shift-t":"toggleContentRulesRealtime","Mod-Alt-Shift-T":"toggleContentRulesRealtime"},init:function(r){Qa+=1;const o=this&&typeof this.__pluginConfig=="object"?Ti({...t,...this.__pluginConfig}):t;hx(o);const a=nn(r&&r.editorElement?{editorElement:r.editorElement}:void 0,!1);a&&(Ae=a,G.set(a,o),gn.set(a,o.enableRealtime),Wt.set(a,[]),Kt(a,"toggleContentRulesPanel",!1),Kt(a,"toggleContentRulesRealtime",o.enableRealtime),o.enableRealtime&&nm(a))},destroy:()=>{Qa=Math.max(0,Qa-1),!(Qa>0)&&(da.forEach(n=>{window.clearTimeout(n)}),da.clear(),yx())}}},It=".rte-content, .editora-content",xd="rte-citations-styles",U="rte-citations-panel",$l=".rte-citation-ref[data-citation-id]",Na='.rte-citation-bibliography[data-type="citation-bibliography"]',Ba='.rte-citation-footnotes[data-type="citation-footnotes"]',Ke=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',Bn=["apa","mla","chicago"],vx={panelTitle:"Citations",panelAriaLabel:"Citations panel",styleLabel:"Citation style",authorLabel:"Author",yearLabel:"Year",titleLabel:"Title",sourceLabel:"Source",urlLabel:"URL",noteLabel:"Footnote note",insertText:"Insert Citation",refreshText:"Refresh Bibliography",closeText:"Close",bibliographyTitle:"References",footnotesTitle:"Citation Notes",noCitationsText:"No citations inserted yet.",styleButtonPrefix:"Style",recentHeading:"Recent citations",deleteRecentText:"x",summaryPrefix:"Citations",invalidMessage:"Author and title are required."},P=new WeakMap,bn=new WeakMap,vd=new WeakMap,Jr=new WeakMap,Rt=new Map,Pa=new WeakMap,Qi=new WeakMap,ua=new Set;let Cr=null,Sr=null,Tr=null,cn=null,ti=0,kx=0,es=0,hn=null,ke=null;function J(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function wx(e){return e.replace(/\u00A0/g," ").replace(/\s+/g," ").trim()}function rm(e,t){const n=t(e);if(!n)return"";const r=n.match(/\d{4}/);return r?r[0]:n}function om(e,t){const n=t(e);return n?/^https?:\/\//i.test(n)?n:`https://${n}`:""}function so(e){return e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)}function am(e,t){return{id:so(t.normalizeText(e.id||"")),author:t.normalizeText(e.author||""),year:rm(e.year||"",t.normalizeText)||void 0,title:t.normalizeText(e.title||""),source:t.normalizeText(e.source||"")||void 0,url:om(e.url||"",t.normalizeText)||void 0,note:t.normalizeText(e.note||"")||void 0}}function $i(e={}){const t=e.defaultStyle&&Bn.includes(e.defaultStyle)?e.defaultStyle:"apa",n={...vx,...e.labels||{}};return{defaultStyle:t,enableFootnoteSync:e.enableFootnoteSync!==!1,debounceMs:Math.max(80,Number(e.debounceMs??220)),maxRecentCitations:Math.max(3,Math.min(30,Number(e.maxRecentCitations??8))),labels:n,normalizeText:e.normalizeText||wx,generateCitationId:typeof e.generateCitationId=="function"?e.generateCitationId:void 0}}function im(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function sc(e){return e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||e}function ni(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function Ex(e){const t=sc(e);if(ni(t))return!0;const n=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return ni(n)?!0:ni(document.documentElement)||ni(document.body)}function el(e,t){e.classList.remove("rte-citations-theme-dark"),Ex(t)&&e.classList.add("rte-citations-theme-dark")}function qe(e,t=!0){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const o=e.editorElement;if(o.matches(It))return o;const a=o.querySelector(It);if(a instanceof HTMLElement)return a}const n=window.getSelection();if(n&&n.rangeCount>0){const o=n.getRangeAt(0).startContainer,a=im(o),i=a==null?void 0:a.closest(It);if(i)return i}const r=document.activeElement;if(r){if(r.matches(It))return r;const o=r.closest(It);if(o)return o}return ke&&ke.isConnected?ke:(ke&&!ke.isConnected&&(ke=null),t?document.querySelector(It):null)}function zt(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function fa(e){const t=im(e);return t?!!(t.closest(Na)||t.closest(Ba)):!1}function Cx(e,t){if(es+=1,t.generateCitationId){const n=t.generateCitationId({editor:e,index:es}),r=so(t.normalizeText(n||""));if(r)return r}return`cite-${Date.now().toString(36)}-${es.toString(36)}`}function ts(e){return e.map(t=>(t||"").trim()).filter(Boolean).join(" ").trim()}function Sx(e,t){const n=e.author||"Unknown",r=e.year||"n.d.";return t==="mla"?`(${n} ${r})`:t==="chicago"?`(${n} ${r})`:`(${n}, ${r})`}function cc(e,t){const n=e.author||"Unknown",r=e.year||"n.d.",o=e.title||"Untitled",a=e.source||"",i=e.url||"";return ts(t==="mla"?[`${n}.`,`"${o}."`,a?`${a},`:"",`${r}.`,i]:t==="chicago"?[`${n}.`,`${o}.`,a?`${a}.`:"",`(${r}).`,i]:[`${n}.`,`(${r}).`,`${o}.`,a?`${a}.`:"",i])}function _n(e){return Array.from(e.querySelectorAll($l)).filter(t=>!t.closest(Na)&&!t.closest(Ba))}function lm(e,t){const n=so(t.normalizeText(e.getAttribute("data-citation-id")||""));if(!n)return null;const r=t.normalizeText(e.getAttribute("data-citation-author")||""),o=t.normalizeText(e.getAttribute("data-citation-title")||"");return{id:n,author:r||"Unknown",year:rm(e.getAttribute("data-citation-year")||"",t.normalizeText)||void 0,title:o||"Untitled",source:t.normalizeText(e.getAttribute("data-citation-source")||"")||void 0,url:om(e.getAttribute("data-citation-url")||"",t.normalizeText)||void 0,note:t.normalizeText(e.getAttribute("data-citation-note")||"")||void 0}}function sm(e,t,n){e.classList.add("rte-citation-ref"),e.setAttribute("data-citation-id",t.id),e.setAttribute("data-citation-author",t.author||""),e.setAttribute("data-citation-year",t.year||""),e.setAttribute("data-citation-title",t.title||""),e.setAttribute("data-citation-source",t.source||""),e.setAttribute("data-citation-url",t.url||""),e.setAttribute("data-citation-note",t.note||""),e.setAttribute("contenteditable","false"),e.setAttribute("tabindex","0"),e.setAttribute("role","doc-biblioref"),e.setAttribute("data-style",n),e.textContent=Sx(t,n)}function Ll(e,t,n){const r=sc(e);Array.from(r.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",n),a.setAttribute("data-active",n?"true":"false"),a.setAttribute("aria-pressed",n?"true":"false")})}function Fn(e,t){const n=bn.get(e);return n&&Bn.includes(n)?n:(t==null?void 0:t.defaultStyle)||"apa"}function pa(e,t){const n=_n(e),r=new Map;return n.forEach(o=>{const a=lm(o,t);if(!a)return;if(!r.has(a.id)){r.set(a.id,a);return}const i=r.get(a.id);r.set(a.id,{...i,author:i.author||a.author,title:i.title||a.title,year:i.year||a.year,source:i.source||a.source,url:i.url||a.url,note:i.note||a.note})}),Array.from(r.values())}function Tx(e,t,n){const r=am(t,n);if(!r.id||!r.author||!r.title)return;const a=(Jr.get(e)||[]).filter(i=>i.id!==r.id);Jr.set(e,[r,...a].slice(0,n.maxRecentCitations))}function Al(e,t,n){const r=Jr.get(e)||[],o=new Map;t.slice(Math.max(0,t.length-n.maxRecentCitations)).reverse().forEach(i=>{i.id&&o.set(i.id,i)}),r.forEach(i=>{!i.id||o.has(i.id)||o.set(i.id,i)});const a=Array.from(o.values()).slice(0,n.maxRecentCitations);return Jr.set(e,a),a}function cm(e,t,n,r){const o=so(r.normalizeText(t||""));return o&&Al(e,n,r).find(i=>i.id===o)||null}function $x(e,t,n){const r=so(n.normalizeText(t||""));if(!r)return!1;const o=Jr.get(e)||[],a=o.filter(i=>i.id!==r);return a.length===o.length?!1:(Jr.set(e,a),!0)}function dm(e,t,n){const r=document.createElement("section");r.className=e,r.setAttribute("data-type",t),r.setAttribute("contenteditable","false"),r.setAttribute("aria-label",n),t==="citation-bibliography"?r.setAttribute("role","doc-bibliography"):t==="citation-footnotes"&&r.setAttribute("role","doc-endnotes");const o=document.createElement("h3");o.className="rte-citation-section-title",o.textContent=n;const a=document.createElement("ol");return a.className="rte-citation-list",a.setAttribute("role","list"),r.appendChild(o),r.appendChild(a),r}function Lx(e,t){let n=e.querySelector(Na);n||(n=dm("rte-citation-bibliography","citation-bibliography",t.labels.bibliographyTitle),e.appendChild(n));const r=n.querySelector(".rte-citation-section-title");return r&&(r.textContent=t.labels.bibliographyTitle),n.setAttribute("aria-label",t.labels.bibliographyTitle),n}function Ax(e,t){let n=e.querySelector(Ba);n||(n=dm("rte-citation-footnotes","citation-footnotes",t.labels.footnotesTitle),e.appendChild(n));const r=n.querySelector(".rte-citation-section-title");return r&&(r.textContent=t.labels.footnotesTitle),n.setAttribute("aria-label",t.labels.footnotesTitle),n}function um(e,t){const n=e.querySelector(t);n==null||n.remove()}function Mx(e,t,n,r){if(t.length===0){um(e,Na);return}const a=Lx(e,n).querySelector(".rte-citation-list");if(!a)return;const i=document.createDocumentFragment();t.forEach((l,s)=>{const c=document.createElement("li");c.className="rte-citation-item",c.id=`rte-citation-entry-${l.id}`,c.setAttribute("data-citation-id",l.id),c.setAttribute("data-citation-number",String(s+1)),c.textContent=cc(l,r),i.appendChild(c)}),a.innerHTML="",a.appendChild(i)}function Rx(e,t,n,r){if(!n.enableFootnoteSync||t.length===0){um(e,Ba),_n(e).forEach(d=>{d.removeAttribute("data-footnote-number"),d.removeAttribute("data-footnote-target")});return}const a=Ax(e,n).querySelector(".rte-citation-list");if(!a)return;const i=new Map,l=new Map;t.forEach((d,u)=>{l.set(d.id,u+1)});const s=new Map;_n(e).forEach(d=>{const u=d.getAttribute("data-citation-id")||"";if(!u||!l.has(u))return;const f=(s.get(u)||0)+1;s.set(u,f);const m=`rte-citation-ref-${u}-${f}`;d.id=m;const g=l.get(u);d.setAttribute("data-footnote-number",String(g)),d.setAttribute("data-footnote-target",`rte-citation-note-${u}`),i.has(u)||i.set(u,m)});const c=document.createDocumentFragment();t.forEach((d,u)=>{const f=document.createElement("li");f.className="rte-citation-item rte-citation-footnote-item",f.id=`rte-citation-note-${d.id}`,f.setAttribute("data-citation-id",d.id);const m=document.createElement("span");m.className="rte-citation-footnote-number",m.textContent=`${u+1}. `;const g=document.createElement("span");g.className="rte-citation-footnote-text";const p=d.note?`${d.note}. `:"";g.textContent=`${p}${cc(d,r)}`,f.appendChild(m),f.appendChild(g);const b=i.get(d.id);if(b){const h=document.createElement("a");h.className="rte-citation-backref",h.href=`#${b}`,h.setAttribute("aria-label",`Back to citation ${u+1}`),h.textContent="Back",f.appendChild(h)}c.appendChild(f)}),a.innerHTML="",a.appendChild(c)}function Dx(e,t,n,r){const o=cc(t,n);e.setAttribute("data-citation-number",String(r)),e.setAttribute("aria-label",`Citation ${r}: ${o}`)}function Nx(e,t,n){const r=_n(e);let o=`${t}:${n?"1":"0"}:${r.length}`;return r.forEach(a=>{o+=`|${a.getAttribute("data-citation-id")||""}`,o+=`|${a.getAttribute("data-citation-author")||""}`,o+=`|${a.getAttribute("data-citation-year")||""}`,o+=`|${a.getAttribute("data-citation-title")||""}`,o+=`|${a.getAttribute("data-citation-source")||""}`,o+=`|${a.getAttribute("data-citation-url")||""}`,o+=`|${a.getAttribute("data-citation-note")||""}`}),o}function Qr(e){const t=Rt.get(e);if(!t)return;const n=P.get(e)||hn;if(!n)return;const r=Fn(e,n),o=pa(e,n),a=Al(e,o,n),i=t.querySelector(".rte-citations-status"),l=t.querySelector('[data-action="cycle-style"]'),s=t.querySelector(".rte-citations-recent-list");if(i){const c=o.length;i.textContent=`${n.labels.summaryPrefix}: ${c} | Style: ${r.toUpperCase()} | Footnotes: ${n.enableFootnoteSync?"On":"Off"}`}if(l&&(l.textContent=`${n.labels.styleButtonPrefix}: ${r.toUpperCase()}`,l.setAttribute("aria-label",`${n.labels.styleButtonPrefix}: ${r.toUpperCase()}`)),s){if(a.length===0){s.innerHTML=`<li class="rte-citations-empty">${J(n.labels.noCitationsText)}</li>`;return}s.innerHTML=a.map(c=>`
          <li class="rte-citations-recent-item">
            <div class="rte-citations-recent-row">
              <button
                type="button"
                class="rte-citations-recent-btn"
                data-action="insert-from-recent"
                data-citation-id="${J(c.id)}"
                aria-label="Insert citation: ${J(c.title)}"
              >
                <span class="rte-citations-recent-title">${J(c.title)}</span>
                <span class="rte-citations-recent-meta">${J(c.author)}${c.year?` (${J(c.year)})`:""}</span>
              </button>
              <button
                type="button"
                class="rte-citations-recent-delete"
                data-action="delete-by-id"
                data-citation-id="${J(c.id)}"
                aria-label="Delete citation: ${J(c.title)}"
              >${J(n.labels.deleteRecentText)}</button>
            </div>
          </li>
        `).join("")}}function Qe(e,t,n=!1){const r=Fn(e,t),o=Nx(e,r,t.enableFootnoteSync);if(!n&&vd.get(e)===o)return pa(e,t);const a=_n(e),i=new Map;a.forEach(c=>{const d=lm(c,t);d&&(i.has(d.id)||i.set(d.id,d))});const l=Array.from(i.values());Al(e,l,t);const s=new Map;return l.forEach((c,d)=>{s.set(c.id,d+1)}),a.forEach(c=>{const d=c.getAttribute("data-citation-id")||"",u=i.get(d);if(!u)return;sm(c,u,r);const f=s.get(u.id)||1;Dx(c,u,r,Math.max(1,f))}),Mx(e,l,t,r),Rx(e,l,t,r),vd.set(e,o),Qr(e),e.dispatchEvent(new CustomEvent("editora:citations-refreshed",{bubbles:!0,detail:{citations:l,style:r,footnoteSync:t.enableFootnoteSync}})),l}function fm(e){const t=Qi.get(e);typeof t=="number"&&(window.clearTimeout(t),ua.delete(t),Qi.delete(e))}function pm(e){const t=P.get(e)||hn;if(!t)return;fm(e);const n=window.setTimeout(()=>{ua.delete(n),Qi.delete(e),Qe(e,t,!1)},t.debounceMs);ua.add(n),Qi.set(e,n)}function Bx(e){const t=window.getSelection();if(!t)throw new Error("Selection unavailable");if(t.rangeCount>0){const i=t.getRangeAt(0);if(e.contains(i.commonAncestorContainer)&&!fa(i.commonAncestorContainer))return i.cloneRange()}const n=document.createRange(),r=e.querySelector(Na),o=e.querySelector(Ba),a=r||o;return a?(n.setStartBefore(a),n.collapse(!0),n):(n.selectNodeContents(e),n.collapse(!1),n)}function dc(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function uc(e,t){if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}}function mm(e,t){const n=window.getSelection();if(!n)return;const r=document.createRange();if(e.nodeType===Node.TEXT_NODE){const o=e,a=Math.max(0,Math.min(t,o.length));r.setStart(o,a)}else{const o=e.childNodes.length,a=Math.max(0,Math.min(t,o));r.setStart(e,a)}r.collapse(!0),n.removeAllRanges(),n.addRange(r)}function gm(e){if(e.collapsed||e.startContainer!==e.endContainer||e.endOffset!==e.startOffset+1||!(e.startContainer instanceof Element||e.startContainer instanceof DocumentFragment))return null;const t=e.startContainer.childNodes[e.startOffset];return!(t instanceof HTMLElement)||!t.matches($l)?null:t}function ri(e,t,n){const{startContainer:r,startOffset:o}=e;if(r.nodeType===Node.ELEMENT_NODE){const i=r;if(n==="previous"){if(o>0)return i.childNodes[o-1]||null}else if(o<i.childNodes.length)return i.childNodes[o]||null}if(r.nodeType===Node.TEXT_NODE&&(n==="previous"&&o<r.data.length||n==="next"&&o>0))return null;let a=r;for(;a&&a!==t;){const i=n==="previous"?a.previousSibling:a.nextSibling;if(i)return i;a=a.parentNode}return null}function bm(e,t,n){if(!e.collapsed)return null;const r=i=>i instanceof HTMLElement&&i.matches($l)?i:null,{startContainer:o,startOffset:a}=e;if(o.nodeType===Node.ELEMENT_NODE){const i=o;return n==="Backspace"&&a>0?r(i.childNodes[a-1]||null):n==="Delete"?r(i.childNodes[a]||null):null}if(o.nodeType===Node.TEXT_NODE){const i=o;if(n==="Backspace"&&a===0){const l=r(i.previousSibling);return l||r(ri(e,t,"previous"))}if(n==="Delete"&&a===i.data.length){const l=r(i.nextSibling);return l||r(ri(e,t,"next"))}}return r(n==="Backspace"?ri(e,t,"previous"):ri(e,t,"next"))}function $r(e,t,n){const r=e.closest(It);if(!r||fa(e))return!1;const o=e.parentNode;if(!o)return!1;const a=r.innerHTML,i=Array.from(o.childNodes).indexOf(e);if(i<0)return!1;const l=e.nextSibling;return l instanceof Text&&(l.data===" "?l.remove():l.data.startsWith(" ")&&(l.data=l.data.slice(1))),e.remove(),mm(o,i),Qe(r,n,!0),uc(r,a),dc(r),t==="Delete"&&r.focus({preventScroll:!0}),!0}function Px(e,t,n){if(e.key!=="Backspace"&&e.key!=="Delete")return!1;const r=e.key,o=e.target;if(o!=null&&o.matches($l)&&t.contains(o)&&!fa(o))return e.preventDefault(),e.stopPropagation(),$r(o,r,n);const a=window.getSelection();if(!a||a.rangeCount===0)return!1;const i=a.getRangeAt(0);if(!t.contains(i.commonAncestorContainer)||fa(i.commonAncestorContainer))return!1;const l=gm(i);if(l)return e.preventDefault(),e.stopPropagation(),$r(l,r,n);const s=bm(i,t,r);return s?(e.preventDefault(),e.stopPropagation(),$r(s,r,n)):!1}function hm(e,t,n){const r=so(n.normalizeText(t||""));if(!r)return!1;const o=_n(e).filter(i=>i.getAttribute("data-citation-id")===r);if(o.length===0)return!1;if(o.length===1)return $r(o[0],"Delete",n);const a=e.innerHTML;return o.forEach(i=>{const l=i.nextSibling;l instanceof Text&&(l.data===" "?l.remove():l.data.startsWith(" ")&&(l.data=l.data.slice(1))),i.remove()}),mm(e,e.childNodes.length),Qe(e,n,!0),uc(e,a),dc(e),e.focus({preventScroll:!0}),!0}function Ix(e,t){const n=window.getSelection();if(!n||n.rangeCount===0)return!1;const r=n.getRangeAt(0);if(!e.contains(r.commonAncestorContainer)||fa(r.commonAncestorContainer))return!1;const o=gm(r);if(o)return $r(o,"Delete",t);const a=bm(r,e,"Backspace");return a?$r(a,"Backspace",t):!1}function tl(e,t,n){var d,u;const r=am(t,n);if(!r.author||!r.title)return!1;r.id||(r.id=Cx(e,n));const o=e.innerHTML;let a;try{a=Bx(e)}catch{return!1}const i=window.getSelection();if(!i)return!1;a.collapsed||a.deleteContents();const l=document.createElement("span");sm(l,r,Fn(e,n));try{a.insertNode(l)}catch{return!1}const s=document.createTextNode(" ");l.nextSibling?(d=l.parentNode)==null||d.insertBefore(s,l.nextSibling):(u=l.parentNode)==null||u.appendChild(s);const c=document.createRange();if(s.parentNode){const f=Array.from(s.parentNode.childNodes).indexOf(s)+1;c.setStart(s.parentNode,Math.max(0,f))}else c.setStartAfter(l);return c.collapse(!0),i.removeAllRanges(),i.addRange(c),Tx(e,r,n),Qe(e,n,!0),uc(e,o),dc(e),!0}function Hx(e,t){if(!t)return!1;const n=_n(e).find(a=>a.getAttribute("data-citation-id")===t)||null;if(!n)return!1;n.scrollIntoView({behavior:"smooth",block:"center",inline:"nearest"}),n.focus({preventScroll:!0});const r=window.getSelection();if(!r)return!0;const o=document.createRange();return o.selectNode(n),r.removeAllRanges(),r.addRange(o),!0}function nl(e){return Pa.get(e)===!0}function ma(e,t=!1){const n=Rt.get(e);n&&(n.classList.remove("show"),Pa.set(e,!1),Ll(e,"toggleCitationsPanel",!1),t&&e.focus({preventScroll:!0}))}function Ox(e){Rt.forEach((t,n)=>{n!==e&&ma(n,!1)})}function Ts(e,t){if(!t.classList.contains("show"))return;const r=sc(e).getBoundingClientRect(),o=Math.min(window.innerWidth-20,380),a=Math.max(10,window.innerWidth-o-10),i=Math.min(Math.max(10,r.right-o),a),l=Math.max(10,Math.min(window.innerHeight-10-260,r.top+10));t.style.width=`${o}px`,t.style.left=`${i}px`,t.style.top=`${l}px`,t.style.maxHeight=`${Math.max(260,window.innerHeight-24)}px`}function dt(e,t){return e.querySelector(`[data-field="${t}"]`)}function zx(e){var l,s,c,d,u,f;const t=((l=dt(e,"author"))==null?void 0:l.value)||"",n=((s=dt(e,"year"))==null?void 0:s.value)||"",r=((c=dt(e,"title"))==null?void 0:c.value)||"",o=((d=dt(e,"source"))==null?void 0:d.value)||"",a=((u=dt(e,"url"))==null?void 0:u.value)||"",i=((f=dt(e,"note"))==null?void 0:f.value)||"";return{author:t,year:n,title:r,source:o,url:a,note:i}}function Nt(e,t){const n=e.querySelector(".rte-citations-live");n&&(n.textContent=t)}function qx(e,t,n){const r=dt(t,"style");r&&(r.value=Fn(e,n))}function ym(e,t,n){const r=Bn.includes(t)?t:n.defaultStyle;return bn.set(e,r),Qe(e,n,!0),r}function fc(e,t){const n=Fn(e,t),r=Bn.indexOf(n),o=Bn[(r+1)%Bn.length];return bn.set(e,o),Qe(e,t,!0),o}function _x(e){const t=Rt.get(e);if(t)return t;const n=P.get(e)||hn||$i(),r=`rte-citations-panel-${kx++}`,o=document.createElement("section");o.className=U,o.id=r,o.setAttribute("role","dialog"),o.setAttribute("aria-modal","false"),o.setAttribute("aria-label",n.labels.panelAriaLabel),o.setAttribute("tabindex","-1"),o.innerHTML=`
    <header class="rte-citations-header">
      <h2 class="rte-citations-title">${J(n.labels.panelTitle)}</h2>
      <button type="button" class="rte-citations-icon-btn" data-action="close" aria-label="${J(n.labels.closeText)}">✕</button>
    </header>
    <div class="rte-citations-body">
      <p class="rte-citations-status" aria-live="polite"></p>

      <div class="rte-citations-grid">
        <label class="rte-citations-label">
          ${J(n.labels.styleLabel)}
          <select data-field="style" class="rte-citations-field">
            <option value="apa">APA</option>
            <option value="mla">MLA</option>
            <option value="chicago">Chicago</option>
          </select>
        </label>
        <label class="rte-citations-label">
          ${J(n.labels.authorLabel)}
          <input type="text" data-field="author" class="rte-citations-field" autocomplete="off" />
        </label>
        <label class="rte-citations-label">
          ${J(n.labels.yearLabel)}
          <input type="text" data-field="year" class="rte-citations-field" inputmode="numeric" autocomplete="off" />
        </label>
        <label class="rte-citations-label">
          ${J(n.labels.titleLabel)}
          <input type="text" data-field="title" class="rte-citations-field" autocomplete="off" />
        </label>
        <label class="rte-citations-label">
          ${J(n.labels.sourceLabel)}
          <input type="text" data-field="source" class="rte-citations-field" autocomplete="off" />
        </label>
        <label class="rte-citations-label">
          ${J(n.labels.urlLabel)}
          <input type="url" data-field="url" class="rte-citations-field" autocomplete="off" />
        </label>
        <label class="rte-citations-label rte-citations-label-note">
          ${J(n.labels.noteLabel)}
          <textarea data-field="note" class="rte-citations-field" rows="2"></textarea>
        </label>
      </div>

      <div class="rte-citations-controls" role="toolbar" aria-label="Citation actions">
        <button type="button" class="rte-citations-btn rte-citations-btn-primary" data-action="insert">${J(n.labels.insertText)}</button>
        <button type="button" class="rte-citations-btn" data-action="refresh">${J(n.labels.refreshText)}</button>
        <button type="button" class="rte-citations-btn" data-action="cycle-style"></button>
      </div>

      <section class="rte-citations-recent" aria-label="${J(n.labels.recentHeading)}">
        <h3 class="rte-citations-recent-heading">${J(n.labels.recentHeading)}</h3>
        <ul class="rte-citations-recent-list" role="list"></ul>
      </section>

      <p class="rte-citations-shortcut">Shortcut: Ctrl/Cmd + Alt + Shift + C</p>
      <span class="rte-citations-live" aria-live="polite"></span>
    </div>
  `,o.addEventListener("click",i=>{const l=i.target;if(!l)return;const s=l.closest("[data-action]");if(!s)return;const c=s.getAttribute("data-action")||"",d=P.get(e)||hn||n;if(P.set(e,d),c==="close"){ma(e,!0);return}if(c==="insert"){if(zt(e))return;const u=zx(o);if(!d.normalizeText(u.author)||!d.normalizeText(u.title)){Nt(o,d.labels.invalidMessage);return}if(!tl(e,u,d)){Nt(o,d.labels.invalidMessage);return}Nt(o,"Citation inserted.");const m=dt(o,"title"),g=dt(o,"note");m&&(m.value=""),g&&(g.value="");return}if(c==="refresh"){const u=Qe(e,d,!0);Nt(o,`Refreshed ${u.length} citation${u.length===1?"":"s"}.`);return}if(c==="cycle-style"){const u=fc(e,d);qx(e,o,d),Nt(o,`Style changed to ${u.toUpperCase()}.`);return}if(c==="insert-from-recent"){if(zt(e))return;const u=s.getAttribute("data-citation-id")||"",f=cm(e,u,pa(e,d),d);if(!f)return;tl(e,f,d),Nt(o,`Inserted citation: ${f.title}.`);return}if(c==="delete-by-id"){if(zt(e))return;const u=s.getAttribute("data-citation-id")||"";if(hm(e,u,d)){Nt(o,"Citation deleted.");return}$x(e,u,d)&&(Qr(e),Nt(o,"Removed from recent citations."))}}),o.addEventListener("keydown",i=>{if(i.key==="Escape"){i.preventDefault(),ma(e,!0);return}const l=i.target;if(!l||!l.matches(".rte-citations-recent-btn")||i.key!=="ArrowDown"&&i.key!=="ArrowUp")return;const s=Array.from(o.querySelectorAll(".rte-citations-recent-btn"));if(s.length===0)return;const c=s.indexOf(l);if(c<0)return;i.preventDefault();const d=i.key==="ArrowDown"?1:-1,u=(c+d+s.length)%s.length;s[u].focus()});const a=dt(o,"style");return a==null||a.addEventListener("change",()=>{const i=P.get(e)||hn||n,l=a.value;ym(e,l,i),Nt(o,`Style changed to ${l.toUpperCase()}.`)}),el(o,e),document.body.appendChild(o),Rt.set(e,o),Pa.set(e,!1),Qr(e),o}function tr(e){const t=_x(e);Ox(e),t.classList.add("show"),Pa.set(e,!0),Ll(e,"toggleCitationsPanel",!0),el(t,e),Ts(e,t),Qr(e);const n=dt(t,"author");n==null||n.focus()}function xm(e,t){const n=nl(e);return(typeof t=="boolean"?t:!n)?tr(e):ma(e,!1),!0}function Fx(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="c"}function jx(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="b"}function Vx(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="j"}function Wx(e){hn=e,Cr||(Cr=t=>{const n=t.target,r=n==null?void 0:n.closest(It);if(!r)return;ke=r,P.has(r)||P.set(r,e),bn.has(r)||bn.set(r,e.defaultStyle);const o=Rt.get(r);o&&(el(o,r),Ts(r,o)),Ll(r,"toggleCitationsPanel",nl(r))},document.addEventListener("focusin",Cr,!0)),Sr||(Sr=t=>{const n=t.target,r=n==null?void 0:n.closest(It);r&&(ke=r,pm(r))},document.addEventListener("input",Sr,!0)),Tr||(Tr=t=>{if(t.defaultPrevented)return;const n=t.target,r=!!(n!=null&&n.closest(`.${U} input, .${U} textarea, .${U} select`)),o=qe(void 0,!1);if(!o||zt(o))return;const a=P.get(o)||hn||e;if(P.set(o,a),ke=o,t.key==="Escape"&&nl(o)){t.preventDefault(),ma(o,!0);return}if(!r&&!Px(t,o,a)){if(Fx(t)){t.preventDefault(),t.stopPropagation(),xm(o);return}if(jx(t)){t.preventDefault(),t.stopPropagation(),Qe(o,a,!0),tr(o);return}Vx(t)&&(t.preventDefault(),t.stopPropagation(),fc(o,a))}},document.addEventListener("keydown",Tr,!0)),cn||(cn=()=>{Rt.forEach((t,n)=>{if(!n.isConnected||!t.isConnected){fm(n),t.remove(),Rt.delete(n),Pa.delete(n);return}el(t,n),Ts(n,t)})},window.addEventListener("scroll",cn,!0),window.addEventListener("resize",cn))}function Kx(){Cr&&(document.removeEventListener("focusin",Cr,!0),Cr=null),Sr&&(document.removeEventListener("input",Sr,!0),Sr=null),Tr&&(document.removeEventListener("keydown",Tr,!0),Tr=null),cn&&(window.removeEventListener("scroll",cn,!0),window.removeEventListener("resize",cn),cn=null),Rt.forEach(e=>e.remove()),Rt.clear(),hn=null,ke=null}function Ux(){if(typeof document>"u"||document.getElementById(xd))return;const e=document.createElement("style");e.id=xd,e.textContent=`
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

    ${Ke} .rte-toolbar-group-items.citations,
    ${Ke} .editora-toolbar-group-items.citations,
    .${U}.rte-citations-theme-dark {
      border-color: #566275;
    }

    ${Ke} .rte-toolbar-group-items.citations .rte-toolbar-button[data-command="refreshCitations"] svg,
    ${Ke} .editora-toolbar-group-items.citations .editora-toolbar-button[data-command="refreshCitations"] svg
    {
      fill: none;
    }
    ${Ke} .rte-toolbar-group-items.citations .rte-toolbar-button,
    ${Ke} .editora-toolbar-group-items.citations .editora-toolbar-button
    {
      border-color: #566275;
    }
    ${Ke} .rte-toolbar-button[data-command="toggleCitationsPanel"].active,
    ${Ke} .editora-toolbar-button[data-command="toggleCitationsPanel"].active {
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

    .${Ke} .rte-citation-ref {
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

    .${Ke} .rte-citation-bibliography,
    .${Ke} .rte-citation-footnotes {
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

    .${Ke} .rte-citation-backref {
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
  `,document.head.appendChild(e)}const Gx=(e={})=>{const t=$i(e);return Ux(),{name:"citations",toolbar:[{id:"citationsGroup",label:"Citations",type:"group",command:"citations",items:[{id:"citations",label:"Citations",command:"toggleCitationsPanel",shortcut:"Mod-Alt-Shift-c",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M6 5h12M6 9h12M6 13h8M6 17h10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M17 14.5a2.5 2.5 0 0 1 2.5 2.5v2H15v-2a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.5"/></svg>'},{id:"citationsRefresh",label:"Refresh Citations",command:"refreshCitations",shortcut:"Mod-Alt-Shift-b",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.34-5.66" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M20 4v6h-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'},{id:"citationsStyle",label:"Cycle Citation Style",command:"cycleCitationStyle",shortcut:"Mod-Alt-Shift-j",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M5 6h14M5 10h8M5 14h14M5 18h10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="18" cy="10" r="2" stroke="currentColor" stroke-width="1.6"/></svg>'}]}],commands:{citations:(n,r)=>{const o=qe(r);if(!o||zt(o))return!1;const a=P.get(o)||t;return P.set(o,a),bn.set(o,Fn(o,a)),ke=o,tr(o),Qe(o,a,!1),!0},toggleCitationsPanel:(n,r)=>{const o=qe(r);if(!o||zt(o))return!1;const a=P.get(o)||t;P.set(o,a),ke=o;const i=xm(o,typeof n=="boolean"?n:void 0);return nl(o)&&Qe(o,a,!1),i},insertCitation:(n,r)=>{const o=qe(r);if(!o||zt(o)||!n||typeof n!="object")return!1;const a=P.get(o)||t;P.set(o,a),ke=o;const i=tl(o,n,a);return i&&tr(o),i},refreshCitations:(n,r)=>{const o=qe(r);if(!o)return!1;const a=P.get(o)||t;return P.set(o,a),ke=o,Qe(o,a,!0),tr(o),!0},setCitationStyle:(n,r)=>{const o=qe(r);if(!o||!n)return!1;const a=P.get(o)||t;return P.set(o,a),ke=o,ym(o,n,a),!0},cycleCitationStyle:(n,r)=>{const o=qe(r);if(!o)return!1;const a=P.get(o)||t;return P.set(o,a),ke=o,fc(o,a),Qr(o),!0},getCitationRecords:(n,r)=>{const o=qe(r);if(!o)return!1;const a=P.get(o)||t,i=pa(o,a);if(typeof n=="function")try{n(i)}catch{}return o.__citationRecords=i,o.dispatchEvent(new CustomEvent("editora:citations-data",{bubbles:!0,detail:{records:i,style:Fn(o,a)}})),!0},setCitationsOptions:(n,r)=>{const o=qe(r);if(!o||!n||typeof n!="object")return!1;const a=P.get(o)||t,i=$i({...a,...n,labels:{...a.labels,...n.labels||{}},normalizeText:n.normalizeText||a.normalizeText,generateCitationId:n.generateCitationId||a.generateCitationId});return P.set(o,i),n.defaultStyle&&Bn.includes(n.defaultStyle)&&bn.set(o,n.defaultStyle),Qe(o,i,!0),Qr(o),!0},locateCitation:(n,r)=>{const o=qe(r);return!o||typeof n!="string"?!1:Hx(o,n)},deleteCitation:(n,r)=>{const o=qe(r);if(!o||zt(o))return!1;const a=P.get(o)||t;return P.set(o,a),typeof n=="string"&&n.trim()?hm(o,n,a):Ix(o,a)},insertRecentCitation:(n,r)=>{const o=qe(r);if(!o||zt(o))return!1;const a=P.get(o)||t;P.set(o,a);const i=pa(o,a),l=Al(o,i,a);if(l.length===0)return!1;const s=typeof n=="string"&&n.trim()?cm(o,n,i,a):l[0];if(!s)return!1;const c=tl(o,s,a);return c&&tr(o),c}},keymap:{"Mod-Alt-Shift-c":"toggleCitationsPanel","Mod-Alt-Shift-C":"toggleCitationsPanel","Mod-Alt-Shift-b":"refreshCitations","Mod-Alt-Shift-B":"refreshCitations","Mod-Alt-Shift-j":"cycleCitationStyle","Mod-Alt-Shift-J":"cycleCitationStyle"},init:function(r){ti+=1;const o=this&&typeof this.__pluginConfig=="object"?$i({...t,...this.__pluginConfig}):t;Wx(o);const a=qe(r&&r.editorElement?{editorElement:r.editorElement}:void 0,!1);a&&(ke=a,P.set(a,o),bn.set(a,o.defaultStyle),Ll(a,"toggleCitationsPanel",!1),pm(a))},destroy:()=>{ti=Math.max(0,ti-1),!(ti>0)&&(ua.forEach(n=>{window.clearTimeout(n)}),ua.clear(),Kx())}}},et=".rte-content, .editora-content",pc="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",kd="__editoraCommandEditorRoot",wd="rte-smart-paste-styles",j="rte-smart-paste-panel",Ue="smart-paste",gt="smartPaste",bt=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',Zx=typeof NodeFilter<"u"?NodeFilter.SHOW_COMMENT:128,Ed="__editoraSmartPasteHandled",Yx=new Set(["script","style","meta","link","object","embed","iframe","svg","canvas","math","form","input","button","textarea","select","option"]),Xx=new Set(["table","thead","tbody","tfoot","tr","td","th","colgroup","col"]),Jx=new Set(["span","font"]),Qx=/^(https?:|mailto:|tel:|#|\/)/i,e0=/^data:image\/(?:png|gif|jpeg|jpg|webp);base64,/i,t0=new Set(["color","background-color","font-weight","font-style","text-decoration","text-align","font-size","font-family","line-height","letter-spacing","word-spacing","white-space","vertical-align","margin-left","margin-right","margin-top","margin-bottom","padding-left","padding-right","padding-top","padding-bottom","text-indent","border","border-top","border-right","border-bottom","border-left","border-color","border-width","border-style","list-style-type"]),n0={panelTitle:"Smart Paste",panelAriaLabel:"Smart paste panel",enabledText:"Smart paste is enabled",disabledText:"Smart paste is disabled",toggleOnText:"Disable Smart Paste",toggleOffText:"Enable Smart Paste",cycleProfileText:"Cycle Profile",profileLabel:"Profile",fidelityText:"Fidelity",balancedText:"Balanced",plainText:"Plain Text",lastPasteHeading:"Last Paste Result",lastPasteEmptyText:"Paste content to see cleanup metrics.",lastPasteSourceLabel:"Source",lastPasteProfileLabel:"Profile",lastPasteRemovedLabel:"Removed",lastPasteCharsLabel:"Output Chars",closeText:"Close",shortcutText:"Shortcuts: Ctrl/Cmd+Alt+Shift+S/V/G",readonlyMessage:"Editor is read-only. Smart paste was skipped."},ns={fidelity:{keepStyles:!0,keepClasses:!1,keepDataAttributes:!1,preserveTables:!0},balanced:{keepStyles:!1,keepClasses:!1,keepDataAttributes:!1,preserveTables:!0},plain:{keepStyles:!1,keepClasses:!1,keepDataAttributes:!1,preserveTables:!1}},q=new WeakMap,eo=new WeakMap,Fe=new Map,Ia=new WeakMap,rl=new WeakMap,ga=new Set;let oi=0,r0=0,to=null,Me=null,Lr=null,Ar=null,dn=null,Mr=null;function rs(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function o0(e){return e.replace(/\u00A0/g," ").replace(/\r\n?/g,`
`)}function ba(e){return e==="balanced"||e==="plain"?e:"fidelity"}function os(e,t){return{keepStyles:(e==null?void 0:e.keepStyles)??t.keepStyles,keepClasses:(e==null?void 0:e.keepClasses)??t.keepClasses,keepDataAttributes:(e==null?void 0:e.keepDataAttributes)??t.keepDataAttributes,preserveTables:(e==null?void 0:e.preserveTables)??t.preserveTables}}function Li(e={}){const t=e.profileOptions||{};return{enabled:e.enabled!==!1,defaultProfile:ba(e.defaultProfile),maxHtmlLength:Math.max(8e3,Math.min(8e5,Number(e.maxHtmlLength??22e4))),removeComments:e.removeComments!==!1,normalizeWhitespace:e.normalizeWhitespace!==!1,labels:{...n0,...e.labels||{}},normalizeText:e.normalizeText||o0,profileOptions:{fidelity:os(t.fidelity,ns.fidelity),balanced:os(t.balanced,ns.balanced),plain:os(t.plain,ns.plain)}}}function Cd(e){return{enabled:e.enabled,defaultProfile:e.defaultProfile,maxHtmlLength:e.maxHtmlLength,removeComments:e.removeComments,normalizeWhitespace:e.normalizeWhitespace,labels:{...e.labels},normalizeText:e.normalizeText,profileOptions:{fidelity:{...e.profileOptions.fidelity},balanced:{...e.profileOptions.balanced},plain:{...e.profileOptions.plain}}}}function mc(e){return e.closest(pc)||e}function ha(e){if(!e)return null;if(e.matches(et))return e;const t=e.querySelector(et);return t instanceof HTMLElement?t:null}function a0(){if(typeof window>"u")return null;const e=window[kd];if(!(e instanceof HTMLElement))return null;window[kd]=null;const t=ha(e);if(t)return t;const n=e.closest(pc);if(n){const o=ha(n);if(o)return o}const r=e.closest(et);return r instanceof HTMLElement?r:null}function i0(e){const t=e.closest("[data-editora-editor]");if(t&&ha(t)===e)return t;let n=e;for(;n;){if(n.matches(pc)&&(n===e||ha(n)===e))return n;n=n.parentElement}return mc(e)}function vm(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function Qt(e,t=!0,n=!0){if(Ai(),(e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const i=ha(e.editorElement);if(i)return i}const r=a0();if(r)return r;const o=window.getSelection();if(o&&o.rangeCount>0){const i=vm(o.getRangeAt(0).startContainer),l=i==null?void 0:i.closest(et);if(l)return l}const a=document.activeElement;if(a){if(a.matches(et))return a;const i=a.closest(et);if(i)return i}if(n){if(Me&&Me.isConnected)return Me;Me&&!Me.isConnected&&(Me=null)}return t?document.querySelector(et):null}function l0(e){const t=e.target;if(t){const r=t.closest(et);if(r)return r}const n=window.getSelection();if(n&&n.rangeCount>0){const r=vm(n.getRangeAt(0).startContainer),o=r==null?void 0:r.closest(et);if(o)return o}return null}function ai(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function s0(e){const t=mc(e);if(ai(t))return!0;const n=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return ai(n)?!0:ai(document.documentElement)||ai(document.body)}function ol(e,t){e.classList.remove("rte-smart-paste-theme-dark"),s0(t)&&e.classList.add("rte-smart-paste-theme-dark")}function Sd(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function ya(e,t,n){const r=i0(e);Array.from(r.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",n),a.setAttribute("data-active",n?"true":"false"),a.setAttribute("aria-pressed",n?"true":"false")})}function Ce(e,t){q.has(e)||q.set(e,t);let n=eo.get(e);return n||(n={enabled:t.enabled,profile:t.defaultProfile,lastReport:null},eo.set(e,n)),T0(e),ga.add(e),n}function km(e){const t=rl.get(e);t&&(e.removeEventListener("paste",t,!0),rl.delete(e))}function wm(e){var t;km(e),(t=Fe.get(e))==null||t.remove(),Fe.delete(e),Ia.delete(e),q.delete(e),eo.delete(e),ga.delete(e),Me===e&&(Me=null)}function Ai(){Array.from(ga).forEach(t=>{t.isConnected||wm(t)})}function c0(e){var t,n,r,o;for(let a=0;a<e.length;a+=1){const i=e[a];if(!(i.type!=="childList"||i.removedNodes.length===0))for(let l=0;l<i.removedNodes.length;l+=1){const s=i.removedNodes[l];if(s.nodeType!==Node.ELEMENT_NODE)continue;const c=s;if((t=c.matches)!=null&&t.call(c,et)||(n=c.matches)!=null&&n.call(c,`.${j}`)||(r=c.querySelector)!=null&&r.call(c,et)||(o=c.querySelector)!=null&&o.call(c,`.${j}`))return!0}}return!1}function gc(e){return Ia.get(e)===!0}function Yo(e,t){const n=e.querySelector(".rte-smart-paste-live");n&&(n.textContent=t)}function as(e,t){const n=t.normalizeText(e);return t.normalizeWhitespace?n.split(`
`).map(o=>o.replace(/[\t ]+/g," ").trimEnd()).join(`
`).replace(/\n{3,}/g,`

`).trim():n}function d0(e){return/class=["'][^"']*Mso|xmlns:w=|urn:schemas-microsoft-com:office|<o:p\b/i.test(e)}function u0(e){return/id=["']docs-internal-guid|docs-\w+|data-sheets-value|data-sheets-userformat/i.test(e)}function f0(e,t){return e?d0(e)?"word":u0(e)?"google-docs":"html":t?"plain":"html"}function p0(e){return e.split(/\s+/).map(n=>n.trim()).filter(Boolean).filter(n=>!/^mso/i.test(n)).filter(n=>!/^docs-/i.test(n)).filter(n=>!/^c\d+$/i.test(n)).join(" ")}function m0(e){if(!e)return{value:"",changed:!1};const t=e.split(";"),n=[];let r=!1;return t.forEach(o=>{const a=o.indexOf(":");if(a<=0){o.trim()&&(r=!0);return}const i=o.slice(0,a).trim().toLowerCase(),l=o.slice(a+1).trim();if(!i||!l){r=!0;return}if(!t0.has(i)){r=!0;return}if(/expression\s*\(|javascript\s*:|vbscript\s*:|url\s*\(/i.test(l)){r=!0;return}n.push(`${i}: ${l}`)}),{value:n.join("; "),changed:r}}function Td(e){const t=e.trim();return t&&(Qx.test(t)||e0.test(t))?t:""}function $d(e){const t=e.parentNode;if(t){for(;e.firstChild;)t.insertBefore(e.firstChild,e);t.removeChild(e)}}function g0(e,t,n,r){const o=e.tagName.toLowerCase();if(Yx.has(o)){r.removedElements+=1,e.remove();return}if(!t.preserveTables&&Xx.has(o)){const i=e.textContent||"",l=document.createTextNode(i);e.replaceWith(l),r.removedElements+=1;return}if(Array.from(e.attributes).forEach(i=>{const l=i.name.toLowerCase(),s=i.value;if(l.startsWith("on")){e.removeAttribute(i.name),r.removedAttributes+=1;return}if(l==="style"){if(!t.keepStyles){e.removeAttribute(i.name),r.removedAttributes+=1;return}const c=m0(s);if(!c.value){e.removeAttribute(i.name),r.removedAttributes+=1,c.changed&&(r.normalizedStyles+=1);return}(c.changed||c.value!==s)&&(e.setAttribute("style",c.value),r.normalizedStyles+=1);return}if(l==="class"){if(!t.keepClasses){e.removeAttribute(i.name),r.removedAttributes+=1;return}const c=p0(s);if(!c){e.removeAttribute(i.name),r.removedAttributes+=1;return}c!==s&&(e.setAttribute("class",c),r.removedAttributes+=1);return}if(l.startsWith("data-")&&!t.keepDataAttributes){e.removeAttribute(i.name),r.removedAttributes+=1;return}if(l==="id"||l==="xmlns"||l.startsWith("xml")){e.removeAttribute(i.name),r.removedAttributes+=1;return}if((n==="word"||n==="google-docs")&&(l==="lang"||l==="dir")){e.removeAttribute(i.name),r.removedAttributes+=1;return}if(l==="href"||l==="src"||l==="xlink:href"){const c=Td(s);if(!c){e.removeAttribute(i.name),r.removedAttributes+=1;return}c!==s&&e.setAttribute(i.name,c)}}),o==="a"){if(!e.getAttribute("href")){$d(e),r.removedElements+=1;return}e.getAttribute("target")==="_blank"&&e.setAttribute("rel","noopener noreferrer")}if(o==="img"){const i=e.getAttribute("src");if(!i||!Td(i)){r.removedElements+=1,e.remove();return}}if(Jx.has(o)&&!e.attributes.length&&!e.className&&!e.style.cssText){const i=e.children.length>0,l=(e.textContent||"").trim().length>0;if(!i&&!l){e.remove(),r.removedElements+=1;return}!i&&l&&($d(e),r.removedElements+=1)}}function b0(e,t,n,r,o){const a=document.createElement("template");a.innerHTML=e;const i={removedElements:0,removedAttributes:0,removedComments:0,normalizedStyles:0};if(r.removeComments)try{const d=document.createTreeWalker(a.content,Zx,null),u=[];let f=d.nextNode();for(;f;)u.push(f),f=d.nextNode();u.forEach(m=>{m.remove(),i.removedComments+=1})}catch{}Array.from(a.content.querySelectorAll("*")).forEach(d=>{d.isConnected&&g0(d,t,n,i)});let s=a.innerHTML;r.normalizeWhitespace&&o!=="fidelity"?s=s.replace(/\s{2,}/g," ").replace(/>\s+</g,"><").trim():r.normalizeWhitespace&&(s=s.trim());const c=(a.content.textContent||"").trim().length;return{html:s,textLength:c,counters:i}}function Em(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const n=t.getRangeAt(0);return e.contains(n.commonAncestorContainer)?n:null}function Cm(e,t){if(!e.isConnected)return;const n=window.getSelection();n&&(n.removeAllRanges(),n.addRange(t))}function h0(e,t){e.focus({preventScroll:!0});try{if(document.execCommand("insertHTML",!1,t))return!0}catch{}const n=Em(e);if(!n)return!1;n.deleteContents();const r=document.createElement("template");r.innerHTML=t;const o=r.content,a=o.lastChild;if(n.insertNode(o),a){const i=document.createRange();i.setStartAfter(a),i.collapse(!0),Cm(e,i)}return!0}function y0(e,t){e.focus({preventScroll:!0});try{if(document.execCommand("insertText",!1,t))return!0}catch{}const n=Em(e);if(!n)return!1;n.deleteContents();const r=document.createTextNode(t);n.insertNode(r);const o=document.createRange();return o.setStart(r,r.length),o.collapse(!0),Cm(e,o),!0}function x0(e,t){if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}}function v0(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function ii(e,t,n,r,o,a){return{source:e,profile:t,inputHtmlLength:n,outputHtmlLength:r,outputTextLength:o,removedElements:a.removedElements,removedAttributes:a.removedAttributes,removedComments:a.removedComments,normalizedStyles:a.normalizedStyles,createdAt:new Date().toISOString()}}function k0(e,t,n,r){const o=f0(e,t);if(n==="plain"){const l=t||e.replace(/<[^>]*>/g," "),s=as(l,r);return{mode:"text",value:s,report:ii(o,n,e.length,0,s.length,{removedElements:0,removedAttributes:0,removedComments:0,normalizedStyles:0})}}if(!e||e.length>r.maxHtmlLength){const l=as(t||e.replace(/<[^>]*>/g," "),r);return{mode:"text",value:l,report:ii(o,n,e.length,0,l.length,{removedElements:0,removedAttributes:0,removedComments:0,normalizedStyles:0})}}const a=r.profileOptions[n],i=b0(e,a,o,r,n);if(!i.html){const l=as(t||e.replace(/<[^>]*>/g," "),r);return{mode:"text",value:l,report:ii(o,n,e.length,0,l.length,i.counters)}}return{mode:"html",value:i.html,report:ii(o,n,e.length,i.html.length,i.textLength,i.counters)}}function al(e,t){return e==="balanced"?t.balancedText:e==="plain"?t.plainText:t.fidelityText}function bc(e){return e==="fidelity"?"balanced":e==="balanced"?"plain":"fidelity"}function w0(e,t){e.setAttribute("aria-label",t.labels.panelAriaLabel);const n=e.querySelector(".rte-smart-paste-title");n&&(n.textContent=t.labels.panelTitle);const r=e.querySelector('[data-action="close"]');r&&r.setAttribute("aria-label",t.labels.closeText);const o=e.querySelector('[data-action="toggle-enabled"]');if(o){const x=o.getAttribute("data-enabled")==="true";o.textContent=x?t.labels.toggleOnText:t.labels.toggleOffText}const a=e.querySelector('[data-action="cycle-profile"]');a&&(a.textContent=t.labels.cycleProfileText);const i=e.querySelector(".rte-smart-paste-profile-heading");i&&(i.textContent=t.labels.profileLabel);const l=e.querySelector('.rte-smart-paste-profile[role="group"]');l&&l.setAttribute("aria-label",t.labels.profileLabel);const s=e.querySelector('[data-action="set-profile"][data-profile="fidelity"]');s&&(s.textContent=t.labels.fidelityText);const c=e.querySelector('[data-action="set-profile"][data-profile="balanced"]');c&&(c.textContent=t.labels.balancedText);const d=e.querySelector('[data-action="set-profile"][data-profile="plain"]');d&&(d.textContent=t.labels.plainText);const u=e.querySelector(".rte-smart-paste-report-title");u&&(u.textContent=t.labels.lastPasteHeading);const f=e.querySelector(".rte-smart-paste-empty");f&&(f.textContent=t.labels.lastPasteEmptyText);const m=e.querySelector('[data-key="source-label"]');m&&(m.textContent=t.labels.lastPasteSourceLabel);const g=e.querySelector('[data-key="profile-label"]');g&&(g.textContent=t.labels.lastPasteProfileLabel);const p=e.querySelector('[data-key="removed-label"]');p&&(p.textContent=t.labels.lastPasteRemovedLabel);const b=e.querySelector('[data-key="chars-label"]');b&&(b.textContent=t.labels.lastPasteCharsLabel);const h=e.querySelector(".rte-smart-paste-shortcut");h&&(h.textContent=t.labels.shortcutText)}function tt(e){const t=Fe.get(e),n=q.get(e)||to,r=eo.get(e);if(!t||!n||!r)return;w0(t,n);const o=t.querySelector(".rte-smart-paste-status");o&&(o.textContent=r.enabled?n.labels.enabledText:n.labels.disabledText);const a=t.querySelector('[data-action="toggle-enabled"]');a&&(a.setAttribute("data-enabled",r.enabled?"true":"false"),a.textContent=r.enabled?n.labels.toggleOnText:n.labels.toggleOffText,a.setAttribute("aria-pressed",r.enabled?"true":"false")),Array.from(t.querySelectorAll('[data-action="set-profile"][data-profile]')).forEach(m=>{const p=ba(m.getAttribute("data-profile"))===r.profile;m.classList.toggle("active",p),m.setAttribute("aria-pressed",p?"true":"false")});const l=t.querySelector(".rte-smart-paste-empty"),s=t.querySelector(".rte-smart-paste-report"),c=t.querySelector('[data-key="source-value"]'),d=t.querySelector('[data-key="profile-value"]'),u=t.querySelector('[data-key="removed-value"]'),f=t.querySelector('[data-key="chars-value"]');if(!r.lastReport){l&&(l.hidden=!1),s&&(s.hidden=!0);return}if(l&&(l.hidden=!0),s&&(s.hidden=!1),c&&(c.textContent=r.lastReport.source),d&&(d.textContent=al(r.lastReport.profile,n.labels)),u){const m=r.lastReport.removedElements+r.lastReport.removedAttributes+r.lastReport.removedComments+r.lastReport.normalizedStyles;u.textContent=String(m)}f&&(f.textContent=String(r.lastReport.outputTextLength))}function $s(e,t){if(!t.classList.contains("show"))return;const n=mc(e).getBoundingClientRect(),r=Math.min(window.innerWidth-20,360),o=Math.max(10,window.innerWidth-r-10),a=Math.min(Math.max(10,n.right-r),o),i=Math.max(10,Math.min(window.innerHeight-10,n.top+12));t.style.width=`${r}px`,t.style.left=`${a}px`,t.style.top=`${i}px`,t.style.maxHeight=`${Math.max(240,window.innerHeight-20)}px`}function xa(e,t=!1){const n=Fe.get(e);n&&(n.classList.remove("show"),Ia.set(e,!1),ya(e,"toggleSmartPastePanel",!1),t&&e.focus({preventScroll:!0}))}function E0(e){const t=Fe.get(e);if(t)return t;const n=q.get(e)||to||Li(),r=`rte-smart-paste-panel-${r0++}`,o=document.createElement("section");return o.className=j,o.id=r,o.setAttribute("role","dialog"),o.setAttribute("aria-modal","false"),o.setAttribute("aria-label",n.labels.panelAriaLabel),o.innerHTML=`
    <header class="rte-smart-paste-header">
      <h2 class="rte-smart-paste-title">${rs(n.labels.panelTitle)}</h2>
      <button type="button" class="rte-smart-paste-icon-btn" data-action="close" aria-label="${rs(n.labels.closeText)}">✕</button>
    </header>
    <div class="rte-smart-paste-body">
      <p class="rte-smart-paste-status"></p>
      <div class="rte-smart-paste-controls">
        <button type="button" class="rte-smart-paste-btn rte-smart-paste-btn-primary" data-action="toggle-enabled" data-enabled="true"></button>
        <button type="button" class="rte-smart-paste-btn" data-action="cycle-profile"></button>
      </div>
      <div class="rte-smart-paste-profile" role="group" aria-label="${rs(n.labels.profileLabel)}">
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
  `,o.addEventListener("click",a=>{const i=a.target,l=i==null?void 0:i.closest("[data-action]");if(!l)return;const s=l.getAttribute("data-action");if(s){if(s==="close"){xa(e,!0);return}if(s==="toggle-enabled"){const c=Ce(e,q.get(e)||n);c.enabled=!c.enabled,ya(e,"toggleSmartPasteEnabled",c.enabled),tt(e),Yo(o,c.enabled?n.labels.enabledText:n.labels.disabledText);return}if(s==="cycle-profile"){const c=Ce(e,q.get(e)||n);c.profile=bc(c.profile),tt(e),Yo(o,`${n.labels.profileLabel}: ${al(c.profile,n.labels)}`);return}if(s==="set-profile"){const c=Ce(e,q.get(e)||n);c.profile=ba(l.getAttribute("data-profile")),tt(e),Yo(o,`${n.labels.profileLabel}: ${al(c.profile,n.labels)}`)}}}),o.addEventListener("keydown",a=>{if(a.key==="Escape"){a.preventDefault(),xa(e,!0);return}if(a.key!=="ArrowRight"&&a.key!=="ArrowLeft")return;const i=Array.from(o.querySelectorAll('[data-action="set-profile"][data-profile]'));if(i.length===0)return;const l=i.findIndex(d=>d===document.activeElement);if(l<0)return;const s=a.key==="ArrowRight"?1:-1,c=(l+s+i.length)%i.length;a.preventDefault(),i[c].focus()}),ol(o,e),document.body.appendChild(o),Fe.set(e,o),Ia.set(e,!1),tt(e),o}function Sm(e){const t=E0(e);Fe.forEach((r,o)=>{o!==e&&xa(o,!1)}),t.classList.add("show"),Ia.set(e,!0),ya(e,"toggleSmartPastePanel",!0),ol(t,e),$s(e,t);const n=t.querySelector('[data-action="toggle-enabled"]');n==null||n.focus()}function Tm(e,t){const n=gc(e);return(typeof t=="boolean"?t:!n)?Sm(e):xa(e,!1),!0}function $m(e){return{enabled:e.enabled,profile:e.profile,lastReport:e.lastReport?{...e.lastReport}:null}}function C0(e,t){const n=q.get(e)||to;if(!n)return!1;const r=Ce(e,n);if(!r.enabled||Sd(e)){const u=Fe.get(e);return u&&Sd(e)&&Yo(u,n.labels.readonlyMessage),!1}const o=t.clipboardData;if(!o)return!1;const a=o.getData("text/html")||"",i=o.getData("text/plain")||"";if(!a&&!i)return!1;const l=k0(a,i,r.profile,n);if(!l.value)return!1;const s=e.innerHTML;if(!(l.mode==="html"?h0(e,l.value):y0(e,l.value)))return!1;r.lastReport={...l.report},eo.set(e,r),x0(e,s),v0(e),e.dispatchEvent(new CustomEvent("editora:smart-paste",{bubbles:!0,detail:$m(r)})),tt(e);const d=Fe.get(e);if(d){const u=l.report.removedElements+l.report.removedAttributes+l.report.removedComments+l.report.normalizedStyles;Yo(d,`${n.labels.panelTitle}: ${al(r.profile,n.labels)}. ${n.labels.lastPasteRemovedLabel}: ${u}.`)}return!0}function S0(e){return t=>{t.defaultPrevented||t[Ed]===!0||(Me=e,!C0(e,t))||(t[Ed]=!0,t.preventDefault(),typeof t.stopImmediatePropagation=="function"?t.stopImmediatePropagation():t.stopPropagation())}}function T0(e){if(rl.has(e))return;const t=S0(e);e.addEventListener("paste",t,!0),rl.set(e,t)}function Xo(e){const t=eo.get(e);ya(e,"toggleSmartPastePanel",gc(e)),ya(e,"toggleSmartPasteEnabled",(t==null?void 0:t.enabled)===!0)}function $0(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="s"}function L0(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="v"}function A0(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="g"}function M0(e){to=e,Lr||(Lr=t=>{Ai();const n=t.target,r=n==null?void 0:n.closest(et);if(!r)return;const o=q.get(r)||e;Ce(r,o),q.set(r,o),Me=r,Xo(r);const a=Fe.get(r);a&&(ol(a,r),$s(r,a),tt(r))},document.addEventListener("focusin",Lr,!0)),Ar||(Ar=t=>{if(t.defaultPrevented)return;const n=t.target;if(n!=null&&n.closest(`.${j} input, .${j} textarea, .${j} select`))return;const r=l0(t);if(!r)return;const o=q.get(r)||to||e;if(Ce(r,o),q.set(r,o),Me=r,t.key==="Escape"&&gc(r)){t.preventDefault(),xa(r,!0);return}if($0(t)){t.preventDefault(),t.stopPropagation(),Tm(r);return}if(L0(t)){t.preventDefault(),t.stopPropagation();const a=Ce(r,o);a.profile=bc(a.profile),tt(r);return}if(A0(t)){t.preventDefault(),t.stopPropagation();const a=Ce(r,o);a.enabled=!a.enabled,Xo(r),tt(r)}},document.addEventListener("keydown",Ar,!0)),dn||(dn=()=>{Ai(),Fe.forEach((t,n)=>{!n.isConnected||!t.isConnected||(ol(t,n),$s(n,t))})},window.addEventListener("scroll",dn,!0),window.addEventListener("resize",dn)),!Mr&&typeof MutationObserver<"u"&&document.body&&(Mr=new MutationObserver(t=>{c0(t)&&Ai()}),Mr.observe(document.body,{childList:!0,subtree:!0}))}function R0(){Lr&&(document.removeEventListener("focusin",Lr,!0),Lr=null),Ar&&(document.removeEventListener("keydown",Ar,!0),Ar=null),dn&&(window.removeEventListener("scroll",dn,!0),window.removeEventListener("resize",dn),dn=null),Mr&&(Mr.disconnect(),Mr=null),Fe.forEach(e=>e.remove()),Fe.clear(),ga.forEach(e=>km(e)),ga.clear(),to=null,Me=null}function D0(){if(typeof document>"u"||document.getElementById(wd))return;const e=document.createElement("style");e.id=wd,e.textContent=`
    .rte-toolbar-group-items.${Ue},
    .editora-toolbar-group-items.${Ue},
    .rte-toolbar-group-items.${gt},
    .editora-toolbar-group-items.${gt} {
      display: flex;
      border: 1px solid #ccc;
      border-radius: 3px;
      background: #fff;
    }

    .rte-toolbar-group-items.${Ue} .rte-toolbar-button,
    .editora-toolbar-group-items.${Ue} .editora-toolbar-button,
    .rte-toolbar-group-items.${gt} .rte-toolbar-button,
    .editora-toolbar-group-items.${gt} .editora-toolbar-button {
      border: none;
      border-right: 1px solid #ccc;
      border-radius: 0;
    }

    .rte-toolbar-group-items.${Ue} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${Ue} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${gt} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${gt} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    .rte-toolbar-button[data-command="toggleSmartPasteEnabled"].active,
    .editora-toolbar-button[data-command="toggleSmartPasteEnabled"].active {
      background-color: #ccc;
    }

    ${bt} .rte-toolbar-group-items.${Ue},
    ${bt} .editora-toolbar-group-items.${Ue},
    ${bt} .rte-toolbar-group-items.${gt},
    ${bt} .editora-toolbar-group-items.${gt},
    .${j}.rte-smart-paste-theme-dark {
      border-color: #566275;
    }

    ${bt} .rte-toolbar-group-items.${Ue} .rte-toolbar-button svg,
    ${bt} .editora-toolbar-group-items.${Ue} .editora-toolbar-button svg,
    ${bt} .rte-toolbar-group-items.${gt} .rte-toolbar-button svg,
    ${bt} .editora-toolbar-group-items.${gt} .editora-toolbar-button svg {
      fill: none;
    }

    ${bt} .rte-toolbar-group-items.${Ue} .rte-toolbar-button,
    ${bt} .editora-toolbar-group-items.${Ue} .editora-toolbar-button
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
  `,document.head.appendChild(e)}const N0=(e={})=>{const t=Li(e),n=new Set;return D0(),{name:"smartPaste",toolbar:[{id:"smartPasteGroup",label:"Smart Paste",type:"group",command:"smartPaste",items:[{id:"smartPaste",label:"Smart Paste Panel",command:"toggleSmartPastePanel",shortcut:"Mod-Alt-Shift-s",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M8.5 4.5h7l3 3V18a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6.5 18V7a2.5 2.5 0 0 1 2-2.45Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M15.5 4.5V8h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.3 12h5.4M9.3 15h5.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'},{id:"smartPasteProfile",label:"Cycle Smart Paste Profile",command:"cycleSmartPasteProfile",shortcut:"Mod-Alt-Shift-v",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4.5 7.5h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="17.5" cy="7.5" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 12h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12.5" cy="12" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 16.5h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="9.5" cy="16.5" r="2" stroke="currentColor" stroke-width="1.6"/></svg>'},{id:"smartPasteToggle",label:"Toggle Smart Paste",command:"toggleSmartPasteEnabled",shortcut:"Mod-Alt-Shift-g",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="3.5" y="8" width="17" height="8" rx="4" stroke="currentColor" stroke-width="1.6"/><circle cx="8" cy="12" r="2.6" fill="currentColor"/><path d="M14.5 12h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'}]}],commands:{smartPaste:(r,o)=>{const a=Qt(o,!1,!1);if(!a)return!1;const i=q.get(a)||t;return Ce(a,i),q.set(a,i),Me=a,Sm(a),!0},toggleSmartPastePanel:(r,o)=>{const a=Qt(o,!1,!1);if(!a)return!1;const i=q.get(a)||t;return Ce(a,i),q.set(a,i),Me=a,Tm(a,typeof r=="boolean"?r:void 0)},cycleSmartPasteProfile:(r,o)=>{const a=Qt(o,!1,!1);if(!a)return!1;const i=q.get(a)||t,l=Ce(a,i);return q.set(a,i),l.profile=bc(l.profile),tt(a),!0},setSmartPasteProfile:(r,o)=>{const a=Qt(o,!1,!1);if(!a)return!1;const i=q.get(a)||t,l=Ce(a,i);return q.set(a,i),l.profile=ba(r),tt(a),!0},toggleSmartPasteEnabled:(r,o)=>{const a=Qt(o,!1,!1);if(!a)return!1;const i=q.get(a)||t,l=Ce(a,i);return q.set(a,i),l.enabled=typeof r=="boolean"?r:!l.enabled,Xo(a),tt(a),!0},setSmartPasteOptions:(r,o)=>{var d,u,f,m,g,p;const a=Qt(o,!1,!1);if(!a||!r||typeof r!="object")return!1;const i=q.get(a)||t,l=Cd(i),s=Li({...l,...r,labels:{...i.labels,...r.labels||{}},profileOptions:{...l.profileOptions,...r.profileOptions||{},fidelity:{...((d=l.profileOptions)==null?void 0:d.fidelity)||{},...((u=r.profileOptions)==null?void 0:u.fidelity)||{}},balanced:{...((f=l.profileOptions)==null?void 0:f.balanced)||{},...((m=r.profileOptions)==null?void 0:m.balanced)||{}},plain:{...((g=l.profileOptions)==null?void 0:g.plain)||{},...((p=r.profileOptions)==null?void 0:p.plain)||{}}},normalizeText:r.normalizeText||i.normalizeText});q.set(a,s);const c=Ce(a,s);return typeof r.enabled=="boolean"&&(c.enabled=r.enabled),r.defaultProfile&&(c.profile=ba(r.defaultProfile)),tt(a),Xo(a),!0},getSmartPasteState:(r,o)=>{const a=Qt(o,!1,!1);if(!a)return!1;const i=q.get(a)||t,l=Ce(a,i),s=$m(l);if(typeof r=="function")try{r(s)}catch{}return a.__smartPasteState=s,a.dispatchEvent(new CustomEvent("editora:smart-paste-state",{bubbles:!0,detail:s})),!0}},keymap:{"Mod-Alt-Shift-s":"toggleSmartPastePanel","Mod-Alt-Shift-S":"toggleSmartPastePanel","Mod-Alt-Shift-v":"cycleSmartPasteProfile","Mod-Alt-Shift-V":"cycleSmartPasteProfile","Mod-Alt-Shift-g":"toggleSmartPasteEnabled","Mod-Alt-Shift-G":"toggleSmartPasteEnabled"},init:function(o){oi+=1;const a=this&&typeof this.__pluginConfig=="object"?Li({...Cd(t),...this.__pluginConfig}):t;M0(a);const i=Qt(o!=null&&o.editorElement?{editorElement:o.editorElement}:void 0,!1,!1);if(!i)return;Me=i,n.add(i);const l=Ce(i,a);l.enabled=a.enabled,l.profile=a.defaultProfile,q.set(i,a),Xo(i)},destroy:()=>{n.forEach(r=>wm(r)),n.clear(),oi=Math.max(0,oi-1),!(oi>0)&&R0()}}},nt=".rte-content, .editora-content",hc="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",Ld="__editoraCommandEditorRoot",Ad="rte-blocks-library-styles",B="rte-blocks-library-panel",Ge="blocks-library",ht="blocksLibrary",yt=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',B0=80,Lm=new Set(["script","style","meta","link","object","embed","iframe"]),P0=/^(https?:|mailto:|tel:|#|\/)/i,I0=/^data:image\/(?:png|gif|jpeg|jpg|webp);base64,/i,H0={panelTitle:"Blocks Library",panelAriaLabel:"Blocks library panel",searchLabel:"Search blocks",searchPlaceholder:"Search by name, category, or keyword",categoryLabel:"Category",allCategoriesText:"All categories",recentHeading:"Recent inserts",insertText:"Insert Selected",closeText:"Close",noResultsText:"No matching blocks found.",summaryPrefix:"Blocks",loadingText:"Loading blocks...",loadErrorText:"Unable to load blocks right now.",readonlyMessage:"Editor is read-only. Block insertion is disabled.",shortcutText:"Shortcuts: Ctrl/Cmd+Alt+Shift+B (panel), Ctrl/Cmd+Alt+Shift+L (insert last)",helperText:"Use Arrow keys to move through blocks, Enter to insert, Esc to close.",lastInsertedPrefix:"Last inserted",resultsListLabel:"Block results"},I=new WeakMap,Mi=new WeakMap,je=new WeakMap,yn=new WeakMap,no=new WeakMap,Io=new WeakMap,Jo=new WeakMap,Xn=new WeakMap,nr=new WeakMap,il=new WeakMap,ze=new Map,Ha=new WeakMap,Ml=new Set;let li=0,O0=0,Md=0,Yt=null,we=null,Rr=null,Dr=null,un=null,Nr=null;function ve(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function z0(e){return e.replace(/\u00A0/g," ").replace(/\s+/g," ").trim()}function q0(e){return e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)}function Ls(e){const t=e.trim();return t&&(P0.test(t)||I0.test(t))?t:""}function Rd(e){let t=e;return Lm.forEach(n=>{const r=new RegExp(`<${n}[\\s\\S]*?>[\\s\\S]*?<\\/${n}>`,"gi"),o=new RegExp(`<${n}\\b[^>]*\\/?>`,"gi");t=t.replace(r,"").replace(o,"")}),t=t.replace(/\son\w+=(\"[^\"]*\"|'[^']*'|[^\s>]+)/gi,"").replace(/\s(xmlns|xml:[^=\s>]+)\s*=\s*(\"[^\"]*\"|'[^']*'|[^\s>]+)/gi,"").replace(/\s(href|src|xlink:href)\s*=\s*("|\')\s*(?:javascript:|vbscript:|data:text\/html)[^"']*\2/gi,"").replace(/\s(href|src|xlink:href)\s*=\s*(?:javascript:|vbscript:|data:text\/html)[^\s>]*/gi,"").replace(/\s(href|src|xlink:href)\s*=\s*("([^"]*)"|'([^']*)')/gi,(n,r,o,a,i)=>{const l=typeof a=="string"&&a.length>0?a:i||"",s=Ls(l);if(!s)return"";const c=o.startsWith('"')?'"':"'";return` ${r}=${c}${s}${c}`}).replace(/\s(href|src|xlink:href)\s*=\s*([^\s>]+)/gi,(n,r,o)=>{const a=Ls(o);return a?` ${r}="${a}"`:""}).replace(/\sstyle\s*=\s*("([^"]*)"|'([^']*)')/gi,(n,r,o,a)=>{const i=typeof o=="string"&&o.length>0?o:a||"";if(/expression\s*\(|javascript\s*:|vbscript\s*:|url\s*\(/i.test(i))return"";const l=r.startsWith('"')?'"':"'";return` style=${l}${i}${l}`}).trim(),t}function _0(e){if(!e)return"";if(typeof document>"u")return Rd(e);const t=document.createElement("template");t.innerHTML=e;const n=t.content;return!n||typeof n.querySelectorAll!="function"?Rd(e):(Array.from(n.querySelectorAll("*")).forEach(o=>{const a=o.tagName.toLowerCase();if(Lm.has(a)){o.remove();return}Array.from(o.attributes).forEach(l=>{const s=l.name.toLowerCase(),c=l.value;if(s.startsWith("on")){o.removeAttribute(l.name);return}if(s==="style"){/expression\s*\(|javascript\s*:|vbscript\s*:|url\s*\(/i.test(c)&&o.removeAttribute(l.name);return}if(s==="href"||s==="src"||s==="xlink:href"){const d=Ls(c);if(!d){o.removeAttribute(l.name);return}d!==c&&o.setAttribute(l.name,d)}})}),t.innerHTML.trim())}function Rl(e){return e.trim().toLowerCase()}function F0(e){if(!e)return"";if(typeof document>"u")return e.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();const t=document.createElement("template");t.innerHTML=e;const n=t.content;return!n||typeof n.textContent!="string"?e.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim():n.textContent.replace(/\s+/g," ").trim()}function Am(e,t){if(!Array.isArray(e)||e.length===0)return[];const n=new Set,r=[];return e.forEach(o=>{const a=t.normalizeText(o.label||""),i=t.sanitizeBlockHtml(o.html||"",o).trim();if(!a||!i)return;const l=t.normalizeText(o.category||"General")||"General",s=Rl(l);let d=q0(t.normalizeText(o.id||a))||`block-${Md++}`;for(;n.has(d);)d=`${d}-${Md++}`;n.add(d);const u=(o.tags||[]).map(b=>t.normalizeText(b)).filter(Boolean),f=(o.keywords||[]).map(b=>t.normalizeText(b)).filter(Boolean),m=t.normalizeText(o.description||""),g=F0(i),p=[a,m,l,...u,...f,g].join(" ").toLowerCase();r.push({id:d,label:a,html:i,description:m,category:l,categoryKey:s,tags:u,keywords:f,previewText:g,searchBlob:p})}),r}function Ri(e={}){const t=e.normalizeText||z0,n=e.sanitizeBlockHtml||_0,r={blocks:[],defaultCategory:t(e.defaultCategory||""),maxResults:Math.max(4,Math.min(300,Number(e.maxResults??80))),maxRecentBlocks:Math.max(1,Math.min(20,Number(e.maxRecentBlocks??6))),debounceMs:Math.max(0,Math.min(700,Number(e.debounceMs??90))),cacheTtlMs:Math.max(0,Number(e.cacheTtlMs??6e4)),labels:{...H0,...e.labels||{}},normalizeText:t,sanitizeBlockHtml:n,getBlocks:typeof e.getBlocks=="function"?e.getBlocks:void 0};return r.blocks=Am(e.blocks,r),r}function j0(e){return{blocks:e.blocks.map(t=>({id:t.id,label:t.label,html:t.html,description:t.description||void 0,category:t.category||void 0,tags:t.tags.length?[...t.tags]:void 0,keywords:t.keywords.length?[...t.keywords]:void 0})),defaultCategory:e.defaultCategory,maxResults:e.maxResults,maxRecentBlocks:e.maxRecentBlocks,debounceMs:e.debounceMs,cacheTtlMs:e.cacheTtlMs,labels:{...e.labels},normalizeText:e.normalizeText,sanitizeBlockHtml:e.sanitizeBlockHtml,getBlocks:e.getBlocks}}function Dl(e){return e.closest(hc)||e}function va(e){if(!e)return null;if(e.matches(nt))return e;const t=e.querySelector(nt);return t instanceof HTMLElement?t:null}function V0(){if(typeof window>"u")return null;const e=window[Ld];if(!(e instanceof HTMLElement))return null;window[Ld]=null;const t=va(e);if(t)return t;const n=e.closest(hc);if(n){const o=va(n);if(o)return o}const r=e.closest(nt);return r instanceof HTMLElement?r:null}function W0(e){const t=e.closest("[data-editora-editor]");if(t&&va(t)===e)return t;let n=e;for(;n;){if(n.matches(hc)&&(n===e||va(n)===e))return n;n=n.parentElement}return Dl(e)}function Mm(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function Di(){Array.from(Ml).forEach(t=>{t.isConnected||yc(t)})}function Bt(e,t=!0,n=!0){if(Di(),(e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const i=va(e.editorElement);if(i)return i}const r=V0();if(r)return r;const o=window.getSelection();if(o&&o.rangeCount>0){const i=Mm(o.getRangeAt(0).startContainer),l=i==null?void 0:i.closest(nt);if(l)return l}const a=document.activeElement;if(a){if(a.matches(nt))return a;const i=a.closest(nt);if(i)return i}if(n){if(we&&we.isConnected)return we;we&&!we.isConnected&&(we=null)}return t?document.querySelector(nt):null}function K0(e){const t=e.target;if(t){const r=t.closest(nt);if(r)return r}const n=window.getSelection();if(n&&n.rangeCount>0){const r=Mm(n.getRangeAt(0).startContainer),o=r==null?void 0:r.closest(nt);if(o)return o}return null}function si(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function U0(e){const t=Dl(e);if(si(t))return!0;const n=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return si(n)?!0:si(document.documentElement)||si(document.body)}function ll(e,t){e.classList.remove("rte-blocks-library-theme-dark"),U0(t)&&e.classList.add("rte-blocks-library-theme-dark")}function Rm(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function Dd(e,t,n){const r=W0(e);Array.from(r.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",n),a.setAttribute("data-active",n?"true":"false"),a.setAttribute("aria-pressed",n?"true":"false")})}function Nd(e,t){const n=e.querySelector(".rte-blocks-library-live");n&&(n.textContent=t)}function Nl(e){const t=Im(e);if(t)try{nr.set(e,t.cloneRange())}catch{}}function Dm(e){const t=nr.get(e);if(!t)return null;if(!e.isConnected)return nr.delete(e),null;try{const n=t.cloneRange();return e.contains(n.commonAncestorContainer)?n:(nr.delete(e),null)}catch{return nr.delete(e),null}}function G0(e){const t=Dm(e);return t?(Hm(e,t),!0):!1}function Z0(e){if(il.has(e))return;const t=()=>{const n=window.getSelection();if(!n||n.rangeCount===0)return;const r=n.getRangeAt(0);e.contains(r.commonAncestorContainer)&&Nl(e)};e.addEventListener("keyup",t),e.addEventListener("mouseup",t),e.addEventListener("touchend",t),il.set(e,t)}function Y0(e){const t=il.get(e);t&&(e.removeEventListener("keyup",t),e.removeEventListener("mouseup",t),e.removeEventListener("touchend",t),il.delete(e))}function $e(e,t){I.has(e)||I.set(e,t),yn.has(e)||(yn.set(e,t.blocks),no.set(e,Date.now()));let n=je.get(e);return n||(n={query:"",category:t.defaultCategory?Rl(t.defaultCategory):"all",selectedBlockId:null,recentBlockIds:[],lastInsertedBlockId:null,loading:!1,loadError:null,totalMatches:0,visibleMatches:0,filterCache:new Map,debounceTimer:null},je.set(e,n)),Ml.add(e),Z0(e),n}function Nm(e){const t=je.get(e);!t||t.debounceTimer===null||(window.clearTimeout(t.debounceTimer),t.debounceTimer=null)}function yc(e){var n;Nm(e),Y0(e),nr.delete(e);const t=Jo.get(e);t&&(t.abort(),Jo.delete(e)),Io.delete(e),Xn.delete(e),(n=ze.get(e))==null||n.remove(),ze.delete(e),Ha.delete(e),I.delete(e),Mi.delete(e),je.delete(e),yn.delete(e),no.delete(e),Ml.delete(e),we===e&&(we=null)}function X0(e){var t,n,r,o;for(let a=0;a<e.length;a+=1){const i=e[a];if(!(i.type!=="childList"||i.removedNodes.length===0))for(let l=0;l<i.removedNodes.length;l+=1){const s=i.removedNodes[l];if(s.nodeType!==Node.ELEMENT_NODE)continue;const c=s;if((t=c.matches)!=null&&t.call(c,nt)||(n=c.matches)!=null&&n.call(c,`.${B}`)||(r=c.querySelector)!=null&&r.call(c,nt)||(o=c.querySelector)!=null&&o.call(c,`.${B}`))return!0}}return!1}function xc(e){return Ha.get(e)===!0}function As(e,t){if(!t.classList.contains("show"))return;const n=Dl(e).getBoundingClientRect(),r=Math.min(window.innerWidth-20,420),o=Math.max(10,window.innerWidth-r-10),a=Math.min(Math.max(10,n.right-r),o),i=Math.max(10,Math.min(window.innerHeight-10,n.top+12));t.style.width=`${r}px`,t.style.left=`${a}px`,t.style.top=`${i}px`,t.style.maxHeight=`${Math.max(260,window.innerHeight-20)}px`}function Bl(e){var t;return yn.get(e)||((t=I.get(e))==null?void 0:t.blocks)||[]}function J0(e,t){const n=new Map;Bl(e).forEach(o=>{n.has(o.categoryKey)||n.set(o.categoryKey,o.category)});const r=Array.from(n.entries()).sort((o,a)=>o[1].localeCompare(a[1])).map(([o,a])=>({value:o,label:a}));return[{value:"all",label:t.labels.allCategoriesText},...r]}function Bm(e,t){const n=$e(e,t),r=Bl(e),o=n.query.trim().toLowerCase(),a=n.category||"all",i=`${o}|${a}|${t.maxResults}`,l=n.filterCache.get(i);if(l){const d=new Map(r.map(f=>[f.id,f])),u=l.ids.map(f=>d.get(f)).filter(Boolean);return n.totalMatches=l.total,n.visibleMatches=u.length,u}const s=[];let c=0;for(let d=0;d<r.length;d+=1){const u=r[d];a!=="all"&&u.categoryKey!==a||o&&!u.searchBlob.includes(o)||(c+=1,s.length<t.maxResults&&s.push(u))}if(n.totalMatches=c,n.visibleMatches=s.length,n.filterCache.set(i,{ids:s.map(d=>d.id),total:c}),n.filterCache.size>B0){const d=n.filterCache.keys().next().value;typeof d=="string"&&n.filterCache.delete(d)}return s}function Q0(e,t){const n=je.get(e);if(!n)return;if(t.length===0){n.selectedBlockId=null;return}t.some(o=>o.id===n.selectedBlockId)||(n.selectedBlockId=t[0].id)}function ro(e){const t=je.get(e);Dd(e,"toggleBlocksLibraryPanel",xc(e)),Dd(e,"insertLastBlockSnippet",!!(t!=null&&t.lastInsertedBlockId))}function mt(e){const t=ze.get(e),n=I.get(e)||Yt,r=je.get(e);if(!t||!n||!r)return;ll(t,e);const o=t.querySelector(".rte-blocks-library-title");o&&(o.textContent=n.labels.panelTitle);const a=t.querySelector('[data-action="close"]');a&&(a.setAttribute("aria-label",n.labels.closeText),a.textContent="✕");const i=t.querySelector(".rte-blocks-library-search-label");i&&(i.textContent=n.labels.searchLabel);const l=t.querySelector('[data-field="query"]');l&&(l.setAttribute("placeholder",n.labels.searchPlaceholder),l.value!==r.query&&(l.value=r.query));const s=t.querySelector(".rte-blocks-library-category-label");s&&(s.textContent=n.labels.categoryLabel);const c=t.querySelector('[data-field="category"]');if(c){const C=J0(e,n);c.innerHTML=C.map(k=>`<option value="${ve(k.value)}">${ve(k.label)}</option>`).join(""),C.some(k=>k.value===r.category)||(r.category="all"),c.value=r.category}const d=t.querySelector(".rte-blocks-library-helper");d&&(d.textContent=n.labels.helperText);const u=t.querySelector('.rte-blocks-library-list[role="listbox"]');u&&u.setAttribute("aria-label",n.labels.resultsListLabel);const f=t.querySelector(".rte-blocks-library-shortcut");f&&(f.textContent=n.labels.shortcutText);const m=t.querySelector('[data-action="insert-selected"]');if(m){m.textContent=n.labels.insertText;const C=!Rm(e)&&!!r.selectedBlockId;m.disabled=!C,m.setAttribute("aria-disabled",C?"false":"true")}const g=t.querySelector(".rte-blocks-library-empty"),p=t.querySelector(".rte-blocks-library-list"),b=Bm(e,n);Q0(e,b);const h=t.querySelector(".rte-blocks-library-status");if(h&&(r.loading?h.textContent=n.labels.loadingText:r.loadError?h.textContent=r.loadError:h.textContent=`${n.labels.summaryPrefix}: ${r.visibleMatches}/${r.totalMatches}`),p){const C=new Set(r.recentBlockIds);p.innerHTML=b.map(k=>{const T=r.selectedBlockId===k.id,L=k.tags.length?` • ${k.tags.join(", ")}`:"",w=C.has(k.id),v=k.previewText.slice(0,180);return`
          <li class="rte-blocks-library-item-wrapper" role="presentation">
            <button
              type="button"
              class="rte-blocks-library-item${T?" active":""}"
              data-block-id="${ve(k.id)}"
              role="option"
              aria-selected="${T?"true":"false"}"
              aria-label="${ve(k.label)}"
              tabindex="${T?"0":"-1"}"
            >
              <span class="rte-blocks-library-item-head">
                <span class="rte-blocks-library-item-label">${ve(k.label)}</span>
                ${w?`<span class="rte-blocks-library-recent-pill">${ve(n.labels.recentHeading)}</span>`:""}
              </span>
              <span class="rte-blocks-library-item-meta">${ve(k.category)}${ve(L)}</span>
              ${k.description?`<span class="rte-blocks-library-item-description">${ve(k.description)}</span>`:""}
              ${v?`<span class="rte-blocks-library-item-preview">${ve(v)}</span>`:""}
            </button>
          </li>
        `}).join("")}g&&(g.hidden=b.length>0,g.textContent=n.labels.noResultsText);const x=t.querySelector(".rte-blocks-library-last-inserted");if(x)if(r.lastInsertedBlockId){const C=Bl(e).find(k=>k.id===r.lastInsertedBlockId);C?(x.hidden=!1,x.textContent=`${n.labels.lastInsertedPrefix}: ${C.label}`):x.hidden=!0}else x.hidden=!0;t.setAttribute("aria-label",n.labels.panelAriaLabel)}function qt(e,t=!1){const n=ze.get(e);n&&(n.classList.remove("show"),Ha.set(e,!1),ro(e),t&&(e.focus({preventScroll:!0}),G0(e)))}function e1(e){const t=e.querySelector(".rte-blocks-library-item.active");t==null||t.focus()}function Bd(e,t){const n=I.get(e)||Yt;if(!n)return;const r=je.get(e);if(!r)return;const o=Bm(e,n);if(o.length===0)return;const i=(Math.max(0,o.findIndex(s=>s.id===r.selectedBlockId))+t+o.length)%o.length;r.selectedBlockId=o[i].id,mt(e);const l=ze.get(e);l&&e1(l)}function Ms(e){const t=a1(e);Nl(e),ze.forEach((r,o)=>{o!==e&&qt(o,!1)}),t.classList.add("show"),Ha.set(e,!0),mt(e),As(e,t),ro(e);const n=t.querySelector('[data-field="query"]');n==null||n.focus(),Rs(e,!1)}function Pm(e,t){const n=xc(e);return(typeof t=="boolean"?t:!n)?Ms(e):qt(e,!1),!0}function Im(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const n=t.getRangeAt(0);return e.contains(n.commonAncestorContainer)?n:null}function Hm(e,t){if(!e.isConnected)return;const n=window.getSelection();n&&(n.removeAllRanges(),n.addRange(t))}function Pd(e,t,n){const r=t.cloneRange();if(!e.contains(r.commonAncestorContainer))return!1;r.deleteContents();const o=document.createElement("template");o.innerHTML=n;const a=o.content;if(!a)return!1;const i=a.lastChild;if(r.insertNode(a),i){const l=document.createRange();l.setStartAfter(i),l.collapse(!0),Hm(e,l)}return Nl(e),!0}function t1(e,t){e.focus({preventScroll:!0});const n=Dm(e);if(n&&Pd(e,n,t))return!0;try{if(document.execCommand("insertHTML",!1,t))return Nl(e),!0}catch{}const r=Im(e);return r?Pd(e,r,t):!1}function n1(e,t){if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}}function r1(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function Qo(e,t){const n=I.get(e)||Yt;if(!n)return!1;const r=$e(e,n),o=ze.get(e);if(Rm(e))return o&&Nd(o,n.labels.readonlyMessage),!1;const a=Bl(e).find(s=>s.id===t);if(!a)return!1;const i=e.innerHTML;return t1(e,a.html)?(r.lastInsertedBlockId=a.id,r.selectedBlockId=a.id,r.recentBlockIds=[a.id,...r.recentBlockIds.filter(s=>s!==a.id)].slice(0,n.maxRecentBlocks),n1(e,i),r1(e),ro(e),e.dispatchEvent(new CustomEvent("editora:blocks-library-insert",{bubbles:!0,detail:{blockId:a.id,label:a.label,category:a.category}})),mt(e),o&&Nd(o,`${n.labels.lastInsertedPrefix}: ${a.label}`),!0):!1}function Om(e){const t=je.get(e);return t!=null&&t.lastInsertedBlockId?Qo(e,t.lastInsertedBlockId):!1}function o1(e){const t=I.get(e)||Yt;if(!t)return;const n=je.get(e);if(!n)return;Nm(e);const r=()=>{n.debounceTimer=null,n.filterCache.clear(),mt(e)};if(t.debounceMs<=0){r();return}n.debounceTimer=window.setTimeout(r,t.debounceMs)}function a1(e){const t=ze.get(e);if(t)return t;const n=I.get(e)||Yt||Ri(),r=$e(e,n),o=`rte-blocks-library-panel-${O0++}`,a=`${o}-query`,i=`${o}-category`,l=document.createElement("section");return l.className=B,l.id=o,l.setAttribute("role","dialog"),l.setAttribute("aria-modal","false"),l.setAttribute("aria-label",n.labels.panelAriaLabel),l.innerHTML=`
    <header class="rte-blocks-library-header">
      <h2 class="rte-blocks-library-title">${ve(n.labels.panelTitle)}</h2>
      <button type="button" class="rte-blocks-library-icon-btn" data-action="close" aria-label="${ve(n.labels.closeText)}">✕</button>
    </header>
    <div class="rte-blocks-library-body">
      <label class="rte-blocks-library-search-label" for="${ve(a)}"></label>
      <input id="${ve(a)}" class="rte-blocks-library-input" type="text" data-field="query" autocomplete="off" />
      <label class="rte-blocks-library-category-label" for="${ve(i)}"></label>
      <select id="${ve(i)}" class="rte-blocks-library-select" data-field="category"></select>
      <p class="rte-blocks-library-status" aria-live="polite"></p>
      <p class="rte-blocks-library-helper"></p>
      <p class="rte-blocks-library-last-inserted" hidden></p>
      <div class="rte-blocks-library-list-wrap">
        <ul class="rte-blocks-library-list" role="listbox" aria-label="${ve(n.labels.resultsListLabel)}"></ul>
        <p class="rte-blocks-library-empty" hidden></p>
      </div>
      <div class="rte-blocks-library-actions">
        <button type="button" class="rte-blocks-library-btn rte-blocks-library-btn-primary" data-action="insert-selected"></button>
      </div>
      <p class="rte-blocks-library-shortcut"></p>
    </div>
    <div class="rte-blocks-library-live" aria-live="polite" aria-atomic="true"></div>
  `,l.addEventListener("click",s=>{const c=s.target,d=c==null?void 0:c.closest("[data-action]");if(d){const m=d.getAttribute("data-action");if(m==="close"){qt(e,!0);return}if(m==="insert-selected"){if(!r.selectedBlockId)return;Qo(e,r.selectedBlockId)&&qt(e,!0)}return}const u=c==null?void 0:c.closest("[data-block-id]");if(!u)return;const f=u.getAttribute("data-block-id");f&&(r.selectedBlockId=f,mt(e),s.detail>=2&&Qo(e,f)&&qt(e,!0))}),l.addEventListener("input",s=>{const c=s.target;!(c instanceof HTMLInputElement)||c.getAttribute("data-field")!=="query"||(r.query=n.normalizeText(c.value).toLowerCase(),r.filterCache.clear(),o1(e))}),l.addEventListener("change",s=>{const c=s.target;!(c instanceof HTMLSelectElement)||c.getAttribute("data-field")!=="category"||(r.category=Rl(c.value||"all")||"all",r.filterCache.clear(),mt(e))}),l.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault(),qt(e,!0);return}if(s.key==="ArrowDown"){s.preventDefault(),Bd(e,1);return}if(s.key==="ArrowUp"){s.preventDefault(),Bd(e,-1);return}if(s.key==="Enter"){const c=s.target;if(!(c==null?void 0:c.matches('[data-field="query"], [data-field="category"], [data-block-id]'))||!r.selectedBlockId)return;s.preventDefault(),Qo(e,r.selectedBlockId)&&qt(e,!0)}}),ll(l,e),document.body.appendChild(l),ze.set(e,l),Ha.set(e,!1),mt(e),l}function i1(e){const t=je.get(e);return{query:(t==null?void 0:t.query)||"",category:(t==null?void 0:t.category)||"all",selectedBlockId:(t==null?void 0:t.selectedBlockId)||null,totalMatches:(t==null?void 0:t.totalMatches)||0,visibleMatches:(t==null?void 0:t.visibleMatches)||0,recentBlockIds:t!=null&&t.recentBlockIds?[...t.recentBlockIds]:[],lastInsertedBlockId:(t==null?void 0:t.lastInsertedBlockId)||null,loading:(t==null?void 0:t.loading)===!0,loadError:(t==null?void 0:t.loadError)||null}}async function Rs(e,t){const n=I.get(e)||Yt;if(!n||typeof n.getBlocks!="function")return;const r=$e(e,n),o=no.get(e)||0;if(!t&&n.cacheTtlMs>0&&Date.now()-o<n.cacheTtlMs)return;const a=Io.get(e);if(a&&!t)return a;const i=Jo.get(e);i&&i.abort(),t&&a&&Io.delete(e);const l=new AbortController;Jo.set(e,l);const s=(Xn.get(e)||0)+1;Xn.set(e,s),r.loading=!0,r.loadError=null,mt(e);const c=Promise.resolve().then(async()=>{var g;const d={editor:e,editorRoot:Dl(e),signal:l.signal},u=await((g=n.getBlocks)==null?void 0:g.call(n,d));if(l.signal.aborted||Xn.get(e)!==s)return;const f=Am(u||[],n);yn.set(e,f),no.set(e,Date.now());const m=je.get(e);m&&(m.loading=!1,m.loadError=null,m.filterCache.clear())}).catch(()=>{if(l.signal.aborted||Xn.get(e)!==s)return;const d=je.get(e);d&&(d.loading=!1,d.loadError=n.labels.loadErrorText)}).finally(()=>{Xn.get(e)===s&&(Io.delete(e),Jo.delete(e)),mt(e)});return Io.set(e,c),c}function l1(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="b"}function s1(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="l"}function c1(e){Yt=e,Rr||(Rr=t=>{Di();const n=t.target,r=n==null?void 0:n.closest(nt);if(!r)return;const o=I.get(r)||e;$e(r,o),I.set(r,o),we=r,ro(r);const a=ze.get(r);a&&(ll(a,r),As(r,a),mt(r))},document.addEventListener("focusin",Rr,!0)),Dr||(Dr=t=>{if(t.defaultPrevented)return;const n=`.${B} input, .${B} textarea, .${B} select`,r=t.target;if(r!=null&&r.closest(n)){if(t.key==="Escape"){const i=r.closest(`.${B}`),l=Array.from(ze.entries()).find(([,s])=>s===i);l&&(t.preventDefault(),qt(l[0],!0))}return}const o=K0(t);if(!o)return;const a=I.get(o)||Yt||e;if($e(o,a),I.set(o,a),we=o,t.key==="Escape"&&xc(o)){t.preventDefault(),qt(o,!0);return}if(l1(t)){t.preventDefault(),t.stopPropagation(),Pm(o);return}s1(t)&&(t.preventDefault(),t.stopPropagation(),Om(o))},document.addEventListener("keydown",Dr,!0)),un||(un=()=>{Di(),ze.forEach((t,n)=>{!n.isConnected||!t.isConnected||(ll(t,n),As(n,t))})},window.addEventListener("scroll",un,!0),window.addEventListener("resize",un)),!Nr&&typeof MutationObserver<"u"&&document.body&&(Nr=new MutationObserver(t=>{X0(t)&&Di()}),Nr.observe(document.body,{childList:!0,subtree:!0}))}function d1(){Rr&&(document.removeEventListener("focusin",Rr,!0),Rr=null),Dr&&(document.removeEventListener("keydown",Dr,!0),Dr=null),un&&(window.removeEventListener("scroll",un,!0),window.removeEventListener("resize",un),un=null),Nr&&(Nr.disconnect(),Nr=null),ze.forEach(t=>t.remove()),ze.clear(),Array.from(Ml).forEach(t=>yc(t)),Yt=null,we=null}function u1(){if(typeof document>"u"||document.getElementById(Ad))return;const e=document.createElement("style");e.id=Ad,e.textContent=`
    .rte-toolbar-group-items.${Ge},
    .editora-toolbar-group-items.${Ge},
    .rte-toolbar-group-items.${ht},
    .editora-toolbar-group-items.${ht} {
      display: flex;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: #ffffff;
    }

    .rte-toolbar-group-items.${Ge} .rte-toolbar-button,
    .editora-toolbar-group-items.${Ge} .editora-toolbar-button,
    .rte-toolbar-group-items.${ht} .rte-toolbar-button,
    .editora-toolbar-group-items.${ht} .editora-toolbar-button {
      border: none;
      border-right: 1px solid #cbd5e1;
      border-radius: 0;
    }

    .rte-toolbar-group-items.${Ge} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${Ge} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${ht} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${ht} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    .rte-toolbar-button[data-command="insertLastBlockSnippet"].active,
    .editora-toolbar-button[data-command="insertLastBlockSnippet"].active {
      background: rgba(15, 118, 110, 0.12);
    }

    ${yt} .rte-toolbar-group-items.${Ge},
    ${yt} .editora-toolbar-group-items.${Ge},
    ${yt} .rte-toolbar-group-items.${ht},
    ${yt} .editora-toolbar-group-items.${ht} {
      border-color: #566275;
    }
    ${yt} .rte-toolbar-group-items.${Ge} .rte-toolbar-button svg,
    ${yt} .editora-toolbar-group-items.${Ge} .editora-toolbar-button svg,
    ${yt} .rte-toolbar-group-items.${ht} .rte-toolbar-button svg,
    ${yt} .editora-toolbar-group-items.${ht} .editora-toolbar-button svg
    {
      fill: none;
    }
    ${yt} .rte-toolbar-group-items.${Ge} .rte-toolbar-button,
    ${yt} .editora-toolbar-group-items.${Ge} .editora-toolbar-button
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
  `,document.head.appendChild(e)}const f1=(e={})=>{const t=Ri(e),n=new Set;return u1(),{name:"blocksLibrary",toolbar:[{id:"blocksLibraryGroup",label:"Blocks Library",type:"group",command:"blocksLibrary",items:[{id:"blocksLibraryPanel",label:"Blocks Library Panel",command:"toggleBlocksLibraryPanel",shortcut:"Mod-Alt-Shift-b",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="4" y="5" width="7" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="5" width="7" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="4" y="13" width="7" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="13" width="7" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/></svg>'},{id:"insertLastBlockSnippet",label:"Insert Last Block",command:"insertLastBlockSnippet",shortcut:"Mod-Alt-Shift-l",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M7 5.5h10a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 17 18.5H7A1.5 1.5 0 0 1 5.5 17V7A1.5 1.5 0 0 1 7 5.5Z" stroke="currentColor" stroke-width="1.6"/><path d="M12 8.5v7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8.5 12h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'}]}],commands:{blocksLibrary:(r,o)=>{const a=Bt(o,!1,!1);if(!a)return!1;const i=I.get(a)||t;return $e(a,i),I.set(a,i),we=a,Ms(a),!0},openBlocksLibraryPanel:(r,o)=>{const a=Bt(o,!1,!1);if(!a)return!1;const i=I.get(a)||t;return $e(a,i),I.set(a,i),we=a,Ms(a),!0},toggleBlocksLibraryPanel:(r,o)=>{const a=Bt(o,!1,!1);if(!a)return!1;const i=I.get(a)||t;return $e(a,i),I.set(a,i),we=a,Pm(a,typeof r=="boolean"?r:void 0)},insertBlockSnippet:(r,o)=>{const a=Bt(o,!1,!1);if(!a)return!1;const i=I.get(a)||t;$e(a,i),I.set(a,i);const l=typeof r=="string"?r:r==null?void 0:r.id;return l?(we=a,Qo(a,l)):!1},insertLastBlockSnippet:(r,o)=>{const a=Bt(o,!1,!1);if(!a)return!1;const i=I.get(a)||t;return $e(a,i),I.set(a,i),we=a,Om(a)},refreshBlocksLibraryData:(r,o)=>{const a=Bt(o,!1,!1);if(!a)return!1;const i=I.get(a)||t;return $e(a,i),I.set(a,i),Rs(a,!0),!0},setBlocksLibraryOptions:(r,o)=>{const a=Bt(o,!1,!1);if(!a||!r||typeof r!="object")return!1;const i=I.get(a)||t,l=Mi.get(a)||j0(i),s={...l,...r,labels:{...l.labels||{},...r.labels||{}},blocks:Array.isArray(r.blocks)?r.blocks:l.blocks,normalizeText:r.normalizeText||i.normalizeText,sanitizeBlockHtml:r.sanitizeBlockHtml||i.sanitizeBlockHtml,getBlocks:r.getBlocks||i.getBlocks},c=Ri(s),d=Array.isArray(r.blocks),u=r.getBlocks!==void 0;I.set(a,c),Mi.set(a,s),(d||u||!yn.has(a))&&(yn.set(a,c.blocks),no.set(a,u?0:Date.now()));const f=$e(a,c);return f.filterCache.clear(),typeof r.defaultCategory=="string"&&(f.category=Rl(c.defaultCategory)||"all"),mt(a),ro(a),u&&Rs(a,!0),!0},getBlocksLibraryState:(r,o)=>{const a=Bt(o,!1,!1);if(!a)return!1;const i=I.get(a)||t;$e(a,i);const l=i1(a);if(typeof r=="function")try{r(l)}catch{}return a.__blocksLibraryState=l,a.dispatchEvent(new CustomEvent("editora:blocks-library-state",{bubbles:!0,detail:l})),!0}},keymap:{"Mod-Alt-Shift-b":"toggleBlocksLibraryPanel","Mod-Alt-Shift-B":"toggleBlocksLibraryPanel","Mod-Alt-Shift-l":"insertLastBlockSnippet","Mod-Alt-Shift-L":"insertLastBlockSnippet"},init:function(o){li+=1;const a=this&&typeof this.__pluginConfig=="object"?{...e,...this.__pluginConfig}:e,i=Ri(a);c1(i);const l=Bt(o!=null&&o.editorElement?{editorElement:o.editorElement}:void 0,!1,!1);l&&(we=l,n.add(l),$e(l,i),I.set(l,i),Mi.set(l,a),yn.set(l,i.blocks),no.set(l,Date.now()),ro(l))},destroy:()=>{n.forEach(r=>yc(r)),n.clear(),li=Math.max(0,li-1),!(li>0)&&d1()}}},He=".rte-content, .editora-content",vc="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",Id="__editoraCommandEditorRoot",Hd="rte-doc-schema-styles",z="rte-doc-schema-panel",Ze="document-schema",xt="doc-schema",en="docSchema",Ye=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',p1={panelTitle:"Document Schema",panelAriaLabel:"Document schema panel",schemaLabel:"Schema",schemaDescriptionPrefix:"Description",validateText:"Run Validation",insertMissingText:"Insert Missing Sections",realtimeOnText:"Realtime On",realtimeOffText:"Realtime Off",closeText:"Close",noIssuesText:"No schema violations detected.",summaryPrefix:"Schema",issueListLabel:"Schema issues",shortcutText:"Shortcuts: Ctrl/Cmd+Alt+Shift+G (panel), Ctrl/Cmd+Alt+Shift+J (validate)",helperText:"Choose a schema, validate structure, then insert missing sections safely.",readonlyMessage:"Editor is read-only. Missing sections cannot be inserted.",defaultPlaceholderText:"Add section content.",missingSectionMessage:"Missing required section",duplicateSectionMessage:"Section appears too many times",outOfOrderMessage:"Section appears out of required order",unknownHeadingMessage:"Heading is not part of selected schema",insertedSummaryPrefix:"Inserted missing sections"},N=new WeakMap,Ni=new WeakMap,ka=new WeakMap,Re=new Map,Oa=new WeakMap,sl=new WeakMap,Pl=new Set;let ci=0,m1=0,Od=0,ot=null,Le=null,Br=null,Pr=null,Ir=null,fn=null,Hr=null;function At(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function g1(e){return e.replace(/\u00A0/g," ").replace(/\s+/g," ").trim()}function jn(e,t,n){return Number.isFinite(e)?Math.max(t,Math.min(n,e)):t}function zm(e){return e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)}function kc(e,t){return t(e).toLowerCase().replace(/^[\s\-\u2022]*(?:[0-9]+(?:\.[0-9]+)*)[\)\.\-:\s]+/,"").replace(/^[\s\-\u2022]*(?:[ivxlcdm]+)[\)\.\-:\s]+/i,"").replace(/[：:]+$/g,"").replace(/\s+/g," ").trim()}function zd(){return[{id:"contract",label:"Contract",description:"Template for legal/commercial agreements with strict section ordering.",strictOrder:!0,allowUnknownHeadings:!1,sections:[{id:"summary",title:"Executive Summary",aliases:["Overview"]},{id:"scope",title:"Scope"},{id:"terms",title:"Terms and Conditions",aliases:["Terms"]},{id:"responsibilities",title:"Responsibilities"},{id:"sla",title:"Service Levels",aliases:["SLA","Service Level Agreement"]},{id:"termination",title:"Termination"}]},{id:"sop",label:"SOP",description:"Standard operating procedure with clear implementation and governance sections.",strictOrder:!0,allowUnknownHeadings:!0,sections:[{id:"purpose",title:"Purpose"},{id:"scope",title:"Scope"},{id:"procedure",title:"Procedure",maxOccurrences:10},{id:"roles",title:"Roles and Responsibilities",aliases:["Responsibilities"]},{id:"validation",title:"Validation"},{id:"revision-history",title:"Revision History",aliases:["Change History"]}]},{id:"policy",label:"Policy",description:"Policy document with control ownership, exception handling, and enforcement.",strictOrder:!0,allowUnknownHeadings:!0,sections:[{id:"statement",title:"Policy Statement"},{id:"applicability",title:"Applicability",aliases:["Scope"]},{id:"controls",title:"Controls"},{id:"exceptions",title:"Exceptions"},{id:"enforcement",title:"Enforcement"}]}]}function b1(e,t,n){const r=n(e.title||"");if(!r)return null;const o=zm(n(e.id||r))||`section-${t+1}`,a=jn(Number(e.minOccurrences??1),0,20),i=Math.max(1,a),l=jn(Number(e.maxOccurrences??i),a,40),s=n(e.placeholder||""),c=Array.isArray(e.aliases)?e.aliases.map(u=>n(u)).filter(Boolean):[],d=[r,...c].map(u=>kc(u,n)).filter(Boolean);return{id:o,title:r,minOccurrences:a,maxOccurrences:l,placeholder:s,matchKeys:Array.from(new Set(d))}}function qm(e,t){const n=Array.isArray(e)&&e.length>0?e:zd(),r=[],o=new Set;return n.forEach((a,i)=>{const l=t(a.label||"");if(!l)return;const s=zm(t(a.id||l))||`schema-${i+1}`;let c=s,d=1;for(;o.has(c);)c=`${s}-${d++}`;o.add(c);const u=Array.isArray(a.sections)?a.sections:[],f=[],m=new Set;if(u.forEach((b,h)=>{const x=b1(b,h,t);if(!x)return;let C=x.id,k=1;for(;m.has(C);)C=`${x.id}-${k++}`;m.add(C),f.push({...x,id:C})}),f.length===0)return;const g=new Map,p=new Map;f.forEach((b,h)=>{p.set(b.id,h),b.matchKeys.forEach(x=>{g.has(x)||g.set(x,b)})}),r.push({id:c,label:l,description:t(a.description||""),strictOrder:a.strictOrder!==!1,allowUnknownHeadings:!!a.allowUnknownHeadings,sections:f,matchKeyToSection:g,orderBySectionId:p})}),r.length>0?r:qm(zd(),t)}function Bi(e={}){var a;const t=e.normalizeText||g1,n=qm(e.schemas,t),r=t(e.defaultSchemaId||""),o=n.some(i=>i.id===r)?r:((a=n[0])==null?void 0:a.id)||null;return{schemas:n,defaultSchemaId:o,enableRealtime:e.enableRealtime!==!1,debounceMs:jn(Number(e.debounceMs??260),60,2e3),maxIssues:jn(Number(e.maxIssues??80),5,500),labels:{...p1,...e.labels||{}},normalizeText:t}}function h1(e){return{schemas:e.schemas.map(t=>({id:t.id,label:t.label,description:t.description||void 0,strictOrder:t.strictOrder,allowUnknownHeadings:t.allowUnknownHeadings,sections:t.sections.map(n=>({id:n.id,title:n.title,minOccurrences:n.minOccurrences,maxOccurrences:n.maxOccurrences,placeholder:n.placeholder||void 0}))})),defaultSchemaId:e.defaultSchemaId||void 0,enableRealtime:e.enableRealtime,debounceMs:e.debounceMs,maxIssues:e.maxIssues,labels:{...e.labels},normalizeText:e.normalizeText}}function wc(e){return e.closest(vc)||e}function wa(e){if(!e)return null;if(e.matches(He))return e;const t=e.querySelector(He);return t instanceof HTMLElement?t:null}function y1(){if(typeof window>"u")return null;const e=window[Id];if(!(e instanceof HTMLElement))return null;window[Id]=null;const t=wa(e);if(t)return t;const n=e.closest(vc);if(n){const o=wa(n);if(o)return o}const r=e.closest(He);return r instanceof HTMLElement?r:null}function x1(e){const t=e.closest("[data-editora-editor]");if(t&&wa(t)===e)return t;let n=e;for(;n;){if(n.matches(vc)&&(n===e||wa(n)===e))return n;n=n.parentElement}return wc(e)}function _m(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function di(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function v1(e){const t=wc(e);if(di(t))return!0;const n=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return di(n)?!0:di(document.documentElement)||di(document.body)}function Ds(e,t){e.classList.remove("rte-doc-schema-theme-dark"),v1(t)&&e.classList.add("rte-doc-schema-theme-dark")}function k1(e){var t,n,r,o;for(let a=0;a<e.length;a+=1){const i=e[a];if(!(i.type!=="childList"||i.removedNodes.length===0))for(let l=0;l<i.removedNodes.length;l+=1){const s=i.removedNodes[l];if(s.nodeType!==Node.ELEMENT_NODE)continue;const c=s;if((t=c.matches)!=null&&t.call(c,He)||(n=c.matches)!=null&&n.call(c,`.${z}`)||(r=c.querySelector)!=null&&r.call(c,He)||(o=c.querySelector)!=null&&o.call(c,`.${z}`))return!0}}return!1}function Pi(){Array.from(Pl).forEach(t=>{t.isConnected||Cc(t)})}function vt(e,t=!0,n=!0){var l;if(Pi(),(e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const s=wa(e.editorElement);if(s)return s}const r=y1();if(r)return r;const o=window.getSelection();if(o&&o.rangeCount>0){const s=(l=_m(o.getRangeAt(0).startContainer))==null?void 0:l.closest(He);if(s)return s}const a=document.activeElement;if(a){if(a.matches(He))return a;const s=a.closest(He);if(s)return s}if(n&&Le&&Le.isConnected)return Le;if(!t)return null;const i=document.querySelector(He);return i instanceof HTMLElement?i:null}function w1(e){const t=e.target;if(t){const r=t.closest(`.${z}`);if(r){const a=Array.from(Re.entries()).find(([,i])=>i===r);if(a)return a[0]}const o=t.closest(He);if(o)return o}const n=document.activeElement;if(n){const r=n.closest(`.${z}`);if(r){const a=Array.from(Re.entries()).find(([,i])=>i===r);if(a)return a[0]}const o=n.closest(He);if(o)return o}return null}function qd(e,t,n){const r=x1(e);Array.from(r.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",n),a.setAttribute("data-active",n?"true":"false"),a.setAttribute("aria-pressed",n?"true":"false")})}function Ec(e){const t=sl.get(e);typeof t=="number"&&(window.clearTimeout(t),sl.delete(e))}function Ut(e,t){return t&&e.schemas.find(n=>n.id===t)||null}function Ns(e){var t;return e.defaultSchemaId||((t=e.schemas[0])==null?void 0:t.id)||null}function ue(e,t){N.has(e)||N.set(e,t);let n=ka.get(e);return n||(n={activeSchemaId:Ns(t),realtimeEnabled:t.enableRealtime,issues:[],headingCount:0,recognizedHeadingCount:0,missingCount:0,lastRunAt:null,snapshot:""},ka.set(e,n)),(!n.activeSchemaId||!Ut(t,n.activeSchemaId))&&(n.activeSchemaId=Ns(t)),Pl.add(e),n}function Cc(e){var t;Ec(e),(t=Re.get(e))==null||t.remove(),Re.delete(e),Oa.delete(e),N.delete(e),Ni.delete(e),ka.delete(e),Pl.delete(e),Le===e&&(Le=null)}function Sc(e){return Oa.get(e)===!0}function Fm(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function Bs(e,t){if(!t.classList.contains("show"))return;const n=wc(e).getBoundingClientRect(),r=Math.min(window.innerWidth-20,440),o=Math.max(10,window.innerWidth-r-10),a=Math.min(Math.max(10,n.right-r),o),i=Math.max(10,Math.min(window.innerHeight-10,n.top+12));t.style.width=`${r}px`,t.style.left=`${a}px`,t.style.top=`${i}px`,t.style.maxHeight=`${Math.max(260,window.innerHeight-20)}px`}function Ii(e,t){const n=e.querySelector(".rte-doc-schema-live");n&&(n.textContent=t)}function E1(e,t){const n=Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6")),r=[];return n.forEach((o,a)=>{const i=t(o.textContent||"");if(!i)return;const l=Number(o.tagName.slice(1))||0,s=kc(i,t);r.push({text:i,key:s,index:a,level:l})}),r}function jm(e,t,n){const r=Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6")),o=[];return r.forEach(a=>{const i=n(a.textContent||"");if(!i)return;const l=kc(i,n),s=l&&t.matchKeyToSection.get(l)||null,c=s?t.orderBySectionId.get(s.id)??null:null,d=jn(Number(a.tagName.slice(1))||0,1,6);o.push({element:a,level:d,section:s,order:c})}),o}function C1(e,t=2){const n=e.filter(s=>s.section).map(s=>s.level),r=n.length>0?n:e.map(s=>s.level);if(r.length===0)return t;const o=new Map;r.forEach((s,c)=>{o.has(s)||o.set(s,{count:0,firstIndex:c});const d=o.get(s);d.count+=1});let a=t,i=-1,l=Number.MAX_SAFE_INTEGER;return o.forEach((s,c)=>{(s.count>i||s.count===i&&s.firstIndex<l||s.count===i&&s.firstIndex===l&&c<a)&&(a=c,i=s.count,l=s.firstIndex)}),jn(a,1,6)}function S1(e){var a;const t=window.getSelection();if(!t||t.rangeCount===0)return null;const n=t.getRangeAt(0);if(((a=_m(n.startContainer))==null?void 0:a.closest(He))!==e)return null;if(n.startContainer.nodeType===Node.ELEMENT_NODE){const i=n.startContainer,l=i.childNodes[n.startOffset]||null;return{parent:i,referenceNode:l}}const o=n.startContainer.parentNode;return o?{parent:o,referenceNode:n.startContainer.nextSibling||null}:null}function T1(e,t,n,r){var s;const o=jm(e,n,r),a=n.orderBySectionId.get(t.id);if(typeof a!="number"||o.length===0)return{parent:e,referenceNode:null};const i=o.find(c=>typeof c.order=="number"&&c.order>a);if(i&&i.element.parentNode)return{parent:i.element.parentNode,referenceNode:i.element};let l=-1;for(let c=0;c<o.length;c+=1){const d=o[c];typeof d.order=="number"&&d.order<a&&(l=c)}if(l>=0){const c=((s=o[l+1])==null?void 0:s.element)||null;return{parent:(c==null?void 0:c.parentNode)||o[l].element.parentNode||e,referenceNode:c}}return{parent:e,referenceNode:null}}function $1(e,t,n,r){const o=e.ownerDocument||document,a=`h${jn(r,1,6)}`,i=o.createElement(a);i.setAttribute("data-doc-schema-section",t.id),i.textContent=t.title;const l=o.createElement("p");return l.textContent=t.placeholder||n.labels.defaultPlaceholderText,[i,l]}function Ho(e,t,n,r={}){return Od+=1,{id:`doc-schema-issue-${Od}`,type:e,severity:t,message:n,...r}}function ui(e,t,n){return e.replace(/\{section\}/g,t||"").replace(/\{heading\}/g,n||"").trim()}function L1(e,t,n){const r=E1(e,n.normalizeText),o=[],a=new Map,i=[];for(let s=0;s<r.length&&!(o.length>=n.maxIssues);s+=1){const c=r[s];if(!c.key)continue;const d=t.matchKeyToSection.get(c.key);if(d){a.set(d.id,(a.get(d.id)||0)+1),i.push({section:d,heading:c});continue}t.allowUnknownHeadings||o.push(Ho("unknown-heading","warning",ui(n.labels.unknownHeadingMessage,null,c.text),{headingText:c.text,suggestion:"Map this heading to a schema alias or remove it from strict structure mode."}))}let l=0;for(let s=0;s<t.sections.length&&!(o.length>=n.maxIssues);s+=1){const c=t.sections[s],d=a.get(c.id)||0;d<c.minOccurrences&&(l+=1,o.push(Ho("missing-section","error",ui(n.labels.missingSectionMessage,c.title,null),{sectionId:c.id,sectionTitle:c.title,suggestion:`Add heading "${c.title}" to satisfy schema requirements.`}))),d>c.maxOccurrences&&o.length<n.maxIssues&&o.push(Ho("duplicate-section","warning",ui(n.labels.duplicateSectionMessage,c.title,null),{sectionId:c.id,sectionTitle:c.title,suggestion:`Keep at most ${c.maxOccurrences} instance(s) of "${c.title}".`}))}if(t.strictOrder&&o.length<n.maxIssues){let s=-1;for(let c=0;c<i.length&&!(o.length>=n.maxIssues);c+=1){const d=i[c],u=t.orderBySectionId.get(d.section.id)??c;u<s?o.push(Ho("out-of-order","warning",ui(n.labels.outOfOrderMessage,d.section.title,d.heading.text),{sectionId:d.section.id,sectionTitle:d.section.title,headingText:d.heading.text,suggestion:`Move "${d.section.title}" after earlier required sections.`})):s=u}}return{issues:o,headingCount:r.length,recognizedHeadingCount:i.length,missingCount:l}}function Vm(e){const t=N.get(e)||ot,n=ka.get(e),r=t?Ut(t,(n==null?void 0:n.activeSchemaId)||null):null;return{activeSchemaId:(n==null?void 0:n.activeSchemaId)||null,activeSchemaLabel:(r==null?void 0:r.label)||null,realtimeEnabled:(n==null?void 0:n.realtimeEnabled)===!0,issues:n!=null&&n.issues?n.issues.map(o=>({...o})):[],headingCount:(n==null?void 0:n.headingCount)||0,recognizedHeadingCount:(n==null?void 0:n.recognizedHeadingCount)||0,missingCount:(n==null?void 0:n.missingCount)||0,lastRunAt:(n==null?void 0:n.lastRunAt)||null}}function wn(e){const t=ka.get(e);qd(e,"toggleDocSchemaPanel",Sc(e)),qd(e,"toggleDocSchemaRealtime",(t==null?void 0:t.realtimeEnabled)===!0)}function Vn(e){const t=Re.get(e);if(!t)return;const n=N.get(e)||ot;if(!n)return;const r=ue(e,n),o=Ut(n,r.activeSchemaId),a=t.querySelector(".rte-doc-schema-label");a&&(a.textContent=n.labels.schemaLabel);const i=t.querySelector('[data-field="schema"]');i&&(i.innerHTML=n.schemas.map(h=>`<option value="${At(h.id)}">${At(h.label)}</option>`).join(""),i.value=r.activeSchemaId||"");const l=t.querySelector(".rte-doc-schema-description");if(l){const h=(o==null?void 0:o.description)||"";l.textContent=h?`${n.labels.schemaDescriptionPrefix}: ${h}`:"",l.hidden=!h}const s=t.querySelector(".rte-doc-schema-summary");if(s){const h=(o==null?void 0:o.label)||"N/A",x=r.issues.length;s.textContent=`${n.labels.summaryPrefix}: ${h} • ${x} issue${x===1?"":"s"}`}const c=t.querySelector(".rte-doc-schema-helper");c&&(c.textContent=n.labels.helperText);const d=t.querySelector(".rte-doc-schema-shortcut");d&&(d.textContent=n.labels.shortcutText);const u=t.querySelector('[data-action="run-validation"]');u&&(u.textContent=n.labels.validateText);const f=t.querySelector('[data-action="insert-missing"]');if(f){f.textContent=n.labels.insertMissingText;const h=r.issues.some(x=>x.type==="missing-section");f.disabled=!h||Fm(e)}const m=t.querySelector('[data-action="toggle-realtime"]');m&&(m.textContent=r.realtimeEnabled?n.labels.realtimeOnText:n.labels.realtimeOffText,m.setAttribute("aria-pressed",r.realtimeEnabled?"true":"false"));const g=t.querySelector('[data-action="close"]');g&&g.setAttribute("aria-label",n.labels.closeText);const p=t.querySelector(".rte-doc-schema-issues"),b=t.querySelector(".rte-doc-schema-empty");p&&(p.setAttribute("aria-label",n.labels.issueListLabel),r.issues.length===0?(p.innerHTML="",b&&(b.hidden=!1,b.textContent=n.labels.noIssuesText)):(b&&(b.hidden=!0),p.innerHTML=r.issues.map(h=>{const x=h.severity==="error"?"error":h.severity==="warning"?"warning":"info",C=h.sectionTitle||h.headingText||"";return`
            <li class="rte-doc-schema-issue ${x}" role="listitem">
              <p class="rte-doc-schema-issue-message">${At(h.message)}${C?`: <strong>${At(C)}</strong>`:""}</p>
              ${h.suggestion?`<p class="rte-doc-schema-issue-suggestion">${At(h.suggestion)}</p>`:""}
            </li>
          `}).join(""))),t.setAttribute("aria-label",n.labels.panelAriaLabel)}function Ea(e,t=!1){const n=Re.get(e);n&&(n.classList.remove("show"),Oa.set(e,!1),wn(e),t&&e.focus({preventScroll:!0}))}function Ps(e){const t=R1(e);Re.forEach((r,o)=>{o!==e&&Ea(o,!1)}),t.classList.add("show"),Oa.set(e,!0),Vn(e),Bs(e,t),wn(e);const n=t.querySelector('[data-field="schema"]');n==null||n.focus(),ft(e,"panel-open",!1)}function Wm(e,t){const n=Sc(e);return(typeof t=="boolean"?t:!n)?Ps(e):Ea(e,!1),!0}function A1(e,t){if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}}function M1(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function ft(e,t,n){const r=N.get(e)||ot;if(!r)return[];const o=ue(e,r),a=Re.get(e),i=e.innerHTML;if(!n&&o.snapshot===i)return o.issues;const l=Ut(r,o.activeSchemaId);if(!l)return o.issues=[Ho("missing-section","error","No active schema is configured for this editor.",{suggestion:"Set `defaultSchemaId` or update schema options."})],o.headingCount=0,o.recognizedHeadingCount=0,o.missingCount=1,o.lastRunAt=new Date().toISOString(),o.snapshot=i,Vn(e),wn(e),o.issues;const s=L1(e,l,r);return o.issues=s.issues,o.headingCount=s.headingCount,o.recognizedHeadingCount=s.recognizedHeadingCount,o.missingCount=s.missingCount,o.lastRunAt=new Date().toISOString(),o.snapshot=i,Vn(e),wn(e),e.dispatchEvent(new CustomEvent("editora:doc-schema-validation",{bubbles:!0,detail:{reason:t,state:Vm(e)}})),a&&Ii(a,s.issues.length===0?r.labels.noIssuesText:`${s.issues.length} issue${s.issues.length===1?"":"s"} detected.`),o.issues}function Km(e){const t=N.get(e)||ot;if(!t)return;Ec(e);const n=window.setTimeout(()=>{sl.delete(e),ft(e,"realtime",!1)},t.debounceMs);sl.set(e,n)}function Um(e,t){const n=N.get(e)||ot;if(!n)return!1;const r=ue(e,n),o=typeof t=="boolean"?t:!r.realtimeEnabled;return r.realtimeEnabled=o,o?Km(e):Ec(e),Vn(e),wn(e),!0}function Gm(e){const t=N.get(e)||ot;if(!t)return!1;const n=ue(e,t),r=Re.get(e);if(Fm(e))return r&&Ii(r,t.labels.readonlyMessage),!1;const o=Ut(t,n.activeSchemaId);if(!o)return!1;ft(e,"insert-missing-pre",!0);const a=Array.from(new Set(n.issues.filter(f=>f.type==="missing-section"&&f.sectionId).map(f=>f.sectionId))),i=o.sections.filter(f=>a.includes(f.id));if(i.length===0)return r&&Ii(r,t.labels.noIssuesText),!1;const l=e.innerHTML,s=jm(e,o,t.normalizeText),c=C1(s,2),d=S1(e);i.forEach(f=>{const m=o.strictOrder?T1(e,f,o,t.normalizeText):d||{parent:e,referenceNode:null},[g,p]=$1(e,f,t,c);m.parent.insertBefore(g,m.referenceNode),m.parent.insertBefore(p,m.referenceNode)}),A1(e,l),M1(e),ft(e,"insert-missing-post",!0);const u=i.map(f=>f.title).join(", ");return e.dispatchEvent(new CustomEvent("editora:doc-schema-insert-missing",{bubbles:!0,detail:{schemaId:o.id,sectionIds:i.map(f=>f.id)}})),r&&Ii(r,`${t.labels.insertedSummaryPrefix}: ${u}`),!0}function R1(e){const t=Re.get(e);if(t)return t;const n=N.get(e)||ot||Bi();ue(e,n);const r=`rte-doc-schema-panel-${m1++}`,o=`${r}-schema`,a=document.createElement("section");return a.className=z,a.id=r,a.setAttribute("role","dialog"),a.setAttribute("aria-modal","false"),a.setAttribute("aria-label",n.labels.panelAriaLabel),a.innerHTML=`
    <header class="rte-doc-schema-header">
      <h2 class="rte-doc-schema-title">${At(n.labels.panelTitle)}</h2>
      <button type="button" class="rte-doc-schema-icon-btn" data-action="close" aria-label="${At(n.labels.closeText)}">✕</button>
    </header>
    <div class="rte-doc-schema-body">
      <label class="rte-doc-schema-label" for="${At(o)}"></label>
      <select id="${At(o)}" class="rte-doc-schema-select" data-field="schema"></select>
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
        <ul class="rte-doc-schema-issues" role="list" aria-label="${At(n.labels.issueListLabel)}"></ul>
        <p class="rte-doc-schema-empty" hidden></p>
      </div>
    </div>
    <div class="rte-doc-schema-live" aria-live="polite" aria-atomic="true"></div>
  `,a.addEventListener("click",i=>{const l=i.target,s=l==null?void 0:l.closest("[data-action]");if(!s)return;const c=s.getAttribute("data-action");if(c==="close"){Ea(e,!0);return}if(c==="run-validation"){ft(e,"panel-button",!0);return}if(c==="insert-missing"){Gm(e);return}c==="toggle-realtime"&&Um(e)}),a.addEventListener("change",i=>{const l=i.target;if(!(l instanceof HTMLSelectElement)||l.getAttribute("data-field")!=="schema")return;const s=N.get(e)||ot;if(!s)return;const c=ue(e,s),d=l.value;Ut(s,d)&&(c.activeSchemaId=d,c.snapshot="",ft(e,"schema-change",!0))}),a.addEventListener("keydown",i=>{i.key==="Escape"&&(i.preventDefault(),Ea(e,!0))}),Ds(a,e),document.body.appendChild(a),Re.set(e,a),Oa.set(e,!1),Vn(e),a}function D1(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="g"}function N1(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="j"}function B1(e){ot=e,Br||(Br=t=>{Pi();const n=t.target,r=n==null?void 0:n.closest(He);if(!r)return;const o=N.get(r)||e;ue(r,o),N.set(r,o),Le=r,wn(r);const a=Re.get(r);a&&(Ds(a,r),Bs(r,a),Vn(r))},document.addEventListener("focusin",Br,!0)),Pr||(Pr=t=>{const n=t.target,r=n==null?void 0:n.closest(He);if(!r)return;const o=N.get(r)||ot;!o||!ue(r,o).realtimeEnabled||Km(r)},document.addEventListener("input",Pr,!0)),Ir||(Ir=t=>{if(t.defaultPrevented)return;const n=t.target;if(n!=null&&n.closest(`.${z}`)&&t.key!=="Escape")return;const r=w1(t);if(!r)return;const o=N.get(r)||ot||e;if(ue(r,o),N.set(r,o),Le=r,t.key==="Escape"&&Sc(r)){t.preventDefault(),Ea(r,!0);return}if(D1(t)){t.preventDefault(),t.stopPropagation(),Wm(r);return}N1(t)&&(t.preventDefault(),t.stopPropagation(),ft(r,"shortcut",!0))},document.addEventListener("keydown",Ir,!0)),fn||(fn=()=>{Pi(),Re.forEach((t,n)=>{!n.isConnected||!t.isConnected||(Ds(t,n),Bs(n,t))})},window.addEventListener("scroll",fn,!0),window.addEventListener("resize",fn)),!Hr&&typeof MutationObserver<"u"&&document.body&&(Hr=new MutationObserver(t=>{k1(t)&&Pi()}),Hr.observe(document.body,{childList:!0,subtree:!0}))}function P1(){Br&&(document.removeEventListener("focusin",Br,!0),Br=null),Pr&&(document.removeEventListener("input",Pr,!0),Pr=null),Ir&&(document.removeEventListener("keydown",Ir,!0),Ir=null),fn&&(window.removeEventListener("scroll",fn,!0),window.removeEventListener("resize",fn),fn=null),Hr&&(Hr.disconnect(),Hr=null),Re.forEach(t=>t.remove()),Re.clear(),Array.from(Pl).forEach(t=>Cc(t)),ot=null,Le=null}function I1(){if(typeof document>"u"||document.getElementById(Hd))return;const e=document.createElement("style");e.id=Hd,e.textContent=`
    .rte-toolbar-group-items.${Ze},
    .editora-toolbar-group-items.${Ze},
    .rte-toolbar-group-items.${xt},
    .editora-toolbar-group-items.${xt},
    .rte-toolbar-group-items.${en},
    .editora-toolbar-group-items.${en} {
      display: flex;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: #ffffff;
    }

    .rte-toolbar-group-items.${Ze} .rte-toolbar-button,
    .editora-toolbar-group-items.${Ze} .editora-toolbar-button,
    .rte-toolbar-group-items.${xt} .rte-toolbar-button,
    .editora-toolbar-group-items.${xt} .editora-toolbar-button,
    .rte-toolbar-group-items.${en} .rte-toolbar-button,
    .editora-toolbar-group-items.${en} .editora-toolbar-button {
      border: none;
      border-right: 1px solid #cbd5e1;
      border-radius: 0;
    }

    .rte-toolbar-group-items.${Ze} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${Ze} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${xt} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${xt} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${en} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${en} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    ${Ye} .rte-toolbar-group-items.${Ze},
    ${Ye} .editora-toolbar-group-items.${Ze},
    ${Ye} .rte-toolbar-group-items.${xt},
    ${Ye} .editora-toolbar-group-items.${xt},
    ${Ye} .rte-toolbar-group-items.${en},
    ${Ye} .editora-toolbar-group-items.${en} {
      border-color: #566275;
    }
    .rte-toolbar-button[data-command="toggleDocSchemaRealtime"].active,
    .editora-toolbar-button[data-command="toggleDocSchemaRealtime"].active {
      background-color: #ccc;
    }
    ${Ye} .rte-toolbar-group-items.${Ze} .rte-toolbar-button svg,
    ${Ye} .editora-toolbar-group-items.${Ze} .editora-toolbar-button svg,
    ${Ye} .rte-toolbar-group-items.${xt} .rte-toolbar-button svg,
    ${Ye} .editora-toolbar-group-items.${xt} .editora-toolbar-button svg
    {
      fill: none;
    }
    ${Ye} .rte-toolbar-group-items.${Ze} .rte-toolbar-button,
    ${Ye} .editora-toolbar-group-items.${Ze} .editora-toolbar-button
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
  `,document.head.appendChild(e)}const H1=(e={})=>{const t=Bi(e),n=new Set;return I1(),{name:"docSchema",toolbar:[{id:"docSchemaGroup",label:"Document Schema",type:"group",command:"docSchema",items:[{id:"toggleDocSchemaPanel",label:"Document Schema",command:"toggleDocSchemaPanel",shortcut:"Mod-Alt-Shift-g",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M6 4.5h12A1.5 1.5 0 0 1 19.5 6v12A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5Z" stroke="currentColor" stroke-width="1.6"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'},{id:"runDocSchemaValidation",label:"Run Schema Validation",command:"runDocSchemaValidation",shortcut:"Mod-Alt-Shift-j",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M12 3.5 4.5 6.5v5c0 4.8 3.1 8.9 7.5 10 4.4-1.1 7.5-5.2 7.5-10v-5L12 3.5Z" stroke="currentColor" stroke-width="1.6"/><path d="m9 12.5 2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'},{id:"toggleDocSchemaRealtime",label:"Toggle Schema Realtime",command:"toggleDocSchemaRealtime",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 1 7.5 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9.5 19.5H5.5v-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>'}]}],commands:{docSchema:(r,o)=>{const a=vt(o,!1,!1);if(!a)return!1;const i=N.get(a)||t;return ue(a,i),N.set(a,i),Le=a,Ps(a),!0},openDocSchemaPanel:(r,o)=>{const a=vt(o,!1,!1);if(!a)return!1;const i=N.get(a)||t;return ue(a,i),N.set(a,i),Le=a,Ps(a),!0},toggleDocSchemaPanel:(r,o)=>{const a=vt(o,!1,!1);if(!a)return!1;const i=N.get(a)||t;return ue(a,i),N.set(a,i),Le=a,Wm(a,typeof r=="boolean"?r:void 0)},runDocSchemaValidation:(r,o)=>{const a=vt(o,!1,!1);if(!a)return!1;const i=N.get(a)||t;return ue(a,i),N.set(a,i),Le=a,ft(a,"command",!0),!0},insertMissingDocSchemaSections:(r,o)=>{const a=vt(o,!1,!1);if(!a)return!1;const i=N.get(a)||t;return ue(a,i),N.set(a,i),Le=a,Gm(a)},toggleDocSchemaRealtime:(r,o)=>{const a=vt(o,!1,!1);if(!a)return!1;const i=N.get(a)||t;return ue(a,i),N.set(a,i),Le=a,Um(a,typeof r=="boolean"?r:void 0)},setDocSchemaMode:(r,o)=>{const a=vt(o,!1,!1);if(!a)return!1;const i=N.get(a)||t,l=ue(a,i);N.set(a,i);const s=typeof r=="string"?r:(r==null?void 0:r.schemaId)||(r==null?void 0:r.id);return!s||!Ut(i,s)?!1:(l.activeSchemaId=s,l.snapshot="",ft(a,"set-mode",!0),!0)},setDocSchemaOptions:(r,o)=>{const a=vt(o,!1,!1);if(!a||!r||typeof r!="object")return!1;const i=N.get(a)||t,l=Ni.get(a)||h1(i),s={...l,...r,labels:{...l.labels||{},...r.labels||{}},schemas:Array.isArray(r.schemas)?r.schemas:l.schemas,normalizeText:r.normalizeText||i.normalizeText},c=Bi(s);N.set(a,c),Ni.set(a,s);const d=ue(a,c);return typeof r.enableRealtime=="boolean"&&(d.realtimeEnabled=r.enableRealtime),(!d.activeSchemaId||!Ut(c,d.activeSchemaId))&&(d.activeSchemaId=Ns(c)),typeof r.defaultSchemaId=="string"&&Ut(c,r.defaultSchemaId)&&(d.activeSchemaId=r.defaultSchemaId),d.snapshot="",ft(a,"set-options",!0),Vn(a),wn(a),!0},getDocSchemaState:(r,o)=>{const a=vt(o,!1,!1);if(!a)return!1;const i=N.get(a)||t;ue(a,i);const l=Vm(a);if(typeof r=="function")try{r(l)}catch{}return a.__docSchemaState=l,a.dispatchEvent(new CustomEvent("editora:doc-schema-state",{bubbles:!0,detail:l})),!0}},keymap:{"Mod-Alt-Shift-g":"toggleDocSchemaPanel","Mod-Alt-Shift-G":"toggleDocSchemaPanel","Mod-Alt-Shift-j":"runDocSchemaValidation","Mod-Alt-Shift-J":"runDocSchemaValidation"},init:function(o){ci+=1;const a=this&&typeof this.__pluginConfig=="object"?{...e,...this.__pluginConfig}:e,i=Bi(a);B1(i);const l=vt(o!=null&&o.editorElement?{editorElement:o.editorElement}:void 0,!1,!1);l&&(Le=l,n.add(l),ue(l,i),N.set(l,i),Ni.set(l,a),wn(l),ft(l,"init",!0))},destroy:()=>{n.forEach(r=>Cc(r)),n.clear(),ci=Math.max(0,ci-1),!(ci>0)&&P1()}}},Oe=".rte-content, .editora-content",Tc="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",_d="__editoraCommandEditorRoot",Fd="rte-translation-workflow-styles",R="rte-translation-workflow-panel",Xe="translation-workflow",kt="translationWorkflow",ye=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',jd=["p","h1","h2","h3","h4","h5","h6","li","td","th","blockquote","figcaption"].join(", "),Zm=new Set(["ArrowUp","ArrowDown","Home","End"]),Vd=[{locale:"en",label:"English",minLengthRatio:.6,maxLengthRatio:1.4,requireDifferentFromSource:!1,preserveTokens:!0},{locale:"fr",label:"French",minLengthRatio:.75,maxLengthRatio:1.7,requireDifferentFromSource:!0,preserveTokens:!0},{locale:"de",label:"German",minLengthRatio:.8,maxLengthRatio:1.9,requireDifferentFromSource:!0,preserveTokens:!0},{locale:"es",label:"Spanish",minLengthRatio:.7,maxLengthRatio:1.7,requireDifferentFromSource:!0,preserveTokens:!0},{locale:"it",label:"Italian",minLengthRatio:.7,maxLengthRatio:1.7,requireDifferentFromSource:!0,preserveTokens:!0},{locale:"ja",label:"Japanese",minLengthRatio:.45,maxLengthRatio:1.2,requireDifferentFromSource:!0,preserveTokens:!0},{locale:"zh",label:"Chinese",minLengthRatio:.4,maxLengthRatio:1.2,requireDifferentFromSource:!0,preserveTokens:!0}],O1={panelTitle:"Translation Workflow",panelAriaLabel:"Translation workflow panel",sourceLocaleLabel:"Source Locale",targetLocaleLabel:"Target Locale",validateText:"Validate Locale",captureSourceText:"Capture Source",lockSelectedText:"Lock Selected",unlockSelectedText:"Unlock Selected",lockSegmentAriaLabel:"Lock segment",unlockSegmentAriaLabel:"Unlock segment",realtimeOnText:"Realtime On",realtimeOffText:"Realtime Off",closeText:"Close",summaryPrefix:"Locale QA",noIssuesText:"No locale validation issues.",issuesLabel:"Locale issues",segmentsLabel:"Segments",sourcePreviewLabel:"Source",targetPreviewLabel:"Target",helperText:"Select segments, lock finalized ones, and run locale validation before handoff.",shortcutText:"Shortcuts: Ctrl/Cmd+Alt+Shift+L (panel), Ctrl/Cmd+Alt+Shift+V (validate), Ctrl/Cmd+Alt+Shift+K (lock segment)",readonlySegmentMessage:"This segment is locked. Unlock before editing.",sourceCapturedMessage:"Source snapshot captured from current content.",selectedSegmentPrefix:"Selected Segment",missingTargetMessage:"Segment is empty in target locale.",tokenMismatchMessage:"Tokens/placeholders do not match source segment.",untranslatedMessage:"Segment appears untranslated (same as source).",lengthOutOfRangeMessage:"Translation length is outside expected locale range."},M=new WeakMap,Hi=new WeakMap,Wn=new WeakMap,fe=new Map,za=new WeakMap,cl=new WeakMap,qa=new Set;let fi=0,z1=0,Wd=0,q1=0,Ee=null,Se=null,Or=null,zr=null,qr=null,_r=null,pn=null,Fr=null;function V(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function _1(e){return e.replace(/\u00A0/g," ").replace(/\s+/g," ").trim()}function Rn(e,t,n){return Number.isFinite(e)?Math.max(t,Math.min(n,e)):t}function Vt(e){return(e||"").trim()||"en-US"}function ea(e){return e.trim().toLowerCase()}function F1(e){return e.replace(/"/g,"&quot;")}function j1(e,t=120){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1)).trimEnd()}…`}function Kd(e){const t=e.match(/\{\{[^{}]+\}\}|%[A-Z0-9_]+%|\$\{[^{}]+\}/gi);return!t||t.length===0?[]:t.map(n=>n.trim()).filter(Boolean)}function V1(e,t){const n=Kd(e).sort(),r=Kd(t).sort();if(n.length!==r.length)return!1;for(let o=0;o<n.length;o+=1)if(n[o]!==r[o])return!1;return!0}function W1(e,t){const n=Array.isArray(t)&&t.length>0?t:Vd,r=[],o=new Set;return n.forEach(a=>{const i=ea(a.locale||"");if(!i)return;const l=i;o.has(l)||(o.add(l),r.push({locale:l,label:(a.label||i).trim()||i,minLengthRatio:Rn(Number(a.minLengthRatio??.5),.1,3),maxLengthRatio:Rn(Number(a.maxLengthRatio??1.8),.2,4),requireDifferentFromSource:a.requireDifferentFromSource!==!1,preserveTokens:a.preserveTokens!==!1}))}),e.forEach(a=>{const i=ea(a);if(o.has(i))return;const l=Vd.find(s=>i.startsWith(s.locale));r.push(l?{...l,locale:i,label:a}:{locale:i,label:a,minLengthRatio:.5,maxLengthRatio:1.8,requireDifferentFromSource:!0,preserveTokens:!0})}),r}function Oi(e={}){const t=e.normalizeText||_1,n=Vt(e.sourceLocale||"en-US"),r=Vt(e.targetLocale||"fr-FR"),o=new Set([n,r]);(Array.isArray(e.locales)?e.locales:[]).forEach(l=>{if(typeof l!="string")return;const s=Vt(l);s&&o.add(s)});const a=Array.from(o),i=W1(a,e.localeRules);return{sourceLocale:n,targetLocale:r,locales:a,localeRules:i,enableRealtime:e.enableRealtime!==!1,debounceMs:Rn(Number(e.debounceMs??260),60,2e3),maxIssues:Rn(Number(e.maxIssues??120),5,1e3),maxSegments:Rn(Number(e.maxSegments??600),20,3e3),minSourceLengthForRatio:Rn(Number(e.minSourceLengthForRatio??8),2,100),segmentSelector:(e.segmentSelector||jd).trim()||jd,labels:{...O1,...e.labels||{}},normalizeText:t}}function K1(e){return{sourceLocale:e.sourceLocale,targetLocale:e.targetLocale,locales:[...e.locales],localeRules:e.localeRules.map(t=>({locale:t.locale,label:t.label,minLengthRatio:t.minLengthRatio,maxLengthRatio:t.maxLengthRatio,requireDifferentFromSource:t.requireDifferentFromSource,preserveTokens:t.preserveTokens})),enableRealtime:e.enableRealtime,debounceMs:e.debounceMs,maxIssues:e.maxIssues,maxSegments:e.maxSegments,minSourceLengthForRatio:e.minSourceLengthForRatio,segmentSelector:e.segmentSelector,labels:{...e.labels},normalizeText:e.normalizeText}}function $c(e){return e.closest(Tc)||e}function Ca(e){if(!e)return null;if(e.matches(Oe))return e;const t=e.querySelector(Oe);return t instanceof HTMLElement?t:null}function U1(){if(typeof window>"u")return null;const e=window[_d];if(!(e instanceof HTMLElement))return null;window[_d]=null;const t=Ca(e);if(t)return t;const n=e.closest(Tc);if(n){const o=Ca(n);if(o)return o}const r=e.closest(Oe);return r instanceof HTMLElement?r:null}function G1(e){const t=e.closest("[data-editora-editor]");if(t&&Ca(t)===e)return t;let n=e;for(;n;){if(n.matches(Tc)&&(n===e||Ca(n)===e))return n;n=n.parentElement}return $c(e)}function Ym(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function pi(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function Z1(e){const t=$c(e);if(pi(t))return!0;const n=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return pi(n)?!0:pi(document.documentElement)||pi(document.body)}function Is(e,t){e.classList.remove("rte-translation-workflow-theme-dark"),Z1(t)&&e.classList.add("rte-translation-workflow-theme-dark")}function Y1(e){var t,n,r,o;for(let a=0;a<e.length;a+=1){const i=e[a];if(!(i.type!=="childList"||i.removedNodes.length===0))for(let l=0;l<i.removedNodes.length;l+=1){const s=i.removedNodes[l];if(s.nodeType!==Node.ELEMENT_NODE)continue;const c=s;if((t=c.matches)!=null&&t.call(c,Oe)||(n=c.matches)!=null&&n.call(c,`.${R}`)||(r=c.querySelector)!=null&&r.call(c,Oe)||(o=c.querySelector)!=null&&o.call(c,`.${R}`))return!0}}return!1}function zi(){Array.from(qa).forEach(t=>{t.isConnected||Ac(t)})}function it(e,t=!0,n=!0){var l;if(zi(),(e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const s=Ca(e.editorElement);if(s)return s}const r=U1();if(r)return r;const o=window.getSelection();if(o&&o.rangeCount>0){const s=(l=Ym(o.getRangeAt(0).startContainer))==null?void 0:l.closest(Oe);if(s)return s}const a=document.activeElement;if(a){if(a.matches(Oe))return a;const s=a.closest(Oe);if(s)return s}if(n&&Se&&Se.isConnected)return Se;if(!t)return null;const i=document.querySelector(Oe);return i instanceof HTMLElement?i:null}function X1(e){const t=e.target;if(t){const r=t.closest(`.${R}`);if(r){const a=Array.from(fe.entries()).find(([,i])=>i===r);if(a)return a[0]}const o=t.closest(Oe);if(o)return o}const n=document.activeElement;if(n){const r=n.closest(`.${R}`);if(r){const a=Array.from(fe.entries()).find(([,i])=>i===r);if(a)return a[0]}const o=n.closest(Oe);if(o)return o}return null}function is(e,t,n){const r=G1(e);Array.from(r.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",n),a.setAttribute("data-active",n?"true":"false"),a.setAttribute("aria-pressed",n?"true":"false")})}function Lc(e){const t=cl.get(e);typeof t=="number"&&(window.clearTimeout(t),cl.delete(e))}function J1(e,t){const n=ea(t),r=e.localeRules.find(i=>ea(i.locale)===n);if(r)return r;const o=n.split("-")[0],a=e.localeRules.find(i=>ea(i.locale).split("-")[0]===o);return a||{locale:n,label:t,minLengthRatio:.5,maxLengthRatio:1.8,requireDifferentFromSource:!0,preserveTokens:!0}}function mi(e,t,n,r={}){return Wd+=1,{id:`translation-workflow-issue-${Wd}`,type:e,severity:t,message:n,...r}}function Il(e,t){if(t){e.hasAttribute("data-translation-prev-contenteditable")||e.setAttribute("data-translation-prev-contenteditable",e.hasAttribute("contenteditable")&&e.getAttribute("contenteditable")||"inherit"),e.setAttribute("data-translation-locked","true"),e.setAttribute("contenteditable","false"),e.setAttribute("aria-readonly","true"),e.classList.add("rte-translation-segment-locked");return}if(e.removeAttribute("data-translation-locked"),e.removeAttribute("aria-readonly"),e.classList.remove("rte-translation-segment-locked"),e.hasAttribute("data-translation-prev-contenteditable")){const n=e.getAttribute("data-translation-prev-contenteditable")||"";n==="inherit"?e.setAttribute("contenteditable","true"):e.setAttribute("contenteditable",n),e.removeAttribute("data-translation-prev-contenteditable")}else e.setAttribute("contenteditable","true")}function Hl(e,t){return e.querySelector(`[data-translation-segment-id="${F1(t)}"]`)}function Xm(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const n=Ym(t.getRangeAt(0).startContainer);return!n||!e.contains(n)?null:n.closest("[data-translation-segment-id]")}function Q1(e,t){const n=Array.from(e.querySelectorAll(t));if(n.length<=1)return n;const r=new Set(n);return n.filter(o=>{let a=o.parentElement;for(;a&&a!==e;){if(r.has(a))return!1;a=a.parentElement}return!0})}function ev(e,t,n){let r=(n||"").trim();if(!r||t.has(r)){do r=`translation-segment-${z1++}`;while(t.has(r));e.setAttribute("data-translation-segment-id",r)}return r}function Hs(e,t){if(t.lockedSegmentIds.size===0)return!1;let n=!1;return t.lockedSegmentIds.forEach(r=>{const o=Hl(e,r);if(!o)return;Il(o,!0);const a=t.lockedHtmlBySegmentId.get(r);if(typeof a=="string"){o.innerHTML!==a&&(o.innerHTML=a,n=!0);return}t.lockedHtmlBySegmentId.set(r,o.innerHTML)}),n}function En(e,t,n){var i;const r=Q1(e,t.segmentSelector),o=[],a=new Set;for(let l=0;l<r.length&&!(o.length>=t.maxSegments);l+=1){const s=r[l],c=ev(s,a,s.getAttribute("data-translation-segment-id")),d=n.lockedSegmentIds.has(c),u=s.getAttribute("data-translation-locked")==="true",f=d||u;if(f)if(n.lockedSegmentIds.add(c),Il(s,!0),!n.lockedHtmlBySegmentId.has(c))n.lockedHtmlBySegmentId.set(c,s.innerHTML);else{const p=n.lockedHtmlBySegmentId.get(c)||"";s.innerHTML!==p&&(s.innerHTML=p)}else n.lockedHtmlBySegmentId.delete(c);const m=t.normalizeText(s.textContent||"");if(!m)continue;n.sourceTextBySegmentId.has(c)||n.sourceTextBySegmentId.set(c,m);const g=n.sourceTextBySegmentId.get(c)||m;o.push({id:c,tagName:s.tagName.toLowerCase(),index:o.length,text:m,sourceText:g,locked:f}),a.add(c)}return Array.from(n.sourceTextBySegmentId.keys()).forEach(l=>{a.has(l)||n.sourceTextBySegmentId.delete(l)}),Array.from(n.lockedSegmentIds.keys()).forEach(l=>{a.has(l)||n.lockedSegmentIds.delete(l)}),Array.from(n.lockedHtmlBySegmentId.keys()).forEach(l=>{(!a.has(l)||!n.lockedSegmentIds.has(l))&&n.lockedHtmlBySegmentId.delete(l)}),(!n.selectedSegmentId||!o.some(l=>l.id===n.selectedSegmentId))&&(n.selectedSegmentId=((i=o[0])==null?void 0:i.id)||null),o}function Z(e,t){M.has(e)||M.set(e,t);let n=Wn.get(e);return n||(n={sourceLocale:t.sourceLocale,targetLocale:t.targetLocale,selectedSegmentId:null,realtimeEnabled:t.enableRealtime,segments:[],issues:[],sourceTextBySegmentId:new Map,lockedSegmentIds:new Set,lockedHtmlBySegmentId:new Map,snapshot:"",lastRunAt:null},Wn.set(e,n)),qa.add(e),n}function Ac(e){Lc(e);const t=fe.get(e);t&&t.remove(),fe.delete(e),za.delete(e);const n=Wn.get(e);n&&(n.lockedSegmentIds.forEach(r=>{const o=Hl(e,r);o&&Il(o,!1)}),n.lockedHtmlBySegmentId.clear()),M.delete(e),Hi.delete(e),Wn.delete(e),qa.delete(e),Se===e&&(Se=null)}function Mc(e){return za.get(e)===!0}function Os(e,t){if(!t.classList.contains("show"))return;const n=$c(e).getBoundingClientRect(),r=Math.min(window.innerWidth-20,520),o=Math.max(10,window.innerWidth-r-10),a=Math.min(Math.max(10,n.right-r),o),i=Math.max(10,Math.min(window.innerHeight-10,n.top+12));t.style.width=`${r}px`,t.style.left=`${a}px`,t.style.top=`${i}px`,t.style.maxHeight=`${Math.max(260,window.innerHeight-20)}px`}function Dn(e,t){const n=e.querySelector(".rte-translation-live");n&&(n.textContent=t)}function tv(e,t){return`${e.innerHTML}::${t.sourceLocale}::${t.targetLocale}::${Array.from(t.lockedSegmentIds).sort().join("|")}`}function nv(e,t,n){const r=[],o=J1(n,t.targetLocale);for(let a=0;a<e.length&&!(r.length>=n.maxIssues);a+=1){const i=e[a],l=n.normalizeText(i.sourceText||""),s=n.normalizeText(i.text||"");if(!s){r.push(mi("missing-target","error",n.labels.missingTargetMessage,{segmentId:i.id,sourceText:l,targetText:s,suggestion:"Provide translated content for this segment before export."}));continue}if(o.preserveTokens&&l&&!V1(l,s)&&(r.push(mi("token-mismatch","error",n.labels.tokenMismatchMessage,{segmentId:i.id,sourceText:l,targetText:s,suggestion:"Preserve placeholders/tokens exactly (for example {{name}}, %ID%, ${value})."})),r.length>=n.maxIssues)||o.requireDifferentFromSource&&l&&n.normalizeText(l)===n.normalizeText(s)&&(r.push(mi("untranslated","warning",n.labels.untranslatedMessage,{segmentId:i.id,sourceText:l,targetText:s,suggestion:"Translate the segment or mark it intentionally unchanged."})),r.length>=n.maxIssues))break;if(l.length>=n.minSourceLengthForRatio){const c=s.length/Math.max(1,l.length);(c<o.minLengthRatio||c>o.maxLengthRatio)&&r.push(mi("length-out-of-range","warning",n.labels.lengthOutOfRangeMessage,{segmentId:i.id,sourceText:l,targetText:s,suggestion:`Expected ratio for ${o.label}: ${o.minLengthRatio.toFixed(2)} - ${o.maxLengthRatio.toFixed(2)}.`}))}}return r}function Jm(e){const t=M.get(e)||Ee,n=Wn.get(e);return{sourceLocale:(n==null?void 0:n.sourceLocale)||(t==null?void 0:t.sourceLocale)||"en-US",targetLocale:(n==null?void 0:n.targetLocale)||(t==null?void 0:t.targetLocale)||"fr-FR",realtimeEnabled:(n==null?void 0:n.realtimeEnabled)===!0,selectedSegmentId:(n==null?void 0:n.selectedSegmentId)||null,segmentCount:(n==null?void 0:n.segments.length)||0,lockedSegmentCount:n?n.segments.filter(r=>r.locked).length:0,issues:n!=null&&n.issues?n.issues.map(r=>({...r})):[],segments:(n==null?void 0:n.segments.map(r=>({id:r.id,tagName:r.tagName,index:r.index,sourceLength:r.sourceText.length,targetLength:r.text.length,locked:r.locked})))||[],lastRunAt:(n==null?void 0:n.lastRunAt)||null}}function Dt(e){const t=Wn.get(e),n=t&&t.selectedSegmentId?t.segments.find(r=>r.id===t.selectedSegmentId):null;is(e,"toggleTranslationWorkflowPanel",Mc(e)),is(e,"toggleTranslationRealtime",(t==null?void 0:t.realtimeEnabled)===!0),is(e,"toggleTranslationSegmentLock",(n==null?void 0:n.locked)===!0)}function rv(e,t){const n=Hl(e,t);if(!n)return;try{n.scrollIntoView({block:"nearest",inline:"nearest"})}catch{}const r=window.getSelection();if(!(!r||typeof document.createRange!="function"))try{const o=document.createRange();o.selectNodeContents(n),o.collapse(!0),r.removeAllRanges(),r.addRange(o),e.focus({preventScroll:!0})}catch{}}function Gt(e){const t=fe.get(e);if(!t)return;const n=M.get(e)||Ee;if(!n)return;const r=Z(e,n),o=t.querySelector(".rte-translation-source-label");o&&(o.textContent=n.labels.sourceLocaleLabel);const a=t.querySelector(".rte-translation-target-label");a&&(a.textContent=n.labels.targetLocaleLabel);const i=t.querySelector('[data-field="source-locale"]'),l=t.querySelector('[data-field="target-locale"]'),s=n.locales.map(w=>`<option value="${V(w)}">${V(w)}</option>`).join("");i&&(i.innerHTML=s,i.value=r.sourceLocale),l&&(l.innerHTML=s,l.value=r.targetLocale);const c=t.querySelector(".rte-translation-summary");if(c){const w=r.issues.length,v=r.selectedSegmentId?` • ${n.labels.selectedSegmentPrefix}: ${r.selectedSegmentId}`:"";c.textContent=`${n.labels.summaryPrefix}: ${r.sourceLocale} → ${r.targetLocale} • ${w} issue${w===1?"":"s"}${v}`}const d=t.querySelector(".rte-translation-helper");d&&(d.textContent=n.labels.helperText);const u=t.querySelector(".rte-translation-shortcut");u&&(u.textContent=n.labels.shortcutText);const f=t.querySelector('[data-action="run-validation"]');f&&(f.textContent=n.labels.validateText);const m=t.querySelector('[data-action="capture-source"]');m&&(m.textContent=n.labels.captureSourceText);const g=t.querySelector('[data-action="toggle-realtime"]');g&&(g.textContent=r.realtimeEnabled?n.labels.realtimeOnText:n.labels.realtimeOffText,g.setAttribute("aria-pressed",r.realtimeEnabled?"true":"false"));const p=t.querySelector('[data-action="lock-selected"]'),b=r.selectedSegmentId&&r.segments.find(w=>w.id===r.selectedSegmentId)||null;p&&(p.textContent=b!=null&&b.locked?n.labels.unlockSelectedText:n.labels.lockSelectedText,p.disabled=!b,p.setAttribute("aria-pressed",b!=null&&b.locked?"true":"false"));const h=t.querySelector('[data-action="close"]');h&&h.setAttribute("aria-label",n.labels.closeText);const x=t.querySelector(".rte-translation-issues"),C=t.querySelector(".rte-translation-empty");x&&(x.setAttribute("aria-label",n.labels.issuesLabel),r.issues.length===0?(x.innerHTML="",C&&(C.hidden=!1,C.textContent=n.labels.noIssuesText)):(C&&(C.hidden=!0),x.innerHTML=r.issues.map(w=>`
            <li class="rte-translation-issue ${w.severity==="error"?"error":w.severity==="warning"?"warning":"info"}" role="listitem" data-segment-id="${V(w.segmentId||"")}">
              <p class="rte-translation-issue-message">${V(w.message)}</p>
              ${w.suggestion?`<p class="rte-translation-issue-suggestion">${V(w.suggestion)}</p>`:""}
            </li>
          `).join("")));const k=t.querySelector(".rte-translation-segments");k&&(k.setAttribute("aria-label",n.labels.segmentsLabel),k.innerHTML=r.segments.map(w=>{const v=w.id===r.selectedSegmentId?"selected":"",E=w.locked?"locked":"";return`
          <li class="rte-translation-segment-item ${v} ${E}" role="option" aria-selected="${w.id===r.selectedSegmentId?"true":"false"}" data-segment-id="${V(w.id)}">
            <button type="button" class="rte-translation-segment-select" data-action="select-segment" data-segment-id="${V(w.id)}" title="${V(w.text)}">
              <span class="rte-translation-segment-meta">#${w.index+1} • ${V(w.tagName)}</span>
              <span class="rte-translation-segment-text">${V(j1(w.text,110))}</span>
            </button>
            <button type="button" class="rte-translation-segment-lock" data-action="toggle-lock" data-segment-id="${V(w.id)}" aria-label="${w.locked?n.labels.unlockSegmentAriaLabel:n.labels.lockSegmentAriaLabel}" aria-pressed="${w.locked?"true":"false"}"></button>
          </li>
        `}).join(""));const T=t.querySelector(".rte-translation-source-preview"),L=t.querySelector(".rte-translation-target-preview");if(T||L){const w=r.selectedSegmentId&&r.segments.find(v=>v.id===r.selectedSegmentId)||null;T&&(T.textContent=(w==null?void 0:w.sourceText)||"—",T.setAttribute("aria-label",n.labels.sourcePreviewLabel)),L&&(L.textContent=(w==null?void 0:w.text)||"—",L.setAttribute("aria-label",n.labels.targetPreviewLabel))}t.setAttribute("aria-label",n.labels.panelAriaLabel)}function Qm(e){const t=M.get(e)||Ee;if(!t)return;Lc(e);const n=window.setTimeout(()=>{cl.delete(e),rt(e,"realtime",!1)},t.debounceMs);cl.set(e,n)}function rt(e,t,n){const r=M.get(e)||Ee;if(!r)return[];const o=Z(e,r),a=Hs(e,o);o.segments=En(e,r,o);const i=tv(e,o);if(!n&&o.snapshot===i)return o.issues;o.issues=nv(o.segments,o,r),o.lastRunAt=new Date().toISOString(),o.snapshot=i,Gt(e),Dt(e),e.dispatchEvent(new CustomEvent("editora:translation-workflow-validation",{bubbles:!0,detail:{reason:t,state:Jm(e)}}));const l=fe.get(e);if(l){if(a)return Dn(l,r.labels.readonlySegmentMessage),o.issues;Dn(l,o.issues.length===0?r.labels.noIssuesText:`${o.issues.length} issue${o.issues.length===1?"":"s"} detected.`)}return o.issues}function eg(e){const t=M.get(e)||Ee;if(!t)return!1;const n=Z(e,t),r=En(e,t,n);r.forEach(a=>{n.sourceTextBySegmentId.set(a.id,a.text)}),n.snapshot="",rt(e,"capture-source",!0);const o=fe.get(e);return o&&Dn(o,t.labels.sourceCapturedMessage),e.dispatchEvent(new CustomEvent("editora:translation-source-captured",{bubbles:!0,detail:{sourceLocale:n.sourceLocale,segmentCount:r.length}})),!0}function dl(e,t,n){var c,d;const r=M.get(e)||Ee;if(!r)return!1;const o=Z(e,r);o.segments=En(e,r,o);const a=((c=Xm(e))==null?void 0:c.getAttribute("data-translation-segment-id"))||null,i=t||a||o.selectedSegmentId||((d=o.segments[0])==null?void 0:d.id)||null;if(!i)return!1;const l=Hl(e,i);if(!l)return!1;const s=typeof n=="boolean"?n:!o.lockedSegmentIds.has(i);return s?(o.lockedSegmentIds.add(i),o.lockedHtmlBySegmentId.set(i,l.innerHTML)):(o.lockedSegmentIds.delete(i),o.lockedHtmlBySegmentId.delete(i)),Il(l,s),o.selectedSegmentId=i,o.snapshot="",rt(e,"lock-segment",!0),e.dispatchEvent(new CustomEvent("editora:translation-segment-lock",{bubbles:!0,detail:{segmentId:i,locked:s}})),!0}function tg(e,t){const n=M.get(e)||Ee;if(!n)return!1;const r=Z(e,n),o=typeof t=="boolean"?t:!r.realtimeEnabled;return r.realtimeEnabled=o,o?Qm(e):Lc(e),Gt(e),Dt(e),!0}function zs(e,t,n=!0){const r=M.get(e)||Ee;if(!r)return!1;const o=Z(e,r);return o.segments=En(e,r,o),o.segments.some(a=>a.id===t)?(o.selectedSegmentId=t,Gt(e),Dt(e),n&&rv(e,t),!0):!1}function gi(e,t){const n=M.get(e)||Ee;if(!n)return!1;const r=Z(e,n);if(r.segments=En(e,n,r),r.segments.length===0)return!1;const o=Math.max(0,r.segments.findIndex(l=>l.id===r.selectedSegmentId));let a=o;t==="start"?a=0:t==="end"?a=r.segments.length-1:a=Rn(o+t,0,r.segments.length-1);const i=r.segments[a];return i?zs(e,i.id,!0):!1}function Sa(e,t=!1){const n=fe.get(e);n&&(n.classList.remove("show"),za.set(e,!1),Dt(e),t&&e.focus({preventScroll:!0}))}function qs(e){const t=sv(e);fe.forEach((r,o)=>{o!==e&&Sa(o,!1)}),t.classList.add("show"),za.set(e,!0),rt(e,"panel-open",!1),Gt(e),Os(e,t),Dt(e);const n=t.querySelector('[data-field="target-locale"]');n==null||n.focus()}function ng(e,t){const n=Mc(e);return(typeof t=="boolean"?t:!n)?qs(e):Sa(e,!1),!0}function ov(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="l"}function av(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="v"}function iv(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="k"}function lv(e){return e.key.length===1&&!e.metaKey&&!e.ctrlKey&&!e.altKey?!0:e.key==="Backspace"||e.key==="Delete"||e.key==="Enter"}function Ud(e){return e instanceof HTMLElement?e.closest('[data-translation-locked="true"]'):null}function sv(e){const t=fe.get(e);if(t)return t;const n=M.get(e)||Ee||Oi();Z(e,n);const r=`rte-translation-workflow-panel-${q1++}`,o=`${r}-source`,a=`${r}-target`,i=document.createElement("section");return i.className=R,i.id=r,i.setAttribute("role","dialog"),i.setAttribute("aria-modal","false"),i.setAttribute("aria-label",n.labels.panelAriaLabel),i.innerHTML=`
    <header class="rte-translation-header">
      <h2 class="rte-translation-title">${V(n.labels.panelTitle)}</h2>
      <button type="button" class="rte-translation-icon-btn" data-action="close" aria-label="${V(n.labels.closeText)}">✕</button>
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
        <section class="rte-translation-segments-wrap" aria-label="${V(n.labels.segmentsLabel)}">
          <h3 class="rte-translation-subtitle">${V(n.labels.segmentsLabel)}</h3>
          <ul class="rte-translation-segments" role="listbox" tabindex="0" aria-label="${V(n.labels.segmentsLabel)}"></ul>
        </section>
        <section class="rte-translation-preview-wrap">
          <h3 class="rte-translation-subtitle">${V(n.labels.sourcePreviewLabel)} / ${V(n.labels.targetPreviewLabel)}</h3>
          <div class="rte-translation-preview-block">
            <p class="rte-translation-preview-label">${V(n.labels.sourcePreviewLabel)}</p>
            <p class="rte-translation-source-preview"></p>
          </div>
          <div class="rte-translation-preview-block">
            <p class="rte-translation-preview-label">${V(n.labels.targetPreviewLabel)}</p>
            <p class="rte-translation-target-preview"></p>
          </div>
        </section>
      </div>
      <section class="rte-translation-issues-wrap">
        <h3 class="rte-translation-subtitle">${V(n.labels.issuesLabel)}</h3>
        <ul class="rte-translation-issues" role="list" aria-label="${V(n.labels.issuesLabel)}"></ul>
        <p class="rte-translation-empty" hidden></p>
      </section>
    </div>
    <div class="rte-translation-live" aria-live="polite" aria-atomic="true"></div>
  `,i.addEventListener("click",l=>{const s=l.target;if(!s)return;const c=s.closest("[data-action]");if(!c){const u=s.closest(".rte-translation-issue[data-segment-id]"),f=(u==null?void 0:u.getAttribute("data-segment-id"))||"";f&&zs(e,f,!0);return}const d=c.getAttribute("data-action");if(d==="close"){Sa(e,!0);return}if(d==="run-validation"){rt(e,"panel-button",!0);return}if(d==="capture-source"){eg(e);return}if(d==="lock-selected"){dl(e);return}if(d==="toggle-realtime"){tg(e);return}if(d==="select-segment"){const u=c.getAttribute("data-segment-id")||"";u&&zs(e,u,!0);return}if(d==="toggle-lock"){const u=c.getAttribute("data-segment-id")||"";u&&dl(e,u)}}),i.addEventListener("change",l=>{const s=l.target;if(!(s instanceof HTMLSelectElement))return;const c=M.get(e)||Ee;if(!c)return;const d=Z(e,c);if(s.getAttribute("data-field")==="source-locale"){d.sourceLocale=Vt(s.value),d.snapshot="",rt(e,"source-locale-change",!0);return}s.getAttribute("data-field")==="target-locale"&&(d.targetLocale=Vt(s.value),d.snapshot="",rt(e,"target-locale-change",!0))}),i.addEventListener("keydown",l=>{const s=l.target;if(l.key==="Escape"){l.preventDefault(),Sa(e,!0);return}!(s!=null&&s.closest(".rte-translation-segments"))||!Zm.has(l.key)||(l.preventDefault(),l.key==="ArrowUp"?gi(e,-1):l.key==="ArrowDown"?gi(e,1):l.key==="Home"?gi(e,"start"):l.key==="End"&&gi(e,"end"))}),Is(i,e),document.body.appendChild(i),fe.set(e,i),za.set(e,!1),Gt(e),i}function cv(e){Ee=e,Or||(Or=t=>{var s;zi();const n=t.target,r=n==null?void 0:n.closest(Oe);if(!r)return;const o=M.get(r)||e,a=Z(r,o);M.set(r,o),Se=r;const i=((s=Xm(r))==null?void 0:s.getAttribute("data-translation-segment-id"))||null;i&&(a.selectedSegmentId=i),Dt(r);const l=fe.get(r);l&&(Is(l,r),Os(r,l),Gt(r))},document.addEventListener("focusin",Or,!0)),zr||(zr=t=>{const n=t.target,r=n==null?void 0:n.closest(Oe);if(!r)return;const o=M.get(r)||Ee;if(!o)return;const a=Z(r,o),i=Hs(r,a);if(a.segments=En(r,o,a),!a.realtimeEnabled){if(i){const l=fe.get(r);l&&Dn(l,o.labels.readonlySegmentMessage)}Gt(r),Dt(r);return}Qm(r)},document.addEventListener("input",zr,!0)),qr||(qr=t=>{const n=t,r=n.target,o=r==null?void 0:r.closest(Oe);if(!o)return;const a=Ud(r);if(!a||!o.contains(a))return;n.preventDefault();const i=fe.get(o),l=M.get(o)||Ee;i&&l&&Dn(i,l.labels.readonlySegmentMessage)},document.addEventListener("beforeinput",qr,!0)),_r||(_r=t=>{if(t.defaultPrevented)return;const n=t.target;if((n==null?void 0:n.closest(`.${R}`))&&t.key!=="Escape"&&!Zm.has(t.key))return;const o=t.key==="Escape",a=ov(t),i=av(t),l=iv(t),s=Ud(n);if(!o&&!a&&!i&&!l&&!s)return;const c=X1(t);if(!c)return;const d=M.get(c)||Ee||e;if(Z(c,d),M.set(c,d),Se=c,o&&Mc(c)){t.preventDefault(),Sa(c,!0);return}if(s&&c.contains(s)&&lv(t)){t.preventDefault();const u=fe.get(c);u&&Dn(u,d.labels.readonlySegmentMessage);return}if(a){t.preventDefault(),t.stopPropagation(),ng(c);return}if(i){t.preventDefault(),t.stopPropagation(),rt(c,"shortcut",!0);return}l&&(t.preventDefault(),t.stopPropagation(),dl(c))},document.addEventListener("keydown",_r,!0)),pn||(pn=()=>{zi(),fe.forEach((t,n)=>{!n.isConnected||!t.isConnected||(Is(t,n),Os(n,t))})},window.addEventListener("scroll",pn,!0),window.addEventListener("resize",pn)),!Fr&&typeof MutationObserver<"u"&&document.body&&(Fr=new MutationObserver(t=>{Y1(t)&&zi(),t.some(r=>r.type==="characterData"?!0:r.type==="childList"&&(r.addedNodes.length>0||r.removedNodes.length>0))&&qa.forEach(r=>{const o=Wn.get(r);if(!o||o.lockedSegmentIds.size===0||!Hs(r,o))return;o.snapshot="";const i=M.get(r)||Ee,l=fe.get(r);l&&i&&Dn(l,i.labels.readonlySegmentMessage),i&&(o.segments=En(r,i,o),Gt(r),Dt(r))})}),Fr.observe(document.body,{childList:!0,subtree:!0,characterData:!0}))}function dv(){Or&&(document.removeEventListener("focusin",Or,!0),Or=null),zr&&(document.removeEventListener("input",zr,!0),zr=null),qr&&(document.removeEventListener("beforeinput",qr,!0),qr=null),_r&&(document.removeEventListener("keydown",_r,!0),_r=null),pn&&(window.removeEventListener("scroll",pn,!0),window.removeEventListener("resize",pn),pn=null),Fr&&(Fr.disconnect(),Fr=null),fe.forEach(t=>t.remove()),fe.clear(),Array.from(qa).forEach(t=>Ac(t)),Ee=null,Se=null}function uv(){if(typeof document>"u"||document.getElementById(Fd))return;const e=document.createElement("style");e.id=Fd,e.textContent=`
    .rte-toolbar-group-items.${Xe},
    .editora-toolbar-group-items.${Xe},
    .rte-toolbar-group-items.${kt},
    .editora-toolbar-group-items.${kt} {
      display: flex;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: #ffffff;
    }

    .rte-toolbar-group-items.${Xe} .rte-toolbar-button,
    .editora-toolbar-group-items.${Xe} .editora-toolbar-button,
    .rte-toolbar-group-items.${kt} .rte-toolbar-button,
    .editora-toolbar-group-items.${kt} .editora-toolbar-button {
      border: none;
      border-right: 1px solid #cbd5e1;
      border-radius: 0;
    }

    .rte-toolbar-group-items.${Xe} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${Xe} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${kt} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${kt} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    ${ye} .rte-toolbar-group-items.${Xe},
    ${ye} .editora-toolbar-group-items.${Xe},
    ${ye} .rte-toolbar-group-items.${kt},
    ${ye} .editora-toolbar-group-items.${kt} {
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
    ${ye} .rte-toolbar-group-items.${Xe} .rte-toolbar-button svg,
    ${ye} .editora-toolbar-group-items.${Xe} .editora-toolbar-button svg,
    ${ye} .rte-toolbar-group-items.${kt} .rte-toolbar-button svg,
    ${ye} .editora-toolbar-group-items.${kt} .editora-toolbar-button svg
    {
      fill: none;
    }
    ${ye} .rte-toolbar-group-items.${Xe} .rte-toolbar-button,
    ${ye} .editora-toolbar-group-items.${Xe} .editora-toolbar-button
    {
      border-color: #566275;
    }

    ${ye} .rte-toolbar-button[data-command="toggleTranslationWorkflowPanel"].active,
    ${ye} .editora-toolbar-button[data-command="toggleTranslationWorkflowPanel"].active,
    ${ye} .rte-toolbar-button[data-command="toggleTranslationSegmentLock"].active,
    ${ye} .editora-toolbar-button[data-command="toggleTranslationSegmentLock"].active, 
    ${ye} .rte-toolbar-button[data-command="toggleTranslationRealtime"].active,
    ${ye} .editora-toolbar-button[data-command="toggleTranslationRealtime"].active {
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

    ${ye} [data-translation-locked="true"].rte-translation-segment-locked {
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
  `,document.head.appendChild(e)}const fv=(e={})=>{const t=Oi(e),n=new Set;return uv(),{name:"translationWorkflow",toolbar:[{id:"translationWorkflowGroup",label:"Translation Workflow",type:"group",command:"translationWorkflow",items:[{id:"toggleTranslationWorkflowPanel",label:"Translation Workflow",command:"toggleTranslationWorkflowPanel",shortcut:"Mod-Alt-Shift-l",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4 6.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H8l-4 3V6.5Z" stroke="currentColor" stroke-width="1.6"/><path d="M20 17.5a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-1.5" stroke="currentColor" stroke-width="1.6"/><path d="m13 8 2 2m0 0 2-2m-2 2V4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'},{id:"runTranslationLocaleValidation",label:"Run Locale Validation",command:"runTranslationLocaleValidation",shortcut:"Mod-Alt-Shift-v",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="4.5" y="4" width="12" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 8h5.5M8 11h4M8 14h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="m15.5 15.5 1.7 1.7 3.3-3.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'},{id:"toggleTranslationSegmentLock",label:"Toggle Segment Lock",command:"toggleTranslationSegmentLock",shortcut:"Mod-Alt-Shift-k",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8.5 10V7.5a3.5 3.5 0 1 1 7 0V10" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="15" r="1.2" fill="currentColor"/></svg>'},{id:"toggleTranslationRealtime",label:"Toggle Translation Realtime",command:"toggleTranslationRealtime",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 1 7.5 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9.5 19.5H5.5v-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8v4l2.5 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'}]}],commands:{translationWorkflow:(r,o)=>{const a=it(o,!1,!1);if(!a)return!1;const i=M.get(a)||t;return Z(a,i),M.set(a,i),Se=a,qs(a),!0},openTranslationWorkflowPanel:(r,o)=>{const a=it(o,!1,!1);if(!a)return!1;const i=M.get(a)||t;return Z(a,i),M.set(a,i),Se=a,qs(a),!0},toggleTranslationWorkflowPanel:(r,o)=>{const a=it(o,!1,!1);if(!a)return!1;const i=M.get(a)||t;return Z(a,i),M.set(a,i),Se=a,ng(a,typeof r=="boolean"?r:void 0)},runTranslationLocaleValidation:(r,o)=>{const a=it(o,!1,!1);if(!a)return!1;const i=M.get(a)||t;return Z(a,i),M.set(a,i),Se=a,rt(a,"command",!0),!0},toggleTranslationRealtime:(r,o)=>{const a=it(o,!1,!1);if(!a)return!1;const i=M.get(a)||t;return Z(a,i),M.set(a,i),Se=a,tg(a,typeof r=="boolean"?r:void 0)},toggleTranslationSegmentLock:(r,o)=>{const a=it(o,!1,!1);if(!a)return!1;const i=M.get(a)||t;Z(a,i),M.set(a,i),Se=a;const l=typeof r=="boolean"?r:r==null?void 0:r.locked,s=typeof r=="object"?r==null?void 0:r.segmentId:void 0;return dl(a,s,l)},setTranslationLocales:(r,o)=>{const a=it(o,!1,!1);if(!a||!r||typeof r!="object")return!1;const i=M.get(a)||t,l=Z(a,i);return M.set(a,i),typeof r.sourceLocale=="string"&&r.sourceLocale.trim()&&(l.sourceLocale=Vt(r.sourceLocale)),typeof r.targetLocale=="string"&&r.targetLocale.trim()&&(l.targetLocale=Vt(r.targetLocale)),l.snapshot="",rt(a,"set-locales",!0),!0},captureTranslationSourceSnapshot:(r,o)=>{const a=it(o,!1,!1);if(!a)return!1;const i=M.get(a)||t;return Z(a,i),M.set(a,i),Se=a,eg(a)},setTranslationWorkflowOptions:(r,o)=>{const a=it(o,!1,!1);if(!a||!r||typeof r!="object")return!1;const i=M.get(a)||t,l=Hi.get(a)||K1(i),s={...l,...r,labels:{...l.labels||{},...r.labels||{}},localeRules:Array.isArray(r.localeRules)?r.localeRules:l.localeRules,locales:Array.isArray(r.locales)?r.locales:l.locales,normalizeText:r.normalizeText||i.normalizeText},c=Oi(s);M.set(a,c),Hi.set(a,s);const d=Z(a,c);return typeof r.enableRealtime=="boolean"&&(d.realtimeEnabled=r.enableRealtime),typeof r.sourceLocale=="string"&&r.sourceLocale.trim()&&(d.sourceLocale=Vt(r.sourceLocale)),typeof r.targetLocale=="string"&&r.targetLocale.trim()&&(d.targetLocale=Vt(r.targetLocale)),d.snapshot="",rt(a,"set-options",!0),Gt(a),Dt(a),!0},getTranslationWorkflowState:(r,o)=>{const a=it(o,!1,!1);if(!a)return!1;const i=M.get(a)||t;Z(a,i);const l=Jm(a);if(typeof r=="function")try{r(l)}catch{}return a.__translationWorkflowState=l,a.dispatchEvent(new CustomEvent("editora:translation-workflow-state",{bubbles:!0,detail:l})),!0}},keymap:{"Mod-Alt-Shift-l":"toggleTranslationWorkflowPanel","Mod-Alt-Shift-L":"toggleTranslationWorkflowPanel","Mod-Alt-Shift-v":"runTranslationLocaleValidation","Mod-Alt-Shift-V":"runTranslationLocaleValidation","Mod-Alt-Shift-k":"toggleTranslationSegmentLock","Mod-Alt-Shift-K":"toggleTranslationSegmentLock"},init:function(o){fi+=1;const a=this&&typeof this.__pluginConfig=="object"?{...e,...this.__pluginConfig}:e,i=Oi(a);cv(i);const l=it(o!=null&&o.editorElement?{editorElement:o.editorElement}:void 0,!1,!1);if(!l)return;Se=l,n.add(l);const s=Z(l,i);M.set(l,i),Hi.set(l,a),s.segments=En(l,i,s),rt(l,"init",!0),Dt(l)},destroy:()=>{n.forEach(r=>Ac(r)),n.clear(),fi=Math.max(0,fi-1),!(fi>0)&&dv()}}};function pv(e,t){const n=Array.from({length:t}).map(()=>"<th><p><br></p></th>").join(""),r=Array.from({length:e}).map(()=>`<tr>${Array.from({length:t}).map(()=>"<td><p><br></p></td>").join("")}</tr>`).join("");return`<table class="rte-table"><thead><tr>${n}</tr></thead><tbody>${r}</tbody></table><p><br></p>`}function mv(){return[{id:"paragraph",label:"Paragraph",description:"Switch to paragraph text",command:"paragraph",keywords:["text","normal","p"]},{id:"h1",label:"Heading 1",description:"Large section heading",command:"heading1",keywords:["title","header","h1"]},{id:"h2",label:"Heading 2",description:"Medium section heading",command:"heading2",keywords:["subtitle","header","h2"]},{id:"h3",label:"Heading 3",description:"Small section heading",command:"heading3",keywords:["header","h3"]},{id:"bulleted-list",label:"Bulleted List",description:"Create a bullet list",command:"toggleBulletList",keywords:["list","ul","bullet"]},{id:"numbered-list",label:"Numbered List",description:"Create a numbered list",command:"toggleOrderedList",keywords:["list","ol","numbered"]},{id:"blockquote",label:"Blockquote",description:"Insert a quote block",command:"toggleBlockquote",keywords:["quote","citation"]},{id:"table-3x3",label:"Table 3x3",description:"Insert a 3 x 3 table",action:({insertHTML:e})=>e(pv(3,3)),keywords:["table","grid","rows","columns"]},{id:"horizontal-rule",label:"Divider",description:"Insert a horizontal rule",command:"insertHorizontalRule",keywords:["hr","separator","line"]},{id:"bold",label:"Bold",description:"Toggle bold formatting",command:"toggleBold",keywords:["strong","b"]},{id:"italic",label:"Italic",description:"Toggle italic formatting",command:"toggleItalic",keywords:["emphasis","i"]},{id:"underline",label:"Underline",description:"Toggle underline formatting",command:"toggleUnderline",keywords:["u"]},{id:"strikethrough",label:"Strikethrough",description:"Toggle strikethrough formatting",command:"toggleStrikethrough",keywords:["strike","s"]},{id:"clear-formatting",label:"Clear Formatting",description:"Remove text formatting",command:"clearFormatting",keywords:["reset","plain"]}]}function gv(e){const t=[],n=new Set;return e.forEach(r=>{const o=String(r.id||"").trim(),a=String(r.label||"").trim();!o||!a||n.has(o)||(n.add(o),t.push({...r,id:o,label:a,description:r.description?String(r.description):void 0,keywords:Array.isArray(r.keywords)?r.keywords.map(i=>String(i)).filter(Boolean):void 0}))}),t}function bv(e){const t=(e.triggerChar||"/")[0]||"/",n=e.includeDefaultItems!==!1,r=n?[...e.items||[],...mv()]:e.items||[];return{triggerChar:t,minChars:Math.max(0,e.minChars??0),maxQueryLength:Math.max(1,e.maxQueryLength??48),maxSuggestions:Math.max(1,e.maxSuggestions??10),requireBoundary:e.requireBoundary!==!1,includeDefaultItems:n,items:gv(r),itemRenderer:e.itemRenderer||(o=>o.label),emptyStateText:e.emptyStateText||"No commands found",panelLabel:e.panelLabel||"Slash commands"}}const Zn='[data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark';let Gd=!1;function hv(){if(Gd||typeof document>"u")return;Gd=!0;const e=document.createElement("style");e.id="rte-slash-commands-styles",e.textContent=`
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

    ${Zn} .rte-slash-panel {
      border-color: #364152;
      background: #1f2937;
      box-shadow: 0 22px 44px rgba(0, 0, 0, 0.48);
    }

    ${Zn} .rte-slash-item {
      color: #e5e7eb;
    }

    ${Zn} .rte-slash-item:hover,
    ${Zn} .rte-slash-item.active {
      background: #334155;
      color: #bfdbfe;
    }

    ${Zn} .rte-slash-item-description,
    ${Zn} .rte-slash-empty {
      color: #9ca3af;
    }
  `,document.head.appendChild(e)}const Ht=".rte-content, .editora-content",Ta=new WeakMap,ul=new WeakMap;let fl=!1,ta=null,bi=0,yv=0;function xv(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function rg(e){return e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||e}function vv(e){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const r=e.editorElement;if(r.matches(Ht))return r;const o=r.querySelector(Ht);if(o instanceof HTMLElement)return o}const t=window.getSelection();if(t&&t.rangeCount>0){const r=t.getRangeAt(0).startContainer,o=r.nodeType===Node.ELEMENT_NODE?r:r.parentElement,a=o==null?void 0:o.closest(Ht);if(a)return a}const n=document.activeElement;if(n){if(n.matches(Ht))return n;const r=n.closest(Ht);if(r)return r}return document.querySelector(Ht)}function bo(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function kv(e){return e?/\s|[([{"'`]/.test(e):!0}function Rc(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const n=t.getRangeAt(0);return e.contains(n.commonAncestorContainer)?n.cloneRange():null}function Ol(e,t){const n=window.getSelection();n&&(n.removeAllRanges(),n.addRange(t),e.focus({preventScroll:!0}))}function wv(e){if(!e.collapsed)return null;const t=e.startContainer,n=e.startOffset;if(t.nodeType===Node.TEXT_NODE){const r=t;return{node:r,textBefore:r.data.slice(0,n),caretOffset:n}}if(t.nodeType===Node.ELEMENT_NODE){const r=t;if(n>0){const o=r.childNodes[n-1];if(o&&o.nodeType===Node.TEXT_NODE){const a=o;return{node:a,textBefore:a.data,caretOffset:a.length}}}}return null}function Ev(e,t,n,r){const o=e.lastIndexOf(t);if(o<0||r&&!kv(e[o-1]))return null;const a=e.slice(o+1);return/\s/.test(a)||a.length>n?null:{trigger:t,query:a,startOffset:o}}function Cv(e,t){const n=t.cloneRange();n.collapse(!1);const r=n.getClientRects();if(r.length>0)return r[r.length-1];const o=document.createElement("span");o.textContent="​",n.insertNode(o);const a=o.getBoundingClientRect();return o.remove(),e.normalize(),a}function og(e,t){if(!e.panel)return;const n=Cv(e.editor,t),r=e.panel;r.style.display="block",r.classList.add("show"),r.style.left="0px",r.style.top="0px";const o=r.getBoundingClientRect(),a=window.innerWidth,i=window.innerHeight;let l=Math.max(8,Math.min(n.left,a-o.width-8)),s=n.bottom+8;s+o.height>i-8&&(s=Math.max(8,n.top-o.height-8)),r.style.position="fixed",r.style.left=`${l}px`,r.style.top=`${s}px`}function Zd(e,t){if(!t)return bo(e);const n=e.toLowerCase(),r=t.toLowerCase(),o=n.indexOf(r);if(o<0)return bo(e);const a=bo(e.slice(0,o)),i=bo(e.slice(o,o+t.length)),l=bo(e.slice(o+t.length));return`${a}<mark>${i}</mark>${l}`}function Sv(e,t){if(e.panel&&e.list)return;const n=document.createElement("div");n.className="rte-slash-panel",n.style.display="none",n.setAttribute("role","dialog"),n.setAttribute("aria-modal","false");const r=document.createElement("div");r.className="rte-slash-list",r.setAttribute("role","listbox"),r.setAttribute("aria-label",t.panelLabel),n.appendChild(r),document.body.appendChild(n),e.panel=n,e.list=r,n.addEventListener("mousedown",o=>{o.preventDefault()}),n.addEventListener("click",o=>{const a=o.target;if(!a)return;const i=a.closest(".rte-slash-item");if(!i)return;const l=Number(i.getAttribute("data-index"));Number.isFinite(l)&&ag(e,l)})}function Pe(e){e.panel&&(e.panel.style.display="none",e.panel.classList.remove("show"),e.isOpen=!1,e.filteredItems=[],e.activeIndex=0,e.query="",e.replaceRange=null,e.anchorRange=null)}function Tv(e,t,n){if(!t)return e.slice(0,n);const r=t.toLowerCase();return e.filter(a=>[a.id,a.label,a.description||"",a.command||"",...a.keywords||[]].join(" ").toLowerCase().includes(r)).slice(0,n)}function $v(e,t){if(!e.list)return;const n=e.list;if(n.innerHTML="",e.filteredItems.length===0){const r=document.createElement("div");r.className="rte-slash-empty",r.textContent=t.emptyStateText,n.appendChild(r),n.removeAttribute("aria-activedescendant");return}e.filteredItems.forEach((r,o)=>{const a=document.createElement("button");a.type="button",a.className="rte-slash-item",a.setAttribute("role","option"),a.setAttribute("data-index",String(o)),a.setAttribute("id",`rte-slash-item-${e.instanceId}-${o}`),a.setAttribute("aria-selected",o===e.activeIndex?"true":"false"),a.setAttribute("aria-label",r.description?`${r.label} - ${r.description}`:r.label),o===e.activeIndex&&a.classList.add("active"),t.itemRenderer?a.innerHTML=t.itemRenderer(r,e.query):a.innerHTML=`
        <span class="rte-slash-item-title">${Zd(r.label,e.query)}</span>
        ${r.description?`<span class="rte-slash-item-description">${Zd(r.description,e.query)}</span>`:""}
      `,n.appendChild(a)}),e.filteredItems.length>0&&n.setAttribute("aria-activedescendant",`rte-slash-item-${e.instanceId}-${e.activeIndex}`)}function Lv(e,t){if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}}function Av(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function Yd(e,t){e.focus({preventScroll:!0});try{if(document.execCommand("insertHTML",!1,t))return!0}catch{}const n=window.getSelection();if(!n||n.rangeCount===0)return!1;const r=n.getRangeAt(0);if(!e.contains(r.commonAncestorContainer))return!1;r.deleteContents();const o=document.createElement("template");o.innerHTML=t;const a=o.content,i=a.lastChild;if(r.insertNode(a),i){const l=document.createRange();l.setStartAfter(i),l.collapse(!0),Ol(e,l)}return!0}function Mv(e,t){e.focus({preventScroll:!0});try{if(document.execCommand("insertText",!1,t))return!0}catch{}const n=window.getSelection();if(!n||n.rangeCount===0)return!1;const r=n.getRangeAt(0);if(!e.contains(r.commonAncestorContainer))return!1;r.deleteContents();const o=document.createTextNode(t);r.insertNode(o);const a=document.createRange();return a.setStart(o,o.length),a.collapse(!0),Ol(e,a),!0}function Rv(e,t){switch(e.toLowerCase()){case"paragraph":case"p":return document.execCommand("formatBlock",!1,"<p>");case"heading1":case"h1":return document.execCommand("formatBlock",!1,"<h1>");case"heading2":case"h2":return document.execCommand("formatBlock",!1,"<h2>");case"heading3":case"h3":return document.execCommand("formatBlock",!1,"<h3>");case"blockquote":case"toggleblockquote":return document.execCommand("formatBlock",!1,"<blockquote>");case"bulletlist":case"togglebulletlist":case"insertunorderedlist":return document.execCommand("insertUnorderedList");case"numberedlist":case"toggleorderedlist":case"insertorderedlist":return document.execCommand("insertOrderedList");case"horizontalrule":case"divider":case"inserthorizontalrule":return document.execCommand("insertHorizontalRule");case"bold":case"togglebold":return document.execCommand("bold");case"italic":case"toggleitalic":return document.execCommand("italic");case"underline":case"toggleunderline":return document.execCommand("underline");case"strikethrough":case"togglestrikethrough":return document.execCommand("strikeThrough");case"clearformatting":case"removeformat":return document.execCommand("removeFormat");default:try{return document.execCommand(e,!1,t)}catch{return!1}}}function Xd(e,t,n){const r=rg(e);if(r&&typeof r.execCommand=="function")try{if(r.execCommand(t,n)!==!1)return!0}catch{}const o=window.execEditorCommand||window.executeEditorCommand;if(typeof o=="function")try{if(o(t,n,{editorElement:r,contentElement:e})!==!1)return!0}catch{}return Rv(t,n)}async function Dv(e,t){const n=e.editor,r=rg(n),o={editor:n,editorRoot:r,query:e.query,trigger:e.trigger,executeCommand:(a,i)=>Xd(n,a,i),insertHTML:a=>Yd(n,a)};return t.action?await Promise.resolve(t.action(o))!==!1:t.insertHTML?Yd(n,t.insertHTML):t.command?Xd(n,t.command,t.commandValue):!1}async function ag(e,t){if(t<0||t>=e.filteredItems.length||!e.replaceRange)return;const n=e.filteredItems[t],r=e.editor,o=r.innerHTML,a=`${e.trigger}${e.query}`;if(!window.getSelection())return;const l=e.replaceRange.cloneRange();if(!r.contains(l.commonAncestorContainer))return;l.deleteContents();const s=l.cloneRange();s.collapse(!0),Ol(r,s);let c=!1;try{c=await Dv(e,n)}catch{c=!1}Pe(e),c?(Av(r),Lv(r,o)):a&&Mv(r,a),r.focus({preventScroll:!0})}function Jd(e,t){if(e.filteredItems.length===0)return;const n=e.filteredItems.length;if(e.activeIndex=((e.activeIndex+t)%n+n)%n,!e.list)return;const r=Array.from(e.list.querySelectorAll(".rte-slash-item"));r.forEach((a,i)=>{const l=i===e.activeIndex;a.classList.toggle("active",l),a.setAttribute("aria-selected",l?"true":"false")});const o=r[e.activeIndex];o&&(e.list.setAttribute("aria-activedescendant",o.id),o.scrollIntoView({block:"nearest"}))}function Qd(e){if(!(!e.isOpen||!e.panel||!e.anchorRange)){if(!e.editor.isConnected){Pe(e);return}og(e,e.anchorRange)}}function ig(e,t,n,r,o,a){Sv(e,t),e.query=r,e.trigger=o,e.replaceRange=a.cloneRange(),e.anchorRange=n.cloneRange(),e.filteredItems=Tv(e.items,r,t.maxSuggestions),e.activeIndex=0,e.isOpen=!0,e.panel&&($v(e,t),og(e,n))}function Nv(e,t){const n=e.editor;if(n.getAttribute("contenteditable")==="false"){Pe(e);return}const r=Rc(n);if(!r||!r.collapsed){Pe(e);return}const o=wv(r);if(!o){Pe(e);return}const a=Ev(o.textBefore,t.triggerChar,t.maxQueryLength,t.requireBoundary);if(!a){Pe(e);return}if(a.query.length<t.minChars){Pe(e);return}const i=r.cloneRange();i.setStart(o.node,a.startOffset),i.setEnd(o.node,o.caretOffset),ig(e,t,r,a.query,a.trigger,i)}function lg(e,t){const n=e.editor;if(n.getAttribute("contenteditable")==="false")return!1;let r=Rc(n);r||(r=document.createRange(),r.selectNodeContents(n),r.collapse(!1),Ol(n,r));const o=r.cloneRange();return o.collapse(!0),ig(e,t,r,"",t.triggerChar,o),!0}function Bv(e){return!(e.metaKey||e.ctrlKey)||e.altKey?!1:e.key==="/"||e.code==="Slash"}function Pv(e,t){return{editor:e,panel:null,list:null,replaceRange:null,items:t.items,filteredItems:[],activeIndex:0,query:"",trigger:t.triggerChar,isOpen:!1,instanceId:++yv,anchorRange:null}}function _s(e,t){const n=Ta.get(e);if(n)return n.items=t.items,n;const r=Pv(e,t);return Ta.set(e,r),r}function Iv(e){var n;const t=Ta.get(e);t&&((n=t.panel)!=null&&n.parentNode&&t.panel.parentNode.removeChild(t.panel),Ta.delete(e))}function Fs(e,t,n){if(ul.has(e))return;const r={input:()=>{Nv(t,n)},keydown:o=>{if(t.editor.getAttribute("contenteditable")==="false"){Pe(t);return}if(!t.isOpen&&Bv(o)){o.preventDefault(),lg(t,n);return}if(t.isOpen){if(o.key==="ArrowDown"){o.preventDefault(),Jd(t,1);return}if(o.key==="ArrowUp"){o.preventDefault(),Jd(t,-1);return}if(o.key==="Enter"||o.key==="Tab"){if(t.filteredItems.length===0){o.key==="Tab"&&o.preventDefault(),Pe(t);return}o.preventDefault(),ag(t,t.activeIndex);return}if(o.key==="Escape"){o.preventDefault(),Pe(t);return}}},blur:()=>{window.setTimeout(()=>{const o=document.activeElement;t.panel&&o&&t.panel.contains(o)||Pe(t)},0)},mousedown:o=>{if(!t.isOpen||!t.panel)return;const a=o.target;a&&!t.panel.contains(a)&&!e.contains(a)&&Pe(t)},selectionchange:()=>{if(!t.isOpen)return;const o=Rc(e);if(!o||!o.collapsed){Pe(t);return}t.anchorRange=o.cloneRange(),Qd(t)},reposition:()=>{Qd(t)}};e.addEventListener("input",r.input),e.addEventListener("keydown",r.keydown),e.addEventListener("blur",r.blur),document.addEventListener("mousedown",r.mousedown,!0),document.addEventListener("selectionchange",r.selectionchange),window.addEventListener("resize",r.reposition,{passive:!0}),window.addEventListener("scroll",r.reposition,!0),ul.set(e,r)}function Hv(e){const t=ul.get(e);t&&(e.removeEventListener("input",t.input),e.removeEventListener("keydown",t.keydown),e.removeEventListener("blur",t.blur),document.removeEventListener("mousedown",t.mousedown,!0),document.removeEventListener("selectionchange",t.selectionchange),window.removeEventListener("resize",t.reposition),window.removeEventListener("scroll",t.reposition,!0),ul.delete(e))}function Ov(e){fl||(fl=!0,ta=t=>{const n=t.target;if(!(n instanceof Node))return;const r=xv(n),o=(r==null?void 0:r.closest(Ht))||null;if(!o)return;const a=_s(o,e);Fs(o,a,e)},document.addEventListener("focusin",ta,!0))}function zv(){!fl||!ta||(document.removeEventListener("focusin",ta,!0),fl=!1,ta=null)}const qv=(e={})=>{hv();const t=bv(e);return{name:"slashCommands",toolbar:[{id:"slashCommands",label:"Slash Commands",command:"openSlashCommands",icon:'<svg width="24" height="24" focusable="false" aria-hidden="true"><path d="M8.7 20a1 1 0 0 1-.7-.3c-.4-.4-.4-1 0-1.4L15.6 5a1 1 0 0 1 1.4 1.4L9.4 19.7a1 1 0 0 1-.7.3Zm7.8 0c-.3 0-.5 0-.7-.3l-1.8-1.8a1 1 0 1 1 1.4-1.4l1.8 1.8a1 1 0 0 1-.7 1.7Zm-9-12a1 1 0 0 1-.7-1.7L8.6 4.5A1 1 0 1 1 10 6L8.2 7.8a1 1 0 0 1-.7.3Z"></path></svg>'}],commands:{openSlashCommands:(n,r)=>{const o=vv(r);if(!o)return!1;const a=_s(o,t);return Fs(o,a,t),lg(a,t)}},keymap:{"Mod-/":"openSlashCommands","Mod-Shift-7":"openSlashCommands"},init:()=>{bi+=1,Ov(t),Array.from(document.querySelectorAll(Ht)).forEach(r=>{const o=_s(r,t);Fs(r,o,t)})},destroy:()=>{bi=Math.max(0,bi-1),Array.from(document.querySelectorAll(Ht)).forEach(r=>{const o=Ta.get(r);o&&(Pe(o),Hv(r),Iv(r))}),bi===0&&zv()}}},_v=()=>({name:"document-manager",toolbar:[{label:"Import Word",command:"importWord",icon:'<svg width="24" height="24" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3h7.4L19 7.6V15h-2V9h-4V5H5c0-1.1.9-2 2-2Z"></path><path d="M9.5 7A1.5 1.5 0 0 1 11 8.4v7.1A1.5 1.5 0 0 1 9.6 17H2.5A1.5 1.5 0 0 1 1 15.6V8.5A1.5 1.5 0 0 1 2.4 7h7.1Zm-1 2.8-1 2.6-1-2.5v-.1a.6.6 0 0 0-1 0l-.1.1-.9 2.5-1-2.5v-.1a.6.6 0 0 0-1 .4v.1l1.5 4v.1a.6.6 0 0 0 1 0v-.1l1-2.5.9 2.5v.1a.6.6 0 0 0 1 0H8l1.6-4v-.2a.6.6 0 0 0-1.1-.4Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11.4 18.2a1 1 0 0 0 1.2 1.6l1.4-1V22a1 1 0 1 0 2 0v-3.1l1.4 1a1 1 0 0 0 1.2-1.7L15 15.8l-3.6 2.4Z"></path></svg>',type:"button"},{label:"Export Word",command:"exportWord",icon:'<svg width="24" height="24" focusable="false"><path d="M9.5 7A1.5 1.5 0 0 1 11 8.4v7.1A1.5 1.5 0 0 1 9.6 17H2.5A1.5 1.5 0 0 1 1 15.6V8.5A1.5 1.5 0 0 1 2.4 7h7.1Zm-1 2.8-1 2.6-1-2.5v-.1a.6.6 0 0 0-1 0l-.1.1-.9 2.5-1-2.5v-.1a.6.6 0 0 0-1 .4v.1l1.5 4v.1a.6.6 0 0 0 1 0v-.1l1-2.5.9 2.5v.1a.6.6 0 0 0 1 0H8l1.6-4v-.2a.6.6 0 0 0-1.1-.4Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3h7.4L19 7.6V17h-2V9h-4V5H7v3H5V5c0-1.1.9-2 2-2ZM15 17a1 1 0 1 0-2 0v3.1l-1.4-1a1 1 0 1 0-1.2 1.7l3.6 2.4 3.6-2.4a1 1 0 0 0-1.2-1.6l-1.4 1V17Z"></path></svg>',type:"button"},{label:"Export PDF",command:"exportPdf",icon:'<svg width="24" height="24" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3h7.4L19 7.6V17h-2V9h-4V5H7v3H5V5c0-1.1.9-2 2-2Z"></path><path d="M2.6 15.2v-1.9h1c.6 0 1-.2 1.4-.5.3-.3.5-.7.5-1.2s-.2-.9-.5-1.2a2 2 0 0 0-1.3-.4H1v5.2h1.6Zm.4-3h-.4v-1.1h.5l.6.1.2.5c0 .1 0 .3-.2.4l-.7.1Zm5.7 3 1-.1c.3 0 .5-.2.7-.4l.5-.8c.2-.3.2-.7.2-1.3v-1l-.5-.8c-.2-.3-.4-.5-.7-.6L8.7 10H6.3v5.2h2.4Zm-.4-1.1H8v-3h.4c.5 0 .8.2 1 .4l.2 1.1-.1 1-.3.3-.8.2Zm5.3 1.2V13h2v-1h-2v-1H16V10h-4v5.2h1.6Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M15 17a1 1 0 1 0-2 0v3.1l-1.4-1a1 1 0 1 0-1.2 1.7l3.6 2.4 3.6-2.4a1 1 0 0 0-1.2-1.6l-1.4 1V17Z"></path></svg>',type:"button"}],commands:{importWord:()=>{const e=()=>{const n=window.getSelection();if(n&&n.rangeCount>0){let a=n.getRangeAt(0).startContainer;for(;a&&a!==document.body;){if(a.nodeType===Node.ELEMENT_NODE){const i=a;if(i.getAttribute("contenteditable")==="true")return i}a=a.parentNode}}const r=document.activeElement;if((r==null?void 0:r.getAttribute("contenteditable"))==="true")return r;const o=r==null?void 0:r.closest('[contenteditable="true"]');return o||document.querySelector('[contenteditable="true"]')},t=document.createElement("input");return t.type="file",t.accept=".docx",t.onchange=async n=>{var o;const r=(o=n.target.files)==null?void 0:o[0];if(r)try{const a=e();if(a){const{importFromWord:i}=await Wl(()=>import("./documentManager-9af564be.js"),["./documentManager-9af564be.js","./iframe-23402cb8.js"],import.meta.url),l=await i(r);a.innerHTML=l,a.dispatchEvent(new Event("input",{bubbles:!0}))}}catch(a){console.error("Import failed:",a),alert("Failed to import Word document. Please check the console for details.")}},t.click(),!0},exportWord:async()=>{const e=()=>{const t=window.getSelection();if(t&&t.rangeCount>0){let o=t.getRangeAt(0).startContainer;for(;o&&o!==document.body;){if(o.nodeType===Node.ELEMENT_NODE&&o.getAttribute("contenteditable")==="true")return o;o=o.parentNode}}const n=document.activeElement;return(n==null?void 0:n.getAttribute("contenteditable"))==="true"?n:(n==null?void 0:n.closest('[contenteditable="true"]'))||document.querySelector('[contenteditable="true"]')};try{const t=e();if(t){const n=t.innerHTML,{exportToWord:r}=await Wl(()=>import("./documentManager-9af564be.js"),["./documentManager-9af564be.js","./iframe-23402cb8.js"],import.meta.url);await r(n,"document.docx")}return!0}catch(t){return console.error("Export failed:",t),alert("Failed to export to Word. Please check the console for details."),!1}},exportPdf:async()=>{const e=()=>{const t=window.getSelection();if(t&&t.rangeCount>0){let o=t.getRangeAt(0).startContainer;for(;o&&o!==document.body;){if(o.nodeType===Node.ELEMENT_NODE&&o.getAttribute("contenteditable")==="true")return o;o=o.parentNode}}const n=document.activeElement;return(n==null?void 0:n.getAttribute("contenteditable"))==="true"?n:(n==null?void 0:n.closest('[contenteditable="true"]'))||document.querySelector('[contenteditable="true"]')};try{const t=e();if(t){const n=t.innerHTML,{exportToPdf:r}=await Wl(()=>import("./documentManager-9af564be.js"),["./documentManager-9af564be.js","./iframe-23402cb8.js"],import.meta.url);await r(n,"document.pdf",t)}else console.error("PDF Export: No editor element found"),alert("No active editor found. Please click in the editor area first.");return!0}catch(t){return console.error("PDF Export: Export failed:",t),alert("Failed to export to PDF. Please check the console for details."),!1}}},keymap:{}});let ls=!1;const Fv=()=>{if(typeof document>"u")return;const e="rte-preview-plugin-styles";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
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
  `,document.head.appendChild(t)},jv=()=>{const e=window.getSelection();if(e&&e.rangeCount>0){let n=e.getRangeAt(0).startContainer;for(;n&&n!==document.body;){if(n.nodeType===Node.ELEMENT_NODE){const r=n;if(r.getAttribute("contenteditable")==="true")return r}n=n.parentNode}}const t=document.activeElement;if(t){if(t.getAttribute("contenteditable")==="true")return t;const n=t.closest('[contenteditable="true"]');if(n)return n}return document.querySelector('[contenteditable="true"]')},Vv=()=>{const e=jv();if(!e)return"";const t=e.cloneNode(!0);return[".rte-floating-toolbar",".rte-selection-marker",".rte-toolbar",".rte-resize-handle","[data-rte-internal]"].forEach(r=>{t.querySelectorAll(r).forEach(o=>o.remove())}),t.innerHTML},Wv=e=>{const t=document.createElement("div");return t.innerHTML=e,t.querySelectorAll('script, iframe[src^="javascript:"], object, embed, form[action^="javascript:"]').forEach(o=>o.remove()),t.querySelectorAll("*").forEach(o=>{Array.from(o.attributes).forEach(a=>{a.name.startsWith("on")&&o.removeAttribute(a.name),(a.name==="href"||a.name==="src")&&a.value.startsWith("javascript:")&&o.removeAttribute(a.name),a.name.toLowerCase()==="contenteditable"&&o.removeAttribute(a.name)}),o.setAttribute("contenteditable","false")}),t.innerHTML},Kv=()=>{if(typeof window>"u"||ls)return;ls=!0,Fv();const e=Vv(),t=Wv(e),n=document.createElement("div");n.className="rte-preview-editor-overlay",n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true"),n.setAttribute("aria-labelledby","preview-editor-title");const r=document.createElement("div");r.className="rte-preview-editor-modal";const o=document.createElement("div");o.className="rte-preview-editor-header",o.innerHTML=`
    <h2 id="preview-editor-title">Preview Editor</h2>
    <div class="rte-preview-editor-header-actions">
      <button class="rte-preview-editor-close-btn" aria-label="Close preview editor">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  `;const a=document.createElement("div");a.className="rte-preview-editor-body";const i=document.createElement("div");i.className="rte-preview-editor-content";const l=document.createElement("div");l.className="rte-preview-editor-light-editor",l.innerHTML=t,i.appendChild(l),a.appendChild(i),r.appendChild(o),r.appendChild(a),n.appendChild(r);const s=()=>{n.parentNode&&n.parentNode.removeChild(n),ls=!1,document.removeEventListener("keydown",c)},c=u=>{u.key==="Escape"&&(u.preventDefault(),u.stopPropagation(),s())},d=o.querySelector(".rte-preview-editor-close-btn");d&&d.addEventListener("click",u=>{u.preventDefault(),u.stopPropagation(),s()}),n.addEventListener("click",u=>{u.target===n&&s()}),document.addEventListener("keydown",c),document.body.appendChild(n)},Uv=()=>({name:"preview",toolbar:[{label:"Preview",command:"togglePreview",icon:'<svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 92 92" enable-background="new 0 0 92 92" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_1239_" d="M91.3,43.8C90.6,42.8,74.4,19,46,19C17.6,19,1.4,42.8,0.7,43.8c-0.9,1.3-0.9,3.1,0,4.5 C1.4,49.2,17.6,73,46,73c28.4,0,44.6-23.8,45.3-24.8C92.2,46.9,92.2,45.1,91.3,43.8z M46,65C26.7,65,13.5,51.4,9,46 c4.5-5.5,17.6-19,37-19c19.3,0,32.5,13.6,37,19C78.4,51.5,65.3,65,46,65z M48.3,29.6c-4.4-0.6-8.7,0.5-12.3,3.2c0,0,0,0,0,0 c-7.3,5.5-8.8,15.9-3.3,23.2c2.7,3.6,6.5,5.8,10.9,6.5c0.8,0.1,1.6,0.2,2.3,0.2c3.6,0,7-1.2,9.9-3.3c7.3-5.5,8.8-15.9,3.3-23.2 C56.6,32.5,52.7,30.2,48.3,29.6z M52.3,54.5c-2.2,1.7-5,2.4-7.8,2c-2.8-0.4-5.3-1.9-7-4.1C34.1,47.7,35,41,39.7,37.5 c2.2-1.7,5-2.4,7.8-2c2.8,0.4,5.3,1.9,7,4.1C57.9,44.3,57,51,52.3,54.5z M51.9,40c0.8,0.7,1.2,1.8,1.2,2.8c0,1-0.4,2.1-1.2,2.8 c-0.7,0.7-1.8,1.2-2.8,1.2c-1.1,0-2.1-0.4-2.8-1.2c-0.8-0.8-1.2-1.8-1.2-2.8c0-1.1,0.4-2.1,1.2-2.8c0.7-0.8,1.8-1.2,2.8-1.2 C50.2,38.9,51.2,39.3,51.9,40z"></path> </g></svg>'}],commands:{togglePreview:()=>(Kv(),!0)},keymap:{}}),Gv=()=>`
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
  `,eu=()=>{var l;if(typeof window>"u")return!1;const t=(()=>{const s=window.getSelection();if(s&&s.rangeCount>0){let d=s.getRangeAt(0).startContainer;for(;d&&d!==document.body;){if(d.nodeType===Node.ELEMENT_NODE){const u=d;if(u.getAttribute("contenteditable")==="true")return u}d=d.parentNode}}const c=document.activeElement;if(c){if(c.getAttribute("contenteditable")==="true")return c;const d=c.closest('[contenteditable="true"]');if(d)return d}return document.querySelector('[contenteditable="true"]')})();if(!t)return console.warn("Editor content not found"),!1;const n=t.cloneNode(!0),r=document.createElement("article");r.className="rte-document rte-print",r.appendChild(n);const o=`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Print Document</title>
        <style>${Gv()}</style>
      </head>
      <body>
        ${r.outerHTML}
      </body>
    </html>
  `,a=document.createElement("iframe");a.style.position="absolute",a.style.left="-9999px",a.style.top="-9999px",a.style.width="0",a.style.height="0",document.body.appendChild(a);const i=a.contentDocument||((l=a.contentWindow)==null?void 0:l.document);return i?(i.open(),i.write(o),i.close(),setTimeout(()=>{a.contentWindow&&(a.contentWindow.print(),setTimeout(()=>{document.body.removeChild(a)},100))},250),!0):(console.error("Could not access print frame document"),document.body.removeChild(a),!1)},Zv=()=>({name:"print",toolbar:[{label:"Print",command:"print",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M7 9V4h10v5M6 18h12v-4H6v4Zm0 0v2h12v-2M6 9H5a2 2 0 0 0-2 2v3h3m12-5h1a2 2 0 0 1 2 2v3h-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',shortcut:"Mod-p"}],commands:{print:eu},keymap:{"Mod-p":()=>(eu(),!0)}}),Kn='.rte-page-break[data-type="page-break"]',pl=".rte-content, .editora-content";let hi=null,tu=!1;const sg=(e,t)=>{if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}},Yv=new Set(["DIV","P","BLOCKQUOTE","PRE","H1","H2","H3","H4","H5","H6","LI","TD","TH"]),Xv=()=>{hi||typeof document>"u"||(hi=document.createElement("style"),hi.textContent=`
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
  `,document.head.appendChild(hi))},Jv=()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return null;const t=e.getRangeAt(0),n=t.startContainer.nodeType===Node.ELEMENT_NODE?t.startContainer:t.startContainer.parentElement;return(n==null?void 0:n.closest(pl))||null},cg=()=>{const e=Jv();if(e)return e;const t=document.activeElement,n=t==null?void 0:t.closest(pl);return n||document.querySelector(pl)},nu=(e,t)=>{let n=e;for(;n&&n!==t;){if(n.nodeType===Node.ELEMENT_NODE){const r=n;if(Yv.has(r.tagName))return r}n=n.parentNode}return null},Qv=()=>{const e=document.createElement("div");return e.className="rte-page-break",e.setAttribute("data-page-break","true"),e.setAttribute("data-type","page-break"),e.setAttribute("contenteditable","false"),e.setAttribute("tabindex","0"),e.setAttribute("role","separator"),e.setAttribute("aria-label","Page break"),e},ek=e=>{let t=e.nextElementSibling;for(;t&&t.matches(Kn);){const r=t;t=t.nextElementSibling,r.remove()}let n=e.previousElementSibling;for(;n&&n.matches(Kn);){const r=n;n=n.previousElementSibling,r.remove()}},dg=e=>{var r;const t=e.nextElementSibling;if(t&&!t.matches(Kn))return t;const n=document.createElement("p");return n.innerHTML="<br>",(r=e.parentNode)==null||r.insertBefore(n,e.nextSibling),n},Nn=e=>{const t=window.getSelection();if(!t)return;const n=document.createRange();e.nodeType,Node.TEXT_NODE,n.setStart(e,0),n.collapse(!0),t.removeAllRanges(),t.addRange(n)},js=e=>{const t=window.getSelection();if(!t)return;const n=document.createRange();if(e.nodeType===Node.TEXT_NODE){const r=e;n.setStart(r,r.data.length)}else n.selectNodeContents(e),n.collapse(!1);t.removeAllRanges(),t.addRange(n)},ml=(e,t)=>{let n=e;for(;n;){if(!(n instanceof HTMLElement&&n.matches(Kn)))return n;n=t==="previous"?n.previousSibling:n.nextSibling}return null},tk=e=>{const t=window.getSelection();if(!t||!e.parentNode)return;const n=e.parentNode,r=Array.from(n.childNodes).indexOf(e);if(r<0)return;const o=document.createRange();o.setStart(n,r),o.setEnd(n,r+1),t.removeAllRanges(),t.addRange(o),e.focus({preventScroll:!0})},nk=e=>{if(e.collapsed||e.startContainer!==e.endContainer||e.endOffset!==e.startOffset+1||!(e.startContainer instanceof Element||e.startContainer instanceof DocumentFragment))return null;const t=e.startContainer.childNodes[e.startOffset];return t instanceof HTMLElement&&t.matches(Kn)?t:null},rk=(e,t,n)=>{if(!e.collapsed)return null;const{startContainer:r,startOffset:o}=e,a=l=>l instanceof HTMLElement&&l.matches(Kn)?l:null,i=l=>{if(r.nodeType===Node.ELEMENT_NODE){const c=r;if(l==="previous"){if(o>0)return c.childNodes[o-1]||null}else if(o<c.childNodes.length)return c.childNodes[o]||null}if(r.nodeType===Node.TEXT_NODE&&(l==="previous"&&o<r.data.length||l==="next"&&o>0))return null;let s=r;for(;s&&s!==t;){const c=l==="previous"?s.previousSibling:s.nextSibling;if(c)return c;s=s.parentNode}return null};if(r.nodeType===Node.ELEMENT_NODE){const l=r;return n==="Backspace"&&o>0?a(l.childNodes[o-1]||null):n==="Delete"?a(l.childNodes[o]||null):null}if(r.nodeType===Node.TEXT_NODE){const l=r;if(n==="Backspace"&&o===0){const s=a(l.previousSibling);return s||a(i("previous"))}if(n==="Delete"&&o===l.data.length){const s=a(l.nextSibling);return s||a(i("next"))}}return a(i(n==="Backspace"?"previous":"next"))},ru=(e,t)=>{const n=e.closest(pl),r=(n==null?void 0:n.innerHTML)??"",o=e.previousSibling,a=e.nextSibling;e.remove();const i=ml(o,"previous"),l=ml(a,"next");if(t==="Backspace"){if(i)js(i);else if(l)Nn(l);else if(n){const s=document.createElement("p");s.innerHTML="<br>",n.appendChild(s),Nn(s)}}else if(l)Nn(l);else if(i)js(i);else if(n){const s=document.createElement("p");s.innerHTML="<br>",n.appendChild(s),Nn(s)}return n&&(sg(n,r),n.dispatchEvent(new Event("input",{bubbles:!0}))),!0},ok=()=>{const e=cg();if(!e)return!1;const t=e.innerHTML,n=window.getSelection();if(!n)return!1;let r;n.rangeCount>0&&e.contains(n.getRangeAt(0).commonAncestorContainer)?r=n.getRangeAt(0):(r=document.createRange(),r.selectNodeContents(e),r.collapse(!1),n.removeAllRanges(),n.addRange(r));const o=nu(r.endContainer,e)||nu(r.startContainer,e),a=Qv();o&&o.parentNode?o.parentNode.insertBefore(a,o.nextSibling):e.appendChild(a),ek(a);const i=dg(a);return Nn(i),sg(e,t),e.dispatchEvent(new Event("input",{bubbles:!0})),!0},ak=()=>{tu||typeof document>"u"||(tu=!0,document.addEventListener("click",e=>{const t=e.target,n=t==null?void 0:t.closest(Kn);n&&(e.preventDefault(),e.stopPropagation(),tk(n))}),document.addEventListener("keydown",e=>{const t=e.key;if(!["Backspace","Delete","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(t))return;const n=window.getSelection();if(!n||n.rangeCount===0)return;const r=n.getRangeAt(0),o=cg();if(!o||!o.contains(r.commonAncestorContainer))return;const a=nk(r);if(a){if(t==="Backspace"||t==="Delete"){e.preventDefault(),e.stopPropagation(),ru(a,t);return}if(t==="ArrowRight"||t==="ArrowDown"){e.preventDefault();const i=ml(a.nextSibling,"next")||dg(a);Nn(i);return}if(t==="ArrowLeft"||t==="ArrowUp"){e.preventDefault();const i=ml(a.previousSibling,"previous");i?js(i):Nn(o);return}}if(t==="Backspace"||t==="Delete"){const i=rk(r,o,t);if(!i)return;e.preventDefault(),e.stopPropagation(),ru(i,t)}}))},ik=()=>(Xv(),ak(),{name:"pageBreak",toolbar:[{label:"Page Break",command:"insertPageBreak",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M5 5H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M5 9H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M5 15H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-dasharray="3.2 3.2"/><path d="M5 19H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',shortcut:"Mod-Enter"}],commands:{insertPageBreak:ok},keymap:{"Mod-Enter":"insertPageBreak"}}),ug=".rte-content, .editora-content",Dc='.rte-footnotes[data-type="footnotes"]',_a=".rte-footnote-ref[data-footnote-id]",gl='li.rte-footnote-item[data-type="footnote"]',ou="__editoraCommandEditorRoot";let au=!1,iu=!1,lu=0;function lk(){if(au||typeof document>"u")return;au=!0;const e=document.createElement("style");e.id="editora-footnote-plugin-styles",e.textContent=`
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
  `,document.head.appendChild(e)}function fg(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function sk(e){if(!e)return null;const t=e.querySelector('[contenteditable="true"]');return t instanceof HTMLElement?t:null}function ck(){if(typeof window>"u")return null;const e=window[ou];if(!(e instanceof HTMLElement))return null;window[ou]=null;const t=e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(e.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?e:null);if(t){const r=sk(t);if(r)return r;if(t.getAttribute("contenteditable")==="true")return t}if(e.getAttribute("contenteditable")==="true")return e;const n=e.closest('[contenteditable="true"]');return n instanceof HTMLElement?n:null}function dk(e){const t=e.closest('[contenteditable="true"]');if(!t)return null;let n=t,r=n.parentElement;for(;r;)r.getAttribute("contenteditable")==="true"&&(n=r),r=r.parentElement;return n}function jr(e){const t=fg(e);if(!t)return null;const n=t.closest(ug);return n||dk(t)}function uk(){const e=window.getSelection();return!e||e.rangeCount===0?null:jr(e.getRangeAt(0).startContainer)}function fk(){const e=ck();if(e&&document.contains(e))return e;const t=uk();if(t)return t;const n=document.activeElement,r=n?jr(n):null;if(r)return r;const o=document.querySelector(ug);return o||document.querySelector('[contenteditable="true"]')}function pk(){const e=document.createElement("section");e.className="rte-footnotes",e.setAttribute("data-type","footnotes"),e.setAttribute("contenteditable","false");const t=document.createElement("ol");return e.appendChild(t),e}function bl(e,t){let n=e.querySelector(Dc);return!n&&t&&(n=pk(),e.appendChild(n)),n?(n.querySelector("ol")||n.appendChild(document.createElement("ol")),n):null}function pg(e){let t=e.querySelector("ol");return t||(t=document.createElement("ol"),e.appendChild(t)),t}function mk(e){const t=document.createElement("sup");return t.className="rte-footnote-ref",t.setAttribute("data-footnote-id",e),t.setAttribute("data-number","0"),t.setAttribute("contenteditable","false"),t.setAttribute("tabindex","0"),t.setAttribute("role","doc-noteref"),t.id=`ref-${e}`,t.textContent="0",t}function mg(e,t){const n=document.createElement("li");n.id=e,n.className="rte-footnote-item",n.setAttribute("data-type","footnote"),n.setAttribute("data-number","0"),n.setAttribute("contenteditable","false");const r=document.createElement("div");r.className="rte-footnote-content",r.setAttribute("contenteditable","true"),r.textContent=t;const o=document.createElement("a");return o.className="rte-footnote-backref",o.href=`#ref-${e}`,o.setAttribute("aria-label","Back to reference"),o.setAttribute("contenteditable","false"),o.textContent="↩",n.appendChild(r),n.appendChild(o),n}function gk(e){let t="";do lu+=1,t=`fn-${Date.now().toString(36)}-${lu.toString(36)}`;while(e.querySelector(`#${CSS.escape(t)}`));return t}function su(e){e.classList.remove("rte-footnote-highlighted"),e.classList.add("rte-footnote-highlighted"),window.setTimeout(()=>{e.classList.remove("rte-footnote-highlighted")},1e3)}function gg(e){e&&e.dispatchEvent(new Event("input",{bubbles:!0}))}function bg(e,t){if(!e||t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}}function bk(e,t){return Array.from(e.querySelectorAll(_a)).find(r=>r.getAttribute("data-footnote-id")===t)||null}function hk(e){const t=window.getSelection();if(!t)throw new Error("Selection unavailable");let n=null;if(t.rangeCount>0){const o=t.getRangeAt(0);e.contains(o.commonAncestorContainer)&&(n=o.cloneRange())}if(!n){n=document.createRange();const o=bl(e,!1);o?(n.setStartBefore(o),n.collapse(!0)):(n.selectNodeContents(e),n.collapse(!1))}const r=fg(n.commonAncestorContainer);if(r!=null&&r.closest(Dc)){const o=bl(e,!0);o&&(n.setStartBefore(o),n.collapse(!0))}return t.removeAllRanges(),t.addRange(n),n}function cu(e){const t=e.parentNode;if(!t)return;const n=Array.from(t.childNodes).indexOf(e);if(n<0)return;const r=window.getSelection();if(!r)return;const o=document.createRange();o.setStart(t,n),o.setEnd(t,n+1),r.removeAllRanges(),r.addRange(o),e.focus({preventScroll:!0})}function du(e,t){const n=window.getSelection();if(!n)return;const r=Math.max(0,Math.min(t,e.childNodes.length)),o=document.createRange();o.setStart(e,r),o.collapse(!0),n.removeAllRanges(),n.addRange(o)}function yk(e){if(e.collapsed||e.startContainer!==e.endContainer||e.endOffset!==e.startOffset+1||!(e.startContainer instanceof Element||e.startContainer instanceof DocumentFragment))return null;const t=e.startContainer.childNodes[e.startOffset];return!(t instanceof HTMLElement)||!t.matches(_a)?null:t}function yi(e,t,n){const{startContainer:r,startOffset:o}=e;if(r.nodeType===Node.ELEMENT_NODE){const i=r;if(n==="previous"){if(o>0)return i.childNodes[o-1]||null}else if(o<i.childNodes.length)return i.childNodes[o]||null}if(r.nodeType===Node.TEXT_NODE&&(n==="previous"&&o<r.data.length||n==="next"&&o>0))return null;let a=r;for(;a&&a!==t;){const i=n==="previous"?a.previousSibling:a.nextSibling;if(i)return i;a=a.parentNode}return null}function xk(e,t,n){if(!e.collapsed)return null;const r=i=>i instanceof HTMLElement&&i.matches(_a)?i:null,{startContainer:o,startOffset:a}=e;if(o.nodeType===Node.ELEMENT_NODE){const i=o;return n==="Backspace"&&a>0?r(i.childNodes[a-1]||null):n==="Delete"?r(i.childNodes[a]||null):null}if(o.nodeType===Node.TEXT_NODE){const i=o;if(n==="Backspace"&&a===0){const l=r(i.previousSibling);return l||r(yi(e,t,"previous"))}if(n==="Delete"&&a===i.data.length){const l=r(i.nextSibling);return l||r(yi(e,t,"next"))}}return r(n==="Backspace"?yi(e,t,"previous"):yi(e,t,"next"))}function hg(e){const t=Array.from(e.querySelectorAll(_a)).filter(l=>!l.closest(Dc)),n=bl(e,t.length>0);if(!n)return;const r=pg(n),o=Array.from(r.querySelectorAll(gl)),a=new Map;o.forEach(l=>a.set(l.id,l));const i=[];t.forEach((l,s)=>{const c=l.getAttribute("data-footnote-id");if(!c)return;const d=s+1;l.setAttribute("data-number",String(d)),l.id=`ref-${c}`,l.textContent=String(d);let u=a.get(c);u||(u=mg(c,`Footnote ${d}`)),u.setAttribute("data-number",String(d));const f=u.querySelector(".rte-footnote-content");f&&!(f.textContent||"").trim()&&(f.textContent=`Footnote ${d}`);const m=u.querySelector(".rte-footnote-backref");m&&(m.href=`#ref-${c}`,m.setAttribute("aria-label",`Back to reference ${d}`)),i.push(u)}),r.innerHTML="",i.forEach(l=>r.appendChild(l)),i.length===0&&n.remove()}function uu(e,t){const n=jr(e),r=e.parentNode;if(!n||!r)return!1;const o=n.innerHTML,a=Array.from(r.childNodes).indexOf(e);if(a<0)return!1;const i=e.getAttribute("data-footnote-id")||"";if(e.remove(),i){const l=n.querySelector(`${gl}#${CSS.escape(i)}`);l==null||l.remove()}return du(r,a),hg(n),bg(n,o),gg(n),!0}function vk(){iu||typeof document>"u"||(iu=!0,document.addEventListener("click",e=>{const t=e.target;if(!t)return;const n=t.closest(_a);if(n){const s=jr(n);if(!s||!s.contains(n))return;e.preventDefault(),e.stopPropagation(),cu(n),n.classList.add("rte-footnote-selected"),window.setTimeout(()=>n.classList.remove("rte-footnote-selected"),1200);const c=n.getAttribute("data-footnote-id");if(!c)return;const d=s.querySelector(`${gl}#${CSS.escape(c)}`);if(!d)return;d.scrollIntoView({behavior:"smooth",block:"center"}),su(d);return}const r=t.closest(".rte-footnote-backref");if(!r)return;const o=r.closest(gl);if(!o)return;const a=jr(o);if(!a||!a.contains(o))return;e.preventDefault(),e.stopPropagation();const i=o.id;if(!i)return;const l=bk(a,i);l&&(l.scrollIntoView({behavior:"smooth",block:"center"}),su(l),cu(l))}),document.addEventListener("keydown",e=>{if(e.key!=="Backspace"&&e.key!=="Delete")return;const t=window.getSelection();if(!t||t.rangeCount===0)return;const n=t.getRangeAt(0),r=jr(n.commonAncestorContainer);if(!r||!r.contains(n.commonAncestorContainer))return;const o=yk(n);if(o){e.preventDefault(),e.stopPropagation(),uu(o,e.key);return}const a=xk(n,r,e.key);a&&(e.preventDefault(),e.stopPropagation(),uu(a,e.key))}))}const kk=(e="")=>{const t=fk();if(!t)return!1;const n=t.innerHTML,r=window.getSelection();if(!r)return!1;let o;try{o=hk(t)}catch{return!1}o.collapsed||(o.collapse(!1),r.removeAllRanges(),r.addRange(o));const a=gk(t),i=mk(a);try{o.insertNode(i)}catch{return!1}const l=document.createRange();l.setStartAfter(i),l.collapse(!0),r.removeAllRanges(),r.addRange(l);const s=bl(t,!0);if(!s)return!1;const c=pg(s),d=e.trim()||"Footnote";return c.appendChild(mg(a,d)),hg(t),bg(t,n),gg(t),!0},wk=()=>(lk(),vk(),{name:"footnote",toolbar:[{label:"Footnote",command:"insertFootnote",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="14" height="2" rx="1"></rect><rect x="3" y="8" width="18" height="2" rx="1"></rect><rect x="3" y="12" width="16" height="2" rx="1"></rect><rect x="3" y="16" width="10" height="1.5" rx="0.75"></rect><text x="19" y="11" font-size="9" font-weight="600" fill="currentColor" font-family="system-ui, sans-serif">1</text></svg>'}],commands:{insertFootnote:()=>kk()},keymap:{}}),hl=()=>{const e=window.getSelection();if(e&&e.rangeCount>0){let n=e.getRangeAt(0).startContainer;for(;n&&n!==document.body;){if(n.nodeType===Node.ELEMENT_NODE){const r=n;if(r.getAttribute("contenteditable")==="true")return r}n=n.parentNode}}const t=document.activeElement;if(t){if(t.getAttribute("contenteditable")==="true")return t;const n=t.closest('[contenteditable="true"]');if(n)return n}return document.querySelector('[contenteditable="true"]')},ho='[data-theme="dark"], .dark, .editora-theme-dark',Ek=()=>{const e=hl();if(e!=null&&e.closest(ho))return!0;const t=window.getSelection();if(t&&t.rangeCount>0){const r=t.getRangeAt(0).startContainer,o=r.nodeType===Node.ELEMENT_NODE?r:r.parentElement;if(o!=null&&o.closest(ho))return!0}const n=document.activeElement;return n!=null&&n.closest(ho)?!0:document.body.matches(ho)||document.documentElement.matches(ho)},Ck=[{value:"javascript",label:"JavaScript"},{value:"typescript",label:"TypeScript"},{value:"python",label:"Python"},{value:"java",label:"Java"},{value:"csharp",label:"C#"},{value:"cpp",label:"C++"},{value:"c",label:"C"},{value:"php",label:"PHP"},{value:"ruby",label:"Ruby"},{value:"go",label:"Go"},{value:"rust",label:"Rust"},{value:"swift",label:"Swift"},{value:"kotlin",label:"Kotlin"},{value:"html",label:"HTML"},{value:"css",label:"CSS"},{value:"scss",label:"SCSS"},{value:"json",label:"JSON"},{value:"xml",label:"XML"},{value:"yaml",label:"YAML"},{value:"markdown",label:"Markdown"},{value:"sql",label:"SQL"},{value:"bash",label:"Bash"},{value:"shell",label:"Shell"},{value:"plaintext",label:"Plain Text"}],yg=new Map;function xg(e,t,n,r){const o=!!t,a=r||"javascript",i=n||"",l=Ek(),s=l?{overlay:"rgba(0, 0, 0, 0.62)",dialogBg:"#1f2937",dialogBorder:"#4b5563",text:"#e2e8f0",mutedText:"#a8b5c8",headerFooterBg:"#222d3a",border:"#3b4657",fieldBg:"#111827",fieldBorder:"#4b5563",cancelBg:"#334155",cancelHover:"#475569",cancelText:"#e2e8f0",primaryBg:"#3b82f6",primaryHover:"#2563eb"}:{overlay:"rgba(0, 0, 0, 0.5)",dialogBg:"#ffffff",dialogBorder:"#e0e0e0",text:"#333333",mutedText:"#666666",headerFooterBg:"#ffffff",border:"#e0e0e0",fieldBg:"#ffffff",fieldBorder:"#dddddd",cancelBg:"#e5e7eb",cancelHover:"#d1d5db",cancelText:"#333333",primaryBg:"#2563eb",primaryHover:"#1d4ed8"},c=document.createElement("div");c.className="rte-code-sample-overlay",l&&c.classList.add("rte-theme-dark"),c.style.cssText=`
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
      ${Ck.map(E=>`
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
  `;const p=document.createElement("div");p.style.cssText=`color: ${s.mutedText}; font-size: 12px; margin-top: 10px;`,p.innerHTML="💡 Tip: Press Ctrl+Enter (or Cmd+Enter on Mac) to save, or Escape to cancel",f.appendChild(m),f.appendChild(g),f.appendChild(p);const b=document.createElement("div");b.style.cssText=`
    padding: 20px;
    border-top: 1px solid ${s.border};
    background: ${s.headerFooterBg};
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  `,b.innerHTML=`
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
  `,d.appendChild(u),d.appendChild(f),d.appendChild(b),c.appendChild(d);const h=m.querySelector(".rte-code-language"),x=g.querySelector(".rte-code-textarea"),C=g.querySelector(".rte-code-error"),k=u.querySelector(".rte-code-close-btn"),T=b.querySelector(".rte-code-cancel-btn"),L=b.querySelector(".rte-code-save-btn");k.onmouseover=()=>{k.style.color="#f8fafc",k.style.background=l?"#334155":"#f0f0f0",k.style.borderRadius="4px"},k.onmouseout=()=>{k.style.color=s.mutedText,k.style.background="none"},T.onmouseover=()=>{T.style.background=s.cancelHover},T.onmouseout=()=>{T.style.background=s.cancelBg},L.onmouseover=()=>{L.style.background=s.primaryHover},L.onmouseout=()=>{L.style.background=s.primaryBg};const w=()=>{c.remove()},v=()=>{const E=x.value.trim();if(!E){C.textContent="⚠ Code cannot be empty",C.style.display="block";return}const H=h.value;e(E,H),w()};if(k.onclick=w,T.onclick=w,L.onclick=v,x.addEventListener("keydown",E=>{(E.ctrlKey||E.metaKey)&&E.key==="Enter"&&(E.preventDefault(),v()),E.key==="Escape"&&w()}),x.addEventListener("input",()=>{C.style.display="none"}),c.addEventListener("click",E=>{E.target===c&&w()}),!document.getElementById("rte-code-sample-animations")){const E=document.createElement("style");E.id="rte-code-sample-animations",E.textContent=`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `,document.head.appendChild(E)}return document.body.appendChild(c),setTimeout(()=>x.focus(),100),c}function Sk(){if(!hl())return;let t=null;const n=window.getSelection();n&&n.rangeCount>0&&(t=n.getRangeAt(0).cloneRange()),xg((r,o)=>{const a=window.getSelection();if(t&&(a==null||a.removeAllRanges(),a==null||a.addRange(t)),!a||a.rangeCount===0)return;const i=hl();if(!i)return;const l=a.anchorNode;if(!l||!i.contains(l))return;const s=a.getRangeAt(0),c=`code-block-${Date.now()}`,d=document.createElement("pre");d.className="rte-code-block",d.id=c,d.setAttribute("data-type","code-block"),d.setAttribute("data-lang",o),d.setAttribute("data-code-id",c),d.setAttribute("contenteditable","false"),d.style.cssText=`
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
    `,u.textContent=r;const f=document.createElement("span");f.style.cssText=`
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
    `,m.onclick=p=>{p.stopPropagation(),navigator.clipboard.writeText(r).then(()=>{m.textContent="✓ Copied!",setTimeout(()=>{m.textContent="Copy"},2e3)})},d.appendChild(f),d.appendChild(m),d.appendChild(u),d.addEventListener("mouseenter",()=>{m.style.opacity="1"}),d.addEventListener("mouseleave",()=>{m.style.opacity="0"}),d.addEventListener("dblclick",()=>{Tk(c)}),yg.set(c,{id:c,language:o,code:r}),s.insertNode(d);const g=document.createRange();g.setStartAfter(d),g.collapse(!0),a.removeAllRanges(),a.addRange(g)})}function Tk(e){const t=hl();if(!t)return;const n=t.querySelector(`#${e}`);if(!n)return;const r=yg.get(e);r&&xg((o,a)=>{const i=n.querySelector("code");i&&(i.textContent=o,i.className=`language-${a}`);const l=n.querySelector("span");l&&(l.textContent=a),n.setAttribute("data-lang",a),r.language=a,r.code=o;const s=n.querySelector(".rte-code-copy");s&&(s.onclick=c=>{c.stopPropagation(),navigator.clipboard.writeText(o).then(()=>{s.textContent="✓ Copied!",setTimeout(()=>{s.textContent="Copy"},2e3)})})},e,r.code,r.language)}const $k=()=>({name:"codeSample",toolbar:[{label:"Insert Code",command:"insertCodeBlock",icon:'<svg width="24" height="26" focusable="false"><path d="M7.1 11a2.8 2.8 0 0 1-.8 2 2.8 2.8 0 0 1 .8 2v1.7c0 .3.1.6.4.8.2.3.5.4.8.4.3 0 .4.2.4.4v.8c0 .2-.1.4-.4.4-.7 0-1.4-.3-2-.8-.5-.6-.8-1.3-.8-2V15c0-.3-.1-.6-.4-.8-.2-.3-.5-.4-.8-.4a.4.4 0 0 1-.4-.4v-.8c0-.2.2-.4.4-.4.3 0 .6-.1.8-.4.3-.2.4-.5.4-.8V9.3c0-.7.3-1.4.8-2 .6-.5 1.3-.8 2-.8.3 0 .4.2.4.4v.8c0 .2-.1.4-.4.4-.3 0-.6.1-.8.4-.3.2-.4.5-.4.8V11Zm9.8 0V9.3c0-.3-.1-.6-.4-.8-.2-.3-.5-.4-.8-.4a.4.4 0 0 1-.4-.4V7c0-.2.1-.4.4-.4.7 0 1.4.3 2 .8.5.6.8 1.3.8 2V11c0 .3.1.6.4.8.2.3.5.4.8.4.2 0 .4.2.4.4v.8c0 .2-.2.4-.4.4-.3 0-.6.1-.8.4-.3.2-.4.5-.4.8v1.7c0 .7-.3 1.4-.8 2-.6.5-1.3.8-2 .8a.4.4 0 0 1-.4-.4v-.8c0-.2.1-.4.4-.4.3 0 .6-.1.8-.4.3-.2.4-.5.4-.8V15a2.8 2.8 0 0 1 .8-2 2.8 2.8 0 0 1-.8-2Zm-3.3-.4c0 .4-.1.8-.5 1.1-.3.3-.7.5-1.1.5-.4 0-.8-.2-1.1-.5-.4-.3-.5-.7-.5-1.1 0-.5.1-.9.5-1.2.3-.3.7-.4 1.1-.4.4 0 .8.1 1.1.4.4.3.5.7.5 1.2ZM12 13c.4 0 .8.1 1.1.5.4.3.5.7.5 1.1 0 1-.1 1.6-.5 2a3 3 0 0 1-1.1 1c-.4.3-.8.4-1.1.4a.5.5 0 0 1-.5-.5V17a3 3 0 0 0 1-.2l.6-.6c-.6 0-1-.2-1.3-.5-.2-.3-.3-.7-.3-1 0-.5.1-1 .5-1.2.3-.4.7-.5 1.1-.5Z" fill-rule="evenodd"></path></svg>',shortcut:"Mod-Shift-C"}],commands:{insertCodeBlock:(...e)=>(Sk(),!0)}}),oo=".rte-content, .editora-content",Lk='[data-theme="dark"], .dark, .editora-theme-dark',Ak={title:"Insert Merge Tag",searchPlaceholder:"Search merge tags...",emptyStateText:"No merge tags found",cancelText:"Cancel",insertText:"Insert",showPreview:!0};function Mk(){return[{id:"USER",name:"User",tags:[{key:"first_name",label:"First Name",category:"User",preview:"John"},{key:"last_name",label:"Last Name",category:"User",preview:"Doe"},{key:"email",label:"Email",category:"User",preview:"john@example.com"},{key:"phone",label:"Phone",category:"User",preview:"+1-555-1234"},{key:"full_name",label:"Full Name",category:"User",preview:"John Doe"},{key:"username",label:"Username",category:"User",preview:"johndoe"}]},{id:"COMPANY",name:"Company",tags:[{key:"company_name",label:"Company Name",category:"Company",preview:"Acme Corp"},{key:"company_address",label:"Company Address",category:"Company",preview:"123 Main St"},{key:"company_phone",label:"Company Phone",category:"Company",preview:"+1-555-0000"},{key:"company_email",label:"Company Email",category:"Company",preview:"info@acme.com"}]},{id:"DATE",name:"Date",tags:[{key:"today",label:"Today",category:"Date",preview:new Date().toLocaleDateString()},{key:"tomorrow",label:"Tomorrow",category:"Date",preview:new Date(Date.now()+864e5).toLocaleDateString()},{key:"next_week",label:"Next Week",category:"Date",preview:new Date(Date.now()+6048e5).toLocaleDateString()}]},{id:"CUSTOM",name:"Custom",tags:[]}]}function ss(e,t){return e.trim().toUpperCase().replace(/[^A-Z0-9]+/g,"_").replace(/^_+|_+$/g,"")||`CATEGORY_${t+1}`}function Rk(e,t){return(e.key||e.value||e.label).trim().toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")||`tag_${t+1}`}function Dk(e){const t=(()=>{if(Array.isArray(e==null?void 0:e.categories)&&e.categories.length>0)return e.categories;if(Array.isArray(e==null?void 0:e.tags)&&e.tags.length>0){const i=new Map;return e.tags.forEach(l=>{const s=(l.category||"Custom").trim()||"Custom",c=i.get(s);c?c.push(l):i.set(s,[l])}),Array.from(i.entries()).map(([l,s],c)=>({id:ss(l,c),name:l,tags:s}))}return Mk()})(),n={},r=[];if(t.forEach((i,l)=>{const s=ss(i.id||i.name,l);r.push(s),n[s]={name:i.name,tags:(Array.isArray(i.tags)?i.tags:[]).map((c,d)=>{const u=Rk(c,d),f=(c.category||i.name).trim()||i.name;return{...c,key:u,category:f,categoryKey:s,searchIndex:`${c.label} ${u} ${f} ${c.description??""} ${c.value??""}`.toLowerCase()}})}}),r.length===0){const i="CUSTOM";r.push(i),n[i]={name:"Custom",tags:[]}}const o=e!=null&&e.defaultCategory?ss(e.defaultCategory,0):null,a=o&&r.includes(o)?o:r[0];return{categoriesByKey:n,categoryKeys:r,defaultCategory:a}}function Nk(e){const t=e==null?void 0:e.tokenTemplate;return typeof t=="function"?n=>{var o;const r=t(n);return typeof r=="string"&&r.trim()?r:((o=n.value)==null?void 0:o.trim())||`{{ ${n.label} }}`}:typeof t=="string"&&t.trim()?n=>t.replace(/\{key\}/gi,n.key).replace(/\{label\}/gi,n.label).replace(/\{category\}/gi,n.category).replace(/\{value\}/gi,n.value??""):n=>{var r;return((r=n.value)==null?void 0:r.trim())||`{{ ${n.label} }}`}}function Bk(e){return{catalog:Dk(e),dialog:{...Ak,...(e==null?void 0:e.dialog)||{}},formatToken:Nk(e)}}let fu=!1,pu=!1,rr=null,qi=null,na=null,mu=!1;function vg(e,t){if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}}function Vs(){if(fu||typeof document>"u")return;fu=!0;const e=document.createElement("style");e.id="merge-tag-plugin-styles",e.textContent=`
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
  `,document.head.appendChild(e)}function gu(){pu||typeof document>"u"||(pu=!0,document.addEventListener("focusin",e=>{const t=e.target,n=t==null?void 0:t.closest(oo);n&&(rr=n)}),document.addEventListener("selectionchange",()=>{const e=kg();e&&(rr=e)}))}function kg(){const e=window.getSelection();if(!e||e.rangeCount===0)return null;const n=e.getRangeAt(0).startContainer,r=n.nodeType===Node.ELEMENT_NODE?n:n.parentElement;return(r==null?void 0:r.closest(oo))||null}function wg(){const e=kg();if(e)return e;const t=document.activeElement,n=t==null?void 0:t.closest(oo);return n||(rr!=null&&rr.isConnected?rr:document.querySelector(oo))}function Pk(e){const t=e.parentNode;if(!t)return;const n=window.getSelection();if(!n)return;const r=document.createRange(),a=Array.from(t.childNodes).indexOf(e);a<0||(r.setStart(t,a),r.setEnd(t,a+1),n.removeAllRanges(),n.addRange(r))}function bu(e,t){var n;e instanceof Text&&e.data.length!==0&&(t?(e.data.startsWith(" ")||e.data.startsWith(" "))&&e.deleteData(0,1):(e.data.endsWith(" ")||e.data.endsWith(" "))&&e.deleteData(e.data.length-1,1),e.data.length===0&&((n=e.parentNode)==null||n.removeChild(e)))}function hu(e,t){const n=window.getSelection();if(!n)return;const r=document.createRange(),o=Math.max(0,Math.min(t,e.childNodes.length));r.setStart(e,o),r.collapse(!0),n.removeAllRanges(),n.addRange(r)}function Ik(e,t){const n=e.closest(oo),r=(n==null?void 0:n.innerHTML)??"",o=e.parentNode;if(!o)return!1;const i=Array.from(o.childNodes).indexOf(e);if(i<0)return!1;const l=e.previousSibling,s=e.nextSibling;return o.removeChild(e),t==="Backspace"?(bu(s,!0),hu(o,i)):(bu(l,!1),hu(o,i)),n&&(vg(n,r),n.dispatchEvent(new Event("input",{bubbles:!0}))),!0}function Hk(e){if(e.collapsed||!(e.startContainer instanceof HTMLElement||e.startContainer instanceof Text)||e.startContainer!==e.endContainer||e.endOffset!==e.startOffset+1)return null;const t=e.startContainer;if(!(t instanceof Element||t instanceof DocumentFragment))return null;const n=t.childNodes[e.startOffset];return n instanceof HTMLElement&&n.classList.contains("rte-merge-tag")?n:null}function Ok(e,t){if(!e.collapsed)return null;const{startContainer:n,startOffset:r}=e,o=a=>a instanceof HTMLElement&&a.classList.contains("rte-merge-tag")?a:null;if(n.nodeType===Node.ELEMENT_NODE){const a=n;return t==="Backspace"&&r>0?o(a.childNodes[r-1]||null):t==="Delete"?o(a.childNodes[r]||null):null}if(n.nodeType===Node.TEXT_NODE){const a=n;return t==="Backspace"?r===0?o(a.previousSibling):r===1&&(a.data[0]===" "||a.data[0]===" ")&&a.previousSibling instanceof HTMLElement&&a.previousSibling.classList.contains("rte-merge-tag")?a.previousSibling:null:r===a.data.length?o(a.nextSibling):null}return null}function yu(){mu||typeof document>"u"||(mu=!0,document.addEventListener("click",e=>{const t=e.target,n=t==null?void 0:t.closest(".rte-merge-tag");if(!n)return;const r=n.closest(oo);r&&(e.preventDefault(),e.stopPropagation(),r.focus({preventScroll:!0}),Pk(n))}),document.addEventListener("keydown",e=>{if(e.key!=="Backspace"&&e.key!=="Delete")return;const t=window.getSelection();if(!t||t.rangeCount===0)return;const n=t.getRangeAt(0),r=wg();if(!r||!r.contains(n.commonAncestorContainer))return;let o=Hk(n);o||(o=Ok(n,e.key)),o&&(e.preventDefault(),e.stopPropagation(),Ik(o,e.key))}))}function zk(e){return e?!!e.closest(Lk):!1}function qk(){na&&(na(),na=null),qi=null}function xu(e){const t=document.createRange();return t.selectNodeContents(e),t.collapse(!1),t}function _k(e,t){const n=window.getSelection(),r=t?t.cloneRange():xu(e),a=r.startContainer.isConnected&&r.endContainer.isConnected&&e.contains(r.commonAncestorContainer)?r:xu(e);return n&&(n.removeAllRanges(),n.addRange(a)),a}function Fk(e,t){const n=document.createElement("span");n.className="rte-merge-tag",n.setAttribute("contenteditable","false"),n.setAttribute("data-key",e.key),n.setAttribute("data-category",e.category),n.setAttribute("data-label",e.label),e.value&&n.setAttribute("data-value",e.value);const r=t(e);return n.setAttribute("data-token",r),n.setAttribute("aria-label",`Merge tag: ${e.label}`),n.textContent=r,n}function jk(e,t,n,r){const o=window.getSelection();if(!o)return!1;const a=e.innerHTML;e.focus({preventScroll:!0});const i=_k(e,t),l=i.startContainer.nodeType===Node.ELEMENT_NODE?i.startContainer:i.startContainer.parentElement,s=l==null?void 0:l.closest(".rte-merge-tag");s&&e.contains(s)&&(i.setStartAfter(s),i.setEndAfter(s));try{i.deleteContents();const c=Fk(n,r),d=document.createTextNode(" "),u=document.createDocumentFragment();u.appendChild(c),u.appendChild(d),i.insertNode(u);const f=document.createRange();return f.setStartAfter(d),f.collapse(!0),o.removeAllRanges(),o.addRange(f),vg(e,a),e.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch(c){return console.error("Failed to insert merge tag:",c),!1}}function Vk(e,t,n){var a;const r=((a=e.catalog.categoriesByKey[t])==null?void 0:a.tags)||[],o=n.trim().toLowerCase();return o?r.filter(i=>i.searchIndex.includes(o)):r}function Wk(e,t){var Sn;qk(),Vs();const n={category:t.catalog.defaultCategory,searchTerm:"",filteredTags:((Sn=t.catalog.categoriesByKey[t.catalog.defaultCategory])==null?void 0:Sn.tags)||[],selectedIndex:0,savedRange:(()=>{const A=window.getSelection();if(!A||A.rangeCount===0)return null;const D=A.getRangeAt(0);return e.contains(D.commonAncestorContainer)?D.cloneRange():null})(),searchRaf:null},r=document.createElement("div");r.className="rte-merge-tag-overlay",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),zk(e)&&r.classList.add("rte-ui-theme-dark");const o=document.createElement("div");o.className="rte-merge-tag-dialog";const a=document.createElement("div");a.className="rte-merge-tag-header";const i=document.createElement("h2");i.style.margin="0",i.style.fontSize="18px",i.style.fontWeight="700",i.textContent=t.dialog.title;const l=document.createElement("button");l.className="rte-merge-tag-close",l.setAttribute("aria-label","Close"),l.style.background="none",l.style.border="none",l.style.color="inherit",l.style.cursor="pointer",l.style.fontSize="20px",l.textContent="✕",a.appendChild(i),a.appendChild(l);const s=document.createElement("div");s.className="rte-merge-tag-body";const c=document.createElement("input");c.type="text",c.className="rte-merge-tag-input",c.placeholder=t.dialog.searchPlaceholder,c.setAttribute("aria-label","Search merge tags");const d=document.createElement("div");d.className="rte-merge-tag-tabs",t.catalog.categoryKeys.forEach(A=>{var se;const D=document.createElement("button");D.type="button",D.className="rte-merge-tag-tab",D.setAttribute("data-category",A),D.textContent=((se=t.catalog.categoriesByKey[A])==null?void 0:se.name)||A,d.appendChild(D)});const u=document.createElement("div");u.className="rte-merge-tag-list";const f=document.createElement("div");f.className="rte-merge-tag-preview",s.appendChild(c),s.appendChild(d),s.appendChild(u),s.appendChild(f);const m=document.createElement("div");m.className="rte-merge-tag-footer";const g=document.createElement("button");g.type="button",g.className="rte-merge-tag-btn-secondary",g.textContent=t.dialog.cancelText;const p=document.createElement("button");p.type="button",p.className="rte-merge-tag-btn-primary",p.textContent=t.dialog.insertText,m.appendChild(g),m.appendChild(p),o.appendChild(a),o.appendChild(s),o.appendChild(m),r.appendChild(o),document.body.appendChild(r),qi=r;const b=()=>{d.querySelectorAll(".rte-merge-tag-tab").forEach(D=>{const se=D.dataset.category===n.category;D.classList.toggle("active",se)})},h=()=>{if(n.filteredTags.length===0){n.selectedIndex=-1;return}n.selectedIndex<0&&(n.selectedIndex=0),n.selectedIndex>=n.filteredTags.length&&(n.selectedIndex=n.filteredTags.length-1)},x=()=>{if(!t.dialog.showPreview){f.style.display="none",p.disabled=n.filteredTags.length===0;return}h();const A=n.selectedIndex>=0?n.filteredTags[n.selectedIndex]:null;if(!A){f.style.display="none",p.disabled=!0;return}f.style.display="block",f.textContent=`Preview: ${t.formatToken(A)}`,p.disabled=!1},C=()=>{if(n.selectedIndex<0)return;const A=u.querySelector(`.rte-merge-tag-item[data-index="${n.selectedIndex}"]`);A==null||A.scrollIntoView({block:"nearest"})},k=()=>{const A=u.querySelector(".rte-merge-tag-item.selected");if(A==null||A.classList.remove("selected"),n.selectedIndex>=0){const D=u.querySelector(`.rte-merge-tag-item[data-index="${n.selectedIndex}"]`);D==null||D.classList.add("selected")}x(),C()},T=()=>{if(n.filteredTags=Vk(t,n.category,n.searchTerm),n.filteredTags.length>0&&n.selectedIndex<0&&(n.selectedIndex=0),h(),u.innerHTML="",n.filteredTags.length===0){const D=document.createElement("div");D.className="rte-merge-tag-empty",D.textContent=t.dialog.emptyStateText,u.appendChild(D),x();return}const A=document.createDocumentFragment();n.filteredTags.forEach((D,se)=>{const K=document.createElement("div");K.className="rte-merge-tag-item",K.setAttribute("data-index",String(se)),K.classList.toggle("selected",se===n.selectedIndex);const jl=document.createElement("div");if(jl.className="rte-merge-tag-item-label",jl.textContent=D.label,K.appendChild(jl),D.preview){const Vl=document.createElement("div");Vl.className="rte-merge-tag-item-preview",Vl.textContent=D.preview,K.appendChild(Vl)}A.appendChild(K)}),u.appendChild(A),k()},L=()=>{n.searchRaf!==null&&cancelAnimationFrame(n.searchRaf),n.searchRaf=requestAnimationFrame(()=>{n.searchRaf=null,n.searchTerm=c.value,n.selectedIndex=0,T()})},w=()=>{n.searchRaf!==null&&(cancelAnimationFrame(n.searchRaf),n.searchRaf=null),r.remove(),qi===r&&(qi=null,na=null)},v=()=>{if(h(),n.selectedIndex<0)return;const A=n.filteredTags[n.selectedIndex];jk(e,n.savedRange,A,t.formatToken)&&w()},E=A=>{const se=A.target.closest(".rte-merge-tag-tab");if(!se)return;const K=se.dataset.category;!K||!t.catalog.categoriesByKey[K]||(n.category=K,n.searchTerm="",c.value="",n.selectedIndex=0,b(),T())},H=A=>{const se=A.target.closest(".rte-merge-tag-item");if(!se)return;const K=Number(se.dataset.index||"-1");Number.isNaN(K)||K<0||K>=n.filteredTags.length||(n.selectedIndex=K,k())},_=A=>{const se=A.target.closest(".rte-merge-tag-item");if(!se)return;const K=Number(se.dataset.index||"-1");Number.isNaN(K)||K<0||K>=n.filteredTags.length||(n.selectedIndex=K,v())},Ve=A=>{if(A.key==="Escape"){A.preventDefault(),w();return}if(A.key==="ArrowDown"){if(A.preventDefault(),n.filteredTags.length===0)return;n.selectedIndex=Math.min(n.filteredTags.length-1,n.selectedIndex+1),k();return}if(A.key==="ArrowUp"){if(A.preventDefault(),n.filteredTags.length===0)return;n.selectedIndex=Math.max(0,n.selectedIndex-1),k();return}A.key==="Enter"&&(A.preventDefault(),v())},We=A=>{A.target===r&&w()};d.addEventListener("click",E),u.addEventListener("click",H),u.addEventListener("dblclick",_),c.addEventListener("input",L),c.addEventListener("keydown",Ve),r.addEventListener("click",We),o.addEventListener("keydown",Ve),l==null||l.addEventListener("click",w),g.addEventListener("click",w),p.addEventListener("click",v),na=()=>{d.removeEventListener("click",E),u.removeEventListener("click",H),u.removeEventListener("dblclick",_),c.removeEventListener("input",L),c.removeEventListener("keydown",Ve),r.removeEventListener("click",We),o.removeEventListener("keydown",Ve),l==null||l.removeEventListener("click",w),g.removeEventListener("click",w),p.removeEventListener("click",v),n.searchRaf!==null&&(cancelAnimationFrame(n.searchRaf),n.searchRaf=null),r.remove()},b(),T(),setTimeout(()=>{c.focus()},0)}const Kk=e=>({name:"mergeTag",config:e,init:()=>{Vs(),gu(),yu()},toolbar:[{label:"Merge Tag",command:"insertMergeTag",icon:"{{ }}"}],commands:{insertMergeTag:()=>{Vs(),gu(),yu();const t=wg();return t?(Wk(t,Bk(e)),!0):!1}}});let ie=null,Tt=null,ao=null,le=null,io="",lo="",ra="insert",oa=null,Ct=null,or=null;function Eg(e,t){if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}}function Uk(e){if(!e)return null;let t=e.startContainer;for(;t&&t!==document.body;){if(t.nodeType===Node.ELEMENT_NODE){const n=t;if(n.getAttribute("contenteditable")==="true")return n}t=t.parentNode}return null}const Gk=[{id:"formal-letter",name:"Formal Letter",category:"Letters",description:"Professional business letter template",html:`<p><strong>{{ Company Name }}</strong></p>
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
<p>A: [Answer here]</p>`}];let Nc=[...Gk];const Cg=()=>Nc,Sg=()=>{const e=new Set(Nc.map(t=>t.category));return Array.from(e)},Zk=e=>{const t=e.toLowerCase();return Nc.filter(n=>{var r,o;return n.name.toLowerCase().includes(t)||((r=n.description)==null?void 0:r.toLowerCase().includes(t))||((o=n.tags)==null?void 0:o.some(a=>a.toLowerCase().includes(t)))})},Tg=e=>Fg.sanitize(e,{ALLOWED_TAGS:["p","br","strong","em","u","h1","h2","h3","h4","ul","ol","li","blockquote","table","thead","tbody","tr","th","td","a","span"],ALLOWED_ATTR:["href","target","class","data-key","data-category"]});function Yk(e){Tt=document.createElement("div"),Tt.className="rte-dialog-overlay",Qk(e)&&Tt.classList.add("rte-ui-theme-dark"),Tt.addEventListener("click",()=>xn()),ie=document.createElement("div"),ie.className="rte-dialog rte-template-dialog",ie.addEventListener("click",n=>n.stopPropagation());const t=Sg();t.length>0&&!io&&(io=t[0]),$a(),Tt.appendChild(ie),document.body.appendChild(Tt),Xk(),aw()}function Xk(){$g(),oa=e=>{e.key==="Escape"&&(!Tt||!ie||(e.preventDefault(),e.stopPropagation(),xn()))},document.addEventListener("keydown",oa,!0)}function $g(){oa&&(document.removeEventListener("keydown",oa,!0),oa=null)}const Jk='[data-theme="dark"], .dark, .editora-theme-dark',Bc=()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return null;const t=e.anchorNode,n=t instanceof HTMLElement?t:t==null?void 0:t.parentElement;return(n==null?void 0:n.closest(".rte-content, .editora-content"))||null},Qk=e=>{const t=e||Bc();return t?!!t.closest(Jk):!1};function Pc(){const e=Uk(ao);if(e)return e;if(or!=null&&or.isConnected)return or;const t=Bc();return t||document.querySelector(".rte-content, .editora-content")}function $a(){if(!ie)return;const e=Sg(),t=Ic();ie.innerHTML=`
    <div class="rte-dialog-header">
      <h2>Insert Template</h2>
      <button class="rte-dialog-close" aria-label="Close">✕</button>
    </div>

    <div class="rte-dialog-body">
      <!-- Search -->
      <input
        type="text"
        placeholder="Search templates..."
        value="${lo}"
        class="rte-input rte-template-search"
        aria-label="Search templates"
      />

      <!-- Category Tabs -->
      <div class="rte-tabs">
        ${e.map(n=>`
          <button class="rte-tab ${io===n?"active":""}" data-category="${n}">
            ${n}
          </button>
        `).join("")}
      </div>

      <!-- Template List -->
      <div class="rte-template-list">
        ${t.length>0?t.map(n=>`
          <div
            class="rte-template-item ${(le==null?void 0:le.id)===n.id?"selected":""}"
            data-template-id="${n.id}"
          >
            <div class="template-name">${n.name}</div>
            ${n.description?`<div class="template-description">${n.description}</div>`:""}
          </div>
        `).join(""):'<div class="rte-empty-state">No templates found</div>'}
      </div>

      <!-- Preview -->
      ${le?`
        <div class="rte-template-preview">
          <strong>Preview:</strong>
          <div class="template-preview-content">${le.html}</div>
        </div>
      `:""}

      <!-- Insert Mode Toggle -->
      <div class="rte-insert-mode">
        <label>
          <input type="radio" name="insertMode" value="insert" ${ra==="insert"?"checked":""} />
          Insert at cursor
        </label>
        <label>
          <input type="radio" name="insertMode" value="replace" ${ra==="replace"?"checked":""} />
          Replace document
        </label>
      </div>
    </div>

    <div class="rte-dialog-footer">
      <button class="rte-button-secondary rte-cancel-btn">Cancel</button>
      <button class="rte-button-primary rte-insert-btn" ${le?"":"disabled"}>
        ${ra==="insert"?"Insert":"Replace"}
      </button>
    </div>
  `,tw()}function ew(){if(!ie)return;ie.innerHTML=`
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
  `;const e=ie.querySelector(".rte-cancel-warning-btn"),t=ie.querySelector(".rte-confirm-replace-btn");e==null||e.addEventListener("click",()=>$a()),t==null||t.addEventListener("click",()=>nw())}function Ic(){const e=Cg();return lo.trim()?Zk(lo):io?e.filter(t=>t.category===io):e}function tw(){if(!ie)return;const e=ie.querySelector(".rte-dialog-close");e==null||e.addEventListener("click",()=>xn());const t=ie.querySelector(".rte-cancel-btn");t==null||t.addEventListener("click",()=>xn());const n=ie.querySelector(".rte-insert-btn");n==null||n.addEventListener("click",()=>cs());const r=ie.querySelector(".rte-template-search");r==null||r.addEventListener("input",s=>{Ct!==null&&cancelAnimationFrame(Ct),lo=s.target.value,Ct=requestAnimationFrame(()=>{Ct=null,vu()})}),r==null||r.addEventListener("keydown",s=>{s.key==="Enter"&&le?cs():s.key==="Escape"&&xn()});const o=ie.querySelector(".rte-tabs");o==null||o.addEventListener("click",s=>{const d=s.target.closest(".rte-tab");if(!d)return;const u=d.getAttribute("data-category");u&&(io=u,lo="",Ct!==null&&(cancelAnimationFrame(Ct),Ct=null),vu())});const a=ie.querySelector(".rte-template-list"),i=s=>{const d=s.target.closest(".rte-template-item");if(!d)return null;const u=d.getAttribute("data-template-id");return u&&Cg().find(f=>f.id===u)||null};a==null||a.addEventListener("click",s=>{const c=i(s);c&&(le=c,$a())}),a==null||a.addEventListener("dblclick",s=>{const c=i(s);c&&(le=c,cs())});const l=ie.querySelector(".rte-insert-mode");l==null||l.addEventListener("change",s=>{const c=s.target;!c||c.name!=="insertMode"||(ra=c.value,$a())})}function vu(){const e=Ic();e.length>0?(!le||!e.find(t=>t.id===le.id))&&(le=e[0]):le=null,$a()}function cs(){var e;if(le)if(ra==="replace"){const t=Pc();if((e=t==null?void 0:t.innerHTML)!=null&&e.trim()){ew();return}Lg(le),xn()}else rw(le),xn()}function nw(){le&&(Lg(le),xn())}function rw(e){const t=window.getSelection();if(!t)return;const n=Pc();if(!n)return;if(ao)t.removeAllRanges(),t.addRange(ao);else{const l=document.createRange();l.selectNodeContents(n),l.collapse(!1),t.removeAllRanges(),t.addRange(l)}if(t.rangeCount===0)return;const r=t.getRangeAt(0),o=(n==null?void 0:n.innerHTML)??"",a=document.createRange().createContextualFragment(Tg(e.html));r.deleteContents(),r.insertNode(a);const i=document.createRange();i.setStartAfter(r.endContainer),i.collapse(!0),t.removeAllRanges(),t.addRange(i),n&&(Eg(n,o),n.dispatchEvent(new Event("input",{bubbles:!0})))}function Lg(e){const t=Pc();if(t){const n=t.innerHTML;t.innerHTML=Tg(e.html),Eg(t,n),t.dispatchEvent(new Event("input",{bubbles:!0}))}}function xn(){$g(),Ct!==null&&(cancelAnimationFrame(Ct),Ct=null),Tt&&(Tt.remove(),Tt=null),ie=null,ao=null,lo="",or=null}function ow(e){const t=window.getSelection();t&&t.rangeCount>0?ao=t.getRangeAt(0).cloneRange():ao=null;const n=Ic();n.length>0&&!le&&(le=n[0]);const r=(e==null?void 0:e.contentElement)instanceof HTMLElement?e.contentElement:Bc();or=r||null,Yk(r)}function aw(){if(typeof document>"u")return;const e="template-plugin-dialog-styles";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
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
  `,document.head.appendChild(t)}const iw=()=>({name:"template",toolbar:[{label:"Template",command:"insertTemplate",icon:'<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3 3V9H21V3H3ZM19 5H5V7H19V5Z" fill="#000000"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M3 11V21H11V11H3ZM9 13H5V19H9V13Z" fill="#000000"></path> <path d="M21 11H13V13H21V11Z" fill="#000000"></path> <path d="M13 15H21V17H13V15Z" fill="#000000"></path> <path d="M21 19H13V21H21V19Z" fill="#000000"></path> </g></svg>'}],commands:{insertTemplate:(e,t)=>(ow(t),!0)},keymap:{}}),Ws=new WeakMap;let Cn=null,ku=!1,wu=0;const Ks="User";function _i(e){return wu+=1,`${e}-${Date.now()}-${wu}`}function yl(e){if(!e)return null;const t=e instanceof Element?e:e.parentElement;return t?t.closest("[data-editora-editor]")||t.closest(".rte-editor")||t.closest(".editora-editor"):null}function Eu(e){const t=(e==null?void 0:e.editorElement)||(e==null?void 0:e.contentElement)||null;if(!(t instanceof HTMLElement))return;const n=t.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(t.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?t:null);n&&(Cn=n)}function zl(e,t){return t.contains(e.commonAncestorContainer)}function lw(){if(typeof window<"u"){const r=window.__editoraCommandEditorRoot;if(r instanceof HTMLElement){const o=r.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(r.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?r:null);if(o)return Cn=o,window.__editoraCommandEditorRoot=null,o}}const e=document.activeElement,t=e?yl(e):null;if(t)return t;const n=window.getSelection();if(n&&n.rangeCount>0){const r=yl(n.getRangeAt(0).commonAncestorContainer);if(r)return r}return Cn}function sw(e){const t=Ws.get(e);if(t)return t;const n={root:e,comments:new Map,panelVisible:!1,panelElement:null,expandedComments:new Set,replyTexts:{},savedSelection:null,newCommentText:"",selectionChangeListener:null};return Ws.set(e,n),n}function Xt(){const e=lw();return e?(Cn=e,sw(e)):null}function Ag(e){const t=window.getSelection();if(!t||t.rangeCount===0||t.isCollapsed)return null;const n=t.getRangeAt(0);return zl(n,e)?n.cloneRange():null}function Mg(e,t){if(!t.anchorId)return;const n=e.root.querySelector(`#${t.anchorId}`);n&&n.classList.toggle("rte-comment-anchor-resolved",t.resolved)}function xi(e,t,n){const r=e.comments.get(t);if(!r||!r.anchorId)return;const o=e.root.querySelector(`#${r.anchorId}`);o&&o.classList.toggle("highlighted",n)}function cw(e,t,n){t.onclick=r=>{r.preventDefault(),r.stopPropagation(),Cn=e.root,e.expandedComments.add(n),La(e,!0),at(e)}}function dw(e){const t=e.parentNode;if(t){for(;e.firstChild;)t.insertBefore(e.firstChild,e);e.remove()}}function La(e,t){if(e.panelVisible=t,t){kw(),uw(e),e.root.setAttribute("data-rte-comments-open","true"),e.panelElement&&(e.panelElement.classList.add("is-open"),e.panelElement.setAttribute("aria-hidden","false")),fw(e);return}e.root.removeAttribute("data-rte-comments-open"),pw(e),e.panelElement&&(e.panelElement.remove(),e.panelElement=null)}function uw(e){if(e.panelElement)return;const t=document.createElement("aside");t.className="rte-comments-panel",t.setAttribute("role","complementary"),t.setAttribute("aria-label","Comments"),t.setAttribute("aria-hidden","true"),window.getComputedStyle(e.root).position==="static"&&(e.root.style.position="relative"),e.root.appendChild(t),e.panelElement=t}function fw(e){e.selectionChangeListener||(e.selectionChangeListener=()=>{const t=window.getSelection();if(!t||t.rangeCount===0||t.isCollapsed)return;const n=t.getRangeAt(0);zl(n,e.root)&&(e.savedSelection=n.cloneRange(),Cn=e.root)},document.addEventListener("selectionchange",e.selectionChangeListener))}function pw(e){e.selectionChangeListener&&(document.removeEventListener("selectionchange",e.selectionChangeListener),e.selectionChangeListener=null)}function mw(e){return Array.from(e.comments.values()).sort((t,n)=>n.createdAt.localeCompare(t.createdAt))}function Cu(e){return new Date(e).toLocaleString()}function gw(e,t){const n=e.expandedComments.has(t.id),r=document.createElement("article");r.className=`rte-comment-item${t.resolved?" resolved":""}`,r.innerHTML=`
    <header class="rte-comment-header">
      <div class="rte-comment-meta">
        <strong class="rte-comment-author">${t.author}</strong>
        <time class="rte-comment-date">${Cu(t.createdAt)}</time>
      </div>
      <button class="rte-comment-expand" type="button" aria-label="Toggle details">
        ${n?"▾":"▸"}
      </button>
    </header>
    <div class="rte-comment-text"></div>
    ${t.selectedText?`<blockquote class="rte-comment-selection">${t.selectedText}</blockquote>`:""}
    <section class="rte-comment-expanded${n?" show":""}"></section>
  `;const o=r.querySelector(".rte-comment-text");o&&(o.textContent=t.text);const a=r.querySelector(".rte-comment-expand");a==null||a.addEventListener("click",()=>{e.expandedComments.has(t.id)?e.expandedComments.delete(t.id):e.expandedComments.add(t.id),at(e)});const i=r.querySelector(".rte-comment-expanded");if(i&&n){if(t.replies.length>0){const c=document.createElement("div");c.className="rte-comment-replies",t.replies.forEach(d=>{const u=document.createElement("div");u.className="rte-comment-reply",u.innerHTML=`
          <div class="rte-comment-reply-header">
            <strong>${d.author}</strong>
            <time>${Cu(d.createdAt)}</time>
          </div>
          <div class="rte-comment-reply-text"></div>
        `;const f=u.querySelector(".rte-comment-reply-text");f&&(f.textContent=d.text),c.appendChild(u)}),i.appendChild(c)}if(!t.resolved){const c=document.createElement("div");c.className="rte-comment-reply-composer",c.innerHTML=`
        <textarea class="rte-comment-reply-textarea" rows="2" placeholder="Reply..."></textarea>
        <button type="button" class="rte-comment-btn primary">Reply</button>
      `;const d=c.querySelector(".rte-comment-reply-textarea"),u=c.querySelector(".rte-comment-btn.primary");if(d&&u){d.value=e.replyTexts[t.id]||"";const f=()=>{const m=!!d.value.trim();u.disabled=!m};f(),d.addEventListener("input",()=>{e.replyTexts[t.id]=d.value,f()}),u.addEventListener("click",()=>{const m=d.value.trim();m&&(vw(t.id,Ks,m),e.replyTexts[t.id]="",at(e))})}i.appendChild(c)}const l=document.createElement("div");if(l.className="rte-comment-actions",t.anchorId){const c=document.createElement("button");c.type="button",c.className="rte-comment-btn ghost",c.textContent="Jump to text",c.onclick=()=>{const d=e.root.querySelector(`#${t.anchorId}`);d&&(d.scrollIntoView({behavior:"smooth",block:"center",inline:"nearest"}),xi(e,t.id,!0),window.setTimeout(()=>xi(e,t.id,!1),1200))},l.appendChild(c)}if(t.resolved){const c=document.createElement("button");c.type="button",c.className="rte-comment-btn ghost",c.textContent="Reopen",c.onclick=()=>yw(t.id),l.appendChild(c)}else{const c=document.createElement("button");c.type="button",c.className="rte-comment-btn success",c.textContent="Resolve",c.onclick=()=>hw(t.id,Ks),l.appendChild(c)}const s=document.createElement("button");s.type="button",s.className="rte-comment-btn danger",s.textContent="Delete",s.onclick=()=>xw(t.id),l.appendChild(s),i.appendChild(l)}return r.addEventListener("mouseenter",()=>xi(e,t.id,!0)),r.addEventListener("mouseleave",()=>xi(e,t.id,!1)),r}function at(e){const t=e||Xt();if(!(t!=null&&t.panelElement))return;const n=mw(t);t.panelElement.innerHTML=`
    <div class="rte-comments-header">
      <div>
        <h3>Comments (${n.length})</h3>
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
    ${n.length===0?'<div class="rte-comments-empty">No comments yet.</div>':'<div class="rte-comments-list"></div>'}
  `;const r=t.panelElement.querySelector(".rte-comments-close");r==null||r.addEventListener("click",()=>{La(t,!1)});const o=t.panelElement.querySelector(".new-comment-textarea"),a=t.panelElement.querySelector(".add-comment-btn");if(o&&a){o.value=t.newCommentText;const l=()=>{const s=!!o.value.trim();a.disabled=!s};l(),o.addEventListener("input",()=>{t.newCommentText=o.value,l()}),o.addEventListener("keydown",s=>{(s.ctrlKey||s.metaKey)&&s.key==="Enter"&&(s.preventDefault(),a.click())}),a.addEventListener("click",()=>{const s=o.value.trim();if(!s)return;const c=!!t.savedSelection;bw(Ks,s,!c),t.newCommentText="",at(t)})}const i=t.panelElement.querySelector(".rte-comments-list");i&&n.forEach(l=>{i.appendChild(gw(t,l))})}function Su(){ku||(ku=!0,document.addEventListener("focusin",e=>{const t=yl(e.target);t&&(Cn=t)}),document.addEventListener("selectionchange",()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return;const t=e.getRangeAt(0),n=yl(t.commonAncestorContainer);if(!n)return;Cn=n;const r=Ws.get(n);!r||e.isCollapsed||zl(t,n)&&(r.savedSelection=t.cloneRange())}),document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;const t=Xt();!t||!t.panelVisible||(e.preventDefault(),e.stopPropagation(),La(t,!1))},!0))}function bw(e,t,n=!1){var u;const r=Xt();if(!r)return"";const o=t.trim();if(!o)return"";if(n){const f=_i("comment");return r.comments.set(f,{id:f,anchorId:"",selectedText:"",author:e,text:o,createdAt:new Date().toISOString(),resolved:!1,replies:[]}),at(r),f}const a=r.savedSelection||Ag(r.root);if(!a||!zl(a,r.root))return"";const i=a.toString().trim();if(!i)return"";const l=_i("comment"),s=_i("comment-anchor"),c=document.createElement("span");c.id=s,c.className="rte-comment-anchor",c.setAttribute("data-comment-id",l),c.setAttribute("title","Commented text");try{const f=a.cloneRange(),m=f.extractContents();if(!((u=m.textContent)!=null&&u.trim()))return"";c.appendChild(m),f.insertNode(c)}catch{return""}cw(r,c,l),r.comments.set(l,{id:l,anchorId:s,selectedText:i,author:e,text:o,createdAt:new Date().toISOString(),resolved:!1,replies:[]}),r.savedSelection=null;const d=window.getSelection();return d==null||d.removeAllRanges(),at(r),l}function hw(e,t){const n=Xt();if(!n)return;const r=n.comments.get(e);r&&(r.resolved=!0,r.resolvedBy=t,r.resolvedAt=new Date().toISOString(),Mg(n,r),at(n))}function yw(e){const t=Xt();if(!t)return;const n=t.comments.get(e);n&&(n.resolved=!1,n.resolvedBy=void 0,n.resolvedAt=void 0,Mg(t,n),at(t))}function xw(e){const t=Xt();if(!t)return;const n=t.comments.get(e);if(n){if(n.anchorId){const r=t.root.querySelector(`#${n.anchorId}`);r&&dw(r)}t.comments.delete(e),t.expandedComments.delete(e),delete t.replyTexts[e],at(t)}}function vw(e,t,n){const r=Xt();if(!r)return;const o=r.comments.get(e);if(!o)return;const a=n.trim();a&&(o.replies.push({id:_i("reply"),author:t,text:a,createdAt:new Date().toISOString()}),at(r))}function kw(){if(document.getElementById("rte-comments-panel-styles"))return;const e=document.createElement("style");e.id="rte-comments-panel-styles",e.textContent=`
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
  `,document.head.appendChild(e)}const ww=()=>({name:"comments",toolbar:[{label:"Add Comment",command:"addComment",type:"button",icon:'<svg fill="#000000" width="24px" height="24px" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;}</style></defs><title>add-comment</title><path d="M17.74,30,16,29l4-7h6a2,2,0,0,0,2-2V8a2,2,0,0,0-2-2H6A2,2,0,0,0,4,8V20a2,2,0,0,0,2,2h9v2H6a4,4,0,0,1-4-4V8A4,4,0,0,1,6,4H26a4,4,0,0,1,4,4V20a4,4,0,0,1-4,4H21.16Z"></path><polygon points="17 9 15 9 15 13 11 13 11 15 15 15 15 19 17 19 17 15 21 15 21 13 17 13 17 9"></polygon><rect class="cls-1" width="32" height="32"></rect></svg>'},{label:"Show / Hide Comments",command:"toggleComments",type:"button",icon:'<svg width="24px" height="24px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 1H4V11H8L10 13L12 11H16V1Z" fill="#000000"></path><path d="M2 5V13H7.17157L8.70711 14.5355L7.29289 15.9497L6.34315 15H0V5H2Z" fill="#000000"></path></svg>'}],commands:{addComment:(e,t)=>{var o;Eu(t),Su();const n=Xt();if(!n)return!1;if(n.savedSelection=Ag(n.root),n.savedSelection){const a=window.getSelection();a==null||a.removeAllRanges()}La(n,!0),at(n);const r=(o=n.panelElement)==null?void 0:o.querySelector(".new-comment-textarea");return r==null||r.focus({preventScroll:!0}),!0},toggleComments:(e,t)=>{Eu(t),Su();const n=Xt();return n?(La(n,!n.panelVisible),n.panelVisible&&at(n),!0):!1}},keymap:{}}),Rg=new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","is","are","be","was","were","have","has","had","do","does","did","will","would","could","should","may","might","must","can","this","that","these","those","what","which","who","whom","where","when","why","how","all","each","every","both","few","more","most","other","same","such","no","nor","not","only","own","so","than","too","very","just","as","if","because","while","although","though","it","its","their","them","they","you","he","she","we","me","him","her","us","our","i","my","your","his","hers","ours","yours","theirs","editor","document","text","word","paragraph","line","page","content","hello","world","test","example","sample","demo","lorem","ipsum"]),ql=new Set,_l=new Set;let vn=!1,pt=null,Vr=null,he=null,Te=null,aa=null,xl=!1,_t=null,Tu=!1,Wr=0,Kr=null;const Dg={characterData:!0,childList:!0,subtree:!0},$u="rte-spellcheck-styles",Lu="__editoraCommandEditorRoot";function Ew(e){var a;const t=(e==null?void 0:e.contentElement)||(e==null?void 0:e.editorElement)||null;if(!(t instanceof HTMLElement))return;const n=t.getAttribute("contenteditable")==="true"?t:(a=t.querySelector)==null?void 0:a.call(t,'[contenteditable="true"]');if(n instanceof HTMLElement){Te=n,_t=n;return}const r=t.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(t.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?t:null),o=Hc(r);o&&(Te=o,_t=o)}function Ng(){if(typeof window>"u")return null;const e=window[Lu];if(!(e instanceof HTMLElement))return null;window[Lu]=null;const t=e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(e.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?e:null);if(t){const r=Hc(t);if(r)return r;if(t.getAttribute("contenteditable")==="true")return t}if(e.getAttribute("contenteditable")==="true")return e;const n=e.closest('[contenteditable="true"]');return n instanceof HTMLElement?n:null}function Us(){let e=document.getElementById($u);e||(e=document.createElement("style"),e.id=$u,document.head.appendChild(e)),e.textContent=`
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
  `}function Gn(){if(Te&&document.contains(Te))return Te;const e=Pg();return e&&(Te=e),e}function Bg(e){if(!e)return;const t=e.nodeType===Node.ELEMENT_NODE?e:e.parentElement,n=t==null?void 0:t.closest('[contenteditable="true"]');n&&(Te=n)}function Hc(e){if(!e)return null;const t=e.querySelector('[contenteditable="true"]');return t instanceof HTMLElement?t:null}function Cw(){if(Tu)return;const e=t=>{const n=t.target;if(!n)return;const r=n.closest('.editora-toolbar-button[data-command="toggleSpellCheck"], .rte-toolbar-button[data-command="toggleSpellCheck"]');if(!r)return;const o=r.closest("[data-editora-editor]"),a=Hc(o);a&&(_t=a,Te=a)};document.addEventListener("pointerdown",e,!0),Tu=!0}function Sw(){const e=Ng();if(e&&document.contains(e))return Te=e,_t=null,e;if(_t&&document.contains(_t)){const t=_t;return _t=null,Te=t,t}return Pg()}function Tw(){Wr+=1,Wr===1&&pt&&pt.disconnect()}function $w(){if(Wr===0||(Wr-=1,Wr>0)||!pt)return;const e=Gn();e&&pt.observe(e,Dg)}function Oc(e){Tw();try{return e()}finally{$w()}}const Lw=()=>{try{const e=localStorage.getItem("rte-custom-dictionary");e&&JSON.parse(e).forEach(n=>ql.add(n.toLowerCase()))}catch(e){console.warn("Failed to load custom dictionary:",e)}},Aw=()=>{try{const e=Array.from(ql);localStorage.setItem("rte-custom-dictionary",JSON.stringify(e))}catch(e){console.warn("Failed to save custom dictionary:",e)}};function Mw(e,t){const n=[];for(let r=0;r<=t.length;r++)n[r]=[r];for(let r=0;r<=e.length;r++)n[0][r]=r;for(let r=1;r<=t.length;r++)for(let o=1;o<=e.length;o++)t.charAt(r-1)===e.charAt(o-1)?n[r][o]=n[r-1][o-1]:n[r][o]=Math.min(n[r-1][o-1]+1,n[r][o-1]+1,n[r-1][o]+1);return n[t.length][e.length]}function Rw(e){const t=e.toLowerCase();return Rg.has(t)||ql.has(t)||_l.has(t)}function Dw(e,t=5){const n=e.toLowerCase(),o=Array.from(Rg).map(a=>({word:a,distance:Mw(n,a)}));return o.sort((a,i)=>a.distance-i.distance),o.filter(a=>a.distance<=3).slice(0,t).map(a=>a.word)}function Nw(e){if(e.nodeType!==Node.ELEMENT_NODE)return!1;const t=e;return!!(t.closest('code, pre, [contenteditable="false"], .rte-widget, .rte-template, .rte-comment, .rte-merge-tag')||t.hasAttribute("data-comment-id")||t.hasAttribute("data-template")||t.hasAttribute("data-merge-tag"))}function Bw(e){const t=[],n=/([\p{L}\p{M}\p{N}\p{Emoji_Presentation}\u200d'-]+|[\uD800-\uDBFF][\uDC00-\uDFFF])/gu;let r;for(;(r=n.exec(e.data))!==null;){const o=r[0],a=r.index,i=a+o.length;/https?:\/\//.test(o)||/@/.test(o)||/\{\{.*\}\}/.test(o)||/^\d+$/.test(o)||Rw(o)||/[a-z][A-Z]/.test(o)||/-/.test(o)||o[0]===o[0].toUpperCase()&&o.length>1||t.push({id:`${o}-${a}`,node:e,startOffset:a,endOffset:i,word:o,suggestions:Dw(o),ignored:!1})}return t}const Pg=()=>{const e=Ng();if(e&&document.contains(e))return Te=e,e;const t=window.getSelection();if(t&&t.rangeCount>0){let r=t.getRangeAt(0).startContainer;for(;r&&r!==document.body;){if(r.nodeType===Node.ELEMENT_NODE){const o=r;if(o.getAttribute("contenteditable")==="true")return o}r=r.parentNode}}const n=document.activeElement;if(n){if(n.getAttribute("contenteditable")==="true")return n;const r=n.closest('[contenteditable="true"]');if(r)return r;const o=n.closest("[data-editora-editor]");if(o){const a=o.querySelector('[contenteditable="true"]');if(a)return a}}return document.querySelector('[contenteditable="true"]')};function zc(){const e=Gn();if(!e)return[];const t=[],n=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,{acceptNode:o=>{var a;return!((a=o.textContent)!=null&&a.trim())||o.parentNode&&Nw(o.parentNode)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});let r=n.nextNode();for(;r;)t.push(...Bw(r)),r=n.nextNode();return t}function Un(e){const t=Gn();t&&(e||(e=zc()),Oc(()=>{t.querySelectorAll(".rte-misspelled").forEach(n=>{const r=n.parentNode;if(r){for(;n.firstChild;)r.insertBefore(n.firstChild,n);r.removeChild(n)}}),e.forEach(n=>{if(_l.has(n.word.toLowerCase()))return;const r=n.node.data.length;if(!(n.startOffset<0||n.endOffset>r||n.startOffset>=n.endOffset))try{const o=document.createRange();o.setStart(n.node,n.startOffset),o.setEnd(n.node,n.endOffset);const a=document.createElement("span");a.className="rte-misspelled",a.setAttribute("data-word",n.word),a.setAttribute("data-suggestions",n.suggestions.join(",")),a.setAttribute("title",`Suggestions: ${n.suggestions.join(", ")}`),a.style.borderBottom="2px wavy red",a.style.cursor="pointer",o.surroundContents(a)}catch{}})}),vl(e))}function Fl(){const e=Gn();e&&Oc(()=>{e.querySelectorAll(".rte-misspelled").forEach(t=>{const n=t.parentNode;if(n){for(;t.firstChild;)n.insertBefore(t.firstChild,t);n.removeChild(t)}})})}function Pw(e,t){Oc(()=>{const n=document.createRange();n.setStart(e.node,e.startOffset),n.setEnd(e.node,e.endOffset);const r=document.createTextNode(t);n.deleteContents(),n.insertNode(r)})}function Ig(e){_l.add(e.toLowerCase()),Fl(),Un()}function Hg(e){ql.add(e.toLowerCase()),Aw(),Fl(),Un()}function Iw(e){const t=Gn();if(!t)return{total:0,misspelled:0,accuracy:100};e||(e=zc());const n=e.filter(i=>!_l.has(i.word.toLowerCase())).length,a=((t.textContent||"").match(/[\p{L}\p{M}\p{N}]+/gu)||[]).length;return{total:a,misspelled:n,accuracy:a>0?(a-n)/a*100:100}}function Hw(e,t){const n=document.createTextNode(t);e.replaceWith(n)}function Ow(e){e.classList.remove("rte-misspelled"),e.removeAttribute("data-word"),e.removeAttribute("data-suggestions"),e.removeAttribute("title"),e.style.borderBottom="",e.style.cursor=""}function zw(e,t,n,r,o){Bg(o),document.querySelectorAll(".rte-spellcheck-menu").forEach(m=>m.remove());const a=document.createElement("div");if(a.className="rte-spellcheck-menu",r.slice(0,5).forEach(m=>{const g=document.createElement("div");g.className="rte-spellcheck-menu-item",g.textContent=m,g.onclick=()=>{Hw(o,m),window.setTimeout(()=>{vn&&(Un(),vl())},0),a.remove()},a.appendChild(g)}),r.length>0){const m=document.createElement("div");m.style.cssText="height: 1px; background: #ddd; margin: 4px 0;",a.appendChild(m)}const i=document.createElement("div");i.className="rte-spellcheck-menu-item meta",i.textContent="Ignore Once",i.onclick=()=>{Ow(o),a.remove()},a.appendChild(i);const l=document.createElement("div");l.className="rte-spellcheck-menu-item meta",l.textContent="Ignore All",l.onclick=()=>{Ig(n),a.remove()},a.appendChild(l);const s=document.createElement("div");s.className="rte-spellcheck-menu-item positive",s.textContent="Add to Dictionary",s.onclick=()=>{Hg(n),a.remove()},a.appendChild(s),document.body.appendChild(a);const c=a.getBoundingClientRect(),d=window.innerWidth-c.width-8,u=window.innerHeight-c.height-8;a.style.left=`${Math.max(8,Math.min(e,d))}px`,a.style.top=`${Math.max(8,Math.min(t,u))}px`;const f=m=>{a.contains(m.target)||(a.remove(),document.removeEventListener("mousedown",f))};setTimeout(()=>document.addEventListener("mousedown",f),0)}function Au(){xl||(aa=e=>{const t=e.target;if(t&&t.classList.contains("rte-misspelled")){e.preventDefault(),Bg(t);const n=t.getAttribute("data-word"),r=(t.getAttribute("data-suggestions")||"").split(",").filter(o=>o);zw(e.clientX,e.clientY,n,r,t)}},document.addEventListener("contextmenu",aa),xl=!0)}function qw(){!xl||!aa||(document.removeEventListener("contextmenu",aa),aa=null,xl=!1)}function _w(e){return e.closest("[data-editora-editor]")||e.parentElement||e}function Mu(){const e=Gn();if(!e)throw new Error("Spell check panel requested without active editor");const t=_w(e);Us();const n=document.createElement("div");return n.className="rte-spell-check-panel",window.getComputedStyle(t).position==="static"&&(t.style.position="relative"),t.appendChild(n),n}function vl(e){if(!he)return;const t=e||zc(),n=Iw(t);he.innerHTML=`
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
        <strong class="rte-spellcheck-stat-value">${n.total}</strong>
      </div>
      <div class="rte-spellcheck-stat">
        <span class="rte-spellcheck-stat-label">Misspelled</span>
        <strong class="rte-spellcheck-stat-value">${n.misspelled}</strong>
      </div>
      <div class="rte-spellcheck-stat">
        <span class="rte-spellcheck-stat-label">Accuracy</span>
        <strong class="rte-spellcheck-stat-value">${n.accuracy.toFixed(1)}%</strong>
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
  `;const r=he.querySelector(".rte-spellcheck-close");r==null||r.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),qc()}),he.querySelectorAll(".rte-spellcheck-word-header").forEach(o=>{o.addEventListener("click",()=>{const a=o.closest(".rte-spellcheck-item"),i=a==null?void 0:a.querySelector(".rte-spellcheck-suggestions"),l=o.querySelector(".rte-spellcheck-caret");i&&l&&(i.classList.contains("show")?(i.classList.remove("show"),l.textContent="▶"):(i.classList.add("show"),l.textContent="▼"))})}),he.querySelectorAll(".suggestion-btn").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-suggestion"),i=o.closest(".rte-spellcheck-item");i==null||i.getAttribute("data-word");const l=parseInt((i==null?void 0:i.getAttribute("data-index"))||"0");t[l]&&(Pw(t[l],a),Un())})}),he.querySelectorAll(".ignore-btn").forEach(o=>{o.addEventListener("click",()=>{const a=o.closest(".rte-spellcheck-item"),i=a==null?void 0:a.getAttribute("data-word");Ig(i)})}),he.querySelectorAll(".add-btn").forEach(o=>{o.addEventListener("click",()=>{const a=o.closest(".rte-spellcheck-item"),i=a==null?void 0:a.getAttribute("data-word");Hg(i)})})}function Ru(){const e=Gn();e&&(pt&&pt.disconnect(),pt=new MutationObserver(t=>{Wr>0||t.some(n=>n.type==="characterData"||n.type==="childList")&&(Vr&&clearTimeout(Vr),Vr=window.setTimeout(()=>{vn&&Un()},350))}),pt.observe(e,{...Dg}))}function Og(){pt&&(pt.disconnect(),pt=null),Vr&&(clearTimeout(Vr),Vr=null)}function zg(){document.querySelectorAll(".rte-spellcheck-menu").forEach(e=>e.remove())}function Du(){Kr||(Kr=e=>{e.key!=="Escape"||!vn||(e.preventDefault(),e.stopPropagation(),qc())},document.addEventListener("keydown",Kr,!0))}function Fw(){Kr&&(document.removeEventListener("keydown",Kr,!0),Kr=null)}function qc(){return vn&&(Fl(),Og(),qw(),zg(),he&&(he.remove(),he=null),Te=null,_t=null,vn=!1,Fw()),!1}function jw(){const e=Sw();return e?vn&&Te&&Te!==e?(Fl(),Og(),zg(),he&&(he.remove(),he=null),Te=e,Us(),Au(),Du(),Un(),Ru(),he=Mu(),vl(),!0):vn?qc():(Te=e,vn=!0,Us(),Au(),Du(),Un(),Ru(),he&&(he.remove(),he=null),he=Mu(),vl(),!0):!1}const Vw=()=>({name:"spellCheck",init:()=>{Lw(),Cw()},toolbar:[{label:"Spell Check",command:"toggleSpellCheck",icon:'<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 12.5L3.84375 9.5M3.84375 9.5L5 5.38889C5 5.38889 5.25 4.5 6 4.5C6.75 4.5 7 5.38889 7 5.38889L8.15625 9.5M3.84375 9.5H8.15625M9 12.5L8.15625 9.5M13 16.8333L15.4615 19.5L21 13.5M12 8.5H15C16.1046 8.5 17 7.60457 17 6.5C17 5.39543 16.1046 4.5 15 4.5H12V8.5ZM12 8.5H16C17.1046 8.5 18 9.39543 18 10.5C18 11.6046 17.1046 12.5 16 12.5H12V8.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',shortcut:"F7"}],commands:{toggleSpellCheck:(e,t)=>(Ew(t),jw(),!0)},keymap:{F7:"toggleSpellCheck"}});const oE={title:"Editor/Rich Text Editor - Web Component",component:Q,parameters:{layout:"padded",docs:{source:{type:"code"},description:{component:`
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
        `}}}},te=[Oo(),zo(),Gs(),yp(),Qg(),jg(),eb(),tb(),$k(),Vg(),hb(),nb(),Wg(),Db(),Kg(),$b(),rb(),ob(),Ug(),Nb(),bp(),Gg(),ph(),Yb(),Zg(),Yg(),Kk(),ik(),Zv(),Uv(),zb(),Vw(),Fb(),Xg(),ww(),_v(),Jg(),iw(),hp(),wk(),ab(),iy(),Ry(),Wy({data:{user:{firstName:"Ava",lastName:"Miller"},order:{total:1234.56,createdAt:"2026-03-03T12:00:00Z"}}}),xx({bannedWords:["obviously","simply"],requiredHeadings:["Summary"],maxSentenceWords:28,minReadabilityScore:55,enableRealtime:!0}),Gx({defaultStyle:"apa",enableFootnoteSync:!0}),ib({defaultStatus:"draft",lockOnApproval:!0,defaultActor:"Editorial Lead"}),lb({enableRealtime:!0,redactionMode:"token",maxFindings:120}),N0({defaultProfile:"balanced",maxHtmlLength:22e4}),f1({maxResults:120,blocks:[{id:"incident-summary",label:"Incident Summary Block",category:"Operations",tags:["incident","summary"],keywords:["postmortem","rca"],html:"<h3>Incident Summary</h3><p>Describe impact, timeline, and customer exposure.</p>"},{id:"risk-register-entry",label:"Risk Register Entry",category:"Compliance",tags:["risk","governance"],keywords:["mitigation","owner"],html:"<h3>Risk Register Entry</h3><p><strong>Risk:</strong> <em>Describe risk here.</em></p><p><strong>Mitigation:</strong> Define mitigation owner and due date.</p>"},{id:"release-rollback",label:"Release Rollback Plan",category:"Engineering",tags:["release","rollback"],keywords:["deployment","runbook"],html:"<h3>Rollback Plan</h3><ol><li>Pause rollout</li><li>Revert deployment</li><li>Validate service health</li></ol>"}]}),H1({defaultSchemaId:"policy",enableRealtime:!0,schemas:[{id:"policy",label:"Policy",strictOrder:!0,allowUnknownHeadings:!0,sections:[{title:"Policy Statement"},{title:"Applicability",aliases:["Scope"]},{title:"Controls"},{title:"Exceptions"},{title:"Enforcement"}]}]}),fv({sourceLocale:"en-US",targetLocale:"fr-FR",enableRealtime:!0,locales:["en-US","fr-FR","de-DE","es-ES","ja-JP"]}),qv(),qh({items:[{id:"john.doe",label:"John Doe",meta:"john@acme.com"},{id:"sarah.lee",label:"Sarah Lee",meta:"sarah@acme.com"},{id:"ops.team",label:"Ops Team",meta:"team"}]})],yo={render:()=>y(Q,{plugins:te,statusbar:{enabled:!0,position:"bottom"},floatingToolbar:!0,defaultValue:`
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
      `})},xo={render:()=>{const e=Ie.useRef(null),[t,n]=Ie.useState(""),[r,o]=Ie.useState(0),[a,i]=Ie.useState("");return Ie.useEffect(()=>{var c;if(typeof window<"u"&&window.Editora){const d=window.Editora;i(d.version||"N/A"),o(((c=d.plugins)==null?void 0:c.length)||0)}},[]),S("div",{children:[S(ee,{style:{marginBottom:"20px",padding:"15px",background:"#f5f5f5",borderRadius:"4px"},children:[y("h4",{style:{margin:"0 0 10px 0"},children:"🌐 Global Editora API"}),S("p",{style:{margin:"5px 0"},children:["Version: ",y("strong",{children:a})]}),S("p",{style:{margin:"5px 0"},children:["Plugins Available: ",y("strong",{children:r})]}),S(kl,{style:{marginTop:"10px",display:"flex",gap:"10px"},children:[y("button",{onClick:()=>{if(e.current){const c=e.current.innerHTML;n(c)}},style:{padding:"8px 16px"},children:"Get Content"}),y("button",{onClick:()=>{e.current&&(e.current.innerHTML=`
          <h3>Content Set via API!</h3>
          <p>Updated at: ${new Date().toLocaleTimeString()}</p>
          <p>This was set using the Web Component API.</p>
        `)},style:{padding:"8px 16px"},children:"Set Content"})]})]}),y("div",{ref:e,children:y(Q,{plugins:te,statusbar:{enabled:!0},defaultValue:`
              <h3>Web Component API Demo</h3>
              <p>This editor can be controlled via the global <code>window.Editora</code> object.</p>
              <p>Try the buttons above to interact with the editor programmatically!</p>
            `})}),t&&S(ee,{style:{marginTop:"20px",padding:"15px",background:"#e8f5e9",borderRadius:"4px"},children:[y("h4",{style:{margin:"0 0 10px 0"},children:"📄 Output:"}),y("pre",{style:{overflow:"auto",fontSize:"12px"},children:t})]})]})}},vo={render:()=>S("div",{children:[S(ee,{style:{marginBottom:"20px",padding:"15px",background:"#e3f2fd",borderRadius:"4px"},children:[y("h3",{style:{margin:"0 0 10px 0"},children:"🔌 All 32 Native Plugins Loaded"}),S(Aa,{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"10px",fontSize:"13px"},children:[S("div",{children:[y("strong",{children:"Basic Formatting (5):"}),y("br",{}),"Bold, Italic, Underline, Strikethrough, ClearFormatting"]}),S("div",{children:[y("strong",{children:"Block Types (4):"}),y("br",{}),"Paragraph, Heading, Blockquote, Code"]}),S("div",{children:[y("strong",{children:"Lists (2):"}),y("br",{}),"List, Checklist"]}),S("div",{children:[y("strong",{children:"Layout (3):"}),y("br",{}),"TextAlignment, Indent, Direction"]}),S("div",{children:[y("strong",{children:"Typography (6):"}),y("br",{}),"TextColor, BackgroundColor, FontSize, FontFamily, LineHeight, Capitalization"]}),S("div",{children:[y("strong",{children:"Content (6):"}),y("br",{}),"Link, Image, Table, Anchor, EmbedIframe, Footnote"]}),S("div",{children:[y("strong",{children:"Special (3):"}),y("br",{}),"Math, SpecialCharacters, Emojis"]}),S("div",{children:[y("strong",{children:"Tools (4):"}),y("br",{}),"A11yChecker, Comments, DocumentManager, Fullscreen"]}),S("div",{children:[y("strong",{children:"History (1):"}),y("br",{}),"History"]})]})]}),y(Q,{plugins:te,statusbar:{enabled:!0},defaultValue:`
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
        `})]})},ko={render:()=>S("div",{children:[S(ee,{style:{marginBottom:"20px",padding:"15px",background:"#fff3e0",borderRadius:"4px"},children:[y("h4",{style:{margin:"0 0 10px 0"},children:"🎨 Custom Toolbar"}),y("p",{style:{margin:0,fontSize:"14px"},children:"Only essential formatting tools are shown in the toolbar."})]}),y(Q,{plugins:[Oo(),zo(),Gs(),yp(),bp(),hp()],statusbar:{enabled:!0},toolbar:{items:"undo redo | bold italic underline strikethrough | link",sticky:!0},defaultValue:`
          <h2>Minimal Editor</h2>
          <p>This editor has a <strong>simplified toolbar</strong> with only essential formatting options.</p>
          <p>Perfect for comment sections, chat applications, or simple text input.</p>
        `})]})},wo={render:()=>{const[e,t]=Ie.useState(!0);return S("div",{children:[S(ee,{style:{marginBottom:"20px",padding:"15px",background:"#f3e5f5",borderRadius:"4px"},children:[y("h4",{style:{margin:"0 0 10px 0"},children:"🔒 Readonly Mode"}),y("button",{onClick:()=>t(!e),style:{padding:"8px 16px"},children:e?"Enable Editing":"Disable Editing"})]}),y(Q,{plugins:te,statusbar:{enabled:!0},readonly:e,defaultValue:`
            <h2>Readonly Content</h2>
            <p>This content is <strong>${e?"readonly":"editable"}</strong>.</p>
            <p>Click the button above to toggle editing mode.</p>
            <ul>
              <li>Perfect for previewing documents</li>
              <li>Displaying formatted content</li>
              <li>Review mode in collaborative editing</li>
            </ul>
          `})]})}},Eo={render:()=>S("div",{children:[S(ee,{style:{marginBottom:"20px",padding:"15px",background:"#e3f2fd",borderRadius:"4px"},children:[y("h4",{style:{margin:"0 0 10px 0"},children:"🧪 Test 6: Placeholder"}),y("p",{style:{margin:0,fontSize:"14px"},children:"Three placeholder examples: simple, detailed guidance, and prefilled-content fallback."})]}),S(Aa,{style:{display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:"16px"},children:[S("div",{children:[y("h4",{style:{margin:"0 0 8px 0"},children:"Simple Placeholder"}),y(Q,{plugins:[Oo(),zo()],toolbar:{items:"bold italic",showMoreOptions:!1},statusbar:{enabled:!0},placeholder:"Type something here..."})]}),S("div",{children:[y("h4",{style:{margin:"0 0 8px 0"},children:"Detailed Placeholder"}),y(Q,{plugins:[Oo(),zo(),Gs()],toolbar:{items:"bold italic underline",showMoreOptions:!1},statusbar:{enabled:!0},placeholder:"Draft release notes: summary, impact, migration steps, and rollback plan."})]}),S("div",{children:[y("h4",{style:{margin:"0 0 8px 0"},children:"Prefilled Then Clear"}),y(Q,{plugins:[Oo(),zo()],toolbar:{items:"bold italic",showMoreOptions:!1},statusbar:{enabled:!0},placeholder:"Delete all content to show this placeholder.",defaultValue:"<p>This editor starts with content. Clear it to reveal placeholder.</p>"})]})]})]})},Co={render:()=>{const[e,t]=Ie.useState("default"),[n,r]=Ie.useState("dark"),o=a=>a==="default"?"dark":a==="dark"?"acme":"default";return S("div",{children:[S(ee,{style:{marginBottom:"20px",padding:"15px",background:"#ede7f6",borderRadius:"4px"},children:[y("h4",{style:{margin:"0 0 10px 0"},children:"🎨 Test 7: Theme Switcher (Editor Only)"}),y("p",{style:{margin:"0 0 12px 0",fontSize:"14px"},children:"Switches only editor themes using wrapper-level attributes (`data-theme`)."}),S(kl,{style:{display:"flex",gap:"10px",flexWrap:"wrap"},children:[y("button",{onClick:()=>t(o(e)),style:{padding:"8px 16px"},children:"Cycle Editor A"}),y("button",{onClick:()=>r(o(n)),style:{padding:"8px 16px"},children:"Cycle Editor B"}),y("button",{onClick:()=>{t("dark"),r("dark")},style:{padding:"8px 16px"},children:"Set Both Dark"}),y("button",{onClick:()=>{t("default"),r("default")},style:{padding:"8px 16px"},children:"Set Both Default"}),y("button",{onClick:()=>{t("acme"),r("acme")},style:{padding:"8px 16px"},children:"Set Both Acme"})]}),S("p",{style:{margin:"12px 0 0 0",fontSize:"13px"},children:["Current themes: ",S("strong",{children:["Editor A = ",e]}),", ",S("strong",{children:["Editor B = ",n]})]})]}),S(Aa,{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},children:[S("div",{"data-theme":e,style:{padding:"10px",borderRadius:"8px",background:e==="dark"?"#0b1220":e==="acme"?"#eef4fb":"#ffffff"},children:[y("h4",{style:{margin:"0 0 8px 0",color:e==="dark"?"#f8fafc":e==="acme"?"#0f4f4a":"#111827"},children:"Editor A"}),y(Q,{plugins:te,toolbar:{showMoreOptions:!1},statusbar:{enabled:!0},floatingToolbar:!0,defaultValue:"<p>Editor A theme is controlled independently.</p>"})]}),S("div",{"data-theme":n,style:{padding:"10px",borderRadius:"8px",background:n==="dark"?"#0b1220":n==="acme"?"#eef4fb":"#ffffff"},children:[y("h4",{style:{margin:"0 0 8px 0",color:n==="dark"?"#f8fafc":n==="acme"?"#0f4f4a":"#111827"},children:"Editor B"}),y(Q,{plugins:te,toolbar:{showMoreOptions:!1},statusbar:{enabled:!0},floatingToolbar:!0,defaultValue:"<p>Editor B can use a different theme from Editor A.</p>"})]})]})]})}},So={render:()=>{const[e,t]=Ie.useState(""),[n,r]=Ie.useState(0),[o,a]=Ie.useState(0);return S("div",{children:[y(Q,{plugins:te,statusbar:{enabled:!0},onChange:l=>{t(l);const s=l.replace(/<[^>]*>/g,"").trim();r(s.split(/\s+/).filter(Boolean).length),a(s.length)},defaultValue:`
            <h2>Try typing here!</h2>
            <p>Watch the statistics update in real-time as you type.</p>
          `}),S(ee,{style:{marginTop:"20px",padding:"15px",background:"#e8f5e9",borderRadius:"4px"},children:[y("h4",{style:{margin:"0 0 10px 0"},children:"📊 Statistics"}),S("p",{style:{margin:"5px 0"},children:["Words: ",y("strong",{children:n})]}),S("p",{style:{margin:"5px 0"},children:["Characters: ",y("strong",{children:o})]}),S("details",{style:{marginTop:"10px"},children:[y("summary",{style:{cursor:"pointer"},children:"Show HTML"}),y("pre",{style:{fontSize:"12px",overflow:"auto",marginTop:"10px"},children:e})]})]})]})}},To={render:()=>S("div",{children:[S(ee,{style:{marginBottom:"20px",padding:"15px",background:"#e1f5fe",borderRadius:"4px"},children:[y("h4",{style:{margin:"0 0 10px 0"},children:"🔢 Math Plugin"}),y("p",{style:{margin:0,fontSize:"14px"},children:"Insert mathematical equations using LaTeX notation. Click the Math button in the toolbar (fx)."})]}),y(Q,{plugins:te,statusbar:{enabled:!0},defaultValue:`
          <h2>Mathematical Equations</h2>
          <p>Inline equation: <span data-math-inline="true" data-latex="E = mc^2" class="math-inline">$E = mc^2$</span></p>
          
          <p>Block equation:</p>
          <div data-math-block="true" data-latex="\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}" class="math-block">
            $$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$
          </div>
          
          <p>Pythagorean theorem: <span data-math-inline="true" data-latex="a^2 + b^2 = c^2" class="math-inline">$a^2 + b^2 = c^2$</span></p>
          
          <p><strong>Try it:</strong> Use Cmd/Ctrl-Shift-M to open the math dialog!</p>
        `})]})},$o={render:()=>S("div",{children:[S(ee,{style:{marginBottom:"20px",padding:"15px",background:"#fce4ec",borderRadius:"4px"},children:[y("h4",{style:{margin:"0 0 10px 0"},children:"✨ Special Characters & Emojis"}),y("p",{style:{margin:0,fontSize:"14px"},children:"Insert special characters (Cmd/Ctrl-Shift-S) and emojis (Cmd/Ctrl-Shift-J)."})]}),y(Q,{plugins:te,statusbar:{enabled:!0},defaultValue:`
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
        `})]})},Lo={render:()=>S("div",{children:[S(ee,{style:{marginBottom:"20px",padding:"15px",background:"#f1f8e9",borderRadius:"4px"},children:[y("h4",{style:{margin:"0 0 10px 0"},children:"📊 Table Plugin"}),y("p",{style:{margin:0,fontSize:"14px"},children:"Create and edit tables with the table button in the toolbar."})]}),y(Q,{plugins:te,statusbar:{enabled:!0},defaultValue:`
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
        `})]})},Ao={render:()=>{const[e,t]=Ie.useState(""),[n,r]=Ie.useState("");return S("div",{children:[S(ee,{style:{marginBottom:"20px",padding:"15px",background:"#fff9c4",borderRadius:"4px"},children:[y("h4",{style:{margin:"0 0 10px 0"},children:"👥 Multiple Editors"}),y("p",{style:{margin:"0 0 10px 0",fontSize:"14px"},children:"Two independent editor instances with content synchronization."}),S(kl,{style:{display:"flex",gap:"10px"},children:[y("button",{onClick:()=>{r(e)},style:{padding:"8px 16px"},children:"Sync A → B"}),y("button",{onClick:()=>{t(n)},style:{padding:"8px 16px"},children:"Sync B → A"})]})]}),S(Aa,{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"},children:[S("div",{children:[y("h4",{children:"Editor A"}),y(Q,{plugins:te,toolbar:{showMoreOptions:!1},statusbar:{enabled:!0},onChange:t,defaultValue:"<h3>Editor A</h3><p>Type here...</p>"})]}),S("div",{children:[y("h4",{children:"Editor B"}),y(Q,{plugins:te,toolbar:{showMoreOptions:!1},statusbar:{enabled:!0},value:n,onChange:r,defaultValue:"<h3>Editor B</h3><p>Type here...</p>"})]})]})]})}},Mo={render:()=>{const[e,t]=Ie.useState(`
      <h2>Controlled Editor</h2>
      <p>This editor's content is controlled by React state.</p>
    `);return S("div",{children:[S(ee,{style:{marginBottom:"20px",padding:"15px",background:"#e0f2f1",borderRadius:"4px"},children:[y("h4",{style:{margin:"0 0 10px 0"},children:"🎛️ Controlled Component"}),S(kl,{style:{display:"flex",gap:"10px"},children:[y("button",{onClick:()=>{t(`
        <h2>Reset!</h2>
        <p>Content was reset at ${new Date().toLocaleTimeString()}</p>
      `)},style:{padding:"8px 16px"},children:"Reset Content"}),y("button",{onClick:()=>{t(o=>o+`<p>Appended at ${new Date().toLocaleTimeString()}</p>`)},style:{padding:"8px 16px"},children:"Append Content"})]})]}),y(Q,{plugins:te,statusbar:{enabled:!0},value:e,onChange:t})]})}},Ro={render:()=>S("div",{children:[S(ee,{style:{marginBottom:"20px",padding:"15px",background:"#ffebee",borderRadius:"4px"},children:[y("h4",{style:{margin:"0 0 10px 0"},children:"⚡ Performance Test"}),y("p",{style:{margin:0,fontSize:"14px"},children:"This editor contains 100 sections (300+ paragraphs) to test performance with large documents."})]}),y(Q,{plugins:te,statusbar:{enabled:!0},defaultValue:(()=>{let t="<h1>Large Document Performance Test</h1>";t+="<p><strong>This document contains 100 paragraphs to test performance.</strong></p>";for(let n=1;n<=100;n++)t+=`<h3>Section ${n}</h3>`,t+=`<p>This is paragraph ${n}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`,n%10===0&&(t+=`<blockquote>Milestone: Completed ${n} sections!</blockquote>`);return t})()})]})},Do={render:()=>S("div",{children:[S(ee,{style:{marginBottom:"20px",padding:"15px",background:"#f3e5f5",borderRadius:"4px"},children:[y("h3",{style:{margin:"0 0 10px 0"},children:"🌐 Framework Independence"}),y("p",{style:{margin:0,fontSize:"14px"},children:"This same editor can be used in React (shown here), Vue, Angular, Svelte, or vanilla JavaScript!"}),S(Aa,{style:{marginTop:"15px",display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"10px",fontSize:"13px"},children:[S(ee,{style:{padding:"10px",background:"white",borderRadius:"4px"},children:[y("strong",{children:"React:"}),y("br",{}),y("code",{style:{fontSize:"11px"},children:"<EditoraEditor />"})]}),S(ee,{style:{padding:"10px",background:"white",borderRadius:"4px"},children:[y("strong",{children:"Vanilla JS:"}),y("br",{}),y("code",{style:{fontSize:"11px"},children:"<editora-editor>"})]}),S(ee,{style:{padding:"10px",background:"white",borderRadius:"4px"},children:[y("strong",{children:"Vue:"}),y("br",{}),y("code",{style:{fontSize:"11px"},children:"<editora-editor>"})]}),S(ee,{style:{padding:"10px",background:"white",borderRadius:"4px"},children:[y("strong",{children:"Angular:"}),y("br",{}),y("code",{style:{fontSize:"11px"},children:"<editora-editor>"})]})]})]}),y(Q,{plugins:te,statusbar:{enabled:!0},defaultValue:`
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
        `})]})},No={render:()=>S("div",{children:[S(ee,{style:{marginBottom:"16px",padding:"14px",background:"#ecfdf5",borderRadius:"8px"},children:[y("h4",{style:{margin:"0 0 8px 0"},children:"📐 Doc Schema Test Scenario"}),S("p",{style:{margin:0,fontSize:"13px"},children:["Use ",y("code",{children:"Ctrl/Cmd+Alt+Shift+G"})," to open schema panel, run validation, and insert missing sections."]})]}),y(Q,{plugins:te,statusbar:{enabled:!0,position:"bottom"},defaultValue:`
          <h2>Q2 Access Control Policy Draft</h2>
          <h3>Policy Statement</h3>
          <p>All production access must be approved and logged.</p>
          <h3>Controls</h3>
          <p>Access reviews run monthly. Emergency access expires in 24 hours.</p>
        `})]})},Bo={render:()=>S("div",{children:[S(ee,{style:{marginBottom:"16px",padding:"14px",background:"#eff6ff",borderRadius:"8px"},children:[y("h4",{style:{margin:"0 0 8px 0"},children:"🌍 Translation Workflow Test Scenario"}),S("p",{style:{margin:0,fontSize:"13px"},children:["Use ",y("code",{children:"Ctrl/Cmd+Alt+Shift+L"})," to open panel, capture source, lock approved segments, and run locale QA."]})]}),y(Q,{plugins:te,statusbar:{enabled:!0,position:"bottom"},defaultValue:`
          <h2>Release Notes v4.8</h2>
          <p>Welcome {{firstName}}! Your order ID is %ORDER_ID%.</p>
          <p>Click <strong>Upgrade Now</strong> to activate premium analytics.</p>
          <p>For support, contact support@acme.com within 24 hours.</p>
        `})]})};var Nu,Bu,Pu;te.parameters={...te.parameters,docs:{...(Nu=te.parameters)==null?void 0:Nu.docs,source:{originalSource:`[BoldPlugin(), ItalicPlugin(), UnderlinePlugin(), StrikethroughPlugin(), ClearFormattingPlugin(),
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
})]`,...(Pu=(Bu=te.parameters)==null?void 0:Bu.docs)==null?void 0:Pu.source}}};var Iu,Hu,Ou,zu,qu;yo.parameters={...yo.parameters,docs:{...(Iu=yo.parameters)==null?void 0:Iu.docs,source:{originalSource:`{
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
}`,...(Ou=(Hu=yo.parameters)==null?void 0:Hu.docs)==null?void 0:Ou.source},description:{story:`Basic usage with default configuration
All 39 native plugins loaded automatically`,...(qu=(zu=yo.parameters)==null?void 0:zu.docs)==null?void 0:qu.description}}};var _u,Fu,ju,Vu,Wu;xo.parameters={...xo.parameters,docs:{...(_u=xo.parameters)==null?void 0:_u.docs,source:{originalSource:`{
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
}`,...(ju=(Fu=xo.parameters)==null?void 0:Fu.docs)==null?void 0:ju.source},description:{story:`Web Component API - TinyMCE Style Usage
Demonstrates using the global Editora API`,...(Wu=(Vu=xo.parameters)==null?void 0:Vu.docs)==null?void 0:Wu.description}}};var Ku,Uu,Gu,Zu,Yu;vo.parameters={...vo.parameters,docs:{...(Ku=vo.parameters)==null?void 0:Ku.docs,source:{originalSource:`{
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
}`,...(Gu=(Uu=vo.parameters)==null?void 0:Uu.docs)==null?void 0:Gu.source},description:{story:`All 32 Native Plugins Showcase
Demonstrates every available plugin`,...(Yu=(Zu=vo.parameters)==null?void 0:Zu.docs)==null?void 0:Yu.description}}};var Xu,Ju,Qu,ef,tf;ko.parameters={...ko.parameters,docs:{...(Xu=ko.parameters)==null?void 0:Xu.docs,source:{originalSource:`{
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
}`,...(Qu=(Ju=ko.parameters)==null?void 0:Ju.docs)==null?void 0:Qu.source},description:{story:`Custom Toolbar Configuration
Demonstrates toolbar customization`,...(tf=(ef=ko.parameters)==null?void 0:ef.docs)==null?void 0:tf.description}}};var nf,rf,of,af,lf;wo.parameters={...wo.parameters,docs:{...(nf=wo.parameters)==null?void 0:nf.docs,source:{originalSource:`{
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
}`,...(of=(rf=wo.parameters)==null?void 0:rf.docs)==null?void 0:of.source},description:{story:`Readonly Mode
Demonstrates readonly editor for viewing content`,...(lf=(af=wo.parameters)==null?void 0:af.docs)==null?void 0:lf.description}}};var sf,cf,df,uf,ff;Eo.parameters={...Eo.parameters,docs:{...(sf=Eo.parameters)==null?void 0:sf.docs,source:{originalSource:`{
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
}`,...(df=(cf=Eo.parameters)==null?void 0:cf.docs)==null?void 0:df.source},description:{story:`Test 6: Placeholder
Shows multiple placeholder examples in editor instances`,...(ff=(uf=Eo.parameters)==null?void 0:uf.docs)==null?void 0:ff.description}}};var pf,mf,gf,bf,hf;Co.parameters={...Co.parameters,docs:{...(pf=Co.parameters)==null?void 0:pf.docs,source:{originalSource:`{
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
}`,...(gf=(mf=Co.parameters)==null?void 0:mf.docs)==null?void 0:gf.source},description:{story:`Test 7: Theme Switcher (Editor Only)
Toggles theme on editor wrappers without changing Storybook page theme`,...(hf=(bf=Co.parameters)==null?void 0:bf.docs)==null?void 0:hf.description}}};var yf,xf,vf,kf,wf;So.parameters={...So.parameters,docs:{...(yf=So.parameters)==null?void 0:yf.docs,source:{originalSource:`{
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
}`,...(vf=(xf=So.parameters)==null?void 0:xf.docs)==null?void 0:vf.source},description:{story:`Event Handling
Demonstrates onChange events and content tracking`,...(wf=(kf=So.parameters)==null?void 0:kf.docs)==null?void 0:wf.description}}};var Ef,Cf,Sf,Tf,$f;To.parameters={...To.parameters,docs:{...(Ef=To.parameters)==null?void 0:Ef.docs,source:{originalSource:`{
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
}`,...(Sf=(Cf=To.parameters)==null?void 0:Cf.docs)==null?void 0:Sf.source},description:{story:`Math Equations
Demonstrates the Math plugin with LaTeX support`,...($f=(Tf=To.parameters)==null?void 0:Tf.docs)==null?void 0:$f.description}}};var Lf,Af,Mf,Rf,Df;$o.parameters={...$o.parameters,docs:{...(Lf=$o.parameters)==null?void 0:Lf.docs,source:{originalSource:`{
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
}`,...(Mf=(Af=$o.parameters)==null?void 0:Af.docs)==null?void 0:Mf.source},description:{story:`Special Characters & Emojis
Demonstrates special character and emoji insertion`,...(Df=(Rf=$o.parameters)==null?void 0:Rf.docs)==null?void 0:Df.description}}};var Nf,Bf,Pf,If,Hf;Lo.parameters={...Lo.parameters,docs:{...(Nf=Lo.parameters)==null?void 0:Nf.docs,source:{originalSource:`{
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
}`,...(Pf=(Bf=Lo.parameters)==null?void 0:Bf.docs)==null?void 0:Pf.source},description:{story:`Tables
Demonstrates table creation and editing`,...(Hf=(If=Lo.parameters)==null?void 0:If.docs)==null?void 0:Hf.description}}};var Of,zf,qf,_f,Ff;Ao.parameters={...Ao.parameters,docs:{...(Of=Ao.parameters)==null?void 0:Of.docs,source:{originalSource:`{
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
}`,...(qf=(zf=Ao.parameters)==null?void 0:zf.docs)==null?void 0:qf.source},description:{story:`Multiple Editors
Demonstrates multiple editor instances on one page`,...(Ff=(_f=Ao.parameters)==null?void 0:_f.docs)==null?void 0:Ff.description}}};var jf,Vf,Wf,Kf,Uf;Mo.parameters={...Mo.parameters,docs:{...(jf=Mo.parameters)==null?void 0:jf.docs,source:{originalSource:`{
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
}`,...(Wf=(Vf=Mo.parameters)==null?void 0:Vf.docs)==null?void 0:Wf.source},description:{story:`Controlled Editor
Demonstrates controlled component pattern`,...(Uf=(Kf=Mo.parameters)==null?void 0:Kf.docs)==null?void 0:Uf.description}}};var Gf,Zf,Yf,Xf,Jf;Ro.parameters={...Ro.parameters,docs:{...(Gf=Ro.parameters)==null?void 0:Gf.docs,source:{originalSource:`{
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
}`,...(Yf=(Zf=Ro.parameters)==null?void 0:Zf.docs)==null?void 0:Yf.source},description:{story:`Performance - Large Document
Tests editor with large content`,...(Jf=(Xf=Ro.parameters)==null?void 0:Xf.docs)==null?void 0:Jf.description}}};var Qf,ep,tp,np,rp;Do.parameters={...Do.parameters,docs:{...(Qf=Do.parameters)==null?void 0:Qf.docs,source:{originalSource:`{
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
}`,...(tp=(ep=Do.parameters)==null?void 0:ep.docs)==null?void 0:tp.source},description:{story:`Framework Independence Demo
Shows that the same editor works in different contexts`,...(rp=(np=Do.parameters)==null?void 0:np.docs)==null?void 0:rp.description}}};var op,ap,ip,lp,sp;No.parameters={...No.parameters,docs:{...(op=No.parameters)==null?void 0:op.docs,source:{originalSource:`{
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
}`,...(ip=(ap=No.parameters)==null?void 0:ap.docs)==null?void 0:ip.source},description:{story:`Doc Schema Workflow Scenario
Structured authoring flow for policy/governance documents.`,...(sp=(lp=No.parameters)==null?void 0:lp.docs)==null?void 0:sp.description}}};var cp,dp,up,fp,pp;Bo.parameters={...Bo.parameters,docs:{...(cp=Bo.parameters)==null?void 0:cp.docs,source:{originalSource:`{
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
}`,...(up=(dp=Bo.parameters)==null?void 0:dp.docs)==null?void 0:up.source},description:{story:`Translation Workflow Scenario
Localization QA with segment locking + source-target validation.`,...(pp=(fp=Bo.parameters)==null?void 0:fp.docs)==null?void 0:pp.description}}};const aE=["allNativePlugins","Basic","WebComponentAPI","AllPluginsShowcase","CustomToolbar","ReadonlyMode","Test6Placeholder","Test7ThemeSwitcherEditorOnly","EventHandling","MathEquations","SpecialContent","Tables","MultipleEditors","ControlledEditor","PerformanceLargeDocument","FrameworkIndependence","DocSchemaWorkflow","TranslationWorkflowScenario"];export{vo as AllPluginsShowcase,yo as Basic,Mo as ControlledEditor,ko as CustomToolbar,No as DocSchemaWorkflow,So as EventHandling,Do as FrameworkIndependence,To as MathEquations,Ao as MultipleEditors,Ro as PerformanceLargeDocument,wo as ReadonlyMode,$o as SpecialContent,Lo as Tables,Eo as Test6Placeholder,Co as Test7ThemeSwitcherEditorOnly,Bo as TranslationWorkflowScenario,xo as WebComponentAPI,aE as __namedExportsOrder,te as allNativePlugins,oE as default};
