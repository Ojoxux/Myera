import { DayOfWeek } from '../types';

const DEFAULT_TIME_ZONE = 'Asia/Tokyo';

export function getTimeZone(): string {
  return process.env.TIME_ZONE || process.env.TZ || DEFAULT_TIME_ZONE;
}

function getDateParts(
  date: Date,
  timeZone = getTimeZone()
): { day: number; month: number; weekday: string } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    day: 'numeric',
    month: 'numeric',
    weekday: 'long',
  });

  const parts = formatter.formatToParts(date);
  const day = Number(parts.find((part) => part.type === 'day')?.value);
  const month = Number(parts.find((part) => part.type === 'month')?.value);
  const weekday = parts
    .find((part) => part.type === 'weekday')
    ?.value.toLowerCase();

  if (!day || !month || !weekday) {
    throw new Error(`Failed to resolve date parts for time zone: ${timeZone}`);
  }

  return { day, month, weekday };
}

export function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

export function getCurrentDayOfWeek(
  date: Date = new Date(),
  timeZone = getTimeZone()
): DayOfWeek {
  const daysOfWeek: DayOfWeek[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  const { weekday } = getDateParts(date, timeZone);
  const dayOfWeek = daysOfWeek.find((day) => day === weekday);

  if (!dayOfWeek) {
    throw new Error(`Unsupported weekday: ${weekday}`);
  }

  return dayOfWeek;
}

export function getWeekNumberOfMonth(
  date: Date = new Date(),
  timeZone = getTimeZone()
): number {
  const { day } = getDateParts(date, timeZone);
  return Math.ceil(day / 7);
}

export function getMonthAndDay(
  date: Date = new Date(),
  timeZone = getTimeZone()
): { month: number; day: number } {
  const { month, day } = getDateParts(date, timeZone);
  return { month, day };
}

export function formatJapaneseDate(
  date: Date,
  timeZone = getTimeZone()
): string {
  return date.toLocaleDateString('ja-JP', {
    timeZone,
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}
