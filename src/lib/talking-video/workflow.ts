/**
 * Talking Video Workflow Orchestrator
 *
 * Full pipeline:
 * 1. Generate script (AI) -> 90 sec talking points
 * 2. Generate voice (ElevenLabs) -> Audio from cloned voice
 * 3. Generate background (Kling AI Pro) -> Photo in scene
 * 4. Lip sync (Veed Fast) -> Sync lips to audio
 */

import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import type {
  TalkingVideoProject,
  TalkingVideoRequest,
  TalkingVideoResult,
  ScriptRequest,
  GeneratedScript,
  SceneStyle,
  SCENE_PROMPTS,
} from './types';
import { generateVoice } from './elevenlabs';
import { generateBackgroundVideo, lipSyncVideo } from './fal-video';

// In-memory project store (would be Convex in production)
const projects = new Map<string, TalkingVideoProject>();

/**
 * Generate a script for a talking video
 */
export async function generateScript(request: ScriptRequest): Promise<GeneratedScript> {
  const targetDuration = request.duration || 90;
  const wordsNeeded = Math.ceil((targetDuration / 60) * 150); // ~150 words per minute

  const { text } = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    prompt: `You are a professional scriptwriter. Write a ${request.tone || 'professional'} ${request.style || 'monologue'} script about: "${request.topic}"

Requirements:
- Target length: approximately ${wordsNeeded} words (${targetDuration} seconds when spoken)
- Style: ${request.style || 'monologue'} - direct to camera, engaging
- Tone: ${request.tone || 'professional'}
- Write ONLY the spoken words, no stage directions or notes
- Use natural speech patterns with appropriate pauses (...)
- Start strong to hook the viewer
- End with a clear call-to-action or memorable conclusion

Write the script now:`,
    maxOutputTokens: 1000,
  });

  const wordCount = text.split(/\s+/).length;
  const estimatedDuration = Math.ceil((wordCount / 150) * 60);

  return {
    script: text.trim(),
    estimatedDuration,
    wordCount,
  };
}

/**
 * Create a new talking video project
 */
