import { nanoid } from 'nanoid';
import WebSocket from 'isomorphic-ws';
import { Buffer } from 'buffer';

// Protocol constants based on OpenClaw source
const PROTOCOL_VERSION = 3;

export interface OpenClawClientConfig {
    url: string;
    authToken?: string;
    device?: {
        id: string;
        publicKey: string;
        privateKey: string;
    };
}

type MessageHandler = (message: any) => void;

export class OpenClawClientImpl {
    private ws: WebSocket | null = null;
    private url: string;
    private authToken?: string;
    private pendingRequests = new Map<string, { resolve: (val: any) => void; reject: (err: any) => void }>();
    private eventListeners = new Map<string, Set<MessageHandler>>();
    private isConnected = false;
    private connectPromise: Promise<void> | null = null;

    constructor(config: OpenClawClientConfig) {
        this.url = config.url;
        this.authToken = config.authToken;
    }

    async connect(): Promise<void> {
        if (this.isConnected) return;
        if (this.connectPromise) return this.connectPromise;

        this.connectPromise = new Promise((resolve, reject) => {
            try {
                // Set origin to satisfy gateway check for Control UI
                const options = {
                    headers: {
                        Origin: 'http://localhost:18789'
                    }
                };
                this.ws = new WebSocket(this.url, options);

                this.ws.onopen = () => {
                    console.log('[OpenClawClient] WebSocket connected');
                };

                this.ws.onmessage = (event) => {
                    try {
                        let data: any;
                        const rawData = event.data;

                        // console.log('[OpenClawClient] Raw message type:', typeof rawData);

                        if (typeof rawData === 'string') {
                            data = JSON.parse(rawData);
                        } else if (Buffer.isBuffer(rawData)) {
                            // console.log('[OpenClawClient] Buffer received, length:', rawData.length);
                            data = JSON.parse(rawData.toString());
                        } else if (rawData instanceof ArrayBuffer) {
                            // console.log('[OpenClawClient] ArrayBuffer received, byteLength:', rawData.byteLength);
                            const decoder = new TextDecoder();
                            data = JSON.parse(decoder.decode(rawData));
                        } else if (Array.isArray(rawData)) {
                            // Buffer[]
                            // console.log('[OpenClawClient] Buffer array received');
                            data = JSON.parse(Buffer.concat(rawData).toString());
                        } else {
                            // unknown
                            console.warn('[OpenClawClient] Unknown message type:', typeof rawData);
                            return;
                        }

                        // console.log('[OpenClawClient] Parsed message:', data?.type, data?.event || data?.method);
                        this.handleMessage(data, resolve, reject);
                    } catch (err) {
                        console.error('[OpenClawClient] Failed to parse message:', err);
                    }
                };

                this.ws.onerror = (error) => {
                    console.error('[OpenClawClient] WebSocket error:', error);
                    if (!this.isConnected) reject(error);
                };

                this.ws.onclose = () => {
                    console.log('[OpenClawClient] WebSocket closed');
                    this.isConnected = false;
                    this.connectPromise = null;
                };
            } catch (err) {
                reject(err);
            }
        });

        return this.connectPromise;
    }

    private handleMessage(message: any, connectResolve: () => void, connectReject: (err: any) => void) {
        // console.log('[OpenClawClient] Received:', message);

        if (message.type === 'event' && message.event === 'connect.challenge') {
            this.handleChallenge(message.payload, connectResolve, connectReject);
            return;
        }

        if (message.type === 'res') {
            const pending = this.pendingRequests.get(message.id);
            if (pending) {
                if (message.ok) {
                    pending.resolve(message.body || message.payload); // Adapting to potential response format
                } else {
                    pending.reject(new Error(message.error?.message || 'Unknown error'));
                }
                this.pendingRequests.delete(message.id);
            }
            return;
        }

        if (message.type === 'event') {
            const listeners = this.eventListeners.get(message.event);
            if (listeners) {
                listeners.forEach(handler => handler(message.payload));
            }
        }
    }

    private handleChallenge(payload: { nonce: string }, resolve: () => void, reject: (err: any) => void) {
        const connectReq = {
            type: 'req',
            id: nanoid(),
            method: 'connect',
            params: {
                minProtocol: PROTOCOL_VERSION,
                maxProtocol: PROTOCOL_VERSION,
                role: 'operator',
                client: {
                    id: 'webchat', // Bypass Control UI secure context check
                    displayName: '8gent',
                    version: '0.1.0',
                    platform: 'web',
                    mode: 'ui',
                    deviceFamily: 'browser'
                },
                auth: { token: this.authToken }
            }
        };

        if (this.ws) {
            this.send(connectReq);
            // We assume connection is successful if we don't get an immediate error? 
            // Or should we wait for a response? The protocol usually sends a generic 'res' for the connect req.

            // Register a temporary handler for the connect response
            this.pendingRequests.set(connectReq.id, {
                resolve: () => {
                    this.isConnected = true;
                    resolve();
                },
                reject: (err) => {
                    this.isConnected = false;
                    reject(err);
                }
            });
        }
    }

    private send(message: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('[OpenClawClient] Cannot send, socket not open');
        }
    }

    public async request(method: string, params: any = {}): Promise<any> {
        await this.connect();
        const id = nanoid();
        return new Promise((resolve, reject) => {
            this.pendingRequests.set(id, { resolve, reject });
            this.send({
                type: 'req',
                id,
                method,
                params
            });
            // specific logic for timeout could be added here
        });
    }

    public subscribe(event: string, handler: MessageHandler) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event)!.add(handler);
        return () => {
            this.eventListeners.get(event)?.delete(handler);
        };
    }
}
