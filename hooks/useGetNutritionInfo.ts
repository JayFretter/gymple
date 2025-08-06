import { Food } from "@/interfaces/Food";
import { FoodNutritionInfo } from "@/interfaces/FoodNutritionInfo";
import { titleCase } from "@/utils/string-utils";

export default function useGetNutritionInfo() {
  const getNutritionFromBarcode = async (barcode: string): Promise<Food | null> => {
    try {
      const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}?product_type=food&fields=nutriments,product_name`);
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      const product = data.product;

      // console.log("Fetched nutrition info:", product);

      return {
        id: barcode,
        name: product.product_name ? titleCase(product.product_name) : 'Unknown Product',
        // serving_size: "100g",
        calories: Math.round(product.nutriments?.['energy-kcal'] || 0),
        protein: Math.round(product.nutriments?.proteins || 0),
        carbs: Math.round(product.nutriments?.carbohydrates || 0),
        fats: Math.round(product.nutriments?.fat || 0),
        gramsUsed: 100
      }
    } catch (error) {
      console.error("Error fetching nutrition info:", error);
      throw error;
    }
  }

  return { getNutritionFromBarcode };
}