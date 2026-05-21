/**
 * AuthContext.tsx — Uses apiClient for retry logic
 * No more "Cannot reach server" on the first load.
 */

import {
  createContext, useContext, useState,
  useEffect, useCallback, useRef, ReactNode,
} from "react";
import { apiPost, apiGet } from "@/lib/apiClient";

export interface AuthUser {
  id:            string;
  username:      string;
  fullName:      string;
  email:         string;
  profilePhoto:  string | null;
  bannerImage:   string | null;
  followerCount: number;
  isOnline:      boolean;
}

interface AuthContextValue {
  user:            AuthUser | null;
  isLoading:       boolean;
  isAuthenticated: boolean;
  login:           (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout:          () => Promise<void>;
  refreshUser:     () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null, isLoading: true, isAuthenticated: false,
  login: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
});

function usersEqual(a: AuthUser | null, b: AuthUser | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.id === b.id && a.username === b.username &&
         a.email === b.email && a.profilePhoto === b.profilePhoto;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,      setUserState] = useState<AuthUser | null>(null);
  const [isLoading, setLoading]   = useState(true);
  const userRef = useRef<AuthUser | null>(null);

  const setUser = useCallback((next: AuthUser | null) => {
    if (!usersEqual(userRef.current, next)) {
      userRef.current = next;
      setUserState(next);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiGet("/auth/session.php");
      if (data?.logged_in && data.user_id) {
        setUser({
          id:            data.user_id,
          username:      data.username      || "",
          fullName:      data.full_name     || "",
          email:         data.email         || "",
          profilePhoto:  data.profile_photo || null,
          bannerImage:   data.banner_image  || null,
          followerCount: data.follower_count || 0,
          isOnline:      true,
        });
      } else {
        setUser(null);
      }
    } catch {
      // Network error — don't change auth state, just leave as-is
      // This prevents logout on temporary connectivity issues
    }
  }, [setUser]);

  useEffect(() => {
    let cancelled = false;
    refreshUser().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []); // once on mount

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await apiPost("/auth/login.php", { email, password });
      if (data.success) {
        await refreshUser();
        return { success: true };
      }
      return { success: false, error: data.error || "Invalid email or password" };
    } catch (err: any) {
      return { success: false, error: err.message || "Cannot reach server" };
    }
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await apiPost("/auth/logout.php");
    } catch {}
    setUser(null);
    window.history.replaceState(null, "", "/");
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
