module.exports = [
"[project]/src/lib/tpmjs/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * TPMJS Client - Minimal implementation for tool provider selector
 * Full implementation would connect to TPMJS registry API
 */ __turbopack_context__.s([
    "getTPMJSClient",
    ()=>getTPMJSClient
]);
class TPMJSClient {
    apiUrl;
    executorUrl;
    executorApiKey;
    constructor(config = {}){
        this.apiUrl = config.apiUrl || 'https://tpmjs.com';
        this.executorUrl = config.executorUrl || 'https://executor.tpmjs.com';
        this.executorApiKey = config.executorApiKey;
    }
    async searchTools(query, options) {
        // Stub implementation - would call actual TPMJS API
        // For now, return empty results
        return {
            tools: [],
            total: 0
        };
    }
    async executeTool(toolId, params, env) {
        // Stub implementation
        throw new Error('TPMJS executor not configured');
    }
    async checkExecutorHealth() {
        // Stub implementation
        return {
            healthy: false,
            error: 'Not configured'
        };
    }
}
let _client = null;
function getTPMJSClient() {
    if (!_client) {
        _client = new TPMJSClient({
            apiUrl: process.env.NEXT_PUBLIC_TPMJS_API_URL,
            executorUrl: process.env.NEXT_PUBLIC_TPMJS_EXECUTOR_URL,
            executorApiKey: process.env.NEXT_PUBLIC_TPMJS_EXECUTOR_API_KEY
        });
    }
    return _client;
}
}),
];

//# sourceMappingURL=src_lib_tpmjs_client_ts_57c4d5de._.js.map