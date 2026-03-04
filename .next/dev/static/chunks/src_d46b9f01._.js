(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/watch/watch-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Watch Utilities
 * Animation helpers and time calculations for watch faces
 */ // Get current time angles for watch hands
__turbopack_context__.s([
    "WATCH_SIZES",
    ()=>WATCH_SIZES,
    "easings",
    ()=>easings,
    "formatDateWindow",
    ()=>formatDateWindow,
    "generateTickMarks",
    ()=>generateTickMarks,
    "getHandDimensions",
    ()=>getHandDimensions,
    "getPositionOnCircle",
    ()=>getPositionOnCircle,
    "getTimeAngles",
    ()=>getTimeAngles,
    "hslToCSS",
    ()=>hslToCSS,
    "toRoman",
    ()=>toRoman
]);
function getTimeAngles(date = new Date()) {
    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    // Calculate smooth angles (continuous movement)
    const secondsWithMs = seconds + milliseconds / 1000;
    const minutesWithSeconds = minutes + secondsWithMs / 60;
    const hoursWithMinutes = hours + minutesWithSeconds / 60;
    return {
        hours: hoursWithMinutes * 30,
        minutes: minutesWithSeconds * 6,
        seconds: secondsWithMs * 6,
        milliseconds: milliseconds * 0.36
    };
}
function hslToCSS(hsl) {
    // If already a valid CSS color, return as-is
    if (hsl.startsWith('hsl') || hsl.startsWith('rgb') || hsl.startsWith('#')) {
        return hsl;
    }
    // Convert "h s% l%" format to "hsl(h, s%, l%)"
    const parts = hsl.split(' ');
    if (parts.length >= 3) {
        return `hsl(${parts[0]}, ${parts[1]}, ${parts[2]})`;
    }
    return hsl;
}
function toRoman(num) {
    const romanNumerals = [
        [
            12,
            'XII'
        ],
        [
            11,
            'XI'
        ],
        [
            10,
            'X'
        ],
        [
            9,
            'IX'
        ],
        [
            8,
            'VIII'
        ],
        [
            7,
            'VII'
        ],
        [
            6,
            'VI'
        ],
        [
            5,
            'V'
        ],
        [
            4,
            'IV'
        ],
        [
            3,
            'III'
        ],
        [
            2,
            'II'
        ],
        [
            1,
            'I'
        ]
    ];
    for (const [value, numeral] of romanNumerals){
        if (num === value) return numeral;
    }
    return String(num);
}
function getPositionOnCircle(angle, radius, centerX = 50, centerY = 50) {
    // Convert angle to radians, offset by -90° so 0° is at 12 o'clock
    const radians = (angle - 90) * Math.PI / 180;
    return {
        x: centerX + radius * Math.cos(radians),
        y: centerY + radius * Math.sin(radians)
    };
}
function generateTickMarks(count, majorEvery = 5) {
    const marks = [];
    for(let i = 0; i < count; i++){
        marks.push({
            angle: 360 / count * i,
            isMajor: i % majorEvery === 0
        });
    }
    return marks;
}
function formatDateWindow(date = new Date()) {
    return date.getDate().toString().padStart(2, '0');
}
const WATCH_SIZES = {
    xs: 80,
    sm: 120,
    md: 180,
    lg: 240,
    xl: 320,
    showcase: 400
};
const easings = {
    // Spring-like easing for hands
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    // Smooth deceleration
    easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
    // Linear for continuous rotation
    linear: 'linear'
};
function getHandDimensions(style, type) {
    const dimensions = {
        dauphine: {
            hour: {
                length: 28,
                width: 4,
                tailLength: 8
            },
            minute: {
                length: 38,
                width: 3,
                tailLength: 8
            },
            second: {
                length: 38,
                width: 1.5,
                tailLength: 12
            }
        },
        baton: {
            hour: {
                length: 26,
                width: 3.5,
                tailLength: 6
            },
            minute: {
                length: 38,
                width: 2.5,
                tailLength: 6
            },
            second: {
                length: 40,
                width: 1,
                tailLength: 14
            }
        },
        mercedes: {
            hour: {
                length: 26,
                width: 5,
                tailLength: 6
            },
            minute: {
                length: 38,
                width: 4,
                tailLength: 6
            },
            second: {
                length: 40,
                width: 1.5,
                tailLength: 14
            }
        },
        snowflake: {
            hour: {
                length: 26,
                width: 5,
                tailLength: 6
            },
            minute: {
                length: 38,
                width: 4,
                tailLength: 6
            },
            second: {
                length: 40,
                width: 1.5,
                tailLength: 14
            }
        },
        sword: {
            hour: {
                length: 28,
                width: 4,
                tailLength: 7
            },
            minute: {
                length: 40,
                width: 3,
                tailLength: 7
            },
            second: {
                length: 40,
                width: 1.2,
                tailLength: 14
            }
        },
        leaf: {
            hour: {
                length: 27,
                width: 5,
                tailLength: 7
            },
            minute: {
                length: 38,
                width: 4,
                tailLength: 7
            },
            second: {
                length: 38,
                width: 1.5,
                tailLength: 12
            }
        },
        alpha: {
            hour: {
                length: 26,
                width: 4.5,
                tailLength: 8
            },
            minute: {
                length: 38,
                width: 3.5,
                tailLength: 8
            },
            second: {
                length: 40,
                width: 1,
                tailLength: 14
            }
        }
    };
    return dimensions[style]?.[type] || dimensions.dauphine[type];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/watch/theme-to-watch.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAllThemeWatches",
    ()=>getAllThemeWatches,
    "getWatchStyleDescription",
    ()=>getWatchStyleDescription,
    "themeToWatch",
    ()=>themeToWatch
]);
/**
 * Theme to Watch DNA Algorithm
 *
 * Analyzes theme tokens and procedurally generates watch characteristics.
 * Each of the 43 themes will produce a unique, aesthetically matched watch face.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$definitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/themes/definitions.ts [app-client] (ecmascript)");
;
// Parse HSL string "h s% l%" to object
function parseHSL(hsl) {
    const parts = hsl.split(' ').map((p)=>parseFloat(p.replace('%', '')));
    return {
        h: parts[0] || 0,
        s: parts[1] || 0,
        l: parts[2] || 0
    };
}
// Convert HSL object to CSS string
function hslToCSS(color, alpha) {
    if (alpha !== undefined) {
        return `hsla(${color.h}, ${color.s}%, ${color.l}%, ${alpha})`;
    }
    return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
}
// Adjust HSL values
function adjustHSL(color, adjustments) {
    return {
        h: Math.max(0, Math.min(360, (color.h + (adjustments.h || 0)) % 360)),
        s: Math.max(0, Math.min(100, color.s + (adjustments.s || 0))),
        l: Math.max(0, Math.min(100, color.l + (adjustments.l || 0)))
    };
}
// Manually extracted theme tokens from themes.css
// In a real implementation, these would be read from CSS or a config
const THEME_TOKENS = {
    'utilitarian': {
        background: '45 30% 92%',
        foreground: '0 0% 0%',
        primary: '15 85% 55%',
        secondary: '45 20% 85%',
        accent: '15 85% 55%',
        muted: '45 15% 88%',
        border: '0 0% 0%',
        font: 'SF Mono'
    },
    'base': {
        background: '0 0% 100%',
        foreground: '222 84% 5%',
        primary: '222 47% 11%',
        secondary: '210 40% 96%',
        accent: '210 40% 96%',
        muted: '210 40% 96%',
        border: '214 32% 91%',
        font: 'Inter'
    },
    'claude': {
        background: '30 20% 98%',
        foreground: '20 14% 10%',
        primary: '24 90% 55%',
        secondary: '30 20% 90%',
        accent: '24 80% 60%',
        muted: '30 15% 92%',
        border: '30 20% 85%',
        font: 'Söhne'
    },
    'chatgpt': {
        background: '0 0% 98%',
        foreground: '0 0% 10%',
        primary: '161 23% 45%',
        secondary: '0 0% 94%',
        accent: '161 23% 45%',
        muted: '0 0% 92%',
        border: '0 0% 85%',
        font: 'OpenAI Sans'
    },
    'vercel': {
        background: '0 0% 100%',
        foreground: '0 0% 5%',
        primary: '0 0% 5%',
        secondary: '0 0% 95%',
        accent: '0 0% 5%',
        muted: '0 0% 96%',
        border: '0 0% 90%',
        font: 'Geist'
    },
    'kodama-grove': {
        background: '120 20% 97%',
        foreground: '120 30% 10%',
        primary: '142 70% 35%',
        secondary: '120 20% 88%',
        accent: '142 60% 40%',
        muted: '120 15% 90%',
        border: '120 20% 82%',
        font: 'Nunito'
    },
    'vintage-paper': {
        background: '40 30% 95%',
        foreground: '30 20% 15%',
        primary: '30 50% 35%',
        secondary: '40 25% 85%',
        accent: '30 60% 45%',
        muted: '40 20% 88%',
        border: '40 25% 78%',
        font: 'Courier Prime'
    },
    'claymorphism': {
        background: '220 20% 97%',
        foreground: '220 30% 15%',
        primary: '220 80% 55%',
        secondary: '220 20% 88%',
        accent: '260 70% 60%',
        muted: '220 15% 90%',
        border: '220 20% 85%',
        font: 'Poppins'
    },
    'nature': {
        background: '45 25% 96%',
        foreground: '30 30% 12%',
        primary: '85 50% 40%',
        secondary: '45 20% 85%',
        accent: '30 60% 50%',
        muted: '45 15% 88%',
        border: '45 20% 78%',
        font: 'Lora'
    },
    'neo-brutalism': {
        background: '60 100% 97%',
        foreground: '0 0% 0%',
        primary: '0 0% 0%',
        secondary: '60 100% 85%',
        accent: '350 100% 60%',
        muted: '60 50% 90%',
        border: '0 0% 0%',
        font: 'Space Grotesk'
    },
    'elegant-luxury': {
        background: '45 20% 96%',
        foreground: '40 15% 12%',
        primary: '45 70% 45%',
        secondary: '45 15% 88%',
        accent: '45 80% 50%',
        muted: '45 10% 90%',
        border: '45 20% 80%',
        font: 'Playfair Display'
    },
    'pastel-dreams': {
        background: '300 30% 97%',
        foreground: '280 20% 20%',
        primary: '280 60% 65%',
        secondary: '300 25% 90%',
        accent: '330 70% 70%',
        muted: '300 20% 92%',
        border: '300 25% 85%',
        font: 'Quicksand'
    },
    'cosmic-night': {
        background: '240 30% 8%',
        foreground: '240 10% 95%',
        primary: '270 80% 60%',
        secondary: '240 25% 15%',
        accent: '200 100% 65%',
        muted: '240 20% 12%',
        border: '240 25% 20%',
        font: 'Orbitron'
    },
    'clean-slate': {
        background: '210 20% 98%',
        foreground: '210 25% 10%',
        primary: '210 100% 50%',
        secondary: '210 15% 92%',
        accent: '210 90% 55%',
        muted: '210 12% 94%',
        border: '210 15% 88%',
        font: 'Inter'
    },
    'caffeine': {
        background: '30 25% 95%',
        foreground: '25 40% 12%',
        primary: '25 70% 35%',
        secondary: '30 20% 88%',
        accent: '25 80% 45%',
        muted: '30 15% 90%',
        border: '30 20% 80%',
        font: 'Merriweather'
    },
    'ocean-breeze': {
        background: '195 30% 97%',
        foreground: '200 30% 12%',
        primary: '195 80% 45%',
        secondary: '195 25% 90%',
        accent: '175 70% 50%',
        muted: '195 20% 92%',
        border: '195 25% 85%',
        font: 'Nunito Sans'
    },
    'perpetuity': {
        background: '0 0% 4%',
        foreground: '0 0% 95%',
        primary: '0 0% 85%',
        secondary: '0 0% 10%',
        accent: '0 0% 70%',
        muted: '0 0% 8%',
        border: '0 0% 15%',
        font: 'Inter'
    },
    'midnight-bloom': {
        background: '270 30% 8%',
        foreground: '300 20% 95%',
        primary: '300 70% 55%',
        secondary: '270 25% 15%',
        accent: '330 80% 60%',
        muted: '270 20% 12%',
        border: '270 25% 20%',
        font: 'Cormorant Garamond'
    },
    'northern-lights': {
        background: '220 25% 10%',
        foreground: '180 30% 95%',
        primary: '160 80% 50%',
        secondary: '220 20% 18%',
        accent: '280 70% 60%',
        muted: '220 15% 15%',
        border: '220 20% 22%',
        font: 'Raleway'
    },
    'sunset-horizon': {
        background: '25 30% 96%',
        foreground: '15 30% 12%',
        primary: '15 85% 55%',
        secondary: '25 25% 88%',
        accent: '35 90% 55%',
        muted: '25 20% 90%',
        border: '25 25% 82%',
        font: 'Josefin Sans'
    },
    'modern-minimal': {
        background: '0 0% 100%',
        foreground: '0 0% 8%',
        primary: '0 0% 15%',
        secondary: '0 0% 96%',
        accent: '0 0% 25%',
        muted: '0 0% 94%',
        border: '0 0% 90%',
        font: 'Inter'
    },
    'candyland': {
        background: '330 40% 97%',
        foreground: '340 30% 15%',
        primary: '340 85% 60%',
        secondary: '330 35% 90%',
        accent: '180 70% 50%',
        muted: '330 30% 92%',
        border: '330 35% 85%',
        font: 'Baloo 2'
    },
    'cyberpunk': {
        background: '260 30% 8%',
        foreground: '180 100% 60%',
        primary: '320 100% 55%',
        secondary: '260 25% 15%',
        accent: '60 100% 50%',
        muted: '260 20% 12%',
        border: '320 80% 40%',
        font: 'Share Tech Mono'
    },
    'retro-arcade': {
        background: '240 40% 8%',
        foreground: '120 100% 60%',
        primary: '350 100% 55%',
        secondary: '240 35% 15%',
        accent: '60 100% 55%',
        muted: '240 30% 12%',
        border: '240 40% 20%',
        font: 'Press Start 2P'
    },
    'quantum-rose': {
        background: '340 25% 96%',
        foreground: '340 20% 12%',
        primary: '340 75% 55%',
        secondary: '340 20% 90%',
        accent: '20 80% 55%',
        muted: '340 15% 92%',
        border: '340 20% 85%',
        font: 'DM Sans'
    },
    'bold-tech': {
        background: '220 25% 10%',
        foreground: '0 0% 98%',
        primary: '210 100% 55%',
        secondary: '220 20% 18%',
        accent: '150 80% 50%',
        muted: '220 15% 15%',
        border: '220 20% 22%',
        font: 'Space Grotesk'
    },
    'violet-bloom': {
        background: '270 25% 97%',
        foreground: '270 25% 12%',
        primary: '270 70% 55%',
        secondary: '270 20% 90%',
        accent: '300 65% 60%',
        muted: '270 15% 92%',
        border: '270 20% 85%',
        font: 'Outfit'
    },
    't3-chat': {
        background: '250 30% 6%',
        foreground: '0 0% 98%',
        primary: '270 80% 60%',
        secondary: '250 25% 12%',
        accent: '200 100% 55%',
        muted: '250 20% 10%',
        border: '250 25% 18%',
        font: 'Cal Sans'
    },
    'mocha-mousse': {
        background: '25 30% 94%',
        foreground: '20 35% 15%',
        primary: '20 55% 40%',
        secondary: '25 25% 85%',
        accent: '20 65% 50%',
        muted: '25 20% 88%',
        border: '25 25% 78%',
        font: 'Libre Baskerville'
    },
    'amethyst-haze': {
        background: '280 20% 96%',
        foreground: '280 25% 15%',
        primary: '280 60% 55%',
        secondary: '280 15% 90%',
        accent: '320 55% 60%',
        muted: '280 12% 92%',
        border: '280 18% 85%',
        font: 'Spectral'
    },
    'doom-64': {
        background: '0 0% 5%',
        foreground: '0 100% 50%',
        primary: '0 100% 45%',
        secondary: '0 80% 10%',
        accent: '30 100% 50%',
        muted: '0 60% 8%',
        border: '0 100% 30%',
        font: 'Permanent Marker'
    },
    'amber-minimal': {
        background: '45 35% 97%',
        foreground: '40 30% 12%',
        primary: '40 85% 50%',
        secondary: '45 30% 92%',
        accent: '35 90% 55%',
        muted: '45 25% 94%',
        border: '45 30% 88%',
        font: 'Inter'
    },
    'solar-dusk': {
        background: '25 35% 12%',
        foreground: '35 30% 92%',
        primary: '25 90% 55%',
        secondary: '25 30% 18%',
        accent: '45 95% 55%',
        muted: '25 25% 15%',
        border: '25 30% 22%',
        font: 'Rubik'
    },
    'starry-night': {
        background: '230 40% 10%',
        foreground: '60 50% 90%',
        primary: '220 70% 55%',
        secondary: '230 35% 18%',
        accent: '60 80% 60%',
        muted: '230 30% 15%',
        border: '230 35% 22%',
        font: 'Crimson Pro'
    },
    'soft-pop': {
        background: '15 40% 97%',
        foreground: '10 35% 15%',
        primary: '10 75% 60%',
        secondary: '15 35% 92%',
        accent: '340 70% 65%',
        muted: '15 30% 94%',
        border: '15 35% 88%',
        font: 'Nunito'
    },
    'sage-garden': {
        background: '120 15% 96%',
        foreground: '130 25% 15%',
        primary: '130 40% 45%',
        secondary: '120 12% 90%',
        accent: '90 50% 50%',
        muted: '120 10% 92%',
        border: '120 15% 85%',
        font: 'Source Serif Pro'
    },
    'notebook': {
        background: '45 40% 96%',
        foreground: '220 80% 20%',
        primary: '220 85% 45%',
        secondary: '45 35% 90%',
        accent: '0 75% 55%',
        muted: '45 30% 92%',
        border: '200 60% 75%',
        font: 'Patrick Hand'
    },
    'research': {
        background: '0 0% 100%',
        foreground: '220 15% 15%',
        primary: '220 75% 50%',
        secondary: '0 0% 96%',
        accent: '160 70% 45%',
        muted: '0 0% 94%',
        border: '220 20% 88%',
        font: 'IBM Plex Sans'
    },
    'field-guide': {
        background: '45 30% 94%',
        foreground: '90 25% 18%',
        primary: '90 45% 35%',
        secondary: '45 25% 88%',
        accent: '25 70% 50%',
        muted: '45 20% 90%',
        border: '90 30% 75%',
        font: 'Vollkorn'
    },
    'denim': {
        background: '215 35% 95%',
        foreground: '220 40% 15%',
        primary: '215 60% 45%',
        secondary: '215 30% 88%',
        accent: '200 70% 50%',
        muted: '215 25% 90%',
        border: '215 35% 78%',
        font: 'Inter'
    },
    'google': {
        background: '0 0% 100%',
        foreground: '0 0% 15%',
        primary: '217 89% 61%',
        secondary: '214 12% 95%',
        accent: '4 90% 58%',
        muted: '220 14% 96%',
        border: '214 32% 91%',
        font: 'Google Sans'
    },
    'apple': {
        background: '0 0% 100%',
        foreground: '0 0% 0%',
        primary: '211 100% 50%',
        secondary: '220 10% 96%',
        accent: '211 100% 50%',
        muted: '220 10% 94%',
        border: '220 13% 91%',
        font: 'SF Pro'
    },
    'microsoft': {
        background: '0 0% 100%',
        foreground: '0 0% 11%',
        primary: '206 100% 42%',
        secondary: '210 14% 93%',
        accent: '206 100% 42%',
        muted: '210 11% 96%',
        border: '210 14% 89%',
        font: 'Segoe UI'
    },
    'notion': {
        background: '0 0% 100%',
        foreground: '0 0% 9%',
        primary: '0 0% 9%',
        secondary: '45 6% 97%',
        accent: '0 0% 9%',
        muted: '45 4% 95%',
        border: '45 6% 90%',
        font: 'Inter'
    },
    'cursor': {
        background: '0 0% 0%',
        foreground: '0 0% 100%',
        primary: '191 100% 50%',
        secondary: '240 2% 12%',
        accent: '191 100% 50%',
        muted: '240 2% 16%',
        border: '240 2% 20%',
        font: 'Inter'
    },
    'miro': {
        background: '47 100% 98%',
        foreground: '222 47% 11%',
        primary: '39 100% 50%',
        secondary: '47 20% 92%',
        accent: '39 100% 50%',
        muted: '47 15% 95%',
        border: '47 10% 88%',
        font: 'Inter'
    },
    'nike': {
        background: '40 30% 95%',
        foreground: '0 0% 8%',
        primary: '0 0% 8%',
        secondary: '40 20% 90%',
        accent: '28 100% 55%',
        muted: '40 15% 88%',
        border: '40 20% 85%',
        font: 'Helvetica Neue'
    },
    'adidas': {
        background: '0 0% 98%',
        foreground: '0 0% 8%',
        primary: '210 100% 45%',
        secondary: '0 0% 94%',
        accent: '0 0% 8%',
        muted: '0 0% 92%',
        border: '0 0% 88%',
        font: 'Helvetica Neue'
    },
    'tao': {
        background: '220 30% 8%',
        foreground: '210 20% 78%',
        primary: '200 40% 55%',
        secondary: '220 25% 15%',
        accent: '200 45% 50%',
        muted: '220 20% 12%',
        border: '220 25% 20%',
        font: 'Crimson Text'
    },
    'kinetic-editorial': {
        background: '0 0% 4%',
        foreground: '0 0% 96%',
        primary: '0 0% 96%',
        secondary: '0 0% 12%',
        accent: '0 0% 80%',
        muted: '0 0% 8%',
        border: '0 0% 20%',
        font: 'Space Grotesk'
    }
};
// Detect watch style from theme characteristics
function detectWatchStyle(tokens) {
    const bg = parseHSL(tokens.background);
    const fg = parseHSL(tokens.foreground);
    const primary = parseHSL(tokens.primary);
    const accent = parseHSL(tokens.accent);
    // Calculate contrast and saturation metrics
    const contrast = Math.abs(bg.l - fg.l);
    const primarySat = primary.s;
    const accentSat = accent.s;
    const avgSat = (primarySat + accentSat) / 2;
    const isDark = bg.l < 30;
    const isMonochrome = primary.s < 15 && accent.s < 15;
    // Font-based detection
    const fontLower = tokens.font.toLowerCase();
    const isMonospace = fontLower.includes('mono') || fontLower.includes('code');
    const isSerif = fontLower.includes('serif') || fontLower.includes('times') || fontLower.includes('georgia');
    const isPlayful = fontLower.includes('press start') || fontLower.includes('permanent') || fontLower.includes('hand');
    // Digital/tech themes
    if (isMonospace || fontLower.includes('orbitron') || fontLower.includes('share tech')) {
        return 'digital';
    }
    // High contrast + bold = sporty or diver
    if (contrast > 80 && avgSat > 60) {
        return isDark ? 'diver' : 'sporty';
    }
    // Very high saturation accent = sporty
    if (accentSat > 85) {
        return 'sporty';
    }
    // Warm sepia/vintage tones
    if (primary.h >= 20 && primary.h <= 45 && primary.s < 60 && bg.l > 85) {
        return 'vintage';
    }
    // Military/field - utilitarian fonts or earthy tones
    if (fontLower.includes('mono') && !isDark || primary.h >= 80 && primary.h <= 130) {
        return 'field';
    }
    // Very low saturation + clean = minimal
    if (isMonochrome || avgSat < 30 && contrast > 60) {
        return 'minimal';
    }
    // Serif fonts or low saturation = elegant
    if (isSerif || avgSat < 50 && !isDark && primary.s < 40) {
        return 'elegant';
    }
    // Default based on darkness
    return isDark ? 'diver' : 'elegant';
}
// Detect hand style based on watch style and theme
function detectHandStyle(style, tokens) {
    const fontLower = tokens.font.toLowerCase();
    switch(style){
        case 'sporty':
            return 'mercedes'; // Like Rolex sport watches
        case 'diver':
            return 'snowflake'; // Like Tudor Black Bay
        case 'elegant':
            return 'dauphine'; // Classic dress watch
        case 'minimal':
            return 'baton'; // Simple, modern
        case 'vintage':
            return 'leaf'; // Classic vintage look
        case 'field':
            return 'sword'; // Military heritage
        case 'digital':
            return 'baton'; // Digital style
        default:
            return 'dauphine';
    }
}
// Detect index style based on watch style
function detectIndexStyle(style, tokens) {
    const fontLower = tokens.font.toLowerCase();
    const isSerif = fontLower.includes('serif') || fontLower.includes('playfair') || fontLower.includes('times');
    switch(style){
        case 'sporty':
            return 'baton'; // Applied indices
        case 'diver':
            return 'dots'; // Luminous dots
        case 'elegant':
            return isSerif ? 'roman' : 'baton';
        case 'minimal':
            return 'none'; // Very clean
        case 'vintage':
            return 'arabic'; // Classic numerals
        case 'field':
            return 'arabic'; // Legible military style
        case 'digital':
            return 'none'; // Digital display
        default:
            return 'baton';
    }
}
// Detect dial texture based on theme
function detectDialTexture(style, tokens) {
    const bg = parseHSL(tokens.background);
    switch(style){
        case 'elegant':
            return bg.l > 50 ? 'sunburst' : 'guilloche';
        case 'sporty':
            return 'matte';
        case 'diver':
            return 'matte';
        case 'vintage':
            return 'matte';
        case 'minimal':
            return 'matte';
        case 'digital':
            return 'matte';
        case 'field':
            return 'brushed';
        default:
            return 'matte';
    }
}
function themeToWatch(themeName) {
    const tokens = THEME_TOKENS[themeName];
    if (!tokens) {
        throw new Error(`Unknown theme: ${themeName}`);
    }
    const style = detectWatchStyle(tokens);
    const bg = parseHSL(tokens.background);
    const fg = parseHSL(tokens.foreground);
    const primary = parseHSL(tokens.primary);
    const accent = parseHSL(tokens.accent);
    const secondary = parseHSL(tokens.secondary);
    // Determine dial color (usually darker for legibility)
    const isDark = bg.l < 30;
    let dialColor;
    if (isDark) {
        // Dark themes: use background or slightly adjusted
        dialColor = adjustHSL(bg, {
            l: 5
        });
    } else {
        // Light themes: create a darker dial or use background
        dialColor = style === 'minimal' || style === 'elegant' ? adjustHSL(bg, {
            l: -3
        }) : adjustHSL(bg, {
            l: -10,
            s: 5
        });
    }
    // Hand colors - high contrast against dial
    const handColor = isDark ? fg : adjustHSL(fg, {
        l: -10
    });
    // Seconds hand - use accent color for pop
    const secondsHandColor = accent;
    // Index color - slightly muted from hand color
    const indexColor = adjustHSL(handColor, {
        s: -10,
        l: isDark ? -5 : 5
    });
    // Lume color - greenish glow for most, blue for some
    const lumeColor = style === 'diver' ? {
        h: 180,
        s: 100,
        l: 70
    } // Blue lume
     : {
        h: 120,
        s: 80,
        l: 75
    }; // Green lume
    // Bezel color
    const bezelColor = style === 'diver' ? adjustHSL(primary, {
        l: -20
    }) : adjustHSL(secondary, {
        l: -5
    });
    return {
        theme: themeName,
        style,
        dialColor: hslToCSS(dialColor),
        dialTexture: detectDialTexture(style, tokens),
        handColor: hslToCSS(handColor),
        secondsHandColor: hslToCSS(secondsHandColor),
        indexColor: hslToCSS(indexColor),
        lumeColor: hslToCSS(lumeColor),
        bezelColor: hslToCSS(bezelColor),
        handStyle: detectHandStyle(style, tokens),
        indexStyle: detectIndexStyle(style, tokens),
        hasDateWindow: style !== 'minimal' && style !== 'digital',
        datePosition: style === 'diver' ? 3 : 6,
        hasSubdials: style === 'sporty',
        hasCrystalDome: style === 'vintage' || style === 'elegant',
        hasChapterRing: style === 'field' || style === 'vintage',
        caseFinish: style === 'sporty' || style === 'diver' ? 'brushed' : 'polished',
        font: tokens.font
    };
}
function getAllThemeWatches() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$definitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["themes"].map((t)=>themeToWatch(t.name));
}
function getWatchStyleDescription(style) {
    const descriptions = {
        sporty: 'Bold sport chronograph with high legibility',
        elegant: 'Refined dress watch with classic proportions',
        minimal: 'Ultra-clean design with essential elements only',
        digital: 'Tech-inspired with modern digital aesthetic',
        vintage: 'Heritage-inspired with warm, aged character',
        field: 'Military-inspired with utilitarian precision',
        diver: 'Professional tool watch built for depth'
    };
    return descriptions[style];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/src/context/PrivateMusicContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PrivateMusicProvider",
    ()=>PrivateMusicProvider,
    "usePrivateMusic",
    ()=>usePrivateMusic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$45$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.45.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@clerk/shared/dist/runtime/react/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/openclaw/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/convex-shim.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const PrivateMusicContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
// Default values for when Convex isn't available (SSG/SSR)
const defaultValue = {
    isSignedIn: false,
    isLoading: true,
    isCollaborator: false,
    isAdmin: false,
    collaborator: null,
    privateTracks: [],
    isLoadingTracks: false,
    hasPrivateAccess: false
};
// Inner provider that uses Convex hooks
function PrivateMusicProviderInner({ children }) {
    _s();
    const { isSignedIn, isLoaded: isClerkLoaded } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$45$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"])();
    // Query collaborator status from Convex (only when signed in)
    const collaboratorStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].privateMusic.getMyCollaboratorStatus, isSignedIn ? {} : 'skip');
    // Query private tracks (only when user is a collaborator)
    const privateTracks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].privateMusic.getMyPrivateTracks, collaboratorStatus?.isCollaborator ? {} : 'skip');
    // Link collaborator account on first sign-in (if email matches pending invite)
    const linkAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].privateMusic.linkCollaboratorAccount);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PrivateMusicProviderInner.useEffect": ()=>{
            if (isSignedIn && collaboratorStatus && !collaboratorStatus.isCollaborator) {
                // Try to link account in case this is a pending collaborator signing in
                linkAccount().catch({
                    "PrivateMusicProviderInner.useEffect": ()=>{
                    // Silently fail - user just isn't a collaborator
                    }
                }["PrivateMusicProviderInner.useEffect"]);
            }
        }
    }["PrivateMusicProviderInner.useEffect"], [
        isSignedIn,
        collaboratorStatus,
        linkAccount
    ]);
    const isLoading = !isClerkLoaded || isSignedIn && collaboratorStatus === undefined;
    const isLoadingTracks = collaboratorStatus?.isCollaborator && privateTracks === undefined;
    const value = {
        isSignedIn: !!isSignedIn,
        isLoading,
        isCollaborator: collaboratorStatus?.isCollaborator ?? false,
        isAdmin: collaboratorStatus?.isAdmin ?? false,
        collaborator: collaboratorStatus?.collaborator ?? null,
        privateTracks: privateTracks ?? [],
        isLoadingTracks: !!isLoadingTracks,
        hasPrivateAccess: !!collaboratorStatus?.isCollaborator
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PrivateMusicContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/PrivateMusicContext.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
_s(PrivateMusicProviderInner, "+pYM/PE8oNPVxva2MOfRmty/pe0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$45$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
_c = PrivateMusicProviderInner;
function PrivateMusicProvider({ children }) {
    _s1();
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PrivateMusicProvider.useEffect": ()=>{
            setIsMounted(true);
        }
    }["PrivateMusicProvider.useEffect"], []);
    // During SSR/SSG, render with default values
    if (!isMounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PrivateMusicContext.Provider, {
            value: defaultValue,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/context/PrivateMusicContext.tsx",
            lineNumber: 125,
            columnNumber: 7
        }, this);
    }
    // On client, use the inner provider with Convex hooks
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PrivateMusicProviderInner, {
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/PrivateMusicContext.tsx",
        lineNumber: 132,
        columnNumber: 10
    }, this);
}
_s1(PrivateMusicProvider, "h7njlszr1nxUzrk46zHyBTBrvgI=");
_c1 = PrivateMusicProvider;
function usePrivateMusic() {
    _s2();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(PrivateMusicContext);
    if (!context) {
        throw new Error('usePrivateMusic must be used within a PrivateMusicProvider');
    }
    return context;
}
_s2(usePrivateMusic, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c, _c1;
__turbopack_context__.k.register(_c, "PrivateMusicProviderInner");
__turbopack_context__.k.register(_c1, "PrivateMusicProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useAdminSession.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useAdminSession",
    ()=>useAdminSession
]);
/**
 * Admin Session Hook
 *
 * Provides client-side access to admin session state.
 * Used to conditionally show admin-only features.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function useAdminSession() {
    _s();
    const [session, setSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        isAuthenticated: false,
        isLoading: true
    });
    const checkSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAdminSession.useCallback[checkSession]": async ()=>{
            try {
                const res = await fetch("/api/auth/admin");
                const data = await res.json();
                setSession({
                    isAuthenticated: data.isAuthenticated ?? false,
                    username: data.username,
                    isLoading: false
                });
            } catch  {
                setSession({
                    isAuthenticated: false,
                    isLoading: false
                });
            }
        }
    }["useAdminSession.useCallback[checkSession]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAdminSession.useEffect": ()=>{
            checkSession();
        }
    }["useAdminSession.useEffect"], [
        checkSession
    ]);
    return {
        ...session,
        refresh: checkSession
    };
}
_s(useAdminSession, "weQ7I0aqtLGYnN3tRkoSmtVMlCw=");
const __TURBOPACK__default__export__ = useAdminSession;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useFeatureAccess.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useFeatureAccess",
    ()=>useFeatureAccess,
    "withFeatureAccess",
    ()=>withFeatureAccess
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * useFeatureAccess - Hook for checking feature/area access
 *
 * Checks if the current user has access to a specific feature or area.
 * Returns access status and a function to show the graceful denial overlay.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/openclaw/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$45$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.45.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@clerk/shared/dist/runtime/react/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAdminSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAdminSession.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
// Type assertion for userManagement module
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let userManagementApi;
try {
    // Dynamic import to handle cases where Convex isn't configured
    userManagementApi = (()=>{
        const e = new Error("Cannot find module '../../convex/_generated/api'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    })().api?.userManagement;
} catch  {
    userManagementApi = null;
}
// Map features to their required permission keys
const FEATURE_TO_PERMISSION = {
    humans: 'areas',
    studio: 'areas',
    vault: 'areas',
    calendar: 'areas',
    prototyping: 'areas',
    privateMusic: 'privateMusic',
    designCanvas: 'designCanvas',
    security: 'security',
    analytics: 'analytics'
};
// Area slugs for area-based features
const AREA_FEATURES = [
    'humans',
    'studio',
    'vault',
    'calendar',
    'prototyping'
];
function useFeatureAccess(feature) {
    _s();
    const { user, isLoaded: isClerkLoaded } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$45$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"])();
    const { isAuthenticated: isAdmin, isLoading: isAdminLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAdminSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAdminSession"])();
    const [isGateOpen, setIsGateOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Get managed user data if logged in
    const clerkId = user?.id;
    const managedUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(userManagementApi?.getManagedUserByClerkId, clerkId ? {
        clerkId
    } : 'skip');
    const isLoading = !isClerkLoaded || isAdminLoading || Boolean(clerkId && managedUser === undefined);
    // Determine access
    const accessResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useFeatureAccess.useMemo[accessResult]": ()=>{
            // Still loading
            if (isLoading) {
                return {
                    hasAccess: false,
                    reason: 'Loading...'
                };
            }
            // Admin always has access
            if (isAdmin) {
                return {
                    hasAccess: true
                };
            }
            // Not logged in = visitor
            if (!user) {
                return {
                    hasAccess: false,
                    reason: 'This feature requires an account. Sign in or request access.'
                };
            }
            // User is logged in but not in managed users
            if (!managedUser) {
                return {
                    hasAccess: false,
                    reason: 'This feature is available to invited collaborators.'
                };
            }
            // User is deactivated
            if (!managedUser.isActive) {
                return {
                    hasAccess: false,
                    reason: 'Your account has been deactivated. Contact the owner for assistance.'
                };
            }
            // Owner has access to everything
            if (managedUser.role === 'owner') {
                return {
                    hasAccess: true
                };
            }
            // Admin role has access to everything
            if (managedUser.role === 'admin') {
                return {
                    hasAccess: true
                };
            }
            // Check specific permission
            const permissionKey = FEATURE_TO_PERMISSION[feature];
            if (AREA_FEATURES.includes(feature)) {
                // Area-based access
                const hasAreaAccess = managedUser.permissions?.areas?.includes(feature);
                if (!hasAreaAccess) {
                    return {
                        hasAccess: false,
                        reason: `This area is reserved for users with ${feature} access.`
                    };
                }
                return {
                    hasAccess: true
                };
            }
            // Feature toggle access
            const hasFeatureAccess = managedUser.permissions?.[permissionKey];
            if (!hasFeatureAccess) {
                return {
                    hasAccess: false,
                    reason: `This feature requires ${feature} permission.`
                };
            }
            return {
                hasAccess: true
            };
        }
    }["useFeatureAccess.useMemo[accessResult]"], [
        isLoading,
        isAdmin,
        user,
        managedUser,
        feature
    ]);
    const showAccessGate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFeatureAccess.useCallback[showAccessGate]": ()=>{
            setIsGateOpen(true);
        }
    }["useFeatureAccess.useCallback[showAccessGate]"], []);
    const hideAccessGate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFeatureAccess.useCallback[hideAccessGate]": ()=>{
            setIsGateOpen(false);
        }
    }["useFeatureAccess.useCallback[hideAccessGate]"], []);
    return {
        hasAccess: accessResult.hasAccess,
        isLoading,
        reason: accessResult.reason,
        showAccessGate,
        hideAccessGate,
        isGateOpen
    };
}
_s(useFeatureAccess, "GMgKga+w5Crd3K0MuDzJ9S8Lt2w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$45$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAdminSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAdminSession"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function withFeatureAccess(WrappedComponent, feature) {
    var _s = __turbopack_context__.k.signature();
    return _s(function ProtectedComponent(props) {
        _s();
        const { hasAccess, isLoading } = useFeatureAccess(feature);
        if (isLoading) {
            return null; // Or a loading spinner
        }
        if (!hasAccess) {
            return null; // The AccessGate will be shown separately
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WrappedComponent, {
            ...props
        }, void 0, false, {
            fileName: "[project]/src/hooks/useFeatureAccess.tsx",
            lineNumber: 182,
            columnNumber: 12
        }, this);
    }, "1umZz5f5lun55LR5LXX334YN9e0=", false, function() {
        return [
            useFeatureAccess
        ];
    });
}
const __TURBOPACK__default__export__ = useFeatureAccess;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useMusicPlayerMorph.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMusicPlayerMorph",
    ()=>useMusicPlayerMorph
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.34.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/es/value/use-motion-value.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.34.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/es/value/use-transform.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$animate$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.34.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/es/animation/animate/index.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useMusicPlayerMorph() {
    _s();
    const [morphState, setMorphState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('ipod');
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isMobile, setIsMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Motion value for smooth, interruptible animations
    const progress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"])(0);
    const [morphProgress, setMorphProgressState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Sync motion value with state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMusicPlayerMorph.useEffect": ()=>{
            const unsubscribe = progress.on('change', {
                "useMusicPlayerMorph.useEffect.unsubscribe": (v)=>{
                    setMorphProgressState(v);
                }
            }["useMusicPlayerMorph.useEffect.unsubscribe"]);
            return unsubscribe;
        }
    }["useMusicPlayerMorph.useEffect"], [
        progress
    ]);
    // Detect mobile viewport
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMusicPlayerMorph.useEffect": ()=>{
            const checkMobile = {
                "useMusicPlayerMorph.useEffect.checkMobile": ()=>{
                    setIsMobile(window.innerWidth < 768);
                }
            }["useMusicPlayerMorph.useEffect.checkMobile"];
            checkMobile();
            window.addEventListener('resize', checkMobile);
            return ({
                "useMusicPlayerMorph.useEffect": ()=>window.removeEventListener('resize', checkMobile)
            })["useMusicPlayerMorph.useEffect"];
        }
    }["useMusicPlayerMorph.useEffect"], []);
    // Derived transforms for iPod morphing
    // Desktop: iPod stays centered, scales subtly, panels appear around it
    // Mobile: iPod morphs into Dynamic Island (small pill at top)
    const ipodScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(progress, isMobile ? [
        0,
        0.5,
        1
    ] : [
        0,
        0.5,
        1
    ], isMobile ? [
        1,
        0.5,
        0.35
    ] : [
        1,
        0.98,
        0.95
    ] // Subtle scale for desktop elegance
    );
    const ipodBorderRadius = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(progress, [
        0,
        0.5,
        1
    ], isMobile ? [
        32,
        24,
        22
    ] : [
        32,
        30,
        28
    ]);
    const ipodWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(progress, [
        0,
        0.5,
        1
    ], isMobile ? [
        300,
        180,
        140
    ] : [
        300,
        300,
        300
    ] // Desktop keeps full width
    );
    const ipodHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(progress, [
        0,
        0.5,
        1
    ], isMobile ? [
        'auto',
        '70px',
        '52px'
    ] : [
        'auto',
        'auto',
        'auto'
    ]);
    // Smooth panel fade - starts earlier, finishes with elegant timing
    const panelOpacity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(progress, [
        0,
        0.15,
        0.5,
        1
    ], [
        0,
        0,
        0.7,
        1
    ]);
    // Premium spring animation - lower stiffness, controlled damping for silk-smooth feel
    const animateTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMusicPlayerMorph.useCallback[animateTo]": (target)=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$animate$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["animate"])(progress, target, {
                type: 'spring',
                stiffness: 260,
                damping: 28,
                mass: 0.9
            });
        }
    }["useMusicPlayerMorph.useCallback[animateTo]"], [
        progress
    ]);
    // Expand to full view
    const expand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMusicPlayerMorph.useCallback[expand]": ()=>{
            setMorphState('expanded');
            animateTo(1);
        }
    }["useMusicPlayerMorph.useCallback[expand]"], [
        animateTo
    ]);
    // Collapse back to iPod
    const collapse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMusicPlayerMorph.useCallback[collapse]": ()=>{
            setMorphState('ipod');
            animateTo(0);
        }
    }["useMusicPlayerMorph.useCallback[collapse]"], [
        animateTo
    ]);
    // Toggle between states
    const toggleExpanded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMusicPlayerMorph.useCallback[toggleExpanded]": ()=>{
            if (morphState === 'expanded') {
                collapse();
            } else {
                expand();
            }
        }
    }["useMusicPlayerMorph.useCallback[toggleExpanded]"], [
        morphState,
        expand,
        collapse
    ]);
    // Gesture handlers for scrubbing the morph
    const onDragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMusicPlayerMorph.useCallback[onDragStart]": ()=>{
            setIsDragging(true);
            setMorphState('morphing');
        }
    }["useMusicPlayerMorph.useCallback[onDragStart]"], []);
    const onDrag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMusicPlayerMorph.useCallback[onDrag]": (newProgress)=>{
            // Clamp between 0 and 1
            const clamped = Math.max(0, Math.min(1, newProgress));
            progress.set(clamped);
        }
    }["useMusicPlayerMorph.useCallback[onDrag]"], [
        progress
    ]);
    const onDragEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMusicPlayerMorph.useCallback[onDragEnd]": ()=>{
            setIsDragging(false);
            // Snap to nearest state based on current progress
            const currentProgress = progress.get();
            if (isMobile) {
                // Mobile: snap to iPod (0), island (0.5), or expanded (1)
                if (currentProgress < 0.25) {
                    setMorphState('ipod');
                    animateTo(0);
                } else if (currentProgress < 0.75) {
                    setMorphState('island');
                    animateTo(0.5);
                } else {
                    setMorphState('expanded');
                    animateTo(1);
                }
            } else {
                // Desktop: snap to iPod (0) or expanded (1)
                if (currentProgress < 0.5) {
                    setMorphState('ipod');
                    animateTo(0);
                } else {
                    setMorphState('expanded');
                    animateTo(1);
                }
            }
        }
    }["useMusicPlayerMorph.useCallback[onDragEnd]"], [
        progress,
        isMobile,
        animateTo
    ]);
    // Direct progress setter for external control
    const setMorphProgress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMusicPlayerMorph.useCallback[setMorphProgress]": (newProgress)=>{
            progress.set(Math.max(0, Math.min(1, newProgress)));
        }
    }["useMusicPlayerMorph.useCallback[setMorphProgress]"], [
        progress
    ]);
    return {
        morphProgress,
        morphState,
        isDragging,
        isMobile,
        progress,
        ipodScale,
        ipodBorderRadius,
        ipodWidth,
        ipodHeight,
        panelOpacity,
        expand,
        collapse,
        toggleExpanded,
        onDragStart,
        onDrag,
        onDragEnd,
        setMorphProgress
    };
}
_s(useMusicPlayerMorph, "HRusQ3alkkSBPbmnHJ+oo95v7T4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useStreamingChat.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useStreamingChat",
    ()=>useStreamingChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useStreamingChat(options = {}) {
    _s();
    const { model = 'default', themeContext, onStreamStart, onStreamEnd, onError } = options;
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isStreaming, setIsStreaming] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeToolCalls, setActiveToolCalls] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const generateId = ()=>`msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const sendMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStreamingChat.useCallback[sendMessage]": async (content)=>{
            if (!content.trim() || isStreaming) return;
            setError(null);
            // Create user message
            const userMessage = {
                id: generateId(),
                role: 'user',
                content: content.trim(),
                timestamp: new Date()
            };
            // Create placeholder for assistant response
            const assistantMessage = {
                id: generateId(),
                role: 'assistant',
                content: '',
                timestamp: new Date(),
                isStreaming: true,
                thinking: '',
                isThinkingStreaming: false
            };
            setMessages({
                "useStreamingChat.useCallback[sendMessage]": (prev)=>[
                        ...prev,
                        userMessage,
                        assistantMessage
                    ]
            }["useStreamingChat.useCallback[sendMessage]"]);
            setIsStreaming(true);
            onStreamStart?.();
            // Create abort controller for this request
            abortControllerRef.current = new AbortController();
            try {
                // Prepare messages for API (exclude the placeholder)
                const apiMessages = [
                    ...messages,
                    userMessage
                ].map({
                    "useStreamingChat.useCallback[sendMessage].apiMessages": (m)=>({
                            role: m.role,
                            content: m.content
                        })
                }["useStreamingChat.useCallback[sendMessage].apiMessages"]);
                const response = await fetch('/api/chat/stream', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: apiMessages,
                        model,
                        themeContext
                    }),
                    signal: abortControllerRef.current.signal
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "useStreamingChat.useCallback[sendMessage]": ()=>({})
                    }["useStreamingChat.useCallback[sendMessage]"]);
                    throw new Error(errorData.error || 'Failed to get response');
                }
                const reader = response.body?.getReader();
                if (!reader) {
                    throw new Error('No response body');
                }
                const decoder = new TextDecoder();
                let accumulatedContent = '';
                let accumulatedThinking = '';
                while(true){
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, {
                        stream: true
                    });
                    const lines = chunk.split('\n');
                    for (const line of lines){
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') continue;
                            try {
                                const parsed = JSON.parse(data);
                                // Handle content (main response)
                                if (parsed.content) {
                                    accumulatedContent += parsed.content;
                                    // Update the assistant message with accumulated content
                                    setMessages({
                                        "useStreamingChat.useCallback[sendMessage]": (prev)=>prev.map({
                                                "useStreamingChat.useCallback[sendMessage]": (m)=>m.id === assistantMessage.id ? {
                                                        ...m,
                                                        content: accumulatedContent,
                                                        isThinkingStreaming: false
                                                    } : m
                                            }["useStreamingChat.useCallback[sendMessage]"])
                                    }["useStreamingChat.useCallback[sendMessage]"]);
                                }
                                // Handle thinking/reasoning (chain of thought)
                                if (parsed.thinking) {
                                    accumulatedThinking += parsed.thinking;
                                    // Update the assistant message with accumulated thinking
                                    setMessages({
                                        "useStreamingChat.useCallback[sendMessage]": (prev)=>prev.map({
                                                "useStreamingChat.useCallback[sendMessage]": (m)=>m.id === assistantMessage.id ? {
                                                        ...m,
                                                        thinking: accumulatedThinking,
                                                        isThinkingStreaming: true
                                                    } : m
                                            }["useStreamingChat.useCallback[sendMessage]"])
                                    }["useStreamingChat.useCallback[sendMessage]"]);
                                }
                                // Handle tool call start
                                if (parsed.toolCall) {
                                    const { id, name, status } = parsed.toolCall;
                                    setActiveToolCalls({
                                        "useStreamingChat.useCallback[sendMessage]": (prev)=>{
                                            const existing = prev.find({
                                                "useStreamingChat.useCallback[sendMessage].existing": (tc)=>tc.id === id
                                            }["useStreamingChat.useCallback[sendMessage].existing"]);
                                            if (existing) {
                                                return prev.map({
                                                    "useStreamingChat.useCallback[sendMessage]": (tc)=>tc.id === id ? {
                                                            ...tc,
                                                            status: status
                                                        } : tc
                                                }["useStreamingChat.useCallback[sendMessage]"]);
                                            }
                                            return [
                                                ...prev,
                                                {
                                                    id,
                                                    name,
                                                    status: status
                                                }
                                            ];
                                        }
                                    }["useStreamingChat.useCallback[sendMessage]"]);
                                }
                                // Handle tool result
                                if (parsed.toolResult) {
                                    const { id, name, result } = parsed.toolResult;
                                    setActiveToolCalls({
                                        "useStreamingChat.useCallback[sendMessage]": (prev)=>prev.map({
                                                "useStreamingChat.useCallback[sendMessage]": (tc)=>tc.id === id ? {
                                                        ...tc,
                                                        status: 'complete',
                                                        result
                                                    } : tc
                                            }["useStreamingChat.useCallback[sendMessage]"])
                                    }["useStreamingChat.useCallback[sendMessage]"]);
                                }
                                // Handle tool error
                                if (parsed.toolError) {
                                    const { id, error: toolError } = parsed.toolError;
                                    setActiveToolCalls({
                                        "useStreamingChat.useCallback[sendMessage]": (prev)=>prev.map({
                                                "useStreamingChat.useCallback[sendMessage]": (tc)=>tc.id === id ? {
                                                        ...tc,
                                                        status: 'error',
                                                        error: toolError
                                                    } : tc
                                            }["useStreamingChat.useCallback[sendMessage]"])
                                    }["useStreamingChat.useCallback[sendMessage]"]);
                                }
                                // Handle tool denied (access control)
                                if (parsed.toolDenied) {
                                    const { name, reason } = parsed.toolDenied;
                                    const deniedId = `denied_${Date.now()}`;
                                    setActiveToolCalls({
                                        "useStreamingChat.useCallback[sendMessage]": (prev)=>[
                                                ...prev,
                                                {
                                                    id: deniedId,
                                                    name,
                                                    status: 'denied',
                                                    error: reason
                                                }
                                            ]
                                    }["useStreamingChat.useCallback[sendMessage]"]);
                                }
                            } catch  {
                            // Skip invalid JSON
                            }
                        }
                    }
                }
                // Mark streaming as complete and attach tool calls to message
                setActiveToolCalls({
                    "useStreamingChat.useCallback[sendMessage]": (currentTools)=>{
                        // Capture final tools before clearing
                        setMessages({
                            "useStreamingChat.useCallback[sendMessage]": (prev)=>prev.map({
                                    "useStreamingChat.useCallback[sendMessage]": (m)=>m.id === assistantMessage.id ? {
                                            ...m,
                                            isStreaming: false,
                                            isThinkingStreaming: false,
                                            toolCalls: currentTools.length > 0 ? [
                                                ...currentTools
                                            ] : undefined
                                        } : m
                                }["useStreamingChat.useCallback[sendMessage]"])
                        }["useStreamingChat.useCallback[sendMessage]"]);
                        return []; // Clear active tool calls
                    }
                }["useStreamingChat.useCallback[sendMessage]"]);
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    // Request was aborted, just mark streaming as complete
                    setMessages({
                        "useStreamingChat.useCallback[sendMessage]": (prev)=>prev.map({
                                "useStreamingChat.useCallback[sendMessage]": (m)=>m.id === assistantMessage.id ? {
                                        ...m,
                                        isStreaming: false,
                                        content: m.content || 'Request cancelled.'
                                    } : m
                            }["useStreamingChat.useCallback[sendMessage]"])
                    }["useStreamingChat.useCallback[sendMessage]"]);
                } else {
                    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                    setError(errorMessage);
                    onError?.(err instanceof Error ? err : new Error(errorMessage));
                    // Update the assistant message with error
                    setMessages({
                        "useStreamingChat.useCallback[sendMessage]": (prev)=>prev.map({
                                "useStreamingChat.useCallback[sendMessage]": (m)=>m.id === assistantMessage.id ? {
                                        ...m,
                                        isStreaming: false,
                                        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`
                                    } : m
                            }["useStreamingChat.useCallback[sendMessage]"])
                    }["useStreamingChat.useCallback[sendMessage]"]);
                }
            } finally{
                setIsStreaming(false);
                abortControllerRef.current = null;
                onStreamEnd?.();
            }
        }
    }["useStreamingChat.useCallback[sendMessage]"], [
        messages,
        isStreaming,
        model,
        themeContext,
        onStreamStart,
        onStreamEnd,
        onError
    ]);
    const clearMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStreamingChat.useCallback[clearMessages]": ()=>{
            setMessages([]);
            setError(null);
            setActiveToolCalls([]);
        }
    }["useStreamingChat.useCallback[clearMessages]"], []);
    const abortStream = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStreamingChat.useCallback[abortStream]": ()=>{
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        }
    }["useStreamingChat.useCallback[abortStream]"], []);
    return {
        messages,
        isStreaming,
        error,
        activeToolCalls,
        sendMessage,
        clearMessages,
        setMessages,
        abortStream
    };
}
_s(useStreamingChat, "/qqC3YXtc6q44ecE7KkC3GjKaRg=");
const __TURBOPACK__default__export__ = useStreamingChat;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useMusicGeneration.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MUSIC_PRESETS",
    ()=>MUSIC_PRESETS,
    "useMusicGeneration",
    ()=>useMusicGeneration
]);
/**
 * useMusicGeneration Hook
 *
 * Provides music generation capabilities via local ACE-Step through Lynkr tunnel.
 * Handles generation, analysis, and stem separation with progress tracking.
 * Persists jobs and tracks to Convex for history and library features.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/openclaw/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/convex-shim.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
function useMusicGeneration() {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        status: 'idle',
        progress: 0,
        message: '',
        result: null,
        error: null
    });
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const currentJobIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Convex mutations for job persistence
    const createJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].musicGeneration.createJob);
    const startJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].musicGeneration.startJob);
    const completeJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].musicGeneration.completeJob);
    const failJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].musicGeneration.failJob);
    /**
   * Check if ACE-Step is available
   */ const checkAvailability = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMusicGeneration.useCallback[checkAvailability]": async ()=>{
            try {
                const response = await fetch('/api/music/generate', {
                    method: 'GET'
                });
                return await response.json();
            } catch  {
                return {
                    available: false,
                    reason: 'Connection failed'
                };
            }
        }
    }["useMusicGeneration.useCallback[checkAvailability]"], []);
    /**
   * Generate music from prompt and optional lyrics
   * Now persists jobs to Convex for history and library features
   */ const generate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMusicGeneration.useCallback[generate]": async (params)=>{
            // Cancel any in-progress generation
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();
            setState({
                status: 'generating',
                progress: 0,
                message: 'Starting music generation...',
                result: null,
                error: null
            });
            try {
                // Create job in Convex for tracking and history
                let jobId = null;
                try {
                    jobId = await createJob({
                        prompt: params.prompt,
                        lyrics: params.lyrics,
                        duration: params.duration || 30,
                        bpm: params.bpm,
                        key: params.key,
                        timeSignature: params.timeSignature,
                        title: params.title
                    });
                    currentJobIdRef.current = jobId;
                    // Mark as processing
                    await startJob({
                        jobId
                    });
                } catch (convexError) {
                    // If not authenticated, continue without Convex persistence
                    console.warn('[useMusicGeneration] Convex job creation failed (user may not be authenticated):', convexError);
                }
                // Simulate progress updates (ACE-Step doesn't stream progress)
                const progressInterval = setInterval({
                    "useMusicGeneration.useCallback[generate].progressInterval": ()=>{
                        setState({
                            "useMusicGeneration.useCallback[generate].progressInterval": (prev)=>{
                                if (prev.status !== 'generating') return prev;
                                const newProgress = Math.min(prev.progress + Math.random() * 15, 90);
                                return {
                                    ...prev,
                                    progress: newProgress,
                                    message: getProgressMessage(newProgress)
                                };
                            }
                        }["useMusicGeneration.useCallback[generate].progressInterval"]);
                    }
                }["useMusicGeneration.useCallback[generate].progressInterval"], 2000);
                const response = await fetch('/api/music/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...params,
                        action: 'generate'
                    }),
                    signal: abortControllerRef.current.signal
                });
                clearInterval(progressInterval);
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Generation failed');
                }
                const result = await response.json();
                // Complete the job in Convex with results
                if (jobId && result.audioUrl) {
                    try {
                        await completeJob({
                            jobId,
                            audioUrl: result.audioUrl,
                            metadata: {
                                actualBpm: result.metadata.bpm,
                                actualKey: result.metadata.key,
                                actualDuration: result.duration,
                                model: result.metadata.model,
                                lmModel: result.metadata.lmModel
                            }
                        });
                    } catch (convexError) {
                        console.warn('[useMusicGeneration] Convex job completion failed:', convexError);
                    }
                }
                setState({
                    status: 'completed',
                    progress: 100,
                    message: 'Music generated successfully!',
                    result,
                    error: null
                });
                return result;
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    setState({
                        "useMusicGeneration.useCallback[generate]": (prev)=>({
                                ...prev,
                                status: 'idle',
                                progress: 0,
                                message: 'Generation cancelled'
                            })
                    }["useMusicGeneration.useCallback[generate]"]);
                    return null;
                }
                const errorMessage = error instanceof Error ? error.message : 'Generation failed';
                // Mark job as failed in Convex
                if (currentJobIdRef.current) {
                    try {
                        await failJob({
                            jobId: currentJobIdRef.current,
                            error: errorMessage
                        });
                    } catch (convexError) {
                        console.warn('[useMusicGeneration] Convex job failure recording failed:', convexError);
                    }
                }
                setState({
                    status: 'error',
                    progress: 0,
                    message: errorMessage,
                    result: null,
                    error: errorMessage
                });
                return null;
            }
        }
    }["useMusicGeneration.useCallback[generate]"], [
        createJob,
        startJob,
        completeJob,
        failJob
    ]);
    /**
   * Analyze audio to extract BPM, key, etc.
   */ const analyze = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMusicGeneration.useCallback[analyze]": async (audioUrl, extract)=>{
            setState({
                status: 'analyzing',
                progress: 50,
                message: 'Analyzing audio...',
                result: null,
                error: null
            });
            try {
                const response = await fetch('/api/music/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'analyze',
                        audioUrl,
                        extract: extract || [
                            'bpm',
                            'key',
                            'time_signature',
                            'caption'
                        ]
                    })
                });
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Analysis failed');
                }
                const result = await response.json();
                setState({
                    status: 'completed',
                    progress: 100,
                    message: 'Analysis complete!',
                    result: null,
                    error: null
                });
                return result;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
                setState({
                    status: 'error',
                    progress: 0,
                    message: errorMessage,
                    result: null,
                    error: errorMessage
                });
                return null;
            }
        }
    }["useMusicGeneration.useCallback[analyze]"], []);
    /**
   * Separate audio into stems (vocals, drums, bass, other)
   */ const separateStems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMusicGeneration.useCallback[separateStems]": async (audioUrl, stems)=>{
            setState({
                status: 'separating',
                progress: 30,
                message: 'Separating stems...',
                result: null,
                error: null
            });
            try {
                const response = await fetch('/api/music/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'separate',
                        audioUrl,
                        stems: stems || [
                            'vocals',
                            'drums',
                            'bass',
                            'other'
                        ]
                    })
                });
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Stem separation failed');
                }
                const result = await response.json();
                setState({
                    status: 'completed',
                    progress: 100,
                    message: 'Stems separated!',
                    result: null,
                    error: null
                });
                return result;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Stem separation failed';
                setState({
                    status: 'error',
                    progress: 0,
                    message: errorMessage,
                    result: null,
                    error: errorMessage
                });
                return null;
            }
        }
    }["useMusicGeneration.useCallback[separateStems]"], []);
    /**
   * Cancel in-progress generation
   */ const cancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMusicGeneration.useCallback[cancel]": ()=>{
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        }
    }["useMusicGeneration.useCallback[cancel]"], []);
    /**
   * Reset state
   */ const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMusicGeneration.useCallback[reset]": ()=>{
            cancel();
            setState({
                status: 'idle',
                progress: 0,
                message: '',
                result: null,
                error: null
            });
        }
    }["useMusicGeneration.useCallback[reset]"], [
        cancel
    ]);
    return {
        // State
        ...state,
        isGenerating: state.status === 'generating',
        isAnalyzing: state.status === 'analyzing',
        isSeparating: state.status === 'separating',
        isProcessing: [
            'generating',
            'analyzing',
            'separating'
        ].includes(state.status),
        // Actions
        generate,
        analyze,
        separateStems,
        checkAvailability,
        cancel,
        reset
    };
}
_s(useMusicGeneration, "+tiv6zKRq/qReNU4wHwNwSwihvA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
// ============================================================================
// Helpers
// ============================================================================
function getProgressMessage(progress) {
    if (progress < 20) return 'Initializing models...';
    if (progress < 40) return 'Processing prompt...';
    if (progress < 60) return 'Generating audio...';
    if (progress < 80) return 'Applying effects...';
    return 'Finalizing...';
}
const MUSIC_PRESETS = {
    podcastIntro: {
        prompt: 'upbeat professional podcast intro, modern electronic, clean production',
        duration: 15,
        bpm: 120,
        key: 'C major'
    },
    lofi: {
        prompt: 'lo-fi hip hop study beats, vinyl crackle, mellow piano, soft drums, rainy day mood',
        duration: 120,
        bpm: 85,
        key: 'F major'
    },
    epicTrailer: {
        prompt: 'cinematic orchestral trailer music, building tension, brass swells, timpani, heroic',
        duration: 60,
        bpm: 90,
        key: 'D minor'
    },
    ambient: {
        prompt: 'peaceful ambient soundscape, soft pads, nature sounds, meditation music',
        duration: 180,
        bpm: 60,
        key: 'A minor'
    },
    edm: {
        prompt: 'high energy EDM, festival drop, punchy kick, saw wave lead, side-chain compression',
        duration: 180,
        bpm: 128,
        key: 'F minor'
    },
    acoustic: {
        prompt: 'warm acoustic folk, fingerpicked guitar, soft vocals, campfire vibes',
        duration: 120,
        bpm: 100,
        key: 'G major'
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_d46b9f01._.js.map