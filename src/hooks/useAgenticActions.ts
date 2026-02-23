/**
 * useAgenticActions - Hook for executing agentic tool actions
 *
 * Handles the bridge between 8gent tool responses and Convex mutations.
 * When 8gent invokes an agentic tool (create_project, create_ticket, etc.),
 * this hook executes the corresponding Convex mutation and returns the result.
 *
 * Inspired by BMAD-METHOD and CCPM workflows.
 */

import { useCallback } from 'react';
import { useMutation, useQuery } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import { Id } from '@/lib/convex-shim';

// Type-safe access to agentic API (may not be generated yet)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const agenticApi = (api as any).agentic;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const designCanvasApi = (api as any).designCanvas;

export interface AgenticAction {
  type:
  | 'project_created'
  | 'prd_created'
  | 'ticket_created'
  | 'ticket_updated'
  | 'prd_sharded'
  | 'show_kanban'
  // Canvas visual co-pilot actions
  | 'canvas_created'
  | 'canvas_opened'
  | 'canvas_read'
  | 'canvas_updated'
  | 'ui_mockup_created'
  | 'user_flow_created'
  | 'architecture_created'
  | 'visuals_generated';
  payload: Record<string, unknown>;
}

export interface AgenticActionResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export interface UseAgenticActionsOptions {
  ownerId: string;
  onProjectCreated?: (projectId: string, slug: string) => void;
  onPRDCreated?: (prdId: string) => void;
  onTicketCreated?: (ticketId: string) => void;
  onTicketUpdated?: (ticketId: string) => void;
  onPRDSharded?: (result: { epicsCreated: number; ticketsCreated: number }) => void;
  // Canvas callbacks
  onCanvasCreated?: (canvasId: string, canvasType: string) => void;
  onCanvasOpened?: (canvasId: string) => void;
  onCanvasUpdated?: (canvasId: string) => void;
  onVisualsGenerated?: (prdId: string, recommendations: unknown[]) => void;
}

