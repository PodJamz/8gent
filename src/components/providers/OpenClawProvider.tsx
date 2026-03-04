
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { openClaw } from "@/lib/openclaw/client";

interface OpenClawContextType {
    isConnected: boolean;
}

const OpenClawContext = createContext<OpenClawContextType>({
    isConnected: false,
});

export function OpenClawProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Check connection status or listen to events
        // For now, we assume connected if client initializes logic
        // specific to connection handling would go here.
        setIsConnected(true);
    }, []);

    return (
        <OpenClawContext.Provider value={{ isConnected }}>
            {children}
        </OpenClawContext.Provider>
    );
}

export const useOpenClawContext = () => useContext(OpenClawContext);
