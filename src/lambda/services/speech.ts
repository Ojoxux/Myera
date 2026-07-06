import { formatJapaneseDate } from '../utils/date';

const NO_COLLECTION_TEXT = '収集予定のゴミはありません';

export function buildTrashSpeechText(
  targetDate: Date,
  scheduleText: string,
  label = ''
): string {
  const dateStr = formatJapaneseDate(targetDate);
  const prefix = label ? `${label}、` : '';

  if (
    !scheduleText ||
    scheduleText === '情報の取得に失敗しました' ||
    scheduleText === 'ゴミ収集情報の取得に失敗しました'
  ) {
    return `${prefix}${dateStr}のゴミ収集情報の取得に失敗しました。`;
  }

  if (scheduleText === NO_COLLECTION_TEXT) {
    return `${prefix}${dateStr}は収集予定がありません。`;
  }

  return `${prefix}${dateStr}の収集は${scheduleText}です。午前8時までに出してください。`;
}
