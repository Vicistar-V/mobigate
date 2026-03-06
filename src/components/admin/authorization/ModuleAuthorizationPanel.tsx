import { useState, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Shield,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Clock,
  Loader2,
  Eye,
  EyeOff,
  UserCheck,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AuthorizationModule,
  ExtendedOfficerRole,
} from "@/types/adminAuthorization";
import { AuthorizationTimer } from "@/components/community/finance/AuthorizationTimer";
import { useToast } from "@/hooks/use-toast";

// ─── New 4-Admin Model ───
interface AdminEntry {
  id: string;
  label: string;
  subtitle: string;
  avatarUrl: string;
  isSuperAdmin: boolean;
  password: string; // mock
}

const ADMIN_ENTRIES: AdminEntry[] = [
  {
    id: "admin-1",
    label: "Admin-1",
    subtitle: "Super Admin",
    avatarUrl: "https://i.pravatar.cc/150?u=superadmin",
    isSuperAdmin: true,
    password: "1234",
  },
  {
    id: "admin-2",
    label: "Admin-2",
    subtitle: "Finance Admin",
    avatarUrl: "https://i.pravatar.cc/150?u=finadmin",
    isSuperAdmin: false,
    password: "1234",
  },
  {
    id: "admin-3",
    label: "Admin-3",
    subtitle: "Operations Admin",
    avatarUrl: "https://i.pravatar.cc/150?u=opsadmin",
    isSuperAdmin: false,
    password: "1234",
  },
  {
    id: "admin-4",
    label: "Admin-4",
    subtitle: "Compliance Admin",
    avatarUrl: "https://i.pravatar.cc/150?u=compadmin",
    isSuperAdmin: false,
    password: "1234",
  },
];

interface ModuleAuthorizationPanelProps {
  module: AuthorizationModule;
  actionTitle: string;
  actionDescription: string;
  actionDetails?: React.ReactNode;
  initiatorRole?: ExtendedOfficerRole;
  onConfirm: () => void;
  onBack: () => void;
  onExpire?: () => void;
}

