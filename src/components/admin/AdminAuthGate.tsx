import { useState, useMemo, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, UserCheck, CheckCircle, AlertTriangle, ShieldCheck, Info } from "lucide-react";

interface AdminAuthGateProps {
  children: ReactNode;
  tabLabel: string;
}

const adminSlots: { key: "admin1" | "admin2" | "admin3" | "admin4"; label: string; role: string; isSuperAdmin: boolean }[] = [
  { key: "admin1", label: "Admin-1", role: "Super Admin", isSuperAdmin: true },
  { key: "admin2", label: "Admin-2", role: "Finance Admin", isSuperAdmin: false },
  { key: "admin3", label: "Admin-3", role: "Operations Admin", isSuperAdmin: false },
  { key: "admin4", label: "Admin-4", role: "Compliance Admin", isSuperAdmin: false },
];

export function AdminAuthGate({ children, tabLabel }: AdminAuthGateProps) {
  const [adminPasswords, setAdminPasswords] = useState({ admin1: "", admin2: "", admin3: "", admin4: "" });
  const [adminVerified, setAdminVerified] = useState({ admin1: false, admin2: false, admin3: false, admin4: false });
  const [authError, setAuthError] = useState("");

  const admin1Solo = adminVerified.admin1;
  const othersAllVerified = adminVerified.admin2 && adminVerified.admin3 && adminVerified.admin4;
  const verifiedCount = useMemo(
    () => [adminVerified.admin1, adminVerified.admin2, adminVerified.admin3, adminVerified.admin4].filter(Boolean).length,
    [adminVerified]
  );
  const isAuthPassed = admin1Solo || othersAllVerified;

  const handleVerifyAdmin = (key: "admin1" | "admin2" | "admin3" | "admin4") => {
    const pw = adminPasswords[key];
    if (!pw.trim()) return;
    setAdminVerified((prev) => ({ ...prev, [key]: true }));
    setAuthError("");
  };

  const handleProceed = () => {
    if (!isAuthPassed) {
      setAuthError("Admin-1 (Super Admin) can authorize alone, or Admins 2, 3 & 4 must all authorize together.");
    }
  };

  if (isAuthPassed) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div className="text-center py-3">
        <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
          <Lock className="h-8 w-8 text-amber-600" />
        </div>
        <p className="text-lg font-bold text-foreground">Admin Authorization Required</p>
        <p className="text-sm text-muted-foreground mt-1">
          Access to <strong>{tabLabel}</strong> requires admin verification.
          <br />
          <strong>Admin-1</strong> can authorize alone, or <strong>Admins 2, 3 & 4</strong> together.
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1">
          {adminSlots.map((admin) => (
            <div
              key={admin.key}
              className={`h-2 rounded-full transition-colors ${
                admin.isSuperAdmin ? "w-12" : "w-8"
              } ${adminVerified[admin.key] ? "bg-emerald-500" : "bg-muted"}`}
            />
          ))}
          <span className="text-xs font-semibold text-muted-foreground ml-2">{verifiedCount}/4 verified</span>
        </div>
        {admin1Solo && (
          <p className="text-xs text-emerald-600 font-medium">✅ Super Admin authorized — proceed when ready</p>
        )}
      </div>

      {/* Admin password fields */}
      <div className="space-y-3">
        {adminSlots.map(({ key, label, role }) => (
          <Card
            key={key}
            className={`border transition-colors ${
              adminVerified[key]
                ? "border-emerald-300 bg-emerald-500/5"
                : "border-border"
            }`}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {adminVerified[key] ? (
                    <UserCheck className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
                {adminVerified[key] && (
                  <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-300 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              {!adminVerified[key] && (
                <div className="flex gap-2 mt-2">
                  <Input
                    type="password"
                    placeholder={`Enter ${label} password`}
                    value={adminPasswords[key]}
                    onChange={(e) =>
                      setAdminPasswords((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="h-10 text-sm touch-manipulation"
                    onKeyDown={(e) => { if (e.key === "Enter") handleVerifyAdmin(key); }}
                  />
                  <Button
                    size="sm"
                    className="h-10 px-4 shrink-0 touch-manipulation active:scale-[0.97]"
                    disabled={!adminPasswords[key].trim()}
                    onClick={() => handleVerifyAdmin(key)}
                  >
                    Verify
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-3 flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700/80 leading-relaxed">
            The <strong>{tabLabel}</strong> tab contains sensitive platform configurations.
            <strong> Admin-1 (Super Admin)</strong> can authorize alone, or <strong>Admins 2, 3 & 4</strong> must all verify together.
          </p>
        </CardContent>
      </Card>

      {authError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
          <p className="text-xs text-red-600 font-medium">{authError}</p>
        </div>
      )}

      <Button
        onClick={handleProceed}
        disabled={!isAuthPassed}
        className={`w-full h-12 text-sm font-semibold touch-manipulation active:scale-[0.97] ${
          isAuthPassed ? "bg-emerald-600 hover:bg-emerald-700" : ""
        }`}
      >
        <ShieldCheck className="h-4 w-4 mr-2" />
        {isAuthPassed ? `Access ${tabLabel}` : `${verifiedCount}/4 Admins Verified`}
      </Button>
    </div>
  );
}
