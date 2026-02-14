// Separate question pools for each quiz type
import { type AdminQuizQuestion } from "./mobigateQuizQuestionsData";

export type QuizType = "group" | "standard" | "interactive" | "food" | "scholarship";

export const QUIZ_TYPE_LABELS: Record<QuizType, string> = {
  group: "Group Quiz",
  standard: "Standard Solo",
  interactive: "Interactive Quiz",
  food: "Food for Home",
  scholarship: "Scholarship Quiz",
};

export const QUIZ_TYPE_ICONS: Record<QuizType, string> = {
  group: "👥",
  standard: "⚡",
  interactive: "📡",
  food: "🍽️",
  scholarship: "🎓",
};

export const QUIZ_TYPE_COLORS: Record<QuizType, string> = {
  group: "text-blue-500",
  standard: "text-amber-500",
  interactive: "text-purple-500",
  food: "text-emerald-500",
  scholarship: "text-rose-500",
};

// Interactive quiz questions have an extra merchantId field
export interface InteractiveQuizQuestion extends AdminQuizQuestion {
  merchantId?: string; // null = Global Pool
  mixedCategories?: boolean;
}

export const INITIAL_GROUP_QUESTIONS: AdminQuizQuestion[] = [
  {
    id: "gq-1", question: "Which country has won the most FIFA World Cup titles?",
    options: ["Germany", "Argentina", "Brazil", "France", "Italy", "Spain", "England", "Uruguay"],
    correctAnswerIndex: 2, category: "Sports and Physical Fitness", difficulty: "Medium",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:00:00Z", status: "active", timesAsked: 1, freezeCount: 0,
  },
  {
    id: "gq-2", question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane", "Perth", "Adelaide", "Darwin", "Hobart"],
    correctAnswerIndex: 2, category: "General and Basic Knowledge", difficulty: "Medium",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:01:00Z", status: "active", timesAsked: 0, freezeCount: 0,
  },
  {
    id: "gq-3", question: "Who painted the Mona Lisa?",
    options: ["Michelangelo", "Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Raphael", "Rembrandt", "Claude Monet", "Salvador Dalí"],
    correctAnswerIndex: 2, category: "General and Basic Knowledge", difficulty: "Easy",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:02:00Z", status: "active", timesAsked: 3, freezeCount: 0,
  },
  {
    id: "gq-4", question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Pacific", "Arctic", "Southern", "Mediterranean", "Caribbean", "Baltic"],
    correctAnswerIndex: 2, category: "Science and Technology", difficulty: "Easy",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:03:00Z", status: "frozen", timesAsked: 5, freezeCount: 1,
  },
];

export const INITIAL_STANDARD_QUESTIONS: AdminQuizQuestion[] = [
  {
    id: "sq-1", question: "Who is the current CEO of Tesla?",
    options: ["Jeff Bezos", "Tim Cook", "Elon Musk", "Mark Zuckerberg", "Sundar Pichai", "Satya Nadella", "Bill Gates", "Larry Page"],
    correctAnswerIndex: 2, category: "Current Affairs", difficulty: "Easy",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:00:00Z", status: "active", timesAsked: 1, freezeCount: 0,
  },
  {
    id: "sq-2", question: "What year did the first iPhone launch?",
    options: ["2005", "2006", "2007", "2008", "2009", "2010", "2004", "2011"],
    correctAnswerIndex: 2, category: "Information Technology", difficulty: "Medium",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:01:00Z", status: "active", timesAsked: 2, freezeCount: 1,
  },
  {
    id: "sq-3", question: "Which streaming platform released 'Squid Game'?",
    options: ["Amazon Prime", "Disney+", "Netflix", "HBO Max", "Apple TV+", "Hulu", "Paramount+", "Peacock"],
    correctAnswerIndex: 2, category: "Entertainment and Leisure", difficulty: "Easy",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:02:00Z", status: "active", timesAsked: 2, freezeCount: 0,
  },
  {
    id: "sq-4", question: "What is the chemical symbol for gold?",
    options: ["Ag", "Fe", "Au", "Cu", "Pt", "Pb", "Hg", "Sn"],
    correctAnswerIndex: 2, category: "Science and Technology", difficulty: "Easy",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:03:00Z", status: "suspended", timesAsked: 1, freezeCount: 0,
  },
];

