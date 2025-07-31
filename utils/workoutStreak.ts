import { format, subDays, isSameDay } from 'date-fns';
import { storage } from '@/storage';

export type StreakDayType = 'workout' | 'rest';
export interface StreakDay {
  date: string; // yyyy-MM-dd
  type: StreakDayType | null; // null for no entry
}

const STREAK_KEY = 'workout_streak_days';
const STREAK_LENGTH = 7;
const DATE_FORMAT = 'yyyy-MM-dd';

export function getTodayString(): string {
  return format(new Date(), DATE_FORMAT);
}

export function getYesterdayString(): string {
  return format(subDays(new Date(), 1), DATE_FORMAT);
}

export function loadStreak(): StreakDay[] {
  const raw = storage.getString(STREAK_KEY);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as StreakDay[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveStreak(streak: StreakDay[]) {
  storage.set(STREAK_KEY, JSON.stringify(streak));
}

export function addStreakDay(type: StreakDayType) {
  const today = getTodayString();
  let streak = loadStreak();
  if (streak.some(day => day.date === today && day.type === 'workout')) {
    // If today is already logged as a workout, do nothing
    return;
  }
  streak = streak.filter(day => day.date !== today);
  streak.push({ date: today, type });
  saveStreak(streak);
}

export function resetStreak() {
  saveStreak([]);
}

export function getStreakChartDays(): StreakDay[] {
  const streak = loadStreak();
  const days = [];
  for (let i = STREAK_LENGTH - 1; i >= 0; i--) {
    const date = format(subDays(new Date(), i), DATE_FORMAT);
    const found = streak.find(day => day.date === date);
    days.push(found ? found : { date, type: null });
  }
  return days;
}

export function getTotalStreakDays(): number {
  const streak = loadStreak();
  return streak.length;
}

export function validateAndResetStreakIfNeeded() {
  const streak = loadStreak();
  if (streak.length === 0) return;
  const today = getTodayString();
  const last = streak[streak.length - 1];

  // If the last entry is not yesterday and not today, reset the streak
  if (!isSameDay(new Date(last.date), subDays(new Date(), 1)) && last.date !== today) {
    resetStreak();
  }
}
