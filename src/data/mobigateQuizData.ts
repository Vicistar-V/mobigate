// Mobigate Quiz - Platform-wide global quiz questions and data
// Theme: Amber/Orange - Global knowledge, trending topics, entertainment

export interface MobigateQuizQuestion {
  id: string;
  question: string;
  options: string[]; // 8 options (A-H)
  correctAnswer: number; // Index 0-7
  correctAnswerLabel: string;
  timeLimit: number;
  points: number;
  category: string;
}

export interface MobigateQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  stakeAmount: number;
  winningAmount: number;
  currency: string;
  totalQuestions: 10;
  timeLimitPerQuestion: number;
  participants: number;
  gamesPlayed: number;
  status: "active" | "upcoming" | "completed" | "disabled" | "trending";
  isSponsored?: boolean;
  sponsorName?: string;
  sponsorLogo?: string;
  startDate?: Date;
  endDate?: Date;
  questions?: MobigateQuizQuestion[];
  prizePool?: number;
  badge?: string;
}

export interface MobigateLeaderboardEntry {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  country: string;
  countryFlag: string;
  score: number;
  questionsCorrect: number;
  winningPercentage: number;
  amountWon: number;
  completionTime: string;
  playedAt: Date;
  rank: number;
  streak?: number;
}

export interface MobigatePlayerStats {
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
  globalRank: number;
  currentStreak: number;
  longestStreak: number;
  favoriteCategory: string;
}

export interface MobigateWallet {
  balance: number;
  totalEarnings: number;
  totalSpent: number;
  lastUpdated: Date;
}

export const MOBIGATE_ANSWER_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

// Global quiz categories
export const mobigateQuizCategories = [
  "World Trivia",
  "Pop Culture",
  "Science & Tech",
  "Sports Champions",
  "Entertainment",
  "History Makers",
  "Geography Explorer",
  "Current Affairs"
];

