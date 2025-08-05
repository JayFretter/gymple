export interface Meal {
  id: string;
  title: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  timestamp: number; // Unix timestamp
}