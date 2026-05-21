/**
 * AuthContext.tsx
 * FIXED: login and register set user directly from API response.
 * No second session.php call needed — avoids proxy session cookie issues.
 */

import {
  createContext, useContext, useState,
  useEffect, useCallback, useRef, ReactNode,
} from "react";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

export interface AuthUser {
  id:            string;
  username:      string;
  fullName:      string;
  email:         string;
  profilePhoto:  string | null;
  bannerImage:   string | null;
  followerCount: number;
}

export interface AuthContextValue {
  user:            AuthUser | null;
  isLoading:       boolean;
  isAuthenticated: boolean;
  login:           (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout:          () => Promise<void>;
  refreshUser:     () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null, isLoading: true, isAuthenticated: false,
  login: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Map raw API data to AuthUser
function mapUser(data: any): AuthUser {
  return {
    id:            data.user_id       || data.id || "",
    username:      data.username      || "",
    fullName:      data.full_name     || "",
    email:         data.email         || "",
    profilePhoto:  data.profile_photo || null,
    bannerImage:   data.banner_image  || null,
    followerCount: data.follower_count || 0,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,      setUser]    = useState<AuthUser | null>(null);
  const [isLoading, setLoading] = useState(true);
  const done = useRef(false);

  // Check existing session on page load
  const refreshUser = useCallback(async () => {
    try {
      const res  = await fetch(`${API_BASE}/auth/session.php`, { credentials: "include" });
      const data = await res.json();
      if (data?.logged_in && data.user_id) {
        setUser(mapUser(data));
      } else {
        setUser(null);
      }
    } catch {
      // keep existing state on network error
    }
  }, []);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  // Login — sets user directly from response, no second request needed
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res  = await fetch(`${API_BASE}/auth/login.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(mapUser(data)); // set user directly — no session roundtrip
        return { success: true };
      }
      return { success: false, error: data.error || "Invalid email or password" };
    } catch {
      return { success: false, error: "Cannot reach server. Please try again." };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/auth/logout.php`, { method: "POST", credentials: "include" });
    } catch {}
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isLoading, isAuthenticated: !!user,
      login, logout, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
