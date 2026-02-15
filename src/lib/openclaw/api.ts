
// Shim for Convex generated API
// Uses a Proxy to allow api.folder.function access without crashing
const apiHandler = {
    get: function (target: any, prop: string) {
        if (typeof prop === 'string') {
            // Return another proxy to support nested access like api.foo.bar
            return new Proxy({}, apiHandler);
        }
        return {};
    }
};

export const api = new Proxy({}, apiHandler);
export const internal = new Proxy({}, apiHandler);
