// Mock data for Group Quiz Game

export interface GroupQuizFriend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  winRate: number;
}

export interface GroupQuizParticipant {
  id: string;
  name: string;
  avatar: string;
  hasAccepted: boolean;
  score: number;
  isHost: boolean;
}

export const mockFriendsList: GroupQuizFriend[] = [
  { id: "f1", name: "Tunde Okafor", avatar: "/placeholder.svg", isOnline: true, winRate: 72 },
  { id: "f2", name: "Amina Bello", avatar: "/placeholder.svg", isOnline: true, winRate: 65 },
  { id: "f3", name: "Chidi Nwankwo", avatar: "/placeholder.svg", isOnline: true, winRate: 80 },
  { id: "f4", name: "Fatima Yusuf", avatar: "/placeholder.svg", isOnline: false, winRate: 55 },
  { id: "f5", name: "Emeka Johnson", avatar: "/placeholder.svg", isOnline: true, winRate: 68 },
  { id: "f6", name: "Grace Adeyemi", avatar: "/placeholder.svg", isOnline: true, winRate: 74 },
  { id: "f7", name: "Ibrahim Musa", avatar: "/placeholder.svg", isOnline: false, winRate: 60 },
  { id: "f8", name: "Blessing Eze", avatar: "/placeholder.svg", isOnline: true, winRate: 78 },
  { id: "f9", name: "David Okonkwo", avatar: "/placeholder.svg", isOnline: true, winRate: 52 },
  { id: "f10", name: "Ngozi Okoro", avatar: "/placeholder.svg", isOnline: false, winRate: 70 },
];

export const GROUP_PRIZE_MULTIPLIERS: Record<string, number> = {
  "3-4": 2,   // 200%
  "5-6": 3,   // 300%
  "7-9": 4,   // 400%
  "10": 5,    // 500%
};

export function getGroupPrizeMultiplier(playerCount: number): number {
  if (playerCount <= 4) return 2;
  if (playerCount <= 6) return 3;
  if (playerCount <= 9) return 4;
  return 5;
}

export const GROUP_MIN_STAKE = 5000;
export const GROUP_MIN_PLAYERS = 3;
export const GROUP_MAX_PLAYERS = 10;
export const GROUP_COUNTDOWN_SECONDS = 60;
