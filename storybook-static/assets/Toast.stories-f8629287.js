import{a as e,j as s,B as u,F as d,aC as g,t as n,G as h}from"./index-c1b18327.js";import{r as N}from"./index-93f6b7ae.js";const Te={title:"UI Components/Toast Notifications",parameters:{layout:"padded",docs:{description:{component:`
# Editora Toast - Advanced Notification System

**Bundle Size**: ~22 KB minified (5.6 KB gzipped)  
**Features**: Promise lifecycle, progress bars, groups, plugins, accessibility  
**Zero Dependencies**: Framework agnostic, works everywhere  

## Features
- ✅ Promise lifecycle toasts (loading → success/error)
- ✅ Progress bars with percentage display
- ✅ Toast groups and stacking
- ✅ Custom rendering and actions
- ✅ Accessibility (ARIA, keyboard navigation)
- ✅ Themes (light/dark/system)
- ✅ Plugins system
- ✅ Multiple positions
- ✅ Auto-dismiss with pause on hover
- ✅ Drag/swipe to dismiss
        `}}},argTypes:{theme:{control:{type:"select"},options:["light","dark","system","custom","colored","minimal","glass","neon","retro","ocean","forest","sunset","midnight"],description:"Toast theme"},position:{control:{type:"select"},options:["top-left","top-center","top-right","bottom-left","bottom-center","bottom-right"],description:"Toast position"},rtl:{control:{type:"boolean"},description:"Enable RTL (right-to-left) support"},swipeDirection:{control:{type:"select"},options:["any","horizontal","vertical","left","right","up","down"],description:"Swipe direction for dismiss"},pauseOnWindowBlur:{control:{type:"boolean"},description:"Pause toasts when window loses focus"}}},Ce=({theme:t="light",position:o="bottom-right",rtl:r=!1,swipeDirection:l="any",pauseOnWindowBlur:c=!1})=>{const[p,b]=N.useState(!1);return N.useEffect(()=>{n.configure({theme:t,position:o,duration:4e3,maxVisible:5,enableAccessibility:!0,rtl:r,swipeDirection:l,pauseOnWindowBlur:c}),b(!0)},[t,o,r,l,c]),p?s(u,{style:{padding:"20px",maxWidth:"800px"},children:[e("h1",{children:"Toast Notifications Demo"}),e("p",{children:"Click the buttons below to see different toast types and features."}),s(h,{style:{display:"grid",gap:"20px",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))"},children:[s("div",{children:[e("h3",{children:"Basic Toasts"}),s(d,{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e("button",{onClick:()=>g.info("This is an info message",{theme:t,position:o,rtl:r,swipeDirection:l}),children:"Info Toast"}),e("button",{onClick:()=>g.success("Operation completed successfully!",{theme:t,position:o,rtl:r,swipeDirection:l}),children:"Success Toast"}),e("button",{onClick:()=>g.error("Something went wrong!",{theme:t,position:o,rtl:r,swipeDirection:l}),children:"Error Toast"}),e("button",{onClick:()=>n.warning("This is a warning",{theme:t,position:o,rtl:r,swipeDirection:l}),children:"Warning Toast"}),e("button",{onClick:()=>n.loading("Loading content...",{theme:t,position:o,rtl:r,swipeDirection:l}),children:"Loading Toast"})]})]}),s("div",{children:[e("h3",{children:"Rich Toasts"}),s(d,{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e("button",{onClick:()=>{n.show({message:"Document saved successfully!",level:"success",icon:"💾",actions:[{label:"View Document",onClick:()=>alert("Viewing document...")},{label:"Share",onClick:()=>alert("Sharing...")}]})},children:"Rich Toast with Actions"}),e("button",{onClick:()=>{n.show({render:()=>{const i=document.createElement("div");return i.innerHTML=`
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="font-size: 20px;">🎨</span>
                      <div>
                        <strong>Custom Toast</strong>
                        <br>
                        <small>Rendered with custom function</small>
                      </div>
                    </div>
                  `,i},level:"custom"})},children:"Custom Render Toast"})]})]}),s("div",{children:[e("h3",{children:"Progress Toasts"}),s(d,{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e("button",{onClick:()=>{const i=n.show({message:"Processing...",level:"loading",progress:{value:0,showPercentage:!0}});let a=0;const m=setInterval(()=>{a+=10,n.update(i.id,{progress:{value:a,showPercentage:!0},message:`Processing... ${a}%`}),a>=100&&(clearInterval(m),setTimeout(()=>{n.update(i.id,{message:"Complete!",level:"success",progress:void 0})},500))},200)},children:"Progress Toast"}),e("button",{onClick:()=>{const i=n.show({message:"Downloading...",level:"loading",progress:{value:0}});let a=0;const m=setInterval(()=>{a+=5,n.update(i.id,{progress:{value:a}}),a>=100&&(clearInterval(m),n.update(i.id,{message:"Download complete!",level:"success",progress:void 0}))},100)},children:"Download Progress"})]})]}),s("div",{children:[e("h3",{children:"Theme Showcase"}),e(h,{style:{display:"grid",gap:"15px",gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))"},children:[{name:"Colored",theme:"colored"},{name:"Minimal",theme:"minimal"},{name:"Glass",theme:"glass"},{name:"Neon",theme:"neon"},{name:"Retro",theme:"retro"},{name:"Ocean",theme:"ocean"},{name:"Forest",theme:"forest"},{name:"Sunset",theme:"sunset"},{name:"Midnight",theme:"midnight"}].map(({name:i,theme:a})=>s(u,{style:{border:"1px solid #e1e5e9",borderRadius:"8px",padding:"15px"},children:[s("h4",{style:{margin:"0 0 10px 0",fontSize:"14px"},children:[i," Theme"]}),s(d,{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[e("button",{onClick:()=>{n.show({message:`${i} theme - Success!`,level:"success",theme:a})},children:"Success"}),e("button",{onClick:()=>{n.show({message:`${i} theme - Info message`,level:"info",theme:a})},children:"Info"}),e("button",{onClick:()=>{n.show({message:`${i} theme - Warning!`,level:"warning",theme:a})},children:"Warning"}),e("button",{onClick:()=>{n.show({message:`${i} theme - Error occurred`,level:"error",theme:a})},children:"Error"})]})]},a))})]}),s("div",{children:[e("h3",{children:"Advanced Animations"}),s(d,{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e("button",{onClick:()=>{n.show({message:"Spring animation toast!",level:"success",animation:{type:"spring",config:{stiffness:100,damping:20}}})},children:"Spring Animation"}),e("button",{onClick:()=>{n.show({message:"Bounce animation!",level:"info",animation:{type:"bounce",direction:"up",intensity:"normal",duration:800}})},children:"Bounce Animation"}),e("button",{onClick:()=>{n.show({message:"Slide animation!",level:"success",animation:{type:"slide",direction:"up",distance:100,duration:400}})},children:"Slide Animation"}),e("button",{onClick:()=>{n.show({message:"Zoom animation!",level:"warning",animation:{type:"zoom",scale:.3,origin:"center",duration:500}})},children:"Zoom Animation"}),e("button",{onClick:()=>{n.show({message:"Flip animation!",level:"error",animation:{type:"flip",axis:"y",direction:"forward",duration:600}})},children:"Flip Animation"}),e("button",{onClick:()=>{n.show({message:"Fade animation!",level:"info",animation:{type:"fade",direction:"up",distance:20,duration:300}})},children:"Fade Animation"}),e("button",{onClick:()=>{n.show({message:"Elastic animation!",level:"success",animation:{type:"elastic",direction:"up",intensity:"normal",duration:1e3}})},children:"Elastic Animation"}),e("button",{onClick:()=>{n.show({message:"Rotate animation!",level:"warning",animation:{type:"rotate",degrees:360,direction:"clockwise",duration:500}})},children:"Rotate Animation"}),e("button",{onClick:()=>{n.show({message:"Custom bounce animation!",level:"info",animation:{type:"custom",show:async i=>(i.style.transform="scale(0.3)",i.style.opacity="0",await new Promise(a=>setTimeout(a,50)),i.style.transition="all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",i.style.transform="scale(1)",i.style.opacity="1",new Promise(a=>setTimeout(a,600))),hide:async i=>(i.style.transition="all 0.4s ease",i.style.transform="scale(0.8)",i.style.opacity="0",new Promise(a=>setTimeout(a,400)))}})},children:"Custom Bounce Animation"})]})]}),s("div",{children:[e("h3",{children:"Promise Lifecycle Toasts"}),s(d,{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e("button",{onClick:()=>{const i=new Promise(a=>{setTimeout(()=>a("Data loaded successfully!"),2e3)});n.promise(i,{loading:"Loading data...",success:a=>`Success: ${a}`,error:"Failed to load data"}).catch(()=>{})},children:"Successful Promise"}),e("button",{onClick:()=>{const i=new Promise((a,m)=>{setTimeout(()=>m(new Error("Network error")),2e3)});n.promise(i,{loading:"Loading data...",success:"Data loaded!",error:a=>`Error: ${a.message}`}).catch(()=>{})},children:"Failed Promise"})]})]}),s("div",{children:[e("h3",{children:"Grouped Toasts"}),e(d,{style:{display:"flex",flexDirection:"column",gap:"10px"},children:e("button",{onClick:()=>{n.group("upload-group",{message:"Upload 1 of 3 complete",level:"success"}),setTimeout(()=>{n.group("upload-group",{message:"Upload 2 of 3 complete",level:"success"})},1e3),setTimeout(()=>{n.group("upload-group",{message:"All uploads complete!",level:"success"})},2e3)},children:"Grouped Uploads"})})]}),s("div",{children:[e("h3",{children:"File Upload Simulation"}),e(d,{style:{display:"flex",flexDirection:"column",gap:"10px"},children:e("button",{onClick:()=>{const i=new Promise((a,m)=>{let E=0;const I=setInterval(()=>{E+=20,E>=100&&(clearInterval(I),a("File uploaded successfully!"))},300);setTimeout(()=>{Math.random()>.7&&(clearInterval(I),m(new Error("Upload failed")))},1e3)});n.promise(i,{loading:"Uploading file...",success:"File uploaded successfully!",error:"Upload failed. Please try again."}).catch(()=>{})},children:"File Upload"})})]}),s("div",{children:[e("h3",{children:"Positioned Toasts"}),e(d,{style:{display:"flex",flexDirection:"column",gap:"10px"},children:["top-left","top-center","top-right","bottom-left","bottom-center","bottom-right"].map(i=>e("button",{onClick:()=>{n.show({message:`Toast at ${i}`,level:"info",position:i})},children:i},i))})]}),s("div",{children:[e("h3",{children:"Configuration"}),s(d,{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e("button",{onClick:()=>{n.show({message:"This toast will not auto-hide",level:"warning",persistent:!0,closable:!0})},children:"No Auto Hide"}),e("button",{onClick:()=>{n.configure({duration:2e3}),g.info("Fast duration set (2s)",{theme:t,position:o,rtl:r,swipeDirection:l})},children:"Fast Duration (2s)"}),e("button",{onClick:()=>{n.configure({duration:1e4}),g.info("Slow duration set (10s)",{theme:t,position:o,rtl:r,swipeDirection:l})},children:"Slow Duration (10s)"}),e("button",{onClick:()=>{n.configure({maxVisible:2}),g.info("Max visible set to 2",{theme:t,position:o,rtl:r,swipeDirection:l})},children:"Max Visible: 2"}),e("button",{onClick:()=>{n.configure({duration:4e3,maxVisible:5,position:"bottom-right"}),g.info("Configuration reset",{theme:t,position:o,rtl:r,swipeDirection:l})},children:"Reset Config"})]})]}),s("div",{children:[e("h3",{children:"Update Toast"}),e(d,{style:{display:"flex",flexDirection:"column",gap:"10px"},children:e("button",{onClick:()=>{const i=n.loading("Saving document...");setTimeout(()=>{n.update(i.id,{message:"Document saved successfully!",level:"success"})},2e3)},children:"Loading → Success"})})]}),s("div",{children:[e("h3",{children:"Plugin Demo"}),s(d,{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e("button",{onClick:()=>{const i={name:"analytics",install(a){a.on("afterShow",m=>{console.log("📊 Toast shown:",{level:m.level,message:m.message,timestamp:new Date().toISOString()})})}};n.use(i),g.success("Analytics plugin installed! Check console.",{theme:t,position:o,rtl:r,swipeDirection:l})},children:"Install Analytics Plugin"}),e("button",{onClick:()=>{n.info("This toast will be tracked by analytics plugin")},children:"Toast with Plugin"})]})]})]}),s(u,{style:{marginTop:"40px",padding:"20px",backgroundColor:"#f5f5f5",borderRadius:"8px"},children:[e("h3",{children:"Toast State"}),s(d,{style:{display:"flex",gap:"20px",flexWrap:"wrap"},children:[s("div",{children:[e("strong",{children:"Toasts:"})," ",n.getToasts().length]}),s("div",{children:[e("strong",{children:"Groups:"})," ",Object.keys(n.getGroups()).length]}),s("div",{children:[e("strong",{children:"Config:"}),e("pre",{style:{fontSize:"12px",margin:"5px 0"},children:JSON.stringify(n.getConfig(),null,2)})]})]})]})]}):e("div",{children:"Initializing toast system..."})},y={render:t=>e(Ce,{theme:t.theme,position:t.position}),args:{theme:"light",position:"bottom-right"}},f={render:()=>s(u,{style:{padding:"20px"},children:[e("h2",{children:"Basic Toast Types"}),s(d,{style:{display:"flex",gap:"10px",flexWrap:"wrap"},children:[e("button",{onClick:()=>g.info("Info message",{theme:"light",position:"bottom-right"}),children:"Info"}),e("button",{onClick:()=>g.success("Success message",{theme:"light",position:"bottom-right"}),children:"Success"}),e("button",{onClick:()=>g.error("Error message",{theme:"light",position:"bottom-right"}),children:"Error"}),e("button",{onClick:()=>n.warning("Warning message",{theme:"light",position:"bottom-right"}),children:"Warning"}),e("button",{onClick:()=>n.loading("Loading message",{theme:"light",position:"bottom-right"}),children:"Loading"})]})]})},v={render:()=>s(u,{style:{padding:"20px"},children:[e("h2",{children:"Promise Lifecycle Toasts"}),s(d,{style:{display:"flex",gap:"10px"},children:[e("button",{onClick:()=>{const t=new Promise(o=>{setTimeout(()=>o("Data loaded!"),2e3)});n.promise(t,{loading:"Loading...",success:o=>`Success: ${o}`,error:"Failed"}).catch(()=>{})},children:"Success Promise"}),e("button",{onClick:()=>{const t=new Promise((o,r)=>{setTimeout(()=>r(new Error("Network error")),2e3)});n.promise(t,{loading:"Loading...",success:"Success!",error:o=>`Error: ${o.message}`}).catch(()=>{})},children:"Failed Promise"})]})]})},w={render:()=>s(u,{style:{padding:"20px"},children:[e("h2",{children:"Progress Toasts"}),e("button",{onClick:()=>{const t=n.show({message:"Processing...",level:"loading",progress:{value:0,showPercentage:!0}});let o=0;const r=setInterval(()=>{o+=10,n.update(t.id,{progress:{value:o,showPercentage:!0},message:`Processing... ${o}%`}),o>=100&&(clearInterval(r),setTimeout(()=>{n.update(t.id,{message:"Complete!",level:"success",progress:void 0})},500))},200)},children:"Start Progress"})]})},k={render:t=>e(Ce,{theme:t.theme,position:t.position,rtl:t.rtl,swipeDirection:t.swipeDirection,pauseOnWindowBlur:t.pauseOnWindowBlur}),args:{theme:"light",position:"bottom-right",rtl:!1,swipeDirection:"any",pauseOnWindowBlur:!1},parameters:{docs:{description:{story:"\n# New Features Demo\n\nThis story demonstrates the newly added features:\n\n## RTL Support\n- Enable RTL support with the `rtl` prop\n- Automatically adjusts text direction and layout for right-to-left languages\n\n## Swipe Direction Control\n- Choose specific swipe directions: `any`, `horizontal`, `vertical`, `left`, `right`, `up`, `down`\n- More precise control over how users can dismiss toasts\n\n## Window Focus Pausing\n- Enable `pauseOnWindowBlur` to automatically pause toasts when the window loses focus\n- Resumes when the window regains focus\n- Useful for preventing toasts from disappearing while users are in other tabs\n        "}}}},C={render:()=>s(u,{style:{padding:"20px"},children:[e("h2",{children:"Interactive Feedback Form"}),e("p",{children:"Toast containing a textarea and submit/cancel buttons for user feedback."}),e("button",{onClick:()=>{const t=document.createElement("div");t.style.cssText=`
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 280px;
        `;const o=document.createElement("div");o.textContent="💬 Quick Feedback",o.style.cssText=`
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
          color: inherit;
        `;const r=document.createElement("textarea");r.placeholder="How can we improve Editora?",r.style.cssText=`
          width: 100%;
          min-height: 60px;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: inherit;
          font-size: 13px;
          font-family: inherit;
          resize: vertical;
          outline: none;
        `;const l=document.createElement("div");l.style.cssText=`
          display: flex;
          gap: 6px;
          justify-content: flex-end;
          margin-top: 4px;
        `;const c=document.createElement("button");c.textContent="Send",c.style.cssText=`
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 4px;
          color: inherit;
          font-size: 12px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        `;const p=document.createElement("button");p.textContent="Cancel",p.style.cssText=`
          padding: 6px 12px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 4px;
          color: inherit;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        `,c.onmouseover=()=>{c.style.background="rgba(255, 255, 255, 0.3)",c.style.borderColor="rgba(255, 255, 255, 0.8)"},c.onmouseout=()=>{c.style.background="rgba(255, 255, 255, 0.2)",c.style.borderColor="rgba(255, 255, 255, 0.6)"},p.onmouseover=()=>{p.style.background="rgba(255, 255, 255, 0.1)",p.style.borderColor="rgba(255, 255, 255, 0.8)"},p.onmouseout=()=>{p.style.background="transparent",p.style.borderColor="rgba(255, 255, 255, 0.6)"};const b=()=>{const a=r.value.trim();if(!a){t.innerHTML=`
              <div style="text-align: center; color: inherit;">
                <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
                <div style="font-weight: 500; margin-bottom: 4px;">Please enter your feedback</div>
                <div style="font-size: 12px; opacity: 0.8;">We'd love to hear your thoughts!</div>
              </div>
            `,setTimeout(()=>{console.log("Feedback form validation error")},2e3);return}t.innerHTML=`
            <div style="text-align: center; color: inherit;">
              <div style="font-size: 24px; margin-bottom: 8px;">✅</div>
              <div style="font-weight: 500; margin-bottom: 4px;">Thank you for your feedback!</div>
              <div style="font-size: 12px; opacity: 0.8;">We'll review your suggestions soon.</div>
            </div>
          `,console.log("Feedback received:",a)},i=()=>{console.log("Feedback form cancelled")};c.onclick=b,p.onclick=i,r.onkeydown=a=>{a.key==="Enter"&&a.ctrlKey?b():a.key==="Escape"&&i()},l.appendChild(p),l.appendChild(c),t.appendChild(o),t.appendChild(r),t.appendChild(l),n.show({render:()=>t,level:"info",duration:0,closable:!0})},children:"Show Feedback Form"})]})},x={render:()=>s(u,{style:{padding:"20px"},children:[e("h2",{children:"System Notifications"}),e("p",{children:"Different types of system notifications with appropriate actions."}),s(h,{style:{display:"grid",gap:"10px",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))"},children:[e("button",{onClick:()=>{n.show({message:"🎉 System update v2.1.0 is now available! New features include enhanced accessibility and improved performance.",level:"success",actions:[{label:"Update Now",primary:!0,onClick:()=>console.log("Update started")},{label:"Later",onClick:()=>console.log("Update scheduled")}]})},children:"System Update"}),e("button",{onClick:()=>{n.show({message:"⚠️ Low disk space detected. Only 2.3 GB remaining. Consider freeing up space or upgrading storage.",level:"warning",actions:[{label:"Free Space",primary:!0,onClick:()=>console.log("Storage cleanup started")},{label:"Dismiss",onClick:()=>{}}]})},children:"Low Disk Space"}),e("button",{onClick:()=>{n.show({message:"❌ Internet connection lost. Some features may not work properly. Please check your network settings.",level:"error",actions:[{label:"Retry",primary:!0,onClick:()=>console.log("Retrying connection")},{label:"Settings",onClick:()=>console.log("Opening network settings")}]})},children:"Connection Lost"}),e("button",{onClick:()=>{n.show({message:"💬 You have 3 unread messages from the development team. Click to view them.",level:"info",actions:[{label:"View Messages",primary:!0,onClick:()=>console.log("Messages opened")},{label:"Mark Read",onClick:()=>console.log("Messages marked as read")}]})},children:"New Messages"})]})]})},D={render:()=>s(u,{style:{padding:"20px"},children:[e("h2",{children:"Bulk Notifications"}),e("p",{children:"Multiple notifications appearing in sequence."}),e("button",{onClick:()=>{[{message:"📧 New email from support@editora.dev",level:"info",delay:0},{message:"🔄 Database backup completed successfully",level:"success",delay:500},{message:"⚠️ High CPU usage detected on server-01",level:"warning",delay:1e3}].forEach(o=>{setTimeout(()=>{n.show({...o,duration:6e3,position:"top-right"})},o.delay)})},children:"Show Bulk Notifications"})]})},T={render:()=>s(u,{style:{padding:"20px"},children:[e("h2",{children:"Priority Notifications"}),e("p",{children:"High-priority notifications that require immediate attention."}),e("button",{onClick:()=>{n.show({message:"🚨 CRITICAL: Security vulnerability detected! Immediate action required.",level:"error",priority:100,duration:0,actions:[{label:"Fix Now",primary:!0,onClick:()=>console.log("Security patch applied")},{label:"Learn More",onClick:()=>console.log("Opening security documentation")}]})},children:"Show Critical Alert"})]})},S={render:()=>s(u,{style:{padding:"20px"},children:[e("h2",{children:"Persistent Notifications"}),e("p",{children:"Notifications that stay until manually dismissed."}),e("button",{onClick:()=>{n.show({message:"📌 This notification will stay until manually dismissed. Perfect for important announcements.",level:"info",persistent:!0,actions:[{label:"Got it!",primary:!0,onClick:()=>{}},{label:"Learn More",onClick:()=>console.log("Opening help documentation")}]})},children:"Show Persistent Notification"})]})},P={render:()=>s(u,{style:{padding:"20px"},children:[e("h2",{children:"Advanced Progress Scenarios"}),e("p",{children:"Complex progress tracking with multiple stages and real-time updates."}),s(h,{style:{display:"grid",gap:"10px",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))"},children:[e("button",{onClick:()=>{const t=n.show({message:"📁 Uploading document.pdf...",level:"loading",progress:{value:0,showPercentage:!0},duration:15e3});let o=0;const r=setInterval(()=>{o+=Math.random()*15+5,o>=100?(o=100,clearInterval(r),n.update(t.id,{message:"✅ document.pdf uploaded successfully!",level:"success",progress:void 0})):n.update(t,{progress:{value:o,showPercentage:!0}})},800)},children:"File Upload Progress"}),e("button",{onClick:()=>{const t=["🔍 Analyzing files...","📊 Processing data...","🔄 Optimizing content...","✅ Finalizing results..."];let o=0;const r=n.show({message:t[0],level:"loading",progress:{value:0},duration:12e3}),l=setInterval(()=>{o++;const c=o/t.length*100;o>=t.length?(clearInterval(l),n.update(r.id,{message:"🎉 All steps completed successfully!",level:"success",progress:void 0})):n.update(r.id,{message:t[o],progress:{value:c}})},2500)},children:"Multi-Step Process"}),e("button",{onClick:()=>{const t=n.show({message:"⬇️ Downloading update.zip (0 MB/s)",level:"loading",progress:{value:0,showPercentage:!0},duration:1e4});let o=0,r=2.1;const l=setInterval(()=>{o+=Math.random()*8+2,r=Math.max(.5,r+(Math.random()-.5)*.5),o>=100?(o=100,clearInterval(l),n.update(t.id,{message:"✅ update.zip downloaded successfully!",level:"success",progress:void 0})):n.update(t.id,{message:`⬇️ Downloading update.zip (${r.toFixed(1)} MB/s)`,progress:{value:o,showPercentage:!0}})},600)},children:"Download with Speed"}),e("button",{onClick:()=>{n.show({message:"🔄 Synchronizing with cloud...",level:"loading",progress:{indeterminate:!0},duration:8e3})},children:"Indeterminate Progress"})]})]})},A={render:()=>s(u,{style:{padding:"20px"},children:[e("h2",{children:"Interactive Actions"}),e("p",{children:"Toasts with multiple action buttons for complex user interactions."}),s(h,{style:{display:"grid",gap:"10px",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))"},children:[e("button",{onClick:()=>{n.show({message:"🔄 Are you sure you want to delete this file? This action cannot be undone.",level:"warning",actions:[{label:"Delete",primary:!0,onClick:()=>console.log("File deleted permanently")},{label:"Cancel",onClick:()=>console.log("Operation cancelled")}]})},children:"Confirm Action"}),e("button",{onClick:()=>{n.show({message:"❌ Failed to save document. Would you like to retry or save locally?",level:"error",actions:[{label:"Retry",primary:!0,onClick:()=>console.log("Retrying save operation")},{label:"Save Locally",onClick:()=>console.log("Document saved locally")}]})},children:"Retry Failed Operation"}),e("button",{onClick:()=>{n.show({message:"⬆️ A new version (v2.1.0) is available. Update now to get the latest features and security fixes.",level:"info",actions:[{label:"Update Now",primary:!0,onClick:()=>console.log("Installing update")},{label:"Later",onClick:()=>console.log("Update scheduled for next restart")},{label:"What's New",onClick:()=>console.log("New features: Enhanced themes, better accessibility, improved performance")}]})},children:"Update Available"}),e("button",{onClick:()=>{n.show({message:"📊 How satisfied are you with Editora Toast?",level:"info",actions:[{label:"😍 Very Satisfied",onClick:()=>console.log("Thank you for the feedback!")},{label:"😊 Satisfied",onClick:()=>console.log("Thank you for the feedback!")},{label:"😐 Neutral",onClick:()=>console.log("We'll work on improving!")},{label:"😕 Dissatisfied",onClick:()=>console.log("Sorry to hear that. Please share your concerns.")}]})},children:"Quick Survey"}),e("button",{onClick:()=>{n.show({message:"⚖️ Choose your preferred notification position for future updates.",level:"info",actions:[{label:"Top Right",onClick:()=>{n.configure({position:"top-right"}),console.log("Position updated to top-right")}},{label:"Bottom Right",onClick:()=>{n.configure({position:"bottom-right"}),console.log("Position updated to bottom-right")}},{label:"Top Left",onClick:()=>{n.configure({position:"top-left"}),console.log("Position updated to top-left")}}]})},children:"Decision Required"})]})]})},F={render:()=>s(u,{style:{padding:"20px"},children:[e("h2",{children:"Error Handling Scenarios"}),e("p",{children:"Different error types with appropriate recovery options."}),s(h,{style:{display:"grid",gap:"10px",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))"},children:[e("button",{onClick:()=>{n.show({message:"🌐 Unable to connect to the server. Please check your internet connection and try again.",level:"error",actions:[{label:"Retry",primary:!0,onClick:()=>console.log("Retrying connection")},{label:"Settings",onClick:()=>console.log("Opening network settings")}]})},children:"Network Error"}),e("button",{onClick:()=>{n.show({message:"❌ Please correct the following errors: Email format invalid, Password too short (min 8 characters).",level:"error",actions:[{label:"Fix Issues",primary:!0,onClick:()=>console.log("Highlighting error fields")}]})},children:"Validation Error"}),e("button",{onClick:()=>{n.show({message:"🔒 Permission denied. You need administrator privileges to perform this action.",level:"error",actions:[{label:"Request Access",primary:!0,onClick:()=>console.log("Access request sent to administrator")},{label:"Learn More",onClick:()=>console.log("Opening permissions documentation")}]})},children:"Permission Denied"}),e("button",{onClick:()=>{n.show({message:"⏰ Operation timed out. The server took too long to respond.",level:"error",actions:[{label:"Retry",primary:!0,onClick:()=>console.log("Retrying operation")},{label:"Cancel",onClick:()=>console.log("Operation cancelled")}]})},children:"Timeout Error"}),e("button",{onClick:()=>{n.show({message:"🖥️ Server error (500). Something went wrong on our end. Our team has been notified.",level:"error",actions:[{label:"Try Again",primary:!0,onClick:()=>console.log("Retrying request")},{label:"Report Issue",onClick:()=>console.log("Bug report submitted")}]})},children:"Server Error (500)"}),e("button",{onClick:()=>{n.show({message:"🚦 Too many requests. Please wait a moment before trying again.",level:"warning",actions:[{label:"Wait & Retry",primary:!0,onClick:()=>{setTimeout(()=>console.log("Ready to retry"),3e3)}}]})},children:"Rate Limited"})]})]})},B={render:()=>s(u,{style:{padding:"20px"},children:[e("h2",{children:"Async Operations"}),e("p",{children:"Promise-based operations with loading states and success/error handling."}),s(h,{style:{display:"grid",gap:"10px",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))"},children:[e("button",{onClick:()=>{const t=new Promise((o,r)=>{setTimeout(()=>{Math.random()>.1?o({data:"Sample API response",status:200}):r(new Error("Network Error"))},2e3)});n.promise(t,{loading:"🔄 Making API request...",success:o=>`✅ API call successful! Status: ${o.status}`,error:o=>`❌ API call failed: ${o.message}`}).catch(()=>{})},children:"Successful API Call"}),e("button",{onClick:()=>{const t=new Promise((o,r)=>{setTimeout(()=>{Math.random()>.3?o("File processed successfully"):r(new Error("File corrupted"))},2500)});n.promise(t,{loading:"📄 Processing file...",success:o=>`✅ ${o}`,error:o=>`❌ File operation failed: ${o.message}`}).catch(()=>{})},children:"File Operation"}),e("button",{onClick:()=>{const t=new Promise((o,r)=>{setTimeout(()=>{Math.random()>.2?o({transactionId:"TXN_"+Date.now()}):r(new Error("Payment declined"))},3e3)});n.promise(t,{loading:"💳 Processing payment...",success:o=>`✅ Payment successful! Transaction ID: ${o.transactionId}`,error:o=>`❌ Payment failed: ${o.message}`}).catch(()=>{})},children:"Payment Processing"}),e("button",{onClick:()=>{const t=new Promise((o,r)=>{setTimeout(()=>{Math.random()>.1?o("Data synchronized"):r(new Error("Sync conflict detected"))},3500)});n.promise(t,{loading:"🔄 Synchronizing data...",success:o=>`✅ ${o} with cloud`,error:o=>`❌ Sync failed: ${o.message}`}).catch(()=>{})},children:"Data Synchronization"})]})]})};var R,M,z;y.parameters={...y.parameters,docs:{...(R=y.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: args => <ToastDemo theme={args.theme} position={args.position} />,
  args: {
    theme: "light",
    position: "bottom-right"
  }
}`,...(z=(M=y.parameters)==null?void 0:M.docs)==null?void 0:z.source}}};var L,O,U;f.parameters={...f.parameters,docs:{...(L=f.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <Box style={{
    padding: "20px"
  }}>
      <h2>Basic Toast Types</h2>
      <Flex style={{
      display: "flex",
      gap: "10px",
      flexWrap: "wrap"
    }}>
        <button onClick={() => toast.info("Info message", {
        theme: 'light',
        position: 'bottom-right'
      })}>Info</button>
        <button onClick={() => toast.success("Success message", {
        theme: 'light',
        position: 'bottom-right'
      })}>Success</button>
        <button onClick={() => toast.error("Error message", {
        theme: 'light',
        position: 'bottom-right'
      })}>Error</button>
        <button onClick={() => toastAdvanced.warning("Warning message", {
        theme: 'light',
        position: 'bottom-right'
      })}>Warning</button>
        <button onClick={() => toastAdvanced.loading("Loading message", {
        theme: 'light',
        position: 'bottom-right'
      })}>Loading</button>
      </Flex>
    </Box>
}`,...(U=(O=f.parameters)==null?void 0:O.docs)==null?void 0:U.source}}};var W,$,G;v.parameters={...v.parameters,docs:{...(W=v.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <Box style={{
    padding: "20px"
  }}>
      <h2>Promise Lifecycle Toasts</h2>
      <Flex style={{
      display: "flex",
      gap: "10px"
    }}>
        <button onClick={() => {
        const promise = new Promise(resolve => {
          setTimeout(() => resolve("Data loaded!"), 2000);
        });
        toastAdvanced.promise(promise, {
          loading: "Loading...",
          success: data => \`Success: \${data}\`,
          error: "Failed"
        }).catch(() => {});
      }}>
          Success Promise
        </button>
        <button onClick={() => {
        const promise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Network error")), 2000);
        });
        toastAdvanced.promise(promise, {
          loading: "Loading...",
          success: "Success!",
          error: error => \`Error: \${error.message}\`
        }).catch(() => {});
      }}>
          Failed Promise
        </button>
      </Flex>
    </Box>
}`,...(G=($=v.parameters)==null?void 0:$.docs)==null?void 0:G.source}}};var H,j,q;w.parameters={...w.parameters,docs:{...(H=w.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <Box style={{
    padding: "20px"
  }}>
      <h2>Progress Toasts</h2>
      <button onClick={() => {
      const toastInstance = toastAdvanced.show({
        message: "Processing...",
        level: "loading",
        progress: {
          value: 0,
          showPercentage: true
        }
      });
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        toastAdvanced.update(toastInstance.id, {
          progress: {
            value: progress,
            showPercentage: true
          },
          message: \`Processing... \${progress}%\`
        });
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            toastAdvanced.update(toastInstance.id, {
              message: "Complete!",
              level: "success",
              progress: undefined
            });
          }, 500);
        }
      }, 200);
    }}>
        Start Progress
      </button>
    </Box>
}`,...(q=(j=w.parameters)==null?void 0:j.docs)==null?void 0:q.source}}};var V,_,K;k.parameters={...k.parameters,docs:{...(V=k.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: args => <ToastDemo theme={args.theme} position={args.position} rtl={args.rtl} swipeDirection={args.swipeDirection} pauseOnWindowBlur={args.pauseOnWindowBlur} />,
  args: {
    theme: "light",
    position: "bottom-right",
    rtl: false,
    swipeDirection: "any",
    pauseOnWindowBlur: false
  },
  parameters: {
    docs: {
      description: {
        story: \`
# New Features Demo

This story demonstrates the newly added features:

## RTL Support
- Enable RTL support with the \\\`rtl\\\` prop
- Automatically adjusts text direction and layout for right-to-left languages

## Swipe Direction Control
- Choose specific swipe directions: \\\`any\\\`, \\\`horizontal\\\`, \\\`vertical\\\`, \\\`left\\\`, \\\`right\\\`, \\\`up\\\`, \\\`down\\\`
- More precise control over how users can dismiss toasts

## Window Focus Pausing
- Enable \\\`pauseOnWindowBlur\\\` to automatically pause toasts when the window loses focus
- Resumes when the window regains focus
- Useful for preventing toasts from disappearing while users are in other tabs
        \`
      }
    }
  }
}`,...(K=(_=k.parameters)==null?void 0:_.docs)==null?void 0:K.source}}};var Q,Y,Z;C.parameters={...C.parameters,docs:{...(Q=C.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <Box style={{
    padding: "20px"
  }}>
      <h2>Interactive Feedback Form</h2>
      <p>Toast containing a textarea and submit/cancel buttons for user feedback.</p>
      <button onClick={() => {
      const feedbackForm = document.createElement('div');
      feedbackForm.style.cssText = \`
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 280px;
        \`;
      const title = document.createElement('div');
      title.textContent = '💬 Quick Feedback';
      title.style.cssText = \`
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
          color: inherit;
        \`;
      const textarea = document.createElement('textarea');
      textarea.placeholder = 'How can we improve Editora?';
      textarea.style.cssText = \`
          width: 100%;
          min-height: 60px;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: inherit;
          font-size: 13px;
          font-family: inherit;
          resize: vertical;
          outline: none;
        \`;
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = \`
          display: flex;
          gap: 6px;
          justify-content: flex-end;
          margin-top: 4px;
        \`;
      const submitBtn = document.createElement('button');
      submitBtn.textContent = 'Send';
      submitBtn.style.cssText = \`
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 4px;
          color: inherit;
          font-size: 12px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        \`;
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.style.cssText = \`
          padding: 6px 12px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 4px;
          color: inherit;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        \`;

      // Button hover effects
      submitBtn.onmouseover = () => {
        submitBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        submitBtn.style.borderColor = 'rgba(255, 255, 255, 0.8)';
      };
      submitBtn.onmouseout = () => {
        submitBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        submitBtn.style.borderColor = 'rgba(255, 255, 255, 0.6)';
      };
      cancelBtn.onmouseover = () => {
        cancelBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        cancelBtn.style.borderColor = 'rgba(255, 255, 255, 0.8)';
      };
      cancelBtn.onmouseout = () => {
        cancelBtn.style.background = 'transparent';
        cancelBtn.style.borderColor = 'rgba(255, 255, 255, 0.6)';
      };

      // Form submission
      const handleSubmit = () => {
        const feedback = textarea.value.trim();
        if (!feedback) {
          feedbackForm.innerHTML = \`
              <div style="text-align: center; color: inherit;">
                <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
                <div style="font-weight: 500; margin-bottom: 4px;">Please enter your feedback</div>
                <div style="font-size: 12px; opacity: 0.8;">We'd love to hear your thoughts!</div>
              </div>
            \`;
          setTimeout(() => {
            // In Storybook, we can't access the toast instance directly
            console.log('Feedback form validation error');
          }, 2000);
          return;
        }
        feedbackForm.innerHTML = \`
            <div style="text-align: center; color: inherit;">
              <div style="font-size: 24px; margin-bottom: 8px;">✅</div>
              <div style="font-weight: 500; margin-bottom: 4px;">Thank you for your feedback!</div>
              <div style="font-size: 12px; opacity: 0.8;">We'll review your suggestions soon.</div>
            </div>
          \`;
        console.log('Feedback received:', feedback);
      };
      const handleCancel = () => {
        console.log('Feedback form cancelled');
      };

      // Event listeners
      submitBtn.onclick = handleSubmit;
      cancelBtn.onclick = handleCancel;
      textarea.onkeydown = e => {
        if (e.key === 'Enter' && e.ctrlKey) {
          handleSubmit();
        } else if (e.key === 'Escape') {
          handleCancel();
        }
      };

      // Assemble form
      buttonContainer.appendChild(cancelBtn);
      buttonContainer.appendChild(submitBtn);
      feedbackForm.appendChild(title);
      feedbackForm.appendChild(textarea);
      feedbackForm.appendChild(buttonContainer);
      toastAdvanced.show({
        render: () => feedbackForm,
        level: 'info',
        duration: 0,
        closable: true
      });
    }}>
        Show Feedback Form
      </button>
    </Box>
}`,...(Z=(Y=C.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var X,J,ee;x.parameters={...x.parameters,docs:{...(X=x.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <Box style={{
    padding: "20px"
  }}>
      <h2>System Notifications</h2>
      <p>Different types of system notifications with appropriate actions.</p>
      <Grid style={{
      display: "grid",
      gap: "10px",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"
    }}>
        <button onClick={() => {
        toastAdvanced.show({
          message: '🎉 System update v2.1.0 is now available! New features include enhanced accessibility and improved performance.',
          level: 'success',
          actions: [{
            label: 'Update Now',
            primary: true,
            onClick: () => console.log('Update started')
          }, {
            label: 'Later',
            onClick: () => console.log('Update scheduled')
          }]
        });
      }}>
          System Update
        </button>

        <button onClick={() => {
        toastAdvanced.show({
          message: '⚠️ Low disk space detected. Only 2.3 GB remaining. Consider freeing up space or upgrading storage.',
          level: 'warning',
          actions: [{
            label: 'Free Space',
            primary: true,
            onClick: () => console.log('Storage cleanup started')
          }, {
            label: 'Dismiss',
            onClick: () => {}
          }]
        });
      }}>
          Low Disk Space
        </button>

        <button onClick={() => {
        toastAdvanced.show({
          message: '❌ Internet connection lost. Some features may not work properly. Please check your network settings.',
          level: 'error',
          actions: [{
            label: 'Retry',
            primary: true,
            onClick: () => console.log('Retrying connection')
          }, {
            label: 'Settings',
            onClick: () => console.log('Opening network settings')
          }]
        });
      }}>
          Connection Lost
        </button>

        <button onClick={() => {
        toastAdvanced.show({
          message: '💬 You have 3 unread messages from the development team. Click to view them.',
          level: 'info',
          actions: [{
            label: 'View Messages',
            primary: true,
            onClick: () => console.log('Messages opened')
          }, {
            label: 'Mark Read',
            onClick: () => console.log('Messages marked as read')
          }]
        });
      }}>
          New Messages
        </button>
      </Grid>
    </Box>
}`,...(ee=(J=x.parameters)==null?void 0:J.docs)==null?void 0:ee.source}}};var ne,oe,te;D.parameters={...D.parameters,docs:{...(ne=D.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <Box style={{
    padding: "20px"
  }}>
      <h2>Bulk Notifications</h2>
      <p>Multiple notifications appearing in sequence.</p>
      <button onClick={() => {
      const notifications = [{
        message: '📧 New email from support@editora.dev',
        level: 'info',
        delay: 0
      }, {
        message: '🔄 Database backup completed successfully',
        level: 'success',
        delay: 500
      }, {
        message: '⚠️ High CPU usage detected on server-01',
        level: 'warning',
        delay: 1000
      }];
      notifications.forEach(notification => {
        setTimeout(() => {
          toastAdvanced.show({
            ...notification,
            duration: 6000,
            position: 'top-right'
          });
        }, notification.delay);
      });
    }}>
        Show Bulk Notifications
      </button>
    </Box>
}`,...(te=(oe=D.parameters)==null?void 0:oe.docs)==null?void 0:te.source}}};var se,ie,re;T.parameters={...T.parameters,docs:{...(se=T.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => <Box style={{
    padding: "20px"
  }}>
      <h2>Priority Notifications</h2>
      <p>High-priority notifications that require immediate attention.</p>
      <button onClick={() => {
      toastAdvanced.show({
        message: '🚨 CRITICAL: Security vulnerability detected! Immediate action required.',
        level: 'error',
        priority: 100,
        duration: 0,
        actions: [{
          label: 'Fix Now',
          primary: true,
          onClick: () => console.log('Security patch applied')
        }, {
          label: 'Learn More',
          onClick: () => console.log('Opening security documentation')
        }]
      });
    }}>
        Show Critical Alert
      </button>
    </Box>
}`,...(re=(ie=T.parameters)==null?void 0:ie.docs)==null?void 0:re.source}}};var ae,le,ce;S.parameters={...S.parameters,docs:{...(ae=S.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  render: () => <Box style={{
    padding: "20px"
  }}>
      <h2>Persistent Notifications</h2>
      <p>Notifications that stay until manually dismissed.</p>
      <button onClick={() => {
      toastAdvanced.show({
        message: '📌 This notification will stay until manually dismissed. Perfect for important announcements.',
        level: 'info',
        persistent: true,
        actions: [{
          label: 'Got it!',
          primary: true,
          onClick: () => {}
        }, {
          label: 'Learn More',
          onClick: () => console.log('Opening help documentation')
        }]
      });
    }}>
        Show Persistent Notification
      </button>
    </Box>
}`,...(ce=(le=S.parameters)==null?void 0:le.docs)==null?void 0:ce.source}}};var de,ue,pe;P.parameters={...P.parameters,docs:{...(de=P.parameters)==null?void 0:de.docs,source:{originalSource:`{
  render: () => <Box style={{
    padding: "20px"
  }}>
      <h2>Advanced Progress Scenarios</h2>
      <p>Complex progress tracking with multiple stages and real-time updates.</p>
      <Grid style={{
      display: "grid",
      gap: "10px",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"
    }}>
        <button onClick={() => {
        const toast = toastAdvanced.show({
          message: '📁 Uploading document.pdf...',
          level: 'loading',
          progress: {
            value: 0,
            showPercentage: true
          },
          duration: 15000
        });
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15 + 5;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            toastAdvanced.update(toast.id, {
              message: '✅ document.pdf uploaded successfully!',
              level: 'success',
              progress: undefined
            });
          } else {
            toastAdvanced.update(toast, {
              progress: {
                value: progress,
                showPercentage: true
              }
            });
          }
        }, 800);
      }}>
          File Upload Progress
        </button>

        <button onClick={() => {
        const steps = ['🔍 Analyzing files...', '📊 Processing data...', '🔄 Optimizing content...', '✅ Finalizing results...'];
        let currentStep = 0;
        const toast = toastAdvanced.show({
          message: steps[0],
          level: 'loading',
          progress: {
            value: 0
          },
          duration: 12000
        });
        const interval = setInterval(() => {
          currentStep++;
          const progress = currentStep / steps.length * 100;
          if (currentStep >= steps.length) {
            clearInterval(interval);
            toastAdvanced.update(toast.id, {
              message: '🎉 All steps completed successfully!',
              level: 'success',
              progress: undefined
            });
          } else {
            toastAdvanced.update(toast.id, {
              message: steps[currentStep],
              progress: {
                value: progress
              }
            });
          }
        }, 2500);
      }}>
          Multi-Step Process
        </button>

        <button onClick={() => {
        const toast = toastAdvanced.show({
          message: '⬇️ Downloading update.zip (0 MB/s)',
          level: 'loading',
          progress: {
            value: 0,
            showPercentage: true
          },
          duration: 10000
        });
        let progress = 0;
        let speed = 2.1;
        const interval = setInterval(() => {
          progress += Math.random() * 8 + 2;
          speed = Math.max(0.5, speed + (Math.random() - 0.5) * 0.5);
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            toastAdvanced.update(toast.id, {
              message: '✅ update.zip downloaded successfully!',
              level: 'success',
              progress: undefined
            });
          } else {
            toastAdvanced.update(toast.id, {
              message: \`⬇️ Downloading update.zip (\${speed.toFixed(1)} MB/s)\`,
              progress: {
                value: progress,
                showPercentage: true
              }
            });
          }
        }, 600);
      }}>
          Download with Speed
        </button>

        <button onClick={() => {
        toastAdvanced.show({
          message: '🔄 Synchronizing with cloud...',
          level: 'loading',
          progress: {
            indeterminate: true
          },
          duration: 8000
        });
      }}>
          Indeterminate Progress
        </button>
      </Grid>
    </Box>
}`,...(pe=(ue=P.parameters)==null?void 0:ue.docs)==null?void 0:pe.source}}};var ge,me,he;A.parameters={...A.parameters,docs:{...(ge=A.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  render: () => <Box style={{
    padding: "20px"
  }}>
      <h2>Interactive Actions</h2>
      <p>Toasts with multiple action buttons for complex user interactions.</p>
      <Grid style={{
      display: "grid",
      gap: "10px",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"
    }}>
        <button onClick={() => {
        toastAdvanced.show({
          message: '🔄 Are you sure you want to delete this file? This action cannot be undone.',
          level: 'warning',
          actions: [{
            label: 'Delete',
            primary: true,
            onClick: () => console.log('File deleted permanently')
          }, {
            label: 'Cancel',
            onClick: () => console.log('Operation cancelled')
          }]
        });
      }}>
          Confirm Action
        </button>

        <button onClick={() => {
        toastAdvanced.show({
          message: '❌ Failed to save document. Would you like to retry or save locally?',
          level: 'error',
          actions: [{
            label: 'Retry',
            primary: true,
            onClick: () => console.log('Retrying save operation')
          }, {
            label: 'Save Locally',
            onClick: () => console.log('Document saved locally')
          }]
        });
      }}>
          Retry Failed Operation
        </button>

        <button onClick={() => {
        toastAdvanced.show({
          message: '⬆️ A new version (v2.1.0) is available. Update now to get the latest features and security fixes.',
          level: 'info',
          actions: [{
            label: 'Update Now',
            primary: true,
            onClick: () => console.log('Installing update')
          }, {
            label: 'Later',
            onClick: () => console.log('Update scheduled for next restart')
          }, {
            label: 'What\\'s New',
            onClick: () => console.log('New features: Enhanced themes, better accessibility, improved performance')
          }]
        });
      }}>
          Update Available
        </button>

        <button onClick={() => {
        toastAdvanced.show({
          message: '📊 How satisfied are you with Editora Toast?',
          level: 'info',
          actions: [{
            label: '😍 Very Satisfied',
            onClick: () => console.log('Thank you for the feedback!')
          }, {
            label: '😊 Satisfied',
            onClick: () => console.log('Thank you for the feedback!')
          }, {
            label: '😐 Neutral',
            onClick: () => console.log('We\\'ll work on improving!')
          }, {
            label: '😕 Dissatisfied',
            onClick: () => console.log('Sorry to hear that. Please share your concerns.')
          }]
        });
      }}>
          Quick Survey
        </button>

        <button onClick={() => {
        toastAdvanced.show({
          message: '⚖️ Choose your preferred notification position for future updates.',
          level: 'info',
          actions: [{
            label: 'Top Right',
            onClick: () => {
              toastAdvanced.configure({
                position: 'top-right'
              });
              console.log('Position updated to top-right');
            }
          }, {
            label: 'Bottom Right',
            onClick: () => {
              toastAdvanced.configure({
                position: 'bottom-right'
              });
              console.log('Position updated to bottom-right');
            }
          }, {
            label: 'Top Left',
            onClick: () => {
              toastAdvanced.configure({
                position: 'top-left'
              });
              console.log('Position updated to top-left');
            }
          }]
        });
      }}>
          Decision Required
        </button>
      </Grid>
    </Box>
}`,...(he=(me=A.parameters)==null?void 0:me.docs)==null?void 0:he.source}}};var be,ye,fe;F.parameters={...F.parameters,docs:{...(be=F.parameters)==null?void 0:be.docs,source:{originalSource:`{
  render: () => <Box style={{
    padding: "20px"
  }}>
      <h2>Error Handling Scenarios</h2>
      <p>Different error types with appropriate recovery options.</p>
      <Grid style={{
      display: "grid",
      gap: "10px",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"
    }}>
        <button onClick={() => {
        toastAdvanced.show({
          message: '🌐 Unable to connect to the server. Please check your internet connection and try again.',
          level: 'error',
          actions: [{
            label: 'Retry',
            primary: true,
            onClick: () => console.log('Retrying connection')
          }, {
            label: 'Settings',
            onClick: () => console.log('Opening network settings')
          }]
        });
      }}>
          Network Error
        </button>

        <button onClick={() => {
        toastAdvanced.show({
          message: '❌ Please correct the following errors: Email format invalid, Password too short (min 8 characters).',
          level: 'error',
          actions: [{
            label: 'Fix Issues',
            primary: true,
            onClick: () => console.log('Highlighting error fields')
          }]
        });
      }}>
          Validation Error
        </button>

        <button onClick={() => {
        toastAdvanced.show({
          message: '🔒 Permission denied. You need administrator privileges to perform this action.',
          level: 'error',
          actions: [{
            label: 'Request Access',
            primary: true,
            onClick: () => console.log('Access request sent to administrator')
          }, {
            label: 'Learn More',
            onClick: () => console.log('Opening permissions documentation')
          }]
        });
      }}>
          Permission Denied
        </button>

        <button onClick={() => {
        toastAdvanced.show({
          message: '⏰ Operation timed out. The server took too long to respond.',
          level: 'error',
          actions: [{
            label: 'Retry',
            primary: true,
            onClick: () => console.log('Retrying operation')
          }, {
            label: 'Cancel',
            onClick: () => console.log('Operation cancelled')
          }]
        });
      }}>
          Timeout Error
        </button>

        <button onClick={() => {
        toastAdvanced.show({
          message: '🖥️ Server error (500). Something went wrong on our end. Our team has been notified.',
          level: 'error',
          actions: [{
            label: 'Try Again',
            primary: true,
            onClick: () => console.log('Retrying request')
          }, {
            label: 'Report Issue',
            onClick: () => console.log('Bug report submitted')
          }]
        });
      }}>
          Server Error (500)
        </button>

        <button onClick={() => {
        toastAdvanced.show({
          message: '🚦 Too many requests. Please wait a moment before trying again.',
          level: 'warning',
          actions: [{
            label: 'Wait & Retry',
            primary: true,
            onClick: () => {
              setTimeout(() => console.log('Ready to retry'), 3000);
            }
          }]
        });
      }}>
          Rate Limited
        </button>
      </Grid>
    </Box>
}`,...(fe=(ye=F.parameters)==null?void 0:ye.docs)==null?void 0:fe.source}}};var ve,we,ke;B.parameters={...B.parameters,docs:{...(ve=B.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  render: () => <Box style={{
    padding: "20px"
  }}>
      <h2>Async Operations</h2>
      <p>Promise-based operations with loading states and success/error handling.</p>
      <Grid style={{
      display: "grid",
      gap: "10px",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"
    }}>
        <button onClick={() => {
        const promise = new Promise((resolve, reject) => {
          setTimeout(() => {
            Math.random() > 0.1 ? resolve({
              data: 'Sample API response',
              status: 200
            }) : reject(new Error('Network Error'));
          }, 2000);
        });
        toastAdvanced.promise(promise, {
          loading: '🔄 Making API request...',
          success: data => \`✅ API call successful! Status: \${data.status}\`,
          error: error => \`❌ API call failed: \${error.message}\`
        }).catch(() => {});
      }}>
          Successful API Call
        </button>

        <button onClick={() => {
        const promise = new Promise((resolve, reject) => {
          setTimeout(() => {
            Math.random() > 0.3 ? resolve('File processed successfully') : reject(new Error('File corrupted'));
          }, 2500);
        });
        toastAdvanced.promise(promise, {
          loading: '📄 Processing file...',
          success: message => \`✅ \${message}\`,
          error: error => \`❌ File operation failed: \${error.message}\`
        }).catch(() => {});
      }}>
          File Operation
        </button>

        <button onClick={() => {
        const promise = new Promise((resolve, reject) => {
          setTimeout(() => {
            Math.random() > 0.2 ? resolve({
              transactionId: 'TXN_' + Date.now()
            }) : reject(new Error('Payment declined'));
          }, 3000);
        });
        toastAdvanced.promise(promise, {
          loading: '💳 Processing payment...',
          success: data => \`✅ Payment successful! Transaction ID: \${data.transactionId}\`,
          error: error => \`❌ Payment failed: \${error.message}\`
        }).catch(() => {});
      }}>
          Payment Processing
        </button>

        <button onClick={() => {
        const promise = new Promise((resolve, reject) => {
          setTimeout(() => {
            Math.random() > 0.1 ? resolve('Data synchronized') : reject(new Error('Sync conflict detected'));
          }, 3500);
        });
        toastAdvanced.promise(promise, {
          loading: '🔄 Synchronizing data...',
          success: message => \`✅ \${message} with cloud\`,
          error: error => \`❌ Sync failed: \${error.message}\`
        }).catch(() => {});
      }}>
          Data Synchronization
        </button>
      </Grid>
    </Box>
}`,...(ke=(we=B.parameters)==null?void 0:we.docs)==null?void 0:ke.source}}};const Se=["ToastShowcase","BasicToasts","PromiseToasts","ProgressToasts","NewFeaturesDemo","InteractiveFeedbackForm","SystemNotifications","BulkNotifications","PriorityNotifications","PersistentNotifications","AdvancedProgressScenarios","InteractiveActions","ErrorHandlingScenarios","AsyncOperations"];export{P as AdvancedProgressScenarios,B as AsyncOperations,f as BasicToasts,D as BulkNotifications,F as ErrorHandlingScenarios,A as InteractiveActions,C as InteractiveFeedbackForm,k as NewFeaturesDemo,S as PersistentNotifications,T as PriorityNotifications,w as ProgressToasts,v as PromiseToasts,x as SystemNotifications,y as ToastShowcase,Se as __namedExportsOrder,Te as default};