// Global knowledge questions
const globalKnowledgeQuestions: MobigateQuizQuestion[] = [
  {
    id: "mq1",
    question: "Which country has won the most FIFA World Cup titles?",
    options: ["Germany", "Argentina", "Brazil", "France", "Italy", "Spain", "England", "Uruguay"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Sports Champions"
  },
  {
    id: "mq2",
    question: "Who painted the Mona Lisa?",
    options: ["Michelangelo", "Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Raphael", "Rembrandt", "Claude Monet", "Salvador Dalí"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "History Makers"
  },
  {
    id: "mq3",
    question: "What is the largest planet in our solar system?",
    options: ["Saturn", "Neptune", "Jupiter", "Uranus", "Earth", "Mars", "Venus", "Mercury"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Science & Tech"
  },
  {
    id: "mq4",
    question: "Which streaming platform released 'Squid Game'?",
    options: ["Amazon Prime", "Disney+", "Netflix", "HBO Max", "Apple TV+", "Hulu", "Paramount+", "Peacock"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Entertainment"
  },
  {
    id: "mq5",
    question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane", "Perth", "Adelaide", "Darwin", "Hobart"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Geography Explorer"
  },
  {
    id: "mq6",
    question: "Who is the current CEO of Tesla?",
    options: ["Jeff Bezos", "Tim Cook", "Elon Musk", "Mark Zuckerberg", "Sundar Pichai", "Satya Nadella", "Bill Gates", "Larry Page"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Current Affairs"
  },
  {
    id: "mq7",
    question: "Which artist has the most Grammy Awards in history?",
    options: ["Michael Jackson", "Quincy Jones", "Beyoncé", "Stevie Wonder", "Taylor Swift", "Adele", "Paul Simon", "Kanye West"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Pop Culture"
  },
  {
    id: "mq8",
    question: "What year did the first iPhone launch?",
    options: ["2005", "2006", "2007", "2008", "2009", "2010", "2004", "2011"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Science & Tech"
  },
  {
    id: "mq9",
    question: "Which country hosted the 2022 FIFA World Cup?",
    options: ["Russia", "Brazil", "Qatar", "USA", "Germany", "England", "France", "Japan"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Sports Champions"
  },
  {
    id: "mq10",
    question: "What is the most spoken language in the world by total speakers?",
    options: ["Spanish", "Hindi", "English", "Mandarin Chinese", "Arabic", "Portuguese", "Bengali", "French"],
    correctAnswer: 3,
    correctAnswerLabel: "D",
    timeLimit: 25,
    points: 10,
    category: "World Trivia"
  }
];

// Pop culture and entertainment questions
const popCultureQuestions: MobigateQuizQuestion[] = [
  {
    id: "pc1",
    question: "Which K-pop group performed at the 2022 FIFA World Cup closing ceremony?",
    options: ["BLACKPINK", "TWICE", "BTS", "EXO", "Stray Kids", "NCT", "Red Velvet", "aespa"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Pop Culture"
  },
  {
    id: "pc2",
    question: "What is the highest-grossing film of all time (adjusted for inflation)?",
    options: ["Avengers: Endgame", "Titanic", "Avatar", "Star Wars", "Gone with the Wind", "The Lion King", "Jurassic Park", "Spider-Man: No Way Home"],
    correctAnswer: 4,
    correctAnswerLabel: "E",
    timeLimit: 25,
    points: 10,
    category: "Entertainment"
  },
  {
    id: "pc3",
    question: "Which social media platform is owned by ByteDance?",
    options: ["Instagram", "Snapchat", "TikTok", "Twitter", "YouTube", "Pinterest", "WhatsApp", "Telegram"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Science & Tech"
  },
  {
    id: "pc4",
    question: "Who wrote the Harry Potter series?",
    options: ["Stephen King", "Dan Brown", "J.K. Rowling", "George R.R. Martin", "Rick Riordan", "Suzanne Collins", "Stephenie Meyer", "John Green"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Entertainment"
  },
  {
    id: "pc5",
    question: "Which footballer has won the most Ballon d'Or awards?",
    options: ["Cristiano Ronaldo", "Pelé", "Lionel Messi", "Diego Maradona", "Zinedine Zidane", "Ronaldinho", "Neymar", "Kylian Mbappé"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Sports Champions"
  },
  {
    id: "pc6",
    question: "What is the name of Elon Musk's space company?",
    options: ["Blue Origin", "Virgin Galactic", "SpaceX", "Rocket Lab", "Boeing", "Lockheed Martin", "Northrop Grumman", "Sierra Nevada"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Science & Tech"
  },
  {
    id: "pc7",
    question: "Which artist released the album 'Renaissance' in 2022?",
    options: ["Rihanna", "Taylor Swift", "Beyoncé", "Adele", "Lady Gaga", "Dua Lipa", "Ariana Grande", "Billie Eilish"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Pop Culture"
  },
  {
    id: "pc8",
    question: "What cryptocurrency was created by Satoshi Nakamoto?",
    options: ["Ethereum", "Dogecoin", "Bitcoin", "Litecoin", "Ripple", "Cardano", "Solana", "Polkadot"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Science & Tech"
  },
  {
    id: "pc9",
    question: "Which streaming service produced 'The Mandalorian'?",
    options: ["Netflix", "Amazon Prime", "Disney+", "HBO Max", "Apple TV+", "Hulu", "Paramount+", "Peacock"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Entertainment"
  },
  {
    id: "pc10",
    question: "Who is the most followed person on Instagram?",
    options: ["Kylie Jenner", "Dwayne Johnson", "Cristiano Ronaldo", "Kim Kardashian", "Ariana Grande", "Selena Gomez", "Beyoncé", "Justin Bieber"],
    correctAnswer: 2,
    correctAnswerLabel: "C",
    timeLimit: 25,
    points: 10,
    category: "Pop Culture"
  }
];

// Active Mobigate Quizzes
export const activeMobigateQuizzes: MobigateQuiz[] = [
  {
    id: "mobi-quiz-1",
    title: "🌍 World Trivia Champion",
    description: "Test your global knowledge across countries, cultures, and current events!",
    category: "World Trivia",
    difficulty: "Medium",
    stakeAmount: 500,
    winningAmount: 5000,
    currency: "MOBI",
    totalQuestions: 10,
    timeLimitPerQuestion: 25,
    participants: 2847,
    gamesPlayed: 8934,
    status: "trending",
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    questions: globalKnowledgeQuestions,
    prizePool: 500000,
    badge: "🌍"
  },
  {
    id: "mobi-quiz-2",
    title: "🎬 Pop Culture Showdown",
    description: "Movies, music, celebrities, and viral trends - how well do you know pop culture?",
    category: "Pop Culture",
    difficulty: "Easy",
    stakeAmount: 300,
    winningAmount: 3000,
    currency: "MOBI",
    totalQuestions: 10,
    timeLimitPerQuestion: 30,
    participants: 4521,
    gamesPlayed: 12456,
    status: "active",
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    questions: popCultureQuestions,
    prizePool: 750000,
    badge: "🎬"
  },
  {
    id: "mobi-quiz-3",
    title: "⚽ Sports Legends Quiz",
    description: "From football to basketball, cricket to tennis - prove you're the ultimate sports fan!",
    category: "Sports Champions",
    difficulty: "Hard",
    stakeAmount: 1000,
    winningAmount: 10000,
    currency: "MOBI",
    totalQuestions: 10,
    timeLimitPerQuestion: 20,
    participants: 1893,
    gamesPlayed: 5672,
    status: "active",
    isSponsored: true,
    sponsorName: "SportsBet",
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    questions: globalKnowledgeQuestions,
    prizePool: 1000000,
    badge: "⚽"
  },
  {
    id: "mobi-quiz-4",
    title: "🚀 Tech Titans Challenge",
    description: "Silicon Valley to Space - test your knowledge of technology and innovation!",
    category: "Science & Tech",
    difficulty: "Expert",
    stakeAmount: 2000,
    winningAmount: 25000,
    currency: "MOBI",
    totalQuestions: 10,
    timeLimitPerQuestion: 20,
    participants: 987,
    gamesPlayed: 2341,
    status: "active",
    isSponsored: true,
    sponsorName: "TechCrunch",
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    questions: popCultureQuestions,
    prizePool: 2500000,
    badge: "🚀"
  },
  {
    id: "mobi-quiz-5",
    title: "🎉 Weekend Mega Quiz",
    description: "Massive prizes this weekend! Mixed categories, maximum fun!",
    category: "Entertainment",
    difficulty: "Medium",
    stakeAmount: 1500,
    winningAmount: 20000,
    currency: "MOBI",
    totalQuestions: 10,
    timeLimitPerQuestion: 25,
    participants: 0,
    gamesPlayed: 0,
    status: "upcoming",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    questions: globalKnowledgeQuestions,
    prizePool: 5000000,
    badge: "🎉"
  }
];

// Mobigate Global Leaderboard
export const mobigateLeaderboard: MobigateLeaderboardEntry[] = [
  {
    id: "ml1",
    playerId: "global-1",
    playerName: "QuizMaster_NG",
    playerAvatar: "/placeholder.svg",
    country: "Nigeria",
    countryFlag: "🇳🇬",
    score: 100,
    questionsCorrect: 10,
    winningPercentage: 100,
    amountWon: 25000,
    completionTime: "2:58",
    playedAt: new Date(Date.now() - 30 * 60 * 1000),
    rank: 1,
    streak: 7
  },
  {
    id: "ml2",
    playerId: "global-2",
    playerName: "BrainStorm_GH",
    playerAvatar: "/placeholder.svg",
    country: "Ghana",
    countryFlag: "🇬🇭",
    score: 100,
    questionsCorrect: 10,
    winningPercentage: 100,
    amountWon: 10000,
    completionTime: "3:12",
    playedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    rank: 2,
    streak: 5
  },
  {
    id: "ml3",
    playerId: "global-3",
    playerName: "TriviaKing_KE",
    playerAvatar: "/placeholder.svg",
    country: "Kenya",
    countryFlag: "🇰🇪",
    score: 100,
    questionsCorrect: 10,
    winningPercentage: 100,
    amountWon: 5000,
    completionTime: "3:25",
    playedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    rank: 3,
    streak: 3
  },
  {
    id: "ml4",
    playerId: "global-4",
    playerName: "QuizWhiz_ZA",
    playerAvatar: "/placeholder.svg",
    country: "South Africa",
    countryFlag: "🇿🇦",
    score: 90,
    questionsCorrect: 9,
    winningPercentage: 50,
    amountWon: 12500,
    completionTime: "3:40",
    playedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    rank: 4,
    streak: 2
  },
  {
    id: "ml5",
    playerId: "global-5",
    playerName: "SmartPlayer_EG",
    playerAvatar: "/placeholder.svg",
    country: "Egypt",
    countryFlag: "🇪🇬",
    score: 90,
    questionsCorrect: 9,
    winningPercentage: 50,
    amountWon: 5000,
    completionTime: "3:55",
    playedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    rank: 5,
    streak: 1
  },
  {
    id: "ml6",
    playerId: "global-6",
    playerName: "GeekMode_TZ",
    playerAvatar: "/placeholder.svg",
    country: "Tanzania",
    countryFlag: "🇹🇿",
    score: 80,
    questionsCorrect: 8,
    winningPercentage: 50,
    amountWon: 1500,
    completionTime: "4:10",
    playedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    rank: 6,
    streak: 0
  }
];

// Mobigate Player Stats
export const mobigatePlayerStats: MobigatePlayerStats = {
  playerId: "current-user",
  playerName: "You",
  gamesPlayed: 24,
  gamesWon: 8,
  partialWins: 9,
  gamesLost: 7,
  totalStakePaid: 18500,
  totalAmountWon: 67500,
  netProfit: 49000,
  averageScore: 7.8,
  bestScore: 10,
  globalRank: 156,
  currentStreak: 2,
  longestStreak: 5,
  favoriteCategory: "Pop Culture"
};

// Mobigate Wallet
export const mobigateWalletData: MobigateWallet = {
  balance: 25000,
  totalEarnings: 67500,
  totalSpent: 42500,
  lastUpdated: new Date()
};

// Mobigate Quiz Rules
export const mobigateQuizRules = [
  "Mobigate Quizzes are open to all registered Mobigate users worldwide",
  "Compete with players from around the world for massive prizes",
  "10 questions per quiz with 8 answer options (A-H) each",
  "Faster completion times give you higher rankings on the leaderboard",
  "100% correct = Full prize | 8-9 correct = 50% prize | Below 8 = No prize",
  "Build winning streaks to earn bonus multipliers and badges",
  "Top 10 weekly players earn exclusive rewards and recognition",
  "Sponsored quizzes may offer additional prizes from partners",
  "New quizzes added daily covering trending topics and categories",
  "Global rankings reset weekly - climb to the top every week!"
];

// Helper functions
export const isMobigateQuizAvailable = (quiz: MobigateQuiz): { available: boolean; reason?: string } => {
  if (quiz.status === "disabled") {
    return { available: false, reason: "Quiz is currently disabled" };
  }
  
  if (quiz.status === "upcoming") {
    return { available: false, reason: "Quiz has not started yet" };
  }
  
  if (quiz.status === "completed") {
    return { available: false, reason: "Quiz has ended" };
  }
  
  return { available: true };
};

export const calculateMobigateWinnings = (questionsCorrect: number, winningAmount: number): { percentage: number; amount: number; status: "won" | "partial_win" | "lost" } => {
  if (questionsCorrect === 10) {
    return { percentage: 100, amount: winningAmount, status: "won" };
  } else if (questionsCorrect >= 8) {
    return { percentage: 50, amount: winningAmount * 0.5, status: "partial_win" };
  } else {
    return { percentage: 0, amount: 0, status: "lost" };
  }
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case "Easy": return "bg-green-500/10 text-green-600 border-green-500/30";
    case "Medium": return "bg-amber-500/10 text-amber-600 border-amber-500/30";
    case "Hard": return "bg-orange-500/10 text-orange-600 border-orange-500/30";
    case "Expert": return "bg-red-500/10 text-red-600 border-red-500/30";
    default: return "bg-muted text-muted-foreground";
  }
};
