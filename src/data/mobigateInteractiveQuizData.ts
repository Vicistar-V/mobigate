// Mock data for Interactive Quiz Game

export interface QuizMerchant {
  id: string;
  name: string;
  logo: string;
  category: string;
  seasonsAvailable: number;
  totalPrizePool: number;
  isVerified: boolean;
}

export interface QuizSeason {
  id: string;
  merchantId: string;
  name: string;
  type: "Short" | "Medium" | "Complete";
  selectionLevels: number;
  entryFee: number;
  currentLevel: number;
  totalParticipants: number;
  prizePerLevel: number;
  isLive: boolean;
  status: "open" | "in_progress" | "completed";
}

export const mockMerchants: QuizMerchant[] = [
  { id: "m1", name: "TechVentures Nigeria", logo: "/placeholder.svg", category: "Technology", seasonsAvailable: 3, totalPrizePool: 5000000, isVerified: true },
  { id: "m2", name: "FoodCo Supermarket", logo: "/placeholder.svg", category: "Retail", seasonsAvailable: 2, totalPrizePool: 3000000, isVerified: true },
  { id: "m3", name: "EduFirst Academy", logo: "/placeholder.svg", category: "Education", seasonsAvailable: 4, totalPrizePool: 8000000, isVerified: true },
  { id: "m4", name: "HealthPlus Pharmacy", logo: "/placeholder.svg", category: "Healthcare", seasonsAvailable: 1, totalPrizePool: 2000000, isVerified: false },
  { id: "m5", name: "AutoKing Motors", logo: "/placeholder.svg", category: "Automotive", seasonsAvailable: 2, totalPrizePool: 10000000, isVerified: true },
];

export const mockSeasons: QuizSeason[] = [
  { id: "s1", merchantId: "m1", name: "Tech Genius Season 1", type: "Short", selectionLevels: 5, entryFee: 2000, currentLevel: 1, totalParticipants: 450, prizePerLevel: 50000, isLive: false, status: "open" },
  { id: "s2", merchantId: "m1", name: "Code Master Championship", type: "Complete", selectionLevels: 7, entryFee: 5000, currentLevel: 3, totalParticipants: 1200, prizePerLevel: 100000, isLive: true, status: "in_progress" },
  { id: "s3", merchantId: "m2", name: "Shopping Spree Quiz", type: "Medium", selectionLevels: 6, entryFee: 3000, currentLevel: 1, totalParticipants: 800, prizePerLevel: 75000, isLive: false, status: "open" },
  { id: "s4", merchantId: "m3", name: "Brain Academy Challenge", type: "Complete", selectionLevels: 7, entryFee: 4000, currentLevel: 5, totalParticipants: 2000, prizePerLevel: 150000, isLive: true, status: "in_progress" },
];

export const INTERACTIVE_QUESTIONS_PER_SESSION = 15;
export const INTERACTIVE_OBJECTIVE_QUESTIONS = 10;
export const INTERACTIVE_NON_OBJECTIVE_QUESTIONS = 5;
