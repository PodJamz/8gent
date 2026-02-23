(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__299063ec._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/app/api/tts/elevenlabs/route.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
const runtime = 'edge';
// Default to a natural conversational voice if no custom voice ID provided
const DEFAULT_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam - natural male voice
async function POST(request) {
    try {
        const body = await request.json();
        const { text, voiceId = process.env.ELEVENLABS_JAMES_VOICE_ID || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID, modelId = 'eleven_multilingual_v2', stability = 0.5, similarityBoost = 0.75, style = 0.0, useSpeakerBoost = true } = body;
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
        // Eleven Labs has a limit of ~5000 characters per request
        if (text.length > 5000) {
            return new Response(JSON.stringify({
                error: 'Text too long (max 5000 characters)'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            // Fallback to OpenAI TTS if Eleven Labs not configured
            console.log('Eleven Labs API key not configured, falling back to OpenAI');
            return new Response(JSON.stringify({
                error: 'Eleven Labs API key not configured',
                fallback: 'openai'
            }), {
                status: 503,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        // Call Eleven Labs TTS API
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey
            },
            body: JSON.stringify({
                text,
                model_id: modelId,
                voice_settings: {
                    stability,
                    similarity_boost: similarityBoost,
                    style,
                    use_speaker_boost: useSpeakerBoost
                }
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Eleven Labs TTS API error:', errorText);
            return new Response(JSON.stringify({
                error: 'Failed to generate speech',
                fallback: 'openai'
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
        console.error('Eleven Labs TTS API error:', error);
        return new Response(JSON.stringify({
            error: 'Internal server error',
            fallback: 'openai'
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

//# sourceMappingURL=%5Broot-of-the-server%5D__299063ec._.js.map