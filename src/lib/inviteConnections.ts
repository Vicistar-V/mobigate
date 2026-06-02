/**
 * lib/inviteConnections.ts
 *
 * Provides the current user's connections (Friends, Followers, Suggested) for the
 * "Select from Connections" picker inside the Invite Members dialog.
 *
 * The PHP backend can inject the real data via window.__USER_CONNECTIONS__ which
 * overrides the demo data automatically. Shape:
 *   { friends: ConnectionUser[]; followers: ConnectionUser[]; suggested: ConnectionUser[] }
 */

import { mockOnlineMembers, suggestedFriends, type Member } from "@/data/membershipData";

export type ConnectionCategory = "friends" | "followers" | "suggested";

export interface ConnectionUser {
  id: string;
  username: string;
  name: string;
  profile_photo?: string;
  role?: string;
}

declare global {
  interface Window {
    __USER_CONNECTIONS__?: Partial<Record<ConnectionCategory, ConnectionUser[]>>;
  }
}

const toUser = (m: Member): ConnectionUser => ({
  id: m.id,
  name: m.name,
  username: m.name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16) || m.id,
  profile_photo: m.avatar && m.avatar !== "/placeholder.svg" ? m.avatar : undefined,
  role: m.role,
});

// Demo fallbacks derived from existing membership data
const demoFriends: ConnectionUser[] = mockOnlineMembers.slice(0, 6).map(toUser);
const demoFollowers: ConnectionUser[] = mockOnlineMembers.slice(3).map(toUser);
const demoSuggested: ConnectionUser[] = suggestedFriends.map(toUser);

export function getConnections(category: ConnectionCategory): ConnectionUser[] {
  const injected = window.__USER_CONNECTIONS__?.[category];
  if (Array.isArray(injected)) return injected;
  switch (category) {
    case "friends": return demoFriends;
    case "followers": return demoFollowers;
    case "suggested": return demoSuggested;
    default: return [];
  }
}

export const connectionTabs: { key: ConnectionCategory; label: string }[] = [
  { key: "friends", label: "Friends" },
  { key: "followers", label: "Followers" },
  { key: "suggested", label: "Suggested" },
];
