export function getStartOfDayTimestamp(timestamp: number): number {
  const now = new Date(timestamp);
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

export function getEndOfDayTimestamp(timestamp: number): number {
  const now = new Date(timestamp);
  now.setHours(23, 59, 59, 999);
  return now.getTime();
}