/**
 * hooks/useLogo.ts
 * Fetches app branding (logo URL, name, tagline) from the API.
 * Falls back to defaults if not configured.
 */
import { useState, useEffect } from "react";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

interface AppBranding {
  app_name:     string;
  app_tagline:  string;
  app_logo_url: string;
  loaded:       boolean;
}

const DEFAULT: AppBranding = {
  app_name:    "Mobiface",
  app_tagline: "Connect, Share and Earn",
  app_logo_url:"",
  loaded:      false,
};

// Cache so we only fetch once per page load
let cachedBranding: AppBranding | null = null;

export const useLogo = (): AppBranding => {
  const [branding, setBranding] = useState<AppBranding>(cachedBranding ?? DEFAULT);

  useEffect(() => {
    if (cachedBranding?.loaded) { setBranding(cachedBranding); return; }
    fetch(`${API_BASE}/settings/app.php`, { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          const b: AppBranding = {
            app_name:     d.app_name     || "Mobiface",
            app_tagline:  d.app_tagline  || "Connect, Share and Earn",
            app_logo_url: d.app_logo_url || "",
            loaded:       true,
          };
          cachedBranding = b;
          setBranding(b);
        }
      })
      .catch(() => setBranding({ ...DEFAULT, loaded: true }));
  }, []);

  return branding;
};
