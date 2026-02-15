import { OpenClawClientImpl } from '../src/lib/openclaw/client-impl';
import WebSocket from 'isomorphic-ws';

// Polyfill WebSocket for Node environment if needed (isomorphic-ws usually handles it but explicit global might be needed for some libs)
if (!global.WebSocket) {
    global.WebSocket = WebSocket;
}

async function verify() {
    console.log('Verifying OpenClaw Connection...');
    const client = new OpenClawClientImpl({
        url: 'ws://localhost:3000',
        authToken: 'openclaw-admin-token'
    });

    try {
        console.log('Connecting...');
        await client.connect();
        console.log('Connected successfully!');

        // Try a simple request if possible
        // const result = await client.request('health');
        // console.log('Health check:', result);

        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
}

verify();
