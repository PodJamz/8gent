(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,81670,e=>{"use strict";var t=e.i(91071);e.s(["useLoader",()=>t.G])},520132,e=>{"use strict";var t=e.i(923041),r=e.i(724114),a=e.i(238949),l=e.i(81670);let o=e=>e===Object(e)&&!Array.isArray(e)&&"function"!=typeof e;function s(e,s){let n=(0,a.useThree)(e=>e.gl),i=(0,l.useLoader)(r.TextureLoader,o(e)?Object.values(e):e);return(0,t.useLayoutEffect)(()=>{null==s||s(i)},[s]),(0,t.useEffect)(()=>{if("initTexture"in n){let e=[];Array.isArray(i)?e=i:i instanceof r.Texture?e=[i]:o(i)&&(e=Object.values(i)),e.forEach(e=>{e instanceof r.Texture&&n.initTexture(e)})}},[n,i]),(0,t.useMemo)(()=>{if(!o(e))return i;{let t={},r=0;for(let a in e)t[a]=i[r++];return t}},[e,i])}s.preload=e=>l.useLoader.preload(r.TextureLoader,e),s.clear=e=>l.useLoader.clear(r.TextureLoader,e),e.s(["useTexture",()=>s])},241394,e=>{"use strict";var t=e.i(726151),r=e.i(140113),a=e.i(923041),l=e.i(117448),o=e.i(393658),s=e.i(520132),n=e.i(724114);function i({texture:e,position:r,scale:l,material:o}){let s=(0,a.useRef)(null),[n,i]=(0,a.useState)(!1);return(0,a.useEffect)(()=>{o&&e&&(o.uniforms.map.value=e)},[o,e]),(0,a.useEffect)(()=>{o&&o.uniforms&&(o.uniforms.isHovered.value=+!!n)},[o,n]),(0,t.jsx)("mesh",{ref:s,position:r,scale:l,material:o,onPointerEnter:()=>i(!0),onPointerLeave:()=>i(!1),children:(0,t.jsx)("planeGeometry",{args:[1,1,32,32]})})}function c({images:e,speed:r=1,visibleCount:l=8,fadeSettings:c={fadeIn:{start:.05,end:.15},fadeOut:{start:.85,end:.95}},blurSettings:u={blurIn:{start:0,end:.1},blurOut:{start:.9,end:1},maxBlur:3}}){let[f,d]=(0,a.useState)(0),[m,p]=(0,a.useState)(!0),h=(0,a.useRef)(Date.now()),g=(0,a.useMemo)(()=>e.map(e=>"string"==typeof e?{src:e,alt:""}:e),[e]),v=(0,s.useTexture)(g.map(e=>e.src)),x=(0,a.useMemo)(()=>Array.from({length:l},()=>new n.ShaderMaterial({transparent:!0,uniforms:{map:{value:null},opacity:{value:1},blurAmount:{value:0},scrollForce:{value:0},time:{value:0},isHovered:{value:0}},vertexShader:`
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vUv = uv;
        vNormal = normal;

        vec3 pos = position;

        // Create smooth curving based on scroll force
        float curveIntensity = scrollForce * 0.3;

        // Base curve across the plane based on distance from center
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;

        // Add gentle cloth-like ripples
        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;

        // Flag waving effect when hovered
        float flagWave = 0.0;
        if (isHovered > 0.5) {
          // Create flag-like wave from left to right
          float wavePhase = pos.x * 3.0 + time * 8.0;
          float waveAmplitude = sin(wavePhase) * 0.1;
          // Damping effect - stronger wave on the right side (free edge)
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          flagWave = waveAmplitude * dampening;

          // Add secondary smaller waves for more realistic flag motion
          float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
          flagWave += secondaryWave;
        }

        // Apply Z displacement for curving effect (inverted) with cloth ripples and flag wave
        pos.z -= (curve + clothEffect + flagWave);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,fragmentShader:`
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vec4 color = texture2D(map, vUv);

        // Simple blur approximation
        if (blurAmount > 0.0) {
          vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
          vec4 blurred = vec4(0.0);
          float total = 0.0;

          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }

        // Add subtle lighting effect based on curving
        float curveHighlight = abs(scrollForce) * 0.05;
        color.rgb += vec3(curveHighlight * 0.1);

        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `})),[l]),b=(0,a.useMemo)(()=>{let e=[];for(let t=0;t<l;t++){let r=2.618*t%(2*Math.PI),a=(1.618*t+Math.PI/3)%(2*Math.PI),l=t%3*1.2*Math.sin(r)*8/3,o=(t+1)%4*.8*Math.cos(a)*8/4;e.push({x:l,y:o})}return e},[l]),y=g.length,w=(0,a.useRef)(Array.from({length:l},(e,t)=>({index:t,z:l>0?50/l*t%50:0,imageIndex:y>0?t%y:0,x:b[t]?.x??0,y:b[t]?.y??0})));(0,a.useEffect)(()=>{w.current=Array.from({length:l},(e,t)=>({index:t,z:l>0?50/Math.max(l,1)*t%50:0,imageIndex:y>0?t%y:0,x:b[t]?.x??0,y:b[t]?.y??0}))},[50,b,y,l]);let j=(0,a.useCallback)(e=>{e.preventDefault(),d(t=>t+.01*e.deltaY*r),p(!1),h.current=Date.now()},[r]),S=(0,a.useCallback)(e=>{"ArrowUp"===e.key||"ArrowLeft"===e.key?(d(e=>e-2*r),p(!1),h.current=Date.now()):("ArrowDown"===e.key||"ArrowRight"===e.key)&&(d(e=>e+2*r),p(!1),h.current=Date.now())},[r]);return((0,a.useEffect)(()=>{let e=document.querySelector("canvas");if(e)return e.addEventListener("wheel",j,{passive:!1}),document.addEventListener("keydown",S),()=>{e.removeEventListener("wheel",j),document.removeEventListener("keydown",S)}},[j,S]),(0,a.useEffect)(()=>{let e=setInterval(()=>{Date.now()-h.current>3e3&&p(!0)},1e3);return()=>clearInterval(e)},[]),(0,o.useFrame)((e,t)=>{m&&d(e=>e+.3*t),d(e=>.95*e);let r=e.clock.getElapsedTime();x.forEach(e=>{e&&e.uniforms&&(e.uniforms.time.value=r,e.uniforms.scrollForce.value=f)});let a=y>0?l%y||y:0;w.current.forEach((e,r)=>{let l=e.z+f*t*10,o=0,s=0;if(l>=50?(o=Math.floor(l/50),l-=50*o):l<0&&(s=Math.ceil(-l/50),l+=50*s),o>0&&a>0&&y>0&&(e.imageIndex=(e.imageIndex+o*a)%y),s>0&&a>0&&y>0){let t=e.imageIndex-s*a;e.imageIndex=(t%y+y)%y}e.z=(l%50+50)%50,e.x=b[r]?.x??0,e.y=b[r]?.y??0;let n=e.z/50,i=1;n>=c.fadeIn.start&&n<=c.fadeIn.end?i=(n-c.fadeIn.start)/(c.fadeIn.end-c.fadeIn.start):n<c.fadeIn.start?i=0:n>=c.fadeOut.start&&n<=c.fadeOut.end?i=1-(n-c.fadeOut.start)/(c.fadeOut.end-c.fadeOut.start):n>c.fadeOut.end&&(i=0),i=Math.max(0,Math.min(1,i));let d=0;if(n>=u.blurIn.start&&n<=u.blurIn.end){let e=(n-u.blurIn.start)/(u.blurIn.end-u.blurIn.start);d=u.maxBlur*(1-e)}else if(n<u.blurIn.start)d=u.maxBlur;else if(n>=u.blurOut.start&&n<=u.blurOut.end){let e=(n-u.blurOut.start)/(u.blurOut.end-u.blurOut.start);d=u.maxBlur*e}else n>u.blurOut.end&&(d=u.maxBlur);d=Math.max(0,Math.min(u.maxBlur,d));let m=x[r];m&&m.uniforms&&(m.uniforms.opacity.value=i,m.uniforms.blurAmount.value=d)})}),0===g.length)?null:(0,t.jsx)(t.Fragment,{children:w.current.map((e,r)=>{let a=v[e.imageIndex],l=x[r];if(!a||!l)return null;let o=e.z-25,s=a.image?a.image.width/a.image.height:1;return(0,t.jsx)(i,{texture:a,position:[e.x,e.y,o],scale:s>1?[2*s,2,1]:[2,2/s,1],material:l},e.index)})})}function u({images:e}){let r=(0,a.useMemo)(()=>e.map(e=>"string"==typeof e?{src:e,alt:""}:e),[e]);return(0,t.jsxs)("div",{className:"flex flex-col items-center justify-center h-full bg-gray-100 p-4",children:[(0,t.jsx)("p",{className:"text-gray-600 mb-4",children:"WebGL not supported. Showing image list:"}),(0,t.jsx)("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto",children:r.map((e,r)=>(0,t.jsx)("img",{src:"string"==typeof e?e:e.src,alt:"string"==typeof e?"":e.alt,className:"w-full h-32 object-cover rounded"},r))})]})}function f({images:e,className:r="h-96 w-full",style:o,speed:s,zSpacing:n,visibleCount:i,falloff:f,fadeSettings:d={fadeIn:{start:.05,end:.25},fadeOut:{start:.4,end:.43}},blurSettings:m={blurIn:{start:0,end:.1},blurOut:{start:.4,end:.43},maxBlur:8}}){let[p,h]=(0,a.useState)(!0);return((0,a.useEffect)(()=>{try{let e=document.createElement("canvas");e.getContext("webgl")||e.getContext("experimental-webgl")||h(!1)}catch{h(!1)}},[]),p)?(0,t.jsx)("div",{className:r,style:o,children:(0,t.jsx)(l.Canvas,{camera:{position:[0,0,0],fov:55},gl:{antialias:!0,alpha:!0},children:(0,t.jsx)(c,{images:e,speed:s,zSpacing:n,visibleCount:i,falloff:f,fadeSettings:d,blurSettings:m})})}):(0,t.jsx)("div",{className:r,style:o,children:(0,t.jsx)(u,{images:e})})}let d=[{src:"https://2oczblkb3byymav8.public.blob.vercel-storage.com/FB394334-6F13-446C-8B43-57C993D05E01.png",alt:"8gent Vision"},{src:"https://2oczblkb3byymav8.public.blob.vercel-storage.com/0505D0AD-9EBF-4675-B3AC-ABF92501F024.png",alt:"8gent Workspace"},{src:"/photos/aurora.jpeg",alt:"Aurora"},{src:"/photos/Corballis.jpeg",alt:"Corballis"},{src:"/photos/Donabatebeach.jpeg",alt:"Donabate Beach"},{src:"/photos/Donabatebeach2.jpeg",alt:"Donabate Beach"},{src:"/photos/Glenofthedowns.jpeg",alt:"Glen of the Downs"},{src:"/photos/Mistysunrise.jpeg",alt:"Misty Sunrise"},{src:"/photos/Nightsky.jpeg",alt:"Night Sky"},{src:"/photos/Nightskytree.jpeg",alt:"Night Sky Tree"},{src:"/photos/Portranedemense.jpeg",alt:"Portrane Demesne"},{src:"/photos/Robin.jpeg",alt:"Robin"},{src:"/photos/Skygrange.jpeg",alt:"Sky Grange"},{src:"/photos/Sunriseoverhowth.jpeg",alt:"Sunrise over Howth"},{src:"/photos/Sunriseportrane.jpeg",alt:"Sunrise Portrane"},{src:"/photos/sunsetachill.jpeg",alt:"Sunset Achill"},{src:"/photos/SunsetPortrane.jpeg",alt:"Sunset Portrane"},{src:"/photos/SunsetSalvador.jpeg",alt:"Sunset Salvador"}];function m(){return(0,t.jsxs)("main",{className:"min-h-screen bg-black",children:[(0,t.jsx)(f,{images:d,speed:1.2,zSpacing:3,visibleCount:12,falloff:{near:.8,far:14},className:"h-screen w-full"}),(0,t.jsx)("div",{className:"h-screen inset-0 pointer-events-none fixed flex items-center justify-center text-center px-3 mix-blend-exclusion text-white",children:(0,t.jsxs)("h1",{className:"font-serif text-4xl md:text-7xl tracking-tight",children:[(0,t.jsx)("span",{className:"italic",children:"I create;"})," therefore I am"]})}),(0,t.jsxs)("div",{className:"text-center fixed bottom-24 left-0 right-0 font-mono uppercase text-[11px] font-semibold text-white/60",children:[(0,t.jsx)("p",{children:"Use mouse wheel, arrow keys, or touch to navigate"}),(0,t.jsx)("p",{className:"opacity-60",children:"Auto-play resumes after 3 seconds of inactivity"})]}),(0,t.jsx)(r.default,{href:"/",className:"fixed bottom-8 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm z-10",children:"← Back to 8gent"})]})}e.s(["default",()=>m],241394)}]);