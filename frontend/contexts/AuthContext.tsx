"use client";

import { UserProfile } from "@/types/user/UserProfile";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    error: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const pathname = usePathname();

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/user/profile", { method: "GET" });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setError(false);
            } else {
                setUser(null);
                if (res.status !== 401) {
                    setError(true);
                } else {
                    setError(false);
                }
            }
        } catch (e) {
            setUser(null);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [pathname]);

    return (
        <AuthContext.Provider value={{ user, loading, error, refreshUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
