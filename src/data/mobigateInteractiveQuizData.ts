// Interactive Quiz Game Show -- Full Data Model

export interface SelectionProcess {
  round: number;
  entriesSelected: number;
  entryFee: number;
}

export interface TVShowRound {
  round: number;
  entriesSelected: number;
  entryFee: number;
  label: string;
}

export interface QuizMerchant {
  id: string;
  name: string;
  logo: string;
  category: string;
  seasonsAvailable: number;
  totalPrizePool: number;
  isVerified: boolean;
  applicationStatus: "pending" | "approved" | "suspended";
  // Quiz pack config
  questionsPerPack: number;
  objectivePerPack: number;
  nonObjectivePerPack: number;
  objectiveOptions: number; // 8-10
  // Billing
  costPerQuestion: number;
  // Win thresholds
  winPercentageThreshold: number; // 25-50
  fairAnswerPercentage: number; // fixed 20
  // Alternative answers
  alternativeAnswersMin: number; // 2-5
  alternativeAnswersMax: number; // 2-5
  // Qualifying
  qualifyingPoints: number; // default 15
  // Bonus
  bonusGamesAfter: number; // default 50
  bonusGamesCountMin: number; // 5-10
  bonusGamesCountMax: number; // 5-10
  bonusDiscountMin: number; // 25-50
  bonusDiscountMax: number; // 25-50
}

export interface QuizSeason {
  id: string;
  merchantId: string;
  name: string;
  type: "Short" | "Medium" | "Complete";
  duration: number; // months: 4, 6, or 12
  selectionLevels: number; // 3, 5, or 7
  entryFee: number;
  currentLevel: number;
  totalParticipants: number;
  prizePerLevel: number;
  isLive: boolean;
  status: "open" | "in_progress" | "completed";
  selectionProcesses: SelectionProcess[];
  tvShowRounds: TVShowRound[];
}

export interface MerchantQuestion {
  id: string;
  merchantId: string;
  question: string;
  type: "objective" | "non_objective" | "bonus_objective";
  options: string[]; // for objective
  correctAnswerIndex: number;
  alternativeAnswers: string[]; // for non-objective
  category: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number;
  costPerQuestion: number;
}

// Default merchant config
export const DEFAULT_MERCHANT_CONFIG: Omit<QuizMerchant, "id" | "name" | "logo" | "category" | "seasonsAvailable" | "totalPrizePool" | "isVerified" | "applicationStatus"> = {
  questionsPerPack: 15,
  objectivePerPack: 10,
  nonObjectivePerPack: 5,
  objectiveOptions: 8,
  costPerQuestion: 200,
  winPercentageThreshold: 30,
  fairAnswerPercentage: 20,
  alternativeAnswersMin: 2,
  alternativeAnswersMax: 5,
  qualifyingPoints: 15,
  bonusGamesAfter: 50,
  bonusGamesCountMin: 5,
  bonusGamesCountMax: 10,
  bonusDiscountMin: 25,
  bonusDiscountMax: 50,
};

export const mockMerchants: QuizMerchant[] = [
  {
    id: "m1", name: "TechVentures Nigeria", logo: "/placeholder.svg", category: "Technology",
    seasonsAvailable: 3, totalPrizePool: 5000000, isVerified: true, applicationStatus: "approved",
    ...DEFAULT_MERCHANT_CONFIG, winPercentageThreshold: 35, costPerQuestion: 250,
  },
  {
    id: "m2", name: "FoodCo Supermarket", logo: "/placeholder.svg", category: "Retail",
    seasonsAvailable: 2, totalPrizePool: 3000000, isVerified: true, applicationStatus: "approved",
    ...DEFAULT_MERCHANT_CONFIG, winPercentageThreshold: 40, objectiveOptions: 10,
  },
  {
    id: "m3", name: "EduFirst Academy", logo: "/placeholder.svg", category: "Education",
    seasonsAvailable: 4, totalPrizePool: 8000000, isVerified: true, applicationStatus: "approved",
    ...DEFAULT_MERCHANT_CONFIG, qualifyingPoints: 20, bonusGamesAfter: 40,
  },
  {
    id: "m4", name: "HealthPlus Pharmacy", logo: "/placeholder.svg", category: "Healthcare",
    seasonsAvailable: 0, totalPrizePool: 0, isVerified: false, applicationStatus: "pending",
    ...DEFAULT_MERCHANT_CONFIG,
  },
  {
    id: "m5", name: "AutoKing Motors", logo: "/placeholder.svg", category: "Automotive",
    seasonsAvailable: 2, totalPrizePool: 10000000, isVerified: true, applicationStatus: "suspended",
    ...DEFAULT_MERCHANT_CONFIG, winPercentageThreshold: 50, costPerQuestion: 500,
  },
];

