// Quiz Question with 8 options (A-H)
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[]; // 8 options (A-H)
  correctAnswer: number; // Index 0-7 (A=0, B=1, ... H=7)
  correctAnswerLabel: string; // "A", "B", "C", "D", "E", "F", "G", or "H"
  timeLimit: number; // Time limit in seconds PER QUESTION
  points: number;
}

// Quiz with 10 fixed questions
export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  stakeAmount: number; // Amount charged to player's wallet
  winningAmount: number; // Amount paid when player wins (100%)
  currency: string;
  totalQuestions: 10; // Fixed at 10
  timeLimitPerQuestion: number; // Time limit per individual question (seconds)
  participants: number;
  gamesPlayed: number;
  status: "active" | "upcoming" | "completed" | "disabled";
  privacySetting: "members_only" | "public";
  startDate?: Date;
  endDate?: Date;
  questions?: QuizQuestion[];
  communityId: string;
}

// Leaderboard Entry
export interface LeaderboardEntry {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  score: number;
  questionsCorrect: number;
  winningPercentage: number;
  amountWon: number;
  completionTime: string;
  playedAt: Date;
  rank: number;
}

// Quiz Game Result
export interface QuizGameResult {
  id: string;
  quizId: string;
  quizTitle: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  questionsCorrect: number; // 0-10
  winningPercentage: number; // 0%, 50%, or 100%
  stakePaid: number;
  amountWon: number;
  playedAt: Date;
  status: "won" | "partial_win" | "lost";
}

// Quiz Wallet Transaction
export interface QuizWalletTransaction {
  id: string;
  communityId: string;
  type: "stake_received" | "winning_payout" | "mobigate_fee" | "top_up";
  amount: number;
  playerId?: string;
  playerName?: string;
  quizId?: string;
  quizTitle?: string;
  description: string;
  createdAt: Date;
}

// Community Quiz Wallet
export interface CommunityQuizWallet {
  communityId: string;
  balance: number;
  totalStakesReceived: number;
  totalPayouts: number;
  totalMobigateFees: number;
  lastUpdated: Date;
}

// Quiz Statistics
export interface QuizStatistics {
  totalGamesPlayed: number;
  totalGamesWon: number;
  totalPartialWins: number;
  totalGamesLost: number;
  totalStakeCollected: number;
  totalPayoutsGiven: number;
  totalMobigateFees: number;
  averageScore: number;
  highestScore: number;
  mostActivePlayer: {
    playerId: string;
    playerName: string;
    gamesPlayed: number;
  };
}

// Player Quiz Statistics
export interface PlayerQuizStats {
  playerId: string;
  playerName: string;
  gamesPlayed: number;
  gamesWon: number;
  partialWins: number;
  gamesLost: number;
  totalStakePaid: number;
  totalAmountWon: number;
  netProfit: number;
  averageScore: number;
  bestScore: number;
}

export const ANSWER_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

export const quizCategories = [
  "General Knowledge",
  "Community Trivia",
  "Fun Facts",
  "History & Culture",
  "Sports & Entertainment",
  "Current Affairs",
  "Science & Technology",
  "Arts & Literature"
];

