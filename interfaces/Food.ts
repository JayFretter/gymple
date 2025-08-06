export interface Food {
  id: string;
  name: string;
  protein100g: number;
  carbs100g: number;
  fats100g: number;
  calories100g: number;
  servingSizeInGrams?: number;
  gramsUsed: number;
}