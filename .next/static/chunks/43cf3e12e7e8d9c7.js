(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,596217,e=>{"use strict";let t,n;var i,r,a,o,s,l,c,u,f,d,p,h,m,y,v,g,x,w,b,S,_,M,A,E,z,L=e.i(726151),C=e.i(923041),U=e.i(117448),j=e.i(393658),B=e.i(238949),O=e.i(520132),I=e.i(429008),P=e.i(511334),T=e.i(986125),D=e.i(91071),D=D;function R(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var V=e.i(724114);function H(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=Array(t);n<t;n++)i[n]=e[n];return i}function F(e,t){if(e){if("string"==typeof e)return H(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if("Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return H(e,t)}}function N(e){return function(e){if(Array.isArray(e))return H(e)}(e)||function(e){if("u">typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||F(e)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}new V.Vector2,new V.Vector2;function G(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")}var W=function e(t,n,i){var r=this;G(this,e),R(this,"dot2",function(e,t){return r.x*e+r.y*t}),R(this,"dot3",function(e,t,n){return r.x*e+r.y*t+r.z*n}),this.x=t,this.y=n,this.z=i},q=[new W(1,1,0),new W(-1,1,0),new W(1,-1,0),new W(-1,-1,0),new W(1,0,1),new W(-1,0,1),new W(1,0,-1),new W(-1,0,-1),new W(0,1,1),new W(0,-1,1),new W(0,1,-1),new W(0,-1,-1)],k=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180],$=Array(512),Q=Array(512),X=0;(X=Math.floor(X))<256&&(X|=X<<8);for(var Y,K=0;K<256;K++)Y=1&K?k[K]^255&X:k[K]^X>>8&255,$[K]=$[K+256]=Y,Q[K]=Q[K+256]=q[Y%12];function J(e){var t=function(e){if("number"==typeof e)e=Math.abs(e);else if("string"==typeof e){var t=e;e=0;for(var n=0;n<t.length;n++)e=(e+(n+1)*(t.charCodeAt(n)%96))%0x7fffffff}return 0===e&&(e=311),e}(e);return function(){var e=48271*t%0x7fffffff;return t=e,e/0x7fffffff}}new function e(t){var n=this;G(this,e),R(this,"seed",0),R(this,"init",function(e){n.seed=e,n.value=J(e)}),R(this,"value",J(this.seed)),this.init(t)}(Math.random());var Z=function(e){return 1/(1+e+.48*e*e+.235*e*e*e)};function ee(e,t,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.25,r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:.01,a=arguments.length>5&&void 0!==arguments[5]?arguments[5]:1/0,o=arguments.length>6&&void 0!==arguments[6]?arguments[6]:Z,s=arguments.length>7&&void 0!==arguments[7]?arguments[7]:.001,l="velocity_"+t;if(void 0===e.__damp&&(e.__damp={}),void 0===e.__damp[l]&&(e.__damp[l]=0),Math.abs(e[t]-n)<=s)return e[t]=n,!1;var c=2/(i=Math.max(1e-4,i)),u=o(c*r),f=e[t]-n,d=n,p=a*i;f=Math.min(Math.max(f,-p),p),n=e[t]-f;var h=(e.__damp[l]+c*f)*r;e.__damp[l]=(e.__damp[l]-c*h)*u;var m=n+(f+h)*u;return d-e[t]>0==m>d&&(m=d,e.__damp[l]=(m-d)/r),e[t]=m,!0}var et=new V.Vector3,en=new V.Quaternion,ei=new V.Quaternion,er=new V.Matrix4,ea=new V.Vector3;function eo(e,t,n,i,r,a,o,s){var l,c,u,f;return ee(e,t,e[t]+(u=(l=n-e[t])-Math.floor(l/(c=2*Math.PI))*c,(f=Math.max(0,Math.min(c,u)))>Math.PI&&(f-=2*Math.PI),f),i,r,a,o,s)}var es=new V.Vector2,el=new V.Vector3;function ec(e,t,n,i,r,l,c){return"number"==typeof t?el.setScalar(t):Array.isArray(t)?el.set(t[0],t[1],t[2]):el.copy(t),a=ee(e,"x",el.x,n,i,r,l,c),o=ee(e,"y",el.y,n,i,r,l,c),s=ee(e,"z",el.z,n,i,r,l,c),a||o||s}var eu=new V.Vector4,ef=new V.Euler,ed=new V.Color,ep=new V.Quaternion,eh=new V.Vector4,em=new V.Vector4,ey=new V.Vector4;function ev(e,t,n,i,r,a,o){Array.isArray(t)?ep.set(t[0],t[1],t[2],t[3]):ep.copy(t);var s=e.dot(ep)>0?1:-1;return ep.x*=s,ep.y*=s,ep.z*=s,ep.w*=s,g=ee(e,"x",ep.x,n,i,r,a,o),x=ee(e,"y",ep.y,n,i,r,a,o),w=ee(e,"z",ep.z,n,i,r,a,o),b=ee(e,"w",ep.w,n,i,r,a,o),eh.set(e.x,e.y,e.z,e.w).normalize(),em.set(e.__damp.velocity_x,e.__damp.velocity_y,e.__damp.velocity_z,e.__damp.velocity_w),ey.copy(eh).multiplyScalar(em.dot(eh)/eh.dot(eh)),e.__damp.velocity_x-=ey.x,e.__damp.velocity_y-=ey.y,e.__damp.velocity_z-=ey.z,e.__damp.velocity_w-=ey.w,e.set(eh.x,eh.y,eh.z,eh.w),g||x||w||b}var eg=new V.Spherical,ex=new V.Matrix4,ew=new V.Vector3,eb=new V.Quaternion,eS=new V.Vector3,e_=Object.freeze({__proto__:null,rsqw:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:.01,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1/(2*Math.PI);return n/Math.atan(1/t)*Math.atan(Math.sin(2*Math.PI*e*i)/t)},exp:Z,linear:function(e){return e},sine:{in:function(e){return 1-Math.cos(e*Math.PI/2)},out:function(e){return Math.sin(e*Math.PI/2)},inOut:function(e){return-(Math.cos(Math.PI*e)-1)/2}},cubic:{in:function(e){return e*e*e},out:function(e){return 1-Math.pow(1-e,3)},inOut:function(e){return e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2}},quint:{in:function(e){return e*e*e*e*e},out:function(e){return 1-Math.pow(1-e,5)},inOut:function(e){return e<.5?16*e*e*e*e*e:1-Math.pow(-2*e+2,5)/2}},circ:{in:function(e){return 1-Math.sqrt(1-Math.pow(e,2))},out:function(e){return Math.sqrt(1-Math.pow(e-1,2))},inOut:function(e){return e<.5?(1-Math.sqrt(1-Math.pow(2*e,2)))/2:(Math.sqrt(1-Math.pow(-2*e+2,2))+1)/2}},quart:{in:function(e){return e*e*e*e},out:function(e){return 1- --e*e*e*e},inOut:function(e){return e<.5?8*e*e*e*e:1-8*--e*e*e*e}},expo:{in:function(e){return 0===e?0:Math.pow(2,10*e-10)},out:function(e){return 1===e?1:1-Math.pow(2,-10*e)},inOut:function(e){return 0===e?0:1===e?1:e<.5?Math.pow(2,20*e-10)/2:(2-Math.pow(2,-20*e+10))/2}},damp:ee,dampLookAt:function(e,t,n,i,r,a,o){"number"==typeof t?et.setScalar(t):Array.isArray(t)?et.set(t[0],t[1],t[2]):et.copy(t);var s=e.parent;(e.updateWorldMatrix(!0,!1),ea.setFromMatrixPosition(e.matrixWorld),e&&e.isCamera||e&&e.isLight)?er.lookAt(ea,et,e.up):er.lookAt(et,ea,e.up),ev(e.quaternion,ei.setFromRotationMatrix(er),n,i,r,a,o),s&&(er.extractRotation(s.matrixWorld),en.setFromRotationMatrix(er),ev(e.quaternion,ei.copy(e.quaternion).premultiply(en.invert()),n,i,r,a,o))},dampAngle:eo,damp2:function(e,t,n,a,o,s,l){return"number"==typeof t?es.setScalar(t):Array.isArray(t)?es.set(t[0],t[1]):es.copy(t),i=ee(e,"x",es.x,n,a,o,s,l),r=ee(e,"y",es.y,n,a,o,s,l),i||r},damp3:ec,damp4:function(e,t,n,i,r,a,o){return"number"==typeof t?eu.setScalar(t):Array.isArray(t)?eu.set(t[0],t[1],t[2],t[3]):eu.copy(t),l=ee(e,"x",eu.x,n,i,r,a,o),c=ee(e,"y",eu.y,n,i,r,a,o),u=ee(e,"z",eu.z,n,i,r,a,o),f=ee(e,"w",eu.w,n,i,r,a,o),l||c||u||f},dampE:function(e,t,n,i,r,a,o){return Array.isArray(t)?ef.set(t[0],t[1],t[2],t[3]):ef.copy(t),d=eo(e,"x",ef.x,n,i,r,a,o),p=eo(e,"y",ef.y,n,i,r,a,o),h=eo(e,"z",ef.z,n,i,r,a,o),d||p||h},dampC:function(e,t,n,i,r,a,o){return t instanceof V.Color?ed.copy(t):Array.isArray(t)?ed.setRGB(t[0],t[1],t[2]):ed.set(t),m=ee(e,"r",ed.r,n,i,r,a,o),y=ee(e,"g",ed.g,n,i,r,a,o),v=ee(e,"b",ed.b,n,i,r,a,o),m||y||v},dampQ:ev,dampS:function(e,t,n,i,r,a,o){return Array.isArray(t)?eg.set(t[0],t[1],t[2]):eg.copy(t),S=ee(e,"radius",eg.radius,n,i,r,a,o),_=eo(e,"phi",eg.phi,n,i,r,a,o),M=eo(e,"theta",eg.theta,n,i,r,a,o),S||_||M},dampM:function(e,t,n,i,r,a,o){return void 0===e.__damp&&(e.__damp={position:new V.Vector3,rotation:new V.Quaternion,scale:new V.Vector3},e.decompose(e.__damp.position,e.__damp.rotation,e.__damp.scale)),Array.isArray(t)?ex.set.apply(ex,N(t)):ex.copy(t),ex.decompose(ew,eb,eS),A=ec(e.__damp.position,ew,n,i,r,a,o),E=ev(e.__damp.rotation,eb,n,i,r,a,o),z=ec(e.__damp.scale,eS,n,i,r,a,o),e.compose(e.__damp.position,e.__damp.rotation,e.__damp.scale),A||E||z}});V.BufferGeometry;let eM=C.createContext(null);function eA(){return C.useContext(eM)}function eE({eps:e=1e-5,enabled:t=!0,infinite:n,horizontal:i,pages:r=1,distance:a=1,damping:o=.25,maxSpeed:s=1/0,prepend:l=!1,style:c={},children:u}){let{get:f,setEvents:d,gl:p,size:h,invalidate:m,events:y}=(0,B.useThree)(),[v]=C.useState(()=>document.createElement("div")),[g]=C.useState(()=>document.createElement("div")),[x]=C.useState(()=>document.createElement("div")),w=p.domElement.parentNode,b=C.useRef(0),S=C.useMemo(()=>({el:v,eps:e,fill:g,fixed:x,horizontal:i,damping:o,offset:0,delta:0,scroll:b,pages:r,range(e,t,n=0){let i=e-n,r=i+t+2*n;return this.offset<i?0:this.offset>r?1:(this.offset-i)/(r-i)},curve(e,t,n=0){return Math.sin(this.range(e,t,n)*Math.PI)},visible(e,t,n=0){let i=e-n;return this.offset>=i&&this.offset<=i+t+2*n}}),[e,o,i,r]);C.useEffect(()=>{for(let e in v.style.position="absolute",v.style.width="100%",v.style.height="100%",v.style[i?"overflowX":"overflowY"]="auto",v.style[i?"overflowY":"overflowX"]="hidden",v.style.top="0px",v.style.left="0px",c)v.style[e]=c[e];x.style.position="sticky",x.style.top="0px",x.style.left="0px",x.style.width="100%",x.style.height="100%",x.style.overflow="hidden",v.appendChild(x),g.style.height=i?"100%":`${r*a*100}%`,g.style.width=i?`${r*a*100}%`:"100%",g.style.pointerEvents="none",v.appendChild(g),l?w.prepend(v):w.appendChild(v),v[i?"scrollLeft":"scrollTop"]=1;let e=y.connected||p.domElement;requestAnimationFrame(()=>null==y.connect?void 0:y.connect(v));let t=f().events.compute;return d({compute(e,t){let{left:n,top:i}=w.getBoundingClientRect(),r=e.clientX-n,a=e.clientY-i;t.pointer.set(r/t.size.width*2-1,-(2*(a/t.size.height))+1),t.raycaster.setFromCamera(t.pointer,t.camera)}}),()=>{w.removeChild(v),d({compute:t}),null==y.connect||y.connect(e)}},[r,a,i,v,g,x,w]),C.useEffect(()=>{if(y.connected===v){let e=h[i?"width":"height"],r=v[i?"scrollWidth":"scrollHeight"],a=r-e,o=0,s=!0,l=!0,c=()=>{if(t&&!l&&(m(),b.current=(o=v[i?"scrollLeft":"scrollTop"])/a,n)){if(!s){if(o>=a){let e=1-S.offset;v[i?"scrollLeft":"scrollTop"]=1,b.current=S.offset=-e,s=!0}else if(o<=0){let e=1+S.offset;v[i?"scrollLeft":"scrollTop"]=r,b.current=S.offset=e,s=!0}}s&&setTimeout(()=>s=!1,40)}};v.addEventListener("scroll",c,{passive:!0}),requestAnimationFrame(()=>l=!1);let u=e=>v.scrollLeft+=e.deltaY/2;return i&&v.addEventListener("wheel",u,{passive:!0}),()=>{v.removeEventListener("scroll",c),i&&v.removeEventListener("wheel",u)}}},[v,y,h,n,S,m,i,t]);let _=0;return(0,j.useFrame)((t,n)=>{_=S.offset,e_.damp(S,"offset",b.current,o,n,s,void 0,e),e_.damp(S,"delta",Math.abs(_-S.offset),o,n,s,void 0,e),S.delta>e&&m()}),C.createElement(eM.Provider,{value:S},u)}({children:e},t)=>{let n=C.useRef(null);C.useImperativeHandle(t,()=>n.current,[]);let i=eA(),{width:r,height:a}=(0,B.useThree)(e=>e.viewport);return(0,j.useFrame)(()=>{n.current.position.x=i.horizontal?-r*(i.pages-1)*i.offset:0,n.current.position.y=i.horizontal?0:a*(i.pages-1)*i.offset}),C.createElement("group",{ref:n},e)},({children:e,style:t,...n},i)=>{let r=eA(),a=C.useRef(null);C.useImperativeHandle(i,()=>a.current,[]);let{width:o,height:s}=(0,B.useThree)(e=>e.size),l=C.useContext(D.q),c=C.useMemo(()=>T.createRoot(r.fixed),[r.fixed]);return(0,j.useFrame)(()=>{r.delta>r.eps&&(a.current.style.transform=`translate3d(${r.horizontal?-o*(r.pages-1)*r.offset:0}px,${r.horizontal?0:-(s*(r.pages-1)*r.offset)}px,0)`)}),c.render(C.createElement("div",(0,P.default)({ref:a,style:{...t,position:"absolute",top:0,left:0,willChange:"transform"}},n),C.createElement(eM.Provider,{value:r},C.createElement(D.q.Provider,{value:l},e)))),null};var ez=V,eL=V;let eC=new eL.Box3,eU=new eL.Vector3;class ej extends eL.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new eL.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new eL.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new eL.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new eL.InterleavedBufferAttribute(n,3,0)),this.setAttribute("instanceEnd",new eL.InterleavedBufferAttribute(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let i=new eL.InstancedInterleavedBuffer(n,2*t,1);return this.setAttribute("instanceColorStart",new eL.InterleavedBufferAttribute(i,t,0)),this.setAttribute("instanceColorEnd",new eL.InterleavedBufferAttribute(i,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new eL.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new eL.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),eC.setFromBufferAttribute(t),this.boundingBox.union(eC))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new eL.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)eU.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(eU)),eU.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(eU));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var eB=V,eO=e.i(985104);class eI extends eB.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:eB.UniformsUtils.clone(eB.UniformsUtils.merge([eB.UniformsLib.common,eB.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new eB.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${eO.version>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let eP=eO.version>=125?"uv1":"uv2",eT=new ez.Vector4,eD=new ez.Vector3,eR=new ez.Vector3,eV=new ez.Vector4,eH=new ez.Vector4,eF=new ez.Vector4,eN=new ez.Vector3,eG=new ez.Matrix4,eW=new ez.Line3,eq=new ez.Vector3,ek=new ez.Box3,e$=new ez.Sphere,eQ=new ez.Vector4;function eX(e,t,i){return eQ.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),eQ.multiplyScalar(1/eQ.w),eQ.x=n/i.width,eQ.y=n/i.height,eQ.applyMatrix4(e.projectionMatrixInverse),eQ.multiplyScalar(1/eQ.w),Math.abs(Math.max(eQ.x,eQ.y))}class eY extends ez.Mesh{constructor(e=new ej,t=new eI({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let e=0,r=0,a=t.count;e<a;e++,r+=2)eD.fromBufferAttribute(t,e),eR.fromBufferAttribute(n,e),i[r]=0===r?0:i[r-1],i[r+1]=i[r]+eD.distanceTo(eR);let r=new ez.InstancedInterleavedBuffer(i,2,1);return e.setAttribute("instanceDistanceStart",new ez.InterleavedBufferAttribute(r,1,0)),e.setAttribute("instanceDistanceEnd",new ez.InterleavedBufferAttribute(r,1,1)),this}raycast(e,i){let r,a,o=this.material.worldUnits,s=e.camera;null!==s||o||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let l=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let c=this.matrixWorld,u=this.geometry,f=this.material;if(n=f.linewidth+l,null===u.boundingSphere&&u.computeBoundingSphere(),e$.copy(u.boundingSphere).applyMatrix4(c),o)r=.5*n;else{let e=Math.max(s.near,e$.distanceToPoint(t.origin));r=eX(s,e,f.resolution)}if(e$.radius+=r,!1!==t.intersectsSphere(e$)){if(null===u.boundingBox&&u.computeBoundingBox(),ek.copy(u.boundingBox).applyMatrix4(c),o)a=.5*n;else{let e=Math.max(s.near,ek.distanceToPoint(t.origin));a=eX(s,e,f.resolution)}ek.expandByScalar(a),!1!==t.intersectsBox(ek)&&(o?function(e,i){let r=e.matrixWorld,a=e.geometry,o=a.attributes.instanceStart,s=a.attributes.instanceEnd,l=Math.min(a.instanceCount,o.count);for(let a=0;a<l;a++){eW.start.fromBufferAttribute(o,a),eW.end.fromBufferAttribute(s,a),eW.applyMatrix4(r);let l=new ez.Vector3,c=new ez.Vector3;t.distanceSqToSegment(eW.start,eW.end,c,l),c.distanceTo(l)<.5*n&&i.push({point:c,pointOnLine:l,distance:t.origin.distanceTo(c),object:e,face:null,faceIndex:a,uv:null,[eP]:null})}}(this,i):function(e,i,r){let a=i.projectionMatrix,o=e.material.resolution,s=e.matrixWorld,l=e.geometry,c=l.attributes.instanceStart,u=l.attributes.instanceEnd,f=Math.min(l.instanceCount,c.count),d=-i.near;t.at(1,eF),eF.w=1,eF.applyMatrix4(i.matrixWorldInverse),eF.applyMatrix4(a),eF.multiplyScalar(1/eF.w),eF.x*=o.x/2,eF.y*=o.y/2,eF.z=0,eN.copy(eF),eG.multiplyMatrices(i.matrixWorldInverse,s);for(let i=0;i<f;i++){if(eV.fromBufferAttribute(c,i),eH.fromBufferAttribute(u,i),eV.w=1,eH.w=1,eV.applyMatrix4(eG),eH.applyMatrix4(eG),eV.z>d&&eH.z>d)continue;if(eV.z>d){let e=eV.z-eH.z,t=(eV.z-d)/e;eV.lerp(eH,t)}else if(eH.z>d){let e=eH.z-eV.z,t=(eH.z-d)/e;eH.lerp(eV,t)}eV.applyMatrix4(a),eH.applyMatrix4(a),eV.multiplyScalar(1/eV.w),eH.multiplyScalar(1/eH.w),eV.x*=o.x/2,eV.y*=o.y/2,eH.x*=o.x/2,eH.y*=o.y/2,eW.start.copy(eV),eW.start.z=0,eW.end.copy(eH),eW.end.z=0;let l=eW.closestPointToPointParameter(eN,!0);eW.at(l,eq);let f=ez.MathUtils.lerp(eV.z,eH.z,l),p=f>=-1&&f<=1,h=eN.distanceTo(eq)<.5*n;if(p&&h){eW.start.fromBufferAttribute(c,i),eW.end.fromBufferAttribute(u,i),eW.start.applyMatrix4(s),eW.end.applyMatrix4(s);let n=new ez.Vector3,a=new ez.Vector3;t.distanceSqToSegment(eW.start,eW.end,a,n),r.push({point:a,pointOnLine:n,distance:t.origin.distanceTo(a),object:e,face:null,faceIndex:i,uv:null,[eP]:null})}}}(this,s,i))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(eT),this.material.uniforms.resolution.value.set(eT.z,eT.w))}}class eK extends ej{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let i=0;i<t;i+=3)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,i=new Float32Array(2*n);if(3===t)for(let r=0;r<n;r+=t)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5];else for(let r=0;r<n;r+=t)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5],i[2*r+6]=e[r+6],i[2*r+7]=e[r+7];return super.setColors(i,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class eJ extends eY{constructor(e=new eK,t=new eI({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let eZ=C.forwardRef(function({points:e,color:t=0xffffff,vertexColors:n,linewidth:i,lineWidth:r,segments:a,dashed:o,...s},l){var c,u;let f=(0,B.useThree)(e=>e.size),d=C.useMemo(()=>a?new eY:new eJ,[a]),[p]=C.useState(()=>new eI),h=(null==n||null==(c=n[0])?void 0:c.length)===4?4:3,m=C.useMemo(()=>{let i=a?new ej:new eK,r=e.map(e=>{let t=Array.isArray(e);return e instanceof V.Vector3||e instanceof V.Vector4?[e.x,e.y,e.z]:e instanceof V.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(i.setPositions(r.flat()),n){t=0xffffff;let e=n.map(e=>e instanceof V.Color?e.toArray():e);i.setColors(e.flat(),h)}return i},[e,a,n,h]);return C.useLayoutEffect(()=>{d.computeLineDistances()},[e,d]),C.useLayoutEffect(()=>{o?p.defines.USE_DASH="":delete p.defines.USE_DASH,p.needsUpdate=!0},[o,p]),C.useEffect(()=>()=>{m.dispose(),p.dispose()},[m]),C.createElement("primitive",(0,P.default)({object:d,ref:l},s),C.createElement("primitive",{object:m,attach:"geometry"}),C.createElement("primitive",(0,P.default)({object:p,attach:"material",color:t,vertexColors:!!n,resolution:[f.width,f.height],linewidth:null!=(u=null!=i?i:r)?u:1,dashed:o,transparent:4===h},s)))});var e0=e.i(932334);function e1({image:e,position:t,index:n,totalItems:i,scrollProgress:r,itemSize:a,onHover:o,onClick:s,isHovered:l,audioData:c}){let u=(0,C.useRef)(null),f=(0,C.useRef)(null),d=(0,O.useTexture)(e.src),[p,h]=(0,C.useState)(1),m=Math.abs(n-r*i),y=m<1,v=(0,C.useMemo)(()=>new V.Euler(0,Math.atan2(t.x,t.z)+Math.PI,0),[t]);(0,j.useFrame)((e,i)=>{let r=l?1.3:y?1.15:1-.05*m;if(c?.enabled){let e=n%5,t=[c.bass,c.lowMid,c.mid,c.highMid,c.treble][e]||0;r*=1+.25*t,c.isBeat&&y&&(r*=1+.3*c.beatIntensity)}if(h(e=>(0,e0.damp)(e,Math.max(.5,r),6,i)),u.current){u.current.scale.setScalar(p);let i=c?.enabled?.1*Math.sin(2*e.clock.elapsedTime+n)*(1+c.energy):.05*Math.sin(.001*Date.now()+n);if(u.current.position.y=t.y+i,c?.enabled&&u.current.material instanceof V.MeshStandardMaterial){let e=y?.5*c.energy:.2*c.energy;u.current.material.emissiveIntensity=e}}if(f.current&&c?.enabled){let e=1.1+.3*c.beatIntensity;f.current.scale.setScalar(e),f.current.material instanceof V.MeshBasicMaterial&&(f.current.material.opacity=.4+.4*c.beatIntensity)}});let g=d.image?d.image.width/d.image.height:1,x=g>1?a:a*g,w=g>1?a/g:a,b=Math.max(.3,1-.15*m);return(0,L.jsxs)("group",{position:t,rotation:v,children:[(0,L.jsxs)("mesh",{ref:u,onPointerEnter:()=>o(n),onPointerLeave:()=>o(null),onClick:s,children:[(0,L.jsx)("planeGeometry",{args:[x,w]}),(0,L.jsx)("meshStandardMaterial",{map:d,transparent:!0,opacity:b,emissive:y?"#4f46e5":"#000000",emissiveIntensity:.2*!!y})]}),(y||c?.enabled)&&(0,L.jsxs)("mesh",{ref:f,position:[0,0,-.02],scale:1.1,children:[(0,L.jsx)("ringGeometry",{args:[.55*Math.max(x,w),.6*Math.max(x,w),32]}),(0,L.jsx)("meshBasicMaterial",{color:c?.enabled?`hsl(${260+60*(c.mid||0)}, 80%, 50%)`:"#4f46e5",transparent:!0,opacity:y?.6:.3})]}),l&&e.alt&&(0,L.jsx)(I.Html,{center:!0,position:[0,-w/2-.3,.1],children:(0,L.jsx)("div",{className:"bg-indigo-600/90 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg",children:e.alt})})]})}function e2({images:e,radius:t,height:n,turns:i,itemSize:r,onImageClick:a,audioData:o}){let s=eA(),l=(0,C.useRef)(null),[c,u]=(0,C.useState)(null),[f,d]=(0,C.useState)(0),{camera:p}=(0,B.useThree)(),h=(0,C.useMemo)(()=>e.map((r,a)=>{let o=a/e.length*Math.PI*2*i;return(0,e0.helixPoint)(t,n,o,i)}),[e.length,t,n,i]);return(0,j.useFrame)(e=>{let t=s.offset;d(t);let i=(t-.5)*n;if(p.position.y=(0,e0.damp)(p.position.y,i,4,.016),l.current){let n=t*Math.PI*.5;o?.enabled&&(n+=Math.sin(2*e.clock.elapsedTime)*o.energy*.2,o.isBeat?l.current.rotation.x=.03*Math.sin(10*e.clock.elapsedTime)*o.beatIntensity:l.current.rotation.x=(0,e0.lerp)(l.current.rotation.x,0,.1)),l.current.rotation.y=n}}),(0,L.jsxs)(L.Fragment,{children:[(0,L.jsx)("ambientLight",{intensity:o?.enabled?.4+.3*o.energy:.5}),(0,L.jsx)("pointLight",{position:[10,10,10],intensity:o?.enabled?.8+.5*o.treble:1,color:"#ffffff"}),(0,L.jsx)("pointLight",{position:[-10,-10,-10],intensity:o?.enabled?.4+.4*o.bass:.5,color:"#4f46e5"}),(0,L.jsx)("pointLight",{position:[0,n/2,0],intensity:o?.enabled?.4+.4*o.mid:.5,color:"#06b6d4"}),(0,L.jsx)("pointLight",{position:[0,-n/2,0],intensity:o?.enabled?.4+.4*o.highMid:.5,color:"#8b5cf6"}),(0,L.jsxs)("group",{ref:l,children:[h.map((e,t)=>{if(t===h.length-1)return null;let n=h[t+1],i=[[e.x,e.y,e.z],[n.x,n.y,n.z]],r=o?.enabled?.3+.4*o.energy:.3;return(0,L.jsx)(eZ,{points:i,color:o?.enabled?`hsl(${260+40*(o.mid||0)}, 70%, 50%)`:"#4f46e5",transparent:!0,opacity:r,lineWidth:o?.enabled?1+2*o.bass:1},`line-${t}`)}),e.map((t,n)=>(0,L.jsx)(e1,{image:t,position:h[n],index:n,totalItems:e.length,scrollProgress:f,itemSize:r,onHover:u,onClick:()=>a?.(t,n),isHovered:c===n,audioData:o},`${t.src}-${n}`))]}),(0,L.jsx)(e3,{count:500,radius:3*t,audioData:o}),(0,L.jsx)("fog",{attach:"fog",args:["#0f172a",2*t,8*t]})]})}function e3({count:e,radius:t,audioData:n}){let i=(0,C.useRef)(null),[r,a]=(0,C.useMemo)(()=>{let n=new Float32Array(3*e),i=new Float32Array(3*e);for(let r=0;r<e;r++){let e=Math.random()*Math.PI*2,a=Math.acos(2*Math.random()-1),o=t*(.5+.5*Math.random());n[3*r]=o*Math.sin(a)*Math.cos(e),n[3*r+1]=o*Math.cos(a),n[3*r+2]=o*Math.sin(a)*Math.sin(e);let s=Math.random();i[3*r]=(0,e0.lerp)(.31,.02,s),i[3*r+1]=(0,e0.lerp)(.27,.71,s),i[3*r+2]=(0,e0.lerp)(.9,.83,s)}return[n,i]},[e,t]);return(0,j.useFrame)(e=>{if(i.current){let t=.02*e.clock.elapsedTime,r=.1*Math.sin(.01*e.clock.elapsedTime);n?.enabled&&(t*=1+2*n.energy,r*=1+2*n.bass),i.current.rotation.y=t,i.current.rotation.x=r,i.current.material instanceof V.PointsMaterial&&n?.enabled&&(i.current.material.size=.05+.05*n.beatIntensity,i.current.material.opacity=.6+.3*n.energy)}}),(0,L.jsxs)("points",{ref:i,children:[(0,L.jsxs)("bufferGeometry",{children:[(0,L.jsx)("bufferAttribute",{attach:"attributes-position",args:[r,3]}),(0,L.jsx)("bufferAttribute",{attach:"attributes-color",args:[a,3]})]}),(0,L.jsx)("pointsMaterial",{size:.05,transparent:!0,opacity:.6,vertexColors:!0,sizeAttenuation:!0})]})}function e4({images:e}){return(0,L.jsx)("div",{className:"w-full h-full overflow-y-auto bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 p-8",children:(0,L.jsx)("div",{className:"max-w-md mx-auto space-y-6",children:e.map((e,t)=>(0,L.jsxs)("div",{className:"transform hover:scale-105 transition-transform",style:{transform:`translateX(${20*Math.sin(.5*t)}px)`},children:[(0,L.jsx)("img",{src:e.src,alt:e.alt||"",className:"w-full h-48 object-cover rounded-xl shadow-xl"}),e.alt&&(0,L.jsx)("p",{className:"text-white/70 text-sm mt-2 text-center",children:e.alt})]},t))})})}function e5({images:e,className:t="w-full h-[700px]",radius:n=3,height:i=15,turns:r=2,itemSize:a=1.5,scrollPages:o=3,onImageClick:s,audioData:l}){let[c,u]=(0,C.useState)(!0);return((0,C.useEffect)(()=>{try{let e=document.createElement("canvas");e.getContext("webgl")||e.getContext("experimental-webgl")||u(!1)}catch{u(!1)}},[]),c)?(0,L.jsx)("div",{className:t,children:(0,L.jsx)(U.Canvas,{camera:{position:[0,0,3*n],fov:60},gl:{antialias:!0,alpha:!0},style:{background:"linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"},children:(0,L.jsx)(eE,{pages:o,damping:.25,children:(0,L.jsx)(e2,{images:e,radius:n,height:i,turns:r,itemSize:a,onImageClick:s,audioData:l})})})}):(0,L.jsx)("div",{className:t,children:(0,L.jsx)(e4,{images:e})})}e.s(["default",()=>e5],596217)}]);