// Sample questions with 8 options each
const sampleQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the capital city of Nigeria?",
    options: ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Enugu", "Kaduna", "Benin City"],
    correctAnswer: 1,
    correctAnswerLabel: "B",
    timeLimit: 10,
    points: 10
  },
  {
    id: "q2",
    question: "Which year did Nigeria gain independence?",
    options: ["1957", "1958", "1959", "1960", "1961", "1962", "1963", "1964"],
    correctAnswer: 3,
    correctAnswerLabel: "D",
    timeLimit: 10,
    points: 10
  },
  {
    id: "q3",
    question: "What is the largest continent in the world by land area?",
    options: ["Africa", "North America", "South America", "Asia", "Europe", "Australia", "Antarctica", "Oceania"],
    correctAnswer: 3,
    correctAnswerLabel: "D",
    timeLimit: 10,
    points: 10
  },
  {
    id: "q4",
    question: "Who wrote the novel 'Things Fall Apart'?",
    options: ["Wole Soyinka", "Chimamanda Adichie", "Chinua Achebe", "Ben Okri", "Cyprian Ekwensi", "Elechi Amadi", "Buchi Emecheta", "Flora Nwapa"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 10,
    points: 10
  },
  {
    id: "q5",
    question: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag", "Fe", "Cu", "Pb", "Zn"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 10,
    points: 10
  },
  {
    id: "q6",
    question: "How many states are there in Nigeria?",
    options: ["32", "34", "35", "36", "37", "38", "40", "42"],
    correctAnswer: 3,
    correctAnswerLabel: "D",
    timeLimit: 10,
    points: 10
  },
  {
    id: "q7",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars", "Saturn", "Mercury", "Neptune", "Uranus", "Pluto"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 10,
    points: 10
  },
  {
    id: "q8",
    question: "What is the longest river in Africa?",
    options: ["Congo River", "Niger River", "Nile River", "Zambezi River", "Orange River", "Limpopo River", "Senegal River", "Volta River"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 10,
    points: 10
  },
  {
    id: "q9",
    question: "Who was the first Nigerian to win the Nobel Prize?",
    options: ["Chinua Achebe", "Wole Soyinka", "Philip Emeagwali", "Ngozi Okonjo-Iweala", "Hakeem Olajuwon", "Fela Kuti", "Ben Okri", "Chimamanda Adichie"],
    correctAnswer: 1,
    correctAnswerLabel: "B",
    timeLimit: 10,
    points: 10
  },
  {
    id: "q10",
    question: "What is the currency of Japan?",
    options: ["Yuan", "Won", "Yen", "Ringgit", "Baht", "Peso", "Rupee", "Dollar"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 10,
    points: 10
  }
];

// Active Quizzes with new structure
export const activeQuizzes: Quiz[] = [
  {
    id: "quiz-1",
    title: "Community Heritage Quiz",
    description: "Test your knowledge about our community's rich history and traditions",
    category: "Community Trivia",
    difficulty: "Medium",
    stakeAmount: 500,
    winningAmount: 5000,
    currency: "NGN",
    totalQuestions: 10,
    timeLimitPerQuestion: 10,
    participants: 156,
    gamesPlayed: 342,
    status: "active",
    privacySetting: "members_only",
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    questions: sampleQuestions,
    communityId: "comm-1"
  },
  {
    id: "quiz-2",
    title: "General Knowledge Challenge",
    description: "Wide-ranging questions covering various topics. Perfect for knowledge enthusiasts!",
    category: "General Knowledge",
    difficulty: "Hard",
    stakeAmount: 1000,
    winningAmount: 10000,
    currency: "NGN",
    totalQuestions: 10,
    timeLimitPerQuestion: 10,
    participants: 243,
    gamesPlayed: 567,
    status: "active",
    privacySetting: "public",
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    questions: sampleQuestions,
    communityId: "comm-1"
  },
  {
    id: "quiz-3",
    title: "Fun Facts Friday",
    description: "Light-hearted trivia about interesting facts from around the world",
    category: "Fun Facts",
    difficulty: "Easy",
    stakeAmount: 200,
    winningAmount: 2000,
    currency: "NGN",
    totalQuestions: 10,
    timeLimitPerQuestion: 10,
    participants: 89,
    gamesPlayed: 178,
    status: "active",
    privacySetting: "public",
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    questions: sampleQuestions,
    communityId: "comm-1"
  },
  {
    id: "quiz-4",
    title: "Sports Champions Quiz",
    description: "Test your sports knowledge across football, basketball, athletics and more",
    category: "Sports & Entertainment",
    difficulty: "Medium",
    stakeAmount: 750,
    winningAmount: 7500,
    currency: "NGN",
    totalQuestions: 10,
    timeLimitPerQuestion: 10,
    participants: 178,
    gamesPlayed: 0,
    status: "upcoming",
    privacySetting: "members_only",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    questions: sampleQuestions,
    communityId: "comm-1"
  }
];

// Sample Leaderboard
export const leaderboard: LeaderboardEntry[] = [
  {
    id: "1",
    playerId: "player-1",
    playerName: "Chukwudi Okafor",
    playerAvatar: "/placeholder.svg",
    score: 100,
    questionsCorrect: 10,
    winningPercentage: 100,
    amountWon: 10000,
    completionTime: "4:25",
    playedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    rank: 1
  },
  {
    id: "2",
    playerId: "player-2",
    playerName: "Amina Hassan",
    playerAvatar: "/placeholder.svg",
    score: 100,
    questionsCorrect: 10,
    winningPercentage: 100,
    amountWon: 5000,
    completionTime: "4:45",
    playedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    rank: 2
  },
  {
    id: "3",
    playerId: "player-3",
    playerName: "Emeka Nwosu",
    playerAvatar: "/placeholder.svg",
    score: 90,
    questionsCorrect: 9,
    winningPercentage: 50,
    amountWon: 2500,
    completionTime: "5:10",
    playedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    rank: 3
  },
  {
    id: "4",
    playerId: "player-4",
    playerName: "Fatima Bello",
    playerAvatar: "/placeholder.svg",
    score: 90,
    questionsCorrect: 9,
    winningPercentage: 50,
    amountWon: 3750,
    completionTime: "5:30",
    playedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    rank: 4
  },
  {
    id: "5",
    playerId: "player-5",
    playerName: "Tunde Adeyemi",
    playerAvatar: "/placeholder.svg",
    score: 80,
    questionsCorrect: 8,
    winningPercentage: 50,
    amountWon: 1000,
    completionTime: "4:50",
    playedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    rank: 5
  },
  {
    id: "6",
    playerId: "player-6",
    playerName: "Ngozi Okeke",
    playerAvatar: "/placeholder.svg",
    score: 70,
    questionsCorrect: 7,
    winningPercentage: 0,
    amountWon: 0,
    completionTime: "5:40",
    playedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    rank: 6
  },
  {
    id: "7",
    playerId: "player-7",
    playerName: "Ibrahim Musa",
    playerAvatar: "/placeholder.svg",
    score: 60,
    questionsCorrect: 6,
    winningPercentage: 0,
    amountWon: 0,
    completionTime: "4:20",
    playedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    rank: 7
  },
  {
    id: "8",
    playerId: "player-8",
    playerName: "Chioma Eze",
    playerAvatar: "/placeholder.svg",
    score: 50,
    questionsCorrect: 5,
    winningPercentage: 0,
    amountWon: 0,
    completionTime: "3:55",
    playedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    rank: 8
  }
];

// Sample Game History
export const gameHistory: QuizGameResult[] = [
  {
    id: "game-1",
    quizId: "quiz-1",
    quizTitle: "Community Heritage Quiz",
    playerId: "current-user",
    playerName: "You",
    playerAvatar: "/placeholder.svg",
    questionsCorrect: 10,
    winningPercentage: 100,
    stakePaid: 500,
    amountWon: 5000,
    playedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "won"
  },
  {
    id: "game-2",
    quizId: "quiz-2",
    quizTitle: "General Knowledge Challenge",
    playerId: "current-user",
    playerName: "You",
    playerAvatar: "/placeholder.svg",
    questionsCorrect: 9,
    winningPercentage: 50,
    stakePaid: 1000,
    amountWon: 5000,
    playedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: "partial_win"
  },
  {
    id: "game-3",
    quizId: "quiz-3",
    quizTitle: "Fun Facts Friday",
    playerId: "current-user",
    playerName: "You",
    playerAvatar: "/placeholder.svg",
    questionsCorrect: 6,
    winningPercentage: 0,
    stakePaid: 200,
    amountWon: 0,
    playedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: "lost"
  }
];

// Sample Wallet Transactions
export const walletTransactions: QuizWalletTransaction[] = [
  {
    id: "txn-1",
    communityId: "comm-1",
    type: "stake_received",
    amount: 350,
    playerId: "player-1",
    playerName: "Chukwudi Okafor",
    quizId: "quiz-1",
    quizTitle: "Community Heritage Quiz",
    description: "Stake received (70% of ₦500)",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "txn-2",
    communityId: "comm-1",
    type: "mobigate_fee",
    amount: 150,
    playerId: "player-1",
    playerName: "Chukwudi Okafor",
    quizId: "quiz-1",
    quizTitle: "Community Heritage Quiz",
    description: "Mobigate fee (30% of ₦500)",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "txn-3",
    communityId: "comm-1",
    type: "winning_payout",
    amount: -5000,
    playerId: "player-1",
    playerName: "Chukwudi Okafor",
    quizId: "quiz-1",
    quizTitle: "Community Heritage Quiz",
    description: "Winning payout (100% - 10/10 correct)",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "txn-4",
    communityId: "comm-1",
    type: "top_up",
    amount: 100000,
    description: "Community wallet top-up",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
];

// Sample Community Quiz Wallet
export const communityQuizWallet: CommunityQuizWallet = {
  communityId: "comm-1",
  balance: 250000,
  totalStakesReceived: 175000,
  totalPayouts: 125000,
  totalMobigateFees: 75000,
  lastUpdated: new Date()
};

// Sample Quiz Statistics
export const quizStatistics: QuizStatistics = {
  totalGamesPlayed: 1087,
  totalGamesWon: 287,
  totalPartialWins: 342,
  totalGamesLost: 458,
  totalStakeCollected: 543500,
  totalPayoutsGiven: 1435000,
  totalMobigateFees: 232500,
  averageScore: 6.8,
  highestScore: 10,
  mostActivePlayer: {
    playerId: "player-1",
    playerName: "Chukwudi Okafor",
    gamesPlayed: 45
  }
};

// Sample Player Stats
export const playerQuizStats: PlayerQuizStats = {
  playerId: "current-user",
  playerName: "You",
  gamesPlayed: 12,
  gamesWon: 3,
  partialWins: 4,
  gamesLost: 5,
  totalStakePaid: 7500,
  totalAmountWon: 25000,
  netProfit: 17500,
  averageScore: 7.2,
  bestScore: 10
};

// Updated Quiz Rules
export const quizRules = [
  "Each quiz consists of exactly 10 questions with 8 answer options (A-H)",
  "Each question has its own time limit - unanswered questions automatically disappear when time elapses",
  "The stake amount is automatically deducted from your wallet when you start the game",
  "Stake distribution: 70% goes to Community Wallet, 30% goes to Mobigate",
  "Scoring: 10/10 correct = 100% winning amount, 8-9/10 correct = 20% winning amount, less than 8/10 = no prize",
  "You must have sufficient wallet balance to play any quiz game",
  "Quiz games are automatically disabled when Community Wallet balance is less than 1000% of the winning amount",
  "Access is determined by Privacy Settings - some quizzes are for Members Only while others are Public",
  "Winnings are automatically credited to your wallet upon successful completion",
  "Lost questions cannot be replaced or repeated - answer carefully!",
  "All quiz results are final and disputes must be raised within 48 hours"
];

// Helper function to check if quiz is available
export const isQuizAvailable = (quiz: Quiz, communityWalletBalance: number): { available: boolean; reason?: string } => {
  const requiredBalance = quiz.winningAmount * 10; // 1000% of winning amount
  
  if (quiz.status === "disabled") {
    return { available: false, reason: "Quiz is currently disabled" };
  }
  
  if (quiz.status === "upcoming") {
    return { available: false, reason: "Quiz has not started yet" };
  }
  
  if (quiz.status === "completed") {
    return { available: false, reason: "Quiz has ended" };
  }
  
  if (communityWalletBalance < requiredBalance) {
    return { 
      available: false, 
      reason: `Community wallet has insufficient funds. Required: ${quiz.currency} ${requiredBalance.toLocaleString()}` 
    };
  }
  
  return { available: true };
};

// Helper function to calculate winnings
export const calculateWinnings = (questionsCorrect: number, winningAmount: number): { percentage: number; amount: number; status: "won" | "partial_win" | "lost" } => {
  if (questionsCorrect === 10) {
    return { percentage: 100, amount: winningAmount, status: "won" };
  } else if (questionsCorrect >= 8) {
    return { percentage: 20, amount: winningAmount * 0.2, status: "partial_win" };
  } else {
    return { percentage: 0, amount: 0, status: "lost" };
  }
};

// Helper function to calculate stake distribution
export const calculateStakeDistribution = (stakeAmount: number): { communityShare: number; mobigateShare: number } => {
  return {
    communityShare: stakeAmount * 0.7, // 70%
    mobigateShare: stakeAmount * 0.3   // 30%
  };
};
