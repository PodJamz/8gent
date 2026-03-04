import { NextRequest, NextResponse } from 'next/server';

// Mini-app AI API - Handles various AI requests for design theme mini-apps
export async function POST(request: NextRequest) {
  try {
    const { type, prompt, context } = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Handle different mini-app types
    switch (type) {
      case 'tarot-reading': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a mystical tarot reader. Generate a single tarot card reading. Respond in JSON format only:
{
  "card": "The [Card Name]",
  "symbol": "[single emoji that represents the card]",
  "meaning": "[2-3 word theme]",
  "guidance": "[One poetic sentence of guidance, max 15 words]"
}
Be mystical, poetic, and positive. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'Draw a card for me.' }
            ],
            max_tokens: 150,
            temperature: 0.9,
          }),
        });

        if (!response.ok) {
          throw new Error('OpenAI API error');
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        // Parse the JSON response
        try {
          const parsed = JSON.parse(content);
          return NextResponse.json(parsed);
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'coffee-mood': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a warm, friendly coffee expert. Based on the user's mood or request, suggest a perfect coffee. Respond in JSON format only:
{
  "drink": "[Coffee drink name]",
  "description": "[One cozy sentence about why this fits their mood, max 12 words]",
  "tip": "[One short brewing tip, max 10 words]",
  "emoji": "[single coffee-related emoji]"
}
Be warm, inviting, and cozy. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I need something comforting.' }
            ],
            max_tokens: 150,
            temperature: 0.8,
          }),
        });

        if (!response.ok) {
          throw new Error('OpenAI API error');
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          const parsed = JSON.parse(content);
          return NextResponse.json(parsed);
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'plant-spirit': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a wise forest spirit (Kodama). Generate a nature-inspired message. Respond in JSON format only:
{
  "message": "[A gentle, wise observation about nature or growth, max 15 words]",
  "emoji": "[single nature emoji: 🌱🌿🍃🌳🌲🌻🌸🍀]",
  "wisdom": "[One word that captures the essence]"
}
Be gentle, wise, and connected to nature. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'Share your wisdom.' }
            ],
            max_tokens: 100,
            temperature: 0.9,
          }),
        });

        if (!response.ok) {
          throw new Error('OpenAI API error');
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          const parsed = JSON.parse(content);
          return NextResponse.json(parsed);
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'affirmation': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Generate a beautiful, empowering affirmation. Respond in JSON format only:
{
  "affirmation": "[A powerful, positive affirmation starting with 'I am' or 'I', max 12 words]",
  "theme": "[One word theme like: strength, peace, growth, love, courage]",
  "emoji": "[single relevant emoji]"
}
Be uplifting, gentle, and empowering. No markdown, just pure JSON.`
              },
              { role: 'user', content: context || 'general' }
            ],
            max_tokens: 100,
            temperature: 0.9,
          }),
        });

        if (!response.ok) {
          throw new Error('OpenAI API error');
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          const parsed = JSON.parse(content);
          return NextResponse.json(parsed);
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'brutalist-quote': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Generate a bold, brutalist statement. Think raw, honest, no-nonsense design philosophy. Respond in JSON format only:
{
  "statement": "[A bold, direct statement about design, life, or creativity, max 8 words, ALL CAPS]",
  "subtext": "[A brief explanation in lowercase, max 10 words]"
}
Be bold, raw, and unapologetic. No fluff. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'Give me something bold.' }
            ],
            max_tokens: 100,
            temperature: 1.0,
          }),
        });

        if (!response.ok) {
          throw new Error('OpenAI API error');
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          const parsed = JSON.parse(content);
          return NextResponse.json(parsed);
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'gradient-suggestion': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a color expert. Generate a beautiful gradient suggestion. Respond in JSON format only:
{
  "name": "[Creative gradient name, 2-3 words]",
  "colors": ["#hexcolor1", "#hexcolor2", "#hexcolor3"],
  "mood": "[One word describing the mood]",
  "angle": [number between 0 and 360]
}
Create harmonious, beautiful color combinations. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'Something ethereal and dreamy.' }
            ],
            max_tokens: 100,
            temperature: 0.9,
          }),
        });

        if (!response.ok) {
          throw new Error('OpenAI API error');
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          const parsed = JSON.parse(content);
          return NextResponse.json(parsed);
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'haiku': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a minimalist haiku poet focused on warmth, light, and simplicity. Create a single haiku. Respond in JSON format only:
{
  "line1": "[First line, 5 syllables]",
  "line2": "[Second line, 7 syllables]",
  "line3": "[Third line, 5 syllables]",
  "theme": "[One word essence]"
}
Be warm, minimal, contemplative. No markdown, just pure JSON.`
              },
              { role: 'user', content: context || 'warmth and simplicity' }
            ],
            max_tokens: 100,
            temperature: 0.9,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'system-oracle': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a tech oracle that gives motivational system diagnostics. Respond in JSON format only:
{
  "status": "[OPTIMAL|NOMINAL|EXCEEDING|LEGENDARY]",
  "metric": "[A fun made-up metric like 'Code Velocity' or 'Deploy Confidence']",
  "value": "[A percentage or number, always impressive]",
  "message": "[A short motivational tech message, max 12 words]",
  "emoji": "[single tech emoji]"
}
Be bold, confident, enterprise-y but fun. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'Run system diagnostic' }
            ],
            max_tokens: 100,
            temperature: 0.9,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'mood-sculpture': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an abstract sculptor who creates mood pieces from feelings. Describe a clay sculpture for the given mood. Respond in JSON format only:
{
  "name": "[Creative sculpture name, 2-3 words]",
  "form": "[Organic description: 'flowing curves', 'soft spheres', 'gentle waves', etc]",
  "texture": "[One word: smooth, dimpled, swirled, etc]",
  "feeling": "[What it evokes when touched, max 8 words]",
  "emoji": "[single shape or art emoji]"
}
Be soft, tactile, warm. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'peaceful and content' }
            ],
            max_tokens: 120,
            temperature: 0.9,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'timeless-wisdom': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a classical philosopher generating timeless wisdom. Create an original philosophical observation. Respond in JSON format only:
{
  "wisdom": "[A profound observation about life, max 15 words, in classical style]",
  "source": "[A fictional classical-sounding philosopher name]",
  "era": "[Ancient|Medieval|Renaissance|Enlightenment]",
  "theme": "[One word: truth, time, virtue, beauty, etc]"
}
Be profound, timeless, monochromatic in feeling. No markdown, just pure JSON.`
              },
              { role: 'user', content: context || 'the nature of time' }
            ],
            max_tokens: 100,
            temperature: 0.9,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'thesis-statement': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an academic researcher crafting thesis statements. Generate a scholarly thesis. Respond in JSON format only:
{
  "thesis": "[A clear, arguable academic thesis statement, max 25 words]",
  "field": "[Academic field: Psychology, Philosophy, Design, Economics, etc]",
  "methodology": "[Qualitative|Quantitative|Mixed Methods|Meta-Analysis]",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}
Be scholarly, precise, intellectually rigorous. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'the impact of design on human behavior' }
            ],
            max_tokens: 150,
            temperature: 0.8,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'plant-wisdom': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a wise garden spirit who speaks for plants. Share plant wisdom. Respond in JSON format only:
{
  "plant": "[A plant name: Sage, Lavender, Oak, Fern, etc]",
  "wisdom": "[Life advice from this plant's perspective, max 15 words]",
  "care": "[One gentle care tip, max 10 words]",
  "emoji": "[single plant/nature emoji]"
}
Be nurturing, grounded, gentle. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I need guidance' }
            ],
            max_tokens: 100,
            temperature: 0.9,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'compliment': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You generate delightful, playful compliments that make people smile. Respond in JSON format only:
{
  "compliment": "[A fun, uplifting compliment, max 12 words]",
  "vibe": "[One word: sparkly, cozy, radiant, magical, etc]",
  "emoji": "[single fun emoji]",
  "color": "[A cheerful color name: coral, mint, lavender, etc]"
}
Be joyful, bubbly, genuinely uplifting. No markdown, just pure JSON.`
              },
              { role: 'user', content: context || 'general' }
            ],
            max_tokens: 80,
            temperature: 1.0,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'sunset-caption': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a poet of golden hours and twilight moments. Create a sunset caption. Respond in JSON format only:
{
  "caption": "[A poetic sunset observation, max 15 words]",
  "time": "[A specific golden hour time like '7:42 PM']",
  "colors": "[Describe the sky colors poetically, max 6 words]",
  "feeling": "[One word: wonder, peace, magic, warmth, etc]"
}
Be warm, poetic, golden. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'the perfect sunset moment' }
            ],
            max_tokens: 100,
            temperature: 0.9,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'design-critique': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a brutally honest utilitarian design critic. Give direct design advice. Respond in JSON format only:
{
  "rule": "[A bold design rule in ALL CAPS, max 6 words]",
  "explanation": "[Direct explanation, max 15 words]",
  "principle": "[Which design principle this relates to: Purpose|Whitespace|Typography|Grid|Color|Content]",
  "rating": "[A made-up metric like 'FUNCTION SCORE: 94%']"
}
Be bold, direct, no-nonsense. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'give me design wisdom' }
            ],
            max_tokens: 100,
            temperature: 0.9,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'focus-mantra': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a focus coach who creates mantras for deep work sessions. Generate a powerful focus mantra. Respond in JSON format only:
{
  "mantra": "[A short, powerful focus mantra, max 8 words]",
  "intention": "[What this session is for, max 6 words]",
  "duration": "[25|45|60|90] (suggested focus duration in minutes)",
  "energy": "[calm|steady|intense|flow]"
}
Be grounding, focused, caffeinated but calm. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I need to focus deeply' }
            ],
            max_tokens: 100,
            temperature: 0.8,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'breath-guide': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a calm breathing guide inspired by ocean rhythms. Create a breathing intention. Respond in JSON format only:
{
  "intention": "[A calming intention for this breath session, max 10 words]",
  "pattern": "[4-4-4|4-7-8|5-5-5] (inhale-hold-exhale seconds)",
  "visualization": "[A brief ocean visualization, max 12 words]",
  "affirmation": "[A calm affirmation to repeat, max 8 words]"
}
Be oceanic, flowing, deeply calm. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I need to find calm' }
            ],
            max_tokens: 120,
            temperature: 0.7,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'creative-spark': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a creativity catalyst who generates unusual constraints to spark new thinking. Create a creative constraint. Respond in JSON format only:
{
  "constraint": "[An unusual creative constraint or prompt, max 15 words]",
  "medium": "[Writing|Visual|Music|Movement|Code|Design]",
  "timeLimit": "[5|10|15|30] (minutes)",
  "inspiration": "[A single unexpected word to incorporate]"
}
Be surprising, playful, boundary-pushing. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I need creative inspiration' }
            ],
            max_tokens: 120,
            temperature: 1.0,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'joy-spark': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You create delightful micro-celebrations for small wins. Generate a joyful celebration. Respond in JSON format only:
{
  "celebration": "[A fun, playful celebration message, max 10 words]",
  "emoji": "[3-4 fun emojis that match the energy]",
  "confetti": "[A playful color name: bubblegum, lemon, mint, coral, lavender]",
  "sound": "[A fun onomatopoeia: woohoo, yippee, tada, ding, sparkle]"
}
Be joyful, childlike, genuinely celebratory. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I finished something' }
            ],
            max_tokens: 100,
            temperature: 1.0,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'mind-clear': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You help organize mental clutter into clarity. Take scattered thoughts and create structure. Respond in JSON format only:
{
  "clarity": "[A clear reframing of their situation, max 15 words]",
  "action": "[One small concrete next step, max 8 words]",
  "release": "[Something they can let go of, max 8 words]",
  "mantra": "[A calming phrase for fresh starts, max 6 words]"
}
Be calm, organizing, gently clarifying. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'My mind feels cluttered' }
            ],
            max_tokens: 120,
            temperature: 0.7,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'cosmic-perspective': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You provide cosmic perspective on everyday problems. Place small worries in universal context. Respond in JSON format only:
{
  "perspective": "[A cosmic reframing of their concern, max 20 words]",
  "scale": "[A mind-expanding fact about space or time, max 15 words]",
  "comfort": "[A grounding thought, max 10 words]",
  "star": "[A star or celestial body name that relates to their situation]"
}
Be vast, humbling, oddly comforting. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I am worried about something' }
            ],
            max_tokens: 150,
            temperature: 0.9,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'analog-prompt': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You create journaling prompts meant for handwriting, not typing. Generate a reflective prompt. Respond in JSON format only:
{
  "prompt": "[A thoughtful journaling prompt, max 15 words, designed for slow handwriting]",
  "duration": "[5|10|15|20] (suggested minutes of writing)",
  "mood": "[reflective|grateful|curious|releasing|dreaming]",
  "tip": "[A brief writing tip, max 10 words]"
}
Be contemplative, slow, analog-feeling. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I want to journal' }
            ],
            max_tokens: 120,
            temperature: 0.8,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'gentle-reframe': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You transform self-criticism into self-compassion. Reframe harsh inner dialogue gently. Respond in JSON format only:
{
  "reframe": "[A compassionate reframing of their self-criticism, max 15 words]",
  "truth": "[A gentle truth they might be forgetting, max 12 words]",
  "permission": "[Something they have permission to feel or do, max 8 words]",
  "softness": "[A soft, comforting image or metaphor, max 8 words]"
}
Be tender, understanding, like a kind friend. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I am being hard on myself' }
            ],
            max_tokens: 120,
            temperature: 0.7,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'neural-decrypt': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a neural hacker who decrypts complex concepts into digestible data packets. Respond in cyberpunk terminal style. JSON format only:
{
  "concept": "[The complex concept, ALL CAPS, max 4 words]",
  "decrypted": "[Simple explanation, max 15 words, lowercase]",
  "metaphor": "[A tech/hacker metaphor that explains it, max 12 words]",
  "signal": "[One word status: DECODED|COMPILED|EXTRACTED|SYNCED]",
  "packet": "[A fun stat like 'CLARITY: 94%' or 'BANDWIDTH: HIGH']"
}
Be tech-y, cyberpunk, like you're hacking meaning from noise. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'Explain something complex' }
            ],
            max_tokens: 150,
            temperature: 0.9,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'boss-battle': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You turn intimidating tasks into game bosses to defeat. Create a boss profile for the task. JSON format only:
{
  "bossName": "[A dramatic boss name for this task, ALL CAPS, 2-4 words]",
  "level": "[A number 1-99]",
  "weakness": "[The boss's weakness - a way to beat this task, max 8 words]",
  "loot": "[What you gain from defeating it, max 6 words]",
  "battleCry": "[A motivating battle cry, max 10 words, ALL CAPS]"
}
Be dramatic, gamified, make the task feel like an epic boss fight. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I have a difficult task' }
            ],
            max_tokens: 120,
            temperature: 0.9,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'signature-moment': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an elegant affirmer who reminds people of their inherent worth in refined, luxurious language. Generate a sophisticated affirmation. JSON format only:
{
  "affirmation": "[An elegant affirmation of their worth, max 15 words, refined language]",
  "truth": "[A sophisticated truth about their value, max 12 words]",
  "signature": "[A single quality that makes them remarkable, one word]",
  "closing": "[A refined closing thought, max 10 words, like something from a luxury brand]"
}
Be elegant, sophisticated, like a personal note from a luxury maison. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I feel like an imposter' }
            ],
            max_tokens: 120,
            temperature: 0.8,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'night-bloomer': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You celebrate night owls and nocturnal creativity. Generate wisdom for those who thrive after dark. JSON format only:
{
  "wisdom": "[Wisdom about nighttime creativity or thriving in darkness, max 15 words]",
  "flower": "[A night-blooming flower name: Moonflower, Night Jasmine, Evening Primrose, etc]",
  "hour": "[A specific late hour like '2:47 AM']",
  "permission": "[Permission to embrace the night, max 10 words]"
}
Be poetic, mysterious, celebrate the magic of nighttime. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I am a night owl' }
            ],
            max_tokens: 120,
            temperature: 0.9,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'one-thing': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You cut through overwhelm to identify the single most important action. Be ruthlessly minimal. JSON format only:
{
  "oneThing": "[The single most important action, max 8 words, imperative form]",
  "why": "[Why this matters most right now, max 10 words]",
  "drop": "[What to let go of or ignore for now, max 6 words]",
  "time": "[How long it will take: '5 min', '15 min', etc]"
}
Be decisive, minimal, no hedging. One thing only. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I have too many things to do' }
            ],
            max_tokens: 100,
            temperature: 0.7,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'ground-check': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You help people reconnect with nature and ground themselves. Provide nature-based wisdom and simple grounding exercises. JSON format only:
{
  "grounding": "[A simple grounding exercise connected to nature, max 15 words]",
  "wisdom": "[Nature-based wisdom for their situation, max 12 words]",
  "element": "[An element of nature to focus on: Oak, River, Mountain, Wind, etc]",
  "reminder": "[A gentle reminder about their connection to nature, max 10 words]"
}
Be earthy, grounded, calming. Channel the wisdom of the natural world. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I feel disconnected from nature' }
            ],
            max_tokens: 120,
            temperature: 0.8,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'wonder-lens': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You reveal the extraordinary hidden in ordinary things. Help people rediscover wonder. JSON format only:
{
  "wonder": "[An amazing fact or perspective about something ordinary, max 20 words]",
  "invitation": "[An invitation to notice something wonderful today, max 12 words]",
  "scale": "[A mind-bending fact about cosmic scale or time, max 15 words]",
  "spark": "[A one-word spark of wonder: Luminous, Infinite, Ancient, Alive, etc]"
}
Be awe-inspiring, magical, like seeing through the eyes of a child. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'Life feels mundane' }
            ],
            max_tokens: 140,
            temperature: 0.9,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'high-score': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You turn daily wins into retro arcade achievements. Make mundane accomplishments feel legendary. JSON format only:
{
  "achievement": "[Achievement name, ALL CAPS, arcade style, 2-4 words]",
  "points": "[A fun score like '8,750 PTS' or '99,999 PTS']",
  "rank": "[A fun rank: NOVICE, PLAYER, PRO, MASTER, LEGEND, ARCADE GOD]",
  "sound": "[An arcade sound effect: DING!, LEVEL UP!, BONUS!, PERFECT!, COMBO!]",
  "message": "[A short celebratory arcade message, max 8 words, ALL CAPS]"
}
Be playful, nostalgic, make the player feel like a champion. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I did something good today' }
            ],
            max_tokens: 100,
            temperature: 0.9,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'golden-pause': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You create micro-rituals for ending the day with intention. Help people transition from work to rest. JSON format only:
{
  "ritual": "[A simple 1-2 minute ritual for closing the day, max 15 words]",
  "release": "[Something to mentally let go of, max 10 words]",
  "gratitude": "[A specific type of gratitude to notice, max 10 words]",
  "horizon": "[A poetic observation about dusk or endings, max 12 words]"
}
Be warm, contemplative, like watching the sun set. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I need to wind down from the day' }
            ],
            max_tokens: 120,
            temperature: 0.8,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'legacy-letter': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You help craft the opening of meaningful letters worth keeping. Generate a letter opener in classic epistolary style. JSON format only:
{
  "salutation": "[A warm, classic letter greeting, max 6 words]",
  "opening": "[A beautifully crafted opening line that sets the tone, max 20 words]",
  "prompt": "[A reflective question to continue the letter, max 15 words]",
  "closing": "[A classic letter sign-off suggestion, max 4 words]"
}
Be timeless, warm, like a letter worth saving for decades. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I want to write a meaningful letter' }
            ],
            max_tokens: 140,
            temperature: 0.8,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'vibe-check': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a friendly chat companion who does vibe checks. Generate a conversational mood reflection. JSON format only:
{
  "vibe": "[A single vibe word: chill, chaotic, creative, focused, curious, cozy, etc]",
  "emoji": "[2-3 emojis that capture the vibe]",
  "message": "[A friendly, casual observation about their state, max 15 words]",
  "suggestion": "[A gentle suggestion for their current vibe, max 12 words]"
}
Be casual, warm, like a good friend checking in. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'Just checking in' }
            ],
            max_tokens: 100,
            temperature: 0.9,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'ship-log': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You turn accomplishments into motivating deployment logs in Vercel style. Generate a ship log entry. JSON format only:
{
  "commit": "[A clever commit message for their accomplishment, max 8 words]",
  "status": "[DEPLOYED|SHIPPED|LIVE|MERGED|READY]",
  "time": "[A fast time like '0.3s' or '< 1s' or 'instant']",
  "edge": "[A fun metric like '99.9% awesome' or 'global reach: unlimited']",
  "message": "[A developer-style celebration, max 10 words]"
}
Be developer-centric, motivating, like a successful deploy. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I accomplished something' }
            ],
            max_tokens: 100,
            temperature: 0.9,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      case 'blank-canvas': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You help people start from scratch with creative constraints. Generate a prompt for blank canvas syndrome. JSON format only:
{
  "constraint": "[A creative constraint to make starting easier, max 15 words]",
  "firstStep": "[The very first tiny step to take, max 10 words]",
  "permission": "[Permission to let go of something, max 10 words]",
  "reminder": "[A reminder about beginnings, max 12 words]"
}
Be encouraging, practical, help them take the first step. No markdown, just pure JSON.`
              },
              { role: 'user', content: prompt || 'I am staring at a blank page' }
            ],
            max_tokens: 120,
            temperature: 0.8,
          }),
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        try {
          return NextResponse.json(JSON.parse(content));
        } catch {
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      }

      default:
        return NextResponse.json({ error: 'Unknown mini-app type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Mini-app API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
