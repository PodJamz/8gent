# 🎙️ AI James Voice Scripts for OpenClaw-OS Onboarding

## Voice Snippets to Generate

### 1. Welcome/Intro (arrival.mp3)
**Duration**: ~8 seconds  
**Tone**: Warm, friendly, welcoming  
**Script**:
```
Hey there! I'm AI James. James Spalding and I built this together, 
and now we're handing it off to you. Let's get you set up.
```

### 2. Name Question (name.mp3)
**Duration**: ~3 seconds  
**Tone**: Casual, friendly  
**Script**:
```
First things first - what should I call you?
```

### 3. Aesthetic Question (aesthetic.mp3)
**Duration**: ~6 seconds  
**Tone**: Professional, direct  
**Script**:
```
Choose your theme. You can upload your own image for the screensaver, 
or pick one of our presets.
```

### 4. Intent Question (intent.mp3)
**Duration**: ~5 seconds  
**Tone**: Curious, open  
**Script**:
```
What brings you here today? Just curious, looking to hire, 
want to collaborate, or seeking inspiration?
```

### 5. Personalization Intro (personalize.mp3)
**Duration**: ~6 seconds  
**Tone**: Encouraging, helpful  
**Script**:
```
Great choices! Let's personalize this a bit more. 
You can upload a few images - anything that inspires you.
```

### 6. Completion/Handoff (complete.mp3)
**Duration**: ~7 seconds  
**Tone**: Warm, supportive, slightly proud  
**Script**:
```
Perfect! Your OS is ready. Remember, I'm always here in the Agent app 
if you need me. Welcome home.
```

---

## Implementation Plan

### File Structure
```
public/
  audio/
    onboarding/
      arrival.mp3
      name.mp3
      aesthetic.mp3
      intent.mp3
      personalize.mp3
      complete.mp3
```

### Component Updates

#### 1. ArrivalScreen.tsx
- Auto-play `arrival.mp3` when screen loads
- Show subtle audio wave animation
- Sync text appearance with voice

#### 2. Add NameScreen.tsx (NEW)
- Play `name.mp3`
- Text input for user's name
- Store in onboarding state

#### 3. AestheticScreen.tsx
- Play `aesthetic.mp3` on load
- Existing theme selection UI

#### 4. IntentScreen.tsx
- Play `intent.mp3` on load
- Existing intent selection UI

#### 5. Add PersonalizationScreen.tsx (NEW)
- Play `personalize.mp3`
- Image upload interface (3-5 images)
- Store images for wallpapers/personalization

#### 6. EntryScreen.tsx
- Play `complete.mp3`
- Final animation before entering OS

---

## Updated Onboarding Flow

```
1. Arrival (with AI James intro voice)
2. Name Collection (NEW - with voice)
3. Thesis
4. Why
5. Aesthetic (with voice)
6. Capabilities
7. Intent (with voice)
8. Integrations
9. Personalization (NEW - with voice + image upload)
10. Voice Recording (existing)
11. Honesty
12. Entry (with completion voice)
```

---

## Voice Generation Options

### Option 1: ElevenLabs (Recommended)
- High quality, natural voice
- Can clone your voice for AI James
- API available for generation

### Option 2: OpenAI TTS
- Good quality
- Multiple voice options
- Easy API integration

### Option 3: Record Yourself
- Most authentic for "AI James"
- Can record all 6 snippets
- Process with audio editing

---

## Audio Player Component

Create a reusable component:

```typescript
// components/onboarding/VoicePlayer.tsx
export function VoicePlayer({ 
  src, 
  autoPlay = true,
  onComplete 
}: VoicePlayerProps) {
  // Auto-play audio
  // Show subtle wave animation
  // Call onComplete when done
}
```

---

## User Experience Flow

1. **Arrival**: User sees screen → AI James voice plays → Text appears in sync
2. **Name**: Voice asks question → Input appears → User types name
3. **Aesthetic**: Voice asks → Options appear → User selects
4. **Intent**: Voice asks → Options appear → User selects
5. **Personalization**: Voice explains → Upload UI appears → User adds images
6. **Completion**: Voice welcomes them → Transition to lock screen

---

## Personalization Feature (NEW)

### Image Upload
- 3-5 images from user
- Used for:
  - Lock screen wallpaper rotation
  - Desktop backgrounds
  - Photo app default gallery
  - Screensaver options

### Storage
```typescript
interface OnboardingData {
  name: string;
  aesthetic: AestheticChoice;
  intent: IntentChoice;
  personalImages: string[]; // base64 or URLs
  voiceGreeting: Blob | null;
  onboardingCompleted: boolean;
}
```

---

## Next Steps

1. **Generate Voice Files**
   - Use ElevenLabs or record yourself
   - Export as MP3 (128kbps is fine)
   - Place in `public/audio/onboarding/`

2. **Create NameScreen Component**
   - Simple text input
   - Voice playback
   - Store name in state

3. **Create PersonalizationScreen Component**
   - Image upload (drag & drop)
   - Preview grid
   - Store images in localStorage/IndexedDB

4. **Update Existing Screens**
   - Add VoicePlayer to Arrival, Aesthetic, Intent, Entry
   - Sync animations with voice timing

5. **Update OnboardingFlow**
   - Add new screens to flow
   - Update screen order
   - Handle new data fields

---

## Voice Characteristics for AI James

- **Tone**: Warm, friendly, slightly casual
- **Pace**: Natural, not rushed
- **Energy**: Enthusiastic but not over-the-top
- **Personality**: Helpful guide, like a friend showing you around
- **Accent**: Your natural accent (if recording yourself)

---

**Ready to generate the voice files and implement this!**

Would you like me to:
1. Create the voice scripts as separate text files for recording?
2. Set up the audio player component?
3. Create the new Name and Personalization screens?
4. All of the above?
