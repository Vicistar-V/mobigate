/**
 * components/AppLogo.tsx
 * Renders app logo or branded text fallback.
 * NO white background wrapper — logo displays directly.
 * Use a light-colored or white logo on dark/purple backgrounds.
 */
import { useState, useEffect } from "react";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

// Cache so we only fetch once
let cache: { url: string; name: string; tagline: string } | null = null;

interface AppLogoProps {
  /** Height of the logo image in px */
  height?:           number;
  /** Max width in px */
  maxWidth?:         number;
  textClassName?:    string;
  showTagline?:      boolean;
  taglineClassName?: string;
  className?:        string;
}

export const AppLogo = ({
  height           = 56,
  maxWidth         = 200,
  textClassName    = "text-white font-black text-4xl tracking-tight drop-shadow-sm",
  showTagline      = true,
  taglineClassName = "text-white/75 text-sm font-medium tracking-wide mt-1",
  className        = "flex flex-col items-center",
}: AppLogoProps) => {
  const [logoUrl,  setLogoUrl]  = useState(cache?.url     ?? "");
  const [appName,  setAppName]  = useState(cache?.name    ?? "Mobiface");
  const [tagline,  setTagline]  = useState(cache?.tagline ?? "Connect, Share and Earn");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (cache) return; // already fetched
    fetch(`${API_BASE}/settings/app.php`, { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) return;
        const url     = d.app_logo_url  || "";
        const name    = d.app_name      || "Mobiface";
        const tag     = d.app_tagline   || "Connect, Share and Earn";
        cache = { url, name, tagline: tag };
        setLogoUrl(url);
        setAppName(name);
        setTagline(tag);
      })
      .catch(() => {});
  }, []);

  const showImage = logoUrl && !imgError;

  return (
    <div className={className}>
      {showImage ? (
        <img
          src={logoUrl}
          alt={appName}
          style={{
            height:     `${height}px`,
            maxWidth:   `${maxWidth}px`,
            objectFit:  "contain",
            display:    "block",
            filter:     "none",
          }}
          onError={() => setImgError(true)}
        />
      ) : (
        /* Text fallback — styled to look like a brand wordmark */
        <span className={textClassName}>{appName}</span>
      )}
      {showTagline && tagline && (
        <span className={taglineClassName}>{tagline}</span>
      )}
    </div>
  );
};
