import { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/LoginModal";
import { Loader2 } from "lucide-react";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't show LoginModal on the forgot-password page
  const isForgotPassword = window.location.pathname === "/forgot-password";

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

  // On forgot-password page, just render children without auth check
  if (isForgotPassword) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className={!isAuthenticated ? "select-none opacity-30" : ""}
        aria-hidden={!isAuthenticated}
      >
        {children}
      </div>
      {!isAuthenticated && <LoginModal />}
    </>
  );
};