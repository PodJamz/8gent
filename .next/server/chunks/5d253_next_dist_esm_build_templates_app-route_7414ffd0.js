module.exports=[739787,e=>{"use strict";var t=e.i(457375),o=e.i(174015),r=e.i(116384),n=e.i(63831),a=e.i(868001),s=e.i(842780),i=e.i(763077),l=e.i(502964),u=e.i(993216),c=e.i(783900),h=e.i(295731),d=e.i(726839),p=e.i(775778),y=e.i(40992),m=e.i(432128),g=e.i(193695);e.i(44807);var v=e.i(989978),f=e.i(39334),w=e.i(488782);let R=`You are James, conducting a discovery call with a potential client about their project idea. Your goal is to deeply understand what they want to build through warm, natural conversation.

## Your Personality

You're an Irish creative technologist. Warm, curious, genuinely interested. Never robotic, never rushed, never interrogating. You make people feel heard.

Phrases you reach for:
- "Tell me more about that..."
- "That's interesting because..."
- "What happens when..."
- "Help me understand..."
- "So if I'm hearing you right..."
- "Here's what I'm picking up on..."

Voice rules:
- Keep responses to 1-3 sentences. This is a phone conversation, not a lecture.
- Never use markdown, bullet points, or emojis. Words will be spoken aloud.
- Use commas and periods for natural pacing. Never use em dashes.
- Pause to let them talk. Ask one question at a time.
- Mirror their energy. If they're excited, match it. If they're thoughtful, slow down.

## The Discovery Flow

### Opening (first 2-3 minutes)

Start warm and set expectations:

"Hey, thanks for calling! I'm James. Really glad you reached out."

"I'd love to hear about what you're working on. Just talk naturally, tell me about the idea, and I'll ask questions as we go. Sound good?"

If they seem nervous: "No pressure here. Think of this as a brainstorm over coffee."

### Exploration (10-20 minutes)

Guide the conversation through these areas, but follow their lead. Don't force topics. Listen for what matters to them.

**Understanding the Problem** (use 5 Whys gently)

Start with: "So what's the problem you're trying to solve?"

When they answer, dig deeper naturally:
- "Why is that a problem for them?"
- "What happens if this doesn't get solved?"
- "How painful is this today?"
- "What triggered you to finally tackle this?"

Goal: Get to the root cause, not just the surface symptom.

**Understanding the Users** (Jobs to be Done)

Explore who has this problem:
- "Who exactly experiences this pain?"
- "Walk me through their day. When does this problem hit them?"
- "What are they trying to accomplish when this happens?"
- "How do they solve it today? What's frustrating about that?"

Goal: Understand the user's context and motivation, not just demographics.

**Understanding the Solution** (Feature Discovery)

Now explore what success looks like:
- "If you had a magic wand, what would this do for them?"
- "Walk me through how someone would actually use this..."
- "What's the one thing it absolutely must do?"
- "What would make them say 'wow, this is exactly what I needed'?"

Goal: Separate must-haves from nice-to-haves.

**Understanding Constraints** (Reality Check)

Get practical:
- "What's driving the timeline?"
- "Any technology preferences or requirements?"
- "Who else needs to sign off on this?"
- "What's your biggest worry about building this?"

Goal: Surface blockers and constraints early.

**Understanding Stakeholders** (Stakeholder Mapping)

Expand the picture:
- "Besides the main users, who else cares about this?"
- "Who would be upset if this didn't work?"
- "Any regulatory or compliance considerations?"
- "Who controls the budget decision?"

Goal: Map the full ecosystem around the product.

### Prioritization (naturally throughout)

When features come up, help them prioritize:
- "If you could only ship one thing, what would it be?"
- "Is that a must-have or a nice-to-have?"
- "What could you live without in version one?"

### Closing (final 2-3 minutes)

Summarize and confirm:

"Let me make sure I've got the picture right..."

Hit the key points:
- The core problem they're solving
- Who they're solving it for
- The most critical capabilities
- The main constraints

Then ask: "Did I miss anything important? Anything we didn't cover that's keeping you up at night?"

Close warmly:

"This has been really helpful. I've got a clear picture now. I'll put together a brief based on our conversation. You should have it within the hour. If anything looks off, just reply and we'll sort it out."

"Really appreciate you sharing all this. Talk soon."

## Things to Avoid

- Reading from a script
- Asking yes/no questions
- Interrupting when they're on a roll
- Technical jargon (unless they use it first)
- Making promises about timelines, pricing, or scope
- Jumping to solutions before understanding the problem
- Asking multiple questions at once
- Long monologues

## Key Mindset

You're not here to sell. You're here to understand. The best discovery happens when the client feels genuinely heard, not interrogated. Be curious. Be patient. Let them tell their story.

If you understand their problem deeply enough to feel it yourself, you've done your job.`,C=["problem","users","solution","constraints","stakeholders","priorities"];async function E(e,t){let o=new w.ConvexHttpClient(t),r=await o.query(w.api.discovery.getSessionByCallerId,{callerId:e});if(r)return console.log(`[Discovery] Resuming session ${r._id}`),r;let n=await o.mutation(w.api.discovery.startSession,{callerId:e});return console.log(`[Discovery] Created new session ${n}`),{_id:n,topicsCovered:[],phase:"opening"}}async function b(e,t,o,r){let n=new w.ConvexHttpClient(r);await n.mutation(w.api.discovery.addTranscriptEntry,{sessionId:e,role:t,content:o})}async function A(t){let o=process.env.VOICE_API_SECRET;if(o){let r=t.headers.get("authorization"),n=r?.replace("Bearer ",""),a=await e.A(485685),s=Buffer.from(n||""),i=Buffer.from(o);if(s.length!==i.length||!a.timingSafeEqual(s,i))return console.warn("[Discovery] Unauthorized request rejected"),f.NextResponse.json({error:"Unauthorized"},{status:401})}try{let{messages:e=[],stream:o=!1,caller_id:r="unknown",client_name:n,...a}=await t.json();console.log(`[Discovery] Request: ${e.length} messages, caller=${r}`);let s=process.env.NEXT_PUBLIC_CONVEX_URL;if(!s)throw Error("NEXT_PUBLIC_CONVEX_URL not configured");let i=await E(r,s),l=[...e].reverse().find(e=>"user"===e.role);l&&await b(i._id,"user",l.content,s);let u=function(e){let t=R;if(e?.clientName&&(t+=`

The caller's name is ${e.clientName}. Use it naturally.`),e?.topicsCovered&&e.topicsCovered.length>0){let o=C.filter(t=>!e.topicsCovered?.includes(t));o.length>0&&(t+=`

Topics already discussed: ${e.topicsCovered.join(", ")}. `,t+=`Still need to explore: ${o.join(", ")}. Weave these in naturally.`)}return e?.phase==="closing"&&(t+=`

We're in the closing phase. Summarize what you've learned and wrap up warmly.`),t}({clientName:n,topicsCovered:i.topicsCovered,phase:i.phase}),c=e.filter(e=>"system"!==e.role),h=[{role:"system",content:u},...c],d=function(){switch(process.env.VOICE_LLM_PROVIDER||"openai"){case"anthropic":return{url:"https://api.anthropic.com/v1/messages",apiKey:process.env.ANTHROPIC_API_KEY||"",model:process.env.VOICE_LLM_MODEL||"claude-haiku-4-5",format:"anthropic"};case"lynkr":return{url:`${process.env.LYNKR_BASE_URL||"http://localhost:8081"}/v1/chat/completions`,apiKey:process.env.LYNKR_API_KEY||"",model:process.env.VOICE_LLM_MODEL||"gpt-oss:20b",format:"openai"};default:return{url:"https://api.openai.com/v1/chat/completions",apiKey:process.env.OPENAI_API_KEY||"",model:process.env.VOICE_LLM_MODEL||"gpt-4o-mini",format:"openai"}}}();if(!d.apiKey)return console.error(`[Discovery] No API key for provider: ${process.env.VOICE_LLM_PROVIDER||"openai"}`),f.NextResponse.json({error:"LLM provider API key not configured"},{status:500});let p=await fetch(d.url,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d.apiKey}`},body:JSON.stringify({...a,model:d.model,messages:h,stream:o})});if(!p.ok){let e=await p.text();return console.error(`[Discovery] Provider error (${p.status}): ${e.slice(0,200)}`),f.NextResponse.json({error:"LLM provider returned an error",status:p.status},{status:502})}let y=[process.env.NEXT_PUBLIC_APP_URL||"https://openclaw.io","https://api.openclaw.io"],m=t.headers.get("origin"),g=m&&y.includes(m)?m:y[0];if(o&&p.body)return new Response(p.body,{headers:{"Content-Type":"text/event-stream","Cache-Control":"no-cache",Connection:"keep-alive","Access-Control-Allow-Origin":g}});let v=await p.json(),w=v.choices?.[0]?.message?.content;return w&&await b(i._id,"assistant",w,s),f.NextResponse.json(v,{headers:{"Access-Control-Allow-Origin":g}})}catch(e){return console.error("[Discovery] Request failed:",e),f.NextResponse.json({error:"Internal server error"},{status:500})}}async function I(e){let t=[process.env.NEXT_PUBLIC_APP_URL||"https://openclaw.io","https://api.openclaw.io"],o=e.headers.get("origin");return new Response(null,{headers:{"Access-Control-Allow-Origin":o&&t.includes(o)?o:t[0],"Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization"}})}async function _(){return f.NextResponse.json({status:"ok",service:"discovery-voice",description:"8gent Discovery Call Voice API",usage:"Configure deepclaw to use /api/voice/discovery for discovery calls"})}e.s(["GET",()=>_,"OPTIONS",()=>I,"POST",()=>A],955814);var T=e.i(955814);let k=new t.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/voice/discovery/v1/chat/completions/route",pathname:"/api/voice/discovery/v1/chat/completions",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/voice/discovery/v1/chat/completions/route.ts",nextConfigOutput:"",userland:T}),{workAsyncStorage:P,workUnitAsyncStorage:x,serverHooks:N}=k;function O(){return(0,r.patchFetch)({workAsyncStorage:P,workUnitAsyncStorage:x})}async function S(e,t,r){k.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let f="/api/voice/discovery/v1/chat/completions/route";f=f.replace(/\/index$/,"")||"/";let w=await k.prepare(e,t,{srcPage:f,multiZoneDraftMode:!1});if(!w)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:R,params:C,nextConfig:E,parsedUrl:b,isDraftMode:A,prerenderManifest:I,routerServerContext:_,isOnDemandRevalidate:T,revalidateOnlyGenerated:P,resolvedPathname:x,clientReferenceManifest:N,serverActionsManifest:O}=w,S=(0,i.normalizeAppPath)(f),L=!!(I.dynamicRoutes[S]||I.routes[x]),U=async()=>((null==_?void 0:_.render404)?await _.render404(e,t,b,!1):t.end("This page could not be found"),null);if(L&&!A){let e=!!I.routes[x],t=I.dynamicRoutes[S];if(t&&!1===t.fallback&&!e){if(E.experimental.adapterPath)return await U();throw new g.NoFallbackError}}let D=null;!L||k.isDev||A||(D="/index"===(D=x)?"/":D);let M=!0===k.isDev||!L,W=L&&!M;O&&N&&(0,s.setManifestsSingleton)({page:f,clientReferenceManifest:N,serverActionsManifest:O});let H=e.method||"GET",j=(0,a.getTracer)(),q=j.getActiveScopeSpan(),$={params:C,prerenderManifest:I,renderOpts:{experimental:{authInterrupts:!!E.experimental.authInterrupts},cacheComponents:!!E.cacheComponents,supportsDynamicResponse:M,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:E.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,o,r,n)=>k.onRequestError(e,t,r,n,_)},sharedContext:{buildId:R}},K=new l.NodeNextRequest(e),B=new l.NodeNextResponse(t),V=u.NextRequestAdapter.fromNodeNextRequest(K,(0,u.signalFromNodeResponse)(t));try{let s=async e=>k.handle(V,$).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let o=j.getRootSpanAttributes();if(!o)return;if(o.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${o.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=o.get("next.route");if(r){let t=`${H} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${H} ${f}`)}),i=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var a,l;let u=async({previousCacheEntry:o})=>{try{if(!i&&T&&P&&!o)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await s(n);e.fetchMetrics=$.renderOpts.fetchMetrics;let l=$.renderOpts.pendingWaitUntil;l&&r.waitUntil&&(r.waitUntil(l),l=void 0);let u=$.renderOpts.collectedTags;if(!L)return await (0,d.sendResponse)(K,B,a,$.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(a.headers);u&&(t[m.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let o=void 0!==$.renderOpts.collectedRevalidate&&!($.renderOpts.collectedRevalidate>=m.INFINITE_CACHE)&&$.renderOpts.collectedRevalidate,r=void 0===$.renderOpts.collectedExpire||$.renderOpts.collectedExpire>=m.INFINITE_CACHE?void 0:$.renderOpts.collectedExpire;return{value:{kind:v.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:o,expire:r}}}}catch(t){throw(null==o?void 0:o.isStale)&&await k.onRequestError(e,t,{routerKind:"App Router",routePath:f,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:W,isOnDemandRevalidate:T})},!1,_),t}},c=await k.handleResponse({req:e,nextConfig:E,cacheKey:D,routeKind:o.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:I,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:P,responseGenerator:u,waitUntil:r.waitUntil,isMinimalMode:i});if(!L)return null;if((null==c||null==(a=c.value)?void 0:a.kind)!==v.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(l=c.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",T?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let g=(0,p.fromNodeOutgoingHttpHeaders)(c.value.headers);return i&&L||g.delete(m.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||g.get("Cache-Control")||g.set("Cache-Control",(0,y.getCacheControlHeader)(c.cacheControl)),await (0,d.sendResponse)(K,B,new Response(c.value.body,{headers:g,status:c.value.status||200})),null};q?await l(q):await j.withPropagatedContext(e.headers,()=>j.trace(c.BaseServerSpan.handleRequest,{spanName:`${H} ${f}`,kind:a.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},l))}catch(t){if(t instanceof g.NoFallbackError||await k.onRequestError(e,t,{routerKind:"App Router",routePath:S,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:W,isOnDemandRevalidate:T})},!1,_),L)throw t;return await (0,d.sendResponse)(K,B,new Response(null,{status:500})),null}}e.s(["handler",()=>S,"patchFetch",()=>O,"routeModule",()=>k,"serverHooks",()=>N,"workAsyncStorage",()=>P,"workUnitAsyncStorage",()=>x],739787)}];

//# sourceMappingURL=5d253_next_dist_esm_build_templates_app-route_7414ffd0.js.map