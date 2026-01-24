import { ExtendedOfficerRole, OfficerAvailability } from "@/types/adminAuthorization";

// Complete officer data for all community positions
export interface CommunityOfficer {
  id: string;
  role: ExtendedOfficerRole;
  name: string;
  email: string;
  phone: string;
  imageUrl?: string;
  availability: OfficerAvailability;
  isActingFor?: ExtendedOfficerRole;
  tenureStart: Date;
  tenureEnd?: Date;
}

// Mock data for all 10 officer positions
export const COMMUNITY_OFFICERS: CommunityOfficer[] = [
  {
    id: "off-001",
    role: "president",
    name: "Dr. Mark Anthony Onwudinjo",
    email: "president@community.org",
    phone: "+234 801 234 5678",
    imageUrl: "https://i.pravatar.cc/150?u=president",
    availability: "available",
    tenureStart: new Date("2024-01-01"),
    tenureEnd: new Date("2026-12-31"),
  },
  {
    id: "off-002",
    role: "vice_president",
    name: "Chief Emmanuel Okwuosa",
    email: "vp@community.org",
    phone: "+234 802 345 6789",
    imageUrl: "https://i.pravatar.cc/150?u=vicepresident",
    availability: "available",
    tenureStart: new Date("2024-01-01"),
    tenureEnd: new Date("2026-12-31"),
  },
  {
    id: "off-003",
    role: "secretary",
    name: "Barr. Ngozi Okonkwo",
    email: "secretary@community.org",
    phone: "+234 803 456 7890",
    imageUrl: "https://i.pravatar.cc/150?u=secretary",
    availability: "available",
    tenureStart: new Date("2024-01-01"),
    tenureEnd: new Date("2026-12-31"),
  },
  {
    id: "off-004",
    role: "assistant_secretary",
    name: "Mr. Ikechukwu Eze",
    email: "asstsecretary@community.org",
    phone: "+234 804 567 8901",
    imageUrl: "https://i.pravatar.cc/150?u=asstsecretary",
    availability: "available",
    tenureStart: new Date("2024-01-01"),
    tenureEnd: new Date("2026-12-31"),
  },
  {
    id: "off-005",
    role: "treasurer",
    name: "Mr. Chidi Adebayo",
    email: "treasurer@community.org",
    phone: "+234 805 678 9012",
    imageUrl: "https://i.pravatar.cc/150?u=treasurer",
    availability: "available",
    tenureStart: new Date("2024-01-01"),
    tenureEnd: new Date("2026-12-31"),
  },
  {
    id: "off-006",
    role: "financial_secretary",
    name: "Mrs. Amara Diallo",
    email: "finsec@community.org",
    phone: "+234 806 789 0123",
    imageUrl: "https://i.pravatar.cc/150?u=finsec",
    availability: "available",
    tenureStart: new Date("2024-01-01"),
    tenureEnd: new Date("2026-12-31"),
  },
  {
    id: "off-007",
    role: "publicity_secretary",
    name: "Ms. Adaeze Nnamdi",
    email: "pro@community.org",
    phone: "+234 807 890 1234",
    imageUrl: "https://i.pravatar.cc/150?u=pro",
    availability: "available",
    tenureStart: new Date("2024-01-01"),
    tenureEnd: new Date("2026-12-31"),
  },
  {
    id: "off-008",
    role: "director_of_socials",
    name: "Mr. Obiora Chukwu",
    email: "socials@community.org",
    phone: "+234 808 901 2345",
    imageUrl: "https://i.pravatar.cc/150?u=socials",
    availability: "available",
    tenureStart: new Date("2024-01-01"),
    tenureEnd: new Date("2026-12-31"),
  },
  {
    id: "off-009",
    role: "legal_adviser",
    name: "Barr. Chukwuemeka Obi",
    email: "legal@community.org",
    phone: "+234 809 012 3456",
    imageUrl: "https://i.pravatar.cc/150?u=legal",
    availability: "available",
    tenureStart: new Date("2024-01-01"),
    tenureEnd: new Date("2026-12-31"),
  },
];

// Get officer by role
export function getOfficerByRole(role: ExtendedOfficerRole): CommunityOfficer | undefined {
  return COMMUNITY_OFFICERS.find(o => o.role === role);
}

// Get all available officers
export function getAvailableOfficers(): CommunityOfficer[] {
  return COMMUNITY_OFFICERS.filter(o => o.availability === "available");
}

// Get officers for a specific module based on authorization rules
export function getOfficersForModule(
  module: string,
  includeAuxiliary: boolean = true
): CommunityOfficer[] {
  const rolesByModule: Record<string, ExtendedOfficerRole[]> = {
    members: ["president", "secretary", "publicity_secretary", "vice_president", "assistant_secretary"],
    finances: ["president", "treasurer", "secretary", "financial_secretary", "legal_adviser", "vice_president"],
    elections: ["president", "secretary", "publicity_secretary", "director_of_socials", "legal_adviser"],
    content: ["secretary", "publicity_secretary", "president", "assistant_secretary"],
    leadership: ["president", "secretary", "publicity_secretary", "director_of_socials", "legal_adviser"],
    settings: ["president", "secretary", "legal_adviser", "vice_president", "assistant_secretary"],
  };

  const roles = rolesByModule[module] || [];
  return COMMUNITY_OFFICERS.filter(o => roles.includes(o.role));
}

// Check if an officer can substitute for another
export function canSubstituteFor(
  substituteRole: ExtendedOfficerRole,
  primaryRole: ExtendedOfficerRole
): boolean {
  const substitutionRules: Record<ExtendedOfficerRole, ExtendedOfficerRole[]> = {
    vice_president: ["president"],
    assistant_secretary: ["secretary"],
    financial_secretary: ["treasurer"], // Special case
    president: [],
    secretary: [],
    treasurer: [],
    publicity_secretary: [],
    director_of_socials: [],
    legal_adviser: [],
  };

  return substitutionRules[substituteRole]?.includes(primaryRole) || false;
}

// Simulate officer availability (for demo purposes)
export function simulateOfficerUnavailable(role: ExtendedOfficerRole): CommunityOfficer[] {
  return COMMUNITY_OFFICERS.map(o => ({
    ...o,
    availability: o.role === role ? "unavailable" as OfficerAvailability : o.availability,
  }));
}
