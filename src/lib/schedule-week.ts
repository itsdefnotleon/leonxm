export function scheduleWeek(today: Date): Date[] {
  return Array.from({ length: 7 }, (_, offset) => {
    const day = new Date(today);
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() + offset);
    return day;
  });
}