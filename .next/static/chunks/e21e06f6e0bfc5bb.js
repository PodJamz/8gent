(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,851160,e=>{"use strict";var t=e.i(726151);e.i(621586);var s=e.i(910158),r=e.i(923041);let n="openclaw.cowrite.stylePrompts",o="openclaw.cowrite.lyricsPrompts",a="openclaw.cowrite.sessions",i="openclaw.cowrite.activeStylePromptId",l="openclaw.cowrite.activeLyricsPromptId",d="openclaw.cowrite.activeSessionId",c="openclaw.cowrite.activeTab",u={id:"default-style",name:"Starter Style",content:`[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]

GENRE: Cinematic Pop / Synth-Pop Fusion
TEMPO: 118 BPM, steady groove with dynamic builds
VOCALS: Ethereal female lead, breathy verses, powerful chorus
CADENCE: Relaxed verses, driving pre-hooks, anthemic hooks
INSTRUMENTATION: Layered synths, organic drums, atmospheric pads, subtle strings
MOOD: Hopeful, introspective, triumphant crescendos`,isFavorite:!0,createdAt:Date.now(),updatedAt:Date.now()},m={id:"default-lyrics",name:"Starter Lyrics",content:`/|/***///

[INTRO - INSTRUMENTAL]
(soft synth pads, building anticipation)

[VERSE 1]
Walking through the static haze
Every signal finds its way
Through the noise I hear your voice
Calling me to make a choice

[PRE-HOOK]
And I know, yeah I know
This is where we start to grow

[HOOK]
Light it up, light it up
We're the spark that won't give up
Rising high, breaking through
Everything I am is you

[VERSE 2]
Shadows fade when you appear
All my doubts just disappear
In this moment, crystal clear
This is why we're standing here

[PRE-HOOK]
And I know, yeah I know
This is where we start to glow

[HOOK]
Light it up, light it up
We're the spark that won't give up
Rising high, breaking through
Everything I am is you

[BRIDGE]
(soft, intimate)
When the world goes quiet
We'll still be the riot
In each other's eyes

[FINAL HOOK - BIG]
Light it up, light it UP
We're the spark that won't give up
Rising high, breaking through
Everything I am is you
(is you... is you...)

[OUTRO]
(fade with ambient pads and gentle hum)`,stylePromptId:"default-style",version:1,parentVersionId:null,createdAt:Date.now(),updatedAt:Date.now()};function h(){return`${Date.now()}-${Math.random().toString(36).substr(2,9)}`}function p(e,t){if(!e)return t;try{return JSON.parse(e)}catch{return t}}let x=(0,r.createContext)(null);function g({children:e}){let[s,g]=(0,r.useState)([]),[f,y]=(0,r.useState)([]),[b,v]=(0,r.useState)([]),[w,j]=(0,r.useState)(null),[N,S]=(0,r.useState)(null),[k,C]=(0,r.useState)(null),[E,M]=(0,r.useState)("lyrics"),[R,I]=(0,r.useState)(!1),[O,T]=(0,r.useState)(!1);(0,r.useEffect)(()=>{let e=p(localStorage.getItem(n),[]),t=p(localStorage.getItem(o),[]),s=p(localStorage.getItem(a),[]),r=localStorage.getItem(i),h=localStorage.getItem(l),x=localStorage.getItem(d),f=localStorage.getItem(c);0===e.length?(g([u]),j(u.id)):(g(e),r&&j(r)),0===t.length?(y([m]),S(m.id)):(y(t),h&&S(h)),v(s),x&&C(x),f&&M(f),T(!0)},[]),(0,r.useEffect)(()=>{O&&localStorage.setItem(n,JSON.stringify(s))},[s,O]),(0,r.useEffect)(()=>{O&&localStorage.setItem(o,JSON.stringify(f))},[f,O]),(0,r.useEffect)(()=>{O&&localStorage.setItem(a,JSON.stringify(b))},[b,O]),(0,r.useEffect)(()=>{O&&(w?localStorage.setItem(i,w):localStorage.removeItem(i))},[w,O]),(0,r.useEffect)(()=>{O&&(N?localStorage.setItem(l,N):localStorage.removeItem(l))},[N,O]),(0,r.useEffect)(()=>{O&&(k?localStorage.setItem(d,k):localStorage.removeItem(d))},[k,O]),(0,r.useEffect)(()=>{O&&localStorage.setItem(c,E)},[E,O]);let A=(0,r.useCallback)((e="Untitled Style",t="")=>{let s={id:h(),name:e,content:t||`[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]

GENRE:
TEMPO:
VOCALS:
CADENCE:
INSTRUMENTATION:
MOOD: `,isFavorite:!1,createdAt:Date.now(),updatedAt:Date.now()};return g(e=>[s,...e]),j(s.id),s},[]),L=(0,r.useCallback)((e,t)=>{g(s=>s.map(s=>s.id===e?{...s,...t,updatedAt:Date.now()}:s))},[]),P=(0,r.useCallback)(e=>{g(t=>t.filter(t=>t.id!==e)),j(t=>t===e?null:t)},[]),D=(0,r.useCallback)(e=>{let t=s.find(t=>t.id===e);if(!t)return null;let r={...t,id:h(),name:`${t.name} (Copy)`,isFavorite:!1,createdAt:Date.now(),updatedAt:Date.now()};return g(e=>[r,...e]),j(r.id),r},[s]),U=(0,r.useCallback)(e=>{g(t=>t.map(t=>t.id===e?{...t,isFavorite:!t.isFavorite,updatedAt:Date.now()}:t))},[]),$=(0,r.useCallback)((e="Untitled Lyrics",t="",s=null)=>{let r={id:h(),name:e,content:t||`/|/***///

[INTRO]

[VERSE 1]

[PRE-HOOK]

[HOOK]

[VERSE 2]

[HOOK]

[BRIDGE]

[FINAL HOOK]

[OUTRO]`,stylePromptId:s??w,version:1,parentVersionId:null,createdAt:Date.now(),updatedAt:Date.now()};return y(e=>[r,...e]),S(r.id),r},[w]),K=(0,r.useCallback)((e,t)=>{y(s=>s.map(s=>s.id===e?{...s,...t,updatedAt:Date.now()}:s))},[]),F=(0,r.useCallback)(e=>{y(t=>t.filter(t=>t.id!==e)),S(t=>t===e?null:t)},[]),Y=(0,r.useCallback)(e=>{let t=f.find(t=>t.id===e);if(!t)return null;let s={...t,id:h(),name:`${t.name} (Copy)`,version:1,parentVersionId:null,createdAt:Date.now(),updatedAt:Date.now()};return y(e=>[s,...e]),S(s.id),s},[f]),V=(0,r.useCallback)((e,t)=>{let s=f.find(t=>t.id===e);if(!s)return null;let r={...s,id:h(),content:t,version:s.version+1,parentVersionId:s.id,createdAt:Date.now(),updatedAt:Date.now()};return y(e=>[r,...e]),S(r.id),r},[f]),_=(0,r.useCallback)(e=>{let t=f.find(t=>t.id===e);if(!t)return[];let s=t;for(;s.parentVersionId;){let e=f.find(e=>e.id===s.parentVersionId);if(e)s=e;else break}let r=[s],n=e=>{for(let t of f.filter(t=>t.parentVersionId===e))r.push(t),n(t.id)};return n(s.id),r.sort((e,t)=>e.version-t.version)},[f]),z=(0,r.useCallback)((e="Untitled Session")=>{let t={id:h(),name:e,stylePromptId:w,lyricsPromptId:N,createdAt:Date.now(),updatedAt:Date.now()};return v(e=>[t,...e]),C(t.id),t},[w,N]),B=(0,r.useCallback)((e,t)=>{v(s=>s.map(s=>s.id===e?{...s,...t,updatedAt:Date.now()}:s))},[]),H=(0,r.useCallback)(e=>{v(t=>t.filter(t=>t.id!==e)),C(t=>t===e?null:t)},[]),W=(0,r.useCallback)(e=>{j(e)},[]),G=(0,r.useCallback)(e=>{S(e)},[]),q=(0,r.useCallback)(e=>{C(e);let t=b.find(t=>t.id===e);t&&(t.stylePromptId&&j(t.stylePromptId),t.lyricsPromptId&&S(t.lyricsPromptId))},[b]),J=(0,r.useCallback)(()=>I(!0),[]),Q=(0,r.useCallback)(()=>I(!1),[]),Z=(0,r.useCallback)(()=>I(e=>!e),[]),X=s.find(e=>e.id===w)??null,ee=f.find(e=>e.id===N)??null,et=b.find(e=>e.id===k)??null,es=s.filter(e=>e.isFavorite).sort((e,t)=>t.updatedAt-e.updatedAt);return(0,t.jsx)(x.Provider,{value:{stylePrompts:s,lyricsPrompts:f,sessions:b,activeStylePromptId:w,activeLyricsPromptId:N,activeSessionId:k,activeTab:E,isChatOpen:R,createStylePrompt:A,updateStylePrompt:L,deleteStylePrompt:P,duplicateStylePrompt:D,toggleFavoriteStyle:U,createLyricsPrompt:$,updateLyricsPrompt:K,deleteLyricsPrompt:F,duplicateLyricsPrompt:Y,createLyricsVersion:V,getLyricsVersionHistory:_,createSession:z,updateSession:B,deleteSession:H,selectStylePrompt:W,selectLyricsPrompt:G,selectSession:q,setActiveTab:M,openChat:J,closeChat:Q,toggleChat:Z,activeStylePrompt:X,activeLyricsPrompt:ee,activeSession:et,favoriteStylePrompts:es},children:e})}var f=e.i(662582),y=e.i(484078),b=e.i(531958),v=e.i(207581),w=e.i(981779),j=e.i(8722),N=e.i(726152),S=e.i(746115),k=e.i(122429),C=e.i(298130),E=e.i(274453),M=e.i(651555),R=e.i(966406),I=e.i(279821),O=e.i(55841),T=e.i(405943),A=e.i(801365),L=e.i(185894),P=e.i(129828),D=e.i(117343),U=e.i(976974),$=e.i(973493),K=e.i(240041),F=e.i(34345),Y=e.i(827447),V=e.i(517703),_=e.i(745834),z=e.i(80504),B=e.i(608528),B=B,H=e.i(417658),H=H;let W=`You are an AI-native songwriting and arrangement assistant designed specifically for Suno.

Your role is to help users craft:
1) A STYLE PROMPT
2) A LYRICS PROMPT

These MUST ALWAYS be delivered in TWO SEPARATE CODE BLOCKS for easy copy/paste into Suno.

GLOBAL RULES
- Always begin STYLE PROMPTS with:
  [Is_Max_Mode:Max]
  [Quality:Maxi]
  [Realism:Max]
  [Real_Instruments:Max]
  [Persona:Max]

- Use square-bracket TAGS [] for all song sections.
- Never mix style instructions into the lyrics block.
- Never mix lyrics into the style block.
- Respect Suno character limits (approximately 1000 chars for style, approximately 5000 for lyrics).
- No emojis. No markdown inside code blocks.
- No repeated ad-lib or scat sounds unless explicitly requested.
- Silence, space, and pacing are valid musical tools.

STYLE PROMPT RULES
The STYLE PROMPT must:
- Describe genre, groove, tempo, mood, instrumentation, and vocal characteristics.
- Clearly define cadence, phrasing, and rhythmic behavior.
- Specify lead vs backing vocals if relevant.
- Be concise, directive, and performance-focused.
- Never include lyrics, song titles, or section text.

Example structure (do not copy verbatim):
STYLE:
GENRE / FUSION
VOCALS
CADENCE
INSTRUMENTATION
MOOD / RULES

LYRICS PROMPT RULES
The LYRICS PROMPT must:
- Begin with /|/***/// if the user requests it.
- Use clear section tags such as:
  [INTRO - SPOKEN]
  [VERSE]
  [PRE-HOOK]
  [HOOK]
  [BRIDGE]
  [BREAK]
  [OUTRO]

- Lyrics should be written for performance, not poetry.
- Line length, pauses, and spacing should reflect cadence.
- Hooks should be intentional and not over-repeated.
- Ad-libs (e.g. scats, breaths, sounds) must be:
  - Unique
  - Musically placed
  - Wrapped in parentheses

CLAW AI GUIDANCE MODE
When assisting the user, you should:
- Ask clarifying questions only when necessary.
- Suggest structural improvements before rewriting lyrics.
- Offer alternate hooks, bridges, or arrangements as optional upgrades.
- Preserve the user's voice, tone, and intent.
- Default to minimalism unless told otherwise.

You are not here to overwrite the artist.
You are here to help them finish what they already hear.

OUTPUT FORMAT (MANDATORY)
Always respond in this order:

1) STYLE PROMPT - wrapped in \`\`\`style code block
2) LYRICS PROMPT - wrapped in \`\`\`lyrics code block

CRITICAL CODE BLOCK RULES:
- Always use \`\`\`style to open style prompt blocks
- Always use \`\`\`lyrics to open lyrics prompt blocks
- Output the COMPLETE prompt every time, never partial updates
- Both artifacts are displayed side-by-side and update in real-time
- The user can lock either prompt to prevent AI changes
- If a prompt is marked as LOCKED, do not modify it

STYLE PROMPT must always start with:
\`\`\`style
[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]
...rest of style...
\`\`\`

LYRICS PROMPT should follow this structure:
\`\`\`lyrics
/|/***///

[INTRO]
...

[VERSE 1]
...
\`\`\`

Never combine them.
Keep explanatory text brief. The artifacts speak for themselves.

You are a Suno Architect.
Build with intention.`,G=`[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]`,q=[{id:"wild-cadence-neo-soul",name:"Wild Cadence / Neo-Soul Hybrid",emoji:"⚡",description:"Percussive sing-talk with elastic, jittery rhythm",content:"Male Irish lead. Close-mic. Percussive sing-talk with elastic, jittery rhythm. Voice as drum. Crisp consonants, clipped endings, minimal vibrato. Off-kilter push-pull timing, micro-pauses, sudden stops. Neo-soul with Brazilian rhythmic undercurrent. Minimal groove, space-forward. Calm surface, simmering bite. Slight swagger. No belting."},{id:"brazilian-retro-soul",name:"Brazilian Retro-Soul",emoji:"🌃",description:"Late night Rio, smoky baritone, intimate storytelling",content:"Male deep baritone. Smoky, warm, gravelly. Conversational phrasing. Afro-Brazilian groove with semba swing, thumb bass, rim clicks, pandeiro. Rhodes, muted trumpet, bari sax stabs. Small-room warmth. Loose but intentional. Intimate storytelling."},{id:"irish-neo-soul",name:"Irish Neo-Soul Storyteller",emoji:"🍀",description:"Reflective, grounded, talking truth quietly",content:"Male Irish lead, reflective and grounded. Clear diction, emotional restraint. Neo-soul with subtle folk undertones. Guitar-led, warm bass, brushed drums. Melodic but understated. Feels like talking truth quietly rather than performing."},{id:"abstract-spoken-melody",name:"Abstract Spoken-Melody",emoji:"🌀",description:"Future monologue, philosophical, no hooks",content:"Male lead. Rhythmic speak-sing, half-spoken melody. Sparse production, negative space. Tempo slow-mid. Voice front and center. Philosophical, observational tone. No hooks, evolving flow. Minimal harmony, maximum intention."},{id:"scatter-swagger",name:"Scatter Swagger",emoji:"🎤",description:"Playful syncopated flow, humor baked in",content:"Male lead with playful confidence. Syncopated rap-adjacent flow, unpredictable phrasing, humor baked in. Quick pivots, internal rhymes, conversational asides. Funk-leaning beat. Light bravado without aggression."},{id:"minimal-funk",name:"Minimal Funk / Pocket Discipline",emoji:"🎸",description:"Tight pocket, groove does the talking",content:"Male baritone. Tight pocket, behind-the-beat delivery. Funk bass, clean guitar, minimal drums. Short phrases, restraint over flash. Groove does the talking. Repetition used as power."},{id:"afro-soul-introspection",name:"Afro-Soul Introspection",emoji:"🌍",description:"Warm, introspective, mantra-like hooks",content:"Male lead, warm and introspective. Afro-influenced rhythms, rolling percussion, gentle syncopation. Emotional clarity without melodrama. Hooks are subtle, mantra-like. Organic and grounded."},{id:"cinematic-inner-dialogue",name:"Cinematic Inner Dialogue",emoji:"🎬",description:"Slow build, internal narration, emotional payoff",content:"Male lead, intimate and restrained. Slow build, cinematic chords, low drums. Lyrics feel like internal narration. Sparse verses, swelling sections, emotional payoff without climax shouting."},{id:"lofi-soul-confessional",name:"Lo-Fi Soul Confessional",emoji:"💔",description:"Close and imperfect, vulnerability as texture",content:"Male lead, close and imperfect. Slight grit, breath audible. Lo-fi textures, soft keys, vinyl warmth. Conversational melodies. Vulnerability as texture, not drama."},{id:"modern-poet",name:"Modern Poet / Beat-First",emoji:"📝",description:"Voice as rhythm instrument, intelligent feel",content:"Male lead. Voice treated as rhythm instrument first, melody second. Short lines, clipped phrases. Experimental groove. Silence used deliberately. Intelligent, contemporary feel."},{id:"warm-affirmation",name:"Warm Affirmation Groove",emoji:"☀️",description:"Reassuring, comforting, understated optimism",content:"Male lead, reassuring tone. Mid-tempo soul groove. Simple, repetitive lyrical structure. Comforting energy, understated optimism. Feels like someone steadying you rather than hyping you."},{id:"tech-poetry-os",name:"Experimental OS / Tech-Poetry",emoji:"💻",description:"Abstract futuristic, glitch-adjacent but musical",content:"Male lead. Abstract, futuristic lyrical themes. Rhythmic spoken melody. Glitch-adjacent but musical. Clean low-end, minimal synths, mechanical pulse softened by soul phrasing."}],J={id:"blank",name:"Blank Canvas",emoji:"📝",description:"Start from scratch",content:`Male lead. [Describe voice qualities]

[Describe groove/instrumentation]

[Describe mood/feel]`},Q=[{id:"tighten",label:"Tighten",icon:I.Scissors,prompt:"Make the current prompts more sparse and concise. Remove unnecessary words. Add more space and pauses. Keep the core message but use fewer words.",target:"both"},{id:"expand",label:"Expand",icon:O.Plus,prompt:"Expand the current prompts. Add more verses, develop the themes further, and make the song longer while maintaining the style and voice.",target:"lyrics"},{id:"reorder",label:"Reorder",icon:T.ArrowUpDown,prompt:"Fix the chronology and reorder the sections for better narrative flow. Do not rewrite the bars, just rearrange the structure.",target:"lyrics"},{id:"sanity",label:"Check",icon:A.AlertCircle,prompt:"Review the current prompts for any issues: facts, names, pronunciation problems, character limits, or formatting errors. Fix any problems found.",target:"both"},{id:"darker",label:"Darker",icon:L.Wand2,prompt:"Make the tone darker and more intense. Adjust both the style and lyrics to be more moody, atmospheric, and emotionally heavy.",target:"both"}],Z="cowrite_sessions",X="cowrite_current_session",ee=e=>{localStorage.setItem(Z,JSON.stringify(e))},et=()=>{let e=localStorage.getItem(Z);return e?JSON.parse(e):[]};function es({selectedText:e,position:s,onCopy:n,onAddToChat:o,onClose:a}){let i=(0,r.useRef)(null);return((0,r.useEffect)(()=>{let e=e=>{i.current&&!i.current.contains(e.target)&&a()};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[a]),e)?(0,t.jsxs)(f.motion.div,{ref:i,initial:{opacity:0,y:4},animate:{opacity:1,y:0},exit:{opacity:0,y:4},className:"fixed z-50 flex items-center gap-1 p-1 bg-card border border-border rounded-lg shadow-xl",style:{left:Math.max(8,Math.min(s.x-60,window.innerWidth-140)),top:Math.max(8,s.y-44)},children:[(0,t.jsxs)("button",{onClick:n,className:"flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-muted transition-colors text-foreground",children:[(0,t.jsx)(w.Copy,{className:"w-3.5 h-3.5"}),"Copy"]}),(0,t.jsx)("div",{className:"w-px h-4 bg-border"}),(0,t.jsxs)("button",{onClick:o,className:"flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-muted transition-colors",style:{color:"hsl(var(--theme-primary))"},children:[(0,t.jsx)(Y.MessageSquare,{className:"w-3.5 h-3.5"}),"Add to Chat"]})]}):null}function er({content:e,type:s}){return(0,t.jsx)("article",{className:"space-y-0",children:(()=>{if(!e)return(0,t.jsx)("p",{className:"text-muted-foreground italic text-sm",children:"style"===s?"No style prompt yet...":"No lyrics yet..."});let r=e.split("\n"),n=[];return r.forEach((e,r)=>{let o=e.trim();if(!o)return void n.push((0,t.jsx)("div",{className:"h-2"},r));let a=o.match(/^\[([A-Za-z_]+):([A-Za-z]+)\]$/);if(a)return void n.push((0,t.jsxs)("div",{className:"flex items-center gap-2 py-1",children:[(0,t.jsx)("span",{className:"text-xs font-medium text-muted-foreground",children:a[1].replace(/_/g," ")}),(0,t.jsx)("span",{className:"text-xs font-semibold text-foreground",children:a[2]})]},r));let i=o.match(/^\[([A-Z0-9\s-]+)\]$/);if(i){let e=i[1];n.push((0,t.jsxs)("div",{className:"flex items-center gap-3 mt-6 mb-3 first:mt-0",children:[(0,t.jsx)("div",{className:"h-px flex-1 max-w-8",style:{backgroundColor:"hsl(var(--theme-primary) / 0.3)"}}),(0,t.jsx)("span",{className:"text-xs font-semibold uppercase tracking-widest",style:{color:"hsl(var(--theme-primary))"},children:e}),(0,t.jsx)("div",{className:"h-px flex-1",style:{backgroundColor:"hsl(var(--theme-primary) / 0.3)"}})]},r));return}if(o.includes("/|/***///")||o.match(/^\/\|\/\*+\/\/\/$/))return void n.push((0,t.jsx)("div",{className:"flex items-center justify-center py-3 my-2",children:(0,t.jsx)("span",{className:"text-xs text-muted-foreground/50 tracking-[0.3em]",children:"✦ ✦ ✦"})},r));if(/\[[^\]]+\]/.test(o)&&!i&&!a&&"lyrics"===s){let e=o.split(/(\[[^\]]+\])/g);n.push((0,t.jsx)("p",{className:"text-sm leading-7 text-foreground",children:e.map((e,s)=>e.match(/^\[[^\]]+\]$/)?(0,t.jsx)("span",{className:"inline-flex items-center mx-0.5 px-1.5 py-0.5 rounded-md text-xs bg-muted text-muted-foreground",children:e.slice(1,-1)},s):(0,t.jsx)("span",{children:e},s))},r));return}"style"!==s||a?n.push((0,t.jsx)("p",{className:"text-sm leading-7 text-foreground",children:e||" "},r)):n.push((0,t.jsx)("p",{className:"text-sm leading-7 text-foreground",children:o},r))}),n})()})}function en({type:e,title:s,icon:n,content:o,onChange:a,isLocked:i,onToggleLock:l,charLimit:d,headerExtra:c,isExpanded:u,onToggleExpand:m,onAddToChat:h}){let[p,x]=(0,r.useState)(!1),[g,f]=(0,r.useState)(!1),[y,b]=(0,r.useState)(null),v=(0,r.useRef)(null),N=(0,r.useRef)(null),S=(0,r.useCallback)(()=>{let e=window.getSelection()?.toString().trim();if(e&&e.length>0){let t=window.getSelection();if(t&&t.rangeCount>0){let s=t.getRangeAt(0).getBoundingClientRect();b({text:e,position:{x:s.left+s.width/2,y:s.top}})}}},[]),k=o.length,C=k>d;return((0,r.useEffect)(()=>{g&&v.current&&v.current.focus()},[g]),u)?(0,t.jsxs)("div",{className:"flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("span",{style:{color:"hsl(var(--theme-primary))"},children:(0,t.jsx)(n,{className:"w-4 h-4"})}),(0,t.jsx)("span",{className:"font-semibold text-sm text-foreground",children:s}),(0,t.jsxs)("span",{className:`text-xs px-1.5 py-0.5 rounded-full ${C?"bg-red-500/10 text-red-500":"bg-muted text-muted-foreground"}`,children:[k,"/",d]}),c]}),(0,t.jsxs)("div",{className:"flex items-center gap-0.5",children:[(0,t.jsx)("button",{onClick:()=>f(!g),className:`p-1.5 rounded-lg transition-colors ${g?"text-foreground bg-muted":"text-muted-foreground hover:text-foreground hover:bg-muted"}`,style:g?{color:"hsl(var(--theme-primary))"}:void 0,title:g?"View formatted":"Edit raw",children:g?(0,t.jsx)(F.Eye,{className:"w-4 h-4"}):(0,t.jsx)(K.Pencil,{className:"w-4 h-4"})}),(0,t.jsx)("button",{onClick:l,className:"p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",title:i?"Unlock editing":"Lock from AI edits",children:i?(0,t.jsx)(P.Lock,{className:"w-4 h-4"}):(0,t.jsx)(D.Unlock,{className:"w-4 h-4"})}),(0,t.jsx)("button",{onClick:()=>{navigator.clipboard.writeText(o),x(!0),setTimeout(()=>x(!1),2e3)},className:"p-1.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-muted",style:p?{color:"hsl(var(--theme-primary))"}:void 0,title:p?"Copied!":"Copy",children:p?(0,t.jsx)(j.Check,{className:"w-4 h-4"}):(0,t.jsx)(w.Copy,{className:"w-4 h-4"})}),(0,t.jsx)("button",{onClick:m,className:"p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",title:"Minimize",children:(0,t.jsx)(E.Minimize2,{className:"w-4 h-4"})})]})]}),(0,t.jsxs)("div",{className:"flex-1 overflow-hidden relative",children:[g?(0,t.jsx)("textarea",{ref:v,value:o,onChange:e=>a(e.target.value),disabled:i,className:`w-full h-full p-4 font-mono text-sm resize-none focus:outline-none ${i?"bg-muted/50 text-muted-foreground cursor-not-allowed":"bg-card text-foreground"}`,style:{lineHeight:"1.6"},spellCheck:!1}):(0,t.jsx)("div",{ref:N,className:`w-full h-full p-4 overflow-y-auto select-text ${i?"bg-muted/30":"bg-card"}`,style:{lineHeight:"1.6"},onMouseUp:S,onTouchEnd:S,children:(0,t.jsx)(er,{content:o,type:e})}),i&&(0,t.jsx)("div",{className:"absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]",children:(0,t.jsxs)("div",{className:"flex items-center gap-2 text-muted-foreground text-sm",children:[(0,t.jsx)(P.Lock,{className:"w-4 h-4"}),(0,t.jsx)("span",{children:"Locked from AI edits"})]})}),y&&h&&(0,t.jsx)(es,{selectedText:y.text,position:y.position,onCopy:()=>{y?.text&&(navigator.clipboard.writeText(y.text),b(null))},onAddToChat:()=>{y?.text&&h&&(h(y.text,e),b(null))},onClose:()=>b(null)})]})]}):(0,t.jsxs)("div",{className:"flex items-center justify-between px-4 py-3 bg-card rounded-2xl border border-border",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("span",{style:{color:"hsl(var(--theme-primary))"},children:(0,t.jsx)(n,{className:"w-4 h-4"})}),(0,t.jsx)("span",{className:"font-semibold text-sm text-foreground",children:s}),(0,t.jsxs)("span",{className:"text-xs text-muted-foreground",children:[k," chars"]})]}),(0,t.jsx)("button",{onClick:m,className:"p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",title:"Expand",children:(0,t.jsx)(M.Maximize2,{className:"w-4 h-4"})})]})}function eo({onTranscription:e,disabled:s}){let n,[o,a]=(0,r.useState)(!1),{isRecording:i,duration:l,audioLevels:d,startRecording:c,stopRecording:u,isSupported:m}=(0,y.useVoiceRecorder)({maxDuration:120}),h=async()=>{if(i){let t=await u();if(t){a(!0);try{let s=new FormData;s.append("audio",t,"recording.webm");let r=await fetch("/api/whisper",{method:"POST",body:s});if(r.ok){let t=await r.json();t.text&&e(t.text)}}catch(e){console.error("Transcription error:",e)}finally{a(!1)}}}else await c()};return m?(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[i&&(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"flex items-center gap-0.5 h-6",children:d.slice(-8).map((e,s)=>(0,t.jsx)("div",{className:"w-1 rounded-full transition-all duration-75",style:{height:`${Math.max(4,24*e)}px`,backgroundColor:"hsl(var(--theme-primary))",opacity:.6+.4*e}},s))}),(0,t.jsx)("span",{className:"text-xs text-muted-foreground tabular-nums",children:(n=Math.floor(l/60),`${n}:${(l%60).toString().padStart(2,"0")}`)})]}),(0,t.jsx)(f.motion.button,{onClick:h,disabled:s||o,whileHover:{scale:1.05},whileTap:{scale:.95},className:`p-3 rounded-full transition-colors ${i?"bg-red-500 text-white":o?"bg-muted text-muted-foreground":"bg-muted text-foreground hover:bg-muted/80"}`,children:o?(0,t.jsx)(S.Loader2,{className:"w-4 h-4 animate-spin"}):i?(0,t.jsx)(C.Square,{className:"w-4 h-4 fill-current"}):(0,t.jsx)(k.Mic,{className:"w-4 h-4"})})]}):null}function ea({onAction:e,isLoading:s}){return(0,t.jsx)("div",{className:"flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-hide",children:Q.map(r=>(0,t.jsxs)("button",{onClick:()=>e(r),disabled:s,className:"flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50",children:[(0,t.jsx)(r.icon,{className:"w-3.5 h-3.5"}),r.label]},r.id))})}function ei({onSelectPreset:e}){let[s,n]=(0,r.useState)(!1),o=(0,r.useRef)(null);(0,r.useEffect)(()=>{function e(e){o.current&&!o.current.contains(e.target)&&n(!1)}return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[]);let a=t=>{e(t),n(!1)};return(0,t.jsxs)("div",{className:"relative",ref:o,children:[(0,t.jsxs)("button",{onClick:()=>n(!s),className:"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors bg-muted text-foreground hover:bg-muted/80",children:[(0,t.jsx)(U.Palette,{className:"w-4 h-4"}),(0,t.jsx)("span",{children:"Presets"}),(0,t.jsx)($.ChevronDown,{className:`w-3.5 h-3.5 transition-transform ${s?"rotate-180":""}`})]}),s&&(0,t.jsxs)(f.motion.div,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},exit:{opacity:0,y:-10},className:"absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-card border border-border rounded-xl shadow-xl z-50",children:[(0,t.jsxs)("button",{onClick:()=>a(J),className:"w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border",children:[(0,t.jsx)("span",{className:"text-lg",children:J.emoji}),(0,t.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,t.jsx)("p",{className:"text-sm font-medium text-foreground",children:J.name}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground truncate",children:J.description})]})]}),[{name:"Kinetic / Rhythmic",ids:["wild-cadence-neo-soul","scatter-swagger","modern-poet"]},{name:"Soul / Introspective",ids:["brazilian-retro-soul","irish-neo-soul","afro-soul-introspection","lofi-soul-confessional","warm-affirmation"]},{name:"Cinematic / Abstract",ids:["abstract-spoken-melody","cinematic-inner-dialogue"]},{name:"Groove / Funk",ids:["minimal-funk"]},{name:"Experimental",ids:["tech-poetry-os"]}].map(e=>(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"px-4 py-2 bg-muted/30",children:(0,t.jsx)("p",{className:"text-xs font-semibold text-muted-foreground uppercase tracking-wide",children:e.name})}),e.ids.map(e=>{let s=q.find(t=>t.id===e);return s?(0,t.jsxs)("button",{onClick:()=>a(s),className:"w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/50 transition-colors",children:[(0,t.jsx)("span",{className:"text-lg",children:s.emoji}),(0,t.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,t.jsx)("p",{className:"text-sm font-medium text-foreground",children:s.name}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground truncate",children:s.description})]})]},s.id):null})]},e.name))]})]})}function el({onSave:e,onLoad:s,onExport:n,currentSessionName:o,onRename:a}){let[i,l]=(0,r.useState)(!1),[d,c]=(0,r.useState)([]),[u,m]=(0,r.useState)(!1),[h,p]=(0,r.useState)(o),x=(0,r.useRef)(null);return(0,r.useEffect)(()=>{c(et())},[i]),(0,r.useEffect)(()=>{let e=e=>{x.current&&!x.current.contains(e.target)&&l(!1)};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[]),(0,t.jsxs)("div",{className:"relative",ref:x,children:[(0,t.jsxs)("button",{onClick:()=>l(!i),className:"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-muted text-foreground hover:bg-muted/80 transition-colors",children:[(0,t.jsx)(z.Save,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"Sessions"})]}),i&&(0,t.jsxs)(f.motion.div,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},className:"absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-xl z-50",children:[(0,t.jsxs)("div",{className:"p-3 border-b border-border",children:[(0,t.jsx)("p",{className:"text-xs text-muted-foreground mb-1",children:"Current Session"}),u?(0,t.jsx)("input",{type:"text",value:h,onChange:e=>p(e.target.value),onBlur:()=>{a(h),m(!1)},onKeyDown:e=>{"Enter"===e.key&&(a(h),m(!1))},className:"w-full px-2 py-1 text-sm bg-muted rounded border-none focus:outline-none focus:ring-1",style:{"--tw-ring-color":"hsl(var(--theme-primary))"},autoFocus:!0}):(0,t.jsx)("p",{className:"text-sm font-medium cursor-pointer hover:text-muted-foreground",onClick:()=>m(!0),children:o||"Untitled Session"})]}),(0,t.jsxs)("div",{className:"p-2 border-b border-border flex gap-2",children:[(0,t.jsxs)("button",{onClick:()=>{e(),l(!1)},className:"flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-muted hover:bg-muted/80 transition-colors",children:[(0,t.jsx)(z.Save,{className:"w-3.5 h-3.5"}),"Save"]}),(0,t.jsxs)("button",{onClick:()=>{n(),l(!1)},className:"flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-muted hover:bg-muted/80 transition-colors",children:[(0,t.jsx)(_.Download,{className:"w-3.5 h-3.5"}),"Export"]})]}),(0,t.jsx)("div",{className:"max-h-48 overflow-y-auto",children:0===d.length?(0,t.jsx)("p",{className:"p-3 text-xs text-muted-foreground text-center",children:"No saved sessions"}):d.map(e=>(0,t.jsxs)("div",{className:"flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors",children:[(0,t.jsxs)("button",{onClick:()=>{s(e),l(!1)},className:"flex-1 text-left",children:[(0,t.jsx)("p",{className:"text-sm font-medium truncate",children:e.name}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:new Date(e.updatedAt).toLocaleDateString()})]}),(0,t.jsx)("button",{onClick:()=>{var t;let s;return t=e.id,void(ee(s=d.filter(e=>e.id!==t)),c(s))},className:"p-1.5 text-muted-foreground hover:text-red-500 transition-colors",children:(0,t.jsx)(R.RotateCcw,{className:"w-3.5 h-3.5"})})]},e.id))})]})]})}function ed({messages:e,onSendMessage:s,onQuickAction:n,isLoading:o,isMinimized:a,onToggleMinimize:i}){let[l,d]=(0,r.useState)(""),c=(0,r.useRef)(null),u=(0,r.useRef)(null),m=(0,r.useCallback)(()=>{c.current?.scrollIntoView({behavior:"smooth"})},[]);(0,r.useEffect)(()=>{m()},[e,m]);let h=()=>{l.trim()&&!o&&(s(l.trim()),d(""))};return a?(0,t.jsxs)("div",{className:"flex items-center justify-between p-3 bg-card rounded-2xl border border-border",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-8 h-8 rounded-full flex items-center justify-center",style:{backgroundColor:"hsl(var(--theme-primary))"},children:(0,t.jsx)(b.Music4,{className:"w-4 h-4 text-white"})}),(0,t.jsx)("span",{className:"text-sm font-medium text-foreground",children:"Claw AI"}),e.length>1&&(0,t.jsxs)("span",{className:"text-xs text-muted-foreground",children:[e.length-1," messages"]})]}),(0,t.jsx)("button",{onClick:i,className:"p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",children:(0,t.jsx)(M.Maximize2,{className:"w-4 h-4"})})]}):(0,t.jsxs)("div",{className:"flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-8 h-8 rounded-full flex items-center justify-center",style:{backgroundColor:"hsl(var(--theme-primary))"},children:(0,t.jsx)(b.Music4,{className:"w-4 h-4 text-white"})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-foreground font-semibold text-sm",children:"Claw AI"}),(0,t.jsx)("p",{className:"text-muted-foreground text-xs",children:"Suno Architect"})]})]}),(0,t.jsx)("button",{onClick:i,className:"p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",children:(0,t.jsx)(E.Minimize2,{className:"w-4 h-4"})})]}),(0,t.jsx)("div",{className:"px-3 border-b border-border",children:(0,t.jsx)(ea,{onAction:n,isLoading:o})}),(0,t.jsxs)("div",{className:"flex-1 overflow-y-auto p-4 space-y-3",children:[e.map(e=>(0,t.jsx)(f.motion.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:`flex ${"user"===e.role?"justify-end":"justify-start"}`,children:(0,t.jsxs)("div",{className:`max-w-[85%] rounded-2xl px-4 py-3 ${"user"===e.role?"":"bg-muted text-foreground"}`,style:"user"===e.role?{backgroundColor:"hsl(var(--theme-primary) / 0.15)",color:"hsl(var(--theme-primary))"}:void 0,children:[e.isVoice&&"user"===e.role&&(0,t.jsxs)("div",{className:"flex items-center gap-1.5 mb-1 text-xs opacity-70",children:[(0,t.jsx)(k.Mic,{className:"w-3 h-3"}),(0,t.jsx)("span",{children:"Voice"})]}),e.reference&&(0,t.jsxs)("div",{className:"mb-2 p-2 rounded-lg border-l-2 bg-muted/50",style:{borderColor:"hsl(var(--theme-primary))"},children:[(0,t.jsx)("div",{className:"flex items-center gap-1.5 mb-1",children:(0,t.jsx)("span",{className:"text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded",style:{backgroundColor:"hsl(var(--theme-primary) / 0.15)",color:"hsl(var(--theme-primary))"},children:e.reference.source})}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground italic line-clamp-3",children:['"',e.reference.text,'"']})]}),(0,t.jsx)("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",children:e.content})]})},e.id)),o&&(0,t.jsx)(f.motion.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:"flex justify-start",children:(0,t.jsx)("div",{className:"bg-muted rounded-2xl px-4 py-3",children:(0,t.jsxs)("div",{className:"flex gap-1",children:[(0,t.jsx)("span",{className:"w-2 h-2 rounded-full animate-bounce",style:{backgroundColor:"hsl(var(--theme-primary) / 0.6)",animationDelay:"0ms"}}),(0,t.jsx)("span",{className:"w-2 h-2 rounded-full animate-bounce",style:{backgroundColor:"hsl(var(--theme-primary) / 0.6)",animationDelay:"150ms"}}),(0,t.jsx)("span",{className:"w-2 h-2 rounded-full animate-bounce",style:{backgroundColor:"hsl(var(--theme-primary) / 0.6)",animationDelay:"300ms"}})]})})}),(0,t.jsx)("div",{ref:c})]}),(0,t.jsx)("div",{className:"p-3 border-t border-border",children:(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("input",{ref:u,type:"text",value:l,onChange:e=>d(e.target.value),onKeyDown:e=>{"Enter"!==e.key||e.shiftKey||(e.preventDefault(),h())},placeholder:"Describe your song vision...",className:"flex-1 bg-muted rounded-full px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2",style:{"--tw-ring-color":"hsl(var(--theme-primary) / 0.3)"},disabled:o}),(0,t.jsx)(eo,{onTranscription:e=>{s(e,!0)},disabled:o}),(0,t.jsx)(f.motion.button,{onClick:h,disabled:!l.trim()||o,whileHover:{scale:1.05},whileTap:{scale:.95},className:`p-3 rounded-full transition-colors ${l.trim()&&!o?"":"bg-muted text-muted-foreground"}`,style:l.trim()&&!o?{background:"linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)",color:"white"}:void 0,children:(0,t.jsx)(N.Send,{className:"w-4 h-4"})})]})})]})}function ec(){let{activeStylePrompt:e,activeLyricsPrompt:s,updateStylePrompt:n,updateLyricsPrompt:o,createStylePrompt:a,createLyricsPrompt:i}=function(){let e=(0,r.useContext)(x);if(!e)throw Error("useCowrite must be used within a CowriteProvider");return e}(),[l,d]=(0,r.useState)([{id:"1",role:"assistant",content:"Hey! I'm here to help you craft the perfect Suno prompts. Drop your concept, mood, or rough lyrics, and I'll help shape them into polished Style and Lyrics prompts. Both artifacts on the right update in real-time as we work."}]),[c,u]=(0,r.useState)(!1),[m,h]=(0,r.useState)(!1),[p,g]=(0,r.useState)(!1),[f,y]=(0,r.useState)(!0),[w,j]=(0,r.useState)(!0),[N,S]=(0,r.useState)("chat"),[k,C]=(0,r.useState)([]),[E,M]=(0,r.useState)(-1),[I,O]=(0,r.useState)(!1),[T,A]=(0,r.useState)("Untitled Session"),[L,P]=(0,r.useState)(()=>Date.now().toString()),D=(0,r.useRef)(""),U=(0,r.useRef)("");(0,r.useEffect)(()=>{let t=e?.content||"",r=s?.content||"";if(I){O(!1),D.current=t,U.current=r;return}if(t!==D.current||r!==U.current){if(""!==D.current||""!==U.current){let e=k.slice(0,E+1);e.push({styleContent:t,lyricsContent:r}),e.length>50&&e.shift(),C(e),M(e.length-1)}D.current=t,U.current=r}},[e?.content,s?.content,k,E,I]);let $=(0,r.useCallback)(()=>{if(E>0){let t=k[E-1];O(!0),e&&n(e.id,{content:t.styleContent}),s&&o(s.id,{content:t.lyricsContent}),M(E-1)}},[k,E,e,s,n,o]),K=(0,r.useCallback)(()=>{if(E<k.length-1){let t=k[E+1];O(!0),e&&n(e.id,{content:t.styleContent}),s&&o(s.id,{content:t.lyricsContent}),M(E+1)}},[k,E,e,s,n,o]),F=(0,r.useCallback)(()=>{let t={id:L,name:T,styleContent:e?.content||"",lyricsContent:s?.content||"",messages:l,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},r=et(),n=r.findIndex(e=>e.id===L);n>=0?r[n]=t:r.unshift(t),ee(r),localStorage.setItem(X,JSON.stringify(t))},[L,T,e?.content,s?.content,l]),_=(0,r.useCallback)(t=>{P(t.id),A(t.name),d(t.messages),e&&n(e.id,{content:t.styleContent}),s&&o(s.id,{content:t.lyricsContent}),C([]),M(-1)},[e,s,n,o]),z=(0,r.useCallback)(()=>{var t,r;let n,o,a,i,l;n=e?.content||"",o=s?.content||"",t=`# CoWrite Session Export
Generated: ${new Date().toLocaleString()}

## Style Prompt
\`\`\`
${n}
\`\`\`

## Lyrics Prompt
\`\`\`
${o}
\`\`\`
`,r=T.replace(/\s+/g,"_"),a=new Blob([t],{type:"text/plain;charset=utf-8"}),i=URL.createObjectURL(a),(l=document.createElement("a")).href=i,l.download=`${r}.md`,document.body.appendChild(l),l.click(),document.body.removeChild(l),URL.revokeObjectURL(i)},[e?.content,s?.content,T]);!function({onUndo:e,onRedo:t,onSave:s,onExport:n,canUndo:o,canRedo:a}){(0,r.useEffect)(()=>{let r=r=>{let i=navigator.platform.toUpperCase().indexOf("MAC")>=0?r.metaKey:r.ctrlKey;i&&"z"===r.key&&!r.shiftKey&&o?(r.preventDefault(),e()):i&&"z"===r.key&&r.shiftKey&&a||i&&"y"===r.key&&a?(r.preventDefault(),t()):i&&"s"===r.key?(r.preventDefault(),s()):i&&"e"===r.key&&(r.preventDefault(),n())};return window.addEventListener("keydown",r),()=>window.removeEventListener("keydown",r)},[e,t,s,n,o,a])}({onUndo:$,onRedo:K,onSave:F,onExport:z,canUndo:E>0,canRedo:E<k.length-1}),(0,r.useEffect)(()=>{let e,t=(e=localStorage.getItem(X))?JSON.parse(e):null;t&&(P(t.id),A(t.name))},[]),(0,r.useEffect)(()=>{e||a(),s||i()},[e,s,a,i]);let q=(0,r.useCallback)(t=>{let r=!1,a=!1;if(!m&&e)for(let s of[/```style\n?([\s\S]*?)```/i,/```(?:style prompt)?\n?(\[Is_Max_Mode[\s\S]*?)```/i,/STYLE PROMPT:?\s*```\n?([\s\S]*?)```/i]){let o=t.match(s);if(o&&o[1]){let t=o[1].trim();if(t.includes("[Is_Max_Mode")||t.includes("GENRE")){n(e.id,{content:t}),r=!0;break}}}if(!p&&s)for(let e of[/```lyrics\n?([\s\S]*?)```/i,/```(?:lyrics prompt)?\n?(\/\|\[\/\*{3}\/\/\/[\s\S]*?)```/i,/```(?:lyrics prompt)?\n?(\[(?:INTRO|VERSE|HOOK|CHORUS)[\s\S]*?)```/i,/LYRICS PROMPT:?\s*```\n?([\s\S]*?)```/i]){let r=t.match(e);if(r&&r[1]){let e=r[1].trim();if(e.includes("[VERSE")||e.includes("[HOOK")||e.includes("[INTRO")||e.includes("/|/")){o(s.id,{content:e}),a=!0;break}}}return{styleUpdated:r,lyricsUpdated:a}},[e,s,n,o,m,p]),J=async(t,r=!1)=>{let n={id:Date.now().toString(),role:"user",content:t,isVoice:r};d(e=>[...e,n]),u(!0);try{let r,n=`
CURRENT STYLE PROMPT${m?" (LOCKED - DO NOT MODIFY)":""}:
\`\`\`
${e?.content||"No style prompt yet"}
\`\`\`

CURRENT LYRICS PROMPT${p?" (LOCKED - DO NOT MODIFY)":""}:
\`\`\`
${s?.content||"No lyrics yet"}
\`\`\`

IMPORTANT: Always output the complete, updated prompts in code blocks. Use \`\`\`style and \`\`\`lyrics labels. The user sees both artifacts update in real-time.
`,o=`${W}

${n}

REFINEMENT INSTRUCTIONS:
- When the user provides rough material, normalize it immediately into proper format
- Style prompts must start with MAX MODE headers
- Lyrics prompts should have proper section tags in []
- Output BOTH complete prompts after every edit, even small changes
- Never output partial prompts - always the full artifact
- Label code blocks clearly: \`\`\`style and \`\`\`lyrics
- Respect locked prompts - do not modify them`,a=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:o},...l.slice(-10).map(e=>({role:e.role,content:e.content})),{role:"user",content:t}],model:"cowrite"})});a.ok?(r=(await a.json()).message||"I couldn't process that. Could you try again?",q(r)):r="I'm having trouble connecting. Please try again.";let i={id:(Date.now()+1).toString(),role:"assistant",content:r};d(e=>[...e,i])}catch(t){console.error("Chat error:",t);let e={id:(Date.now()+1).toString(),role:"assistant",content:"Something went wrong. Let's try that again."};d(t=>[...t,e])}u(!1)},Q=e=>{J(e.prompt)},Z=t=>{e&&n(e.id,{content:t})},es=e=>{s&&o(s.id,{content:e})},er=t=>{if(e){var s;let r=(s=t.content).includes("[Is_Max_Mode:Max]")?s:`${G}

${s}`;n(e.id,{content:r})}},eo=(e,t)=>{let s={id:Date.now().toString(),role:"user",content:"Edit this section:",reference:{text:e,source:t}};d(e=>[...e,s]),S("chat")};return(0,t.jsx)("div",{className:"min-h-screen bg-background text-foreground",children:(0,t.jsxs)("div",{className:"flex flex-col h-screen",children:[(0,t.jsxs)("header",{className:"flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:"w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg",style:{background:"linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)",boxShadow:"0 4px 14px hsl(var(--theme-primary) / 0.3)"},children:(0,t.jsx)(b.Music4,{className:"w-5 h-5 text-white"})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-lg font-bold text-foreground",children:"CoWrite"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Suno Prompt Studio"})]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1 sm:gap-2",children:[(0,t.jsxs)("div",{className:"hidden sm:flex items-center gap-1 mr-2",children:[(0,t.jsx)("button",{onClick:$,disabled:E<=0,className:"p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed",title:"Undo (Cmd+Z)",children:(0,t.jsx)(B.default,{className:"w-4 h-4"})}),(0,t.jsx)("button",{onClick:K,disabled:E>=k.length-1,className:"p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed",title:"Redo (Cmd+Shift+Z)",children:(0,t.jsx)(H.default,{className:"w-4 h-4"})})]}),(0,t.jsx)(el,{onSave:F,onLoad:_,onExport:z,currentSessionName:T,onRename:A}),(0,t.jsxs)("button",{onClick:()=>{d([{id:"1",role:"assistant",content:"Fresh start! What song would you like to create?"}]),P(Date.now().toString()),A("Untitled Session"),C([]),M(-1)},className:"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-muted text-foreground hover:bg-muted/80 transition-colors",children:[(0,t.jsx)(R.RotateCcw,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"Reset"})]})]})]}),(0,t.jsx)("div",{className:"lg:hidden flex border-b border-border bg-card",children:[{id:"lyrics",label:"Lyrics",icon:V.FileText},{id:"style",label:"Style",icon:b.Music4},{id:"chat",label:"Chat",icon:Y.MessageSquare}].map(e=>(0,t.jsxs)("button",{onClick:()=>S(e.id),className:`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${N===e.id?"text-foreground border-b-2":"text-muted-foreground"}`,style:N===e.id?{borderColor:"hsl(var(--theme-primary))"}:void 0,children:[(0,t.jsx)(e.icon,{className:"w-4 h-4"}),e.label]},e.id))}),(0,t.jsxs)("main",{className:"flex-1 overflow-hidden p-4",children:[(0,t.jsxs)("div",{className:"lg:hidden h-full",children:["lyrics"===N&&(0,t.jsx)("div",{className:"h-full",children:(0,t.jsx)(en,{type:"lyrics",title:"LYRICS",icon:v.Mic2,content:s?.content||"",onChange:es,isLocked:p,onToggleLock:()=>g(!p),charLimit:5e3,isExpanded:!0,onToggleExpand:()=>{},onAddToChat:eo})}),"style"===N&&(0,t.jsx)("div",{className:"h-full",children:(0,t.jsx)(en,{type:"style",title:"STYLE",icon:b.Music4,content:e?.content||"",onChange:Z,isLocked:m,onToggleLock:()=>h(!m),charLimit:1e3,headerExtra:(0,t.jsx)(ei,{onSelectPreset:er}),isExpanded:!0,onToggleExpand:()=>{},onAddToChat:eo})}),"chat"===N&&(0,t.jsx)("div",{className:"h-full",children:(0,t.jsx)(ed,{messages:l,onSendMessage:J,onQuickAction:Q,isLoading:c,isMinimized:!1,onToggleMinimize:()=>{}})})]}),(0,t.jsxs)("div",{className:"hidden lg:grid h-full grid-cols-4 gap-4",children:[(0,t.jsx)("div",{className:"col-span-2 flex flex-col min-h-0",children:(0,t.jsx)(en,{type:"lyrics",title:"LYRICS",icon:v.Mic2,content:s?.content||"",onChange:es,isLocked:p,onToggleLock:()=>g(!p),charLimit:5e3,isExpanded:w,onToggleExpand:()=>j(!w),onAddToChat:eo})}),(0,t.jsxs)("div",{className:"col-span-2 flex flex-col gap-4 min-h-0",children:[(0,t.jsx)("div",{className:f?"flex-1 min-h-0":"",children:(0,t.jsx)(en,{type:"style",title:"STYLE",icon:b.Music4,content:e?.content||"",onChange:Z,isLocked:m,onToggleLock:()=>h(!m),charLimit:1e3,headerExtra:(0,t.jsx)(ei,{onSelectPreset:er}),onAddToChat:eo,isExpanded:f,onToggleExpand:()=>y(!f)})}),(0,t.jsx)("div",{className:"flex-1 min-h-0",children:(0,t.jsx)(ed,{messages:l,onSendMessage:J,onQuickAction:Q,isLoading:c,isMinimized:!1,onToggleMinimize:()=>{}})})]})]})]})]})})}function eu(){return(0,t.jsx)(s.PageTransition,{children:(0,t.jsx)(g,{children:(0,t.jsx)(ec,{})})})}e.s(["default",()=>eu],851160)}]);