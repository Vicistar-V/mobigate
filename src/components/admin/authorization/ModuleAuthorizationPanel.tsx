import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AuthorizationModule,
  ExtendedOfficerRole,
  ExtendedAuthorizationOfficer,
  EXTENDED_MOCK_PASSWORDS,
  OFFICER_DISPLAY_TITLES,
  validateModuleAuthorization,
  determineRequiredSignatories,
  isSubstituteRole,
  MODULE_AUTHORIZATION_RULES,
} from "@/types/adminAuthorization";
import { COMMUNITY_OFFICERS, getOfficersForModule } from "@/data/communityOfficersData";
import { AuthorizationTimer } from "@/components/community/finance/AuthorizationTimer";
import { AuthorizationRulesInfo } from "./AuthorizationRulesInfo";
import { ModuleOfficerCard } from "./ModuleOfficerCard";

interface ModuleAuthorizationPanelProps {
  module: AuthorizationModule;
  actionTitle: string;
  actionDescription: string;
  actionDetails?: React.ReactNode;
  initiatorRole: ExtendedOfficerRole;
  onConfirm: () => void;
  onBack: () => void;
  onExpire?: () => void;
}

export function ModuleAuthorizationPanel({
  module,
  actionTitle,
  actionDescription,
  actionDetails,
  initiatorRole,
  onConfirm,
  onBack,
  onExpire,
}: ModuleAuthorizationPanelProps) {
  // Get officers relevant to this module
  const moduleOfficers = getOfficersForModule(module, true);
  const rules = MODULE_AUTHORIZATION_RULES[module];

  // Initialize officers state
  const [officers, setOfficers] = useState<ExtendedAuthorizationOfficer[]>(
    moduleOfficers.map((o) => ({
      role: o.role,
      name: o.name,
      imageUrl: o.imageUrl,
      isRequired: rules.requiredRoles.includes(o.role),
      isAlternative: rules.alternativeRoles.some(group => group.includes(o.role)),
      status: "pending",
      availability: o.availability,
    }))
  );

  // 24-hour expiration
  const [expiresAt] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 24);
    return date;
  });

  const [isExpired, setIsExpired] = useState(false);

  // Check if any vice/assistant has authorized
  const hasViceActing = officers
    .filter(o => o.status === "authorized")
    .some(o => isSubstituteRole(o.role));

  // Authorization handler
  const handleAuthorize = useCallback((role: ExtendedOfficerRole, password: string): boolean => {
    const correctPassword = EXTENDED_MOCK_PASSWORDS[role];
    
    if (password === correctPassword) {
      setOfficers((prev) =>
        prev.map((o) =>
          o.role === role
            ? { ...o, status: "authorized", authorizedAt: new Date() }
            : o
        )
      );
      return true;
    }
    return false;
  }, []);

  // Expiration handler
  const handleExpire = useCallback(() => {
    setIsExpired(true);
    onExpire?.();
  }, [onExpire]);

  // Validation
  const validation = validateModuleAuthorization(module, officers, initiatorRole);
  const isPresidentAuthorized = officers.some(
    o => o.role === "president" && o.status === "authorized"
  );
  const { count: requiredCount } = determineRequiredSignatories(
    module,
    initiatorRole,
    hasViceActing,
    isPresidentAuthorized
  );

  // Get module icon based on type
  const getModuleIcon = () => {
    return <Shield className="h-8 w-8 text-primary" />;
  };

  // Determine which officers should be shown as required/optional
  const getOfficerDisplayProps = (officer: ExtendedAuthorizationOfficer) => {
    const isRequired = rules.requiredRoles.includes(officer.role);
    const isAlternative = rules.alternativeRoles.some(group => group.includes(officer.role));
    const isAuxiliary = rules.auxiliaryRoles.includes(officer.role);

    // Special handling: if vice is acting, legal adviser becomes required
    const isLegalAdviserRequired = 
      officer.role === "legal_adviser" && 
      hasViceActing && 
      rules.requiresLegalAdviserIfActing;

    return {
      isRequired: isRequired || isLegalAdviserRequired,
      isAlternative,
      isAuxiliary: isAuxiliary && !isLegalAdviserRequired,
    };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            {getModuleIcon()}
          </div>
        </div>
        <h3 className="text-lg font-bold">{actionTitle}</h3>
        <p className="text-xs text-muted-foreground">
          {actionDescription}
        </p>
      </div>

      {/* Timer */}
      <div className="flex justify-center">
        <AuthorizationTimer expiresAt={expiresAt} onExpire={handleExpire} />
      </div>

      {/* Action Details (if provided) */}
      {actionDetails && (
        <Card className="p-3 bg-muted/50">
          {actionDetails}
        </Card>
      )}

      {/* Authorization Requirements Info */}
      <AuthorizationRulesInfo
        module={module}
        initiatorRole={initiatorRole}
        hasViceActing={hasViceActing}
        authorizedCount={validation.authorizedCount}
        requiredCount={requiredCount}
        isValid={validation.isValid}
      />

      {/* Officer Authorization Grid */}
      <ScrollArea className="h-[320px] pr-1">
        <div className="grid grid-cols-2 gap-3">
          {officers.map((officer) => {
            const displayProps = getOfficerDisplayProps(officer);
            return (
              <ModuleOfficerCard
                key={officer.role}
                role={officer.role}
                name={officer.name}
                imageUrl={officer.imageUrl}
                displayTitle={OFFICER_DISPLAY_TITLES[officer.role]}
                isRequired={displayProps.isRequired}
                isAlternative={displayProps.isAlternative}
                isAuxiliary={displayProps.isAuxiliary}
                status={officer.status}
                onAuthorize={handleAuthorize}
                disabled={isExpired}
              />
            );
          })}
        </div>
      </ScrollArea>

      {/* Authorization Status */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border",
          validation.isValid
            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
            : "bg-muted border-border"
        )}
      >
        {validation.isValid ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        )}
        <span
          className={cn(
            "text-sm font-medium",
            validation.isValid
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-muted-foreground"
          )}
        >
          {validation.authorizedCount}/{requiredCount} Authorized • {validation.message}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <Button
          onClick={onConfirm}
          disabled={!validation.isValid || isExpired}
          className="w-full h-12"
        >
          <Lock className="h-5 w-5 mr-2" />
          Confirm Authorization
        </Button>
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full h-11"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}