export function ModuleAuthorizationPanel({
  module,
  actionTitle,
  actionDescription,
  actionDetails,
  onConfirm,
  onBack,
  onExpire,
}: ModuleAuthorizationPanelProps) {
  const { toast } = useToast();

  const [adminStatuses, setAdminStatuses] = useState<Record<string, "pending" | "authorized">>({
    "admin-1": "pending",
    "admin-2": "pending",
    "admin-3": "pending",
    "admin-4": "pending",
  });

  const [expiresAt] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 24);
    return date;
  });
  const [isExpired, setIsExpired] = useState(false);

  const handleExpire = useCallback(() => {
    setIsExpired(true);
    onExpire?.();
  }, [onExpire]);

  // Compute authorization state
  const admin1Authorized = adminStatuses["admin-1"] === "authorized";
  const otherAdminsAuthorized = ["admin-2", "admin-3", "admin-4"].filter(
    (id) => adminStatuses[id] === "authorized"
  ).length;
  const totalAuthorized = Object.values(adminStatuses).filter((s) => s === "authorized").length;

  // Admin-1 solo OR all 3 of Admin-2,3,4
  const isValid = admin1Authorized || otherAdminsAuthorized === 3;
  const requiredCount = admin1Authorized ? 1 : 3;

  const statusMessage = isValid
    ? "Authorization requirements met"
    : admin1Authorized
    ? "Authorization requirements met"
    : otherAdminsAuthorized > 0
    ? `${3 - otherAdminsAuthorized} more admin(s) needed`
    : "Admin-1 can authorize alone, or Admins 2, 3 & 4 together";

  const handleAuthorize = useCallback(
    (adminId: string, password: string): boolean => {
      const admin = ADMIN_ENTRIES.find((a) => a.id === adminId);
      if (!admin) return false;
      if (password === admin.password) {
        setAdminStatuses((prev) => ({ ...prev, [adminId]: "authorized" }));
        return true;
      }
      return false;
    },
    []
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-7 w-7 text-primary" />
          </div>
        </div>
        <h3 className="text-base font-bold leading-tight">Admin Authorization</h3>
        <p className="text-sm text-muted-foreground leading-snug px-2">
          <span className="font-semibold text-foreground">Admin-1</span> can authorize alone, or{" "}
          <span className="font-semibold text-foreground">Admins 2, 3 & 4</span> together
        </p>
      </div>

      {/* Timer */}
      <div className="flex justify-center">
        <AuthorizationTimer expiresAt={expiresAt} onExpire={handleExpire} />
      </div>

      {/* Action Details */}
      {actionDetails && (
        <Card className="p-3 bg-muted/30 border-muted">{actionDetails}</Card>
      )}

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {ADMIN_ENTRIES.map((admin) => (
              <div
                key={admin.id}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  admin.id === "admin-1" ? "w-12" : "w-8",
                  adminStatuses[admin.id] === "authorized"
                    ? "bg-emerald-500"
                    : "bg-muted-foreground/20"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-muted-foreground">
            {totalAuthorized}/4 verified
          </span>
        </div>
      </div>

      {/* Admin Cards */}
      <div className="space-y-2.5">
        {ADMIN_ENTRIES.map((admin) => (
          <AdminCard
            key={admin.id}
            admin={admin}
            status={adminStatuses[admin.id]}
            onAuthorize={handleAuthorize}
            disabled={isExpired || isValid}
          />
        ))}
      </div>

      {/* Authorization Status Bar */}
      <div
        className={cn(
          "flex items-center gap-2.5 px-4 py-3 rounded-xl",
          isValid
            ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
            : "bg-muted/50 border border-border"
        )}
      >
        {isValid ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
        ) : (
          <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <span
            className={cn(
              "text-sm font-semibold",
              isValid
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-muted-foreground"
            )}
          >
            {isValid ? "✅ Authorized" : `${totalAuthorized} Admin${totalAuthorized !== 1 ? "s" : ""} Verified`}
          </span>
          <p className="text-xs text-muted-foreground line-clamp-1">{statusMessage}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <Button
          onClick={onConfirm}
          disabled={!isValid || isExpired}
          className="w-full h-12 text-base font-semibold"
        >
          <Lock className="h-5 w-5 mr-2" />
          Confirm Authorization
        </Button>
        <Button variant="outline" onClick={onBack} className="w-full h-11">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}

// ─── Individual Admin Card ───
function AdminCard({
  admin,
  status,
  onAuthorize,
  disabled,
}: {
  admin: AdminEntry;
  status: "pending" | "authorized";
  onAuthorize: (id: string, password: string) => boolean;
  disabled: boolean;
}) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const { toast } = useToast();

  const isAuthorized = status === "authorized";

  const handleVerify = async () => {
    if (!password.trim()) {
      toast({
        title: "Password Required",
        description: `Enter ${admin.label} password`,
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const ok = onAuthorize(admin.id, password);
    if (!ok) {
      setShake(true);
      toast({
        title: "Wrong Password",
        description: "Authorization rejected. Try again.",
        variant: "destructive",
      });
      setTimeout(() => setShake(false), 600);
      setPassword("");
    } else {
      toast({
        title: `✅ ${admin.label} Verified`,
        description: `${admin.subtitle} authorization confirmed`,
      });
    }
    setIsLoading(false);
  };

  return (
    <Card
      className={cn(
        "p-4 transition-all duration-200",
        isAuthorized && "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20",
        shake && "animate-shake"
      )}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 shrink-0">
            <AvatarImage src={admin.avatarUrl} alt={admin.label} />
            <AvatarFallback className="text-sm font-bold">
              {admin.label.split("-")[1]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-base font-bold">{admin.label}</p>
              {admin.isSuperAdmin && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-5 border-amber-400 text-amber-700 bg-amber-50 dark:bg-amber-950/30 shrink-0 whitespace-nowrap"
                >
                  <Crown className="h-2.5 w-2.5 mr-0.5" />
                  SUPER
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{admin.subtitle}</p>
          </div>

          {isAuthorized ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
          ) : (
            <Lock className="h-6 w-6 text-muted-foreground/40 shrink-0" />
          )}
        </div>

        {/* Auth form or status */}
        {isAuthorized ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
            <UserCheck className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Verified ✓
            </span>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={`Enter ${admin.label} password`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={disabled || isLoading}
                className="h-11 pr-10 text-base"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleVerify();
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground touch-manipulation"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button
              onClick={handleVerify}
              disabled={disabled || isLoading || !password.trim()}
              className="h-11 px-5 text-sm font-semibold shrink-0"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
