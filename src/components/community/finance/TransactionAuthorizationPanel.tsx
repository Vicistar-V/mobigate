import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Wallet,
  ArrowLeft,
  Info
} from "lucide-react";
import { OfficerAuthorizationCard } from "./OfficerAuthorizationCard";
import { AuthorizationTimer } from "./AuthorizationTimer";
import {
  AuthorizationOfficer,
  OfficerRole,
  MOCK_OFFICER_PASSWORDS,
  validateAuthorizationRequirements,
} from "@/types/transactionAuthorization";
import { cn } from "@/lib/utils";
import { formatMobiAmount, formatLocalAmount, formatLocalFirst } from "@/lib/mobiCurrencyTranslation";

// Mock officer data for authorization - Finance module uses 4 officers
const AUTHORIZATION_OFFICERS: {
  role: OfficerRole;
  displayTitle: string;
  name: string;
  imageUrl?: string;
  isRequired: boolean;
}[] = [
  {
    role: "president",
    displayTitle: "President/Chairman",
    name: "Dr. Mark Anthony Onwudinjo",
    imageUrl: "https://i.pravatar.cc/150?u=president",
    isRequired: true, // MANDATORY for finance
  },
  {
    role: "treasurer",
    displayTitle: "Treasurer",
    name: "Mr. Chidi Adebayo",
    imageUrl: "https://i.pravatar.cc/150?u=treasurer",
    isRequired: true, // MANDATORY for finance
  },
  {
    role: "secretary",
    displayTitle: "Secretary",
    name: "Barr. Ngozi Okonkwo",
    imageUrl: "https://i.pravatar.cc/150?u=secretary",
    isRequired: false, // Alternative - pick one
  },
  {
    role: "financial_secretary",
    displayTitle: "Financial Secretary",
    name: "Mrs. Amara Diallo",
    imageUrl: "https://i.pravatar.cc/150?u=finsec",
    isRequired: false, // Alternative - pick one
  },
];

interface TransactionAuthorizationPanelProps {
  transactionType: "transfer" | "withdrawal" | "disbursement";
  amount: number;
  recipient?: string;
  description?: string;
  bankName?: string;
  accountNumber?: string;
  initiatorRole?: OfficerRole; // Track who initiated - affects signatory count
  onConfirm: () => void;
  onBack: () => void;
  onExpire?: () => void;
}

export function TransactionAuthorizationPanel({
  transactionType,
  amount,
  recipient,
  description,
  bankName,
  accountNumber,
  initiatorRole = "secretary", // Default to non-president initiator
  onConfirm,
  onBack,
  onExpire,
}: TransactionAuthorizationPanelProps) {
  // Determine if president initiated (affects signatory count)
  const isPresidentInitiator = initiatorRole === "president";
  const requiredSignatories = isPresidentInitiator ? 3 : 4;
  const [officers, setOfficers] = useState<AuthorizationOfficer[]>(
    AUTHORIZATION_OFFICERS.map((o) => ({
      role: o.role,
      name: o.name,
      imageUrl: o.imageUrl,
      isRequired: o.isRequired,
      status: "pending",
    }))
  );
  
  const [expiresAt] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 24);
    return date;
  });
  
  const [isExpired, setIsExpired] = useState(false);

  const handleAuthorize = (role: OfficerRole, password: string): boolean => {
    const correctPassword = MOCK_OFFICER_PASSWORDS[role];
    
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
  };

  const handleExpire = () => {
    setIsExpired(true);
    onExpire?.();
  };

  const validation = validateAuthorizationRequirements(officers);
  const authorizedCount = validation.authorizedCount;

  const getTransactionIcon = () => {
    switch (transactionType) {
      case "transfer":
        return <Send className="h-6 w-6 text-primary" />;
      case "withdrawal":
        return <Wallet className="h-6 w-6 text-primary" />;
      default:
        return <Send className="h-6 w-6 text-primary" />;
    }
  };

  const getTransactionTitle = () => {
    switch (transactionType) {
      case "transfer":
        return "Transfer Authorization";
      case "withdrawal":
        return "Withdrawal Authorization";
      case "disbursement":
        return "Disbursement Authorization";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-bold">{getTransactionTitle()}</h3>
        <p className="text-xs text-muted-foreground">
          Multi-signature authorization required
        </p>
      </div>

      {/* Timer */}
      <div className="flex justify-center">
        <AuthorizationTimer expiresAt={expiresAt} onExpire={handleExpire} />
      </div>

      {/* Transaction Summary */}
      <Card className="p-3 bg-muted/50">
        <div className="flex items-center gap-3 mb-2">
          {getTransactionIcon()}
          <span className="text-sm font-medium">Transaction Details</span>
        </div>
        <div className="space-y-1.5 text-sm">
          {recipient && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient</span>
              <span className="font-medium">{recipient}</span>
            </div>
          )}
          {bankName && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bank</span>
              <span className="font-medium">{bankName}</span>
            </div>
          )}
          {accountNumber && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account</span>
              <span className="font-medium">{accountNumber}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <div className="text-right">
              <span className="font-bold text-base">{formatLocalAmount(amount, "NGN")}</span>
              <p className="text-xs text-muted-foreground">
                ({formatMobiAmount(amount)})
              </p>
            </div>
          </div>
          {description && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description</span>
              <span className="font-medium text-right max-w-[150px] line-clamp-1">
                {description}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Authorization Requirements Info */}
      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg space-y-2">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>Requires:</strong> {requiredSignatories} authorizations including President AND (Treasurer OR Financial Secretary)
            </p>
            {!isPresidentInitiator && (
              <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded">
                ⚠️ President did not initiate - 4 signatories required
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Officer Authorization List - Single column for mobile optimization */}
      <ScrollArea className="h-[340px] pr-1">
        <div className="space-y-3">
          {AUTHORIZATION_OFFICERS.map((officer) => {
            const officerState = officers.find((o) => o.role === officer.role);
            return (
              <OfficerAuthorizationCard
                key={officer.role}
                role={officer.role}
                name={officer.name}
                imageUrl={officer.imageUrl}
                displayTitle={officer.displayTitle}
                isRequired={officer.isRequired}
                status={officerState?.status || "pending"}
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
          {authorizedCount}/{requiredSignatories} Authorized • {validation.message}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <Button
          onClick={onConfirm}
          disabled={!validation.isValid || isExpired}
          className="w-full h-12"
        >
          <CheckCircle2 className="h-5 w-5 mr-2" />
          Confirm {transactionType === "transfer" ? "Transfer" : "Withdrawal"}
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
