module.exports=[918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},426647,e=>{"use strict";var t=e.i(457375),r=e.i(174015),n=e.i(116384),a=e.i(63831),s=e.i(868001),o=e.i(842780),i=e.i(763077),l=e.i(502964),d=e.i(993216),c=e.i(783900),p=e.i(295731),u=e.i(726839),h=e.i(775778),g=e.i(40992),x=e.i(432128),m=e.i(193695);e.i(44807);var f=e.i(989978),w=e.i(39334);let v=["localhost","127.0.0.1","0.0.0.0","internal","intranet"];function b(e,t,r){return`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .container {
      text-align: center;
      max-width: 400px;
    }
    .icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      background: rgba(239, 68, 68, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon svg {
      width: 40px;
      height: 40px;
      color: #ef4444;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
    }
    p {
      color: rgba(255,255,255,0.7);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    .url {
      background: rgba(255,255,255,0.1);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      word-break: break-all;
      margin-bottom: 1.5rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;
    }
    .btn:hover { background: #2563eb; }
    .btn svg { width: 16px; height: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h1>${e}</h1>
    <p>${t}</p>
    ${r?`<div class="url">${r}</div>`:""}
    ${r?`<a href="${r}" target="_blank" class="btn">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      Open in Browser
    </a>`:""}
  </div>
</body>
</html>`}async function y(e){let t,r=e.nextUrl.searchParams.get("url");if(!r)return new w.NextResponse(b("No URL Provided","Please enter a URL to browse."),{status:400,headers:{"Content-Type":"text/html"}});try{if(t=new URL(r),!["http:","https:"].includes(t.protocol))throw Error("Invalid protocol")}catch{return new w.NextResponse(b("Invalid URL","The URL you entered is not valid. Make sure it starts with http:// or https://",r),{status:400,headers:{"Content-Type":"text/html"}})}if(function(e){try{let t=new URL(e);return v.some(e=>t.hostname.includes(e)||t.hostname.startsWith("192.168.")||t.hostname.startsWith("10.")||t.hostname.startsWith("172."))}catch{return!0}}(r))return new w.NextResponse(b("Access Denied","Access to internal or private network addresses is not allowed for security reasons.",r),{status:403,headers:{"Content-Type":"text/html"}});try{let e=new AbortController,s=setTimeout(()=>e.abort(),1e4),o=await fetch(r,{headers:{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8","Accept-Language":"en-US,en;q=0.5","Accept-Encoding":"gzip, deflate, br",Connection:"keep-alive","Upgrade-Insecure-Requests":"1"},signal:e.signal,redirect:"follow"});if(clearTimeout(s),!o.ok)return new w.NextResponse(b(`Error ${o.status}`,`The server returned an error: ${o.statusText}. The page may not exist or may be temporarily unavailable.`,r),{status:o.status,headers:{"Content-Type":"text/html"}});let i=o.headers.get("content-type")||"";if(i.includes("text/html")){var n,a;let e,t,s=await o.text();return n=s,a=o.url||r,e=new URL(a).origin,/<base\s/i.test(n)||(n=n.replace(/<head([^>]*)>/i,`<head$1><base href="${e}/" target="_self">`)),n=(n=(n=(n=(n=n.replace(/href="\/\//g,'href="https://')).replace(/src="\/\//g,'src="https://')).replace(/(href|src|action|poster|data)="(\/[^/][^"]*)"/gi,(t,r,n)=>`${r}="${e}${n}"`)).replace(/srcset="([^"]+)"/gi,(t,r)=>{let n=r.split(",").map(t=>{let r=t.trim(),[n,a]=r.split(/\s+/);return n.startsWith("/")&&!n.startsWith("//")?`${e}${n}${a?" "+a:""}`:r}).join(", ");return`srcset="${n}"`})).replace(/<meta[^>]*http-equiv=["']content-security-policy["'][^>]*>/gi,""),t=`
    <script>
      document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && !link.href.startsWith('javascript:')) {
          e.preventDefault();
          window.parent.postMessage({ type: 'navigate', url: link.href }, '*');
        }
      }, true);
    </script>
  `,n.includes("</body>")?n=n.replace("</body>",`${t}</body>`):n+=t,s=n,new w.NextResponse(s,{status:200,headers:{"Content-Type":"text/html; charset=utf-8","X-Frame-Options":"SAMEORIGIN","Content-Security-Policy":"frame-ancestors 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' *; img-src * data: blob:; font-src * data:; connect-src *;","Cache-Control":"no-store"}})}if(i.startsWith("image/")){let e=await o.arrayBuffer();return new w.NextResponse(e,{status:200,headers:{"Content-Type":i,"Cache-Control":"public, max-age=3600"}})}if(i.includes("text/css")){let e=await o.text(),r=t.origin;return e=e.replace(/url\(\s*['"]?(\/[^'")]+)['"]?\s*\)/gi,(e,t)=>`url(${r}${t})`),new w.NextResponse(e,{status:200,headers:{"Content-Type":"text/css","Cache-Control":"public, max-age=3600"}})}if(i.includes("javascript")){let e=await o.text();return new w.NextResponse(e,{status:200,headers:{"Content-Type":i,"Cache-Control":"public, max-age=3600"}})}let l=await o.arrayBuffer();return new w.NextResponse(l,{status:200,headers:{"Content-Type":i}})}catch(e){if(e instanceof Error){if("AbortError"===e.name)return new w.NextResponse(b("Request Timed Out","The page took too long to respond. Please try again or check if the site is available.",r),{status:504,headers:{"Content-Type":"text/html"}});return new w.NextResponse(b("Connection Failed",`Unable to connect to the server: ${e.message}`,r),{status:500,headers:{"Content-Type":"text/html"}})}return new w.NextResponse(b("Something Went Wrong","An unexpected error occurred while loading this page.",r),{status:500,headers:{"Content-Type":"text/html"}})}}e.s(["GET",()=>y],694895);var R=e.i(694895);let C=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/browser/proxy/route",pathname:"/api/browser/proxy",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/browser/proxy/route.ts",nextConfigOutput:"",userland:R}),{workAsyncStorage:k,workUnitAsyncStorage:E,serverHooks:T}=C;function A(){return(0,n.patchFetch)({workAsyncStorage:k,workUnitAsyncStorage:E})}async function N(e,t,n){C.isDev&&(0,a.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let w="/api/browser/proxy/route";w=w.replace(/\/index$/,"")||"/";let v=await C.prepare(e,t,{srcPage:w,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:b,params:y,nextConfig:R,parsedUrl:k,isDraftMode:E,prerenderManifest:T,routerServerContext:A,isOnDemandRevalidate:N,revalidateOnlyGenerated:$,resolvedPathname:P,clientReferenceManifest:U,serverActionsManifest:O}=v,S=(0,i.normalizeAppPath)(w),q=!!(T.dynamicRoutes[S]||T.routes[P]),j=async()=>((null==A?void 0:A.render404)?await A.render404(e,t,k,!1):t.end("This page could not be found"),null);if(q&&!E){let e=!!T.routes[P],t=T.dynamicRoutes[S];if(t&&!1===t.fallback&&!e){if(R.experimental.adapterPath)return await j();throw new m.NoFallbackError}}let _=null;!q||C.isDev||E||(_="/index"===(_=P)?"/":_);let M=!0===C.isDev||!q,I=q&&!M;O&&U&&(0,o.setManifestsSingleton)({page:w,clientReferenceManifest:U,serverActionsManifest:O});let H=e.method||"GET",L=(0,s.getTracer)(),D=L.getActiveScopeSpan(),W={params:y,prerenderManifest:T,renderOpts:{experimental:{authInterrupts:!!R.experimental.authInterrupts},cacheComponents:!!R.cacheComponents,supportsDynamicResponse:M,incrementalCache:(0,a.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:R.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n,a)=>C.onRequestError(e,t,n,a,A)},sharedContext:{buildId:b}},B=new l.NodeNextRequest(e),F=new l.NodeNextResponse(t),K=d.NextRequestAdapter.fromNodeNextRequest(B,(0,d.signalFromNodeResponse)(t));try{let o=async e=>C.handle(K,W).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=L.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${H} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${H} ${w}`)}),i=!!(0,a.getRequestMeta)(e,"minimalMode"),l=async a=>{var s,l;let d=async({previousCacheEntry:r})=>{try{if(!i&&N&&$&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await o(a);e.fetchMetrics=W.renderOpts.fetchMetrics;let l=W.renderOpts.pendingWaitUntil;l&&n.waitUntil&&(n.waitUntil(l),l=void 0);let d=W.renderOpts.collectedTags;if(!q)return await (0,u.sendResponse)(B,F,s,W.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(s.headers);d&&(t[x.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==W.renderOpts.collectedRevalidate&&!(W.renderOpts.collectedRevalidate>=x.INFINITE_CACHE)&&W.renderOpts.collectedRevalidate,n=void 0===W.renderOpts.collectedExpire||W.renderOpts.collectedExpire>=x.INFINITE_CACHE?void 0:W.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==r?void 0:r.isStale)&&await C.onRequestError(e,t,{routerKind:"App Router",routePath:w,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:I,isOnDemandRevalidate:N})},!1,A),t}},c=await C.handleResponse({req:e,nextConfig:R,cacheKey:_,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:T,isRoutePPREnabled:!1,isOnDemandRevalidate:N,revalidateOnlyGenerated:$,responseGenerator:d,waitUntil:n.waitUntil,isMinimalMode:i});if(!q)return null;if((null==c||null==(s=c.value)?void 0:s.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(l=c.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",N?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),E&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,h.fromNodeOutgoingHttpHeaders)(c.value.headers);return i&&q||m.delete(x.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,g.getCacheControlHeader)(c.cacheControl)),await (0,u.sendResponse)(B,F,new Response(c.value.body,{headers:m,status:c.value.status||200})),null};D?await l(D):await L.withPropagatedContext(e.headers,()=>L.trace(c.BaseServerSpan.handleRequest,{spanName:`${H} ${w}`,kind:s.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},l))}catch(t){if(t instanceof m.NoFallbackError||await C.onRequestError(e,t,{routerKind:"App Router",routePath:S,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:I,isOnDemandRevalidate:N})},!1,A),q)throw t;return await (0,u.sendResponse)(B,F,new Response(null,{status:500})),null}}e.s(["handler",()=>N,"patchFetch",()=>A,"routeModule",()=>C,"serverHooks",()=>T,"workAsyncStorage",()=>k,"workUnitAsyncStorage",()=>E],426647)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__16f560f7._.js.map