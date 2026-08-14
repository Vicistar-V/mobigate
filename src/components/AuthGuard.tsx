import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

// Pages that don't require authentication and shouldn't redirect to /login
const PUBLIC_PATHS = ["/login", "/forgot-password"];

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const isPublicPath = PUBLIC_PATHS.includes(window.location.pathname);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicPath) {
      navigate("/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, isPublicPath, navigate]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Mobiface...</p>
        </div>
      </div>
    );
  }

  // Public pages (including /login itself) always render their own content
  if (isPublicPath) {
    return <>{children}</>;
  }

  // Not authenticated and not yet redirected — render nothing rather than a
  // flash of protected content while the redirect above takes effect
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
