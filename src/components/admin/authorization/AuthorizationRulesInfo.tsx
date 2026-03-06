import { Info, Shield, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AuthorizationModule,
  ExtendedOfficerRole,
} from "@/types/adminAuthorization";

interface AuthorizationRulesInfoProps {
  module: AuthorizationModule;
  initiatorRole: ExtendedOfficerRole;
  hasViceActing?: boolean;
  authorizedCount: number;
  requiredCount: number;
  isValid: boolean;
  compact?: boolean;
}

export function AuthorizationRulesInfo({
  module,
  initiatorRole,
  hasViceActing = false,
  authorizedCount,
  requiredCount,
  isValid,
  compact = false,
}: AuthorizationRulesInfoProps) {
  const requirementsText = "Admin-1 (Super Admin) alone, or Admins 2, 3 & 4 together";

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Shield className="h-3 w-3" />
        <span>{requirementsText}</span>
      </div>
    );
  }

  return (
    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg space-y-2">
      <div className="flex items-start gap-2">
        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
            Authorization Requirements
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
            <span className="font-semibold">Option 1:</span> Admin-1 (Super Admin) authorizes alone
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
            <span className="font-semibold">Option 2:</span> All 3 of Admin-2, Admin-3 & Admin-4 authorize together
          </p>
        </div>
      </div>
    </div>
  );
}
