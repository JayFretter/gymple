import { Food } from "./Food";

export interface SavedMeal {
  id: string;
  title: string;
  foods: Food[];
  isFavourite: boolean;
}