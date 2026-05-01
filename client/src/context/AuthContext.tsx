import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { loginApi, logoutApi, meApi } from '../api/auth';
import { registerApi } from '../api/auth';
import { clearAccessToken, setAccessToken } from '../lib/token';
import { AuthContext } from './auth-context';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Awaited<ReturnType<typeof meApi>>['data'] | null>(null);
    const [loading, setLoading] = useState(true);

    const bootstrapAuth = async () => {
        try {
            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });

            if(!refreshRes.ok) throw new Error('Refresh failed');

            const refreshData = await refreshRes.json();
            setAccessToken(refreshData.data.accessToken);

            const meRes = await meApi();
            setUser(meRes.data);
        } catch {
            clearAccessToken();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        bootstrapAuth();
    }, []);

    const login = async (payload: { email: string; password: string }) => {
        const res = await loginApi(payload);
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
    };

    const register = async (payload: { name: string; email: string; password: string }) => {
        const res = await registerApi(payload);
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
    };

    const logout = async () => {
        await logoutApi();
        clearAccessToken();
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            bootstrapAuth,
        }),
        [user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
