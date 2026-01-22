// Community Quiz - Community-specific quiz questions and data
// Theme: Blue - Focus on community history, members, traditions

export interface CommunityQuizQuestion {
  id: string;
  question: string;
  options: string[]; // 8 options (A-H)
  correctAnswer: number; // Index 0-7
  correctAnswerLabel: string;
  timeLimit: number;
  points: number;
  category: string;
}

export interface CommunityQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  stakeAmount: number;
  winningAmount: number;
  currency: string;
  totalQuestions: 10;
  timeLimitPerQuestion: number;
  participants: number;
  gamesPlayed: number;
  status: "active" | "upcoming" | "completed" | "disabled";
  privacySetting: "members_only" | "public";
  startDate?: Date;
  endDate?: Date;
  questions?: CommunityQuizQuestion[];
  communityId: string;
  badge?: string;
}

export interface CommunityQuizLeaderboardEntry {
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
  memberSince?: string;
}

export interface CommunityQuizStats {
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
  communityRank: number;
}

export interface CommunityQuizWallet {
  communityId: string;
  balance: number;
  totalStakesReceived: number;
  totalPayouts: number;
  lastUpdated: Date;
}

export const COMMUNITY_ANSWER_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

// Community-focused question categories
export const communityQuizCategories = [
  "Community History",
  "Member Spotlight",
  "Community Traditions",
  "Leadership & Governance",
  "Events & Milestones",
  "Community Culture",
  "Local Knowledge",
  "Member Achievements"
];

