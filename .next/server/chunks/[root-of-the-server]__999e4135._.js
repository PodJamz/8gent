module.exports=[918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},666680,(e,t,r)=>{t.exports=e.x("node:crypto",()=>require("node:crypto"))},791424,e=>{"use strict";var t=e.i(457375),r=e.i(174015),n=e.i(116384),o=e.i(63831),a=e.i(868001),i=e.i(842780),s=e.i(763077),l=e.i(502964),d=e.i(993216),p=e.i(783900),u=e.i(295731),c=e.i(726839),g=e.i(775778),m=e.i(40992),x=e.i(432128),f=e.i(193695);e.i(44807);var h=e.i(989978),b=e.i(39334),y=e.i(872403);function v(e){let t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"};return e.replace(/[&<>"']/g,e=>t[e]||e)}let R=null,w=process.env.CALENDAR_HOST_EMAIL||"james@podjamz.com";function E(e,t){let r=new Date(e);return{date:r.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",timeZone:t}),time:r.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZoneName:"short",timeZone:t})}}async function k(e){try{let t=await e.json();if(!t.guestEmail||!t.guestName||!t.eventTitle||!t.startTime)return b.NextResponse.json({error:"Missing required booking fields"},{status:400});let r=(!R&&process.env.RESEND_API_KEY&&(R=new y.Resend(process.env.RESEND_API_KEY)),R);if(!r)return b.NextResponse.json({success:!1,error:"Email service not configured"});let n={errors:[]};try{await r.emails.send({from:"OpenClaw-OS Calendar <calendar@openclaw.io>",to:t.guestEmail,subject:`Confirmed: ${t.eventTitle}`,html:function(e){let{date:t,time:r}=E(e.startTime,e.timezone),n=function(e,t){switch(e){case"google_meet":return t?`<a href="${t}" style="color: #f59e0b;">Join Google Meet</a>`:"Google Meet (link will be shared)";case"zoom":return t?`<a href="${t}" style="color: #f59e0b;">Join Zoom</a>`:"Zoom (link will be shared)";case"phone":return t||"Phone call (number will be shared)";case"in_person":return t||"In person (address will be shared)";default:return t||"Details will be shared"}}(e.locationType,e.location),o=v(e.eventTitle),a=e.notes?v(e.notes):"",i=v(e.hostName||"the host");return`
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #374151;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 24px; border-radius: 12px 12px 0 0; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Booking Confirmed!</h1>
        <p style="margin: 8px 0 0 0; opacity: 0.9;">Your meeting has been scheduled</p>
      </div>

      <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
        <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px;">${o}</h2>

        <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${t}</p>
          <p style="margin: 0 0 8px 0;"><strong>Time:</strong> ${r}</p>
          <p style="margin: 0;"><strong>Location:</strong> ${n}</p>
        </div>

        ${a?`
        <div style="background: #fffbeb; padding: 12px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 16px;">
          <p style="margin: 0; font-size: 14px;"><strong>Your notes:</strong></p>
          <p style="margin: 8px 0 0 0; color: #6b7280;">${a}</p>
        </div>
        `:""}

        <p style="color: #6b7280; font-size: 14px; margin: 16px 0 0 0;">
          Need to make changes? Reply to this email or contact ${i} directly.
        </p>
      </div>

      <div style="background: #f9fafb; padding: 16px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; text-align: center;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          Sent from OpenClaw-OS Calendar
        </p>
      </div>
    </div>
  `}(t)}),n.guest=!0}catch(e){console.error("Failed to send guest email:",e),n.errors.push("Failed to send guest confirmation")}try{await r.emails.send({from:"OpenClaw-OS Calendar <calendar@openclaw.io>",to:w,subject:`New Booking: ${t.guestName} - ${t.eventTitle}`,html:function(e){let{date:t,time:r}=E(e.startTime,e.timezone),n=v(e.eventTitle),o=v(e.guestName),a=v(e.guestEmail),i=e.notes?v(e.notes):"";return`
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #374151;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 24px; border-radius: 12px 12px 0 0; color: white;">
        <h2 style="margin: 0; font-size: 20px;">New Booking!</h2>
        <p style="margin: 8px 0 0 0; opacity: 0.9;">Someone just booked a meeting with you</p>
      </div>

      <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
        <h3 style="margin: 0 0 16px 0; color: #1f2937;">${n}</h3>

        <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <p style="margin: 0 0 8px 0;"><strong>Guest:</strong> ${o}</p>
          <p style="margin: 0 0 8px 0;"><strong>Email:</strong> <a href="mailto:${a}" style="color: #059669;">${a}</a></p>
          <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${t}</p>
          <p style="margin: 0;"><strong>Time:</strong> ${r}</p>
        </div>

        ${i?`
        <div style="background: #fefce8; padding: 12px; border-radius: 8px; border-left: 4px solid #eab308;">
          <p style="margin: 0; font-size: 14px;"><strong>Guest notes:</strong></p>
          <p style="margin: 8px 0 0 0; color: #6b7280;">${i}</p>
        </div>
        `:""}
      </div>

      <div style="background: #f9fafb; padding: 16px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; text-align: center;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          OpenClaw-OS Calendar Notification
        </p>
      </div>
    </div>
  `}(t)}),n.host=!0}catch(e){console.error("Failed to send host email:",e),n.errors.push("Failed to send host notification")}return b.NextResponse.json({success:n.guest||n.host,...n})}catch(e){return console.error("Booking confirmation error:",e),b.NextResponse.json({error:"Failed to process booking confirmation"},{status:500})}}e.s(["POST",()=>k],817383);var C=e.i(817383);let N=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/bookings/confirm/route",pathname:"/api/bookings/confirm",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/bookings/confirm/route.ts",nextConfigOutput:"",userland:C}),{workAsyncStorage:T,workUnitAsyncStorage:S,serverHooks:A}=N;function O(){return(0,n.patchFetch)({workAsyncStorage:T,workUnitAsyncStorage:S})}async function $(e,t,n){N.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let b="/api/bookings/confirm/route";b=b.replace(/\/index$/,"")||"/";let y=await N.prepare(e,t,{srcPage:b,multiZoneDraftMode:!1});if(!y)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:v,params:R,nextConfig:w,parsedUrl:E,isDraftMode:k,prerenderManifest:C,routerServerContext:T,isOnDemandRevalidate:S,revalidateOnlyGenerated:A,resolvedPathname:O,clientReferenceManifest:$,serverActionsManifest:_}=y,j=(0,s.normalizeAppPath)(b),P=!!(C.dynamicRoutes[j]||C.routes[O]),q=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,E,!1):t.end("This page could not be found"),null);if(P&&!k){let e=!!C.routes[O],t=C.dynamicRoutes[j];if(t&&!1===t.fallback&&!e){if(w.experimental.adapterPath)return await q();throw new f.NoFallbackError}}let D=null;!P||N.isDev||k||(D="/index"===(D=O)?"/":D);let I=!0===N.isDev||!P,U=P&&!I;_&&$&&(0,i.setManifestsSingleton)({page:b,clientReferenceManifest:$,serverActionsManifest:_});let H=e.method||"GET",M=(0,a.getTracer)(),F=M.getActiveScopeSpan(),z={params:R,prerenderManifest:C,renderOpts:{experimental:{authInterrupts:!!w.experimental.authInterrupts},cacheComponents:!!w.cacheComponents,supportsDynamicResponse:I,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:w.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n,o)=>N.onRequestError(e,t,n,o,T)},sharedContext:{buildId:v}},B=new l.NodeNextRequest(e),K=new l.NodeNextResponse(t),L=d.NextRequestAdapter.fromNodeNextRequest(B,(0,d.signalFromNodeResponse)(t));try{let i=async e=>N.handle(L,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=M.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${H} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${H} ${b}`)}),s=!!(0,o.getRequestMeta)(e,"minimalMode"),l=async o=>{var a,l;let d=async({previousCacheEntry:r})=>{try{if(!s&&S&&A&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await i(o);e.fetchMetrics=z.renderOpts.fetchMetrics;let l=z.renderOpts.pendingWaitUntil;l&&n.waitUntil&&(n.waitUntil(l),l=void 0);let d=z.renderOpts.collectedTags;if(!P)return await (0,c.sendResponse)(B,K,a,z.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(a.headers);d&&(t[x.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=x.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,n=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=x.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:h.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==r?void 0:r.isStale)&&await N.onRequestError(e,t,{routerKind:"App Router",routePath:b,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:S})},!1,T),t}},p=await N.handleResponse({req:e,nextConfig:w,cacheKey:D,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:S,revalidateOnlyGenerated:A,responseGenerator:d,waitUntil:n.waitUntil,isMinimalMode:s});if(!P)return null;if((null==p||null==(a=p.value)?void 0:a.kind)!==h.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==p||null==(l=p.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",S?"REVALIDATED":p.isMiss?"MISS":p.isStale?"STALE":"HIT"),k&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let f=(0,g.fromNodeOutgoingHttpHeaders)(p.value.headers);return s&&P||f.delete(x.NEXT_CACHE_TAGS_HEADER),!p.cacheControl||t.getHeader("Cache-Control")||f.get("Cache-Control")||f.set("Cache-Control",(0,m.getCacheControlHeader)(p.cacheControl)),await (0,c.sendResponse)(B,K,new Response(p.value.body,{headers:f,status:p.value.status||200})),null};F?await l(F):await M.withPropagatedContext(e.headers,()=>M.trace(p.BaseServerSpan.handleRequest,{spanName:`${H} ${b}`,kind:a.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},l))}catch(t){if(t instanceof f.NoFallbackError||await N.onRequestError(e,t,{routerKind:"App Router",routePath:j,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:S})},!1,T),P)throw t;return await (0,c.sendResponse)(B,K,new Response(null,{status:500})),null}}e.s(["handler",()=>$,"patchFetch",()=>O,"routeModule",()=>N,"serverHooks",()=>A,"workAsyncStorage",()=>T,"workUnitAsyncStorage",()=>S],791424)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__999e4135._.js.map