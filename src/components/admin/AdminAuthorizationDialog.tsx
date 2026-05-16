import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, ShieldBan, Trash2, Crown, Lock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminAction = "suspend" | "ban" | "deactivate" | "reactivate";

export interface AdminAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: AdminAction;
  targetName: string;
  onConfirm: (payload: { months?: number; authorisers: string[] }) => void;
}

interface AdminOption {
  id: string;
  name: string;
  role: string;
  isSuperAdmin?: boolean;
}

const ADMIN_POOL: AdminOption[] = [
  { id: "sa", name: "Adaeze Okonkwo", role: "Super Admin", isSuperAdmin: true },
  { id: "a1", name: "Amaka Eze", role: "Mobigate Admin" },
  { id: "a2", name: "Tunde Bakare", role: "Mobigate Admin" },
  { id: "a3", name: "Ngozi Okafor", role: "Mobigate Admin" },
  { id: "a4", name: "Chinedu Obi", role: "Mobigate Admin" },
  { id: "a5", name: "Yusuf Ibrahim", role: "Mobigate Admin" },
];

const ACTION_META: Record<
  AdminAction,
  {
    title: string;
    description: string;
    icon: typeof Shield;
    color: string;
    badge: string;
    confirmLabel: string;
    needsDuration: boolean;
  }
> = {
  suspend: {
    title: "Suspend User",
    description:
      "Temporarily restrict this user's account access. Requires admin authorisation.",
    icon: ShieldAlert,
    color: "text-amber-600",
    badge: "border-amber-300 bg-amber-50 text-amber-700",
    confirmLabel: "Authorise Suspension",
    needsDuration: true,
  },
  ban: {
    title: "Ban User",
    description:
      "Block this user's account access for a defined duration. Requires admin authorisation.",
    icon: ShieldBan,
    color: "text-red-600",
    badge: "border-red-300 bg-red-50 text-red-700",
    confirmLabel: "Authorise Ban",
    needsDuration: true,
  },
  deactivate: {
    title: "Deactivate User",
    description:
      "Permanently deactivate this account. Requires the Super Admin alone, or 3 other Admins in absence of the Super Admin.",
    icon: Trash2,
    color: "text-red-700",
    badge: "border-red-400 bg-red-100 text-red-800",
    confirmLabel: "Authorise Deactivation",
    needsDuration: false,
  },
  reactivate: {
    title: "Reactivate User",
    description: "Restore this user's account access.",
    icon: Shield,
    color: "text-emerald-600",
    badge: "border-emerald-300 bg-emerald-50 text-emerald-700",
    confirmLabel: "Authorise Reactivation",
    needsDuration: false,
  },
};

const DURATION_OPTIONS = [1, 3, 6, 12, 24];

export function AdminAuthorizationDialog({
  open,
  onOpenChange,
  action,
  targetName,
  onConfirm,
}: AdminAuthDialogProps) {
  const meta = ACTION_META[action];
  const Icon = meta.icon;
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [months, setMonths] = useState<number>(3);

  const superAdmin = ADMIN_POOL.find((a) => a.isSuperAdmin)!;
  const otherAdmins = ADMIN_POOL.filter((a) => !a.isSuperAdmin);

  const hasSuperAdmin = selectedAdmins.includes(superAdmin.id);
  const otherCount = selectedAdmins.filter((id) => id !== superAdmin.id).length;

  const isAuthorised = useMemo(() => {
    if (hasSuperAdmin) return true;
    return otherCount >= 3;
  }, [hasSuperAdmin, otherCount]);

  const toggleAdmin = (id: string) => {
    setSelectedAdmins((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const reset = () => {
    setSelectedAdmins([]);
    setMonths(3);
  };

  const handleConfirm = () => {
    if (!isAuthorised) return;
    onConfirm({
      months: meta.needsDuration ? months : undefined,
      authorisers: selectedAdmins
        .map((id) => ADMIN_POOL.find((a) => a.id === id)?.name || "")
        .filter(Boolean),
    });
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[92dvh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-lg bg-muted", meta.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base">{meta.title}</DialogTitle>
              <p className="text-xs text-muted-foreground truncate">
                Target: <span className="font-semibold text-foreground">{targetName}</span>
              </p>
            </div>
          </div>
          <DialogDescription className="text-xs pt-2">{meta.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {meta.needsDuration && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider">
                Duration (Months)
              </Label>
              <div className="flex gap-1.5 flex-wrap">
                {DURATION_OPTIONS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMonths(m)}
                    className={cn(
                      "h-9 min-w-[44px] px-3 rounded-full border text-xs font-semibold touch-manipulation transition-colors",
                      months === m
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:bg-muted"
                    )}
                  >
                    {m} {m === 1 ? "mo" : "mos"}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="custom-months" className="text-xs text-muted-foreground">
                  Custom:
                </Label>
                <Input
                  id="custom-months"
                  type="number"
                  min={1}
                  max={120}
                  value={months}
                  onChange={(e) => setMonths(Math.max(1, parseInt(e.target.value) || 1))}
                  onBlur={(e) => {
                    const v = parseInt(e.target.value) || 1;
                    setMonths(Math.min(120, Math.max(1, v)));
                  }}
                  className="h-8 w-20 text-xs"
                />
                <span className="text-xs text-muted-foreground">months</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wider">
                Admin Authorisation
              </Label>
              <Badge variant="outline" className={cn("text-[10px]", meta.badge)}>
                {hasSuperAdmin
                  ? "Super Admin authorises"
                  : `${otherCount}/3 admins required`}
              </Badge>
            </div>

            <button
              type="button"
              onClick={() => toggleAdmin(superAdmin.id)}
              className={cn(
                "w-full flex items-center gap-2 p-3 rounded-lg border-2 text-left transition-colors touch-manipulation",
                hasSuperAdmin
                  ? "border-amber-400 bg-amber-50"
                  : "border-border bg-card hover:bg-muted/60"
              )}
            >
              <Checkbox checked={hasSuperAdmin} className="pointer-events-none" />
              <Crown className="h-4 w-4 text-amber-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{superAdmin.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  Super Admin · authorises single-handedly
                </p>
              </div>
            </button>

            <div className="space-y-1.5">
              <p className="text-[10px] text-muted-foreground">
                Or select 3 other Admins (in absence of Super Admin):
              </p>
              {otherAdmins.map((a) => {
                const checked = selectedAdmins.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleAdmin(a.id)}
                    disabled={hasSuperAdmin}
                    className={cn(
                      "w-full flex items-center gap-2 p-2.5 rounded-lg border text-left transition-colors touch-manipulation",
                      checked
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:bg-muted/60",
                      hasSuperAdmin && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Checkbox checked={checked} className="pointer-events-none" />
                    <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{a.name}</p>
                      <p className="text-[10px] text-muted-foreground">{a.role}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={cn(
              "flex items-start gap-2 p-2.5 rounded-lg border text-xs",
              isAuthorised
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-amber-300 bg-amber-50 text-amber-800"
            )}
          >
            {isAuthorised ? (
              <Lock className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            )}
            <p className="leading-tight">
              {isAuthorised
                ? hasSuperAdmin
                  ? `Authorised by Super Admin ${superAdmin.name}.`
                  : `Authorised by ${otherCount} admins.`
                : `Awaiting authorisation — select Super Admin or ${
                    3 - otherCount
                  } more admin${3 - otherCount === 1 ? "" : "s"}.`}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="flex-1"
            disabled={!isAuthorised}
            onClick={handleConfirm}
          >
            {meta.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
