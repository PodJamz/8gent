module.exports=[532572,a=>{"use strict";var b=a.i(863050),c=a.i(835572),d=a.i(572423),e=a.i(235871);let f=a=>a===Object(a)&&!Array.isArray(a)&&"function"!=typeof a;function g(a,g){let h=(0,d.useThree)(a=>a.gl),i=(0,e.useLoader)(c.TextureLoader,f(a)?Object.values(a):a);return(0,b.useLayoutEffect)(()=>{null==g||g(i)},[g]),(0,b.useEffect)(()=>{if("initTexture"in h){let a=[];Array.isArray(i)?a=i:i instanceof c.Texture?a=[i]:f(i)&&(a=Object.values(i)),a.forEach(a=>{a instanceof c.Texture&&h.initTexture(a)})}},[h,i]),(0,b.useMemo)(()=>{if(!f(a))return i;{let b={},c=0;for(let d in a)b[d]=i[c++];return b}},[a,i])}g.preload=a=>e.useLoader.preload(c.TextureLoader,a),g.clear=a=>e.useLoader.clear(c.TextureLoader,a),a.s(["useTexture",()=>g])},949098,a=>{"use strict";var b=a.i(499969),c=a.i(189198),d=a.i(863050),e=a.i(926725),f=a.i(75812),g=a.i(532572),h=a.i(835572);function i({texture:a,position:c,scale:e,material:f}){let g=(0,d.useRef)(null),[h,i]=(0,d.useState)(!1);return(0,d.useEffect)(()=>{f&&a&&(f.uniforms.map.value=a)},[f,a]),(0,d.useEffect)(()=>{f&&f.uniforms&&(f.uniforms.isHovered.value=+!!h)},[f,h]),(0,b.jsx)("mesh",{ref:g,position:c,scale:e,material:f,onPointerEnter:()=>i(!0),onPointerLeave:()=>i(!1),children:(0,b.jsx)("planeGeometry",{args:[1,1,32,32]})})}function j({images:a,speed:c=1,visibleCount:e=8,fadeSettings:j={fadeIn:{start:.05,end:.15},fadeOut:{start:.85,end:.95}},blurSettings:k={blurIn:{start:0,end:.1},blurOut:{start:.9,end:1},maxBlur:3}}){let[l,m]=(0,d.useState)(0),[n,o]=(0,d.useState)(!0),p=(0,d.useRef)(Date.now()),q=(0,d.useMemo)(()=>a.map(a=>"string"==typeof a?{src:a,alt:""}:a),[a]),r=(0,g.useTexture)(q.map(a=>a.src)),s=(0,d.useMemo)(()=>Array.from({length:e},()=>new h.ShaderMaterial({transparent:!0,uniforms:{map:{value:null},opacity:{value:1},blurAmount:{value:0},scrollForce:{value:0},time:{value:0},isHovered:{value:0}},vertexShader:`
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
    `})),[e]),t=(0,d.useMemo)(()=>{let a=[];for(let b=0;b<e;b++){let c=2.618*b%(2*Math.PI),d=(1.618*b+Math.PI/3)%(2*Math.PI),e=b%3*1.2*Math.sin(c)*8/3,f=(b+1)%4*.8*Math.cos(d)*8/4;a.push({x:e,y:f})}return a},[e]),u=q.length,v=(0,d.useRef)(Array.from({length:e},(a,b)=>({index:b,z:e>0?50/e*b%50:0,imageIndex:u>0?b%u:0,x:t[b]?.x??0,y:t[b]?.y??0})));(0,d.useEffect)(()=>{v.current=Array.from({length:e},(a,b)=>({index:b,z:e>0?50/Math.max(e,1)*b%50:0,imageIndex:u>0?b%u:0,x:t[b]?.x??0,y:t[b]?.y??0}))},[50,t,u,e]);let w=(0,d.useCallback)(a=>{a.preventDefault(),m(b=>b+.01*a.deltaY*c),o(!1),p.current=Date.now()},[c]),x=(0,d.useCallback)(a=>{"ArrowUp"===a.key||"ArrowLeft"===a.key?(m(a=>a-2*c),o(!1),p.current=Date.now()):("ArrowDown"===a.key||"ArrowRight"===a.key)&&(m(a=>a+2*c),o(!1),p.current=Date.now())},[c]);return((0,d.useEffect)(()=>{let a=document.querySelector("canvas");if(a)return a.addEventListener("wheel",w,{passive:!1}),document.addEventListener("keydown",x),()=>{a.removeEventListener("wheel",w),document.removeEventListener("keydown",x)}},[w,x]),(0,d.useEffect)(()=>{let a=setInterval(()=>{Date.now()-p.current>3e3&&o(!0)},1e3);return()=>clearInterval(a)},[]),(0,f.useFrame)((a,b)=>{n&&m(a=>a+.3*b),m(a=>.95*a);let c=a.clock.getElapsedTime();s.forEach(a=>{a&&a.uniforms&&(a.uniforms.time.value=c,a.uniforms.scrollForce.value=l)});let d=u>0?e%u||u:0;v.current.forEach((a,c)=>{let e=a.z+l*b*10,f=0,g=0;if(e>=50?(f=Math.floor(e/50),e-=50*f):e<0&&(g=Math.ceil(-e/50),e+=50*g),f>0&&d>0&&u>0&&(a.imageIndex=(a.imageIndex+f*d)%u),g>0&&d>0&&u>0){let b=a.imageIndex-g*d;a.imageIndex=(b%u+u)%u}a.z=(e%50+50)%50,a.x=t[c]?.x??0,a.y=t[c]?.y??0;let h=a.z/50,i=1;h>=j.fadeIn.start&&h<=j.fadeIn.end?i=(h-j.fadeIn.start)/(j.fadeIn.end-j.fadeIn.start):h<j.fadeIn.start?i=0:h>=j.fadeOut.start&&h<=j.fadeOut.end?i=1-(h-j.fadeOut.start)/(j.fadeOut.end-j.fadeOut.start):h>j.fadeOut.end&&(i=0),i=Math.max(0,Math.min(1,i));let m=0;if(h>=k.blurIn.start&&h<=k.blurIn.end){let a=(h-k.blurIn.start)/(k.blurIn.end-k.blurIn.start);m=k.maxBlur*(1-a)}else if(h<k.blurIn.start)m=k.maxBlur;else if(h>=k.blurOut.start&&h<=k.blurOut.end){let a=(h-k.blurOut.start)/(k.blurOut.end-k.blurOut.start);m=k.maxBlur*a}else h>k.blurOut.end&&(m=k.maxBlur);m=Math.max(0,Math.min(k.maxBlur,m));let n=s[c];n&&n.uniforms&&(n.uniforms.opacity.value=i,n.uniforms.blurAmount.value=m)})}),0===q.length)?null:(0,b.jsx)(b.Fragment,{children:v.current.map((a,c)=>{let d=r[a.imageIndex],e=s[c];if(!d||!e)return null;let f=a.z-25,g=d.image?d.image.width/d.image.height:1;return(0,b.jsx)(i,{texture:d,position:[a.x,a.y,f],scale:g>1?[2*g,2,1]:[2,2/g,1],material:e},a.index)})})}function k({images:a}){let c=(0,d.useMemo)(()=>a.map(a=>"string"==typeof a?{src:a,alt:""}:a),[a]);return(0,b.jsxs)("div",{className:"flex flex-col items-center justify-center h-full bg-gray-100 p-4",children:[(0,b.jsx)("p",{className:"text-gray-600 mb-4",children:"WebGL not supported. Showing image list:"}),(0,b.jsx)("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto",children:c.map((a,c)=>(0,b.jsx)("img",{src:"string"==typeof a?a:a.src,alt:"string"==typeof a?"":a.alt,className:"w-full h-32 object-cover rounded"},c))})]})}function l({images:a,className:c="h-96 w-full",style:f,speed:g,zSpacing:h,visibleCount:i,falloff:l,fadeSettings:m={fadeIn:{start:.05,end:.25},fadeOut:{start:.4,end:.43}},blurSettings:n={blurIn:{start:0,end:.1},blurOut:{start:.4,end:.43},maxBlur:8}}){let[o,p]=(0,d.useState)(!0);return((0,d.useEffect)(()=>{try{let a=document.createElement("canvas");a.getContext("webgl")||a.getContext("experimental-webgl")||p(!1)}catch{p(!1)}},[]),o)?(0,b.jsx)("div",{className:c,style:f,children:(0,b.jsx)(e.Canvas,{camera:{position:[0,0,0],fov:55},gl:{antialias:!0,alpha:!0},children:(0,b.jsx)(j,{images:a,speed:g,zSpacing:h,visibleCount:i,falloff:l,fadeSettings:m,blurSettings:n})})}):(0,b.jsx)("div",{className:c,style:f,children:(0,b.jsx)(k,{images:a})})}let m=[{src:"https://2oczblkb3byymav8.public.blob.vercel-storage.com/FB394334-6F13-446C-8B43-57C993D05E01.png",alt:"8gent Vision"},{src:"https://2oczblkb3byymav8.public.blob.vercel-storage.com/0505D0AD-9EBF-4675-B3AC-ABF92501F024.png",alt:"8gent Workspace"},{src:"/photos/aurora.jpeg",alt:"Aurora"},{src:"/photos/Corballis.jpeg",alt:"Corballis"},{src:"/photos/Donabatebeach.jpeg",alt:"Donabate Beach"},{src:"/photos/Donabatebeach2.jpeg",alt:"Donabate Beach"},{src:"/photos/Glenofthedowns.jpeg",alt:"Glen of the Downs"},{src:"/photos/Mistysunrise.jpeg",alt:"Misty Sunrise"},{src:"/photos/Nightsky.jpeg",alt:"Night Sky"},{src:"/photos/Nightskytree.jpeg",alt:"Night Sky Tree"},{src:"/photos/Portranedemense.jpeg",alt:"Portrane Demesne"},{src:"/photos/Robin.jpeg",alt:"Robin"},{src:"/photos/Skygrange.jpeg",alt:"Sky Grange"},{src:"/photos/Sunriseoverhowth.jpeg",alt:"Sunrise over Howth"},{src:"/photos/Sunriseportrane.jpeg",alt:"Sunrise Portrane"},{src:"/photos/sunsetachill.jpeg",alt:"Sunset Achill"},{src:"/photos/SunsetPortrane.jpeg",alt:"Sunset Portrane"},{src:"/photos/SunsetSalvador.jpeg",alt:"Sunset Salvador"}];function n(){return(0,b.jsxs)("main",{className:"min-h-screen bg-black",children:[(0,b.jsx)(l,{images:m,speed:1.2,zSpacing:3,visibleCount:12,falloff:{near:.8,far:14},className:"h-screen w-full"}),(0,b.jsx)("div",{className:"h-screen inset-0 pointer-events-none fixed flex items-center justify-center text-center px-3 mix-blend-exclusion text-white",children:(0,b.jsxs)("h1",{className:"font-serif text-4xl md:text-7xl tracking-tight",children:[(0,b.jsx)("span",{className:"italic",children:"I create;"})," therefore I am"]})}),(0,b.jsxs)("div",{className:"text-center fixed bottom-24 left-0 right-0 font-mono uppercase text-[11px] font-semibold text-white/60",children:[(0,b.jsx)("p",{children:"Use mouse wheel, arrow keys, or touch to navigate"}),(0,b.jsx)("p",{className:"opacity-60",children:"Auto-play resumes after 3 seconds of inactivity"})]}),(0,b.jsx)(c.default,{href:"/",className:"fixed bottom-8 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm z-10",children:"← Back to 8gent"})]})}a.s(["default",()=>n],949098)}];

//# sourceMappingURL=_26530d9f._.js.map