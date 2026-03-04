// Thread-Based Engineering Library
// Export all thread utilities

export * from './types';

// Generate unique thread ID
export function generateThreadId(): string {
  return `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate unique group ID
export function generateGroupId(): string {
  return `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Format duration for display
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
}

// Format cost for display
export function formatCost(cost: number): string {
  if (cost < 0.01) return `$${(cost * 100).toFixed(2)}¢`;
  return `$${cost.toFixed(4)}`;
}

// Format tokens for display
export function formatTokens(tokens: number): string {
  if (tokens < 1000) return `${tokens}`;
  if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K`;
  return `${(tokens / 1000000).toFixed(2)}M`;
}

// Estimate cost based on model and tokens
export function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  // Approximate pricing (per 1M tokens)
  const pricing: Record<string, { input: number; output: number }> = {
    'haiku': { input: 0.25, output: 1.25 },
    'sonnet': { input: 3, output: 15 },
    'opus': { input: 15, output: 75 },
    'opus-4.5': { input: 15, output: 75 },
    'gpt-4o': { input: 5, output: 15 },
    'gemini': { input: 3.5, output: 10.5 },
  };

  const rates = pricing[model] || pricing['sonnet'];
  return (inputTokens * rates.input + outputTokens * rates.output) / 1000000;
}
