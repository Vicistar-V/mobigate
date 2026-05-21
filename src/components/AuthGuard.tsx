import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/LoginModal";
import { Loader2 } from "lucide-react";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const isForgotPassword = window.location.pathname === "/forgot-password";

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Mobigate...</p>
        </div>
      </div>
    );
  }

  if (isForgotPassword) return <>{children}</>;

  return (
    <>
      <div className={!isAuthenticated ? "pointer-events-none select-none opacity-30" : ""}>
        {children}
      </div>
      {!isAuthenticated && <LoginModal />}
    </>
  );
};
