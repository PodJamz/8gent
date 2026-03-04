/**
 * Lynkr - Universal Local AI Proxy
 *
 * Routes cloud requests to local AI services via Cloudflare Tunnel:
 * - /v1/chat/completions → Ollama (LLM)
 * - /v1/audio/transcriptions → faster-whisper (STT)
 * - /v1/audio/generate → ACE-Step (Music)
 * - /v1/audio/analyze → ACE-Step (Analysis)
 * - /v1/audio/separate → ACE-Step (Stems)
 *
 * Setup:
 * 1. Copy .env.example to .env and configure
 * 2. npm install
 * 3. npm start
 * 4. cloudflared tunnel --url http://localhost:8081
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 8081;

// API Key authentication
const LYNKR_API_KEY = process.env.LYNKR_API_KEY;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Multer for file uploads (Whisper)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// API Key validation middleware
const validateApiKey = (req, res, next) => {
  if (!LYNKR_API_KEY) {
    console.warn('[Lynkr] No API key configured - accepting all requests');
    return next();
  }

  const authHeader = req.headers.authorization;
  const providedKey = authHeader?.replace('Bearer ', '');

  if (providedKey !== LYNKR_API_KEY) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing API key'
    });
  }

  next();
};

app.use(validateApiKey);

// Health check
app.get('/health', async (req, res) => {
  const services = {
    lynkr: 'ok',
    ollama: 'checking',
    whisper: 'checking',
    acestep: 'checking'
  };

  // Check Ollama
  try {
    const ollamaRes = await fetch(`${process.env.OLLAMA_HOST || 'http://localhost:11434'}/api/tags`);
    services.ollama = ollamaRes.ok ? 'ok' : 'error';
  } catch {
    services.ollama = 'offline';
  }

  // Check Whisper
  if (process.env.WHISPER_ENABLED === 'true') {
    try {
      const whisperRes = await fetch(`${process.env.WHISPER_ENDPOINT || 'http://localhost:8082'}/health`);
      services.whisper = whisperRes.ok ? 'ok' : 'error';
    } catch {
      services.whisper = 'offline';
    }
  } else {
    services.whisper = 'disabled';
  }

  // Check ACE-Step
  if (process.env.ACESTEP_ENABLED === 'true') {
    try {
      const aceRes = await fetch(`${process.env.ACESTEP_ENDPOINT || 'http://localhost:8001'}/health`);
      services.acestep = aceRes.ok ? 'ok' : 'error';
    } catch {
      services.acestep = 'offline';
    }
  } else {
    services.acestep = 'disabled';
  }

  res.json({
    status: 'ok',
    services
  });
});

// ============== Ollama (LLM) ==============

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

app.post('/v1/chat/completions', async (req, res) => {
  console.log('[Lynkr] Chat completion request:', req.body.model);

  try {
    // Convert OpenAI format to Ollama format
    const ollamaRequest = {
      model: req.body.model || 'gpt-oss:20b',
      messages: req.body.messages,
      stream: req.body.stream || false,
      options: {
        temperature: req.body.temperature,
        top_p: req.body.top_p,
        num_predict: req.body.max_tokens
      }
    };

    const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ollamaRequest)
    });

    if (req.body.stream) {
      // Stream response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(l => l.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            // Convert to OpenAI format
            const openAIChunk = {
              id: `chatcmpl-${Date.now()}`,
              object: 'chat.completion.chunk',
              created: Math.floor(Date.now() / 1000),
              model: req.body.model,
              choices: [{
                index: 0,
                delta: { content: data.message?.content || '' },
                finish_reason: data.done ? 'stop' : null
              }]
            };
            res.write(`data: ${JSON.stringify(openAIChunk)}\n\n`);
          } catch {}
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      // Non-streaming
      const data = await response.json();
      res.json({
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: req.body.model,
        choices: [{
          index: 0,
          message: data.message,
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: data.prompt_eval_count || 0,
          completion_tokens: data.eval_count || 0,
          total_tokens: (data.prompt_eval_count || 0) + (data.eval_count || 0)
        }
      });
    }
  } catch (error) {
    console.error('[Lynkr] Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============== Whisper (STT) ==============

const WHISPER_ENDPOINT = process.env.WHISPER_ENDPOINT || 'http://localhost:8082';
const WHISPER_ENABLED = process.env.WHISPER_ENABLED === 'true';

app.post('/v1/audio/transcriptions', upload.single('file'), async (req, res) => {
  if (!WHISPER_ENABLED) {
    return res.status(503).json({ error: 'Whisper not enabled' });
  }

  console.log('[Lynkr] Transcription request');

  try {
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    form.append('model', req.body.model || 'base.en');

    const response = await fetch(`${WHISPER_ENDPOINT}/v1/audio/transcriptions`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[Lynkr] Transcription error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============== ACE-Step (Music) ==============

const musicRouter = require('./api/music-router');
app.use('/v1/audio', musicRouter);

// ============== Start Server ==============

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                    🎵 Lynkr v1.1.0 🎵                     ║
╠═══════════════════════════════════════════════════════════╣
║  Universal Local AI Proxy                                  ║
║                                                            ║
║  Listening on: http://localhost:${PORT}                      ║
║                                                            ║
║  Services:                                                 ║
║  • Ollama (LLM):     ${OLLAMA_HOST.padEnd(30)}  ║
║  • Whisper (STT):    ${WHISPER_ENABLED ? WHISPER_ENDPOINT.padEnd(30) : 'disabled'.padEnd(30)}  ║
║  • ACE-Step (Music): ${process.env.ACESTEP_ENABLED === 'true' ? (process.env.ACESTEP_ENDPOINT || 'http://localhost:8001').padEnd(30) : 'disabled'.padEnd(30)}  ║
║                                                            ║
║  Next: cloudflared tunnel --url http://localhost:${PORT}     ║
╚═══════════════════════════════════════════════════════════╝
`);
});
