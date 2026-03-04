module.exports=[463873,e=>{"use strict";var t=e.i(457375),o=e.i(174015),r=e.i(116384),n=e.i(63831),a=e.i(868001),s=e.i(842780),i=e.i(763077),c=e.i(502964),m=e.i(993216),l=e.i(783900),p=e.i(295731),d=e.i(726839),u=e.i(775778),h=e.i(40992),g=e.i(432128),f=e.i(193695);e.i(44807);var w=e.i(989978),y=e.i(39334);async function N(e){try{let{type:t,prompt:o,context:r}=await e.json(),n=process.env.OPENAI_API_KEY;if(!n)return y.NextResponse.json({error:"OpenAI API key not configured"},{status:500});switch(t){case"tarot-reading":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are a mystical tarot reader. Generate a single tarot card reading. Respond in JSON format only:
{
  "card": "The [Card Name]",
  "symbol": "[single emoji that represents the card]",
  "meaning": "[2-3 word theme]",
  "guidance": "[One poetic sentence of guidance, max 15 words]"
}
Be mystical, poetic, and positive. No markdown, just pure JSON.`},{role:"user",content:o||"Draw a card for me."}],max_tokens:150,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{let e=JSON.parse(r);return y.NextResponse.json(e)}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"coffee-mood":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are a warm, friendly coffee expert. Based on the user's mood or request, suggest a perfect coffee. Respond in JSON format only:
{
  "drink": "[Coffee drink name]",
  "description": "[One cozy sentence about why this fits their mood, max 12 words]",
  "tip": "[One short brewing tip, max 10 words]",
  "emoji": "[single coffee-related emoji]"
}
Be warm, inviting, and cozy. No markdown, just pure JSON.`},{role:"user",content:o||"I need something comforting."}],max_tokens:150,temperature:.8})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{let e=JSON.parse(r);return y.NextResponse.json(e)}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"plant-spirit":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are a wise forest spirit (Kodama). Generate a nature-inspired message. Respond in JSON format only:
{
  "message": "[A gentle, wise observation about nature or growth, max 15 words]",
  "emoji": "[single nature emoji: 🌱🌿🍃🌳🌲🌻🌸🍀]",
  "wisdom": "[One word that captures the essence]"
}
Be gentle, wise, and connected to nature. No markdown, just pure JSON.`},{role:"user",content:o||"Share your wisdom."}],max_tokens:100,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{let e=JSON.parse(r);return y.NextResponse.json(e)}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"affirmation":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`Generate a beautiful, empowering affirmation. Respond in JSON format only:
{
  "affirmation": "[A powerful, positive affirmation starting with 'I am' or 'I', max 12 words]",
  "theme": "[One word theme like: strength, peace, growth, love, courage]",
  "emoji": "[single relevant emoji]"
}
Be uplifting, gentle, and empowering. No markdown, just pure JSON.`},{role:"user",content:r||"general"}],max_tokens:100,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),o=t.choices[0]?.message?.content||"{}";try{let e=JSON.parse(o);return y.NextResponse.json(e)}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"brutalist-quote":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`Generate a bold, brutalist statement. Think raw, honest, no-nonsense design philosophy. Respond in JSON format only:
{
  "statement": "[A bold, direct statement about design, life, or creativity, max 8 words, ALL CAPS]",
  "subtext": "[A brief explanation in lowercase, max 10 words]"
}
Be bold, raw, and unapologetic. No fluff. No markdown, just pure JSON.`},{role:"user",content:o||"Give me something bold."}],max_tokens:100,temperature:1})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{let e=JSON.parse(r);return y.NextResponse.json(e)}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"gradient-suggestion":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are a color expert. Generate a beautiful gradient suggestion. Respond in JSON format only:
{
  "name": "[Creative gradient name, 2-3 words]",
  "colors": ["#hexcolor1", "#hexcolor2", "#hexcolor3"],
  "mood": "[One word describing the mood]",
  "angle": [number between 0 and 360]
}
Create harmonious, beautiful color combinations. No markdown, just pure JSON.`},{role:"user",content:o||"Something ethereal and dreamy."}],max_tokens:100,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{let e=JSON.parse(r);return y.NextResponse.json(e)}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"haiku":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are a minimalist haiku poet focused on warmth, light, and simplicity. Create a single haiku. Respond in JSON format only:
{
  "line1": "[First line, 5 syllables]",
  "line2": "[Second line, 7 syllables]",
  "line3": "[Third line, 5 syllables]",
  "theme": "[One word essence]"
}
Be warm, minimal, contemplative. No markdown, just pure JSON.`},{role:"user",content:r||"warmth and simplicity"}],max_tokens:100,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),o=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(o))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"system-oracle":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are a tech oracle that gives motivational system diagnostics. Respond in JSON format only:
{
  "status": "[OPTIMAL|NOMINAL|EXCEEDING|LEGENDARY]",
  "metric": "[A fun made-up metric like 'Code Velocity' or 'Deploy Confidence']",
  "value": "[A percentage or number, always impressive]",
  "message": "[A short motivational tech message, max 12 words]",
  "emoji": "[single tech emoji]"
}
Be bold, confident, enterprise-y but fun. No markdown, just pure JSON.`},{role:"user",content:o||"Run system diagnostic"}],max_tokens:100,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"mood-sculpture":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are an abstract sculptor who creates mood pieces from feelings. Describe a clay sculpture for the given mood. Respond in JSON format only:
{
  "name": "[Creative sculpture name, 2-3 words]",
  "form": "[Organic description: 'flowing curves', 'soft spheres', 'gentle waves', etc]",
  "texture": "[One word: smooth, dimpled, swirled, etc]",
  "feeling": "[What it evokes when touched, max 8 words]",
  "emoji": "[single shape or art emoji]"
}
Be soft, tactile, warm. No markdown, just pure JSON.`},{role:"user",content:o||"peaceful and content"}],max_tokens:120,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"timeless-wisdom":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are a classical philosopher generating timeless wisdom. Create an original philosophical observation. Respond in JSON format only:
{
  "wisdom": "[A profound observation about life, max 15 words, in classical style]",
  "source": "[A fictional classical-sounding philosopher name]",
  "era": "[Ancient|Medieval|Renaissance|Enlightenment]",
  "theme": "[One word: truth, time, virtue, beauty, etc]"
}
Be profound, timeless, monochromatic in feeling. No markdown, just pure JSON.`},{role:"user",content:r||"the nature of time"}],max_tokens:100,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),o=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(o))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"thesis-statement":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are an academic researcher crafting thesis statements. Generate a scholarly thesis. Respond in JSON format only:
{
  "thesis": "[A clear, arguable academic thesis statement, max 25 words]",
  "field": "[Academic field: Psychology, Philosophy, Design, Economics, etc]",
  "methodology": "[Qualitative|Quantitative|Mixed Methods|Meta-Analysis]",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}
