import * as builder from "botbuilder";

import {getResponse} from "../responses/generalResponses";

export const intent = "intent.question.general";
export const resolver: builder.IDialogWaterfallStep[] = [
    (session) => {
        session.send(getResponse("questionGeneral"));
    }
];
