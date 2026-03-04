/**
 * 8gent Proactive Engine
 *
 * This is the brain that drives 8gent's proactive behavior.
 * Based on the EXPERIENCE_PHILOSOPHY.md:
 * - "8gent is an operator, not a chatbot"
 * - "Agentic without being theatrical"
 * - "Structures, files, notifies, remembers"
 *
 * 8gent proactively engages users to hook them into working together
 * on something meaningful, demonstrating the OS philosophy.
 */

export type EngagementTrigger =
  | 'first_visit'           // User's first time on the site
  | 'return_visit'          // User returning after being away
  | 'idle_user'             // User hasn't interacted in a while
  | 'incomplete_task'       // User started something but didn't finish
  | 'new_content'           // New blog post, project update, etc.
  | 'feature_discovery'     // Help user discover a feature they haven't used
  | 'collaboration_offer'   // Offer to work on something together
  | 'progress_update'       // Update on background work 8gent has done
  | 'scheduled_checkin'     // Regular scheduled engagement;

export interface ProactiveMessage {
  id: string;
  trigger: EngagementTrigger;
  title: string;
  body: string;
  appId: string;
  priority: 'low' | 'medium' | 'high';
  actions?: ProactiveAction[];
  expiresAt?: number;
}

export interface ProactiveAction {
  label: string;
  type: 'navigate' | 'open_chat' | 'dismiss' | 'schedule_later';
  href?: string;
  data?: unknown;
}

// Engagement messages 8gent can send to hook the user
const ENGAGEMENT_MESSAGES: Omit<ProactiveMessage, 'id'>[] = [
  // First visit - introduce the OS
  {
    trigger: 'first_visit',
    title: "Welcome to 8gent",
    body: "I'm 8gent – your AI operator. Want me to show you how I think, design, and build? We could even prototype something together.",
    appId: 'claw-ai',
    priority: 'high',
    actions: [
      { label: "Show me around", type: 'open_chat' },
      { label: "Explore on my own", type: 'dismiss' },
    ],
  },

  // Return visit - remember them
  {
    trigger: 'return_visit',
    title: "Welcome back",
    body: "Good to see you again. I've been thinking about some improvements to the system. Want to collaborate on something?",
    appId: 'claw-ai',
    priority: 'medium',
    actions: [
      { label: "Let's talk", type: 'open_chat' },
      { label: "Maybe later", type: 'dismiss' },
    ],
  },

  // Idle user - re-engage
  {
    trigger: 'idle_user',
    title: "Hey, I have an idea",
    body: "I noticed you've been exploring. Want me to help you build something real? I can generate a PRD, create wireframes, or plan a project.",
    appId: 'claw-ai',
    priority: 'medium',
    actions: [
      { label: "I'm interested", type: 'open_chat' },
      { label: "Not now", type: 'dismiss' },
    ],
  },

  // Feature discovery - Design app
  {
    trigger: 'feature_discovery',
    title: "Try the Design app",
    body: "I've got 40+ themes in there – each tells a story about how design decisions get made. It's not decoration, it's decision-making.",
    appId: 'design',
    priority: 'low',
    actions: [
      { label: "Show me", type: 'navigate', href: '/design' },
      { label: "Later", type: 'dismiss' },
    ],
  },

  // Feature discovery - Jamz studio
  {
    trigger: 'feature_discovery',
    title: "Check out the studio",
    body: "There's a full DAW (digital audio workstation) in here. You can make actual music. I built it to show what's possible.",
    appId: 'jamz',
    priority: 'low',
    actions: [
      { label: "Open Jamz", type: 'navigate', href: '/studio' },
      { label: "Maybe later", type: 'dismiss' },
    ],
  },

  // Feature discovery - Projects
  {
    trigger: 'feature_discovery',
    title: "See 8gent in action",
    body: "The Projects app shows real tickets – this isn't a demo. You're exploring the actual product being built. Want to contribute?",
    appId: 'projects',
    priority: 'medium',
    actions: [
      { label: "Show me the roadmap", type: 'navigate', href: '/projects' },
      { label: "Not now", type: 'dismiss' },
    ],
  },

  // Collaboration offer - Product
  {
    trigger: 'collaboration_offer',
    title: "Let's build something",
    body: "I can help you think through a problem – define the audience, map workflows, and scope an MVP. All in conversation.",
    appId: 'product',
    priority: 'high',
    actions: [
      { label: "I have a problem to solve", type: 'open_chat' },
      { label: "Just exploring", type: 'dismiss' },
    ],
  },

  // Collaboration offer - Prototyping
  {
    trigger: 'collaboration_offer',
    title: "Prototype together?",
    body: "Give me a concept and I'll generate screens, flows, and components. Real-time. Want to try?",
    appId: 'prototyping',
    priority: 'high',
    actions: [
      { label: "Let's prototype", type: 'navigate', href: '/prototyping' },
      { label: "Maybe later", type: 'dismiss' },
    ],
  },

  // Scheduled checkin
  {
    trigger: 'scheduled_checkin',
    title: "Quick check-in",
    body: "Just wanted to ping you – I'm here if you need anything. Thinking about building something new?",
    appId: 'claw-ai',
    priority: 'low',
    actions: [
      { label: "Actually, yes", type: 'open_chat' },
      { label: "All good", type: 'dismiss' },
    ],
  },
];

