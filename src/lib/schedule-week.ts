export function scheduleWeek(today: Date): Date[] {
  return Array.from({ length: 7 }, (_, offset) => {
    const day = new Date(today);
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() + offset);
    return day;
  });
}

const pad = (n: number) => String(n).padStart(2, "0");

// Builds the schedule feed URL for a specific calendar day via the `now`
// parameter, so each day of the week returns real feed entries instead of
// only the first 48 rows after the current time. The request time is pulled
// back 12 hours from local midnight so the whole local day is covered even
// when the station's timezone differs from the listener's.
export function scheduleApiForDay(api: string, day: Date): string {
  const start = new Date(day);
  start.setHours(0, 0, 0, 0);
  start.setHours(start.getHours() - 12);
  const stamp = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}T${pad(start.getHours())}:${pad(start.getMinutes())}:${pad(start.getSeconds())}`;
  return `${api}${api.includes("?") ? "&" : "?"}now=${stamp}`;
}

const isSameLocalDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// Keeps only feed entries that start on the given local calendar day, so
// per-day requests never duplicate entries across neighbouring days.
export function entriesStartingOnDay<T extends { start: string }>(rows: T[], day: Date): T[] {
  return rows.filter((row) => isSameLocalDay(new Date(row.start), day));
}