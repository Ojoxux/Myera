import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { addDays } from '../utils/date';
import { getTomorrowTrashSchedule } from '../services/trashSchedule';
import { buildTrashSpeechText } from '../services/speech';

export const TOMORROW_TRASH_TASK_NAME = 'TellTomorrowTrashSchedule';

function isTomorrowTrashTaskName(taskName?: string): boolean {
  return (
    taskName === TOMORROW_TRASH_TASK_NAME ||
    taskName?.endsWith(`.${TOMORROW_TRASH_TASK_NAME}`) === true
  );
}

export const TomorrowTrashTaskHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return (
      request.type === 'LaunchRequest' &&
      isTomorrowTrashTaskName(request.task?.name) &&
      request.task?.version === '1'
    );
  },
  async handle(handlerInput: HandlerInput) {
    try {
      const timestamp = handlerInput.requestEnvelope.request.timestamp;
      const targetDate = addDays(new Date(timestamp), 1);
      const tomorrowSchedule = await getTomorrowTrashSchedule(timestamp);
      const speechText = buildTrashSpeechText(
        targetDate,
        tomorrowSchedule,
        '明日のゴミ収集予定です'
      );

      return handlerInput.responseBuilder
        .speak(speechText)
        .addDirective({
          type: 'Tasks.CompleteTask',
          status: {
            code: '200',
            message: 'OK',
          },
          result: {
            speechText,
            schedule: tomorrowSchedule,
            targetDate: targetDate.toISOString(),
          },
        } as any)
        .withShouldEndSession(true)
        .getResponse();
    } catch (error) {
      console.error('Error:', error);
      const errorText = 'すみません、明日のゴミ収集情報の取得に失敗しました。';

      return handlerInput.responseBuilder
        .speak(errorText)
        .addDirective({
          type: 'Tasks.CompleteTask',
          status: {
            code: '500',
            message: 'Failed to fetch tomorrow trash schedule',
          },
          result: {
            speechText: errorText,
          },
        } as any)
        .withShouldEndSession(true)
        .getResponse();
    }
  },
};
