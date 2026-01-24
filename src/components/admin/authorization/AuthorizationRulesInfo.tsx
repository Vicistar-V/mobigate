import { AlertCircle, Info, Shield, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AuthorizationModule,
  ExtendedOfficerRole,
  getRequirementsDescription,
  OFFICER_DISPLAY_TITLES,
  MODULE_AUTHORIZATION_RULES,
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
  const rules = MODULE_AUTHORIZATION_RULES[module];
  const requirementsText = getRequirementsDescription(module, hasViceActing);

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
      {/* Header */}
      <div className="flex items-start gap-2">
        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
            Authorization Requirements
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
            <strong>Requires:</strong> {requirementsText}
          </p>
        </div>
      </div>

      {/* Required Officers */}
      <div className="flex flex-wrap gap-1.5">
        {rules.requiredRoles.map((role) => (
          <Badge
            key={role}
            variant="outline"
            className="text-[10px] px-1.5 py-0.5 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
          >
            {OFFICER_DISPLAY_TITLES[role]}
          </Badge>
        ))}
        {rules.alternativeRoles.map((group, idx) => (
          <Badge
            key={`alt-${idx}`}
            variant="secondary"
            className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
          >
            {group.map(r => OFFICER_DISPLAY_TITLES[r]).join(" / ")}
          </Badge>
        ))}
      </div>

      {/* Vice Acting Warning */}
      {hasViceActing && rules.requiresLegalAdviserIfActing && (
        <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-1.5 rounded">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          <span>Vice/Assistant acting - Legal Adviser required (4 signatories)</span>
        </div>
      )}

      {/* Special Notes by Module */}
      {module === "finances" && initiatorRole !== "president" && (
        <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-1.5 rounded">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          <span>President did not initiate - 4 signatories required</span>
        </div>
      )}

      {module === "content" && (
        <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
          <Users className="h-3 w-3 flex-shrink-0" />
          <span>No single person can publish content alone</span>
        </div>
      )}
    </div>
  );
}
