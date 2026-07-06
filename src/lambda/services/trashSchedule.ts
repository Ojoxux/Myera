import {
  addDays,
  getCurrentDayOfWeek,
  getMonthAndDay,
  getTimeZone,
  getWeekNumberOfMonth,
} from '../utils/date';
import { DayOfWeek, TrashScheduleData, TrashScheduleRule } from '../types';

const NO_COLLECTION_TEXT = '収集予定のゴミはありません';

function parseScheduleDataFromEnv(): TrashScheduleData | null {
  const encodedScheduleJson = process.env.TRASH_SCHEDULE_JSON_BASE64;
  const rawScheduleJson = process.env.TRASH_SCHEDULE_JSON;

  if (!encodedScheduleJson && !rawScheduleJson) {
    return null;
  }

  try {
    const jsonText = encodedScheduleJson
      ? Buffer.from(encodedScheduleJson, 'base64').toString('utf8')
      : rawScheduleJson || '';

    return JSON.parse(jsonText) as TrashScheduleData;
  } catch (error) {
    console.error('Failed to parse trash schedule data from environment');
    console.error(error);
    return null;
  }
}

function getScheduleData(): TrashScheduleData {
  return (
    parseScheduleDataFromEnv() || {
      defaultCalendarCode: process.env.TRASH_CALENDAR_CODE || 'default',
      calendars: {},
    }
  );
}

function getCalendarCode(scheduleData: TrashScheduleData): string {
  return process.env.TRASH_CALENDAR_CODE || scheduleData.defaultCalendarCode;
}

function isRuleForDate(
  rule: TrashScheduleRule,
  dayOfWeek: DayOfWeek,
  weekNumber: number,
  month: number
): boolean {
  if (rule.excludeMonths?.includes(month)) {
    return false;
  }

  if (!rule.days.includes(dayOfWeek)) {
    return false;
  }

  if (rule.type === 'weekly') {
    return true;
  }

  return rule.weeks?.includes(weekNumber) === true;
}

function getSpecialCollectionTypes(month: number, day: number): string[] | null {
  if (month === 1 && day >= 1 && day <= 3) {
    return [];
  }

  if (month === 12 && day === 31) {
    return ['燃やすごみ'];
  }

  return null;
}

export async function getTrashScheduleForDate(
  date: Date = new Date(),
  timeZone = getTimeZone()
): Promise<string> {
  const startTime = Date.now();
  console.log('Function getTrashScheduleForDate started');

  try {
    const dayOfWeek = getCurrentDayOfWeek(date, timeZone);
    console.log('Target day of week:', dayOfWeek);

    const weekNumber = getWeekNumberOfMonth(date, timeZone);
    console.log('Week number of month:', weekNumber);

    const { month, day } = getMonthAndDay(date, timeZone);
    const specialCollectionTypes = getSpecialCollectionTypes(month, day);

    if (specialCollectionTypes) {
      return specialCollectionTypes.length > 0
        ? specialCollectionTypes.join('と')
        : NO_COLLECTION_TEXT;
    }

    const scheduleData = getScheduleData();
    const calendarCode = getCalendarCode(scheduleData);
    const calendar = scheduleData.calendars[calendarCode];

    if (!calendar) {
      console.error(`Trash calendar not found: ${calendarCode}`);
      return '情報の取得に失敗しました';
    }

    const trashTypes = calendar.rules
      .filter((rule) => isRuleForDate(rule, dayOfWeek, weekNumber, month))
      .map((rule) => rule.name);

    if (trashTypes.length === 0) {
      return NO_COLLECTION_TEXT;
    }

    const result = trashTypes.join('と');
    console.log('Returning result:', result);

    const endTime = Date.now();
    console.log(`Function execution time: ${endTime - startTime}ms`);
    return result;
  } catch (error) {
    const endTime = Date.now();
    console.error(`Error execution time: ${endTime - startTime}ms`);
    console.error('Unexpected error:', JSON.stringify(error, null, 2));
    return 'ゴミ収集情報の取得に失敗しました';
  }
}

export async function getTodayTrashSchedule(
  timestamp?: string
): Promise<string> {
  const date = timestamp ? new Date(timestamp) : new Date();
  return getTrashScheduleForDate(date);
}

export async function getTomorrowTrashSchedule(
  timestamp?: string
): Promise<string> {
  const date = timestamp ? new Date(timestamp) : new Date();
  return getTrashScheduleForDate(addDays(date, 1));
}
