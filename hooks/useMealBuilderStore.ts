import { Food } from '@/interfaces/Food';
import { create } from 'zustand';

interface MealBuilderState {
    id: string;
    setId: (id: string) => void;
    name: string;
    setName: (name: string) => void;
    foods: Food[];
    setFoods: (foods: Food[]) => void;
    addFood: (food: Food) => void;
    upsertFood: (food: Food) => void;
    removeFood: (foodId: string) => void;
    clearAll: () => void;
}

const useMealBuilderStore = create<MealBuilderState>((set) => ({
    id: '',
    setId: (id) => set({ id }),
    name: '',
    setName: (name) => set({ name }),
    foods: [],
    setFoods: (foods) => set({ foods }),
    addFood: (food) => set((state) => ({ foods: [...state.foods, food] })),
    upsertFood: (food) => set((state) => ({
        foods: [
            ...state.foods.filter(f => f.id !== food.id),
            food
        ]
    })),
    removeFood: (foodId) => set((state) => ({ foods: state.foods.filter(f => f.id !== foodId) })),
    clearAll: () => set({ foods: [], name: '', id: '' }),
}))

export default useMealBuilderStore;