export const INITIAL_INTERACTIVE_QUESTIONS: InteractiveQuizQuestion[] = [
  {
    id: "iq-1", question: "What cryptocurrency was created by Satoshi Nakamoto?",
    options: ["Ethereum", "Dogecoin", "Bitcoin", "Litecoin", "Ripple", "Cardano", "Solana", "Polkadot"],
    correctAnswerIndex: 2, category: "Information Technology", difficulty: "Easy",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:00:00Z", status: "active", timesAsked: 3, freezeCount: 1,
    merchantId: "m1", mixedCategories: true,
  },
  {
    id: "iq-2", question: "Which social media platform is owned by ByteDance?",
    options: ["Instagram", "Snapchat", "TikTok", "Twitter", "YouTube", "Pinterest", "WhatsApp", "Telegram"],
    correctAnswerIndex: 2, category: "Information Technology", difficulty: "Easy",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:01:00Z", status: "active", timesAsked: 2, freezeCount: 0,
    merchantId: "m1", mixedCategories: false,
  },
  {
    id: "iq-3", question: "Which artist released the album 'Renaissance' in 2022?",
    options: ["Rihanna", "Taylor Swift", "Beyoncé", "Adele", "Lady Gaga", "Dua Lipa", "Ariana Grande", "Billie Eilish"],
    correctAnswerIndex: 2, category: "Entertainment and Leisure", difficulty: "Medium",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:02:00Z", status: "active", timesAsked: 2, freezeCount: 0,
    merchantId: undefined, mixedCategories: true, // Global Pool
  },
  {
    id: "iq-4", question: "Which K-pop group performed at the 2022 FIFA World Cup closing ceremony?",
    options: ["BLACKPINK", "TWICE", "BTS", "EXO", "Stray Kids", "NCT", "Red Velvet", "aespa"],
    correctAnswerIndex: 2, category: "Entertainment and Leisure", difficulty: "Hard",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:03:00Z", status: "frozen", timesAsked: 3, freezeCount: 2,
    merchantId: "m2", mixedCategories: false,
  },
];

export const INITIAL_FOOD_QUESTIONS: AdminQuizQuestion[] = [
  {
    id: "fq-1", question: "Which footballer has won the most Ballon d'Or awards?",
    options: ["Cristiano Ronaldo", "Pelé", "Lionel Messi", "Diego Maradona", "Zinedine Zidane", "Ronaldinho", "Neymar", "Kylian Mbappé"],
    correctAnswerIndex: 2, category: "Sports and Physical Fitness", difficulty: "Medium",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:00:00Z", status: "active", timesAsked: 1, freezeCount: 0,
  },
  {
    id: "fq-2", question: "Who wrote the Harry Potter series?",
    options: ["Stephen King", "Dan Brown", "J.K. Rowling", "George R.R. Martin", "Rick Riordan", "Suzanne Collins", "Stephenie Meyer", "John Green"],
    correctAnswerIndex: 2, category: "Literature and Reading", difficulty: "Easy",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:01:00Z", status: "active", timesAsked: 1, freezeCount: 0,
  },
  {
    id: "fq-3", question: "What is the largest planet in our solar system?",
    options: ["Saturn", "Neptune", "Jupiter", "Uranus", "Earth", "Mars", "Venus", "Mercury"],
    correctAnswerIndex: 2, category: "Science and Technology", difficulty: "Easy",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:02:00Z", status: "active", timesAsked: 2, freezeCount: 0,
  },
];

export const INITIAL_SCHOLARSHIP_QUESTIONS: AdminQuizQuestion[] = [
  {
    id: "schq-1", question: "What is the most spoken language in the world by total speakers?",
    options: ["Spanish", "Hindi", "English", "Mandarin Chinese", "Arabic", "Portuguese", "Bengali", "French"],
    correctAnswerIndex: 3, category: "General and Basic Knowledge", difficulty: "Medium",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:00:00Z", status: "active", timesAsked: 1, freezeCount: 0,
  },
  {
    id: "schq-2", question: "Who is the most followed person on Instagram?",
    options: ["Kylie Jenner", "Dwayne Johnson", "Cristiano Ronaldo", "Kim Kardashian", "Ariana Grande", "Selena Gomez", "Beyoncé", "Justin Bieber"],
    correctAnswerIndex: 2, category: "Current Affairs", difficulty: "Medium",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:01:00Z", status: "active", timesAsked: 0, freezeCount: 0,
  },
  {
    id: "schq-3", question: "What is the name of Elon Musk's space company?",
    options: ["Blue Origin", "Virgin Galactic", "SpaceX", "Rocket Lab", "Boeing", "Lockheed Martin", "Northrop Grumman", "Sierra Nevada"],
    correctAnswerIndex: 2, category: "Science and Technology", difficulty: "Easy",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:02:00Z", status: "active", timesAsked: 0, freezeCount: 0,
  },
  {
    id: "schq-4", question: "Which streaming service produced 'The Mandalorian'?",
    options: ["Netflix", "Amazon Prime", "Disney+", "HBO Max", "Apple TV+", "Hulu", "Paramount+", "Peacock"],
    correctAnswerIndex: 2, category: "Entertainment and Leisure", difficulty: "Easy",
    timeLimit: 10, points: 10, createdAt: "2025-12-01T10:03:00Z", status: "suspended", timesAsked: 1, freezeCount: 0,
  },
];

export function getQuestionsForType(quizType: QuizType): AdminQuizQuestion[] {
  switch (quizType) {
    case "group": return [...INITIAL_GROUP_QUESTIONS];
    case "standard": return [...INITIAL_STANDARD_QUESTIONS];
    case "interactive": return [...INITIAL_INTERACTIVE_QUESTIONS];
    case "food": return [...INITIAL_FOOD_QUESTIONS];
    case "scholarship": return [...INITIAL_SCHOLARSHIP_QUESTIONS];
  }
}
