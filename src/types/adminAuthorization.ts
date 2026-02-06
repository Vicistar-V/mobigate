// Extended Officer Roles for Multi-Signature Authorization System
export type ExtendedOfficerRole = 
  | "president"           // Admin 1 - PG/Chairman
  | "vice_president"      // Auxiliary/Spare tire
  | "secretary"           // Admin 2
  | "assistant_secretary" // Deputy Secretary
  | "treasurer"           // Keeper of money
  | "financial_secretary" // Financial records
  | "publicity_secretary" // PRO - Public Relations
  | "director_of_socials" // Social events coordination
  | "legal_adviser";      // Default auxiliary signatory

// Authorization Module Types - each has different requirements
export type AuthorizationModule = 
  | "members"     // Membership approvals/removals
  | "finances"    // Financial transactions  
  | "elections"   // Election management
  | "content"     // Content publishing
  | "leadership"  // Leadership changes
  | "settings";   // Community settings

// Officer availability status
export type OfficerAvailability = "available" | "unavailable" | "acting";

// Extended officer interface with substitution support
export interface ExtendedAuthorizationOfficer {
  role: ExtendedOfficerRole;
  name: string;
  imageUrl?: string;
  isRequired: boolean;         // Is this role mandatory for this module?
  isAlternative: boolean;      // Is this one of multiple alternatives (pick one)?
  status: "pending" | "authorized" | "rejected";
  authorizedAt?: Date;
  availability: OfficerAvailability;
  isActingFor?: ExtendedOfficerRole; // If this officer is standing in for another
}

// Module-specific authorization rules
export interface ModuleAuthorizationRules {
  module: AuthorizationModule;
  displayName: string;
  description: string;
  requiredSignatories: number;           // Base number required
  requiredRoles: ExtendedOfficerRole[];  // Must have these (mandatory)
  alternativeRoles: ExtendedOfficerRole[][]; // Pick one from each group
  auxiliaryRoles: ExtendedOfficerRole[]; // Can step in when needed
  canProceedWithoutPresident?: boolean;  // Some modules allow this
  requiresLegalAdviserIfActing: boolean; // Must include legal adviser if vice/assistant is acting
}

// Authorization session state
export interface ModuleAuthorizationSession {
  sessionId: string;
  module: AuthorizationModule;
  action: string;
  actionDescription: string;
  initiatedBy: ExtendedOfficerRole;
  initiatedAt: Date;
  expiresAt: Date;
  officers: ExtendedAuthorizationOfficer[];
  status: "pending" | "authorized" | "expired" | "cancelled";
  hasViceActing: boolean; // True if any vice/assistant is signing
  adjustedSignatoriesRequired: number; // May be higher if vice is acting
  completedAt?: Date;
}

// Mock passwords for demo
export const EXTENDED_MOCK_PASSWORDS: Record<ExtendedOfficerRole, string> = {
  president: "1234",
  vice_president: "1234",
  secretary: "1234",
  assistant_secretary: "1234",
  treasurer: "1234",
  financial_secretary: "1234",
  publicity_secretary: "1234",
  director_of_socials: "1234",
  legal_adviser: "1234",
};

// Display titles for each role
export const OFFICER_DISPLAY_TITLES: Record<ExtendedOfficerRole, string> = {
  president: "President/Chairman",
  vice_president: "Vice President",
  secretary: "Secretary",
  assistant_secretary: "Asst. Secretary",
  treasurer: "Treasurer",
  financial_secretary: "Financial Secretary",
  publicity_secretary: "PRO",
  director_of_socials: "Director of Socials",
  legal_adviser: "Legal Adviser",
};

// Admin hierarchy numbers
export const ADMIN_HIERARCHY: Record<ExtendedOfficerRole, number> = {
  president: 1,
  vice_president: 10,
  secretary: 2,
  assistant_secretary: 11,
  treasurer: 3,
  financial_secretary: 4,
  publicity_secretary: 5,
  director_of_socials: 6,
  legal_adviser: 7,
};

// Vice/Assistant role mappings - who can act for whom
export const SUBSTITUTION_MAP: Partial<Record<ExtendedOfficerRole, ExtendedOfficerRole>> = {
  president: "vice_president",
  secretary: "assistant_secretary",
  treasurer: "financial_secretary", // Special: Financial Secretary can act for Treasurer
};

// Get the primary role that a substitute is acting for
export const REVERSE_SUBSTITUTION_MAP: Partial<Record<ExtendedOfficerRole, ExtendedOfficerRole>> = {
  vice_president: "president",
  assistant_secretary: "secretary",
};

