// Mock data for Food for Home Quiz Game

export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  marketPrice: number; // in Mobi
  image: string;
  unit: string;
}

export const mockGroceryItems: GroceryItem[] = [
  { id: "g1", name: "Rice (50kg)", category: "Grains", marketPrice: 85000, image: "🍚", unit: "bag" },
  { id: "g2", name: "Beans (25kg)", category: "Grains", marketPrice: 45000, image: "🫘", unit: "bag" },
  { id: "g3", name: "Palm Oil (25L)", category: "Oils", marketPrice: 35000, image: "🫒", unit: "keg" },
  { id: "g4", name: "Groundnut Oil (5L)", category: "Oils", marketPrice: 12000, image: "🥜", unit: "bottle" },
  { id: "g5", name: "Garri (25kg)", category: "Grains", marketPrice: 20000, image: "🌽", unit: "bag" },
  { id: "g6", name: "Sugar (10kg)", category: "Sweeteners", marketPrice: 15000, image: "🧂", unit: "bag" },
  { id: "g7", name: "Tomato Paste (Carton)", category: "Canned", marketPrice: 18000, image: "🍅", unit: "carton" },
  { id: "g8", name: "Spaghetti (Carton)", category: "Pasta", marketPrice: 10000, image: "🍝", unit: "carton" },
  { id: "g9", name: "Milk (Peak - Carton)", category: "Dairy", marketPrice: 16000, image: "🥛", unit: "carton" },
  { id: "g10", name: "Semovita (10kg)", category: "Flour", marketPrice: 12000, image: "🫓", unit: "bag" },
  { id: "g11", name: "Chicken (Whole - 2 pcs)", category: "Protein", marketPrice: 14000, image: "🍗", unit: "pack" },
  { id: "g12", name: "Fresh Fish (Assorted)", category: "Protein", marketPrice: 20000, image: "🐟", unit: "basket" },
  { id: "g13", name: "Seasoning (Maggi Carton)", category: "Seasoning", marketPrice: 8000, image: "🧄", unit: "carton" },
  { id: "g14", name: "Bread (Sliced - 5 loaves)", category: "Bakery", marketPrice: 5000, image: "🍞", unit: "pack" },
  { id: "g15", name: "Eggs (1 Crate)", category: "Protein", marketPrice: 4500, image: "🥚", unit: "crate" },
];

export const FOOD_QUIZ_STAKE_PERCENTAGE = 0.20; // 20% of total item value
export const FOOD_QUIZ_BONUS_STAKE_MULTIPLIER = 0.50; // 50% extra for bonus
export const FOOD_QUIZ_BONUS_QUESTIONS_COUNT = 4;
export const FOOD_QUIZ_BONUS_TIMEOUT_SECONDS = 30;
export const FOOD_QUIZ_QUESTIONS_TOTAL = 15;
export const FOOD_QUIZ_OBJECTIVE_COUNT = 10;
export const FOOD_QUIZ_NON_OBJECTIVE_COUNT = 5;
