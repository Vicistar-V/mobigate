export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prizePool: number;
  currency: string;
  totalQuestions: number;
  timeLimit: number; // in minutes
  participants: number;
  status: "active" | "upcoming" | "completed";
  startDate?: Date;
  endDate?: Date;
  questions?: QuizQuestion[];
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  playerAvatar: string;
  score: number;
  completionTime: string;
  rank: number;
}

export const quizCategories = [
  "General Knowledge",
  "Community Trivia",
  "Fun Facts",
  "History & Culture",
  "Sports & Entertainment",
  "Current Affairs"
];

export const activeQuizzes: Quiz[] = [
  {
    id: "quiz-1",
    title: "Community Heritage Quiz",
    description: "Test your knowledge about our community's rich history and traditions",
    category: "Community Trivia",
    difficulty: "Medium",
    prizePool: 50000,
    currency: "NGN",
    totalQuestions: 20,
    timeLimit: 15,
    participants: 156,
    status: "active",
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  {
    id: "quiz-2",
    title: "General Knowledge Challenge",
    description: "Wide-ranging questions covering various topics. Perfect for knowledge enthusiasts!",
    category: "General Knowledge",
    difficulty: "Hard",
    prizePool: 100000,
    currency: "NGN",
    totalQuestions: 30,
    timeLimit: 20,
    participants: 243,
    status: "active",
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
  },
  {
    id: "quiz-3",
    title: "Fun Facts Friday",
    description: "Light-hearted trivia about interesting facts from around the world",
    category: "Fun Facts",
    difficulty: "Easy",
    prizePool: 25000,
    currency: "NGN",
    totalQuestions: 15,
    timeLimit: 10,
    participants: 89,
    status: "active",
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
  },
  {
    id: "quiz-4",
    title: "Sports Champions Quiz",
    description: "Test your sports knowledge across football, basketball, athletics and more",
    category: "Sports & Entertainment",
    difficulty: "Medium",
    prizePool: 75000,
    currency: "NGN",
    totalQuestions: 25,
    timeLimit: 18,
    participants: 178,
    status: "upcoming",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Starts in 3 days
  }
];

export const leaderboard: LeaderboardEntry[] = [
  {
    id: "1",
    playerName: "Chukwudi Okafor",
    playerAvatar: "/placeholder.svg",
    score: 2850,
    completionTime: "12:45",
    rank: 1
  },
  {
    id: "2",
    playerName: "Amina Hassan",
    playerAvatar: "/placeholder.svg",
    score: 2720,
    completionTime: "13:20",
    rank: 2
  },
  {
    id: "3",
    playerName: "Emeka Nwosu",
    playerAvatar: "/placeholder.svg",
    score: 2680,
    completionTime: "14:05",
    rank: 3
  },
  {
    id: "4",
    playerName: "Fatima Bello",
    playerAvatar: "/placeholder.svg",
    score: 2550,
    completionTime: "13:55",
    rank: 4
  },
  {
    id: "5",
    playerName: "Tunde Adeyemi",
    playerAvatar: "/placeholder.svg",
    score: 2480,
    completionTime: "14:30",
    rank: 5
  },
  {
    id: "6",
    playerName: "Ngozi Okeke",
    playerAvatar: "/placeholder.svg",
    score: 2410,
    completionTime: "15:10",
    rank: 6
  },
  {
    id: "7",
    playerName: "Ibrahim Musa",
    playerAvatar: "/placeholder.svg",
    score: 2350,
    completionTime: "14:50",
    rank: 7
  },
  {
    id: "8",
    playerName: "Chioma Eze",
    playerAvatar: "/placeholder.svg",
    score: 2290,
    completionTime: "15:40",
    rank: 8
  }
];

export const quizRules = [
  "Each quiz has a time limit that must be adhered to",
  "Once you start a quiz, you must complete it in one session",
  "You can only attempt each quiz once",
  "Winners are determined by highest score and fastest completion time",
  "Prize money is distributed to top 10 performers",
  "Cheating or using external help will result in disqualification",
  "Results are published within 24 hours of quiz completion"
];
