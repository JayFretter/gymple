export interface Food {
  id: string;
  name: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  servingSizeInGrams?: number;
  gramsUsed: number;
}