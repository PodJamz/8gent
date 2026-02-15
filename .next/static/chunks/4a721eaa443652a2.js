(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,459839,(e,t,n)=>{},881927,(e,t,n)=>{var i=e.i(478522);e.r(459839);var o=e.r(923041),r=o&&"object"==typeof o&&"default"in o?o:{default:o},s=void 0!==i.default&&i.default.env&&!0,a=function(e){return"[object String]"===Object.prototype.toString.call(e)},l=function(){function e(e){var t=void 0===e?{}:e,n=t.name,i=void 0===n?"stylesheet":n,o=t.optimizeForSpeed,r=void 0===o?s:o;u(a(i),"`name` must be a string"),this._name=i,this._deletedRulePlaceholder="#"+i+"-deleted-rule____{}",u("boolean"==typeof r,"`optimizeForSpeed` must be a boolean"),this._optimizeForSpeed=r,this._serverSheet=void 0,this._tags=[],this._injected=!1,this._rulesCount=0;var l="u">typeof window&&document.querySelector('meta[property="csp-nonce"]');this._nonce=l?l.getAttribute("content"):null}var t,n=e.prototype;return n.setOptimizeForSpeed=function(e){u("boolean"==typeof e,"`setOptimizeForSpeed` accepts a boolean"),u(0===this._rulesCount,"optimizeForSpeed cannot be when rules have already been inserted"),this.flush(),this._optimizeForSpeed=e,this.inject()},n.isOptimizeForSpeed=function(){return this._optimizeForSpeed},n.inject=function(){var e=this;if(u(!this._injected,"sheet already injected"),this._injected=!0,"u">typeof window&&this._optimizeForSpeed){this._tags[0]=this.makeStyleTag(this._name),this._optimizeForSpeed="insertRule"in this.getSheet(),this._optimizeForSpeed||(s||console.warn("StyleSheet: optimizeForSpeed mode not supported falling back to standard mode."),this.flush(),this._injected=!0);return}this._serverSheet={cssRules:[],insertRule:function(t,n){return"number"==typeof n?e._serverSheet.cssRules[n]={cssText:t}:e._serverSheet.cssRules.push({cssText:t}),n},deleteRule:function(t){e._serverSheet.cssRules[t]=null}}},n.getSheetForTag=function(e){if(e.sheet)return e.sheet;for(var t=0;t<document.styleSheets.length;t++)if(document.styleSheets[t].ownerNode===e)return document.styleSheets[t]},n.getSheet=function(){return this.getSheetForTag(this._tags[this._tags.length-1])},n.insertRule=function(e,t){if(u(a(e),"`insertRule` accepts only strings"),"u"<typeof window)return"number"!=typeof t&&(t=this._serverSheet.cssRules.length),this._serverSheet.insertRule(e,t),this._rulesCount++;if(this._optimizeForSpeed){var n=this.getSheet();"number"!=typeof t&&(t=n.cssRules.length);try{n.insertRule(e,t)}catch(t){return s||console.warn("StyleSheet: illegal rule: \n\n"+e+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),-1}}else{var i=this._tags[t];this._tags.push(this.makeStyleTag(this._name,e,i))}return this._rulesCount++},n.replaceRule=function(e,t){if(this._optimizeForSpeed||"u"<typeof window){var n="u">typeof window?this.getSheet():this._serverSheet;if(t.trim()||(t=this._deletedRulePlaceholder),!n.cssRules[e])return e;n.deleteRule(e);try{n.insertRule(t,e)}catch(i){s||console.warn("StyleSheet: illegal rule: \n\n"+t+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),n.insertRule(this._deletedRulePlaceholder,e)}}else{var i=this._tags[e];u(i,"old rule at index `"+e+"` not found"),i.textContent=t}return e},n.deleteRule=function(e){if("u"<typeof window)return void this._serverSheet.deleteRule(e);if(this._optimizeForSpeed)this.replaceRule(e,"");else{var t=this._tags[e];u(t,"rule at index `"+e+"` not found"),t.parentNode.removeChild(t),this._tags[e]=null}},n.flush=function(){this._injected=!1,this._rulesCount=0,"u">typeof window?(this._tags.forEach(function(e){return e&&e.parentNode.removeChild(e)}),this._tags=[]):this._serverSheet.cssRules=[]},n.cssRules=function(){var e=this;return"u"<typeof window?this._serverSheet.cssRules:this._tags.reduce(function(t,n){return n?t=t.concat(Array.prototype.map.call(e.getSheetForTag(n).cssRules,function(t){return t.cssText===e._deletedRulePlaceholder?null:t})):t.push(null),t},[])},n.makeStyleTag=function(e,t,n){t&&u(a(t),"makeStyleTag accepts only strings as second parameter");var i=document.createElement("style");this._nonce&&i.setAttribute("nonce",this._nonce),i.type="text/css",i.setAttribute("data-"+e,""),t&&i.appendChild(document.createTextNode(t));var o=document.head||document.getElementsByTagName("head")[0];return n?o.insertBefore(i,n):o.appendChild(i),i},t=[{key:"length",get:function(){return this._rulesCount}}],function(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}(e.prototype,t),e}();function u(e,t){if(!e)throw Error("StyleSheet: "+t+".")}var c=function(e){for(var t=5381,n=e.length;n;)t=33*t^e.charCodeAt(--n);return t>>>0},h={};function d(e,t){if(!t)return"jsx-"+e;var n=String(t),i=e+n;return h[i]||(h[i]="jsx-"+c(e+"-"+n)),h[i]}function p(e,t){"u"<typeof window&&(t=t.replace(/\/style/gi,"\\/style"));var n=e+t;return h[n]||(h[n]=t.replace(/__jsx-style-dynamic-selector/g,e)),h[n]}var m=function(){function e(e){var t=void 0===e?{}:e,n=t.styleSheet,i=void 0===n?null:n,o=t.optimizeForSpeed,r=void 0!==o&&o;this._sheet=i||new l({name:"styled-jsx",optimizeForSpeed:r}),this._sheet.inject(),i&&"boolean"==typeof r&&(this._sheet.setOptimizeForSpeed(r),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),this._fromServer=void 0,this._indices={},this._instancesCounts={}}var t=e.prototype;return t.add=function(e){var t=this;void 0===this._optimizeForSpeed&&(this._optimizeForSpeed=Array.isArray(e.children),this._sheet.setOptimizeForSpeed(this._optimizeForSpeed),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),"u">typeof window&&!this._fromServer&&(this._fromServer=this.selectFromServer(),this._instancesCounts=Object.keys(this._fromServer).reduce(function(e,t){return e[t]=0,e},{}));var n=this.getIdAndRules(e),i=n.styleId,o=n.rules;if(i in this._instancesCounts){this._instancesCounts[i]+=1;return}var r=o.map(function(e){return t._sheet.insertRule(e)}).filter(function(e){return -1!==e});this._indices[i]=r,this._instancesCounts[i]=1},t.remove=function(e){var t=this,n=this.getIdAndRules(e).styleId;if(function(e,t){if(!e)throw Error("StyleSheetRegistry: "+t+".")}(n in this._instancesCounts,"styleId: `"+n+"` not found"),this._instancesCounts[n]-=1,this._instancesCounts[n]<1){var i=this._fromServer&&this._fromServer[n];i?(i.parentNode.removeChild(i),delete this._fromServer[n]):(this._indices[n].forEach(function(e){return t._sheet.deleteRule(e)}),delete this._indices[n]),delete this._instancesCounts[n]}},t.update=function(e,t){this.add(t),this.remove(e)},t.flush=function(){this._sheet.flush(),this._sheet.inject(),this._fromServer=void 0,this._indices={},this._instancesCounts={}},t.cssRules=function(){var e=this,t=this._fromServer?Object.keys(this._fromServer).map(function(t){return[t,e._fromServer[t]]}):[],n=this._sheet.cssRules();return t.concat(Object.keys(this._indices).map(function(t){return[t,e._indices[t].map(function(e){return n[e].cssText}).join(e._optimizeForSpeed?"":"\n")]}).filter(function(e){return!!e[1]}))},t.styles=function(e){var t,n;return t=this.cssRules(),void 0===(n=e)&&(n={}),t.map(function(e){var t=e[0],i=e[1];return r.default.createElement("style",{id:"__"+t,key:"__"+t,nonce:n.nonce?n.nonce:void 0,dangerouslySetInnerHTML:{__html:i}})})},t.getIdAndRules=function(e){var t=e.children,n=e.dynamic,i=e.id;if(n){var o=d(i,n);return{styleId:o,rules:Array.isArray(t)?t.map(function(e){return p(o,e)}):[p(o,t)]}}return{styleId:d(i),rules:Array.isArray(t)?t:[t]}},t.selectFromServer=function(){return Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]')).reduce(function(e,t){return e[t.id.slice(2)]=t,e},{})},e}(),f=o.createContext(null);function y(){return new m}function g(){return o.useContext(f)}f.displayName="StyleSheetContext";var S=r.default.useInsertionEffect||r.default.useLayoutEffect,v="u">typeof window?y():void 0;function w(e){var t=v||g();return t&&("u"<typeof window?t.add(e):S(function(){return t.add(e),function(){t.remove(e)}},[e.id,String(e.dynamic)])),null}w.dynamic=function(e){return e.map(function(e){return d(e[0],e[1])}).join(" ")},n.StyleRegistry=function(e){var t=e.registry,n=e.children,i=o.useContext(f),s=o.useState(function(){return i||t||y()})[0];return r.default.createElement(f.Provider,{value:s},n)},n.createStyleRegistry=y,n.style=w,n.useStyleRegistry=g},750755,(e,t,n)=>{t.exports=e.r(881927).style},563913,e=>{"use strict";var t=e.i(726151),n=e.i(750755),i=e.i(923041),o=e.i(569206),r=e.i(662582),s=e.i(278124);let a=`
     ╭──────────────────────╮
     │    ┌─────────────┐   │
     │    │   JAMES     │   │
     │    │     OS      │   │
     │    └─────────────┘   │
     ╰──────────────────────╯`,l=`
       ██╗ █████╗ ███╗   ███╗███████╗███████╗ ██████╗ ███████╗
       ██║██╔══██╗████╗ ████║██╔════╝██╔════╝██╔═══██╗██╔════╝
       ██║███████║██╔████╔██║█████╗  ███████╗██║   ██║███████╗
  ██   ██║██╔══██║██║╚██╔╝██║██╔══╝  ╚════██║██║   ██║╚════██║
  ╚█████╔╝██║  ██║██║ ╚═╝ ██║███████╗███████║╚██████╔╝███████║
   ╚════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚══════╝`,u=`
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║     ▄▄▄██▀▀▀▄▄▄       ███▄ ▄███▓▓█████   ██████  ▒█████    ██████   ║
║       ▒██  ▒████▄    ▓██▒▀█▀ ██▒▓█   ▀ ▒██    ▒ ▒██▒  ██▒▒██    ▒   ║
║       ░██  ▒██  ▀█▄  ▓██    ▓██░▒███   ░ ▓██▄   ▒██░  ██▒░ ▓██▄     ║
║    ▓██▄██▓ ░██▄▄▄▄██ ▒██    ▒██ ▒▓█  ▄   ▒   ██▒▒██   ██░  ▒   ██▒  ║
║     ▓███▒   ▓█   ▓██▒▒██▒   ░██▒░▒████▒▒██████▒▒░ ████▓▒░▒██████▒▒  ║
║     ▒▓▒▒░   ▒▒   ▓▒█░░ ▒░   ░  ░░░ ▒░ ░▒ ▒▓▒ ▒ ░░ ▒░▒░▒░ ▒ ▒▓▒ ▒ ░  ║
║     ▒ ░▒░    ▒   ▒▒ ░░  ░      ░ ░ ░  ░░ ░▒  ░ ░  ░ ▒ ▒░ ░ ░▒  ░ ░  ║
║     ░ ░ ░    ░   ▒   ░      ░      ░   ░  ░  ░  ░ ░ ░ ▒  ░  ░  ░    ║
║     ░   ░        ░  ░       ░      ░  ░      ░      ░ ░        ░    ║
║                                                                      ║
║                     Terminal v1.0.0 | Est. 2026                      ║
║                  Type 'help' for available commands                  ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝`,c=(e,t,n=20)=>{let i=Math.round(t/100*n),o="█".repeat(i)+"░".repeat(n-i),r=`${t}%`.padStart(4);return`${e.padEnd(16)} [${o}] ${r}`},h=`
 ┌────────────────────────────────────────────────┐
 │  ⚠️  PERMISSION DENIED                         │
 │                                                │
 │  Nice try! But you don't have root access      │
 │  to this system. James is the only admin.      │
 │                                                │
 │  Perhaps try asking nicely? 😏                 │
 │                                                │
 │  Hint: Type 'help' for available commands      │
 └────────────────────────────────────────────────┘`,d=`
 ⚠️  CRITICAL SYSTEM WARNING ⚠️

 Deleting all files...

 /home/james/portfolio     [DELETED]
 /home/james/projects      [DELETED]
 /home/james/resume.txt    [DELETED]
 /usr/bin                  [DELETED]
 /etc/passwd               [DEL̸̡̛͍̫E̵̢̞̲T̷̨̧̺E̶̡̛̝D̵̨̧͎]
 ▓▒░ S̷̡̧Y̶̢̛S̵̡̛T̷̢̧E̶̡̛M̷̢̧ ̶F̵̡̛A̶̢̧I̷̡̛L̶̢̧Ư̷̡R̶̢̧E̷̡̛ ░▒▓

 ...

 Just kidding! 😄 Your files are safe.
 This is a simulated terminal after all.`,p=["The best code is no code at all.","There are only two hard things in CS: cache invalidation and naming things.","It works on my machine!","// TODO: fix this later (written 3 years ago)","A bug is never just a mistake. It represents a missed test.","First, solve the problem. Then, write the code.","Talk is cheap. Show me the code. - Linus Torvalds","Any fool can write code that a computer can understand. Good programmers write code that humans can understand.","The only way to go fast is to go well.","Simplicity is prerequisite for reliability.","Make it work, make it right, make it fast.","Code is like humor. When you have to explain it, it's bad."],m="アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",f=["Initializing OpenClaw-OS kernel...","Loading system modules...","Mounting virtual filesystem...","Starting display manager...","Initializing network stack...","Loading user preferences...","Starting terminal emulator...","","OpenClaw-OS v1.0.0 (tty1)","","Login: guest","Password: ********","","Welcome to OpenClaw-OS!",'Type "help" for a list of commands.',""],y=["> Initiating hack sequence...","> Bypassing firewall [████████████████████] 100%","> Decrypting mainframe access codes...","> Injecting payload...","> Establishing backdoor connection...","> Accessing classified files...","","⚠️  ACCESS GRANTED ⚠️","","Just kidding! This is just a fun easter egg.","No actual hacking occurred. You're safe! 🔐"],g={"/home/james":["about.txt","resume.txt","portfolio/","blog/",".secrets/",".bashrc"],"/home/owner/portfolio":["openclaw-os.md","claw-ai.md","music-studio.md","prototyping.md"],"/home/james/blog":["experience-philosophy.md","building-ai-agents.md","design-systems.md"],"/home/james/.secrets":["themes.txt","konami.txt"]},S={"/home/james/about.txt":`
┌─────────────────────────────────────────────────────┐
│                   ABOUT JAMES                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Hey! I'm James Murphy, a full-stack engineer       │
│  passionate about building beautiful, intelligent   │
│  software experiences.                              │
│                                                     │
│  I believe AI should augment human creativity,      │
│  not replace it. OpenClaw-OS is a vision of what   │
│  personal computing could become.                   │
│                                                     │
│  When I'm not coding, you'll find me:               │
│  → Making music in my home studio                   │
│  → Exploring San Francisco                          │
│  → Reading about AI and consciousness               │
│                                                     │
│  Let's build something amazing together!            │
│                                                     │
└─────────────────────────────────────────────────────┘`,"/home/james/resume.txt":`
╔══════════════════════════════════════════════════════════════╗
║                        JAMES MURPHY                          ║
║              Full-Stack Engineer & AI Enthusiast             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  EXPERIENCE                                                  ║
║  ──────────                                                  ║
║  → Senior Full-Stack Engineer                                ║
║    Building AI-powered experiences                           ║
║    React, TypeScript, Node.js, Python                        ║
║                                                              ║
║  SKILLS                                                      ║
║  ──────                                                      ║
║  Frontend    [████████████████████] 100%                     ║
║  Backend     [██████████████████░░]  90%                     ║
║  AI/ML       [████████████████░░░░]  80%                     ║
║  DevOps      [██████████████░░░░░░]  70%                     ║
║  Design      [████████████████░░░░]  80%                     ║
║                                                              ║
║  EDUCATION                                                   ║
║  ─────────                                                   ║
║  → Computer Science                                          ║
║    Self-taught + endless curiosity                           ║
║                                                              ║
║  CONTACT                                                     ║
║  ───────                                                     ║
║  → github.com/podjamz                                        ║
║  → linkedin.com/in/jamesmurphy                               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`,"/home/james/.bashrc":`
# OpenClaw-OS Terminal Configuration
# ─────────────────────────────

export PS1="guest@openclaw ~ $ "
export EDITOR="vim"
export THEME="claude"

# Aliases
alias ll='ls -la'
alias ..='cd ..'
alias cls='clear'
alias hack='echo "Nice try 😏"'

# Fun stuff
fortune | cowsay

# Welcome message
echo "Welcome back! Type 'neofetch' for system info."`,"/home/james/.secrets/themes.txt":`
╔═══════════════════════════════════════════════════════╗
║              🎨 SECRET THEMES UNLOCKED 🎨             ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  You found the secret themes file!                    ║
║                                                       ║
║  Available secret themes:                             ║
║  → matrix    (unlock with: theme matrix)              ║
║  → hacker    (unlock with: theme hacker)              ║
║  → retro     (unlock with: theme retro)               ║
║                                                       ║
║  Visit /design to see all available themes.           ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝`,"/home/james/.secrets/konami.txt":`
↑ ↑ ↓ ↓ ← → ← → B A

You know the code. But can you enter it?`,"/home/openclaw/portfolio/openclaw.md":`
# OpenClaw-OS

A personal operating system experience for the web.

Features:
- iOS-style home screen with drag-and-drop
- 25+ beautiful themes
- AI-powered assistant (Claw AI)
- Full-featured prototyping environment
- Music studio with stem separation

Status: In active development
Tech: Next.js 14, TypeScript, Tailwind, Convex`,"/home/james/portfolio/claw-ai.md":`
# Claw AI

Your personal AI assistant that lives in OpenClaw-OS.

Features:
- Natural conversation interface
- Theme recommendations
- Navigation assistance
- Voice input/output
- Persistent chat history

Powered by: Claude (Anthropic)`},v=(e,t)=>{if(t.startsWith("/"))return t;if(".."===t){let t=e.split("/").filter(Boolean);return t.pop(),"/"+t.join("/")}return"~"===t?"/home/james":e+"/"+t},w={help:{name:"help",description:"Show available commands",action:()=>({output:`
╔════════════════════════════════════════════════════════════════════╗
║                      AVAILABLE COMMANDS                            ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  NAVIGATION                                                        ║
║  ──────────                                                        ║
║  ls [path]          List directory contents                        ║
║  cd <path>          Change directory                               ║
║  pwd                Print working directory                        ║
║  cat <file>         Display file contents                          ║
║                                                                    ║
║  PORTFOLIO                                                         ║
║  ─────────                                                        ║
║  skills             Show skill bars                                ║
║  open <app>         Open an app (design, projects, music, etc.)    ║
║  whoami             Display current user                           ║
║                                                                    ║
║  SYSTEM                                                            ║
║  ──────                                                            ║
║  clear              Clear terminal screen                          ║
║  history            Show command history                           ║
║  echo <text>        Print text to terminal                         ║
║  date               Show current date/time                         ║
║  neofetch           Display system info with ASCII art             ║
║                                                                    ║
║  Type a command to get started!                                    ║
║  Hint: There might be some hidden commands... 🤫                   ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝`})},ls:{name:"ls",description:"List directory contents",usage:"ls [path]",action:(e,t)=>{let n=e[0]?v(t.currentPath,e[0]):t.currentPath,i=g[n];return i?"string"==typeof i?{output:i}:{output:i.map(e=>e.endsWith("/")?`\x1b[34m${e}\x1b[0m`:e.startsWith(".")?`\x1b[90m${e}\x1b[0m`:e).join("  ")}:{output:`ls: cannot access '${e[0]||n}': No such file or directory`}}},cd:{name:"cd",description:"Change directory",usage:"cd <path>",action:(e,t)=>{if(!e[0])return t.setCurrentPath("/home/james"),{output:""};let n=v(t.currentPath,e[0]);return g[n]||"/home/james"===n?(t.setCurrentPath(n),{output:""}):{output:`cd: ${e[0]}: No such file or directory`}}},pwd:{name:"pwd",description:"Print working directory",action:(e,t)=>({output:t.currentPath})},cat:{name:"cat",description:"Display file contents",usage:"cat <file>",action:(e,t)=>{if(!e[0])return{output:"cat: missing operand"};let n=v(t.currentPath,e[0]),i=S[n];return i?{output:i}:g[n]?{output:`cat: ${e[0]}: Is a directory`}:{output:`cat: ${e[0]}: No such file or directory`}}},clear:{name:"clear",description:"Clear terminal screen",action:()=>({output:"",clear:!0})},whoami:{name:"whoami",description:"Display current user",action:()=>({output:"guest"})},history:{name:"history",description:"Show command history",action:(e,t)=>({output:t.history.slice(-20).map((e,t)=>`  ${(t+1).toString().padStart(3)}  ${e}`).join("\n")||"  (no history)"})},echo:{name:"echo",description:"Print text to terminal",usage:"echo <text>",action:e=>({output:e.join(" ")})},date:{name:"date",description:"Show current date/time",action:()=>({output:new Date().toString()})},skills:{name:"skills",description:"Show skill bars",action:()=>({output:`
╔══════════════════════════════════════════════════════════╗
║                    TECHNICAL SKILLS                      ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ${c("TypeScript",95)}     ║
║  ${c("React/Next.js",95)}     ║
║  ${c("Node.js",90)}     ║
║  ${c("Python",85)}     ║
║  ${c("AI/ML",80)}     ║
║  ${c("System Design",85)}     ║
║  ${c("UI/UX Design",80)}     ║
║  ${c("DevOps",75)}     ║
║  ${c("PostgreSQL",80)}     ║
║  ${c("GraphQL",85)}     ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝`})},open:{name:"open",description:"Open an app",usage:"open <app>",action:e=>{let t={design:"/design",projects:"/projects",music:"/music",studio:"/studio",blog:"/blog",resume:"/resume",photos:"/photos",humans:"/humans",story:"/story",prototyping:"/prototyping",settings:"/settings",home:"/"};if(!e[0])return{output:`Usage: open <app>

Available apps:
${Object.keys(t).map(e=>`  → ${e}`).join("\n")}`};let n=e[0].toLowerCase();return t[n]?{output:`Opening ${n}...`,navigate:t[n]}:{output:`open: ${e[0]}: Application not found`}}},neofetch:{name:"neofetch",description:"Display system info",action:(e,t)=>{let n;return{output:(n={os:"OpenClaw-OS v1.0.0",host:"portfolio.dev",kernel:"React 18.2.0",uptime:"∞ days",shell:"/bin/zsh",theme:t.theme||"claude",terminal:"OpenClaw Terminal",cpu:"Apple Silicon (simulated)",memory:"∞ GB available"},`
${a}
                        ${n.os}
                        ─────────────────
                        Host: ${n.host}
                        Kernel: ${n.kernel}
                        Uptime: ${n.uptime}
                        Shell: ${n.shell}
                        Theme: ${n.theme}
                        Terminal: ${n.terminal}
                        CPU: ${n.cpu}
                        Memory: ${n.memory}`)}}},hack:{name:"hack",description:"Hack the mainframe",hidden:!0,action:()=>({output:y,special:"hack",delay:100})},matrix:{name:"matrix",description:"Enter the Matrix",hidden:!0,action:()=>({output:"Initiating Matrix mode...",special:"matrix"})},cowsay:{name:"cowsay",description:"Cow says moo",hidden:!0,action:e=>({output:(e=>{let t=e.split(" "),n=[],i="";for(let e of t)(i+" "+e).trim().length<=40?i=(i+" "+e).trim():(i&&n.push(i),i=e);i&&n.push(i);let o=Math.max(...n.map(e=>e.length)),r="-".repeat(o+2),s=n.map(e=>{let t=" ".repeat(o-e.length);return`| ${e}${t} |`});return`
 ${r}
${s.join("\n")}
 ${r}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`})(e.join(" ")||"Moo! 🐮")})},fortune:{name:"fortune",description:"Get a random fortune",hidden:!0,action:()=>({output:`
  "${p[Math.floor(Math.random()*p.length)]}"
`})},sudo:{name:"sudo",description:"Execute as superuser",hidden:!0,action:e=>e.join(" ").includes("rm -rf")?{output:d,special:"glitch"}:{output:h}},rm:{name:"rm",description:"Remove files",hidden:!0,action:e=>e.join(" ").includes("-rf /")?{output:d,special:"glitch"}:{output:"rm: operation not permitted in demo mode"}},welcome:{name:"welcome",description:"Show welcome banner",hidden:!0,action:()=>({output:u})},boot:{name:"boot",description:"Show boot sequence",hidden:!0,action:()=>({output:f,special:"boot",delay:50})},banner:{name:"banner",description:"Show ASCII banner",hidden:!0,action:()=>({output:l})},exit:{name:"exit",description:"Exit terminal",action:()=>({output:"Goodbye! 👋\n\nRedirecting to home...",navigate:"/"})},theme:{name:"theme",description:"Set terminal theme",hidden:!0,action:e=>e[0]?{output:`Theme '${e[0]}' activated!

Visit /design to explore all 25+ themes.`,navigate:"/design"}:{output:"Usage: theme <name>\n\nTry: theme matrix, theme hacker, theme retro"}}};function x(){let e=(0,o.useRouter)(),[a,l]=(0,i.useState)([]),[c,d]=(0,i.useState)(""),[p,f]=(0,i.useState)("/home/james"),[g,S]=(0,i.useState)([]),[v,x]=(0,i.useState)(-1),[_,b]=(0,i.useState)(!1),[j,C]=(0,i.useState)(!1),[k,T]=(0,i.useState)([]),A=(0,i.useRef)(null),E=(0,i.useRef)(null),R=(0,i.useRef)(null),$=(0,i.useRef)(void 0);(0,i.useEffect)(()=>{l([{id:"welcome",type:"system",content:u}])},[]),(0,i.useEffect)(()=>{E.current&&(E.current.scrollTop=E.current.scrollHeight)},[a]);let I=(0,i.useCallback)(()=>{A.current?.focus()},[]);(0,i.useEffect)(()=>{if(!_||!R.current)return;let e=R.current,t=e.getContext("2d");if(!t)return;e.width=window.innerWidth,e.height=window.innerHeight;let n=[],i=Math.floor(e.width/14);for(let t=0;t<i;t++)n.push({x:14*t,chars:Array.from({length:Math.floor(20*Math.random())+10},()=>m[Math.floor(Math.random()*m.length)]),y:-(Math.random()*e.height*1),speed:3*Math.random()+2});let o=()=>{t.fillStyle="rgba(0, 0, 0, 0.05)",t.fillRect(0,0,e.width,e.height),t.font="14px monospace",n.forEach((i,o)=>{i.chars.forEach((e,n)=>{let o=i.y+14*n;n===i.chars.length-1?t.fillStyle="#fff":n>i.chars.length-5?t.fillStyle="#22c55e":t.fillStyle=`rgba(34, 197, 94, ${.3+n/i.chars.length*.5})`,t.fillText(e,i.x,o),.02>Math.random()&&(i.chars[n]=m[Math.floor(Math.random()*m.length)])}),i.y+=i.speed,i.y>e.height+14*i.chars.length&&(n[o]={x:i.x,chars:Array.from({length:Math.floor(20*Math.random())+10},()=>m[Math.floor(Math.random()*m.length)]),y:-280,speed:3*Math.random()+2})}),$.current=requestAnimationFrame(o)};o();let r=setTimeout(()=>{b(!1)},1e4);return()=>{$.current&&cancelAnimationFrame($.current),clearTimeout(r)}},[_]);let O=(0,i.useCallback)(async t=>{let n=t.trim();if(!n)return;let i={id:`input-${Date.now()}`,type:"input",content:`guest@openclaw ${p.replace("/home/owner","~")} $ ${n}`};l(e=>[...e,i]),S(e=>[...e,n]),x(-1),d(""),T([]);let o=((e,t)=>{let n=e.trim();if(!n)return{output:""};let i=n.split(/\s+/),o=i[0].toLowerCase(),r=i.slice(1);if("sudo"===o&&r[0]){let e=r.join(" ");if(e.includes("rm -rf")||e.includes("su"))return w.sudo.action(r,t);if(w[r[0]])return{output:h}}let s=w[o];return s?s.action(r,t):{output:`Command not found: ${o}
Type 'help' for available commands.`}})(n,{currentPath:p,setCurrentPath:f,history:g,theme:"claude"});if("matrix"===o.special)b(!0);else if("hack"===o.special){for(let e of y)await new Promise(e=>setTimeout(e,o.delay||100)),l(t=>[...t,{id:`hack-${Date.now()}-${Math.random()}`,type:"output",content:e}]);b(!0);return}else if("glitch"===o.special)C(!0),setTimeout(()=>C(!1),2e3);else if("boot"===o.special){for(let e of Array.isArray(o.output)?o.output:o.output.split("\n"))await new Promise(e=>setTimeout(e,o.delay||50)),l(t=>[...t,{id:`boot-${Date.now()}-${Math.random()}`,type:"system",content:e}]);return}if(o.clear)return void l([]);if(o.navigate&&setTimeout(()=>{e.push(o.navigate)},500),o.output){let e=Array.isArray(o.output)?o.output.join("\n"):o.output;e&&l(t=>[...t,{id:`output-${Date.now()}`,type:"output",content:e}])}},[p,g,e]),N=(0,i.useCallback)(e=>{if("Enter"===e.key)O(c);else if("ArrowUp"===e.key){if(e.preventDefault(),g.length>0){let e=v<g.length-1?v+1:v;x(e),d(g[g.length-1-e]||"")}}else if("ArrowDown"===e.key)if(e.preventDefault(),v>0){let e=v-1;x(e),d(g[g.length-1-e]||"")}else x(-1),d("");else"Tab"===e.key?(e.preventDefault(),1===k.length?(d(k[0]),T([])):k.length>1&&l(e=>[...e,{id:`suggestions-${Date.now()}`,type:"system",content:k.join("  ")}])):"l"===e.key&&e.ctrlKey&&(e.preventDefault(),l([]))},[c,g,v,k,O]);return(0,i.useEffect)(()=>{if(c&&!c.includes(" "))T(Object.values(w).filter(e=>!e.hidden).filter(e=>e.name.startsWith(c.toLowerCase())).map(e=>e.name));else T([])},[c]),(0,t.jsxs)("div",{onClick:I,className:"jsx-a65d84f67987f0a8 relative w-full h-full bg-black overflow-hidden cursor-text",children:[(0,t.jsx)("div",{style:{background:"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)"},className:"jsx-a65d84f67987f0a8 pointer-events-none absolute inset-0 z-20"}),(0,t.jsx)("div",{style:{boxShadow:"inset 0 0 100px rgba(0, 0, 0, 0.5)"},className:"jsx-a65d84f67987f0a8 pointer-events-none absolute inset-0 z-30"}),(0,t.jsx)("div",{style:{animation:j?"none":"flicker 0.15s infinite"},className:`jsx-a65d84f67987f0a8 absolute inset-0 z-10 ${j?"animate-pulse":""}`}),(0,t.jsx)(s.AnimatePresence,{children:_&&(0,t.jsxs)(r.motion.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"absolute inset-0 z-40",children:[(0,t.jsx)("canvas",{ref:R,className:"jsx-a65d84f67987f0a8 w-full h-full"}),(0,t.jsx)("button",{onClick:()=>b(!1),className:"jsx-a65d84f67987f0a8 absolute top-4 right-4 text-green-500 hover:text-green-400 font-mono text-sm",children:"[Press ESC or click to exit]"})]})}),(0,t.jsxs)("div",{ref:E,style:{color:"#22c55e",textShadow:"0 0 5px #22c55e, 0 0 10px rgba(34, 197, 94, 0.5)"},className:`jsx-a65d84f67987f0a8 h-full overflow-y-auto p-4 font-mono text-sm ${j?"animate-pulse":""}`,children:[a.map(e=>(0,t.jsx)("div",{className:`jsx-a65d84f67987f0a8 whitespace-pre-wrap mb-1 ${"input"===e.type?"text-green-400":"system"===e.type?"text-green-600":"text-green-500"}`,children:e.content},e.id)),(0,t.jsxs)("div",{className:"jsx-a65d84f67987f0a8 flex items-center",children:[(0,t.jsxs)("span",{className:"jsx-a65d84f67987f0a8 text-green-400",children:["guest@openclaw ",p.replace("/home/owner","~")," $"," "]}),(0,t.jsxs)("div",{className:"jsx-a65d84f67987f0a8 relative flex-1",children:[(0,t.jsx)("input",{ref:A,type:"text",value:c,onChange:e=>d(e.target.value),onKeyDown:N,style:{textShadow:"0 0 5px #22c55e"},autoFocus:!0,spellCheck:!1,autoComplete:"off",autoCapitalize:"off",className:"jsx-a65d84f67987f0a8 w-full bg-transparent outline-none text-green-500 caret-green-500"}),(0,t.jsx)("span",{style:{left:`${c.length}ch`,top:0},className:"jsx-a65d84f67987f0a8 absolute animate-pulse",children:"█"})]})]}),k.length>0&&(0,t.jsxs)("div",{className:"jsx-a65d84f67987f0a8 text-green-600 text-xs mt-1 opacity-60",children:["Tab: ",k.join(", ")]})]}),(0,t.jsx)(s.AnimatePresence,{children:j&&(0,t.jsx)(r.motion.div,{initial:{opacity:0},animate:{opacity:[0,1,0,1,0]},exit:{opacity:0},transition:{duration:.5,repeat:3},className:"absolute inset-0 z-50 pointer-events-none",style:{background:"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.1) 2px, rgba(255, 0, 0, 0.1) 4px)",mixBlendMode:"overlay"}})}),(0,t.jsx)(n.default,{id:"a65d84f67987f0a8",children:"@keyframes flicker{0%{opacity:1}3%{opacity:.97}6%{opacity:1}7%{opacity:.95}8%{opacity:1}9%{opacity:.98}10%{opacity:1}to{opacity:1}}"})]})}e.s(["default",()=>x],563913)}]);