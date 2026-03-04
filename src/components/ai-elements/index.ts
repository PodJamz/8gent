// 8gent AI Elements
// Custom components + Vercel AI Elements

// Custom 8gent components
export { Shimmer, type ShimmerProps } from './Shimmer';
export { Loader, type LoaderProps } from './Loader';
export { ToolExecution, type ToolExecutionProps, type ToolState } from './ToolExecution';
export { Reasoning, type ReasoningProps } from './Reasoning';
export { ChatThinking, type ChatThinkingProps } from './ChatThinking';
export { SkillsPanel } from './SkillsPanel';

// Vercel AI Elements (from github.com/vercel/ai-elements)
// Task - for showing task execution steps
export { Task, TaskTrigger, TaskContent, TaskItem, TaskItemFile } from './task';

// Tool - for showing tool execution
export { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput, getStatusBadge } from './tool';

// Plan - for showing execution plans
export {
  Plan,
  PlanHeader,
  PlanTitle,
  PlanDescription,
  PlanAction,
  PlanContent,
  PlanFooter,
  PlanTrigger,
} from './plan';

// Chain of Thought - for showing reasoning process
export {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
  ChainOfThoughtSearchResults,
  ChainOfThoughtSearchResult,
  ChainOfThoughtContent,
  ChainOfThoughtImage,
} from './chain-of-thought';

// Reasoning - for showing AI reasoning (renamed to avoid conflict)
export {
  Reasoning as VercelReasoning,
  ReasoningTrigger,
  ReasoningContent,
  useReasoning,
} from './vercel-reasoning';

// Loader - loading spinner (renamed to avoid conflict)
export { Loader as VercelLoader } from './vercel-loader';

// Shimmer - loading shimmer effect (renamed to avoid conflict)
export { Shimmer as VercelShimmer } from './vercel-shimmer';

// Note: Message component removed due to streamdown API compatibility issues
// The core AI Elements (Task, Tool, Plan, ChainOfThought, Reasoning) are available