// Check if a role is a vice/assistant type
export function isSubstituteRole(role: ExtendedOfficerRole): boolean {
  return ["vice_president", "assistant_secretary"].includes(role);
}

// Module Authorization Rules Configuration
export const MODULE_AUTHORIZATION_RULES: Record<AuthorizationModule, ModuleAuthorizationRules> = {
  // MEMBERS: President + (Secretary OR PRO)
  members: {
    module: "members",
    displayName: "Membership",
    description: "Member approvals, removals, and status changes",
    requiredSignatories: 2,
    requiredRoles: ["president"],
    alternativeRoles: [["secretary", "publicity_secretary"]],
    auxiliaryRoles: ["vice_president", "assistant_secretary"],
    canProceedWithoutPresident: false,
    requiresLegalAdviserIfActing: true,
  },

  // FINANCES: President + Treasurer + (Secretary OR Financial Secretary)
  // If President not involved → 4 signatories including auxiliary
  finances: {
    module: "finances",
    displayName: "Financial Transactions",
    description: "Transfers, withdrawals, and disbursements",
    requiredSignatories: 3, // Or 4 if president not initiator
    requiredRoles: ["president", "treasurer"],
    alternativeRoles: [["secretary", "financial_secretary"]],
    auxiliaryRoles: ["legal_adviser", "vice_president"],
    canProceedWithoutPresident: true, // But requires 4 signatories
    requiresLegalAdviserIfActing: true,
  },

  // ELECTIONS: President + Secretary + (PRO, Fin. Sec, OR Legal Adviser)
  elections: {
    module: "elections",
    displayName: "Elections",
    description: "Election management and result announcements",
    requiredSignatories: 3,
    requiredRoles: ["president", "secretary"],
    alternativeRoles: [["publicity_secretary", "financial_secretary", "legal_adviser"]],
    auxiliaryRoles: ["vice_president", "assistant_secretary"],
    canProceedWithoutPresident: false,
    requiresLegalAdviserIfActing: true,
  },

  // CONTENT: Secretary + PRO (can push without PG if both available)
  // If only one available → must include President
  content: {
    module: "content",
    displayName: "Content Publishing",
    description: "News, events, and announcements",
    requiredSignatories: 2,
    requiredRoles: [], // Neither is absolutely mandatory if the other + president is there
    alternativeRoles: [], // Complex logic handled separately
    auxiliaryRoles: ["president", "assistant_secretary"],
    canProceedWithoutPresident: true, // If both Secretary AND PRO are available
    requiresLegalAdviserIfActing: false,
  },

  // LEADERSHIP: Same as Elections
  leadership: {
    module: "leadership",
    displayName: "Leadership",
    description: "Leadership changes and appointments",
    requiredSignatories: 3,
    requiredRoles: ["president", "secretary"],
    alternativeRoles: [["publicity_secretary", "director_of_socials"]],
    auxiliaryRoles: ["legal_adviser"],
    canProceedWithoutPresident: false,
    requiresLegalAdviserIfActing: true,
  },

  // SETTINGS: President + Secretary + Legal Adviser
  settings: {
    module: "settings",
    displayName: "Settings",
    description: "Community configuration and rules",
    requiredSignatories: 3,
    requiredRoles: ["president", "secretary", "legal_adviser"],
    alternativeRoles: [],
    auxiliaryRoles: ["vice_president", "assistant_secretary"],
    canProceedWithoutPresident: false,
    requiresLegalAdviserIfActing: true,
  },
};

// Determine the required number of signatories based on context
export function determineRequiredSignatories(
  module: AuthorizationModule,
  initiatorRole: ExtendedOfficerRole,
  hasViceActing: boolean,
  isPresidentAuthorized: boolean = false
): { count: number; reason: string } {
  const rules = MODULE_AUTHORIZATION_RULES[module];
  let required = rules.requiredSignatories;
  let reason = `Base requirement: ${required} signatories`;

  // FINANCE SPECIAL RULE: If president didn't initiate and isn't authorized, need 4
  if (module === "finances") {
    if (initiatorRole !== "president" && !isPresidentAuthorized) {
      required = 4;
      reason = "President not initiator - 4 signatories required (includes auxiliary)";
    } else if (isPresidentAuthorized) {
      required = 3;
      reason = "President involved - 3 signatories required";
    }
  }

  // ANY MODULE: If Vice/Assistant is acting, force 4 signatories + Legal Adviser
  if (hasViceActing && rules.requiresLegalAdviserIfActing) {
    required = Math.max(required, 4);
    reason = "Vice/Assistant acting - 4 signatories required (must include Legal Adviser)";
  }

  return { count: required, reason };
}

