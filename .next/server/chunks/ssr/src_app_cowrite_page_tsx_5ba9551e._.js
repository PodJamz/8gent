module.exports=[571509,a=>{"use strict";var b=a.i(499969);a.i(617620);var c=a.i(617864),d=a.i(863050);let e="openclaw.cowrite.stylePrompts",f="openclaw.cowrite.lyricsPrompts",g="openclaw.cowrite.sessions",h="openclaw.cowrite.activeStylePromptId",i="openclaw.cowrite.activeLyricsPromptId",j="openclaw.cowrite.activeSessionId",k="openclaw.cowrite.activeTab",l={id:"default-style",name:"Starter Style",content:`[Is_Max_Mode:Max]
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
(fade with ambient pads and gentle hum)`,stylePromptId:"default-style",version:1,parentVersionId:null,createdAt:Date.now(),updatedAt:Date.now()};function n(){return`${Date.now()}-${Math.random().toString(36).substr(2,9)}`}function o(a,b){if(!a)return b;try{return JSON.parse(a)}catch{return b}}let p=(0,d.createContext)(null);function q({children:a}){let[c,q]=(0,d.useState)([]),[r,s]=(0,d.useState)([]),[t,u]=(0,d.useState)([]),[v,w]=(0,d.useState)(null),[x,y]=(0,d.useState)(null),[z,A]=(0,d.useState)(null),[B,C]=(0,d.useState)("lyrics"),[D,E]=(0,d.useState)(!1),[F,G]=(0,d.useState)(!1);(0,d.useEffect)(()=>{let a=o(localStorage.getItem(e),[]),b=o(localStorage.getItem(f),[]),c=o(localStorage.getItem(g),[]),d=localStorage.getItem(h),n=localStorage.getItem(i),p=localStorage.getItem(j),r=localStorage.getItem(k);0===a.length?(q([l]),w(l.id)):(q(a),d&&w(d)),0===b.length?(s([m]),y(m.id)):(s(b),n&&y(n)),u(c),p&&A(p),r&&C(r),G(!0)},[]),(0,d.useEffect)(()=>{F&&localStorage.setItem(e,JSON.stringify(c))},[c,F]),(0,d.useEffect)(()=>{F&&localStorage.setItem(f,JSON.stringify(r))},[r,F]),(0,d.useEffect)(()=>{F&&localStorage.setItem(g,JSON.stringify(t))},[t,F]),(0,d.useEffect)(()=>{F&&(v?localStorage.setItem(h,v):localStorage.removeItem(h))},[v,F]),(0,d.useEffect)(()=>{F&&(x?localStorage.setItem(i,x):localStorage.removeItem(i))},[x,F]),(0,d.useEffect)(()=>{F&&(z?localStorage.setItem(j,z):localStorage.removeItem(j))},[z,F]),(0,d.useEffect)(()=>{F&&localStorage.setItem(k,B)},[B,F]);let H=(0,d.useCallback)((a="Untitled Style",b="")=>{let c={id:n(),name:a,content:b||`[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]

GENRE:
TEMPO:
VOCALS:
CADENCE:
INSTRUMENTATION:
MOOD: `,isFavorite:!1,createdAt:Date.now(),updatedAt:Date.now()};return q(a=>[c,...a]),w(c.id),c},[]),I=(0,d.useCallback)((a,b)=>{q(c=>c.map(c=>c.id===a?{...c,...b,updatedAt:Date.now()}:c))},[]),J=(0,d.useCallback)(a=>{q(b=>b.filter(b=>b.id!==a)),w(b=>b===a?null:b)},[]),K=(0,d.useCallback)(a=>{let b=c.find(b=>b.id===a);if(!b)return null;let d={...b,id:n(),name:`${b.name} (Copy)`,isFavorite:!1,createdAt:Date.now(),updatedAt:Date.now()};return q(a=>[d,...a]),w(d.id),d},[c]),L=(0,d.useCallback)(a=>{q(b=>b.map(b=>b.id===a?{...b,isFavorite:!b.isFavorite,updatedAt:Date.now()}:b))},[]),M=(0,d.useCallback)((a="Untitled Lyrics",b="",c=null)=>{let d={id:n(),name:a,content:b||`/|/***///

[INTRO]

[VERSE 1]

[PRE-HOOK]

[HOOK]

[VERSE 2]

[HOOK]

[BRIDGE]

[FINAL HOOK]

[OUTRO]`,stylePromptId:c??v,version:1,parentVersionId:null,createdAt:Date.now(),updatedAt:Date.now()};return s(a=>[d,...a]),y(d.id),d},[v]),N=(0,d.useCallback)((a,b)=>{s(c=>c.map(c=>c.id===a?{...c,...b,updatedAt:Date.now()}:c))},[]),O=(0,d.useCallback)(a=>{s(b=>b.filter(b=>b.id!==a)),y(b=>b===a?null:b)},[]),P=(0,d.useCallback)(a=>{let b=r.find(b=>b.id===a);if(!b)return null;let c={...b,id:n(),name:`${b.name} (Copy)`,version:1,parentVersionId:null,createdAt:Date.now(),updatedAt:Date.now()};return s(a=>[c,...a]),y(c.id),c},[r]),Q=(0,d.useCallback)((a,b)=>{let c=r.find(b=>b.id===a);if(!c)return null;let d={...c,id:n(),content:b,version:c.version+1,parentVersionId:c.id,createdAt:Date.now(),updatedAt:Date.now()};return s(a=>[d,...a]),y(d.id),d},[r]),R=(0,d.useCallback)(a=>{let b=r.find(b=>b.id===a);if(!b)return[];let c=b;for(;c.parentVersionId;){let a=r.find(a=>a.id===c.parentVersionId);if(a)c=a;else break}let d=[c],e=a=>{for(let b of r.filter(b=>b.parentVersionId===a))d.push(b),e(b.id)};return e(c.id),d.sort((a,b)=>a.version-b.version)},[r]),S=(0,d.useCallback)((a="Untitled Session")=>{let b={id:n(),name:a,stylePromptId:v,lyricsPromptId:x,createdAt:Date.now(),updatedAt:Date.now()};return u(a=>[b,...a]),A(b.id),b},[v,x]),T=(0,d.useCallback)((a,b)=>{u(c=>c.map(c=>c.id===a?{...c,...b,updatedAt:Date.now()}:c))},[]),U=(0,d.useCallback)(a=>{u(b=>b.filter(b=>b.id!==a)),A(b=>b===a?null:b)},[]),V=(0,d.useCallback)(a=>{w(a)},[]),W=(0,d.useCallback)(a=>{y(a)},[]),X=(0,d.useCallback)(a=>{A(a);let b=t.find(b=>b.id===a);b&&(b.stylePromptId&&w(b.stylePromptId),b.lyricsPromptId&&y(b.lyricsPromptId))},[t]),Y=(0,d.useCallback)(()=>E(!0),[]),Z=(0,d.useCallback)(()=>E(!1),[]),$=(0,d.useCallback)(()=>E(a=>!a),[]),_=c.find(a=>a.id===v)??null,aa=r.find(a=>a.id===x)??null,ab=t.find(a=>a.id===z)??null,ac=c.filter(a=>a.isFavorite).sort((a,b)=>b.updatedAt-a.updatedAt);return(0,b.jsx)(p.Provider,{value:{stylePrompts:c,lyricsPrompts:r,sessions:t,activeStylePromptId:v,activeLyricsPromptId:x,activeSessionId:z,activeTab:B,isChatOpen:D,createStylePrompt:H,updateStylePrompt:I,deleteStylePrompt:J,duplicateStylePrompt:K,toggleFavoriteStyle:L,createLyricsPrompt:M,updateLyricsPrompt:N,deleteLyricsPrompt:O,duplicateLyricsPrompt:P,createLyricsVersion:Q,getLyricsVersionHistory:R,createSession:S,updateSession:T,deleteSession:U,selectStylePrompt:V,selectLyricsPrompt:W,selectSession:X,setActiveTab:C,openChat:Y,closeChat:Z,toggleChat:$,activeStylePrompt:_,activeLyricsPrompt:aa,activeSession:ab,favoriteStylePrompts:ac},children:a})}var r=a.i(567031),s=a.i(347694),t=a.i(529973),u=a.i(803410),v=a.i(476012),w=a.i(885275),x=a.i(496760),y=a.i(662482),z=a.i(422720),A=a.i(588655),B=a.i(967965),C=a.i(253177),D=a.i(310657),E=a.i(915936),F=a.i(128002),G=a.i(760084),H=a.i(745682),I=a.i(728660),J=a.i(41783),K=a.i(28120),L=a.i(368277),M=a.i(683560),N=a.i(783690),O=a.i(327428),P=a.i(172777),Q=a.i(149605),R=a.i(292606),S=a.i(474064),T=a.i(451056),T=T,U=a.i(528471),U=U;let V=`You are an AI-native songwriting and arrangement assistant designed specifically for Suno.

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
Build with intention.`,W=`[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]`,X=[{id:"wild-cadence-neo-soul",name:"Wild Cadence / Neo-Soul Hybrid",emoji:"⚡",description:"Percussive sing-talk with elastic, jittery rhythm",content:"Male Irish lead. Close-mic. Percussive sing-talk with elastic, jittery rhythm. Voice as drum. Crisp consonants, clipped endings, minimal vibrato. Off-kilter push-pull timing, micro-pauses, sudden stops. Neo-soul with Brazilian rhythmic undercurrent. Minimal groove, space-forward. Calm surface, simmering bite. Slight swagger. No belting."},{id:"brazilian-retro-soul",name:"Brazilian Retro-Soul",emoji:"🌃",description:"Late night Rio, smoky baritone, intimate storytelling",content:"Male deep baritone. Smoky, warm, gravelly. Conversational phrasing. Afro-Brazilian groove with semba swing, thumb bass, rim clicks, pandeiro. Rhodes, muted trumpet, bari sax stabs. Small-room warmth. Loose but intentional. Intimate storytelling."},{id:"irish-neo-soul",name:"Irish Neo-Soul Storyteller",emoji:"🍀",description:"Reflective, grounded, talking truth quietly",content:"Male Irish lead, reflective and grounded. Clear diction, emotional restraint. Neo-soul with subtle folk undertones. Guitar-led, warm bass, brushed drums. Melodic but understated. Feels like talking truth quietly rather than performing."},{id:"abstract-spoken-melody",name:"Abstract Spoken-Melody",emoji:"🌀",description:"Future monologue, philosophical, no hooks",content:"Male lead. Rhythmic speak-sing, half-spoken melody. Sparse production, negative space. Tempo slow-mid. Voice front and center. Philosophical, observational tone. No hooks, evolving flow. Minimal harmony, maximum intention."},{id:"scatter-swagger",name:"Scatter Swagger",emoji:"🎤",description:"Playful syncopated flow, humor baked in",content:"Male lead with playful confidence. Syncopated rap-adjacent flow, unpredictable phrasing, humor baked in. Quick pivots, internal rhymes, conversational asides. Funk-leaning beat. Light bravado without aggression."},{id:"minimal-funk",name:"Minimal Funk / Pocket Discipline",emoji:"🎸",description:"Tight pocket, groove does the talking",content:"Male baritone. Tight pocket, behind-the-beat delivery. Funk bass, clean guitar, minimal drums. Short phrases, restraint over flash. Groove does the talking. Repetition used as power."},{id:"afro-soul-introspection",name:"Afro-Soul Introspection",emoji:"🌍",description:"Warm, introspective, mantra-like hooks",content:"Male lead, warm and introspective. Afro-influenced rhythms, rolling percussion, gentle syncopation. Emotional clarity without melodrama. Hooks are subtle, mantra-like. Organic and grounded."},{id:"cinematic-inner-dialogue",name:"Cinematic Inner Dialogue",emoji:"🎬",description:"Slow build, internal narration, emotional payoff",content:"Male lead, intimate and restrained. Slow build, cinematic chords, low drums. Lyrics feel like internal narration. Sparse verses, swelling sections, emotional payoff without climax shouting."},{id:"lofi-soul-confessional",name:"Lo-Fi Soul Confessional",emoji:"💔",description:"Close and imperfect, vulnerability as texture",content:"Male lead, close and imperfect. Slight grit, breath audible. Lo-fi textures, soft keys, vinyl warmth. Conversational melodies. Vulnerability as texture, not drama."},{id:"modern-poet",name:"Modern Poet / Beat-First",emoji:"📝",description:"Voice as rhythm instrument, intelligent feel",content:"Male lead. Voice treated as rhythm instrument first, melody second. Short lines, clipped phrases. Experimental groove. Silence used deliberately. Intelligent, contemporary feel."},{id:"warm-affirmation",name:"Warm Affirmation Groove",emoji:"☀️",description:"Reassuring, comforting, understated optimism",content:"Male lead, reassuring tone. Mid-tempo soul groove. Simple, repetitive lyrical structure. Comforting energy, understated optimism. Feels like someone steadying you rather than hyping you."},{id:"tech-poetry-os",name:"Experimental OS / Tech-Poetry",emoji:"💻",description:"Abstract futuristic, glitch-adjacent but musical",content:"Male lead. Abstract, futuristic lyrical themes. Rhythmic spoken melody. Glitch-adjacent but musical. Clean low-end, minimal synths, mechanical pulse softened by soul phrasing."}],Y={id:"blank",name:"Blank Canvas",emoji:"📝",description:"Start from scratch",content:`Male lead. [Describe voice qualities]

[Describe groove/instrumentation]

[Describe mood/feel]`},Z=[{id:"tighten",label:"Tighten",icon:E.Scissors,prompt:"Make the current prompts more sparse and concise. Remove unnecessary words. Add more space and pauses. Keep the core message but use fewer words.",target:"both"},{id:"expand",label:"Expand",icon:F.Plus,prompt:"Expand the current prompts. Add more verses, develop the themes further, and make the song longer while maintaining the style and voice.",target:"lyrics"},{id:"reorder",label:"Reorder",icon:G.ArrowUpDown,prompt:"Fix the chronology and reorder the sections for better narrative flow. Do not rewrite the bars, just rearrange the structure.",target:"lyrics"},{id:"sanity",label:"Check",icon:H.AlertCircle,prompt:"Review the current prompts for any issues: facts, names, pronunciation problems, character limits, or formatting errors. Fix any problems found.",target:"both"},{id:"darker",label:"Darker",icon:I.Wand2,prompt:"Make the tone darker and more intense. Adjust both the style and lyrics to be more moody, atmospheric, and emotionally heavy.",target:"both"}],$=a=>{},_=()=>[];function aa({selectedText:a,position:c,onCopy:e,onAddToChat:f,onClose:g}){let h=(0,d.useRef)(null);return((0,d.useEffect)(()=>{let a=a=>{h.current&&!h.current.contains(a.target)&&g()};return document.addEventListener("mousedown",a),()=>document.removeEventListener("mousedown",a)},[g]),a)?(0,b.jsxs)(r.motion.div,{ref:h,initial:{opacity:0,y:4},animate:{opacity:1,y:0},exit:{opacity:0,y:4},className:"fixed z-50 flex items-center gap-1 p-1 bg-card border border-border rounded-lg shadow-xl",style:{left:Math.max(8,Math.min(c.x-60,window.innerWidth-140)),top:Math.max(8,c.y-44)},children:[(0,b.jsxs)("button",{onClick:e,className:"flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-muted transition-colors text-foreground",children:[(0,b.jsx)(v.Copy,{className:"w-3.5 h-3.5"}),"Copy"]}),(0,b.jsx)("div",{className:"w-px h-4 bg-border"}),(0,b.jsxs)("button",{onClick:f,className:"flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-muted transition-colors",style:{color:"hsl(var(--theme-primary))"},children:[(0,b.jsx)(P.MessageSquare,{className:"w-3.5 h-3.5"}),"Add to Chat"]})]}):null}function ab({content:a,type:c}){return(0,b.jsx)("article",{className:"space-y-0",children:(()=>{if(!a)return(0,b.jsx)("p",{className:"text-muted-foreground italic text-sm",children:"style"===c?"No style prompt yet...":"No lyrics yet..."});let d=a.split("\n"),e=[];return d.forEach((a,d)=>{let f=a.trim();if(!f)return void e.push((0,b.jsx)("div",{className:"h-2"},d));let g=f.match(/^\[([A-Za-z_]+):([A-Za-z]+)\]$/);if(g)return void e.push((0,b.jsxs)("div",{className:"flex items-center gap-2 py-1",children:[(0,b.jsx)("span",{className:"text-xs font-medium text-muted-foreground",children:g[1].replace(/_/g," ")}),(0,b.jsx)("span",{className:"text-xs font-semibold text-foreground",children:g[2]})]},d));let h=f.match(/^\[([A-Z0-9\s-]+)\]$/);if(h){let a=h[1];e.push((0,b.jsxs)("div",{className:"flex items-center gap-3 mt-6 mb-3 first:mt-0",children:[(0,b.jsx)("div",{className:"h-px flex-1 max-w-8",style:{backgroundColor:"hsl(var(--theme-primary) / 0.3)"}}),(0,b.jsx)("span",{className:"text-xs font-semibold uppercase tracking-widest",style:{color:"hsl(var(--theme-primary))"},children:a}),(0,b.jsx)("div",{className:"h-px flex-1",style:{backgroundColor:"hsl(var(--theme-primary) / 0.3)"}})]},d));return}if(f.includes("/|/***///")||f.match(/^\/\|\/\*+\/\/\/$/))return void e.push((0,b.jsx)("div",{className:"flex items-center justify-center py-3 my-2",children:(0,b.jsx)("span",{className:"text-xs text-muted-foreground/50 tracking-[0.3em]",children:"✦ ✦ ✦"})},d));if(/\[[^\]]+\]/.test(f)&&!h&&!g&&"lyrics"===c){let a=f.split(/(\[[^\]]+\])/g);e.push((0,b.jsx)("p",{className:"text-sm leading-7 text-foreground",children:a.map((a,c)=>a.match(/^\[[^\]]+\]$/)?(0,b.jsx)("span",{className:"inline-flex items-center mx-0.5 px-1.5 py-0.5 rounded-md text-xs bg-muted text-muted-foreground",children:a.slice(1,-1)},c):(0,b.jsx)("span",{children:a},c))},d));return}"style"!==c||g?e.push((0,b.jsx)("p",{className:"text-sm leading-7 text-foreground",children:a||" "},d)):e.push((0,b.jsx)("p",{className:"text-sm leading-7 text-foreground",children:f},d))}),e})()})}function ac({type:a,title:c,icon:e,content:f,onChange:g,isLocked:h,onToggleLock:i,charLimit:j,headerExtra:k,isExpanded:l,onToggleExpand:m,onAddToChat:n}){let[o,p]=(0,d.useState)(!1),[q,r]=(0,d.useState)(!1),[s,t]=(0,d.useState)(null),u=(0,d.useRef)(null),x=(0,d.useRef)(null),y=(0,d.useCallback)(()=>{let a=window.getSelection()?.toString().trim();if(a&&a.length>0){let b=window.getSelection();if(b&&b.rangeCount>0){let c=b.getRangeAt(0).getBoundingClientRect();t({text:a,position:{x:c.left+c.width/2,y:c.top}})}}},[]),z=f.length,A=z>j;return((0,d.useEffect)(()=>{q&&u.current&&u.current.focus()},[q]),l)?(0,b.jsxs)("div",{className:"flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)("span",{style:{color:"hsl(var(--theme-primary))"},children:(0,b.jsx)(e,{className:"w-4 h-4"})}),(0,b.jsx)("span",{className:"font-semibold text-sm text-foreground",children:c}),(0,b.jsxs)("span",{className:`text-xs px-1.5 py-0.5 rounded-full ${A?"bg-red-500/10 text-red-500":"bg-muted text-muted-foreground"}`,children:[z,"/",j]}),k]}),(0,b.jsxs)("div",{className:"flex items-center gap-0.5",children:[(0,b.jsx)("button",{onClick:()=>r(!q),className:`p-1.5 rounded-lg transition-colors ${q?"text-foreground bg-muted":"text-muted-foreground hover:text-foreground hover:bg-muted"}`,style:q?{color:"hsl(var(--theme-primary))"}:void 0,title:q?"View formatted":"Edit raw",children:q?(0,b.jsx)(O.Eye,{className:"w-4 h-4"}):(0,b.jsx)(N.Pencil,{className:"w-4 h-4"})}),(0,b.jsx)("button",{onClick:i,className:"p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",title:h?"Unlock editing":"Lock from AI edits",children:h?(0,b.jsx)(J.Lock,{className:"w-4 h-4"}):(0,b.jsx)(K.Unlock,{className:"w-4 h-4"})}),(0,b.jsx)("button",{onClick:()=>{navigator.clipboard.writeText(f),p(!0),setTimeout(()=>p(!1),2e3)},className:"p-1.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-muted",style:o?{color:"hsl(var(--theme-primary))"}:void 0,title:o?"Copied!":"Copy",children:o?(0,b.jsx)(w.Check,{className:"w-4 h-4"}):(0,b.jsx)(v.Copy,{className:"w-4 h-4"})}),(0,b.jsx)("button",{onClick:m,className:"p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",title:"Minimize",children:(0,b.jsx)(B.Minimize2,{className:"w-4 h-4"})})]})]}),(0,b.jsxs)("div",{className:"flex-1 overflow-hidden relative",children:[q?(0,b.jsx)("textarea",{ref:u,value:f,onChange:a=>g(a.target.value),disabled:h,className:`w-full h-full p-4 font-mono text-sm resize-none focus:outline-none ${h?"bg-muted/50 text-muted-foreground cursor-not-allowed":"bg-card text-foreground"}`,style:{lineHeight:"1.6"},spellCheck:!1}):(0,b.jsx)("div",{ref:x,className:`w-full h-full p-4 overflow-y-auto select-text ${h?"bg-muted/30":"bg-card"}`,style:{lineHeight:"1.6"},onMouseUp:y,onTouchEnd:y,children:(0,b.jsx)(ab,{content:f,type:a})}),h&&(0,b.jsx)("div",{className:"absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]",children:(0,b.jsxs)("div",{className:"flex items-center gap-2 text-muted-foreground text-sm",children:[(0,b.jsx)(J.Lock,{className:"w-4 h-4"}),(0,b.jsx)("span",{children:"Locked from AI edits"})]})}),s&&n&&(0,b.jsx)(aa,{selectedText:s.text,position:s.position,onCopy:()=>{s?.text&&(navigator.clipboard.writeText(s.text),t(null))},onAddToChat:()=>{s?.text&&n&&(n(s.text,a),t(null))},onClose:()=>t(null)})]})]}):(0,b.jsxs)("div",{className:"flex items-center justify-between px-4 py-3 bg-card rounded-2xl border border-border",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)("span",{style:{color:"hsl(var(--theme-primary))"},children:(0,b.jsx)(e,{className:"w-4 h-4"})}),(0,b.jsx)("span",{className:"font-semibold text-sm text-foreground",children:c}),(0,b.jsxs)("span",{className:"text-xs text-muted-foreground",children:[z," chars"]})]}),(0,b.jsx)("button",{onClick:m,className:"p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",title:"Expand",children:(0,b.jsx)(C.Maximize2,{className:"w-4 h-4"})})]})}function ad({onTranscription:a,disabled:c}){let e,[f,g]=(0,d.useState)(!1),{isRecording:h,duration:i,audioLevels:j,startRecording:k,stopRecording:l,isSupported:m}=(0,s.useVoiceRecorder)({maxDuration:120}),n=async()=>{if(h){let b=await l();if(b){g(!0);try{let c=new FormData;c.append("audio",b,"recording.webm");let d=await fetch("/api/whisper",{method:"POST",body:c});if(d.ok){let b=await d.json();b.text&&a(b.text)}}catch(a){console.error("Transcription error:",a)}finally{g(!1)}}}else await k()};return m?(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[h&&(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)("div",{className:"flex items-center gap-0.5 h-6",children:j.slice(-8).map((a,c)=>(0,b.jsx)("div",{className:"w-1 rounded-full transition-all duration-75",style:{height:`${Math.max(4,24*a)}px`,backgroundColor:"hsl(var(--theme-primary))",opacity:.6+.4*a}},c))}),(0,b.jsx)("span",{className:"text-xs text-muted-foreground tabular-nums",children:(e=Math.floor(i/60),`${e}:${(i%60).toString().padStart(2,"0")}`)})]}),(0,b.jsx)(r.motion.button,{onClick:n,disabled:c||f,whileHover:{scale:1.05},whileTap:{scale:.95},className:`p-3 rounded-full transition-colors ${h?"bg-red-500 text-white":f?"bg-muted text-muted-foreground":"bg-muted text-foreground hover:bg-muted/80"}`,children:f?(0,b.jsx)(y.Loader2,{className:"w-4 h-4 animate-spin"}):h?(0,b.jsx)(A.Square,{className:"w-4 h-4 fill-current"}):(0,b.jsx)(z.Mic,{className:"w-4 h-4"})})]}):null}function ae({onAction:a,isLoading:c}){return(0,b.jsx)("div",{className:"flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-hide",children:Z.map(d=>(0,b.jsxs)("button",{onClick:()=>a(d),disabled:c,className:"flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50",children:[(0,b.jsx)(d.icon,{className:"w-3.5 h-3.5"}),d.label]},d.id))})}function af({onSelectPreset:a}){let[c,e]=(0,d.useState)(!1),f=(0,d.useRef)(null);(0,d.useEffect)(()=>{function a(a){f.current&&!f.current.contains(a.target)&&e(!1)}return document.addEventListener("mousedown",a),()=>document.removeEventListener("mousedown",a)},[]);let g=b=>{a(b),e(!1)};return(0,b.jsxs)("div",{className:"relative",ref:f,children:[(0,b.jsxs)("button",{onClick:()=>e(!c),className:"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors bg-muted text-foreground hover:bg-muted/80",children:[(0,b.jsx)(L.Palette,{className:"w-4 h-4"}),(0,b.jsx)("span",{children:"Presets"}),(0,b.jsx)(M.ChevronDown,{className:`w-3.5 h-3.5 transition-transform ${c?"rotate-180":""}`})]}),c&&(0,b.jsxs)(r.motion.div,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},exit:{opacity:0,y:-10},className:"absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-card border border-border rounded-xl shadow-xl z-50",children:[(0,b.jsxs)("button",{onClick:()=>g(Y),className:"w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border",children:[(0,b.jsx)("span",{className:"text-lg",children:Y.emoji}),(0,b.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,b.jsx)("p",{className:"text-sm font-medium text-foreground",children:Y.name}),(0,b.jsx)("p",{className:"text-xs text-muted-foreground truncate",children:Y.description})]})]}),[{name:"Kinetic / Rhythmic",ids:["wild-cadence-neo-soul","scatter-swagger","modern-poet"]},{name:"Soul / Introspective",ids:["brazilian-retro-soul","irish-neo-soul","afro-soul-introspection","lofi-soul-confessional","warm-affirmation"]},{name:"Cinematic / Abstract",ids:["abstract-spoken-melody","cinematic-inner-dialogue"]},{name:"Groove / Funk",ids:["minimal-funk"]},{name:"Experimental",ids:["tech-poetry-os"]}].map(a=>(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"px-4 py-2 bg-muted/30",children:(0,b.jsx)("p",{className:"text-xs font-semibold text-muted-foreground uppercase tracking-wide",children:a.name})}),a.ids.map(a=>{let c=X.find(b=>b.id===a);return c?(0,b.jsxs)("button",{onClick:()=>g(c),className:"w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/50 transition-colors",children:[(0,b.jsx)("span",{className:"text-lg",children:c.emoji}),(0,b.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,b.jsx)("p",{className:"text-sm font-medium text-foreground",children:c.name}),(0,b.jsx)("p",{className:"text-xs text-muted-foreground truncate",children:c.description})]})]},c.id):null})]},a.name))]})]})}function ag({onSave:a,onLoad:c,onExport:e,currentSessionName:f,onRename:g}){let[h,i]=(0,d.useState)(!1),[j,k]=(0,d.useState)([]),[l,m]=(0,d.useState)(!1),[n,o]=(0,d.useState)(f),p=(0,d.useRef)(null);return(0,d.useEffect)(()=>{k(_())},[h]),(0,d.useEffect)(()=>{let a=a=>{p.current&&!p.current.contains(a.target)&&i(!1)};return document.addEventListener("mousedown",a),()=>document.removeEventListener("mousedown",a)},[]),(0,b.jsxs)("div",{className:"relative",ref:p,children:[(0,b.jsxs)("button",{onClick:()=>i(!h),className:"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-muted text-foreground hover:bg-muted/80 transition-colors",children:[(0,b.jsx)(S.Save,{className:"w-4 h-4"}),(0,b.jsx)("span",{className:"hidden sm:inline",children:"Sessions"})]}),h&&(0,b.jsxs)(r.motion.div,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},className:"absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-xl z-50",children:[(0,b.jsxs)("div",{className:"p-3 border-b border-border",children:[(0,b.jsx)("p",{className:"text-xs text-muted-foreground mb-1",children:"Current Session"}),l?(0,b.jsx)("input",{type:"text",value:n,onChange:a=>o(a.target.value),onBlur:()=>{g(n),m(!1)},onKeyDown:a=>{"Enter"===a.key&&(g(n),m(!1))},className:"w-full px-2 py-1 text-sm bg-muted rounded border-none focus:outline-none focus:ring-1",style:{"--tw-ring-color":"hsl(var(--theme-primary))"},autoFocus:!0}):(0,b.jsx)("p",{className:"text-sm font-medium cursor-pointer hover:text-muted-foreground",onClick:()=>m(!0),children:f||"Untitled Session"})]}),(0,b.jsxs)("div",{className:"p-2 border-b border-border flex gap-2",children:[(0,b.jsxs)("button",{onClick:()=>{a(),i(!1)},className:"flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-muted hover:bg-muted/80 transition-colors",children:[(0,b.jsx)(S.Save,{className:"w-3.5 h-3.5"}),"Save"]}),(0,b.jsxs)("button",{onClick:()=>{e(),i(!1)},className:"flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-muted hover:bg-muted/80 transition-colors",children:[(0,b.jsx)(R.Download,{className:"w-3.5 h-3.5"}),"Export"]})]}),(0,b.jsx)("div",{className:"max-h-48 overflow-y-auto",children:0===j.length?(0,b.jsx)("p",{className:"p-3 text-xs text-muted-foreground text-center",children:"No saved sessions"}):j.map(a=>(0,b.jsxs)("div",{className:"flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors",children:[(0,b.jsxs)("button",{onClick:()=>{c(a),i(!1)},className:"flex-1 text-left",children:[(0,b.jsx)("p",{className:"text-sm font-medium truncate",children:a.name}),(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:new Date(a.updatedAt).toLocaleDateString()})]}),(0,b.jsx)("button",{onClick:()=>{var b;let c;return b=a.id,void($(c=j.filter(a=>a.id!==b)),k(c))},className:"p-1.5 text-muted-foreground hover:text-red-500 transition-colors",children:(0,b.jsx)(D.RotateCcw,{className:"w-3.5 h-3.5"})})]},a.id))})]})]})}function ah({messages:a,onSendMessage:c,onQuickAction:e,isLoading:f,isMinimized:g,onToggleMinimize:h}){let[i,j]=(0,d.useState)(""),k=(0,d.useRef)(null),l=(0,d.useRef)(null),m=(0,d.useCallback)(()=>{k.current?.scrollIntoView({behavior:"smooth"})},[]);(0,d.useEffect)(()=>{m()},[a,m]);let n=()=>{i.trim()&&!f&&(c(i.trim()),j(""))};return g?(0,b.jsxs)("div",{className:"flex items-center justify-between p-3 bg-card rounded-2xl border border-border",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)("div",{className:"w-8 h-8 rounded-full flex items-center justify-center",style:{backgroundColor:"hsl(var(--theme-primary))"},children:(0,b.jsx)(t.Music4,{className:"w-4 h-4 text-white"})}),(0,b.jsx)("span",{className:"text-sm font-medium text-foreground",children:"Claw AI"}),a.length>1&&(0,b.jsxs)("span",{className:"text-xs text-muted-foreground",children:[a.length-1," messages"]})]}),(0,b.jsx)("button",{onClick:h,className:"p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",children:(0,b.jsx)(C.Maximize2,{className:"w-4 h-4"})})]}):(0,b.jsxs)("div",{className:"flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)("div",{className:"w-8 h-8 rounded-full flex items-center justify-center",style:{backgroundColor:"hsl(var(--theme-primary))"},children:(0,b.jsx)(t.Music4,{className:"w-4 h-4 text-white"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h2",{className:"text-foreground font-semibold text-sm",children:"Claw AI"}),(0,b.jsx)("p",{className:"text-muted-foreground text-xs",children:"Suno Architect"})]})]}),(0,b.jsx)("button",{onClick:h,className:"p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",children:(0,b.jsx)(B.Minimize2,{className:"w-4 h-4"})})]}),(0,b.jsx)("div",{className:"px-3 border-b border-border",children:(0,b.jsx)(ae,{onAction:e,isLoading:f})}),(0,b.jsxs)("div",{className:"flex-1 overflow-y-auto p-4 space-y-3",children:[a.map(a=>(0,b.jsx)(r.motion.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:`flex ${"user"===a.role?"justify-end":"justify-start"}`,children:(0,b.jsxs)("div",{className:`max-w-[85%] rounded-2xl px-4 py-3 ${"user"===a.role?"":"bg-muted text-foreground"}`,style:"user"===a.role?{backgroundColor:"hsl(var(--theme-primary) / 0.15)",color:"hsl(var(--theme-primary))"}:void 0,children:[a.isVoice&&"user"===a.role&&(0,b.jsxs)("div",{className:"flex items-center gap-1.5 mb-1 text-xs opacity-70",children:[(0,b.jsx)(z.Mic,{className:"w-3 h-3"}),(0,b.jsx)("span",{children:"Voice"})]}),a.reference&&(0,b.jsxs)("div",{className:"mb-2 p-2 rounded-lg border-l-2 bg-muted/50",style:{borderColor:"hsl(var(--theme-primary))"},children:[(0,b.jsx)("div",{className:"flex items-center gap-1.5 mb-1",children:(0,b.jsx)("span",{className:"text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded",style:{backgroundColor:"hsl(var(--theme-primary) / 0.15)",color:"hsl(var(--theme-primary))"},children:a.reference.source})}),(0,b.jsxs)("p",{className:"text-xs text-muted-foreground italic line-clamp-3",children:['"',a.reference.text,'"']})]}),(0,b.jsx)("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",children:a.content})]})},a.id)),f&&(0,b.jsx)(r.motion.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:"flex justify-start",children:(0,b.jsx)("div",{className:"bg-muted rounded-2xl px-4 py-3",children:(0,b.jsxs)("div",{className:"flex gap-1",children:[(0,b.jsx)("span",{className:"w-2 h-2 rounded-full animate-bounce",style:{backgroundColor:"hsl(var(--theme-primary) / 0.6)",animationDelay:"0ms"}}),(0,b.jsx)("span",{className:"w-2 h-2 rounded-full animate-bounce",style:{backgroundColor:"hsl(var(--theme-primary) / 0.6)",animationDelay:"150ms"}}),(0,b.jsx)("span",{className:"w-2 h-2 rounded-full animate-bounce",style:{backgroundColor:"hsl(var(--theme-primary) / 0.6)",animationDelay:"300ms"}})]})})}),(0,b.jsx)("div",{ref:k})]}),(0,b.jsx)("div",{className:"p-3 border-t border-border",children:(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)("input",{ref:l,type:"text",value:i,onChange:a=>j(a.target.value),onKeyDown:a=>{"Enter"!==a.key||a.shiftKey||(a.preventDefault(),n())},placeholder:"Describe your song vision...",className:"flex-1 bg-muted rounded-full px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2",style:{"--tw-ring-color":"hsl(var(--theme-primary) / 0.3)"},disabled:f}),(0,b.jsx)(ad,{onTranscription:a=>{c(a,!0)},disabled:f}),(0,b.jsx)(r.motion.button,{onClick:n,disabled:!i.trim()||f,whileHover:{scale:1.05},whileTap:{scale:.95},className:`p-3 rounded-full transition-colors ${i.trim()&&!f?"":"bg-muted text-muted-foreground"}`,style:i.trim()&&!f?{background:"linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)",color:"white"}:void 0,children:(0,b.jsx)(x.Send,{className:"w-4 h-4"})})]})})]})}function ai(){let{activeStylePrompt:a,activeLyricsPrompt:c,updateStylePrompt:e,updateLyricsPrompt:f,createStylePrompt:g,createLyricsPrompt:h}=function(){let a=(0,d.useContext)(p);if(!a)throw Error("useCowrite must be used within a CowriteProvider");return a}(),[i,j]=(0,d.useState)([{id:"1",role:"assistant",content:"Hey! I'm here to help you craft the perfect Suno prompts. Drop your concept, mood, or rough lyrics, and I'll help shape them into polished Style and Lyrics prompts. Both artifacts on the right update in real-time as we work."}]),[k,l]=(0,d.useState)(!1),[m,n]=(0,d.useState)(!1),[o,q]=(0,d.useState)(!1),[r,s]=(0,d.useState)(!0),[v,w]=(0,d.useState)(!0),[x,y]=(0,d.useState)("chat"),[z,A]=(0,d.useState)([]),[B,C]=(0,d.useState)(-1),[E,F]=(0,d.useState)(!1),[G,H]=(0,d.useState)("Untitled Session"),[I,J]=(0,d.useState)(()=>Date.now().toString()),K=(0,d.useRef)(""),L=(0,d.useRef)("");(0,d.useEffect)(()=>{let b=a?.content||"",d=c?.content||"";if(E){F(!1),K.current=b,L.current=d;return}if(b!==K.current||d!==L.current){if(""!==K.current||""!==L.current){let a=z.slice(0,B+1);a.push({styleContent:b,lyricsContent:d}),a.length>50&&a.shift(),A(a),C(a.length-1)}K.current=b,L.current=d}},[a?.content,c?.content,z,B,E]);let M=(0,d.useCallback)(()=>{if(B>0){let b=z[B-1];F(!0),a&&e(a.id,{content:b.styleContent}),c&&f(c.id,{content:b.lyricsContent}),C(B-1)}},[z,B,a,c,e,f]),N=(0,d.useCallback)(()=>{if(B<z.length-1){let b=z[B+1];F(!0),a&&e(a.id,{content:b.styleContent}),c&&f(c.id,{content:b.lyricsContent}),C(B+1)}},[z,B,a,c,e,f]),O=(0,d.useCallback)(()=>{let b={id:I,name:G,styleContent:a?.content||"",lyricsContent:c?.content||"",messages:i,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},d=_(),e=d.findIndex(a=>a.id===I);e>=0?d[e]=b:d.unshift(b),$(d)},[I,G,a?.content,c?.content,i]),R=(0,d.useCallback)(b=>{J(b.id),H(b.name),j(b.messages),a&&e(a.id,{content:b.styleContent}),c&&f(c.id,{content:b.lyricsContent}),A([]),C(-1)},[a,c,e,f]),S=(0,d.useCallback)(()=>{var b,d;let e,f,g,h,i;e=a?.content||"",f=c?.content||"",b=`# CoWrite Session Export
Generated: ${new Date().toLocaleString()}

## Style Prompt
\`\`\`
${e}
\`\`\`

## Lyrics Prompt
\`\`\`
${f}
\`\`\`
`,d=G.replace(/\s+/g,"_"),g=new Blob([b],{type:"text/plain;charset=utf-8"}),h=URL.createObjectURL(g),(i=document.createElement("a")).href=h,i.download=`${d}.md`,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(h)},[a?.content,c?.content,G]);!function({onUndo:a,onRedo:b,onSave:c,onExport:e,canUndo:f,canRedo:g}){(0,d.useEffect)(()=>{let d=d=>{let h=navigator.platform.toUpperCase().indexOf("MAC")>=0?d.metaKey:d.ctrlKey;h&&"z"===d.key&&!d.shiftKey&&f?(d.preventDefault(),a()):h&&"z"===d.key&&d.shiftKey&&g||h&&"y"===d.key&&g?(d.preventDefault(),b()):h&&"s"===d.key?(d.preventDefault(),c()):h&&"e"===d.key&&(d.preventDefault(),e())};return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[a,b,c,e,f,g])}({onUndo:M,onRedo:N,onSave:O,onExport:S,canUndo:B>0,canRedo:B<z.length-1}),(0,d.useEffect)(()=>{},[]),(0,d.useEffect)(()=>{a||g(),c||h()},[a,c,g,h]);let X=(0,d.useCallback)(b=>{let d=!1,g=!1;if(!m&&a)for(let c of[/```style\n?([\s\S]*?)```/i,/```(?:style prompt)?\n?(\[Is_Max_Mode[\s\S]*?)```/i,/STYLE PROMPT:?\s*```\n?([\s\S]*?)```/i]){let f=b.match(c);if(f&&f[1]){let b=f[1].trim();if(b.includes("[Is_Max_Mode")||b.includes("GENRE")){e(a.id,{content:b}),d=!0;break}}}if(!o&&c)for(let a of[/```lyrics\n?([\s\S]*?)```/i,/```(?:lyrics prompt)?\n?(\/\|\[\/\*{3}\/\/\/[\s\S]*?)```/i,/```(?:lyrics prompt)?\n?(\[(?:INTRO|VERSE|HOOK|CHORUS)[\s\S]*?)```/i,/LYRICS PROMPT:?\s*```\n?([\s\S]*?)```/i]){let d=b.match(a);if(d&&d[1]){let a=d[1].trim();if(a.includes("[VERSE")||a.includes("[HOOK")||a.includes("[INTRO")||a.includes("/|/")){f(c.id,{content:a}),g=!0;break}}}return{styleUpdated:d,lyricsUpdated:g}},[a,c,e,f,m,o]),Y=async(b,d=!1)=>{let e={id:Date.now().toString(),role:"user",content:b,isVoice:d};j(a=>[...a,e]),l(!0);try{let d,e=`
CURRENT STYLE PROMPT${m?" (LOCKED - DO NOT MODIFY)":""}:
\`\`\`
${a?.content||"No style prompt yet"}
\`\`\`

CURRENT LYRICS PROMPT${o?" (LOCKED - DO NOT MODIFY)":""}:
\`\`\`
${c?.content||"No lyrics yet"}
\`\`\`

IMPORTANT: Always output the complete, updated prompts in code blocks. Use \`\`\`style and \`\`\`lyrics labels. The user sees both artifacts update in real-time.
`,f=`${V}

${e}

REFINEMENT INSTRUCTIONS:
- When the user provides rough material, normalize it immediately into proper format
- Style prompts must start with MAX MODE headers
- Lyrics prompts should have proper section tags in []
- Output BOTH complete prompts after every edit, even small changes
- Never output partial prompts - always the full artifact
- Label code blocks clearly: \`\`\`style and \`\`\`lyrics
- Respect locked prompts - do not modify them`,g=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:f},...i.slice(-10).map(a=>({role:a.role,content:a.content})),{role:"user",content:b}],model:"cowrite"})});g.ok?(d=(await g.json()).message||"I couldn't process that. Could you try again?",X(d)):d="I'm having trouble connecting. Please try again.";let h={id:(Date.now()+1).toString(),role:"assistant",content:d};j(a=>[...a,h])}catch(b){console.error("Chat error:",b);let a={id:(Date.now()+1).toString(),role:"assistant",content:"Something went wrong. Let's try that again."};j(b=>[...b,a])}l(!1)},Z=a=>{Y(a.prompt)},aa=b=>{a&&e(a.id,{content:b})},ab=a=>{c&&f(c.id,{content:a})},ad=b=>{if(a){var c;let d=(c=b.content).includes("[Is_Max_Mode:Max]")?c:`${W}

${c}`;e(a.id,{content:d})}},ae=(a,b)=>{let c={id:Date.now().toString(),role:"user",content:"Edit this section:",reference:{text:a,source:b}};j(a=>[...a,c]),y("chat")};return(0,b.jsx)("div",{className:"min-h-screen bg-background text-foreground",children:(0,b.jsxs)("div",{className:"flex flex-col h-screen",children:[(0,b.jsxs)("header",{className:"flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("div",{className:"w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg",style:{background:"linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)",boxShadow:"0 4px 14px hsl(var(--theme-primary) / 0.3)"},children:(0,b.jsx)(t.Music4,{className:"w-5 h-5 text-white"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-lg font-bold text-foreground",children:"CoWrite"}),(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Suno Prompt Studio"})]})]}),(0,b.jsxs)("div",{className:"flex items-center gap-1 sm:gap-2",children:[(0,b.jsxs)("div",{className:"hidden sm:flex items-center gap-1 mr-2",children:[(0,b.jsx)("button",{onClick:M,disabled:B<=0,className:"p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed",title:"Undo (Cmd+Z)",children:(0,b.jsx)(T.default,{className:"w-4 h-4"})}),(0,b.jsx)("button",{onClick:N,disabled:B>=z.length-1,className:"p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed",title:"Redo (Cmd+Shift+Z)",children:(0,b.jsx)(U.default,{className:"w-4 h-4"})})]}),(0,b.jsx)(ag,{onSave:O,onLoad:R,onExport:S,currentSessionName:G,onRename:H}),(0,b.jsxs)("button",{onClick:()=>{j([{id:"1",role:"assistant",content:"Fresh start! What song would you like to create?"}]),J(Date.now().toString()),H("Untitled Session"),A([]),C(-1)},className:"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-muted text-foreground hover:bg-muted/80 transition-colors",children:[(0,b.jsx)(D.RotateCcw,{className:"w-4 h-4"}),(0,b.jsx)("span",{className:"hidden sm:inline",children:"Reset"})]})]})]}),(0,b.jsx)("div",{className:"lg:hidden flex border-b border-border bg-card",children:[{id:"lyrics",label:"Lyrics",icon:Q.FileText},{id:"style",label:"Style",icon:t.Music4},{id:"chat",label:"Chat",icon:P.MessageSquare}].map(a=>(0,b.jsxs)("button",{onClick:()=>y(a.id),className:`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${x===a.id?"text-foreground border-b-2":"text-muted-foreground"}`,style:x===a.id?{borderColor:"hsl(var(--theme-primary))"}:void 0,children:[(0,b.jsx)(a.icon,{className:"w-4 h-4"}),a.label]},a.id))}),(0,b.jsxs)("main",{className:"flex-1 overflow-hidden p-4",children:[(0,b.jsxs)("div",{className:"lg:hidden h-full",children:["lyrics"===x&&(0,b.jsx)("div",{className:"h-full",children:(0,b.jsx)(ac,{type:"lyrics",title:"LYRICS",icon:u.Mic2,content:c?.content||"",onChange:ab,isLocked:o,onToggleLock:()=>q(!o),charLimit:5e3,isExpanded:!0,onToggleExpand:()=>{},onAddToChat:ae})}),"style"===x&&(0,b.jsx)("div",{className:"h-full",children:(0,b.jsx)(ac,{type:"style",title:"STYLE",icon:t.Music4,content:a?.content||"",onChange:aa,isLocked:m,onToggleLock:()=>n(!m),charLimit:1e3,headerExtra:(0,b.jsx)(af,{onSelectPreset:ad}),isExpanded:!0,onToggleExpand:()=>{},onAddToChat:ae})}),"chat"===x&&(0,b.jsx)("div",{className:"h-full",children:(0,b.jsx)(ah,{messages:i,onSendMessage:Y,onQuickAction:Z,isLoading:k,isMinimized:!1,onToggleMinimize:()=>{}})})]}),(0,b.jsxs)("div",{className:"hidden lg:grid h-full grid-cols-4 gap-4",children:[(0,b.jsx)("div",{className:"col-span-2 flex flex-col min-h-0",children:(0,b.jsx)(ac,{type:"lyrics",title:"LYRICS",icon:u.Mic2,content:c?.content||"",onChange:ab,isLocked:o,onToggleLock:()=>q(!o),charLimit:5e3,isExpanded:v,onToggleExpand:()=>w(!v),onAddToChat:ae})}),(0,b.jsxs)("div",{className:"col-span-2 flex flex-col gap-4 min-h-0",children:[(0,b.jsx)("div",{className:r?"flex-1 min-h-0":"",children:(0,b.jsx)(ac,{type:"style",title:"STYLE",icon:t.Music4,content:a?.content||"",onChange:aa,isLocked:m,onToggleLock:()=>n(!m),charLimit:1e3,headerExtra:(0,b.jsx)(af,{onSelectPreset:ad}),onAddToChat:ae,isExpanded:r,onToggleExpand:()=>s(!r)})}),(0,b.jsx)("div",{className:"flex-1 min-h-0",children:(0,b.jsx)(ah,{messages:i,onSendMessage:Y,onQuickAction:Z,isLoading:k,isMinimized:!1,onToggleMinimize:()=>{}})})]})]})]})]})})}function aj(){return(0,b.jsx)(c.PageTransition,{children:(0,b.jsx)(q,{children:(0,b.jsx)(ai,{})})})}a.s(["default",()=>aj],571509)}];

//# sourceMappingURL=src_app_cowrite_page_tsx_5ba9551e._.js.map