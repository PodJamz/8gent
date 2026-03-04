import { OpenClawClientImpl } from './client-impl';

// Default to local gateway if not configured
const GATEWAY_URL = process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY_URL || 'ws://localhost:3000';
const GATEWAY_TOKEN = process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY_TOKEN || 'openclaw-admin-token'; // Default for dev

class OpenClawClient {
  private static instance: OpenClawClientImpl;

  public static getInstance(): OpenClawClientImpl {
    if (!OpenClawClient.instance) {
      // Load from localStorage if possible
      let url = GATEWAY_URL;
      let token = GATEWAY_TOKEN;

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('openclaw_onboarding');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.gatewayUrl) url = parsed.gatewayUrl;
            if (parsed.gatewayToken) token = parsed.gatewayToken;
          } catch (e) {
            // Use defaults
          }
        }
      }

      OpenClawClient.instance = new OpenClawClientImpl({
        url: url,
        authToken: token
      });
    }
    return OpenClawClient.instance;
  }
}

export const openClaw = OpenClawClient.getInstance();

export const useOpenClaw = () => {
  return openClaw;
};

// Shims for Convex compatibility
export class ConvexHttpClient {
  constructor(private url: string) { }
  // Add methods as needed
  async query(name: string, args: any) { console.warn("ConvexHttpClient.query shim called", name, args); return null; }
  async mutation(name: string, args: any) { console.warn("ConvexHttpClient.mutation shim called", name, args); return null; }
  async action(name: string, args: any) { console.warn("ConvexHttpClient.action shim called", name, args); return null; }
}

export function makeFunctionReference(name: string) {
  return name;
}

export class ConvexReactClient {
  constructor(private url: string) { }
}

export const ConvexProvider = ({ client, children }: any) => children;
export const ConvexProviderWithClerk = ({ client, children }: any) => children;
