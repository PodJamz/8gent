module.exports=[866197,a=>{"use strict";var b=a.i(499969),c=a.i(863050),d=a.i(926725),e=a.i(75812),f=a.i(572423),g=a.i(532572),h=a.i(935194),i=a.i(361477),j=a.i(212637),k=a.i(835572),l=a.i(199676),m=k;let n=parseInt(k.REVISION.replace(/\D+/g,""));class o extends m.ShaderMaterial{constructor(a=new m.Vector2){super({uniforms:{inputBuffer:new m.Uniform(null),depthBuffer:new m.Uniform(null),resolution:new m.Uniform(new m.Vector2),texelSize:new m.Uniform(new m.Vector2),halfTexelSize:new m.Uniform(new m.Vector2),kernel:new m.Uniform(0),scale:new m.Uniform(1),cameraNear:new m.Uniform(0),cameraFar:new m.Uniform(1),minDepthThreshold:new m.Uniform(0),maxDepthThreshold:new m.Uniform(1),depthScale:new m.Uniform(0),depthToBlurRatioBias:new m.Uniform(.25)},fragmentShader:`#include <common>
        #include <dithering_pars_fragment>      
        uniform sampler2D inputBuffer;
        uniform sampler2D depthBuffer;
        uniform float cameraNear;
        uniform float cameraFar;
        uniform float minDepthThreshold;
        uniform float maxDepthThreshold;
        uniform float depthScale;
        uniform float depthToBlurRatioBias;
        varying vec2 vUv;
        varying vec2 vUv0;
        varying vec2 vUv1;
        varying vec2 vUv2;
        varying vec2 vUv3;

        void main() {
          float depthFactor = 0.0;
          
          #ifdef USE_DEPTH
            vec4 depth = texture2D(depthBuffer, vUv);
            depthFactor = smoothstep(minDepthThreshold, maxDepthThreshold, 1.0-(depth.r * depth.a));
            depthFactor *= depthScale;
            depthFactor = max(0.0, min(1.0, depthFactor + 0.25));
          #endif
          
          vec4 sum = texture2D(inputBuffer, mix(vUv0, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv1, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv2, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv3, vUv, depthFactor));
          gl_FragColor = sum * 0.25 ;

          #include <dithering_fragment>
          #include <tonemapping_fragment>
          #include <${n>=154?"colorspace_fragment":"encodings_fragment"}>
        }`,vertexShader:`uniform vec2 texelSize;
        uniform vec2 halfTexelSize;
        uniform float kernel;
        uniform float scale;
        varying vec2 vUv;
        varying vec2 vUv0;
        varying vec2 vUv1;
        varying vec2 vUv2;
        varying vec2 vUv3;

        void main() {
          vec2 uv = position.xy * 0.5 + 0.5;
          vUv = uv;

          vec2 dUv = (texelSize * vec2(kernel) + halfTexelSize) * scale;
          vUv0 = vec2(uv.x - dUv.x, uv.y + dUv.y);
          vUv1 = vec2(uv.x + dUv.x, uv.y + dUv.y);
          vUv2 = vec2(uv.x + dUv.x, uv.y - dUv.y);
          vUv3 = vec2(uv.x - dUv.x, uv.y - dUv.y);

          gl_Position = vec4(position.xy, 1.0, 1.0);
        }`,blending:m.NoBlending,depthWrite:!1,depthTest:!1}),this.toneMapped=!1,this.setTexelSize(a.x,a.y),this.kernel=new Float32Array([0,1,2,2,3])}setTexelSize(a,b){this.uniforms.texelSize.value.set(a,b),this.uniforms.halfTexelSize.value.set(a,b).multiplyScalar(.5)}setResolution(a){this.uniforms.resolution.value.copy(a)}}class p{constructor({gl:a,resolution:b,width:c=500,height:d=500,minDepthThreshold:e=0,maxDepthThreshold:f=1,depthScale:g=0,depthToBlurRatioBias:h=.25}){this.renderToScreen=!1,this.renderTargetA=new k.WebGLRenderTarget(b,b,{minFilter:k.LinearFilter,magFilter:k.LinearFilter,stencilBuffer:!1,depthBuffer:!1,type:k.HalfFloatType}),this.renderTargetB=this.renderTargetA.clone(),this.convolutionMaterial=new o,this.convolutionMaterial.setTexelSize(1/c,1/d),this.convolutionMaterial.setResolution(new k.Vector2(c,d)),this.scene=new k.Scene,this.camera=new k.Camera,this.convolutionMaterial.uniforms.minDepthThreshold.value=e,this.convolutionMaterial.uniforms.maxDepthThreshold.value=f,this.convolutionMaterial.uniforms.depthScale.value=g,this.convolutionMaterial.uniforms.depthToBlurRatioBias.value=h,this.convolutionMaterial.defines.USE_DEPTH=g>0;const i=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),j=new Float32Array([0,0,2,0,0,2]),l=new k.BufferGeometry;l.setAttribute("position",new k.BufferAttribute(i,3)),l.setAttribute("uv",new k.BufferAttribute(j,2)),this.screen=new k.Mesh(l,this.convolutionMaterial),this.screen.frustumCulled=!1,this.scene.add(this.screen)}render(a,b,c){let d,e,f,g=this.scene,h=this.camera,i=this.renderTargetA,j=this.renderTargetB,k=this.convolutionMaterial,l=k.uniforms;l.depthBuffer.value=b.depthTexture;let m=k.kernel,n=b;for(e=0,f=m.length-1;e<f;++e)d=(1&e)==0?i:j,l.kernel.value=m[e],l.inputBuffer.value=n.texture,a.setRenderTarget(d),a.render(g,h),n=d;l.kernel.value=m[e],l.inputBuffer.value=n.texture,a.setRenderTarget(this.renderToScreen?null:c),a.render(g,h)}}var q=k;class r extends q.MeshStandardMaterial{constructor(a={}){super(a),this._tDepth={value:null},this._distortionMap={value:null},this._tDiffuse={value:null},this._tDiffuseBlur={value:null},this._textureMatrix={value:null},this._hasBlur={value:!1},this._mirror={value:0},this._mixBlur={value:0},this._blurStrength={value:.5},this._minDepthThreshold={value:.9},this._maxDepthThreshold={value:1},this._depthScale={value:0},this._depthToBlurRatioBias={value:.25},this._distortion={value:1},this._mixContrast={value:1},this.setValues(a)}onBeforeCompile(a){var b;null!=(b=a.defines)&&b.USE_UV||(a.defines.USE_UV=""),a.uniforms.hasBlur=this._hasBlur,a.uniforms.tDiffuse=this._tDiffuse,a.uniforms.tDepth=this._tDepth,a.uniforms.distortionMap=this._distortionMap,a.uniforms.tDiffuseBlur=this._tDiffuseBlur,a.uniforms.textureMatrix=this._textureMatrix,a.uniforms.mirror=this._mirror,a.uniforms.mixBlur=this._mixBlur,a.uniforms.mixStrength=this._blurStrength,a.uniforms.minDepthThreshold=this._minDepthThreshold,a.uniforms.maxDepthThreshold=this._maxDepthThreshold,a.uniforms.depthScale=this._depthScale,a.uniforms.depthToBlurRatioBias=this._depthToBlurRatioBias,a.uniforms.distortion=this._distortion,a.uniforms.mixContrast=this._mixContrast,a.vertexShader=`
        uniform mat4 textureMatrix;
        varying vec4 my_vUv;
      ${a.vertexShader}`,a.vertexShader=a.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
        my_vUv = textureMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );`),a.fragmentShader=`
        uniform sampler2D tDiffuse;
        uniform sampler2D tDiffuseBlur;
        uniform sampler2D tDepth;
        uniform sampler2D distortionMap;
        uniform float distortion;
        uniform float cameraNear;
			  uniform float cameraFar;
        uniform bool hasBlur;
        uniform float mixBlur;
        uniform float mirror;
        uniform float mixStrength;
        uniform float minDepthThreshold;
        uniform float maxDepthThreshold;
        uniform float mixContrast;
        uniform float depthScale;
        uniform float depthToBlurRatioBias;
        varying vec4 my_vUv;
        ${a.fragmentShader}`,a.fragmentShader=a.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>

      float distortionFactor = 0.0;
      #ifdef USE_DISTORTION
        distortionFactor = texture2D(distortionMap, vUv).r * distortion;
      #endif

      vec4 new_vUv = my_vUv;
      new_vUv.x += distortionFactor;
      new_vUv.y += distortionFactor;

      vec4 base = texture2DProj(tDiffuse, new_vUv);
      vec4 blur = texture2DProj(tDiffuseBlur, new_vUv);

      vec4 merge = base;

      #ifdef USE_NORMALMAP
        vec2 normal_uv = vec2(0.0);
        vec4 normalColor = texture2D(normalMap, vUv * normalScale);
        vec3 my_normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );
        vec3 coord = new_vUv.xyz / new_vUv.w;
        normal_uv = coord.xy + coord.z * my_normal.xz * 0.05;
        vec4 base_normal = texture2D(tDiffuse, normal_uv);
        vec4 blur_normal = texture2D(tDiffuseBlur, normal_uv);
        merge = base_normal;
        blur = blur_normal;
      #endif

      float depthFactor = 0.0001;
      float blurFactor = 0.0;

      #ifdef USE_DEPTH
        vec4 depth = texture2DProj(tDepth, new_vUv);
        depthFactor = smoothstep(minDepthThreshold, maxDepthThreshold, 1.0-(depth.r * depth.a));
        depthFactor *= depthScale;
        depthFactor = max(0.0001, min(1.0, depthFactor));

        #ifdef USE_BLUR
          blur = blur * min(1.0, depthFactor + depthToBlurRatioBias);
          merge = merge * min(1.0, depthFactor + 0.5);
        #else
          merge = merge * depthFactor;
        #endif

      #endif

      float reflectorRoughnessFactor = roughness;
      #ifdef USE_ROUGHNESSMAP
        vec4 reflectorTexelRoughness = texture2D( roughnessMap, vUv );
        reflectorRoughnessFactor *= reflectorTexelRoughness.g;
      #endif

      #ifdef USE_BLUR
        blurFactor = min(1.0, mixBlur * reflectorRoughnessFactor);
        merge = mix(merge, blur, blurFactor);
      #endif

      vec4 newMerge = vec4(0.0, 0.0, 0.0, 1.0);
      newMerge.r = (merge.r - 0.5) * mixContrast + 0.5;
      newMerge.g = (merge.g - 0.5) * mixContrast + 0.5;
      newMerge.b = (merge.b - 0.5) * mixContrast + 0.5;

      diffuseColor.rgb = diffuseColor.rgb * ((1.0 - min(1.0, mirror)) + newMerge.rgb * mixStrength);
      `)}get tDiffuse(){return this._tDiffuse.value}set tDiffuse(a){this._tDiffuse.value=a}get tDepth(){return this._tDepth.value}set tDepth(a){this._tDepth.value=a}get distortionMap(){return this._distortionMap.value}set distortionMap(a){this._distortionMap.value=a}get tDiffuseBlur(){return this._tDiffuseBlur.value}set tDiffuseBlur(a){this._tDiffuseBlur.value=a}get textureMatrix(){return this._textureMatrix.value}set textureMatrix(a){this._textureMatrix.value=a}get hasBlur(){return this._hasBlur.value}set hasBlur(a){this._hasBlur.value=a}get mirror(){return this._mirror.value}set mirror(a){this._mirror.value=a}get mixBlur(){return this._mixBlur.value}set mixBlur(a){this._mixBlur.value=a}get mixStrength(){return this._blurStrength.value}set mixStrength(a){this._blurStrength.value=a}get minDepthThreshold(){return this._minDepthThreshold.value}set minDepthThreshold(a){this._minDepthThreshold.value=a}get maxDepthThreshold(){return this._maxDepthThreshold.value}set maxDepthThreshold(a){this._maxDepthThreshold.value=a}get depthScale(){return this._depthScale.value}set depthScale(a){this._depthScale.value=a}get depthToBlurRatioBias(){return this._depthToBlurRatioBias.value}set depthToBlurRatioBias(a){this._depthToBlurRatioBias.value=a}get distortion(){return this._distortion.value}set distortion(a){this._distortion.value=a}get mixContrast(){return this._mixContrast.value}set mixContrast(a){this._mixContrast.value=a}}let s=c.forwardRef(({mixBlur:a=0,mixStrength:b=1,resolution:d=256,blur:g=[0,0],minDepthThreshold:h=.9,maxDepthThreshold:i=1,depthScale:m=0,depthToBlurRatioBias:n=.25,mirror:o=0,distortion:q=1,mixContrast:s=1,distortionMap:t,reflectorOffset:u=0,...v},w)=>{(0,l.extend)({MeshReflectorMaterialImpl:r});let x=(0,f.useThree)(({gl:a})=>a),y=(0,f.useThree)(({camera:a})=>a),z=(0,f.useThree)(({scene:a})=>a),A=(g=Array.isArray(g)?g:[g,g])[0]+g[1]>0,B=g[0],C=g[1],D=c.useRef(null);c.useImperativeHandle(w,()=>D.current,[]);let[E]=c.useState(()=>new k.Plane),[F]=c.useState(()=>new k.Vector3),[G]=c.useState(()=>new k.Vector3),[H]=c.useState(()=>new k.Vector3),[I]=c.useState(()=>new k.Matrix4),[J]=c.useState(()=>new k.Vector3(0,0,-1)),[K]=c.useState(()=>new k.Vector4),[L]=c.useState(()=>new k.Vector3),[M]=c.useState(()=>new k.Vector3),[N]=c.useState(()=>new k.Vector4),[O]=c.useState(()=>new k.Matrix4),[P]=c.useState(()=>new k.PerspectiveCamera),Q=c.useCallback(()=>{var a;let b=D.current.parent||(null==(a=D.current)||null==(a=a.__r3f.parent)?void 0:a.object);if(!b||(G.setFromMatrixPosition(b.matrixWorld),H.setFromMatrixPosition(y.matrixWorld),I.extractRotation(b.matrixWorld),F.set(0,0,1),F.applyMatrix4(I),G.addScaledVector(F,u),L.subVectors(G,H),L.dot(F)>0))return;L.reflect(F).negate(),L.add(G),I.extractRotation(y.matrixWorld),J.set(0,0,-1),J.applyMatrix4(I),J.add(H),M.subVectors(G,J),M.reflect(F).negate(),M.add(G),P.position.copy(L),P.up.set(0,1,0),P.up.applyMatrix4(I),P.up.reflect(F),P.lookAt(M),P.far=y.far,P.updateMatrixWorld(),P.projectionMatrix.copy(y.projectionMatrix),O.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),O.multiply(P.projectionMatrix),O.multiply(P.matrixWorldInverse),O.multiply(b.matrixWorld),E.setFromNormalAndCoplanarPoint(F,G),E.applyMatrix4(P.matrixWorldInverse),K.set(E.normal.x,E.normal.y,E.normal.z,E.constant);let c=P.projectionMatrix;N.x=(Math.sign(K.x)+c.elements[8])/c.elements[0],N.y=(Math.sign(K.y)+c.elements[9])/c.elements[5],N.z=-1,N.w=(1+c.elements[10])/c.elements[14],K.multiplyScalar(2/K.dot(N)),c.elements[2]=K.x,c.elements[6]=K.y,c.elements[10]=K.z+1,c.elements[14]=K.w},[y,u]),[R,S,T,U]=c.useMemo(()=>{let c={minFilter:k.LinearFilter,magFilter:k.LinearFilter,type:k.HalfFloatType},e=new k.WebGLRenderTarget(d,d,c);e.depthBuffer=!0,e.depthTexture=new k.DepthTexture(d,d),e.depthTexture.format=k.DepthFormat,e.depthTexture.type=k.UnsignedShortType;let f=new k.WebGLRenderTarget(d,d,c),g=new p({gl:x,resolution:d,width:B,height:C,minDepthThreshold:h,maxDepthThreshold:i,depthScale:m,depthToBlurRatioBias:n}),j={mirror:o,textureMatrix:O,mixBlur:a,tDiffuse:e.texture,tDepth:e.depthTexture,tDiffuseBlur:f.texture,hasBlur:A,mixStrength:b,minDepthThreshold:h,maxDepthThreshold:i,depthScale:m,depthToBlurRatioBias:n,distortion:q,distortionMap:t,mixContrast:s,"defines-USE_BLUR":A?"":void 0,"defines-USE_DEPTH":m>0?"":void 0,"defines-USE_DISTORTION":t?"":void 0};return[e,f,g,j]},[x,B,C,O,d,o,A,a,b,h,i,m,n,q,t,s]);return(0,e.useFrame)(()=>{var a;let b=D.current.parent||(null==(a=D.current)||null==(a=a.__r3f.parent)?void 0:a.object);if(!b)return;b.visible=!1;let c=x.xr.enabled,d=x.shadowMap.autoUpdate;Q(),x.xr.enabled=!1,x.shadowMap.autoUpdate=!1,x.setRenderTarget(R),x.state.buffers.depth.setMask(!0),x.autoClear||x.clear(),x.render(z,P),A&&T.render(x,R,S),x.xr.enabled=c,x.shadowMap.autoUpdate=d,b.visible=!0,x.setRenderTarget(null)}),c.createElement("meshReflectorMaterialImpl",(0,j.default)({attach:"material",key:"key"+U["defines-USE_BLUR"]+U["defines-USE_DEPTH"]+U["defines-USE_DISTORTION"],ref:D},U,v))});var t=a.i(233379);function u({image:a,angle:d,radius:f,index:i,currentRotation:j,isActive:l,width:m,height:n,onClick:o,audioData:p}){let q=(0,c.useRef)(null),r=(0,c.useRef)(null),s=(0,g.useTexture)(a.src),[u,v]=(0,c.useState)(!1),w=(0,c.useMemo)(()=>{let a=d+j;return new k.Vector3(Math.sin(a)*f,0,Math.cos(a)*f)},[d,f,j]),x=(0,c.useMemo)(()=>new k.Euler(0,d+j+Math.PI,0),[d,j]);(0,e.useFrame)((a,b)=>{if(q.current){let a=u?1.1:l?1.05:1;if(p?.enabled&&(a*=1+.15*(i%2==0?p.bass:p.treble),p.isBeat&&l&&(a*=1+.2*p.beatIntensity)),q.current.scale.x=(0,t.lerp)(q.current.scale.x,a,8*b),q.current.scale.y=(0,t.lerp)(q.current.scale.y,a,8*b),p?.enabled&&q.current.material instanceof k.MeshStandardMaterial){let a=l?.4*p.energy:.1*p.energy;q.current.material.emissiveIntensity=a}}if(r.current&&p?.enabled&&r.current.material instanceof k.MeshStandardMaterial){let b=(.1*a.clock.elapsedTime+p.mid)%1;l&&(r.current.material.color.setHSL(b,.8,.4),r.current.material.emissive.setHSL(b,.8,.3),r.current.material.emissiveIntensity=.5*p.beatIntensity)}});let y=s.image?s.image.width/s.image.height:1,z=y>1?m:m*y,A=y>1?n/y:n;return(0,b.jsxs)("group",{position:w,rotation:x,children:[(0,b.jsxs)("mesh",{ref:q,onPointerEnter:()=>v(!0),onPointerLeave:()=>v(!1),onClick:o,castShadow:!0,children:[(0,b.jsx)("planeGeometry",{args:[z,A]}),(0,b.jsx)("meshStandardMaterial",{map:s,transparent:!0,opacity:l?1:.7,metalness:.1,roughness:.8,emissive:"#4f46e5",emissiveIntensity:0})]}),(0,b.jsxs)("mesh",{ref:r,position:[0,0,-.01],children:[(0,b.jsx)("planeGeometry",{args:[z+.1,A+.1]}),(0,b.jsx)("meshStandardMaterial",{color:l?"#4f46e5":"#334155",metalness:.5,roughness:.3,emissive:"#4f46e5",emissiveIntensity:0})]}),u&&a.alt&&(0,b.jsx)(h.Html,{center:!0,position:[0,-A/2-.4,.1],children:(0,b.jsx)("div",{className:"bg-black/90 text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap shadow-xl",children:a.alt})})]})}function v({images:a,autoRotate:d,rotationSpeed:g,radius:h,itemWidth:j,itemHeight:l,showReflection:m,onImageClick:n,audioData:o}){let[p,q]=(0,c.useState)(0),[r,v]=(0,c.useState)(0),[w,x]=(0,c.useState)(!1),[y,z]=(0,c.useState)(0),A=(0,c.useRef)(null),{gl:B}=(0,f.useThree)(),C=2*Math.PI/a.length,D=(0,c.useMemo)(()=>Math.round((p%(2*Math.PI)+2*Math.PI)%(2*Math.PI)/C)%a.length,[p,C,a.length]);return(0,e.useFrame)((a,b)=>{if(!w){if(d){let a=g;o?.enabled&&(a*=1+1.5*o.energy,o.isBeat&&o.beatIntensity>.7&&(a*=-.5)),v(c=>c+a*b)}q(a=>(0,t.lerp)(a,r,5*b))}if(A.current&&o?.enabled){let c=1+.2*o.bass;if(A.current.scale.x=(0,t.lerp)(A.current.scale.x,c,8*b),A.current.scale.z=(0,t.lerp)(A.current.scale.z,c,8*b),A.current.material instanceof k.MeshStandardMaterial){let b=(.05*a.clock.elapsedTime+.5*o.mid)%1;A.current.material.emissive.setHSL(b,.8,.2),A.current.material.emissiveIntensity=.3*o.beatIntensity}}}),(0,c.useEffect)(()=>{let a=B.domElement,b=a=>{x(!0),z(a.clientX)},c=a=>{if(w){let b=(a.clientX-y)*.005;v(a=>a-b),q(a=>a-b),z(a.clientX)}},d=()=>{x(!1),v(Math.round(p/C)*C)};return a.addEventListener("pointerdown",b),a.addEventListener("pointermove",c),a.addEventListener("pointerup",d),a.addEventListener("pointerleave",d),()=>{a.removeEventListener("pointerdown",b),a.removeEventListener("pointermove",c),a.removeEventListener("pointerup",d),a.removeEventListener("pointerleave",d)}},[B,w,y,p,C]),(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("ambientLight",{intensity:o?.enabled?.3+.3*o.energy:.4}),(0,b.jsx)("spotLight",{position:[0,10,0],angle:.5,penumbra:1,intensity:o?.enabled?.8+.5*o.treble:1,castShadow:!0,"shadow-mapSize":[2048,2048],color:o?.enabled?`hsl(${260+40*o.mid}, 70%, 70%)`:"#ffffff"}),(0,b.jsx)("pointLight",{position:[10,5,10],intensity:o?.enabled?.4+.4*o.bass:.5,color:"#4f46e5"}),(0,b.jsx)("pointLight",{position:[-10,5,-10],intensity:o?.enabled?.4+.4*o.treble:.5,color:"#06b6d4"}),a.map((c,d)=>(0,b.jsx)(u,{image:c,angle:d*C,radius:h,index:d,totalItems:a.length,currentRotation:p,isActive:d===D,width:j,height:l,onClick:()=>n?.(c,d),audioData:o},`${c.src}-${d}`)),m&&(0,b.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-l/2-.5,0],receiveShadow:!0,children:[(0,b.jsx)("planeGeometry",{args:[50,50]}),(0,b.jsx)(s,{blur:[300,100],resolution:1024,mixBlur:1,mixStrength:o?.enabled?30+40*o.energy:50,roughness:1,depthScale:1.2,minDepthThreshold:.4,maxDepthThreshold:1.4,color:"#0f172a",metalness:.5,mirror:o?.enabled?.3+.4*o.bass:.5})]}),(0,b.jsxs)("mesh",{ref:A,position:[0,-l/2-.45,0],children:[(0,b.jsx)("cylinderGeometry",{args:[.3*h,.35*h,.1,64]}),(0,b.jsx)("meshStandardMaterial",{color:"#1e1b4b",metalness:.8,roughness:.2,emissive:"#4f46e5",emissiveIntensity:0})]}),o?.enabled&&(0,b.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-l/2-.4,0],children:[(0,b.jsx)("ringGeometry",{args:[.35*h,.4*h+.2*o.bass,64]}),(0,b.jsx)("meshBasicMaterial",{color:`hsl(${260+60*o.mid}, 80%, 50%)`,transparent:!0,opacity:.4+.4*o.beatIntensity})]}),(0,b.jsx)(i.Environment,{preset:"city"})]})}function w({images:a}){let[d,e]=(0,c.useState)(0);return(0,b.jsxs)("div",{className:"w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950 p-8",children:[(0,b.jsxs)("div",{className:"relative w-full max-w-2xl",children:[(0,b.jsx)("img",{src:a[d].src,alt:a[d].alt||"",className:"w-full h-64 object-cover rounded-xl shadow-2xl"}),(0,b.jsx)("div",{className:"absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2",children:a.map((a,c)=>(0,b.jsx)("button",{onClick:()=>e(c),className:`w-2 h-2 rounded-full transition-all ${c===d?"bg-white w-6":"bg-white/40"}`},c))})]}),(0,b.jsx)("p",{className:"text-slate-400 mt-4 text-sm",children:"WebGL not supported - showing fallback"})]})}function x({images:a,className:e="w-full h-[600px]",autoRotate:f=!0,rotationSpeed:g=.2,radius:h=4,itemWidth:i=2.5,itemHeight:j=1.8,showReflection:k=!0,onImageClick:l,audioData:m}){let[n,o]=(0,c.useState)(!0);return((0,c.useEffect)(()=>{try{let a=document.createElement("canvas");a.getContext("webgl")||a.getContext("experimental-webgl")||o(!1)}catch{o(!1)}},[]),n)?(0,b.jsx)("div",{className:e,children:(0,b.jsx)(d.Canvas,{camera:{position:[0,2,2.5*h],fov:50},shadows:!0,gl:{antialias:!0,alpha:!0},style:{background:"linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)"},children:(0,b.jsx)(v,{images:a,autoRotate:f,rotationSpeed:g,radius:h,itemWidth:i,itemHeight:j,showReflection:k,onImageClick:l,audioData:m})})}):(0,b.jsx)("div",{className:e,children:(0,b.jsx)(w,{images:a})})}a.s(["default",()=>x],866197)}];

//# sourceMappingURL=src_components_gallery-3d_CarouselGallery_tsx_e05899f8._.js.map