module.exports=[388554,a=>{"use strict";let b,c;var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C=a.i(499969),D=a.i(863050),E=a.i(926725),F=a.i(75812),G=a.i(572423),H=a.i(532572),I=a.i(935194),J=a.i(212637),K=a.i(770908),L=a.i(250238),L=L;function M(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var N=a.i(835572);function O(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function P(a,b){if(a){if("string"==typeof a)return O(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);if("Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c)return Array.from(a);if("Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c))return O(a,b)}}function Q(a){return function(a){if(Array.isArray(a))return O(a)}(a)||function(a){if("u">typeof Symbol&&null!=a[Symbol.iterator]||null!=a["@@iterator"])return Array.from(a)}(a)||P(a)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}new N.Vector2,new N.Vector2;function R(a,b){if(!(a instanceof b))throw TypeError("Cannot call a class as a function")}var S=function a(b,c,d){var e=this;R(this,a),M(this,"dot2",function(a,b){return e.x*a+e.y*b}),M(this,"dot3",function(a,b,c){return e.x*a+e.y*b+e.z*c}),this.x=b,this.y=c,this.z=d},T=[new S(1,1,0),new S(-1,1,0),new S(1,-1,0),new S(-1,-1,0),new S(1,0,1),new S(-1,0,1),new S(1,0,-1),new S(-1,0,-1),new S(0,1,1),new S(0,-1,1),new S(0,1,-1),new S(0,-1,-1)],U=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180],V=Array(512),W=Array(512),X=0;(X=Math.floor(X))<256&&(X|=X<<8);for(var Y,Z=0;Z<256;Z++)Y=1&Z?U[Z]^255&X:U[Z]^X>>8&255,V[Z]=V[Z+256]=Y,W[Z]=W[Z+256]=T[Y%12];function $(a){var b=function(a){if("number"==typeof a)a=Math.abs(a);else if("string"==typeof a){var b=a;a=0;for(var c=0;c<b.length;c++)a=(a+(c+1)*(b.charCodeAt(c)%96))%0x7fffffff}return 0===a&&(a=311),a}(a);return function(){var a=48271*b%0x7fffffff;return b=a,a/0x7fffffff}}new function a(b){var c=this;R(this,a),M(this,"seed",0),M(this,"init",function(a){c.seed=a,c.value=$(a)}),M(this,"value",$(this.seed)),this.init(b)}(Math.random());var _=function(a){return 1/(1+a+.48*a*a+.235*a*a*a)};function aa(a,b,c){var d=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.25,e=arguments.length>4&&void 0!==arguments[4]?arguments[4]:.01,f=arguments.length>5&&void 0!==arguments[5]?arguments[5]:1/0,g=arguments.length>6&&void 0!==arguments[6]?arguments[6]:_,h=arguments.length>7&&void 0!==arguments[7]?arguments[7]:.001,i="velocity_"+b;if(void 0===a.__damp&&(a.__damp={}),void 0===a.__damp[i]&&(a.__damp[i]=0),Math.abs(a[b]-c)<=h)return a[b]=c,!1;var j=2/(d=Math.max(1e-4,d)),k=g(j*e),l=a[b]-c,m=c,n=f*d;l=Math.min(Math.max(l,-n),n),c=a[b]-l;var o=(a.__damp[i]+j*l)*e;a.__damp[i]=(a.__damp[i]-j*o)*k;var p=c+(l+o)*k;return m-a[b]>0==p>m&&(p=m,a.__damp[i]=(p-m)/e),a[b]=p,!0}var ab=new N.Vector3,ac=new N.Quaternion,ad=new N.Quaternion,ae=new N.Matrix4,af=new N.Vector3;function ag(a,b,c,d,e,f,g,h){var i,j,k,l;return aa(a,b,a[b]+(k=(i=c-a[b])-Math.floor(i/(j=2*Math.PI))*j,(l=Math.max(0,Math.min(j,k)))>Math.PI&&(l-=2*Math.PI),l),d,e,f,g,h)}var ah=new N.Vector2,ai=new N.Vector3;function aj(a,b,c,d,e,i,j){return"number"==typeof b?ai.setScalar(b):Array.isArray(b)?ai.set(b[0],b[1],b[2]):ai.copy(b),f=aa(a,"x",ai.x,c,d,e,i,j),g=aa(a,"y",ai.y,c,d,e,i,j),h=aa(a,"z",ai.z,c,d,e,i,j),f||g||h}var ak=new N.Vector4,al=new N.Euler,am=new N.Color,an=new N.Quaternion,ao=new N.Vector4,ap=new N.Vector4,aq=new N.Vector4;function ar(a,b,c,d,e,f,g){Array.isArray(b)?an.set(b[0],b[1],b[2],b[3]):an.copy(b);var h=a.dot(an)>0?1:-1;return an.x*=h,an.y*=h,an.z*=h,an.w*=h,s=aa(a,"x",an.x,c,d,e,f,g),t=aa(a,"y",an.y,c,d,e,f,g),u=aa(a,"z",an.z,c,d,e,f,g),v=aa(a,"w",an.w,c,d,e,f,g),ao.set(a.x,a.y,a.z,a.w).normalize(),ap.set(a.__damp.velocity_x,a.__damp.velocity_y,a.__damp.velocity_z,a.__damp.velocity_w),aq.copy(ao).multiplyScalar(ap.dot(ao)/ao.dot(ao)),a.__damp.velocity_x-=aq.x,a.__damp.velocity_y-=aq.y,a.__damp.velocity_z-=aq.z,a.__damp.velocity_w-=aq.w,a.set(ao.x,ao.y,ao.z,ao.w),s||t||u||v}var as=new N.Spherical,at=new N.Matrix4,au=new N.Vector3,av=new N.Quaternion,aw=new N.Vector3,ax=Object.freeze({__proto__:null,rsqw:function(a){var b=arguments.length>1&&void 0!==arguments[1]?arguments[1]:.01,c=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,d=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1/(2*Math.PI);return c/Math.atan(1/b)*Math.atan(Math.sin(2*Math.PI*a*d)/b)},exp:_,linear:function(a){return a},sine:{in:function(a){return 1-Math.cos(a*Math.PI/2)},out:function(a){return Math.sin(a*Math.PI/2)},inOut:function(a){return-(Math.cos(Math.PI*a)-1)/2}},cubic:{in:function(a){return a*a*a},out:function(a){return 1-Math.pow(1-a,3)},inOut:function(a){return a<.5?4*a*a*a:1-Math.pow(-2*a+2,3)/2}},quint:{in:function(a){return a*a*a*a*a},out:function(a){return 1-Math.pow(1-a,5)},inOut:function(a){return a<.5?16*a*a*a*a*a:1-Math.pow(-2*a+2,5)/2}},circ:{in:function(a){return 1-Math.sqrt(1-Math.pow(a,2))},out:function(a){return Math.sqrt(1-Math.pow(a-1,2))},inOut:function(a){return a<.5?(1-Math.sqrt(1-Math.pow(2*a,2)))/2:(Math.sqrt(1-Math.pow(-2*a+2,2))+1)/2}},quart:{in:function(a){return a*a*a*a},out:function(a){return 1- --a*a*a*a},inOut:function(a){return a<.5?8*a*a*a*a:1-8*--a*a*a*a}},expo:{in:function(a){return 0===a?0:Math.pow(2,10*a-10)},out:function(a){return 1===a?1:1-Math.pow(2,-10*a)},inOut:function(a){return 0===a?0:1===a?1:a<.5?Math.pow(2,20*a-10)/2:(2-Math.pow(2,-20*a+10))/2}},damp:aa,dampLookAt:function(a,b,c,d,e,f,g){"number"==typeof b?ab.setScalar(b):Array.isArray(b)?ab.set(b[0],b[1],b[2]):ab.copy(b);var h=a.parent;(a.updateWorldMatrix(!0,!1),af.setFromMatrixPosition(a.matrixWorld),a&&a.isCamera||a&&a.isLight)?ae.lookAt(af,ab,a.up):ae.lookAt(ab,af,a.up),ar(a.quaternion,ad.setFromRotationMatrix(ae),c,d,e,f,g),h&&(ae.extractRotation(h.matrixWorld),ac.setFromRotationMatrix(ae),ar(a.quaternion,ad.copy(a.quaternion).premultiply(ac.invert()),c,d,e,f,g))},dampAngle:ag,damp2:function(a,b,c,f,g,h,i){return"number"==typeof b?ah.setScalar(b):Array.isArray(b)?ah.set(b[0],b[1]):ah.copy(b),d=aa(a,"x",ah.x,c,f,g,h,i),e=aa(a,"y",ah.y,c,f,g,h,i),d||e},damp3:aj,damp4:function(a,b,c,d,e,f,g){return"number"==typeof b?ak.setScalar(b):Array.isArray(b)?ak.set(b[0],b[1],b[2],b[3]):ak.copy(b),i=aa(a,"x",ak.x,c,d,e,f,g),j=aa(a,"y",ak.y,c,d,e,f,g),k=aa(a,"z",ak.z,c,d,e,f,g),l=aa(a,"w",ak.w,c,d,e,f,g),i||j||k||l},dampE:function(a,b,c,d,e,f,g){return Array.isArray(b)?al.set(b[0],b[1],b[2],b[3]):al.copy(b),m=ag(a,"x",al.x,c,d,e,f,g),n=ag(a,"y",al.y,c,d,e,f,g),o=ag(a,"z",al.z,c,d,e,f,g),m||n||o},dampC:function(a,b,c,d,e,f,g){return b instanceof N.Color?am.copy(b):Array.isArray(b)?am.setRGB(b[0],b[1],b[2]):am.set(b),p=aa(a,"r",am.r,c,d,e,f,g),q=aa(a,"g",am.g,c,d,e,f,g),r=aa(a,"b",am.b,c,d,e,f,g),p||q||r},dampQ:ar,dampS:function(a,b,c,d,e,f,g){return Array.isArray(b)?as.set(b[0],b[1],b[2]):as.copy(b),w=aa(a,"radius",as.radius,c,d,e,f,g),x=ag(a,"phi",as.phi,c,d,e,f,g),y=ag(a,"theta",as.theta,c,d,e,f,g),w||x||y},dampM:function(a,b,c,d,e,f,g){return void 0===a.__damp&&(a.__damp={position:new N.Vector3,rotation:new N.Quaternion,scale:new N.Vector3},a.decompose(a.__damp.position,a.__damp.rotation,a.__damp.scale)),Array.isArray(b)?at.set.apply(at,Q(b)):at.copy(b),at.decompose(au,av,aw),z=aj(a.__damp.position,au,c,d,e,f,g),A=ar(a.__damp.rotation,av,c,d,e,f,g),B=aj(a.__damp.scale,aw,c,d,e,f,g),a.compose(a.__damp.position,a.__damp.rotation,a.__damp.scale),z||A||B}});N.BufferGeometry;let ay=D.createContext(null);function az(){return D.useContext(ay)}function aA({eps:a=1e-5,enabled:b=!0,infinite:c,horizontal:d,pages:e=1,distance:f=1,damping:g=.25,maxSpeed:h=1/0,prepend:i=!1,style:j={},children:k}){let{get:l,setEvents:m,gl:n,size:o,invalidate:p,events:q}=(0,G.useThree)(),[r]=D.useState(()=>document.createElement("div")),[s]=D.useState(()=>document.createElement("div")),[t]=D.useState(()=>document.createElement("div")),u=n.domElement.parentNode,v=D.useRef(0),w=D.useMemo(()=>({el:r,eps:a,fill:s,fixed:t,horizontal:d,damping:g,offset:0,delta:0,scroll:v,pages:e,range(a,b,c=0){let d=a-c,e=d+b+2*c;return this.offset<d?0:this.offset>e?1:(this.offset-d)/(e-d)},curve(a,b,c=0){return Math.sin(this.range(a,b,c)*Math.PI)},visible(a,b,c=0){let d=a-c;return this.offset>=d&&this.offset<=d+b+2*c}}),[a,g,d,e]);D.useEffect(()=>{for(let a in r.style.position="absolute",r.style.width="100%",r.style.height="100%",r.style[d?"overflowX":"overflowY"]="auto",r.style[d?"overflowY":"overflowX"]="hidden",r.style.top="0px",r.style.left="0px",j)r.style[a]=j[a];t.style.position="sticky",t.style.top="0px",t.style.left="0px",t.style.width="100%",t.style.height="100%",t.style.overflow="hidden",r.appendChild(t),s.style.height=d?"100%":`${e*f*100}%`,s.style.width=d?`${e*f*100}%`:"100%",s.style.pointerEvents="none",r.appendChild(s),i?u.prepend(r):u.appendChild(r),r[d?"scrollLeft":"scrollTop"]=1;let a=q.connected||n.domElement;requestAnimationFrame(()=>null==q.connect?void 0:q.connect(r));let b=l().events.compute;return m({compute(a,b){let{left:c,top:d}=u.getBoundingClientRect(),e=a.clientX-c,f=a.clientY-d;b.pointer.set(e/b.size.width*2-1,-(2*(f/b.size.height))+1),b.raycaster.setFromCamera(b.pointer,b.camera)}}),()=>{u.removeChild(r),m({compute:b}),null==q.connect||q.connect(a)}},[e,f,d,r,s,t,u]),D.useEffect(()=>{if(q.connected===r){let a=o[d?"width":"height"],e=r[d?"scrollWidth":"scrollHeight"],f=e-a,g=0,h=!0,i=!0,j=()=>{if(b&&!i&&(p(),v.current=(g=r[d?"scrollLeft":"scrollTop"])/f,c)){if(!h){if(g>=f){let a=1-w.offset;r[d?"scrollLeft":"scrollTop"]=1,v.current=w.offset=-a,h=!0}else if(g<=0){let a=1+w.offset;r[d?"scrollLeft":"scrollTop"]=e,v.current=w.offset=a,h=!0}}h&&setTimeout(()=>h=!1,40)}};r.addEventListener("scroll",j,{passive:!0}),requestAnimationFrame(()=>i=!1);let k=a=>r.scrollLeft+=a.deltaY/2;return d&&r.addEventListener("wheel",k,{passive:!0}),()=>{r.removeEventListener("scroll",j),d&&r.removeEventListener("wheel",k)}}},[r,q,o,c,w,p,d,b]);let x=0;return(0,F.useFrame)((b,c)=>{x=w.offset,ax.damp(w,"offset",v.current,g,c,h,void 0,a),ax.damp(w,"delta",Math.abs(x-w.offset),g,c,h,void 0,a),w.delta>a&&p()}),D.createElement(ay.Provider,{value:w},k)}({children:a},b)=>{let c=D.useRef(null);D.useImperativeHandle(b,()=>c.current,[]);let d=az(),{width:e,height:f}=(0,G.useThree)(a=>a.viewport);return(0,F.useFrame)(()=>{c.current.position.x=d.horizontal?-e*(d.pages-1)*d.offset:0,c.current.position.y=d.horizontal?0:f*(d.pages-1)*d.offset}),D.createElement("group",{ref:c},a)},({children:a,style:b,...c},d)=>{let e=az(),f=D.useRef(null);D.useImperativeHandle(d,()=>f.current,[]);let{width:g,height:h}=(0,G.useThree)(a=>a.size),i=D.useContext(L.q),j=D.useMemo(()=>K.createRoot(e.fixed),[e.fixed]);return(0,F.useFrame)(()=>{e.delta>e.eps&&(f.current.style.transform=`translate3d(${e.horizontal?-g*(e.pages-1)*e.offset:0}px,${e.horizontal?0:-(h*(e.pages-1)*e.offset)}px,0)`)}),j.render(D.createElement("div",(0,J.default)({ref:f,style:{...b,position:"absolute",top:0,left:0,willChange:"transform"}},c),D.createElement(ay.Provider,{value:e},D.createElement(L.q.Provider,{value:i},a)))),null};var aB=N,aC=N;let aD=new aC.Box3,aE=new aC.Vector3;class aF extends aC.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new aC.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new aC.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(a){let b=this.attributes.instanceStart,c=this.attributes.instanceEnd;return void 0!==b&&(b.applyMatrix4(a),c.applyMatrix4(a),b.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(a){let b;a instanceof Float32Array?b=a:Array.isArray(a)&&(b=new Float32Array(a));let c=new aC.InstancedInterleavedBuffer(b,6,1);return this.setAttribute("instanceStart",new aC.InterleavedBufferAttribute(c,3,0)),this.setAttribute("instanceEnd",new aC.InterleavedBufferAttribute(c,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(a,b=3){let c;a instanceof Float32Array?c=a:Array.isArray(a)&&(c=new Float32Array(a));let d=new aC.InstancedInterleavedBuffer(c,2*b,1);return this.setAttribute("instanceColorStart",new aC.InterleavedBufferAttribute(d,b,0)),this.setAttribute("instanceColorEnd",new aC.InterleavedBufferAttribute(d,b,b)),this}fromWireframeGeometry(a){return this.setPositions(a.attributes.position.array),this}fromEdgesGeometry(a){return this.setPositions(a.attributes.position.array),this}fromMesh(a){return this.fromWireframeGeometry(new aC.WireframeGeometry(a.geometry)),this}fromLineSegments(a){let b=a.geometry;return this.setPositions(b.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new aC.Box3);let a=this.attributes.instanceStart,b=this.attributes.instanceEnd;void 0!==a&&void 0!==b&&(this.boundingBox.setFromBufferAttribute(a),aD.setFromBufferAttribute(b),this.boundingBox.union(aD))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new aC.Sphere),null===this.boundingBox&&this.computeBoundingBox();let a=this.attributes.instanceStart,b=this.attributes.instanceEnd;if(void 0!==a&&void 0!==b){let c=this.boundingSphere.center;this.boundingBox.getCenter(c);let d=0;for(let e=0,f=a.count;e<f;e++)aE.fromBufferAttribute(a,e),d=Math.max(d,c.distanceToSquared(aE)),aE.fromBufferAttribute(b,e),d=Math.max(d,c.distanceToSquared(aE));this.boundingSphere.radius=Math.sqrt(d),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(a){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(a)}}var aG=N,aH=a.i(284722);class aI extends aG.ShaderMaterial{constructor(a){super({type:"LineMaterial",uniforms:aG.UniformsUtils.clone(aG.UniformsUtils.merge([aG.UniformsLib.common,aG.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new aG.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
					#include <${aH.version>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(a){this.uniforms.diffuse.value=a}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(a){!0===a?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(a){this.uniforms.linewidth.value=a}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(a){!!a!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===a?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(a){this.uniforms.dashScale.value=a}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(a){this.uniforms.dashSize.value=a}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(a){this.uniforms.dashOffset.value=a}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(a){this.uniforms.gapSize.value=a}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(a){this.uniforms.opacity.value=a}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(a){this.uniforms.resolution.value.copy(a)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(a){!!a!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===a?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(a)}}let aJ=aH.version>=125?"uv1":"uv2",aK=new aB.Vector4,aL=new aB.Vector3,aM=new aB.Vector3,aN=new aB.Vector4,aO=new aB.Vector4,aP=new aB.Vector4,aQ=new aB.Vector3,aR=new aB.Matrix4,aS=new aB.Line3,aT=new aB.Vector3,aU=new aB.Box3,aV=new aB.Sphere,aW=new aB.Vector4;function aX(a,b,d){return aW.set(0,0,-b,1).applyMatrix4(a.projectionMatrix),aW.multiplyScalar(1/aW.w),aW.x=c/d.width,aW.y=c/d.height,aW.applyMatrix4(a.projectionMatrixInverse),aW.multiplyScalar(1/aW.w),Math.abs(Math.max(aW.x,aW.y))}class aY extends aB.Mesh{constructor(a=new aF,b=new aI({color:0xffffff*Math.random()})){super(a,b),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let a=this.geometry,b=a.attributes.instanceStart,c=a.attributes.instanceEnd,d=new Float32Array(2*b.count);for(let a=0,e=0,f=b.count;a<f;a++,e+=2)aL.fromBufferAttribute(b,a),aM.fromBufferAttribute(c,a),d[e]=0===e?0:d[e-1],d[e+1]=d[e]+aL.distanceTo(aM);let e=new aB.InstancedInterleavedBuffer(d,2,1);return a.setAttribute("instanceDistanceStart",new aB.InterleavedBufferAttribute(e,1,0)),a.setAttribute("instanceDistanceEnd",new aB.InterleavedBufferAttribute(e,1,1)),this}raycast(a,d){let e,f,g=this.material.worldUnits,h=a.camera;null!==h||g||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let i=void 0!==a.params.Line2&&a.params.Line2.threshold||0;b=a.ray;let j=this.matrixWorld,k=this.geometry,l=this.material;if(c=l.linewidth+i,null===k.boundingSphere&&k.computeBoundingSphere(),aV.copy(k.boundingSphere).applyMatrix4(j),g)e=.5*c;else{let a=Math.max(h.near,aV.distanceToPoint(b.origin));e=aX(h,a,l.resolution)}if(aV.radius+=e,!1!==b.intersectsSphere(aV)){if(null===k.boundingBox&&k.computeBoundingBox(),aU.copy(k.boundingBox).applyMatrix4(j),g)f=.5*c;else{let a=Math.max(h.near,aU.distanceToPoint(b.origin));f=aX(h,a,l.resolution)}aU.expandByScalar(f),!1!==b.intersectsBox(aU)&&(g?function(a,d){let e=a.matrixWorld,f=a.geometry,g=f.attributes.instanceStart,h=f.attributes.instanceEnd,i=Math.min(f.instanceCount,g.count);for(let f=0;f<i;f++){aS.start.fromBufferAttribute(g,f),aS.end.fromBufferAttribute(h,f),aS.applyMatrix4(e);let i=new aB.Vector3,j=new aB.Vector3;b.distanceSqToSegment(aS.start,aS.end,j,i),j.distanceTo(i)<.5*c&&d.push({point:j,pointOnLine:i,distance:b.origin.distanceTo(j),object:a,face:null,faceIndex:f,uv:null,[aJ]:null})}}(this,d):function(a,d,e){let f=d.projectionMatrix,g=a.material.resolution,h=a.matrixWorld,i=a.geometry,j=i.attributes.instanceStart,k=i.attributes.instanceEnd,l=Math.min(i.instanceCount,j.count),m=-d.near;b.at(1,aP),aP.w=1,aP.applyMatrix4(d.matrixWorldInverse),aP.applyMatrix4(f),aP.multiplyScalar(1/aP.w),aP.x*=g.x/2,aP.y*=g.y/2,aP.z=0,aQ.copy(aP),aR.multiplyMatrices(d.matrixWorldInverse,h);for(let d=0;d<l;d++){if(aN.fromBufferAttribute(j,d),aO.fromBufferAttribute(k,d),aN.w=1,aO.w=1,aN.applyMatrix4(aR),aO.applyMatrix4(aR),aN.z>m&&aO.z>m)continue;if(aN.z>m){let a=aN.z-aO.z,b=(aN.z-m)/a;aN.lerp(aO,b)}else if(aO.z>m){let a=aO.z-aN.z,b=(aO.z-m)/a;aO.lerp(aN,b)}aN.applyMatrix4(f),aO.applyMatrix4(f),aN.multiplyScalar(1/aN.w),aO.multiplyScalar(1/aO.w),aN.x*=g.x/2,aN.y*=g.y/2,aO.x*=g.x/2,aO.y*=g.y/2,aS.start.copy(aN),aS.start.z=0,aS.end.copy(aO),aS.end.z=0;let i=aS.closestPointToPointParameter(aQ,!0);aS.at(i,aT);let l=aB.MathUtils.lerp(aN.z,aO.z,i),n=l>=-1&&l<=1,o=aQ.distanceTo(aT)<.5*c;if(n&&o){aS.start.fromBufferAttribute(j,d),aS.end.fromBufferAttribute(k,d),aS.start.applyMatrix4(h),aS.end.applyMatrix4(h);let c=new aB.Vector3,f=new aB.Vector3;b.distanceSqToSegment(aS.start,aS.end,f,c),e.push({point:f,pointOnLine:c,distance:b.origin.distanceTo(f),object:a,face:null,faceIndex:d,uv:null,[aJ]:null})}}}(this,h,d))}}onBeforeRender(a){let b=this.material.uniforms;b&&b.resolution&&(a.getViewport(aK),this.material.uniforms.resolution.value.set(aK.z,aK.w))}}class aZ extends aF{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(a){let b=a.length-3,c=new Float32Array(2*b);for(let d=0;d<b;d+=3)c[2*d]=a[d],c[2*d+1]=a[d+1],c[2*d+2]=a[d+2],c[2*d+3]=a[d+3],c[2*d+4]=a[d+4],c[2*d+5]=a[d+5];return super.setPositions(c),this}setColors(a,b=3){let c=a.length-b,d=new Float32Array(2*c);if(3===b)for(let e=0;e<c;e+=b)d[2*e]=a[e],d[2*e+1]=a[e+1],d[2*e+2]=a[e+2],d[2*e+3]=a[e+3],d[2*e+4]=a[e+4],d[2*e+5]=a[e+5];else for(let e=0;e<c;e+=b)d[2*e]=a[e],d[2*e+1]=a[e+1],d[2*e+2]=a[e+2],d[2*e+3]=a[e+3],d[2*e+4]=a[e+4],d[2*e+5]=a[e+5],d[2*e+6]=a[e+6],d[2*e+7]=a[e+7];return super.setColors(d,b),this}fromLine(a){let b=a.geometry;return this.setPositions(b.attributes.position.array),this}}class a$ extends aY{constructor(a=new aZ,b=new aI({color:0xffffff*Math.random()})){super(a,b),this.isLine2=!0,this.type="Line2"}}let a_=D.forwardRef(function({points:a,color:b=0xffffff,vertexColors:c,linewidth:d,lineWidth:e,segments:f,dashed:g,...h},i){var j,k;let l=(0,G.useThree)(a=>a.size),m=D.useMemo(()=>f?new aY:new a$,[f]),[n]=D.useState(()=>new aI),o=(null==c||null==(j=c[0])?void 0:j.length)===4?4:3,p=D.useMemo(()=>{let d=f?new aF:new aZ,e=a.map(a=>{let b=Array.isArray(a);return a instanceof N.Vector3||a instanceof N.Vector4?[a.x,a.y,a.z]:a instanceof N.Vector2?[a.x,a.y,0]:b&&3===a.length?[a[0],a[1],a[2]]:b&&2===a.length?[a[0],a[1],0]:a});if(d.setPositions(e.flat()),c){b=0xffffff;let a=c.map(a=>a instanceof N.Color?a.toArray():a);d.setColors(a.flat(),o)}return d},[a,f,c,o]);return D.useLayoutEffect(()=>{m.computeLineDistances()},[a,m]),D.useLayoutEffect(()=>{g?n.defines.USE_DASH="":delete n.defines.USE_DASH,n.needsUpdate=!0},[g,n]),D.useEffect(()=>()=>{p.dispose(),n.dispose()},[p]),D.createElement("primitive",(0,J.default)({object:m,ref:i},h),D.createElement("primitive",{object:p,attach:"geometry"}),D.createElement("primitive",(0,J.default)({object:n,attach:"material",color:b,vertexColors:!!c,resolution:[l.width,l.height],linewidth:null!=(k=null!=d?d:e)?k:1,dashed:g,transparent:4===o},h)))});var a0=a.i(233379);function a1({image:a,position:b,index:c,totalItems:d,scrollProgress:e,itemSize:f,onHover:g,onClick:h,isHovered:i,audioData:j}){let k=(0,D.useRef)(null),l=(0,D.useRef)(null),m=(0,H.useTexture)(a.src),[n,o]=(0,D.useState)(1),p=Math.abs(c-e*d),q=p<1,r=(0,D.useMemo)(()=>new N.Euler(0,Math.atan2(b.x,b.z)+Math.PI,0),[b]);(0,F.useFrame)((a,d)=>{let e=i?1.3:q?1.15:1-.05*p;if(j?.enabled){let a=c%5,b=[j.bass,j.lowMid,j.mid,j.highMid,j.treble][a]||0;e*=1+.25*b,j.isBeat&&q&&(e*=1+.3*j.beatIntensity)}if(o(a=>(0,a0.damp)(a,Math.max(.5,e),6,d)),k.current){k.current.scale.setScalar(n);let d=j?.enabled?.1*Math.sin(2*a.clock.elapsedTime+c)*(1+j.energy):.05*Math.sin(.001*Date.now()+c);if(k.current.position.y=b.y+d,j?.enabled&&k.current.material instanceof N.MeshStandardMaterial){let a=q?.5*j.energy:.2*j.energy;k.current.material.emissiveIntensity=a}}if(l.current&&j?.enabled){let a=1.1+.3*j.beatIntensity;l.current.scale.setScalar(a),l.current.material instanceof N.MeshBasicMaterial&&(l.current.material.opacity=.4+.4*j.beatIntensity)}});let s=m.image?m.image.width/m.image.height:1,t=s>1?f:f*s,u=s>1?f/s:f,v=Math.max(.3,1-.15*p);return(0,C.jsxs)("group",{position:b,rotation:r,children:[(0,C.jsxs)("mesh",{ref:k,onPointerEnter:()=>g(c),onPointerLeave:()=>g(null),onClick:h,children:[(0,C.jsx)("planeGeometry",{args:[t,u]}),(0,C.jsx)("meshStandardMaterial",{map:m,transparent:!0,opacity:v,emissive:q?"#4f46e5":"#000000",emissiveIntensity:.2*!!q})]}),(q||j?.enabled)&&(0,C.jsxs)("mesh",{ref:l,position:[0,0,-.02],scale:1.1,children:[(0,C.jsx)("ringGeometry",{args:[.55*Math.max(t,u),.6*Math.max(t,u),32]}),(0,C.jsx)("meshBasicMaterial",{color:j?.enabled?`hsl(${260+60*(j.mid||0)}, 80%, 50%)`:"#4f46e5",transparent:!0,opacity:q?.6:.3})]}),i&&a.alt&&(0,C.jsx)(I.Html,{center:!0,position:[0,-u/2-.3,.1],children:(0,C.jsx)("div",{className:"bg-indigo-600/90 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg",children:a.alt})})]})}function a2({images:a,radius:b,height:c,turns:d,itemSize:e,onImageClick:f,audioData:g}){let h=az(),i=(0,D.useRef)(null),[j,k]=(0,D.useState)(null),[l,m]=(0,D.useState)(0),{camera:n}=(0,G.useThree)(),o=(0,D.useMemo)(()=>a.map((e,f)=>{let g=f/a.length*Math.PI*2*d;return(0,a0.helixPoint)(b,c,g,d)}),[a.length,b,c,d]);return(0,F.useFrame)(a=>{let b=h.offset;m(b);let d=(b-.5)*c;if(n.position.y=(0,a0.damp)(n.position.y,d,4,.016),i.current){let c=b*Math.PI*.5;g?.enabled&&(c+=Math.sin(2*a.clock.elapsedTime)*g.energy*.2,g.isBeat?i.current.rotation.x=.03*Math.sin(10*a.clock.elapsedTime)*g.beatIntensity:i.current.rotation.x=(0,a0.lerp)(i.current.rotation.x,0,.1)),i.current.rotation.y=c}}),(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)("ambientLight",{intensity:g?.enabled?.4+.3*g.energy:.5}),(0,C.jsx)("pointLight",{position:[10,10,10],intensity:g?.enabled?.8+.5*g.treble:1,color:"#ffffff"}),(0,C.jsx)("pointLight",{position:[-10,-10,-10],intensity:g?.enabled?.4+.4*g.bass:.5,color:"#4f46e5"}),(0,C.jsx)("pointLight",{position:[0,c/2,0],intensity:g?.enabled?.4+.4*g.mid:.5,color:"#06b6d4"}),(0,C.jsx)("pointLight",{position:[0,-c/2,0],intensity:g?.enabled?.4+.4*g.highMid:.5,color:"#8b5cf6"}),(0,C.jsxs)("group",{ref:i,children:[o.map((a,b)=>{if(b===o.length-1)return null;let c=o[b+1],d=[[a.x,a.y,a.z],[c.x,c.y,c.z]],e=g?.enabled?.3+.4*g.energy:.3;return(0,C.jsx)(a_,{points:d,color:g?.enabled?`hsl(${260+40*(g.mid||0)}, 70%, 50%)`:"#4f46e5",transparent:!0,opacity:e,lineWidth:g?.enabled?1+2*g.bass:1},`line-${b}`)}),a.map((b,c)=>(0,C.jsx)(a1,{image:b,position:o[c],index:c,totalItems:a.length,scrollProgress:l,itemSize:e,onHover:k,onClick:()=>f?.(b,c),isHovered:j===c,audioData:g},`${b.src}-${c}`))]}),(0,C.jsx)(a3,{count:500,radius:3*b,audioData:g}),(0,C.jsx)("fog",{attach:"fog",args:["#0f172a",2*b,8*b]})]})}function a3({count:a,radius:b,audioData:c}){let d=(0,D.useRef)(null),[e,f]=(0,D.useMemo)(()=>{let c=new Float32Array(3*a),d=new Float32Array(3*a);for(let e=0;e<a;e++){let a=Math.random()*Math.PI*2,f=Math.acos(2*Math.random()-1),g=b*(.5+.5*Math.random());c[3*e]=g*Math.sin(f)*Math.cos(a),c[3*e+1]=g*Math.cos(f),c[3*e+2]=g*Math.sin(f)*Math.sin(a);let h=Math.random();d[3*e]=(0,a0.lerp)(.31,.02,h),d[3*e+1]=(0,a0.lerp)(.27,.71,h),d[3*e+2]=(0,a0.lerp)(.9,.83,h)}return[c,d]},[a,b]);return(0,F.useFrame)(a=>{if(d.current){let b=.02*a.clock.elapsedTime,e=.1*Math.sin(.01*a.clock.elapsedTime);c?.enabled&&(b*=1+2*c.energy,e*=1+2*c.bass),d.current.rotation.y=b,d.current.rotation.x=e,d.current.material instanceof N.PointsMaterial&&c?.enabled&&(d.current.material.size=.05+.05*c.beatIntensity,d.current.material.opacity=.6+.3*c.energy)}}),(0,C.jsxs)("points",{ref:d,children:[(0,C.jsxs)("bufferGeometry",{children:[(0,C.jsx)("bufferAttribute",{attach:"attributes-position",args:[e,3]}),(0,C.jsx)("bufferAttribute",{attach:"attributes-color",args:[f,3]})]}),(0,C.jsx)("pointsMaterial",{size:.05,transparent:!0,opacity:.6,vertexColors:!0,sizeAttenuation:!0})]})}function a4({images:a}){return(0,C.jsx)("div",{className:"w-full h-full overflow-y-auto bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 p-8",children:(0,C.jsx)("div",{className:"max-w-md mx-auto space-y-6",children:a.map((a,b)=>(0,C.jsxs)("div",{className:"transform hover:scale-105 transition-transform",style:{transform:`translateX(${20*Math.sin(.5*b)}px)`},children:[(0,C.jsx)("img",{src:a.src,alt:a.alt||"",className:"w-full h-48 object-cover rounded-xl shadow-xl"}),a.alt&&(0,C.jsx)("p",{className:"text-white/70 text-sm mt-2 text-center",children:a.alt})]},b))})})}function a5({images:a,className:b="w-full h-[700px]",radius:c=3,height:d=15,turns:e=2,itemSize:f=1.5,scrollPages:g=3,onImageClick:h,audioData:i}){let[j,k]=(0,D.useState)(!0);return((0,D.useEffect)(()=>{try{let a=document.createElement("canvas");a.getContext("webgl")||a.getContext("experimental-webgl")||k(!1)}catch{k(!1)}},[]),j)?(0,C.jsx)("div",{className:b,children:(0,C.jsx)(E.Canvas,{camera:{position:[0,0,3*c],fov:60},gl:{antialias:!0,alpha:!0},style:{background:"linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"},children:(0,C.jsx)(aA,{pages:g,damping:.25,children:(0,C.jsx)(a2,{images:a,radius:c,height:d,turns:e,itemSize:f,onImageClick:h,audioData:i})})})}):(0,C.jsx)("div",{className:b,children:(0,C.jsx)(a4,{images:a})})}a.s(["default",()=>a5],388554)}];

//# sourceMappingURL=src_components_gallery-3d_HelixGallery_tsx_34189d7f._.js.map