(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,81670,e=>{"use strict";var t=e.i(91071);e.s(["useLoader",()=>t.G])},511334,e=>{"use strict";function t(){return(t=Object.assign.bind()).apply(null,arguments)}e.s(["default",()=>t])},520132,e=>{"use strict";var t=e.i(923041),r=e.i(724114),i=e.i(238949),n=e.i(81670);let a=e=>e===Object(e)&&!Array.isArray(e)&&"function"!=typeof e;function s(e,s){let o=(0,i.useThree)(e=>e.gl),l=(0,n.useLoader)(r.TextureLoader,a(e)?Object.values(e):e);return(0,t.useLayoutEffect)(()=>{null==s||s(l)},[s]),(0,t.useEffect)(()=>{if("initTexture"in o){let e=[];Array.isArray(l)?e=l:l instanceof r.Texture?e=[l]:a(l)&&(e=Object.values(l)),e.forEach(e=>{e instanceof r.Texture&&o.initTexture(e)})}},[o,l]),(0,t.useMemo)(()=>{if(!a(e))return l;{let t={},r=0;for(let i in e)t[i]=l[r++];return t}},[e,l])}s.preload=e=>n.useLoader.preload(r.TextureLoader,e),s.clear=e=>n.useLoader.clear(r.TextureLoader,e),e.s(["useTexture",()=>s])},429008,932334,e=>{"use strict";let t,r;var i=e.i(511334),n=e.i(923041),a=e.i(986125),s=e.i(724114),o=e.i(238949),l=e.i(393658);let u=new s.Vector3,c=new s.Vector3,h=new s.Vector3,d=new s.Vector2;function m(e,t,r){let i=u.setFromMatrixPosition(e.matrixWorld);i.project(t);let n=r.width/2,a=r.height/2;return[i.x*n+n,-(i.y*a)+a]}let f=e=>1e-10>Math.abs(e)?0:e;function v(e,t,r=""){let i="matrix3d(";for(let r=0;16!==r;r++)i+=f(t[r]*e.elements[r])+(15!==r?",":")");return r+i}let p=(t=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>v(e,t)),x=(r=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>v(e,r(t),"translate(-50%,-50%)")),g=n.forwardRef(({children:e,eps:t=.001,style:r,className:v,prepend:g,center:y,fullscreen:M,portal:S,distanceFactor:b,sprite:w=!1,transform:_=!1,occlude:T,onOcclude:D,castShadow:U,receiveShadow:B,material:E,geometry:F,zIndexRange:R=[0x1000037,0],calculatePosition:j=m,as:P="div",wrapperClass:I,pointerEvents:C="auto",...L},W)=>{let{gl:z,camera:A,scene:V,size:k,raycaster:N,events:$,viewport:H}=(0,o.useThree)(),[O]=n.useState(()=>document.createElement(P)),G=n.useRef(null),X=n.useRef(null),q=n.useRef(0),K=n.useRef([0,0]),Z=n.useRef(null),J=n.useRef(null),Q=(null==S?void 0:S.current)||$.connected||z.domElement.parentNode,Y=n.useRef(null),ee=n.useRef(!1),et=n.useMemo(()=>{var e;return T&&"blending"!==T||Array.isArray(T)&&T.length&&(e=T[0])&&"object"==typeof e&&"current"in e},[T]);n.useLayoutEffect(()=>{let e=z.domElement;T&&"blending"===T?(e.style.zIndex=`${Math.floor(R[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[T]),n.useLayoutEffect(()=>{if(X.current){let e=G.current=a.createRoot(O);if(V.updateMatrixWorld(),_)O.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=j(X.current,A,k);O.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return Q&&(g?Q.prepend(O):Q.appendChild(O)),()=>{Q&&Q.removeChild(O),e.unmount()}}},[Q,_]),n.useLayoutEffect(()=>{I&&(O.className=I)},[I]);let er=n.useMemo(()=>_?{position:"absolute",top:0,left:0,width:k.width,height:k.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:y?"translate3d(-50%,-50%,0)":"none",...M&&{top:-k.height/2,left:-k.width/2,width:k.width,height:k.height},...r},[r,y,M,k,_]),ei=n.useMemo(()=>({position:"absolute",pointerEvents:C}),[C]);n.useLayoutEffect(()=>{var t,i;ee.current=!1,_?null==(t=G.current)||t.render(n.createElement("div",{ref:Z,style:er},n.createElement("div",{ref:J,style:ei},n.createElement("div",{ref:W,className:v,style:r,children:e})))):null==(i=G.current)||i.render(n.createElement("div",{ref:W,style:er,className:v,children:e}))});let en=n.useRef(!0);(0,l.useFrame)(e=>{if(X.current){A.updateMatrixWorld(),X.current.updateWorldMatrix(!0,!1);let e=_?K.current:j(X.current,A,k);if(_||Math.abs(q.current-A.zoom)>t||Math.abs(K.current[0]-e[0])>t||Math.abs(K.current[1]-e[1])>t){var r;let t,i,n,a,o=(r=X.current,t=u.setFromMatrixPosition(r.matrixWorld),i=c.setFromMatrixPosition(A.matrixWorld),n=t.sub(i),a=A.getWorldDirection(h),n.angleTo(a)>Math.PI/2),l=!1;et&&(Array.isArray(T)?l=T.map(e=>e.current):"blending"!==T&&(l=[V]));let m=en.current;l?en.current=function(e,t,r,i){let n=u.setFromMatrixPosition(e.matrixWorld),a=n.clone();a.project(t),d.set(a.x,a.y),r.setFromCamera(d,t);let s=r.intersectObjects(i,!0);if(s.length){let e=s[0].distance;return n.distanceTo(r.ray.origin)<e}return!0}(X.current,A,N,l)&&!o:en.current=!o,m!==en.current&&(D?D(!en.current):O.style.display=en.current?"block":"none");let v=Math.floor(R[0]/2),g=T?et?[R[0],v]:[v-1,0]:R;if(O.style.zIndex=`${function(e,t,r){if(t instanceof s.PerspectiveCamera||t instanceof s.OrthographicCamera){let i=u.setFromMatrixPosition(e.matrixWorld),n=c.setFromMatrixPosition(t.matrixWorld),a=i.distanceTo(n),s=(r[1]-r[0])/(t.far-t.near),o=r[1]-s*t.far;return Math.round(s*a+o)}}(X.current,A,g)}`,_){let[e,t]=[k.width/2,k.height/2],r=A.projectionMatrix.elements[5]*t,{isOrthographicCamera:i,top:n,left:a,bottom:s,right:o}=A,l=p(A.matrixWorldInverse),u=i?`scale(${r})translate(${f(-(o+a)/2)}px,${f((n+s)/2)}px)`:`translateZ(${r}px)`,c=X.current.matrixWorld;w&&((c=A.matrixWorldInverse.clone().transpose().copyPosition(c).scale(X.current.scale)).elements[3]=c.elements[7]=c.elements[11]=0,c.elements[15]=1),O.style.width=k.width+"px",O.style.height=k.height+"px",O.style.perspective=i?"":`${r}px`,Z.current&&J.current&&(Z.current.style.transform=`${u}${l}translate(${e}px,${t}px)`,J.current.style.transform=x(c,1/((b||10)/400)))}else{let t=void 0===b?1:function(e,t){if(t instanceof s.OrthographicCamera)return t.zoom;if(!(t instanceof s.PerspectiveCamera))return 1;{let r=u.setFromMatrixPosition(e.matrixWorld),i=c.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*r.distanceTo(i))}}(X.current,A)*b;O.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}K.current=e,q.current=A.zoom}}if(!et&&Y.current&&!ee.current)if(_){if(Z.current){let e=Z.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=A;if(t||F)L.scale&&(Array.isArray(L.scale)?L.scale instanceof s.Vector3?Y.current.scale.copy(L.scale.clone().divideScalar(1)):Y.current.scale.set(1/L.scale[0],1/L.scale[1],1/L.scale[2]):Y.current.scale.setScalar(1/L.scale));else{let t=(b||10)/400,r=e.clientWidth*t,i=e.clientHeight*t;Y.current.scale.set(r,i,1)}ee.current=!0}}}else{let t=O.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/H.factor,r=t.clientWidth*e,i=t.clientHeight*e;Y.current.scale.set(r,i,1),ee.current=!0}Y.current.lookAt(e.camera.position)}});let ea=n.useMemo(()=>({vertexShader:_?void 0:`
          /*
            This shader is from the THREE's SpriteMaterial.
            We need to turn the backing plane into a Sprite
            (make it always face the camera) if "transfrom"
            is false.
          */
          #include <common>

          void main() {
            vec2 center = vec2(0., 1.);
            float rotation = 0.0;

            // This is somewhat arbitrary, but it seems to work well
            // Need to figure out how to derive this dynamically if it even matters
            float size = 0.03;

            vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
            vec2 scale;
            scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
            scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

            bool isPerspective = isPerspectiveMatrix( projectionMatrix );
            if ( isPerspective ) scale *= - mvPosition.z;

            vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale * size;
            vec2 rotatedPosition;
            rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
            rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
            mvPosition.xy += rotatedPosition;

            gl_Position = projectionMatrix * mvPosition;
          }
      `,fragmentShader:`
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
      `}),[_]);return n.createElement("group",(0,i.default)({},L,{ref:X}),T&&!et&&n.createElement("mesh",{castShadow:U,receiveShadow:B,ref:Y},F||n.createElement("planeGeometry",null),E||n.createElement("shaderMaterial",{side:s.DoubleSide,vertexShader:ea.vertexShader,fragmentShader:ea.fragmentShader})))});function y(e,t,r){return e+(t-e)*r}function M(e,t,r,i){let n=r/(2*Math.PI*i)*t-t/2;return new s.Vector3(e*Math.cos(r),n,e*Math.sin(r))}function S(e,t){let r=[],i=Math.PI*(Math.sqrt(5)-1);for(let n=0;n<e;n++){let a=1-n/(e-1)*2,o=Math.sqrt(1-a*a),l=i*n;r.push(new s.Vector3(Math.cos(l)*o*t,a*t,Math.sin(l)*o*t))}return r}function b(e,t,r,i){return e+(t-e)*(1-Math.exp(-r*i))}e.s(["Html",()=>g],429008),e.s(["damp",()=>b,"fibonacciSphere",()=>S,"helixPoint",()=>M,"lerp",()=>y],932334)},985104,e=>{"use strict";let t=parseInt(e.i(724114).REVISION.replace(/\D+/g,""));e.s(["version",()=>t])},832518,e=>{"use strict";let t=parseInt(e.i(724114).REVISION.replace(/\D+/g,""));e.s(["version",()=>t])},389438,e=>{"use strict";var t=e.i(726151),r=e.i(923041),i=e.i(117448),n=e.i(393658),a=e.i(238949),s=e.i(520132),o=e.i(429008),l=e.i(341021),u=e.i(511334),c=e.i(724114),h=e.i(327147),d=c,m=e.i(832518);class f extends d.ShaderMaterial{constructor(e=new d.Vector2){super({uniforms:{inputBuffer:new d.Uniform(null),depthBuffer:new d.Uniform(null),resolution:new d.Uniform(new d.Vector2),texelSize:new d.Uniform(new d.Vector2),halfTexelSize:new d.Uniform(new d.Vector2),kernel:new d.Uniform(0),scale:new d.Uniform(1),cameraNear:new d.Uniform(0),cameraFar:new d.Uniform(1),minDepthThreshold:new d.Uniform(0),maxDepthThreshold:new d.Uniform(1),depthScale:new d.Uniform(0),depthToBlurRatioBias:new d.Uniform(.25)},fragmentShader:`#include <common>
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
          #include <${m.version>=154?"colorspace_fragment":"encodings_fragment"}>
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
        }`,blending:d.NoBlending,depthWrite:!1,depthTest:!1}),this.toneMapped=!1,this.setTexelSize(e.x,e.y),this.kernel=new Float32Array([0,1,2,2,3])}setTexelSize(e,t){this.uniforms.texelSize.value.set(e,t),this.uniforms.halfTexelSize.value.set(e,t).multiplyScalar(.5)}setResolution(e){this.uniforms.resolution.value.copy(e)}}class v{constructor({gl:e,resolution:t,width:r=500,height:i=500,minDepthThreshold:n=0,maxDepthThreshold:a=1,depthScale:s=0,depthToBlurRatioBias:o=.25}){this.renderToScreen=!1,this.renderTargetA=new c.WebGLRenderTarget(t,t,{minFilter:c.LinearFilter,magFilter:c.LinearFilter,stencilBuffer:!1,depthBuffer:!1,type:c.HalfFloatType}),this.renderTargetB=this.renderTargetA.clone(),this.convolutionMaterial=new f,this.convolutionMaterial.setTexelSize(1/r,1/i),this.convolutionMaterial.setResolution(new c.Vector2(r,i)),this.scene=new c.Scene,this.camera=new c.Camera,this.convolutionMaterial.uniforms.minDepthThreshold.value=n,this.convolutionMaterial.uniforms.maxDepthThreshold.value=a,this.convolutionMaterial.uniforms.depthScale.value=s,this.convolutionMaterial.uniforms.depthToBlurRatioBias.value=o,this.convolutionMaterial.defines.USE_DEPTH=s>0;const l=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),u=new Float32Array([0,0,2,0,0,2]),h=new c.BufferGeometry;h.setAttribute("position",new c.BufferAttribute(l,3)),h.setAttribute("uv",new c.BufferAttribute(u,2)),this.screen=new c.Mesh(h,this.convolutionMaterial),this.screen.frustumCulled=!1,this.scene.add(this.screen)}render(e,t,r){let i,n,a,s=this.scene,o=this.camera,l=this.renderTargetA,u=this.renderTargetB,c=this.convolutionMaterial,h=c.uniforms;h.depthBuffer.value=t.depthTexture;let d=c.kernel,m=t;for(n=0,a=d.length-1;n<a;++n)i=(1&n)==0?l:u,h.kernel.value=d[n],h.inputBuffer.value=m.texture,e.setRenderTarget(i),e.render(s,o),m=i;h.kernel.value=d[n],h.inputBuffer.value=m.texture,e.setRenderTarget(this.renderToScreen?null:r),e.render(s,o)}}var p=c;class x extends p.MeshStandardMaterial{constructor(e={}){super(e),this._tDepth={value:null},this._distortionMap={value:null},this._tDiffuse={value:null},this._tDiffuseBlur={value:null},this._textureMatrix={value:null},this._hasBlur={value:!1},this._mirror={value:0},this._mixBlur={value:0},this._blurStrength={value:.5},this._minDepthThreshold={value:.9},this._maxDepthThreshold={value:1},this._depthScale={value:0},this._depthToBlurRatioBias={value:.25},this._distortion={value:1},this._mixContrast={value:1},this.setValues(e)}onBeforeCompile(e){var t;null!=(t=e.defines)&&t.USE_UV||(e.defines.USE_UV=""),e.uniforms.hasBlur=this._hasBlur,e.uniforms.tDiffuse=this._tDiffuse,e.uniforms.tDepth=this._tDepth,e.uniforms.distortionMap=this._distortionMap,e.uniforms.tDiffuseBlur=this._tDiffuseBlur,e.uniforms.textureMatrix=this._textureMatrix,e.uniforms.mirror=this._mirror,e.uniforms.mixBlur=this._mixBlur,e.uniforms.mixStrength=this._blurStrength,e.uniforms.minDepthThreshold=this._minDepthThreshold,e.uniforms.maxDepthThreshold=this._maxDepthThreshold,e.uniforms.depthScale=this._depthScale,e.uniforms.depthToBlurRatioBias=this._depthToBlurRatioBias,e.uniforms.distortion=this._distortion,e.uniforms.mixContrast=this._mixContrast,e.vertexShader=`
        uniform mat4 textureMatrix;
        varying vec4 my_vUv;
      ${e.vertexShader}`,e.vertexShader=e.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
        my_vUv = textureMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );`),e.fragmentShader=`
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
        ${e.fragmentShader}`,e.fragmentShader=e.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>

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
      `)}get tDiffuse(){return this._tDiffuse.value}set tDiffuse(e){this._tDiffuse.value=e}get tDepth(){return this._tDepth.value}set tDepth(e){this._tDepth.value=e}get distortionMap(){return this._distortionMap.value}set distortionMap(e){this._distortionMap.value=e}get tDiffuseBlur(){return this._tDiffuseBlur.value}set tDiffuseBlur(e){this._tDiffuseBlur.value=e}get textureMatrix(){return this._textureMatrix.value}set textureMatrix(e){this._textureMatrix.value=e}get hasBlur(){return this._hasBlur.value}set hasBlur(e){this._hasBlur.value=e}get mirror(){return this._mirror.value}set mirror(e){this._mirror.value=e}get mixBlur(){return this._mixBlur.value}set mixBlur(e){this._mixBlur.value=e}get mixStrength(){return this._blurStrength.value}set mixStrength(e){this._blurStrength.value=e}get minDepthThreshold(){return this._minDepthThreshold.value}set minDepthThreshold(e){this._minDepthThreshold.value=e}get maxDepthThreshold(){return this._maxDepthThreshold.value}set maxDepthThreshold(e){this._maxDepthThreshold.value=e}get depthScale(){return this._depthScale.value}set depthScale(e){this._depthScale.value=e}get depthToBlurRatioBias(){return this._depthToBlurRatioBias.value}set depthToBlurRatioBias(e){this._depthToBlurRatioBias.value=e}get distortion(){return this._distortion.value}set distortion(e){this._distortion.value=e}get mixContrast(){return this._mixContrast.value}set mixContrast(e){this._mixContrast.value=e}}let g=r.forwardRef(({mixBlur:e=0,mixStrength:t=1,resolution:i=256,blur:s=[0,0],minDepthThreshold:o=.9,maxDepthThreshold:l=1,depthScale:d=0,depthToBlurRatioBias:m=.25,mirror:f=0,distortion:p=1,mixContrast:g=1,distortionMap:y,reflectorOffset:M=0,...S},b)=>{(0,h.extend)({MeshReflectorMaterialImpl:x});let w=(0,a.useThree)(({gl:e})=>e),_=(0,a.useThree)(({camera:e})=>e),T=(0,a.useThree)(({scene:e})=>e),D=(s=Array.isArray(s)?s:[s,s])[0]+s[1]>0,U=s[0],B=s[1],E=r.useRef(null);r.useImperativeHandle(b,()=>E.current,[]);let[F]=r.useState(()=>new c.Plane),[R]=r.useState(()=>new c.Vector3),[j]=r.useState(()=>new c.Vector3),[P]=r.useState(()=>new c.Vector3),[I]=r.useState(()=>new c.Matrix4),[C]=r.useState(()=>new c.Vector3(0,0,-1)),[L]=r.useState(()=>new c.Vector4),[W]=r.useState(()=>new c.Vector3),[z]=r.useState(()=>new c.Vector3),[A]=r.useState(()=>new c.Vector4),[V]=r.useState(()=>new c.Matrix4),[k]=r.useState(()=>new c.PerspectiveCamera),N=r.useCallback(()=>{var e;let t=E.current.parent||(null==(e=E.current)||null==(e=e.__r3f.parent)?void 0:e.object);if(!t||(j.setFromMatrixPosition(t.matrixWorld),P.setFromMatrixPosition(_.matrixWorld),I.extractRotation(t.matrixWorld),R.set(0,0,1),R.applyMatrix4(I),j.addScaledVector(R,M),W.subVectors(j,P),W.dot(R)>0))return;W.reflect(R).negate(),W.add(j),I.extractRotation(_.matrixWorld),C.set(0,0,-1),C.applyMatrix4(I),C.add(P),z.subVectors(j,C),z.reflect(R).negate(),z.add(j),k.position.copy(W),k.up.set(0,1,0),k.up.applyMatrix4(I),k.up.reflect(R),k.lookAt(z),k.far=_.far,k.updateMatrixWorld(),k.projectionMatrix.copy(_.projectionMatrix),V.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),V.multiply(k.projectionMatrix),V.multiply(k.matrixWorldInverse),V.multiply(t.matrixWorld),F.setFromNormalAndCoplanarPoint(R,j),F.applyMatrix4(k.matrixWorldInverse),L.set(F.normal.x,F.normal.y,F.normal.z,F.constant);let r=k.projectionMatrix;A.x=(Math.sign(L.x)+r.elements[8])/r.elements[0],A.y=(Math.sign(L.y)+r.elements[9])/r.elements[5],A.z=-1,A.w=(1+r.elements[10])/r.elements[14],L.multiplyScalar(2/L.dot(A)),r.elements[2]=L.x,r.elements[6]=L.y,r.elements[10]=L.z+1,r.elements[14]=L.w},[_,M]),[$,H,O,G]=r.useMemo(()=>{let r={minFilter:c.LinearFilter,magFilter:c.LinearFilter,type:c.HalfFloatType},n=new c.WebGLRenderTarget(i,i,r);n.depthBuffer=!0,n.depthTexture=new c.DepthTexture(i,i),n.depthTexture.format=c.DepthFormat,n.depthTexture.type=c.UnsignedShortType;let a=new c.WebGLRenderTarget(i,i,r),s=new v({gl:w,resolution:i,width:U,height:B,minDepthThreshold:o,maxDepthThreshold:l,depthScale:d,depthToBlurRatioBias:m}),u={mirror:f,textureMatrix:V,mixBlur:e,tDiffuse:n.texture,tDepth:n.depthTexture,tDiffuseBlur:a.texture,hasBlur:D,mixStrength:t,minDepthThreshold:o,maxDepthThreshold:l,depthScale:d,depthToBlurRatioBias:m,distortion:p,distortionMap:y,mixContrast:g,"defines-USE_BLUR":D?"":void 0,"defines-USE_DEPTH":d>0?"":void 0,"defines-USE_DISTORTION":y?"":void 0};return[n,a,s,u]},[w,U,B,V,i,f,D,e,t,o,l,d,m,p,y,g]);return(0,n.useFrame)(()=>{var e;let t=E.current.parent||(null==(e=E.current)||null==(e=e.__r3f.parent)?void 0:e.object);if(!t)return;t.visible=!1;let r=w.xr.enabled,i=w.shadowMap.autoUpdate;N(),w.xr.enabled=!1,w.shadowMap.autoUpdate=!1,w.setRenderTarget($),w.state.buffers.depth.setMask(!0),w.autoClear||w.clear(),w.render(T,k),D&&O.render(w,$,H),w.xr.enabled=r,w.shadowMap.autoUpdate=i,t.visible=!0,w.setRenderTarget(null)}),r.createElement("meshReflectorMaterialImpl",(0,u.default)({attach:"material",key:"key"+G["defines-USE_BLUR"]+G["defines-USE_DEPTH"]+G["defines-USE_DISTORTION"],ref:E},G,S))});var y=e.i(932334);function M({image:e,angle:i,radius:a,index:l,currentRotation:u,isActive:h,width:d,height:m,onClick:f,audioData:v}){let p=(0,r.useRef)(null),x=(0,r.useRef)(null),g=(0,s.useTexture)(e.src),[M,S]=(0,r.useState)(!1),b=(0,r.useMemo)(()=>{let e=i+u;return new c.Vector3(Math.sin(e)*a,0,Math.cos(e)*a)},[i,a,u]),w=(0,r.useMemo)(()=>new c.Euler(0,i+u+Math.PI,0),[i,u]);(0,n.useFrame)((e,t)=>{if(p.current){let e=M?1.1:h?1.05:1;if(v?.enabled&&(e*=1+.15*(l%2==0?v.bass:v.treble),v.isBeat&&h&&(e*=1+.2*v.beatIntensity)),p.current.scale.x=(0,y.lerp)(p.current.scale.x,e,8*t),p.current.scale.y=(0,y.lerp)(p.current.scale.y,e,8*t),v?.enabled&&p.current.material instanceof c.MeshStandardMaterial){let e=h?.4*v.energy:.1*v.energy;p.current.material.emissiveIntensity=e}}if(x.current&&v?.enabled&&x.current.material instanceof c.MeshStandardMaterial){let t=(.1*e.clock.elapsedTime+v.mid)%1;h&&(x.current.material.color.setHSL(t,.8,.4),x.current.material.emissive.setHSL(t,.8,.3),x.current.material.emissiveIntensity=.5*v.beatIntensity)}});let _=g.image?g.image.width/g.image.height:1,T=_>1?d:d*_,D=_>1?m/_:m;return(0,t.jsxs)("group",{position:b,rotation:w,children:[(0,t.jsxs)("mesh",{ref:p,onPointerEnter:()=>S(!0),onPointerLeave:()=>S(!1),onClick:f,castShadow:!0,children:[(0,t.jsx)("planeGeometry",{args:[T,D]}),(0,t.jsx)("meshStandardMaterial",{map:g,transparent:!0,opacity:h?1:.7,metalness:.1,roughness:.8,emissive:"#4f46e5",emissiveIntensity:0})]}),(0,t.jsxs)("mesh",{ref:x,position:[0,0,-.01],children:[(0,t.jsx)("planeGeometry",{args:[T+.1,D+.1]}),(0,t.jsx)("meshStandardMaterial",{color:h?"#4f46e5":"#334155",metalness:.5,roughness:.3,emissive:"#4f46e5",emissiveIntensity:0})]}),M&&e.alt&&(0,t.jsx)(o.Html,{center:!0,position:[0,-D/2-.4,.1],children:(0,t.jsx)("div",{className:"bg-black/90 text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap shadow-xl",children:e.alt})})]})}function S({images:e,autoRotate:i,rotationSpeed:s,radius:o,itemWidth:u,itemHeight:h,showReflection:d,onImageClick:m,audioData:f}){let[v,p]=(0,r.useState)(0),[x,S]=(0,r.useState)(0),[b,w]=(0,r.useState)(!1),[_,T]=(0,r.useState)(0),D=(0,r.useRef)(null),{gl:U}=(0,a.useThree)(),B=2*Math.PI/e.length,E=(0,r.useMemo)(()=>Math.round((v%(2*Math.PI)+2*Math.PI)%(2*Math.PI)/B)%e.length,[v,B,e.length]);return(0,n.useFrame)((e,t)=>{if(!b){if(i){let e=s;f?.enabled&&(e*=1+1.5*f.energy,f.isBeat&&f.beatIntensity>.7&&(e*=-.5)),S(r=>r+e*t)}p(e=>(0,y.lerp)(e,x,5*t))}if(D.current&&f?.enabled){let r=1+.2*f.bass;if(D.current.scale.x=(0,y.lerp)(D.current.scale.x,r,8*t),D.current.scale.z=(0,y.lerp)(D.current.scale.z,r,8*t),D.current.material instanceof c.MeshStandardMaterial){let t=(.05*e.clock.elapsedTime+.5*f.mid)%1;D.current.material.emissive.setHSL(t,.8,.2),D.current.material.emissiveIntensity=.3*f.beatIntensity}}}),(0,r.useEffect)(()=>{let e=U.domElement,t=e=>{w(!0),T(e.clientX)},r=e=>{if(b){let t=(e.clientX-_)*.005;S(e=>e-t),p(e=>e-t),T(e.clientX)}},i=()=>{w(!1),S(Math.round(v/B)*B)};return e.addEventListener("pointerdown",t),e.addEventListener("pointermove",r),e.addEventListener("pointerup",i),e.addEventListener("pointerleave",i),()=>{e.removeEventListener("pointerdown",t),e.removeEventListener("pointermove",r),e.removeEventListener("pointerup",i),e.removeEventListener("pointerleave",i)}},[U,b,_,v,B]),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:f?.enabled?.3+.3*f.energy:.4}),(0,t.jsx)("spotLight",{position:[0,10,0],angle:.5,penumbra:1,intensity:f?.enabled?.8+.5*f.treble:1,castShadow:!0,"shadow-mapSize":[2048,2048],color:f?.enabled?`hsl(${260+40*f.mid}, 70%, 70%)`:"#ffffff"}),(0,t.jsx)("pointLight",{position:[10,5,10],intensity:f?.enabled?.4+.4*f.bass:.5,color:"#4f46e5"}),(0,t.jsx)("pointLight",{position:[-10,5,-10],intensity:f?.enabled?.4+.4*f.treble:.5,color:"#06b6d4"}),e.map((r,i)=>(0,t.jsx)(M,{image:r,angle:i*B,radius:o,index:i,totalItems:e.length,currentRotation:v,isActive:i===E,width:u,height:h,onClick:()=>m?.(r,i),audioData:f},`${r.src}-${i}`)),d&&(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-h/2-.5,0],receiveShadow:!0,children:[(0,t.jsx)("planeGeometry",{args:[50,50]}),(0,t.jsx)(g,{blur:[300,100],resolution:1024,mixBlur:1,mixStrength:f?.enabled?30+40*f.energy:50,roughness:1,depthScale:1.2,minDepthThreshold:.4,maxDepthThreshold:1.4,color:"#0f172a",metalness:.5,mirror:f?.enabled?.3+.4*f.bass:.5})]}),(0,t.jsxs)("mesh",{ref:D,position:[0,-h/2-.45,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.3*o,.35*o,.1,64]}),(0,t.jsx)("meshStandardMaterial",{color:"#1e1b4b",metalness:.8,roughness:.2,emissive:"#4f46e5",emissiveIntensity:0})]}),f?.enabled&&(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-h/2-.4,0],children:[(0,t.jsx)("ringGeometry",{args:[.35*o,.4*o+.2*f.bass,64]}),(0,t.jsx)("meshBasicMaterial",{color:`hsl(${260+60*f.mid}, 80%, 50%)`,transparent:!0,opacity:.4+.4*f.beatIntensity})]}),(0,t.jsx)(l.Environment,{preset:"city"})]})}function b({images:e}){let[i,n]=(0,r.useState)(0);return(0,t.jsxs)("div",{className:"w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950 p-8",children:[(0,t.jsxs)("div",{className:"relative w-full max-w-2xl",children:[(0,t.jsx)("img",{src:e[i].src,alt:e[i].alt||"",className:"w-full h-64 object-cover rounded-xl shadow-2xl"}),(0,t.jsx)("div",{className:"absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2",children:e.map((e,r)=>(0,t.jsx)("button",{onClick:()=>n(r),className:`w-2 h-2 rounded-full transition-all ${r===i?"bg-white w-6":"bg-white/40"}`},r))})]}),(0,t.jsx)("p",{className:"text-slate-400 mt-4 text-sm",children:"WebGL not supported - showing fallback"})]})}function w({images:e,className:n="w-full h-[600px]",autoRotate:a=!0,rotationSpeed:s=.2,radius:o=4,itemWidth:l=2.5,itemHeight:u=1.8,showReflection:c=!0,onImageClick:h,audioData:d}){let[m,f]=(0,r.useState)(!0);return((0,r.useEffect)(()=>{try{let e=document.createElement("canvas");e.getContext("webgl")||e.getContext("experimental-webgl")||f(!1)}catch{f(!1)}},[]),m)?(0,t.jsx)("div",{className:n,children:(0,t.jsx)(i.Canvas,{camera:{position:[0,2,2.5*o],fov:50},shadows:!0,gl:{antialias:!0,alpha:!0},style:{background:"linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)"},children:(0,t.jsx)(S,{images:e,autoRotate:a,rotationSpeed:s,radius:o,itemWidth:l,itemHeight:u,showReflection:c,onImageClick:h,audioData:d})})}):(0,t.jsx)("div",{className:n,children:(0,t.jsx)(b,{images:e})})}e.s(["default",()=>w],389438)}]);