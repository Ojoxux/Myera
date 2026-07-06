import { SkillBuilders } from 'ask-sdk-core';
import { LaunchRequestHandler } from './handlers/LaunchRequest';
import { TodayTrashIntentHandler } from './handlers/TodayTrashIntent';
import { TomorrowTrashIntentHandler } from './handlers/TomorrowTrashIntent';
import { TomorrowTrashTaskHandler } from './handlers/TomorrowTrashTask';

const skill = SkillBuilders.custom()
  .addRequestHandlers(
    TomorrowTrashTaskHandler,
    LaunchRequestHandler,
    TodayTrashIntentHandler,
    TomorrowTrashIntentHandler,
    {
      canHandle(handlerInput) {
        return (
          handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
          (handlerInput.requestEnvelope.request.intent.name ===
            'AMAZON.HelpIntent' ||
            handlerInput.requestEnvelope.request.intent.name ===
              'AMAZON.CancelIntent' ||
            handlerInput.requestEnvelope.request.intent.name ===
              'AMAZON.StopIntent')
        );
      },
      handle(handlerInput) {
        const speechText = 'ご利用ありがとうございました。';
        return handlerInput.responseBuilder
          .speak(speechText)
          .withShouldEndSession(true)
          .getResponse();
      },
    }
  )
  .addRequestInterceptors((handlerInput) => {
    console.log(
      'Request envelope:',
      JSON.stringify(handlerInput.requestEnvelope, null, 2)
    );
  })
  .addErrorHandlers({
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.error('Unhandled error:', error);
      return handlerInput.responseBuilder
        .speak('すみません、ゴミ収集情報の取得に失敗しました。')
        .withShouldEndSession(true)
        .getResponse();
    },
  })
  .create();

export async function handler(event: any, context: any) {
  const response = await skill.invoke(event, context);
  console.log('Response envelope:', JSON.stringify(response, null, 2));
  return response;
}
