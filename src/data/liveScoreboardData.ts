// Live Scoreboard Data & Fan Engagement Settings

export interface LiveScoreboardPlayer {
  id: string;
  name: string;
  avatar: string;
  merchantName: string;
  seasonName: string;
  points: number;
  currentSession: number;
  winStreak: number;
  totalCorrect: number;
  totalPlayed: number;
  fanCount: number;
  likes: number;
  comments: number;
  shares: number;
  isOnline: boolean;
  lastActivityTime: string;
}

export interface FanFeeSetting {
  value: number;
  min: number;
  max: number;
  step: number;
  label: string;
}

export interface FanEngagementSettings {
  likeFee: FanFeeSetting;
  commentFee: FanFeeSetting;
  shareFee: FanFeeSetting;
  joinFansFee: FanFeeSetting;
}

export type FanAction = "like" | "comment" | "share" | "join_fans";

// Mutable settings object (mock in-memory store)
export const fanEngagementSettings: FanEngagementSettings = {
  likeFee: { value: 50, min: 10, max: 500, step: 10, label: "Like Fee" },
  commentFee: { value: 100, min: 20, max: 1000, step: 10, label: "Comment Fee" },
  shareFee: { value: 75, min: 10, max: 500, step: 10, label: "Share Fee" },
  joinFansFee: { value: 200, min: 50, max: 2000, step: 50, label: "Join Fans Fee" },
};

// Getters
export const getFanLikeFee = () => fanEngagementSettings.likeFee.value;
export const getFanCommentFee = () => fanEngagementSettings.commentFee.value;
export const getFanShareFee = () => fanEngagementSettings.shareFee.value;
export const getFanJoinFansFee = () => fanEngagementSettings.joinFansFee.value;

// Setters
export const setFanLikeFee = (v: number) => { fanEngagementSettings.likeFee.value = v; };
export const setFanCommentFee = (v: number) => { fanEngagementSettings.commentFee.value = v; };
export const setFanShareFee = (v: number) => { fanEngagementSettings.shareFee.value = v; };
export const setFanJoinFansFee = (v: number) => { fanEngagementSettings.joinFansFee.value = v; };

export function getFeeForAction(action: FanAction): number {
  switch (action) {
    case "like": return getFanLikeFee();
    case "comment": return getFanCommentFee();
    case "share": return getFanShareFee();
    case "join_fans": return getFanJoinFansFee();
  }
}

