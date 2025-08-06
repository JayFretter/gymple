import { FoodNutritionInfo } from "@/interfaces/FoodNutritionInfo";

export default function useGetNutritionInfo() {
  const getNutritionFromBarcode = async (barcode: string): Promise<FoodNutritionInfo | null> => {
    try {
      const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}?product_type=food&fields=nutriments,product_name`);
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      const product = data.product;

      return {
        name: product.product_name || 'Unknown Product',
        serving_size: "100g",
        calories: product.nutriments?.['energy-kcal'] || 0,
        protein: product.nutriments?.proteins || 0,
        carbs: product.nutriments?.carbohydrates || 0,
        fats: product.nutriments?.fat || 0,
      }
    } catch (error) {
      console.error("Error fetching nutrition info:", error);
      throw error;
    }
  }

  return { getNutritionFromBarcode };
}