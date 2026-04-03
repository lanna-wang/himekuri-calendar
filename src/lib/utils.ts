export const STAR_COLORS = [
  "#f0c6c6", // pink
  "#c6d4f0", // lavender
  "#c6f0d4", // mint
  "#f0e8c6", // butter
  "#f0d4c6", // peach
] as const;

export const MONTH_COLORS: Record<number, string> = {
  0: "#f0c6c6",  // jan - pink
  1: "#c6d4f0",  // feb - lavender
  2: "#c6f0d4",  // mar - mint
  3: "#f0e8c6",  // apr - butter
  4: "#f0d4c6",  // may - peach
  5: "#f0c6c6",  // jun - pink
  6: "#c6d4f0",  // jul - lavender
  7: "#c6f0d4",  // aug - mint
  8: "#f0e8c6",  // sep - butter
  9: "#f0d4c6",  // oct - peach
  10: "#c6d4f0", // nov - lavender
  11: "#f0c6c6", // dec - pink
};

export function getStarColor(date: Date): string {
  return MONTH_COLORS[date.getMonth()];
}

export function getRandomStarColor(): string {
  return STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
}

const MONTHS_SHORT = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const DAYS_SHORT = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const MONTHS_FULL = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

export function formatMonthShort(date: Date): string {
  return MONTHS_SHORT[date.getMonth()];
}

export function formatMonthFull(month: number): string {
  return MONTHS_FULL[month];
}

export function formatDayShort(date: Date): string {
  return DAYS_SHORT[date.getDay()];
}

export function formatDayNumber(date: Date): number {
  return date.getDate();
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "good morning";
  if (hour < 17) return "good afternoon";
  return "good evening";
}

export function getWeekDates(referenceDate: Date): Date[] {
  const dates: Date[] = [];
  const day = referenceDate.getDay(); // 0=Sun
  const sunday = new Date(referenceDate);
  sunday.setDate(referenceDate.getDate() - day);

  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isBeforeDay(a: Date, b: Date): boolean {
  const aOnly = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bOnly = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return aOnly < bOnly;
}

export function dateToKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
