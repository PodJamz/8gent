
import { useState, useEffect, useCallback, useMemo } from 'react';
import { openClaw } from './client';

export function useQuery<T>(queryName: string, args: any = {}) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Stable stringify for args to prevent infinite loops
    const argsString = useMemo(() => JSON.stringify(args), [args]);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const fetchData = async () => {
            try {
                // Ensure args are parsed back to object if needed, or pass as is
                const actualArgs = JSON.parse(argsString);
                // Map "folder:function" to "folder.function" if needed, or use as is.
                // OpenClaw methods are like "agents.list". Convex was "folder:function".
                // We'll assume the user updates the query names or we convert them. as needed.
                const method = queryName.replace(':', '.');

                const result = await openClaw.request(method, actualArgs);
                if (isMounted) setData(result);
            } catch (err: any) {
                console.error(`[OpenClaw] Query failed: ${queryName}`, err);
                if (isMounted) setError(err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchData();

        // Subscription logic could go here
        // const unsubscribe = openClaw.subscribe(queryName, (payload) => { ... });

        return () => {
            isMounted = false;
            // unsubscribe();
        };
    }, [queryName, argsString]);

    return data;
}

export function useMutation<T, A>(mutationName: string) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = useCallback(async (args: A) => {
        setIsLoading(true);
        setError(null);
        try {
            const method = mutationName.replace(':', '.');
            const result = await openClaw.request(method, args);
            return result;
        } catch (err: any) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [mutationName]);

    // Return the mutate function directly to match Convex behavior
    const mutateFunction = async (args: A) => {
        try {
            setIsLoading(true);
            return await mutate(args);
        } finally {
            setIsLoading(false);
        }
    };
    return mutateFunction;
}

// Shims
export function useConvex() {
    return openClaw;
}

export function useConvexAuth() {
    return { isAuthenticated: true, isLoading: false };
}

// Support useQuery(api.foo.bar) syntax which passes a function/object
// We need to handle arguments that might be objects or strings.
// Since we replaced the import, existing code passes the original 'api' object references.
// We need to make sure those references don't crash.
// However, 'api' imports are usually from '@/lib/convex-shim';
// Since we removed convex folder, those imports will fail too!

