import { RequestHandler, HandlerInput } from 'ask-sdk-core';
import { addDays } from '../utils/date';
import { getTomorrowTrashSchedule } from '../services/trashSchedule';
import { buildTrashSpeechText } from '../services/speech';

export const TomorrowTrashIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'TomorrowTrashIntent'
    );
  },
  async handle(handlerInput: HandlerInput) {
    try {
      const timestamp = handlerInput.requestEnvelope.request.timestamp;
      const tomorrowSchedule = await getTomorrowTrashSchedule(timestamp);
      const tomorrow = addDays(new Date(timestamp), 1);
      const speechText = buildTrashSpeechText(
        tomorrow,
        tomorrowSchedule,
        '明日のゴミ収集予定です'
      );

      return handlerInput.responseBuilder
        .speak(speechText)
        .withShouldEndSession(true)
        .getResponse();
    } catch (error) {
      console.error('Error:', error);
      const errorText = 'すみません、明日のゴミ収集情報の取得に失敗しました。';

      return handlerInput.responseBuilder
        .speak(errorText)
        .withShouldEndSession(true)
        .getResponse();
    }
  },
};
