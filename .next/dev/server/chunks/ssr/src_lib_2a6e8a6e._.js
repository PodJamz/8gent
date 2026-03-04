module.exports = [
"[project]/src/lib/watch/watch-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/lib/watch/theme-to-watch.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$definitions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/themes/definitions.ts [app-ssr] (ecmascript)");
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$definitions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["themes"].map((t)=>themeToWatch(t.name));
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
}),
"[project]/src/lib/gallery-images.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/lib/skills-registry.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Skills Registry - Complete catalog of all Claw AI capabilities
// Each skill is represented as a collectible game card
__turbopack_context__.s([
    "CATEGORY_INFO",
    ()=>CATEGORY_INFO,
    "RARITY_INFO",
    ()=>RARITY_INFO,
    "SKILLS_REGISTRY",
    ()=>SKILLS_REGISTRY,
    "getSkillById",
    ()=>getSkillById,
    "getSkillsByCategory",
    ()=>getSkillsByCategory,
    "getSkillsByRarity",
    ()=>getSkillsByRarity,
    "searchSkills",
    ()=>searchSkills
]);
const SKILLS_REGISTRY = [
    // ==========================================================================
    // AUTOMATION SKILLS
    // ==========================================================================
    {
        id: 'browser-automation',
        name: 'Browser Automation',
        shortName: 'Browser',
        description: 'Control headless browsers to navigate, interact, and extract data from web pages',
        longDescription: 'Powered by Vercel Labs agent-browser, this skill enables Claw AI to control Chromium browsers programmatically. Navigate to any URL, interact with elements using accessibility tree refs, fill forms, take screenshots, and extract data. Perfect for web scraping, testing, and automated workflows.',
        category: 'automation',
        rarity: 'epic',
        icon: 'Globe',
        gradient: 'from-blue-500 via-cyan-500 to-teal-500',
        accentColor: '195 80% 50%',
        tags: [
            'web',
            'scraping',
            'testing',
            'chromium',
            'playwright'
        ],
        stats: {
            power: 90,
            complexity: 70,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'open',
                syntax: 'agent-browser open <url>',
                description: 'Navigate to URL'
            },
            {
                name: 'snapshot',
                syntax: 'agent-browser snapshot',
                description: 'Get accessibility tree'
            },
            {
                name: 'click',
                syntax: 'agent-browser click <selector>',
                description: 'Click element'
            },
            {
                name: 'fill',
                syntax: 'agent-browser fill <selector> <text>',
                description: 'Fill input field'
            },
            {
                name: 'screenshot',
                syntax: 'agent-browser screenshot [path]',
                description: 'Capture screenshot'
            },
            {
                name: 'close',
                syntax: 'agent-browser close',
                description: 'End browser session'
            }
        ],
        dependencies: [
            {
                name: 'agent-browser',
                type: 'cli',
                installCommand: 'npm install -g @anthropic/agent-browser',
                url: 'https://github.com/vercel-labs/agent-browser'
            }
        ],
        source: {
            author: 'Vercel Labs',
            url: 'https://github.com/vercel-labs/agent-browser',
            license: 'MIT'
        }
    },
    {
        id: 'file-system',
        name: 'File System Operations',
        shortName: 'Files',
        description: 'Read, write, search, and manage files in the project',
        longDescription: 'Core file manipulation capabilities including reading file contents, writing and editing files, searching with grep and find, managing directories, and integrating with git for version control. The foundation for any code modification task.',
        category: 'automation',
        rarity: 'common',
        icon: 'FolderOpen',
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        accentColor: '30 90% 50%',
        tags: [
            'files',
            'directories',
            'search',
            'git',
            'shell'
        ],
        stats: {
            power: 70,
            complexity: 30,
            utility: 100
        },
        defaultMode: 'on',
        commands: [
            {
                name: 'read',
                syntax: 'cat <file_path>',
                description: 'Read file contents'
            },
            {
                name: 'write',
                syntax: 'echo "content" > <file>',
                description: 'Write to file'
            },
            {
                name: 'list',
                syntax: 'ls -la <path>',
                description: 'List directory'
            },
            {
                name: 'find',
                syntax: 'find <path> -name "<pattern>"',
                description: 'Find files'
            },
            {
                name: 'search',
                syntax: 'grep -r "<pattern>" <path>',
                description: 'Search contents'
            }
        ],
        dependencies: [
            {
                name: 'bash',
                type: 'native'
            },
            {
                name: 'git',
                type: 'cli'
            }
        ]
    },
    {
        id: 'code-execution',
        name: 'Code Execution',
        shortName: 'Execute',
        description: 'Run commands, scripts, builds, and tests',
        longDescription: 'Execute shell commands, run npm scripts, manage packages, and control the development environment. Essential for building, testing, and deploying code. Supports Node.js, npm, git, and arbitrary shell execution.',
        category: 'automation',
        rarity: 'common',
        icon: 'Terminal',
        gradient: 'from-green-500 via-emerald-500 to-teal-500',
        accentColor: '150 70% 45%',
        tags: [
            'shell',
            'npm',
            'node',
            'scripts',
            'testing'
        ],
        stats: {
            power: 80,
            complexity: 40,
            utility: 95
        },
        defaultMode: 'on',
        commands: [
            {
                name: 'install',
                syntax: 'npm install [package]',
                description: 'Install dependencies'
            },
            {
                name: 'run',
                syntax: 'npm run <script>',
                description: 'Run npm scripts'
            },
            {
                name: 'git',
                syntax: 'git <command>',
                description: 'Git operations'
            },
            {
                name: 'exec',
                syntax: '<command>',
                description: 'Execute shell command'
            }
        ],
        dependencies: [
            {
                name: 'node',
                type: 'cli'
            },
            {
                name: 'npm',
                type: 'cli'
            }
        ]
    },
    // ==========================================================================
    // MANAGEMENT SKILLS
    // ==========================================================================
    {
        id: 'product-lifecycle',
        name: 'Product Lifecycle Management',
        shortName: 'Lifecycle',
        description: 'Orchestrate full product development from discovery to launch',
        longDescription: 'Based on BMAD-METHOD for PRDs and CCPM for parallel execution. Create projects, write Product Requirements Documents, generate Kanban tickets, and track progress through the entire product development lifecycle. AI-orchestrated project management.',
        category: 'management',
        rarity: 'legendary',
        icon: 'Sparkles',
        gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
        accentColor: '270 80% 60%',
        tags: [
            'prd',
            'kanban',
            'agile',
            'planning',
            'bmad'
        ],
        stats: {
            power: 95,
            complexity: 60,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'create_project',
                syntax: 'create_project <name> [desc]',
                description: 'Create product project'
            },
            {
                name: 'create_prd',
                syntax: 'create_prd <project_id> <title>',
                description: 'Create PRD document'
            },
            {
                name: 'create_ticket',
                syntax: 'create_ticket <project_id> <title>',
                description: 'Create Kanban ticket'
            },
            {
                name: 'shard_prd',
                syntax: 'shard_prd <prd_id> <project_id>',
                description: 'Convert PRD to tickets'
            },
            {
                name: 'get_kanban',
                syntax: 'get_project_kanban <id>',
                description: 'Display Kanban board'
            }
        ],
        dependencies: [
            {
                name: 'convex',
                type: 'npm',
                url: 'https://convex.dev'
            }
        ],
        source: {
            author: 'Claw AI',
            license: 'Proprietary'
        }
    },
    {
        id: 'project-management',
        name: 'Project Management',
        shortName: 'Projects',
        description: 'Plan projects, create issues, track progress, manage sprints',
        longDescription: 'Comprehensive project planning and issue tracking for development workflows. Create and organize GitHub issues, plan sprints, break down work into actionable tasks, and coordinate development across teams.',
        category: 'management',
        rarity: 'rare',
        icon: 'ClipboardList',
        gradient: 'from-sky-500 via-blue-500 to-indigo-500',
        accentColor: '210 80% 55%',
        tags: [
            'github',
            'issues',
            'sprints',
            'tracking',
            'planning'
        ],
        stats: {
            power: 75,
            complexity: 45,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'plan',
                syntax: '/plan <description>',
                description: 'Plan project implementation'
            },
            {
                name: 'create_issue',
                syntax: 'gh issue create',
                description: 'Create GitHub issue'
            },
            {
                name: 'track',
                syntax: '/track <project>',
                description: 'Track project progress'
            }
        ],
        dependencies: [
            {
                name: 'gh',
                type: 'cli',
                url: 'https://cli.github.com'
            }
        ]
    },
    // ==========================================================================
    // DESIGN SKILLS
    // ==========================================================================
    {
        id: 'design-excellence',
        name: 'Design Excellence',
        shortName: 'Design',
        description: 'God-mode design system for phenomenal interfaces',
        longDescription: 'Master-level design principles covering grid systems, color palettes, typography hierarchy, and interaction design. Includes three distinct aesthetics: Retro-Futuristic Industrial, Modern Minimalist, and Editorial Classic. Transform any UI into a next-level experience.',
        category: 'design',
        rarity: 'legendary',
        icon: 'Paintbrush',
        gradient: 'from-pink-500 via-rose-500 to-red-500',
        accentColor: '340 80% 55%',
        tags: [
            'ui',
            'ux',
            'aesthetics',
            'grids',
            'typography'
        ],
        stats: {
            power: 95,
            complexity: 55,
            utility: 90
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'design',
                syntax: 'Create UI following principles',
                description: 'Apply design excellence'
            }
        ],
        dependencies: [],
        source: {
            author: 'Claw AI',
            license: 'Proprietary'
        }
    },
    {
        id: 'interface-craft',
        name: 'Interface Craft',
        shortName: 'Craft',
        description: 'Building software that respects users through intentional design',
        longDescription: 'The art of interface craftsmanship: clarity first, structure before style, intentional details, and systematic beauty. Covers all 8 essential states (default, hover, focus, active, disabled, loading, error, success), feedback loops, and progressive disclosure.',
        category: 'design',
        rarity: 'epic',
        icon: 'Layers',
        gradient: 'from-slate-400 via-zinc-500 to-stone-600',
        accentColor: '220 10% 50%',
        tags: [
            'states',
            'feedback',
            'polish',
            'accessibility'
        ],
        stats: {
            power: 85,
            complexity: 50,
            utility: 88
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Josh Puckett',
            url: 'https://www.interfacecraft.dev/'
        }
    },
    {
        id: 'ios-excellence',
        name: 'iOS Excellence',
        shortName: 'iOS',
        description: 'Opinionated constraints for iOS-quality interfaces',
        longDescription: 'Build interfaces that meet Apple Human Interface Guidelines standards. Covers SF Pro typography, Dynamic Type, 8pt grid system, touch targets (44x44pt minimum), gesture patterns, VoiceOver accessibility, and 60fps scrolling performance.',
        category: 'design',
        rarity: 'epic',
        icon: 'Smartphone',
        gradient: 'from-gray-800 via-gray-700 to-gray-600',
        accentColor: '0 0% 40%',
        tags: [
            'apple',
            'hig',
            'mobile',
            'touch',
            'gestures'
        ],
        stats: {
            power: 88,
            complexity: 60,
            utility: 75
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Apple HIG',
            url: 'https://developer.apple.com/design/human-interface-guidelines/'
        }
    },
    {
        id: 'motion-design',
        name: 'Motion Design',
        shortName: 'Motion',
        description: 'Motion is communication, not decoration',
        longDescription: 'The 12 principles of animation applied to UI: timing (100-500ms), easing (ease-out for entrances, ease-in for exits), anticipation, follow-through, and exaggeration. Only animate transform and opacity for performance. Respects prefers-reduced-motion.',
        category: 'design',
        rarity: 'rare',
        icon: 'Play',
        gradient: 'from-yellow-400 via-amber-500 to-orange-500',
        accentColor: '40 90% 50%',
        tags: [
            'animation',
            'framer',
            'transitions',
            'spring'
        ],
        stats: {
            power: 75,
            complexity: 55,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [
            {
                name: 'framer-motion',
                type: 'npm',
                url: 'https://www.framer.com/motion/'
            }
        ],
        source: {
            author: 'Disney Animation Principles'
        }
    },
    {
        id: 'accessibility-review',
        name: 'Accessibility Review',
        shortName: 'A11y',
        description: 'Review interfaces for accessibility issues and visual polish',
        longDescription: 'Comprehensive accessibility auditing covering WCAG guidelines. Checks for missing accessible names, keyboard navigation, color contrast, focus indicators, skip links, form errors, alt text, and touch targets. Severity scoring from Critical to Minor.',
        category: 'design',
        rarity: 'rare',
        icon: 'Accessibility',
        gradient: 'from-blue-600 via-indigo-600 to-violet-600',
        accentColor: '240 70% 55%',
        tags: [
            'wcag',
            'aria',
            'keyboard',
            'contrast',
            'screenreader'
        ],
        stats: {
            power: 80,
            complexity: 45,
            utility: 92
        },
        defaultMode: 'on',
        commands: [
            {
                name: 'review',
                syntax: '/review-ui',
                description: 'Run accessibility audit'
            }
        ],
        dependencies: [
            {
                name: 'axe-core',
                type: 'npm',
                url: 'https://www.deque.com/axe/'
            }
        ],
        source: {
            author: 'Deque / WebAIM',
            url: 'https://www.w3.org/WAI/WCAG21/quickref/'
        }
    },
    {
        id: 'design-engineer',
        name: 'Design Engineer',
        shortName: 'Engineer',
        description: 'Bridge between design and code',
        longDescription: 'Design engineering philosophy: reduce until clear, refine until right. Intention over decoration, feel over appearance. Code is the design tool, iterate in browser not Figma. The full workflow: Understand, Explore, Build, Refine, Ship.',
        category: 'design',
        rarity: 'epic',
        icon: 'PenTool',
        gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
        accentColor: '170 70% 45%',
        tags: [
            'implementation',
            'iteration',
            'prototyping'
        ],
        stats: {
            power: 85,
            complexity: 65,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Flo Guo',
            url: 'https://www.ui-skills.com/'
        }
    },
    // ==========================================================================
    // DEVELOPMENT SKILLS
    // ==========================================================================
    {
        id: 'vercel-react',
        name: 'Vercel React Best Practices',
        shortName: 'React',
        description: 'React and Next.js performance optimization from Vercel Engineering',
        longDescription: '45 optimization rules across 8 categories: eliminating waterfalls, bundle size optimization, server-side performance, client-side data fetching, re-render optimization, rendering performance, JavaScript performance, and advanced patterns.',
        category: 'development',
        rarity: 'epic',
        icon: 'Zap',
        gradient: 'from-white via-gray-200 to-gray-400',
        accentColor: '0 0% 90%',
        tags: [
            'nextjs',
            'performance',
            'ssr',
            'optimization',
            'bundle'
        ],
        stats: {
            power: 90,
            complexity: 70,
            utility: 88
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [
            {
                name: 'next',
                type: 'npm',
                url: 'https://nextjs.org'
            },
            {
                name: 'react',
                type: 'npm',
                url: 'https://react.dev'
            }
        ],
        source: {
            author: 'Vercel Engineering',
            url: 'https://vercel.com',
            license: 'MIT',
            version: '1.0.0'
        }
    },
    {
        id: 'web-guidelines',
        name: 'Web Design Guidelines',
        shortName: 'Web',
        description: 'Review UI code for Web Interface Guidelines compliance',
        longDescription: 'Fetches and applies the latest Web Interface Guidelines from Vercel Labs. Comprehensive review of UI implementations for best practices compliance covering layout, interaction, and visual design patterns.',
        category: 'development',
        rarity: 'rare',
        icon: 'BookOpen',
        gradient: 'from-indigo-500 via-purple-500 to-pink-500',
        accentColor: '260 70% 55%',
        tags: [
            'guidelines',
            'review',
            'standards',
            'compliance'
        ],
        stats: {
            power: 70,
            complexity: 35,
            utility: 78
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'review',
                syntax: '/web-review',
                description: 'Check guidelines compliance'
            }
        ],
        dependencies: [],
        source: {
            author: 'Vercel Labs',
            url: 'https://github.com/vercel-labs/web-interface-guidelines'
        }
    },
    {
        id: 'ui-skills',
        name: 'UI Skills',
        shortName: 'UI',
        description: 'Opinionated constraints for better interfaces',
        longDescription: 'Tailwind CSS defaults (spacing, radius, shadows), accessible component primitives (Base UI, React Aria, Radix), animation rules (200ms max for feedback, ease-out for entrances), typography hierarchy, and performance constraints.',
        category: 'development',
        rarity: 'uncommon',
        icon: 'Layout',
        gradient: 'from-teal-500 via-cyan-500 to-sky-500',
        accentColor: '190 70% 50%',
        tags: [
            'tailwind',
            'components',
            'primitives',
            'radix'
        ],
        stats: {
            power: 70,
            complexity: 40,
            utility: 85
        },
        defaultMode: 'on',
        commands: [],
        dependencies: [
            {
                name: 'tailwindcss',
                type: 'npm'
            },
            {
                name: '@radix-ui/react-*',
                type: 'npm',
                url: 'https://www.radix-ui.com'
            }
        ],
        source: {
            author: 'UI Skills',
            url: 'https://www.ui-skills.com/'
        }
    },
    // ==========================================================================
    // CREATIVE SKILLS
    // ==========================================================================
    {
        id: 'clone-react',
        name: 'Clone React',
        shortName: 'Clone',
        description: 'Extract React components visually from any website',
        longDescription: 'Electron-powered visual component extraction. Opens target URL with inspector, click any element to extract its React Fiber tree, DOM structure, and computed CSS. Generates production-ready React component files with TypeScript.',
        category: 'creative',
        rarity: 'legendary',
        icon: 'Copy',
        gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
        accentColor: '330 80% 55%',
        tags: [
            'extraction',
            'reverse-engineering',
            'components',
            'electron'
        ],
        stats: {
            power: 92,
            complexity: 50,
            utility: 70
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'clone',
                syntax: 'npx cluso-inspector <url>',
                description: 'Open visual inspector'
            }
        ],
        dependencies: [
            {
                name: 'cluso-inspector',
                type: 'cli',
                installCommand: 'npx cluso-inspector',
                url: 'https://github.com/jasonkneen/clone-react-skill'
            }
        ],
        source: {
            author: 'Jason Kneen',
            url: 'https://github.com/jasonkneen/clone-react-skill',
            license: 'MIT',
            version: '1.0.1'
        }
    },
    // ==========================================================================
    // BACKEND & API SKILLS
    // ==========================================================================
    {
        id: 'convex-backend',
        name: 'Convex Backend',
        shortName: 'Convex',
        description: 'Real-time serverless backend with TypeScript',
        longDescription: 'Full-stack TypeScript backend powered by Convex. Reactive queries that update in real-time, mutations with automatic ACID transactions, scheduled functions, file storage, and built-in authentication. No infrastructure to manage, just write TypeScript.',
        category: 'development',
        rarity: 'epic',
        icon: 'Zap',
        gradient: 'from-orange-500 via-red-500 to-pink-500',
        accentColor: '15 90% 55%',
        tags: [
            'database',
            'serverless',
            'realtime',
            'typescript',
            'mutations'
        ],
        stats: {
            power: 92,
            complexity: 55,
            utility: 90
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'query',
                syntax: 'query({ ... })',
                description: 'Define reactive query'
            },
            {
                name: 'mutation',
                syntax: 'mutation({ ... })',
                description: 'Define state mutation'
            },
            {
                name: 'action',
                syntax: 'action({ ... })',
                description: 'Define external action'
            },
            {
                name: 'schema',
                syntax: 'defineSchema({ ... })',
                description: 'Define data schema'
            }
        ],
        dependencies: [
            {
                name: 'convex',
                type: 'npm',
                url: 'https://convex.dev'
            }
        ],
        source: {
            author: 'Convex',
            url: 'https://convex.dev',
            license: 'Apache-2.0'
        }
    },
    {
        id: 'api-integration',
        name: 'API Integration',
        shortName: 'APIs',
        description: 'Connect to external APIs and services',
        longDescription: 'Integrate with external REST APIs, GraphQL endpoints, and third-party services. Handle authentication (OAuth, API keys, JWT), rate limiting, error handling, and response parsing. Build robust integrations with retry logic and caching.',
        category: 'development',
        rarity: 'rare',
        icon: 'Globe',
        gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
        accentColor: '200 80% 50%',
        tags: [
            'rest',
            'graphql',
            'oauth',
            'webhooks',
            'fetch'
        ],
        stats: {
            power: 85,
            complexity: 50,
            utility: 92
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'fetch',
                syntax: 'fetch(url, options)',
                description: 'Make HTTP request'
            },
            {
                name: 'graphql',
                syntax: 'query { ... }',
                description: 'Execute GraphQL query'
            }
        ],
        dependencies: []
    },
    {
        id: 'database-operations',
        name: 'Database Operations',
        shortName: 'Database',
        description: 'Design schemas, write queries, manage data',
        longDescription: 'Database design and management including schema design, indexing strategies, query optimization, migrations, and data modeling. Supports SQL databases (PostgreSQL, MySQL), NoSQL (MongoDB, Convex), and key-value stores (Redis).',
        category: 'development',
        rarity: 'rare',
        icon: 'Terminal',
        gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
        accentColor: '170 70% 45%',
        tags: [
            'sql',
            'nosql',
            'schema',
            'migrations',
            'queries'
        ],
        stats: {
            power: 88,
            complexity: 65,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'schema',
                syntax: 'CREATE TABLE ...',
                description: 'Define table schema'
            },
            {
                name: 'query',
                syntax: 'SELECT ... FROM ...',
                description: 'Query data'
            },
            {
                name: 'index',
                syntax: 'CREATE INDEX ...',
                description: 'Create index'
            }
        ],
        dependencies: []
    },
    {
        id: 'authentication',
        name: 'Authentication & Auth',
        shortName: 'Auth',
        description: 'User authentication and authorization patterns',
        longDescription: 'Implement secure authentication flows including OAuth 2.0, JWT tokens, session management, role-based access control (RBAC), and multi-factor authentication. Integrates with providers like Clerk, Auth0, NextAuth, and custom solutions.',
        category: 'development',
        rarity: 'epic',
        icon: 'Lock',
        gradient: 'from-violet-500 via-purple-500 to-indigo-500',
        accentColor: '260 70% 55%',
        tags: [
            'oauth',
            'jwt',
            'rbac',
            'clerk',
            'security'
        ],
        stats: {
            power: 90,
            complexity: 70,
            utility: 88
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'protect',
                syntax: '@requireAuth()',
                description: 'Protect route/endpoint'
            },
            {
                name: 'roles',
                syntax: 'hasRole("admin")',
                description: 'Check user role'
            }
        ],
        dependencies: [
            {
                name: '@clerk/nextjs',
                type: 'npm',
                url: 'https://clerk.com'
            }
        ],
        source: {
            author: 'Various',
            url: 'https://clerk.com'
        }
    },
    {
        id: 'testing-skill',
        name: 'Testing & QA',
        shortName: 'Testing',
        description: 'Write and run tests for code quality assurance',
        longDescription: 'Comprehensive testing capabilities including unit tests, integration tests, end-to-end tests, and component tests. Supports Jest, Vitest, Playwright, Cypress, and React Testing Library. Test-driven development and coverage reporting.',
        category: 'development',
        rarity: 'rare',
        icon: 'Terminal',
        gradient: 'from-green-500 via-emerald-500 to-teal-500',
        accentColor: '150 70% 45%',
        tags: [
            'jest',
            'vitest',
            'playwright',
            'tdd',
            'coverage'
        ],
        stats: {
            power: 80,
            complexity: 50,
            utility: 90
        },
        defaultMode: 'on',
        commands: [
            {
                name: 'test',
                syntax: 'npm run test',
                description: 'Run test suite'
            },
            {
                name: 'e2e',
                syntax: 'npx playwright test',
                description: 'Run E2E tests'
            }
        ],
        dependencies: [
            {
                name: 'vitest',
                type: 'npm',
                url: 'https://vitest.dev'
            },
            {
                name: '@playwright/test',
                type: 'npm',
                url: 'https://playwright.dev'
            }
        ]
    },
    // ==========================================================================
    // ANTHROPIC OFFICIAL SKILLS (from github.com/anthropics/skills)
    // Original Author: Anthropic | License: Apache 2.0 (except document skills: source-available)
    // Forked for reference: github.com/PodJamz/skills
    // ==========================================================================
    {
        id: 'algorithmic-art',
        name: 'Algorithmic Art',
        shortName: 'Art',
        description: 'Generate procedural and algorithmic artwork',
        longDescription: 'Create stunning algorithmic and generative art using mathematical patterns, fractals, and procedural generation techniques. Supports SVG output, canvas rendering, and various artistic styles from geometric patterns to organic simulations.',
        category: 'creative',
        rarity: 'epic',
        icon: 'Paintbrush',
        gradient: 'from-pink-500 via-purple-500 to-indigo-500',
        accentColor: '280 70% 55%',
        tags: [
            'generative',
            'procedural',
            'svg',
            'canvas',
            'fractals'
        ],
        stats: {
            power: 85,
            complexity: 60,
            utility: 70
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Anthropic',
            url: 'https://github.com/anthropics/skills',
            license: 'Apache-2.0'
        }
    },
    {
        id: 'brand-guidelines',
        name: 'Brand Guidelines',
        shortName: 'Brand',
        description: 'Create and maintain brand identity systems',
        longDescription: 'Develop comprehensive brand guidelines including logo usage, color palettes, typography systems, voice and tone, and visual identity standards. Generate brand books and style guides for consistent brand application.',
        category: 'creative',
        rarity: 'rare',
        icon: 'Paintbrush',
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        accentColor: '25 85% 55%',
        tags: [
            'branding',
            'identity',
            'style-guide',
            'design-system'
        ],
        stats: {
            power: 75,
            complexity: 45,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Anthropic',
            url: 'https://github.com/anthropics/skills',
            license: 'Apache-2.0'
        }
    },
    {
        id: 'canvas-design',
        name: 'Canvas Design',
        shortName: 'Canvas',
        description: 'Design and create visual compositions',
        longDescription: 'Create visual designs and compositions using canvas-based tools. Supports layout design, visual mockups, and creative compositions with full control over elements, layers, and visual hierarchy.',
        category: 'creative',
        rarity: 'rare',
        icon: 'Layers',
        gradient: 'from-cyan-500 via-blue-500 to-purple-500',
        accentColor: '220 75% 55%',
        tags: [
            'design',
            'canvas',
            'mockup',
            'visual',
            'composition'
        ],
        stats: {
            power: 80,
            complexity: 50,
            utility: 75
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Anthropic',
            url: 'https://github.com/anthropics/skills',
            license: 'Apache-2.0'
        }
    },
    {
        id: 'doc-coauthoring',
        name: 'Document Co-Authoring',
        shortName: 'Co-Author',
        description: 'Collaborative document writing and editing',
        longDescription: 'Real-time collaborative document authoring with AI assistance. Draft, edit, review, and refine documents together. Supports version tracking, suggestions, comments, and iterative refinement workflows.',
        category: 'creative',
        rarity: 'epic',
        icon: 'PenTool',
        gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
        accentColor: '170 70% 50%',
        tags: [
            'writing',
            'collaboration',
            'editing',
            'documents'
        ],
        stats: {
            power: 88,
            complexity: 40,
            utility: 92
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Anthropic',
            url: 'https://github.com/anthropics/skills',
            license: 'Apache-2.0'
        }
    },
    {
        id: 'docx-skill',
        name: 'DOCX Document Creation',
        shortName: 'DOCX',
        description: 'Create and edit Microsoft Word documents',
        longDescription: 'Generate and manipulate DOCX files programmatically. Create formatted documents with headings, tables, images, styles, and complex layouts. Powers Claude\'s native document creation capabilities.',
        category: 'automation',
        rarity: 'epic',
        icon: 'BookOpen',
        gradient: 'from-blue-600 via-blue-500 to-cyan-500',
        accentColor: '210 80% 50%',
        tags: [
            'word',
            'documents',
            'office',
            'formatting'
        ],
        stats: {
            power: 90,
            complexity: 55,
            utility: 95
        },
        defaultMode: 'on',
        commands: [],
        dependencies: [],
        source: {
            author: 'Anthropic',
            url: 'https://github.com/anthropics/skills',
            license: 'Source-Available'
        }
    },
    {
        id: 'frontend-design',
        name: 'Frontend Design',
        shortName: 'Frontend',
        description: 'Design and build frontend user interfaces',
        longDescription: 'Create beautiful, responsive frontend designs with modern CSS, component architecture, and design systems. Covers layout, typography, color, spacing, and interaction design for web applications.',
        category: 'design',
        rarity: 'epic',
        icon: 'Layout',
        gradient: 'from-violet-500 via-purple-500 to-pink-500',
        accentColor: '270 70% 55%',
        tags: [
            'ui',
            'css',
            'responsive',
            'components',
            'web'
        ],
        stats: {
            power: 88,
            complexity: 55,
            utility: 90
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Anthropic',
            url: 'https://github.com/anthropics/skills',
            license: 'Apache-2.0'
        }
    },
    {
        id: 'internal-comms',
        name: 'Internal Communications',
        shortName: 'Comms',
        description: 'Draft internal company communications',
        longDescription: 'Create professional internal communications including announcements, memos, newsletters, all-hands presentations, and team updates. Follows enterprise communication best practices and tone guidelines.',
        category: 'management',
        rarity: 'uncommon',
        icon: 'ClipboardList',
        gradient: 'from-slate-500 via-gray-500 to-zinc-500',
        accentColor: '220 10% 50%',
        tags: [
            'enterprise',
            'communications',
            'memos',
            'announcements'
        ],
        stats: {
            power: 70,
            complexity: 30,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Anthropic',
            url: 'https://github.com/anthropics/skills',
            license: 'Apache-2.0'
        }
    },
    {
        id: 'mcp-builder',
        name: 'MCP Server Builder',
        shortName: 'MCP',
        description: 'Build Model Context Protocol servers',
        longDescription: 'Create custom MCP (Model Context Protocol) servers that extend Claude\'s capabilities. Build tools, resources, and prompts that integrate with Claude Code and other MCP-compatible clients.',
        category: 'development',
        rarity: 'legendary',
        icon: 'Terminal',
        gradient: 'from-orange-500 via-amber-500 to-yellow-500',
        accentColor: '35 90% 55%',
        tags: [
            'mcp',
            'protocol',
            'servers',
            'tools',
            'integration'
        ],
        stats: {
            power: 95,
            complexity: 75,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Anthropic',
            url: 'https://github.com/anthropics/skills',
            license: 'Apache-2.0'
        }
    },
    {
        id: 'pdf-skill',
        name: 'PDF Document Creation',
        shortName: 'PDF',
        description: 'Create and manipulate PDF documents',
        longDescription: 'Generate professional PDF documents with complex layouts, embedded fonts, images, tables, and vector graphics. Powers Claude\'s native PDF generation capabilities for reports, presentations, and documents.',
        category: 'automation',
        rarity: 'epic',
        icon: 'BookOpen',
        gradient: 'from-red-600 via-red-500 to-orange-500',
        accentColor: '10 80% 50%',
        tags: [
            'pdf',
            'documents',
            'reports',
            'export'
        ],
        stats: {
            power: 90,
            complexity: 60,
            utility: 95
        },
        defaultMode: 'on',
        commands: [],
        dependencies: [],
        source: {
            author: 'Anthropic',
            url: 'https://github.com/anthropics/skills',
            license: 'Source-Available'
        }
    },
    {
        id: 'pptx-skill',
        name: 'PowerPoint Creation',
        shortName: 'PPTX',
        description: 'Create presentation slide decks',
        longDescription: 'Generate professional PowerPoint presentations with slides, layouts, themes, charts, and animations. Create compelling visual narratives for business presentations, pitches, and educational content.',
        category: 'automation',
        rarity: 'epic',
        icon: 'Layers',
        gradient: 'from-orange-600 via-orange-500 to-amber-500',
        accentColor: '25 85% 55%',
        tags: [
            'powerpoint',
            'presentations',
            'slides',
            'office'
        ],
        stats: {
            power: 88,
            complexity: 55,
            utility: 90
        },
        defaultMode: 'on',
        commands: [],
        dependencies: [],
        source: {
            author: 'Anthropic',
            url: 'https://github.com/anthropics/skills',
            license: 'Source-Available'
        }
    },
    {
        id: 'skill-creator',
        name: 'Skill Creator',
        shortName: 'Skills',
        description: 'Create new Claude skills from scratch',
        longDescription: 'Meta-skill for creating new Claude skills. Follows the official skill specification to generate SKILL.md files, supporting resources, and proper folder structure for custom skill development.',
        category: 'development',
        rarity: 'legendary',
        icon: 'Sparkles',
        gradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
        accentColor: '330 75% 55%',
        tags: [
            'meta',
            'skills',
            'development',
            'templates'
        ],
        stats: {
            power: 92,
            complexity: 65,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Anthropic',
            url: 'https://github.com/anthropics/skills',
            license: 'Apache-2.0'
        }
    },
    {
        id: 'slack-gif-creator',
        name: 'Slack GIF Creator',
        shortName: 'GIFs',
        description: 'Create animated GIFs for Slack and messaging',
        longDescription: 'Generate custom animated GIFs for Slack reactions, team celebrations, and messaging. Create looping animations, text overlays, and branded reaction images for team communication.',
        category: 'creative',
        rarity: 'uncommon',
        icon: 'Play',
        gradient: 'from-purple-500 via-pink-500 to-red-500',
        accentColor: '320 70% 55%',
        tags: [
            'gif',
            'animation',
            'slack',
            'messaging',
            'reactions'
        ],
        stats: {
            power: 65,
            complexity: 40,
            utility: 70
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Anthropic',
            url: 'https://github.com/anthropics/skills',
            license: 'Apache-2.0'
        }
    },
    {
        id: 'theme-factory',
        name: 'Theme Factory',
        shortName: 'Themes',
        description: 'Generate design system themes and tokens',
        longDescription: 'Create complete design system themes with color palettes, typography scales, spacing systems, and component tokens. Generate light/dark modes, brand variations, and exportable theme configurations.',
        category: 'design',
        rarity: 'rare',
        icon: 'Palette',
        gradient: 'from-indigo-500 via-purple-500 to-pink-500',
        accentColor: '260 70% 55%',
        tags: [
            'themes',
            'design-tokens',
            'colors',
            'design-system'
        ],
        stats: {
            power: 80,
            complexity: 50,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Anthropic',
            url: 'https://github.com/anthropics/skills',
            license: 'Apache-2.0'
        }
    },
    {
        id: 'web-artifacts-builder',
        name: 'Web Artifacts Builder',
        shortName: 'Artifacts',
        description: 'Build interactive web artifacts and demos',
        longDescription: 'Create standalone interactive web artifacts including calculators, visualizations, mini-apps, and demos. Generates self-contained HTML/CSS/JS that can be previewed and shared.',
        category: 'development',
        rarity: 'epic',
        icon: 'Globe',
        gradient: 'from-cyan-500 via-teal-500 to-emerald-500',
        accentColor: '175 70% 45%',
        tags: [
            'artifacts',
            'interactive',
            'demos',
            'web',
            'html'
        ],
        stats: {
            power: 88,
            complexity: 50,
            utility: 88
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Anthropic',
            url: 'https://github.com/anthropics/skills',
            license: 'Apache-2.0'
        }
    },
    {
        id: 'webapp-testing',
        name: 'Web App Testing',
        shortName: 'WebTest',
        description: 'Test web applications comprehensively',
        longDescription: 'Comprehensive web application testing including functional testing, accessibility audits, performance analysis, and cross-browser compatibility checks. Generate test plans and automated test scripts.',
        category: 'development',
        rarity: 'rare',
        icon: 'Terminal',
        gradient: 'from-green-500 via-emerald-500 to-teal-500',
        accentColor: '155 65% 45%',
        tags: [
            'testing',
            'qa',
            'accessibility',
            'performance'
        ],
        stats: {
            power: 82,
            complexity: 55,
            utility: 88
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Anthropic',
            url: 'https://github.com/anthropics/skills',
            license: 'Apache-2.0'
        }
    },
    {
        id: 'xlsx-skill',
        name: 'Excel Spreadsheet Creation',
        shortName: 'XLSX',
        description: 'Create and manipulate Excel spreadsheets',
        longDescription: 'Generate and edit Excel spreadsheets with formulas, charts, pivot tables, conditional formatting, and complex data structures. Powers Claude\'s native spreadsheet capabilities for data analysis and reporting.',
        category: 'automation',
        rarity: 'epic',
        icon: 'Layout',
        gradient: 'from-green-600 via-green-500 to-emerald-500',
        accentColor: '145 70% 45%',
        tags: [
            'excel',
            'spreadsheets',
            'data',
            'formulas',
            'office'
        ],
        stats: {
            power: 90,
            complexity: 60,
            utility: 95
        },
        defaultMode: 'on',
        commands: [],
        dependencies: [],
        source: {
            author: 'Anthropic',
            url: 'https://github.com/anthropics/skills',
            license: 'Source-Available'
        }
    },
    // ==========================================================================
    // OPENAI CODEX SKILLS (from github.com/openai/skills)
    // Original Author: OpenAI | Forked for reference: github.com/PodJamz/OpenAI-skills
    // License: Individual per skill (see LICENSE.txt in each skill directory)
    // ==========================================================================
    // System Skills
    {
        id: 'openai-skill-creator',
        name: 'OpenAI Skill Creator',
        shortName: 'Create',
        description: 'Create new Codex agent skills from scratch',
        longDescription: 'System skill for creating new OpenAI Codex agent skills. Generates the proper folder structure, SKILL.md files, and supporting resources following the Agent Skills specification (agentskills.io).',
        category: 'development',
        rarity: 'legendary',
        icon: 'Sparkles',
        gradient: 'from-emerald-400 via-green-500 to-teal-500',
        accentColor: '155 70% 50%',
        tags: [
            'codex',
            'meta',
            'skills',
            'openai',
            'agent'
        ],
        stats: {
            power: 90,
            complexity: 60,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'OpenAI',
            url: 'https://github.com/openai/skills'
        }
    },
    {
        id: 'openai-skill-installer',
        name: 'Skill Installer',
        shortName: 'Install',
        description: 'Install and manage Codex agent skills',
        longDescription: 'System skill for discovering, installing, and managing agent skills in Codex. Install skills by name from curated collection, by folder path, or directly from GitHub URLs.',
        category: 'automation',
        rarity: 'epic',
        icon: 'Terminal',
        gradient: 'from-blue-500 via-indigo-500 to-purple-500',
        accentColor: '240 70% 55%',
        tags: [
            'codex',
            'installer',
            'package-manager',
            'openai'
        ],
        stats: {
            power: 85,
            complexity: 40,
            utility: 90
        },
        defaultMode: 'on',
        commands: [
            {
                name: 'install',
                syntax: '$skill-installer <skill-name>',
                description: 'Install skill by name'
            }
        ],
        dependencies: [],
        source: {
            author: 'OpenAI',
            url: 'https://github.com/openai/skills'
        }
    },
    // Curated GitHub Skills
    {
        id: 'gh-address-comments',
        name: 'GitHub Address Comments',
        shortName: 'Comments',
        description: 'Automatically address PR review comments',
        longDescription: 'Analyze and automatically address code review comments on GitHub pull requests. Parse reviewer feedback, understand requested changes, and implement fixes or respond with clarifications.',
        category: 'development',
        rarity: 'rare',
        icon: 'Terminal',
        gradient: 'from-gray-700 via-gray-600 to-gray-500',
        accentColor: '0 0% 40%',
        tags: [
            'github',
            'pr',
            'code-review',
            'automation'
        ],
        stats: {
            power: 80,
            complexity: 50,
            utility: 88
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [
            {
                name: 'gh',
                type: 'cli',
                url: 'https://cli.github.com'
            }
        ],
        source: {
            author: 'OpenAI',
            url: 'https://github.com/openai/skills'
        }
    },
    {
        id: 'gh-fix-ci',
        name: 'GitHub Fix CI',
        shortName: 'Fix CI',
        description: 'Automatically diagnose and fix CI failures',
        longDescription: 'Analyze GitHub Actions CI failures, diagnose the root cause, and automatically implement fixes. Handles test failures, linting errors, build issues, and type errors.',
        category: 'development',
        rarity: 'epic',
        icon: 'Terminal',
        gradient: 'from-red-500 via-orange-500 to-yellow-500',
        accentColor: '25 85% 55%',
        tags: [
            'github',
            'ci',
            'actions',
            'debugging',
            'automation'
        ],
        stats: {
            power: 88,
            complexity: 55,
            utility: 92
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [
            {
                name: 'gh',
                type: 'cli',
                url: 'https://cli.github.com'
            }
        ],
        source: {
            author: 'OpenAI',
            url: 'https://github.com/openai/skills'
        }
    },
    // Curated Notion Skills
    {
        id: 'notion-knowledge-capture',
        name: 'Notion Knowledge Capture',
        shortName: 'Capture',
        description: 'Capture and organize knowledge in Notion',
        longDescription: 'Automatically capture, organize, and structure knowledge into Notion databases and pages. Extract insights from conversations, documents, and research into organized Notion workspaces.',
        category: 'management',
        rarity: 'rare',
        icon: 'BookOpen',
        gradient: 'from-stone-600 via-stone-500 to-stone-400',
        accentColor: '30 10% 45%',
        tags: [
            'notion',
            'knowledge',
            'documentation',
            'organization'
        ],
        stats: {
            power: 75,
            complexity: 45,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'OpenAI',
            url: 'https://github.com/openai/skills'
        }
    },
    {
        id: 'notion-meeting-intelligence',
        name: 'Notion Meeting Intelligence',
        shortName: 'Meetings',
        description: 'Generate intelligent meeting notes and actions',
        longDescription: 'Transform meeting transcripts and notes into structured Notion pages with summaries, action items, decisions, and follow-ups. Automatically tag participants and link related documents.',
        category: 'management',
        rarity: 'rare',
        icon: 'ClipboardList',
        gradient: 'from-blue-600 via-blue-500 to-cyan-500',
        accentColor: '210 75% 50%',
        tags: [
            'notion',
            'meetings',
            'notes',
            'actions',
            'ai'
        ],
        stats: {
            power: 78,
            complexity: 40,
            utility: 88
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'OpenAI',
            url: 'https://github.com/openai/skills'
        }
    },
    {
        id: 'notion-research-documentation',
        name: 'Notion Research Documentation',
        shortName: 'Research',
        description: 'Document research findings in Notion',
        longDescription: 'Structure and document research findings, literature reviews, and analysis in Notion. Create linked databases for sources, findings, and conclusions with proper citations and cross-references.',
        category: 'management',
        rarity: 'uncommon',
        icon: 'BookOpen',
        gradient: 'from-purple-600 via-purple-500 to-indigo-500',
        accentColor: '270 65% 55%',
        tags: [
            'notion',
            'research',
            'documentation',
            'academic'
        ],
        stats: {
            power: 72,
            complexity: 45,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'OpenAI',
            url: 'https://github.com/openai/skills'
        }
    },
    {
        id: 'notion-spec-to-implementation',
        name: 'Notion Spec to Implementation',
        shortName: 'Spec2Code',
        description: 'Convert Notion specs into working code',
        longDescription: 'Transform product specifications and technical documents in Notion into working code implementations. Parse requirements, generate code scaffolds, and track implementation progress.',
        category: 'development',
        rarity: 'epic',
        icon: 'Code',
        gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
        accentColor: '280 70% 55%',
        tags: [
            'notion',
            'specs',
            'code-generation',
            'requirements'
        ],
        stats: {
            power: 88,
            complexity: 60,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'OpenAI',
            url: 'https://github.com/openai/skills'
        }
    },
    // Experimental Skills
    {
        id: 'openai-create-plan',
        name: 'Create Plan',
        shortName: 'Plan',
        description: 'Generate structured implementation plans',
        longDescription: 'Create detailed, structured implementation plans for complex tasks. Break down requirements into phases, milestones, and actionable steps with dependencies and resource allocation.',
        category: 'management',
        rarity: 'rare',
        icon: 'ClipboardList',
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        accentColor: '25 80% 55%',
        tags: [
            'planning',
            'project',
            'roadmap',
            'tasks'
        ],
        stats: {
            power: 80,
            complexity: 50,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'OpenAI',
            url: 'https://github.com/openai/skills'
        }
    },
    {
        id: 'linear-integration',
        name: 'Linear Integration',
        shortName: 'Linear',
        description: 'Integrate with Linear for issue tracking',
        longDescription: 'Connect with Linear project management to create issues, update statuses, manage sprints, and synchronize development workflows. Automate ticket creation and status updates.',
        category: 'management',
        rarity: 'rare',
        icon: 'ClipboardList',
        gradient: 'from-indigo-600 via-blue-500 to-cyan-500',
        accentColor: '220 75% 55%',
        tags: [
            'linear',
            'issues',
            'project-management',
            'agile'
        ],
        stats: {
            power: 78,
            complexity: 45,
            utility: 82
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'OpenAI',
            url: 'https://github.com/openai/skills'
        }
    },
    // ==========================================================================
    // OBRA/JESSE VINCENT - SKILLS AS SUPERPOWERS
    // Original Author: obra (Jesse Vincent) | Blog: https://blog.fsck.com/
    // Source: https://github.com/obra/skills-as-superpowers
    // Forked for reference: github.com/PodJamz/Skills-as-superpowers
    // License: MIT
    // ==========================================================================
    // Testing & Quality Skills
    {
        id: 'test-driven-development',
        name: 'Test-Driven Development',
        shortName: 'TDD',
        description: 'Write tests first, then code to make them pass',
        longDescription: 'The discipline of writing failing tests before implementing functionality. Red-Green-Refactor cycle: write a failing test, write minimal code to pass, then refactor. Ensures code is testable by design and maintains high coverage from the start.',
        category: 'development',
        rarity: 'epic',
        icon: 'FlaskConical',
        gradient: 'from-red-500 via-green-500 to-blue-500',
        accentColor: '150 70% 50%',
        tags: [
            'testing',
            'tdd',
            'methodology',
            'quality',
            'workflow'
        ],
        stats: {
            power: 88,
            complexity: 55,
            utility: 90
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'obra (Jesse Vincent)',
            url: 'https://github.com/obra/skills-as-superpowers',
            license: 'MIT'
        }
    },
    {
        id: 'systematic-debugging',
        name: 'Systematic Debugging',
        shortName: 'Debug',
        description: 'Methodical approach to finding and fixing bugs',
        longDescription: 'Structured debugging methodology: reproduce the issue, isolate the cause, form hypotheses, test systematically, and verify the fix. Avoid random changes. Use binary search, logging, and breakpoints strategically.',
        category: 'development',
        rarity: 'rare',
        icon: 'Terminal',
        gradient: 'from-orange-500 via-red-500 to-rose-500',
        accentColor: '15 80% 55%',
        tags: [
            'debugging',
            'troubleshooting',
            'methodology',
            'bugs'
        ],
        stats: {
            power: 85,
            complexity: 50,
            utility: 95
        },
        defaultMode: 'on',
        commands: [],
        dependencies: [],
        source: {
            author: 'obra (Jesse Vincent)',
            url: 'https://github.com/obra/skills-as-superpowers',
            license: 'MIT'
        }
    },
    {
        id: 'verification-before-completion',
        name: 'Verification Before Completion',
        shortName: 'Verify',
        description: 'Always verify work before marking done',
        longDescription: 'Never mark a task complete without verification. Run tests, check the output, verify the behavior matches requirements. This prevents premature completion and ensures quality. A simple discipline that catches many issues.',
        category: 'management',
        rarity: 'uncommon',
        icon: 'ClipboardList',
        gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
        accentColor: '170 65% 45%',
        tags: [
            'verification',
            'quality',
            'workflow',
            'discipline'
        ],
        stats: {
            power: 70,
            complexity: 25,
            utility: 92
        },
        defaultMode: 'on',
        commands: [],
        dependencies: [],
        source: {
            author: 'obra (Jesse Vincent)',
            url: 'https://github.com/obra/skills-as-superpowers',
            license: 'MIT'
        }
    },
    // Collaboration & Workflow Skills
    {
        id: 'brainstorming',
        name: 'Brainstorming',
        shortName: 'Ideas',
        description: 'Generate creative ideas and explore possibilities',
        longDescription: 'Collaborative ideation technique for generating solutions. Defer judgment, encourage wild ideas, build on others\' ideas, and go for quantity. Divergent thinking phase before convergent evaluation. Perfect for early-stage exploration.',
        category: 'creative',
        rarity: 'uncommon',
        icon: 'Sparkles',
        gradient: 'from-yellow-400 via-amber-500 to-orange-500',
        accentColor: '40 90% 55%',
        tags: [
            'creativity',
            'ideation',
            'collaboration',
            'exploration'
        ],
        stats: {
            power: 75,
            complexity: 30,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'obra (Jesse Vincent)',
            url: 'https://github.com/obra/skills-as-superpowers',
            license: 'MIT'
        }
    },
    {
        id: 'writing-plans',
        name: 'Writing Plans',
        shortName: 'Plans',
        description: 'Create clear, actionable implementation plans',
        longDescription: 'Transform ambiguous requirements into concrete plans. Break down goals into phases, identify dependencies, define success criteria, and create actionable steps. A well-written plan is half the implementation done.',
        category: 'management',
        rarity: 'rare',
        icon: 'ClipboardList',
        gradient: 'from-blue-500 via-indigo-500 to-violet-500',
        accentColor: '240 70% 55%',
        tags: [
            'planning',
            'documentation',
            'strategy',
            'workflow'
        ],
        stats: {
            power: 82,
            complexity: 45,
            utility: 90
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'obra (Jesse Vincent)',
            url: 'https://github.com/obra/skills-as-superpowers',
            license: 'MIT'
        }
    },
    {
        id: 'executing-plans',
        name: 'Executing Plans',
        shortName: 'Execute',
        description: 'Follow plans methodically with adaptation',
        longDescription: 'The discipline of following plans while remaining adaptable. Track progress against the plan, note deviations, and update the plan when requirements change. Balance between rigid adherence and constant pivoting.',
        category: 'management',
        rarity: 'uncommon',
        icon: 'Play',
        gradient: 'from-green-500 via-emerald-500 to-teal-500',
        accentColor: '155 65% 45%',
        tags: [
            'execution',
            'workflow',
            'discipline',
            'progress'
        ],
        stats: {
            power: 78,
            complexity: 35,
            utility: 88
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'obra (Jesse Vincent)',
            url: 'https://github.com/obra/skills-as-superpowers',
            license: 'MIT'
        }
    },
    {
        id: 'requesting-code-review',
        name: 'Requesting Code Review',
        shortName: 'Request',
        description: 'Prepare code for effective review',
        longDescription: 'Prepare pull requests for efficient review: clear description, atomic commits, self-review first, highlight areas of concern, provide context for decisions. Make the reviewer\'s job easy and get better feedback.',
        category: 'development',
        rarity: 'uncommon',
        icon: 'Code',
        gradient: 'from-purple-500 via-violet-500 to-indigo-500',
        accentColor: '260 65% 55%',
        tags: [
            'code-review',
            'git',
            'collaboration',
            'pr'
        ],
        stats: {
            power: 72,
            complexity: 40,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [
            {
                name: 'gh',
                type: 'cli',
                url: 'https://cli.github.com'
            }
        ],
        source: {
            author: 'obra (Jesse Vincent)',
            url: 'https://github.com/obra/skills-as-superpowers',
            license: 'MIT'
        }
    },
    {
        id: 'receiving-code-review',
        name: 'Receiving Code Review',
        shortName: 'Receive',
        description: 'Process feedback constructively',
        longDescription: 'Handle code review feedback professionally: understand before responding, assume good intent, separate ego from code, learn from feedback, and know when to push back constructively. Turn reviews into learning opportunities.',
        category: 'development',
        rarity: 'uncommon',
        icon: 'BookOpen',
        gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
        accentColor: '210 70% 55%',
        tags: [
            'code-review',
            'feedback',
            'collaboration',
            'growth'
        ],
        stats: {
            power: 70,
            complexity: 35,
            utility: 82
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'obra (Jesse Vincent)',
            url: 'https://github.com/obra/skills-as-superpowers',
            license: 'MIT'
        }
    },
    {
        id: 'using-git-worktrees',
        name: 'Using Git Worktrees',
        shortName: 'Worktrees',
        description: 'Work on multiple branches simultaneously',
        longDescription: 'Git worktrees allow multiple working directories from one repository. Work on a hotfix while keeping your feature branch open. Review PRs without stashing changes. Perfect for parallel development and code review workflows.',
        category: 'development',
        rarity: 'rare',
        icon: 'FolderOpen',
        gradient: 'from-orange-500 via-amber-500 to-yellow-500',
        accentColor: '35 85% 55%',
        tags: [
            'git',
            'worktrees',
            'parallel',
            'workflow'
        ],
        stats: {
            power: 78,
            complexity: 55,
            utility: 75
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'add',
                syntax: 'git worktree add <path> <branch>',
                description: 'Create new worktree'
            },
            {
                name: 'list',
                syntax: 'git worktree list',
                description: 'List all worktrees'
            },
            {
                name: 'remove',
                syntax: 'git worktree remove <path>',
                description: 'Remove a worktree'
            }
        ],
        dependencies: [
            {
                name: 'git',
                type: 'cli'
            }
        ],
        source: {
            author: 'obra (Jesse Vincent)',
            url: 'https://github.com/obra/skills-as-superpowers',
            license: 'MIT'
        }
    },
    {
        id: 'dispatching-parallel-agents',
        name: 'Dispatching Parallel Agents',
        shortName: 'Parallel',
        description: 'Coordinate multiple AI agents in parallel',
        longDescription: 'Orchestrate multiple AI agent tasks simultaneously for maximum efficiency. Identify independent work streams, dispatch parallel agents, coordinate results, and handle conflicts. The key to 10x productivity with AI assistants.',
        category: 'automation',
        rarity: 'legendary',
        icon: 'Zap',
        gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
        accentColor: '280 75% 55%',
        tags: [
            'agents',
            'parallel',
            'orchestration',
            'efficiency'
        ],
        stats: {
            power: 95,
            complexity: 70,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'obra (Jesse Vincent)',
            url: 'https://github.com/obra/skills-as-superpowers',
            license: 'MIT'
        }
    },
    {
        id: 'finishing-development-branch',
        name: 'Finishing a Development Branch',
        shortName: 'Finish',
        description: 'Complete branches with proper cleanup',
        longDescription: 'The full workflow for completing a feature branch: final tests, clean up commits (squash/rebase), update documentation, request review, address feedback, merge, and delete the branch. Leave no loose ends.',
        category: 'development',
        rarity: 'uncommon',
        icon: 'Terminal',
        gradient: 'from-green-600 via-emerald-500 to-teal-500',
        accentColor: '160 65% 45%',
        tags: [
            'git',
            'branches',
            'workflow',
            'cleanup'
        ],
        stats: {
            power: 75,
            complexity: 45,
            utility: 88
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [
            {
                name: 'git',
                type: 'cli'
            },
            {
                name: 'gh',
                type: 'cli',
                url: 'https://cli.github.com'
            }
        ],
        source: {
            author: 'obra (Jesse Vincent)',
            url: 'https://github.com/obra/skills-as-superpowers',
            license: 'MIT'
        }
    },
    {
        id: 'subagent-driven-development',
        name: 'Subagent-Driven Development',
        shortName: 'Subagents',
        description: 'Delegate tasks to specialized AI subagents',
        longDescription: 'Development methodology using specialized AI subagents for different tasks. Architecture agent plans, coding agent implements, testing agent verifies, review agent critiques. Each agent excels at its specialty.',
        category: 'automation',
        rarity: 'legendary',
        icon: 'Sparkles',
        gradient: 'from-pink-500 via-rose-500 to-red-500',
        accentColor: '340 75% 55%',
        tags: [
            'agents',
            'delegation',
            'methodology',
            'ai-native'
        ],
        stats: {
            power: 92,
            complexity: 75,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'obra (Jesse Vincent)',
            url: 'https://github.com/obra/skills-as-superpowers',
            license: 'MIT'
        }
    },
    // Meta Skills
    {
        id: 'writing-skills',
        name: 'Writing Skills',
        shortName: 'Write',
        description: 'Create new AI skills and capabilities',
        longDescription: 'The meta-skill of creating new skills. Define the skill\'s purpose, write clear instructions, provide examples, test edge cases, and iterate based on results. Turn any expertise into a teachable, reusable skill.',
        category: 'development',
        rarity: 'epic',
        icon: 'PenTool',
        gradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
        accentColor: '330 70% 55%',
        tags: [
            'meta',
            'skills',
            'authoring',
            'templates'
        ],
        stats: {
            power: 88,
            complexity: 60,
            utility: 78
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'obra (Jesse Vincent)',
            url: 'https://github.com/obra/skills-as-superpowers',
            license: 'MIT'
        }
    },
    {
        id: 'using-superpowers',
        name: 'Using Superpowers',
        shortName: 'Super',
        description: 'Master the superpowers framework',
        longDescription: 'The overarching framework for AI-augmented development. Combine skills, dispatch agents, verify results, and iterate rapidly. The synthesis of all skills into a coherent methodology for 10x productivity.',
        category: 'management',
        rarity: 'legendary',
        icon: 'Zap',
        gradient: 'from-amber-400 via-yellow-500 to-orange-500',
        accentColor: '45 90% 55%',
        tags: [
            'framework',
            'methodology',
            'meta',
            'productivity'
        ],
        stats: {
            power: 95,
            complexity: 65,
            utility: 90
        },
        defaultMode: 'on',
        commands: [],
        dependencies: [],
        source: {
            author: 'obra (Jesse Vincent)',
            url: 'https://github.com/obra/skills-as-superpowers',
            license: 'MIT'
        }
    },
    // ==========================================================================
    // OBRA/JESSE VINCENT - YOUTUBE TO WEBPAGE
    // Original Author: obra (Jesse Vincent) | Blog: https://blog.fsck.com/
    // Source: https://github.com/obra/Youtube2Webpage
    // Forked for reference: github.com/PodJamz/Youtube2Webpage
    // License: MIT
    // ==========================================================================
    {
        id: 'youtube-to-webpage',
        name: 'YouTube to Webpage',
        shortName: 'YT2Web',
        description: 'Transform YouTube videos into interactive text-based webpages',
        longDescription: 'Convert YouTube videos into self-contained, interactive webpages for text-based learning. Extracts transcripts, generates timestamped screenshots, and creates a synchronized browsing experience. Perfect for learners who prefer reading over watching. Outputs portable HTML/CSS/JS artifacts.',
        category: 'creative',
        rarity: 'epic',
        icon: 'Play',
        gradient: 'from-red-500 via-rose-500 to-pink-500',
        accentColor: '350 80% 55%',
        tags: [
            'youtube',
            'transcript',
            'webpage',
            'learning',
            'accessibility',
            'artifact'
        ],
        stats: {
            power: 85,
            complexity: 45,
            utility: 88
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'convert',
                syntax: './yt-to-webpage.pl <name> <url>',
                description: 'Convert YouTube video to webpage'
            }
        ],
        dependencies: [
            {
                name: 'yt-dlp',
                type: 'cli',
                url: 'https://github.com/yt-dlp/yt-dlp'
            },
            {
                name: 'ffmpeg',
                type: 'cli',
                url: 'https://ffmpeg.org'
            },
            {
                name: 'perl',
                type: 'native'
            }
        ],
        source: {
            author: 'obra (Jesse Vincent)',
            url: 'https://github.com/obra/Youtube2Webpage',
            license: 'MIT'
        }
    },
    // ==========================================================================
    // GENERATIVE ARTIFACT SYSTEM
    // Claw AI's ability to create blurred-line content artifacts
    // ==========================================================================
    {
        id: 'artifact-generation',
        name: 'Artifact Generation',
        shortName: 'Artifacts',
        description: 'Generate self-contained interactive artifacts that blur app/doc/website lines',
        longDescription: 'The paradigm where apps, documents, and websites become one. Generate self-contained HTML/CSS/JS artifacts that are simultaneously readable documents, interactive apps, and shareable websites. Combine with design skills to create educational breakdowns, interactive tutorials, and generative content.',
        category: 'creative',
        rarity: 'legendary',
        icon: 'Sparkles',
        gradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
        accentColor: '290 75% 55%',
        tags: [
            'artifacts',
            'generative',
            'interactive',
            'documents',
            'apps',
            'paradigm'
        ],
        stats: {
            power: 95,
            complexity: 60,
            utility: 92
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Claw AI',
            license: 'Proprietary'
        }
    },
    {
        id: 'content-breakdown',
        name: 'Content Breakdown',
        shortName: 'Breakdown',
        description: 'Transform content into educational, scrollable breakdowns',
        longDescription: 'Take any content source (video transcripts, articles, documentation) and transform it into rich, educational breakdowns. Create interactive scrollytelling experiences with key insights, visual anchors, and progressive disclosure. Designed for deep learning and comprehension.',
        category: 'creative',
        rarity: 'epic',
        icon: 'Layout',
        gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
        accentColor: '210 75% 55%',
        tags: [
            'breakdown',
            'educational',
            'scrollytelling',
            'learning',
            'interactive'
        ],
        stats: {
            power: 88,
            complexity: 50,
            utility: 90
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Claw AI',
            license: 'Proprietary'
        }
    },
    // ==========================================================================
    // TRAIL OF BITS - SECURITY SKILLS
    // Original Author: Trail of Bits | Security Research Firm
    // Source: https://github.com/trailofbits/skills
    // Forked for reference: github.com/PodJamz/Security-skills-
    // License: CC-BY-SA-4.0
    // ==========================================================================
    // Smart Contract Security
    {
        id: 'tob-building-secure-contracts',
        name: 'Building Secure Contracts',
        shortName: 'SecContracts',
        description: 'Smart contract security toolkit with vulnerability scanners for 6 blockchains',
        longDescription: 'Comprehensive smart contract security toolkit from Trail of Bits. Includes vulnerability scanners, security patterns, and best practices for Ethereum, Solana, and 4 other blockchain platforms. Essential for secure DeFi development.',
        category: 'security',
        rarity: 'legendary',
        icon: 'Shield',
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        accentColor: '25 85% 55%',
        tags: [
            'blockchain',
            'smart-contracts',
            'defi',
            'audit',
            'solidity'
        ],
        stats: {
            power: 95,
            complexity: 80,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Trail of Bits',
            url: 'https://github.com/trailofbits/skills',
            license: 'CC-BY-SA-4.0'
        }
    },
    {
        id: 'tob-entry-point-analyzer',
        name: 'Entry Point Analyzer',
        shortName: 'EntryPts',
        description: 'Identify state-changing entry points in smart contracts',
        longDescription: 'Security auditing tool that identifies all state-changing entry points in smart contracts. Maps attack surfaces, finds privileged functions, and traces state mutations for comprehensive security analysis.',
        category: 'security',
        rarity: 'epic',
        icon: 'Terminal',
        gradient: 'from-red-500 via-rose-500 to-pink-500',
        accentColor: '350 75% 55%',
        tags: [
            'blockchain',
            'entry-points',
            'attack-surface',
            'audit'
        ],
        stats: {
            power: 85,
            complexity: 65,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Trail of Bits',
            url: 'https://github.com/trailofbits/skills',
            license: 'CC-BY-SA-4.0'
        }
    },
    // Code Auditing
    {
        id: 'tob-audit-context-building',
        name: 'Audit Context Building',
        shortName: 'AuditCtx',
        description: 'Develop architectural understanding through code examination',
        longDescription: 'Build deep understanding of codebases for security auditing. Systematic approach to mapping architecture, identifying trust boundaries, understanding data flows, and building mental models for effective security review.',
        category: 'security',
        rarity: 'rare',
        icon: 'BookOpen',
        gradient: 'from-blue-500 via-indigo-500 to-violet-500',
        accentColor: '240 70% 55%',
        tags: [
            'audit',
            'architecture',
            'code-review',
            'analysis'
        ],
        stats: {
            power: 78,
            complexity: 55,
            utility: 88
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Trail of Bits',
            url: 'https://github.com/trailofbits/skills',
            license: 'CC-BY-SA-4.0'
        }
    },
    {
        id: 'tob-burpsuite-parser',
        name: 'Burp Suite Project Parser',
        shortName: 'BurpParse',
        description: 'Extract and search data from Burp Suite projects',
        longDescription: 'Parse and analyze Burp Suite security testing project files. Extract requests, responses, findings, and scan results. Search across large test datasets for patterns and vulnerabilities.',
        category: 'security',
        rarity: 'rare',
        icon: 'Terminal',
        gradient: 'from-orange-500 via-amber-500 to-yellow-500',
        accentColor: '35 85% 55%',
        tags: [
            'burpsuite',
            'web-security',
            'pentest',
            'parsing'
        ],
        stats: {
            power: 75,
            complexity: 50,
            utility: 82
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [
            {
                name: 'burpsuite',
                type: 'cli',
                url: 'https://portswigger.net/burp'
            }
        ],
        source: {
            author: 'Trail of Bits',
            url: 'https://github.com/trailofbits/skills',
            license: 'CC-BY-SA-4.0'
        }
    },
    {
        id: 'tob-differential-review',
        name: 'Differential Security Review',
        shortName: 'DiffReview',
        description: 'Analyze code changes with emphasis on security implications',
        longDescription: 'Security-focused code review for diffs and PRs. Identifies security-relevant changes, spots introduced vulnerabilities, and validates that security properties are maintained across changes.',
        category: 'security',
        rarity: 'epic',
        icon: 'Code',
        gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
        accentColor: '210 75% 55%',
        tags: [
            'code-review',
            'diff',
            'security',
            'pr-review'
        ],
        stats: {
            power: 85,
            complexity: 55,
            utility: 90
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [
            {
                name: 'git',
                type: 'cli'
            }
        ],
        source: {
            author: 'Trail of Bits',
            url: 'https://github.com/trailofbits/skills',
            license: 'CC-BY-SA-4.0'
        }
    },
    {
        id: 'tob-semgrep-rule-creator',
        name: 'Semgrep Rule Creator',
        shortName: 'Semgrep',
        description: 'Develop custom Semgrep rules for vulnerability detection',
        longDescription: 'Create custom Semgrep rules for automated vulnerability detection. Write patterns to catch security issues, code smells, and policy violations. Build organization-specific security scanning capabilities.',
        category: 'security',
        rarity: 'epic',
        icon: 'Terminal',
        gradient: 'from-green-500 via-emerald-500 to-teal-500',
        accentColor: '155 70% 45%',
        tags: [
            'semgrep',
            'sast',
            'rules',
            'vulnerability-detection'
        ],
        stats: {
            power: 88,
            complexity: 60,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [
            {
                name: 'semgrep',
                type: 'cli',
                url: 'https://semgrep.dev'
            }
        ],
        source: {
            author: 'Trail of Bits',
            url: 'https://github.com/trailofbits/skills',
            license: 'CC-BY-SA-4.0'
        }
    },
    {
        id: 'tob-sharp-edges',
        name: 'Sharp Edges Detector',
        shortName: 'SharpEdge',
        description: 'Identify problematic APIs, risky configurations, and design flaws',
        longDescription: 'Find dangerous patterns in code: problematic APIs, risky default configurations, insecure design patterns, and footguns waiting to cause incidents. Proactive identification of architectural security issues.',
        category: 'security',
        rarity: 'rare',
        icon: 'Zap',
        gradient: 'from-yellow-500 via-orange-500 to-red-500',
        accentColor: '30 90% 55%',
        tags: [
            'apis',
            'configuration',
            'design-flaws',
            'footguns'
        ],
        stats: {
            power: 80,
            complexity: 50,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Trail of Bits',
            url: 'https://github.com/trailofbits/skills',
            license: 'CC-BY-SA-4.0'
        }
    },
    {
        id: 'tob-static-analysis',
        name: 'Static Analysis Toolkit',
        shortName: 'SAST',
        description: 'Static analysis with CodeQL, Semgrep, and SARIF parsing',
        longDescription: 'Comprehensive static analysis toolkit combining CodeQL, Semgrep, and SARIF report parsing. Run multi-tool analysis, correlate findings, and generate unified security reports.',
        category: 'security',
        rarity: 'epic',
        icon: 'Terminal',
        gradient: 'from-purple-500 via-violet-500 to-indigo-500',
        accentColor: '265 70% 55%',
        tags: [
            'codeql',
            'semgrep',
            'sarif',
            'sast',
            'analysis'
        ],
        stats: {
            power: 90,
            complexity: 65,
            utility: 88
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [
            {
                name: 'codeql',
                type: 'cli',
                url: 'https://codeql.github.com'
            },
            {
                name: 'semgrep',
                type: 'cli',
                url: 'https://semgrep.dev'
            }
        ],
        source: {
            author: 'Trail of Bits',
            url: 'https://github.com/trailofbits/skills',
            license: 'CC-BY-SA-4.0'
        }
    },
    {
        id: 'tob-testing-handbook',
        name: 'Security Testing Handbook',
        shortName: 'TestBook',
        description: 'Fuzzers, analysis tools, sanitizers, and coverage measurement',
        longDescription: 'Trail of Bits testing methodology: fuzzing strategies, analysis tool selection, sanitizer configuration, and coverage measurement. Systematic approach to security testing for maximum bug discovery.',
        category: 'security',
        rarity: 'rare',
        icon: 'BookOpen',
        gradient: 'from-teal-500 via-cyan-500 to-blue-500',
        accentColor: '190 70% 50%',
        tags: [
            'fuzzing',
            'sanitizers',
            'coverage',
            'testing'
        ],
        stats: {
            power: 82,
            complexity: 60,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Trail of Bits',
            url: 'https://github.com/trailofbits/skills',
            license: 'CC-BY-SA-4.0'
        }
    },
    {
        id: 'tob-variant-analysis',
        name: 'Variant Analysis',
        shortName: 'Variants',
        description: 'Locate similar vulnerabilities across multiple codebases',
        longDescription: 'Find variants of known vulnerabilities across codebases. Once a bug pattern is identified, systematically search for similar issues. Scale security findings across projects and organizations.',
        category: 'security',
        rarity: 'epic',
        icon: 'Code',
        gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
        accentColor: '340 75% 55%',
        tags: [
            'variant-analysis',
            'codeql',
            'vulnerability',
            'patterns'
        ],
        stats: {
            power: 88,
            complexity: 65,
            utility: 82
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [
            {
                name: 'codeql',
                type: 'cli',
                url: 'https://codeql.github.com'
            }
        ],
        source: {
            author: 'Trail of Bits',
            url: 'https://github.com/trailofbits/skills',
            license: 'CC-BY-SA-4.0'
        }
    },
    // Verification
    {
        id: 'tob-constant-time-analysis',
        name: 'Constant-Time Analysis',
        shortName: 'ConstTime',
        description: 'Detect compiler-induced timing side-channels in cryptographic code',
        longDescription: 'Analyze cryptographic implementations for timing side-channels. Detect when compilers introduce timing variations that leak secrets. Essential for secure crypto implementation verification.',
        category: 'security',
        rarity: 'legendary',
        icon: 'Lock',
        gradient: 'from-slate-600 via-gray-500 to-zinc-500',
        accentColor: '220 15% 45%',
        tags: [
            'cryptography',
            'timing',
            'side-channel',
            'verification'
        ],
        stats: {
            power: 95,
            complexity: 85,
            utility: 70
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Trail of Bits',
            url: 'https://github.com/trailofbits/skills',
            license: 'CC-BY-SA-4.0'
        }
    },
    {
        id: 'tob-property-based-testing',
        name: 'Property-Based Testing',
        shortName: 'PropTest',
        description: 'Property-based testing across languages and blockchains',
        longDescription: 'Design and implement property-based tests that automatically generate inputs to find edge cases. Coverage across multiple languages and blockchain platforms for comprehensive testing.',
        category: 'security',
        rarity: 'rare',
        icon: 'FlaskConical',
        gradient: 'from-emerald-500 via-green-500 to-lime-500',
        accentColor: '140 65% 45%',
        tags: [
            'property-testing',
            'fuzzing',
            'quickcheck',
            'invariants'
        ],
        stats: {
            power: 82,
            complexity: 55,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Trail of Bits',
            url: 'https://github.com/trailofbits/skills',
            license: 'CC-BY-SA-4.0'
        }
    },
    {
        id: 'tob-spec-compliance',
        name: 'Spec-to-Code Compliance',
        shortName: 'SpecCheck',
        description: 'Verify blockchain implementation matches specifications',
        longDescription: 'Systematic verification that code implementation matches formal specifications. Essential for blockchain protocols where spec compliance is critical for consensus and security.',
        category: 'security',
        rarity: 'epic',
        icon: 'ClipboardList',
        gradient: 'from-blue-600 via-blue-500 to-cyan-500',
        accentColor: '210 75% 50%',
        tags: [
            'specification',
            'compliance',
            'verification',
            'blockchain'
        ],
        stats: {
            power: 88,
            complexity: 70,
            utility: 78
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Trail of Bits',
            url: 'https://github.com/trailofbits/skills',
            license: 'CC-BY-SA-4.0'
        }
    },
    // Audit Lifecycle & RE
    {
        id: 'tob-fix-review',
        name: 'Security Fix Review',
        shortName: 'FixReview',
        description: 'Validate security fixes without introducing new issues',
        longDescription: 'Review security patches to ensure they properly address findings without introducing regressions or new vulnerabilities. Critical final step in the audit remediation lifecycle.',
        category: 'security',
        rarity: 'rare',
        icon: 'Code',
        gradient: 'from-green-600 via-emerald-500 to-teal-500',
        accentColor: '160 65% 45%',
        tags: [
            'fix-review',
            'remediation',
            'audit',
            'verification'
        ],
        stats: {
            power: 78,
            complexity: 45,
            utility: 88
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Trail of Bits',
            url: 'https://github.com/trailofbits/skills',
            license: 'CC-BY-SA-4.0'
        }
    },
    {
        id: 'tob-dwarf-expert',
        name: 'DWARF Debug Expert',
        shortName: 'DWARF',
        description: 'Work with DWARF debugging format for binary analysis',
        longDescription: 'Expert-level DWARF debugging information analysis. Parse debug info, reconstruct types, map addresses to source, and leverage debug data for reverse engineering and binary analysis.',
        category: 'security',
        rarity: 'epic',
        icon: 'Terminal',
        gradient: 'from-gray-700 via-gray-600 to-gray-500',
        accentColor: '220 10% 40%',
        tags: [
            'dwarf',
            'binary',
            'reverse-engineering',
            'debugging'
        ],
        stats: {
            power: 85,
            complexity: 75,
            utility: 70
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Trail of Bits',
            url: 'https://github.com/trailofbits/skills',
            license: 'CC-BY-SA-4.0'
        }
    },
    {
        id: 'tob-ask-questions',
        name: 'Security Requirements Clarification',
        shortName: 'AskSec',
        description: 'Clarify security requirements before implementation',
        longDescription: 'Systematic approach to gathering security requirements. Ask the right questions about threat models, trust boundaries, and security properties before starting implementation or review.',
        category: 'security',
        rarity: 'uncommon',
        icon: 'ClipboardList',
        gradient: 'from-sky-500 via-blue-500 to-indigo-500',
        accentColor: '215 70% 55%',
        tags: [
            'requirements',
            'threat-model',
            'clarification',
            'planning'
        ],
        stats: {
            power: 70,
            complexity: 30,
            utility: 90
        },
        defaultMode: 'on',
        commands: [],
        dependencies: [],
        source: {
            author: 'Trail of Bits',
            url: 'https://github.com/trailofbits/skills',
            license: 'CC-BY-SA-4.0'
        }
    },
    // ==========================================================================
    // HUGGING FACE SKILLS
    // Source: https://github.com/huggingface/skills (via community)
    // Forked for reference: github.com/PodJamz/Huggingface-skills
    // For Claw AI to interact with HuggingFace models, tools, and APIs
    // ==========================================================================
    {
        id: 'hf-cli',
        name: 'Hugging Face CLI',
        shortName: 'HF CLI',
        description: 'Execute Hugging Face Hub operations using the hf CLI',
        longDescription: 'Full access to Hugging Face Hub via CLI. Manage models, datasets, spaces. Upload, download, configure. Connect Claw AI to the world\'s largest ML model repository.',
        category: 'ml',
        rarity: 'epic',
        icon: 'Terminal',
        gradient: 'from-yellow-400 via-amber-500 to-orange-500',
        accentColor: '40 90% 55%',
        tags: [
            'huggingface',
            'cli',
            'models',
            'datasets',
            'hub'
        ],
        stats: {
            power: 88,
            complexity: 45,
            utility: 92
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'login',
                syntax: 'huggingface-cli login',
                description: 'Authenticate with HF Hub'
            },
            {
                name: 'download',
                syntax: 'huggingface-cli download <model>',
                description: 'Download model/dataset'
            },
            {
                name: 'upload',
                syntax: 'huggingface-cli upload <path>',
                description: 'Upload to Hub'
            }
        ],
        dependencies: [
            {
                name: 'huggingface-cli',
                type: 'cli',
                url: 'https://huggingface.co/docs/huggingface_hub/guides/cli'
            }
        ],
        source: {
            author: 'Hugging Face',
            url: 'https://huggingface.co'
        }
    },
    {
        id: 'hf-datasets',
        name: 'Hugging Face Datasets',
        shortName: 'HF Data',
        description: 'Create and manage datasets on Hugging Face Hub',
        longDescription: 'Dataset creation and management on HF Hub. Initialize repos, transform data with SQL, stream updates, and publish datasets. Build training data pipelines for ML models.',
        category: 'ml',
        rarity: 'rare',
        icon: 'Database',
        gradient: 'from-cyan-500 via-teal-500 to-emerald-500',
        accentColor: '170 70% 45%',
        tags: [
            'huggingface',
            'datasets',
            'data',
            'streaming',
            'sql'
        ],
        stats: {
            power: 82,
            complexity: 50,
            utility: 88
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [
            {
                name: 'datasets',
                type: 'python',
                url: 'https://huggingface.co/docs/datasets'
            }
        ],
        source: {
            author: 'Hugging Face',
            url: 'https://huggingface.co'
        }
    },
    {
        id: 'hf-evaluation',
        name: 'Hugging Face Evaluation',
        shortName: 'HF Eval',
        description: 'Manage evaluation results in model cards',
        longDescription: 'Run and track model evaluations using vLLM and lighteval. Integrate with Artificial Analysis API. Update model cards with benchmark results and evaluation metrics.',
        category: 'ml',
        rarity: 'epic',
        icon: 'FlaskConical',
        gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
        accentColor: '280 70% 55%',
        tags: [
            'huggingface',
            'evaluation',
            'benchmarks',
            'vllm',
            'lighteval'
        ],
        stats: {
            power: 85,
            complexity: 60,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [
            {
                name: 'vllm',
                type: 'python',
                url: 'https://vllm.ai'
            },
            {
                name: 'lighteval',
                type: 'python'
            }
        ],
        source: {
            author: 'Hugging Face',
            url: 'https://huggingface.co'
        }
    },
    {
        id: 'hf-jobs',
        name: 'Hugging Face Jobs',
        shortName: 'HF Jobs',
        description: 'Execute compute jobs on HF infrastructure',
        longDescription: 'Run Python scripts on Hugging Face\'s compute infrastructure. Schedule jobs, manage execution, and leverage HF\'s GPU resources. Serverless ML compute for Claw AI.',
        category: 'ml',
        rarity: 'epic',
        icon: 'Zap',
        gradient: 'from-orange-500 via-red-500 to-pink-500',
        accentColor: '15 85% 55%',
        tags: [
            'huggingface',
            'jobs',
            'compute',
            'serverless',
            'gpu'
        ],
        stats: {
            power: 90,
            complexity: 55,
            utility: 82
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Hugging Face',
            url: 'https://huggingface.co'
        }
    },
    {
        id: 'hf-model-trainer',
        name: 'Hugging Face Model Trainer',
        shortName: 'HF Train',
        description: 'Fine-tune language models using TRL framework',
        longDescription: 'Fine-tune LLMs using the TRL (Transformers Reinforcement Learning) library. SFT, DPO, GRPO training methods. Convert to GGUF format. Track experiments with Trackio. Train custom models for Claw AI.',
        category: 'ml',
        rarity: 'legendary',
        icon: 'Sparkles',
        gradient: 'from-pink-500 via-rose-500 to-red-500',
        accentColor: '345 80% 55%',
        tags: [
            'huggingface',
            'training',
            'fine-tuning',
            'trl',
            'gguf',
            'llm'
        ],
        stats: {
            power: 95,
            complexity: 75,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [
            {
                name: 'trl',
                type: 'python',
                url: 'https://huggingface.co/docs/trl'
            },
            {
                name: 'transformers',
                type: 'python'
            }
        ],
        source: {
            author: 'Hugging Face',
            url: 'https://huggingface.co'
        }
    },
    {
        id: 'hf-paper-publisher',
        name: 'Hugging Face Paper Publisher',
        shortName: 'HF Papers',
        description: 'Publish and manage research papers on Hugging Face Hub',
        longDescription: 'Publish research papers to Hugging Face Hub. Index papers, link to models and datasets, generate markdown. Bridge between academic research and practical ML artifacts.',
        category: 'ml',
        rarity: 'rare',
        icon: 'BookOpen',
        gradient: 'from-blue-500 via-indigo-500 to-violet-500',
        accentColor: '240 70% 55%',
        tags: [
            'huggingface',
            'papers',
            'research',
            'publishing',
            'academic'
        ],
        stats: {
            power: 75,
            complexity: 40,
            utility: 78
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Hugging Face',
            url: 'https://huggingface.co'
        }
    },
    {
        id: 'hf-tool-builder',
        name: 'Hugging Face Tool Builder',
        shortName: 'HF Tools',
        description: 'Create reusable automation scripts for HF',
        longDescription: 'Build reusable automation tools that chain HF APIs. Create custom workflows, batch operations, and task automation. Extend Claw AI\'s capabilities with custom HF integrations.',
        category: 'ml',
        rarity: 'rare',
        icon: 'Code',
        gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
        accentColor: '170 65% 45%',
        tags: [
            'huggingface',
            'tools',
            'automation',
            'api',
            'scripting'
        ],
        stats: {
            power: 80,
            complexity: 50,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [
            {
                name: 'huggingface_hub',
                type: 'python'
            }
        ],
        source: {
            author: 'Hugging Face',
            url: 'https://huggingface.co'
        }
    },
    {
        id: 'hf-trackio',
        name: 'Hugging Face Trackio',
        shortName: 'Trackio',
        description: 'Experiment tracking and visualization',
        longDescription: 'Track ML experiments with Trackio. Log metrics, visualize training runs, create dashboards on HF Spaces. Full experiment lifecycle management for Claw AI\'s ML work.',
        category: 'ml',
        rarity: 'rare',
        icon: 'Layout',
        gradient: 'from-indigo-500 via-purple-500 to-pink-500',
        accentColor: '270 70% 55%',
        tags: [
            'huggingface',
            'trackio',
            'experiments',
            'metrics',
            'visualization'
        ],
        stats: {
            power: 78,
            complexity: 45,
            utility: 82
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Hugging Face',
            url: 'https://huggingface.co'
        }
    },
    // ==========================================================================
    // SCIENTIFIC SKILLS
    // ==========================================================================
    {
        id: 'k-dense-scientific',
        name: 'K-Dense Scientific Skills',
        shortName: 'Science',
        description: '139 ready-to-use scientific research skills',
        longDescription: 'Comprehensive scientific toolkit covering 11 categories: Bioinformatics & Genomics, Cheminformatics & Drug Discovery, Proteomics & Structural Biology, Clinical Research, Scientific Databases (28+), Data Analysis, Quantum Computing, Machine Learning, Materials Science, Laboratory Automation, and Scientific Communication.',
        category: 'scientific',
        rarity: 'legendary',
        icon: 'FlaskConical',
        gradient: 'from-green-400 via-emerald-500 to-teal-600',
        accentColor: '160 70% 45%',
        tags: [
            'bioinformatics',
            'chemistry',
            'genomics',
            'quantum',
            'ml'
        ],
        stats: {
            power: 98,
            complexity: 85,
            utility: 65
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [
            {
                name: 'scanpy',
                type: 'python'
            },
            {
                name: 'biopython',
                type: 'python'
            },
            {
                name: 'rdkit',
                type: 'python'
            },
            {
                name: 'pytorch',
                type: 'python'
            },
            {
                name: 'qiskit',
                type: 'python',
                url: 'https://qiskit.org'
            }
        ],
        source: {
            author: 'K-Dense',
            url: 'https://k-dense.ai'
        }
    },
    // ==========================================================================
    // NGINITY SKILLS (alirezarezvani/claude-skills - 48 Production-Ready)
    // ==========================================================================
    // --- MARKETING (5 skills) ---
    {
        id: 'nginity-content-creator',
        name: 'Content Creator',
        shortName: 'Content',
        description: 'Create compelling marketing content across channels',
        longDescription: 'Professional content creation skill for marketing teams. Generate blog posts, social media content, email campaigns, landing page copy, and thought leadership articles. Optimized for engagement and conversion.',
        category: 'creative',
        rarity: 'rare',
        icon: 'PenTool',
        gradient: 'from-pink-500 via-rose-500 to-red-500',
        accentColor: '350 80% 55%',
        tags: [
            'marketing',
            'content',
            'copywriting',
            'social',
            'blogs'
        ],
        stats: {
            power: 80,
            complexity: 45,
            utility: 90
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-demand-acquisition',
        name: 'Demand & Acquisition',
        shortName: 'Demand',
        description: 'Drive demand generation and customer acquisition strategies',
        longDescription: 'Strategic skill for demand generation and customer acquisition. Develop go-to-market strategies, create lead generation campaigns, optimize conversion funnels, and build acquisition playbooks.',
        category: 'management',
        rarity: 'epic',
        icon: 'TrendingUp',
        gradient: 'from-emerald-500 via-green-500 to-lime-500',
        accentColor: '140 70% 50%',
        tags: [
            'marketing',
            'gtm',
            'leads',
            'conversion',
            'growth'
        ],
        stats: {
            power: 85,
            complexity: 60,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-marketing-strategy',
        name: 'Marketing Strategy',
        shortName: 'Strategy',
        description: 'Develop comprehensive marketing strategies and plans',
        longDescription: 'High-level marketing strategy development. Create brand positioning, market analysis, competitive intelligence, campaign planning, and marketing ROI frameworks. Think like a CMO.',
        category: 'management',
        rarity: 'epic',
        icon: 'Target',
        gradient: 'from-violet-500 via-purple-500 to-indigo-500',
        accentColor: '270 70% 55%',
        tags: [
            'marketing',
            'strategy',
            'brand',
            'positioning',
            'competitive'
        ],
        stats: {
            power: 90,
            complexity: 65,
            utility: 75
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-aso',
        name: 'App Store Optimization',
        shortName: 'ASO',
        description: 'Optimize app visibility and rankings in app stores',
        longDescription: 'Specialized skill for App Store Optimization. Keyword research, metadata optimization, A/B testing strategies, review management, and competitive analysis for iOS App Store and Google Play Store.',
        category: 'management',
        rarity: 'rare',
        icon: 'Smartphone',
        gradient: 'from-blue-500 via-sky-500 to-cyan-500',
        accentColor: '200 80% 55%',
        tags: [
            'aso',
            'app-store',
            'play-store',
            'mobile',
            'seo'
        ],
        stats: {
            power: 75,
            complexity: 50,
            utility: 70
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-social-analyzer',
        name: 'Social Media Analyzer',
        shortName: 'Social',
        description: 'Analyze social media performance and optimize presence',
        longDescription: 'Social media analytics and optimization skill. Track engagement metrics, analyze audience behavior, benchmark against competitors, and provide actionable insights for improving social media performance.',
        category: 'management',
        rarity: 'uncommon',
        icon: 'Share2',
        gradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
        accentColor: '320 70% 55%',
        tags: [
            'social',
            'analytics',
            'engagement',
            'instagram',
            'twitter'
        ],
        stats: {
            power: 70,
            complexity: 40,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    // --- C-LEVEL ADVISORY (2 skills) ---
    {
        id: 'nginity-ceo-advisor',
        name: 'CEO Advisor',
        shortName: 'CEO',
        description: 'Strategic advisory for executive leadership decisions',
        longDescription: 'Executive-level strategic advisor skill. Provide insights on business strategy, organizational design, investor relations, board communications, M&A considerations, and long-term vision planning.',
        category: 'management',
        rarity: 'legendary',
        icon: 'Crown',
        gradient: 'from-amber-400 via-yellow-500 to-orange-500',
        accentColor: '40 90% 55%',
        tags: [
            'executive',
            'strategy',
            'leadership',
            'business',
            'vision'
        ],
        stats: {
            power: 95,
            complexity: 80,
            utility: 60
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-cto-advisor',
        name: 'CTO Advisor',
        shortName: 'CTO',
        description: 'Technical leadership and architecture strategy guidance',
        longDescription: 'Chief Technology Officer advisory skill. Provide guidance on technology strategy, architecture decisions, engineering team scaling, build vs buy decisions, technical debt management, and innovation roadmaps.',
        category: 'development',
        rarity: 'legendary',
        icon: 'Cpu',
        gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
        accentColor: '210 80% 55%',
        tags: [
            'cto',
            'architecture',
            'strategy',
            'leadership',
            'technology'
        ],
        stats: {
            power: 95,
            complexity: 75,
            utility: 65
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    // --- PRODUCT TEAM (5 skills) ---
    {
        id: 'nginity-pm-toolkit',
        name: 'PM Toolkit',
        shortName: 'PMTools',
        description: 'Complete product management toolkit and frameworks',
        longDescription: 'Comprehensive product management toolkit. User story writing, prioritization frameworks (RICE, MoSCoW), roadmap planning, stakeholder management, and product analytics. Essential for product managers.',
        category: 'management',
        rarity: 'epic',
        icon: 'Briefcase',
        gradient: 'from-blue-500 via-indigo-500 to-violet-500',
        accentColor: '240 70% 55%',
        tags: [
            'product',
            'pm',
            'roadmap',
            'prioritization',
            'backlog'
        ],
        stats: {
            power: 85,
            complexity: 55,
            utility: 90
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-agile-po',
        name: 'Agile Product Owner',
        shortName: 'AgilePO',
        description: 'Agile product ownership and backlog management',
        longDescription: 'Agile Product Owner skill for Scrum and Kanban environments. Backlog refinement, sprint planning, acceptance criteria writing, velocity tracking, and stakeholder value delivery.',
        category: 'management',
        rarity: 'rare',
        icon: 'ListChecks',
        gradient: 'from-green-500 via-emerald-500 to-teal-500',
        accentColor: '160 70% 50%',
        tags: [
            'agile',
            'scrum',
            'backlog',
            'sprints',
            'kanban'
        ],
        stats: {
            power: 80,
            complexity: 50,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-product-strategist',
        name: 'Product Strategist',
        shortName: 'ProdStrat',
        description: 'Long-term product vision and market strategy',
        longDescription: 'Strategic product planning skill. Market analysis, product-market fit validation, competitive positioning, growth strategies, and multi-year product vision development.',
        category: 'management',
        rarity: 'epic',
        icon: 'Compass',
        gradient: 'from-orange-500 via-amber-500 to-yellow-500',
        accentColor: '35 85% 55%',
        tags: [
            'strategy',
            'vision',
            'market-fit',
            'growth',
            'planning'
        ],
        stats: {
            power: 88,
            complexity: 70,
            utility: 75
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-ux-researcher',
        name: 'UX Researcher',
        shortName: 'UXRes',
        description: 'User research methodologies and insights synthesis',
        longDescription: 'User experience research skill. Design and conduct user interviews, surveys, usability tests, create personas and journey maps, synthesize findings into actionable product insights.',
        category: 'design',
        rarity: 'rare',
        icon: 'Users',
        gradient: 'from-purple-500 via-violet-500 to-indigo-500',
        accentColor: '270 65% 55%',
        tags: [
            'ux',
            'research',
            'interviews',
            'personas',
            'usability'
        ],
        stats: {
            power: 80,
            complexity: 55,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-ui-design-system',
        name: 'UI Design System',
        shortName: 'DesignSys',
        description: 'Create and maintain scalable design systems',
        longDescription: 'Design system architecture skill. Create component libraries, define design tokens, establish style guides, ensure accessibility compliance, and maintain design-development consistency.',
        category: 'design',
        rarity: 'epic',
        icon: 'Layers',
        gradient: 'from-pink-500 via-fuchsia-500 to-purple-500',
        accentColor: '310 70% 55%',
        tags: [
            'design-system',
            'components',
            'tokens',
            'ui',
            'accessibility'
        ],
        stats: {
            power: 85,
            complexity: 65,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    // --- PROJECT MANAGEMENT (6 skills) ---
    {
        id: 'nginity-senior-pm',
        name: 'Senior Project Manager',
        shortName: 'SrPM',
        description: 'Enterprise-level project management expertise',
        longDescription: 'Senior project management skill for complex, multi-team initiatives. Risk management, resource allocation, stakeholder communication, milestone tracking, and cross-functional coordination.',
        category: 'management',
        rarity: 'epic',
        icon: 'FolderKanban',
        gradient: 'from-slate-500 via-gray-500 to-zinc-500',
        accentColor: '220 15% 50%',
        tags: [
            'project',
            'enterprise',
            'risk',
            'stakeholders',
            'planning'
        ],
        stats: {
            power: 85,
            complexity: 60,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-scrum-master',
        name: 'Scrum Master',
        shortName: 'Scrum',
        description: 'Facilitate Scrum ceremonies and team dynamics',
        longDescription: 'Certified Scrum Master skill. Facilitate daily standups, sprint planning, retrospectives, and reviews. Remove impediments, coach team on agile practices, and track velocity.',
        category: 'management',
        rarity: 'rare',
        icon: 'Users2',
        gradient: 'from-blue-500 via-sky-500 to-cyan-500',
        accentColor: '195 75% 50%',
        tags: [
            'scrum',
            'agile',
            'ceremonies',
            'coaching',
            'velocity'
        ],
        stats: {
            power: 75,
            complexity: 45,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-jira-expert',
        name: 'Jira Expert',
        shortName: 'Jira',
        description: 'Advanced Jira administration and workflow optimization',
        longDescription: 'Jira power user skill. Create custom workflows, design issue schemas, build dashboards, configure automation rules, and optimize Jira for team productivity.',
        category: 'management',
        rarity: 'uncommon',
        icon: 'Trello',
        gradient: 'from-blue-600 via-blue-500 to-sky-500',
        accentColor: '210 85% 50%',
        tags: [
            'jira',
            'atlassian',
            'workflows',
            'dashboards',
            'automation'
        ],
        stats: {
            power: 70,
            complexity: 50,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-confluence-expert',
        name: 'Confluence Expert',
        shortName: 'Confluence',
        description: 'Documentation and knowledge management in Confluence',
        longDescription: 'Confluence documentation skill. Create spaces, design templates, build knowledge bases, configure macros, and establish documentation standards for teams.',
        category: 'management',
        rarity: 'uncommon',
        icon: 'FileText',
        gradient: 'from-blue-500 via-indigo-500 to-violet-500',
        accentColor: '230 75% 55%',
        tags: [
            'confluence',
            'documentation',
            'wiki',
            'templates',
            'knowledge'
        ],
        stats: {
            power: 65,
            complexity: 40,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-atlassian-admin',
        name: 'Atlassian Administrator',
        shortName: 'AtlAdmin',
        description: 'Administer and configure Atlassian product suite',
        longDescription: 'Atlassian suite administration skill. Manage users and permissions, configure SSO, optimize performance, integrate tools, and maintain security across Jira, Confluence, and Bitbucket.',
        category: 'management',
        rarity: 'rare',
        icon: 'Settings',
        gradient: 'from-indigo-500 via-blue-500 to-sky-500',
        accentColor: '220 80% 55%',
        tags: [
            'atlassian',
            'admin',
            'sso',
            'permissions',
            'integration'
        ],
        stats: {
            power: 75,
            complexity: 60,
            utility: 70
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-template-creator',
        name: 'Template Creator',
        shortName: 'Templates',
        description: 'Create reusable templates for projects and documentation',
        longDescription: 'Template design skill for project management artifacts. Create issue templates, documentation templates, meeting notes templates, and standardized project structures.',
        category: 'management',
        rarity: 'uncommon',
        icon: 'Copy',
        gradient: 'from-gray-500 via-slate-500 to-zinc-500',
        accentColor: '220 10% 50%',
        tags: [
            'templates',
            'standards',
            'documentation',
            'reusable',
            'artifacts'
        ],
        stats: {
            power: 60,
            complexity: 35,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    // --- ENGINEERING (18 skills) ---
    {
        id: 'nginity-architect',
        name: 'Software Architect',
        shortName: 'Architect',
        description: 'Design scalable system architectures and patterns',
        longDescription: 'Senior software architect skill. Design microservices, define API contracts, create architectural decision records (ADRs), evaluate technology stacks, and ensure non-functional requirements.',
        category: 'development',
        rarity: 'legendary',
        icon: 'Building2',
        gradient: 'from-slate-600 via-gray-500 to-zinc-600',
        accentColor: '220 20% 45%',
        tags: [
            'architecture',
            'microservices',
            'adr',
            'patterns',
            'design'
        ],
        stats: {
            power: 95,
            complexity: 85,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-frontend',
        name: 'Frontend Engineer',
        shortName: 'Frontend',
        description: 'Build modern, responsive user interfaces',
        longDescription: 'Senior frontend engineering skill. React, Vue, Angular expertise. Component architecture, state management, performance optimization, accessibility, and modern CSS/animations.',
        category: 'development',
        rarity: 'rare',
        icon: 'Layout',
        gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
        accentColor: '200 80% 55%',
        tags: [
            'frontend',
            'react',
            'vue',
            'typescript',
            'css'
        ],
        stats: {
            power: 85,
            complexity: 60,
            utility: 90
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-backend',
        name: 'Backend Engineer',
        shortName: 'Backend',
        description: 'Build robust server-side applications and APIs',
        longDescription: 'Senior backend engineering skill. Node.js, Python, Go expertise. RESTful APIs, GraphQL, database design, caching strategies, message queues, and service architecture.',
        category: 'development',
        rarity: 'rare',
        icon: 'Server',
        gradient: 'from-green-500 via-emerald-500 to-teal-500',
        accentColor: '160 70% 45%',
        tags: [
            'backend',
            'api',
            'nodejs',
            'python',
            'databases'
        ],
        stats: {
            power: 85,
            complexity: 65,
            utility: 90
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-fullstack',
        name: 'Fullstack Engineer',
        shortName: 'Fullstack',
        description: 'End-to-end application development expertise',
        longDescription: 'Full-stack development skill bridging frontend and backend. Build complete features from database to UI. Understand the entire application stack and optimize for user experience.',
        category: 'development',
        rarity: 'epic',
        icon: 'Layers3',
        gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
        accentColor: '280 70% 55%',
        tags: [
            'fullstack',
            'web',
            'api',
            'database',
            'end-to-end'
        ],
        stats: {
            power: 88,
            complexity: 70,
            utility: 95
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-qa-engineer',
        name: 'QA Engineer',
        shortName: 'QA',
        description: 'Quality assurance testing and automation',
        longDescription: 'Quality assurance engineering skill. Write test plans, create automated tests, perform exploratory testing, regression testing, and establish QA best practices.',
        category: 'development',
        rarity: 'uncommon',
        icon: 'CheckCircle2',
        gradient: 'from-green-500 via-lime-500 to-yellow-500',
        accentColor: '100 70% 50%',
        tags: [
            'qa',
            'testing',
            'automation',
            'cypress',
            'jest'
        ],
        stats: {
            power: 75,
            complexity: 50,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-devops',
        name: 'DevOps Engineer',
        shortName: 'DevOps',
        description: 'CI/CD pipelines and infrastructure automation',
        longDescription: 'DevOps engineering skill. Build CI/CD pipelines, manage container orchestration, implement GitOps workflows, infrastructure as code, and monitoring/observability.',
        category: 'development',
        rarity: 'epic',
        icon: 'GitBranch',
        gradient: 'from-orange-500 via-amber-500 to-yellow-500',
        accentColor: '35 85% 55%',
        tags: [
            'devops',
            'cicd',
            'docker',
            'kubernetes',
            'terraform'
        ],
        stats: {
            power: 88,
            complexity: 75,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-secops',
        name: 'SecOps Engineer',
        shortName: 'SecOps',
        description: 'Security operations and incident response',
        longDescription: 'Security operations skill. Vulnerability scanning, security monitoring, incident response, threat detection, SIEM management, and security automation.',
        category: 'security',
        rarity: 'epic',
        icon: 'ShieldAlert',
        gradient: 'from-red-500 via-orange-500 to-amber-500',
        accentColor: '15 85% 50%',
        tags: [
            'secops',
            'security',
            'siem',
            'incident',
            'monitoring'
        ],
        stats: {
            power: 85,
            complexity: 70,
            utility: 75
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-code-reviewer',
        name: 'Code Reviewer',
        shortName: 'Review',
        description: 'Conduct thorough code reviews and provide feedback',
        longDescription: 'Expert code review skill. Analyze code quality, identify bugs and anti-patterns, suggest improvements, ensure coding standards, and provide constructive feedback.',
        category: 'development',
        rarity: 'rare',
        icon: 'GitPullRequest',
        gradient: 'from-blue-500 via-indigo-500 to-violet-500',
        accentColor: '240 70% 55%',
        tags: [
            'review',
            'code-quality',
            'feedback',
            'standards',
            'pr'
        ],
        stats: {
            power: 80,
            complexity: 55,
            utility: 90
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-security-engineer',
        name: 'Security Engineer',
        shortName: 'SecEng',
        description: 'Application and infrastructure security engineering',
        longDescription: 'Security engineering skill. Secure code review, penetration testing guidance, security architecture, authentication/authorization systems, and security compliance.',
        category: 'security',
        rarity: 'epic',
        icon: 'Lock',
        gradient: 'from-red-600 via-red-500 to-orange-500',
        accentColor: '5 80% 50%',
        tags: [
            'security',
            'appsec',
            'pentest',
            'auth',
            'compliance'
        ],
        stats: {
            power: 88,
            complexity: 75,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-aws-architect',
        name: 'AWS Solutions Architect',
        shortName: 'AWS',
        description: 'Design and implement AWS cloud architectures',
        longDescription: 'AWS Solutions Architect skill. Design highly available, cost-optimized architectures. EC2, Lambda, S3, RDS, EKS, CloudFormation, and AWS best practices.',
        category: 'development',
        rarity: 'epic',
        icon: 'Cloud',
        gradient: 'from-orange-500 via-amber-500 to-yellow-400',
        accentColor: '35 90% 55%',
        tags: [
            'aws',
            'cloud',
            'lambda',
            'ec2',
            'architecture'
        ],
        stats: {
            power: 90,
            complexity: 80,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-m365-manager',
        name: 'M365 Manager',
        shortName: 'M365',
        description: 'Administer Microsoft 365 and Azure AD',
        longDescription: 'Microsoft 365 administration skill. User management, license optimization, security policies, Teams configuration, SharePoint administration, and Azure AD.',
        category: 'management',
        rarity: 'rare',
        icon: 'Building',
        gradient: 'from-blue-600 via-blue-500 to-cyan-500',
        accentColor: '210 85% 50%',
        tags: [
            'm365',
            'azure',
            'teams',
            'sharepoint',
            'admin'
        ],
        stats: {
            power: 75,
            complexity: 60,
            utility: 75
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-tdd-guide',
        name: 'TDD Guide',
        shortName: 'TDD',
        description: 'Test-Driven Development coaching and implementation',
        longDescription: 'Test-Driven Development skill. Guide red-green-refactor cycles, write effective unit tests, design testable code, mocking strategies, and TDD best practices.',
        category: 'development',
        rarity: 'rare',
        icon: 'FlaskRound',
        gradient: 'from-green-500 via-emerald-500 to-cyan-500',
        accentColor: '155 70% 50%',
        tags: [
            'tdd',
            'testing',
            'unit-tests',
            'mocking',
            'bdd'
        ],
        stats: {
            power: 80,
            complexity: 55,
            utility: 85
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-tech-stack-evaluator',
        name: 'Tech Stack Evaluator',
        shortName: 'TechEval',
        description: 'Evaluate and recommend technology stacks',
        longDescription: 'Technology evaluation skill. Compare frameworks, assess scalability, evaluate ecosystem maturity, consider team skills, and provide technology selection recommendations.',
        category: 'development',
        rarity: 'rare',
        icon: 'Scale',
        gradient: 'from-purple-500 via-violet-500 to-indigo-500',
        accentColor: '265 70% 55%',
        tags: [
            'evaluation',
            'stack',
            'frameworks',
            'comparison',
            'decision'
        ],
        stats: {
            power: 80,
            complexity: 60,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-data-scientist',
        name: 'Data Scientist',
        shortName: 'DataSci',
        description: 'Statistical analysis and machine learning modeling',
        longDescription: 'Data science skill. Exploratory data analysis, statistical modeling, feature engineering, machine learning pipelines, A/B testing, and data storytelling.',
        category: 'ml',
        rarity: 'epic',
        icon: 'BarChart3',
        gradient: 'from-blue-500 via-indigo-500 to-purple-500',
        accentColor: '250 70% 55%',
        tags: [
            'data-science',
            'ml',
            'statistics',
            'analysis',
            'modeling'
        ],
        stats: {
            power: 88,
            complexity: 75,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-data-engineer',
        name: 'Data Engineer',
        shortName: 'DataEng',
        description: 'Build data pipelines and infrastructure',
        longDescription: 'Data engineering skill. Design ETL pipelines, data warehousing, streaming architectures, data quality frameworks, and orchestration with Airflow/Dagster.',
        category: 'ml',
        rarity: 'epic',
        icon: 'Workflow',
        gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
        accentColor: '210 75% 55%',
        tags: [
            'data-engineering',
            'etl',
            'pipelines',
            'warehouse',
            'airflow'
        ],
        stats: {
            power: 85,
            complexity: 70,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-ml-ai-engineer',
        name: 'ML/AI Engineer',
        shortName: 'MLEng',
        description: 'Build and deploy machine learning systems',
        longDescription: 'ML engineering skill. Model training and optimization, MLOps, model serving, feature stores, experiment tracking, and production ML system design.',
        category: 'ml',
        rarity: 'legendary',
        icon: 'Brain',
        gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
        accentColor: '280 75% 55%',
        tags: [
            'ml',
            'ai',
            'mlops',
            'tensorflow',
            'pytorch'
        ],
        stats: {
            power: 92,
            complexity: 85,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-prompt-engineer',
        name: 'Prompt Engineer',
        shortName: 'Prompts',
        description: 'Design effective prompts for AI models',
        longDescription: 'Prompt engineering skill. Chain-of-thought prompting, few-shot learning, prompt optimization, testing methodologies, and multi-model prompt strategies.',
        category: 'ml',
        rarity: 'rare',
        icon: 'MessageSquare',
        gradient: 'from-green-500 via-emerald-500 to-teal-500',
        accentColor: '160 70% 50%',
        tags: [
            'prompts',
            'ai',
            'llm',
            'optimization',
            'cot'
        ],
        stats: {
            power: 80,
            complexity: 55,
            utility: 90
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-cv-engineer',
        name: 'Computer Vision Engineer',
        shortName: 'CV',
        description: 'Build computer vision and image processing systems',
        longDescription: 'Computer vision engineering skill. Image classification, object detection, segmentation, OCR, video analysis, and deployment of vision models.',
        category: 'ml',
        rarity: 'epic',
        icon: 'Eye',
        gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
        accentColor: '330 70% 55%',
        tags: [
            'cv',
            'vision',
            'detection',
            'segmentation',
            'ocr'
        ],
        stats: {
            power: 88,
            complexity: 80,
            utility: 70
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    // --- REGULATORY & QUALITY (12 skills) ---
    {
        id: 'nginity-ra-manager',
        name: 'Regulatory Affairs Manager',
        shortName: 'RA',
        description: 'Navigate regulatory requirements and submissions',
        longDescription: 'Regulatory affairs management skill. FDA submissions, CE marking, regulatory strategy, clinical evidence requirements, and international registration processes.',
        category: 'management',
        rarity: 'legendary',
        icon: 'FileCheck',
        gradient: 'from-blue-600 via-indigo-600 to-violet-600',
        accentColor: '240 65% 50%',
        tags: [
            'regulatory',
            'fda',
            'ce',
            'compliance',
            'submissions'
        ],
        stats: {
            power: 90,
            complexity: 85,
            utility: 65
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-qmr',
        name: 'Quality Management Rep',
        shortName: 'QMR',
        description: 'Quality management system representation and oversight',
        longDescription: 'Quality Management Representative skill. QMS oversight, management review preparation, quality metrics, nonconformance management, and continuous improvement.',
        category: 'management',
        rarity: 'epic',
        icon: 'Award',
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        accentColor: '25 80% 55%',
        tags: [
            'quality',
            'qms',
            'management',
            'metrics',
            'improvement'
        ],
        stats: {
            power: 82,
            complexity: 65,
            utility: 70
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-iso13485',
        name: 'ISO 13485 Specialist',
        shortName: 'ISO13485',
        description: 'Medical device quality management systems',
        longDescription: 'ISO 13485 specialist skill. Medical device QMS implementation, documentation requirements, process controls, design controls, and supplier management per ISO 13485.',
        category: 'management',
        rarity: 'epic',
        icon: 'Stethoscope',
        gradient: 'from-teal-500 via-cyan-500 to-blue-500',
        accentColor: '185 70% 50%',
        tags: [
            'iso13485',
            'medical',
            'quality',
            'compliance',
            'devices'
        ],
        stats: {
            power: 85,
            complexity: 75,
            utility: 60
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-capa-officer',
        name: 'CAPA Officer',
        shortName: 'CAPA',
        description: 'Corrective and Preventive Action management',
        longDescription: 'CAPA management skill. Root cause analysis, corrective action planning, effectiveness verification, trend analysis, and CAPA documentation.',
        category: 'management',
        rarity: 'rare',
        icon: 'AlertCircle',
        gradient: 'from-red-500 via-orange-500 to-yellow-500',
        accentColor: '20 80% 55%',
        tags: [
            'capa',
            'corrective',
            'preventive',
            'rca',
            'quality'
        ],
        stats: {
            power: 78,
            complexity: 60,
            utility: 75
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-doc-manager',
        name: 'Documentation Manager',
        shortName: 'DocMgr',
        description: 'Technical documentation and document control',
        longDescription: 'Documentation management skill. Document control procedures, technical writing, SOP creation, document review workflows, and version control for regulated environments.',
        category: 'management',
        rarity: 'rare',
        icon: 'Files',
        gradient: 'from-gray-500 via-slate-500 to-zinc-500',
        accentColor: '220 15% 45%',
        tags: [
            'documentation',
            'sop',
            'control',
            'technical-writing',
            'version'
        ],
        stats: {
            power: 70,
            complexity: 50,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-risk-management',
        name: 'Risk Management Specialist',
        shortName: 'Risk',
        description: 'Product and process risk assessment',
        longDescription: 'Risk management skill per ISO 14971. FMEA, hazard analysis, risk control measures, risk-benefit analysis, and post-market risk monitoring.',
        category: 'management',
        rarity: 'epic',
        icon: 'AlertTriangle',
        gradient: 'from-amber-500 via-yellow-500 to-lime-500',
        accentColor: '45 85% 55%',
        tags: [
            'risk',
            'fmea',
            'iso14971',
            'hazard',
            'assessment'
        ],
        stats: {
            power: 85,
            complexity: 70,
            utility: 75
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-iso27001',
        name: 'ISO 27001 Specialist',
        shortName: 'ISO27001',
        description: 'Information security management systems',
        longDescription: 'ISO 27001 specialist skill. ISMS implementation, security controls, risk assessment, policy development, and certification preparation.',
        category: 'security',
        rarity: 'epic',
        icon: 'ShieldCheck',
        gradient: 'from-blue-600 via-indigo-500 to-violet-500',
        accentColor: '240 70% 55%',
        tags: [
            'iso27001',
            'isms',
            'security',
            'compliance',
            'controls'
        ],
        stats: {
            power: 85,
            complexity: 75,
            utility: 70
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-mdr-2017-745',
        name: 'MDR 2017/745 Expert',
        shortName: 'MDR',
        description: 'EU Medical Device Regulation compliance',
        longDescription: 'MDR expert skill. European medical device regulation, technical documentation, clinical evaluation, UDI requirements, and post-market surveillance.',
        category: 'management',
        rarity: 'legendary',
        icon: 'FileSpreadsheet',
        gradient: 'from-blue-500 via-indigo-600 to-purple-600',
        accentColor: '245 70% 55%',
        tags: [
            'mdr',
            'eu',
            'medical',
            'regulation',
            'compliance'
        ],
        stats: {
            power: 92,
            complexity: 90,
            utility: 60
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-fda-consultant',
        name: 'FDA Consultant',
        shortName: 'FDA',
        description: 'FDA regulatory pathway and submission expertise',
        longDescription: 'FDA regulatory consultant skill. 510(k), PMA, De Novo pathways, FDA meetings, submission preparation, and post-market requirements.',
        category: 'management',
        rarity: 'legendary',
        icon: 'Landmark',
        gradient: 'from-red-500 via-rose-500 to-pink-500',
        accentColor: '350 75% 55%',
        tags: [
            'fda',
            '510k',
            'pma',
            'regulatory',
            'submissions'
        ],
        stats: {
            power: 93,
            complexity: 88,
            utility: 60
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-qms-audit',
        name: 'QMS Auditor',
        shortName: 'QMSAudit',
        description: 'Quality management system auditing',
        longDescription: 'QMS audit skill. Internal audit planning, audit execution, finding classification, audit reporting, and corrective action tracking.',
        category: 'management',
        rarity: 'rare',
        icon: 'ClipboardCheck',
        gradient: 'from-emerald-500 via-green-500 to-lime-500',
        accentColor: '140 70% 50%',
        tags: [
            'audit',
            'qms',
            'internal',
            'findings',
            'compliance'
        ],
        stats: {
            power: 78,
            complexity: 60,
            utility: 75
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-isms-audit',
        name: 'ISMS Auditor',
        shortName: 'ISMSAudit',
        description: 'Information security management system auditing',
        longDescription: 'ISMS audit skill. Security control assessment, gap analysis, audit evidence collection, finding documentation, and remediation tracking.',
        category: 'security',
        rarity: 'rare',
        icon: 'SearchCheck',
        gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
        accentColor: '210 75% 55%',
        tags: [
            'audit',
            'isms',
            'security',
            'controls',
            'assessment'
        ],
        stats: {
            power: 78,
            complexity: 65,
            utility: 70
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    {
        id: 'nginity-gdpr-expert',
        name: 'GDPR Expert',
        shortName: 'GDPR',
        description: 'Data privacy and GDPR compliance',
        longDescription: 'GDPR compliance skill. Data protection impact assessments, privacy policy creation, consent management, data subject rights, and breach notification procedures.',
        category: 'security',
        rarity: 'epic',
        icon: 'UserCheck',
        gradient: 'from-indigo-500 via-violet-500 to-purple-500',
        accentColor: '260 70% 55%',
        tags: [
            'gdpr',
            'privacy',
            'dpia',
            'consent',
            'data-protection'
        ],
        stats: {
            power: 85,
            complexity: 70,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [],
        dependencies: [],
        source: {
            author: 'Nginity/alirezarezvani',
            url: 'https://github.com/alirezarezvani/claude-skills',
            license: 'MIT'
        }
    },
    // ==========================================================================
    // CLAUDE CODE SKILLS (IndyDevDan)
    // ==========================================================================
    {
        id: 'claude-code-hooks',
        name: 'Claude Code Hooks',
        shortName: 'Hooks',
        description: 'Deterministic control over Claude Code behavior with 13 lifecycle hooks',
        longDescription: 'Master the 13 Claude Code lifecycle hooks for programmatic control. PreToolUse blocks dangerous commands, PostToolUse auto-formats code, SessionStart injects context, Stop hooks ensure task completion. Exit codes control flow: 0 allows, 2 blocks. Build auditable, reproducible agent workflows.',
        category: 'automation',
        rarity: 'legendary',
        icon: 'Anchor',
        gradient: 'from-yellow-500 via-amber-500 to-orange-500',
        accentColor: '40 90% 50%',
        tags: [
            'claude-code',
            'hooks',
            'lifecycle',
            'security',
            'automation',
            'deterministic'
        ],
        stats: {
            power: 95,
            complexity: 70,
            utility: 90
        },
        defaultMode: 'on',
        commands: [
            {
                name: 'PreToolUse',
                syntax: 'exit 2 to block',
                description: 'Validate before tool execution'
            },
            {
                name: 'PostToolUse',
                syntax: 'exit 0 always',
                description: 'React after tool completes'
            },
            {
                name: 'SessionStart',
                syntax: 'stdout to context',
                description: 'Inject context on start'
            },
            {
                name: 'Stop',
                syntax: 'exit 2 to continue',
                description: 'Control session completion'
            }
        ],
        dependencies: [
            {
                name: 'jq',
                type: 'cli',
                installCommand: 'brew install jq'
            },
            {
                name: 'claude-code',
                type: 'cli',
                url: 'https://claude.ai/code'
            }
        ],
        source: {
            author: 'IndyDevDan',
            url: 'https://github.com/disler/claude-code-hooks-mastery',
            license: 'MIT'
        }
    },
    {
        id: 'claude-code-subagents',
        name: 'Claude Code Subagents',
        shortName: 'Subagents',
        description: 'Create specialized AI subagents with custom prompts and tool restrictions',
        longDescription: 'Design and orchestrate specialized subagents for task-specific workflows. Each agent runs in isolated context with custom system prompts, tool access, and permissions. Built-in Explore (read-only), Plan (research), and general-purpose agents. Create custom agents in .claude/agents/ with YAML frontmatter.',
        category: 'automation',
        rarity: 'epic',
        icon: 'Users',
        gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
        accentColor: '210 80% 55%',
        tags: [
            'claude-code',
            'subagents',
            'orchestration',
            'delegation',
            'specialized'
        ],
        stats: {
            power: 90,
            complexity: 65,
            utility: 85
        },
        defaultMode: 'on',
        commands: [
            {
                name: 'create',
                syntax: '.claude/agents/name.md',
                description: 'Define subagent config'
            },
            {
                name: 'invoke',
                syntax: 'Use the [agent] to...',
                description: 'Delegate to subagent'
            },
            {
                name: 'background',
                syntax: 'Ctrl+B',
                description: 'Run agent in background'
            },
            {
                name: 'resume',
                syntax: 'Continue that...',
                description: 'Resume previous agent'
            }
        ],
        dependencies: [
            {
                name: 'claude-code',
                type: 'cli',
                url: 'https://claude.ai/code'
            }
        ],
        source: {
            author: 'IndyDevDan',
            url: 'https://github.com/disler/claude-code-hooks-mastery',
            license: 'MIT'
        }
    },
    {
        id: 'team-based-validation',
        name: 'Team-Based Validation',
        shortName: 'TeamVal',
        description: 'Orchestrate builder/validator agent teams for quality workflows',
        longDescription: 'Separate implementation from validation with specialized agent teams. Builder agents have full tool access for implementation. Validator agents have read-only access for verification. Chain agents for sequential workflows. Parallel review with security, performance, and test specialists. Quality gates with Stop hooks.',
        category: 'management',
        rarity: 'legendary',
        icon: 'CheckCircle2',
        gradient: 'from-emerald-500 via-green-500 to-teal-500',
        accentColor: '150 70% 45%',
        tags: [
            'claude-code',
            'validation',
            'builder',
            'quality',
            'teams',
            'orchestration'
        ],
        stats: {
            power: 92,
            complexity: 60,
            utility: 88
        },
        defaultMode: 'on',
        commands: [
            {
                name: 'plan_w_team',
                syntax: '/plan_w_team [task]',
                description: 'Builder/validator workflow'
            },
            {
                name: 'cook',
                syntax: '/cook [task]',
                description: 'Full team quality build'
            },
            {
                name: 'validate',
                syntax: '/validate',
                description: 'Run validation checks'
            }
        ],
        dependencies: [
            {
                name: 'claude-code',
                type: 'cli',
                url: 'https://claude.ai/code'
            }
        ],
        source: {
            author: 'IndyDevDan',
            url: 'https://github.com/disler/claude-code-hooks-mastery',
            license: 'MIT'
        }
    },
    {
        id: 'academic-illustration',
        name: 'Academic Illustration',
        shortName: 'AcadFig',
        description: 'Generate publication-ready academic illustrations and diagrams',
        longDescription: 'Based on PaperBanana framework for automating academic illustration. Generate methodology diagrams, statistical plots, concept diagrams, and architecture visuals. Faithfulness-first principles ensure accuracy. Self-critique workflow for iterative refinement. Accessible color palettes (colorblind-safe). Works for NeurIPS, ICML, ACL papers.',
        category: 'scientific',
        rarity: 'rare',
        icon: 'PenTool',
        gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
        accentColor: '270 70% 55%',
        tags: [
            'academic',
            'illustration',
            'diagrams',
            'papers',
            'visualization',
            'research'
        ],
        stats: {
            power: 80,
            complexity: 55,
            utility: 75
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'methodology',
                syntax: 'Create methodology diagram for...',
                description: 'System architecture figures'
            },
            {
                name: 'plot',
                syntax: 'Generate bar chart showing...',
                description: 'Statistical visualizations'
            },
            {
                name: 'concept',
                syntax: 'Illustrate the concept of...',
                description: 'Theoretical diagrams'
            }
        ],
        dependencies: [
            {
                name: 'matplotlib',
                type: 'python'
            },
            {
                name: 'tikz',
                type: 'native'
            }
        ],
        source: {
            author: 'PaperBanana (Peking/Google)',
            url: 'https://arxiv.org/abs/2601.23265',
            license: 'Research'
        }
    },
    {
        id: 'threejs-excellence',
        name: 'Three.js Excellence',
        shortName: 'Three.js',
        description: 'Create exceptional 3D web experiences with React Three Fiber',
        longDescription: 'Comprehensive Three.js mastery for 3D web experiences. Seven gallery types (Sphere, Carousel, Helix, Grid, Wave, Tunnel, Floating). Fibonacci sphere distribution. Custom shaders for unique aesthetics. Performance patterns: useMemo for geometry, object pooling, proper disposal. Includes PBR materials, post-processing effects, and interactive controls.',
        category: 'development',
        rarity: 'epic',
        icon: 'Boxes',
        gradient: 'from-purple-500 via-pink-500 to-rose-500',
        accentColor: '330 80% 55%',
        tags: [
            'threejs',
            '3d',
            'webgl',
            'react-three-fiber',
            'shaders',
            'galleries'
        ],
        stats: {
            power: 88,
            complexity: 75,
            utility: 70
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'sphere',
                syntax: '<SphereGallery images={} />',
                description: 'Fibonacci sphere layout'
            },
            {
                name: 'carousel',
                syntax: '<CarouselGallery images={} />',
                description: 'Reflective carousel'
            },
            {
                name: 'helix',
                syntax: '<HelixGallery images={} />',
                description: 'DNA helix timeline'
            },
            {
                name: 'wave',
                syntax: '<WaveGallery images={} />',
                description: 'Undulating wave grid'
            }
        ],
        dependencies: [
            {
                name: '@react-three/fiber',
                type: 'npm',
                url: 'https://docs.pmnd.rs/react-three-fiber'
            },
            {
                name: '@react-three/drei',
                type: 'npm',
                url: 'https://github.com/pmndrs/drei'
            },
            {
                name: 'three',
                type: 'npm',
                url: 'https://threejs.org'
            }
        ],
        source: {
            author: 'Claw AI',
            license: 'Proprietary'
        }
    },
    {
        id: '0din-security-research',
        name: '0DIN Security Research',
        shortName: '0DIN',
        description: 'AI security research toolkit for ethical jailbreaking evaluation',
        longDescription: 'Advanced AI security research based on 0din.ai methodology. Jailbreak Evaluation Framework (JEF) scores 0-10 measuring Blast Radius, Retargetability, and Fidelity. Taxonomy of attack types: encoding, role-play, context manipulation, prompt injection, semantic, and logic attacks. Agent 0DIN CTF for gamified practice.',
        category: 'security',
        rarity: 'legendary',
        icon: 'Shield',
        gradient: 'from-red-500 via-orange-500 to-yellow-500',
        accentColor: '30 90% 50%',
        tags: [
            'security',
            'jailbreak',
            'red-team',
            'ai-safety',
            'ctf',
            '0din'
        ],
        stats: {
            power: 95,
            complexity: 80,
            utility: 65
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'jef_score',
                syntax: 'Calculate JEF score',
                description: 'Quantify jailbreak severity 0-10'
            },
            {
                name: 'classify',
                syntax: 'Classify attack type',
                description: 'Categorize jailbreak technique'
            },
            {
                name: 'ctf',
                syntax: 'Run CTF challenge',
                description: 'Gamified security practice'
            }
        ],
        dependencies: [],
        source: {
            author: '0din.ai',
            url: 'https://0din.ai',
            license: 'Research'
        }
    },
    {
        id: 'actionbook-automation',
        name: 'Actionbook Web Automation',
        shortName: 'Actionbook',
        description: 'Pre-built action manuals for 10x faster web automation',
        longDescription: 'Actionbook provides pre-built action manuals for web automation. Instead of reading entire pages, agents get clear manuals: what the page is, where buttons are, what to click and in which order. 100x fewer tokens. Supports Twitter, LinkedIn, Airbnb, and more. CLI for searching, executing, and managing browser automation.',
        category: 'automation',
        rarity: 'rare',
        icon: 'BookOpen',
        gradient: 'from-teal-500 via-cyan-500 to-blue-500',
        accentColor: '190 75% 50%',
        tags: [
            'automation',
            'browser',
            'web',
            'actionbook',
            'manuals',
            'chromium'
        ],
        stats: {
            power: 82,
            complexity: 45,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'search',
                syntax: 'actionbook search "<query>"',
                description: 'Find action manuals'
            },
            {
                name: 'get',
                syntax: 'actionbook get <action-id>',
                description: 'Get specific action'
            },
            {
                name: 'run',
                syntax: 'actionbook browser run <id>',
                description: 'Execute automation'
            },
            {
                name: 'sources',
                syntax: 'actionbook sources',
                description: 'List supported websites'
            }
        ],
        dependencies: [
            {
                name: '@actionbookdev/cli',
                type: 'npm',
                installCommand: 'npm install -g @actionbookdev/cli'
            }
        ],
        source: {
            author: 'Actionbook',
            url: 'https://actionbook.dev',
            license: 'Commercial'
        }
    },
    {
        id: 'git-workflow-discipline',
        name: 'Git Workflow Discipline',
        shortName: 'Git Flow',
        description: 'Branch strategy, conventional commits, and merge discipline for clean git history',
        longDescription: 'Comprehensive git workflow practices including branch naming conventions, conventional commit messages, merge discipline, and AI agent guidelines. Covers feature branches, hotfixes, release management, and conflict prevention. Essential for maintaining clean, navigable project history.',
        category: 'management',
        rarity: 'rare',
        icon: 'GitBranch',
        gradient: 'from-orange-500 via-red-500 to-pink-500',
        accentColor: '15 85% 55%',
        tags: [
            'git',
            'workflow',
            'commits',
            'branches',
            'version-control'
        ],
        stats: {
            power: 70,
            complexity: 40,
            utility: 95
        },
        defaultMode: 'on',
        commands: [
            {
                name: 'branch',
                syntax: 'git checkout -b <type>/<description>',
                description: 'Create feature branch'
            },
            {
                name: 'commit',
                syntax: 'git commit -m "<type>(<scope>): <desc>"',
                description: 'Conventional commit'
            },
            {
                name: 'merge',
                syntax: 'git merge --no-ff <branch>',
                description: 'Merge with history'
            },
            {
                name: 'rebase',
                syntax: 'git rebase -i HEAD~<n>',
                description: 'Clean up commits'
            }
        ],
        dependencies: [
            {
                name: 'git',
                type: 'cli'
            }
        ],
        source: {
            author: 'Claw AI',
            license: 'Proprietary'
        }
    },
    {
        id: 'changeset-versioning',
        name: 'Changeset & Versioning',
        shortName: 'Versioning',
        description: 'Semantic versioning with changesets for predictable releases',
        longDescription: 'Manage version bumps and changelogs with the changesets workflow. Follows semantic versioning (MAJOR.MINOR.PATCH) with clear rules for breaking changes, features, and fixes. Integrates with CI/CD for automated releases. Memory integration tracks version decisions over time.',
        category: 'management',
        rarity: 'rare',
        icon: 'Tag',
        gradient: 'from-emerald-500 via-green-500 to-lime-500',
        accentColor: '145 75% 45%',
        tags: [
            'versioning',
            'semver',
            'changelog',
            'releases',
            'npm'
        ],
        stats: {
            power: 65,
            complexity: 35,
            utility: 80
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'add',
                syntax: 'pnpm changeset',
                description: 'Create changeset for changes'
            },
            {
                name: 'version',
                syntax: 'pnpm changeset version',
                description: 'Apply version bumps'
            },
            {
                name: 'publish',
                syntax: 'pnpm changeset publish',
                description: 'Publish to npm'
            },
            {
                name: 'status',
                syntax: 'pnpm changeset status',
                description: 'Check pending changes'
            }
        ],
        dependencies: [
            {
                name: '@changesets/cli',
                type: 'npm',
                installCommand: 'pnpm add -D @changesets/cli'
            }
        ],
        source: {
            author: 'Changesets Team',
            url: 'https://github.com/changesets/changesets',
            license: 'MIT'
        }
    },
    {
        id: 'release-notes',
        name: 'Release Notes Generation',
        shortName: 'Release Notes',
        description: 'Generate audience-aware release notes from commits and changesets',
        longDescription: 'Create release notes tailored for different audiences: technical changelogs for developers, marketing announcements for users, executive summaries for stakeholders. Transforms commit history into compelling narratives. Supports multiple formats: markdown, HTML, JSON.',
        category: 'management',
        rarity: 'uncommon',
        icon: 'FileText',
        gradient: 'from-blue-500 via-indigo-500 to-violet-500',
        accentColor: '230 70% 55%',
        tags: [
            'releases',
            'documentation',
            'changelog',
            'marketing',
            'communication'
        ],
        stats: {
            power: 60,
            complexity: 30,
            utility: 75
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'generate',
                syntax: '/release-notes <version>',
                description: 'Generate release notes'
            },
            {
                name: 'preview',
                syntax: '/release-notes preview',
                description: 'Preview unreleased changes'
            },
            {
                name: 'format',
                syntax: '/release-notes --format <type>',
                description: 'Choose output format'
            }
        ],
        dependencies: [],
        source: {
            author: 'Claw AI',
            license: 'Proprietary'
        }
    },
    {
        id: 'project-modes',
        name: 'Project Modes',
        shortName: 'Modes',
        description: 'Six distinct operational modes for different project contexts',
        longDescription: 'Switch between optimized workflows for different situations. Explore mode for learning and prototyping. Build mode for focused implementation. Structured mode for complex projects with full BMAD lifecycle. Client mode for external deliverables with audit trails. Maintenance mode for bugs and updates. Collab mode for team coordination.',
        category: 'management',
        rarity: 'epic',
        icon: 'Layers',
        gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
        accentColor: '290 80% 60%',
        tags: [
            'workflow',
            'modes',
            'context',
            'productivity',
            'switching'
        ],
        stats: {
            power: 85,
            complexity: 50,
            utility: 90
        },
        defaultMode: 'auto',
        commands: [
            {
                name: 'explore',
                syntax: '/mode explore',
                description: 'Light process, heavy learning'
            },
            {
                name: 'build',
                syntax: '/mode build',
                description: 'Focused implementation'
            },
            {
                name: 'structured',
                syntax: '/mode structured',
                description: 'Full BMAD lifecycle'
            },
            {
                name: 'client',
                syntax: '/mode client <name>',
                description: 'External deliverables'
            },
            {
                name: 'maintenance',
                syntax: '/mode maintenance',
                description: 'Bug fixes and updates'
            },
            {
                name: 'collab',
                syntax: '/mode collab',
                description: 'Team coordination'
            }
        ],
        dependencies: [],
        source: {
            author: 'Claw AI',
            license: 'Proprietary'
        }
    },
    {
        id: 'project-context-memory',
        name: 'Project Context Memory',
        shortName: 'Memory',
        description: 'RLM integration for persistent project context across sessions',
        longDescription: 'Integrate Recursive Memory Layer (RLM) into project workflows. Track decisions, learnings, and context that persists across sessions. Episodic memory for events, semantic memory for knowledge, working memory for active context. Memory patterns optimized for each project mode.',
        category: 'management',
        rarity: 'legendary',
        icon: 'Brain',
        gradient: 'from-cyan-500 via-blue-500 to-purple-500',
        accentColor: '200 85% 55%',
        tags: [
            'memory',
            'context',
            'learning',
            'persistence',
            'rlm'
        ],
        stats: {
            power: 90,
            complexity: 55,
            utility: 85
        },
        defaultMode: 'on',
        commands: [
            {
                name: 'memorize',
                syntax: 'memorize({ content, importance, tags })',
                description: 'Store episodic memory'
            },
            {
                name: 'learn',
                syntax: 'learn({ category, content, confidence })',
                description: 'Store semantic knowledge'
            },
            {
                name: 'recall',
                syntax: 'recall("<query>")',
                description: 'Search memories'
            },
            {
                name: 'forget',
                syntax: 'forget({ type, tags })',
                description: 'Remove outdated memories'
            }
        ],
        dependencies: [
            {
                name: 'convex',
                type: 'npm',
                url: 'https://convex.dev'
            }
        ],
        source: {
            author: 'Claw AI',
            license: 'Proprietary'
        }
    }
];
function getSkillById(id) {
    return SKILLS_REGISTRY.find((skill)=>skill.id === id);
}
function getSkillsByCategory(category) {
    return SKILLS_REGISTRY.filter((skill)=>skill.category === category);
}
function getSkillsByRarity(rarity) {
    return SKILLS_REGISTRY.filter((skill)=>skill.rarity === rarity);
}
function searchSkills(query) {
    const lower = query.toLowerCase();
    return SKILLS_REGISTRY.filter((skill)=>skill.name.toLowerCase().includes(lower) || skill.description.toLowerCase().includes(lower) || skill.tags.some((tag)=>tag.toLowerCase().includes(lower)));
}
const CATEGORY_INFO = {
    automation: {
        label: 'Automation',
        icon: 'Bot',
        color: 'from-blue-500 to-cyan-500'
    },
    development: {
        label: 'Development',
        icon: 'Code',
        color: 'from-green-500 to-emerald-500'
    },
    design: {
        label: 'Design',
        icon: 'Palette',
        color: 'from-pink-500 to-rose-500'
    },
    scientific: {
        label: 'Scientific',
        icon: 'FlaskConical',
        color: 'from-purple-500 to-violet-500'
    },
    management: {
        label: 'Management',
        icon: 'Briefcase',
        color: 'from-amber-500 to-orange-500'
    },
    creative: {
        label: 'Creative',
        icon: 'Wand2',
        color: 'from-fuchsia-500 to-pink-500'
    },
    security: {
        label: 'Security',
        icon: 'Shield',
        color: 'from-red-500 to-orange-500'
    },
    ml: {
        label: 'ML & AI',
        icon: 'Brain',
        color: 'from-violet-500 to-purple-500'
    }
};
const RARITY_INFO = {
    common: {
        label: 'Common',
        color: 'text-gray-400',
        glow: 'shadow-gray-500/20'
    },
    uncommon: {
        label: 'Uncommon',
        color: 'text-green-400',
        glow: 'shadow-green-500/30'
    },
    rare: {
        label: 'Rare',
        color: 'text-blue-400',
        glow: 'shadow-blue-500/40'
    },
    epic: {
        label: 'Epic',
        color: 'text-purple-400',
        glow: 'shadow-purple-500/50'
    },
    legendary: {
        label: 'Legendary',
        color: 'text-amber-400',
        glow: 'shadow-amber-500/60'
    }
};
}),
"[project]/src/lib/claw-ai/tools.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Claw AI Tools - Tool definitions for search and actions
 *
 * These tools enable Claw AI to:
 * - Search portfolio projects, skills, and experience
 * - Navigate users to specific pages
 * - Schedule calls
 */ __turbopack_context__.s([
    "CLAW_AI_TOOLS",
    ()=>CLAW_AI_TOOLS,
    "NAVIGATION_DESTINATIONS",
    ()=>NAVIGATION_DESTINATIONS,
    "getOpenAITools",
    ()=>getOpenAITools,
    "parseToolCalls",
    ()=>parseToolCalls,
    "toOpenAITools",
    ()=>toOpenAITools
]);
const NAVIGATION_DESTINATIONS = [
    'home',
    'story',
    'design',
    'resume',
    'projects',
    'blog',
    'music',
    'humans',
    'themes',
    'photos',
    'search',
    'video',
    'canvas'
];
const CLAW_AI_TOOLS = [
    {
        name: 'search_system',
        description: 'Search through the system including projects, skills, work experience, and educational architecture. Use this when users ask about system capabilities, background, or modules.',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'The search query. Can be a technology name (React, AI), skill, company name, project name, or general topic.'
                },
                category: {
                    type: 'string',
                    description: 'Optional filter by category',
                    enum: [
                        'projects',
                        'skills',
                        'work',
                        'education',
                        'all'
                    ]
                }
            },
            required: [
                'query'
            ]
        }
    },
    {
        name: 'navigate_to',
        description: 'Navigate the user to a specific page in the workspace. Use this when users want to see specific content like the design showcase, system modules, projects, blog, or music.',
        parameters: {
            type: 'object',
            properties: {
                destination: {
                    type: 'string',
                    description: 'The page to navigate to',
                    enum: [
                        ...NAVIGATION_DESTINATIONS
                    ]
                },
                theme: {
                    type: 'string',
                    description: 'Optional theme name to apply when navigating (e.g., "claude", "cyberpunk", "nature")'
                }
            },
            required: [
                'destination'
            ]
        }
    },
    {
        name: 'schedule_call',
        description: 'Open the calendar to schedule a call with the system owner. Use this when users express interest in connecting or collaborating.',
        parameters: {
            type: 'object',
            properties: {
                topic: {
                    type: 'string',
                    description: 'The topic or reason for the call to prefill in the calendar'
                }
            },
            required: []
        }
    },
    {
        name: 'get_available_times',
        description: 'Get available meeting times for a specific date. Use this when users ask about availability or want to know when they can schedule a meeting.',
        parameters: {
            type: 'object',
            properties: {
                date: {
                    type: 'string',
                    description: 'The date to check availability for in YYYY-MM-DD format. If not provided, defaults to today.'
                },
                duration: {
                    type: 'number',
                    description: 'The meeting duration in minutes. Defaults to 30 minutes if not specified.'
                }
            },
            required: []
        }
    },
    {
        name: 'get_upcoming_bookings',
        description: 'Get the upcoming scheduled meetings. Use this when users ask about the schedule or upcoming appointments.',
        parameters: {
            type: 'object',
            properties: {
                limit: {
                    type: 'number',
                    description: 'Maximum number of bookings to return. Defaults to 5.'
                }
            },
            required: []
        }
    },
    {
        name: 'book_meeting',
        description: 'Book a meeting directly. Use this when a user wants to schedule a specific time slot and has provided their name and email.',
        parameters: {
            type: 'object',
            properties: {
                guestName: {
                    type: 'string',
                    description: 'The name of the person booking the meeting.'
                },
                guestEmail: {
                    type: 'string',
                    description: 'The email address of the person booking the meeting.'
                },
                startTime: {
                    type: 'number',
                    description: 'The Unix timestamp for the meeting start time.'
                },
                topic: {
                    type: 'string',
                    description: 'The topic or reason for the meeting.'
                },
                duration: {
                    type: 'number',
                    description: 'Meeting duration in minutes. Defaults to 30.'
                }
            },
            required: [
                'guestName',
                'guestEmail',
                'startTime'
            ]
        }
    },
    {
        name: 'reschedule_meeting',
        description: 'Reschedule an existing meeting to a new time. Use this when a user wants to change the time of an already scheduled meeting.',
        parameters: {
            type: 'object',
            properties: {
                bookingId: {
                    type: 'string',
                    description: 'The ID of the booking to reschedule.'
                },
                newStartTime: {
                    type: 'number',
                    description: 'The new Unix timestamp for the meeting start time.'
                }
            },
            required: [
                'bookingId',
                'newStartTime'
            ]
        }
    },
    {
        name: 'cancel_meeting',
        description: 'Cancel a scheduled meeting. Use this when a user wants to cancel an existing booking.',
        parameters: {
            type: 'object',
            properties: {
                bookingId: {
                    type: 'string',
                    description: 'The ID of the booking to cancel.'
                },
                reason: {
                    type: 'string',
                    description: 'Optional reason for cancellation.'
                }
            },
            required: [
                'bookingId'
            ]
        }
    },
    {
        name: 'list_themes',
        description: 'List all available design themes in the workspace. Use this when users ask about themes, design options, or want to explore the design showcase.',
        parameters: {
            type: 'object',
            properties: {
                category: {
                    type: 'string',
                    description: 'Optional filter by theme style',
                    enum: [
                        'all',
                        'dark',
                        'light',
                        'colorful',
                        'minimal'
                    ]
                }
            },
            required: []
        }
    },
    {
        name: 'open_search_app',
        description: 'Open the Search app with a specific query. Use this when users want to explore search results in detail, or when search results would be better viewed in the full Search app rather than inline in chat. This closes the Claw AI chat and opens the Search app with the query pre-filled.',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'The search query to pre-fill in the Search app'
                }
            },
            required: [
                'query'
            ]
        }
    },
    {
        name: 'show_weather',
        description: 'Display a weather widget in the chat. Use this when users ask about weather or want to see current conditions.',
        parameters: {
            type: 'object',
            properties: {
                location: {
                    type: 'string',
                    description: 'The location for weather (defaults to San Francisco)'
                }
            },
            required: []
        }
    },
    {
        name: 'show_kanban_tasks',
        description: 'Display kanban tasks/tickets in the chat. Use this when users ask about projects, tasks, or want to see the roadmap.',
        parameters: {
            type: 'object',
            properties: {
                filter: {
                    type: 'string',
                    description: 'Filter tasks by status',
                    enum: [
                        'all',
                        'todo',
                        'in-progress',
                        'done',
                        'backlog'
                    ]
                },
                tag: {
                    type: 'string',
                    description: 'Optional tag to filter by (e.g., "P8", "claw-ai")'
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of tasks to show (default 5)'
                }
            },
            required: []
        }
    },
    {
        name: 'show_photos',
        description: 'Display photos from the gallery in the chat. Use this when users ask to see photos, images, or the gallery.',
        parameters: {
            type: 'object',
            properties: {
                count: {
                    type: 'number',
                    description: 'Number of photos to show (default 6)'
                }
            },
            required: []
        }
    },
    {
        name: 'render_ui',
        description: 'Render custom UI components in the chat using a JSON UI tree. Use this to display rich, interactive UI when the built-in tools are not sufficient. You can create cards, lists, charts, stats, timelines, and many other components. The UI tree uses a flat structure with a root element and nested children.',
        parameters: {
            type: 'object',
            properties: {
                ui_tree: {
                    type: 'object',
                    description: 'A UI tree object with "root" (string key) and "elements" (object mapping keys to element definitions). Each element has: type (component name), props (component props), children (optional array of child keys), and key (unique identifier).'
                },
                title: {
                    type: 'string',
                    description: 'Optional title to show above the rendered UI'
                }
            },
            required: [
                'ui_tree'
            ]
        }
    },
    // ==========================================================================
    // Agentic Product Lifecycle Tools (ARC-002, ARC-003, ARC-006, ARC-007, ARC-009)
    // Inspired by BMAD-METHOD and CCPM
    // ==========================================================================
    {
        name: 'create_project',
        description: 'Create a new product project. Use this when users want to start a new product initiative, app idea, or feature set. This creates a project container that can hold PRDs, epics, and tickets.',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'The name of the project (e.g., "Weather App", "User Authentication")'
                },
                description: {
                    type: 'string',
                    description: 'A brief description of what this project aims to accomplish'
                },
                color: {
                    type: 'string',
                    description: 'Optional hex color for the project (e.g., "#8b5cf6"). Defaults to purple.'
                }
            },
            required: [
                'name'
            ]
        }
    },
    {
        name: 'create_prd',
        description: 'Create a Product Requirements Document (PRD) for a project. Use this when users want to define requirements, write specs, or document what they want to build. The PRD follows BMAD methodology with executive summary, problem statement, and functional requirements.',
        parameters: {
            type: 'object',
            properties: {
                projectId: {
                    type: 'string',
                    description: 'The ID of the project to create the PRD for'
                },
                title: {
                    type: 'string',
                    description: 'The title of the PRD (e.g., "User Authentication PRD")'
                },
                executiveSummary: {
                    type: 'string',
                    description: 'A brief executive summary of what this PRD covers'
                },
                problemStatement: {
                    type: 'string',
                    description: 'The problem this product/feature solves'
                }
            },
            required: [
                'projectId',
                'title'
            ]
        }
    },
    {
        name: 'create_ticket',
        description: 'Create a new ticket/story on the Kanban board. Use this when users want to add a task, bug, or story to track work. Tickets can optionally use the user story format (As a... I want... So that...).',
        parameters: {
            type: 'object',
            properties: {
                projectId: {
                    type: 'string',
                    description: 'The ID of the project to add the ticket to'
                },
                title: {
                    type: 'string',
                    description: 'The title of the ticket'
                },
                description: {
                    type: 'string',
                    description: 'Detailed description of the ticket'
                },
                type: {
                    type: 'string',
                    description: 'The type of ticket',
                    enum: [
                        'story',
                        'bug',
                        'task',
                        'spike',
                        'chore'
                    ]
                },
                priority: {
                    type: 'string',
                    description: 'Priority level (P0=critical, P1=high, P2=medium, P3=low)',
                    enum: [
                        'P0',
                        'P1',
                        'P2',
                        'P3'
                    ]
                },
                asA: {
                    type: 'string',
                    description: 'User story format: "As a [user type]"'
                },
                iWant: {
                    type: 'string',
                    description: 'User story format: "I want [capability]"'
                },
                soThat: {
                    type: 'string',
                    description: 'User story format: "So that [benefit]"'
                },
                labels: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Labels/tags for the ticket'
                }
            },
            required: [
                'projectId',
                'title'
            ]
        }
    },
    {
        name: 'update_ticket',
        description: 'Update an existing ticket on the Kanban board. Use this to change status, priority, description, or any other ticket field. Can move tickets between columns.',
        parameters: {
            type: 'object',
            properties: {
                ticketId: {
                    type: 'string',
                    description: 'The human-readable ticket ID (e.g., "PROJ-001")'
                },
                status: {
                    type: 'string',
                    description: 'New status for the ticket',
                    enum: [
                        'backlog',
                        'todo',
                        'in_progress',
                        'review',
                        'done',
                        'cancelled'
                    ]
                },
                priority: {
                    type: 'string',
                    description: 'New priority level',
                    enum: [
                        'P0',
                        'P1',
                        'P2',
                        'P3'
                    ]
                },
                title: {
                    type: 'string',
                    description: 'New title for the ticket'
                },
                description: {
                    type: 'string',
                    description: 'New description for the ticket'
                },
                assigneeId: {
                    type: 'string',
                    description: 'User ID to assign the ticket to, or "claw-ai" for AI execution'
                }
            },
            required: [
                'ticketId'
            ]
        }
    },
    {
        name: 'shard_prd',
        description: 'Shard a PRD into epics and tickets. This converts the functional requirements in a PRD into actionable Kanban tickets grouped by epics. Use this when a PRD is complete and ready for implementation planning.',
        parameters: {
            type: 'object',
            properties: {
                prdId: {
                    type: 'string',
                    description: 'The ID of the PRD to shard'
                },
                projectId: {
                    type: 'string',
                    description: 'The ID of the project the PRD belongs to'
                }
            },
            required: [
                'prdId',
                'projectId'
            ]
        }
    },
    {
        name: 'get_project_kanban',
        description: 'Get the Kanban board for a specific project. Shows all tickets organized by status columns (backlog, todo, in_progress, review, done).',
        parameters: {
            type: 'object',
            properties: {
                projectId: {
                    type: 'string',
                    description: 'The ID of the project to get the Kanban board for'
                }
            },
            required: [
                'projectId'
            ]
        }
    },
    {
        name: 'list_projects',
        description: 'List all product projects. Use this when users want to see their projects, switch between projects, or find a specific project.',
        parameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    description: 'Optional filter by project status',
                    enum: [
                        'discovery',
                        'design',
                        'planning',
                        'building',
                        'launched',
                        'archived'
                    ]
                }
            },
            required: []
        }
    },
    // ==========================================================================
    // Memory Tools (RLM - Recursive Memory Layer)
    // These tools enable Claw AI to actively manage memories for the owner
    // Only available when speaking with James (owner identity)
    // ==========================================================================
    {
        name: 'remember',
        description: 'Search through memories to recall past interactions, decisions, preferences, and milestones. Use this when you need historical context to provide a better response. Only works for the owner.',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'The search query to find relevant memories (e.g., "design decisions for OpenClaw-OS", "preferences about UI", "milestones this month")'
                },
                memoryType: {
                    type: 'string',
                    description: 'Optional filter by memory type',
                    enum: [
                        'all',
                        'interaction',
                        'decision',
                        'preference',
                        'feedback',
                        'milestone'
                    ]
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of memories to return (default 10)'
                }
            },
            required: [
                'query'
            ]
        }
    },
    {
        name: 'recall_preference',
        description: 'Recall specific preferences, patterns, or learned facts about the owner. Use this when you need to remember preferences (coding style, design choices, communication style) or patterns (work habits, typical workflows). Only works for the owner.',
        parameters: {
            type: 'object',
            properties: {
                category: {
                    type: 'string',
                    description: 'The category of preference to recall',
                    enum: [
                        'preference',
                        'skill',
                        'pattern',
                        'fact'
                    ]
                },
                key: {
                    type: 'string',
                    description: 'Optional specific key to look up (e.g., "coding_style", "preferred_theme")'
                }
            },
            required: [
                'category'
            ]
        }
    },
    {
        name: 'memorize',
        description: 'Store an important memory explicitly. Use this when something significant is mentioned that should be remembered: important decisions, preferences, milestones, or anything explicitly requested to be remembered. Only works for the owner.',
        parameters: {
            type: 'object',
            properties: {
                content: {
                    type: 'string',
                    description: 'The content to memorize (what happened, what was decided, what preference was expressed)'
                },
                memoryType: {
                    type: 'string',
                    description: 'The type of memory to store',
                    enum: [
                        'interaction',
                        'decision',
                        'preference',
                        'feedback',
                        'milestone'
                    ]
                },
                importance: {
                    type: 'number',
                    description: 'Importance score from 0 to 1 (default 0.7). Higher = more likely to be recalled.'
                },
                projectId: {
                    type: 'string',
                    description: 'Optional project ID to associate this memory with'
                }
            },
            required: [
                'content',
                'memoryType'
            ]
        }
    },
    {
        name: 'learn',
        description: 'Learn a new fact, preference, skill, or pattern about the owner. Use this to update your understanding based on what you are told or what you observe. This creates or updates semantic memory. Only works for the owner.',
        parameters: {
            type: 'object',
            properties: {
                category: {
                    type: 'string',
                    description: 'The category of knowledge being learned',
                    enum: [
                        'preference',
                        'skill',
                        'pattern',
                        'fact'
                    ]
                },
                key: {
                    type: 'string',
                    description: 'A unique key for this piece of knowledge (e.g., "preferred_font", "coding_language_primary")'
                },
                value: {
                    type: 'string',
                    description: 'The value/content of this knowledge (e.g., "Inter", "TypeScript")'
                },
                confidence: {
                    type: 'number',
                    description: 'Confidence level from 0 to 1 (default 0.7). Higher = more certain this is accurate.'
                }
            },
            required: [
                'category',
                'key',
                'value'
            ]
        }
    },
    {
        name: 'forget',
        description: 'Remove a specific memory. Use this when explicitly asked to forget something, or when a memory is no longer accurate/relevant. Be careful - this permanently deletes the memory. Only works for the owner.',
        parameters: {
            type: 'object',
            properties: {
                memoryId: {
                    type: 'string',
                    description: 'The ID of the memory to delete'
                },
                memoryKind: {
                    type: 'string',
                    description: 'Whether this is an episodic memory (event/interaction) or semantic memory (fact/preference)',
                    enum: [
                        'episodic',
                        'semantic'
                    ]
                }
            },
            required: [
                'memoryId',
                'memoryKind'
            ]
        }
    },
    // ==========================================================================
    // OpenClaw Coding Tools - Full coding agent capabilities
    // These tools enable Claw AI to clone repos, read/write files, execute
    // commands, and manage git operations. Only available for owner access level.
    // @see docs/planning/infinity-agent-coding-integration.md
    // ==========================================================================
    // --------------------------------------------------------------------------
    // Working Context Tools - "Everything is Everything"
    // --------------------------------------------------------------------------
    {
        name: 'set_active_context',
        description: 'Set the active working context. Use this when starting work on a specific project, ticket, or when the user @mentions an entity. This updates the context layer so all subsequent operations know what you are working on.',
        parameters: {
            type: 'object',
            properties: {
                projectId: {
                    type: 'string',
                    description: 'The ID of the active project'
                },
                projectSlug: {
                    type: 'string',
                    description: 'The slug of the active project (e.g., "openclaw-os")'
                },
                prdId: {
                    type: 'string',
                    description: 'The ID of the active PRD'
                },
                ticketId: {
                    type: 'string',
                    description: 'The ID of the active ticket'
                },
                canvasId: {
                    type: 'string',
                    description: 'The ID of the active design canvas'
                },
                sandboxId: {
                    type: 'string',
                    description: 'The ID of the active sandbox'
                },
                repositoryUrl: {
                    type: 'string',
                    description: 'The URL of the active repository'
                }
            },
            required: []
        }
    },
    {
        name: 'get_active_context',
        description: 'Get the current active working context including resolved entity details. Use this to understand what project, ticket, or PRD the user is currently working on before performing operations.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'load_context_from_reference',
        description: 'Load full context chain from an @mention reference. When user mentions @ticket:ARC-042, this loads the ticket plus its parent project, PRD, epic, and related tickets. Use this to build rich context from a single reference.',
        parameters: {
            type: 'object',
            properties: {
                referenceType: {
                    type: 'string',
                    description: 'The type of reference being loaded',
                    enum: [
                        'ticket',
                        'project',
                        'prd',
                        'epic',
                        'canvas',
                        'memory'
                    ]
                },
                referenceId: {
                    type: 'string',
                    description: 'The ID of the referenced entity (e.g., the ticket ID for @ticket:ARC-042)'
                }
            },
            required: [
                'referenceType',
                'referenceId'
            ]
        }
    },
    // --------------------------------------------------------------------------
    // Repository Operations
    // --------------------------------------------------------------------------
    {
        name: 'clone_repository',
        description: 'Clone a GitHub repository to the sandbox environment. Use this when starting work on a codebase or when the user asks to work on a specific repo. This creates a sandbox with the repo ready for reading, writing, and executing code.',
        parameters: {
            type: 'object',
            properties: {
                url: {
                    type: 'string',
                    description: 'The GitHub repository URL (e.g., "https://github.com/owner/repo")'
                },
                branch: {
                    type: 'string',
                    description: 'Optional branch to checkout (defaults to main/master)'
                }
            },
            required: [
                'url'
            ]
        }
    },
    {
        name: 'list_directory',
        description: 'List files and directories in a path within the sandbox. Use this to explore the codebase structure, find files, or understand the project layout.',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The path to list (relative to repo root). Use "." or "/" for root.'
                },
                recursive: {
                    type: 'boolean',
                    description: 'If true, list files recursively (default: false)'
                },
                maxDepth: {
                    type: 'number',
                    description: 'Maximum depth for recursive listing (default: 3)'
                }
            },
            required: [
                'path'
            ]
        }
    },
    {
        name: 'search_codebase',
        description: 'Search for text patterns in the codebase using grep/ripgrep. Use this to find function definitions, imports, usages, or any text pattern in the code.',
        parameters: {
            type: 'object',
            properties: {
                pattern: {
                    type: 'string',
                    description: 'The search pattern (supports regex)'
                },
                path: {
                    type: 'string',
                    description: 'Optional path to search within (defaults to entire repo)'
                },
                filePattern: {
                    type: 'string',
                    description: 'Optional file pattern filter (e.g., "*.ts", "*.tsx")'
                },
                caseSensitive: {
                    type: 'boolean',
                    description: 'Whether search is case-sensitive (default: false)'
                },
                maxResults: {
                    type: 'number',
                    description: 'Maximum number of results to return (default: 50)'
                }
            },
            required: [
                'pattern'
            ]
        }
    },
    // --------------------------------------------------------------------------
    // File Operations
    // --------------------------------------------------------------------------
    {
        name: 'read_file',
        description: 'Read the contents of a file from the sandbox. Use this to examine code, configuration files, or any text file. For large files, you can read specific line ranges.',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The path to the file (relative to repo root)'
                },
                startLine: {
                    type: 'number',
                    description: 'Optional starting line number (1-indexed)'
                },
                endLine: {
                    type: 'number',
                    description: 'Optional ending line number (1-indexed)'
                }
            },
            required: [
                'path'
            ]
        }
    },
    {
        name: 'write_file',
        description: 'Write content to a file in the sandbox. Use this to create new files or replace entire file contents. For surgical edits to existing files, prefer the edit_file tool.',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The path to write to (relative to repo root)'
                },
                content: {
                    type: 'string',
                    description: 'The content to write to the file'
                },
                createDirectories: {
                    type: 'boolean',
                    description: 'Create parent directories if they do not exist (default: true)'
                }
            },
            required: [
                'path',
                'content'
            ]
        }
    },
    {
        name: 'edit_file',
        description: 'Make surgical edits to a file using search and replace. Use this for targeted changes to specific sections of a file. More precise than write_file for modifications.',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The path to the file (relative to repo root)'
                },
                oldText: {
                    type: 'string',
                    description: 'The exact text to find and replace'
                },
                newText: {
                    type: 'string',
                    description: 'The text to replace it with'
                },
                replaceAll: {
                    type: 'boolean',
                    description: 'Replace all occurrences (default: false, replaces first only)'
                }
            },
            required: [
                'path',
                'oldText',
                'newText'
            ]
        }
    },
    {
        name: 'delete_file',
        description: 'Delete a file or directory from the sandbox. Use with caution. For directories, must explicitly set recursive=true.',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The path to delete (relative to repo root)'
                },
                recursive: {
                    type: 'boolean',
                    description: 'Required for directories - delete recursively'
                }
            },
            required: [
                'path'
            ]
        }
    },
    // --------------------------------------------------------------------------
    // Execution
    // --------------------------------------------------------------------------
    {
        name: 'run_command',
        description: 'Execute a shell command in the sandbox. Use this to run build commands, install dependencies, run tests, or any shell operation. Commands run in the repo root by default.',
        parameters: {
            type: 'object',
            properties: {
                command: {
                    type: 'string',
                    description: 'The command to execute (e.g., "npm install", "pnpm build")'
                },
                cwd: {
                    type: 'string',
                    description: 'Optional working directory (relative to repo root)'
                },
                timeout: {
                    type: 'number',
                    description: 'Timeout in milliseconds (default: 60000)'
                }
            },
            required: [
                'command'
            ]
        }
    },
    {
        name: 'start_dev_server',
        description: 'Start a development server in the sandbox. Use this to preview the application. Returns a preview URL that can be accessed in the browser.',
        parameters: {
            type: 'object',
            properties: {
                command: {
                    type: 'string',
                    description: 'The command to start the server (e.g., "npm run dev", "pnpm dev")'
                },
                port: {
                    type: 'number',
                    description: 'The port the server will run on (default: 3000)'
                }
            },
            required: []
        }
    },
    {
        name: 'get_preview_url',
        description: 'Get the preview URL for the running sandbox. Use this after starting a dev server to get the URL where the app can be previewed.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    // --------------------------------------------------------------------------
    // Git Operations
    // --------------------------------------------------------------------------
    {
        name: 'git_status',
        description: 'Get the current git status showing modified, added, and deleted files. Use this to see what changes have been made before committing.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'git_diff',
        description: 'Show the diff of changes in the working tree. Use this to review specific changes before committing.',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'Optional path to diff a specific file'
                },
                staged: {
                    type: 'boolean',
                    description: 'Show diff of staged changes only (default: false shows unstaged)'
                }
            },
            required: []
        }
    },
    {
        name: 'git_commit',
        description: 'Commit staged changes with a message. Use this after making changes that should be saved as a commit. Stage files first using git_add.',
        parameters: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'The commit message describing the changes'
                },
                stageAll: {
                    type: 'boolean',
                    description: 'Stage all modified files before committing (default: false)'
                }
            },
            required: [
                'message'
            ]
        }
    },
    {
        name: 'git_push',
        description: 'Push commits to the remote repository. Use this after committing to sync changes with GitHub. May require authentication for private repos.',
        parameters: {
            type: 'object',
            properties: {
                branch: {
                    type: 'string',
                    description: 'The branch to push (defaults to current branch)'
                },
                setUpstream: {
                    type: 'boolean',
                    description: 'Set upstream tracking for the branch (default: true for new branches)'
                }
            },
            required: []
        }
    },
    {
        name: 'create_branch',
        description: 'Create and checkout a new git branch. Use this to start work on a feature or fix. Can auto-generate branch names from the active ticket context.',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'The branch name. If not provided, generates from active ticket (e.g., "feature/arc-042-fix-bug")'
                },
                fromBranch: {
                    type: 'string',
                    description: 'The branch to create from (defaults to current branch)'
                }
            },
            required: []
        }
    },
    // --------------------------------------------------------------------------
    // Coding Task Management
    // --------------------------------------------------------------------------
    {
        name: 'create_coding_task',
        description: 'Create a new coding task to track work. Links to projects/tickets and maintains conversation history. Use this when starting a significant coding session.',
        parameters: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    description: 'Title describing the coding task'
                },
                description: {
                    type: 'string',
                    description: 'Detailed description of what needs to be done'
                },
                projectId: {
                    type: 'string',
                    description: 'Optional project ID to link this task to'
                },
                ticketId: {
                    type: 'string',
                    description: 'Optional ticket ID this task implements'
                },
                repositoryUrl: {
                    type: 'string',
                    description: 'The repository URL for this task'
                }
            },
            required: [
                'title',
                'description'
            ]
        }
    },
    {
        name: 'update_coding_task',
        description: 'Update the status or details of a coding task. Use this to mark tasks as completed, failed, or update progress.',
        parameters: {
            type: 'object',
            properties: {
                taskId: {
                    type: 'string',
                    description: 'The ID of the coding task to update'
                },
                status: {
                    type: 'string',
                    description: 'New status for the task',
                    enum: [
                        'pending',
                        'running',
                        'waiting_input',
                        'completed',
                        'failed',
                        'cancelled'
                    ]
                },
                filesModified: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'List of files that were modified'
                },
                commitSha: {
                    type: 'string',
                    description: 'The commit SHA if changes were committed'
                }
            },
            required: [
                'taskId'
            ]
        }
    },
    {
        name: 'list_coding_tasks',
        description: 'List coding tasks for the current user. Use this to see recent or active coding sessions.',
        parameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    description: 'Optional filter by status',
                    enum: [
                        'pending',
                        'running',
                        'waiting_input',
                        'completed',
                        'failed',
                        'cancelled'
                    ]
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of tasks to return (default: 10)'
                }
            },
            required: []
        }
    },
    // =========================================================================
    // Cron Jobs / Scheduled Automation
    // User-defined scheduled jobs similar to Clawdbot's cron system
    // =========================================================================
    {
        name: 'create_cron_job',
        description: 'Create a scheduled job that runs automatically. Use this when the user wants to set up recurring reminders, automated AI messages, email notifications, or webhook triggers. Examples: "Remind me every day at 9am to check emails", "Send me a summary every Monday morning", "Run a health check webhook every hour".',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'A short, descriptive name for the job (e.g., "Daily standup reminder", "Weekly summary")'
                },
                description: {
                    type: 'string',
                    description: 'Optional longer description of what this job does'
                },
                scheduleType: {
                    type: 'string',
                    description: 'How often the job should run',
                    enum: [
                        'once',
                        'interval',
                        'daily',
                        'weekly'
                    ]
                },
                scheduleTime: {
                    type: 'string',
                    description: 'When to run. For "once": ISO date string. For "daily"/"weekly": time in HH:MM format (24h). For "interval": number of minutes.'
                },
                daysOfWeek: {
                    type: 'array',
                    items: {
                        type: 'number'
                    },
                    description: 'For weekly jobs: which days to run (0=Sunday, 1=Monday, etc.)'
                },
                actionType: {
                    type: 'string',
                    description: 'What the job should do when triggered',
                    enum: [
                        'ai_message',
                        'email',
                        'webhook'
                    ]
                },
                prompt: {
                    type: 'string',
                    description: 'For ai_message: the prompt to send to Claw AI when the job runs'
                },
                emailSubject: {
                    type: 'string',
                    description: 'For email: the subject line'
                },
                emailBody: {
                    type: 'string',
                    description: 'For email: the message body'
                },
                recipientEmail: {
                    type: 'string',
                    description: 'For email: who to send to (defaults to user email)'
                },
                webhookUrl: {
                    type: 'string',
                    description: 'For webhook: the URL to call'
                },
                deliveryChannel: {
                    type: 'string',
                    description: 'Where to deliver AI responses (for ai_message jobs)',
                    enum: [
                        'web',
                        'email',
                        'whatsapp',
                        'telegram'
                    ]
                },
                timezone: {
                    type: 'string',
                    description: 'Timezone for scheduling (e.g., "America/Los_Angeles", "Europe/London"). Defaults to UTC.'
                }
            },
            required: [
                'name',
                'scheduleType',
                'actionType'
            ]
        }
    },
    {
        name: 'list_cron_jobs',
        description: 'List all scheduled jobs for the user. Use this when the user asks about their scheduled tasks, reminders, or automations.',
        parameters: {
            type: 'object',
            properties: {
                includeInactive: {
                    type: 'boolean',
                    description: 'Whether to include paused/inactive jobs. Defaults to false.'
                }
            },
            required: []
        }
    },
    {
        name: 'toggle_cron_job',
        description: 'Pause or resume a scheduled job. Use this when the user wants to temporarily disable a job without deleting it.',
        parameters: {
            type: 'object',
            properties: {
                jobId: {
                    type: 'string',
                    description: 'The ID of the job to toggle'
                }
            },
            required: [
                'jobId'
            ]
        }
    },
    {
        name: 'delete_cron_job',
        description: 'Permanently delete a scheduled job. Use this when the user wants to remove a job they no longer need.',
        parameters: {
            type: 'object',
            properties: {
                jobId: {
                    type: 'string',
                    description: 'The ID of the job to delete'
                }
            },
            required: [
                'jobId'
            ]
        }
    },
    // ==========================================================================
    // Conversation Compaction Tools
    // ==========================================================================
    {
        name: 'compact_conversation',
        description: 'Compress older messages in the conversation into a summary to save context space. ' + 'Use this when the user asks to summarize or compact the conversation, or when the ' + 'conversation is getting very long. This preserves key context while reducing token usage.',
        parameters: {
            type: 'object',
            properties: {
                sessionId: {
                    type: 'string',
                    description: 'The chat session ID to compact'
                },
                keepRecentCount: {
                    type: 'number',
                    description: 'Number of recent messages to keep uncompacted (default: 10)'
                },
                instructions: {
                    type: 'string',
                    description: 'Optional focus instructions for what to emphasize in the summary'
                }
            },
            required: [
                'sessionId'
            ]
        }
    },
    {
        name: 'get_compaction_summary',
        description: 'Retrieve the existing compaction summary for a conversation session. ' + 'Use this to recall context from earlier in a long conversation.',
        parameters: {
            type: 'object',
            properties: {
                sessionId: {
                    type: 'string',
                    description: 'The chat session ID to get compaction for'
                }
            },
            required: [
                'sessionId'
            ]
        }
    },
    // ==========================================================================
    // Channel Integration Tools - WhatsApp, Telegram, iMessage, Slack, Discord
    // ==========================================================================
    {
        name: 'list_channel_integrations',
        description: 'List all connected messaging platform integrations. Use this to see which ' + 'channels (WhatsApp, Telegram, iMessage, Slack, Discord) are connected and their status.',
        parameters: {
            type: 'object',
            properties: {
                includeDisabled: {
                    type: 'boolean',
                    description: 'Include disabled integrations (default: false)'
                }
            },
            required: []
        }
    },
    {
        name: 'get_channel_conversations',
        description: 'Get recent conversations from connected messaging platforms. Returns a unified ' + 'inbox view with contact info, last message, and unread counts.',
        parameters: {
            type: 'object',
            properties: {
                platform: {
                    type: 'string',
                    enum: [
                        'whatsapp',
                        'telegram',
                        'imessage',
                        'slack',
                        'discord'
                    ],
                    description: 'Filter by specific platform (optional)'
                },
                limit: {
                    type: 'number',
                    description: 'Maximum conversations to return (default: 20)'
                }
            },
            required: []
        }
    },
    {
        name: 'send_channel_message',
        description: 'Send a message via a connected messaging platform. Use this to reply to ' + 'conversations or send proactive messages through WhatsApp, Telegram, etc. ' + 'OWNER ONLY: Only the owner can send outbound messages.',
        parameters: {
            type: 'object',
            properties: {
                integrationId: {
                    type: 'string',
                    description: 'The channel integration ID to send through'
                },
                recipientId: {
                    type: 'string',
                    description: 'The recipient identifier (phone number, chat ID, etc.)'
                },
                content: {
                    type: 'string',
                    description: 'Message content to send'
                },
                messageType: {
                    type: 'string',
                    enum: [
                        'text',
                        'voice'
                    ],
                    description: 'Message type (default: text)'
                }
            },
            required: [
                'integrationId',
                'recipientId',
                'content'
            ]
        },
        ownerOnly: true
    },
    {
        name: 'search_channel_messages',
        description: 'Search messages across all connected messaging platforms. Useful for finding ' + 'past conversations, tracking topics, or locating specific information.',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query'
                },
                platform: {
                    type: 'string',
                    enum: [
                        'whatsapp',
                        'telegram',
                        'imessage',
                        'slack',
                        'discord'
                    ],
                    description: 'Filter by specific platform (optional)'
                },
                limit: {
                    type: 'number',
                    description: 'Maximum results to return (default: 20)'
                }
            },
            required: [
                'query'
            ]
        }
    },
    // =============================================================================
    // ERV Dimension Tools
    // =============================================================================
    {
        name: 'create_dimension',
        description: 'Create a custom dimension view for entities. Use this when users want to ' + 'visualize their data in a new way, like "show me my tasks as a constellation" ' + 'or "create a timeline of my projects". Dimensions define how entities are ' + 'arranged, styled, and connected.',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name for the dimension (e.g., "Task Constellation", "Project Timeline")'
                },
                metaphor: {
                    type: 'string',
                    description: 'Visual metaphor for the dimension. Affects styling and arrangement.',
                    enum: [
                        'river',
                        'board',
                        'constellation',
                        'solar',
                        'timeline',
                        'mosaic',
                        'ledger',
                        'vinyl',
                        'dungeon',
                        'tree'
                    ]
                },
                arrangement: {
                    type: 'string',
                    description: 'How entities are arranged spatially',
                    enum: [
                        'list',
                        'grid',
                        'graph',
                        'tree',
                        'flow',
                        'orbit',
                        'stack'
                    ]
                },
                entityTypes: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Types of entities to include (e.g., ["Ticket", "Project"]). Leave empty for all.'
                },
                description: {
                    type: 'string',
                    description: 'Optional description of what this dimension shows'
                }
            },
            required: [
                'name',
                'metaphor',
                'arrangement'
            ]
        }
    },
    {
        name: 'navigate_to_dimension',
        description: 'Navigate to a dimension view. Use this when users want to see a specific ' + 'dimension like "show me the kanban", "open the graph view", or "go to my feed". ' + 'Can navigate to preset dimensions or custom ones created by the user.',
        parameters: {
            type: 'object',
            properties: {
                dimensionId: {
                    type: 'string',
                    description: 'ID of the dimension to navigate to. Presets: feed, kanban, graph, graph-3d, ' + 'calendar, grid, table, ipod, quest-log, skill-tree. Or a custom dimension ID.'
                }
            },
            required: [
                'dimensionId'
            ]
        }
    },
    {
        name: 'list_dimensions',
        description: 'List all available dimensions including presets and custom user dimensions. ' + 'Use this when users ask "what views do I have?" or "show me available dimensions".',
        parameters: {
            type: 'object',
            properties: {
                includePresets: {
                    type: 'boolean',
                    description: 'Whether to include preset dimensions (default: true)'
                }
            },
            required: []
        }
    },
    {
        name: 'search_entities',
        description: 'Search across all entities in the ERV system. Use this when users ask about ' + 'their data like "find all high priority tickets", "show me projects tagged with AI", ' + 'or "what tracks do I have from last month".',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query to find entities'
                },
                entityTypes: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by entity types (e.g., ["Ticket", "Project", "Track"]). Leave empty for all.'
                },
                limit: {
                    type: 'number',
                    description: 'Maximum results to return (default: 20)'
                }
            },
            required: [
                'query'
            ]
        }
    },
    // =============================================================================
    // Video/Remotion Tools
    // =============================================================================
    {
        name: 'create_video_composition',
        description: 'Create a new video composition for creating videos, presentations, or lyric videos. ' + 'Use this when users want to create video content like "make a lyric video for this song", ' + '"create a presentation video", or "add text overlays to this video".',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name for the video composition'
                },
                type: {
                    type: 'string',
                    description: 'Type of video to create',
                    enum: [
                        'lyric-video',
                        'presentation',
                        'text-overlay',
                        'social-story',
                        'music-visualizer',
                        'slideshow',
                        'custom'
                    ]
                },
                preset: {
                    type: 'string',
                    description: 'Video format preset',
                    enum: [
                        'instagram-story',
                        'instagram-post',
                        'instagram-reel',
                        'tiktok',
                        'youtube',
                        'youtube-short',
                        'twitter',
                        '1080p',
                        '720p',
                        '4k',
                        'square',
                        'portrait'
                    ]
                },
                durationSeconds: {
                    type: 'number',
                    description: 'Duration of the video in seconds (default: 30)'
                },
                backgroundColor: {
                    type: 'string',
                    description: 'Background color (hex or CSS color)'
                },
                backgroundGradient: {
                    type: 'string',
                    description: 'Background gradient (CSS gradient string)'
                }
            },
            required: [
                'name',
                'type'
            ]
        }
    },
    {
        name: 'add_text_overlay',
        description: 'Add a text overlay to a video composition. Use this to add titles, captions, ' + 'watermarks, or any text content to videos. Supports animations and positioning.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition to add text to'
                },
                text: {
                    type: 'string',
                    description: 'The text content to display'
                },
                position: {
                    type: 'string',
                    description: 'Position on screen',
                    enum: [
                        'top-left',
                        'top-center',
                        'top-right',
                        'center-left',
                        'center',
                        'center-right',
                        'bottom-left',
                        'bottom-center',
                        'bottom-right'
                    ]
                },
                startTime: {
                    type: 'number',
                    description: 'When the text appears (in seconds)'
                },
                duration: {
                    type: 'number',
                    description: 'How long the text stays on screen (in seconds)'
                },
                fontSize: {
                    type: 'number',
                    description: 'Font size in pixels (default: 32)'
                },
                color: {
                    type: 'string',
                    description: 'Text color (default: white)'
                },
                animation: {
                    type: 'string',
                    description: 'Entry animation for the text',
                    enum: [
                        'none',
                        'fade',
                        'slide-up',
                        'slide-down',
                        'slide-left',
                        'slide-right',
                        'scale',
                        'typewriter',
                        'blur',
                        'glitch'
                    ]
                }
            },
            required: [
                'compositionId',
                'text'
            ]
        }
    },
    {
        name: 'add_lyrics_to_video',
        description: 'Add synchronized lyrics to a video composition. Creates karaoke-style lyric videos ' + 'with word highlighting, bouncing text, or typewriter effects. Provide lyrics with timestamps.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition'
                },
                audioSrc: {
                    type: 'string',
                    description: 'URL or path to the audio file'
                },
                lyrics: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            text: {
                                type: 'string'
                            },
                            startTime: {
                                type: 'number'
                            },
                            endTime: {
                                type: 'number'
                            }
                        }
                    },
                    description: 'Array of lyric lines with timing: [{text, startTime, endTime}]'
                },
                style: {
                    type: 'string',
                    description: 'Lyric display style',
                    enum: [
                        'karaoke',
                        'subtitle',
                        'bounce',
                        'typewriter'
                    ]
                },
                fontFamily: {
                    type: 'string',
                    description: 'Font family for lyrics (default: Inter)'
                },
                color: {
                    type: 'string',
                    description: 'Text color for lyrics'
                },
                highlightColor: {
                    type: 'string',
                    description: 'Highlight color for active words (karaoke style)'
                },
                position: {
                    type: 'string',
                    description: 'Vertical position of lyrics',
                    enum: [
                        'top',
                        'center',
                        'bottom'
                    ]
                }
            },
            required: [
                'compositionId',
                'audioSrc',
                'lyrics'
            ]
        }
    },
    {
        name: 'add_media_to_video',
        description: 'Add an image or video layer to a composition. Use for backgrounds, overlays, ' + 'or picture-in-picture effects.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition'
                },
                mediaSrc: {
                    type: 'string',
                    description: 'URL or path to the media file (image or video)'
                },
                mediaType: {
                    type: 'string',
                    description: 'Type of media',
                    enum: [
                        'image',
                        'video'
                    ]
                },
                startTime: {
                    type: 'number',
                    description: 'When the media appears (in seconds)'
                },
                duration: {
                    type: 'number',
                    description: 'How long the media stays on screen (in seconds)'
                },
                position: {
                    type: 'object',
                    description: 'Position {x, y} in pixels'
                },
                scale: {
                    type: 'number',
                    description: 'Scale factor (1 = original size)'
                },
                opacity: {
                    type: 'number',
                    description: 'Opacity 0-1'
                },
                objectFit: {
                    type: 'string',
                    description: 'How the media fits its container',
                    enum: [
                        'contain',
                        'cover',
                        'fill'
                    ]
                }
            },
            required: [
                'compositionId',
                'mediaSrc',
                'mediaType'
            ]
        }
    },
    {
        name: 'preview_video',
        description: 'Generate a preview of a video composition. Opens the video player with the current ' + 'composition state for review before rendering.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition to preview'
                },
                openInCanvas: {
                    type: 'boolean',
                    description: 'Whether to open the preview in the infinite canvas (default: false)'
                }
            },
            required: [
                'compositionId'
            ]
        }
    },
    {
        name: 'render_video',
        description: 'Render a video composition to a downloadable MP4/WebM/GIF file. Use mode="sandbox" to ' + 'render locally using ffmpeg.wasm (free, no cloud needed) or mode="server" for server-side ' + 'rendering. Sandbox mode is recommended for videos under 60 seconds.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition to render'
                },
                format: {
                    type: 'string',
                    description: 'Output format',
                    enum: [
                        'mp4',
                        'webm',
                        'gif'
                    ]
                },
                quality: {
                    type: 'string',
                    description: 'Quality preset (draft=fast/lower quality, high=best quality)',
                    enum: [
                        'draft',
                        'standard',
                        'high'
                    ]
                },
                mode: {
                    type: 'string',
                    description: 'Render mode: sandbox (local, free) or server (cloud, costs $)',
                    enum: [
                        'sandbox',
                        'server'
                    ]
                }
            },
            required: [
                'compositionId'
            ]
        }
    },
    {
        name: 'sync_lyrics_to_audio',
        description: 'Automatically sync lyrics text to an audio file using AI transcription. Takes raw lyrics ' + 'and audio, returns timed lyric data ready for add_lyrics_to_video. Uses Whisper API for ' + 'word-level timestamp detection.',
        parameters: {
            type: 'object',
            properties: {
                audioSrc: {
                    type: 'string',
                    description: 'URL or path to the audio file'
                },
                lyrics: {
                    type: 'string',
                    description: 'Raw lyrics text (one line per lyric line, no timestamps needed)'
                },
                language: {
                    type: 'string',
                    description: 'Language code (e.g., "en", "es", "fr"). Auto-detected if not specified.'
                }
            },
            required: [
                'audioSrc',
                'lyrics'
            ]
        }
    },
    {
        name: 'get_render_status',
        description: 'Check the status of a video render job. Returns progress percentage, output URL when ' + 'complete, or error message if failed.',
        parameters: {
            type: 'object',
            properties: {
                jobId: {
                    type: 'string',
                    description: 'The render job ID returned from render_video'
                }
            },
            required: [
                'jobId'
            ]
        }
    },
    {
        name: 'add_particle_effect',
        description: 'Add particle effects to a video composition. Creates confetti, snow, dust, sparks, ' + 'or custom particles. Great for celebrations, atmosphere, and visual interest.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition'
                },
                effect: {
                    type: 'string',
                    description: 'Type of particle effect',
                    enum: [
                        'confetti',
                        'snow',
                        'dust',
                        'sparks',
                        'bubbles',
                        'leaves',
                        'stars',
                        'custom'
                    ]
                },
                particleCount: {
                    type: 'number',
                    description: 'Number of particles (default: 100, max: 500)'
                },
                color: {
                    type: 'string',
                    description: 'Particle color (hex, CSS color, or "multi" for random colors)'
                },
                direction: {
                    type: 'string',
                    description: 'Direction of particle movement',
                    enum: [
                        'up',
                        'down',
                        'left',
                        'right',
                        'random',
                        'explode'
                    ]
                },
                speed: {
                    type: 'number',
                    description: 'Speed multiplier (default: 1)'
                },
                gravity: {
                    type: 'number',
                    description: 'Gravity effect (0 = no gravity, 1 = normal)'
                },
                startTime: {
                    type: 'number',
                    description: 'When particles start (in seconds)'
                },
                duration: {
                    type: 'number',
                    description: 'How long particles last (in seconds)'
                }
            },
            required: [
                'compositionId',
                'effect'
            ]
        }
    },
    {
        name: 'add_waveform_visualizer',
        description: 'Add an audio waveform visualization to a video composition. Creates bars, lines, ' + 'circles, or mirror effects that respond to audio frequencies. Perfect for music videos.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition'
                },
                audioSrc: {
                    type: 'string',
                    description: 'URL or path to the audio file'
                },
                style: {
                    type: 'string',
                    description: 'Visualization style',
                    enum: [
                        'bars',
                        'line',
                        'circle',
                        'mirror',
                        'spectrum',
                        'pulse'
                    ]
                },
                color: {
                    type: 'string',
                    description: 'Waveform color (supports gradients with color1,color2 format)'
                },
                position: {
                    type: 'string',
                    description: 'Position of the waveform',
                    enum: [
                        'top',
                        'center',
                        'bottom',
                        'full'
                    ]
                },
                barWidth: {
                    type: 'number',
                    description: 'Width of bars in pixels (for bars style)'
                },
                smoothing: {
                    type: 'number',
                    description: 'Smoothing factor 0-1 (higher = smoother)'
                },
                sensitivity: {
                    type: 'number',
                    description: 'Audio sensitivity multiplier (default: 1)'
                }
            },
            required: [
                'compositionId',
                'audioSrc',
                'style'
            ]
        }
    },
    {
        name: 'add_gradient_background',
        description: 'Add an animated or static gradient background to a video composition. ' + 'Supports linear, radial, and conic gradients with optional animation.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition'
                },
                colors: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Array of colors for the gradient (2-5 colors)'
                },
                type: {
                    type: 'string',
                    description: 'Type of gradient',
                    enum: [
                        'linear',
                        'radial',
                        'conic'
                    ]
                },
                angle: {
                    type: 'number',
                    description: 'Angle in degrees (for linear gradient)'
                },
                animate: {
                    type: 'boolean',
                    description: 'Whether to animate the gradient rotation'
                },
                animationSpeed: {
                    type: 'number',
                    description: 'Degrees per second for animation (default: 30)'
                }
            },
            required: [
                'compositionId',
                'colors'
            ]
        }
    },
    {
        name: 'create_slideshow',
        description: 'Create an automatic slideshow from multiple images. Applies Ken Burns effect, ' + 'transitions, and optional background music. Perfect for photo montages.',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name for the slideshow'
                },
                images: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Array of image URLs or paths'
                },
                durationPerSlide: {
                    type: 'number',
                    description: 'Seconds per image (default: 3)'
                },
                transition: {
                    type: 'string',
                    description: 'Transition between slides',
                    enum: [
                        'fade',
                        'slide',
                        'zoom',
                        'blur',
                        'wipe',
                        'none'
                    ]
                },
                transitionDuration: {
                    type: 'number',
                    description: 'Duration of transitions in seconds (default: 0.5)'
                },
                kenBurns: {
                    type: 'boolean',
                    description: 'Apply Ken Burns zoom/pan effect (default: true)'
                },
                backgroundMusic: {
                    type: 'string',
                    description: 'URL or path to background music (optional)'
                },
                preset: {
                    type: 'string',
                    description: 'Video format preset',
                    enum: [
                        'instagram-story',
                        'instagram-post',
                        'tiktok',
                        'youtube',
                        'youtube-short',
                        '1080p',
                        'square'
                    ]
                }
            },
            required: [
                'name',
                'images'
            ]
        }
    },
    {
        name: 'add_cinematic_effect',
        description: 'Apply cinematic effects to a video composition. Includes letterbox, color grading, ' + 'film grain, vignette, and more for a professional film look.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition'
                },
                effect: {
                    type: 'string',
                    description: 'Cinematic effect to apply',
                    enum: [
                        'letterbox',
                        'film_grain',
                        'vignette',
                        'color_grade',
                        'bloom',
                        'chromatic_aberration',
                        'lens_flare'
                    ]
                },
                intensity: {
                    type: 'number',
                    description: 'Effect intensity 0-1 (default: 0.5)'
                },
                colorGrade: {
                    type: 'string',
                    description: 'Color grading preset (for color_grade effect)',
                    enum: [
                        'cinematic',
                        'vintage',
                        'cold',
                        'warm',
                        'noir',
                        'cyberpunk',
                        'pastel'
                    ]
                },
                letterboxRatio: {
                    type: 'string',
                    description: 'Aspect ratio for letterbox',
                    enum: [
                        '2.35:1',
                        '2.39:1',
                        '1.85:1',
                        '4:3'
                    ]
                }
            },
            required: [
                'compositionId',
                'effect'
            ]
        }
    },
    {
        name: 'add_kinetic_typography',
        description: 'Create kinetic typography animation - text that moves, scales, and transforms dynamically. ' + 'Perfect for music videos, title sequences, and promotional content.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition'
                },
                text: {
                    type: 'string',
                    description: 'Text to animate (can include multiple lines)'
                },
                style: {
                    type: 'string',
                    description: 'Animation style',
                    enum: [
                        'impact',
                        'wave',
                        'cascade',
                        'explosion',
                        'bounce',
                        'zoom',
                        'rotate',
                        'glitch'
                    ]
                },
                fontFamily: {
                    type: 'string',
                    description: 'Font family (default: Inter)'
                },
                fontSize: {
                    type: 'number',
                    description: 'Font size in pixels'
                },
                color: {
                    type: 'string',
                    description: 'Text color'
                },
                startTime: {
                    type: 'number',
                    description: 'When animation starts (in seconds)'
                },
                duration: {
                    type: 'number',
                    description: 'Animation duration (in seconds)'
                },
                syncToAudio: {
                    type: 'boolean',
                    description: 'Sync animation to audio beats (requires audio layer)'
                }
            },
            required: [
                'compositionId',
                'text',
                'style'
            ]
        }
    },
    {
        name: 'export_for_platform',
        description: 'Export a video composition optimized for a specific social media platform. ' + 'Automatically adjusts resolution, bitrate, and format for optimal quality.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition to export'
                },
                platform: {
                    type: 'string',
                    description: 'Target platform',
                    enum: [
                        'instagram_story',
                        'instagram_reel',
                        'instagram_post',
                        'tiktok',
                        'youtube',
                        'youtube_short',
                        'twitter',
                        'linkedin',
                        'facebook'
                    ]
                },
                includeCaption: {
                    type: 'boolean',
                    description: 'Include burned-in captions if available'
                },
                includeSafeZone: {
                    type: 'boolean',
                    description: 'Add safe zone guides for platform UI elements'
                }
            },
            required: [
                'compositionId',
                'platform'
            ]
        }
    },
    {
        name: 'list_video_compositions',
        description: 'List all video compositions. Returns composition IDs, names, types, and preview info.',
        parameters: {
            type: 'object',
            properties: {
                filter: {
                    type: 'string',
                    description: 'Filter by type (optional)',
                    enum: [
                        'lyric-video',
                        'presentation',
                        'text-overlay',
                        'social-story',
                        'music-visualizer',
                        'slideshow',
                        'all'
                    ]
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of results (default: 20)'
                }
            },
            required: []
        }
    },
    // =============================================================================
    // Image Processing & Effects Tools
    // =============================================================================
    {
        name: 'apply_image_effect',
        description: 'Apply visual effects to an image. Includes halftone, duotone, blur, glitch, vintage, ' + 'cyberpunk, noir, and more. Use for creating unique branded looks, artistic transformations, ' + 'or consistent visual identity.',
        parameters: {
            type: 'object',
            properties: {
                imageSrc: {
                    type: 'string',
                    description: 'Image URL, base64 data, or file path'
                },
                effect: {
                    type: 'string',
                    description: 'Effect type to apply',
                    enum: [
                        'halftone',
                        'duotone',
                        'posterize',
                        'pixelate',
                        'ascii',
                        'line-art',
                        'grayscale',
                        'sepia',
                        'invert',
                        'hue-shift',
                        'saturate',
                        'color-replace',
                        'gaussian-blur',
                        'motion-blur',
                        'radial-blur',
                        'zoom-blur',
                        'tilt-shift',
                        'swirl',
                        'bulge',
                        'pinch',
                        'wave',
                        'ripple',
                        'fisheye',
                        'noise',
                        'film-grain',
                        'scanlines',
                        'vignette',
                        'oil-paint',
                        'watercolor',
                        'sketch',
                        'comic',
                        'glitch',
                        'vintage',
                        'cyberpunk',
                        'noir',
                        'pop-art',
                        'blueprint'
                    ]
                },
                params: {
                    type: 'object',
                    description: 'Effect-specific parameters (e.g., { frequency: 45, angle: 45, shape: "line" } for halftone)'
                },
                outputFormat: {
                    type: 'string',
                    description: 'Output image format',
                    enum: [
                        'png',
                        'jpg',
                        'webp'
                    ]
                },
                quality: {
                    type: 'number',
                    description: 'Output quality 0-100 (default: 90)'
                }
            },
            required: [
                'imageSrc',
                'effect'
            ]
        }
    },
    {
        name: 'generate_app_icon',
        description: 'Generate a unique app icon with specified style and effects. Creates multiple sizes ' + 'suitable for iOS, Android, and web. Perfect for creating consistent branded icons.',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'App name (used for naming output files)'
                },
                style: {
                    type: 'string',
                    description: 'Icon visual style',
                    enum: [
                        'flat',
                        'gradient',
                        'glassmorphism',
                        'neumorphic',
                        'illustrated',
                        '3d',
                        'halftone',
                        'minimal'
                    ]
                },
                primaryColor: {
                    type: 'string',
                    description: 'Primary brand color (hex)'
                },
                secondaryColor: {
                    type: 'string',
                    description: 'Secondary color for gradients (hex, optional)'
                },
                backgroundColor: {
                    type: 'string',
                    description: 'Background color (hex, optional)'
                },
                symbol: {
                    type: 'string',
                    description: 'Icon symbol - can be an emoji, letter, or Lucide icon name'
                },
                shape: {
                    type: 'string',
                    description: 'Icon shape',
                    enum: [
                        'square',
                        'rounded',
                        'circle',
                        'squircle'
                    ]
                },
                effects: {
                    type: 'array',
                    items: {
                        type: 'object'
                    },
                    description: 'Additional effects (shadow, glow, border, etc.)'
                },
                sizes: {
                    type: 'array',
                    items: {
                        type: 'number'
                    },
                    description: 'Output sizes in pixels (default: [64, 128, 256, 512, 1024])'
                }
            },
            required: [
                'name',
                'style',
                'primaryColor'
            ]
        }
    },
    {
        name: 'remove_background',
        description: 'Remove the background from an image using AI. Supports portraits, products, and general ' + 'images. Returns transparent PNG.',
        parameters: {
            type: 'object',
            properties: {
                imageSrc: {
                    type: 'string',
                    description: 'Image URL, base64 data, or file path'
                },
                model: {
                    type: 'string',
                    description: 'AI model optimized for specific content types',
                    enum: [
                        'auto',
                        'portrait',
                        'product',
                        'general'
                    ]
                },
                tolerance: {
                    type: 'number',
                    description: 'Edge sensitivity 0-100 (default: 50)'
                },
                edgeSoftness: {
                    type: 'number',
                    description: 'Feather amount in pixels 0-20 (default: 2)'
                },
                refineEdges: {
                    type: 'boolean',
                    description: 'Use AI edge refinement for better hair/fur detection'
                }
            },
            required: [
                'imageSrc'
            ]
        }
    },
    {
        name: 'create_branded_image',
        description: 'Transform an image to match OpenClaw-OS branded visual identity. Applies consistent effects ' + 'for a cohesive look across all OS assets.',
        parameters: {
            type: 'object',
            properties: {
                imageSrc: {
                    type: 'string',
                    description: 'Source image URL or path'
                },
                preset: {
                    type: 'string',
                    description: 'Brand preset to apply',
                    enum: [
                        'signature',
                        'light',
                        'dark',
                        'vibrant',
                        'minimal',
                        'retro',
                        'futuristic'
                    ]
                },
                customEffects: {
                    type: 'array',
                    items: {
                        type: 'object'
                    },
                    description: 'Override or add effects to the preset'
                },
                outputFormat: {
                    type: 'string',
                    description: 'Output format',
                    enum: [
                        'png',
                        'jpg',
                        'webp'
                    ]
                }
            },
            required: [
                'imageSrc',
                'preset'
            ]
        }
    },
    {
        name: 'batch_process_images',
        description: 'Apply consistent effects to multiple images at once. Perfect for creating cohesive ' + 'galleries, icon sets, or branded asset collections.',
        parameters: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Array of image URLs or paths'
                },
                effects: {
                    type: 'array',
                    items: {
                        type: 'object'
                    },
                    description: 'Effects to apply to all images'
                },
                preset: {
                    type: 'string',
                    description: 'Named preset to apply (alternative to effects array)',
                    enum: [
                        'vintage',
                        'cyberpunk',
                        'noir',
                        'pop-art',
                        'blueprint',
                        'signature'
                    ]
                },
                outputPrefix: {
                    type: 'string',
                    description: 'Filename prefix for outputs'
                },
                outputFormat: {
                    type: 'string',
                    description: 'Output format for all images',
                    enum: [
                        'png',
                        'jpg',
                        'webp'
                    ]
                }
            },
            required: [
                'images'
            ]
        }
    },
    {
        name: 'create_color_palette',
        description: 'Extract or generate a color palette from an image or create one from scratch. ' + 'Useful for theming, branding, and ensuring visual consistency.',
        parameters: {
            type: 'object',
            properties: {
                source: {
                    type: 'string',
                    description: 'Image URL to extract colors from, or "generate" for AI generation'
                },
                count: {
                    type: 'number',
                    description: 'Number of colors in palette (default: 5)'
                },
                mode: {
                    type: 'string',
                    description: 'Palette generation mode',
                    enum: [
                        'extract',
                        'analogous',
                        'complementary',
                        'triadic',
                        'split-complementary',
                        'monochromatic'
                    ]
                },
                baseColor: {
                    type: 'string',
                    description: 'Base color for generated palettes (hex)'
                },
                includeShades: {
                    type: 'boolean',
                    description: 'Include light/dark shades of each color'
                }
            },
            required: [
                'source'
            ]
        }
    },
    {
        name: 'resize_and_crop',
        description: 'Resize, crop, and optimize images for specific use cases. Supports smart cropping ' + 'that preserves important content.',
        parameters: {
            type: 'object',
            properties: {
                imageSrc: {
                    type: 'string',
                    description: 'Source image URL or path'
                },
                width: {
                    type: 'number',
                    description: 'Target width in pixels'
                },
                height: {
                    type: 'number',
                    description: 'Target height in pixels'
                },
                fit: {
                    type: 'string',
                    description: 'How to fit image to dimensions',
                    enum: [
                        'contain',
                        'cover',
                        'fill',
                        'inside',
                        'outside'
                    ]
                },
                position: {
                    type: 'string',
                    description: 'Focal point for cropping',
                    enum: [
                        'center',
                        'top',
                        'right',
                        'bottom',
                        'left',
                        'top-left',
                        'top-right',
                        'bottom-left',
                        'bottom-right',
                        'smart'
                    ]
                },
                format: {
                    type: 'string',
                    description: 'Output format',
                    enum: [
                        'png',
                        'jpg',
                        'webp'
                    ]
                },
                quality: {
                    type: 'number',
                    description: 'Quality 0-100 (for jpg/webp)'
                }
            },
            required: [
                'imageSrc',
                'width',
                'height'
            ]
        }
    },
    {
        name: 'composite_images',
        description: 'Layer multiple images together with blend modes and positioning. Create collages, ' + 'overlays, and composite designs.',
        parameters: {
            type: 'object',
            properties: {
                baseImage: {
                    type: 'string',
                    description: 'Background/base image URL or path'
                },
                layers: {
                    type: 'array',
                    items: {
                        type: 'object'
                    },
                    description: 'Array of layers: [{src, x, y, width, height, opacity, blendMode}]'
                },
                outputWidth: {
                    type: 'number',
                    description: 'Final output width (optional)'
                },
                outputHeight: {
                    type: 'number',
                    description: 'Final output height (optional)'
                },
                format: {
                    type: 'string',
                    description: 'Output format',
                    enum: [
                        'png',
                        'jpg',
                        'webp'
                    ]
                }
            },
            required: [
                'baseImage',
                'layers'
            ]
        }
    },
    {
        name: 'generate_pattern',
        description: 'Generate seamless patterns and textures. Useful for backgrounds, UI elements, ' + 'and decorative graphics.',
        parameters: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    description: 'Pattern type',
                    enum: [
                        'dots',
                        'lines',
                        'grid',
                        'waves',
                        'noise',
                        'geometric',
                        'organic',
                        'halftone',
                        'checkerboard',
                        'stripes'
                    ]
                },
                width: {
                    type: 'number',
                    description: 'Pattern tile width (default: 256)'
                },
                height: {
                    type: 'number',
                    description: 'Pattern tile height (default: 256)'
                },
                colors: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Colors to use in pattern (hex values)'
                },
                density: {
                    type: 'number',
                    description: 'Pattern density 0-100 (default: 50)'
                },
                rotation: {
                    type: 'number',
                    description: 'Pattern rotation in degrees'
                },
                seamless: {
                    type: 'boolean',
                    description: 'Ensure pattern tiles seamlessly (default: true)'
                }
            },
            required: [
                'type'
            ]
        }
    },
    // =============================================================================
    // Talking Video Tools (AI Avatar Videos)
    // =============================================================================
    {
        name: 'create_talking_video',
        description: 'Create a talking head video with AI-generated script, cloned voice, and lip sync. ' + 'The full workflow: 1) Generate a script about the topic, 2) Generate voice audio using ' + 'ElevenLabs cloned voice, 3) Create background scene using Kling AI Pro, 4) Lip sync ' + 'with Veed Fast. Use when user says "make a video of me talking about X" or "create a ' + 'talking video".',
        parameters: {
            type: 'object',
            properties: {
                topic: {
                    type: 'string',
                    description: 'What the video should be about. This will be used to generate the script.'
                },
                sourcePhotoUrl: {
                    type: 'string',
                    description: 'URL of the photo to animate (headshot of the person)'
                },
                sceneStyle: {
                    type: 'string',
                    description: 'Background scene style for the video',
                    enum: [
                        'podcast_studio',
                        'office',
                        'outdoor',
                        'news_desk',
                        'living_room',
                        'conference'
                    ]
                },
                customScenePrompt: {
                    type: 'string',
                    description: 'Custom scene description (overrides sceneStyle if provided)'
                },
                duration: {
                    type: 'number',
                    description: 'Target video duration in seconds (default: 90)'
                },
                tone: {
                    type: 'string',
                    description: 'Tone of the script and delivery',
                    enum: [
                        'professional',
                        'casual',
                        'educational',
                        'entertaining'
                    ]
                }
            },
            required: [
                'topic',
                'sourcePhotoUrl'
            ]
        }
    },
    {
        name: 'generate_video_script',
        description: 'Generate just the script for a talking video without creating the full video. ' + 'Use this when user wants to review or edit the script before generating voice and video.',
        parameters: {
            type: 'object',
            properties: {
                topic: {
                    type: 'string',
                    description: 'What the script should be about'
                },
                duration: {
                    type: 'number',
                    description: 'Target duration in seconds (default: 90). Script will be ~150 words per minute.'
                },
                tone: {
                    type: 'string',
                    description: 'Tone of the script',
                    enum: [
                        'professional',
                        'casual',
                        'educational',
                        'entertaining'
                    ]
                },
                style: {
                    type: 'string',
                    description: 'Script style/format',
                    enum: [
                        'monologue',
                        'interview',
                        'tutorial',
                        'story'
                    ]
                }
            },
            required: [
                'topic'
            ]
        }
    },
    {
        name: 'generate_voice_audio',
        description: 'Generate voice audio from text using ElevenLabs cloned voice. Creates natural-sounding ' + 'speech that matches James\'s voice. Use when user wants to create audio narration or voice-over.',
        parameters: {
            type: 'object',
            properties: {
                text: {
                    type: 'string',
                    description: 'The text to convert to speech'
                },
                voiceId: {
                    type: 'string',
                    description: 'ElevenLabs voice ID (uses James\'s cloned voice by default)'
                },
                stability: {
                    type: 'number',
                    description: 'Voice stability 0-1 (higher = more consistent, lower = more expressive)'
                },
                similarityBoost: {
                    type: 'number',
                    description: 'Voice similarity 0-1 (higher = closer to original voice)'
                }
            },
            required: [
                'text'
            ]
        }
    },
    {
        name: 'navigate_to_video_studio',
        description: 'Open the video studio page (/video) for creating talking videos. Use when user wants ' + 'to "go to video studio", "open video creator", or "make a talking video" without specifying details.',
        parameters: {
            type: 'object',
            properties: {
                prefillTopic: {
                    type: 'string',
                    description: 'Optional topic to pre-fill in the video studio'
                }
            },
            required: []
        }
    },
    // =============================================================================
    // LTX-2 Video Generation Tools (Lightricks via Fal AI)
    // AI-powered video generation: text-to-video, image-to-video
    // =============================================================================
    {
        name: 'generate_video',
        description: 'Generate a video from a text prompt using LTX-2 AI model. Creates high-quality videos ' + 'from text descriptions. Use when user says "generate a video of X", "create a video showing X", ' + 'or "make me a video clip of X". Supports multiple aspect ratios and durations.',
        parameters: {
            type: 'object',
            properties: {
                prompt: {
                    type: 'string',
                    description: 'Detailed description of the video to generate. Be specific about motion, scene, lighting, etc.'
                },
                negative_prompt: {
                    type: 'string',
                    description: 'What to avoid in the video (default: blurry, low quality, distorted, watermark)'
                },
                preset: {
                    type: 'string',
                    description: 'Video preset for aspect ratio and duration',
                    enum: [
                        'landscape_short',
                        'landscape_long',
                        'portrait_short',
                        'portrait_long',
                        'square',
                        'cinematic'
                    ]
                },
                duration_seconds: {
                    type: 'number',
                    description: 'Approximate duration in seconds (4-6 seconds typical)'
                },
                seed: {
                    type: 'number',
                    description: 'Random seed for reproducibility'
                }
            },
            required: [
                'prompt'
            ]
        }
    },
    {
        name: 'animate_image',
        description: 'Animate a still image into a video using LTX-2 image-to-video. Takes a starting image and ' + 'creates motion based on the prompt. Use when user says "animate this image", "make this photo move", ' + 'or "bring this picture to life".',
        parameters: {
            type: 'object',
            properties: {
                image_url: {
                    type: 'string',
                    description: 'URL of the image to animate'
                },
                prompt: {
                    type: 'string',
                    description: 'Description of how the image should animate (e.g., "the person starts walking", "camera slowly zooms in")'
                },
                negative_prompt: {
                    type: 'string',
                    description: 'What to avoid in the animation'
                },
                duration_seconds: {
                    type: 'number',
                    description: 'Approximate duration in seconds (4-6 seconds typical)'
                },
                seed: {
                    type: 'number',
                    description: 'Random seed for reproducibility'
                }
            },
            required: [
                'image_url',
                'prompt'
            ]
        }
    },
    {
        name: 'list_video_presets',
        description: 'List available video generation presets with their aspect ratios and durations. ' + 'Use this to show the user what video formats are available.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    // =============================================================================
    // Autonomous Execution Tools (OpenClaw-inspired)
    // These tools enable Claw AI to spawn background tasks, work autonomously,
    // and announce results - making it feel like a real assistant that does work.
    // =============================================================================
    {
        name: 'spawn_task',
        description: 'Spawn a background task that runs independently and announces the result when done. ' + 'Use this when you need to do work that takes time (research, code analysis, file operations) ' + 'without blocking the conversation. The task runs server-side and survives browser close. ' + 'Examples: "Analyze this codebase", "Research competitors", "Generate a report". ' + 'IMPORTANT: This is how Claw AI does real work autonomously.',
        parameters: {
            type: 'object',
            properties: {
                task: {
                    type: 'string',
                    description: 'Description of what the task should accomplish. Be specific and detailed.'
                },
                label: {
                    type: 'string',
                    description: 'Short label for the task (shown in UI, e.g., "Code Analysis", "Research")'
                },
                timeoutSeconds: {
                    type: 'number',
                    description: 'Maximum time for the task to run in seconds (default: 300, max: 600)'
                },
                announceResult: {
                    type: 'boolean',
                    description: 'Whether to announce the result back in chat when done (default: true)'
                },
                priority: {
                    type: 'string',
                    description: 'Task priority for queue ordering',
                    enum: [
                        'low',
                        'normal',
                        'high'
                    ]
                },
                context: {
                    type: 'object',
                    description: 'Optional context to pass to the task (projectId, ticketId, sandboxId, etc.)'
                }
            },
            required: [
                'task'
            ]
        }
    },
    {
        name: 'list_background_tasks',
        description: 'List active and recent background tasks. Use this to check on spawned tasks, ' + 'see their progress, or review completed work.',
        parameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    description: 'Filter by task status',
                    enum: [
                        'queued',
                        'running',
                        'succeeded',
                        'failed',
                        'cancelled',
                        'all'
                    ]
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of tasks to return (default: 10)'
                }
            },
            required: []
        }
    },
    {
        name: 'cancel_background_task',
        description: 'Cancel a running or queued background task. Use this when the user wants to ' + 'stop a task that is taking too long or is no longer needed.',
        parameters: {
            type: 'object',
            properties: {
                jobId: {
                    type: 'string',
                    description: 'The job ID of the task to cancel'
                }
            },
            required: [
                'jobId'
            ]
        }
    },
    {
        name: 'get_task_result',
        description: 'Get the result of a completed background task. Use this to retrieve the output ' + 'of a task that has finished running.',
        parameters: {
            type: 'object',
            properties: {
                jobId: {
                    type: 'string',
                    description: 'The job ID of the task to get results for'
                }
            },
            required: [
                'jobId'
            ]
        }
    },
    {
        name: 'iterate_on_code',
        description: 'Start an autonomous code iteration session. Claw AI will analyze code, make changes, ' + 'run tests, and iterate until the goal is achieved or max iterations reached. ' + 'Perfect for refactoring, bug fixes, or implementing features with clear test criteria. ' + 'Requires an active sandbox with cloned repository.',
        parameters: {
            type: 'object',
            properties: {
                goal: {
                    type: 'string',
                    description: 'What the iteration should achieve (e.g., "Fix all TypeScript errors", "Add unit tests for auth module")'
                },
                sandboxId: {
                    type: 'string',
                    description: 'The sandbox ID with the cloned repository'
                },
                maxIterations: {
                    type: 'number',
                    description: 'Maximum number of analyze-modify-test cycles (default: 5, max: 10)'
                },
                stopOnSuccess: {
                    type: 'boolean',
                    description: 'Whether to stop when tests pass (default: true)'
                },
                commitChanges: {
                    type: 'boolean',
                    description: 'Whether to commit successful changes (default: false)'
                },
                testCommand: {
                    type: 'string',
                    description: 'Command to run for testing (e.g., "npm test", "pnpm typecheck")'
                }
            },
            required: [
                'goal',
                'sandboxId'
            ]
        }
    },
    {
        name: 'delegate_to_specialist',
        description: 'Delegate a task to a specialist agent with deep expertise in a specific area. ' + 'Specialists run as background tasks and announce findings when complete. ' + 'Use for security audits, code reviews, performance analysis, etc.',
        parameters: {
            type: 'object',
            properties: {
                specialist: {
                    type: 'string',
                    description: 'The type of specialist to delegate to',
                    enum: [
                        'code-reviewer',
                        'security-auditor',
                        'performance-analyst',
                        'documentation-writer',
                        'test-generator',
                        'refactoring-expert'
                    ]
                },
                task: {
                    type: 'string',
                    description: 'What the specialist should analyze or accomplish'
                },
                context: {
                    type: 'object',
                    description: 'Optional context (sandboxId, filePaths, repository info, etc.)'
                },
                announceResult: {
                    type: 'boolean',
                    description: 'Whether to announce findings in chat (default: true)'
                }
            },
            required: [
                'specialist',
                'task'
            ]
        }
    },
    // =============================================================================
    // AI Provider Tools (Local LLM / Cloud Settings)
    // =============================================================================
    {
        name: 'get_ai_provider_status',
        description: 'Check the current AI provider configuration and connection status. Shows whether ' + 'local (Ollama) or cloud (OpenAI) inference is being used, available models, and ' + 'latency information. Use when user asks "what model are you using", "are you running locally", ' + '"check AI status", or wants to know about the current AI setup.',
        parameters: {
            type: 'object',
            properties: {
                includeLatency: {
                    type: 'boolean',
                    description: 'Whether to include latency measurements (may add delay)'
                }
            },
            required: []
        },
        ownerOnly: true
    },
    {
        name: 'navigate_to_ai_settings',
        description: 'Open the AI provider settings page (/settings/ai) where the user can switch between ' + 'local and cloud inference, configure Ollama, and view connection status. Use when user ' + 'says "AI settings", "configure local model", "switch to local", "switch to cloud".',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        },
        ownerOnly: true
    },
    // =============================================================================
    // Kanban Task Reading Tools - Read and understand tasks
    // =============================================================================
    {
        name: 'get_kanban_task',
        description: 'Get details of a specific Kanban task by its ID. Use this when a user references a task ' + 'like "exp-001" or "p1-3" to understand what the task is about before taking action.',
        parameters: {
            type: 'object',
            properties: {
                taskId: {
                    type: 'string',
                    description: 'The task ID (e.g., "exp-001", "p1-1", "backlog-2")'
                }
            },
            required: [
                'taskId'
            ]
        }
    },
    {
        name: 'search_kanban_tasks',
        description: 'Search Kanban tasks by keyword. Use this to find tasks related to a topic, ' + 'or to see what tasks exist in the board.',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search term to find in task titles, descriptions, or tags'
                },
                status: {
                    type: 'string',
                    description: 'Optional: filter by status',
                    enum: [
                        'backlog',
                        'todo',
                        'in-progress',
                        'review',
                        'done'
                    ]
                }
            },
            required: [
                'query'
            ]
        }
    },
    // =============================================================================
    // Design Canvas Tools - Infinite canvas for visual composition
    // =============================================================================
    {
        name: 'create_canvas',
        description: 'Create a new design canvas for visual exploration, moodboards, mind maps, or flowcharts. ' + 'Use this when users want to create visual diagrams, plan architecture, or compose layouts. ' + 'The canvas supports multiple node types including shapes, sticky notes, images, and text.',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name for the canvas (e.g., "Claw AI Architecture", "Project Moodboard")'
                },
                canvasType: {
                    type: 'string',
                    description: 'Type of canvas layout',
                    enum: [
                        'freeform',
                        'wireframe',
                        'moodboard',
                        'storyboard',
                        'mindmap',
                        'flowchart'
                    ]
                },
                description: {
                    type: 'string',
                    description: 'Optional description of what this canvas is for'
                },
                backgroundColor: {
                    type: 'string',
                    description: 'Background color (hex, e.g., "#1a1a2e" for dark, "#ffffff" for white)'
                },
                gridEnabled: {
                    type: 'boolean',
                    description: 'Whether to show grid lines (default: true)'
                }
            },
            required: [
                'name',
                'canvasType'
            ]
        }
    },
    {
        name: 'list_canvases',
        description: 'List all design canvases. Use this to find existing canvases or see what visual ' + 'workspaces have been created.',
        parameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    description: 'Filter by canvas status',
                    enum: [
                        'active',
                        'archived',
                        'template'
                    ]
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of canvases to return (default: 20)'
                }
            },
            required: []
        }
    },
    {
        name: 'get_canvas',
        description: 'Get details of a specific canvas including its nodes and edges. Use this to view ' + 'what elements are on a canvas before adding more.',
        parameters: {
            type: 'object',
            properties: {
                canvasId: {
                    type: 'string',
                    description: 'The ID of the canvas to retrieve'
                }
            },
            required: [
                'canvasId'
            ]
        }
    },
    {
        name: 'add_canvas_node',
        description: 'Add a node (element) to a canvas. Nodes can be shapes, sticky notes, text, images, ' + 'code blocks, or other visual elements. Position is specified in x,y coordinates. ' + 'Use this to build visual representations, diagrams, or compositions.',
        parameters: {
            type: 'object',
            properties: {
                canvasId: {
                    type: 'string',
                    description: 'The ID of the canvas to add the node to'
                },
                nodeType: {
                    type: 'string',
                    description: 'Type of node to create',
                    enum: [
                        'text',
                        'image',
                        'shape',
                        'sticky',
                        'frame',
                        'code',
                        'embed',
                        'audio',
                        'video',
                        'link'
                    ]
                },
                x: {
                    type: 'number',
                    description: 'X position on canvas (0 is left edge)'
                },
                y: {
                    type: 'number',
                    description: 'Y position on canvas (0 is top edge)'
                },
                width: {
                    type: 'number',
                    description: 'Width of the node in pixels (default: varies by type)'
                },
                height: {
                    type: 'number',
                    description: 'Height of the node in pixels (default: varies by type)'
                },
                content: {
                    type: 'string',
                    description: 'Content for the node. For text/sticky: the text content. For image: URL. For shape: shape type (rectangle, circle, diamond, hexagon, star, arrow, cloud). For code: the code snippet.'
                },
                style: {
                    type: 'string',
                    description: 'JSON string of style properties: { "backgroundColor": "#hex", "borderColor": "#hex", "textColor": "#hex", "fontSize": 14, "fontWeight": "bold" }'
                }
            },
            required: [
                'canvasId',
                'nodeType',
                'x',
                'y',
                'content'
            ]
        }
    },
    {
        name: 'add_canvas_edge',
        description: 'Add an edge (connection/arrow) between two nodes on a canvas. Use this to show ' + 'relationships, data flow, or connections between elements. Edges can be straight ' + 'lines, curved lines, step connectors, or arrows.',
        parameters: {
            type: 'object',
            properties: {
                canvasId: {
                    type: 'string',
                    description: 'The ID of the canvas'
                },
                sourceNodeId: {
                    type: 'string',
                    description: 'ID of the source node (where the edge starts)'
                },
                targetNodeId: {
                    type: 'string',
                    description: 'ID of the target node (where the edge ends)'
                },
                edgeType: {
                    type: 'string',
                    description: 'Type of edge/connection',
                    enum: [
                        'straight',
                        'curved',
                        'step',
                        'arrow'
                    ]
                },
                label: {
                    type: 'string',
                    description: 'Optional label to display on the edge'
                },
                style: {
                    type: 'string',
                    description: 'JSON string of style properties: { "strokeColor": "#hex", "strokeWidth": 2, "dashed": false }'
                }
            },
            required: [
                'canvasId',
                'sourceNodeId',
                'targetNodeId',
                'edgeType'
            ]
        }
    },
    {
        name: 'update_canvas_node',
        description: 'Update an existing node on a canvas. Use this to change position, size, content, ' + 'or styling of an element.',
        parameters: {
            type: 'object',
            properties: {
                canvasId: {
                    type: 'string',
                    description: 'The ID of the canvas'
                },
                nodeId: {
                    type: 'string',
                    description: 'The ID of the node to update'
                },
                x: {
                    type: 'number',
                    description: 'New X position'
                },
                y: {
                    type: 'number',
                    description: 'New Y position'
                },
                width: {
                    type: 'number',
                    description: 'New width'
                },
                height: {
                    type: 'number',
                    description: 'New height'
                },
                content: {
                    type: 'string',
                    description: 'New content'
                },
                style: {
                    type: 'string',
                    description: 'New style JSON'
                }
            },
            required: [
                'canvasId',
                'nodeId'
            ]
        }
    },
    // =============================================================================
    // Apple Health Data Tools
    // =============================================================================
    {
        name: 'get_health_summary',
        description: 'Get a summary of health data for a specific date or today. Returns steps, heart rate, ' + 'sleep, activity scores, and other health metrics synced from Apple Health. ' + 'Use this when the user asks about their health, fitness, sleep, or activity data.',
        ownerOnly: true,
        parameters: {
            type: 'object',
            properties: {
                date: {
                    type: 'string',
                    description: 'The date to get health summary for in YYYY-MM-DD format. Defaults to today if not provided.'
                }
            },
            required: []
        }
    },
    {
        name: 'get_health_trends',
        description: 'Get health trends and weekly averages over time. Shows how steps, sleep, heart rate, ' + 'and activity scores have changed over recent weeks. Use this when the user asks about ' + 'their health trends, progress, or how their metrics have changed over time.',
        ownerOnly: true,
        parameters: {
            type: 'object',
            properties: {
                weeks: {
                    type: 'number',
                    description: 'Number of weeks to analyze. Defaults to 4 weeks.'
                }
            },
            required: []
        }
    },
    {
        name: 'get_health_metric',
        description: 'Get detailed data for a specific health metric over a date range. Returns raw samples ' + 'for metrics like steps, heart rate, sleep, workouts, etc. Use this when the user wants ' + 'to see detailed data for a specific metric.',
        ownerOnly: true,
        parameters: {
            type: 'object',
            properties: {
                metric: {
                    type: 'string',
                    description: 'The health metric to query',
                    enum: [
                        'steps',
                        'distance',
                        'activeEnergy',
                        'heartRate',
                        'restingHeartRate',
                        'heartRateVariability',
                        'sleepAnalysis',
                        'weight',
                        'bodyFat',
                        'bloodOxygen',
                        'mindfulMinutes',
                        'workout',
                        'exerciseMinutes',
                        'standHours'
                    ]
                },
                startDate: {
                    type: 'string',
                    description: 'Start date in YYYY-MM-DD format. Defaults to 7 days ago.'
                },
                endDate: {
                    type: 'string',
                    description: 'End date in YYYY-MM-DD format. Defaults to today.'
                }
            },
            required: [
                'metric'
            ]
        }
    },
    {
        name: 'compare_health_periods',
        description: 'Compare health metrics between two time periods. Useful for seeing improvement or ' + 'changes between this week vs last week, this month vs last month, etc.',
        ownerOnly: true,
        parameters: {
            type: 'object',
            properties: {
                period1Start: {
                    type: 'string',
                    description: 'Start date of first period (YYYY-MM-DD)'
                },
                period1End: {
                    type: 'string',
                    description: 'End date of first period (YYYY-MM-DD)'
                },
                period2Start: {
                    type: 'string',
                    description: 'Start date of second period (YYYY-MM-DD)'
                },
                period2End: {
                    type: 'string',
                    description: 'End date of second period (YYYY-MM-DD)'
                },
                metrics: {
                    type: 'array',
                    description: 'Which metrics to compare',
                    items: {
                        type: 'string'
                    }
                }
            },
            required: [
                'period1Start',
                'period1End',
                'period2Start',
                'period2End'
            ]
        }
    },
    {
        name: 'generate_health_api_key',
        description: 'Generate a new API key for syncing Apple Health data from an iOS Shortcut. ' + 'The key is shown only once and must be saved immediately. Use this when the user ' + 'wants to set up health data syncing from their iPhone.',
        ownerOnly: true,
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'A friendly name for this API key (e.g., "iPhone 15 Pro", "iPad")'
                },
                expiresInDays: {
                    type: 'number',
                    description: 'Number of days until the key expires. Leave empty for no expiration.'
                }
            },
            required: [
                'name'
            ]
        }
    },
    {
        name: 'list_health_api_keys',
        description: 'List all API keys for Apple Health syncing. Shows key names, last used dates, ' + 'and whether they are active or expired. Use this when the user wants to manage ' + 'their health sync API keys.',
        ownerOnly: true,
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'revoke_health_api_key',
        description: 'Revoke an API key to stop it from being used for health data syncing. ' + 'Use this when the user wants to disable a specific API key.',
        ownerOnly: true,
        parameters: {
            type: 'object',
            properties: {
                keyId: {
                    type: 'string',
                    description: 'The ID of the API key to revoke'
                }
            },
            required: [
                'keyId'
            ]
        }
    },
    {
        name: 'get_health_sync_status',
        description: 'Get the status of recent health data syncs. Shows when data was last synced, ' + 'how many samples were received, and any errors. Use this when the user asks ' + 'about their health sync status or if syncing is working.',
        ownerOnly: true,
        parameters: {
            type: 'object',
            properties: {
                limit: {
                    type: 'number',
                    description: 'Number of recent syncs to show. Defaults to 5.'
                }
            },
            required: []
        }
    },
    // =============================================================================
    // ERV Ontology Tools - AI-Assisted Entity Classification & Relationship Suggestion
    // Inspired by data governance patterns for automatic ontology population
    // =============================================================================
    {
        name: 'analyze_and_create_entity',
        description: 'Analyze content (URL, text, or data) and automatically classify it into the appropriate ERV entity type. ' + 'AI determines the best entity type, extracts relevant attributes, suggests tags, and creates the entity. ' + 'Use this when the user pastes content, shares a URL, or describes something that should be stored. ' + 'Examples: "save this article", "remember this person I met", "add this project idea".',
        parameters: {
            type: 'object',
            properties: {
                content: {
                    type: 'string',
                    description: 'The content to analyze. Can be: raw text, a URL, JSON data, or a description of something to remember.'
                },
                contentType: {
                    type: 'string',
                    description: 'Hint about the content type to help classification',
                    enum: [
                        'url',
                        'text',
                        'json',
                        'description',
                        'auto'
                    ]
                },
                suggestedType: {
                    type: 'string',
                    description: 'Optional: Suggest an entity type if the user indicates preference (e.g., "save as a person")',
                    enum: [
                        'Person',
                        'Project',
                        'Track',
                        'Draft',
                        'Sketch',
                        'Ticket',
                        'Epic',
                        'Event',
                        'Memory',
                        'Value',
                        'Collection',
                        'Skill',
                        'Reminder'
                    ]
                },
                additionalContext: {
                    type: 'string',
                    description: 'Optional: Additional context from the user about what this content is (e.g., "this is my coworker from the AI team")'
                }
            },
            required: [
                'content'
            ]
        },
        ownerOnly: true
    },
    {
        name: 'suggest_entity_relationships',
        description: 'Analyze an entity and suggest relationships to other existing entities in the ERV system. ' + 'Uses semantic similarity and content analysis to find connections the user might not have made explicitly. ' + 'Returns suggested relationships with confidence scores and reasoning. ' + 'Use when: user creates a new entity, asks "what is this related to?", or when building knowledge graphs.',
        parameters: {
            type: 'object',
            properties: {
                entityId: {
                    type: 'string',
                    description: 'The entity ID to find relationships for'
                },
                relationshipTypes: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Optional: Filter to specific relationship types (collaboratedOn, createdBy, mentions, relatedTo, etc.)'
                },
                maxSuggestions: {
                    type: 'number',
                    description: 'Maximum number of relationship suggestions to return (default: 10)'
                },
                minConfidence: {
                    type: 'number',
                    description: 'Minimum confidence threshold 0-1 for suggestions (default: 0.5)'
                },
                autoCreate: {
                    type: 'boolean',
                    description: 'If true, automatically create relationships above the confidence threshold (default: false)'
                }
            },
            required: [
                'entityId'
            ]
        },
        ownerOnly: true
    },
    {
        name: 'bulk_classify_entities',
        description: 'Import and classify multiple items at once into ERV entities. Takes an array of content items ' + 'and automatically determines entity types, extracts attributes, and creates entities in bulk. ' + 'Useful for importing contacts, bookmarks, notes, or any list of items. ' + 'Also suggests relationships between the imported entities and existing data.',
        parameters: {
            type: 'object',
            properties: {
                items: {
                    type: 'array',
                    description: 'Array of items to classify. Each item should have at minimum a "content" field.',
                    items: {
                        type: 'object',
                        properties: {
                            content: {
                                type: 'string'
                            },
                            hint: {
                                type: 'string'
                            }
                        }
                    }
                },
                sourceFormat: {
                    type: 'string',
                    description: 'Format hint for the data source',
                    enum: [
                        'csv',
                        'json',
                        'text_list',
                        'urls',
                        'contacts',
                        'bookmarks',
                        'notes',
                        'auto'
                    ]
                },
                defaultType: {
                    type: 'string',
                    description: 'Default entity type if classification is uncertain',
                    enum: [
                        'Person',
                        'Project',
                        'Track',
                        'Draft',
                        'Sketch',
                        'Ticket',
                        'Epic',
                        'Event',
                        'Memory',
                        'Value',
                        'Collection',
                        'Skill',
                        'Reminder'
                    ]
                },
                commonTags: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Tags to apply to all imported entities (e.g., ["import-2026-02", "contacts"])'
                },
                dryRun: {
                    type: 'boolean',
                    description: 'If true, return classification results without creating entities (default: false)'
                }
            },
            required: [
                'items'
            ]
        },
        ownerOnly: true
    },
    // ============================================================================
    // Music Generation Tools (ACE-Step via Lynkr)
    // ============================================================================
    {
        name: 'cowrite_music',
        description: 'ALWAYS use this tool FIRST when the user wants to create music. This tool helps craft the perfect music generation request ' + 'through a conversational back-and-forth. It guides users to develop their musical vision step by step: ' + '1) Genre/style direction, 2) Mood and energy, 3) Instrumentation, 4) Lyrics (if vocal), 5) Structure, ' + '6) Reference track (optional), 7) Technical specs (BPM, key, duration). ' + 'Returns a draft payload that can be refined before final generation. ' + 'Use this instead of jumping straight to generate_music - it produces much better results.',
        parameters: {
            type: 'object',
            properties: {
                step: {
                    type: 'string',
                    enum: [
                        'start',
                        'refine_style',
                        'add_lyrics',
                        'set_structure',
                        'add_reference',
                        'finalize',
                        'generate'
                    ],
                    description: 'Which step of the cowriting process: ' + 'start = begin new session, gather initial idea; ' + 'refine_style = enhance style description with genre, instruments, mood; ' + 'add_lyrics = help write or structure lyrics; ' + 'set_structure = define song structure with tags; ' + 'add_reference = incorporate reference audio for style matching; ' + 'finalize = review and confirm all parameters; ' + 'generate = user confirmed, proceed to generation'
                },
                userInput: {
                    type: 'string',
                    description: 'The user\'s input or response for this step of the cowriting process.'
                },
                currentDraft: {
                    type: 'string',
                    description: 'JSON string of the current draft payload being built up. Pass this between steps to maintain state. ' + 'Parse with JSON.parse(). Expected shape: { prompt?: string, lyrics?: string, duration?: number, ' + 'bpm?: number, key?: string, timeSignature?: string, title?: string, referenceAudioUrl?: string, ' + 'referenceStrength?: number }'
                }
            },
            required: [
                'step',
                'userInput'
            ]
        },
        ownerOnly: true
    },
    {
        name: 'generate_music',
        description: 'Generate original music using AI (ACE-Step). Creates audio from a style description and optional lyrics. ' + 'Can generate 10 seconds to 10 minutes of music with control over BPM, key, and time signature. ' + 'Supports 50+ languages for lyrics. Use structure tags like [Verse], [Chorus], [Bridge] for song structure. ' + 'Supports reference audio for style transfer - provide a URL to match the vibe of an existing track. ' + 'NOTE: For best results, use cowrite_music first to help the user craft their request.',
        parameters: {
            type: 'object',
            properties: {
                prompt: {
                    type: 'string',
                    description: 'Musical style description. Be specific about genre, instruments, mood, and production style. ' + 'Example: "upbeat indie folk with acoustic guitar, soft female vocals, warm production"'
                },
                lyrics: {
                    type: 'string',
                    description: 'Optional lyrics with structure tags. Use [Verse], [Chorus], [Bridge], [Intro], [Outro] for structure. ' + 'Example: "[Verse]\\nWalking down the street\\n[Chorus]\\nThis is where I want to be"'
                },
                duration: {
                    type: 'number',
                    description: 'Duration in seconds (10-600). Default is 30 seconds. Use 180-300 for full songs.'
                },
                bpm: {
                    type: 'number',
                    description: 'Beats per minute (60-200). Leave empty for auto-detection from prompt.'
                },
                key: {
                    type: 'string',
                    description: 'Musical key like "C major", "A minor", "F# major". Leave empty for auto-detection.'
                },
                timeSignature: {
                    type: 'string',
                    description: 'Time signature like "4/4", "3/4", "6/8". Default is "4/4".'
                },
                referenceAudioUrl: {
                    type: 'string',
                    description: 'URL to a reference audio file for style transfer. The generated music will match the vibe, ' + 'energy, and production style of this reference. Supports MP3, WAV, FLAC.'
                },
                referenceStrength: {
                    type: 'number',
                    description: 'How strongly to match the reference audio style (0.0-1.0). Default is 0.5. ' + 'Higher values = closer to reference style, lower = more creative freedom.'
                },
                title: {
                    type: 'string',
                    description: 'Title for the generated track.'
                },
                saveToJamz: {
                    type: 'boolean',
                    description: 'If true, automatically add the generated track to Jamz Studio.'
                },
                projectId: {
                    type: 'string',
                    description: 'Jamz project ID to add the track to (if saveToJamz is true).'
                }
            },
            required: [
                'prompt'
            ]
        },
        ownerOnly: true
    },
    {
        name: 'analyze_audio',
        description: 'Analyze audio to extract musical properties like BPM, key, time signature, and generate AI descriptions. ' + 'Can also extract lyrics with timestamps from vocal tracks. Useful for understanding existing music ' + 'before creating variations or matching styles.',
        parameters: {
            type: 'object',
            properties: {
                audioUrl: {
                    type: 'string',
                    description: 'URL of the audio file to analyze.'
                },
                extract: {
                    type: 'array',
                    description: 'What to extract from the audio.',
                    items: {
                        type: 'string'
                    }
                }
            },
            required: [
                'audioUrl'
            ]
        },
        ownerOnly: true
    },
    {
        name: 'separate_stems',
        description: 'Separate audio into individual stems (vocals, drums, bass, other, piano, guitar). ' + 'Useful for remixing, isolating vocals for analysis, or creating karaoke versions. ' + 'Returns URLs to each separated stem audio file.',
        parameters: {
            type: 'object',
            properties: {
                audioUrl: {
                    type: 'string',
                    description: 'URL of the audio file to separate.'
                },
                stems: {
                    type: 'array',
                    description: 'Which stems to extract. Default is ["vocals", "drums", "bass", "other"].',
                    items: {
                        type: 'string'
                    }
                }
            },
            required: [
                'audioUrl'
            ]
        },
        ownerOnly: true
    }
];
function getOpenAITools() {
    return CLAW_AI_TOOLS.map((tool)=>({
            type: 'function',
            function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters
            }
        }));
}
function toOpenAITools(tools) {
    return tools.map((tool)=>({
            type: 'function',
            function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters
            }
        }));
}
function parseToolCalls(toolCalls) {
    return toolCalls.map((tc)=>({
            name: tc.function.name,
            arguments: JSON.parse(tc.function.arguments)
        }));
}
}),
"[project]/src/lib/tools-registry.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TOOL_CATEGORY_INFO",
    ()=>TOOL_CATEGORY_INFO,
    "buildToolsRegistry",
    ()=>buildToolsRegistry,
    "getCategoryStats",
    ()=>getCategoryStats,
    "getToolsRegistryByCategory",
    ()=>getToolsRegistryByCategory,
    "getToolsRegistryForAccessLevel",
    ()=>getToolsRegistryForAccessLevel,
    "searchTools",
    ()=>searchTools
]);
/**
 * Tools Registry - Browseable catalog of all Claw AI tools
 *
 * Provides categorization, access levels, and metadata for displaying
 * the complete set of 121 Claw AI tools on the /skills page.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$tools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/claw-ai/tools.ts [app-ssr] (ecmascript)");
;
const TOOL_CATEGORY_INFO = {
    system: {
        label: 'System & Navigation',
        icon: 'Briefcase',
        description: 'Search and navigate the workspace'
    },
    scheduling: {
        label: 'Scheduling & Calendar',
        icon: 'Calendar',
        description: 'Manage meetings and availability'
    },
    ui: {
        label: 'Rich UI Rendering',
        icon: 'Layout',
        description: 'Generate dynamic UI components'
    },
    product: {
        label: 'Product Lifecycle',
        icon: 'Package',
        description: 'Create and manage products, PRDs, tickets'
    },
    memory: {
        label: 'Memory & Context',
        icon: 'Brain',
        description: 'Store and recall memories and context'
    },
    coding: {
        label: 'Code & Development',
        icon: 'Code',
        description: 'File operations, git, and code execution'
    },
    cron: {
        label: 'Scheduled Jobs',
        icon: 'Clock',
        description: 'Create and manage cron jobs'
    },
    channels: {
        label: 'Channels & Messages',
        icon: 'MessageSquare',
        description: 'Multi-platform messaging'
    },
    dimensions: {
        label: 'ERV Dimensions',
        icon: 'Boxes',
        description: 'Create and navigate data dimensions'
    },
    video: {
        label: 'Video Production',
        icon: 'Video',
        description: 'Create and compose videos with Remotion'
    },
    image: {
        label: 'Image Processing',
        icon: 'Image',
        description: 'Apply effects, generate icons, process images'
    },
    canvas: {
        label: 'Design Canvas',
        icon: 'Pencil',
        description: 'Create and manage infinite canvas workspaces'
    },
    health: {
        label: 'Health & Wellness',
        icon: 'Heart',
        description: 'Track and analyze health metrics'
    },
    erv: {
        label: 'Entity Classification',
        icon: 'Network',
        description: 'AI-assisted entity creation and classification'
    },
    music: {
        label: 'Music Generation',
        icon: 'Music',
        description: 'Generate and analyze music with ACE-Step'
    },
    background: {
        label: 'Background Tasks',
        icon: 'Loader',
        description: 'Spawn and manage autonomous agent tasks'
    },
    'ai-settings': {
        label: 'AI & System',
        icon: 'Settings',
        description: 'Provider settings and system queries'
    }
};
// ============================================================================
// Tool Category Mappings
// ============================================================================
const TOOL_CATEGORIES = {
    // System & Navigation
    search_system: 'system',
    navigate_to: 'system',
    list_themes: 'system',
    open_search_app: 'system',
    show_weather: 'system',
    show_photos: 'system',
    show_kanban_tasks: 'system',
    // Scheduling
    schedule_call: 'scheduling',
    get_available_times: 'scheduling',
    get_upcoming_bookings: 'scheduling',
    book_meeting: 'scheduling',
    reschedule_meeting: 'scheduling',
    cancel_meeting: 'scheduling',
    // UI Rendering
    render_ui: 'ui',
    // Product Lifecycle
    create_project: 'product',
    create_prd: 'product',
    create_ticket: 'product',
    update_ticket: 'product',
    shard_prd: 'product',
    get_project_kanban: 'product',
    list_projects: 'product',
    // Memory & Context
    remember: 'memory',
    recall_preference: 'memory',
    memorize: 'memory',
    learn: 'memory',
    forget: 'memory',
    set_active_context: 'memory',
    get_active_context: 'memory',
    load_context_from_reference: 'memory',
    // Coding & Development
    clone_repository: 'coding',
    list_directory: 'coding',
    search_codebase: 'coding',
    read_file: 'coding',
    write_file: 'coding',
    edit_file: 'coding',
    delete_file: 'coding',
    run_command: 'coding',
    start_dev_server: 'coding',
    get_preview_url: 'coding',
    git_status: 'coding',
    git_diff: 'coding',
    git_commit: 'coding',
    git_push: 'coding',
    create_branch: 'coding',
    create_coding_task: 'coding',
    update_coding_task: 'coding',
    list_coding_tasks: 'coding',
    // Scheduled Jobs
    create_cron_job: 'cron',
    list_cron_jobs: 'cron',
    toggle_cron_job: 'cron',
    delete_cron_job: 'cron',
    // Channels & Messages
    compact_conversation: 'channels',
    get_compaction_summary: 'channels',
    list_channel_integrations: 'channels',
    get_channel_conversations: 'channels',
    send_channel_message: 'channels',
    search_channel_messages: 'channels',
    // ERV Dimensions
    create_dimension: 'dimensions',
    navigate_to_dimension: 'dimensions',
    list_dimensions: 'dimensions',
    search_entities: 'dimensions',
    // Video Production
    create_video_composition: 'video',
    add_text_overlay: 'video',
    add_lyrics_to_video: 'video',
    add_media_to_video: 'video',
    preview_video: 'video',
    render_video: 'video',
    sync_lyrics_to_audio: 'video',
    get_render_status: 'video',
    add_particle_effect: 'video',
    add_waveform_visualizer: 'video',
    add_gradient_background: 'video',
    create_slideshow: 'video',
    add_cinematic_effect: 'video',
    add_kinetic_typography: 'video',
    export_for_platform: 'video',
    list_video_compositions: 'video',
    create_talking_video: 'video',
    generate_video_script: 'video',
    generate_voice_audio: 'video',
    navigate_to_video_studio: 'video',
    // Image Processing
    apply_image_effect: 'image',
    generate_app_icon: 'image',
    remove_background: 'image',
    create_branded_image: 'image',
    batch_process_images: 'image',
    create_color_palette: 'image',
    resize_and_crop: 'image',
    composite_images: 'image',
    generate_pattern: 'image',
    // Design Canvas
    create_canvas: 'canvas',
    list_canvases: 'canvas',
    get_canvas: 'canvas',
    add_canvas_node: 'canvas',
    add_canvas_edge: 'canvas',
    update_canvas_node: 'canvas',
    // Health & Wellness
    get_health_summary: 'health',
    get_health_trends: 'health',
    get_health_metric: 'health',
    compare_health_periods: 'health',
    generate_health_api_key: 'health',
    list_health_api_keys: 'health',
    revoke_health_api_key: 'health',
    get_health_sync_status: 'health',
    // Entity Classification
    analyze_and_create_entity: 'erv',
    suggest_entity_relationships: 'erv',
    bulk_classify_entities: 'erv',
    // Music Generation
    cowrite_music: 'music',
    generate_music: 'music',
    analyze_audio: 'music',
    separate_stems: 'music',
    // Background Tasks
    spawn_task: 'background',
    list_background_tasks: 'background',
    cancel_background_task: 'background',
    get_task_result: 'background',
    iterate_on_code: 'background',
    delegate_to_specialist: 'background',
    // AI & System
    get_ai_provider_status: 'ai-settings',
    navigate_to_ai_settings: 'ai-settings',
    get_kanban_task: 'ai-settings',
    search_kanban_tasks: 'ai-settings'
};
// ============================================================================
// Access Level Mappings
// ============================================================================
const VISITOR_TOOLS = new Set([
    'search_system',
    'navigate_to',
    'list_themes',
    'open_search_app',
    'show_weather',
    'show_photos'
]);
const COLLABORATOR_TOOLS = new Set([
    // All visitor tools
    ...VISITOR_TOOLS,
    // View kanban and projects (read-only)
    'show_kanban_tasks',
    'list_projects',
    'get_project_kanban',
    // Scheduling (view only)
    'get_available_times',
    'get_upcoming_bookings',
    // Read-only context
    'get_active_context',
    'load_context_from_reference',
    // Read-only coding
    'list_coding_tasks',
    'list_directory',
    'read_file',
    'search_codebase',
    'git_status',
    'git_diff',
    // Cron jobs (view only)
    'list_cron_jobs',
    // Compaction (view only)
    'get_compaction_summary',
    // Channels (view only)
    'list_channel_integrations',
    'get_channel_conversations',
    'search_channel_messages'
]);
/**
 * Determine access level for a tool
 */ function getToolAccessLevel(toolName) {
    if (VISITOR_TOOLS.has(toolName)) {
        return 'visitor';
    }
    if (COLLABORATOR_TOOLS.has(toolName)) {
        return 'collaborator';
    }
    return 'owner';
}
function buildToolsRegistry() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$tools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CLAW_AI_TOOLS"].map((tool)=>{
        const category = TOOL_CATEGORIES[tool.name] || 'ai-settings';
        const accessLevel = getToolAccessLevel(tool.name);
        const paramCount = tool.parameters.required.length;
        return {
            name: tool.name,
            description: tool.description,
            category,
            accessLevel,
            ownerOnly: tool.ownerOnly || false,
            paramCount
        };
    });
}
function getToolsRegistryForAccessLevel(accessLevel) {
    const registry = buildToolsRegistry();
    return registry.filter((tool)=>{
        switch(accessLevel){
            case 'owner':
                return true;
            case 'collaborator':
                return tool.accessLevel === 'visitor' || tool.accessLevel === 'collaborator';
            case 'visitor':
                return tool.accessLevel === 'visitor';
            default:
                return false;
        }
    });
}
function getToolsRegistryByCategory(accessLevel) {
    const registry = accessLevel ? getToolsRegistryForAccessLevel(accessLevel) : buildToolsRegistry();
    const grouped = {};
    // Initialize all categories
    Object.keys(TOOL_CATEGORY_INFO).forEach((cat)=>{
        grouped[cat] = [];
    });
    // Group tools by category
    registry.forEach((tool)=>{
        if (!grouped[tool.category]) {
            grouped[tool.category] = [];
        }
        grouped[tool.category].push(tool);
    });
    return grouped;
}
function getCategoryStats(accessLevel) {
    const grouped = getToolsRegistryByCategory(accessLevel);
    return Object.entries(grouped).map(([category, tools])=>({
            category: category,
            info: TOOL_CATEGORY_INFO[category],
            toolCount: tools.length
        }));
}
function searchTools(query, accessLevel) {
    const registry = accessLevel ? getToolsRegistryForAccessLevel(accessLevel) : buildToolsRegistry();
    const lowerQuery = query.toLowerCase();
    return registry.filter((tool)=>tool.name.toLowerCase().includes(lowerQuery) || tool.description.toLowerCase().includes(lowerQuery));
}
}),
];

//# sourceMappingURL=src_lib_2a6e8a6e._.js.map