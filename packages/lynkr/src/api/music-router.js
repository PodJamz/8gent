/**
 * Lynkr Music Router
 * Routes /v1/audio/* requests to local ACE-Step server
 *
 * Setup:
 * 1. Add to your Lynkr .env:
 *    ACESTEP_ENABLED=true
 *    ACESTEP_ENDPOINT=http://localhost:8001
 *
 * 2. Import in your main Lynkr app:
 *    const musicRouter = require('./api/music-router');
 *    app.use('/v1/audio', musicRouter);
 */

const express = require('express');
const router = express.Router();
const FormData = require('form-data');

// ACE-Step configuration
const ACESTEP_ENDPOINT = process.env.ACESTEP_ENDPOINT || 'http://localhost:8001';
const ACESTEP_ENABLED = process.env.ACESTEP_ENABLED === 'true';
const ACESTEP_TIMEOUT_MS = parseInt(process.env.ACESTEP_TIMEOUT_MS || '600000'); // 10 min default for long generations

/**
 * Check if ACE-Step is available
 */
router.get('/health', async (req, res) => {
  if (!ACESTEP_ENABLED) {
    return res.json({
      status: 'disabled',
      message: 'ACE-Step is not enabled. Set ACESTEP_ENABLED=true in .env'
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${ACESTEP_ENDPOINT}/health`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (response.ok) {
      return res.json({
        status: 'ok',
        endpoint: ACESTEP_ENDPOINT,
        acestep: await response.json()
      });
    } else {
      return res.status(503).json({
        status: 'error',
        message: 'ACE-Step server responded with error',
        statusCode: response.status
      });
    }
  } catch (error) {
    return res.status(503).json({
      status: 'error',
      message: error.name === 'AbortError'
        ? 'ACE-Step server timeout'
        : `ACE-Step server unreachable: ${error.message}`
    });
  }
});

/**
 * POST /v1/audio/generate
 * Generate music from text prompt and optional lyrics
 */
router.post('/generate', async (req, res) => {
  if (!ACESTEP_ENABLED) {
    return res.status(503).json({
      error: 'ACE-Step is not enabled',
      message: 'Set ACESTEP_ENABLED=true in Lynkr .env'
    });
  }

  const {
    prompt,
    lyrics,
    duration = 30,
    bpm,
    key,
    time_signature = '4/4',
    reference_audio,
    reference_strength = 0.5,
    model = 'acestep-v15-turbo',
    lm_model = 'acestep-5Hz-lm-1.7B',
    batch_size = 1,
    format = 'mp3'
  } = req.body;

  if (!prompt && !lyrics) {
    return res.status(400).json({
      error: 'Missing required field',
      message: 'Either prompt or lyrics is required'
    });
  }

  console.log('[Lynkr Music] Generate request:', {
    prompt: prompt?.substring(0, 50),
    duration,
    hasLyrics: !!lyrics,
    hasReference: !!reference_audio
  });

  try {
    // Build ACE-Step request payload
    // The acestep-api uses a different format - adapt as needed
    const aceStepPayload = {
      prompt: prompt || '',
      lyrics: lyrics || '',
      duration: Math.min(Math.max(duration, 10), 600), // Clamp 10-600
      audio_duration: Math.min(Math.max(duration, 10), 600),
      cfg_scale: 7.0,
      num_inference_steps: 60,
      seed: Math.floor(Math.random() * 2147483647),
      batch_size: batch_size
    };

    // Add optional metadata
    if (bpm) aceStepPayload.bpm = bpm;
    if (key) aceStepPayload.key = key;
    if (time_signature) aceStepPayload.time_signature = time_signature;

    // Handle reference audio if provided
    let endpoint = `${ACESTEP_ENDPOINT}/generate`;
    if (reference_audio) {
      endpoint = `${ACESTEP_ENDPOINT}/generate_with_reference`;
      aceStepPayload.reference_audio = reference_audio;
      aceStepPayload.reference_strength = reference_strength;
    }

    console.log('[Lynkr Music] Calling ACE-Step:', endpoint);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ACESTEP_TIMEOUT_MS);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(aceStepPayload),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Lynkr Music] ACE-Step error:', errorText);
      return res.status(response.status).json({
        error: 'ACE-Step generation failed',
        message: errorText
      });
    }

    // ACE-Step returns the audio file directly or as JSON with base64/URL
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('audio/')) {
      // Direct audio response - pipe through
      res.setHeader('Content-Type', contentType);
      const arrayBuffer = await response.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    } else {
      // JSON response with audio data
      const result = await response.json();
      console.log('[Lynkr Music] Generation complete, returning result');
      return res.json(result);
    }

  } catch (error) {
    console.error('[Lynkr Music] Generation error:', error);

    if (error.name === 'AbortError') {
      return res.status(408).json({
        error: 'Generation timeout',
        message: `Generation exceeded ${ACESTEP_TIMEOUT_MS / 1000}s timeout`
      });
    }

    return res.status(500).json({
      error: 'Generation failed',
      message: error.message
    });
  }
});

/**
 * POST /v1/audio/analyze
 * Analyze audio to extract BPM, key, time signature, and description
 */
router.post('/analyze', async (req, res) => {
  if (!ACESTEP_ENABLED) {
    return res.status(503).json({
      error: 'ACE-Step is not enabled'
    });
  }

  const { audio } = req.body;

  if (!audio) {
    return res.status(400).json({
      error: 'Missing required field',
      message: 'audio (base64 or URL) is required'
    });
  }

  console.log('[Lynkr Music] Analyze request');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 1 min for analysis

    const response = await fetch(`${ACESTEP_ENDPOINT}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'Analysis failed',
        message: errorText
      });
    }

    const result = await response.json();
    console.log('[Lynkr Music] Analysis complete:', result);
    return res.json(result);

  } catch (error) {
    console.error('[Lynkr Music] Analysis error:', error);
    return res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
});

/**
 * POST /v1/audio/separate
 * Separate audio into stems (vocals, drums, bass, other)
 */
router.post('/separate', async (req, res) => {
  if (!ACESTEP_ENABLED) {
    return res.status(503).json({
      error: 'ACE-Step is not enabled'
    });
  }

  const { audio, stems = ['vocals', 'drums', 'bass', 'other'] } = req.body;

  if (!audio) {
    return res.status(400).json({
      error: 'Missing required field',
      message: 'audio (base64 or URL) is required'
    });
  }

  console.log('[Lynkr Music] Stem separation request:', stems);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 300000); // 5 min for separation

    const response = await fetch(`${ACESTEP_ENDPOINT}/separate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio, stems }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'Stem separation failed',
        message: errorText
      });
    }

    const result = await response.json();
    console.log('[Lynkr Music] Separation complete');
    return res.json(result);

  } catch (error) {
    console.error('[Lynkr Music] Separation error:', error);
    return res.status(500).json({
      error: 'Separation failed',
      message: error.message
    });
  }
});

module.exports = router;
