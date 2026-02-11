// Pre-set quiz categories from Mobigate Quiz System
export const PRESET_QUIZ_CATEGORIES = [
  "Current Affairs",
  "Politics and Leadership",
  "Science and Technology",
  "Morals and Religion",
  "Literature and Reading",
  "Agriculture and Farming",
  "Healthcare and Medicare",
  "Transportation and Vacation",
  "Basic and General Education",
  "Sports and Physical Fitness",
  "Skills and Crafts",
  "Business and Entrepreneurship",
  "Entertainment and Leisure",
  "Environment and Society",
  "Basic Law",
  "Family and Home",
  "Civic Education and Responsibilities",
  "Mentorship and Individual Development",
  "Discoveries and Inventions",
  "Culture and Tradition",
  "Real Estate and Physical Development",
  "Information Technology",
  "General and Basic Knowledge",
] as const;

// Pre-set level tiers with default stake/winning values
export const PRESET_LEVEL_TIERS = [
  { name: "Beginner Level", defaultStake: 200, defaultWinning: 1000 },
  { name: "Starter Level", defaultStake: 500, defaultWinning: 1500 },
  { name: "Standard Level", defaultStake: 1000, defaultWinning: 3000 },
  { name: "Business Level", defaultStake: 2000, defaultWinning: 6000 },
  { name: "Professional Level", defaultStake: 3000, defaultWinning: 9000 },
  { name: "Enterprise Level", defaultStake: 5000, defaultWinning: 15000 },
  { name: "Entrepreneur Level", defaultStake: 10000, defaultWinning: 30000 },
  { name: "Deluxe Package", defaultStake: 20000, defaultWinning: 60000 },
  { name: "Deluxe Gold Package", defaultStake: 30000, defaultWinning: 150000 },
  { name: "Deluxe Super", defaultStake: 50000, defaultWinning: 200000 },
  { name: "Deluxe Super Plus", defaultStake: 100000, defaultWinning: 500000 },
  { name: "Millionaire Suite", defaultStake: 200000, defaultWinning: 1000000 },
  { name: "Millionaire Suite Plus", defaultStake: 500000, defaultWinning: 5000000 },
] as const;

export interface QuizLevelEntry {
  id: string;
  category: string;
  levelName: string;
  stakeAmount: number;
  winningAmount: number;
  isActive: boolean;
  isPreset: boolean;
  createdAt: string;
}

// Generate pre-populated quiz level entries for all category/level combinations
function generatePresetEntries(): QuizLevelEntry[] {
  const entries: QuizLevelEntry[] = [];
  let counter = 1;

  for (const category of PRESET_QUIZ_CATEGORIES) {
    for (const tier of PRESET_LEVEL_TIERS) {
      entries.push({
        id: `preset-${counter++}`,
        category,
        levelName: tier.name,
        stakeAmount: tier.defaultStake,
        winningAmount: tier.defaultWinning,
        isActive: true,
        isPreset: true,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return entries;
}

export const DEFAULT_QUIZ_LEVELS: QuizLevelEntry[] = generatePresetEntries();
