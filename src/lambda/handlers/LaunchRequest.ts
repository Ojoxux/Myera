import { RequestHandler, HandlerInput } from 'ask-sdk-core';
import { getTodayTrashSchedule } from '../services/trashSchedule';
import { buildTrashSpeechText } from '../services/speech';

export const LaunchRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'LaunchRequest' &&
      !handlerInput.requestEnvelope.request.task
    );
  },
  async handle(handlerInput: HandlerInput) {
    try {
      const timestamp = handlerInput.requestEnvelope.request.timestamp;
      const todaySchedule = await getTodayTrashSchedule(timestamp);
      const today = new Date(timestamp);
      const speechText = buildTrashSpeechText(today, todaySchedule);

      return handlerInput.responseBuilder
        .speak(speechText)
        .withShouldEndSession(true)
        .getResponse();
    } catch (error) {
      console.error('Error:', error);
      const errorText = 'すみません、ゴミ収集情報の取得に失敗しました。';

      return handlerInput.responseBuilder
        .speak(errorText)
        .withShouldEndSession(true)
        .getResponse();
    }
  },
};