// Get officers required for a specific module
export function getModuleOfficers(
  module: AuthorizationModule,
  initiatorRole: ExtendedOfficerRole
): ExtendedOfficerRole[] {
  const rules = MODULE_AUTHORIZATION_RULES[module];
  const officers = new Set<ExtendedOfficerRole>();

  // Add required roles
  rules.requiredRoles.forEach(role => officers.add(role));

  // Add alternatives
  rules.alternativeRoles.forEach(group => {
    group.forEach(role => officers.add(role));
  });

  // Add auxiliaries for fallback
  rules.auxiliaryRoles.forEach(role => officers.add(role));

  // Special handling for content module
  if (module === "content") {
    officers.add("secretary");
    officers.add("publicity_secretary");
    officers.add("president");
    officers.add("assistant_secretary");
  }

  return Array.from(officers);
}

// Validate if authorization requirements are met
export function validateModuleAuthorization(
  module: AuthorizationModule,
  officers: ExtendedAuthorizationOfficer[],
  initiatorRole: ExtendedOfficerRole
): {
  isValid: boolean;
  message: string;
  authorizedCount: number;
  requiredCount: number;
  missingRequirements: string[];
} {
  const authorizedOfficers = officers.filter(o => o.status === "authorized");
  const authorizedRoles = new Set(authorizedOfficers.map(o => o.role));
  const authorizedCount = authorizedOfficers.length;
  const hasViceActing = authorizedOfficers.some(o => isSubstituteRole(o.role));
  const isPresidentAuthorized = authorizedRoles.has("president");
  
  const { count: requiredCount, reason } = determineRequiredSignatories(
    module,
    initiatorRole,
    hasViceActing,
    isPresidentAuthorized
  );
  
  const rules = MODULE_AUTHORIZATION_RULES[module];
  const missingRequirements: string[] = [];

  // Check minimum count
  if (authorizedCount < requiredCount) {
    missingRequirements.push(`Need ${requiredCount - authorizedCount} more authorization(s)`);
  }

  // Check required roles
  for (const role of rules.requiredRoles) {
    if (!authorizedRoles.has(role)) {
      // Check if substitute is authorized
      const substitute = SUBSTITUTION_MAP[role];
      if (!substitute || !authorizedRoles.has(substitute)) {
        missingRequirements.push(`${OFFICER_DISPLAY_TITLES[role]} required`);
      }
    }
  }

  // Check alternative roles (at least one from each group)
  for (const group of rules.alternativeRoles) {
    const hasOne = group.some(role => authorizedRoles.has(role));
    if (!hasOne) {
      const names = group.map(r => OFFICER_DISPLAY_TITLES[r]).join(" or ");
      missingRequirements.push(`${names} required`);
    }
  }

  // Special: If vice is acting, must include Legal Adviser
  if (hasViceActing && rules.requiresLegalAdviserIfActing) {
    if (!authorizedRoles.has("legal_adviser")) {
      missingRequirements.push("Legal Adviser required (Vice/Assistant is acting)");
    }
  }

  // Special content module logic
  if (module === "content") {
    const hasSecretary = authorizedRoles.has("secretary");
    const hasPRO = authorizedRoles.has("publicity_secretary");
    const hasPresident = authorizedRoles.has("president");

    // Rule: Secretary + PRO can push without president
    // Otherwise need president + one of them
    if (!(hasSecretary && hasPRO) && !(hasPresident && (hasSecretary || hasPRO))) {
      missingRequirements.push("Need Secretary + PRO, or President + one of them");
    }
  }

  const isValid = missingRequirements.length === 0 && authorizedCount >= requiredCount;
  const message = isValid 
    ? "All requirements satisfied" 
    : missingRequirements[0] || "Requirements not met";

  return {
    isValid,
    message,
    authorizedCount,
    requiredCount,
    missingRequirements,
  };
}

// Get a human-readable description of requirements
export function getRequirementsDescription(
  module: AuthorizationModule,
  hasViceActing: boolean = false
): string {
  const rules = MODULE_AUTHORIZATION_RULES[module];

  switch (module) {
    case "members":
      return "President + (Secretary or PRO)";
    case "finances":
      return hasViceActing 
        ? "4 signatories: President, Treasurer, (Secretary or Fin.Sec), + Legal Adviser"
        : "3 signatories: President + Treasurer + (Secretary or Fin.Sec)";
    case "elections":
      return "President + Secretary + (PRO, Fin. Sec, or Legal Adviser)";
    case "content":
      return "Secretary + PRO, or President + one of them";
    case "leadership":
      return "President + Secretary + (PRO or Director of Socials)";
    case "settings":
      return "President + Secretary + Legal Adviser";
    default:
      return `${rules.requiredSignatories} signatories required`;
  }
}
