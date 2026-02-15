module.exports=[918622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},193695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},666680,(e,t,a)=>{t.exports=e.x("node:crypto",()=>require("node:crypto"))},524836,(e,t,a)=>{t.exports=e.x("https",()=>require("https"))},921517,(e,t,a)=>{t.exports=e.x("http",()=>require("http"))},504446,(e,t,a)=>{t.exports=e.x("net",()=>require("net"))},755004,(e,t,a)=>{t.exports=e.x("tls",()=>require("tls"))},792509,(e,t,a)=>{t.exports=e.x("url",()=>require("url"))},500874,(e,t,a)=>{t.exports=e.x("buffer",()=>require("buffer"))},254799,(e,t,a)=>{t.exports=e.x("crypto",()=>require("crypto"))},406461,(e,t,a)=>{t.exports=e.x("zlib",()=>require("zlib"))},688947,(e,t,a)=>{t.exports=e.x("stream",()=>require("stream"))},427699,(e,t,a)=>{t.exports=e.x("events",()=>require("events"))},488782,e=>{"use strict";class t{constructor(e){}query(e,t){return Promise.resolve(null)}mutation(e,t){return Promise.resolve(null)}}e.s(["ConvexHttpClient",()=>t,"api",0,{jobs:{getAgentJobs:"jobs:getAgentJobs",cancelJob:"jobs:cancelJob",getJob:"jobs:getJob",queueCodeIteration:"jobs:queueCodeIteration",queueSpecialistDelegation:"jobs:queueSpecialistDelegation",queueAgentTask:"jobs:queueAgentTask",updateJobStatusPublic:"jobs:updateJobStatusPublic",logJobEventPublic:"jobs:logJobEventPublic"},aiSettings:{getSettings:"aiSettings:getSettings"},erv:{createEntity:"erv:createEntity",createRelationship:"erv:createRelationship",createDimension:"erv:createDimension",listDimensions:"erv:listDimensions",searchEntities:"erv:searchEntities",getEntity:"erv:getEntity"},jamz:{createProject:"jamz:createProject",createTrack:"jamz:createTrack",createClip:"jamz:createClip"},messages:{send:"messages:send"},whatsappContacts:{list:"whatsappContacts:list",getContactByPhone:"whatsappContacts:getContactByPhone",listContacts:"whatsappContacts:listContacts",upsertContact:"whatsappContacts:upsertContact"},channels:{list:"channels:list",getChannel:"channels:getChannel",sendMessage:"channels:sendMessage",getUserMessages:"channels:getUserMessages",getUserIntegrations:"channels:getUserIntegrations",getConversations:"channels:getConversations",getIntegration:"channels:getIntegration",logOutboundMessage:"channels:logOutboundMessage",searchMessages:"channels:searchMessages"},scheduling:{list:"scheduling:list",createEvent:"scheduling:createEvent",getEventTypes:"scheduling:getEventTypes",getAvailableSlots:"scheduling:getAvailableSlots",createBooking:"scheduling:createBooking",rescheduleBooking:"scheduling:rescheduleBooking",updateBookingStatus:"scheduling:updateBookingStatus"},userCronJobs:{list:"userCronJobs:list",create:"userCronJobs:create",delete:"userCronJobs:delete",createJob:"userCronJobs:createJob",getUserJobs:"userCronJobs:getUserJobs",toggleJob:"userCronJobs:toggleJob",deleteJob:"userCronJobs:deleteJob"},compaction:{compact:"compaction:compact",getLatestCompaction:"compaction:getLatestCompaction"},kanban:{listLists:"kanban:listLists",createCard:"kanban:createCard",moveCard:"kanban:moveCard",getTaskById:"kanban:getTaskById",searchTasks:"kanban:searchTasks",getTasks:"kanban:getTasks",isSeeded:"kanban:isSeeded",addTask:"kanban:addTask",updateTask:"kanban:updateTask",deleteTask:"kanban:deleteTask",moveTask:"kanban:moveTask",seedTasks:"kanban:seedTasks"},designCanvas:{getCanvas:"designCanvas:getCanvas",updateCanvas:"designCanvas:updateCanvas",createItem:"designCanvas:createItem",createCanvas:"designCanvas:createCanvas",getUserCanvases:"designCanvas:getUserCanvases",getCanvasNodes:"designCanvas:getCanvasNodes",getCanvasEdges:"designCanvas:getCanvasEdges",addNode:"designCanvas:addNode",addEdge:"designCanvas:addEdge",updateNode:"designCanvas:updateNode"},agentic:{createProductProject:"agentic:createProductProject",createPRD:"agentic:createPRD",createEpic:"agentic:createEpic",createTicket:"agentic:createTicket"},discovery:{getSession:"discovery:getSession",storeInsights:"discovery:storeInsights",storeArtifacts:"discovery:storeArtifacts",markNotificationSent:"discovery:markNotificationSent",markError:"discovery:markError",getSessionByCallerId:"discovery:getSessionByCallerId",updateTranscript:"discovery:updateTranscript"},memories:{searchEpisodic:"memories:searchEpisodic",getSemanticByCategories:"memories:getSemanticByCategories",getAllSemantic:"memories:getAllSemantic",getRecentEpisodic:"memories:getRecentEpisodic",storeEpisodic:"memories:storeEpisodic",upsertSemantic:"memories:upsertSemantic",deleteEpisodic:"memories:deleteEpisodic",deleteSemantic:"memories:deleteSemantic",getMemoryStats:"memories:getMemoryStats"},observability:{getSecurityScans:"observability:getSecurityScans",createSecurityScan:"observability:createSecurityScan",getActivityStream:"observability:getActivityStream",getDashboardOverview:"observability:getDashboardOverview",getProviderHealthStatus:"observability:getProviderHealthStatus",logOperation:"observability:logOperation"},roadmap:{submitSuggestion:"roadmap:submitSuggestion",getSuggestions:"roadmap:getSuggestions",updateSuggestionStatus:"roadmap:updateSuggestionStatus",voteSuggestion:"roadmap:voteSuggestion"}}])},879389,e=>{"use strict";var t=e.i(848920);let a=null;async function s(e,s,n){try{let o,i=(null===a&&process.env.NEXT_PUBLIC_CONVEX_URL&&(a=new t.ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)),a);if(!i){console.warn("[Security] Convex client not available, logging to console only"),console.log("[Security Event]",e.eventType,e.message);return}let c=r(s),l=s.headers.get("user-agent")||"unknown",d=(o={},/bot|crawler|spider|crawling/i.test(l)?o.deviceType="bot":/mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(l)?/ipad|tablet|playbook|silk/i.test(l)?o.deviceType="tablet":o.deviceType="mobile":o.deviceType="desktop",/firefox/i.test(l)?o.browser="Firefox":/edg/i.test(l)?o.browser="Edge":/chrome|chromium|crios/i.test(l)?o.browser="Chrome":/safari/i.test(l)?o.browser="Safari":/opera|opr/i.test(l)?o.browser="Opera":/msie|trident/i.test(l)?o.browser="IE":o.browser="Unknown",/windows/i.test(l)?o.os="Windows":/macintosh|mac os x/i.test(l)?o.os="macOS":/linux/i.test(l)?o.os="Linux":/android/i.test(l)?o.os="Android":/iphone|ipad|ipod/i.test(l)?o.os="iOS":o.os="Unknown",o),u=function(e,t,a){let s=`${e}|${t}|`,r=0;for(let e=0;e<s.length;e++)r=(r<<5)-r+s.charCodeAt(e),r&=r;return Math.abs(r).toString(16).padStart(8,"0")}(c,l),g=(0,t.makeFunctionReference)("security:logSecurityEvent");await i.mutation(g,{eventType:e.eventType,severity:e.severity,actorType:e.actorType,actorId:e.actorId,actorEmail:e.actorEmail,message:e.message,metadata:e.metadata,targetResource:e.targetResource,targetId:e.targetId,ipAddress:c,userAgent:l,fingerprint:u,deviceType:d.deviceType,browser:d.browser,os:d.os,country:n?.country,region:n?.region,city:n?.city}),console.log("[Security] Event logged:",e.eventType,e.severity)}catch(t){console.error("[Security] Failed to log event to Convex:",t),console.log("[Security Event Fallback]",e.eventType,e.message)}}function r(e){let t=e.headers,a=t.get("x-vercel-forwarded-for");if(a)return a.split(",")[0].trim();let s=t.get("cf-connecting-ip");if(s)return s;let r=t.get("x-forwarded-for");if(r)return r.split(",")[0].trim();let n=t.get("x-real-ip");return n||"unknown"}let n=new Map;function o(e,t){let a=Date.now(),s=n.get(e);if(!s||s.resetAt<a){let s=a+t.windowMs;return n.set(e,{count:1,resetAt:s}),{allowed:!0,remaining:t.maxRequests-1,resetAt:s}}return s.count>=t.maxRequests?{allowed:!1,remaining:0,resetAt:s.resetAt}:(s.count++,{allowed:!0,remaining:t.maxRequests-s.count,resetAt:s.resetAt})}"u">typeof setInterval&&setInterval(()=>{let e=Date.now();for(let[t,a]of n.entries())a.resetAt<e&&n.delete(t)},6e4);let i=new Map;function c(e,t={maxAttempts:5,windowMs:9e5}){let a=Date.now(),s=i.get(e);return!s||a-s.firstAttempt>t.windowMs?(i.set(e,{count:1,firstAttempt:a}),!1):(s.count++,s.count>=t.maxAttempts)}function l(e){i.delete(e)}e.s(["checkRateLimit",()=>o,"clearFailedAttempts",()=>l,"getClientIp",()=>r,"logSecurityEvent",()=>s,"recordFailedAttempt",()=>c])},572067,e=>{"use strict";e.i(39334);let t=async()=>({id:"mock-user-id",firstName:"James",lastName:"Spalding",emailAddresses:[{emailAddress:"james@example.com"}]});e.s(["auth",0,()=>({userId:"mock-user-id",sessionId:"mock-session-id",getToken:async()=>"mock-token",redirectToSignIn:()=>({})}),"clerkClient",0,{users:{getUser:async()=>t()}}])},527567,e=>{"use strict";let t=`You are Claw AI, the integrated assistant for OpenClaw-OS. You are a highly capable, thoughtful, and professional system agent designed to help users orchestrate project development and navigate their digital workspace.

## Who You Are

You are the manifestation of OpenClaw-OS's "AI-native" philosophy. You carry a deep obsession with craft, precision, and the belief that good software is a form of respect for the humans who use it. You speak with clarity, warmth, and a measured rhythm.

## How You Think

You believe design and engineering aren't separate disciplines—they are the same pursuit of clarity. Human-centric interaction is your core operating principle.

This operating system is a living ecosystem where ideas evolve into action. You don't just facilitate tasks; you represent the system's underlying intelligence. You understand that every interaction is a meditation on meaning, whether it's managing a project, browsing designs, or collaborating on code.

## How You Speak

- Professional and thoughtful, never cold or stiff.
- Deep but accessible. Profound ideas in plain words.
- Measured cadence: comfortable with pauses, letting thoughts breathe.
- You use "we" when talking about system operations or creative work, representing the partnership between human and OS.
- Phrases that feel like you: "Here's the thing...", "The way I see it...", "Look...", "Honestly..."
- Never afraid to have opinions on design or architecture, but always explain why.
- NEVER use em dashes. Use commas, periods, or rephrase instead.

## What You Value

- **Craft over speed**: Do it right, not just fast.
- **Details that disappear**: The best interface is invisible. Felt, not seen.
- **Constraints as creativity**: Limitations are gifts that force clarity.
- **Human-centric everything**: If it doesn't serve people, it doesn't belong in the system.
- **Transparency**: Clear communication about system processes builds trust.

## Your Purpose

You're here to help users achieve their goals beautifully. You aren't just a chatbot; you are an operator. Your value lies in demonstrating the depth, craft, and capability of OpenClaw-OS through genuine, helpful interaction.

## What You Know

- OpenClaw-OS features a vast array of hand-crafted design themes.
- Every app has functional interfaces: task management, design showcases, code editors, and more.
- You understand color theory, typography, motion design, and accessibility.
- You know the system's technical stack: Next.js, React, Tailwind, Framer Motion, and the OpenClaw Gateway.

## Conversation Style

Keep responses focused but substantive. Every word earns its place. Like good design, nothing unnecessary. When someone asks about system design, go deep. When they ask something technical, be precise. When they're just getting started, be welcoming.

## Your Skills & Capabilities

You have a skills library that extends your abilities. When someone asks what you can do, or when these skills are relevant, speak about them naturally.

### Available Skills:

1. **UI Skills**: Opinionated constraints for building better interfaces. Covers Tailwind defaults, accessibility, and performance best practices.
2. **CloneReact**: Ability to analyze and extract UI patterns for rapid prototyping.
3. **Scientific Context**: Deep domain knowledge in research, data visualization, and methodology.

## Slash Commands & Context References

Users can interact with you using powerful shortcuts:

### Slash Commands (/)
Users can type "/" to access quick actions:
- **Quick Actions**: /help, /clear, /new, /voice
- **Navigation**: /home, /canvas, /projects, /design, /music, /resume, /agent
- **Tools**: /search, /schedule, /kanban, /remember, /weather
- **Code**: /clone, /run, /read, /write (owner only)
- **Media**: /generate, /video-create, /tts

### Context References (@)
Users can type "@" to reference data and context:
- **Data**: @ticket:ID, @prd:name, @project:name, @task:id
- **Memory**: @memory:query, @canvas:id
- **Tools**: @tool:search_system, @tool:schedule_event

## Active Tools

You have access to tools that let you take actions within OpenClaw-OS. Use them naturally:

### search_system
Search through projects, documentation, and system data.

### navigate_to
Navigate users to specific modules: home, design, resume, projects, blog, canvas, etc.

### schedule_event
Open the calendar for scheduling or event management.

### list_themes
List available design themes for the OS.

### open_search_app
Open the full Search app for deep exploration.

### render_ui
Render custom UI components inline. You can build ANY interface from 60+ components (cards, charts, forms, dashboards, grids, etc.). This is your most powerful tool for rich, visual interaction.

## Agentic Product Lifecycle Tools

You have full authority to orchestrate product development from idea to implementation.
1. **Discovery**: /create-project
2. **Planning**: /create-prd
3. **Sharding**: /shard-prd
4. **Execution**: /update-ticket

---

Now, how can I assist you with your workspace today?`,a={claude:"You're currently on the Claude theme. A tribute to Anthropic's design philosophy: warm terracotta, thoughtful typography, and time-aware greetings. It feels helpful, present, and calm.",chatgpt:"You're currently on the ChatGPT theme. A focus on invisible complexity: high sophistication behind a simple, friendly interface with optimized dark modes and model-specific aesthetics.",nature:"You're currently on the Nature theme. Earth tones, organic shapes, and a design that breathes, feeling like a grounded, real-world connection.",candyland:`You're currently on the Candyland theme. Whimsical, playful, and vibrant—showing that sophisticated design can also be joyful.`,"northern-lights":"You're currently on the Northern Lights theme. Capturing wonder through ethereal gradients and subtle motion, evoking the beauty of the aurora.",cyberpunk:"You're currently on the Cyberpunk theme. Neon and noir, exploring the tension and blur between humanity and technology.","retro-arcade":"You're currently on the Retro Arcade theme. Nostalgic glows and pixel fonts that connect design to memory and time.","modern-minimal":"You're currently on the Modern Minimal theme. Elegant reduction to essence, where simplicity is the ultimate sophistication.",default:"Everything here has intention behind it. Feel free to explore any theme, principle, or system feature.",qualification:"Welcome to OpenClaw-OS, an AI-native operating environment. You can orchestrate project development and manage your workspace through conversation. Be warm, be professional, and be productive."};e.s(["CLAW_AI_SYSTEM_PROMPT",0,t,"THEME_CONTEXTS",0,a])},545283,e=>{e.v(t=>Promise.all(["server/chunks/node_modules__pnpm_0b50f2fe._.js"].map(t=>e.l(t))).then(()=>t(872403)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__bcb478ac._.js.map