// Community-specific questions
const communityQuestions: CommunityQuizQuestion[] = [
  {
    id: "cq1",
    question: "What year was our community officially founded?",
    options: ["2010", "2012", "2015", "2018", "2019", "2020", "2021", "2022"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 30,
    points: 10,
    category: "Community History"
  },
  {
    id: "cq2",
    question: "Who was the first president of our community?",
    options: ["Chief Okonkwo", "Dr. Amina Bello", "Prof. Eze Williams", "Elder Musa Ibrahim", "Mrs. Ngozi Okafor", "Mr. Tunde Adeyemi", "Chief Fatima Hassan", "Dr. Emeka Nwosu"],
    correctAnswer: 1,
    correctAnswerLabel: "B",
    timeLimit: 30,
    points: 10,
    category: "Leadership & Governance"
  },
  {
    id: "cq3",
    question: "What is the official motto of our community?",
    options: ["Unity is Strength", "Together We Rise", "One Heart, One Goal", "Progress Through Unity", "Strength in Diversity", "Forward Together", "United We Stand", "Building Tomorrow"],
    correctAnswer: 0,
    correctAnswerLabel: "A",
    timeLimit: 30,
    points: 10,
    category: "Community Culture"
  },
  {
    id: "cq4",
    question: "How many founding members started our community?",
    options: ["5", "7", "10", "12", "15", "20", "25", "30"],
    correctAnswer: 3,
    correctAnswerLabel: "D",
    timeLimit: 30,
    points: 10,
    category: "Community History"
  },
  {
    id: "cq5",
    question: "What month do we celebrate our annual community day?",
    options: ["January", "March", "May", "July", "August", "September", "October", "December"],
    correctAnswer: 4,
    correctAnswerLabel: "E",
    timeLimit: 30,
    points: 10,
    category: "Events & Milestones"
  },
  {
    id: "cq6",
    question: "What is the name of our community newsletter?",
    options: ["The Beacon", "Community Voice", "Unity Times", "Progress Report", "Together News", "Our Heritage", "The Connector", "Community Pulse"],
    correctAnswer: 1,
    correctAnswerLabel: "B",
    timeLimit: 30,
    points: 10,
    category: "Community Culture"
  },
  {
    id: "cq7",
    question: "How many executive positions are in our community leadership?",
    options: ["3", "5", "7", "9", "10", "12", "15", "18"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 30,
    points: 10,
    category: "Leadership & Governance"
  },
  {
    id: "cq8",
    question: "What is the minimum age requirement to join as a full member?",
    options: ["16", "18", "21", "25", "30", "No limit", "15", "20"],
    correctAnswer: 1,
    correctAnswerLabel: "B",
    timeLimit: 30,
    points: 10,
    category: "Community Traditions"
  },
  {
    id: "cq9",
    question: "Who won the 'Member of the Year' award last year?",
    options: ["Ade Johnson", "Chioma Nwosu", "Ibrahim Suleiman", "Grace Okonkwo", "Peter Adegoke", "Fatima Bello", "Samuel Eze", "Mary Okafor"],
    correctAnswer: 3,
    correctAnswerLabel: "D",
    timeLimit: 30,
    points: 10,
    category: "Member Achievements"
  },
  {
    id: "cq10",
    question: "What is the official color of our community?",
    options: ["Red", "Blue", "Green", "Purple", "Orange", "Gold", "Maroon", "Teal"],
    correctAnswer: 5,
    correctAnswerLabel: "F",
    timeLimit: 30,
    points: 10,
    category: "Community Culture"
  }
];

// Additional question sets for variety
const communityHistoryQuestions: CommunityQuizQuestion[] = [
  {
    id: "ch1",
    question: "Where was the first community meeting held?",
    options: ["Town Hall", "Church Premises", "School Building", "Private Residence", "Community Center", "Hotel Conference Room", "Open Field", "Cultural Center"],
    correctAnswer: 3,
    correctAnswerLabel: "D",
    timeLimit: 30,
    points: 10,
    category: "Community History"
  },
  {
    id: "ch2",
    question: "What was the initial membership fee when the community started?",
    options: ["₦500", "₦1,000", "₦2,000", "₦5,000", "₦10,000", "Free", "₦3,000", "₦7,500"],
    correctAnswer: 1,
    correctAnswerLabel: "B",
    timeLimit: 30,
    points: 10,
    category: "Community History"
  },
  {
    id: "ch3",
    question: "Which year did we launch our first scholarship program?",
    options: ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
    correctAnswer: 3,
    correctAnswerLabel: "D",
    timeLimit: 30,
    points: 10,
    category: "Events & Milestones"
  },
  {
    id: "ch4",
    question: "How many scholarships have we awarded to date?",
    options: ["10", "25", "50", "75", "100", "150", "200", "250"],
    correctAnswer: 4,
    correctAnswerLabel: "E",
    timeLimit: 30,
    points: 10,
    category: "Member Achievements"
  },
  {
    id: "ch5",
    question: "What is our community's official anthem called?",
    options: ["Rise Together", "Our Heritage", "Unity Song", "The Bond", "Together Strong", "Community Hymn", "One Family", "Forward March"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 30,
    points: 10,
    category: "Community Culture"
  },
  {
    id: "ch6",
    question: "Who designed our community logo?",
    options: ["A Professional Agency", "A Member Volunteer", "The Founder", "A Design Competition Winner", "External Consultant", "Youth Committee", "Anonymous Donor", "Founding Committee"],
    correctAnswer: 3,
    correctAnswerLabel: "D",
    timeLimit: 30,
    points: 10,
    category: "Community History"
  },
  {
    id: "ch7",
    question: "What is the name of our annual charity event?",
    options: ["Give Back Day", "Community Care", "Hearts United", "Helping Hands", "Love in Action", "Charity Gala", "Unity Outreach", "Kindness Week"],
    correctAnswer: 4,
    correctAnswerLabel: "E",
    timeLimit: 30,
    points: 10,
    category: "Events & Milestones"
  },
  {
    id: "ch8",
    question: "How many states/regions do our members come from?",
    options: ["5", "10", "15", "20", "25", "30", "35", "All 36"],
    correctAnswer: 5,
    correctAnswerLabel: "F",
    timeLimit: 30,
    points: 10,
    category: "Member Spotlight"
  },
  {
    id: "ch9",
    question: "What year did we acquire our permanent community center?",
    options: ["2017", "2018", "2019", "2020", "2021", "2022", "Not yet acquired", "2023"],
    correctAnswer: 4,
    correctAnswerLabel: "E",
    timeLimit: 30,
    points: 10,
    category: "Community History"
  },
  {
    id: "ch10",
    question: "Who is our current community patron?",
    options: ["Chief Adeyemo", "Dr. Okonjo-Iweala", "Prof. Yakubu", "Senator Ndume", "Gov. Sanwo-Olu", "Chief Mrs. Alakija", "Dr. Dangote", "Prof. Soludo"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 30,
    points: 10,
    category: "Leadership & Governance"
  }
];

// Active Community Quizzes
export const activeCommunityQuizzes: CommunityQuiz[] = [
  {
    id: "comm-quiz-1",
    title: "Community Heritage Challenge",
    description: "Test your knowledge about our community's rich history and founding principles",
    category: "Community History",
    difficulty: "Medium",
    stakeAmount: 300,
    winningAmount: 3000,
    currency: "NGN",
    totalQuestions: 10,
    timeLimitPerQuestion: 35,
    participants: 89,
    gamesPlayed: 234,
    status: "active",
    privacySetting: "members_only",
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    questions: communityQuestions,
    communityId: "comm-1",
    badge: "🏆"
  },
  {
    id: "comm-quiz-2",
    title: "Know Your Leaders",
    description: "How well do you know our community executives and their achievements?",
    category: "Leadership & Governance",
    difficulty: "Hard",
    stakeAmount: 500,
    winningAmount: 5000,
    currency: "NGN",
    totalQuestions: 10,
    timeLimitPerQuestion: 25,
    participants: 156,
    gamesPlayed: 412,
    status: "active",
    privacySetting: "members_only",
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    questions: communityHistoryQuestions,
    communityId: "comm-1",
    badge: "👑"
  },
  {
    id: "comm-quiz-3",
    title: "Founding Members Trivia",
    description: "Celebrate our founders by testing your knowledge about them",
    category: "Member Spotlight",
    difficulty: "Easy",
    stakeAmount: 200,
    winningAmount: 2000,
    currency: "NGN",
    totalQuestions: 10,
    timeLimitPerQuestion: 45,
    participants: 67,
    gamesPlayed: 189,
    status: "active",
    privacySetting: "members_only",
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    questions: communityQuestions,
    communityId: "comm-1",
    badge: "⭐"
  },
  {
    id: "comm-quiz-4",
    title: "Annual Day Special Quiz",
    description: "Special quiz celebrating our community anniversary - Double prizes!",
    category: "Events & Milestones",
    difficulty: "Medium",
    stakeAmount: 1000,
    winningAmount: 15000,
    currency: "NGN",
    totalQuestions: 10,
    timeLimitPerQuestion: 30,
    participants: 0,
    gamesPlayed: 0,
    status: "upcoming",
    privacySetting: "members_only",
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    questions: communityHistoryQuestions,
    communityId: "comm-1",
    badge: "🎉"
  }
];

// Community Quiz Leaderboard
export const communityQuizLeaderboard: CommunityQuizLeaderboardEntry[] = [
  {
    id: "cl1",
    playerId: "member-1",
    playerName: "Chidinma Okafor",
    playerAvatar: "/placeholder.svg",
    score: 100,
    questionsCorrect: 10,
    winningPercentage: 100,
    amountWon: 5000,
    completionTime: "3:45",
    playedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    rank: 1,
    memberSince: "2018"
  },
  {
    id: "cl2",
    playerId: "member-2",
    playerName: "Adebayo Johnson",
    playerAvatar: "/placeholder.svg",
    score: 100,
    questionsCorrect: 10,
    winningPercentage: 100,
    amountWon: 3000,
    completionTime: "4:12",
    playedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    rank: 2,
    memberSince: "2019"
  },
  {
    id: "cl3",
    playerId: "member-3",
    playerName: "Fatima Abubakar",
    playerAvatar: "/placeholder.svg",
    score: 90,
    questionsCorrect: 9,
    winningPercentage: 50,
    amountWon: 2500,
    completionTime: "4:30",
    playedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    rank: 3,
    memberSince: "2020"
  },
  {
    id: "cl4",
    playerId: "member-4",
    playerName: "Emeka Nwosu",
    playerAvatar: "/placeholder.svg",
    score: 90,
    questionsCorrect: 9,
    winningPercentage: 50,
    amountWon: 1500,
    completionTime: "4:55",
    playedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    rank: 4,
    memberSince: "2017"
  },
  {
    id: "cl5",
    playerId: "member-5",
    playerName: "Grace Eze",
    playerAvatar: "/placeholder.svg",
    score: 80,
    questionsCorrect: 8,
    winningPercentage: 50,
    amountWon: 1000,
    completionTime: "5:10",
    playedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    rank: 5,
    memberSince: "2021"
  }
];

// Community Quiz Player Stats
export const communityQuizPlayerStats: CommunityQuizStats = {
  playerId: "current-user",
  playerName: "You",
  gamesPlayed: 8,
  gamesWon: 2,
  partialWins: 3,
  gamesLost: 3,
  totalStakePaid: 3200,
  totalAmountWon: 11000,
  netProfit: 7800,
  averageScore: 7.5,
  bestScore: 10,
  communityRank: 12
};

// Community Quiz Wallet
export const communityQuizWalletData: CommunityQuizWallet = {
  communityId: "comm-1",
  balance: 180000,
  totalStakesReceived: 125000,
  totalPayouts: 95000,
  lastUpdated: new Date()
};

// Community Quiz Rules
export const communityQuizRules = [
  "Community Quizzes are exclusive to registered community members only",
  "Each quiz focuses on our community's history, culture, and achievements",
  "10 questions per quiz with 8 answer options (A-H) each",
  "Stakes support community development projects and scholarships",
  "100% correct = Full prize | 8-9 correct = 50% prize | Below 8 = No prize",
  "All proceeds (minus Mobigate fees) go to the Community Development Fund",
  "Top performers each month receive special recognition at community meetings",
  "Quiz topics rotate monthly to cover different aspects of our community",
  "Members who win 3 consecutive quizzes earn the 'Quiz Champion' badge",
  "Questions are reviewed and approved by the Community Education Committee"
];

// Helper functions
export const isCommunityQuizAvailable = (quiz: CommunityQuiz, walletBalance: number): { available: boolean; reason?: string } => {
  const requiredBalance = quiz.winningAmount * 10;
  
  if (quiz.status === "disabled") {
    return { available: false, reason: "Quiz is currently disabled" };
  }
  
  if (quiz.status === "upcoming") {
    return { available: false, reason: "Quiz has not started yet" };
  }
  
  if (quiz.status === "completed") {
    return { available: false, reason: "Quiz has ended" };
  }
  
  if (walletBalance < requiredBalance) {
    return { 
      available: false, 
      reason: `Community wallet has insufficient funds` 
    };
  }
  
  return { available: true };
};

export const calculateCommunityWinnings = (questionsCorrect: number, winningAmount: number): { percentage: number; amount: number; status: "won" | "partial_win" | "lost" } => {
  if (questionsCorrect === 10) {
    return { percentage: 100, amount: winningAmount, status: "won" };
  } else if (questionsCorrect >= 8) {
    return { percentage: 50, amount: winningAmount * 0.5, status: "partial_win" };
  } else {
    return { percentage: 0, amount: 0, status: "lost" };
  }
};
