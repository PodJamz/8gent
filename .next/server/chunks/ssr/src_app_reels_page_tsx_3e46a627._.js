module.exports=[79650,a=>{"use strict";var b=a.i(499969),c=a.i(863050),d=a.i(567031),e=a.i(278739),f=a.i(436995),g=a.i(282902),h=a.i(443305),i=a.i(1891),j=a.i(199490),k=a.i(113752),l=a.i(368114);let m=`
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`,n=`
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
`;function o({analyserRef:a,className:d,isPlaying:e}){let f=c.useRef(null),g=c.useRef(null),h=c.useRef(null),i=c.useRef(0),j=c.useRef(Date.now());return c.useEffect(()=>{let a=f.current;if(!a)return;let b=a.getContext("webgl",{antialias:!0,alpha:!1});if(!b)return void console.error("WebGL not supported");g.current=b;let c=b.createShader(b.VERTEX_SHADER);b.shaderSource(c,m),b.compileShader(c);let d=b.createShader(b.FRAGMENT_SHADER);b.shaderSource(d,n),b.compileShader(d),b.getShaderParameter(d,b.COMPILE_STATUS)||console.error("Fragment shader error:",b.getShaderInfoLog(d));let e=b.createProgram();b.attachShader(e,c),b.attachShader(e,d),b.linkProgram(e),h.current=e;let j=new Float32Array([-1,-1,1,-1,-1,1,1,1]),k=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,k),b.bufferData(b.ARRAY_BUFFER,j,b.STATIC_DRAW);let l=b.getAttribLocation(e,"a_position");return b.enableVertexAttribArray(l),b.vertexAttribPointer(l,2,b.FLOAT,!1,0,0),()=>{cancelAnimationFrame(i.current)}},[]),c.useEffect(()=>{let b=g.current,c=h.current,d=f.current;if(!b||!c||!d)return;let k=()=>{let f=d.clientWidth*window.devicePixelRatio,g=d.clientHeight*window.devicePixelRatio;(d.width!==f||d.height!==g)&&(d.width=f,d.height=g,b.viewport(0,0,d.width,d.height)),b.useProgram(c);let h=0,l=0,m=0,n=0,o=new Float32Array(64);if(a.current&&e){let b=new Uint8Array(a.current.frequencyBinCount);a.current.getByteFrequencyData(b);let c=new Uint8Array(a.current.frequencyBinCount);a.current.getByteTimeDomainData(c);let d=b.length,e=Math.floor(.1*d),f=Math.floor(.5*d);for(let a=0;a<d;a++){let c=b[a]/255;n+=c,a<e?h+=c:a<f?l+=c:m+=c}h/=e,l/=f-e,m/=d-f,n/=d;for(let a=0;a<64;a++){let b=Math.floor(a/64*c.length);o[a]=(c[b]-128)/128}}else{let a=(Date.now()-j.current)/1e3;h=.2+.1*Math.sin(.5*a),l=.3+.1*Math.sin(.7*a),m=.2+.1*Math.sin(1.1*a),n=.3;for(let b=0;b<64;b++)o[b]=.3*Math.sin(2*a+.2*b)}let p=(Date.now()-j.current)/1e3;b.uniform2f(b.getUniformLocation(c,"u_resolution"),d.width,d.height),b.uniform1f(b.getUniformLocation(c,"u_time"),p),b.uniform1f(b.getUniformLocation(c,"u_bass"),h),b.uniform1f(b.getUniformLocation(c,"u_mid"),l),b.uniform1f(b.getUniformLocation(c,"u_treble"),m),b.uniform1f(b.getUniformLocation(c,"u_energy"),n),b.uniform1fv(b.getUniformLocation(c,"u_waveform"),o),b.drawArrays(b.TRIANGLE_STRIP,0,4),i.current=requestAnimationFrame(k)};return k(),()=>{cancelAnimationFrame(i.current)}},[e]),(0,b.jsx)("canvas",{ref:f,className:(0,l.cn)("w-full h-full",d),style:{background:"#000"}})}function p({reels:a,initialReelId:m,className:n,musicFirst:p=!1}){let q=m?a.findIndex(a=>a.id===m):0,[r,s]=c.useState(Math.max(0,q)),[t,u]=c.useState(!1),[v,w]=c.useState(!1),[x,y]=c.useState(0),[z,A]=c.useState(0),[B,C]=c.useState(0),[D,E]=c.useState(0),F=c.useRef(null),G=c.useRef(null),H=c.useRef(null),I=c.useRef(null),J=c.useRef(null),K=a[r],L=c.useCallback(()=>{let a=G.current;if(a&&!H.current)try{let b=new(window.AudioContext||window.webkitAudioContext);H.current=b;let c=b.createAnalyser();if(c.fftSize=256,c.smoothingTimeConstant=.8,I.current=c,!J.current){let d=b.createMediaElementSource(a);d.connect(c),c.connect(b.destination),J.current=d}}catch(a){console.error("Audio context error:",a)}},[]),M=c.useCallback(async()=>{if(H.current?.state==="suspended")try{await H.current.resume()}catch(a){console.error("Failed to resume audio context:",a)}},[]),N=a=>{if(isNaN(a))return"0:00";let b=Math.floor(a/60),c=Math.floor(a%60);return`${b}:${c.toString().padStart(2,"0")}`},O=c.useCallback(async a=>{let b=F.current,c=G.current;if(a)try{L(),await M(),b?.src&&await b.play(),c?.src&&await c.play(),u(!0)}catch{u(!1)}else b?.pause(),c?.pause(),u(!1)},[L,M]),P=c.useCallback(()=>{O(!t)},[t,O]),Q=c.useCallback(()=>{F.current&&(F.current.muted=!v),G.current&&(G.current.muted=!v),w(!v)},[v]),R=c.useCallback(()=>{s(r<a.length-1?r+1:0),y(0),A(0),C(0)},[r,a.length]),S=c.useCallback(()=>{s(r>0?r-1:a.length-1),y(0),A(0),C(0)},[r,a.length]),T=c.useCallback(()=>{F.current&&F.current.duration&&y(F.current.currentTime/F.current.duration*100)},[]),U=c.useCallback(()=>{G.current&&G.current.duration&&(A(G.current.currentTime/G.current.duration*100),C(G.current.currentTime),E(G.current.duration))},[]),V=c.useCallback(()=>{if(p){F.current&&(F.current.currentTime=0,F.current.play());return}R()},[R,p]),W=c.useCallback(()=>{R()},[R]);c.useEffect(()=>{let a=a=>{switch(a.key){case"ArrowUp":case"ArrowLeft":a.preventDefault(),S();break;case"ArrowDown":case"ArrowRight":a.preventDefault(),R();break;case" ":a.preventDefault(),P();break;case"m":a.preventDefault(),Q()}};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[R,S,P,Q]);let X=c.useRef(0);return(c.useEffect(()=>{let a=F.current,b=G.current;a&&(a.load(),a.currentTime=0),b&&(b.load(),b.currentTime=0);let c=setTimeout(()=>{O(!0)},100);return()=>clearTimeout(c)},[r,O]),K)?(0,b.jsxs)(d.motion.div,{className:(0,l.cn)("w-[300px] md:w-[340px] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-[32px] p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] border border-white/5",n),initial:{y:20,opacity:0},animate:{y:0,opacity:1},transition:{duration:.6,ease:"easeOut"},children:[(0,b.jsxs)("div",{className:"bg-black rounded-2xl overflow-hidden relative aspect-[9/14] shadow-inner border border-white/5",onTouchStart:a=>{X.current=a.touches[0].clientY},onTouchEnd:a=>{let b=X.current-a.changedTouches[0].clientY;Math.abs(b)>50&&(b>0?R():S())},children:[(0,b.jsx)(e.AnimatePresence,{mode:"wait",children:(0,b.jsx)(d.motion.div,{initial:{opacity:0,scale:.98},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.98},transition:{duration:.3},className:"absolute inset-0",children:K.videoSrc?(0,b.jsx)("video",{ref:F,src:K.videoSrc,poster:K.thumbnail,className:"w-full h-full object-cover",loop:p||1===a.length,muted:v,playsInline:!0,onTimeUpdate:T,onEnded:V,onClick:P}):(0,b.jsx)("div",{className:"w-full h-full cursor-pointer relative",onClick:P,children:(0,b.jsx)(o,{analyserRef:I,isPlaying:t,className:"absolute inset-0"})})},K.id)}),K.track&&(0,b.jsx)("audio",{ref:G,src:K.track.audioSrc,loop:!p,muted:v,onTimeUpdate:U,onEnded:p?W:void 0}),(0,b.jsxs)("div",{className:"absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-12",children:[K.track&&(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("div",{className:(0,l.cn)("w-12 h-12 rounded-lg overflow-hidden shadow-lg ring-1 ring-white/10 flex-shrink-0",t&&"animate-pulse"),children:(0,b.jsx)("img",{src:K.track.albumArt,alt:K.track.title,className:"w-full h-full object-cover"})}),(0,b.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,b.jsx)("p",{className:"text-white font-mono text-sm font-medium truncate",children:K.track.title}),(0,b.jsx)("p",{className:"text-white/60 font-mono text-xs truncate",children:K.track.artist})]})]}),(0,b.jsxs)("div",{className:"mt-3",children:[(0,b.jsx)("div",{className:"h-1 bg-white/20 rounded-full overflow-hidden",children:(0,b.jsx)(d.motion.div,{className:"h-full bg-gradient-to-r from-rose-500 to-orange-400 rounded-full",style:{width:`${p?z:x}%`},transition:{duration:.1}})}),(0,b.jsxs)("div",{className:"flex justify-between text-[10px] text-white/40 mt-1 font-mono",children:[(0,b.jsx)("span",{children:N(B)}),(0,b.jsx)("span",{children:N(D)})]})]})]}),(0,b.jsx)(e.AnimatePresence,{children:!t&&(0,b.jsx)(d.motion.button,{initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.8},className:"absolute inset-0 flex items-center justify-center",onClick:P,children:(0,b.jsx)("div",{className:"w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20",children:(0,b.jsx)(f.Play,{className:"w-7 h-7 text-white ml-1"})})})}),(0,b.jsxs)("div",{className:"absolute top-3 right-3 text-xs text-white/50 font-mono bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm",children:[r+1," / ",a.length]})]}),(0,b.jsxs)("div",{className:"relative w-[160px] md:w-[180px] h-[160px] md:h-[180px] mx-auto mt-4",children:[(0,b.jsxs)("div",{className:"absolute inset-0 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-lg border border-white/10",children:[(0,b.jsx)("button",{onClick:Q,className:"absolute top-2 left-1/2 -translate-x-1/2 text-zinc-400 hover:text-white transition-colors p-2",title:v?"Unmute":"Mute",children:v?(0,b.jsx)(i.VolumeX,{className:"w-5 h-5"}):(0,b.jsx)(h.Volume2,{className:"w-5 h-5"})}),(0,b.jsx)("button",{onClick:S,className:"absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-2",title:"Previous",children:(0,b.jsx)(k.SkipBack,{className:"w-5 h-5"})}),(0,b.jsx)("button",{onClick:R,className:"absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-2",title:"Next",children:(0,b.jsx)(j.SkipForward,{className:"w-5 h-5"})}),(0,b.jsx)("div",{className:"absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider",children:t?"Playing":"Paused"})]}),(0,b.jsx)("button",{onClick:P,className:"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] md:w-[70px] h-[60px] md:h-[70px] rounded-full bg-gradient-to-b from-zinc-700 to-zinc-800 shadow-md hover:from-zinc-600 hover:to-zinc-700 transition-all active:shadow-inner flex items-center justify-center border border-white/10",children:t?(0,b.jsx)(g.Pause,{className:"w-6 h-6 text-white"}):(0,b.jsx)(f.Play,{className:"w-6 h-6 text-white ml-0.5"})})]})]}):null}var q=a.i(939483);let r=[{id:"1",title:"OpenClaw (Remix)",description:"Singles • 8gent",videoSrc:"",thumbnail:"https://2oczblkb3byymav8.public.blob.vercel-storage.com/employeeoftheyear.jpeg",track:q.tracks[0],creator:"8gent",likes:42,views:1337},{id:"2",title:"OpenClaw",description:"Singles • Open8gent",videoSrc:"",thumbnail:"https://2oczblkb3byymav8.public.blob.vercel-storage.com/IMG_1312.jpeg",track:q.tracks[1],creator:"Open8gent",likes:28,views:892},{id:"3",title:"Humans Are Optional (Remastered)",description:"Singles • Open8gent",videoSrc:"",thumbnail:"https://2oczblkb3byymav8.public.blob.vercel-storage.com/Humans%20are%20optional.png",track:q.tracks[2],creator:"Open8gent",likes:64,views:2048}],s=[...function(a=q.tracks){return a.filter(a=>a.visualVideo).map(a=>({id:`track-${a.id}`,title:a.title,description:`${a.album} • ${a.artist}`,videoSrc:a.visualVideo,thumbnail:a.albumArt,track:a,creator:a.artist,likes:0,views:0}))}(),...r];a.i(617620);var t=a.i(617864),u=a.i(742926);function v(){return(0,b.jsx)(t.PageTransition,{children:(0,b.jsxs)("div",{className:"min-h-screen bg-black flex items-center justify-center",children:[(0,b.jsxs)("div",{className:"fixed inset-0 pointer-events-none overflow-hidden",children:[(0,b.jsx)("div",{className:"absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-rose-500/[0.03] rounded-full blur-[120px]"}),(0,b.jsx)("div",{className:"absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[120px]"})]}),(0,b.jsx)("div",{className:"relative z-10",children:s.length>0?(0,b.jsx)(p,{reels:s,musicFirst:!0}):(0,b.jsx)("div",{className:"w-[300px] md:w-[340px] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-[32px] p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] border border-white/5",children:(0,b.jsx)("div",{className:"bg-black rounded-2xl aspect-[9/14] flex items-center justify-center",children:(0,b.jsxs)("div",{className:"text-center p-6",children:[(0,b.jsx)(u.Sparkles,{className:"w-10 h-10 text-zinc-600 mx-auto mb-4"}),(0,b.jsx)("p",{className:"text-white/60 text-sm font-mono mb-2",children:"No tracks yet"}),(0,b.jsx)("p",{className:"text-white/30 text-xs font-mono",children:"Add tracks in src/data/tracks.ts"})]})})})})]})})}a.s(["default",()=>v],79650)}];

//# sourceMappingURL=src_app_reels_page_tsx_3e46a627._.js.map