const R=".rte-content, .editora-content",ee="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",oe="__editoraCommandEditorRoot",se="rte-content-rules-styles",f="rte-content-rules-panel",q=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',he={panelTitle:"Content Rules",panelAriaLabel:"Content rules panel",runAuditText:"Run Audit",realtimeOnText:"Realtime On",realtimeOffText:"Realtime Off",closeText:"Close",noIssuesText:"No rule violations detected.",summaryPrefix:"Issues",locateText:"Locate",bannedWordMessage:"Banned word found",requiredHeadingMessage:"Missing required heading",sentenceLengthMessage:"Sentence is too long",readabilityMessage:"Readability score is below threshold"},d=new WeakMap,v=new WeakMap,de=new WeakMap,T=new WeakMap,V=new WeakMap,le=new WeakMap,Y=new WeakMap,h=new Map,B=new WeakMap,_=new Set;let N=0,pe=0,E=null,g=null,L=null,I=null,H=null,S=null;function k(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function xe(e){return{...he,...e||{}}}function ye(e){return e.replace(/\u00A0/g," ").replace(/\s+/g," ").trim()}function ae(e){if(!e)return[];const t=new Set;return e.forEach(n=>{const o=n.trim();o&&t.add(o)}),Array.from(t)}function j(e={}){return{bannedWords:ae(e.bannedWords),requiredHeadings:ae(e.requiredHeadings),maxSentenceWords:Math.max(8,Number(e.maxSentenceWords??32)),minReadabilityScore:Math.max(0,Math.min(120,Number(e.minReadabilityScore??55))),maxIssues:Math.max(1,Number(e.maxIssues??100)),debounceMs:Math.max(50,Number(e.debounceMs??220)),enableRealtime:e.enableRealtime!==!1,labels:xe(e.labels),normalizeText:e.normalizeText||ye,customRules:Array.isArray(e.customRules)?e.customRules:[]}}function X(e){return e.closest(ee)||e}function F(e){if(!e)return null;if(e.matches(R))return e;const t=e.querySelector(R);return t instanceof HTMLElement?t:null}function we(){if(typeof window>"u")return null;const e=window[oe];if(!(e instanceof HTMLElement))return null;window[oe]=null;const t=F(e);if(t)return t;const n=e.closest(ee);if(n){const o=F(n);if(o)return o}return null}function ke(e){const t=e.closest("[data-editora-editor]");if(t&&F(t)===e)return t;let n=e;for(;n;){if(n.matches(ee)&&(n===e||F(n)===e))return n;n=n.parentElement}return X(e)}function K(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function Re(e){const t=X(e);if(K(t))return!0;const n=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return K(n)?!0:K(document.documentElement)||K(document.body)}function G(e,t){e.classList.remove("rte-content-rules-theme-dark"),Re(t)&&e.classList.add("rte-content-rules-theme-dark")}function Ee(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function M(e,t=!0){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const s=e.editorElement;if(s.matches(R))return s;const a=s.querySelector(R);if(a instanceof HTMLElement)return a}const n=we();if(n)return n;const o=window.getSelection();if(o&&o.rangeCount>0){const s=o.getRangeAt(0).startContainer,a=Ee(s),l=a==null?void 0:a.closest(R);if(l)return l}const r=document.activeElement;if(r){if(r.matches(R))return r;const s=r.closest(R);if(s)return s}return g&&g.isConnected?g:(g&&!g.isConnected&&(g=null),t?document.querySelector(R):null)}function Z(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function Ce(e,t){const n=e.innerText||e.textContent||"";return t(n)}function ve(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function ie(e){let t=2166136261;for(let n=0;n<e.length;n+=1)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return t>>>0}function ce(e){const t=e.match(/\b[\w'-]+\b/g);return t?t.length:0}function fe(e){const t=e.match(/[^.!?]+[.!?]*/g);return t?t.map(n=>n.trim()).filter(Boolean).length:0}function $e(e){const t=e.toLowerCase().replace(/[^a-z]/g,"");if(!t)return 0;if(t.length<=3)return 1;const n=t.match(/[aeiouy]+/g);let o=n?n.length:1;return t.endsWith("e")&&(o-=1),Math.max(1,o)}function Me(e){const t=e.match(/\b[\w'-]+\b/g)||[],n=t.length;if(n===0)return 100;const o=Math.max(1,fe(e)),r=t.reduce((a,l)=>a+$e(l),0),s=206.835-1.015*(n/o)-84.6*(r/Math.max(1,n));return Number.isFinite(s)?Math.max(0,Math.min(120,s)):0}function z(e,t){return`${e}-${t}`}function x(e,t){return e.length>=t}function P(e,t,n){x(e,n)||e.push(t)}function ge(e,t=140){return e.length<=t?e:`${e.slice(0,t-1).trimEnd()}...`}function Se(e,t,n,o){return{id:e.id||z(t,o),ruleId:e.ruleId||t,severity:e.severity||n,message:e.message||t,excerpt:e.excerpt?ge(e.excerpt,220):void 0,suggestion:e.suggestion,locateText:e.locateText,selector:e.selector}}function Te(e,t){const n=Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6")),o=new Set;return n.forEach(r=>{const s=t(r.textContent||"").toLowerCase();s&&o.add(s)}),o}function Ae(e){const t=e.match(/[^.!?\n]+[.!?]?/g);return t?t.map(n=>n.trim()).filter(Boolean):[]}async function C(e,t,n=!1){const o=Ce(e,t.normalizeText),r=e.innerHTML,s=`${o.length}:${ie(o)}:${r.length}:${ie(r)}`;if(!n&&le.get(e)===s)return v.get(e)||[];const a=(Y.get(e)||0)+1;Y.set(e,a);const l=ce(o),c=fe(o),u=Me(o),i=[],y=t.labels;if(t.bannedWords.length>0){let w=0;for(const p of t.bannedWords){const m=new RegExp(`\\b${ve(p)}\\b`,"gi");let b=m.exec(o);for(;b&&!x(i,t.maxIssues);){const re=b[0];P(i,{id:z("banned-word",w),ruleId:"banned-word",severity:"error",message:`${y.bannedWordMessage}: "${re}"`,locateText:re,suggestion:"Replace or remove banned terms."},t.maxIssues),w+=1,b=m.exec(o)}if(x(i,t.maxIssues))break}}if(!x(i,t.maxIssues)&&t.requiredHeadings.length>0){const w=Te(e,t.normalizeText);let p=0;t.requiredHeadings.forEach(m=>{if(x(i,t.maxIssues))return;const b=t.normalizeText(m).toLowerCase();!b||w.has(b)||(P(i,{id:z("required-heading",p),ruleId:"required-heading",severity:"warning",message:`${y.requiredHeadingMessage}: "${m}"`,suggestion:`Add a heading named "${m}".`},t.maxIssues),p+=1)})}if(!x(i,t.maxIssues)){const w=Ae(o);let p=0;for(const m of w){if(x(i,t.maxIssues))break;const b=ce(m);b<=t.maxSentenceWords||(P(i,{id:z("sentence-length",p),ruleId:"sentence-length",severity:"warning",message:`${y.sentenceLengthMessage} (${b}/${t.maxSentenceWords} words)`,excerpt:ge(m,200),locateText:m.slice(0,64),suggestion:"Split into shorter sentences for readability."},t.maxIssues),p+=1)}}if(!x(i,t.maxIssues)&&l>0&&u<t.minReadabilityScore&&P(i,{id:z("readability",0),ruleId:"readability",severity:"info",message:`${y.readabilityMessage}: ${u.toFixed(1)} < ${t.minReadabilityScore}`,suggestion:"Use shorter sentences and simpler wording."},t.maxIssues),!x(i,t.maxIssues)&&t.customRules.length>0){const w={editor:e,editorRoot:X(e),text:o,html:r,wordCount:l,sentenceCount:c,readabilityScore:u};for(const p of t.customRules){if(x(i,t.maxIssues))break;try{const m=await p.evaluate(w);if(!Array.isArray(m))continue;for(let b=0;b<m.length&&!x(i,t.maxIssues);b+=1)P(i,Se(m[b],p.id,p.severity||"warning",b),t.maxIssues)}catch{}}}if(Y.get(e)!==a)return v.get(e)||[];const D={readabilityScore:u,wordCount:l,sentenceCount:c};return le.set(e,s),v.set(e,i),de.set(e,D),te(e),e.dispatchEvent(new CustomEvent("editora:content-rules-audit",{bubbles:!0,detail:{issues:i,metrics:D}})),i}function Le(e){return e.reduce((t,n)=>(t[n.severity]+=1,t),{error:0,warning:0,info:0})}function Ie(e){return e==="error"?"Error":e==="warning"?"Warning":"Info"}function $(e,t,n){const o=ke(e);Array.from(o.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(s=>{s.classList.toggle("active",n),s.setAttribute("data-active",n?"true":"false"),s.setAttribute("aria-pressed",n?"true":"false")})}function U(e){return B.get(e)===!0}function J(e,t){if(!t.classList.contains("show"))return;const o=X(e).getBoundingClientRect(),r=Math.min(window.innerWidth-20,360);t.style.width=`${r}px`,t.style.maxHeight=`${Math.max(220,window.innerHeight-24)}px`;const s=Math.max(10,o.right-r),a=Math.max(10,window.innerWidth-r-10),l=Math.min(s,a),c=Math.max(10,Math.min(window.innerHeight-10-240,o.top+10));t.style.left=`${l}px`,t.style.top=`${c}px`}function ue(e,t){const n=t.trim().toLowerCase();if(!n)return!1;const o=window.getSelection();if(!o)return!1;const r=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,null);let s=r.nextNode();for(;s;){const l=s.data.toLowerCase().indexOf(n);if(l!==-1){const c=document.createRange();c.setStart(s,l),c.setEnd(s,Math.min(s.length,l+n.length)),o.removeAllRanges(),o.addRange(c);const u=s.parentElement;return u&&u.scrollIntoView({behavior:"smooth",block:"center",inline:"nearest"}),e.focus({preventScroll:!0}),!0}s=r.nextNode()}return!1}function He(e,t){if(t.selector){const n=e.querySelector(t.selector);if(n)return n.scrollIntoView({behavior:"smooth",block:"center",inline:"nearest"}),n.focus({preventScroll:!0}),!0}return!!(t.locateText&&ue(e,t.locateText)||t.excerpt&&ue(e,t.excerpt.slice(0,64)))}function We(e,t){return(v.get(e)||[]).find(o=>o.id===t)}function A(e,t){const n=T.get(e);return typeof n=="boolean"?n:t?t.enableRealtime:!0}function O(e,t,n){const o=t.querySelector('[data-action="toggle-realtime"]');if(!o)return;const r=A(e,n);o.textContent=r?n.labels.realtimeOnText:n.labels.realtimeOffText,o.setAttribute("aria-pressed",r?"true":"false"),$(e,"toggleContentRulesRealtime",r)}function te(e){const t=h.get(e);if(!t)return;const n=d.get(e)||E;if(!n)return;const o=v.get(e)||[],r=de.get(e)||{readabilityScore:100,wordCount:0,sentenceCount:0},s=t.querySelector(".rte-content-rules-count"),a=t.querySelector(".rte-content-rules-summary"),l=t.querySelector(".rte-content-rules-list"),c=t.querySelector(".rte-content-rules-live");if(!s||!a||!l||!c)return;const u=Le(o);if(s.textContent=String(o.length),a.textContent=`${n.labels.summaryPrefix}: ${o.length} | Error ${u.error} | Warning ${u.warning} | Info ${u.info} | Readability ${r.readabilityScore.toFixed(1)}`,c.textContent=`${o.length} issues. ${u.error} errors, ${u.warning} warnings, ${u.info} info.`,o.length===0){l.innerHTML=`<li class="rte-content-rules-empty">${k(n.labels.noIssuesText)}</li>`;return}l.innerHTML=o.map(i=>{const y=i.excerpt?`<p class="rte-content-rules-excerpt">${k(i.excerpt)}</p>`:"",D=i.suggestion?`<p class="rte-content-rules-suggestion">${k(i.suggestion)}</p>`:"",w=`${n.labels.locateText}: ${i.message}`;return`
        <li class="rte-content-rules-item rte-content-rules-item-${i.severity}">
          <button
            type="button"
            class="rte-content-rules-item-btn"
            data-action="focus-issue"
            data-issue-id="${k(i.id)}"
            data-role="issue-button"
            aria-label="${k(w)}"
          >
            <span class="rte-content-rules-badge">${k(Ie(i.severity))}</span>
            <span class="rte-content-rules-message">${k(i.message)}</span>
          </button>
          ${y}
          ${D}
        </li>
      `}).join("")}function W(e,t=!1){const n=h.get(e);n&&(n.classList.remove("show"),B.set(e,!1),$(e,"toggleContentRulesPanel",!1),t&&e.focus({preventScroll:!0}))}function Oe(e){h.forEach((t,n)=>{n!==e&&W(n,!1)})}function qe(e){const t=h.get(e);if(t)return t;const n=d.get(e)||E||j(),o=`rte-content-rules-panel-${pe++}`,r=document.createElement("section");return r.className=f,r.id=o,r.setAttribute("role","dialog"),r.setAttribute("aria-modal","false"),r.setAttribute("aria-label",n.labels.panelAriaLabel),r.innerHTML=`
    <header class="rte-content-rules-header">
      <h2 class="rte-content-rules-title">${k(n.labels.panelTitle)}</h2>
      <button type="button" class="rte-content-rules-icon-btn" data-action="close" aria-label="${k(n.labels.closeText)}">✕</button>
    </header>
    <div class="rte-content-rules-body">
      <div class="rte-content-rules-topline">
        <p class="rte-content-rules-summary" aria-live="polite"></p>
        <span class="rte-content-rules-count" aria-hidden="true">0</span>
      </div>
      <div class="rte-content-rules-controls" role="toolbar" aria-label="Content rules controls">
        <button type="button" class="rte-content-rules-btn rte-content-rules-btn-primary" data-action="run-audit">${k(n.labels.runAuditText)}</button>
        <button type="button" class="rte-content-rules-btn" data-action="toggle-realtime" aria-pressed="false"></button>
      </div>
      <ul class="rte-content-rules-list" role="list" aria-label="Detected content rule issues"></ul>
      <p class="rte-content-rules-shortcut">Shortcut: Ctrl/Cmd + Alt + Shift + R</p>
      <span class="rte-content-rules-live" aria-live="polite"></span>
    </div>
  `,r.addEventListener("click",s=>{const a=s.target,l=a==null?void 0:a.closest("[data-action]");if(!l)return;const c=l.getAttribute("data-action");if(c){if(c==="close"){W(e,!0);return}if(c==="run-audit"){const u=d.get(e)||E||n;C(e,u,!0);return}if(c==="toggle-realtime"){const i=!A(e,d.get(e)||E||n);if(T.set(e,i),O(e,r,d.get(e)||E||n),i){const y=d.get(e)||E||n;C(e,y,!0)}return}if(c==="focus-issue"){const u=l.getAttribute("data-issue-id")||"",i=We(e,u);if(!i)return;He(e,i),W(e,!1)}}}),r.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault(),W(e,!0);return}if(s.key!=="ArrowDown"&&s.key!=="ArrowUp")return;const a=Array.from(r.querySelectorAll('[data-role="issue-button"]'));if(a.length===0)return;const l=document.activeElement,c=a.findIndex(y=>y===l);if(c===-1)return;s.preventDefault();const u=s.key==="ArrowDown"?1:-1,i=(c+u+a.length)%a.length;a[i].focus()}),G(r,e),document.body.appendChild(r),h.set(e,r),B.set(e,!1),O(e,r,n),r}function ne(e){const t=qe(e);Oe(e),t.classList.add("show"),B.set(e,!0),G(t,e),J(e,t),te(e),$(e,"toggleContentRulesPanel",!0);const n=t.querySelector('[data-action="run-audit"]');n==null||n.focus()}function Q(e,t){const n=U(e);return(typeof t=="boolean"?t:!n)?ne(e):W(e,!1),!0}function me(e){const t=V.get(e);typeof t=="number"&&(window.clearTimeout(t),_.delete(t),V.delete(e))}function be(e){const t=d.get(e)||E;if(!t||!A(e,t))return;me(e);const n=window.setTimeout(()=>{_.delete(n),V.delete(e),C(e,t,!1)},t.debounceMs);_.add(n),V.set(e,n)}function Pe(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="r"}function ze(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="l"}function _e(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="t"}function Be(){if(typeof document>"u"||document.getElementById(se))return;const e=document.createElement("style");e.id=se,e.textContent=`
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

    ${q} .rte-toolbar-group-items.content-rules,
    ${q} .editora-toolbar-group-items.content-rules {
      border-color: #566275;
    }    
    ${q} .rte-toolbar-group-items.content-rules .rte-toolbar-button,
    ${q} .editora-toolbar-group-items.content-rules .editora-toolbar-button
    {
      border-color: #566275;
    }
    ${q} .rte-toolbar-group-items.content-rules .rte-toolbar-button svg{
      fill: none;
    }
    .${f} {
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

    .${f}.show {
      display: flex;
      flex-direction: column;
    }

    .${f}.rte-content-rules-theme-dark {
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

    .${f}.rte-content-rules-theme-dark .rte-content-rules-header {
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

    .${f}.rte-content-rules-theme-dark .rte-content-rules-icon-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    .${f}.rte-content-rules-theme-dark .rte-content-rules-icon-btn:hover,
    .${f}.rte-content-rules-theme-dark .rte-content-rules-icon-btn:focus-visible {
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

    .${f}.rte-content-rules-theme-dark .rte-content-rules-summary {
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

    .${f}.rte-content-rules-theme-dark .rte-content-rules-count {
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

    .${f}.rte-content-rules-theme-dark .rte-content-rules-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${f}.rte-content-rules-theme-dark .rte-content-rules-btn:hover,
    .${f}.rte-content-rules-theme-dark .rte-content-rules-btn:focus-visible {
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

    .${f}.rte-content-rules-theme-dark .rte-content-rules-item {
      border-color: #334155;
      background: #0b1220;
    }

    .${f}.rte-content-rules-theme-dark .rte-content-rules-item-error {
      border-color: #7f1d1d;
      background: #2b0b11;
    }

    .${f}.rte-content-rules-theme-dark .rte-content-rules-item-warning {
      border-color: #78350f;
      background: #2b1907;
    }

    .${f}.rte-content-rules-theme-dark .rte-content-rules-item-info {
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

    .${f}.rte-content-rules-theme-dark .rte-content-rules-excerpt,
    .${f}.rte-content-rules-theme-dark .rte-content-rules-suggestion {
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

    .${f}.rte-content-rules-theme-dark .rte-content-rules-empty {
      border-color: #334155;
      background: #0b1220;
      color: #94a3b8;
    }

    .rte-content-rules-shortcut {
      margin: 2px 0 0;
      font-size: 11px;
      color: #64748b;
    }

    .${f}.rte-content-rules-theme-dark .rte-content-rules-shortcut {
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
      .${f} {
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
  `,document.head.appendChild(e)}function De(e){E=e,L||(L=t=>{const n=t.target,o=n==null?void 0:n.closest(R);if(!o)return;g=o,d.has(o)||d.set(o,e),v.has(o)||v.set(o,[]),T.has(o)||T.set(o,e.enableRealtime);const r=h.get(o);r&&(G(r,o),J(o,r),O(o,r,d.get(o)||e)),$(o,"toggleContentRulesPanel",U(o)),$(o,"toggleContentRulesRealtime",A(o,e))},document.addEventListener("focusin",L,!0)),I||(I=t=>{const n=t.target,o=n==null?void 0:n.closest(R);o&&(g=o,be(o))},document.addEventListener("input",I,!0)),H||(H=t=>{if(t.defaultPrevented)return;const n=t.target;if(n!=null&&n.closest("input, textarea, select"))return;const o=t.key==="Escape",r=Pe(t),s=ze(t),a=_e(t);if(!o&&!r&&!s&&!a)return;const l=M(void 0,!1);if(!l||Z(l))return;const c=d.get(l)||E||e;if(d.set(l,c),g=l,o&&U(l)){t.preventDefault(),W(l,!0);return}if(r){t.preventDefault(),t.stopPropagation(),Q(l);return}if(s){t.preventDefault(),t.stopPropagation(),C(l,c,!0),ne(l);return}if(a){t.preventDefault(),t.stopPropagation();const u=!A(l,c);T.set(l,u);const i=h.get(l);i&&O(l,i,c),$(l,"toggleContentRulesRealtime",u),u&&C(l,c,!0)}},document.addEventListener("keydown",H,!0)),S||(S=()=>{h.forEach((t,n)=>{if(!n.isConnected||!t.isConnected){me(n),t.remove(),h.delete(n),B.delete(n);return}G(t,n),J(n,t)})},window.addEventListener("scroll",S,!0),window.addEventListener("resize",S))}function Ne(){L&&(document.removeEventListener("focusin",L,!0),L=null),I&&(document.removeEventListener("input",I,!0),I=null),H&&(document.removeEventListener("keydown",H,!0),H=null),S&&(window.removeEventListener("scroll",S,!0),window.removeEventListener("resize",S),S=null),h.forEach(e=>{e.remove()}),h.clear(),E=null,g=null}const Ke=(e={})=>{const t=j(e);return Be(),{name:"contentRules",toolbar:[{id:"contentRulesGroup",label:"Content Rules",type:"group",command:"contentRules",items:[{id:"contentRules",label:"Content Rules",command:"toggleContentRulesPanel",shortcut:"Mod-Alt-Shift-r",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M6 3h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm8 2v4h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 11h8M8 15h8M8 19h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'},{id:"contentRulesAudit",label:"Run Rules Audit",command:"runContentRulesAudit",shortcut:"Mod-Alt-Shift-l",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4 12h4l2 5 4-10 2 5h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/></svg>'},{id:"contentRulesRealtime",label:"Toggle Realtime Rules",command:"toggleContentRulesRealtime",shortcut:"Mod-Alt-Shift-t",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M12 3v4M12 17v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M3 12h4M17 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/></svg>'}]}],commands:{contentRules:(n,o)=>{const r=M(o);if(!r||Z(r))return!1;const s=d.get(r)||t;return d.set(r,s),g=r,Q(r,!0),C(r,s,!1),!0},toggleContentRulesPanel:(n,o)=>{const r=M(o);if(!r||Z(r))return!1;g=r;const s=d.get(r)||t;d.set(r,s);const a=Q(r,typeof n=="boolean"?n:void 0);return U(r)&&C(r,s,!1),a},runContentRulesAudit:async(n,o)=>{const r=M(o);if(!r)return!1;g=r;const s=d.get(r)||t;return d.set(r,s),await C(r,s,!0),ne(r),!0},toggleContentRulesRealtime:(n,o)=>{const r=M(o);if(!r)return!1;g=r;const s=d.get(r)||t;d.set(r,s);const a=typeof n=="boolean"?n:!A(r,s);T.set(r,a);const l=h.get(r);return l&&O(r,l,s),$(r,"toggleContentRulesRealtime",a),a&&C(r,s,!0),!0},getContentRulesIssues:(n,o)=>{const r=M(o);if(!r)return!1;const s=v.get(r)||[];if(typeof n=="function")try{n(s)}catch{}return r.__contentRulesIssues=s,r.dispatchEvent(new CustomEvent("editora:content-rules-issues",{bubbles:!0,detail:{issues:s}})),!0},setContentRulesOptions:(n,o)=>{const r=M(o);if(!r||!n||typeof n!="object")return!1;const s=d.get(r)||t,a=j({...s,...n,labels:{...s.labels,...n.labels||{}}});d.set(r,a),typeof n.enableRealtime=="boolean"&&T.set(r,n.enableRealtime),A(r,a)&&C(r,a,!0);const l=h.get(r);if(l){l.setAttribute("aria-label",a.labels.panelAriaLabel);const c=l.querySelector(".rte-content-rules-title");c&&(c.textContent=a.labels.panelTitle),O(r,l,a),te(r)}return!0}},keymap:{"Mod-Alt-Shift-r":"toggleContentRulesPanel","Mod-Alt-Shift-R":"toggleContentRulesPanel","Mod-Alt-Shift-l":"runContentRulesAudit","Mod-Alt-Shift-L":"runContentRulesAudit","Mod-Alt-Shift-t":"toggleContentRulesRealtime","Mod-Alt-Shift-T":"toggleContentRulesRealtime"},init:function(o){N+=1;const r=this&&typeof this.__pluginConfig=="object"?j({...t,...this.__pluginConfig}):t;De(r);const s=M(o&&o.editorElement?{editorElement:o.editorElement}:void 0,!1);s&&(g=s,d.set(s,r),T.set(s,r.enableRealtime),v.set(s,[]),$(s,"toggleContentRulesPanel",!1),$(s,"toggleContentRulesRealtime",r.enableRealtime),r.enableRealtime&&be(s))},destroy:()=>{N=Math.max(0,N-1),!(N>0)&&(_.forEach(n=>{window.clearTimeout(n)}),_.clear(),Ne())}}};export{Ke as C};