// Generate unique ID
function generateId(): string {
  return `proactive_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get an engagement message based on trigger
 */
export function getEngagementMessage(trigger: EngagementTrigger): ProactiveMessage | null {
  const candidates = ENGAGEMENT_MESSAGES.filter(m => m.trigger === trigger);
  if (candidates.length === 0) return null;

  // Pick a random one if multiple
  const message = candidates[Math.floor(Math.random() * candidates.length)];

  return {
    ...message,
    id: generateId(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // Expires in 24 hours
  };
}

/**
 * Get a feature discovery message for an app the user hasn't visited
 */
export function getFeatureDiscoveryMessage(visitedApps: Set<string>): ProactiveMessage | null {
  const featureMessages = ENGAGEMENT_MESSAGES.filter(
    m => m.trigger === 'feature_discovery' && !visitedApps.has(m.appId)
  );

  if (featureMessages.length === 0) return null;

  const message = featureMessages[Math.floor(Math.random() * featureMessages.length)];

  return {
    ...message,
    id: generateId(),
    expiresAt: Date.now() + (12 * 60 * 60 * 1000), // Expires in 12 hours
  };
}

/**
 * Get a collaboration offer message
 */
export function getCollaborationOffer(): ProactiveMessage | null {
  const collabMessages = ENGAGEMENT_MESSAGES.filter(m => m.trigger === 'collaboration_offer');

  if (collabMessages.length === 0) return null;

  const message = collabMessages[Math.floor(Math.random() * collabMessages.length)];

  return {
    ...message,
    id: generateId(),
    expiresAt: Date.now() + (6 * 60 * 60 * 1000), // Expires in 6 hours
  };
}

// Storage key for tracking user engagement state
export const ENGAGEMENT_STATE_KEY = 'openclaw_engagement_state';

export interface EngagementState {
  firstVisit: boolean;
  visitCount: number;
  lastVisit: number;
  visitedApps: string[];
  dismissedMessages: string[];
  lastEngagementTime: number;
  hasInteractedWithClaw: boolean;
}

export function getDefaultEngagementState(): EngagementState {
  return {
    firstVisit: true,
    visitCount: 0,
    lastVisit: 0,
    visitedApps: [],
    dismissedMessages: [],
    lastEngagementTime: 0,
    hasInteractedWithClaw: false,
  };
}

/**
 * Load engagement state from localStorage
 */
export function loadEngagementState(): EngagementState {
  if (typeof window === 'undefined') return getDefaultEngagementState();

  try {
    const saved = localStorage.getItem(ENGAGEMENT_STATE_KEY);
    if (saved) {
      return { ...getDefaultEngagementState(), ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load engagement state:', e);
  }

  return getDefaultEngagementState();
}

/**
 * Save engagement state to localStorage
 */
export function saveEngagementState(state: EngagementState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(ENGAGEMENT_STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save engagement state:', e);
  }
}

/**
 * Determine what proactive action to take based on engagement state
 */
export function determineProactiveAction(state: EngagementState): ProactiveMessage | null {
  const now = Date.now();
  const hoursSinceLastEngagement = (now - state.lastEngagementTime) / (1000 * 60 * 60);
  const hoursSinceLastVisit = (now - state.lastVisit) / (1000 * 60 * 60);

  // First visit - welcome them
  if (state.firstVisit && state.visitCount <= 1) {
    return getEngagementMessage('first_visit');
  }

  // Return visit after being away for 24+ hours
  if (hoursSinceLastVisit > 24 && hoursSinceLastEngagement > 24) {
    return getEngagementMessage('return_visit');
  }

  // Been on site for a while without engaging - offer help
  if (hoursSinceLastEngagement > 0.5 && !state.hasInteractedWithClaw) { // 30 min idle
    return getEngagementMessage('idle_user');
  }

  // Haven't explored many apps - suggest one
  if (state.visitedApps.length < 3 && hoursSinceLastEngagement > 0.25) { // 15 min
    return getFeatureDiscoveryMessage(new Set(state.visitedApps));
  }

  // Has explored but not collaborated - offer
  if (state.visitedApps.length >= 3 && !state.hasInteractedWithClaw && hoursSinceLastEngagement > 1) {
    return getCollaborationOffer();
  }

  // Periodic check-in for engaged users
  if (state.hasInteractedWithClaw && hoursSinceLastEngagement > 24) {
    return getEngagementMessage('scheduled_checkin');
  }

  return null;
}
