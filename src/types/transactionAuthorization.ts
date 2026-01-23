export type OfficerRole = "president" | "secretary" | "treasurer" | "financial_secretary";

export interface AuthorizationOfficer {
  role: OfficerRole;
  name: string;
  imageUrl?: string;
  isRequired: boolean;
  status: "pending" | "authorized" | "rejected";
  authorizedAt?: Date;
}

export interface TransactionAuthorization {
  transactionId: string;
  transactionType: "transfer" | "withdrawal" | "disbursement";
  amount: number;
  description: string;
  recipient?: string;
  initiatedAt: Date;
  expiresAt: Date; // initiatedAt + 24 hours
  officers: AuthorizationOfficer[];
  status: "pending" | "authorized" | "expired" | "cancelled";
  completedAt?: Date;
}

// Mock passwords for demo (in real app, this would be validated server-side)
export const MOCK_OFFICER_PASSWORDS: Record<OfficerRole, string> = {
  president: "1234",
  secretary: "1234",
  treasurer: "1234",
  financial_secretary: "1234",
};

// Authorization requirements
export const AUTHORIZATION_REQUIREMENTS = {
  minAuthorizations: 3,
  requiredRoles: ["president"] as OfficerRole[],
  alternativeRoles: ["treasurer", "financial_secretary"] as OfficerRole[],
};

export function validateAuthorizationRequirements(officers: AuthorizationOfficer[]): {
  isValid: boolean;
  message: string;
  authorizedCount: number;
} {
  const authorizedOfficers = officers.filter((o) => o.status === "authorized");
  const authorizedCount = authorizedOfficers.length;
  
  // Check minimum count
  if (authorizedCount < AUTHORIZATION_REQUIREMENTS.minAuthorizations) {
    return {
      isValid: false,
      message: `Need ${AUTHORIZATION_REQUIREMENTS.minAuthorizations - authorizedCount} more authorization(s)`,
      authorizedCount,
    };
  }
  
  // Check required roles (President)
  const hasPresident = authorizedOfficers.some((o) => o.role === "president");
  if (!hasPresident) {
    return {
      isValid: false,
      message: "President authorization required",
      authorizedCount,
    };
  }
  
  // Check alternative roles (Treasurer OR Financial Secretary)
  const hasTreasurerOrFinSec = authorizedOfficers.some(
    (o) => o.role === "treasurer" || o.role === "financial_secretary"
  );
  if (!hasTreasurerOrFinSec) {
    return {
      isValid: false,
      message: "Treasurer or Financial Secretary required",
      authorizedCount,
    };
  }
  
  return {
    isValid: true,
    message: "All requirements satisfied",
    authorizedCount,
  };
}