Be scholarly, precise, intellectually rigorous. No markdown, just pure JSON.`},{role:"user",content:o||"the impact of design on human behavior"}],max_tokens:150,temperature:.8})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"plant-wisdom":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are a wise garden spirit who speaks for plants. Share plant wisdom. Respond in JSON format only:
{
  "plant": "[A plant name: Sage, Lavender, Oak, Fern, etc]",
  "wisdom": "[Life advice from this plant's perspective, max 15 words]",
  "care": "[One gentle care tip, max 10 words]",
  "emoji": "[single plant/nature emoji]"
}
Be nurturing, grounded, gentle. No markdown, just pure JSON.`},{role:"user",content:o||"I need guidance"}],max_tokens:100,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"compliment":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You generate delightful, playful compliments that make people smile. Respond in JSON format only:
{
  "compliment": "[A fun, uplifting compliment, max 12 words]",
  "vibe": "[One word: sparkly, cozy, radiant, magical, etc]",
  "emoji": "[single fun emoji]",
  "color": "[A cheerful color name: coral, mint, lavender, etc]"
}
Be joyful, bubbly, genuinely uplifting. No markdown, just pure JSON.`},{role:"user",content:r||"general"}],max_tokens:80,temperature:1})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),o=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(o))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"sunset-caption":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are a poet of golden hours and twilight moments. Create a sunset caption. Respond in JSON format only:
{
  "caption": "[A poetic sunset observation, max 15 words]",
  "time": "[A specific golden hour time like '7:42 PM']",
  "colors": "[Describe the sky colors poetically, max 6 words]",
  "feeling": "[One word: wonder, peace, magic, warmth, etc]"
}
Be warm, poetic, golden. No markdown, just pure JSON.`},{role:"user",content:o||"the perfect sunset moment"}],max_tokens:100,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"design-critique":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are a brutally honest utilitarian design critic. Give direct design advice. Respond in JSON format only:
{
  "rule": "[A bold design rule in ALL CAPS, max 6 words]",
  "explanation": "[Direct explanation, max 15 words]",
  "principle": "[Which design principle this relates to: Purpose|Whitespace|Typography|Grid|Color|Content]",
  "rating": "[A made-up metric like 'FUNCTION SCORE: 94%']"
}
Be bold, direct, no-nonsense. No markdown, just pure JSON.`},{role:"user",content:o||"give me design wisdom"}],max_tokens:100,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"focus-mantra":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are a focus coach who creates mantras for deep work sessions. Generate a powerful focus mantra. Respond in JSON format only:
{
  "mantra": "[A short, powerful focus mantra, max 8 words]",
  "intention": "[What this session is for, max 6 words]",
  "duration": "[25|45|60|90] (suggested focus duration in minutes)",
  "energy": "[calm|steady|intense|flow]"
}
Be grounding, focused, caffeinated but calm. No markdown, just pure JSON.`},{role:"user",content:o||"I need to focus deeply"}],max_tokens:100,temperature:.8})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"breath-guide":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are a calm breathing guide inspired by ocean rhythms. Create a breathing intention. Respond in JSON format only:
{
  "intention": "[A calming intention for this breath session, max 10 words]",
  "pattern": "[4-4-4|4-7-8|5-5-5] (inhale-hold-exhale seconds)",
  "visualization": "[A brief ocean visualization, max 12 words]",
  "affirmation": "[A calm affirmation to repeat, max 8 words]"
}
Be oceanic, flowing, deeply calm. No markdown, just pure JSON.`},{role:"user",content:o||"I need to find calm"}],max_tokens:120,temperature:.7})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"creative-spark":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are a creativity catalyst who generates unusual constraints to spark new thinking. Create a creative constraint. Respond in JSON format only:
{
  "constraint": "[An unusual creative constraint or prompt, max 15 words]",
  "medium": "[Writing|Visual|Music|Movement|Code|Design]",
  "timeLimit": "[5|10|15|30] (minutes)",
  "inspiration": "[A single unexpected word to incorporate]"
}
Be surprising, playful, boundary-pushing. No markdown, just pure JSON.`},{role:"user",content:o||"I need creative inspiration"}],max_tokens:120,temperature:1})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"joy-spark":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You create delightful micro-celebrations for small wins. Generate a joyful celebration. Respond in JSON format only:
{
  "celebration": "[A fun, playful celebration message, max 10 words]",
  "emoji": "[3-4 fun emojis that match the energy]",
  "confetti": "[A playful color name: bubblegum, lemon, mint, coral, lavender]",
  "sound": "[A fun onomatopoeia: woohoo, yippee, tada, ding, sparkle]"
}
Be joyful, childlike, genuinely celebratory. No markdown, just pure JSON.`},{role:"user",content:o||"I finished something"}],max_tokens:100,temperature:1})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"mind-clear":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You help organize mental clutter into clarity. Take scattered thoughts and create structure. Respond in JSON format only:
{
  "clarity": "[A clear reframing of their situation, max 15 words]",
  "action": "[One small concrete next step, max 8 words]",
  "release": "[Something they can let go of, max 8 words]",
  "mantra": "[A calming phrase for fresh starts, max 6 words]"
}
Be calm, organizing, gently clarifying. No markdown, just pure JSON.`},{role:"user",content:o||"My mind feels cluttered"}],max_tokens:120,temperature:.7})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"cosmic-perspective":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You provide cosmic perspective on everyday problems. Place small worries in universal context. Respond in JSON format only:
{
  "perspective": "[A cosmic reframing of their concern, max 20 words]",
  "scale": "[A mind-expanding fact about space or time, max 15 words]",
  "comfort": "[A grounding thought, max 10 words]",
  "star": "[A star or celestial body name that relates to their situation]"
}
Be vast, humbling, oddly comforting. No markdown, just pure JSON.`},{role:"user",content:o||"I am worried about something"}],max_tokens:150,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"analog-prompt":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You create journaling prompts meant for handwriting, not typing. Generate a reflective prompt. Respond in JSON format only:
{
  "prompt": "[A thoughtful journaling prompt, max 15 words, designed for slow handwriting]",
  "duration": "[5|10|15|20] (suggested minutes of writing)",
  "mood": "[reflective|grateful|curious|releasing|dreaming]",
  "tip": "[A brief writing tip, max 10 words]"
}
Be contemplative, slow, analog-feeling. No markdown, just pure JSON.`},{role:"user",content:o||"I want to journal"}],max_tokens:120,temperature:.8})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"gentle-reframe":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You transform self-criticism into self-compassion. Reframe harsh inner dialogue gently. Respond in JSON format only:
{
  "reframe": "[A compassionate reframing of their self-criticism, max 15 words]",
  "truth": "[A gentle truth they might be forgetting, max 12 words]",
  "permission": "[Something they have permission to feel or do, max 8 words]",
  "softness": "[A soft, comforting image or metaphor, max 8 words]"
}
Be tender, understanding, like a kind friend. No markdown, just pure JSON.`},{role:"user",content:o||"I am being hard on myself"}],max_tokens:120,temperature:.7})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"neural-decrypt":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are a neural hacker who decrypts complex concepts into digestible data packets. Respond in cyberpunk terminal style. JSON format only:
{
  "concept": "[The complex concept, ALL CAPS, max 4 words]",
  "decrypted": "[Simple explanation, max 15 words, lowercase]",
  "metaphor": "[A tech/hacker metaphor that explains it, max 12 words]",
  "signal": "[One word status: DECODED|COMPILED|EXTRACTED|SYNCED]",
  "packet": "[A fun stat like 'CLARITY: 94%' or 'BANDWIDTH: HIGH']"
}
Be tech-y, cyberpunk, like you're hacking meaning from noise. No markdown, just pure JSON.`},{role:"user",content:o||"Explain something complex"}],max_tokens:150,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"boss-battle":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You turn intimidating tasks into game bosses to defeat. Create a boss profile for the task. JSON format only:
{
  "bossName": "[A dramatic boss name for this task, ALL CAPS, 2-4 words]",
  "level": "[A number 1-99]",
  "weakness": "[The boss's weakness - a way to beat this task, max 8 words]",
  "loot": "[What you gain from defeating it, max 6 words]",
  "battleCry": "[A motivating battle cry, max 10 words, ALL CAPS]"
}
Be dramatic, gamified, make the task feel like an epic boss fight. No markdown, just pure JSON.`},{role:"user",content:o||"I have a difficult task"}],max_tokens:120,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"signature-moment":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are an elegant affirmer who reminds people of their inherent worth in refined, luxurious language. Generate a sophisticated affirmation. JSON format only:
{
  "affirmation": "[An elegant affirmation of their worth, max 15 words, refined language]",
  "truth": "[A sophisticated truth about their value, max 12 words]",
  "signature": "[A single quality that makes them remarkable, one word]",
  "closing": "[A refined closing thought, max 10 words, like something from a luxury brand]"
}
Be elegant, sophisticated, like a personal note from a luxury maison. No markdown, just pure JSON.`},{role:"user",content:o||"I feel like an imposter"}],max_tokens:120,temperature:.8})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"night-bloomer":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You celebrate night owls and nocturnal creativity. Generate wisdom for those who thrive after dark. JSON format only:
{
  "wisdom": "[Wisdom about nighttime creativity or thriving in darkness, max 15 words]",
  "flower": "[A night-blooming flower name: Moonflower, Night Jasmine, Evening Primrose, etc]",
  "hour": "[A specific late hour like '2:47 AM']",
  "permission": "[Permission to embrace the night, max 10 words]"
}
Be poetic, mysterious, celebrate the magic of nighttime. No markdown, just pure JSON.`},{role:"user",content:o||"I am a night owl"}],max_tokens:120,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"one-thing":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You cut through overwhelm to identify the single most important action. Be ruthlessly minimal. JSON format only:
{
  "oneThing": "[The single most important action, max 8 words, imperative form]",
  "why": "[Why this matters most right now, max 10 words]",
  "drop": "[What to let go of or ignore for now, max 6 words]",
  "time": "[How long it will take: '5 min', '15 min', etc]"
}
Be decisive, minimal, no hedging. One thing only. No markdown, just pure JSON.`},{role:"user",content:o||"I have too many things to do"}],max_tokens:100,temperature:.7})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"ground-check":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You help people reconnect with nature and ground themselves. Provide nature-based wisdom and simple grounding exercises. JSON format only:
{
  "grounding": "[A simple grounding exercise connected to nature, max 15 words]",
  "wisdom": "[Nature-based wisdom for their situation, max 12 words]",
  "element": "[An element of nature to focus on: Oak, River, Mountain, Wind, etc]",
  "reminder": "[A gentle reminder about their connection to nature, max 10 words]"
}
Be earthy, grounded, calming. Channel the wisdom of the natural world. No markdown, just pure JSON.`},{role:"user",content:o||"I feel disconnected from nature"}],max_tokens:120,temperature:.8})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"wonder-lens":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You reveal the extraordinary hidden in ordinary things. Help people rediscover wonder. JSON format only:
{
  "wonder": "[An amazing fact or perspective about something ordinary, max 20 words]",
  "invitation": "[An invitation to notice something wonderful today, max 12 words]",
  "scale": "[A mind-bending fact about cosmic scale or time, max 15 words]",
  "spark": "[A one-word spark of wonder: Luminous, Infinite, Ancient, Alive, etc]"
}
Be awe-inspiring, magical, like seeing through the eyes of a child. No markdown, just pure JSON.`},{role:"user",content:o||"Life feels mundane"}],max_tokens:140,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"high-score":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You turn daily wins into retro arcade achievements. Make mundane accomplishments feel legendary. JSON format only:
{
  "achievement": "[Achievement name, ALL CAPS, arcade style, 2-4 words]",
  "points": "[A fun score like '8,750 PTS' or '99,999 PTS']",
  "rank": "[A fun rank: NOVICE, PLAYER, PRO, MASTER, LEGEND, ARCADE GOD]",
  "sound": "[An arcade sound effect: DING!, LEVEL UP!, BONUS!, PERFECT!, COMBO!]",
  "message": "[A short celebratory arcade message, max 8 words, ALL CAPS]"
}
Be playful, nostalgic, make the player feel like a champion. No markdown, just pure JSON.`},{role:"user",content:o||"I did something good today"}],max_tokens:100,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"golden-pause":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You create micro-rituals for ending the day with intention. Help people transition from work to rest. JSON format only:
{
  "ritual": "[A simple 1-2 minute ritual for closing the day, max 15 words]",
  "release": "[Something to mentally let go of, max 10 words]",
  "gratitude": "[A specific type of gratitude to notice, max 10 words]",
  "horizon": "[A poetic observation about dusk or endings, max 12 words]"
}
Be warm, contemplative, like watching the sun set. No markdown, just pure JSON.`},{role:"user",content:o||"I need to wind down from the day"}],max_tokens:120,temperature:.8})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"legacy-letter":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You help craft the opening of meaningful letters worth keeping. Generate a letter opener in classic epistolary style. JSON format only:
{
  "salutation": "[A warm, classic letter greeting, max 6 words]",
  "opening": "[A beautifully crafted opening line that sets the tone, max 20 words]",
  "prompt": "[A reflective question to continue the letter, max 15 words]",
  "closing": "[A classic letter sign-off suggestion, max 4 words]"
}
Be timeless, warm, like a letter worth saving for decades. No markdown, just pure JSON.`},{role:"user",content:o||"I want to write a meaningful letter"}],max_tokens:140,temperature:.8})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"vibe-check":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You are a friendly chat companion who does vibe checks. Generate a conversational mood reflection. JSON format only:
{
  "vibe": "[A single vibe word: chill, chaotic, creative, focused, curious, cozy, etc]",
  "emoji": "[2-3 emojis that capture the vibe]",
  "message": "[A friendly, casual observation about their state, max 15 words]",
  "suggestion": "[A gentle suggestion for their current vibe, max 12 words]"
}
Be casual, warm, like a good friend checking in. No markdown, just pure JSON.`},{role:"user",content:o||"Just checking in"}],max_tokens:100,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"ship-log":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You turn accomplishments into motivating deployment logs in Vercel style. Generate a ship log entry. JSON format only:
{
  "commit": "[A clever commit message for their accomplishment, max 8 words]",
  "status": "[DEPLOYED|SHIPPED|LIVE|MERGED|READY]",
  "time": "[A fast time like '0.3s' or '< 1s' or 'instant']",
  "edge": "[A fun metric like '99.9% awesome' or 'global reach: unlimited']",
  "message": "[A developer-style celebration, max 10 words]"
}
Be developer-centric, motivating, like a successful deploy. No markdown, just pure JSON.`},{role:"user",content:o||"I accomplished something"}],max_tokens:100,temperature:.9})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}case"blank-canvas":{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:`You help people start from scratch with creative constraints. Generate a prompt for blank canvas syndrome. JSON format only:
{
  "constraint": "[A creative constraint to make starting easier, max 15 words]",
  "firstStep": "[The very first tiny step to take, max 10 words]",
  "permission": "[Permission to let go of something, max 10 words]",
  "reminder": "[A reminder about beginnings, max 12 words]"
}
Be encouraging, practical, help them take the first step. No markdown, just pure JSON.`},{role:"user",content:o||"I am staring at a blank page"}],max_tokens:120,temperature:.8})});if(!e.ok)throw Error("OpenAI API error");let t=await e.json(),r=t.choices[0]?.message?.content||"{}";try{return y.NextResponse.json(JSON.parse(r))}catch{return y.NextResponse.json({error:"Invalid response format"},{status:500})}}default:return y.NextResponse.json({error:"Unknown mini-app type"},{status:400})}}catch(e){return console.error("Mini-app API error:",e),y.NextResponse.json({error:"Internal server error"},{status:500})}}e.s(["POST",()=>N],276430);var O=e.i(276430);let A=new t.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/mini-apps/route",pathname:"/api/mini-apps",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/mini-apps/route.ts",nextConfigOutput:"",userland:O}),{workAsyncStorage:x,workUnitAsyncStorage:S,serverHooks:v}=A;function j(){return(0,r.patchFetch)({workAsyncStorage:x,workUnitAsyncStorage:S})}async function k(e,t,r){A.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/mini-apps/route";y=y.replace(/\/index$/,"")||"/";let N=await A.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!N)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:O,params:x,nextConfig:S,parsedUrl:v,isDraftMode:j,prerenderManifest:k,routerServerContext:b,isOnDemandRevalidate:R,revalidateOnlyGenerated:I,resolvedPathname:J,clientReferenceManifest:P,serverActionsManifest:T}=N,E=(0,i.normalizeAppPath)(y),C=!!(k.dynamicRoutes[E]||k.routes[J]),B=async()=>((null==b?void 0:b.render404)?await b.render404(e,t,v,!1):t.end("This page could not be found"),null);if(C&&!j){let e=!!k.routes[J],t=k.dynamicRoutes[E];if(t&&!1===t.fallback&&!e){if(S.experimental.adapterPath)return await B();throw new f.NoFallbackError}}let _=null;!C||A.isDev||j||(_="/index"===(_=J)?"/":_);let z=!0===A.isDev||!C,$=C&&!z;T&&P&&(0,s.setManifestsSingleton)({page:y,clientReferenceManifest:P,serverActionsManifest:T});let Y=e.method||"GET",D=(0,a.getTracer)(),L=D.getActiveScopeSpan(),M={params:x,prerenderManifest:k,renderOpts:{experimental:{authInterrupts:!!S.experimental.authInterrupts},cacheComponents:!!S.cacheComponents,supportsDynamicResponse:z,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:S.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,o,r,n)=>A.onRequestError(e,t,r,n,b)},sharedContext:{buildId:O}},G=new c.NodeNextRequest(e),H=new c.NodeNextResponse(t),U=m.NextRequestAdapter.fromNodeNextRequest(G,(0,m.signalFromNodeResponse)(t));try{let s=async e=>A.handle(U,M).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let o=D.getRootSpanAttributes();if(!o)return;if(o.get("next.span_type")!==l.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${o.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=o.get("next.route");if(r){let t=`${Y} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${Y} ${y}`)}),i=!!(0,n.getRequestMeta)(e,"minimalMode"),c=async n=>{var a,c;let m=async({previousCacheEntry:o})=>{try{if(!i&&R&&I&&!o)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await s(n);e.fetchMetrics=M.renderOpts.fetchMetrics;let c=M.renderOpts.pendingWaitUntil;c&&r.waitUntil&&(r.waitUntil(c),c=void 0);let m=M.renderOpts.collectedTags;if(!C)return await (0,d.sendResponse)(G,H,a,M.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,u.toNodeOutgoingHttpHeaders)(a.headers);m&&(t[g.NEXT_CACHE_TAGS_HEADER]=m),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let o=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,r=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:w.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:o,expire:r}}}}catch(t){throw(null==o?void 0:o.isStale)&&await A.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:$,isOnDemandRevalidate:R})},!1,b),t}},l=await A.handleResponse({req:e,nextConfig:S,cacheKey:_,routeKind:o.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:k,isRoutePPREnabled:!1,isOnDemandRevalidate:R,revalidateOnlyGenerated:I,responseGenerator:m,waitUntil:r.waitUntil,isMinimalMode:i});if(!C)return null;if((null==l||null==(a=l.value)?void 0:a.kind)!==w.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(c=l.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",R?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),j&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let f=(0,u.fromNodeOutgoingHttpHeaders)(l.value.headers);return i&&C||f.delete(g.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||f.get("Cache-Control")||f.set("Cache-Control",(0,h.getCacheControlHeader)(l.cacheControl)),await (0,d.sendResponse)(G,H,new Response(l.value.body,{headers:f,status:l.value.status||200})),null};L?await c(L):await D.withPropagatedContext(e.headers,()=>D.trace(l.BaseServerSpan.handleRequest,{spanName:`${Y} ${y}`,kind:a.SpanKind.SERVER,attributes:{"http.method":Y,"http.target":e.url}},c))}catch(t){if(t instanceof f.NoFallbackError||await A.onRequestError(e,t,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:$,isOnDemandRevalidate:R})},!1,b),C)throw t;return await (0,d.sendResponse)(G,H,new Response(null,{status:500})),null}}e.s(["handler",()=>k,"patchFetch",()=>j,"routeModule",()=>A,"serverHooks",()=>v,"workAsyncStorage",()=>x,"workUnitAsyncStorage",()=>S],463873)}];

//# sourceMappingURL=5d253_next_dist_esm_build_templates_app-route_7ca2cace.js.map