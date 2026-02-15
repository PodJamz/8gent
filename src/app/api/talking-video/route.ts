import { NextRequest, NextResponse } from 'next/server';
import {
  runWorkflow,
  generateScript,
  createProject,
  getProject,
  runStep,
} from '@/lib/talking-video';
import type { TalkingVideoRequest, ScriptRequest } from '@/lib/talking-video';

export const maxDuration = 300; // 5 minute timeout for video generation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'generate_script': {
        const scriptRequest: ScriptRequest = {
          topic: body.topic,
          duration: body.duration,
          tone: body.tone,
          style: body.style,
        };
        const result = await generateScript(scriptRequest);
        return NextResponse.json(result);
      }

      case 'create_project': {
        const projectRequest: TalkingVideoRequest = {
          topic: body.topic,
          sourcePhotoUrl: body.sourcePhotoUrl,
          sceneStyle: body.sceneStyle,
          customScenePrompt: body.customScenePrompt,
          voiceId: body.voiceId,
          duration: body.duration,
          tone: body.tone,
        };
        const project = createProject(projectRequest);
        return NextResponse.json(project);
      }

      case 'run_step': {
        const { projectId, step } = body;
        const result = await runStep(projectId, step);
        if (!result) {
          return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        return NextResponse.json(result);
      }

      case 'run_workflow': {
        const workflowRequest: TalkingVideoRequest = {
          topic: body.topic,
          sourcePhotoUrl: body.sourcePhotoUrl,
          sceneStyle: body.sceneStyle,
          customScenePrompt: body.customScenePrompt,
          voiceId: body.voiceId,
          duration: body.duration,
          tone: body.tone,
        };
        const result = await runWorkflow(workflowRequest);
        return NextResponse.json(result);
      }

      case 'get_project': {
        const { projectId } = body;
        const project = getProject(projectId);
        if (!project) {
          return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        return NextResponse.json(project);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Talking video API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
