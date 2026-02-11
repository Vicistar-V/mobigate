// Mock data for Scholarship Quiz Game

export interface ScholarshipTier {
  id: string;
  name: string;
  annualBudget: number; // in Mobi
  description: string;
}

export const mockScholarshipTiers: ScholarshipTier[] = [
  { id: "st1", name: "Primary Education", annualBudget: 150000, description: "Cover tuition, books, and uniforms for primary school" },
  { id: "st2", name: "Secondary Education", annualBudget: 350000, description: "Full secondary school fees including boarding" },
  { id: "st3", name: "Polytechnic/College", annualBudget: 500000, description: "Polytechnic tuition and basic accommodation" },
  { id: "st4", name: "University (Federal)", annualBudget: 750000, description: "Federal university tuition with accommodation" },
  { id: "st5", name: "University (Private)", annualBudget: 2000000, description: "Private university full tuition package" },
  { id: "st6", name: "Postgraduate Studies", annualBudget: 1500000, description: "Master's degree program fees" },
];

export const SCHOLARSHIP_STAKE_PERCENTAGE = 0.20; // 20% of budget
export const SCHOLARSHIP_QUESTIONS_TOTAL = 15;
export const SCHOLARSHIP_OBJECTIVE_COUNT = 10;
export const SCHOLARSHIP_NON_OBJECTIVE_COUNT = 5;
export const SCHOLARSHIP_PRIZE_DELAY_DAYS = 21;
export const SCHOLARSHIP_BONUS_THRESHOLD = 70; // 70% correct = eligible for bonus
