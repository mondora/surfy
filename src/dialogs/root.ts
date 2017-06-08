import * as builder from "botbuilder";

import {LUIS_RECOGNIZER_URLS} from "../config";
import {getResponse} from "../responses/generalResponses";
import loadIntentResolvers from "../utils/loadIntentResolvers";

const recognizers = LUIS_RECOGNIZER_URLS.map(url => new builder.LuisRecognizer(url));

export const path = "/";
export const dialog = new builder.IntentDialog({recognizers})
    .onDefault([
        (session) => {
            session.send(getResponse("none"));
        }
    ]);

// Register intents
loadIntentResolvers().forEach(intentResolver => {
    dialog.matches(intentResolver.intent, intentResolver.resolver);
});