export function createProject(request: TalkingVideoRequest): TalkingVideoProject {
  const id = `tv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const project: TalkingVideoProject = {
    id,
    title: request.topic,
    status: 'draft',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    topic: request.topic,
    sourcePhotoUrl: request.sourcePhotoUrl,
    sceneStyle: request.sceneStyle || 'podcast_studio',
    scenePrompt: request.customScenePrompt,
    voiceId: request.voiceId,
    currentStep: 'script',
  };

  projects.set(id, project);
  return project;
}

/**
 * Get a project by ID
 */
export function getProject(id: string): TalkingVideoProject | undefined {
  return projects.get(id);
}

/**
 * Update a project
 */
export function updateProject(
  id: string,
  updates: Partial<TalkingVideoProject>
): TalkingVideoProject | undefined {
  const project = projects.get(id);
  if (!project) return undefined;

  const updated = { ...project, ...updates, updatedAt: Date.now() };
  projects.set(id, updated);
  return updated;
}

/**
 * Run the full talking video workflow
 */
export async function runWorkflow(
  request: TalkingVideoRequest,
  onProgress?: (step: string, status: string) => void
): Promise<TalkingVideoResult> {
  const project = createProject(request);

  try {
    // Step 1: Generate Script
    onProgress?.('script', 'generating');
    updateProject(project.id, { status: 'generating_script', currentStep: 'script' });

    const scriptResult = await generateScript({
      topic: request.topic,
      duration: request.duration || 90,
      tone: request.tone || 'professional',
    });

    updateProject(project.id, {
      script: scriptResult.script,
      scriptDuration: scriptResult.estimatedDuration,
      status: 'script_ready',
    });
    onProgress?.('script', 'complete');

    // Step 2: Generate Voice
    onProgress?.('voice', 'generating');
    updateProject(project.id, { status: 'generating_voice', currentStep: 'voice' });

    const voiceResult = await generateVoice({
      text: scriptResult.script,
      voiceId: request.voiceId || process.env.ELEVENLABS_VOICE_ID || '',
    });

    updateProject(project.id, {
      audioUrl: voiceResult.audioUrl,
      audioDuration: voiceResult.duration,
      status: 'voice_ready',
    });
    onProgress?.('voice', 'complete');

    // Step 3: Generate Background Video
    onProgress?.('background', 'generating');
    updateProject(project.id, { status: 'generating_background', currentStep: 'background' });

    const scenePrompt =
      request.customScenePrompt ||
      getScenePrompt(request.sceneStyle || 'podcast_studio', request.topic);

    const backgroundResult = await generateBackgroundVideo({
      prompt: scenePrompt,
      image_url: request.sourcePhotoUrl,
      duration: '10', // Use 10s for Kling, we'll loop/trim as needed
      aspect_ratio: '16:9',
    });

    updateProject(project.id, {
      backgroundVideoUrl: backgroundResult.video.url,
      status: 'background_ready',
    });
    onProgress?.('background', 'complete');

    // Step 4: Lip Sync
    onProgress?.('lipsync', 'generating');
    updateProject(project.id, { status: 'lip_syncing', currentStep: 'lipsync' });

    const lipSyncResult = await lipSyncVideo({
      video_url: backgroundResult.video.url,
      audio_url: voiceResult.audioUrl,
      sync_mode: 'accurate',
    });

    const finalProject = updateProject(project.id, {
      finalVideoUrl: lipSyncResult.video.url,
      status: 'complete',
      currentStep: undefined,
    });
    onProgress?.('lipsync', 'complete');

    return {
      projectId: project.id,
      status: 'complete',
      script: scriptResult.script,
      audioUrl: voiceResult.audioUrl,
      backgroundVideoUrl: backgroundResult.video.url,
      finalVideoUrl: lipSyncResult.video.url,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    updateProject(project.id, {
      status: 'error',
      error: errorMessage,
    });

    return {
      projectId: project.id,
      status: 'error',
      error: errorMessage,
    };
  }
}

/**
 * Generate a scene prompt based on style and topic
 */
function getScenePrompt(style: SceneStyle, topic: string): string {
  const scenePrompts: Record<SceneStyle, string> = {
    podcast_studio:
      'professional podcast studio with microphone, acoustic panels, warm lighting, modern setup',
    office: 'modern office environment, clean desk, plants, natural lighting through windows',
    outdoor: 'beautiful outdoor setting, natural scenery, soft golden hour lighting',
    news_desk: 'professional news desk setup, monitors in background, studio lighting',
    living_room: 'cozy modern living room, bookshelf, comfortable seating, warm ambient light',
    conference: 'conference room setting, presentation screen, professional environment',
    custom: '',
  };

  const basePrompt = scenePrompts[style] || scenePrompts.podcast_studio;
  return `${basePrompt}, person speaking about ${topic}, natural head movement, subtle gestures, professional lighting`;
}

/**
 * Run individual steps (for manual control)
 */
export async function runStep(
  projectId: string,
  step: 'script' | 'voice' | 'background' | 'lipsync'
): Promise<TalkingVideoProject | undefined> {
  const project = getProject(projectId);
  if (!project) return undefined;

  switch (step) {
    case 'script': {
      updateProject(projectId, { status: 'generating_script', currentStep: 'script' });
      const result = await generateScript({ topic: project.topic });
      return updateProject(projectId, {
        script: result.script,
        scriptDuration: result.estimatedDuration,
        status: 'script_ready',
      });
    }

    case 'voice': {
      if (!project.script) throw new Error('Script required before voice generation');
      updateProject(projectId, { status: 'generating_voice', currentStep: 'voice' });
      const result = await generateVoice({
        text: project.script,
        voiceId: project.voiceId || '',
      });
      return updateProject(projectId, {
        audioUrl: result.audioUrl,
        audioDuration: result.duration,
        status: 'voice_ready',
      });
    }

    case 'background': {
      updateProject(projectId, { status: 'generating_background', currentStep: 'background' });
      const scenePrompt =
        project.scenePrompt ||
        getScenePrompt(project.sceneStyle || 'podcast_studio', project.topic);
      const result = await generateBackgroundVideo({
        prompt: scenePrompt,
        image_url: project.sourcePhotoUrl,
        duration: '10',
        aspect_ratio: '16:9',
      });
      return updateProject(projectId, {
        backgroundVideoUrl: result.video.url,
        status: 'background_ready',
      });
    }

    case 'lipsync': {
      if (!project.backgroundVideoUrl || !project.audioUrl) {
        throw new Error('Background video and audio required for lip sync');
      }
      updateProject(projectId, { status: 'lip_syncing', currentStep: 'lipsync' });
      const result = await lipSyncVideo({
        video_url: project.backgroundVideoUrl,
        audio_url: project.audioUrl,
        sync_mode: 'accurate',
      });
      return updateProject(projectId, {
        finalVideoUrl: result.video.url,
        status: 'complete',
        currentStep: undefined,
      });
    }
  }
}
