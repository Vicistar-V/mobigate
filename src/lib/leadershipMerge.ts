// Maps raw API rows (from /api/community/leadership.php and /api/community/staff.php)
// into the display shapes the existing executive/tenure/staff UI components
// (ExecutiveMembersCarousel, FeaturedLeaderCard, ExecutiveDetailSheet, tenure list)
// already expect, so those presentational components didn't need to change.

import { ExecutiveMember } from "@/data/communityExecutivesData";
import { OfficeTenure } from "@/data/communityExecutivesData";

export interface ApiExecutive {
  id: string;
  name: string;
  position: string;
  position_id?: string | null;
  admin_rank: number;
  tenure: string;
  imageUrl: string;
  level: string;
  committee: string;
  email?: string | null;
  is_founder?: boolean;
}

export function mapApiExecutive(e: ApiExecutive): ExecutiveMember {
  const level: ExecutiveMember["level"] =
    e.level === "topmost" || e.level === "deputy" || e.level === "officer" || e.level === "staff"
      ? e.level
      : "officer";
  return {
    id: e.id,
    name: e.name,
    position: e.position,
    tenure: e.tenure,
    imageUrl: e.imageUrl || "/placeholder.svg",
    level,
    committee: "executive",
    profile: e.email ? { email: e.email } : undefined,
  };
}

export interface ApiAdhocMember {
  id: string;
  user_id: string;
  role: string;
  name: string;
  profile_photo?: string | null;
  email?: string | null;
  joined_at?: string;
}

export interface ApiAdhocCommittee {
  id: string;
  name: string;
  description?: string | null;
  purpose?: string | null;
  status: string;
  member_count: number;
  created_by_name?: string | null;
  created_at: string;
  members?: ApiAdhocMember[];
}

/** Flattens active committees' real members into ExecutiveMember cards. */
export function mapApiAdhocMembers(committees: ApiAdhocCommittee[]): ExecutiveMember[] {
  const out: ExecutiveMember[] = [];
  for (const c of committees) {
    for (const m of c.members ?? []) {
      out.push({
        id: m.id || m.user_id,
        name: m.name,
        position: m.role || "Member",
        tenure: m.joined_at ? `[${new Date(m.joined_at).getFullYear()} - Present]` : "",
        imageUrl: m.profile_photo || "/placeholder.svg",
        level: "staff",
        committee: "ad-hoc",
        // Free-form committee name from the DB — cast since the fixed union
        // predates real committee data; used only for display/filter matching.
        adHocDepartment: c.name as ExecutiveMember["adHocDepartment"],
        profile: m.email ? { email: m.email } : undefined,
      });
    }
  }
  return out;
}

export interface ApiStaff {
  id: string;
  full_name: string;
  position_title: string;
  department: "management" | "administrative" | "support";
  phone?: string | null;
  email?: string | null;
  photo_url?: string | null;
  status: "active" | "inactive";
  start_date?: string | null;
}

export function mapApiStaff(s: ApiStaff): ExecutiveMember {
  return {
    id: s.id,
    name: s.full_name,
    position: s.position_title,
    tenure: s.start_date ? `[${new Date(s.start_date).getFullYear()} - Present]` : "[Present]",
    imageUrl: s.photo_url || "/placeholder.svg",
    level: "staff",
    committee: "staff",
    profile: {
      email: s.email || undefined,
      phone: s.phone || undefined,
    },
  };
}

export interface ApiPosition {
  id: string;
  title: string;
  admin_number: number | null;
  holder_user_id?: string | null;
  holder_name?: string | null;
  holder_photo?: string | null;
  term_start_date?: string | null;
  term_end_date?: string | null;
  term_years?: number | null;
}

function formatDate(d?: string | null): string {
  if (!d) return "—";
  const date = new Date(d.includes("T") ? d : `${d}T00:00:00`);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function mapApiPositionToTenure(p: ApiPosition): OfficeTenure {
  let duration = "—";
  if (p.term_years) {
    duration = `${p.term_years} Year${p.term_years === 1 ? "" : "s"}`;
  } else if (p.term_start_date && p.term_end_date) {
    const start = new Date(p.term_start_date);
    const end = new Date(p.term_end_date);
    const years = Math.round(((end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) * 10) / 10;
    if (years > 0) duration = `${years} Year${years === 1 ? "" : "s"}`;
  }

  return {
    id: p.id,
    position: p.title,
    currentHolder: p.holder_name?.trim() || "Vacant",
    termStart: formatDate(p.term_start_date),
    termEnd: formatDate(p.term_end_date),
    duration,
  };
}