export const mockSeasons: QuizSeason[] = [
  {
    id: "s1", merchantId: "m1", name: "Tech Genius Season 1", type: "Short", duration: 4,
    selectionLevels: 3, entryFee: 200, currentLevel: 1, totalParticipants: 10000,
    prizePerLevel: 50000, isLive: false, status: "open",
    selectionProcesses: [
      { round: 1, entriesSelected: 10000, entryFee: 200 },
      { round: 2, entriesSelected: 5000, entryFee: 500 },
      { round: 3, entriesSelected: 2000, entryFee: 750 },
    ],
    tvShowRounds: [
      { round: 1, entriesSelected: 50, entryFee: 2000, label: "1st TV Show" },
      { round: 2, entriesSelected: 15, entryFee: 5000, label: "Semi-Final" },
      { round: 3, entriesSelected: 3, entryFee: 0, label: "Grand Finale" },
    ],
  },
  {
    id: "s2", merchantId: "m1", name: "Code Master Championship", type: "Complete", duration: 12,
    selectionLevels: 7, entryFee: 500, currentLevel: 3, totalParticipants: 25000,
    prizePerLevel: 100000, isLive: true, status: "in_progress",
    selectionProcesses: [
      { round: 1, entriesSelected: 25000, entryFee: 500 },
      { round: 2, entriesSelected: 12000, entryFee: 750 },
      { round: 3, entriesSelected: 5000, entryFee: 1000 },
      { round: 4, entriesSelected: 2000, entryFee: 1500 },
      { round: 5, entriesSelected: 500, entryFee: 2000 },
      { round: 6, entriesSelected: 200, entryFee: 2500 },
      { round: 7, entriesSelected: 100, entryFee: 3000 },
    ],
    tvShowRounds: [
      { round: 1, entriesSelected: 50, entryFee: 5000, label: "1st TV Show" },
      { round: 2, entriesSelected: 15, entryFee: 7500, label: "Semi-Final" },
      { round: 3, entriesSelected: 3, entryFee: 0, label: "Grand Finale" },
    ],
  },
  {
    id: "s3", merchantId: "m2", name: "Shopping Spree Quiz", type: "Medium", duration: 6,
    selectionLevels: 5, entryFee: 300, currentLevel: 1, totalParticipants: 8000,
    prizePerLevel: 75000, isLive: false, status: "open",
    selectionProcesses: [
      { round: 1, entriesSelected: 8000, entryFee: 300 },
      { round: 2, entriesSelected: 4000, entryFee: 500 },
      { round: 3, entriesSelected: 1500, entryFee: 750 },
      { round: 4, entriesSelected: 500, entryFee: 1000 },
      { round: 5, entriesSelected: 200, entryFee: 1500 },
    ],
    tvShowRounds: [
      { round: 1, entriesSelected: 50, entryFee: 2000, label: "1st TV Show" },
      { round: 2, entriesSelected: 15, entryFee: 5000, label: "Semi-Final" },
      { round: 3, entriesSelected: 3, entryFee: 0, label: "Grand Finale" },
    ],
  },
  {
    id: "s4", merchantId: "m3", name: "Brain Academy Challenge", type: "Complete", duration: 12,
    selectionLevels: 7, entryFee: 400, currentLevel: 5, totalParticipants: 20000,
    prizePerLevel: 150000, isLive: true, status: "in_progress",
    selectionProcesses: [
      { round: 1, entriesSelected: 20000, entryFee: 400 },
      { round: 2, entriesSelected: 10000, entryFee: 750 },
      { round: 3, entriesSelected: 4000, entryFee: 1000 },
      { round: 4, entriesSelected: 1500, entryFee: 1500 },
      { round: 5, entriesSelected: 500, entryFee: 2000 },
      { round: 6, entriesSelected: 200, entryFee: 2500 },
      { round: 7, entriesSelected: 80, entryFee: 3000 },
    ],
    tvShowRounds: [
      { round: 1, entriesSelected: 40, entryFee: 5000, label: "1st TV Show" },
      { round: 2, entriesSelected: 12, entryFee: 7500, label: "Semi-Final" },
      { round: 3, entriesSelected: 3, entryFee: 0, label: "Grand Finale" },
    ],
  },
];

