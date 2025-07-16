import GoalDefinition from "@/interfaces/GoalDefinition"
import UserPreferences from "@/interfaces/UserPreferences";
import { storage } from "@/storage"
import baseUserPreferences from '@/default_data/user_preferences.json'

export default function useUserPreferences() {
    const getUserPreferences = () : UserPreferences => {
        const existingPreferencesString = storage.getString('data_user_preferences');

        if (!existingPreferencesString) {
            storage.set('data_user_preferences', JSON.stringify(baseUserPreferences));
            return baseUserPreferences as UserPreferences;
        }

        return JSON.parse(existingPreferencesString);
    }

    return [getUserPreferences];
}