// 15 mock live players
export const mockLiveScoreboardPlayers: LiveScoreboardPlayer[] = [
  { id: "p1", name: "Chinedu Okafor", avatar: "CO", merchantName: "TechBrain Ltd", seasonName: "Season 3", points: 9850, currentSession: 5, winStreak: 12, totalCorrect: 47, totalPlayed: 50, fanCount: 342, likes: 1280, comments: 89, shares: 45, isOnline: true, lastActivityTime: "Just now" },
  { id: "p2", name: "Amina Yusuf", avatar: "AY", merchantName: "QuizMaster Inc", seasonName: "Season 1", points: 9200, currentSession: 4, winStreak: 9, totalCorrect: 44, totalPlayed: 48, fanCount: 278, likes: 950, comments: 67, shares: 38, isOnline: true, lastActivityTime: "1m ago" },
  { id: "p3", name: "Emeka Nwosu", avatar: "EN", merchantName: "BrainBox Co", seasonName: "Season 2", points: 8750, currentSession: 5, winStreak: 8, totalCorrect: 42, totalPlayed: 47, fanCount: 215, likes: 820, comments: 55, shares: 32, isOnline: true, lastActivityTime: "Just now" },
  { id: "p4", name: "Fatima Bello", avatar: "FB", merchantName: "TechBrain Ltd", seasonName: "Season 3", points: 8400, currentSession: 3, winStreak: 7, totalCorrect: 40, totalPlayed: 45, fanCount: 198, likes: 760, comments: 48, shares: 28, isOnline: true, lastActivityTime: "2m ago" },
  { id: "p5", name: "Oluwaseun Adeyemi", avatar: "OA", merchantName: "QuizMaster Inc", seasonName: "Season 1", points: 7900, currentSession: 4, winStreak: 6, totalCorrect: 38, totalPlayed: 44, fanCount: 167, likes: 690, comments: 42, shares: 25, isOnline: true, lastActivityTime: "Just now" },
  { id: "p6", name: "Ibrahim Musa", avatar: "IM", merchantName: "BrainBox Co", seasonName: "Season 2", points: 7500, currentSession: 3, winStreak: 5, totalCorrect: 36, totalPlayed: 42, fanCount: 145, likes: 580, comments: 37, shares: 22, isOnline: true, lastActivityTime: "3m ago" },
  { id: "p7", name: "Grace Eze", avatar: "GE", merchantName: "TechBrain Ltd", seasonName: "Season 3", points: 7100, currentSession: 3, winStreak: 5, totalCorrect: 34, totalPlayed: 40, fanCount: 132, likes: 520, comments: 33, shares: 19, isOnline: true, lastActivityTime: "1m ago" },
  { id: "p8", name: "Abubakar Suleiman", avatar: "AS", merchantName: "QuizMaster Inc", seasonName: "Season 1", points: 6800, currentSession: 2, winStreak: 4, totalCorrect: 33, totalPlayed: 39, fanCount: 118, likes: 470, comments: 29, shares: 17, isOnline: true, lastActivityTime: "Just now" },
  { id: "p9", name: "Ngozi Uche", avatar: "NU", merchantName: "BrainBox Co", seasonName: "Season 2", points: 6400, currentSession: 2, winStreak: 4, totalCorrect: 31, totalPlayed: 37, fanCount: 105, likes: 410, comments: 25, shares: 15, isOnline: true, lastActivityTime: "4m ago" },
  { id: "p10", name: "Tunde Bakare", avatar: "TB", merchantName: "TechBrain Ltd", seasonName: "Season 3", points: 6000, currentSession: 2, winStreak: 3, totalCorrect: 29, totalPlayed: 35, fanCount: 92, likes: 360, comments: 22, shares: 13, isOnline: true, lastActivityTime: "2m ago" },
  { id: "p11", name: "Halima Abdullahi", avatar: "HA", merchantName: "QuizMaster Inc", seasonName: "Season 1", points: 5600, currentSession: 1, winStreak: 3, totalCorrect: 27, totalPlayed: 33, fanCount: 81, likes: 310, comments: 19, shares: 11, isOnline: false, lastActivityTime: "6m ago" },
  { id: "p12", name: "Chisom Okwu", avatar: "CK", merchantName: "BrainBox Co", seasonName: "Season 2", points: 5200, currentSession: 1, winStreak: 2, totalCorrect: 25, totalPlayed: 31, fanCount: 74, likes: 270, comments: 16, shares: 9, isOnline: true, lastActivityTime: "Just now" },
  { id: "p13", name: "Yusuf Garba", avatar: "YG", merchantName: "TechBrain Ltd", seasonName: "Season 3", points: 4800, currentSession: 1, winStreak: 2, totalCorrect: 23, totalPlayed: 29, fanCount: 63, likes: 230, comments: 14, shares: 8, isOnline: true, lastActivityTime: "5m ago" },
  { id: "p14", name: "Ada Nnamdi", avatar: "AN", merchantName: "QuizMaster Inc", seasonName: "Season 1", points: 4400, currentSession: 1, winStreak: 1, totalCorrect: 21, totalPlayed: 27, fanCount: 55, likes: 190, comments: 11, shares: 6, isOnline: false, lastActivityTime: "8m ago" },
  { id: "p15", name: "Musa Danjuma", avatar: "MD", merchantName: "BrainBox Co", seasonName: "Season 2", points: 4000, currentSession: 1, winStreak: 1, totalCorrect: 19, totalPlayed: 25, fanCount: 48, likes: 150, comments: 9, shares: 5, isOnline: true, lastActivityTime: "3m ago" },
];
