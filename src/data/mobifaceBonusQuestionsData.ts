// Separate bonus questions pool for Food for Home and Scholarship quizzes

export interface BonusQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export const bonusQuestionsPool: BonusQuestion[] = [
  { id: "bq1", question: "What is the chemical symbol for gold?", options: ["Ag", "Fe", "Au", "Cu", "Pt", "Zn", "Pb", "Sn"], correctAnswer: 2, category: "Science" },
  { id: "bq2", question: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn", "Mercury", "Neptune", "Uranus", "Pluto"], correctAnswer: 2, category: "Science" },
  { id: "bq3", question: "What year did Nigeria gain independence?", options: ["1958", "1959", "1960", "1961", "1962", "1963", "1957", "1956"], correctAnswer: 2, category: "History" },
  { id: "bq4", question: "What is the largest ocean in the world?", options: ["Atlantic", "Indian", "Pacific", "Arctic", "Southern", "Mediterranean", "Caribbean", "Baltic"], correctAnswer: 2, category: "Geography" },
];

export const BONUS_ACCEPT_TIMEOUT_SECONDS = 30;
export const BONUS_QUESTIONS_COUNT = 4;
export const BONUS_STAKE_MULTIPLIER = 0.50; // 50% of original stake