export function useAgenticActions(options: UseAgenticActionsOptions) {
  const {
    ownerId,
    onProjectCreated,
    onPRDCreated,
    onTicketCreated,
    onTicketUpdated,
    onPRDSharded,
    onCanvasCreated,
    onCanvasOpened,
    onCanvasUpdated,
    onVisualsGenerated,
  } = options;

  // Convex mutations (safely access agentic API)
  const createProject = useMutation(agenticApi?.createProductProject ?? (() => { }));
  const createPRD = useMutation(agenticApi?.createPRD ?? (() => { }));
  const createTicket = useMutation(agenticApi?.createTicket ?? (() => { }));
  const updateTicketMutation = useMutation(agenticApi?.updateTicket ?? (() => { }));
  const shardPRD = useMutation(agenticApi?.shardPRDToTickets ?? (() => { }));

  // Canvas mutations (safely access designCanvas API)
  const createCanvas = useMutation(designCanvasApi?.createCanvas ?? (() => { }));
  const updateCanvasData = useMutation(designCanvasApi?.updateCanvasData ?? (() => { }));

  /**
   * Execute an agentic action from 8gent tool response
   */
  const executeAction = useCallback(async (action: AgenticAction): Promise<AgenticActionResult> => {
    try {
      switch (action.type) {
        case 'project_created': {
          const { name, description, color } = action.payload;
          const result = await createProject({
            name: name as string,
            description: description as string | undefined,
            ownerId,
            color: color as string | undefined,
          });

          onProjectCreated?.(result.projectId as string, result.slug);

          return {
            success: true,
            data: {
              projectId: result.projectId,
              slug: result.slug,
              message: `Created project "${name}" (${result.slug})`,
            },
          };
        }

        case 'prd_created': {
          const { projectId, title, executiveSummary, problemStatement } = action.payload;
          const result = await createPRD({
            projectId: projectId as Id<"productProjects">,
            title: title as string,
            executiveSummary: executiveSummary as string | undefined,
            problemStatement: problemStatement as string | undefined,
            generatedBy: 'ai',
          });

          onPRDCreated?.(result.prdId as string);

          return {
            success: true,
            data: {
              prdId: result.prdId,
              version: result.version,
              message: `Created PRD "${title}" (v${result.version})`,
            },
          };
        }

        case 'ticket_created': {
          const { projectId, title, description, type, priority, asA, iWant, soThat, labels } = action.payload;
          const result = await createTicket({
            projectId: projectId as Id<"productProjects">,
            title: title as string,
            description: description as string | undefined,
            type: type as string | undefined,
            priority: priority as string | undefined,
            asA: asA as string | undefined,
            iWant: iWant as string | undefined,
            soThat: soThat as string | undefined,
            labels: labels as string[] | undefined,
            createdBy: 'ai',
          });

          onTicketCreated?.(result.ticketId);

          return {
            success: true,
            data: {
              ticketId: result.ticketId,
              _id: result._id,
              message: `Created ticket ${result.ticketId}: "${title}"`,
            },
          };
        }

        case 'ticket_updated': {
          const { ticketId, status, priority, title, description, assigneeId } = action.payload;

          // First, find the ticket by human-readable ID
          // For now, we'll pass the _id directly if available
          // In production, you'd query by ticketId first

          // This requires the _id, which the frontend should have
          // For the MVP, we'll expect the payload to include _id
          const _id = action.payload._id as Id<"tickets">;

          if (!_id) {
            return {
              success: false,
              error: 'Ticket _id is required for update. Use getTicketByTicketId to resolve first.',
            };
          }

          await updateTicketMutation({
            _id,
            status: status as string | undefined,
            priority: priority as string | undefined,
            title: title as string | undefined,
            description: description as string | undefined,
            assigneeId: assigneeId as string | undefined,
          });

          onTicketUpdated?.(ticketId as string);

          return {
            success: true,
            data: {
              ticketId,
              message: `Updated ticket ${ticketId}`,
            },
          };
        }

        case 'prd_sharded': {
          const { prdId, projectId } = action.payload;
          const result = await shardPRD({
            prdId: prdId as Id<"prds">,
            projectId: projectId as Id<"productProjects">,
          });

          onPRDSharded?.({
            epicsCreated: result.epicsCreated,
            ticketsCreated: result.ticketsCreated,
          });

          return {
            success: true,
            data: {
              epicsCreated: result.epicsCreated,
              ticketsCreated: result.ticketsCreated,
              ticketIds: result.ticketIds,
              message: `Created ${result.epicsCreated} epics and ${result.ticketsCreated} tickets from PRD`,
            },
          };
        }

        case 'show_kanban': {
          // This is a query action, not a mutation
          // The frontend should handle this by fetching and displaying the kanban
          return {
            success: true,
            data: {
              projectId: action.payload.projectId,
              message: 'Kanban data should be fetched via query',
            },
          };
        }

        // Canvas Visual Co-Pilot Actions
        case 'canvas_created':
        case 'ui_mockup_created':
        case 'user_flow_created':
        case 'architecture_created': {
          const { canvasId, name, canvasType, url } = action.payload;

          onCanvasCreated?.(canvasId as string, canvasType as string);

          return {
            success: true,
            data: {
              canvasId,
              name,
              canvasType,
              url: url || `/canvas?id=${canvasId}`,
              message: `Created ${canvasType} canvas "${name}"`,
            },
          };
        }

        case 'canvas_opened': {
          const { canvasId, url } = action.payload;

          onCanvasOpened?.(canvasId as string);

          return {
            success: true,
            data: {
              canvasId,
              url: url || `/canvas?id=${canvasId}`,
              message: `Opening canvas ${canvasId}`,
            },
          };
        }

        case 'canvas_read': {
          // Read action - data is already in payload
          return {
            success: true,
            data: {
              canvasId: action.payload.canvasId,
              name: action.payload.name,
              canvasType: action.payload.canvasType,
              canvasData: action.payload.canvasData,
              message: `Read canvas ${action.payload.name}`,
            },
          };
        }

        case 'canvas_updated': {
          const { canvasId, operation } = action.payload;

          onCanvasUpdated?.(canvasId as string);

          return {
            success: true,
            data: {
              canvasId,
              operation,
              message: `Canvas updated: ${operation}`,
            },
          };
        }

        case 'visuals_generated': {
          const { prdId, recommendations } = action.payload;

          onVisualsGenerated?.(prdId as string, recommendations as unknown[]);

          return {
            success: true,
            data: {
              prdId,
              recommendations,
              message: `Generated visual recommendations from PRD`,
            },
          };
        }

        default:
          return {
            success: false,
            error: `Unknown agentic action type: ${action.type}`,
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Action execution failed',
      };
    }
  }, [ownerId, createProject, createPRD, createTicket, updateTicketMutation, shardPRD, createCanvas, updateCanvasData, onProjectCreated, onPRDCreated, onTicketCreated, onTicketUpdated, onPRDSharded, onCanvasCreated, onCanvasOpened, onCanvasUpdated, onVisualsGenerated]);

  /**
   * Check if an action is an agentic action that we should handle
   */
  const isAgenticAction = useCallback((action: { type: string }): boolean => {
    return [
      'project_created',
      'prd_created',
      'ticket_created',
      'ticket_updated',
      'prd_sharded',
      'show_kanban',
      // Canvas visual co-pilot actions
      'canvas_created',
      'canvas_opened',
      'canvas_read',
      'canvas_updated',
      'ui_mockup_created',
      'user_flow_created',
      'architecture_created',
      'visuals_generated',
    ].includes(action.type);
  }, []);

  return {
    executeAction,
    isAgenticAction,
  };
}
