export type DayOfWeek =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export interface TrashScheduleRule {
  name: string;
  type: 'weekly' | 'monthly';
  days: DayOfWeek[];
  weeks?: number[];
  excludeMonths?: number[];
}

export interface TrashCalendar {
  code: string;
  area: string;
  collectionTime: string;
  sourceUrl: string;
  rules: TrashScheduleRule[];
}

export interface TrashScheduleData {
  defaultCalendarCode: string;
  calendars: Record<string, TrashCalendar>;
}
