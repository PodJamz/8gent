(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__4ef7c237._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/lib/openclaw/client-impl.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OpenClawClientImpl",
    ()=>OpenClawClientImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/nanoid@5.1.6/node_modules/nanoid/index.browser.js [app-edge-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$isomorphic$2d$ws$40$5$2e$0$2e$0_ws$40$8$2e$19$2e$0$2f$node_modules$2f$isomorphic$2d$ws$2f$browser$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/isomorphic-ws@5.0.0_ws@8.19.0/node_modules/isomorphic-ws/browser.js [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:buffer [external] (node:buffer, cjs)");
;
;
;
// Protocol constants based on OpenClaw source
const PROTOCOL_VERSION = 3;
class OpenClawClientImpl {
    ws = null;
    url;
    authToken;
    pendingRequests = new Map();
    eventListeners = new Map();
    isConnected = false;
    connectPromise = null;
    constructor(config){
        this.url = config.url;
        this.authToken = config.authToken;
    }
    async connect() {
        if (this.isConnected) return;
        if (this.connectPromise) return this.connectPromise;
        this.connectPromise = new Promise((resolve, reject)=>{
            try {
                // Set origin to satisfy gateway check for Control UI
                const options = {
                    headers: {
                        Origin: 'http://localhost:18789'
                    }
                };
                this.ws = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$isomorphic$2d$ws$40$5$2e$0$2e$0_ws$40$8$2e$19$2e$0$2f$node_modules$2f$isomorphic$2d$ws$2f$browser$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["default"](this.url, options);
                this.ws.onopen = ()=>{
                    console.log('[OpenClawClient] WebSocket connected');
                };
                this.ws.onmessage = (event)=>{
                    try {
                        let data;
                        const rawData = event.data;
                        // console.log('[OpenClawClient] Raw message type:', typeof rawData);
                        if (typeof rawData === 'string') {
                            data = JSON.parse(rawData);
                        } else if (__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].isBuffer(rawData)) {
                            // console.log('[OpenClawClient] Buffer received, length:', rawData.length);
                            data = JSON.parse(rawData.toString());
                        } else if (rawData instanceof ArrayBuffer) {
                            // console.log('[OpenClawClient] ArrayBuffer received, byteLength:', rawData.byteLength);
                            const decoder = new TextDecoder();
                            data = JSON.parse(decoder.decode(rawData));
                        } else if (Array.isArray(rawData)) {
                            // Buffer[]
                            // console.log('[OpenClawClient] Buffer array received');
                            data = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].concat(rawData).toString());
                        } else {
                            // unknown
                            console.warn('[OpenClawClient] Unknown message type:', typeof rawData);
                            return;
                        }
                        // console.log('[OpenClawClient] Parsed message:', data?.type, data?.event || data?.method);
                        this.handleMessage(data, resolve, reject);
                    } catch (err) {
                        console.error('[OpenClawClient] Failed to parse message:', err);
                    }
                };
                this.ws.onerror = (error)=>{
                    console.error('[OpenClawClient] WebSocket error:', error);
                    if (!this.isConnected) reject(error);
                };
                this.ws.onclose = ()=>{
                    console.log('[OpenClawClient] WebSocket closed');
                    this.isConnected = false;
                    this.connectPromise = null;
                };
            } catch (err) {
                reject(err);
            }
        });
        return this.connectPromise;
    }
    handleMessage(message, connectResolve, connectReject) {
        // console.log('[OpenClawClient] Received:', message);
        if (message.type === 'event' && message.event === 'connect.challenge') {
            this.handleChallenge(message.payload, connectResolve, connectReject);
            return;
        }
        if (message.type === 'res') {
            const pending = this.pendingRequests.get(message.id);
            if (pending) {
                if (message.ok) {
                    pending.resolve(message.body || message.payload); // Adapting to potential response format
                } else {
                    pending.reject(new Error(message.error?.message || 'Unknown error'));
                }
                this.pendingRequests.delete(message.id);
            }
            return;
        }
        if (message.type === 'event') {
            const listeners = this.eventListeners.get(message.event);
            if (listeners) {
                listeners.forEach((handler)=>handler(message.payload));
            }
        }
    }
    handleChallenge(payload, resolve, reject) {
        const connectReq = {
            type: 'req',
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            method: 'connect',
            params: {
                minProtocol: PROTOCOL_VERSION,
                maxProtocol: PROTOCOL_VERSION,
                role: 'operator',
                client: {
                    id: 'webchat',
                    displayName: 'OpenClaw OS',
                    version: '0.1.0',
                    platform: 'web',
                    mode: 'ui',
                    deviceFamily: 'browser'
                },
                auth: {
                    token: this.authToken
                }
            }
        };
        if (this.ws) {
            this.send(connectReq);
            // We assume connection is successful if we don't get an immediate error? 
            // Or should we wait for a response? The protocol usually sends a generic 'res' for the connect req.
            // Register a temporary handler for the connect response
            this.pendingRequests.set(connectReq.id, {
                resolve: ()=>{
                    this.isConnected = true;
                    resolve();
                },
                reject: (err)=>{
                    this.isConnected = false;
                    reject(err);
                }
            });
        }
    }
    send(message) {
        if (this.ws && this.ws.readyState === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$isomorphic$2d$ws$40$5$2e$0$2e$0_ws$40$8$2e$19$2e$0$2f$node_modules$2f$isomorphic$2d$ws$2f$browser$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["default"].OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('[OpenClawClient] Cannot send, socket not open');
        }
    }
    async request(method, params = {}) {
        await this.connect();
        const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
        return new Promise((resolve, reject)=>{
            this.pendingRequests.set(id, {
                resolve,
                reject
            });
            this.send({
                type: 'req',
                id,
                method,
                params
            });
        // specific logic for timeout could be added here
        });
    }
    subscribe(event, handler) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(handler);
        return ()=>{
            this.eventListeners.get(event)?.delete(handler);
        };
    }
}
}),
"[project]/src/lib/openclaw/client.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConvexHttpClient",
    ()=>ConvexHttpClient,
    "ConvexProvider",
    ()=>ConvexProvider,
    "ConvexProviderWithClerk",
    ()=>ConvexProviderWithClerk,
    "ConvexReactClient",
    ()=>ConvexReactClient,
    "makeFunctionReference",
    ()=>makeFunctionReference,
    "openClaw",
    ()=>openClaw,
    "useOpenClaw",
    ()=>useOpenClaw
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2d$impl$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/openclaw/client-impl.ts [app-edge-route] (ecmascript)");
;
// Default to local gateway if not configured
const GATEWAY_URL = ("TURBOPACK compile-time value", "ws://localhost:18789") || 'ws://localhost:3000';
const GATEWAY_TOKEN = ("TURBOPACK compile-time value", "openclaw-admin-token") || 'openclaw-admin-token'; // Default for dev
class OpenClawClient {
    static instance;
    static getInstance() {
        if (!OpenClawClient.instance) {
            OpenClawClient.instance = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2d$impl$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["OpenClawClientImpl"]({
                url: GATEWAY_URL,
                authToken: GATEWAY_TOKEN
            });
        }
        return OpenClawClient.instance;
    }
}
const openClaw = OpenClawClient.getInstance();
const useOpenClaw = ()=>{
    return openClaw;
};
class ConvexHttpClient {
    url;
    constructor(url){
        this.url = url;
    }
    // Add methods as needed
    async query(name, args) {
        console.warn("ConvexHttpClient.query shim called", name, args);
        return null;
    }
    async mutation(name, args) {
        console.warn("ConvexHttpClient.mutation shim called", name, args);
        return null;
    }
    async action(name, args) {
        console.warn("ConvexHttpClient.action shim called", name, args);
        return null;
    }
}
function makeFunctionReference(name) {
    return name;
}
class ConvexReactClient {
    url;
    constructor(url){
        this.url = url;
    }
}
const ConvexProvider = ({ client, children })=>children;
const ConvexProviderWithClerk = ({ client, children })=>children;
}),
"[project]/src/lib/security.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkRateLimit",
    ()=>checkRateLimit,
    "clearFailedAttempts",
    ()=>clearFailedAttempts,
    "generateFingerprint",
    ()=>generateFingerprint,
    "getClientIp",
    ()=>getClientIp,
    "logSecurityEvent",
    ()=>logSecurityEvent,
    "lookupGeo",
    ()=>lookupGeo,
    "parseUserAgent",
    ()=>parseUserAgent,
    "recordFailedAttempt",
    ()=>recordFailedAttempt
]);
/**
 * Security Monitoring Library
 *
 * Client-side utilities for security event logging and device fingerprinting.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/openclaw/client.ts [app-edge-route] (ecmascript)");
;
;
// Lazy-initialized Convex client for server-side logging
let _convexSecurityClient = null;
function getSecurityConvexClient() {
    if (_convexSecurityClient === null && process.env.NEXT_PUBLIC_CONVEX_URL) {
        _convexSecurityClient = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](process.env.NEXT_PUBLIC_CONVEX_URL);
    }
    return _convexSecurityClient;
}
function parseUserAgent(ua) {
    const info = {};
    // Detect device type
    if (/bot|crawler|spider|crawling/i.test(ua)) {
        info.deviceType = "bot";
    } else if (/mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(ua)) {
        if (/ipad|tablet|playbook|silk/i.test(ua)) {
            info.deviceType = "tablet";
        } else {
            info.deviceType = "mobile";
        }
    } else {
        info.deviceType = "desktop";
    }
    // Detect browser
    if (/firefox/i.test(ua)) {
        info.browser = "Firefox";
    } else if (/edg/i.test(ua)) {
        info.browser = "Edge";
    } else if (/chrome|chromium|crios/i.test(ua)) {
        info.browser = "Chrome";
    } else if (/safari/i.test(ua)) {
        info.browser = "Safari";
    } else if (/opera|opr/i.test(ua)) {
        info.browser = "Opera";
    } else if (/msie|trident/i.test(ua)) {
        info.browser = "IE";
    } else {
        info.browser = "Unknown";
    }
    // Detect OS
    if (/windows/i.test(ua)) {
        info.os = "Windows";
    } else if (/macintosh|mac os x/i.test(ua)) {
        info.os = "macOS";
    } else if (/linux/i.test(ua)) {
        info.os = "Linux";
    } else if (/android/i.test(ua)) {
        info.os = "Android";
    } else if (/iphone|ipad|ipod/i.test(ua)) {
        info.os = "iOS";
    } else {
        info.os = "Unknown";
    }
    return info;
}
function generateFingerprint(ip, ua, acceptLanguage) {
    // Create a simple hash from available data
    const data = `${ip}|${ua}|${acceptLanguage || ""}`;
    let hash = 0;
    for(let i = 0; i < data.length; i++){
        const char = data.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, "0");
}
async function logSecurityEvent(payload, request, geoData) {
    try {
        const client = getSecurityConvexClient();
        if (!client) {
            console.warn("[Security] Convex client not available, logging to console only");
            console.log("[Security Event]", payload.eventType, payload.message);
            return;
        }
        const ip = getClientIp(request);
        const userAgent = request.headers.get("user-agent") || "unknown";
        const deviceInfo = parseUserAgent(userAgent);
        const fingerprint = generateFingerprint(ip, userAgent);
        // Use makeFunctionReference to avoid type generation dependency
        const logSecurityEventMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["makeFunctionReference"])("security:logSecurityEvent");
        await client.mutation(logSecurityEventMutation, {
            eventType: payload.eventType,
            severity: payload.severity,
            actorType: payload.actorType,
            actorId: payload.actorId,
            actorEmail: payload.actorEmail,
            message: payload.message,
            metadata: payload.metadata,
            targetResource: payload.targetResource,
            targetId: payload.targetId,
            ipAddress: ip,
            userAgent,
            fingerprint,
            deviceType: deviceInfo.deviceType,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            country: geoData?.country,
            region: geoData?.region,
            city: geoData?.city
        });
        console.log("[Security] Event logged:", payload.eventType, payload.severity);
    } catch (error) {
        // Log to console as fallback, never fail silently
        console.error("[Security] Failed to log event to Convex:", error);
        console.log("[Security Event Fallback]", payload.eventType, payload.message);
    }
}
function getClientIp(request) {
    // Try various headers in order of preference
    const headers = request.headers;
    // Vercel
    const vercelIp = headers.get("x-vercel-forwarded-for");
    if (vercelIp) {
        return vercelIp.split(",")[0].trim();
    }
    // Cloudflare
    const cfIp = headers.get("cf-connecting-ip");
    if (cfIp) {
        return cfIp;
    }
    // Standard proxy header
    const forwardedFor = headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }
    // Real IP header
    const realIp = headers.get("x-real-ip");
    if (realIp) {
        return realIp;
    }
    // Fallback
    return "unknown";
}
// =============================================================================
// Rate Limiting Helper
// =============================================================================
// In-memory rate limit tracker (use Redis in production)
const rateLimitMap = new Map();
function checkRateLimit(key, config) {
    const now = Date.now();
    const existing = rateLimitMap.get(key);
    if (!existing || existing.resetAt < now) {
        // New window
        const resetAt = now + config.windowMs;
        rateLimitMap.set(key, {
            count: 1,
            resetAt
        });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetAt
        };
    }
    if (existing.count >= config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: existing.resetAt
        };
    }
    existing.count++;
    return {
        allowed: true,
        remaining: config.maxRequests - existing.count,
        resetAt: existing.resetAt
    };
}
// Clean up old rate limit entries periodically
if (typeof setInterval !== "undefined") {
    setInterval(()=>{
        const now = Date.now();
        for (const [key, value] of rateLimitMap.entries()){
            if (value.resetAt < now) {
                rateLimitMap.delete(key);
            }
        }
    }, 60000); // Clean up every minute
}
// =============================================================================
// Brute Force Detection
// =============================================================================
// Track failed attempts per IP
const failedAttempts = new Map();
function recordFailedAttempt(ip, config = {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000
}) {
    const now = Date.now();
    const existing = failedAttempts.get(ip);
    if (!existing || now - existing.firstAttempt > config.windowMs) {
        // New window
        failedAttempts.set(ip, {
            count: 1,
            firstAttempt: now
        });
        return false;
    }
    existing.count++;
    return existing.count >= config.maxAttempts;
}
function clearFailedAttempts(ip) {
    failedAttempts.delete(ip);
}
// =============================================================================
// Geo Lookup (using ip-api.com - free for non-commercial)
// =============================================================================
const geoCache = new Map();
const GEO_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
async function lookupGeo(ip) {
    // Skip local/private IPs
    if (ip === "unknown" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.")) {
        return null;
    }
    // Check cache
    const cached = geoCache.get(ip);
    if (cached && Date.now() - cached.cachedAt < GEO_CACHE_TTL) {
        return cached.data;
    }
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city,lat,lon`, {
            signal: AbortSignal.timeout(2000)
        });
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        if (data.status === "fail") {
            return null;
        }
        const geoData = {
            country: data.country,
            region: data.regionName,
            city: data.city,
            latitude: data.lat,
            longitude: data.lon
        };
        // Cache the result
        geoCache.set(ip, {
            data: geoData,
            cachedAt: Date.now()
        });
        return geoData;
    } catch  {
        return null;
    }
}
}),
"[project]/src/app/api/tts/route.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/security.ts [app-edge-route] (ecmascript)");
;
const runtime = 'edge';
// Rate limit: 10 TTS requests per minute per IP
const RATE_LIMIT_CONFIG = {
    windowMs: 60 * 1000,
    maxRequests: 10
};
async function POST(request) {
    try {
        // SECURITY: Rate limiting to prevent API abuse
        const clientIp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getClientIp"])(request);
        const rateLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["checkRateLimit"])(`tts:${clientIp}`, RATE_LIMIT_CONFIG);
        if (!rateLimit.allowed) {
            return new Response(JSON.stringify({
                error: 'Rate limit exceeded. Please wait before making more requests.',
                retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
            }), {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000))
                }
            });
        }
        const body = await request.json();
        const { text, voice = 'nova', model = 'tts-1-hd', speed = 1.0 } = body;
        if (!text || typeof text !== 'string') {
            return new Response(JSON.stringify({
                error: 'Text is required'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        // Limit text length to prevent abuse (OpenAI limit is 4096 chars)
        if (text.length > 4096) {
            return new Response(JSON.stringify({
                error: 'Text too long (max 4096 characters)'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({
                error: 'OpenAI API key not configured'
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        // Call OpenAI TTS API
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                input: text,
                voice,
                speed,
                response_format: 'mp3'
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenAI TTS API error:', errorText);
            return new Response(JSON.stringify({
                error: 'Failed to generate speech'
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        // Stream the audio response
        const audioStream = response.body;
        if (!audioStream) {
            return new Response(JSON.stringify({
                error: 'No audio stream received'
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        // Return the audio stream with appropriate headers
        return new Response(audioStream, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'no-cache',
                'Transfer-Encoding': 'chunked'
            }
        });
    } catch (error) {
        console.error('TTS API error:', error);
        return new Response(JSON.stringify({
            error: 'Internal server error'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__4ef7c237._.js.map