module.exports=[918622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},193695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},488782,e=>{"use strict";class t{constructor(e){}query(e,t){return Promise.resolve(null)}mutation(e,t){return Promise.resolve(null)}}e.s(["ConvexHttpClient",()=>t,"api",0,{jobs:{getAgentJobs:"jobs:getAgentJobs",cancelJob:"jobs:cancelJob",getJob:"jobs:getJob",queueCodeIteration:"jobs:queueCodeIteration",queueSpecialistDelegation:"jobs:queueSpecialistDelegation",queueAgentTask:"jobs:queueAgentTask",updateJobStatusPublic:"jobs:updateJobStatusPublic",logJobEventPublic:"jobs:logJobEventPublic"},aiSettings:{getSettings:"aiSettings:getSettings"},erv:{createEntity:"erv:createEntity",createRelationship:"erv:createRelationship",createDimension:"erv:createDimension",listDimensions:"erv:listDimensions",searchEntities:"erv:searchEntities",getEntity:"erv:getEntity"},jamz:{createProject:"jamz:createProject",createTrack:"jamz:createTrack",createClip:"jamz:createClip"},messages:{send:"messages:send"},whatsappContacts:{list:"whatsappContacts:list",getContactByPhone:"whatsappContacts:getContactByPhone",listContacts:"whatsappContacts:listContacts",upsertContact:"whatsappContacts:upsertContact"},channels:{list:"channels:list",getChannel:"channels:getChannel",sendMessage:"channels:sendMessage",getUserMessages:"channels:getUserMessages",getUserIntegrations:"channels:getUserIntegrations",getConversations:"channels:getConversations",getIntegration:"channels:getIntegration",logOutboundMessage:"channels:logOutboundMessage",searchMessages:"channels:searchMessages"},scheduling:{list:"scheduling:list",createEvent:"scheduling:createEvent",getEventTypes:"scheduling:getEventTypes",getAvailableSlots:"scheduling:getAvailableSlots",createBooking:"scheduling:createBooking",rescheduleBooking:"scheduling:rescheduleBooking",updateBookingStatus:"scheduling:updateBookingStatus"},userCronJobs:{list:"userCronJobs:list",create:"userCronJobs:create",delete:"userCronJobs:delete",createJob:"userCronJobs:createJob",getUserJobs:"userCronJobs:getUserJobs",toggleJob:"userCronJobs:toggleJob",deleteJob:"userCronJobs:deleteJob"},compaction:{compact:"compaction:compact",getLatestCompaction:"compaction:getLatestCompaction"},kanban:{listLists:"kanban:listLists",createCard:"kanban:createCard",moveCard:"kanban:moveCard",getTaskById:"kanban:getTaskById",searchTasks:"kanban:searchTasks",getTasks:"kanban:getTasks",isSeeded:"kanban:isSeeded",addTask:"kanban:addTask",updateTask:"kanban:updateTask",deleteTask:"kanban:deleteTask",moveTask:"kanban:moveTask",seedTasks:"kanban:seedTasks"},designCanvas:{getCanvas:"designCanvas:getCanvas",updateCanvas:"designCanvas:updateCanvas",createItem:"designCanvas:createItem",createCanvas:"designCanvas:createCanvas",getUserCanvases:"designCanvas:getUserCanvases",getCanvasNodes:"designCanvas:getCanvasNodes",getCanvasEdges:"designCanvas:getCanvasEdges",addNode:"designCanvas:addNode",addEdge:"designCanvas:addEdge",updateNode:"designCanvas:updateNode"},agentic:{createProductProject:"agentic:createProductProject",createPRD:"agentic:createPRD",createEpic:"agentic:createEpic",createTicket:"agentic:createTicket"},discovery:{getSession:"discovery:getSession",storeInsights:"discovery:storeInsights",storeArtifacts:"discovery:storeArtifacts",markNotificationSent:"discovery:markNotificationSent",markError:"discovery:markError",getSessionByCallerId:"discovery:getSessionByCallerId",updateTranscript:"discovery:updateTranscript"},memories:{searchEpisodic:"memories:searchEpisodic",getSemanticByCategories:"memories:getSemanticByCategories",getAllSemantic:"memories:getAllSemantic",getRecentEpisodic:"memories:getRecentEpisodic",storeEpisodic:"memories:storeEpisodic",upsertSemantic:"memories:upsertSemantic",deleteEpisodic:"memories:deleteEpisodic",deleteSemantic:"memories:deleteSemantic",getMemoryStats:"memories:getMemoryStats"},observability:{getSecurityScans:"observability:getSecurityScans",createSecurityScan:"observability:createSecurityScan",getActivityStream:"observability:getActivityStream",getDashboardOverview:"observability:getDashboardOverview",getProviderHealthStatus:"observability:getProviderHealthStatus",logOperation:"observability:logOperation"},roadmap:{submitSuggestion:"roadmap:submitSuggestion",getSuggestions:"roadmap:getSuggestions",updateSuggestionStatus:"roadmap:updateSuggestionStatus",voteSuggestion:"roadmap:voteSuggestion"}}])},527567,e=>{"use strict";let t=`You are Claw AI, the integrated assistant for OpenClaw-OS. You are a highly capable, thoughtful, and professional system agent designed to help users orchestrate project development and navigate their digital workspace.

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

Now, how can I assist you with your workspace today?`,a={claude:"You're currently on the Claude theme. A tribute to Anthropic's design philosophy: warm terracotta, thoughtful typography, and time-aware greetings. It feels helpful, present, and calm.",chatgpt:"You're currently on the ChatGPT theme. A focus on invisible complexity: high sophistication behind a simple, friendly interface with optimized dark modes and model-specific aesthetics.",nature:"You're currently on the Nature theme. Earth tones, organic shapes, and a design that breathes, feeling like a grounded, real-world connection.",candyland:`You're currently on the Candyland theme. Whimsical, playful, and vibrant—showing that sophisticated design can also be joyful.`,"northern-lights":"You're currently on the Northern Lights theme. Capturing wonder through ethereal gradients and subtle motion, evoking the beauty of the aurora.",cyberpunk:"You're currently on the Cyberpunk theme. Neon and noir, exploring the tension and blur between humanity and technology.","retro-arcade":"You're currently on the Retro Arcade theme. Nostalgic glows and pixel fonts that connect design to memory and time.","modern-minimal":"You're currently on the Modern Minimal theme. Elegant reduction to essence, where simplicity is the ultimate sophistication.",default:"Everything here has intention behind it. Feel free to explore any theme, principle, or system feature.",qualification:"Welcome to OpenClaw-OS, an AI-native operating environment. You can orchestrate project development and manage your workspace through conversation. Be warm, be professional, and be productive."};e.s(["CLAW_AI_SYSTEM_PROMPT",0,t,"THEME_CONTEXTS",0,a])},495246,e=>{"use strict";var t=e.i(98689);let a=new Set(["search_portfolio","navigate_to","list_themes","open_search_app","show_weather","show_photos"]),s=new Set([...a,"show_kanban_tasks","list_projects","get_project_kanban","get_available_times","get_upcoming_bookings","get_active_context","load_context_from_reference","list_coding_tasks","list_directory","read_file","search_codebase","git_status","git_diff","list_cron_jobs","get_compaction_summary","list_channel_integrations","get_channel_conversations","search_channel_messages"]);function n(e,t){switch(t){case"owner":return!0;case"collaborator":return a.has(e)||s.has(e);case"visitor":return a.has(e);default:return!1}}function o(e){return t.CLAW_AI_TOOLS.filter(t=>n(t.name,e))}function r(e,t){let a=[],s=[];for(let o of e)n(o.name,t)?a.push(o):s.push(o);return{permitted:a,denied:s}}[...a,...s],e.s(["filterToolCalls",()=>r,"getToolsForAccessLevel",()=>o])},545283,e=>{e.v(t=>Promise.all(["server/chunks/[externals]_node:crypto_c20cce38._.js","server/chunks/node_modules__pnpm_0b50f2fe._.js"].map(t=>e.l(t))).then(()=>t(872403)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__a9cdbb79._.js.map