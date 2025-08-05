import { storage } from "@/storage";
import { UserStats } from "@/interfaces/UserStats";

const USER_STATS_KEY = "data_user_stats";

export default function useUserStats() {
  const fetchUserStats = (): UserStats => {
    const statsString = storage.getString(USER_STATS_KEY);
    if (!statsString) {
      const defaultStats: UserStats = { totalVolumeInKg: 132750 };
      storage.set(USER_STATS_KEY, JSON.stringify(defaultStats));
      return defaultStats;
    }
    return JSON.parse(statsString) as UserStats;
  };

  const setUserStats = (stats: UserStats): void => {
    storage.set(USER_STATS_KEY, JSON.stringify(stats));
  };

  return { fetchUserStats, setUserStats };
}
