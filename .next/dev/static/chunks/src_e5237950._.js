(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/gallery-images.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Shared gallery images used across OpenClaw-OS
// Used by: Photos app, Desktop screensaver
__turbopack_context__.s([
    "GALLERY_IMAGES",
    ()=>GALLERY_IMAGES
]);
const GALLERY_IMAGES = [
    {
        src: 'https://2oczblkb3byymav8.public.blob.vercel-storage.com/FB394334-6F13-446C-8B43-57C993D05E01.png',
        alt: 'OpenClaw-OS Vision'
    },
    {
        src: 'https://2oczblkb3byymav8.public.blob.vercel-storage.com/0505D0AD-9EBF-4675-B3AC-ABF92501F024.png',
        alt: 'OpenClaw-OS Workspace'
    },
    {
        src: '/photos/aurora.jpeg',
        alt: 'Aurora'
    },
    {
        src: '/photos/Corballis.jpeg',
        alt: 'Corballis'
    },
    {
        src: '/photos/Donabatebeach.jpeg',
        alt: 'Donabate Beach'
    },
    {
        src: '/photos/Donabatebeach2.jpeg',
        alt: 'Donabate Beach'
    },
    {
        src: '/photos/Glenofthedowns.jpeg',
        alt: 'Glen of the Downs'
    },
    {
        src: '/photos/Mistysunrise.jpeg',
        alt: 'Misty Sunrise'
    },
    {
        src: '/photos/Nightsky.jpeg',
        alt: 'Night Sky'
    },
    {
        src: '/photos/Nightskytree.jpeg',
        alt: 'Night Sky Tree'
    },
    {
        src: '/photos/Portranedemense.jpeg',
        alt: 'Portrane Demesne'
    },
    {
        src: '/photos/Robin.jpeg',
        alt: 'Robin'
    },
    {
        src: '/photos/Skygrange.jpeg',
        alt: 'Sky Grange'
    },
    {
        src: '/photos/Sunriseoverhowth.jpeg',
        alt: 'Sunrise over Howth'
    },
    {
        src: '/photos/Sunriseportrane.jpeg',
        alt: 'Sunrise Portrane'
    },
    {
        src: '/photos/sunsetachill.jpeg',
        alt: 'Sunset Achill'
    },
    {
        src: '/photos/SunsetPortrane.jpeg',
        alt: 'Sunset Portrane'
    },
    {
        src: '/photos/SunsetSalvador.jpeg',
        alt: 'Sunset Salvador'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/tunnel-3d.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tunnel3D",
    ()=>Tunnel3D
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$8_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_three$40$0$2e$170$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-three+fiber@9.5.0_@types+react@19.2.8_react-dom@19.2.3_react@19.2.3__react@19.2.3_three@0.170.0/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$8_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_three$40$0$2e$170$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-three+fiber@9.5.0_@types+react@19.2.8_react-dom@19.2.3_react@19.2.3__react@19.2.3_three@0.170.0/node_modules/@react-three/fiber/dist/events-5a94e5eb.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$8_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_three$40$0$2e$170$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-three+fiber@9.5.0_@types+react@19.2.8_react-dom@19.2.3_react@19.2.3__react@19.2.3_three@0.170.0/node_modules/@react-three/fiber/dist/events-5a94e5eb.esm.js [app-client] (ecmascript) <export C as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$drei$40$10$2e$7$2e$7_$40$react$2d$three$2b$fiber$40$9$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$8_react$2d$dom$40$19$2e$2$2e$3_react$40$_otfyaga7ti6f5mvznauek6nyga$2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Texture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-three+drei@10.7.7_@react-three+fiber@9.5.0_@types+react@19.2.8_react-dom@19.2.3_react@_otfyaga7ti6f5mvznauek6nyga/node_modules/@react-three/drei/core/Texture.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$170$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/three@0.170.0/node_modules/three/build/three.module.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gallery$2d$images$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/gallery-images.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// Configuration
const TUNNEL_WIDTH = 20;
const TUNNEL_HEIGHT = 14;
const SEGMENT_DEPTH = 5;
const NUM_SEGMENTS = 12;
const FLOOR_COLS = 5;
const WALL_ROWS = 3;
const COL_WIDTH = TUNNEL_WIDTH / FLOOR_COLS;
const ROW_HEIGHT = TUNNEL_HEIGHT / WALL_ROWS;
// Pre-select a subset of images for the tunnel
const TUNNEL_IMAGES = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gallery$2d$images$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GALLERY_IMAGES"].filter((img)=>img.src.startsWith('/photos/') || img.src.includes('blob.vercel')).slice(0, 12);
function ImagePlane({ position, rotation, width, height, imageSrc }) {
    _s();
    const [opacity, setOpacity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const texture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$drei$40$10$2e$7$2e$7_$40$react$2d$three$2b$fiber$40$9$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$8_react$2d$dom$40$19$2e$2$2e$3_react$40$_otfyaga7ti6f5mvznauek6nyga$2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Texture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTexture"])(imageSrc);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ImagePlane.useEffect": ()=>{
            // Fade in
            const timeout = setTimeout({
                "ImagePlane.useEffect.timeout": ()=>setOpacity(0.75)
            }["ImagePlane.useEffect.timeout"], 100);
            return ({
                "ImagePlane.useEffect": ()=>clearTimeout(timeout)
            })["ImagePlane.useEffect"];
        }
    }["ImagePlane.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        position: position,
        rotation: rotation,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                args: [
                    width * 0.85,
                    height * 0.85
                ]
            }, void 0, false, {
                fileName: "[project]/src/components/ui/tunnel-3d.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                map: texture,
                transparent: true,
                opacity: opacity,
                side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$170$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
            }, void 0, false, {
                fileName: "[project]/src/components/ui/tunnel-3d.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/tunnel-3d.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(ImagePlane, "NS/7UcFz4el0TMXdGqorONoA/x0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$drei$40$10$2e$7$2e$7_$40$react$2d$three$2b$fiber$40$9$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$8_react$2d$dom$40$19$2e$2$2e$3_react$40$_otfyaga7ti6f5mvznauek6nyga$2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Texture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTexture"]
    ];
});
_c = ImagePlane;
function TunnelSegment({ zPosition, lineColor, seed }) {
    _s1();
    const w = TUNNEL_WIDTH / 2;
    const h = TUNNEL_HEIGHT / 2;
    const d = SEGMENT_DEPTH;
    // Create grid lines geometry
    const lineGeometry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TunnelSegment.useMemo[lineGeometry]": ()=>{
            const vertices = [];
            // Longitudinal lines (Z-axis)
            for(let i = 0; i <= FLOOR_COLS; i++){
                const x = -w + i * COL_WIDTH;
                // Floor
                vertices.push(x, -h, 0, x, -h, -d);
                // Ceiling
                vertices.push(x, h, 0, x, h, -d);
            }
            // Wall longitudinal lines
            for(let i = 1; i < WALL_ROWS; i++){
                const y = -h + i * ROW_HEIGHT;
                vertices.push(-w, y, 0, -w, y, -d);
                vertices.push(w, y, 0, w, y, -d);
            }
            // Ring at z=0
            vertices.push(-w, -h, 0, w, -h, 0);
            vertices.push(-w, h, 0, w, h, 0);
            vertices.push(-w, -h, 0, -w, h, 0);
            vertices.push(w, -h, 0, w, h, 0);
            const geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$170$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]();
            geometry.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$170$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](vertices, 3));
            return geometry;
        }
    }["TunnelSegment.useMemo[lineGeometry]"], [
        w,
        h,
        d
    ]);
    // Deterministic random based on seed
    const seededRandom = (index)=>{
        const x = Math.sin(seed * 9999 + index * 7919) * 10000;
        return x - Math.floor(x);
    };
    // Generate image placements
    const images = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TunnelSegment.useMemo[images]": ()=>{
            const result = [];
            let imageIndex = 0;
            // Floor images
            for(let i = 0; i < FLOOR_COLS; i++){
                if (seededRandom(i) > 0.7) {
                    result.push({
                        position: [
                            -w + i * COL_WIDTH + COL_WIDTH / 2,
                            -h + 0.01,
                            -d / 2
                        ],
                        rotation: [
                            -Math.PI / 2,
                            0,
                            0
                        ],
                        width: COL_WIDTH,
                        height: d,
                        imageSrc: TUNNEL_IMAGES[imageIndex % TUNNEL_IMAGES.length].src
                    });
                    imageIndex++;
                }
            }
            // Ceiling images (sparser)
            for(let i = 0; i < FLOOR_COLS; i++){
                if (seededRandom(i + 100) > 0.85) {
                    result.push({
                        position: [
                            -w + i * COL_WIDTH + COL_WIDTH / 2,
                            h - 0.01,
                            -d / 2
                        ],
                        rotation: [
                            Math.PI / 2,
                            0,
                            0
                        ],
                        width: COL_WIDTH,
                        height: d,
                        imageSrc: TUNNEL_IMAGES[imageIndex % TUNNEL_IMAGES.length].src
                    });
                    imageIndex++;
                }
            }
            // Left wall
            for(let i = 0; i < WALL_ROWS; i++){
                if (seededRandom(i + 200) > 0.7) {
                    result.push({
                        position: [
                            -w + 0.01,
                            -h + i * ROW_HEIGHT + ROW_HEIGHT / 2,
                            -d / 2
                        ],
                        rotation: [
                            0,
                            Math.PI / 2,
                            0
                        ],
                        width: d,
                        height: ROW_HEIGHT,
                        imageSrc: TUNNEL_IMAGES[imageIndex % TUNNEL_IMAGES.length].src
                    });
                    imageIndex++;
                }
            }
            // Right wall
            for(let i = 0; i < WALL_ROWS; i++){
                if (seededRandom(i + 300) > 0.7) {
                    result.push({
                        position: [
                            w - 0.01,
                            -h + i * ROW_HEIGHT + ROW_HEIGHT / 2,
                            -d / 2
                        ],
                        rotation: [
                            0,
                            -Math.PI / 2,
                            0
                        ],
                        width: d,
                        height: ROW_HEIGHT,
                        imageSrc: TUNNEL_IMAGES[imageIndex % TUNNEL_IMAGES.length].src
                    });
                    imageIndex++;
                }
            }
            return result;
        }
    }["TunnelSegment.useMemo[images]"], [
        seed,
        w,
        h,
        d
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            0,
            0,
            zPosition
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("lineSegments", {
                geometry: lineGeometry,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("lineBasicMaterial", {
                    color: lineColor,
                    transparent: true,
                    opacity: 0.3
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/tunnel-3d.tsx",
                    lineNumber: 171,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/tunnel-3d.tsx",
                lineNumber: 170,
                columnNumber: 7
            }, this),
            images.map((img, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ImagePlane, {
                    ...img
                }, `${zPosition}-${i}`, false, {
                    fileName: "[project]/src/components/ui/tunnel-3d.tsx",
                    lineNumber: 174,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/tunnel-3d.tsx",
        lineNumber: 169,
        columnNumber: 5
    }, this);
}
_s1(TunnelSegment, "fPeA92Wp9u2PNptFKbtWSEh5sks=");
_c1 = TunnelSegment;
function TunnelScene({ speed = 0.3, lineColor = '#64748b' }) {
    _s2();
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$8_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_three$40$0$2e$170$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    const segmentSeeds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    // Initialize seeds
    if (segmentSeeds.current.length === 0) {
        for(let i = 0; i < NUM_SEGMENTS; i++){
            segmentSeeds.current.push(Math.random() * 1000);
        }
    }
    const [segments, setSegments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "TunnelScene.useState": ()=>Array.from({
                length: NUM_SEGMENTS
            }, {
                "TunnelScene.useState": (_, i)=>({
                        z: -i * SEGMENT_DEPTH,
                        seed: segmentSeeds.current[i]
                    })
            }["TunnelScene.useState"])
    }["TunnelScene.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$8_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_three$40$0$2e$170$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "TunnelScene.useFrame": (_, delta)=>{
            // Move camera forward slowly
            camera.position.z -= speed * delta;
            // Recycle segments
            setSegments({
                "TunnelScene.useFrame": (prev)=>{
                    const camZ = camera.position.z;
                    return prev.map({
                        "TunnelScene.useFrame": (seg)=>{
                            if (seg.z > camZ + SEGMENT_DEPTH) {
                                // Move to back
                                const minZ = Math.min(...prev.map({
                                    "TunnelScene.useFrame.minZ": (s)=>s.z
                                }["TunnelScene.useFrame.minZ"]));
                                return {
                                    z: minZ - SEGMENT_DEPTH,
                                    seed: Math.random() * 1000
                                };
                            }
                            return seg;
                        }
                    }["TunnelScene.useFrame"]);
                }
            }["TunnelScene.useFrame"]);
        }
    }["TunnelScene.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fog", {
                attach: "fog",
                args: [
                    '#0f172a',
                    5,
                    50
                ]
            }, void 0, false, {
                fileName: "[project]/src/components/ui/tunnel-3d.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, this),
            segments.map((seg, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TunnelSegment, {
                    zPosition: seg.z,
                    lineColor: lineColor,
                    seed: seg.seed
                }, i, false, {
                    fileName: "[project]/src/components/ui/tunnel-3d.tsx",
                    lineNumber: 225,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true);
}
_s2(TunnelScene, "IGyk5w3VKwTVX9mWFBCxxBkKf+U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$8_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_three$40$0$2e$170$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$8_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_three$40$0$2e$170$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c2 = TunnelScene;
function Tunnel3D({ className = '', speed = 0.3, lineColor = '#64748b', onReady }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `absolute inset-0 ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$8_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_three$40$0$2e$170$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
            camera: {
                position: [
                    0,
                    0,
                    0
                ],
                fov: 70,
                near: 0.1,
                far: 100
            },
            gl: {
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance'
            },
            style: {
                background: '#0f172a'
            },
            onCreated: ()=>{
                // Canvas is ready, signal to parent
                onReady?.();
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TunnelScene, {
                speed: speed,
                lineColor: lineColor
            }, void 0, false, {
                fileName: "[project]/src/components/ui/tunnel-3d.tsx",
                lineNumber: 264,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/tunnel-3d.tsx",
            lineNumber: 251,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/tunnel-3d.tsx",
        lineNumber: 250,
        columnNumber: 5
    }, this);
}
_c3 = Tunnel3D;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "ImagePlane");
__turbopack_context__.k.register(_c1, "TunnelSegment");
__turbopack_context__.k.register(_c2, "TunnelScene");
__turbopack_context__.k.register(_c3, "Tunnel3D");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/tunnel-3d.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/ui/tunnel-3d.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_e5237950._.js.map