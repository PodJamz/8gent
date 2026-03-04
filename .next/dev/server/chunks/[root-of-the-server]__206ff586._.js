module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/passcodeAuth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ADMIN_COOKIE",
    ()=>ADMIN_COOKIE,
    "AREA_COOKIE_PREFIX",
    ()=>AREA_COOKIE_PREFIX,
    "IPOD_COOKIE",
    ()=>IPOD_COOKIE,
    "createAdminSession",
    ()=>createAdminSession,
    "createAreaSession",
    ()=>createAreaSession,
    "createiPodSession",
    ()=>createiPodSession,
    "getAreaCookieName",
    ()=>getAreaCookieName,
    "hashPasscode",
    ()=>hashPasscode,
    "isValidPasscodeFormat",
    ()=>isValidPasscodeFormat,
    "signSession",
    ()=>signSession,
    "verifyPasscode",
    ()=>verifyPasscode,
    "verifySession",
    ()=>verifySession
]);
/**
 * Passcode Authentication System
 *
 * Handles 6-digit passcode verification for protected areas and iPod collaborators.
 * Uses HMAC-SHA256 for secure hashing and timing-safe comparison.
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
// SECURITY: Require PASSCODE_SECRET to be set - no default fallback
function getPasscodeSecret() {
    const secret = process.env.PASSCODE_SECRET;
    if (!secret) {
        throw new Error('PASSCODE_SECRET environment variable is required');
    }
    if (secret.length < 32) {
        throw new Error('PASSCODE_SECRET must be at least 32 characters long');
    }
    return secret;
}
// Lazy-initialize to allow env vars to be set before first use
let cachedSecret = null;
function getSecret() {
    if (!cachedSecret) {
        cachedSecret = getPasscodeSecret();
    }
    return cachedSecret;
}
const ADMIN_COOKIE = 'jamos_admin';
const AREA_COOKIE_PREFIX = 'jamos_area_';
const IPOD_COOKIE = 'jamos_ipod';
// Session duration (24 hours for admin, 7 days for areas/iPod)
const ADMIN_SESSION_DURATION = 24 * 60 * 60 * 1000;
const AREA_SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;
function hashPasscode(passcode) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHmac('sha256', getSecret()).update(passcode).digest('hex');
}
function verifyPasscode(passcode, hash) {
    const inputHash = hashPasscode(passcode);
    const inputBuffer = Buffer.from(inputHash);
    const hashBuffer = Buffer.from(hash);
    if (inputBuffer.length !== hashBuffer.length) {
        return false;
    }
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].timingSafeEqual(inputBuffer, hashBuffer);
}
function signSession(payload) {
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHmac('sha256', getSecret()).update(payloadB64).digest('base64url');
    return `${payloadB64}.${signature}`;
}
function verifySession(token) {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadB64, signature] = parts;
    // Verify signature
    const expectedSig = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHmac('sha256', getSecret()).update(payloadB64).digest('base64url');
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSig);
    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].timingSafeEqual(sigBuffer, expectedBuffer)) return null;
    // Decode payload
    try {
        const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
        // Check expiry
        if (Date.now() > payload.exp) return null;
        return payload;
    } catch  {
        return null;
    }
}
function createAdminSession(username) {
    return signSession({
        type: 'admin',
        subject: username,
        exp: Date.now() + ADMIN_SESSION_DURATION
    });
}
function createAreaSession(areaSlug) {
    return signSession({
        type: 'area',
        subject: areaSlug,
        exp: Date.now() + AREA_SESSION_DURATION
    });
}
function createiPodSession(collaboratorSlug) {
    return signSession({
        type: 'ipod',
        subject: collaboratorSlug,
        exp: Date.now() + AREA_SESSION_DURATION
    });
}
function getAreaCookieName(areaSlug) {
    return `${AREA_COOKIE_PREFIX}${areaSlug}`;
}
function isValidPasscodeFormat(passcode) {
    return /^\d{6}$/.test(passcode);
}
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[project]/src/lib/openclaw/client-impl.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OpenClawClientImpl",
    ()=>OpenClawClientImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/nanoid@5.1.6/node_modules/nanoid/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$isomorphic$2d$ws$40$5$2e$0$2e$0_ws$40$8$2e$19$2e$0$2f$node_modules$2f$isomorphic$2d$ws$2f$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/isomorphic-ws@5.0.0_ws@8.19.0/node_modules/isomorphic-ws/node.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
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
                this.ws = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$isomorphic$2d$ws$40$5$2e$0$2e$0_ws$40$8$2e$19$2e$0$2f$node_modules$2f$isomorphic$2d$ws$2f$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"](this.url, options);
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
                        } else if (__TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].isBuffer(rawData)) {
                            // console.log('[OpenClawClient] Buffer received, length:', rawData.length);
                            data = JSON.parse(rawData.toString());
                        } else if (rawData instanceof ArrayBuffer) {
                            // console.log('[OpenClawClient] ArrayBuffer received, byteLength:', rawData.byteLength);
                            const decoder = new TextDecoder();
                            data = JSON.parse(decoder.decode(rawData));
                        } else if (Array.isArray(rawData)) {
                            // Buffer[]
                            // console.log('[OpenClawClient] Buffer array received');
                            data = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].concat(rawData).toString());
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
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
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
        if (this.ws && this.ws.readyState === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$isomorphic$2d$ws$40$5$2e$0$2e$0_ws$40$8$2e$19$2e$0$2f$node_modules$2f$isomorphic$2d$ws$2f$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('[OpenClawClient] Cannot send, socket not open');
        }
    }
    async request(method, params = {}) {
        await this.connect();
        const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
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
"[project]/src/lib/openclaw/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2d$impl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/openclaw/client-impl.ts [app-route] (ecmascript)");
;
// Default to local gateway if not configured
const GATEWAY_URL = ("TURBOPACK compile-time value", "ws://localhost:18789") || 'ws://localhost:3000';
const GATEWAY_TOKEN = ("TURBOPACK compile-time value", "openclaw-admin-token") || 'openclaw-admin-token'; // Default for dev
class OpenClawClient {
    static instance;
    static getInstance() {
        if (!OpenClawClient.instance) {
            // Load from localStorage if possible
            let url = GATEWAY_URL;
            let token = GATEWAY_TOKEN;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            OpenClawClient.instance = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2d$impl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OpenClawClientImpl"]({
                url: url,
                authToken: token
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
"[project]/src/lib/security.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/openclaw/client.ts [app-route] (ecmascript)");
;
;
// Lazy-initialized Convex client for server-side logging
let _convexSecurityClient = null;
function getSecurityConvexClient() {
    if (_convexSecurityClient === null && process.env.NEXT_PUBLIC_CONVEX_URL) {
        _convexSecurityClient = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](process.env.NEXT_PUBLIC_CONVEX_URL);
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
        const logSecurityEventMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["makeFunctionReference"])("security:logSecurityEvent");
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
"[project]/src/app/api/auth/admin/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
/**
 * Admin Authentication API
 *
 * Handles master admin login with username/password.
 * Includes security event logging for all auth attempts.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$passcodeAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/passcodeAuth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/security.ts [app-route] (ecmascript)");
;
;
;
;
;
// SECURITY: Admin credentials from environment - no defaults allowed
function getAdminUsername() {
    const username = process.env.ADMIN_USERNAME;
    if (!username) {
        throw new Error('ADMIN_USERNAME environment variable is required');
    }
    return username;
}
function getAdminPasswordHash() {
    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) {
        throw new Error('ADMIN_PASSWORD_HASH environment variable is required');
    }
    return hash;
}
// Hash a password for comparison
function hashPassword(password) {
    const secret = process.env.PASSCODE_SECRET;
    if (!secret) {
        throw new Error('PASSCODE_SECRET environment variable is required');
    }
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash('sha256').update(password + secret).digest('hex');
}
// Timing-safe comparison
function safeCompare(a, b) {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].timingSafeEqual(bufA, bufB);
}
async function POST(request) {
    try {
        const { username, password } = await request.json();
        if (!username || !password) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Username and password required'
            }, {
                status: 400
            });
        }
        // Verify username
        if (username !== getAdminUsername()) {
            const ip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getClientIp"])(request);
            const isBruteForce = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["recordFailedAttempt"])(ip);
            // Log failed attempt
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logSecurityEvent"])({
                eventType: 'admin_login_failed',
                severity: isBruteForce ? 'critical' : 'warning',
                actorType: 'anonymous',
                message: isBruteForce ? `Brute force detected: Multiple failed admin login attempts from ${ip}` : `Failed admin login attempt: Invalid username "${username}"`,
                targetResource: '/api/auth/admin'
            }, request);
            if (isBruteForce) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logSecurityEvent"])({
                    eventType: 'brute_force_attempt',
                    severity: 'alert',
                    actorType: 'anonymous',
                    message: `Brute force attack detected: ${ip} exceeded failed login threshold`,
                    targetResource: '/api/auth/admin'
                }, request);
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid credentials'
            }, {
                status: 401
            });
        }
        // Verify password
        const inputHash = hashPassword(password);
        const expectedHash = getAdminPasswordHash();
        if (!safeCompare(inputHash, expectedHash)) {
            const ip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getClientIp"])(request);
            const isBruteForce = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["recordFailedAttempt"])(ip);
            // Log failed attempt
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logSecurityEvent"])({
                eventType: 'admin_login_failed',
                severity: isBruteForce ? 'critical' : 'warning',
                actorType: 'anonymous',
                message: isBruteForce ? `Brute force detected: Multiple failed admin login attempts from ${ip}` : 'Failed admin login attempt: Invalid password',
                targetResource: '/api/auth/admin'
            }, request);
            if (isBruteForce) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logSecurityEvent"])({
                    eventType: 'brute_force_attempt',
                    severity: 'alert',
                    actorType: 'anonymous',
                    message: `Brute force attack detected: ${ip} exceeded failed login threshold`,
                    targetResource: '/api/auth/admin'
                }, request);
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid credentials'
            }, {
                status: 401
            });
        }
        // Create session token
        const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$passcodeAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminSession"])(username);
        // Set cookie
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        cookieStore.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$passcodeAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ADMIN_COOKIE"], token, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24
        });
        // Clear failed attempts on successful login
        const ip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getClientIp"])(request);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clearFailedAttempts"])(ip);
        // Log successful login
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logSecurityEvent"])({
            eventType: 'admin_login_success',
            severity: 'info',
            actorType: 'admin',
            actorId: username,
            message: `Admin login successful: ${username}`,
            targetResource: '/api/auth/admin'
        }, request);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        console.error('Admin auth error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Authentication failed'
        }, {
            status: 500
        });
    }
}
async function GET() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        const token = cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$passcodeAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ADMIN_COOKIE"])?.value;
        const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$passcodeAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifySession"])(token);
        if (!session || session.type !== 'admin') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                isAuthenticated: false
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            isAuthenticated: true,
            username: session.subject
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            isAuthenticated: false
        });
    }
}
async function DELETE(request) {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        const token = cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$passcodeAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ADMIN_COOKIE"])?.value;
        const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$passcodeAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifySession"])(token);
        cookieStore.delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$passcodeAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ADMIN_COOKIE"]);
        // Log logout
        if (session) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logSecurityEvent"])({
                eventType: 'admin_logout',
                severity: 'info',
                actorType: 'admin',
                actorId: session.subject,
                message: `Admin logout: ${session.subject}`,
                targetResource: '/api/auth/admin'
            }, request);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__206ff586._.js.map