export const mockQuestions: MerchantQuestion[] = [
  // Merchant m1 - Objective
  { id: "q1", merchantId: "m1", question: "What does CPU stand for?", type: "objective", options: ["Central Processing Unit", "Central Program Utility", "Computer Personal Unit", "Central Peripheral Unit", "Core Processing Utility", "Central Power Unit", "Computer Processing Unit", "Central Processor Utility"], correctAnswerIndex: 0, alternativeAnswers: [], category: "Technology", difficulty: "easy", timeLimit: 30, costPerQuestion: 250 },
  { id: "q2", merchantId: "m1", question: "Which company created JavaScript?", type: "objective", options: ["Netscape", "Microsoft", "Google", "Apple", "IBM", "Sun Microsystems", "Oracle", "Mozilla"], correctAnswerIndex: 0, alternativeAnswers: [], category: "Technology", difficulty: "medium", timeLimit: 30, costPerQuestion: 250 },
  // Merchant m1 - Non-Objective
  { id: "q3", merchantId: "m1", question: "Explain the concept of cloud computing in your own words.", type: "non_objective", options: [], correctAnswerIndex: -1, alternativeAnswers: ["internet-based computing", "remote server storage", "online data processing"], category: "Technology", difficulty: "medium", timeLimit: 60, costPerQuestion: 250 },
  // Merchant m1 - Bonus Objective
  { id: "q4", merchantId: "m1", question: "What year was the first iPhone released?", type: "bonus_objective", options: ["2007", "2006", "2008", "2005", "2009", "2010", "2004", "2011"], correctAnswerIndex: 0, alternativeAnswers: [], category: "Technology", difficulty: "easy", timeLimit: 20, costPerQuestion: 125 },
  // Merchant m2 - Objective
  { id: "q5", merchantId: "m2", question: "Which vitamin is most abundant in oranges?", type: "objective", options: ["Vitamin C", "Vitamin A", "Vitamin B12", "Vitamin D", "Vitamin E", "Vitamin K", "Vitamin B6", "Vitamin B1"], correctAnswerIndex: 0, alternativeAnswers: [], category: "Food", difficulty: "easy", timeLimit: 30, costPerQuestion: 200 },
  // Merchant m2 - Non-Objective
  { id: "q6", merchantId: "m2", question: "Name three benefits of eating fresh vegetables.", type: "non_objective", options: [], correctAnswerIndex: -1, alternativeAnswers: ["nutritional value", "health benefits", "immune boosting", "fiber content"], category: "Food", difficulty: "easy", timeLimit: 60, costPerQuestion: 200 },
  // Merchant m3 - Objective
  { id: "q7", merchantId: "m3", question: "What is the chemical symbol for Gold?", type: "objective", options: ["Au", "Ag", "Fe", "Cu", "Zn", "Pb", "Sn", "Ni"], correctAnswerIndex: 0, alternativeAnswers: [], category: "Science", difficulty: "easy", timeLimit: 30, costPerQuestion: 200 },
];

export const INTERACTIVE_QUESTIONS_PER_SESSION = 15;
export const INTERACTIVE_OBJECTIVE_QUESTIONS = 10;
export const INTERACTIVE_NON_OBJECTIVE_QUESTIONS = 5;

export const INTERACTIVE_MAX_LOSSES_BEFORE_EVICTION = 50;
export const INTERACTIVE_QUALIFYING_TOP_PERCENT = 10; // top 10% qualify

export const SEASON_TYPE_CONFIG = {
  Short: { duration: 4, processes: 3 },
  Medium: { duration: 6, processes: 5 },
  Complete: { duration: 12, processes: 7 },
} as const;
