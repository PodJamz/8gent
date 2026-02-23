(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,222715,e=>{"use strict";var t=e.i(726151),r=e.i(923041),a=e.i(662582),i=e.i(278124),n=e.i(86066),o=e.i(576161),l=e.i(684750),s=e.i(134863),c=e.i(574238),u=e.i(754401),d=e.i(975157);let m=`
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`,f=`
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_treble;
  uniform float u_energy;
  uniform float u_waveform[64];

  #define PI 3.14159265359

  // Noise functions
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  // Color palette
  vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 centered = uv - 0.5;
    centered.x *= u_resolution.x / u_resolution.y;

    float time = u_time * 0.5;

    // Radial distance from center
    float dist = length(centered);
    float angle = atan(centered.y, centered.x);

    // Audio-reactive warping
    float warp = u_bass * 0.3 + u_energy * 0.2;
    vec2 warped = centered;
    warped += vec2(
      sin(angle * 3.0 + time) * warp * 0.1,
      cos(angle * 2.0 - time) * warp * 0.1
    );

    // Layered noise with audio reactivity
    float n1 = fbm(warped * (3.0 + u_mid * 2.0) + time * 0.3);
    float n2 = fbm(warped * (5.0 + u_treble * 3.0) - time * 0.2 + n1);
    float n3 = fbm(warped * (2.0 + u_bass) + vec2(n1, n2) * 0.5);

    // Combine noise layers
    float pattern = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    // Add circular waveform visualization
    float waveIndex = (angle + PI) / (2.0 * PI) * 64.0;
    int idx = int(mod(waveIndex, 64.0));
    float waveVal = 0.0;
    for (int i = 0; i < 64; i++) {
      if (i == idx) waveVal = u_waveform[i];
    }

    float waveRing = smoothstep(0.02, 0.0, abs(dist - 0.3 - waveVal * 0.15 * u_energy));

    // Pulsing rings
    float rings = sin(dist * 20.0 - time * 2.0 - u_bass * 5.0) * 0.5 + 0.5;
    rings *= smoothstep(0.8, 0.2, dist);

    // Color based on pattern and audio
    float colorShift = pattern + time * 0.1 + u_mid * 0.5;
    vec3 color = palette(colorShift);

    // Add bass-reactive glow
    color += vec3(0.8, 0.2, 0.4) * u_bass * rings * 0.5;

    // Add treble sparkles
    float sparkle = step(0.97, random(uv * 100.0 + time)) * u_treble * 2.0;
    color += vec3(1.0) * sparkle;

    // Add waveform ring
    color += vec3(0.3, 0.6, 1.0) * waveRing * 2.0;

    // Vignette
    float vignette = 1.0 - dist * 0.8;
    color *= vignette;

    // Energy-based brightness boost
    color *= 0.7 + u_energy * 0.5;

    gl_FragColor = vec4(color, 1.0);
  }
`;function h({analyserRef:e,className:a,isPlaying:i}){let n=r.useRef(null),o=r.useRef(null),l=r.useRef(null),s=r.useRef(0),c=r.useRef(Date.now());return r.useEffect(()=>{let e=n.current;if(!e)return;let t=e.getContext("webgl",{antialias:!0,alpha:!1});if(!t)return void console.error("WebGL not supported");o.current=t;let r=t.createShader(t.VERTEX_SHADER);t.shaderSource(r,m),t.compileShader(r);let a=t.createShader(t.FRAGMENT_SHADER);t.shaderSource(a,f),t.compileShader(a),t.getShaderParameter(a,t.COMPILE_STATUS)||console.error("Fragment shader error:",t.getShaderInfoLog(a));let i=t.createProgram();t.attachShader(i,r),t.attachShader(i,a),t.linkProgram(i),l.current=i;let c=new Float32Array([-1,-1,1,-1,-1,1,1,1]),u=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,u),t.bufferData(t.ARRAY_BUFFER,c,t.STATIC_DRAW);let d=t.getAttribLocation(i,"a_position");return t.enableVertexAttribArray(d),t.vertexAttribPointer(d,2,t.FLOAT,!1,0,0),()=>{cancelAnimationFrame(s.current)}},[]),r.useEffect(()=>{let t=o.current,r=l.current,a=n.current;if(!t||!r||!a)return;let u=()=>{let n=a.clientWidth*window.devicePixelRatio,o=a.clientHeight*window.devicePixelRatio;(a.width!==n||a.height!==o)&&(a.width=n,a.height=o,t.viewport(0,0,a.width,a.height)),t.useProgram(r);let l=0,d=0,m=0,f=0,h=new Float32Array(64);if(e.current&&i){let t=new Uint8Array(e.current.frequencyBinCount);e.current.getByteFrequencyData(t);let r=new Uint8Array(e.current.frequencyBinCount);e.current.getByteTimeDomainData(r);let a=t.length,i=Math.floor(.1*a),n=Math.floor(.5*a);for(let e=0;e<a;e++){let r=t[e]/255;f+=r,e<i?l+=r:e<n?d+=r:m+=r}l/=i,d/=n-i,m/=a-n,f/=a;for(let e=0;e<64;e++){let t=Math.floor(e/64*r.length);h[e]=(r[t]-128)/128}}else{let e=(Date.now()-c.current)/1e3;l=.2+.1*Math.sin(.5*e),d=.3+.1*Math.sin(.7*e),m=.2+.1*Math.sin(1.1*e),f=.3;for(let t=0;t<64;t++)h[t]=.3*Math.sin(2*e+.2*t)}let x=(Date.now()-c.current)/1e3;t.uniform2f(t.getUniformLocation(r,"u_resolution"),a.width,a.height),t.uniform1f(t.getUniformLocation(r,"u_time"),x),t.uniform1f(t.getUniformLocation(r,"u_bass"),l),t.uniform1f(t.getUniformLocation(r,"u_mid"),d),t.uniform1f(t.getUniformLocation(r,"u_treble"),m),t.uniform1f(t.getUniformLocation(r,"u_energy"),f),t.uniform1fv(t.getUniformLocation(r,"u_waveform"),h),t.drawArrays(t.TRIANGLE_STRIP,0,4),s.current=requestAnimationFrame(u)};return u(),()=>{cancelAnimationFrame(s.current)}},[i]),(0,t.jsx)("canvas",{ref:n,className:(0,d.cn)("w-full h-full",a),style:{background:"#000"}})}function x({reels:e,initialReelId:m,className:f,musicFirst:x=!1}){let b=m?e.findIndex(e=>e.id===m):0,[p,v]=r.useState(Math.max(0,b)),[w,g]=r.useState(!1),[y,k]=r.useState(!1),[j,N]=r.useState(0),[_,A]=r.useState(0),[S,C]=r.useState(0),[R,T]=r.useState(0),P=r.useRef(null),E=r.useRef(null),F=r.useRef(null),U=r.useRef(null),z=r.useRef(null),L=e[p],M=r.useCallback(()=>{let e=E.current;if(e&&!F.current)try{let t=new(window.AudioContext||window.webkitAudioContext);F.current=t;let r=t.createAnalyser();if(r.fftSize=256,r.smoothingTimeConstant=.8,U.current=r,!z.current){let a=t.createMediaElementSource(e);a.connect(r),r.connect(t.destination),z.current=a}}catch(e){console.error("Audio context error:",e)}},[]),D=r.useCallback(async()=>{if(F.current?.state==="suspended")try{await F.current.resume()}catch(e){console.error("Failed to resume audio context:",e)}},[]),I=e=>{if(isNaN(e))return"0:00";let t=Math.floor(e/60),r=Math.floor(e%60);return`${t}:${r.toString().padStart(2,"0")}`},O=r.useCallback(async e=>{let t=P.current,r=E.current;if(e)try{M(),await D(),t?.src&&await t.play(),r?.src&&await r.play(),g(!0)}catch{g(!1)}else t?.pause(),r?.pause(),g(!1)},[M,D]),B=r.useCallback(()=>{O(!w)},[w,O]),V=r.useCallback(()=>{P.current&&(P.current.muted=!y),E.current&&(E.current.muted=!y),k(!y)},[y]),$=r.useCallback(()=>{v(p<e.length-1?p+1:0),N(0),A(0),C(0)},[p,e.length]),H=r.useCallback(()=>{v(p>0?p-1:e.length-1),N(0),A(0),C(0)},[p,e.length]),q=r.useCallback(()=>{P.current&&P.current.duration&&N(P.current.currentTime/P.current.duration*100)},[]),G=r.useCallback(()=>{E.current&&E.current.duration&&(A(E.current.currentTime/E.current.duration*100),C(E.current.currentTime),T(E.current.duration))},[]),Y=r.useCallback(()=>{if(x){P.current&&(P.current.currentTime=0,P.current.play());return}$()},[$,x]),W=r.useCallback(()=>{$()},[$]);r.useEffect(()=>{let e=e=>{switch(e.key){case"ArrowUp":case"ArrowLeft":e.preventDefault(),H();break;case"ArrowDown":case"ArrowRight":e.preventDefault(),$();break;case" ":e.preventDefault(),B();break;case"m":e.preventDefault(),V()}};return window.addEventListener("keydown",e),()=>window.removeEventListener("keydown",e)},[$,H,B,V]);let K=r.useRef(0);return(r.useEffect(()=>{let e=P.current,t=E.current;e&&(e.load(),e.currentTime=0),t&&(t.load(),t.currentTime=0);let r=setTimeout(()=>{O(!0)},100);return()=>clearTimeout(r)},[p,O]),L)?(0,t.jsxs)(a.motion.div,{className:(0,d.cn)("w-[300px] md:w-[340px] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-[32px] p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] border border-white/5",f),initial:{y:20,opacity:0},animate:{y:0,opacity:1},transition:{duration:.6,ease:"easeOut"},children:[(0,t.jsxs)("div",{className:"bg-black rounded-2xl overflow-hidden relative aspect-[9/14] shadow-inner border border-white/5",onTouchStart:e=>{K.current=e.touches[0].clientY},onTouchEnd:e=>{let t=K.current-e.changedTouches[0].clientY;Math.abs(t)>50&&(t>0?$():H())},children:[(0,t.jsx)(i.AnimatePresence,{mode:"wait",children:(0,t.jsx)(a.motion.div,{initial:{opacity:0,scale:.98},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.98},transition:{duration:.3},className:"absolute inset-0",children:L.videoSrc?(0,t.jsx)("video",{ref:P,src:L.videoSrc,poster:L.thumbnail,className:"w-full h-full object-cover",loop:x||1===e.length,muted:y,playsInline:!0,onTimeUpdate:q,onEnded:Y,onClick:B}):(0,t.jsx)("div",{className:"w-full h-full cursor-pointer relative",onClick:B,children:(0,t.jsx)(h,{analyserRef:U,isPlaying:w,className:"absolute inset-0"})})},L.id)}),L.track&&(0,t.jsx)("audio",{ref:E,src:L.track.audioSrc,loop:!x,muted:y,onTimeUpdate:G,onEnded:x?W:void 0}),(0,t.jsxs)("div",{className:"absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-12",children:[L.track&&(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:(0,d.cn)("w-12 h-12 rounded-lg overflow-hidden shadow-lg ring-1 ring-white/10 flex-shrink-0",w&&"animate-pulse"),children:(0,t.jsx)("img",{src:L.track.albumArt,alt:L.track.title,className:"w-full h-full object-cover"})}),(0,t.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,t.jsx)("p",{className:"text-white font-mono text-sm font-medium truncate",children:L.track.title}),(0,t.jsx)("p",{className:"text-white/60 font-mono text-xs truncate",children:L.track.artist})]})]}),(0,t.jsxs)("div",{className:"mt-3",children:[(0,t.jsx)("div",{className:"h-1 bg-white/20 rounded-full overflow-hidden",children:(0,t.jsx)(a.motion.div,{className:"h-full bg-gradient-to-r from-rose-500 to-orange-400 rounded-full",style:{width:`${x?_:j}%`},transition:{duration:.1}})}),(0,t.jsxs)("div",{className:"flex justify-between text-[10px] text-white/40 mt-1 font-mono",children:[(0,t.jsx)("span",{children:I(S)}),(0,t.jsx)("span",{children:I(R)})]})]})]}),(0,t.jsx)(i.AnimatePresence,{children:!w&&(0,t.jsx)(a.motion.button,{initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.8},className:"absolute inset-0 flex items-center justify-center",onClick:B,children:(0,t.jsx)("div",{className:"w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20",children:(0,t.jsx)(n.Play,{className:"w-7 h-7 text-white ml-1"})})})}),(0,t.jsxs)("div",{className:"absolute top-3 right-3 text-xs text-white/50 font-mono bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm",children:[p+1," / ",e.length]})]}),(0,t.jsxs)("div",{className:"relative w-[160px] md:w-[180px] h-[160px] md:h-[180px] mx-auto mt-4",children:[(0,t.jsxs)("div",{className:"absolute inset-0 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-lg border border-white/10",children:[(0,t.jsx)("button",{onClick:V,className:"absolute top-2 left-1/2 -translate-x-1/2 text-zinc-400 hover:text-white transition-colors p-2",title:y?"Unmute":"Mute",children:y?(0,t.jsx)(s.VolumeX,{className:"w-5 h-5"}):(0,t.jsx)(l.Volume2,{className:"w-5 h-5"})}),(0,t.jsx)("button",{onClick:H,className:"absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-2",title:"Previous",children:(0,t.jsx)(u.SkipBack,{className:"w-5 h-5"})}),(0,t.jsx)("button",{onClick:$,className:"absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-2",title:"Next",children:(0,t.jsx)(c.SkipForward,{className:"w-5 h-5"})}),(0,t.jsx)("div",{className:"absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider",children:w?"Playing":"Paused"})]}),(0,t.jsx)("button",{onClick:B,className:"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] md:w-[70px] h-[60px] md:h-[70px] rounded-full bg-gradient-to-b from-zinc-700 to-zinc-800 shadow-md hover:from-zinc-600 hover:to-zinc-700 transition-all active:shadow-inner flex items-center justify-center border border-white/10",children:w?(0,t.jsx)(o.Pause,{className:"w-6 h-6 text-white"}):(0,t.jsx)(n.Play,{className:"w-6 h-6 text-white ml-0.5"})})]})]}):null}var b=e.i(305383);let p=[{id:"1",title:"OpenClaw (Remix)",description:"Singles • 8gent",videoSrc:"",thumbnail:"https://2oczblkb3byymav8.public.blob.vercel-storage.com/employeeoftheyear.jpeg",track:b.tracks[0],creator:"8gent",likes:42,views:1337},{id:"2",title:"OpenClaw",description:"Singles • Open8gent",videoSrc:"",thumbnail:"https://2oczblkb3byymav8.public.blob.vercel-storage.com/IMG_1312.jpeg",track:b.tracks[1],creator:"Open8gent",likes:28,views:892},{id:"3",title:"Humans Are Optional (Remastered)",description:"Singles • Open8gent",videoSrc:"",thumbnail:"https://2oczblkb3byymav8.public.blob.vercel-storage.com/Humans%20are%20optional.png",track:b.tracks[2],creator:"Open8gent",likes:64,views:2048}],v=[...function(e=b.tracks){return e.filter(e=>e.visualVideo).map(e=>({id:`track-${e.id}`,title:e.title,description:`${e.album} • ${e.artist}`,videoSrc:e.visualVideo,thumbnail:e.albumArt,track:e,creator:e.artist,likes:0,views:0}))}(),...p];e.i(621586);var w=e.i(910158),g=e.i(843762);function y(){return(0,t.jsx)(w.PageTransition,{children:(0,t.jsxs)("div",{className:"min-h-screen bg-black flex items-center justify-center",children:[(0,t.jsxs)("div",{className:"fixed inset-0 pointer-events-none overflow-hidden",children:[(0,t.jsx)("div",{className:"absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-rose-500/[0.03] rounded-full blur-[120px]"}),(0,t.jsx)("div",{className:"absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[120px]"})]}),(0,t.jsx)("div",{className:"relative z-10",children:v.length>0?(0,t.jsx)(x,{reels:v,musicFirst:!0}):(0,t.jsx)("div",{className:"w-[300px] md:w-[340px] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-[32px] p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] border border-white/5",children:(0,t.jsx)("div",{className:"bg-black rounded-2xl aspect-[9/14] flex items-center justify-center",children:(0,t.jsxs)("div",{className:"text-center p-6",children:[(0,t.jsx)(g.Sparkles,{className:"w-10 h-10 text-zinc-600 mx-auto mb-4"}),(0,t.jsx)("p",{className:"text-white/60 text-sm font-mono mb-2",children:"No tracks yet"}),(0,t.jsx)("p",{className:"text-white/30 text-xs font-mono",children:"Add tracks in src/data/tracks.ts"})]})})})})]})})}e.s(["default",()=>y],222715)},276622,e=>{e.v(t=>Promise.all(["static/chunks/e9a36fd48fa91706.js","static/chunks/6f90eb9222fdcbd4.js"].map(t=>e.l(t))).then(()=>t(556113)))}]);